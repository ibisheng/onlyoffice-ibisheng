var eps=7;
var left_top=0, top=1, right_top=2, right=3, right_bottom=4, bottom=5, left_bottom=6, left=7;
var adj=0, handle=1, move=2;
var xy=0, polar=1;

var N=0, NE=1, E=2, SE=3, S=4, SW=5, W=6, NW=7, ROT=8, MOVE=9;
var min_size=10;
var min_size2=3;
//типы плейсхолдеров

function CShape(parent, document, drawingDocument)
{
    this.selected = false;
    this.parent = parent; //slide or slideMaster
    this.useBgFill = false;
    this.nvSpPr = null;
    this.spPr = new CSpPr();
    this.style = null;//new CShapeStyle();
    this.txBody = null;

    this.pH = 0;
    this.pV = 0;
    this.rot = 0;
    this.off = {x:0, y:0};
    this.ext = {cx:0, cy:0};
    this.flipH = false;
    this.flipV = false;
    this.geometry = null;

    this.pen = null;
    this.brush = null;
    this.fontFill = null;
    this.shadow = null;

    this.TransformMatrix = new CMatrixL();
    this.TransformTextMatrix = new CMatrixL();

    this.text_flag = true;
}

CShape.prototype =
{
    canGroup: function()
    {
        return true;
    },

    setContainer : function(container)
    {
        this.Container = container;
    },

    setParent : function(parent)
    {
        this.parent = parent;
    },

    Get_Id : function()
    {
        return this.Id;
    },

    Write_ToBinary2 : function(Writer)
    {},
    Save_Changes : function(Data, Writer)
    {
    },

    createFullCopy : function(parent, container)
    {
        var _copy = new CShape(parent);
        _copy.setContainer(container);
        if(this.spLocks != null)
        {
            _copy.spLocks = this.spLocks.createCopy();
        }
        _copy.useBgFill = this.useBgFill;
        if(this.nvSpPr != null)
        {
            _copy.nvSpPr = this.nvSpPr.createDuplicate();
        }
        _copy.spPr = this.spPr.createDuplicate();
        if(this.style != null)
        {
            _copy.style = this.style.createDuplicate()
        }
        if(this.txBody != null)
        {
            _copy.txBody = this.txBody.createFullCopy(_copy);
            _copy.txBody.content.RecalculateNumbering();
            if(_copy.txBody.content2!= null)
            {
                _copy.txBody.content2.RecalculateNumbering();
            }
        }

        if(_copy.nvSpPr == null)
        {
          _copy.nvSpPr = new UniNvPr();
        }
        _copy.nvSpPr.cNvPr.id = ++parent.maxId;

        _copy.pH = this.pH;
        _copy.pV = this.pV;
        _copy.ext = clone(this.ext);
        _copy.off = clone(this.off);
        _copy.rot = this.rot;
        _copy.flipH = this.flipH;
        _copy.flipV = this.flipV;
        if(this.geometry != null)
        {
            _copy.geometry = this.geometry.createDuplicate();
        }
        if(this.pen != null)
        {
            _copy.pen = this.pen.createDuplicate();
        }
        if(this.brush != null)
        {
            _copy.brush = this.brush.createDuplicate();
        }
        if(this.fontFill != null)
        {
            _copy.fontFill = this.fontFill.createDuplicate();
        }
        return _copy;
    },


    changePresetGeom : function(sPreset)
    {
        var _final_preset;
        var _old_line;
        var _new_line;


        if(this.spPr.ln == null)
        {
            _old_line = null;
        }
        else
        {
            _old_line = this.spPr.ln.createDuplicate();
        }
        var _arrow_flag = false;
        switch(sPreset)
        {
            case "lineWithArrow":
            {
                _final_preset = "line";
                _arrow_flag = true;
                if(_old_line == null)
                {
                    _new_line = new CLn();

                }
                else
                {
                    _new_line = this.spPr.ln.createDuplicate();
                }
                _new_line.tailEnd = new EndArrow();
                _new_line.tailEnd.type = LineEndType.Arrow;
                _new_line.tailEnd.len = LineEndSize.Mid;
                _new_line.tailEnd.w = LineEndSize.Mid;
                break;
            }
            case "lineWithTwoArrows":
            {
                _final_preset = "line";
                _arrow_flag = true;
                if(_old_line == null)
                {
                    _new_line = new CLn();

                }
                else
                {
                    _new_line = this.spPr.ln.createDuplicate();
                }
                _new_line.tailEnd = new EndArrow();
                _new_line.tailEnd.type = LineEndType.Arrow;
                _new_line.tailEnd.len = LineEndSize.Mid;
                _new_line.tailEnd.w = LineEndSize.Mid;

                _new_line.headEnd = new EndArrow();
                _new_line.headEnd.type = LineEndType.Arrow;
                _new_line.headEnd.len = LineEndSize.Mid;
                _new_line.headEnd.w = LineEndSize.Mid;
                break;
            }
            case "bentConnector5WithArrow":
            {
                _final_preset = "bentConnector5";
                _arrow_flag = true;
                if(_old_line == null)
                {
                    _new_line = new CLn();

                }
                else
                {
                    _new_line = this.spPr.ln.createDuplicate();
                }
                _new_line.tailEnd = new EndArrow();
                _new_line.tailEnd.type = LineEndType.Arrow;
                _new_line.tailEnd.len = LineEndSize.Mid;
                _new_line.tailEnd.w = LineEndSize.Mid;
                break;
            }
            case "bentConnector5WithTwoArrows":
            {
                _final_preset = "bentConnector5";
                _arrow_flag = true;
                if(_old_line == null)
                {
                    _new_line = new CLn();

                }
                else
                {
                    _new_line = this.spPr.ln.createDuplicate();
                }
                _new_line.tailEnd = new EndArrow();
                _new_line.tailEnd.type = LineEndType.Arrow;
                _new_line.tailEnd.len = LineEndSize.Mid;
                _new_line.tailEnd.w = LineEndSize.Mid;

                _new_line.headEnd = new EndArrow();
                _new_line.headEnd.type = LineEndType.Arrow;
                _new_line.headEnd.len = LineEndSize.Mid;
                _new_line.headEnd.w = LineEndSize.Mid;
                break;
            }
            case "curvedConnector3WithArrow":
            {
                _final_preset = "curvedConnector3";
                _arrow_flag = true;
                if(_old_line == null)
                {
                    _new_line = new CLn();

                }
                else
                {
                    _new_line = this.spPr.ln.createDuplicate();
                }
                _new_line.tailEnd = new EndArrow();
                _new_line.tailEnd.type = LineEndType.Arrow;
                _new_line.tailEnd.len = LineEndSize.Mid;
                _new_line.tailEnd.w = LineEndSize.Mid;
                break;
            }
            case "curvedConnector3WithTwoArrows":
            {
                _final_preset = "curvedConnector3";
                _arrow_flag = true;
                if(_old_line == null)
                {
                    _new_line = new CLn();

                }
                else
                {
                    _new_line = this.spPr.ln.createDuplicate();
                }
                _new_line.tailEnd = new EndArrow();
                _new_line.tailEnd.type = LineEndType.Arrow;
                _new_line.tailEnd.len = LineEndSize.Mid;
                _new_line.tailEnd.w = LineEndSize.Mid;

                _new_line.headEnd = new EndArrow();
                _new_line.headEnd.type = LineEndType.Arrow;
                _new_line.headEnd.len = LineEndSize.Mid;
                _new_line.headEnd.w = LineEndSize.Mid;
                break;
            }
            default  :
            {
                _final_preset = sPreset;
                _arrow_flag = true;
                if(_old_line == null)
                {
                    _new_line = new CLn();

                }
                else
                {
                    _new_line = this.spPr.ln.createDuplicate();
                }
                _new_line.tailEnd = null;

                _new_line.headEnd = null;
                break;
            }
        }

        var historyData = {};
        historyData.arrowFlag = _arrow_flag;
        if(_arrow_flag === true)
        {
            historyData.oldLine = _old_line;
            historyData.newLine = _new_line;
            this.spPr.ln = _new_line;
            this.calculateLine();
        }
        historyData.old_geometry = this.geometry;

        if(_final_preset!=null)
        {
            historyData.new_geometry = CreateGeometry(_final_preset);
            historyData.new_geometry.Init(100, 100);
        }
        else
            historyData.new_geometry = null;

        historyData.undo_function = function(data)
        {
            this.geometry = data.old_geometry;
            this.spPr.Geometry = data.old_geometry;
            if(data.arrowFlag)
            {
                this.spPr.ln = data.oldLine;
                this.calculateLine();
            }

            this.Recalculate();
            this.Container.DrawingDocument.OnRecalculatePage(this.parent.num, this.parent);
        };
        historyData.redo_function = function(data)
        {
            this.geometry = data.new_geometry;
            this.spPr.Geometry = data.new_geometry;
            if(data.arrowFlag)
            {
                this.spPr.ln = data.newLine;
                this.calculateLine();
            }
            this.Recalculate();
            this.Container.DrawingDocument.OnRecalculatePage(this.parent.num, this.parent);
        };
        History.Add(this, historyData);

        if(_final_preset!=null)
        {
            this.geometry = CreateGeometry(_final_preset);
            this.geometry.Init(100, 100);
            this.spPr.Geometry = this.geometry;
        }
        else
        {
            this.geometry = null;
            this.spPr.Geometry = this.geometry;
        }
        this.Recalculate();

        this.Container.DrawingDocument.OnRecalculatePage(this.parent.num, this.parent);
    },

    changeSize : function(w, h)
    {

        var historyData = {};
        historyData.old_w = this.ext.cx;
        historyData.old_h = this.ext.cy;
        historyData.new_w = w;
        historyData.new_h = h;
        historyData.undo_function = function(data)
        {
            this.ext.cx = data.old_w;
            this.ext.cy = data.old_h;
            this.Recalculate();
            this.Container.DrawingDocument.OnRecalculatePage(this.parent.num, this.parent);
        };
        historyData.redo_function = function(data)
        {
            this.ext.cx = data.new_w;
            this.ext.cy = data.new_h;
            this.Recalculate();
            this.Container.DrawingDocument.OnRecalculatePage(this.parent.num, this.parent);
        };
        History.Add(this, historyData);

        this.ext.cx = w;
        this.ext.cy = h;
        this.Recalculate();
        this.Container.DrawingDocument.OnRecalculatePage(this.parent.num, this.parent);
    },

    changeFill : function(unifill)
    {
        var historyObj = {};
        if(this.spPr.Fill == null)
        {
            historyObj.old_Fill = null;
        }
        else
        {
            historyObj.old_Fill = this.spPr.Fill.createDuplicate();
        }
        if(this.spPr.Fill == null )
        {
            this.spPr.Fill = new CUniFill();
        }
        //this.spPr.Fill.merge(unifill);
        this.spPr.Fill = CorrectUniFill(unifill, this.spPr.Fill);
        if(this.spPr.Fill == null)
        {
            historyObj.new_Fill = null;
        }
        else
        {
            historyObj.new_Fill = this.spPr.Fill.createDuplicate();
        }

        historyObj.undo_function = function(data)
        {
            this.spPr.Fill = data.old_Fill;
            this.calculateFill();
        };
        historyObj.redo_function = function(data)
        {
            this.spPr.Fill = data.new_Fill;
            this.calculateFill();
        };

        History.Add(this, historyObj);
        this.calculateFill();
    },

    calculateFill : function()
    {
        var slide = null, layout = null, master = null, theme = null;
        switch(this.parent.kind)
        {
            case SLIDE_KIND :
            {
                slide = this.parent;
                layout = slide.Layout;
                if(layout)
                {
                    master = layout.Master;
                }
                break;
            }
            case LAYOUT_KIND:
            {
                layout = this.parent;
                master = layout.Master;
                break;
            }
            case MASTER_KIND :
            {
                master = this.parent;
                break;
            }
        }

        if(master)
         theme = master.Theme;
        var brush = null;
        var RGBA = {R:0, G:0, B:0, A:255};

        var _compiled_style = null;
        var _compiled_fill = null;
        var _compiled_transparent = null;
        if(this.style != null)
        {
            _compiled_style = this.style;
        }
        else if(this.isPlaceholder())
        {
            var _layout_shape= null, _master_shape = null;
            if(layout != null)
            {
                _layout_shape = layout.getMatchingShape(this.nvSpPr.nvPr.ph.type, this.nvSpPr.nvPr.ph.idx);
            }

            if(master != null)
            {
                _master_shape = master.getMatchingShape(this.nvSpPr.nvPr.ph.type, this.nvSpPr.nvPr.ph.idx);
            }
            if(_layout_shape!= null && _layout_shape.style != null)
            {
                _compiled_style = _layout_shape.style;
            }
            else
            {
                if(_master_shape != null && _master_shape.style != null )
                {
                    _compiled_style = _master_shape.style;
                }
            }

        }

        if(this.spPr.Fill != null && this.spPr.Fill.fill != null)
        {
            _compiled_fill = this.spPr.Fill;
        }
        else if(this.isPlaceholder())
        {
            var _layout_shape= null, _master_shape = null;
            if(layout != null)
            {
                _layout_shape = layout.getMatchingShape(this.nvSpPr.nvPr.ph.type, this.nvSpPr.nvPr.ph.idx);
            }

            if(master != null)
            {
                _master_shape = master.getMatchingShape(this.nvSpPr.nvPr.ph.type, this.nvSpPr.nvPr.ph.idx);
            }
            if(_layout_shape!= null && _layout_shape.spPr != null && _layout_shape.spPr.Fill != null && _layout_shape.spPr.Fill.fill != null)
            {
                _compiled_fill = _layout_shape.spPr.Fill;
            }
            else
            {
                if(_master_shape!= null && _master_shape.spPr != null && _master_shape.spPr.Fill != null && _master_shape.spPr.Fill.fill != null)
                {
                    _compiled_fill = _master_shape.spPr.Fill;
                }
            }
        }

        if(this.spPr.Fill != null && this.spPr.Fill.transparent != null)
        {
            _compiled_transparent = this.spPr.Fill.transparent;
        }
        else if(this.isPlaceholder())
        {
            var _layout_shape= null, _master_shape = null;
            if(layout != null)
            {
                _layout_shape = layout.getMatchingShape(this.nvSpPr.nvPr.ph.type, this.nvSpPr.nvPr.ph.idx);
            }

            if(master != null)
            {
                _master_shape = master.getMatchingShape(this.nvSpPr.nvPr.ph.type, this.nvSpPr.nvPr.ph.idx);
            }
            if(_layout_shape!= null && _layout_shape.spPr != null && _layout_shape.spPr.Fill != null && _layout_shape.spPr.Fill.transparent != null )
            {
                _compiled_transparent = _layout_shape.spPr.Fill.transparent;
            }
            else
            {
                if(_master_shape!= null && _master_shape.spPr != null && _master_shape.spPr.Fill != null && _master_shape.spPr.Fill.transparent != null)
                {
                    _compiled_transparent = _master_shape.spPr.Fill.transparent;
                }
            }
        }

        if (theme && _compiled_style!=null && _compiled_style.fillRef!=null)
        {
            brush = theme.getFillStyle(_compiled_style.fillRef.idx);
            _compiled_style.fillRef.Color.Calculate(theme, slide, layout, master);
            RGBA = _compiled_style.fillRef.Color.RGBA;

            if (_compiled_style.fillRef.Color.color != null)
            {
                if (brush.fill != null && (brush.fill.type == FILL_TYPE_SOLID || brush.fill.type == FILL_TYPE_GRAD))
                {
                    brush.fill.color = _compiled_style.fillRef.Color.createDuplicate();
                }
            }
        }
        else
        {
            brush = new CUniFill();
        }

        if(this.Container instanceof  GroupShape)
        {
            if(this.Container.brush != null)
            {
                brush.merge(this.Container.brush);
            }
        }
        if(_compiled_fill != null)
        {
            _compiled_fill.transparent = _compiled_transparent;
        }
        else
        {
            _compiled_fill = new CUniFill();
            _compiled_fill.transparent = _compiled_transparent;
        }
        brush.merge(_compiled_fill);
        this.brush = brush;
        this.brush.calculate(theme, slide, layout, master, RGBA);
    },

    calculateLine : function()
    {
        var slide = null, layout = null, master = null, theme = null;
        switch(this.parent.kind)
        {
            case SLIDE_KIND :
            {
                slide = this.parent;
                layout = slide.Layout;
                if(layout)
                {
                    master = layout.Master;
                }
                break;
            }
            case LAYOUT_KIND:
            {
                layout = this.parent;
                master = layout.Master;
                break;
            }
            case MASTER_KIND :
            {
                master = this.parent;
                break;
            }
        }

        if(master)
            theme = master.Theme;

        var pen = null;
        var  RGBA = {R:0, G: 0, B:0, A:255};


        var _compiled_style = null;
        var _compiled_line = null;
        if(this.style != null)
        {
            _compiled_style = this.style;
        }
        else if(this.isPlaceholder())
        {
            var _layout_shape= null, _master_shape = null;
            if(layout != null)
            {
                _layout_shape = layout.getMatchingShape(this.nvSpPr.nvPr.ph.type, this.nvSpPr.nvPr.ph.idx);
            }

            if(master != null)
            {
                _master_shape = master.getMatchingShape(this.nvSpPr.nvPr.ph.type, this.nvSpPr.nvPr.ph.idx);
            }
            if(_layout_shape!= null && _layout_shape.style != null)
            {
                _compiled_style = _layout_shape.style;
            }
            else
            {
                if(_master_shape != null && _master_shape.style != null )
                {
                    _compiled_style = _master_shape.style;
                }
            }

        }

        if(this.spPr.ln != null)
        {
            _compiled_line = this.spPr.ln;
        }
        else if(this.isPlaceholder())
        {
            var _layout_shape= null, _master_shape = null;
            if(layout != null)
            {
                _layout_shape = layout.getMatchingShape(this.nvSpPr.nvPr.ph.type, this.nvSpPr.nvPr.ph.idx);
            }

            if(master != null)
            {
                _master_shape = master.getMatchingShape(this.nvSpPr.nvPr.ph.type, this.nvSpPr.nvPr.ph.idx);
            }
            if(_layout_shape!= null && _layout_shape.spPr != null && _layout_shape.spPr.ln != null)
            {
                _compiled_line = _layout_shape.spPr.ln;
            }
            else
            {
                if(_master_shape!= null && _master_shape.spPr != null && _master_shape.spPr.ln != null)
                {
                    _compiled_line = _master_shape.spPr.ln;
                }
            }
        }

        if(theme && _compiled_style!=null && _compiled_style.lnRef!=null)
        {
            pen = theme.getLnStyle(_compiled_style.lnRef.idx);
            _compiled_style.lnRef.Color.Calculate(theme, slide, layout, master);
            RGBA = _compiled_style.lnRef.Color.RGBA;
        }
        else
        {
            pen = new CLn();
        }

        if(this.Container instanceof  GroupShape)
        {
            if(this.Container.pen != null)
            {
                pen.merge(this.Container.pen);
            }
        }

        if(_compiled_line!=null)
        {
            pen.merge(_compiled_line)
        }

        if(pen.Fill!=null)
        {
            pen.Fill.calculate(theme, slide,layout, master, RGBA) ;
        }

        this.pen = pen;
    },


    getPresetGeom: function()
    {
        if(this.geometry != null)
        {
            return this.geometry.preset;
        }
        else
        {
            return null;
        }
    },

    getFill: function()
    {
        return this.brush;
    },

    getStroke: function()
    {
        return this.pen;
    },


    calculateText : function()
    {
        var slide = null, layout = null, master = null, theme = null;
        switch(this.parent.kind)
        {
            case SLIDE_KIND :
            {
                slide = this.parent;
                layout = slide.Layout;
                if(layout)
                {
                    master = layout.Master;
                }
                break;
            }
            case LAYOUT_KIND:
            {
                layout = this.parent;
                master = layout.Master;
                break;
            }
            case MASTER_KIND :
            {
                master = this.parent;
                break;
            }
        }

        if(master)
            theme = master.Theme;
        if(this.txBody)
        {
            if(this.style && this.style.fontRef && this.style.fontRef.Color)
            {
                this.style.fontRef.Color.Calculate(theme, slide, layout, master);
                var fontRef = this.style.fontRef;
            }
            else
            {
                fontRef = null;
            }

            this.txBody.calculateText(theme, slide, layout, master, fontRef);
        }
    },

    calculateText2 : function()
    {

        var slide = null, layout = null, master = null, theme = null;
        switch(this.parent.kind)
        {
            case SLIDE_KIND :
            {
                slide = this.parent;
                layout = slide.Layout;
                if(layout)
                {
                    master = layout.Master;
                }
                break;
            }
            case LAYOUT_KIND:
            {
                layout = this.parent;
                master = layout.Master;
                break;
            }
            case MASTER_KIND :
            {
                master = this.parent;
                break;
            }
        }

        if(master)
            theme = master.Theme;
        if(this.txBody)
        {
            if(this.style && this.style.fontRef && this.style.fontRef.Color)
            {
                this.style.fontRef.Color.Calculate(theme, slide, layout, master);
                var fontRef = this.style.fontRef;
            }
            else
            {
                fontRef = null;
            }

            this.txBody.calculateText2(theme, slide, layout, master, fontRef);
        }
    },


    calculateText3 : function(par)
    {

        var slide = null, layout = null, master = null, theme = null;
        switch(this.parent.kind)
        {
            case SLIDE_KIND :
            {
                slide = this.parent;
                layout = slide.Layout;
                if(layout)
                {
                    master = layout.Master;
                }
                break;
            }
            case LAYOUT_KIND:
            {
                layout = this.parent;
                master = layout.Master;
                break;
            }
            case MASTER_KIND :
            {
                master = this.parent;
                break;
            }
        }

        if(master)
            theme = master.Theme;
        if(this.txBody)
        {
            if(this.style && this.style.fontRef && this.style.fontRef.Color)
            {
                this.style.fontRef.Color.Calculate(theme, slide, layout, master);
                var fontRef = this.style.fontRef;
            }
            else
            {
                fontRef = null;
            }

            this.txBody.calculateText3(par, theme, slide, layout, master, fontRef);
        }
    },

    calculateUniFills : function()
    {
        this.calculateText();
        this.calculateLine();
        this.calculateFill();
    },

    changeLine : function(line)
    {
        var historyObj = {};
        if(this.spPr.ln != null)
        {
            historyObj.old_Line = this.spPr.ln.createDuplicate();
        }
        else
        {
            historyObj.old_Line = null;
        }
        //this.spPr.ln.merge(line);
        this.spPr.ln = CorrectUniStroke(line, this.spPr.ln);
        historyObj.new_Line = this.spPr.ln.createDuplicate();
        historyObj.undo_function = function(data)
        {
            this.spPr.ln= data.old_Line;
            this.calculateLine();
        };
        historyObj.redo_function = function(data)
        {
            this.spPr.ln= data.new_Line;
            this.calculateLine();
        };

        History.Add(this, historyObj);
        this.calculateLine();
    },

    changeSizes : function(kW, kH)
    {
        this.ext.cx*=kW;
        this.ext.cy*=kH;
    },


    createCopy : function(parent, container, posX, posY, _font_flag)//копирование фигуры для последующей вставки на слайд.
    {
        var _history_is_on = History.Is_On();
        if(_history_is_on)
        {
            History.TurnOff();
        }
        var _copied_shape = new CShape(parent);
        _copied_shape.setContainer(container);

        _copied_shape.spPr = this.spPr.createDuplicate();
        _copied_shape.spPr.xfrm.offX = posX;
        _copied_shape.spPr.xfrm.offY = posY;
        _copied_shape.spPr.xfrm.extX = this.ext.cx;
        _copied_shape.spPr.xfrm.extY = this.ext.cy;
        _copied_shape.spPr.xfrm.rot = this.rot;
        _copied_shape.spPr.xfrm.flipH = this.flipH;
        _copied_shape.spPr.xfrm.flipV = this.flipV;
        _copied_shape.nvSpPr = new UniNvPr();
        _copied_shape.nvSpPr.cNvPr.id = ++parent.maxId;
        if(this.style != null)
        {
           _copied_shape.style = this.style.createDuplicate();
        }
        if(this.txBody != null)
        {
            _copied_shape.txBody = this.txBody.createCopy(_copied_shape, _font_flag);
        }
        _copied_shape.TransformMatrix = this.TransformMatrix.CreateDublicate();
        if(_history_is_on)
        {
            History.TurnOn();
        }
        return _copied_shape;
    },


    updateCursorTypes : function()
    {
        this.cursorTypes = [];
        var transform = this.TransformMatrix;
        var vc = this.ext.cy*0.5;
        var hc = this.ext.cx*0.5;
        var xc = transform.TransformPointX(hc, vc);
        var yc = transform.TransformPointY(hc, vc);
        var xt = transform.TransformPointX(hc, 0);
        var yt = transform.TransformPointY(hc, 0);
        var vx = xt-xc;
        var vy = yc-yt;
        var angle = Math.atan2(vy, vx)+Math.PI/8;
        if(angle < 0)
        {
            angle+=2*Math.PI;
        }
        if(angle > 2*Math.PI)
        {
            angle-=2*Math.PI;
        }

        var xlt = transform.TransformPointX(0, 0);
        var ylt = transform.TransformPointY(0, 0);
        var vx_lt = xlt-xc;
        var vy_lt = yc-ylt;
        var curTypes = [];
        curTypes[0] = "n-resize";
        curTypes[1] = "ne-resize";
        curTypes[2] = "e-resize";
        curTypes[3] = "se-resize";
        curTypes[4] = "s-resize";
        curTypes[5] = "sw-resize";
        curTypes[6] = "w-resize";
        curTypes[7] = "nw-resize";
        if(vx_lt*vy-vx*vy_lt < 0) // нумерация якорьков по часовой стрелке
        {
            for(var i = 0; i<8; ++i)
            {
                this.cursorTypes[i] = curTypes[(i+1-Math.floor(angle/(Math.PI/4))+16)%8]
            }
        }
        else
        {
            for(i = 0; i<8; ++i)
            {
                this.cursorTypes[i] = curTypes[(-i+3-Math.floor(angle/(Math.PI/4))+16)%8]
            }
        }

    },

    createDuplicate : function(parent, container)
    {
        var duplicate = new CShape(parent);
        duplicate.Container = container;

        duplicate.useBgFill = this.useBgFill;
        if(this.nvSpPr != null)
        {
            duplicate.nvSpPr = this.nvSpPr.createDuplicate();
        }

        duplicate.spPr = this.spPr.createDuplicate();

        if(this.style!=null)
        {
            duplicate.style = this.style.createDuplicate();
        }
        if(this.txBody!=null)
        {
            duplicate.txBody = this.txBody.createDuplicate(duplicate);
        }
        return duplicate;
    },

    canChangeArrows : function()
    {
        if(this.geometry == null)
        {
            return false;
        }
        var _path_list = this.geometry.pathLst;
        var _path_index;
        var _path_command_index;
        var _path_command_arr;
        for(_path_index = 0; _path_index < _path_list.length; ++_path_index)
        {
            _path_command_arr = _path_list[_path_index].ArrPathCommandInfo;
            for(_path_command_index = 0; _path_command_index < _path_command_arr.length; ++ _path_command_index)
            {
                if(_path_command_arr[_path_command_index].id == 5)
                {
                    break;
                }
            }
            if(_path_command_index == _path_command_arr.length)
            {
                return true;
            }
        }
        return false;
    },

    createDuplicate2 : function(parent, container)
    {
        var duplicate = new CShape(parent);
        duplicate.Container = container;

        duplicate.useBgFill = this.useBgFill;
        if(this.nvSpPr != null)
        {
            duplicate.nvSpPr = this.nvSpPr.createDuplicate();
        }

        duplicate.spPr = this.spPr.createDuplicate();

        if(this.style!=null)
        {
            duplicate.style = this.style.createDuplicate();
        }
        return duplicate;
    },

    Get_StartPage_Absolute: function()
    {
        return this.parent.num;
    },

    Get_Paragraph_ParaPr : function()
    {
        if(this.txBody)
        {
           return this.txBody.Get_Paragraph_ParaPr();
        }
        else
        {
            return null;
        }
    },

    Get_Paragraph_TextPr : function()
    {
        if(this.txBody)
        {
            var textPr = this.txBody.Get_Paragraph_TextPr();
            textPr.VertAlign = this.txBody.compiledBodyPr.anchor;
            return textPr;
        }
        else
        {
            return null;
        }
    },

    Set_ParagraphIndent : function(ind)
    {
        if(this.txBody)
        {
            this.txBody.Set_ParagraphIndent(ind);
            this.txBody.recalculate();
            this.RecalculateTransformMatrix();
            this.txBody.recalculateCurPos();
        }
    },

    Set_ParagraphAlign : function(align)
    {
        if(this.txBody)
        {
            this.txBody.Set_ParagraphAlign(align);
            this.txBody.recalculate();
        }
    },

    CreateFontMap : function(FontMap)
    {
        if(this.txBody != undefined && this.txBody.content!=undefined)
        {
            this.txBody.content.Document_CreateFontMap(FontMap);
        }
    },

    Paragraph_IncDecFontSize: function(bIncrease)
    {
        if(this.txBody)
        {
            this.txBody.Paragraph_IncDecFontSize(bIncrease);
            this.txBody.recalculate();
        }
    },

    getMargins :  function()
    {
        if(this.txBody)
        {
            return this.txBody.getMargins()
        }
        else
        {
            return null;
        }
    },

    getXfrm : function ()
    {
        if(this.parent.kind != SLIDE_KIND)
        {
            if(this.spPr.xfrm.offX != null)
            {
                return this.spPr.xfrm;
            }
            else
            {
                return null;
            }
        }
        var _xfrm = new CXfrm();
        if(this.spPr.xfrm != null && this.spPr.xfrm.offX != null)
        {
            _xfrm.offX = this.pH;
            _xfrm.offY = this.pV;
            _xfrm.extX = this.ext.cx;
            _xfrm.extY = this.ext.cy;
            _xfrm.flipH = this.flipH;
            _xfrm.flipV = this.flipV;
            _xfrm.rot = this.rot;
            return _xfrm;
        }
        else if(this.isPlaceholder())
        {
            var _phType, _phIdx;
            _phType = this.nvSpPr.nvPr.ph.type;
            _phIdx = this.nvSpPr.nvPr.ph.idx;
            var  _master_shape = this.parent.Layout.Master.getMatchingShape(_phType, _phIdx);
            var _layout_shape = this.parent.Layout.getMatchingShape(_phType, _phIdx);
            if(_master_shape && _master_shape.spPr && _master_shape.spPr.xfrm)
            {
                _xfrm.merge(_master_shape.spPr.xfrm)
            }
            if(_layout_shape && _layout_shape.spPr && _layout_shape.spPr.xfrm)
            {
                _xfrm.merge(_layout_shape.spPr.xfrm)
            }
            if(this.ext.cx == _xfrm.extX && this.ext.cy == _xfrm.extY && this.pH == _xfrm.offX && this.pV == _xfrm.offY
                && (this.rot == 0 ? (_xfrm.rot == 0 || _xfrm.rot == undefined) : _xfrm.rot == this.rot)
                && (this.flipH == 0 ? (_xfrm.flipH == 0 || _xfrm.flipH == undefined) : _xfrm.flipH == this.flipH)
                && (this.flipV == 0 ? (_xfrm.flipV == 0 || _xfrm.flipV == undefined) : _xfrm.flipH == this.flipV))
            {
                return _xfrm;
            }
            else
            {
                _xfrm.offX = this.pH;
                _xfrm.offY = this.pV;
                _xfrm.extX = this.ext.cx;
                _xfrm.extY = this.ext.cy;
                _xfrm.flipH = this.flipH;
                _xfrm.flipV = this.flipV;
                _xfrm.rot = this.rot;
                return _xfrm;
            }
        }
        else
        {
            _xfrm.offX = this.pH;
            _xfrm.offY = this.pV;
            _xfrm.extX = this.ext.cx;
            _xfrm.extY = this.ext.cy;
            _xfrm.flipH = this.flipH;
            _xfrm.flipV = this.flipV;
            _xfrm.rot = this.rot;
            return _xfrm;
        }
    },

    prepareToChangeTheme : function(_new_layout)
    {
        if(this.txBody)
        {
            if(this.txBody.content)
            {
                this.txBody.content.arrStyles = new Array(9);
            }
            if(this.txBody.content2)
            {
                this.txBody.content2.arrStyles = new Array(9);
            }
        }

        var _history_obj = {};
        _history_obj.oldXfrm = this.spPr.xfrm.createDuplicate();
        if(_history_obj.oldXfrm == null )
        {
            _history_obj.oldXfrm = new CXfrm();
        }

        if(this.isPlaceholder())
        {
            var _ph_type = this.nvSpPr.nvPr.ph.type, _ph_index = this.nvSpPr.nvPr.ph.idx;
            var _new_layout_shape = _new_layout.getMatchingShape(_ph_type, _ph_index);
            var _new_master_shape = _new_layout.Master.getMatchingShape(_ph_type, _ph_index);
            var _new_compiled_xfrm = new CXfrm();
            if(_new_master_shape != null)
            {
                _new_compiled_xfrm.merge(_new_master_shape.spPr.xfrm);
            }
            if(_new_layout_shape != null)
            {
                _new_compiled_xfrm.merge(_new_layout_shape.spPr.xfrm);
            }
            if(_new_compiled_xfrm.offX == null)
            {
                var _xfrm = new CXfrm();
                _xfrm.offX = this.pH;
                _xfrm.offY = this.pV;

                _xfrm.extX = this.ext.cx;
                _xfrm.extY = this.ext.cy;

                _xfrm.rot = this.rot;
                _xfrm.flipH = this.flipH;
                _xfrm.flipV = this.flipV;
                this.spPr.xfrm = _xfrm;
                _history_obj.newXfrm = _xfrm.createDuplicate();

                _history_obj.undo_function = function(data)
                {
                    this.spPr.xfrm = data.oldXfrm;
                };
                _history_obj.redo_function = function(data)
                {
                    this.spPr.xfrm = data.newXfrm;
                }
                History.Add(this, _history_obj);
                return;
            }
        }
    },

    prepareToChangeTheme2: function()
    {
        if(this.txBody)
        {
            if(this.txBody.content)
            {
                this.txBody.content.arrStyles = new Array(9);
            }
            if(this.txBody.content2)
            {
                this.txBody.content2.arrStyles = new Array(9);
            }
        }
    },

    calculate : function()
    {
        var _xfrm = new CXfrm();
        if(this.isPlaceholder())
        {
            var phIdx = this.nvSpPr.nvPr.ph.idx, phType = this.nvSpPr.nvPr.ph.type;
            var _master_shape, _layout_shape;
            switch(this.parent.kind)
            {
                case SLIDE_KIND :
                {
                    var duplicate =  this.createDuplicate2(this.parent, this.Container);
                    _master_shape = this.parent.Layout.Master.getMatchingShape(phType, phIdx);
                    _layout_shape = this.parent.Layout.getMatchingShape(phType, phIdx);

                    this.merge(_master_shape);
                    this.merge(_layout_shape);
                    this.merge(duplicate);

                    if(_master_shape)
                    {
                        _xfrm.merge(_master_shape.spPr.xfrm);
                    }
                    if(_layout_shape)
                    {
                        _xfrm.merge(_layout_shape.spPr.xfrm);
                    }
                    _xfrm.merge(duplicate.spPr.xfrm);

                    break;
                }
                case LAYOUT_KIND :
                {
                    duplicate =  this.createDuplicate2(this.parent, this.Container);
                    _master_shape = this.parent.Master.getMatchingShape(phType, phIdx);
                    this.merge(_master_shape);
                    this.merge(duplicate);
                    if(_master_shape)
                    {
                        _xfrm.merge(_master_shape.spPr.xfrm);
                    }
                    _xfrm.merge(duplicate.spPr.xfrm);
                    break;
                }
                case  MASTER_KIND:
                {
                    _xfrm.merge(this.spPr.xfrm);
                    break;
                }
            }
        }
        else
        {
            _xfrm.merge(this.spPr.xfrm);
        }

        this.ext = {};
        this.off = {x: 0, y:0};
        if(_xfrm.offX !== null)
        {
            this.pH = _xfrm.offX;
        }
        else
        {
            this.pH = 0;
        }
        if(_xfrm.offY !== null)
        {
            this.pV = _xfrm.offY;
        }
        else
        {
            this.pV = 0;
        }

        if(_xfrm.extX !== null)
        {
            this.ext.cx = _xfrm.extX;
        }
        else
        {
            this.ext.cx = 10;
        }

        if(_xfrm.extY !== null)
        {
            this.ext.cy = _xfrm.extY;
        }
        else
        {
            this.ext.cy = 10;
        }

        if(_xfrm.rot !== null)
        {
            this.rot = _xfrm.rot;
        }
        else
        {
            this.rot = 0;
        }

        if(_xfrm.flipH !== null)
        {
            this.flipH = _xfrm.flipH;
        }
        else
        {
            this.flipH = false;
        }

        if(_xfrm.flipV !== null)
        {
            this.flipV = _xfrm.flipV;
        }
        else
        {
            this.flipV = false;
        }


        if(this.spPr.Geometry!=null)
        {
            this.geometry = this.spPr.Geometry;
        }

        this.calculateFill();
        this.calculateLine();

        if(this.geometry)
        {
            this.geometry.Init(this.ext.cx, this.ext.cy);
        }
        if(this.txBody)
        {
          this.txBody.calculate();
        }

        this.calculateText();
        this.Recalculate();
        this.updateCursorTypes();

    },



    calculate2 : function()
    {
        var _xfrm = new CXfrm();
        if(this.isPlaceholder())
        {
            var phIdx = this.nvSpPr.nvPr.ph.idx, phType = this.nvSpPr.nvPr.ph.type;
            var _master_shape, _layout_shape;
            switch(this.parent.kind)
            {
                case SLIDE_KIND :
                {
                    var duplicate =  this.createDuplicate2(this.parent, this.Container);
                    _master_shape = this.parent.Layout.Master.getMatchingShape(phType, phIdx);
                    _layout_shape = this.parent.Layout.getMatchingShape(phType, phIdx);

                    this.merge(_master_shape);
                    this.merge(_layout_shape);
                    this.merge(duplicate);

                    if(_master_shape)
                    {
                        _xfrm.merge(_master_shape.spPr.xfrm);
                    }
                    if(_layout_shape)
                    {
                        _xfrm.merge(_layout_shape.spPr.xfrm);
                    }
                    _xfrm.merge(duplicate.spPr.xfrm);

                    break;
                }
                case LAYOUT_KIND :
                {
                    duplicate =  this.createDuplicate2(this.parent, this.Container);
                    _master_shape = this.parent.Master.getMatchingShape(phType, phIdx);
                    this.merge(_master_shape);
                    this.merge(duplicate);
                    if(_master_shape)
                    {
                        _xfrm.merge(_master_shape.spPr.xfrm);
                    }
                    _xfrm.merge(duplicate.spPr.xfrm);
                    break;
                }
                case  MASTER_KIND:
                {
                    _xfrm.merge(this.spPr.xfrm);
                    break;
                }
            }
        }
        else
        {
            _xfrm.merge(this.spPr.xfrm);
        }


        this.ext = {};
        this.off = {x: 0, y:0};
        if(_xfrm.offX !== null)
        {
            this.pH = _xfrm.offX;
        }
        else
        {
            this.pH = 0;
        }
        if(_xfrm.offY !== null)
        {
            this.pV = _xfrm.offY;
        }
        else
        {
            this.pV = 0;
        }

        if(_xfrm.extX !== null)
        {
            this.ext.cx = _xfrm.extX;
        }
        else
        {
            this.ext.cx = 10;
        }

        if(_xfrm.extY !== null)
        {
            this.ext.cy = _xfrm.extY;
        }
        else
        {
            this.ext.cy = 10;
        }

        if(_xfrm.rot !== null)
        {
            this.rot = _xfrm.rot;
        }
        else
        {
            this.rot = 0;
        }

        if(_xfrm.flipH !== undefined)
        {
            this.flipH = _xfrm.flipH;
        }
        else
        {
            this.flipH = false;
        }
        if(_xfrm.flipV !== undefined)
        {
            this.flipV = _xfrm.flipV;
        }
        else
        {
            this.flipV = false;
        }

        this.calculateFill();
        this.calculateLine();

        if(this.geometry)
        {
            if(this.geometry.gdLst["_3cd4"] == undefined)
            {
                this.geometry.Init(this.ext.cx, this.ext.cy);
            }
            else
            {
                this.geometry.Recalculate(this.ext.cx, this.ext.cy);
            }
        }
        if(this.txBody)
        {
            this.txBody.calculateBodyPr();
        }

        this.calculateText();
        this.Recalculate();
        this.updateCursorTypes();

    },



    calculateColors: function()
    {
        this.calculateFill();
        this.calculateLine();
        this.calculateText2();
    },

    calculateXfrm: function()
    {
        var _transform = this.spPr.xfrm;
        var _historyData = {};

        if(_transform != null && _transform.offX != null)
        {
            _historyData.oldTransform = _transform.createDuplicate();

            _transform.offX = this.pH;
            _transform.offY = this.pV;
            _transform.extX = this.ext.cx;
            _transform.extY = this.ext.cy;
            _transform.rot = this.rot;
            _transform.flipH = this.flipH;
            _transform.flipV = this.flipV;

            _historyData.newTransform = _transform.createDuplicate();
            _historyData.undo_function = function(data)
            {
                this.spPr.xfrm = data.oldTransform.createDuplicate();
            };
            _historyData.redo_function = function(data)
            {
                this.spPr.xfrm = data.newTransform.createDuplicate();
            };
            History.Add(this, _historyData);
        }
        else
        {
            if(this.isPlaceholder())
            {
                var _type = this.nvSpPr.nvPr.ph.type;
                var _idx = this.nvSpPr.nvPr.ph.idx;
                var _master = null, _layout = null;
                var _layout_shape = null;
                var _master_shape = null;
                var _compiled_transform = new CXfrm();
                switch(this.parent.kind)
                {
                    case SLIDE_KIND:
                    {
                        _layout = this.parent.Layout;
                        if(_layout != null && typeof _layout === "object")
                        {
                            _layout_shape = _layout.getMatchingShape(_type, _idx);
                            _master = _layout.Master;
                            if(_master != null && typeof _master === "object")
                            {
                                _master_shape = _master.getMatchingShape(_type, _idx);
                            }
                        }
                        break;
                    }
                    case LAYOUT_KIND:
                    {
                        _master = this.parent.Master;
                        if(_master != null && typeof _master === "object")
                        {
                            _master_shape = _master.getMatchingShape(_type, _idx);
                        }
                        break;
                    }
                }
                if(_master_shape != null && _master_shape.spPr != null && _master_shape.spPr.xfrm != null)
                {
                    _compiled_transform.merge(_master_shape.spPr.xfrm);
                }
                if(_layout_shape != null && _layout_shape.spPr != null && _layout_shape.spPr.xfrm != null)
                {
                    _compiled_transform.merge(_layout_shape.spPr.xfrm);
                }

                if(_compiled_transform.offX != null)
                {
                    if(_compiled_transform.rot === null)
                    {
                        _compiled_transform.rot = 0;
                    }
                    if(_compiled_transform.flipH === null)
                    {
                        _compiled_transform.flipH = false;
                    }
                    if(_compiled_transform.flipV === null)
                    {
                        _compiled_transform.flipV = false;
                    }
                    if(this.flipH === null)
                    {
                        this.flipH =  false;
                    }
                    if(this.flipV === null)
                    {
                        this.flipV = false;
                    }
                    if(this.rot === null)
                    {
                        this.rot = 0;
                    }
                    if(_compiled_transform.offX !== this.pH
                        || _compiled_transform.offY !== this.pV
                        || _compiled_transform.extX !== this.ext.cx
                        || _compiled_transform.extY !== this.ext.cy
                        || _compiled_transform.rot !== this.rot
                        || _compiled_transform.flipH !== this.flipH
                        || _compiled_transform.flipV !== this.flipV)
                    {
                        var _new_transform = new CXfrm();
                        _new_transform.offX = this.pH;
                        _new_transform.offY = this.pV;
                        _new_transform.extX = this.ext.cx;
                        _new_transform.extY = this.ext.cy;
                        _new_transform.rot = this.rot;
                        _new_transform.flipH = this.flipH;
                        _new_transform.flipV = this.flipV;

                        this.spPr.xfrm = _new_transform;
                        _historyData = {};
                        _historyData.oldTransform = new CXfrm();
                        _historyData.newTransform = _new_transform.createDuplicate();
                        _historyData.undo_function = function(data)
                        {
                            this.spPr.xfrm = data.oldTransform.createDuplicate();
                        };
                        _historyData.redo_function = function(data)
                        {
                            this.spPr.xfrm = data.newTransform.createDuplicate();
                        };
                        History.Add(this, _historyData);
                    }
                }
            }
            else
            {
                _historyData = {};
                _historyData.oldTransform = new CXfrm();
                var _new_xfrm = new CXfrm();
                _new_xfrm.offX = this.pH;
                _new_xfrm.offY = this.pV;
                _new_xfrm.extX = this.ext.cx;
                _new_xfrm.extY = this.ext.cy;
                _new_xfrm.flipH = this.flipH;
                _new_xfrm.flipV = this.flipV;
                _new_xfrm.rot = this.rot;
                _historyData.newTransform = _new_xfrm;
                _historyData.undo_function = function(data)
                {
                    this.spPr.xfrm = data.oldTransform.createDuplicate();
                };
                _historyData.redo_function = function(data)
                {
                    this.spPr.xfrm = data.newTransform.createDuplicate();
                };
                History.Add(this, _historyData);
            }
        }
    },

    merge : function(shape)
    {

        if(shape!=null)
        {
            if(shape.nvSpPr!=null)
            {
                this.nvSpPr = shape.nvSpPr.createDuplicate();
            }

            this.spPr.merge(shape.spPr);

            /*if(shape.style!=null)
            {
                if(this.style == null)
                {
                    this.style = new CShapeStyle();
                }
                this.style.merge(shape.style);
            }        */

            //TODO: txBody
        }

    },


    getFullTransform : function()
    {
        if(this.Container.IsGroup())
        {
            var tmp = this.Container.getFullTransform();
            global_MatrixTransformer.MultiplyAppend(tmp, this.TransformMatrix);
            return tmp;
        }
        else
        {
            return this.TransformMatrix.CreateDublicate();
        }
    },

    AddGeometry: function(geometry)
    {
        this.geometry=geometry;
    },



    Hyperlink_Add : function(HyperProps)
    {
        if(this.txBody != null && this.txBody.content != null)
        {
            this.txBody.content.Hyperlink_Add(HyperProps);
        }
    },

    Hyperlink_Modify : function(HyperProps)
    {
        if(this.txBody != null && this.txBody.content != null)
        {
            this.txBody.content.Hyperlink_Modify(HyperProps);
        }
    },

    Hyperlink_Remove : function()
    {
        if(this.txBody != null && this.txBody.content != null)
        {
            this.txBody.content.Hyperlink_Remove();
        }
    },

    Hyperlink_CanAdd : function(bCheckInHyperlink)
    {
        if(this.txBody != null && this.txBody.content != null)
        {
            return this.txBody.content.Hyperlink_CanAdd(bCheckInHyperlink);
        }
        return false;
    },

    // Проверяем, находимся ли мы в гиперссылке сейчас
    Hyperlink_Check : function(bCheckEnd)
    {
        if(this.txBody != null && this.txBody.content != null)
        {
            return this.txBody.content.Hyperlink_Check();
        }
        return null;
    },


    Paragraph_Add: function(ParaItem, bRecalculate)
    {
        if(this.txBody )  {

            this.txBody.addToParagraph(ParaItem);

        }
    },

    Get_PageContentStartPos: function()
    {
       if(this.parent.kind == SLIDE_KIND)
       {
           return this.parent.Layout.Master.presentation.Get_PageContentStartPos( this.parent.num );
       }

        if(this.geometry && this.geometry.rect)
        {
            return {
                X : this.geometry.rect.l+this.pH+this.ext.x,
                XLimit: this.geometry.r-this.geometry.l,
                Y : this.geometry.rect.t+this.pV+this.ext.y,
                YLimit : this.geometry.b-this.geometry.t,
                MaxTopBorder : 0}
        }
        else {

            return {
                X : this.pH+this.ext.cx,
                XLimit: this.ext.cx,
                Y : this.pV+this.ext.cy,
                YLimit : this.ext.cy,
                MaxTopBorder : 0}

        }

    },

    isPlaceholder : function()
    {
        return this.nvSpPr != null && this.nvSpPr.nvPr != undefined && this.nvSpPr.nvPr.ph != undefined;
    },

     getPhType : function()
     {
         if(this.isPlaceholder())
         {
             return this.nvSpPr.nvPr.ph.type;
         }
         else
         {
             return null;
         }
     },

    getBounds : function()
    {

    },


    Set_SelectionState : function(State, idx)
    {
        if(this.txBody && this.txBody.content)
        {
            this.txBody.content.Set_SelectionState(State, idx);
        }
    },


    Get_SelectionState : function()
    {
        if(this.txBody && this.txBody.content)
        {
          return  this.txBody.content.Get_SelectionState();
        }
    },

    setVerticalAlign : function(align)
    {

        if(this.txBody)
        {
            return this.txBody.setVerticalAlign(align);
        }
        return false;
    },

    canSetVerticalAlign: function(align)
    {
        if(this.txBody != null && this.txBody.compiledBodyPr != null && this.txBody.compiledBodyPr.anchor != null)
        {
            return this.txBody.compiledBodyPr.anchor !== align;
        }
        return true;
    },

    Draw: function(graphics)
    {
        if (graphics.IsSlideBoundsCheckerType === true)
        {
            graphics.transform3(this.TransformMatrix);
            if (null == this.geometry || !graphics.IsShapeNeedBounds(this.geometry.preset))
            {
                graphics._s();
                graphics._m(0, 0);
                graphics._l(this.ext.cx * 100, 0);
                graphics._l(this.ext.cx * 100, this.ext.cy * 100);
                graphics._l(0, this.ext.cy * 100);
                graphics._e();
            }
            else
            {
                this.geometry.check_bounds(graphics);
            }

            if(this.txBody)
            {
                graphics.SetIntegerGrid(false);
                graphics.transform3(this.TransformTextMatrix);
                this.txBody.draw(graphics);
                graphics.SetIntegerGrid(true);
            }

            graphics.reset();
            return;
        }

        if(this.geometry || this.style || (this.brush && this.brush.fill) || (this.pen && this.pen.Fill && this.pen.Fill.fill))
        {
            graphics.SetIntegerGrid(false);
            graphics.transform3(this.TransformMatrix, false);

            var shape_drawer = new CShapeDrawer();
            shape_drawer.fromShape(this, graphics);
            shape_drawer.draw(this.geometry);
        }
        if(this.isEmptyPlaceholder() && graphics.IsNoDrawingEmptyPlaceholder !== true)
        {
            if (graphics.m_oContext !== undefined && graphics.IsTrack === undefined)
            {
                if (global_MatrixTransformer.IsIdentity2(this.TransformMatrix))
                {
                    graphics.transform3(this.TransformMatrix, false);
                    var tr = graphics.m_oFullTransform;
                    graphics.SetIntegerGrid(true);

                    var _x = tr.TransformPointX(0, 0);
                    var _y = tr.TransformPointY(0, 0);
                    var _r = tr.TransformPointX(this.ext.cx, this.ext.cy);
                    var _b = tr.TransformPointY(this.ext.cx, this.ext.cy);

                    graphics.m_oContext.lineWidth = 1;
                    graphics.p_color(127,127,127,255);

                    graphics._s();
                    editor.WordControl.m_oDrawingDocument.AddRectDashClever(graphics.m_oContext, _x >> 0, _y >> 0, _r >> 0, _b >> 0, 2, 2);
                    graphics.ds();
                }
                else
                {
                    graphics.transform3(this.TransformMatrix, false);
                    var tr = graphics.m_oFullTransform;
                    graphics.SetIntegerGrid(true);

                    var _r = this.ext.cx;
                    var _b = this.ext.cy;

                    var x1 = tr.TransformPointX(0, 0) >> 0;
                    var y1 = tr.TransformPointY(0, 0) >> 0;

                    var x2 = tr.TransformPointX(_r, 0) >> 0;
                    var y2 = tr.TransformPointY(_r, 0) >> 0;

                    var x3 = tr.TransformPointX(0, _b) >> 0;
                    var y3 = tr.TransformPointY(0, _b) >> 0;

                    var x4 = tr.TransformPointX(_r, _b) >> 0;
                    var y4 = tr.TransformPointY(_r, _b) >> 0;

                    graphics.m_oContext.lineWidth = 1;
                    graphics.p_color(127,127,127,255);

                    graphics._s();
                    editor.WordControl.m_oDrawingDocument.AddRectDash(graphics.m_oContext, x1, y1, x2, y2, x3, y3, x4, y4, 2, 2);
                    graphics.ds();
                }
            }
            else
            {
                graphics.SetIntegerGrid(false);
                graphics.p_width(70);
                graphics.transform3(this.TransformMatrix, false);
                graphics.p_color(0,0,0,255);
                graphics._s();
                graphics._m(0, 0);
                graphics._l(this.ext.cx*100, 0);
                graphics._l(this.ext.cx*100, this.ext.cy*100);
                graphics._l(0, this.ext.cy*100);
                graphics._z();
                graphics.ds();

                graphics.SetIntegerGrid(true);
            }
        }

        if(this.txBody)
        {
            graphics.SetIntegerGrid(false);
            graphics.transform3(this.TransformTextMatrix);
            this.txBody.draw(graphics);
            if (graphics.FreeFont !== undefined)
                graphics.FreeFont();

            /*var _masrgins = this.getMargins();
            graphics.reset();
            graphics.SetIntegerGrid(false);
            graphics.p_width(70);
            graphics.transform3(this.TransformTextMatrix);
            graphics.p_color(0,0,0,255);
            graphics._s();
            graphics._m(_masrgins.L*100, _masrgins.T*100);
            graphics._l(_masrgins.R*100, _masrgins.T*100);
            graphics._l(_masrgins.R*100, _masrgins.B*100);
            graphics._l(_masrgins.L*100, _masrgins.B*100);
            graphics._z();
            graphics.ds();        */

            graphics.SetIntegerGrid(true);
        }

        graphics.reset();
        graphics.SetIntegerGrid(true);

    },

    check_bounds: function(checker)
    {
        if (this.geometry)
        {
            this.geometry.check_bounds(checker);
        }
        else
        {
            checker._s();
            checker._m(0, 0);
            checker._l(this.ext.cx * 100, 0);
            checker._l(this.ext.cx * 100, this.ext.cy * 100);
            checker._l(0, this.ext.cy * 100);
            checker._z();
            checker._e();
        }
    },


    checkDrawGeometry : function()
    {
        return this.geometry &&
            ( (this.pen && this.pen.Fill && this.pen.Fill.fill
                && this.pen.Fill.fill.type != FILL_TYPE_NOFILL && this.pen.Fill.fill.type != FILL_TYPE_NONE)
                || (this.brush && this.brush.fill && this.brush.fill
                && this.brush.fill.type != FILL_TYPE_NOFILL && this.brush.fill.type != FILL_TYPE_NONE) )
    },

    DrawInTrack: function(graphics)
    {
        if(this.checkDrawGeometry())
        {
            this.Draw(graphics);
        }
        else
        {
            graphics.SetIntegerGrid(false);
            graphics.transform3(this.TransformMatrix);
            graphics._m(0, 0);
            graphics._l(this.ext.cx*100, 0);
            graphics._l(this.ext.cx*100, this.ext.cy*100);
            graphics._l(0, this.ext.cy*100);
            graphics._z();
            graphics.p_color(0,0,0,160);
            graphics.p_width(500);
            graphics.ds();
            graphics.b_color1(255,255,255,128);
            graphics.df();
        }
    },


    isEmptyPlaceholder : function()
    {
        if(this.isPlaceholder())
        {
            if(this.nvSpPr.nvPr.ph.type == phType_title
                || this.nvSpPr.nvPr.ph.type == phType_ctrTitle
                || this.nvSpPr.nvPr.ph.type == phType_body
                || this.nvSpPr.nvPr.ph.type == phType_subTitle
                || this.nvSpPr.nvPr.ph.type == null
                || this.nvSpPr.nvPr.ph.type == phType_dt
                || this.nvSpPr.nvPr.ph.type == phType_ftr
                || this.nvSpPr.nvPr.ph.type == phType_hdr
                || this.nvSpPr.nvPr.ph.type == phType_sldNum
                || this.nvSpPr.nvPr.ph.type == phType_sldImg)
            {
                if(this.txBody)
                {
                    if(this.txBody.content)
                    {
                        return this.txBody.content.Is_Empty();
                    }
                    return true;
                }
                return true;
            }
            if(this.nvSpPr.nvPr.ph.type == phType_chart
                || this.nvSpPr.nvPr.ph.type == phType_media)
            {
                return true;
            }
            if(this.nvSpPr.nvPr.ph.type == phType_pic)
            {
                var _b_empty_text = true;
                if(this.txBody)
                {
                    if(this.txBody.content)
                    {
                        _b_empty_text = this.txBody.content.Is_Empty();
                    }
                }
                return (_b_empty_text && (this.brush == null || this.brush.fill == null));
            }
        }
        else
        {
            return false;
        }
    },

    getCurDocumentContent : function()
    {
        if(this.txBody)
        {
            return this.txBody.content;
        }
        return null;
    },

    DrawAdj: function(graphics,zoom)
    {
        if(this.geometry && this.ext.cx>min_size&&this.ext.cy>min_size)
        {
            graphics.SetIntegerGrid(false);
            graphics.reset();
            graphics.transform3(this.TransformMatrix);

            var d=30000/zoom;
            graphics.b_color1(254, 251, 132, 255);
            for(var i=0; i<this.geometry.ahXYLst.length; i++)
            {
                diamond(graphics, this.geometry.ahXYLst[i].posX*100, this.geometry.ahXYLst[i].posY*100, d);
            }
            for(i=0; i<this.geometry.ahPolarLst.length; i++)
            {
                diamond(graphics, this.geometry.ahPolarLst[i].posX*100, this.geometry.ahPolarLst[i].posY*100, d);
            }
            graphics.reset();
        }

    },

    DrawAdjInGroup: function(graphics, transform,zoom)
    {
        if(this.geometry && this.ext.cx>min_size&&this.ext.cy>min_size) {

            graphics.SetIntegerGrid(false);
            graphics.reset();
            graphics.transform3(transform);

            var d=30000/zoom;
            graphics.b_color1(254, 251, 132, 255);
            for(var i=0; i<this.geometry.ahXYLst.length; i++)
            {
                diamond(graphics, this.geometry.ahXYLst[i].posX*100, this.geometry.ahXYLst[i].posY*100, d);
            }
            for(i=0; i<this.geometry.ahPolarLst.length; i++) {

                diamond(graphics, this.geometry.ahPolarLst[i].posX*100, this.geometry.ahPolarLst[i].posY*100, d);
            }

            graphics.reset();
        }

    },

    Move: function(pH, pV)
    {
        this.pH=pH;
        this.pV=pV;
        this.RecalculateTransformMatrix();
    },

    copyTransform : function(group)
    {

        var historyData = {};
        historyData.old_ext = clonePrototype(this.ext);
        historyData.old_off = clonePrototype(this.off);
        historyData.old_pH = this.pH;
        historyData.old_pV = this.pV;
        historyData.old_flipH = this.flipH;
        historyData.old_flipV = this.flipV;

        historyData.new_ext = clonePrototype(group.ext);
        historyData.new_off = clonePrototype(group.off);
        historyData.new_pH = group.pH;
        historyData.new_pV = group.pV;
        historyData.new_flipH = group.flipH;
        historyData.new_flipV = group.flipV;

        historyData.undo_function = function(data)
        {
            this.ext = clonePrototype(data.old_ext);
            this.off = clonePrototype(data.old_off);
            this.pH = data.old_pH;
            this.pV = data.old_pV;
            this.flipH = data.old_flipH;
            this.flipV = data.old_flipV;
            this.Recalculate();
            this.updateCursorTypes();
        };

        historyData.redo_function = function(data)
        {
            this.ext = clonePrototype(data.new_ext);
            this.off = clonePrototype(data.new_off);
            this.pH = data.new_pH;
            this.pV = data.new_pV;
            this.flipH = data.new_flipH;
            this.flipV = data.new_flipV;
            this.Recalculate();
            this.updateCursorTypes();
        };

        History.Add(this, historyData);
        this.pH = group.pH;
        this.pV = group.pV;
        this.ext = clonePrototype(group.ext);
        this.off = clonePrototype(group.off);
        this.flipH = group.flipH;
        this.flipV = group.flipV;

    },

    RecalculateTransformMatrix: function()
    {
        this.TransformMatrix = this.getTransform();
        if(this.txBody)
        {
            this.txBody.calculateTransformMatrix();
        }
        if(this.TransformTextMatrix != undefined)
        {
            this.Container.DrawingDocument.UpdateTargetTransform(this.TransformTextMatrix);
        }
    },


    createDuplicateForTrack : function(container)
    {
        var _duplicate = new CShape(this.parent);
        _duplicate.setContainer(container);
        if(this.geometry != null)
        {
            _duplicate.geometry = this.geometry.createDuplicateForTrack();
        }
        _duplicate.pH = this.pH;
        _duplicate.pV = this.pV;
        _duplicate.ext.cx = this.ext.cx;
        _duplicate.ext.cy = this.ext.cy;
        _duplicate.rot = this.rot;
        _duplicate.flipH = this.flipH;
        _duplicate.flipV = this.flipV;
       // _duplicate.TransformMatrix = this.TransformMatrix.CreateDublicate();
        if(this.brush != null)
        {
            _duplicate.brush = this.brush.createDuplicate();
        }
        if(this.pen != null)
        {
            _duplicate.pen = this.pen.createDuplicate();
        }
        return _duplicate;
    },

    getTransform : function()
    {
        var  hc, vc;
        hc = this.ext.cx*0.5;
        vc = this.ext.cy*0.5;

        var xc, yc;
        xc = this.pH  + hc;
        yc = this.pV  + vc;

        var localTransform = new CMatrixL();
        global_MatrixTransformer.TranslateAppend(localTransform, this.pH, this.pV);
        global_MatrixTransformer.TranslateAppend(localTransform, -xc, -yc);

        if(this.flipH)
        {
            global_MatrixTransformer.ScaleAppend(localTransform, -1, 1);
        }
        if(this.flipV)
        {
            global_MatrixTransformer.ScaleAppend(localTransform, 1, -1);
        }

        global_MatrixTransformer.RotateRadAppend(localTransform, -this.rot);

        global_MatrixTransformer.TranslateAppend(localTransform, xc, yc);

        var tmp = this.Container.getTransform();
        global_MatrixTransformer.MultiplyAppend(localTransform, tmp);
        return localTransform;
    },

    GetTransformForTexture: function()
    {
        var  hc, vc;
        hc = this.ext.cx*0.5;
        vc = this.ext.cy*0.5;

        var localTransform = new CMatrixL();
        global_MatrixTransformer.TranslateAppend(localTransform, this.pH, this.pV);
        global_MatrixTransformer.TranslateAppend(localTransform, -hc, -vc);

        if(this.flipH)
        {
            global_MatrixTransformer.ScaleAppend(localTransform, -1, 1);
        }
        if(this.flipV)
        {
            global_MatrixTransformer.ScaleAppend(localTransform, 1, -1);
        }

        global_MatrixTransformer.TranslateAppend(localTransform, hc, vc);
        return localTransform;
    },

    Resize: function(num, kd1, kd2)
    {
        this.changed = true;
        var xfp, yfp;//координаты неподвижной точки
        var hc, vc, sin, cos, tw, th;
        hc=this.ext.cx*0.5;
        vc=this.ext.cy*0.5;
        sin=Math.sin(this.rot);
        cos=Math.cos(this.rot);
        var cx, cy;
        cx=this.ext.cx;
        cy=this.ext.cy;
        if(this.IsLine() && cx==0)
            cx=0.1;
        if(this.IsLine() && cy==0)
            cy=0.1;
        if(!this.flipH&&!this.flipV)
        {
            switch(num)
            {
                case 0:
                {
                    xfp=(hc*cos-vc*sin)+hc+this.pH+this.off.x;
                    yfp=(hc*sin+vc*cos)+vc+this.pV+this.off.y;

                    tw=cx*kd1;
                    th=cy*kd2;

                    if(tw>0)
                        if(tw>min_size2||this.IsLine())
                            this.ext.cx=tw;
                        else
                            this.ext.cx=min_size2;
                    else
                    {
                        this.flipH=!this.flipH;
                        if(tw<-min_size2||this.IsLine())
                            this.ext.cx=-tw;
                        else
                            this.ext.cx=min_size2;
                    }

                    if(th>0)
                        if(th>min_size2||this.IsLine())
                            this.ext.cy=th;
                        else
                            this.ext.cy=min_size2;
                    else
                    {
                        this.flipV=!this.flipV;
                        if(th<-min_size2||this.IsLine())
                            this.ext.cy=-th;
                        else
                            this.ext.cy=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                    if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    else if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    else if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    else if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    break;
                }
                case 1:
                {
                    xfp=(hc*cos-vc*sin)+hc+this.pH+this.off.x;
                    yfp=(hc*sin+vc*cos)+vc+this.pV+this.off.y;

                    th=cy*kd1;

                    if(th>0)
                        if(th>min_size2||this.IsLine())
                            this.ext.cy=th;
                        else
                            this.ext.cy=min_size2;
                    else
                    {
                        this.flipV=!this.flipV;
                        if(th<-min_size2||this.IsLine())
                            this.ext.cy=-th;
                        else
                            this.ext.cy=min_size2;
                    }

                    vc=this.ext.cy*0.5;
                    if(!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    else
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    break;
                }

                case 2:
                {
                    xfp=(-hc*cos-vc*sin)+this.pH+hc+this.off.x;
                    yfp=(-hc*sin+vc*cos)+this.pV+vc+this.off.y;

                    tw=cx*kd2;
                    th=cy*kd1;

                    if(tw>0)
                        if(tw>min_size2||this.IsLine())
                            this.ext.cx=tw;
                        else
                            this.ext.cx=min_size2;
                    else
                    {
                        this.flipH=!this.flipH;
                        if(tw<-min_size2||this.IsLine())
                            this.ext.cx=-tw;
                        else
                            this.ext.cx=min_size2;
                    }

                    if(th>0)
                        if(th>min_size2||this.IsLine())
                            this.ext.cy=th;
                        else
                            this.ext.cy=min_size2;
                    else
                    {
                        this.flipV=!this.flipV;
                        if(th<-min_size2||this.IsLine())
                            this.ext.cy=-th;
                        else
                            this.ext.cy=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                    if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    else if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    else if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    else if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    break;
                }
                case 3:
                {
                    xfp=(-hc*cos-vc*sin)+this.pH+hc+this.off.x;
                    yfp=(-hc*sin+vc*cos)+this.pV+vc+this.off.y;
                    tw=cx*kd1;

                    if(tw>0)
                        if(tw>min_size2||this.IsLine())
                            this.ext.cx=tw;
                        else
                            this.ext.cx=min_size2;
                    else
                    {
                        this.flipH=!this.flipH;
                        if(tw<-min_size2||this.IsLine())
                            this.ext.cx=-tw;
                        else
                            this.ext.cx=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    else if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    else if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    else if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    break;
                }

                case 4:
                {
                    xfp=(-hc*cos+vc*sin)+this.pH+hc+this.off.x;
                    yfp=(-hc*sin-vc*cos)+this.pV+vc+this.off.y;

                    tw=cx*kd1;
                    th=cy*kd2;

                    if(tw>0)
                        if(tw>min_size2||this.IsLine())
                            this.ext.cx=tw;
                        else
                            this.ext.cx=min_size2;
                    else
                    {
                        this.flipH=!this.flipH;
                        if(tw<-min_size2||this.IsLine())
                            this.ext.cx=-tw;
                        else
                            this.ext.cx=min_size2;
                    }

                    if(th>0)
                        if(th>min_size2||this.IsLine())
                            this.ext.cy=th;
                        else
                            this.ext.cy=min_size2;
                    else
                    {
                        this.flipV=!this.flipV;
                        if(th<-min_size2||this.IsLine())
                            this.ext.cy=-th;
                        else
                            this.ext.cy=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                    if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    else if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    else if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    else if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    break;
                }
                case 5:
                {
                    xfp=(-hc*cos+vc*sin)+this.pH+hc+this.off.x;
                    yfp=(-hc*sin-vc*cos)+this.pV+vc+this.off.y;

                    th=cy*kd1;
                    if(th>0)
                        if(th>min_size2||this.IsLine())
                            this.ext.cy=th;
                        else
                            this.ext.cy=min_size2;
                    else
                    {
                        this.flipV=!this.flipV;
                        if(th<-min_size2||this.IsLine())
                            this.ext.cy=-th;
                        else
                            this.ext.cy=min_size2;
                    }

                    vc=this.ext.cy*0.5;
                    if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    else if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    else if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    else if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    break;
                }

                case 6:
                {
                    xfp=(hc*cos+vc*sin)+this.pH+hc+this.off.x;
                    yfp=(hc*sin-vc*cos)+this.pV+vc+this.off.y;

                    tw=cx*kd2;
                    th=cy*kd1;

                    if(tw>0)
                        if(tw>min_size2||this.IsLine())
                            this.ext.cx=tw;
                        else
                            this.ext.cx=min_size2;
                    else
                    {
                        this.flipH=!this.flipH;
                        if(tw<-min_size2||this.IsLine())
                            this.ext.cx=-tw;
                        else
                            this.ext.cx=min_size2;
                    }

                    if(th>0)
                        if(th>min_size2||this.IsLine())
                            this.ext.cy=th;
                        else
                            this.ext.cy=min_size2;
                    else
                    {
                        this.flipV=!this.flipV;
                        if(th<-min_size2||this.IsLine())
                            this.ext.cy=-th;
                        else
                            this.ext.cy=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                    if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    else if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    else if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    else if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    break;
                }
                case 7:
                {
                    xfp=(hc*cos+vc*sin)+this.pH+hc+this.off.x;
                    yfp=(hc*sin-vc*cos)+this.pV+vc+this.off.y;

                    tw=cx*kd1;

                    if(tw>0)
                        if(tw>min_size2||this.IsLine())
                            this.ext.cx=tw;
                        else
                            this.ext.cx=min_size2;
                    else
                    {
                        this.flipH=!this.flipH;
                        if(tw<-min_size2||this.IsLine())
                            this.ext.cx=-tw;
                        else
                            this.ext.cx=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    else if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    else if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    else if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    break;
                }
            }
        }
        else if(this.flipH&&this.flipV)
        {
            switch(num)
            {
                case 4:
                {
                    xfp=(hc*cos-vc*sin)+hc+this.pH+this.off.x;
                    yfp=(hc*sin+vc*cos)+vc+this.pV+this.off.y;

                    tw=cx*kd1;
                    th=cy*kd2;

                    if(tw>0)
                        if(tw>min_size2||this.IsLine())
                            this.ext.cx=tw;
                        else
                            this.ext.cx=min_size2;
                    else
                    {
                        this.flipH=!this.flipH;
                        if(tw<-min_size2||this.IsLine())
                            this.ext.cx=-tw;
                        else
                            this.ext.cx=min_size2;
                    }

                    if(th>0)
                        if(th>min_size2||this.IsLine())
                            this.ext.cy=th;
                        else
                            this.ext.cy=min_size2;
                    else
                    {
                        this.flipV=!this.flipV;
                        if(th<-min_size2||this.IsLine())
                            this.ext.cy=-th;
                        else
                            this.ext.cy=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                    if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    else if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    else if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    else if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    break;
                }
                case 5:
                {
                    xfp=(hc*cos-vc*sin)+hc+this.pH+this.off.x;
                    yfp=(hc*sin+vc*cos)+vc+this.pV+this.off.y;

                    th=cy*kd1;

                    if(th>0)
                        if(th>min_size2||this.IsLine())
                            this.ext.cy=th;
                        else
                            this.ext.cy=min_size2;
                    else
                    {
                        this.flipV=!this.flipV;
                        if(th<-min_size2||this.IsLine())
                            this.ext.cy=-th;
                        else
                            this.ext.cy=min_size2;
                    }

                    vc=this.ext.cy*0.5;
                    if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    else if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    else if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    else if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    break;
                }

                case 6:
                {
                    xfp=(-hc*cos-vc*sin)+this.pH+hc+this.off.x;
                    yfp=(-hc*sin+vc*cos)+this.pV+vc+this.off.y;

                    tw=cx*kd2;
                    th=cy*kd1;

                    if(tw>0)
                        if(tw>min_size2||this.IsLine())
                            this.ext.cx=tw;
                        else
                            this.ext.cx=min_size2;
                    else
                    {
                        this.flipH=!this.flipH;
                        if(tw<-min_size2||this.IsLine())
                            this.ext.cx=-tw;
                        else
                            this.ext.cx=min_size2;
                    }

                    if(th>0)
                        if(th>min_size2||this.IsLine())
                            this.ext.cy=th;
                        else
                            this.ext.cy=min_size2;
                    else
                    {
                        this.flipV=!this.flipV;
                        if(th<-min_size2||this.IsLine())
                            this.ext.cy=-th;
                        else
                            this.ext.cy=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                    if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    else if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    else if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    else if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    break;
                }
                case 7:
                {
                    xfp=(-hc*cos-vc*sin)+this.pH+hc+this.off.x;
                    yfp=(-hc*sin+vc*cos)+this.pV+vc+this.off.y;
                    tw=cx*kd1;

                    if(tw>0)
                        if(tw>min_size2||this.IsLine())
                            this.ext.cx=tw;
                        else
                            this.ext.cx=min_size2;
                    else
                    {
                        this.flipH=!this.flipH;
                        if(tw<-min_size2||this.IsLine())
                            this.ext.cx=-tw;
                        else
                            this.ext.cx=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    else if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    else if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    else if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    break;
                }

                case 0:
                {
                    xfp=(-hc*cos+vc*sin)+this.pH+hc+this.off.x;
                    yfp=(-hc*sin-vc*cos)+this.pV+vc+this.off.y;

                    tw=cx*kd1;
                    th=cy*kd2;

                    if(tw>0)
                        if(tw>min_size2||this.IsLine())
                            this.ext.cx=tw;
                        else
                            this.ext.cx=min_size2;
                    else
                    {
                        this.flipH=!this.flipH;
                        if(tw<-min_size2||this.IsLine())
                            this.ext.cx=-tw;
                        else
                            this.ext.cx=min_size2;
                    }

                    if(th>0)
                        if(th>min_size2||this.IsLine())
                            this.ext.cy=th;
                        else
                            this.ext.cy=min_size2;
                    else
                    {
                        this.flipV=!this.flipV;
                        if(th<-min_size2||this.IsLine())
                            this.ext.cy=-th;
                        else
                            this.ext.cy=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                    if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    else if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    else if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    else if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    break;
                }
                case 1:
                {
                    xfp=(-hc*cos+vc*sin)+this.pH+hc+this.off.x;
                    yfp=(-hc*sin-vc*cos)+this.pV+vc+this.off.y;

                    th=cy*kd1;
                    if(th>0)
                        if(th>min_size2||this.IsLine())
                            this.ext.cy=th;
                        else
                            this.ext.cy=min_size2;
                    else
                    {
                        this.flipV=!this.flipV;
                        if(th<-min_size2||this.IsLine())
                            this.ext.cy=-th;
                        else
                            this.ext.cy=min_size2;
                    }

                    vc=this.ext.cy*0.5;
                    if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    else if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    else if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    else if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    break;
                }

                case 2:
                {
                    xfp=(hc*cos+vc*sin)+this.pH+hc+this.off.x;
                    yfp=(hc*sin-vc*cos)+this.pV+vc+this.off.y;

                    tw=cx*kd2;
                    th=cy*kd1;

                    if(tw>0)
                        if(tw>min_size2||this.IsLine())
                            this.ext.cx=tw;
                        else
                            this.ext.cx=min_size2;
                    else
                    {
                        this.flipH=!this.flipH;
                        if(tw<-min_size2||this.IsLine())
                            this.ext.cx=-tw;
                        else
                            this.ext.cx=min_size2;
                    }

                    if(th>0)
                        if(th>min_size2||this.IsLine())
                            this.ext.cy=th;
                        else
                            this.ext.cy=min_size2;
                    else
                    {
                        this.flipV=!this.flipV;
                        if(th<-min_size2||this.IsLine())
                            this.ext.cy=-th;
                        else
                            this.ext.cy=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                    if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    else if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    else if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    else if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    break;
                }

                case 3:
                {
                    xfp=(hc*cos+vc*sin)+this.pH+hc+this.off.x;
                    yfp=(hc*sin-vc*cos)+this.pV+vc+this.off.y;

                    tw=cx*kd1;

                    if(tw>0)
                        if(tw>min_size2||this.IsLine())
                            this.ext.cx=tw;
                        else
                            this.ext.cx=min_size2;
                    else
                    {
                        this.flipH=!this.flipH;
                        if(tw<-min_size2||this.IsLine())
                            this.ext.cx=-tw;
                        else
                            this.ext.cx=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    else if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    else if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    else if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    break;
                }
            }
        }
        else if(this.flipH&&!this.flipV)
        {
            switch(num)
            {
                case 2:
                {
                    xfp=(hc*cos-vc*sin)+hc+this.pH+this.off.x;
                    yfp=(hc*sin+vc*cos)+vc+this.pV+this.off.y;

                    tw=cx*kd1;
                    th=cy*kd2;

                    if(tw>0)
                        if(tw>min_size2||this.IsLine())
                            this.ext.cx=tw;
                        else
                            this.ext.cx=min_size2;
                    else
                    {
                        this.flipH=!this.flipH;
                        if(tw<-min_size2||this.IsLine())
                            this.ext.cx=-tw;
                        else
                            this.ext.cx=min_size2;
                    }

                    if(th>0)
                        if(th>min_size2||this.IsLine())
                            this.ext.cy=th;
                        else
                            this.ext.cy=min_size2;
                    else
                    {
                        this.flipV=!this.flipV;
                        if(th<-min_size2||this.IsLine())
                            this.ext.cy=-th;
                        else
                            this.ext.cy=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                    if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    else if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    else if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    else if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    break;
                }
                case 1:
                {
                    xfp=(hc*cos-vc*sin)+hc+this.pH+this.off.x;
                    yfp=(hc*sin+vc*cos)+vc+this.pV+this.off.y;

                    th=cy*kd1;

                    if(th>0)
                        if(th>min_size2||this.IsLine())
                            this.ext.cy=th;
                        else
                            this.ext.cy=min_size2;
                    else
                    {
                        this.flipV=!this.flipV;
                        if(th<-min_size2||this.IsLine())
                            this.ext.cy=-th;
                        else
                            this.ext.cy=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                    if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    else if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    else if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    else if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    break;
                }

                case 0:
                {
                    xfp=(-hc*cos-vc*sin)+this.pH+hc+this.off.x;
                    yfp=(-hc*sin+vc*cos)+this.pV+vc+this.off.y;

                    tw=cx*kd2;
                    th=cy*kd1;

                    if(tw>0)
                        if(tw>min_size2||this.IsLine())
                            this.ext.cx=tw;
                        else
                            this.ext.cx=min_size2;
                    else
                    {
                        this.flipH=!this.flipH;
                        if(tw<-min_size2||this.IsLine())
                            this.ext.cx=-tw;
                        else
                            this.ext.cx=min_size2;
                    }

                    if(th>0)
                        if(th>min_size2||this.IsLine())
                            this.ext.cy=th;
                        else
                            this.ext.cy=min_size2;
                    else
                    {
                        this.flipV=!this.flipV;
                        if(th<-min_size2||this.IsLine())
                            this.ext.cy=-th;
                        else
                            this.ext.cy=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                    if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    else if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    else if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    else if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    break;
                }
                case 7:
                {
                    xfp=(-hc*cos-vc*sin)+this.pH+hc+this.off.x;
                    yfp=(-hc*sin+vc*cos)+this.pV+vc+this.off.y;
                    tw=cx*kd1;

                    if(tw>0)
                        if(tw>min_size2||this.IsLine())
                            this.ext.cx=tw;
                        else
                            this.ext.cx=min_size2;
                    else
                    {
                        this.flipH=!this.flipH;
                        if(tw<-min_size2||this.IsLine())
                            this.ext.cx=-tw;
                        else
                            this.ext.cx=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                    if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    else if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    else if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    else if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    break;
                }

                case 6:
                {
                    xfp=(-hc*cos+vc*sin)+this.pH+hc+this.off.x;
                    yfp=(-hc*sin-vc*cos)+this.pV+vc+this.off.y;

                    tw=cx*kd1;
                    th=cy*kd2;

                    if(tw>0)
                        if(tw>min_size2||this.IsLine())
                            this.ext.cx=tw;
                        else
                            this.ext.cx=min_size2;
                    else
                    {
                        this.flipH=!this.flipH;
                        if(tw<-min_size2||this.IsLine())
                            this.ext.cx=-tw;
                        else
                            this.ext.cx=min_size2;
                    }

                    if(th>0)
                        if(th>min_size2||this.IsLine())
                            this.ext.cy=th;
                        else
                            this.ext.cy=min_size2;
                    else
                    {
                        this.flipV=!this.flipV;
                        if(th<-min_size2||this.IsLine())
                            this.ext.cy=-th;
                        else
                            this.ext.cy=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                    if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    else if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    else if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    else if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    break;
                }
                case 5:
                {
                    xfp=(-hc*cos+vc*sin)+this.pH+hc+this.off.x;
                    yfp=(-hc*sin-vc*cos)+this.pV+vc+this.off.y;

                    th=cy*kd1;
                    if(th>0)
                        if(th>min_size2||this.IsLine())
                            this.ext.cy=th;
                        else
                            this.ext.cy=min_size2;
                    else
                    {
                        this.flipV=!this.flipV;
                        if(th<-min_size2||this.IsLine())
                            this.ext.cy=-th;
                        else
                            this.ext.cy=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                    if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    else if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    else if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    else if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    break;
                }

                case 4:
                {
                    xfp=(hc*cos+vc*sin)+this.pH+hc+this.off.x;
                    yfp=(hc*sin-vc*cos)+this.pV+vc+this.off.y;

                    tw=cx*kd2;
                    th=cy*kd1;

                    if(tw>0)
                        if(tw>min_size2||this.IsLine())
                            this.ext.cx=tw;
                        else
                            this.ext.cx=min_size2;
                    else
                    {
                        this.flipH=!this.flipH;
                        if(tw<-min_size2||this.IsLine())
                            this.ext.cx=-tw;
                        else
                            this.ext.cx=min_size2;
                    }

                    if(th>0)
                        if(th>min_size2||this.IsLine())
                            this.ext.cy=th;
                        else
                            this.ext.cy=min_size2;
                    else
                    {
                        this.flipV=!this.flipV;
                        if(th<-min_size2||this.IsLine())
                            this.ext.cy=-th;
                        else
                            this.ext.cy=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                    if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    else if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    else if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    else if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    break;
                }

                case 3:
                {
                    xfp=(hc*cos+vc*sin)+this.pH+hc+this.off.x;
                    yfp=(hc*sin-vc*cos)+this.pV+vc+this.off.y;

                    tw=cx*kd1;

                    if(tw>0)
                        if(tw>min_size2||this.IsLine())
                            this.ext.cx=tw;
                        else
                            this.ext.cx=min_size2;
                    else
                    {
                        this.flipH=!this.flipH;
                        if(tw<-min_size2||this.IsLine())
                            this.ext.cx=-tw;
                        else
                            this.ext.cx=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                    if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    else if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    else if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    else if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    break;
                }
            }
        }
        else if(!this.flipH&&this.flipV)
        {
            switch(num)
            {
                case 6:
                {
                    xfp=(hc*cos-vc*sin)+hc+this.pH+this.off.x;
                    yfp=(hc*sin+vc*cos)+vc+this.pV+this.off.y;

                    tw=cx*kd1;
                    th=cy*kd2;

                    if(tw>0)
                        if(tw>min_size2||this.IsLine())
                            this.ext.cx=tw;
                        else
                            this.ext.cx=min_size2;
                    else
                    {
                        this.flipH=!this.flipH;
                        if(tw<-min_size2||this.IsLine())
                            this.ext.cx=-tw;
                        else
                            this.ext.cx=min_size2;
                    }

                    if(th>0)
                        if(th>min_size2||this.IsLine())
                            this.ext.cy=th;
                        else
                            this.ext.cy=min_size2;
                    else
                    {
                        this.flipV=!this.flipV;
                        if(th<-min_size2||this.IsLine())
                            this.ext.cy=-th;
                        else
                            this.ext.cy=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                    if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    else if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    else if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    else if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    break;
                }
                case 5:
                {
                    xfp=(hc*cos-vc*sin)+hc+this.pH+this.off.x;
                    yfp=(hc*sin+vc*cos)+vc+this.pV+this.off.y;

                    th=cy*kd1;

                    if(th>0)
                        if(th>min_size2||this.IsLine())
                            this.ext.cy=th;
                        else
                            this.ext.cy=min_size2;
                    else
                    {
                        this.flipV=!this.flipV;
                        if(th<-min_size2||this.IsLine())
                            this.ext.cy=-th;
                        else
                            this.ext.cy=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                    if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    else if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    else if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    else if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    break;
                }

                case 4:
                {
                    xfp=(-hc*cos-vc*sin)+this.pH+hc+this.off.x;
                    yfp=(-hc*sin+vc*cos)+this.pV+vc+this.off.y;

                    tw=cx*kd2;
                    th=cy*kd1;

                    if(tw>0)
                        if(tw>min_size2||this.IsLine())
                            this.ext.cx=tw;
                        else
                            this.ext.cx=min_size2;
                    else
                    {
                        this.flipH=!this.flipH;
                        if(tw<-min_size2||this.IsLine())
                            this.ext.cx=-tw;
                        else
                            this.ext.cx=min_size2;
                    }

                    if(th>0)
                        if(th>min_size2||this.IsLine())
                            this.ext.cy=th;
                        else
                            this.ext.cy=min_size2;
                    else
                    {
                        this.flipV=!this.flipV;
                        if(th<-min_size2||this.IsLine())
                            this.ext.cy=-th;
                        else
                            this.ext.cy=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                    if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    else if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    else if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    else if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    break;
                }
                case 3:
                {
                    xfp=(-hc*cos-vc*sin)+this.pH+hc+this.off.x;
                    yfp=(-hc*sin+vc*cos)+this.pV+vc+this.off.y;
                    tw=cx*kd1;

                    if(tw>0)
                        if(tw>min_size2||this.IsLine())
                            this.ext.cx=tw;
                        else
                            this.ext.cx=min_size2;
                    else
                    {
                        this.flipH=!this.flipH;
                        if(tw<-min_size2||this.IsLine())
                            this.ext.cx=-tw;
                        else
                            this.ext.cx=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                    if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    else if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    else if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    else if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    break;
                }

                case 2:
                {
                    xfp=(-hc*cos+vc*sin)+this.pH+hc+this.off.x;
                    yfp=(-hc*sin-vc*cos)+this.pV+vc+this.off.y;

                    tw=cx*kd1;
                    th=cy*kd2;

                    if(tw>0)
                        if(tw>min_size2||this.IsLine())
                            this.ext.cx=tw;
                        else
                            this.ext.cx=min_size2;
                    else
                    {
                        this.flipH=!this.flipH;
                        if(tw<-min_size2||this.IsLine())
                            this.ext.cx=-tw;
                        else
                            this.ext.cx=min_size2;
                    }

                    if(th>0)
                        if(th>min_size2||this.IsLine())
                            this.ext.cy=th;
                        else
                            this.ext.cy=min_size2;
                    else
                    {
                        this.flipV=!this.flipV;
                        if(th<-min_size2||this.IsLine())
                            this.ext.cy=-th;
                        else
                            this.ext.cy=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                    if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    else if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    else if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    else if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    break;
                }
                case 1:
                {
                    xfp=(-hc*cos+vc*sin)+this.pH+hc+this.off.x;
                    yfp=(-hc*sin-vc*cos)+this.pV+vc+this.off.y;

                    th=cy*kd1;
                    if(th>0)
                        if(th>min_size2||this.IsLine())
                            this.ext.cy=th;
                        else
                            this.ext.cy=min_size2;
                    else
                    {
                        this.flipV=!this.flipV;
                        if(th<-min_size2||this.IsLine())
                            this.ext.cy=-th;
                        else
                            this.ext.cy=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                    if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    else if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    else if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    else if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    break;
                }

                case 0:
                {
                    xfp=(hc*cos+vc*sin)+this.pH+hc+this.off.x;
                    yfp=(hc*sin-vc*cos)+this.pV+vc+this.off.y;

                    tw=cx*kd2;
                    th=cy*kd1;

                    if(tw>0)
                        if(tw>min_size2||this.IsLine())
                            this.ext.cx=tw;
                        else
                            this.ext.cx=min_size2;
                    else
                    {
                        this.flipH=!this.flipH;
                        if(tw<-min_size2||this.IsLine())
                            this.ext.cx=-tw;
                        else
                            this.ext.cx=min_size2;
                    }

                    if(th>0)
                        if(th>min_size2||this.IsLine())
                            this.ext.cy=th;
                        else
                            this.ext.cy=min_size2;
                    else
                    {
                        this.flipV=!this.flipV;
                        if(th<-min_size2||this.IsLine())
                            this.ext.cy=-th;
                        else
                            this.ext.cy=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                    if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    else if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    else if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    else if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    break;
                }

                case 7:
                {
                    xfp=(hc*cos+vc*sin)+this.pH+hc+this.off.x;
                    yfp=(hc*sin-vc*cos)+this.pV+vc+this.off.y;

                    tw=cx*kd1;

                    if(tw>0)
                        if(tw>min_size2||this.IsLine())
                            this.ext.cx=tw;
                        else
                            this.ext.cx=min_size2;
                    else
                    {
                        this.flipH=!this.flipH;
                        if(tw<-min_size2||this.IsLine())
                            this.ext.cx=-tw;
                        else
                            this.ext.cx=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                    if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    else if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    else if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    else if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    break;
                }
            }
        }
        this.Recalculate();
    },

    ResizeRelativeCenter: function(num, kd1, kd2)
    {
        var xfp, yfp;//координаты неподвижной точки
        var hc, vc, tw, th;
        hc=this.ext.cx*0.5;
        vc=this.ext.cy*0.5;
        xfp=hc+this.pH+this.off.x;
        yfp=vc+this.pV+this.off.y;

        if( (!this.flipH&&!this.flipV)
            || (this.flipH&&this.flipV) ) {

            switch(num)
            {
                case 0:
                case 4:
                {
                    tw=this.ext.cx*(2*kd1-1);
                    th=this.ext.cy*(2*kd2-1);

                    if(tw>0)
                        if(tw>min_size2||this.IsLine())
                            this.ext.cx=tw;
                        else
                            this.ext.cx=min_size2;
                    else
                    {
                        this.flipH=!this.flipH;
                        if(tw<-min_size2||this.IsLine())
                            this.ext.cx=-tw;
                        else
                            this.ext.cx=min_size2;
                    }

                    if(th>0)
                        if(th>min_size2||this.IsLine())
                            this.ext.cy=th;
                        else
                            this.ext.cy=min_size2;
                    else
                    {
                        this.flipV=!this.flipV;
                        if(th<-min_size2||this.IsLine())
                            this.ext.cy=-th;
                        else
                            this.ext.cy=min_size2;
                    }
                    break;
                }
                case 1:
                case 5:
                {
                    th=this.ext.cy*(2*kd1-1);
                    if(th>0)
                        if(th>min_size2||this.IsLine())
                            this.ext.cy=th;
                        else
                            this.ext.cy=min_size2;
                    else
                    {
                        this.flipV=!this.flipV;
                        if(th<-min_size2||this.IsLine())
                            this.ext.cy=-th;
                        else
                            this.ext.cy=min_size2;
                    }
                    break;
                }

                case 2:
                case 6:
                {
                    tw=this.ext.cx*(2*kd2-1);
                    th=this.ext.cy*(2*kd1-1);
                    if(tw>0)
                        if(tw>min_size2||this.IsLine())
                            this.ext.cx=tw;
                        else
                            this.ext.cx=min_size2;
                    else
                    {
                        this.flipH=!this.flipH;
                        if(tw<-min_size2||this.IsLine())
                            this.ext.cx=-tw;
                        else
                            this.ext.cx=min_size2;
                    }

                    if(th>0)
                        if(th>min_size2||this.IsLine())
                            this.ext.cy=th;
                        else
                            this.ext.cy=min_size2;
                    else
                    {
                        this.flipV=!this.flipV;
                        if(th<-min_size2||this.IsLine())
                            this.ext.cy=-th;
                        else
                            this.ext.cy=min_size2;
                    }

                    break;
                }
                case 3:
                case 7:
                {
                    tw=this.ext.cx*(2*kd1-1);
                    if(tw>0)
                        if(tw>min_size2||this.IsLine())
                            this.ext.cx=tw;
                        else
                            this.ext.cx=min_size2;
                    else
                    {
                        this.flipH=!this.flipH;
                        if(tw<-min_size2||this.IsLine())
                            this.ext.cx=-tw;
                        else
                            this.ext.cx=min_size2;
                    }

                    break;
                }
            }
        }
        else {

            switch(num) {

                case 2:
                case 6:
                {
                    tw=this.ext.cx*(2*kd1-1);
                    th=this.ext.cy*(2*kd2-1);

                    if(tw>0)
                        if(tw>min_size2||this.IsLine())
                            this.ext.cx=tw;
                        else
                            this.ext.cx=min_size2;
                    else
                    {
                        this.flipH=!this.flipH;
                        if(tw<-min_size2||this.IsLine())
                            this.ext.cx=-tw;
                        else
                            this.ext.cx=min_size2;
                    }

                    if(th>0)
                        if(th>min_size2||this.IsLine())
                            this.ext.cy=th;
                        else
                            this.ext.cy=min_size2;
                    else
                    {
                        this.flipV=!this.flipV;
                        if(th<-min_size2||this.IsLine())
                            this.ext.cy=-th;
                        else
                            this.ext.cy=min_size2;
                    }

                    break;
                }
                case 1:
                case 5:
                {
                    th=this.ext.cy*(2*kd1-1);

                    if(th>0)
                        if(th>min_size2||this.IsLine())
                            this.ext.cy=th;
                        else
                            this.ext.cy=min_size2;
                    else
                    {
                        this.flipV=!this.flipV;
                        if(th<-min_size2||this.IsLine())
                            this.ext.cy=-th;
                        else
                            this.ext.cy=min_size2;
                    }

                    break;
                }

                case 0:
                case 4:
                {

                    tw=this.ext.cx*(2*kd2-1);
                    th=this.ext.cy*(2*kd1-1);

                    if(tw>0)
                        if(tw>min_size2||this.IsLine())
                            this.ext.cx=tw;
                        else
                            this.ext.cx=min_size2;
                    else
                    {
                        this.flipH=!this.flipH;
                        if(tw<-min_size2||this.IsLine())
                            this.ext.cx=-tw;
                        else
                            this.ext.cx=min_size2;
                    }

                    if(th>0)
                        if(th>min_size2||this.IsLine())
                            this.ext.cy=th;
                        else
                            this.ext.cy=min_size2;
                    else
                    {
                        this.flipV=!this.flipV;
                        if(th<-min_size2||this.IsLine())
                            this.ext.cy=-th;
                        else
                            this.ext.cy=min_size2;
                    }


                    break;
                }
                case 7:
                case 3:
                {
                    tw=this.ext.cx*(2*kd1-1);

                    if(tw>0)
                        if(tw>min_size2||this.IsLine())
                            this.ext.cx=tw;
                        else
                            this.ext.cx=min_size2;
                    else
                    {
                        this.flipH=!this.flipH;
                        if(tw<-min_size2||this.IsLine())
                            this.ext.cx=-tw;
                        else
                            this.ext.cx=min_size2;
                    }

                    break;
                }


            }
        }

        this.pH=xfp-this.ext.cx*0.5;
        this.pV=yfp-this.ext.cy*0.5;
        this.Recalculate();
    },

    ResizeProport: function(num, k)
    {
        var xfp, yfp;//координаты неподвижной точки
        var hc, vc, sin, cos, tw, th;
        hc=this.ext.cx*0.5;
        vc=this.ext.cy*0.5;
        sin=Math.sin(this.rot);
        cos=Math.cos(this.rot);
        if(!this.flipH&&!this.flipV)
        {
            switch(num)
            {
                case 0:
                {
                    xfp=(hc*cos-vc*sin)+hc+this.pH+this.off.x;
                    yfp=(hc*sin+vc*cos)+vc+this.pV+this.off.y;

                    tw=this.ext.cx*k;
                    th=this.ext.cy*k;

                    if(tw>0)
                        if(tw>min_size2||this.IsLine())
                            this.ext.cx=tw;
                        else
                            this.ext.cx=min_size2;
                    else
                    {
                        this.flipH=!this.flipH;
                        if(tw<-min_size2||this.IsLine())
                            this.ext.cx=-tw;
                        else
                            this.ext.cx=min_size2;
                    }

                    if(th>0)
                        if(th>min_size2||this.IsLine())
                            this.ext.cy=th;
                        else
                            this.ext.cy=min_size2;
                    else
                    {
                        this.flipV=!this.flipV;
                        if(th<-min_size2||this.IsLine())
                            this.ext.cy=-th;
                        else
                            this.ext.cy=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                    if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    else if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    else if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    else if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    break;
                }
                case 1:
                {
                    xfp=(hc*cos-vc*sin)+hc+this.pH+this.off.x;
                    yfp=(hc*sin+vc*cos)+vc+this.pV+this.off.y;

                    th=this.ext.cy*k;

                    if(th>0)
                        if(th>min_size2||this.IsLine())
                            this.ext.cy=th;
                        else
                            this.ext.cy=min_size2;
                    else
                    {
                        this.flipV=!this.flipV;
                        if(th<-min_size2||this.IsLine())
                            this.ext.cy=-th;
                        else
                            this.ext.cy=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                    if(!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    else
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    break;
                }

                case 2:
                {
                    xfp=(-hc*cos-vc*sin)+this.pH+hc+this.off.x;
                    yfp=(-hc*sin+vc*cos)+this.pV+vc+this.off.y;

                    tw=this.ext.cx*k;
                    th=this.ext.cy*k;

                    if(tw>0)
                        if(tw>min_size2||this.IsLine())
                            this.ext.cx=tw;
                        else
                            this.ext.cx=min_size2;
                    else
                    {
                        this.flipH=!this.flipH;
                        if(tw<-min_size2||this.IsLine())
                            this.ext.cx=-tw;
                        else
                            this.ext.cx=min_size2;
                    }

                    if(th>0)
                        if(th>min_size2||this.IsLine())
                            this.ext.cy=th;
                        else
                            this.ext.cy=min_size2;
                    else
                    {
                        this.flipV=!this.flipV;
                        if(th<-min_size2||this.IsLine())
                            this.ext.cy=-th;
                        else
                            this.ext.cy=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                    if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    else if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    else if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    else if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    break;
                }
                case 3:
                {
                    xfp=(-hc*cos-vc*sin)+this.pH+hc+this.off.x;
                    yfp=(-hc*sin+vc*cos)+this.pV+vc+this.off.y;
                    tw=this.ext.cx*k;

                    if(tw>0)
                        if(tw>min_size2||this.IsLine())
                            this.ext.cx=tw;
                        else
                            this.ext.cx=min_size2;
                    else
                    {
                        this.flipH=!this.flipH;
                        if(tw<-min_size2||this.IsLine())
                            this.ext.cx=-tw;
                        else
                            this.ext.cx=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                    if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    else if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    else if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    else if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    break;
                }

                case 4:
                {
                    xfp=(-hc*cos+vc*sin)+this.pH+hc+this.off.x;
                    yfp=(-hc*sin-vc*cos)+this.pV+vc+this.off.y;

                    tw=this.ext.cx*k;
                    th=this.ext.cy*k;

                    if(tw>0)
                        if(tw>min_size2||this.IsLine())
                            this.ext.cx=tw;
                        else
                            this.ext.cx=min_size2;
                    else
                    {
                        this.flipH=!this.flipH;
                        if(tw<-min_size2||this.IsLine())
                            this.ext.cx=-tw;
                        else
                            this.ext.cx=min_size2;
                    }

                    if(th>0)
                        if(th>min_size2||this.IsLine())
                            this.ext.cy=th;
                        else
                            this.ext.cy=min_size2;
                    else
                    {
                        this.flipV=!this.flipV;
                        if(th<-min_size2||this.IsLine())
                            this.ext.cy=-th;
                        else
                            this.ext.cy=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                    if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    else if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    else if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    else if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    break;
                }
                case 5:
                {
                    xfp=(-hc*cos+vc*sin)+this.pH+hc+this.off.x;
                    yfp=(-hc*sin-vc*cos)+this.pV+vc+this.off.y;

                    th=this.ext.cy*k;
                    if(th>0)
                        if(th>min_size2||this.IsLine())
                            this.ext.cy=th;
                        else
                            this.ext.cy=min_size2;
                    else
                    {
                        this.flipV=!this.flipV;
                        if(th<-min_size2||this.IsLine())
                            this.ext.cy=-th;
                        else
                            this.ext.cy=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                    if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    else if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    else if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    else if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    break;
                }

                case 6:
                {
                    xfp=(hc*cos+vc*sin)+this.pH+hc+this.off.x;
                    yfp=(hc*sin-vc*cos)+this.pV+vc+this.off.y;

                    tw=this.ext.cx*k;
                    th=this.ext.cy*k;

                    if(tw>0)
                        if(tw>min_size2||this.IsLine())
                            this.ext.cx=tw;
                        else
                            this.ext.cx=min_size2;
                    else
                    {
                        this.flipH=!this.flipH;
                        if(tw<-min_size2||this.IsLine())
                            this.ext.cx=-tw;
                        else
                            this.ext.cx=min_size2;
                    }

                    if(th>0)
                        if(th>min_size2||this.IsLine())
                            this.ext.cy=th;
                        else
                            this.ext.cy=min_size2;
                    else
                    {
                        this.flipV=!this.flipV;
                        if(th<-min_size2||this.IsLine())
                            this.ext.cy=-th;
                        else
                            this.ext.cy=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                    if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    else if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    else if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    else if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    break;
                }

                case 7:
                {
                    xfp=(hc*cos+vc*sin)+this.pH+hc+this.off.x;
                    yfp=(hc*sin-vc*cos)+this.pV+vc+this.off.y;

                    tw=this.ext.cx*k;

                    if(tw>0)
                        if(tw>min_size2||this.IsLine())
                            this.ext.cx=tw;
                        else
                            this.ext.cx=min_size2;
                    else
                    {
                        this.flipH=!this.flipH;
                        if(tw<-min_size2||this.IsLine())
                            this.ext.cx=-tw;
                        else
                            this.ext.cx=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                    if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    else if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    else if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    else if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    break;
                }
            }
        }
        else if(this.flipH&&this.flipV)
        {
            switch(num)
            {
                case 4:
                {
                    xfp=(hc*cos-vc*sin)+hc+this.pH+this.off.x;
                    yfp=(hc*sin+vc*cos)+vc+this.pV+this.off.y;

                    tw=this.ext.cx*k;
                    th=this.ext.cy*k;

                    if(tw>0)
                        if(tw>min_size2||this.IsLine())
                            this.ext.cx=tw;
                        else
                            this.ext.cx=min_size2;
                    else
                    {
                        this.flipH=!this.flipH;
                        if(tw<-min_size2||this.IsLine())
                            this.ext.cx=-tw;
                        else
                            this.ext.cx=min_size2;
                    }

                    if(th>0)
                        if(th>min_size2||this.IsLine())
                            this.ext.cy=th;
                        else
                            this.ext.cy=min_size2;
                    else
                    {
                        this.flipV=!this.flipV;
                        if(th<-min_size2||this.IsLine())
                            this.ext.cy=-th;
                        else
                            this.ext.cy=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                    if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    else if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    else if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    else if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    break;
                }
                case 5:
                {
                    xfp=(hc*cos-vc*sin)+hc+this.pH+this.off.x;
                    yfp=(hc*sin+vc*cos)+vc+this.pV+this.off.y;

                    th=this.ext.cy*k;

                    if(th>0)
                        if(th>min_size2||this.IsLine())
                            this.ext.cy=th;
                        else
                            this.ext.cy=min_size2;
                    else
                    {
                        this.flipV=!this.flipV;
                        if(th<-min_size2||this.IsLine())
                            this.ext.cy=-th;
                        else
                            this.ext.cy=min_size2;
                    }


                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                    if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    else if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    else if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    else if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    break;
                }

                case 6:
                {
                    xfp=(-hc*cos-vc*sin)+this.pH+hc+this.off.x;
                    yfp=(-hc*sin+vc*cos)+this.pV+vc+this.off.y;

                    tw=this.ext.cx*k;
                    th=this.ext.cy*k;

                    if(tw>0)
                        if(tw>min_size2||this.IsLine())
                            this.ext.cx=tw;
                        else
                            this.ext.cx=min_size2;
                    else
                    {
                        this.flipH=!this.flipH;
                        if(tw<-min_size2||this.IsLine())
                            this.ext.cx=-tw;
                        else
                            this.ext.cx=min_size2;
                    }

                    if(th>0)
                        if(th>min_size2||this.IsLine())
                            this.ext.cy=th;
                        else
                            this.ext.cy=min_size2;
                    else
                    {
                        this.flipV=!this.flipV;
                        if(th<-min_size2||this.IsLine())
                            this.ext.cy=-th;
                        else
                            this.ext.cy=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                    if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    else if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    else if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    else if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    break;
                }
                case 7:
                {
                    xfp=(-hc*cos-vc*sin)+this.pH+hc+this.off.x;
                    yfp=(-hc*sin+vc*cos)+this.pV+vc+this.off.y;
                    tw=this.ext.cx*k;

                    if(tw>0)
                        if(tw>min_size2||this.IsLine())
                            this.ext.cx=tw;
                        else
                            this.ext.cx=min_size2;
                    else
                    {
                        this.flipH=!this.flipH;
                        if(tw<-min_size2||this.IsLine())
                            this.ext.cx=-tw;
                        else
                            this.ext.cx=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                    if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    else if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    else if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    else if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    break;
                }

                case 0:
                {
                    xfp=(-hc*cos+vc*sin)+this.pH+hc+this.off.x;
                    yfp=(-hc*sin-vc*cos)+this.pV+vc+this.off.y;

                    tw=this.ext.cx*k;
                    th=this.ext.cy*k;

                    if(tw>0)
                        if(tw>min_size2||this.IsLine())
                            this.ext.cx=tw;
                        else
                            this.ext.cx=min_size2;
                    else
                    {
                        this.flipH=!this.flipH;
                        if(tw<-min_size2||this.IsLine())
                            this.ext.cx=-tw;
                        else
                            this.ext.cx=min_size2;
                    }

                    if(th>0)
                        if(th>min_size2||this.IsLine())
                            this.ext.cy=th;
                        else
                            this.ext.cy=min_size2;
                    else
                    {
                        this.flipV=!this.flipV;
                        if(th<-min_size2||this.IsLine())
                            this.ext.cy=-th;
                        else
                            this.ext.cy=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                    if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    else if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    else if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    else if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    break;
                }
                case 1:
                {
                    xfp=(-hc*cos+vc*sin)+this.pH+hc+this.off.x;
                    yfp=(-hc*sin-vc*cos)+this.pV+vc+this.off.y;

                    th=this.ext.cy*k;
                    if(th>0)
                        if(th>min_size2||this.IsLine())
                            this.ext.cy=th;
                        else
                            this.ext.cy=min_size2;
                    else
                    {
                        this.flipV=!this.flipV;
                        if(th<-min_size2||this.IsLine())
                            this.ext.cy=-th;
                        else
                            this.ext.cy=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                    if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    else if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    else if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    else if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    break;
                }

                case 2:
                {
                    xfp=(hc*cos+vc*sin)+this.pH+hc+this.off.x;
                    yfp=(hc*sin-vc*cos)+this.pV+vc+this.off.y;

                    tw=this.ext.cx*k;
                    th=this.ext.cy*k;

                    if(tw>0)
                        if(tw>min_size2||this.IsLine())
                            this.ext.cx=tw;
                        else
                            this.ext.cx=min_size2;
                    else
                    {
                        this.flipH=!this.flipH;
                        if(tw<-min_size2||this.IsLine())
                            this.ext.cx=-tw;
                        else
                            this.ext.cx=min_size2;
                    }

                    if(th>0)
                        if(th>min_size2||this.IsLine())
                            this.ext.cy=th;
                        else
                            this.ext.cy=min_size2;
                    else
                    {
                        this.flipV=!this.flipV;
                        if(th<-min_size2||this.IsLine())
                            this.ext.cy=-th;
                        else
                            this.ext.cy=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                    if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    else if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    else if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    else if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    break;
                }

                case 3:
                {
                    xfp=(hc*cos+vc*sin)+this.pH+hc+this.off.x;
                    yfp=(hc*sin-vc*cos)+this.pV+vc+this.off.y;

                    tw=this.ext.cx*k;

                    if(tw>0)
                        if(tw>min_size2||this.IsLine())
                            this.ext.cx=tw;
                        else
                            this.ext.cx=min_size2;
                    else
                    {
                        this.flipH=!this.flipH;
                        if(tw<-min_size2||this.IsLine())
                            this.ext.cx=-tw;
                        else
                            this.ext.cx=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                    if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    else if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    else if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    else if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    break;
                }
            }
        }
        else if(this.flipH&&!this.flipV)
        {
            switch(num)
            {
                case 2:
                {
                    xfp=(hc*cos-vc*sin)+hc+this.pH+this.off.x;
                    yfp=(hc*sin+vc*cos)+vc+this.pV+this.off.y;

                    tw=this.ext.cx*k;
                    th=this.ext.cy*k;

                    if(tw>0)
                        if(tw>min_size2||this.IsLine())
                            this.ext.cx=tw;
                        else
                            this.ext.cx=min_size2;
                    else
                    {
                        this.flipH=!this.flipH;
                        if(tw<-min_size2||this.IsLine())
                            this.ext.cx=-tw;
                        else
                            this.ext.cx=min_size2;
                    }

                    if(th>0)
                        if(th>min_size2||this.IsLine())
                            this.ext.cy=th;
                        else
                            this.ext.cy=min_size2;
                    else
                    {
                        this.flipV=!this.flipV;
                        if(th<-min_size2||this.IsLine())
                            this.ext.cy=-th;
                        else
                            this.ext.cy=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                    if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    else if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    else if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    else if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    break;
                }
                case 1:
                {
                    xfp=(hc*cos-vc*sin)+hc+this.pH+this.off.x;
                    yfp=(hc*sin+vc*cos)+vc+this.pV+this.off.y;

                    th=this.ext.cy*k;

                    if(th>0)
                        if(th>min_size2||this.IsLine())
                            this.ext.cy=th;
                        else
                            this.ext.cy=min_size2;
                    else
                    {
                        this.flipV=!this.flipV;
                        if(th<-min_size2||this.IsLine())
                            this.ext.cy=-th;
                        else
                            this.ext.cy=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                    if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    else if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    else if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    else if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    break;
                }

                case 0:
                {
                    xfp=(-hc*cos-vc*sin)+this.pH+hc+this.off.x;
                    yfp=(-hc*sin+vc*cos)+this.pV+vc+this.off.y;

                    tw=this.ext.cx*k;
                    th=this.ext.cy*k;

                    if(tw>0)
                        if(tw>min_size2||this.IsLine())
                            this.ext.cx=tw;
                        else
                            this.ext.cx=min_size2;
                    else
                    {
                        this.flipH=!this.flipH;
                        if(tw<-min_size2||this.IsLine())
                            this.ext.cx=-tw;
                        else
                            this.ext.cx=min_size2;
                    }

                    if(th>0)
                        if(th>min_size2||this.IsLine())
                            this.ext.cy=th;
                        else
                            this.ext.cy=min_size2;
                    else
                    {
                        this.flipV=!this.flipV;
                        if(th<-min_size2||this.IsLine())
                            this.ext.cy=-th;
                        else
                            this.ext.cy=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                    if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    else if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    else if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    else if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    break;
                }
                case 7:
                {
                    xfp=(-hc*cos-vc*sin)+this.pH+hc+this.off.x;
                    yfp=(-hc*sin+vc*cos)+this.pV+vc+this.off.y;
                    tw=this.ext.cx*k;

                    if(tw>0)
                        if(tw>min_size2||this.IsLine())
                            this.ext.cx=tw;
                        else
                            this.ext.cx=min_size2;
                    else
                    {
                        this.flipH=!this.flipH;
                        if(tw<-min_size2||this.IsLine())
                            this.ext.cx=-tw;
                        else
                            this.ext.cx=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                    if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    else if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    else if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    else if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    break;
                }

                case 6:
                {
                    xfp=(-hc*cos+vc*sin)+this.pH+hc+this.off.x;
                    yfp=(-hc*sin-vc*cos)+this.pV+vc+this.off.y;

                    tw=this.ext.cx*k;
                    th=this.ext.cy*k;

                    if(tw>0)
                        if(tw>min_size2||this.IsLine())
                            this.ext.cx=tw;
                        else
                            this.ext.cx=min_size2;
                    else
                    {
                        this.flipH=!this.flipH;
                        if(tw<-min_size2||this.IsLine())
                            this.ext.cx=-tw;
                        else
                            this.ext.cx=min_size2;
                    }

                    if(th>0)
                        if(th>min_size2||this.IsLine())
                            this.ext.cy=th;
                        else
                            this.ext.cy=min_size2;
                    else
                    {
                        this.flipV=!this.flipV;
                        if(th<-min_size2||this.IsLine())
                            this.ext.cy=-th;
                        else
                            this.ext.cy=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                    if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    else if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    else if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    else if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    break;
                }
                case 5:
                {
                    xfp=(-hc*cos+vc*sin)+this.pH+hc+this.off.x;
                    yfp=(-hc*sin-vc*cos)+this.pV+vc+this.off.y;

                    th=this.ext.cy*k;
                    if(th>0)
                        if(th>min_size2||this.IsLine())
                            this.ext.cy=th;
                        else
                            this.ext.cy=min_size2;
                    else
                    {
                        this.flipV=!this.flipV;
                        if(th<-min_size2||this.IsLine())
                            this.ext.cy=-th;
                        else
                            this.ext.cy=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                    if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    else if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    else if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    else if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    break;
                }

                case 4:
                {
                    xfp=(hc*cos+vc*sin)+this.pH+hc+this.off.x;
                    yfp=(hc*sin-vc*cos)+this.pV+vc+this.off.y;

                    tw=this.ext.cx*k;
                    th=this.ext.cy*k;

                    if(tw>0)
                        if(tw>min_size2||this.IsLine())
                            this.ext.cx=tw;
                        else
                            this.ext.cx=min_size2;
                    else
                    {
                        this.flipH=!this.flipH;
                        if(tw<-min_size2||this.IsLine())
                            this.ext.cx=-tw;
                        else
                            this.ext.cx=min_size2;
                    }

                    if(th>0)
                        if(th>min_size2||this.IsLine())
                            this.ext.cy=th;
                        else
                            this.ext.cy=min_size2;
                    else
                    {
                        this.flipV=!this.flipV;
                        if(th<-min_size2||this.IsLine())
                            this.ext.cy=-th;
                        else
                            this.ext.cy=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                    if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    else if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    else if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    else if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    break;
                }

                case 3:
                {
                    xfp=(hc*cos+vc*sin)+this.pH+hc+this.off.x;
                    yfp=(hc*sin-vc*cos)+this.pV+vc+this.off.y;

                    tw=this.ext.cx*k;

                    if(tw>0)
                        if(tw>min_size2||this.IsLine())
                            this.ext.cx=tw;
                        else
                            this.ext.cx=min_size2;
                    else
                    {
                        this.flipH=!this.flipH;
                        if(tw<-min_size2||this.IsLine())
                            this.ext.cx=-tw;
                        else
                            this.ext.cx=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                    if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    else if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    else if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    else if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    break;
                }
            }
        }
        else if(!this.flipH&&this.flipV)
        {
            switch(num)
            {
                case 6:
                {
                    xfp=(hc*cos-vc*sin)+hc+this.pH+this.off.x;
                    yfp=(hc*sin+vc*cos)+vc+this.pV+this.off.y;

                    tw=this.ext.cx*k;
                    th=this.ext.cy*k;

                    if(tw>0)
                        if(tw>min_size2||this.IsLine())
                            this.ext.cx=tw;
                        else
                            this.ext.cx=min_size2;
                    else
                    {
                        this.flipH=!this.flipH;
                        if(tw<-min_size2||this.IsLine())
                            this.ext.cx=-tw;
                        else
                            this.ext.cx=min_size2;
                    }

                    if(th>0)
                        if(th>min_size2||this.IsLine())
                            this.ext.cy=th;
                        else
                            this.ext.cy=min_size2;
                    else
                    {
                        this.flipV=!this.flipV;
                        if(th<-min_size2||this.IsLine())
                            this.ext.cy=-th;
                        else
                            this.ext.cy=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                    if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    else if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    else if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    else if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    break;
                }
                case 5:
                {
                    xfp=(hc*cos-vc*sin)+hc+this.pH+this.off.x;
                    yfp=(hc*sin+vc*cos)+vc+this.pV+this.off.y;

                    th=this.ext.cy*k;

                    if(th>0)
                        if(th>min_size2||this.IsLine())
                            this.ext.cy=th;
                        else
                            this.ext.cy=min_size2;
                    else
                    {
                        this.flipV=!this.flipV;
                        if(th<-min_size2||this.IsLine())
                            this.ext.cy=-th;
                        else
                            this.ext.cy=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                    if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    else if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    else if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    else if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    break;
                }

                case 4:
                {
                    xfp=(-hc*cos-vc*sin)+this.pH+hc+this.off.x;
                    yfp=(-hc*sin+vc*cos)+this.pV+vc+this.off.y;

                    tw=this.ext.cx*k;
                    th=this.ext.cy*k;

                    if(tw>0)
                        if(tw>min_size2||this.IsLine())
                            this.ext.cx=tw;
                        else
                            this.ext.cx=min_size2;
                    else
                    {
                        this.flipH=!this.flipH;
                        if(tw<-min_size2||this.IsLine())
                            this.ext.cx=-tw;
                        else
                            this.ext.cx=min_size2;
                    }

                    if(th>0)
                        if(th>min_size2||this.IsLine())
                            this.ext.cy=th;
                        else
                            this.ext.cy=min_size2;
                    else
                    {
                        this.flipV=!this.flipV;
                        if(th<-min_size2||this.IsLine())
                            this.ext.cy=-th;
                        else
                            this.ext.cy=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                    if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    else if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    else if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    else if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    break;
                }
                case 3:
                {
                    xfp=(-hc*cos-vc*sin)+this.pH+hc+this.off.x;
                    yfp=(-hc*sin+vc*cos)+this.pV+vc+this.off.y;
                    tw=this.ext.cx*k;

                    if(tw>0)
                        if(tw>min_size2||this.IsLine())
                            this.ext.cx=tw;
                        else
                            this.ext.cx=min_size2;
                    else
                    {
                        this.flipH=!this.flipH;
                        if(tw<-min_size2||this.IsLine())
                            this.ext.cx=-tw;
                        else
                            this.ext.cx=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                    if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    else if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    else if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    else if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    break;
                }

                case 2:
                {
                    xfp=(-hc*cos+vc*sin)+this.pH+hc+this.off.x;
                    yfp=(-hc*sin-vc*cos)+this.pV+vc+this.off.y;

                    tw=this.ext.cx*k;
                    th=this.ext.cy*k;

                    if(tw>0)
                        if(tw>min_size2||this.IsLine())
                            this.ext.cx=tw;
                        else
                            this.ext.cx=min_size2;
                    else
                    {
                        this.flipH=!this.flipH;
                        if(tw<-min_size2||this.IsLine())
                            this.ext.cx=-tw;
                        else
                            this.ext.cx=min_size2;
                    }

                    if(th>0)
                        if(th>min_size2||this.IsLine())
                            this.ext.cy=th;
                        else
                            this.ext.cy=min_size2;
                    else
                    {
                        this.flipV=!this.flipV;
                        if(th<-min_size2||this.IsLine())
                            this.ext.cy=-th;
                        else
                            this.ext.cy=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                    if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    else if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    else if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    else if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    break;
                }
                case 1:
                {
                    xfp=(-hc*cos+vc*sin)+this.pH+hc+this.off.x;
                    yfp=(-hc*sin-vc*cos)+this.pV+vc+this.off.y;

                    th=this.ext.cy*k;
                    if(th>0)
                        if(th>min_size2||this.IsLine())
                            this.ext.cy=th;
                        else
                            this.ext.cy=min_size2;
                    else
                    {
                        this.flipV=!this.flipV;
                        if(th<-min_size2||this.IsLine())
                            this.ext.cy=-th;
                        else
                            this.ext.cy=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                    if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    else if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    else if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    else if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    break;
                }

                case 0:
                {
                    xfp=(hc*cos+vc*sin)+this.pH+hc+this.off.x;
                    yfp=(hc*sin-vc*cos)+this.pV+vc+this.off.y;

                    tw=this.ext.cx*k;
                    th=this.ext.cy*k;

                    if(tw>0)
                        if(tw>min_size2||this.IsLine())
                            this.ext.cx=tw;
                        else
                            this.ext.cx=min_size2;
                    else
                    {
                        this.flipH=!this.flipH;
                        if(tw<-min_size2||this.IsLine())
                            this.ext.cx=-tw;
                        else
                            this.ext.cx=min_size2;
                    }

                    if(th>0)
                        if(th>min_size2||this.IsLine())
                            this.ext.cy=th;
                        else
                            this.ext.cy=min_size2;
                    else
                    {
                        this.flipV=!this.flipV;
                        if(th<-min_size2||this.IsLine())
                            this.ext.cy=-th;
                        else
                            this.ext.cy=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                    if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    else if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    else if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    else if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    break;
                }

                case 7:
                {
                    xfp=(hc*cos+vc*sin)+this.pH+hc+this.off.x;
                    yfp=(hc*sin-vc*cos)+this.pV+vc+this.off.y;

                    tw=this.ext.cx*k;

                    if(tw>0)
                        if(tw>min_size2||this.IsLine())
                            this.ext.cx=tw;
                        else
                            this.ext.cx=min_size2;
                    else
                    {
                        this.flipH=!this.flipH;
                        if(tw<-min_size2||this.IsLine())
                            this.ext.cx=-tw;
                        else
                            this.ext.cx=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                    if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    else if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    else if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    else if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    break;
                }
            }
        }
        this.Recalculate();
    },

    getAspect : function(num)
    {
        var cx = this.ext.cx != 0 ? this.ext.cx : 0.1;
        var cy = this.ext.cy != 0 ? this.ext.cy : 0.1;
        if(!this.flipH&&!this.flipV || this.flipH&&this.flipV)
        {
            switch(num)
            {
                case 0:
                case 4:
                {
                    return cx/cy;
                }

                case 2:
                case 6:
                {
                   return cy/cx;
                }
            }
        }
        else
        {
            switch(num)
            {
                case 2:
                case 6:
                {
                    return cx/cy;
                }

                case 0:
                case 4:
                {
                    return cy/cx;
                }

            }
        }
    },

    DefineResizeCoef: function(num, x, y)
    {
        var cx, cy;
        cx= this.ext.cx>0 ? this.ext.cx : 0.1;
        cy= this.ext.cy>0 ? this.ext.cy : 0.1;
        var p = this.GetPointRelativeShape(x, y);
        if(!this.flipH&&!this.flipV) {

            switch(num) {

                case 0:
                    return {kd1: (cx-p.x)/cx, kd2: (cy-p.y)/cy};
                case 1:
                    return {kd1: (cy-p.y)/cy, kd2: 0};
                case 2:
                    return {kd1: (cy-p.y)/cy, kd2: p.x/cx};
                case 3:
                    return {kd1: p.x/cx, kd2: 0};
                case 4:
                    return {kd1: p.x/cx, kd2: p.y/cy};
                case 5:
                    return {kd1: p.y/cy, kd2: 0};
                case 6:
                    return {kd1: p.y/cy, kd2:(cx-p.x)/cx};
                case 7:
                    return {kd1:(cx-p.x)/cx, kd2: 0};
            }
        }
        else if(this.flipH&&this.flipV)
        {
            switch(num)
            {
                case 4:
                    return {kd1: (cx-p.x)/cx, kd2: (cy-p.y)/cy};
                case 5:
                    return {kd1: (cy-p.y)/cy, kd2: 0};
                case 6:
                    return {kd1: (cy-p.y)/cy, kd2: p.x/cx};
                case 7:
                    return {kd1: p.x/cx, kd2: 0};
                case 0:
                    return {kd1: p.x/cx, kd2: p.y/cy};
                case 1:
                    return {kd1: p.y/cy, kd2: 0};
                case 2:
                    return {kd1: p.y/cy, kd2:(cx-p.x)/cx};
                case 3:
                    return {kd1:(cx-p.x)/cx, kd2: 0};
            }
        }
        else if(this.flipH&&!this.flipV)
        {
            switch(num)
            {
                case 2:
                    return {kd1: (cx-p.x)/cx, kd2: (cy-p.y)/cy};
                case 1:
                    return {kd1: (cy-p.y)/cy, kd2: 0};
                case 0:
                    return {kd1: (cy-p.y)/cy, kd2: p.x/cx};
                case 7:
                    return {kd1: p.x/cx, kd2: 0};
                case 6:
                    return {kd1: p.x/cx, kd2: p.y/cy};
                case 5:
                    return {kd1: p.y/cy, kd2: 0};
                case 4:
                    return {kd1: p.y/cy, kd2:(cx-p.x)/cx};
                case 3:
                    return {kd1:(cx-p.x)/cx, kd2: 0};
            }
        }
        else
        {
            switch(num)
            {
                case 6:
                    return {kd1: (cx-p.x)/cx, kd2: (cy-p.y)/cy};
                case 5:
                    return {kd1: (cy-p.y)/cy, kd2: 0};
                case 4:
                    return {kd1: (cy-p.y)/cy, kd2: p.x/cx};
                case 3:
                    return {kd1: p.x/cx, kd2: 0};
                case 2:
                    return {kd1: p.x/cx, kd2: p.y/cy};
                case 1:
                    return {kd1: p.y/cy, kd2: 0};
                case 0:
                    return {kd1: p.y/cy, kd2:(cx-p.x)/cx};
                case 7:
                    return {kd1:(cx-p.x)/cx, kd2: 0};
            }
        }
    },

    DefineResizeProportionCoef : function(num, x, y)
    {

    },

    GetPointRelativeShape: function(x, y)
    {
        var x_lt, y_lt;
        var hc, vc, sin, cos;

        hc=this.ext.cx*0.5;
        vc=this.ext.cy*0.5;

        sin=Math.sin(this.rot);
        cos=Math.cos(this.rot);

        x_lt=-hc*cos+vc*sin+this.pH+this.off.x+hc;
        y_lt=-hc*sin-vc*cos+this.pV+this.off.y+vc;

        var tx=x-x_lt, ty=y-y_lt;
        var vx, vy;

        vx=tx*cos+ty*sin;
        vy=-tx*sin+ty*cos;
        return {x: vx, y:vy}
    },

    Get_Styles: function(level)
    {
        if(level == undefined)
        {
            level  = 0;
        }

        var Styles = new CStyles();

        var theme = null, layout = null, master = null, presentation;

        switch(this.parent.kind)
        {
            case SLIDE_KIND :
            {
                layout = this.parent.Layout;
                if(layout!=null)
                {
                    master = layout.Master;
                    if(master!=null)
                    {
                        theme = master.Theme;
                        presentation = master.presentation;
                    }
                }
                break;
            }
            case LAYOUT_KIND :
            {

                layout = this.parent;
                if(layout!=null)
                {
                    master = layout.Master;
                    if(master!=null)
                    {
                        theme = master.Theme;
                        presentation = master.presentation;
                    }
                }
                break;
            }
            case MASTER_KIND :
            {

                master = this.parent;
                if(master!=null)
                {
                    theme = master.Theme;
                    presentation = master.presentation;
                }
                break;
            }
        }

        var isPlaceholder = this.isPlaceholder();
        if(isPlaceholder)
        {
            var phId = this.nvSpPr.nvPr.ph.idx, phType = this.nvSpPr.nvPr.ph.type;
            var layoutShape = null, masterShape = null;
            if(layout!=null)
            {
                layoutShape = layout.getMatchingShape(phType, phId);
            }
            if(master != null)
            {
                masterShape = master.getMatchingShape(phType, phId);
            }
        }

        var defaultStyle = null, masterStyle = null, masterShapeStyle = null, layoutShapeStyle = null, slideShapeStyle = null;


        if(presentation != null
            && presentation.defaultTextStyle != null
            && presentation.defaultTextStyle.levels[level] != null)
        {
            defaultStyle = new CStyle("defaultStyle", null, null, null);
            defaultStyle.ParaPr =  clone(presentation.defaultTextStyle.levels[level].pPr);
            defaultStyle.TextPr =  clone(presentation.defaultTextStyle.levels[level].rPr);
            if(defaultStyle.TextPr != undefined)
            {
                if(defaultStyle.TextPr.FontFamily  && defaultStyle.TextPr.FontFamily.Name )
                {
                    if(isThemeFont(defaultStyle.TextPr.FontFamily.Name) && theme && theme.themeElements.fontScheme)
                    {
                        defaultStyle.TextPr.FontFamily.themeFont =  defaultStyle.TextPr.FontFamily.Name;
                        defaultStyle.TextPr.FontFamily.Name = getFontInfo(defaultStyle.TextPr.FontFamily.Name)(theme.themeElements.fontScheme);
                    }
                }
                if(defaultStyle.TextPr.unifill && defaultStyle.TextPr.unifill.fill)
                {
                    if(defaultStyle.TextPr.unifill.fill.type == FILL_TYPE_SOLID)
                    {
                        defaultStyle.TextPr.unifill.fill.color.Calculate(theme, this.parent, layout, master, {R:0, G:0, B:0, A:0});
                        defaultStyle.TextPr.Color = {
                            r : defaultStyle.TextPr.unifill.fill.color.RGBA.R,
                            g : defaultStyle.TextPr.unifill.fill.color.RGBA.G,
                            b : defaultStyle.TextPr.unifill.fill.color.RGBA.B,
                            a : defaultStyle.TextPr.unifill.fill.color.RGBA.A
                        }
                    }
                    if(defaultStyle.TextPr.unifill.fill.type == FILL_TYPE_GRAD)
                    {

                        defaultStyle.TextPr.unifill.fill.colors[0].color.Calculate(theme, this.parent, layout, master, {R:0, G:0, B:0, A:0});
                        defaultStyle.TextPr.Color = {
                            r : defaultStyle.TextPr.unifill.fill.colors[0].color.RGBA.R,
                            g : defaultStyle.TextPr.unifill.fill.colors[0].color.RGBA.G,
                            b : defaultStyle.TextPr.unifill.fill.colors[0].color.RGBA.B,
                            a : defaultStyle.TextPr.unifill.fill.colors[0].color.RGBA.A
                        }
                    }
                    if(defaultStyle.TextPr.unifill.fill.type == FILL_TYPE_NOFILL)
                    {
                        defaultStyle.TextPr.Color = {
                            r : 0,
                            g : 0,
                            b : 0,
                            a : 0
                        }
                    }
                }
                if(defaultStyle.TextPr.FontSize != undefined)
                {
                    defaultStyle.TextPr.themeFontSize = defaultStyle.TextPr.FontSize;
                }
            }

        }


        if(master && master.txStyles)
        {
            if(isPlaceholder)
            {
                switch(phType)
                {
                    case phType_ctrTitle :
                    case phType_title :
                    {
                        if(master.txStyles.titleStyle && master.txStyles.titleStyle.levels[level])
                        {
                            masterStyle = new CStyle("masterStyle", null, null, null);
                            masterStyle.ParaPr =  clone(master.txStyles.titleStyle.levels[level].pPr);
                            masterStyle.TextPr =  clone(master.txStyles.titleStyle.levels[level].rPr);
                        }
                        break;
                    }
                    case phType_body :
                    case phType_subTitle :
                    case phType_obj :
                    case null :
                    {
                        if(master.txStyles.bodyStyle && master.txStyles.bodyStyle.levels[level])
                        {
                            masterStyle = new CStyle("masterStyle", null, null, null);
                            masterStyle.ParaPr =  clone(master.txStyles.bodyStyle.levels[level].pPr);
                            masterStyle.TextPr =  clone(master.txStyles.bodyStyle.levels[level].rPr);
                        }
                        break;
                    }
                    default :
                    {
                        if(master.txStyles.otherStyle && master.txStyles.otherStyle.levels[level])
                        {
                            masterStyle = new CStyle("masterStyle", null, null, null);
                            masterStyle.ParaPr =  clone(master.txStyles.otherStyle.levels[level].pPr);
                            masterStyle.TextPr =  clone(master.txStyles.otherStyle.levels[level].rPr);
                        }
                        break;
                    }
                }

            }
            else
            {
                if(master.txStyles.otherStyle && master.txStyles.otherStyle.levels[level])
                {
                    masterStyle = new CStyle("masterStyle", null, null, null);
                    masterStyle.ParaPr =  clone(master.txStyles.otherStyle.levels[level].pPr);
                    masterStyle.TextPr =  clone(master.txStyles.otherStyle.levels[level].rPr);
                }
            }

            if(masterStyle && masterStyle.TextPr)
            {
                if( masterStyle.TextPr.FontFamily  && masterStyle.TextPr.FontFamily.Name )
                {
                    if(masterStyle.TextPr.FontFamily && isThemeFont(masterStyle.TextPr.FontFamily.Name) && theme && theme.themeElements.fontScheme)
                    {
                        masterStyle.TextPr.FontFamily.themeFont =  masterStyle.TextPr.FontFamily.Name;
                        masterStyle.TextPr.FontFamily.Name = getFontInfo(masterStyle.TextPr.FontFamily.Name)(theme.themeElements.fontScheme);
                    }
                }

                if(masterStyle.TextPr.unifill && masterStyle.TextPr.unifill.fill)
                {
                    if(masterStyle.TextPr.unifill.fill.type == FILL_TYPE_SOLID)
                    {
                        masterStyle.TextPr.unifill.fill.color.Calculate(theme, this.parent, layout, master, {R:0, G:0, B:0, A:0});
                        masterStyle.TextPr.Color = {
                            r : masterStyle.TextPr.unifill.fill.color.RGBA.R,
                            g : masterStyle.TextPr.unifill.fill.color.RGBA.G,
                            b : masterStyle.TextPr.unifill.fill.color.RGBA.B,
                            a : masterStyle.TextPr.unifill.fill.color.RGBA.A
                        }
                    }
                    if(masterStyle.TextPr.unifill.fill.type == FILL_TYPE_GRAD)
                    {

                        masterStyle.TextPr.unifill.fill.colors[0].color.Calculate(theme, this.parent, layout, master, {R:0, G:0, B:0, A:0});
                        masterStyle.TextPr.Color = {
                            r : masterStyle.TextPr.unifill.fill.colors[0].color.RGBA.R,
                            g : masterStyle.TextPr.unifill.fill.colors[0].color.RGBA.G,
                            b : masterStyle.TextPr.unifill.fill.colors[0].color.RGBA.B,
                            a : masterStyle.TextPr.unifill.fill.colors[0].color.RGBA.A
                        }
                    }
                    if(masterStyle.TextPr.unifill.fill.type == FILL_TYPE_NOFILL)
                    {
                        masterStyle.TextPr.Color = {
                            r : 0,
                            g : 0,
                            b : 0,
                            a : 0
                        }
                    }
                }

                if(masterStyle.TextPr.FontSize != undefined)
                {
                    masterStyle.TextPr.themeFontSize = masterStyle.TextPr.FontSize;
                }
            }

        }

        if(isPlaceholder)
        {
            if(masterShape && masterShape.txBody && masterShape.txBody.lstStyle && masterShape.txBody.lstStyle.levels[level])
            {
                masterShapeStyle = new CStyle("masterShapeStyle", null, null, null);
                masterShapeStyle.ParaPr =  clone(masterShape.txBody.lstStyle.levels[level].pPr);
                masterShapeStyle.TextPr =  clone(masterShape.txBody.lstStyle.levels[level].rPr);
                if(masterShapeStyle.TextPr)
                {
                    if(masterShapeStyle.TextPr.FontFamily && isThemeFont(masterShapeStyle.TextPr.FontFamily.Name) && theme && theme.themeElements.fontScheme)
                    {
                        masterShapeStyle.TextPr.FontFamily.themeFont =  masterShapeStyle.TextPr.FontFamily.Name;
                        masterShapeStyle.TextPr.FontFamily.Name = getFontInfo(masterShapeStyle.TextPr.FontFamily.Name)(theme.themeElements.fontScheme);
                    }

                    if(masterShapeStyle.TextPr.unifill && masterShapeStyle.TextPr.unifill.fill)
                    {
                        if(masterShapeStyle.TextPr.unifill.fill.type == FILL_TYPE_SOLID)
                        {
                            masterShapeStyle.TextPr.unifill.fill.color.Calculate(theme, this.parent, layout, master, {R:0, G:0, B:0, A:0});
                            masterShapeStyle.TextPr.Color = {
                                r : masterShapeStyle.TextPr.unifill.fill.color.RGBA.R,
                                g : masterShapeStyle.TextPr.unifill.fill.color.RGBA.G,
                                b : masterShapeStyle.TextPr.unifill.fill.color.RGBA.B,
                                a : masterShapeStyle.TextPr.unifill.fill.color.RGBA.A
                            }
                        }
                        if(masterShapeStyle.TextPr.unifill.fill.type == FILL_TYPE_GRAD)
                        {

                            masterShapeStyle.TextPr.unifill.fill.colors[0].color.Calculate(theme, this.parent, layout, master, {R:0, G:0, B:0, A:0});
                            masterShapeStyle.TextPr.Color = {
                                r : masterShapeStyle.TextPr.unifill.fill.colors[0].color.RGBA.R,
                                g : masterShapeStyle.TextPr.unifill.fill.colors[0].color.RGBA.G,
                                b : masterShapeStyle.TextPr.unifill.fill.colors[0].color.RGBA.B,
                                a : masterShapeStyle.TextPr.unifill.fill.colors[0].color.RGBA.A
                            }
                        }
                        if(masterShapeStyle.TextPr.unifill.fill.type == FILL_TYPE_NOFILL)
                        {
                            masterShapeStyle.TextPr.Color = {
                                r : 0,
                                g : 0,
                                b : 0,
                                a : 0
                            }
                        }
                    }
                }
            }
            if(layoutShape && layoutShape.txBody && layoutShape.txBody.lstStyle && layoutShape.txBody.lstStyle.levels[level])
            {
                layoutShapeStyle = new CStyle("layoutShapeStyle", null, null, null);
                layoutShapeStyle.ParaPr =  clone(layoutShape.txBody.lstStyle.levels[level].pPr);
                layoutShapeStyle.TextPr =  clone(layoutShape.txBody.lstStyle.levels[level].rPr);
                if(layoutShapeStyle.TextPr && layoutShapeStyle.TextPr.FontFamily && isThemeFont(layoutShapeStyle.TextPr.FontFamily.Name) && theme && theme.themeElements.fontScheme)
                {
                    layoutShapeStyle.TextPr.FontFamily.themeFont =  layoutShapeStyle.TextPr.FontFamily.Name;
                    layoutShapeStyle.TextPr.FontFamily.Name = getFontInfo(layoutShapeStyle.TextPr.FontFamily.Name)(theme.themeElements.fontScheme);
                }


                if(layoutShapeStyle && layoutShapeStyle.TextPr && layoutShapeStyle.TextPr.unifill && layoutShapeStyle.TextPr.unifill.fill)
                {
                    if(layoutShapeStyle.TextPr.unifill.fill.type == FILL_TYPE_SOLID)
                    {
                        layoutShapeStyle.TextPr.unifill.fill.color.Calculate(theme, this.parent, layout, master, {R:0, G:0, B:0, A:0});
                        layoutShapeStyle.TextPr.Color = {
                            r : layoutShapeStyle.TextPr.unifill.fill.color.RGBA.R,
                            g : layoutShapeStyle.TextPr.unifill.fill.color.RGBA.G,
                            b : layoutShapeStyle.TextPr.unifill.fill.color.RGBA.B,
                            a : layoutShapeStyle.TextPr.unifill.fill.color.RGBA.A
                        }
                    }
                    if(layoutShapeStyle.TextPr.unifill.fill.type == FILL_TYPE_GRAD)
                    {

                        layoutShapeStyle.TextPr.unifill.fill.colors[0].color.Calculate(theme, this.parent, layout, master, {R:0, G:0, B:0, A:0});
                        layoutShapeStyle.TextPr.Color = {
                            r : layoutShapeStyle.TextPr.unifill.fill.colors[0].color.RGBA.R,
                            g : layoutShapeStyle.TextPr.unifill.fill.colors[0].color.RGBA.G,
                            b : layoutShapeStyle.TextPr.unifill.fill.colors[0].color.RGBA.B,
                            a : layoutShapeStyle.TextPr.unifill.fill.colors[0].color.RGBA.A
                        }
                    }
                    if(layoutShapeStyle.TextPr.unifill.fill.type == FILL_TYPE_NOFILL)
                    {
                        layoutShapeStyle.TextPr.Color = {
                            r : 0,
                            g : 0,
                            b : 0,
                            a : 0
                        }
                    }
                }
            }
        }

        if(/*this.parent.kind == SLIDE_KIND &&*/ this.txBody && this.txBody.lstStyle && this.txBody.lstStyle.levels[level])
        {
            slideShapeStyle = new CStyle("slideShapeStyle", null, null, null);
            slideShapeStyle.ParaPr =  clone(this.txBody.lstStyle.levels[level].pPr);
            slideShapeStyle.TextPr =  clone(this.txBody.lstStyle.levels[level].rPr);
            if(slideShapeStyle.TextPr && slideShapeStyle.TextPr.FontFamily && isThemeFont(slideShapeStyle.TextPr.FontFamily.Name) && theme && theme.themeElements.fontScheme)
            {
                slideShapeStyle.TextPr.FontFamily.themeFont =  slideShapeStyle.TextPr.FontFamily.Name;
                slideShapeStyle.TextPr.FontFamily.Name = getFontInfo(slideShapeStyle.TextPr.FontFamily.Name)(theme.themeElements.fontScheme);
            }

            if(slideShapeStyle && slideShapeStyle.TextPr && slideShapeStyle.TextPr.unifill && slideShapeStyle.TextPr.unifill.fill)
            {
                if(slideShapeStyle.TextPr.unifill.fill.type == FILL_TYPE_SOLID)
                {
                    slideShapeStyle.TextPr.unifill.fill.color.Calculate(theme, this.parent, layout, master, {R:0, G:0, B:0, A:0});
                    slideShapeStyle.TextPr.Color = {
                        r : slideShapeStyle.TextPr.unifill.fill.color.RGBA.R,
                        g : slideShapeStyle.TextPr.unifill.fill.color.RGBA.G,
                        b : slideShapeStyle.TextPr.unifill.fill.color.RGBA.B,
                        a : slideShapeStyle.TextPr.unifill.fill.color.RGBA.A
                    }
                }
                if(slideShapeStyle.TextPr.unifill.fill.type == FILL_TYPE_GRAD)
                {

                    slideShapeStyle.TextPr.unifill.fill.colors[0].color.Calculate(theme, this.parent, layout, master, {R:0, G:0, B:0, A:0});
                    slideShapeStyle.TextPr.Color = {
                        r : slideShapeStyle.TextPr.unifill.fill.colors[0].color.RGBA.R,
                        g : slideShapeStyle.TextPr.unifill.fill.colors[0].color.RGBA.G,
                        b : slideShapeStyle.TextPr.unifill.fill.colors[0].color.RGBA.B,
                        a : slideShapeStyle.TextPr.unifill.fill.colors[0].color.RGBA.A
                    }
                }
                if(slideShapeStyle.TextPr.unifill.fill.type == FILL_TYPE_NOFILL)
                {
                    slideShapeStyle.TextPr.Color = {
                        r : 0,
                        g : 0,
                        b : 0,
                        a : 0
                    }
                }
            }
        }

        if(isPlaceholder)
        {
            if(defaultStyle)
            {
                Styles.Style[Styles.Id] = defaultStyle;
                defaultStyle.BasedOn = null;
                ++Styles.Id;
            }

            if(masterStyle)
            {
             Styles.Style[Styles.Id] = masterStyle;
             masterStyle.BasedOn = Styles.Id-1;
             ++Styles.Id;
            }
        }
        else
        {
            if(masterStyle)
            {
                Styles.Style[Styles.Id] = masterStyle;
                masterStyle.BasedOn = null;
                ++Styles.Id;
            }

            if(defaultStyle)
            {
                Styles.Style[Styles.Id] = defaultStyle;
                defaultStyle.BasedOn = Styles.Id-1;
                ++Styles.Id;
            }
        }

        if(masterShapeStyle)
        {
            Styles.Style[Styles.Id] = masterShapeStyle;
            masterShapeStyle.BasedOn = Styles.Id-1;
            ++Styles.Id;
        }

        if(layoutShapeStyle)
        {
            Styles.Style[Styles.Id] = layoutShapeStyle;
            layoutShapeStyle.BasedOn = Styles.Id-1;
            ++Styles.Id;
        }

        if(slideShapeStyle)
        {
            Styles.Style[Styles.Id] = slideShapeStyle;
            slideShapeStyle.BasedOn = Styles.Id-1;
            ++Styles.Id;
        }

        if(this.style && this.style.fontRef)
        {
            var refStyle = new CStyle("refStyle", null, null, null);
            refStyle.ParaPr = {};
            refStyle.TextPr = {};
            switch  (this.style.fontRef.idx)
            {
                case fntStyleInd_major :
                {
                    refStyle.TextPr.FontFamily = {Name : getFontInfo("+mj-lt")(theme.themeElements.fontScheme) };
                    break;
                }
                case fntStyleInd_minor :
                {
                    refStyle.TextPr.FontFamily = {Name : getFontInfo("+mn-lt")(theme.themeElements.fontScheme) };
                    break;
                }
                default :
                {
                    break;
                }
            }

            if(this.style.fontRef.Color!=null && this.style.fontRef.Color.color != null)
            {
                var unifill = new CUniFill();
                unifill.fill = new CSolidFill();
                unifill.fill.color = this.style.fontRef.Color;
                refStyle.TextPr.unifill = unifill;
            }
            else
            {
                refStyle.TextPr.unifill = null;
            }

            Styles.Style[Styles.Id] = refStyle;
            refStyle.BasedOn = Styles.Id-1;
            ++Styles.Id;
        }
        return Styles;
    },

    Is_Cell: function()
    {
        return true;
    },

    OnContentRecalculate: function(bChange, bForceRecalc )
    {
    },

    Get_Numbering: function(level)
    {
        return new CNumbering();
    },

    Recalculate: function()
    {
        if(this.geometry)
        {
            this.geometry.Recalculate(this.ext.cx, this.ext.cy);
        }
        this.RecalculateContent();
    },

    RecalculateContent: function()
    {
        if(this.txBody)
        {
           this.txBody.recalculate(this);
        }
        this.RecalculateTransformMatrix();
    },

    RecalculateContent2: function()
    {
        if(this.txBody)
        {
            this.txBody.recalculate2(this);
        }
    },

    Hit: function(x, y)
    {
        if(this.geometry == null)
        {
            return this.HitInBox(x, y);
        }

        var x_lt, y_lt;
        var hc, vc, sin, cos;

        hc=this.ext.cx*0.5;
        vc=this.ext.cy*0.5;

        sin=Math.sin(this.rot);
        cos=Math.cos(this.rot);

        x_lt=-hc*cos+vc*sin+this.pH+this.off.x+hc;
        y_lt=-hc*sin-vc*cos+this.pV+this.off.y+vc;

        var tx=x-x_lt, ty=y-y_lt;

        var vx, vy;

        vx=tx*cos+ty*sin;
        vy=-tx*sin+ty*cos;

        if(this.flipH)
            vx=this.ext.cx-vx;
        if(this.flipV)
            vy=this.ext.cy-vy;



        if(this.brush!=null && this.brush.fill!=null
            && this.brush.fill.type!=FILL_TYPE_NOFILL)
        {
            var context=this.Container.DrawingDocument.CanvasHitContext;
            var pathLst=this.geometry.pathLst, path, cmd;
            for(var i=0; i<pathLst.length; i++)
            {
                path=pathLst[i];
                context.beginPath();
                for(var j=0; j<path.ArrPathCommand.length; j++)
                {
                    cmd=path.ArrPathCommand[j];
                    switch(cmd.id)
                    {
                        case moveTo:
                        {
                            context.moveTo(cmd.X*0.01, cmd.Y*0.01);
                            break;
                        }
                        case lineTo:
                        {
                            context.lineTo(cmd.X*0.01, cmd.Y*0.01);
                            break;
                        }
                        case arcTo:
                        {
                            ArcToOnCanvas(context, cmd.stX*0.01, cmd.stY*0.01, cmd.wR*0.01, cmd.hR*0.01, cmd.stAng, cmd.swAng);
                            break;
                        }
                        case bezier3:
                        {
                            context.quadraticCurveTo(cmd.X0*0.01, cmd.Y0*0.01, cmd.X1*0.01, cmd.Y1*0.01);
                            break;
                        }
                        case bezier4:
                        {
                            context.bezierCurveTo(cmd.X0*0.01, cmd.Y0*0.01, cmd.X1*0.01, cmd.Y1*0.01, cmd.X2*0.01, cmd.Y2*0.01);
                            break;
                        }
                        case close:
                        {
                            context.closePath();
                            if(context.isPointInPath(vx, vy))
                            {
                                return true;
                            }
                          /*  if(j<path.ArrPathCommand.length-1)
                            {
                                context.beginPath();
                            }  */
                        }
                    }
                }
            }

        }
        return this.HitInPath(x, y)
    },

    startSearchText : function(str, ownNumber)
    {
        if(this.txBody)
        {
            return this.txBody.startSearchText(str);
        }
        else
        {
            return false;
        }
    },

    resizeToFormat : function(kx, ky)
    {
        if(kx > 0 && ky > 0)
        {
            if(this.spPr && this.spPr.xfrm && this.spPr.xfrm.offX != null)
            {
                this.spPr.xfrm.offX *= kx;
                this.spPr.xfrm.offY *= ky;
                this.spPr.xfrm.extX *= kx;
                this.spPr.xfrm.extY *= ky;
            }
        }
    },

    getSearchResults : function(str, ownNum)//возвращает массив SelectionState'ов
    {
        var documentContentSelectionStates = this.txBody ? this.txBody.getSearchResults(str) : [];
        if(documentContentSelectionStates.length > 0)
        {
            var arrSelSt = [];
            for(var i = 0; i < documentContentSelectionStates.length; ++i)
            {
                var selectionState = {};
                selectionState.state = new AddTextState();
                selectionState.selectionMap = [];
                for(var j = 0; j < this.Container.ArrGlyph.length; ++j)
                {
                    selectionState.selectionMap[j] = false;
                }
                selectionState.selectionMap[ownNum] = true;
                selectionState.obj = this;
                selectionState.textSelectionState = documentContentSelectionStates[i];
                arrSelSt.push(selectionState);
            }
            return arrSelSt;
        }
        else
        {
            return null;
        }
    },

    IsLine : function()
    {
        return  this.geometry ? (this.geometry.isLine !== undefined ? this.geometry.isLine : false) : false;
    },
    HitInPath: function(x, y)
    {
        if(!this.geometry)
            return false;
        var x_lt, y_lt;
        var hc, vc, sin, cos;

        hc=this.ext.cx*0.5;
        vc=this.ext.cy*0.5;

        sin=Math.sin(this.rot);
        cos=Math.cos(this.rot);

        x_lt=-hc*cos+vc*sin+this.pH+this.off.x+hc;
        y_lt=-hc*sin-vc*cos+this.pV+this.off.y+vc;

        var tx=x-x_lt, ty=y-y_lt;

        var vx, vy;

        vx=tx*cos+ty*sin;
        vy=-tx*sin+ty*cos;

        if(this.flipH)
            vx=this.ext.cx-vx;
        if(this.flipV)
            vy=this.ext.cy-vy;

        var context=this.Container.DrawingDocument.CanvasHitContext;
        context.beginPath();

        var pathLst=this.geometry.pathLst, path, cmd;
        var lastX, lastY, beginX, beginY;
        for(var i=0; i<pathLst.length; i++)
        {
            path=pathLst[i];
            context.beginPath();
            for(var j=0; j<path.ArrPathCommand.length; j++)
            {
                cmd=path.ArrPathCommand[j];
                switch(cmd.id)
                {
                    case moveTo:
                    {
                        lastX=cmd.X;
                        lastY=cmd.Y;
                        beginX=cmd.X;
                        beginY=cmd.Y;
                        break;
                    }
                    case lineTo:
                    {
                        if(HitInLine(context, vx, vy, lastX*0.01, lastY*0.01, cmd.X*0.01, cmd.Y*0.01))
                            return true;
                        lastX=cmd.X;
                        lastY=cmd.Y;
                        break;
                    }
                    case arcTo:
                    {
                        if(HitToArc(context, vx, vy,  cmd.stX*0.01, cmd.stY*0.01, cmd.wR*0.01, cmd.hR*0.01, cmd.stAng, cmd.swAng))
                            return true;
                        lastX=(cmd.stX-cmd.wR*Math.cos(cmd.stAng)+cmd.wR*Math.cos(cmd.swAng));
                        lastY=(cmd.stY-cmd.hR*Math.sin(cmd.stAng)+cmd.hR*Math.sin(cmd.swAng));
                        break;
                    }
                    case bezier3:
                    {
                        if(HitInBezier3(context, vx, vy, lastX*0.01, lastY*0.01, cmd.X0*0.01, cmd.Y0*0.01, cmd.X1*0.01, cmd.Y1*0.01))
                            return true;
                        lastX=cmd.X1;
                        lastY=cmd.Y1;
                        break;
                    }
                    case bezier4:
                    {
                        if(HitInBezier4(context, vx, vy, lastX*0.01, lastY*0.01, cmd.X0*0.01, cmd.Y0*0.01, cmd.X1*0.01, cmd.Y1*0.01, cmd.X2*0.01, cmd.Y2*0.01))
                            return true;
                        lastX=cmd.X2;
                        lastY=cmd.Y2;
                        break;
                    }
                    case close:
                    {
                        if(HitInLine(context, vx, vy, lastX*0.01, lastY*0.01, beginX*0.01, beginY*0.01))
                            return true;
                    }
                }
            }
        }

        return false;

    },

    HitInBox: function(x, y)//проверяет поппали ли в границу box'а
    {
        if(this.IsLine())
        {
            return false;
        }
        var x_lt, y_lt;
        var hc, vc, sin, cos;

        hc=this.ext.cx*0.5;
        vc=this.ext.cy*0.5;

        sin=Math.sin(this.rot);
        cos=Math.cos(this.rot);

        x_lt=-hc*cos+vc*sin+this.pH+this.off.x+hc;
        y_lt=-hc*sin-vc*cos+this.pV+this.off.y+vc;

        var tx=x-x_lt, ty=y-y_lt;

        var vx, vy;

        vx=tx*cos+ty*sin;
        vy=-tx*sin+ty*cos;

        if(this.flipH)
            vx=this.ext.cx-vx;
        if(this.flipV)
            vy=this.ext.cy-vy;

        var context=this.Container.DrawingDocument.CanvasHitContext;
        context.beginPath();
        return (HitInLine(context, vx, vy, 0, 0, this.ext.cx, 0) ||
            HitInLine(context, vx, vy, this.ext.cx, 0, this.ext.cx, this.ext.cy)||
            HitInLine(context, vx, vy, this.ext.cx, this.ext.cy, 0, this.ext.cy)||
            HitInLine(context, vx, vy, 0, this.ext.cy, 0, 0) ||
            HitInLine(context, vx, vy, this.ext.cx*0.5, 0, this.ext.cx*0.5, -this.Container.DrawingDocument.GetMMPerDot(TRACK_DISTANCE_ROTATE)));
    },

    InTextRect: function(x, y)
    {

            var x_lt, y_lt;
            var hc, vc, sin, cos;

            hc=this.ext.cx*0.5;
            vc=this.ext.cy*0.5;

            sin=Math.sin(this.rot);
            cos=Math.cos(this.rot);

            x_lt=-hc*cos+vc*sin+this.pH+this.off.x+hc;
            y_lt=-hc*sin-vc*cos+this.pV+this.off.y+vc;

            var tx=x-x_lt, ty=y-y_lt;

            var vx, vy;


            vx=tx*cos+ty*sin;
            vy=-tx*sin+ty*cos;
         if(this.flipH)
            vx=this.ext.cx-vx;
        if(this.flipV)
            vy=this.ext.cy-vy;
        if(this.txBody ) {
            vx -=this.pH;
            vy -= this.pV;
            var content=this.txBody;
            if(!this.isPlaceholder())
            {
                var _presentation = this.Container.Document;

                var _el_m = _presentation.Slides[_presentation.CurPage].elementsManipulator;
                if(content.content && (!content.content.Is_Empty() || (_presentation.CurPos.Type == docpostype_FlowObjects && _el_m.obj == this) ))
                {
                    return vx>=content.l && vx<=content.r && vy>=content.t && vy<=content.b;
                }
                else
                {
                    return false;
                }
            }
            else
            {
                _presentation = this.Container.Document;

                _el_m = _presentation.Slides[_presentation.CurPage].elementsManipulator;
                if(content.content && (!content.content.Is_Empty() || (_presentation.CurPos.Type == docpostype_FlowObjects && _el_m.obj == this) ))
                {
                    return vx>=content.l && vx<=content.r && vy>=content.t && vy<=content.b;
                }
                else if(content.content2 && !content.content2.Is_Empty())
                {
                    return vx>=content.l2 && vx<=content.r2 && vy>=content.t2 && vy<=content.b2;
                }
                else
                {
                    return false;
                }
            }
        }
        else {
            return /*vx>=0 && vx<=this.ext.cx && vy>=0 && vy<=this.ext.cy*/ false;
        }

    },

    GetAngle: function(x, y)
    {
        var x_lt, y_lt;
        var hc, vc, sin, cos;

        hc=this.ext.cx*0.5;
        vc=this.ext.cy*0.5;

        sin=Math.sin(this.rot);
        cos=Math.cos(this.rot);

        x_lt=-hc*cos+vc*sin+this.pH+this.off.x+hc;
        y_lt=-hc*sin-vc*cos+this.pV+this.off.y+vc;


        var tx=x-x_lt, ty=y-y_lt;

        var vx, vy;

        vx=tx*cos+ty*sin;
        vy=-tx*sin+ty*cos;

        var ang=Math.PI*0.5+Math.atan2(vy-vc, vx-hc);
        if(!this.flipV)
            return ang;
        else
            return ang+Math.PI;
    },

    Rotate: function(a, ShiftFlag)
    {
        this.rot+=a;
        while(this.rot<0)
        {
            this.rot+=Math.PI*2;
        }
        while(this.rot>=Math.PI*2)
        {
            this.rot-=2*Math.PI;
        }

        if(this.rot<0.07||this.rot>2*Math.PI-0.07)
        {
            this.rot=0;
        }
        if(Math.abs(this.rot-Math.PI*0.5)<0.07)
        {
            this.rot=Math.PI*0.5;
        }

        if(Math.abs(this.rot-Math.PI)<0.07)
        {
            this.rot=Math.PI;
        }

        if(Math.abs(this.rot-1.5*Math.PI)<0.07)
        {
            this.rot=1.5*Math.PI;
        }

        if(ShiftFlag)
        {
            this.rot=(Math.PI/12)*Math.floor(12*this.rot/(Math.PI));
        }
        this.RecalculateTransformMatrix();
    },

    HitHandle: function(x, y)
    {
        var x_lt, y_lt;
        var vx, vy;
        var hc, vc, sin, cos;
        hc=this.ext.cx*0.5;
        vc=this.ext.cy*0.5;

        sin=Math.sin(this.rot);
        cos=Math.cos(this.rot);

        x_lt=-hc*cos+vc*sin+this.pH+this.off.x+hc;
        y_lt=-hc*sin-vc*cos+this.pV+this.off.y+vc;

        var r=this.Container.DrawingDocument.GetMMPerDot(TRACK_CIRCLE_RADIUS);

        var tx=x-x_lt, ty=y-y_lt;
        vx=tx*cos+ty*sin;
        vy=-tx*sin+ty*cos;

        var dx, dy;
        if(!this.IsLine())
        {
            if(Math.sqrt(vx*vx+vy*vy)<r)
            {
                return {hit: true, num: this.flipV ?(this.flipH ? 4: 6) : (this.flipH ? 2: 0)};
            }

            dx=vx-this.ext.cx;
            dy=vy-this.ext.cy;
            if(Math.sqrt(dx*dx+dy*dy)<r)
            {
                return {hit:true, num: this.flipV ? (this.flipH ? 0 : 2) : (this.flipH ? 6 : 4)};
            }

            dx=vx;
            dy=vy-this.ext.cy;
            if(Math.sqrt(dx*dx+dy*dy)<r)
            {
                return {hit:true, num: this.flipV ? (this.flipH ? 2 : 0) : (this.flipH ? 4 : 6)};
            }

            dx=vx-this.ext.cx;
            dy=vy;
            if(Math.sqrt(dx*dx+dy*dy)<r)
            {
                return {hit:true, num: this.flipV ? (this.flipH ? 6 : 4) : (this.flipH ? 0 : 2)};
            }

            if(this.ext.cx>min_size)
            {
                dx=vx-hc;
                dy=vy;
                if(Math.sqrt(dx*dx+dy*dy)<r)
                {
                    return {hit:true, num: this.flipV ? 5 : 1};
                }
            }

            if(this.ext.cy>min_size)
            {
                dx=vx-this.ext.cx;
                dy=vy-vc;
                if(Math.sqrt(dx*dx+dy*dy)<r)
                {
                    return {hit:true, num: this.flipH ? 7 : 3};
                }
            }



            if(this.ext.cx>min_size)
            {
                dx=vx-hc;
                dy=vy-this.ext.cy;
                if(Math.sqrt(dx*dx+dy*dy)<r)
                {
                    return {hit:true, num: this.flipV ? 1 : 5};
                }
            }


            if(this.ext.cy>min_size)
            {
                dx=vx;
                dy=vy-vc;
                if(Math.sqrt(dx*dx+dy*dy)<r)
                {
                    return {hit:true, num: this.flipH ? 3 : 7};
                }
            }
           // if(!(this.ext.cx<min_size&&this.ext.cy<min_size))
            {
                dx=vx-hc;
                if(!this.flipV)
                {
                    dy=vy+this.Container.DrawingDocument.GetMMPerDot(TRACK_DISTANCE_ROTATE);
                }
                else
                {
                    dy=vy-(this.ext.cy+this.Container.DrawingDocument.GetMMPerDot(TRACK_DISTANCE_ROTATE));
                }

                if(Math.sqrt(dx*dx+dy*dy)<r)
                {
                    return {hit:true, num: 8};
                }
            }
        }
        else
        {
            if(this.flipH) vx=this.ext.cx-vx;
            if(this.flipV) vy=this.ext.cy-vy;

            if(Math.sqrt(vx*vx+vy*vy)<r)
            {
                return {hit: true, num: 0};
            }

            dx=vx-this.ext.cx;
            dy=vy-this.ext.cy;
            if(Math.sqrt(dx*dx+dy*dy)<r)
            {
                return {hit:true, num: 4};
            }

        }

        return {hit:false};
    },

    HitAdj: function(x, y)
    {
        if(this.geometry && this.ext.cx>min_size&&this.ext.cy>min_size)
        {
            var x_lt, y_lt;
            var hc, vc, sin, cos;

            hc=this.ext.cx*0.5;
            vc=this.ext.cy*0.5;

            sin=Math.sin(this.rot);
            cos=Math.cos(this.rot);

            x_lt=-hc*cos+vc*sin+this.pH+this.off.x+hc;
            y_lt=-hc*sin-vc*cos+this.pV+this.off.y+vc;


            var tx=x-x_lt, ty=y-y_lt;

            var vx, vy;

            vx=tx*cos+ty*sin;
            vy=-tx*sin+ty*cos;

            if(this.flipH)
                vx=this.ext.cx-vx;

            if(this.flipV)
                vy=this.ext.cy-vy;

            var dx, dy;

            for(var i=0; i<this.geometry.ahXYLst.length; i++)
            {
                dx=vx-this.geometry.ahXYLst[i].posX;
                dy=vy-this.geometry.ahXYLst[i].posY;

                if(Math.sqrt(dx*dx+dy*dy)<3)
                {
                    return {hit:true, type:xy, num:i};
                }
            }

            for( i=0; i<this.geometry.ahPolarLst.length; i++)
            {
                dx=vx-this.geometry.ahPolarLst[i].posX;
                dy=vy-this.geometry.ahPolarLst[i].posY;

                if(Math.sqrt(dx*dx+dy*dy)<3)
                {
                    return {hit:true, type:polar, num:i};
                }
            }
        }
        return {hit: false};
    },

    GetSizes: function()
    {
        var y1, y3, y5, y7, hc, vc, sin, cos;
        hc=this.ext.cx*0.5;
        vc=this.ext.cy*0.5;
        sin=Math.sin(this.rot);
        cos=Math.cos(this.rot);
        y1=-cos*vc;
        y3=sin*hc;
        y5=cos*vc;
        y7=-sin*hc;
        switch(Math.min(y1, y3, y5, y7))
        {
            case y1:
            case y5:
                return {W: this.ext.cx, H: this.ext.cy};
            case y3:
            case y7:
                return {W: this.ext.cy, H: this.ext.cx};
            default:
                return {W: this.ext.cx, H: this.ext.cy};
        }
    },

    CardDirToNum: function(CardDir)
    {
        var y1, y3, y5, y7, hc, vc, sin, cos, numN;

        hc=this.ext.cx*0.5;
        vc=this.ext.cy*0.5;

        sin=Math.sin(this.rot);
        cos=Math.cos(this.rot);

        y1=-cos*vc;
        y3=sin*hc;
        y5=cos*vc;
        y7=-sin*hc;

        switch(Math.min(y1, y3, y5, y7))
        {
            case y1:
            {
                if(!this.flipV)
                    numN=1;
                else
                    numN=5;
                break;
            }
            case y3:
            {
                if(!this.flipH)
                    numN=3;
                else
                    numN=7;
                break;
            }
            case y5:
            {
                if(!this.flipV)
                    numN=5;
                else
                    numN=1;
                break;
            }
            case y7:
            {
                if(!this.flipH)
                    numN=7;
                else
                    numN=3;
                break;
            }
            default:
            {
                numN=1;
            }
        }

        if((!(this.flipH||this.flipV))||(this.flipH&&this.flipV))
            return (CardDir+numN)%8;
        else{
            var t=numN-CardDir;
            if(t<0)
                return t+8;
            else
                return t;
        }
    },

    NumToCardDir: function(Num)
    {
        var y1, y3, y5, y7, hc, vc, sin, cos, numN;

        hc=this.ext.cx*0.5;
        vc=this.ext.cy*0.5;

        sin=Math.sin(this.rot);
        cos=Math.cos(this.rot);

        y1=-cos*vc;
        y3=sin*hc;
        y5=cos*vc;
        y7=-sin*hc;

        switch(Math.min(y1, y3, y5, y7))
        {
            case y1:
            {
                if(!this.flipV)
                    numN=1;
                else
                    numN=5;
                break;
            }
            case y3:
            {
                if(!this.flipH)
                    numN=3;
                else
                    numN=7;
                break;
            }
            case y5:
            {
                if(!this.flipV)
                    numN=5;
                else
                    numN=1;
                break;
            }
            case y7:
            {
                if(!this.flipH)
                    numN=7;
                else
                    numN=3;
                break;
            }
            default:
            {
                numN=1;
            }
        }

        var tmpArr=[];
        if(!(this.flipH||this.flipV)||this.flipH&&this.flipV){
            tmpArr[numN]=N;
            tmpArr[(numN+1)%8]=NE;
            tmpArr[(numN+2)%8]=E;
            tmpArr[(numN+3)%8]=SE;
            tmpArr[(numN+4)%8]=S;
            tmpArr[(numN+5)%8]=SW;
            tmpArr[(numN+6)%8]=W;
            tmpArr[(numN+7)%8]=NW;
            return tmpArr[Num];
        }
        else{
            var t;
            tmpArr[numN]=N;
            t=numN-1;
            if(t<0) t+=8;
            tmpArr[t]=NE;
            t=numN-2;
            if(t<0) t+=8;
            tmpArr[t]=E;
            t=numN-3;
            if(t<0) t+=8;
            tmpArr[t]=SE;
            t=numN-4;
            if(t<0) t+=8;
            tmpArr[t]=S;
            t=numN-5;
            if(t<0) t+=8;
            tmpArr[t]=SW;
            t=numN-6;
            if(t<0) t+=8;
            tmpArr[t]=W;
            t=numN-7;
            if(t<0) t+=8;
            tmpArr[t]=NW;
            return tmpArr[Num];
        }
    },

    GetCoordPointNum: function(num)
    {
        var hc, vc, sin, cos;

        sin=Math.sin(this.rot);
        cos=Math.cos(this.rot);

        hc=this.ext.cx*0.5;
        vc=this.ext.cy*0.5;

        switch(num)
        {
            case 0:
            {
                return {
                    x:-hc*cos+vc*sin+this.pH+this.off.x+hc,
                    y:-hc*sin-vc*cos+this.pV+this.off.y+vc
                }
            }
            case 1:
            {
                return{
                    x: vc*sin+this.pH+this.off.x+hc,
                    y: -vc*cos+this.pV+this.off.y+vc
                }
            }
            case 2:
            {
                return{
                    x:hc*cos+vc*sin+this.pH+this.off.x+hc,
                    y:hc*sin-vc*cos+this.pV+this.off.y+vc
                }
            }
            case 3:
            {
                return{
                    x:hc*cos+this.pH+this.off.x+hc,
                    y:hc*sin+this.pV+this.off.y+vc
                }
            }
            case 4:
            {
                return{
                    x:hc*cos-vc*sin+this.pH+this.off.x+hc,
                    y:hc*sin+vc*cos+this.pV+this.off.y+vc
                }
            }
            case 5:
            {
                return{
                    x:vc*sin+this.pH+this.off.x+hc,
                    y:-vc*cos+this.pV+this.off.y+vc
                }
            }
            case 6:
            {
                return{
                    x:-hc*cos-vc*sin+this.pH+this.off.x+hc,
                    y:-hc*sin+vc*cos+this.pV+this.off.y+vc
                }
            }
            case 7:
            {
                return{
                    x:-hc*cos+this.pH+this.off.x+hc,
                    y:-hc*sin+this.pV+this.off.y+vc
                }
            }

        }
    },

    GetCoordPointDir: function(dir)
    {
        return this.GetCoordPointNum(this.CardDirToNum(dir));
    },

    ChangeAdjXY: function(num, x, y) {

        var x_lt, y_lt;
        var hc, vc, sin, cos;

        hc=this.ext.cx*0.5;
        vc=this.ext.cy*0.5;

        sin=Math.sin(this.rot);
        cos=Math.cos(this.rot);

        x_lt=-hc*cos+vc*sin+this.pH+this.off.x+hc;
        y_lt=-hc*sin-vc*cos+this.pV+this.off.y+vc;

        var tx=x-x_lt, ty=y-y_lt;

        var vx, vy;

        vx=tx*cos+ty*sin;
        vy=-tx*sin+ty*cos;

        if(this.flipH)
            vx=this.ext.cx-vx;

        if(this.flipV)
            vy=this.ext.cy-vy;

        var minX, maxX, minY, maxY, adj=this.geometry.ahXYLst[num];

        minX=adj.minX;
        maxX=adj.maxX;

        minY=adj.minY;
        maxY=adj.maxY;


        if(adj.gdRefX!=undefined)
        {
            if(vx<Math.max(adj.maxXr, adj.minXr) &&
                vx>Math.min(adj.maxXr, adj.minXr) && (adj.maxXr-adj.minXr) != 0)
            {
                var kX=(maxX-minX)/(adj.maxXr-adj.minXr);
                vx=vx-adj.minXr;
                this.geometry.gdLst[adj.gdRefX] = adj.minX+vx*kX;
            }
            else if(vx>=Math.max(adj.maxXr, adj.minXr) && (adj.maxXr-adj.minXr) != 0)
            {

                kX=(maxX-minX)/(adj.maxXr-adj.minXr);
                vx=Math.max(adj.maxXr, adj.minXr)-adj.minXr;
                this.geometry.gdLst[adj.gdRefX] = adj.minX+vx*kX;

            }
            else if(vx<=Math.min(adj.maxXr, adj.minXr) && (adj.maxXr-adj.minXr) != 0)
            {
                kX=(maxX-minX)/(adj.maxXr-adj.minXr);
                vx=Math.min(adj.maxXr, adj.minXr)-adj.minXr;
                this.geometry.gdLst[adj.gdRefX] = adj.minX+vx*kX;
            }
        }

        if(adj.gdRefY!=undefined)
        {
            if(vy<Math.max(adj.maxYr, adj.minYr) &&
                vy>Math.min(adj.maxYr, adj.minYr) && (adj.maxYr - adj.minYr) != 0)
            {
                var kY=(maxY-minY)/(adj.maxYr - adj.minYr);
                vy=vy-adj.minYr;
                this.geometry.gdLst[adj.gdRefY]=
                    adj.minY+vy*kY;
            }
            else if(vy>=Math.max(adj.maxYr, adj.minYr) && (adj.maxYr - adj.minYr) != 0)
            {
                kY=(maxY-minY)/(adj.maxYr - adj.minYr);
                vy=Math.max(adj.maxYr, adj.minYr)-adj.minYr;
                this.geometry.gdLst[adj.gdRefY]=
                    adj.minY+vy*kY;
            }
            else if(vy<=Math.min(adj.maxYr, adj.minYr) && (adj.maxYr - adj.minYr) != 0)
            {
                kY=(maxY-minY)/(adj.maxYr - adj.minYr);
                vy=Math.min(adj.maxYr, adj.minYr)-adj.minYr;
                this.geometry.gdLst[adj.gdRefY]=
                    adj.minY+vy*kY;
            }
        }

        this.Recalculate();
    },

    ChangeAdjPolar: function(num, x, y)
    {
        var x_lt, y_lt;
        var hc, vc, sin, cos;

        hc=this.ext.cx*0.5;
        vc=this.ext.cy*0.5;

        sin=Math.sin(this.rot);
        cos=Math.cos(this.rot);

        x_lt=-hc*cos+vc*sin+this.pH+this.off.x+hc;
        y_lt=-hc*sin-vc*cos+this.pV+this.off.y+vc;


        var tx=x-x_lt, ty=y-y_lt;

        var vx, vy;

        vx=tx*cos+ty*sin;
        vy=-tx*sin+ty*cos;

        if(this.flipH)
            vx=this.ext.cx-vx;

        if(this.flipV)
            vy=this.ext.cy-vy;

        var minAng, maxAng, minR, maxR, adj=this.geometry.ahPolarLst[num];

        minR=adj.minR;
        maxR=adj.maxR;

        tx=vx-this.ext.cx*0.5;
        ty=vy-this.ext.cy*0.5;

        var R=Math.sqrt(tx*tx+ty*ty);



        if(adj.gdRefR!=undefined)
        {

            if(Math.abs(adj.maxRr - adj.minRr) > 0)
            {
                var kR=(maxR-minR)/(adj.maxRr - adj.minRr);

                var _r = minR + kR*(R - adj.minRr);
                if(_r < Math.max(minR, maxR) && _r > Math.min(minR, maxR))
                {
                    this.geometry.gdLst[adj.gdRefR] = _r;
                }
                else if(_r >= Math.max(minR, maxR))
                {
                    this.geometry.gdLst[adj.gdRefR] = Math.max(minR, maxR);
                }
                else
                {
                    this.geometry.gdLst[adj.gdRefR] = Math.min(minR, maxR);
                }
            }
          /*  if(R<Math.max(adj.maxRr, adj.minRr) &&
                R>Math.min(adj.maxRr, adj.minRr) && (adj.maxRr - adj.minRr) != 0)
            {

            }
            else if(R>=Math.max(adj.maxRr, adj.minRr))
            {
                this.geometry.gdLst[adj.gdRefR]=0;
            }
            else if(R<=Math.min(adj.maxRr, adj.minRr) && (adj.maxRr - adj.minRr))
            {
                R=Math.min(adj.maxRr, adj.minRr)-Math.max(adj.maxRr, adj.minRr);
                kR=(maxR-minR)/(adj.maxRr - adj.minRr);
                this.geometry.gdLst[adj.gdRefR]=R*kR;
            }  */
        }

        if(adj.gdRefAng!=undefined)
        {
            var ang=Math.atan2(ty, tx);
            while(ang<0)
                ang+=2*Math.PI;
            ang*=cToDeg;
            if(ang<Math.max(adj.maxAng, adj.minAng) &&
                ang>Math.min(adj.maxAng, adj.minAng))
            {
                this.geometry.gdLst[adj.gdRefAng]=ang;
            }
            else if(ang>=Math.max(adj.maxAng, adj.minAng))
            {
                this.geometry.gdLst[adj.gdRefAng]= Math.max(adj.maxAng, adj.minAng);
            }
            else if(ang<=Math.min(adj.maxAng, adj.minAng))
            {
                this.geometry.gdLst[adj.gdRefAng]= Math.min(adj.maxAng, adj.minAng);
            }
        }
        this.Recalculate();
    },


    resetTextStyles : function()
    {
        if(this.txBody)
        {
            if(this.txBody.content)
            {
                this.txBody.content.arrStyles.length = 0;
            }
            if(this.txBody.content2)
            {
                this.txBody.content2.arrStyles.length = 0;
            }
        }
    },
    CalculateAdjRange: function(num)
    {
        var adj=this.geometry.ahXYLst[num];
        if(adj.gdRefX!=undefined)
        {
            var tmp = this.geometry.gdLst[adj.gdRefX];
            this.geometry.gdLst[adj.gdRefX]=adj.minX;
            this.geometry.Recalculate(this.ext.cx, this.ext.cy);
            var minXr=adj.posX;

            this.geometry.gdLst[adj.gdRefX]=adj.maxX;
            this.geometry.Recalculate(this.ext.cx, this.ext.cy);
            var maxXr=adj.posX;

            this.geometry.gdLst[adj.gdRefX]=tmp;
            this.geometry.Recalculate(this.ext.cx, this.ext.cy);

            adj.minXr=minXr;
            adj.maxXr=maxXr;
        }

        if(adj.gdRefY!=undefined)
        {
            tmp = this.geometry.gdLst[adj.gdRefY];
            this.geometry.gdLst[adj.gdRefY]=adj.minY;
            this.geometry.Recalculate(this.ext.cx, this.ext.cy);
            var minYr=adj.posY;

            this.geometry.gdLst[adj.gdRefY]=adj.maxY;
            this.geometry.Recalculate(this.ext.cx, this.ext.cy);
            var maxYr=adj.posY;

            this.geometry.gdLst[adj.gdRefY]=tmp;
            this.geometry.Recalculate(this.ext.cx, this.ext.cy);

            adj.minYr=minYr;
            adj.maxYr=maxYr;
        }
    },

    CalculateAdjPolarRangeR: function(num)
    {
        var adj=this.geometry.ahPolarLst[num];
        if(adj.gdRefR!=undefined)
        {
            var tmp = this.geometry.gdLst[adj.gdRefR];
            this.geometry.gdLst[adj.gdRefR]=adj.minR;
            this.geometry.Recalculate(this.ext.cx, this.ext.cy);

            var dx, dy, minR, maxR;
            dx=Math.abs(adj.posX-this.ext.cx*0.5);
            dy=Math.abs(adj.posY-this.ext.cy*0.5);

            minR=Math.sqrt(dx*dx+dy*dy);

            this.geometry.gdLst[adj.gdRefR]=adj.maxR;
            this.geometry.Recalculate(this.ext.cx, this.ext.cy);

            dx=Math.abs(adj.posX-this.ext.cx*0.5);
            dy=Math.abs(adj.posY-this.ext.cy*0.5);

            maxR=Math.sqrt(dx*dx+dy*dy);

            adj.minRr=minR;
            adj.maxRr=maxR;

            this.geometry.gdLst[adj.gdRefR]=tmp;
            this.Recalculate();
        }
    },

    Select: function(graphics, zoom)
    {
        if (graphics.m_oContext === undefined)
            return;
        
        if(zoom == undefined)
            zoom = 100;
        var d=10000/zoom;

        graphics.SetIntegerGrid(false);
        graphics.reset();
        graphics.transform3(this.TransformMatrix);
        graphics.m_oContext.fillStyle="rgb(202, 233, 236)";
        graphics.m_oContext.lineWidth=25/zoom;
        graphics.p_color(0,0,0,255);
        if(this.prst!='line')
        {
            graphics.m_oContext.lineWidth=5/zoom;
            graphics._s();
            graphics._m(0, 0);
            graphics._l(this.ext.cx*100, 0);
            graphics._l(this.ext.cx*100, this.ext.cy*100);
            graphics._l(0, this.ext.cy*100);
            graphics._z();
            graphics.ds();

            if(!(this.ext.cx<min_size&&this.ext.cy<min_size))
            {
                graphics._s();
                graphics._m(this.ext.cx*50, 0);
                graphics._l(this.ext.cx*50, -100000/zoom);
                graphics.ds();
            }

            circle(graphics, 0,0, d);
            circle(graphics, this.ext.cx*100,0, d);
            circle(graphics, this.ext.cx*100,this.ext.cy*100, d);
            circle(graphics, 0,this.ext.cy*100, d);



            if(this.ext.cx>min_size)
            {
                square(graphics, this.ext.cx*50,0, d);
                square(graphics, this.ext.cx*50,this.ext.cy*100, d);
            }

            if(this.ext.cy>min_size)
            {
                square(graphics, this.ext.cx*100,this.ext.cy*50, d);
                square(graphics, 0,this.ext.cy*50, d);
            }

            if(!(this.ext.cx<min_size&&this.ext.cy<min_size))
            {
                graphics.m_oContext.fillStyle="rgb(62, 240, 163)";
                circle(graphics, this.ext.cx*50, -100000/zoom, d);
            }
        }
        else
        {
            circle(graphics, 0,0, d);
            circle(graphics, this.ext.cx*100,this.ext.cy*100, d);
        }
        graphics.reset();
    },

    SelectInGroup: function(graphics, transformMatrix, zoom)
    {
        if(zoom == undefined)
            zoom = 100;
        var d=10000/zoom;

        graphics.SetIntegerGrid(false);
        graphics.reset();
        graphics.transform3(transformMatrix);
        graphics.m_oContext.fillStyle="rgb(202, 233, 236)";
        graphics.m_oContext.lineWidth=25/zoom;
        graphics.p_color(0,0,0,255);
        if(this.prst!='line')
        {
            graphics.m_oContext.lineWidth=5/zoom;
            graphics._s();
            graphics._m(0, 0);
            graphics._l(this.ext.cx*100, 0);
            graphics._l(this.ext.cx*100, this.ext.cy*100);
            graphics._l(0, this.ext.cy*100);
            graphics._z();
            graphics.ds();

            if(!(this.ext.cx<min_size&&this.ext.cy<min_size))
            {
                graphics._s();
                graphics._m(this.ext.cx*50, 0);
                graphics._l(this.ext.cx*50, -100000/zoom);
                graphics.ds();
            }

            circle(graphics, 0,0, d);
            circle(graphics, this.ext.cx*100,0, d);
            circle(graphics, this.ext.cx*100,this.ext.cy*100, d);
            circle(graphics, 0,this.ext.cy*100, d);



            if(this.ext.cx>min_size)
            {
                square(graphics, this.ext.cx*50,0, d);
                square(graphics, this.ext.cx*50,this.ext.cy*100, d);
            }

            if(this.ext.cy>min_size)
            {
                square(graphics, this.ext.cx*100,this.ext.cy*50, d);
                square(graphics, 0,this.ext.cy*50, d);
            }

            if(!(this.ext.cx<min_size&&this.ext.cy<min_size))
            {
                graphics.m_oContext.fillStyle="rgb(62, 240, 163)";
                circle(graphics, this.ext.cx*50, -100000/zoom, d);
            }
        }
        else
        {
            circle(graphics, 0,0, d);
            circle(graphics, this.ext.cx*100,this.ext.cy*100, d);
        }
        graphics.reset();
    },



    selectInGroup : function(transformMatrix)
    {},

    GetWH: function()
    {
        var numN=this.CardDirToNum(N);
        if(numN==1||numN==5)
        {
            return { W: this.ext.cx , H: this.ext.cy, ws: 'cx', hs:'cy'};
        }
        else
        {
            return { H: this.ext.cx , W: this.ext.cy, ws: 'cy', hs:'cx'};
        }
    },

    IsGroup: function()
    {
        return false;
    },

    Get_ParentObject_or_DocumentPos : function()
    {
        switch (this.parent.kind)
        {
            case SLIDE_KIND :
            {
                return this.parent.Layout.Master.presentation.Get_ParentObject_or_DocumentPos(0);
            }
            case LAYOUT_KIND :
            {
                return this.parent.Master.presentation.Get_ParentObject_or_DocumentPos(0);
            }
            case MASTER_KIND :
            {
                return this.parent.presentation.Get_ParentObject_or_DocumentPos(0);
            }
        }

    },

    Undo: function(data)
    {
        data.undo_function.call(this, data)
    },

    Redo: function(data)
    {
        data.redo_function.call(this, data);
    },

    applyProperties : function(element) {

        element.pH = this.pH;
        element.pV = this.pV;

        element.ext = clone(this.ext);
        element.Recalculate();
    } ,

    updateCursorType : function(x, y){

       if(this.selected )
       {
           var hitHandle =  this.HitHandle(x, y);
           if(hitHandle.hit)
           {
                if(hitHandle.num != 8)
                {
                   var direction = this.NumToCardDir(hitHandle.num);
                   switch(direction)
                   {
                       case N:
                       case S:
                       {
                           this.Container.DrawingDocument.SetCursorType("s-resize");
                           break;
                       }

                       case W:
                       case E:
                       {
                           this.Container.DrawingDocument.SetCursorType("w-resize");
                           break;
                       }

                       case SE:
                       case NW: {

                           this.Container.DrawingDocument.SetCursorType("se-resize");
                           break;
                       }
                       case SW:
                       case NE:
                       {
                           this.Container.DrawingDocument.SetCursorType("sw-resize");
                           break;
                       }
                   }
               }
                else
                {
                    this.Container.DrawingDocument.SetCursorType("crosshair");
                }
                return true;
           }

           else
           {
               if(this.HitInBox(x, y)) {

                   this.Container.DrawingDocument.SetCursorType("move");
                   return true;
               }
           }

       }
       else if(this.Hit(x, y))
       {
            this.Container.DrawingDocument.SetCursorType("move");
                   return true;
       }
        return false;
    },

    Document_UpdateSelectionState : function() {

        if(this.txBody )
            var Doc = this.txBody.content;
        else
            return;
        if ( true === Doc.Is_SelectionUse() && !Doc.Selection_IsEmpty()) {
            this.Container.DrawingDocument.UpdateTargetTransform(this.TransformTextMatrix);
            this.Container.DrawingDocument.TargetEnd();
            this.Container.DrawingDocument.SelectEnabled(true);
            this.Container.DrawingDocument.SelectClear();
            this.Container.DrawingDocument.SelectShow();
        }
        else if(this.parent.elementsManipulator.Document.CurPos.Type == docpostype_FlowObjects ) {
            this.Container.DrawingDocument.UpdateTargetTransform(this.TransformTextMatrix);
            this.Container.DrawingDocument.TargetShow();
            this.Container.DrawingDocument.SelectEnabled(false);
        }
    },

    selectionSetStart : function(X,Y, PageIndex, MouseEvent)
    {
        if(this.txBody)
        {
            this.Container.DrawingDocument.UpdateTargetTransform(this.TransformTextMatrix);
            var tmp2 = global_MatrixTransformer.Invert(this.TransformTextMatrix);
            var Xt = tmp2.TransformPointX(X, Y);
            var Yt = tmp2.TransformPointY(X, Y);

            this.txBody.content.Selection_SetStart(Xt,Yt, PageIndex, MouseEvent);
            this.RecalculateCurPos();
        }
        else
        {
            return false;
        }
    },

    selectionSetEnd : function(X,Y, PageIndex, MouseEvent) {
        if(this.txBody )
            {
                var tmp2 = global_MatrixTransformer.Invert(this.TransformTextMatrix);
                var Xt = tmp2.TransformPointX(X, Y);
                var Yt = tmp2.TransformPointY(X, Y);
                return  this.txBody.content.Selection_SetEnd(Xt,Yt, PageIndex, MouseEvent);
            }
            else
            {
                return false;
            }
    },

    RecalculateCurPos : function() {
        if(this.txBody )
        {
            if(this.parent.kind == SLIDE_KIND)
            {
                this.Container.DrawingDocument.UpdateTargetTransform(this.TransformTextMatrix);
                this.txBody.recalculateCurPos();
            }
        }
    } ,

    Select_All : function() {
        if(this.txBody && this.txBody.content )
        {
            this.txBody.content.Select_All();
        }
    },

    Remove : function(Count, bOnlyText, bRemoveOnlySelection, bOnTextAdd) {
        if(this.txBody ) {

            this.txBody.content.Remove(Count, bOnlyText, bRemoveOnlySelection, bOnTextAdd)
        }
    },

    Cursor_MoveToStartPos : function()
    {
        if(this.txBody && this.txBody.content ) {

            this.txBody.content.Cursor_MoveToStartPos();
        }
    },

    Cursor_MoveToEndPos : function()
    {
        if(this.txBody && this.txBody.content ) {

            this.txBody.content.Cursor_MoveToEndPos();
        }
    },

    Cursor_MoveLeft : function(AddToSelect) {
        if(this.txBody ) {

            this.txBody.content.Cursor_MoveLeft(AddToSelect)
        }
    },

    Cursor_MoveRight : function(AddToSelect) {
        if(this.txBody ) {

            this.txBody.content.Cursor_MoveRight(AddToSelect)
        }
    },

    Cursor_MoveUp : function(AddToSelect) {
        if(this.txBody ) {

            this.txBody.content.Cursor_MoveUp(AddToSelect)
        }
    },

    Cursor_MoveDown : function(AddToSelect) {
        if(this.txBody ) {

            this.txBody.content.Cursor_MoveDown(AddToSelect)
        }
    },

    Add_NewParagraph : function(bRecalculate) {

        if(this.txBody ) {

            this.txBody.content.Add_NewParagraph(bRecalculate);
        }
    },


    setNumbering : function(numberingInfo) {

        if(this.txBody ) {

            this.txBody.content.Set_ParagraphNumbering(numberingInfo);
        }
    },

    Is_HdrFtr : function()
    {
        return false;
    },


    Set_ParagraphShd : function(shd)
    {
        if(this.txBody)
        {
            this.txBody.Set_ParagraphShd(shd);
        }
    },

    OnContentReDraw : function()
    {

    },

    Document_UpdateInterfaceTextState : function()
    {
        if(this.txBody && this.txBody.content)
        {
            this.txBody.content.Document_UpdateInterfaceState();
        }
    },

    Cursor_MoveEndOfLine : function(AddToSelect)
    {
        if(this.txBody != null && this.txBody.content != null)
        {
            this.txBody.content.Cursor_MoveEndOfLine(AddToSelect);
        }
    },

    Cursor_MoveStartOfLine : function(AddToSelect)
    {
        if(this.txBody != null && this.txBody.content != null)
        {
            this.txBody.content.Cursor_MoveStartOfLine(AddToSelect);
        }
    },

    Set_ParagraphSpacing : function(sp)
    {
        if(this.txBody)
        {
            if(this.txBody.content)
            {
                this.txBody.content.Set_ParagraphSpacing(sp);
                this.txBody.recalculate();
            }
        }
    },

    Set_ParagraphTabs : function(tabs)
    {
        if(this.txBody && this.txBody.content)
        {
            this.txBody.content.Set_ParagraphTabs(tabs);
            this.txBody.recalculate();
        }
    },

    Paragraph_ClearFormatting : function()
    {
        if(this.txBody && this.txBody.content)
        {
            return this.txBody.content.Paragraph_ClearFormatting();
        }
        return null;
    },

    Get_Paragraph_TextPr_Copy : function()
    {
        if(this.txBody && this.txBody.content)
        {
            return this.txBody.content.Get_Paragraph_TextPr_Copy();
        }
        return null;
    },

    Document_UpdateRulersState : function(margins)
    {
        if(this.txBody && this.txBody.content)
        {
            this.txBody.content.Document_UpdateRulersState(this.parent.num, this.getMargins());
        }
    },

    Get_TableStyleForPara: function()
    {
        return null;
    }
};


function CResizeMeasurer()
{

}