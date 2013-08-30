/**
 * Created with JetBrains WebStorm.
 * User: Sergey.Luzyanin
 * Date: 7/4/13
 * Time: 5:25 PM
 * To change this template use File | Settings | File Templates.
 */




function CTableId()
{
    this.m_aPairs   = new Object();
    this.m_bTurnOff = false;


    this.Id = g_oIdCounter.Get_NewId();
    this.Add(this, this.Id);
}


CTableId.prototype =
{
    getObjectType: function()
    {
        return CLASS_TYPE_TABLE_ID;
    },

    Add: function(Class, Id, sheetId)
    {
        if ( false === this.m_bTurnOff )
        {
            Class.Id = Id;
            this.m_aPairs[Id] = Class;
            if(Class !== this && History instanceof CHistory)
                History.Add(g_oUndoRedoGraphicObjects, historyitem_TableId_Add, null, null, new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoData_GTableIdAdd(Class, Id)));
        }
    },

//this.Add(this);

    // Получаем указатель на класс по Id
    Get_ById: function(Id)
    {
        if ( "undefined" != typeof(this.m_aPairs[Id]) )
            return this.m_aPairs[Id];

        return null;
    },

    // Получаем Id, по классу (вообще, данную функцию лучше не использовать)
    Get_ByClass: function(Class)
    {
        if ( "undefined" != typeof( Class.Get_Id ) )
            return Class.Get_Id();

        if ( "undefined" != typeof( Class.GetId() ) )
            return Class.GetId();

        return null;
    },

    Reset_Id: function(Class, Id_new, Id_old)
    {
        if ( Class === this.m_aPairs[Id_old] )
        {
            delete this.m_aPairs[Id_old];
            this.m_aPairs[Id_new] = Class;

            History.Add( this, { Type : historyitem_TableId_Reset, Id_new : Id_new, Id_old : Id_old  } );
        }
        else
        {
            this.Add( Class, Id_new );
        }
    },

    Get_Id: function()
    {
        return this.Id;
    },
//-----------------------------------------------------------------------------------
// Функции для работы с Undo/Redo
//-----------------------------------------------------------------------------------
    Undo: function(Data)
    {
        // Ничего не делаем (можно удалять/добавлять ссылки на классы в данном классе
        // но это не обяательно, т.к. Id всегда уникальные)
    },

    Redo: function(type, data)
    {
        switch(type)
        {
            case historyitem_TableId_Add:
            {
                if(isRealObject(this.m_aPairs[data.id]) && this.m_aPairs[data.id].Id === data.id)
                    break;
                this.m_bTurnOff = true;
                var Id    = data.id;
                var  Class;
                switch (data.objectType)
                {
                    case CLASS_TYPE_SHAPE:
                    {
                        Class = new CShape();
                        break;
                    }
                    case CLASS_TYPE_XFRM:
                    {
                        Class = new CXfrm();
                        break;
                    }
                    case CLASS_TYPE_GEOMETRY:
                    {
                        Class = new CGeometry();
                        break;
                    }

                    case CLASS_TYPE_IMAGE:
                    {
                        Class = new CImageShape();
                        break;
                    }

                    case CLASS_TYPE_GROUP:
                    {
                        Class = new CGroupShape();
                        break;
                    }
                    case CLASS_TYPE_PATH:
                    {
                        Class = new Path();
                        break;
                    }
                    case CLASS_TYPE_PARAGRAPH:
                    {
                        Class = new Paragraph();
                        break;
                    }
                    case CLASS_TYPE_TEXT_BODY:
                    {
                        Class = new CTextBody();
                        break;
                    }
                    case CLASS_TYPE_DOCUMENT_CONTENT:
                    {
                        Class = new CDocumentContent();
                        break;
                    }
                    case CLASS_TYPE_TEXT_PR:
                    {
                        Class = new ParaTextPr();
                        break;
                    }

                    case CLASS_TYPE_UNI_FILL:
                    {
                        Class = new CUniFill();
                        break;
                    }

                    case CLASS_TYPE_PATTERN_FILL:
                    {
                        Class = new CPattFill();
                        break;
                    }
                    case CLASS_TYPE_GRAD_FILL:
                    {

                        Class = new CGradFill();
                        break;
                    }
                    case CLASS_TYPE_SOLID_FILL:
                    {

                        Class = new CSolidFill();
                        break;
                    }
                    case CLASS_TYPE_UNI_COLOR:
                    {

                        Class = new CUniColor();
                        break;
                    }
                    case CLASS_TYPE_SCHEME_COLOR :
                    {
                        Class = new CSchemeColor();
                        break;
                    }
                    case CLASS_TYPE_RGB_COLOR:
                    {
                        Class = new CRGBColor();
                        break;
                    }
                    case CLASS_TYPE_PRST_COLOR:
                    {
                        Class = new CPrstColor();
                        break;
                    }
                    case CLASS_TYPE_SYS_COLOR:
                    {
                        Class = new CSysColor();
                        break;
                    }
                    case CLASS_TYPE_LINE:
                    {
                        Class = new CLn();
                        break;
                    }
                    case CLASS_TYPE_CHART_AS_GROUP:
                    {
                        Class = new CChartAsGroup();
                        break;
                    }
                    case CLASS_TYPE_CHART_LEGEND:
                    {
                        Class = new CChartLegend();
                        break;
                    }
                    case CLASS_TYPE_CHART_TITLE:
                    {
                        Class = new CChartTitle();
                        break;
                    }
                    case CLASS_TYPE_COLOR_MOD:
                    {
                        Class = new CColorMod();
                        break;
                    }
                    case CLASS_TYPE_LEGEND_ENTRY:
                    {
                        Class = new CLegendEntry();
                        break;
                    }
                }
                Class.Id = Id;
                this.m_aPairs[Id] = Class;

                this.m_bTurnOff = false;
                break;
            }
        }
        // Ничего не делаем (можно удалять/добавлять ссылки на классы в данном классе
        // но это не обяательно, т.к. Id всегда уникальные)
    },
