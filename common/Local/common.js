/*
 * (c) Copyright Ascensio System SIA 2010-2017
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

/////////////////////////////////////////////////////////
//////////////       FONTS       ////////////////////////
/////////////////////////////////////////////////////////
AscFonts.CFontFileLoader.prototype.LoadFontAsync = function(basePath, _callback, isEmbed)
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

		var fontStreams = AscFonts.g_fonts_streams;
		if (this.response)
		{
			var __font_data_idx = fontStreams.length;
			var _uintData = new Uint8Array(this.response);
			fontStreams[__font_data_idx] = new AscFonts.FT_Stream(_uintData, _uintData.length);
			oThis.SetStreamIndex(__font_data_idx);
		}
		else
		{
			var __font_data_idx = fontStreams.length;
			fontStreams[__font_data_idx] = AscFonts.CreateFontData3(this.responseText);
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
var prot = AscCommon.DocumentUrls.prototype;
prot.mediaPrefix = 'media/';
prot.init = function(urls) {
};
prot.getUrls = function() {
	return this.urls;
};
prot.addUrls = function(urls){
};
prot.addImageUrl = function(strPath, url){
};
prot.getImageUrl = function(strPath){
	if (0 === strPath.indexOf('theme'))
		return null;

	if (window.editor && window.editor.ThemeLoader && window.editor.ThemeLoader.ThemesUrl != "" && strPath.indexOf(window.editor.ThemeLoader.ThemesUrl) == 0)
		return null;

	return this.documentUrl + "/media/" + strPath;
};
prot.getImageLocal = function(url){
	var _first = this.documentUrl + "/media/";
	if (0 == url.indexOf(_first))
		return url.substring(_first.length);

	if (window.editor && window.editor.ThemeLoader && 0 == url.indexOf(editor.ThemeLoader.ThemesUrlAbs)) {
		return url.substring(editor.ThemeLoader.ThemesUrlAbs.length);
	}

	return null;
};
prot.imagePath2Local = function(imageLocal){
	return this.getImageLocal(imageLocal);
};
prot.getUrl = function(strPath){
	if (0 === strPath.indexOf('theme'))
		return null;

	if (window.editor && window.editor.ThemeLoader && window.editor.ThemeLoader.ThemesUrl != "" && strPath.indexOf(window.editor.ThemeLoader.ThemesUrl) == 0)
		return null;

	return this.documentUrl + "/media/" + strPath;
};
prot.getLocal = function(url){
	return this.getImageLocal(url);
};

AscCommon.sendImgUrls = function(api, images, callback)
{
	var _data = [];
	for (var i = 0; i < images.length; i++)
	{
		var _url = window["AscDesktopEditor"]["LocalFileGetImageUrl"](images[i]);
		_data[i] = { url: images[i], path : AscCommon.g_oDocumentUrls.getImageUrl(_url) };
	}
	callback(_data);
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
	_api.sendEvent("asc_onDocumentName", _name);
	window["AscDesktopEditor"]["SetDocumentName"](_name);
}

AscCommon.CDocsCoApi.prototype.askSaveChanges = function(callback)
{
    callback({"saveLock": false});
};
AscCommon.CDocsCoApi.prototype.saveChanges = function(arrayChanges, deleteIndex, excelAdditionalInfo)
{
	window["AscDesktopEditor"]["LocalFileSaveChanges"](arrayChanges.join("\",\""), deleteIndex, arrayChanges.length);
	//this.onUnSaveLock();
};

window["NativeCorrectImageUrlOnCopy"] = function(url)
{
	AscCommon.g_oDocumentUrls.getImageUrl(url);
};
window["NativeCorrectImageUrlOnPaste"] = function(url)
{
	return window["AscDesktopEditor"]["LocalFileGetImageUrl"](url);
};

window["UpdateInstallPlugins"] = function()
{
	var _plugins = JSON.parse(window["AscDesktopEditor"]["GetInstallPlugins"]());
	_plugins["url"] = _plugins["url"].replace(" ", "%20");

	var _len = _plugins["pluginsData"].length;
	for (var i = 0; i < _len; i++)
		_plugins["pluginsData"][i]["baseUrl"] = _plugins["url"] + _plugins["pluginsData"][i]["guid"].substring(4) + "/";

	var _editor = window["Asc"]["editor"] ? window["Asc"]["editor"] : window.editor;
	_editor.sendEvent("asc_onPluginsInit", _plugins);
};

AscCommon.InitDragAndDrop = function(oHtmlElement, callback) {
	if ("undefined" != typeof(FileReader) && null != oHtmlElement) {
		oHtmlElement["ondragover"] = function (e) {
			e.preventDefault();
			e.dataTransfer.dropEffect = AscCommon.CanDropFiles(e) ? 'copy' : 'none';
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
					break;
				}
			}
		};
	}
}

window["asc_initAdvancedOptions"] = function(_code)
{
    var _editor = window["Asc"]["editor"] ? window["Asc"]["editor"] : window.editor;
	_editor._onNeedParams(undefined, (_code == 90 || _code == 91) ? true : undefined);
};

window["DesktopOfflineAppDocumentSignatures"] = function(_json)
{
	var _editor = window["Asc"]["editor"] ? window["Asc"]["editor"] : window.editor;

	_editor.signatures = [];

	var _signatures = JSON.parse(_json);
	var _count = _signatures["count"];
	var _data = _signatures["data"];
	var _sign;
	var _add_sign;
	for (var i = 0; i < _count; i++)
	{
		_sign = _data[i];
		_add_sign = new window["AscCommon"].asc_CSignarureLine();

		_add_sign.guid = _sign["guid"];
		_add_sign.valid = _sign["valid"];
		_add_sign.image = (_add_sign.valid == 0) ? _sign["image_valid"] : _sign["image_invalid"];
		_add_sign.signer1 = _sign["name"];
		_add_sign.id = i;

		_editor.signatures.push(_add_sign);
	}

	_editor.asc_registerCallback("asc_onAddSignature", function(guid) {

		var _api = window["Asc"]["editor"] ? window["Asc"]["editor"] : window.editor;
		_api.sendEvent("asc_onUpdateSignatures", _api.asc_getSignatures(), _api.asc_getRequestSignatures());

	});
	_editor.asc_registerCallback("asc_onRemoveSignature", function(guid) {

		var _api = window["Asc"]["editor"] ? window["Asc"]["editor"] : window.editor;
		_api.sendEvent("asc_onUpdateSignatures", _api.asc_getSignatures(), _api.asc_getRequestSignatures());

	});
};

// меняем среду
//AscBrowser.isSafari = false;
//AscBrowser.isSafariMacOs = false;
//window.USER_AGENT_SAFARI_MACOS = false;