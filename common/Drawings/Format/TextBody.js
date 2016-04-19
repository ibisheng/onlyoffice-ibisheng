"use strict";

/**
 * Created with JetBrains WebStorm.
 * User: Sergey.Luzyanin
 * Date: 6/26/13
 * Time: 11:55 AM
 * To change this template use File | Settings | File Templates.
 */




var  field_type_slidenum   = 0;
var  field_type_datetime   = 1;
var  field_type_datetime1  = 2;
var  field_type_datetime2  = 3;
var  field_type_datetime3  = 4;
var  field_type_datetime4  = 5;
var  field_type_datetime5  = 6;
var  field_type_datetime6  = 7;
var  field_type_datetime7  = 8;
var  field_type_datetime8  = 9;
var  field_type_datetime9  = 10;
var  field_type_datetime10 = 11;
var  field_type_datetime11 = 12;
var  field_type_datetime12 = 13;
var  field_type_datetime13 = 14;

var pHText = [];
pHText[0] = [];//rus         ""                                                          ;
pHText[0][phType_body]  =    "Slide text";             //"Текст слайда" ;                              ;
pHText[0][phType_chart]    = "Chart";         // "Диаграмма" ;                                     ;
pHText[0][phType_clipArt]  = "ClipArt";// "Текст слайда" ; //(Clip Art)                   ;
pHText[0][phType_ctrTitle] = "Slide title";// "Заголовок слайда" ; //(Centered Title)     ;
pHText[0][phType_dgm]      = "Diagram";// "Диаграмма";// (Diagram)                        ;
pHText[0][phType_dt]       = "Date and time";// "Дата и время";// (Date and Time)         ;
pHText[0][phType_ftr]      = "Footer";// "Нижний колонтитул";// (Footer)                  ;
pHText[0][phType_hdr]      = "Header";// "Верхний колонтитул"; //(Header)                 ;
pHText[0][phType_media]    = "Media";// "Текст слайда"; //(Media)                         ;
pHText[0][phType_obj]      = "Slide text";// "Текст слайда"; //(Object)                   ;
pHText[0][phType_pic]      = "Picture";// "Вставка рисунка"; //(Picture)                  ;
pHText[0][phType_sldImg]   = "Image";// "Вставка рисунка"; //(Slide Image)                ;
pHText[0][phType_sldNum]   = "Slide number";// "Номер слайда"; //(Slide Number)           ;
pHText[0][phType_subTitle] = "Slide subtitle";// "Подзаголовок слайда"; //(Subtitle)      ;
pHText[0][phType_tbl]      = "Table";// "Таблица"; //(Table)                              ;
pHText[0][phType_title]    = "Slide title";// "Заголовок слайда" ;  //(Title)             ;


var field_months = [];
field_months[0] = [];//rus
field_months[0][0]  = "января" ;
field_months[0][1]  = "февраля";
field_months[0][2]  = "марта";
field_months[0][3]  = "апреля";
field_months[0][4]  = "мая";
field_months[0][5]  = "июня";
field_months[0][6]  = "июля";
field_months[0][7]  = "августа";
field_months[0][8]  = "сентября";
field_months[0][9]  = "октября";
field_months[0][10] = "ноября";
field_months[0][11] = "декабря";





//Overflow Types
var nOTClip     = 0;
var nOTEllipsis = 1;
var nOTOwerflow = 2;
//-----------------------------

//Text Anchoring Types
var nTextATB = 0;// (Text Anchor Enum ( Bottom ))
var nTextATCtr = 1;// (Text Anchor Enum ( Center ))
var nTextATDist = 2;// (Text Anchor Enum ( Distributed ))
var nTextATJust = 3;// (Text Anchor Enum ( Justified ))
var nTextATT = 4;// Top



function CTextBody()
{
    this.bodyPr = null;
    this.lstStyle = null;
    this.content = null;
    this.parent = null;

    this.content2 = null;
    this.compiledBodyPr = null;
    this.parent = null;
    this.recalcInfo =
    {
        recalculateBodyPr: true,
        recalculateContent2: true
    };
    this.textPropsForRecalc = [];
    this.bRecalculateNumbering = true;
    this.Id = AscCommon.g_oIdCounter.Get_NewId();
    AscCommon.g_oTableId.Add(this, this.Id);
}

