"use strict";

var History = null;
var recalcSlideInterval = 30;
function CPresentation(DrawingDocument)
{
    this.History = new CHistory(this);
    History = this.History;

    // Создаем глобальные объекты, необходимые для совместного редактирования

    g_oTableId = new CTableId();

    //------------------------------------------------------------------------

    this.Id = g_oIdCounter.Get_NewId();

    this.StartPage = 0; // Для совместимости с CDocumentContent
    this.CurPage   = 0;

    this.Orientation = orientation_Portrait; // ориентация страницы

    // Сначала настраиваем размеры страницы и поля
    this.slidesToUnlock = [];


    this.TurnOffRecalc = false;

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

    this.DefaultSlideTiming = new CAscSlideTiming();
    this.DefaultSlideTiming.setDefaultParams();
    // Добавляем данный класс в таблицу Id (обязательно в конце конструктора)
    g_oTableId.Add( this, this.Id );
   //
   this.themeLock = new PropLocker(this.Id);
   this.schemeLock = new PropLocker(this.Id);
   this.slideSizeLock = new PropLocker(this.Id);

    this.CommentAuthors = {};
    this.createDefaultTableStyles();
    this.bGoToPage = false;
}

CPresentation.prototype =
{
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
    // Проводим начальные действия, исходя из Документа
    Init : function()
    {

    },

    addSlideMaster: function(pos, master)
    {
        History.Add(this, {Type: historyitem_Presentation_AddSlideMaster, pos: pos, master: master});
        this.slideMasters.splice(pos, 0, master);
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


    GetRecalculateMaps: function()
    {
        var ret = {
            layouts: {},
            masters: {}
        };

        for(var i = 0; i < this.Slides.length; ++i)
        {
            ret.layouts[this.Slides[i].Layout.Id] = this.Slides[i].Layout;
            ret.masters[this.Slides[i].Layout.Master.Id] = this.Slides[i].Layout.Master;
        }
        return ret;
    },


    Recalculate : function(RecalcData)
    {
        var _RecalcData = RecalcData ? RecalcData : History.Get_RecalcData(), key, recalcMap, bSync = true;
        if(_RecalcData.Drawings.All || _RecalcData.Drawings.ThemeInfo)
        {
            recalcMap = this.GetRecalculateMaps();
            for(key in recalcMap.masters)
            {
                if(recalcMap.masters.hasOwnProperty(key))
                {
                    recalcMap.masters[key].recalculate();
                }
            }
            for(key in recalcMap.layouts)
            {
                if(recalcMap.layouts.hasOwnProperty(key))
                {
                    recalcMap.layouts[key].recalculate();
                }
            }
            if(_RecalcData.Drawings.ThemeInfo)
            {
                this.clearThemeTimeouts();
                var startRecalcIndex = _RecalcData.Drawings.ThemeInfo.ArrInd.indexOf(this.CurPage);
                if(startRecalcIndex === -1)
                {
                    startRecalcIndex = 0;
                }
                var oThis = this;
                bSync = false;
                redrawSlide(oThis.Slides[_RecalcData.Drawings.ThemeInfo.ArrInd[startRecalcIndex]], oThis, _RecalcData.Drawings.ThemeInfo.ArrInd, startRecalcIndex,  0, oThis.Slides);
            }
            else
            {
                for(key = 0; key < this.Slides.length; ++key)
                {
                    this.Slides[key].recalculate()
                }
            }
        }
        else
        {
            for(key in _RecalcData.Drawings.Map)
            {
                if(_RecalcData.Drawings.Map.hasOwnProperty(key))
                {
                    _RecalcData.Drawings.Map[key].recalculate();
                }
            }
        }
        History.Reset_RecalcIndex();

        this.updateSlideIndexes();
        this.RecalculateCurPos();
        if(bSync)
        {
            for(var i = 0; i < this.Slides.length; ++i)
            {
                this.DrawingDocument.OnRecalculatePage(i, this.Slides[i]);
            }
            this.DrawingDocument.OnEndRecalculate();
        }
        if(!this.Slides[this.CurPage])
        {
            this.DrawingDocument.m_oWordControl.GoToPage(this.Slides.length - 1);

            //this.Set_CurPage(this.Slides.length - 1);
        }
        else
        {
            if(this.bGoToPage)
            {
                this.DrawingDocument.m_oWordControl.GoToPage(this.CurPage);
                this.bGoToPage = false;
            }
        }
        if(this.Slides[this.CurPage])
            this.Slides[this.CurPage].graphicObjects.updateSelectionState();
        for(var i = 0; i < this.slidesToUnlock.length; ++i)
        {
            this.DrawingDocument.UnLockSlide(this.slidesToUnlock[i]);
        }
        this.slidesToUnlock.length = 0;
    },

    updateSlideIndexes: function()
    {
        for(var i = 0; i < this.Slides.length; ++i)
        {
            this.Slides[i].changeNum(i);
        }
    },

    GenerateThumbnails : function(_drawerThemes, _drawerLayouts)
    {
        var _masters = this.slideMasters;
        var _len = _masters.length;
        for (var i = 0; i < _len; i++)
        {
            _masters[i].ImageBase64 = _drawerThemes.GetThumbnail(_masters[i]);
        }

        var _layouts = this.slideLayouts;
        _len = _layouts.length;
        for (var i = 0; i < _len; i++)
        {
            _layouts[i].ImageBase64 = _drawerLayouts.GetThumbnail(_layouts[i]);
            _layouts[i].Width64 = _drawerLayouts.WidthPx;
            _layouts[i].Height64 = _drawerLayouts.HeightPx;
        }
    },

    Stop_Recalculate : function()
    {
        this.DrawingDocument.OnStartRecalculate( 0 );
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
        if(this.Slides[this.CurPage])
            this.Slides[this.CurPage].graphicObjects.recalculateCurPos();
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
        this.Slides[nPageIndex] && this.Slides[nPageIndex].draw(pGraphics);
    },

    Add_NewParagraph : function(bRecalculate)
    {
        this.Slides[this.CurPage] && this.Slides[this.CurPage].graphicObjects.checkSelectedObjectsAndCallback(this.Slides[this.CurPage].graphicObjects.addNewParagraph, []);
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
                search_select_data = this.Slides[slide_num].graphicObjects.startSearchText(text, scanForward);
                if(search_select_data != null)
                {
                    this.DrawingDocument.m_oWordControl.GoToPage(slide_num);
                    this.Slides[slide_num].graphicObjects.setSelectionState(search_select_data);
                    this.Document_UpdateSelectionState();
                    return true;
                }
            }
            for(slide_num = 0; slide_num <= this.CurPage; ++slide_num)
            {
                search_select_data = this.Slides[slide_num].graphicObjects.startSearchText(text, scanForward, true);
                if(search_select_data != null)
                {
                    this.DrawingDocument.m_oWordControl.GoToPage(slide_num);
                    this.Slides[slide_num].graphicObjects.setSelectionState(search_select_data);
                    this.Document_UpdateSelectionState();
                    return true;
                }
            }
        }
        else
        {
            for(slide_num = this.CurPage; slide_num > -1; --slide_num)
            {
                search_select_data = this.Slides[slide_num].graphicObjects.startSearchText(text, scanForward);
                if(search_select_data != null)
                {
                    this.DrawingDocument.m_oWordControl.GoToPage(slide_num);
                    this.Slides[slide_num].graphicObjects.setSelectionState(search_select_data);
                    this.Document_UpdateSelectionState();
                    return true;
                }
            }
            for(slide_num = this.Slides.length - 1; slide_num >= this.CurPage; --slide_num)
            {
                search_select_data = this.Slides[slide_num].graphicObjects.startSearchText(text, scanForward, true);
                if(search_select_data != null)
                {
                    this.DrawingDocument.m_oWordControl.GoToPage(slide_num);
                    this.Slides[slide_num].graphicObjects.setSelectionState(search_select_data);
                    this.Document_UpdateSelectionState();
                    return true;
                }
            }
        }

        return false;
    },

    groupShapes: function()
    {
        this.Slides[this.CurPage] && this.Slides[this.CurPage].graphicObjects.checkSelectedObjectsAndCallback(this.Slides[this.CurPage].graphicObjects.createGroup, []);
    },

    unGroupShapes: function()
    {
        this.Slides[this.CurPage] && this.Slides[this.CurPage].graphicObjects.checkSelectedObjectsAndCallback(this.Slides[this.CurPage].graphicObjects.unGroupCallback, []);
    },

    Add_FlowImage : function(W, H, Img)
    {
        if(this.Slides[this.CurPage])
        {
            History.Create_NewPoint();
            var Image = this.Slides[this.CurPage].graphicObjects.createImage(Img, (this.Slides[this.CurPage].Width - W)/2, (this.Slides[this.CurPage].Height - H)/2, W, H);
            Image.setParent(this.Slides[this.CurPage]);
            Image.addToDrawingObjects();
            this.Slides[this.CurPage].graphicObjects.resetSelection();
            this.Slides[this.CurPage].graphicObjects.selectObject(Image, this.Slides[this.CurPage].num);
            this.Recalculate();
        }
    },

    addChart: function(binary)
    {
        var _this = this;
        _this.Slides[_this.CurPage] && _this.Slides[_this.CurPage].graphicObjects.checkSelectedObjectsAndCallback(function()
        {
            var Image = _this.Slides[_this.CurPage].graphicObjects.getChartSpace2(binary, null);
            Image.setParent(_this.Slides[_this.CurPage]);
            Image.addToDrawingObjects();
            Image.spPr.xfrm.setOffX((_this.Slides[_this.CurPage].Width - Image.spPr.xfrm.extX)/2);
            Image.spPr.xfrm.setOffY((_this.Slides[_this.CurPage].Height - Image.spPr.xfrm.extY)/2);
            _this.Slides[_this.CurPage].graphicObjects.resetSelection();
            _this.Slides[_this.CurPage].graphicObjects.selectObject(Image, _this.Slides[_this.CurPage].num);
            _this.Recalculate();
        }, []);
    },

    Selection_Remove: function()
    {},

    Edit_Chart : function(binary)
    {
        var _this = this;
        _this.Slides[_this.CurPage] && _this.Slides[_this.CurPage].graphicObjects.checkSelectedObjectsAndCallback(function()
        {
            _this.Slides[_this.CurPage].graphicObjects.editChart(binary);
        }, [binary]);
    },

    Get_ChartObject: function(type)
    {
        return this.Slides[this.CurPage].graphicObjects.getChartObject(type);
    },

    Add_FlowTable : function(Cols, Rows)
    {
        if(!this.Slides[this.CurPage])
            return;
        History.Create_NewPoint();
        var graphic_frame = new CGraphicFrame();
        if(this.Document_Is_SelectionLocked(changestype_AddShape, graphic_frame) === false)
        {

            var W = this.Width*2/3;
            var Grid = [];

            for ( var Index = 0; Index < Cols; Index++ )
                Grid[Index] = W / Cols;

            graphic_frame.setParent(this.Slides[this.CurPage]);
            graphic_frame.setSpPr(new CSpPr());
            graphic_frame.spPr.setParent(graphic_frame);
            graphic_frame.spPr.setXfrm(new CXfrm());
            graphic_frame.spPr.xfrm.setParent(graphic_frame.spPr);
            graphic_frame.spPr.xfrm.setOffX((this.Width - W)/2);
            graphic_frame.spPr.xfrm.setOffX(this.Height/5);
            graphic_frame.spPr.xfrm.setExtX(W);
            graphic_frame.spPr.xfrm.setExtY(7.478268771701388 * Rows);
            graphic_frame.setNvSpPr(new UniNvPr());

            var table = new CTable(this.DrawingDocument, graphic_frame, true, 0, 0, 0, W, 100000, Rows, Cols, Grid);
            table.Set_Inline(true);
            //table.setStyleIndex(0);
            graphic_frame.setGraphicObject(table);
            this.Slides[this.CurPage].graphicObjects.resetSelection();
            this.Slides[this.CurPage].graphicObjects.selectObject(graphic_frame, this.CurPage);
            this.Slides[this.CurPage].addToSpTreeToPos(this.Slides[this.CurPage].cSld.spTree.length, graphic_frame);

            this.Recalculate();
            this.DrawingDocument.OnRecalculatePage(this.CurPage, this.Slides[this.CurPage]);
            this.DrawingDocument.OnEndRecalculate();
        }
        else
        {
            this.Document_Undo();
        }
    },


    Paragraph_Add : function( ParaItem, bRecalculate )
    {
        this.Slides[this.CurPage] && this.Slides[this.CurPage].graphicObjects.checkSelectedObjectsAndCallback(this.Slides[this.CurPage].graphicObjects.paragraphAdd, [ParaItem, bRecalculate]);
    },

    Paragraph_ClearFormatting : function()
    {
        this.Slides[this.CurPage] && this.Slides[this.CurPage].graphicObjects.checkSelectedObjectsAndCallback(this.Slides[this.CurPage].graphicObjects.paragraphClearFormatting, []);
    },

    Remove : function(Count, bOnlyText, bRemoveOnlySelection)
    {
        if(editor.WordControl.Thumbnails.FocusObjType === FOCUS_OBJECT_THUMBNAILS)
        {
            this.deleteSlides(editor.WordControl.Thumbnails.GetSelectedArray());
            return;
        }
        if ( "undefined" === typeof(bRemoveOnlySelection) )
            bRemoveOnlySelection = false;

        if(this.Slides[this.CurPage])
        {
            this.Slides[this.CurPage].graphicObjects.remove(Count, bOnlyText, bRemoveOnlySelection);
        }
    },


    Cursor_MoveToStartPos : function()
    {
        this.Slides[this.CurPage] && this.Slides[this.CurPage].graphicObjects.cursorMoveToStartPos();
        return true;
    },

    Cursor_MoveToEndPos : function()
    {
        this.Slides[this.CurPage] && this.Slides[this.CurPage].graphicObjects.cursorMoveToEndPos();
        return true;
    },

    Cursor_MoveLeft : function(AddToSelect, Word)
    {
        this.Slides[this.CurPage] && this.Slides[this.CurPage].graphicObjects.cursorMoveLeft(AddToSelect, Word);
        return true;
    },

    Cursor_MoveRight : function(AddToSelect, Word)
    {
        this.Slides[this.CurPage] && this.Slides[this.CurPage].graphicObjects.cursorMoveRight(AddToSelect, Word);
        return true;
    },

    Cursor_MoveUp : function(AddToSelect)
    {
        this.Slides[this.CurPage] && this.Slides[this.CurPage].graphicObjects.cursorMoveUp(AddToSelect);

        return true;
    },

    Cursor_MoveDown : function(AddToSelect)
    {
        this.Slides[this.CurPage] && this.Slides[this.CurPage].graphicObjects.cursorMoveDown(AddToSelect);

        return true;
    },

    Cursor_MoveEndOfLine : function(AddToSelect)
    {
        this.Slides[this.CurPage] && this.Slides[this.CurPage].graphicObjects.cursorMoveEndOfLine(AddToSelect);

        return true;
    },

    Cursor_MoveStartOfLine : function(AddToSelect)
    {
        this.Slides[this.CurPage] && this.Slides[this.CurPage].graphicObjects.cursorMoveStartOfLine(AddToSelect);

        return true;
    },

    Cursor_MoveAt : function( X, Y, AddToSelect )
    {
        this.Slides[this.CurPage] && this.Slides[this.CurPage].graphicObjects.cursorMoveAt(X, Y, AddToSelect);

        return true;
    },

    Cursor_MoveToCell : function(bNext)
    {

    },

    Get_PresentationBulletByNumInfo : function(NumInfo)
    {
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
                            bullet.bulletTypeface.typeface = "Arial";
                            break;
                        }
                        case 2:
                        {
                            bulletText = "o";
                            bullet.bulletTypeface = new CBulletTypeface();
                            bullet.bulletTypeface.type = BULLET_TYPE_TYPEFACE_BUFONT;
                            bullet.bulletTypeface.typeface = "Courier New";
                            break;
                        }
                        case 3:
                        {
                            bulletText = "§";
                            bullet.bulletTypeface = new CBulletTypeface();
                            bullet.bulletTypeface.type = BULLET_TYPE_TYPEFACE_BUFONT;
                            bullet.bulletTypeface.typeface = "Wingdings";
                            break;
                        }
                        case 4:
                        {
                            bulletText = String.fromCharCode( 0x0076 );
                            bullet.bulletTypeface = new CBulletTypeface();
                            bullet.bulletTypeface.type = BULLET_TYPE_TYPEFACE_BUFONT;
                            bullet.bulletTypeface.typeface = "Wingdings";
                            break;
                        }
                        case 5:
                        {
                            bulletText = String.fromCharCode( 0x00D8 );
                            bullet.bulletTypeface = new CBulletTypeface();
                            bullet.bulletTypeface.type = BULLET_TYPE_TYPEFACE_BUFONT;
                            bullet.bulletTypeface.typeface = "Wingdings";
                            break;
                        }
                        case 6:
                        {
                            bulletText = String.fromCharCode( 0x00FC );
                            bullet.bulletTypeface = new CBulletTypeface();
                            bullet.bulletTypeface.type = BULLET_TYPE_TYPEFACE_BUFONT;
                            bullet.bulletTypeface.typeface = "Wingdings";
                            break;
                        }
                        case 7:
                        {

                            bulletText = String.fromCharCode(119);
                            bullet.bulletTypeface = new CBulletTypeface();
                            bullet.bulletTypeface.type = BULLET_TYPE_TYPEFACE_BUFONT;
                            bullet.bulletTypeface.typeface = "Wingdings";
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
                    break;
                }
            }
        }
        return bullet;
    },

    Set_ParagraphAlign : function(Align)
    {
        this.Slides[this.CurPage] && this.Slides[this.CurPage].graphicObjects.checkSelectedObjectsAndCallback(this.Slides[this.CurPage].graphicObjects.setParagraphAlign, [Align]);
    },

    Set_ParagraphSpacing : function(Spacing)
    {
        this.Slides[this.CurPage] && this.Slides[this.CurPage].graphicObjects.checkSelectedObjectsAndCallback(this.Slides[this.CurPage].graphicObjects.setParagraphSpacing, [Spacing]);
    },

    Set_ParagraphTabs : function(Tabs)
    {
        this.Slides[this.CurPage] && this.Slides[this.CurPage].graphicObjects.checkSelectedObjectsAndCallback(this.Slides[this.CurPage].graphicObjects.setParagraphTabs, [Tabs]);
    },

    Set_ParagraphIndent : function(Ind)
    {
        this.Slides[this.CurPage] && this.Slides[this.CurPage].graphicObjects.checkSelectedObjectsAndCallback(this.Slides[this.CurPage].graphicObjects.setParagraphIndent, [Ind]);
    },

    Set_ParagraphNumbering : function(NumInfo)
    {
        this.Slides[this.CurPage] && this.Slides[this.CurPage].graphicObjects.checkSelectedObjectsAndCallback(this.Slides[this.CurPage].graphicObjects.setParagraphNumbering, [this.Get_PresentationBulletByNumInfo(NumInfo)]);   //TODO
    },

    Paragraph_IncDecFontSize : function(bIncrease)
    {
        this.Slides[this.CurPage] && this.Slides[this.CurPage].graphicObjects.checkSelectedObjectsAndCallback(this.Slides[this.CurPage].graphicObjects.paragraphIncDecFontSize, [bIncrease]);
    },

    Paragraph_IncDecIndent : function(bIncrease)
    {
        this.Slides[this.CurPage] && this.Slides[this.CurPage].graphicObjects.checkSelectedObjectsAndCallback(this.Slides[this.CurPage].graphicObjects.paragraphIncDecIndent, [bIncrease]);
    },

    Can_IncreaseParagraphLevel : function(bIncrease)
    {
        return isRealObject(this.Slides[this.CurPage]) && this.Slides[this.CurPage].graphicObjects.canIncreaseParagraphLevel(bIncrease);
    },

    Set_ImageProps : function(Props)
    {
        this.Slides[this.CurPage] && this.Slides[this.CurPage].graphicObjects.checkSelectedObjectsAndCallback(this.Slides[this.CurPage].graphicObjects.applyDrawingProps, [Props]);
    },

    ShapeApply: function(shapeProps)
    {

        this.Slides[this.CurPage] && this.Slides[this.CurPage].graphicObjects.checkSelectedObjectsAndCallback(this.Slides[this.CurPage].graphicObjects.applyDrawingProps, [shapeProps]);
    },

    ChartApply: function(chartProps)
    {
        this.Slides[this.CurPage] && this.Slides[this.CurPage].graphicObjects.checkSelectedObjectsAndCallback(this.Slides[this.CurPage].graphicObjects.applyDrawingProps, [chartProps]);
    },

    changeShapeType : function(shapeType)
    {
        this.Slides[this.CurPage] && this.Slides[this.CurPage].graphicObjects.checkSelectedObjectsAndCallback(this.Slides[this.CurPage].graphicObjects.applyDrawingProps, [{type:shapeType}]);
    },

    setVerticalAlign: function(align)
    {
        if(this.Slides[this.CurPage])
        {
            this.Slides[this.CurPage].graphicObjects.checkSelectedObjectsAndCallback(this.Slides[this.CurPage].graphicObjects.applyDrawingProps, [{verticalTextAlign: align}]);
        }
    },

    Get_Styles: function()
    {
        var styles = new CStyles();
        return {styles: styles, lastId: styles.Get_Default_Paragraph()}
    },

    Is_TableCellContent: function()
    {
        return false;
    },


    Get_Theme: function()
    {
        return this.themes[0];
    },

    Get_ColorMap: function()
    {
        return G_O_DEFAULT_COLOR_MAP;
    },

    Get_PageFields: function()
    {
        return { X : 0, Y : 0, XLimit : 2000, YLimit : 2000};
    },

    CheckRange: function()
    {
        return [];
    },


    Is_Cell: function()
    {
        return false;
    },

    Get_PrevElementEndInfo : function(CurElement)
    {
        return null;
    },
    Get_TextBackGroundColor: function()
    {
        return new CDocumentColor(255, 255, 255, false);
    },


    Set_TableProps : function(Props)
    {
        if(Props.CellBorders)
        {
            if(Props.CellBorders.Left && Props.CellBorders.Left.Color)
            {
                Props.CellBorders.Left.unifill = CreteSolidFillRGB(Props.CellBorders.Left.Color.r, Props.CellBorders.Left.Color.g, Props.CellBorders.Left.Color.b)
            }
            if(Props.CellBorders.Top && Props.CellBorders.Top.Color)
            {
                Props.CellBorders.Top.unifill = CreteSolidFillRGB(Props.CellBorders.Top.Color.r, Props.CellBorders.Top.Color.g, Props.CellBorders.Top.Color.b)
            }
            if(Props.CellBorders.Right && Props.CellBorders.Right.Color)
            {
                Props.CellBorders.Right.unifill = CreteSolidFillRGB(Props.CellBorders.Right.Color.r, Props.CellBorders.Right.Color.g, Props.CellBorders.Right.Color.b)
            }
            if(Props.CellBorders.Bottom && Props.CellBorders.Bottom.Color)
            {
                Props.CellBorders.Bottom.unifill = CreteSolidFillRGB(Props.CellBorders.Bottom.Color.r, Props.CellBorders.Bottom.Color.g, Props.CellBorders.Bottom.Color.b)
            }
        }
        this.Slides[this.CurPage].graphicObjects.setTableProps(Props);
        this.Recalculate();

        this.Document_UpdateInterfaceState();
        this.Document_UpdateSelectionState();
    },

    Get_Paragraph_ParaPr : function()
    {
        if(this.Slides[this.CurPage])
        {
            var ret = this.Slides[this.CurPage].graphicObjects.getParagraphParaPr();
            if(ret)
            {
                return ret;
            }
        }
        return new CParaPr();
    },

    Get_Paragraph_TextPr : function()
    {
        if(this.Slides[this.CurPage])
        {
            var ret = this.Slides[this.CurPage].graphicObjects.getParagraphTextPr();
            if(ret)
            {
                return ret;
            }
        }
        return new CTextPr();
    },

    Get_Paragraph_TextPr_Copy : function()
    {
        if(this.Slides[this.CurPage])
        {
            return this.Slides[this.CurPage].graphicObjects.getParagraphTextPr();
        }
        return new CTextPr();
    },

    Get_Paragraph_ParaPr_Copy : function()
    {
        if(this.Slides[this.CurPage])
        {
            return this.Slides[this.CurPage].graphicObjects.getParagraphParaPr();
        }
        return new CParaPr();
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




    getAllTableStyles: function()
    {
        for(var  i = 0; i < this.globalTableStyles.length; ++i)
        {
            this.globalTableStyles[i].stylesId = i;
        }
        return this.globalTableStyles;
    },



    // Селектим весь параграф
    Select_All : function()
    {
        if(this.Slides[this.CurPage])
        {
            this.Slides[this.CurPage].graphicObjects.selectAll();
            this.Document_UpdateInterfaceState();
        }
    },


    Update_CursorType : function( X, Y, MouseEvent )
    {
        var graphicObjectInfo = this.Slides[this.CurPage].graphicObjects.isPointInDrawingObjects(X, Y, MouseEvent);
        if(graphicObjectInfo)
        {
           if(!graphicObjectInfo.updated)
           {
               this.DrawingDocument.SetCursorType(graphicObjectInfo.cursorType);
           }
        }
        else
        {
            this.DrawingDocument.SetCursorType("default");
        }
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
            var graphicObjects = this.Slides[this.CurPage].graphicObjects;

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

            bRetValue = true;
        }
        else if ( e.KeyCode == 27 ) // Esc
        {
            // TODO !!!
            bRetValue = true;
        }
        else if ( e.KeyCode == 32 && false === editor.isViewMode ) // Space
        {
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
           // if ( true != e.ShiftKey )
           //     this.DrawingDocument.TargetStart();

            this.Cursor_MoveLeft( true === e.ShiftKey, true === e.CtrlKey );
            bRetValue = true;
        }
        else if ( e.KeyCode == 38 ) // Top Arrow
        {
            // Чтобы при зажатой клавише курсор не пропадал
            //if ( true != e.ShiftKey )
            //    this.DrawingDocument.TargetStart();

            this.Cursor_MoveUp( true === e.ShiftKey );
            bRetValue = true;
        }
        else if ( e.KeyCode == 39 ) // Right Arrow
        {
            // Чтобы при зажатой клавише курсор не пропадал
           // if ( true != e.ShiftKey )
           //     this.DrawingDocument.TargetStart();

            this.Cursor_MoveRight( true === e.ShiftKey, true === e.CtrlKey );
            bRetValue = true;
        }
        else if ( e.KeyCode == 40 ) // Bottom Arrow
        {
            // Чтобы при зажатой клавише курсор не пропадал
            //if ( true != e.ShiftKey )
            //    this.DrawingDocument.TargetStart();

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
                if ( false === this.Document_Is_SelectionLocked(changestype_Drawing_Props) )
                {
                    if (!window.GlobalPasteFlag)
                    {
                        if (!window.USER_AGENT_SAFARI_MACOS)
                        {
                            this.Create_NewHistoryPoint();

                            window.GlobalPasteFlag = true;
                            Editor_Paste(this.DrawingDocument.m_oWordControl.m_oApi, true);
                            //не возвращаем true чтобы не было preventDefault
                        }
                        else
                        {
                            if (0 === window.GlobalPasteFlagCounter)
                            {
                                this.Create_NewHistoryPoint();

                                SafariIntervalFocus();
                                window.GlobalPasteFlag = true;
                                Editor_Paste(this.DrawingDocument.m_oWordControl.m_oApi, true);
                                //не возвращаем true чтобы не было preventDefault
                            }
                        }
                    }
                }
                //не возвращаем true чтобы не было preventDefault
            }
        }
        else if ( e.KeyCode == 46 && false === editor.isViewMode ) // Delete
        {
            if ( true != e.ShiftKey )
            {
                //if ( false === this.Document_Is_SelectionLocked(changestype_Drawing_Props) )
                {
                    //this.Create_NewHistoryPoint();
                    this.Remove( 1, true );
                }
                bRetValue = true;
            }
            else // Shift + Delete (аналогично Ctrl + X)
            {
                if ( false === this.Document_Is_SelectionLocked(changestype_Drawing_Props) )
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
        else if ( e.KeyCode == 56 && true === e.CtrlKey && true === e.ShiftKey ) // Ctrl + Shift + 8 - showParaMarks
        {
            editor.ShowParaMarks = !editor.ShowParaMarks;
            if(this.Slides[this.CurPage])
                this.DrawingDocument.OnRecalculatePage(this.CurPage, this.Slides[this.CurPage]);
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
                this.Paragraph_Add( new ParaTextPr( { Bold : TextPr.Bold === true ? false : true } ) );
                this.Document_UpdateInterfaceState();
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
            if ( true !== e.AltKey ) // Ctrl + E - переключение прилегания параграфа между center и left
            {
                var ParaPr = this.Get_Paragraph_ParaPr();
                if ( null != ParaPr )
                {
                    this.Create_NewHistoryPoint();
                    this.Set_ParagraphAlign( ParaPr.Jc === align_Center ? align_Left : align_Center );
                    this.Document_UpdateInterfaceState();
                    bRetValue = true;
                }
            }
            else // Ctrl + Alt + E - добавляем знак евро €
            {

                this.Paragraph_Add( new ParaText( "€" ) );
                bRetValue = true;
            }
        }
        else if ( e.KeyCode == 73 && false === editor.isViewMode && true === e.CtrlKey ) // Ctrl + I - делаем текст наклонным
        {
            var TextPr = this.Get_Paragraph_TextPr();
            if ( null != TextPr )
            {
                this.Paragraph_Add( new ParaTextPr( { Italic : TextPr.Italic === true ? false : true } ) );
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
                if ( false === this.Document_Is_SelectionLocked(changestype_Drawing_Props) )
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
                this.Paragraph_Add( new ParaPageNum() );
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
                this.Paragraph_Add( new ParaTextPr( { Underline : TextPr.Underline === true ? false : true } ) );
                bRetValue = true;
            }
        }
        else if ( e.KeyCode == 86 && false === editor.isViewMode && true === e.CtrlKey ) // Ctrl + V - paste
        {
            if ( false === this.Document_Is_SelectionLocked(changestype_Drawing_Props) )
            {
                if ( true === e.ShiftKey ) // Ctrl + Shift + V - вставляем по образцу
                {
                    this.Create_NewHistoryPoint();
                    this.Document_Format_Paste();
                    bRetValue = true;
                }
                else // Ctrl + V - paste
                {
                    if (!window.GlobalPasteFlag)
                    {
                        if (!window.USER_AGENT_SAFARI_MACOS)
                        {
                            this.Create_NewHistoryPoint();

                            window.GlobalPasteFlag = true;
                            Editor_Paste(this.DrawingDocument.m_oWordControl.m_oApi, true);
                            //не возвращаем true чтобы не было preventDefault
                        }
                        else
                        {
                            if (0 === window.GlobalPasteFlagCounter)
                            {
                                this.Create_NewHistoryPoint();

                                SafariIntervalFocus();
                                window.GlobalPasteFlag = true;
                                Editor_Paste(this.DrawingDocument.m_oWordControl.m_oApi, true);
                                //не возвращаем true чтобы не было preventDefault
                            }
                        }
                    }
                    else
                    {
                        if (!window.USER_AGENT_SAFARI_MACOS)
                            bRetValue = true;
                    }
                }
            }
        }
        else if ( e.KeyCode == 88 && false === editor.isViewMode && true === e.CtrlKey ) // Ctrl + X - cut
        {
            if ( false === this.Document_Is_SelectionLocked(changestype_Drawing_Props) )
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
           // var ConvertedPos = this.DrawingDocument.ConvertCoordsToCursorWR( this.TargetPos.X, this.TargetPos.Y, this.TargetPos.PageNum );
           // var X_abs = ConvertedPos.X;
           // var Y_abs = ConvertedPos.Y;


            var type;
            if(editor.WordControl.Thumbnails.FocusObjType === FOCUS_OBJECT_MAIN)
            {
                type = c_oAscContextMenuTypes.Main;

                if(this.Slides[this.CurPage] )
                {
                    var pos_x = 0, pos_y = 0;
                    if(this.Slides[this.CurPage].graphicObjects.selectedObjects.length > 0)
                    {
                        pos_x = this.Slides[this.CurPage].graphicObjects.selectedObjects[0].x;
                        pos_y = this.Slides[this.CurPage].graphicObjects.selectedObjects[0].y;
                    }
                    var ConvertedPos = this.DrawingDocument.ConvertCoordsToCursorWR_2( pos_x, pos_y, this.PageNum );
                    var X_abs = ConvertedPos.X;
                    var Y_abs = ConvertedPos.Y;
                    editor.sync_ContextMenuCallback(new CMouseMoveData({ Type : type, X_abs : X_abs, Y_abs : Y_abs }) );
                }
            }
            else
            {
                type = c_oAscContextMenuTypes.Thumbnails;
            }

            bUpdateSelection = false;
            bRetValue = true;
        }
        else if ( e.KeyCode == 121 && true === e.ShiftKey ) // Shift + F10 - контекстное меню
        {
           //var ConvertedPos = this.DrawingDocument.ConvertCoordsToCursorWR( this.TargetPos.X, this.TargetPos.Y, this.TargetPos.PageNum );
           //var X_abs = ConvertedPos.X;
           //var Y_abs = ConvertedPos.Y;
           //
           //editor.sync_ContextMenuCallback( { Type : c_oAscContextMenuTypes.Common, X_abs : X_abs, Y_abs : Y_abs } );


            var type;
            if(editor.WordControl.Thumbnails.FocusObjType === FOCUS_OBJECT_MAIN)
            {
                type = c_oAscContextMenuTypes.Main;

                if(this.Slides[this.CurPage] )
                {
                    var pos_x = 0, pos_y = 0;
                    if(this.Slides[this.CurPage].graphicObjects.selectedObjects.length > 0)
                    {
                        pos_x = this.Slides[this.CurPage].graphicObjects.selectedObjects[0].x;
                        pos_y = this.Slides[this.CurPage].graphicObjects.selectedObjects[0].y;
                    }
                    var ConvertedPos = this.DrawingDocument.ConvertCoordsToCursorWR( pos_x, pos_y, this.PageNum );
                    var X_abs = ConvertedPos.X;
                    var Y_abs = ConvertedPos.Y;
                    editor.sync_ContextMenuCallback(new CMouseMoveData({ Type : type, X_abs : X_abs, Y_abs : Y_abs }) );
                }
            }
            else
            {
                type = c_oAscContextMenuTypes.Thumbnails;
            }

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
                if ( true === e.ShiftKey )
                    this.Paragraph_Add( new ParaTextPr( { VertAlign : TextPr.VertAlign === vertalign_SuperScript ? vertalign_Baseline : vertalign_SuperScript } ) );
                else
                    this.Paragraph_Add( new ParaTextPr( { VertAlign : TextPr.VertAlign === vertalign_SubScript ? vertalign_Baseline : vertalign_SubScript } ) );
                bRetValue = true;
            }
        }
        else if ( e.KeyCode == 188 && true === e.CtrlKey ) // Ctrl + ,
        {
            var TextPr = this.Get_Paragraph_TextPr();
            if ( null != TextPr )
            {
                this.Paragraph_Add( new ParaTextPr( { VertAlign : TextPr.VertAlign === vertalign_SuperScript ? vertalign_Baseline : vertalign_SuperScript } ) );
                bRetValue = true;
            }
        }
        else if ( e.KeyCode == 189 && false === editor.isViewMode ) // Клавиша Num-
        {
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
        else if ( e.KeyCode == 190 && true === e.CtrlKey ) // Ctrl + .
        {
            var TextPr = this.Get_Paragraph_TextPr();
            if ( null != TextPr )
            {
                this.Paragraph_Add( new ParaTextPr( { VertAlign : TextPr.VertAlign === vertalign_SubScript ? vertalign_Baseline : vertalign_SubScript } ) );
                this.Document_UpdateInterfaceState();
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

    Set_DocumentDefaultTab: function(DTab)
    {
       //History.Add( this, { Type : historyitem_Document_DefaultTab, Old : Default_Tab_Stop, New : DTab } );
        Default_Tab_Stop = DTab;
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
        //if ( false === this.Document_Is_SelectionLocked(changestype_Drawing_Props) )
        {
            //this.Create_NewHistoryPoint();

           //this.DrawingDocument.TargetStart();
           //this.DrawingDocument.TargetShow();
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
        e.ctrlKey = e.CtrlKey;
        e.shiftKey = e.ShiftKey;
        if(e.Button === 0)
        {
            var ret = this.Slides[this.CurPage].graphicObjects.onMouseDown(e, X, Y);
            if(!ret)
            {
                this.Slides[this.CurPage].graphicObjects.resetSelection();
                this.Document_UpdateSelectionState();
            }
        }
        //else if(e.Button === 2 && this.viewMode === false )
        //{
        //    this.Slides[this.CurPage].graphicObjects.onMouseDown2(e, X, Y);
        //}
        this.Document_UpdateInterfaceState();
    },

    OnMouseUp : function(e, X, Y, PageIndex)
    {

        e.ctrlKey = e.CtrlKey;
        e.shiftKey = e.ShiftKey;
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
        e.ctrlKey = e.CtrlKey;
        e.shiftKey = e.ShiftKey;
        editor.sync_MouseMoveStartCallback();
        this.CurPage = PageIndex;
        this.Slides[this.CurPage].onMouseMove(e, X, Y);
        this.Update_CursorType(X, Y,  e );
        editor.sync_MouseMoveEndCallback();
    },



    Get_TableStyleForPara : function()
    {
        return null;
    },



    Get_SelectionAnchorPos: function()
    {
        if(this.Slides[this.CurPage])
        {
            var selected_objects = this.Slides[this.CurPage].graphicObjects.selectedObjects;
            if(selected_objects.length  > 0)
            {
                var last_object = selected_objects[selected_objects.length - 1];
                return  { X0 : last_object.x, X1 : last_object.x + last_object.extX, Y : last_object.y};
            }
            else
            {
                return  { X0 : this.Slides[this.CurPage].commentX, X1 : this.Slides[this.CurPage].commentX, Y : this.Slides[this.CurPage].commentY};
            }
        }
        return { X0 : 0, X1 : 0, Y : 0};
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


    Document_Format_Copy : function()
    {
        this.CopyTextPr = this.Get_Paragraph_TextPr_Copy();
        this.CopyParaPr = this.Get_Paragraph_ParaPr_Copy();
    },



    // Возвращаем выделенный текст, если в выделении не более 1 параграфа, и там нет картинок, нумерации страниц и т.д.
    Get_SelectedText : function(bClearText)
    {
        return this.Slides[this.CurPage].graphicObjects.Get_SelectedText(bClearText);
    },

//-----------------------------------------------------------------------------------
// Функции для работы с таблицами
//-----------------------------------------------------------------------------------
    Table_AddRow : function(bBefore)
    {
        if( this.Slides[this.CurPage].graphicObjects.State.textObject instanceof CGraphicFrame)
        {
            var _cur_object = this.Slides[this.CurPage].graphicObjects.State.textObject;
            if(_cur_object instanceof  CGraphicFrame && _cur_object.graphicObject instanceof CTable)
            {
                _cur_object.graphicObject.Row_Add(bBefore);
                this.Recalculate();
                this.DrawingDocument.OnRecalculatePage(this.CurPage, this.Slides[this.CurPage]);
            }
        }
        else
        {
            var _elements = this.Slides[this.CurPage].graphicObjects;
            if(_elements.State.id === STATES_ID_NULL)
            {
                var _shapes = this.Slides[this.CurPage].cSld.spTree;
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
                        }
                        else
                        {
                            return;
                        }
                    }
                }
                if(_target_table !== null)
                {
                    _elements.changeCurrentState(new TextAddState(_elements, this.Slides[this.CurPage], _target_table.Parent));
                    _target_table.Row_Add(bBefore);
                    this.Recalculate();
                    this.DrawingDocument.OnRecalculatePage(this.CurPage, this.Slides[this.CurPage]);
                }
            }
        }
        this.Document_UpdateSelectionState();
        this.Document_UpdateInterfaceState();
    },

    Table_AddCol : function(bBefore)
    {
        if( this.Slides[this.CurPage].graphicObjects.State.textObject instanceof CGraphicFrame)
        {
            var _cur_object = this.Slides[this.CurPage].graphicObjects.State.textObject;
            if(_cur_object instanceof  CGraphicFrame && _cur_object.graphicObject instanceof CTable)
            {
                _cur_object.graphicObject.Col_Add(bBefore);
                this.Recalculate();
                this.DrawingDocument.OnRecalculatePage(this.CurPage, this.Slides[this.CurPage]);
            }
        }
        else
        {
            var _elements = this.Slides[this.CurPage].graphicObjects;
            if(_elements.State.id === STATES_ID_NULL)
            {
                var _shapes = this.Slides[this.CurPage].cSld.spTree;
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
                        }
                        else
                        {
                            return;
                        }
                    }
                }
                if(_target_table !== null)
                {
                    _elements.changeCurrentState(new TextAddState(_elements, this.Slides[this.CurPage], _target_table.Parent));
                    _target_table.Col_Add(bBefore);
                    this.Recalculate();
                    this.DrawingDocument.OnRecalculatePage(this.CurPage, this.Slides[this.CurPage]);
                }
            }
        }
        this.Document_UpdateSelectionState();
        this.Document_UpdateInterfaceState();
    },

    Table_RemoveRow : function()
    {
        var _cur_object = this.Slides[this.CurPage].graphicObjects.State.textObject;
        if(_cur_object instanceof  CGraphicFrame && _cur_object.graphicObject instanceof CTable)
        {
            if(_cur_object.graphicObject.Row_Remove() === false)
            {
                this.Table_RemoveTable(true);
            }
            else
            {
                this.Recalculate();
                this.DrawingDocument.OnRecalculatePage(this.CurPage, this.Slides[this.CurPage]);
            }
        }
        this.Document_UpdateSelectionState();
        this.Document_UpdateInterfaceState();
    },

    Table_RemoveCol : function()
    {
        var _cur_object = this.Slides[this.CurPage].graphicObjects.State.textObject;
        if(_cur_object instanceof  CGraphicFrame && _cur_object.graphicObject instanceof CTable)
        {
            if(_cur_object.graphicObject.Col_Remove() === false)
            {
                this.Table_RemoveTable(true);
            }
            else
            {
                this.Recalculate();
                this.DrawingDocument.OnRecalculatePage(this.CurPage, this.Slides[this.CurPage]);
            }
        }

        this.Document_UpdateSelectionState();
        this.Document_UpdateInterfaceState();
    },

    Table_MergeCells : function()
    {
        var _cur_object = this.Slides[this.CurPage].graphicObjects.State.textObject;
        if(_cur_object instanceof CGraphicFrame)
        {
            if(_cur_object.graphicObject !== null && typeof _cur_object.graphicObject === "object" && typeof _cur_object.graphicObject.Cell_Merge === "function")
            {
                _cur_object.graphicObject.Cell_Merge();
                this.Recalculate(0);
                this.DrawingDocument.OnRecalculatePage(this.CurPage, this.Slides[this.CurPage]);
                this.Document_UpdateSelectionState();

            }
        }
    },

    Table_SplitCell : function( Cols, Rows )
    {
        var _cur_object = this.Slides[this.CurPage].graphicObjects.State.textObject;
        if(_cur_object.graphicObject !== null && typeof _cur_object.graphicObject === "object" && typeof _cur_object.graphicObject.Cell_Split === "function")
        {

            _cur_object.graphicObject.Cell_Split( Cols, Rows);
            this.Recalculate();
            this.DrawingDocument.OnRecalculatePage(this.CurPage, this.Slides[this.CurPage]);
            this.Document_UpdateSelectionState();
            this.Document_UpdateInterfaceState();
            return;
        }
        else
        {
            return;
        }

    },

    Table_RemoveTable : function(bHistoryFlag)
    {
        if(this.Slides[this.CurPage].graphicObjects.State.textObject instanceof CGraphicFrame)
        {
            var gr_fr = this.Slides[this.CurPage].graphicObjects.State.textObject;
            this.Slides[this.CurPage].graphicObjects.resetSelectionState();
            gr_fr.select(this.Slides[this.CurPage].graphicObjects);
            this.Slides[this.CurPage].removeSelectedObjects();
            this.Recalculate();
            this.Document_UpdateUndoRedoState();
            this.Document_UpdateInterfaceState()
        }
        //this.Document_UpdateSelectionState();
        //this.Document_UpdateUndoRedoState();
        //this.Document_UpdateInterfaceState();
    },

    Table_Select : function(Type)
    {
        if(this.Slides[this.CurPage].graphicObjects.State.textObject && this.Slides[this.CurPage].graphicObjects.State.textObject instanceof CGraphicFrame)
        {
            this.Slides[this.CurPage].graphicObjects.State.textObject.graphicObject.Table_Select(Type);
            this.Document_UpdateSelectionState();
            this.Document_UpdateInterfaceState();
        }
    },

    Table_CheckMerge : function()
    {
        if(this.Slides[this.CurPage].graphicObjects.State.textObject && this.Slides[this.CurPage].graphicObjects.State.textObject instanceof CGraphicFrame)
        {
            return this.Slides[this.CurPage].graphicObjects.State.textObject.graphicObject.Check_Merge();
        }
        return false;
    },

    Table_CheckSplit : function()
    {
        if(this.Slides[this.CurPage].graphicObjects.State.textObject && this.Slides[this.CurPage].graphicObjects.State.textObject instanceof CGraphicFrame)
        {
            return this.Slides[this.CurPage].graphicObjects.State.textObject.graphicObject.Check_Split();
        }
        /*else
        {
            var _elements = this.Slides[this.CurPage].graphicObjects;
            if(_elements.State.id === STATES_ID_NULL)
            {
                var _selected_count = 0;
                var _shapes = this.Slides[this.CurPage].cSld.spTree;
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
        } */
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
        //TODO !!!!!!!!!!!!!!!!!!!!!!!!!!!
        return;
    },

    Document_CreateFontCharMap : function(FontCharMap)
    {
        //TODO !!!!!!!!!!
    },

    Document_Get_AllFontNames : function()
    {
        var AllFonts = {};
        for(var i =0 ; i < this.Slides.length; ++i)
        {
            this.Slides[i].getAllFonts(AllFonts)
        }
        return AllFonts;
    },

    // Обновляем текущее состояние (определяем где мы находимся, картинка/параграф/таблица/колонтитул)
    Document_UpdateInterfaceState : function()
    {
        editor.sync_BeginCatchSelectedElements();
        editor.ClearPropObjCallback();
        if(this.Slides[this.CurPage])
        {
            editor.sync_slidePropCallback(this.Slides[this.CurPage]);
            var graphic_objects = this.Slides[this.CurPage].graphicObjects;
            var target_content = graphic_objects.getTargetDocContent(), drawing_props = graphic_objects.getDrawingProps(), i;
            var para_pr = graphic_objects.getParagraphParaPr(), text_pr = graphic_objects.getParagraphTextPr();
            if(!para_pr)
            {
                para_pr = new CParaPr();
            }
            if(!text_pr)
            {
                text_pr = new CTextPr();
            }
            if(!target_content)
            {
                    editor.UpdateParagraphProp( para_pr );
                    editor.sync_PrLineSpacingCallBack(para_pr.Spacing);
                    //if(selected_objects.length === 1 )
                    //{
                    //    if ( "undefined" != typeof(para_props.Tabs) && null != para_props.Tabs )
                    //        editor.Update_ParaTab( Default_Tab_Stop, para_props.Tabs );//TODO:
                    //}
                    editor.UpdateTextPr(text_pr);
            }

            if(drawing_props.imageProps)
            {
                editor.sync_ImgPropCallback(drawing_props.imageProps);
            }

            if(drawing_props.shapeProps)
            {
                editor.sync_shapePropCallback(drawing_props.shapeProps);
            }

            if(drawing_props.chartProps)
            {
                editor.sync_ImgPropCallback(drawing_props.chartProps);
            }
            if(target_content)
            {
                if(para_pr)
                {
                    editor.UpdateParagraphProp( para_pr );

                    editor.sync_PrLineSpacingCallBack(para_pr.Spacing);
                    //if(selected_objects.length === 1 )
                    //{
                    //    if ( "undefined" != typeof(para_props.Tabs) && null != para_props.Tabs )
                    //        editor.Update_ParaTab( Default_Tab_Stop, para_props.Tabs );//TODO:
                    //}
                }
                if(text_pr)
                {

                    if(text_pr.RFonts)
                    {
                        var theme = graphic_objects.getTheme();
                        if(text_pr.RFonts.Ascii)
                            text_pr.RFonts.Ascii.Name     = theme.themeElements.fontScheme.checkFont(text_pr.RFonts.Ascii.Name);
                        if(text_pr.RFonts.EastAsia)
                            text_pr.RFonts.EastAsia.Name  = theme.themeElements.fontScheme.checkFont(text_pr.RFonts.EastAsia.Name);
                        if(text_pr.RFonts.HAnsi)
                            text_pr.RFonts.HAnsi.Name     = theme.themeElements.fontScheme.checkFont(text_pr.RFonts.HAnsi.Name);
                        if(text_pr.RFonts.CS)
                            text_pr.RFonts.CS.Name        = theme.themeElements.fontScheme.checkFont(text_pr.RFonts.CS.Name);
                    }
                    editor.UpdateTextPr(text_pr);
                }
            }
        }
        editor.sync_EndCatchSelectedElements();
        this.Document_UpdateUndoRedoState();
        this.Document_UpdateRulersState();
        editor.asc_fireCallback("asc_onPresentationSize", this.Width, this.Height);
        editor.asc_fireCallback("asc_canIncreaseIndent", this.Can_IncreaseParagraphLevel(true));
        editor.asc_fireCallback("asc_canDecreaseIndent", this.Can_IncreaseParagraphLevel(false));
    },

    changeBackground: function(bg, arr_ind)
    {
        if(this.Document_Is_SelectionLocked(changestype_SlideBg) === false)
        {
            History.Create_NewPoint();
            for(var i = 0; i <arr_ind.length; ++i)
            {
                this.Slides[arr_ind[i]].changeBackground(bg);
            }

            this.Recalculate();
            for(var i = 0; i <arr_ind.length; ++i)
            {
                this.DrawingDocument.OnRecalculatePage(arr_ind[i], this.Slides[arr_ind[i]]);
            }

            this.DrawingDocument.OnEndRecalculate(true, false);
            this.Document_UpdateInterfaceState();
        }
    },

    // Обновляем линейки
    Document_UpdateRulersState : function()
    {
        if(this.Slides[this.CurPage])
        {
            var target_content = this.Slides[this.CurPage].graphicObjects.getTargetDocContent();
            if(target_content && target_content.Parent && target_content.Parent.getObjectType() === historyitem_type_TextBody)
            {
                return this.DrawingDocument.Set_RulerState_Paragraph( null , target_content.Parent.getMargins());
            }
        }
        this.DrawingDocument.Set_RulerState_Paragraph(null);
    },

    // Обновляем линейки
    Document_UpdateSelectionState : function()
    {
        if(this.Slides[this.CurPage])
        {
            this.Slides[this.CurPage].graphicObjects.updateSelectionState();
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
			editor._onUpdateDocumentCanSave();
        }
        else
        {
            editor.SetUnchangedDocument();
        }
    },

    Document_UpdateCanAddHyperlinkState : function()
    {
        editor.sync_CanAddHyperlinkCallback( this.Hyperlink_CanAdd(false) );
    },

    Set_CurPage : function(PageNum)
    {
        if (-1 == PageNum)
        {
            this.CurPage = -1;
            this.Document_UpdateInterfaceState();
            return;
        }

        var oldCurPage = this.CurPage;
        this.CurPage = Math.min( this.Slides.length - 1, Math.max( 0, PageNum ) );
        if(oldCurPage != this.CurPage && this.CurPage < this.Slides.length)
        {
            if(this.Slides[oldCurPage])
            {
                this.Slides[oldCurPage].graphicObjects.resetSelectionState();
            }
            editor.asc_hideComments();
        }
        this.Document_UpdateInterfaceState();
    },

    Get_CurPage : function()
    {
        return this.CurPage;
    },

    resetStateCurSlide: function()
    {
        this.Slides[this.CurPage] && this.Slides[this.CurPage].graphicObjects.resetSelection();
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
        if ( true === CollaborativeEditing.Get_GlobalLock() )
            return;

        this.clearThemeTimeouts();
        this.History.Undo();
        this.Recalculate(this.History.RecalculateData);

        this.Document_UpdateSelectionState();
        this.Document_UpdateInterfaceState();
    },

    Document_Redo : function()
    {
        if ( true === CollaborativeEditing.Get_GlobalLock() )
            return;

        this.clearThemeTimeouts();
        this.History.Redo();
        this.Recalculate(this.History.RecalculateData);

        this.Document_UpdateSelectionState();
        this.Document_UpdateInterfaceState();
    },

    Get_SelectionState : function()
    {
        var s = {};
        s.CurPage = this.CurPage;
        if(this.CurPage > -1)
            s.slideSelection = this.Slides[this.CurPage].graphicObjects.getSelectionState();
        return s;
    },

    Set_SelectionState : function(State)
    {
        if(State.CurPage > -1)
            this.Slides[State.CurPage].graphicObjects.setSelectionState(State.slideSelection);
        this.Set_CurPage(State.CurPage);
        this.bGoToPage = true;
    },

    Undo : function(Data)
    {
        var Type = Data.Type;

        switch ( Type )
        {
            case historyitem_Document_DefaultTab:
            {
                Default_Tab_Stop = Data.Old;

                break;
            }
            case historyitem_Presentation_AddSlide:
            {
                this.Slides.splice(Data.Pos, 1);
                for(var i = 0; i < this.Slides.length; ++i)
                {
                    this.DrawingDocument.OnRecalculatePage(i, this.Slides[i]);
                }
                break;
            }
            case historyitem_Presentation_RemoveSlide:
            {
                this.Slides.splice(Data.Pos, 0, g_oTableId.Get_ById(Data.Id));
                for(var i = 0; i < this.Slides.length; ++i)
                {
                    this.DrawingDocument.OnRecalculatePage(i, this.Slides[i]);
                }
                break;
            }
            case historyitem_Presentation_SlideSize:
            {
                var kw = Data.oldW/this.Width;
                var kh = Data.oldH/this.Height;

                this.Width = Data.oldW;
                this.Height = Data.oldH;
                this.changeSlideSizeFunction(kw, kh);
                editor.asc_fireCallback("asc_onPresentationSize", this.Width, this.Height);

                break;
            }
            case historyitem_Presentation_AddSlideMaster:
            {
                this.slideMasters.splice(Data.pos, 1);
                break;
            }
        }
    },

    Redo : function(Data)
    {
        var Type = Data.Type;

        switch ( Type )
        {
            case historyitem_Presentation_AddSlide:
            {
                this.Slides.splice(Data.Pos, 0, g_oTableId.Get_ById(Data.Id));
                for(var i = 0; i < this.Slides.length; ++i)
                {
                    this.DrawingDocument.OnRecalculatePage(i, this.Slides[i]);
                }
                break;
            }
            case historyitem_Presentation_RemoveSlide:
            {
                this.Slides.splice(Data.Pos, 1);
                for(var i = 0; i < this.Slides.length; ++i)
                {
                    this.DrawingDocument.OnRecalculatePage(i, this.Slides[i]);
                }
                break;
            }
            case historyitem_Presentation_SlideSize:
            {
                var kw = Data.newW/this.Width;
                var kh = Data.newH/this.Height;
                this.Width = Data.newW;
                this.Height = Data.newH;
                this.changeSlideSizeFunction(kw, kh);
                editor.asc_fireCallback("asc_onPresentationSize", this.Width, this.Height);
                break;
            }
            case historyitem_Presentation_AddSlideMaster:
            {
                this.slideMasters.splice(Data.pos, 0, Data.master);
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
        var recalculateMaps, key;
        switch ( Data.Type )
        {
            case historyitem_Presentation_AddSlide:
            {
                break;
            }
            case historyitem_Presentation_RemoveSlide:
            {
                break;
            }
            case historyitem_Presentation_SlideSize:
            {
                recalculateMaps = this.GetRecalculateMaps();
                for(key in recalculateMaps.masters)
                {
                    if(recalculateMaps.masters.hasOwnProperty(key))
                    {
                        recalculateMaps.masters[key].checkSlideSize();
                    }
                }
                for(key in recalculateMaps.layouts)
                {
                    if(recalculateMaps.layouts.hasOwnProperty(key))
                    {
                        recalculateMaps.layouts[key].checkSlideSize();
                    }
                }
                for(key = 0; key < this.Slides.length; ++key)
                {
                    this.Slides[key].checkSlideSize();
                }
                break;
            }
            case historyitem_Presentation_AddSlideMaster:
            {
                break;
            }
            case historyitem_Presentation_ChangeTheme:
            {
                for(var i = 0; i < Data.arrIndex.length; ++i)
                {
                    this.Slides[Data.arrIndex[i]] && this.Slides[Data.arrIndex[i]].checkSlideTheme();
                }
                break;
            }
            case historyitem_Presentation_ChangeColorScheme:
            {
                recalculateMaps = this.GetRecalculateMaps();
                for(key in recalculateMaps.masters)
                {
                    if(recalculateMaps.masters.hasOwnProperty(key))
                    {
                        recalculateMaps.masters[key].checkSlideColorScheme();
                    }
                }
                for(key in recalculateMaps.layouts)
                {
                    if(recalculateMaps.layouts.hasOwnProperty(key))
                    {
                        recalculateMaps.layouts[key].checkSlideColorScheme();
                    }
                }
                for(var i = 0; i < Data.arrIndex.length; ++i)
                {
                    this.Slides[Data.arrIndex[i]] && this.Slides[Data.arrIndex[i]].checkSlideTheme();
                }
                break;
            }
        }
        this.Refresh_RecalcData2(Data);
    },

    Refresh_RecalcData2 : function(Data)
    {
        switch ( Data.Type )
        {
            case historyitem_Presentation_AddSlide:
            {
                break;
            }
            case historyitem_Presentation_RemoveSlide:
            {
                break;
            }
            case historyitem_Presentation_SlideSize:
            {
                History.RecalcData_Add({Type: historyrecalctype_Drawing, All: true});
                break;
            }
            case historyitem_Presentation_AddSlideMaster:
            {
                break;
            }
            case historyitem_Presentation_ChangeTheme:
            {
                History.RecalcData_Add({Type: historyrecalctype_Drawing, Theme: true, ArrInd: Data.arrIndex});
                break;
            }
            case historyitem_Presentation_ChangeColorScheme:
            {
                History.RecalcData_Add({Type: historyrecalctype_Drawing, ColorScheme: true, ArrInd: Data.arrIndex});
                break;
            }
        }
    },

//-----------------------------------------------------------------------------------
// Функции для работы с гиперссылками
//-----------------------------------------------------------------------------------
    Hyperlink_Add : function(HyperProps)
    {
        if(this.Slides[this.CurPage])
        {
            this.Slides[this.CurPage].graphicObjects.checkSelectedObjectsAndCallback(this.Slides[this.CurPage].graphicObjects.hyperlinkAdd, [HyperProps]);
        }
    },

    Hyperlink_Modify : function(HyperProps)
    {
        if(this.Slides[this.CurPage])
        {
            this.Slides[this.CurPage].graphicObjects.checkSelectedObjectsAndCallback(this.Slides[this.CurPage].graphicObjects.hyperlinkModify, [HyperProps]);
        }
    },

    Hyperlink_Remove : function()
    {
        if(this.Slides[this.CurPage])
        {
            this.Slides[this.CurPage].graphicObjects.checkSelectedObjectsAndCallback(this.Slides[this.CurPage].graphicObjects.hyperlinkRemove, []);
        }
    },

    Hyperlink_CanAdd : function(bCheckInHyperlink)
    {
        if(this.Slides[this.CurPage])
            return this.Slides[this.CurPage].graphicObjects.hyperlinkCanAdd(bCheckInHyperlink);
        return false;
    },

    canGroup: function()
    {
        if(this.Slides[this.CurPage])
            return this.Slides[this.CurPage].graphicObjects.canGroup();
        return false
    },

    canUnGroup: function()
    {
        if(this.Slides[this.CurPage])
            return this.Slides[this.CurPage].graphicObjects.canUnGroup();
        return false;
    },

    alignLeft : function()
    {
        this.Slides[this.CurPage] && this.Slides[this.CurPage].graphicObjects.checkSelectedObjectsAndCallback(this.Slides[this.CurPage].graphicObjects.alignLeft);
    },

    alignRight : function()
    {
        this.Slides[this.CurPage] && this.Slides[this.CurPage].graphicObjects.checkSelectedObjectsAndCallback(this.Slides[this.CurPage].graphicObjects.alignRight);
    },

    alignTop : function()
    {

        this.Slides[this.CurPage] && this.Slides[this.CurPage].graphicObjects.checkSelectedObjectsAndCallback(this.Slides[this.CurPage].graphicObjects.alignTop);
    },

    alignBottom : function()
    {
        this.Slides[this.CurPage] && this.Slides[this.CurPage].graphicObjects.checkSelectedObjectsAndCallback(this.Slides[this.CurPage].graphicObjects.alignBottom);
    },

    alignCenter : function()
    {
        this.Slides[this.CurPage] && this.Slides[this.CurPage].graphicObjects.checkSelectedObjectsAndCallback(this.Slides[this.CurPage].graphicObjects.alignCenter);
    },

    alignMiddle : function()
    {
        this.Slides[this.CurPage] && this.Slides[this.CurPage].graphicObjects.checkSelectedObjectsAndCallback(this.Slides[this.CurPage].graphicObjects.alignMiddle);
    },

    distributeHor : function()
    {
        this.Slides[this.CurPage] && this.Slides[this.CurPage].graphicObjects.checkSelectedObjectsAndCallback(this.Slides[this.CurPage].graphicObjects.distributeHor);
    },
    distributeVer : function()
    {
        this.Slides[this.CurPage] && this.Slides[this.CurPage].graphicObjects.checkSelectedObjectsAndCallback(this.Slides[this.CurPage].graphicObjects.distributeVer);
    },

    bringToFront : function()
    {
        this.Slides[this.CurPage] && this.Slides[this.CurPage].graphicObjects.checkSelectedObjectsAndCallback(this.Slides[this.CurPage].graphicObjects.bringToFront);   //TODO: Передавать тип проверки
    },

    bringForward : function()
    {
        this.Slides[this.CurPage] && this.Slides[this.CurPage].graphicObjects.checkSelectedObjectsAndCallback(this.Slides[this.CurPage].graphicObjects.bringForward);   //TODO: Передавать тип проверки
    },

    sendToBack : function()
    {

        this.Slides[this.CurPage] && this.Slides[this.CurPage].graphicObjects.checkSelectedObjectsAndCallback(this.Slides[this.CurPage].graphicObjects.sendToBack);   //TODO: Передавать тип проверки
    },


    bringBackward : function()
    {
        this.Slides[this.CurPage] && this.Slides[this.CurPage].graphicObjects.checkSelectedObjectsAndCallback(this.Slides[this.CurPage].graphicObjects.bringBackward);   //TODO: Передавать тип проверки
    },

    // Проверяем, находимся ли мы в гиперссылке сейчас
    Hyperlink_Check : function(bCheckEnd)
    {
        return isRealObject(this.Slides[this.CurPage]) && this.Slides[this.CurPage].graphicObjects.hyperlinkCheck(bCheckEnd);
    },


    addNextSlide: function(layoutIndex)
    {
        History.Create_NewPoint();
        if(!(this.CurPage === -1))
        {
            var cur_slide = this.Slides[this.CurPage];
            var  new_slide, layout;

            layout = isRealNumber(layoutIndex) ? (cur_slide.Layout.Master.sldLayoutLst[layoutIndex] ?  cur_slide.Layout.Master.sldLayoutLst[layoutIndex]:  cur_slide.Layout) : cur_slide.Layout.Master.getMatchingLayout(cur_slide.Layout.type, cur_slide.Layout.matchingName, cur_slide.Layout.cSld.name);
            new_slide = new Slide(this, layout, this.CurPage + 1);
            for(var i = 0; i < layout.cSld.spTree.length; ++i)
            {
                if(layout.cSld.spTree[i].isPlaceholder())
                {
                    var _ph_type = layout.cSld.spTree[i].getPhType();
                    if(_ph_type != phType_dt && _ph_type != phType_ftr && _ph_type != phType_hdr && _ph_type != phType_sldNum)
                    {
                        var sp = layout.cSld.spTree[i].copy();
                        sp.setParent(new_slide);
                        sp.clearContent && sp.clearContent();
                        new_slide.addToSpTreeToPos(new_slide.cSld.spTree.length, sp);
                    }
                }
            }
            new_slide.setSlideNum(this.CurPage + 1);
            new_slide.setSlideSize(this.Width, this.Height);
            this.insertSlide(this.CurPage+1,  new_slide);

            for(var i = this.CurPage + 2; i < this.Slides.length; ++i)
            {
                this.Slides[i].setSlideNum(i);
            }
            this.Recalculate();
        }
        else
        {
            var master = this.slideMasters[0];
            var layout = master.sldLayoutLst[0];
            var new_slide = new Slide(this, layout, this.CurPage + 1);
            for(var i = 0; i < layout.cSld.spTree.length; ++i)
            {
                if(layout.cSld.spTree[i].isPlaceholder())
                {
                    var _ph_type = layout.cSld.spTree[i].getPhType();
                    if(_ph_type != phType_dt && _ph_type != phType_ftr && _ph_type != phType_hdr && _ph_type != phType_sldNum)
                    {
                        var sp = layout.cSld.spTree[i].copy();
                        sp.setParent(new_slide);
                        sp.clearContent && sp.clearContent();
                        new_slide.addToSpTreeToPos(new_slide.cSld.spTree.length, sp);
                    }
                }
            }
            new_slide.setSlideNum(this.CurPage + 1);
            new_slide.setSlideSize(this.Width, this.Height);
            this.insertSlide(this.CurPage+1,  new_slide);
            this.Recalculate();
        }

        this.Document_UpdateInterfaceState();
    },


    shiftSlides: function(pos, array)
    {
        History.Create_NewPoint();
        array.sort(fSortAscending);
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

        var _selectedPage = this.CurPage;
        var _newSelectedPage = 0;

        deleted.reverse();
        for(var i = 0; i < deleted.length; ++i)
        {
            this.insertSlide(pos + i, deleted[i]);
        }
        for(i = 0; i < this.Slides.length; ++i)
        {
            if (this.Slides[i].num == _selectedPage)
                _newSelectedPage = i;

            this.Slides[i].changeNum(i);
        }

        this.Document_UpdateUndoRedoState();
        this.DrawingDocument.OnEndRecalculate();
        this.DrawingDocument.UpdateThumbnailsAttack();
        this.DrawingDocument.m_oWordControl.GoToPage(_newSelectedPage);
    },

    deleteSlides: function(array)
    {
        if(array.length > 0 && this.Document_Is_SelectionLocked(changestype_RemoveSlide, null) === false)
        {
            History.Create_NewPoint();
            var oldLen = this.Slides.length;
            array.sort(fSortAscending);
            for(var i = array.length -1; i > - 1; --i)
            {
                this.removeSlide(array[i]);
            }
            for(i = 0; i < this.Slides.length; ++i)
            {
                this.Slides[i].changeNum(i);
            }
            if(array[array.length-1] != oldLen-1)
            {
                //this.Set_CurPage(array[array.length-1]+1 - array.length);
                this.DrawingDocument.m_oWordControl.GoToPage(array[array.length-1]+1 - array.length);

            }
            else
            {
                //this.Set_CurPage(this.Slides.length -1);
                this.DrawingDocument.m_oWordControl.GoToPage(this.Slides.length -1);

            }
            this.Document_UpdateUndoRedoState();
            this.DrawingDocument.OnEndRecalculate();
            this.DrawingDocument.UpdateThumbnailsAttack();
        }
    },

    changeLayout: function(_array, MasterLayouts, layout_index)
    {
        if(this.Document_Is_SelectionLocked(changestype_Layout) === false)
        {
            History.Create_NewPoint();
            var layout = MasterLayouts.sldLayoutLst[layout_index];
            for(var i = 0; i < _array.length; ++i)
            {
                var slide = this.Slides[_array[i]];
                for(var j = slide.cSld.spTree.length-1; j  > -1 ; --j)
                {
                    if(slide.cSld.spTree[j].isEmptyPlaceholder && slide.cSld.spTree[j].isEmptyPlaceholder())
                    {
                        slide.removeFromSpTreeById(slide.cSld.spTree[j].Get_Id());
                    }
                }
                for(var j = 0; j < layout.cSld.spTree.length; ++j)
                {
                    if(layout.cSld.spTree[j].isPlaceholder())
                    {

                        var _ph_type = layout.cSld.spTree[j].getPhType();
                        if(_ph_type != phType_dt && _ph_type != phType_ftr && _ph_type != phType_hdr && _ph_type != phType_sldNum)
                        {
                            var matching_shape =  slide.getMatchingShape(layout.cSld.spTree[j].getPlaceholderType(), layout.cSld.spTree[j].getPlaceholderIndex(), layout.cSld.spTree[j].getIsSingleBody ? layout.cSld.spTree[j].getIsSingleBody() : false);
                            if(matching_shape == null && layout.cSld.spTree[j])
                            {
                                var sp = layout.cSld.spTree[j].copy();
                                sp.setParent(slide);
                                sp.clearContent && sp.clearContent();
                                slide.addToSpTreeToPos(slide.cSld.spTree.length, sp)
                            }
                        }
                    }
                }
                slide.setLayout(layout);
            }
            this.Recalculate();
        }
    },

    clearThemeTimeouts: function()
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
    },

    changeTheme : function(themeInfo, arrInd)
    {
        if(this.viewMode === true)
        {
            return;
        }
        var arr_ind, i;
        if(!Array.isArray(arrInd))
        {
            arr_ind = [];
            for(i = 0; i < this.Slides.length; ++i)
            {
                arr_ind.push(i);
            }
        }
        else
        {
            arr_ind = arrInd;
        }
        this.clearThemeTimeouts();

        this.addSlideMaster(this.slideMasters.length, themeInfo.Master);
        var _new_master = themeInfo.Master;
        _new_master.presentation = this;
        var _master_width = _new_master.Width;
        var _master_height = _new_master.Height;
        if(_master_height !== this.Height || _master_width !== this.Width)
        {
            var kw = this.Width/_master_width;
            var kh = this.Height/_master_height;
            themeInfo.Master.changeSize(kw, kh);
            for(i = 0; i < themeInfo.Master.sldLayoutLst.length; ++i)
            {
                themeInfo.Master.sldLayoutLst[i].changeSize(kw, kh);
            }
        }
        var slides_array = [];
        for(i = 0; i < arr_ind.length; ++i)
        {
            slides_array.push(this.Slides[arr_ind[i]]);
        }
        var new_layout;
        for(i = 0; i < slides_array.length; ++i)
        {
            if(slides_array[i].Layout.calculatedType == null)
            {
                slides_array[i].Layout.calculateType();
            }
            new_layout = _new_master.getMatchingLayout(slides_array[i].Layout.type, slides_array[i].Layout.matchingName, slides_array[i].Layout.cSld.name, true);
            if(!isRealObject(new_layout))
            {
                new_layout = _new_master.sldLayoutLst[0];
            }
            slides_array[i].setLayout(new_layout);
            slides_array[i].checkNoTransformPlaceholder();
        }
        History.Add(this, {Type: historyitem_Presentation_ChangeTheme, arrIndex: arr_ind});
        this.resetStateCurSlide();
        this.Recalculate();
        this.Document_UpdateInterfaceState();
    },

    changeSlideSizeFunction: function(kw, kh)
    {
        ExecuteNoHistory(function()
        {
            for(var i = 0; i < this.slideMasters.length; ++i)
            {
                this.slideMasters[i].changeSize(kw, kh);
                var master = this.slideMasters[i];
                for(var j = 0; j < master.sldLayoutLst.length; ++j)
                {
                    master.sldLayoutLst[j].changeSize(kw, kh);
                }
            }
            for(var i = 0; i < this.Slides.length; ++i)
            {
                this.Slides[i].changeSize(kw, kh);
            }
        }, this, []);
    },

    changeSlideSize: function(width, height)
    {
        if(this.Document_Is_SelectionLocked(changestype_SlideSize) === false)
        {
            History.Create_NewPoint();
            History.Add(this, {Type: historyitem_Presentation_SlideSize, oldW: this.Width, newW: width, oldH: this.Height, newH:  height});
            var kw = width/this.Width;
            var kh = height/this.Height;
            this.Width = width;
            this.Height = height;
            this.changeSlideSizeFunction(kw, kh);
            this.Recalculate();
        }
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

        var arrInd = [];
        for(var i = 0; i < this.Slides.length; ++i)
        {
            if(!this.Slides[i].Layout.Master.Theme.themeElements.clrScheme.isIdentical(colorScheme))
            {
                this.Slides[i].Layout.Master.Theme.changeColorScheme(colorScheme.createDuplicate());
            }
            arrInd.push(i);
        }
        History.Add(this, {Type: historyitem_Presentation_ChangeColorScheme, arrIndex: arrInd});
        this.Recalculate();
    },


    removeSlide: function(pos)
    {
        if(isRealNumber(pos) && pos > -1 && pos < this.Slides.length)
        {
            History.Add(this, {Type: historyitem_Presentation_RemoveSlide, Pos: pos, Id: this.Slides[pos].Get_Id()});
            return this.Slides.splice(pos, 1)[0];
        }
        return null;
    },

    insertSlide: function(pos, slide)
    {
        History.Add(this, {Type: historyitem_Presentation_AddSlide, Pos: pos, Id: slide.Get_Id()});
        this.Slides.splice(pos, 0, slide);
    },
	
	moveSlides: function(slidesIndexes, pos)
	{
		var insert_pos = pos;
		var removed_slides = [];
		for(var i = slidesIndexes.length - 1; i > -1; --i)
		{
			removed_slides.push(this.removeSlide(slidesIndexes[i]));
			if(slidesIndexes[i] < pos)
			{
				--insert_pos;
			}
		}
		removed_slides.reverse();
		for(i = 0; i < removed_slides.length; ++i)
		{
			this.insertSlide(insert_pos + i, removed_slides[i]);
		}
	},
//-----------------------------------------------------------------------------------
// Функции для работы с совместным редактирования
//-----------------------------------------------------------------------------------

    Document_Is_SelectionLocked : function(CheckType, AdditionalData)
    {
        if ( true === CollaborativeEditing.Get_GlobalLock() )
            return true;
        if(this.Slides.length === 0)
            return false;

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

        if(CheckType === changestype_AddShape || CheckType === changestype_AddComment)
        {
            if(cur_slide.deleteLock.Lock.Type !== locktype_Mine && cur_slide.deleteLock.Lock.Type !== locktype_None)
                return true;
            var check_obj =
            {
                "type": c_oAscLockTypeElemPresentation.Object,
                "slideId": slide_id,
                "objId": AdditionalData.Get_Id(),
                "guid": AdditionalData.Get_Id()
            };
            AdditionalData.Lock.Check(check_obj);
        }
        if(CheckType === changestype_AddShapes)
        {
            if(cur_slide.deleteLock.Lock.Type !== locktype_Mine && cur_slide.deleteLock.Lock.Type !== locktype_None)
                return true;
            for(var i = 0; i < AdditionalData.length; ++i)
            {
                var check_obj =
                {
                    "type": c_oAscLockTypeElemPresentation.Object,
                    "slideId": slide_id,
                    "objId": AdditionalData[i].Get_Id(),
                    "guid": AdditionalData[i].Get_Id()
                };
                AdditionalData[i].Lock.Check(check_obj);
            }
        }

        if(CheckType === changestype_MoveComment)
        {
            var comment = g_oTableId.Get_ById(AdditionalData);
            if(isRealObject(comment))
            {
                var slides = this.Slides;
                var check_slide = null;
                for(var i = 0; i < slides.length; ++i)
                {
                    if(slides[i].slideComments)
                    {
                        var comments = slides[i].slideComments.comments;
                        for(var j = 0; j < comments.length; ++j)
                        {
                            if(comments[j] === comment)
                            {
                                check_slide = slides[i];
                                break;
                            }
                        }
                        if(j < comments.length)
                        {
                            break;
                        }
                    }
                }
                if(isRealObject(check_slide))
                {
                    if(check_slide.deleteLock.Lock.Type !== locktype_Mine && check_slide.deleteLock.Lock.Type !== locktype_None)
                        return true;
                    var check_obj =
                    {
                        "type": c_oAscLockTypeElemPresentation.Object,
                        "slideId": slide_id,
                        "objId": comment.Get_Id(),
                        "guid": comment.Get_Id()
                    };
                    comment.Lock.Check(check_obj);
                }
                else
                {
                    return true;
                }
            }
            else
            {
                return true;
            }


        }

        if(CheckType === changestype_SlideBg)
        {
            var selected_slides = editor.WordControl.Thumbnails.GetSelectedArray();
            for(var i = 0; i < selected_slides.length; ++i)
            {
                var check_obj =
                {
                    "type": c_oAscLockTypeElemPresentation.Slide,
                    "val": this.Slides[selected_slides[i]].backgroundLock.Get_Id(),
                    "guid": this.Slides[selected_slides[i]].backgroundLock.Get_Id()
                };
                this.Slides[selected_slides[i]].backgroundLock.Lock.Check(check_obj);
            }
        }

        if(CheckType === changestype_SlideTiming)
        {
            var selected_slides = editor.WordControl.Thumbnails.GetSelectedArray();
            for(var i = 0; i < selected_slides.length; ++i)
            {
                var check_obj =
                {
                    "type": c_oAscLockTypeElemPresentation.Slide,
                    "val": this.Slides[selected_slides[i]].timingLock.Get_Id(),
                    "guid": this.Slides[selected_slides[i]].timingLock.Get_Id()
                };
                this.Slides[selected_slides[i]].timingLock.Lock.Check(check_obj);
            }
        }

        if(CheckType === changestype_Text_Props)
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
                    "guid":selected_objects[i].Get_Id()
                };
                selected_objects[i].Lock.Check(check_obj);
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

        if(CheckType === changestype_Layout)
        {
            var selected_slides = editor.WordControl.Thumbnails.GetSelectedArray();
            for(var i = 0; i < selected_slides.length; ++i)
            {
                var check_obj =
                {
                    "type": c_oAscLockTypeElemPresentation.Slide,
                    "val": this.Slides[selected_slides[i]].layoutLock.Get_Id(),
                    "guid": this.Slides[selected_slides[i]].layoutLock.Get_Id()
                };
                this.Slides[selected_slides[i]].layoutLock.Lock.Check(check_obj);
            }
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
            case historyitem_Document_DefaultTab:
            {
                // Double : Default Tab

                Writer.WriteDouble( Data.New );

                break;
            }
            case historyitem_Presentation_RemoveSlide:
            case historyitem_Presentation_AddSlide:
            {
                var Pos = Data.UseArray ? Data.PosArray[0] : Data.Pos;
                Writer.WriteLong(Pos);
                Writer.WriteString2(Data.Id);
                break;
            }
            case historyitem_Presentation_SlideSize:
            {
                Writer.WriteDouble(Data.newW);
                Writer.WriteDouble(Data.newH);
                break;
            }
            case historyitem_Presentation_AddSlideMaster:
            {
                Writer.WriteLong(Data.pos);
                Writer.WriteString2(Data.master.Get_Id());
                break;
            }
        }

        return Writer;
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
            case historyitem_Presentation_AddSlide:
            {
                var pos = this.m_oContentChanges.Check( contentchanges_Add, Reader.GetLong());
                var Id = Reader.GetString2();
                this.Slides.splice(pos, 0, g_oTableId.Get_ById(Id));
                CollaborativeEditing.Add_ChangedClass(this);
                break;
            }
            case historyitem_Presentation_RemoveSlide:
            {
                var pos = Reader.GetLong();
                Reader.GetString2();

                var ChangesPos = this.m_oContentChanges.Check( contentchanges_Remove, pos);

                // действие совпало, не делаем его
                if ( false === ChangesPos )
                    break;
                this.slidesToUnlock.push(ChangesPos);
                this.Slides.splice(ChangesPos, 1);
                break;
            }

            case historyitem_Presentation_SlideSize:
            {
                var w = Reader.GetDouble();
                var h = Reader.GetDouble();
                var kw = w/this.Width;
                var kh = h/this.Height;
                this.Width = w;
                this.Height = h;
                this.changeSlideSizeFunction(kw, kh);
                editor.asc_fireCallback("asc_onPresentationSize", this.Width, this.Height);

                break;
            }
            case historyitem_Presentation_AddSlideMaster:
            {
                var pos = Reader.GetLong();
                var id = Reader.GetString2();
                this.slideMasters.splice(pos, 0, g_oTableId.Get_ById(id));
                this.bGoToPage = true;
                break;
            }
        }
        return true;
    },



