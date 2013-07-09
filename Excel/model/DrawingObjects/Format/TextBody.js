/**
 * Created with JetBrains WebStorm.
 * User: Sergey.Luzyanin
 * Date: 7/4/13
 * Time: 5:25 PM
 * To change this template use File | Settings | File Templates.
 */
function CTxBody(shape)
{
    this.shape = shape;

    this.bodyPr = new CBodyPr();
    this.bodyPr.setDefault();
    this.lstStyle = null;

    this.content = new CDocumentContent(this, /*editor.WordControl.m_oLogicDocument.DrawingDocument*/undefined, 0, 0, 200, 20000, false, false);
    this.contentWidth = 0;
    this.contentHeight = 0;

}
CTxBody.prototype =
{
    draw: function(graphics)
    {
        this.content.Draw(0, graphics);
    },

    Get_Styles: function(level)
    {
        return new CStyles();//this.shape.Get_Styles(level);
    },

    Get_Numbering: function()
    {
        return  new CNumbering();
    },

    Get_TableStyleForPara: function()
    {
        return null;
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
        return this.bodyPr;
    },


    calculateContent: function()
    {
        var _l, _t, _r, _b;

        var _body_pr = this.bodyPr;
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
    }
};