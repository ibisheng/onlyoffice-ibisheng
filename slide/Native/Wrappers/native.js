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

Asc['asc_docs_api'].prototype["Call_Menu_Event"] = function(type, _params)
{
    var _return = undefined;
    var _current = { pos : 0 };
    var _continue = true;

    switch (type)
    {
        case 62: //ASC_MENU_EVENT_TYPE_SEARCH_FINDTEXT
        {
            var SearchEngine = editor.WordControl.m_oLogicDocument.Search(_params[0], {MatchCase : _params[2]});
            var Id = this.WordControl.m_oLogicDocument.Search_GetId(_params[1]);
            if (null != Id)
                this.WordControl.m_oLogicDocument.Search_Select(Id);

            var _stream = global_memory_stream_menu;
            _stream["ClearNoAttack"]();
            _stream["WriteLong"](SearchEngine.Count);
            _return = _stream;
            break;
        }
        case 110: // ASC_MENU_EVENT_TYPE_CONTEXTMENU_COPY
        {
            _return = this.Call_Menu_Context_Copy();
            break;
        }
        // case 111 : // ASC_MENU_EVENT_TYPE_CONTEXTMENU_CUT
        // {
        //     _return = this.Call_Menu_Context_Cut();
        //     break;
        // }
        // case 112: // ASC_MENU_EVENT_TYPE_CONTEXTMENU_PASTE
        // {
        //     this.Call_Menu_Context_Paste(_params[0], _params[1]);
        //     break;
        // }
        // case 113: // ASC_MENU_EVENT_TYPE_CONTEXTMENU_DELETE
        // {
        //     this.Call_Menu_Context_Delete();
        //     break;
        // }
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

        default:
            break;
    }

    return _return;
}
