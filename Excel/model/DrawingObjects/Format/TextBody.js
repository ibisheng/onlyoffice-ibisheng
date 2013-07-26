/**
 * Created with JetBrains WebStorm.
 * User: Sergey.Luzyanin
 * Date: 7/4/13
 * Time: 5:25 PM
 * To change this template use File | Settings | File Templates.
 */
function CTextBody(shape)
{
    this.shape = shape;

    this.bodyPr = new CBodyPr();
    this.bodyPr.setDefault();
    this.lstStyle = null;

    this.content = new CDocumentContent(this, shape.drawingObjects.drawingDocument, 0, 0, 200, 20000, false, false);
    this.contentWidth = 0;
    this.contentHeight = 0;

    this.styles = [];

}
CTextBody.prototype =
{
    draw: function(graphics)
    {
        this.content.Draw(0, graphics);
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
        if(this.bodyPr.anchor !== VERTICAL_ANCHOR_TYPE_TOP)
        {
            this.shape.calculateTransformTextMatrix();
        }
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
    }
};