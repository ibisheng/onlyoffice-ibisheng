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
asc_docs_api.prototype._OfflineAppDocumentStartLoad = function()
{
    window["AscDesktopEditor"]["LocalStartOpen"]();
};
asc_docs_api.prototype._OfflineAppDocumentEndLoad = function(_data)
{
    if (c_oSerFormat.Signature !== _data.substring(0, c_oSerFormat.Signature.length))
		this.OpenDocument(documentUrl, _data);
    else
		this.OpenDocument2(documentUrl, _data);
};
window["DesktopOfflineAppDocumentEndLoad"] = function(_url, _data)
{
    g_oDocumentUrls.documentUrl = _url;
    editor._OfflineAppDocumentEndLoad(_data);
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
    editor.asc_nativeApplyChanges(_changes);
	editor.asc_nativeCalculateFile();
};