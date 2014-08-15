var global_memory_stream_menu = CreateNativeMemoryStream();

asc_docs_api.prototype.Update_ParaInd = function( Ind )
{
    this.WordControl.m_oDrawingDocument.Update_ParaInd(Ind);
};

asc_docs_api.prototype.Internal_Update_Ind_Left = function(Left)
{
};

asc_docs_api.prototype.Internal_Update_Ind_Right = function(Right)
{
};

// editor
asc_docs_api.prototype["NativeAfterLoad"] = function()
{
    this.WordControl.m_oDrawingDocument.AfterLoad();
};
asc_docs_api.prototype["GetNativePageMeta"] = function(pageIndex)
{
    this.WordControl.m_oDrawingDocument.LogicDocument = _api.WordControl.m_oDrawingDocument.m_oLogicDocument;
    this.WordControl.m_oDrawingDocument.RenderPage(pageIndex);
};

// HTML page interface
asc_docs_api.prototype["Call_OnUpdateOverlay"] = function(param)
{
    this.WordControl.m_oDrawingDocument.OnUpdateOverlay();
};

asc_docs_api.prototype["Call_OnMouseDown"] = function(e)
{
    this.WordControl.m_oDrawingDocument.OnMouseDown(e);
};
asc_docs_api.prototype["Call_OnMouseUp"] = function(e)
{
    this.WordControl.m_oDrawingDocument.OnMouseUp(e);
};
asc_docs_api.prototype["Call_OnMouseMove"] = function(e)
{
    this.WordControl.m_oDrawingDocument.OnMouseMove(e);
};

asc_docs_api.prototype["Call_OnKeyDown"] = function(e)
{
    this.WordControl.m_oDrawingDocument.OnKeyDown(e);
};
asc_docs_api.prototype["Call_OnKeyPress"] = function(e)
{
    this.WordControl.m_oDrawingDocument.OnKeyPress(e);
};
asc_docs_api.prototype["Call_OnKeyUp"] = function(e)
{
    this.WordControl.m_oDrawingDocument.OnKeyUp(e);
};

asc_docs_api.prototype["Call_CalculateResume"] = function()
{
    Document_Recalculate_Page();
};

asc_docs_api.prototype["Call_TurnOffRecalculate"] = function()
{
    this.WordControl.m_oLogicDocument.TurnOffRecalc = true;
};
asc_docs_api.prototype["Call_TurnOnRecalculate"] = function()
{
    this.WordControl.m_oLogicDocument.TurnOffRecalc = false;
    this.WordControl.m_oLogicDocument.Recalculate();
};

asc_docs_api.prototype["Call_CheckTargetUpdate"] = function()
{
    this.WordControl.m_oLogicDocument.CheckTargetUpdate();
};

asc_docs_api.prototype["Call_HR_Tabs"] = function(arrT, arrP)
{
    var _arr = new CParaTabs();
    var _c = arrT.length;
    for (var i = 0; i < _c; i++)
    {
        if (arrT[i] == 1)
            _arr.Add( new CParaTab( tab_Left, arrP[i] ) );
        if (arrT[i] == 2)
            _arr.Add( new CParaTab( tab_Right, arrP[i] ) );
        if (arrT[i] == 3)
            _arr.Add( new CParaTab( tab_Center, arrP[i] ) );
    }

    var _logic = this.WordControl.m_oLogicDocument;
    if ( false === _logic.Document_Is_SelectionLocked(changestype_Paragraph_Properties) )
    {
        _logic.Create_NewHistoryPoint();
        _logic.Set_ParagraphTabs(_arr);
    }
};
asc_docs_api.prototype["Call_HR_Pr"] = function(_indent_left, _indent_right, _indent_first)
{
    var _logic = this.WordControl.m_oLogicDocument;
    if ( false === _logic.Document_Is_SelectionLocked(changestype_Paragraph_Properties) )
    {
        _logic.Create_NewHistoryPoint();
        _logic.Set_ParagraphIndent( { Left : _indent_left, Right : _indent_right, FirstLine: _indent_first } );
        _logic.Document_UpdateInterfaceState();
    }
};
asc_docs_api.prototype["Call_HR_Margins"] = function(_margin_left, _margin_right)
{
    var _logic = this.WordControl.m_oLogicDocument;
    if ( false === _logic.Document_Is_SelectionLocked(changestype_Document_SectPr) )
    {
        _logic.Create_NewHistoryPoint();
        _logic.Set_DocumentMargin( { Left : _margin_left, Right : _margin_right });
    }
};
asc_docs_api.prototype["Call_HR_Table"] = function(_params, _cols, _margins, _rows)
{
    var _logic = this.WordControl.m_oLogicDocument;
    if ( false === _logic.Document_Is_SelectionLocked(changestype_Table_Properties) )
    {
        _logic.Create_NewHistoryPoint();

        var _table_murkup = Deserialize_Table_Markup(_params, _cols, _margins, _rows);
        _table_murkup.Table = this.WordControl.m_oDrawingDocument.Table;

        _table_murkup.CorrectTo();
        _table_murkup.Table.Update_TableMarkupFromRuler(_table_murkup, true, _params[6]);
        _table_murkup.CorrectFrom();
    }
};

asc_docs_api.prototype["Call_VR_Margins"] = function(_top, _bottom)
{
    var _logic = this.WordControl.m_oLogicDocument;
    if ( false === _logic.Document_Is_SelectionLocked(changestype_Document_SectPr) )
    {
        _logic.Create_NewHistoryPoint();
        _logic.Set_DocumentMargin( { Top : _top, Bottom : _bottom });
    }
};
asc_docs_api.prototype["Call_VR_Header"] = function(_header_top, _header_bottom)
{
    var _logic = this.WordControl.m_oLogicDocument;
    if ( false === _logic.Document_Is_SelectionLocked(changestype_HdrFtr) )
    {
        _logic.Create_NewHistoryPoint();
        _logic.Document_SetHdrFtrBounds(_header_top, _header_bottom);
    }
};
asc_docs_api.prototype["Call_VR_Table"] = function(_params, _cols, _margins, _rows)
{
    var _logic = this.WordControl.m_oLogicDocument;
    if ( false === _logic.Document_Is_SelectionLocked(changestype_Table_Properties) )
    {
        _logic.Create_NewHistoryPoint();

        var _table_murkup = Deserialize_Table_Markup(_params, _cols, _margins, _rows);
        _table_murkup.Table = this.WordControl.m_oDrawingDocument.Table;

        _table_murkup.CorrectTo();
        _table_murkup.Table.Update_TableMarkupFromRuler(_table_murkup, false, _params[6]);
        _table_murkup.CorrectFrom();
    }
};

