

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

function CTextBody(parent)
{
    this.editedText  = false;
    this.isInit = false;
    this.parent = parent;

    this.bodyPr = null;
    this.compiledBodyPr = new CBodyPr();
    this.lstStyle = null;
    this.Paragrs = [];

    this.content = null;
    this.content2  = null;

    this.textFieldFlag = false;

    this.fieldType = null;

    this.calculate = function()
    {
        var _history_is_on = History.Is_On();
        if(_history_is_on)
        {
            History.TurnOff();
        }
        this.calculateBodyPr();
        if(this.parent.isPlaceholder())
        {
            var text = pHText[0][this.parent.nvSpPr.nvPr.ph.type] != undefined ?  pHText[0][this.parent.nvSpPr.nvPr.ph.type] : pHText[0][phType_body];
            this.content2 = new CDocumentContent(this.parent, this.parent.Container.DrawingDocument, 0, 0, 0, 0, false, false);
            this.content2.Content.length = 0;
            var par = new Paragraph(this.parent.Container.DrawingDocument, this.content2, 0, 0, 0, 0, 0);
            var EndPos = 0;
            for(var key = 0 ; key <  text.length; ++key)
            {
                par.Internal_Content_Add( EndPos++, new ParaText(text[key]));
            }
            if(this.content && this.content.Content[0] )
            {
                if(this.content.Content[0].Pr)
                {
                    par.Pr = clone(this.content.Content[0].Pr);
                }
                if(this.content.Content[0].rPr)
                {
                    par.rPr = clone(this.content.Content[0].rPr);
                }
            }
            this.content2.Internal_Content_Add( 0, par);
        }
        if(_history_is_on)
        {
            History.TurnOn();
        }
    };


    this.calculateTransformMatrix  = function() //вызывать только после вычисления TransformMatrix в шейпе
    {
        var bottomInset, rightInset, topInset,  leftInset;
        if(this.compiledBodyPr.bIns != undefined)
        {
            bottomInset = this.compiledBodyPr.bIns;
        }
        else
        {
            bottomInset = 45720/36000;
        }

        if(this.compiledBodyPr.rIns!= undefined)
        {
            rightInset = this.compiledBodyPr.rIns;
        }
        else
        {
            rightInset = 91440/36000;
        }

        if(this.compiledBodyPr.tIns!= undefined)
        {
            topInset = this.compiledBodyPr.tIns;
        }
        else
        {
            topInset = 91440/36000;
        }

        if(this.compiledBodyPr.lIns != undefined)
        {
            leftInset = this.compiledBodyPr.lIns;
        }
        else
        {
            leftInset = 91440/36000;
        }

        var xrt, yrt, xlt, ylt, xrb, yrb;
        if(parent.geometry != undefined && parent.geometry.rect != undefined)
        {
            var rect = parent.geometry.rect;
            xlt = rect.l+leftInset;
            ylt = rect.t+topInset;

            xrb = rect.r-rightInset;
            yrb = rect.b-bottomInset;

            xrt = xrb;
            yrt = ylt;
        }
        else
        {
            xlt = leftInset;
            ylt = topInset;

            xrb = parent.ext.cx-rightInset;
            yrb = parent.ext.cy-bottomInset;

            xrt = xrb;
            yrt = ylt;
        }


        if(xlt > xrt)
        {
            xlt -= leftInset;
            xrb += rightInset;
            xrt = xrb;
        }
        if(xlt == xrt)
        {
            xlt -= 0.01;
            xrt += 0.01;
            xrb += 0.01;
        }
        if(yrt > yrb)
        {
            ylt -= topInset;
            yrb += bottomInset;
            yrt = ylt;
        }

        if(yrt == yrb)
        {
            yrt -= 0.01;
            ylt -= 0.01;
            yrb += 0.01;
        }


        var xLT, yLT, xRT, yRT, xLB, yLB, xRB, yRB, hc, vc;
        var transformShapeMatrix = this.parent.TransformMatrix;
        xLT = transformShapeMatrix.TransformPointX(xlt, ylt);
        yLT = transformShapeMatrix.TransformPointY(xlt, ylt);

        xRT = transformShapeMatrix.TransformPointX(xrt, yrt);
        yRT = transformShapeMatrix.TransformPointY(xrt, yrt);

        xRB = transformShapeMatrix.TransformPointX(xrb, yrb);
        yRB = transformShapeMatrix.TransformPointY(xrb, yrb);

        var dxT, dyT;
        dxT = xRT - xLT;
        dyT = yRT - yLT;

        var dxLTRB, dyLTRB;
        dxLTRB = xRB - xLT;
        dyLTRB = yRB - yLT;

        var textMatrix = new CMatrixL();
        if(dxLTRB*dyT - dyLTRB*dxT <= 0)
        {
            var alpha = Math.atan2(dyT, dxT);
            global_MatrixTransformer.RotateRadAppend(textMatrix, -alpha);
            global_MatrixTransformer.TranslateAppend(textMatrix, xLT, yLT);
        }
        else
        {
            alpha = Math.atan2(dyT, dxT);
            global_MatrixTransformer.RotateRadAppend(textMatrix, Math.PI-alpha);
            global_MatrixTransformer.TranslateAppend(textMatrix, xRT, yRT);
        }
        this.parent.TransformTextMatrix = textMatrix;
    };


    this.getMargins = function ()
    {
        var _parent_transform = this.parent.TransformMatrix;
        var _l = this.l + this.parent.pH;
        var _r = this.r + this.parent.pH;
        var _b = this.b + this.parent.pV;
        var _t = this.t + this.parent.pV;

        var x_lt, y_lt, x_rb, y_rb;

        x_lt = _parent_transform.TransformPointX(_l, _t);
        y_lt = _parent_transform.TransformPointY(_l, _t);

        x_rb = _parent_transform.TransformPointX(_r, _b);
        y_rb = _parent_transform.TransformPointY(_r, _b);

        var hc = (_r - _l)/2;
        var vc = (_b - _t)/2;

        var xc = (x_lt + x_rb)/2;
        var yc = (y_lt + y_rb)/2;

        var tx = xc-hc;
        var ty = yc-vc;
        return {L : xc - hc , T: yc - vc , R : xc + hc , B : yc + vc, textMatrix : this.parent.TransformTextMatrix};
    };

    this.setVerticalAlign  = function(align)
    {
        if(this.bodyPr.anchor === align || this.compiledBodyPr.anchor === align)
        {
            return;
        }
        var _history_obj  = {};
        _history_obj.oldAnchor =  this.bodyPr.anchor;
        _history_obj.newAnchor =  align;
        _history_obj.undo_function = function(data)
        {
            this.bodyPr.anchor = data.oldAnchor;
            this.calculateBodyPr();
            this.recalculate();
            this.calculateTransformMatrix();
            this.content.RecalculateCurPos();
        };
        _history_obj.redo_function = function(data)
        {
            this.bodyPr.anchor = data.newAnchor;
            this.calculateBodyPr();
            this.recalculate();
            this.calculateTransformMatrix();
            this.content.RecalculateCurPos();
        };

        History.Add(this, _history_obj);
        this.bodyPr.anchor = align;
        this.calculateBodyPr();
        this.recalculate();
        this.calculateTransformMatrix();
        this.content.RecalculateCurPos();
        return true;
    };
    this.calculateBodyPr = function()
    {
        this.compiledBodyPr.setDefault();
        if(this.parent.isPlaceholder())
        {
            var phIdx = this.parent.nvSpPr.nvPr.ph.idx, phType = this.parent.nvSpPr.nvPr.ph.type;
            switch (this.parent.parent.kind)
            {
                case SLIDE_KIND :
                {
                    var masterShape = this.parent.parent.Layout.Master.getMatchingShape(phType, phIdx);
                    if(masterShape && masterShape.txBody && masterShape.txBody.bodyPr)
                    {
                        this.compiledBodyPr.merge(masterShape.txBody.bodyPr);
                    }
                    var layoutShape = this.parent.parent.Layout.getMatchingShape(phType, phIdx);
                    if( layoutShape && layoutShape.txBody && layoutShape.txBody.bodyPr)
                    {
                        this.compiledBodyPr.merge(layoutShape.txBody.bodyPr);
                    }
                    break;
                }
                case LAYOUT_KIND :
                {
                    masterShape = this.parent.parent.Master.getMatchingShape(phType, phIdx);
                    if(masterShape && masterShape.txBody && masterShape.txBody.bodyPr)
                    {
                        this.compiledBodyPr.merge(masterShape.txBody.bodyPr);
                    }
                    break;
                }
            }
        }
        if(this.bodyPr!=null)
        {
            this.compiledBodyPr.merge(this.bodyPr);
        }
    };

    this.createDuplicate = function(shape)
    {
        var duplicate = new CTextBody(shape);
        if(this.bodyPr!=null)
        {
            duplicate.bodyPr = this.bodyPr.createDuplicate();
        }
        if(this.lstStyle!=null)
        {
            duplicate.lstStyle = this.lstStyle.createDuplicate();
        }

        if(this.content!=null)
        {
            duplicate.content = new CDocumentContent(shape, this.content.DrawingDocument, 0, 0, 0, 0, 0, 0);
            for(var i = 0, n = this.content.Content.length; i < n; ++i)
            {
                duplicate.content.Content[i] = copyParagraph(this.content.Content[i], duplicate.content)
            }
        }
        return duplicate;
    }
}

