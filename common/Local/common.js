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

window["DesktopUploadFileToUrl"] = function(url, dst, hash, pass)
{
    var xhr = new XMLHttpRequest();
    xhr.open('GET', "ascdesktop://fonts/" + url, true);
    xhr.responseType = 'arraybuffer';

    if (xhr.overrideMimeType)
        xhr.overrideMimeType('text/plain; charset=x-user-defined');
    else
        xhr.setRequestHeader('Accept-Charset', 'x-user-defined');

    xhr.onload = function()
    {
        if (this.status != 200)
        {
            // error
            return;
        }

        var fileData = new Uint8Array(this.response);

        var req = new XMLHttpRequest();
        req.open("PUT", dst, true);

        req.onload = function()
		{
			if (this.response && this.status == 200)
			{
				try
				{
					var data = {
						"accounts": this.response ? JSON.parse(this.response) : undefined,
						"hash": hash,
						"password" : pass,
						"type": "share"
					};

					window["AscDesktopEditor"]["sendSystemMessage"](data);
					window["AscDesktopEditor"]["CallInAllWindows"]("function(){ if (window.DesktopUpdateFile) { window.DesktopUpdateFile(undefined); } }");
				}
				catch (err)
				{
				}
			}
        };

        req.send(fileData);
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

	if (strPath == "Editor.xlsx")
		return this.documentUrl + "/" + strPath;

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
	var _pluginsTmp = JSON.parse(window["AscDesktopEditor"]["GetInstallPlugins"]());
	_pluginsTmp[0]["url"] = _pluginsTmp[0]["url"].split(" ").join("%20");
	_pluginsTmp[1]["url"] = _pluginsTmp[1]["url"].split(" ").join("%20");

	var _plugins = { "url" : _pluginsTmp[0]["url"], "pluginsData" : [] };
	for (var k = 0; k < 2; k++)
	{
		var _pluginsCur = _pluginsTmp[k];

		var _len = _pluginsCur["pluginsData"].length;
		for (var i = 0; i < _len; i++)
		{
			_pluginsCur["pluginsData"][i]["baseUrl"] = _pluginsCur["url"] + _pluginsCur["pluginsData"][i]["guid"].substring(4) + "/";
			_plugins["pluginsData"].push(_pluginsCur["pluginsData"][i]);
		}
	}

	for (var i = 0; i < _plugins["pluginsData"].length; i++)
	{
		var _plugin = _plugins["pluginsData"][i];
		//_plugin["baseUrl"] = _plugins["url"] + _plugin["guid"].substring(4) + "/";

		var isSystem = false;
		for (var j = 0; j < _plugin["variations"].length; j++)
		{
			var _variation = _plugin["variations"][j];
			if (_variation["initDataType"] == "desktop")
			{
				isSystem = true;
				break;
			}
		}

		if (isSystem)
		{
			_plugins["pluginsData"].splice(i, 1);
			--i;
		}
	}

	var _editor = window["Asc"]["editor"] ? window["Asc"]["editor"] : window.editor;

	if (!window.IsFirstPluginLoad)
	{
		_editor.asc_registerCallback("asc_onPluginsReset", function ()
		{

			if (_editor.pluginsManager)
			{
				_editor.pluginsManager.unregisterAll();
			}

		});

		window.IsFirstPluginLoad = true;
	}

	_editor.sendEvent("asc_onPluginsReset");
	_editor.sendEvent("asc_onPluginsInit", _plugins);
};

window["UpdateSystemPlugins"] = function()
{
	var _plugins = JSON.parse(window["AscDesktopEditor"]["GetInstallPlugins"]());
	_plugins[0]["url"] = _plugins[0]["url"].replace(" ", "%20");
	_plugins[1]["url"] = _plugins[1]["url"].replace(" ", "%20");

	for (var k = 0; k < 2; k++)
	{
		var _pluginsCur = _plugins[k];

		var _len = _pluginsCur["pluginsData"].length;
		for (var i = 0; i < _len; i++)
			_pluginsCur["pluginsData"][i]["baseUrl"] = _pluginsCur["url"] + _pluginsCur["pluginsData"][i]["guid"].substring(4) + "/";
	}

	var _editor = window["Asc"]["editor"] ? window["Asc"]["editor"] : window.editor;

	var _array = [];

	for (var k = 0; k < 2; k++)
	{
		var _pluginsCur = _plugins[k];
		var _len = _pluginsCur["pluginsData"].length;

		for (var i = 0; i < _len; i++)
		{
			var _plugin = _pluginsCur["pluginsData"][i];
			for (var j = 0; j < _plugin["variations"].length; j++)
			{
				var _variation = _plugin["variations"][j];
				if (_variation["initDataType"] == "desktop")
				{
					_array.push(_plugin);
					break;
				}
			}
		}
	}

	var _arraySystem = [];
	for (var i = 0; i < _array.length; i++)
	{
		var plugin = new Asc.CPlugin();
		plugin["deserialize"](_array[i]);

		_arraySystem.push(plugin);
	}

	window.g_asc_plugins.registerSystem("", _arraySystem);
	window.g_asc_plugins.runAllSystem();
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

window["asc_initAdvancedOptions"] = function(_code, _file_hash)
{
    var _editor = window["Asc"]["editor"] ? window["Asc"]["editor"] : window.editor;

    if ((_code == 90 || _code == 91) && window.g_asc_plugins && window.g_asc_plugins.isRunned("asc.{F2402876-659F-47FB-A646-67B49F2B57D0}"))
	{
		window.g_asc_plugins.init("asc.{F2402876-659F-47FB-A646-67B49F2B57D0}", { "type" : "getPasswordByFile", "hash" : _file_hash });
		return;
	}

	_editor._onNeedParams(undefined, (_code == 90 || _code == 91) ? true : undefined);
};

window["DesktopOfflineAppDocumentSignatures"] = function(_json)
{
	var _editor = window["Asc"]["editor"] ? window["Asc"]["editor"] : window.editor;

	_editor.signatures = [];

	var _signatures = [];
	if ("" != _json)
	{
		try
		{
			_signatures = JSON.parse(_json);
		}
		catch (err)
		{
			_signatures = [];
		}
	}

	var _count = _signatures["count"];
	var _data = _signatures["data"];
	var _sign;
	var _add_sign;

	var _images_loading = [];
	for (var i = 0; i < _count; i++)
	{
		_sign = _data[i];
		_add_sign = new window["AscCommon"].asc_CSignatureLine();

		_add_sign.guid = _sign["guid"];
		_add_sign.valid = _sign["valid"];
		_add_sign.image = (_add_sign.valid == 0) ? _sign["image_valid"] : _sign["image_invalid"];
		_add_sign.image = "data:image/png;base64," + _add_sign.image;
		_add_sign.signer1 = _sign["name"];
		_add_sign.id = i;
		_add_sign.date = _sign["date"];
		_add_sign.isvisible = window["asc_IsVisibleSign"](_add_sign.guid);
		_add_sign.correct();

		_editor.signatures.push(_add_sign);

		_images_loading.push(_add_sign.image);
	}

	if (!window.FirstSignaturesCall)
	{
		_editor.asc_registerCallback("asc_onAddSignature", function (guid)
		{

			var _api = window["Asc"]["editor"] ? window["Asc"]["editor"] : window.editor;
			_api.sendEvent("asc_onUpdateSignatures", _api.asc_getSignatures(), _api.asc_getRequestSignatures());

		});
		_editor.asc_registerCallback("asc_onRemoveSignature", function (guid)
		{

			var _api = window["Asc"]["editor"] ? window["Asc"]["editor"] : window.editor;
			_api.sendEvent("asc_onUpdateSignatures", _api.asc_getSignatures(), _api.asc_getRequestSignatures());

		});
		_editor.asc_registerCallback("asc_onUpdateSignatures", function (signatures, requested)
		{

			var _api = window["Asc"]["editor"] ? window["Asc"]["editor"] : window.editor;
			if (_api.editorId == AscCommon.c_oEditorId.Word || _api.editorId == AscCommon.c_oEditorId.Presentation)
			{
				if (0 == signatures.length)
					_api.asc_setRestriction(Asc.c_oAscRestrictionType.None);
				else
					_api.asc_setRestriction(Asc.c_oAscRestrictionType.OnlySignatures);
			}
			else
			{
				//_api.asc_setViewMode((0 == signatures.length) ? false : true);
				_api.collaborativeEditing.m_bGlobalLock = (0 == signatures.length) ? false : true;
			}

		});
	}
	window.FirstSignaturesCall = true;

	_editor.ImageLoader.LoadImagesWithCallback(_images_loading, function() {
		if (this.WordControl)
			this.WordControl.OnRePaintAttack();
		else if (this._onShowDrawingObjects)
			this._onShowDrawingObjects();
	}, null);

	_editor.sendEvent("asc_onUpdateSignatures", _editor.asc_getSignatures(), _editor.asc_getRequestSignatures());
};

window["DesktopSaveQuestionReturn"] = function(isNeedSaved)
{
	if (isNeedSaved)
	{
		var _editor = window["Asc"]["editor"] ? window["Asc"]["editor"] : window.editor;
		_editor.asc_Save(false);
	}
	else
	{
		window.SaveQuestionObjectBeforeSign = null;
	}
};

window["OnNativeReturnCallback"] = function(name, obj)
{
	var _api = window["Asc"]["editor"] ? window["Asc"]["editor"] : window.editor;
	_api.sendEvent(name, obj);
};

window["OnNativeOpenFilenameDialog"] = function(file)
{
	window.on_native_open_filename_dialog(file);
	delete window.on_native_open_filename_dialog;
};

window["asc_IsVisibleSign"] = function(guid)
{
	var _editor = window["Asc"]["editor"] ? window["Asc"]["editor"] : window.editor;

	var isVisible = false;
	// detect visible/unvisible
	var _req = _editor.asc_getAllSignatures();
	for (var i = 0; i < _req.length; i++)
	{
		if (_req[i].id == guid)
		{
			isVisible = true;
			break;
		}
	}

	return isVisible;
};

window["asc_LocalRequestSign"] = function(guid, width, height, isView)
{
	if (isView !== true && width === undefined)
	{
		width = 100;
		height = 100;
	}

	var _editor = window["Asc"]["editor"] ? window["Asc"]["editor"] : window.editor;
	var _length = _editor.signatures.length;
	for (var i = 0; i < _length; i++)
	{
		if (_editor.signatures[i].guid == guid)
		{
			if (isView === true)
			{
				window["AscDesktopEditor"]["ViewCertificate"](_editor.signatures[i].id);
			}
			return;
		}
	}

	var isModify = false;
	if (_editor.asc_isDocumentModified)
		isModify = _editor.asc_isDocumentModified();
	else
		isModify = _editor.isDocumentModified();

	if (!isModify)
	{
		_editor.sendEvent("asc_onSignatureClick", guid, width, height, window["asc_IsVisibleSign"](guid));
		return;
	}

	window.SaveQuestionObjectBeforeSign = { guid : guid, width : width, height : height };
	window["AscDesktopEditor"]["SaveQuestion"]();
};

window["DesktopAfterOpen"] = function(_api)
{
	_api.asc_registerCallback("asc_onSignatureDblClick", function (guid, width, height)
	{
		window["asc_LocalRequestSign"](guid, width, height, true);
	});

	_api.sendEvent('asc_onSpellCheckInit', [
		"1027",
		"1029",
		"1030",
		"1031",
		"1032",
		"1033",
		"1036",
		"1038",
		"1040",
		"1042",
		"1043",
		"1044",
		"1045",
		"1046",
		"1048",
		"1049",
		"1051",
		"1053",
		"1055",
		"1058",
		"1062",
		"1063",
		"1066",
		"1068",
		"2055",
		"2057",
		"2068",
		"2070",
		"3079",
		"3081",
		"3082"
	]);
};

function getBinaryArray(_data, _len)
{
	var _array = new Uint8Array(_len);
	var _index = 0;
	var _written = 0;

	var _data_len = _data.length;
	while (_index < _data_len)
	{
		var dwCurr = 0;
		var i;
		var nBits = 0;
		for (i=0; i<4; i++)
		{
			if (_index >= _data_len)
				break;
			var nCh = DecodeBase64Char(_data.charCodeAt(_index++));
			if (nCh == -1)
			{
				i--;
				continue;
			}
			dwCurr <<= 6;
			dwCurr |= nCh;
			nBits += 6;
		}

		dwCurr <<= 24-nBits;
		for (i=0; i<nBits/8; i++)
		{
			_array[_written++] = ((dwCurr & 0x00ff0000) >>> 16);
			dwCurr <<= 8;
		}
	}

	return _array;
}

// OnlyPass ----------------------------------
var _proto = Asc['asc_docs_api'] ? Asc['asc_docs_api'] : Asc['spreadsheet_api'];
_proto.prototype["pluginMethod_OnlyPass"] = function(obj)
{
	var _editor = window["Asc"]["editor"] ? window["Asc"]["editor"] : window.editor;
	switch (obj.type)
	{
		case "generatePassword":
		{
			if ("" == obj["password"])
			{
				AscCommon.History.UserSavedIndex = _editor.LastUserSavedIndex;

				if (window.editor)
					_editor.UpdateInterfaceState();
				else
					_editor.onUpdateDocumentModified(AscCommon.History.Have_Changes());

				_editor.LastUserSavedIndex = undefined;

				_editor.sendEvent("asc_onError", "There is no connection with the blockchain", c_oAscError.Level.Critical);
				return;
			}

			window["DesktopOfflineAppDocumentStartSave"](window.doadssIsSaveAs, obj["password"], true);
			break;
		}
		case "getPasswordByFile":
		{
			if ("" != obj["password"])
			{
				var _param = ("<m_sPassword>" + AscCommon.CopyPasteCorrectString(obj["password"]) + "</m_sPassword>");
				_editor.currentPassword = obj["password"];

				window["AscDesktopEditor"]["SetAdvancedOptions"](_param);
			}
			else
			{
				this._onNeedParams(undefined, true);
			}
			break;
		}
	}
};
// -------------------------------------------

// меняем среду
//AscBrowser.isSafari = false;
//AscBrowser.isSafariMacOs = false;
//window.USER_AGENT_SAFARI_MACOS = false;