// TEXTFONTFAMILY
function asc_menu_ReadFontFamily(_params, _cursor)
{
    var _fontfamily = { Name : undefined, Index : -1 };
    var _continue = true;
    while (_continue)
    {
        var _attr = _params[_cursor.pos++];
        switch (_attr)
        {
            case 0:
            {
                _fontfamily.Name = _params[_cursor.pos++];
                break;
            }
            case 1:
            {
                _fontfamily.Index = _params[_cursor.pos++];
                break;
            }
            case 255:
            default:
            {
                _continue = false;
                break;
            }
        }
    }
    return _fontfamily;
}
function asc_menu_WriteFontFamily(_type, _family, _stream)
{
    if (undefined === _family)
        return;

    _stream["WriteByte"](_type);

    if (_family.Name !== undefined && _family.Name !== null)
    {
        _stream["WriteByte"](0);
        _stream["WriteString2"](_family.Name);
    }
    if (_family.Index !== undefined && _family.Index !== null)
    {
        _stream["WriteByte"](1);
        _stream["WriteLong"](_family.Index);
    }

    _stream["WriteByte"](255);
}

// ASCCOLOR
function asc_menu_ReadColor(_params, _cursor)
{
    var _color = new CAscColor();
    var _continue = true;
    while (_continue)
    {
        var _attr = _params[_cursor.pos++];
        switch (_attr)
        {
            case 0:
            {
                _color.type = _params[_cursor.pos++];
                break;
            }
            case 1:
            {
                _color.r = _params[_cursor.pos++];
                break;
            }
            case 2:
            {
                _color.g = _params[_cursor.pos++];
                break;
            }
            case 3:
            {
                _color.b = _params[_cursor.pos++];
                break;
            }
            case 4:
            {
                _color.a = _params[_cursor.pos++];
                break;
            }
            case 5:
            {
                _color.Auto = _params[_cursor.pos++];
                break;
            }
            case 6:
            {
                _color.value = _params[_cursor.pos++];
                break;
            }
            case 7:
            {
                _color.ColorSchemeId = _params[_cursor.pos++];
                break;
            }
            case 8:
            {
                var _count = _params[_cursor.pos++];
                for (var i = 0; i < _count; i++)
                {
                    var _mod = new CColorMod();
                    _mod.name = _params[_cursor.pos++];
                    _mod.val = _params[_cursor.pos++];
                    _color.Mods.push(_mod);
                }
                break;
            }
            case 255:
            default:
            {
                _continue = false;
                break;
            }
        }
    }
    return _color;
}
function asc_menu_WriteColor(_type, _color, _stream)
{
    if (undefined === _color)
        return;

    _stream["WriteByte"](_type);

    if (_color.type !== undefined && _color.type !== null)
    {
        _stream["WriteByte"](0);
        _stream["WriteLong"](_color.type);
    }
    if (_color.r !== undefined && _color.r !== null)
    {
        _stream["WriteByte"](1);
        _stream["WriteByte"](_color.r);
    }
    if (_color.g !== undefined && _color.g !== null)
    {
        _stream["WriteByte"](2);
        _stream["WriteByte"](_color.g);
    }
    if (_color.b !== undefined && _color.b !== null)
    {
        _stream["WriteByte"](3);
        _stream["WriteByte"](_color.b);
    }
    if (_color.a !== undefined && _color.a !== null)
    {
        _stream["WriteByte"](4);
        _stream["WriteByte"](_color.a);
    }
    if (_color.Auto !== undefined && _color.Auto !== null)
    {
        _stream["WriteByte"](5);
        _stream["WriteBool"](_color.Auto);
    }
    if (_color.value !== undefined && _color.value !== null)
    {
        _stream["WriteByte"](6);
        _stream["WriteLong"](_color.value);
    }
    if (_color.ColorSchemeId !== undefined && _color.ColorSchemeId !== null)
    {
        _stream["WriteByte"](7);
        _stream["WriteLong"](_color.ColorSchemeId);
    }
    if (_color.Mods !== undefined && _color.Mods !== null)
    {
        _stream["WriteByte"](8);

        var _len = _color.Mods.length;
        _stream["WriteLong"](_len);

        for (var i = 0; i < _len; i++)
        {
            _stream["WriteString1"](_color.Mods[i].name);
            _stream["WriteLong"](_color.Mods[i].val);
        }
    }

    _stream["WriteByte"](255);
}

// PARAINDENT
function asc_menu_ReadParaInd(_params, _cursor)
{
    var _ind = new CParaInd();
    var _continue = true;
    while (_continue)
    {
        var _attr = _params[_cursor.pos++];
        switch (_attr)
        {
            case 0:
            {
                _ind.Left = _params[_cursor.pos++];
                break;
            }
            case 1:
            {
                _ind.Right = _params[_cursor.pos++];
                break;
            }
            case 2:
            {
                _ind.FirstLine = _params[_cursor.pos++];
                break;
            }
            case 255:
            default:
            {
                _continue = false;
                break;
            }
        }
    }
    return _ind;
}
function asc_menu_WriteParaInd(_type, _ind, _stream)
{
    if (undefined === _ind)
        return;

    _stream["WriteByte"](_type);

    if (_ind.Left !== undefined && _ind.Left !== null)
    {
        _stream["WriteByte"](0);
        _stream["WriteDouble2"](_ind.Left);
    }
    if (_ind.Right !== undefined && _ind.Right !== null)
    {
        _stream["WriteByte"](1);
        _stream["WriteDouble2"](_ind.Right);
    }
    if (_ind.FirstLine !== undefined && _ind.FirstLine !== null)
    {
        _stream["WriteByte"](2);
        _stream["WriteDouble2"](_ind.FirstLine);
    }

    _stream["WriteByte"](255);
}

