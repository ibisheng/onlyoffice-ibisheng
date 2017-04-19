/*
 * (c) Copyright Ascensio System SIA 2010-2017
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation. In accordance with
 * Section 7(a) of the GNU AGPL its Section 15 shall be amended to the effect
 * that Ascensio System SIA expressly excludes the warranty of non-infringement
 * of any third-party rights.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For
 * details, see the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia,
 * EU, LV-1021.
 *
 * The  interactive user interfaces in modified source and object code versions
 * of the Program must display Appropriate Legal Notices, as required under
 * Section 5 of the GNU AGPL version 3.
 *
 * Pursuant to Section 7(b) of the License you must retain the original Product
 * logo when distributing the program. Pursuant to Section 7(e) we decline to
 * grant you any rights under trademark law for use of our trademarks.
 *
 * All the Product's GUI elements, including illustrations and icon sets, as
 * well as technical writing content are licensed under the terms of the
 * Creative Commons Attribution-ShareAlike 4.0 International. See the License
 * terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 */

window.IS_NATIVE_EDITOR = true;

window['SockJS'] = createSockJS();

Asc['asc_docs_api'].prototype.Update_ParaInd = function( Ind )
{
    this.WordControl.m_oDrawingDocument.Update_ParaInd(Ind);
};

Asc['asc_docs_api'].prototype.Internal_Update_Ind_Left = function(Left)
{
};

Asc['asc_docs_api'].prototype.Internal_Update_Ind_Right = function(Right)
{
};

// editor
Asc['asc_docs_api'].prototype["NativeAfterLoad"] = function()
{
    this.WordControl.m_oDrawingDocument.AfterLoad();
    this.WordControl.m_oLogicDocument.Set_UseTextShd(false);
};
Asc['asc_docs_api'].prototype["GetNativePageMeta"] = function(pageIndex)
{
    this.WordControl.m_oDrawingDocument.LogicDocument = _api.WordControl.m_oDrawingDocument.m_oLogicDocument;
    this.WordControl.m_oDrawingDocument.RenderPage(pageIndex);
};

// HTML page interface
Asc['asc_docs_api'].prototype["Call_OnUpdateOverlay"] = function(param)
{
    this.WordControl.m_oDrawingDocument.OnUpdateOverlay();
};

Asc['asc_docs_api'].prototype["Call_OnMouseDown"] = function(e)
{
    return this.WordControl.m_oDrawingDocument.OnMouseDown(e);
};
Asc['asc_docs_api'].prototype["Call_OnMouseUp"] = function(e)
{
    return this.WordControl.m_oDrawingDocument.OnMouseUp(e);
};
Asc['asc_docs_api'].prototype["Call_OnMouseMove"] = function(e)
{
    return this.WordControl.m_oDrawingDocument.OnMouseMove(e);
};
Asc['asc_docs_api'].prototype["Call_OnCheckMouseDown"] = function(e)
{
    return this.WordControl.m_oDrawingDocument.OnCheckMouseDown(e);
};

Asc['asc_docs_api'].prototype["Call_OnKeyDown"] = function(e)
{
    this.WordControl.m_oDrawingDocument.OnKeyDown(e);
};
Asc['asc_docs_api'].prototype["Call_OnKeyPress"] = function(e)
{
    this.WordControl.m_oDrawingDocument.OnKeyPress(e);
};
Asc['asc_docs_api'].prototype["Call_OnKeyUp"] = function(e)
{
    this.WordControl.m_oDrawingDocument.OnKeyUp(e);
};
Asc['asc_docs_api'].prototype["Call_OnKeyboardEvent"] = function(e)
{
    this.WordControl.m_oDrawingDocument.OnKeyboardEvent(e);
};

Asc['asc_docs_api'].prototype["Call_CalculateResume"] = function()
{
    Document_Recalculate_Page();
};

Asc['asc_docs_api'].prototype["Call_TurnOffRecalculate"] = function()
{
    this.WordControl.m_oLogicDocument.TurnOff_Recalculate();
};
Asc['asc_docs_api'].prototype["Call_TurnOnRecalculate"] = function()
{
    this.WordControl.m_oLogicDocument.TurnOn_Recalculate();
    this.WordControl.m_oLogicDocument.Recalculate();
};

Asc['asc_docs_api'].prototype["Call_CheckTargetUpdate"] = function()
{
    this.WordControl.m_oDrawingDocument.UpdateTargetFromPaint = true;
    this.WordControl.m_oLogicDocument.CheckTargetUpdate();
    this.WordControl.m_oDrawingDocument.CheckTargetShow();
    this.WordControl.m_oDrawingDocument.UpdateTargetFromPaint = false;

    this.WordControl.m_oDrawingDocument.Collaborative_TargetsUpdate(false);
};

Asc['asc_docs_api'].prototype["Call_Common"] = function(type, param)
{
    switch (type)
    {
        case 1:
        {
            this.WordControl.m_oLogicDocument.MoveCursorLeft();
            break;
        }
        case 67:
        {
            this.startGetDocInfo();
            break;
        }
        case 68:
        {
            this.stopGetDocInfo();
            break;
        }
        default:
            break;
    }
};

Asc['asc_docs_api'].prototype["Call_HR_Tabs"] = function(arrT, arrP)
{
    var _arr = new AscCommonWord.CParaTabs();
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
    if ( false === _logic.Document_Is_SelectionLocked(AscCommon.changestype_Paragraph_Properties) )
    {
        _logic.Create_NewHistoryPoint();
        _logic.SetParagraphTabs(_arr);
    }
};
Asc['asc_docs_api'].prototype["Call_HR_Pr"] = function(_indent_left, _indent_right, _indent_first)
{
    var _logic = this.WordControl.m_oLogicDocument;
    if ( false === _logic.Document_Is_SelectionLocked(AscCommon.changestype_Paragraph_Properties) )
    {
        _logic.Create_NewHistoryPoint();
        _logic.SetParagraphIndent( { Left : _indent_left, Right : _indent_right, FirstLine: _indent_first } );
        _logic.Document_UpdateInterfaceState();
    }
};
Asc['asc_docs_api'].prototype["Call_HR_Margins"] = function(_margin_left, _margin_right)
{
    var _logic = this.WordControl.m_oLogicDocument;
    if ( false === _logic.Document_Is_SelectionLocked(AscCommon.changestype_Document_SectPr) )
    {
        _logic.Create_NewHistoryPoint();
        _logic.Set_DocumentMargin( { Left : _margin_left, Right : _margin_right });
    }
};
Asc['asc_docs_api'].prototype["Call_HR_Table"] = function(_params, _cols, _margins, _rows)
{
    var _logic = this.WordControl.m_oLogicDocument;
    if ( false === _logic.Document_Is_SelectionLocked(AscCommon.changestype_Table_Properties) )
    {
        _logic.Create_NewHistoryPoint();

        var _table_murkup = Deserialize_Table_Markup(_params, _cols, _margins, _rows);
        _table_murkup.Table = this.WordControl.m_oDrawingDocument.Table;

        _table_murkup.CorrectTo();
        _table_murkup.Table.Update_TableMarkupFromRuler(_table_murkup, true, _params[6]);
        _table_murkup.CorrectFrom();
    }
};

Asc['asc_docs_api'].prototype["Call_VR_Margins"] = function(_top, _bottom)
{
    var _logic = this.WordControl.m_oLogicDocument;
    if ( false === _logic.Document_Is_SelectionLocked(AscCommon.changestype_Document_SectPr) )
    {
        _logic.Create_NewHistoryPoint();
        _logic.Set_DocumentMargin( { Top : _top, Bottom : _bottom });
    }
};
Asc['asc_docs_api'].prototype["Call_VR_Header"] = function(_header_top, _header_bottom)
{
    var _logic = this.WordControl.m_oLogicDocument;
    if ( false === _logic.Document_Is_SelectionLocked(AscCommon.changestype_HdrFtr) )
    {
        _logic.Create_NewHistoryPoint();
        _logic.Document_SetHdrFtrBounds(_header_top, _header_bottom);
    }
};
Asc['asc_docs_api'].prototype["Call_VR_Table"] = function(_params, _cols, _margins, _rows)
{
    var _logic = this.WordControl.m_oLogicDocument;
    if ( false === _logic.Document_Is_SelectionLocked(AscCommon.changestype_Table_Properties) )
    {
        _logic.Create_NewHistoryPoint();

        var _table_murkup = Deserialize_Table_Markup(_params, _cols, _margins, _rows);
        _table_murkup.Table = this.WordControl.m_oDrawingDocument.Table;

        _table_murkup.CorrectTo();
        _table_murkup.Table.Update_TableMarkupFromRuler(_table_murkup, false, _params[6]);
        _table_murkup.CorrectFrom();
    }
};