//-----------------------------------------------------------------------------------
// Функции для работы с комментариями
//-----------------------------------------------------------------------------------
    Add_Comment : function(CommentData)
    {
        if(this.Slides[this.CurPage])
        {
            History.Create_NewPoint();
            var Comment = new CComment( this.Comments, CommentData );
            Comment.selected = true;
            var slide = this.Slides[this.CurPage];
            var selected_objects = slide.graphicObjects.selection.groupSelection ? slide.graphicObjects.selection.groupSelection.selectedObjects : slide.graphicObjects.selectedObjects;
            if(selected_objects.length  > 0)
            {
                var last_object = selected_objects[selected_objects.length - 1];
                Comment.setPosition(last_object.x + last_object.extX, last_object.y);
            }
            else
            {
                Comment.setPosition(this.Slides[this.CurPage].commentX, this.Slides[this.CurPage].commentY);
            }
            var Flags = 0;
            var dd = editor.WordControl.m_oDrawingDocument;
            var W = dd.GetCommentWidth(Flags);
            var  H = dd.GetCommentHeight(Flags);
            this.Slides[this.CurPage].commentX += W;
            this.Slides[this.CurPage].commentY += H;

            if(this.Document_Is_SelectionLocked(changestype_AddComment, Comment) === false)
            {
                for(var i = this.Slides[this.CurPage].slideComments.comments.length - 1; i > -1; --i)
                {
                    this.Slides[this.CurPage].slideComments.comments[i].selected = false;
                }
                this.Slides[this.CurPage].addComment(Comment);

                this.DrawingDocument.OnRecalculatePage(this.CurPage, this.Slides[this.CurPage]);
                this.DrawingDocument.OnEndRecalculate();
                this.Document_UpdateInterfaceState();
                return Comment;
            }
            else
            {
                this.Document_Undo();
            }
        }
    },

    Change_Comment : function(Id, CommentData)
    {
        if(this.Document_Is_SelectionLocked(changestype_MoveComment, Id) === false)
        {
            History.Create_NewPoint();
            var comment = g_oTableId.Get_ById(Id);
            if(isRealObject(comment))
            {
                var slides = this.Slides;
                var check_slide = null;
                var slide_num = null;
                for(var i = 0; i < slides.length; ++i)
                {
                    if(slides[i].slideComments)
                    {
                        var comments = slides[i].slideComments.comments;
                        for(var j = 0; j < comments.length; ++j)
                        {
                            if(comments[j] === comment)
                            {
                                check_slide = slides[i];
                                slide_num = i;
                                break;
                            }
                        }
                        if(j < comments.length)
                        {
                            break;
                        }
                    }
                }
                if(isRealObject(check_slide))
                {
                    this.DrawingDocument.m_oWordControl.GoToPage(slide_num);
                    this.Slides[this.CurPage].changeComment( Id, CommentData );
                    editor.sync_ChangeCommentData( Id, CommentData );
                    this.Recalculate()
                }
                else
                {
                    return true;
                }
            }
        }

    },

    Remove_Comment : function(Id, bSendEvent)
    {
        if ( null === Id )
            return;

        for(var i = 0; i < this.Slides.length; ++i)
        {
            var comments =   this.Slides[i].slideComments.comments;
            for(var j = 0; j < comments.length; ++j)
            {
                if(comments[j].Id === Id)
                {
                    //this.Set_CurPage(i);

                    this.DrawingDocument.m_oWordControl.GoToPage(i);

                    this.Slides[i].removeComment(Id);
                    if ( true === bSendEvent )
                        editor.sync_RemoveComment( Id );
                    return;
                }
            }
        }
        editor.sync_HideComment();
    },

    CanAdd_Comment : function()
    {
        return true;
    },

    Select_Comment : function(Id)
    {

    },

    Show_Comment : function(Id)
    {

        for(var i = 0; i < this.Slides.length; ++i)
        {
            var comments =   this.Slides[i].slideComments.comments;
            for(var j = 0; j < comments.length; ++j)
            {
                if(comments[j].Id === Id)
                {
                    //this.Set_CurPage(i);
                    this.DrawingDocument.m_oWordControl.GoToPage(i);

                    var Coords = this.DrawingDocument.ConvertCoordsToCursorWR_Comment(comments[j].x, comments[j].y, i);
                    this.Slides[i].graphicObjects.showComment(Id, Coords.X, Coords.Y);
                    return;
                }
            }
        }
        editor.sync_HideComment();
    },

    Show_Comments : function()
    {
    },

    Hide_Comments : function()
    {
        //this.Slides[this.CurPage].graphicObjects.hideComment();
    },
