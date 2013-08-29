/**
 * Created with JetBrains WebStorm.
 * User: Sergey.Luzyanin
 * Date: 7/4/13
 * Time: 5:25 PM
 * To change this template use File | Settings | File Templates.
 */



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

    Is_TopDocument: function()
    {
        return false;
    },

    Is_HdrFtr: function()
    {
        return false;
    },
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
        this.shape  = shape;
    },

    addDocumentContent: function(docContent)
    {
        var oldId = isRealObject(this.content) ? this.content.Get_Id() : null;
        var newId = isRealObject(docContent) ? docContent.Get_Id() : null;
        this.content = docContent;
    },

    draw: function(graphics, pageIndex)
    {
        if(!graphics.IsNoSupportTextDraw)
        {
            if(typeof pageIndex === "number")
            {
                var old_start_page = this.textBoxContent.Get_StartPage_Relative();
                this.content.Set_StartPage(pageIndex);
            }
            var result_page_index = typeof pageIndex === "number" ? pageIndex : this.shape.pageIndex;
            this.content.Set_StartPage(result_page_index);
            this.content.Draw(result_page_index, graphics);

            if(typeof pageIndex === "number")
            {
                this.content.Set_StartPage(old_start_page);
            }

         //   this.content.Draw(this.shape.pageIndex, graphics);
        }

        else
        {
            graphics.rect(0, 0, this.contentWidth, this.contentHeight);
        }
    },

    Get_Styles: function(level)
    {
        if(this.shape && typeof this.shape.getStyles === "function")
            return this.shape.getStyles();
       return editor.WordControl.m_oLogicDocument.Get_Styles();
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

    Is_ThisElementCurrent: function()
    {
        return false;
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

    updateSelectionState: function()
    {
        var Doc = this.content;
        var dd = editor.WordControl.m_oLogicDocument.DrawingDocument;
        if ( true === Doc.Is_SelectionUse() && !Doc.Selection_IsEmpty()) {
           dd.UpdateTargetTransform(this.shape.transformText);
           dd.TargetEnd();
           dd.SelectEnabled(true);
           dd.SelectClear();
           dd.SelectShow();
        }
        else /*if(this.parent.elementsManipulator.Document.CurPos.Type == docpostype_FlowObjects ) */
        {
            dd.UpdateTargetTransform(this.shape.transformText);
            dd.TargetShow();
            dd.SelectEnabled(false);
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
            this.bodyPr.vert = vert;
        }
    },


    setTopInset: function(ins)
    {
        if(isRealNumber(ins))
        {
            this.bodyPr.tIns = ins;
        }
    },

    setRightInset: function(ins)
    {
        if(isRealNumber(ins))
        {
            this.bodyPr.rIns = ins;
        }
    },

    setLeftInset: function(ins)
    {
        if(isRealNumber(ins))
        {
            this.bodyPr.lIns = ins;
        }
    },

    setBottomInset: function(ins)
    {
        if(isRealNumber(ins))
        {
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
    }
};