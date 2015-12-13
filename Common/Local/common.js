"use strict";

function CheckLicense(licenseUrl, customerId, userId, userFirstName, userLastName, callback) 
{
    callback(true, g_oLicenseResult.Success);
}

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
function DocumentUrls()
{
	this.urls = {};
	this.documentUrl = "";
	this.imageCount = 0;
}
DocumentUrls.prototype = 
{
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
		if (0 === strPath.indexOf('theme'))
			return null;
		
		if (window.editor && window.editor.ThemeLoader && window.editor.ThemeLoader.ThemesUrl != "" && strPath.indexOf(window.editor.ThemeLoader.ThemesUrl) == 0)
			return null;
		
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
		if (0 === strPath.indexOf('theme'))
			return null;
		
		if (window.editor && window.editor.ThemeLoader && window.editor.ThemeLoader.ThemesUrl != "" && strPath.indexOf(window.editor.ThemeLoader.ThemesUrl) == 0)
			return null;
		
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
window["CDocsCoApi"].prototype.saveChanges = function(arrayChanges, deleteIndex, excelAdditionalInfo)
{
	window["AscDesktopEditor"]["LocalFileSaveChanges"](arrayChanges.join("\",\""), deleteIndex, arrayChanges.length);
	this.onUnSaveLock();
};

window["NativeCorrectImageUrlOnCopy"] = function(url)
{
	g_oDocumentUrls.getImageUrl(url);
};
window["NativeCorrectImageUrlOnPaste"] = function(url)
{
	return window["AscDesktopEditor"]["LocalFileGetImageUrl"](url);
};

function InitDragAndDrop(oHtmlElement, callback) {
	if ("undefined" != typeof(FileReader) && null != oHtmlElement) {
		oHtmlElement["ondragover"] = function (e) {
			e.preventDefault();
			e.dataTransfer.dropEffect = CanDropFiles(e) ? 'copy' : 'none';
			return false;
		};
		oHtmlElement["ondrop"] = function (e) {
			e.preventDefault();
			
			var _files = window["AscDesktopEditor"]["GetDropFiles"]();
			for (var i = 0; i < _files.length; i++)
			{
				if (window["AscDesktopEditor"]["IsImageFile"](_files[i]))
				{
					window["DesktopOfflineAppDocumentAddImageEnd"](_files[i]);
				}
			}
		};
	}
}

// меняем среду
AscBrowser.isSafari = false;
AscBrowser.isSafariMacOs = false;
window.USER_AGENT_SAFARI_MACOS = false;

window["AscDesktopEditorButtonMode"] = true;