//-----------------------------------------------------------------------------------
// Функции для работы с совместным редактирования
//-----------------------------------------------------------------------------------
    Read_Class_FromBinary: function(Reader)
    {
        var ElementType = Reader.GetLong();
        var Element = null;

        // Временно отключаем регистрацию новых классов
        this.m_bTurnOff = true;

        switch( ElementType )
        {
            case historyitem_type_Paragraph        : Element = new Paragraph(); break;
            case historyitem_type_TextPr           : Element = new ParaTextPr(); break;
            case historyitem_type_Drawing          : Element = new ParaDrawing(); break;
            //case historyitem_type_DrawingObjects   : Element = new CDrawingObjects(); break;
            // case historyitem_type_FlowObjects      : Element = new FlowObjects(); break;
            case historyitem_type_FlowImage        : Element = new FlowImage(); break;
            case historyitem_type_Table            : Element = new CTable(); break;
            case historyitem_type_TableRow         : Element = new CTableRow(); break;
            case historyitem_type_TableCell        : Element = new CTableCell(); break;
            case historyitem_type_DocumentContent  : Element = new CDocumentContent(); break;
            case historyitem_type_FlowTable        : Element = new FlowTable(); break;
            case historyitem_type_HdrFtr           : Element = new CHeaderFooter(); break;
            case historyitem_type_AbstractNum      : Element = new CAbstractNum(); break;
        }

        Element.Read_FromBinary2(Reader);

        // Включаем назад регистрацию новых классов
        this.m_bTurnOff = false;

        return Element;
    },

    Save_Changes: function(Data, Writer)
    {
        // Сохраняем изменения из тех, которые используются для Undo/Redo в бинарный файл.
        // Long : тип класса
        // Long : тип изменений

        Writer.WriteLong( historyitem_type_TableId );

        var Type = Data.Type;

        // Пишем тип
        Writer.WriteLong( Type );
        switch ( Type )
        {
            case historyitem_TableId_Add :
            {
                // String   : Id элемента
                // Varibale : сам элемент

                Writer.WriteString2( Data.Id );
                Data.Class.Write_ToBinary2( Writer );

                break;
            }

            case historyitem_TableId_Reset:
            {
                // String : Id_new
                // String : Id_old

                Writer.WriteString2( Data.Id_new );
                Writer.WriteString2( Data.Id_old );

                break;
            }
        }
    },

    Save_Changes2: function(Data, Writer)
    {
        return false;
    },

    Load_Changes: function(Reader, Reader2)
    {
        // Сохраняем изменения из тех, которые используются для Undo/Redo в бинарный файл.
        // Long : тип класса
        // Long : тип изменений

        var ClassType = Reader.GetLong();
        if ( historyitem_type_TableId != ClassType )
            return;

        var Type = Reader.GetLong();

        switch ( Type )
        {
            case historyitem_TableId_Add:
            {
                // String   : Id элемента
                // Varibale : сам элемент

                var Id    = Reader.GetString2();
                var Class = this.Read_Class_FromBinary( Reader );

                this.m_aPairs[Id] = Class;

                break;
            }

            case historyitem_TableId_Reset:
            {
                // String : Id_new
                // String : Id_old

                var Id_new = Reader.GetString2();
                var Id_old = Reader.GetString2();

                if ( "undefined" != this.m_aPairs[Id_old] )
                {
                    var Class = this.m_aPairs[Id_old];
                    delete this.m_aPairs[Id_old];
                    this.m_aPairs[Id_new] = Class;
                }

                break;
            }

        }

        return true;
    },

    Unlock: function(Data)
    {
        // Ничего не делаем
    }
};

