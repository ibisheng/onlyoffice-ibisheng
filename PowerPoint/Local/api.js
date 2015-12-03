"use strict";

/////////////////////////////////////////////////////////
//////////////       FONTS       ////////////////////////
/////////////////////////////////////////////////////////
CFontFileLoader.prototype.LoadFontAsync = function(basePath, _callback, isEmbed)
{
	this.callback = _callback;
    if (-1 != this.Status)
        return true;
		
	var oThis = this;
	this.Status = 2;
	if (window["AscDesktopEditor"] !== undefined && !this.CanUseOriginalFormat)
	{
		this.callback = null;		
		window["AscDesktopEditor"]["LoadFontBase64"](this.Id);
		this._callback_font_load();
		return;
	}

	var xhr = new XMLHttpRequest();
	xhr.open('GET', "ascdesktop://fonts/" + this.Id, true);
	xhr.responseType = 'arraybuffer';

	if (xhr.overrideMimeType)
		xhr.overrideMimeType('text/plain; charset=x-user-defined');
	else
		xhr.setRequestHeader('Accept-Charset', 'x-user-defined');

	xhr.onload = function()
	{
		if (this.status != 200)
		{
			oThis.Status = 1;
			return;
		}

		oThis.Status = 0;

		if (this.response)
		{
			var __font_data_idx = g_fonts_streams.length;
			var _uintData = new Uint8Array(this.response);
			g_fonts_streams[__font_data_idx] = new FT_Stream(_uintData, _uintData.length);
			oThis.SetStreamIndex(__font_data_idx);
		}
		else
		{
			var __font_data_idx = g_fonts_streams.length;
			g_fonts_streams[__font_data_idx] = CreateFontData3(this.responseText);
			oThis.SetStreamIndex(__font_data_idx);

			if (null != oThis.callback)
				oThis.callback();
		}
	};

	xhr.send(null);
};

/////////////////////////////////////////////////////////
//////////////       IMAGES      ////////////////////////
/////////////////////////////////////////////////////////
function DocumentUrls(){
	this.urls = {};
	this.documentUrl = "";
	this.imageCount = 0;
}
DocumentUrls.prototype = {
	mediaPrefix: 'media/',
	init: function (urls) {
	},
	getUrls: function () {
		return this.urls;
	},
	addUrls : function(urls){
	},
	addImageUrl : function(strPath, url){
	},
	getImageUrl : function(strPath){
		return this.documentUrl + "/media/" + strPath;
	},
	getImageLocal : function(url){
		var _first = this.documentUrl + "/media/";
		if (0 == url.indexOf(_first))
			return url.substring(_first.length);
		return null;
	},
	imagePath2Local : function(imageLocal){
		return this.getImageLocal(imageLocal);
	},
	getUrl : function(strPath){
		return this.documentUrl + "/media/" + strPath;
	},
	getLocal : function(url){		
		return this.getImageLocal(url);
	},
	getMaxIndex : function(url){
		return this.imageCount;
	}
};
g_oDocumentUrls = new DocumentUrls();

function sendImgUrls(api, images, callback)
{
	var _data = [];
	for (var i = 0; i < images.length; i++)
	{
		var _url = window["AscDesktopEditor"]["LocalFileGetImageUrl"](images[i]);
		_data[i] = { url: images[i], path : g_oDocumentUrls.getImageUrl(_url) };
	}
	callback(_data);  
}