CTextBody.prototype =
{
    createDuplicate: function()
    {
        var ret = new CTextBody();
        if(this.bodyPr)
            ret.setBodyPr(this.bodyPr.createDuplicate());
        if(this.lstStyle)
            ret.setLstStyle(this.lstStyle.createDuplicate());
        if(this.content)
            ret.setContent(this.content.Copy(ret, NEW_WORKSHEET_DRAWING_DOCUMENT));
        return ret;
    },

    createDuplicate2: function()
    {
        var ret = new CTextBody();
        if(this.bodyPr)
            ret.setBodyPr(this.bodyPr.createDuplicate());
        if(this.lstStyle)
            ret.setLstStyle(this.lstStyle.createDuplicate());
        if(this.content){
            var bTrackRevision = false;
            if(typeof editor !== "undefined" && editor && editor.WordControl && editor.WordControl.m_oLogicDocument.TrackRevisions === true){
                bTrackRevision= true;
                editor.WordControl.m_oLogicDocument.TrackRevisions = false;
            }
            ret.setContent(this.content.Copy3(ret));
            if(bTrackRevision){
                editor.WordControl.m_oLogicDocument.TrackRevisions = true;
            }
        }
        return ret;
    },

    Get_Id: function()
    {
        return this.Id;
    },

    Is_TopDocument: function()
    {
        return false;
    },

    Is_DrawingShape: function(bRetShape)
    {
        if(bRetShape === true)
        {
            return this.parent;
        }
        return true;
    },

    Get_Theme : function()
    {
        return this.parent.Get_Theme();
    },

    Get_ColorMap: function()
    {
        return this.parent.Get_ColorMap();
    },

    setParent: function(pr)
    {
        History.Add(this, {Type: historyitem_TextBodySetParent, oldPr: this.parent, newPr: pr});
        this.parent = pr;
    },

    setBodyPr: function(pr)
    {
        History.Add(this, {Type: historyitem_TextBodySetBodyPr, oldPr: this.bodyPr, newPr: pr});
        this.bodyPr = pr;
        if(this.parent && this.parent.recalcInfo)
        {
            this.parent.recalcInfo.recalcContent = true;
            this.parent.recalcInfo.recalculateContent = true;
            this.parent.recalcInfo.recalculateContent2 = true;
            this.parent.recalcInfo.recalcTransformText = true;
            if(this.parent.addToRecalculate)
            {
                this.parent.addToRecalculate();
            }
        }

        if(this.parent && this.parent.parent && this.parent.parent.parent && this.parent.parent.parent.parent
            && this.parent.parent.parent.parent.parent && this.parent.parent.parent.parent.parent.handleUpdateInternalChart && History.Is_On())
        {
            this.parent.parent.parent.parent.parent.handleUpdateInternalChart();
        }
    },

    setContent: function(pr)
    {
        History.Add(this, {Type: historyitem_TextBodySetContent, oldPr: this.content, newPr: pr});
        this.content = pr;
    },

    setLstStyle: function(lstStyle)
    {
        History.Add(this, {Type:historyitem_TextBodySetLstStyle, oldPr: this.lstStyle, newPr: lstStyle});
        this.lstStyle = lstStyle;
    },

    getObjectType: function()
    {
        return historyitem_type_TextBody;
    },

    Undo: function(data)
    {
        switch(data.Type)
        {
            case historyitem_TextBodySetParent:
            {
                this.parent = data.oldPr;
                break;
            }

            case historyitem_TextBodySetBodyPr:
            {
                this.bodyPr = data.oldPr;


                if(this.parent && this.parent.parent && this.parent.parent.parent && this.parent.parent.parent.parent && this.parent.parent.parent.parent.parent && this.parent.parent.parent.parent.parent.handleUpdateInternalChart)
                {
                    this.parent.parent.parent.parent.parent.handleUpdateInternalChart();
                }
                break;
            }
            case historyitem_TextBodySetContent:
            {
                this.content = data.oldPr;
                break;
            }
            case historyitem_TextBodySetLstStyle:
            {
                this.lstStyle = data.oldPr;
                break;
            }
        }
    },

    Redo: function(data)
    {
        switch(data.Type)
        {
            case historyitem_TextBodySetParent:
            {
                this.parent = data.newPr;
                break;
            }

            case historyitem_TextBodySetBodyPr:
            {
                this.bodyPr = data.newPr;

                if(this.parent && this.parent.parent && this.parent.parent.parent && this.parent.parent.parent.parent && this.parent.parent.parent.parent.parent && this.parent.parent.parent.parent.parent.handleUpdateInternalChart)
                {
                    this.parent.parent.parent.parent.parent.handleUpdateInternalChart();
                }
                break;
            }
            case historyitem_TextBodySetContent:
            {
                this.content = data.newPr;
                break;
            }
            case historyitem_TextBodySetLstStyle:
            {
                this.lstStyle = data.newPr;
                break;
            }
        }
    },
    Save_Changes: function(data, w)
    {
        w.WriteLong(historyitem_type_TextBody);
        w.WriteLong(data.Type);
        switch(data.Type)
        {
            case historyitem_TextBodySetParent:
            case historyitem_TextBodySetContent:
            {
                writeObject(w, data.newPr);
                break;
            }
            case historyitem_TextBodySetBodyPr:
            case historyitem_TextBodySetLstStyle:
            {
                w.WriteBool(isRealObject(data.newPr));
                if(isRealObject(data.newPr))
                {
                    data.newPr.Write_ToBinary(w);
                }
                break;
            }
        }
    },

    Load_Changes: function(r)
    {
        if(r.GetLong() === historyitem_type_TextBody)
        {
            var type = r.GetLong();
            switch(type)
            {
                case historyitem_TextBodySetParent:
                {
                    this.parent = readObject(r);
                    break;
                }

                case historyitem_TextBodySetBodyPr:
                {
                    if(r.GetBool())
                    {
                        this.bodyPr = new CBodyPr();
                        this.bodyPr.Read_FromBinary(r);
                    }
                    else
                    {
                        this.bodyPr = null;
                    }

                    if(this.parent && this.parent.parent && this.parent.parent.parent && this.parent.parent.parent.parent && this.parent.parent.parent.parent.parent && this.parent.parent.parent.parent.parent.handleUpdateInternalChart)
                    {
                        this.parent.parent.parent.parent.parent.handleUpdateInternalChart();
                    }
                    break;
                }
                case historyitem_TextBodySetContent:
                {
                    this.content = readObject(r);
                    break;
                }
                case historyitem_TextBodySetLstStyle:
                {
                    if(r.GetBool())
                    {
                        this.lstStyle = new TextListStyle();
                        this.lstStyle.Read_FromBinary(r);
                    }
                    else
                    {
                        this.lstStyle = null;
                    }

                    break;
                }
            }
        }
    },

    Write_ToBinary2: function(w)
    {
        w.WriteLong(historyitem_type_TextBody);
        w.WriteString2(this.Id);
    },

    Read_FromBinary2: function(r)
    {
        this.Id = r.GetString2();
    },

    recalculate: function()
    {

    },


    getFieldText: function(fieldType, slide, firstSlideNum)
    {
        var ret = "";
        if(this.parent && this.parent.isPlaceholder())
        {
            var _ph_type = this.parent.getPlaceholderType();
            switch (_ph_type)
            {
                case phType_dt :
                {
                    var _cur_date = new Date();
                    var _cur_year = _cur_date.getFullYear();
                    var _cur_month = _cur_date.getMonth();
                    var _cur_month_day = _cur_date.getDate();
                    //TODO: switch по fieldType
                    ret += (_cur_month_day > 9 ? _cur_month_day : "0" + _cur_month_day)
                                +  "." +   ((_cur_month +1) > 9 ? (_cur_month + 1) : "0" + (_cur_month +1))
                                + "." + _cur_year;
                    break;
                }
                case phType_sldNum :
                {
                    var _firstSlideNum = isRealNumber(firstSlideNum) ? firstSlideNum : 1;
                    if(slide instanceof Slide)
                    {
                        ret += "" + (slide.num+_firstSlideNum);
                    }
                    break;
                }
            }
        }
        return ret;
    },

    recalculateBodyPr: function()
    {
        ExecuteNoHistory(function()
        {
            if(!this.compiledBodyPr)
                this.compiledBodyPr = new CBodyPr();
            this.compiledBodyPr.setDefault();
            if(this.parent && this.parent.isPlaceholder && this.parent.isPlaceholder())
            {
                var hierarchy = this.parent.getHierarchy();
                for(var i = hierarchy.length - 1; i > -1; --i)
                {
                    if(isRealObject(hierarchy[i]) && isRealObject(hierarchy[i].txBody) && isRealObject(hierarchy[i].txBody.bodyPr))
                        this.compiledBodyPr.merge(hierarchy[i].txBody.bodyPr)
                }
            }
            if(isRealObject(this.bodyPr))
            {
                this.compiledBodyPr.merge(this.bodyPr);
            }
        }, this, []);
    },

    checkTextFit: function()
    {
        if(this.parent && this.parent.parent && this.parent.parent instanceof Slide)
        {
            if(isRealObject(this.bodyPr.textFit))
            {
                if(this.bodyPr.textFit.type === text_fit_NormAuto)
                {
                    var text_fit = this.bodyPr.textFit;
                    var font_scale, spacing_scale;
                    if(isRealNumber(text_fit.fontScale))
                        font_scale = text_fit.fontScale/100000;
                    if(isRealNumber(text_fit.lnSpcReduction))
                        spacing_scale = text_fit.lnSpcReduction/100000;

                    if(isRealNumber(font_scale)|| isRealNumber(spacing_scale))
                    {
                        var pars = this.content.Content;
                        for(var index = 0; index < pars.length; ++index)
                        {
                            var parg = pars[index];
                            if(isRealNumber(spacing_scale))
                            {
                                var spacing2 = parg.Get_CompiledPr(false).ParaPr.Spacing;
                                var new_spacing = {};
                                var spc = spacing2.Line*spacing_scale;
                                new_spacing.LineRule = spacing2.LineRule;
                                if(isRealNumber(spc))
                                {
                                    if(spacing2.LineRule === Asc.linerule_Auto)
                                    {
                                        new_spacing.Line = spacing2.Line - spacing_scale;
                                    }
                                    else
                                    {
                                        new_spacing.Line = spc;
                                    }
                                }
                                parg.Set_Spacing(new_spacing);
                            }
                            if(isRealNumber(font_scale))
                            {
                                var bReset = false;
                                if(AscCommon.g_oIdCounter.m_bLoad)
                                {
                                    bReset = true;
                                    AscCommon.g_oIdCounter.m_bLoad = false;
                                }
                                 var redFontSize = Math.round(parg.Get_CompiledPr(false).TextPr.FontSize*font_scale);
                                if(bReset)
                                {
                                    AscCommon.g_oIdCounter.m_bLoad = true;
                                }
                                this.checkParagraphContent(parg, font_scale, true, redFontSize);
                            }
                        }
                    }
                    this.bodyPr.textFit = null;
                }
            }
        }
    },

    checkParagraphContent: function(parg, fontScale, bParagraph, paragrRedFontSize)
    {
        for(var r = 0; r < parg.Content.length; ++r)
        {
            var item = parg.Content[r];
            switch(item.Type)
            {
                case para_Run:
                {
                    if(isRealNumber(item.Pr.FontSize))
                    {
                        item.Set_FontSize(Math.round(item.Pr.FontSize*fontScale));
                    }
                    else
                    {
                        item.Set_FontSize(paragrRedFontSize);
                }
                    break;
                }
                case para_Hyperlink:
                {
                    this.checkParagraphContent(item, fontScale, false, paragrRedFontSize);
                    break;
                }
            }
        }
    },

    Check_AutoFit: function()
    {
        return this.parent && this.parent.Check_AutoFit && this.parent.Check_AutoFit(true) || false;
    },

    Refresh_RecalcData: function()
    {
        if(this.parent && this.parent.recalcInfo)
        {
            this.parent.recalcInfo.recalcContent = true;
            this.parent.recalcInfo.recalcTransformText = true;

            this.parent.recalcInfo.recalculateContent = true;
            this.parent.recalcInfo.recalculateTransformText = true;
            if(this.parent.addToRecalculate)
            {
                this.parent.addToRecalculate();
            }
        }
    },

    isEmpty: function()
    {
        return this.content.Is_Empty();
    },

    OnContentReDraw: function()
    {},

    Get_StartPage_Absolute: function()
    {
        return 0;//TODO;
    },

    Get_AbsolutePage : function(CurPage)
    {
        if(this.parent && this.parent.Get_AbsolutePage)
        {
            return this.parent.Get_AbsolutePage();
        }
        return 0;//TODO;
    },

    Get_AbsoluteColumn : function(CurPage)
    {
        return 0;//TODO;
    },

    Get_TextBackGroundColor: function()
    {
        return undefined;
    },

    Is_HdrFtr: function()
    {
        return false;
    },

    Get_PageContentStartPos: function(pageNum)
    {
        return {X: 0, Y: 0, XLimit: this.contentWidth, YLimit: 20000};
    },

    Get_Numbering: function()
    {
        return new CNumbering();
    },

    Set_CurrentElement: function(bUpdate, pageIndex)
    {
        if(this.parent.Set_CurrentElement)
        {
            this.parent.Set_CurrentElement(bUpdate, pageIndex);
        }
    },

    checkDocContent: function()
    {
        this.parent && this.parent.checkDocContent && this.parent.checkDocContent();
    },

    getBodyPr: function()
    {
        if(this.recalcInfo.recalculateBodyPr)
        {
            this.recalculateBodyPr();
            this.recalcInfo.recalculateBodyPr = false;
        }
        return this.compiledBodyPr;
    },

    getSummaryHeight: function()
    {
        return this.content.Get_SummaryHeight();
    },

    getSummaryHeight2: function()
    {
        return this.content2 ? this.content2.Get_SummaryHeight() : 0;
    },

    getCompiledBodyPr: function()
    {
        this.recalculateBodyPr();
        return this.compiledBodyPr;
    },

    Get_TableStyleForPara: function()
    {
        return null;
    },

    checkCurrentPlaceholder: function()
    {
        return false;
    },

    draw: function(graphics)
    {
        if((!this.content || this.content.Is_Empty()) && this.parent.isEmptyPlaceholder() && !this.checkCurrentPlaceholder() )
        {
            if (graphics.IsNoDrawingEmptyPlaceholder !== true && graphics.IsNoDrawingEmptyPlaceholderText !== true && this.content2)
            {
                if(graphics.IsNoSupportTextDraw)
                {
                    var _w2 = this.content2.XLimit;
                    var _h2 = this.content2.Get_SummaryHeight();
                    graphics.rect(this.content2.X, this.content2.Y, _w2, _h2);
                }

                this.content2.Set_StartPage(0);
                this.content2.Draw(0, graphics);
            }
        }
        else if(this.content)
        {
            if(graphics.IsNoSupportTextDraw)
            {
                var _w = this.content.XLimit;
                var _h = this.content.Get_SummaryHeight();
                graphics.rect(this.content.X, this.content.Y, _w, _h);
            }
            var old_start_page = this.content.StartPage;
            this.content.Set_StartPage(0);
            this.content.Draw(0, graphics);
            this.content.Set_StartPage(old_start_page);
        }
    },

    Get_Styles: function(level)
    {
        if(this.parent)
        {
            return this.parent.getStyles(level);
        }
        return ExecuteNoHistory(function(){
            var oStyles = new CStyles(false);
            var Style_Para_Def = new CStyle( "Normal", null, null, styletype_Paragraph );
            Style_Para_Def.Create_Default_Paragraph();
            oStyles.Default.Paragraph = oStyles.Add( Style_Para_Def );
            return {styles: oStyles, lastId: oStyles.Default.Paragraph};
        }, this, []);
    },

    Is_Cell: function()
    {
        return false;
    },

    OnContentRecalculate: function()
    {},

    getMargins: function ()
    {
        var _parent_transform = this.parent.transform;
        var _l;
        var _r;
        var _b;
        var _t;
        var _body_pr = this.getBodyPr();
        var sp = this.parent;
        if(isRealObject(sp.spPr) && isRealObject(sp.spPr.geometry) && isRealObject(sp.spPr.geometry.rect))
        {
            var _rect = sp.spPr.geometry.rect;
            _l = _rect.l + _body_pr.lIns;
            _t = _rect.t + _body_pr.tIns;
            _r = _rect.r - _body_pr.rIns;
            _b = _rect.b - _body_pr.bIns;
        }
        else
        {
            _l = _body_pr.lIns;
            _t = _body_pr.tIns;
            _r = sp.extX - _body_pr.rIns;
            _b = sp.extY - _body_pr.bIns;
        }

        var x_lt, y_lt, x_rb, y_rb;

        x_lt = _parent_transform.TransformPointX(_l, _t);
        y_lt = _parent_transform.TransformPointY(_l, _t);

        x_rb = _parent_transform.TransformPointX(_r, _b);
        y_rb = _parent_transform.TransformPointY(_r, _b);

        var hc = (_r - _l)/2;
        var vc = (_b - _t)/2;

        var xc = (x_lt + x_rb)/2;
        var yc = (y_lt + y_rb)/2;

        return {L : xc - hc , T: yc - vc , R : xc + hc , B : yc + vc, textMatrix : this.parent.transform};
    },

    Refresh_RecalcData2: function(pageIndex)
    {
        this.parent && this.parent.Refresh_RecalcData2 && this.parent.Refresh_RecalcData2(pageIndex, this);
    },

    getContentOneStringSizes: function()
    {
        //TODO: потом переделать
        this.content.Reset(0, 0, 20000, 20000);//выставляем большую ширину чтобы текст расчитался в одну строку.
        this.content.Recalculate_Page(0, true);
        return {w: this.content.Content[0].Lines[0].Ranges[0].W+0.1, h: this.content.Get_SummaryHeight()+0.1};
    },

    recalculateByMaxWord: function()
    {
        var max_content = this.content.Recalculate_MinMaxContentWidth().Max;
        this.content.Set_ApplyToAll(true);
        this.content.Set_ParagraphAlign(AscCommon.align_Center);
        this.content.Set_ApplyToAll(false);
        this.content.Reset(0, 0,max_content, 20000);
        this.content.Recalculate_Page(0, true);
        return {w: max_content, h: this.content.Get_SummaryHeight()};
    },

    getRectWidth: function(maxWidth)
    {
        var body_pr = this.getBodyPr();
        var r_ins = body_pr.rIns;
        var l_ins = body_pr.lIns;
        var max_content_width = maxWidth - r_ins - l_ins;
        this.content.Reset(0, 0, max_content_width, 20000);
        this.content.Recalculate_Page(0, true);
        var max_width = 0;
        for(var i = 0; i < this.content.Content.length; ++i)
        {
            var par = this.content.Content[i];
            for(var j = 0; j < par.Lines.length; ++j)
            {
                if(par.Lines[j].Ranges[0].W  > max_width)
                {
                    max_width = par.Lines[j].Ranges[0].W;
                }
            }
        }
        return max_width + 2 + r_ins + l_ins;
    },

    getMaxContentWidth: function(maxWidth, bLeft)
    {
        this.content.Reset(0, 0, maxWidth - 0.01, 20000);
        if(bLeft)
        {
            this.content.Set_ApplyToAll(true);
            this.content.Set_ParagraphAlign(AscCommon.align_Left);
            this.content.Set_ApplyToAll(false);
        }
        this.content.Recalculate_Page(0, true);
        var max_width = 0, arr_content = this.content.Content, paragraph_lines, i, j;
        for(i = 0;  i < arr_content.length; ++i)
        {
            paragraph_lines = arr_content[i].Lines;
            for(j = 0;  j < paragraph_lines.length; ++j)
            {
                if(paragraph_lines[j].Ranges[0].W > max_width)
                    max_width = paragraph_lines[j].Ranges[0].W;
            }
        }
        return max_width + 0.01;
    },

    Get_PrevElementEndInfo : function(CurElement)
    {
        return null;
    },

    Is_UseInDocument: function(Id)
    {
        if(Id != undefined)
        {
            if(!this.content || this.content.Get_Id() !== Id)
            {
                return false;
            }
        }
        if(this.parent && this.parent.Is_UseInDocument)
        {
            return this.parent.Is_UseInDocument();
        }
        return false;
    },

    Get_ParentTextTransform: function()
    {
        if(this.parent && this.parent.transformText)
        {
            return this.parent.transformText.CreateDublicate();
        }
        return null;
    }
};

function CreateParaContentFromString(str)
{
    if (str == '\t')
    {
        return new ParaTab();
    }
    else if (str == '\n')
    {
        return new ParaNewLine( break_Line );
    }
    else if (str != ' ')
    {
        return new ParaText(str);
    }
    else
    {
        return new ParaSpace(1);
    }
}