/*
 * (c) Copyright Ascensio System SIA 2010-2018
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

var global_memory_stream_menu = CreateNativeMemoryStream();

window.IS_NATIVE_EDITOR = true;

var sdkCheck = true;
// endsectionPr -----------------------------------------------------------------------------------------

window['SockJS'] = createSockJS();

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

window["use_native_fonts_only"] = true;
// -------------------------------------------------

// declarate unused methods and objects
window["ftm"] = FT_Memory;

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
                    _stream["WriteLong"](_fill.Positions[i]);
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
                _fill.fill = asc_menu_WriteAscFill_patt(1, _fill.fill, _stream);
                break;
            }
            case Asc.c_oAscFill.FILL_TYPE_GRAD:
            {
                _fill.fill = asc_menu_WriteAscFill_grad(1, _fill.fill, _stream);
                break;
            }
            case Asc.c_oAscFill.FILL_TYPE_BLIP:
            {
                _fill.fill = asc_menu_WriteAscFill_blip(1, _fill.fill, _stream);
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

function asc_menu_ReadPosition(_params, _cursor) {
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

function asc_menu_WritePosition(_type, _position, _stream) {
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

function asc_menu_ReadPaddings(_params, _cursor) {
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
};

function asc_menu_WritePaddings(_type, _paddings, _stream) {
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
};

function asc_menu_WriteImagePosition(_type, _position, _stream){
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

function asc_menu_WriteShapePr(_type, _shapePr, _stream) {
    if (!_shapePr)
        return;

    if (_type !== undefined) {
        _stream["WriteByte"](_type);
    }

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

function asc_menu_WriteImagePr(_imagePr, _stream){
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

    //asc_menu_WriteChartPr(12, _imagePr.ChartProperties, _stream);
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

function asc_menu_WriteSlidePr(_slidePr, _stream){
    asc_menu_WriteAscFill(0, _slidePr.Background, _stream);
    asc_menu_WriteTiming(1, _slidePr.Timing, _stream);
    if(AscFormat.isRealNumber(_slidePr.LayoutIndex)){
        _stream["WriteByte"](2);
        _stream["WriteLong"](_slidePr.LayoutIndex);
    }
    if(AscFormat.isRealBool(_slidePr.isHidden)){
        _stream["WriteByte"](3);
        _stream["WriteBool"](_slidePr.isHidden);
    }
    if(AscFormat.isRealBool(_slidePr.lockBackground)){
        _stream["WriteByte"](4);
        _stream["WriteBool"](_slidePr.lockBackground);
    }
    if(AscFormat.isRealBool(_slidePr.lockDelete)){
        _stream["WriteByte"](5);
        _stream["WriteBool"](_slidePr.lockDelete);
    }
    if(AscFormat.isRealBool(_slidePr.lockLayout)){
        _stream["WriteByte"](6);
        _stream["WriteBool"](_slidePr.lockLayout);
    }
    if(AscFormat.isRealBool(_slidePr.lockRemove)){
        _stream["WriteByte"](7);
        _stream["WriteBool"](_slidePr.lockRemove);
    }
    if(AscFormat.isRealBool(_slidePr.lockTiming)){
        _stream["WriteByte"](8);
        _stream["WriteBool"](_slidePr.lockTiming);
    }
    if(AscFormat.isRealBool(_slidePr.lockTranzition)){
        _stream["WriteByte"](9);
        _stream["WriteBool"](_slidePr.lockTranzition);
    }
    _stream["WriteByte"](255);
}

function asc_menu_ReadSlidePr(_params, _cursor){
    var _settings = new Asc.CAscSlideProps();

    var _continue = true;
    while (_continue)
    {
        var _attr = _params[_cursor.pos++];
        switch (_attr)
        {
            case 0:
            {
                _settings.Background = asc_menu_ReadAscFill(_params, _cursor);
                break;
            }
            case 1:
            {
                _settings.Timing = asc_menu_ReadTiming(_params, _cursor);
                break;
            }
            case 2:
            {
                _settings.LayoutIndex = _params[_cursor.pos++];
                break;
            }
            case 3:
            {
                _settings.isHidden = _params[_cursor.pos++];
                break;
            }
            case 4:
            {
                _settings.lockBackground = _params[_cursor.pos++];
                break;
            }
            case 5:
            {
                _settings.lockDelete = _params[_cursor.pos++];
                break;
            }
            case 6:
            {
                _settings.lockLayout = _params[_cursor.pos++];
                break;
            }
            case 7:
            {
                _settings.lockRemove = _params[_cursor.pos++];
                break;
            }
            case 8:
            {
                _settings.lockTiming = _params[_cursor.pos++];
                break;
            }
            case 9:
            {
                _settings.lockTranzition = _params[_cursor.pos++];
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
}

function asc_menu_WriteTiming(type, _timing, _stream){

    _stream["WriteByte"](type);
    if(AscFormat.isRealNumber(_timing.TransitionType)){
        _stream["WriteByte"](0);
        _stream["WriteLong"](_timing.TransitionType);
    }
    if(AscFormat.isRealNumber(_timing.TransitionOption)){
        _stream["WriteByte"](1);
        _stream["WriteLong"](_timing.TransitionOption);
    }
    if(AscFormat.isRealNumber(_timing.TransitionDuration)){
        _stream["WriteByte"](2);
        _stream["WriteLong"](_timing.TransitionDuration);
    }
    if(AscFormat.isRealBool(_timing.SlideAdvanceOnMouseClick)){
        _stream["WriteByte"](3);
        _stream["WriteBool"](_timing.SlideAdvanceOnMouseClick);
    }
    if(AscFormat.isRealBool(_timing.SlideAdvanceAfter)){
        _stream["WriteByte"](4);
        _stream["WriteBool"](_timing.SlideAdvanceAfter);
    }
    if(AscFormat.isRealBool(_timing.ShowLoop)){
        _stream["WriteByte"](5);
        _stream["WriteBool"](_timing.ShowLoop);
    }
    if(AscFormat.isRealNumber(_timing.SlideAdvanceDuration)){
        _stream["WriteByte"](6);
        _stream["WriteLong"](_timing.SlideAdvanceDuration);
    }

    _stream["WriteByte"](255);
}

function asc_menu_ReadTiming(_params, _cursor)
{
    var _settings = new Asc.CAscSlideTiming();

    var _continue = true;
    while (_continue)
    {
        var _attr = _params[_cursor.pos++];
        switch (_attr)
        {
            case 0:
            {
                _settings.TransitionType = _params[_cursor.pos++];
                break;
            }
            case 1:
            {
                _settings.TransitionOption = _params[_cursor.pos++];
                break;
            }
            case 2:
            {
                _settings.TransitionDuration = _params[_cursor.pos++];
                break;
            }
            case 3:
            {
                _settings.SlideAdvanceOnMouseClick = _params[_cursor.pos++];
                break;
            }
            case 4:
            {
                _settings.SlideAdvanceAfter = _params[_cursor.pos++];
                break;
            }
            case 5:
            {
                _settings.ShowLoop = _params[_cursor.pos++];
                break;
            }
            case 6:
            {
                _settings.SlideAdvanceDuration = _params[_cursor.pos++];
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

function NativeOpenFileP(_params, documentInfo){
    window["CreateMainTextMeasurerWrapper"]();
    window.g_file_path = "native_open_file";
    window.NATIVE_DOCUMENT_TYPE = window.native.GetEditorType();
    var doc_bin = window.native.GetFileString(window.g_file_path);
    if ("presentation" !== window.NATIVE_DOCUMENT_TYPE){
        return;
    }

    sdkCheck = documentInfo["sdkCheck"];
    _api = new window["Asc"]["asc_docs_api"]("");
    AscCommon.g_clipboardBase.Init(_api);
    _api.Native_Editor_Initialize_Settings(_params);
    window.documentInfo = documentInfo;
    var userInfo = new Asc.asc_CUserInfo();
    userInfo.asc_putId(window.documentInfo["docUserId"]);
    userInfo.asc_putFullName(window.documentInfo["docUserName"]);
    userInfo.asc_putFirstName(window.documentInfo["docUserFirstName"]);
    userInfo.asc_putLastName(window.documentInfo["docUserLastName"]);

    var docInfo = new Asc.asc_CDocInfo();
    docInfo.put_Id(window.documentInfo["docKey"]);
    docInfo.put_Url(window.documentInfo["docURL"]);
    docInfo.put_Format("pptx");
    docInfo.put_UserInfo(userInfo);
    docInfo.put_Token(window.documentInfo["token"]);

    var permissions = window.documentInfo["permissions"];
    if (undefined != permissions && null != permissions && permissions.length > 0) {
        docInfo.put_Permissions(JSON.parse(permissions));
    }
    _api.asc_setDocInfo(docInfo);
    // _api.asc_registerCallback("asc_onAdvancedOptions", function(options) {
    //     var stream = global_memory_stream_menu;
    //     stream["ClearNoAttack"]();
    //     stream["WriteString2"](JSON.stringify(options));
    //     window["native"]["OnCallMenuEvent"](22000, stream); // ASC_MENU_EVENT_TYPE_ADVANCED_OPTIONS
    // });
    //
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
        _api.SetCollaborativeMarksShowType(Asc.c_oAscCollaborativeMarksShowType.None);
        window["native"]["onTokenJWT"](_api.CoAuthoringApi.get_jwt());

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
                "format"        : "pptx",
                "vkey"          : undefined,
                "url"           : window.documentInfo["docURL"],
                "title"         : this.documentTitle,
                "nobase64"      : true};

            _api.CoAuthoringApi.auth(window.documentInfo["viewmode"], rData);
        });

        _api.asc_registerCallback("asc_onDocumentUpdateVersion", function(callback) {
            var me = this;
            me.needToUpdateVersion = true;
            if (callback) callback.call(me);
        });
    } else {
        _api.asc_nativeOpenFile(doc_bin);
        _api.documentId = "1";
        _api.WordControl.m_oDrawingDocument.AfterLoad();
        Api = _api;

        var _presentation = _api.WordControl.m_oLogicDocument;

        var nSlidesCount = _presentation.Slides.length;
        var dPresentationWidth = _presentation.Width;
        var dPresentationHeight = _presentation.Height;

        var aTimings = [];
        var slides = _presentation.Slides;
        for(var i = 0; i < slides.length; ++i){
            aTimings.push(slides[i].timing.ToArray());
        }

        _api.asc_GetDefaultTableStyles();

        return [nSlidesCount, dPresentationWidth, dPresentationHeight, aTimings];
    }
}

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
                AscCommonSlide.GlobalSkin.STYLE_THUMBNAIL_WIDTH = _params[_current.pos++];
                break;
            }
            case 1:
            {
                AscCommonSlide.GlobalSkin.STYLE_THUMBNAIL_HEIGHT = _params[_current.pos++];
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



Asc['asc_docs_api'].prototype["CheckSlideBounds"] = function(nSlideIndex){
    var oBoundsChecker = new AscFormat.CSlideBoundsChecker();
    this.WordControl.m_oLogicDocument.Draw(nSlideIndex, oBoundsChecker);
    var oBounds = oBoundsChecker.Bounds;
    return [
        oBounds.min_x, oBounds.max_x, oBounds.min_y, oBounds.max_y
    ]
}

Asc['asc_docs_api'].prototype["GetNativePageMeta"] = function(pageIndex)
{
    this.WordControl.m_oDrawingDocument.RenderPage(pageIndex);
};



window["asc_docs_api"].prototype["asc_nativeOpenFile2"] = function(base64File, version)
{
    this.SpellCheckUrl = '';

    this.WordControl.m_bIsRuler = false;
    this.WordControl.Init();

    this.InitEditor();

    this.DocumentType   = 2;

    AscCommon.g_oIdCounter.Set_Load(true);

    var _loader = new AscCommon.BinaryPPTYLoader();
    _loader.Api = this;

    _loader.Load(base64File, this.WordControl.m_oLogicDocument);
    _loader.Check_TextFit();

    this.LoadedObject = 1;
    AscCommon.g_oIdCounter.Set_Load(false);
};

Asc['asc_docs_api'].prototype.openDocument = function(sData)
{
    _api.asc_nativeOpenFile2(sData.data);


    var _presentation = _api.WordControl.m_oLogicDocument;

    var nSlidesCount = _presentation.Slides.length;
    var dPresentationWidth = _presentation.Width;
    var dPresentationHeight = _presentation.Height;

    var aTimings = [];
    var slides = _presentation.Slides;
    for(var i = 0; i < slides.length; ++i){
        aTimings.push(slides[i].timing.ToArray());
    }
    var _result =  [nSlidesCount, dPresentationWidth, dPresentationHeight, aTimings];
    var oTheme = null;

    if (null != slides[0])
    {
        oTheme = slides[0].getTheme();
    }
    if (!sdkCheck) {

        this.WordControl.m_oDrawingDocument.AfterLoad();
        this.ImageLoader.bIsLoadDocumentFirst = true;

        if (oTheme)
        {
            _api.sendColorThemes(oTheme);
        }

        window["native"]["onEndLoadingFile"](_result);

        return;
    }

    this.WordControl.m_oDrawingDocument.AfterLoad();
   
    _api.asc_nativeCalculateFile();

    //console.log("ImageMap : " + JSON.stringify(this.WordControl.m_oLogicDocument));

    this.ImageLoader.bIsLoadDocumentFirst = true;
    this.ImageLoader.LoadDocumentImages(this.WordControl.m_oLogicDocument.ImageMap, true);

    this.WordControl.m_oLogicDocument.Continue_FastCollaborativeEditing();

    //this.asyncFontsDocumentEndLoaded();
    //
    // if (oTheme)
    // {
    //     _api.sendColorThemes(oTheme);
    // }

    window["native"]["onEndLoadingFile"](_result);

    this.WordControl.m_oDrawingDocument.Collaborative_TargetsUpdate(true);

    var t = this;
    setInterval(function() {
        t._autoSave();
    }, 40);
};


Asc['asc_docs_api'].prototype.Update_ParaInd = function( Ind )
{
   // this.WordControl.m_oDrawingDocument.Update_ParaInd(Ind);
};

Asc['asc_docs_api'].prototype.Internal_Update_Ind_Left = function(Left)
{
};

Asc['asc_docs_api'].prototype.Internal_Update_Ind_Right = function(Right)
{
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

            dataBuffer.sBase64 = data;
        }
    };

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

            dataBuffer.sBase64 = data;
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

Asc['asc_docs_api'].prototype.Call_Menu_Context_Select = function()
{
    this.WordControl.m_oLogicDocument.MoveCursorLeft(false, true);
    this.WordControl.m_oLogicDocument.MoveCursorRight(true, true);
    this.WordControl.m_oLogicDocument.Document_UpdateSelectionState();
};
Asc['asc_docs_api'].prototype.Call_Menu_Context_SelectAll = function()
{
    this.WordControl.m_oLogicDocument.SelectAll();
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
        "password": password
    };

    AscCommon.sendCommand(this, null, v);
};

if(!window.native){
	if(_private_NativeObject){
		window.native = _private_NativeObject();
	}	
}

if(window.native){
	window.native.Call_CheckSlideBounds = function(nIndex){
        if(window.editor) {
            return window.editor.CheckSlideBounds(nIndex);
        }
	};
	
	window.native.Call_GetPageMeta = function(nIndex){
        if(window.editor) {
            return window.editor.GetNativePageMeta(nIndex);
        }
	};

	window.native.Call_OnMouseDown = function(e){
	    if(window.editor)
        {
            var ret = window.editor.WordControl.m_oDrawingDocument.OnCheckMouseDown(e);
            window.editor.WordControl.m_oDrawingDocument.OnMouseDown(e);
            return ret;
        }
        return -1;
    };

    window.native.Call_OnMouseUp = function(e){
        if(window.editor)
        {
            window.editor.WordControl.m_oDrawingDocument.OnMouseUp(e);
        }
    };

    window.native.Call_OnMouseMove = function(e){
        if(window.editor)
        {
            window.editor.WordControl.m_oDrawingDocument.OnMouseMove(e);
        }
    };

    window.native.Call_OnKeyboardEvent = function(e)
    {
        return window.editor.WordControl.m_oDrawingDocument.OnKeyboardEvent(e);
    };

    window.native.Call_OnCheckMouseDown = function(e)
    {
        return window.editor.WordControl.m_oDrawingDocument.OnCheckMouseDown(e);
    };

    window.native.Call_OnCheckMouseDown2 = function(e)
    {
        return window.editor.WordControl.m_oDrawingDocument.CheckMouseDown2(e);
    };

    window.native.Call_ResetSelection = function()
    {
        window.editor.WordControl.m_oLogicDocument.RemoveSelection(false);
        window.editor.WordControl.m_oLogicDocument.Document_UpdateSelectionState();
        window.editor.WordControl.m_oLogicDocument.Document_UpdateInterfaceState();
    };

    window.native.Call_OnUpdateOverlay = function(param){
        if(window.editor)
        {
            window.editor.WordControl.OnUpdateOverlay(param);
        }
    };
    window.native.Call_SetCurrentPage = function(param){
        if(window.editor)
        {
            window.editor.WordControl.m_oLogicDocument.Set_CurPage(param);
        }
    };
}

window.native.Call_Menu_Event = function (type, _params)
{
    return _api.Call_Menu_Event(type, _params);
};
