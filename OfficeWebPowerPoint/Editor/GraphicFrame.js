function CGraphicFrame(parent)
{
    this.parent = parent;
    this.Container = null;
    this.spPr = new CSpPr();
    this.spLocks = new CShapeLocks();
    this.spLocks.noGrp = true;
    this.nvGraphicFramePr = new UniNvPr();
    this.graphicObject = null;
    this.uri = null;

    this.pH = null;
    this.pV = null;

    this.off = null;
    this.ext = null;
    this.flipH = false;
    this.flipV = false;
    this.rot = 0;

    this.text_flag = true;

    this.tableStyleForParagraph = null;
}

CGraphicFrame.prototype =
{
    createFullCopy : function(parent, container)
    {
        var _copy = new CGraphicFrame(parent);
        _copy.setContainer(container);
        if(this.spLocks != null)
        {
            _copy.spLocks = this.spLocks.createCopy();
        }
        if(this.nvGraphicFramePr != null)
        {
            _copy.nvGraphicFramePr = this.nvGraphicFramePr.createDuplicate();
        }
        _copy.spPr = this.spPr.createDuplicate();

        if(_copy.nvGraphicFramePr == null)
        {
            _copy.nvGraphicFramePr = new UniNvPr();
        }
        _copy.nvGraphicFramePr.cNvPr.id = ++parent.maxId;

        _copy.pH = this.pH;
        _copy.pV = this.pV;
        _copy.ext = clone(this.ext);
        _copy.off = clone(this.off);
        _copy.rot = this.rot;
        _copy.flipH = this.flipH;
        _copy.flipV = this.flipV;
        if(this.graphicObject !== null && typeof this.graphicObject === "object" && typeof this.graphicObject.Copy === "function")
        {
            _copy.graphicObject = this.graphicObject.Copy(_copy);
        }
        return _copy;
    },

    createCopy : function(parent, container, posX, posY, _font_flag)//копирование фигуры для последующей вставки на слайд.
    {
        var _history_is_on = History.Is_On();
        if(_history_is_on)
        {
            History.TurnOff();
        }
        var _copied_shape = new CGraphicFrame(parent);
        _copied_shape.setContainer(container);

        _copied_shape.spPr = this.spPr.createDuplicate();
        _copied_shape.spPr.xfrm.offX = posX;
        _copied_shape.spPr.xfrm.offY = posY;
        _copied_shape.spPr.xfrm.extX = this.ext.cx;
        _copied_shape.spPr.xfrm.extY = this.ext.cy;
        _copied_shape.spPr.xfrm.rot = this.rot;
        _copied_shape.spPr.xfrm.flipH = this.flipH;
        _copied_shape.spPr.xfrm.flipV = this.flipV;
        _copied_shape.nvGraphicFramePr = new UniNvPr();
        _copied_shape.nvGraphicFramePr.cNvPr.id = ++parent.maxId;
        if(this.graphicObject !== null && typeof this.graphicObject === "object" && typeof this.graphicObject.Copy === "function")
            _copied_shape.graphicObject = this.graphicObject.Copy(_copied_shape);
        if(this.TransformMatrix !== null && typeof this.TransformMatrix === "object")
            _copied_shape.TransformMatrix = this.TransformMatrix.CreateDublicate();
        if(_history_is_on)
        {
            History.TurnOn();
        }
        return _copied_shape;
    },


    Is_TableCellContent: function()
    {
        return false;
    },

    Get_SelectedText: function(bClear)
    {
        if(this.graphicObject !== null && typeof this.graphicObject === "object" && typeof this.graphicObject.Get_SelectedText === "function")
            return this.graphicObject.Get_SelectedText(bClear);
        return null;
    },

    calculate: function()
    {
        var _compiled_xfrm = new CXfrm();
        var _layout = null, _master = null;
        if(this.isPlaceholder())
        {
            if(typeof this.parent === "object" && this.parent !== null)
            {
                switch(this.parent.kind)
                {
                    case SLIDE_KIND:
                    {
                        _layout = this.parent.Layout;
                        if(typeof _layout === "object" && _layout !== null)
                        {
                            _master =_layout.Master;
                        }
                        break;
                    }
                    case LAYOUT_KIND:
                    {
                        _master = this.parent.Master;
                    }
                }
                var _ph_type = this.getPhType();
                var _ph_index = this.getPhIndex();
                if(typeof _master === "object" && _master !== null)
                {
                    var _master_shape = _master.getMatchingShape(_ph_type, _ph_index);
                    if(typeof _master_shape === "object" && _master_shape != null && _master_shape.spPr != null && _master_shape.spPr.xfrm != null)
                    {
                        _compiled_xfrm.merge(_master_shape.spPr.xfrm);
                    }
                }
                if(typeof  _layout === "object" && _layout !== null)
                {
                    var _layout_shape = _layout.getMatchingShape(_ph_type, _ph_index);
                    if(typeof _layout_shape === "object" && _layout_shape != null && _layout_shape.spPr != null && _layout_shape.spPr.xfrm != null)
                    {
                        _compiled_xfrm.merge(_layout_shape.spPr.xfrm);
                    }
                }
            }
        }
        _compiled_xfrm.merge(this.spPr.xfrm);

        var _re_merge_xfrm = false;
        if(_compiled_xfrm.offX === null)
        {
            this.spPr.xfrm.offX = 0;
            _re_merge_xfrm = true;
        }

        if(_compiled_xfrm.offY === null)
        {
            this.spPr.xfrm.offY = 0;
            _re_merge_xfrm = true;
        }

        if(_compiled_xfrm.extX === null)
        {
            var _width;
            if(typeof this.graphicObject === "object" && this.graphicObject !== null && typeof this.graphicObject.getWidth === "function" && typeof typeof(_width = this.graphicObject.getWidth())  === "number")
            {
                this.spPr.xfrm.extX = _width;
            }
            else
            {
                this.spPr.xfrm.extX = 10;
            }
            _re_merge_xfrm = true;
        }
        if(_compiled_xfrm.extY === null)
        {
            var _height;
            if(typeof this.graphicObject === "object" && this.graphicObject !== null && typeof this.graphicObject.getHeight === "function" && typeof typeof(_height = this.graphicObject.getHeight())  === "number")
            {
                this.spPr.xfrm.extY = _height;
            }
            else
            {
                this.spPr.xfrm.extY = 10;
            }
            _re_merge_xfrm = true;
        }
        if(_re_merge_xfrm === true)
        {
            _compiled_xfrm.merge(this.spPr.xfrm);
        }

        this.pH = _compiled_xfrm.offX;
        this.pV = _compiled_xfrm.offY;
        this.ext = {};
        this.ext.cx = _compiled_xfrm.extX;
        this.ext.cy = _compiled_xfrm.extY;
        this.off = {x: 0, y: 0};
        this.flipH = false;
        this.flipV = false;
        this.rot = 0;

        this.calculateTextTheme();
        this.calculateNumbering();
        if(this.graphicObject !== null && typeof this.graphicObject === "object" && typeof this.graphicObject.Recalculate === "function")
        {
            this.graphicObject.Recalculate();
        }
        this.RecalculateTransformMatrix();
        this.RecalculateSize();
    },

    calculateTextTheme: function()
    {
        if(this.graphicObject !== null && typeof this.graphicObject === "object" && typeof this.graphicObject.calculateTextTheme === "function")
        {
            var theme = null, layout = null, master = null, slide = null;

            switch(this.parent.kind)
            {
                case SLIDE_KIND :
                {

                    slide = this.parent;
                    layout = this.parent.Layout;
                    if(layout!=null)
                    {
                        master = layout.Master;
                        if(master!=null)
                        {
                            theme = master.Theme;
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
                    }
                    break;
                }
            }
            this.graphicObject.calculateTextTheme(theme, slide, layout, master, null);
        }

    },

    updateCursorTypes: function()
    {},

    calculateNumbering: function()
    {
        if(this.graphicObject !== null && typeof this.graphicObject === "object" && typeof this.graphicObject.calculateNumbering === "function")
        {
            this.graphicObject.calculateNumbering();
        }
    },

    isPlaceholder: function()
    {
        return this.nvGraphicFramePr.nvPr.ph !== null;
    },

    getPhType: function()
    {
        if(this.isPlaceholder())
        {
            return this.nvGraphicFramePr.nvPr.ph.type;
        }
        return null;
    },

    getXfrm : function ()
    {
        var xfrm = new CXfrm();
        xfrm.offX = this.pH;
        xfrm.offY = this.pV;
        xfrm.extX = this.ext.cx;
        xfrm.extY = this.ext.cy;
        return xfrm;
        return this.spPr.xfrm;
    },

    getPhIndex: function()
    {
        if(this.isPlaceholder())
        {
            return this.nvGraphicFramePr.nvPr.ph.idx;
        }
        return null;
    },

    Draw: function(graphics)
    {

        if(this.graphicObject !== null && typeof this.graphicObject === "object" && this.graphicObject.Draw)
        {

            graphics.transform3(this.TransformMatrix);
            graphics.SetIntegerGrid(true);
            this.graphicObject.Draw(0, graphics);
            graphics.SetIntegerGrid(true);
            graphics.reset();
        }
    },

    Select: function()
    {},

    Get_Styles: function(level, bTablesStyleId, bParagraph)
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

        if(bParagraph && false)
        {
            var isPlaceholder = this.isPlaceholder();
            if(isPlaceholder)
            {
                var phId = this.nvGraphicFramePr.nvPr.ph.idx, phType = this.nvGraphicFramePr.nvPr.ph.type;
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
        }


        if(typeof bTablesStyleId === "number")
        {
            if(presentation !== null && typeof presentation === "object")
            {
                if(Array.isArray(presentation.globalTableStyles) && presentation.globalTableStyles[bTablesStyleId] instanceof CStyle)
                {
                    Styles.Style[Styles.Id] = presentation.globalTableStyles[bTablesStyleId];
                    ++Styles.Id;
                }
            }
        }
        return Styles;
    },

    Get_StartPage_Absolute: function()
    {
        return this.parent.num;
    },
    Get_PageContentStartPos: function()
    {
       if(this.parent.kind == SLIDE_KIND)
       {
           return this.parent.Layout.Master.presentation.Get_PageContentStartPos( this.parent.num );
       }
            return {
                X : this.pH+this.ext.cx,
                XLimit: this.ext.cx,
                Y : this.pV+this.ext.cy,
                YLimit : this.ext.cy,
                MaxTopBorder : 0};


    },

    IsGroup: function()
    {
        return false;
    },

    setContainer: function(container)
    {
        this.Container = container;
    },

    setParent: function(parent)
    {
        this.parent = parent;
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

        global_MatrixTransformer.TranslateAppend(localTransform, xc, yc);

        var tmp = this.Container.getTransform();
        global_MatrixTransformer.MultiplyAppend(localTransform, tmp);
        return localTransform;
    },

    RecalculateTransformMatrix: function()
    {
        this.TransformMatrix = this.getTransform();
        this.TransformTextMatrix = this.TransformMatrix;
    },

    HitInBox: function(x, y)//проверяет поппали ли в границу box'а
    {
       var x_lt, y_lt;
       var hc, vc, sin, cos;

       hc=this.ext.cx*0.5;
       vc=this.ext.cy*0.5;

       sin=Math.sin(this.rot);
       cos=Math.cos(this.rot);

       x_lt=-hc*cos+vc*sin+this.pH+hc;
       y_lt=-hc*sin-vc*cos+this.pV+vc;

       var tx=x-x_lt, ty=y-y_lt;

       var vx, vy;

       vx=tx*cos+ty*sin;
       vy=-tx*sin+ty*cos;

       var context=this.Container.DrawingDocument.CanvasHitContext;
       context.beginPath();
       return (HitInLine(context, vx, vy, 0, 0, this.ext.cx, 0) ||
           HitInLine(context, vx, vy, this.ext.cx, 0, this.ext.cx, this.ext.cy)||
           HitInLine(context, vx, vy, this.ext.cx, this.ext.cy, 0, this.ext.cy)||
           HitInLine(context, vx, vy, 0, this.ext.cy, 0, 0) ||
           HitInLine(context, vx, vy, this.ext.cx*0.5, 0, this.ext.cx*0.5, -this.Container.DrawingDocument.GetMMPerDot(TRACK_DISTANCE_ROTATE)));
    },

    Hit: function(x, y)
    {
        return this.HitInBox(x, y);
    },

    HitInPath: function()
    {
        return false;
    },

   HitAdj: function()
   {
       return false;
   },

    HitHandle: function(x, y)
    {
        return false;
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

        var tx = x-x_lt, ty = y-y_lt;

        var vx, vy;


            vx=tx*cos+ty*sin;
            vy=-tx*sin+ty*cos;
         if(this.flipH)
            vx=this.ext.cx-vx;
        if(this.flipV)
            vy=this.ext.cy-vy;
        return vx > 0 && vx < this.ext.cx && vy > 0 && vy < this.ext.cy;
    },


    Recalculate: function()
    {
        this.graphicObject.Recalculate();
        this.RecalculateTransformMatrix();
    },

    IsLine: function()
    {
        return false;
    },


    createDuplicateForTrack : function(container)
    {
        var _duplicate = new CShape(this.parent);
        _duplicate.setContainer(container);
        _duplicate.pH = this.pH;
        _duplicate.pV = this.pV;
        _duplicate.ext.cx = this.ext.cx;
        _duplicate.ext.cy = this.ext.cy;
        _duplicate.rot = this.rot;
        _duplicate.flipH = this.flipH;
        _duplicate.flipV = this.flipV;

        return _duplicate;
    },

    Move: function(pH, pV)
    {
        this.pH=pH;
        this.pV=pV;
        this.RecalculateTransformMatrix();
    },

    calculateXfrm: function()
    {},

    isEmptyPlaceholder: function()
    {
        return false;
    },

    Get_SelectionState: function()
    {
        if(this.graphicObject !== null && typeof this.graphicObject === "object" && typeof this.graphicObject.Get_SelectionState === "function")
        {
            return this.graphicObject.Get_SelectionState();
        }
        return null;
    },

    selectionSetStart: function(X,Y, PageIndex, MouseEvent)
    {
       if(this.graphicObject !== null && typeof this.graphicObject === "object" && typeof this.graphicObject.Selection_SetStart === "function")
        {
            this.Container.DrawingDocument.UpdateTargetTransform(this.TransformMatrix);
            var tmp2 = global_MatrixTransformer.Invert(this.TransformMatrix);
            var Xt = tmp2.TransformPointX(X, Y);
            var Yt = tmp2.TransformPointY(X, Y);
            if(typeof this.graphicObject.Internal_CheckBorders === "function")
            {
                var t  = this.graphicObject.Internal_CheckBorders( Xt, Yt, PageIndex );
                var borders;
                if(t !== null && typeof t === "object")
                    borders = t.Border;
                else if(!isNaN(t) && typeof t === "number")
                    borders = t;
                else
                    borders = -1;
                if(borders !== -1)
                {
                    History.Create_NewPoint();
                }
            }
            this.graphicObject.Selection_SetStart(Xt,Yt, PageIndex, MouseEvent);
            this.RecalculateCurPos();
        }
    },

    selectionSetEnd: function(X,Y, PageIndex, MouseEvent)
    {
       if(this.graphicObject !== null && typeof this.graphicObject === "object" && typeof this.graphicObject.Selection_SetEnd === "function")
        {
            this.Container.DrawingDocument.UpdateTargetTransform(this.TransformMatrix);
            var tmp2 = global_MatrixTransformer.Invert(this.TransformMatrix);
            var Xt = tmp2.TransformPointX(X, Y);
            var Yt = tmp2.TransformPointY(X, Y);

            this.graphicObject.Selection_SetEnd(Xt,Yt, PageIndex, MouseEvent);
            this.RecalculateCurPos();
            if(MouseEvent.Type === g_mouse_event_type_up)
            {
                this.Container.Document.Document_UpdateInterfaceState();
            }
        }
    },


    Document_UpdateSelectionState : function()
    {
        /*if(this.graphicObject instanceof CTable)
        {
            if ( true === this.graphicObject.Is_SelectionUse() )
            {
                if (table_Selection_Border_InnerTable === this.graphicObject.Selection.Type2 )
                {
                    // Убираем курсор, если он был
                    this.Container.DrawingDocument.UpdateTargetTransform(this.TransformMatrix);
                    this.Container.DrawingDocument.TargetEnd();
                }
                else if(this.graphicObject.Selection.Type2 !== table_Selection_Border)
                {
                    this.Container.DrawingDocument.UpdateTargetTransform(this.TransformMatrix);
                    this.Container.DrawingDocument.TargetEnd();
                    this.Container.DrawingDocument.SelectEnabled(true);
                    this.Container.DrawingDocument.SelectClear();

                    this.graphicObject.Selection_Draw();

                    this.Container.DrawingDocument.SelectShow();
                }
            }
            else
            {
                this.Container.DrawingDocument.UpdateTargetTransform(this.TransformMatrix);
                this.graphicObject.RecalculateCurPos();
                this.Container.DrawingDocument.SelectEnabled(false);
                this.Container.DrawingDocument.TargetStart();
                this.Container.DrawingDocument.TargetShow();
            }
        }   */

        if ( true === this.graphicObject.Is_SelectionUse() )
        {
            if ( table_Selection_Border === this.graphicObject.Selection.Type2 || table_Selection_Border_InnerTable === this.graphicObject.Selection.Type2 )
            {
                // Убираем курсор, если он был
                this.Container.DrawingDocument.TargetEnd();
            }
            else
            {
                if ( false === this.graphicObject.Selection_IsEmpty() )
                {
                    this.Container.DrawingDocument.TargetEnd();
                    this.Container.DrawingDocument.SelectEnabled(true);
                    this.Container.DrawingDocument.SelectClear();

                    this.graphicObject.Selection_Draw();

                    this.Container.DrawingDocument.SelectShow();
                }
                else
                {
                    this.graphicObject.RecalculateCurPos();
                    this.Container.DrawingDocument.SelectEnabled(false);
                    this.Container.DrawingDocument.TargetStart();
                    this.Container.DrawingDocument.TargetShow();
                }
            }
        }
        else
        {
            this.graphicObject.RecalculateCurPos();
            this.Container.DrawingDocument.SelectEnabled(false);
            this.Container.DrawingDocument.TargetStart();
            this.Container.DrawingDocument.TargetShow();
        }
    },

    RecalculateCurPos: function()
    {
        if(this.graphicObject !== null && typeof this.graphicObject === "object" && typeof this.graphicObject.RecalculateCurPos === "function")
        {
            this.graphicObject.RecalculateCurPos();
        }
    },

    Selection_Is_OneElement: function()
    {
        return true;
    },


    Paragraph_Add: function( ParaItem, bRecalculate)
    {
        if(this.graphicObject !== null && typeof this.graphicObject === "object" && typeof this.graphicObject.Paragraph_Add === "function")
        {
            this.graphicObject.Paragraph_Add(ParaItem, bRecalculate);
            this.RecalculateSize();
        }
    },

    Add_NewParagraph: function(bRecalculate)
    {
        if(this.graphicObject !== null && typeof this.graphicObject === "object" && typeof this.graphicObject.Add_NewParagraph === "function")
        {
            this.graphicObject.Add_NewParagraph(bRecalculate);
            this.RecalculateSize();
        }
    },

    RecalculateContent2: function()
    {

        /*if(this.graphicObject !== null && typeof this.graphicObject === "object"
            && typeof this.graphicObject.CurCell !== null && typeof this.graphicObject.CurCell === "object"
            && typeof this.graphicObject.CurCell.txBody !== null && typeof this.graphicObject.CurCell.txBody === "object"
            && typeof this.graphicObject.CurCell.txBody.recalculate2 === "function")
        {
            this.graphicObject.CurCell.txBody.recalculate2(this);
        }*/

    },

    OnContentRecalculate: function(bChange, bForceRecalc, docIndex, child )
    {
        this.RecalculateSize();
        if(this.parent.kind === SLIDE_KIND && child === this.graphicObject)
        {
            this.Container.DrawingDocument.OnRecalculatePage(this.parent.num, this.parent);
        }
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
        data.undo_function.call(this, data);
    },

    Redo: function(data)
    {
        data.redo_function.call(this, data);
    },


    Set_SelectionState : function(State, idx)
    {
        if(this.graphicObject !== null && typeof this.graphicObject === "object" && typeof this.graphicObject.Set_SelectionState === "function")
        {
            this.Container.DrawingDocument.UpdateTargetTransform(this.TransformMatrix);
            this.graphicObject.Set_SelectionState(State, idx)
        }
    },

    Remove: function(Count, bOnlyText, bRemoveOnlySelection)
    {
        if(this.graphicObject !== null && typeof this.graphicObject === "object" && typeof this.graphicObject.Remove === "function")
        {
            this.graphicObject.Remove(Count, bOnlyText, bRemoveOnlySelection);
            this.RecalculateSize();
        }
    },

    RecalculateContent: function()
    {
        if(this.graphicObject !== null && typeof this.graphicObject === "object" && typeof this.graphicObject.RecalculateContent === "function")
        {
            this.graphicObject.RecalculateContent();
        }
    },

    RecalculateSize: function()
    {
        if(this.graphicObject instanceof CTable)
        {
            /*var _rows_info = this.graphicObject.RowsInfo;
            var _row_index;
            var _row_count = _rows_info.length;
            var _height = 0;
            for(_row_index = 0; _row_index < _row_count; ++_row_index)
            {
                _height += _rows_info[_row_index].H[0];
            }
            this.ext.cy = _height;

            this.ext.cx = this.graphicObject.XLimit;*/
            this.graphicObject.XLimit -= this.graphicObject.X;
            this.graphicObject.YLimit -= this.graphicObject.Y;
            this.graphicObject.X = 0;
            this.graphicObject.Y = 0;
            var _page_bounds = this.graphicObject.Get_PageBounds(0);
            this.ext.cy = _page_bounds.Bottom - _page_bounds.Top;
            this.ext.cx = _page_bounds.Right - _page_bounds.Left;
        }
    },
    Cursor_MoveLeft : function(AddToSelect)
    {
        if(this.graphicObject !== null && typeof this.graphicObject === "object" && typeof this.graphicObject.Cursor_MoveRight === "function")
        {
            this.graphicObject.Cursor_MoveLeft(null, AddToSelect);
        }
    },

    Cursor_MoveRight : function(AddToSelect)
    {
        if(this.graphicObject !== null && typeof this.graphicObject === "object" && typeof this.graphicObject.Cursor_MoveRight === "function")
        {
            this.graphicObject.Cursor_MoveRight(null, AddToSelect);
        }
    },

    Cursor_MoveUp : function(AddToSelect)
    {
        if(this.graphicObject !== null && typeof this.graphicObject === "object" && typeof this.graphicObject.Cursor_MoveUp === "function")
        {
            this.graphicObject.Cursor_MoveUp(null, AddToSelect);
        }
    },

    Cursor_MoveDown : function(AddToSelect)
    {
        if(this.graphicObject !== null && typeof this.graphicObject === "object" && typeof this.graphicObject.Cursor_MoveDown === "function")
        {
            this.graphicObject.Cursor_MoveDown(null, AddToSelect);
        }
    },

    Cursor_MoveEndOfLine : function(AddToSelect)
    {
        if(this.graphicObject !== null && typeof this.graphicObject === "object" && typeof this.graphicObject.Cursor_MoveEndOfLine === "function")
        {
            this.graphicObject.Cursor_MoveEndOfLine(null, AddToSelect);
        }
    },

    Cursor_MoveStartOfLine : function(AddToSelect)
    {
        if(this.graphicObject !== null && typeof this.graphicObject === "object" && typeof this.graphicObject.Cursor_MoveStartOfLine === "function")
        {
            this.graphicObject.Cursor_MoveStartOfLine(null, AddToSelect);
        }
    },

    Is_TopDocument: function()
    {
        return false;
    },

    prepareToChangeTheme: function()
    {
        if(this.graphicObject !== null && typeof this.graphicObject === "object")
        {
            if(this.graphicObject.CompiledPr !== null && typeof this.graphicObject.CompiledPr === "object")
            {
                this.graphicObject.CompiledPr.NeedRecalc = true;
            }
        }
    },
    calculate2: function()
    {
        this.calculateColors();
    },

    calculateColors: function()
    {
        if(this.graphicObject !== null && typeof  this.graphicObject === "object"
            && typeof  this.graphicObject.Recalc_CompiledPr === "function" && typeof  this.graphicObject.Recalculate === "function")
        {
            this.graphicObject.Recalc_CompiledPr();
            this.graphicObject.calculateTextTheme();
            this.graphicObject.Recalculate();
        }
    },

    calculateUniFills: function()
    {
        if(this.graphicObject !== null && typeof  this.graphicObject === "object"
            && typeof  this.graphicObject.Recalc_CompiledPr === "function" && typeof  this.graphicObject.Recalculate === "function")
        {
            this.graphicObject.Recalc_CompiledPr();
            this.graphicObject.Recalculate();
        }
    },

    getParagraphParaPr: function()
    {
        if(this.graphicObject !== null && typeof this.graphicObject === "object"
            && typeof this.graphicObject.Set_ApplyToAll === "function"
            && typeof this.graphicObject.Get_Paragraph_ParaPr === "function")
        {
            var _ret_para_pr;
            this.graphicObject.Set_ApplyToAll(true);
            _ret_para_pr =  this.graphicObject.Get_Paragraph_ParaPr();
            this.graphicObject.Set_ApplyToAll(false);
            return _ret_para_pr;
        }
    },

    getParagraphTextPr: function()
    {
        if(this.graphicObject !== null && typeof this.graphicObject === "object"
            && typeof this.graphicObject.Set_ApplyToAll === "function"
            && typeof this.graphicObject.Get_Paragraph_TextPr === "function")
        {
            var _ret_para_pr;
            this.graphicObject.Set_ApplyToAll(true);
            _ret_para_pr =  this.graphicObject.Get_Paragraph_TextPr();
            this.graphicObject.Set_ApplyToAll(false);
            return _ret_para_pr;
        }
    },

    Document_UpdateInterfaceTextState: function()
    {
        if(this.graphicObject !== null && typeof this.graphicObject === "object" && typeof this.graphicObject.Document_UpdateInterfaceTextState === "function")
        {
            this.graphicObject.Document_UpdateInterfaceTextState();
        }
    },

    canIncreaseIndent: function(bIncrease)
    {
        if(this.graphicObject !== null && typeof this.graphicObject === "object" && typeof this.graphicObject.canIncreaseIndent === "function")
        {
            return this.graphicObject.canIncreaseIndent(bIncrease);
        }
        return false;
    },

    updateInterfaceTextState: function()
    {
        if(this.graphicObject !== null && typeof this.graphicObject === "object" && typeof this.graphicObject.Document_UpdateInterfaceState === "function")
        {
            return this.graphicObject.Document_UpdateInterfaceState();
        }
    },

    Set_ParagraphAlign: function(Align)
    {
        if(this.graphicObject !== null && typeof this.graphicObject === "object" && typeof this.graphicObject.Set_ParagraphAlign === "function")
        {
            this.graphicObject.Set_ParagraphAlign(Align);
        }
    },


    Set_ParagraphSpacing: function(spcing)
    {
        if(this.graphicObject !== null && typeof this.graphicObject === "object" && typeof this.graphicObject.Set_ParagraphSpacing === "function")
        {
            this.graphicObject.Set_ParagraphSpacing(spcing);
        }
    },

    OnContentReDraw: function()
    {
        this.Container.DrawingDocument.OnRecalculatePage(this.parent.num, this.parent)
    },

    Selection_Stop: function( X, Y, PageIndex, MouseEvent )
    {
        if(this.graphicObject !== null && typeof this.graphicObject === "object" && typeof this.graphicObject.Selection_Stop === "function")
        {
            this.graphicObject.Selection_Stop(X, Y, PageIndex, MouseEvent);
        }
    },

    Set_ParagraphIndent: function(indent)
    {
        if(this.graphicObject !== null && typeof this.graphicObject === "object" && typeof  this.graphicObject.Set_ParagraphIndent === "function" )
        {
            this.graphicObject.Set_ParagraphIndent(indent);
        }
    },

    Get_TableStyleForPara: function(styleIndex)
    {

    },

    getStylesForParagraph: function(level)
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
            var phId = this.nvGraphicFramePr.nvPr.ph.idx, phType = this.nvGraphicFramePr.nvPr.ph.type;
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

        return Styles;
    },

    changeProportions: function(kW, kH)
    {},

    updateProportions: function(kW, kH)
    {},

    paragraphAddTextPr: function(textPr)
    {
        if(this.graphicObject instanceof  CTable)
        {
            this.graphicObject.Set_ApplyToAll(true);
            this.graphicObject.Paragraph_Add(textPr);
            this.graphicObject.Set_ApplyToAll(false);
        }
    },

    Get_Paragraph_ParaPr : function()
    {
        if(this.graphicObject !== null && typeof this.graphicObject === "object" && typeof this.graphicObject.Get_Paragraph_ParaPr === "function")
            return this.graphicObject.Get_Paragraph_ParaPr();
        return null;
    },

    Get_Paragraph_TextPr : function()
    {
        if(this.graphicObject !== null && typeof this.graphicObject === "object" && typeof this.graphicObject.Get_Paragraph_TextPr === "function")
            return this.graphicObject.Get_Paragraph_TextPr();
        return null;
    },

    setParagraphAlign: function(align)
    {
        if(this.graphicObject !== null && typeof  this.graphicObject === "object"
            && typeof this.graphicObject.Set_ApplyToAll === "function" && typeof this.graphicObject.Set_ParagraphAlign === "function")
        {
            this.graphicObject.Set_ApplyToAll(true);
            this.graphicObject.Set_ParagraphAlign(align);
            this.graphicObject.Set_ApplyToAll(false);
        }
    },

    setParagraphNumbering: function(numInfo)
    {
        if(this.graphicObject !== null && typeof  this.graphicObject === "object"
            && typeof this.graphicObject.Set_ApplyToAll === "function" && typeof this.graphicObject.Set_ParagraphNumbering === "function")
        {
            var _history_obj = {};
            _history_obj.undo_function = function(data)
            {
                this.graphicObject.Recalculate();
            };

            _history_obj.redo_function = function(data)
            {

            };

            History.Add(this, _history_obj);
            this.graphicObject.Set_ApplyToAll(true);
            this.graphicObject.Set_ParagraphNumbering(numInfo);
            this.graphicObject.Set_ApplyToAll(false);
            this.graphicObject.Recalculate();


            _history_obj = {};
            _history_obj.undo_function = function(data)
            {
            };

            _history_obj.redo_function = function(data)
            {
                this.graphicObject.Recalculate();
            };

            History.Add(this, _history_obj);
        }
    },

    setNumbering: function(numInfo)
    {
        if(this.graphicObject !== null && typeof  this.graphicObject === "object"
            && typeof this.graphicObject.Set_ParagraphNumbering === "function")
        {
            this.graphicObject.Set_ParagraphNumbering(numInfo);
        }
    },

    hitToHyperlink: function(x, y)
    {
        if(this.graphicObject !== null && typeof this.graphicObject === "object" && typeof this.graphicObject.hitToHyperlink === "function")
            return this.graphicObject.hitToHyperlink(x - this.pH, y - this.pV);
        return false;
    },

    Hyperlink_CanAdd: function()
    {
        if(this.graphicObject !== null && typeof this.graphicObject === "object" && typeof this.graphicObject.Hyperlink_CanAdd === "function")
            return this.graphicObject.Hyperlink_CanAdd();
        return false;
    },

    Hyperlink_Add: function(HyperProps)
    {
        if(this.graphicObject !== null && typeof this.graphicObject === "object" && typeof this.graphicObject.Hyperlink_Add === "function")
            return this.graphicObject.Hyperlink_Add(HyperProps);
        return false;
    },

    Hyperlink_Modify: function(HyperProps)
    {
        if(this.graphicObject !== null && typeof this.graphicObject === "object" && typeof this.graphicObject.Hyperlink_Modify === "function")
            return this.graphicObject.Hyperlink_Modify(HyperProps);
        return false;
    },

    Hyperlink_Remove: function()
    {
        if(this.graphicObject !== null && typeof this.graphicObject === "object" && typeof this.graphicObject.Hyperlink_Remove === "function")
            return this.graphicObject.Hyperlink_Remove();
        return false;
    },

    Hyperlink_Check : function(bCheckEnd)
    {
        if(this.graphicObject !== null && typeof this.graphicObject === "object" && typeof this.graphicObject.Hyperlink_Remove === "function")
            return this.graphicObject.Hyperlink_Check(bCheckEnd);
        return null;
    } ,

    Document_UpdateRulersState: function()
    {
        if(this.graphicObject !== null && typeof this.graphicObject === "object" && typeof this.graphicObject.Document_UpdateRulersState === "function")
            return this.graphicObject.Document_UpdateRulersState(0);

        //this.DrawingDocument.Set_RulerState_Paragraph( null );
    },

    Update_Position: function()
    {
        this.RecalculateSize();
    }


};