//-----------------------------------------------------------------------------------
// Функции для работы с textbox
//-----------------------------------------------------------------------------------
    TextBox_Put : function(sText)
    {
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
        // На случай, если Count = 0
            this.TurnOffRecalc = false;
        }
    },

    StartAddShape: function(preset, _is_apply)
    {
        if(this.Slides[this.CurPage])
        {
            if(!(_is_apply === false))
            {
                this.Slides[this.CurPage].graphicObjects.startTrackNewShape(preset);
            }
            else
            {
                //this.Slides[this.CurPage].graphicObjects.clearTrackObjects();
                //this.Slides[this.CurPage].graphicObjects.clearPreTrackObjects();
                //this.Slides[this.CurPage].graphicObjects.resetSelectionState();
                //this.DrawingDocument.m_oWordControl.OnUpdateOverlay();
                editor.sync_EndAddShape();
            }
        }
    },

    CalculateComments : function()
    {
        this.CommentAuthors = {};
        var _AuthorId = 0;
        var _slidesCount = this.Slides.length;

        var _uniIdSplitter = ";__teamlab__;";
        for (var _sldIdx = 0; _sldIdx < _slidesCount; _sldIdx++)
        {
            this.Slides[_sldIdx].writecomments = [];

            var _comments = this.Slides[_sldIdx].slideComments.comments;
            var _commentsCount = _comments.length;

            for (var i = 0; i < _commentsCount; i++)
            {
                var _data = _comments[i].Data;
                var _commId = 0;

                var _autID = _data.m_sUserId + _uniIdSplitter + _data.m_sUserName;
                var _author = this.CommentAuthors[_autID];
                if (!_author)
                {
                    this.CommentAuthors[_autID] = new CCommentAuthor();
                    _author = this.CommentAuthors[_autID];
                    _author.Name = _data.m_sUserName;
                    _author.Calculate();

                    _AuthorId++;
                    _author.Id = _AuthorId;
                }

                _author.LastId++;
                _commId = _author.LastId;

                var _new_data = new CWriteCommentData();
                _new_data.Data = _data;
                _new_data.WriteAuthorId = _author.Id;
                _new_data.WriteCommentId = _commId;
                _new_data.WriteParentAuthorId = 0;
                _new_data.WriteParentCommentId = 0;
                _new_data.x = _comments[i].x;
                _new_data.y = _comments[i].y;

                _new_data.Calculate();
                this.Slides[_sldIdx].writecomments.push(_new_data);

                var _comments2 = _data.m_aReplies;
                var _commentsCount2 = _comments2.length;

                for (var j = 0; j < _commentsCount2; j++)
                {
                    var _data2 = _comments2[j];

                    var _autID2 = _data2.m_sUserId + _uniIdSplitter + _data2.m_sUserName;
                    var _author2 = this.CommentAuthors[_autID2];
                    if (!_author2)
                    {
                        this.CommentAuthors[_autID2] = new CCommentAuthor();
                        _author2 = this.CommentAuthors[_autID2];
                        _author2.Name = _data2.m_sUserName;
                        _author2.Calculate();

                        _AuthorId++;
                        _author2.Id = _AuthorId;
                    }

                    _author2.LastId++;

                    var _new_data2 = new CWriteCommentData();
                    _new_data2.Data = _data2;
                    _new_data2.WriteAuthorId = _author2.Id;
                    _new_data2.WriteCommentId = _author2.LastId;
                    _new_data2.WriteParentAuthorId = _author.Id;
                    _new_data2.WriteParentCommentId = _commId;
                    _new_data2.x = _new_data.x;
                    _new_data2.y = _new_data.y + 136 * (j + 1); // так уж делает микрософт
                    _new_data2.Calculate();
                    this.Slides[_sldIdx].writecomments.push(_new_data2);
                }
            }
        }
    }
};
