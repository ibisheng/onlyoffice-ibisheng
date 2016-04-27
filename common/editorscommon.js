"use strict";

(
/**
* @param {Window} window
* @param {undefined} undefined
*/
function (window, undefined) {
// Import
var AscBrowser = AscCommon.AscBrowser;
var locktype_None = AscCommon.locktype_None;
var locktype_Mine = AscCommon.locktype_Mine;
var locktype_Other = AscCommon.locktype_Other;
var locktype_Other2 = AscCommon.locktype_Other2;
var locktype_Other3 = AscCommon.locktype_Other3;
var contentchanges_Add = AscCommon.contentchanges_Add;
var CColor = AscCommon.CColor;
var g_oCellAddressUtils = AscCommon.g_oCellAddressUtils;

var c_oAscFileType = Asc.c_oAscFileType;

if (typeof String.prototype.startsWith != 'function') {
	String.prototype.startsWith = function (str){
		return this.indexOf(str) === 0;
	};
	String.prototype['startsWith'] = String.prototype.startsWith;
}
if (typeof String.prototype.endsWith !== 'function') {
	String.prototype.endsWith = function(suffix) {
		return this.indexOf(suffix, this.length - suffix.length) !== -1;
	};
	String.prototype['endsWith'] = String.prototype.endsWith;
}
if (typeof String.prototype.repeat !== 'function') {
    String.prototype.repeat = function(count) {
        'use strict';
        if (this == null) {
            throw new TypeError('can\'t convert ' + this + ' to object');
        }
        var str = '' + this;
        count = +count;
        if (count != count) {
            count = 0;
        }
        if (count < 0) {
            throw new RangeError('repeat count must be non-negative');
        }
        if (count == Infinity) {
            throw new RangeError('repeat count must be less than infinity');
        }
        count = Math.floor(count);
        if (str.length == 0 || count == 0) {
            return '';
        }
        // Обеспечение того, что count является 31-битным целым числом, позволяет нам значительно
        // соптимизировать главную часть функции. Впрочем, большинство современных (на август
        // 2014 года) браузеров не обрабатывают строки, длиннее 1 << 28 символов, так что:
        if (str.length * count >= 1 << 28) {
            throw new RangeError('repeat count must not overflow maximum string size');
        }
        var rpt = '';
        for (;;) {
            if ((count & 1) == 1) {
                rpt += str;
            }
            count >>>= 1;
            if (count == 0) {
                break;
            }
            str += str;
        }
        return rpt;
    };
	String.prototype['repeat'] = String.prototype.repeat;
}
// Extend javascript String type
String.prototype.strongMatch = function(regExp){
    if (regExp && regExp instanceof RegExp) {
        var arr = this.toString().match(regExp);
        return !!(arr && arr.length > 0 && arr[0].length == this.length);
    }

    return false;
};

if (typeof require =="function" && !window["XRegExp"]){window["XRegExp"] = require("xregexp");}

var oZipChanges = null;
var sDownloadServiceLocalUrl = "/downloadas";
var sUploadServiceLocalUrl = "/upload";
var sUploadServiceLocalUrlOld = "/uploadold";
var nMaxRequestLength = 5242880;//5mb <requestLimits maxAllowedContentLength="30000000" /> default 30mb

function getEncodingParams() {
	var res = [];
	for(var i = 0; i < AscCommon.c_oAscEncodings.length; ++i) {
		var encoding = AscCommon.c_oAscEncodings[i];
		var newElem = {'codepage': encoding[0], 'name': encoding[3]};
		res.push(newElem);
	}
	return res;
}
function DocumentUrls(){
	this.urls = {};
	this.urlsReverse = {};
  this.documentUrl = "";
	this.imageCount = 0;
}
DocumentUrls.prototype = {
	mediaPrefix: 'media/',
	init: function (urls) {
		this.addUrls(urls);
	},
	getUrls: function () {
		return this.urls;
	},
	addUrls : function(urls){
		for(var i in urls){
			var url = urls[i];
			this.urls[i] = url;
			this.urlsReverse[url] = i;
			this.imageCount++;
		}
	},
	addImageUrl : function(strPath, url){
		var urls = {};
		urls[this.mediaPrefix + strPath] = url;
		this.addUrls(urls);
	},
	getImageUrl : function(strPath){
		return this.getUrl(this.mediaPrefix + strPath);
	},
	getImageLocal : function(url){
		var imageLocal = this.getLocal(url);
		if(imageLocal && this.mediaPrefix == imageLocal.substring(0, this.mediaPrefix.length))
			imageLocal = imageLocal.substring(this.mediaPrefix.length);
		return imageLocal;
	},
	imagePath2Local : function(imageLocal){
		if(imageLocal && this.mediaPrefix == imageLocal.substring(0, this.mediaPrefix.length))
			imageLocal = imageLocal.substring(this.mediaPrefix.length);
		return imageLocal;
	},
	getUrl : function(strPath){
		if(this.urls){
			return this.urls[strPath];
		}
		return null;
	},
	getLocal : function(url){
		if(this.urlsReverse){
			var res = this.urlsReverse[url];
			if (!res && typeof editor !== 'undefined' && editor.ThemeLoader && 0 == url.indexOf(editor.ThemeLoader.ThemesUrlAbs)) {
				res = url.substring(editor.ThemeLoader.ThemesUrlAbs.length);
			}
			return res;
		}
		return null;
	},
	getMaxIndex : function(url){
		return this.imageCount;
	}
};
var g_oDocumentUrls = new DocumentUrls();

function OpenFileResult () {
	this.bSerFormat = false;
	this.data = null;
	this.url = null;
	this.changes = null;
}

function saveWithParts(fSendCommand, fCallback, fCallbackRequest, oAdditionalData, dataContainer) {
	var index = dataContainer.index;
	if(null == dataContainer.part && (!dataContainer.data || dataContainer.data.length <= nMaxRequestLength)){
		oAdditionalData["savetype"] = AscCommon.c_oAscSaveTypes.CompleteAll;
	}
	else{
		if(0 == index){
			oAdditionalData["savetype"] = AscCommon.c_oAscSaveTypes.PartStart;
			dataContainer.count = Math.ceil(dataContainer.data.length / nMaxRequestLength);
		} else if(index != dataContainer.count - 1){
			oAdditionalData["savetype"] = AscCommon.c_oAscSaveTypes.Part;
		} else {
			oAdditionalData["savetype"] = AscCommon.c_oAscSaveTypes.Complete;
		}
		dataContainer.part = dataContainer.data.substring(index * nMaxRequestLength, (index + 1) * nMaxRequestLength);
	}
	dataContainer.index++;
	oAdditionalData["saveindex"] = dataContainer.index;
	fSendCommand(function (incomeObject) {
		if(null != incomeObject && "ok" == incomeObject["status"]){
			if(dataContainer.index < dataContainer.count) {
				oAdditionalData["savekey"] = incomeObject["data"];
        saveWithParts(fSendCommand, fCallback, fCallbackRequest, oAdditionalData, dataContainer);
			} else if(fCallbackRequest){
				fCallbackRequest(incomeObject);
			}
		} else {
			fCallbackRequest ? fCallbackRequest(incomeObject) : fCallback(incomeObject);
		}
	}, oAdditionalData, dataContainer);
}

function loadFileContent(url, callback) {
  asc_ajax({
    url: url,
    dataType: "text",
    success: callback,
    error: function() {
      callback(null);
    }
  });
}

function getJSZipUtils() {
  return window['JSZipUtils'] ? window['JSZipUtils'] : require('jsziputils');
}
function getImageFromChanges (name) {
	var file;
	var ext = GetFileExtension(name);
	if (null !== ext && oZipChanges && (file = oZipChanges.files[name])) {
		var oFileArray = file.asUint8Array();
		return 'data:image/' + ext + ';base64,' + AscCommon.Base64Encode(oFileArray, oFileArray.length, 0);
	}
	return null;
}
function openFileCommand(binUrl, changesUrl, Signature, callback) {
  var bError = false, oResult = new OpenFileResult(), bEndLoadFile = false, bEndLoadChanges = false;
  var onEndOpen = function() {
    if (bEndLoadFile && bEndLoadChanges) {
      if (callback) {
        callback(bError, oResult);
      }
    }
  };
  var sFileUrl = binUrl;
  sFileUrl = sFileUrl.replace(/\\/g, "/");
  asc_ajax({
    url: sFileUrl,
    dataType: "text",
    success: function(result) {
      //получаем url к папке с файлом
      var url;
      var nIndex = sFileUrl.lastIndexOf("/");
      url = (-1 !== nIndex) ? sFileUrl.substring(0, nIndex + 1) : sFileUrl;
      if (0 < result.length) {
        oResult.bSerFormat = Signature === result.substring(0, Signature.length);
        oResult.data = result;
        oResult.url = url;
      } else {
        bError = true;
      }
      bEndLoadFile = true;
      onEndOpen();
    },
    error: function() {
      bEndLoadFile = true;
      bError = true;
      onEndOpen();
    }
  });
  if (null != changesUrl) {
    getJSZipUtils().getBinaryContent(changesUrl, function(err, data) {
      bEndLoadChanges = true;
      if (err) {
        bError = true;
        onEndOpen();
        return;
      }

      oZipChanges = new (require('jszip'))(data);
      oResult.changes = [];
      for (var i in oZipChanges.files) {
        if (i.endsWith('.json')) {
          // Заглушка на имя файла (стоило его начинать с цифры)
          oResult.changes[parseInt(i.slice('changes'.length))] = JSON.parse(oZipChanges.files[i].asText());
        }
      }
      onEndOpen();
    });
  } else {
    bEndLoadChanges = true;
  }
}
function sendCommand(editor, fCallback, rdata, dataContainer) {
  //json не должен превышать размера 2097152, иначе при его чтении будет exception
  var docConnectionId = editor.CoAuthoringApi.getDocId();
  if (docConnectionId && docConnectionId !== rdata["id"]) {
    //на случай если поменялся documentId в Version History
    rdata['docconnectionid'] = docConnectionId;
  }
  if (null == rdata["savetype"]) {
    editor.CoAuthoringApi.openDocument(rdata);
    return;
  }
  rdata["userconnectionid"] = editor.CoAuthoringApi.getUserConnectionId();
  asc_ajax({
    type: 'POST',
    url: sDownloadServiceLocalUrl + '/' + rdata["id"] + '?cmd=' + encodeURIComponent(JSON.stringify(rdata)),
    data: dataContainer.part || dataContainer.data,
    contentType: "application/octet-stream",
    error: function() {
      if (fCallback) {
        fCallback(null, true);
      }
    },
    success: function(msg) {
      if (fCallback) {
        fCallback(JSON.parse(msg), true);
      }
    }
  });
}

function mapAscServerErrorToAscError(nServerError) {
	var nRes = Asc.c_oAscError.ID.Unknown;
	switch (nServerError) {
		case c_oAscServerError.NoError : nRes = Asc.c_oAscError.ID.No; break;
		case c_oAscServerError.TaskQueue :
		case c_oAscServerError.TaskResult : nRes = Asc.c_oAscError.ID.Database; break;
		case c_oAscServerError.ConvertDownload : nRes = Asc.c_oAscError.ID.DownloadError; break;
		case c_oAscServerError.ConvertTimeout : nRes = Asc.c_oAscError.ID.ConvertationTimeout; break;
		case c_oAscServerError.ConvertMS_OFFCRYPTO : nRes = Asc.c_oAscError.ID.ConvertationPassword; break;
		case c_oAscServerError.ConvertUnknownFormat :
		case c_oAscServerError.ConvertReadFile :
		case c_oAscServerError.Convert : nRes = Asc.c_oAscError.ID.ConvertationError; break;
		case c_oAscServerError.UploadContentLength : nRes = Asc.c_oAscError.ID.UplImageSize; break;
		case c_oAscServerError.UploadExtension : nRes = Asc.c_oAscError.ID.UplImageExt; break;
		case c_oAscServerError.UploadCountFiles : nRes = Asc.c_oAscError.ID.UplImageFileCount; break;
		case c_oAscServerError.VKey : nRes = Asc.c_oAscError.ID.FileVKey; break;
		case c_oAscServerError.VKeyEncrypt : nRes = Asc.c_oAscError.ID.VKeyEncrypt; break;
		case c_oAscServerError.VKeyKeyExpire : nRes = Asc.c_oAscError.ID.KeyExpire; break;
		case c_oAscServerError.VKeyUserCountExceed : nRes = Asc.c_oAscError.ID.UserCountExceed; break;
		case c_oAscServerError.Storage :
		case c_oAscServerError.StorageFileNoFound :
		case c_oAscServerError.StorageRead :
		case c_oAscServerError.StorageWrite :
		case c_oAscServerError.StorageRemoveDir :
		case c_oAscServerError.StorageCreateDir :
		case c_oAscServerError.StorageGetInfo :
		case c_oAscServerError.Upload :
		case c_oAscServerError.ReadRequestStream :
		case c_oAscServerError.Unknown : nRes = Asc.c_oAscError.ID.Unknown; break;
	}
	return nRes;
}

function joinUrls(base, relative) {
    //http://stackoverflow.com/questions/14780350/convert-relative-path-to-absolute-using-javascript
    var stack = base.split("/"),
        parts = relative.split("/");
    stack.pop(); // remove current file name (or empty string)
                 // (omit if "base" is the current folder without trailing slash)
    for (var i=0; i<parts.length; i++) {
        if (parts[i] == ".")
            continue;
        if (parts[i] == "..")
            stack.pop();
        else
            stack.push(parts[i]);
    }
    return stack.join("/");
}
function getFullImageSrc2 (src) {
	if (window["NATIVE_EDITOR_ENJINE"])
		return src;

	var start = src.slice(0, 6);
	if (0 === start.indexOf('theme') && editor.ThemeLoader){
		return  editor.ThemeLoader.ThemesUrlAbs + src;
	}

	if (0 !== start.indexOf('http:') && 0 !== start.indexOf('data:') && 0 !== start.indexOf('https:') &&
		0 !== start.indexOf('file:') && 0 !== start.indexOf('ftp:')){
			var srcFull = g_oDocumentUrls.getImageUrl(src);
			if(srcFull){
				return srcFull;
			}
		}
	return src;
}

function fSortAscending( a, b ) {
    return a - b;
}
function fSortDescending( a, b ) {
    return b - a;
}
function fOnlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}
function isLeadingSurrogateChar(nCharCode) {
    return (nCharCode >= 0xD800 && nCharCode <= 0xDFFF);
}
function decodeSurrogateChar(nLeadingChar, nTrailingChar) {
    if (nLeadingChar < 0xDC00 && nTrailingChar >= 0xDC00 && nTrailingChar <= 0xDFFF)
        return 0x10000 + ((nLeadingChar & 0x3FF) << 10) | (nTrailingChar & 0x3FF);
    else
        return null;
}
function encodeSurrogateChar(nUnicode) {
    if(nUnicode < 0x10000)
    {
        return String.fromCharCode(nUnicode);
    }
    else
    {
        nUnicode = nUnicode - 0x10000;
        var nLeadingChar = 0xD800 | (nUnicode >> 10);
        var nTrailingChar = 0xDC00 | (nUnicode & 0x3FF);
        return String.fromCharCode(nLeadingChar) + String.fromCharCode(nTrailingChar);
    }
}

function convertUnicodeToUTF16(sUnicode)
{
    var sUTF16 = "";
    var nLength = sUnicode.length;
    for (var nPos = 0; nPos < nLength; nPos++)
    {
        sUTF16 += encodeSurrogateChar(sUnicode[nPos]);
    }

    return sUTF16;
}
function convertUTF16toUnicode(sUTF16)
{
    var sUnicode = [];
    var nLength = sUTF16.length;
    for (var nPos = 0; nPos < nLength; nPos++)
    {
        var nUnicode = null;
        var nCharCode = sUTF16.charCodeAt(nPos);
        if (isLeadingSurrogateChar(nCharCode))
        {
            if (nPos + 1 < nLength)
            {
                nPos++;
                var nTrailingChar = sUTF16.charCodeAt(nPos);
                nUnicode = decodeSurrogateChar(nCharCode, nTrailingChar);
            }
        }
        else
            nUnicode = nCharCode;

        if (null !== nUnicode)
            sUnicode.push(nUnicode);
    }

    return sUnicode;
}

/**
 * @constructor
 */
function test_ws_name() {
    var self = new XRegExp( "[^\\p{L}(\\p{L}\\d._)*]" );
    self.regexp_letter = new XRegExp( "^\\p{L}[\\p{L}\\d.]*$" );
    self.regexp_left_bracket = new XRegExp( "\\[" );
    self.regexp_right_bracket = new XRegExp( "\\]" );
    self.regexp_left_brace = new XRegExp( "\\{" );
    self.regexp_right_brace = new XRegExp( "\\}" );
    self.regexp_number_mark = new XRegExp( "№" );
    self.regexp_special_letters = new XRegExp( "[\\'\\*\\[\\]\\\\:\\/]" );
    self.sheet_name_character_special = new XRegExp( "('')|[^\\'\\*\\[\\]\\:/\\?]" );
    self.sheet_name_start_character_special = new XRegExp( "^[^\\'\\*\\[\\]\\:/\\?]" );
    self.sheet_name_end_character_special = new XRegExp( "[^\\'\\*\\[\\]\\:/\\?]$" );
    self.sheet_name_character = new XRegExp( "[-+*/^&%<=>:\\'\\[\\]\\?\\s]" );
    self.book_name_character_special =
        self.book_name_start_character_special = new XRegExp( "[^\\'\\*\\[\\]\\:\\?]" );
    self.apostrophe = new XRegExp( "'" );
    self.srt_left_bracket = "[";
    self.srt_right_bracket = "]";
    self.srt_left_brace = "{";
    self.srt_right_brace = "}";
    self.srt_number_letter = "№";

    self.matchRec = function ( str, left, right ) {
        return XRegExp.matchRecursive( str, "\\" + left, "\\" + right, "g" )
    };

    self.test = function ( str ) {
        var matchRec, splitStr = str, res;
        if ( this.regexp_left_bracket.test( str ) || this.regexp_right_bracket.test( str ) ) {
            try {
                if ( str[0] != "[" )
                    return false;

                matchRec = this.matchRec( str, this.srt_left_bracket, this.srt_right_bracket );

                if ( matchRec.length > 1 ) {
                    return false;
                }
                else if ( matchRec[0] == "" ) {
                    return false;
                }
                else if ( this.regexp_special_letters.test( matchRec[i] ) ) {
                    return false;
                }
                splitStr = str.split( "[" + matchRec[0] + "]" )[1];
            }
            catch( e ) {
                return false;
            }
        }
        res = this.sheet_name_start_character_special.test( splitStr ) &&
            this.sheet_name_end_character_special.test( splitStr ) && !XRegExp.test( splitStr, this );

        this.sheet_name_start_character_special.lastIndex = 0;
        this.sheet_name_end_character_special.lastIndex = 0;
        XRegExp.lastIndex = 0;
        this.regexp_special_letters.lastIndex = 0;
        this.regexp_right_bracket.lastIndex = 0;
        this.regexp_left_bracket.lastIndex = 0;

        return res;
    };

    return self;
}

function test_ws_name2() {
    var str_namedRanges = "[A-Z\u005F\u0080-\u0081\u0083\u0085-\u0087\u0089-\u008A\u008C-\u0091\u0093-\u0094\u0096-\u0097\u0099-\u009A\u009C-\u009F\u00A1-\u00A5\u00A7-\u00A8\u00AA\u00AD\u00AF-\u00BA\u00BC-\u02B8\u02BB-\u02C1\u02C7\u02C9-\u02CB\u02CD\u02D0-\u02D1\u02D8-\u02DB\u02DD\u02E0-\u02E4\u02EE\u0370-\u0373\u0376-\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u0523\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0621-\u064A\u066E-\u066F\u0671-\u06D3\u06D5\u06E5-\u06E6\u06EE-\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4-\u07F5\u07FA\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0972\u097B-\u097F\u0985-\u098C\u098F-\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC-\u09DD\u09DF-\u09E1\u09F0-\u09F1\u0A05-\u0A0A\u0A0F-\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32-\u0A33\u0A35-\u0A36\u0A38-\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2-\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0-\u0AE1\u0B05-\u0B0C\u0B0F-\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32-\u0B33\u0B35-\u0B39\u0B3D\u0B5C-\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99-\u0B9A\u0B9C\u0B9E-\u0B9F\u0BA3-\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D\u0C58-\u0C59\u0C60-\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0-\u0CE1\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D28\u0D2A-\u0D39\u0D3D\u0D60-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E3A\u0E40-\u0E4E\u0E81-\u0E82\u0E84\u0E87-\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA-\u0EAB\u0EAD-\u0EB0\u0EB2-\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDD\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8B\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065-\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10D0-\u10FA\u10FC\u1100-\u1159\u115F-\u11A2\u11A8-\u11F9\u1200-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u1676\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F0\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u1900-\u191C\u1950-\u196D\u1970-\u1974\u1980-\u19A9\u19C1-\u19C7\u1A00-\u1A16\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE-\u1BAF\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2010\u2013-\u2016\u2018\u201C-\u201D\u2020-\u2021\u2025-\u2027\u2030\u2032-\u2033\u2035\u203B\u2071\u2074\u207F\u2081-\u2084\u2090-\u2094\u2102-\u2103\u2105\u2107\u2109-\u2113\u2115-\u2116\u2119-\u211D\u2121-\u2122\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2153-\u2154\u215B-\u215E\u2160-\u2188\u2190-\u2199\u21D2\u21D4\u2200\u2202-\u2203\u2207-\u2208\u220B\u220F\u2211\u2215\u221A\u221D-\u2220\u2223\u2225\u2227-\u222C\u222E\u2234-\u2237\u223C-\u223D\u2248\u224C\u2252\u2260-\u2261\u2264-\u2267\u226A-\u226B\u226E-\u226F\u2282-\u2283\u2286-\u2287\u2295\u2299\u22A5\u22BF\u2312\u2460-\u24B5\u24D0-\u24E9\u2500-\u254B\u2550-\u2574\u2581-\u258F\u2592-\u2595\u25A0-\u25A1\u25A3-\u25A9\u25B2-\u25B3\u25B6-\u25B7\u25BC-\u25BD\u25C0-\u25C1\u25C6-\u25C8\u25CB\u25CE-\u25D1\u25E2-\u25E5\u25EF\u2605-\u2606\u2609\u260E-\u260F\u261C\u261E\u2640\u2642\u2660-\u2661\u2663-\u2665\u2667-\u266A\u266C-\u266D\u266F\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2C6F\u2C71-\u2C7D\u2C80-\u2CE4\u2D00-\u2D25\u2D30-\u2D65\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u3000-\u3003\u3005-\u3017\u301D-\u301F\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309B-\u309F\u30A1-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31B7\u31F0-\u321C\u3220-\u3229\u3231-\u3232\u3239\u3260-\u327B\u327F\u32A3-\u32A8\u3303\u330D\u3314\u3318\u3322-\u3323\u3326-\u3327\u332B\u3336\u333B\u3349-\u334A\u334D\u3351\u3357\u337B-\u337E\u3380-\u3384\u3388-\u33CA\u33CD-\u33D3\u33D5-\u33D6\u33D8\u33DB-\u33DD\u3400-\u4DB5\u4E00-\u9FC3\uA000-\uA48C\uA500-\uA60C\uA610-\uA61F\uA62A-\uA62B\uA640-\uA65F\uA662-\uA66E\uA680-\uA697\uA722-\uA787\uA78B-\uA78C\uA7FB-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA90A-\uA925\uA930-\uA946\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAC00-\uD7A3\uE000-\uF848\uF900-\uFA2D\uFA30-\uFA6A\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40-\uFB41\uFB43-\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE30-\uFE31\uFE33-\uFE44\uFE49-\uFE52\uFE54-\uFE57\uFE59-\uFE66\uFE68-\uFE6B\uFE70-\uFE74\uFE76-\uFEFC\uFF01-\uFF5E\uFF61-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC\uFFE0-\uFFE6]",
        str_namedSheetsRange = "\u0001-\u0026\u0028-\u0029\u002B-\u002D\u003B-\u003E\u0040\u005E\u0060\u007B-\u007F\u0082\u0084\u008B\u0092\u0095\u0098\u009B\u00A0\u00A6\u00A9\u00AB-\u00AC\u00AE\u00BB\u0378-\u0379\u037E-\u0383\u0387\u038B\u038D\u03A2\u0524-\u0530\u0557-\u0558\u055A-\u0560\u0588-\u0590\u05BE\u05C0\u05C3\u05C6\u05C8-\u05CF\u05EB-\u05EF\u05F3-\u05FF\u0604-\u0605\u0609-\u060A\u060C-\u060D\u061B-\u061E\u0620\u065F\u066A-\u066D\u06D4\u0700-\u070E\u074B-\u074C\u07B2-\u07BF\u07F7-\u07F9\u07FB-\u0900\u093A-\u093B\u094E-\u094F\u0955-\u0957\u0964-\u0965\u0970\u0973-\u097A\u0980\u0984\u098D-\u098E\u0991-\u0992\u09A9\u09B1\u09B3-\u09B5\u09BA-\u09BB\u09C5-\u09C6\u09C9-\u09CA\u09CF-\u09D6\u09D8-\u09DB\u09DE\u09E4-\u09E5\u09FB-\u0A00\u0A04\u0A0B-\u0A0E\u0A11-\u0A12\u0A29\u0A31\u0A34\u0A37\u0A3A-\u0A3B\u0A3D\u0A43-\u0A46\u0A49-\u0A4A\u0A4E-\u0A50\u0A52-\u0A58\u0A5D\u0A5F-\u0A65\u0A76-\u0A80\u0A84\u0A8E\u0A92\u0AA9\u0AB1\u0AB4\u0ABA-\u0ABB\u0AC6\u0ACA\u0ACE-\u0ACF\u0AD1-\u0ADF\u0AE4-\u0AE5\u0AF0\u0AF2-\u0B00\u0B04\u0B0D-\u0B0E\u0B11-\u0B12\u0B29\u0B31\u0B34\u0B3A-\u0B3B\u0B45-\u0B46\u0B49-\u0B4A\u0B4E-\u0B55\u0B58-\u0B5B\u0B5E\u0B64-\u0B65\u0B72-\u0B81\u0B84\u0B8B-\u0B8D\u0B91\u0B96-\u0B98\u0B9B\u0B9D\u0BA0-\u0BA2\u0BA5-\u0BA7\u0BAB-\u0BAD\u0BBA-\u0BBD\u0BC3-\u0BC5\u0BC9\u0BCE-\u0BCF\u0BD1-\u0BD6\u0BD8-\u0BE5\u0BFB-\u0C00\u0C04\u0C0D\u0C11\u0C29\u0C34\u0C3A-\u0C3C\u0C45\u0C49\u0C4E-\u0C54\u0C57\u0C5A-\u0C5F\u0C64-\u0C65\u0C70-\u0C77\u0C80-\u0C81\u0C84\u0C8D\u0C91\u0CA9\u0CB4\u0CBA-\u0CBB\u0CC5\u0CC9\u0CCE-\u0CD4\u0CD7-\u0CDD\u0CDF\u0CE4-\u0CE5\u0CF0\u0CF3-\u0D01\u0D04\u0D0D\u0D11\u0D29\u0D3A-\u0D3C\u0D45\u0D49\u0D4E-\u0D56\u0D58-\u0D5F\u0D64-\u0D65\u0D76-\u0D78\u0D80-\u0D81\u0D84\u0D97-\u0D99\u0DB2\u0DBC\u0DBE-\u0DBF\u0DC7-\u0DC9\u0DCB-\u0DCE\u0DD5\u0DD7\u0DE0-\u0DF1\u0DF4-\u0E00\u0E3B-\u0E3E\u0E4F\u0E5A-\u0E80\u0E83\u0E85-\u0E86\u0E89\u0E8B-\u0E8C\u0E8E-\u0E93\u0E98\u0EA0\u0EA4\u0EA6\u0EA8-\u0EA9\u0EAC\u0EBA\u0EBE-\u0EBF\u0EC5\u0EC7\u0ECE-\u0ECF\u0EDA-\u0EDB\u0EDE-\u0EFF\u0F04-\u0F12\u0F3A-\u0F3D\u0F48\u0F6D-\u0F70\u0F85\u0F8C-\u0F8F\u0F98\u0FBD\u0FCD\u0FD0-\u0FFF\u104A-\u104F\u109A-\u109D\u10C6-\u10CF\u10FB\u10FD-\u10FF\u115A-\u115E\u11A3-\u11A7\u11FA-\u11FF\u1249\u124E-\u124F\u1257\u1259\u125E-\u125F\u1289\u128E-\u128F\u12B1\u12B6-\u12B7\u12BF\u12C1\u12C6-\u12C7\u12D7\u1311\u1316-\u1317\u135B-\u135E\u1361-\u1368\u137D-\u137F\u139A-\u139F\u13F5-\u1400\u166D-\u166E\u1677-\u167F\u169B-\u169F\u16EB-\u16ED\u16F1-\u16FF\u170D\u1715-\u171F\u1735-\u173F\u1754-\u175F\u176D\u1771\u1774-\u177F\u17D4-\u17D6\u17D8-\u17DA\u17DE-\u17DF\u17EA-\u17EF\u17FA-\u180A\u180F\u181A-\u181F\u1878-\u187F\u18AB-\u18FF\u191D-\u191F\u192C-\u192F\u193C-\u193F\u1941-\u1945\u196E-\u196F\u1975-\u197F\u19AA-\u19AF\u19CA-\u19CF\u19DA-\u19DF\u1A1C-\u1AFF\u1B4C-\u1B4F\u1B5A-\u1B60\u1B7D-\u1B7F\u1BAB-\u1BAD\u1BBA-\u1BFF\u1C38-\u1C3F\u1C4A-\u1C4C\u1C7E-\u1CFF\u1DE7-\u1DFD\u1F16-\u1F17\u1F1E-\u1F1F\u1F46-\u1F47\u1F4E-\u1F4F\u1F58\u1F5A\u1F5C\u1F5E\u1F7E-\u1F7F\u1FB5\u1FC5\u1FD4-\u1FD5\u1FDC\u1FF0-\u1FF1\u1FF5\u1FFF\u2011-\u2012\u2017\u2019-\u201B\u201E-\u201F\u2022-\u2024\u2031\u2034\u2036-\u203A\u203C-\u2043\u2045-\u2051\u2053-\u205E\u2065-\u2069\u2072-\u2073\u207D-\u207E\u208D-\u208F\u2095-\u209F\u20B6-\u20CF\u20F1-\u20FF\u2150-\u2152\u2189-\u218F\u2329-\u232A\u23E8-\u23FF\u2427-\u243F\u244B-\u245F\u269E-\u269F\u26BD-\u26BF\u26C4-\u2700\u2705\u270A-\u270B\u2728\u274C\u274E\u2753-\u2755\u2757\u275F-\u2760\u2768-\u2775\u2795-\u2797\u27B0\u27BF\u27C5-\u27C6\u27CB\u27CD-\u27CF\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC-\u29FD\u2B4D-\u2B4F\u2B55-\u2BFF\u2C2F\u2C5F\u2C70\u2C7E-\u2C7F\u2CEB-\u2CFC\u2CFE-\u2CFF\u2D26-\u2D2F\u2D66-\u2D6E\u2D70-\u2D7F\u2D97-\u2D9F\u2DA7\u2DAF\u2DB7\u2DBF\u2DC7\u2DCF\u2DD7\u2DDF\u2E00-\u2E2E\u2E30-\u2E7F\u2E9A\u2EF4-\u2EFF\u2FD6-\u2FEF\u2FFC-\u2FFF\u3018-\u301C\u3030\u303D\u3040\u3097-\u3098\u30A0\u3100-\u3104\u312E-\u3130\u318F\u31B8-\u31BF\u31E4-\u31EF\u321F\u3244-\u324F\u32FF\u4DB6-\u4DBF\u9FC4-\u9FFF\uA48D-\uA48F\uA4C7-\uA4FF\uA60D-\uA60F\uA62C-\uA63F\uA660-\uA661\uA673-\uA67B\uA67E\uA698-\uA6FF\uA78D-\uA7FA\uA82C-\uA83F\uA874-\uA87F\uA8C5-\uA8CF\uA8DA-\uA8FF\uA92F\uA954-\uA9FF\uAA37-\uAA3F\uAA4E-\uAA4F\uAA5A-\uABFF\uD7A4-\uD7FF\uFA2E-\uFA2F\uFA6B-\uFA6F\uFADA-\uFAFF\uFB07-\uFB12\uFB18-\uFB1C\uFB37\uFB3D\uFB3F\uFB42\uFB45\uFBB2-\uFBD2\uFD3E-\uFD4F\uFD90-\uFD91\uFDC8-\uFDEF\uFDFE-\uFDFF\uFE10-\uFE1F\uFE27-\uFE2F\uFE32\uFE45-\uFE48\uFE53\uFE58\uFE67\uFE6C-\uFE6F\uFE75\uFEFD-\uFEFE\uFF00\uFF5F-\uFF60\uFFBF-\uFFC1\uFFC8-\uFFC9\uFFD0-\uFFD1\uFFD8-\uFFD9\uFFDD-\uFFDF\uFFE7\uFFEF-\uFFF8\uFFFE-\uFFFF",
        str_operator = ",\\s-+/^&%<=>",
        str_excludeCharts = "'*\\[\\]\\:/?";

    this.regExp_namedRanges = new RegExp(str_namedRanges,"i");
    this.regExp_namedSheetsRange = new RegExp("["+str_namedSheetsRange+"]","ig");
//    /[-+*\/^&%<=>:]/,
    this.regExp_strOperator = new RegExp("["+str_operator+"]","ig");
    this.regExp_strExcludeCharts = new RegExp("["+str_excludeCharts+"]","ig");

    this.test = function(str){
        var ch1 = str.substr(0,1);

        this.regExp_strExcludeCharts.lastIndex = 0;
        this.regExp_namedRanges.lastIndex = 0;
        this.regExp_namedSheetsRange.lastIndex = 0;
        this.regExp_strOperator.lastIndex = 0;

        if( this.regExp_strExcludeCharts.test(str) ){//если содержутся недопустимые символы.
            return undefined;
        }

        if( !this.regExp_namedRanges.test(ch1) ){//если первый символ находится не в str_namedRanges, то однозначно надо экранировать
            return false;
        }
        else{
            if( this.regExp_namedSheetsRange.test( str ) || this.regExp_strOperator.test(str) ){//первый символ допустимый. проверяем всю строку на наличие символов, с которыми необходимо экранировать
                return false;
            }
            //проверка на то, что название листа не совпадает с допустимым адресом ячейки, как в A1 так и RC стилях.
            var match = str.match( rx_ref );
            if (match != null) {
                var m1 = match[1], m2 = match[2];
                if ( match.length >= 3 && g_oCellAddressUtils.colstrToColnum( m1.substr( 0, (m1.length - m2.length) ) ) <= AscCommon.gc_nMaxCol && parseInt( m2 ) <= AscCommon.gc_nMaxRow ) {
                    return false;
                }
            }
            return true;
        }
    };

    return this;

}

function test_defName(){
    var nameRangeRE = new RegExp("(^(["+str_namedRanges+"_])(["+str_namedRanges+"_0-9]*)$)","i" );

    this.test = function(str){
        var match, m1, m2;
        if( !nameRangeRE.test(str) ){
            return false;
        }

        match = str.match( rx_ref );
        if (match != null) {
            m1 = match[1];
            m2 = match[2];
            if ( match.length >= 3 && g_oCellAddressUtils.colstrToColnum( m1.substr( 0, (m1.length - m2.length) ) ) <= AscCommon.gc_nMaxCol && parseInt( m2 ) <= AscCommon.gc_nMaxRow ) {
                return false;
            }
        }

        return true;
    };

    return this;
}

  var cStrucTableReservedWords = {
    all: "#All", data: "#Data", headers: "#Headers", totals: "#Totals", thisrow: "#This Row", at: "@"
  };
  var FormulaTablePartInfo = {
    all: 1,
    data: 2,
    headers: 3,
    totals: 4,
    thisRow: 5,
    columns: 6
  };
  
var cStrucTableLocalColumns = null,
	cBoolLocal = {},
	cErrorOrigin = {"nil":"#NULL!","div":"#DIV\/0!","value":"#VALUE!","ref":"#REF!","name":"#NAME\\?","num":"#NUM!","na":"#N\/A","getdata":"#GETTING_DATA","uf":"#UNSUPPORTED_FUNCTION!"},
	cErrorLocal = {};

function build_local_rx(data){
	build_rx_table_local(data?data["StructureTables"]:null);
    build_rx_bool_local(data?data["CONST_TRUE_FALSE"]:null);
    build_rx_error_local(data?data["CONST_ERROR"]:null);

}

function build_rx_table_local(local){
	rx_table_local = build_rx_table(local);
}
function build_rx_table(local){
  cStrucTableLocalColumns = ( local ? local : {"h": "Headers", "d": "Data", "a": "All", "tr": "This row", "t": "Totals"} );
    var loc_all = cStrucTableLocalColumns['a'],
        loc_headers = cStrucTableLocalColumns['h'],
        loc_data = cStrucTableLocalColumns['d'],
        loc_totals = cStrucTableLocalColumns['t'],
        loc_this_row = cStrucTableLocalColumns['tr'],
        structured_tables_headata = new XRegExp('(?:\\[\\#'+loc_headers+'\\]\\,\\[\\#'+loc_data+'\\])'),
        structured_tables_datals = new XRegExp('(?:\\[\\#'+loc_data+'\\]\\,\\[\\#'+loc_totals+'\\])' ),
        structured_tables_userColumn = new XRegExp('(?:[' + str_namedRanges + '\\d.]|\\u0027[#\\[\\]\\u0027]|\\u0020)+'),
        structured_tables_reservedColumn = new XRegExp('\\#(?:'+loc_all+'|'+loc_headers+'|'+loc_totals+'|'+loc_data+'|'+loc_this_row+')|@');

	return XRegExp.build( '^(?<tableName>{{tableName}})\\[(?<columnName>{{columnName}})?\\]', {
        "tableName" : new XRegExp( "^(:?[" + str_namedRanges + "][" + str_namedRanges + "\\d.]*)" ),
        "columnName": XRegExp.build( '(?<reservedColumn>{{reservedColumn}})|(?<oneColumn>{{userColumn}})|(?<columnRange>{{userColumnRange}})|(?<hdtcc>{{hdtcc}})', {
            "userColumn"     : structured_tables_userColumn,
            "reservedColumn" : structured_tables_reservedColumn,
            "userColumnRange": XRegExp.build( '\\[(?<colStart>{{uc}})\\]\\:\\[(?<colEnd>{{uc}})\\]', {
                "uc": structured_tables_userColumn
            } ),
            "hdtcc"          : XRegExp.build( '(?<hdt>\\[{{rc}}\\]|{{hd}}|{{dt}})(?:\\,(?:\\[(?<hdtcstart>{{uc}})\\])(?:\\:(?:\\[(?<hdtcend>{{uc}})\\]))?)?', {
                "rc": structured_tables_reservedColumn,
				"hd": structured_tables_headata,
				"dt": structured_tables_datals,
				"uc": structured_tables_userColumn
            } )
        } )
    }, 'i' );
}
function build_rx_bool_local(local){
	rx_bool_local = build_rx_bool(local);
}
function build_rx_bool(local){
  // ToDo переделать на более правильную реализацию. Не особо правильное копирование
  local = local ? local : {"t":"TRUE","f":"FALSE"};
  var t = cBoolLocal['t'] = local['t'];
  var f = cBoolLocal['f'] = local['f'];

	build_rx_array_local(local);
	return new RegExp( "^("+t+"|"+f+")([-+*\\/^&%<=>: ;),]|$)","i" );
}

function build_rx_error_local(local){
	rx_error_local = build_rx_error(local);
}
function build_rx_error(local){
  // ToDo переделать на более правильную реализацию. Не особо правильное копирование
  local = local ? local : {"nil":"#NULL!","div":"#DIV\/0!","value":"#VALUE!","ref":"#REF!","name":"#NAME\\?","num":"#NUM!","na":"#N\/A","getdata":"#GETTING_DATA","uf":"#UNSUPPORTED_FUNCTION!"};
	cErrorLocal['nil'] = local['nil'];
  cErrorLocal['div'] = local['div'];
  cErrorLocal['value'] = local['value'];
  cErrorLocal['ref'] = local['ref'];
  cErrorLocal['name'] = local['name'];
  cErrorLocal['num'] = local['num'];
  cErrorLocal['na'] = local['na'];
  cErrorLocal['getdata'] = local['getdata'];
  cErrorLocal['uf'] = local['uf'];

	return new RegExp( "^(" + 	cErrorLocal["nil"] 		+ "|" +
								cErrorLocal["div"] 		+ "|" +
								cErrorLocal["value"] 	+ "|" +
								cErrorLocal["ref"] 		+ "|" +
								cErrorLocal["name"] 	+ "|" +
								cErrorLocal["num"] 		+ "|" +
								cErrorLocal["na"] 		+ "|" +
								cErrorLocal["getdata"] 	+ "|" +
								cErrorLocal["uf"] 		+ ")", "i" );
}

function build_rx_array_local(localBool, digitSepar, localError){
	var localBool = ( localBool ? localBool : {"t":"TRUE","f":"FALSE"} );
	rx_array_local = build_rx_array(localBool, digitSepar, localError);
}
function build_rx_array(localBool, digitSepar, localError){
	return new RegExp("^\\{(([+-]?\\d*(\\d|\\"+digitSepar+")\\d*([eE][+-]?\\d+)?)?(\"((\"\"|[^\"])*)\")?"+
			          "(#NULL!|#DIV\/0!|#VALUE!|#REF!|#NAME\\?|#NUM!|#UNSUPPORTED_FUNCTION!|#N\/A|#GETTING_DATA|"+
			          localBool["t"]+"|"+localBool["f"]+")?["+FormulaSeparators.arrayRowSeparator+"\\"+FormulaSeparators.arrayColSeparator +"]?)*\\}","i");

}

var PostMessageType = {
    UploadImage:0,
    ExtensionExist:1
};

var c_oAscServerError = {
    NoError:0,
    Unknown:-1,
    ReadRequestStream:-3,

    TaskQueue:-20,

    TaskResult:-40,

    Storage:-60,
    StorageFileNoFound:-61,
    StorageRead:-62,
    StorageWrite:-63,
    StorageRemoveDir:-64,
    StorageCreateDir:-65,
    StorageGetInfo:-66,

    Convert:-80,
    ConvertDownload:-81,
    ConvertUnknownFormat:-82,
    ConvertTimeout:-83,
    ConvertReadFile:-84,
    ConvertMS_OFFCRYPTO:-85,

    Upload:-100,
    UploadContentLength:-101,
    UploadExtension:-102,
    UploadCountFiles:-103,

    VKey:-120,
    VKeyEncrypt:-121,
    VKeyKeyExpire:-122,
    VKeyUserCountExceed:-123
};

var c_oAscImageUploadProp = {//Не все браузеры позволяют получить информацию о файле до загрузки(например ie9), меняя параметры здесь надо поменять аналогичные параметры в web.common
    MaxFileSize:25000000, //25 mb
    SupportedFormats:[ "jpg", "jpeg", "jpe", "png", "gif", "bmp"]
};

/**
 *
 * @param sName
 * @returns {*}
 * @constructor
 */
function GetFileExtension (sName) {
	var nIndex = sName ? sName.lastIndexOf(".") : -1;
	if (-1 != nIndex)
		return sName.substring(nIndex + 1).toLowerCase();
	return null;
}
function changeFileExtention (sName, sNewExt) {
  var sOldExt = GetFileExtension(sName);
  if(sOldExt) {
    return sName.substring(0, sName.length - sOldExt.length) + sNewExt;
  } else {
    return sName + '.' + sNewExt;
  }
}
function getExtentionByFormat (format) {
  switch(format) {
    case c_oAscFileType.PDF: return 'pdf'; break;
    case c_oAscFileType.HTML: return 'html'; break;
    // Word
    case c_oAscFileType.DOCX: return 'docx'; break;
    case c_oAscFileType.DOC: return 'doc'; break;
    case c_oAscFileType.ODT: return 'odt'; break;
    case c_oAscFileType.RTF: return 'rtf'; break;
    case c_oAscFileType.TXT: return 'txt'; break;
    case c_oAscFileType.MHT: return 'mht'; break;
    case c_oAscFileType.EPUB: return 'epub'; break;
    case c_oAscFileType.FB2: return 'fb2'; break;
    case c_oAscFileType.MOBI: return 'mobi'; break;
    case c_oAscFileType.DOCY: return 'doct'; break;
    case c_oAscFileType.JSON: return 'json'; break;
    // Excel
    case c_oAscFileType.XLSX: return 'xlsx'; break;
    case c_oAscFileType.XLS: return 'xls'; break;
    case c_oAscFileType.ODS: return 'ods'; break;
    case c_oAscFileType.CSV: return 'csv'; break;
    case c_oAscFileType.XLSY: return 'xlst'; break;
    // PowerPoint
    case c_oAscFileType.PPTX: return 'pptx'; break;
    case c_oAscFileType.PPT: return 'ppt'; break;
    case c_oAscFileType.ODP: return 'odp'; break;
  }
  return '';
}
function InitOnMessage (callback) {
	if (window.addEventListener) {
		window.addEventListener("message", function (event) {
			if (null != event && null != event.data) {
				try {
					var data = JSON.parse(event.data);
					if (null != data && null != data["type"] && PostMessageType.UploadImage == data["type"]) {
						if (c_oAscServerError.NoError == data["error"]) {
							var urls = data["urls"];
							if (urls) {
								g_oDocumentUrls.addUrls(urls);
								var firstUrl;
								for (var i in urls) {
									if (urls.hasOwnProperty(i)) {
										firstUrl = urls[i];
										break;
									}
								}
								callback(Asc.c_oAscError.ID.No, firstUrl);
							}

						} else
							callback(mapAscServerErrorToAscError(data["error"]));
					}
				} catch (err) {
				}
			}
		}, false);
	}
}
function ShowImageFileDialog (documentId, documentUserId, callback, callbackOld) {
	var fileName;
	if ("undefined" != typeof(FileReader)) {
		fileName = GetUploadInput(function (e) {
			if (e && e.target && e.target.files) {
				var nError = ValidateUploadImage(e.target.files);
				callback(mapAscServerErrorToAscError(nError), e.target.files);
			} else {
				callback(Asc.c_oAscError.ID.Unknown);
			}
		});
	} else {
		var frameWindow = GetUploadIFrame();
		var content = '<html><head></head><body><form action="'+sUploadServiceLocalUrlOld+'/'+documentId+'/'+documentUserId+'/'+g_oDocumentUrls.getMaxIndex()+'" method="POST" enctype="multipart/form-data"><input id="apiiuFile" name="apiiuFile" type="file" accept="image/*" size="1"><input id="apiiuSubmit" name="apiiuSubmit" type="submit" style="display:none;"></form></body></html>';
		frameWindow.document.open();
		frameWindow.document.write(content);
		frameWindow.document.close();

		fileName = frameWindow.document.getElementById("apiiuFile");
		var fileSubmit = frameWindow.document.getElementById("apiiuSubmit");

		fileName.onchange = function (e) {
			if (e && e.target && e.target.files) {
				var nError = ValidateUploadImage(e.target.files);
				if (c_oAscServerError.NoError != nError) {
					callbackOld(mapAscServerErrorToAscError(nError));
					return;
				}
			}
			callbackOld(Asc.c_oAscError.ID.No);
			fileSubmit.click();
		};
	}

	//todo пересмотреть opera
	if (AscBrowser.isOpera)
		setTimeout( function(){fileName.click();}, 0);
	else
		fileName.click();
}
function InitDragAndDrop (oHtmlElement, callback) {
	if ("undefined" != typeof(FileReader) && null != oHtmlElement) {
		oHtmlElement["ondragover"] = function (e) {
			e.preventDefault();
			e.dataTransfer.dropEffect = CanDropFiles(e) ? 'copy' : 'none';
			return false;
		};
		oHtmlElement["ondrop"] = function (e) {
			e.preventDefault();
			var files = e.dataTransfer.files;
			var nError = ValidateUploadImage(files);
			callback(mapAscServerErrorToAscError(nError), files);
		};
	}
}
function UploadImageFiles (files, documentId, documentUserId, callback) {
	if (files.length > 0) {
		var file = files[0];
		var xhr = new XMLHttpRequest();
		xhr.open('POST', sUploadServiceLocalUrl + '/' + documentId + '/' + documentUserId + '/' + g_oDocumentUrls.getMaxIndex(), true);
		xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream');
		xhr.onreadystatechange = function() {
			if (4 == this.readyState) {
				if((this.status == 200 || this.status == 1223)) {
					var urls = JSON.parse(this.responseText);
					g_oDocumentUrls.addUrls(urls);
					var firstUrl;
					for (var i in urls) {
						if (urls.hasOwnProperty(i)) {
							firstUrl = urls[i];
							break;
						}
					}
					callback(Asc.c_oAscError.ID.No, firstUrl);
				} else
					callback(Asc.c_oAscError.ID.Unknown);
			}
		};
		xhr.send(file);
	} else {
		callback(Asc.c_oAscError.ID.Unknown);
	}
}
function ValidateUploadImage( files ) {
	var nRes = c_oAscServerError.NoError;
	if (files.length > 0) {
		for (var i = 0, length = files.length; i < length; i++) {
			var file = files[i];
			//проверяем расширение файла
			var sName = file.fileName || file.name;
			if (sName) {
				var bSupported = false;
				var ext = GetFileExtension(sName);
				if (null !== ext) {
					for (var j = 0, length2 = c_oAscImageUploadProp.SupportedFormats.length; j < length2; j++) {
						if (c_oAscImageUploadProp.SupportedFormats[j] == ext) {
							bSupported = true;
							break;
						}
					}
				}
				if (false == bSupported)
					nRes = c_oAscServerError.UploadExtension;
			}
			if (Asc.c_oAscError.ID.No == nRes) {
				var nSize = file.fileSize || file.size;
				if (nSize && c_oAscImageUploadProp.MaxFileSize < nSize)
					nRes = c_oAscServerError.UploadContentLength;
			}
			if (c_oAscServerError.NoError != nRes)
				break;
		}
	} else
		nRes = c_oAscServerError.UploadCountFiles;
	return nRes;
}
function CanDropFiles( event ) {
    var bRes = false;
    if ( event.dataTransfer.types ) {
        for ( var i = 0, length = event.dataTransfer.types.length; i < length; ++i ) {
            var type = event.dataTransfer.types[i];
            if ( type == "Files" ) {
                if ( event.dataTransfer.items ) {
                    for ( var j = 0, length2 = event.dataTransfer.items.length; j < length2; j++ ) {
                        var item = event.dataTransfer.items[j];
                        if ( item.type && item.kind && "file" == item.kind.toLowerCase() ) {
                            bRes = false;
                            for ( var k = 0, length3 = c_oAscImageUploadProp.SupportedFormats.length; k < length3; k++ ) {
                                if ( -1 != item.type.indexOf( c_oAscImageUploadProp.SupportedFormats[k] ) ) {
                                    bRes = true;
                                    break;
                                }
                            }
                            if ( false == bRes )
                                break;
                        }
                    }
                }
                else
                    bRes = true;
                break;
            }
        }
    }
    return bRes;
}
function GetUploadIFrame() {
    var sIFrameName = "apiImageUpload";
    var oImageUploader = document.getElementById( sIFrameName );
    if ( !oImageUploader ) {
        var frame = document.createElement( "iframe" );
        frame.name = sIFrameName;
        frame.id = sIFrameName;
        frame.setAttribute( "style", "position:absolute;left:-2px;top:-2px;width:1px;height:1px;z-index:-1000;" );
        document.body.appendChild( frame );
    }
    return window.frames[sIFrameName];
}
function GetUploadInput(onchange) {
    var inputName = 'apiiuFile';
    var input = document.getElementById( inputName );
    //удаляем чтобы очистить input от предыдущего ввода
    if (input) {
        document.body.removeChild(input);
    }
    input = document.createElement("input");
    input.setAttribute('id', inputName);
    input.setAttribute('name', inputName);
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.setAttribute('style', 'position:absolute;left:-2px;top:-2px;width:1px;height:1px;z-index:-1000;');
    input.onchange = onchange;
    document.body.appendChild( input );
    return input;
}

  var FormulaSeparators = {
    arrayRowSeparatorDef : ';',
    arrayColSeparatorDef : ',',
    digitSeparatorDef : '.',
    functionArgumentSeparatorDef: ',',
    arrayRowSeparator : ';',
    arrayColSeparator : ',',
    digitSeparator : '.',
    functionArgumentSeparator : ','
  };

var g_oCodeSpace = 32; // Code of space
var g_arrCodeOperators = [37, 38, 42, 43, 45, 47, 58, 94]; // Code of operators [%, &, *, +, -, /, :, ^]
var g_oStartCodeOperatorsCompare = 60; // Start code of operators <=>
var g_oEndCodeOperatorsCompare = 62; // End code of operators <=>
var g_oCodeLeftParentheses = 40; // Code of (
var g_oCodeRightParentheses = 41; // Code of )
var g_oCodeLeftBrace = 123; // Code of )
var g_oCodeRightBrace = 125; // Code of )

/*Functions that checks of an element in formula*/
var str_namedRanges = "A-Za-z\u005F\u0080-\u0081\u0083\u0085-\u0087\u0089-\u008A\u008C-\u0091\u0093-\u0094\u0096-\u0097\u0099-\u009A\u009C-\u009F\u00A1-\u00A5\u00A7-\u00A8\u00AA\u00AD\u00AF-\u00BA\u00BC-\u02B8\u02BB-\u02C1\u02C7\u02C9-\u02CB\u02CD\u02D0-\u02D1\u02D8-\u02DB\u02DD\u02E0-\u02E4\u02EE\u0370-\u0373\u0376-\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u0523\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0621-\u064A\u066E-\u066F\u0671-\u06D3\u06D5\u06E5-\u06E6\u06EE-\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4-\u07F5\u07FA\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0972\u097B-\u097F\u0985-\u098C\u098F-\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC-\u09DD\u09DF-\u09E1\u09F0-\u09F1\u0A05-\u0A0A\u0A0F-\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32-\u0A33\u0A35-\u0A36\u0A38-\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2-\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0-\u0AE1\u0B05-\u0B0C\u0B0F-\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32-\u0B33\u0B35-\u0B39\u0B3D\u0B5C-\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99-\u0B9A\u0B9C\u0B9E-\u0B9F\u0BA3-\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D\u0C58-\u0C59\u0C60-\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0-\u0CE1\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D28\u0D2A-\u0D39\u0D3D\u0D60-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E3A\u0E40-\u0E4E\u0E81-\u0E82\u0E84\u0E87-\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA-\u0EAB\u0EAD-\u0EB0\u0EB2-\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDD\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8B\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065-\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10D0-\u10FA\u10FC\u1100-\u1159\u115F-\u11A2\u11A8-\u11F9\u1200-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u1676\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F0\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u1900-\u191C\u1950-\u196D\u1970-\u1974\u1980-\u19A9\u19C1-\u19C7\u1A00-\u1A16\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE-\u1BAF\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u200e\u2010\u2013-\u2016\u2018\u201C-\u201D\u2020-\u2021\u2025-\u2027\u2030\u2032-\u2033\u2035\u203B\u2071\u2074\u207F\u2081-\u2084\u2090-\u2094\u2102-\u2103\u2105\u2107\u2109-\u2113\u2115-\u2116\u2119-\u211D\u2121-\u2122\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2153-\u2154\u215B-\u215E\u2160-\u2188\u2190-\u2199\u21D2\u21D4\u2200\u2202-\u2203\u2207-\u2208\u220B\u220F\u2211\u2215\u221A\u221D-\u2220\u2223\u2225\u2227-\u222C\u222E\u2234-\u2237\u223C-\u223D\u2248\u224C\u2252\u2260-\u2261\u2264-\u2267\u226A-\u226B\u226E-\u226F\u2282-\u2283\u2286-\u2287\u2295\u2299\u22A5\u22BF\u2312\u2460-\u24B5\u24D0-\u24E9\u2500-\u254B\u2550-\u2574\u2581-\u258F\u2592-\u2595\u25A0-\u25A1\u25A3-\u25A9\u25B2-\u25B3\u25B6-\u25B7\u25BC-\u25BD\u25C0-\u25C1\u25C6-\u25C8\u25CB\u25CE-\u25D1\u25E2-\u25E5\u25EF\u2605-\u2606\u2609\u260E-\u260F\u261C\u261E\u2640\u2642\u2660-\u2661\u2663-\u2665\u2667-\u266A\u266C-\u266D\u266F\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2C6F\u2C71-\u2C7D\u2C80-\u2CE4\u2D00-\u2D25\u2D30-\u2D65\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u3000-\u3003\u3005-\u3017\u301D-\u301F\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309B-\u309F\u30A1-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31B7\u31F0-\u321C\u3220-\u3229\u3231-\u3232\u3239\u3260-\u327B\u327F\u32A3-\u32A8\u3303\u330D\u3314\u3318\u3322-\u3323\u3326-\u3327\u332B\u3336\u333B\u3349-\u334A\u334D\u3351\u3357\u337B-\u337E\u3380-\u3384\u3388-\u33CA\u33CD-\u33D3\u33D5-\u33D6\u33D8\u33DB-\u33DD\u3400-\u4DB5\u4E00-\u9FC3\uA000-\uA48C\uA500-\uA60C\uA610-\uA61F\uA62A-\uA62B\uA640-\uA65F\uA662-\uA66E\uA680-\uA697\uA722-\uA787\uA78B-\uA78C\uA7FB-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA90A-\uA925\uA930-\uA946\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAC00-\uD7A3\uE000-\uF848\uF900-\uFA2D\uFA30-\uFA6A\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40-\uFB41\uFB43-\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE30-\uFE31\uFE33-\uFE44\uFE49-\uFE52\uFE54-\uFE57\uFE59-\uFE66\uFE68-\uFE6B\uFE70-\uFE74\uFE76-\uFEFC\uFF01-\uFF5E\uFF61-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC\uFFE0-\uFFE6",
    str_namedSheetsRange = "\u0001-\u0026\u0028-\u0029\u002B-\u002D\u003B-\u003E\u0040\u005E\u0060\u007B-\u007F\u0082\u0084\u008B\u0092\u0095\u0098\u009B\u00A0\u00A6\u00A9\u00AB-\u00AC\u00AE\u00BB\u0378-\u0379\u037E-\u0383\u0387\u038B\u038D\u03A2\u0524-\u0530\u0557-\u0558\u055A-\u0560\u0588-\u0590\u05BE\u05C0\u05C3\u05C6\u05C8-\u05CF\u05EB-\u05EF\u05F3-\u05FF\u0604-\u0605\u0609-\u060A\u060C-\u060D\u061B-\u061E\u0620\u065F\u066A-\u066D\u06D4\u0700-\u070E\u074B-\u074C\u07B2-\u07BF\u07F7-\u07F9\u07FB-\u0900\u093A-\u093B\u094E-\u094F\u0955-\u0957\u0964-\u0965\u0970\u0973-\u097A\u0980\u0984\u098D-\u098E\u0991-\u0992\u09A9\u09B1\u09B3-\u09B5\u09BA-\u09BB\u09C5-\u09C6\u09C9-\u09CA\u09CF-\u09D6\u09D8-\u09DB\u09DE\u09E4-\u09E5\u09FB-\u0A00\u0A04\u0A0B-\u0A0E\u0A11-\u0A12\u0A29\u0A31\u0A34\u0A37\u0A3A-\u0A3B\u0A3D\u0A43-\u0A46\u0A49-\u0A4A\u0A4E-\u0A50\u0A52-\u0A58\u0A5D\u0A5F-\u0A65\u0A76-\u0A80\u0A84\u0A8E\u0A92\u0AA9\u0AB1\u0AB4\u0ABA-\u0ABB\u0AC6\u0ACA\u0ACE-\u0ACF\u0AD1-\u0ADF\u0AE4-\u0AE5\u0AF0\u0AF2-\u0B00\u0B04\u0B0D-\u0B0E\u0B11-\u0B12\u0B29\u0B31\u0B34\u0B3A-\u0B3B\u0B45-\u0B46\u0B49-\u0B4A\u0B4E-\u0B55\u0B58-\u0B5B\u0B5E\u0B64-\u0B65\u0B72-\u0B81\u0B84\u0B8B-\u0B8D\u0B91\u0B96-\u0B98\u0B9B\u0B9D\u0BA0-\u0BA2\u0BA5-\u0BA7\u0BAB-\u0BAD\u0BBA-\u0BBD\u0BC3-\u0BC5\u0BC9\u0BCE-\u0BCF\u0BD1-\u0BD6\u0BD8-\u0BE5\u0BFB-\u0C00\u0C04\u0C0D\u0C11\u0C29\u0C34\u0C3A-\u0C3C\u0C45\u0C49\u0C4E-\u0C54\u0C57\u0C5A-\u0C5F\u0C64-\u0C65\u0C70-\u0C77\u0C80-\u0C81\u0C84\u0C8D\u0C91\u0CA9\u0CB4\u0CBA-\u0CBB\u0CC5\u0CC9\u0CCE-\u0CD4\u0CD7-\u0CDD\u0CDF\u0CE4-\u0CE5\u0CF0\u0CF3-\u0D01\u0D04\u0D0D\u0D11\u0D29\u0D3A-\u0D3C\u0D45\u0D49\u0D4E-\u0D56\u0D58-\u0D5F\u0D64-\u0D65\u0D76-\u0D78\u0D80-\u0D81\u0D84\u0D97-\u0D99\u0DB2\u0DBC\u0DBE-\u0DBF\u0DC7-\u0DC9\u0DCB-\u0DCE\u0DD5\u0DD7\u0DE0-\u0DF1\u0DF4-\u0E00\u0E3B-\u0E3E\u0E4F\u0E5A-\u0E80\u0E83\u0E85-\u0E86\u0E89\u0E8B-\u0E8C\u0E8E-\u0E93\u0E98\u0EA0\u0EA4\u0EA6\u0EA8-\u0EA9\u0EAC\u0EBA\u0EBE-\u0EBF\u0EC5\u0EC7\u0ECE-\u0ECF\u0EDA-\u0EDB\u0EDE-\u0EFF\u0F04-\u0F12\u0F3A-\u0F3D\u0F48\u0F6D-\u0F70\u0F85\u0F8C-\u0F8F\u0F98\u0FBD\u0FCD\u0FD0-\u0FFF\u104A-\u104F\u109A-\u109D\u10C6-\u10CF\u10FB\u10FD-\u10FF\u115A-\u115E\u11A3-\u11A7\u11FA-\u11FF\u1249\u124E-\u124F\u1257\u1259\u125E-\u125F\u1289\u128E-\u128F\u12B1\u12B6-\u12B7\u12BF\u12C1\u12C6-\u12C7\u12D7\u1311\u1316-\u1317\u135B-\u135E\u1361-\u1368\u137D-\u137F\u139A-\u139F\u13F5-\u1400\u166D-\u166E\u1677-\u167F\u169B-\u169F\u16EB-\u16ED\u16F1-\u16FF\u170D\u1715-\u171F\u1735-\u173F\u1754-\u175F\u176D\u1771\u1774-\u177F\u17D4-\u17D6\u17D8-\u17DA\u17DE-\u17DF\u17EA-\u17EF\u17FA-\u180A\u180F\u181A-\u181F\u1878-\u187F\u18AB-\u18FF\u191D-\u191F\u192C-\u192F\u193C-\u193F\u1941-\u1945\u196E-\u196F\u1975-\u197F\u19AA-\u19AF\u19CA-\u19CF\u19DA-\u19DF\u1A1C-\u1AFF\u1B4C-\u1B4F\u1B5A-\u1B60\u1B7D-\u1B7F\u1BAB-\u1BAD\u1BBA-\u1BFF\u1C38-\u1C3F\u1C4A-\u1C4C\u1C7E-\u1CFF\u1DE7-\u1DFD\u1F16-\u1F17\u1F1E-\u1F1F\u1F46-\u1F47\u1F4E-\u1F4F\u1F58\u1F5A\u1F5C\u1F5E\u1F7E-\u1F7F\u1FB5\u1FC5\u1FD4-\u1FD5\u1FDC\u1FF0-\u1FF1\u1FF5\u1FFF\u200e\u2011-\u2012\u2017\u2019-\u201B\u201E-\u201F\u2022-\u2024\u2031\u2034\u2036-\u203A\u203C-\u2043\u2045-\u2051\u2053-\u205E\u2065-\u2069\u2072-\u2073\u207D-\u207E\u208D-\u208F\u2095-\u209F\u20B6-\u20CF\u20F1-\u20FF\u2150-\u2152\u2189-\u218F\u2329-\u232A\u23E8-\u23FF\u2427-\u243F\u244B-\u245F\u269E-\u269F\u26BD-\u26BF\u26C4-\u2700\u2705\u270A-\u270B\u2728\u274C\u274E\u2753-\u2755\u2757\u275F-\u2760\u2768-\u2775\u2795-\u2797\u27B0\u27BF\u27C5-\u27C6\u27CB\u27CD-\u27CF\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC-\u29FD\u2B4D-\u2B4F\u2B55-\u2BFF\u2C2F\u2C5F\u2C70\u2C7E-\u2C7F\u2CEB-\u2CFC\u2CFE-\u2CFF\u2D26-\u2D2F\u2D66-\u2D6E\u2D70-\u2D7F\u2D97-\u2D9F\u2DA7\u2DAF\u2DB7\u2DBF\u2DC7\u2DCF\u2DD7\u2DDF\u2E00-\u2E2E\u2E30-\u2E7F\u2E9A\u2EF4-\u2EFF\u2FD6-\u2FEF\u2FFC-\u2FFF\u3018-\u301C\u3030\u303D\u3040\u3097-\u3098\u30A0\u3100-\u3104\u312E-\u3130\u318F\u31B8-\u31BF\u31E4-\u31EF\u321F\u3244-\u324F\u32FF\u4DB6-\u4DBF\u9FC4-\u9FFF\uA48D-\uA48F\uA4C7-\uA4FF\uA60D-\uA60F\uA62C-\uA63F\uA660-\uA661\uA673-\uA67B\uA67E\uA698-\uA6FF\uA78D-\uA7FA\uA82C-\uA83F\uA874-\uA87F\uA8C5-\uA8CF\uA8DA-\uA8FF\uA92F\uA954-\uA9FF\uAA37-\uAA3F\uAA4E-\uAA4F\uAA5A-\uABFF\uD7A4-\uD7FF\uFA2E-\uFA2F\uFA6B-\uFA6F\uFADA-\uFAFF\uFB07-\uFB12\uFB18-\uFB1C\uFB37\uFB3D\uFB3F\uFB42\uFB45\uFBB2-\uFBD2\uFD3E-\uFD4F\uFD90-\uFD91\uFDC8-\uFDEF\uFDFE-\uFDFF\uFE10-\uFE1F\uFE27-\uFE2F\uFE32\uFE45-\uFE48\uFE53\uFE58\uFE67\uFE6C-\uFE6F\uFE75\uFEFD-\uFEFE\uFF00\uFF5F-\uFF60\uFFBF-\uFFC1\uFFC8-\uFFC9\uFFD0-\uFFD1\uFFD8-\uFFD9\uFFDD-\uFFDF\uFFE7\uFFEF-\uFFF8\uFFFE-\uFFFF",
    rx_operators = /^ *[-+*\/^&%<=>:] */,
    rx_Lt = /^ *< */,
    rx_Le = /^ *<= */,
    rx_Gt = /^ *> */,
    rx_Ge = /^ *>= */,
    rx_Ne = /^ *<> */,
    rg = new XRegExp( "^((?:_xlfn.)?[\\p{L}\\d.]+ *)[-+*/^&%<=>:;\\(\\)]" ),
    rgRange = /^(\$?[A-Za-z]+\$?\d+:\$?[A-Za-z]+\$?\d+)(?:[-+*\/^&%<=>: ;),]|$)/,
    rgCols = /^(\$?[A-Za-z]+:\$?[A-Za-z]+)(?:[-+*\/^&%<=>: ;),]|$)/,
    rgRows = /^(\$?\d+:\$?\d+)(?:[-+*\/^&%<=>: ;),]|$)/,
    rx_ref = /^ *(\$?[A-Za-z]{1,3}\$?(\d{1,7}))([-+*\/^&%<=>: ;),]|$)/,
    rx_refAll = /^(\$?[A-Za-z]+\$?(\d+))([-+*\/^&%<=>: ;),]|$)/,
    rx_ref3D_non_quoted = new XRegExp( "^(?<name_from>["+str_namedRanges+"]["+str_namedRanges+"\\d.]*)(:(?<name_to>["+str_namedRanges+"]["+str_namedRanges+"\\d.]*))?!","i" ),
    rx_ref3D_quoted = new XRegExp( "^'(?<name_from>(?:''|[^\\[\\]'\\/*?:])*)(?::(?<name_to>(?:''|[^\\[\\]'\\/*?:])*))?'!" ),
    rx_ref3D = new XRegExp( "^(?<name_from>[^:]+)(:(?<name_to>[^:]+))?!" ),
    rx_before_operators = /^ *[,()]/,
    rx_number = /^ *[+-]?\d*(\d|\.)\d*([eE][+-]?\d+)?/,
    rx_LeftParentheses = /^ *\( */,
    rx_RightParentheses = /^ *\)/,
    rx_Comma = /^ *[,;] */,
    rx_arraySeparators = /^ *[,;] */,

    rx_error = build_rx_error(null ),
    rx_error_local = build_rx_error(null),

    rx_bool = build_rx_bool(null),
    rx_bool_local = build_rx_bool(null),
    rx_string = /^\"((\"\"|[^\"])*)\"/,
    rx_test_ws_name = new test_ws_name2(),
    rx_space_g = /\s/g,
    rx_space = /\s/,
	rx_intersect = /^ +/,
    rg_str_allLang = /[A-Za-z\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0345\u0370-\u0374\u0376\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05B0-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0657\u0659-\u065F\u066E-\u06D3\u06D5-\u06DC\u06E1-\u06E8\u06ED-\u06EF\u06FA-\u06FC\u06FF\u0710-\u073F\u074D-\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0817\u081A-\u082C\u0840-\u0858\u08A0\u08A2-\u08AC\u08E4-\u08E9\u08F0-\u08FE\u0900-\u093B\u093D-\u094C\u094E-\u0950\u0955-\u0963\u0971-\u0977\u0979-\u097F\u0981-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD-\u09C4\u09C7\u09C8\u09CB\u09CC\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09F0\u09F1\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3E-\u0A42\u0A47\u0A48\u0A4B\u0A4C\u0A51\u0A59-\u0A5C\u0A5E\u0A70-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD-\u0AC5\u0AC7-\u0AC9\u0ACB\u0ACC\u0AD0\u0AE0-\u0AE3\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D-\u0B44\u0B47\u0B48\u0B4B\u0B4C\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCC\u0BD0\u0BD7\u0C01-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4C\u0C55\u0C56\u0C58\u0C59\u0C60-\u0C63\u0C82\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCC\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CF1\u0CF2\u0D02\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D-\u0D44\u0D46-\u0D48\u0D4A-\u0D4C\u0D4E\u0D57\u0D60-\u0D63\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E46\u0E4D\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0ECD\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F71-\u0F81\u0F88-\u0F97\u0F99-\u0FBC\u1000-\u1036\u1038\u103B-\u103F\u1050-\u1062\u1065-\u1068\u106E-\u1086\u108E\u109C\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135F\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F0\u1700-\u170C\u170E-\u1713\u1720-\u1733\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17B3\u17B6-\u17C8\u17D7\u17DC\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191C\u1920-\u192B\u1930-\u1938\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A1B\u1A20-\u1A5E\u1A61-\u1A74\u1AA7\u1B00-\u1B33\u1B35-\u1B43\u1B45-\u1B4B\u1B80-\u1BA9\u1BAC-\u1BAF\u1BBA-\u1BE5\u1BE7-\u1BF1\u1C00-\u1C35\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF3\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u24B6-\u24E9\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u2E2F\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA674-\uA67B\uA67F-\uA697\uA69F-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA827\uA840-\uA873\uA880-\uA8C3\uA8F2-\uA8F7\uA8FB\uA90A-\uA92A\uA930-\uA952\uA960-\uA97C\uA980-\uA9B2\uA9B4-\uA9BF\uA9CF\uAA00-\uAA36\uAA40-\uAA4D\uAA60-\uAA76\uAA7A\uAA80-\uAABE\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF5\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABEA\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]/,
    rx_name = new XRegExp( "^(?<name>" + "[" + str_namedRanges + "][" + str_namedRanges + "\\d.]*)([-+*\\/^&%<=>: ;),]|$)" ),
    rx_defName = new test_defName(),
    rx_arraySeparatorsDef = /^ *[,;] */,
    rx_numberDef = /^ *[+-]?\d*(\d|\.)\d*([eE][+-]?\d+)?/,
    rx_CommaDef = /^ *[,;] */,

	rx_array_local = /^\{(([+-]?\d*(\d|\.)\d*([eE][+-]?\d+)?)?(\"((\"\"|[^\"])*)\")?(#NULL!|#DIV\/0!|#VALUE!|#REF!|#NAME\?|#NUM!|#UNSUPPORTED_FUNCTION!|#N\/A|#GETTING_DATA|FALSE|TRUE)?[,;]?)*\}/i,
    rx_array =       /^\{(([+-]?\d*(\d|\.)\d*([eE][+-]?\d+)?)?(\"((\"\"|[^\"])*)\")?(#NULL!|#DIV\/0!|#VALUE!|#REF!|#NAME\?|#NUM!|#UNSUPPORTED_FUNCTION!|#N\/A|#GETTING_DATA|FALSE|TRUE)?[,;]?)*\}/i,

	rx_ControlSymbols = /^ *[\u0000-\u001F\u007F-\u009F] */,

    emailRe = /^(mailto:)?([a-z0-9'\._-]+@[a-z0-9\.-]+\.[a-z0-9]{2,4})([a-яё0-9\._%+-=\? :&]*)/i,
    ipRe = /^(((https?)|(ftps?)):\/\/)?([\-\wа-яё]*:?[\-\wа-яё]*@)?(((1[0-9]{2}|2[0-4][0-9]|25[0-5]|[1-9][0-9]|[0-9])\.){3}(1[0-9]{2}|2[0-4][0-9]|25[0-5]|[1-9][0-9]|[0-9]))(:\d+)?(\/[%\-\wа-яё]*(\.[\wа-яё]{2,})?(([\wа-яё\-\.\?\\\/+@&#;:`~=%!,\(\)]*)(\.[\wа-яё]{2,})?)*)*\/?/i,
    hostnameRe = /^(((https?)|(ftps?)):\/\/)?([\-\wа-яё]*:?[\-\wа-яё]*@)?(([\-\wа-яё]+\.)+[\wа-яё\-]{2,}(:\d+)?(\/[%\-\wа-яё]*(\.[\wа-яё]{2,})?(([\wа-яё\-\.\?\\\/+@&#;:`~=%!,\(\)]*)(\.[\wа-яё]{2,})?)*)*\/?)/i,
    localRe = /^(((https?)|(ftps?)):\/\/)([\-\wа-яё]*:?[\-\wа-яё]*@)?(([\-\wа-яё]+)(:\d+)?(\/[%\-\wа-яё]*(\.[\wа-яё]{2,})?(([\wа-яё\-\.\?\\\/+@&#;:`~=%!,\(\)]*)(\.[\wа-яё]{2,})?)*)*\/?)/i,

	rx_table = build_rx_table(null),
	rx_table_local = build_rx_table(null);

function getUrlType(url) {
  var checkvalue = url.replace(new RegExp(' ', 'g'), '%20');
  var isEmail = false;
  var isvalid = checkvalue.strongMatch(hostnameRe);
  !isvalid && (isvalid = checkvalue.strongMatch(ipRe));
  !isvalid && (isvalid = checkvalue.strongMatch(localRe));
  isEmail = checkvalue.strongMatch(emailRe);
  !isvalid && (isvalid = isEmail);

  return isvalid ? (isEmail ? AscCommon.c_oAscUrlType.Email : AscCommon.c_oAscUrlType.Http) : AscCommon.c_oAscUrlType.Invalid;
}
function prepareUrl(url, type) {
  if (!/(((^https?)|(^ftp)):\/\/)|(^mailto:)/i.test(url)) {
    url = ( (AscCommon.c_oAscUrlType.Email == type) ? 'mailto:' : 'http://' ) + url;
  }

  return url.replace(new RegExp("%20", 'g'), " ");
}

/**
 * вспомогательный объект для парсинга формул и проверки строки по регуляркам указанным выше.
 * @constructor
 */
function parserHelper() {
	this.operand_str = null;
	this.pCurrPos = null;
}
parserHelper.prototype._reset = function () {
	this.operand_str = null;
	this.pCurrPos = null;
};
parserHelper.prototype.isControlSymbols = function ( formula, start_pos, digitDelim ) {
    if ( this instanceof parserHelper ) {
        this._reset();
    }

    var match = (formula.substring( start_pos )).match( rx_ControlSymbols );
    if (match != null) {
        this.operand_str = match[0];
        this.pCurrPos += match[0].length;
        return true;
    }
    return false;
};
parserHelper.prototype.isOperator = function(formula, start_pos) {
  // ToDo нужно ли это?
  if (this instanceof parserHelper) {
    this._reset();
  }

  var code, find = false, length = formula.length;
  while (start_pos !== length) {
    code = formula.charCodeAt(start_pos);
    if (-1 !== g_arrCodeOperators.indexOf(code)) {
      this.operand_str = formula[start_pos];
      ++start_pos;
      find = true;
      break;
    } else if (g_oStartCodeOperatorsCompare <= code && code <= g_oEndCodeOperatorsCompare) {
      this.operand_str = formula[start_pos];
      ++start_pos;
      while (start_pos !== length) {
        code = formula.charCodeAt(start_pos);
        if (g_oStartCodeOperatorsCompare > code || code > g_oEndCodeOperatorsCompare) {
          break;
        }
        this.operand_str += formula[start_pos];
        ++start_pos;
      }
      find = true;
      break;
    } else if (code === g_oCodeSpace) {
      ++start_pos;
    } else {
      break;
    }
  }
  if (find) {
    while (start_pos !== length) {
      code = formula.charCodeAt(start_pos);
      if (code !== g_oCodeSpace) {
        break;
      }
      ++start_pos;
    }
    this.pCurrPos = start_pos;
    return true;
  }
  return false;
};
parserHelper.prototype.isFunc = function ( formula, start_pos ) {
	if ( this instanceof parserHelper ) {
		this._reset();
	}

	var frml = formula.substring( start_pos );
	var match = (frml).match( rg );

	if (match != null) {
		if ( match.length == 2 ) {
			this.pCurrPos += match[1].length;
			this.operand_str = match[1];
			return true;
		}
	}
	return false;
};
parserHelper.prototype.isArea = function ( formula, start_pos ) {
	if ( this instanceof parserHelper ) {
		this._reset();
	}

	var subSTR = formula.substring( start_pos );
	var match = subSTR.match( rgRange ) || subSTR.match( rgCols ) || subSTR.match( rgRows );
	if (match != null) {
        var m0 = match[1].split(":");
        if( g_oCellAddressUtils.getCellAddress(m0[0]).isValid() && g_oCellAddressUtils.getCellAddress(m0[1]).isValid() ){
            this.pCurrPos += match[1].length;
            this.operand_str = match[1];
            return true;
        }
	}
	return false;
};
parserHelper.prototype.isRef = function ( formula, start_pos, allRef ) {
	if ( this instanceof parserHelper ) {
		this._reset();
	}
	var substr = formula.substring( start_pos );
	var match = substr.match( rx_ref );
	if (match != null) {
		var m0 = match[0], m1 = match[1], m2 = match[2];
		if (  g_oCellAddressUtils.getCellAddress(m1).isValid() /*match.length >= 3 && g_oCellAddressUtils.colstrToColnum( m1.substr( 0, (m1.length - m2.length) ) ) <= gc_nMaxCol && parseInt( m2 ) <= gc_nMaxRow*/ ) {
			this.pCurrPos += m0.indexOf( " " ) > -1 ? m0.length - 1 : m1.length;
			this.operand_str = m1;
			return true;
		} else if ( allRef ) {
			match = substr.match( rx_refAll );
			if ( (match != null || match != undefined) && match.length >= 3 ) {
				var m1 = match[1];
				this.pCurrPos += m1.length;
				this.operand_str = m1;
				return true;
			}
		}
	}

	return false;
};
parserHelper.prototype.is3DRef = function ( formula, start_pos ) {
	if ( this instanceof parserHelper ) {
		this._reset();
	}

    var subSTR = formula.substring( start_pos ),
        match = XRegExp.exec( subSTR, rx_ref3D_quoted ) || XRegExp.exec( subSTR, rx_ref3D_non_quoted );

	if (match != null) {
		this.pCurrPos += match[0].length;
		this.operand_str = match[1];
		return [ true, match["name_from"] ? match["name_from"].replace( /''/g, "'" ) : null, match["name_to"] ? match["name_to"].replace( /''/g, "'" ) : null ];
	}
	return [false, null, null];
};
parserHelper.prototype.isNextPtg = function(formula, start_pos, digitDelim) {
  if (this instanceof parserHelper) {
    this._reset();
  }

  var subSTR = formula.substring(start_pos), match;
  if (subSTR.match(rx_RightParentheses) == null && subSTR.match(digitDelim ? rx_Comma : rx_CommaDef) == null &&
    subSTR.match(rx_operators) == null && (match = subSTR.match(rx_intersect)) != null) {
    this.pCurrPos += match[0].length;
    this.operand_str = match[0][0];
    return true;
  }
  return false;
};
parserHelper.prototype.isNumber = function ( formula, start_pos, digitDelim ) {
	if ( this instanceof parserHelper ) {
		this._reset();
	}

	var match = (formula.substring( start_pos )).match( digitDelim?rx_number:rx_numberDef );
	if (match != null) {
		this.operand_str = match[0].replace(FormulaSeparators.digitSeparator,FormulaSeparators.digitSeparatorDef);
		this.pCurrPos += match[0].length;

		return true;
	}
	return false;
};
parserHelper.prototype.isLeftParentheses = function ( formula, start_pos ) {
	if ( this instanceof parserHelper ) {
		this._reset();
	}

  var code, find = false, length = formula.length;
  while (start_pos !== length) {
    code = formula.charCodeAt(start_pos);
    if (code === g_oCodeLeftParentheses) {
      this.operand_str = formula[start_pos];
      ++start_pos;
      find = true;
      break;
    } else if (code === g_oCodeSpace) {
      ++start_pos;
    } else {
      break;
    }
  }

  if (find) {
    while (start_pos !== length) {
      code = formula.charCodeAt(start_pos);
      if (code !== g_oCodeSpace) {
        break;
      }
      ++start_pos;
    }
    this.pCurrPos = start_pos;
    return true;
  }
  return false;
};
parserHelper.prototype.isRightParentheses = function ( formula, start_pos ) {
	if ( this instanceof parserHelper ) {
		this._reset();
	}

  var code, find = false, length = formula.length;
  while (start_pos !== length) {
    code = formula.charCodeAt(start_pos);
    if (code === g_oCodeRightParentheses) {
      this.operand_str = formula[start_pos];
      ++start_pos;
      find = true;
      break;
    } else if (code === g_oCodeSpace) {
      ++start_pos;
    } else {
      break;
    }
  }

  if (find) {
    while (start_pos !== length) {
      code = formula.charCodeAt(start_pos);
      if (code !== g_oCodeSpace) {
        break;
      }
      ++start_pos;
    }
    this.pCurrPos = start_pos;
    return true;
  }
};
parserHelper.prototype.isComma = function ( formula, start_pos, digitDelim ) {
	if ( this instanceof parserHelper ) {
		this._reset();
	}

	var match = (formula.substring( start_pos )).match( digitDelim?rx_Comma:rx_CommaDef );
	if (match != null) {
		this.operand_str = match[0];
		this.pCurrPos += match[0].length;

		return true;
	}
	return false;
};
parserHelper.prototype.isArraySeparator = function ( formula, start_pos, digitDelim ) {
	if ( this instanceof parserHelper ) {
		this._reset();
	}

	var match = (formula.substring( start_pos )).match( digitDelim?rx_arraySeparators:rx_arraySeparatorsDef );
	if (match != null) {
		this.operand_str = match[0];
		this.pCurrPos += match[0].length;

		return true;
	}
	return false;
};
parserHelper.prototype.isError = function ( formula, start_pos, local ) {
	if ( this instanceof parserHelper ) {
		this._reset();
	}

	var match = (formula.substring( start_pos )).match( local?rx_error_local:rx_error );
	if (match != null) {
		this.operand_str = match[0];
		this.pCurrPos += match[0].length;
		return true;
	}
	return false;
};
parserHelper.prototype.isBoolean = function ( formula, start_pos, local ) {
	if ( this instanceof parserHelper ) {
		this._reset();
	}

	var match = (formula.substring( start_pos )).match( local?rx_bool_local:rx_bool );
	if (match != null) {
		this.operand_str = match[1];
		this.pCurrPos += match[1].length;
		return true;
	}
	return false;
};
parserHelper.prototype.isString = function ( formula, start_pos ) {
	if ( this instanceof parserHelper ) {
		this._reset();
	}

	var match = (formula.substring( start_pos )).match( rx_string );
	if (match != null) {
		this.operand_str = match[1].replace( "\"\"", "\"" );
		this.pCurrPos += match[0].length;
		return true;
	}
	return false;
};
parserHelper.prototype.isName = function ( formula, start_pos, wb, ws ) {
	if ( this instanceof parserHelper ) {
		this._reset();
	}

    var subSTR = formula.substring( start_pos ),
        match = XRegExp.exec( subSTR, rx_name );

	if (match != null) {
		var name = match["name"];
		if ( name && name.length != 0 && name != cBoolLocal["t"] && name != cBoolLocal["f"]/*&& wb.DefinedNames && wb.isDefinedNamesExists( name, ws ? ws.getId() : null )*/ ) {
			this.pCurrPos += name.length;
			this.operand_str = name;
			return [ true, name ];
		}
		this.operand_str = name;
	}
	return [false];
};
parserHelper.prototype.isArray = function ( formula, start_pos, digitDelim ) {
	if ( this instanceof parserHelper ) {
		this._reset();
	}

	var match = (formula.substring( start_pos )).match( digitDelim?rx_array_local:rx_array );

	if (match != null) {
		this.operand_str = match[0].substring( 1, match[0].length - 1 );
		this.pCurrPos += match[0].length;
		return true;
	}

	return false;
};
parserHelper.prototype.isLeftBrace = function ( formula, start_pos ) {
  if ( this instanceof parserHelper ) {
    this._reset();
  }

  var code, find = false, length = formula.length;
  while (start_pos !== length) {
    code = formula.charCodeAt(start_pos);
    if (code === g_oCodeLeftBrace) {
      this.operand_str = formula[start_pos];
      ++start_pos;
      find = true;
      break;
    } else if (code === g_oCodeSpace) {
      ++start_pos;
    } else {
      break;
    }
  }

  if (find) {
    while (start_pos !== length) {
      code = formula.charCodeAt(start_pos);
      if (code !== g_oCodeSpace) {
        break;
      }
      ++start_pos;
    }
    this.pCurrPos = start_pos;
    return true;
  }
};
parserHelper.prototype.isRightBrace = function ( formula, start_pos ) {
  if ( this instanceof parserHelper ) {
    this._reset();
  }

  var code, find = false, length = formula.length;
  while (start_pos !== length) {
    code = formula.charCodeAt(start_pos);
    if (code === g_oCodeRightBrace) {
      this.operand_str = formula[start_pos];
      ++start_pos;
      find = true;
      break;
    } else if (code === g_oCodeSpace) {
      ++start_pos;
    } else {
      break;
    }
  }

  if (find) {
    while (start_pos !== length) {
      code = formula.charCodeAt(start_pos);
      if (code !== g_oCodeSpace) {
        break;
      }
      ++start_pos;
    }
    this.pCurrPos = start_pos;
    return true;
  }
};
parserHelper.prototype.isTable = function ( formula, start_pos, local ){
    if ( this instanceof parserHelper ) {
        this._reset();
    }

    var subSTR = formula.substring( start_pos ),
        match = XRegExp.exec( subSTR, local?rx_table_local:rx_table );

    if ( match != null && match["tableName"] ) {
        this.operand_str = match[0];
        this.pCurrPos += match[0].length;
        return match;
    }

    return false;
};
// Парсим ссылку на диапазон в листе
parserHelper.prototype.parse3DRef = function ( formula ) {
	// Сначала получаем лист
	var is3DRefResult = this.is3DRef( formula, 0 );
	if ( is3DRefResult && true === is3DRefResult[0] ) {
		// Имя листа в ссылке
		var sheetName = is3DRefResult[1];
		// Ищем начало range
		var indexStartRange = formula.indexOf( "!" ) + 1;
		if ( this.isArea( formula, indexStartRange ) ) {
			if ( this.operand_str.length == formula.substring( indexStartRange ).length )
				return {sheet:sheetName, range:this.operand_str};
			else
				return null;
		} else if ( this.isRef( formula, indexStartRange ) ) {
			if ( this.operand_str.length == formula.substring( indexStartRange ).length )
				return {sheet:sheetName, range:this.operand_str};
			else
				return null;
		}
	}
	// Возвращаем ошибку
	return null;
};
// Возвращает ссылку на диапазон с листом (название листа экранируется)
parserHelper.prototype.get3DRef = function (sheet, range) {
	sheet = sheet.split(":");
	var wsFrom = sheet[0],
		wsTo = sheet[1] === undefined ? wsFrom : sheet[1];
	if ( rx_test_ws_name.test( wsFrom ) && rx_test_ws_name.test( wsTo ) ) {
		return (wsFrom !== wsTo ? wsFrom + ":" + wsTo : wsFrom) + "!" + range;
	} else {
		wsFrom = wsFrom.replace( /'/g, "''" );
		wsTo = wsTo.replace( /'/g, "''" );
		return "'" + (wsFrom !== wsTo ? wsFrom + ":" + wsTo : wsFrom) + "'!" + range;
	}
};
// Возвращает экранируемое название листа
parserHelper.prototype.getEscapeSheetName = function (sheet) {
	return rx_test_ws_name.test(sheet) ? sheet : "'" + sheet.replace(/'/g, "''") + "'";
};
/**
 * Проверяем ссылку на валидность для диаграммы или автофильтра
 * @param {AscCommonExcel.Workbook} model
 * @param {AscCommonExcel.WorkbookView} wb
 * @param {Asc.c_oAscSelectionDialogType} dialogType
 * @param {string} dataRange
 * @param {boolean} fullCheck
 * @param {boolean} isRows
 * @param {Asc.c_oAscChartTypeSettings} chartType
 * @returns {*}
 */
parserHelper.prototype.checkDataRange = function (model, wb, dialogType, dataRange, fullCheck, isRows, chartType) {
    var sDataRange = dataRange, sheetModel;
	if (Asc.c_oAscSelectionDialogType.Chart === dialogType) {
		dataRange = parserHelp.parse3DRef(dataRange);
        if(dataRange)
        {
            sheetModel =  model.getWorksheetByName(dataRange.sheet);
        }
		if (null === dataRange || !sheetModel)
			return Asc.c_oAscError.ID.DataRangeError;
		dataRange = AscCommonExcel.g_oRangeCache.getAscRange(dataRange.range);
	} else
		dataRange = AscCommonExcel.g_oRangeCache.getAscRange(dataRange);

	if (null === dataRange)
		return Asc.c_oAscError.ID.DataRangeError;

	if (fullCheck) {
		if (Asc.c_oAscSelectionDialogType.Chart === dialogType) {
			// Проверка максимального дипазона
			var maxSeries = 255;
			var minStockVal = 4;

			var intervalValues, intervalSeries;
			if (isRows) {
				intervalSeries = dataRange.r2 - dataRange.r1 + 1;
				intervalValues = dataRange.c2 - dataRange.c1 + 1;
			} else {
				intervalSeries = dataRange.c2 - dataRange.c1 + 1;
				intervalValues = dataRange.r2 - dataRange.r1 + 1;
			}

			if (Asc.c_oAscChartTypeSettings.stock === chartType) {
                var chartSettings = new AscCommon.asc_ChartSettings();
                chartSettings.putType(Asc.c_oAscChartTypeSettings.stock);
                chartSettings.putRange(sDataRange);
                chartSettings.putInColumns(!isRows);
                var chartSeries = AscFormat.getChartSeries (sheetModel, chartSettings).series;
				if (minStockVal !== chartSeries.length || !chartSeries[0].Val || !chartSeries[0].Val.NumCache || chartSeries[0].Val.NumCache.length < minStockVal)
					return Asc.c_oAscError.ID.StockChartError;
			} else if (intervalSeries > maxSeries)
				return Asc.c_oAscError.ID.MaxDataSeriesError;
		} else if (Asc.c_oAscSelectionDialogType.FormatTable === dialogType) {
			// ToDo убрать эту проверку, заменить на более грамотную после правки функции _searchFilters
			if (true === wb.getWorksheet().model.autoFilters.isRangeIntersectionTableOrFilter(dataRange))
				return Asc.c_oAscError.ID.AutoFilterDataRangeError;
		} else if (c_oAscSelectionDialogType.FormatTableChangeRange === dialogType) {
			// ToDo убрать эту проверку, заменить на более грамотную после правки функции _searchFilters
			var checkChangeRange = wb.getWorksheet().af_checkChangeRange(dataRange);
			if (null !== checkChangeRange)
				return checkChangeRange;
		}
	}
	return Asc.c_oAscError.ID.No;
};
parserHelper.prototype.setDigitSeparator = function( sep ){
    if( sep != FormulaSeparators.digitSeparatorDef ){
      FormulaSeparators.digitSeparator = sep;
      FormulaSeparators.arrayRowSeparator = ";";
      FormulaSeparators.arrayColSeparator = "\\";
      FormulaSeparators.functionArgumentSeparator = ";";
        rx_number = new RegExp("^ *[+-]?\\d*(\\d|\\"+ FormulaSeparators.digitSeparator +")\\d*([eE][+-]?\\d+)?");
        rx_Comma = new RegExp("^ *["+FormulaSeparators.functionArgumentSeparator+"] *");
//		build_rx_array_local( cBoolLocal, digitSeparator, null);
        rx_arraySeparators = new RegExp("^ *["+FormulaSeparators.arrayRowSeparator+"\\"+FormulaSeparators.arrayColSeparator+"] *");
    }
    else{
      FormulaSeparators.arrayRowSeparator = FormulaSeparators.arrayRowSeparatorDef;
      FormulaSeparators.arrayColSeparator = FormulaSeparators.arrayColSeparatorDef;
      FormulaSeparators.digitSeparator = FormulaSeparators.digitSeparatorDef;
      FormulaSeparators.functionArgumentSeparator = FormulaSeparators.functionArgumentSeparatorDef;
        rx_number = new RegExp("^ *[+-]?\\d*(\\d|\\"+ FormulaSeparators.digitSeparatorDef +")\\d*([eE][+-]?\\d+)?");
        rx_Comma = new RegExp("^ *["+FormulaSeparators.functionArgumentSeparatorDef+"] *");
//		build_rx_array_local( cBoolLocal, digitSeparatorDef, null);
        rx_arraySeparators = new RegExp("^ *["+FormulaSeparators.arrayRowSeparatorDef+"\\"+FormulaSeparators.arrayColSeparatorDef+"] *");
    }
};
  parserHelper.prototype.getColumnTypeByName = function(value) {
    var res;
    switch (value.toLowerCase()) {
      case "#" + cStrucTableLocalColumns['a'].toLocaleLowerCase():
      case cStrucTableReservedWords.all.toLocaleLowerCase():
        res = FormulaTablePartInfo.all;
        break;
      case "#" + cStrucTableLocalColumns['d'].toLocaleLowerCase():
      case cStrucTableReservedWords.data.toLocaleLowerCase():
        res = FormulaTablePartInfo.data;
        break;
      case "#" + cStrucTableLocalColumns['h'].toLocaleLowerCase():
      case cStrucTableReservedWords.headers.toLocaleLowerCase():
        res = FormulaTablePartInfo.headers;
        break;
      case "#" + cStrucTableLocalColumns['t'].toLocaleLowerCase():
      case cStrucTableReservedWords.totals.toLocaleLowerCase():
        res = FormulaTablePartInfo.totals;
        break;
      case "#" + cStrucTableLocalColumns['tr'].toLocaleLowerCase():
      case cStrucTableReservedWords.at.toLocaleLowerCase():
      case cStrucTableReservedWords.thisrow.toLocaleLowerCase():
        res = FormulaTablePartInfo.thisRow;
        break;
      default:
        res = FormulaTablePartInfo.data;
        break;
    }
    return res;
  };
  parserHelper.prototype.getColumnNameByType = function(value) {
    switch (value) {
      case FormulaTablePartInfo.all:
      {
        if (local) {
          return "#" + cStrucTableLocalColumns['a'];
        }
        return cStrucTableReservedWords.all;
      }
      case FormulaTablePartInfo.data:
      {
        if (local) {
          return "#" + cStrucTableLocalColumns['d'];
        }
        return cStrucTableReservedWords.data;
      }
      case FormulaTablePartInfo.headers:
      {
        if (local) {
          return "#" + cStrucTableLocalColumns['h'];
        }
        return cStrucTableReservedWords.headers;
      }
      case FormulaTablePartInfo.totals:
      {
        if (local) {
          return "#" + cStrucTableLocalColumns['t'];
        }
        return cStrucTableReservedWords.totals;
      }
      case FormulaTablePartInfo.thisRow:
      {
        if (local) {
          return "#" + cStrucTableLocalColumns['tr'];
        }
        return cStrucTableReservedWords.thisrow;
      }
    }
    return null;
  };

var parserHelp = new parserHelper();

var kCurFormatPainterWord = '';
if (AscBrowser.isIE)
// Пути указаны относительно html в меню, не надо их исправлять
// и коммитить на пути относительно тестового меню
	kCurFormatPainterWord = 'url(../../../sdk/Common/Images/text_copy.cur), pointer';
else if (AscBrowser.isOpera)
	kCurFormatPainterWord = 'pointer';
else
	kCurFormatPainterWord = "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAATCAYAAACdkl3yAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAJxJREFUeNrslGEOwBAMhVtxM5yauxnColWJzt+9pFkl9vWlBeac4VINYG4h3vueFUeKIHLOjRTsp+pdKaX6QY2jufripobpzRoB0ro6qdW5I+q3qGxowXONI9LACcBBBMYhA/RuFJxA+WnXK1CBJJg0kKMD2cc8hNKe25P9gxSy01VY3pjdhHYgCCG0RYyR5Bphpk8kMofHjh4BBgA9UXIXw7elTAAAAABJRU5ErkJggg==') 2 11, pointer";

  function extendClass (Child, Parent) {
    var F = function() { };
    F.prototype = Parent.prototype;
    Child.prototype = new F();
    Child.prototype.constructor = Child;
    Child.superclass = Parent.prototype;
  }

function asc_ajax (obj) {
	var url = "", type = "GET",
		async = true, data = null, dataType = "text/xml",
		error = null, success = null, httpRequest = null,
		contentType = "application/x-www-form-urlencoded",

		init = function (obj){
			if ( typeof obj.url !== 'undefined' ){
				url = obj.url;
			}
			if ( typeof obj.type !== 'undefined' ){
				type = obj.type;
			}
			if ( typeof obj.async !== 'undefined' ){
				async = obj.async;
			}
			if ( typeof obj.data !== 'undefined' ){
				data = obj.data;
			}
			if ( typeof obj.dataType !== 'undefined' ){
				dataType = obj.dataType;
			}
			if ( typeof obj.error !== 'undefined' ){
				error = obj.error;
			}
			if ( typeof obj.success !== 'undefined' ){
				success = obj.success;
			}
			if ( typeof (obj.contentType) !== 'undefined' ){
				contentType = obj.contentType;
			}

			if (window.XMLHttpRequest) { // Mozilla, Safari, ...
				httpRequest = new XMLHttpRequest();
				if (httpRequest.overrideMimeType) {
					httpRequest.overrideMimeType(dataType);
				}
			}
			else if (window.ActiveXObject) { // IE
				try {
					httpRequest = new ActiveXObject("Msxml2.XMLHTTP");
				}
				catch (e) {
					try {
						httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
					}
					catch (e) {}
				}
			}

			httpRequest.onreadystatechange = function(){
				respons(this);
			};
			send();
		},

		send = function(){
			httpRequest.open(type, url, async);
			if (type === "POST")
				httpRequest.setRequestHeader("Content-Type", contentType);
			httpRequest.send(data);
		},

		respons = function(httpRequest){
			switch (httpRequest.readyState)
			{
				case 0:
					// The object has been created, but not initialized (the open method has not been called).
					break;
				case 1:
					// A request has been opened, but the send method has not been called.
					break;
				case 2:
					// The send method has been called. No data is available yet.
					break;
				case 3:
					// Some data has been received; however, neither responseText nor responseBody is available.
					break;
				case 4:
					if (httpRequest.status === 200 || httpRequest.status === 1223) {
						if (typeof success === "function")
							success(httpRequest.responseText);
					} else {
						if (typeof error === "function")
							error(httpRequest,httpRequest.statusText,httpRequest.status);
					}
					break;
			}
		};

	init(obj);
}


function CIdCounter ()
{
    this.m_sUserId        = null;
    this.m_bLoad          = true;
    this.m_bRead          = false;
    this.m_nIdCounterLoad = 0; // Счетчик Id для загрузки
    this.m_nIdCounterEdit = 0; // Счетчик Id для работы
}
CIdCounter.prototype.Get_NewId = function()
{
    if (true === this.m_bLoad || null === this.m_sUserId)
    {
        this.m_nIdCounterLoad++;
        return ("" + this.m_nIdCounterLoad);
    }
    else
    {
        this.m_nIdCounterEdit++;
        return ("" + this.m_sUserId + "_" + this.m_nIdCounterEdit);
    }
};
CIdCounter.prototype.Set_UserId = function(sUserId)
{
    this.m_sUserId = sUserId;
};
CIdCounter.prototype.Set_Load = function(bValue)
{
    this.m_bLoad = bValue;
};
CIdCounter.prototype.Clear = function()
{
    this.m_sUserId        = null;
    this.m_bLoad          = true;
    this.m_nIdCounterLoad = 0; // Счетчик Id для загрузки
    this.m_nIdCounterEdit = 0; // Счетчик Id для работы
};

function CTableId()
{
    this.m_aPairs = null;
    this.m_bTurnOff = false;
    this.Id = null;
    this.isInit = false;
}
CTableId.prototype.checkInit = function()
{
  return this.isInit;
};
CTableId.prototype.init = function()
{
  this.m_aPairs   = {};
  this.m_bTurnOff = false;
  this.Id         = g_oIdCounter.Get_NewId();
  this.Add(this, this.Id);
  this.isInit = true;
};
CTableId.prototype.Add = function(Class, Id)
{
    if (false === this.m_bTurnOff)
    {
        Class.Id = Id;
        this.m_aPairs[Id] = Class;

      AscCommon.History.Add(this, { Type : AscDFH.historyitem_TableId_Add, Id : Id, Class : Class  });
    }
};
CTableId.prototype.TurnOff = function()
{
    this.m_bTurnOff = true;
};
CTableId.prototype.TurnOn = function()
{
    this.m_bTurnOff = false;
};
/*
 Получаем указатель на класс по Id
 */
CTableId.prototype.Get_ById = function(Id)
{
    if ("" === Id)
        return null;

    if ("undefined" != typeof(this.m_aPairs[Id]))
        return this.m_aPairs[Id];

    return null;
};
/*
 Получаем Id, по классу (вообще, данную функцию лучше не использовать)
 */
CTableId.prototype.Get_ByClass = function(Class)
{
    if ("undefined" != typeof( Class.Get_Id ))
        return Class.Get_Id();

    if ("undefined" != typeof( Class.GetId() ))
        return Class.GetId();

    return null;
};
CTableId.prototype.Reset_Id = function(Class, Id_new, Id_old)
{
    if (Class === this.m_aPairs[Id_old])
    {
        delete this.m_aPairs[Id_old];
        this.m_aPairs[Id_new] = Class;

      AscCommon.History.Add(this, { Type : AscDFH.historyitem_TableId_Reset, Id_new : Id_new, Id_old : Id_old  });
    }
    else
    {
        this.Add(Class, Id_new);
    }
};
CTableId.prototype.Get_Id = function()
{
    return this.Id;
};
CTableId.prototype.Clear = function()
{
    this.m_aPairs = {};
    this.m_bTurnOff = false;
    this.Add(this, g_oIdCounter.Get_NewId());
};
//-----------------------------------------------------------------------------------
// Функции для работы с Undo/Redo
//-----------------------------------------------------------------------------------
CTableId.prototype.Undo = function(Data)
{
    // Ничего не делаем (можно удалять/добавлять ссылки на классы в данном классе
    // но это не обяательно, т.к. Id всегда уникальные)
};
CTableId.prototype.Redo = function(Redo)
{
    // Ничего не делаем (можно удалять/добавлять ссылки на классы в данном классе
    // но это не обяательно, т.к. Id всегда уникальные)
};
CTableId.prototype.Refresh_RecalcData = function(Data)
{
    // Ничего не делаем, добавление/удаление классов не влияет на пересчет
};
//-----------------------------------------------------------------------------------
// Функции для работы с совместным редактирования
//-----------------------------------------------------------------------------------
CTableId.prototype.Read_Class_FromBinary = function(Reader)
{
    var ElementType = Reader.GetLong();
    var Element = null;

    // Временно отключаем регистрацию новых классов
    this.m_bTurnOff = true;

    switch( ElementType )
    {
        case AscDFH.historyitem_type_Paragraph                : Element = new Paragraph(); break;
        case AscDFH.historyitem_type_TextPr                   : Element = new ParaTextPr(); break;
        case AscDFH.historyitem_type_Hyperlink                : Element = new ParaHyperlink(); break;
        case AscDFH.historyitem_type_Drawing                  : Element = new ParaDrawing(); break;
        case AscDFH.historyitem_type_Table                    : Element = new CTable(); break;
        case AscDFH.historyitem_type_TableRow                 : Element = new CTableRow(); break;
        case AscDFH.historyitem_type_TableCell                : Element = new CTableCell(); break;
        case AscDFH.historyitem_type_DocumentContent          : Element = new CDocumentContent(); break;
        case AscDFH.historyitem_type_HdrFtr                   : Element = new CHeaderFooter(); break;
        case AscDFH.historyitem_type_AbstractNum              : Element = new CAbstractNum(); break;
        case AscDFH.historyitem_type_Comment                  : Element = new CComment(); break;
        case AscDFH.historyitem_type_Style                    : Element = new CStyle(); break;
        case AscDFH.historyitem_type_CommentMark              : Element = new ParaComment(); break;
        case AscDFH.historyitem_type_ParaRun                  : Element = new ParaRun(); break;
        case AscDFH.historyitem_type_Section                  : Element = new CSectionPr(); break;
        case AscDFH.historyitem_type_Field                    : Element = new ParaField(); break;

        case AscDFH.historyitem_type_DefaultShapeDefinition   : Element = new AscFormat.DefaultShapeDefinition(); break;
        case AscDFH.historyitem_type_CNvPr                    : Element = new AscFormat.CNvPr(); break;
        case AscDFH.historyitem_type_NvPr                     : Element = new AscFormat.NvPr(); break;
        case AscDFH.historyitem_type_Ph                       : Element = new AscFormat.Ph(); break;
        case AscDFH.historyitem_type_UniNvPr                  : Element = new AscFormat.UniNvPr(); break;
        case AscDFH.historyitem_type_StyleRef                 : Element = new AscFormat.StyleRef(); break;
        case AscDFH.historyitem_type_FontRef                  : Element = new AscFormat.FontRef(); break;
        case AscDFH.historyitem_type_Chart                    : Element = new AscFormat.CChart(); break;
        case AscDFH.historyitem_type_ChartSpace               : Element = new AscFormat.CChartSpace(); break;
        case AscDFH.historyitem_type_Legend                   : Element = new AscFormat.CLegend(); break;
        case AscDFH.historyitem_type_Layout                   : Element = new AscFormat.CLayout(); break;
        case AscDFH.historyitem_type_LegendEntry              : Element = new AscFormat.CLegendEntry(); break;
        case AscDFH.historyitem_type_PivotFmt                 : Element = new AscFormat.CPivotFmt(); break;
        case AscDFH.historyitem_type_DLbl                     : Element = new AscFormat.CDLbl(); break;
        case AscDFH.historyitem_type_Marker                   : Element = new AscFormat.CMarker(); break;
        case AscDFH.historyitem_type_PlotArea                 : Element = new AscFormat.CPlotArea(); break;
        case AscDFH.historyitem_type_NumFmt                   : Element = new AscFormat.CNumFmt(); break;
        case AscDFH.historyitem_type_Scaling                  : Element = new AscFormat.CScaling(); break;
        case AscDFH.historyitem_type_DTable                   : Element = new AscFormat.CDTable(); break;
        case AscDFH.historyitem_type_LineChart                : Element = new AscFormat.CLineChart(); break;
        case AscDFH.historyitem_type_DLbls                    : Element = new AscFormat.CDLbls(); break;
        case AscDFH.historyitem_type_UpDownBars               : Element = new AscFormat.CUpDownBars(); break;
        case AscDFH.historyitem_type_BarChart                 : Element = new AscFormat.CBarChart(); break;
        case AscDFH.historyitem_type_BubbleChart              : Element = new AscFormat.CBubbleChart(); break;
        case AscDFH.historyitem_type_DoughnutChart            : Element = new AscFormat.CDoughnutChart(); break;
        case AscDFH.historyitem_type_OfPieChart               : Element = new AscFormat.COfPieChart(); break;
        case AscDFH.historyitem_type_PieChart                 : Element = new AscFormat.CPieChart(); break;
        case AscDFH.historyitem_type_RadarChart               : Element = new AscFormat.CRadarChart(); break;
        case AscDFH.historyitem_type_ScatterChart             : Element = new AscFormat.CScatterChart(); break;
        case AscDFH.historyitem_type_StockChart               : Element = new AscFormat.CStockChart(); break;
        case AscDFH.historyitem_type_SurfaceChart             : Element = new AscFormat.CSurfaceChart(); break;
        case AscDFH.historyitem_type_BandFmt                  : Element = new AscFormat.CBandFmt(); break;
        case AscDFH.historyitem_type_AreaChart                : Element = new AscFormat.CAreaChart(); break;
        case AscDFH.historyitem_type_ScatterSer               : Element = new AscFormat.CScatterSeries(); break;
        case AscDFH.historyitem_type_DPt                      : Element = new AscFormat.CDPt(); break;
        case AscDFH.historyitem_type_ErrBars                  : Element = new AscFormat.CErrBars(); break;
        case AscDFH.historyitem_type_MinusPlus                : Element = new AscFormat.CMinusPlus(); break;
        case AscDFH.historyitem_type_NumLit                   : Element = new AscFormat.CNumLit(); break;
        case AscDFH.historyitem_type_NumericPoint             : Element = new AscFormat.CNumericPoint(); break;
        case AscDFH.historyitem_type_NumRef                   : Element = new AscFormat.CNumRef(); break;
        case AscDFH.historyitem_type_TrendLine                : Element = new AscFormat.CTrendLine(); break;
        case AscDFH.historyitem_type_Tx                       : Element = new AscFormat.CTx(); break;
        case AscDFH.historyitem_type_StrRef                   : Element = new AscFormat.CStrRef(); break;
        case AscDFH.historyitem_type_StrCache                 : Element = new AscFormat.CStrCache(); break;
        case AscDFH.historyitem_type_StrPoint                 : Element = new AscFormat.CStringPoint(); break;
        case AscDFH.historyitem_type_XVal                     : Element = new AscFormat.CXVal(); break;
        case AscDFH.historyitem_type_MultiLvlStrRef           : Element = new AscFormat.CMultiLvlStrRef(); break;
        case AscDFH.historyitem_type_MultiLvlStrCache         : Element = new AscFormat.CMultiLvlStrCache(); break;
        case AscDFH.historyitem_type_StringLiteral            : Element = new AscFormat.CStringLiteral(); break;
        case AscDFH.historyitem_type_YVal                     : Element = new AscFormat.CYVal(); break;
        case AscDFH.historyitem_type_AreaSeries               : Element = new AscFormat.CAreaSeries(); break;
        case AscDFH.historyitem_type_Cat                      : Element = new AscFormat.CCat(); break;
        case AscDFH.historyitem_type_PictureOptions           : Element = new AscFormat.CPictureOptions(); break;
        case AscDFH.historyitem_type_RadarSeries              : Element = new AscFormat.CRadarSeries(); break;
        case AscDFH.historyitem_type_BarSeries                : Element = new AscFormat.CBarSeries(); break;
        case AscDFH.historyitem_type_LineSeries               : Element = new AscFormat.CLineSeries(); break;
        case AscDFH.historyitem_type_PieSeries                : Element = new AscFormat.CPieSeries(); break;
        case AscDFH.historyitem_type_SurfaceSeries            : Element = new AscFormat.CSurfaceSeries(); break;
        case AscDFH.historyitem_type_BubbleSeries             : Element = new AscFormat.CBubbleSeries(); break;
        case AscDFH.historyitem_type_ExternalData             : Element = new AscFormat.CExternalData(); break;
        case AscDFH.historyitem_type_PivotSource              : Element = new AscFormat.CPivotSource(); break;
        case AscDFH.historyitem_type_Protection               : Element = new AscFormat.CProtection(); break;
        case AscDFH.historyitem_type_ChartWall                : Element = new AscFormat.CChartWall(); break;
        case AscDFH.historyitem_type_View3d                   : Element = new AscFormat.CView3d(); break;
        case AscDFH.historyitem_type_ChartText                : Element = new AscFormat.CChartText(); break;
        case AscDFH.historyitem_type_ShapeStyle               : Element = new AscFormat.CShapeStyle(); break;
        case AscDFH.historyitem_type_Xfrm                     : Element = new AscFormat.CXfrm(); break;
        case AscDFH.historyitem_type_SpPr                     : Element = new AscFormat.CSpPr(); break;
        case AscDFH.historyitem_type_ClrScheme                : Element = new AscFormat.ClrScheme(); break;
        case AscDFH.historyitem_type_ClrMap                   : Element = new AscFormat.ClrMap(); break;
        case AscDFH.historyitem_type_ExtraClrScheme           : Element = new AscFormat.ExtraClrScheme(); break;
        case AscDFH.historyitem_type_FontCollection           : Element = new AscFormat.FontCollection(); break;
        case AscDFH.historyitem_type_FontScheme               : Element = new AscFormat.FontScheme(); break;
        case AscDFH.historyitem_type_FormatScheme             : Element = new AscFormat.FmtScheme(); break;
        case AscDFH.historyitem_type_ThemeElements            : Element = new AscFormat.ThemeElements(); break;
        case AscDFH.historyitem_type_HF                       : Element = new AscFormat.HF(); break;
        case AscDFH.historyitem_type_BgPr                     : Element = new AscFormat.CBgPr(); break;
        case AscDFH.historyitem_type_Bg                       : Element = new AscFormat.CBg(); break;
        case AscDFH.historyitem_type_PrintSettings            : Element = new AscFormat.CPrintSettings(); break;
        case AscDFH.historyitem_type_HeaderFooterChart        : Element = new AscFormat.CHeaderFooterChart(); break;
        case AscDFH.historyitem_type_PageMarginsChart         : Element = new AscFormat.CPageMarginsChart(); break;
        case AscDFH.historyitem_type_PageSetup                : Element = new AscFormat.CPageSetup(); break;
        case AscDFH.historyitem_type_Shape                    : Element = new AscFormat.CShape(); break;
        case AscDFH.historyitem_type_DispUnits                : Element = new AscFormat.CDispUnits(); break;
        case AscDFH.historyitem_type_GroupShape               : Element = new AscFormat.CGroupShape(); break;
        case AscDFH.historyitem_type_ImageShape               : Element = new AscFormat.CImageShape(); break;
        case AscDFH.historyitem_type_Geometry                 : Element = new AscFormat.Geometry(); break;
        case AscDFH.historyitem_type_Path                     : Element = new AscFormat.Path(); break;
        case AscDFH.historyitem_type_TextBody                 : Element = new AscFormat.CTextBody(); break;
        case AscDFH.historyitem_type_CatAx                    : Element = new AscFormat.CCatAx(); break;
        case AscDFH.historyitem_type_ValAx                    : Element = new AscFormat.CValAx(); break;
        case AscDFH.historyitem_type_WrapPolygon              : Element = new CWrapPolygon(); break;
        case AscDFH.historyitem_type_DateAx                   : Element = new AscFormat.CDateAx(); break;
        case AscDFH.historyitem_type_SerAx                    : Element = new AscFormat.CSerAx(); break;
        case AscDFH.historyitem_type_Title                    : Element = new AscFormat.CTitle(); break;

        case AscDFH.historyitem_type_Math						: Element = new ParaMath(false); break;
        case AscDFH.historyitem_type_MathContent				: Element = new CMathContent(); break;
        case AscDFH.historyitem_type_acc						: Element = new CAccent(); break;
        case AscDFH.historyitem_type_bar						: Element = new CBar(); break;
        case AscDFH.historyitem_type_box						: Element = new CBox(); break;
        case AscDFH.historyitem_type_borderBox					: Element = new CBorderBox(); break;
        case AscDFH.historyitem_type_delimiter					: Element = new CDelimiter(); break;
        case AscDFH.historyitem_type_eqArr						: Element = new CEqArray(); break;
        case AscDFH.historyitem_type_frac                      : Element = new CFraction(); break;
        case AscDFH.historyitem_type_mathFunc					: Element = new CMathFunc(); break;
        case AscDFH.historyitem_type_groupChr					: Element = new CGroupCharacter(); break;
        case AscDFH.historyitem_type_lim						: Element = new CLimit(); break;
        case AscDFH.historyitem_type_matrix					: Element = new CMathMatrix(); break;
        case AscDFH.historyitem_type_nary						: Element = new CNary(); break;
        case AscDFH.historyitem_type_phant						: Element = new CPhantom(); break;
        case AscDFH.historyitem_type_rad						: Element = new CRadical(); break;
        case AscDFH.historyitem_type_deg_subsup				: Element = new CDegreeSubSup(); break;
        case AscDFH.historyitem_type_deg						: Element = new CDegree(); break;
        case AscDFH.historyitem_type_Slide                     : Element = new Slide(); break;
        case  AscDFH.historyitem_type_SlideLayout              : Element = new SlideLayout(); break;
        case  AscDFH.historyitem_type_SlideMaster              : Element = new MasterSlide(); break;
        case  AscDFH.historyitem_type_SlideComments            : Element = new SlideComments(); break;
        case  AscDFH.historyitem_type_PropLocker               : Element = new PropLocker(); break;
        case  AscDFH.historyitem_type_Theme                    : Element = new AscFormat.CTheme(); break;
        case  AscDFH.historyitem_type_GraphicFrame             : Element = new CGraphicFrame(); break;
    }

    if ( null !== Element )
        Element.Read_FromBinary2(Reader);

    // Включаем назад регистрацию новых классов
    this.m_bTurnOff = false;

    return Element;
};
CTableId.prototype.Save_Changes = function(Data, Writer)
{
    // Сохраняем изменения из тех, которые используются для Undo/Redo в бинарный файл.
    // Long : тип класса
    // Long : тип изменений

    Writer.WriteLong( AscDFH.historyitem_type_TableId );

    var Type = Data.Type;

    // Пишем тип
    Writer.WriteLong( Type );
    switch ( Type )
    {
        case AscDFH.historyitem_TableId_Add :
        {
            // String   : Id элемента
            // Varibale : сам элемент

            Writer.WriteString2( Data.Id );
            Data.Class.Write_ToBinary2( Writer );

            break;
        }

        case AscDFH.historyitem_TableId_Reset:
        {
            // String : Id_new
            // String : Id_old

            Writer.WriteString2( Data.Id_new );
            Writer.WriteString2( Data.Id_old );

            break;
        }

        case AscDFH.historyitem_TableId_Description:
        {
            // Long : FileCheckSum
            // Long : FileSize
            // Long : Description
            // Long : ItemsCount
            // Long : PointIndex
            // Long : StartPoint
            // Long : LastPoint
            // Long : SumIndex
            // Long : DeletedIndex
            // String : Версия SDK

            Writer.WriteLong(Data.FileCheckSum);
            Writer.WriteLong(Data.FileSize);
            Writer.WriteLong(Data.Description);
            Writer.WriteLong(Data.ItemsCount);
            Writer.WriteLong(Data.PointIndex);
            Writer.WriteLong(Data.StartPoint);
            Writer.WriteLong(Data.LastPoint);
            Writer.WriteLong(Data.SumIndex);
            Writer.WriteLong(null === Data.DeletedIndex ? -10 : Data.DeletedIndex);
            Writer.WriteString2("@@Version.@@Build.@@Rev");

            break;
        }
    }
};
CTableId.prototype.Save_Changes2 = function(Data, Writer)
{
    return false;
};
CTableId.prototype.Load_Changes = function(Reader, Reader2)
{
    // Сохраняем изменения из тех, которые используются для Undo/Redo в бинарный файл.
    // Long : тип класса
    // Long : тип изменений

    var ClassType = Reader.GetLong();
    if ( AscDFH.historyitem_type_TableId != ClassType )
        return;

    var Type = Reader.GetLong();

    switch ( Type )
    {
        case AscDFH.historyitem_Common_AddWatermark:
        {
            var sUrl = Reader.GetString2();
            if('undefined' != typeof editor && editor.WordControl && editor.WordControl.m_oLogicDocument)
            {
                var oLogicDocument = editor.WordControl.m_oLogicDocument;
                if(oLogicDocument instanceof CDocument)
                {
                    var oParaDrawing = oLogicDocument.DrawingObjects.getTrialImage(sUrl);
                    var oFirstParagraph = oLogicDocument.Get_FirstParagraph();
                    AscFormat.ExecuteNoHistory(function(){
                        var oRun = new ParaRun();
                        oRun.Content.splice(0, 0, oParaDrawing);
                        oFirstParagraph.Content.splice(0, 0, oRun);
						oLogicDocument.DrawingObjects.addGraphicObject(oParaDrawing);
                    }, this, []);
                }
                else if(oLogicDocument instanceof CPresentation)
                {
                    if(oLogicDocument.Slides[0])
                    {
                        var oDrawing = oLogicDocument.Slides[0].graphicObjects.createWatermarkImage(sUrl);
                        oDrawing.spPr.xfrm.offX = (oLogicDocument.Width - oDrawing.spPr.xfrm.extX)/2;
                        oDrawing.spPr.xfrm.offY = (oLogicDocument.Height - oDrawing.spPr.xfrm.extY)/2;
						oDrawing.parent = oLogicDocument.Slides[0];
                        oLogicDocument.Slides[0].cSld.spTree.push(oDrawing);
                    }
                }
            }
            else
            {
                var oWsModel = window["Asc"]["editor"].wbModel.aWorksheets[0];
                if(oWsModel)
                {
                    var objectRender = new AscFormat.DrawingObjects();
                    var oNewDrawing = objectRender.createDrawingObject(AscCommon.c_oAscCellAnchorType.cellanchorAbsolute);
                    var oImage = AscFormat.DrawingObjectsController.prototype.createWatermarkImage(sUrl);
                    oNewDrawing.ext.cx = oImage.spPr.xfrm.extX;
                    oNewDrawing.ext.cy = oImage.spPr.xfrm.extY;
                    oNewDrawing.graphicObject = oImage;
                    oWsModel.Drawings.push(oNewDrawing);
                }
            }
            break;
        }
        case AscDFH.historyitem_TableId_Add:
        {
            // String   : Id элемента
            // Varibale : сам элемент

            var Id    = Reader.GetString2();
            var Class = this.Read_Class_FromBinary( Reader );

            this.m_aPairs[Id] = Class;

            break;
        }

        case AscDFH.historyitem_TableId_Reset:
        {
            // String : Id_new
            // String : Id_old

            var Id_new = Reader.GetString2();
            var Id_old = Reader.GetString2();

            if ( "undefined" != this.m_aPairs[Id_old] )
            {
                var Class = this.m_aPairs[Id_old];
                delete this.m_aPairs[Id_old];
                this.m_aPairs[Id_new] = Class;
                Class.Id = Id_new;
            }

            break;
        }

        case AscDFH.historyitem_TableId_Description:
        {
            // Long : FileCheckSum
            // Long : FileSize
            // Long : Description
            // Long : ItemsCount
            // Long : PointIndex
            // Long : StartPoint
            // Long : LastPoint
            // Long : SumIndex
            // Long : DeletedIndex
            // String : Версия SDK

            var FileCheckSum = Reader.GetLong();
            var FileSize     = Reader.GetLong();
            var Description  = Reader.GetLong();
            var ItemsCount   = Reader.GetLong();
            var PointIndex   = Reader.GetLong();
            var StartPoint   = Reader.GetLong();
            var LastPoint    = Reader.GetLong();
            var SumIndex     = Reader.GetLong();
            var DeletedIndex = Reader.GetLong();
            var VersionString= Reader.GetString2();

            //                // CollaborativeEditing LOG
            //                console.log("ItemsCount2  " + CollaborativeEditing.m_nErrorLog_PointChangesCount);
            //                if (CollaborativeEditing.m_nErrorLog_PointChangesCount !== CollaborativeEditing.m_nErrorLog_SavedPCC)
            //                    console.log("========================= BAD Changes Count in Point =============================");
            //
            //                if (CollaborativeEditing.m_nErrorLog_CurPointIndex + 1 !== PointIndex && 0 !== PointIndex)
            //                    console.log("========================= BAD Point index ========================================");
            //
            //                var bBadSumIndex = false;
            //                if (0 === PointIndex)
            //                {
            //                    CollaborativeEditing.m_nErrorLog_SumIndex = 0;
            //                }
            //                else
            //                {
            //                    CollaborativeEditing.m_nErrorLog_SumIndex += CollaborativeEditing.m_nErrorLog_SavedPCC + 1; // Потому что мы не учитываем данное изменение
            //                    if (PointIndex === StartPoint)
            //                    {
            //                        if (CollaborativeEditing.m_nErrorLog_SumIndex !== SumIndex)
            //                            bBadSumIndex = true;
            //
            //                        console.log("SumIndex2    " + CollaborativeEditing.m_nErrorLog_SumIndex);
            //                        CollaborativeEditing.m_nErrorLog_SumIndex = SumIndex;
            //                    }
            //                }
            //
            //                console.log("----------------------------");
            //                console.log("FileCheckSum " + FileCheckSum);
            //                console.log("FileSize     " + FileSize);
            //                console.log("Description  " + Description + " " + AscDFH.Get_HistoryPointStringDescription(Description));
            //                console.log("PointIndex   " + PointIndex);
            //                console.log("StartPoint   " + StartPoint);
            //                console.log("LastPoint    " + LastPoint);
            //                console.log("ItemsCount   " + ItemsCount);
            //                console.log("SumIndex     " + SumIndex);
            //                console.log("DeletedIndex " + (-10 === DeletedIndex ? null : DeletedIndex));
            //
            //                // -1 Чтобы не учитывалось данное изменение
            //                CollaborativeEditing.m_nErrorLog_SavedPCC          = ItemsCount;
            //                CollaborativeEditing.m_nErrorLog_PointChangesCount = -1;
            //                CollaborativeEditing.m_nErrorLog_CurPointIndex     = PointIndex;
            //
            //                if (bBadSumIndex)
            //                    console.log("========================= BAD Sum index ==========================================");

            break;
        }
    }

    return true;
};
CTableId.prototype.Unlock = function(Data)
{
    // Ничего не делаем
};

function CLock()
{
    this.Type   = locktype_None;
    this.UserId = null;
}

CLock.prototype.Get_Type = function()
{
	return this.Type;
};
CLock.prototype.Set_Type = function(NewType, Redraw)
{
	if ( NewType === locktype_None )
		this.UserId = null;

	this.Type = NewType;

	if ( false != Redraw )
	{
		// TODO: переделать перерисовку тут
		var DrawingDocument = editor.WordControl.m_oLogicDocument.DrawingDocument;
		DrawingDocument.ClearCachePages();
		DrawingDocument.FirePaint();
	}
};
CLock.prototype.Check = function(Id)
{
	if ( this.Type === locktype_Mine )
    AscCommon.CollaborativeEditing.Add_CheckLock( false );
	else if ( this.Type === locktype_Other || this.Type === locktype_Other2 || this.Type === locktype_Other3 )
    AscCommon.CollaborativeEditing.Add_CheckLock( true );
	else
    AscCommon.CollaborativeEditing.Add_CheckLock( Id );
};
CLock.prototype.Lock = function(bMine)
{
	if ( locktype_None === this.Type )
	{
		if ( true === bMine )
			this.Type = locktype_Mine;
		else
			true.Type = locktype_Other;
	}
};
CLock.prototype.Is_Locked = function()
{
	if ( locktype_None != this.Type && locktype_Mine != this.Type )
		return true;

	return false;
};
CLock.prototype.Set_UserId = function(UserId)
{
	this.UserId = UserId;
};
CLock.prototype.Get_UserId = function()
{
	return this.UserId;
};
CLock.prototype.Have_Changes = function()
{
	if ( locktype_Other2 === this.Type || locktype_Other3 === this.Type )
		return true;

	return false;
};


function CContentChanges()
{
    this.m_aChanges = [];
}

CContentChanges.prototype.Add = function(Changes)
{
	this.m_aChanges.push( Changes );
};
CContentChanges.prototype.Clear = function()
{
	this.m_aChanges.length = 0;
};
CContentChanges.prototype.Check = function(Type, Pos)
{
	var CurPos = Pos;
	var Count = this.m_aChanges.length;
	for ( var Index = 0; Index < Count; Index++ )
	{
		var NewPos = this.m_aChanges[Index].Check_Changes(Type, CurPos);
		if ( false === NewPos )
			return false;

		CurPos = NewPos;
	}

	return CurPos;
};
CContentChanges.prototype.Refresh = function()
{
	var Count = this.m_aChanges.length;
	for ( var Index = 0; Index < Count; Index++ )
	{
		this.m_aChanges[Index].Refresh_BinaryData();
	}
};

function CContentChangesElement(Type, Pos, Count, Data) {
	this.m_nType	= Type;  // Тип изменений (удаление или добавление)
	this.m_nCount	= Count; // Количество добавленных/удаленных элементов
	this.m_pData	= Data;  // Связанные с данным изменением данные из истории

	// Разбиваем сложное действие на простейшие
	this.m_aPositions = this.Make_ArrayOfSimpleActions( Type, Pos, Count );
}

CContentChangesElement.prototype.Refresh_BinaryData = function()
{
	var Binary_Writer = AscCommon.History.BinaryWriter;
	var Binary_Pos = Binary_Writer.GetCurPosition();

	this.m_pData.Data.UseArray = true;
	this.m_pData.Data.PosArray = this.m_aPositions;

	Binary_Writer.WriteString2(this.m_pData.Class.Get_Id());
	this.m_pData.Class.Save_Changes( this.m_pData.Data, Binary_Writer );

	var Binary_Len = Binary_Writer.GetCurPosition() - Binary_Pos;

	this.m_pData.Binary.Pos = Binary_Pos;
	this.m_pData.Binary.Len = Binary_Len;
};
CContentChangesElement.prototype.Check_Changes = function(Type, Pos)
{
	var CurPos = Pos;
	if ( contentchanges_Add === Type )
	{
		for ( var Index = 0; Index < this.m_nCount; Index++ )
		{
			if ( false !== this.m_aPositions[Index] )
			{
				if ( CurPos <= this.m_aPositions[Index] )
					this.m_aPositions[Index]++;
				else
				{
					if ( contentchanges_Add === this.m_nType )
						CurPos++;
					else //if ( contentchanges_Remove === this.m_nType )
						CurPos--;
				}
			}
		}
	}
	else //if ( contentchanges_Remove === Type )
	{
		for ( var Index = 0; Index < this.m_nCount; Index++ )
		{
			if ( false !== this.m_aPositions[Index] )
			{
				if ( CurPos < this.m_aPositions[Index] )
					this.m_aPositions[Index]--;
				else if ( CurPos > this.m_aPositions[Index] )
				{
					if ( contentchanges_Add === this.m_nType )
						CurPos++;
					else //if ( contentchanges_Remove === this.m_nType )
						CurPos--;
				}
				else //if ( CurPos === this.m_aPositions[Index] )
				{
					if ( AscCommon.contentchanges_Remove === this.m_nType )
					{
						// Отмечаем, что действия совпали
						this.m_aPositions[Index] = false;
						return false;
					}
					else
					{
						CurPos++;
					}
				}
			}
		}
	}

	return CurPos;
};
CContentChangesElement.prototype.Make_ArrayOfSimpleActions = function(Type, Pos, Count)
{
	// Разбиваем действие на простейшие
	var Positions = [];
	if ( contentchanges_Add === Type )
	{
		for ( var Index = 0; Index < Count; Index++ )
			Positions[Index] = Pos + Index;
	}
	else //if ( contentchanges_Remove === Type )
	{
		for ( var Index = 0; Index < Count; Index++ )
			Positions[Index] = Pos;
	}

	return Positions;
};
var g_oUserColorById = {}, g_oUserNextColorIndex = 0;
function getUserColorById(userId, userName, isDark, isNumericValue)
{
    if ((!userId || "" === userId) && (!userName || "" === userName))
        return new CColor(0, 0, 0, 255);

    var res;
    if (g_oUserColorById.hasOwnProperty(userId))
    {
        res = g_oUserColorById[userId];
    }
    else if (g_oUserColorById.hasOwnProperty(userName))
    {
        res = g_oUserColorById[userName];
    }
    else
    {
        var nColor = Asc.c_oAscArrUserColors[g_oUserNextColorIndex % Asc.c_oAscArrUserColors.length];
        ++g_oUserNextColorIndex;

      res = g_oUserColorById[userId||userName] = new CUserCacheColor(nColor);
    }

    if (!res)
        return new CColor(0, 0, 0, 255);

    var oColor = true === isDark ? res.Dark : res.Light;
    return true === isNumericValue ? ((oColor.r << 16) & 0xFF0000) | ((oColor.g << 8) & 0xFF00) | (oColor.b & 0xFF) : oColor;
}
  
  function isNullOrEmptyString(str) {
    return (str == undefined) || (str == null) || (str == "");
  }
  
function CUserCacheColor(nColor)
{
  this.Light = null;
  this.Dark  = null;
  this.init(nColor);
}
CUserCacheColor.prototype.init = function(nColor) {
  var r = (nColor >> 16) & 0xFF;
  var g = (nColor >> 8) & 0xFF;
  var b = nColor & 0xFF;

  var Y  = Math.max(0, Math.min(255,       0.299    * r + 0.587    * g + 0.114    * b));
  var Cb = Math.max(0, Math.min(255, 128 - 0.168736 * r - 0.331264 * g + 0.5      * b));
  var Cr = Math.max(0, Math.min(255, 128 + 0.5      * r - 0.418688 * g - 0.081312 * b));

  if (Y > 63)
    Y = 63;

  var R = Math.max(0, Math.min(255, Y                        + 1.402   * (Cr - 128))) | 0;
  var G = Math.max(0, Math.min(255, Y - 0.34414 * (Cb - 128) - 0.71414 * (Cr - 128))) | 0;
  var B = Math.max(0, Math.min(255, Y + 1.772   * (Cb - 128)                       )) | 0;

  this.Light = new CColor(r, g, b, 255);
  this.Dark  = new CColor(R, G, B, 255);
};

var g_oIdCounter = new CIdCounter();
var g_oTableId = new CTableId();

window["SetDoctRendererParams"] = function(_params)
{
	if (_params["retina"] === true)
		AscBrowser.isRetina = true;
};
  
  //------------------------------------------------------------export---------------------------------------------------
  window['AscCommon'] = window['AscCommon'] || {};
  window["AscCommon"].getEncodingParams = getEncodingParams;
  window["AscCommon"].saveWithParts = saveWithParts;
  window["AscCommon"].loadFileContent = loadFileContent;
  window["AscCommon"].getImageFromChanges = getImageFromChanges;
  window["AscCommon"].openFileCommand = openFileCommand;
  window["AscCommon"].sendCommand = sendCommand;
  window["AscCommon"].mapAscServerErrorToAscError = mapAscServerErrorToAscError;
  window["AscCommon"].joinUrls = joinUrls;
  window["AscCommon"].getFullImageSrc2 = getFullImageSrc2;
  window["AscCommon"].fSortAscending = fSortAscending;
  window["AscCommon"].fSortDescending = fSortDescending;
  window["AscCommon"].fOnlyUnique = fOnlyUnique;
  window["AscCommon"].isLeadingSurrogateChar = isLeadingSurrogateChar;
  window["AscCommon"].decodeSurrogateChar = decodeSurrogateChar;
  window["AscCommon"].encodeSurrogateChar = encodeSurrogateChar;
  window["AscCommon"].convertUnicodeToUTF16 = convertUnicodeToUTF16;
  window["AscCommon"].convertUTF16toUnicode = convertUTF16toUnicode;
  window["AscCommon"].build_local_rx = build_local_rx;
  window["AscCommon"].changeFileExtention = changeFileExtention;
  window["AscCommon"].getExtentionByFormat = getExtentionByFormat;
  window["AscCommon"].InitOnMessage = InitOnMessage;
  window["AscCommon"].ShowImageFileDialog = ShowImageFileDialog;
  window["AscCommon"].InitDragAndDrop = InitDragAndDrop;
  window["AscCommon"].UploadImageFiles = UploadImageFiles;
  window["AscCommon"].CanDropFiles = CanDropFiles;
  window["AscCommon"].getUrlType = getUrlType;
  window["AscCommon"].prepareUrl = prepareUrl;
  window["AscCommon"].extendClass = extendClass;
  window["AscCommon"].getUserColorById = getUserColorById;
  window["AscCommon"].isNullOrEmptyString = isNullOrEmptyString;

  window["AscCommon"].DocumentUrls = DocumentUrls;
  window["AscCommon"].CLock = CLock;
  window["AscCommon"].CContentChanges = CContentChanges;
  window["AscCommon"].CContentChangesElement = CContentChangesElement;

  window["AscCommon"].g_oDocumentUrls = g_oDocumentUrls;
  window["AscCommon"].FormulaTablePartInfo = FormulaTablePartInfo;
  window["AscCommon"].cBoolLocal = cBoolLocal;
  window["AscCommon"].cErrorOrigin = cErrorOrigin;
  window["AscCommon"].cErrorLocal = cErrorLocal;
  window["AscCommon"].FormulaSeparators = FormulaSeparators;
  window["AscCommon"].rx_space_g = rx_space_g;
  window["AscCommon"].rx_space = rx_space;
  window["AscCommon"].rx_defName = rx_defName;

  window["AscCommon"].kCurFormatPainterWord = kCurFormatPainterWord;
  window["AscCommon"].parserHelp = parserHelp;
  window["AscCommon"].g_oIdCounter = g_oIdCounter;
  window["AscCommon"].g_oTableId = g_oTableId;
})(window);