Asc['asc_docs_api'].prototype.GenerateNativeStyles = function()
{
    var StylesPainter = new CStylesPainter();
    StylesPainter.GenerateStyles(this, this.LoadedObjectDS);
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
    if (!_family)
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
    var _color = new Asc.asc_CColor();
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
                    var _mod = new AscFormat.CColorMod();
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
    if (!_color)
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
    if (!_ind)
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
    if (!_spacing)
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
    var _border = new Asc.asc_CTextBorder();
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
    if (!_border)
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
    var _border = new asc_CParagraph();
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
    if (!_borders)
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
    var _shd = new Asc.asc_CParagraphShd();
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
    if (!_shd)
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
    var _list = new AscCommon.asc_CListType();
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
    if (!_list)
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
    var _tabs = new Asc.asc_CParagraphTabs();

    var _count = _params[_cursor.pos++];

    for (var i = 0; i < _count; i++)
    {
        var _tab = new Asc.asc_CParagraphTab();
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
    if (!_tabs)
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
    var _frame = new Asc.asc_CParagraphFrame();
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
    if (!_frame)
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

Asc['asc_docs_api'].prototype["Call_Menu_Event"] = function(type, _params)
{
    if (this.WordControl.m_oDrawingDocument.m_bIsMouseLockDocument)
    {
        // не делаем ничего. Как в веб версии отрубаем клавиатуру
        return undefined;
    }

    var _return = undefined;
    var _current = { pos : 0 };
    var _continue = true;
    switch (type)
    {
        case 1: // ASC_MENU_EVENT_TYPE_TEXTPR
        {
            var _textPr = new AscCommonWord.CTextPr();
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
                        var Unifill = new AscFormat.CUniFill();
                        Unifill.fill = new AscFormat.CSolidFill();
                        var color = asc_menu_ReadColor(_params, _current);
                        Unifill.fill.color = AscFormat.CorrectUniColor(color, Unifill.fill.color, 1);
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
                        _textPr.HighLight = AscCommonWord.highlight_None;
                        break;
                    }
                    case 13:
                    {
                        _textPr.Spacing = _params[_current.pos++];
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

            this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
            this.WordControl.m_oLogicDocument.Paragraph_Add(new AscCommonWord.ParaTextPr(_textPr));
            this.WordControl.m_oLogicDocument.Document_UpdateInterfaceState();
            break;
        }
        case 2: // ASC_MENU_EVENT_TYPE_PARAPR
        {
            var _textPr = undefined;

            this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();

            while (_continue)
            {
                var _attr = _params[_current.pos++];
                switch (_attr)
                {
                    case 0:
                    {
                        this.WordControl.m_oLogicDocument.SetParagraphContextualSpacing( _params[_current.pos++] );
                        break;
                    }
                    case 1:
                    {
                        var _ind = asc_menu_ReadParaInd(_params, _current);
                        this.WordControl.m_oLogicDocument.SetParagraphIndent( _ind );
                        break;
                    }
                    case 2:
                    {
                        this.WordControl.m_oLogicDocument.SetParagraphKeepLines( _params[_current.pos++] );
                        break;
                    }
                    case 3:
                    {
                        this.WordControl.m_oLogicDocument.SetParagraphKeepNext( _params[_current.pos++] );
                        break;
                    }
                    case 4:
                    {
                        this.WordControl.m_oLogicDocument.SetParagraphWidowControl( _params[_current.pos++] );
                        break;
                    }
                    case 5:
                    {
                        this.WordControl.m_oLogicDocument.SetParagraphPageBreakBefore( _params[_current.pos++] );
                        break;
                    }
                    case 6:
                    {
                        var _spacing = asc_menu_ReadParaSpacing(_params, _current);
                        this.WordControl.m_oLogicDocument.SetParagraphSpacing( _spacing );
                        break;
                    }
                    case 7:
                    {
                        // TODO:
                        var _brds = asc_menu_ReadParaBorders(_params, _current);

                        if (_brds.Left && _brds.Left.Color)
                        {
                            _brds.Left.Unifill = AscFormat.CreateUnifillFromAscColor(_brds.Left.Color);
                        }
                        if (_brds.Top && _brds.Top.Color)
                        {
                            _brds.Top.Unifill = AscFormat.CreateUnifillFromAscColor(_brds.Top.Color);
                        }
                        if (_brds.Right && _brds.Right.Color)
                        {
                            _brds.Right.Unifill = AscFormat.CreateUnifillFromAscColor(_brds.Right.Color);
                        }
                        if (_brds.Bottom && _brds.Bottom.Color)
                        {
                            _brds.Bottom.Unifill = AscFormat.CreateUnifillFromAscColor(_brds.Bottom.Color);
                        }

                        this.WordControl.m_oLogicDocument.SetParagraphBorders( _brds );
                        break;
                    }
                    case 8:
                    {
                        var _shd = asc_menu_ReadParaShd(_params, _current);
                        this.WordControl.m_oLogicDocument.SetParagraphShd( _shd );
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
                        this.WordControl.m_oLogicDocument.SetParagraphTabs( _tabs.Tabs );
                        break;
                    }
                    case 14:
                    {
                        var _framePr = asc_menu_ReadParaFrame(_params, _current);
                        this.WordControl.m_oLogicDocument.SetParagraphFramePr( _framePr );
                        break;
                    }
                    case 15:
                    {
                        if (_textPr === undefined)
                            _textPr = new AscCommonWord.CTextPr();
                        if (true == _params[_current.pos++])
                            _textPr.VertAlign = AscCommon.vertalign_SubScript;
                        else
                            _textPr.VertAlign = AscCommon.vertalign_Baseline;
                        break;
                    }
                    case 16:
                    {
                        if (_textPr === undefined)
                            _textPr = new AscCommonWord.CTextPr();
                        if (true == _params[_current.pos++])
                            _textPr.VertAlign = AscCommon.vertalign_SuperScript;
                        else
                            _textPr.VertAlign = AscCommon.vertalign_Baseline;
                        break;
                    }
                    case 17:
                    {
                        if (_textPr === undefined)
                            _textPr = new AscCommonWord.CTextPr();
                        _textPr.SmallCaps = _params[_current.pos++];
                        _textPr.Caps   = false;
                        break;
                    }
                    case 18:
                    {
                        if (_textPr === undefined)
                            _textPr = new AscCommonWord.CTextPr();
                        _textPr.Caps = _params[_current.pos++];
                        if (true == _textPr.Caps)
                            _textPr.SmallCaps = false;
                        break;
                    }
                    case 19:
                    {
                        if (_textPr === undefined)
                            _textPr = new AscCommonWord.CTextPr();
                        _textPr.Strikeout  = _params[_current.pos++];
                        _textPr.DStrikeout = false;
                        break;
                    }
                    case 20:
                    {
                        if (_textPr === undefined)
                            _textPr = new AscCommonWord.CTextPr();
                        _textPr.DStrikeout  = _params[_current.pos++];
                        if (true == _textPr.DStrikeout)
                            _textPr.Strikeout = false;
                        break;
                    }
                    case 21:
                    {
                        if (_textPr === undefined)
                            _textPr = new AscCommonWord.CTextPr();
                        _textPr.TextSpacing = _params[_current.pos++];
                        break;
                    }
                    case 22:
                    {
                        if (_textPr === undefined)
                            _textPr = new AscCommonWord.CTextPr();
                        _textPr.Position = _params[_current.pos++];
                        break;
                    }
                    case 23:
                    {
                        var _listType = asc_menu_ReadParaListType(_params, _current);
                        this.WordControl.m_oLogicDocument.SetParagraphNumbering( _listType );
                        break;
                    }
                    case 24:
                    {
                        this.WordControl.m_oLogicDocument.SetParagraphStyle( _params[_current.pos++] );
                        break;
                    }
                    case 25:
                    {
                        this.WordControl.m_oLogicDocument.SetParagraphAlign( _params[_current.pos++] );
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
                this.WordControl.m_oLogicDocument.Paragraph_Add(new AscCommonWord.ParaTextPr(_textPr));

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
        case 7: // ASC_MENU_EVENT_TYPE_HEADERFOOTER
        {
            var bIsApply = (this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(AscCommon.changestype_HdrFtr) === false) ? true : false;

            if (bIsApply)
                this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();

            while (_continue)
            {
                var _attr = _params[_current.pos++];
                switch (_attr)
                {
                    case 0:
                    {
                        _current.pos++;
                        break;
                    }
                    case 1:
                    {
                        if (bIsApply)
                            this.WordControl.m_oLogicDocument.Document_SetHdrFtrDistance(_params[_current.pos]);

                        _current.pos++;
                        break;
                    }
                    case 2:
                    {
                        if (bIsApply)
                            this.WordControl.m_oLogicDocument.Document_SetHdrFtrFirstPage(_params[_current.pos]);

                        _current.pos++;
                        break;
                    }
                    case 3:
                    {
                        if (bIsApply)
                            this.WordControl.m_oLogicDocument.Document_SetHdrFtrEvenAndOddHeaders(_params[_current.pos]);

                        _current.pos++;
                        break;
                    }
                    case 4:
                    {
                        if (bIsApply)
                            this.WordControl.m_oLogicDocument.Document_SetHdrFtrLink(_params[_current.pos]);

                        _current.pos++;
                        break;
                    }
                    case 5:
                    {
                        _current.pos++;
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

            break;
        }
        case 13: // ASC_MENU_EVENT_TYPE_INCREASEPARAINDENT
        {
            this.IncreaseIndent();
            break;
        }
        case 14: // ASC_MENU_EVENT_TYPE_DECREASEPARAINDENT
        {
            this.DecreaseIndent();
            break;
        }
        case 54: // ASC_MENU_EVENT_TYPE_INSERT_PAGEBREAK
        {
            this.put_AddPageBreak();
            break;
        }
        case 55: // ASC_MENU_EVENT_TYPE_INSERT_LINEBREAK
        {
            this.put_AddLineBreak();
            break;
        }
        case 56: // ASC_MENU_EVENT_TYPE_INSERT_PAGENUMBER
        {
            this.put_PageNum((_params[0] >> 16) & 0xFFFF, _params[0] & 0xFFFF);
            break;
        }
        case 57: // ASC_MENU_EVENT_TYPE_INSERT_SECTIONBREAK
        {
            this.add_SectionBreak(_params[0]);
            break;
        }
        case 10: // ASC_MENU_EVENT_TYPE_TABLE
        {
            var _tablePr = new Asc.CTableProp();
            while (_continue)
            {
                var _attr = _params[_current.pos++];
                switch (_attr)
                {
                    case 0:
                    {
                        _tablePr.CanBeFlow = _params[_current.pos++];
                        break;
                    }
                    case 1:
                    {
                        _tablePr.CellSelect = _params[_current.pos++];
                        break;
                    }
                    case 2:
                    {
                        _tablePr.TableWidth = _params[_current.pos++];
                        break;
                    }
                    case 3:
                    {
                        _tablePr.TableSpacing = _params[_current.pos++];
                        break;
                    }
                    case 4:
                    {
                        _tablePr.TableDefaultMargins = asc_menu_ReadPaddings(_params, _current);
                        break;
                    }
                    case 5:
                    {
                        _tablePr.CellMargins = asc_menu_ReadCellMargins(_params, _current);
                        break;
                    }
                    case 6:
                    {
                        _tablePr.TableAlignment = _params[_current.pos++];
                        break;
                    }
                    case 7:
                    {
                        _tablePr.TableIndent = _params[_current.pos++];
                        break;
                    }
                    case 8:
                    {
                        _tablePr.TableWrappingStyle = _params[_current.pos++];
                        break;
                    }
                    case 9:
                    {
                        _tablePr.TablePaddings = asc_menu_ReadPaddings(_params, _current);
                        break;
                    }
                    case 10:
                    {
                        _tablePr.TableBorders = asc_menu_ReadCellBorders(_params, _current);
                        break;
                    }
                    case 11:
                    {
                        _tablePr.CellBorders = asc_menu_ReadCellBorders(_params, _current);
                        break;
                    }
                    case 12:
                    {
                        _tablePr.TableBackground = asc_menu_ReadCellBackground(_params, _current);
                        break;
                    }
                    case 13:
                    {
                        _tablePr.CellsBackground = asc_menu_ReadCellBackground(_params, _current);
                        break;
                    }
                    case 14:
                    {
                        _tablePr.Position = asc_menu_ReadPosition(_params, _current);
                        break;
                    }
                    case 15:
                    {
                        _tablePr.PositionH = asc_menu_ReadImagePosition(_params, _current);
                        break;
                    }
                    case 16:
                    {
                        _tablePr.PositionV = asc_menu_ReadImagePosition(_params, _current);
                        break;
                    }
                    case 17:
                    {
                        _tablePr.Internal_Position = asc_menu_ReadTableAnchorPosition(_params, _current);
                        break;
                    }
                    case 18:
                    {
                        _tablePr.ForSelectedCells = _params[_current.pos++];
                        break;
                    }
                    case 19:
                    {
                        _tablePr.TableStyle = _params[_current.pos++];
                        break;
                    }
                    case 20:
                    {
                        _tablePr.TableLook = asc_menu_ReadTableLook(_params, _current);
                        break;
                    }
                    case 21:
                    {
                        _tablePr.RowsInHeader = _params[_current.pos++];
                        break;
                    }
                    case 22:
                    {
                        _tablePr.CellsVAlign = _params[_current.pos++];
                        break;
                    }
                    case 23:
                    {
                        _tablePr.AllowOverlap = _params[_current.pos++];
                        break;
                    }
                    case 24:
                    {
                        _tablePr.TableLayout = _params[_current.pos++];
                        break;
                    }
                    case 25:
                    {
                        _tablePr.Locked = _params[_current.pos++];
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

            this.tblApply(_tablePr);
            break;
        }
        case 9 : // ASC_MENU_EVENT_TYPE_IMAGE
        {
            var _imagePr = new Asc.asc_CImgProperty();
            while (_continue)
            {
                var _attr = _params[_current.pos++];
                switch (_attr)
                {
                    case 0:
                    {
                        _imagePr.CanBeFlow = _params[_current.pos++];
                        break;
                    }
                    case 1:
                    {
                        _imagePr.Width = _params[_current.pos++];
                        break;
                    }
                    case 2:
                    {
                        _imagePr.Height = _params[_current.pos++];
                        break;
                    }
                    case 3:
                    {
                        _imagePr.WrappingStyle = _params[_current.pos++];
                        break;
                    }
                    case 4:
                    {
                        _imagePr.Paddings = asc_menu_ReadPaddings(_params, _current);
                        break;
                    }
                    case 5:
                    {
                        _imagePr.Position = asc_menu_ReadPosition(_params, _current);
                        break;
                    }
                    case 6:
                    {
                        _imagePr.AllowOverlap = _params[_current.pos++];
                        break;
                    }
                    case 7:
                    {
                        _imagePr.PositionH = asc_menu_ReadImagePosition(_params, _current);
                        break;
                    }
                    case 8:
                    {
                        _imagePr.PositionV = asc_menu_ReadImagePosition(_params, _current);
                        break;
                    }
                    case 9:
                    {
                        _imagePr.Internal_Position = _params[_current.pos++];
                        break;
                    }
                    case 10:
                    {
                        _imagePr.ImageUrl = _params[_current.pos++];
                        break;
                    }
                    case 11:
                    {
                        _imagePr.Locked = _params[_current.pos++];
                        break;
                    }
                    case 12:
                    {
                        _imagePr.ChartProperties = asc_menu_ReadChartPr(_params, _current);
                        break;
                    }
                    case 13:
                    {
                        _imagePr.ShapeProperties = asc_menu_ReadShapePr(_params, _current);
                        break;
                    }
                    case 14:
                    {
                        _imagePr.ChangeLevel = _params[_current.pos++];
                        break;
                    }
                    case 15:
                    {
                        _imagePr.Group = _params[_current.pos++];
                        break;
                    }
                    case 16:
                    {
                        _imagePr.fromGroup = _params[_current.pos++];
                        break;
                    }
                    case 17:
                    {
                        _imagePr.severalCharts = _params[_current.pos++];
                        break;
                    }
                    case 18:
                    {
                        _imagePr.severalChartTypes = _params[_current.pos++];
                        break;
                    }
                    case 19:
                    {
                        _imagePr.severalChartStyles = _params[_current.pos++];
                        break;
                    }
                    case 20:
                    {
                        _imagePr.verticalTextAlign = _params[_current.pos++];
                        break;
                    }
                    case 21:
                    {
                        var bIsNeed = _params[_current.pos++];

                        if (bIsNeed)
                        {
                            var currImage = this.WordControl.m_oLogicDocument.DrawingObjects.Get_Props();
                            if (currImage && currImage.length) {

                                var _originSize = this.WordControl.m_oDrawingDocument.Native["DD_GetOriginalImageSize"](currImage[0].ImageUrl);

                                var _w = _originSize[0];
                                var _h = _originSize[1];

                                // сбрасываем урл
                                _imagePr.ImageUrl = undefined;

                                var _section_select = this.WordControl.m_oLogicDocument.Get_PageSizesByDrawingObjects();
                                var _page_width = AscCommon.Page_Width;
                                var _page_height = AscCommon.Page_Height;
                                var _page_x_left_margin = AscCommon.X_Left_Margin;
                                var _page_y_top_margin = AscCommon.Y_Top_Margin;
                                var _page_x_right_margin = AscCommon.X_Right_Margin;
                                var _page_y_bottom_margin = AscCommon.Y_Bottom_Margin;

                                if (_section_select)
                                {
                                    if (_section_select.W)
                                        _page_width = _section_select.W;

                                    if (_section_select.H)
                                        _page_height = _section_select.H;
                                }

                                var __w = Math.max(1, _page_width - (_page_x_left_margin + _page_x_right_margin));
                                var __h = Math.max(1, _page_height - (_page_y_top_margin + _page_y_bottom_margin));

                                var wI = (undefined !== _w) ? Math.max(_w * AscCommon.g_dKoef_pix_to_mm, 1) : 1;
                                var hI = (undefined !== _h) ? Math.max(_h * AscCommon.g_dKoef_pix_to_mm, 1) : 1;

                                wI = Math.max(5, Math.min(wI, __w));
                                hI = Math.max(5, Math.min(hI, __h));

                                _imagePr.Width = wI;
                                _imagePr.Height = hI;
                            }
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

            this.ImgApply(_imagePr);
            break;
        }
        case 15: // ASC_MENU_EVENT_TYPE_TABLEMERGECELLS
        {
            this.MergeCells();
            break;
        }
        case 16: // ASC_MENU_EVENT_TYPE_TABLESPLITCELLS
        {
            this.SplitCell(_params[0], _params[1]);
            break;
        }
        case 51: // ASC_MENU_EVENT_TYPE_INSERT_TABLE
        {
            var _rows = 2;
            var _cols = 2;
            var _style = null;

            while (_continue)
            {
                var _attr = _params[_current.pos++];
                switch (_attr)
                {
                    case 0:
                    {
                        _rows = _params[_current.pos++];
                        break;
                    }
                    case 1:
                    {
                        _cols = _params[_current.pos++];
                        break;
                    }
                    case 2:
                    {
                        _style = _params[_current.pos++];
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

            if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(AscCommon.changestype_Document_Content_Add) )
            {
                this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
                this.WordControl.m_oLogicDocument.AddInlineTable(_rows, _cols);

                if (_style != null)
                {
                    this.WordControl.m_oLogicDocument.Set_TableProps({TableStyle : _style});
                }
            }
            break;
        }
        case 50: // ASC_MENU_EVENT_TYPE_INSERT_IMAGE
        {
            var _src = _params[_current.pos++];
            var _w = _params[_current.pos++];
            var _h = _params[_current.pos++];
            var _pageNum = _params[_current.pos++];

            this.AddImageUrlNative(_src, _w, _h, _pageNum);
            break;
        }
        case 53: // ASC_MENU_EVENT_TYPE_INSERT_SHAPE
        {
            var _shapeProp = asc_menu_ReadShapePr(_params, _current);

            var _pageNum = _shapeProp.InsertPageNum;
            // получаем размеры страницы
            var _sectionPr = this.WordControl.m_oLogicDocument.Get_PageLimits(_pageNum);

            var _min = Math.min(_sectionPr.XLimit / 2, _sectionPr.YLimit / 2);

            this.WordControl.m_oLogicDocument.DrawingObjects.addShapeOnPage(_shapeProp.type, _pageNum,
                                                                            _sectionPr.X + _sectionPr.XLimit / 4,
                                                                            _sectionPr.Y + _sectionPr.YLimit / 4,
                                                                            _min,
                                                                            _min);
            //this.StartAddShape(_shapeProp.type, true);
            break;
        }
        case 52: // ASC_MENU_EVENT_TYPE_INSERT_HYPERLINK
        {
            var _props = asc_menu_ReadHyperPr(_params, _current);
            if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(AscCommon.changestype_Paragraph_Content) )
            {
                this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
                this.WordControl.m_oLogicDocument.Hyperlink_Add( _props );
            }
            break;
        }
        case 8: // ASC_MENU_EVENT_TYPE_HYPERLINK
        {
            var _props = asc_menu_ReadHyperPr(_params, _current);
            if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(AscCommon.changestype_Paragraph_Content) )
            {
                this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
                this.WordControl.m_oLogicDocument.Hyperlink_Modify( _props );
            }
            break;
        }
        case 59: // ASC_MENU_EVENT_TYPE_REMOVE_HYPERLINK
        {
            if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(AscCommon.changestype_Paragraph_Content) )
            {
                this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
                this.WordControl.m_oLogicDocument.Hyperlink_Remove();
            }
            break;
        }
        case 58: // ASC_MENU_EVENT_TYPE_CAN_ADD_HYPERLINK
        {
            var bCanAdd = this.WordControl.m_oLogicDocument.Hyperlink_CanAdd(true);

            var _stream = global_memory_stream_menu;
            _stream["ClearNoAttack"]();
            if ( true === bCanAdd )
            {
                var _text = this.WordControl.m_oLogicDocument.Get_SelectedText(true);
                if (null == _text)
                    _stream["WriteByte"](1);
                else
                {
                    _stream["WriteByte"](2);
                    _stream["WriteString2"](_text);
                }
            }
            else
            {
                _stream["WriteByte"](0);
            }
            _return = _stream;
            break;
        }
        case 62: // ASC_MENU_EVENT_TYPE_SEARCH_FINDTEXT
        {
            var _ret = this.asc_findText(_params[0], _params[1], _params[2]);
            var _stream = global_memory_stream_menu;
            _stream["ClearNoAttack"]();
            _stream["WriteLong"](_ret);
            _return = _stream;
            break;
        }
        case 63: // ASC_MENU_EVENT_TYPE_SEARCH_REPLACETEXT
        {
            var _ret = this.asc_replaceText(_params[0], _params[1], _params[2], _params[3]);
            var _stream = global_memory_stream_menu;
            _stream["ClearNoAttack"]();
            _stream["WriteBool"](_ret);
            _return = _stream;
            break;
        }
        case 64: // ASC_MENU_EVENT_TYPE_SEARCH_SELECTRESULTS
        {
            this.asc_selectSearchingResults(_params[0]);
            break;
        }
        case 65: // ASC_MENU_EVENT_TYPE_SEARCH_ISSELECTRESULTS
        {
            var _ret = this.asc_isSelectSearchingResults();
            var _stream = global_memory_stream_menu;
            _stream["ClearNoAttack"]();
            _stream["WriteBool"](_ret);
            _return = _stream;
            break;
        }
        case 67: // ASC_MENU_EVENT_TYPE_STATISTIC_START
        {
            _api.startGetDocInfo();
            break;
        }
        case 68: // ASC_MENU_EVENT_TYPE_STATISTIC_STOP
        {
            _api.stopGetDocInfo();
            break;
        }
        case 17:
        {
            var _sect_width = undefined;
            var _sect_height = undefined;
            var _sect_orient = undefined;

            while (_continue)
            {
                var _attr = _params[_current.pos++];
                switch (_attr)
                {
                    case 0:
                    {
                        _sect_width = _params[_current.pos++];
                        break;
                    }
                    case 1:
                    {
                        _sect_height = _params[_current.pos++];
                        break;
                    }
                    case 2:
                    {
                        // margin_left
                        _current.pos++;
                        break;
                    }
                    case 3:
                    {
                        // margin_top
                        _current.pos++;
                        break;
                    }
                    case 4:
                    {
                        // margin_right
                        _current.pos++;
                        break;
                    }
                    case 5:
                    {
                        // margin_bottom
                        _current.pos++;
                        break;
                    }
                    case 6:
                    {
                        _sect_orient = _params[_current.pos++];
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

            if (undefined !== _sect_width && undefined !== _sect_height)
                this.change_DocSize(_sect_width, _sect_height);

            if (undefined !== _sect_orient)
                this.change_PageOrient(_sect_orient);

            break;
        }
        case 200: // ASC_MENU_EVENT_TYPE_DOCUMENT_BASE64
        {
            var _stream = global_memory_stream_menu;
            _stream["ClearNoAttack"]();
            _stream["WriteStringA"](this["asc_nativeGetFile"]());
            _return = _stream;
            break;
        }
        case 202: // ASC_MENU_EVENT_TYPE_DOCUMENT_PDFBASE64
        {
            var _stream = global_memory_stream_menu;
            _stream["ClearNoAttack"]();
            _stream["WriteStringA"](this.WordControl.m_oDrawingDocument.ToRenderer());
            _return = _stream;
            break;
        }
        case 110: // ASC_MENU_EVENT_TYPE_CONTEXTMENU_COPY
        {
            _return = this.Call_Menu_Context_Copy();
            break;
        }
        case 111 : // ASC_MENU_EVENT_TYPE_CONTEXTMENU_CUT
        {
            _return = this.Call_Menu_Context_Cut();
            break;
        }
        case 112: // ASC_MENU_EVENT_TYPE_CONTEXTMENU_PASTE
        {
            this.Call_Menu_Context_Paste(_params[0], _params[1]);
            break;
        }
        case 113: // ASC_MENU_EVENT_TYPE_CONTEXTMENU_DELETE
        {
            this.Call_Menu_Context_Delete();
            break;
        }
        case 114: // ASC_MENU_EVENT_TYPE_CONTEXTMENU_SELECT
        {
            this.Call_Menu_Context_Select();
            break;
        }
        case 115: // ASC_MENU_EVENT_TYPE_CONTEXTMENU_SELECTALL
        {
            this.Call_Menu_Context_SelectAll();
            break;
        }
        case 201: // ASC_MENU_EVENT_TYPE_DOCUMENT_CHARTSTYLES
        {
            var _typeChart = _params[0];
            this.chartPreviewManager.getChartPreviews(_typeChart);
            _return = global_memory_stream_menu;
            break;
        }
        case 71: // ASC_MENU_EVENT_TYPE_TABLE_INSERTDELETE_ROWCOLUMN
        {
            var _type = 0;
            var _is_add = true;
            var _is_above = true;
            while (_continue)
            {
                var _attr = _params[_current.pos++];
                switch (_attr)
                {
                    case 0:
                    {
                        _type = _params[_current.pos++];
                        break;
                    }
                    case 1:
                    {
                        _is_add = _params[_current.pos++];
                        break;
                    }
                    case 2:
                    {
                        _is_above = _params[_current.pos++];
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

            if (1 == _type)
            {
                if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(AscCommon.changestype_Table_Properties) )
                {
                    this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Document_TableAddColumnLeft);
                    if (_is_add)
                        this.WordControl.m_oLogicDocument.Table_AddCol(!_is_above);
                    else
                        this.WordControl.m_oLogicDocument.Table_RemoveCol();
                }
            }
            else if (2 == _type)
            {
                if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(AscCommon.changestype_Table_Properties) )
                {
                    this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Document_TableAddColumnLeft);
                    if (_is_add)
                        this.WordControl.m_oLogicDocument.Table_AddRow(!_is_above);
                    else
                        this.WordControl.m_oLogicDocument.Table_RemoveRow();
                }
            }

            break;
        }
        case 2415: // ASC_MENU_EVENT_TYPE_CHANGE_COLOR_SCHEME
        {
            if (undefined !== _params) {
                var indexScheme = parseInt(_params);
                this.ChangeColorScheme(indexScheme);
            }
            break;
        }


        case 10000: // ASC_SOCKET_EVENT_TYPE_OPEN
        {
            var t = _api.CoAuthoringApi._CoAuthoringApi;

            t._state = AscCommon.ConnectionState.WaitAuth;
            t.onFirstConnect();

            break;
        }

        case 10010: // ASC_SOCKET_EVENT_TYPE_ON_CLOSE
        {

            break;
        }

        case 10020: // ASC_SOCKET_EVENT_TYPE_MESSAGE
        {
            var t = _api.CoAuthoringApi._CoAuthoringApi;

            var dataObject = JSON.parse(_params);

            // console.log("JS - " + dataObject['type']);

            switch (dataObject['type']) {
              case 'auth'        :
                t._onAuth(dataObject);
                break;
              case 'message'      :
                t._onMessages(dataObject, false);
                break;
              case 'cursor'       :
                t._onCursor(dataObject);
                break;
              case 'meta' :
                t._onMeta(dataObject);
                break;
              case 'getLock'      :
                t._onGetLock(dataObject);
                break;
              case 'releaseLock'    :
                t._onReleaseLock(dataObject);
                break;
              case 'connectState'    :
                t._onConnectionStateChanged(dataObject);
                break;
              case 'saveChanges'    :
                t._onSaveChanges(dataObject);
                break;
              case 'saveLock'      :
                t._onSaveLock(dataObject);
                break;
              case 'unSaveLock'    :
                t._onUnSaveLock(dataObject);
                break;
              case 'savePartChanges'  :
                t._onSavePartChanges(dataObject);
                break;
              case 'drop'        :
                t._onDrop(dataObject);
                break;
              case 'waitAuth'      : /*Ждем, когда придет auth, документ залочен*/
                break;
              case 'error'      : /*Старая версия sdk*/
                t._onDrop(dataObject);
                break;
              case 'documentOpen'    :
                t._documentOpen(dataObject);
                break;
              case 'warning':
                t._onWarning(dataObject);
                break;
              case 'license':
                t._onLicense(dataObject);
                break;
              case 'session' :
                t._onSession(dataObject);
                break;
              case 'refreshToken' :
                t._onRefreshToken(dataObject["messages"]);
                break;
              case 'expiredToken' :
                t._onExpiredToken();
                break;
              }

            break;
        }

        case 11010: // ASC_SOCKET_EVENT_TYPE_ON_DISCONNECT
        {
            break;
        }

        case 11020: // ASC_SOCKET_EVENT_TYPE_TRY_RECONNECT
        {
            var t = _api.CoAuthoringApi._CoAuthoringApi;
            delete t.sockjs;
            t._initSocksJs();
            break;
        }

        case 21000: // ASC_COAUTH_EVENT_TYPE_INSERT_URL_IMAGE
        {
            var urls = JSON.parse(_params[0]);
            AscCommon.g_oDocumentUrls.addUrls(urls);
            var firstUrl;
            for (var i in urls) {
                if (urls.hasOwnProperty(i)) {
                    firstUrl = urls[i];
                    break;
                }
            }

            var _src = firstUrl;
            var _w = _params[1];
            var _h = _params[2];
            var _pageNum = _params[3];

            this.AddImageUrlActionNative(_src, _w, _h, _pageNum);
            break;
        }

        case 21001: // ASC_COAUTH_EVENT_TYPE_LOAD_URL_IMAGE
        {
          _api.WordControl.m_oDrawingDocument.ClearCachePages();
          _api.WordControl.m_oDrawingDocument.FirePaint();

          break;
        }

        case 22001: // ASC_MENU_EVENT_TYPE_SET_PASSWORD
        {
          _api.asc_setDocumentPassword(_params[0]);
          break;
        }

        default:
            break;
    }
    return _return;
};

Asc['asc_docs_api'].prototype.asc_setDocumentPassword = function(password)
{
    var v = {
      "id": this.documentId,
      "userid": this.documentUserId,
      "format": this.documentFormat,
      "c": "reopen",
      "url": this.documentUrl,
      "title": this.documentTitle,
      "embeddedfonts": this.isUseEmbeddedCutFonts,
      "password": password
    };

    AscCommon.sendCommand(this, null, v);
};

function asc_menu_WriteHeaderFooterPr(_hdrftrPr, _stream)
{
    if (_hdrftrPr.Type !== undefined && _hdrftrPr.Type !== null)
    {
        _stream["WriteByte"](0);
        _stream["WriteLong"](_hdrftrPr.Type);
    }
    if (_hdrftrPr.Position !== undefined && _hdrftrPr.Position !== null)
    {
        _stream["WriteByte"](1);
        _stream["WriteDouble2"](_hdrftrPr.Position);
    }

    if (_hdrftrPr.DifferentFirst !== undefined && _hdrftrPr.DifferentFirst !== null)
    {
        _stream["WriteByte"](2);
        _stream["WriteBool"](_hdrftrPr.DifferentFirst);
    }
    if (_hdrftrPr.DifferentEvenOdd !== undefined && _hdrftrPr.DifferentEvenOdd !== null)
    {
        _stream["WriteByte"](3);
        _stream["WriteBool"](_hdrftrPr.DifferentEvenOdd);
    }
    if (_hdrftrPr.LinkToPrevious !== undefined && _hdrftrPr.LinkToPrevious !== null)
    {
        _stream["WriteByte"](4);
        _stream["WriteBool"](_hdrftrPr.LinkToPrevious);
    }
    if (_hdrftrPr.Locked !== undefined && _hdrftrPr.Locked !== null)
    {
        _stream["WriteByte"](5);
        _stream["WriteBool"](_hdrftrPr.DifferentFirst);
    }

    _stream["WriteByte"](255);
}

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

///////////////////////////////////////////////////////////////////////////
// TABLE
///////////////////////////////////////////////////////////////////////////
function asc_menu_ReadPaddings(_params, _cursor)
{
    var _paddings = new Asc.asc_CPaddings();
    var _continue = true;
    while (_continue)
    {
        var _attr = _params[_cursor.pos++];
        switch (_attr)
        {
            case 0:
            {
                _paddings.Left = _params[_cursor.pos++];
                break;
            }
            case 1:
            {
                _paddings.Top = _params[_cursor.pos++];
                break;
            }
            case 2:
            {
                _paddings.Right = _params[_cursor.pos++];
                break;
            }
            case 3:
            {
                _paddings.Bottom = _params[_cursor.pos++];
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
    return _paddings;
}
function asc_menu_WritePaddings(_type, _paddings, _stream)
{
    if (!_paddings)
        return;

    _stream["WriteByte"](_type);

    if (_paddings.Left !== undefined && _paddings.Left !== null)
    {
        _stream["WriteByte"](0);
        _stream["WriteDouble2"](_paddings.Left);
    }
    if (_paddings.Top !== undefined && _paddings.Top !== null)
    {
        _stream["WriteByte"](1);
        _stream["WriteDouble2"](_paddings.Top);
    }
    if (_paddings.Right !== undefined && _paddings.Right !== null)
    {
        _stream["WriteByte"](2);
        _stream["WriteDouble2"](_paddings.Right);
    }
    if (_paddings.Bottom !== undefined && _paddings.Bottom !== null)
    {
        _stream["WriteByte"](3);
        _stream["WriteDouble2"](_paddings.Bottom);
    }

    _stream["WriteByte"](255);
}

function asc_menu_ReadCellMargins(_params, _cursor)
{
    var _paddings = new Asc.CMargins();
    var _continue = true;
    while (_continue)
    {
        var _attr = _params[_cursor.pos++];
        switch (_attr)
        {
            case 0:
            {
                _paddings.Left = _params[_cursor.pos++];
                break;
            }
            case 1:
            {
                _paddings.Top = _params[_cursor.pos++];
                break;
            }
            case 2:
            {
                _paddings.Right = _params[_cursor.pos++];
                break;
            }
            case 3:
            {
                _paddings.Bottom = _params[_cursor.pos++];
                break;
            }
            case 4:
            {
                _paddings.Flag = _params[_cursor.pos++];
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
    return _paddings;
}
function asc_menu_WriteCellMargins(_type, _margins, _stream)
{
    if (!_margins)
        return;

    _stream["WriteByte"](_type);

    if (_margins.Left !== undefined && _margins.Left !== null)
    {
        _stream["WriteByte"](0);
        _stream["WriteDouble2"](_margins.Left);
    }
    if (_margins.Top !== undefined && _margins.Top !== null)
    {
        _stream["WriteByte"](1);
        _stream["WriteDouble2"](_margins.Top);
    }
    if (_margins.Right !== undefined && _margins.Right !== null)
    {
        _stream["WriteByte"](2);
        _stream["WriteDouble2"](_margins.Right);
    }
    if (_margins.Bottom !== undefined && _margins.Bottom !== null)
    {
        _stream["WriteByte"](3);
        _stream["WriteDouble2"](_margins.Bottom);
    }
    if (_margins.Flag !== undefined && _margins.Flag !== null)
    {
        _stream["WriteByte"](4);
        _stream["WriteLong"](_margins.Flag);
    }

    _stream["WriteByte"](255);
}

function asc_menu_ReadCellBorders(_params, _cursor)
{
    var _borders = new Asc.CBorders();
    var _continue = true;
    while (_continue)
    {
        var _attr = _params[_cursor.pos++];
        switch (_attr)
        {
            case 0:
            {
                _borders.Left = asc_menu_ReadParaBorder(_params, _cursor);
                break;
            }
            case 1:
            {
                _borders.Top = asc_menu_ReadParaBorder(_params, _cursor);
                break;
            }
            case 2:
            {
                _borders.Right = asc_menu_ReadParaBorder(_params, _cursor);
                break;
            }
            case 3:
            {
                _borders.Bottom = asc_menu_ReadParaBorder(_params, _cursor);
                break;
            }
            case 4:
            {
                _borders.InsideH = asc_menu_ReadParaBorder(_params, _cursor);
                break;
            }
            case 5:
            {
                _borders.InsideV = asc_menu_ReadParaBorder(_params, _cursor);
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
    return _borders;
}
function asc_menu_WriteCellBorders(_type, _borders, _stream)
{
    if (!_borders)
        return;

    _stream["WriteByte"](_type);

    asc_menu_WriteParaBorder(0, _borders.Left, _stream);
    asc_menu_WriteParaBorder(1, _borders.Top, _stream);
    asc_menu_WriteParaBorder(2, _borders.Right, _stream);
    asc_menu_WriteParaBorder(3, _borders.Bottom, _stream);
    asc_menu_WriteParaBorder(4, _borders.InsideH, _stream);
    asc_menu_WriteParaBorder(5, _borders.InsideV, _stream);

    _stream["WriteByte"](255);
}

function asc_menu_ReadCellBackground(_params, _cursor)
{
    var _background = new Asc.CBackground();
    var _continue = true;
    while (_continue)
    {
        var _attr = _params[_cursor.pos++];
        switch (_attr)
        {
            case 0:
            {
                _background.Color = asc_menu_ReadColor(_params, _cursor);
                break;
            }
            case 1:
            {
                _background.Value = _params[_cursor.pos++];
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
    return _background;
}
function asc_menu_WriteCellBackground(_type, _background, _stream)
{
    if (!_background)
        return;

    _stream["WriteByte"](_type);

    asc_menu_WriteColor(0, _background.Color, _stream);

    if (_background.Value !== undefined && _background.Value !== null)
    {
        _stream["WriteByte"](1);
        _stream["WriteLong"](_background.Value);
    }

    _stream["WriteByte"](255);
}

function asc_menu_ReadPosition(_params, _cursor)
{
    var _position = new Asc.CPosition();
    var _continue = true;
    while (_continue)
    {
        var _attr = _params[_cursor.pos++];
        switch (_attr)
        {
            case 0:
            {
                _position.X = _params[_cursor.pos++];
                break;
            }
            case 1:
            {
                _position.Y = _params[_cursor.pos++];
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
    return _position;
}
function asc_menu_WritePosition(_type, _position, _stream)
{
    if (!_position)
        return;

    _stream["WriteByte"](_type);

    if (_position.X !== undefined && _position.X !== null)
    {
        _stream["WriteByte"](0);
        _stream["WriteDouble2"](_position.X);
    }
    if (_position.Y !== undefined && _position.Y !== null)
    {
        _stream["WriteByte"](1);
        _stream["WriteDouble2"](_position.Y);
    }

    _stream["WriteByte"](255);
}

function asc_menu_ReadImagePosition(_params, _cursor)
{
    var _position = new Asc.CPosition();
    var _continue = true;
    while (_continue)
    {
        var _attr = _params[_cursor.pos++];
        switch (_attr)
        {
            case 0:
            {
                _position.RelativeFrom = _params[_cursor.pos++];
                break;
            }
            case 1:
            {
                _position.UseAlign = _params[_cursor.pos++];
                break;
            }
            case 2:
            {
                _position.Align = _params[_cursor.pos++];
                break;
            }
            case 3:
            {
                _position.Value = _params[_cursor.pos++];
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
    return _position;
}
function asc_menu_WriteImagePosition(_type, _position, _stream)
{
    if (!_position)
        return;

    _stream["WriteByte"](_type);

    if (_position.RelativeFrom !== undefined && _position.RelativeFrom !== null)
    {
        _stream["WriteByte"](0);
        _stream["WriteLong"](_position.RelativeFrom);
    }
    if (_position.UseAlign !== undefined && _position.UseAlign !== null)
    {
        _stream["WriteByte"](1);
        _stream["WriteBool"](_position.UseAlign);
    }
    if (_position.Align !== undefined && _position.Align !== null)
    {
        _stream["WriteByte"](2);
        _stream["WriteLong"](_position.Align);
    }
    if (_position.Value !== undefined && _position.Value !== null)
    {
        _stream["WriteByte"](3);
        _stream["WriteLong"](_position.Value);
    }

    _stream["WriteByte"](255);
}

function asc_menu_ReadTableAnchorPosition(_params, _cursor)
{
    var _position = new CTableAnchorPosition();

    _position.CalcX = _params[_cursor.pos++];
    _position.CalcY = _params[_cursor.pos++];
    _position.W = _params[_cursor.pos++];
    _position.H = _params[_cursor.pos++];
    _position.X = _params[_cursor.pos++];
    _position.Y = _params[_cursor.pos++];
    _position.Left_Margin = _params[_cursor.pos++];
    _position.Right_Margin = _params[_cursor.pos++];
    _position.Top_Margin = _params[_cursor.pos++];
    _position.Bottom_Margin = _params[_cursor.pos++];
    _position.Page_W = _params[_cursor.pos++];
    _position.Page_H = _params[_cursor.pos++];
    _position.X_min = _params[_cursor.pos++];
    _position.Y_min = _params[_cursor.pos++];
    _position.X_max = _params[_cursor.pos++];
    _position.Y_max = _params[_cursor.pos++];

    _cursor.pos++;
}
function asc_menu_WriteTableAnchorPosition(_type, _position, _stream)
{
    if (!_position)
        return;

    _stream["WriteByte"](_type);

    _stream["WriteDouble2"](_position.CalcX);
    _stream["WriteDouble2"](_position.CalcY);
    _stream["WriteDouble2"](_position.W);
    _stream["WriteDouble2"](_position.H);
    _stream["WriteDouble2"](_position.X);
    _stream["WriteDouble2"](_position.Y);
    _stream["WriteDouble2"](_position.Left_Margin);
    _stream["WriteDouble2"](_position.Right_Margin);
    _stream["WriteDouble2"](_position.Top_Margin);
    _stream["WriteDouble2"](_position.Bottom_Margin);
    _stream["WriteDouble2"](_position.Page_W);
    _stream["WriteDouble2"](_position.Page_H);
    _stream["WriteDouble2"](_position.X_min);
    _stream["WriteDouble2"](_position.Y_min);
    _stream["WriteDouble2"](_position.X_max);
    _stream["WriteDouble2"](_position.Y_max);

    _stream["WriteByte"](255);
}

function asc_menu_ReadTableLook(_params, _cursor)
{
    var _position = new CTableLook();
    var _continue = true;
    while (_continue)
    {
        var _attr = _params[_cursor.pos++];
        switch (_attr)
        {
            case 0:
            {
                _position.FirstCol = _params[_cursor.pos++];
                break;
            }
            case 1:
            {
                _position.FirstRow = _params[_cursor.pos++];
                break;
            }
            case 2:
            {
                _position.LastCol = _params[_cursor.pos++];
                break;
            }
            case 3:
            {
                _position.LastRow = _params[_cursor.pos++];
                break;
            }
            case 4:
            {
                _position.BandHor = _params[_cursor.pos++];
                break;
            }
            case 5:
            {
                _position.BandVer = _params[_cursor.pos++];
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
    return _position;
}
function asc_menu_WriteTableLook(_type, _look, _stream)
{
    if (!_look)
        return;

    _stream["WriteByte"](_type);

    if (_look.FirstCol !== undefined && _look.FirstCol !== null)
    {
        _stream["WriteByte"](0);
        _stream["WriteBool"](_look.FirstCol);
    }
    if (_look.FirstRow !== undefined && _look.FirstRow !== null)
    {
        _stream["WriteByte"](1);
        _stream["WriteBool"](_look.FirstRow);
    }
    if (_look.LastCol !== undefined && _look.LastCol !== null)
    {
        _stream["WriteByte"](2);
        _stream["WriteBool"](_look.LastCol);
    }
    if (_look.LastRow !== undefined && _look.LastRow !== null)
    {
        _stream["WriteByte"](3);
        _stream["WriteBool"](_look.LastRow);
    }
    if (_look.BandHor !== undefined && _look.BandHor !== null)
    {
        _stream["WriteByte"](4);
        _stream["WriteBool"](_look.BandHor);
    }
    if (_look.BandVer !== undefined && _look.BandVer !== null)
    {
        _stream["WriteByte"](5);
        _stream["WriteBool"](_look.BandVer);
    }

    _stream["WriteByte"](255);
}

function asc_menu_WriteTablePr(_tablePr, _stream)
{
    if (_tablePr.CanBeFlow !== undefined && _tablePr.CanBeFlow !== null)
    {
        _stream["WriteByte"](0);
        _stream["WriteBool"](_tablePr.CanBeFlow);
    }
    if (_tablePr.CellSelect !== undefined && _tablePr.CellSelect !== null)
    {
        _stream["WriteByte"](1);
        _stream["WriteBool"](_tablePr.CellSelect);
    }
    if (_tablePr.TableWidth !== undefined && _tablePr.TableWidth !== null)
    {
        _stream["WriteByte"](2);
        _stream["WriteDouble2"](_tablePr.TableWidth);
    }
    if (_tablePr.TableSpacing !== undefined && _tablePr.TableSpacing !== null)
    {
        _stream["WriteByte"](3);
        _stream["WriteDouble2"](_tablePr.TableSpacing);
    }

    asc_menu_WritePaddings(4, _tablePr.TableDefaultMargins, _stream);
    asc_menu_WriteCellMargins(5, _tablePr.CellMargins, _stream);

    if (_tablePr.TableAlignment !== undefined && _tablePr.TableAlignment !== null)
    {
        _stream["WriteByte"](6);
        _stream["WriteLong"](_tablePr.TableAlignment);
    }
    if (_tablePr.TableIndent !== undefined && _tablePr.TableIndent !== null)
    {
        _stream["WriteByte"](7);
        _stream["WriteDouble2"](_tablePr.TableIndent);
    }
    if (_tablePr.TableWrappingStyle !== undefined && _tablePr.TableWrappingStyle !== null)
    {
        _stream["WriteByte"](8);
        _stream["WriteLong"](_tablePr.TableWrappingStyle);
    }

    asc_menu_WritePaddings(9, _tablePr.TablePaddings, _stream);

    asc_menu_WriteCellBorders(10, _tablePr.TableBorders, _stream);
    asc_menu_WriteCellBorders(11, _tablePr.CellBorders, _stream);

    asc_menu_WriteCellBackground(12, _tablePr.TableBackground, _stream);
    asc_menu_WriteCellBackground(13, _tablePr.CellsBackground, _stream);

    asc_menu_WritePosition(14, _tablePr.Position, _stream);
    asc_menu_WriteImagePosition(15, _tablePr.PositionH, _stream);
    asc_menu_WriteImagePosition(16, _tablePr.PositionV, _stream);

    asc_menu_WriteTableAnchorPosition(17, _tablePr.Internal_Position, _stream);

    if (_tablePr.ForSelectedCells !== undefined && _tablePr.ForSelectedCells !== null)
    {
        _stream["WriteByte"](18);
        _stream["WriteBool"](_tablePr.ForSelectedCells);
    }
    if (_tablePr.TableStyle !== undefined && _tablePr.TableStyle !== null)
    {
        _stream["WriteByte"](19);
        _stream["WriteString2"](_tablePr.TableStyle);
    }

    asc_menu_WriteTableLook(20, _tablePr.TableLook, _stream);

    if (_tablePr.RowsInHeader !== undefined && _tablePr.RowsInHeader !== null)
    {
        _stream["WriteByte"](21);
        _stream["WriteLong"](_tablePr.RowsInHeader);
    }
    if (_tablePr.CellsVAlign !== undefined && _tablePr.CellsVAlign !== null)
    {
        _stream["WriteByte"](22);
        _stream["WriteLong"](_tablePr.CellsVAlign);
    }
    if (_tablePr.AllowOverlap !== undefined && _tablePr.AllowOverlap !== null)
    {
        _stream["WriteByte"](23);
        _stream["WriteBool"](_tablePr.AllowOverlap);
    }
    if (_tablePr.TableLayout !== undefined && _tablePr.TableLayout !== null)
    {
        _stream["WriteByte"](24);
        _stream["WriteLong"](_tablePr.TableLayout);
    }
    if (_tablePr.Locked !== undefined && _tablePr.Locked !== null)
    {
        _stream["WriteByte"](25);
        _stream["WriteBool"](_tablePr.Locked);
    }

    _stream["WriteByte"](255);
};

///////////////////////////////////////////////////////////////////////////
// IMAGE
///////////////////////////////////////////////////////////////////////////
function asc_menu_ReadAscValAxisSettings(_params, _cursor)
{
    var _settings = new AscCommon.asc_ValAxisSettings();

    var _continue = true;
    while (_continue)
    {
        var _attr = _params[_cursor.pos++];
        switch (_attr)
        {
            case 0:
            {
                _settings.minValRule = _params[_cursor.pos++];
                break;
            }
            case 1:
            {
                _settings.minVal = _params[_cursor.pos++];
                break;
            }
            case 2:
            {
                _settings.maxValRule = _params[_cursor.pos++];
                break;
            }
            case 3:
            {
                _settings.maxVal = _params[_cursor.pos++];
                break;
            }
            case 4:
            {
                _settings.invertValOrder = _params[_cursor.pos++];
                break;
            }
            case 5:
            {
                _settings.logScale = _params[_cursor.pos++];
                break;
            }
            case 6:
            {
                _settings.logBase = _params[_cursor.pos++];
                break;
            }
            case 7:
            {
                _settings.dispUnitsRule = _params[_cursor.pos++];
                break;
            }
            case 8:
            {
                _settings.units = _params[_cursor.pos++];
                break;
            }
            case 9:
            {
                _settings.showUnitsOnChart = _params[_cursor.pos++];
                break;
            }
            case 10:
            {
                _settings.majorTickMark = _params[_cursor.pos++];
                break;
            }
            case 11:
            {
                _settings.minorTickMark = _params[_cursor.pos++];
                break;
            }
            case 12:
            {
                _settings.tickLabelsPos = _params[_cursor.pos++];
                break;
            }
            case 13:
            {
                _settings.crossesRule = _params[_cursor.pos++];
                break;
            }
            case 14:
            {
                _settings.crosses = _params[_cursor.pos++];
                break;
            }
            case 15:
            {
                _settings.axisType = _params[_cursor.pos++];
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

    return _settings;
};
function asc_menu_WriteAscValAxisSettings(_type, _settings, _stream)
{
    if (!_settings)
        return;

    _stream["WriteByte"](_type);

    if (_settings.minValRule !== undefined && _settings.minValRule !== null)
    {
        _stream["WriteByte"](0);
        _stream["WriteLong"](_settings.minValRule);
    }
    if (_settings.minVal !== undefined && _settings.minVal !== null)
    {
        _stream["WriteByte"](1);
        _stream["WriteLong"](_settings.minVal);
    }
    if (_settings.maxValRule !== undefined && _settings.maxValRule !== null)
    {
        _stream["WriteByte"](2);
        _stream["WriteLong"](_settings.maxValRule);
    }
    if (_settings.maxVal !== undefined && _settings.maxVal !== null)
    {
        _stream["WriteByte"](3);
        _stream["WriteLong"](_settings.maxVal);
    }
    if (_settings.invertValOrder !== undefined && _settings.invertValOrder !== null)
    {
        _stream["WriteByte"](4);
        _stream["WriteBool"](_settings.invertValOrder);
    }
    if (_settings.logScale !== undefined && _settings.logScale !== null)
    {
        _stream["WriteByte"](5);
        _stream["WriteBool"](_settings.logScale);
    }
    if (_settings.logBase !== undefined && _settings.logBase !== null)
    {
        _stream["WriteByte"](6);
        _stream["WriteLong"](_settings.logBase);
    }
    if (_settings.dispUnitsRule !== undefined && _settings.dispUnitsRule !== null)
    {
        _stream["WriteByte"](7);
        _stream["WriteLong"](_settings.dispUnitsRule);
    }
    if (_settings.units !== undefined && _settings.units !== null)
    {
        _stream["WriteByte"](8);
        _stream["WriteLong"](_settings.units);
    }
    if (_settings.showUnitsOnChart !== undefined && _settings.showUnitsOnChart !== null)
    {
        _stream["WriteByte"](9);
        _stream["WriteBool"](_settings.showUnitsOnChart);
    }
    if (_settings.majorTickMark !== undefined && _settings.majorTickMark !== null)
    {
        _stream["WriteByte"](10);
        _stream["WriteLong"](_settings.majorTickMark);
    }
    if (_settings.minorTickMark !== undefined && _settings.minorTickMark !== null)
    {
        _stream["WriteByte"](11);
        _stream["WriteLong"](_settings.minorTickMark);
    }
    if (_settings.tickLabelsPos !== undefined && _settings.tickLabelsPos !== null)
    {
        _stream["WriteByte"](12);
        _stream["WriteLong"](_settings.tickLabelsPos);
    }
    if (_settings.crossesRule !== undefined && _settings.crossesRule !== null)
    {
        _stream["WriteByte"](13);
        _stream["WriteLong"](_settings.crossesRule);
    }
    if (_settings.crosses !== undefined && _settings.crosses !== null)
    {
        _stream["WriteByte"](14);
        _stream["WriteLong"](_settings.crosses);
    }
    if (_settings.axisType !== undefined && _settings.axisType !== null)
    {
        _stream["WriteByte"](15);
        _stream["WriteLong"](_settings.axisType);
    }

    _stream["WriteByte"](255);
};

function asc_menu_ReadChartPr(_params, _cursor)
{
    var _settings = new AscCommon.asc_ChartSettings();

    var _continue = true;
    while (_continue)
    {
        var _attr = _params[_cursor.pos++];
        switch (_attr)
        {
            case 0:
            {
                _settings.style = _params[_cursor.pos++];
                break;
            }
            case 1:
            {
                _settings.title = _params[_cursor.pos++];
                break;
            }
            case 2:
            {
                _settings.rowCols = _params[_cursor.pos++];
                break;
            }
            case 3:
            {
                _settings.horAxisLabel = _params[_cursor.pos++];
                break;
            }
            case 4:
            {
                _settings.vertAxisLabel = _params[_cursor.pos++];
                break;
            }
            case 5:
            {
                _settings.legendPos = _params[_cursor.pos++];
                break;
            }
            case 6:
            {
                _settings.dataLabelsPos = _params[_cursor.pos++];
                break;
            }
            case 7:
            {
                _settings.horAx = _params[_cursor.pos++];
                break;
            }
            case 8:
            {
                _settings.vertAx = _params[_cursor.pos++];
                break;
            }
            case 9:
            {
                _settings.horGridLines = _params[_cursor.pos++];
                break;
            }
            case 10:
            {
                _settings.vertGridLines = _params[_cursor.pos++];
                break;
            }
            case 11:
            {
                _settings.type = _params[_cursor.pos++];
                break;
            }
            case 12:
            {
                _settings.showSerName = _params[_cursor.pos++];
                break;
            }
            case 13:
            {
                _settings.showCatName = _params[_cursor.pos++];
                break;
            }
            case 14:
            {
                _settings.showVal = _params[_cursor.pos++];
                break;
            }
            case 15:
            {
                _settings.separator = _params[_cursor.pos++];
                break;
            }
            case 16:
            {
                _settings.horAxisProps = asc_menu_ReadAscValAxisSettings(_params, _cursor);
                break;
            }
            case 17:
            {
                _settings.vertAxisProps = asc_menu_ReadAscValAxisSettings(_params, _cursor);
                break;
            }
            case 18:
            {
                _settings.range = _params[_cursor.pos++];
                break;
            }
            case 19:
            {
                _settings.inColumns = _params[_cursor.pos++];
                break;
            }
            case 20:
            {
                _settings.showMarker = _params[_cursor.pos++];
                break;
            }
            case 21:
            {
                _settings.bLine = _params[_cursor.pos++];
                break;
            }
            case 22:
            {
                _settings.smooth = _params[_cursor.pos++];
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

    return _settings;
};
function asc_menu_WriteChartPr(_type, _chartPr, _stream)
{
    if (!_chartPr)
        return;

    _stream["WriteByte"](_type);

    if (_chartPr.style !== undefined && _chartPr.style !== null)
    {
        _stream["WriteByte"](0);
        _stream["WriteLong"](_chartPr.style);
    }
    if (_chartPr.title !== undefined && _chartPr.title !== null)
    {
        _stream["WriteByte"](1);
        _stream["WriteLong"](_chartPr.title);
    }
    if (_chartPr.rowCols !== undefined && _chartPr.rowCols !== null)
    {
        _stream["WriteByte"](2);
        _stream["WriteLong"](_chartPr.rowCols);
    }
    if (_chartPr.horAxisLabel !== undefined && _chartPr.horAxisLabel !== null)
    {
        _stream["WriteByte"](3);
        _stream["WriteLong"](_chartPr.horAxisLabel);
    }
    if (_chartPr.vertAxisLabel !== undefined && _chartPr.vertAxisLabel !== null)
    {
        _stream["WriteByte"](4);
        _stream["WriteLong"](_chartPr.vertAxisLabel);
    }
    if (_chartPr.legendPos !== undefined && _chartPr.legendPos !== null)
    {
        _stream["WriteByte"](5);
        _stream["WriteLong"](_chartPr.legendPos);
    }
    if (_chartPr.dataLabelsPos !== undefined && _chartPr.dataLabelsPos !== null)
    {
        _stream["WriteByte"](6);
        _stream["WriteLong"](_chartPr.dataLabelsPos);
    }
    if (_chartPr.horAx !== undefined && _chartPr.horAx !== null)
    {
        _stream["WriteByte"](7);
        _stream["WriteLong"](_chartPr.horAx);
    }
    if (_chartPr.vertAx !== undefined && _chartPr.vertAx !== null)
    {
        _stream["WriteByte"](8);
        _stream["WriteLong"](_chartPr.vertAx);
    }
    if (_chartPr.horGridLines !== undefined && _chartPr.horGridLines !== null)
    {
        _stream["WriteByte"](9);
        _stream["WriteLong"](_chartPr.horGridLines);
    }
    if (_chartPr.vertGridLines !== undefined && _chartPr.vertGridLines !== null)
    {
        _stream["WriteByte"](10);
        _stream["WriteLong"](_chartPr.vertGridLines);
    }
    if (_chartPr.type !== undefined && _chartPr.type !== null)
    {
        _stream["WriteByte"](11);
        _stream["WriteLong"](_chartPr.type);
    }

    if (_chartPr.showSerName !== undefined && _chartPr.showSerName !== null)
    {
        _stream["WriteByte"](12);
        _stream["WriteBool"](_chartPr.showSerName);
    }
    if (_chartPr.showCatName !== undefined && _chartPr.showCatName !== null)
    {
        _stream["WriteByte"](13);
        _stream["WriteBool"](_chartPr.showCatName);
    }
    if (_chartPr.showVal !== undefined && _chartPr.showVal !== null)
    {
        _stream["WriteByte"](14);
        _stream["WriteBool"](_chartPr.showVal);
    }

    if (_chartPr.separator !== undefined && _chartPr.separator !== null)
    {
        _stream["WriteByte"](15);
        _stream["WriteString2"](_chartPr.separator);
    }

    asc_menu_WriteAscValAxisSettings(16, _chartPr.horAxisProps, _stream);
    asc_menu_WriteAscValAxisSettings(17, _chartPr.vertAxisProps, _stream);

    if (_chartPr.range !== undefined && _chartPr.range !== null)
    {
        _stream["WriteByte"](18);
        _stream["WriteString2"](_chartPr.range);
    }

    if (_chartPr.inColumns !== undefined && _chartPr.inColumns !== null)
    {
        _stream["WriteByte"](19);
        _stream["WriteBool"](_chartPr.inColumns);
    }
    if (_chartPr.showMarker !== undefined && _chartPr.showMarker !== null)
    {
        _stream["WriteByte"](20);
        _stream["WriteBool"](_chartPr.showMarker);
    }
    if (_chartPr.bLine !== undefined && _chartPr.bLine !== null)
    {
        _stream["WriteByte"](21);
        _stream["WriteBool"](_chartPr.bLine);
    }
    if (_chartPr.smooth !== undefined && _chartPr.smooth !== null)
    {
        _stream["WriteByte"](22);
        _stream["WriteBool"](_chartPr.showVal);
    }

    _stream["WriteByte"](255);
};

function asc_menu_ReadAscFill_solid(_params, _cursor)
{
    var _fill = new Asc.asc_CFillSolid();

    var _continue = true;
    while (_continue)
    {
        var _attr = _params[_cursor.pos++];
        switch (_attr)
        {
            case 0:
            {
                _fill.color = asc_menu_ReadColor(_params, _cursor);
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

    return _fill;
};
function asc_menu_WriteAscFill_solid(_type, _fill, _stream)
{
    if (!_fill)
        return;

    _stream["WriteByte"](_type);

    asc_menu_WriteColor(0, _fill.color, _stream);

    _stream["WriteByte"](255);
};
function asc_menu_ReadAscFill_patt(_params, _cursor)
{
    var _fill = new Asc.asc_CFillHatch();

    var _continue = true;
    while (_continue)
    {
        var _attr = _params[_cursor.pos++];
        switch (_attr)
        {
            case 0:
            {
                _fill.PatternType = _params[_cursor.pos++];
                break;
            }
            case 1:
            {
                _fill.bgClr = asc_menu_ReadColor(_params, _cursor);
                break;
            }
            case 2:
            {
                _fill.fgClr = asc_menu_ReadColor(_params, _cursor);
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

    return _fill;
};
function asc_menu_WriteAscFill_patt(_type, _fill, _stream)
{
    if (!_fill)
        return;

    _stream["WriteByte"](_type);

    if (_fill.PatternType !== undefined && _fill.PatternType !== null)
    {
        _stream["WriteByte"](0);
        _stream["WriteLong"](_fill.PatternType);
    }

    asc_menu_WriteColor(1, _fill.bgClr, _stream);
    asc_menu_WriteColor(2, _fill.fgClr, _stream);

    _stream["WriteByte"](255);
};
function asc_menu_ReadAscFill_grad(_params, _cursor)
{
    var _fill = new Asc.asc_CFillGrad();

    var _continue = true;
    while (_continue)
    {
        var _attr = _params[_cursor.pos++];
        switch (_attr)
        {
            case 0:
            {
                _fill.GradType = _params[_cursor.pos++];
                break;
            }
            case 1:
            {
                _fill.LinearAngle = _params[_cursor.pos++];
                break;
            }
            case 2:
            {
                _fill.LinearScale = _params[_cursor.pos++];
                break;
            }
            case 3:
            {
                _fill.PathType = _params[_cursor.pos++];
                break;
            }
            case 4:
            {
                var _count = _params[_cursor.pos++];

                if (_count > 0)
                {
                    _fill.Colors = [];
                    _fill.Positions = [];
                }
                for (var i = 0; i < _count; i++)
                {
                    _fill.Colors[i] = null;
                    _fill.Positions[i] = null;

                    var _continue2 = true;
                    while (_continue2)
                    {
                        var _attr2 = _params[_cursor.pos++];
                        switch (_attr2)
                        {
                            case 0:
                            {
                                _fill.Colors[i] = asc_menu_ReadColor(_params, _cursor);
                                break;
                            }
                            case 1:
                            {
                                _fill.Positions[i] = _params[_cursor.pos++];
                                break;
                            }
                            case 255:
                            default:
                            {
                                _continue2 = false;
                                break;
                            }
                        }
                    }
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

    return _fill;
};
function asc_menu_WriteAscFill_grad(_type, _fill, _stream)
{
    if (!_fill)
        return;

    _stream["WriteByte"](_type);

    if (_fill.GradType !== undefined && _fill.GradType !== null)
    {
        _stream["WriteByte"](0);
        _stream["WriteLong"](_fill.GradType);
    }

    if (_fill.LinearAngle !== undefined && _fill.LinearAngle !== null)
    {
        _stream["WriteByte"](1);
        _stream["WriteDouble2"](_fill.LinearAngle);
    }

    if (_fill.LinearScale !== undefined && _fill.LinearScale !== null)
    {
        _stream["WriteByte"](2);
        _stream["WriteBool"](_fill.LinearScale);
    }

    if (_fill.PathType !== undefined && _fill.PathType !== null)
    {
        _stream["WriteByte"](3);
        _stream["WriteLong"](_fill.PathType);
    }

    if (_fill.Colors !== null && _fill.Colors !== undefined && _fill.Positions !== null && _fill.Positions !== undefined)
    {
        if (_fill.Colors.length == _fill.Positions.length)
        {
            var _count = _fill.Colors.length;
            _stream["WriteByte"](4);
            _stream["WriteLong"](_count);

            for (var i = 0; i < _count; i++)
            {
                asc_menu_WriteColor(0, _fill.Colors[i], _stream);

                if (_fill.Positions[i] !== undefined && _fill.Positions[i] !== null)
                {
                    _stream["WriteByte"](1);
                    _stream["WriteDouble2"](_fill.Positions[i]);
                }

                _stream["WriteByte"](255);
            }
        }
    }

    _stream["WriteByte"](255);
};
function asc_menu_ReadAscFill_blip(_params, _cursor)
{
    var _fill = new Asc.asc_CFillBlip();

    var _continue = true;
    while (_continue)
    {
        var _attr = _params[_cursor.pos++];
        switch (_attr)
        {
            case 0:
            {
                _fill.type = _params[_cursor.pos++];
                break;
            }
            case 1:
            {
                _fill.url = _params[_cursor.pos++];
                break;
            }
            case 2:
            {
                _fill.texture_id = _params[_cursor.pos++];
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

    return _fill;
};
function asc_menu_WriteAscFill_blip(_type, _fill, _stream)
{
    if (!_fill)
        return;

    _stream["WriteByte"](_type);

    if (_fill.type !== undefined && _fill.type !== null)
    {
        _stream["WriteByte"](0);
        _stream["WriteLong"](_fill.type);
    }

    if (_fill.url !== undefined && _fill.url !== null)
    {
        _stream["WriteByte"](1);
        _stream["WriteString2"](_fill.url);
    }

    if (_fill.texture_id !== undefined && _fill.texture_id !== null)
    {
        _stream["WriteByte"](2);
        _stream["WriteLong"](_fill.texture_id);
    }

    _stream["WriteByte"](255);
};

function asc_menu_ReadAscFill(_params, _cursor)
{
    var _fill = new Asc.asc_CShapeFill();

    //_fill.type = c_oAscFill.FILL_TYPE_NOFILL;
    var _continue = true;
    while (_continue)
    {
        var _attr = _params[_cursor.pos++];
        switch (_attr)
        {
            case 0:
            {
                _fill.type = _params[_cursor.pos++];
                break;
            }
            case 1:
            {
                switch (_fill.type)
                {
                    case Asc.c_oAscFill.FILL_TYPE_SOLID:
                    {
                        _fill.fill = asc_menu_ReadAscFill_solid(_params, _cursor);
                        break;
                    }
                    case Asc.c_oAscFill.FILL_TYPE_PATT:
                    {
                        _fill.fill = asc_menu_ReadAscFill_patt(_params, _cursor);
                        break;
                    }
                    case Asc.c_oAscFill.FILL_TYPE_GRAD:
                    {
                        _fill.fill = asc_menu_ReadAscFill_grad(_params, _cursor);
                        break;
                    }
                    case Asc.c_oAscFill.FILL_TYPE_BLIP:
                    {
                        _fill.fill = asc_menu_ReadAscFill_blip(_params, _cursor);
                        break;
                    }
                    default:
                        break;
                }
                break;
            }
            case 2:
            {
                _fill.transparent = _params[_cursor.pos++];
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

    return _fill;

};
function asc_menu_WriteAscFill(_type, _fill, _stream)
{
    if (!_fill)
        return;

    _stream["WriteByte"](_type);

    if (_fill.type !== undefined && _fill.type !== null)
    {
        _stream["WriteByte"](0);
        _stream["WriteLong"](_fill.type);
    }

    if (_fill.fill !== undefined && _fill.fill !== null)
    {
        switch (_fill.type)
        {
            case Asc.c_oAscFill.FILL_TYPE_SOLID:
            {
                _fill.fill = asc_menu_WriteAscFill_solid(1, _fill.fill, _stream);
                break;
            }
            case Asc.c_oAscFill.FILL_TYPE_PATT:
            {
                _fill.fill = asc_menu_ReadAscFill_patt(1, _fill.fill, _stream);
                break;
            }
            case Asc.c_oAscFill.FILL_TYPE_GRAD:
            {
                _fill.fill = asc_menu_ReadAscFill_grad(1, _fill.fill, _stream);
                break;
            }
            case Asc.c_oAscFill.FILL_TYPE_BLIP:
            {
                _fill.fill = asc_menu_ReadAscFill_blip(1, _fill.fill, _stream);
                break;
            }
            default:
                break;
        }
    }

    if (_fill.transparent !== undefined && _fill.transparent !== null)
    {
        _stream["WriteByte"](2);
        _stream["WriteLong"](_fill.transparent);
    }

    _stream["WriteByte"](255);
};

function asc_menu_ReadAscStroke(_params, _cursor)
{
    var _stroke = new Asc.asc_CStroke();

    var _continue = true;
    while (_continue)
    {
        var _attr = _params[_cursor.pos++];
        switch (_attr)
        {
            case 0:
            {
                _stroke.type = _params[_cursor.pos++];
                break;
            }
            case 1:
            {
                _stroke.width = _params[_cursor.pos++];
                break;
            }
            case 2:
            {
                _stroke.color = asc_menu_ReadColor(_params, _cursor);
                break;
            }
            case 3:
            {
                _stroke.LineJoin = _params[_cursor.pos++];
                break;
            }
            case 4:
            {
                _stroke.LineCap = _params[_cursor.pos++];
                break;
            }
            case 5:
            {
                _stroke.LineBeginStyle = _params[_cursor.pos++];
                break;
            }
            case 6:
            {
                _stroke.LineBeginSize = _params[_cursor.pos++];
                break;
            }
            case 7:
            {
                _stroke.LineEndStyle = _params[_cursor.pos++];
                break;
            }
            case 8:
            {
                _stroke.LineEndSize = _params[_cursor.pos++];
                break;
            }
            case 9:
            {
                _stroke.canChangeArrows = _params[_cursor.pos++];
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

    return _stroke;
};
function asc_menu_WriteAscStroke(_type, _stroke, _stream)
{
    if (!_stroke)
        return;

    _stream["WriteByte"](_type);

    if (_stroke.type !== undefined && _stroke.type !== null)
    {
        _stream["WriteByte"](0);
        _stream["WriteLong"](_stroke.type);
    }
    if (_stroke.width !== undefined && _stroke.width !== null)
    {
        _stream["WriteByte"](1);
        _stream["WriteDouble2"](_stroke.width);
    }

    asc_menu_WriteColor(2, _stroke.color, _stream);

    if (_stroke.LineJoin !== undefined && _stroke.LineJoin !== null)
    {
        _stream["WriteByte"](3);
        _stream["WriteByte"](_stroke.LineJoin);
    }
    if (_stroke.LineCap !== undefined && _stroke.LineCap !== null)
    {
        _stream["WriteByte"](4);
        _stream["WriteByte"](_stroke.LineCap);
    }
    if (_stroke.LineBeginStyle !== undefined && _stroke.LineBeginStyle !== null)
    {
        _stream["WriteByte"](5);
        _stream["WriteByte"](_stroke.LineBeginStyle);
    }
    if (_stroke.LineBeginSize !== undefined && _stroke.LineBeginSize !== null)
    {
        _stream["WriteByte"](6);
        _stream["WriteByte"](_stroke.LineBeginSize);
    }
    if (_stroke.LineEndStyle !== undefined && _stroke.LineEndStyle !== null)
    {
        _stream["WriteByte"](7);
        _stream["WriteByte"](_stroke.LineEndStyle);
    }
    if (_stroke.LineEndSize !== undefined && _stroke.LineEndSize !== null)
    {
        _stream["WriteByte"](8);
        _stream["WriteByte"](_stroke.LineEndSize);
    }

    if (_stroke.canChangeArrows !== undefined && _stroke.canChangeArrows !== null)
    {
        _stream["WriteByte"](9);
        _stream["WriteBool"](_stroke.canChangeArrows);
    }

    _stream["WriteByte"](255);

};

function asc_menu_ReadShapePr(_params, _cursor)
{
    var _settings = new Asc.asc_CShapeProperty();

    var _continue = true;
    while (_continue)
    {
        var _attr = _params[_cursor.pos++];
        switch (_attr)
        {
            case 0:
            {
                _settings.type = _params[_cursor.pos++];
                break;
            }
            case 1:
            {
                _settings.fill = asc_menu_ReadAscFill(_params, _cursor);
                break;
            }
            case 2:
            {
                _settings.stroke = asc_menu_ReadAscStroke(_params, _cursor);
                break;
            }
            case 3:
            {
                _settings.paddings = asc_menu_ReadPaddings(_params, _cursor);
                break;
            }
            case 4:
            {
                _settings.canFill = _params[_cursor.pos++];
                break;
            }
            case 5:
            {
                _settings.bFromChart = _params[_cursor.pos++];
                break;
            }
            case 6:
            {
                _settings.InsertPageNum = _params[_cursor.pos++];
            }
            case 255:
            default:
            {
                _continue = false;
                break;
            }
        }
    }

    return _settings;
};
function asc_menu_WriteShapePr(_type, _shapePr, _stream)
{
    if (!_shapePr)
        return;

    _stream["WriteByte"](_type);

    if (_shapePr.type !== undefined && _shapePr.type !== null)
    {
        _stream["WriteByte"](0);
        _stream["WriteString2"](_shapePr.type);
    }

    asc_menu_WriteAscFill(1, _shapePr.fill, _stream);
    asc_menu_WriteAscStroke(2, _shapePr.stroke, _stream);
    asc_menu_WritePaddings(3, _shapePr.paddings, _stream);

    if (_shapePr.canFill !== undefined && _shapePr.canFill !== null)
    {
        _stream["WriteByte"](4);
        _stream["WriteBool"](_shapePr.canFill);
    }
    if (_shapePr.bFromChart !== undefined && _shapePr.bFromChart !== null)
    {
        _stream["WriteByte"](5);
        _stream["WriteBool"](_shapePr.bFromChart);
    }

    _stream["WriteByte"](255);
};

function asc_menu_WriteImagePr(_imagePr, _stream)
{
    if (_imagePr.CanBeFlow !== undefined && _imagePr.CanBeFlow !== null)
    {
        _stream["WriteByte"](0);
        _stream["WriteBool"](_imagePr.CanBeFlow);
    }
    if (_imagePr.Width !== undefined && _imagePr.Width !== null)
    {
        _stream["WriteByte"](1);
        _stream["WriteDouble2"](_imagePr.Width);
    }
    if (_imagePr.Height !== undefined && _imagePr.Height !== null)
    {
        _stream["WriteByte"](2);
        _stream["WriteDouble2"](_imagePr.Height);
    }
    if (_imagePr.WrappingStyle !== undefined && _imagePr.WrappingStyle !== null)
    {
        _stream["WriteByte"](3);
        _stream["WriteLong"](_imagePr.WrappingStyle);
    }

    asc_menu_WritePaddings(4, _imagePr.Paddings, _stream);
    asc_menu_WritePosition(5, _imagePr.Position, _stream);

    if (_imagePr.AllowOverlap !== undefined && _imagePr.AllowOverlap !== null)
    {
        _stream["WriteByte"](6);
        _stream["WriteBool"](_imagePr.AllowOverlap);
    }

    asc_menu_WriteImagePosition(7, _imagePr.PositionH, _stream);
    asc_menu_WriteImagePosition(8, _imagePr.PositionV, _stream);

    if (_imagePr.Internal_Position !== undefined && _imagePr.Internal_Position !== null)
    {
        _stream["WriteByte"](9);
        _stream["WriteLong"](_imagePr.Internal_Position);
    }

    if (_imagePr.ImageUrl !== undefined && _imagePr.ImageUrl !== null)
    {
        _stream["WriteByte"](10);
        _stream["WriteString2"](_imagePr.ImageUrl);
    }

    if (_imagePr.Locked !== undefined && _imagePr.Locked !== null)
    {
        _stream["WriteByte"](11);
        _stream["WriteBool"](_imagePr.Locked);
    }

    asc_menu_WriteChartPr(12, _imagePr.ChartProperties, _stream);
    asc_menu_WriteShapePr(13, _imagePr.ShapeProperties, _stream);

    if (_imagePr.ChangeLevel !== undefined && _imagePr.ChangeLevel !== null)
    {
        _stream["WriteByte"](14);
        _stream["WriteLong"](_imagePr.ChangeLevel);
    }

    if (_imagePr.Group !== undefined && _imagePr.Group !== null)
    {
        _stream["WriteByte"](15);
        _stream["WriteLong"](_imagePr.Group);
    }

    if (_imagePr.fromGroup !== undefined && _imagePr.fromGroup !== null)
    {
        _stream["WriteByte"](16);
        _stream["WriteBool"](_imagePr.fromGroup);
    }
    if (_imagePr.severalCharts !== undefined && _imagePr.severalCharts !== null)
    {
        _stream["WriteByte"](17);
        _stream["WriteBool"](_imagePr.severalCharts);
    }

    if (_imagePr.severalChartTypes !== undefined && _imagePr.severalChartTypes !== null)
    {
        _stream["WriteByte"](18);
        _stream["WriteLong"](_imagePr.severalChartTypes);
    }
    if (_imagePr.severalChartStyles !== undefined && _imagePr.severalChartStyles !== null)
    {
        _stream["WriteByte"](19);
        _stream["WriteLong"](_imagePr.severalChartStyles);
    }
    if (_imagePr.verticalTextAlign !== undefined && _imagePr.verticalTextAlign !== null)
    {
        _stream["WriteByte"](20);
        _stream["WriteLong"](_imagePr.verticalTextAlign);
    }

    _stream["WriteByte"](255);
};
///////////////////////////////////////////////////////////////////////

function asc_menu_ReadHyperPr(_params, _cursor)
{
    var _settings = new Asc.CHyperlinkProperty();

    var _continue = true;
    while (_continue)
    {
        var _attr = _params[_cursor.pos++];
        switch (_attr)
        {
            case 0:
            {
                _settings.Text = _params[_cursor.pos++];
                break;
            }
            case 1:
            {
                _settings.Value = _params[_cursor.pos++];
                break;
            }
            case 2:
            {
                _settings.ToolTip = _params[_cursor.pos++];
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

    return _settings;
};

function asc_menu_WriteHyperPr(_hyperPr, _stream)
{
    if (_hyperPr.Text !== undefined && _hyperPr.Text !== null)
    {
        _stream["WriteByte"](0);
        _stream["WriteString2"](_hyperPr.Text);
    }

    if (_hyperPr.Value !== undefined && _hyperPr.Value !== null)
    {
        _stream["WriteByte"](1);
        _stream["WriteString2"](_hyperPr.Value);
    }

    if (_hyperPr.ToolTip !== undefined && _hyperPr.ToolTip !== null)
    {
        _stream["WriteByte"](2);
        _stream["WriteString2"](_hyperPr.ToolTip);
    }

    _stream["WriteByte"](255);
};

function asc_WriteColorSchemes(schemas, s) {

    s["WriteLong"](schemas.length);

    for (var i = 0; i < schemas.length; ++i) {
        s["WriteString2"](schemas[i].get_name());

        var colors = schemas[i].get_colors();
        s["WriteLong"](colors.length);

        for (var j = 0; j < colors.length; ++j) {
            asc_menu_WriteColor(0, colors[j], s);
        }
    }
}
AscCommon.asc_WriteColorSchemes = asc_WriteColorSchemes;

///////////////////////////////////////////////////////////////////////

function asc_WriteUsers(c, s) {
    if (!c) return;

    var len = 0, name, user;
    for (name in c) {
        if (undefined !== name) {
            len++;
        }
    }

    s["WriteLong"](len);

    for (name in c) {
        if (undefined !== name) {
            user = c[name];
            if (user) {
                s['WriteString2'](user.asc_getId());
                s['WriteString2'](user.asc_getFirstName() === undefined ? "" : user.asc_getFirstName());
                s['WriteString2'](user.asc_getLastName() === undefined ? "" : user.asc_getLastName());
                s['WriteString2'](user.asc_getUserName() === undefined ? "" : user.asc_getUserName());
                s['WriteBool'](user.asc_getView());

                var color = new Asc.asc_CColor();

                color.r = (user.color >> 16) & 255;
                color.g = (user.color >> 8 ) & 255;
                color.b = (user.color      ) & 255;

                asc_menu_WriteColor(0, color, s);
            }
        }
    }
}

///////////////////////////////////////////////////////////////////////

Asc['asc_docs_api'].prototype.UpdateTextPr = function(TextPr)
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

    if(TextPr.Unifill && TextPr.Unifill.fill && TextPr.Unifill.fill.type === Asc.c_oAscFill.FILL_TYPE_SOLID && TextPr.Unifill.fill.color)
    {
        var _color = AscCommon.CreateAscColor(TextPr.Unifill.fill.color);
        asc_menu_WriteColor(6, AscCommon.CreateAscColorCustom(_color.r, _color.g, _color.b, false), _stream);
    }
    else if (TextPr.Color !== undefined)
    {
        asc_menu_WriteColor(6, AscCommon.CreateAscColorCustom(TextPr.Color.r, TextPr.Color.g, TextPr.Color.b, TextPr.Color.Auto), _stream);
    }

    if (TextPr.VertAlign !== undefined)
    {
        _stream["WriteByte"](7);
        _stream["WriteLong"](TextPr.VertAlign);
    }

    if (TextPr.HighLight !== undefined)
    {
        if (TextPr.HighLight === AscCommonWord.highlight_None)
        {
            _stream["WriteByte"](12);
        }
        else
        {
            asc_menu_WriteColor(8, AscCommon.CreateAscColorCustom(TextPr.HighLight.r, TextPr.HighLight.g, TextPr.HighLight.b), _stream);
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
    if (TextPr.Spacing !== undefined)
    {
        _stream["WriteByte"](13);
        _stream["WriteDouble2"](TextPr.Spacing);
    }

    _stream["WriteByte"](255);

    this.Send_Menu_Event(1);
};

Asc['asc_docs_api'].prototype.UpdateParagraphProp = function(ParaPr)
{
    // TODO: как только разъединят настройки параграфа и текста переделать тут
    var TextPr = this.WordControl.m_oLogicDocument.Get_Paragraph_TextPr();
    ParaPr.Subscript   = ( TextPr.VertAlign === AscCommon.vertalign_SubScript   ? true : false );
    ParaPr.Superscript = ( TextPr.VertAlign === AscCommon.vertalign_SuperScript ? true : false );
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
        if (this.SelectedObjectsStack[_len - 1].Type == Asc.c_oAscTypeSelectElement.Paragraph)
        {
            this.SelectedObjectsStack[_len - 1].Value = ParaPr;
            return;
        }
    }

    this.SelectedObjectsStack[this.SelectedObjectsStack.length] = new AscCommon.asc_CSelectedObject ( Asc.c_oAscTypeSelectElement.Paragraph, ParaPr );
};

Asc['asc_docs_api'].prototype.put_PageNum = function(where,align)
{
    if ( where >= 0 )
    {
        if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(AscCommon.changestype_None, { Type : AscCommon.changestype_2_HdrFtr }) )
        {
            this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
            this.WordControl.m_oLogicDocument.Document_AddPageNum( where, align );
        }
    }
    else
    {
        if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(AscCommon.changestype_Paragraph_Content) )
        {
            this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
            this.WordControl.m_oLogicDocument.Document_AddPageNum( where, align );
        }
    }
};

Asc['asc_docs_api'].prototype.put_AddPageBreak = function()
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(AscCommon.changestype_Paragraph_Content) )
    {
        var Document = this.WordControl.m_oLogicDocument;

        if ( null === Document.Hyperlink_Check(false) )
        {
            Document.Create_NewHistoryPoint();
            Document.Paragraph_Add( new ParaNewLine( break_Page ) );
        }
    }
};

Asc['asc_docs_api'].prototype.add_SectionBreak = function(_Type)
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(AscCommon.changestype_Paragraph_Content) )
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
        this.WordControl.m_oLogicDocument.Add_SectionBreak(_Type);
    }
};

Asc['asc_docs_api'].prototype.put_AddLineBreak = function()
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(AscCommon.changestype_Paragraph_Content) )
    {
        var Document = this.WordControl.m_oLogicDocument;

        if ( null === Document.Hyperlink_Check(false) )
        {
            Document.Create_NewHistoryPoint();
            Document.Paragraph_Add( new ParaNewLine( para_NewLine ) );
        }
    }
};

Asc['asc_docs_api'].prototype.ImgApply = function(obj)
{

    var ImagePr = obj;

    // Если у нас меняется с Float->Inline мы также должны залочить соответствующий параграф
    var AdditionalData = null;
    var LogicDocument = this.WordControl.m_oLogicDocument;
    if(obj && obj.ChartProperties && obj.ChartProperties.type === Asc.c_oAscChartTypeSettings.stock)
    {
        var selectedObjectsByType = LogicDocument.DrawingObjects.getSelectedObjectsByTypes();
        if(selectedObjectsByType.charts[0])
        {
            var chartSpace = selectedObjectsByType.charts[0];
            if(chartSpace && chartSpace.chart && chartSpace.chart.plotArea && chartSpace.chart.plotArea.charts[0] && chartSpace.chart.plotArea.charts[0].getObjectType() !== AscDFH.historyitem_type_StockChart)
            {
                if(chartSpace.chart.plotArea.charts[0].series.length !== 4)
                {
                    this.sendEvent("asc_onError", Asc.c_oAscError.ID.StockChartError,Asc.c_oAscError.Level.NoCritical);
                    this.WordControl.m_oLogicDocument.Document_UpdateInterfaceState();
                    return;
                }
            }
        }
    }

    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(AscCommon.changestype_Image_Properties, AdditionalData) )
    {

        if (ImagePr.ShapeProperties)
            ImagePr.ImageUrl = "";

        if(ImagePr.ImageUrl != undefined && ImagePr.ImageUrl != null && ImagePr.ImageUrl != "")
        {
            this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
            this.WordControl.m_oLogicDocument.Set_ImageProps( ImagePr );
        }
        else if (ImagePr.ShapeProperties && ImagePr.ShapeProperties.fill && ImagePr.ShapeProperties.fill.fill &&
                 ImagePr.ShapeProperties.fill.fill.url !== undefined && ImagePr.ShapeProperties.fill.fill.url != null && ImagePr.ShapeProperties.fill.fill.url != "")
        {
            this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
            this.WordControl.m_oLogicDocument.Set_ImageProps( ImagePr );
        }
        else
        {
            ImagePr.ImageUrl = null;


            if(!this.noCreatePoint || this.exucuteHistory)
            {
                if( !this.noCreatePoint && !this.exucuteHistory && this.exucuteHistoryEnd)
                {
                    this.WordControl.m_oLogicDocument.Set_ImageProps( ImagePr );
                    this.exucuteHistoryEnd = false;
                }
                else
                {
                    this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
                    this.WordControl.m_oLogicDocument.Set_ImageProps( ImagePr );
                }
                if(this.exucuteHistory)
                {
                    this.exucuteHistory = false;
                }
            }
            else
            {
                AscFormat.ExecuteNoHistory(function(){
                                           this.WordControl.m_oLogicDocument.Set_ImageProps( ImagePr );
                                           }, this, []);
            }

            this.WordControl.m_oLogicDocument.Set_ImageProps( ImagePr );
        }
    }
};

Asc['asc_docs_api'].prototype.MergeCells = function()
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(AscCommon.changestype_Table_Properties) )
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
        this.WordControl.m_oLogicDocument.Table_MergeCells();
    }
}
Asc['asc_docs_api'].prototype.SplitCell = function(Cols, Rows)
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(AscCommon.changestype_Table_Properties) )
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
        this.WordControl.m_oLogicDocument.Table_SplitCell(Cols, Rows);
    }
}

Asc['asc_docs_api'].prototype.StartAddShape = function(sPreset, is_apply)
{
    this.isStartAddShape = true;
    this.addShapePreset = sPreset;
    if (is_apply)
    {
        this.WordControl.m_oDrawingDocument.LockCursorType("crosshair");
    }
    else
    {
        editor.sync_EndAddShape();
        editor.sync_StartAddShapeCallback(false);
    }
};

Asc['asc_docs_api'].prototype.AddImageUrlNative = function(url, _w, _h, _pageNum)
{
    var _section_select = this.WordControl.m_oLogicDocument.Get_PageSizesByDrawingObjects();
    var _page_width             = AscCommon.Page_Width;
    var _page_height            = AscCommon.Page_Height;
    var _page_x_left_margin     = AscCommon.X_Left_Margin;
    var _page_y_top_margin      = AscCommon.Y_Top_Margin;
    var _page_x_right_margin    = AscCommon.X_Right_Margin;
    var _page_y_bottom_margin   = AscCommon.Y_Bottom_Margin;

    if (_section_select)
    {
        if (_section_select.W)
            _page_width = _section_select.W;

        if (_section_select.H)
            _page_height = _section_select.H;
    }

    var __w = Math.max(1, (_page_width - (_page_x_left_margin + _page_x_right_margin)) / 2);
    var __h = Math.max(1, (_page_height - (_page_y_top_margin + _page_y_bottom_margin)) / 2);

    var wI = (undefined !== _w) ? Math.max(_w * AscCommon.g_dKoef_pix_to_mm, 1) : 1;
    var hI = (undefined !== _h) ? Math.max(_h * AscCommon.g_dKoef_pix_to_mm, 1) : 1;

    if (wI < 5)
        wI = 5;
    if (hI < 5)
        hI = 5;

    if (wI > __w || hI > __h)
    {
        var _koef = Math.min(__w / wI, __h / hI);
        wI *= _koef;
        hI *= _koef;
    }

    this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();

    if (undefined === _pageNum)
    {
        this.WordControl.m_oLogicDocument.AddInlineImage(wI, hI, url);
    }
    else
    {
        var _sectionPr = this.WordControl.m_oLogicDocument.Get_PageLimits(_pageNum);
        this.AddImageToPage(url, _pageNum, (_sectionPr.XLimit - wI) / 2, (_sectionPr.YLimit - hI) / 2, wI, hI);
    }
};
Asc['asc_docs_api'].prototype.AddImageUrlActionNative = function(src, _w, _h, _pageNum)
{
  var ColumnSize = this.WordControl.m_oLogicDocument.GetColumnSize();
  var __w = Math.max((_w * AscCommon.g_dKoef_pix_to_mm), 1);
  var __h = Math.max((_h * AscCommon.g_dKoef_pix_to_mm), 1);
  _w = Math.max(5, Math.min(_w, __w));
  _h = Math.max(5, Math.min((_w * __h / __w)));

  if (this.isShapeImageChangeUrl)
  {
    var AscShapeProp       = new Asc.asc_CShapeProperty();
    AscShapeProp.fill      = new Asc.asc_CShapeFill();
    AscShapeProp.fill.type = c_oAscFill.FILL_TYPE_BLIP;
    AscShapeProp.fill.fill = new Asc.asc_CFillBlip();
    AscShapeProp.fill.fill.asc_putUrl(src);
    this.ImgApply(new Asc.asc_CImgProperty({ShapeProperties : AscShapeProp}));
    this.isShapeImageChangeUrl = false;
  }
  else if (this.isImageChangeUrl)
  {
    var AscImageProp      = new Asc.asc_CImgProperty();
    AscImageProp.ImageUrl = src;
    this.ImgApply(AscImageProp);
    this.isImageChangeUrl = false;
  }
  else
  {
    if (false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Content))
    {
      var imageLocal = AscCommon.g_oDocumentUrls.getImageLocal(src);
      if (imageLocal)
      {
        src = imageLocal;
      }
      this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Document_AddImageUrlLong);
      //if (undefined === imgProp || undefined === imgProp.WrappingStyle || 0 == imgProp.WrappingStyle)
        this.WordControl.m_oLogicDocument.AddInlineImage(_w, _h, src);
      //else
      //  this.WordControl.m_oLogicDocument.AddInlineImage(_w, _h, src, null, true);
    }
  }
};

Asc['asc_docs_api'].prototype.Send_Menu_Event = function(type)
{
    window["native"]["OnCallMenuEvent"](type, global_memory_stream_menu);
};

Asc['asc_docs_api'].prototype.sync_EndCatchSelectedElements = function()
{
    if (this.WordControl && this.WordControl.m_oDrawingDocument)
        this.WordControl.m_oDrawingDocument.EndTableStylesCheck();

    var _stream = global_memory_stream_menu;
    _stream["ClearNoAttack"]();

    var _count = this.SelectedObjectsStack.length;
    var _naturalCount = 0;

    for (var i = 0; i < _count; i++)
    {
        switch (this.SelectedObjectsStack[i].Type)
        {
            case Asc.c_oAscTypeSelectElement.Paragraph:
            case Asc.c_oAscTypeSelectElement.Header:
            case Asc.c_oAscTypeSelectElement.Table:
            case Asc.c_oAscTypeSelectElement.Image:
            case Asc.c_oAscTypeSelectElement.Hyperlink:
            {
                ++_naturalCount;
                break;
            }
            default:
                break;
        }
    }

    _stream["WriteLong"](_naturalCount);

    for (var i = 0; i < _count; i++)
    {
        switch (this.SelectedObjectsStack[i].Type)
        {
                //console.log(JSON.stringify(this.SelectedObjectsStack[i].Value));
            case Asc.c_oAscTypeSelectElement.Paragraph:
            {
                _stream["WriteLong"](Asc.c_oAscTypeSelectElement.Paragraph);
                asc_menu_WriteParagraphPr(this.SelectedObjectsStack[i].Value, _stream);
                break;
            }
            case Asc.c_oAscTypeSelectElement.Header:
            {
                _stream["WriteLong"](Asc.c_oAscTypeSelectElement.Header);
                asc_menu_WriteHeaderFooterPr(this.SelectedObjectsStack[i].Value, _stream);
                break;
            }
            case Asc.c_oAscTypeSelectElement.Table:
            {
                _stream["WriteLong"](Asc.c_oAscTypeSelectElement.Table);
                asc_menu_WriteTablePr(this.SelectedObjectsStack[i].Value, _stream);
                break;
            }
            case Asc.c_oAscTypeSelectElement.Image:
            {
                _stream["WriteLong"](Asc.c_oAscTypeSelectElement.Image);
                asc_menu_WriteImagePr(this.SelectedObjectsStack[i].Value, _stream);
                break;
            }
            case Asc.c_oAscTypeSelectElement.Hyperlink:
            {
                _stream["WriteLong"](Asc.c_oAscTypeSelectElement.Hyperlink);
                asc_menu_WriteHyperPr(this.SelectedObjectsStack[i].Value, _stream);
                break;
            }
            case Asc.c_oAscTypeSelectElement.SpellCheck:
            default:
            {
                // none
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

Asc['asc_docs_api'].prototype.startGetDocInfo = function()
{
    /*
     Возвращаем объект следующего вида:
     {
     PageCount: 12,
     WordsCount: 2321,
     ParagraphCount: 45,
     SymbolsCount: 232345,
     SymbolsWSCount: 34356
     }
     */
    this.sync_GetDocInfoStartCallback();

    if (null != this.WordControl.m_oLogicDocument)
        this.WordControl.m_oLogicDocument.Statistics_Start();
};
Asc['asc_docs_api'].prototype.stopGetDocInfo = function()
{
    this.sync_GetDocInfoStopCallback();

    if (null != this.WordControl.m_oLogicDocument)
        this.WordControl.m_oLogicDocument.Statistics_Stop();
};
Asc['asc_docs_api'].prototype.sync_DocInfoCallback = function(obj)
{
    var _stream = global_memory_stream_menu;
    _stream["ClearNoAttack"]();
    _stream["WriteLong"](obj.PageCount);
    _stream["WriteLong"](obj.WordsCount);
    _stream["WriteLong"](obj.ParagraphCount);
    _stream["WriteLong"](obj.SymbolsCount);
    _stream["WriteLong"](obj.SymbolsWSCount);

    window["native"]["OnCallMenuEvent"](70, _stream); // ASC_MENU_EVENT_TYPE_STATISTIC_INFO
};
Asc['asc_docs_api'].prototype.sync_GetDocInfoStartCallback = function()
{
    var _stream = global_memory_stream_menu;
    _stream["ClearNoAttack"]();

    window["native"]["OnCallMenuEvent"](67, _stream); // ASC_MENU_EVENT_TYPE_STATISTIC_START
};
Asc['asc_docs_api'].prototype.sync_GetDocInfoStopCallback = function()
{
    var _stream = global_memory_stream_menu;
    _stream["ClearNoAttack"]();

    window["native"]["OnCallMenuEvent"](68, _stream); // ASC_MENU_EVENT_TYPE_STATISTIC_STOP
};
Asc['asc_docs_api'].prototype.sync_GetDocInfoEndCallback = function()
{
    var _stream = global_memory_stream_menu;
    _stream["ClearNoAttack"]();

    window["native"]["OnCallMenuEvent"](69, _stream); // ASC_MENU_EVENT_TYPE_STATISTIC_END
};

Asc['asc_docs_api'].prototype.sync_CanUndoCallback = function(bCanUndo)
{
    var _stream = global_memory_stream_menu;
    _stream["ClearNoAttack"]();
    _stream["WriteBool"](bCanUndo);
    window["native"]["OnCallMenuEvent"](60, _stream); // ASC_MENU_EVENT_TYPE_CAN_UNDO
};
Asc['asc_docs_api'].prototype.sync_CanRedoCallback = function(bCanRedo)
{
    var _stream = global_memory_stream_menu;
    _stream["ClearNoAttack"]();
    _stream["WriteBool"](bCanRedo);
    window["native"]["OnCallMenuEvent"](61, _stream); // ASC_MENU_EVENT_TYPE_CAN_REDO
};

Asc['asc_docs_api'].prototype.SetDocumentModified = function(bValue)
{
    this.isDocumentModify = bValue;

    var _stream = global_memory_stream_menu;
    _stream["ClearNoAttack"]();
    _stream["WriteBool"](this.isDocumentModify);
    window["native"]["OnCallMenuEvent"](66, _stream); // ASC_MENU_EVENT_TYPE_DOCUMETN_MODIFITY
};

// find -------------------------------------------------------------------------------------------------
Asc['asc_docs_api'].prototype.asc_findText = function(text, isNext, isMatchCase)
{
    var SearchEngine = editor.WordControl.m_oLogicDocument.Search( text, { MatchCase : isMatchCase } );

    var Id = this.WordControl.m_oLogicDocument.Search_GetId( isNext );

    if ( null != Id )
        this.WordControl.m_oLogicDocument.Search_Select( Id );

    return SearchEngine.Count;
};

Asc['asc_docs_api'].prototype.asc_replaceText = function(text, replaceWith, isReplaceAll, isMatchCase)
{
    this.WordControl.m_oLogicDocument.Search( text, { MatchCase : isMatchCase } );

    if ( true === isReplaceAll )
    {
        this.WordControl.m_oLogicDocument.Search_Replace(replaceWith, true, -1);
        return true;
    }
    else
    {
        var CurId = this.WordControl.m_oLogicDocument.SearchEngine.CurId;
        var bDirection = this.WordControl.m_oLogicDocument.SearchEngine.Direction;
        if ( -1 != CurId )
            this.WordControl.m_oLogicDocument.Search_Replace(replaceWith, false, CurId);

        var Id = this.WordControl.m_oLogicDocument.Search_GetId( bDirection );

        if ( null != Id )
        {
            this.WordControl.m_oLogicDocument.Search_Select( Id );
            return true;
        }

        return false;
    }
};

Asc['asc_docs_api'].prototype.asc_selectSearchingResults = function(bShow)
{
    this.WordControl.m_oLogicDocument.Search_Set_Selection(bShow);
};

Asc['asc_docs_api'].prototype.asc_isSelectSearchingResults = function()
{
    return this.WordControl.m_oLogicDocument.Search_Get_Selection();
};
// endfind ----------------------------------------------------------------------------------------------

// sectionPr --------------------------------------------------------------------------------------------
Asc['asc_docs_api'].prototype.change_PageOrient = function(isPortrait)
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(AscCommon.changestype_Document_SectPr) )
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
        if (isPortrait)
        {
            this.WordControl.m_oLogicDocument.Set_DocumentOrientation(Asc.c_oAscPageOrientation.PagePortrait);
            this.DocumentOrientation = isPortrait;
        }
        else
        {
            this.WordControl.m_oLogicDocument.Set_DocumentOrientation(Asc.c_oAscPageOrientation.PageLandscape);
            this.DocumentOrientation = isPortrait;
        }
        this.sync_PageOrientCallback(editor.get_DocumentOrientation());
    }
};
Asc['asc_docs_api'].prototype.change_DocSize = function(width,height)
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(AscCommon.changestype_Document_SectPr) )
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
        if (this.DocumentOrientation)
            this.WordControl.m_oLogicDocument.Set_DocumentPageSize(width, height);
        else
            this.WordControl.m_oLogicDocument.Set_DocumentPageSize(height, width);
    }
};
Asc['asc_docs_api'].prototype.sync_PageOrientCallback = function(isPortrait)
{
    this.DocumentOrientation = isPortrait;
    var _stream = global_memory_stream_menu;
    _stream["ClearNoAttack"]();
    _stream["WriteByte"](6);
    _stream["WriteBool"](this.DocumentOrientation);
    _stream["WriteByte"](255);
    this.Send_Menu_Event(17, _stream); // ASC_MENU_EVENT_TYPE_SECTION
};
Asc['asc_docs_api'].prototype.sync_DocSizeCallback = function(width,height)
{
    var _stream = global_memory_stream_menu;
    _stream["ClearNoAttack"]();
    _stream["WriteByte"](0);
    _stream["WriteDouble2"](width);
    _stream["WriteByte"](1);
    _stream["WriteDouble2"](height);
    _stream["WriteByte"](255);
    this.Send_Menu_Event(17, _stream); // ASC_MENU_EVENT_TYPE_SECTION
};
// endsectionPr -----------------------------------------------------------------------------------------

// font engine -------------------------------------
var FontStyle =
{
FontStyleRegular:    0,
FontStyleBold:       1,
FontStyleItalic:     2,
FontStyleBoldItalic: 3,
FontStyleUnderline:  4,
FontStyleStrikeout:  8
};

function CFontManager()
{
    this.m_oLibrary = {};
    this.Initialize = function(){};
}

function CStylesPainter()
{
    this.STYLE_THUMBNAIL_WIDTH  = AscCommonWord.GlobalSkin.STYLE_THUMBNAIL_WIDTH;
    this.STYLE_THUMBNAIL_HEIGHT = AscCommonWord.GlobalSkin.STYLE_THUMBNAIL_HEIGHT;

    this.CurrentTranslate = null;
    this.IsRetinaEnabled = false;

    this.defaultStyles = [];
    this.docStyles = [];
    this.mergedStyles = [];
}
CStylesPainter.prototype =
{
GenerateStyles: function(_api, ds)
    {
        if (_api.WordControl.bIsRetinaSupport)
        {
            this.STYLE_THUMBNAIL_WIDTH  <<= 1;
            this.STYLE_THUMBNAIL_HEIGHT <<= 1;
            this.IsRetinaEnabled = true;
        }

        this.CurrentTranslate = _api.CurrentTranslate;

        var _stream = global_memory_stream_menu;
        var _graphics = new CDrawingStream();

        _api.WordControl.m_oDrawingDocument.Native["DD_PrepareNativeDraw"]();

        this.GenerateDefaultStyles(_api, ds, _graphics);
        this.GenerateDocumentStyles(_api, _graphics);

        // стили сформированы. осталось просто сформировать единый список
        var _count_default = this.defaultStyles.length;
        var _count_doc = 0;
        if (null != this.docStyles)
            _count_doc = this.docStyles.length;

        var aPriorityStyles = [];
        var fAddToPriorityStyles = function(style){
            var index = style.Style.uiPriority;
            if(null == index)
                index = 0;
            var aSubArray = aPriorityStyles[index];
            if(null == aSubArray)
            {
                aSubArray = [];
                aPriorityStyles[index] = aSubArray;
            }
            aSubArray.push(style);
        };
        var _map_document = {};

        for (var i = 0; i < _count_doc; i++)
        {
            var style = this.docStyles[i];
            _map_document[style.Name] = 1;
            fAddToPriorityStyles(style);
        }

        for (var i = 0; i < _count_default; i++)
        {
            var style = this.defaultStyles[i];
            if(null == _map_document[style.Name])
                fAddToPriorityStyles(style);
        }

        this.mergedStyles = [];
        for(var index in aPriorityStyles)
        {
            var aSubArray = aPriorityStyles[index];
            aSubArray.sort(function(a, b){
                           if(a.Name < b.Name)
                           return -1;
                           else if(a.Name > b.Name)
                           return 1;
                           else
                           return 0;
                           });
            for(var i = 0, length = aSubArray.length; i < length; ++i)
            {
                this.mergedStyles.push(aSubArray[i]);
            }
        }

        var _count = this.mergedStyles.length;
        for (var i = 0; i < _count; i++)
        {
            this.drawStyle(_graphics, this.mergedStyles[i].Style, _api);
        }

        _stream["ClearNoAttack"]();

        _stream["WriteByte"](1);

        _api.WordControl.m_oDrawingDocument.Native["DD_EndNativeDraw"](_stream);
    },
GenerateDefaultStyles: function(_api, ds, _graphics)
    {
        var styles = ds;

        for (var i in styles)
        {
            var style = styles[i];
            if (true == style.qFormat)
            {
                this.defaultStyles.push({ Name: style.Name, Style: style });
                //this.drawStyle(_graphics, style, _api);
            }
        }
    },

GenerateDocumentStyles: function(_api, _graphics)
    {
        if (_api.WordControl.m_oLogicDocument == null)
            return;

        var __Styles = _api.WordControl.m_oLogicDocument.Get_Styles();
        var styles = __Styles.Style;

        if (styles == null)
            return;

        for (var i in styles)
        {
            var style = styles[i];
            if (true == style.qFormat)
            {
                // как только меняется сериалайзер - меняется и код здесь. Да, не очень удобно,
                // зато быстро делается
                var formalStyle = i.toLowerCase().replace(/\s/g, "");
                var res = formalStyle.match(/^heading([1-9][0-9]*)$/);
                var index = (res) ? res[1] - 1 : -1;

                var _dr_style = __Styles.Get_Pr(i, styletype_Paragraph);
                _dr_style.Name = style.Name;
                _dr_style.Id = i;

                //this.drawStyle(_graphics, _dr_style, _api);

                var _name = _dr_style.Name;
                // алгоритм смены имени
                if (style.Default)
                {
                    switch (style.Default)
                    {
                        case 1:
                            break;
                        case 2:
                            _name = "No List";
                            break;
                        case 3:
                            _name = "Normal";
                            break;
                        case 4:
                            _name = "Normal Table";
                            break;
                    }
                }
                else if (index != -1)
                {
                    _name = "Heading ".concat(index + 1);
                }

                this.docStyles.push({ Name: _name, Style: _dr_style });
            }
        }
    },

drawStyle: function(graphics, style, _api)
    {
        var _w_px = this.STYLE_THUMBNAIL_WIDTH;
        var _h_px = this.STYLE_THUMBNAIL_HEIGHT;
        var dKoefToMM = AscCommon.g_dKoef_pix_to_mm;

        if (AscCommon.AscBrowser.isRetina)
            dKoefToMM /= 2;

        _api.WordControl.m_oDrawingDocument.Native["DD_StartNativeDraw"](_w_px, _h_px, _w_px * dKoefToMM, _h_px * dKoefToMM);

        AscCommon.g_oTableId.m_bTurnOff = true;
        AscCommon.History.TurnOff();

        var oldDefTabStop = AscCommonWord.Default_Tab_Stop;
        AscCommonWord.Default_Tab_Stop = 1;

        var hdr = new CHeaderFooter(_api.WordControl.m_oLogicDocument.HdrFtr, _api.WordControl.m_oLogicDocument, _api.WordControl.m_oDrawingDocument, AscCommon.hdrftr_Header);
        var _dc = hdr.Content;//new CDocumentContent(editor.WordControl.m_oLogicDocument, editor.WordControl.m_oDrawingDocument, 0, 0, 0, 0, false, true, false);

        var par = new AscCommonWord.Paragraph(_api.WordControl.m_oDrawingDocument, _dc, 0, 0, 0, 0, false);
        var run = new AscCommonWord.ParaRun(par, false);

        for (var i = 0; i < style.Name.length; i++)
        {
            run.Add_ToContent(i, new ParaText(style.Name.charAt(i)), false);
        }

        _dc.Internal_Content_Add(0, par, false);
        par.Add_ToContent(0, run);
        par.Style_Add(style.Id, false);
        par.Set_Align(AscCommon.align_Left);
        par.Set_Tabs(new AscCommonWord.CParaTabs());

        var _brdL = style.ParaPr.Brd.Left;
        if ( undefined !== _brdL && null !== _brdL )
        {
            var brdL = new CDocumentBorder();
            brdL.Set_FromObject(_brdL);
            brdL.Space = 0;
            par.Set_Border(brdL, AscDFH.historyitem_Paragraph_Borders_Left);
        }

        var _brdT = style.ParaPr.Brd.Top;
        if ( undefined !== _brdT && null !== _brdT )
        {
            var brd = new CDocumentBorder();
            brd.Set_FromObject(_brdT);
            brd.Space = 0;
            par.Set_Border(brd, AscDFH.historyitem_Paragraph_Borders_Top);
        }

        var _brdB = style.ParaPr.Brd.Bottom;
        if ( undefined !== _brdB && null !== _brdB )
        {
            var brd = new CDocumentBorder();
            brd.Set_FromObject(_brdB);
            brd.Space = 0;
            par.Set_Border(brd, AscDFH.historyitem_Paragraph_Borders_Bottom);
        }

        var _brdR = style.ParaPr.Brd.Right;
        if ( undefined !== _brdR && null !== _brdR )
        {
            var brd = new CDocumentBorder();
            brd.Set_FromObject(_brdR);
            brd.Space = 0;
            par.Set_Border(brd, AscDFH.historyitem_Paragraph_Borders_Right);
        }

        var _ind = new CParaInd();
        _ind.FirstLine = 0;
        _ind.Left = 0;
        _ind.Right = 0;
        par.Set_Ind(_ind, false);

        var _sp = new CParaSpacing();
        _sp.Line              = 1;
        _sp.LineRule          = Asc.linerule_Auto;
        _sp.Before            = 0;
        _sp.BeforeAutoSpacing = false;
        _sp.After             = 0;
        _sp.AfterAutoSpacing  = false;
        par.Set_Spacing(_sp, false);

        _dc.Reset(0, 0, 10000, 10000);
        _dc.Recalculate_Page(0, true);

        _dc.Reset(0, 0, par.Lines[0].Ranges[0].W + 0.001, 10000);
        _dc.Recalculate_Page(0, true);

        var y = 0;
        var b = dKoefToMM * _h_px;
        var w = dKoefToMM * _w_px;
        var off = 10 * dKoefToMM;
        var off2 = 5 * dKoefToMM;
        var off3 = 1 * dKoefToMM;

        graphics.transform(1,0,0,1,0,0);
        graphics.save();
        graphics._s();
        graphics._m(off2, y + off3);
        graphics._l(w - off, y + off3);
        graphics._l(w - off, b - off3);
        graphics._l(off2, b - off3);
        graphics._z();
        graphics.clip();

        var baseline = par.Lines[0].Y;
        par.Shift(0, off + 0.5, y + 0.75 * (b - y) - baseline);
        par.Draw(0, graphics);

        graphics.restore();

        AscCommonWord.Default_Tab_Stop = oldDefTabStop;

        AscCommon.g_oTableId.m_bTurnOff = false;
        AscCommon.History.TurnOn();

        var _stream = global_memory_stream_menu;

        _stream["ClearNoAttack"]();

        _stream["WriteByte"](0);
        _stream["WriteString2"](style.Name);

        _api.WordControl.m_oDrawingDocument.Native["DD_EndNativeDraw"](_stream);
        graphics.ClearParams();
    }
};

// -------------------------------------------------

// declarate unused methods and objects
window["ftm"] = FT_Memory;


Asc['asc_docs_api'].prototype["Native_Editor_Initialize_Settings"] = function(_params)
{
    window["NativeSupportTimeouts"] = true;

    if (!_params)
        return;

    var _current = { pos : 0 };
    var _continue = true;
    while (_continue)
    {
        var _attr = _params[_current.pos++];
        switch (_attr)
        {
            case 0:
            {
                AscCommonWord.GlobalSkin.STYLE_THUMBNAIL_WIDTH = _params[_current.pos++];
                break;
            }
            case 1:
            {
                AscCommonWord.GlobalSkin.STYLE_THUMBNAIL_HEIGHT = _params[_current.pos++];
                break;
            }
            case 2:
            {
                TABLE_STYLE_WIDTH_PIX = _params[_current.pos++];
                break;
            }
            case 3:
            {
                TABLE_STYLE_HEIGHT_PIX = _params[_current.pos++];
                break;
            }
            case 4:
            {
                this.chartPreviewManager.CHART_PREVIEW_WIDTH_PIX = _params[_current.pos++];
                break;
            }
            case 5:
            {
                this.chartPreviewManager.CHART_PREVIEW_HEIGHT_PIX = _params[_current.pos++];
                break;
            }
            case 6:
            {
                var _val = _params[_current.pos++];
                if (_val === true)
                {
                    this.ShowParaMarks = false;
                    AscCommon.CollaborativeEditing.Set_GlobalLock(true);

                    this.isViewMode = true;
                    this.WordControl.m_oDrawingDocument.IsViewMode = true;
                }
                break;
            }
            case 100:
            {
                this.WordControl.m_oDrawingDocument.IsRetina = _params[_current.pos++];
                break;
            }
            case 101:
            {
                this.WordControl.m_oDrawingDocument.IsMobile = _params[_current.pos++];
                window.AscAlwaysSaveAspectOnResizeTrack = true;
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

    AscCommon.AscBrowser.isRetina = this.WordControl.m_oDrawingDocument.IsRetina;
};

/***************************** COPY|PASTE *******************************/

Asc['asc_docs_api'].prototype.Call_Menu_Context_Copy = function()
{
    var dataBuffer = {};

    var clipboard = {};
    clipboard.pushData = function(type, data) {

        if (AscCommon.c_oAscClipboardDataFormat.Text === type) {

            dataBuffer.text = data;

        } else if (AscCommon.c_oAscClipboardDataFormat.Internal === type) {

            if (null != data.drawingUrls && data.drawingUrls.length > 0) {
                dataBuffer.drawingUrls = data.drawingUrls[0];
            }

            dataBuffer.sBase64 = data.sBase64;
        }
    }

    this.asc_CheckCopy(clipboard, AscCommon.c_oAscClipboardDataFormat.Internal|AscCommon.c_oAscClipboardDataFormat.Text);

    var _stream = global_memory_stream_menu;
    _stream["ClearNoAttack"]();

    if (dataBuffer.text) {
        _stream["WriteByte"](0);
        _stream["WriteString2"](dataBuffer.text);
    }

    if (dataBuffer.drawingUrls) {
        _stream["WriteByte"](1);
        _stream["WriteStringA"](dataBuffer.drawingUrls);
    }

    if (dataBuffer.sBase64) {
        _stream["WriteByte"](2);
        _stream["WriteStringA"](dataBuffer.sBase64);
    }

    _stream["WriteByte"](255);

    return _stream;
};
Asc['asc_docs_api'].prototype.Call_Menu_Context_Cut = function()
{
    var dataBuffer = {};

    var clipboard = {};
    clipboard.pushData = function(type, data) {

        if (AscCommon.c_oAscClipboardDataFormat.Text === type) {

            dataBuffer.text = data;

        } else if (AscCommon.c_oAscClipboardDataFormat.Internal === type) {

            if (null != data.drawingUrls && data.drawingUrls.length > 0) {
                dataBuffer.drawingUrls = data.drawingUrls[0];
            }

            dataBuffer.sBase64 = data.sBase64;
        }
    }

    this.asc_CheckCopy(clipboard, AscCommon.c_oAscClipboardDataFormat.Internal|AscCommon.c_oAscClipboardDataFormat.Text);

    this.asc_SelectionCut();

    var _stream = global_memory_stream_menu;
    _stream["ClearNoAttack"]();

    if (dataBuffer.text) {
        _stream["WriteByte"](0);
        _stream["WriteString2"](dataBuffer.text);
    }

    if (dataBuffer.drawingUrls) {
        _stream["WriteByte"](1);
        _stream["WriteStringA"](dataBuffer.drawingUrls);
    }

    if (dataBuffer.sBase64) {
        _stream["WriteByte"](2);
        _stream["WriteStringA"](dataBuffer.sBase64);
    }

    _stream["WriteByte"](255);

    return _stream;
};
Asc['asc_docs_api'].prototype.Call_Menu_Context_Paste = function(type, param)
{
    if (0 == type)
    {
        this.asc_PasteData(AscCommon.c_oAscClipboardDataFormat.Text, param);
    }
    else if (1 == type)
    {
        this.AddImageUrlNative(param, 200, 200);
    }
    else if (2 == type)
    {
        this.asc_PasteData(AscCommon.c_oAscClipboardDataFormat.Internal, param);
    }
};
Asc['asc_docs_api'].prototype.Call_Menu_Context_Delete = function()
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(AscCommon.changestype_Delete) )
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
        this.WordControl.m_oLogicDocument.Remove( 1, true );
    }
};
Asc['asc_docs_api'].prototype.Call_Menu_Context_Select = function()
{
    this.WordControl.m_oLogicDocument.MoveCursorLeft(false, true);
    this.WordControl.m_oLogicDocument.MoveCursorRight(true, true);
    this.WordControl.m_oLogicDocument.Document_UpdateSelectionState();
};
Asc['asc_docs_api'].prototype.Call_Menu_Context_SelectAll = function()
{
    this.WordControl.m_oLogicDocument.Select_All();
};
Asc['asc_docs_api'].prototype.pre_Paste = function(_fonts, _images, callback)
{
    AscCommon.History.Create_NewPoint(AscDFH.historydescription_PasteNative);
    callback();
};
/************************************************************************/

// chat styles
AscCommon.ChartPreviewManager.prototype.clearPreviews = function()
{
    window["native"]["DD_ClearCacheChartStyles"]();
};
AscCommon.ChartPreviewManager.prototype.createChartPreview = function(_graphics, type, styleIndex)
{
    return AscFormat.ExecuteNoHistory(function(){
                                      if(!this.chartsByTypes[type])
                                      this.chartsByTypes[type] = this.getChartByType(type);
                                      var chart_space = this.chartsByTypes[type];
                                      if(chart_space.style !== styleIndex)
                                      {
                                      chart_space.style = styleIndex;
                                      chart_space.recalculateMarkers();
                                      chart_space.recalculateSeriesColors();
                                      chart_space.recalculatePlotAreaChartBrush();
                                      chart_space.recalculatePlotAreaChartPen();
                                      chart_space.recalculateChartBrush();
                                      chart_space.recalculateChartPen();
                                      chart_space.recalculateUpDownBars();
                                      }
                                      chart_space.recalculatePenBrush();

                                      var _width_px = this.CHART_PREVIEW_WIDTH_PIX;
                                      var _height_px = this.CHART_PREVIEW_WIDTH_PIX;
                                      if (AscCommon.AscBrowser.isRetina)
                                      {
                                      _width_px <<= 1;
                                      _height_px <<= 1;
                                      }

                                      window["native"]["DD_StartNativeDraw"](_width_px, _height_px, 50, 50);

                                      var dKoefToMM = AscCommon.g_dKoef_pix_to_mm;
                                      if (this.IsRetinaEnabled)
                                      dKoefToMM /= 2;

                                      chart_space.draw(_graphics);
                                      _graphics.ClearParams();

                                      var _stream = global_memory_stream_menu;
                                      _stream["ClearNoAttack"]();
                                      _stream["WriteByte"](4);
                                      _stream["WriteLong"](type);
                                      _stream["WriteLong"](styleIndex);
                                      window["native"]["DD_EndNativeDraw"](_stream);

                                      }, this, []);

};

AscCommon.ChartPreviewManager.prototype.getChartPreviews = function(chartType)
{
    if (AscFormat.isRealNumber(chartType))
    {
        var bIsCached = window["native"]["DD_IsCachedChartStyles"](chartType);
        if (!bIsCached)
        {
            window["native"]["DD_PrepareNativeDraw"]();

            var _graphics = new CDrawingStream();

            for (var i = 1; i < 49; ++i)
                this.createChartPreview(_graphics, chartType, i);

            var _stream = global_memory_stream_menu;
            _stream["ClearNoAttack"]();
            _stream["WriteByte"](5);
            _api.WordControl.m_oDrawingDocument.Native["DD_EndNativeDraw"](_stream);
        }
    }
};

function NativeOpenFile3(_params, documentInfo)
{
    window["CreateMainTextMeasurerWrapper"]();

    window.g_file_path = "native_open_file";
    window.NATIVE_DOCUMENT_TYPE = window.native.GetEditorType();
    var doc_bin = window.native.GetFileString(window.g_file_path);
    if (window.NATIVE_DOCUMENT_TYPE == "presentation" || window.NATIVE_DOCUMENT_TYPE == "document")
    {
        _api = new window["Asc"]["asc_docs_api"]("");

        if (undefined !== _api.Native_Editor_Initialize_Settings)
        {
            _api.Native_Editor_Initialize_Settings(_params);
        }

        window.documentInfo = documentInfo;

        var userInfo = new Asc.asc_CUserInfo();
        userInfo.asc_putId(window.documentInfo["docUserId"]);
        userInfo.asc_putFullName(window.documentInfo["docUserName"]);
        userInfo.asc_putFirstName(window.documentInfo["docUserFirstName"]);
        userInfo.asc_putLastName(window.documentInfo["docUserLastName"]);

        var docInfo = new Asc.asc_CDocInfo();
        docInfo.put_Id(window.documentInfo["docKey"]);
        docInfo.put_Url(window.documentInfo["docURL"]);
        docInfo.put_Format("docx");
        docInfo.put_UserInfo(userInfo);

        _api.asc_setDocInfo(docInfo);

        _api.asc_registerCallback("asc_onAdvancedOptions", function(options) {
                                  var stream = global_memory_stream_menu;
                                  stream["ClearNoAttack"]();
                                  stream["WriteLong"](options.asc_getOptionId());
                                  window["native"]["OnCallMenuEvent"](22000, stream); // ASC_MENU_EVENT_TYPE_ADVANCED_OPTIONS
                                  });

        _api.asc_registerCallback("asc_onSendThemeColorSchemes", function(schemes) {
                                  var stream = global_memory_stream_menu;
                                  stream["ClearNoAttack"]();
                                  asc_WriteColorSchemes(schemes, stream);
                                  window["native"]["OnCallMenuEvent"](2404, stream); // ASC_SPREADSHEETS_EVENT_TYPE_COLOR_SCHEMES
                                  });

        if (window.documentInfo["iscoauthoring"]) {

            _api.isSpellCheckEnable = false;

            _api.asc_setAutoSaveGap(1);
            _api._coAuthoringInit();
            _api.asc_SetFastCollaborative(true);

            _api.asc_registerCallback("asc_onAuthParticipantsChanged", function(users) {
                                      var stream = global_memory_stream_menu;
                                      stream["ClearNoAttack"]();
                                      asc_WriteUsers(users, stream);
                                      window["native"]["OnCallMenuEvent"](20101, stream); // ASC_COAUTH_EVENT_TYPE_PARTICIPANTS_CHANGED
                                      });

            _api.asc_registerCallback("asc_onParticipantsChanged", function(users) {
                                      var stream = global_memory_stream_menu;
                                      stream["ClearNoAttack"]();
                                      asc_WriteUsers(users, stream);
                                      window["native"]["OnCallMenuEvent"](20101, stream); // ASC_COAUTH_EVENT_TYPE_PARTICIPANTS_CHANGED
                                      });

            _api.asc_registerCallback("asc_onGetEditorPermissions", function(state) {

                                      var rData = {
                                      "c"             : "open",
                                      "id"            : window.documentInfo["docKey"],
                                      "userid"        : window.documentInfo["docUserId"],
                                      "format"        : "docx",
                                      "vkey"          : undefined,
                                      "url"           : window.documentInfo["docURL"],
                                      "title"         : this.documentTitle,
                                      "embeddedfonts" : false};

                                      _api.CoAuthoringApi.auth(window.documentInfo["viewmode"], rData);
                                      });

            _api.asc_registerCallback("asc_onDocumentUpdateVersion", function(callback) {
                                      var me = this;
                                      me.needToUpdateVersion = true;
                                      if (callback) callback.call(me);
                                      });


        } else {
            var doc_bin = window.native.GetFileString(window.g_file_path);
            _api.asc_nativeOpenFile(doc_bin);

            if (null != _api.WordControl.m_oLogicDocument)
            {
			           _api.sendColorThemes(_api.WordControl.m_oLogicDocument.theme);
            }

            if (_api.NativeAfterLoad)
            {
                _api.NativeAfterLoad();
            }
        }
    }
    Api = _api;
}

var DocumentPageSize = new function()
{
    this.oSizes    = [{name : "US Letter", w_mm : 215.9, h_mm : 279.4, w_tw : 12240, h_tw : 15840},
                      {name : "US Legal", w_mm : 215.9, h_mm : 355.6, w_tw : 12240, h_tw : 20160},
                      {name : "A4", w_mm : 210, h_mm : 297, w_tw : 11907, h_tw : 16839},
                      {name : "A5", w_mm : 148.1, h_mm : 209.9, w_tw : 8391, h_tw : 11907},
                      {name : "B5", w_mm : 176, h_mm : 250.1, w_tw : 9979, h_tw : 14175},
                      {name : "Envelope #10", w_mm : 104.8, h_mm : 241.3, w_tw : 5940, h_tw : 13680},
                      {name : "Envelope DL", w_mm : 110.1, h_mm : 220.1, w_tw : 6237, h_tw : 12474},
                      {name : "Tabloid", w_mm : 279.4, h_mm : 431.7, w_tw : 15842, h_tw : 24477},
                      {name : "A3", w_mm : 297, h_mm : 420.1, w_tw : 16840, h_tw : 23820},
                      {name : "Tabloid Oversize", w_mm : 304.8, h_mm : 457.1, w_tw : 17282, h_tw : 25918},
                      {name : "ROC 16K", w_mm : 196.8, h_mm : 273, w_tw : 11164, h_tw : 15485},
                      {name : "Envelope Coukei 3", w_mm : 119.9, h_mm : 234.9, w_tw : 6798, h_tw : 13319},
                      {name : "Super B/A3", w_mm : 330.2, h_mm : 482.5, w_tw : 18722, h_tw : 27358}
                      ];
    this.sizeEpsMM = 0.5;
    this.getSize   = function(widthMm, heightMm)
    {
        for (var index in this.oSizes)
        {
            var item = this.oSizes[index];
            if (Math.abs(widthMm - item.w_mm) < this.sizeEpsMM && Math.abs(heightMm - item.h_mm) < this.sizeEpsMM)
                return item;
        }
        return {w_mm : widthMm, h_mm : heightMm};
    };
};

window["asc_docs_api"].prototype["asc_nativeOpenFile2"] = function(base64File, version)
{
    this.SpellCheckUrl = '';

    this.WordControl.m_bIsRuler = false;
    this.WordControl.Init();

    this.InitEditor();
    this.DocumentType   = 2;
    this.LoadedObjectDS = this.WordControl.m_oLogicDocument.CopyStyle();

    AscCommon.g_oIdCounter.Set_Load(true);

    var openParams        = {checkFileSize : /*this.isMobileVersion*/false, charCount : 0, parCount : 0};
    var oBinaryFileReader = new AscCommonWord.BinaryFileReader(this.WordControl.m_oLogicDocument, openParams);

    if (undefined === version)
    {
        if (oBinaryFileReader.Read(base64File))
        {
            AscCommon.g_oIdCounter.Set_Load(false);
            this.LoadedObject = 1;

            this.sync_EndAction(Asc.c_oAscAsyncActionType.BlockInteraction, Asc.c_oAscAsyncAction.Open);

            // проверяем какие шрифты нужны
            //this.WordControl.m_oDrawingDocument.CheckFontNeeds();
            AscCommon.pptx_content_loader.CheckImagesNeeds(this.WordControl.m_oLogicDocument);

            //this.FontLoader.LoadEmbeddedFonts(this.DocumentUrl, this.WordControl.m_oLogicDocument.EmbeddedFonts);
            //this.FontLoader.LoadDocumentFonts(this.WordControl.m_oLogicDocument.Fonts, false);
        }
        else
            this.sendEvent("asc_onError", Asc.c_oAscError.ID.MobileUnexpectedCharCount, Asc.c_oAscError.Level.Critical);
    }
    else
    {
        AscCommon.CurFileVersion = version;
        if (oBinaryFileReader.ReadData(base64File))
        {
            AscCommon.g_oIdCounter.Set_Load(false);
            this.LoadedObject = 1;

            this.sync_EndAction(Asc.c_oAscAsyncActionType.BlockInteraction, Asc.c_oAscAsyncAction.Open);
        }
        else
            this.sendEvent("asc_onError", Asc.c_oAscError.ID.MobileUnexpectedCharCount, Asc.c_oAscError.Level.Critical);
    }

    /*
     if (window["NATIVE_EDITOR_ENJINE"] === true && undefined != window["native"])
     {
     AscCommon.CDocsCoApi.prototype.askSaveChanges = function(callback)
     {
     callback({"saveLock" : false});
     };
     AscCommon.CDocsCoApi.prototype.saveChanges    = function(arrayChanges, deleteIndex, excelAdditionalInfo)
     {
     if (window["native"]["SaveChanges"])
     window["native"]["SaveChanges"](arrayChanges.join("\",\""), deleteIndex, arrayChanges.length);
     };
     }
     */

    if (undefined != window["Native"])
        return;

    //callback
    this.DocumentOrientation = (null == editor.WordControl.m_oLogicDocument) ? true : !editor.WordControl.m_oLogicDocument.Orientation;
    var sizeMM;
    if (this.DocumentOrientation)
        sizeMM = DocumentPageSize.getSize(AscCommon.Page_Width, AscCommon.Page_Height);
    else
        sizeMM = DocumentPageSize.getSize(AscCommon.Page_Height, AscCommon.Page_Width);
    this.sync_DocSizeCallback(sizeMM.w_mm, sizeMM.h_mm);
    this.sync_PageOrientCallback(editor.get_DocumentOrientation());

    if (this.GenerateNativeStyles !== undefined)
    {
        this.GenerateNativeStyles();

        if (this.WordControl.m_oDrawingDocument.CheckTableStylesOne !== undefined)
            this.WordControl.m_oDrawingDocument.CheckTableStylesOne();
    }
};

Asc['asc_docs_api'].prototype.openDocument = function(sData)
{
    _api.asc_nativeOpenFile2(sData.data);

    var version;
    if (sData.changes && this.VersionHistory)
    {
        this.VersionHistory.changes = sData.changes;
        this.VersionHistory.applyChanges(this);
    }

    if (_api.NativeAfterLoad)
        _api.NativeAfterLoad();

    //console.log("ImageMap : " + JSON.stringify(this.WordControl.m_oLogicDocument));

    this.ImageLoader.bIsLoadDocumentFirst = true;
    this.ImageLoader.LoadDocumentImages(this.WordControl.m_oLogicDocument.ImageMap, true);

    this.WordControl.m_oLogicDocument.Continue_FastCollaborativeEditing();

    //this.asyncFontsDocumentEndLoaded();

    this.ParcedDocument = true;
    if (this.isStartCoAuthoringOnEndLoad)
    {
        this.CoAuthoringApi.onStartCoAuthoring(true);
        this.isStartCoAuthoringOnEndLoad = false;
    }

    if (null != _api.WordControl.m_oLogicDocument)
    {
         _api.sendColorThemes(_api.WordControl.m_oLogicDocument.theme);
    }

    window["native"]["onEndLoadingFile"]();

    this.WordControl.m_oDrawingDocument.Collaborative_TargetsUpdate(true);

    var t = this;
    setInterval(function() {
                t._autoSave();
                }, 40);
};

window["AscCommon"].getFullImageSrc2 = function (src) {
    var start = src.slice(0, 6);
    if (0 === start.indexOf('theme') && editor.ThemeLoader){
        return  editor.ThemeLoader.ThemesUrlAbs + src;
    }

    if (0 !== start.indexOf('http:') && 0 !== start.indexOf('data:') && 0 !== start.indexOf('https:') &&
        0 !== start.indexOf('file:') && 0 !== start.indexOf('ftp:')){
        var srcFull = AscCommon.g_oDocumentUrls.getImageUrl(src);
        if(srcFull){
            window["native"]["loadUrlImage"](srcFull, src);
            return srcFull;
        }
    }
    return src;
};
