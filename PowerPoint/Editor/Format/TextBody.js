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

//Vertical Text Types
var nVertTTeaVert          = 0; //( ( East Asian Vertical ))
var nVertTThorz            = 1; //( ( Horizontal ))
var nVertTTmongolianVert   = 2; //( ( Mongolian Vertical ))
var nVertTTvert            = 3; //( ( Vertical ))
var nVertTTvert270         = 4;//( ( Vertical 270 ))
var nVertTTwordArtVert     = 5;//( ( WordArt Vertical ))
var nVertTTwordArtVertRtl  = 6;//(Vertical WordArt Right to Left)
//-------------------------------------------------------------------
//Text Wrapping Types
var nTWTNone   = 0;
var nTWTSquare = 1;
//-------------------

function CTextBody(shape)
{
    this.bodyPr = new CBodyPr();
    this.lstStyle = new TextListStyle();


    this.content2 = null;
    this.compiledBodyPr = new CBodyPr();
    this.recalcInfo =
    {
        recalculateBodyPr: true
    };

    this.textPropsForRecalc = [];
    this.bRecalculateNumbering = true;
    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);

    if(isRealObject(shape))
    {
        this.setShape(shape);
        this.setDocContent(new CDocumentContent(this, editor.WordControl.m_oLogicDocument.DrawingDocument, 0, 0, 0, 20000, false, false));
    }
}

