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

Asc['asc_docs_api'].prototype.sync_EndCatchSelectedElements = function()
{
    var _stream = global_memory_stream_menu;
    _stream["ClearNoAttack"]();

    var _count = this.SelectedObjectsStack.length;
    var _naturalCount = 0;

    for (var i = 0; i < _count; i++)
    {
        switch (this.SelectedObjectsStack[i].Type)
        {
            //case Asc.c_oAscTypeSelectElement.Paragraph:
            //case Asc.c_oAscTypeSelectElement.Table:
            case Asc.c_oAscTypeSelectElement.Image:
            //case Asc.c_oAscTypeSelectElement.Hyperlink:
            case Asc.c_oAscTypeSelectElement.Slide:
            case Asc.c_oAscTypeSelectElement.Shape:           
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
            case Asc.c_oAscTypeSelectElement.Slide:
            {
                console.log("StackObjects -> Slide");
                _stream["WriteLong"](Asc.c_oAscTypeSelectElement.Slide);
                asc_menu_WriteSlidePr(this.SelectedObjectsStack[i].Value, _stream);
                break;
            }
          
            case Asc.c_oAscTypeSelectElement.Shape:
            {
                console.log("StackObjects -> Shape");
                _stream["WriteLong"](Asc.c_oAscTypeSelectElement.Shape);
                asc_menu_WriteShapePr(undefined, this.SelectedObjectsStack[i].Value, _stream); 
                break;
            }

            case Asc.c_oAscTypeSelectElement.Paragraph:
            {
                //console.log("StackObjects -> Paragraph");
                //_stream["WriteLong"](Asc.c_oAscTypeSelectElement.Paragraph);
                //asc_menu_WriteParagraphPr(this.SelectedObjectsStack[i].Value, _stream);
                break;
            }

            case Asc.c_oAscTypeSelectElement.Table:
            {
                //console.log("StackObjects -> Table");
                //_stream["WriteLong"](Asc.c_oAscTypeSelectElement.Table);
                //asc_menu_WriteTablePr(this.SelectedObjectsStack[i].Value, _stream);
                break;
            }
            case Asc.c_oAscTypeSelectElement.Image:
            {
                console.log("StackObjects -> Image");
                _stream["WriteLong"](Asc.c_oAscTypeSelectElement.Image);
                asc_menu_WriteImagePr(this.SelectedObjectsStack[i].Value, _stream);
                break;
            }
            case Asc.c_oAscTypeSelectElement.Hyperlink:
            {
                //console.log("StackObjects -> Hyperlink");
               // _stream["WriteLong"](Asc.c_oAscTypeSelectElement.Hyperlink);
               // asc_menu_WriteHyperPr(this.SelectedObjectsStack[i].Value, _stream);
                break;
            }
            default:
            {
                // none
                break;
            }
        }
    }

    window["native"]["OnCallMenuEvent"](6, global_memory_stream_menu);
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
                        console.log("_imagePr.ChangeLevel : " + _imagePr.ChangeLevel);
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
                            //TODO: change image
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
            this.WordControl.m_oLogicDocument.Recalculate();
 
            break;
        }

        case 12: // ASC_MENU_EVENT_TYPE_TABLESTYLES 
        {

        }

        case 20: // ASC_MENU_EVENT_TYPE_SLIDE
        {
            var props = asc_menu_ReadSlidePr(_params, _current);
            this.SetSlideProps(props);
            break;
        }
        
        case 50: // ASC_MENU_EVENT_TYPE_INSERT_IMAGE
        {
            var url = _params[0];
            var w = _params[1];
            var h = _params[2];

            var logicDocument = this.WordControl.m_oLogicDocument;

            this.WordControl.Thumbnails && this.WordControl.Thumbnails.SetFocusElement(FOCUS_OBJECT_MAIN);
            logicDocument.FocusOnNotes = false;
           
            var oController = logicDocument.Slides[logicDocument.CurPage].graphicObjects;
           
            History.Create_NewPoint(AscDFH.historydescription_Presentation_AddFlowImage);
            oController.resetSelection();
                
            var _w, _h;
                
            _w = logicDocument.Slides[logicDocument.CurPage].Width;
            _h = logicDocument.Slides[logicDocument.CurPage].Height;
           
            var __w = Math.max((w * AscCommon.g_dKoef_pix_to_mm), 1);
            var __h = Math.max((h * AscCommon.g_dKoef_pix_to_mm), 1);
           
            _w = Math.max(5, Math.min(_w, __w));
            _h = Math.max(5, Math.min((_w * __h / __w)));
           
            var Image = oController.createImage(url, (logicDocument.Slides[logicDocument.CurPage].Width - _w)/2,
                                                                    (logicDocument.Slides[logicDocument.CurPage].Height - _h)/2, _w, _h);
            Image.setParent(logicDocument.Slides[logicDocument.CurPage]);
            Image.addToDrawingObjects();
            oController.selectObject(Image, 0);

            logicDocument.Recalculate();
            logicDocument.Document_UpdateInterfaceState();
            logicDocument.CheckEmptyPlaceholderNotes();

            break;
        }

        case 51: // ASC_MENU_EVENT_TYPE_INSERT_TABLE
        {
            var obj = JSON.parse(_params[0]);
           
            var col = parseInt(obj["rows"]);
            var row = parseInt(obj["cols"]);
            var style = obj["style"];
            
            this.put_Table(col, row);
                                       
            var properties = new Asc.CTableProp();
            properties.put_TableStyle(style);

            this.tblApply(properties);

            break;
        }
      
        case 53: // ASC_MENU_EVENT_TYPE_INSERT_SHAPE
        {
            var shapeProp = asc_menu_ReadShapePr(_params["shape"], _current);
            var aspect = parseFloat(_params["aspect"]);

            var logicDocument = this.WordControl.m_oLogicDocument;

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
            var SearchEngine = this.WordControl.m_oLogicDocument.Search(_params[0], {MatchCase : _params[2]});
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

        case 8111: // ASC_PRESENTATIONS_EVENT_TYPE_ADD_SLIDE
        {
            var index = parseInt(_params);
            this.AddSlide(index);
            break;
        }

        case 8112: // ASC_PRESENTATIONS_EVENT_TYPE_DELETE_SLIDE           
        {
            this.WordControl.m_oLogicDocument.deleteSlides(_params);
            break;
        }

        case 8113: // ASC_PRESENTATIONS_EVENT_TYPE_DUBLICATE_SLIDE        
        {
            this.WordControl.m_oLogicDocument.shiftSlides(Math.max.apply(Math, _params) + 1, _params, true);
            break;
        }

        case 8114: // ASC_PRESENTATIONS_EVENT_TYPE_MOVE_SLIDE             
        {
            var nPos = _params[0];
            var aMoveArray = _params.slice(1);
            this.WordControl.m_oLogicDocument.shiftSlides(nPos, aMoveArray, false);
            break;
        }

        case 8115: // ASC_PRESENTATIONS_EVENT_TYPE_HIDE_SLIDE             
        {
            var bIsHide = this.WordControl.m_oLogicDocument.Slides[_params[0]].isVisible();
            var aHideArray = _params;
            this.WordControl.m_oLogicDocument.hideSlides(bIsHide, aHideArray);
            break;
        }

        case 10000: // ASC_SOCKET_EVENT_TYPE_OPEN
        {
            this.CoAuthoringApi._CoAuthoringApi._onServerOpen();
            break;
        }

        case 10010: // ASC_SOCKET_EVENT_TYPE_ON_CLOSE
        {

            break;
        }

        case 10020: // ASC_SOCKET_EVENT_TYPE_MESSAGE
        {
            this.CoAuthoringApi._CoAuthoringApi._onServerMessage(_params);
            break;
        }

        case 11010: // ASC_SOCKET_EVENT_TYPE_ON_DISCONNECT
        {
            break;
        }

        case 11020: // ASC_SOCKET_EVENT_TYPE_TRY_RECONNECT
        {
            this.CoAuthoringApi._CoAuthoringApi._reconnect();
            break;
        }

        case 21000: // ASC_COAUTH_EVENT_TYPE_INSERT_URL_IMAGE
        {
            break;
        }

        case 21001: // ASC_COAUTH_EVENT_TYPE_LOAD_URL_IMAGE
        {
            this.WordControl.m_oDrawingDocument.ClearCachePages();
            this.WordControl.m_oDrawingDocument.FirePaint();

            break;
        }

        case 22001: // ASC_MENU_EVENT_TYPE_SET_PASSWORD
        {
            this.asc_setDocumentPassword(_params[0]);
            break;
        }

        default:
            break;
    }

    return _return;
}
