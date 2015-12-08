"use strict";

/////////////////////////////////////////////////////////
//////////////        OPEN       ////////////////////////
/////////////////////////////////////////////////////////

(/**
 * @param {jQuery} $
 * @param {Window} window
 * @param {undefined} undefined
 */
	function($, window, undefined) {

	var asc = window["Asc"];
	var prot;

	asc['spreadsheet_api'].prototype._OfflineAppDocumentStartLoad = function()
	{
		window["AscDesktopEditor"]["LocalStartOpen"]();
	};
	
	asc['spreadsheet_api'].prototype._OfflineAppDocumentEndLoad = function(_data)
	{
		if (true)
		{
      this._startOpenDocument(_data);
			History.UserSaveMode = true;
		}
		
		DesktopOfflineUpdateLocalName(this);
	};
	
	asc['spreadsheet_api'].prototype.asc_addImageDrawingObject = function(url)
	{
		var _url = window["AscDesktopEditor"]["LocalFileGetImageUrl"](url);
		
		var ws = this.wb.getWorksheet();
		if (ws) 
		{
			var _url = window["AscDesktopEditor"]["LocalFileGetImageUrl"](url);
			ws.objectRender.addImageDrawingObject(g_oDocumentUrls.getImageUrl(_url) , null);
		}
	};
	asc['spreadsheet_api'].prototype.asc_showImageFileDialog = function()
	{
		window["AscDesktopEditor"]["LocalFileGetImageUrlFromOpenFileDialog"]();
	};
	asc['spreadsheet_api'].prototype.asc_addImage = function()
	{
	  window["AscDesktopEditor"]["LocalFileGetImageUrlFromOpenFileDialog"]();
	};
})(jQuery, window);

window["DesktopOfflineAppDocumentEndLoad"] = function(_url, _data)
{
    g_oDocumentUrls.documentUrl = _url;
	if (g_oDocumentUrls.documentUrl.indexOf("file:") != 0)
	{
		if (g_oDocumentUrls.documentUrl.indexOf("/") != 0)
			g_oDocumentUrls.documentUrl = "/" + g_oDocumentUrls.documentUrl;
		g_oDocumentUrls.documentUrl = "file://" + g_oDocumentUrls.documentUrl;
	}
	
    window["Asc"]["editor"]._OfflineAppDocumentEndLoad(_data);
};

/////////////////////////////////////////////////////////
//////////////        CHANGES       /////////////////////
/////////////////////////////////////////////////////////
CHistory.prototype.Reset_SavedIndex = function(IsUserSave)
{
	if (true === this.Is_UserSaveMode())
	{
		if (this.Index == -1)
			return;
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

CHistory.prototype.Is_Modified = function(IsUserSave) 
{
	var checkIndex = (this.Is_UserSaveMode() && IsUserSave) ? this.UserSavedIndex : this.SavedIndex;
	if (-1 === this.Index && null === checkIndex && false === this.ForceSave) 
	{
		if (window["AscDesktopEditor"])
		{
			if (0 != window["AscDesktopEditor"]["LocalFileGetOpenChangesCount"]())
				return true;
			if (!window["AscDesktopEditor"]["LocalFileGetSaved"]())
				return true;
		}
		return false;
	}
	return (this.Index != checkIndex || true === this.ForceSave);
};
	
window["DesktopOfflineAppDocumentApplyChanges"] = function(_changes)
{
	for (var i = 0, l = _changes.length; i < l; ++i) 
	{
		window["Asc"]["editor"].CoAuthoringApi.onSaveChanges(_changes[i], null, true);
    }
};

/////////////////////////////////////////////////////////
////////////////        SAVE       //////////////////////
/////////////////////////////////////////////////////////
window["Asc"]['spreadsheet_api'].prototype.asc_Save = function (isNoUserSave)
{
	var t = this;
    if (true !== isNoUserSave)
        this.IsUserSave = true;

    if (true === this.canSave && !this.isLongAction())
	{
		var _isNaturalSave = this.IsUserSave;
		this.canSave = false;
		this.CoAuthoringApi.askSaveChanges(function(e){t.onSaveCallback(e);});
		
		if (this.CoAuthoringApi.onUnSaveLock)
			this.CoAuthoringApi.onUnSaveLock();
		
		if (_isNaturalSave === true)
			window["DesktopOfflineAppDocumentStartSave"]();
	}
};

window["Asc"]['spreadsheet_api'].prototype.asc_isOffline = function()
{
	return true;
};

window["DesktopOfflineAppDocumentStartSave"] = function()
{
    window["Asc"]["editor"].sync_StartAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.Save);
	window["AscDesktopEditor"]["LocalFileSave"]();
};
window["DesktopOfflineAppDocumentEndSave"] = function(isCancel)
{
	window["Asc"]["editor"].sync_EndAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.Save);
	if (isCancel !== true)
		DesktopOfflineUpdateLocalName(window["Asc"]["editor"]);
};

window["Asc"]['spreadsheet_api'].prototype["asc_addImageDrawingObject"] = window["Asc"]['spreadsheet_api'].prototype.asc_addImageDrawingObject;
window["Asc"]['spreadsheet_api'].prototype["asc_showImageFileDialog"] = window["Asc"]['spreadsheet_api'].prototype.asc_showImageFileDialog;
window["Asc"]['spreadsheet_api'].prototype["asc_Save"] = window["Asc"]['spreadsheet_api'].prototype.asc_Save;
window["Asc"]['spreadsheet_api'].prototype["asc_isOffline"] = window["Asc"]['spreadsheet_api'].prototype.asc_isOffline;

window["DesktopOfflineAppDocumentAddImageEnd"] = function(url)
{
	if (url == "")
		return;
	
	var ws = window["Asc"]["editor"].wb.getWorksheet();
    if (ws) 
	{
		var _url = window["AscDesktopEditor"]["LocalFileGetImageUrl"](url);
        ws.objectRender.addImageDrawingObject(g_oDocumentUrls.getImageUrl(_url) , null);
    }
};