// PARASPACING
function asc_menu_ReadParaSpacing(_params, _cursor)
{
    var _spacing = new CParaSpacing();
    var _continue = true;
    while (_continue)
    {
        var _attr = _params[_cursor.pos++];
        switch (_attr)
        {
            case 0:
            {
                _spacing.Line = _params[_cursor.pos++];
                break;
            }
            case 1:
            {
                _spacing.LineRule = _params[_cursor.pos++];
                break;
            }
            case 2:
            {
                _spacing.Before = _params[_cursor.pos++];
                break;
            }
            case 3:
            {
                _spacing.BeforeAutoSpacing = _params[_cursor.pos++];
                break;
            }
            case 4:
            {
                _spacing.After = _params[_cursor.pos++];
                break;
            }
            case 5:
            {
                _spacing.AfterAutoSpacing = _params[_cursor.pos++];
                break;
            }
            case 255:
            default:
            {
                _continue = false;
                break;
            }
        }
    }
    return _spacing;
}
function asc_menu_WriteParaSpacing(_type, _spacing, _stream)
{
    if (undefined === _spacing)
        return;

    _stream["WriteByte"](_type);

    if (_spacing.Line !== undefined && _spacing.Line !== null)
    {
        _stream["WriteByte"](0);
        _stream["WriteDouble2"](_spacing.Line);
    }
    if (_spacing.LineRule !== undefined && _spacing.LineRule !== null)
    {
        _stream["WriteByte"](1);
        _stream["WriteLong"](_spacing.LineRule);
    }
    if (_spacing.Before !== undefined && _spacing.Before !== null)
    {
        _stream["WriteByte"](2);
        _stream["WriteDouble2"](_spacing.Before);
    }
    if (_spacing.BeforeAutoSpacing !== undefined && _spacing.BeforeAutoSpacing !== null)
    {
        _stream["WriteByte"](3);
        _stream["WriteBool"](_spacing.BeforeAutoSpacing);
    }
    if (_spacing.After !== undefined && _spacing.After !== null)
    {
        _stream["WriteByte"](4);
        _stream["WriteDouble2"](_spacing.After);
    }
    if (_spacing.AfterAutoSpacing !== undefined && _spacing.AfterAutoSpacing !== null)
    {
        _stream["WriteByte"](5);
        _stream["WriteBool"](_spacing.AfterAutoSpacing);
    }

    _stream["WriteByte"](255);
}

// PARAASCBORDER
function asc_menu_ReadParaBorder(_params, _cursor)
{
    var _border = new CBorder();
    var _continue = true;
    while (_continue)
    {
        var _attr = _params[_cursor.pos++];
        switch (_attr)
        {
            case 0:
            {
                _border.Color = asc_menu_ReadColor(_params, _cursor);
                break;
            }
            case 1:
            {
                _border.Size = _params[_cursor.pos++];
                break;
            }
            case 2:
            {
                _border.Value = _params[_cursor.pos++];
                break;
            }
            case 3:
            {
                _border.Space = _params[_cursor.pos++];
                break;
            }
            case 255:
            default:
            {
                _continue = false;
                break;
            }
        }
    }
    return _border;
}
function asc_menu_WriteParaBorder(_type, _border, _stream)
{
    if (undefined === _border)
        return;

    _stream["WriteByte"](_type);

    asc_menu_WriteColor(0, _border.Color, _stream);

    if (_border.Size !== undefined && _border.Size !== null)
    {
        _stream["WriteByte"](1);
        _stream["WriteDouble2"](_border.Size);
    }
    if (_border.Value !== undefined && _border.Value !== null)
    {
        _stream["WriteByte"](2);
        _stream["WriteLong"](_border.Value);
    }
    if (_border.Space !== undefined && _border.Space !== null)
    {
        _stream["WriteByte"](3);
        _stream["WriteDouble2"](_border.Space);
    }

    _stream["WriteByte"](255);
}

// PARAASCBORDERS
function asc_menu_ReadParaBorders(_params, _cursor)
{
    var _border = new CParagraphBorders();
    var _continue = true;
    while (_continue)
    {
        var _attr = _params[_cursor.pos++];
        switch (_attr)
        {
            case 0:
            {
                _border.Left = asc_menu_ReadParaBorder(_params, _cursor);
                break;
            }
            case 1:
            {
                _border.Top = asc_menu_ReadParaBorder(_params, _cursor);
                break;
            }
            case 2:
            {
                _border.Right = asc_menu_ReadParaBorder(_params, _cursor);
                break;
            }
            case 3:
            {
                _border.Bottom = asc_menu_ReadParaBorder(_params, _cursor);
                break;
            }
            case 4:
            {
                _border.Between = asc_menu_ReadParaBorder(_params, _cursor);
                break;
            }
            case 255:
            default:
            {
                _continue = false;
                break;
            }
        }
    }
    return _border;
}
function asc_menu_WriteParaBorders(_type, _borders, _stream)
{
    if (undefined === _borders)
        return;

    _stream["WriteByte"](_type);

    asc_menu_WriteParaBorder(0, _borders.Left, _stream);
    asc_menu_WriteParaBorder(1, _borders.Top, _stream);
    asc_menu_WriteParaBorder(2, _borders.Right, _stream);
    asc_menu_WriteParaBorder(3, _borders.Bottom, _stream);
    asc_menu_WriteParaBorder(4, _borders.Between, _stream);

    _stream["WriteByte"](255);
}

// PARASHD
function asc_menu_ReadParaShd(_params, _cursor)
{
    var _shd = new CParagraphShd();
    var _continue = true;
    while (_continue)
    {
        var _attr = _params[_cursor.pos++];
        switch (_attr)
        {
            case 0:
            {
                _shd.Value = _params[_cursor.pos++];
                break;
            }
            case 1:
            {
                _shd.Color = asc_menu_ReadColor(_params, _cursor);
                break;
            }
            case 255:
            default:
            {
                _continue = false;
                break;
            }
        }
    }
    return _shd;
}
function asc_menu_WriteParaShd(_type, _shd, _stream)
{
    if (undefined === _shd)
        return;

    _stream["WriteByte"](_type);

    if (_shd.Value !== undefined && _shd.Value !== null)
    {
        _stream["WriteByte"](0);
        _stream["WriteLong"](_shd.Value);
    }

    asc_menu_WriteColor(1, _shd.Color, _stream);

    _stream["WriteByte"](255);
}

