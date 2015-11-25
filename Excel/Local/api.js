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
		return "";
	},
	imagePath2Local : function(imageLocal){
		return "";
	},
	getUrl : function(strPath){
		return this.documentUrl + "/media/" + strPath;
	},
	getLocal : function(url){		
		return null;
	},
	getMaxIndex : function(url){
		return this.imageCount;
	}
};
g_oDocumentUrls = new DocumentUrls();

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

	asc['spreadsheet_api'].prototype._OfflineAppDocumentStartLoad = function(fCallback)
	{
		window.OfflineOpenCallback = fCallback;
		window["AscDesktopEditor"]["LocalStartOpen"]();
	};
	
	asc['spreadsheet_api'].prototype._OfflineAppDocumentEndLoad = function(_data)
	{
		if (true)
		{
			var wb = this._openDocument(_data);
			window.OfflineOpenCallback({returnCode: 0, val: wb});
			window.OfflineOpenCallback = undefined;
		}
	};  
})(jQuery, window);

window["DesktopOfflineAppDocumentEndLoad"] = function(_url, _data)
{
    g_oDocumentUrls.documentUrl = _url;
    window["Asc"]["editor"]._OfflineAppDocumentEndLoad(_data);
};

/////////////////////////////////////////////////////////
//////////////        CHANGES       /////////////////////
/////////////////////////////////////////////////////////
window["CDocsCoApi"].prototype.saveChanges = function(arrayChanges, deleteIndex, excelAdditionalInfo)
{
	window["AscDesktopEditor"]["LocalFileSaveChanges"](arrayChanges.join("\",\""), deleteIndex, arrayChanges.length);
	this.onUnSaveLock();
};
window["DesktopOfflineAppDocumentApplyChanges"] = function(_changes)
{
    window["Asc"]["editor"].asc_nativeApplyChanges(_changes);
	window["Asc"]["editor"].asc_nativeCalculateFile();
};