function CTextBody(shape)
{
    //this.shape = shape;

    this.bodyPr = new CBodyPr();
    this.bodyPr.setDefault();
    this.lstStyle = null;

    this.content = null;//new CDocumentContent(this, shape.drawingObjects.drawingDocument, 0, 0, 200, 20000, false, false);
    this.contentWidth = 0;
    this.contentHeight = 0;

    this.styles = [];
    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
    if(isRealObject(shape))
    {
        this.setShape(shape);
        this.addDocumentContent(new CDocumentContent(this, isRealObject(shape.drawingObjects) ? shape.drawingObjects.drawingDocument : null, 0, 0, 200, 20000, false, false));
    }

}
CTextBody.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    getType: function()
    {
        return CLASS_TYPE_TEXT_BODY;
    },

    getObjectType: function()
    {
        return CLASS_TYPE_TEXT_BODY;
    },


    setShape: function(shape)
    {
        var oldId = isRealObject(this.shape) ? this.shape.Get_Id() : null;
        var newId = isRealObject(shape) ? shape.Get_Id() : null;
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_SetShape, null, null,
            new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp(oldId, newId)));
        this.shape  = shape;
    },

    addDocumentContent: function(docContent)
    {
        var oldId = isRealObject(this.content) ? this.content.Get_Id() : null;
        var newId = isRealObject(docContent) ? docContent.Get_Id() : null;
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_AddDocContent, null, null,
            new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp(oldId, newId)));
        this.content = docContent;
    },

    draw: function(graphics)
    {
        if(!graphics.IsNoSupportTextDraw)
            this.content.Draw(0, graphics);
        else
        {
            graphics.rect(0, 0, this.contentWidth, this.contentHeight);
        }
    },

    Get_Styles: function(level)
    {
        if(!isRealObject(this.styles[level]))
        {
            var styles = this.shape.getStyles(level);

            if(isRealObject(this.lstStyle) && this.shape instanceof  CShape)
            {
                var style = new CStyle("textBodyStyle", styles.Style.length - 1, null, styletype_Paragraph);
                styles.Style[styles.Id] = style;
                ++styles.Id;
            }

            this.styles[level] = styles;
        }
        return this.styles[level];
    },

    Get_Numbering: function()
    {
        return  new CNumbering();
    },

    isEmpty: function()
    {
        return this.content.Is_Empty();
    },

    Get_TableStyleForPara: function()
    {
        return null;
    },

    initFromString: function(str)
    {
        for(var key in str)
        {
            this.content.Paragraph_Add(new ParaText(str[key]), false);
        }
    },

    getColorMap: function()
    {
        return this.shape.getColorMap();
    },

    getTheme: function()
    {
        return this.shape.getTheme();
    },

    paragraphAdd: function(paraItem)
    {
        this.content.Paragraph_Add(paraItem);
        this.content.Recalculate_Page(0, true );
        this.content.RecalculateCurPos();
        if(this.bodyPr.anchor !== VERTICAL_ANCHOR_TYPE_TOP)
        {
            this.shape.calculateTransformTextMatrix();
        }
    },

    addNewParagraph: function()
    {
        this.content.Add_NewParagraph();
        this.content.Recalculate_Page(0, true );
        this.content.RecalculateCurPos();
        if(this.bodyPr.anchor !== VERTICAL_ANCHOR_TYPE_TOP)
        {
            this.shape.calculateTransformTextMatrix();
        }
    },

    remove: function(direction, bOnlyText)
    {
        this.content.Remove(direction, bOnlyText);
        this.content.Recalculate_Page(0, true );
        this.content.RecalculateCurPos();
        if(this.bodyPr.anchor !== VERTICAL_ANCHOR_TYPE_TOP)
        {
            this.shape.calculateTransformTextMatrix();
        }
    },

    OnContentRecalculate: function()
    {
        if(isRealObject(this.shape) && typeof this.shape.OnContentRecalculate === "function")
            this.shape.OnContentRecalculate();
    },

    recalculate: function()
    {

    },

    getSummaryHeight: function()
    {
        return this.content.Get_SummaryHeight();
    },

    getBodyPr: function()
    {
        var res = new CBodyPr();
        res.setDefault();
        res.merge(this.bodyPr);
        return res;
    },

    OnContentReDraw: function()
    {
        if(isRealObject(this.shape))
            this.shape.drawingObjects.showDrawingObjects();
    },

    calculateContent: function()
    {
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
        this.content.Recalculate_Page(0, true );
    },

    OnEndRecalculate_Page: function()
    {},

    Is_Cell: function()
    {
        return false;
    },

    Get_StartPage_Absolute: function()
    {
        return 0;
    },

    selectionSetStart: function(e, x, y)
    {
        this.content.Selection_SetStart(x, y, 0, e);
    },

    selectionSetEnd: function(e, x, y)
    {
        this.content.Selection_SetEnd(x, y, 0, e);
    },

    updateSelectionState: function(drawingDocument)
    {
        var Doc = this.content;
        if ( true === Doc.Is_SelectionUse() && !Doc.Selection_IsEmpty()) {
            drawingDocument.UpdateTargetTransform(this.shape.transformText);
            drawingDocument.TargetEnd();
            drawingDocument.SelectEnabled(true);
            drawingDocument.SelectClear();
            drawingDocument.SelectShow();
        }
        else
        {
            drawingDocument.UpdateTargetTransform(this.shape.transformText);
            drawingDocument.TargetShow();
            drawingDocument.SelectEnabled(false);
            drawingDocument.CheckTargetShow();
        }
    },


    Get_PageContentStartPos: function(pageNum)
    {
        return {X: 0, Y: 0, XLimit: this.contentWidth, YLimit: 20000};
    },

    setVerticalAlign: function(align)
    {
        var anchor_num = null;
        switch(align)
        {
            case "top":
            {
                anchor_num = VERTICAL_ANCHOR_TYPE_TOP;
                break;
            }
            case "center":
            {
                anchor_num = VERTICAL_ANCHOR_TYPE_CENTER;
                break;
            }

            case "bottom":
            {
                anchor_num = VERTICAL_ANCHOR_TYPE_BOTTOM;
                break;
            }
        }
        if(isRealNumber(anchor_num))
        {
            History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_VerticalAlign, null, null,
                new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp(this.bodyPr.anchor, anchor_num)));
            this.bodyPr.anchor = anchor_num;
        }
    },

    setVert: function(angle)
    {
        var vert = null;
        switch (angle)
        {
            case 0:
            {
                vert = nVertTThorz;
                break;
            }
            case 90:
            {
                vert = nVertTTvert270;
                break;
            }
            case -90:
            {
                vert = nVertTTvert;
                break;
            }
        }
        if(isRealNumber(vert))
        {
            History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_Vert, null, null,
                new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp(this.bodyPr.vert, vert)));
            this.bodyPr.vert = vert;
        }
    },


    setTopInset: function(ins)
    {
        if(isRealNumber(ins))
        {
            History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_TopInset, null, null,
                new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp(this.bodyPr.tIns, ins)));
            this.bodyPr.tIns = ins;
        }
    },

    setRightInset: function(ins)
    {
        if(isRealNumber(ins))
        {
            History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RightInset, null, null,
                new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp(this.bodyPr.rIns, ins)));
            this.bodyPr.rIns = ins;
        }
    },

    setLeftInset: function(ins)
    {
        if(isRealNumber(ins))
        {
            History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_LeftInset, null, null,
                new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp(this.bodyPr.lIns, ins)));
            this.bodyPr.lIns = ins;
        }
    },

    setBottomInset: function(ins)
    {
        if(isRealNumber(ins))
        {
            History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_LeftInset, null, null,
                new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp(this.bodyPr.bIns, ins)));
            this.bodyPr.bIns = ins;
        }
    },

    setPaddings: function(paddings)
    {
        if(isRealObject(paddings))
        {
            this.setBottomInset(paddings.Bottom);
            this.setTopInset(paddings.Top);
            this.setLeftInset(paddings.Left);
            this.setRightInset(paddings.Right);
        }
    },

    recalculateCurPos: function()
    {
        this.content.RecalculateCurPos();
    },

    drawTextSelection: function()
    {
        this.content.Selection_Draw_Page(0);
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
    },

    Refresh_RecalcData2: function()
    {
        if(isRealObject(this.content))
            this.content.Recalculate_Page(0, true);
    },

    Undo: function(type, data)
    {
        switch(type)
        {
            case historyitem_AutoShapes_AddDocContent:
            {
                this.content = g_oTableId.Get_ById(data.oldValue);
                break;
            }
            case historyitem_AutoShapes_SetShape:
            {
                this.shape = g_oTableId.Get_ById(data.oldValue);
                break;
            }
            case historyitem_AutoShapes_VerticalAlign:
            {
                this.bodyPr.anchor = data.oldValue;
                break;
            }
            case historyitem_AutoShapes_Vert:
            {
                this.bodyPr.vert = data.oldValue;
                break;
            }
        }
    },

    Redo: function(type, data)
    {
        switch(type)
        {
            case historyitem_AutoShapes_AddDocContent:
            {
                this.content = g_oTableId.Get_ById(data.newValue);
                break;
            }

            case historyitem_AutoShapes_SetShape:
            {
                this.shape = g_oTableId.Get_ById(data.newValue);
                break;
            }

            case historyitem_AutoShapes_VerticalAlign:
            {
                this.bodyPr.anchor = data.newValue;
                break;
            }
            case historyitem_AutoShapes_Vert:
            {
                this.bodyPr.vert = data.newValue;
                break;
            }
        }
    },

    writeToBinaryForCopyPaste: function(w)
    {
        this.bodyPr.Write_ToBinary2(w);
    },

    readFromBinaryForCopyPaste: function(r, drawingDocument)
    {
        this.bodyPr.Read_FromBinary2(r);
        this.content = new CDocumentContent(this, drawingDocument, 0, 0, 0, 20000, false, false);
    },


    writeToBinary: function(w)
    {
        this.bodyPr.Write_ToBinary2(w);
        writeToBinaryDocContent(this.content, w);
    },


    readFromBinary: function(r,  drawingDocument)
    {
        this.bodyPr.readFromBinary(r);
        readFromBinaryDocContent(this.content, r);
    }
};