CTextBody.prototype =
{
    addToParagraph : function (paragraphItem)
    {
        if(this.content)
        {
            if(this.textFieldFlag)
            {
                this.textFieldFlag = false;
            }
            if(this.content.Is_Empty())
            {
                this.content.RecalculateNumbering();
            }

            this.content.Paragraph_Add(paragraphItem, true);
            this.parent.Document_UpdateRulersState();
        }
    },


    addParagraph : function()
    {
        this.content.Add_NewParagraph();
    },



    draw : function(graphics)
    {
        if((!this.content || this.content.Is_Empty()) && this.content2!=null && !this.parent.addTextFlag && (this.parent.isEmptyPlaceholder ? this.parent.isEmptyPlaceholder() : false))
        {
            if (graphics.IsNoDrawingEmptyPlaceholder !== true)
            {
                if(graphics.IsNoSupportTextDraw)
                {
                    var _h2 = this.b2 - this.t2;
                    var _w2 = this.r2 - this.l2;
                    graphics.rect(this.content2.X, this.content2.Y, _w2, _h2);
                }

                this.content2.Draw(0, graphics);

            }
        }
        else if(this.content)
        {
            if(graphics.IsNoSupportTextDraw)
            {
                var _h = this.b - this.t;
                var _w = this.r - this.l;
                graphics.rect(this.content.X, this.content.Y, _w, _h);
            }

            this.content.Draw(0, graphics);

        }
    },

    // Удаляем элементы параграфа
    // nCount - количество удаляемых элементов, > 0 удаляем элементы после курсора
    //                                          < 0 удаляем элементы до курсора
    // bOnlyText - true: удаляем только текст и пробелы, false - Удаляем любые элементы
    removeText : function(Count, bOnlyText, bRemoveOnlySelection)
    {
        this.content.Remove(Count, bOnlyText, bRemoveOnlySelection);
    } ,

    recalculate : function(parent)
    {
        var xLT, yLT, xRB, yRB;//противоположные углы  DocumentContent в зависимости от verticalTextOverflow
        var pV = this.parent.pV, pH = this.parent.pH;//(pH, pV) - левый веерхний угол родительской фигуры

        if(parent == undefined)
        {
            parent = this.parent;
        }
        var bottomInset, rightInset, topInset,  leftInset;
        if(this.compiledBodyPr.bIns != undefined)
        {
            bottomInset = this.compiledBodyPr.bIns;
        }
        else
        {
            bottomInset = 45720/36000;
        }

        if(this.compiledBodyPr.rIns!= undefined)
        {
            rightInset = this.compiledBodyPr.rIns;
        }
        else
        {
            rightInset = 91440/36000;
        }

        if(this.compiledBodyPr.tIns!= undefined)
        {
            topInset = this.compiledBodyPr.tIns;
        }
        else
        {
            topInset = 91440/36000;
        }

        if(this.compiledBodyPr.lIns != undefined)
        {
            leftInset = this.compiledBodyPr.lIns;
        }
        else
        {
            leftInset = 91440/36000;
        }

        if(parent.geometry != undefined
            && parent.geometry.rect != undefined)
        {
            var rect = parent.geometry.rect;
            xLT = rect.l+leftInset;
            yLT = rect.t+topInset;

            xRB = rect.r-rightInset;
            yRB = rect.b-bottomInset;
        }
        else
        {
            xLT = leftInset;
            yLT = topInset;

            xRB = parent.ext.cx-rightInset;
            yRB = parent.ext.cy-bottomInset;
        }

        var _anchor = this.compiledBodyPr.anchor;
        if(xLT > xRB)
        {
            xLT -= leftInset;
            xRB += rightInset;
        }

        if(yLT > yRB)
        {
            yLT -= topInset;
            yRB += bottomInset;
            _anchor = 1;
        }

        var heightTextBox = yRB - yLT;
        this.x = xLT;
        this.y = yLT;
        //
        this.w = xRB - xLT;
        this.h = heightTextBox;

        if(this.textFieldFlag)
        {
            if(this.parent.isPlaceholder())
            {
                var _ph_type = this.parent.nvSpPr.nvPr.ph.type;
                var _placeholder_text;
                switch (_ph_type)
                {
                    case phType_dt :
                    {
                        var _cur_date = new Date();
                        var _cur_year = _cur_date.getFullYear();
                        var _cur_month = _cur_date.getMonth();
                        var _cur_month_day = _cur_date.getDate();
                        var _cur_week_day = _cur_date.getDay();
                        var _cur_hour = _cur_date.getHours();
                        var _cur_minute = _cur_date.getMinutes();
                        var _cur_second = _cur_date.getSeconds();
                        var _text_string = "";
                        switch (this.fieldType)
                        {
                            /*case "datetime1":{break;}
                             case "datetime2":{break;}
                             case "datetime3":{break;}
                             case "datetime4":{break;}
                             case "datetime5":{break;}
                             case "datetime6":{break;}
                             case "datetime7":{break;}
                             case "datetime8":{break;}
                             case "datetime9":{break;}
                             case "datetime10":{break;}
                             case "datetime11":{break;}
                             case "datetime12":{break;}
                             case "datetime13":{break;}  */
                            default :
                            {
                                _text_string += (_cur_month_day > 9 ? _cur_month_day : "0" + _cur_month_day)
                                    +  "." +   ((_cur_month +1) > 9 ? (_cur_month + 1) : "0" + (_cur_month +1))
                                    + "." + _cur_year;
                                break;
                            }
                        }
                        this.content.Content = [];
                        var par = new Paragraph(this.parent.Container.DrawingDocument, this.content, 0, 0, 0, 0, 0);
                        var EndPos = par.Internal_GetEndPos();

                        var _history_status = History.Is_On();

                        if(_history_status)
                        {
                            History.TurnOff();
                        }

                        for(var _text_index = 0; _text_index < _text_string.length; ++_text_index)
                        {
                            if(_text_string[_text_index] != " ")
                            {
                                par.Internal_Content_Add(EndPos, new ParaText(_text_string[_text_index]));
                            }
                            else
                            {
                                par.Internal_Content_Add(EndPos, new ParaSpace(1));
                            }
                            ++EndPos;
                        }
                        this.content.Internal_Content_Add(0, par);

                        if(_history_status)
                        {
                            History.TurnOn();
                        }
                        break;
                    }
                    case phType_sldNum :
                    {
                        if(this.parent.parent.kind == SLIDE_KIND)
                        {
                            _text_string = "" + (this.parent.parent.num+1);
                            this.content.Content = [];
                            par = new Paragraph(this.parent.Container.DrawingDocument, this.content, 0, 0, 0, 0, 0);
                            EndPos = par.Internal_GetEndPos();

                            _history_status = History.Is_On();

                            if(_history_status)
                            {
                                History.TurnOff();
                            }

                            for(_text_index = 0; _text_index < _text_string.length; ++_text_index)
                            {
                                if(_text_string[_text_index] != " ")
                                {
                                    par.Internal_Content_Add(EndPos, new ParaText(_text_string[_text_index]));
                                }
                                else
                                {
                                    par.Internal_Content_Add(EndPos, new ParaSpace(1));
                                }
                                ++EndPos;
                            }
                            this.content.Internal_Content_Add(0, par);

                            if(_history_status)
                            {
                                History.TurnOn();
                            }
                        }
                        break;
                    }
                }
            }
        }
        //пересчитаем контент при текущей ширине
        this.content.Reset(0, 0, this.w, 20000);//TODO: убрать 20000 после реализации свойства split в документ контенте
        this.content.Recalculate();

        var DCHeight=0; //высота текста
        for(var i = 0, n = this.content.Get_PagesCount();  i<n; ++i)
        {
            var bounds = this.content.Get_PageBounds(i);
            DCHeight += bounds.Bottom-bounds.Top;
        }
        if(this.content2 != null)
        {
            this.content2.Reset(0, 0, this.w, 20000);//TODO: убрать 20000 после реализации свойства split в документ контенте
            this.content2.Recalculate();
            var DCHeight2=0;
            for(i = 0, n = this.content2.Get_PagesCount();  i<n; ++i)
            {
                bounds = this.content2.Get_PageBounds(i);
                DCHeight2 += bounds.Bottom-bounds.Top;
            }
        }
        switch(this.compiledBodyPr.vertOverflow)
        {
            case nOTClip:
            {
                break;
            }
            case nOTEllipsis:
            {
                break;
            }
            default:
            {
                switch (_anchor)
                {
                    case 0 ://b
                    { // (Text Anchor Enum ( Bottom ))
                        var dH = heightTextBox - DCHeight;
                        this.content.Reset(0, dH, this.w, 20000);//TODO: убрать 20000 после реализации свойства split в документ контенте
                        this.content.Recalculate();
                        this.l = xLT - pH;
                        this.t = yLT + dH - pV;
                        this.r = xRB - pH;
                        this.b = yRB - pV;
                        if(this.content2!=null)
                        {
                            dH = heightTextBox - DCHeight2;
                            this.content2.Reset(0, dH, this.w, 20000);//TODO: убрать 20000 после реализации свойства split в документ контенте
                            this.content2.Recalculate();
                            this.l2 = xLT - pH;
                            this.t2 = yLT + dH - pV;
                            this.r2 = xRB - pH;
                            this.b2 = yRB - pV;
                        }
                        break;
                    }
                    case 1 :    //ctr
                    {// (Text Anchor Enum ( Center ))
                        dH = (heightTextBox - DCHeight)*0.5;

                        this.content.Reset(0, dH, this.w, 20000);//TODO: убрать 20000 после реализации свойства split в документ контенте
                        this.content.Recalculate();

                        this.l = xLT - pH;
                        this.t = yLT + dH - pV;
                        this.r = xRB - pH;
                        this.b = yRB - dH - pV;
                        if(this.content2 != null)
                        {
                            dH = (heightTextBox - DCHeight2)*0.5;

                            this.content2.Reset(0, dH, this.w, 20000);//TODO: убрать 20000 после реализации свойства split в документ контенте
                            this.content2.Recalculate();

                            this.l2 = xLT - pH;
                            this.t2 = yLT + dH - pV;
                            this.r2 = xRB - pH;
                            this.b2 = yRB - dH - pV;
                        }
                        break;
                    }
                    case  2 : //dist
                    {// (Text Anchor Enum ( Distributed )) TODO: пока выравнивание  по центру. Переделать!
                        dH = (heightTextBox - DCHeight)*0.5;
                        this.content.Reset(0, dH, this.w, 20000);//TODO: убрать 20000 после реализации свойства split в документ контенте
                        this.content.Recalculate();
                        if(this.content2 != null)
                        {
                            dH = (heightTextBox - DCHeight2)*0.5;
                            this.content2.Reset(0, dH, this.w, 20000);//TODO: убрать 20000 после реализации свойства split в документ контенте
                            this.content2.Recalculate();
                        }
                        break;
                    }
                    case  3 ://just
                    {// (Text Anchor Enum ( Justified )) TODO: пока выравнивание  по центру. Переделать!
                        dH = (heightTextBox - DCHeight)*0.5;
                        this.content.Reset(0, dH, this.w, 20000);//TODO: убрать 20000 после реализации свойства split в документ контенте
                        this.content.Recalculate();
                        if(this.content2 != null)
                        {
                            dH = (heightTextBox - DCHeight2)*0.5;
                            this.content2.Reset(0, dH, this.w, 20000);//TODO: убрать 20000 после реализации свойства split в документ контенте
                            this.content2.Recalculate();
                        }
                        break;
                    }
                    case 4 ://t
                    {//Top
                        this.content.Reset(0, 0, this.w, 20000); //TODO: убрать 20000 после реализации свойства split в документ контенте
                        this.content.Recalculate();

                        dH = heightTextBox - DCHeight;
                        this.l = xLT - pH;
                        this.t = yLT - pV;
                        this.r = xRB - pH;
                        this.b = yRB - dH - pV;
                        if(this.content2 != null)
                        {
                            this.content2.Reset(0, 0, this.w, 20000); //TODO: убрать 20000 после реализации свойства split в документ контенте
                            this.content2.Recalculate();

                            dH = heightTextBox - DCHeight2;
                            this.l2 = xLT - pH;
                            this.t2 = yLT - pV;
                            this.r2 = xRB - pH;
                            this.b2 = yRB - dH - pV;
                        }
                        break;
                    }
                    default:
                    {
                        this.content.Reset(0, 0, this.w, 20000); //TODO: убрать 20000 после реализации свойства split в документ контенте
                        this.content.Recalculate();

                        dH = heightTextBox - DCHeight;
                        this.l = xLT - pH;
                        this.t = yLT - pV;
                        this.r = xRB - pH;
                        this.b = yRB - dH - pV;
                        if(this.content2 != null)
                        {
                            this.content2.Reset(0, 0, this.w, 20000); //TODO: убрать 20000 после реализации свойства split в документ контенте
                            this.content2.Recalculate();

                            dH = heightTextBox - DCHeight2;
                            this.l2 = xLT - pH;
                            this.t2 = yLT - pV;
                            this.r2 = xRB - pH;
                            this.b2 = yRB - dH - pV;
                        }
                        break;
                    }
                }
                break;
            }
        }
        // this.parent.Document_UpdateRulersState();
    },

    recalculate2 : function(parent)
    {
        var xLT, yLT, xRB, yRB;//противоположные углы  DocumentContent в зависимости от verticalTextOverflow
        var pV = this.parent.pV, pH = this.parent.pH;//(pH, pV) - левый веерхний угол родительской фигуры

        if(parent == undefined)
        {
            parent = this.parent;
        }
        var bottomInset, rightInset, topInset,  leftInset;
        if(this.compiledBodyPr.bIns != undefined)
        {
            bottomInset = this.compiledBodyPr.bIns;
        }
        else
        {
            bottomInset = 45720/36000;
        }

        if(this.compiledBodyPr.rIns!= undefined)
        {
            rightInset = this.compiledBodyPr.rIns;
        }
        else
        {
            rightInset = 91440/36000;
        }

        if(this.compiledBodyPr.tIns!= undefined)
        {
            topInset = this.compiledBodyPr.tIns;
        }
        else
        {
            topInset = 91440/36000;
        }

        if(this.compiledBodyPr.lIns != undefined)
        {
            leftInset = this.compiledBodyPr.lIns;
        }
        else
        {
            leftInset = 91440/36000;
        }

        if(parent.geometry != undefined
            && parent.geometry.rect != undefined)
        {
            var rect = parent.geometry.rect;
            xLT = rect.l+leftInset;
            yLT = rect.t+topInset;

            xRB = rect.r-rightInset;
            yRB = rect.b-bottomInset;
        }
        else
        {
            xLT = leftInset;
            yLT = topInset;

            xRB = parent.ext.cx-rightInset;
            yRB = parent.ext.cy-bottomInset;
        }

        var _anchor = this.compiledBodyPr.anchor;
        if(xLT > xRB)
        {
            xLT -= leftInset;
            xRB += rightInset;
        }

        if(yLT > yRB)
        {
            yLT -= topInset;
            yRB += bottomInset;
            _anchor = 1;
        }

        var heightTextBox = yRB - yLT;
        this.x = xLT;
        this.y = yLT;
        //
        this.w = xRB - xLT;
        this.h = heightTextBox;

        this.content.Reset(0, 0, this.w, 20000);//TODO: убрать 20000 после реализации свойства split в документ контенте
        this.content.Recalculate();

        var DCHeight=0; //высота текста
        for(var i = 0, n = this.content.Get_PagesCount();  i<n; ++i)
        {
            var bounds = this.content.Get_PageBounds(i);
            DCHeight += bounds.Bottom-bounds.Top;
        }
        switch(this.compiledBodyPr.vertOverflow)
        {
            case nOTClip:
            {
                break;
            }
            case nOTEllipsis:
            {
                break;
            }
            default:
            {
                switch (_anchor)
                {
                    case 0 ://b
                    { // (Text Anchor Enum ( Bottom ))
                        var dH = heightTextBox - DCHeight;
                        this.content.Reset(0, dH, this.w, 20000);//TODO: убрать 20000 после реализации свойства split в документ контенте
                        this.content.Recalculate();
                        this.l = xLT - pH;
                        this.t = yLT + dH - pV;
                        this.r = xRB - pH;
                        this.b = yRB - pV;
                        break;
                    }
                    case 1 :    //ctr
                    {// (Text Anchor Enum ( Center ))
                        dH = (heightTextBox - DCHeight)*0.5;

                        this.content.Reset(0, dH, this.w, 20000);//TODO: убрать 20000 после реализации свойства split в документ контенте
                        this.content.Recalculate();

                        this.l = xLT - pH;
                        this.t = yLT + dH - pV;
                        this.r = xRB - pH;
                        this.b = yRB - dH - pV;
                        break;
                    }
                    case  2 : //dist
                    {// (Text Anchor Enum ( Distributed )) TODO: пока выравнивание  по центру. Переделать!
                        dH = (heightTextBox - DCHeight)*0.5;
                        this.content.Reset(0, dH, this.w, 20000);//TODO: убрать 20000 после реализации свойства split в документ контенте
                        this.content.Recalculate();
                        break;
                    }
                    case  3 ://just
                    {// (Text Anchor Enum ( Justified )) TODO: пока выравнивание  по центру. Переделать!
                        dH = (heightTextBox - DCHeight)*0.5;
                        this.content.Reset(0, dH, this.w, 20000);//TODO: убрать 20000 после реализации свойства split в документ контенте
                        this.content.Recalculate();

                        break;
                    }
                    case 4 ://t
                    {//Top
                        this.content.Reset(0, 0, this.w, 20000); //TODO: убрать 20000 после реализации свойства split в документ контенте
                        this.content.Recalculate();

                        dH = heightTextBox - DCHeight;
                        this.l = xLT - pH;
                        this.t = yLT - pV;
                        this.r = xRB - pH;
                        this.b = yRB - dH - pV;
                        break;
                    }
                    default:
                    {
                        this.content.Reset(0, 0, this.w, 20000); //TODO: убрать 20000 после реализации свойства split в документ контенте
                        this.content.Recalculate();

                        dH = heightTextBox - DCHeight;
                        this.l = xLT - pH;
                        this.t = yLT - pV;
                        this.r = xRB - pH;
                        this.b = yRB - dH - pV;
                        break;
                    }
                }
                break;
            }
        }
        // this.parent.Document_UpdateRulersState();
    },


    getBounds : function()
    {
        if(this.parent.TransformTextMatrix)
        {
            var  xlt, ylt, xrb, yrb, xrt, yrt, xlb, ylb;
            xlt = this.parent.TransformTextMatrix.TransformPointX(this.l, this.t);
            ylt = this.parent.TransformTextMatrix.TransformPointY(this.l, this.t);

            xrb = this.parent.TransformTextMatrix.TransformPointX(this.r, this.b);
            yrb = this.parent.TransformTextMatrix.TransformPointY(this.r, this.b);

            xrt = this.parent.TransformTextMatrix.TransformPointX(this.r, this.t);
            yrt = this.parent.TransformTextMatrix.TransformPointY(this.r, this.t);

            xlb = this.parent.TransformTextMatrix.TransformPointX(this.l, this.b);
            ylb = this.parent.TransformTextMatrix.TransformPointY(this.l, this.b);
            return {l: Math.min(xlt, xrb,  xrt,  xlb, ylb), t:Math.min(ylt,  yrb,  yrt, ylb), r:Math.max(xlt, xrb,  xrt,  xlb, ylb), b: Math.max(ylt,  yrb,  yrt, ylb)};
        }
    },

    recalculateCurPos : function()
    {
        this.content.RecalculateCurPos();
    },

    init : function(parentShape)
    {
        if( parentShape.parent.type == TYPE_SLIDE )
        {
            var layout = parentShape.parent.slideLayout;
            var isPlaceholder = parentShape.isPlaceholder();
            var matchingLayoutShape = null;
            var matchingTextBody = null;
            if(isPlaceholder)
            {
                if(layout != undefined)
                {
                    var placeholderType = parentShape.nvSpPr.nvPr.ph.type;
                    var placeholderIdx = parentShape.nvSpPr.nvPr.ph.idx;
                    matchingLayoutShape = layout.getMatchingShape(placeholderType, placeholderIdx);
                    if(matchingLayoutShape != null)
                    {
                        matchingTextBody = matchingLayoutShape.txBody;
                    }
                }
            }

            if(this.content == null)
            {
                var bodyProperties;
                var textStyles;
                if(this.compiledBodyPr == null)
                {
                    if(matchingTextBody != null && matchingTextBody.bodyPr != null)
                    {
                        bodyProperties = matchingTextBody.bodyPr;
                    }
                    else
                    {
                        bodyProperties = new CBodyProperties();
                        bodyProperties.setDefault();
                    }
                }
                else
                {
                    bodyProperties = this.compiledBodyPr;
                }
                if(this.lstStyle == null)
                {
                    if(matchingTextBody && matchingTextBody.lstStyle != null)
                    {
                        textStyles = matchingTextBody.lstStyle;
                    }
                    else
                    {
                        var slideMaster = layout.slideMaster;
                        if(slideMaster && slideMaster.textStyles)
                        {
                            if(isPlaceholder)
                            {
                                switch(parentShape.nvSpPr.nvPr.ph.type)
                                {
                                    case "ctrTitle":
                                    case "title":
                                    {
                                        if(slideMaster.textStyles.titleStyle != undefined)
                                        {
                                            textStyles = slideMaster.textStyles.titleStyle;
                                        }
                                        else
                                        {
                                            textStyles = new CTextStyle();
                                            textStyles.setDefault();
                                        }
                                        break;
                                    }
                                    case "body":
                                    {
                                        if(slideMaster.textStyles.bodyStyle != undefined)
                                        {
                                            textStyles = slideMaster.textStyles.bodyStyle;
                                        }
                                        else
                                        {
                                            textStyles = new CTextStyle();
                                            textStyles.setDefault();
                                        }
                                        break;
                                    }
                                    default :
                                    {
                                        if(slideMaster.textStyles.otherStyle != undefined)
                                        {
                                            textStyles = slideMaster.textStyles.otherStyle;
                                        }
                                        else
                                        {
                                            textStyles = new CTextStyle();
                                            textStyles.setDefault();
                                        }
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
                else
                {

                }
                var xLT, yLT, xRB, yRB;//противоположные углы  DocumentContent в зависимости от verticalTextOverflow
                var pV = parentShape.pV, pH = parentShape.pH;//(pH, pV) - левый веерхний угол родительской фигуры


                var bottomInset, rightInset, topInset,  leftInset;
                if(bodyProperties.bIns != undefined)
                {
                    bottomInset = bodyProperties.bIns;
                }
                else
                {
                    bottomInset = 45720/36000;
                }

                if(bodyProperties.rIns!= undefined)
                {
                    rightInset = bodyProperties.rIns;
                }
                else
                {
                    rightInset = 91440/36000;
                }


                if(bodyProperties.tIns!= undefined)
                {
                    topInset = bodyProperties.tIns;
                }
                else
                {
                    topInset = 91440/36000;
                }

                if(bodyProperties.lIns != undefined)
                {
                    leftInset = bodyProperties.lIns;
                }
                else
                {
                    leftInset = 91440/36000;
                }

                if(parentShape.geometry != undefined
                    && parentShape.geometry.rect != undefined)
                {
                    var rect = parentShape.geometry.rect;
                    xLT = pH + rect.l + leftInset;
                    yLT = pV + rect.t + topInset;

                    xRB = pH + rect.r - rightInset;
                    yRB = pV + rect.b - bottomInset;
                }
                else
                {
                    xLT = pH+leftInset;
                    yLT = pV+topInset;

                    xRB = pH+parentShape.ext.cx-rightInset;
                    yRB = pV+parentShape.ext.cy-bottomInset;
                }

                this.content = new CDocumentContent(parentShape, parentShape.parent.Parent.DrawingDocument, xLT, yLT, xRB, yRB, false, false);
                this.content.Reset(xLT, yLT, xRB, yRB);
                this.content.Recalculate();

                if(textStyles != null)
                {
                    this.content.ApplyToAll = true;
                    var textStyle;
                    if(textStyles.defPPr != undefined)
                    {
                        textStyle = textStyles.defPPr;
                    }
                    else if(textStyles.lvl1pPr != undefined)
                    {
                        textStyle = textStyles.lvl1pPr;
                    }
                    else if(textStyles.lvl2pPr != undefined)
                    {
                        textStyle = textStyles.lvl2pPr;
                    }
                    else if(textStyles.lvl3pPr != undefined)
                    {
                        textStyle = textStyles.lvl3pPr;
                    }
                    else if(textStyles.lvl4pPr != undefined)
                    {
                        textStyle = textStyles.lvl4pPr;
                    }
                    else if(textStyles.lvl5pPr != undefined)
                    {
                        textStyle = textStyles.lvl5pPr;
                    }
                    else if(textStyles.lvl6pPr != undefined)
                    {
                        textStyle = textStyles.lvl6pPr;
                    }
                    else if(textStyles.lvl7pPr != undefined)
                    {
                        textStyle = textStyles.lvl7pPr;
                    }
                    else if(textStyles.lvl8pPr != undefined)
                    {
                        textStyle = textStyles.lvl8pPr;
                    }
                    else if(textStyles.lvl9pPr != undefined)
                    {
                        textStyle = textStyles.lvl9pPr;
                    }

                    var textProperties = {Type : para_TextPr, Value :{}};

                    if(textStyle.defaultTextRunProperties != undefined)
                    {
                        if(textStyle.defaultTextRunProperties.font != undefined)
                        {
                            textProperties.Value.FontFamily = {Name: textStyle.defaultTextRunProperties.font, Index : -1}
                        }
                        else
                        {
                            if(layout.slideMaster.theme != undefined)
                            {
                                /* if(layout.slideMaster.theme.themeElements != undefined
                                 && layout.slideMaster.theme.themeElements.fontScheme !=undefined
                                 && layout.slideMaster.theme.themeElements.fontScheme.majorFont) */
                            }
                            //  textProperties.Value.FontFamily
                        }

                        if(textStyle.defaultTextRunProperties.fontSize != undefined)
                        {
                            textProperties.Value.FontSize = textStyle.defaultTextRunProperties.fontSize;
                        }

                        if(textStyle.defaultTextRunProperties.bold != undefined)
                        {
                            textProperties.Value.Bold = textStyle.defaultTextRunProperties.bold;
                        }
                        if(textStyle.defaultTextRunProperties.italic)
                        {
                            textProperties.Value.Italic = textStyle.defaultTextRunProperties.italic;
                        }
                    }
                    this.content.Paragraph_Add(textProperties);
                    this.content.ApplyToAll = false;
                }
            }
        }
        this.isInit = true;
    },

    clone : function()
    {

    },


    createFullCopy : function(parent)
    {
        var _history_is_on = History.Is_On();
        if(_history_is_on)
        {
            History.TurnOff();
        }
        var _copy = new CTextBody(parent);
        _copy.textFieldFlag = this.textFieldFlag;
        if(this.lstStyle != null)
        {
            _copy.lstStyle = new TextListStyle();
            for(var _index_style_level = 0; _index_style_level < 9; ++_index_style_level)
            {
                if(this.lstStyle.levels[_index_style_level]!=null)
                {
                    _copy.lstStyle.levels[_index_style_level] = this.lstStyle.levels[_index_style_level].createDuplicate();
                }
            }
        }
        if(this.bodyPr)
        {
            _copy.bodyPr = this.bodyPr.createDuplicate();
        }
        _copy.compiledBodyPr = this.compiledBodyPr.createDuplicate();
        _copy.content = new CDocumentContent(parent, parent.Container.DrawingDocument, 0, 0, 0, 0, false, false);
        var _par_index;
        _copy.content.Content.length = 0;
        for(_par_index = 0; _par_index < this.content.Content.length; ++_par_index)
        {
            _copy.content.Internal_Content_Add(_par_index, this.content.Content[_par_index].createCopy(_copy.content));
        }
        if(this.content2)
        {
            _copy.content2 = new CDocumentContent(parent, parent.Container.DrawingDocument, 0, 0, 0, 0, false, false);
            _copy.content2.Content.length = 0;
            for(_par_index = 0; _par_index < this.content2.Content.length; ++_par_index)
            {
                _copy.content2.Internal_Content_Add(_par_index, this.content2.Content[_par_index].createCopy(_copy.content2));
            }
        }
        if(_history_is_on)
        {
            History.TurnOn();
        }
        return _copy;
    },

    createCopy : function(parent, _font_flag)
    {
        var _history_is_on = History.Is_On();
        if(_history_is_on)
        {
            History.TurnOff();
        }
        var _copy_tx_body = new CTextBody(parent);
        parent.txBody = _copy_tx_body;
        _copy_tx_body.textFieldFlag = this.textFieldFlag;
        if(this.parent.isPlaceholder())
        {
            _copy_tx_body.lstStyle = new TextListStyle();
            for(var _index_style_level = 0; _index_style_level < 9; ++_index_style_level)
            {
                var _level_styles = this.content.Get_Styles(_index_style_level);
                var _level_compiled_style = _level_styles.Get_Pr(_level_styles.Style.length-1, styles_Paragraph);
                if(_level_compiled_style.TextPr && _level_compiled_style.TextPr.FontFamily && _level_compiled_style.TextPr.FontFamily.themeFont != undefined && !(_font_flag === true))
                {
                    _level_compiled_style.TextPr.FontFamily.Name = _level_compiled_style.TextPr.FontFamily.themeFont;
                }
                if(_font_flag)
                {
                    if(isThemeFont(_level_compiled_style.TextPr.FontFamily.Name))
                    {
                        var _theme;
                        switch (this.parent.parent.kind)
                        {
                            case SLIDE_KIND:
                            {
                                _theme = this.parent.parent.Layout.Master.Theme;
                                break;
                            }
                            case LAYOUT_KIND :
                            {
                                _theme = this.parent.parent.Master.Theme;
                                break;
                            }
                            case MASTER_KIND:
                            {
                                _theme = this.parent.parent.Theme;
                                break;
                            }
                        }
                        if(_theme != undefined && _theme.themeElements.fontScheme != undefined)
                        {
                            _level_compiled_style.TextPr.FontFamily.Name = getFontInfo(_level_compiled_style.TextPr.FontFamily.Name)(_theme.themeElements.fontScheme);
                        }
                    }
                }
                _copy_tx_body.lstStyle.levels[_index_style_level] = new CTextParagraphPr();
                _copy_tx_body.lstStyle.levels[_index_style_level].pPr = clone(_level_compiled_style.ParaPr);
                _copy_tx_body.lstStyle.levels[_index_style_level].rPr = clone(_level_compiled_style.TextPr);
            }
        }
        else
        {
            if(this.lstStyle != null)
            {
                _copy_tx_body.lstStyle = new TextListStyle();
                for(_index_style_level = 0; _index_style_level < 9; ++_index_style_level)
                {
                    if(this.lstStyle.levels[_index_style_level]!=null)
                    {
                        _copy_tx_body.lstStyle.levels[_index_style_level] = this.lstStyle.levels[_index_style_level].createDuplicate();
                        if(_font_flag)
                        {
                            var _cur_level = _copy_tx_body.lstStyle.levels[_index_style_level];
                            if(_cur_level.rPr && _cur_level.rPr.FontFamily)
                            {
                                if(isThemeFont(_cur_level.rPr.FontFamily.Name))
                                {
                                    switch (this.parent.parent.kind)
                                    {
                                        case SLIDE_KIND:
                                        {
                                            _theme = this.parent.parent.Layout.Master.Theme;
                                            break;
                                        }
                                        case LAYOUT_KIND :
                                        {
                                            _theme = this.parent.parent.Master.Theme;
                                            break;
                                        }
                                        case MASTER_KIND:
                                        {
                                            _theme = this.parent.parent.Theme;
                                            break;
                                        }
                                    }
                                    if(_theme != undefined && _theme.themeElements.fontScheme != undefined)
                                    {
                                        _cur_level.rPr.FontFamily.Name = getFontInfo(_cur_level.rPr.FontFamily.Name)(_theme.themeElements.fontScheme);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        _copy_tx_body.bodyPr = this.compiledBodyPr.createDuplicate();
        _copy_tx_body.content = new CDocumentContent(parent, parent.Container.DrawingDocument, 0, 0, 0, 0, false, false);
        _copy_tx_body.content.Content.length = 0;
        var _par_index;
        for(_par_index = 0; _par_index < this.content.Content.length; ++_par_index)
        {
            _copy_tx_body.content.Internal_Content_Add(_par_index, this.content.Content[_par_index].createCopy(_copy_tx_body.content));
            if(this.content.Content[_par_index].compiledBullet !== null)
            {
                _copy_tx_body.content.Content[_par_index].bullet = this.content.Content[_par_index].compiledBullet;
            }
        }
        if(_history_is_on)
        {
            History.TurnOn();
        }
        return _copy_tx_body;
    },

    Set_ParagraphIndent : function(ind)
    {
        if(this.content)
        {
            this.content.Set_ParagraphIndent(ind);
        }


    },



    Get_Paragraph_ParaPr : function()
    {
        if(this.content)
        {
            return this.content.Get_Paragraph_ParaPr();
        }
        else
            return null;
    },

    Get_Paragraph_TextPr : function()
    {
        if(this.content)
        {
            return  this.content.Get_Paragraph_TextPr();
        }
        else return null;
    },

    Set_ParagraphAlign : function(align)
    {
        if(this.content)
        {
            this.content.Set_ParagraphAlign(align);
        }
    },
    Paragraph_IncDecFontSize: function(bIncrease)
    {
        if(this.content)
        {
            this.content.Paragraph_IncDecFontSize(bIncrease)
        }
    },

    Set_ParagraphShd : function(shd)
    {
        if(this.content)
        {
            this.content.Set_ParagraphShd(shd);
        }
    },

    updateTextStyles :  function() {
        var i, n;

        if(this.parent.isPlaceholder)
        {
            var slideLayout = this.parent.slide.slideLayout;
            if(slideLayout == undefined)
                return;

            var parentShape = this.parent;
            var slideLayoutShapeTree = slideLayout.commonSlideData.shapeTree;
            for(i=0, n=slideLayoutShapeTree.length; i<n; ++i)
            {
                if(slideLayoutShapeTree[i].isPlaceholder)
                {
                    if(parentShape.idx == slideLayoutShapeTree[i].idx
                        && parentShape.placeholderType == slideLayoutShapeTree[i].placeholderType)
                    {
                        if(slideLayoutShapeTree[i].textBody
                            && slideLayoutShapeTree[i].textBody.textListStyles)
                        {
                            this.textListStyles = clone(slideLayoutShapeTree[i].textBody.textListStyles);
                            this.applyTextStyles();
                            return;
                        }
                    }
                }
            }

            var slideMaster = slideLayout.slideMaster;
            if(slideMaster.textStyles != undefined)
            {
                switch (parentShape.placeholderType)
                {
                    case "title":
                    case "ctrTytle":
                    {
                        if(slideMaster.textStyles.titleStyle !=undefined)
                        {
                            this.textListStyles = clone(slideMaster.textStyles.titleStyle)
                        }
                        break;
                    }
                    case "body":
                    {
                        if(slideMaster.textStyles.bodyStyle !=undefined)
                        {
                            this.textStylesList = clone(slideMaster.textStyles.bodyStyle);
                        }
                        break;
                    }

                    default :
                    {
                        if(slideMaster.textStyles.otherStyle != undefined)
                        {
                            this.textListStyles = clone(slideMaster.textStyles.otherStyle)
                        }
                        break;
                    }


                }
            }

        }
    },

    getSearchResults : function(str)
    {
        return this.content != null ? this.content.getSearchResults(str) : [];
    },

    calculateText : function(Theme, slide, Layout, Master, fontRef)
    {
        var _history_is_on = History.Is_On();
        if(_history_is_on)
        {
            History.TurnOff();
        }
        if(this.content)
        {
            for(var i = 0; i < this.content.Content.length; ++i)
            {
                this.content.Content[i].calculateTextTheme(Theme, slide, Layout, Master, fontRef);
                this.content.Content[i].RecalcInfo.Set_Type_0(pararecalc_0_All);
            }
            this.content.RecalculateNumbering();
            // this.content.Recalculate();
        }
        if(this.content2 && this.content2.Content[0])
        {
            if(this.content && this.content.Content[0] )
            {
                if(this.content.Content[0].Pr)
                {
                    this.content2.Content[0].Pr = this.content.Content[0].Pr.Copy();
                }
                if(this.content.Content[0].rPr)
                {
                    this.content2.Content[0].rPr = clone(this.content.Content[0].rPr);
                }
                if(this.content.Content[0].bullet)
                {
                    this.content2.Content[0].bullet = this.content.Content[0].bullet.createDuplicate();
                }
            }
            if(this.content && this.content.Content[0])
            {
                var par0 = this.content.Content[0];
                for(i = 0; i< par0.Content.length; ++i)
                {
                    if(par0.Content[i].Type == para_TextPr)
                    {
                        var parTPr = par0.Content[i].createDuplicate();
                        this.content2.Content[0].Internal_Content_Add(0, parTPr);
                        break;
                    }
                }
            }


            for(i = 0; i < this.content2.Content.length; ++i)
            {
                this.content2.Content[i].CompiledPr.NeedRecalc = true;
                this.content2.Content[i].RecalcInfo.Set_Type_0(pararecalc_0_All);
            }
            //this.content2.Recalculate();
            for(i = 0; i < this.content2.Content.length; ++i)
            {
                this.content2.Content[i].calculateTextTheme(Theme, slide, Layout, Master, fontRef);
            }
            this.content2.RecalculateNumbering();
            // this.content2.Recalculate();
        }
        if(_history_is_on)
        {
            History.TurnOn();
        }
    },

    calculateText2 : function(Theme, slide, Layout, Master, fontRef)
    {
        var _history_is_on = History.Is_On();
        if(_history_is_on)
        {
            History.TurnOff();
        }
        if(this.content)
        {
            for(var i = 0; i < this.content.Content.length; ++i)
            {

                this.content.Content[i].calculateTextTheme2(Theme, slide, Layout, Master, fontRef);
            }
        }
        if(this.content2 && this.content2.Content[0] )
        {
            if(this.content && this.content.Content[0] )
            {
                if(this.content.Content[0].Pr)
                {
                    this.content2.Content[0].Pr = clone(this.content.Content[0].Pr);
                }
                if(this.content.Content[0].rPr)
                {
                    this.content2.Content[0].rPr = clone(this.content.Content[0].rPr);
                }
                if(this.content.Content[0].bullet)
                {
                    this.content2.Content[0].bullet = clone(this.content.Content[0].bullet);
                }
            }
            if(this.content && this.content.Content[0])
            {
                var par0 = this.content.Content[0];
                for(i = 0; i< par0.Content.length; ++i)
                {
                    if(par0.Content[i].Type == para_TextPr)
                    {
                        var parTPr = par0.Content[i].createDuplicate();
                        this.content2.Content[0].Internal_Content_Add(0, parTPr);
                        break;
                    }
                }
            }
            for(i = 0; i < this.content2.Content.length; ++i)
            {
                this.content2.Content[i].calculateTextTheme2(Theme, slide, Layout, Master, fontRef);
            }
        }
        if(_history_is_on)
        {
            History.TurnOn();
        }
    },


    calculateText3 : function(par, Theme, slide, Layout, Master, fontRef)
    {
        par.calculateTextTheme2(Theme, slide, Layout, Master, fontRef);
    },

    Undo : function(data)
    {
        data.undo_function.call(this, data);
    },

    Redo : function(data)
    {
        data.redo_function.call(this, data);
    },

    Save_Changes : function()
    {}
};