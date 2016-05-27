"use strict";

// Import
var align_Left = AscCommon.align_Left;
var align_Justify = AscCommon.align_Justify;
var vertalign_Baseline = AscCommon.vertalign_Baseline;
var changestype_Drawing_Props = AscCommon.changestype_Drawing_Props;
var g_oTableId = AscCommon.g_oTableId;
var Editor_Copy = AscCommon.Editor_Copy;
var Editor_Paste = AscCommon.Editor_Paste;
var isRealObject = AscCommon.isRealObject;
var History = AscCommon.History;

var CreateUnifillSolidFillSchemeColor = AscFormat.CreateUnifillSolidFillSchemeColor;

var recalcSlideInterval = 30;

function SlideCopyObject(Slide, ImageUrl)
{
    this.Slide = Slide;
    this.ImageUrl = ImageUrl;
}

function DrawingCopyObject(Drawing, X, Y, ExtX, ExtY, ImageUrl)
{
    this.Drawing = Drawing;
    this.X = X;
    this.Y = Y;
    this.ExtX = ExtX;
    this.ExtY = ExtY;
    this.ImageUrl = ImageUrl;
}

function PresentationSelectedContent()
{
    this.SlideObjects = [];
    this.Drawings = [];
    this.DocContent = null;
}

function CreatePresentationTableStyles(Styles, IdMap)
{
    function CreateMiddleStyle2(schemeId)
    {
        var style = new CStyle("Middle Style 2 - accent " + (schemeId + 1), null, null, styletype_Table);
        //style.Id = "{" + GUID() + "}";
        style.TablePr.Set_FromObject(
            {
                TableBorders:
                {
                    Left:
                    {
                        Color : { r : 0, g : 0, b : 0 },
                        Unifill : CreateUnifillSolidFillSchemeColor(12, 0),
                        Space : 0,
                        Size  : 12700/36000,
                        Value : border_Single
                    },

                    Right:
                    {
                        Color : { r : 0, g : 0, b : 0 },
                        Unifill : CreateUnifillSolidFillSchemeColor(12, 0),
                        Space : 0,
                        Size  : 12700/36000,
                        Value : border_Single
                    },

                    Top:
                    {
                        Color : { r : 0, g : 0, b : 0 },
                        Unifill : CreateUnifillSolidFillSchemeColor(12, 0),
                        Space : 0,
                        Size  : 12700/36000,
                        Value : border_Single
                    },

                    Bottom:
                    {
                        Color : { r : 0, g : 0, b : 0 },
                        Unifill : CreateUnifillSolidFillSchemeColor(12, 0),
                        Space : 0,
                        Size  : 12700/36000,
                        Value : border_Single
                    },

                    InsideH:
                    {
                        Color : { r : 0, g : 0, b : 0 },
                        Unifill : CreateUnifillSolidFillSchemeColor(12, 0),
                        Space : 0,
                        Size  : 12700/36000,
                        Value : border_Single
                    },

                    InsideV:
                    {
                        Color : { r : 0, g : 0, b : 0 },
                        Unifill : CreateUnifillSolidFillSchemeColor(12, 0),
                        Space : 0,
                        Size  : 12700/36000,
                        Value : border_Single
                    }
                }
            }
        );
        style.TableWholeTable.Set_FromObject(
            {
                TextPr:
                {
                    FontRef: AscFormat.CreateFontRef(AscFormat.fntStyleInd_minor, AscFormat.CreatePresetColor("black")),
                    Unifill:  CreateUnifillSolidFillSchemeColor(8, 0)
                },
                TableCellPr:
                {
                    Shd:
                    {
                        Unifill: CreateUnifillSolidFillSchemeColor(schemeId, 0.2)
                    }
                }
            }
        );
        var styleObject =    {
            TableCellPr:
            {
                Shd:
                {
                    Unifill: CreateUnifillSolidFillSchemeColor(schemeId, 0.4)
                }
            }
        };
        style.TableBand1Horz.Set_FromObject(styleObject);
        style.TableBand1Vert.Set_FromObject(styleObject);

        styleObject = {
            TextPr:
            {
                Bold: true,
                FontRef: AscFormat.CreateFontRef(AscFormat.fntStyleInd_minor, AscFormat.CreatePresetColor("black")),
                Unifill:  CreateUnifillSolidFillSchemeColor(8, 0)
            },
            TableCellPr:
            {
                Shd:
                {
                    Unifill: CreateUnifillSolidFillSchemeColor(schemeId, 0)
                }
            }
        };
        style.TableLastCol.Set_FromObject(styleObject);
        style.TableFirstCol.Set_FromObject(styleObject);

        styleObject.TableCellPr.TableCellBorders =
        {
            Top:
            {
                Color : { r : 0, g : 0, b : 0 },
                Unifill : CreateUnifillSolidFillSchemeColor(12, 0),
                Space : 0,
                Size  : 38100/36000,
                Value : border_Single
            }
        };
        style.TableLastRow.Set_FromObject(styleObject);
        styleObject.TableCellPr.TableCellBorders =
        {
            Bottom:
            {
                Color : { r : 0, g : 0, b : 0 },
                Unifill : CreateUnifillSolidFillSchemeColor(12, 0),
                Space : 0,
                Size  : 38100/36000,
                Value : border_Single
            }
        };
        styleObject.TextPr =
        {
            Bold: true,
            FontRef: AscFormat.CreateFontRef(AscFormat.fntStyleInd_minor, AscFormat.CreatePresetColor("black")),
            Unifill:  CreateUnifillSolidFillSchemeColor(12, 0)
        };
        style.TableFirstRow.Set_FromObject(styleObject);
        return style;
    }
    var def = CreateMiddleStyle2(0), style;

    style = CreateMiddleStyle2(8);
    Styles.Add(style);
    IdMap[style.Id] = true;

    Styles.Add(def);
    IdMap[def.Id] = true;
    for(var i = 1; i < 6; ++i)
    {
        style = CreateMiddleStyle2(i);
        Styles.Add(style);
        IdMap[style.Id] = true;
    }


    return def.Id;
}


function CShowPr(){
    this.browse        = undefined;
    this.kiosk         = undefined; //{restart: uInt}
    this.penClr        = undefined;
    this.present       = false;
    this.show          = undefined;// {showAll: true/false, range: {start: uInt, end: uInt}, custShow: uInt};
    this.loop          = undefined;
    this.showAnimation = undefined;
    this.showNarration = undefined;
    this.useTimings    = undefined;
}

CShowPr.prototype.Write_ToBinary = function(w){
    var nStartPos = w.GetCurPosition();
    w.Skip(4);
    var Flags = 0;
    if(AscFormat.isRealBool(this.browse)){
        Flags |= 1;
        w.WriteBool(this.browse);
    }
    if(isRealObject(this.kiosk)){
        Flags |= 2;
        if(AscFormat.isRealNumber(this.kiosk.restart)){
            Flags |= 4;
            w.WriteLong(this.kiosk.restart);
        }
    }
    if(isRealObject(this.penClr)){
        Flags |= 8;
        this.penClr.Write_ToBinary(w);
    }
    w.WriteBool(this.present);
    if(isRealObject(this.show)){
        Flags |= 16;
        w.WriteBool(this.show.showAll);
        if(!this.show.showAll){
           if(this.show.range){
               Flags |= 32;
               w.WriteLong(this.range.start);
               w.WriteLong(this.range.end);
           }
           else if(AscFormat.isRealNumber(this.show.custShow)){
               Flags |= 64;
               w.WriteLong(this.show.custShow);
           }
        }
    }
    if(AscFormat.isRealBool(this.loop)){
        Flags |= 128;
        w.WriteBool(this.loop);
    }
    if(AscFormat.isRealBool(this.showAnimation)){
        Flags |= 256;
        w.WriteBool(this.showAnimation);
    }
    if(AscFormat.isRealBool(this.showNarration)){
        Flags |= 512;
        w.WriteBool(this.showNarration);
    }
    if(AscFormat.isRealBool(this.useTimings)){
        Flags |= 1024;
        w.WriteBool(this.useTimings);
    }
    var nEndPos = w.GetCurPosition();
    w.Seek(nStartPos);
    w.WriteLong(Flags);
    w.Seek(nEndPos);
}

CShowPr.prototype.Read_FromBinary = function(r){
    var Flags = r.GetLong();
    if(Flags & 1){
        this.browse = r.GetBool();
    }
    if(Flags & 2){
        this.kiosk = {};
        if(Flags & 4){
            this.kiosk.restart = r.GetLong();
        }
    }
    if(Flags & 8){
        this.penClr = new AscFormat.CUniColor();
        this.penClr.Read_FromBinary(r);
    }
    this.present = r.Read_FromBinary(r);
    if(Flags & 16){
        this.show = {};
        this.show.showAll = r.GetBool();
        if(Flags & 32){
            var start = r.GetLong();
            var end = r.GetLong();
            this.show.range = {start: start, end: end};
        }
        else if(Flags & 64){
            this.show.custShow = r.GetLong();
        }
    }
    if(Flags & 128){
        this.loop = r.GetBool();
    }
    if(Flags & 256){
        this.showAnimation = r.GetBool();
    }
    if(Flags & 512){
        this.showNarration = r.GetBool();
    }
    if(Flags & 1024){
        this.useTimings = r.GetBool();
    }
}

CShowPr.prototype.Copy = function(){
    var oCopy = new CShowPr();
    oCopy.browse = this.browse;
    if(isRealObject(this.kiosk)){
        oCopy.kiosk = {};
        if(AscFormat.isRealBool(this.kiosk.restart)){
            oCopy.kiosk.restart = this.kiosk.restart;
        }
    }
    if(this.penClr){
        oCopy.penClr = this.penClr.createDuplicate();
    }
    oCopy.present = this.present;
    if(isRealObject(this.show)){
        oCopy.show = {};
        oCopy.show.showAll = this.show.showAll;
        if(isRealObject(this.show.range)){
            oCopy.show.range = {start: this.show.range.start, end: this.show.range.end};
        }
        else if(AscFormat.isRealNumber(this.show.custShow)){
            oCopy.show.custShow = this.show.custShow;
        }
    }
    oCopy.loop          = this.loop;
    oCopy.showAnimation = this.showAnimation;
    oCopy.showNarration = this.showNarration;
    oCopy.useTimings    = this.useTimings;
    return oCopy;
}


function CPresentation(DrawingDocument)
{
    this.History              = History;
    this.IdCounter            = AscCommon.g_oIdCounter;
    this.TableId              = g_oTableId;
    this.CollaborativeEditing = (("undefined" !== typeof(CCollaborativeEditing) && AscCommon.CollaborativeEditing instanceof CCollaborativeEditing) ? AscCommon.CollaborativeEditing : null);
    this.Api                  = editor;
    //------------------------------------------------------------------------
    if (DrawingDocument)
    {
        if (this.History)
            this.History.Set_LogicDocument(this);

        if (this.CollaborativeEditing)
            this.CollaborativeEditing.m_oLogicDocument = this;
    }

    //------------------------------------------------------------------------

    this.Id = AscCommon.g_oIdCounter.Get_NewId();

    this.StartPage = 0; // Для совместимости с CDocumentContent
    this.CurPage   = 0;

    this.Orientation = Asc.c_oAscPageOrientation.PagePortrait; // ориентация страницы

    this.slidesToUnlock = [];


    this.TurnOffRecalc = false;

    this.DrawingDocument = DrawingDocument;

    this.SearchEngine = new CDocumentSearch();

    this.NeedUpdateTarget = false;

    this.noShowContextMenu = false;

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


    this.Lock = new AscCommon.CLock();

    this.m_oContentChanges = new AscCommon.CContentChanges(); // список изменений(добавление/удаление элементов)


    this.Slides = [];
    this.themes       = [];
    this.slideMasters = [];
    this.slideLayouts = [];
    this.notesMasters = [];
    this.notes        = [];
    this.globalTableStyles = null;


    this.Width = 254;
    this.Height = 142;
    this.updateSlideIndex = false;
    this.recalcMap = {};
    this.bClearSearch = true;
    this.bNeedUpdateTh = false;
    this.needSelectPages = [];

    this.forwardChangeThemeTimeOutId = null;
    this.backChangeThemeTimeOutId = null;
    this.startChangeThemeTimeOutId = null;
    this.TablesForInterface = null;
    this.LastTheme = null;
    this.LastColorScheme = null;
    this.LastColorMap = null;
    this.LastTableLook = null;
    this.DefaultSlideTiming = new CAscSlideTiming();
    this.DefaultSlideTiming.setDefaultParams();

    this.DefaultTableStyleId = null;
    this.TableStylesIdMap = {};
    this.bNeedUpdateChartPreview = false;
    this.LastUpdateTargetTime             = 0;
    this.NeedUpdateTargetForCollaboration = false;
    this.oLastCheckContent = null;
    // Добавляем данный класс в таблицу Id (обязательно в конце конструктора)
    g_oTableId.Add( this, this.Id );
   //
   this.themeLock = new PropLocker(this.Id);
   this.schemeLock = new PropLocker(this.Id);
   this.slideSizeLock = new PropLocker(this.Id);

    this.CommentAuthors = {};
    this.createDefaultTableStyles();
    this.bGoToPage = false;

    this.custShowList = [];
    this.clrMru = [];
    this.prnPr  = null;
    this.showPr = null;
}

