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

Asc['asc_docs_api'].prototype["Call_Menu_Event"] = function(type, _params)
{
    var _return = undefined;
    var _current = { pos : 0 };
    var _continue = true;

    switch (type)
    {
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
        case 50: // ASC_MENU_EVENT_TYPE_INSERT_IMAGE
        {
            break;
        }
        case 53: // ASC_MENU_EVENT_TYPE_INSERT_SHAPE
        {
            var shapeProp = asc_menu_ReadShapePr(_params["shape"], _current);
            var aspect = parseFloat(_params["aspect"]);

            var logicDocument = _api.WordControl.m_oLogicDocument;

            if (logicDocument && logicDocument.Slides[logicDocument.CurPage]) {                  
                var oDrawingObjects = logicDocument.Slides[logicDocument.CurPage].graphicObjects;
                oDrawingObjects.changeCurrentState(new AscFormat.StartAddNewShape(oDrawingObjects, shapeProp.type));
                    
                var dsx = logicDocument.Height / 2.5 * aspect
                var dsy = logicDocument.Height / 2.5                 
                var dx  = logicDocument.Width * 0.5 - dsx * 0.5
                var dy  = logicDocument.Height * 0.5 - dsy * 0.5

                logicDocument.OnMouseDown({}, dx, dy, logicDocument.CurPage);
                logicDocument.OnMouseMove({IsLocked: true}, dx + dsx, dy + dsy, logicDocument.CurPage);
                logicDocument.OnMouseUp({}, dx, dy, logicDocument.CurPage);
                logicDocument.Document_UpdateInterfaceState();
                logicDocument.Document_UpdateRulersState();
                logicDocument.Document_UpdateSelectionState();
            }
            break;
        }
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

        case 450:   // ASC_MENU_EVENT_TYPE_GET_CHART_DATA
        {
            var chart = _api.asc_getChartObject();
            
            var _stream = global_memory_stream_menu;
            _stream["ClearNoAttack"]();
            _stream["WriteStringA"](JSON.stringify(new Asc.asc_CChartBinary(chart)));
            _return = _stream;
            
            break;
        }
        
        case 460:   // ASC_MENU_EVENT_TYPE_SET_CHART_DATA
        {
            if (undefined !== _params) {
                var chartData = _params[0];
                if (chartData && chartData.length > 0) {
                    var json = JSON.parse(chartData);
                    if (json) {
                        _api.asc_editChartDrawingObject(json);
                    }
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
            _api.CoAuthoringApi._CoAuthoringApi._onServerOpen();
            break;
        }

        case 10010: // ASC_SOCKET_EVENT_TYPE_ON_CLOSE
        {

            break;
        }

        case 10020: // ASC_SOCKET_EVENT_TYPE_MESSAGE
        {
            _api.CoAuthoringApi._CoAuthoringApi._onServerMessage(_params);
            break;
        }

        case 11010: // ASC_SOCKET_EVENT_TYPE_ON_DISCONNECT
        {
            break;
        }

        case 11020: // ASC_SOCKET_EVENT_TYPE_TRY_RECONNECT
        {
            _api.CoAuthoringApi._CoAuthoringApi._reconnect();
            break;
        }

        case 21000: // ASC_COAUTH_EVENT_TYPE_INSERT_URL_IMAGE
        {
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
}
