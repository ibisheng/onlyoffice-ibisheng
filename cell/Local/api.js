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
		this.asc_registerCallback('asc_onDocumentContentReady', function(){
			DesktopOfflineUpdateLocalName(window["Asc"]["editor"]);
		});
	
		window["AscDesktopEditor"]["LocalStartOpen"]();
	};
	
	asc['spreadsheet_api'].prototype._OfflineAppDocumentEndLoad = function(_data)
	{
		g_oIdCounter.m_sUserId = window["AscDesktopEditor"]["CheckUserId"]();
		if (_data == "")
		{
			this.sendEvent("asc_onError", c_oAscError.ID.ConvertationError, c_oAscError.Level.Critical);
			return;
		}
	
		if (true)
		{
			this._startOpenDocument(_data);
			History.UserSaveMode = true;
		}
		
		DesktopOfflineUpdateLocalName(this);
		
		this.onUpdateDocumentModified(History.Is_Modified());
	};
	
	asc['spreadsheet_api'].prototype._onNeedParams = function(data) 
	{
		var cp = JSON.parse("{\"codepage\":46,\"delimiter\":1}");
		cp['encodings'] = getEncodingParams();
		this.handlers.trigger("asc_onAdvancedOptions", new asc.asc_CAdvancedOptions(c_oAscAdvancedOptionsID.CSV, cp), c_oAscAdvancedOptionsAction.Open);
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

window["Asc"]['spreadsheet_api'].prototype.asc_setAdvancedOptions = function(idOption, option) 
{
	window["AscDesktopEditor"]["SetAdvancedOptions"]("" + option.asc_getCodePage(), "" + option.asc_getDelimiter());
};
window["Asc"]['spreadsheet_api'].prototype["asc_setAdvancedOptions"] = window["Asc"]['spreadsheet_api'].prototype.asc_setAdvancedOptions;

window["asc_initAdvancedOptions"] = function()
{	
	window["Asc"]["editor"]._onNeedParams(undefined);
};

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

CHistory.prototype.Is_Modified = function(IsNotUserSave, IsNoSavedNoModifyed) 
{
	var checkIndex = (this.Is_UserSaveMode() && !IsNotUserSave) ? this.UserSavedIndex : this.SavedIndex;
	if (-1 === this.Index && null === checkIndex && false === this.ForceSave) 
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
window["Asc"]['spreadsheet_api'].prototype.onUpdateDocumentModified = function(bIsModified) 
{
    // Обновляем только после окончания сохранения
    if (this.canSave) {
      this.handlers.trigger("asc_onDocumentModifiedChanged", bIsModified);
      this._onUpdateDocumentCanSave();

      if (undefined !== window["AscDesktopEditor"]) {
        window["AscDesktopEditor"]["onDocumentModifiedChanged"](History ? History.Is_Modified(undefined, true) : bValue);
      }
    }
};
  
window["Asc"]['spreadsheet_api'].prototype.asc_Save = function (isNoUserSave, isSaveAs)
{
	if (this.isChartEditor || c_oAscAdvancedOptionsAction.None !== this.advancedOptionsAction)
		return;
    	
	var t = this;
    if (true !== isNoUserSave)
        this.IsUserSave = true;
	
	if (this.IsUserSave)
	{
		this.LastUserSavedIndex = History.UserSavedIndex;
	}

    if (true === this.canSave && !this.isLongAction())
	{
		var _isNaturalSave = this.IsUserSave;
		this.canSave = false;
		this.CoAuthoringApi.askSaveChanges(function(e){t.onSaveCallback(e);});
		
		if (this.CoAuthoringApi.onUnSaveLock)
			this.CoAuthoringApi.onUnSaveLock();
		
		if (_isNaturalSave === true)
			window["DesktopOfflineAppDocumentStartSave"](isSaveAs);
	}
};
window["Asc"]['spreadsheet_api'].prototype.asc_DownloadAs = function(typeFile, bIsDownloadEvent) 
{
	this.asc_Save(false, true);
};

window["Asc"]['spreadsheet_api'].prototype.asc_isOffline = function()
{
	return true;
};

window["DesktopOfflineAppDocumentStartSave"] = function(isSaveAs)
{
	window["Asc"]["editor"].sync_StartAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.Save);
	
	var _param = "";
	if (isSaveAs === true)
		_param += "saveas=true;";
	if (AscBrowser.isRetina)
		_param += "retina=true;";
	
	window["AscDesktopEditor"]["LocalFileSave"](_param);
};
window["DesktopOfflineAppDocumentEndSave"] = function(error)
{
	window["Asc"]["editor"].sync_EndAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.Save);
	if (0 == error)
		DesktopOfflineUpdateLocalName(window["Asc"]["editor"]);
	else
		History.UserSavedIndex = window["Asc"]["editor"].LastUserSavedIndex;		
	
	window["Asc"]["editor"].onUpdateDocumentModified(History.Is_Modified());
	window["Asc"]["editor"].LastUserSavedIndex = undefined;
	
	if (2 == error)
		window["Asc"]["editor"].sendEvent("asc_onError", c_oAscError.ID.ConvertationError, c_oAscError.Level.NoCritical);
};

window["Asc"]['spreadsheet_api'].prototype["asc_addImageDrawingObject"] = window["Asc"]['spreadsheet_api'].prototype.asc_addImageDrawingObject;
window["Asc"]['spreadsheet_api'].prototype["asc_showImageFileDialog"] = window["Asc"]['spreadsheet_api'].prototype.asc_showImageFileDialog;
window["Asc"]['spreadsheet_api'].prototype["asc_Save"] = window["Asc"]['spreadsheet_api'].prototype.asc_Save;
window["Asc"]['spreadsheet_api'].prototype["asc_DownloadAs"] = window["Asc"]['spreadsheet_api'].prototype.asc_DownloadAs;
window["Asc"]['spreadsheet_api'].prototype["asc_isOffline"] = window["Asc"]['spreadsheet_api'].prototype.asc_isOffline;
window["Asc"]['spreadsheet_api'].prototype["asc_addImage"] = window["Asc"]['spreadsheet_api'].prototype.asc_addImage;

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

window["on_editor_native_message"] = function(sCommand, sParam)
{
	if (!window["Asc"]["editor"])
		return;
	
	if (sCommand == "save")
		window["Asc"]["editor"].asc_Save();
	else if (sCommand == "saveAs")
		window["Asc"]["editor"].asc_Save(false, true);
	else if (sCommand == "print")
		window["Asc"]["editor"].asc_Print();
};