CTextBody.prototype =
{

    Get_Id: function()
    {
        return this.Id;
    },

    setLstStyle: function(lstStyle)
    {
        History.Add(this, {Type:historyitem_SetLstStyle, oldPr: this.lstStyle, newPr: lstStyle});
        this.lstStyle = lstStyle;
    },

    setShape: function(shape)
    {
        History.Add(this, {Type:historyitem_SetShape, oldPr: this.shape, newPr: shape});
        this.shape = shape;
    },

    setDocContent: function(docContent)
    {
        History.Add(this, {Type:historyitem_SetDocContent, oldPr: this.content, newPr: docContent});
        this.content = docContent;

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

    recalcColors: function()
    {
        this.content.recalcColors();
    },

    recalculateBodyPr: function()
    {
        if(this.recalcInfo.recalculateBodyPr)
        {
            this.compiledBodyPr.setDefault();
            if(this.shape.isPlaceholder())
            {
                var hierarchy = this.shape.getHierarchy();
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
        }
    },

    Refresh_RecalcData: function()
    {},


    updateSelectionState: function(drawingDocument)
    {
        var Doc = this.content;
        if ( true === Doc.Is_SelectionUse() && !Doc.Selection_IsEmpty())
        {
           drawingDocument.UpdateTargetTransform(this.shape.transformText);
            drawingDocument.TargetEnd();
            drawingDocument.SelectEnabled(true);
            drawingDocument.SelectClear();
            this.content.Selection_Draw_Page(this.shape.parent ? this.shape.parent.num : this.shape.chartGroup.parent.num);
            drawingDocument.SelectShow();
        }
        else /*if(this.parent.elementsManipulator.Document.CurPos.Type == docpostype_FlowObjects ) */
        {
            drawingDocument.UpdateTargetTransform(this.shape.transformText);
            drawingDocument.TargetShow();
            drawingDocument.SelectEnabled(false);
        }
    },

    calculateContent: function()
    {
        var parent_object = this.shape.getParentObjects();
        for(var i = 0; i < this.textPropsForRecalc.length; ++i)
        {
            var props = this.textPropsForRecalc[i].Value;
            if(props && props.FontFamily && typeof props.FontFamily.Name === "string" && isThemeFont(props.FontFamily.Name))
            {
                props.FontFamily.themeFont = props.FontFamily.Name;
                props.FontFamily.Name = getFontInfo(props.FontFamily.Name)(parent_object.theme.themeElements.fontScheme);
            }
            var TextPr = props;
            var parents = parent_object;
            if(isRealObject(TextPr) && isRealObject(TextPr.unifill) && isRealObject(TextPr.unifill.fill) && TextPr.unifill.fill.type === FILL_TYPE_SOLID && isRealObject(TextPr.unifill.fill.color))
            {
                TextPr.unifill.fill.color.Calculate(parents.theme, parents.slide, parents.layout, parents.master, {R:0, G:0, B:0, A:255});
                TextPr.Color = new CDocumentColor(TextPr.unifill.fill.color.RGBA.R, TextPr.unifill.fill.color.RGBA.G, TextPr.unifill.fill.color.RGBA.B);
            }
            if(isRealObject(props.FontFamily) && typeof props.FontFamily.Name === "string")
            {
                TextPr.RFonts.Ascii = {Name : TextPr.FontFamily.Name, Index: -1};
                TextPr.RFonts.CS = {Name : TextPr.FontFamily.Name, Index: -1};
                TextPr.RFonts.HAnsi = {Name : TextPr.FontFamily.Name, Index: -1};
            }
        }
        this.textPropsForRecalc.length = 0;
        if(this.bRecalculateNumbering)
        {
            this.content.RecalculateNumbering();
            this.bRecalculateNumbering = false;
        }
        this.content.Set_StartPage(/*isRealNumber(this.shape.parent.num) ? this.shape.parent.num : */0);
        var _l, _t, _r, _b;

        var _body_pr = this.getBodyPr();
        var sp = this.shape;
        if(isRealObject(sp.spPr.geometry) && isRealObject(sp.spPr.geometry.rect))
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

        if(_body_pr.upright === false)
        {
            var _content_width;
            if(!(_body_pr.vert === nVertTTvert || _body_pr.vert === nVertTTvert270))
            {
                _content_width = _r - _l;
                this.contentWidth = _content_width;
                this.contentHeight = _b - _t;
            }
            else
            {
                _content_width = _b - _t;
                this.contentWidth = _content_width;
                this.contentHeight = _r - _l;
            }

        }
        else
        {
            var _full_rotate = sp.getFullRotate();
            if((_full_rotate >= 0 && _full_rotate < Math.PI*0.25)
                || (_full_rotate > 3*Math.PI*0.25 && _full_rotate < 5*Math.PI*0.25)
                || (_full_rotate > 7*Math.PI*0.25 && _full_rotate < 2*Math.PI))
            {
                if(!(_body_pr.vert === nVertTTvert || _body_pr.vert === nVertTTvert270))
                {
                    _content_width = _r - _l;
                    this.contentWidth = _content_width;
                    this.contentHeight = _b - _t;
                }
                else
                {
                    _content_width = _b - _t;
                    this.contentWidth = _content_width;
                    this.contentHeight = _r - _l;
                }
            }
            else
            {
                if(!(_body_pr.vert === nVertTTvert || _body_pr.vert === nVertTTvert270))
                {
                    _content_width = _b - _t;
                    this.contentWidth = _content_width;
                    this.contentHeight = _r - _l;
                }
                else
                {
                    _content_width = _r - _l;
                    this.contentWidth  = _content_width;
                    this.contentHeight = _b - _t;
                }
            }
        }
        this.content.Reset(0, 0, _content_width, 20000);
        this.content.Recalculate_Page(0, true);
    },

    updateCursorType: function(x, y, e)
    {
        if(this.shape && this.shape.invertTransformText)
        {
            var tx = this.shape.invertTransformText.TransformPointX(x, y);
            var ty = this.shape.invertTransformText.TransformPointY(x, y);
            this.content.Update_CursorType(tx, ty, 0);
        }
    },

    Get_StartPage_Absolute: function()
    {
        return isRealObject(this.shape) && isRealObject(this.shape.parent) && isRealNumber(this.shape.parent.num) ? this.shape.parent.num : (this.shape.chartGroup ? this.shape.chartGroup.parent.num : 0);
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

    getBodyPr: function()
    {
        if(this.recalcInfo.recalculateBodyPr)
        {
            this.recalculateBodyPr();
            this.recalcInfo.recalculateBodyPr = false;
        }
        return this.compiledBodyPr;
    },

    onParagraphChanged: function()
    {
        if(this.shape )
            this.shape.onParagraphChanged();
    },

    getSummaryHeight: function()
    {
        return this.content.Get_SummaryHeight();
    },

    getCompiledBodyPr: function()
    {
        this.recalculateBodyPr();
        return this.compiledBodyPr;
    },

    addPhContent: function(phType)
    {},

    Get_TableStyleForPara: function()
    {
        return null;
    },

    draw: function(graphics)
    {
        if(this.content.Is_Empty() && isRealObject(this.phContent))
            this.content2.Draw(graphics);
        else
            this.content.Draw(0, graphics);
    },

    Get_Styles: function(level)
    {
        return this.shape.Get_Styles(level);
    },

    Is_Cell: function()
    {
        return false;
    },
    OnContentRecalculate: function()
    {},

    writeToBinary: function(w)
    {
        this.bodyPr.Write_ToBinary2(w);
        writeToBinaryDocContent(this.content, w);
    },


    readFromBinary: function(r,  drawingDocument)
    {
        this.bodyPr.Read_FromBinary2(r);
        readFromBinaryDocContent(this.content, r);
    },

    Undo: function(data)
    {
        switch(data.Type)
        {
            case historyitem_SetShape:
            {
                this.shape = data.oldPr;
                break;
            }

            case historyitem_SetDocContent:
            {
                this.content = data.oldPr;
                break;
            }
            case historyitem_SetLstStyle:
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
            case historyitem_SetShape:
            {
                this.shape = data.newPr;
                break;
            }

            case historyitem_SetDocContent:
            {
                this.content = data.newPr;
                break;
            }

            case historyitem_SetLstStyle:
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
            case historyitem_SetShape:
            case historyitem_SetDocContent:
            {
                w.WriteBool(isRealObject(data.newPr));
                if(isRealObject(data.newPr))
                {
                    w.WriteString2(data.newPr.Get_Id())
                }
                break;
            }

            case historyitem_SetLstStyle:
            {
                w.WriteBool(isRealObject(data.newPr));
                if(isRealObject(data.newPr))
                {
                    data.newPr.Write_ToBinary2(w);
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
                case historyitem_SetShape:
                {
                    if(r.GetBool())
                    {
                        this.shape = g_oTableId.Get_ById(r.GetString2());
                    }
                    break;
                }

                case historyitem_SetDocContent:
                {
                    if(r.GetBool())
                    {
                        this.content = g_oTableId.Get_ById(r.GetString2());
                    }
                    break;
                }
                case historyitem_SetLstStyle:
                {
                    if(r.GetBool())
                    {
                        this.lstStyle = new TextListStyle();
                        this.lstStyle.Read_FromBinary2(r);
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

    Refresh_RecalcData2: function()
    {},
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
                if(par.Lines[j].Ranges[0].W + 1> max_width)
                {
                    max_width = par.Lines[j].Ranges[0].W;
                }
            }
        }
        return max_width + r_ins + l_ins;
    },

    getRectHeight: function(maxHeight, width)
    {
        this.content.Reset(0, 0, width, 20000);
        this.content.Recalculate_Page(0, true);
        var content_height = this.getSummaryHeight();
        var t_ins = isRealNumber(this.bodyPr.tIns) ? this.bodyPr.tIns : 1.27;
        var b_ins = isRealNumber(this.bodyPr.bIns) ? this.bodyPr.bIns : 1.27;
        return content_height + t_ins + b_ins;
    }
};
