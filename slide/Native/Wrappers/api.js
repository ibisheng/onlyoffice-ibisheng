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
    // _api.asc_registerCallback("asc_onSendThemeColorSchemes", function(schemes) {
    //     var stream = global_memory_stream_menu;
    //     stream["ClearNoAttack"]();
    //     asc_WriteColorSchemes(schemes, stream);
    //     window["native"]["OnCallMenuEvent"](2404, stream); // ASC_SPREADSHEETS_EVENT_TYPE_COLOR_SCHEMES
    // });


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

    g_oIdCounter.Set_Load(true);

    var _loader = new AscCommon.BinaryPPTYLoader();
    _loader.Api = this;

    _loader.Load(base64File, this.WordControl.m_oLogicDocument);
    _loader.Check_TextFit();

    this.LoadedObject = 1;
    g_oIdCounter.Set_Load(false);
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


    if (!sdkCheck) {

        console.log("OPEN FILE ONLINE READ MODE");

        if (_api.NativeAfterLoad)
            _api.NativeAfterLoad();

        this.ImageLoader.bIsLoadDocumentFirst = true;

        // if (null != _api.WordControl.m_oLogicDocument)
        // {
        //     _api.sendColorThemes(_api.WordControl.m_oLogicDocument.theme);
        // }

        window["native"]["onEndLoadingFile"](_result);

        return;
    }


    if (_api.NativeAfterLoad)
        _api.NativeAfterLoad();

    //console.log("ImageMap : " + JSON.stringify(this.WordControl.m_oLogicDocument));

    this.ImageLoader.bIsLoadDocumentFirst = true;
    this.ImageLoader.LoadDocumentImages(this.WordControl.m_oLogicDocument.ImageMap, true);

    this.WordControl.m_oLogicDocument.Continue_FastCollaborativeEditing();

    //this.asyncFontsDocumentEndLoaded();
    //
    // if (null != _api.WordControl.m_oLogicDocument)
    // {
    //     _api.sendColorThemes(_api.WordControl.m_oLogicDocument.theme);
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

            dataBuffer.sBase64 = data.sBase64;
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
