"use strict";

var g_sMainServiceLocalUrl = "/CanvasService.ashx";
var g_sResourceServiceLocalUrl = "/ResourceService.ashx?path=";
var g_sUploadServiceLocalUrl = "/UploadService.ashx";
var g_sSpellCheckServiceLocalUrl = "/SpellChecker.ashx";
var g_sTrackingServiceLocalUrl = "/TrackingService.ashx";
var g_nMaxJsonLength = 2097152;
var g_nMaxJsonLengthChecked = g_nMaxJsonLength / 1000;

function fSortAscending( a, b ) {
    return a - b;
}
function fSortDescending( a, b ) {
    return b - a;
}

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
        var matchRec, splitStr = str;
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
        return this.sheet_name_start_character_special.test( splitStr ) &&
            this.sheet_name_end_character_special.test( splitStr ) && !XRegExp.test( splitStr, this );
    };

    return self;
}

var c_oEditorId = {
    Word:0,
    Speadsheet:1,
    Presentation:2
};

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

function ValidateUploadImage( files ) {
    var nRes = c_oAscServerError.NoError;
    if ( files.length > 0 ) {
        for ( var i = 0, length = files.length; i < length; i++ ) {
            var file = files[i];
            //проверяем расширение файла
            var sName = file.fileName || file.name;
            if ( sName ) {
                var bSupported = false;
                var nIndex = sName.lastIndexOf( "." );
                if ( -1 != nIndex ) {
                    var ext = sName.substring( nIndex + 1 ).toLowerCase();
                    for ( var j = 0, length2 = c_oAscImageUploadProp.SupportedFormats.length; j < length2; j++ ) {
                        if ( c_oAscImageUploadProp.SupportedFormats[j] == ext ) {
                            bSupported = true;
                            break;
                        }
                    }
                }
                if ( false == bSupported )
                    nRes = c_oAscServerError.UploadExtension;
            }
            if ( c_oAscError.ID.No == nRes ) {
                var nSize = file.fileSize || file.size;
                if ( nSize && c_oAscImageUploadProp.MaxFileSize < nSize )
                    nRes = c_oAscServerError.UploadContentLength;
            }
            if ( c_oAscServerError.NoError != nRes )
                break;
        }
    }
    else
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

/*Functions that checks of an element in formula*/
var rx_operators = /^ *[-+*\/^&%<=>:] */,
    rx_LG = /^ *[<=>]+ */,
    rx_Lt = /^ *< */,
    rx_Le = /^ *<= */,
    rx_Gt = /^ *> */,
    rx_Ge = /^ *>= */,
    rx_Ne = /^ *<> */,
//    rg = new XRegExp( "^([\\p{L}\\d.]+ *)[-+*/^&%<=>:;\\(\\)]" ),
    rg = /^([\w\d.]+ *)[-+*\/^&%<=>:;\(\)]/,
    rgRange = /^\$?[A-Za-z]+\$?\d+:\$?[A-Za-z]+\$?\d+/,
    rgCols = /^\$?[A-Za-z]+:\$?[A-Za-z]+/,
    rgRows = /^\$?\d+:\$?\d+/,
    rx_ref = /^ *(\$?[A-Za-z]{1,3}\$?(\d{1,7}))([-+*\/^&%<=>: ;),]|$)/,
    rx_refAll = /^(\$?[A-Za-z]+\$?(\d+))([-+*\/^&%<=>: ;),]|$)/,
    rx_ref3D_non_quoted = new XRegExp( "^(?<name_from>[\\p{L}\\d.]+)(:(?<name_to>[\\p{L}\\d.]+))?!" ),
    rx_ref3D_quoted = new XRegExp( "^'(?<name_from>(?:''|[^\\[\\]'\\/*?:])*)(?::(?<name_to>(?:''|[^\\[\\]'\\/*?:])*))?'!" ),
    rx_ref3D = /^\D*[\D\d]*\!/,
    rx_before_operators = /^ *[,()]/,
    rx_number = /^ *[+-]?\d*(\d|\.)\d*([eE][+-]?\d+)?/,
    rx_LeftParentheses = /^ *\( */,
    rx_RightParentheses = /^ *\)/,
    rx_Comma = /^ *[,;] */,
    rx_error = /^(#NULL!|#DIV\/0!|#VALUE!|#REF!|#NAME\?|#NUM!|#UNSUPPORTED_FUNCTION!|#N\/A|#GETTING_DATA)/,
    rx_bool = /^(TRUE|FALSE|true|false)([-+*\/^&%<=>: ;),]|$)/,
    rx_string = /^\"((\"\"|[^\"])*)\"/,
    rx_name = new XRegExp( "^(?<name>\\w[\\w\\d.]*)([-+*\\/^&%<=>: ;),]|$)" ),
    rx_test_ws_name = new test_ws_name(),
    rx_LeftBrace = /^ *\{ */,
    rx_RightBrace = /^ *\}/,
    rx_array = /^\{(([+-]?\d*(\d|\.)\d*([eE][+-]?\d+)?)?(\"((\"\"|[^\"])*)\")?(#NULL!|#DIV\/0!|#VALUE!|#REF!|#NAME\?|#NUM!|#UNSUPPORTED_FUNCTION!|#N\/A|#GETTING_DATA|FALSE|TRUE|true|false)?[,;]?)*\}/,
    rx_space_g = /\s/g,
    rx_space = /\s/,
    rg_str_allLang = /[A-Za-z\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0345\u0370-\u0374\u0376\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05B0-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0657\u0659-\u065F\u066E-\u06D3\u06D5-\u06DC\u06E1-\u06E8\u06ED-\u06EF\u06FA-\u06FC\u06FF\u0710-\u073F\u074D-\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0817\u081A-\u082C\u0840-\u0858\u08A0\u08A2-\u08AC\u08E4-\u08E9\u08F0-\u08FE\u0900-\u093B\u093D-\u094C\u094E-\u0950\u0955-\u0963\u0971-\u0977\u0979-\u097F\u0981-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD-\u09C4\u09C7\u09C8\u09CB\u09CC\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09F0\u09F1\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3E-\u0A42\u0A47\u0A48\u0A4B\u0A4C\u0A51\u0A59-\u0A5C\u0A5E\u0A70-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD-\u0AC5\u0AC7-\u0AC9\u0ACB\u0ACC\u0AD0\u0AE0-\u0AE3\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D-\u0B44\u0B47\u0B48\u0B4B\u0B4C\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCC\u0BD0\u0BD7\u0C01-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4C\u0C55\u0C56\u0C58\u0C59\u0C60-\u0C63\u0C82\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCC\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CF1\u0CF2\u0D02\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D-\u0D44\u0D46-\u0D48\u0D4A-\u0D4C\u0D4E\u0D57\u0D60-\u0D63\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E46\u0E4D\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0ECD\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F71-\u0F81\u0F88-\u0F97\u0F99-\u0FBC\u1000-\u1036\u1038\u103B-\u103F\u1050-\u1062\u1065-\u1068\u106E-\u1086\u108E\u109C\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135F\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F0\u1700-\u170C\u170E-\u1713\u1720-\u1733\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17B3\u17B6-\u17C8\u17D7\u17DC\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191C\u1920-\u192B\u1930-\u1938\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A1B\u1A20-\u1A5E\u1A61-\u1A74\u1AA7\u1B00-\u1B33\u1B35-\u1B43\u1B45-\u1B4B\u1B80-\u1BA9\u1BAC-\u1BAF\u1BBA-\u1BE5\u1BE7-\u1BF1\u1C00-\u1C35\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF3\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u24B6-\u24E9\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u2E2F\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA674-\uA67B\uA67F-\uA697\uA69F-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA827\uA840-\uA873\uA880-\uA8C3\uA8F2-\uA8F7\uA8FB\uA90A-\uA92A\uA930-\uA952\uA960-\uA97C\uA980-\uA9B2\uA9B4-\uA9BF\uA9CF\uAA00-\uAA36\uAA40-\uAA4D\uAA60-\uAA76\uAA7A\uAA80-\uAABE\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF5\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABEA\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]/,
    rg_validBINNumber = /^[01]{1,10}$/,
    rg_validDEC2BINNumber = /^-?[0-9]{1,3}$/,
    rg_validDEC2OCTNumber = /^-?[0-9]{1,9}$/,
    rg_validDEC2HEXNumber = /^-?[0-9]{1,12}$/,
    rg_validHEXNumber = /^[0-9A-Fa-f]{1,10}$/,
    rg_validOCTNumber = /^[0-7]{1,10}$/,
    rg_complex_number = new XRegExp( "^(?<real>[-+]?(?:\\d*(?:\\.\\d+)?(?:[Ee][+-]?\\d+)?))?(?<img>([-+]?(\\d*(?:\\.\\d+)?(?:[Ee][+-]?\\d+)?)?[ij])?)", "g" )


//вспомогательный объект для парсинга формул и проверки строки по регуляркам указанным выше.
function parserHelper() {
}
parserHelper.prototype = {
    _reset:function () {
        delete this.operand_str;
        delete this.pCurrPos;
    },

    isOperator:function ( formula, start_pos ) {
        if ( this instanceof parserHelper ) {
            this._reset();
        }

        var str = formula.substring( start_pos )
        var match = str.match( rx_operators );
        if ( match == null || match == undefined )
            return false;
        else {
            var mt = str.match( rx_LG )
            if ( mt ) match = mt;
            this.operand_str = match[0].replace( rx_space_g, "" );
            this.pCurrPos += match[0].length;
            return true;
        }
        return false;
    },

    isFunc:function ( formula, start_pos ) {
        if ( this instanceof parserHelper ) {
            this._reset();
        }

        var frml = formula.substring( start_pos );
        var match = (frml).match( rg );

        if ( match != null && match != undefined ) {
            if ( match.length == 2 ) {
                this.pCurrPos += match[1].length;
                this.operand_str = match[1];
                return true;
            }
        }
//        this.operand_str = null;
        return false;
    },

    isArea:function ( formula, start_pos ) {
        if ( this instanceof parserHelper ) {
            this._reset();
        }

        var subSTR = formula.substring( start_pos );
        var match = subSTR.match( rgRange ) || subSTR.match( rgCols ) || subSTR.match( rgRows );
        if ( match != null || match != undefined ) {
            this.pCurrPos += match[0].length;
            this.operand_str = match[0];
            return true;
        }
//        this.operand_str = null;
        return false;
    },

    isRef:function ( formula, start_pos, allRef ) {
        if ( this instanceof parserHelper ) {
            this._reset();
        }
        var substr = formula.substring( start_pos );
        var match = substr.match( rx_ref );
        if ( match != null || match != undefined ) {
            var m0 = match[0], m1 = match[1], m2 = match[2];
            if ( match.length >= 3 && g_oCellAddressUtils.colstrToColnum( m1.substr( 0, (m1.length - m2.length) ) ) <= gc_nMaxCol && parseInt( m2 ) <= gc_nMaxRow ) {
                this.pCurrPos += m0.indexOf( " " ) > -1 ? m0.length - 1 : m1.length;
                this.operand_str = m1;
                return true;
            }
            else if ( allRef ) {
                match = substr.match( rx_refAll );
                if ( (match != null || match != undefined) && match.length >= 3 ) {
                    var m1 = match[1];
                    this.pCurrPos += m1.length;
                    this.operand_str = m1;
                    return true;
                }
            }
        }

//        this.operand_str = null;
        return false;
    },

    is3DRef:function ( formula, start_pos ) {
        if ( this instanceof parserHelper ) {
            this._reset();
        }

        var subSTR = formula.substring( start_pos );
        var match = rx_ref3D_quoted.xexec( subSTR ) || rx_ref3D_non_quoted.xexec( subSTR );

        if ( match != null || match != undefined ) {
            this.pCurrPos += match[0].length;
            this.operand_str = match[1];
            return [ true, match["name_from"] ? match["name_from"].replace( /''/g, "'" ) : null, match["name_to"] ? match["name_to"].replace( /''/g, "'" ) : null ];
        }
//        this.operand_str = null;
        return [false, null, null];
    },

    isNextPtg:function ( formula, start_pos ) {
        if ( this instanceof parserHelper ) {
            this._reset();
        }

        var subSTR = formula.substring( start_pos );
        return (
            ( subSTR.match( rx_before_operators ) != null || subSTR.match( rx_before_operators ) != undefined ) &&
                ( subSTR.match( rx_space ) != null || subSTR.match( rx_space ) != undefined )
            )
    },

    isNumber:function ( formula, start_pos ) {
        if ( this instanceof parserHelper ) {
            this._reset();
        }

        var match = (formula.substring( start_pos )).match( rx_number );
        if ( match == null || match == undefined )
            return false;
        else {
            this.operand_str = match[0];
            this.pCurrPos += match[0].length;
            return true;
        }
        return false;
    },

    isLeftParentheses:function ( formula, start_pos ) {
        if ( this instanceof parserHelper ) {
            this._reset();
        }

        var match = (formula.substring( start_pos )).match( rx_LeftParentheses );
        if ( match == null || match == undefined )
            return false;
        else {
            this.operand_str = match[0].replace( rx_space, "" );
            this.pCurrPos += match[0].length;
            return true;
        }
        return false;
    },

    isRightParentheses:function ( formula, start_pos ) {
        if ( this instanceof parserHelper ) {
            this._reset();
        }

        var match = (formula.substring( start_pos )).match( rx_RightParentheses );
        if ( match == null || match == undefined )
            return false;
        else {
            this.operand_str = match[0].replace( rx_space, "" );
            this.pCurrPos += match[0].length;
            return true;
        }
        return false;
    },

    isComma:function ( formula, start_pos ) {
        if ( this instanceof parserHelper ) {
            this._reset();
        }

        var match = (formula.substring( start_pos )).match( rx_Comma );
        if ( match == null || match == undefined )
            return false;
        else {
            this.operand_str = match[0];
            this.pCurrPos += match[0].length;
            return true;
        }
        return false;
    },

    isError:function ( formula, start_pos ) {
        if ( this instanceof parserHelper ) {
            this._reset();
        }

        var match = (formula.substring( start_pos )).match( rx_error );
        if ( match == null || match == undefined )
            return false;
        else {
            this.operand_str = match[0];
            this.pCurrPos += match[0].length;
            return true;
        }
        return false;
    },

    isBoolean:function ( formula, start_pos ) {
        if ( this instanceof parserHelper ) {
            this._reset();
        }

        var match = (formula.substring( start_pos )).match( rx_bool );
        if ( match == null || match == undefined )
            return false;
        else {
            this.operand_str = match[1];
            this.pCurrPos += match[1].length;
            return true;
        }
        return false;
    },

    isString:function ( formula, start_pos ) {
        if ( this instanceof parserHelper ) {
            this._reset();
        }

        var match = (formula.substring( start_pos )).match( rx_string );
        if ( match != null || match != undefined ) {
            this.operand_str = match[1].replace( "\"\"", "\"" );
            this.pCurrPos += match[0].length;
            return true;
        }
        return false;
    },

    isName:function ( formula, start_pos, wb ) {
        if ( this instanceof parserHelper ) {
            this._reset();
        }

        var subSTR = formula.substring( start_pos );
        var match = rx_name.xexec( subSTR );

        if ( match != null || match != undefined ) {
            var name = match["name"];
            if ( name && name.length != 0 && wb.DefinedNames && wb.isDefinedNamesExists( name ) ) {
                this.pCurrPos += name.length;
                this.operand_str = name;
                return [ true, name ];
            }
            this.operand_str = name;
        }
        return [false];
    },

    isArray:function ( formula, start_pos, wb ) {
        if ( this instanceof parserHelper ) {
            this._reset();
        }

        var subSTR = formula.substring( start_pos );
        var match = (formula.substring( start_pos )).match( rx_array );

        if ( match != null || match != undefined ) {
            this.operand_str = match[0].substring( 1, match[0].length - 1 );
            this.pCurrPos += match[0].length;
            return true;
        }

        return false;
    },

    isLeftBrace:function ( formula, start_pos ) {
        if ( this instanceof parserHelper ) {
            this._reset();
        }

        var match = (formula.substring( start_pos )).match( rx_LeftBrace );
        if ( match == null || match == undefined )
            return false;
        else {
            this.operand_str = match[0].replace( /\s/, "" );
            this.pCurrPos += match[0].length;
            return true;
        }
        return false;
    },

    isRightBrace:function ( formula, start_pos ) {
        if ( this instanceof parserHelper ) {
            this._reset();
        }

        var match = (formula.substring( start_pos )).match( rx_RightBrace );
        if ( match == null || match == undefined )
            return false;
        else {
            this.operand_str = match[0].replace( rx_space, "" );
            this.pCurrPos += match[0].length;
            return true;
        }
        return false;
    },

    // Парсим ссылку на диапазон в листе
    parse3DRef:function ( formula ) {
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
            }
            else if ( this.isRef( formula, indexStartRange ) ) {
                if ( this.operand_str.length == formula.substring( indexStartRange ).length )
                    return {sheet:sheetName, range:this.operand_str};
                else
                    return null;

            }
        }
        // Возвращаем ошибку
        return null;
    }
};
var parserHelp = new parserHelper();