CPresentation.prototype =
{
    setShowLoop: function(value){
        if(value === false){
            if(!this.showPr){
                return;
            }
            else{
                if(this.showPr.loop !== false){
                    var oCopyShowPr = this.showPr.Copy();
                    oCopyShowPr.loop = false;
                    this.setShowPr(oCopyShowPr);
                }
            }
        }
        else{
            if(!this.showPr){
                var oShowPr = new CShowPr();
                oShowPr.loop = true;
                this.setShowPr(oShowPr);
            }
            else{
                if(!this.showPr.loop){
                    var oCopyShowPr = this.showPr.Copy();
                    oCopyShowPr.loop = true;
                    this.setShowPr(oCopyShowPr);
                }
            }
        }
    },

    isLoopShowMode: function(){
        if(this.showPr){
            return this.showPr.loop === true;
        }
        return false;
    },


    setShowPr: function(oShowPr){
        History.Add(this, {Type: AscDFH.historyitem_Presentation_SetShowPr, oldPr: this.showPr, newPr: oShowPr});
        this.showPr = oShowPr;
    },

    createDefaultTableStyles: function()
    {
        //AscFormat.ExecuteNoHistory(function(){
            this.globalTableStyles = new CStyles();
            this.DefaultTableStyleId = CreatePresentationTableStyles(this.globalTableStyles, this.TableStylesIdMap);
        //}, this, []);
    },
    // Проводим начальные действия, исходя из Документа
    Init : function()
    {

    },

    Get_Api: function(){
        return this.Api;
    },

    Get_CollaborativeEditing: function(){
        return this.CollaborativeEditing;
    },

    addSlideMaster: function(pos, master)
    {
        History.Add(this, {Type: AscDFH.historyitem_Presentation_AddSlideMaster, pos: pos, master: master});
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

    EndPreview_MailMergeResult: function()
    {},

    CheckNeedUpdateTargetForCollaboration: function(){
        if(!this.NeedUpdateTargetForCollaboration){
            if(this.Slides[this.CurPage]){
                var oTargetDocContent = this.Slides[this.CurPage].graphicObjects.getTargetDocContent();
                if(oTargetDocContent !== this.oLastCheckContent){
                    this.oLastCheckContent = oTargetDocContent;
                    return true;
                }
            }
            return false;
        }
        return true;
    },


    Is_OnRecalculate: function()
    {
        return true;
    },
    Continue_FastCollaborativeEditing: function()
    {
        if (true !== AscCommon.CollaborativeEditing.Is_Fast() || true === this.CollaborativeEditing.Is_SingleUser())
            return;

        if(this.Slides[this.CurPage]){
            if(this.Slides[this.CurPage].graphicObjects.checkTrackDrawings()){
                return;
            }
        }

        var bHaveChanges = History.Have_Changes(true);
        if (true !== bHaveChanges && true === AscCommon.CollaborativeEditing.Have_OtherChanges())
        {
            // Принимаем чужие изменение. Своих нет, но функцию отсылки надо вызвать, чтобы снялить локи.
            AscCommon.CollaborativeEditing.Apply_Changes();
            AscCommon.CollaborativeEditing.Send_Changes();
        }
        else if (true === bHaveChanges || true === AscCommon.CollaborativeEditing.Have_OtherChanges())
        {
            editor.asc_Save(true);
        }

        var CurTime = new Date().getTime();
        if (this.CheckNeedUpdateTargetForCollaboration() && (CurTime - this.LastUpdateTargetTime > 1000))
        {
            this.NeedUpdateTargetForCollaboration = false;
            if (true !== bHaveChanges)
            {
                var CursorInfo = History.Get_DocumentPositionBinary();
                if (null !== CursorInfo)
                {
                    editor.CoAuthoringApi.sendCursor(CursorInfo);
                    this.LastUpdateTargetTime = CurTime;
                }
            }
            else
            {
                this.LastUpdateTargetTime = CurTime;
            }
        }
    },

    Get_DocumentPositionInfoForCollaborative: function(){
        if(this.Slides[this.CurPage]){
            var oTargetDocContent = this.Slides[this.CurPage].graphicObjects.getTargetDocContent(undefined, true);
            if(oTargetDocContent){
                var DocPos = oTargetDocContent.Get_ContentPosition(oTargetDocContent.Is_SelectionUse(), false);
                if (!DocPos || DocPos.length <= 0)
                    return null;

                var Last = DocPos[DocPos.length - 1];
                if (!(Last.Class instanceof ParaRun))
                    return {Class: this, Position: 0};

                return Last;
            }
        }
        return {Class: this, Position: 0};
    },

    GetRecalculateMaps: function()
    {
        var ret = {
            layouts: {},
            masters: {}
        };

        for(var i = 0; i < this.Slides.length; ++i)
        {
            if(this.Slides[i].Layout)
            {
                ret.layouts[this.Slides[i].Layout.Id] = this.Slides[i].Layout;
                if(this.Slides[i].Layout.Master)
                {
                    ret.masters[this.Slides[i].Layout.Master.Id] = this.Slides[i].Layout.Master;
                }
            }
        }
        return ret;
    },


    Recalculate : function(RecalcData)
    {
        if (undefined === RecalcData)
        {
            // Проверяем можно ли сделать быстрый пересчет
            var SimpleChanges = History.Is_SimpleChanges();
            if ( 1 === SimpleChanges.length )
            {
                var Run  = SimpleChanges[0].Class;
                var Para = Run.Paragraph;
                var Res  = Para.Recalculate_FastRange( SimpleChanges );
                if ( -1 !== Res )
                {
                    if( this.Slides[this.CurPage])
                    {
                        this.DrawingDocument.OnRecalculatePage(this.CurPage, this.Slides[this.CurPage]);
                        this.DrawingDocument.OnEndRecalculate();
                    }
                    History.Get_RecalcData();
                    History.Reset_RecalcIndex();
                    var DrawingShape = Para.Parent.Is_DrawingShape(true);
                    if(DrawingShape && DrawingShape.recalcInfo && DrawingShape.recalcInfo.recalcTitle)
                    {
                        DrawingShape.recalcInfo.bRecalculatedTitle = true;
                        DrawingShape.recalcInfo.recalcTitle = null;
                    }
                    return;
                }
            }
        }
        if(this.bClearSearch)
        {
            this.SearchEngine.Clear();
            this.bClearSearch = false;
        }
        var _RecalcData = RecalcData ? RecalcData : History.Get_RecalcData(), key, recalcMap, bSync = true, i, bRedrawAllSlides = false, aToRedrawSlides = [], redrawSlideIndexMap = {}, slideIndex;
        this.updateSlideIndexes();
        var b_check_layout = false;
        if(_RecalcData.Drawings.All || _RecalcData.Drawings.ThemeInfo)
        {
            b_check_layout = true;
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
            this.bNeedUpdateChartPreview = true;
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
                aToRedrawSlides = [].concat(_RecalcData.Drawings.ThemeInfo.ArrInd);
                AscFormat.redrawSlide(oThis.Slides[_RecalcData.Drawings.ThemeInfo.ArrInd[startRecalcIndex]], oThis, aToRedrawSlides, startRecalcIndex,  0, oThis.Slides);
            }
            else
            {
                bRedrawAllSlides = true;
                for(key = 0; key < this.Slides.length; ++key)
                {
                    this.Slides[key].recalcText();
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
                    if(_RecalcData.Drawings.Map[key].getSlideIndex)
                    {
                        slideIndex = _RecalcData.Drawings.Map[key].getSlideIndex();
                        if(slideIndex !== null)
                        {
                            if(redrawSlideIndexMap[slideIndex] !== true )
                            {
                                redrawSlideIndexMap[slideIndex] = true;
                                aToRedrawSlides.push(slideIndex);
                            }
                        }
                    }
                }
            }
        }
        History.Reset_RecalcIndex();
        this.RecalculateCurPos();
        if(bSync)
        {
            if(bRedrawAllSlides)
            {
                for(i = 0; i < this.Slides.length; ++i)
                {
                    this.DrawingDocument.OnRecalculatePage(i, this.Slides[i]);
                }
            }
            else
            {
                aToRedrawSlides.sort(AscCommon.fSortAscending);
                for(i = 0; i < aToRedrawSlides.length; ++i)
                {
                    this.DrawingDocument.OnRecalculatePage(aToRedrawSlides[i], this.Slides[aToRedrawSlides[i]]);
                }
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
            else if(b_check_layout)
            {
                this.DrawingDocument.m_oWordControl.CheckLayouts();
            }
            if(this.needSelectPages.length > 0)
            {
                //for(slideIndex = 0; i < this.needSelectPages.length; ++i)
                //{
                //    this.DrawingDocument.SelectPage(this.needSelectPages[slideIndex]);
                //}
                this.needSelectPages.length = 0;
            }
            if(this.bNeedUpdateTh)
            {
                this.DrawingDocument.UpdateThumbnailsAttack();
                this.bNeedUpdateTh = false;
            }
        }
        if(this.Slides[this.CurPage])
            this.Slides[this.CurPage].graphicObjects.updateSelectionState();
        for(i = 0; i < this.slidesToUnlock.length; ++i)
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
        {
            this.Slides[this.CurPage].graphicObjects.recalculateCurPos();
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


    Update_ForeignCursor: function(CursorInfo, UserId, Show, UserShortId)
    {
        if (!editor.User)
            return;

        if (UserId === editor.CoAuthoringApi.getUserConnectionId())
            return;

        if (!CursorInfo)
        {
            this.DrawingDocument.Collaborative_RemoveTarget(UserId);
            AscCommon.CollaborativeEditing.Remove_ForeignCursor(UserId);
            return;
        }

        var Changes = new AscCommon.CCollaborativeChanges();
        var Reader = Changes.Internal_Load_Data2(CursorInfo, 0, CursorInfo.length);

        var RunId    = Reader.GetString2();
        var InRunPos = Reader.GetLong();

        var Run = g_oTableId.Get_ById(RunId);
        if (!(Run instanceof ParaRun)){
            this.DrawingDocument.Collaborative_RemoveTarget(UserId);
            AscCommon.CollaborativeEditing.Remove_ForeignCursor(UserId);
            return;
        }

        var CursorPos = [{Class : Run, Position : InRunPos}];
        Run.Get_DocumentPositionFromObject(CursorPos);
        AscCommon.CollaborativeEditing.Add_ForeignCursor(UserId, CursorPos, UserShortId);

        if (true === Show){

            var oTargetDocContentOrTable, oCurSlide = this.Slides[this.CurPage];
            if(oCurSlide){
                oTargetDocContentOrTable = oCurSlide.graphicObjects.getTargetDocContent(undefined, true);
            }

            if(!oTargetDocContentOrTable){
                return;
            }
            var bTable = (oTargetDocContentOrTable instanceof CTable);
            AscCommon.CollaborativeEditing.Update_ForeignCursorPosition(UserId, Run, InRunPos, true, oTargetDocContentOrTable, bTable);
        }
    },

    Remove_ForeignCursor: function(UserId)
    {
        this.DrawingDocument.Collaborative_RemoveTarget(UserId);
    },



// Отрисовка содержимого Документа
    Draw : function(nPageIndex, pGraphics){
		if(!pGraphics.IsSlideBoundsCheckerType){
        AscCommon.CollaborativeEditing.Update_ForeignCursorsPositions();
		}
        this.Slides[nPageIndex] && this.Slides[nPageIndex].draw(pGraphics);
    },

    Add_NewParagraph : function(bRecalculate)
    {
        this.Slides[this.CurPage] && this.Slides[this.CurPage].graphicObjects.checkSelectedObjectsAndCallback(this.Slides[this.CurPage].graphicObjects.addNewParagraph, [], false, AscDFH.historydescription_Presentation_AddNewParagraph);
        this.Document_UpdateInterfaceState();
    },

    Search : function(Str, Props)
    {
        if ( true === this.SearchEngine.Compare( Str, Props ) )
            return this.SearchEngine;
        this.SearchEngine.Clear();
        this.SearchEngine.Set( Str, Props );

        for(var i = 0; i < this.Slides.length; ++i)
        {
            this.Slides[i].Search( Str, Props, this.SearchEngine, search_Common );
        }
        this.DrawingDocument.ClearCachePages();
        this.DrawingDocument.FirePaint();
        this.bClearSearch = true;
        return this.SearchEngine;
    },

    Search_GetId : function(isNext)
    {
        if(this.Slides.length > 0)
        {
            var i, Id, content, start_index;
            var target_text_object = AscFormat.getTargetTextObject(this.Slides[this.CurPage].graphicObjects);
            if(target_text_object)
            {
                if(target_text_object.getObjectType() === AscDFH.historyitem_type_GraphicFrame)
                {
                    Id = target_text_object.graphicObject.Search_GetId(isNext, true);
                    if(Id !== null)
                    {
                        return Id;
                    }
                }
                else
                {
                    content = target_text_object.getDocContent();
                    if(content)
                    {
                        Id = content.Search_GetId(isNext, true);
                        if(Id !== null)
                        {
                            return Id;
                        }
                    }
                }
            }
            var sp_tree = this.Slides[this.CurPage].cSld.spTree, group_shapes, group_start_index;
            if(isNext)
            {
                if(this.Slides[this.CurPage].graphicObjects.selection.groupSelection)
                {
                    group_shapes = this.Slides[this.CurPage].graphicObjects.selection.groupSelection.arrGraphicObjects;
                    for(i = 0; i < group_shapes.length; ++i)
                    {
                        if(group_shapes[i].selected && group_shapes[i].getObjectType() === AscDFH.historyitem_type_Shape)
                        {
                            content = group_shapes[i].getDocContent();
                            if(content)
                            {
                                Id = content.Search_GetId(isNext, isRealObject(target_text_object));
                                if(Id !== null)
                                {
                                    return Id;
                                }
                            }
                            group_start_index = i + 1;
                        }
                    }
                    for(i = group_start_index; i < group_shapes.length; ++i)
                    {
                        if(group_shapes[i].getObjectType() === AscDFH.historyitem_type_Shape)
                        {
                            content = group_shapes[i].getDocContent();
                            if(content)
                            {
                                Id = content.Search_GetId(isNext, false);
                                if(Id !== null)
                                {
                                    return Id;
                                }
                            }
                        }
                    }

                    for(i = 0; i < sp_tree.length; ++i)
                    {
                        if(sp_tree[i] === this.Slides[this.CurPage].graphicObjects.selection.groupSelection)
                        {
                            start_index = i + 1;
                            break;
                        }
                    }
                    if(i === sp_tree.length)
                    {
                        start_index = sp_tree.length;
                    }
                }
                else if(this.Slides[this.CurPage].graphicObjects.selectedObjects.length === 0)
                {
                    start_index = 0;
                }
                else
                {
                    for(i = 0; i < sp_tree.length; ++i)
                    {
                        if(sp_tree[i].selected)
                        {
                            start_index =  target_text_object ? i + 1 : i;
                            break;
                        }
                    }
                    if(i === sp_tree.length)
                    {
                        start_index = sp_tree.length;
                    }
                }
                Id = this.Slides[this.CurPage].Search_GetId(isNext, start_index);
                if(Id !== null)
                {
                    return Id;
                }
                for(i = this.CurPage + 1; i < this.Slides.length; ++i)
                {
                    Id = this.Slides[i].Search_GetId(isNext, 0);
                    if(Id !== null)
                    {
                        return Id;
                    }
                }
                for(i = 0; i < this.CurPage; ++i)
                {
                    Id = this.Slides[i].Search_GetId(isNext, 0);
                    if(Id !== null)
                    {
                        return Id;
                    }
                }
            }
            else
            {
                if(this.Slides[this.CurPage].graphicObjects.selection.groupSelection)
                {
                    group_shapes = this.Slides[this.CurPage].graphicObjects.selection.groupSelection.arrGraphicObjects;
                    for(i = group_shapes.length - 1; i > -1; --i)
                    {
                        if(group_shapes[i].selected && group_shapes[i].getObjectType() === AscDFH.historyitem_type_Shape)
                        {
                            content = group_shapes[i].getDocContent();
                            if(content)
                            {
                                Id = content.Search_GetId(isNext, isRealObject(target_text_object));
                                if(Id !== null)
                                {
                                    return Id;
                                }
                            }
                            group_start_index = i - 1;
                        }
                    }
                    for(i = group_start_index; i > -1; --i)
                    {
                        if(group_shapes[i].getObjectType() === AscDFH.historyitem_type_Shape)
                        {
                            content = group_shapes[i].getDocContent();
                            if(content)
                            {
                                Id = content.Search_GetId(isNext, false);
                                if(Id !== null)
                                {
                                    return Id;
                                }
                            }
                        }
                    }

                    for(i = 0; i < sp_tree.length; ++i)
                    {
                        if(sp_tree[i] === this.Slides[this.CurPage].graphicObjects.selection.groupSelection)
                        {
                            start_index = i - 1;
                            break;
                        }
                    }
                    if(i === sp_tree.length)
                    {
                        start_index = sp_tree.length;
                    }
                }
                else if(this.Slides[this.CurPage].graphicObjects.selectedObjects.length === 0)
                {
                    start_index = sp_tree.length - 1;
                }
                else
                {
                    for(i = sp_tree.length - 1; i > -1; --i)
                    {
                        if(sp_tree[i].selected)
                        {
                            start_index = target_text_object ? i - 1 : i;
                            break;
                        }
                    }
                    if(i === sp_tree.length)
                    {
                        start_index = -1;
                    }
                }
                Id = this.Slides[this.CurPage].Search_GetId(isNext, start_index);
                if(Id !== null)
                {
                    return Id;
                }
                for(i = this.CurPage - 1; i > -1; --i)
                {
                    Id = this.Slides[i].Search_GetId(isNext, this.Slides[i].cSld.spTree.length - 1);
                    if(Id !== null)
                    {
                        return Id;
                    }
                }
                for(i = this.Slides.length - 1; i > this.CurPage; --i)
                {
                    Id = this.Slides[i].Search_GetId(isNext, this.Slides[i].cSld.spTree.length - 1);
                    if(Id !== null)
                    {
                        return Id;
                    }
                }
            }
        }
        return null;
    },

    Search_Select : function(Id)
    {
        this.SearchEngine.Select(Id);

        this.Document_UpdateInterfaceState();
        this.Document_UpdateSelectionState();
       // this.Document_UpdateRulersState();
        editor.WordControl.OnUpdateOverlay();
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
        this.Slides[this.CurPage] && this.Slides[this.CurPage].graphicObjects.checkSelectedObjectsAndCallback(this.Slides[this.CurPage].graphicObjects.createGroup, [], false, AscDFH.historydescription_Presentation_CreateGroup);
        this.Document_UpdateInterfaceState();
    },

    unGroupShapes: function()
    {
        this.Slides[this.CurPage] && this.Slides[this.CurPage].graphicObjects.checkSelectedObjectsAndCallback(this.Slides[this.CurPage].graphicObjects.unGroupCallback, [], false, AscDFH.historydescription_Presentation_UnGroup);
        this.Document_UpdateInterfaceState();
    },

    Add_FlowImage : function(W, H, Img)
    {
        if(this.Slides[this.CurPage])
        {
            editor.WordControl.Thumbnails.SetFocusElement(FOCUS_OBJECT_MAIN);
            History.Create_NewPoint(AscDFH.historydescription_Presentation_AddFlowImage);
            var Image = this.Slides[this.CurPage].graphicObjects.createImage(Img, (this.Slides[this.CurPage].Width - W)/2, (this.Slides[this.CurPage].Height - H)/2, W, H);
            Image.setParent(this.Slides[this.CurPage]);
            Image.addToDrawingObjects();
            this.Slides[this.CurPage].graphicObjects.resetSelection();
            this.Slides[this.CurPage].graphicObjects.selectObject(Image, 0);
            this.Recalculate();
            this.Document_UpdateInterfaceState();
        }
    },

    addChart: function(binary)
    {
        var _this = this;
        _this.Slides[_this.CurPage] && _this.Slides[_this.CurPage].graphicObjects.checkSelectedObjectsAndCallback(function()
        {
            editor.WordControl.Thumbnails.SetFocusElement(FOCUS_OBJECT_MAIN);
            var Image = _this.Slides[_this.CurPage].graphicObjects.getChartSpace2(binary, null);
            Image.setParent(_this.Slides[_this.CurPage]);
            Image.addToDrawingObjects();
            Image.spPr.xfrm.setOffX((_this.Slides[_this.CurPage].Width - Image.spPr.xfrm.extX)/2);
            Image.spPr.xfrm.setOffY((_this.Slides[_this.CurPage].Height - Image.spPr.xfrm.extY)/2);
            _this.Slides[_this.CurPage].graphicObjects.resetSelection();
            _this.Slides[_this.CurPage].graphicObjects.selectObject(Image, 0);
            _this.Document_UpdateInterfaceState();
        }, [], false, AscDFH.historydescription_Presentation_AddChart);
    },

    Selection_Remove: function()
    {},

    Edit_Chart : function(binary)
    {
        var _this = this;
        _this.Slides[_this.CurPage] && _this.Slides[_this.CurPage].graphicObjects.checkSelectedObjectsAndCallback(function()
        {
            _this.Slides[_this.CurPage].graphicObjects.editChart(binary);
            _this.Document_UpdateInterfaceState();
        }, [binary], false, AscDFH.historydescription_Presentation_EditChart);
    },

    Get_ChartObject: function(type)
    {
        return this.Slides[this.CurPage].graphicObjects.getChartObject(type);
    },

    Check_GraphicFrameRowHeight: function(grFrame)
    {
        grFrame.recalculate();
        var content = grFrame.graphicObject.Content, i;
        for(i = 0; i < content.length; ++i)
        {
            var ResultHeight;
            ResultHeight = content[i].Height;
            var FirstCell = content[i].Content[0];
            if(FirstCell)
            {
                var oMargins = FirstCell.Get_Margins();
                if(oMargins)
                {
                    ResultHeight -= (oMargins.Top + oMargins.Bottom);
        }
            }
            content[i].Set_Height(ResultHeight, Asc.linerule_AtLeast );
        }
    },

    Add_FlowTable : function(Cols, Rows)
    {
        if(!this.Slides[this.CurPage])
            return;

        History.Create_NewPoint(AscDFH.historydescription_Presentation_AddFlowTable);
        var graphic_frame = this.Create_TableGraphicFrame(Cols, Rows, this.Slides[this.CurPage], this.DefaultTableStyleId);
        if(this.Document_Is_SelectionLocked(AscCommon.changestype_AddShape, graphic_frame) === false)
        {
            editor.WordControl.Thumbnails.SetFocusElement(FOCUS_OBJECT_MAIN);
            //this.Slides[this.CurPage].graphicObjects.resetSelection();
            //this.Slides[this.CurPage].graphicObjects.selectObject(graphic_frame, 0);
            this.Check_GraphicFrameRowHeight(graphic_frame);
            this.Slides[this.CurPage].addToSpTreeToPos(this.Slides[this.CurPage].cSld.spTree.length, graphic_frame);
            graphic_frame.Set_CurrentElement();
            graphic_frame.graphicObject.Cursor_MoveToStartPos();
            this.Recalculate();
            this.Document_UpdateInterfaceState();
            this.Document_UpdateSelectionState();
        }
        else
        {
            this.Document_Undo();
        }
    },


    Create_TableGraphicFrame : function(Cols, Rows, Parent, StyleId, Width, Height, PosX, PosY, bInline)
    {
        var W;
        if(AscFormat.isRealNumber(Width))
        {
            W = Width;
        }
        else
        {
            W = this.Width*2/3;
        }
        var X, Y;
        if(AscFormat.isRealNumber(PosX) && AscFormat.isRealNumber(PosY))
        {
            X = PosX;
            Y = PosY;
        }
        else
        {
            X = 0;
            Y = 0;
        }
        var Inline = false;
        if(AscFormat.isRealBool(bInline))
        {
            Inline = bInline;
        }
        var Grid = [];

        for ( var Index = 0; Index < Cols; Index++ )
            Grid[Index] = W / Cols;

        var RowHeight;
        if(AscFormat.isRealNumber(Height))
        {
            RowHeight = Height / Rows;
        }

        var graphic_frame = new AscFormat.CGraphicFrame();
        graphic_frame.setParent(Parent);
        graphic_frame.setSpPr(new AscFormat.CSpPr());
        graphic_frame.spPr.setParent(graphic_frame);
        graphic_frame.spPr.setXfrm(new AscFormat.CXfrm());
        graphic_frame.spPr.xfrm.setParent(graphic_frame.spPr);
        graphic_frame.spPr.xfrm.setOffX((this.Width - W)/2);
        graphic_frame.spPr.xfrm.setOffY(this.Height/5);
        graphic_frame.spPr.xfrm.setExtX(W);
        graphic_frame.spPr.xfrm.setExtY(7.478268771701388 * Rows);
        graphic_frame.setNvSpPr(new AscFormat.UniNvPr());

        var table = new CTable(this.DrawingDocument, graphic_frame, Inline, 0, X, Y, W, 100000, Rows, Cols, Grid, true);
        if(!Inline)
        {
            table.Set_PositionH(Asc.c_oAscHAnchor.Page, false, 0);
            table.Set_PositionV(Asc.c_oAscVAnchor.Page, false, 0);
        }
        table.Set_TableLayout(tbllayout_Fixed);
        if(typeof StyleId === "string")
        {
            table.Set_TableStyle(StyleId);
        }
        table.Set_TableLook(new CTableLook(false, true, false, false, true, false));
        for(var i = 0; i < table.Content.length; ++i)
        {
            var Row = table.Content[i];
            if(AscFormat.isRealNumber(RowHeight))
            {
                Row.Set_Height(RowHeight, Asc.linerule_AtLeast);
            }
            //for(var j = 0; j < Row.Content.length; ++j)
            //{
            //    var cell = Row.Content[j];
            //    var props = new CTableCellPr();
            //    props.TableCellMar = {};
            //    props.TableCellMar.Top    = new CTableMeasurement(tblwidth_Mm, 1.27);
            //    props.TableCellMar.Left   = new CTableMeasurement(tblwidth_Mm, 2.54);
            //    props.TableCellMar.Bottom = new CTableMeasurement(tblwidth_Mm, 1.27);
            //    props.TableCellMar.Right  = new CTableMeasurement(tblwidth_Mm, 2.54);
            //    props.Merge(cell.Pr);
            //    cell.Set_Pr(props);
            //}
        }
        graphic_frame.setGraphicObject(table);
        graphic_frame.setBDeleted(false);
        return graphic_frame;
    },


    Paragraph_Add : function( ParaItem, bRecalculate, noUpdateInterface )
    {
        if(this.Slides[this.CurPage])
        {
            this.Slides[this.CurPage].graphicObjects.paragraphAdd(ParaItem, bRecalculate);
            this.Slides[this.CurPage].graphicObjects.startRecalculate();
            if(!(noUpdateInterface === true))
            {
                this.Document_UpdateInterfaceState();
            }
            this.NeedUpdateTargetForCollaboration = true;
        }
        // this.Slides[this.CurPage] && this.Slides[this.CurPage].graphicObjects.checkSelectedObjectsAndCallback(this.Slides[this.CurPage].graphicObjects.paragraphAdd, [ParaItem, bRecalculate], false, AscDFH.historydescription_Presentation_ParagraphAdd, true);

    },

    Paragraph_ClearFormatting : function()
    {
        this.Slides[this.CurPage] && this.Slides[this.CurPage].graphicObjects.checkSelectedObjectsAndCallback(this.Slides[this.CurPage].graphicObjects.paragraphClearFormatting, [], false, AscDFH.historydescription_Presentation_ParagraphClearFormatting);
        this.Document_UpdateInterfaceState();
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
            this.Slides[this.CurPage].graphicObjects.remove(Count, bOnlyText, bRemoveOnlySelection, AscCommon.CollaborativeEditing.Is_Fast());
            this.Document_UpdateInterfaceState();
        }
    },


    Cursor_MoveToStartPos : function()
    {
        this.Slides[this.CurPage] && this.Slides[this.CurPage].graphicObjects.cursorMoveToStartPos();
        this.Document_UpdateSelectionState();
        this.Document_UpdateInterfaceState();
        return true;
    },

    Cursor_MoveToEndPos : function()
    {
        this.Slides[this.CurPage] && this.Slides[this.CurPage].graphicObjects.cursorMoveToEndPos();
        this.Document_UpdateSelectionState();
        this.Document_UpdateInterfaceState();
        return true;
    },

    Cursor_MoveLeft : function(AddToSelect, Word)
    {
        this.Slides[this.CurPage] && this.Slides[this.CurPage].graphicObjects.cursorMoveLeft(AddToSelect, Word);
        this.Document_UpdateInterfaceState();
        return true;
    },

    Cursor_MoveRight : function(AddToSelect, Word)
    {
        this.Slides[this.CurPage] && this.Slides[this.CurPage].graphicObjects.cursorMoveRight(AddToSelect, Word);
        this.Document_UpdateInterfaceState();
        return true;
    },

    Cursor_MoveUp : function(AddToSelect)
    {
        this.Slides[this.CurPage] && this.Slides[this.CurPage].graphicObjects.cursorMoveUp(AddToSelect);
        this.Document_UpdateInterfaceState();
        return true;
    },

    Cursor_MoveDown : function(AddToSelect)
    {
        this.Slides[this.CurPage] && this.Slides[this.CurPage].graphicObjects.cursorMoveDown(AddToSelect);
        this.Document_UpdateInterfaceState();
        return true;
    },

    Cursor_MoveEndOfLine : function(AddToSelect)
    {
        this.Slides[this.CurPage] && this.Slides[this.CurPage].graphicObjects.cursorMoveEndOfLine(AddToSelect);
        this.Document_UpdateInterfaceState();
        return true;
    },

    Cursor_MoveStartOfLine : function(AddToSelect)
    {
        this.Slides[this.CurPage] && this.Slides[this.CurPage].graphicObjects.cursorMoveStartOfLine(AddToSelect);
        this.Document_UpdateInterfaceState();
        return true;
    },

    Cursor_MoveAt : function( X, Y, AddToSelect )
    {
        this.Slides[this.CurPage] && this.Slides[this.CurPage].graphicObjects.cursorMoveAt(X, Y, AddToSelect);
        this.Document_UpdateInterfaceState();
        return true;
    },

    Cursor_MoveToCell : function(bNext)
    {

    },

    Get_PresentationBulletByNumInfo : function(NumInfo)
    {
        var bullet = new AscFormat.CBullet();
        if(NumInfo.SubType < 0)
        {
            bullet.bulletType = new AscFormat.CBulletType();
            bullet.bulletType.type = AscFormat.BULLET_TYPE_BULLET_NONE;
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
                            bullet.bulletTypeface = new AscFormat.CBulletTypeface();
                            bullet.bulletTypeface.type = AscFormat.BULLET_TYPE_TYPEFACE_BUFONT;
                            bullet.bulletTypeface.typeface = "Arial";
                            break;
                        }
                        case 2:
                        {
                            bulletText = "o";
                            bullet.bulletTypeface = new AscFormat.CBulletTypeface();
                            bullet.bulletTypeface.type = AscFormat.BULLET_TYPE_TYPEFACE_BUFONT;
                            bullet.bulletTypeface.typeface = "Courier New";
                            break;
                        }
                        case 3:
                        {
                            bulletText = "§";
                            bullet.bulletTypeface = new AscFormat.CBulletTypeface();
                            bullet.bulletTypeface.type = AscFormat.BULLET_TYPE_TYPEFACE_BUFONT;
                            bullet.bulletTypeface.typeface = "Wingdings";
                            break;
                        }
                        case 4:
                        {
                            bulletText = String.fromCharCode( 0x0076 );
                            bullet.bulletTypeface = new AscFormat.CBulletTypeface();
                            bullet.bulletTypeface.type = AscFormat.BULLET_TYPE_TYPEFACE_BUFONT;
                            bullet.bulletTypeface.typeface = "Wingdings";
                            break;
                        }
                        case 5:
                        {
                            bulletText = String.fromCharCode( 0x00D8 );
                            bullet.bulletTypeface = new AscFormat.CBulletTypeface();
                            bullet.bulletTypeface.type = AscFormat.BULLET_TYPE_TYPEFACE_BUFONT;
                            bullet.bulletTypeface.typeface = "Wingdings";
                            break;
                        }
                        case 6:
                        {
                            bulletText = String.fromCharCode( 0x00FC );
                            bullet.bulletTypeface = new AscFormat.CBulletTypeface();
                            bullet.bulletTypeface.type = AscFormat.BULLET_TYPE_TYPEFACE_BUFONT;
                            bullet.bulletTypeface.typeface = "Wingdings";
                            break;
                        }
                        case 7:
                        {

                            bulletText = String.fromCharCode(119);
                            bullet.bulletTypeface = new AscFormat.CBulletTypeface();
                            bullet.bulletTypeface.type = AscFormat.BULLET_TYPE_TYPEFACE_BUFONT;
                            bullet.bulletTypeface.typeface = "Wingdings";
                            break;
                        }
                    }
                    bullet.bulletType = new AscFormat.CBulletType();
                    bullet.bulletType.type = AscFormat.BULLET_TYPE_BULLET_CHAR;
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
                    bullet.bulletType = new AscFormat.CBulletType();
                    bullet.bulletType.type = AscFormat.BULLET_TYPE_BULLET_AUTONUM;
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
        this.Slides[this.CurPage] && this.Slides[this.CurPage].graphicObjects.checkSelectedObjectsAndCallback(this.Slides[this.CurPage].graphicObjects.setParagraphAlign, [Align], false, AscDFH.historydescription_Presentation_SetParagraphAlign);
        this.Document_UpdateInterfaceState();
    },

    Set_ParagraphSpacing : function(Spacing)
    {
        this.Slides[this.CurPage] && this.Slides[this.CurPage].graphicObjects.checkSelectedObjectsAndCallback(this.Slides[this.CurPage].graphicObjects.setParagraphSpacing, [Spacing], false, AscDFH.historydescription_Presentation_SetParagraphSpacing);
        this.Document_UpdateInterfaceState();
    },

    Set_ParagraphTabs : function(Tabs)
    {
        this.Slides[this.CurPage] && this.Slides[this.CurPage].graphicObjects.checkSelectedObjectsAndCallback(this.Slides[this.CurPage].graphicObjects.setParagraphTabs, [Tabs], false, AscDFH.historydescription_Presentation_SetParagraphTabs);
        this.Document_UpdateInterfaceState();
    },

    Set_ParagraphIndent : function(Ind)
    {
        this.Slides[this.CurPage] && this.Slides[this.CurPage].graphicObjects.checkSelectedObjectsAndCallback(this.Slides[this.CurPage].graphicObjects.setParagraphIndent, [Ind], false, AscDFH.historydescription_Presentation_SetParagraphIndent);
        this.Document_UpdateInterfaceState();
    },

    Set_ParagraphNumbering : function(NumInfo)
    {
        this.Slides[this.CurPage] && this.Slides[this.CurPage].graphicObjects.checkSelectedObjectsAndCallback(this.Slides[this.CurPage].graphicObjects.setParagraphNumbering, [this.Get_PresentationBulletByNumInfo(NumInfo)], false, AscDFH.historydescription_Presentation_SetParagraphNumbering);
        this.Document_UpdateInterfaceState();   //TODO
    },

    Paragraph_IncDecFontSize : function(bIncrease)
    {
        this.Slides[this.CurPage] && this.Slides[this.CurPage].graphicObjects.checkSelectedObjectsAndCallback(this.Slides[this.CurPage].graphicObjects.paragraphIncDecFontSize, [bIncrease], false, AscDFH.historydescription_Presentation_ParagraphIncDecFontSize);
        this.Document_UpdateInterfaceState();
    },

    Paragraph_IncDecIndent : function(bIncrease)
    {
        this.Slides[this.CurPage] && this.Slides[this.CurPage].graphicObjects.checkSelectedObjectsAndCallback(this.Slides[this.CurPage].graphicObjects.paragraphIncDecIndent, [bIncrease], false, AscDFH.historydescription_Presentation_ParagraphIncDecIndent);
        this.Document_UpdateInterfaceState();
    },

    Can_IncreaseParagraphLevel : function(bIncrease)
    {
        return isRealObject(this.Slides[this.CurPage]) && this.Slides[this.CurPage].graphicObjects.canIncreaseParagraphLevel(bIncrease);
    },

    Set_ImageProps : function(Props)
    {
        this.Slides[this.CurPage] && this.Slides[this.CurPage].graphicObjects.checkSelectedObjectsAndCallback(this.Slides[this.CurPage].graphicObjects.applyDrawingProps, [Props], false, AscDFH.historydescription_Presentation_SetImageProps);
        this.Document_UpdateInterfaceState();
    },

    ShapeApply: function(shapeProps)
    {
        if(this.Slides[this.CurPage])
        {
            this.Slides[this.CurPage].graphicObjects.checkSelectedObjectsAndCallback(this.Slides[this.CurPage].graphicObjects.applyDrawingProps, [shapeProps], false, AscDFH.historydescription_Presentation_SetShapeProps);
        }

        this.Document_UpdateInterfaceState();
    },

    ChartApply: function(chartProps)
    {
        this.Slides[this.CurPage] && this.Slides[this.CurPage].graphicObjects.checkSelectedObjectsAndCallback(this.Slides[this.CurPage].graphicObjects.applyDrawingProps, [chartProps], false, AscDFH.historydescription_Presentation_ChartApply);
        this.Document_UpdateInterfaceState();
    },

    changeShapeType : function(shapeType)
    {
        this.Slides[this.CurPage] && this.Slides[this.CurPage].graphicObjects.checkSelectedObjectsAndCallback(this.Slides[this.CurPage].graphicObjects.applyDrawingProps, [{type:shapeType}], false, AscDFH.historydescription_Presentation_ChangeShapeType);
        this.Document_UpdateInterfaceState();
    },

    setVerticalAlign: function(align)
    {
        if(this.Slides[this.CurPage])
        {
            this.Slides[this.CurPage].graphicObjects.checkSelectedObjectsAndCallback(this.Slides[this.CurPage].graphicObjects.applyDrawingProps, [{verticalTextAlign: align}], false, AscDFH.historydescription_Presentation_SetVerticalAlign);
            this.Document_UpdateInterfaceState();
        }
    },
    setVert: function(align)
    {
        if(this.Slides[this.CurPage])
        {
            this.Slides[this.CurPage].graphicObjects.checkSelectedObjectsAndCallback(this.Slides[this.CurPage].graphicObjects.applyDrawingProps, [{vert: align}], false, AscDFH.historydescription_Presentation_SetVert);
            this.Document_UpdateInterfaceState();
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

    Check_AutoFit: function()
    {
        return false;
    },


    Get_Theme: function()
    {
        return this.themes[0];
    },

    Get_ColorMap: function()
    {
        return AscFormat.G_O_DEFAULT_COLOR_MAP;
    },

    Get_PageFields: function()
    {
        return { X : 0, Y : 0, XLimit : 2000, YLimit : 2000};
    },

    Get_PageLimits : function(PageIndex)
    {
        return this.Get_PageFields();
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


    GetTableStyleIdMap : function(oMap)
    {
        for(var i = 0; i < this.Slides.length; ++i)
        {
            this.CollectStyleId(oMap, this.Slides[i].cSld.spTree);
        }
    },

    CollectStyleId : function(oMap, aSpTree)
    {
        for(var i = 0; i < aSpTree.length; ++i)
        {
            if(aSpTree[i].getObjectType() === AscDFH.historyitem_type_GraphicFrame)
            {
                if(isRealObject(aSpTree[i].graphicObject) && typeof aSpTree[i].graphicObject.TableStyle === "string" && isRealObject(g_oTableId.Get_ById(aSpTree[i].graphicObject.TableStyle)))
                {
                    oMap[aSpTree[i].graphicObject.TableStyle] = true;
                }
            }
            else if(aSpTree[i].getObjectType() === AscDFH.historyitem_type_GroupShape)
            {
                this.CollectStyleId(oMap, aSpTree[i].spTree);
            }
        }
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


    Update_CursorType : function( X, Y, MouseEvent ){
        if(this.Slides[this.CurPage]){
            var graphicObjectInfo = this.Slides[this.CurPage].graphicObjects.isPointInDrawingObjects(X, Y, MouseEvent);
            if(graphicObjectInfo){
                if(!graphicObjectInfo.updated){
                    this.DrawingDocument.SetCursorType(graphicObjectInfo.cursorType);
                }
            }
            else{
                this.DrawingDocument.SetCursorType("default");
            }
            AscCommon.CollaborativeEditing.Check_ForeignCursorsLabels(X, Y, this.CurPage);
        }
    },


    OnKeyDown : function(e)
    {
        var bUpdateSelection = true;
        var bRetValue = keydownresult_PreventNothing;

        if ( e.KeyCode == 8 && false === editor.isViewMode ) // BackSpace
        {
            this.Remove( -1, true );
            bRetValue = keydownresult_PreventAll;
        }
        else if ( e.KeyCode == 9 && false === editor.isViewMode ) // Tab
        {
            if(this.Slides[this.CurPage])
            {
                var graphicObjects = this.Slides[this.CurPage].graphicObjects;
                var target_content = graphicObjects.getTargetDocContent(undefined, true);
                if(target_content)
                {
                    if(target_content instanceof CTable)
                    {
                        target_content.Cursor_MoveToCell( true === e.ShiftKey ? false : true );
                    }
                    else
                    {
                        if(AscCommon.CollaborativeEditing.Is_Fast() || editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Drawing_Props) === false) {
                            History.Create_NewPoint(AscDFH.historydescription_Presentation_ParagraphAdd);
                            this.Paragraph_Add(new ParaTab());
                        }
                    }
                }
                else
                {
                    graphicObjects.selectNextObject(!e.ShiftKey ? 1 : -1);
                }
                this.Document_UpdateInterfaceState();
            }
            bRetValue = keydownresult_PreventAll;
        }
        else if ( e.KeyCode == 13 && false === editor.isViewMode ) // Enter
        {
            var Hyperlink = this.Hyperlink_Check(false);
            if ( null != Hyperlink && false === e.ShiftKey )
            {
                editor.sync_HyperlinkClickCallback( Hyperlink.Get_Value() );
                Hyperlink.Set_Visited(true);

                // TODO: Пока сделаем так, потом надо будет переделать
                this.DrawingDocument.ClearCachePages();
                this.DrawingDocument.FirePaint();
            }
            else
            {
                if ( e.ShiftKey )
                {
                    if(AscCommon.CollaborativeEditing.Is_Fast() || editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Drawing_Props) === false) {
                        History.Create_NewPoint(AscDFH.historydescription_Presentation_ParagraphAdd);
                        this.Paragraph_Add(new ParaNewLine(break_Line));
                    }
                }
                else if ( e.CtrlKey )
                {
                    if(AscCommon.CollaborativeEditing.Is_Fast() || editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Drawing_Props) === false) {
                        History.Create_NewPoint(AscDFH.historydescription_Presentation_ParagraphAdd);
                        this.Paragraph_Add(new ParaNewLine(break_Page));
                    }
                }
                else
                {
                    this.Add_NewParagraph();
                }
            }

            bRetValue = keydownresult_PreventAll;
        }
        else if ( e.KeyCode == 27 ) // Esc
        {

            if(editor.sync_EndAddShape)
            {
                editor.sync_EndAddShape();
            }
            if(this.Slides[this.CurPage])
            {
                var oDrawingObjects = this.Slides[this.CurPage].graphicObjects;
                if(oDrawingObjects.curState instanceof  AscFormat.StartAddNewShape
                    || oDrawingObjects.curState instanceof  AscFormat.SplineBezierState
                    || oDrawingObjects.curState instanceof  AscFormat.PolyLineAddState
                    || oDrawingObjects.curState instanceof  AscFormat.AddPolyLine2State
                    || oDrawingObjects.arrTrackObjects.length > 0)
                {
                    oDrawingObjects.changeCurrentState(new AscFormat.NullState(oDrawingObjects));
                    if( oDrawingObjects.arrTrackObjects.length > 0)
                    {
                        oDrawingObjects.clearTrackObjects();
                        oDrawingObjects.updateOverlay();
                    }
                    editor.sync_EndAddShape();
                    this.Update_CursorType( 0, 0,  new AscCommon.CMouseEventHandler() );
                    return;
                }
                var oTargetTextObject = AscFormat.getTargetTextObject(oDrawingObjects);

                var bNeedRedraw;
                if(oTargetTextObject && oTargetTextObject.isEmptyPlaceholder && oTargetTextObject.isEmptyPlaceholder())
                {
                    bNeedRedraw = true;
                }
                else
                {
                    bNeedRedraw = false;
                }
                var bChart = oDrawingObjects.checkChartTextSelection(true);
                if(!bNeedRedraw)
                {
                    bNeedRedraw = bChart;
                }
                if(e.ShiftKey || (!oDrawingObjects.selection.groupSelection && !oDrawingObjects.selection.textSelection && !oDrawingObjects.selection.chartSelection))
                {
                    oDrawingObjects.resetSelection();
                }
                else
                {
                    if(oDrawingObjects.selection.groupSelection)
                    {
                        var oGroupSelection = oDrawingObjects.selection.groupSelection.selection;
                        if(oGroupSelection.textSelection)
                        {
                            if(oGroupSelection.textSelection.getObjectType() === AscDFH.historyitem_type_GraphicFrame)
                            {
                                if(oGroupSelection.textSelection.graphicObject)
                                {
                                    oGroupSelection.textSelection.graphicObject.Selection_Remove();
                                }
                            }
                            else
                            {
                                var content = oGroupSelection.textSelection.getDocContent();
                                content && content.Selection_Remove();
                            }
                            oGroupSelection.textSelection = null;
                        }
                        else if(oGroupSelection.chartSelection)
                        {
                            oGroupSelection.chartSelection.resetSelection(false);
                            oGroupSelection.chartSelection = null;
                        }
                        else
                        {
                            oDrawingObjects.selection.groupSelection.resetSelection(this);
                            oDrawingObjects.selection.groupSelection = null;
                        }
                    }
                    else if(oDrawingObjects.selection.textSelection)
                    {
                        if(oDrawingObjects.selection.textSelection.getObjectType() === AscDFH.historyitem_type_GraphicFrame)
                        {
                            if(oDrawingObjects.selection.textSelection.graphicObject)
                            {
                                oDrawingObjects.selection.textSelection.graphicObject.Selection_Remove();
                            }
                        }
                        else
                        {
                            var content = oDrawingObjects.selection.textSelection.getDocContent();
                            content && content.Selection_Remove();
                        }
                        oDrawingObjects.selection.textSelection = null;
                    }
                    else if(oDrawingObjects.selection.chartSelection)
                    {
                        oDrawingObjects.selection.chartSelection.resetSelection(false);
                        oDrawingObjects.selection.chartSelection = null;
                    }
                }
                if(bNeedRedraw)
                {
                    this.DrawingDocument.OnRecalculatePage(this.CurPage, this.Slides[this.CurPage]);
                }
                this.Document_UpdateSelectionState();
                this.Document_UpdateInterfaceState();
            }
            bRetValue = keydownresult_PreventAll;
        }
        else if ( e.KeyCode == 32 && false === editor.isViewMode ) // Space
        {
            if ( true === e.ShiftKey && true === e.CtrlKey )
            {
                this.DrawingDocument.TargetStart();
                this.DrawingDocument.TargetShow();


                if(AscCommon.CollaborativeEditing.Is_Fast() || editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Drawing_Props) === false) {
                    History.Create_NewPoint(AscDFH.historydescription_Presentation_ParagraphAdd);
                    this.Paragraph_Add(new ParaText(String.fromCharCode(0x00A0)));
                }
            }
            else if ( true === e.CtrlKey )
            {
                this.Paragraph_ClearFormatting();
            }
            else
            {
               // this.DrawingDocument.TargetStart();
               // this.DrawingDocument.TargetShow();

                if(AscCommon.CollaborativeEditing.Is_Fast() || editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Drawing_Props) === false) {
                    History.Create_NewPoint(AscDFH.historydescription_Presentation_ParagraphAdd);
                    this.Paragraph_Add(new ParaSpace(1));
                }
            }

            bRetValue = keydownresult_PreventAll;
        }
        else if ( e.KeyCode == 33 ) // PgUp
        {
            if ( true === e.AltKey )
            {
            }
            else
            {
                if(this.CurPage  > 0)
                {
                    this.DrawingDocument.m_oWordControl.GoToPage(this.CurPage - 1);
                }
            }
            bRetValue = keydownresult_PreventAll;
        }
        else if ( e.KeyCode == 34 ) // PgDn
        {
            if ( true === e.AltKey )
            {
            }
            else
            {
                if(this.CurPage + 1 < this.Slides.length)
                {
                    this.DrawingDocument.m_oWordControl.GoToPage(this.CurPage + 1);
                }
            }
            bRetValue = keydownresult_PreventAll;
        }
        else if ( e.KeyCode == 35 ) // клавиша End
        {
            if(this.Slides[this.CurPage] && this.Slides[this.CurPage].graphicObjects.getTargetDocContent())
            {
                if ( true === e.CtrlKey ) // Ctrl + End - переход в конец документа
                {
                    this.Cursor_MoveToEndPos();
                }
                else // Переходим в конец строки
                {
                    this.Cursor_MoveEndOfLine( true === e.ShiftKey );
                }
            }
            else
            {
                if (!e.ShiftKey)
                {
                    if (this.CurPage !== (this.Slides.length - 1))
                    {
                        editor.WordControl.GoToPage(this.Slides.length - 1);
                    }
                }
                else
                {
                    if(this.Slides.length > 0)
                    {
                        editor.WordControl.Thumbnails.CorrectShiftSelect(false, true);
                    }
                }
            }

            bRetValue = keydownresult_PreventAll;
        }
        else if ( e.KeyCode == 36 ) // клавиша Home
        {
            if(this.Slides[this.CurPage] && this.Slides[this.CurPage].graphicObjects.getTargetDocContent())
            {
                if (true === e.CtrlKey) // Ctrl + Home - переход в начало документа
                {
                    this.Cursor_MoveToStartPos();
                }
                else // Переходим в начало строки
                {
                    this.Cursor_MoveStartOfLine(true === e.ShiftKey);
                }
            }
            else
            {
                if (!e.ShiftKey)
                {
                    if (this.Slides.length > 0)
                    {
                        editor.WordControl.GoToPage(0);
                    }
                }
                else
                {
                    if(this.Slides.length > 0)
                    {
                        editor.WordControl.Thumbnails.CorrectShiftSelect(true, true);
                    }
                }
            }
            bRetValue = keydownresult_PreventAll;
        }
        else if ( e.KeyCode == 37 ) // Left Arrow
        {
            this.Cursor_MoveLeft( true === e.ShiftKey, true === e.CtrlKey );
            bRetValue = keydownresult_PreventAll;
        }
        else if ( e.KeyCode == 38 ) // Top Arrow
        {
            this.Cursor_MoveUp( true === e.ShiftKey );
            bRetValue = keydownresult_PreventAll;
        }
        else if ( e.KeyCode == 39 ) // Right Arrow
        {
            // Чтобы при зажатой клавише курсор не пропадал
           // if ( true != e.ShiftKey )
           //     this.DrawingDocument.TargetStart();

            this.Cursor_MoveRight( true === e.ShiftKey, true === e.CtrlKey );
            bRetValue = keydownresult_PreventAll;
        }
        else if ( e.KeyCode == 40 ) // Bottom Arrow
        {
            // Чтобы при зажатой клавише курсор не пропадал
            //if ( true != e.ShiftKey )
            //    this.DrawingDocument.TargetStart();

            this.Cursor_MoveDown( true === e.ShiftKey );
            bRetValue = keydownresult_PreventAll;
        }
        else if ( e.KeyCode == 45 ) // Insert
        {
            if ( true === e.CtrlKey ) // Ctrl + Insert (аналогично Ctrl + C)
            {
                Editor_Copy(this.DrawingDocument.m_oWordControl.m_oApi);
                bRetValue = keydownresult_PreventKeyPress;
            }
            else if ( true === e.ShiftKey && false === editor.isViewMode ) // Shift + Insert (аналогично Ctrl + V)
            {
                if ( false === this.Document_Is_SelectionLocked(changestype_Drawing_Props) )
                {
                    if (!window.GlobalPasteFlag)
                    {
                        if (!AscCommon.AscBrowser.isSafariMacOs)
                        {
                            this.Create_NewHistoryPoint(AscDFH.historydescription_Document_ShiftInsert);

                            window.GlobalPasteFlag = true;
                            editor.incrementCounterLongAction();
                            Editor_Paste(this.DrawingDocument.m_oWordControl.m_oApi, true);
                            bRetValue = keydownresult_PreventKeyPress;
                        }
                        else
                        {
                            if (0 === window.GlobalPasteFlagCounter)
                            {
                                this.Create_NewHistoryPoint(AscDFH.historydescription_Document_ShiftInsertSafari);

                                AscCommon.SafariIntervalFocus();
                                window.GlobalPasteFlag = true;
                                editor.incrementCounterLongAction();
                                Editor_Paste(this.DrawingDocument.m_oWordControl.m_oApi, true);
                                bRetValue = keydownresult_PreventKeyPress;
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
                bRetValue = keydownresult_PreventAll;
            }
            else // Shift + Delete (аналогично Ctrl + X)
            {
                if ( false === this.Document_Is_SelectionLocked(changestype_Drawing_Props) )
                {
                    Editor_Copy(this.DrawingDocument.m_oWordControl.m_oApi, true);
                }
                bRetValue = keydownresult_PreventKeyPress;
            }
        }
        else if ( e.KeyCode == 49 && false === editor.isViewMode && true === e.AltKey && !e.AltGr ) // Alt + Ctrl + Num1 - применяем стиль Heading1
        {
            bRetValue = keydownresult_PreventAll;
        }
        else if ( e.KeyCode == 50 && false === editor.isViewMode && true === e.AltKey && !e.AltGr ) // Alt + Ctrl + Num2 - применяем стиль Heading2
        {
            bRetValue = keydownresult_PreventAll;
        }
        else if ( e.KeyCode == 51 && false === editor.isViewMode && true === e.AltKey && !e.AltGr ) // Alt + Ctrl + Num3 - применяем стиль Heading3
        {
            bRetValue = keydownresult_PreventAll;
        }
        else if ( e.KeyCode == 56 && true === e.CtrlKey && true === e.ShiftKey ) // Ctrl + Shift + 8 - showParaMarks
        {
            editor.ShowParaMarks = !editor.ShowParaMarks;
            if(this.Slides[this.CurPage])
                this.DrawingDocument.OnRecalculatePage(this.CurPage, this.Slides[this.CurPage]);
            bRetValue = keydownresult_PreventAll;
        }
        else if ( e.KeyCode == 65 && true === e.CtrlKey ) // Ctrl + A - выделяем все
        {
            this.Select_All();
            bRetValue = keydownresult_PreventAll;
        }
        else if ( e.KeyCode == 66 && false === editor.isViewMode && true === e.CtrlKey ) // Ctrl + B - делаем текст жирным
        {
            var TextPr = this.Get_Paragraph_TextPr();
            if ( null != TextPr )
            {
                if(AscCommon.CollaborativeEditing.Is_Fast() || editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Drawing_Props) === false) {
                    History.Create_NewPoint(AscDFH.historydescription_Presentation_ParagraphAdd);
                    this.Paragraph_Add(new ParaTextPr({Bold: TextPr.Bold === true ? false : true}));
                }
                bRetValue = keydownresult_PreventAll;
            }
        }
        else if ( e.KeyCode == 67 && true === e.CtrlKey ) // Ctrl + C + ...
        {
            if ( true === e.ShiftKey ) // Ctrl + Shift + C - копирование форматирования текста
            {
                this.Document_Format_Copy();
                bRetValue = keydownresult_PreventAll;
            }
            else // Ctrl + C - copy
            {
                Editor_Copy(this.DrawingDocument.m_oWordControl.m_oApi);
                bRetValue = keydownresult_PreventKeyPress;
            }
        }
        else if ( e.KeyCode == 68 && false === editor.isViewMode && true === e.CtrlKey )
        {
            editor.DublicateSlide();
            bRetValue = keydownresult_PreventAll;
        }
        else if ( e.KeyCode == 69 && false === editor.isViewMode && true === e.CtrlKey )
        {
            if ( true !== e.AltKey ) // Ctrl + E - переключение прилегания параграфа между center и left
            {
                var ParaPr = this.Get_Paragraph_ParaPr();
                if ( null != ParaPr )
                {
                    this.Create_NewHistoryPoint(AscDFH.historydescription_Document_SetParagraphAlignHotKey);
                    this.Set_ParagraphAlign( ParaPr.Jc === AscCommon.align_Center ? align_Left : AscCommon.align_Center );
                    this.Document_UpdateInterfaceState();
                }
                bRetValue = keydownresult_PreventAll;
            }
            else // Ctrl + Alt + E - добавляем знак евро €
            {
                if(AscCommon.CollaborativeEditing.Is_Fast() || editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Drawing_Props) === false) {
                    History.Create_NewPoint(AscDFH.historydescription_Presentation_ParagraphAdd);
                    this.Paragraph_Add(new ParaText("€"));
                }
                bRetValue = keydownresult_PreventAll;
            }
        }
        else if ( e.KeyCode == 71 && false === editor.isViewMode && true === e.CtrlKey ) // Ctrl + G - группируем объекты
        {
            if(true === e.ShiftKey)
            {
                this.unGroupShapes();
            }
            else
            {
                this.groupShapes();
            }
            bRetValue = keydownresult_PreventAll;
        }
        else if ( e.KeyCode == 73 && false === editor.isViewMode && true === e.CtrlKey ) // Ctrl + I - делаем текст наклонным
        {
            var TextPr = this.Get_Paragraph_TextPr();
            if ( null != TextPr )
            {
                if(AscCommon.CollaborativeEditing.Is_Fast() || editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Drawing_Props) === false) {
                    History.Create_NewPoint(AscDFH.historydescription_Presentation_ParagraphAdd);
                    this.Paragraph_Add(new ParaTextPr({Italic: TextPr.Italic === true ? false : true}));
                }
                bRetValue = keydownresult_PreventAll;
            }
        }
        else if ( e.KeyCode == 74 && false === editor.isViewMode && true === e.CtrlKey ) // Ctrl + J переключение прилегания параграфа между justify и left
        {
            var ParaPr = this.Get_Paragraph_ParaPr();
            if ( null != ParaPr )
            {
                if ( false === this.Document_Is_SelectionLocked(AscCommon.changestype_Paragraph_Properties) )
                {
                    this.Create_NewHistoryPoint(AscDFH.historydescription_Document_SetParagraphAlignHotKey);
                    this.Set_ParagraphAlign( ParaPr.Jc === align_Justify ? align_Left : align_Justify );
                    this.Document_UpdateInterfaceState();
                }
                bRetValue = keydownresult_PreventAll;
            }
        }
        else if ( e.KeyCode == 75 && false === editor.isViewMode && true === e.CtrlKey ) // Ctrl + K - добавление гиперссылки
        {
            if ( true === this.Hyperlink_CanAdd(false) )
                editor.sync_DialogAddHyperlink();

            bRetValue = keydownresult_PreventAll;
        }
        else if ( e.KeyCode == 76 && false === editor.isViewMode && true === e.CtrlKey ) // Ctrl + L + ...
        {
            if ( true === e.ShiftKey ) // Ctrl + Shift + L - добавляем список к данному параграфу
            {
                if ( false === this.Document_Is_SelectionLocked(changestype_Drawing_Props) )
                {
                    this.Create_NewHistoryPoint(AscDFH.historydescription_Document_SetParagraphNumberingHotKey);
                    this.Set_ParagraphNumbering( { Type : 0, SubType : 1 } );
                    this.Document_UpdateInterfaceState();
                }
                bRetValue = keydownresult_PreventAll;
            }
            else // Ctrl + L - переключение прилегания параграфа между left и justify
            {
                var ParaPr = this.Get_Paragraph_ParaPr();
                if ( null != ParaPr )
                {
                    if ( false === this.Document_Is_SelectionLocked(AscCommon.changestype_Paragraph_Properties) )
                    {
                        this.Create_NewHistoryPoint(AscDFH.historydescription_Document_SetParagraphNumberingHotKey);
                        this.Set_ParagraphAlign( ParaPr.Jc === align_Left ? align_Justify : align_Left );
                        this.Document_UpdateInterfaceState();
                    }
                    bRetValue = keydownresult_PreventAll;
                }
            }
        }
        else if ( e.KeyCode == 77 && false === editor.isViewMode && true === e.CtrlKey ) // Ctrl + M + ...
        {
            if(this.Slides[this.CurPage] && this.Slides[this.CurPage].graphicObjects.getTargetDocContent())
            {
                if ( true === e.ShiftKey ) // Ctrl + Shift + M - уменьшаем левый отступ
                    editor.DecreaseIndent();
                else // Ctrl + M - увеличиваем левый отступ
                    editor.IncreaseIndent();
            }
            else
            {
                var _selected_thumbnails = editor.WordControl.Thumbnails.GetSelectedArray();
                if(_selected_thumbnails.length > 0)
                {
                    var _last_selected_slide_num = _selected_thumbnails[_selected_thumbnails.length - 1];
                    editor.WordControl.GoToPage(_last_selected_slide_num);
                    editor.WordControl.m_oLogicDocument.addNextSlide();
                }
            }
            bRetValue = keydownresult_PreventAll;
        }
        else if ( e.KeyCode == 80 && true === e.CtrlKey ) // Ctrl + P + ...
        {
            if ( true === e.ShiftKey && false === editor.isViewMode ) // Ctrl + Shift + P - добавляем номер страницы в текущую позицию
            {
                bRetValue = keydownresult_PreventAll;
            }
            else // Ctrl + P - print
            {
                this.DrawingDocument.m_oWordControl.m_oApi.onPrint();
                bRetValue = keydownresult_PreventAll;
            }
        }
        else if ( e.KeyCode == 82 && false === editor.isViewMode && true === e.CtrlKey ) // Ctrl + R - переключение прилегания параграфа между right и left
        {
            var ParaPr = this.Get_Paragraph_ParaPr();
            if ( null != ParaPr )
            {
                if ( false === this.Document_Is_SelectionLocked(AscCommon.changestype_Paragraph_Properties) )
                {
                    this.Create_NewHistoryPoint(AscDFH.historydescription_Document_SetParagraphAlignHotKey4);
                    this.Set_ParagraphAlign( ParaPr.Jc === AscCommon.align_Right ? align_Left : AscCommon.align_Right );
                    this.Document_UpdateInterfaceState();
                }
                bRetValue = keydownresult_PreventAll;
            }
        }
        else if ( e.KeyCode == 83 && false === editor.isViewMode && true === e.CtrlKey ) // Ctrl + S - save
        {
            if (true === this.History.Have_Changes() || AscCommon.CollaborativeEditing.m_aChanges.length > 0)
            {
                this.DrawingDocument.m_oWordControl.m_oApi.asc_Save(false);
            }
            bRetValue = keydownresult_PreventAll;
        }
        else if ( e.KeyCode == 85 && false === editor.isViewMode && true === e.CtrlKey ) // Ctrl + U - делаем текст подчеркнутым
        {
            var TextPr = this.Get_Paragraph_TextPr();
            if ( null != TextPr )
            {
                if(AscCommon.CollaborativeEditing.Is_Fast() || editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Drawing_Props) === false) {
                    History.Create_NewPoint(AscDFH.historydescription_Presentation_ParagraphAdd);
                    this.Paragraph_Add(new ParaTextPr({Underline: TextPr.Underline === true ? false : true}));
                }
                bRetValue = keydownresult_PreventAll;
            }
        }
        else if ( e.KeyCode == 53 && false === editor.isViewMode && true === e.CtrlKey ) // Ctrl + 5 - делаем текст зачеркнутым
        {
            var TextPr = this.Get_Paragraph_TextPr();
            if ( null != TextPr )
            {
                if(AscCommon.CollaborativeEditing.Is_Fast() || editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Drawing_Props) === false) {
                    History.Create_NewPoint(AscDFH.historydescription_Presentation_ParagraphAdd);
                    this.Paragraph_Add(new ParaTextPr({Strikeout: TextPr.Strikeout === true ? false : true}));
                }
                bRetValue = keydownresult_PreventAll;
            }
        }
        else if ( e.KeyCode == 86 && false === editor.isViewMode && true === e.CtrlKey ) // Ctrl + V - paste
        {
            if ( false === this.Document_Is_SelectionLocked(changestype_Drawing_Props) )
            {
                if ( true === e.ShiftKey ) // Ctrl + Shift + V - вставляем по образцу
                {
                    this.Document_Format_Paste();
                    bRetValue = keydownresult_PreventAll;
                }
                else // Ctrl + V - paste
                {
                    if (!window.GlobalPasteFlag)
                    {
                        if (!AscCommon.AscBrowser.isSafariMacOs)
                        {
                            this.Create_NewHistoryPoint(AscDFH.historydescription_Document_PasteHotKey);

                            window.GlobalPasteFlag = true;
                            editor.incrementCounterLongAction();
                            Editor_Paste(this.DrawingDocument.m_oWordControl.m_oApi, true);
                            bRetValue = keydownresult_PreventKeyPress;
                        }
                        else
                        {
                            if (0 === window.GlobalPasteFlagCounter)
                            {
                                this.Create_NewHistoryPoint(AscDFH.historydescription_Document_PasteSafariHotKey);

                                AscCommon.SafariIntervalFocus();
                                window.GlobalPasteFlag = true;
                                editor.incrementCounterLongAction();
                                Editor_Paste(this.DrawingDocument.m_oWordControl.m_oApi, true);
                                bRetValue = keydownresult_PreventKeyPress;
                            }
                        }
                    }
                    else
                    {
                        if (!AscCommon.AscBrowser.isSafariMacOs)
                            bRetValue = keydownresult_PreventKeyPress;
                    }
                }
            }
        }
        else if ( e.KeyCode == 88 && false === editor.isViewMode && true === e.CtrlKey ) // Ctrl + X - cut
        {
            if ( false === this.Document_Is_SelectionLocked(changestype_Drawing_Props) )
            {
                Editor_Copy(this.DrawingDocument.m_oWordControl.m_oApi, true);
            }
            bRetValue = keydownresult_PreventKeyPress;
        }
        else if ( e.KeyCode == 89 && false === editor.isViewMode && true === e.CtrlKey ) // Ctrl + Y - Redo
        {
            this.Document_Redo();
            bRetValue = keydownresult_PreventAll;
        }
        else if ( e.KeyCode == 90 && false === editor.isViewMode && true === e.CtrlKey ) // Ctrl + Z - Undo
        {
            this.Document_Undo();
            bRetValue = keydownresult_PreventAll;
        }
        else if ( e.KeyCode == 93 || 57351 == e.KeyCode /*в Opera такой код*/  || (e.KeyCode == 121 && true === e.ShiftKey /*shift + f10*/)) // контекстное меню
        {
            if(editor.WordControl.Thumbnails.FocusObjType === FOCUS_OBJECT_MAIN)
            {
                if(this.Slides[this.CurPage] )
                {
                    var oPosition = this.Slides[this.CurPage].graphicObjects.getContextMenuPosition(0);
                    var ConvertedPos = this.DrawingDocument.ConvertCoordsToCursorWR( oPosition.X, oPosition.Y, this.PageNum );
                    editor.sync_ContextMenuCallback(new AscCommonSlide.CContextMenuData({ Type : Asc.c_oAscContextMenuTypes.Main, X_abs : ConvertedPos.X, Y_abs : ConvertedPos.Y }) );
                }
            }

            bUpdateSelection = false;
            bRetValue = keydownresult_PreventAll;
        }
        else if ( e.KeyCode == 144 ) // Num Lock
        {
            // Ничего не делаем
            bRetValue = keydownresult_PreventAll;
        }
        else if ( e.KeyCode == 145 ) // Scroll Lock
        {
            // Ничего не делаем
            bRetValue = keydownresult_PreventAll;
        }
        else if ( e.KeyCode == 187 && false === editor.isViewMode && true === e.CtrlKey ) // Ctrl + Shift + +, Ctrl + = - superscript/subscript
        {
            var TextPr = this.Get_Paragraph_TextPr();
            if ( null != TextPr )
            {
                if(AscCommon.CollaborativeEditing.Is_Fast() || editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Drawing_Props) === false) {
                    History.Create_NewPoint(AscDFH.historydescription_Presentation_ParagraphAdd);
                    if (true === e.ShiftKey)
                        this.Paragraph_Add(new ParaTextPr({VertAlign: TextPr.VertAlign === AscCommon.vertalign_SuperScript ? vertalign_Baseline : AscCommon.vertalign_SuperScript}));
                    else
                        this.Paragraph_Add(new ParaTextPr({VertAlign: TextPr.VertAlign === AscCommon.vertalign_SubScript ? vertalign_Baseline : AscCommon.vertalign_SubScript}));
                }
                bRetValue = keydownresult_PreventAll;
            }
        }
        else if ( e.KeyCode == 188 && true === e.CtrlKey ) // Ctrl + ,
        {
            var TextPr = this.Get_Paragraph_TextPr();
            if ( null != TextPr )
            {
                if(AscCommon.CollaborativeEditing.Is_Fast() || editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Drawing_Props) === false) {
                    History.Create_NewPoint(AscDFH.historydescription_Presentation_ParagraphAdd);
                    this.Paragraph_Add(new ParaTextPr({VertAlign: TextPr.VertAlign === AscCommon.vertalign_SuperScript ? vertalign_Baseline : AscCommon.vertalign_SuperScript}));
                }
                bRetValue = keydownresult_PreventAll;
            }
        }
        else if ( e.KeyCode == 189 && false === editor.isViewMode ) // Клавиша Num-
        {
            this.DrawingDocument.TargetStart();
            this.DrawingDocument.TargetShow();

            if(AscCommon.CollaborativeEditing.Is_Fast() || editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Drawing_Props) === false) {
                History.Create_NewPoint(AscDFH.historydescription_Presentation_ParagraphAdd);
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
            bRetValue = keydownresult_PreventAll;
        }
        else if ( e.KeyCode == 190 && true === e.CtrlKey ) // Ctrl + .
        {
            var TextPr = this.Get_Paragraph_TextPr();
            if ( null != TextPr )
            {
                if(AscCommon.CollaborativeEditing.Is_Fast() || editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Drawing_Props) === false) {
                    History.Create_NewPoint(AscDFH.historydescription_Presentation_ParagraphAdd);
                    this.Paragraph_Add(new ParaTextPr({VertAlign: TextPr.VertAlign === AscCommon.vertalign_SubScript ? vertalign_Baseline : AscCommon.vertalign_SubScript}));
                }
                bRetValue = keydownresult_PreventAll;
            }
        }
        else if ( e.KeyCode == 219 && false === editor.isViewMode && true === e.CtrlKey ) // Ctrl + [
        {
            editor.FontSizeOut();
            this.Document_UpdateInterfaceState();
            bRetValue = keydownresult_PreventAll;
        }
        else if ( e.KeyCode == 221 && false === editor.isViewMode && true === e.CtrlKey ) // Ctrl + ]
        {
            editor.FontSizeIn();
            this.Document_UpdateInterfaceState();
            bRetValue = keydownresult_PreventAll;
        }

        if ( bRetValue & keydownflags_PreventKeyPress && true === bUpdateSelection )
            this.Document_UpdateSelectionState();

        return bRetValue;
    },

    Set_DocumentDefaultTab: function(DTab)
    {
       //History.Add( this, { Type : AscDFH.historyitem_Document_DefaultTab, Old : Default_Tab_Stop, New : DTab } );
        Default_Tab_Stop = DTab;
    },

    Set_DocumentMargin: function()
    {

    },

    OnKeyPress : function(e)
    {
        if ( true === editor.isViewMode )
            return false;

        if(!this.Slides[this.CurPage] || !this.Slides[this.CurPage].graphicObjects || this.Slides[this.CurPage].graphicObjects.selectedObjects.length === 0)
        {
            return;
        }
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
        if(AscCommon.CollaborativeEditing.Is_Fast() || editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Drawing_Props) === false) {
            History.Create_NewPoint(AscDFH.historydescription_Presentation_ParagraphAdd);
            //this.Create_NewHistoryPoint();

           //this.DrawingDocument.TargetStart();
           //this.DrawingDocument.TargetShow();
            var target_doc_content1, target_doc_content2, b_update_interface = false;
            if(this.Slides[this.CurPage])
            {
                target_doc_content1 = this.Slides[this.CurPage].graphicObjects.getTargetDocContent();
            }
            this.Paragraph_Add( new ParaText( String.fromCharCode( Code ) ), undefined, true );
            if(this.Slides[this.CurPage])
            {
                target_doc_content2 = this.Slides[this.CurPage].graphicObjects.getTargetDocContent();
            }
            if(!target_doc_content1 && target_doc_content2)
            {
                b_update_interface = true;
                this.Document_UpdateInterfaceState();
            }
        }
        bRetValue = true;
    }

        if ( true == bRetValue )
        {
            this.Document_UpdateSelectionState();
            if(!b_update_interface)
            {
                this.Document_UpdateUndoRedoState();
            }
        }

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
       //if(e.Button === 0)
        {
            var ret = this.Slides[this.CurPage].graphicObjects.onMouseDown(e, X, Y);
            if(!ret)
            {
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
        var nStartPage = this.CurPage;
        this.Slides[this.CurPage].graphicObjects && this.Slides[this.CurPage].graphicObjects.onMouseUp(e, X, Y);
        if(nStartPage !== this.CurPage)
        {
            this.DrawingDocument.CheckTargetShow();
            this.Document_UpdateSelectionState();
        }
        if(e.Button === AscCommon.g_mouse_button_right && !this.noShowContextMenu)
        {
            var ContextData = new AscCommonSlide.CContextMenuData();
            var ConvertedPos = this.DrawingDocument.ConvertCoordsToCursorWR( X, Y, PageIndex );
            ContextData.X_abs = ConvertedPos.X;
            ContextData.Y_abs = ConvertedPos.Y;
            ContextData.IsSlideSelect = false;
            editor.sync_ContextMenuCallback( ContextData );
        }
        this.noShowContextMenu = false;
        this.Document_UpdateInterfaceState();
    },

    OnMouseMove : function(e, X, Y, PageIndex)
    {
        e.ctrlKey = e.CtrlKey;
        e.shiftKey = e.ShiftKey;
        editor.sync_MouseMoveStartCallback();
        this.CurPage = PageIndex;
        this.Slides[this.CurPage] && this.Slides[this.CurPage].graphicObjects.onMouseMove(e, X, Y);
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
                var Coords1 = editor.WordControl.m_oDrawingDocument.ConvertCoordsToCursorWR_Comment( last_object.x, last_object.y, this.CurPage);
                var Coords2 = editor.WordControl.m_oDrawingDocument.ConvertCoordsToCursorWR_Comment( last_object.x + last_object.extX, last_object.y, this.CurPage);
                return  { X0 : Coords1.X, X1 : Coords2.X, Y : Coords1.Y};
            }
            else
            {

                var Pos = editor.WordControl.m_oDrawingDocument.ConvertCoordsFromCursor2(AscCommon.global_mouseEvent.X, AscCommon.global_mouseEvent.Y);
                var Coords1 = editor.WordControl.m_oDrawingDocument.ConvertCoordsToCursorWR_Comment( 0, 0, this.CurPage);
                return  { X0 : Coords1.X, X1 : Coords1.X, Y : Coords1.Y};
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

    Document_Format_Paste : function()
    {
        if(this.CopyTextPr && this.CopyParaPr)
        {
            this.Slides[this.CurPage] && this.Slides[this.CurPage].graphicObjects.paragraphFormatPaste(this.CopyTextPr, this.CopyParaPr, false);
            this.Document_UpdateInterfaceState();
        }
    },

    // Возвращаем выделенный текст, если в выделении не более 1 параграфа, и там нет картинок, нумерации страниц и т.д.
    Get_SelectedText : function(bClearText)
    {
        return this.Slides[this.CurPage].graphicObjects.Get_SelectedText(bClearText);
    },

//-----------------------------------------------------------------------------------
// Функции для работы с таблицами
//-----------------------------------------------------------------------------------
    ApplyTableFunction : function(Function, bBefore, bAll, Cols, Rows)
    {
        if(this.Slides[this.CurPage])
        {
            var args;
            if(AscFormat.isRealNumber(Rows) && AscFormat.isRealNumber(Cols))
            {
                args = [Rows, Cols];
            }
            else
            {
                args = [bBefore];
            }
            var target_text_object = AscFormat.getTargetTextObject(this.Slides[this.CurPage].graphicObjects);
            if(target_text_object && target_text_object.getObjectType() === AscDFH.historyitem_type_GraphicFrame)
            {
                Function.apply(target_text_object.graphicObject, args);
                if(target_text_object.graphicObject.Content.length === 0)
                {
                    this.Table_RemoveTable();
                    return;
                }
                this.Recalculate();
                this.Document_UpdateInterfaceState();
            }
            else
            {
                var by_types = this.Slides[this.CurPage].graphicObjects.getSelectedObjectsByTypes(true);
                if(by_types.tables.length === 1)
                {
                    by_types.tables[0].Set_CurrentElement();
                    if(!(bAll === true))
                    {
                        if(bBefore)
                        {
                            by_types.tables[0].graphicObject.Cursor_MoveToStartPos();
                        }
                        else
                        {
                            by_types.tables[0].graphicObject.Cursor_MoveToStartPos();
                        }
                    }
                    else
                    {
                        by_types.tables[0].graphicObject.Select_All();
                    }
                    Function.apply(by_types.tables[0].graphicObject, args);
                    if(by_types.tables[0].graphicObject.Content.length === 0)
                    {
                        this.Table_RemoveTable();
                        return;
                    }
                    this.Recalculate();
                    this.Document_UpdateSelectionState();
                    this.Document_UpdateInterfaceState();
                }
            }
        }
    },


    Table_AddRow : function(bBefore)
    {
        this.ApplyTableFunction(CTable.prototype.Row_Add, bBefore);
    },

    Table_AddCol : function(bBefore)
    {
        this.ApplyTableFunction(CTable.prototype.Col_Add, bBefore);
    },

    Table_RemoveRow : function()
    {
        this.ApplyTableFunction(CTable.prototype.Row_Remove, undefined);
    },

    Table_RemoveCol : function()
    {
        this.ApplyTableFunction(CTable.prototype.Col_Remove, true);
    },

    Table_MergeCells : function()
    {
        this.ApplyTableFunction(CTable.prototype.Cell_Merge, true, true);
    },

    Table_SplitCell : function( Cols, Rows )
    {
        this.ApplyTableFunction(CTable.prototype.Cell_Split, true, true, parseInt(Cols, 10), parseInt(Rows, 10) );
    },

    Table_RemoveTable : function()
    {
        if(this.Slides[this.CurPage])
        {
            var by_types = this.Slides[this.CurPage].graphicObjects.getSelectedObjectsByTypes(true);
            if(by_types.tables.length === 1)
            {
                by_types.tables[0].deselect(this.Slides[this.CurPage].graphicObjects);
                this.Slides[this.CurPage].graphicObjects.resetInternalSelection();
                if(by_types.tables[0].group)
                {
                    by_types.tables[0].group.removeFromSpTree(by_types.tables[0].Id);
                }
                else
                {
                    this.Slides[this.CurPage].removeFromSpTreeById(by_types.tables[0].Id);
                }
                by_types.tables[0].setBDeleted(true);
                this.Recalculate();
                this.Document_UpdateInterfaceState();
                this.Document_UpdateSelectionState();
            }
        }
    },

    Table_Select : function(Type)
    {
        if(this.Slides[this.CurPage])
        {
            var by_types = this.Slides[this.CurPage].graphicObjects.getSelectedObjectsByTypes(true);
            if(by_types.tables.length === 1)
            {
                by_types.tables[0].Set_CurrentElement();
                by_types.tables[0].graphicObject.Table_Select(Type);
                this.Document_UpdateSelectionState();
                this.Document_UpdateInterfaceState();
            }
        }
    },

    Table_CheckFunction : function(Function)
    {
        if(this.Slides[this.CurPage])
        {
            var target_text_object = AscFormat.getTargetTextObject(this.Slides[this.CurPage].graphicObjects);
            if(target_text_object && target_text_object.getObjectType() === AscDFH.historyitem_type_GraphicFrame)
            {
                return Function.apply(target_text_object.graphicObject, []);
            }
           //else
           //{
           //    return
           //    var by_types = this.Slides[this.CurPage].graphicObjects.getSelectedObjectsByTypes(true);
           //    if(by_types.tables.length === 1)
           //    {
           //        var ret;
           //        by_types.tables[0].graphicObject.Set_ApplyToAll(true);
           //        ret = Function.apply(by_types.tables[0].graphicObject, []);
           //        by_types.tables[0].graphicObject.Set_ApplyToAll(false);
           //        return ret;
           //    }
           //}
        }
        return false;
    },

    Table_CheckMerge : function()
    {
        return this.Table_CheckFunction(CTable.prototype.Check_Merge);
    },

    Table_CheckSplit : function()
    {
        return this.Table_CheckFunction(CTable.prototype.Check_Split);
    },

    Check_TableCoincidence : function(Table)
    {
        return false;
    },


    Get_PageSizesByDrawingObjects: function()
    {
        return {W: Page_Width, H: Page_Height};
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


    Get_GraphicObjectsProps : function()
    {
        if(this.Slides[this.CurPage])
        {
            return this.Slides[this.CurPage].graphicObjects.getDrawingProps();
        }
        return null;
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
            var target_content = graphic_objects.getTargetDocContent(undefined, true), drawing_props = graphic_objects.getDrawingProps(), i;
            var para_pr = graphic_objects.getParagraphParaPr(), text_pr = graphic_objects.getParagraphTextPr();
            var flag = undefined;
            if(!para_pr)
            {
                para_pr = new CParaPr();
                flag = true;
            }
            if(!text_pr)
            {
                text_pr = new CTextPr();
            }
            editor.textArtPreviewManager.clear();
            var theme = graphic_objects.getTheme();
            if(text_pr.RFonts)
            {
                if(text_pr.RFonts.Ascii)
                    text_pr.RFonts.Ascii.Name    = theme.themeElements.fontScheme.checkFont(text_pr.RFonts.Ascii.Name);
                if(text_pr.RFonts.EastAsia)
                    text_pr.RFonts.EastAsia.Name = theme.themeElements.fontScheme.checkFont(text_pr.RFonts.EastAsia.Name);
                if(text_pr.RFonts.HAnsi)
                    text_pr.RFonts.HAnsi.Name    = theme.themeElements.fontScheme.checkFont(text_pr.RFonts.HAnsi.Name);
                if(text_pr.RFonts.CS)
                    text_pr.RFonts.CS.Name       = theme.themeElements.fontScheme.checkFont(text_pr.RFonts.CS.Name);
            }
            if(text_pr.FontFamily)
            {
                text_pr.FontFamily.Name = theme.themeElements.fontScheme.checkFont(text_pr.FontFamily.Name);
            }
            editor.sync_PrLineSpacingCallBack(para_pr.Spacing);
            if(!target_content)
            {
                editor.UpdateTextPr(text_pr);
            }

            if(drawing_props.imageProps)
            {
                drawing_props.imageProps.Width = drawing_props.imageProps.w;
                drawing_props.imageProps.Height = drawing_props.imageProps.h;
                drawing_props.imageProps.Position = {X: drawing_props.imageProps.x, Y: drawing_props.imageProps.y};
                editor.sync_ImgPropCallback(drawing_props.imageProps);
            }

            if(drawing_props.shapeProps)
            {
                editor.sync_shapePropCallback(drawing_props.shapeProps);
                editor.sync_VerticalTextAlign(drawing_props.shapeProps.verticalTextAlign);
                editor.sync_Vert(drawing_props.shapeProps.vert);
            }

            if(drawing_props.chartProps && drawing_props.chartProps.chartProps)
            {
                if(this.bNeedUpdateChartPreview)
                {
                    editor.chartPreviewManager.clearPreviews();
                    editor.asc_fireCallback("asc_onUpdateChartStyles");
                    this.bNeedUpdateChartPreview = false;
                }
                editor.sync_ImgPropCallback(drawing_props.chartProps);
            }

            if(drawing_props.tableProps)
            {
                this.CheckTableStyles(this.Slides[this.CurPage], drawing_props.tableProps.TableLook);
                editor.sync_TblPropCallback(drawing_props.tableProps);
                if(!drawing_props.shapeProps)
                {
                    if(drawing_props.tableProps.CellsVAlign === vertalignjc_Bottom)
                    {
                        editor.sync_VerticalTextAlign(AscFormat.VERTICAL_ANCHOR_TYPE_BOTTOM);
                    }
                    else if(drawing_props.tableProps.CellsVAlign === vertalignjc_Center)
                    {
                        editor.sync_VerticalTextAlign(AscFormat.VERTICAL_ANCHOR_TYPE_CENTER);
                    }
                    else
                    {
                        editor.sync_VerticalTextAlign(AscFormat.VERTICAL_ANCHOR_TYPE_TOP);
                    }
                }
            }
            if(target_content)
            {
                target_content.Document_UpdateInterfaceState();
               /* if(para_pr)
                {
                    editor.UpdateParagraphProp( para_pr, flag );

                    editor.sync_PrLineSpacingCallBack(para_pr.Spacing);
                    //if(selected_objects.length === 1 )
                    //{
                    //    if ( "undefined" != typeof(para_props.Tabs) && null != para_props.Tabs )
                    //        editor.Update_ParaTab( Default_Tab_Stop, para_props.Tabs );//TODO:
                    //}
                }
                if(text_pr)
                {
                    editor.UpdateTextPr(text_pr);
                }

                var Hyperlink = this.Hyperlink_Check(false);
                if (Hyperlink )
                {
                    var HyperText = new CParagraphGetText();
                    Hyperlink.Get_Text( HyperText );
                    var HyperProps = new CHyperlinkProperty(Hyperlink);
                    HyperProps.put_Text( HyperText.Text );
                    editor.sync_HyperlinkPropCallback(HyperProps);
                }*/
            }
        }
        editor.sync_EndCatchSelectedElements();
        this.Document_UpdateUndoRedoState();
        this.Document_UpdateRulersState();

        this.Document_UpdateCanAddHyperlinkState();
        editor.asc_fireCallback("asc_onPresentationSize", this.Width, this.Height);
        editor.asc_fireCallback("asc_canIncreaseIndent", this.Can_IncreaseParagraphLevel(true));
        editor.asc_fireCallback("asc_canDecreaseIndent", this.Can_IncreaseParagraphLevel(false));
        editor.asc_fireCallback("asc_onCanGroup", this.canGroup());
        editor.asc_fireCallback("asc_onCanUnGroup", this.canUnGroup());
    },

    changeBackground: function(bg, arr_ind, bNoCreatePoint)
    {
        if(bNoCreatePoint === true || this.Document_Is_SelectionLocked(AscCommon.changestype_SlideBg) === false)
        {
            if(!(bNoCreatePoint === true ))
            {
                History.Create_NewPoint(AscDFH.historydescription_Presentation_ChangeBackground);
            }
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
            if(!(bNoCreatePoint === true ))
            {
                this.Document_UpdateInterfaceState();
            }
        }
    },

    CheckTableStyles: function(Slide, TableLook)
    {
        if(!this.TablesForInterface)
        {
            this.TablesForInterface = [];
            var _x_mar = 10;
            var _y_mar = 10;
            var _r_mar = 10;
            var _b_mar = 10;
            var _pageW = 297;
            var _pageH = 210;

            var W = (_pageW - _x_mar - _r_mar);
            var H = (_pageH - _y_mar - _b_mar);
            var index = 0;
            AscFormat.ExecuteNoHistory(function(){
            for(var key in this.TableStylesIdMap)
            {
                if(this.TableStylesIdMap[key])
                {
                    this.TablesForInterface[index] = this.Create_TableGraphicFrame(5, 5, Slide, key, W, H, _x_mar, _y_mar, true);
                    this.TablesForInterface[index].setBDeleted(true);
                    index++;
                }
            }
            }, this, []);
        }
        if(this.TablesForInterface.length === 0)
            return;
        var b_table_look = false;
        if(!this.LastTheme || this.LastTheme !== Slide.Layout.Master.Theme
            || this.LastColorScheme !== Slide.Layout.Master.Theme.themeElements.clrScheme
            || !this.LastColorMap || !this.LastColorMap.compare(Slide.Get_ColorMap())
        || !this.LastTableLook
        || (b_table_look = TableLook.m_bFirst_Col !== this.LastTableLook.m_bFirst_Col
                        || TableLook.m_bFirst_Row !== this.LastTableLook.m_bFirst_Row
                        || TableLook.m_bLast_Col  !== this.LastTableLook.m_bLast_Col
                        || TableLook.m_bLast_Row  !== this.LastTableLook.m_bLast_Row
                        || TableLook.m_bBand_Hor  !== this.LastTableLook.m_bBand_Hor
                        || TableLook.m_bBand_Ver  !== this.LastTableLook.m_bBand_Ver ) )
        {


            var only_redraw = !b_table_look && this.LastTheme === Slide.Layout.Master.Theme /*&& this.LastColorScheme === Slide.Layout.Master.Theme.themeElements.clrScheme && Slide.Get_ColorMap().compare(this.LastColorMap)*/;
            this.LastTheme = Slide.Layout.Master.Theme;
            this.LastColorScheme = Slide.Layout.Master.Theme.themeElements.clrScheme;
            this.LastColorMap = Slide.Get_ColorMap();
            this.LastTableLook = TableLook;
            var need_set_recalc = true, i;

            AscFormat.ExecuteNoHistory(function(){
                if(!only_redraw)
                {
                    var TableLook2;
                    if(b_table_look)
                    {
                        TableLook2 = new CTableLook(TableLook.m_bFirst_Col, TableLook.m_bFirst_Row, TableLook.m_bLast_Col, TableLook.m_bLast_Row, TableLook.m_bBand_Hor, TableLook.m_bBand_Ver);
                    }
                    if(this.TablesForInterface[0].parent !== Slide)
                    {
                        need_set_recalc = false;
                        for(i = 0; i < this.TablesForInterface.length; ++i)
                        {
                            this.TablesForInterface[i].setParent(Slide);
                            this.TablesForInterface[i].handleUpdateTheme();
                            if(TableLook2)
                            {
                                this.TablesForInterface[i].graphicObject.Set_TableLook(TableLook2);
                                this.TablesForInterface[i].graphicObject.Recalculate_Page(0);
                            }
                        }
                    }
                    if(need_set_recalc)
                    {
                        for(i = 0; i < this.TablesForInterface.length; ++i)
                        {
                            if(TableLook)
                            {
                                this.TablesForInterface[i].graphicObject.Set_TableLook(TableLook);
                            }
                            this.TablesForInterface[i].handleUpdateTheme();
                            this.TablesForInterface[i].graphicObject.Recalculate_Page(0);
                        }
                    }
                }
                this.DrawingDocument.CheckTableStyles();
            }, this, []);
        }
    },

    // Обновляем линейки
    Document_UpdateRulersState : function()
    {
        if(this.Slides[this.CurPage])
        {
            var target_content = this.Slides[this.CurPage].graphicObjects.getTargetDocContent(undefined, true);
            if(target_content && target_content.Parent && target_content.Parent.getObjectType && target_content.Parent.getObjectType() === AscDFH.historyitem_type_TextBody)
            {
                return this.DrawingDocument.Set_RulerState_Paragraph( null , target_content.Parent.getMargins());
            }
            else if(target_content instanceof CTable)
            {
                return target_content.Document_UpdateRulersState(this.CurPage);
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
            // дублирование евента. когда будет undo-redo - тогда
            // эти евенты начнут отличаться
            editor.SetDocumentModified(true);
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
            this.Document_UpdateInterfaceState();
        }
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
    Create_NewHistoryPoint : function(Description)
    {
        this.History.Create_NewPoint(Description);
    },

    Document_Undo : function()
    {
        if ( true === AscCommon.CollaborativeEditing.Get_GlobalLock() )
            return;

        this.clearThemeTimeouts();
        this.History.Undo();
        this.Recalculate(this.History.RecalculateData);

        this.Document_UpdateSelectionState();
        this.Document_UpdateInterfaceState();
    },

    Document_Redo : function()
    {
        if ( true === AscCommon.CollaborativeEditing.Get_GlobalLock() )
            return;

        this.clearThemeTimeouts();
        this.History.Redo();
        this.Recalculate(this.History.RecalculateData);

        this.Document_UpdateSelectionState();
        this.Document_UpdateInterfaceState();
    },

    Set_FastCollaborativeEditing: function(isOn)
    {
        AscCommon.CollaborativeEditing.Set_Fast(isOn);
    },

    Get_SelectionState : function()
    {
        var s = {};
        s.CurPage = this.CurPage;
        if(this.CurPage > -1)
            s.slideSelection = this.Slides[this.CurPage].graphicObjects.getSelectionState();
        return s;
    },


    Get_SelectionState2: function()
    {},

    Set_SelectionState2: function(oDocState)
    {},

    Save_DocumentStateBeforeLoadChanges: function()
    {
        var oDocState = {};
        oDocState.Pos = [];
        oDocState.StartPos = [];
        oDocState.EndPos = [];

        if(this.Slides[this.CurPage]){
            oDocState.Slide = this.Slides[this.CurPage];
            this.Slides[this.CurPage].graphicObjects.Save_DocumentStateBeforeLoadChanges(oDocState);
        }

        return oDocState;
    },

    Load_DocumentStateAfterLoadChanges: function(oState){
        if(oState.Slide){
            var oSlide = oState.Slide;
            if(oSlide !== this.Slides[this.CurPage]){
                var bFind = false;
                for(var i = 0; i < this.Slides.length; ++i){
                    this.Slides[i].setSlideNum(i);
                    if(this.Slides[i] === oSlide){
                        this.CurPage = i;
                        this.bGoToPage = true;
                        bFind = true;
                    }
                }
                if(!bFind){
                    this.CurPage = this.Slides.length - 1;
                    this.bGoToPage = true;
                    return;
                }
            }
            var oDrawingObjects = this.Slides[this.CurPage].graphicObjects;
            oDrawingObjects.clearPreTrackObjects();
            oDrawingObjects.clearTrackObjects();
            oDrawingObjects.resetSelection();
            oDrawingObjects.changeCurrentState(new AscFormat.NullState(oDrawingObjects));
            oDrawingObjects.loadDocumentStateAfterLoadChanges(oState);
        }
    },

    Get_SelectedContent : function()
    {
        return AscFormat.ExecuteNoHistory(function()
        {
            var ret = new PresentationSelectedContent(), i;
            if(this.Slides.length > 0)
            {
                switch(editor.WordControl.Thumbnails.FocusObjType)
                {
                    case FOCUS_OBJECT_MAIN:
                    {
                        var target_text_object = AscFormat.getTargetTextObject(this.Slides[this.CurPage].graphicObjects);
                        if(target_text_object)
                        {
                            var doc_content = this.Slides[this.CurPage].graphicObjects.getTargetDocContent();
                            if(target_text_object.getObjectType() === AscDFH.historyitem_type_GraphicFrame && !doc_content)
                            {
                                if(target_text_object.graphicObject)
                                {
                                    var GraphicFrame = target_text_object.copy();
                                    var SelectedContent = new CSelectedContent();
                                    target_text_object.graphicObject.Get_SelectedContent(SelectedContent);
                                    var Table = SelectedContent.Elements[0].Element;
                                    GraphicFrame.setGraphicObject(Table);
                                    Table.Set_Parent(GraphicFrame);
                                    ret.Drawings.push(new DrawingCopyObject(GraphicFrame, target_text_object.x, target_text_object.y, target_text_object.extX, target_text_object.extY, target_text_object.getBase64Img()) );
                                }
                            }
                            else
                            {
                                if(doc_content)
                                {
                                    var SelectedContent = new CSelectedContent();
                                    doc_content.Get_SelectedContent(SelectedContent);
                                    ret.DocContent = SelectedContent;
                                }
                            }
                        }
                        else
                        {

                            var selector = this.Slides[this.CurPage].graphicObjects.selection.groupSelection ? this.Slides[this.CurPage].graphicObjects.selection.groupSelection : this.Slides[this.CurPage].graphicObjects;
                            if(selector.selection.chartSelection && selector.selection.chartSelection.selection.title)
                            {
                                var doc_content = selector.selection.chartSelection.selection.title.getDocContent();
                                if(doc_content)
                                {

                                    var SelectedContent = new CSelectedContent();
                                    doc_content.Set_ApplyToAll(true);
                                    doc_content.Get_SelectedContent(SelectedContent);
                                    doc_content.Set_ApplyToAll(false);
                                    ret.DocContent = SelectedContent;
                                }
                            }
                            else
                            {
                                var bRecursive = isRealObject(this.Slides[this.CurPage].graphicObjects.selection.groupSelection);
                                var aSpTree = bRecursive ? this.Slides[this.CurPage].graphicObjects.selection.groupSelection.spTree : this.Slides[this.CurPage].cSld.spTree;
                                collectSelectedObjects(aSpTree, ret.Drawings, bRecursive);
                            }
                        }
                        break;
                    }
                    case FOCUS_OBJECT_THUMBNAILS :
                    {
                        var selected_slides = editor.WordControl.Thumbnails.GetSelectedArray();
                        for(i = 0; i < selected_slides.length; ++i)
                        {
                            ret.SlideObjects.push(new SlideCopyObject(this.Slides[selected_slides[i]].createDuplicate(), this.Slides[selected_slides[i]].getBase64Img()));
                        }
                    }
                }
            }
            return ret;
        }, this, []);
    },


    CreateAndAddShapeFromSelectedContent : function(oDocContent)
    {
        var track_object = new AscFormat.NewShapeTrack("textRect", 0, 0, this.Slides[this.CurPage].Layout.Master.Theme, this.Slides[this.CurPage].Layout.Master, this.Slides[this.CurPage].Layout, this.Slides[this.CurPage], this.CurPage);
        track_object.track({}, 0, 0);
        var shape = track_object.getShape(false, this.DrawingDocument, this.Slides[this.CurPage]);
        shape.setParent(this.Slides[this.CurPage]);
        var paragraph = shape.txBody.content.Content[0];
        var NearPos = { Paragraph: paragraph, ContentPos: paragraph.Get_ParaContentPos(false, false) };
        paragraph.Check_NearestPos(NearPos);
        var old_val = oDocContent.MoveDrawing;
        oDocContent.MoveDrawing = true;
        shape.txBody.content.Insert_Content(oDocContent, NearPos);
        oDocContent.MoveDrawing = old_val;
        var body_pr = shape.getBodyPr();
        var w = shape.txBody.getMaxContentWidth(this.Width/2, true) + body_pr.lIns + body_pr.rIns;
        var h = shape.txBody.content.Get_SummaryHeight() + body_pr.tIns + body_pr.bIns;
        shape.spPr.xfrm.setExtX(w);
        shape.spPr.xfrm.setExtY(h);
        shape.spPr.xfrm.setOffX((this.Width - w) / 2);
        shape.spPr.xfrm.setOffY((this.Height - h) / 2);
        shape.setParent(this.Slides[this.CurPage]);
        shape.addToDrawingObjects();
        return shape;
    },

    Insert_Content : function(Content)
    {
        var selected_slides = editor.WordControl.Thumbnails.GetSelectedArray(), i;
        if(Content.SlideObjects.length > 0)
        {
            var las_slide_index = selected_slides.length > 0 ? selected_slides[selected_slides.length-1] : -1;

            this.needSelectPages.length = 0;
            for(i = 0; i < Content.SlideObjects.length; ++i)
            {
                this.insertSlide(las_slide_index + i + 1, Content.SlideObjects[i].Slide);
                this.needSelectPages.push(las_slide_index + i + 1);
            }
            this.CurPage = las_slide_index + 1;
            this.bGoToPage = true;
            this.bNeedUpdateTh = true;

        }
        else if(this.Slides[this.CurPage])
        {
            if(Content.Drawings.length > 0)
            {
                this.Slides[this.CurPage].graphicObjects.resetSelection();
                for(i = 0; i < Content.Drawings.length; ++i)
                {
                    if(Content.Drawings[i].Drawing.bDeleted)
                    {
                        if(Content.Drawings[i].Drawing.setBDeleted2)
                        {
                            Content.Drawings[i].Drawing.setBDeleted2(false);
                        }
                        else if(Content.Drawings[i].Drawing.setBDeleted)
                        {
                            Content.Drawings[i].Drawing.setBDeleted(false);
                        }
                    }
                    Content.Drawings[i].Drawing.setParent2(this.Slides[this.CurPage]);
                    if(Content.Drawings[i].Drawing.getObjectType() === AscDFH.historyitem_type_GraphicFrame)
                    {
                        this.Check_GraphicFrameRowHeight(Content.Drawings[i].Drawing);
                    }
                    Content.Drawings[i].Drawing.addToDrawingObjects();
                    Content.Drawings[i].Drawing.checkExtentsByDocContent && Content.Drawings[i].Drawing.checkExtentsByDocContent();
                    this.Slides[this.CurPage].graphicObjects.selectObject(Content.Drawings[i].Drawing, 0);
                }
                if(Content.DocContent && Content.DocContent.Elements.length > 0)
                {
                    var shape = this.CreateAndAddShapeFromSelectedContent(Content.DocContent);
                    this.Slides[this.CurPage].graphicObjects.selectObject(shape, 0);
                }
            }
            else if(Content.DocContent)
            {
                var target_doc_content = this.Slides[this.CurPage].graphicObjects.getTargetDocContent(true), paragraph, NearPos;
                if(target_doc_content)
                {
                    if(target_doc_content.Selection.Use)
                    {
                        this.Slides[this.CurPage].graphicObjects.removeCallback(1);
                    }
                    paragraph = target_doc_content.Content[target_doc_content.CurPos.ContentPos];
                    if (null != paragraph && type_Paragraph == paragraph.GetType())
                    {
                        NearPos = { Paragraph: paragraph, ContentPos: paragraph.Get_ParaContentPos(false, false) };
                        paragraph.Check_NearestPos(NearPos);
                        target_doc_content.Insert_Content(Content.DocContent, NearPos);
                    }
                    var oTargetTextObject = AscFormat.getTargetTextObject(this.Slides[this.CurPage].graphicObjects);
                    oTargetTextObject && oTargetTextObject.checkExtentsByDocContent && oTargetTextObject.checkExtentsByDocContent();
                }
                else
                {
                    var shape = this.CreateAndAddShapeFromSelectedContent(Content.DocContent);
                    this.Slides[this.CurPage].graphicObjects.resetSelection();
                    this.Slides[this.CurPage].graphicObjects.selectObject(shape, 0);
                }
            }
        }
    },

    Check_CursorMoveRight : function()
    {
        if(this.Slides[this.CurPage])
        {
            if(this.Slides[this.CurPage].graphicObjects.getTargetDocContent(false, false))
            {
                this.Slides[this.CurPage].graphicObjects.cursorMoveRight(false, false, true);
            }
        }
    },

    Set_SelectionState : function(State)
    {
        if(State.CurPage > -1)
            this.Slides[State.CurPage].graphicObjects.setSelectionState(State.slideSelection);
        if(State.CurPage !== this.CurPage)
            this.bGoToPage = true;
        this.CurPage = State.CurPage;
        //this.Set_CurPage(State.CurPage);

    },

    Undo : function(Data)
    {
        var Type = Data.Type;

        switch ( Type )
        {
            case AscDFH.historyitem_Presentation_SetShowPr:
            {
                this.showPr = Data.oldPr;
                break;
            }
            case AscDFH.historyitem_Document_DefaultTab:
            {
                Default_Tab_Stop = Data.Old;

                break;
            }
            case AscDFH.historyitem_Presentation_AddSlide:
            {
                this.Slides.splice(Data.Pos, 1);
                for(var i = 0; i < this.Slides.length; ++i)
                {
                    this.DrawingDocument.OnRecalculatePage(i, this.Slides[i]);
                }
                this.DrawingDocument.OnEndRecalculate();
                break;
            }
            case AscDFH.historyitem_Presentation_RemoveSlide:
            {
                this.Slides.splice(Data.Pos, 0, g_oTableId.Get_ById(Data.Id));
                if(this.Slides[Data.Pos])
                {
                    this.Slides[Data.Pos].addAllCommentsToInterface();
                }
                for(var i = 0; i < this.Slides.length; ++i)
                {
                    this.DrawingDocument.OnRecalculatePage(i, this.Slides[i]);
                }
                this.DrawingDocument.OnEndRecalculate();
                break;
            }
            case AscDFH.historyitem_Presentation_SlideSize:
            {

                this.Width = Data.oldW;
                this.Height = Data.oldH;
                this.changeSlideSizeFunction(this.Width, this.Height);
                editor.asc_fireCallback("asc_onPresentationSize", this.Width, this.Height);

                break;
            }
            case AscDFH.historyitem_Presentation_AddSlideMaster:
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
            case AscDFH.historyitem_Presentation_SetShowPr:
            {
                this.showPr = Data.newPr;
                break;
            }
            case AscDFH.historyitem_Presentation_AddSlide:
            {
                this.Slides.splice(Data.Pos, 0, g_oTableId.Get_ById(Data.Id));
                for(var i = 0; i < this.Slides.length; ++i)
                {
                    this.DrawingDocument.OnRecalculatePage(i, this.Slides[i]);
                }
                this.DrawingDocument.OnEndRecalculate();
                break;
            }
            case AscDFH.historyitem_Presentation_RemoveSlide:
            {
                if(this.Slides[Data.Pos])
                {
                    this.Slides[Data.Pos].removeAllCommentsToInterface();
                }
                this.Slides.splice(Data.Pos, 1);
                for(var i = 0; i < this.Slides.length; ++i)
                {
                    this.DrawingDocument.OnRecalculatePage(i, this.Slides[i]);
                }
                this.DrawingDocument.OnEndRecalculate();
                break;
            }
            case AscDFH.historyitem_Presentation_SlideSize:
            {
                var kw = Data.newW/this.Width;
                var kh = Data.newH/this.Height;
                this.Width = Data.newW;
                this.Height = Data.newH;
                this.changeSlideSizeFunction(this.Width, this.Height);
                editor.asc_fireCallback("asc_onPresentationSize", this.Width, this.Height);
                break;
            }
            case AscDFH.historyitem_Presentation_AddSlideMaster:
            {
                this.slideMasters.splice(Data.pos, 0, Data.master);
                break;
            }
        }
    },

    Get_ParentObject_or_DocumentPos : function(Index)
    {
        return { Type : AscDFH.historyitem_recalctype_Inline, Data : Index };
    },

    Refresh_RecalcData : function(Data)
    {
        var recalculateMaps, key;
        switch ( Data.Type )
        {
            case AscDFH.historyitem_Presentation_AddSlide:
            {
                break;
            }
            case AscDFH.historyitem_Presentation_RemoveSlide:
            {
                break;
            }
            case AscDFH.historyitem_Presentation_SlideSize:
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
            case AscDFH.historyitem_Presentation_AddSlideMaster:
            {
                break;
            }
            case AscDFH.historyitem_Presentation_ChangeTheme:
            {
                for(var i = 0; i < Data.arrIndex.length; ++i)
                {
                    this.Slides[Data.arrIndex[i]] && this.Slides[Data.arrIndex[i]].checkSlideTheme();
                }
                break;
            }
            case AscDFH.historyitem_Presentation_ChangeColorScheme:
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
            case AscDFH.historyitem_Presentation_AddSlide:
            {
                break;
            }
            case AscDFH.historyitem_Presentation_RemoveSlide:
            {
                break;
            }
            case AscDFH.historyitem_Presentation_SlideSize:
            {
                History.RecalcData_Add({Type: AscDFH.historyitem_recalctype_Drawing, All: true});
                break;
            }
            case AscDFH.historyitem_Presentation_AddSlideMaster:
            {
                break;
            }
            case AscDFH.historyitem_Presentation_ChangeTheme:
            {
                History.RecalcData_Add({Type: AscDFH.historyitem_recalctype_Drawing, Theme: true, ArrInd: Data.arrIndex});
                break;
            }
            case AscDFH.historyitem_Presentation_ChangeColorScheme:
            {
                History.RecalcData_Add({Type: AscDFH.historyitem_recalctype_Drawing, ColorScheme: true, ArrInd: Data.arrIndex});
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
            this.Slides[this.CurPage].graphicObjects.checkSelectedObjectsAndCallback(this.Slides[this.CurPage].graphicObjects.hyperlinkAdd, [HyperProps], false, AscDFH.historydescription_Presentation_HyperlinkAdd);
            this.Document_UpdateInterfaceState();
        }
    },

    Hyperlink_Modify : function(HyperProps)
    {
        if(this.Slides[this.CurPage])
        {
            this.Slides[this.CurPage].graphicObjects.checkSelectedObjectsAndCallback(this.Slides[this.CurPage].graphicObjects.hyperlinkModify, [HyperProps], false, AscDFH.historydescription_Presentation_HyperlinkModify);
            this.Document_UpdateInterfaceState();
        }
    },

    Hyperlink_Remove : function()
    {
        if(this.Slides[this.CurPage])
        {
            this.Slides[this.CurPage].graphicObjects.checkSelectedObjectsAndCallback(this.Slides[this.CurPage].graphicObjects.hyperlinkRemove, [], false, AscDFH.historydescription_Presentation_HyperlinkRemove);
            this.Document_UpdateInterfaceState();
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
        this.Slides[this.CurPage] && this.Slides[this.CurPage].graphicObjects.alignLeft(editor.bAlignBySelected);
        this.Document_UpdateInterfaceState();
    },

    alignRight : function()
    {
        this.Slides[this.CurPage] && this.Slides[this.CurPage].graphicObjects.alignRight(editor.bAlignBySelected);
        this.Document_UpdateInterfaceState();
    },

    alignTop : function()
    {
        this.Slides[this.CurPage] && this.Slides[this.CurPage].graphicObjects.alignTop(editor.bAlignBySelected);
        this.Document_UpdateInterfaceState();
    },

    alignBottom : function()
    {
        this.Slides[this.CurPage] && this.Slides[this.CurPage].graphicObjects.alignBottom(editor.bAlignBySelected);
        this.Document_UpdateInterfaceState();
    },

    alignCenter : function()
    {
        this.Slides[this.CurPage] && this.Slides[this.CurPage].graphicObjects.alignCenter(editor.bAlignBySelected);
        this.Document_UpdateInterfaceState();
    },

    alignMiddle : function()
    {
        this.Slides[this.CurPage] && this.Slides[this.CurPage].graphicObjects.alignMiddle(editor.bAlignBySelected);
        this.Document_UpdateInterfaceState();
    },

    distributeHor : function()
    {
        this.Slides[this.CurPage] && this.Slides[this.CurPage].graphicObjects.checkSelectedObjectsAndCallback(this.Slides[this.CurPage].graphicObjects.distributeHor, [editor.bAlignBySelected], false, AscDFH.historydescription_Presentation_DistHor);
        this.Document_UpdateInterfaceState();
    },
    distributeVer : function()
    {
        this.Slides[this.CurPage] && this.Slides[this.CurPage].graphicObjects.checkSelectedObjectsAndCallback(this.Slides[this.CurPage].graphicObjects.distributeVer, [editor.bAlignBySelected], false, AscDFH.historydescription_Presentation_DistVer);
        this.Document_UpdateInterfaceState();
    },

    bringToFront : function()
    {
        this.Slides[this.CurPage] && this.Slides[this.CurPage].graphicObjects.checkSelectedObjectsAndCallback(this.Slides[this.CurPage].graphicObjects.bringToFront, [], false, AscDFH.historydescription_Presentation_BringToFront);   //TODO: Передавать тип проверки
        this.Document_UpdateInterfaceState();
    },

    bringForward : function()
    {
        this.Slides[this.CurPage] && this.Slides[this.CurPage].graphicObjects.checkSelectedObjectsAndCallback(this.Slides[this.CurPage].graphicObjects.bringForward, [],false, AscDFH.historydescription_Presentation_BringForward);   //TODO: Передавать тип проверки
        this.Document_UpdateInterfaceState();
    },

    sendToBack : function()
    {

        this.Slides[this.CurPage] && this.Slides[this.CurPage].graphicObjects.checkSelectedObjectsAndCallback(this.Slides[this.CurPage].graphicObjects.sendToBack, [],false, AscDFH.historydescription_Presentation_SendToBack);   //TODO: Передавать тип проверки
        this.Document_UpdateInterfaceState();
    },


    bringBackward : function()
    {
        this.Slides[this.CurPage] && this.Slides[this.CurPage].graphicObjects.checkSelectedObjectsAndCallback(this.Slides[this.CurPage].graphicObjects.bringBackward, [], false, AscDFH.historydescription_Presentation_BringBackward);   //TODO: Передавать тип проверки
        this.Document_UpdateInterfaceState();
    },

    // Проверяем, находимся ли мы в гиперссылке сейчас
    Hyperlink_Check : function(bCheckEnd)
    {
        return isRealObject(this.Slides[this.CurPage]) && this.Slides[this.CurPage].graphicObjects.hyperlinkCheck(bCheckEnd);
    },


    addNextSlide: function(layoutIndex)
    {
        History.Create_NewPoint(AscDFH.historydescription_Presentation_AddNextSlide);
        var  new_slide, layout, i, _ph_type, sp;
        if(this.Slides[this.CurPage])
        {
            var cur_slide = this.Slides[this.CurPage];

            layout = AscFormat.isRealNumber(layoutIndex) ? (cur_slide.Layout.Master.sldLayoutLst[layoutIndex] ?  cur_slide.Layout.Master.sldLayoutLst[layoutIndex]:  cur_slide.Layout) : cur_slide.Layout.Master.getMatchingLayout(cur_slide.Layout.type, cur_slide.Layout.matchingName, cur_slide.Layout.cSld.name);
            new_slide = new Slide(this, layout, this.CurPage + 1);
            for(i = 0; i < layout.cSld.spTree.length; ++i)
            {
                if(layout.cSld.spTree[i].isPlaceholder())
                {
                    _ph_type = layout.cSld.spTree[i].getPhType();
                    if(_ph_type != AscFormat.phType_dt && _ph_type != AscFormat.phType_ftr && _ph_type != AscFormat.phType_hdr && _ph_type != AscFormat.phType_sldNum)
                    {
                        sp = layout.cSld.spTree[i].copy();
                        sp.setParent(new_slide);
                        sp.clearContent && sp.clearContent();
                        new_slide.addToSpTreeToPos(new_slide.cSld.spTree.length, sp);
                    }
                }
            }
            new_slide.setSlideNum(this.CurPage + 1);
            new_slide.setSlideSize(this.Width, this.Height);
            this.insertSlide(this.CurPage+1,  new_slide);

            for(i = this.CurPage + 2; i < this.Slides.length; ++i)
            {
                this.Slides[i].setSlideNum(i);
            }
            this.Recalculate();
        }
        else
        {
            var master = this.slideMasters[0];

            layout = AscFormat.isRealNumber(layoutIndex) ? (master.sldLayoutLst[layoutIndex] ?  master.sldLayoutLst[layoutIndex]:  master.sldLayoutLst[0]) : master.sldLayoutLst[0];


            new_slide = new Slide(this, layout, this.CurPage + 1);
            for(i = 0; i < layout.cSld.spTree.length; ++i)
            {
                if(layout.cSld.spTree[i].isPlaceholder())
                {
                    _ph_type = layout.cSld.spTree[i].getPhType();
                    if(_ph_type != AscFormat.phType_dt && _ph_type != AscFormat.phType_ftr && _ph_type != AscFormat.phType_hdr && _ph_type != AscFormat.phType_sldNum)
                    {
                        sp = layout.cSld.spTree[i].copy();
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
        this.DrawingDocument.m_oWordControl.GoToPage(this.CurPage + 1);
        this.Document_UpdateInterfaceState();
    },


    DublicateSlide: function()
    {
        var selected_slides = editor.WordControl.Thumbnails.GetSelectedArray();
        this.shiftSlides(Math.max.apply(Math, selected_slides) + 1, selected_slides, true);
    },

    shiftSlides: function(pos, array, bCopy)
    {
        History.Create_NewPoint(AscDFH.historydescription_Presentation_ShiftSlides);
        array.sort(AscCommon.fSortAscending);
        var deleted = [], i;

        if(!(bCopy === true || AscCommon.global_mouseEvent.CtrlKey))
        {
            for(i = array.length -1; i > - 1; --i)
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
        }
        else
        {
            for(i = array.length -1; i > - 1; --i)
            {
                deleted.push(this.Slides[array[i]].createDuplicate());
            }
        }

        var _selectedPage = this.CurPage;
        var _newSelectedPage = 0;

        deleted.reverse();
        for(i = 0; i < deleted.length; ++i)
        {
            this.insertSlide(pos + i, deleted[i]);
        }
        for(i = 0; i < this.Slides.length; ++i)
        {
            if (this.Slides[i].num == _selectedPage)
                _newSelectedPage = i;

            this.Slides[i].changeNum(i);
        }
        this.Recalculate();
        this.Document_UpdateUndoRedoState();
        this.DrawingDocument.OnEndRecalculate();
        this.DrawingDocument.UpdateThumbnailsAttack();
        this.DrawingDocument.m_oWordControl.GoToPage(_newSelectedPage);
    },

    deleteSlides: function(array)
    {
        if(array.length > 0 && (AscCommon.CollaborativeEditing.Is_Fast() || this.Document_Is_SelectionLocked(AscCommon.changestype_RemoveSlide, null) === false))
        {
            History.Create_NewPoint(AscDFH.historydescription_Presentation_DeleteSlides);
            var oldLen = this.Slides.length;
            array.sort(AscCommon.fSortAscending);
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
                this.DrawingDocument.m_oWordControl.GoToPage(array[array.length-1]+1 - array.length, undefined, true);
            }
            else
            {
                this.DrawingDocument.m_oWordControl.GoToPage(this.Slides.length -1, undefined, true);
            }
            editor.sync_HideComment();
            this.Document_UpdateUndoRedoState();
            this.DrawingDocument.OnEndRecalculate();
            this.DrawingDocument.UpdateThumbnailsAttack();
        }
    },

    changeLayout: function(_array, MasterLayouts, layout_index)
    {
        if(this.Document_Is_SelectionLocked(AscCommon.changestype_Layout) === false)
        {
            History.Create_NewPoint(AscDFH.historydescription_Presentation_ChangeLayout);
            if(this.Slides[this.CurPage])
            {
                this.Slides[this.CurPage].graphicObjects.resetSelection();
            }
            var layout = MasterLayouts.sldLayoutLst[layout_index];
            for(var i = 0; i < _array.length; ++i)
            {
                var slide = this.Slides[_array[i]];
                slide.setLayout(layout);
                for(var j = slide.cSld.spTree.length-1; j  > -1 ; --j)
                {
                    if(slide.cSld.spTree[j].isEmptyPlaceholder && slide.cSld.spTree[j].isEmptyPlaceholder())
                    {
                        slide.removeFromSpTreeById(slide.cSld.spTree[j].Get_Id());
                    }
                    else
                    {
                        var shape = slide.cSld.spTree[j];
                        if(shape.isPlaceholder() && (!shape.spPr || !shape.spPr.xfrm || !shape.spPr.xfrm.isNotNull()))
                        {
                            var hierarchy = shape.getHierarchy();
                            for(var t = 0; t < hierarchy.length; ++t)
                            {
                                if(hierarchy[t] && hierarchy[t].spPr && hierarchy[t].spPr.xfrm && hierarchy[t].spPr.xfrm.isNotNull())
                                {
                                    break;
                                }
                            }
                            if(t === hierarchy.length)
                            {
                                AscFormat.CheckSpPrXfrm(shape);
                            }
                        }
                    }
                }
                for(var j = 0; j < layout.cSld.spTree.length; ++j)
                {
                    if(layout.cSld.spTree[j].isPlaceholder())
                    {
                        var _ph_type = layout.cSld.spTree[j].getPhType();
                        if(_ph_type != AscFormat.phType_dt && _ph_type != AscFormat.phType_ftr && _ph_type != AscFormat.phType_hdr && _ph_type != AscFormat.phType_sldNum)
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
            }
            this.Recalculate();
            this.Document_UpdateInterfaceState();
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

        for(i = 0; i < this.slideMasters.length; ++i)
        {
            if(this.slideMasters[i] === themeInfo.Master)
            {
                break;
            }
        }
        if(i === this.slideMasters.length)
        {
            this.addSlideMaster(this.slideMasters.length, themeInfo.Master);
        }
        var _new_master = themeInfo.Master;
        _new_master.presentation = this;
        var _master_width = _new_master.Width;
        var _master_height = _new_master.Height;
        themeInfo.Master.changeSize(this.Width, this.Height);
        for(i = 0; i < themeInfo.Master.sldLayoutLst.length; ++i)
        {
            themeInfo.Master.sldLayoutLst[i].changeSize(this.Width, this.Height);
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
        History.Add(this, {Type: AscDFH.historyitem_Presentation_ChangeTheme, arrIndex: arr_ind});
        this.resetStateCurSlide();
        this.Recalculate();
        this.Document_UpdateInterfaceState();
    },

    changeSlideSizeFunction: function(width, height)
    {
        AscFormat.ExecuteNoHistory(function()
        {
            for(var i = 0; i < this.slideMasters.length; ++i)
            {
                this.slideMasters[i].changeSize(width, height);
                var master = this.slideMasters[i];
                for(var j = 0; j < master.sldLayoutLst.length; ++j)
                {
                    master.sldLayoutLst[j].changeSize(width, height);
                }
            }
            for(var i = 0; i < this.Slides.length; ++i)
            {
                this.Slides[i].changeSize(width, height);
            }
        }, this, []);
    },

    changeSlideSize: function(width, height)
    {
        if(this.Document_Is_SelectionLocked(AscCommon.changestype_SlideSize) === false)
        {
            History.Create_NewPoint(AscDFH.historydescription_Presentation_ChangeSlideSize);
            History.Add(this, {Type: AscDFH.historyitem_Presentation_SlideSize, oldW: this.Width, newW: width, oldH: this.Height, newH:  height});
            this.Width = width;
            this.Height = height;
            this.changeSlideSizeFunction(this.Width, this.Height);
            this.Recalculate();
            this.Document_UpdateInterfaceState();
        }
    },

    changeColorScheme: function(colorScheme)
    {
        if(this.viewMode === true)
        {
            return;
        }

        if(!(this.Document_Is_SelectionLocked(AscCommon.changestype_Theme) === false))
            return;

        if(!(colorScheme instanceof AscFormat.ClrScheme))
        {
            return;
        }
        History.Create_NewPoint(AscDFH.historydescription_Presentation_ChangeColorScheme);

        var arrInd = [];
        for(var i = 0; i < this.Slides.length; ++i)
        {
            if(!this.Slides[i].Layout.Master.Theme.themeElements.clrScheme.isIdentical(colorScheme))
            {
                this.Slides[i].Layout.Master.Theme.changeColorScheme(colorScheme.createDuplicate());
            }
            arrInd.push(i);
        }
        History.Add(this, {Type: AscDFH.historyitem_Presentation_ChangeColorScheme, arrIndex: arrInd});
        this.Recalculate();
        this.Document_UpdateInterfaceState();
    },


    removeSlide: function(pos)
    {
        if(AscFormat.isRealNumber(pos) && pos > -1 && pos < this.Slides.length)
        {
            History.Add(this, {Type: AscDFH.historyitem_Presentation_RemoveSlide, Pos: pos, Id: this.Slides[pos].Get_Id()});
            this.Slides[pos].removeAllCommentsToInterface();
            return this.Slides.splice(pos, 1)[0];
        }
        return null;
    },

    insertSlide: function(pos, slide)
    {
        History.Add(this, {Type: AscDFH.historyitem_Presentation_AddSlide, Pos: pos, Id: slide.Get_Id()});
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
        this.Recalculate();
        this.DrawingDocument.UpdateThumbnailsAttack();
	},
//-----------------------------------------------------------------------------------
// Функции для работы с совместным редактирования
//-----------------------------------------------------------------------------------

    Document_Is_SelectionLocked : function(CheckType, AdditionalData)
    {
        return false;
    },


    Save_Changes : function(Data, Writer)
    {
        Writer.WriteLong( AscDFH.historyitem_type_Document );

        var Type = Data.Type;

        // Пишем тип
        Writer.WriteLong( Type );


        switch ( Type )
        {
            case AscDFH.historyitem_Presentation_SetShowPr:
            {
                if(Data.newPr){
                    Writer.WriteBool(true);
                    Data.newPr.Write_ToBinary(Writer);
                }
                else{
                    Writer.WriteBool(false);
                }
                break;
            }
            case AscDFH.historyitem_Document_DefaultTab:
            {
                // Double : Default Tab

                Writer.WriteDouble( Data.New );

                break;
            }
            case AscDFH.historyitem_Presentation_RemoveSlide:
            case AscDFH.historyitem_Presentation_AddSlide:
            {
                var Pos = Data.UseArray ? Data.PosArray[0] : Data.Pos;
                Writer.WriteLong(Pos);
                Writer.WriteString2(Data.Id);
                break;
            }
            case AscDFH.historyitem_Presentation_SlideSize:
            {
                Writer.WriteDouble(Data.newW);
                Writer.WriteDouble(Data.newH);
                break;
            }
            case AscDFH.historyitem_Presentation_AddSlideMaster:
            {
                Writer.WriteLong(Data.pos);
                Writer.WriteString2(Data.master.Get_Id());
                break;
            }

            case AscDFH.historyitem_Presentation_ChangeTheme:
            case AscDFH.historyitem_Presentation_ChangeColorScheme:
            {
                //TODO: массив индексов возможно нужно перезаписать после принятия чужих изменений с изменением порядка слайдов
                Writer.WriteLong(Data.arrIndex.length);
                for(var i = 0; i < Data.arrIndex.length; ++i)
                {
                    Writer.WriteLong(Data.arrIndex[i]);
                }
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
        if ( AscDFH.historyitem_type_Document != ClassType )
            return;

        var Type = Reader.GetLong();


        switch ( Type )
        {
            case AscDFH.historyitem_Presentation_SetShowPr:
            {
                if(Reader.GetBool()){
                    this.showPr = new CShowPr();
                    this.showPr.Read_FromBinary(Reader);
                }
                else{
                    this.showPr = null;
                }
                break;
            }
            case AscDFH.historyitem_Presentation_AddSlide:
            {
                var pos = this.m_oContentChanges.Check( AscCommon.contentchanges_Add, Reader.GetLong());
                var Id = Reader.GetString2();
                var oSlide = g_oTableId.Get_ById(Id);
                if(oSlide)
                {
                    this.Slides.splice(pos, 0, oSlide);
                    AscCommon.CollaborativeEditing.Add_ChangedClass(this);
                }
                break;
            }
            case AscDFH.historyitem_Presentation_RemoveSlide:
            {
                var pos = Reader.GetLong();
                Reader.GetString2();

                var ChangesPos = this.m_oContentChanges.Check( AscCommon.contentchanges_Remove, pos);

                // действие совпало, не делаем его
                if ( false === ChangesPos )
                    break;
                this.slidesToUnlock.push(ChangesPos);
                if(this.Slides[ChangesPos])
                {
                    this.Slides[ChangesPos].removeAllCommentsToInterface();
                }
                this.Slides.splice(ChangesPos, 1);
                break;
            }

            case AscDFH.historyitem_Presentation_SlideSize:
            {
                var w = Reader.GetDouble();
                var h = Reader.GetDouble();
                var kw = w/this.Width;
                var kh = h/this.Height;
                this.Width = w;
                this.Height = h;
                AscCommon.CollaborativeEditing.ScaleX = kw;
                AscCommon.CollaborativeEditing.ScaleY = kh;
                this.changeSlideSizeFunction(this.Width, this.Height);
                editor.asc_fireCallback("asc_onPresentationSize", this.Width, this.Height);
                break;
            }
            case AscDFH.historyitem_Presentation_AddSlideMaster:
            {
                var pos = Reader.GetLong();
                var id = Reader.GetString2();
                this.slideMasters.splice(pos, 0, g_oTableId.Get_ById(id));
                this.bGoToPage = true;
                break;
            }
            case AscDFH.historyitem_Presentation_ChangeTheme:
            {
                var _len = Reader.GetLong(), index;
                for(var i = 0; i < _len; ++i)
                {
                    index = Reader.GetLong();
                    this.Slides[index] && this.Slides[index].checkSlideTheme();
                }
                break;
            }
            case AscDFH.historyitem_Presentation_ChangeColorScheme:
            {
                var recalculateMaps = this.GetRecalculateMaps(), key;
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
                var _len = Reader.GetLong(), index;
                for(var i = 0; i < _len; ++i)
                {
                    index = Reader.GetLong();
                    this.Slides[index] && this.Slides[index].checkSlideTheme();
                }
                break;
            }
        }
        return true;
    },


    Clear_CollaborativeMarks: function()
    {},

//-----------------------------------------------------------------------------------
// Функции для работы с комментариями
//-----------------------------------------------------------------------------------
    Add_Comment : function(CommentData)
    {
        if(this.Slides[this.CurPage])
        {
            History.Create_NewPoint(AscDFH.historydescription_Presentation_AddComment);
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

            if(this.Document_Is_SelectionLocked(AscCommon.changestype_AddComment, Comment) === false)
            {
                for(var i = this.Slides[this.CurPage].slideComments.comments.length - 1; i > -1; --i)
                {
                    this.Slides[this.CurPage].slideComments.comments[i].selected = false;
                }
                this.Slides[this.CurPage].addComment(Comment);

                this.DrawingDocument.OnRecalculatePage(this.CurPage, this.Slides[this.CurPage]);
                this.DrawingDocument.OnEndRecalculate();
                this.Document_UpdateInterfaceState();

                var Coords = editor.WordControl.m_oDrawingDocument.ConvertCoordsToCursorWR_Comment( Comment.x, Comment.y, this.CurPage);
                editor.sync_AddComment( Comment.Get_Id(), CommentData );
                editor.sync_HideComment();
                editor.sync_ShowComment(Comment.Id, Coords.X, Coords.Y );
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
        if(this.Document_Is_SelectionLocked(AscCommon.changestype_MoveComment, Id) === false)
        {
            History.Create_NewPoint(AscDFH.historydescription_Presentation_ChangeComment);
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
                    if(slide_num !== this.CurPage)
                    {
                        this.DrawingDocument.m_oWordControl.GoToPage(slide_num);
                    }
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
                    this.Slides[i].removeComment(Id);
                    if ( true === bSendEvent )
                        editor.sync_RemoveComment( Id );
                    this.Recalculate();
                    if(this.CurPage !== i)
                    {
                        this.DrawingDocument.m_oWordControl.GoToPage(i);
                    }
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
                    if(this.CurPage !== i)
                    {
                        this.DrawingDocument.m_oWordControl.GoToPage(i);
                    }

                    var Coords = this.DrawingDocument.ConvertCoordsToCursorWR_Comment(comments[j].x, comments[j].y, i);
                    this.Slides[i].showComment(Id, Coords.X, Coords.Y);
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

        if(AscCommon.CollaborativeEditing.Is_Fast() || editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Drawing_Props) === false) {
            History.Create_NewPoint(AscDFH.historydescription_Presentation_ParagraphAdd);
            var Count = sText.length;
            for (var Index = 0; Index < Count; Index++) {
                if (Index === Count - 1)
                    this.TurnOffRecalc = false;

                var _char = sText.charAt(Index);
                if (" " == _char)
                    this.Paragraph_Add(new ParaSpace(1));
                else
                    this.Paragraph_Add(new ParaText(_char));

                // На случай, если Count = 0
                this.TurnOffRecalc = false;
            }
        }
        this.Document_UpdateUndoRedoState();
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


    Add_TextArt: function(nStyle)
    {
        if(this.Slides[this.CurPage])
        {
            History.Create_NewPoint(AscDFH.historydescription_Document_AddTextArt);
            var oTextArt = this.Slides[this.CurPage].graphicObjects.createTextArt(nStyle, false);
            oTextArt.addToDrawingObjects();
            oTextArt.checkExtentsByDocContent();
            oTextArt.spPr.xfrm.setOffX((this.Slides[this.CurPage].Width - oTextArt.spPr.xfrm.extX)/2);
            oTextArt.spPr.xfrm.setOffY((this.Slides[this.CurPage].Height - oTextArt.spPr.xfrm.extY)/2);
            this.Slides[this.CurPage].graphicObjects.resetSelection();

            if(oTextArt.bSelectedText){
                this.Slides[this.CurPage].graphicObjects.selectObject(oTextArt, 0);
            }
            else{
                var oContent = oTextArt.getDocContent();
                oContent.Content[0].Document_SetThisElementCurrent(false);
                this.Select_All();
            }
            this.Recalculate();
            this.Document_UpdateInterfaceState();
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
    },

    Is_TrackRevisions: function()
    {
        return false;
    }
};


function collectSelectedObjects(aSpTree, aCollectArray, bRecursive)
{
    for(var i = 0; i < aSpTree.length; ++i)
    {
        if(aSpTree[i].selected)
        {
            aCollectArray.push(new DrawingCopyObject(aSpTree[i].copy(), aSpTree[i].x, aSpTree[i].y, aSpTree[i].extX, aSpTree[i].extY, aSpTree[i].getBase64Img()));
        }
        if(bRecursive && aSpTree[i].getObjectType() === AscDFH.historyitem_type_GroupShape)
        {
            collectSelectedObjects(aSpTree[i].spTree, aCollectArray, bRecursive);
        }
    }
}

//------------------------------------------------------------export----------------------------------------------------
window['AscCommonSlide'] = window['AscCommonSlide'] || {};
window['AscCommonSlide'].CPresentation = CPresentation;