// PARALISTTYPE
function asc_menu_ReadParaListType(_params, _cursor)
{
    var _list = new CListType();
    var _continue = true;
    while (_continue)
    {
        var _attr = _params[_cursor.pos++];
        switch (_attr)
        {
            case 0:
            {
                _list.Type = _params[_cursor.pos++];
                break;
            }
            case 1:
            {
                _list.SubType = _params[_cursor.pos++];
                break;
            }
            case 255:
            default:
            {
                _continue = false;
                break;
            }
        }
    }
    return _list;
}
function asc_menu_WriteParaListType(_type, _list, _stream)
{
    if (undefined === _list)
        return;

    _stream["WriteByte"](_type);

    if (_list.Type !== undefined && _list.Type !== null)
    {
        _stream["WriteByte"](0);
        _stream["WriteLong"](_list.Type);
    }
    if (_list.SubType !== undefined && _list.SubType !== null)
    {
        _stream["WriteByte"](1);
        _stream["WriteLong"](_list.SubType);
    }

    _stream["WriteByte"](255);
}

// PARATABS
function asc_menu_ReadParaTabs(_params, _cursor)
{
    var _tabs = new CParagraphTabs();

    var _count = _params[_cursor.pos++];

    for (var i = 0; i < _count; i++)
    {
        var _tab = new CParagraphTab();
        var _continue = true;
        while (_continue)
        {
            var _attr = _params[_cursor.pos++];
            switch (_attr)
            {
                case 0:
                {
                    _tab.Pos = _params[_cursor.pos++];
                    break;
                }
                case 1:
                {
                    _tab.Value = _params[_cursor.pos++];
                    break;
                }
                case 255:
                default:
                {
                    _continue = false;
                    break;
                }
            }
        }

        _tabs.Tabs.push(_tab);
    }
    return _tabs;
}
function asc_menu_WriteParaTabs(_type, _tabs, _stream)
{
    if (undefined === _tabs)
        return;

    _stream["WriteByte"](_type);

    var _len = _tabs.Tabs.length;
    _stream["WriteLong"](_len);

    for (var i = 0; i < _len; i++)
    {
        if (_tabs.Tabs[i].Pos !== undefined && _tabs.Tabs[i].Pos !== null)
        {
            _stream["WriteByte"](0);
            _stream["WriteDouble2"](_tabs.Tabs[i].Pos);
        }
        if (_tabs.Tabs[i].Value !== undefined && _tabs.Tabs[i].Value !== null)
        {
            _stream["WriteByte"](1);
            _stream["WriteLong"](_tabs.Tabs[i].Value);
        }
        _stream["WriteByte"](255);
    }
}

// ASCPARARGAPHFRAME
function asc_menu_ReadParaFrame(_params, _cursor)
{
    var _frame = new CParagraphFrame();
    var _continue = true;
    while (_continue)
    {
        var _attr = _params[_cursor.pos++];
        switch (_attr)
        {
            case 0:
            {
                _frame.FromDropCapMenu = _params[_cursor.pos++];
                break;
            }
            case 1:
            {
                _frame.DropCap = _params[_cursor.pos++];
                break;
            }
            case 2:
            {
                _frame.W = _params[_cursor.pos++];
                break;
            }
            case 3:
            {
                _frame.H = _params[_cursor.pos++];
                break;
            }
            case 4:
            {
                _frame.HAnchor = _params[_cursor.pos++];
                break;
            }
            case 5:
            {
                _frame.HRule = _params[_cursor.pos++];
                break;
            }
            case 6:
            {
                _frame.HSpace = _params[_cursor.pos++];
                break;
            }
            case 7:
            {
                _frame.VAnchor = _params[_cursor.pos++];
                break;
            }
            case 8:
            {
                _frame.VSpace = _params[_cursor.pos++];
                break;
            }
            case 9:
            {
                _frame.X = _params[_cursor.pos++];
                break;
            }
            case 10:
            {
                _frame.Y = _params[_cursor.pos++];
                break;
            }
            case 11:
            {
                _frame.XAlign = _params[_cursor.pos++];
                break;
            }
            case 12:
            {
                _frame.YAlign = _params[_cursor.pos++];
                break;
            }
            case 13:
            {
                _frame.Lines = _params[_cursor.pos++];
                break;
            }
            case 14:
            {
                _frame.Wrap = _params[_cursor.pos++];
                break;
            }
            case 15:
            {
                _frame.Brd = asc_menu_ReadParaBorders(_params, _cursor);
                break;
            }
            case 16:
            {
                _frame.Shd = asc_menu_ReadParaShd(_params, _cursor);
                break;
            }
            case 17:
            {
                _frame.FontFamily = asc_menu_ReadFontFamily(_params, _cursor);
                break;
            }
            case 255:
            default:
            {
                _continue = false;
                break;
            }
        }
    }
    return _frame;
}
function asc_menu_WriteParaFrame(_type, _frame, _stream)
{
    if (undefined === _frame)
        return;

    _stream["WriteByte"](_type);

    if (_frame.FromDropCapMenu !== undefined && _frame.FromDropCapMenu !== null)
    {
        _stream["WriteByte"](0);
        _stream["WriteBool"](_frame.FromDropCapMenu);
    }
    if (_frame.DropCap !== undefined && _frame.DropCap !== null)
    {
        _stream["WriteByte"](1);
        _stream["WriteLong"](_frame.DropCap);
    }
    if (_frame.W !== undefined && _frame.W !== null)
    {
        _stream["WriteByte"](2);
        _stream["WriteDouble2"](_frame.W);
    }
    if (_frame.H !== undefined && _frame.H !== null)
    {
        _stream["WriteByte"](3);
        _stream["WriteDouble2"](_frame.H);
    }
    if (_frame.HAlign !== undefined && _frame.HAlign !== null)
    {
        _stream["WriteByte"](4);
        _stream["WriteLong"](_frame.HAlign);
    }
    if (_frame.HRule !== undefined && _frame.HRule !== null)
    {
        _stream["WriteByte"](5);
        _stream["WriteLong"](_frame.HRule);
    }
    if (_frame.HSpace !== undefined && _frame.HSpace !== null)
    {
        _stream["WriteByte"](6);
        _stream["WriteDouble2"](_frame.HSpace);
    }
    if (_frame.VAnchor !== undefined && _frame.VAnchor !== null)
    {
        _stream["WriteByte"](7);
        _stream["WriteLong"](_frame.VAnchor);
    }
    if (_frame.VSpace !== undefined && _frame.VSpace !== null)
    {
        _stream["WriteByte"](8);
        _stream["WriteDouble2"](_frame.VSpace);
    }
    if (_frame.X !== undefined && _frame.X !== null)
    {
        _stream["WriteByte"](9);
        _stream["WriteDouble2"](_frame.X);
    }
    if (_frame.Y !== undefined && _frame.Y !== null)
    {
        _stream["WriteByte"](10);
        _stream["WriteDouble2"](_frame.Y);
    }
    if (_frame.XAlign !== undefined && _frame.XAlign !== null)
    {
        _stream["WriteByte"](11);
        _stream["WriteLong"](_frame.XAlign);
    }
    if (_frame.YAlign !== undefined && _frame.YAlign !== null)
    {
        _stream["WriteByte"](12);
        _stream["WriteLong"](_frame.YAlign);
    }
    if (_frame.Lines !== undefined && _frame.Lines !== null)
    {
        _stream["WriteByte"](13);
        _stream["WriteLong"](_frame.Lines);
    }
    if (_frame.Wrap !== undefined && _frame.Wrap !== null)
    {
        _stream["WriteByte"](14);
        _stream["WriteLong"](_frame.Wrap);
    }

    asc_menu_WriteParaBorders(15, _frame.Brd, _stream);
    asc_menu_WriteParaShd(16, _frame.Shd, _stream);
    asc_menu_WriteFontFamily(17, _frame.FontFamily, _stream);

    _stream["WriteByte"](255);
}