/////////////////////////////////////////////////////////
//////////////        OPEN       ////////////////////////
/////////////////////////////////////////////////////////
asc_docs_api.prototype._OfflineAppDocumentStartLoad = function()
{
	History.UserSaveMode = true;
    window["AscDesktopEditor"]["LocalStartOpen"]();
};
asc_docs_api.prototype._OfflineAppDocumentEndLoad = function(_data)
{
    this.OpenDocument2(documentUrl, _data);
	this.WordControl.m_oLogicDocument.Set_FastCollaborativeEditing(false);
	this.DocumentOrientation = (null == this.WordControl.m_oLogicDocument) ? true : !this.WordControl.m_oLogicDocument.Orientation;
	DesktopOfflineUpdateLocalName(this);
};
window["DesktopOfflineAppDocumentEndLoad"] = function(_url, _data)
{
    g_oDocumentUrls.documentUrl = _url;
    editor._OfflineAppDocumentEndLoad(_data);
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
CHistory.prototype.Have_Changes = function(IsUserSave)
{
	if (true === this.Is_UserSaveMode() && false !== IsUserSave)
	{
		if (-1 === this.Index && null === this.UserSavedIndex && false === this.ForceSave)
		{
			if (0 != window["AscDesktopEditor"]["LocalFileGetOpenChangesCount"]())
				return true;
			if (!window["AscDesktopEditor"]["LocalFileGetSaved"]())
				return true;
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
	
window["CDocsCoApi"].prototype.saveChanges = function(arrayChanges, deleteIndex, excelAdditionalInfo)
{
	window["AscDesktopEditor"]["LocalFileSaveChanges"](arrayChanges.join("\",\""), deleteIndex, arrayChanges.length);
	this.onUnSaveLock();
};
window["DesktopOfflineAppDocumentApplyChanges"] = function(_changes)
{
    editor["asc_nativeApplyChanges"](_changes);
	editor["asc_nativeCalculateFile"]();
};

/////////////////////////////////////////////////////////
////////////////        SAVE       //////////////////////
/////////////////////////////////////////////////////////
function DesktopOfflineUpdateLocalName(_api)
{
	var _name = window["AscDesktopEditor"]["LocalFileGetSourcePath"]();
	
	var _ind1 = _name.lastIndexOf("\\");
	var _ind2 = _name.lastIndexOf("/");
	
	if (_ind1 == -1)
		_ind1 = 1000000;
	if (_ind2 == -1)
		_ind2 = 1000000;
	
	var _ind = Math.min(_ind1, _ind2);
	if (_ind != 1000000)
		_name = _name.substring(_ind + 1);
	
	_api.documentTitle = _name;
	window["AscDesktopEditor"]["SetDocumentName"](_name);
}

window["CDocsCoApi"].prototype.askSaveChanges = function(callback) 
{
    callback({"saveLock": false});
};
asc_docs_api.prototype.asc_Save = function (isNoUserSave)
{
    if (true !== isNoUserSave)
        this.IsUserSave = true;

    if (true === this.canSave && !this.asc_IsLongAction())
	{
		var _isNaturalSave = this.IsUserSave;
		this.canSave = false;
		this.CoAuthoringApi.askSaveChanges(OnSave_Callback);
		
		if (this.CoAuthoringApi.onUnSaveLock)
			this.CoAuthoringApi.onUnSaveLock();
		
		if (_isNaturalSave === true)
			window["DesktopOfflineAppDocumentStartSave"]();
	}
};
window["DesktopOfflineAppDocumentStartSave"] = function()
{
    editor.sync_StartAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.Save);
	window["AscDesktopEditor"]["LocalFileSave"]();
};
window["DesktopOfflineAppDocumentEndSave"] = function(isCancel)
{
	editor.sync_EndAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.Save);
	if (isCancel !== true)
		DesktopOfflineUpdateLocalName(this);
};

asc_docs_api.prototype.AddImageUrl = function(url, imgProp)
{
	var _url = window["AscDesktopEditor"]["LocalFileGetImageUrl"](url);
	this.AddImageUrlAction(g_oDocumentUrls.getImageUrl(_url), imgProp);
};
asc_docs_api.prototype.AddImage = function()
{
	window["AscDesktopEditor"]["LocalFileGetImageUrlFromOpenFileDialog"]();
};
asc_docs_api.prototype["AddImageUrl"] = asc_docs_api.prototype.AddImageUrl;
asc_docs_api.prototype["AddImage"] = asc_docs_api.prototype.AddImage;
asc_docs_api.prototype["asc_Save"] = asc_docs_api.prototype.asc_Save;

window["DesktopOfflineAppDocumentAddImageEnd"] = function(url)
{
	if (url == "")
		return;
	var _url = window["AscDesktopEditor"]["LocalFileGetImageUrl"](url);
	editor.AddImageUrlAction(g_oDocumentUrls.getImageUrl(_url));
};

window["NativeCorrectImageUrlOnCopy"] = function(url)
{
	g_oDocumentUrls.getImageUrl(url);
};
window["NativeCorrectImageUrlOnPaste"] = function(url)
{
	return window["AscDesktopEditor"]["LocalFileGetImageUrl"](url);
};