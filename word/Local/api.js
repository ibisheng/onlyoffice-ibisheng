/*
 * (c) Copyright Ascensio System SIA 2010-2016
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

"use strict";

// Import
var c_oAscError = Asc.c_oAscError;

/////////////////////////////////////////////////////////
//////////////        OPEN       ////////////////////////
/////////////////////////////////////////////////////////
Asc['asc_docs_api'].prototype._OfflineAppDocumentStartLoad = function()
{
	this.asc_registerCallback('asc_onDocumentContentReady', function(){
		DesktopOfflineUpdateLocalName(editor);

		setTimeout(function(){window["UpdateInstallPlugins"]();}, 10);
	});

	AscCommon.History.UserSaveMode = true;
    window["AscDesktopEditor"]["LocalStartOpen"]();
};
Asc['asc_docs_api'].prototype._OfflineAppDocumentEndLoad = function(_url, _data)
{
	AscCommon.g_oIdCounter.m_sUserId = window["AscDesktopEditor"]["CheckUserId"]();
	if (_data == "")
	{
		this.sendEvent("asc_onError", c_oAscError.ID.ConvertationError, c_oAscError.Level.Critical);
		return;
	}
    if (AscCommon.c_oSerFormat.Signature !== _data.substring(0, AscCommon.c_oSerFormat.Signature.length))
	{
		this.OpenDocument(_url, _data);
	}
    else
	{
		this.OpenDocument2(_url, _data);
		this.WordControl.m_oLogicDocument.Set_FastCollaborativeEditing(false);
	}
	DesktopOfflineUpdateLocalName(this);
};
window["DesktopOfflineAppDocumentEndLoad"] = function(_url, _data)
{
	AscCommon.g_oDocumentUrls.documentUrl = _url;
	if (AscCommon.g_oDocumentUrls.documentUrl.indexOf("file:") != 0)
	{
		if (AscCommon.g_oDocumentUrls.documentUrl.indexOf("/") != 0)
			AscCommon.g_oDocumentUrls.documentUrl = "/" + AscCommon.g_oDocumentUrls.documentUrl;
		AscCommon.g_oDocumentUrls.documentUrl = "file://" + AscCommon.g_oDocumentUrls.documentUrl;
	}
	
    editor._OfflineAppDocumentEndLoad(_url, _data);
};

Asc['asc_docs_api'].prototype.asc_setAdvancedOptions = function(idOption, option) 
{
	if (window["Asc"].c_oAscAdvancedOptionsID.CSV === idOption) {
		window["AscDesktopEditor"]["SetAdvancedOptions"]("" + option.asc_getCodePage());
	}
};
Asc['asc_docs_api'].prototype["asc_setAdvancedOptions"] = Asc['asc_docs_api'].prototype.asc_setAdvancedOptions;

window["asc_initAdvancedOptions"] = function()
{	
	editor._onNeedParams(undefined);
};

/////////////////////////////////////////////////////////
//////////////        CHANGES       /////////////////////
/////////////////////////////////////////////////////////
AscCommon.CHistory.prototype.Reset_SavedIndex = function(IsUserSave)
{
	if (true === this.Is_UserSaveMode())
	{
		this.SavedIndex = this.Index;
		if (true === IsUserSave)
		{
			this.UserSavedIndex = this.Index;
			this.ForceSave      = false;
		}
	}
	else
	{
		this.SavedIndex = this.Index;
		this.ForceSave  = false;
	}
};
AscCommon.CHistory.prototype.Have_Changes = function(IsNotUserSave, IsNoSavedNoModifyed)
{
	if (true === this.Is_UserSaveMode() && true !== IsNotUserSave)
	{
		if (-1 === this.Index && null === this.UserSavedIndex && false === this.ForceSave)
		{
			if (window["AscDesktopEditor"])
			{
				if (0 != window["AscDesktopEditor"]["LocalFileGetOpenChangesCount"]())
					return true;
				if (!window["AscDesktopEditor"]["LocalFileGetSaved"]() && IsNoSavedNoModifyed !== true)
					return true;
			}
			return false;
		}

		if (this.Index != this.UserSavedIndex || true === this.ForceSave)
			return true;

		return false;
	}
	else
	{
		if (-1 === this.Index && null === this.SavedIndex && false === this.ForceSave)
			return false;

		if (this.Index != this.SavedIndex || true === this.ForceSave)
			return true;

		return false;
	}
};
	
window["DesktopOfflineAppDocumentApplyChanges"] = function(_changes)
{
	editor._coAuthoringSetChanges(_changes, new AscCommonWord.CDocumentColor( 191, 255, 199 ));
    //editor["asc_nativeApplyChanges"](_changes);
	//editor["asc_nativeCalculateFile"]();
};

/////////////////////////////////////////////////////////
////////////////        SAVE       //////////////////////
/////////////////////////////////////////////////////////
Asc['asc_docs_api'].prototype.SetDocumentModified = function(bValue)
{
    this.isDocumentModify = bValue;
    this.sendEvent("asc_onDocumentModifiedChanged");

    if (undefined !== window["AscDesktopEditor"])
    {
        window["AscDesktopEditor"]["onDocumentModifiedChanged"](AscCommon.History ? AscCommon.History.Have_Changes(undefined, true) : bValue);
    }
};

Asc['asc_docs_api'].prototype.asc_Save = function (isNoUserSave, isSaveAs)
{
    if (true !== isNoUserSave)
        this.IsUserSave = true;
	
	if (this.IsUserSave)
	{
		this.LastUserSavedIndex = AscCommon.History.UserSavedIndex;
	}

    if (true === this.canSave && !this.isLongAction())
	{
		var _isNaturalSave = this.IsUserSave;
		this.canSave = false;
		
		if (this.WordControl.m_oLogicDocument != null)
		{
			var t = this;
			this.CoAuthoringApi.askSaveChanges(function(e) {
				t.onSaveCallback(e);
			});
			
			if (this.CoAuthoringApi.onUnSaveLock)
				this.CoAuthoringApi.onUnSaveLock();
		}
		else
		{
			this.canSave = true;
		}
		
		if (_isNaturalSave === true)
			window["DesktopOfflineAppDocumentStartSave"](isSaveAs);
	}
};
window["DesktopOfflineAppDocumentStartSave"] = function(isSaveAs)
{
    editor.sync_StartAction(Asc.c_oAscAsyncActionType.BlockInteraction, Asc.c_oAscAsyncAction.Save);
	
	var _param = "";
	if (isSaveAs === true)
		_param += "saveas=true;";
	if (AscCommon.AscBrowser.isRetina)
		_param += "retina=true;";
	
	window["AscDesktopEditor"]["LocalFileSave"](_param);
};
window["DesktopOfflineAppDocumentEndSave"] = function(error)
{
	editor.sync_EndAction(Asc.c_oAscAsyncActionType.BlockInteraction, Asc.c_oAscAsyncAction.Save);
	if (error == 0)
		DesktopOfflineUpdateLocalName(editor);
	else
		AscCommon.History.UserSavedIndex = editor.LastUserSavedIndex;
	
	editor.UpdateInterfaceState();
	editor.LastUserSavedIndex = undefined;
	
	if (2 == error)
		editor.sendEvent("asc_onError", c_oAscError.ID.ConvertationError, c_oAscError.Level.NoCritical);
};
Asc['asc_docs_api'].prototype.asc_DownloadAs = function(typeFile, bIsDownloadEvent) 
{
	this.asc_Save(false, true);
};

Asc['asc_docs_api'].prototype.AddImageUrl = function(url, imgProp)
{
	var _url = window["AscDesktopEditor"]["LocalFileGetImageUrl"](url);
	this.AddImageUrlAction(AscCommon.g_oDocumentUrls.getImageUrl(_url), imgProp);
};
Asc['asc_docs_api'].prototype.AddImage = function()
{
	window["AscDesktopEditor"]["LocalFileGetImageUrlFromOpenFileDialog"]();
};
Asc['asc_docs_api'].prototype.asc_addImage = function()
{
  window["AscDesktopEditor"]["LocalFileGetImageUrlFromOpenFileDialog"]();
};
Asc['asc_docs_api'].prototype.asc_isOffline = function()
{
	return true;
};



Asc['asc_docs_api'].prototype["asc_addImage"] = Asc['asc_docs_api'].prototype.asc_addImage;
Asc['asc_docs_api'].prototype["AddImageUrl"] = Asc['asc_docs_api'].prototype.AddImageUrl;
Asc['asc_docs_api'].prototype["AddImage"] = Asc['asc_docs_api'].prototype.AddImage;
Asc['asc_docs_api'].prototype["asc_Save"] = Asc['asc_docs_api'].prototype.asc_Save;
Asc['asc_docs_api'].prototype["asc_DownloadAs"] = Asc['asc_docs_api'].prototype.asc_DownloadAs;
Asc['asc_docs_api'].prototype["asc_isOffline"] = Asc['asc_docs_api'].prototype.asc_isOffline;
Asc['asc_docs_api'].prototype["SetDocumentModified"] = Asc['asc_docs_api'].prototype.SetDocumentModified;


window["DesktopOfflineAppDocumentAddImageEnd"] = function(url)
{
	if (url == "")
		return;
	var _url = window["AscDesktopEditor"]["LocalFileGetImageUrl"](url);
	editor.AddImageUrlAction(AscCommon.g_oDocumentUrls.getImageUrl(_url));
};

window["on_editor_native_message"] = function(sCommand, sParam)
{
	if (!window.editor)
		return;
	
	if (sCommand == "save")
		editor.asc_Save();
	else if (sCommand == "saveAs")
		editor.asc_Save(false, true);
	else if (sCommand == "print")
		editor.asc_Print();
};