function writeToBinaryDocContent(docContent, w)
{
    w.WriteBool(docContent.TurnOffInnerWrap);
    w.WriteBool(docContent.Split);
    var Count = docContent.Content.length;
    w.WriteLong(Count);
    for ( var Index = 0; Index < Count; Index++ )
        writeToBinaryParagraph(docContent.Content[Index], w);
}

function readFromBinaryDocContent(docContent, r)
{
    docContent.TurnOffInnerWrap   = r.GetBool();
    docContent.Split              = r.GetBool();
    var Count = r.GetLong();
    docContent.Content = new Array();
    for ( var Index = 0; Index < Count; Index++ )
    {
        var p = new Paragraph(docContent.DrawingDocument, docContent, 0, 0, 0, 0, 0);
        readFromBinaryParagraph(p, r);
        docContent.Content.push(p);
    }
}

function writeToBinaryParagraph(p, w)
{
    p.Pr.Write_ToBinary( w );

    p.TextPr.writeToBinary(w);

    var StartPos = w.GetCurPosition();
    w.Skip( 4 );

    var Len = p.Content.length;
    var Count  = 0;
    for ( var Index = 0; Index < Len; Index++ )
    {
        var Item = p.Content[Index];
        if ( true === Item.Is_RealContent() )
        {
            Item.Write_ToBinary( w );
            Count++;
        }
    }

    var EndPos = w.GetCurPosition();
    w.Seek( StartPos );
    w.WriteLong( Count );
    w.Seek( EndPos );
}

function readFromBinaryParagraph(p, r)
{
    p.Pr = new CParaPr();
    p.Pr.Read_FromBinary( r );

    p.TextPr = new ParaTextPr();
    p.TextPr.readFromBinary(r);

    p.Content = new Array();
    var Count = r.GetLong();
    for ( var Index = 0; Index < Count; Index++ )
    {
        var Element = ParagraphContent_Read_FromBinary(r);
        if ( null != Element )
            p.Content.push( Element );
    }
}