asc_docs_api.prototype["Call_Menu_Event"] = function(type, _params)
{
    var _current = { pos : 0 };
    var _continue = true;
    switch (type)
    {
        case 1: // ASC_MENU_EVENT_TYPE_TEXTPR
        {
            var _textPr = new CTextPr();
            while (_continue)
            {
                var _attr = _params[_current.pos++];
                switch (_attr)
                {
                    case 0:
                    {
                        _textPr.Bold = _params[_current.pos++];
                        break;
                    }
                    case 1:
                    {
                        _textPr.Italic = _params[_current.pos++];
                        break;
                    }
                    case 2:
                    {
                        _textPr.Underline = _params[_current.pos++];
                        break;
                    }
                    case 3:
                    {
                        _textPr.Strikeout = _params[_current.pos++];
                        break;
                    }
                    case 4:
                    {
                        _textPr.FontFamily = asc_menu_ReadFontFamily(_params, _current);
                        break;
                    }
                    case 5:
                    {
                        _textPr.FontSize = _params[_current.pos++];
                        break;
                    }
                    case 6:
                    {
                        var Unifill = new CUniFill();
                        Unifill.fill = new CSolidFill();
                        var color = asc_menu_ReadColor(_params, _current);
                        Unifill.fill.color = CorrectUniColor(color, Unifill.fill.color, 1);
                        _textPr.Unifill = Unifill;
                        break;
                    }
                    case 7:
                    {
                        _textPr.VertAlign = _params[_current.pos++];
                        break;
                    }
                    case 8:
                    {
                        var color = asc_menu_ReadColor(_params, _current);
                        _textPr.HighLight = { r: color.r, g: color.g, b: color.b };
                        break;
                    }
                    case 9:
                    {
                        _textPr.DStrikeout = _params[_current.pos++];
                        break;
                    }
                    case 10:
                    {
                        _textPr.Caps = _params[_current.pos++];
                        break;
                    }
                    case 11:
                    {
                        _textPr.SmallCaps = _params[_current.pos++];
                        break;
                    }
                    case 12:
                    {
                        _textPr.HighLight = highlight_None;
                    }
                    case 255:
                    default:
                    {
                        _continue = false;
                        break;
                    }
                }
            }

            this.WordControl.m_oLogicDocument.Paragraph_Add(new ParaTextPr(_textPr));
            this.WordControl.m_oLogicDocument.Document_UpdateInterfaceState();
            break;
        }
        case 2: // ASC_MENU_EVENT_TYPE_PARAPR
        {
            var _textPr = undefined;

            while (_continue)
            {
                var _attr = _params[_current.pos++];
                switch (_attr)
                {
                    case 0:
                    {
                        this.WordControl.m_oLogicDocument.Set_ParagraphContextualSpacing( _params[_current.pos++] );
                        break;
                    }
                    case 1:
                    {
                        var _ind = asc_menu_ReadParaInd(_params, _current);
                        this.WordControl.m_oLogicDocument.Set_ParagraphIndent( _ind );
                        break;
                    }
                    case 2:
                    {
                        this.WordControl.m_oLogicDocument.Set_ParagraphKeepLines( _params[_current.pos++] );
                        break;
                    }
                    case 3:
                    {
                        this.WordControl.m_oLogicDocument.Set_ParagraphKeepNext( _params[_current.pos++] );
                        break;
                    }
                    case 4:
                    {
                        this.WordControl.m_oLogicDocument.Set_ParagraphWidowControl( _params[_current.pos++] );
                        break;
                    }
                    case 5:
                    {
                        this.WordControl.m_oLogicDocument.Set_ParagraphPageBreakBefore( _params[_current.pos++] );
                        break;
                    }
                    case 6:
                    {
                        var _spacing = asc_menu_ReadParaSpacing(_params, _current);
                        this.WordControl.m_oLogicDocument.Set_ParagraphSpacing( _spacing );
                        break;
                    }
                    case 7:
                    {
                        // TODO:
                        var _brds = asc_menu_ReadParaBorders(_params, _current);

                        if (_brds.Left && _brds.Left.Color)
                        {
                            _brds.Left.Unifill = CreateUnifillFromAscColor(_brds.Left.Color);
                        }
                        if (_brds.Top && _brds.Top.Color)
                        {
                            _brds.Top.Unifill = CreateUnifillFromAscColor(_brds.Top.Color);
                        }
                        if (_brds.Right && _brds.Right.Color)
                        {
                            _brds.Right.Unifill = CreateUnifillFromAscColor(_brds.Right.Color);
                        }
                        if (_brds.Bottom && _brds.Bottom.Color)
                        {
                            _brds.Bottom.Unifill = CreateUnifillFromAscColor(_brds.Bottom.Color);
                        }

                        this.WordControl.m_oLogicDocument.Set_ParagraphBorders( _brds );
                        break;
                    }
                    case 8:
                    {
                        var _shd = asc_menu_ReadParaShd(_params, _current);
                        this.WordControl.m_oLogicDocument.Set_ParagraphShd( _shd );
                        break;
                    }
                    case 9:
                    case 10:
                    case 11:
                    {
                        // nothing
                        _current.pos++;
                        break;
                    }
                    case 12:
                    {
                        this.WordControl.m_oLogicDocument.Set_DocumentDefaultTab( _params[_current.pos++] );
                        break;
                    }
                    case 13:
                    {
                        var _tabs = asc_menu_ReadParaTabs(_params, _current);
                        // TODO:
                        this.WordControl.m_oLogicDocument.Set_ParagraphTabs( _tabs.Tabs );
                        break;
                    }
                    case 14:
                    {
                        var _framePr = asc_menu_ReadParaFrame(_params, _current);
                        this.WordControl.m_oLogicDocument.Set_ParagraphFramePr( _framePr );
                        break;
                    }
                    case 15:
                    {
                        if (_textPr === undefined)
                            _textPr = new CTextPr();
                        if (true == _params[_current.pos++])
                            _textPr.VertAlign = vertalign_SubScript;
                        else
                            _textPr.VertAlign = vertalign_Baseline;
                        break;
                    }
                    case 16:
                    {
                        if (_textPr === undefined)
                            _textPr = new CTextPr();
                        if (true == _params[_current.pos++])
                            _textPr.VertAlign = vertalign_SuperScript;
                        else
                            _textPr.VertAlign = vertalign_Baseline;
                        break;
                    }
                    case 17:
                    {
                        if (_textPr === undefined)
                            _textPr = new CTextPr();
                        _textPr.SmallCaps = _params[_current.pos++];
                        _textPr.Caps   = false;
                        break;
                    }
                    case 18:
                    {
                        if (_textPr === undefined)
                            _textPr = new CTextPr();
                        _textPr.Caps = _params[_current.pos++];
                        if (true == _textPr.Caps)
                            _textPr.SmallCaps = false;
                        break;
                    }
                    case 19:
                    {
                        if (_textPr === undefined)
                            _textPr = new CTextPr();
                        _textPr.Strikeout  = _params[_current.pos++];
                        _textPr.DStrikeout = false;
                        break;
                    }
                    case 20:
                    {
                        if (_textPr === undefined)
                            _textPr = new CTextPr();
                        _textPr.DStrikeout  = _params[_current.pos++];
                        if (true == _textPr.DStrikeout)
                            _textPr.Strikeout = false;
                        break;
                    }
                    case 21:
                    {
                        if (_textPr === undefined)
                            _textPr = new CTextPr();
                        _textPr.TextSpacing = _params[_current.pos++];
                        break;
                    }
                    case 22:
                    {
                        if (_textPr === undefined)
                            _textPr = new CTextPr();
                        _textPr.Position = _params[_current.pos++];
                        break;
                    }
                    case 23:
                    {
                        var _listType = asc_menu_ReadParaListType(_params, _current);
                        this.WordControl.m_oLogicDocument.Set_ParagraphNumbering( _listType );
                        break;
                    }
                    case 24:
                    {
                        this.WordControl.m_oLogicDocument.Set_ParagraphStyle( _params[_current.pos++] );
                        break;
                    }
                    case 25:
                    {
                        this.WordControl.m_oLogicDocument.Set_ParagraphAlign( _params[_current.pos++] );
                        break;
                    }
                    case 255:
                    default:
                    {
                        _continue = false;
                        break;
                    }
                }
            }

            if (undefined !== _textPr)
                this.WordControl.m_oLogicDocument.Paragraph_Add(new ParaTextPr(_textPr));

            this.WordControl.m_oLogicDocument.Document_UpdateInterfaceState();
            break;
        }
        case 3: // ASC_MENU_EVENT_TYPE_UNDO
        {
            this.WordControl.m_oLogicDocument.Document_Undo();
            break;
        }
        case 4: // ASC_MENU_EVENT_TYPE_REDO
        {
            this.WordControl.m_oLogicDocument.Document_Redo();
            break;
        }
        default:
            break;
    }
};

