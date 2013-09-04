var g_sMainServiceLocalUrl = "/CanvasService.ashx";var g_sResourceServiceLocalUrl = "/ResourceService.ashx?path=";var g_sUploadServiceLocalUrl = "/UploadService.ashx";var g_sSpellCheckServiceLocalUrl = "/SpellChecker.ashx";function fSortAscending(a, b){return a - b;}function fSortDescending(a, b){return b - a;}var c_oEditorId = {    Word : 0,    Speadsheet : 1,    Presentation : 2};var PostMessageType = {    UploadImage		: 0,	ExtensionExist	:1};var c_oAscServerError = {	NoError : 0,    Unknown : -1,    ReadRequestStream : -3,	    TaskQueue : -20,	    TaskResult : -40,	    Storage : -60,    StorageFileNoFound : -61,    StorageRead : -62,    StorageWrite : -63,    StorageRemoveDir : -64,    StorageCreateDir : -65,    StorageGetInfo : -66,		Convert : -80,    ConvertDownload : -81,    ConvertUnknownFormat : -82,    ConvertTimeout : -83,    ConvertReadFile : -84,	    Upload : -100,    UploadContentLength : -101,    UploadExtension : -102,    UploadCountFiles : -103,	    VKey : -120,    VKeyEncrypt : -121,    VKeyKeyExpire : -122,    VKeyUserCountExceed : -123}var c_oAscImageUploadProp = {//Не все браузеры позволяют получить информацию о файле до загрузки(например ie9), меняя параметры здесь надо поменять аналогичные параметры в web.common	MaxFileSize:25000000, //25 mb	SupportedFormats:[ "jpg", "jpeg", "jpe", "png", "gif", "bmp"]};function ValidateUploadImage(files){
	var nRes = c_oAscServerError.NoError;
	if(1 === files.length )
	{
		var file = files[0];
		//проверяем расширение файла
		var sName = file.fileName || file.name;
		if(sName)
		{
			var bSupported = false;
			var nIndex = sName.lastIndexOf(".");
			if(-1 != nIndex)
			{
				var ext = sName.substring(nIndex + 1).toLowerCase();
				for(var i = 0, length = c_oAscImageUploadProp.SupportedFormats.length; i < length; i++)
				{
					if(c_oAscImageUploadProp.SupportedFormats[i] == ext)
					{
						bSupported = true;
						break;
					}
				}
			}
			if(false == bSupported)
				nRes = c_oAscServerError.UploadExtension;
		}
		if(c_oAscError.ID.No == nRes)
		{
			var nSize = file.fileSize || file.size;
			if(nSize && c_oAscImageUploadProp.MaxFileSize < nSize)
				nRes = c_oAscServerError.UploadContentLength;
		}
	}
	else
		nRes = c_oAscServerError.UploadCountFiles;
	return nRes;
}function CanDropFiles(event) {	var bRes = false;    if (event.dataTransfer.types && 1 == event.dataTransfer.types.length) {		var type = event.dataTransfer.types[0];		if(type == "Files")		{			if(event.dataTransfer.items)			{				if (1 == event.dataTransfer.items.length)				{					var item = event.dataTransfer.items[0];					for(var i = 0, length = c_oAscImageUploadProp.SupportedFormats.length; i < length; i++)					{						if(item.type && -1 != item.type.indexOf(c_oAscImageUploadProp.SupportedFormats[i]))						{							bRes = true;							break;						}					}				}			}			else				bRes = true;		}    }    return bRes;}function GetUploadIFrame(){	var sIFrameName = "apiImageUpload";	var oImageUploader = document.getElementById(sIFrameName);	if(!oImageUploader)	{		var frame = document.createElement("iframe");		frame.name = sIFrameName;		frame.id = sIFrameName;		frame.setAttribute("style", "position:absolute;left:-2px;top:-2px;width:1px;height:1px;z-index:-1000;");		document.body.appendChild(frame);	}	return window.frames[sIFrameName];}