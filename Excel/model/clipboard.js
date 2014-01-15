(	/**
	 * @param {jQuery} $
	 * @param {Window} window
	 * @param {undefined} undefined
	 */
	function ($, window, undefined) {

		/*
		 * Import
		 * -----------------------------------------------------------------------------
		 */
		var doc = window.document;
		
		var isTruePaste = false;
		//activate local buffer
		var activateLocalStorage = true;
		var isOnlyLocalBufferSafari = false;
		var copyPasteUseBinary = false;
		var copyPasteFromWordUseBinary = false;
		
		var Base64 = {
		 
			 // private property
			 _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
			 
			 // public method for encoding
			 encode : function (input) {
			  var output = "";
			  var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
			  var i = 0;
			 
			  input = Base64._utf8_encode(input);
			 
			  while (i < input.length) {
			 
			   chr1 = input.charCodeAt(i++);
			   chr2 = input.charCodeAt(i++);
			   chr3 = input.charCodeAt(i++);
			 
			   enc1 = chr1 >> 2;
			   enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			   enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			   enc4 = chr3 & 63;
			 
			   if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			   } else if (isNaN(chr3)) {
				enc4 = 64;
			   }
			 
			   output = output +
			   this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
			   this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
			 
			  }
			 
			  return output;
			 },
			 
			 // public method for decoding
			 decode : function (input) {
			  var output = "";
			  var chr1, chr2, chr3;
			  var enc1, enc2, enc3, enc4;
			  var i = 0;
			 
			  input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
			 
			  while (i < input.length) {
			 
			   enc1 = this._keyStr.indexOf(input.charAt(i++));
			   enc2 = this._keyStr.indexOf(input.charAt(i++));
			   enc3 = this._keyStr.indexOf(input.charAt(i++));
			   enc4 = this._keyStr.indexOf(input.charAt(i++));
			 
			   chr1 = (enc1 << 2) | (enc2 >> 4);
			   chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			   chr3 = ((enc3 & 3) << 6) | enc4;
			 
			   output = output + String.fromCharCode(chr1);
			 
			   if (enc3 != 64) {
				output = output + String.fromCharCode(chr2);
			   }
			   if (enc4 != 64) {
				output = output + String.fromCharCode(chr3);
			   }
			 
			  }
			 
			  output = Base64._utf8_decode(output);
			 
			  return output;
			 
			 },
			 
			 // private method for UTF-8 encoding
			 _utf8_encode : function (string) {
			  string = string.replace(/\r\n/g,"\n");
			  var utftext = "";
			 
			  for (var n = 0; n < string.length; n++) {
			 
			   var c = string.charCodeAt(n);
			 
			   if (c < 128) {
				utftext += String.fromCharCode(c);
			   }
			   else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			   }
			   else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			   }
			 
			  }
			 
			  return utftext;
			 },
			 
			 // private method for UTF-8 decoding
			 _utf8_decode : function (utftext) {
			  var string = "";
			  var i = 0;
			  var c1, c2, c3;
			 
			  while ( i < utftext.length ) {
			 
			   c1 = utftext.charCodeAt(i);
			 
			   if (c1 < 128) {
				string += String.fromCharCode(c1);
				i++;
			   } else if((c1 > 191) && (c1 < 224)) {
				c2 = utftext.charCodeAt(i+1);
				string += String.fromCharCode(((c1 & 31) << 6) | (c2 & 63));
				i += 2;
			   } else {
				c2 = utftext.charCodeAt(i+1);
				c3 = utftext.charCodeAt(i+2);
				string += String.fromCharCode(((c1 & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			   }
			 
			  }
			 
			  return string;
			 }

		};

		function number2color(n) {
			if( typeof(n)=="string" && n.indexOf("rgb")>-1)
				return n;
			return "rgb(" + (n >> 16 & 0xFF) + "," + (n >> 8 & 0xFF) + "," + (n & 0xFF) + ")";
		}


		/** @constructor */
		function Clipboard() {
			if ( !(this instanceof Clipboard) ) {return new Clipboard();}

			this.element = undefined;
			this.ppix = 96;
			this.ppiy = 96;
			this.Api = null;
			this.activeRange = null;
			this.lStorage = {};

			this.fontsNew = {};

			return this;
		}

		Clipboard.prototype = {

			constructor: Clipboard,

			init: function () {
				var t = this;
				var found = true;

				if (!t.element) {
					t.element = doc.getElementById(COPY_ELEMENT_ID);
					if (!t.element) {found = false; t.element = doc.createElement("DIV");}
				}

				t.element.id = COPY_ELEMENT_ID;
				t.element.setAttribute("class", COPYPASTE_ELEMENT_CLASS);
				t.element.style.position = "absolute";
				// Если сделать width маленьким, то параграф будет постоянно переноситься по span
				// И например в таком случае пропадает пробел <span>1</span><span> </span><span>2</span>
				t.element.style.top = '-100px';
				t.element.style.left = '0px';
				t.element.style.width = '10000px';
				t.element.style.height = '100px';
				t.element.style.overflow = 'hidden';
				t.element.style.zIndex = -1000;
				t.element.style.display = ELEMENT_DISPAY_STYLE;
				t.element.setAttribute("contentEditable", true);

				if (!found) {doc.body.appendChild(t.element);}
				
				//fix for ipad
				if( !window.g_isMobileVersion)
				{
					var foundText = true;
	
					if (!t.elementText) {
						t.elementText = doc.getElementById(kElementTextId);
						if (!t.elementText) {foundText = false; t.elementText = doc.createElement("textarea");}
					}
	
					t.elementText.id = kElementTextId;
					t.elementText.style.position = "absolute";
					// Если сделать width маленьким, то параграф будет постоянно переноситься по span
					// И например в таком случае пропадает пробел <span>1</span><span> </span><span>2</span>
					t.elementText.style.width = '10000px';
					t.elementText.style.height = '100px';
					t.elementText.style.left = '0px';
					t.elementText.style.top = '-100px';
					t.elementText.style.overflow = 'hidden';
					t.elementText.style.zIndex = -1000;
					//if(AscBrowser.isIE)
						t.elementText.style.display = ELEMENT_DISPAY_STYLE;
					t.elementText.setAttribute("contentEditable", true);
	
					if (!foundText) {doc.body.appendChild(t.elementText);}
				}
				var div = doc.createElement("DIV");
				div.setAttribute("style","position:absolute; visibility:hidden; padding:0; height:1in; width:1in;");
				doc.body.appendChild(div);

				this.ppix = div.clientWidth;
				this.ppiy = div.clientHeight;

				doc.body.removeChild(div);
			},

			destroy: function () {
				var p;
				if (this.element) {
					p = this.element.parentNode;
					if (p) {p.removeChild(this.element);}
					this.element = undefined;
				}
			},
			
			
			//****copy cells ****
			copyRange: function (range, worksheet, isCut) {
				var t = this;
				t._cleanElement();
				var text = t._makeTableNode(range, worksheet, isCut);
				if(text == false)
					return;
				//исключения для opera в случае копирования пустой html
				if($(text).find('td')[0] && $(text).find('td')[0].innerText == '' && AscBrowser.isOpera)
					$(text).find('td')[0].innerHTML = '&nbsp;';
				t.element.appendChild(text);
				
				if(!copyPasteUseBinary)
				{
					t.copyText = t._getTextFromTable(t.element.children[0]);
					var randomVal = Math.floor(Math.random()*10000000);
					t.copyText.pasteFragment = "pasteFragment_" + randomVal;
					if(text)
						$(text).addClass("pasteFragment_" + randomVal);
				}
				

				if($(text).find('img')[0] && AscBrowser.isOpera)
				{
					$(text)[0].innerHTML = "<tr><td>&nbsp;</td></tr>";
					if(t.copyText.isImage)
						t.copyText.text = ' ';
				}
				History.TurnOff();
				
				//use binary strings
				if(copyPasteUseBinary)
				{	
					if(worksheet.objectRender.controller.curState.textObject && worksheet.objectRender.controller.curState.textObject.txBody)
						this.lStorage.htmlInShape = text;
					else
					{
						var oBinaryFileWriter = new BinaryFileWriter(worksheet.model.workbook, worksheet.activeRange);
						var sBase64 = oBinaryFileWriter.Write();
						if(this.element.children && this.element.children.length == 1 /*&& window.USER_AGENT_SAFARI_MACOS*/)
						{
							$(this.element.children[0]).css("font-weight", "normal");;
							$(this.element.children[0]).wrap(document.createElement("b"));
						}
						if(this.element.children[0])
							$(this.element.children[0]).addClass("xslData;" + sBase64);
						//for buttons copy/paste
						this.lStorage = sBase64;
					}
				}
							
				
				History.TurnOn();
				
				if(AscBrowser.isMozilla)
					t._selectElement(t._getStylesSelect);
				else
					t._selectElement();
			},
			

			copyRangeButton: function (range, worksheet, isCut) {
				if(AscBrowser.isIE)
				{
					this._cleanElement();
					this.element.appendChild(this._makeTableNode(range, worksheet));
					
					var t = this, selection, rangeToSelect;

					if (window.getSelection) {// all browsers, except IE before version 9
						selection = window.getSelection();
						rangeToSelect = doc.createRange();
						if (AscBrowser.isGecko) {
							t.element.appendChild(doc.createTextNode('\xa0'));
							t.element.insertBefore(doc.createTextNode('\xa0'), t.element.firstChild);
							rangeToSelect.setStartAfter(t.element.firstChild);
							rangeToSelect.setEndBefore(t.element.lastChild);
						} else {
							rangeToSelect.selectNodeContents(t.element);
						}
						selection.removeAllRanges();
						selection.addRange(rangeToSelect);
					} else {
						if (doc.body.createTextRange) {// Internet Explorer
							rangeToSelect = doc.body.createTextRange();
							rangeToSelect.moveToElementText(t.element);
							rangeToSelect.select();
						}
					}
					document.execCommand("copy");
					// ждем выполнения copy
					window.setTimeout(
					function() {
						// отменяем возможность выделения
						t.element.style.display = "none";
						doc.body.style.MozUserSelect = "none";
						doc.body.style["-khtml-user-select"] = "none";
						doc.body.style["-o-user-select"] = "none";
						doc.body.style["user-select"] = "none";
						doc.body.style["-webkit-user-select"] = "none";
					},
					0);
					return true;
				}
				else if(copyPasteUseBinary)
				{
					var t = this;
					if(worksheet.objectRender.controller.curState.textObject && worksheet.objectRender.controller.curState.textObject.txBody)
					{
						var text = t._makeTableNode(range, worksheet, isCut);
						t.lStorage.htmlInShape = text;
					}	
					else
					{
						var  table = t._makeTableNode(range, worksheet, isCut);
						t.copyText = t._getTextFromTable(table);
						var oBinaryFileWriter = new BinaryFileWriter(worksheet.model.workbook, worksheet.activeRange);
						var sBase64 = oBinaryFileWriter.Write();
						t.lStorage = sBase64;
					}
					return true;
				}
				else if(activateLocalStorage)
				{
					var t = this;
					var  table = t._makeTableNode(range, worksheet, isCut);
					t.copyText = t._getTextFromTable(table);
					return true;
				}
				return false;
			},
			
			
			//****paste cells ****
			pasteRange: function (worksheet) {
				var t = this;
				if(AscBrowser.isMozilla)
					t._editorPaste(worksheet,t._getStylesSelect);
				else
					t._editorPaste(worksheet);
			},
			
			pasteRangeButton: function (worksheet)
			{
				if(AscBrowser.isIE)
				{
					var t = this;
					document.body.style.MozUserSelect = "text";
					delete document.body.style["-khtml-user-select"];
					delete document.body.style["-o-user-select"];
					delete document.body.style["user-select"];
					document.body.style["-webkit-user-select"] = "text";
				
					var pastebin = t._editorPasteGetElem(worksheet,true);
					
					pastebin.style.display  = "block";
					pastebin.focus();
					
					var selection = window.getSelection();
					var rangeToSelect = document.createRange();
					rangeToSelect.selectNodeContents (pastebin);
					selection.removeAllRanges ();
					selection.addRange(rangeToSelect);
					
					//rangeToSelect.execCommand("paste", false);
					document.execCommand("paste");
					
					pastebin.blur();
					pastebin.style.display  = "none";
					
					document.body.style.MozUserSelect = "none";
					document.body.style["-khtml-user-select"] = "none";
					document.body.style["-o-user-select"] = "none";
					document.body.style["user-select"] = "none";
					document.body.style["-webkit-user-select"] = "none";
					
					t._editorPasteExec(worksheet,pastebin)
					return true;
				}
				else if(activateLocalStorage || copyPasteUseBinary)
				{
					var t = this;
					var onlyFromLocalStorage = true;
					t._editorPasteExec(worksheet,t.lStorage,false,onlyFromLocalStorage);
					return true;
				}
				return false;
			},
			
			
			//****copy cell value****
			copyCellValue: function (value) {
				var t = this;
				if(activateLocalStorage || copyPasteUseBinary)
					t._addValueToLocalStrg(value);
				var nodes = t._makeNodesFromCellValue(value);
				var outer;

				// Workaround: webkit неправильно селектит один узел
				if (AscBrowser.isWebkit && nodes.length === 1) {
					outer = doc.createElement("B");
					outer.style.fontWeight = "normal";
					outer.appendChild(nodes[0]);
					nodes[0] = outer;
				}

				t._cleanElement();
				nodes.forEach(
						function(node){
							t.element.appendChild(node);
						});
				if(AscBrowser.isMozilla)
					t._selectElement(t._getStylesSelect);
				else
					t._selectElement();
			},
			
			copyCellValueButton: function (value) {
				if(AscBrowser.isIE)
				{
					var t = this;
					var nodes = t._makeNodesFromCellValue(value);
					var outer;

					// Workaround: webkit неправильно селектит один узел
					if (AscBrowser.isWebkit && nodes.length === 1) {
						outer = doc.createElement("B");
						outer.style.fontWeight = "normal";
						outer.appendChild(nodes[0]);
						nodes[0] = outer;
					}

					t._cleanElement();
					nodes.forEach(
							function(node){
								t.element.appendChild(node);
							});
					var t = this, selection, rangeToSelect;

					if (window.getSelection) {// all browsers, except IE before version 9
						selection = window.getSelection();
						rangeToSelect = doc.createRange();
						if (AscBrowser.isGecko) {
							t.element.appendChild(doc.createTextNode('\xa0'));
							t.element.insertBefore(doc.createTextNode('\xa0'), t.element.firstChild);
							rangeToSelect.setStartAfter(t.element.firstChild);
							rangeToSelect.setEndBefore(t.element.lastChild);
						} else {
							rangeToSelect.selectNodeContents(t.element);
						}
						selection.removeAllRanges();
						selection.addRange(rangeToSelect);
					} else {
						if (doc.body.createTextRange) {// Internet Explorer
							rangeToSelect = doc.body.createTextRange();
							rangeToSelect.moveToElementText(t.element);
							rangeToSelect.select();
						}
					}
					document.execCommand('copy');
					// ждем выполнения copy
					window.setTimeout(
							function() {
								// отменяем возможность выделения
								t.element.style.display = "none";
								doc.body.style.MozUserSelect = "none";
								doc.body.style["-khtml-user-select"] = "none";
								doc.body.style["-o-user-select"] = "none";
								doc.body.style["user-select"] = "none";
								doc.body.style["-webkit-user-select"] = "none";
								// for paste event
							},
							0);
					return true;
				}
				else if(activateLocalStorage || copyPasteUseBinary)
				{
					var t = this;
					t._addValueToLocalStrg(value)
					return true;
				}
				return false;
			},
			
			//****insert into cell****
			pasteAsText: function (callback) {
				var t = this;
				t.elementText.style.display = "block";
				t.elementText.value = '\xa0';
				t.elementText.focus();
				t.elementText.select();
				
				
				// делаем возможным выделение
				delete doc.body.style["-khtml-user-select"];
				delete doc.body.style["-o-user-select"];
				delete doc.body.style["user-select"];
				doc.body.style["-webkit-user-select"] = "text";
				doc.body.style.MozUserSelect = "text";
				
				var _interval_time = 0;
				if(AscBrowser.isMozilla)
					_interval_time = 10;	
				// ждем выполнения
				window.setTimeout(
						function() {
							// отменяем возможность выделения
							t.element.style.display = ELEMENT_DISPAY_STYLE;
							doc.body.style.MozUserSelect = "none";
							doc.body.style["-khtml-user-select"] = "none";
							doc.body.style["-o-user-select"] = "none";
							doc.body.style["user-select"] = "none";
							doc.body.style["-webkit-user-select"] = "none";
							t.elementText.style.display = ELEMENT_DISPAY_STYLE;
							var textInsert = t.elementText.value;
							if(isOnlyLocalBufferSafari && navigator.userAgent.toLowerCase().indexOf('safari') > -1 && navigator.userAgent.toLowerCase().indexOf('mac') && t.lStorageText)
								textInsert = t.lStorageText;
							
							// for paste event
							if(callback)
								callback(textInsert, []);
							if(AscBrowser.isMozilla)
								t._getStylesSelect();
						},
						_interval_time);
			},
			
			pasteAsTextButton: function (callback) {
				var t = this;
				if (AscBrowser.isIE) {
					t.elementText.style.display = "block";
					t.elementText.value = '\xa0';
					t.elementText.focus();
					t.elementText.select();
					
					
					// делаем возможным выделение
					delete doc.body.style["-khtml-user-select"];
					delete doc.body.style["-o-user-select"];
					delete doc.body.style["user-select"];
					doc.body.style["-webkit-user-select"] = "text";
					doc.body.style.MozUserSelect = "text";
							
					document.execCommand('paste');
					// ждем выполнения
					window.setTimeout(
							function() {
								// отменяем возможность выделения
								t.element.style.display = "none";
								doc.body.style.MozUserSelect = "none";
								doc.body.style["-khtml-user-select"] = "none";
								doc.body.style["-o-user-select"] = "none";
								doc.body.style["user-select"] = "none";
								doc.body.style["-webkit-user-select"] = "none";
								t.elementText.style.display = "none";
								// for paste event
								callback(t.elementText.value, []);
							},
							0);
					return true;
				}
				else if(activateLocalStorage || copyPasteUseBinary)
				{
					if(t.lStorageText)
						callback(t.lStorageText, []);
					return true;
				}
				return false;
			},
			
			// Private

			_cleanElement: function () {
				if(!window.USER_AGENT_SAFARI_MACOS)
				{
					this.element.style.left = "0px";
					this.element.style.top = "-100px";
				}
				
				this.element.style.display = "block";

				while (this.element.hasChildNodes()) {
					this.element.removeChild(this.element.lastChild);
				}

				// делаем возможным выделение
				delete doc.body.style["-khtml-user-select"];
				delete doc.body.style["-o-user-select"];
				delete doc.body.style["user-select"];
				doc.body.style["-webkit-user-select"] = "text";
				doc.body.style.MozUserSelect = "text";
			},

			 _getStylesSelect: function (worksheet){
				document.body.style.MozUserSelect = "";
				delete document.body.style["-khtml-user-select"];
				delete document.body.style["-o-user-select"];
				delete document.body.style["user-select"];
				document.body.style["-webkit-user-select"] = "text";
			},
			
            _editorPaste: function (worksheet,callback) {
                var t = this;
				window.GlobalPasteFlagCounter = 1;
				isTruePaste = false;
                var is_chrome = AscBrowser.isChrome;
                document.body.style.MozUserSelect = "text";
                delete document.body.style["-khtml-user-select"];
                delete document.body.style["-o-user-select"];
                delete document.body.style["user-select"];
                document.body.style["-webkit-user-select"] = "text";

                var Text;
                var pastebin = t._editorPasteGetElem(worksheet,true);
                pastebin.style.display  = "block";
                pastebin.focus();
                // Safari requires a filler node inside the div to have the content pasted into it. (#4882)
                pastebin.appendChild( document.createTextNode( '\xa0' ) );

                if (window.getSelection) {  // all browsers, except IE before version 9
                    var selection = document.defaultView.getSelection ();
                    selection.removeAllRanges ();
                    var rangeToSelect = document.createRange ();
                    rangeToSelect.selectNodeContents (pastebin);

                    selection.removeAllRanges ();
                    selection.addRange (rangeToSelect);
                } else {
                    if (document.body.createTextRange) {    // Internet Explorer
                        var rangeToSelect = document.body.createTextRange ();
                        rangeToSelect.moveToElementText (pastebin);
                        rangeToSelect.select ();
                    }
                }
				
				  //paste
				var func_timeout = function() {

					if (PASTE_EMPTY_USE && !isTruePaste)
					{
						// не править. это сделано для фаерфокса. ну не успевает он вставить
						// в дивку контент. и получалось, что мы через раз вставляем пробел.
						// тут идет надежда на то, что вставлять пробел не будут. А если будут - то он вставится,
						// но может с задержкой 1-2 секунды.
						if (pastebin.innerHTML == "&nbsp;")
						{
							PASTE_EMPTY_COUNTER++;
							if (PASTE_EMPTY_COUNTER < PASTE_EMPTY_COUNTER_MAX)
							{
								window.setTimeout( func_timeout, 100 );
								return;
							}
						}
					}
					
					if (window.USER_AGENT_SAFARI_MACOS)
					{
						if (window.GlobalPasteFlagCounter != 2 && !window.GlobalPasteFlag)
						{
							window.setTimeout(func_timeout, 10);
							return;
						}
					}

					document.body.style.MozUserSelect = "none";
					document.body.style["-khtml-user-select"] = "none";
					document.body.style["-o-user-select"] = "none";
					document.body.style["user-select"] = "none";
					document.body.style["-webkit-user-select"] = "none";

					/*if (window.USER_AGENT_IE)
					{
						// не убирать!!! это для ие. чтобы не селектились элементы
						document.onselectstart= function() {
							return false;
						}
					}*/

					if(!isTruePaste)
						t._editorPasteExec(worksheet, pastebin);
					
					pastebin.style.display  = ELEMENT_DISPAY_STYLE;
						
					if(AscBrowser.isIE)
						pastebin.style.display  = ELEMENT_DISPAY_STYLE;
					
					if (callback && callback.call) {callback();}
				};

				var _interval_time = window.USER_AGENT_MACOS ? 200 : 100;

				PASTE_EMPTY_COUNTER = 0;
				window.setTimeout( func_timeout, _interval_time );
            },
            
            _editorPasteGetElem: function (worksheet, bClean)
            {
                //var oWordControl = api.WordControl;
                var t = this;
                var pastebin = document.getElementById(PASTE_ELEMENT_ID);
                if(!pastebin){
                    pastebin = document.createElement("div");
                    pastebin.setAttribute( 'id', PASTE_ELEMENT_ID );
					pastebin.setAttribute( 'class', COPYPASTE_ELEMENT_CLASS );
                    pastebin.style.position = 'absolute';
                    pastebin.style.top = '100px';
                    pastebin.style.left = '0px';
                    pastebin.style.width = '10000px';
                    pastebin.style.height = '100px';
                    pastebin.style.overflow = 'hidden';
                    pastebin.style.zIndex = -1000;
                    //настройки шрифта выставляются, чтобы избежать ситуации когда pastebin содержит span с текстом без настроек шрифта и computedStyle возвращает неизвестные настройки документа по умолчанию
                    /*var Def_rPr = oWordControl.m_oLogicDocument.Styles.Default.TextPr;
                    pastebin.style.fontFamily = Def_rPr.FontFamily.Name;
                    pastebin.style.fontSize = Def_rPr.FontSize + "pt";*/
                    pastebin.style.lineHeight = "1px";//todo FF всегда возвращает computedStyle в px, поэтому лучше явно указать default значнение
                    pastebin.setAttribute("contentEditable", true);
                    
                    pastebin.onpaste = function(e){
						if (!window.GlobalPasteFlag)
							return;
						
						t._bodyPaste(worksheet,e);
						pastebin.onpaste = null;
					};
                    document.body.appendChild( pastebin );
                }
                else if(bClean){
                    //Удаляем содержимое
                    var aChildNodes = pastebin.childNodes;
                    for (var length = aChildNodes.length, i = length - 1; i >= 0; i--)
                    {
                        pastebin.removeChild(aChildNodes[i]);
                    }
					 pastebin.onpaste = function(e){
						if (!window.GlobalPasteFlag)
							return;

						t._bodyPaste(worksheet,e);
						pastebin.onpaste = null;
					};
                }
                return pastebin;
            },

			_getTableFromText: function (sText)
			{
				var t = this; 
				var sHtml = "<html><body><table>";
				var sCurPar = "";
				var sCurChar = "";
				for ( var i = 0, length = sText.length; i < length; i++ )
				{
					var Char = sText.charAt(i);
					var Code = sText.charCodeAt(i);
					var Item = null;

					if ( '\n' === Char )
					{
						if("" == sCurChar && sCurPar == '')
							sHtml += "<tr><td style='font-family:Calibri'>&nbsp;</td></tr>";
						else if(sCurPar == '')
						{
							sHtml += "<tr><td><span style='font-family:Calibri;font-size:11pt;white-space:nowrap'>" + sCurChar + "</span></td></tr>";
							sCurChar = "";
						}
						else if(sCurPar != '')
						{
							if(sCurChar == '')
								sCurPar += "<td style='font-family:Calibri'>&nbsp;</td>";
							else
								sCurPar += "<td><span style='font-family:Calibri;font-size:11pt;white-space:nowrap'>" + sCurChar + "</span></td>";
							sHtml += "<tr>" + sCurPar + "</tr>";
							sCurChar = "";
							sCurPar = "";
						}
					}
					else if ( 13 === Code )
					{
						continue;
					}
					else
					{
						if(32 == Code || 160 == Code) //160 - nbsp
							sCurChar += " ";
						else if ( 9 === Code )//tab
						{
							sCurPar += "<td><span style='font-family:Calibri;font-size:11pt;white-space:nowrap'>" +  sCurChar + "</span></td>";
							if(i == length - 1)
							{
								sHtml += "<tr>" + sCurPar + "</tr>";
							}
							sCurChar = '';
						}   
						else
						{
							sCurChar += t._copyPasteCorrectString(Char);
							if(i == length - 1)
							{
								sCurPar += "<td><span style='font-family:Calibri;font-size:11pt;white-space:nowrap'>" +  sCurChar + "</span></td>";
								sHtml += "<tr>" + sCurPar + "</tr>";
							}
						}
							
					}
				}
				sHtml += "</table></body></html>";
				return sHtml;
			},
			
			_getTextFromTable: function (table)
			{
				//если присутсвуют только изображения
				var images = $(table).find('img');
				if(images.length != 0 && images.length == $(table).children().length)
				{
					var stringImg = {};
					stringImg.isImage = true;
					stringImg.text = '';
					for(var i = 0; i < images.length; i++)
					{
						stringImg.text += images[i].name + ';';
					}
					return stringImg;
				}
				if(table.children && table.children[0] && table.children[0].nodeName.toLowerCase() == 'br')
					$(table.children[0]).remove();
				//проверяем наличие одной таблицы, кроме неё ничего быть не должно
				if((table.children[0] && table.children[0].tagName.toLowerCase() == 'table' && table.children.length == 1))
					table = table.children[0];
				var textNode = {};
				if(table.tagName.toLowerCase() != 'table')
				{
					textNode.text = $(table).text();
				}
				else
				{
					textNode.text = $(table).text();
					if(table.rows)
						textNode.rows = table.rows.length;
					else
						textNode.rows = 0;
					if(table.rows[0] && table.rows[0].cells)
						textNode.cols = table.rows[0].cells.length + table.rows[0].cells[0].colSpan - 1;
				}
				return textNode;
			},
			
            _bodyPaste: function (worksheet, e)
            {
                //var oWordControl = api.WordControl;
                var t = this;
                if (e && e.clipboardData && e.clipboardData.getData) {// Webkit - get data from clipboard, put into editdiv, cleanup, then cancel event
                    var bExist = false;
                    //только chrome разрешает получать 'text/html', safari только 'text/plain'
                    var is_chrome = AscBrowser.isChrome;
                    var sHtml = null;
					var isText = false;
					var fTest = function(types, sPattern)
					{
						if (!types)
							return false;
						for(var i = 0, length = types.length; i < length; ++i)
						{
							if(sPattern == types[i])
								return true;
						}
						return false;
					};
                    if (fTest(e.clipboardData.types, "text/html"))
                    {
                        var sHtml = e.clipboardData.getData('text/html');
                        //Иногда при выделении одной строки из Word в chrome добавляем непонятные символы после </html>, обрезаем их.
                        var nIndex = sHtml.lastIndexOf("</html>");
                        if(-1 != nIndex)
                            sHtml = sHtml.substring(0, nIndex + "</html>".length);
                    }
                    else if (is_chrome && fTest(e.clipboardData.types, "text/plain"))
                    {
                        bExist = true;
                        var sText = e.clipboardData.getData('text/plain');
						sHtml = t._getTableFromText(sText);
						isText = true;
                    }
                    if(null != sHtml)
                    {
                       t._addHtmlToIframe(worksheet,sHtml,isText,e);
                    }
					else
					{
						var items = e.clipboardData.items;
						if(null != items)
						{
							for (var i = 0; i < items.length; ++i) {
								if (items[i].kind == 'file' &&
									items[i].type.indexOf('image/') !== -1) {

									var blob = items[i].getAsFile();
									var reader = new FileReader();

									reader.onload = function(evt) {
										//t._editorPasteExec(worksheet,"<html><body><img src=\"" + evt.target.result + "\"/></body></html>",isText);
										t._addHtmlToIframe(worksheet,"<html><body><img src=\"" + evt.target.result + "\"/></body></html>",isText, evt);
										//fPasteHtml("<html><body><img src=\"" + evt.target.result + "\"/></body></html>");
									};
									reader.readAsDataURL(blob);
								}
							}
						}
					}
                    //preventDefault
                }
            },
			
			_addHtmlToIframe: function(worksheet,sHtml,isText,e)
			{
				var t = this;
				var bExist = false;
				//Записываем html в IFrame
				var ifr = document.getElementById("pasteFrame");
				if (!ifr) 
				{
					ifr = document.createElement("iframe");
					ifr.name = "pasteFrame";
					ifr.id = "pasteFrame";
					ifr.style.position = 'absolute';
					ifr.style.top = '-100px';
					ifr.style.left = '0px';
					ifr.style.width = '10000px';
					ifr.style.height = '100px';
					ifr.style.overflow = 'hidden';
					ifr.style.zIndex = -1000;
					document.body.appendChild(ifr);
				}
				ifr.style.display  = "block";
				var frameWindow = window.frames["pasteFrame"];
				if(frameWindow)
				{
					frameWindow.document.open();
					frameWindow.document.write(sHtml);
					frameWindow.document.close();
					var bodyFrame = frameWindow.document.body;
					if(bodyFrame && bodyFrame != null)
					{
						t._editorPasteExec(worksheet, frameWindow.document.body,isText);
						bExist = true;
					}
					ifr.style.display  = ELEMENT_DISPAY_STYLE;
				}
				if(bExist)
				{
					isTruePaste = true;
					if (e.preventDefault)
					{
						e.stopPropagation();
						e.preventDefault();
					}
					return false;
				}
			},
			_copyPasteCorrectString: function (str)
			{
				var res = str;
				res = res.replace(/&/g,'&amp;');
				res = res.replace(/</g,'&lt;');
				res = res.replace(/>/g,'&gt;');
				res = res.replace(/'/g,'&apos;');
				res = res.replace(/"/g,'&quot;');
				return res;
			},

			_setStylesTextPaste: function (spanObject)
			{
				var t = this;
				var defaultColor = 'rgb(0, 0, 0)';
				var oNewItem = {};
				oNewItem.text = $(spanObject).text().replace(/(\r|\t|\n|)/g,'');

				oNewItem.format = {};
				oNewItem.format.fn = t._checkFonts(spanObject.style.fontFamily.replace(/'/g,"").split(',')[0]);

				if(oNewItem.format.fn == null || oNewItem.format.fn == '')
					oNewItem.format.fn = 'Calibri';

				if($(spanObject).css('vertical-align')  == 'sub' || $(spanObject).css('vertical-align')  == 'super')
				{
					if(($(spanObject.parentNode).css('font-size')).indexOf('pt') > -1)
						oNewItem.format.fs = parseInt($(spanObject.parentNode).css('font-size'));
					else
						oNewItem.format.fs = parseInt((3/4)*Math.round(parseFloat($(spanObject.parentNode).css('font-size'))));
				}
				else
				{
					if(spanObject.style.fontSize.indexOf('pt') > -1)
						oNewItem.format.fs = parseInt(spanObject.style.fontSize);
					else
						oNewItem.format.fs = parseInt((3/4)*Math.round(parseFloat(spanObject.style.fontSize)));
				}
				if(isNaN(oNewItem.format.fs))
					oNewItem.format.fs = 11;
				if($(spanObject).css('font-weight') == 'bold')
					oNewItem.format.b = true;
				else
					oNewItem.format.b = false;

				if($(spanObject).css('font-style') == 'italic')
					oNewItem.format.i = true;
				else
					oNewItem.format.i = false;

				if($(spanObject).css('text-decoration') == 'underline')
					oNewItem.format.u = "single";
				else
					oNewItem.format.u = "none";

				if($(spanObject).css('text-decoration') == 'line-through')
					oNewItem.format.s = true;
				else
					oNewItem.format.s = false;
				
				if($(spanObject).css('vertical-align') != null)
					oNewItem.format.va = $(spanObject).css('vertical-align');
				if( $(spanObject).css('vertical-align') == 'baseline')
					oNewItem.format.va = '';

				oNewItem.format.c = new RgbColor(this._getBinaryColor($(spanObject).css('color')));
				
				if(oNewItem.format.c == '')
					oNewItem.format.c = null;
				
				if($(spanObject).css('vertical-align') != null)
					oNewItem.format.va = $(spanObject).css('vertical-align')  === 'sub' ? 'subscript' : $(spanObject).css('vertical-align') === 'super' ? 'superscript' : 'baseline';
					return oNewItem;
			},

            
			_getDefaultCell: function ()
			{
				var res = [];
				res.push({
					format: {
						fn: 'Arial',
						fs: '11',
						b: false,
						i: false,
						u: false,
						s: false,
						va: 'none'
					},
					text: ''});
				return res; 
			},

			_getBorderStyleName: function (borderStyle, borderWidth) {
				var res = null;
				var nBorderWidth = parseFloat(borderWidth);
				if (isNaN(nBorderWidth))
					return res;
				if (typeof borderWidth == "string" && -1 !== borderWidth.indexOf("pt"))
					nBorderWidth = nBorderWidth * 96 / 72;

				switch (borderStyle) {
					case "solid":
						if (0 < nBorderWidth && nBorderWidth <= 1)
							res = c_oAscBorderStyles.Thin;
						else if (1 < nBorderWidth && nBorderWidth <= 2)
							res = c_oAscBorderStyles.Medium;
						else if (2 < nBorderWidth && nBorderWidth <= 3)
							res = c_oAscBorderStyles.Thick;
						else
							res = c_oAscBorderStyles.None;
						break;
					case "dashed":
						if (0 < nBorderWidth && nBorderWidth <= 1)
							res = c_oAscBorderStyles.DashDot;
						else
							res = c_oAscBorderStyles.MediumDashDot;
						break;
					case "double": res = c_oAscBorderStyles.Double; break;
					case "dotted": res = c_oAscBorderStyles.Hair; break;
				}
				return res;
			},
			
			_getArray: function (node, isText)
            {
                var aResult = [];
                var oNewItem = [];
				var tmpBorderStyle, borderStyleName;
                var t = this;
				
				if(node == undefined)
					node = document.createElement('span');
				
				if(node == undefined || node == null)
				{
					oNewItem[0] = t._getDefaultCell();
					this.fontsNew['Arial'] = 1;
				}
				//style for text
				else if(node.children != undefined && node.children.length == 0)
				{
					oNewItem[0] = t._setStylesTextPaste(node);
					this.fontsNew[oNewItem[0].format.fn] = 1;
				}
				else
				{
					if(typeof(node) == 'string' || node.children.length == 0 || node.children.length == 1  && node.children[0].nodeName == '#text')
						oNewItem =t._makeCellValuesHtml(node,isText);
					else
						oNewItem =t._makeCellValuesHtml(node.childNodes,isText);
				}
				
				//borders
                oNewItem.borders = new Border();

				tmpBorderStyle = $(node).css('border-top-style');
                if ("none" !== tmpBorderStyle && null != tmpBorderStyle) {
                    var borderTopWidth = node.style.borderTopWidth;
					if(borderTopWidth == '')
						borderTopWidth = $(node).css('border-top-width');
					
					var borderTopStyle = node.style.borderTopStyle;
					if(borderTopStyle == '')
						borderTopStyle = tmpBorderStyle;
					
					/*var borderTopColor = node.style.borderTopColor;
					if(borderTopColor == '')
						borderTopColor = $(node).css('border-top-color');*/
					var borderTopColor = 0;

					borderStyleName = this._getBorderStyleName(borderTopStyle, borderTopWidth);
					if (null !== borderStyleName) {
						oNewItem.borders.t.setStyle(borderStyleName);
						oNewItem.borders.t.c = new RgbColor(borderTopColor);
					}
                }

				tmpBorderStyle = $(node).css('border-bottom-style');
				if ("none" !== tmpBorderStyle && null != tmpBorderStyle) {
					var borderBottomWidth = node.style.borderBottomWidth;
					if(borderBottomWidth == '')
						borderBottomWidth = $(node).css('border-bottom-width');
					
					var borderBottomStyle = node.style.borderBottomStyle;
					if(borderBottomStyle == '')
						borderBottomStyle = tmpBorderStyle;
					
					/*var borderBottomColor = node.style.borderBottomColor;
					if(borderBottomColor == '')
						borderBottomColor = $(node).css('border-bottom-color');*/
					var borderBottomColor = 0;

					borderStyleName = this._getBorderStyleName(borderBottomStyle, borderBottomWidth);
					if (null !== borderStyleName) {
						oNewItem.borders.b.setStyle(borderStyleName);
						oNewItem.borders.b.c = new RgbColor(borderBottomColor);
					}
                }

				tmpBorderStyle = $(node).css('border-left-style');
                if ("none" !== tmpBorderStyle && null != tmpBorderStyle) {
                    var borderLeftWidth = node.style.borderLeftWidth;
					if(borderLeftWidth == '')
						borderLeftWidth = $(node).css('border-left-width');
					
					var borderLeftStyle = node.style.borderLeftStyle;
					if(borderLeftStyle == '')
						borderLeftStyle = tmpBorderStyle;
					
					/*var borderLeftColor = node.style.borderLeftColor;
					if(borderLeftColor == '')
						borderLeftColor = $(node).css('border-left-color');*/
					var borderLeftColor = 0;

					borderStyleName = this._getBorderStyleName(borderLeftStyle, borderLeftWidth);
					if (null !== borderStyleName) {
						oNewItem.borders.l.setStyle(borderStyleName);
						oNewItem.borders.l.c = new RgbColor(borderLeftColor);
					}
                }

				tmpBorderStyle = $(node).css('border-right-style');
                if ("none" !== tmpBorderStyle && null != tmpBorderStyle) {
                    var borderRightWidth = node.style.borderRightWidth;
					if(borderRightWidth == '')
						borderRightWidth = $(node).css('border-right-width');
					
					var borderRightStyle = node.style.borderRightStyle;
					if(borderRightStyle == '')
						borderRightStyle = tmpBorderStyle;
					
					/*var borderRightColor = node.style.borderRightColor;
					if(borderRightColor == '')
						borderRightColor = $(node).css('border-right-color'); */
					var borderRightColor = 0;

					borderStyleName = this._getBorderStyleName(borderRightStyle, borderRightWidth);
					if (null !== borderStyleName) {
						oNewItem.borders.r.setStyle(borderStyleName);
						oNewItem.borders.r.c = new RgbColor(borderRightColor);
					}
                }
				
				//wrap
				if(oNewItem.wrap !== true)
				{
					if(node.style.whiteSpace == 'nowrap')
						oNewItem.wrap = false;
					else if(node.style.whiteSpace == 'normal')
						oNewItem.wrap = true;
					else
						oNewItem.wrap = false;
				}
				
				//merge
				if(node != undefined && node.colSpan != undefined)
					oNewItem.colSpan = node.colSpan;
				else
					oNewItem.colSpan = 1;
				if(node != undefined && node.rowSpan != undefined)
					oNewItem.rowSpan = node.rowSpan;
				else
					oNewItem.rowSpan = 1;
				
                if(node.style.textAlign != null && node.style.textAlign != '')
                    oNewItem.a = node.style.textAlign;
				else if(node.children[0] && node.children[0].style.textAlign != null && node.children[0].style.textAlign != '')
					oNewItem.a = node.children[0].style.textAlign;
				else if(node.nodeName.toLowerCase() == "th")
					oNewItem.a = 'center';

                if( $(node).css('background-color') != 'none' &&  $(node).css('background-color') != null)
                {
                     oNewItem.bc =  new RgbColor(this._getBinaryColor($(node).css('background-color')));
                }
				
				if(node.style.verticalAlign != undefined  && node.style.verticalAlign != null && node.style.verticalAlign != '' && node.style.verticalAlign != 'middle')
					oNewItem.va = node.style.verticalAlign;
				else if(node.style.verticalAlign == 'middle')
					oNewItem.va = 'center';
				else
					oNewItem.va = 'bottom';
				
				//check format
				if( node.getAttribute("class") != null ){
					var cL = node.getAttribute("class").split(" ");
					for (var i = 0; i < cL.length; i++){
						if(cL[i].indexOf("nFormat") > -1)
						{
							var format = cL[i].split('nFormat');
							oNewItem.format = format[1];
						}
					}
				}
				
				//link
				if($(node).children('a').length == 1 && oNewItem[0] != undefined)
				{
					oNewItem.hyperLink =  $(node).children('a').attr('href');
					if($(node).children('a').attr('title'))
						oNewItem.toolTip = $(node).children('a').attr('title');
					else
						oNewItem.toolTip = null;
				}
				else if(node.nodeName.toLowerCase() == 'a')
				{
					oNewItem.hyperLink =  $(node).attr('href');
					if($(node).attr('title'))
						oNewItem.toolTip = $(node).attr('title');
					else
						oNewItem.toolTip = null;
				}
                
                aResult.push(oNewItem);
                return aResult;
            },

			_IsBlockElem : function(name)
			{
				if( "p" == name || "div" == name || "ul" == name || "ol" == name || "li" == name || "table" == name ||
					"h1" == name || "h2" == name || "h3" == name || "h4" == name || "h5" == name || "h6" == name || "center" == name)
					return true;
				return false;
			},
			
			_countTags: function(node,array) 
			{
				var t = this;
				if (node && 1 == node.nodeType) {
					// берем его первый дочерний узел
					var child = node.firstChild;
					// пока узлы не закончились
					while (child) {
						//проверка на блочные элементы в родительском контенте
						var parent = $(child).parent();
						var checkBlockParent = false;
						while (parent.length != 0)
						{
							if(t._IsBlockElem(parent[0].nodeName.toLowerCase()))
							{
								checkBlockParent = true;
								break;
							}
							parent = parent.parent();
						}
						
						if (t._IsBlockElem(child.nodeName.toLowerCase()) && $(child).find("p,div,ul,ol,li,table,h1,h2,h3,h4,h5,h6,center").length == 0 || child.nodeName.toLowerCase() == 'table' ) {
							array[array.length] = child;
						}
						else if(!checkBlockParent && $(child).find("p,div,ul,ol,li,table,h1,h2,h3,h4,h5,h6,center").length == 0 && !t._IsBlockElem(child.nodeName.toLowerCase()) && (child.nodeName.toLowerCase() == 'span' || child.nodeName.toLowerCase() == 'a'))
							array[array.length] = child;
						
							// рекурсивно перечисляем дочерние узлы
							if(child.nodeName.toLowerCase() != 'table')
								t._countTags(child,array);
						child = child.nextSibling;
					}
				}
				return array;
			},
			
			_getSignTags: function(nodes)
			{
				 var newArr = [];
				 var k = 0;
				 for (var n = 0;n < nodes.length; ++n)
				 {
					if(!(nodes[n].nodeName.toLowerCase() == '#comment' || (nodes[n].nodeName.toLowerCase() == '#text' && nodes[n].textContent.replace(/(\r|\t|\n| )/g, '') == '')))
					{
						/*if($(nodes[n]).find("img").length != 0 && nodes[n].nodeName.toLowerCase() != 'table')//если в вставляемом фрагменте присутствует изображение
						{
							var images = $(nodes[n]).find("img");
							for(i = 0; i < images.length; ++i)
							{
								newArr[k] = images[i];
								k++;
							}
						}*/
						if($(nodes[n]).find("p,div,ul,ol,li,table,h1,h2,h3,h4,h5,h6,center,img").length != 0 && nodes[n].nodeName.toLowerCase() != 'table' && nodes[n].nodeName.toLowerCase() != 'img')
						{
							var isWrap = '';
							if(nodes[n].style && nodes[n].style.whiteSpace)
								isWrap = nodes[n].style.whiteSpace;
							Array.prototype.forEach.call(nodes[n].childNodes, function processElement(elem) {
								if(elem.style && elem.style.whiteSpace && elem.nodeName.toLowerCase() == 'div')
									isWrap = elem.style.whiteSpace;
								if (($(elem).find("p,div,ul,ol,li,table,h1,h2,h3,h4,h5,h6,center,img").length == 0 && elem.textContent.replace(/(\r|\t|\n| )/g, '') != '') || elem.nodeName.toLowerCase() == 'table' || elem.nodeName.toLowerCase() == 'img') {
									newArr[k] = elem;
									if(elem.style)
										newArr[k].style.whiteSpace = isWrap;
									k++;
								}
								if($(elem).find("p,div,ul,ol,li,table,h1,h2,h3,h4,h5,h6,center,img").length != 0 && elem.nodeName.toLowerCase() != 'table' && elem.nodeName.toLowerCase() != 'img')
									Array.prototype.forEach.call(elem.childNodes, processElement);
							});
						}
						else
						{
							newArr[k] = nodes[n];
							k++;
						}
					}
						
				 }
				 return newArr;
			},
			
            _editorPasteExec: function (worksheet, node, isText,onlyFromLocalStorage)
            {
				if(node == undefined)
					return;
				var pasteFragment = node;
                var t = this;
				
				if(isOnlyLocalBufferSafari && navigator.userAgent.toLowerCase().indexOf('safari') > -1 && navigator.userAgent.toLowerCase().indexOf('mac'))
					onlyFromLocalStorage = true;
				
				//если находимся внутри шейпа
				if(worksheet.objectRender.controller.curState.textObject && worksheet.objectRender.controller.curState.textObject.txBody)
				{
					if(onlyFromLocalStorage)
					{
						if(t.lStorage && t.lStorage.htmlInShape)
							worksheet.objectRender.controller.curState.textObject.txBody.insertHtml(t.lStorage.htmlInShape);
					}
					else
						worksheet.objectRender.controller.curState.textObject.txBody.insertHtml(node);
					window.GlobalPasteFlag = false;
					window.GlobalPasteFlagCounter = 0;
					return;
				}
				
				//****binary****
				if(copyPasteUseBinary)
				{
					var base64 = null;
					if(onlyFromLocalStorage)
					{
						if(typeof t.lStorage == "object")
						{
							if(t.lStorage.htmlInShape)
							{
								node = t.lStorage.htmlInShape;
								pasteFragment = node;
							}
							else
							{
								worksheet.setSelectionInfo('paste',t,false,true);
								window.GlobalPasteFlag = false;
								window.GlobalPasteFlagCounter = 0;
								return;
							}
						}
						else
							base64 = t.lStorage;
					}
					else//find class xsl
					{
						var base64 = null;
						var base64FromWord = null;
						var classNode;
						if(node.children[0] && node.children[0].getAttribute("class") != null && (node.children[0].getAttribute("class").indexOf("xslData;") > -1 || node.children[0].getAttribute("class").indexOf("docData;") > -1))
							classNode = node.children[0].getAttribute("class");
						else if(node.children[0] && node.children[0].children[0] && node.children[0].children[0].getAttribute("class") != null && (node.children[0].children[0].getAttribute("class").indexOf("xslData;") > -1 || node.children[0].children[0].getAttribute("class").indexOf("docData;") > -1))
							classNode = node.children[0].children[0].getAttribute("class");
						else if(node.children[0] && node.children[0].children[0] && node.children[0].children[0].children[0] && node.children[0].children[0].children[0].getAttribute("class") != null && (node.children[0].children[0].children[0].getAttribute("class").indexOf("xslData;") > -1 || node.children[0].children[0].children[0].getAttribute("class").indexOf("docData;") > -1))
							classNode = node.children[0].children[0].children[0].getAttribute("class");
						
						if( classNode != null ){
							var cL = classNode.split(" ");
							for (var i = 0; i < cL.length; i++){
								if(cL[i].indexOf("xslData;") > -1)
								{
									base64 = cL[i].split('xslData;')[1];
								}
								else if(cL[i].indexOf("docData;") > -1)
								{
									base64FromWord = cL[i].split('docData;')[1];
								}
							}
						}
					}
					if(base64 != null)
					{
						var oBinaryFileReader = new BinaryFileReader(null, true);
						var tempWorkbook = new Workbook;
						oBinaryFileReader.Read(base64, tempWorkbook);
						this.activeRange = oBinaryFileReader.copyPasteObj.activeRange;
						var pasteData = null;
						if (tempWorkbook)
							pasteData = tempWorkbook.aWorksheets[0];
						if (pasteData) {
							History.TurnOn();
							if(pasteData.Drawings && pasteData.Drawings.length)
								t._insertImagesFromBinary(worksheet, pasteData);
							else {
								var newFonts = {};
								pasteData.generateFontMap(newFonts);
								worksheet._loadFonts(newFonts, function() {
									worksheet.setSelectionInfo('paste', pasteData, false, "binary");
								});
							}
							window.GlobalPasteFlag = false;
							window.GlobalPasteFlagCounter = 0;
							return;
						}
					} else if (base64FromWord && copyPasteFromWordUseBinary) {
						var pasteData = this.ReadFromBinaryWord(base64FromWord);
						var pasteFromBinaryWord = new Asc.pasteFromBinaryWord(this, worksheet);
						pasteFromBinaryWord._paste(worksheet, pasteData);
						window.GlobalPasteFlag = false;
						window.GlobalPasteFlagCounter = 0;
						return;
					}
				}
				
				if(activateLocalStorage)
				{
					//в случае вставки по нажатию на правую кнопку мыши
					if(onlyFromLocalStorage)
					{
						if(t.lStorage)
						{
							if(t.copyText && t.copyText.isImage)
							{
								if(t._insertImages(worksheet,t.lStorage,onlyFromLocalStorage))
								{
									window.GlobalPasteFlag = false;
									window.GlobalPasteFlagCounter = 0;
									return;
								}
							}
							else
							{
								if(t.lStorage.htmlInShape)
								{
									node = t.lStorage.htmlInShape;
									pasteFragment = node;
								}
								else
								{
									worksheet.setSelectionInfo('paste',t,false,true);
									window.GlobalPasteFlag = false;
									window.GlobalPasteFlagCounter = 0;
									return;
								}
							}	
						}	
					}
					
					//проверяем на равенство содержимому локального буфера
					var textNode = t._getTextFromTable(node);
					if(t._isEqualText(textNode, node) && !onlyFromLocalStorage)
					{
						if(t.copyText.isImage)
						{
							if(t._insertImages(worksheet,t.lStorage,onlyFromLocalStorage))
							{
								window.GlobalPasteFlag = false;
								window.GlobalPasteFlagCounter = 0;
								return;
							}
						}
						else
						{
							worksheet.setSelectionInfo('paste',t,false,true);
							window.GlobalPasteFlag = false;
							window.GlobalPasteFlagCounter = 0;
							return;
						}	
					}
				}
				
                var aResult = [];
                var range = worksheet.activeRange.clone(true);
				var testFragment = $.extend(true, {},node);
				var is_chrome = AscBrowser.isChrome;
				$(testFragment).children('br').remove();
				
				//в случае если приходит простой текст, преращаем его в корректную html - проблема характерна для FF
				if(testFragment.children.length == 0)
				{
					var allChild = node.childNodes;
					var sHtml = '';
					for (n = 0; n < allChild.length; ++n) {
						text = allChild[n].nodeValue.replace(/(\r|\t|\n)/g, '');
						if(allChild[n].nodeName.toLowerCase() == '#text' && text != '')
						{
							sHtml += "<p><span style='font-family:Calibri;font-size:11pt;white-space:nowrap'>" + text + "</span></p>"
						}
					}
					if(sHtml == '')
						return;
					pasteFragment.innerHTML = sHtml;
					if(!is_chrome)
					  isText = true;
				}
				/*else
				{
					$(pasteFragment).children('br').remove()
				}*/
				
                
                //var children = t._getSignChildNodes(pasteFragment.childNodes);
				var mainChildrens = t._getSignTags(pasteFragment.childNodes);
				var countChild = mainChildrens.length;
				
                //определяем размер квадрата вставки
                var arrMax = [];
                for (n = 0;n < $(pasteFragment).find('table').length; ++n) {
                    arrMax[n] = $($(pasteFragment).find('table')[n]).find('tr')[0].children.length;
                }
                if(arrMax.length != 0)
                {
                    var max = Math.max.apply( Math, arrMax );
					if(max != 0)
						range.c2 = range.c2 + max - 1;
                }
				this.fontsNew = {};

				var cellCountAll = [];
				var rowSpanPlus = 0;
				var tableRowCount = 0;
				var l = 0;
                var n = 0;
				var s = 0;
				var countEmptyRow = 0;
				var rowCount = 0;
				if(null != $(pasteFragment).find('table') && 1 == countChild && pasteFragment.children[0] != undefined && pasteFragment.children[0].children[0] != undefined && pasteFragment.children[0].children[0].nodeName.toLowerCase() == 'table')
				{
					pasteFragment = pasteFragment.children[0];
				}
				var arrTags = [];
				var countTrueTags = t._countTags(mainChildrens,arrTags);

				if(countTrueTags.length != 0 && node.length != countTrueTags.length && node.children[0] != countTrueTags[0])
				{
					var p = document.createElement('p');
					$(p).append(countTrueTags);
					pasteFragment = p;
					countChild = p.childNodes.length;
					mainChildrens = pasteFragment.childNodes;
				}
				if(!mainChildrens)
				{
					countChild = pasteFragment.children.length;
					mainChildrens = pasteFragment.children;
				}
				
				var addImages = null;
				var imCount = 0;
				//пробегаемся по html
                for (var r = range.r1;r - range.r1 < countChild; ++r) {//цикл по r
					var firstRow = mainChildrens[r - range.r1 - countEmptyRow];
                    if(firstRow.nodeName.toLowerCase() == 'br')
                        r++;
                    aResult[r + tableRowCount] = [];
                    var tag = mainChildrens[r - range.r1 - countEmptyRow];
					if(pasteFragment.children.length == 1 && pasteFragment.children[0].nodeName.toLowerCase() == 'table')
						aResult.isOneTable = true;
                    for (var c = range.c1; c <= range.c2; ++c) {
                        if((tag.nodeName.toLowerCase() == 'div' || tag.nodeName.toLowerCase() == 'p' || tag.nodeName.toLowerCase() == 'h' ||  tag.nodeName.toLowerCase().search('h') != -1) && c == range.c1 || tag.nodeName.toLowerCase() == 'li')
						{
							var prevSib = mainChildrens[r - range.r1 - countEmptyRow -1];
							//в случае если тег р следует за таблицей или таким же тегом, пропускаем строчку
							if(prevSib)
							{
								if(prevSib.nodeName.toLowerCase() == 'table')
								{
									var emtyTag =  document.createElement('p');
									aResult[r + tableRowCount][c] = t._getArray(emtyTag,isText);
									countChild++;
									r++;
									countEmptyRow++;
									aResult[r + tableRowCount] = [];
								}
							}
							tag.innerHTML = tag.innerHTML.replace(/(\n)/g, '');
							aResult[r + tableRowCount][c] = t._getArray(tag,isText);
							c = range.c2;
							cellCountAll[s] = 1;
							s++;
						}
						else if(tag.nodeName.toLowerCase() == '#text')
						{
								var prevSib = $(tag).prev();
								//в случае если тег р следует за таблицей или таким же тегом, пропускаем строчку
								if(prevSib.length != 0)
								{
									if(prevSib[prevSib.length - 1].nodeName.toLowerCase() == 'p' || prevSib[prevSib.length - 1].nodeName.toLowerCase() == 'table')
									{
										var emtyTag =  document.createElement('p');
										aResult[r + tableRowCount][c] = t._getArray(emtyTag,isText);
										countChild++;
										r++;
										countEmptyRow++;
										aResult[r + tableRowCount] = [];
									}
								}
								var span = document.createElement('p');
								$(span).append(tag);
								aResult[r + tableRowCount][c] = t._getArray(span,isText);
								c = range.c2;
								cellCountAll[s] = 1;
								s++;
							
						}
                        else if(tag.nodeName.toLowerCase() == 'span' || tag.nodeName.toLowerCase() == 'a' || tag.nodeName.toLowerCase() == 'form')
						{
							aResult[r + tableRowCount][c] = t._getArray(tag,isText);
							cellCountAll[s] = 1;
							c = range.c2;
							s++;
						}
                        else if(tag.nodeName.toLowerCase() == 'table')
                        {
                            var startNum = r + tableRowCount;
                            var tableBody = tag.getElementsByTagName('tbody')[0];
                            var n = 0;
							var arrCount = [];
                            var cellCount = 0;
							for(var i = 0;i < tableBody.children.length;++i)
                            {
								arrCount[i]  = 0;
								for(var j = 0;j < tableBody.children[i].children.length;++j)
								{
									arrCount[i] += tableBody.children[i].children[j].colSpan;
								}
                            }
							cellCount = Math.max.apply({}, arrCount);
							for(var i = 0;i < tableBody.children.length;++i)
                            {
                                if(tableBody.children[i].children[0] != undefined && (tableBody.children[i].children.length == cellCount|| tableBody.children[i].children[0].colSpan == cellCount))
									rowCount += tableBody.children[i].children[0].rowSpan;
                            }
							aResult.rowCount = tag.rows.length;
							if(tag.rows[0].children[0] != undefined && rowCount > tag.rows.length)
							{
								aResult.rowCount = rowCount;
							}
								
							
                            var mergeArr = [];
                            
							if(tableBody.children.length == 1 && tableBody.children[0].children.length == 1 && tableBody.children[0].children[0].rowSpan != '' && tableBody.children[0].children[0].rowSpan != null)
								rowSpanPlus = tableBody.children[0].children[0].rowSpan - 1;
                            //aResult.cellCount = cellCount;
							cellCountAll[s] = cellCount;
							s++;
							/*if(tag.children.length == 1 && tag.children[0].children.length == 1 && tag.offsetParent != null && tag.offsetParent != undefined && tag.offsetParent.children.length == 1 && $(tag).find('td')[0].rowSpan == 1 && $(tag).find('td')[0].colSpan == 1 && isMerge.hasMerged() == null && tableBody.children.length == 1 && tableBody.children[0].children != undefined && tableBody.children[0].children.length == 1)//сделать ещё для вставки из Excel
							{
								for (tR = startNum; tR <= range.r2; ++tR) {
									aResult[tR] = [];
									var cNew = 0;
									for(tC = range.c1; tC <= range.c2; ++tC) {
										var _tBody = tableBody.children[0].children[0];
										aResult[tR][tC] = t._getArray(_tBody);
									}
								}
								cellCountAll[s] = range.c2 - range.c1 + 1;
								s++;
								r = tR;
								break;
							}
							else
							{*/
								for (var tR = startNum; tR < tableBody.children.length + startNum; ++tR) {
									aResult[tR] = [];
									var cNew = 0;
									for(var tC = range.c1; tC < range.c1 + cellCount; ++tC) {
										
										if(0 != mergeArr.length)
										{
											for(var k = 0; k < mergeArr.length; ++k)
											{
												if(tC >= mergeArr[k].c1 && tC <= mergeArr[k].c2 && tR >= mergeArr[k].r1 && tR <= mergeArr[k].r2)
												{
													break;
												}
												else if (k == mergeArr.length -1)
												{	
													var _tBody = tableBody.children[tR -startNum ].children[cNew];
													var findImg = $(_tBody).find('img');
													if(findImg.length != 0)
													{
														for(var imgCol = 0; imgCol < findImg.length; imgCol++)
														{
															if(addImages == null)
																addImages = [];
															var curCell = {
																col: tC ,
																row: tR + imgCol
															};
															var tag = $(_tBody).find('img')[imgCol];
															addImages[imCount] = 
															{
																curCell: curCell,
																tag: tag
															};
															imCount++;
														}
														
														//worksheet.objectRender.addImageDrawingObject(tag.src, { cell: curCell, width: tag.width, height: tag.height });
													}
													if(_tBody == undefined)
														_tBody = document.createElement('td');
													aResult[tR][tC] = t._getArray(_tBody,isText);
													if(undefined != _tBody && (_tBody.colSpan > 1 || _tBody.rowSpan > 1))
													{
														mergeArr[n++] = {
															r1: tR,
															r2: tR + _tBody.rowSpan - 1,
															c1: tC,
															c2: tC + _tBody.colSpan - 1
														}
													}
													 cNew++;
												}
											}
										}
										else
										{
											var _tBody = tableBody.children[tR -startNum ].children[cNew];
											var findImg = $(_tBody).find('img');
											if(findImg.length != 0)
											{
												for(var imgCol = 0; imgCol < findImg.length; imgCol++)
												{
													if(addImages == null)
														addImages = [];
													var curCell = {
														col: tC,
														row: tR + imgCol
													};
													var tag = $(_tBody).find('img')[imgCol];
													addImages[imCount] = 
													{
														curCell: curCell,
														tag: tag
													};
													imCount++;
												}
												
												//worksheet.objectRender.addImageDrawingObject(tag.src, { cell: curCell, width: tag.width, height: tag.height });
											}
											aResult[tR][tC] = t._getArray(_tBody,isText);
											if(undefined != _tBody && (_tBody.colSpan > 1 || _tBody.rowSpan > 1))
											{
												mergeArr[n++] = {
													r1: tR,
													r2: tR + _tBody.rowSpan - 1,
													c1: tC,
													c2: tC + _tBody.colSpan - 1
												}
											}
											cNew++;
										}
									}
								}
								//tableRowCount += tableBody.children.length + 1;
								if(countChild == 1)//если только таблица приходит
									r = tR;
								else//если помимо таблицы есть ещё и прочее содержимое
									tableRowCount += tableBody.children.length -1;
								break;
							//}
                            
                        }
						else if(tag.nodeName.toLowerCase() == 'img')
						{
							var curCell = {
								col: c,
								row: r + tableRowCount
							};
							if(addImages == null)
								addImages = [];
							addImages[imCount] = 
							{
								curCell: curCell,
								tag: tag
							};
							imCount++;
							c = range.c2;
						}
                        else
						{
							var textArr;
							if((mainChildrens[r - range.r1] == undefined || mainChildrens[r - range.r1].innerText == undefined || mainChildrens[r - range.r1].innerText == null) && ($(mainChildrens[r - range.r1]).text() == undefined || $(mainChildrens[r - range.r1]).text() == null))
							{
								textArr = [];
								textArr[0] = '';
							}
							else
							{
								var text = tag.innerText;
								if(text == undefined)
									text = $(tag).text();
								textArr = text.split('\n');
							}
								
							for(k=0;k < textArr.length ; ++k)
							{
								aResult[r + tableRowCount] = [];
								var newP = document.createElement('p');
								var newSpan = document.createElement('span');
								$(newP).append(newSpan);
								newSpan.innerText = textArr[k];
								$(newSpan).text(textArr[k]);
								aResult[r + tableRowCount][c] = t._getArray(newP,isText);
								if(textArr.length != 1 && (textArr.length - 1) != k)
									r++;
							}
							c = range.c2;
							cellCountAll[s] = 1;
							s++;
						}
                    }
                }
				if(cellCountAll.length == 0)
					aResult.cellCount = 0;
				else
					aResult.cellCount = Math.max.apply(Math, cellCountAll);
				aResult.rowSpanSpCount = rowSpanPlus;
				var api = window["Asc"]["editor"];
				if(!api || (api && !api.isChartEditor))
					aResult.addImages = addImages;
				aResult.fontsNew = t.fontsNew;
				worksheet.setSelectionInfo('paste',aResult,t);
				window.GlobalPasteFlagCounter = 0;
				window.GlobalPasteFlag = false;
            },
			
			ReadFromBinaryWord : function(sBase64)
			{
				//TODO ПРОСМОТРЕТЬ ВСЕ ЗАКОММЕНТИРОВАННЫЕ ОБЛАСТИ!!!!
				
				//надо сбросить то, что остался после открытия документа
				//window.global_pptx_content_loader.Clear();
				//window.global_pptx_content_loader.Start_UseFullUrl();		
				var openParams = {checkFileSize: false, charCount: 0, parCount: 0};
				var newCDocument = new CDocument2();
				var oBinaryFileReader = new BinaryFileReader2(newCDocument, openParams);
				oBinaryFileReader.stream = oBinaryFileReader.getbase64DecodedData(sBase64);
				oBinaryFileReader.ReadMainTable();
				
				//обрабатываем списки
				/*for(var i in oReadResult.numToNumClass)
				{
					var oNumClass = oReadResult.numToNumClass[i];
					var documentANum = this.oDocument.Numbering.AbstractNum;
					//проверка на уже существующий такой же AbstractNum
					var isAlreadyContains = false;
					for(var n in documentANum)
					{
						var isEqual = documentANum[n].isEqual(oNumClass);
						if(isEqual == true)
						{
							isAlreadyContains = true;
							break;
						}
					}
					if(!isAlreadyContains)
					{
						this.oDocument.Numbering.Add_AbstractNum(oNumClass);
					}
					else
						oReadResult.numToNumClass[i] = documentANum[n];
						
				}
				for(var i = 0, length = oReadResult.paraNumPrs.length; i < length; ++i)
				{
					var numPr = oReadResult.paraNumPrs[i];
					var oNumClass = oReadResult.numToNumClass[numPr.NumId];
					if(null != oNumClass)
						numPr.NumId = oNumClass.Get_Id();
					else
						numPr.NumId = 0;
				}*/
				//обрабатываем стили
				var isAlreadyContainsStyle;
				var api = this.api;
				var oStyleTypes = {par: 1, table: 2, lvl: 3};
				var addNewStyles = false;
				var fParseStyle = function(aStyles, oDocumentStyles, oReadResult, nStyleType)
				{
					if(aStyles == undefined)
						return;
					for(var i = 0, length = aStyles.length; i < length; ++i)
					{
						var elem = aStyles[i];
						var stylePaste = oReadResult.styles[elem.style];
						var isEqualName = null;
						if(null != stylePaste && null != stylePaste.style)
						{
							for(var j in oDocumentStyles.Style)
							{
								var styleDoc = oDocumentStyles.Style[j];
								isAlreadyContainsStyle = styleDoc.isEqual(stylePaste.style);
								if(styleDoc.Name == stylePaste.style.Name)
									isEqualName = j;
								if(isAlreadyContainsStyle)
								{
									if(oStyleTypes.par == nStyleType)
										elem.pPr.PStyle = j;
									else if(oStyleTypes.table == nStyleType)
										elem.pPr.Set_TableStyle2(j);
									else
										elem.pPr.PStyle = j;
									break;
								}
							}
							if(!isAlreadyContainsStyle && isEqualName != null)//если нашли имя такого же стиля
							{
								if(nStyleType == oStyleTypes.par || nStyleType == oStyleTypes.lvl)
									elem.pPr.PStyle = isEqualName;
								else if (nStyleType == oStyleTypes.table)
									elem.pPr.Set_TableStyle2(isEqualName);
							}
							else if(!isAlreadyContainsStyle && isEqualName == null)//нужно добавить новый стиль
							{
								//todo править и BaseOn
								var nStyleId = oDocumentStyles.Add(stylePaste.style);
								if(nStyleType == oStyleTypes.par || nStyleType == oStyleTypes.lvl)
									elem.pPr.PStyle = nStyleId;
								else if (nStyleType == oStyleTypes.table)
									elem.pPr.Set_TableStyle2(nStyleId);
								addNewStyles = true;
							}
						}
					}
				}

				fParseStyle(oBinaryFileReader.oReadResult.paraStyles, newCDocument.Styles, oBinaryFileReader.oReadResult, oStyleTypes.par);
				fParseStyle(oBinaryFileReader.oReadResult.tableStyles, newCDocument.Styles, oBinaryFileReader.oReadResult, oStyleTypes.table);
				fParseStyle(oBinaryFileReader.oReadResult.lvlStyles, newCDocument.Styles, oBinaryFileReader.oReadResult, oStyleTypes.lvl);
				
				return oBinaryFileReader.oReadResult;
					
				/*var aContent = oBinaryFileReader.oReadResult.DocumentContent;
				for(var i = 0, length = oBinaryFileReader.oReadResult.aPostOpenStyleNumCallbacks.length; i < length; ++i)
					oBinaryFileReader.oReadResult.aPostOpenStyleNumCallbacks[i].call();
				if(oReadResult.bLastRun)
					this.bInBlock = false;
				else
					this.bInBlock = true;
				//создаем список используемых шрифтов
				var AllFonts = {};
				this.oDocument.Numbering.Document_Get_AllFontNames(AllFonts);
				this.oDocument.Styles.Document_Get_AllFontNames(AllFonts);
				for ( var Index = 0, Count = aContent.length; Index < Count; Index++ )
					aContent[Index].Document_Get_AllFontNames( AllFonts );
				var aPrepeareFonts = [];
				for(var i in AllFonts)
					aPrepeareFonts.push(new CFont(i, 0, "", 0));
				//создаем список используемых картинок
				var oPastedImagesUnique = {};
				var aPastedImages = window.global_pptx_content_loader.End_UseFullUrl();
				for(var i = 0, length = aPastedImages.length; i < length; ++i)
				{
					var elem = aPastedImages[i];
					oPastedImagesUnique[elem.Url] = 1;
				}
				var aPrepeareImages = [];
				for(var i in oPastedImagesUnique)
					aPrepeareImages.push(i);
				return {content: aContent, fonts: aPrepeareFonts, images: aPrepeareImages, bAddNewStyles: addNewStyles, aPastedImages: aPastedImages};*/
			},
			
			_isEqualText: function(node, table){
				var t = this;
				if(undefined == t.copyText || node == undefined)
					return false;
				//если приходят картинки, вставляем извне	
				if(t.copyText.isImage)
				{
					return false;
				}	
				if(t.copyText.text && AscBrowser.isOpera && node.text.replace(/(\r|\t|\n| |\s)/g, "") == t.copyText.text.replace(/(\r|\t|\n| |\s)/g, ""))
					return true;
				if(AscBrowser.isIE && t.copyText.text != undefined && node.text != undefined &&  node.text == "" && t.copyText.isImage)
					return true;
				if(t.copyText.text != undefined && node.text != undefined && node.text == t.copyText.text)
				{
					if(t.copyText.isImage)
						return true;
					else if(node.rows && t.copyText.rows && node.rows == t.copyText.rows && node.cols && t.copyText.cols && node.cols == t.copyText.cols)
						return true;
				}

                if(table && table.children[0] && node.text.replace(/(\r|\t|\n| |\s)/g, "") == t.copyText.text.replace(/(\r|\t|\n| |\s)/g, ""))
                {
                    if( table.children[0].getAttribute("class") != null ){
                        var cL = table.children[0].getAttribute("class").split(" ");
                        for (var i = 0; i < cL.length; i++){
                            if(cL[i].indexOf("pasteFragment_") > -1){
                                if(cL[i] == t.copyText.pasteFragment)
                                    return true;
                                else
                                    break;
                            }
                        }
                    }
                }
				return false;
			},
			
			_selectElement: function (callback) {
				var t = this, selection, rangeToSelect;

				if (window.getSelection) {// all browsers, except IE before version 9
					selection = window.getSelection();
					rangeToSelect = doc.createRange();
					// в FF 8 после выделения selectNodeContents копируется и родительский div,
					// чтобы этого избежать в FF8 и других браузерах новых или стаых версий
					// добавляем дополнительные node
					// Оставить этот код для остальных браузеров не получилось. Chrome начала
					// вставлять разрыв линии перед первым параграфом
					if (AscBrowser.isGecko) {
						t.element.appendChild(doc.createTextNode('\xa0'));
						t.element.insertBefore(doc.createTextNode('\xa0'), t.element.firstChild);
						rangeToSelect.setStartAfter(t.element.firstChild);
						rangeToSelect.setEndBefore(t.element.lastChild);
					} else {
						rangeToSelect.selectNodeContents(t.element);
					}
					selection.removeAllRanges();
					selection.addRange(rangeToSelect);
				} else {
					if (doc.body.createTextRange) {// Internet Explorer
						rangeToSelect = doc.body.createTextRange();
						rangeToSelect.moveToElementText(t.element);
						rangeToSelect.select();
					}
				}
				
				var time_interval = 200;
				
				// ждем выполнения copy
				window.setTimeout(
						function() {
							// отменяем возможность выделения
							t.element.style.display = ELEMENT_DISPAY_STYLE;
							doc.body.style.MozUserSelect = "none";
							doc.body.style["-khtml-user-select"] = "none";
							doc.body.style["-o-user-select"] = "none";
							doc.body.style["user-select"] = "none";
							doc.body.style["-webkit-user-select"] = "none";
							// for paste event
							if (callback && callback.call) {callback();}
						},
						time_interval);
			},

			_makeNodesFromCellValue: function (val, defFN, defFS,isQPrefix,isFormat,cell) {
				var i, res, span, f;

				function getTextDecoration(format) {
					var res = [];
					if (format.u !== "none") {res.push("underline");}
					if (format.s) {res.push("line-through");}
					return res.length > 0 ? res.join(",") : "";
				}
				var hyperlink;
				if(cell)
					hyperlink = cell.getHyperlink();
				for (res = [], i = 0; i < val.length; ++i) {
					if(val[i] && val[i].format && val[i].format.skip)
						continue;
					if(cell == undefined || (cell != undefined && (hyperlink == null || (hyperlink != null && hyperlink.getLocation() != null))))
						span = doc.createElement("SPAN");
					else
					{
						span = doc.createElement("A");
						if(hyperlink.Hyperlink != null)
							span.href = hyperlink.Hyperlink;
						else if(hyperlink.getLocation() != null)
							span.href = "#" + hyperlink.getLocation();
						if(hyperlink.Tooltip != null)
							span.title = hyperlink.Tooltip;
					}
					if( val[i].sFormula ){
						span.textContent = val[i].text;
						$(span).addClass("cellFrom_"+val[i].sId + "textFormula_" + "=" + val[i].sFormula);
					}
					else{
						span.textContent = val[i].text;
						if(isQPrefix)
							$(span).addClass("qPrefix");
						else if(isFormat && isFormat.f && isFormat.wFormat)
						{
							var text = '';
							for (var k = 0; k < val.length; ++k) {
								text += val[k].text;
							}
							span.textContent = text;
							i = val.length - 1;
						}
					}
					f = val[i].format;
					if (f.c) {span.style.color = number2color(f.c);}
					if (f.fn !== defFN) {span.style.fontFamily = f.fn;}
					if (f.fs !== defFS) {span.style.fontSize = f.fs + 'pt';}
					if (f.b) {span.style.fontWeight = 'bold';}
					if (f.i) {span.style.fontStyle = 'italic';}
					span.style.textDecoration = getTextDecoration(f);
					span.style.verticalAlign = f.va === 'subscript' ? 'sub' : f.va === 'superscript' ? 'super' : 'baseline';
					span.innerHTML = span.innerHTML.replace(/\n/g,'<br>');
					res.push(span);
				}
				return res;
			},

			_addValueToLocalStrg: function (value) {
				var t = this;
				var isNull = 0;
				if(!value || !value[isNull])
					return;
				
				t.lStorage = [];
				t.lStorage.fromRow = isNull;
				t.lStorage.fromCol = isNull;
				t.lStorageText = value[isNull].text;
				var val2 = [];
				val2[isNull] = 
				{
					text: value[isNull].text,
					format: value[isNull].format
				};
				t.lStorage[isNull] = [];
				t.lStorage[isNull][isNull] = 
				{
					value2: val2,
					wrap: true,
					format: false
				}
			},
			
			_makeTableNode: function (range, worksheet, isCut) {
				var fn = range.worksheet.workbook.getDefaultFont();
				var fs = range.worksheet.workbook.getDefaultSize();
				var bbox = range.getBBox0();
				var merged = [];
				var t = this;
				var table, tr, td, cell, j, row, col, mbbox, h, w, b;

				function skipMerged() {
					var m = merged.filter(function(e){return row>=e.r1 && row<=e.r2 && col>=e.c1 && col<=e.c2});
					if (m.length > 0) {
						col = m[0].c2;
						return true;
					}
					return false;
				}

				function makeBorder(border) {
					if (!border || border.s === c_oAscBorderStyles.None)
						return "";

					var style = "";
					switch(border.s) {
						case c_oAscBorderStyles.Thin:
							style = "solid";
							break;
						case c_oAscBorderStyles.Medium:
							style = "solid";
							break;
						case c_oAscBorderStyles.Thick:
							style = "solid";
							break;
						case c_oAscBorderStyles.DashDot:
						case c_oAscBorderStyles.DashDotDot:
						case c_oAscBorderStyles.Dashed:
							style = "dashed";
							break;
						case c_oAscBorderStyles.Double:
							style = "double";
							break;
						case c_oAscBorderStyles.Hair:
						case c_oAscBorderStyles.Dotted:
							style = "dotted";
							break;
						case c_oAscBorderStyles.MediumDashDot:
						case c_oAscBorderStyles.MediumDashDotDot:
						case c_oAscBorderStyles.MediumDashed:
						case c_oAscBorderStyles.SlantDashDot:
							style = "dashed";
							break;
					}
					return border.w + "px " + style + " " + number2color(border.getRgbOrNull());
				}

				table = doc.createElement("TABLE");
				table.cellPadding = "0";
				table.cellSpacing = "0";
				table.style.borderCollapse = "collapse";
				table.style.fontFamily = fn;
				table.style.fontSize = fs + "pt";
				table.style.color = "#000";
				table.style.backgroundColor = "transparent";
				
				var isSelectedImages = t._getSelectedDrawingIndex(worksheet);
				var isImage = false;
				var isChart = false;
				
				var objectRender = worksheet.objectRender;
				//копируем изображения
				//если выделены графические объекты внутри группы
				if(isSelectedImages && isSelectedImages != -1 && objectRender.controller.curState.group && objectRender.controller.curState.group.selectedObjects)
				{
					if(this.Api && this.Api.isChartEditor)
						return false;
					objectRender.preCopy();
					var nLoc = 0;
					var table = document.createElement('span');
					var image;
					var drawings = objectRender.controller.curState.group.selectedObjects;
					t.lStorage = [];
					for (j = 0; j < drawings.length; ++j) {
						image = drawings[j].drawingBase;
						if(!image)
						{
							image = objectRender.createDrawingObject();
							image.graphicObject = drawings[j];
						}
						var cloneImg = objectRender.cloneDrawingObject(image);
						var curImage = new Image();
						var url;

						if(cloneImg.graphicObject.isChart() && cloneImg.graphicObject.brush.fill.RasterImageId)
							url = cloneImg.graphicObject.brush.fill.RasterImageId;
						else if(cloneImg.graphicObject && (cloneImg.graphicObject.isShape() || cloneImg.graphicObject.isImage() || cloneImg.graphicObject.isGroup() || cloneImg.graphicObject.isChart()))
						{
							var cMemory = new CMemory();
							var altAttr = cloneImg.graphicObject.writeToBinaryForCopyPaste(cMemory);
							var isImage = cloneImg.graphicObject.isImage();
							var imageUrl;
							if(isImage)
								imageUrl = cloneImg.graphicObject.getImageUrl();
							if(isImage && imageUrl)
								url = imageUrl;
							else
								url = cloneImg.graphicObject.getBase64Image();
							curImage.alt = altAttr;
						}
						else
							url = cloneImg.image.src;
							
						curImage.src = url;
						curImage.width = cloneImg.getWidthFromTo();
						curImage.height = cloneImg.getHeightFromTo();
						if(image.guid)
							curImage.name = image.guid;
						
						table.appendChild(curImage);
						
						//add image or chart in local buffer
							t.lStorage[nLoc] = {};
							t.lStorage[nLoc].image = curImage;
							t.lStorage[nLoc].fromCol = cloneImg.from.col;
							t.lStorage[nLoc].fromRow = cloneImg.from.row;
							nLoc++;
							isImage = true;
						
						t._addLocalStorage(isImage,isChart,range.worksheet.getCell( new CellAddress(row, col, 0) ),bbox, image.from.row, image.from.col, worksheet, isCut);
					}
				}
				else if(isSelectedImages && isSelectedImages != -1 && objectRender.controller.curState.textObject && objectRender.controller.curState.textObject.txBody)//если курсор находится внутри шейпа
				{
					var htmlInShape = objectRender.controller.curState.textObject.txBody.getSelectedTextHtml();
					if((activateLocalStorage || copyPasteUseBinary) && htmlInShape)
					{
						t._addLocalStorage(false,false,currentRange,bbox,row,col, worksheet, isCut, htmlInShape);
					}
					if(!htmlInShape)
						htmlInShape = "";
					return htmlInShape;
				}
				else if(isSelectedImages && isSelectedImages != -1)
				{
					if(this.Api && this.Api.isChartEditor)
						return false;
					objectRender.preCopy();
					var nLoc = 0;
					var table = document.createElement('span');
					var drawings = worksheet.model.Drawings;
					t.lStorage = [];
					for (j = 0; j < isSelectedImages.length; ++j) {
						var image = drawings[isSelectedImages[j]];
						var cloneImg = objectRender.cloneDrawingObject(image);
						var curImage = new Image();
						var url;

						if(cloneImg.graphicObject.isChart() && cloneImg.graphicObject.brush.fill.RasterImageId)
							url = cloneImg.graphicObject.brush.fill.RasterImageId;
						else if(cloneImg.graphicObject && (cloneImg.graphicObject.isShape() || cloneImg.graphicObject.isImage() || cloneImg.graphicObject.isGroup() || cloneImg.graphicObject.isChart()))
						{
							var cMemory = new CMemory();
							var altAttr = cloneImg.graphicObject.writeToBinaryForCopyPaste(cMemory);
							var isImage = cloneImg.graphicObject.isImage();
							var imageUrl;
							if(isImage)
								imageUrl = cloneImg.graphicObject.getImageUrl();
							if(isImage && imageUrl)
								url = imageUrl;
							else
								url = cloneImg.graphicObject.getBase64Image();
							curImage.alt = altAttr;
						}
						else
							url = cloneImg.image.src;
							
						curImage.src = url;
						curImage.width = cloneImg.getWidthFromTo();
						curImage.height = cloneImg.getHeightFromTo();
						if(image.guid)
							curImage.name = image.guid;
						
						table.appendChild(curImage);
						
						//add image or chart in local buffer
							t.lStorage[nLoc] = {};
							t.lStorage[nLoc].image = curImage;
							t.lStorage[nLoc].fromCol = cloneImg.from.col;
							t.lStorage[nLoc].fromRow = cloneImg.from.row;
							nLoc++;
							isImage = true;
						
						t._addLocalStorage(isImage,isChart,range.worksheet.getCell( new CellAddress(row, col, 0) ),bbox, image.from.row, image.from.col, worksheet, isCut);
					}

				}
				else
				{
					if(activateLocalStorage || copyPasteUseBinary)
					{
						var localStText = '';
						//add local buffer
						for (row = bbox.r1; row <= bbox.r2; ++row) {
							if(row != bbox.r1)
								localStText += '\n';
							for (col = bbox.c1; col <= bbox.c2; ++col) {
								if(col != bbox.c1)
									localStText += ' ';
								var currentRange = range.worksheet.getCell( new CellAddress(row, col, 0) );
								//добавляем текст
								var textRange = currentRange.getValue();
								if(textRange == '')
									localStText += '\t';
								else
									localStText += textRange;
								//добавляем ноды
								if(!copyPasteUseBinary)
									t._addLocalStorage(false,false,currentRange,bbox,row,col, worksheet, isCut);
							}
						}
						t.lStorageText = localStText;
					}
					for (row = bbox.r1; row <= bbox.r2; ++row) {
						tr = doc.createElement("TR");
						h = range.worksheet.getRowHeight(row);
						if (h > 0) {tr.style.height = h + "pt";}

						for (col = bbox.c1; col <= bbox.c2; ++col) {
							if (skipMerged()) {continue;}

							cell = range.worksheet.getCell( new CellAddress(row, col, 0) );
							td = doc.createElement("TD");

							mbbox = cell.hasMerged();
							if (mbbox) {
								merged.push(mbbox);
								td.colSpan = mbbox.c2 - mbbox.c1 + 1;
								td.rowSpan = mbbox.r2 - mbbox.r1 + 1;
								for (w = 0, j = mbbox.c1; j <= mbbox.c2; ++j) {w += worksheet.getColumnWidth(j, 1/*pt*/);}
								td.style.width = w + "pt";
							} else {
								td.style.width = worksheet.getColumnWidth(col, 1/*pt*/) + "pt";
							}

							if (!cell.getWrap()) {td.style.whiteSpace = "nowrap";}else {td.style.whiteSpace = "normal";} 

							if(cell.getAlignHorizontal() != 'none')
								td.style.textAlign = cell.getAlignHorizontal();
							td.style.verticalAlign = cell.getAlignVertical();
							if(cell.getAlignVertical() == 'center')
								td.style.verticalAlign = 'middle';

							b = cell.getBorderFull();
							if(mbbox)
							{
								var cellMergeFinish = range.worksheet.getCell( new CellAddress(mbbox.r2, mbbox.c2, 0) );
								var borderMergeCell = cellMergeFinish.getBorderFull();
								td.style.borderRight = makeBorder(borderMergeCell.r);
								td.style.borderBottom = makeBorder(borderMergeCell.b);
							}
							else
							{
								td.style.borderRight = makeBorder(b.r);
								td.style.borderBottom = makeBorder(b.b);
							}	
							td.style.borderLeft = makeBorder(b.l);
							td.style.borderTop = makeBorder(b.t);

							
							var isFormat = {};
							isFormat.f = false;
							isFormat.wFormat = false;
							//add format
							if(cell.getNumFormat() != null && cell.getNumFormat() != undefined && cell.getNumFormat().oTextFormat.formatString != '' && cell.getNumFormat().oTextFormat.formatString != null && (cell.getType() == 'n' || cell.getType() == null || cell.getType() == 0) && cell.getNumFormatStr() != 'General')
							{
								var formatStr = t._encode(cell.getNumFormatStr());
								var valStr = t._encode(cell.getValueWithoutFormat());
								$(td).addClass("nFormat" + formatStr + ';' + valStr);
								isFormat.f = cell.getValueWithoutFormat();
								isFormat.wFormat = true;
							}
								
							
							b = cell.getFill();
							// если b==0 мы не зайдем в if, хотя b==0 это ни что иное, как черный цвет заливки.
							if (b!=null) {td.style.backgroundColor = number2color(b.getRgb());}

							var isQPrefix = cell.getQuotePrefix();
							this._makeNodesFromCellValue(cell.getValue2(), fn ,fs,isQPrefix,isFormat,cell).forEach(
									function(node){
										td.appendChild(node);
									});

							tr.appendChild(td);
						}
						table.appendChild(tr);
					}
				}
				

				return table;
			},
			
			_addLocalStorage : function (isImage,isChart,cell,activeRange,trueRow,trueCol, worksheet, isCut, htmlInShape) {
				var t = this;
				var numRow = activeRange.r1;
				var numCol = activeRange.c1;
				if(htmlInShape)
				{
					t.lStorage = {};
					t.lStorage.htmlInShape = htmlInShape;
				}
				else if(isChart)
				{
					t.lStorage = [];
					t.lStorage[0] = {};
					t.lStorage[0].isChart = isChart;
				}
				else if(!isImage)
				{
					var row = trueRow - numRow;
					var col = trueCol - numCol;
					if(row == 0 && col == 0)
					{
						t.lStorage = [];
						t.lStorage.fromRow = numRow;
						t.lStorage.fromCol = numCol;
					}
					if(t.lStorage[row] == undefined)
						t.lStorage[row] = [];
					var arrFragmentsTmp = cell.getValue2();
					var arrFragments = [];
					for (var i = 0; i < arrFragmentsTmp.length; ++i) {
						arrFragments.push(arrFragmentsTmp[i].clone());
					}
					t.lStorage[row][col] = 
					{
						value2: arrFragments,
						borders: cell.getBorderFull(),
						merge: cell.hasMerged(),
						format: cell.getNumFormat(),
						verAlign: cell.getAlignVertical(),
						horAlign: cell.getAlignHorizontal(),
						wrap: cell.getWrap(),
						fill: cell.getFill(),
						hyperlink: cell.getHyperlink(),
						valWithoutFormat: cell.getValueWithoutFormat(),
						angle: cell.getAngle()
					};
					if(cell.getQuotePrefix() && t.lStorage[row][col] && t.lStorage[row][col].value2 && t.lStorage[row][col].value2[0])
						t.lStorage[row][col].value2[0].text = "'" + t.lStorage[row][col].value2[0].text;
					//проверка на наличие автофильтров
					if(!t.lStorage.autoFilters)
					{
						var autoFiltersObj = worksheet.autoFilters;
						var findFilter = autoFiltersObj._searchFiltersInRange(activeRange, worksheet.model);
						if(findFilter && !findFilter[0].TableStyleInfo)
						{
							findFilter.splice(0, 1);
						}
						if(findFilter)
						{
							var ref;
							var style;
							var range;
							var tempRange;
							t.lStorage.autoFilters = [];
							for(var i = 0; i < findFilter.length; i++)
							{
								ref = findFilter[i].Ref;
								tempRange = autoFiltersObj._refToRange(ref);
								range = {r1: tempRange.r1 - activeRange.r1, c1: tempRange.c1 -  activeRange.c1, r2: tempRange.r2 - activeRange.r1, c2: tempRange.c2 -  activeRange.c1};
								style = findFilter[i].TableStyleInfo ? findFilter[i].TableStyleInfo.Name : null;
								t.lStorage.autoFilters[i] = 
								{
									style: style,
									range: range,
									autoFilter: findFilter[i].AutoFilter ? true : false
								}
							}
						}
					}
				}
			},

			_makeCellValuesHtml: function (node,isText) {
				//if (!callback || !callback.call) {return;}

				var t = this;
				var res = [];
				var maxSize = 100;
				var reQuotedStr = /['"]([^'"]+)['"]/;
				var reSizeStr = /\s*(\d+\.*\d*)\s*(em|ex|cm|mm|in|pt|pc|px|%)?\s*/i;

				function getFontName(style) {
					var fn = style.fontFamily.split(",")[0];
					var m = reQuotedStr.exec(fn);
					if (m) {fn = m[1];}
					switch (fn.toLowerCase()) {
						case "sans-serif": return "Arial";
						case "serif":      return "Times";
						case "monospace":  return "Courier";
					}
					return fn;
				}

				function getFontSize(style) {
					var fs = style.fontSize.toLowerCase();
					var defaultValue = '11';
					if(fs == undefined || fs == '')
						return defaultValue;
					var m = reSizeStr.exec(fs);
					var sz = m ? parseFloat(m[1]) : 0;
					if(sz > maxSize)
						sz = maxSize;
					return m[2] === "px" ? (sz / t.ppix * 72).toFixed(1)-0 : 0;
				}

				Array.prototype.forEach.call(node, function processElement(elem) {
					if (elem.nodeType === Node.TEXT_NODE || (elem.nodeName.toLowerCase() == 'br' && $(node).children('br').length != 0 && elem.parentNode.nodeName.toLowerCase() == 'span') || (elem.parentNode.getAttribute != undefined && elem.parentNode.getAttribute("class") != null && elem.parentNode.getAttribute("class") == "qPrefix") || (elem.getAttribute != undefined && elem.getAttribute("class") != null&& elem.getAttribute("class") == "qPrefix")) {
						if(elem.textContent.replace(/(\r|\t|\n| )/g, '') != '' || elem.textContent == ' ' || elem.nodeName.toLowerCase() == 'br')
						{
						var parent = elem.parentNode;
						if(elem.getAttribute != undefined && elem.getAttribute("class") == "qPrefix")
							parent = elem;
						var style = window.getComputedStyle(parent);
						var fn = getFontName(style);
						if(fn == '')
							fn = parent.style.fontFamily.replace(/'/g,""); 
						fn = t._checkFonts(fn);
						var fs = Math.round(getFontSize(style));
						var fb = style.fontWeight.toLowerCase();
						var fi = style.fontStyle.toLowerCase();
						var td = style.textDecoration.toLowerCase();
						var va = style.verticalAlign.toLowerCase();
						var prefix = "";
						
						var cL = null ,cellFrom = null, splitCL, text;
						if( parent.getAttribute("class") != null ){
							cL = parent.getAttribute("class").split(" ");
							for (var i = 0; i < cL.length; i++){
								if(cL[i].indexOf("cellFrom_") > -1){
									
									splitCL = cL[i].split('textFormula_');
									if(splitCL && splitCL[0] && splitCL[1])
									{
										cellFrom = splitCL[0].replace("cellFrom_","");
										text = splitCL[1];
									}
									else
										cellFrom = cL[i].replace("cellFrom_","");
									break;
								}
								else if(cL[i].indexOf("qPrefix") > -1)
								{
									prefix = "'";
									break;
								}
							}
						}
						if(!text)
							text = elem.textContent.replace('\t','');
						if(elem.nodeName.toLowerCase() == 'br')
							text = '\n';
						var colorText = new RgbColor(t._getBinaryColor(style.getPropertyValue("color"))); 
						if(isText || (isText == '' && typeof isText == 'string'))
							colorText = null;
						res.push({
								format: {
									fn: fn,
									fs: fs,
									c: colorText,
									b: fb.indexOf("bold") >= 0 || parseInt(fb, 10) > 500,
									i: fi.indexOf("italic") >= 0,
									u: td.indexOf("underline") >= 0 ? "single" : "none",
									s: td.indexOf("line-through") >= 0,
									va: va.indexOf("sub") >=0 ? "subscript" : va.indexOf("sup") >=0 ? "superscript" : "none"
								},
								text: prefix + text,
								cellFrom : cellFrom
							});
							//в одной ячейке находится несколько параграфов(при вставке таблицы), между параграфами добавляем символ переноса строки
							if(elem.parentElement && elem.parentElement.parentElement && elem.parentElement.parentElement.parentElement && elem.parentElement.parentElement.nodeName.toLowerCase() == 'p' && elem.parentElement.parentElement.parentElement.nodeName.toLowerCase() == 'td')
							{
								if(elem.parentElement.parentElement.nextSibling && elem.parentElement.parentElement.nextSibling.nodeName.toLowerCase() == 'p')
								{
									res.push({
										format: {
											fn: fn,
											fs: fs,
											c: colorText,
											b: fb.indexOf("bold") >= 0 || parseInt(fb, 10) > 500,
											i: fi.indexOf("italic") >= 0,
											u: td.indexOf("underline") >= 0 ? "single" : "none",
											s: td.indexOf("line-through") >= 0,
											va: va.indexOf("sub") >=0 ? "subscript" : va.indexOf("sup") >=0 ? "superscript" : "none"
										},
										text: '\n',
										cellFrom : cellFrom
									});
								}
								res.wrap = true;
							}
						if (fn !== "")
							t.fontsNew[fn] = 1;
						return;
						}
					}
					if(elem.childNodes == undefined)
						Array.prototype.forEach.call(elem, processElement);
					else
						Array.prototype.forEach.call(elem.childNodes, processElement);
				});
				return res;
			},
			
			_checkFonts: function (fontName) {
				//var defaultFont = 'Arial';
				var defaultFont = 'Calibri';
				if (null === this.Api)
					return defaultFont;
				if(this.Api.FontLoader.map_font_index[fontName] != undefined)
					return fontName;
				var arrName = fontName.toLowerCase().split(' ');
				var newFontName = '';
				for(var i = 0;i < arrName.length;i++)
				{
					arrName[i] = arrName[i].substr(0,1).toUpperCase() + arrName[i].substr(1).toLowerCase();
					if(i == arrName.length - 1)
						newFontName += arrName[i];
					else
						newFontName += arrName[i] + ' ';
				}
				if(this.Api.FontLoader.map_font_index[newFontName] != undefined)
					return newFontName;
				else
					return defaultFont;
			},
			
			_encode : function (input) {
				return Base64.encode(input).replace(/\//g, "_s").replace(/\+/g, "_p").replace(/=/g, "_e");
			},

			_decode : function (input) {
				return Base64.decode(input.replace(/_s/g, "/").replace(/_p/g, "+").replace(/_e/g, "="));
			},
			
			_getSelectedDrawingIndex : function(worksheet) {
				if(!worksheet)
					return false;
				var images = worksheet.model.Drawings;
				var n = 0;
				var arrImages = [];
				if(images)
				{
					for (var i = 0; i < images.length; i++) {
						if ((images[i].graphicObject && images[i].graphicObject.selected == true) || (images[i].flags.selected == true))
						{
							arrImages[n] = i;
							n++;
						}
					}
				}
				if(n == 0)
					return -1;
				else
					return arrImages;
			},
			
			_insertImages: function (ws, array, onlyFromLocalStorage) {
				//object{images:,fromCol,fromRow}
				if(!array || array && array.length == 0)
					return false;
				
				var firstRange = ws.activeRange.clone(true);
				for(var i=0;i < array.length;i++)
				{
					var binary_shape = array[i].image.getAttribute("alt");
					var sub;
					if(typeof binary_shape === "string")
						sub = binary_shape.substr(0, 18);
					if(typeof binary_shape === "string" &&( sub === "TeamLabShapeSheets" || sub === "TeamLabImageSheets" || sub === "TeamLabChartSheets" || sub === "TeamLabGroupSheets"))
					{
						var reader = CreateBinaryReader(binary_shape, 18, binary_shape.length);
						reader.GetLong();
						if(isRealObject(reader))
							reader.oImages = this.oImages;
						var first_string = null;
						if(reader !== null && typeof  reader === "object")
						{
							first_string = sub;
						}
						var positionX = null;
						var positionY = null;
						
						if(ws.cols && firstRange && firstRange.c1 != undefined && ws.cols[firstRange.c1].left != undefined)
							positionX = ws.cols[firstRange.c1].left - ws.getCellLeft(0, 1);
						if(ws.rows && firstRange && firstRange.r1 != undefined && ws.rows[firstRange.r1].top != undefined)
							positionY = ws.rows[firstRange.r1].top - ws.getCellTop(0, 1);
						
						var Drawing;
						switch(first_string)
						{
							case "TeamLabImageSheets":
							{
								Drawing = new CImageShape();
								break;
							}
							case "TeamLabShapeSheets":
							{
								Drawing = new CShape();
								break;
							}
							case "TeamLabGroupSheets":
							{
								Drawing = new CGroupShape();
								break;
							}
							case "TeamLabChartSheets":
							{
								Drawing = new CChartAsGroup();
                                Drawing.setAscChart(new asc_CChart());
								break;
							}
							default :
							{
								Drawing = CreateImageFromBinary(src);
								break;
							}
						}
						if(positionX && positionY && ws.objectRender)
							Drawing.readFromBinaryForCopyPaste(reader,null, ws.objectRender,ws.objectRender.convertMetric(positionX,1,3),ws.objectRender.convertMetric(positionY,1,3));
						else
							Drawing.readFromBinaryForCopyPaste(reader,null, ws.objectRender);
						Drawing.drawingObjects = ws.objectRender;
						Drawing.select(ws.objectRender.controller);
						Drawing.addToDrawingObjects();
					}
				}
				return true;
			},
			
			_insertImagesFromBinary: function(ws, data)
			{
				var pasteRange = ws.autoFilters._refToRange(this.activeRange);
				var activeRange = Asc.clone(ws.activeRange);
				var curCol;
				var curRow;
				var startCol;
				var startRow;
				var xfrm;
				History.Create_NewPoint();
				History.StartTransaction();
				//определяем стартовую позицию, если изображений несколько вставляется
				for(var i = 0; i < data.Drawings.length; i++)
				{
					drawingObject = data.Drawings[i];
					xfrm = drawingObject.graphicObject.spPr.xfrm;
					if(xfrm)
					{
						if(i == 0)
						{
							startCol = xfrm.offX;
							startRow = xfrm.offY;
						}
						else 
						{
							if(startCol > xfrm.offX)
							{
								startCol = xfrm.offX;
							}	
							if(startRow > xfrm.offY)
							{
								startRow = xfrm.offY;
							}	
						}
					}
					else
					{
						if(i == 0)
						{
							startCol = drawingObject.from.col;
							startRow = drawingObject.from.row;
						}
						else 
						{
							if(startCol > drawingObject.from.col)
							{
								startCol = drawingObject.from.col;
							}	
							if(startRow > drawingObject.from.row)
							{
								startRow = drawingObject.from.row;
							}	
						}
					}
				};
				for(var i = 0; i < data.Drawings.length; i++)
				{
					if(i == 0)
						window["Asc"]["editor"].isStartAddShape = true;
					drawingObject = data.Drawings[i];
					// Object types
					if (typeof  CChartAsGroup != "undefined" && drawingObject.graphicObject instanceof  CChartAsGroup) {
						
						ws.objectRender.calcChartInterval(drawingObject.graphicObject.chart);
						//drawingObject.graphicObject.setPosition(10,10);
						drawingObject.graphicObject.drawingBase = drawingObject;
						drawingObject.graphicObject.setDrawingObjects(ws.objectRender);
						
						if (drawingObject.graphicObject.chartTitle)
							drawingObject.graphicObject.chartTitle.drawingObjects = ws.objectRender;
							
						drawingObject.graphicObject.chart.worksheet = ws.model;
						//drawingObject.graphicObject.chart.rebuildSeries();
						//drawingObject.graphicObject.recalculate();
						drawingObject.graphicObject.init();
						
						drawingObject.graphicObject.addToDrawingObjects();
						//aObjects.push( drawingObject );
						
						//var boundsChecker = _this.getBoundsChecker(drawingObject);
						//aBoundsCheckers.push(boundsChecker);
					}
					else if (drawingObject.graphicObject instanceof  CShape || drawingObject.graphicObject instanceof  CImageShape || drawingObject.graphicObject instanceof  CGroupShape) {
						
						xfrm = drawingObject.graphicObject.spPr.xfrm;
						if(xfrm)
						{
							curCol = xfrm.offX - startCol + ws.objectRender.convertMetric(ws.cols[activeRange.c1].left - ws.getCellLeft(0, 1), 1, 3);
							curRow = xfrm.offY - startRow + ws.objectRender.convertMetric(ws.rows[activeRange.r1].top  - ws.getCellTop(0, 1), 1, 3);
							drawingObject.graphicObject.setPosition(curCol, curRow);
						}
						else
						{
							curCol = drawingObject.from.col - startCol + activeRange.c1;
							curRow = drawingObject.from.row - startRow + activeRange.r1;
							drawingObject.graphicObject.setPosition(ws.objectRender.convertMetric(ws.cols[curCol].left, 1, 3), ws.objectRender.convertMetric(ws.rows[curRow].top, 1, 3));
						}
					
						drawingObject.graphicObject.setDrawingObjects(ws.objectRender);
						drawingObject.graphicObject.setDrawingDocument(ws.objectRender.drawingDocument);
						drawingObject.graphicObject.recalculate();
						
						drawingObject.graphicObject.addToDrawingObjects();
						drawingObject.graphicObject.select(ws.objectRender.controller);
					}
				};
				History.EndTransaction();
			},
			
			_getBinaryColor: function(c) 
			{
				var bin, m, x, type, r, g, b, a, s;
				var reColor = /^\s*(?:#?([0-9a-f]{6})|#?([0-9a-f]{3})|rgba?\s*\(\s*((?:\d*\.?\d+)(?:\s*,\s*(?:\d*\.?\d+)){2,3})\s*\))\s*$/i;
				if (typeof c === "number") {
					bin = c;
				} else {
				
					m = reColor.exec(c);
					if (!m) {return null;}

					if (m[1]) {
						x = [ m[1].slice(0, 2), m[1].slice(2, 4), m[1].slice(4) ];
						type = 1;
					} else if (m[2]) {
						x = [ m[2].slice(0, 1), m[2].slice(1, 2), m[2].slice(2) ];
						type = 0;
					} else {
						x = m[3].split(/\s*,\s*/i);
						type = x.length === 3 ? 2 : 3;
					}

					r = parseInt(type !== 0 ? x[0] : x[0] + x[0], type < 2 ? 16 : 10);
					g = parseInt(type !== 0 ? x[1] : x[1] + x[1], type < 2 ? 16 : 10);
					b = parseInt(type !== 0 ? x[2] : x[2] + x[2], type < 2 ? 16 : 10);
					a = type === 3 ? (Math.round(parseFloat(x[3]) * 100) * 0.01) : 1;
					bin = (r << 16) | (g << 8) | b;

				}
				return bin;
			}

		};
		
		/** @constructor */
		function pasteFromBinaryWord(clipboard, ws) {
			if ( !(this instanceof pasteFromBinaryWord) ) {return new pasteFromBinaryWord();}

			this.fontsNew = {};
			this.aResult = [];
			this.clipboard = clipboard;
			this.ws = ws;
			
			return this;
		}

		pasteFromBinaryWord.prototype = {
			
			_paste : function(worksheet, pasteData)
			{
				var documentContent = pasteData.DocumentContent;
				var activeRange = worksheet.activeRange.clone(true);
				
				if(documentContent && documentContent.length)
				{
					var documentContentBounds = new Asc.DocumentContentBounds();
					var coverDocument = documentContentBounds.getBounds(0,0, documentContent);
					this._parseChildren(coverDocument, activeRange);
					//this.parseDocumentContent(documentContent, activeRange);
				}
				
				this.aResult.fontsNew = this.fontsNew;
				worksheet.setSelectionInfo('paste', this.aResult, this);
			},
			
			_parseChildren: function(children, activeRange)
			{
				var childrens = children.children;
				for(var i = 0; i < childrens.length; i++)
				{
					if(childrens[i].type == c_oAscBoundsElementType.Cell)
					{
						for(var row = childrens[i].top; row < childrens[i].top + childrens[i].height; row++)
						{
							if(!this.aResult[row + activeRange.r1])
								this.aResult[row + activeRange.r1] = [];
							for(var col = childrens[i].left; col < childrens[i].left + childrens[i].width; col++)
							{
								if(!this.aResult[row + activeRange.r1][col + activeRange.c1])
									this.aResult[row + activeRange.r1][col + activeRange.c1] = [];
								if(!this.aResult[row + activeRange.r1][col + activeRange.c1][0])
									this.aResult[row + activeRange.r1][col + activeRange.c1][0] = [];
									
								var isCtable = false;
								var tempChildren = childrens[i].children[0].children;
								var colSpan = null;
								var rowSpan = null;
								for(var temp = 0; temp < tempChildren.length; temp++)
								{
									if(tempChildren[temp].type == c_oAscBoundsElementType.Table)
										isCtable = true;
								}
								if(childrens[i].width > 1 && isCtable && col == childrens[i].left)
								{
									colSpan = childrens[i].width;
									rowSpan = 1;
								}	
								else if(!isCtable && tempChildren.length == 1)
								{
									rowSpan = childrens[i].height;
									colSpan = childrens[i].width;
								}	

								this.aResult[row + activeRange.r1][col + activeRange.c1][0].rowSpan = rowSpan;
								this.aResult[row + activeRange.r1][col + activeRange.c1][0].colSpan = colSpan;
								
								this.aResult[row + activeRange.r1][col + activeRange.c1][0].borders = this._getBorders(childrens[i], row, col, this.aResult[row + activeRange.r1][col + activeRange.c1][0].borders);
							}
						}
					}
					if(childrens[i].children.length == 0)
					{
						//if parent - cell of table
						var colSpan = null;
						var rowSpan = null;
						
						this._parseParagraph(childrens[i].elem, activeRange, childrens[i].top + activeRange.r1, childrens[i].left + activeRange.c1);
					}
					else
						this._parseChildren(childrens[i], activeRange);
				}
			},
			
			_getBorders: function(cellTable, top, left, oldBorders)
			{
				var borders = cellTable.elem.Get_Borders();
				var widthCell = cellTable.width;
				var heigthCell = cellTable.height;
				var defaultStyle = "solid";
				var borderStyleName;
				
				var formatBorders = oldBorders ? oldBorders : new Border();
				//top border for cell
				if(top == cellTable.top && !formatBorders.t.s)
				{
					borderStyleName = this.clipboard._getBorderStyleName(defaultStyle, this.ws.objectRender.convertMetric(borders.Top.Size,3,1));
					if (null !== borderStyleName) {
						formatBorders.t.setStyle(borderStyleName);
						formatBorders.t.c = new RgbColor(this.clipboard._getBinaryColor("rgb(" + borders.Top.Color.r + "," + borders.Top.Color.g + "," + borders.Top.Color.b + ")"));
					}
				}
				//left border for cell
				if(left == cellTable.left && !formatBorders.l.s)
				{
					borderStyleName = this.clipboard._getBorderStyleName(defaultStyle, this.ws.objectRender.convertMetric(borders.Left.Size,3,1));
					if (null !== borderStyleName) {
						formatBorders.l.setStyle(borderStyleName);
						formatBorders.l.c = new RgbColor(this.clipboard._getBinaryColor("rgb(" + borders.Left.Color.r + "," + borders.Left.Color.g + "," + borders.Left.Color.b + ")"));
					}
				}
				//bottom border for cell
				if(top == cellTable.top + heigthCell - 1 && !formatBorders.b.s)
				{
					borderStyleName = this.clipboard._getBorderStyleName(defaultStyle, this.ws.objectRender.convertMetric(borders.Bottom.Size,3,1));
					if (null !== borderStyleName) {
						formatBorders.b.setStyle(borderStyleName);
						formatBorders.b.c = new RgbColor(this.clipboard._getBinaryColor("rgb(" + borders.Bottom.Color.r + "," + borders.Bottom.Color.g + "," + borders.Bottom.Color.b + ")"));
					}
				}
				//right border for cell
				if(left == cellTable.left + widthCell - 1 && !formatBorders.r.s)
				{
					borderStyleName = this.clipboard._getBorderStyleName(defaultStyle, this.ws.objectRender.convertMetric(borders.Right.Size,3,1));
					if (null !== borderStyleName) {
						formatBorders.r.setStyle(borderStyleName);
						formatBorders.r.c = new RgbColor(this.clipboard._getBinaryColor("rgb(" + borders.Right.Color.r + "," + borders.Right.Color.g + "," + borders.Right.Color.b + ")"));
					}
				}
				
				return formatBorders;
			},
			
			_parseParagraph: function(paragraph, activeRange, row, col, rowSpan, colSpan)
			{
				var content = paragraph.Content;
				var row, colorText, cTextPr, fontFamily = "Arial";
				var text = null;
				var oNewItem = [];

				var aResult = this.aResult;
				if(row === undefined)
				{
					if(aResult.length == 0)
					{
						row = activeRange.r1;
					}
					else
						row = aResult.length;
				}
				
				if(this.aResult[row] && this.aResult[row][col] && this.aResult[row][col][0] && this.aResult[row][col][0].length === 0 && (this.aResult[row][col][0].borders || this.aResult[row][col][0].rowSpan != null))
				{
					if(this.aResult[row][col][0].borders)
						oNewItem.borders = this.aResult[row][col][0].borders;
					if(this.aResult[row][col][0].rowSpan != null)
					{
						oNewItem.rowSpan = this.aResult[row][col][0].rowSpan;
						oNewItem.colSpan = this.aResult[row][col][0].colSpan;
					}
					delete this.aResult[row][col];
				}
	
				if(!aResult[row])
					aResult[row] = [];
				var s = 0;
				var c1 = col !== undefined ? col : activeRange.c1;
				
				//backgroundColor
				var backgroundColor = null;
				if(paragraph.Parent && paragraph.Parent.Parent && paragraph.Parent.Parent instanceof CTableCell2 && paragraph.Parent.Parent.CompiledPr && paragraph.Parent.Parent.CompiledPr.Pr.Shd && paragraph.Parent.Parent.CompiledPr.Pr.Shd.Color)
				{
					var color = paragraph.Parent.Parent.CompiledPr.Pr.Shd.Color;
					backgroundColor = new RgbColor(this.clipboard._getBinaryColor("rgb(" + color.r + "," + color.g + "," + color.b + ")"));
				}
				if(backgroundColor)
					oNewItem.bc = backgroundColor;
				
				paragraph.CompiledPr.NeedRecalc = true;
				var paraPr = paragraph.Get_CompiledPr();
				var paragraphFontFamily = paraPr.TextPr.FontFamily.Name;
				var paragraphFontSize = paraPr.TextPr.FontSize;
				var paragraphBold = paraPr.TextPr.Bold;
				var paragraphItalic = paraPr.TextPr.Italic;
				var paragraphStrikeout = paraPr.TextPr.Strikeout;
				var paragraphUnderline = paraPr.TextPr.Underline;
				var paragraphVertAlign = "none";
				if(paraPr.TextPr.VertAlign == 1)
					paragraphVertAlign = "superscript";
				else if(paraPr.TextPr.VertAlign == 2)
					paragraphVertAlign = "subscript";

				var colorParagraph = new RgbColor(this.clipboard._getBinaryColor("rgb(" + paraPr.TextPr.Color.r + "," + paraPr.TextPr.Color.g + "," + paraPr.TextPr.Color.b + ")"));
				
				
				//проходимся по контенту paragraph
				for(var n = 0; n < content.length; n++)
				{
					//s  - меняется в зависимости от табуляции
					if(!aResult[row][s + c1])
					{
						aResult[row][s + c1] = [];
					}
					if(text == null)
						text = "";
					
					
					if(content[n] instanceof ParaTextPr2)//settings for text	
					{
						if(text !== null && oNewItem[oNewItem.length - 1])//oNewItem - массив, аналогичный value2
							oNewItem[oNewItem.length - 1].text = text;
						else if(text !== null && oNewItem.length == 0)
						{
							this.fontsNew["Arial"] = 1;
							colorText = new RgbColor(this.clipboard._getBinaryColor("rgb(0, 0, 0)"));
							
							var calcValue = content[n].CalcValue;
							oNewItem.push({
								format: {
									fn: calcValue.FontFamily && calcValue.FontFamily.Name ? calcValue.FontFamily.Name : paragraphFontFamily,
									fs: calcValue.FontSize ? calcValue.FontSize : paragraphFontSize,
									c: colorParagraph ? colorParagraph : colorText,
									b: paragraphBold,
									i: paragraphItalic,
									u: paragraphUnderline,
									s: paragraphStrikeout,
									va: "none"
								}
							});
							oNewItem[oNewItem.length - 1].text = text;
						}	
						
						text = "";
						
						cTextPr = content[n].CalcValue;
						
						if(cTextPr.Color)
							colorText = new RgbColor(this.clipboard._getBinaryColor("rgb(" + cTextPr.Color.r + "," + cTextPr.Color.g + "," + cTextPr.Color.b + ")"));
						else
							colorText = null;
						
						fontFamily = cTextPr.fontFamily ? fontFamily : cTextPr.RFonts.CS ? cTextPr.RFonts.CS.Name : paragraphFontFamily;
						this.fontsNew[fontFamily] = 1;
						
						var verticalAlign;
						if(cTextPr.VertAlign == 2)
							verticalAlign = "subscript";
						else if(cTextPr.VertAlign == 1)
							verticalAlign = "superscript";
							

						oNewItem.push({
							format: {
								fn: fontFamily,
								fs: cTextPr.FontSize ? cTextPr.FontSize : paragraphFontSize,
								c: colorText ? colorText : colorParagraph,
								b: cTextPr.Bold ? cTextPr.Bold : paragraphBold,
								i: cTextPr.Italic ? cTextPr.Italic : paragraphItalic,
								u: cTextPr.Underline ? cTextPr.Underline : paragraphUnderline,
								s: cTextPr.Strikeout ? cTextPr.Strikeout : paragraphStrikeout,
								va: verticalAlign ? verticalAlign : paragraphVertAlign
							}
						});
					}
					else if(content[n] instanceof ParaText2)//text
					{
						text += content[n].Value;
					}
					else if(content[n] instanceof ParaSpace2)
					{	
						text += " ";
					}
					else if(content[n] instanceof ParaTab2)//tab
					{
						if(!oNewItem.length)
						{
							fontFamily = paragraphFontFamily;
							this.fontsNew[fontFamily] = 1;
							colorText = colorParagraph ? colorParagraph : new RgbColor(this.clipboard._getBinaryColor("rgb(0, 0, 0)"));
							
							oNewItem.push({
								format: {
									fn: fontFamily,
									fs: paragraphFontSize,
									c: colorText,
									b: paragraphBold,
									i: paragraphItalic,
									u: paragraphUnderline,
									s: paragraphStrikeout,
									va: paragraphVertAlign
								}
							});
						}
						if(text !== null)
							oNewItem[oNewItem.length - 1].text = text;
						//переходим в следующую ячейку
						if(typeof aResult[row][s + c1] == "object")
							aResult[row][s + c1][aResult[row][s + c1].length] = oNewItem;
						else
						{
							aResult[row][s + c1] = [];
							aResult[row][s + c1][0] = oNewItem;
						}
							
						text = "";
						oNewItem = [];
						s++;
					}
					else if(content[n] instanceof ParaEnd2)//end
					{
						if(!oNewItem.length)
						{
							fontFamily = paragraphFontFamily;
							this.fontsNew[fontFamily] = 1;
							colorText = colorParagraph ? colorParagraph : new RgbColor(this.clipboard._getBinaryColor("rgb(0, 0, 0)"));
							
							oNewItem.push({
								format: {
									fn: fontFamily,
									fs: paragraphFontSize,
									c: colorText,
									b: paragraphBold,
									i: paragraphItalic,
									u: paragraphUnderline,
									s: paragraphStrikeout,
									va: paragraphVertAlign
								}
							});
						}
						if(text !== null)
							oNewItem[oNewItem.length - 1].text = text;
						text = "";
						if(typeof aResult[row][s + c1] == "object")
							aResult[row][s + c1][aResult[row][s + c1].length] = oNewItem;
						else
						{
							aResult[row][s + c1] = [];
							aResult[row][s + c1][0] = oNewItem;
						}
					}
					else if(n == content.length - 1)//end of row
					{
						text = "";
						oNewItem = [];
					}
				};
			}
		};
		
		var c_oAscBoundsElementType = {
			Content		: 0,
			Paragraph	: 1,
			Table		: 2,
			Row			: 3,
			Cell		: 4
		};
		function DocumentContentBoundsElement(elem, type, parent){
			this.elem = elem;
			this.type = type;
			this.parent = parent;
			this.children = [];
			
			this.left = 0;
			this.top = 0;
			this.width = 0;
			this.height = 0;
		}
		function DocumentContentBounds(){
		};
		DocumentContentBounds.prototype = {
			getBounds: function(nLeft, nTop, aDocumentContent){
				//в первный проход заполняем размеры
				//и могут заноситься относительные сдвиги при небходимости
				var oRes = this._getMeasure(aDocumentContent, null);
				//заполняем абсолютные сдвиги
				this._getOffset(nLeft, nTop, oRes);
				return oRes;
			},
			_getOffset: function(nLeft, nTop, elem){
				elem.left += nLeft;
				elem.top += nTop;
				var nCurLeft = elem.left;
				var nCurTop = elem.top;
				var bIsRow = elem.elem instanceof CTableRow;
				for(var i = 0, length = elem.children.length; i < length; i++)
				{
					var child = elem.children[i];
					this._getOffset(nCurLeft, nCurTop, child);
					if(bIsRow)
						nCurLeft += child.width;
					else
						nCurTop += child.height;
				}
			},
			_getMeasure: function(aDocumentContent, oParent){
				var oRes = new DocumentContentBoundsElement(aDocumentContent, c_oAscBoundsElementType.Content, oParent);
				for(var i = 0, length = aDocumentContent.length; i < length; i++)
				{
					var elem = aDocumentContent[i];
					var oNewElem = null;
					if(type_Paragraph == elem.GetType())
					{
						oNewElem = new DocumentContentBoundsElement(elem, c_oAscBoundsElementType.Paragraph, oRes);
						oNewElem.width = 1;
						oNewElem.height = 1;
					}
					else if(type_Table == elem.GetType())
						oNewElem = this._getTableMeasure(elem, oRes);
					if(null != oNewElem)
					{
						oRes.children.push(oNewElem);
						if(oNewElem.width && oNewElem.width > oRes.width)
							oRes.width = oNewElem.width;
						oRes.height += oNewElem.height;
					}
				}
				return oRes;
			},
			_getTableMeasure: function(table, oParent){
				var oRes = new DocumentContentBoundsElement(table, c_oAscBoundsElementType.Table, oParent);
				//надо рассчитать сколько ячеек приходится на tableGrid, по умолчанию по одной
				//todo надо оптимизировать размер 
				var aGridWidth = [];
				for(var i = 0, length = table.TableGrid.length; i < length; i++)
					aGridWidth.push(1);
				//заполняем aGridWidth
				for(var i = 0, length = table.Content.length; i < length; i++)
				{
					var row = table.Content[i];
					var oNewElem = this._setRowGridWidth(row, oRes, aGridWidth);
					if(null != oNewElem)
						oRes.children.push(oNewElem);
				}
				var aSumGridWidth = [];
				var nTempSum = 0;
				for(var i = 0, length = aGridWidth.length; i < length + 1; i++)
				{
					aSumGridWidth[i] = nTempSum;
					var nCurValue = aGridWidth[i];
					if(nCurValue)
						nTempSum += nCurValue;
				}
				//заполняем размеры
				for(var i = 0, length = oRes.children.length; i < length; i++)
				{
					var rowWrapped = oRes.children[i];
					this._getRowMeasure(rowWrapped, aSumGridWidth);
					oRes.height += rowWrapped.height;
					//в left временно занесен относительный сдвиг
					if(rowWrapped.width + rowWrapped.left > oRes.width)
						oRes.width = rowWrapped.width + rowWrapped.left;
				}
				return oRes;
			},
			_setRowGridWidth: function(row, oParent, aGridWidth){
				var oRes = new DocumentContentBoundsElement(row, c_oAscBoundsElementType.Row, oParent);
				var nSumGrid = 0;
				var BeforeInfo = row.Get_Before();
				if(BeforeInfo && BeforeInfo.GridBefore)
					nSumGrid += BeforeInfo.GridBefore;
				for(var i = 0, length = row.Content.length; i < length; i++)
				{
					var cell = row.Content[i];
					var oNewCell = new DocumentContentBoundsElement(cell, c_oAscBoundsElementType.Cell, oRes);
					oRes.children.push(oNewCell);
					var oNewElem = this._getMeasure(cell.Content.Content, oNewCell);
					oNewCell.children.push(oNewElem);
					oNewCell.width = oNewElem.width;
					oNewCell.height = oNewElem.height;
					if(oNewCell.height > oRes.height)
						oRes.height = oNewCell.height;
					var nCellGrid = cell.Get_GridSpan();
					if(oNewElem.width > nCellGrid)
					{
						var nFirstGridWidth = oNewElem.width - nCellGrid + 1;
						var nCurValue = aGridWidth[nSumGrid];
						if(null != nCurValue && nCurValue < nFirstGridWidth)
							aGridWidth[nSumGrid] = nFirstGridWidth;
					}
					nSumGrid += nCellGrid;
				}
				return oRes;
			},
			_getRowMeasure: function(rowWrapped, aSumGridWidth){
				var nSumGrid = 0;
				var BeforeInfo = rowWrapped.elem.Get_Before();
				if(BeforeInfo && BeforeInfo.GridBefore)
				{
					//временно заносим относительный сдвиг
					rowWrapped.left = aSumGridWidth[nSumGrid + BeforeInfo.GridBefore] - aSumGridWidth[nSumGrid];
					nSumGrid += BeforeInfo.GridBefore;
				}
				for(var i = 0, length = rowWrapped.children.length; i < length; i++)
				{
					var cellWrapped = rowWrapped.children[i];
					var nCellGrid = cellWrapped.elem.Get_GridSpan();
					cellWrapped.width = aSumGridWidth[nSumGrid + nCellGrid] - aSumGridWidth[nSumGrid];
					//выравниваем высоту ячеек по-максимому
					cellWrapped.height = rowWrapped.height;
					rowWrapped.width += cellWrapped.width;
					nSumGrid += nCellGrid;
				}
			}
		};
		
		/*
		 * Export
		 * -----------------------------------------------------------------------------
		 */
		window["Asc"].Clipboard = Clipboard;
		window["Asc"].pasteFromBinaryWord = pasteFromBinaryWord;
		window["Asc"].DocumentContentBounds = DocumentContentBounds;

	}
)(jQuery, window);

window.USER_AGENT_MACOS = AscBrowser.isMacOs;
window.USER_AGENT_SAFARI_MACOS = AscBrowser.isSafariMacOs;
window.USER_AGENT_IE = AscBrowser.isIE || AscBrowser.isOpera;
window.USER_AGENT_WEBKIT = AscBrowser.isWebkit;

window.GlobalPasteFlag = false;
window.GlobalPasteFlagCounter = 0;
var COPY_ELEMENT_ID = "clipboard-helper";
var PASTE_ELEMENT_ID = "wrd_pastebin";
var ELEMENT_DISPAY_STYLE = "none";
var COPYPASTE_ELEMENT_CLASS = "sdk-element";
var kElementTextId = "clipboard-helper-text";
var isNeedEmptyAfterCut = false;

var PASTE_EMPTY_COUNTER_MAX = 10;
var PASTE_EMPTY_COUNTER     = 0;
var PASTE_EMPTY_USE         = AscBrowser.isMozilla;


if (window.USER_AGENT_SAFARI_MACOS)
{
	var PASTE_ELEMENT_ID = "clipboard-helper";
	var ELEMENT_DISPAY_STYLE = "block";
}
function SafariIntervalFocus()
{
    var api = window["Asc"]["editor"];
	if (api)
    {
		if((api.wb && api.wb.cellEditor && api.wb.cellEditor != null && api.wb.cellEditor.isTopLineActive) || (api.wb && api.wb.getWorksheet() && api.wb.getWorksheet().isSelectionDialogMode))
			return;
		var pastebin = document.getElementById(COPY_ELEMENT_ID);
		var pastebinText = document.getElementById(kElementTextId);
		if(pastebinText && (api.wb && api.wb.getWorksheet() && api.wb.getWorksheet().isCellEditMode) && api.IsFocus)
		{
			pastebinText.focus();
		}	
		else if (pastebin && api.IsFocus)
            pastebin.focus();
        else if(!pastebin || !pastebinText)
        {
            // create
            Editor_CopyPaste_Create(api);
        }
    }
}

function Editor_CopyPaste_Create(api)
{
    var ElemToSelect = document.createElement("div");
    ElemToSelect.id = COPY_ELEMENT_ID;
    ElemToSelect.setAttribute("class", COPYPASTE_ELEMENT_CLASS);

    ElemToSelect.style.left = '0px';
    ElemToSelect.style.top = '-100px';
    ElemToSelect.style.width = '1000px';
    ElemToSelect.style.height = '100px';
    ElemToSelect.style.overflow = 'hidden';
    ElemToSelect.style.zIndex = -1000;
    ElemToSelect.style.MozUserSelect = "text";
    ElemToSelect.style["-khtml-user-select"] = "text";
    ElemToSelect.style["-o-user-select"] = "text";
    ElemToSelect.style["user-select"] = "text";
    ElemToSelect.style["-webkit-user-select"] = "text";
    ElemToSelect.setAttribute("contentEditable", true);

    ElemToSelect.style.lineHeight = "1px";

    ElemToSelect["onpaste"] = function(e){
		if (!window.GlobalPasteFlag)
				return;

        // тут onpaste не обрубаем, так как он в сафари под macos приходить должен
        if (window.GlobalPasteFlagCounter == 1)
        {
            api.wb.clipboard._bodyPaste(api.wb.getWorksheet(), e);
			if (window.GlobalPasteFlag)
				window.GlobalPasteFlagCounter = 2;
        }
    };

    ElemToSelect["onbeforecopy"] = function(e){
		var ws = api.wb.getWorksheet();
		if(!ws.isCellEditMode)
			api.wb.clipboard.copyRange(ws.getSelectedRange(), ws);
    };
	
	ElemToSelect["onbeforecut"] = function(e){
		if(!api.isCellEdited)
		{
			api.wb.clipboard.copyRange(api.wb.getWorksheet().getSelectedRange(), api.wb.getWorksheet());
			if(isNeedEmptyAfterCut)
			{
				isNeedEmptyAfterCut = false;
				api.wb.getWorksheet().setSelectionInfo("empty", c_oAscCleanOptions.All);
			}
			else
				isNeedEmptyAfterCut = true;		
		}
    };

    document.body.appendChild( ElemToSelect );
	
	//для редактора ячейки
	var elementText = document.createElement("textarea");

	elementText.id = kElementTextId;
	elementText.style.position = "absolute";

	elementText.style.width = '10000px';
	elementText.style.height = '100px';
	elementText.style.left = '0px';
	elementText.style.top = '-100px';
	elementText.style.overflow = 'hidden';
	elementText.style.zIndex = -1000;
	elementText.style.display = ELEMENT_DISPAY_STYLE;
	elementText.setAttribute("contentEditable", true);
	elementText.setAttribute("class", COPYPASTE_ELEMENT_CLASS);
	
	 elementText["onbeforecopy"] = function(e){
		if((api.wb && api.wb.getWorksheet() && api.wb.getWorksheet().isCellEditMode))
		{
			var v = api.wb.cellEditor.copySelection();
			if (v) {api.wb.clipboard.copyCellValue(v);}
		}	
    };
	
	elementText["onbeforecut"] = function(e){
		api.wb.clipboard.copyRange(api.wb.getWorksheet().getSelectedRange(), api.wb.getWorksheet());
		if(isNeedEmptyAfterCut == true)
		{
			isNeedEmptyAfterCut = false;
			if((api.wb && api.wb.getWorksheet() && api.wb.getWorksheet().isCellEditMode))
			{
				var v = api.wb.cellEditor.cutSelection();
				if (v) {api.wb.clipboard.copyCellValue(v);}
			}	
		}
		else
			isNeedEmptyAfterCut = true;		
    };

	document.body.appendChild(elementText);
}

function CreateBinaryReader(szSrc, offset, srcLen)
{
    var nWritten = 0;

    var index =  -1 + offset;
    var dst_len = "";

    for( ; index < srcLen; )
    {
        index++;
        var _c = szSrc.charCodeAt(index);
        if (_c == ";".charCodeAt(0))
        {
            index++;
            break;
        }

        dst_len += String.fromCharCode(_c);
    }

    var dstLen = parseInt(dst_len);
    if(isNaN(dstLen))
        return null;
    var pointer = g_memory.Alloc(dstLen);
    var stream = new FT_Stream2(pointer.data, dstLen);
    stream.obj = pointer.obj;

    var dstPx = stream.data;

    if (window.chrome)
    {
        while (index < srcLen)
        {
            var dwCurr = 0;
            var i;
            var nBits = 0;
            for (i=0; i<4; i++)
            {
                if (index >= srcLen)
                    break;
                var nCh = DecodeBase64Char(szSrc.charCodeAt(index++));
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
                dstPx[nWritten++] = ((dwCurr & 0x00ff0000) >>> 16);
                dwCurr <<= 8;
            }
        }
    }
    else
    {
        var p = b64_decode;
        while (index < srcLen)
        {
            var dwCurr = 0;
            var i;
            var nBits = 0;
            for (i=0; i<4; i++)
            {
                if (index >= srcLen)
                    break;
                var nCh = p[szSrc.charCodeAt(index++)];
                if (nCh == undefined)
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
                dstPx[nWritten++] = ((dwCurr & 0x00ff0000) >>> 16);
                dwCurr <<= 8;
            }
        }
    }

    return stream;
}