function asc_menu_WriteParagraphPr(_paraPr, _stream)
{
    if (_paraPr.ContextualSpacing !== undefined && _paraPr.ContextualSpacing !== null)
    {
        _stream["WriteByte"](0);
        _stream["WriteBool"](_paraPr.ContextualSpacing);
    }
    asc_menu_WriteParaInd(1, _paraPr.Ind, _stream);

    if (_paraPr.KeepLines !== undefined && _paraPr.KeepLines !== null)
    {
        _stream["WriteByte"](2);
        _stream["WriteBool"](_paraPr.KeepLines);
    }
    if (_paraPr.KeepNext !== undefined && _paraPr.KeepNext !== null)
    {
        _stream["WriteByte"](3);
        _stream["WriteBool"](_paraPr.KeepNext);
    }
    if (_paraPr.WidowControl !== undefined && _paraPr.WidowControl !== null)
    {
        _stream["WriteByte"](4);
        _stream["WriteBool"](_paraPr.WidowControl);
    }
    if (_paraPr.PageBreakBefore !== undefined && _paraPr.PageBreakBefore !== null)
    {
        _stream["WriteByte"](5);
        _stream["WriteBool"](_paraPr.PageBreakBefore);
    }

    asc_menu_WriteParaSpacing(6, _paraPr.Spacing, _stream);
    asc_menu_WriteParaBorders(7, _paraPr.Brd, _stream);
    asc_menu_WriteParaShd(8, _paraPr.Shd, _stream);

    if (_paraPr.Locked !== undefined && _paraPr.Locked !== null)
    {
        _stream["WriteByte"](9);
        _stream["WriteBool"](_paraPr.Locked);
    }
    if (_paraPr.CanAddTable !== undefined && _paraPr.CanAddTable !== null)
    {
        _stream["WriteByte"](10);
        _stream["WriteBool"](_paraPr.CanAddTable);
    }
    if (_paraPr.CanAddDropCap !== undefined && _paraPr.CanAddDropCap !== null)
    {
        _stream["WriteByte"](11);
        _stream["WriteBool"](_paraPr.CanAddDropCap);
    }

    if (_paraPr.DefaultTab !== undefined && _paraPr.DefaultTab !== null)
    {
        _stream["WriteByte"](12);
        _stream["WriteDouble2"](_paraPr.DefaultTab);
    }

    asc_menu_WriteParaTabs(13, _paraPr.Tabs, _stream);
    asc_menu_WriteParaFrame(14, _paraPr.FramePr, _stream);

    if (_paraPr.Subscript !== undefined && _paraPr.Subscript !== null)
    {
        _stream["WriteByte"](15);
        _stream["WriteBool"](_paraPr.Subscript);
    }
    if (_paraPr.Superscript !== undefined && _paraPr.Superscript !== null)
    {
        _stream["WriteByte"](16);
        _stream["WriteBool"](_paraPr.Superscript);
    }
    if (_paraPr.SmallCaps !== undefined && _paraPr.SmallCaps !== null)
    {
        _stream["WriteByte"](17);
        _stream["WriteBool"](_paraPr.SmallCaps);
    }
    if (_paraPr.AllCaps !== undefined && _paraPr.AllCaps !== null)
    {
        _stream["WriteByte"](18);
        _stream["WriteBool"](_paraPr.AllCaps);
    }
    if (_paraPr.Strikeout !== undefined && _paraPr.Strikeout !== null)
    {
        _stream["WriteByte"](19);
        _stream["WriteBool"](_paraPr.Strikeout);
    }
    if (_paraPr.DStrikeout !== undefined && _paraPr.DStrikeout !== null)
    {
        _stream["WriteByte"](20);
        _stream["WriteBool"](_paraPr.DStrikeout);
    }

    if (_paraPr.TextSpacing !== undefined && _paraPr.TextSpacing !== null)
    {
        _stream["WriteByte"](21);
        _stream["WriteDouble2"](_paraPr.TextSpacing);
    }
    if (_paraPr.Position !== undefined && _paraPr.Position !== null)
    {
        _stream["WriteByte"](22);
        _stream["WriteDouble2"](_paraPr.Position);
    }

    asc_menu_WriteParaListType(23, _paraPr.ListType, _stream);

    if (_paraPr.StyleName !== undefined && _paraPr.StyleName !== null)
    {
        _stream["WriteByte"](24);
        _stream["WriteString2"](_paraPr.StyleName);
    }

    if (_paraPr.Jc !== undefined && _paraPr.Jc !== null)
    {
        _stream["WriteByte"](25);
        _stream["WriteLong"](_paraPr.Jc);
    }

    _stream["WriteByte"](255);
}

