// TODO: Что надо сделать в параграфе:
//       0. !!!!! Сделать статистику следующих элементов: Число слов, Абзацев, Знаков, Знаков и пробелов.
//       1. При пересчете параграфа, если он начинается с новой страницы, тогда не надо вверху добавлять
//          расстояние. Аналогично, не надо добавлять расстояние после параграфа при проверке, убирается
//          ли он на странице.
//       2. Реализовать неразрывный параграф.
//       3. Сделать обработку висячих строк.

// При добавлении нового элемента ParagraphContent, добавить его обработку в
// следующие функции:
// Internal_Recalculate1, Internal_Recalculate2, Draw, Internal_RemoveBackward,
// Internal_RemoveForward, Add, Internal_GetStartPos, Internal_MoveCursorBackward,
// Internal_MoveCursorForward, Internal_AddTextPr, Internal_GetContentPosByXY,
// Selection_SetEnd, Selection_CalculateTextPr, IsEmpty, Selection_IsEmpty,
// Cursor_IsStart, Cursor_IsEnd, Is_ContentOnFirstPage
var type_Paragraph = 0x0001;

var UnknownValue  = null;

// Класс Paragraph
function Paragraph(DrawingDocument, Parent, PageNum, X, Y, XLimit, YLimit)
{
    this.Id = g_oIdCounter.Get_NewId();

    this.Prev = null;
    this.Next = null;

    this.Index = 0;

    this.Parent  = Parent;
    this.PageNum = PageNum;

    this.X      = X;
    this.Y      = Y;
    this.XLimit = XLimit;
    this.YLimit = YLimit;

    this.CompiledPr =
    {
        Pr         : null,  // Скомпилированный (окончательный стиль параграфа)
        NeedRecalc : true   // Нужно ли пересчитать скомпилированный стиль
    };
    this.Pr = new CParaPr();
    //this.Pr.Jc = align_Center;

    // Данный TextPr будет относится только к символу конца параграфа
    this.TextPr = new ParaTextPr();
    this.TextPr.Parent = this;

    this.Bounds = new CDocumentBounds( X, Y, X_Right_Field, Y );

    this.Lines      = new Array(); // Массив элементов CParaLine
    this.RecalcInfo = new CParaRecalcInfo();

    // Данная структура нужна для (возможной) разбивки на страницы
    this.Pages    = new Array();
    this.Pages[0] = new CParaPage(X, Y, XLimit, YLimit, 0);

    // Добавляем в контент элемент "конец параграфа"
    this.Content = new Array();
    this.Content[0] = new ParaPresentationNumbering();
    this.Content[1] = new ParaEnd();
    this.Content[2] = new ParaEmpty();

    this.CurPos  =
    {
        X          : 0,
        Y          : 0,
        ContentPos : 1,
        RealX      : 0, // позиция курсора, без учета расположения букв
        RealY      : 0, // это актуально для клавиш вверх и вниз
        PagesPos   : 0  // позиция в массиве this.Pages
    };

    this.Selection =
    {
        Start    : false,
        Use      : false,
        StartPos : 0,
        EndPos   : 0,
        Flag     : selectionflag_Common
    };


    this.NeedReDraw = true;
    this.DrawingDocument = DrawingDocument;

    this.TurnOffRecalcEvent = false;

    this.ApplyToAll = false; // Специальный параметр, используемый в ячейках таблицы.
                             // True, если ячейка попадает в выделение по ячейкам.

    this.Lock = new CLock(); // Зажат ли данный параграф другим пользователем
    if ( false === g_oIdCounter.m_bLoad )
    {
        this.Lock.Set_Type( locktype_Mine, false );
        CollaborativeEditing.Add_Unlock2( this );
    }

    this.DeleteCollaborativeMarks = true;
    this.DeleteCommentOnRemove    = true; // Удаляем ли комменты в функциях Internal_Content_Remove

    this.m_oContentChanges = new CContentChanges(); // список изменений(добавление/удаление элементов)

    // Свойства необходимые для презентаций
    this.PresentationPr =
    {
        Level  : 0,
        Bullet : new CPresentationBullet()
    };

    this.FontMap =
    {
        Map        : {},
        NeedRecalc : true
    };

    this.rPr = {};
    var unifill = new CUniFill();
    unifill.fill = new CSolidFill();
    unifill.fill.color.color = new CSchemeColor();
    unifill.fill.color.color.id = 10; // folHlink

    this.folHlinkColor = {};
    this.folHlinkColor.unifill = unifill;
    this.folHlinkColor.Color = {r:128, g:0, b:151};
    // Добавляем данный класс в таблицу Id (обязательно в конце конструктора)
    g_oTableId.Add( this, this.Id );
}

Paragraph.prototype =
{
    getFirstTextProperties: function()
    {
        var _content = this.Content;
        var _content_count = _content.length;
        var _content_index;
        for(_content_index = 0; _content_index < _content_count; ++_content_index)
        {
            if(_content[_content_index].Type === para_TextPr)
            {
                return _content[_content_index].Value;
            }
            if(_content[_content_index].Type === para_Text)
            {
                return null;
            }
        }
        return null;
    },

    setFirstTextProperties: function(textProperties)
    {
        var _b_history_is_on = History.Is_On();
        if(_b_history_is_on)
        {
            History.TurnOff();
        }
        this.Internal_Content_Add(1, new ParaTextPr(textProperties));
        if(_b_history_is_on)
        {
            History.TurnOn();
        }
    },

    getParagraphProperties: function()
    {
        return this.Pr;
    },

    setParagraphProperties: function(paragraphProperties)
    {

            this.Pr.Set_FromObject(paragraphProperties);
    },

    calculateTextTheme : function(theme, slide, layout, master, fontRef)
    {
        this.CompiledPr.NeedRecalc = true;
        if(this.rPr.unifill && this.rPr.unifill.fill)
        {
            var brush = null;
            var RGBA = {R:0, G:0, B:0, A:255};
            if (theme && this.style!=null && fontRef!=null)
            {
                brush = theme.getFillStyle(fontRef.idx);
                fontRef.Color.Calculate(theme, slide, layout, master);
                RGBA = fontRef.Color.RGBA;

                if (fontRef.Color.color != null)
                {
                    if (brush.fill != null && brush.fill.type == FILL_TYPE_SOLID)
                    {
                        brush.fill.color = fontRef.Color.createDuplicate();
                    }
                }
            }
            else
            {
                brush = new CUniFill();
            }

            brush.merge(this.rPr.unifill);
            brush.calculate(theme, slide, layout, master, RGBA);

            if(brush.fill && brush.fill.color && brush.fill.color.RGBA)
            {
                this.rPr.Color =
                {
                    r:brush.fill.color.RGBA.R,
                    g:brush.fill.color.RGBA.G,
                    b:brush.fill.color.RGBA.B,
                    A:brush.fill.color.RGBA.A
                }
            }
            else if(brush.fill instanceof  CGradFill)
            {
                this.rPr.Color =
                {
                    r:brush.fill.colors[0].color.RGBA.R,
                    g:brush.fill.colors[0].color.RGBA.G,
                    b:brush.fill.colors[0].color.RGBA.B,
                    A:brush.fill.colors[0].color.RGBA.A
                }
            }
            else
            {
                this.rPr.Color =
                {
                    r:0,
                    g:0,
                    b:0,
                    A:255
                }
            }
        }
        else
        {
            delete this.rPr.Color;
        }
        if(this.rPr.FontFamily && this.rPr.FontFamily.Name !== undefined)
        {
            if(this.rPr.FontFamily.themeFont == undefined)
            {
                this.rPr.FontFamily.Index = -1;
                this.rPr.FontFamily.themeFont = this.rPr.FontFamily.Name;
                this.rPr.FontFamily.Name = getFontInfo(this.rPr.FontFamily.Name)(theme.themeElements.fontScheme);
            }
            else
            {
                this.rPr.FontFamily.Index = -1;
                this.rPr.FontFamily.Name = getFontInfo(this.rPr.FontFamily.themeFont)(theme.themeElements.fontScheme);
            }
        }

        if(this.TextPr && this.TextPr.Value && this.TextPr.Value.FontFamily)
        {
            if(this.TextPr.Value.FontFamily.themeFont == undefined)
            {
                this.TextPr.Value.FontFamily.Index = -1;
                this.TextPr.Value.FontFamily.themeFont = this.TextPr.Value.FontFamily.Name;
                this.TextPr.Value.FontFamily.Name = getFontInfo(this.TextPr.Value.FontFamily.Name)(theme.themeElements.fontScheme);
            }
            else
            {
                this.TextPr.Value.FontFamily.Index = -1;
                this.TextPr.Value.FontFamily.Name = getFontInfo(this.TextPr.Value.FontFamily.themeFont)(theme.themeElements.fontScheme);
            }
        }
        for(var i = 0 ; i<this.Content.length; ++i)
        {
            if(this.Content[i].Type == para_TextPr)
            {
                if(this.Content[i].Value.unifill && this.Content[i].Value.unifill.fill)
                {
                    var brush = null;
                    var RGBA = {R:0, G:0, B:0, A:255};
                    if (theme && this.style!=null && fontRef!=null)
                    {
                        brush = theme.getFillStyle(fontRef.idx);
                        fontRef.Color.Calculate(theme, slide, layout, master);
                        RGBA = fontRef.Color.RGBA;

                        if (fontRef.Color.color != null)
                        {
                            if (brush.fill != null && brush.fill.type == FILL_TYPE_SOLID)
                            {
                                brush.fill.color = fontRef.Color.createDuplicate();
                            }
                        }
                    }
                    else
                    {
                        brush = new CUniFill();
                    }

                    brush.merge(this.Content[i].Value.unifill);
                    brush.calculate(theme, slide, layout, master, RGBA);
                    if(brush.fill && brush.fill.color && brush.fill.color.RGBA)
                    {
                        this.Content[i].Value.Color =
                        {
                            r:brush.fill.color.RGBA.R,
                            g:brush.fill.color.RGBA.G,
                            b:brush.fill.color.RGBA.B,
                            A:brush.fill.color.RGBA.A
                        }
                    }
                    else if(brush.fill instanceof  CGradFill)
                    {
                        this.Content[i].Value.Color =
                        {
                            r:brush.fill.colors[0].color.RGBA.R,
                            g:brush.fill.colors[0].color.RGBA.G,
                            b:brush.fill.colors[0].color.RGBA.B,
                            A:brush.fill.colors[0].color.RGBA.A
                        }
                    }

                    else
                    {
                        this.Content[i].Value.Color =
                        {
                            r:0,
                            g:0,
                            b:0,
                            A:255
                        }
                    }
                }
                else
                {
                    delete this.Content[i].Value.Color;
                }

                if(this.Content[i].Value.FontFamily && this.Content[i].Value.FontFamily.Name !== undefined)
                {
                    if(this.Content[i].Value.FontFamily.themeFont == undefined)
                    {
                        this.Content[i].Value.FontFamily.Index = -1;
                        this.Content[i].Value.FontFamily.themeFont = this.Content[i].Value.FontFamily.Name;
                        this.Content[i].Value.FontFamily.Name = getFontInfo(this.Content[i].Value.FontFamily.Name)(theme.themeElements.fontScheme);
                    }
                    else
                    {
                        this.Content[i].Value.FontFamily.Index = -1;
                        this.Content[i].Value.FontFamily.Name = getFontInfo(this.Content[i].Value.FontFamily.themeFont)(theme.themeElements.fontScheme);
                    }
                }
            }
        }

        if(this.compiledBullet != null)
        {
            var _final_bullet = this.compiledBullet;
            if(_final_bullet.bulletColor && (_final_bullet.bulletColor.type == BULLET_TYPE_COLOR_CLR) )
            {
                var _unicolor = _final_bullet.bulletColor.UniColor;
                if(_unicolor != null)
                {
                    var _unifill = new CUniFill();
                    _unifill.fill = new CSolidFill();
                    _unifill.fill.color = _unicolor;
                    var RGBA = null;
                    var _rgb_color = null;
                    if(_unicolor.type == COLOR_TYPE_SCHEME && _unicolor.id == phClr)
                    {
                        if(fontRef && fontRef.Color)
                        {
                            fontRef.Color.Calculate(theme, slide, layout, master);
                            RGBA = fontRef.Color.RGBA;
                            _rgb_color = {r: RGBA.R, g : RGBA.G, b : RGBA.B};
                        }
                    }
                    else
                    {
                        _unifill.calculate(theme, slide, layout, master, {R:0, G:0, B:0, A:255});
                        if(_unifill.fill.color && _unifill.fill.color.RGBA)
                        {
                            RGBA = _unifill.fill.color.RGBA;
                            _rgb_color = {r: RGBA.R, g : RGBA.G, b : RGBA.B};
                        }
                    }
                    if(_rgb_color !== null)
                    {
                        if(this.PresentationPr.Bullet && this.PresentationPr.Bullet.m_oColor)
                        {
                            this.PresentationPr.Bullet.m_oColor = {r: _rgb_color.r, g: _rgb_color.g, b: _rgb_color.b };
                        }
                    }
                }
            }
        }

        var unifillHiperlink = new CUniFill();
        unifillHiperlink.merge(this.folHlinkColor.unifill);
        unifillHiperlink.calculate(theme, slide, layout, master, RGBA);
        if(unifillHiperlink.fill && unifillHiperlink.fill.color && unifillHiperlink.fill.color.RGBA)
        {
            this.folHlinkColor.Color =
            {
                r:unifillHiperlink.fill.color.RGBA.R,
                g:unifillHiperlink.fill.color.RGBA.G,
                b:unifillHiperlink.fill.color.RGBA.B,
                A:unifillHiperlink.fill.color.RGBA.A
            }
        }
        else
        {
            this.folHlinkColor.Color =
            {
                r:128,
                g:0,
                b:151,
                A: 0
            }
        }
      //  this.Recalculate();
    },



    calculateTextTheme2 : function(theme, slide, layout, master, fontRef)
    {
       /* if(this.CompiledPr.Pr && this.CompiledPr.Pr.TextPr && this.CompiledPr.Pr.TextPr.unifill)
        {
            var brush = null;
            var RGBA = {R:0, G:0, B:0, A:255};
            if (theme && this.Parent.parent && this.Parent.parent.style!=null && fontRef!=null)
            {
                brush = theme.getFillStyle(fontRef.idx);
                fontRef.Color.Calculate(theme, slide, layout, master);
                RGBA = fontRef.Color.RGBA;

                if (fontRef.Color.color != null)
                {
                    if (brush.fill != null && brush.fill.type == FILL_TYPE_SOLID)
                    {
                        brush.fill.color = fontRef.Color.createDuplicate();
                    }
                }
            }
            else
            {
                brush = new CUniFill();
            }

            brush.merge(this.CompiledPr.Pr.TextPr.unifill);
            brush.calculate(theme, slide, layout, master, RGBA);
            this.CompiledPr.Pr.TextPr.Color = {
                r:brush.fill.color.RGBA.R,
                g:brush.fill.color.RGBA.G,
                b:brush.fill.color.RGBA.B,
                A:brush.fill.color.RGBA.A
            };
        }*/

        if(this.CompiledPr.Pr && this.CompiledPr.Pr.TextPr && this.CompiledPr.Pr.TextPr.FontFamily && this.CompiledPr.Pr.TextPr.FontFamily.Name !== undefined)
        {
            this.CompiledPr.Pr.TextPr.FontFamily.Index = -1;
            this.CompiledPr.Pr.TextPr.FontFamily.Name = getFontInfo(this.CompiledPr.Pr.TextPr.FontFamily.Name)(theme.themeElements.fontScheme);
        }

        if(this.rPr.unifill && this.rPr.unifill.fill)
        {
            var brush = null;
            var RGBA = {R:0, G:0, B:0, A:255};
            if (theme && this.Parent.parent && this.Parent.parent.style!=null && fontRef!=null)
            {
                brush = theme.getFillStyle(fontRef.idx);
                fontRef.Color.Calculate(theme, slide, layout, master);
                RGBA = fontRef.Color.RGBA;

                if (fontRef.Color.color != null)
                {
                    if (brush.fill != null && brush.fill.type == FILL_TYPE_SOLID)
                    {
                        brush.fill.color = fontRef.Color.createDuplicate();
                    }
                }
            }
            else
            {
                brush = new CUniFill();
            }

            brush.merge(this.rPr.unifill);
            brush.calculate(theme, slide, layout, master, RGBA);
            this.rPr.Color = {
                r:brush.fill.color.RGBA.R,
                g:brush.fill.color.RGBA.G,
                b:brush.fill.color.RGBA.B,
                A:brush.fill.color.RGBA.A
            };
        }
        else
        {
            delete this.rPr.Color;
        }

        if(this.rPr.FontFamily && this.rPr.FontFamily.Name !== undefined)
        {
            if(this.rPr.FontFamily.themeFont == undefined)
            {
                this.rPr.FontFamily.Index = -1;
                this.rPr.FontFamily.themeFont = this.rPr.FontFamily.Name;
                this.rPr.FontFamily.Name = getFontInfo(this.rPr.FontFamily.Name)(theme.themeElements.fontScheme);
            }
            else
            {
                this.rPr.FontFamily.Index = -1;
                this.rPr.FontFamily.Name = getFontInfo(this.rPr.FontFamily.themeFont)(theme.themeElements.fontScheme);
            }
        }

        if(this.TextPr && this.TextPr.Value && this.TextPr.Value.FontFamily)
        {
            if(this.TextPr.Value.FontFamily.themeFont == undefined)
            {
                this.TextPr.Value.FontFamily.Index = -1;
                this.TextPr.Value.FontFamily.themeFont = this.TextPr.Value.FontFamily.Name;
                this.TextPr.Value.FontFamily.Name = getFontInfo(this.TextPr.Value.FontFamily.Name)(theme.themeElements.fontScheme);
            }
            else
            {
                this.TextPr.Value.FontFamily.Index = -1;
                this.TextPr.Value.FontFamily.Name = getFontInfo(this.TextPr.Value.FontFamily.themeFont)(theme.themeElements.fontScheme);
            }
        }
        for(var i = 0 ; i<this.Content.length; ++i)
        {
            if(this.Content[i].Type == para_TextPr)
            {
                if(this.Content[i].Value.unifill && this.Content[i].Value.unifill.fill)
                {
                    var brush = null;
                    var RGBA = {R:0, G:0, B:0, A:255};
                    if (theme && this.style!=null && fontRef!=null)
                    {
                        brush = theme.getFillStyle(fontRef.idx);
                        fontRef.Color.Calculate(theme, slide, layout, master);
                        RGBA = fontRef.Color.RGBA;

                        if (fontRef.Color.color != null)
                        {
                            if (brush.fill != null && brush.fill.type == FILL_TYPE_SOLID)
                            {
                                brush.fill.color = fontRef.Color.createDuplicate();
                            }
                        }
                    }
                    else
                    {
                        brush = new CUniFill();
                    }

                    brush.merge(this.Content[i].Value.unifill);
                    brush.calculate(theme, slide, layout, master, RGBA);
                    if(brush.fill && brush.fill.color && brush.fill.color.RGBA)
                    {
                        this.Content[i].Value.Color =
                        {
                            r:brush.fill.color.RGBA.R,
                            g:brush.fill.color.RGBA.G,
                            b:brush.fill.color.RGBA.B,
                            A:brush.fill.color.RGBA.A
                        }
                    }
                    else if(brush.fill && brush.fill.colors && brush.fill.colors.color && brush.fill.colors.color.RGBA)
                    {
                        this.Content[i].Value.Color =
                        {
                            r:brush.fill.colors.color.RGBA.R,
                            g:brush.fill.colors.color.RGBA.G,
                            b:brush.fill.colors.color.RGBA.B,
                            A:brush.fill.colors.color.RGBA.A
                        }
                    }
                    else
                    {
                        this.Content[i].Value.Color =
                        {
                            r:0,
                            g:0,
                            b:0,
                            A:0
                        }
                    }
                }
                else
                {
                    delete this.Content[i].Value.Color;
                }

                if(this.Content[i].Value.FontFamily && this.Content[i].Value.FontFamily.Name !== undefined)
                {
                    if(this.Content[i].Value.FontFamily.themeFont == undefined)
                    {
                        this.Content[i].Value.FontFamily.Index = -1;
                        this.Content[i].Value.FontFamily.themeFont = this.Content[i].Value.FontFamily.Name;
                        this.Content[i].Value.FontFamily.Name = getFontInfo(this.Content[i].Value.FontFamily.Name)(theme.themeElements.fontScheme);
                    }
                    else
                    {
                        this.Content[i].Value.FontFamily.Index = -1;
                        this.Content[i].Value.FontFamily.Name = getFontInfo(this.Content[i].Value.FontFamily.themeFont)(theme.themeElements.fontScheme);
                    }
                }
            }
        }

        if(this.compiledBullet != null)
        {
            var _final_bullet = this.compiledBullet;
            if(_final_bullet.bulletColor && (_final_bullet.bulletColor.type == BULLET_TYPE_COLOR_CLR) )
            {
                var _unicolor = _final_bullet.bulletColor.UniColor;
                if(_unicolor != null)
                {
                    var _unifill = new CUniFill();
                    _unifill.fill = new CSolidFill();
                    _unifill.fill.color = _unicolor;
                    var RGBA = null;
                    var _rgb_color = null;
                    if(_unicolor.type == COLOR_TYPE_SCHEME && _unicolor.id == phClr)
                    {
                        if(fontRef && fontRef.Color)
                        {
                            fontRef.Color.Calculate(theme, slide, layout, master);
                            RGBA = fontRef.Color.RGBA;
                            _rgb_color = {r: RGBA.R, g : RGBA.G, b : RGBA.B};
                        }
                    }
                    else
                    {
                        _unifill.calculate(theme, slide, layout, master, {R:0, G:0, B:0, A:255});
                        if(_unifill.fill.color && _unifill.fill.color.RGBA)
                        {
                            RGBA = _unifill.fill.color.RGBA;
                            _rgb_color = {r: RGBA.R, g : RGBA.G, b : RGBA.B};
                        }
                    }
                    if(_rgb_color !== null)
                    {
                        if(this.PresentationPr.Bullet && this.PresentationPr.Bullet.m_oColor)
                        {
                            this.PresentationPr.Bullet.m_oColor = {r: _rgb_color.r, g: _rgb_color.g, b: _rgb_color.b };
                        }
                    }
                }
            }
        }

        var unifillHiperlink = new CUniFill();
        unifillHiperlink.merge(this.folHlinkColor.unifill);
        unifillHiperlink.calculate(theme, slide, layout, master, RGBA);
        if(unifillHiperlink.fill && unifillHiperlink.fill.color && unifillHiperlink.fill.color.RGBA)
        {
            this.folHlinkColor.Color =
            {
                r:unifillHiperlink.fill.color.RGBA.R,
                g:unifillHiperlink.fill.color.RGBA.G,
                b:unifillHiperlink.fill.color.RGBA.B,
                A:unifillHiperlink.fill.color.RGBA.A
            }
        }
        else
        {
            this.folHlinkColor.Color =
            {
                r:128,
                g:0,
                b:151,
                A: 0
            }
        }
    },


    GetType : function()
    {
        return type_Paragraph;
    },

    GetId : function()
    {
        return this.Id;
    },

    SetId : function(newId)
    {
        g_oTableId.Reset_Id( this, newId, this.Id );
        this.Id = newId;
    },

    Get_Id : function()
    {
        return this.GetId();
    },

    Set_Id : function(newId)
    {
        return this.SetId( newId );
    },

    Reset : function (X,Y, XLimit, YLimit, PageNum)
    {
        this.X = X;
        this.Y = Y;
        this.XLimit = XLimit;
        this.YLimit = YLimit;

        this.PageNum = PageNum;

        this.Pages.length = 1;
        this.Pages[0].Reset( X, Y, XLimit, YLimit, 0 );
    },

    // Копируем свойства параграфа
    CopyPr : function(OtherParagraph)
    {
        return this.CopyPr_Open(OtherParagraph);

        /*
        var bHistory = History.Is_On();
        History.TurnOff();

        OtherParagraph.X      = this.X;
        OtherParagraph.XLimit = this.XLimit;

        if ( "undefined" != typeof(OtherParagraph.NumPr) )
            OtherParagraph.Numbering_Remove();

        var NumPr = this.Numbering_Get();
        if ( null != NumPr  )
        {
            OtherParagraph.Numbering_Add( NumPr.NumId, NumPr.Lvl );
        }

        // Копируем прямые настройки параграфа в конце, потому что, например, нумерация может
        // их изменить.
        OtherParagraph.Pr = Common_CopyObj( this.Pr );
        OtherParagraph.Style_Add( this.Style_Get(), true );

        if ( true === bHistory )
            History.TurnOn();
            */
    },
    
    // Копируем свойства параграфа при открытии и копировании
    CopyPr_Open : function(OtherParagraph)
    {
        OtherParagraph.X      = this.X;
        OtherParagraph.XLimit = this.XLimit;

        if ( "undefined" != typeof(OtherParagraph.NumPr) )
            OtherParagraph.Numbering_Remove();

        var NumPr = this.Numbering_Get();
        if ( undefined != NumPr  )
        {
            OtherParagraph.Numbering_Add( NumPr.NumId, NumPr.Lvl );
        }

        var Bullet = this.Get_PresentationNumbering();
        if ( numbering_presentationnumfrmt_None != Bullet.Get_Type() )
            OtherParagraph.Add_PresentationNumbering( Bullet.Copy() );

        OtherParagraph.Set_PresentationLevel( this.PresentationPr.Level );

        // Копируем прямые настройки параграфа в конце, потому что, например, нумерация может
        // их изменить.
        var oOldPr = OtherParagraph.Pr;
        OtherParagraph.Pr = this.Pr.Copy();
        History.Add( OtherParagraph, { Type : historyitem_Paragraph_Pr, Old : oOldPr, New : OtherParagraph.Pr } );

        OtherParagraph.Style_Add( this.Style_Get(), true );
    },

    // Добавляем элемент в содержимое параграфа. (Здесь передвигаются все позиции
    // CurPos.ContentPos, Selection.StartPos, Selection.EndPos)
    Internal_Content_Add : function (Pos, Item)
    {
        if ( true === Item.Is_RealContent() )
        {
            var ClearPos = this.Internal_Get_ClearPos( Pos );
            History.Add( this, { Type : historyitem_Paragraph_AddItem, Pos : ClearPos, EndPos : ClearPos, Items : [ Item ] } );
        }

        this.Content.splice( Pos, 0, Item );

        if ( this.CurPos.ContentPos >= Pos )
            this.CurPos.ContentPos++;

        if ( this.Selection.StartPos >= Pos )
            this.Selection.StartPos++;

        if ( this.Selection.EndPos >= Pos )
            this.Selection.EndPos++;
    },

    // Добавляем несколько элементов в конец параграфа.
    Internal_Content_Concat : function(Items)
    {
        // Добавляем только постоянные элементы параграфа
        var NewItems = new Array();
        var ItemsCount = Items.length;
        for ( var Index = 0; Index < ItemsCount; Index++ )
        {
            if ( true === Items[Index].Is_RealContent() )
                NewItems.push( Items[Index] );
        }

        if ( NewItems.length <= 0 )
            return;

        var StartPos = this.Content.length;
        this.Content = this.Content.concat( NewItems );

        History.Add( this, { Type : historyitem_Paragraph_AddItem, Pos : this.Internal_Get_ClearPos( StartPos ), EndPos : this.Internal_Get_ClearPos( this.Content.length - 1 ), Items : NewItems } );
    },

    // Удаляем элемент из содержимого параграфа. (Здесь передвигаются все позиции
    // CurPos.ContentPos, Selection.StartPos, Selection.EndPos)
    Internal_Content_Remove : function (Pos)
    {
        var Item = this.Content[Pos];
        if ( true === Item.Is_RealContent() )
        {
            var ClearPos = this.Internal_Get_ClearPos( Pos );
            History.Add( this, { Type : historyitem_Paragraph_RemoveItem, Pos : ClearPos, EndPos : ClearPos, Items : [ Item ] } );
        }

        if ( this.CurPos.ContentPos > Pos )
            this.CurPos.ContentPos--;

        if ( this.Selection.StartPos <= this.Selection.EndPos )
        {
            if ( this.Selection.StartPos > Pos )
                this.Selection.StartPos--;

            if ( this.Selection.EndPos >= Pos )
                this.Selection.EndPos--;
        }
        else
        {
            if ( this.Selection.StartPos >= Pos )
                this.Selection.StartPos--;

            if ( this.Selection.EndPos > Pos )
                this.Selection.EndPos--;
        }

        this.Content.splice( Pos, 1 );

        // Комментарий удаляем после, чтобы не нарушить позиции
        if ( true === this.DeleteCommentOnRemove && ( para_CommentStart === Item.Type || para_CommentEnd === Item.Type ) )
        {
            // Удаляем комментарий, если у него было удалено начало или конец

            if ( para_CommentStart === Item.Type )
                editor.WordControl.m_oLogicDocument.Comments.Set_StartInfo( Item.Id, 0, 0, 0, 0, null );
            else
                editor.WordControl.m_oLogicDocument.Comments.Set_EndInfo( Item.Id, 0, 0, 0, 0, null );

            editor.WordControl.m_oLogicDocument.Remove_Comment( Item.Id, true );
        }
    },

    // Удаляем несколько элементов
    Internal_Content_Remove2 : function(Pos, Count)
    {
        var DocumentComments = editor.WordControl.m_oLogicDocument.Comments;
        var CommentsToDelete = new Object();
        for ( var Index = Pos; Index < Pos + Count; Index++ )
        {
            var ItemType = this.Content[Index].Type;
            if ( true === this.DeleteCommentOnRemove && (para_CommentStart === ItemType || para_CommentEnd === ItemType) )
            {
                if ( para_CommentStart === ItemType )
                    DocumentComments.Set_StartInfo( this.Content[Index].Id, 0, 0, 0, 0, null );
                else
                    DocumentComments.Set_EndInfo( this.Content[Index].Id, 0, 0, 0, 0, null );

                CommentsToDelete[this.Content[Index].Id] = 1;
            }
        }

        var LastArray = this.Content.slice( Pos, Pos + Count );

        // Добавляем только постоянные элементы параграфа
        var LastItems = new Array();
        var ItemsCount = LastArray.length;
        for ( var Index = 0; Index < ItemsCount; Index++ )
        {
            if ( true === LastArray[Index].Is_RealContent() )
                LastItems.push( LastArray[Index] );
        }

        History.Add( this, { Type : historyitem_Paragraph_RemoveItem, Pos : this.Internal_Get_ClearPos( Pos ), EndPos : this.Internal_Get_ClearPos(Pos + Count - 1), Items : LastItems } );

        if ( this.CurPos.ContentPos > Pos )
        {
            if ( this.CurPos.ContentPos > Pos + Count )
                this.CurPos.ContentPos -= Count;
            else
                this.CurPos.ContentPos = Pos;
        }

        if ( this.Selection.StartPos <= this.Selection.EndPos )
        {
            if ( this.Selection.StartPos > Pos )
            {
                if ( this.Selection.StartPos > Pos + Count )
                    this.Selection.StartPos -= Count;
                else
                    this.Selection.StartPos = Pos;
            }

            if ( this.Selection.EndPos >= Pos )
            {
                if ( this.Selection.EndPos >= Pos + Count )
                    this.Selection.EndPos -= Count;
                else
                    this.Selection.EndPos = Math.max( 0, Pos - 1 );
            }
        }
        else
        {
            if ( this.Selection.StartPos >= Pos )
            {
                if ( this.Selection.StartPos >= Pos + Count )
                    this.Selection.StartPos -= Count;
                else
                    this.Selection.StartPos = Math.max( 0, Pos - 1 );
            }

            if ( this.Selection.EndPos > Pos )
            {
                if ( this.Selection.EndPos > Pos + Count )
                    this.Selection.EndPos -= Count;
                else
                    this.Selection.EndPos = Pos;
            }
        }

        this.Content.splice( Pos, Count );

        // Комментарии удаляем после, чтобы не нарушить позиции
        for ( var Id in CommentsToDelete )
        {
            editor.WordControl.m_oLogicDocument.Remove_Comment( Id, true );
        }
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

    // Пересчет переносов строк в параграфе, с учетом возможного обтекания
    Internal_Recalculate_1 : function()
    {
        var Pr        = this.Get_CompiledPr();
        var ParaPr    = Pr.ParaPr;

        // Предполагается, что при вызове данной функции Content не содержит
        // рассчитанных переносов строк.
        var CurPage = 0;

        this.Pages.length       = 1;
        this.Pages[0].Reset( this.X, this.Y, this.XLimit, this.YLimit, 0 );

        // Смещаемся в начало параграфа
        var X = this.X + ParaPr.Ind.Left + ParaPr.Ind.FirstLine;
        var Y = this.Y;
        var XLimit = this.XLimit - ParaPr.Ind.Right;

        var LineStart_Pos    = 0;

        // Начинаем параграф с новой страницы
        if ( true === ParaPr.PageBreakBefore )
        {
            // Если это первый элемент документа, тогда не надо начинать его с новой страницы
            var Prev = this.Get_DocumentPrev();
            if ( null != Prev )
            {
                // Добавляем разрыв страницы
                this.Internal_Content_Add( LineStart_Pos, new ParaPageBreakRenderer() );
                LineStart_Pos++;

                CurPage++;

                // Запрашиваем у документа начальные координаты на новой странице
                var PageStart = this.Parent.Get_PageContentStartPos( this.PageNum + CurPage );

                X = PageStart.X + ParaPr.Ind.Left + ParaPr.Ind.FirstLine;
                Y = PageStart.Y;

                this.Pages[CurPage] = new CParaPage( PageStart.X, PageStart.Y, PageStart.XLimit, PageStart.YLimit, 0 );
            }
        }

        // Пересчитываем правую и левую границы параграфа
        if ( ParaPr.Ind.FirstLine <= 0 )
            this.Bounds.Left = X;
        else
            this.Bounds.Left = this.X + ParaPr.Ind.Left;

        this.Bounds.Right = XLimit;

        var bFirstItemOnLine  = true; // контролируем первое появление текста на строке
        var bEmptyLine = true; // Есть ли в строке текст, картинки или др. видимые объекты
        var bStartWord = false; // началось ли слово в строке
        var CurLine = 0;
        var bWord = false;
        var nWordStartPos = 0;
        var nWordLen  = 0;
        var nSpaceLen = 0;

        var nSpacesCount = 0;

        var bNewLine  = false;
        var bNewRange = false;

        var bNewPage  = false;
        var bExtendBoundToBottom = false;

        var bNeedNewLine  = false;
        var bNeedNewRange = false;

        var bEnd = false;

        // Получаем промежутки обтекания, т.е. промежутки, которые нам нельзя использовать
        var Ranges = this.Parent.CheckRange( X, Y, XLimit, Y, this.PageNum + CurPage, true );
        var RangesCount = Ranges.length;

        // Под Descent мы будем понимать descent + linegap (которые записаны в шрифте)

        var TextAscent  = 0;
        var TextHeight  = 0;
        var TextDescent = 0;

        this.Lines.length = 0;
        this.Lines[CurLine] = new CParaLine();

        var LineTextAscent  = 0;
        var LineTextDescent = 0;
        var LineAscent      = 0;
        var LineDescent     = 0;

        // Выставляем начальные сдвиги для промежутков. Начало промежутка = конец вырезаемого промежутка
        this.Lines[CurLine].Add_Range( X, (RangesCount == 0 ? XLimit : Ranges[0].X0) );
        for ( var Index = 1; Index < Ranges.length + 1; Index++ )
        {
            this.Lines[CurLine].Add_Range( Ranges[Index - 1].X1, (Index == RangesCount ? XLimit : Ranges[Index].X0) );
        }

        var CurRange = 0;
        var XEnd = 0;

        if ( RangesCount == 0 )
            XEnd = XLimit;
        else
            XEnd = Ranges[0].X0;

        for ( var Pos = LineStart_Pos; Pos < this.Content.length; Pos++ )
        {
            var bSkip = false;
            // 24px = 0.635cm, минимальное расстояние, при котором слева ничего не пишется (как в Ворде)
            if ( false === bStartWord && true === bFirstItemOnLine && XEnd - X < 6.35 && RangesCount > 0 )
            {
                if ( RangesCount == CurRange )
                {
                    bNewLine = true;
                    if ( true != bNeedNewLine )
                        this.Internal_Content_Add( Pos, new ParaNewLineRendered() );
                }
                else
                {
                    bNewRange = true;
                    if ( true != bNeedNewRange )
                        this.Internal_Content_Add( Pos, new ParaInlineBreak() );
                }
            }

            if ( true != bSkip )
            {
            var Item = this.Content[Pos];

            TextAscent  = Item.TextAscent;
            TextDescent = Item.TextDescent;
            TextHeight  = Item.TextHeight;

            switch( Item.Type )
            {
                case para_Numbering:
                {
                    var NumPr = ParaPr.NumPr;
                    if ( undefined === NumPr || undefined === NumPr.NumId )
                        break;

                    var Numbering = this.Parent.Get_Numbering();
                    var NumLvl    = Numbering.Get_AbstractNum( NumPr.NumId ).Lvl[NumPr.Lvl];
                    var NumSuff   = NumLvl.Suff;
                    var NumJc     = NumLvl.Jc;

                    // При рассчете высоты строки, если у нас параграф со списком, то размер символа
                    // в списке влияет только на высоту строки над Baseline, но не влияет на высоту строки
                    // ниже baseline.
                    if ( LineAscent < Item.Height )
                        LineAscent = Item.Height;

                    switch ( NumJc )
                    {
                        case align_Right:
                        {
                            Item.WidthVisible = 0;
                            break;
                        }
                        case align_Center:
                        {
                            Item.WidthVisible = Item.WidthNum / 2;
                            X                += Item.WidthNum / 2;
                            break;
                        }
                        case align_Left:
                        default:
                        {
                            Item.WidthVisible = Item.WidthNum;
                            X                += Item.WidthNum;
                            break;
                        }
                    }

                    switch( NumSuff )
                    {
                        case numbering_suff_Nothing:
                        {
                            // Ничего не делаем
                            break;
                        }
                        case numbering_suff_Space:
                        {
                            // Это было рассчитано в Internal_Recalculate_0
                            break;
                        }
                        case numbering_suff_Tab:
                        {
                            var NewX = null;
                            // Если у данного параграфа есть табы, тогда ищем среди них
                            for ( var Index = 0; Index < ParaPr.Tabs.length; Index++ )
                            {
                                var TabPos = ParaPr.Tabs[Index].Pos + this.X;
                                if ( X < TabPos )
                                {
                                    NewX = TabPos;
                                    break;
                                }
                            }

                            // Смещаемся к левой границе, если нет заданного таба между X и this.X + ParaPr.Ind.Left
                            if ( X < this.X + ParaPr.Ind.Left )
                            {
                                if ( null === NewX || NewX > this.X + ParaPr.Ind.Left )
                                    Item.WidthSuff = this.X + ParaPr.Ind.Left - X;
                                else
                                    Item.WidthSuff = NewX - X;
                            }
                            // смещаемся как обычный левый таб
                            else
                            {
                                // Если табов нет, либо их позиции левее текущей позиции ставим таб по умолчанию
                                if ( null === NewX )
                                {
                                    NewX = this.X;
                                    while ( X >= NewX )
                                        NewX += Default_Tab_Stop;
                                }

                                Item.WidthSuff = NewX - X;
                            }

                            break;
                        }
                    }

                    Item.Width         = Item.WidthNum;
                    Item.WidthVisible += Item.WidthSuff;

                    X += Item.WidthSuff;

                    break;
                }
                case para_PresentationNumbering:
                {
                    if ( numbering_presentationnumfrmt_None != Item.Bullet.Get_Type() )
                    {
                        if ( ParaPr.Ind.FirstLine < 0 )
                            Item.WidthVisible = Math.max( Item.Width, this.X + ParaPr.Ind.Left + ParaPr.Ind.FirstLine - X, this.X + ParaPr.Ind.Left - X );
                        else
                            Item.WidthVisible = Math.max( this.X + ParaPr.Ind.Left + Item.Width - X, this.X + ParaPr.Ind.Left + ParaPr.Ind.FirstLine - X, this.X + ParaPr.Ind.Left - X );
                    }

                    X += Item.WidthVisible;

                    break;
                }
                case para_Text:
                {
                    bStartWord = true;

                    // При проверке, убирается ли слово, мы должны учитывать ширину
                    // предшевствующих пробелов.

                    if ( LineTextAscent < TextAscent )
                        LineTextAscent = TextAscent;

                    if ( LineTextDescent < TextDescent )
                        LineTextDescent = TextDescent;

                    if ( LineAscent < TextAscent )
                        LineAscent = TextAscent;

                    if ( LineDescent < TextDescent )
                        LineDescent = TextDescent;

                    if ( !bWord )
                    {
                        // Слово только началось. Делаем следующее:
                        // 1) Если до него на строке ничего не было и данная строка не
                        //    имеет разрывов, тогда не надо проверять убирается ли слово в строке.
                        // 2) В противном случае, проверяем убирается ли слово в промежутке.

                        // Если слово только началось, и до него на строке ничего не было, и в строке нет разрывов, тогда не надо проверять убирается ли оно на строке.
                        var LetterLen = Item.Width;
                        if ( !bFirstItemOnLine || 0 != RangesCount )
                        {
                            if ( X + nSpaceLen + LetterLen > XEnd )
                            {
                                if ( RangesCount == CurRange )
                                {
                                    bNewLine = true;
                                    if ( true != bNeedNewLine )
                                        this.Internal_Content_Add( Pos, new ParaNewLineRendered() );
                                }
                                else
                                {
                                    bNewRange = true;
                                    if ( true != bNeedNewRange )
                                        this.Internal_Content_Add( Pos, new ParaInlineBreak() );
                                }
                            }
                        }

                        if ( !bNewLine && !bNewRange )
                        {
                            nWordStartPos = Pos;
                            nWordLen = Item.Width;
                            bWord = true;

                            this.Lines[CurLine].Words++;

                            if ( !bNewRange )
                                this.Lines[CurLine].Ranges[CurRange].Words++;
                        }
                    }
                    else
                    {
                        var LetterLen = Item.Width;
                        if ( X + nSpaceLen + nWordLen + LetterLen > XEnd )
                        {
                            if ( bFirstItemOnLine )
                            {
                                // Слово оказалось единственным элементом в промежутке, и, все равно,
                                // не умещается целиком. Делаем следующее:
                                //
                                // 1) Если у нас строка без вырезов, тогда ставим перенос строки на
                                //    текущей позиции.
                                // 2) Если у нас строка с вырезом, и данный вырез не последний, тогда
                                //    ставим перенос внутри строки в начале слова.
                                // 3) Если у нас строка с вырезом и вырез последний, тогда ставим перенос
                                //    строки в начале слова.

                                bEmptyLine = false;

                                if ( 0 == RangesCount )
                                {
                                    X += nWordLen;

                                    this.Internal_Content_Add( Pos, new ParaNewLineRendered() );

                                    bNewLine = true;
                                }
                                else if ( RangesCount != CurRange )
                                {
                                    Pos = nWordStartPos;
                                    this.Internal_Content_Add( Pos, new ParaInlineBreak() );

                                    bNewRange = true;
                                }
                                else
                                {
                                    Pos = nWordStartPos;
                                    this.Internal_Content_Add( Pos, new ParaNewLineRendered() );

                                    bNewLine = true;
                                }
                            }
                            else
                            {
                                // Слово не убирается в промежутке. Делаем следующее:
                                // 1) Если у нас строка без вырезов или текущей вырез последний,
                                //    тогда ставим перенос строки в начале слова.
                                // 2) Если строка с вырезами и вырез не последний, ставим
                                //    перенос внутри строки в начале слова.

                                Pos = nWordStartPos;

                                if ( RangesCount == CurRange )
                                {
                                    this.Internal_Content_Add( Pos, new ParaNewLineRendered() );

                                    bNewLine = true;
                                    this.Lines[CurLine].Words--;
                                    this.Lines[CurLine].Ranges[CurRange].Words--;
                                }
                                else // if ( 0 != RangesCount && RangesCount != CurRange )
                                {
                                    this.Internal_Content_Add( Pos, new ParaInlineBreak() );

                                    bNewRange = true;
                                    this.Lines[CurLine].Ranges[CurRange].Words--;
                                }
                            }
                        }

                        if ( !bNewLine && !bNewRange )
                        {
                            nWordLen += LetterLen;

                            // Если текущий символ, например, дефис, тогда на нем заканчивается слово
                            if ( true === Item.SpaceAfter )
                            {
                                // Добавляем длину пробелов до слова
                                X += nSpaceLen;
                                nSpaceLen = 0;

                                // Не надо проверять убирается ли слово, мы это проверяем при добавленнии букв
                                X += nWordLen;

                                // Пробелы перед первым словом в строке не считаем
                                if ( this.Lines[CurLine].Words > 1 )
                                    this.Lines[CurLine].Spaces += nSpacesCount;

                                if ( this.Lines[CurLine].Ranges[CurRange].Words > 1 )
                                    this.Lines[CurLine].Ranges[CurRange].Spaces += nSpacesCount;

                                nSpacesCount = 0;

                                bWord = false;
                                bFirstItemOnLine = false;
                                bEmptyLine = false;
                                nWordLen = 0;
                            }
                        }
                    }

                    break;
                }
                case para_Space:
                {
                    bFirstItemOnLine = false;

                    var SpaceLen = Item.Width;
                    if ( bWord )
                    {
                        // Добавляем длину пробелов до слова
                        X += nSpaceLen;
                        nSpaceLen = 0;

                        // Не надо проверять убирается ли слово, мы это проверяем при добавленнии букв
                        X += nWordLen;

                        // Пробелы перед первым словом в строке не считаем
                        if ( this.Lines[CurLine].Words > 1 )
                            this.Lines[CurLine].Spaces += nSpacesCount;

                        if ( this.Lines[CurLine].Ranges[CurRange].Words > 1 )
                            this.Lines[CurLine].Ranges[CurRange].Spaces += nSpacesCount;

                        bWord = false;
                        bEmptyLine = false;
                        nWordLen = 0;
                        nSpacesCount = 1;
                    }
                    else
                        nSpacesCount++;

                    if ( X + nSpaceLen + SpaceLen > XEnd )
                    {
                        // На пробеле не делаем перенос. Перенос строки или внутристрочный
                        // перенос делаем при добавлении любого непробельного символа

                        if ( CurRange == RangesCount )
                            bNeedNewLine  = true;
                        else
                            bNeedNewRange = true;
                    }
                    else
                    {
                        nSpaceLen += SpaceLen;
                    }

                    break;
                }
                case para_Drawing:
                {
                    if ( true === bStartWord )
                        bFirstItemOnLine = false;

                    // Добавляем длину пробелов до слова
                    X += nSpaceLen;
                    nSpaceLen = 0;

                    // Не надо проверять убирается ли слово, мы это проверяем при добавленнии букв
                    X += nWordLen;

                    bWord = false;
                    nWordLen = 0;

                    if ( X + Item.Width > XEnd && ( false === bFirstItemOnLine || RangesCount > 0 ) )
                    {
                        if ( RangesCount == CurRange )
                        {
                            bNewLine = true;
                            if ( true != bNeedNewLine )
                                this.Internal_Content_Add( Pos, new ParaNewLineRendered() );
                            else
                                Pos--; // потому что там добавится в позиции Pos + 1
                        }
                        else
                        {
                            bNewRange = true;
                            if ( true != bNeedNewRange )
                                this.Internal_Content_Add( Pos, new ParaInlineBreak() );
                            else
                                Pos--; // потому что там добавится в позиции Pos + 1
                        }
                    }
                    else
                    {
                        if ( Item.Height > this.Lines[CurLine].Metrics.Ascent )
                            this.Lines[CurLine].Metrics.Ascent = Item.Height;

                        X += Item.Width;
                        bFirstItemOnLine = false;
                        bEmptyLine = false;

                        this.Lines[CurLine].Words++;
                        this.Lines[CurLine].Ranges[CurRange].Words++;

                        // Пробелы перед первым словом в строке не считаем
                        if ( this.Lines[CurLine].Words > 1 )
                            this.Lines[CurLine].Spaces += nSpacesCount;

                        if ( this.Lines[CurLine].Ranges[CurRange].Words > 1 )
                            this.Lines[CurLine].Ranges[CurRange].Spaces += nSpacesCount;
                    }

                    nSpacesCount = 0;

                    break;
                }
                case para_PageNum:
                {
                    if ( true === bStartWord )
                        bFirstItemOnLine = false;

                    // Добавляем длину пробелов до слова
                    X += nSpaceLen;
                    nSpaceLen = 0;

                    if ( LineTextAscent < TextAscent )
                        LineTextAscent = TextAscent;

                    if ( LineTextDescent < TextDescent )
                        LineTextDescent = TextDescent;

                    if ( LineAscent < TextAscent )
                        LineAscent = TextAscent;

                    if ( LineDescent < TextDescent )
                        LineDescent = TextDescent;

                    // Не надо проверять убирается ли слово, мы это проверяем при добавленнии букв
                    X += nWordLen;

                    bWord = false;
                    nWordLen = 0;

                    if ( X + Item.Width > XEnd && ( false === bFirstItemOnLine || RangesCount > 0 ) )
                    {
                        if ( RangesCount == CurRange )
                        {
                            bNewLine = true;
                            if ( true != bNeedNewLine )
                                this.Internal_Content_Add( Pos, new ParaNewLineRendered() );
                            else
                                Pos--; // потому что там добавится в позиции Pos + 1
                        }
                        else
                        {
                            bNewRange = true;
                            if ( true != bNeedNewRange )
                                this.Internal_Content_Add( Pos, new ParaInlineBreak() );
                            else
                                Pos--; // потому что там добавится в позиции Pos + 1
                        }
                    }
                    else
                    {
                        X += Item.Width;
                        bFirstItemOnLine = false;
                        bEmptyLine = false;

                        this.Lines[CurLine].Words++;
                        this.Lines[CurLine].Ranges[CurRange].Words++;

                        // Пробелы перед первым словом в строке не считаем
                        if ( this.Lines[CurLine].Words > 1 )
                            this.Lines[CurLine].Spaces += nSpacesCount;

                        if ( this.Lines[CurLine].Ranges[CurRange].Words > 1 )
                            this.Lines[CurLine].Ranges[CurRange].Spaces += nSpacesCount;
                    }

                    nSpacesCount = 0;

                    break;
                }
                case para_Tab:
                {
                    if ( true === bStartWord )
                        bFirstItemOnLine = false;

                    // Добавляем длину пробелов до слова
                    X += nSpaceLen;
                    nSpaceLen = 0;

                    if ( true === bWord )
                        bEmptyLine = false;

                    // Не надо проверять убирается ли слово, мы это проверяем при добавленнии букв
                    X += nWordLen;

                    bWord = false;
                    nWordLen = 0;

                    var NewX = null;

                    var TabsCount = ParaPr.Tabs.Get_Count();
                    // Если у данного параграфа есть табы, тогда ищем среди них
                    for ( var Index = 0; Index < TabsCount; Index++ )
                    {
                        var Tab = ParaPr.Tabs.Get(Index);
                        var TabPos = Tab.Pos + this.X;
                        if ( X < TabPos )
                        {
                            NewX = TabPos;
                            Item.TabType = Tab.Val;
                            break;
                        }
                    }

                    // Если табов нет, либо их позиции левее текущей позиции ставим таб по умолчанию
                    if ( null === NewX )
                    {
                        if ( X < this.X + ParaPr.Ind.Left )
                            NewX = this.X + ParaPr.Ind.Left;
                        else
                        {
                            NewX = this.X;
                            while ( X >= NewX )
                                NewX += Default_Tab_Stop;
                        }

                        Item.TabType = tab_Left;
                    }

                    if ( NewX > XEnd && ( false === bFirstItemOnLine || RangesCount > 0 ) )
                    {
                        if ( RangesCount == CurRange )
                        {
                            bNewLine = true;
                            if ( true != bNeedNewLine )
                                this.Internal_Content_Add( Pos, new ParaNewLineRendered() );
                            else
                                Pos--; // потому что там добавится в позиции Pos + 1
                        }
                        else
                        {
                            bNewRange = true;
                            if ( true != bNeedNewRange )
                                this.Internal_Content_Add( Pos, new ParaInlineBreak() );
                            else
                                Pos--; // потому что там добавится в позиции Pos + 1
                        }
                    }
                    else
                    {
                        Item.Width        = NewX - X;
                        Item.WidthVisible = NewX - X;

                        X = NewX;

                        this.Lines[CurLine].Words++;
                        this.Lines[CurLine].Ranges[CurRange].Words++;

                        // Пробелы перед первым словом в строке не считаем
                        if ( this.Lines[CurLine].Words > 1 )
                            this.Lines[CurLine].Spaces += nSpacesCount;

                        if ( this.Lines[CurLine].Ranges[CurRange].Words > 1 )
                            this.Lines[CurLine].Ranges[CurRange].Spaces += nSpacesCount;
                    }

                    nSpacesCount = 0;

                    bFirstItemOnLine = false;

                    break;
                }
                case para_TextPr:
                {
                    break;
                }
                case para_NewLine:
                {
                    if ( break_Page === Item.BreakType )
                        bNewPage = true;

                    X += nWordLen;

                    if ( bWord && this.Lines[CurLine].Words > 1 )
                        this.Lines[CurLine].Spaces += nSpacesCount;

                    if ( bWord && this.Lines[CurLine].Ranges[CurRange].Words > 1 )
                        this.Lines[CurLine].Ranges[CurRange].Spaces += nSpacesCount;

                    if ( bWord )
                    {
                        X += nSpaceLen;
                        nSpaceLen = 0;
                    }

                    bNewLine = true;
                    bNeedNewLine = false;

                    break;
                }
                case para_End:
                {
                    if ( true === bWord )
                    {
                        bFirstItemOnLine = false;
                        bEmptyLine = false;
                    }

                    // false === bExtendBoundToBottom, потому что это уже делалось для PageBreak
                    if ( false === bExtendBoundToBottom )
                    {
                        X += nWordLen;

                        if ( bWord )
                        {
                            this.Lines[CurLine].Spaces += nSpacesCount;
                            this.Lines[CurLine].Ranges[CurRange].Spaces += nSpacesCount;
                        }

                        if ( bWord )
                        {
                            X += nSpaceLen;
                            nSpaceLen = 0;
                        }
                    }

                    bNewLine = true;
                    bEnd     = true;

                    break;
                }
                case para_InlineBreak:
                case para_PageBreakRendered:
                //case para_NewLineRendered:
                //    this.Internal_Content_Remove( Pos );
                //    Pos--;
                //    continue;
            }
            }

            // Переносим строку
            if ( bNewLine || ( bNeedNewLine && Pos < this.Content.length - 1 && para_Text == this.Content[Pos + 1].Type ) )
            {
                nSpaceLen = 0;
                if ( bNeedNewLine && true != bEnd )
                {
                    this.Internal_Content_Add( Pos + 1, new ParaNewLineRendered() );
                    Pos++;
                }

                // Строка пустая, у нее надо выставить ненулевую высоту. Делаем как Word, выставляем высоту по размеру
                // текста, на котором закончилась данная строка.
                if ( true === bEmptyLine )
                {
                    if ( LineTextAscent < TextAscent )
                        LineTextAscent = TextAscent;

                    if ( LineTextDescent < TextDescent )
                        LineTextDescent = TextDescent;

                    if ( LineAscent < TextAscent )
                        LineAscent = TextAscent;

                    if ( LineDescent < TextDescent )
                        LineDescent = TextDescent;
                }

                // Рассчитаем метрики строки
                this.Lines[CurLine].Metrics.Update( LineTextAscent, LineTextDescent, LineAscent, LineDescent, ParaPr );

                bEmptyLine = true;

                bNewLine      = false;
                bNewRange     = false;

                bNeedNewLine  = false;
                bNeedNewRange = false;

                bFirstItemOnLine  = true;
                bStartWord        = false;

                // Перед тем как перейти к новой строке мы должны убедиться, что вся высота строки
                // убирается в промежутках.

                var TempDy = this.Lines[this.Pages[CurPage].FirstLine].Metrics.Ascent;
                if ( 0 === this.Pages[CurPage].FirstLine && ( 0 === CurPage || true === this.Parent.Is_TableCellContent() ) )
                    TempDy += ParaPr.Spacing.Before;

                if ( 0 === this.Pages[CurPage].FirstLine )
                {
                    if ( ( true === ParaPr.Brd.First || 1 === CurPage ) && border_Single === ParaPr.Brd.Top.Value )
                        TempDy += ParaPr.Brd.Top.Size;
                    else if ( false === ParaPr.Brd.First && border_Single === ParaPr.Brd.Between.Value )
                        TempDy += ParaPr.Brd.Between.Size;
                }

                var Top, Bottom;

                var LastPage_Bottom = this.Pages[CurPage].Bounds.Bottom;

                if ( 0 != CurLine )
                {
                    if ( CurLine != this.Pages[CurPage].FirstLine )
                    {
                        Top = Y + TempDy + this.Lines[CurLine - 1].Metrics.Descent + this.Lines[CurLine - 1].Metrics.LineGap;
                        this.Lines[CurLine].Top = Top - this.Pages[CurPage].Y;
                        Bottom = Top + this.Lines[CurLine].Metrics.Ascent + this.Lines[CurLine].Metrics.Descent + this.Lines[CurLine].Metrics.LineGap;
                        if ( bEnd )
                        {
                            Bottom += ParaPr.Spacing.After;

                            // Если нижняя граница Between, тогда она учитывается в следующем параграфе
                            if ( true === ParaPr.Brd.Last && border_Single === ParaPr.Brd.Bottom.Value )
                                Bottom += ParaPr.Brd.Bottom.Size;

                            if ( false === this.Parent.Is_TableCellContent() && Bottom > this.YLimit && Bottom - this.YLimit <= ParaPr.Spacing.After )
                                Bottom = this.YLimit;
                        }

                        this.Lines[CurLine].Bottom = Bottom - this.Pages[CurPage].Y;

                        this.Bounds.Bottom = Bottom;
                        this.Pages[CurPage].Bounds.Bottom = Bottom;
                    }
                    else
                    {
                        Top = this.Pages[CurPage].Y;
                        this.Lines[CurLine].Top = 0;

                        Bottom = Top + this.Lines[CurLine].Metrics.Ascent + this.Lines[CurLine].Metrics.Descent + this.Lines[CurLine].Metrics.LineGap;
                        if ( bEnd )
                        {
                            Bottom += ParaPr.Spacing.After;

                            // Если нижняя граница Between, тогда она учитывается в следующем параграфе
                            if ( true === ParaPr.Brd.Last && border_Single === ParaPr.Brd.Bottom.Value )
                                Bottom += ParaPr.Brd.Bottom.Size;

                            if ( false === this.Parent.Is_TableCellContent() && Bottom > this.YLimit && Bottom - this.YLimit <= ParaPr.Spacing.After )
                                Bottom = this.YLimit;
                        }

                        this.Lines[CurLine].Bottom = Bottom - this.Pages[CurPage].Y;

                        this.Bounds.Bottom = Bottom;
                        this.Pages[CurPage].Bounds.Bottom = Bottom;

                    }

                }
                else
                {
                    Top = Y;

                    if ( 0 === CurPage || true === this.Parent.Is_TableCellContent() )
                    {
                        Bottom = Top + ParaPr.Spacing.Before + this.Lines[0].Metrics.Ascent + this.Lines[0].Metrics.Descent + this.Lines[0].Metrics.LineGap;
                        if ( true === ParaPr.Brd.First && border_Single === ParaPr.Brd.Top.Value )
                            Bottom += ParaPr.Brd.Top.Size;
                        else if ( false === ParaPr.Brd.First && border_Single === ParaPr.Brd.Between.Value )
                            Bottom += ParaPr.Brd.Between.Size;
                    }
                    else
                    {
                        // Параграф начинается с новой страницы
                        Bottom = Top + this.Lines[0].Metrics.Ascent + this.Lines[0].Metrics.Descent + this.Lines[0].Metrics.LineGap;
                        if ( border_Single === ParaPr.Brd.Top.Value )
                            Bottom += ParaPr.Brd.Top.Size;
                    }

                    if ( bEnd )
                    {
                        Bottom += ParaPr.Spacing.After;

                        // Если нижняя граница Between, тогда она учитывается в следующем параграфе
                        if ( true === ParaPr.Brd.Last && border_Single === ParaPr.Brd.Bottom.Value )
                            Bottom += ParaPr.Brd.Bottom.Size;

                        if ( false === this.Parent.Is_TableCellContent() && Bottom > this.YLimit && Bottom - this.YLimit <= ParaPr.Spacing.After )
                            Bottom = this.YLimit;
                    }

                    this.Lines[0].Top    = Top    - this.Pages[CurPage].Y;
                    this.Lines[0].Bottom = Bottom - this.Pages[CurPage].Y;

                    this.Bounds.Top    = Top;
                    this.Bounds.Bottom = Bottom;

                    this.Pages[CurPage].Bounds.Top    = Top;
                    this.Pages[CurPage].Bounds.Bottom = Bottom;
                }
                var Left   = ( 0 != CurLine ? this.X + ParaPr.Ind.Left : this.X + ParaPr.Ind.Left + ParaPr.Ind.FirstLine );
                var Right  = XLimit;
                
                // Сначала проверяем не нужно ли сделать перенос страницы в данном месте
                // Перенос не делаем, если это первая строка на новой странице
                if ( (Top > this.YLimit || Bottom > this.YLimit ) && ( CurLine != this.Pages[CurPage].FirstLine || ( 0 === CurPage && ( null != this.Get_DocumentPrev() || true === this.Parent.Is_TableCellContent() ) ) ) )
                {
                    bEnd = false;
                    bNewPage = false;

                    // Неразрывные абзацы не учитываются в таблицах
                    if ( true === ParaPr.KeepLines && null != this.Get_DocumentPrev() && true != this.Parent.Is_TableCellContent() && 0 === CurPage )
                    {
                        CurLine = 0;
                        LineStart_Pos = 0;
                    }

                    var Pos_temp = Pos;

                    // начиная с позиции начала строки и до текущей мы должны удалить метки о
                    // переносе строки и внутренних переносах строк
                    for ( var Index = LineStart_Pos; Index <= Pos_temp; Index++ )
                    {
                        var Item = this.Content[Index];

                        if ( Item.Type == para_NewLineRendered || Item.Type == para_InlineBreak )
                        {
                            this.Internal_Content_Remove( Index );
                            Index--;
                            Pos_temp--;
                        }
                    }

                    // Восстанавливаем позицию нижней границы предыдущей страницы
                    this.Pages[CurPage].Bounds.Bottom = LastPage_Bottom;

                    CurPage++;

                    // Добавляем разрыв страницы
                    this.Internal_Content_Add( LineStart_Pos, new ParaPageBreakRenderer() );
                    LineStart_Pos++;

                    // Запрашиваем у документа начальные координаты на новой странице
                    var PageStart = this.Parent.Get_PageContentStartPos( this.PageNum + CurPage );

                    if ( 0 != CurLine )
                        X = PageStart.X + ParaPr.Ind.Left;
                    else
                        X = PageStart.X + ParaPr.Ind.Left + ParaPr.Ind.FirstLine;

                    Y = PageStart.Y;

                    this.Pages[CurPage] = new CParaPage( PageStart.X, PageStart.Y, PageStart.XLimit, PageStart.YLimit, CurLine );

                    Pos       = LineStart_Pos - 1;

                    this.Lines[CurLine].Reset();

                    /*
                    LineGap    = this.Internal_Recalculate_1_LineGap( ParaPr, TextAscent, TextDescent );
                    this.Lines[CurLine].Metrics =
                    {
                        Ascent      : TextAscent,  // Высота над BaseLine
                        Descent     : TextDescent, // Высота после BaseLine
                        TextAscent  : TextAscent,  // Высота текста над BaseLine
                        TextDescent : TextDescent, // Высота текста после BaseLine
                        LineGap     : LineGap      // Дополнительное расстояние между строками
                    };

                    */
                    LineTextAscent  = 0;
                    LineTextDescent = 0;
                    LineAscent      = 0;
                    LineDescent     = 0;


                    Ranges = this.Parent.CheckRange( X, Y, XLimit, Y, this.PageNum + CurPage, true );
                    RangesCount = Ranges.length;

                    // Выставляем начальные сдвиги для промежутков. Начало промежутка = конец вырезаемого промежутка
                    this.Lines[CurLine].Add_Range( ( 0 == CurLine ? this.X + ParaPr.Ind.Left + ParaPr.Ind.FirstLine : this.X + ParaPr.Ind.Left ), (RangesCount == 0 ? XLimit : Ranges[0].X0) );
                    for ( var Index = 1; Index < Ranges.length + 1; Index++ )
                    {
                        this.Lines[CurLine].Add_Range( Ranges[Index - 1].X1, (RangesCount == Index ? XLimit : Ranges[Index].X0) );
                    }

                    CurRange = 0;
                    XEnd = 0;

                    if ( RangesCount == 0 )
                        XEnd = XLimit;
                    else
                        XEnd = Ranges[0].X0;

                    bWord = false;
                    nWordLen = 0;
                    nSpacesCount = 0;

                    continue;
                }

                var Ranges2 = this.Parent.CheckRange( this.X/*Left*/, Top, this.XLimit/*Right*/, Bottom, this.PageNum + CurPage, true );

                // Проверяем совпали ли промежутки. Если совпали, тогда данная строчка рассчитана верно,
                // и мы переходим к следующей, если нет, тогда заново рассчитываем данную строчку, но
                // с новыми промежутками.
                // Заметим, что тут возможен случай, когда Ranges2 меньше, чем Ranges, такое может случится
                // при повторном обсчете строки. (После первого расчета мы выяснили что Ranges < Ranges2,
                // при повторном обсчете строки, т.к. она стала меньше, то у нее и рассчитанная высота могла
                // уменьшиться, а значит Ranges2 могло оказаться меньше чем Ranges). В таком случае не надо
                // делать повторный пересчет, иначе будет зависание.
                if ( -1 == FlowObjects_CompareRanges( Ranges, Ranges2 ) && true === FlowObjects_CheckInjection( Ranges, Ranges2 ) )
                {
                    bEnd = false;
                    Ranges = Ranges2;

                    var Pos_temp = Pos;

                    // начиная с позиции начала строки и до текущей мы должны удалить метки о
                    // переносе строки и внутренних переносах строк
                    for ( var Index = LineStart_Pos; Index <= Pos_temp; Index++ )
                    {
                        var Item = this.Content[Index];

                        if ( Item.Type == para_NewLineRendered || Item.Type == para_InlineBreak )
                        {
                            this.Internal_Content_Remove( Index );
                            Index--;
                            Pos_temp--;
                        }
                    }

                    Pos = LineStart_Pos - 1;

                    if ( 0 == CurLine )
                        X = this.X + ParaPr.Ind.Left + ParaPr.Ind.FirstLine;
                    else
                        X = this.X + ParaPr.Ind.Left;

                    this.Lines[CurLine].Reset();
                    /*
                    LineGap    = this.Internal_Recalculate_1_LineGap( ParaPr, TextAscent, TextDescent );

                    this.Lines[CurLine].Metrics =
                    {
                        Ascent      : TextAscent,  // Высота над BaseLine
                        Descent     : TextDescent, // Высота после BaseLine
                        TextAscent  : TextAscent,  // Высота текста над BaseLine
                        TextDescent : TextDescent, // Высота текста после BaseLine
                        LineGap     : LineGap      // Дополнительное расстояние между строками
                    };
                    */

                    LineTextAscent  = 0;
                    LineTextDescent = 0;
                    LineAscent      = 0;
                    LineDescent     = 0;


                    RangesCount = Ranges.length;

                    // Выставляем начальные сдвиги для промежутков. Начало промежутка = конец вырезаемого промежутка
                    this.Lines[CurLine].Add_Range( ( 0 == CurLine ? this.X + ParaPr.Ind.Left + ParaPr.Ind.FirstLine : this.X + ParaPr.Ind.Left ), (RangesCount == 0 ? XLimit : Ranges[0].X0) );
                    for ( var Index = 1; Index < Ranges.length + 1; Index++ )
                    {
                        this.Lines[CurLine].Add_Range( Ranges[Index - 1].X1, (RangesCount == Index ? XLimit : Ranges[Index].X0) );
                    }

                    CurRange = 0;
                    XEnd = 0;

                    if ( RangesCount == 0 )
                        XEnd = XLimit;
                    else
                        XEnd = Ranges[0].X0;

                    bWord = false;
                    bNewPage = false;
                    bExtendBoundToBottom = false;
                    nWordLen = 0;
                    nSpacesCount = 0;
                }
                else
                {
                    if ( 0 != CurLine )
                        this.Lines[CurLine].W = X - this.X - ParaPr.Ind.Left;
                    else
                        this.Lines[CurLine].W = X - this.X - ParaPr.Ind.Left - ParaPr.Ind.FirstLine;

                    if ( 0 == CurRange )
                    {
                        if ( 0 != CurLine )
                            this.Lines[CurLine].Ranges[CurRange].W = X - this.X - ParaPr.Ind.Left;
                        else
                            this.Lines[CurLine].Ranges[CurRange].W = X - this.X - ParaPr.Ind.Left - ParaPr.Ind.FirstLine;
                    }
                    else
                    {
                        this.Lines[CurLine].Ranges[CurRange].W = X - Ranges[CurRange - 1].X1;
                    }

                    if ( true === bNewPage )
                    {
                        bNewPage = false;

                        // Если это последний элемент параграфа, тогда нам не надо переносить текущий параграф
                        // на новую страницу. Нам надо выставить границы так, чтобы следующий параграф начинался
                        // с новой страницы.
                        // TODO: заменить на функцию проверки
                        var Next = this.Internal_FindForward( Pos + 1, [ para_End, para_NewLine, para_Space, para_Text, para_Drawing, para_Tab, para_PageNum ] );
                        if ( true === Next.Found && para_End === Next.Type )
                        {
                            Item.Flags.NewLine = false;
                            bExtendBoundToBottom = true;
                            continue;
                        }

                        if ( CurLine > 0 )
                        {
                            // Первая линия на странице не должна двигаться
                            if ( CurLine != this.Pages[CurPage].FirstLine )
                                Y += this.Lines[CurLine - 1].Metrics.Descent + this.Lines[CurLine - 1].Metrics.LineGap +  this.Lines[CurLine].Metrics.Ascent;

                            this.Lines[CurLine].Y = Y - this.Pages[CurPage].Y;
                        }

                        CurPage++;

                        // Запрашиваем у документа начальные координаты на новой странице
                        var PageStart = this.Parent.Get_PageContentStartPos( this.PageNum + CurPage );

                        if ( 0 != CurLine )
                            X = PageStart.X + ParaPr.Ind.Left;
                        else
                            X = PageStart.X + ParaPr.Ind.Left + ParaPr.Ind.FirstLine;

                        Y = PageStart.Y;

                        this.Pages[CurPage] = new CParaPage( PageStart.X, PageStart.Y, PageStart.XLimit, PageStart.YLimit, CurLine + 1 );
                    }
                    else
                    {
                        if ( CurLine > 0 )
                        {
                            // Первая линия на странице не должна двигаться
                            if ( CurLine != this.Pages[CurPage].FirstLine )
                                Y += this.Lines[CurLine - 1].Metrics.Descent + this.Lines[CurLine - 1].Metrics.LineGap +  this.Lines[CurLine].Metrics.Ascent;

                            this.Lines[CurLine].Y = Y - this.Pages[CurPage].Y;
                        }

                        X = this.X + ParaPr.Ind.Left;
                    }

                    if ( !bEnd )
                    {

                        CurLine++;
                        this.Lines[CurLine] = new CParaLine();

                        /*
                        LineGap    = this.Internal_Recalculate_1_LineGap( ParaPr, TextAscent, TextDescent );

                        this.Lines[CurLine].Metrics =
                        {
                            Ascent      : TextAscent,  // Высота над BaseLine
                            Descent     : TextDescent, // Высота после BaseLine
                            TextAscent  : TextAscent,  // Высота текста над BaseLine
                            TextDescent : TextDescent, // Высота текста после BaseLine
                            LineGap     : LineGap      // Дополнительное расстояние между строками
                        };
                        */

                        LineTextAscent  = 0;
                        LineTextDescent = 0;
                        LineAscent      = 0;
                        LineDescent     = 0;

                        // Верх следующей строки
                        var TempY = TempDy + Y + this.Lines[CurLine - 1].Metrics.Descent + this.Lines[CurLine - 1].Metrics.LineGap;

                        // Получаем промежутки обтекания, т.е. промежутки, которые нам нельзя использовать
                        Ranges = this.Parent.CheckRange( X, TempY, XLimit, TempY, this.PageNum + CurPage, true );
                        RangesCount = Ranges.length;

                        // Выставляем начальные сдвиги для промежутков. Началао промежутка = конец вырезаемого промежутка
                        this.Lines[CurLine].Add_Range( X, (RangesCount == 0 ? XLimit : Ranges[0].X0) );
                        for ( var Index = 1; Index < Ranges.length + 1; Index++ )
                        {
                            this.Lines[CurLine].Add_Range( Ranges[Index - 1].X1, (RangesCount == Index ? XLimit : Ranges[Index].X0) );
                        }

                        CurRange = 0;
                        XEnd = 0;

                        if ( RangesCount == 0 )
                            XEnd = XLimit;
                        else
                            XEnd = Ranges[0].X0;


                        bWord = false;
                        nWordLen = 0;
                        nSpacesCount = 0;

                        LineStart_Pos    = Pos + 1;
                    }
                    else if ( true === bEnd && true === bExtendBoundToBottom )
                    {
                        // Специальный случай с PageBreak, когда после самого PageBreak ничего нет
                        // в параграфе

                        this.Pages[CurPage].Bounds.Bottom = this.Pages[CurPage].YLimit;
                        this.Bounds.Bottom = this.Pages[CurPage].YLimit;
                    }
                }
            }
            else if ( bNewRange || ( bNeedNewRange && Pos < this.Content.length - 1 && para_Text == this.Content[Pos + 1].Type ) )
            {
                nSpaceLen = 0;
                if ( bNeedNewRange )
                {
                    this.Internal_Content_Add( Pos + 1, new ParaInlineBreak() );
                    Pos++;
                }

                bNewRange     = false;
                bNeedNewRange = false;

                bFirstItemOnLine = true;
                bStartWord       = false;

                if ( 0 == CurRange )
                {
                    if ( 0 != CurLine )
                        this.Lines[CurLine].Ranges[CurRange].W = X - this.X - ParaPr.Ind.Left;
                    else
                        this.Lines[CurLine].Ranges[CurRange].W = X - this.X - ParaPr.Ind.Left - ParaPr.Ind.FirstLine;
                }
                else
                {
                    this.Lines[CurLine].Ranges[CurRange].W = X - Ranges[CurRange - 1].X1;
                }

                CurRange++;

                X = this.Lines[CurLine].Ranges[CurRange].X;
                if ( CurRange == RangesCount )
                    XEnd = XLimit;
                else
                    XEnd = Ranges[CurRange].X0;

                bWord = false;
                nWordLen = 0;
                nSpacesCount = 0;
            }
        }

        // TODO: пока таким образом мы делаем, this.Y - был верхний краем параграфа
        //       Потом надо будет переделать.
        for ( var PageIndex = 0; PageIndex < this.Pages.length; PageIndex++ )
        {
            var StartLine = this.Pages[PageIndex].FirstLine;
            var EndLine = StartLine;
            if ( PageIndex != this.Pages.length - 1 )
                EndLine = this.Pages[PageIndex + 1].FirstLine - 1;
            else
                EndLine = this.Lines.length - 1;

            var TempDy = this.Lines[this.Pages[PageIndex].FirstLine].Metrics.Ascent;
            if ( 0 === StartLine && ( 0 === PageIndex || true === this.Parent.Is_TableCellContent() ) )
                TempDy += ParaPr.Spacing.Before;

            if ( 0 === StartLine )
            {
                if ( ( true === ParaPr.Brd.First || 1 === PageIndex ) && border_Single === ParaPr.Brd.Top.Value )
                    TempDy += ParaPr.Brd.Top.Size;
                else if ( false === ParaPr.Brd.First && border_Single === ParaPr.Brd.Between.Value )
                    TempDy += ParaPr.Brd.Between.Size;
            }

            for ( var Index = StartLine; Index <= EndLine; Index++ )
            {
                this.Lines[Index].Y += TempDy;
                if ( this.Lines[Index].Metrics.LineGap < 0 )
                    this.Lines[Index].Y += this.Lines[Index].Metrics.LineGap;
            }
        }
        return true;
    },

    // Рассчитываем текст
    Internal_Recalculate_0 : function(bTableCell)
    {
        if ( pararecalc_0_None === this.RecalcInfo.Recalc_0_Type && bTableCell !== true)
            return;

        var Pr        = this.Get_CompiledPr();
        var ParaPr    = Pr.ParaPr;
        var CurTextPr = Pr.TextPr;

        CurTextPr.Update_FontSize();

        // Предполагается, что при вызове данной функции Content не содержит
        // рассчитанных переносов строк.

        g_oTextMeasurer.SetFont( CurTextPr );

        // Под Descent мы будем понимать descent + linegap (которые записаны в шрифте)
        var TextAscent  = 0;
        var TextHeight  = 0;
        var TextDescent = 0;

        if ( Math.abs(CurTextPr.FontSize - CurTextPr.FontSize_S) < 0.01 )
        {
            TextHeight  = g_oTextMeasurer.GetHeight();
            TextDescent = Math.abs( g_oTextMeasurer.GetDescender() );
        }
        else
        {
            var OldSize = CurTextPr.FontSize;
            CurTextPr.FontSize = CurTextPr.FontSize_S;
            g_oTextMeasurer.SetFont( CurTextPr );
            TextHeight  = g_oTextMeasurer.GetHeight();
            TextDescent = Math.abs( g_oTextMeasurer.GetDescender() );
            CurTextPr.FontSize = OldSize;
            g_oTextMeasurer.SetFont( CurTextPr );
        }
        TextAscent  = TextHeight - TextDescent;

        var ContentLength = this.Content.length;
        for ( var Pos = 0; Pos < ContentLength; Pos++ )
        {
            var Item = this.Content[Pos];

            Item.Parent = this;
            Item.DocumentContent = this.Parent;
            Item.DrawingDocument = this.Parent.DrawingDocument;

            switch( Item.Type )
            {
                case para_Numbering:
                {
                    var NumPr = ParaPr.NumPr;
                    if ( undefined === NumPr || undefined === NumPr.NumId )
                    {
                        // Так мы обнуляем все рассчитанные ширины данного элемента
                        Item.Measure( g_oTextMeasurer, undefined );
                        break;
                    }

                    var Numbering = this.Parent.Get_Numbering();
                    var NumLvl    = Numbering.Get_AbstractNum( NumPr.NumId ).Lvl[NumPr.Lvl];
                    var NumSuff   = NumLvl.Suff;
                    var NumInfo   = this.Parent.Internal_GetNumInfo( this.Id, NumPr );
                    var NumTextPr = this.Get_CompiledPr2(false).TextPr.Copy();
                    NumTextPr.Merge( this.TextPr.Value );
                    NumTextPr.Merge( NumLvl.TextPr );

                    // Здесь измеряется только ширина символов нумерации, без суффикса
                    Item.Measure( g_oTextMeasurer, Numbering, NumInfo, NumTextPr, NumPr );

                    switch( NumSuff )
                    {
                        case numbering_suff_Nothing:
                        {
                            // Ничего не делаем
                            break;
                        }
                        case numbering_suff_Space:
                        {
                            var OldFont = g_oTextMeasurer.GetFont();
                            g_oTextMeasurer.SetFont( NumTextPr );
                            Item.WidthSuff = g_oTextMeasurer.Measure( " " ).Width;
                            g_oTextMeasurer.SetFont( OldFont );
                            break;
                        }
                        case numbering_suff_Tab:
                        {
                            // Это будет рассчитываться в Internal_Recalculate_1

                            break;
                        }
                    }

                    break;
                }
                case para_PresentationNumbering:
                {
                    var Level  = this.PresentationPr.Level;
                    var Bullet = this.PresentationPr.Bullet;

                    var BulletNum = 0;
                    if ( Bullet.Get_Type() >= numbering_presentationnumfrmt_ArabicPeriod )
                    {
                        var Prev = this.Prev;
                        while ( null != Prev && type_Paragraph === Prev.GetType() )
                        {
                            var PrevLevel  = Prev.PresentationPr.Level;
                            var PrevBullet = Prev.Get_PresentationNumbering();

                            // Если предыдущий параграф более низкого уровня, тогда его не учитываем
                            if ( Level < PrevLevel )
                            {
                                Prev = Prev.Prev;
                                continue;
                            }
                            else if ( Level > PrevLevel )
                                break;
                            else if ( PrevBullet.Get_Type() === Bullet.Get_Type() && PrevBullet.Get_StartAt() === PrevBullet.Get_StartAt() )
                            {
                                if ( true != Prev.IsEmpty() )
                                    BulletNum++;

                                Prev = Prev.Prev;
                            }
                            else
                                break;
                        }
                    }

                    // Найдем настройки для первого текстового элемента
                    var FirstTextPr = this.Internal_CalculateTextPr( this.Internal_GetStartPos() );

                    Item.Bullet    = Bullet;
                    Item.BulletNum = BulletNum + 1;
                    Item.Measure( g_oTextMeasurer, FirstTextPr );

                    break;
                }
                case para_Text:
                case para_Space:
                case para_Drawing:
                case para_PageNum:
                case para_Tab:
                case para_NewLine:
                {
                    Item.Measure( g_oTextMeasurer);

                    break;
                }
                case para_TextPr:
                {
                    CurTextPr = this.Internal_CalculateTextPr( Pos );
                    CurTextPr.Update_FontSize();
                    g_oTextMeasurer.SetFont( CurTextPr );

                    if ( Math.abs(CurTextPr.FontSize - CurTextPr.FontSize_S) < 0.01 )
                    {
                        TextDescent = Math.abs( g_oTextMeasurer.GetDescender() );
                        TextHeight  = g_oTextMeasurer.GetHeight();
                    }
                    else
                    {
                        var OldSize = CurTextPr.FontSize;
                        CurTextPr.FontSize = CurTextPr.FontSize_S;
                        g_oTextMeasurer.SetFont( CurTextPr );
                        TextDescent = Math.abs( g_oTextMeasurer.GetDescender() );
                        TextHeight  = g_oTextMeasurer.GetHeight();
                        CurTextPr.FontSize = OldSize;
                        g_oTextMeasurer.SetFont( CurTextPr );
                    }
                    TextAscent = TextHeight - TextDescent;

                    break;
                }
                case para_End:
                {
                    bWord  = false;
                    bSpace = false;

                    var bEndCell = false;
                    if ( null === this.Get_DocumentNext() && true === this.Parent.Is_TableCellContent() )
                        bEndCell = true;

                    var EndTextPr = this.Get_CompiledPr2(false).TextPr.Copy();
                    EndTextPr.Merge( this.TextPr.Value );
                    g_oTextMeasurer.SetFont( EndTextPr );
                    Item.Measure( g_oTextMeasurer, bEndCell );
                    g_oTextMeasurer.SetFont( CurTextPr );

                    break;
                }
            }

            Item.TextAscent  = TextAscent;
            Item.TextDescent = TextDescent;
            Item.TextHeight  = TextHeight;
        }

        this.RecalcInfo.Set_Type_0( pararecalc_0_None );
    },

    // Пересчитываем сдвиги элементов внутри параграфа, в зависимости от align.
    // Пересчитываем текущую позицию курсора, и видимые ширины пробелов.
    Internal_Recalculate_2 : function(Pos, UpdateTarget, ReturnTarget)
    {
        // Здесь мы пересчитываем ширину пробелов (и в особенных случаях дополнительное
        // расстояние между символами) с учетом прилегания параграфа.
        // 1. Если align = left, тогда внутри каждого промежутка текста выравниваем его
        //    к левой границе промежутка.
        // 2. Если align = right, тогда внутри каждого промежутка текста выравниваем его
        //    к правой границе промежутка.
        // 3. Если align = center, тогда внутри каждого промежутка текста выравниваем его
        //    по центру промежутка.
        // 4. Если align = justify, тогда
        //    4.1 Если внутри промежутка ровно 1 слово.
        //        4.1.1 Если промежуток в строке 1 и слово занимает почти всю строку,
        //              добавляем в слове к каждой букве дополнительное расстояние между
        //              символами, чтобы ширина слова совпала с шириной строки.
        //        4.1.2 Если промежуток первый, тогда слово приставляем к левой границе
        //              промежутка
        //        4.1.3 Если промежуток последний, тогда приставляем слово к правой
        //              границе промежутка
        //        4.1.4 Если промежуток ни первый, ни последний, тогда ставим слово по
        //              середине промежутка
        //    4.2 Если слов больше 1, тогда, исходя из количества пробелов между словами в
        //        промежутке, увеличиваем их на столько, чтобы правая граница последнего
        //        слова совпала с правой границей промежутка

        var Pr = this.Get_CompiledPr2(false);
        var ParaPr    = Pr.ParaPr;

        var Y = this.Pages[0].Y + this.Lines[0].Y;
        var CurLine  = 0;
        var CurRange = 0;
        var CurPage  = 0;

        var RangesCount = this.Lines[0].Ranges.length;
        var RangeWidth  = this.Lines[0].Ranges[0].XEnd - this.X - ParaPr.Ind.Left - ParaPr.Ind.FirstLine;

        var X = 0;
        var JustifySpace = 0;
        var JustifyWord  = 0;

        switch (ParaPr.Jc)
        {
            case align_Left   : X = this.X + ParaPr.Ind.Left + ParaPr.Ind.FirstLine; break;
            case align_Right  : X = this.X + ParaPr.Ind.Left + ParaPr.Ind.FirstLine +  RangeWidth - this.Lines[0].Ranges[0].W; break;
            case align_Center : X = this.X + ParaPr.Ind.Left + ParaPr.Ind.FirstLine + (RangeWidth - this.Lines[0].Ranges[0].W) / 2; break
            case align_Justify:
            {
                X = this.X + ParaPr.Ind.Left + ParaPr.Ind.FirstLine;

                if ( 1 == this.Lines[0].Ranges[0].Words )
                {
                    if ( 1 == RangesCount && this.Lines.length > 1 )
                    {
                        // Подсчитаем количество букв в слове
                        var LettersCount = 0;
                        var TempPos = 0;
                        var LastW = 0;
                        while ( this.Content[TempPos].Type != para_NewLine && this.Content[TempPos].Type != para_NewLineRendered && this.Content[TempPos].Type != para_InlineBreak )
                        {
                            if ( para_Text == this.Content[TempPos].Type )
                            {
                                LettersCount++;
                                LastW = this.Content[TempPos].Width;
                            }

                            TempPos++;
                        }

                        // Либо слово целиком занимает строку, либо не целиком, но разница очень мала
                        if ( RangeWidth - this.Lines[0].Ranges[0].W <= 2 * LastW && LettersCount > 0 )
                            JustifyWord = (RangeWidth -  this.Lines[0].Ranges[0].W) / LettersCount;
                    }

                    // Данный промежуток точно первый, потому что он вообще первый. Поэтому больше
                    // ничего не делаем.
                }
                else
                {
                    // Последний промежуток последней строки не надо растягивать по ширине.
                    if ( this.Lines[0].Ranges[0].Spaces > 0 && ( CurLine != this.Lines.length - 1 || CurRange != this.Lines[CurLine].Ranges.length - 1 ) )
                        JustifySpace = (RangeWidth - this.Lines[0].Ranges[0].W) / this.Lines[0].Ranges[0].Spaces;
                    else
                        JustifySpace = 0;
                }

                break;
            }
            default : X = this.X + ParaPr.Ind.Left + ParaPr.Ind.FirstLine; break;
        }

        this.Lines[CurLine].Ranges[CurRange].XVisible = X;
        var bFirstLineItem = true;
        var SpacesCounter = this.Lines[0].Spaces;

        var bFindPos = ("undefined" == typeof(Pos) ? false : true);

        for ( var ItemNum = 0; ItemNum < this.Content.length; ItemNum++ )
        {
            var Item = this.Content[ItemNum];

            if ( ItemNum == this.CurPos.ContentPos )
            {
                this.CurPos.X = X;
                this.CurPos.Y = Y;
                this.CurPos.PagesPos = CurPage;

                if ( true === UpdateTarget )
                {
                    var CurTextPr = this.Internal_CalculateTextPr(ItemNum);
                    CurTextPr.Update_FontSize();

                    var Height;
                    var Ascender;

                    if ( Math.abs(CurTextPr.FontSize_S-CurTextPr.FontSize) < 0.001  )
                    {
                        Height   = Item.TextHeight;
                        Ascender = Item.TextAscent;
                    }
                    else
                    {
                        var Koef = ( CurTextPr.FontSize / CurTextPr.FontSize_S );
                        Height   = Item.TextHeight * Koef;
                        Ascender = Item.TextAscent * Koef;
                    }

                    this.DrawingDocument.SetTargetSize( Height );

                    var TargetY = Y - Ascender;
                    switch( CurTextPr.VertAlign )
                    {
                        case vertalign_SubScript:
                        {
                            TargetY -= CurTextPr.FontSize_S * g_dKoef_pt_to_mm * vertalign_Koef_Sub;
                            break;
                        }
                        case vertalign_SuperScript:
                        {
                            TargetY -= CurTextPr.FontSize_S * g_dKoef_pt_to_mm * vertalign_Koef_Super;
                            break;
                        }
                    }

                    var Page_Abs = this.Get_StartPage_Absolute() + CurPage;
                    this.DrawingDocument.UpdateTarget( X, TargetY, Page_Abs );
                }
            }

            if ( bFindPos && Pos == ItemNum )
            {
                if ( true === ReturnTarget )
                {
                    var CurTextPr = this.Internal_CalculateTextPr(ItemNum);
                    CurTextPr.Update_FontSize();

                    var Height;
                    var Ascender;

                    if ( Math.abs(CurTextPr.FontSize_S-CurTextPr.FontSize) < 0.001  )
                    {
                        Height   = Item.TextHeight;
                        Ascender = Item.TextAscent;
                    }
                    else
                    {
                        var Koef = ( CurTextPr.FontSize / CurTextPr.FontSize_S );
                        Height   = Item.TextHeight * Koef;
                        Ascender = Item.TextAscent * Koef;
                    }

                    var TargetY = Y - Ascender;

                    switch( CurTextPr.VertAlign )
                    {
                        case vertalign_SubScript:
                        {
                            TargetY -= CurTextPr.FontSize_S * g_dKoef_pt_to_mm * vertalign_Koef_Sub;
                            break;
                        }
                        case vertalign_SuperScript:
                        {
                            TargetY -= CurTextPr.FontSize_S * g_dKoef_pt_to_mm * vertalign_Koef_Super;
                            break;
                        }
                    }

                    return { X : X, Y : TargetY, Height : Height, Internal : { Line : CurLine, Page : CurPage, Range : CurRange } };
                }
                else
                    return { X : X, Y : Y, PageNum : CurPage + this.Get_StartPage_Absolute(), Internal : { Line : CurLine, Page : CurPage, Range : CurRange } };
            }


            switch( Item.Type )
            {
                case para_Numbering:
                {
                    X += Item.WidthVisible;
                    break;
                }
                case para_PresentationNumbering:
                {
                    X += Item.WidthVisible;
                    break;
                }

                case para_Text:

                    bFirstLineItem = false;
                    if ( CurLine != this.Lines.length - 1 && JustifyWord > 0 )
                        Item.WidthVisible = Item.Width + JustifyWord;
                    else
                        Item.WidthVisible = Item.Width;

                    X += Item.WidthVisible;
                    break;

                case para_Space:

                    if ( !bFirstLineItem && CurLine != this.Lines.length - 1 && SpacesCounter > 0 )
                    {
                        Item.WidthVisible = Item.Width + JustifySpace;
                        SpacesCounter--;
                    }
                    else
                        Item.WidthVisible = Item.Width;

                    X += Item.WidthVisible;

                    break;

                case para_Drawing:

                    // Обновляем позицию объекта
                    if ( true != bFindPos )
                        Item.Update_Position( X, Y - Item.H, this.Get_StartPage_Absolute() + CurPage );

                    X += Item.WidthVisible;

                    break;

                case para_PageNum:
                case para_Tab:

                    X += Item.WidthVisible;

                    break;

                case para_TextPr:

                    break;

                case para_End:

                    X += Item.Width;
                    break;

                case para_InlineBreak:

                    CurRange++;

                    var Range = this.Lines[CurLine].Ranges[CurRange];
                    RangeWidth = Range.XEnd - Range.X;

                    switch (ParaPr.Jc)
                    {
                        case align_Left   : X = Range.X; break;
                        case align_Right  : X = Range.X +  RangeWidth - Range.W; break;
                        case align_Center : X = Range.X + (RangeWidth - Range.W) / 2; break
                        case align_Justify:
                        {
                            X = Range.X;

                            if ( 1 == Range.Words )
                            {
                                if ( 1 == RangesCount && this.Lines.length > 1 )
                                {
                                    // Подсчитаем количество букв в слове
                                    var LettersCount = 0;
                                    var TempPos = 0;
                                    var LastW = 0;
                                    while ( this.Content[TempPos].Type != para_NewLine && this.Content[TempPos].Type != para_NewLineRendered && this.Content[TempPos].Type != para_InlineBreak )
                                    {
                                        if ( para_Text == this.Content[TempPos].Type )
                                        {
                                            LettersCount++;
                                            LastW = this.Content[TempPos].Width;
                                        }

                                        TempPos++;
                                    }

                                    // Либо слово целиком занимает строку, либо не целиком, но разница очень мала
                                    if ( RangeWidth - this.Lines[0].Ranges[0].W <= 2 * LastW && LettersCount > 0 )
                                        JustifyWord = (RangeWidth -  this.Lines[0].Ranges[0].W) / LettersCount;
                                }
                                else if ( 0 == CurRange || ( CurLine == this.Lines.length - 1 && CurRange == this.Lines[CurLine].Ranges.length - 1 ) )
                                {
                                    // Ничего не делаем (выравниваем текст по левой границе)
                                }
                                else if ( CurRange == this.Lines[CurLine].Ranges.length - 1 )
                                {
                                    X = Range.X +  RangeWidth - Range.W;
                                }
                                else
                                {
                                    X = Range.X + (RangeWidth - Range.W) / 2;
                                }
                            }
                            else
                            {
                                // Последний промежуток последней строки не надо растягивать по ширине.
                                if ( Range.Spaces > 0 && ( CurLine != this.Lines.length - 1 || CurRange != this.Lines[CurLine].Ranges.length - 1  ) )
                                    JustifySpace = (RangeWidth - Range.W) / Range.Spaces;
                                else
                                    JustifySpace = 0;
                            }

                            break;
                        }
                        default : X = Range.X; break;
                    }

                    SpacesCounter = this.Lines[CurLine].Ranges[CurRange].Spaces;
                    this.Lines[CurLine].Ranges[CurRange].XVisible = X;

                    break;

                case para_NewLine:

                    if ( break_Page === Item.BreakType && true === Item.Flags.NewLine )
                        CurPage++;
                    else if ( break_Page === Item.BreakType && false === Item.Flags.NewLine )
                    {
                        X += Item.WidthVisible;
                        break;
                    }

                    X += Item.Width;

                // break специально не ставим
                case para_NewLineRendered:

                    JustifyWord  = 0;
                    JustifySpace = 0;
                    CurLine++;
                    CurRange = 0;

                    Y = this.Pages[CurPage].Y + this.Lines[CurLine].Y;
                    var bFirstLineItem = true;

                    var Range = this.Lines[CurLine].Ranges[CurRange];
                    RangesCount = this.Lines[CurLine].Ranges.length;
                    RangeWidth = Range.XEnd - Range.X;

                    switch (ParaPr.Jc)
                    {
                        case align_Left   : X = Range.X; break;
                        case align_Right  : X = Range.X +  RangeWidth - Range.W; break;
                        case align_Center : X = Range.X + (RangeWidth - Range.W) / 2; break
                        case align_Justify:
                        {
                            X = Range.X;

                            if ( 1 == Range.Words )
                            {
                                if ( 1 == RangesCount && this.Lines.length > 1 )
                                {
                                    // Подсчитаем количество букв в слове
                                    var LettersCount = 0;
                                    var TempPos = 0;
                                    var LastW = 0;
                                    while ( this.Content[TempPos].Type != para_NewLine && this.Content[TempPos].Type != para_NewLineRendered && this.Content[TempPos].Type != para_InlineBreak )
                                    {
                                        if ( para_Text == this.Content[TempPos].Type )
                                        {
                                            LettersCount++;
                                            LastW = this.Content[TempPos].Width;
                                        }

                                        TempPos++;
                                    }

                                    // Либо слово целиком занимает строку, либо не целиком, но разница очень мала
                                    if ( RangeWidth - this.Lines[0].Ranges[0].W <= 2 * LastW && LettersCount > 0 )
                                        JustifyWord = (RangeWidth -  this.Lines[0].Ranges[0].W) / LettersCount;
                                }
                                else if ( 0 == CurRange || ( CurLine == this.Lines.length - 1 && CurRange == this.Lines[CurLine].Ranges.length - 1 ) )
                                {
                                    // Ничего не делаем (выравниваем текст по левой границе)
                                }
                                else if ( CurRange == this.Lines[CurLine].Ranges.length - 1 )
                                {
                                    X = Range.X +  RangeWidth - Range.W;
                                }
                                else
                                {
                                    X = Range.X + (RangeWidth - Range.W) / 2;
                                }
                            }
                            else
                            {
                                // Последний промежуток последней строки не надо растягивать по ширине.
                                if ( Range.Spaces > 0 && ( CurLine != this.Lines.length - 1 || CurRange != this.Lines[CurLine].Ranges.length - 1 ) )
                                    JustifySpace = (RangeWidth - Range.W) / Range.Spaces;
                                else
                                    JustifySpace = 0;
                            }

                            break;
                        }
                        default : X = Range.X; break;
                    }

                    SpacesCounter = this.Lines[CurLine].Ranges[CurRange].Spaces;
                    this.Lines[CurLine].Ranges[CurRange].XVisible = X;
                    this.Lines[CurLine].X = X - this.X;

                    break;

                case para_PageBreakRendered:

                    CurPage++;
                    Y = this.Pages[CurPage].Y + this.Lines[CurLine].Y;

                    break;
            }
        }
    },

    Internal_Recalculate_1_LineGap : function(ParaPr, TextAscent, TextDescent)
    {
        var LineGap = 0;
        switch ( ParaPr.Spacing.LineRule )
        {
            case linerule_Auto:
            {
                LineGap = ( TextAscent + TextDescent ) * ( ParaPr.Spacing.Line - 1 );
                break;
            }
            case linerule_Exact:
            {
                var ExactValue = Math.max( 1, ParaPr.Spacing.Line );
                LineGap = ExactValue - ( TextAscent + TextDescent );
                break;
            }
            case linerule_AtLeast:
            {
                var LineGap1 = ParaPr.Spacing.Line;
                var LineGap2 = TextAscent + TextDescent;
                LineGap = Math.max( LineGap1, LineGap2 ) - ( TextAscent + TextDescent );
                break;
            }

        }
        return LineGap;
    },

    // Можно ли объединить границы двух параграфов с заданными настройками Pr1, Pr2
    Internal_CompareBrd : function(Pr1, Pr2)
    {
        // Сначала сравним правую и левую границы параграфов
        var Left_1  = Math.min( Pr1.Ind.Left, Pr1.Ind.Left + Pr1.Ind.FirstLine );
        var Right_1 = Pr1.Ind.Right;
        var Left_2  = Math.min( Pr2.Ind.Left, Pr2.Ind.Left + Pr2.Ind.FirstLine );
        var Right_2 = Pr2.Ind.Right;

        if ( Math.abs( Left_1 - Left_2 ) > 0.001 || Math.abs( Right_1 - Right_2 ) > 0.001 )
            return false;

        if ( false === Pr1.Brd.Top.Compare( Pr2.Brd.Top )   || false === Pr1.Brd.Bottom.Compare( Pr2.Brd.Bottom ) ||
             false === Pr1.Brd.Left.Compare( Pr2.Brd.Left ) || false === Pr1.Brd.Right.Compare( Pr2.Brd.Right )   ||
             false === Pr1.Brd.Between.Compare( Pr2.Brd.Between ) )
            return false;

        return true;
    },

    // Проверяем не пустые ли границы
    Internal_Is_NullBorders : function (Borders)
    {
        if ( border_None != Borders.Top.Value  || border_None != Borders.Bottom.Value ||
             border_None != Borders.Left.Value || border_None != Borders.Right.Value  ||
             border_None != Borders.Between.Value )
            return false;

        return true;
    },

    Internal_Get_ClearPos : function(Pos)
    {
        // TODO: Переделать. Надо ускорить. При пересчете параграфа запоминать
        // все позиции элементов para_NewLineRendered, para_InlineBreak, para_PageBreakRendered,
        // para_FlowObjectAnchor, para_CollaborativeChangesEnd, para_CollaborativeChangesStart

        var Counter = 0;
        for ( var Index = 0; Index < Math.min(Pos, this.Content.length - 1); Index++ )
        {
            if ( false === this.Content[Index].Is_RealContent() )
                Counter++;
        }
        return Pos - Counter;
    },

    Internal_Get_RealPos : function(Pos)
    {
        // TODO: Переделать. Надо ускорить. При пересчете параграфа запоминать
        // все позиции элементов para_NewLineRendered, para_InlineBreak, para_PageBreakRendered,
        // para_FlowObjectAnchor, para_CollaborativeChangesEnd, para_CollaborativeChangesStart
        
        var Counter = Pos;
        for ( var Index = 0; Index <= Math.min(Counter, this.Content.length - 1); Index++ )
        {
            if ( false === this.Content[Index].Is_RealContent() )
                Counter++;
        }

        return Counter;
    },

    Internal_Get_ClearContentLength : function()
    {
        var Len = this.Content.length;
        var ClearLen = Len;
        for ( var Index = 0; Index < Len; Index++ )
        {
            var Item = this.Content[Index];
            if ( false === Item.Is_RealContent() )
                ClearLen--;
        }

        return ClearLen;
    },

    Recalculate : function(bTableCell)
    {
        // Подготавливаем контент параграфа к новому пересчету:
        //  1. Если у нас есть нумерация в параграфе, то переносим ее в начало.
        //  2. Удаляем все рассчитанные переносы строк, внутренние переносы, переносы страниц
        //  3. Объединяем подряд идущие TextPr

        if ( para_PresentationNumbering != this.Content[0].Type )
            this.Internal_Content_Add( 0, new ParaPresentationNumbering(this.PresentationPr.Bullet) );

        for ( var Pos = 1; Pos < this.Content.length; Pos++ )
        {
            var Item = this.Content[Pos];

            switch(Item.Type)
            {
                case para_FlowObjectAnchor:
                {
                    // Удаляем все привязки, они заново выставятся в конце рассчета
                    this.Internal_Content_Remove( Pos );
                    Pos--;
                    break;
                }
                case para_Numbering:
                case para_PresentationNumbering:
                {
                    // Удаляем лишние символы нумерации
                    this.Internal_Content_Remove( Pos );
                    Pos--;
                    break;
                }
                case para_NewLineRendered:
                case para_InlineBreak:
                case para_PageBreakRendered:
                {
                    // Удаляем рассчитанные переносы строк
                    this.Internal_Content_Remove( Pos );
                    Pos--;
                    break;
                }
                case para_CollaborativeChangesEnd:
                case para_CollaborativeChangesStart:
                {
                    if ( true === this.DeleteCollaborativeMarks )
                    {
                        this.Internal_Content_Remove( Pos );
                        Pos--;
                    }

                    break;
                }
                case para_TextPr:
                {
                    // Удаляем подряд идущие TextPr (только если на втором не стоит текущая позиция)
                    if ( Pos > 0 && this.Content[Pos - 1].Type == para_TextPr && Pos != this.CurPos.ContentPos )
                    {
                        // Удаляем предыдущую текстовую настройку
                        this.Internal_Content_Remove( Pos - 1 );
                        Pos--;
                    }

                    break;
                }
                case para_CommentStart:
                case para_CommentEnd:
                {
                    // Удаляем метки комментариев, если самого комментария нет
                    if ( null === editor.WordControl.m_oLogicDocument.Comments.Get_ById( Item.Id ) )
                    {
                        this.Internal_Content_Remove( Pos );
                        Pos--;
                    }

                    break;
                }
                case para_NewLine:
                {
                    // В переносах строки выставляем стартовые флаги
                    if ( Item.Type === para_NewLine && break_Page === Item.BreakType )
                    {
                        Item.Flags.NewLine = true;
                    }

                    break;
                }
                case para_Empty:
                {
                    if ( Item.Type === para_Empty && true === Item.Check_Delete() )
                    {
                        this.Internal_Content_Remove( Pos );
                        Pos--;
                    }

                    break;
                }
            }
        }

        // Пересчет параграфа:
        //  1. Сначала рассчитаем новые переносы строк, при этом подсчитав количество
        //     слов и пробелов между словами.
        //  2. Далее, в зависимости от прилегания(align) параграфа, проставим начальные
        //     позиции строк и проставим видимые размеры пробелов.

        this.Internal_Recalculate_0(bTableCell);
        this.Internal_Recalculate_1();
        this.Internal_Recalculate_2();

        this.FontMap.NeedRecalc = true;
    },

    RecalculateCurPos : function()
    {
        this.Internal_Recalculate_2(this.CurPos.ContentPos, true);
    },

    increaseLevel : function(bIncrease)
    {
        var _cur_level = this.PresentationPr.Level;
        var _new_level;
        var _history_obj;
        var _content_index;
        var _content = this.Content;
        var _text_pr_value;
        var _old_font_size;
        var _new_font_size;
        var _new_indent;
        if(bIncrease)
        {
            if(_cur_level < 8)
            {
                _new_level = _cur_level + 1;
                this.Set_PresentationLevel(_new_level);
                if(this.Pr.Ind && this.Pr.Ind.Left != undefined)
                {
                    this.Set_Ind( { FirstLine : this.Pr.Ind.FirstLine, Left : this.Pr.Ind.Left + 11.1125 } );
                }
                for(_content_index = 0; _content_index < _content.length; ++_content_index)
                {
                    if(_content[_content_index].Type == para_TextPr)
                    {
                        _text_pr_value = _content[_content_index].Value;
                        if(_text_pr_value != undefined && _text_pr_value.FontSize != undefined && (_text_pr_value.FontSize - 4) > 0)
                        {
                            _old_font_size = _text_pr_value.FontSize;
                            _text_pr_value.FontSize -= 4;
                            _new_font_size = _text_pr_value.FontSize;

                            _history_obj = {};
                            _history_obj.Type = history_undo_redo_const;
                            _history_obj.textPr = _text_pr_value;
                            _history_obj.oldFontSize = _old_font_size;
                            _history_obj.newFontSize = _new_font_size;
                            _history_obj.undo_function = function(data)
                            {
                                data.textPr.FontSize = data.oldFontSize;
                            };
                            _history_obj.redo_function = function(data)
                            {
                                data.textPr.FontSize = data.newFontSize;
                            };
                            History.Add(this, _history_obj);
                        }
                    }
                }
                this.Recalc_CompiledPr();
            }
        }
        else
        {
            if(_cur_level > 0)
            {
                _new_level = _cur_level - 1;
                this.Set_PresentationLevel(_new_level);
                if(this.Pr.Ind && this.Pr.Ind.Left != undefined)
                {
                    _new_indent = this.Pr.Ind.Left - 11.1125;
                    if(_new_indent < 0)
                    {
                        _new_indent = 0;
                    }
                    this.Set_Ind( { FirstLine : this.Pr.Ind.FirstLine, Left : _new_indent } );
                }
                this.Recalc_CompiledPr();
                for(_content_index = 0; _content_index < _content.length; ++_content_index)
                {
                    if(_content[_content_index].Type == para_TextPr)
                    {
                        _text_pr_value = _content[_content_index].Value;
                        if(_text_pr_value != undefined && _text_pr_value.FontSize != undefined)
                        {
                            _old_font_size = _text_pr_value.FontSize;
                            _text_pr_value.FontSize += 4;
                            _new_font_size = _text_pr_value.FontSize;

                            _history_obj = {};
                            _history_obj.Type = history_undo_redo_const;
                            _history_obj.textPr = _text_pr_value;
                            _history_obj.oldFontSize = _old_font_size;
                            _history_obj.newFontSize = _new_font_size;
                            _history_obj.undo_function = function(data)
                            {
                                data.textPr.FontSize = data.oldFontSize;
                            };
                            _history_obj.redo_function = function(data)
                            {
                                data.textPr.FontSize = data.newFontSize;
                            };
                            History.Add(this, _history_obj);
                        }
                    }
                }
            }
        }
    },

    Draw : function(PageNum, pGraphics)
    {
        var PNum = "number" == typeof(PageNum) ? PageNum - this.PageNum : 0;
        var PageBreak = PNum;
        var Item;

        var StartPos = 0;
        var CollaborativeChanges = 0;
        while ( PageBreak > 0  && StartPos < this.Content.length  )
        {
            Item = this.Content[StartPos];
            if ( para_PageBreakRendered == Item.Type || ( para_NewLine == Item.Type && break_Page === Item.BreakType && true === Item.Flags.NewLine ) )
                PageBreak--;
            else if ( para_CollaborativeChangesEnd == Item.Type )
                CollaborativeChanges--;
            else if ( para_CollaborativeChangesStart == Item.Type )
                CollaborativeChanges++;

            StartPos++;
        }

        var DocumentComments = editor.WordControl.m_oLogicDocument.Comments;
        var bDrawComments = DocumentComments.Is_Use();
        var CommentsFlag = DocumentComments.Check_CurrentDraw();

        // Сообщаем отрисовщику, чтобы он рисовал все в целочисленной решетке (чтобы не было пробелов)
        //pGraphics.SetIntegerGrid(true);

        /*
         // Bbox параграфа
         Canvas.BeginPath();
         Canvas.MoveTo( this.Bounds.Left, this.Bounds.Top );
         Canvas.LineTo( this.Bounds.Right, this.Bounds.Top );
         Canvas.LineTo( this.Bounds.Right, this.Bounds.Bottom );
         Canvas.LineTo( this.Bounds.Left, this.Bounds.Bottom );
         Canvas.LineTo( this.Bounds.Left, this.Bounds.Top );
         Canvas.Stroke();
         */

        /*
         // Вверх параграфа
         Canvas.BeginPath();
         Canvas.MoveTo( X_Left_Field, this.Y );
         Canvas.LineTo( X_Right_Field, this.Y );
         Canvas.Stroke();
         */


        //-----------------------------------------------------------------------------------
        // Первая часть отрисовки (рисуем только заливку параграфа и выделение текста)
        //-----------------------------------------------------------------------------------

        var Pr = { TextPr : null, ParaPr : null };
        var CurTextPr = this.Internal_CalculateTextPr( StartPos, Pr );
        CurTextPr.Update_FontSize();

        pGraphics.SetFont( CurTextPr );
        pGraphics.b_color1( CurTextPr.Color.r, CurTextPr.Color.g, CurTextPr.Color.b, 255);

        var CurLine  = this.Pages[PNum].FirstLine;
        var CurRange = 0;
        var bFirstLineItem = true;
        var SpacesCounter = this.Lines[CurLine].Ranges[CurRange].Spaces;

        var Y = this.Pages[PNum].Y + this.Lines[CurLine].Y;
        var X = this.Lines[CurLine].Ranges[CurRange].XVisible;

        var bEnd = false;
        var bNewPage = false;
        var bNeedDrawBackgdound = true;
        var bNeedDrawSidesLines = true;

        var HyperPos = this.Internal_FindBackward( StartPos, [para_HyperlinkStart, para_HyperlinkEnd] );
        var bVisitedHyperlink = false;

        if ( true === HyperPos.Found && para_HyperlinkStart === HyperPos.Type )
            bVisitedHyperlink = this.Content[HyperPos.LetterPos].Get_Visited();


        // Если данный параграф зажат другим пользователем, рисуем соответствующий знак
      /*  if ( locktype_None != this.Lock.Get_Type() )
        {
            if ( ( PNum > 0 || false === this.Is_StartFromNewPage() || null === this.Get_DocumentPrev() ) )
            {
                var X_min = -1 + Math.min( this.Pages[PNum].X, this.Pages[PNum].X + Pr.ParaPr.Ind.Left, this.Pages[PNum].X + Pr.ParaPr.Ind.Left + Pr.ParaPr.Ind.FirstLine );
                var Y_top = this.Pages[PNum].Bounds.Top;
                var Y_bottom = this.Pages[PNum].Bounds.Bottom;

                pGraphics.DrawLockParagraph(this.Lock.Get_Type(), X_min, Y_top, Y_bottom);
                                                                                                    */
                /*
                if ( locktype_Mine === this.Lock.Get_Type() )
                    pGraphics.p_color( 0, 255, 0, 255);
                else if ( locktype_Other === this.Lock.Get_Type() )
                    pGraphics.p_color( 255, 0, 0, 255);
                else if ( locktype_Other2 === this.Lock.Get_Type() )
                    pGraphics.p_color( 0, 0, 255, 255);
                else if ( locktype_Other3 === this.Lock.Get_Type() )
                    pGraphics.p_color( 0, 255, 255, 255);

                var X_min = -1 + Math.min( this.Pages[PNum].X, this.Pages[PNum].X + Pr.ParaPr.Ind.Left, this.Pages[PNum].X + Pr.ParaPr.Ind.Left + Pr.ParaPr.Ind.FirstLine );
                var Y_top = this.Pages[PNum].Bounds.Top;
                var Y_bottom = this.Pages[PNum].Bounds.Bottom;

                pGraphics.drawVerLine( c_oAscLineDrawingRule.Right, X_min, Y_top, Y_bottom, 0.2 );
                pGraphics.p_color( CurTextPr.Color.r, CurTextPr.Color.g, CurTextPr.Color.b, 255);
                */
           // }
       // }


        // Добавляем специальный символ слева от параграфа, для параграфов, у которых стоит хотя бы
        // одна из настроек: не рарзывать абзац(KeepLines), не отрывать от следующего(KeepNext),
        // начать с новой страницы(PageBreakBefore)

        // TODO: Как только будет поддержка параметра KeepNext раскоментировать тут.
        if ( true === editor.ShowParaMarks && ( ( 0 === PNum && ( this.Pages.length <= 1 || this.Pages[1].FirstLine > 0 ) ) || ( 1 === PNum && this.Pages.length > 1 && this.Pages[1].FirstLine === 0 ) ) && ( /*true === Pr.ParaPr.KeepNext ||*/ true === Pr.ParaPr.KeepLines || true === Pr.ParaPr.PageBreakBefore ) )
        {
            var SpecFont = { FontFamily: { Name : "Arial", Index : -1 }, FontSize : 12, Italic : false, Bold : false };
            var OldFont = pGraphics.GetFont();
            var OldColor = CurTextPr.Color;
            var SpecSym = String.fromCharCode( 0x25AA );
            pGraphics.SetFont( SpecFont );
            pGraphics.b_color1( 0, 0, 0, 255 );

            var SpecW = 2.5; // 2.5 mm
            var SpecX = Math.min( X, this.X ) - SpecW;

            pGraphics.FillText( SpecX, Y, SpecSym );
            pGraphics.SetFont( OldFont );
            pGraphics.b_color1( OldColor.r, OldColor.g, OldColor.b, 255 );
        }


        //-----------------------------------------------------------------------------------
        // Вторая часть отрисовки (рисуем сами элементы параграфа)
        //-----------------------------------------------------------------------------------

        Pr = { TextPr : null, ParaPr : null };
        CurTextPr = this.Internal_CalculateTextPr( StartPos, Pr );
        CurTextPr.Update_FontSize();

        pGraphics.SetFont( CurTextPr );
        pGraphics.b_color1( CurTextPr.Color.r, CurTextPr.Color.g, CurTextPr.Color.b, 255);

        CurLine  = this.Pages[PNum].FirstLine;
        CurRange = 0;
        bFirstLineItem = true;
        SpacesCounter = this.Lines[CurLine].Ranges[CurRange].Spaces;

        Y = this.Pages[PNum].Y + this.Lines[CurLine].Y;
        X = this.Lines[CurLine].Ranges[CurRange].XVisible;

        bEnd = false;
        bNewPage = false;

        for ( var ItemNum = StartPos; ItemNum < this.Content.length; ItemNum++ )
        {
            var bNewRange = false;
            var bNewLine  = false;
            var TempY = Y;

            switch( CurTextPr.VertAlign )
            {
                case vertalign_SubScript:
                {
                    Y -= vertalign_Koef_Sub * CurTextPr.FontSize_S * g_dKoef_pt_to_mm;

                    break;
                }
                case vertalign_SuperScript:
                {
                    Y -= vertalign_Koef_Super * CurTextPr.FontSize_S * g_dKoef_pt_to_mm;

                    break;
                }
            }


            var Item = this.Content[ItemNum];
            switch( Item.Type )
            {
                case para_Numbering:
                {
                    var NumPr = Pr.ParaPr.NumPr;
                    if ( undefined === NumPr || undefined === NumPr.NumId )
                        break;

                    var Numbering = this.Parent.Get_Numbering();
                    var NumLvl    = Numbering.Get_AbstractNum( NumPr.NumId ).Lvl[NumPr.Lvl];
                    var NumSuff   = NumLvl.Suff;
                    var NumJc     = NumLvl.Jc;
                    var NumTextPr = this.Get_CompiledPr2(false).TextPr.Copy();

                    // Word не рисует подчеркивание у символа списка, если оно пришло из настроек для
                    // символа параграфа.

                    var TextPr_temp = this.TextPr.Value.Copy();
                    TextPr_temp.Underline = undefined;

                    NumTextPr.Merge( TextPr_temp );
                    NumTextPr.Merge( NumLvl.TextPr );

                    var X_start = X;

                    if ( align_Right === NumJc )
                        X_start = X - Item.WidthNum;
                    else if ( align_Center === NumJc )
                        X_start = X - Item.WidthNum / 2;

                    pGraphics.b_color1( NumTextPr.Color.r, NumTextPr.Color.g, NumTextPr.Color.b, 255 );

                    // Рисуется только сам символ нумерации
                    switch ( NumJc )
                    {
                        case align_Right:
                            Item.Draw( X - Item.WidthNum, Y, pGraphics, Numbering, NumTextPr, NumPr );
                            break;

                        case align_Center:
                            Item.Draw( X - Item.WidthNum / 2, Y, pGraphics, Numbering, NumTextPr, NumPr );
                            break;

                        case align_Left:
                        default:
                            Item.Draw( X, Y, pGraphics, Numbering, NumTextPr, NumPr );
                            break;
                    }

                    if ( true === editor.ShowParaMarks && numbering_suff_Tab === NumSuff )
                    {
                        var TempWidth     = Item.WidthSuff;
                        var TempRealWidth = 3.143; // ширина символа "стрелка влево" в шрифту Wingding3,10

                        var X1 = X;
                        switch ( NumJc )
                        {
                            case align_Right:
                                break;

                            case align_Center:
                                X1 += Item.WidthNum / 2;
                                break;

                            case align_Left:
                            default:
                                X1 += Item.WidthNum;
                                break;
                        }

                        var X0 = TempWidth / 2 - TempRealWidth / 2;

                        var oldFont = pGraphics.GetFont();
                        pGraphics.SetFont( {FontFamily: { Name : "Wingdings 3", Index : -1 }, FontSize: 10, Italic: false, Bold : false} );

                        if ( X0 > 0 )
                            pGraphics.FillText2( X1 + X0, Y, String.fromCharCode( tab_Symbol ), 0, TempWidth );
                        else
                            pGraphics.FillText2( X1, Y, String.fromCharCode( tab_Symbol ), TempRealWidth - TempWidth, TempWidth );

                        pGraphics.SetFont( oldFont );
                    }

                    var bIsSetColor = false;
                    if ( true === NumTextPr.Strikeout )
                    {
                        if (!bIsSetColor)
                        {
                            pGraphics.p_color( NumTextPr.Color.r, NumTextPr.Color.g, NumTextPr.Color.b, 255 );
                            bIsSetColor = true;
                        }

                        pGraphics.drawHorLine(0, (Y - NumTextPr.FontSize * g_dKoef_pt_to_mm * 0.27), X_start, X_start + Item.WidthNum, (NumTextPr.FontSize / 18) * g_dKoef_pt_to_mm);
                    }

                    if ( true === NumTextPr.Underline )
                    {
                        if (!bIsSetColor)
                        {
                            pGraphics.p_color( NumTextPr.Color.r, NumTextPr.Color.g, NumTextPr.Color.b, 255 );
                            bIsSetColor = true;
                        }

                        pGraphics.drawHorLine( 0, (Y + this.Lines[CurLine].Metrics.TextDescent * 0.4), X_start, X_start + Item.WidthNum, (NumTextPr.FontSize / 18) * g_dKoef_pt_to_mm);
                    }

                    pGraphics.p_color( CurTextPr.Color.r, CurTextPr.Color.g, CurTextPr.Color.b, 255 );
                    pGraphics.b_color1( CurTextPr.Color.r, CurTextPr.Color.g, CurTextPr.Color.b, 255 );

                    X += Item.WidthVisible;

                    break;
                }
                case para_PresentationNumbering:
                {
                    if ( true != this.IsEmpty() )
                    {
                        // Найдем настройки для первого текстового элемента
                        var FirstTextPr = this.Internal_CalculateTextPr( this.Internal_GetStartPos() );

                        if ( Pr.ParaPr.Ind.FirstLine < 0 )
                            Item.Draw( X, Y, pGraphics, FirstTextPr );
                        else
                            Item.Draw( this.X + Pr.ParaPr.Ind.Left, Y, pGraphics, FirstTextPr );

                        pGraphics.p_color( CurTextPr.Color.r, CurTextPr.Color.g, CurTextPr.Color.b, 255 );
                        pGraphics.b_color1( CurTextPr.Color.r, CurTextPr.Color.g, CurTextPr.Color.b, 255 );
                    }

                    X += Item.WidthVisible;

                    break;
                }

                case para_PageNum:
                case para_Drawing:
                case para_Tab:
                case para_Text:

                    var bIsSetColor = false;

                    if ( true === bVisitedHyperlink )
                    {
                        pGraphics.p_color( 128, 0, 151, 255 );
                        pGraphics.b_color1( 128, 0, 151, 255 );
                        bIsSetColor = true;
                    }

                    bFirstLineItem = false;

                    if ( para_PageNum != Item.Type )
                        Item.Draw( X, Y, pGraphics );
                    else
                        Item.Draw( X, Y, pGraphics, this.Get_StartPage_Absolute() + PNum, Pr.ParaPr.Jc );

                    if ( true === CurTextPr.Strikeout )
                    {
                        if (!bIsSetColor)
                        {
                            pGraphics.p_color( CurTextPr.Color.r, CurTextPr.Color.g, CurTextPr.Color.b, 255 );
                            bIsSetColor = true;
                        }

                        pGraphics.drawHorLine(0, (Y - CurTextPr.FontSize * g_dKoef_pt_to_mm * 0.27), X, X + Item.WidthVisible, (CurTextPr.FontSize / 18) * g_dKoef_pt_to_mm);
                    }

                    if ( true === CurTextPr.Underline )
                    {
                        if (!bIsSetColor)
                        {
                            pGraphics.p_color( CurTextPr.Color.r, CurTextPr.Color.g, CurTextPr.Color.b, 255 );
                            bIsSetColor = true;
                        }

                        pGraphics.drawHorLine(0, (Y + this.Lines[CurLine].Metrics.TextDescent * 0.4), X, X + Item.WidthVisible, (CurTextPr.FontSize / 18) * g_dKoef_pt_to_mm);
                    }

                    // Восстанавливаем цвет, если он был изменен из-за гиперссылки
                    if ( true === bVisitedHyperlink )
                    {
                        pGraphics.p_color( CurTextPr.Color.r, CurTextPr.Color.g, CurTextPr.Color.b, 255 );
                        pGraphics.b_color1( CurTextPr.Color.r, CurTextPr.Color.g, CurTextPr.Color.b, 255 );
                    }


                    X += Item.WidthVisible;
                    break;

                case para_Space:

                    // Пробелы в конце строки (и строку состоящую из пробелов) не подчеркиваем, не зачеркиваем и не выделяем
                    if ( SpacesCounter > 0 || ( bFirstLineItem && this.Lines[CurLine].Words > 0 ) )
                    {
                        if ( !bFirstLineItem && this.Lines[CurLine].Words > 0 )
                            SpacesCounter--;

                        var bIsSetColor = false;

                        if ( true === CurTextPr.Strikeout )
                        {
                            if (!bIsSetColor)
                            {
                                pGraphics.p_color( CurTextPr.Color.r, CurTextPr.Color.g, CurTextPr.Color.b, 255 );
                                bIsSetColor = true;
                            }
                            pGraphics.drawHorLine(0, (Y - CurTextPr.FontSize * g_dKoef_pt_to_mm * 0.27), X, X + Item.WidthVisible, (CurTextPr.FontSize / 18) * g_dKoef_pt_to_mm);
                        }

                        if ( true === CurTextPr.Underline )
                        {
                            if (!bIsSetColor)
                            {
                                pGraphics.p_color( CurTextPr.Color.r, CurTextPr.Color.g, CurTextPr.Color.b, 255 );
                                bIsSetColor = true;
                            }
                            pGraphics.drawHorLine(0, (Y + this.Lines[CurLine].Metrics.TextDescent * 0.4), X, X + Item.WidthVisible, (CurTextPr.FontSize / 18) * g_dKoef_pt_to_mm);
                        }
                    }

                    Item.Draw( X, Y, pGraphics );

                    X += Item.WidthVisible;

                    break;

                case para_TextPr:

                    CurTextPr = this.Internal_CalculateTextPr( ItemNum );
                    CurTextPr.Update_FontSize();

                    pGraphics.SetFont( CurTextPr );
                    pGraphics.b_color1( CurTextPr.Color.r, CurTextPr.Color.g, CurTextPr.Color.b, 255);
                    break;

                case para_End:

                    // Выставляем настройки для символа параграфа
                    var EndTextPr = this.Get_CompiledPr2(false).TextPr.Copy();
                    EndTextPr.Merge( this.TextPr.Value );

                    pGraphics.SetFont( EndTextPr );
                    pGraphics.b_color1( EndTextPr.Color.r, EndTextPr.Color.g, EndTextPr.Color.b, 255);
                    pGraphics.p_color( EndTextPr.Color.r, EndTextPr.Color.g, EndTextPr.Color.b, 255);

                    bEnd = true;
                    var bEndCell = false;
                    if ( null === this.Get_DocumentNext() && true === this.Parent.Is_TableCellContent() )
                        bEndCell = true;

                    Item.Draw( X, Y, pGraphics, bEndCell );
                    X += Item.Width;
                    break;

                case para_InlineBreak:

                    bNewRange = true;
                    CurRange++;
                    SpacesCounter = this.Lines[CurLine].Ranges[CurRange].Spaces;
                    X = this.Lines[CurLine].Ranges[CurRange].XVisible;
                    break;

                case para_NewLine:

                    Item.Draw( X, Y, pGraphics );
                    X += Item.WidthVisible;

                    if ( break_Page === Item.BreakType && true === Item.Flags.NewLine )
                    {
                        bNewPage = true;
                        break;
                    }
                    else if ( break_Page === Item.BreakType && false === Item.Flags.NewLine )
                    {
                        break;
                    }


                // break специально не ставим
                case para_NewLineRendered:

                    CurLine++;
                    CurRange = 0;

                    bFirstLineItem = true;
                    SpacesCounter = this.Lines[CurLine].Ranges[CurRange].Spaces;
                    Y = this.Pages[PNum].Y + this.Lines[CurLine].Y;
                    X = this.Lines[CurLine].Ranges[CurRange].XVisible;

                    bNewLine = true;

                    break;

                case para_PageBreakRendered:

                    bNewPage = true;

                    break;

                case para_HyperlinkStart:

                    bVisitedHyperlink = Item.Get_Visited();
                    break;

                case para_HyperlinkEnd:

                    bVisitedHyperlink = false;
                    break;
            }
            if ( true === bNewPage )
                break;

            if ( true != bNewLine )
                Y = TempY;

            if ( true === bNewLine || true === bNewRange )
            {
                bNeedDrawBackgdound = true;
            }

            if ( true === bNewLine )
                bNeedDrawSidesLines = true;
        }

        var X_left  = Math.min( this.Pages[PNum].X + Pr.ParaPr.Ind.Left, this.Pages[PNum].X + Pr.ParaPr.Ind.Left + Pr.ParaPr.Ind.FirstLine );
        var X_right = this.Pages[PNum].XLimit - Pr.ParaPr.Ind.Right;

        if ( Pr.ParaPr.Brd.Left.Value === border_Single )
            X_left -= 1.9;
        else
            X_left -= 1;

        if ( Pr.ParaPr.Brd.Right.Value === border_Single )
            X_right += 1.9;
        else
            X_right += 1;

        var LeftMW  = -( border_Single === Pr.ParaPr.Brd.Left.Value  ? Pr.ParaPr.Brd.Left.Size  : 0 );
        var RightMW =  ( border_Single === Pr.ParaPr.Brd.Right.Value ? Pr.ParaPr.Brd.Right.Size : 0 );

        // Рисуем линию до параграфа
        if ( true === Pr.ParaPr.Brd.First && border_Single === Pr.ParaPr.Brd.Top.Value && ( ( 0 === PNum && ( false === this.Is_StartFromNewPage() || null === this.Get_DocumentPrev() ) ) || ( 1 === PNum && true === this.Is_StartFromNewPage() )  ) )
        {
            var Y_top = this.Pages[PNum].Y;
            if ( 0 === PNum )
                Y_top += Pr.ParaPr.Spacing.Before;

            var OldColor = CurTextPr.Color;
            pGraphics.p_color( Pr.ParaPr.Brd.Top.Color.r, Pr.ParaPr.Brd.Top.Color.g, Pr.ParaPr.Brd.Top.Color.b, 255 );
            pGraphics.drawHorLineExt( c_oAscLineDrawingRule.Top, Y_top, X_left, X_right, Pr.ParaPr.Brd.Top.Size, LeftMW, RightMW );
            pGraphics.p_color( OldColor.r, OldColor.g, OldColor.b, 255 );
        }
        else if ( false === Pr.ParaPr.Brd.First )
        {
            var OldColor = CurTextPr.Color;
            if ( 1 === PNum && true === this.Is_StartFromNewPage() && border_Single === Pr.ParaPr.Brd.Top.Value )
            {
                pGraphics.p_color( Pr.ParaPr.Brd.Top.Color.r, Pr.ParaPr.Brd.Top.Color.g, Pr.ParaPr.Brd.Top.Color.b, 255 );
                pGraphics.drawHorLineExt( c_oAscLineDrawingRule.Top, this.Pages[PNum].Y + this.Lines[this.Pages[PNum].FirstLine].Top, X_left, X_right, Pr.ParaPr.Brd.Top.Size, LeftMW, RightMW );
            }
            else if ( 0 === PNum && false === this.Is_StartFromNewPage() && border_Single === Pr.ParaPr.Brd.Between.Value )
            {
                pGraphics.p_color( Pr.ParaPr.Brd.Between.Color.r, Pr.ParaPr.Brd.Between.Color.g, Pr.ParaPr.Brd.Between.Color.b, 255 );
                pGraphics.drawHorLineExt( c_oAscLineDrawingRule.Top, this.Pages[PNum].Y, X_left, X_right, Pr.ParaPr.Brd.Between.Size, LeftMW, RightMW );
            }
            pGraphics.p_color( OldColor.r, OldColor.g, OldColor.b, 255 );
        }

        // Рисуем линию после параграфа
        if ( true === bEnd && true === Pr.ParaPr.Brd.Last && border_Single === Pr.ParaPr.Brd.Bottom.Value )
        {
            var OldColor = CurTextPr.Color;

            var TempY = this.Pages[PNum].Y;
            var NextEl = this.Get_DocumentNext();
            var DrawLineRule = c_oAscLineDrawingRule.Bottom;
            if ( null != NextEl && type_Paragraph === NextEl.GetType() && true === NextEl.Is_StartFromNewPage() )
            {
                TempY = this.Pages[PNum].Y + this.Lines[CurLine].Y + this.Lines[CurLine].Metrics.Descent + this.Lines[CurLine].Metrics.LineGap;
                DrawLineRule = c_oAscLineDrawingRule.Top;
            }
            else
            {
                TempY = this.Pages[PNum].Y + this.Lines[CurLine].Bottom - Pr.ParaPr.Spacing.After;
                DrawLineRule = c_oAscLineDrawingRule.Bottom;
            }

            pGraphics.p_color( Pr.ParaPr.Brd.Bottom.Color.r, Pr.ParaPr.Brd.Bottom.Color.g, Pr.ParaPr.Brd.Bottom.Color.b, 255 );
            pGraphics.drawHorLineExt( DrawLineRule, TempY, X_left, X_right, Pr.ParaPr.Brd.Bottom.Size, LeftMW, RightMW );
            pGraphics.p_color( OldColor.r, OldColor.g, OldColor.b, 255 );
        }
        else if ( true === bEnd && false === Pr.ParaPr.Brd.Last && border_Single === Pr.ParaPr.Brd.Bottom.Value )
        {
            var NextEl = this.Get_DocumentNext();
            if ( null != NextEl && type_Paragraph === NextEl.GetType() && true === NextEl.Is_StartFromNewPage() )
            {
                var OldColor = CurTextPr.Color;
                pGraphics.p_color( Pr.ParaPr.Brd.Bottom.Color.r, Pr.ParaPr.Brd.Bottom.Color.g, Pr.ParaPr.Brd.Bottom.Color.b, 255 );
                pGraphics.drawHorLineExt( c_oAscLineDrawingRule.Top, this.Pages[PNum].Y + this.Lines[CurLine].Y + this.Lines[CurLine].Metrics.Descent + this.Lines[CurLine].Metrics.LineGap, X_left, X_right, Pr.ParaPr.Brd.Bottom.Size, LeftMW, RightMW );
                pGraphics.p_color( OldColor.r, OldColor.g, OldColor.b, 255 );
            }
        }

        // Отменяем целочисленную отрисовку
        //pGraphics.SetIntegerGrid(false);

        if ( bNewPage )
            return -1;

        return 0;
    },

    ReDraw : function()
    {
        this.Parent.OnContentReDraw( this.Get_StartPage_Absolute(), this.Get_StartPage_Absolute() + this.Pages.length - 1 );
    },

    // Удаляем элементы параграфа
    // nCount - количество удаляемых элементов, > 0 удаляем элементы после курсора
    //                                          < 0 удаляем элементы до курсора
    // bOnlyText - true: удаляем только текст и пробелы, false - Удаляем любые элементы
    Remove : function(nCount, bOnlyText)
    {
        this.DeleteCollaborativeMarks = true;
        this.RecalcInfo.Set_Type_0(pararecalc_0_All);

        // Сначала проверим имеется ли у нас селект
        if ( true === this.Selection.Use )
        {
            var StartPos = this.Selection.StartPos;
            var EndPos   = this.Selection.EndPos;

            if ( StartPos > EndPos )
            {
                var Temp = EndPos;
                EndPos   = StartPos;
                StartPos = Temp;
            }

            if ( EndPos >= this.Content.length - 1 )
            {
                for ( var Index = StartPos; Index < this.Content.length - 2; Index++ )
                {
                    var Item = this.Content[Index];
                    if ( para_Drawing === Item.Type )
                    {
                        var ObjId = Item.Get_Id();
                        this.Parent.DrawingObjects.Remove_ById( ObjId );
                    }
                }

                var Hyper_start = null;
                if ( StartPos < EndPos )
                    Hyper_start = this.Check_Hyperlink2( StartPos );

                // Удаляем внутреннюю часть селекта (без знака параграфа)
                this.Internal_Content_Remove2( StartPos, this.Content.length - 2 - StartPos );

                // После удаления позиции могли измениться
                StartPos = this.Selection.StartPos;
                EndPos   = this.Selection.EndPos;

                if ( StartPos > EndPos )
                {
                    var Temp = EndPos;
                    EndPos   = StartPos;
                    StartPos = Temp;
                }

                this.CurPos.ContentPos = StartPos;

                if ( null != Hyper_start )
                {
                    this.Internal_Content_Add( StartPos, new ParaTextPr() );
                    this.Internal_Content_Add( StartPos, new ParaHyperlinkEnd() );
                }

                // Данный параграф надо объединить со следующим
                return false;
            }
            else
            {
                var Hyper_start = this.Check_Hyperlink2( StartPos );
                var Hyper_end   = this.Check_Hyperlink2( EndPos );

                for ( var Index = StartPos; Index < EndPos; Index++ )
                {
                    var Item = this.Content[Index];
                    if ( para_Drawing === Item.Type )
                    {
                        var ObjId = Item.Get_Id();
                        this.Parent.DrawingObjects.Remove_ById( ObjId );
                    }
                }

                // Рассчитаем стиль на конце селекта
                var TextPr = this.Internal_CalculateTextPr( EndPos + 1 );

                this.Internal_Content_Remove2( StartPos, EndPos - StartPos );

                // После удаления позиции могли измениться
                StartPos = this.Selection.StartPos;
                EndPos   = this.Selection.EndPos;

                if ( StartPos > EndPos )
                {
                    var Temp = EndPos;
                    EndPos   = StartPos;
                    StartPos = Temp;
                }

                this.Internal_Content_Add( StartPos, new ParaTextPr( TextPr ) );

                this.CurPos.ContentPos = StartPos;

                if ( null != Hyper_end && Hyper_start != Hyper_end )
                {
                    this.Internal_Content_Add( StartPos, Hyper_end );
                    this.CurPos.ContentPos++;
                }

                if ( null != Hyper_start && Hyper_start != Hyper_end )
                {
                    this.Internal_Content_Add( StartPos, new ParaHyperlinkEnd() );
                    this.CurPos.ContentPos++;
                }
            }

            return;
        }

        if ( 0 == nCount )
            return;

        var absCount = ( nCount < 0 ? -nCount : nCount );

        for ( var Index = 0; Index < absCount; Index++ )
        {
            if ( nCount < 0 )
            {
                if ( false === this.Internal_RemoveBackward(bOnlyText) )
                    return false;
            }
            else
            {
                if ( false === this.Internal_RemoveForward(bOnlyText) )
                    return false;
            }
        }

        return true;
    },

    Internal_RemoveBackward : function(bOnlyText)
    {
        var Line = this.Content;
        var CurPos = this.CurPos.ContentPos;

        if ( !bOnlyText )
        {
            if ( CurPos == 0 )
                return false;
            else
            {
                // Просто удаляем элемент предстоящий текущей позиции и уменьшаем текущую позицию
                this.Internal_Content_Remove( CurPos - 1 );
            }
        }
        else
        {
            var LetterPos = CurPos - 1;

            var oPos = this.Internal_FindBackward( LetterPos, [para_PageNum, para_Drawing, para_Tab, para_Text, para_Space, para_NewLine] );

            if ( oPos.Found )
            {
                if ( para_Drawing === oPos.Type )
                {
                    this.Parent.Select_DrawingObject( this.Content[oPos.LetterPos].Get_Id() );
                }
                else
                {
                    // Удаляем элемент в найденной позиции и уменьшаем текущую позицию
                    this.Internal_Content_Remove( oPos.LetterPos );
                    this.CurPos.ContentPos = oPos.LetterPos;
                }
            }
            else
            {
                // Мы стоим в начале параграфа и пытаемся удалить элемент влево. Действуем следующим образом:
                // 1. Если у нас параграф с нумерацией, тогда удаляем нумерацию, но при этом сохраняем
                //    значения отступов так как это делается в Word. (аналогично работаем с нумерацией в презентациях)
                // 2. Если у нас отступ первой строки ненулевой, тогда:
                //    2.1 Если он положительный делаем его нулевым.
                //    2.2 Если он отрицательный сдвигаем левый отступ на значение отступа первой строки,
                //        а сам отступ первой строки делаем нулевым.
                // 3. Если у нас ненулевой левый отступ, делаем его нулевым
                // 4. Если ничего из предыдущего не случается, тогда говорим родительскому классу, что удаление
                //    не было выполнено.

                var Pr = this.Get_CompiledPr2(false).ParaPr;
                if ( undefined != this.Numbering_Get() )
                {
                    this.Numbering_Remove();
                    this.Set_Ind( { FirstLine : 0, Left : Math.max( Pr.Ind.Left, Pr.Ind.Left + Pr.Ind.FirstLine ) }, false );
                }
                else if ( numbering_presentationnumfrmt_None != this.PresentationPr.Bullet.Get_Type() )
                {
                    this.Remove_PresentationNumbering();
                }
                else if ( Math.abs(Pr.Ind.FirstLine) > 0.001 )
                {
                    if ( Pr.Ind.FirstLine > 0 )
                        this.Set_Ind( { FirstLine : 0 }, false );
                    else
                        this.Set_Ind( { Left : Pr.Ind.Left + Pr.Ind.FirstLine, FirstLine : 0 }, false );
                }
                else if ( Math.abs(Pr.Ind.Left) > 0.001 )
                {
                    this.Set_Ind( { Left : 0 }, false );
                }
                else
                    return false;
            }
        }

        return true;
    },

    Internal_RemoveForward : function(bOnlyText)
    {
        var Line = this.Content;
        var CurPos = this.CurPos.ContentPos;

        if ( !bOnlyText )
        {
            if ( CurPos == Line.length - 1 )
            {
                return false;
            }
            else
            {
                // Просто удаляем элемент после текущей позиции
                this.Internal_Content_Remove( CurPos + 1 );
            }
        }
        else
        {
            var LetterPos = CurPos;

            var oPos = this.Internal_FindForward( LetterPos, [para_PageNum, para_Drawing, para_Tab, para_Text, para_Space, para_NewLine] );

            if ( oPos.Found )
            {
                if ( para_Drawing === oPos.Type )
                {
                    this.Parent.Select_DrawingObject( this.Content[oPos.LetterPos].Get_Id() );
                }
                else
                {
                    // Удаляем элемент в найденной позиции и меняем текущую позицию
                    this.Internal_Content_Remove( oPos.LetterPos );
                    this.CurPos.ContentPos = oPos.LetterPos;
                }
            }
            else
            {
                return false;
            }
        }
        return true;
    },

    // Ищем первый элемент, при промотке вперед
    Internal_FindForward : function(CurPos, arrId)
    {
        var LetterPos = CurPos;
        var bFound = false;
        var Type = para_Unknown;

        if ( CurPos < 0 || CurPos >= this.Content.length )
            return { Found : false };

        while ( !bFound )
        {
            Type = this.Content[LetterPos].Type;

            for ( var Id = 0; Id < arrId.length; Id++ )
            {
                if ( arrId[Id] == Type )
                {
                    bFound = true;
                    break;
                }
            }

            if ( bFound )
                break;

            LetterPos++;
            if ( LetterPos > this.Content.length - 1 )
                break;
        }

        return { LetterPos : LetterPos, Found : bFound, Type : Type };
    },

    // Ищем первый элемент, при промотке назад
    Internal_FindBackward : function(CurPos, arrId)
    {
        var LetterPos = CurPos;
        var bFound = false;
        var Type = para_Unknown;

        if ( CurPos < 0 || CurPos >= this.Content.length )
            return { Found : false };

        while ( !bFound )
        {
            Type = this.Content[LetterPos].Type;
            for ( var Id = 0; Id < arrId.length; Id++ )
            {
                if ( arrId[Id] == Type )
                {
                    bFound = true;
                    break;
                }
            }

            if ( bFound )
                break;

            LetterPos--;
            if ( LetterPos < 0 )
                break;
        }

        return { LetterPos : LetterPos, Found : bFound, Type : Type };
    },

    Internal_CalculateTextPr : function (LetterPos, StartPr)
    {
        var Pr;
        if ( "undefined" != typeof(StartPr) )
        {
            Pr = this.Get_CompiledPr();
            StartPr.ParaPr = Pr.ParaPr;
            StartPr.TextPr = Pr.TextPr;
        }
        else
        {
            Pr = this.Get_CompiledPr2(false);
        }

        // Выствляем начальные настройки текста у данного параграфа
        var TextPr = Pr.TextPr.Copy();

        // Ищем ближайший TextPr
        if ( LetterPos < 0 )
            return TextPr;

        // Ищем предыдущие записи с изменением текстовых свойств
        var Pos = this.Internal_FindBackward( LetterPos, [para_TextPr] );

        if ( true === Pos.Found )
        {
            var CurTextPr = this.Content[Pos.LetterPos].Value;

            // Копируем настройки из символьного стиля
            if ( undefined != CurTextPr.RStyle )
            {
                var Styles = this.Get_Styles();
                var StyleTextPr = Styles.Get_Pr( CurTextPr.RStyle, styles_Character).TextPr;
                TextPr.Merge( StyleTextPr );
            }

            // Копируем прямые настройки
            TextPr.Merge( CurTextPr );
        }

        return TextPr;
    },

    Internal_CalculateTextPr2 : function (LetterPos, StartPr)
    {

        var TextPr = {};

        // Ищем ближайший TextPr
        if ( LetterPos < 0 )
            return TextPr;

        // Ищем предыдущие записи с изменением текстовых свойств
        var Pos = this.Internal_FindBackward( LetterPos, [para_TextPr] );

        if ( true === Pos.Found )
        {
            var CurTextPr = this.Content[Pos.LetterPos].Value;

            // Копируем прямые настройки
            for ( var Item in CurTextPr )
                TextPr[Item] = CurTextPr[Item];
        }

        return TextPr;
    },

    Internal_CalculateTextPr3 : function (LetterPos, StartPr)
    {
        var Pr = this.Get_CompiledPr();
        if ( "undefined" != typeof(StartPr) )
        {
            StartPr.ParaPr = Pr.ParaPr;
            StartPr.TextPr = Pr.TextPr;
        }

        // Выствляем начальные настройки текста у данного параграфа
        var TextPr =  Pr.TextPr.Copy();

        // Ищем ближайший TextPr
        if ( LetterPos < 0 )
            return TextPr;

        // Ищем предыдущие записи с изменением текстовых свойств
        var Pos = this.Internal_FindBackward( LetterPos, [para_TextPr] );

        if ( true === Pos.Found )
        {
            var CurTextPr = this.Content[Pos.LetterPos].Value;

            // Копируем настройки из символьного стиля
            if ( "undefined" != typeof(CurTextPr.StyleId) )
            {
                var Styles = this.Get_Styles();
                var StyleTextPr = Styles.Get_Pr( CurTextPr.StyleId, styles_Character).TextPr;
                for ( var Item in StyleTextPr )
                    TextPr[Item] = StyleTextPr[Item];
            }

            // Копируем прямые настройки
            for ( var Item in CurTextPr )
                TextPr[Item] = CurTextPr[Item];
        }

        return TextPr;
    },

    Internal_GetTextPr : function(LetterPos)
    {
        var TextPr = new CTextPr();

        // Ищем ближайший TextPr
        if ( LetterPos < 0 )
            return TextPr;

        // Ищем предыдущие записи с изменением текстовых свойств
        var Pos = this.Internal_FindBackward( LetterPos, [para_TextPr] );

        if ( true === Pos.Found )
        {
            var CurTextPr = this.Content[Pos.LetterPos].Value;

            // Копируем настройки из символьного стиля
            if ( undefined != CurTextPr.RStyle )
            {
                var Styles = this.Get_Styles();
                var StyleTextPr = Styles.Get_Pr( CurTextPr.RStyle, styles_Character).TextPr;
                TextPr.Merge( StyleTextPr );
            }

            TextPr.Merge( CurTextPr );
        }
        // Если ничего не нашли, то TextPr будет пустым, что тоже нормально

        return TextPr;
    },

    // Добавляем новый элемент к содержимому параграфа (на текущую позицию)
    Add : function(Item)
    {
        var Line   = this.Content;
        var CurPos = this.CurPos.ContentPos;

        if ( "undefined" != typeof(Item.Parent) )
            Item.Parent = this;

        switch (Item.Type)
        {
            case para_Text:
            {
                this.Internal_Content_Add( CurPos, Item );
                break;
            }
            case para_Space:
            {
                this.Internal_Content_Add( CurPos, Item );
                break;
            }
            case para_TextPr:
            {
                if(Item.Value.unifill && Item.Value.unifill.fill)
                {
                    History.Add(this, {  Type : history_undo_redo_const,
                        undo_function : function(data)
                        {
                            this.Parent.Parent.calculateText3(this)
                        },

                        redo_function : function(data)
                        {
                        }
                    });
                }
                this.Internal_AddTextPr( Item.Value );
                if(Item.Value.unifill && Item.Value.unifill.fill)
                {
                    this.Parent.Parent.calculateText3(this);
                    History.Add(this, {  Type : history_undo_redo_const,
                        undo_function : function(data)
                        {
                        },

                        redo_function : function(data)
                        {
                            this.Parent.Parent.calculateText3(this);
                        }
                    });
                }
                break;
            }
            case para_HyperlinkStart:
            {
                this.Internal_AddHyperlink( Item );
                break;
            }
            case para_PageNum:
            case para_Tab:
            case para_Drawing:
            default:
            {
                this.Internal_Content_Add( CurPos, Item );

                break;
            }
        }

        if ( para_TextPr != Item.Type )
            this.DeleteCollaborativeMarks = true;

        this.RecalcInfo.Set_Type_0(pararecalc_0_All);
    },

    Internal_IncDecFontSize : function(bIncrease, Value)
    {
        // Закон изменения размеров :
        // 1. Если значение меньше 8, тогда мы увеличиваем/уменьшаем по 1 (от 1 до 8)
        // 2. Если значение больше 72, тогда мы увеличиваем/уменьшаем по 10 (от 80 до бесконечности
        // 3. Если значение в отрезке [8,72], тогда мы переходим по следующим числам 8,9,10,11,12,14,16,18,20,22,24,26,28,36,48,72

        var Sizes = [8,9,10,11,12,14,16,18,20,22,24,26,28,36,48,72];

        var NewValue = Value;
        if ( true === bIncrease )
        {
            if ( Value < Sizes[0] )
            {
                if ( Value >= Sizes[0] - 1 )
                    NewValue = Sizes[0];
                else
                    NewValue = Math.floor(Value + 1);
            }
            else if ( Value >= Sizes[Sizes.length - 1] )
            {
                NewValue = Math.min( 300, Math.floor( Value / 10 + 1 ) * 10 );
            }
            else
            {
                for ( var Index = 0; Index < Sizes.length; Index++ )
                {
                    if ( Value < Sizes[Index] )
                    {
                        NewValue = Sizes[Index];
                        break;
                    }
                }
            }
        }
        else
        {
            if ( Value <= Sizes[0] )
            {
                NewValue = Math.max( Math.floor( Value - 1 ), 1 );
            }
            else if ( Value > Sizes[Sizes.length - 1] )
            {
                if ( Value <= Math.floor( Sizes[Sizes.length - 1] / 10 + 1 ) * 10 )
                    NewValue = Sizes[Sizes.length - 1];
                else
                    NewValue = Math.floor( Math.ceil(Value / 10) - 1 ) * 10;
            }
            else
            {
                for ( var Index = Sizes.length - 1; Index >= 0; Index-- )
                {
                    if ( Value > Sizes[Index] )
                    {
                        NewValue = Sizes[Index];
                        break;
                    }
                }
            }
        }

        return NewValue;
    },

    IncDec_FontSize : function(bIncrease)
    {
        this.RecalcInfo.Set_Type_0(pararecalc_0_All);
        var StartTextPr = this.Get_CompiledPr().TextPr;

        if ( true === this.ApplyToAll )
        {
            var StartFontSize = this.Internal_IncDecFontSize( bIncrease, StartTextPr.FontSize );
            this.Internal_Content_Add( 0, new ParaTextPr( { FontSize : StartFontSize } ) );

            for ( var Index = 1; Index < this.Content.length; Index++ )
            {
                var Item = this.Content[Index];
                if ( para_TextPr === Item.Type )
                {
                    if ( undefined != Item.Value.FontSize )
                        Item.Set_FontSize( this.Internal_IncDecFontSize( bIncrease, Item.Value.FontSize ) );
                    else
                        Item.Set_FontSize( this.Internal_IncDecFontSize( bIncrease, StartTextPr.FontSize ) );
                }
            }

            // Выставляем настройки для символа параграфа
            if ( undefined != this.TextPr.Value.FontSize )
                this.TextPr.Set_FontSize( this.Internal_IncDecFontSize( bIncrease, this.TextPr.Value.FontSize ) );
            else
                this.TextPr.Set_FontSize( this.Internal_IncDecFontSize( bIncrease, StartTextPr.FontSize ) );

            return true;
        }

        // найдем текущую позицию
        var Line   = this.Content;
        var CurPos = this.CurPos.ContentPos;
        if ( true === this.Selection.Use )
        {
            var StartPos = this.Selection.StartPos;
            var EndPos   = this.Selection.EndPos;

            if ( StartPos > EndPos )
            {
                var Temp = EndPos;
                EndPos   = StartPos;
                StartPos = Temp;
            }

            // Если селект продолжается до конца параграфа, не ставим отметку в конце
            var LastPos = this.Internal_GetEndPos();
            var bEnd = false;
            if ( EndPos > LastPos )
            {
                EndPos = LastPos;
                bEnd = true;
            }

            // Рассчитываем настройки, которые используются после селекта
            var TextPr_end   = this.Internal_GetTextPr( EndPos );
            var TextPr_start = this.Internal_GetTextPr( StartPos );

            if ( undefined != TextPr_start.FontSize )
                TextPr_start.FontSize = this.Internal_IncDecFontSize( bIncrease, TextPr_start.FontSize );
            else
                TextPr_start.FontSize = this.Internal_IncDecFontSize( bIncrease, StartTextPr.FontSize );

            this.Internal_Content_Add( StartPos, new ParaTextPr( TextPr_start ) );
            if ( false === bEnd )
                this.Internal_Content_Add( EndPos + 1, new ParaTextPr( TextPr_end ) );
            else
            {
                // Выставляем настройки для символа параграфа
                if ( undefined != typeof(this.TextPr.Value.FontSize) )
                    this.TextPr.Set_FontSize( this.Internal_IncDecFontSize( bIncrease, this.TextPr.Value.FontSize ) );
                else
                    this.TextPr.Set_FontSize( this.Internal_IncDecFontSize( bIncrease, StartTextPr.FontSize ) );
            }

            for ( var Pos = StartPos + 1; Pos < EndPos; Pos++ )
            {
                Item = this.Content[Pos];
                if ( para_TextPr === Item.Type )
                {
                    if ( undefined != typeof(Item.Value.FontSize) )
                        Item.Set_FontSize( this.Internal_IncDecFontSize( bIncrease, Item.Value.FontSize ) );
                    else
                        Item.Set_FontSize( this.Internal_IncDecFontSize( bIncrease, StartTextPr.FontSize ) );
                }
            }

            return true;
        }

        // 1. Если мы в конце параграфа, тогда добавляем запись о шрифте (применимо к знаку конца параграфа)
        // 2. Если справа или слева стоит пробел (начало параграфа или перенос строки(командный)), тогда ставим метку со шрифтом и фокусим канву.
        // 3. Если мы посередине слова, тогда меняем шрифт для данного слова

        var oEnd   = this.Internal_FindForward ( CurPos, [para_PageNum, para_Drawing, para_Tab, para_Text, para_Space, para_End, para_NewLine] );
        var oStart = this.Internal_FindBackward( CurPos - 1, [para_PageNum, para_Drawing, para_Tab, para_Text, para_Space, para_NewLine] );
        var CurType = this.Content[CurPos].Type;

        if ( !oEnd.Found )
            return false;

        if ( para_End == oEnd.Type )
        {
            // Вставляем запись о новых настройках перед концом параграфа, а текущую позицию выставляем на конец параграфа
            var Pos = oEnd.LetterPos;
            var TextPr_start = this.Internal_GetTextPr( Pos );

            if ( undefined != typeof(TextPr_start.FontSize) )
                TextPr_start.FontSize = this.Internal_IncDecFontSize( bIncrease, TextPr_start.FontSize );
            else
                TextPr_start.FontSize = this.Internal_IncDecFontSize( bIncrease, StartTextPr.FontSize );

            this.Internal_Content_Add( Pos, new ParaTextPr( TextPr_start ) );
            this.CurPos.ContentPos = Pos + 1;

            // Выставляем настройки для символа параграфа
            if ( undefined != typeof(this.TextPr.Value.FontSize) )
                this.TextPr.Set_FontSize( this.Internal_IncDecFontSize( bIncrease, this.TextPr.Value.FontSize ) );
            else
                this.TextPr.Set_FontSize( this.Internal_IncDecFontSize( bIncrease, StartTextPr.FontSize ) );

            return true;
        }
        else if ( para_PageNum === CurType || para_Drawing === CurType || para_Tab == CurType || para_Space == CurType || para_NewLine == CurType || !oStart.Found || para_NewLine == oEnd.Type || para_Space == oEnd.Type || para_NewLine == oStart.Type || para_Space == oStart.Type || para_Tab == oEnd.Type || para_Tab == oStart.Type || para_Drawing == oEnd.Type || para_Drawing == oStart.Type || para_PageNum == oEnd.Type || para_PageNum == oStart.Type )
        {
            var TextPr_old = this.Internal_GetTextPr( CurPos );
            var TextPr_new = TextPr_old.Copy();

            if ( undefined != typeof(TextPr_new.FontSize) )
                TextPr_new.FontSize = this.Internal_IncDecFontSize( bIncrease, TextPr_new.FontSize );
            else
                TextPr_new.FontSize = this.Internal_IncDecFontSize( bIncrease, StartTextPr.FontSize );

            this.Internal_Content_Add( CurPos, new ParaTextPr( TextPr_old ) );
            this.Internal_Content_Add( CurPos, new ParaEmpty(true) );
            this.Internal_Content_Add( CurPos, new ParaTextPr( TextPr_new ) );

            this.CurPos.ContentPos = CurPos + 1;
            this.RecalculateCurPos();
            return false;
        }
        else
        {
            // Мы находимся посередине слова. В начале слова ставим запись о новом размере шрифта,
            // а в конце слова старый размер шрифта. Кроме этого, надо заменить все записи о размерах шрифте внутри слова.

            // Найдем начало слова
            var oWordStart = this.Internal_FindBackward( CurPos, [para_PageNum, para_Drawing, para_Tab, para_Space, para_NewLine] );
            if ( !oWordStart.Found )
                oWordStart = this.Internal_FindForward( 0, [para_Text] );
            else
                oWordStart.LetterPos++;

            var oWordEnd   = this.Internal_FindForward( CurPos, [para_PageNum, para_Drawing, para_Tab, para_Space, para_End, para_NewLine] );

            if ( !oWordStart.Found || !oWordEnd.Found )
                return;

            // Рассчитываем настройки, которые используются после слова
            var TextPr_end   = this.Internal_GetTextPr( oWordEnd.LetterPos );
            var TextPr_start = this.Internal_GetTextPr( oWordStart.LetterPos );

            if ( undefined != TextPr_start.FontSize )
                TextPr_start.FontSize = this.Internal_IncDecFontSize( bIncrease, TextPr_start.FontSize );
            else
                TextPr_start.FontSize = this.Internal_IncDecFontSize( bIncrease, StartTextPr.FontSize );

            this.Internal_Content_Add( oWordStart.LetterPos, new ParaTextPr( TextPr_start ) );
            this.Internal_Content_Add( oWordEnd.LetterPos + 1 /* из-за предыдущего Internal_Content_Add */, new ParaTextPr( TextPr_end ) );

            this.CurPos.ContentPos = CurPos + 1;

            // Если внутри слова были изменения размера шрифта, тогда заменяем их.
            for ( var Pos = oWordStart.LetterPos + 1; Pos < oWordEnd.LetterPos; Pos++ )
            {
                Item = this.Content[Pos];
                if ( para_TextPr === Item.Type )
                {
                    if ( undefined != Item.Value.FontSize )
                        Item.Set_FontSize( this.Internal_IncDecFontSize( bIncrease, Item.Value.FontSize ) );
                    else
                        Item.Set_FontSize( this.Internal_IncDecFontSize( bIncrease, StartTextPr.FontSize ) );
                }
            }

            return true;
        }
    },


    canIncreaseIndent : function(bIncrease)
    {
        if(bIncrease)
        {
            if(this.PresentationPr.Level == 8)
            {
                return false;
            }
            if(this.rPr.FontSize != undefined && (this.rPr.FontSize - 4) < 1)
            {
                return false;
            }

            var _content_index;
            var _content = this.Content;
            var _content_count = _content.length;
            for(_content_index = 0; _content_index < _content_count; ++_content_index)
            {
                if(_content[_content_index].Type == para_TextPr)
                {
                    if(_content[_content_index].Value.FontSize != undefined && (_content[_content_index].Value.FontSize - 4) < 1)
                    {
                        return false;
                    }
                }
            }
            return true;
        }
        else
        {
            return this.PresentationPr.Level > 0;
        }
    },

    IncDec_Indent : function(bIncrease)
    {
        var NumPr = this.Numbering_Get();
        if ( undefined != NumPr )
        {
            if ( true === bIncrease )
                this.Numbering_Add( NumPr.NumId, Math.min( 8, NumPr.Lvl + 1 ) );
            else
                this.Numbering_Add( NumPr.NumId, Math.max( 0, NumPr.Lvl - 1 ) );
        }
        else
        {
            var ParaPr = this.Get_CompiledPr2(false).ParaPr;

            var LeftMargin = ParaPr.Ind.Left;
            if ( UnknownValue === LeftMargin )
                LeftMargin = 0;
            else if ( LeftMargin < 0 )
            {
                this.Set_Ind( { Left : 0 }, false );
                return;
            }

            var LeftMargin_new = 0;
            if ( true === bIncrease )
            {
                if ( LeftMargin >= 0 )
                {
                    LeftMargin = 12.5 * parseInt(10 * LeftMargin / 125);
                    LeftMargin_new = ( (LeftMargin - (10 * LeftMargin) % 125) / 12.5 + 1) * 12.5;
                }

                if ( LeftMargin_new < 0 )
                    LeftMargin_new = 12.5;
            }
            else
                LeftMargin_new = Math.max( ( (LeftMargin - (10 * LeftMargin) % 125) / 12.5 - 1) * 12.5, 0 );

            this.Set_Ind( { Left : LeftMargin_new }, false );
        }

        var NewPresLvl = ( true === bIncrease ? Math.min( 8, this.PresentationPr.Level + 1 ) : Math.max( 0, this.PresentationPr.Level - 1 ) );
        this.Set_PresentationLevel( NewPresLvl );
    },

    Cursor_GetPos : function()
    {
        return { X : this.CurPos.RealX, Y : this.CurPos.RealY };
    },

    Cursor_MoveLeft : function(Count, AddToSelect, Word)
    {
        if ( this.CurPos.ContentPos < 0 )
            return false;

        if ( 0 == Count || !Count )
            return;

        var absCount = ( Count < 0 ? -Count : Count );

        for ( var Index = 0; Index < absCount; Index++ )
        {
            if ( false === this.Internal_MoveCursorBackward(AddToSelect, Word) )
                return false;
        }

        this.Internal_Recalculate_2(this.CurPos.ContentPos, false);

        this.CurPos.RealX = this.CurPos.X;
        this.CurPos.RealY = this.CurPos.Y;

        return true;
    },

    Cursor_MoveRight : function(Count, AddToSelect, Word)
    {
        if ( this.CurPos.ContentPos < 0 )
            return false;

        if ( 0 == Count || !Count )
            return;

        var absCount = ( Count < 0 ? -Count : Count );

        for ( var Index = 0; Index < absCount; Index++ )
        {
            if ( false === this.Internal_MoveCursorForward(AddToSelect, Word) )
                return false;
        }

        this.Internal_Recalculate_2(this.CurPos.ContentPos, false);

        this.CurPos.RealX = this.CurPos.X;
        this.CurPos.RealY = this.CurPos.Y;

        return true;
    },

    Cursor_MoveUp : function(Count, AddToSelect)
    {
        var CursorPos_max = this.Internal_GetEndPos();
        var CursorPos_min = this.Internal_GetStartPos();

        if ( this.CurPos.ContentPos < 0 )
            return false;

        if ( !Count || 0 == Count )
            return;

        var absCount = ( Count < 0 ? -Count : Count );

        // Пока сделаем для Count = 1
        var CurLine = 0, Pos;
        for ( Pos = this.CurPos.ContentPos - 1; Pos >= 0; Pos-- )
        {
            if ( ( para_NewLine == this.Content[Pos].Type && true === this.Content[Pos].Is_NewLine() ) || para_NewLineRendered == this.Content[Pos].Type )
                CurLine++;
        }

        var Result = true;
        if ( true === this.Selection.Use )
        {
            if ( true === AddToSelect )
            {
                this.CurPos.ContentPos = this.Selection.EndPos;

                // Пока сделаем для Count = 1
                CurLine = 0;
                for ( Pos = this.CurPos.ContentPos - 1; Pos >= 0; Pos-- )
                {
                    if ( ( para_NewLine == this.Content[Pos].Type && true === this.Content[Pos].Is_NewLine() ) || para_NewLineRendered == this.Content[Pos].Type )
                        CurLine++;
                }

                this.RecalculateCurPos();
                this.CurPos.RealY = this.CurPos.Y;

                if ( 0 == CurLine )
                {
                    // Переходим в предыдущий элеменет документа
                    Result = false;
                    this.Selection.EndPos = this.Internal_GetStartPos();
                }
                else
                {
                    this.Cursor_MoveAt( this.CurPos.RealX, CurLine - 1, true, true );
                    this.CurPos.RealY = this.CurPos.Y;
                    this.Selection.EndPos = this.CurPos.ContentPos;
                }

                if ( this.Selection.StartPos == this.Selection.EndPos )
                {
                    this.Selection_Remove();
                    this.Selection.Use = false;

                    this.CurPos.ContentPos = Math.max( CursorPos_min, Math.min( this.Selection.EndPos, CursorPos_max ) );
                    this.RecalculateCurPos();

                    return Result;
                }
            }
            else
            {
                var StartPos = this.Selection.StartPos;
                var EndPos   = this.Selection.EndPos;

                if ( StartPos > EndPos )
                {
                    var Temp = EndPos;
                    EndPos   = StartPos;
                    StartPos = Temp;
                }

                this.CurPos.ContentPos = StartPos;
                this.Selection_Remove();

                // Пока сделаем для Count = 1
                CurLine = 0;
                for ( Pos = this.CurPos.ContentPos - 1; Pos >= 0; Pos-- )
                {
                    if ( ( para_NewLine == this.Content[Pos].Type && true === this.Content[Pos].Is_NewLine() ) || para_NewLineRendered == this.Content[Pos].Type )
                        CurLine++;
                }

                this.Internal_Recalculate_2(this.CurPos.ContentPos, false);
                this.CurPos.RealX = this.CurPos.X;
                this.CurPos.RealY = this.CurPos.Y;

                if ( 0 == CurLine )
                {
                    // Переходим в предыдущий элеменет документа
                    Result = false;
                }
                else
                {
                    this.Cursor_MoveAt( this.CurPos.RealX, CurLine - 1, true, true );
                    this.CurPos.RealX = this.CurPos.X;
                    this.CurPos.RealY = this.CurPos.Y;
                }

            }
        }
        else if ( true === AddToSelect )
        {
            this.Selection.Use = true;
            this.Selection.StartPos = this.CurPos.ContentPos;

            // Пока сделаем для Count = 1
            CurLine = 0;
            for ( Pos = this.CurPos.ContentPos - 1; Pos >= 0; Pos-- )
            {
                if ( ( para_NewLine == this.Content[Pos].Type && true === this.Content[Pos].Is_NewLine() ) || para_NewLineRendered == this.Content[Pos].Type )
                    CurLine++;
            }

            this.RecalculateCurPos();
            this.CurPos.RealY = this.CurPos.Y;

            if ( 0 == CurLine )
            {
                // Переходим в предыдущий элеменет документа
                Result = false;
                this.Selection.EndPos = this.Internal_GetStartPos();
            }
            else
            {
                this.Cursor_MoveAt( this.CurPos.RealX, CurLine - 1, true, true );
                this.CurPos.RealY = this.CurPos.Y;
                this.Selection.EndPos = this.CurPos.ContentPos;
            }

            if ( this.Selection.StartPos == this.Selection.EndPos )
            {
                this.Selection_Remove();
                this.Selection.Use = false;

                this.CurPos.ContentPos = Math.max( CursorPos_min, Math.min( this.Selection.EndPos, CursorPos_max ) );
                this.RecalculateCurPos();

                return Result;
            }
        }
        else
        {
            if ( 0 == CurLine )
            {
                // Возвращяем значение false, это означает, что надо перейти в
                // предыдущий элемент контента документа.
                return false;
            }
            else
            {
                this.Cursor_MoveAt( this.CurPos.RealX, CurLine - 1, true, true );
                this.CurPos.RealY = this.CurPos.Y;
            }
        }

        return Result;
    },

    Cursor_MoveDown : function(Count, AddToSelect)
    {
        var CursorPos_max = this.Internal_GetEndPos();
        var CursorPos_min = this.Internal_GetStartPos();

        if ( this.CurPos.ContentPos < 0 )
            return false;

        if ( !Count || 0 == Count )
            return;

        var absCount = ( Count < 0 ? -Count : Count );

        // Пока сделаем для Count = 1
        var CurLine = 0, Pos;
        for ( Pos = this.CurPos.ContentPos - 1; Pos >= 0; Pos-- )
        {
            if ( ( para_NewLine == this.Content[Pos].Type && true === this.Content[Pos].Is_NewLine() ) || para_NewLineRendered == this.Content[Pos].Type )
                CurLine++;
        }

        var Result = true;
        if ( true === this.Selection.Use )
        {
            if ( true === AddToSelect )
            {
                this.CurPos.ContentPos = this.Selection.EndPos;

                // Пока сделаем для Count = 1
                CurLine = 0;
                for ( Pos = this.CurPos.ContentPos - 1; Pos >= 0; Pos-- )
                {
                    if ( ( para_NewLine == this.Content[Pos].Type && true === this.Content[Pos].Is_NewLine() ) || para_NewLineRendered == this.Content[Pos].Type )
                        CurLine++;
                }

                this.RecalculateCurPos();
                this.CurPos.RealY = this.CurPos.Y;

                if ( this.Lines.length - 1 == CurLine )
                {
                    // Переходим в предыдущий элеменет документа
                    Result = false;
                    this.Selection.EndPos = this.Content.length - 1;
                }
                else
                {
                    this.Cursor_MoveAt( this.CurPos.RealX, CurLine + 1, true, true );
                    this.CurPos.RealY = this.CurPos.Y;
                    this.Selection.EndPos = this.CurPos.ContentPos;
                }

                if ( this.Selection.StartPos == this.Selection.EndPos )
                {
                    this.Selection_Remove();
                    this.Selection.Use = false;

                    this.CurPos.ContentPos = Math.max( CursorPos_min, Math.min( this.Selection.EndPos, CursorPos_max ) );
                    this.RecalculateCurPos();

                    return Result;
                }
            }
            else
            {
                var StartPos = this.Selection.StartPos;
                var EndPos   = this.Selection.EndPos;

                if ( StartPos > EndPos )
                {
                    var Temp = EndPos;
                    EndPos   = StartPos;
                    StartPos = Temp;
                }

                this.CurPos.ContentPos = Math.max( CursorPos_min, Math.min( EndPos, CursorPos_max ) );
                this.Selection_Remove();

                // Пока сделаем для Count = 1
                CurLine = 0;
                for ( Pos = this.CurPos.ContentPos - 1; Pos >= 0; Pos-- )
                {
                    if ( ( para_NewLine == this.Content[Pos].Type && true === this.Content[Pos].Is_NewLine() ) || para_NewLineRendered == this.Content[Pos].Type )
                        CurLine++;
                }

                this.Internal_Recalculate_2(this.CurPos.ContentPos, false);
                this.CurPos.RealX = this.CurPos.X;
                this.CurPos.RealY = this.CurPos.Y;

                if ( this.Lines.length - 1 == CurLine )
                {
                    // Переходим в предыдущий элеменет документа
                    Result = false;
                }
                else
                {
                    this.Cursor_MoveAt( this.CurPos.RealX, CurLine + 1, true, true );
                    this.CurPos.RealX = this.CurPos.X;
                    this.CurPos.RealY = this.CurPos.Y;
                }

            }
        }
        else if ( AddToSelect )
        {
            this.Selection.Use = true;
            this.Selection.StartPos = this.CurPos.ContentPos;

            // Пока сделаем для Count = 1
            CurLine = 0;
            for ( Pos = this.CurPos.ContentPos - 1; Pos >= 0; Pos-- )
            {
                if ( ( para_NewLine == this.Content[Pos].Type && true === this.Content[Pos].Is_NewLine() ) || para_NewLineRendered == this.Content[Pos].Type )
                    CurLine++;
            }

            this.RecalculateCurPos();
            this.CurPos.RealY = this.CurPos.Y;

            if ( this.Lines.length - 1 == CurLine )
            {
                // Переходим в предыдущий элеменет документа
                Result = false;
                this.Selection.EndPos = this.Content.length - 1;
            }
            else
            {
                this.Cursor_MoveAt( this.CurPos.RealX, CurLine + 1, true, true );
                this.CurPos.RealY = this.CurPos.Y;
                this.Selection.EndPos = this.CurPos.ContentPos;
            }

            if ( this.Selection.StartPos == this.Selection.EndPos )
            {
                this.Selection_Remove();
                this.Selection.Use = false;

                this.CurPos.ContentPos = Math.max( CursorPos_min, Math.min( this.Selection.EndPos, CursorPos_max ) );
                this.RecalculateCurPos();

                return Result;
            }
        }
        else
        {
            if ( this.Lines.length - 1 == CurLine )
            {
                // Возвращяем значение false, это означает, что надо перейти в
                // предыдущий элемент контента документа.
                return false;
            }
            else
            {
                this.Cursor_MoveAt( this.CurPos.RealX, CurLine + 1, true, true );
                this.CurPos.RealY = this.CurPos.Y;
            }
        }

        return Result;
    },

    Cursor_MoveEndOfLine : function(AddToSelect)
    {
        var CursorPos_max = this.Internal_GetEndPos();
        var CursorPos_min = this.Internal_GetStartPos();

        if ( this.CurPos.ContentPos < 0 )
            return false;

        if ( true === this.Selection.Use )
        {
            if ( true === AddToSelect )
                this.CurPos.ContentPos = this.Selection.EndPos;
            else
            {
                this.CurPos.ContentPos = Math.max( CursorPos_min, Math.min( CursorPos_max, ( this.Selection.EndPos >= this.Selection.StartPos ? this.Selection.EndPos : this.Selection.StartPos ) ) );
                this.Selection_Remove();
            }
        }


        if ( true === this.Selection.Use && true === AddToSelect )
        {
            var oPos = this.Internal_FindForward( this.CurPos.ContentPos, [para_NewLine, para_NewLineRendered, para_Empty] );
            if ( oPos.Found )
            {
                this.Selection.EndPos = oPos.LetterPos;

                if ( this.Selection.StartPos == this.Selection.EndPos )
                {
                    this.Selection_Remove();
                    this.Selection.Use = false;

                    this.CurPos.ContentPos = Math.max( CursorPos_min, Math.min( this.Selection.EndPos, CursorPos_max ) );
                    this.RecalculateCurPos();

                    return;
                }
            }
        }
        else if ( AddToSelect )
        {
            var oPos = this.Internal_FindForward( this.CurPos.ContentPos, [para_NewLine, para_NewLineRendered, para_Empty] );
            if ( oPos.Found )
            {
                this.Selection.StartPos = this.CurPos.ContentPos;
                this.Selection.Use      = true;

                this.Selection.EndPos = oPos.LetterPos;

                if ( this.Selection.StartPos == this.Selection.EndPos )
                {
                    this.Selection_Remove();
                    this.Selection.Use = false;

                    this.CurPos.ContentPos = Math.max( CursorPos_min, Math.min( this.Selection.EndPos, CursorPos_max ) );
                    this.RecalculateCurPos();

                    return;
                }
            }
        }
        else
        {
            var oPos = this.Internal_FindForward( this.CurPos.ContentPos, [para_NewLine, para_NewLineRendered, para_End] );
            if ( oPos.Found )
            {
                this.CurPos.ContentPos = oPos.LetterPos;
            }

            this.RecalculateCurPos();
            this.CurPos.RealX = this.CurPos.X;
            this.CurPos.RealY = this.CurPos.Y;
        }
    },

    Cursor_MoveStartOfLine : function(AddToSelect)
    {
        var CursorPos_max = this.Internal_GetEndPos();
        var CursorPos_min = this.Internal_GetStartPos();

        if ( this.CurPos.ContentPos < 0 )
            return false;

        if ( true === this.Selection.Use )
        {
            if ( true === AddToSelect )
                this.CurPos.ContentPos = this.Selection.EndPos;
            else
            {
                this.CurPos.ContentPos = ( this.Selection.StartPos <= this.Selection.EndPos ? this.Selection.StartPos : this.Selection.EndPos );
                this.Selection_Remove();
            }
        }

        // Начинаем искать с предыдущей позиции, потому что текущая может сама быть переносом строки
        var oPos = this.Internal_FindBackward( this.CurPos.ContentPos - 1, [para_NewLine, para_NewLineRendered, para_PageBreakRendered] );

        if ( true === this.Selection.Use && true === AddToSelect )
        {
            if ( oPos.Found )
                this.Selection.EndPos = oPos.LetterPos + 1;
            else
                this.Selection.EndPos = this.Internal_GetStartPos();

            if ( this.Selection.StartPos == this.Selection.EndPos )
            {
                this.Selection_Remove();
                this.Selection.Use = false;

                this.CurPos.ContentPos = Math.max( CursorPos_min, Math.min( this.Selection.EndPos, CursorPos_max ) );
                this.RecalculateCurPos();

                return;
            }
        }
        else if ( AddToSelect )
        {
            if ( oPos.Found )
                this.Selection.EndPos = oPos.LetterPos + 1;
            else
                this.Selection.EndPos = this.Internal_GetStartPos();

            this.Selection.StartPos = this.CurPos.ContentPos;
            this.Selection.Use      = true;

            if ( this.Selection.StartPos == this.Selection.EndPos )
            {
                this.Selection_Remove();
                this.Selection.Use = false;

                this.CurPos.ContentPos = Math.max( CursorPos_min, Math.min( this.Selection.EndPos, CursorPos_max ) );
                this.RecalculateCurPos();

                return;
            }
        }
        else
        {
            if ( oPos.Found )
            {
                this.CurPos.ContentPos = oPos.LetterPos + 1; // Чтобы встать на следующую линию
            }
            else
            {
                this.CurPos.ContentPos = this.Internal_GetStartPos();
            }

            this.RecalculateCurPos();
            this.CurPos.RealX = this.CurPos.X;
            this.CurPos.RealY = this.CurPos.Y;

        }
    },

    Cursor_MoveToStartPos : function()
    {
        this.Selection.Use = false;
        this.CurPos.ContentPos = this.Internal_GetStartPos();
    },

    Cursor_MoveToEndPos : function()
    {
        this.Selection.Use = false;
        this.CurPos.ContentPos = this.Internal_GetEndPos();
    },

    Cursor_MoveUp_To_LastRow : function(X, Y, AddToSelect)
    {
        this.CurPos.RealX = X;
        this.CurPos.RealY = Y;

        // Перемещаем курсор в последнюю строку, с позицией, самой близкой по X
        this.Cursor_MoveAt( X, this.Lines.length - 1, true, true, this.PageNum );

        if ( true === AddToSelect )
        {
            if ( false === this.Selection.Use )
            {
                this.Selection.Use      = true;
                this.Selection.StartPos = this.Content.length - 1;
            }
            this.Selection.EndPos = this.CurPos.ContentPos;
        }
    },

    Cursor_MoveDown_To_FirstRow : function(X, Y, AddToSelect)
    {
        this.CurPos.RealX = X;
        this.CurPos.RealY = Y;

        // Перемещаем курсор в последнюю строку, с позицией, самой близкой по X
        this.Cursor_MoveAt( X, 0, true, true, this.PageNum );

        if ( true === AddToSelect )
        {
            if ( false === this.Selection.Use )
            {
                this.Selection.Use      = true;
                this.Selection.StartPos = this.Internal_GetStartPos();
            }
            this.Selection.EndPos = this.CurPos.ContentPos;
        }
    },

    Get_CurPosXY : function()
    {
        return { X : this.CurPos.RealX, Y : this.CurPos.RealY };
    },

    Is_SelectionUse : function()
    {
        return this.Selection.Use;
    },

    // Функция определяет начальную позицию курсора в параграфе
    Internal_GetStartPos : function()
    {
        var oPos = this.Internal_FindForward( 0, [para_FlowObjectAnchor, para_PageNum, para_Drawing, para_Tab, para_Text, para_Space, para_NewLine, para_NewLineRendered, para_End] );
        if ( true === oPos.Found )
            return oPos.LetterPos;

        return 0;
    },

    // Функция определяет конечную позицию в параграфе
    Internal_GetEndPos : function()
    {
        // В конце всегда идет два элемента: ParaEnd, ParaEmpty
        if ( this.Content.length >= 2 )
            return (this.Content.length - 2);

        return 0;
    },

    Internal_MoveCursorBackward : function (AddToSelect, Word)
    {
        var CursorPos_max = this.Internal_GetEndPos();
        var CursorPos_min = this.Internal_GetStartPos();

        if ( true === this.Selection.Use )
        {
            if ( true === AddToSelect )
            {
                this.CurPos.ContentPos = this.Selection.EndPos;
            }
            else
            {
                // В случае селекта, убираем селект и перемещаем курсор в начало селекта
                var StartPos = this.Selection.StartPos;
                var EndPos   = this.Selection.EndPos;

                if ( StartPos > EndPos )
                {
                    var Temp = EndPos;
                    EndPos   = StartPos;
                    StartPos = Temp;
                }

                this.Selection_Remove();
                this.CurPos.ContentPos = StartPos;
                return;
            }
        }

        if ( true === this.Selection.Use ) // Добавляем к селекту
        {
            var oPos;

            if ( true != Word )
                oPos = this.Internal_FindBackward( this.CurPos.ContentPos - 1, [para_PageNum, para_Drawing, para_Tab, para_Text, para_Space, para_NewLine, para_End] );
            else
                oPos = this.Internal_FindWordStart( this.CurPos.ContentPos - 1, CursorPos_min );

            if ( oPos.Found )
            {
                this.Selection.EndPos = oPos.LetterPos;

                if ( this.Selection.StartPos == this.Selection.EndPos )
                {
                    this.Selection_Remove();
                    this.Selection.Use = false;

                    this.CurPos.ContentPos = Math.max( CursorPos_min, Math.min( this.Selection.EndPos, CursorPos_max ) );
                    this.RecalculateCurPos();

                    return true;
                }

                return true;
            }
            else
            {
                // TODO: Надо перейти в предыдущий элемент документа
                return false;
            }

        }
        else if ( true == AddToSelect )
        {
            var oPos;
            if ( true != Word )
                oPos = this.Internal_FindBackward( this.CurPos.ContentPos - 1, [para_PageNum, para_Drawing, para_Tab, para_Text, para_Space, para_NewLine, para_End] );
            else
                oPos = this.Internal_FindWordStart( this.CurPos.ContentPos - 1, CursorPos_min );

            // Селекта еще нет, добавляем с текущей позиции
            this.Selection.StartPos = this.CurPos.ContentPos;
            this.Selection.Use      = true;

            if ( oPos.Found )
            {
                this.Selection.EndPos = oPos.LetterPos;

                return true;
            }
            else
            {
                this.Selection.Use = false;
                // TODO: Надо перейти в предыдущий элемент документа
                return false;
            }
        }
        else
        {
            var oPos;

            if ( true != Word )
                oPos = this.Internal_FindBackward( this.CurPos.ContentPos - 1, [para_PageNum, para_Drawing, para_Tab, para_Text, para_Space, para_NewLine, para_NewLineRendered] );
            else
                oPos = this.Internal_FindWordStart( this.CurPos.ContentPos - 1, CursorPos_min );

            if ( oPos.Found )
            {
                this.CurPos.ContentPos = oPos.LetterPos;
                return true;
            }
            else
            {
                // Надо перейти в предыдущий элемент документа
                return false;
            }

        }
    },

    Internal_FindWordStart : function(Pos, Pos_min)
    {
        var LetterPos = Pos;

        if ( Pos < Pos_min || Pos >= this.Content.length )
            return { Found : false };

        // На первом этапе ищем первый непробельный ( и не таб ) элемент
        while ( true )
        {
            var Item = this.Content[LetterPos];
            var Type = Item.Type;
            var bSpace = false;

            if ( para_TextPr  === Type || para_NewLineRendered === Type || para_FlowObjectAnchor === Type ||
                 para_Space   === Type || para_HyperlinkStart  === Type || para_HyperlinkEnd     === Type ||
                 para_Tab     === Type || para_InlineBreak     === Type || para_Empty            === Type ||
                 para_CommentStart            === Type || para_CommentEnd                === Type ||
                 para_CollaborativeChangesEnd === Type || para_CollaborativeChangesStart === Type ||
                ( para_Text === Type && true === Item.Is_NBSP() )
               )
                bSpace = true;

            if ( true === bSpace )
            {
                LetterPos--;

                if ( LetterPos < 0 )
                    break;
            }
            else
                break;
        }

        if ( LetterPos <= Pos_min )
            return { LetterPos : Pos_min, Found : true, Type : this.Content[Pos_min].Type };

        // На втором этапе мы смотрим на каком элементе мы встали: если это не текст, тогда
        // останавливаемся здесь. В противном случае сдвигаемся назад, пока не попали на первый
        // не текстовый элемент.
        if ( para_Text != this.Content[LetterPos].Type )
            return { LetterPos : LetterPos, Found : true, Type : this.Content[LetterPos].Type };
        else
        {
            var bPunctuation = this.Content[LetterPos].Is_Punctuation();

            var TempPos = LetterPos;

            while ( TempPos > Pos_min )
            {
                TempPos--;
                var Item = this.Content[TempPos]
                var TempType = Item.Type;
                if ( !( true != Item.Is_RealContent() || para_TextPr === TempType ||
                        ( para_Text === TempType && true != Item.Is_NBSP() && ( ( true === bPunctuation && true === Item.Is_Punctuation() ) || ( false === bPunctuation && false === Item.Is_Punctuation() ) ) ) ||
                        para_CommentStart === TempType || para_CommentEnd === TempType || para_HyperlinkEnd === TempType || para_HyperlinkEnd === TempType
                      )
                   )
                    break;
                else
                    LetterPos = TempPos;
            }

            return { LetterPos : LetterPos, Found : true, Type : this.Content[LetterPos].Type }
        }

        return { Found : false };
    },

    Internal_FindWordEnd : function(Pos, Pos_max)
    {
        var LetterPos = Pos;

        if ( Pos > Pos_max || Pos >= this.Content.length )
            return { Found : false };

        var bFirst = true;
        var bFirstPunctuation = false; // является ли первый найденный символ знаком препинания

        // На первом этапе ищем первый нетекстовый ( и не таб ) элемент
        while ( true )
        {
            var Item = this.Content[LetterPos];
            var Type = Item.Type;
            var bText = false;

            if ( para_TextPr          === Type || para_NewLineRendered === Type || para_FlowObjectAnchor === Type ||
                 para_HyperlinkStart  === Type || para_HyperlinkEnd    === Type || para_InlineBreak      === Type ||
                 para_Empty           === Type || ( para_Text === Type && true != Item.Is_NBSP() && ( true === bFirst || ( bFirstPunctuation === Item.Is_Punctuation() ) ) ) ||
                 para_CommentStart            === Type || para_CommentEnd                === Type ||
                 para_CollaborativeChangesEnd === Type || para_CollaborativeChangesStart === Type
                )
            bText = true;

            if ( true === bText )
            {
                if ( true === bFirst && para_Text === Type )
                {
                    bFirst = false;
                    bFirstPunctuation = Item.Is_Punctuation();
                }

                LetterPos++;

                if ( LetterPos > Pos_max || LetterPos >= this.Content.length )
                    break;
            }
            else
                break;
        }

        // Первый найденный элемент не текстовый, смещаемся вперед
        if ( true === bFirst )
            LetterPos++;

        if ( LetterPos > Pos_max )
            return { Found : false };

        // На втором этапе мы смотрим на каком элементе мы встали: если это не пробел, тогда
        // останавливаемся здесь. В противном случае сдвигаемся вперед, пока не попали на первый
        // не пробельный элемент.
        if ( !(para_Space === this.Content[LetterPos].Type || ( para_Text === this.Content[LetterPos].Type && true === this.Content[LetterPos].Is_NBSP() ) ) )
            return { LetterPos : LetterPos, Found : true, Type : this.Content[LetterPos].Type };
        else
        {
            var TempPos = LetterPos;
            while ( TempPos < Pos_max )
            {
                TempPos++;
                var Item = this.Content[TempPos]
                var TempType = Item.Type;
                if ( !( true != Item.Is_RealContent() || para_TextPr === TempType || para_Space === this.Content[LetterPos].Type ||
                        ( para_Text === this.Content[LetterPos].Type && true === this.Content[LetterPos].Is_NBSP() ) ||
                        para_CommentStart === TempType || para_CommentEnd === TempType || para_HyperlinkEnd === TempType || para_HyperlinkEnd === TempType
                      )
                   )
                    break;
                else
                    LetterPos = TempPos;
            }

            return { LetterPos : LetterPos, Found : true, Type : this.Content[LetterPos].Type }
        }

        return { Found : false };
    },

    Internal_MoveCursorForward : function (AddToSelect, Word)
    {
        var CursorPos_max = this.Internal_GetEndPos();
        var CursorPos_min = this.Internal_GetStartPos();

        if ( true === this.Selection.Use )
        {
            if ( true === AddToSelect )
            {
                this.CurPos.ContentPos = this.Selection.EndPos;
            }
            else
            {
                // В случае селекта, убираем селект и перемещаем курсор в конец селекта
                var StartPos = this.Selection.StartPos;
                var EndPos   = this.Selection.EndPos;

                if ( StartPos > EndPos )
                {
                    var Temp = EndPos;
                    EndPos   = StartPos;
                    StartPos = Temp;
                }

                this.Selection_Remove();
                this.CurPos.ContentPos = Math.max( CursorPos_min, Math.min( EndPos, CursorPos_max ) );
                return true;
            }
        }

        if ( true == this.Selection.Use && true == AddToSelect )
        {
            var oPos;

            if ( true != Word )
                oPos = this.Internal_FindForward( this.CurPos.ContentPos + 1, [para_PageNum, para_Drawing, para_Tab, para_Text, para_Space, para_NewLine, para_End, para_Empty] );
            else
                oPos = this.Internal_FindWordEnd( this.CurPos.ContentPos, CursorPos_max + 1 );

            if ( oPos.Found )
            {
                this.Selection.EndPos = oPos.LetterPos;

                if ( this.Selection.StartPos == this.Selection.EndPos )
                {
                    this.Selection_Remove();
                    this.Selection.Use = false;

                    this.CurPos.ContentPos = Math.max( CursorPos_min, Math.min( this.Selection.EndPos, CursorPos_max ) );
                    this.RecalculateCurPos();

                    return;
                }

                return true;
            }
            else
            {
                // TODO: Надо перейти в предыдущий элемент документа
                return false;
            }
        }
        else if ( true == AddToSelect )
        {
            var oPos;
            if ( true != Word )
                oPos = this.Internal_FindForward( this.CurPos.ContentPos + 1, [para_PageNum, para_Drawing, para_Tab, para_Text, para_Space, para_NewLine, para_End, para_Empty] );
            else
                oPos = this.Internal_FindWordEnd( this.CurPos.ContentPos, CursorPos_max + 1 );

            // Селекта еще нет, добавляем с текущей позиции
            this.Selection.StartPos = this.CurPos.ContentPos;
            this.Selection.Use      = true;

            if ( oPos.Found )
            {
                this.Selection.EndPos = oPos.LetterPos;

                return true;
            }
            else
            {
                this.Selection.Use = false;
                // TODO: Надо перейти в предыдущий элемент документа
                return false;
            }
        }
        else
        {
            var oPos;

            if ( true != Word )
                oPos = this.Internal_FindForward( this.CurPos.ContentPos + 1, [para_PageNum, para_Drawing, para_Tab, para_Text, para_Space, para_NewLine, para_NewLineRendered, para_End] );
            else
                oPos = this.Internal_FindWordEnd( this.CurPos.ContentPos, CursorPos_max );

            if ( oPos.Found )
            {
                this.CurPos.ContentPos = oPos.LetterPos;
                return true;
            }
            else
            {
                // TODO: Надо перейти в следующий элемент документа
                return false;
            }

        }
    },

    Internal_AddTextPr : function(TextPr)
    {
        if ( true === this.ApplyToAll )
        {
            this.Internal_Content_Add( 1, new ParaTextPr( TextPr ) );

            // Внутри каждого TextPr меняем те настройки, которые пришли в TextPr. Например,
            // у нас изменен только размер шрифта, то изменяем запись о размере шрифта.
            for ( var Pos = 0; Pos < this.Content.length; Pos++ )
            {
                if ( this.Content[Pos].Type == para_TextPr )
                    this.Content[Pos].Apply_TextPr( TextPr );
            }

            // Выставляем настройки для символа параграфа
            this.TextPr.Apply_TextPr( TextPr );

            return;
        }

        // найдем текущую позицию
        var Line   = this.Content;
        var CurPos = this.CurPos.ContentPos;
        if ( true === this.Selection.Use )
        {
            var StartPos = this.Selection.StartPos;
            var EndPos   = this.Selection.EndPos;

            if ( StartPos > EndPos )
            {
                var Temp = EndPos;
                EndPos   = StartPos;
                StartPos = Temp;
            }

            // Если селект продолжается до конца параграфа, не ставим отметку в конце
            var LastPos = this.Internal_GetEndPos();
            var bEnd = false;
            if ( EndPos > LastPos )
            {
                EndPos = LastPos;
                bEnd = true;
            }

            // Рассчитываем шрифт, который используется после слова
            var TextPr_end   = this.Internal_GetTextPr( EndPos );
            var TextPr_start = this.Internal_GetTextPr( StartPos );
            TextPr_start.Merge( TextPr );

            this.Internal_Content_Add( StartPos, new ParaTextPr( TextPr_start ) );
            if ( false === bEnd )
                this.Internal_Content_Add( EndPos + 1, new ParaTextPr( TextPr_end ) );
            else
            {
                // Выставляем настройки для символа параграфа
                this.TextPr.Apply_TextPr( TextPr );
            }

            // Если внутри слова были изменения текстовых настроек, тогда удаляем только те записи, которые
            // меняются сейчас. Например, у нас изменен только размер шрифта, то удаляем запись о размере шрифта.
            for ( var Pos = StartPos + 1; Pos < EndPos; Pos++ )
            {
                if ( this.Content[Pos].Type == para_TextPr )
                {
                    this.Content[Pos].Apply_TextPr( TextPr );
                }
            }

            return;
        }

        // При изменении шрифта ведем себе следующим образом:
        // 1. Если мы в конце параграфа, тогда добавляем запись о шрифте (применимо к знаку конца параграфа)
        // 2. Если справа или слева стоит пробел (начало параграфа или перенос строки(командный)), тогда ставим метку со шрифтом и фокусим канву.
        // 3. Если мы посередине слова, тогда меняем шрифт для данного слова

        var oEnd   = this.Internal_FindForward ( CurPos, [para_PageNum, para_Drawing, para_Tab, para_Text, para_Space, para_End, para_NewLine] );
        var oStart = this.Internal_FindBackward( CurPos - 1, [para_PageNum, para_Drawing, para_Tab, para_Text, para_Space, para_NewLine] );
        var CurType = this.Content[CurPos].Type;

        if ( !oEnd.Found )
            return;

        if ( para_End == oEnd.Type )
        {
            // Вставляем запись о новых настройках перед концом параграфа, а текущую позицию выставляем на конец параграфа
            var Pos = oEnd.LetterPos;

            var TextPr_start = this.Internal_GetTextPr( Pos );
            TextPr_start.Merge( TextPr );

            this.Internal_Content_Add( Pos, new ParaTextPr( TextPr_start ) );
            this.CurPos.ContentPos = Pos + 1;

            // Выставляем настройки для символа параграфа
            this.TextPr.Apply_TextPr( TextPr );
        }
        else if ( para_PageNum === CurType || para_Drawing === CurType || para_Tab == CurType || para_Space == CurType || para_NewLine == CurType || !oStart.Found || para_NewLine == oEnd.Type || para_Space == oEnd.Type || para_NewLine == oStart.Type || para_Space == oStart.Type || para_Tab == oEnd.Type || para_Tab == oStart.Type || para_Drawing == oEnd.Type || para_Drawing == oStart.Type || para_PageNum == oEnd.Type || para_PageNum == oStart.Type )
        {
            var TextPr_old = this.Internal_GetTextPr( CurPos );
            var TextPr_new = TextPr_old.Copy();
            TextPr_new.Merge( TextPr );

            this.Internal_Content_Add( CurPos, new ParaTextPr( TextPr_old ) );
            this.Internal_Content_Add( CurPos, new ParaTextPr( TextPr_new ) );

            this.CurPos.ContentPos = CurPos + 1;
            this.RecalculateCurPos();
        }
        else
        {
            // Мы находимся посередине слова. В начале слова ставим запись о новом шрифте,
            // а в конце слова старый шрифт. Кроме этого, надо удалить все записи о шрифте внутри слова.

            // Найдем начало слова
            var oWordStart = this.Internal_FindBackward( CurPos, [para_PageNum, para_Drawing, para_Tab, para_Space, para_NewLine] );
            if ( !oWordStart.Found )
                oWordStart = this.Internal_FindForward( 0, [para_Text] );
            else
                oWordStart.LetterPos++;

            var oWordEnd   = this.Internal_FindForward( CurPos, [para_PageNum, para_Drawing, para_Tab, para_Space, para_End, para_NewLine] );

            if ( !oWordStart.Found || !oWordEnd.Found )
                return;

            // Рассчитываем настройки, которые используются после слова
            var TextPr_end   = this.Internal_GetTextPr( oWordEnd.LetterPos );
            var TextPr_start = this.Internal_GetTextPr( oWordStart.LetterPos );
            TextPr_start.Merge( TextPr );

            this.Internal_Content_Add( oWordStart.LetterPos, new ParaTextPr( TextPr_start ) );
            this.Internal_Content_Add( oWordEnd.LetterPos + 1 /* из-за предыдущего Internal_Content_Add */, new ParaTextPr( TextPr_end ) );

            this.CurPos.ContentPos = CurPos + 1;

            // Если внутри слова были изменения текстовых настроек, тогда удаляем только те записи, которые
            // меняются сейчас. Например, у нас изменен только размер шрифта, то удаляем запись о размере шрифта.
            for ( var Pos = oWordStart.LetterPos + 1; Pos < oWordEnd.LetterPos; Pos++ )
            {
                if ( this.Content[Pos].Type == para_TextPr )
                    this.Content[Pos].Apply_TextPr( TextPr );
            }
        }
    },

    Internal_AddHyperlink : function(Hyperlink_start)
    {
        // Создаем текстовую настройку для гиперссылки
        var Hyperlink_end = new ParaHyperlinkEnd();
        var TextPrObj =
        {
            Color      : { r : 0, g : 0, b : 255 },
            Underline  : true
        };
        var TextPr = new CTextPr();
        TextPr.Set_FromObject( TextPrObj );

        if ( true === this.ApplyToAll )
        {
            // TODO: Надо выяснить, нужно ли в данном случае делать гиперссылку
            return;
        }

        var CurPos = this.CurPos.ContentPos;
        if ( true === this.Selection.Use )
        {
            var StartPos = this.Selection.StartPos;
            var EndPos   = this.Selection.EndPos;

            if ( StartPos > EndPos )
            {
                var Temp = EndPos;
                EndPos   = StartPos;
                StartPos = Temp;
            }

            // Если селект продолжается до конца параграфа, не ставим отметку в конце
            var LastPos = this.Internal_GetEndPos();
            if ( EndPos > LastPos )
                EndPos = LastPos;

            var TextPr_end   = this.Internal_GetTextPr( EndPos );
            var TextPr_start = this.Internal_GetTextPr( StartPos );
            TextPr_start.Merge( TextPr );

            this.Internal_Content_Add( EndPos, new ParaTextPr( TextPr_end ) );
            this.Internal_Content_Add( EndPos, Hyperlink_end );
            this.Internal_Content_Add( StartPos, new ParaTextPr( TextPr_start ) );
            this.Internal_Content_Add( StartPos, Hyperlink_start );

            // Если внутри выделения были изменения текстовых настроек, тогда удаляем только те записи, которые
            // меняются сейчас. Например, у нас изменен только размер шрифта, то удаляем запись о размере шрифта.
            for ( var Pos = StartPos + 2; Pos < EndPos + 1; Pos++ )
            {
                if ( this.Content[Pos].Type == para_TextPr )
                    this.Content[Pos].Apply_TextPr( TextPr );
            }

            return;
        }

        return;

        // При изменении шрифта ведем себе следующим образом:
        // 1. Если мы в конце параграфа, тогда добавляем запись о шрифте (применимо к знаку конца параграфа)
        // 2. Если справа или слева стоит пробел (начало параграфа или перенос строки(командный)), тогда ставим метку со шрифтом и фокусим канву.
        // 3. Если мы посередине слова, тогда меняем шрифт для данного слова

        var oEnd   = this.Internal_FindForward ( CurPos, [para_PageNum, para_Drawing, para_Tab, para_Text, para_Space, para_End, para_NewLine] );
        var oStart = this.Internal_FindBackward( CurPos - 1, [para_PageNum, para_Drawing, para_Tab, para_Text, para_Space, para_NewLine] );
        var CurType = this.Content[CurPos].Type;

        if ( !oEnd.Found )
            return;

        if ( para_End == oEnd.Type )
        {
            // Вставляем запись о новых настройках перед концом параграфа, а текущую позицию выставляем на конец параграфа
            var Pos = oEnd.LetterPos;

            var TextPr_start = this.Internal_GetTextPr( Pos );
            TextPr_start.Merge( TextPr );

            this.Internal_Content_Add( Pos, new ParaTextPr( TextPr_start ) );
            this.CurPos.ContentPos = Pos + 1;
        }
        else if ( para_PageNum === CurType || para_Drawing === CurType || para_Tab == CurType || para_Space == CurType || para_NewLine == CurType || !oStart.Found || para_NewLine == oEnd.Type || para_Space == oEnd.Type || para_NewLine == oStart.Type || para_Space == oStart.Type || para_Tab == oEnd.Type || para_Tab == oStart.Type || para_Drawing == oEnd.Type || para_Drawing == oStart.Type || para_PageNum == oEnd.Type || para_PageNum == oStart.Type )
        {
            var TextPr_old = this.Internal_GetTextPr( CurPos );
            var TextPr_new = TextPr_old.Copy();
            TextPr_new.Merge( TextPr );

            this.Internal_Content_Add( CurPos, new ParaTextPr( TextPr_old ) );
            this.Internal_Content_Add( CurPos, new ParaTextPr( TextPr_new ) );

            this.CurPos.ContentPos = CurPos + 1;
            this.RecalculateCurPos();
        }
        else
        {
            // Мы находимся посередине слова. В начале слова ставим запись о новом шрифте,
            // а в конце слова старый шрифт. Кроме этого, надо удалить все записи о шрифте внутри слова.

            // Найдем начало слова
            var oWordStart = this.Internal_FindBackward( CurPos, [para_PageNum, para_Drawing, para_Tab, para_Space, para_NewLine] );
            if ( !oWordStart.Found )
                oWordStart = this.Internal_FindForward( 0, [para_Text] );
            else
                oWordStart.LetterPos++;

            var oWordEnd   = this.Internal_FindForward( CurPos, [para_PageNum, para_Drawing, para_Tab, para_Space, para_End, para_NewLine] );

            if ( !oWordStart.Found || !oWordEnd.Found )
                return;

            // Рассчитываем настройки, которые используются после слова
            var TextPr_end   = this.Internal_GetTextPr( oWordEnd.LetterPos );
            var TextPr_start = this.Internal_GetTextPr( oWordStart.LetterPos );
            TextPr_start.Merge( TextPr );

            this.Internal_Content_Add( oWordStart.LetterPos, new ParaTextPr( TextPr_start ) );
            this.Internal_Content_Add( oWordEnd.LetterPos + 1 /* из-за предыдущего Internal_Content_Add */, new ParaTextPr( TextPr_end ) );

            this.CurPos.ContentPos = CurPos + 1;

            // Если внутри слова были изменения текстовых настроек, тогда удаляем только те записи, которые
            // меняются сейчас. Например, у нас изменен только размер шрифта, то удаляем запись о размере шрифта.
            for ( var Pos = oWordStart.LetterPos + 1; Pos < oWordEnd.LetterPos; Pos++ )
            {
                if ( this.Content[Pos].Type == para_TextPr )
                    this.Content[Pos].Apply_TextPr( TextPr );
            }
        }
    },

    Internal_GetContentPosByXY : function(X,Y, bLine, PageNum, bCheckNumbering)
    {
        if ( this.Lines.length <= 0 )
            return {Pos : 0, End:false};

        // Сначала определим на какую строку мы попали

        var PNum = 0;
        if ( "number" == typeof(PageNum) )
        {
            PNum = PageNum - this.PageNum;
        }
        else
            PNum = 0;

        if ( PNum >= this.Pages.length )
        {
            PNum = this.Pages.length - 1;
            bLine = true;
            Y = this.Lines.length - 1;
        }
        else if ( PNum < 0 )
        {
            PNum = 0;
            bLine = true;
            Y = 0;
        }

        var bFindY   = false;
        var CurLine  = this.Pages[PNum].FirstLine;
        var CurLineY = this.Pages[PNum].Y + this.Lines[CurLine].Y;
        var LastLine = ( PNum >= this.Pages.length - 1 ? this.Lines.length - 1 : this.Pages[PNum + 1].FirstLine - 1 );

        if ( true === bLine )
            CurLine = Y;
        else
        {
            while ( !bFindY )
            {
                if ( Y < CurLineY )
                    break;
                if ( CurLine >= LastLine )
                    break;

                CurLine++;
                CurLineY = this.Lines[CurLine].Y + this.Pages[PNum].Y;
            }
        }

        // Ищем позицию в строке
        var CurLine2 = 0;
        var CurRange = 0;

        var CurX = this.Lines[CurLine].Ranges[CurRange].XVisible;

        var bEOL = false;
        var DiffX          = 1000000;//this.XLimit; // километра для ограничения должно хватить
        var NumberingDiffX = 1000000;//this.XLimit;
        var DiffPos = -1;
        var bEnd = false;

        var Result = { Pos : 0, End : false };

        for ( var ItemNum = 0; ItemNum < this.Content.length; ItemNum++ )
        {
            var Item = this.Content[ItemNum];

            if ( CurLine == CurLine2 )
            {
                var TempDx = 0;
                var bCheck     = false;
                var bNumbering = false;
                var bDrawing   = false;
                switch( Item.Type )
                {
                    case para_Drawing:
                        TempDx     = Item.WidthVisible;
                        bCheck     = true;
                        break;

                    case para_Numbering:
                    {
                        var NumPr = this.Numbering_Get();
                        if ( undefined === NumPr || undefined === NumPr.NumId )
                            break;

                        TempDx     = Item.WidthVisible;
                        bCheck     = true;
                        bNumbering = true;
                        break;
                    }
                    case para_PresentationNumbering:
                    {
                        TempDx = Item.WidthVisible;
                        bCheck = false;
                        break;
                    }

                    case para_PageNum:
                    case para_Text:

                        TempDx = Item.WidthVisible;
                        bCheck = true;
                        break;
                    case para_Space:

                        TempDx = Item.WidthVisible;
                        bCheck = true;
                        break;

                    case para_Tab:

                        TempDx = Item.WidthVisible;
                        bCheck = true;
                        break;

                    case para_InlineBreak:

                        CurRange++;
                        CurX = this.Lines[CurLine].Ranges[CurRange].XVisible;
                        bCheck = false;
                        break;

                    case para_NewLine:

                        if ( false === Item.Is_NewLine() )
                        {
                            bCheck = true;
                            TempDx = Item.WidthVisible;
                            break;
                        }

                    case para_NewLineRendered:

                        bEOL = true;
                        bCheck = true;
                        break;

                    case para_End:

                        bEnd = true;
                        bEOL = true;
                        bCheck = true;
                        TempDx = Item.WidthVisible;

                        break;
                }

                if ( bCheck )
                {
                    if ( false === bNumbering && Math.abs( X - CurX ) < DiffX )
                    {
                        DiffX = Math.abs( X - CurX );
                        DiffPos = ItemNum;
                    }

                    if ( true === bNumbering )
                    {
                        var NumPr = this.Numbering_Get();
                        var NumJc = this.Parent.Get_Numbering().Get_AbstractNum( NumPr.NumId ).Lvl[NumPr.Lvl].Jc;

                        var NumX0 = CurX;
                        var NumX1 = CurX;

                        switch( NumJc )
                        {
                            case align_Right:
                            {
                                NumX0 -= Item.WidthNum;
                                break;
                            }
                            case align_Center:
                            {
                                NumX0 -= Item.WidthNum / 2;
                                NumX1 += Item.WidthNum / 2;
                                break;
                            }
                            case align_Left:
                            default:
                            {
                                NumX1 += Item.WidthNum;
                                break;
                            }
                        }

                        if ( X >= NumX0 && X <= NumX1 )
                            NumberingDiffX = 0;
                    }

                    // Заглушка для знака параграфа
                    if ( bEnd )
                    {
                        CurX += TempDx;
                        if ( Math.abs( X - CurX ) < DiffX )
                        {
                            Result.End = true;
                        }

                        break;
                    }

                    if ( bEOL )
                        break;
                }
                CurX += TempDx;
            }
            else
            {
                if ( ( Item.Type == para_NewLine && true === Item.Is_NewLine() ) || Item.Type == para_NewLineRendered )
                    CurLine2++;
            }
        }

        if ( NumberingDiffX <= DiffX )
            Result.Numbering = true;
        else
            Result.Numbering = false;

        Result.Pos = DiffPos;

        return Result;
    },

    Internal_GetXYByContentPos : function(Pos)
    {
        return this.Internal_Recalculate_2(Pos);
    },

    Internal_Selection_CheckHyperlink : function()
    {
        // Если у нас начало селекта находится внутри гиперссылки, а конец
        // нет (или наоборот), тогда выделяем всю гиперссылку.

        var Direction = 1;
        var StartPos  = this.Selection.StartPos;
        var EndPos    = this.Selection.EndPos;

        if ( StartPos > EndPos )
        {
            StartPos  = this.Selection.EndPos;
            EndPos    = this.Selection.StartPos;
            Direction = -1;
        }

        var Hyperlink_start = this.Check_Hyperlink2( StartPos );
        var Hyperlink_end   = this.Check_Hyperlink2( EndPos );

        if ( null != Hyperlink_start && Hyperlink_end != Hyperlink_start )
            StartPos = this.Internal_FindBackward( StartPos, [para_HyperlinkStart]).LetterPos;

        if ( null != Hyperlink_end && Hyperlink_end != Hyperlink_start )
            EndPos = this.Internal_FindForward( EndPos, [para_HyperlinkEnd]).LetterPos + 1;

        if ( Direction > 0 )
        {
            this.Selection.StartPos = StartPos;
            this.Selection.EndPos   = EndPos;
        }
        else
        {
            this.Selection.StartPos = EndPos;
            this.Selection.EndPos   = StartPos;
        }
    },

    Check_Hyperlink : function(X, Y, PageNum)
    {
        var Result = this.Internal_GetContentPosByXY( X, Y, false, PageNum, false);
        if ( -1 != Result.Pos )
        {
            var Find = this.Internal_FindBackward( Result.Pos, [para_HyperlinkStart, para_HyperlinkEnd] );
            if ( true === Find.Found && para_HyperlinkStart === Find.Type )
                return this.Content[Find.LetterPos];
        }

        return null;
    },

    Check_Hyperlink2 : function(Pos, bCheckEnd)
    {
        if ( "undefined" === typeof(bCheckEnd) )
            bCheckEnd = true;

        // TODO : Специальная заглушка, для конца селекта. Неплохо бы переделать.
        if ( true === bCheckEnd && Pos > 0 )
        {
            while ( this.Content[Pos - 1].Type === para_TextPr || this.Content[Pos - 1].Type === para_HyperlinkEnd )
            {
                Pos--;

                if ( Pos <= 0 )
                    return null;
            }
        }

        var Find = this.Internal_FindBackward( Pos - 1, [para_HyperlinkStart, para_HyperlinkEnd] );
        if ( true === Find.Found && para_HyperlinkStart === Find.Type )
            return this.Content[Find.LetterPos];

        return null;
    },

    Hyperlink_Add : function(HyperProps)
    {
        var Hyperlink = new ParaHyperlinkStart();
        Hyperlink.Set_Value( HyperProps.Value );

        if ( "undefined" != typeof(HyperProps.ToolTip) && null != HyperProps.ToolTip )
            Hyperlink.Set_ToolTip( HyperProps.ToolTip );

        if ( true === this.Selection.Use )
        {
            this.Add( Hyperlink );
        }
        else if ( null != HyperProps.Text && "" != HyperProps.Text ) // добавлять ссылку, без селекта и с пустым текстом нельзя
        {
            var TextPr_hyper = this.Internal_GetTextPr(this.CurPos.ContentPos);
            TextPr_hyper.Color     = new CDocumentColor( 0, 0, 255 );
            TextPr_hyper.Underline = true;

            var TextPr_old = this.Internal_GetTextPr(this.CurPos.ContentPos);

            var Pos = this.CurPos.ContentPos;
            this.Internal_Content_Add( Pos, new ParaTextPr( TextPr_old ) );
            this.Internal_Content_Add( Pos, new ParaHyperlinkEnd() );
            this.Internal_Content_Add( Pos, new ParaTextPr( TextPr_hyper ) );
            this.Internal_Content_Add( Pos, Hyperlink );

            for ( var NewPos = 0; NewPos < HyperProps.Text.length; NewPos++ )
            {
                var Char = HyperProps.Text.charAt( NewPos );
                if ( " " == Char )
                    this.Internal_Content_Add( Pos + 2 + NewPos, new ParaSpace() );
                else
                    this.Internal_Content_Add( Pos + 2 + NewPos, new ParaText(Char) );
            }

            this.CurPos.ContentPos = Pos + 2; // чтобы курсор встал после TextPr
        }
    },

    Hyperlink_Modify : function(HyperProps)
    {
        var Hyperlink = null;
        var Pos = -1;
        if ( true === this.Selection.Use )
        {
            var Hyper_start = this.Check_Hyperlink2( this.Selection.StartPos );
            var Hyper_end   = this.Check_Hyperlink2( this.Selection.EndPos   );

            if ( null != Hyper_start && Hyper_start === Hyper_end )
            {
                Hyperlink = Hyper_start;
                Pos       = this.Selection.StartPos;
            }
        }
        else
        {
            Hyperlink = this.Check_Hyperlink2( this.CurPos.ContentPos );
            Pos       = this.CurPos.ContentPos;
        }

        if ( null != Hyperlink )
        {
            if ( "undefined" != typeof( HyperProps.Value) && null != HyperProps.Value )
                Hyperlink.Set_Value( HyperProps.Value );

            if ( "undefined" != typeof( HyperProps.ToolTip) && null != HyperProps.ToolTip )
                Hyperlink.Set_ToolTip( HyperProps.ToolTip );

            if ( null != HyperProps.Text )
            {
                var Find = this.Internal_FindBackward( Pos, [para_HyperlinkStart, para_HyperlinkEnd] );
                if ( true != Find.Found || para_HyperlinkStart != Find.Type )
                    return false;

                var Start = Find.LetterPos;

                var Find = this.Internal_FindForward( Pos, [para_HyperlinkStart, para_HyperlinkEnd] );
                if ( true != Find.Found || para_HyperlinkEnd != Find.Type )
                    return false;

                var End = Find.LetterPos;

                var TextPr = this.Internal_GetTextPr(End);
                TextPr.Color     = new CDocumentColor( 0, 0, 255 );
                TextPr.Underline = true;

                // TODO: тут не должно быть картинок, но все-таки если будет такая ситуация,
                //       тогда надо будет убрать записи о картинках.
                this.Internal_Content_Remove2( Start + 1, End - Start - 1 );
                this.Internal_Content_Add( Start + 1, new ParaTextPr( TextPr ) );
                for ( var NewPos = 0; NewPos < HyperProps.Text.length; NewPos++ )
                {
                    var Char = HyperProps.Text.charAt( NewPos );
                    if ( " " == Char )
                        this.Internal_Content_Add( Start + 2 + NewPos, new ParaSpace() );
                    else
                        this.Internal_Content_Add( Start + 2 + NewPos, new ParaText(Char) );
                }

                if ( true === this.Selection.Use )
                {
                    this.Selection.StartPos = Start + 1;
                    this.Selection.EndPos   = Start + 2 + HyperProps.Text.length;
                    this.CurPos.ContentPos  = this.Selection.EndPos;
                }
                else
                    this.CurPos.ContentPos  = Start + 2; // чтобы курсор встал после TextPr

                return true;
            }

            return false;
        }

        return false;
    },

    Hyperlink_Remove : function()
    {
        var Pos = -1;
        if ( true === this.Selection.Use )
        {
            var Hyper_start = this.Check_Hyperlink2( this.Selection.StartPos );
            var Hyper_end   = this.Check_Hyperlink2( this.Selection.EndPos   );

            if ( null != Hyper_start && Hyper_start === Hyper_end )
                Pos = this.Selection.StartPos;
        }
        else
        {
            var Hyper_cur = this.Check_Hyperlink2( this.CurPos.ContentPos );
            if ( null != Hyper_cur )
                Pos = this.CurPos.ContentPos;
        }

        if ( -1 != Pos )
        {
            var Find = this.Internal_FindForward( Pos, [para_HyperlinkStart, para_HyperlinkEnd] );
            if ( true === Find.Found && para_HyperlinkEnd === Find.Type )
                this.Internal_Content_Remove( Find.LetterPos );

            var EndPos = Find.LetterPos - 2;

            Find = this.Internal_FindBackward( Pos, [para_HyperlinkStart, para_HyperlinkEnd] );
            if ( true === Find.Found && para_HyperlinkStart === Find.Type )
                this.Internal_Content_Remove( Find.LetterPos );

            var StartPos = Find.LetterPos;

            // TODO: когда появятся стили текста, тут надо будет переделать
            for ( var Index = StartPos; Index <= EndPos; Index++ )
            {
                var Item = this.Content[Index];
                if ( para_TextPr === Item.Type )
                {
                    Item.Set_Color( undefined );
                    Item.Set_Underline( undefined );
                }
            }

            this.ReDraw();
            return true;
        }

        return false;
    },

    Hyperlink_CanAdd : function()
    {
        if ( true === this.Selection.Use )
        {
            // Если у нас в выделение попадает начало или конец гиперссылки, или конец параграфа, или
            // у нас все выделение находится внутри гиперссылки, тогда мы не можем добавить новую. Во
            // всех остальных случаях разрешаем добавить.

            var StartPos = this.Selection.StartPos;
            var EndPos   = this.Selection.EndPos;
            if ( EndPos < StartPos )
            {
                StartPos = this.Selection.EndPos;
                EndPos   = this.Selection.StartPos;
            }

            // Проверяем не находимся ли мы внутри гиперссылки
            var Find = this.Internal_FindBackward( StartPos, [para_HyperlinkStart, para_HyperlinkEnd] );
            if ( true === Find.Found && para_HyperlinkStart === Find.Type )
                return false;

            for ( var Pos = StartPos; Pos < EndPos; Pos++ )
            {
                var Item = this.Content[Pos];
                switch ( Item.Type )
                {
                    case para_HyperlinkStart:
                    case para_HyperlinkEnd:
                    case para_End:
                            return false;
                }
            }

            return true;
        }
        else
        {
            // Внутри гиперссылки мы не можем задать ниперссылку
            var Hyper_cur = this.Check_Hyperlink2( this.CurPos.ContentPos );
            if ( null != Hyper_cur )
                return false;
            else
                return true;
        }
    },

    Hyperlink_Check : function(bCheckEnd)
    {
        if ( true === this.Selection.Use )
        {
            var Hyper_start = this.Check_Hyperlink2( this.Selection.StartPos );
            var Hyper_end   = this.Check_Hyperlink2( this.Selection.EndPos );

            if ( Hyper_start === Hyper_end && null != Hyper_start )
                return Hyper_start
        }
        else
        {
            var Hyper_cur = this.Check_Hyperlink2( this.CurPos.ContentPos, bCheckEnd );
            if ( null != Hyper_cur )
                return Hyper_cur;
        }

        return null;
    },

    Cursor_MoveAt : function(X,Y, bLine, bDontChangeRealPos, PageNum)
    {
        var Pos = this.Internal_GetContentPosByXY( X, Y, bLine, PageNum ).Pos;

        if ( -1 != Pos )
            this.CurPos.ContentPos = Pos;

        this.Internal_Recalculate_2(Pos, false);

        if ( bDontChangeRealPos != true )
        {
            this.CurPos.RealX = this.CurPos.X;
            this.CurPos.RealY = this.CurPos.Y;
        }

        if ( true != bLine )
        {
            this.CurPos.RealX = X;
            this.CurPos.RealY = Y;
        }
    },

    Selection_SetStart : function(X,Y,PageNum, bTableBorder)
    {
        var Pos = this.Internal_GetContentPosByXY( X, Y, false, PageNum );
        if ( -1 != Pos.Pos )
        {
            if ( true === Pos.End )
                this.Selection.StartPos = Pos.Pos + 1;
            else
                this.Selection.StartPos = Pos.Pos;

            this.CurPos.ContentPos = Pos.Pos;

            this.Selection.Use      = true;
            this.Selection.Start    = true;
            this.Selection.Flag     = selectionflag_Common;

        }
    },

    // Данная функция может использоваться как при движении, так и при окончательном выставлении селекта.
    // Если bEnd = true, тогда это конец селекта.
    Selection_SetEnd : function(X,Y,PageNum, MouseEvent, bTableBorder)
    {
        this.CurPos.RealX = X;
        this.CurPos.RealY = Y;
        var Temp = this.Internal_GetContentPosByXY( X, Y, false, PageNum );
        var Pos  = Temp.Pos;
        if ( -1 != Pos.Pos )
        {
            if ( true === Temp.End )
                this.Selection.EndPos = Pos + 1;
            else
                this.Selection.EndPos = Pos;

            if ( this.Selection.EndPos == this.Selection.StartPos && g_mouse_event_type_up === MouseEvent.Type )
            {
                var NumPr = this.Numbering_Get();
                if ( true === Temp.Numbering && undefined != NumPr )
                {
                    // Ставим именно 0, а не this.Internal_GetStartPos(), чтобы при нажатии на клавишу "направо"
                    // мы оказывались в начале параграфа.
                    this.CurPos.ContentPos = 0;
                    this.Parent.Document_SelectNumbering( NumPr );
                }
                else
                {
                    var Temp2 = MouseEvent.ClickCount % 2;

                    if ( 1 >= MouseEvent.ClickCount )
                    {
                        this.Selection_Remove();
                        this.Selection.Use = false;

                        this.CurPos.ContentPos = Pos;
                        this.RecalculateCurPos();

                        return;
                    }
                    else if ( 0 == Temp2 )
                    {
                        var oStart;
                        if ( this.Content[Pos].Type == para_Space )
                        {
                            oStart = this.Internal_FindBackward( Pos, [ para_Text, para_NewLine ] );
                            if ( !oStart.Found )
                                oStart.LetterPos = this.Internal_GetStartPos();
                            else if ( oStart.Type == para_NewLine )
                            {
                                oStart.LetterPos++; // смещаемся на начало следующей строки
                            }
                            else
                            {
                                oStart = this.Internal_FindBackward( oStart.LetterPos, [ para_Tab, para_Space, para_NewLine ] );
                                if ( !oStart.Found )
                                    oStart.LetterPos = this.Internal_GetStartPos();
                                else
                                {
                                    oStart = this.Internal_FindForward( oStart.LetterPos, [ para_Text ] );
                                    if ( !oStart.Found )
                                        oStart.LetterPos = this.Internal_GetStartPos();
                                }
                            }
                        }
                        else
                        {
                            oStart = this.Internal_FindBackward( Pos, [ para_Tab, para_Space, para_NewLine ] );
                            if ( !oStart.Found )
                                oStart.LetterPos = this.Internal_GetStartPos();
                            else
                            {
                                oStart = this.Internal_FindForward( oStart.LetterPos, [ para_Text, para_NewLine ] );
                                if ( !oStart.Found )
                                    oStart.LetterPos = this.Internal_GetStartPos();
                            }
                        }

                        var oEnd = this.Internal_FindForward( Pos, [ para_Tab, para_Space, para_NewLine ] );
                        if ( !oEnd.Found )
                            oEnd.LetterPos = this.Content.length - 1;
                        else if ( oEnd.Type != para_NewLine ) // при переносе строки селектим все до переноса строки
                        {
                            oEnd = this.Internal_FindForward( oEnd.LetterPos, [ para_Text ] );
                            if ( !oEnd.Found )
                                oEnd.LetterPos = this.Content.length - 1;
                        }
                        this.Selection.StartPos = oStart.LetterPos;
                        this.Selection.EndPos   = oEnd.LetterPos;
                        this.Selection.Use = true;
                    }
                    else // ( 1 == Temp2 % 3 )
                    {
                        // Селектим параграф целиком
                        this.Selection.StartPos = this.Internal_GetStartPos();
                        this.Selection.EndPos   = this.Content.length - 1;
                        this.Selection.Use      = true;
                    }
                }
            }
        }

        if ( -1 === this.Selection.EndPos )
        {
            //Temp = this.Internal_GetContentPosByXY( X, Y, false, PageNum );
            return;
        }
    },

    Selection_Stop : function(X,Y,PageNum, MouseEvent)
    {
        this.Selection.Start = false;
    },

    Selection_Remove : function()
    {
        this.Selection.Use = false;
        this.Selection.Flag = selectionflag_Common;
        this.Selection_Clear();
    },

    Selection_Clear : function()
    {
        /*
         // Удаляем весь селект
         for ( var Index = 0; Index < this.Selection.SelectIds.length; Index++ )
         {
         var Div = document.getElementById(this.Selection.SelectIds[Index]);
         document.body.removeChild(Div);
         }
         this.Selection.SelectIds.length = 0;
         */
    },

    Selection_Draw : function()
    {
        var StartPage = this.Get_StartPage_Absolute();

        if ( true === this.Selection.Use )
        {
            switch ( this.Selection.Flag )
            {
                case selectionflag_Common:
                {
                    /*
                     var PNum = 0;
                     if ( "number" == typeof(g_CurPage) )
                     {
                     PNum = g_CurPage - this.PageNum;
                     }
                     else
                     PNum = 0;
                     */

                    // Делаем подсветку
                    var StartPos = this.Selection.StartPos;
                    var EndPos   = this.Selection.EndPos;

                    if ( StartPos > EndPos )
                    {
                        var Temp = EndPos;
                        EndPos   = StartPos;
                        StartPos = Temp;
                    }

                    // Найдем линию, с которой начинается селект, и посчитаем начальный сдвиг
                    var CurLine = 0;
                    var CurRange = 0;
                    var StartX = 0;
                    var Pos, Item;
                    for ( Pos = StartPos - 1; Pos >= 0; Pos-- )
                    {
                        Item = this.Content[Pos];
                        if ( ( Item.Type == para_NewLine && true === Item.Is_NewLine() ) || Item.Type == para_NewLineRendered )
                            CurLine++;
                        else if ( 0 == CurLine && Item.Type == para_InlineBreak )
                            CurRange++;

                        if ( 0 == CurLine && 0 == CurRange )
                        {
                            if ( "undefined" != typeof(Item.Width) )
                                StartX += Item.WidthVisible;
                        }
                    }

                    var PNum = 0;
                    for ( ; PNum < this.Pages.length; PNum++ )
                    {
                        if ( PNum == this.Pages.length - 1 )
                            break;

                        if ( CurLine < this.Pages[PNum + 1].FirstLine )
                            break;
                    }

                    StartX += this.Lines[CurLine].Ranges[CurRange].XVisible;

                    if ( this.Pages[PNum].FirstLine > CurLine )
                    {
                        CurLine = this.Pages[PNum].FirstLine;
                        CurRange = 0;
                        StartX = this.Lines[CurLine].Ranges[CurRange].XVisible;


                        var PageBreak = PNum;
                        StartPos = 0;
                        while ( PageBreak > 0  && StartPos < this.Content.length  )
                        {
                            Item = this.Content[StartPos];
                            if ( para_PageBreakRendered == Item.Type || ( para_NewLine === Item.Type && break_Page === Item.BreakType && true === Item.Flags.NewLine ) )
                                PageBreak--;

                            StartPos++;
                        }
                    }

                    var StartY = this.Pages[PNum].Y + this.Lines[CurLine].Top;
                    var H      = this.Lines[CurLine].Bottom - this.Lines[CurLine].Top;

                    var W = 0;

                    for ( Pos = StartPos; Pos < EndPos; Pos++ )
                    {
                        Item = this.Content[Pos];
                        if ( "undefined" != typeof(Item.Width) )
                            W += Item.WidthVisible;

                        if ( Item.Type == para_FlowObjectAnchor )
                        {
                            Item.FlowObject.Select_This();
                        }

                        if ( ( Item.Type == para_NewLine && true === Item.Is_NewLine() ) || Item.Type == para_NewLineRendered || Item.Type == para_InlineBreak || Pos == EndPos - 1 )
                        {
                            this.DrawingDocument.AddPageSelection(StartPage + PNum, StartX, StartY, W, H);

                            /*
                             var Div = document.createElement("div");
                             Div.id                    = "" + this.Id + "_" + Pos;
                             Div.style.position        = "absolute";
                             Div.style.backgroundColor = "#36C";
                             Div.style.borderTop       = "0px solid #36C";
                             Div.style.borderBottom    = "0px solid #36C";
                             Div.style.opacity         = 0.20;
                             Div.style["-moz-opacity"] = 0.20;
                             Div.style.filter          = "alpha(opacity=20)";
                             Div.style.zIndex          = 20;
                             Div.style.top             = StartY + 100;
                             Div.style.left            = StartX + 50;
                             Div.style.width           = W;
                             Div.style.height          = H;
                             Div.style.cursor          = "Text";
                             Div.tabIndex              = 1;

                             Div.onfocus      = new Function("Canvas.Focus(); FocusCanv = true;");
                             Div.onclick      = new Function("e", "if (!e) e = event; Canvas.Focus(); Actions_CanvasClick(e);");
                             Div.onmousemove  = new Function("e", "if (!e) e = event; Actions_CanvasOnMove(e);");
                             Div.onmouseup    = new Function("e", "if (!e) e = event; Actions_CanvasMouseUp(e); Canvas.Focus();");
                             Div.onmousedown  = new Function("e", "if (!e) e = event; Actions_CanvasMouseDown(e); Canvas.Focus();");

                             document.body.appendChild( Div );
                             TempSelectIds.push( Div.id );
                             */

                            if ( ( Item.Type == para_NewLine && true === Item.Is_NewLine() ) || Item.Type == para_NewLineRendered )
                            {
                                CurLine++;
                                if ( PNum < this.Pages.length - 1 && CurLine == this.Pages[PNum + 1].FirstLine )
                                    PNum++;

                                CurRange = 0;
                                if ( CurLine < this.Lines.length )
                                {
                                    StartX = this.Lines[CurLine].Ranges[CurRange].XVisible;
                                    StartY = this.Pages[PNum].Y + this.Lines[CurLine].Top;
                                    H      = this.Lines[CurLine].Bottom - this.Lines[CurLine].Top;

                                    W = 0;
                                }
                            }
                            else if ( Item.Type == para_InlineBreak )
                            {
                                CurRange++;
                                StartX = this.Lines[CurLine].Ranges[CurRange].XVisible;
                                W = 0;
                            }
                        }
                    }

                    this.Selection_Clear();
                    break;
                }
                case  selectionflag_Numbering:
                {
                    var ParaNum = null;

                    var PNum = 0;
                    var CurRange = 0;
                    for ( ; PNum < this.Pages.length; PNum++ )
                    {
                        if ( PNum == this.Pages.length - 1 )
                            break;

                        if ( 0 < this.Pages[PNum + 1].FirstLine )
                            break;
                    }

                    for ( var Index = 0; Index < this.Content.length; Index++ )
                    {
                        if ( para_Numbering == this.Content[Index].Type )
                        {
                            ParaNum = this.Content[Index];
                            break;
                        }
                        else if ( para_InlineBreak == this.Content[Index].Type )
                            CurRange++;
                    }

                    var NumPr = this.Numbering_Get();
                    var SelectX = this.Lines[0].Ranges[CurRange].XVisible;
                    var SelectW = ParaNum.WidthVisible;
                    var NumJc = this.Parent.Get_Numbering().Get_AbstractNum( NumPr.NumId ).Lvl[NumPr.Lvl].Jc;
                    switch ( NumJc )
                    {
                        case align_Center:
                            SelectX = this.Lines[0].Ranges[CurRange].XVisible - ParaNum.WidthNum / 2;
                            SelectW = ParaNum.WidthVisible + ParaNum.WidthNum / 2;
                            break;
                        case align_Right:
                            SelectX = this.Lines[0].Ranges[CurRange].XVisible - ParaNum.WidthNum;
                            SelectW = ParaNum.WidthVisible + ParaNum.WidthNum;
                            break;
                        case align_Left:
                        default:
                            SelectX = this.Lines[0].Ranges[CurRange].XVisible;
                            SelectW = ParaNum.WidthVisible;
                            break;
                    }

                    this.DrawingDocument.AddPageSelection(StartPage + PNum, SelectX, this.Lines[0].Top + this.Pages[PNum].Y, SelectW, this.Lines[0].Bottom - this.Lines[0].Top);

                    break;
                }
            }
        }
    },

    Selection_Check : function(X, Y, Page_Abs)
    {
        var PageIndex = Page_Abs - this.Get_StartPage_Absolute();
        if ( PageIndex < 0 || PageIndex >= this.Pages.length || true != this.Selection.Use )
            return false;

        var Start = this.Selection.StartPos;
        var End   = this.Selection.EndPos;

        if ( Start > End )
        {
            Start = this.Selection.EndPos;
            End   = this.Selection.StartPos;
        }

        var ContentPos = this.Internal_GetContentPosByXY( X, Y, false, PageIndex + this.PageNum, false );
        if ( -1 != ContentPos.Pos && Start <= ContentPos.Pos && End >= ContentPos.Pos )
            return true;

        return false;
    },

    Selection_CalculateTextPr : function()
    {
        if ( true === this.Selection.Use || true === this.ApplyToAll )
        {
            var StartPos = this.Selection.StartPos;
            var EndPos   = this.Selection.EndPos;

            if ( true === this.ApplyToAll )
            {
                StartPos = 1;
                EndPos   = this.Content.length - 1;
            }

            if ( StartPos > EndPos )
            {
                var Temp = EndPos;
                EndPos   = StartPos;
                StartPos = Temp;
            }

            if ( EndPos >= this.Content.length )
                EndPos = this.Content.length - 1;
            if ( StartPos < 0 )
                StartPos = 1;

            if ( StartPos == EndPos )
                return this.Internal_CalculateTextPr( StartPos );

            while ( this.Content[StartPos].Type == para_TextPr )
                StartPos++;

            var oEnd = this.Internal_FindBackward( EndPos - 1, [ para_Text, para_Space ] );

            if ( oEnd.Found )
                EndPos = oEnd.LetterPos;
            else
            {
                while ( this.Content[EndPos].Type == para_TextPr )
                    EndPos--;
            }

            // Рассчитаем стиль в начале селекта
            var TextPr_start = this.Internal_CalculateTextPr( StartPos );
            var TextPr_vis   = TextPr_start;

            for ( var Pos = StartPos + 1; Pos < EndPos; Pos++ )
            {
                var Item = this.Content[Pos];
                if ( para_TextPr == Item.Type && Pos < this.Content.length - 1 && para_TextPr != this.Content[Pos + 1].Type )
                {
                    // Рассчитываем настройки в данной позиции
                    var TextPr_cur = this.Internal_CalculateTextPr( Pos );
                    TextPr_vis = TextPr_vis.Compare( TextPr_cur );
                }
            }

            return TextPr_vis;
        }
    },

    Selection_SelectNumbering : function()
    {
        if ( undefined != this.Numbering_Get() )
        {
            this.Selection.Use  = true;
            this.Selection.Flag = selectionflag_Numbering;
        }
    },

    Select_All : function()
    {
        this.Selection.Use      = true;
        this.Selection.StartPos = this.Internal_GetStartPos();
        this.Selection.EndPos   = this.Content.length - 1;
    },

    // Возвращаем выделенный текст
    Get_SelectedText : function(bClearText)
    {
        if ( true === this.Selection.Use )
        {
            var StartPos = this.Selection.StartPos;
            var EndPos   = this.Selection.EndPos;

            if ( EndPos < StartPos )
            {
                StartPos = this.Selection.EndPos;
                EndPos   = this.Selection.StartPos;
            }

            var Str = "";

            for ( var Pos = StartPos; Pos < EndPos; Pos++ )
            {
                var Item = this.Content[Pos];

                switch ( Item.Type )
                {
                    case para_Drawing:
                    case para_End:
                    case para_Numbering:
                    case para_PresentationNumbering:
                    case para_PageNum:
                    {
                        if ( true === bClearText )
                            return null;

                        break;
                    }

                    case para_Text : Str += Item.Value; break;
                    case para_Space:
                    case para_Tab  : Str += " "; break;
                }
            }

            return Str;
        }

        return "";
    },

    Get_SelectedElementsInfo : function(Info)
    {
    },

    // Проверяем пустой ли параграф
    IsEmpty : function()
    {
        var Pos = this.Internal_FindForward( 0, [para_Tab, para_Drawing, para_PageNum, para_Text, para_Space, para_NewLine] );
        return ( Pos.Found === true ? false : true );
    },

    Is_UseInDocument : function()
    {
        if ( null != this.Parent )
           return this.Parent.Is_UseInDocument(this.Get_Id());

        return false;
    },

    // Проверяем пустой ли селект
    Selection_IsEmpty : function()
    {
        // TODO: при добавлении новых элементов в параграф, добавить их сюда
        if ( true === this.Selection.Use )
        {
            var StartPos = this.Selection.StartPos;
            var EndPos   = this.Selection.EndPos;

            if ( StartPos > EndPos )
            {
                var Temp = EndPos;
                EndPos   = StartPos;
                StartPos = Temp;
            }

            var Pos = this.Internal_FindForward( StartPos, [para_PageNum, para_Drawing, para_Tab, para_Text, para_Space, para_NewLine, para_End] );
            if ( true != Pos.Found )
                return true;

            if ( Pos.LetterPos >= EndPos )
                return true;

            return false;
        }

        return true;
    },

//-----------------------------------------------------------------------------------
// Функции для работы с нумерацией параграфов в документах
//-----------------------------------------------------------------------------------

    // Добавляем нумерацию к данному параграфу
    Numbering_Add : function(NumId, Lvl)
    {
        var NumPr_old = this.Numbering_Get();

        this.Numbering_Remove();

        this.Pr.NumPr = new CNumPr();
        this.Pr.NumPr.Set( NumId, Lvl );

        History.Add( this, { Type : historyitem_Paragraph_Numbering, Old : NumPr_old, New : this.Pr.NumPr } );

        if ( undefined != this.Pr.Ind )
        {
            History.Add( this, { Type : historyitem_Paragraph_Ind_First, Old : ( undefined != this.Pr.Ind.FirstLine ? this.Pr.Ind.FirstLine : undefined ), New : undefined } );
            History.Add( this, { Type : historyitem_Paragraph_Ind_Left,  Old : ( undefined != this.Pr.Ind.Left      ? this.Pr.Ind.Left      : undefined ), New : undefined } );

            // При добавлении списка в параграф, удаляем все собственные сдвиги
            this.Pr.Ind.FirstLine = undefined;
            this.Pr.Ind.Left      = undefined;
        }

        // Если у параграфа выставлен стиль, тогда не меняем его, если нет, тогда выставляем стандартный
        // стиль для параграфа с нумерацией.
        if ( undefined === this.Style_Get() )
        {
            this.Style_Add( this.Get_Styles().Get_Default_ParaList() );
        }

        // Надо пересчитать конечный стиль
        this.CompiledPr.NeedRecalc = true;
    },

    // Добавление нумерации в параграф при открытии и копировании
    Numbering_Add_Open : function(NumId, Lvl)
    {
        this.Pr.NumPr = new CNumPr();
        this.Pr.NumPr.Set( NumId, Lvl );

        // Надо пересчитать конечный стиль
        this.CompiledPr.NeedRecalc = true;
    },

    Numbering_Get : function()
    {
        var NumPr = this.Get_CompiledPr2(false).ParaPr.NumPr;
        if ( undefined != NumPr )
            return NumPr.Copy();

        return undefined;
    },

    // Удаляем нумерацию
    Numbering_Remove : function()
    {
        // Если у нас была задана нумерации в стиле, тогда чтобы ее отменить(не удаляя нумерацию в стиле)
        // мы проставляем NumPr с NumId undefined
        var NewNumPr = undefined;
        if ( undefined != this.CompiledPr.Pr.ParaPr.StyleNumPr )
        {
            NewNumPr = new CNumPr();
            NewNumPr.Set( undefined, 0 );
        }

        History.Add( this, { Type : historyitem_Paragraph_Numbering, Old : undefined != this.Pr.NumPr ? this.Pr.NumPr : undefined, New : NewNumPr } );
        this.Pr.NumPr = NewNumPr;

        if ( undefined != this.Pr.Ind )
        {
            // При удалении нумерации из параграфа, если отступ первой строки > 0, тогда
            // увеличиваем левый отступ параграфа, а первую сторку  делаем 0, а если отступ
            // первой строки < 0, тогда просто делаем оступ первой строки 0.

            if ( undefined != this.Pr.Ind.FirstLine && this.Pr.Ind.FirstLine < 0 )
            {
                History.Add( this, { Type : historyitem_Paragraph_Ind_First, New : 0, Old : this.Pr.Ind.FirstLine } );
                this.Pr.Ind.FirstLine = 0;
            }

            if ( undefined != this.Pr.Ind.FirstLine && undefined != this.Pr.Ind.Left && this.Pr.Ind.FirstLine > 0 )
            {
                History.Add( this, { Type : historyitem_Paragraph_Ind_Left,  New : this.Pr.Ind.Left + this.Pr.Ind.FirstLine, Old : this.Pr.Ind.Left } );
                History.Add( this, { Type : historyitem_Paragraph_Ind_First, New : 0, Old : this.Pr.Ind.FirstLine } );
                this.Pr.Ind.Left += this.Pr.Ind.FirstLine;
                this.Pr.Ind.FirstLine = 0;
            }
        }

        // При удалении проверяем стиль. Если данный стиль является стилем по умолчанию
        // для параграфов с нумерацией, тогда удаляем запись и о стиле.
        var StyleId = this.Style_Get();
        var NumStyleId = this.Get_Styles().Get_Default_ParaList();
        if ( StyleId === NumStyleId )
            this.Style_Remove();

        // Надо пересчитать конечный стиль
        this.CompiledPr.NeedRecalc = true;
    },

    // Используется ли заданная нумерация в параграфе
    Numbering_IsUse: function(NumId, Lvl)
    {
        var bLvl = (undefined === Lvl ? false : true);

        var NumPr = this.Numbering_Get();
        if ( undefined != NumPr && NumId === NumPr.NumId && ( false === bLvl || Lvl === NumPr.Lvl ) )
            return true;

        return false;
    },

//-----------------------------------------------------------------------------------
// Функции для работы с нумерацией параграфов в презентациях
//-----------------------------------------------------------------------------------
    // Добавляем нумерацию к данному параграфу
    Add_PresentationNumbering : function(_Bullet)
    {
        var Bullet = _Bullet.Copy();

        History.Add( this, { Type : historyitem_Paragraph_PresentationPr_Bullet, New : Bullet, Old : this.PresentationPr.Bullet } );

        var OldType = this.PresentationPr.Bullet.Get_Type();
        var NewType = Bullet.Get_Type();
        this.PresentationPr.Bullet = Bullet;

        if ( numbering_presentationnumfrmt_None != NewType )
        {
            if ( numbering_presentationnumfrmt_None === OldType )
            {
                // Добавляем также специальные знаки в начало параграфа
                this.Internal_Content_Add( 0, new ParaPresentationNumbering(Bullet) );
            }
        }
        else
        {
            // Ищем элемент с типом para_PresentationNumbering и удаляем его
            for ( var Index = 0; Index < this.Content.length; Index++ )
            {
                if ( this.Content[Index].Type == para_PresentationNumbering )
                {
                    this.Internal_Content_Remove( Index );
                    break;
                }
            }
        }
        this.RecalcInfo.Set_Type_0(pararecalc_0_All);

    },

    Add_PresentationNumbering2 : function(_Bullet)
    {
        var Bullet = _Bullet.Copy();

        History.Add( this, { Type : historyitem_Paragraph_PresentationPr_Bullet, New : Bullet, Old : this.PresentationPr.Bullet } );

        var OldType = this.PresentationPr.Bullet.Get_Type();
        var NewType = Bullet.Get_Type();
        this.PresentationPr.Bullet = Bullet;

        if ( numbering_presentationnumfrmt_None != NewType )
        {
            if ( numbering_presentationnumfrmt_None === OldType )
            {
                // Добавляем также специальные знаки в начало параграфа
                this.Internal_Content_Add( 0, new ParaPresentationNumbering(Bullet) );
            }
        }
        else
        {
            // Ищем элемент с типом para_PresentationNumbering и удаляем его
            for ( var Index = 0; Index < this.Content.length; Index++ )
            {
                if ( this.Content[Index].Type == para_PresentationNumbering )
                {
                    this.Internal_Content_Remove( Index );
                    break;
                }
            }
        }

        if ( OldType != NewType )
        {
            var ParaPr = this.Get_CompiledPr2(false).ParaPr;
            var LeftInd = Math.min( ParaPr.Ind.Left, ParaPr.Ind.Left + ParaPr.Ind.FirstLine );

            if ( numbering_presentationnumfrmt_None === NewType )
            {
                this.Set_Ind( { FirstLine : 0, Left : LeftInd } );
            }
            else if ( numbering_presentationnumfrmt_RomanLcPeriod === NewType || numbering_presentationnumfrmt_RomanUcPeriod === NewType )
            {
                this.Set_Ind( { Left : LeftInd + 15.9, FirstLine : -15.9 } );
            }
            else
            {
                this.Set_Ind( { Left : LeftInd + 14.3, FirstLine : -14.3 } );
            }
        }
        this.RecalcInfo.Set_Type_0(pararecalc_0_All);
    },

    Get_PresentationNumbering : function()
    {
        return this.PresentationPr.Bullet;
    },

    // Удаляем нумерацию
    Remove_PresentationNumbering : function()
    {
        this.Add_PresentationNumbering( new CPresentationBullet() );
    },

    Set_PresentationLevel : function(Level)
    {
        if ( this.PresentationPr.Level != Level )
        {
            History.Add( this, { Type : historyitem_Paragraph_PresentationPr_Level, Old : this.PresentationPr.Level, New : Level } );
            this.PresentationPr.Level = Level;
            this.RecalcInfo.Set_Type_0(pararecalc_0_All);
            this.Recalc_CompiledPr();
        }
    },
//-----------------------------------------------------------------------------------

    // Формируем конечные свойства параграфа на основе стиля, возможной нумерации и прямых настроек.
    // Также учитываем настройки предыдущего и последующего параграфов.
    Get_CompiledPr : function()
    {
        var Pr = this.Get_CompiledPr2();

        // При формировании конечных настроек параграфа, нужно учитывать предыдущий и последующий
        // параграфы. Например, для формирования интервала между параграфами.
        // max(Prev.After, Cur.Before) - реальное значение расстояния между параграфами.
        // Поэтому Prev.After = Prev.After (значение не меняем), а вот Cur.Before = max(Prev.After, Cur.Before) - Prev.After

        var StyleId = this.Style_Get();
        var PrevEl  = this.Get_DocumentPrev();
        var NextEl  = this.Get_DocumentNext();
        var NumPr   = this.Numbering_Get();

        if ( null != PrevEl && type_Paragraph === PrevEl.GetType() )
        {
            var PrevStyle      = PrevEl.Style_Get();
            var Prev_Pr        = PrevEl.Get_CompiledPr2(false).ParaPr;
            var Prev_After     = Prev_Pr.Spacing.After;
            var Prev_AfterAuto = Prev_Pr.Spacing.AfterAutoSpacing;
            var Cur_Before     = Pr.ParaPr.Spacing.Before;
            var Cur_BeforeAuto = Pr.ParaPr.Spacing.BeforeAutoSpacing;
            var Prev_NumPr     = PrevEl.Numbering_Get();

            if ( PrevStyle === StyleId && true === Pr.ParaPr.ContextualSpacing )
            {
                Pr.ParaPr.Spacing.Before = 0;
            }
            else
            {
                if ( true === Cur_BeforeAuto && PrevStyle === StyleId && undefined != Prev_NumPr && undefined != NumPr && Prev_NumPr.NumId === NumPr.NumId )
                    Pr.ParaPr.Spacing.Before = 0;
                else
                {
                    Cur_Before = this.Internal_CalculateAutoSpacing( Cur_Before, Cur_BeforeAuto, this );
                    Prev_After = this.Internal_CalculateAutoSpacing( Prev_After, Prev_AfterAuto, this );

                    Pr.ParaPr.Spacing.Before = Math.max( Prev_After, Cur_Before ) - Prev_After;
                }
            }

            if ( false === this.Internal_Is_NullBorders(Pr.ParaPr.Brd) && true === this.Internal_CompareBrd( Prev_Pr, Pr.ParaPr ) )
                Pr.ParaPr.Brd.First = false;
            else
                Pr.ParaPr.Brd.First = true;
        }
        else if ( null === PrevEl )
        {
            if ( true === Pr.ParaPr.Spacing.BeforeAutoSpacing )
            {
                Pr.ParaPr.Spacing.Before = 0;
            }
            if(this.Parent.Is_TableCellContent())
            {
                Pr.ParaPr.Spacing.Before = 0;
            }
        }
        else if ( type_Table === PrevEl.GetType() )
        {
            if ( true === Pr.ParaPr.Spacing.BeforeAutoSpacing )
            {
                Pr.ParaPr.Spacing.Before = 14 * g_dKoef_pt_to_mm;
            }
        }

        if ( null != NextEl )
        {
            if ( type_Paragraph === NextEl.GetType() )
            {
                var NextStyle       = NextEl.Style_Get();
                var Next_Pr         = NextEl.Get_CompiledPr2(false).ParaPr;
                var Next_Before     = Next_Pr.Spacing.Before;
                var Next_BeforeAuto = Next_Pr.Spacing.BeforeAutoSpacing;
                var Cur_After       = Pr.ParaPr.Spacing.After;
                var Cur_AfterAuto   = Pr.ParaPr.Spacing.AfterAutoSpacing;
                var Next_NumPr      = NextEl.Numbering_Get();

                if ( NextStyle === StyleId && true === Pr.ParaPr.ContextualSpacing )
                {
                    Cur_After   = this.Internal_CalculateAutoSpacing( Cur_After,   Cur_AfterAuto,   this );
                    Next_Before = this.Internal_CalculateAutoSpacing( Next_Before, Next_BeforeAuto, this );

                    Pr.ParaPr.Spacing.After = Math.max( Next_Before, Cur_After ) - Cur_After;
                }
                else
                {
                    if ( true === Cur_AfterAuto && NextStyle === StyleId && undefined != Next_NumPr && undefined != NumPr && Next_NumPr.NumId === NumPr.NumId )
                        Pr.ParaPr.Spacing.After = 0;
                    else
                    {
                        Pr.ParaPr.Spacing.After = this.Internal_CalculateAutoSpacing( Cur_After, Cur_AfterAuto, this );
                    }
                }

                if ( false === this.Internal_Is_NullBorders(Pr.ParaPr.Brd) && true === this.Internal_CompareBrd( Next_Pr, Pr.ParaPr ) )
                    Pr.ParaPr.Brd.Last = false;
                else
                    Pr.ParaPr.Brd.Last = true;
            }
            else if ( type_Table === NextEl.GetType() )
            {
                var TableFirstParagraph = NextEl.Get_FirstParagraph();
                var NextStyle           = TableFirstParagraph.Style_Get();
                var Next_Before         = TableFirstParagraph.Get_CompiledPr2(false).ParaPr.Spacing.Before;
                var Next_BeforeAuto     = TableFirstParagraph.Get_CompiledPr2(false).ParaPr.Spacing.BeforeAutoSpacing;
                var Cur_After           = Pr.ParaPr.Spacing.After;
                var Cur_AfterAuto       = Pr.ParaPr.Spacing.AfterAutoSpacing;
                if ( NextStyle === StyleId && true === Pr.ParaPr.ContextualSpacing )
                {
                    Cur_After   = this.Internal_CalculateAutoSpacing( Cur_After,   Cur_AfterAuto,   this );
                    Next_Before = this.Internal_CalculateAutoSpacing( Next_Before, Next_BeforeAuto, this );

                    Pr.ParaPr.Spacing.After = Math.max( Next_Before, Cur_After ) - Cur_After;
                }
                else
                {
                    Pr.ParaPr.Spacing.After = this.Internal_CalculateAutoSpacing( Pr.ParaPr.Spacing.After, Cur_AfterAuto, this );
                }
            }
        }
        else
        {
            Pr.ParaPr.Spacing.After = this.Internal_CalculateAutoSpacing( Pr.ParaPr.Spacing.After, Pr.ParaPr.Spacing.AfterAutoSpacing, this );
            if(this.Parent.Is_TableCellContent())
            {
                Pr.ParaPr.Spacing.After = 0;
            }
        }

        return Pr;
    },

    Recalc_CompiledPr : function()
    {
        this.CompiledPr.NeedRecalc = true;
    },

    // Формируем конечные свойства параграфа на основе стиля, возможной нумерации и прямых настроек.
    // Без пересчета расстояния между параграфами.
    Get_CompiledPr2 : function(bCopy)
    {
        if ( true === this.CompiledPr.NeedRecalc )
        {
            this.CompiledPr.Pr = this.Internal_CompileParaPr();
            this.CompiledPr.NeedRecalc = false;
        }

        if ( false === bCopy )
            return this.CompiledPr.Pr;
        else
        {
            // Отдаем копию объекта, чтобы никто не поменял извне настройки скомпилированного стиля
            var Pr = {};
            Pr.TextPr = this.CompiledPr.Pr.TextPr.Copy();
            Pr.ParaPr = this.CompiledPr.Pr.ParaPr.Copy();
            return Pr;
        }
    },

    createCopy : function(parent)
    {
        var _copy_para = new Paragraph(this.DrawingDocument, parent, 0, 0, 0, 0, 0);
        //копироваие контента
        for(var _content_index = 0; _content_index < this.Content.length-2; ++_content_index)
        {
            _copy_para.Internal_Content_Add(_content_index, this.Content[_content_index].createDuplicate());
        }
        if(this.bullet != null)
        {
            _copy_para.bullet = this.bullet.createDuplicate();
        }
        _copy_para.Pr = this.Pr.Copy();
        _copy_para.rPr = clone(this.rPr);
        _copy_para.Remove_PresentationNumbering();
        _copy_para.Add_PresentationNumbering(this.PresentationPr.Bullet);
        _copy_para.PresentationPr.Level = this.PresentationPr.Level;
        return _copy_para;
    },

    Get_Styles : function()
    {
        var lvl = this.PresentationPr.Level;
        var Styles = this.Parent.Get_Styles(lvl, true);
       /* var paragraphStyle = new CStyle("paragraphStyle", Styles.Id-1, null, null);
        paragraphStyle.TextPr = this.rPr;
        paragraphStyle.ParaPr = this.Pr;
        Styles.Style[Styles.Id] = paragraphStyle;         */
        return Styles;
    },

    // Формируем конечные свойства параграфа на основе стиля, возможной нумерации и прямых настроек.
    Internal_CompileParaPr : function()
    {
        /* var NumPr   = this.Numbering_Get();
         var Styles  = this.Parent.Get_Styles();
         var StyleId = this.Style_Get();   */

        this.Parent.StyleCounter++;

        var Styles  = this.Get_Styles();
        var TableStyle = this.Parent.Get_TableStyleForPara();
        var StyleId;
        StyleId = Styles.Style.length-1;

        // Считываем свойства для текущего стиля
        var Pr = Styles.Get_Pr( StyleId, styles_Paragraph, TableStyle );

        // Копируем прямые настройки параграфа.
        Pr.ParaPr.Merge( this.Pr );
        Pr.TextPr.Merge( this.rPr );
        if(Pr.TextPr.unifill && Pr.TextPr.unifill.fill)
        {
            var _document_content_parent = this.Parent.Parent;

            var shape = _document_content_parent instanceof CTableCell ? _document_content_parent.Row.Table.Parent : _document_content_parent;

            if(/*shape instanceof CShape*/ true)//TODO :
            {
                var theme = null, master = null, layout = null, slide = null;
                if(shape.parent.kind == SLIDE_KIND)
                {
                    slide = shape.parent;
                    layout = shape.parent.Layout;
                    if(layout)
                    {
                        master = layout.Master;
                        if(master)
                        {
                            theme = master.Theme;
                        }
                    }
                }
                if(shape.parent.kind == LAYOUT_KIND)
                {
                    layout = shape.parent;
                    if(layout)
                    {
                        master = layout.Master;
                        if(master)
                        {
                            theme = master.Theme;
                        }
                    }
                }
                if(shape.parent.kind == MASTER_KIND)
                {
                    master = shape.parent;
                    if(master)
                    {
                        theme = master.Theme;
                    }
                }

                var brush = null;
                var RGBA = {R:0, G:0, B:0, A:255};
                if (theme && shape.style!=null && shape.style.fontRef!=null)
                {
                    brush = theme.getFillStyle(shape.style.fontRef.idx);
                    if(shape.style.fontRef.Color != null)
                    {
                        shape.style.fontRef.Color.Calculate(theme, slide, layout, master);
                        RGBA = shape.style.fontRef.Color.RGBA;
                        if (shape.style.fontRef.Color.color != null)
                        {
                            if (brush.fill != null && brush.fill.type == FILL_TYPE_SOLID)
                            {
                                brush.fill.color = shape.style.fontRef.Color.createDuplicate();
                            }
                        }
                    }
                }
                else
                {
                    brush = new CUniFill();
                }

                brush.merge(Pr.TextPr.unifill);
                brush.calculate(theme, slide, layout, master, RGBA);
                if( brush.fill && brush.fill.type === FILL_TYPE_SOLID && brush.fill.color && brush.fill.color.RGBA)
                {

                    Pr.TextPr.Color = {
                        r:brush.fill.color.RGBA.R,
                        g:brush.fill.color.RGBA.G,
                        b:brush.fill.color.RGBA.B,
                        A:brush.fill.color.RGBA.A
                    };
                }
                else if( brush.fill && brush.fill.type === FILL_TYPE_GRAD && brush.fill.colors &&  brush.fill.colors[0] && brush.fill.colors[0].color && brush.fill.colors[0].color.RGBA)
                {
                    Pr.TextPr.Color = {
                        r:brush.fill.colors[0].color.RGBA.R,
                        g:brush.fill.colors[0].color.RGBA.G,
                        b:brush.fill.colors[0].color.RGBA.B,
                        A:brush.fill.colors[0].color.RGBA.A
                    };
                }
            }
        }
        return Pr;
    },

    // Сообщаем параграфу, что ему надо будет пересчитать скомпилированный стиль
    // (Такое может случится, если у данного параграфа есть нумерация или задан стиль,
    //  которые меняются каким-то внешним образом)
    Recalc_CompileParaPr : function()
    {
        this.CompiledPr.NeedRecalc = true;
    },

    Internal_CalculateAutoSpacing : function(Value, UseAuto, Para)
    {
        var Result = Value;
        if ( true === UseAuto )
        {
            if ( true === Para.Parent.Is_TableCellContent() )
                Result = 0;
            else
                Result = 14 * g_dKoef_pt_to_mm;
        }

        return Result;
    },

    Get_Paragraph_ParaPr_Copy : function()
    {
        var ParaPr = this.Pr.Copy();
        return ParaPr;
    },

    Paragraph_Format_Paste : function(TextPr, ParaPr, ApplyPara)
    {
        // Применяем текстовые настройки всегда
        if ( null != TextPr )
            this.Add( new ParaTextPr( TextPr ) );

        var _ApplyPara = ApplyPara;
        if ( false === _ApplyPara )
        {
            if ( true === this.Selection.Use )
            {
                _ApplyPara = true;

                var Start = this.Selection.StartPos;
                var End   = this.Selection.EndPos;
                if ( Start > End )
                {
                    Start = this.Selection.EndPos;
                    End   = this.Selection.StartPos;
                }

                if ( true === this.Internal_FindForward( End, [para_PageNum, para_Drawing, para_Tab, para_Text, para_Space, para_NewLine, para_End]).Found )
                    _ApplyPara = false;
                else if ( true === this.Internal_FindBackward( Start - 1, [para_PageNum, para_Drawing, para_Tab, para_Text, para_Space, para_NewLine, para_End]).Found )
                    _ApplyPara = false;
            }
            else
                _ApplyPara = true;
        }

        // Применяем настройки параграфа
        if ( true === _ApplyPara && null != ParaPr )
        {
            // Ind
            if ( undefined != ParaPr.Ind )
                this.Set_Ind( ParaPr.Ind, false );

            // Jc
            if ( undefined != ParaPr.Jc )
                this.Set_Align( ParaPr.Jc );

            // Spacing
            if ( undefined != ParaPr.Spacing )
                this.Set_Spacing( ParaPr.Spacing, false );

            // PageBreakBefore
            if ( undefined != ParaPr.PageBreakBefore )
                this.Set_PageBreakBefore( ParaPr.PageBreakBefore );

            // KeepLines
            if ( undefined != ParaPr.KeepLines )
                this.Set_KeepLines( ParaPr.KeepLines );

            // ContextualSpacing
            if ( undefined != ParaPr.ContextualSpacing )
                this.Set_ContextualSpacing( ParaPr.ContextualSpacing );

            // Shd
            if ( undefined != ParaPr.Shd )
                this.Set_Shd( ParaPr.Shd, false );

            // StyleId
            if ( undefined != ParaPr.PStyle )
                this.Style_Add( ParaPr.PStyle, true );
            else
                this.Style_Remove();

            // NumPr
            if ( undefined != ParaPr.NumPr )
                this.Numbering_Add( ParaPr.NumPr.NumId, ParaPr.NumPr.Lvl );
            else
                this.Numbering_Remove();

            // Brd
            if ( undefined != ParaPr.Brd )
                this.Set_Borders( ParaPr.Brd );
        }
    },

    Style_Get : function()
    {
        if ( undefined != typeof(this.Pr.PStyle) )
            return this.Pr.PStyle;

        return undefined;
    },

    Style_Add : function(Id, bDoNotDeleteProps)
    {
        var Id_old = this.Pr.PStyle;
        if ( undefined === this.Pr.PStyle )
            Id_old = null;
        else
            this.Style_Remove();

        if ( null === Id )
            return;

        // Если стиль является стилем по умолчанию для параграфа, тогда не надо его записывать.
        if ( Id != this.Get_Styles().Get_Default_Paragraph() )
        {
            History.Add( this, { Type : historyitem_Paragraph_PStyle, Old : Id_old, New : Id } );
            this.Pr.PStyle = Id;
        }

        // Надо пересчитать конечный стиль
        this.CompiledPr.NeedRecalc = true;

        if ( true === bDoNotDeleteProps )
            return;

        // TODO: По мере добавления элементов в стили параграфа и текста добавить их обработку здесь.

        // Не удаляем форматирование, при добавлении списка к данному параграфу
        var DefNumId = this.Get_Styles().Get_Default_ParaList();
        if ( Id != DefNumId && ( Id_old != DefNumId || Id != this.Get_Styles().Get_Default_Paragraph() ) )
        {
            this.Set_ContextualSpacing( undefined );
            this.Set_Ind( new CParaInd(), true );
            this.Set_Align( undefined );
            this.Set_KeepLines( undefined );
            this.Set_KeepNext( undefined );
            this.Set_PageBreakBefore( undefined );
            this.Set_Spacing( new CParaSpacing(), true );
            this.Set_Shd( new CDocumentShd(), true );
            this.Set_WidowControl( undefined );
            this.Set_Tabs( new CParaTabs() );
            this.Set_Border( undefined, historyitem_Paragraph_Borders_Between );
            this.Set_Border( undefined, historyitem_Paragraph_Borders_Bottom );
            this.Set_Border( undefined, historyitem_Paragraph_Borders_Left );
            this.Set_Border( undefined, historyitem_Paragraph_Borders_Right );
            this.Set_Border( undefined, historyitem_Paragraph_Borders_Top );

            // При изменении стиля убираются только те текстовые настроки внутри параграфа,
            // которые присутствуют в стиле. Пока мы удалим вообще все настроки.
            // TODO : переделать
            for ( var Index = 0; Index < this.Content.length; Index++ )
            {
                var Item = this.Content[Index];

                if ( para_TextPr === Item.Type )
                {
                    this.Internal_Content_Remove( Index );
                    Index--;
                }
            }
        }
    },

    // Добавление стиля в параграф при открытии и копировании
    Style_Add_Open : function(Id)
    {
        this.Pr.PStyle = Id;

        // Надо пересчитать конечный стиль
        this.CompiledPr.NeedRecalc = true;
    },

    Style_Remove : function()
    {
        if ( undefined != this.Pr.PStyle )
        {
            History.Add( this, { Type : historyitem_Paragraph_PStyle, Old : this.Pr.PStyle, New : undefined } );
            this.Pr.PStyle = undefined;
        }

        // Надо пересчитать конечный стиль
        this.CompiledPr.NeedRecalc = true;
    },

    // Проверяем находится ли курсор в конце параграфа
    Cursor_IsEnd : function()
    {
        var oPos = this.Internal_FindForward( this.CurPos.ContentPos, [para_PageNum, para_Drawing, para_Tab, para_Text, para_Space, para_NewLine] );

        if ( true === oPos.Found )
            return false;
        else
            return true;
    },

    // Проверяем находится ли курсор в начале параграфа
    Cursor_IsStart : function()
    {
        var oPos = this.Internal_FindBackward( this.CurPos.ContentPos - 1, [para_PageNum, para_Drawing, para_Tab, para_Text, para_Space, para_NewLine] );
        if ( true === oPos.Found )
            return false;
        else
            return true;
    },

    // Очищение форматирования параграфа
    Clear_Formatting : function()
    {
        this.Style_Remove();
        this.Numbering_Remove();

        this.Set_ContextualSpacing(undefined);
        this.Set_Ind( new CParaInd(), true );
        this.Set_Align( undefined );
        this.Set_KeepLines( undefined );
        this.Set_KeepNext( undefined );
        this.Set_PageBreakBefore( undefined );
        this.Set_Spacing( new CParaSpacing(), true );
        this.Set_Shd( new CDocumentShd(), true );
        this.Set_WidowControl( undefined );
        this.Set_Tabs( new CParaTabs() );
        this.Set_Border( undefined, historyitem_Paragraph_Borders_Between );
        this.Set_Border( undefined, historyitem_Paragraph_Borders_Bottom );
        this.Set_Border( undefined, historyitem_Paragraph_Borders_Left );
        this.Set_Border( undefined, historyitem_Paragraph_Borders_Right );
        this.Set_Border( undefined, historyitem_Paragraph_Borders_Top );

        // Надо пересчитать конечный стиль
        this.CompiledPr.NeedRecalc = true;
        this.RecalcInfo.Set_Type_0(pararecalc_0_All);
    },

    Clear_TextFormatting : function()
    {
        // TODO: Сделать, чтобы данная функция работала по выделению
        for ( var Index = 0; Index < this.Content.length; Index++ )
        {
            var Item = this.Content[Index];
            if ( para_TextPr === Item.Type )
                this.Internal_Content_Remove( Index );
        }
        this.RecalcInfo.Set_Type_0(pararecalc_0_All);
    },

    Set_Ind : function(Ind, bDeleteUndefined)
    {
        if ( undefined === this.Pr.Ind )
            this.Pr.Ind = new CParaInd();

        if ( ( undefined != Ind.FirstLine || true === bDeleteUndefined ) && this.Pr.Ind.FirstLine !== Ind.FirstLine )
        {
            History.Add( this, { Type : historyitem_Paragraph_Ind_First, New : Ind.FirstLine, Old : ( undefined != this.Pr.Ind.FirstLine ? this.Pr.Ind.FirstLine : undefined ) } );
            this.Pr.Ind.FirstLine = Ind.FirstLine;
        }

        if ( ( undefined != Ind.Left || true === bDeleteUndefined ) && this.Pr.Ind.Left !== Ind.Left )
        {
            History.Add( this, { Type : historyitem_Paragraph_Ind_Left, New : Ind.Left, Old : ( undefined != this.Pr.Ind.Left ? this.Pr.Ind.Left : undefined ) } );
            this.Pr.Ind.Left = Ind.Left;
        }

        if ( ( undefined != Ind.Right || true === bDeleteUndefined ) && this.Pr.Ind.Right !== Ind.Right )
        {
            History.Add( this, { Type : historyitem_Paragraph_Ind_Right, New : Ind.Right, Old : ( undefined != this.Pr.Ind.Right ? this.Pr.Ind.Right : undefined ) } );
            this.Pr.Ind.Right = Ind.Right;
        }

        // Надо пересчитать конечный стиль
        this.CompiledPr.NeedRecalc = true;
    },

    Set_Spacing : function(Spacing, bDeleteUndefined)
    {
        if ( undefined === this.Pr.Spacing )
            this.Pr.Spacing = new CParaSpacing();

        if ( ( undefined != Spacing.Line || true === bDeleteUndefined ) && this.Pr.Spacing.Line !== Spacing.Line )
        {
            History.Add( this, { Type : historyitem_Paragraph_Spacing_Line, New : Spacing.Line, Old : ( undefined != this.Pr.Spacing.Line ? this.Pr.Spacing.Line : undefined ) } );
            this.Pr.Spacing.Line = Spacing.Line;
        }

        if ( ( undefined != Spacing.LineRule || true === bDeleteUndefined ) && this.Pr.Spacing.LineRule !== Spacing.LineRule )
        {
            History.Add( this, { Type : historyitem_Paragraph_Spacing_LineRule, New : Spacing.LineRule, Old : ( undefined != this.Pr.Spacing.LineRule ? this.Pr.Spacing.LineRule : undefined ) } );
            this.Pr.Spacing.LineRule = Spacing.LineRule;
        }

        if ( ( undefined != Spacing.Before || true === bDeleteUndefined ) && this.Pr.Spacing.Before !== Spacing.Before )
        {
            History.Add( this, { Type : historyitem_Paragraph_Spacing_Before, New : Spacing.Before, Old : ( undefined != this.Pr.Spacing.Before ? this.Pr.Spacing.Before : undefined ) } );
            this.Pr.Spacing.Before = Spacing.Before;
        }

        if ( ( undefined != Spacing.After || true === bDeleteUndefined ) && this.Pr.Spacing.After !== Spacing.After )
        {
            History.Add( this, { Type : historyitem_Paragraph_Spacing_After, New : Spacing.After, Old : ( undefined != this.Pr.Spacing.After ? this.Pr.Spacing.After : undefined ) } );
            this.Pr.Spacing.After = Spacing.After;
        }

        if ( ( undefined != Spacing.AfterAutoSpacing || true === bDeleteUndefined ) && this.Pr.Spacing.AfterAutoSpacing !== Spacing.AfterAutoSpacing )
        {
            History.Add( this, { Type : historyitem_Paragraph_Spacing_AfterAutoSpacing, New : Spacing.AfterAutoSpacing, Old : ( undefined != this.Pr.Spacing.AfterAutoSpacing ? this.Pr.Spacing.AfterAutoSpacing : undefined ) } );
            this.Pr.Spacing.AfterAutoSpacing = Spacing.AfterAutoSpacing;
        }

        if ( ( undefined != Spacing.BeforeAutoSpacing || true === bDeleteUndefined ) && this.Pr.Spacing.BeforeAutoSpacing !== Spacing.BeforeAutoSpacing )
        {
            History.Add( this, { Type : historyitem_Paragraph_Spacing_BeforeAutoSpacing, New : Spacing.BeforeAutoSpacing, Old : ( undefined != this.Pr.Spacing.BeforeAutoSpacing ? this.Pr.Spacing.BeforeAutoSpacing : undefined ) } );
            this.Pr.Spacing.BeforeAutoSpacing = Spacing.BeforeAutoSpacing;
        }

        // Надо пересчитать конечный стиль
        this.CompiledPr.NeedRecalc = true;
    },

    Set_Align : function(Align, bRecalc)
    {
        if ( this.Pr.Jc != Align )
        {
            History.Add( this, { Type : historyitem_Paragraph_Align, New : Align, Old : ( undefined != this.Pr.Jc ? this.Pr.Jc : undefined ) } );
            this.Pr.Jc = Align;

            // Надо пересчитать конечный стиль
            this.CompiledPr.NeedRecalc = true;

            if ( false != bRecalc )
                this.Internal_Recalculate_2();
        }
    },

    Set_Shd : function(Shd, bDeleteUndefined)
    {
        if ( undefined === this.Pr.Shd )
            this.Pr.Shd = new CDocumentShd();

        if ( ( undefined != Shd.Value || true === bDeleteUndefined ) && this.Pr.Shd.Value !== Shd.Value )
        {
            History.Add( this, { Type : historyitem_Paragraph_Shd_Value, New : Shd.Value, Old : ( undefined != this.Pr.Shd.Value ? this.Pr.Shd.Value : undefined ) } );
            this.Pr.Shd.Value = Shd.Value;
        }

        if ( undefined != Shd.Color || true === bDeleteUndefined )
        {
            History.Add( this, { Type : historyitem_Paragraph_Shd_Color, New : Shd.Color, Old : ( undefined != this.Pr.Shd.Color ? this.Pr.Shd.Color : undefined ) } );
            this.Pr.Shd.Color = Shd.Color;
        }

        // Надо пересчитать конечный стиль
        this.CompiledPr.NeedRecalc = true;
    },

    Set_Tabs : function(Tabs)
    {
        History.Add( this, { Type : historyitem_Paragraph_Tabs, New : Tabs, Old : this.Pr.Tabs } );
        this.Pr.Tabs = Tabs;

        // Надо пересчитать конечный стиль
        this.CompiledPr.NeedRecalc = true;
    },

    Set_ContextualSpacing : function(Value)
    {
        if ( Value != this.Pr.ContextualSpacing )
        {
            History.Add( this, { Type : historyitem_Paragraph_ContextualSpacing, New : Value, Old : ( undefined != this.Pr.ContextualSpacing ? this.Pr.ContextualSpacing : undefined ) } );
            this.Pr.ContextualSpacing = Value;

            // Надо пересчитать конечный стиль
            this.CompiledPr.NeedRecalc = true;
        }
    },

    Set_PageBreakBefore : function(Value)
    {
        if ( Value != this.Pr.PageBreakBefore )
        {
            History.Add( this, { Type : historyitem_Paragraph_PageBreakBefore, New : Value, Old : ( undefined != this.Pr.PageBreakBefore ? this.Pr.PageBreakBefore : undefined ) } );
            this.Pr.PageBreakBefore = Value;

            // Надо пересчитать конечный стиль
            this.CompiledPr.NeedRecalc = true;
        }
    },

    Set_KeepLines : function(Value)
    {
        if ( Value != this.Pr.KeepLines )
        {
            History.Add( this, { Type : historyitem_Paragraph_KeepLines, New : Value, Old : ( undefined != this.Pr.KeepLines ? this.Pr.KeepLines : undefined ) } );
            this.Pr.KeepLines = Value;

            // Надо пересчитать конечный стиль
            this.CompiledPr.NeedRecalc = true;
        }
    },

    Set_KeepNext : function(Value)
    {
        if ( Value != this.Pr.KeepNext )
        {
            History.Add( this, { Type : historyitem_Paragraph_KeepNext, New : Value, Old : ( undefined != this.Pr.KeepNext ? this.Pr.KeepNext : undefined ) } );
            this.Pr.KeepNext = Value;

            // Надо пересчитать конечный стиль
            this.CompiledPr.NeedRecalc = true;
        }
    },

    Set_WidowControl : function(Value)
    {
        if ( Value != this.Pr.WidowControl )
        {
            History.Add( this, { Type : historyitem_Paragraph_WidowControl, New : Value, Old : ( undefined != this.Pr.WidowControl ? this.Pr.WidowControl : undefined ) } );
            this.Pr.WidowControl = Value;

            // Надо пересчитать конечный стиль
            this.CompiledPr.NeedRecalc = true;
        }
    },

    Set_Borders : function(Borders)
    {
        if ( undefined === Borders )
            return;

        var OldBorders = this.Get_CompiledPr2(false).ParaPr.Brd;

        if ( Borders.Between != null && false === Borders.Between.Check_Null()  )
        {
            var NewBorder = undefined;
            if ( undefined != Borders.Between.Value /*&& border_Single === Borders.Between.Value*/ )
            {
                NewBorder = new CDocumentBorder();
                NewBorder.Color = ( undefined != Borders.Between.Color ? new CDocumentColor( Borders.Between.Color.r, Borders.Between.Color.g, Borders.Between.Color.b ) : new CDocumentColor( OldBorders.Between.Color.r, OldBorders.Between.Color.g, OldBorders.Between.Color.b ) );
                NewBorder.Space = ( undefined != Borders.Between.Space ? Borders.Between.Space : OldBorders.Between.Space );
                NewBorder.Size  = ( undefined != Borders.Between.Size  ? Borders.Between.Size  : OldBorders.Between.Size  );
                NewBorder.Value = ( undefined != Borders.Between.Value ? Borders.Between.Value : OldBorders.Between.Value );
            }

            History.Add( this, { Type : historyitem_Paragraph_Borders_Between, New : NewBorder, Old : this.Pr.Brd.Between } );
            this.Pr.Brd.Between = NewBorder;
        }

        if (Borders.Top != null && false === Borders.Top.Check_Null() )
        {
            var NewBorder = undefined;
            if ( undefined != Borders.Top.Value /*&& border_Single === Borders.Top.Value*/ )
            {
                NewBorder = new CDocumentBorder();
                NewBorder.Color = ( undefined != Borders.Top.Color ? new CDocumentColor( Borders.Top.Color.r, Borders.Top.Color.g, Borders.Top.Color.b ) : new CDocumentColor( OldBorders.Top.Color.r, OldBorders.Top.Color.g, OldBorders.Top.Color.b ) );
                NewBorder.Space = ( undefined != Borders.Top.Space ? Borders.Top.Space : OldBorders.Top.Space );
                NewBorder.Size  = ( undefined != Borders.Top.Size  ? Borders.Top.Size  : OldBorders.Top.Size  );
                NewBorder.Value = ( undefined != Borders.Top.Value ? Borders.Top.Value : OldBorders.Top.Value );
            }

            History.Add( this, { Type : historyitem_Paragraph_Borders_Top, New : NewBorder, Old : this.Pr.Brd.Top } );
            this.Pr.Brd.Top = NewBorder;
        }

        if (Borders.Right != null && false === Borders.Right.Check_Null() )
        {
            var NewBorder = undefined;
            if ( undefined != Borders.Right.Value /*&& border_Single === Borders.Right.Value*/ )
            {
                NewBorder = new CDocumentBorder();
                NewBorder.Color = ( undefined != Borders.Right.Color ? new CDocumentColor( Borders.Right.Color.r, Borders.Right.Color.g, Borders.Right.Color.b ) : new CDocumentColor( OldBorders.Right.Color.r, OldBorders.Right.Color.g, OldBorders.Right.Color.b ) );
                NewBorder.Space = ( undefined != Borders.Right.Space ? Borders.Right.Space : OldBorders.Right.Space );
                NewBorder.Size  = ( undefined != Borders.Right.Size  ? Borders.Right.Size  : OldBorders.Right.Size  );
                NewBorder.Value = ( undefined != Borders.Right.Value ? Borders.Right.Value : OldBorders.Right.Value );
            }

            History.Add( this, { Type : historyitem_Paragraph_Borders_Right, New : NewBorder, Old : this.Pr.Brd.Right } );
            this.Pr.Brd.Right = NewBorder;
        }

        if (Borders.Bottom != null && false === Borders.Bottom.Check_Null() )
        {
            var NewBorder = undefined;
            if ( undefined != Borders.Bottom.Value /*&& border_Single === Borders.Bottom.Value*/ )
            {
                NewBorder = new CDocumentBorder();
                NewBorder.Color = ( undefined != Borders.Bottom.Color ? new CDocumentColor( Borders.Bottom.Color.r, Borders.Bottom.Color.g, Borders.Bottom.Color.b ) : new CDocumentColor( OldBorders.Bottom.Color.r, OldBorders.Bottom.Color.g, OldBorders.Bottom.Color.b ) );
                NewBorder.Space = ( undefined != Borders.Bottom.Space ? Borders.Bottom.Space : OldBorders.Bottom.Space );
                NewBorder.Size  = ( undefined != Borders.Bottom.Size  ? Borders.Bottom.Size  : OldBorders.Bottom.Size  );
                NewBorder.Value = ( undefined != Borders.Bottom.Value ? Borders.Bottom.Value : OldBorders.Bottom.Value );
            }

            History.Add( this, { Type : historyitem_Paragraph_Borders_Bottom, New : NewBorder, Old : this.Pr.Brd.Bottom } );
            this.Pr.Brd.Bottom = NewBorder;
        }

        if (Borders.Left != null && false === Borders.Left.Check_Null()  )
        {
            var NewBorder = undefined;
            if ( undefined != Borders.Left.Value /*&& border_Single === Borders.Left.Value*/ )
            {
                NewBorder = new CDocumentBorder();
                NewBorder.Color = ( undefined != Borders.Left.Color ? new CDocumentColor( Borders.Left.Color.r, Borders.Left.Color.g, Borders.Left.Color.b ) : new CDocumentColor( OldBorders.Left.Color.r, OldBorders.Left.Color.g, OldBorders.Left.Color.b ) );
                NewBorder.Space = ( undefined != Borders.Left.Space ? Borders.Left.Space : OldBorders.Left.Space );
                NewBorder.Size  = ( undefined != Borders.Left.Size  ? Borders.Left.Size  : OldBorders.Left.Size  );
                NewBorder.Value = ( undefined != Borders.Left.Value ? Borders.Left.Value : OldBorders.Left.Value );
            }

            History.Add( this, { Type : historyitem_Paragraph_Borders_Left, New : NewBorder, Old : this.Pr.Brd.Left } );
            this.Pr.Brd.Left = NewBorder;
        }

        // Надо пересчитать конечный стиль
        this.CompiledPr.NeedRecalc = true;
    },

    Set_Border : function(Border, HistoryType)
    {
        var OldValue;
        switch( HistoryType )
        {
            case historyitem_Paragraph_Borders_Between: OldValue = this.Pr.Brd.Between; this.Pr.Brd.Between = Border; break;
            case historyitem_Paragraph_Borders_Bottom:  OldValue = this.Pr.Brd.Bottom;  this.Pr.Brd.Bottom  = Border; break;
            case historyitem_Paragraph_Borders_Left:    OldValue = this.Pr.Brd.Left;    this.Pr.Brd.Left    = Border; break;
            case historyitem_Paragraph_Borders_Right:   OldValue = this.Pr.Brd.Right;   this.Pr.Brd.Right   = Border; break;
            case historyitem_Paragraph_Borders_Top:     OldValue = this.Pr.Brd.Top;     this.Pr.Brd.Top     = Border; break;
        }

        History.Add( this, { Type : historyitem_Paragraph_WidowControl, New : Border, Old : OldValue } );

        // Надо пересчитать конечный стиль
        this.CompiledPr.NeedRecalc = true;
    },

    // Проверяем начинается ли текущий параграф с новой страницы.
    Is_StartFromNewPage : function()
    {
        // TODO: пока здесь стоит простая проверка. В будущем надо будет данную проверку улучшить.
        //       Например, сейчас не учитывается случай, когда в начале параграфа стоит PageBreak.

        if ( ( this.Pages.length > 1 && 0 === this.Pages[1].FirstLine ) || ( null === this.Get_DocumentPrev() ) )
            return true;

        return false;
    },

    Internal_GetPage : function(Pos)
    {
        if ( "undefined" === typeof(Pos) )
            Pos = this.CurPos.ContentPos;

        var CurPage = 0;
        for ( var Index = 0; Index < this.Content.length; Index++ )
        {
            var Item = this.Content[Index];

            if ( Pos === Index )
                return CurPage;

            if ( para_PageBreakRendered === Item.Type || ( para_NewLine === Item.Type && break_Page === Item.BreakType && true === Item.Is_NewLine() ) )
                CurPage++;
        }

        return 0;
    },

    // Ищем графический объект по Id и удаляем запись он нем в параграфе
    Remove_DrawingObject : function(Id)
    {
        for ( var Index = 0; Index < this.Content.length; Index++ )
        {
            if ( para_Drawing === this.Content[Index].Type && Id === this.Content[Index].Get_Id() )
            {
                this.Internal_Content_Remove( Index );
            }
        }
    },

    // Ищем номер страницы объекта по Id
    Get_DrawingObject_Page : function(Id)
    {
        var PageNum = this.Parent.StartPage + this.PageNum;
        for ( var Index = 0; Index < this.Content.length; Index++ )
        {
            if ( para_Drawing === this.Content[Index].Type && Id === this.Content[Index].Get_Id() )
            {
                return PageNum;
            }
            else if ( para_PageBreakRendered == this.Content[Index].Type || ( para_NewLine == this.Content[Index].Type && break_Page === this.Content[Index].BreakType && true === this.Content[Index].Flags.NewLine ) )
            {
                PageNum++;
            }
        }

        return -1;
    },

    // Получем ближающую возможную позицию курсора
    Get_NearestPos : function(PageNum, X, Y)
    {
        var ContentPos = this.Internal_GetContentPosByXY( X, Y, false, PageNum ).Pos;
        var Result = this.Internal_Recalculate_2( ContentPos, false, true );
        Result.Paragraph = this;
        return Result;
    },

    Set_DocumentNext : function(Object)
    {
        History.Add( this, { Type : historyitem_Paragraph_DocNext, New : Object, Old : this.Next } );
        this.Next = Object;
    },

    Set_DocumentPrev : function(Object)
    {
        History.Add( this, { Type : historyitem_Paragraph_DocPrev, New : Object, Old : this.Prev } );
        this.Prev = Object;
    },

    Get_DocumentNext : function()
    {
        return this.Next;
    },

    Get_DocumentPrev : function()
    {
        return this.Prev;
    },

    Set_DocumentIndex : function(Index)
    {
        this.Index = Index;
    },

    Set_Parent : function(ParentObject)
    {
        History.Add( this, { Type : historyitem_Paragraph_Parent, New : ParentObject, Old : this.Parent } );
        this.Parent = ParentObject;
    },

    Get_Parent : function()
    {
        return this.Parent;
    },

    Is_ContentOnFirstPage : function()
    {
        var Pos = this.Internal_FindForward( 0, [para_PageBreakRendered, para_Tab, para_Drawing, para_PageNum, para_Text, para_Space, para_NewLine] );

        // Перенос страницы не найден
        if ( false  === Pos.Found )
            return true;

        if ( para_PageBreakRendered === Pos.Type )
            return false;

        return true;
    },

    Get_CurrentPage_Absolute : function()
    {
        // Обновляем позицию
        this.Internal_Recalculate_2( this.CurPos.ContentPos, false, true );
        return (this.Get_StartPage_Absolute() + this.CurPos.PagesPos);
    },

    Get_CurrentPage_Relative : function()
    {
        // Обновляем позицию
        this.Internal_Recalculate_2( this.CurPos.ContentPos, false, true );
        return (this.PageNum + this.CurPos.PagesPos);
    },

    // на вход подается строка с как минимум 1 символом (поэтому тут это не проверяем)
    DocumentSearch : function(Str, ElementType)
    {
        var Pr = this.Get_CompiledPr();

        var StartPage = this.Get_StartPage_Absolute();

        var SearchResults = new Array();

        // Сначала найдем элементы поиска в данном параграфе
        for ( var Pos = 0; Pos < this.Content.length; Pos++ )
        {
            var Item = this.Content[Pos];
            if ( para_Numbering === Item.Type || para_PresentationNumbering === Item.Type || para_TextPr === Item.Type || para_NewLineRendered === Item.Type || para_PageBreakRendered === Item.Type )
                continue;

            if ( (" " === Str[0] && para_Space === Item.Type) || ( para_Text === Item.Type && (Item.Value).toLowerCase() === Str[0].toLowerCase() ) )
            {
                if ( 1 === Str.length )
                    SearchResults.push( { StartPos : Pos, EndPos : Pos + 1 } );
                else
                {
                    var bFind = true;
                    var Pos2 = Pos + 1;
                    // Проверяем
                    for ( var Index = 1; Index < Str.length; Index++ )
                    {
                        // Пропускаем записи TextPr
                        while ( Pos2 < this.Content.length && ( para_TextPr === this.Content[Pos2].Type || para_NewLineRendered === this.Content[Pos2].Type || para_PageBreakRendered === this.Content[Pos2].Type ) )
                            Pos2++;

                        if ( ( Pos2 >= this.Content.length ) || (" " === Str[Index] && para_Space != this.Content[Pos2].Type) || ( " " != Str[Index] && ( ( para_Text != this.Content[Pos2].Type ) || ( para_Text === this.Content[Pos2].Type && this.Content[Pos2].Value.toLowerCase() != Str[Index].toLowerCase() ) ) ) )
                        {
                            bFind = false;
                            break;
                        }

                        Pos2++;
                    }

                    if ( true === bFind )
                    {
                        SearchResults.push( { StartPos : Pos, EndPos : Pos2 } );
                    }
                }
            }
        }
        return SearchResults;
        var MaxShowValue = 100;
        for ( var FoundIndex = 0; FoundIndex < SearchResults.length; FoundIndex++ )
        {
            var Rects = new Array();

            // Делаем подсветку
            var StartPos = SearchResults[FoundIndex].StartPos;
            var EndPos   = SearchResults[FoundIndex].EndPos;

            // Найдем линию, с которой начинается селект, и посчитаем начальный сдвиг
            var CurLine = 0;
            var CurRange = 0;
            var StartX = 0;
            var Pos, Item;
            for ( Pos = StartPos - 1; Pos >= 0; Pos-- )
            {
                Item = this.Content[Pos];
                if ( ( Item.Type == para_NewLine && true === Item.Is_NewLine() ) || Item.Type == para_NewLineRendered )
                    CurLine++;
                else if ( 0 == CurLine && Item.Type == para_InlineBreak )
                    CurRange++;

                if ( 0 == CurLine && 0 == CurRange )
                {
                    if ( "undefined" != typeof(Item.Width) )
                        StartX += Item.WidthVisible;
                }
            }

            var PNum = 0;
            for ( ; PNum < this.Pages.length; PNum++ )
            {
                if ( PNum == this.Pages.length - 1 )
                    break;

                if ( CurLine < this.Pages[PNum + 1].FirstLine )
                    break;
            }

            StartX += this.Lines[CurLine].Ranges[CurRange].XVisible;

            if ( this.Pages[PNum].FirstLine > CurLine )
            {
                CurLine = this.Pages[PNum].FirstLine;
                CurRange = 0;
                StartX = this.Lines[CurLine].Ranges[CurRange].XVisible;


                var PageBreak = PNum;
                StartPos = 0;
                while ( PageBreak > 0  && StartPos < this.Content.length  )
                {
                    Item = this.Content[StartPos];
                    if ( para_PageBreakRendered == Item.Type || ( para_NewLine === Item.Type && break_Page === Item.BreakType && true === Item.Flags.NewLine ) )
                        PageBreak--;

                    StartPos++;
                }
            }

            var StartY = (this.Pages[PNum].Y + this.Lines[CurLine].Y - this.Lines[CurLine].Metrics.Ascent);
            var EndY   = (this.Pages[PNum].Y + this.Lines[CurLine].Y + this.Lines[CurLine].Metrics.Descent);
            if ( this.Lines[CurLine].Metrics.LineGap < 0 )
                EndY += this.Lines[CurLine].Metrics.LineGap;

            var W = 0;

            for ( Pos = StartPos; Pos < EndPos; Pos++ )
            {
                Item = this.Content[Pos];
                if ( "undefined" != typeof(Item.Width) )
                    W += Item.WidthVisible;

                if ( ( Item.Type == para_NewLine && true === Item.Is_NewLine() ) || Item.Type == para_NewLineRendered || Item.Type == para_InlineBreak || Pos == EndPos - 1 )
                {
                    Rects.push( { PageNum : StartPage + PNum, X : StartX, Y : StartY, W : W, H : EndY - StartY } );

                    if ( ( Item.Type == para_NewLine && true === Item.Is_NewLine() ) || Item.Type == para_NewLineRendered )
                    {
                        CurLine++;
                        if ( PNum < this.Pages.length - 1 && CurLine == this.Pages[PNum + 1].FirstLine )
                            PNum++;

                        CurRange = 0;
                        if ( CurLine < this.Lines.length )
                        {
                            StartX = this.Lines[CurLine].Ranges[CurRange].XVisible;

                            StartY = (this.Pages[PNum].Y + this.Lines[CurLine].Y - this.Lines[CurLine].Metrics.Ascent);
                            EndY   = (this.Pages[PNum].Y + this.Lines[CurLine].Y + this.Lines[CurLine].Metrics.Descent);

                            if ( this.Lines[CurLine].Metrics.LineGap < 0 )
                                EndY += this.Lines[CurLine].Metrics.LineGap;

                            W = 0;
                        }
                    }
                    else if ( Item.Type == para_InlineBreak )
                    {
                        CurRange++;
                        StartX = this.Lines[CurLine].Ranges[CurRange].XVisible;
                        W = 0;
                    }
                }
            }

            var ResultStr = new String();

            var _Str = "";
            for ( var Pos = StartPos; Pos < EndPos; Pos++ )
            {
                Item = this.Content[Pos];

                if ( para_Text === Item.Type )
                    _Str += Item.Value;
                else if ( para_Space === Item.Type )
                    _Str += " ";
            }

            // Теперь мы должны сформировать строку
            if ( _Str.length >= MaxShowValue )
            {
                ResultStr = "\<b\>";
                for ( var Index = 0; Index < MaxShowValue - 1; Index++ )
                    ResultStr += _Str[Index];

                ResultStr += "\</b\>...";
            }
            else
            {
                ResultStr = "\<b\>" + _Str + "\</b\>";

                var Pos_before = StartPos - 1;
                var Pos_after  = EndPos;
                var LeaveCount = MaxShowValue - _Str.length;

                var bAfter = true;
                while ( LeaveCount > 0 && ( Pos_before >= 0 || Pos_after < this.Content.length ) )
                {
                    var TempPos = ( true === bAfter ? Pos_after : Pos_before );
                    var Flag = 0;
                    while ( ( ( TempPos >= 0 && false === bAfter ) || ( TempPos < this.Content.length && true === bAfter ) ) && para_Text != this.Content[TempPos].Type && para_Space != this.Content[TempPos].Type )
                    {
                        if ( true === bAfter )
                        {
                            TempPos++;
                            if ( TempPos >= this.Content.length )
                            {
                                TempPos = Pos_before;
                                bAfter = false;
                                Flag++;
                            }
                        }
                        else
                        {
                            TempPos--;
                            if ( TempPos < 0 )
                            {
                                TempPos = Pos_after;
                                bAfter = true;
                                Flag++;
                            }
                        }

                        // Дошли до обоих концов параграфа
                        if ( Flag >= 2 )
                            break;
                    }

                    if ( Flag >= 2 || !( ( TempPos >= 0 && false === bAfter ) || ( TempPos < this.Content.length && true === bAfter ) ) )
                        break;

                    if ( true === bAfter )
                    {
                        ResultStr += (para_Space === this.Content[TempPos].Type ? " " : this.Content[TempPos].Value);
                        Pos_after = TempPos + 1;
                        LeaveCount--;

                        if ( Pos_before >= 0 )
                            bAfter = false;

                        if ( Pos_after >= this.Content.length )
                            bAfter = false;
                    }
                    else
                    {
                        ResultStr = (para_Space === this.Content[TempPos].Type ? " " : this.Content[TempPos].Value) + ResultStr;
                        Pos_before = TempPos - 1;
                        LeaveCount--;

                        if ( Pos_after < this.Content.length )
                            bAfter = true;

                        if ( Pos_before < 0 )
                            bAfter = true;
                    }
                }
            }

            this.DrawingDocument.AddPageSearch( ResultStr, Rects, ElementType );
        }
    },

    DocumentStatistics : function(Stats)
    {
        var bEmptyParagraph = true;
        var bWord = false;
        for ( var Index = 0; Index < this.Content.length; Index++ )
        {
            var Item = this.Content[Index];

            var bSymbol  = false;
            var bSpace   = false;
            var bNewWord = false;

            if ( (para_Text === Item.Type && false === Item.Is_NBSP()) || (para_PageNum === Item.Type) )
            {
                if ( false === bWord )
                    bNewWord = true;

                bWord   = true;
                bSymbol = true;
                bSpace  = false;
                bEmptyParagraph = false;
            }
            else if ( ( para_Text === Item.Type && true === Item.Is_NBSP() ) || para_Space === Item.Type || para_Tab === Item.Type )
            {
                bWord   = false;
                bSymbol = true;
                bSpace  = true;
            }

            if ( true === bSymbol )
                Stats.Add_Symbol( bSpace );

            if ( true === bNewWord )
                Stats.Add_Word();
        }

        var NumPr = this.Numbering_Get();
        if ( undefined != NumPr )
        {
            bEmptyParagraph = false;
            this.Parent.Get_Numbering().Get_AbstractNum( NumPr.NumId).DocumentStatistics( NumPr.Lvl, Stats );
        }

        if ( false === bEmptyParagraph )
            Stats.Add_Paragraph();
    },

    TurnOff_RecalcEvent : function()
    {
        this.TurnOffRecalcEvent = true;
    },

    TurnOn_RecalcEvent : function()
    {
        this.TurnOffRecalcEvent = false;
    },

    Set_ApplyToAll : function(bValue)
    {
        this.ApplyToAll = bValue;
    },

    Get_ApplyToAll : function()
    {
        return this.ApplyToAll;
    },


    Update_CursorType : function(X, Y, PageIndex)
    {
        var MMData = new CMouseMoveData();
        var _coords_rel_slide = this.Parent.getCurCoordsRelativeSlide();
        var Coords = this.DrawingDocument.ConvertCoordsToCursorWR( _coords_rel_slide.X, _coords_rel_slide.Y);
        MMData.X_abs = Coords.X;
        MMData.Y_abs = Coords.Y;

        var Hyperlink = this.Check_Hyperlink( X, Y, PageIndex );

        var PNum = PageIndex - this.PageNum;
        if ( null != Hyperlink /*&& ( PNum >= 0 && PNum < this.Pages.length && Y <= this.Pages[PNum].Bounds.Bottom && Y >= this.Pages[PNum].Bounds.Top )*/ )
        {
            MMData.Type      = c_oAscMouseMoveDataTypes.Hyperlink;
            MMData.Hyperlink = new CHyperlinkProperty( Hyperlink );
        }
        else
            MMData.Type      = c_oAscMouseMoveDataTypes.Common;

        if ( null != Hyperlink && true === global_keyboardEvent.CtrlKey )
            this.DrawingDocument.SetCursorType( "pointer" );
        else
            this.DrawingDocument.SetCursorType( "text" );

        editor.asc_fireCallback("asc_onMouseMove", MMData );
    },

    Document_CreateFontMap : function(FontMap)
    {
        if ( true === this.FontMap.NeedRecalc )
        {
            this.FontMap.Map = new Object();

            if ( true === this.CompiledPr.NeedRecalc )
            {
                this.CompiledPr.Pr = this.Internal_CompileParaPr();
                this.CompiledPr.NeedRecalc = false;
            }

            var CurTextPr = this.CompiledPr.Pr.TextPr.Copy();
            CurTextPr.Update_FontSize();

            var Style = ( true === CurTextPr.Bold ? 1 : 0 ) + ( true === CurTextPr.Italic ? 2 : 0 );
            var Key = "" + CurTextPr.FontFamily.Name + "_" + Style + "_" + CurTextPr.FontSize;
            this.FontMap.Map[Key] =
            {
                Name  : CurTextPr.FontFamily.Name,
                Style : Style,
                Size  : CurTextPr.FontSize
            };

            CurTextPr.Merge( this.TextPr.Value );
            CurTextPr.Update_FontSize();

            var Style = ( true === CurTextPr.Bold ? 1 : 0 ) + ( true === CurTextPr.Italic ? 2 : 0 );
            var Key = "" + CurTextPr.FontFamily.Name + "_" + Style + "_" + CurTextPr.FontSize;
            this.FontMap.Map[Key] =
            {
                Name  : CurTextPr.FontFamily.Name,
                Style : Style,
                Size  : CurTextPr.FontSize
            };

            for ( var Index = 0; Index < this.Content.length; Index++ )
            {
                var Item = this.Content[Index];

                if ( para_TextPr === Item.Type )
                {
                    // Выствляем начальные настройки текста у данного параграфа
                    CurTextPr = this.CompiledPr.Pr.TextPr.Copy();

                    var _CurTextPr = Item.Value;

                    // Копируем настройки из символьного стиля
                    if ( undefined != _CurTextPr.RStyle )
                    {
                        var Styles = this.Get_Styles();
                        var StyleTextPr = Styles.Get_Pr( _CurTextPr.RStyle, styles_Character).TextPr;
                        CurTextPr.Merge( StyleTextPr );
                    }

                    // Копируем прямые настройки
                    CurTextPr.Merge( _CurTextPr );
                    CurTextPr.Update_FontSize();

                    Style = ( true === CurTextPr.Bold ? 1 : 0 ) + ( true === CurTextPr.Italic ? 2 : 0 );
                    Key = "" + CurTextPr.FontFamily.Name + "_" + Style + "_" + CurTextPr.FontSize;
                    this.FontMap.Map[Key] =
                    {
                        Name  : CurTextPr.FontFamily.Name,
                        Style : Style,
                        Size  : CurTextPr.FontSize
                    };
                }
            }
            this.FontMap.NeedRecalc = false;
        }

        for ( Key in this.FontMap.Map )
        {
            FontMap[Key] = this.FontMap.Map[Key];
        }
    },

    // Пока мы здесь проверяем только, находимся ли мы внутри гиперссылки
    Document_UpdateInterfaceState : function()
    {
        if ( true === this.Selection.Use )
        {
            var Hyper_start = this.Check_Hyperlink2( this.Selection.StartPos );
            var Hyper_end   = this.Check_Hyperlink2( this.Selection.EndPos );

            if ( Hyper_start === Hyper_end && null != Hyper_start )
            {
                // Вычислим строку
                var Find = this.Internal_FindBackward( this.Selection.StartPos, [para_HyperlinkStart] );
                if ( true != Find.Found )
                    return;

                var Str = "";

                for ( var Pos = Find.LetterPos + 1; Pos < this.Content.length; Pos++ )
                {
                    var Item = this.Content[Pos];
                    var bBreak = false;

                    switch ( Item.Type )
                    {
                        case para_Drawing:
                        case para_End:
                        case para_Numbering:
                        case para_PresentationNumbering:
                        case para_PageNum:
                        {
                            Str = null;
                            bBreak = true;
                            break;
                        }

                        case para_Text : Str += Item.Value; break;
                        case para_Space:
                        case para_Tab  : Str += " "; break;
                        case para_HyperlinkEnd:
                        {
                            bBreak = true;
                            break;
                        }

                        case para_HyperlinkStart:
                            return;
                    }

                    if ( true === bBreak )
                        break;
                }

                var HyperProps = new CHyperlinkProperty( Hyper_start );
                HyperProps.put_Text( Str );

                editor.sync_HyperlinkPropCallback( HyperProps );
            }
        }
        else
        {
            var Hyper_cur = this.Check_Hyperlink2( this.CurPos.ContentPos, false );
            if ( null != Hyper_cur )
            {
                // Вычислим строку
                var Find = this.Internal_FindBackward( this.CurPos.ContentPos, [para_HyperlinkStart] );
                if ( true != Find.Found )
                    return;

                var Str = "";

                for ( var Pos = Find.LetterPos + 1; Pos < this.Content.length; Pos++ )
                {
                    var Item = this.Content[Pos];
                    var bBreak = false;

                    switch ( Item.Type )
                    {
                        case para_Drawing:
                        case para_End:
                        case para_Numbering:
                        case para_PresentationNumbering:
                        case para_PageNum:
                        {
                            Str = null;
                            bBreak = true;
                            break;
                        }

                        case para_Text : Str += Item.Value; break;
                        case para_Space:
                        case para_Tab  : Str += " "; break;
                        case para_HyperlinkEnd:
                        {
                            bBreak = true;
                            break;
                        }

                        case para_HyperlinkStart:
                            return;
                    }

                    if ( true === bBreak )
                        break;
                }

                var HyperProps = new CHyperlinkProperty( Hyper_cur );
                HyperProps.put_Text( Str );

                editor.sync_HyperlinkPropCallback( HyperProps );
            }
        }
    },

    // Функция, которую нужно вызвать перед удалением данного элемента
    PreDelete : function()
    {
        // Поскольку данный элемент удаляется, поэтому надо удалить все записи о
        // inline объектах в родительском классе, используемых в данном параграфе.
        // Кроме этого, если тут начинались или заканчивались комметарии, то их тоже
        // удаляем.


        for ( var Index = 0; Index < this.Content.length; Index++ )
        {
            var Item = this.Content[Index];
            if ( para_Drawing === Item.Type )
            {
                var ObjId = Item.Get_Id();
                this.Parent.DrawingObjects.Remove_ById( ObjId );
            }
            else if ( para_CommentEnd === Item.Type || para_CommentStart === Item.Type )
            {
                editor.WordControl.m_oLogicDocument.Remove_Comment( Item.Id, true );
            }
        }
    },

    Get_FlowObjects : function(bAll)
    {
        var StartPos = this.Selection.StartPos;
        var EndPos   = this.Selection.EndPos;

        if ( true === bAll )
        {
            StartPos = 0;
            EndPos   = this.Content.length - 1;
        }
        else if ( true != this.Selection.Use )
            return [];

        var Result = new Array();
        for ( var Index = StartPos; Index <= EndPos; Index++ )
        {
            var Item = this.Content[Index];
            if ( para_FlowObjectAnchor == Item.Type )
                Result.push( Item.FlowObject );
        }

        return Result;
    },

//-----------------------------------------------------------------------------------
// Функции для работы с номерами страниц
//-----------------------------------------------------------------------------------
    Get_StartPage_Absolute : function()
    {
        return this.Parent.Get_StartPage_Absolute() + this.Get_StartPage_Relative();
    },

    Get_StartPage_Relative : function()
    {
        return this.PageNum;
    },
//-----------------------------------------------------------------------------------
// Дополнительные функции
//-----------------------------------------------------------------------------------
    Link_FlowObject : function( X, Y, PageNum, FlowObject )
    {
        var Pos = this.Internal_GetContentPosByXY( X, Y, false, PageNum );
        if ( -1 != Pos.Pos )
        {
            this.Internal_Content_Add( Pos.Pos, new ParaFlowObjectAnchor( FlowObject ) );
        }
    },

    Document_SetThisElementCurrent : function()
    {
        this.Parent.Set_CurrentElement( this.Index );
    },

    // Разделяем данный параграф
    Split : function(NewParagraph, Pos)
    {
        if ( "undefined" === typeof(Pos) || null === Pos )
            Pos = this.CurPos.ContentPos;

        // Копируем контент, начиная с текущей позиции в параграфе до конца параграфа,
        // в новый параграф (первым элементом выставляем настройки текста, рассчитанные
        // для текущей позиции). Проверим, находится ли данная позиция внутри гиперссылки,
        // если да, тогда в текущем параграфе закрываем гиперссылку, а в новом создаем ее копию.

        var Hyperlink = this.Check_Hyperlink2( Pos, false );

        var TextPr = this.Internal_CalculateTextPr2( Pos );

        NewParagraph.DeleteCommentOnRemove = false;
        NewParagraph.Internal_Content_Remove2(0, NewParagraph.Content.length);
        NewParagraph.Internal_Content_Concat( this.Content.slice( Pos ) );
        NewParagraph.Internal_Content_Add( 0, new ParaTextPr( TextPr ) );
        NewParagraph.DeleteCommentOnRemove = true;

        NewParagraph.TextPr.Value = this.TextPr.Value.Copy();

        if ( null != Hyperlink )
            NewParagraph.Internal_Content_Add( 1, Hyperlink.Copy() );

        // Удаляем все элементы после текущей позиции и добавляем признак окончания параграфа.
        this.DeleteCommentOnRemove = false;
        this.Internal_Content_Remove2( Pos, this.Content.length - Pos );
        this.DeleteCommentOnRemove = true;

        if ( null != Hyperlink )
        {
            // Добавляем конец гиперссылки и пустые текстовые настройки
            this.Internal_Content_Add( this.Content.length, new ParaHyperlinkEnd() );
            this.Internal_Content_Add( this.Content.length, new ParaTextPr() );
        }

        this.Internal_Content_Add( this.Content.length, new ParaEnd() );
        this.Internal_Content_Add( this.Content.length, new ParaEmpty() );

        // Копируем все настройки в новый параграф. Делаем это после того как определили контент параграфов.
        this.CopyPr( NewParagraph );

        this.RecalcInfo.Set_Type_0(pararecalc_0_All);
        NewParagraph.RecalcInfo.Set_Type_0(pararecalc_0_All);
    },

    // Присоединяем контент параграфа Para к текущему параграфу
    Concat : function(Para)
    {
        this.DeleteCommentOnRemove = false;
        this.Internal_Content_Remove2( this.Content.length - 2, 2 );
        this.DeleteCommentOnRemove = true;

        // Убираем нумерацию, если она была у следующего параграфа
        Para.Numbering_Remove();
        Para.Remove_PresentationNumbering();

        this.Internal_Content_Concat( Para.Content );

        this.RecalcInfo.Set_Type_0(pararecalc_0_All);
    },

    // Копируем настройки параграфа и последние текстовые настройки в новый параграф
    Continue : function(NewParagraph)
    {
        // Копируем настройки параграфа
        this.CopyPr( NewParagraph );

        // Копируем последние настройки текста
        var TextPr = this.Internal_CalculateTextPr2( this.Internal_GetEndPos() );

        NewParagraph.Internal_Content_Add( 0, new ParaTextPr( TextPr ) );
        NewParagraph.TextPr.Value = this.TextPr.Value.Copy();
    },

//-----------------------------------------------------------------------------------
// Undo/Redo функции
//-----------------------------------------------------------------------------------
    Undo : function(Data)
    {
        var Type = Data.Type;

        switch ( Type )
        {
            case history_undo_redo_const:
            {
                Data.undo_function.call(this, Data);
                break;
            }
            case  historyitem_Paragraph_AddItem:
            {
                var StartPos = this.Internal_Get_RealPos( Data.Pos );
                var EndPos   = this.Internal_Get_RealPos( Data.EndPos );

                this.Content.splice( StartPos, EndPos - StartPos + 1 );

                break;
            }

            case historyitem_Paragraph_RemoveItem:
            {
                var Pos = this.Internal_Get_RealPos( Data.Pos );

                var Array_start = this.Content.slice( 0, Pos );
                var Array_end   = this.Content.slice( Pos );

                this.Content = Array_start.concat( Data.Items, Array_end );

                break;
            }

            case historyitem_Paragraph_Numbering:
            {
                var Old = Data.Old;
                if ( undefined != Old )
                    this.Pr.NumPr = Old;
                else
                    this.Pr.NumPr = undefined;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_Align:
            {
                this.Pr.Jc = Data.Old;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_Ind_First:
            {
                if ( undefined === this.Pr.Ind )
                    this.Pr.Ind = new CParaSpacing();

                this.Pr.Ind.FirstLine = Data.Old;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_Ind_Left:
            {
                if ( undefined === this.Pr.Ind )
                    this.Pr.Ind = new CParaSpacing();

                this.Pr.Ind.Left = Data.Old;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_Ind_Right:
            {
                if ( undefined === this.Pr.Ind )
                    this.Pr.Ind = new CParaSpacing();

                this.Pr.Ind.Right = Data.Old;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_ContextualSpacing:
            {
                this.Pr.ContextualSpacing = Data.Old;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_KeepLines:
            {
                this.Pr.KeepLines = Data.Old;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_KeepNext:
            {
                this.Pr.KeepNext = Data.Old;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_PageBreakBefore:
            {
                this.Pr.PageBreakBefore = Data.Old;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_Spacing_Line:
            {
                if ( undefined === this.Pr.Spacing )
                    this.Pr.Spacing = new CParaSpacing();

                this.Pr.Spacing.Line = Data.Old;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_Spacing_LineRule:
            {
                if ( undefined === this.Pr.Spacing )
                    this.Pr.Spacing = new CParaSpacing();

                this.Pr.Spacing.LineRule = Data.Old;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_Spacing_Before:
            {
                if ( undefined === this.Pr.Spacing )
                    this.Pr.Spacing = new CParaSpacing();

                this.Pr.Spacing.Before = Data.Old;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_Spacing_After:
            {
                if ( undefined === this.Pr.Spacing )
                    this.Pr.Spacing = new CParaSpacing();

                this.Pr.Spacing.After = Data.Old;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_Spacing_AfterAutoSpacing:
            {
                if ( undefined === this.Pr.Spacing )
                    this.Pr.Spacing = new CParaSpacing();

                this.Pr.Spacing.AfterAutoSpacing = Data.Old;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_Spacing_BeforeAutoSpacing:
            {
                if ( undefined === this.Pr.Spacing )
                    this.Pr.Spacing = new CParaSpacing();

                this.Pr.Spacing.BeforeAutoSpacing = Data.Old;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_Shd_Value:
            {
                if ( undefined != Data.Old && undefined === this.Shd )
                    this.Shd = new CDocumentShd();

                if ( undefined != Data.Old )
                    this.Shd.Value = Data.Old;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_Shd_Color:
            {
                if ( undefined != Data.Old && undefined === this.Shd )
                    this.Shd = new CDocumentShd();

                if ( undefined != Data.Old )
                    this.Shd.Color = Data.Old;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_WidowControl:
            {
                this.Pr.WidowControl = Data.Old;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_Tabs:
            {
                this.Pr.Tabs = Data.Old;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_PStyle:
            {
                var Old = Data.Old;
                if ( undefined != Old )
                    this.Pr.PStyle = Old;
                else
                    this.Pr.PStyle = undefined;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_DocNext:
            {
                this.Next = Data.Old;
                break;
            }

            case historyitem_Paragraph_DocPrev:
            {
                this.Prev = Data.Old;
                break;
            }

            case historyitem_Paragraph_Parent:
            {
                this.Parent = Data.Old;
                break;
            }

            case historyitem_Paragraph_Borders_Between:
            {
                this.Pr.Brd.Between = Data.Old;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_Borders_Bottom:
            {
                this.Pr.Brd.Bottom = Data.Old;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_Borders_Left:
            {
                this.Pr.Brd.Left = Data.Old;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_Borders_Right:
            {
                this.Pr.Brd.Right = Data.Old;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_Borders_Top:
            {
                this.Pr.Brd.Top = Data.Old;

                this.CompiledPr.NeedRecalc = true;

                break;
            }
            
            case historyitem_Paragraph_Pr:
            {
                var Old = Data.Old;
                if ( undefined != Old )
                    this.Pr = Old;
                else
                    this.Pr = new CParaPr();

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_PresentationPr_Bullet:
            {
                this.PresentationPr.Bullet = Data.Old;
                break;
            }

            case historyitem_Paragraph_PresentationPr_Level:
            {
                this.PresentationPr.Level = Data.Old;
                this.Recalc_CompiledPr();
                break;
            }
        }

        this.RecalcInfo.Set_Type_0(pararecalc_0_All);
        History.RecalcData_Add( this.Parent );
    },

    Redo : function(Data)
    {
        var Type = Data.Type;

        switch ( Type )
        {
            case history_undo_redo_const:
            {
                Data.redo_function.call(this, Data);
                break;
            }
            case  historyitem_Paragraph_AddItem:
            {
                var Pos = this.Internal_Get_RealPos( Data.Pos );

                var Array_start = this.Content.slice( 0, Pos );
                var Array_end   = this.Content.slice( Pos );

                this.Content = Array_start.concat( Data.Items, Array_end );

                break;

            }

            case historyitem_Paragraph_RemoveItem:
            {
                var StartPos = this.Internal_Get_RealPos( Data.Pos );
                var EndPos   = this.Internal_Get_RealPos( Data.EndPos );

                this.Content.splice( StartPos, EndPos - StartPos + 1 );

                break;
            }

            case historyitem_Paragraph_Numbering:
            {
                var New = Data.New;
                if ( undefined != New )
                    this.Pr.NumPr = New;
                else
                    this.Pr.NumPr = undefined;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_Align:
            {
                this.Pr.Jc = Data.New;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_Ind_First:
            {
                if ( undefined === this.Pr.Ind )
                    this.Pr.Ind = new CParaInd();

                this.Pr.Ind.FirstLine = Data.New;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_Ind_Left:
            {
                if ( undefined === this.Pr.Ind )
                    this.Pr.Ind = new CParaInd();

                this.Pr.Ind.Left = Data.New;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_Ind_Right:
            {
                if ( undefined === this.Pr.Ind )
                    this.Pr.Ind = new CParaInd();

                this.Pr.Ind.Right = Data.New;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_ContextualSpacing:
            {
                this.Pr.ContextualSpacing = Data.New;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_KeepLines:
            {
                this.Pr.KeepLines = Data.New;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_KeepNext:
            {
                this.Pr.KeepNext = Data.New;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_PageBreakBefore:
            {
                this.Pr.PageBreakBefore = Data.New;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_Spacing_Line:
            {
                if ( undefined === this.Pr.Spacing )
                    this.Pr.Spacing = new CParaSpacing();

                this.Pr.Spacing.Line = Data.New;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_Spacing_LineRule:
            {
                if ( undefined === this.Pr.Spacing )
                    this.Pr.Spacing = new CParaSpacing();

                this.Pr.Spacing.LineRule = Data.New;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_Spacing_Before:
            {
                if ( undefined === this.Pr.Spacing )
                    this.Pr.Spacing = new CParaSpacing();

                this.Pr.Spacing.Before = Data.New;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_Spacing_After:
            {
                if ( undefined === this.Pr.Spacing )
                    this.Pr.Spacing = new CParaSpacing();

                this.Pr.Spacing.After = Data.New;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_Spacing_AfterAutoSpacing:
            {
                if ( undefined === this.Pr.Spacing )
                    this.Pr.Spacing = new CParaSpacing();

                this.Pr.Spacing.AfterAutoSpacing = Data.New;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_Spacing_BeforeAutoSpacing:
            {
                if ( undefined === this.Pr.Spacing )
                    this.Pr.Spacing = new CParaSpacing();

                this.Pr.Spacing.BeforeAutoSpacing = Data.New;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_Shd_Value:
            {
                if ( undefined != Data.New && undefined === this.Shd )
                    this.Shd = new CDocumentShd();

                if ( undefined != Data.New )
                    this.Shd.Value = Data.New;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_Shd_Color:
            {
                if ( undefined != Data.New && undefined === this.Shd )
                    this.Shd = new CDocumentShd();

                if ( undefined != Data.New )
                    this.Shd.Color = Data.New;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_WidowControl:
            {
                this.Pr.WidowControl = Data.New;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_Tabs:
            {
                this.Pr.Tabs = Data.New;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_PStyle:
            {
                var New = Data.New;
                if ( undefined != New )
                    this.Pr.PStyle = New;
                else
                    this.Pr.PStyle = undefined;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_DocNext:
            {
                this.Next = Data.New;
                break;
            }

            case historyitem_Paragraph_DocPrev:
            {
                this.Prev = Data.New;
                break;
            }

            case historyitem_Paragraph_Parent:
            {
                this.Parent = Data.New;
                break;
            }

            case historyitem_Paragraph_Borders_Between:
            {
                this.Pr.Brd.Between = Data.New;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_Borders_Bottom:
            {
                this.Pr.Brd.Bottom = Data.New;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_Borders_Left:
            {
                this.Pr.Brd.Left = Data.New;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_Borders_Right:
            {
                this.Pr.Brd.Right = Data.New;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_Borders_Top:
            {
                this.Pr.Brd.Top = Data.New;

                this.CompiledPr.NeedRecalc = true;

                break;
            }
            
            case historyitem_Paragraph_Pr:
            {
                var New = Data.New;
                if ( undefined != New )
                    this.Pr = New;
                else
                    this.Pr = new CParaPr();

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_PresentationPr_Bullet:
            {
                this.PresentationPr.Bullet = Data.New;
                break;
            }

            case historyitem_Paragraph_PresentationPr_Level:
            {
                this.PresentationPr.Level = Data.New;
                this.Recalc_CompiledPr();
                break;
            }
        }

        this.RecalcInfo.Set_Type_0(pararecalc_0_All);
        History.RecalcData_Add( this.Get_ParentObject_or_DocumentPos() );
    },

    Get_SelectionState : function()
    {
        var ParaState = new Object();
        ParaState.CurPos  =
        {
            X          : this.CurPos.X,
            Y          : this.CurPos.Y,
            ContentPos : this.Internal_Get_ClearPos(this.CurPos.ContentPos),
            RealX      : this.CurPos.RealX,
            RealY      : this.CurPos.RealY,
            PagesPos   : this.CurPos.PagesPos
        };

        ParaState.Selection =
        {
            Start    : this.Selection.Start,
            Use      : this.Selection.Use,
            StartPos : this.Internal_Get_ClearPos(this.Selection.StartPos),
            EndPos   : this.Internal_Get_ClearPos(this.Selection.EndPos),
            Flag     : this.Selection.Flag
        };

        return [ ParaState ];
    },

    Set_SelectionState : function(State, StateIndex)
    {
        if ( State.length <= 0 )
            return;

        var ParaState = State[StateIndex];

        this.CurPos  =
        {
            X          : ParaState.CurPos.X,
            Y          : ParaState.CurPos.Y,
            ContentPos : this.Internal_Get_RealPos(ParaState.CurPos.ContentPos),
            RealX      : ParaState.CurPos.RealX,
            RealY      : ParaState.CurPos.RealY,
            PagesPos   : ParaState.CurPos.PagesPos
        };

        this.Selection =
        {
            Start    : ParaState.Selection.Start,
            Use      : ParaState.Selection.Use,
            StartPos : this.Internal_Get_RealPos(ParaState.Selection.StartPos),
            EndPos   : this.Internal_Get_RealPos(ParaState.Selection.EndPos),
            Flag     : ParaState.Selection.Flag
        };

        var CursorPos_max = this.Internal_GetEndPos();
        var CursorPos_min = this.Internal_GetStartPos();

        this.CurPos.ContentPos  = Math.max( CursorPos_min, Math.min( CursorPos_max, this.CurPos.ContentPos  ) );
        this.Selection.StartPos = Math.max( CursorPos_min, Math.min( CursorPos_max, this.Selection.StartPos ) );
        this.Selection.EndPos   = Math.max( CursorPos_min, Math.min( CursorPos_max, this.Selection.EndPos   ) );
    },

    Get_ParentObject_or_DocumentPos : function()
    {
        return this.Parent;
    },

    Check_HistoryUninon : function(Data1, Data2)
    {
        var Type1 = Data1.Type;
        var Type2 = Data2.Type;

        if ( historyitem_Paragraph_AddItem === Type1 && historyitem_Paragraph_AddItem === Type2 )
        {
            if ( 1 === Data1.Items.length && 1 === Data2.Items.length && Data1.Pos === Data2.Pos - 1 && para_Text === Data1.Items[0].Type && para_Text === Data2.Items[0].Type )
                return true;
        }
        return false;
    },

//-----------------------------------------------------------------------------------
// Функции для совместного редактирования
//-----------------------------------------------------------------------------------
    Document_Is_SelectionLocked : function(CheckType)
    {
        switch ( CheckType )
        {
            case changestype_Paragraph_Content:
            case changestype_Paragraph_Properties:
            case changestype_Document_Content:
            case changestype_Document_Content_Add:
            case changestype_Image_Properties:
            {
                this.Lock.Check( this.Get_Id() );
                break;
            }
            case changestype_Remove:
            {
                // Если у нас нет выделения, и курсор стоит в начале, мы должны проверить в том же порядке, в каком
                // идут проверки при удалении в команде Internal_Remove_Backward.
                if ( true != this.Selection.Use && true == this.Cursor_IsStart() )
                {
                    var Pr = this.Get_CompiledPr2(false).ParaPr;
                    if ( undefined != this.Numbering_Get() || Math.abs(Pr.Ind.FirstLine) > 0.001 || Math.abs(Pr.Ind.Left) > 0.001 )
                    {
                        // Надо проверить только текущий параграф, а это будет сделано далее
                    }
                    else
                    {
                        var Prev = this.Get_DocumentPrev();
                        if ( null != Prev && type_Paragraph === Prev.GetType() )
                            Prev.Lock.Check( Prev.Get_Id() );
                    }
                }
                // Если есть выделение, и знак параграфа попал в выделение ( и параграф выделен не целиком )
                else if ( true === this.Selection.Use )
                {
                    var StartPos = this.Selection.StartPos;
                    var EndPos   = this.Selection.EndPos;

                    if ( StartPos > EndPos )
                    {
                        var Temp = EndPos;
                        EndPos   = StartPos;
                        StartPos = Temp;
                    }

                    if ( EndPos >= this.Content.length - 1 && StartPos > this.Internal_GetStartPos() )
                    {
                        var Next = this.Get_DocumentNext();
                        if ( null != Next && type_Paragraph === Next.GetType() )
                            Next.Lock.Check( Next.Get_Id() );
                    }
                }

                this.Lock.Check( this.Get_Id() );

                break;
            }
            case changestype_Delete:
            {
                // Если у нас нет выделения, и курсор стоит в конце, мы должны проверить следующий элемент
                if ( true != this.Selection.Use && true === this.Cursor_IsEnd() )
                {
                    var Next = this.Get_DocumentNext();
                    if ( null != Next && type_Paragraph === Next.GetType() )
                        Next.Lock.Check( Next.Get_Id() );
                }
                // Если есть выделение, и знак параграфа попал в выделение и параграф выделен не целиком
                else if ( true === this.Selection.Use )
                {
                    var StartPos = this.Selection.StartPos;
                    var EndPos   = this.Selection.EndPos;

                    if ( StartPos > EndPos )
                    {
                        var Temp = EndPos;
                        EndPos   = StartPos;
                        StartPos = Temp;
                    }

                    if ( EndPos >= this.Content.length - 1 && StartPos > this.Internal_GetStartPos() )
                    {
                        var Next = this.Get_DocumentNext();
                        if ( null != Next && type_Paragraph === Next.GetType() )
                            Next.Lock.Check( Next.Get_Id() );
                    }
                }

                this.Lock.Check( this.Get_Id() );

                break;
            }
            case changestype_Document_SectPr:
            case changestype_Table_Properties:
            case changestype_Table_RemoveCells:
            case changestype_HdrFtr:
            {
                CollaborativeEditing.Add_CheckLock(true);
                break;
            }
        }
    },

    Save_Changes : function(Data, Writer)
    {
        // Сохраняем изменения из тех, которые используются для Undo/Redo в бинарный файл.
        // Long : тип класса
        // Long : тип изменений

        Writer.WriteLong( historyitem_type_Paragraph );

        var Type = Data.Type;

        // Пишем тип
        Writer.WriteLong( Type );

        switch ( Type )
        {
            case  historyitem_Paragraph_AddItem:
            {
                // Long     : Количество элементов
                // Array of :
                //  {
                //    Long     : Позиция
                //    Variable : Элемент
                //  }

                var bArray = Data.UseArray;
                var Count  = Data.Items.length;

                Writer.WriteLong( Count );

                for ( var Index = 0; Index < Count; Index++ )
                {
                    if ( true === bArray )
                        Writer.WriteLong( Data.PosArray[Index] );
                    else
                        Writer.WriteLong( Data.Pos + Index );

                    Data.Items[Index].Write_ToBinary(Writer);
                }

                break;
            }

            case historyitem_Paragraph_RemoveItem:
            {
                // Long          : Количество удаляемых элементов
                // Array of Long : позиции удаляемых элементов

                var bArray = Data.UseArray;
                var Count  = Data.Items.length;

                var StartPos = Writer.GetCurPosition();
                Writer.Skip(4);
                var RealCount = Count;

                for ( var Index = 0; Index < Count; Index++ )
                {
                    if ( true === bArray )
                    {
                        if ( false === Data.PosArray[Index] )
                            RealCount--;
                        else
                            Writer.WriteLong( Data.PosArray[Index] );
                    }
                    else
                        Writer.WriteLong( Data.Pos );
                }

                var EndPos = Writer.GetCurPosition();
                Writer.Seek( StartPos );
                Writer.WriteLong( RealCount );
                Writer.Seek( EndPos );

                break;
            }

            case historyitem_Paragraph_Numbering:
            {
                // Bool : IsUndefined
                // Если false
                //   Variable : NumPr (CNumPr)

                if ( undefined === Data.New )
                    Writer.WriteBool( true );
                else
                {
                    Writer.WriteBool( false );
                    Data.New.Write_ToBinary( Writer );
                }

                break;
            }

            case historyitem_Paragraph_Ind_First:
            case historyitem_Paragraph_Ind_Left:
            case historyitem_Paragraph_Ind_Right:
            case historyitem_Paragraph_Spacing_Line:
            case historyitem_Paragraph_Spacing_Before:
            case historyitem_Paragraph_Spacing_After:
            {
                // Bool : IsUndefined

                // Если false
                // Double : Value

                if ( undefined === Data.New )
                {
                    Writer.WriteBool( true );
                }
                else
                {
                    Writer.WriteBool( false );
                    Writer.WriteDouble( Data.New );
                }

                break;
            }

            case historyitem_Paragraph_Align:
            case historyitem_Paragraph_Spacing_LineRule:
            {
                // Bool : IsUndefined

                // Если false
                // Long : Value

                if ( undefined === Data.New )
                {
                    Writer.WriteBool( true );
                }
                else
                {
                    Writer.WriteBool( false );
                    Writer.WriteLong( Data.New );
                }

                break;
            }

            case historyitem_Paragraph_ContextualSpacing:
            case historyitem_Paragraph_KeepLines:
            case historyitem_Paragraph_KeepNext:
            case historyitem_Paragraph_PageBreakBefore:
            case historyitem_Paragraph_Spacing_AfterAutoSpacing:
            case historyitem_Paragraph_Spacing_BeforeAutoSpacing:
            case historyitem_Paragraph_WidowControl:
            {
                // Bool : IsUndefined

                // Если false
                // Bool : Value

                if ( undefined === Data.New )
                {
                    Writer.WriteBool( true );
                }
                else
                {
                    Writer.WriteBool( false );
                    Writer.WriteBool( Data.New );
                }

                break;
            }

            case historyitem_Paragraph_Shd_Value:
            {
                // Bool : IsUndefined

                // Если false
                // Byte : Value

                var New = Data.New;
                if ( undefined != New )
                {
                    Writer.WriteBool( false );
                    Writer.WriteByte( Data.New );
                }
                else
                    Writer.WriteBool( true );

                break;
            }

            case historyitem_Paragraph_Shd_Color:
            {
                // Bool : IsUndefined

                // Если false
                // Variable : Color (CDocumentColor)

                var New = Data.New;
                if ( undefined != New )
                {
                    Writer.WriteBool( false );
                    Data.New.Write_ToBinary(Writer);
                }
                else
                    Writer.WriteBool( true );

                break;
            }

            case historyitem_Paragraph_Tabs:
            {
                // Bool : IsUndefined
                // Есди false
                // Variable : CParaTabs

                if ( undefined != Data.New )
                {
                    Writer.WriteBool( false );
                    Data.New.Write_ToBinary( Writer );
                }
                else
                    Writer.WriteBool(true);

                break;
            }

            case historyitem_Paragraph_PStyle:
            {
                // Bool : Удаляем ли

                // Если false
                // String : StyleId

                if ( undefined != Data.New )
                {
                    Writer.WriteBool( false );
                    Writer.WriteString2( Data.New );
                }
                else
                    Writer.WriteBool( true );

                break;
            }

            case historyitem_Paragraph_DocNext:
            case historyitem_Paragraph_DocPrev:
            case historyitem_Paragraph_Parent:
            {
                // String : Id элемента

                if ( null != Data.New )
                    Writer.WriteString2( Data.New.Get_Id() );
                else
                    Writer.WriteString2( "" );

                break;
            }

            case historyitem_Paragraph_Borders_Between:
            case historyitem_Paragraph_Borders_Bottom:
            case historyitem_Paragraph_Borders_Left:
            case historyitem_Paragraph_Borders_Right:
            case historyitem_Paragraph_Borders_Top:
            {
                // Bool : IsUndefined
                // если false
                //  Variable : Border (CDocumentBorder)

                if ( undefined != Data.New )
                {
                    Writer.WriteBool( false );
                    Data.New.Write_ToBinary( Writer );
                }
                else
                    Writer.WriteBool( true );

                break;
            }

            case historyitem_Paragraph_Pr:
            {
                // Bool : удаляем ли

                if ( undefined === Data.New )
                    Writer.WriteBool( true );
                else
                {
                    Writer.WriteBool( false );
                    Data.New.Write_ToBinary( Writer );
                }

                break;
            }

            case historyitem_Paragraph_PresentationPr_Bullet:
            {
                // Variable : Bullet
                Data.New.Write_ToBinary( Writer );

                break;
            }

            case historyitem_Paragraph_PresentationPr_Level:
            {
                // Long : Level
                Writer.WriteLong( Data.New );
                break;
            }
        }

        return Writer;
    },

    Load_Changes : function(Reader)
    {
        // Сохраняем изменения из тех, которые используются для Undo/Redo в бинарный файл.
        // Long : тип класса
        // Long : тип изменений

        var ClassType = Reader.GetLong();
        if ( historyitem_type_Paragraph != ClassType )
            return;

        var Type = Reader.GetLong();

        switch ( Type )
        {
            case  historyitem_Paragraph_AddItem:
            {
                // Long     : Количество элементов
                // Array of :
                //  {
                //    Long     : Позиция
                //    Variable : Элемент
                //  }

                var Count = Reader.GetLong();

                for ( var Index = 0; Index < Count; Index++ )
                {
                    var Pos     = this.Internal_Get_RealPos( this.m_oContentChanges.Check( contentchanges_Add, Reader.GetLong() ) );
                    var Element = ParagraphContent_Read_FromBinary(Reader);

                    if ( null != Element )
                    {
                        if ( Element instanceof ParaCommentStart )
                        {
                            var Comment = g_oTableId.Get_ById( Element.Id );
                            if ( null != Comment )
                                Comment.Set_StartInfo( this.Internal_GetPage( Pos ), 0, 0, 0, this.Get_Id() );
                        }
                        else if ( Element instanceof ParaCommentEnd )
                        {
                            var Comment = g_oTableId.Get_ById( Element.Id );
                            if ( null != Comment )
                                Comment.Set_EndInfo( this.Internal_GetPage( Pos ), 0, 0, 0, this.Get_Id() );
                        }

                        // TODO: Подумать над тем как по минимуму вставлять отметки совместного редактирования
                        this.Content.splice( Pos, 0, new ParaCollaborativeChangesEnd() );
                        this.Content.splice( Pos, 0, Element );
                        this.Content.splice( Pos, 0, new ParaCollaborativeChangesStart() );

                        CollaborativeEditing.Add_ChangedClass(this);
                    }
                }

                this.DeleteCollaborativeMarks = false;

                break;
            }

            case historyitem_Paragraph_RemoveItem:
            {
                // Long          : Количество удаляемых элементов
                // Array of Long : позиции удаляемых элементов

                var Count = Reader.GetLong();

                for ( var Index = 0; Index < Count; Index++ )
                {
                    var ChangesPos = this.m_oContentChanges.Check( contentchanges_Remove, Reader.GetLong() );

                    // действие совпало, не делаем его
                    if ( false === ChangesPos )
                        continue;

                    var Pos = this.Internal_Get_RealPos( ChangesPos );
                    this.Content.splice( Pos, 1 );
                }

                break;
            }

            case historyitem_Paragraph_Numbering:
            {
                // Bool : IsUndefined
                // Если false
                //   Variable : NumPr (CNumPr)

                if ( true === Reader.GetBool() )
                    this.Pr.NumPr = undefined;
                else
                {
                    this.Pr.NumPr = new CNumPr();
                    this.Pr.NumPr.Read_FromBinary();
                }

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_Align:
            {
                // Bool : IsUndefined

                // Если false
                // Long : Value

                if ( true === Reader.GetBool() )
                    this.Pr.Jc = undefined;
                else
                    this.Pr.Jc = Reader.GetLong();

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_Ind_First:
            {
                // Bool : IsUndefined

                // Если false
                // Double : Value

                if ( undefined === this.Pr.Ind )
                    this.Pr.Ind = new CParaInd();

                if ( true === Reader.GetBool() )
                    this.Pr.Ind.FirstLine = undefined;
                else
                    this.Pr.Ind.FirstLine = Reader.GetDouble();

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_Ind_Left:
            {
                // Bool : IsUndefined

                // Если false
                // Double : Value

                if ( undefined === this.Pr.Ind )
                    this.Pr.Ind = new CParaInd();

                if ( true === Reader.GetBool() )
                    this.Pr.Ind.Left = undefined;
                else
                    this.Pr.Ind.Left = Reader.GetDouble();

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_Ind_Right:
            {
                // Bool : IsUndefined

                // Если false
                // Double : Value

                if ( undefined === this.Pr.Ind )
                    this.Pr.Ind = new CParaInd();

                if ( true === Reader.GetBool() )
                    this.Pr.Ind.Right = undefined;
                else
                    this.Pr.Ind.Right = Reader.GetDouble();

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_ContextualSpacing:
            {
                // Bool : IsUndefined

                // Если false
                // Bool : Value

                if ( true === Reader.GetBool() )
                    this.Pr.ContextualSpacing = undefined;
                else
                    this.Pr.ContextualSpacing = Reader.GetBool();

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_KeepLines:
            {
                // Bool : IsUndefined

                // Если false
                // Bool : Value

                if ( false === Reader.GetBool() )
                    this.Pr.KeepLines = Reader.GetBool();
                else
                    this.Pr.KeepLines = undefined;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_KeepNext:
            {
                // Bool : IsUndefined

                // Если false
                // Bool : Value

                if ( false === Reader.GetBool() )
                    this.Pr.KeepNext = Reader.GetLong();
                else
                    this.Pr.KeepNext = undefined;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_PageBreakBefore:
            {
                // Bool : IsUndefined

                // Если false
                // Bool : Value

                if ( false === Reader.GetBool() )
                    this.Pr.PageBreakBefore = Reader.GetBool();
                else
                    this.Pr.PageBreakBefore = undefined;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_Spacing_Line:
            {
                // Bool : IsUndefined

                // Если false
                // Double : Value

                if ( undefined === this.Pr.Spacing )
                    this.Pr.Spacing = new CParaSpacing();

                if ( false === Reader.GetBool() )
                    this.Pr.Spacing.Line = Reader.GetDouble();
                else
                    this.Pr.Spacing.Line = undefined;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_Spacing_LineRule:
            {
                // Bool : IsUndefined

                // Если false
                // Long : Value

                if ( undefined === this.Pr.Spacing )
                    this.Pr.Spacing = new CParaSpacing();

                if ( false === Reader.GetBool() )
                    this.Pr.Spacing.LineRule = Reader.GetLong();
                else
                    this.Pr.Spacing.LineRule = undefined;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_Spacing_Before:
            {
                // Bool : IsUndefined

                // Если false
                // Double : Value

                if ( undefined === this.Pr.Spacing )
                    this.Pr.Spacing = new CParaSpacing();

                if ( false === Reader.GetBool() )
                    this.Pr.Spacing.Before = Reader.GetDouble();
                else
                    this.Pr.Spacing.Before = undefined;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_Spacing_After:
            {
                // Bool : IsUndefined

                // Если false
                // Double : Value

                if ( undefined === this.Pr.Spacing )
                    this.Pr.Spacing = new CParaSpacing();

                if ( false === Reader.GetBool() )
                    this.Pr.Spacing.After = Reader.GetDouble();
                else
                    this.Pr.Spacing.After = undefined;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_Spacing_AfterAutoSpacing:
            {
                // Bool : IsUndefined

                // Если false
                // Bool : Value

                if ( undefined === this.Pr.Spacing )
                    this.Pr.Spacing = new CParaSpacing();

                if ( false === Reader.GetBool() )
                    this.Pr.Spacing.AfterAutoSpacing = Reader.GetBool();
                else
                    this.Pr.Spacing.AfterAutoSpacing = undefined;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_Spacing_BeforeAutoSpacing:
            {
                // Bool : IsUndefined

                // Если false
                // Bool : Value

                if ( undefined === this.Pr.Spacing )
                    this.Pr.Spacing = new CParaSpacing();

                if ( false === Reader.GetBool() )
                    this.Pr.Spacing.AfterAutoSpacing = Reader.GetBool();
                else
                    this.Pr.Spacing.BeforeAutoSpacing = undefined;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_Shd_Value:
            {
                // Bool : IsUndefined
                // Если false
                // Byte : Value

                if ( false === Reader.GetBool() )
                {
                    if ( undefined === this.Pr.Shd )
                        this.Pr.Shd = new CDocumentShd();

                    this.Pr.Shd.Value = Reader.GetByte();
                }
                else if ( undefined != this.Pr.Shd )
                    this.Pr.Shd.Value = undefined;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_Shd_Color:
            {
                // Bool : IsUndefined

                // Если false
                // Variable : Color (CDocumentColor)

                if ( false === Reader.GetBool() )
                {
                    if ( undefined === this.Pr.Shd )
                        this.Pr.Shd = new CDocumentShd();

                    this.Pr.Shd.Color = new CDocumentColor(0,0,0);
                    this.Pr.Shd.Color.Read_FromBinary(Reader);
                }
                else if ( undefined != this.Pr.Shd )
                    this.Pr.Shd.Color = undefined;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_WidowControl:
            {
                // Bool : IsUndefined

                // Если false
                // Bool : Value

                if ( false === Reader.GetBool() )
                    this.Pr.WidowControl = Reader.GetBool();
                else
                    this.Pr.WidowControl = undefined;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_Tabs:
            {
                // Bool : IsUndefined
                // Есди false
                // Variable : CParaTabs

                if ( false === Reader.GetBool() )
                {
                    this.Pr.Tabs = new CParaTabs();
                    this.Pr.Tabs.Read_FromBinary( Reader );
                }
                else
                    this.Pr.Tabs = undefined;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_PStyle:
            {
                // Bool : Удаляем ли

                // Если false
                // String : StyleId

                if ( false === Reader.GetBool() )
                    this.Pr.PStyle = Reader.GetString2();
                else
                    this.Pr.PStyle = undefined;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_DocNext:
            {
                // String : Id элемента

                this.Next = g_oTableId.Get_ById( Reader.GetString2() );

                break;
            }
            case historyitem_Paragraph_DocPrev:
            {
                // String : Id элемента

                this.Prev = g_oTableId.Get_ById( Reader.GetString2() );

                break;
            }
            case historyitem_Paragraph_Parent:
            {
                // String : Id элемента

                this.Parent = g_oTableId.Get_ById( Reader.GetString2() );

                break;
            }

            case historyitem_Paragraph_Borders_Between:
            {
                // Bool : IsUndefined
                // если false
                //  Variable : Border (CDocumentBorder)

                if ( false === Reader.GetBool() )
                {
                    this.Pr.Brd.Between = new CDocumentBorder();
                    this.Pr.Brd.Between.Read_FromBinary( Reader );
                }
                else
                    this.Pr.Brd.Between = undefined;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_Borders_Bottom:
            {
                // Bool : IsUndefined
                // если false
                //  Variable : Border (CDocumentBorder)

                if ( false === Reader.GetBool() )
                {
                    this.Pr.Brd.Bottom = new CDocumentBorder();
                    this.Pr.Brd.Bottom.Read_FromBinary( Reader );
                }
                else
                    this.Pr.Brd.Bottom = undefined;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_Borders_Left:
            {
                // Bool : IsUndefined
                // если false
                //  Variable : Border (CDocumentBorder)

                if ( false === Reader.GetBool() )
                {
                    this.Pr.Brd.Left = new CDocumentBorder();
                    this.Pr.Brd.Left.Read_FromBinary( Reader );
                }
                else
                    this.Pr.Brd.Left = undefined;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_Borders_Right:
            {
                // Bool : IsUndefined
                // если false
                //  Variable : Border (CDocumentBorder)

                if ( false === Reader.GetBool() )
                {
                    this.Pr.Brd.Right = new CDocumentBorder();
                    this.Pr.Brd.Right.Read_FromBinary( Reader );
                }
                else
                    this.Pr.Brd.Right = undefined;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_Borders_Top:
            {
                // Bool : IsUndefined
                // если false
                //  Variable : Border (CDocumentBorder)

                if ( false === Reader.GetBool() )
                {
                    this.Pr.Brd.Top = new CDocumentBorder();
                    this.Pr.Brd.Top.Read_FromBinary( Reader );
                }
                else
                    this.Pr.Brd.Top = undefined;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_Pr:
            {
                // Bool : IsUndefined

                if ( true === Reader.GetBool() )
                    this.Pr = new CParaPr();
                else
                {
                    this.Pr = new CParaPr();
                    this.Pr.Read_FromBinary( Reader );
                }

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_PresentationPr_Bullet:
            {
                // Variable : Bullet

                var Bullet = new CPresentationBullet();
                Bullet.Read_FromBinary( Reader );
                this.PresentationPr.Bullet = Bullet;

                break;
            }

            case historyitem_Paragraph_PresentationPr_Level:
            {
                // Long : Level
                this.PresentationPr.Level = Reader.GetLong();
                break;
            }
        }
    },

    Write_ToBinary2 : function(Writer)
    {
        Writer.WriteLong( historyitem_type_Paragraph );

        // String   : Id
        // String   : Id родительского класса
        // Variable : ParaPr
        // String   : Id TextPr
        // Long     : количество элементов, у которых Is_RealContent = true

        Writer.WriteString2( "" + this.Id );
        Writer.WriteString2( this.Parent.Get_Id() );
        Writer.WriteString2( this.Parent.Get_Id() );

        this.Pr.Write_ToBinary( Writer );

        Writer.WriteString2( this.TextPr.Get_Id() );

        var StartPos = Writer.GetCurPosition();
        Writer.Skip( 4 );

        var Len = this.Content.length;
        var Count  = 0;
        for ( var Index = 0; Index < Len; Index++ )
        {
            var Item = this.Content[Index];
            if ( true === Item.Is_RealContent() )
            {
                Item.Write_ToBinary( Writer );
                Count++;
            }
        }

        var EndPos = Writer.GetCurPosition();
        Writer.Seek( StartPos );
        Writer.WriteLong( Count );
        Writer.Seek( EndPos );
    },

    Read_FromBinary2 : function(Reader)
    {
        // String   : Id
        // String   : Id родительского класса
        // Variable : ParaPr
        // String   : Id TextPr
        // Long     : количество элементов, у которых Is_RealContent = true

        this.Id = Reader.GetString2();
        this.DrawingDocument = editor.WordControl.m_oLogicDocument.DrawingDocument;

        var LinkData = new Object();
        LinkData.Parent = Reader.GetString2();
        CollaborativeEditing.Add_LinkData(this, LinkData);

        this.Pr = new CParaPr();
        this.Pr.Read_FromBinary( Reader );

        this.TextPr = g_oTableId.Get_ById( Reader.GetString2() );

        this.Content = new Array();
        var Count = Reader.GetLong();
        for ( var Index = 0; Index < Count; Index++ )
        {
            var Element = ParagraphContent_Read_FromBinary(Reader);

            if ( null != Element )
                this.Content.push( Element );
        }

        CollaborativeEditing.Add_NewObject( this );
    },

    Load_LinkData : function(LinkData)
    {
        if ( "undefined" != typeof(LinkData.Parent) )
            this.Parent = g_oTableId.Get_ById( LinkData.Parent );
    },

    Clear_CollaborativeMarks : function()
    {
        for ( var Pos = 0; Pos < this.Content.length; Pos++ )
        {
            var Item = this.Content[Pos];

            if ( Item.Type == para_CollaborativeChangesEnd || Item.Type == para_CollaborativeChangesStart )
            {
                this.Internal_Content_Remove( Pos );
                Pos--;
            }
        }
    },
//-----------------------------------------------------------------------------------
// Функции для работы с комментариями
//-----------------------------------------------------------------------------------
    Add_Comment : function(Comment, bStart, bEnd)
    {
        var CursorPos_max = this.Internal_GetEndPos();
        var CursorPos_min = this.Internal_GetStartPos();

        if ( true === this.ApplyToAll )
        {
            if ( true === bEnd )
            {
                var PagePos = this.Internal_GetXYByContentPos( CursorPos_max );
                var Line    = this.Lines[PagePos.Internal.Line];
                var LineA   = Line.Metrics.Ascent;
                var LineH   = Line.Bottom - Line.Top;
                Comment.Set_EndInfo( PagePos.PageNum, PagePos.X, PagePos.Y - LineA, LineH, this.Get_Id() );

                var Item = new ParaCommentEnd(Comment.Get_Id());
                this.Internal_Content_Add( CursorPos_max, Item );
            }

            if ( true === bStart )
            {
                var PagePos = this.Internal_GetXYByContentPos( CursorPos_min );
                var Line    = this.Lines[PagePos.Internal.Line];
                var LineA   = Line.Metrics.Ascent;
                var LineH   = Line.Bottom - Line.Top;
                Comment.Set_StartInfo( PagePos.PageNum, PagePos.X, PagePos.Y - LineA, LineH, this.Get_Id() );

                var Item = new ParaCommentStart(Comment.Get_Id());
                this.Internal_Content_Add( CursorPos_min, Item );
            }
        }
        else
        {
            if ( true === this.Selection.Use )
            {
                var StartPos, EndPos;
                if ( this.Selection.StartPos < this.Selection.EndPos )
                {
                    StartPos = this.Selection.StartPos;
                    EndPos   = this.Selection.EndPos;
                }
                else
                {
                    StartPos = this.Selection.EndPos;
                    EndPos   = this.Selection.StartPos;
                }

                if ( true === bEnd )
                {
                    EndPos = Math.max( CursorPos_min, Math.min( CursorPos_max, EndPos ) );

                    var PagePos = this.Internal_GetXYByContentPos( EndPos );
                    var Line    = this.Lines[PagePos.Internal.Line];
                    var LineA   = Line.Metrics.Ascent;
                    var LineH   = Line.Bottom - Line.Top;
                    Comment.Set_EndInfo( PagePos.PageNum, PagePos.X, PagePos.Y - LineA, LineH, this.Get_Id() );

                    var Item = new ParaCommentEnd(Comment.Get_Id());
                    this.Internal_Content_Add( EndPos, Item );
                }

                if ( true === bStart )
                {
                    StartPos = Math.max( CursorPos_min, Math.min( CursorPos_max, StartPos ) );

                    var PagePos = this.Internal_GetXYByContentPos( StartPos );
                    var Line    = this.Lines[PagePos.Internal.Line];
                    var LineA   = Line.Metrics.Ascent;
                    var LineH   = Line.Bottom - Line.Top;
                    Comment.Set_StartInfo( PagePos.PageNum, PagePos.X, PagePos.Y - LineA, LineH, this.Get_Id() );

                    var Item = new ParaCommentStart(Comment.Get_Id());
                    this.Internal_Content_Add( StartPos, Item );
                }
            }
            else
            {
                if ( true === bEnd )
                {
                    var Pos = Math.max( CursorPos_min, Math.min( CursorPos_max, this.CurPos.ContentPos ) );

                    var PagePos = this.Internal_GetXYByContentPos( Pos );
                    var Line    = this.Lines[PagePos.Internal.Line];
                    var LineA   = Line.Metrics.Ascent;
                    var LineH   = Line.Bottom - Line.Top;
                    Comment.Set_EndInfo( PagePos.PageNum, PagePos.X, PagePos.Y - LineA, LineH, this.Get_Id() );

                    var Item = new ParaCommentEnd(Comment.Get_Id());
                    this.Internal_Content_Add( Pos, Item );
                }

                if ( true === bStart )
                {
                    var Pos = Math.max( CursorPos_min, Math.min( CursorPos_max, this.CurPos.ContentPos ) );

                    var PagePos = this.Internal_GetXYByContentPos( Pos );
                    var Line    = this.Lines[PagePos.Internal.Line];
                    var LineA   = Line.Metrics.Ascent;
                    var LineH   = Line.Bottom - Line.Top;
                    Comment.Set_StartInfo( PagePos.PageNum, PagePos.X, PagePos.Y - LineA, LineH, this.Get_Id() );

                    var Item = new ParaCommentStart(Comment.Get_Id());
                    this.Internal_Content_Add( Pos, Item );
                }
            }
        }
    },

    CanAdd_Comment : function()
    {
        if ( true === this.Selection.Use && true != this.Selection_IsEmpty() )
            return true;

        return false;
    },

    Remove_CommentMarks : function(Id)
    {
        var DocumentComments = editor.WordControl.m_oLogicDocument.Comments;
        var Count = this.Content.length;
        for ( var Pos = 0; Pos < Count; Pos++ )
        {
            var Item = this.Content[Pos];
            if ( ( para_CommentStart === Item.Type || para_CommentEnd === Item.Type ) && Id === Item.Id )
            {
                if ( para_CommentStart === Item.Type )
                    DocumentComments.Set_StartInfo( Item.Id, 0, 0, 0, 0, null );
                else
                    DocumentComments.Set_EndInfo( Item.Id, 0, 0, 0, 0, null );

                this.Internal_Content_Remove( Pos );
                Pos--;
                Count--;
            }
        }
    }
};

var pararecalc_0_All  = 0;
var pararecalc_0_None = 1;

function CParaRecalcInfo()
{
    this.Recalc_0_Type = pararecalc_0_All;
}

CParaRecalcInfo.prototype =
{
    Set_Type_0 : function(Type)
    {
        this.Recalc_0_Type = Type;
    }
};

function CParaLineRange(X, XEnd)
{
    this.X      = X;
    this.W      = 0;
    this.Words  = 0;
    this.Spaces = 0;
    this.XEnd   = XEnd;
}

function CParaLineMetrics()
{
    this.Ascent      = 0; // Высота над BaseLine
    this.Descent     = 0; // Высота после BaseLine
    this.TextAscent  = 0; // Высота текста над BaseLine
    this.TextDescent = 0; // Высота текста после BaseLine
    this.LineGap     = 0; // Дополнительное расстояние между строками
}

CParaLineMetrics.prototype =
{
    Update : function(TextAscent, TextDescent, Ascent, Descent, ParaPr)
    {
        if ( TextAscent > this.TextAscent )
            this.TextAscent = TextAscent;

        if ( TextDescent > this.TextDescent )
            this.TextDescent = TextDescent;

        if ( Ascent > this.Ascent )
            this.Ascent = Ascent;

        if ( Descent > this.Descent )
            this.Descent = Descent;

        this.LineGap = this.Recalculate_LineGap( ParaPr, this.TextAscent, this.TextDescent );
    },

    Recalculate_LineGap : function(ParaPr, TextAscent, TextDescent)
    {
        var LineGap = 0;
        switch ( ParaPr.Spacing.LineRule )
        {
            case linerule_Auto:
            {
                LineGap = ( TextAscent + TextDescent ) * ( ParaPr.Spacing.Line - 1 );
                break;
            }
            case linerule_Exact:
            {
                var ExactValue = Math.max( 1, ParaPr.Spacing.Line );
                LineGap = ExactValue - ( TextAscent + TextDescent );
                break;
            }
            case linerule_AtLeast:
            {
                var LineGap1 = ParaPr.Spacing.Line;
                var LineGap2 = TextAscent + TextDescent;
                LineGap = Math.max( LineGap1, LineGap2 ) - ( TextAscent + TextDescent );
                break;
            }

        }
        return LineGap;
    }
}

function CParaLine()
{
    this.Y       = 0; //
    this.W       = 0;
    this.Top     = 0;
    this.Bottom  = 0;
    this.Words   = 0;
    this.Spaces  = 0; // Количество пробелов между словами в строке (пробелы, идущие в конце строки, не учитываются)
    this.Metrics = new CParaLineMetrics();
    this.Ranges  = new Array(); // Массив CParaLineRanges
}

CParaLine.prototype =
{
    Add_Range : function(X, XEnd)
    {
        this.Ranges.push( new CParaLineRange( X, XEnd ) );
    },

    Reset : function()
    {
        this.Y       = 0; //
        this.Top     = 0;
        this.Bottom  = 0;
        this.Words   = 0;
        this.Spaces  = 0; // Количество пробелов между словами в строке (пробелы, идущие в конце строки, не учитываются)
        this.Metrics = new CParaLineMetrics();
        this.Ranges  = new Array(); // Массив CParaLineRanges
    }
};

function CDocumentBounds(Left, Top, Right, Bottom)
{
    this.Bottom = Bottom;
    this.Left   = Left;
    this.Right  = Right;
    this.Top    = Top;
}

function CParaPage(X, Y, XLimit, YLimit, FirstLine)
{
    this.X         = X;
    this.Y         = Y;
    this.XLimit    = XLimit;
    this.YLimit    = YLimit;
    this.FirstLine = FirstLine;
    this.Bounds    = new CDocumentBounds( X, Y, XLimit, Y );
}

CParaPage.prototype =
{
    Reset : function(X, Y, XLimit, YLimit, FirstLine)
    {
        this.X         = X;
        this.Y         = Y;
        this.XLimit    = XLimit;
        this.YLimit    = YLimit;
        this.FirstLine = FirstLine;
        this.Bounds    = new CDocumentBounds( X, Y, XLimit, Y );
    }
};