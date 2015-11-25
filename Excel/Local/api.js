"use strict";

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
	window["AscDesktopEditor"]["LocalFileSaveChanges"](arrayChanges.join("\",\""));
	this.onUnSaveLock();
};
window["DesktopOfflineAppDocumentApplyChanges"] = function(_changes)
{
    window["Asc"]["editor"].asc_nativeApplyChanges(_changes);
	window["Asc"]["editor"].asc_nativeCalculateFile();
};