asc_docs_api.prototype.UpdateTextPr = function(TextPr)
{
    if (!TextPr)
        return;

    var _stream = global_memory_stream_menu;
    _stream["ClearNoAttack"]();

    if (TextPr.Bold !== undefined)
    {
        _stream["WriteByte"](0);
        _stream["WriteBool"](TextPr.Bold);
    }
    if (TextPr.Italic !== undefined)
    {
        _stream["WriteByte"](1);
        _stream["WriteBool"](TextPr.Italic);
    }
    if (TextPr.Underline !== undefined)
    {
        _stream["WriteByte"](2);
        _stream["WriteBool"](TextPr.Underline);
    }
    if (TextPr.Strikeout !== undefined)
    {
        _stream["WriteByte"](3);
        _stream["WriteBool"](TextPr.Strikeout);
    }

    asc_menu_WriteFontFamily(4, TextPr.FontFamily, _stream);

    if (TextPr.FontSize !== undefined)
    {
        _stream["WriteByte"](5);
        _stream["WriteDouble2"](TextPr.FontSize);
    }

    if (TextPr.Color !== undefined)
    {
        asc_menu_WriteColor(6, CreateAscColorCustom(TextPr.Color.r, TextPr.Color.g, TextPr.Color.b, TextPr.Color.Auto), _stream);
    }

    if (TextPr.VertAlign !== undefined)
    {
        _stream["WriteByte"](7);
        _stream["WriteLong"](TextPr.VertAlign);
    }

    if (TextPr.HighLight !== undefined)
    {
        if (TextPr.HighLight === highlight_None)
        {
            _stream["WriteByte"](12);
        }
        else
        {
            asc_menu_WriteColor(8, CreateAscColorCustom(TextPr.HighLight.r, TextPr.HighLight.g, TextPr.HighLight.b), _stream);
        }
    }

    if (TextPr.DStrikeout !== undefined)
    {
        _stream["WriteByte"](9);
        _stream["WriteBool"](TextPr.DStrikeout);
    }
    if (TextPr.Caps !== undefined)
    {
        _stream["WriteByte"](10);
        _stream["WriteBool"](TextPr.Caps);
    }
    if (TextPr.SmallCaps !== undefined)
    {
        _stream["WriteByte"](11);
        _stream["WriteBool"](TextPr.SmallCaps);
    }

    _stream["WriteByte"](255);

    this.Send_Menu_Event(1);
};

asc_docs_api.prototype.UpdateParagraphProp = function(ParaPr)
{
    // TODO: как только разъединят настройки параграфа и текста переделать тут
    var TextPr = this.WordControl.m_oLogicDocument.Get_Paragraph_TextPr();
    ParaPr.Subscript   = ( TextPr.VertAlign === vertalign_SubScript   ? true : false );
    ParaPr.Superscript = ( TextPr.VertAlign === vertalign_SuperScript ? true : false );
    ParaPr.Strikeout   = TextPr.Strikeout;
    ParaPr.DStrikeout  = TextPr.DStrikeout;
    ParaPr.AllCaps     = TextPr.Caps;
    ParaPr.SmallCaps   = TextPr.SmallCaps;
    ParaPr.TextSpacing = TextPr.Spacing;
    ParaPr.Position    = TextPr.Position;
    //-----------------------------------------------------------------------------

    if ( -1 === ParaPr.PStyle )
        ParaPr.StyleName = "";
    else if ( undefined === ParaPr.PStyle )
        ParaPr.StyleName = this.WordControl.m_oLogicDocument.Styles.Style[this.WordControl.m_oLogicDocument.Styles.Get_Default_Paragraph()].Name;
    else
        ParaPr.StyleName = this.WordControl.m_oLogicDocument.Styles.Style[ParaPr.PStyle].Name;

    var NumType    = -1;
    var NumSubType = -1;
    if ( !(null == ParaPr.NumPr || 0 === ParaPr.NumPr.NumId || "0" === ParaPr.NumPr.NumId) )
    {
        var Numb = this.WordControl.m_oLogicDocument.Numbering.Get_AbstractNum( ParaPr.NumPr.NumId );

        if ( undefined !== Numb && undefined !== Numb.Lvl[ParaPr.NumPr.Lvl] )
        {
            var Lvl = Numb.Lvl[ParaPr.NumPr.Lvl];
            var NumFormat = Lvl.Format;
            var NumText   = Lvl.LvlText;

            if ( numbering_numfmt_Bullet === NumFormat )
            {
                NumType    = 0;
                NumSubType = 0;

                var TextLen = NumText.length;
                if ( 1 === TextLen && numbering_lvltext_Text === NumText[0].Type )
                {
                    var NumVal = NumText[0].Value.charCodeAt(0);

                    if ( 0x00B7 === NumVal )
                        NumSubType = 1;
                    else if ( 0x006F === NumVal )
                        NumSubType = 2;
                    else if ( 0x00A7 === NumVal )
                        NumSubType = 3;
                    else if ( 0x0076 === NumVal )
                        NumSubType = 4;
                    else if ( 0x00D8 === NumVal )
                        NumSubType = 5;
                    else if ( 0x00FC === NumVal )
                        NumSubType = 6;
                    else if ( 0x00A8 === NumVal )
                        NumSubType = 7;
                }
            }
            else
            {
                NumType    = 1;
                NumSubType = 0;

                var TextLen = NumText.length;
                if ( 2 === TextLen && numbering_lvltext_Num === NumText[0].Type && numbering_lvltext_Text === NumText[1].Type )
                {
                    var NumVal2 = NumText[1].Value;

                    if ( numbering_numfmt_Decimal === NumFormat )
                    {
                        if ( "." === NumVal2 )
                            NumSubType = 1;
                        else if ( ")" === NumVal2 )
                            NumSubType = 2;
                    }
                    else if ( numbering_numfmt_UpperRoman === NumFormat )
                    {
                        if ( "." === NumVal2 )
                            NumSubType = 3;
                    }
                    else if ( numbering_numfmt_UpperLetter === NumFormat )
                    {
                        if ( "." === NumVal2 )
                            NumSubType = 4;
                    }
                    else if ( numbering_numfmt_LowerLetter === NumFormat )
                    {
                        if ( ")" === NumVal2 )
                            NumSubType = 5;
                        else if ( "." === NumVal2 )
                            NumSubType = 6;
                    }
                    else if ( numbering_numfmt_LowerRoman === NumFormat )
                    {
                        if ( "." === NumVal2 )
                            NumSubType = 7;
                    }
                }
            }
        }
    }

    ParaPr.ListType = { Type : NumType, SubType : NumSubType };

    if ( undefined !== ParaPr.FramePr && undefined !== ParaPr.FramePr.Wrap )
    {
        if ( wrap_NotBeside === ParaPr.FramePr.Wrap )
            ParaPr.FramePr.Wrap = false;
        else if ( wrap_Around === ParaPr.FramePr.Wrap )
            ParaPr.FramePr.Wrap = true;
        else
            ParaPr.FramePr.Wrap = undefined;
    }

    var _len = this.SelectedObjectsStack.length;
    if (_len > 0)
    {
        if (this.SelectedObjectsStack[_len - 1].Type == c_oAscTypeSelectElement.Paragraph)
        {
            this.SelectedObjectsStack[_len - 1].Value = ParaPr;
            return;
        }
    }

    this.SelectedObjectsStack[this.SelectedObjectsStack.length] = new CSelectedObject( c_oAscTypeSelectElement.Paragraph, ParaPr );
};

asc_docs_api.prototype.Send_Menu_Event = function(type)
{
    window.native["OnCallMenuEvent"](type, global_memory_stream_menu);
};

asc_docs_api.prototype.sync_EndCatchSelectedElements = function()
{
    if (this.WordControl && this.WordControl.m_oDrawingDocument)
        this.WordControl.m_oDrawingDocument.EndTableStylesCheck();

    var _stream = global_memory_stream_menu;
    _stream["ClearNoAttack"]();

    var _count = this.SelectedObjectsStack.length;
    _stream["WriteLong"](_count);

    for (var i = 0; i < _count; i++)
    {
        switch (this.SelectedObjectsStack[i].Type)
        {
            case c_oAscTypeSelectElement.Paragraph:
            {
                _stream["WriteLong"](c_oAscTypeSelectElement.Paragraph);
                //console.log(JSON.stringify(this.SelectedObjectsStack[i].Value));
                asc_menu_WriteParagraphPr(this.SelectedObjectsStack[i].Value, _stream);
                break;
            }
        }
    }

    this.Send_Menu_Event(6);
};

function Deserialize_Table_Markup(_params, _cols, _margins, _rows)
{
    var _markup = new CTableMarkup(null);
    _markup.Internal.RowIndex   = _params[0];
    _markup.Internal.CellIndex  = _params[1];
    _markup.Internal.PageNum    = _params[2];
    _markup.X                   = _params[3];
    _markup.CurCol              = _params[4];
    _markup.CurRow              = _params[5];
    // 6 - DragPos
    _markup.TransformX          = _params[7];
    _markup.TransformY          = _params[8];

    _markup.Cols    = _cols;

    var _len = _margins.length;
    for (var i = 0; i < _len; i += 2)
    {
        _markup.Margins.push({ Left : _margins[i], Right : _margins[i + 1] });
    }

    _len = _rows.length;
    for (var i = 0; i < _len; i += 2)
    {
        _markup.Rows.push({ Y : _rows[i], H : _rows[i + 1] });
    }

    return _markup;
}

// font engine -------------------------------------
var FONT_ITALIC_ANGLE   = 0.3090169943749;
var FT_ENCODING_UNICODE = 1970170211;
var FT_ENCODING_NONE    = 0;
var FT_ENCODING_MS_SYMBOL   = 1937337698;
var FT_ENCODING_APPLE_ROMAN = 1634889070;

var LOAD_MODE = 40970;
var REND_MODE = 0;

var FontStyle =
{
    FontStyleRegular:    0,
    FontStyleBold:       1,
    FontStyleItalic:     2,
    FontStyleBoldItalic: 3,
    FontStyleUnderline:  4,
    FontStyleStrikeout:  8
};

var EGlyphState =
{
    glyphstateNormal:   0,
    glyphstateDeafault: 1,
    glyphstateMiss:     2
};

function CPoint1()
{
    this.fX = 0;
    this.fY = 0;
    this.fWidth = 0;
    this.fHeight = 0;
};

function CPoint2()
{
    this.fLeft = 0;
    this.fTop = 0;
    this.fRight = 0;
    this.fBottom = 0;
};

function CFontManager()
{
    this.m_oLibrary = {};
    this.Initialize = function(){};
};

window["use_native_fonts_only"] = true;
// -------------------------------------------------

// declarate unused methods and objects
window["ftm"] = FT_Memory;
