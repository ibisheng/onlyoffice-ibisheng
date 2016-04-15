"use strict";

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
		var c_oAscBorderStyles = AscCommon.c_oAscBorderStyles;
		var c_oAscMaxCellOrCommentLength = AscCommon.c_oAscMaxCellOrCommentLength;
		var AscBrowser = AscCommon.AscBrowser;

		var doc = window.document;
		
		var isTruePaste = false;
		//activate local buffer
		var activateLocalStorage = false;
		var isOnlyLocalBufferSafari = false;
		var copyPasteUseBinary = true;
		var copyPasteFromWordUseBinary = true;

		var COPY_ELEMENT_ID2 = "clipboard-helper";
		var kElementTextId = "clipboard-helper-text";
		var isNeedEmptyAfterCut = false;

		if (window.USER_AGENT_SAFARI_MACOS)
		{
			PASTE_ELEMENT_ID = COPY_ELEMENT_ID2;
		}

		function number2color(n) {
			if( typeof(n)=="string" && n.indexOf("rgb")>-1)
				return n;
			return "rgb(" + (n >> 16 & 0xFF) + "," + (n >> 8 & 0xFF) + "," + (n & 0xFF) + ")";
		}


		/** @constructor */
		function Clipboard() {
			this.element = undefined;
			this.ppix = 96;
			this.ppiy = 96;
			this.Api = null;
			this.activeRange = null;
			this.lStorage = {};

			this.fontsNew = {};
			
			this.oImages = {};
			this.alreadyLoadImagesOnServer = false;

			return this;
		}

		Clipboard.prototype = {

			constructor: Clipboard,

			init: function () {
				var t = this;
				var found = true;

				if (!t.element) {
					t.element = doc.getElementById(COPY_ELEMENT_ID2);
					if (!t.element) 
					{
						found = false; 
						
						//TODO - review later(commented for edge)
						/*if(AscBrowser.isIE)
						{
							var iframe = doc.createElement("iframe");
							iframe.id = "ieCopyFrame";
							doc.body.appendChild(iframe);
							var temp = doc.getElementById("ieCopyFrame");
							if (temp.contentDocument.body == null)
								temp.contentDocument.write("<body></body>");
							t.element = temp.contentDocument.body.appendChild(doc.createElement("div"));
						}
						else*/
							t.element = doc.createElement("DIV");
					}
				}

				t.element.id = COPY_ELEMENT_ID2;
				t.element.setAttribute("class", COPYPASTE_ELEMENT_CLASS);
				t.element.style.position = "absolute";
				// Если сделать width маленьким, то параграф будет постоянно переноситься по span
				// И например в таком случае пропадает пробел <span>1</span><span> </span><span>2</span>
				t.element.style.top = '-100px';
				t.element.style.left = '0px';
				
				if(window.USER_AGENT_MACOS)
					t.element.style.width = '100px';
				else
					t.element.style.width = '10000px';
			
				t.element.style.height = '100px';
				t.element.style.overflow = 'hidden';
				t.element.style.zIndex = -1000;
				t.element.style.display = ELEMENT_DISPAY_STYLE;
				t.element.setAttribute("contentEditable", true);
				
				//TODO - review later(commented for edge)
				if (!found /*&& !AscBrowser.isIE*/) {doc.body.appendChild(t.element);}
				
				//fix for ipad
				if(!AscBrowser.isMobileVersion)
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
					if(window.USER_AGENT_MACOS)
						t.element.style.width = '100px';
					else
						t.element.style.width = '10000px';
						
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
			
			checkCopyToClipboard: function(ws, _clipboard, _formats)
			{
				var _data;
				var activeRange = ws.getSelectedRange();
				var wb = window["Asc"]["editor"].wb;
				
				if(ws.getCellEditMode() === true)//text in cell
				{
					//only TEXT
					var fragments = wb.cellEditor.copySelection();
					_data = wb.cellEditor._getFragmentsText(fragments);
					
					_clipboard.pushData(c_oAscClipboardDataFormat.Text, _data)
				}
				else
				{	
					//TEXT
					if (c_oAscClipboardDataFormat.Text & _formats)
					{
						//_data = ;
						//_clipboard.pushData(c_oAscClipboardDataFormat.Text, _data)
					}
					//HTML
					if(c_oAscClipboardDataFormat.Html & _formats)
					{	
						_data = this._getHtml(activeRange, ws);
						
						_clipboard.pushData(c_oAscClipboardDataFormat.Html, _data.html)
					}
					//INTERNAL
					if(c_oAscClipboardDataFormat.Internal & _formats)
					{
						if(_data && _data.base64)
							_data = _data.base64;
						else
							_data = this._getBinaryForCopy(worksheetView);
						
						_clipboard.pushData(c_oAscClipboardDataFormat.Internal, _data)
					}
				}
			},
			
			copyDesktopEditorButton: function(ElemToSelect, isCut)
			{
				if (isCut)
				{
					var __oncut = ElemToSelect.oncut;

					ElemToSelect.oncut = function (e) {

						ElemToSelect.oncut = __oncut;
						__oncut = null;

						var api = window["Asc"]["editor"];
						if(api.controller.isCellEditMode)
							return;

						Editor_Copy_Event_Excel(e, ElemToSelect, true, true);

                        var selection = window.getSelection();
                        var rangeToSelect = window.document.createRange();
                        rangeToSelect.selectNodeContents(ElemToSelect);
                        selection.removeAllRanges();
                        selection.addRange(rangeToSelect);
					};

                    ElemToSelect.focus();
					window["AscDesktopEditor"]["Cut"]();
				}
				else
				{
					var __oncopy = ElemToSelect.oncopy;

					ElemToSelect.oncopy = function (e) {

						ElemToSelect.oncopy = __oncopy;
						__oncopy = null;

						var api = window["Asc"]["editor"];
						if(api.controller.isCellEditMode)
							return;

						Editor_Copy_Event_Excel(e, ElemToSelect, null, true);

                        var selection = window.getSelection();
                        var rangeToSelect = window.document.createRange();
                        rangeToSelect.selectNodeContents(ElemToSelect);
                        selection.removeAllRanges();
                        selection.addRange(rangeToSelect);
					};

                    ElemToSelect.focus();
					window["AscDesktopEditor"]["Copy"]();
				}

			},
			
			pasteDesktopEditorButton: function(ElemToSelect)
			{
				window.GlobalPasteFlagCounter = 1;
                document.body.style.MozUserSelect = "text";
                delete document.body.style["-khtml-user-select"];
                delete document.body.style["-o-user-select"];
                delete document.body.style["user-select"];
                document.body.style["-webkit-user-select"] = "text";
				
				var overflowBody = document.body.style.overflow;
				document.body.style.overflow = 'hidden';
				
				var __onpaste = ElemToSelect.onpaste;
				
				var selection = window.getSelection();
				var rangeToSelect = window.document.createRange();
				rangeToSelect.selectNodeContents(ElemToSelect);
				selection.removeAllRanges();
				selection.addRange(rangeToSelect);
						
				ElemToSelect.onpaste = function (e) {
					if (!window.GlobalPasteFlag)
						return;
					
					ElemToSelect.oncopy = __onpaste;
					__onpaste = null;
					
					var api = window["Asc"]["editor"];
					var wb = api.wb;
					var ws = wb.getWorksheet();
				
					wb.clipboard._bodyPaste(ws, e);
					
					ElemToSelect.style.display = ELEMENT_DISPAY_STYLE;
					document.body.style.MozUserSelect = "none";
					document.body.style["-khtml-user-select"] = "none";
					document.body.style["-o-user-select"] = "none";
					document.body.style["user-select"] = "none";
					document.body.style["-webkit-user-select"] = "none";				
				};

				ElemToSelect.style.display = "block";
				ElemToSelect.focus();		
				
				window["AscDesktopEditor"]["Paste"]();
			},
			
			
			//****copy cells ****
			copyRange: function (range, worksheet, isCut) {
				var t = this;
				t._cleanElement();
				
				var objectRender = worksheet.objectRender;
				var isIntoShape = objectRender.controller.getTargetDocContent();
				
				var text = t._makeTableNode(range, worksheet, isCut, isIntoShape);
				
				if(text == false)
					return;
				
				if(window.USER_AGENT_SAFARI_MACOS && !worksheet.isCellEditMode)
				{
					this.element.appendChild(text);
					
					History.TurnOff();
					var sBase64 = this._getBinaryForCopy(worksheet);
					
					if(isIntoShape)
						sBase64 = null;
					
					if(sBase64)
					{
						if(this.element.children && this.element.children.length == 1 && (window.USER_AGENT_WEBKIT || window.USER_AGENT_SAFARI_MACOS))
						{
							$(this.element.children[0]).css("font-weight", "normal");
							$(this.element.children[0]).wrap(document.createElement("b"));
						}
						if(this.element.children[0])
							$(this.element.children[0]).addClass("xslData;" + sBase64);
						
						//for buttons copy/paste
						this.lStorage = sBase64;
					}
					
					History.TurnOn();
					
					return sBase64;
				}
				else
				{
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
						if(isIntoShape)
						{
							this.lStorage = {};
							this.lStorage.htmlInShape = text;
						}	
						else
						{
							var sBase64 = this._getBinaryForCopy(worksheet);
							if(this.element.children && this.element.children.length == 1 && (window.USER_AGENT_WEBKIT || window.USER_AGENT_SAFARI_MACOS))
							{
								$(this.element.children[0]).css("font-weight", "normal");
								$(this.element.children[0]).wrap(document.createElement("b"));
							}
							if(this.element.children[0])
								$(this.element.children[0]).addClass("xslData;" + sBase64);
							
							//for buttons copy/paste
							this.lStorage = sBase64;
						}
					}
								
					History.TurnOn();
					
					if (window["AscDesktopEditorButtonMode"] === true && window["AscDesktopEditor"]) {
					
						this.copyDesktopEditorButton(this.element, isCut);
						return;
					} 
					
					
					if(AscBrowser.isMozilla)
						t._selectElement(t._getStylesSelect);
					else
						t._selectElement();
				}
			},
			
			getSelectedBinary: function (isCut) {
				var api = window["Asc"]["editor"];
				if(!api || !api.wb)
					return false;
				
				var worksheetView = api.wb.getWorksheet();
				var activeRange = worksheetView.getSelectedRange();
				
				var objectRender = worksheetView.objectRender;
				var isIntoShape = objectRender.controller.getTargetDocContent();
				
				var html = this._makeTableNode(activeRange, worksheetView, isCut, isIntoShape);
				if(html && !isIntoShape)
					html = html.innerHTML;
				
				History.TurnOff();
				var sBase64 = null;
				if(!isIntoShape)
					sBase64 = this._getBinaryForCopy(worksheetView);
				History.TurnOn();
				
				var objectRender = worksheetView.objectRender;
				var selectedImages = objectRender.getSelectedGraphicObjects();

                var drawingUrls = [];
                if(selectedImages && selectedImages.length)
                {
                    var correctUrl, graphicObj;
                    for(var i = 0; i < selectedImages.length; i++)
                    {
                        graphicObj = selectedImages[i];
                        if(graphicObj.isImage())  {
                            if(window["NativeCorrectImageUrlOnCopy"]) {
                                correctUrl = window["NativeCorrectImageUrlOnCopy"](graphicObj.getImageUrl());
                                drawingUrls[i] = correctUrl;
                            }
                            else {
                                drawingUrls[i] = graphicObj.getBase64Img();
                            }
                        }
                    }
                }
				
				return {sBase64: sBase64, html: html, text: this.lStorageText, drawingUrls: drawingUrls};
			},
			
			_getHtml: function(range, worksheet)
			{
				var t = this;
				var sBase64 = null;
				t._cleanElement();
				
				var objectRender = worksheet.objectRender;
				var isIntoShape = objectRender.controller.getTargetDocContent();
				
				var text = t._makeTableNode(range, worksheet, null, isIntoShape);
				
				if(text == false)
					return null;

				
				t.element.appendChild(text);
				
				//TODO возможно стоит убрать отключение истории
				History.TurnOff();
				//use binary strings
				if(copyPasteUseBinary)
				{	
					if(isIntoShape)
					{
						this.lStorage = {};
						this.lStorage.htmlInShape = text;
					}	
					else
					{
						sBase64 = this._getBinaryForCopy(worksheet);
						$(this.element.children[0]).addClass("xslData;" + sBase64);
						
						//for buttons copy/paste
						this.lStorage = sBase64;
					}
				}	
				History.TurnOn();
				
				return {base64: sBase64, html: t.element.innerHTML};
			},
			
			_getHtmlBase64: function(range, worksheet, isCut)
			{
				var t = this;
				t._cleanElement();
				
				var objectRender = worksheet.objectRender;
				var isIntoShape = objectRender.controller.getTargetDocContent();
				
				var text = t._makeTableNode(range, worksheet, isCut, isIntoShape);
				
				if(text == false)
					return;

				
				t.element.appendChild(text);
				
				History.TurnOff();
				//use binary strings
				if(copyPasteUseBinary)
				{	
					if(isIntoShape)
					{
						this.lStorage = {};
						this.lStorage.htmlInShape = text;
					}	
					else
					{
						var sBase64 = this._getBinaryForCopy(worksheet);
						if(this.element.children && this.element.children.length == 1 && (window.USER_AGENT_WEBKIT || window.USER_AGENT_SAFARI_MACOS))
						{
							$(this.element.children[0]).css("font-weight", "normal");
							$(this.element.children[0]).wrap(document.createElement("b"));
						}
						if(this.element.children[0])
							$(this.element.children[0]).addClass("xslData;" + sBase64);
						
						//for buttons copy/paste
						this.lStorage = sBase64;
					}
				}
							
				History.TurnOn();
				
				/*if(AscBrowser.isMozilla)
					t._selectElement(t._getStylesSelect);
				else
					t._selectElement();*/
			},
			
			_getBinaryForCopy: function(worksheet)
			{
				window.global_pptx_content_writer.Start_UseFullUrl();
				
				//TODO стоит убрать заглушку при правке бага с activeRange
				var cloneActiveRange = worksheet.activeRange.clone();
				var temp;
				if(cloneActiveRange.c1 > cloneActiveRange.c2)
				{
					temp = cloneActiveRange.c1;
					cloneActiveRange.c1 = cloneActiveRange.c2;
					cloneActiveRange.c2 = temp;
				};
				
				if(cloneActiveRange.r1 > cloneActiveRange.r2)
				{
					temp = cloneActiveRange.r1;
					cloneActiveRange.r1 = cloneActiveRange.r2;
					cloneActiveRange.r2 = temp;
				};
				
				var oBinaryFileWriter = new Asc.BinaryFileWriter(worksheet.model.workbook, cloneActiveRange);
				var sBase64 = oBinaryFileWriter.Write();
				
				window.global_pptx_content_writer.End_UseFullUrl();
				
				return sBase64;
			},
			

			copyRangeButton: function (range, worksheet, isCut) {
				if(AscBrowser.isIE)
				{
					this._cleanElement();
					
					var text = this._makeTableNode(range, worksheet);
					if(text == false)
						return true;
					
					this.element.appendChild(text);
					
					//use binary strings
					if(copyPasteUseBinary)
					{	
						if(isIntoShape)
						{
							this.lStorage = {};
							this.lStorage.htmlInShape = text;
						}	
						else
						{
							window.global_pptx_content_writer.Start_UseFullUrl();
							
							var oBinaryFileWriter = new Asc.BinaryFileWriter(worksheet.model.workbook, worksheet.activeRange);
							var sBase64 = oBinaryFileWriter.Write();
							if(this.element.children && this.element.children.length == 1 && window.USER_AGENT_WEBKIT && (true !== window.USER_AGENT_SAFARI_MACOS))
							{
								$(this.element.children[0]).css("font-weight", "normal");
								$(this.element.children[0]).wrap(document.createElement("b"));
							}
							if(this.element.children[0])
								$(this.element.children[0]).addClass("xslData;" + sBase64);
							
							//for buttons copy/paste
							this.lStorage = sBase64;
							
							window.global_pptx_content_writer.End_UseFullUrl()
						}
					}
					
					var t = this, selection, rangeToSelect, overflowBody;
					overflowBody = document.body.style.overflow;
					document.body.style.overflow = 'hidden';
					
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
						document.body.style.overflow = overflowBody;
						
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
					var objectRender = worksheet.objectRender;
					var isIntoShape = objectRender.controller.getTargetDocContent();
					
					var text = t._makeTableNode(range, worksheet, isCut, isIntoShape);
					
					if(text == false)
						return true;
					
					if(isIntoShape)
					{
						this.lStorage = {};
						this.lStorage.htmlInShape = text;
					}	
					else
					{
						window.global_pptx_content_writer.Start_UseFullUrl();
						
						var oBinaryFileWriter = new Asc.BinaryFileWriter(worksheet.model.workbook, worksheet.activeRange);
						var sBase64 = oBinaryFileWriter.Write();
						
						//for buttons copy/paste
						this.lStorage = sBase64;
						
						window.global_pptx_content_writer.End_UseFullUrl()
					};
					
					while (this.element.hasChildNodes()) {
						this.element.removeChild(this.element.lastChild);
					};
					
					if(text !== false)
						this.element.appendChild(text);
					if(this.element.children[0] && sBase64)
						$(this.element.children[0]).addClass("xslData;" + sBase64);
					
					return true;
				}
				else if(activateLocalStorage)
				{
					var t = this;
					var  table = t._makeTableNode(range, worksheet, isCut);
					if(table !== false)
						t.copyText = t._getTextFromTable(table);
					return true;
				}
				return false;
			},
			
			
			//****paste cells ****
			pasteRange: function (worksheet) {
				var t = this;
				
				if (window["AscDesktopEditorButtonMode"] === true && window["AscDesktopEditor"])
					t.pasteDesktopEditorButton(t._editorPasteGetElem(worksheet, true));
				else if(AscBrowser.isMozilla)
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
					
					if(t.element && t.element.innerHTML !== "&nbsp;" && t.element.innerHTML !== "")
					{
						t._editorPasteExec(worksheet, t.lStorage, false, true);
					}
					else
					{
						window.GlobalPasteFlagCounter = 0;
						window.GlobalPasteFlag = false;
					}
					
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
					t._selectElement(t._getStylesSelect, true);
				else
					t._selectElement();
				
				if (window["AscDesktopEditorButtonMode"] === true && window["AscDesktopEditor"]) 
				{
					window["AscDesktopEditor"]["Copy"]();
				}
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

					while (this.element.hasChildNodes()) {
						this.element.removeChild(this.element.lastChild);
					}
					
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
					t._addValueToLocalStrg(value);
					
					var nodes = t._makeNodesFromCellValue(value);
					
					while (t.element.hasChildNodes()) {
						t.element.removeChild(t.element.lastChild);
					}
					
					nodes.forEach(
					function(node){
						t.element.appendChild(node);
					});
					
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
				else if(window.USER_AGENT_MACOS && window.USER_AGENT_WEBKIT)
					_interval_time = 200;
				
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
						
				if (window["AscDesktopEditorButtonMode"] === true && window["AscDesktopEditor"]) 
				{
					window["AscDesktopEditor"]["Paste"]();
				}
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
			
			bIsEmptyClipboard: function(isCellEditMode)
			{
				var result = false;
				if(isCellEditMode && (!t.lStorageText || t.lStorageText == null || t.lStorageText == ""))
					result = true;
				else if(!isCellEditMode && !t.lStorage)
					result = true;
				
				return result;
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
				
				this.element.style.MozUserSelect = "all";
			},

			 _getStylesSelect: function (worksheet){
				document.body.style.MozUserSelect = "";
				delete document.body.style["-khtml-user-select"];
				delete document.body.style["-o-user-select"];
				delete document.body.style["user-select"];
				document.body.style["-webkit-user-select"] = "text";
			},
			
            _editorPaste: function (worksheet,callback) {
                if(window.USER_AGENT_SAFARI_MACOS)
					return;
				
				var t = this;
				window.GlobalPasteFlagCounter = 1;
				isTruePaste = false;
                var is_chrome = AscBrowser.isChrome;
                document.body.style.MozUserSelect = "text";
                delete document.body.style["-khtml-user-select"];
                delete document.body.style["-o-user-select"];
                delete document.body.style["user-select"];
                document.body.style["-webkit-user-select"] = "text";
				
				var overflowBody = document.body.style.overflow;
				document.body.style.overflow = 'hidden';
				
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
					
					document.body.style.overflow = overflowBody;

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
					
                    if(window.USER_AGENT_MACOS)
						t.element.style.width = '100px';
					else
						t.element.style.width = '10000px';
						
                    pastebin.style.height = '100px';
                    pastebin.style.overflow = 'hidden';
                    pastebin.style.zIndex = -1000;
                    //настройки шрифта выставляются, чтобы избежать ситуации когда pastebin содержит span с текстом без настроек шрифта и computedStyle возвращает неизвестные настройки документа по умолчанию
                    /*var Def_rPr = oWordControl.m_oLogicDocument.Styles.Default.TextPr;
                    pastebin.style.fontFamily = Def_rPr.FontFamily.Name;
                    pastebin.style.fontSize = Def_rPr.FontSize + "pt";*/
                    pastebin.style.lineHeight = "1px";//todo FF всегда возвращает computedStyle в px, поэтому лучше явно указать default значнение
                    pastebin.setAttribute("contentEditable", true);
                    
					if(!AscBrowser.isIE)//edge insert on event only text
					{
						 pastebin.onpaste = function(e){
							if (!window.GlobalPasteFlag)
								return;
							
							t._bodyPaste(worksheet,e);
							pastebin.onpaste = null;
						};
					}
                   
                    document.body.appendChild( pastebin );
                }
                else if(bClean){
                    //Удаляем содержимое
                    var aChildNodes = pastebin.childNodes;
                    for (var length = aChildNodes.length, i = length - 1; i >= 0; i--)
                    {
                        pastebin.removeChild(aChildNodes[i]);
                    }
					
					if(!AscBrowser.isIE)//edge insert on event only text
					{
						pastebin.onpaste = function(e){
							if (!window.GlobalPasteFlag)
								return;

							t._bodyPaste(worksheet,e);
							pastebin.onpaste = null;
						};
					}
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
                    else if (fTest(e.clipboardData.types, "text/plain"))
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
					
					if(window.USER_AGENT_MACOS)
						ifr.style.width = '100px';
					else
						ifr.style.width = '10000px';
						
					ifr.style.height = '100px';
					ifr.style.overflow = 'hidden';
					ifr.style.zIndex = -1000;
					document.body.appendChild(ifr);
				};
				
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
						
						window.GlobalPasteFlag = false;
						window.GlobalPasteFlagCounter = 0;
						
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
                var jqSpanObject = $(spanObject), fontSize;
				var oNewItem = {};
				oNewItem.text = jqSpanObject.text().replace(/(\r|\t|\n|)/g,'');

				oNewItem.format = {};
				oNewItem.format.fn = g_fontApplication.GetFontNameDictionary(spanObject.style.fontFamily, true);

				if (oNewItem.format.fn == null || oNewItem.format.fn == '')
					oNewItem.format.fn = 'Calibri';

				if (jqSpanObject.css('vertical-align')  == 'sub' || jqSpanObject.css('vertical-align')  == 'super') {
                    fontSize = $(spanObject.parentNode).css('font-size');
					if(fontSize.indexOf('pt') > -1)
						oNewItem.format.fs = parseInt(fontSize);
					else
						oNewItem.format.fs = parseInt((3/4)*Math.round(parseFloat(fontSize)));
				} else {
					if(spanObject.style.fontSize.indexOf('pt') > -1)
						oNewItem.format.fs = parseInt(spanObject.style.fontSize);
					else
						oNewItem.format.fs = parseInt((3/4)*Math.round(parseFloat(spanObject.style.fontSize)));
				}
				if (isNaN(oNewItem.format.fs))
					oNewItem.format.fs = 11;
					
				if(oNewItem.format.fs === 0)
					oNewItem.format.fs = 1;
				
                oNewItem.format.b = (jqSpanObject.css('font-weight') == 'bold');
                oNewItem.format.i = (jqSpanObject.css('font-style') == 'italic');
                oNewItem.format.u = (jqSpanObject.css('text-decoration') == 'underline') ?
                    Asc.EUnderline.underlineSingle : Asc.EUnderline.underlineNone;
                oNewItem.format.s = (jqSpanObject.css('text-decoration') == 'line-through');
				
				if (jqSpanObject.css('vertical-align') != null)
					oNewItem.format.va = jqSpanObject.css('vertical-align');
				if (jqSpanObject.css('vertical-align') == 'baseline')
					oNewItem.format.va = '';

				oNewItem.format.c = new RgbColor(this._getBinaryColor(jqSpanObject.css('color')));
				if (oNewItem.format.c == '')
					oNewItem.format.c = null;
				
				if (jqSpanObject.css('vertical-align') != null)
					oNewItem.format.va = jqSpanObject.css('vertical-align')  === 'sub' ? 'subscript' : jqSpanObject.css('vertical-align') === 'super' ? 'superscript' : 'baseline';
					return oNewItem;
			},

            
			_getDefaultCell: function (worksheet)
			{
				var res = [];
				
				var fn = worksheet.model.workbook.getDefaultFont();
				var fs = worksheet.model.workbook.getDefaultSize();
				
				res.push({
					format: {
						fn: fn,
						fs: fs,
						b: false,
						i: false,
						u: Asc.EUnderline.underlineNone,
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
			
			_IsBlockElem : function(name)
			{
				if( "p" == name || "div" == name || "ul" == name || "ol" == name || "li" == name || "table" == name || "tbody" == name || "tr" == name || "td" == name || "th" == name ||
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
					if(!(nodes[n].nodeName.toLowerCase() == 'meta' || nodes[n].nodeName.toLowerCase() == 'style' || nodes[n].nodeName.toLowerCase() == '#comment' ||  nodes[n].nodeName.toLowerCase() == 'font' || (nodes[n].nodeName.toLowerCase() == '#text' && nodes[n].textContent.replace(/(\r|\t|\n| )/g, '') == '')))
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
			
			_pasteFromBinary: function(worksheet, node, onlyFromLocalStorage, isIntoShape)
			{
				var base64 = null, base64FromWord = null, base64FromPresentation = null, t = this;
				
				if(onlyFromLocalStorage)
				{
					if(typeof t.lStorage == "object")
					{
						if(t.lStorage.htmlInShape)
						{
							return t.lStorage.htmlInShape;
						}
						else
						{
							window.GlobalPasteFlag = false;
							window.GlobalPasteFlagCounter = 0;
							return true;
						}
					}
					else
						base64 = t.lStorage;
				}
				else//find class xslData or docData
				{
					var returnBinary = this._getClassBinaryFromHtml(node);
					base64 = returnBinary.base64;
					base64FromWord = returnBinary.base64FromWord;
					base64FromPresentation = returnBinary.base64FromPresentation;
				}
					
				var result = false;
				if(base64 != null)//from excel
				{
					result = this._pasteFromBinaryExcel(worksheet, base64, isIntoShape);
				} 
				else if (base64FromWord && copyPasteFromWordUseBinary)//from word
				{
					result = this._pasteFromBinaryWord(worksheet, base64FromWord, isIntoShape);
				}
				else if(base64FromPresentation)
				{
					result = this._pasteFromBinaryPresentation(worksheet, base64FromPresentation, isIntoShape);
				}
				
				if(result === true)
				{
					window.GlobalPasteFlag = false;
					window.GlobalPasteFlagCounter = 0;
				}
				
				return result;
			},
			
			_pasteFromBinaryExcel: function(worksheet, base64, isIntoShape)
			{
				var oBinaryFileReader = new Asc.BinaryFileReader(true);
				var tempWorkbook = new Workbook;
				var t = this;
				
				window.global_pptx_content_loader.Start_UseFullUrl();
				oBinaryFileReader.Read(base64, tempWorkbook);
				this.activeRange = oBinaryFileReader.copyPasteObj.activeRange;
				var aPastedImages = window.global_pptx_content_loader.End_UseFullUrl();
				
				var pasteData = null;
				if (tempWorkbook)
					pasteData = tempWorkbook.aWorksheets[0];
				if (pasteData) {
					if(pasteData.Drawings && pasteData.Drawings.length)
					{
                        if (window["NativeCorrectImageUrlOnPaste"]) {
                            var url;
                            for(var i = 0, length = aPastedImages.length; i < length; ++i)
                            {
                                url = window["NativeCorrectImageUrlOnPaste"](aPastedImages[i].Url);
                                aPastedImages[i].Url = url;

                                var imageElem = aPastedImages[i];
                                if(null != imageElem)
                                {
                                    imageElem.SetUrl(url);
                                }
                            }

                            t._insertImagesFromBinary(worksheet, pasteData, isIntoShape);
                        }
                        else if(!(window["Asc"]["editor"] && window["Asc"]["editor"].isChartEditor))
                        {
                            if(aPastedImages && aPastedImages.length)
                            {
                                t._loadImagesOnServer(aPastedImages, function() {
                                    t._insertImagesFromBinary(worksheet, pasteData, isIntoShape);
                                });
                            }
                            else
                            {
                                t._insertImagesFromBinary(worksheet, pasteData, isIntoShape);
                            }
                        }
					}
					else 
					{	
						if(this._checkPasteFromBinaryExcel(worksheet, true))
						{
							var newFonts = {};
							pasteData.generateFontMap(newFonts);
							worksheet._loadFonts(newFonts, function() {
								worksheet.setSelectionInfo('paste', pasteData, false, "binary");
							});
						}
					}
					
					return true;
				}
				
				return false;
			},
			
			_pasteFromBinaryWord: function(worksheet, base64, isIntoShape)
			{
				var pasteData = this.ReadFromBinaryWord(base64, worksheet);
				var pasteFromBinaryWord = new Asc.pasteFromBinaryWord(this, worksheet);
				
				pasteFromBinaryWord._paste(worksheet, pasteData);
				
				return true;
			},
			
			_pasteFromBinaryPresentation: function(worksheet, base64, isIntoShape)
			{
				window.global_pptx_content_loader.Clear();

				var _stream = CreateBinaryReader(base64, 0, base64.length);
				var stream = new FileStream(_stream.data, _stream.size);
				var p_url = stream.GetString2();
				var p_width = stream.GetULong()/100000;
				var p_height = stream.GetULong()/100000;
				var fonts = [];
				var t = this;
				
				var first_string = stream.GetString2();
				
				switch(first_string)
				{
					case "Content":
					{
						//пока вставляем через html
						return false;
						
						//TODO вставка через бинарник требует переконвертировать контент в вордовский, либо сделать парсинг из презентационных параграфов
						var docContent = this.ReadPresentationText(stream, worksheet);
						var pasteFromBinaryWord = new Asc.pasteFromBinaryWord(this, worksheet);
						
						pasteFromBinaryWord._paste(worksheet, {DocumentContent: docContent});
						
						return true;
					}
					case "Drawings":
					{
						var objects = this.ReadPresentationShapes(stream, worksheet);
						
						//****если записана одна табличка, то вставляем html и поддерживаем все цвета и стили****
						if(!objects.arrImages.length && objects.arrShapes.length === 1)
						{
							var drawing = objects.arrShapes[0].graphicObject;
							if(typeof CGraphicFrame !== "undefined" && drawing instanceof CGraphicFrame)
								return false;
						}
						
						var arr_shapes = objects.arrShapes;
						if(arr_shapes && arr_shapes.length)
						{
							var aPastedImages = objects.arrImages;
							if(!(window["Asc"]["editor"] && window["Asc"]["editor"].isChartEditor))
							{
								if(aPastedImages && aPastedImages.length)
								{
									t._loadImagesOnServer(aPastedImages, function() {
										t._insertImagesFromBinary(worksheet, {Drawings: arr_shapes}, isIntoShape);
									});
								}
								else
									t._insertImagesFromBinary(worksheet, {Drawings: arr_shapes}, isIntoShape);
							}
						}
						
						return true;
					}
					case "SlideObjects":
					{
						break;
					}
				}
				
				return false;
			},
			
			_checkPasteFromBinaryExcel: function(worksheet, isWriteError)
			{
				var activeCellsPasteFragment = Asc.g_oRangeCache.getAscRange(this.activeRange);
				var rMax = (activeCellsPasteFragment.r2 - activeCellsPasteFragment.r1) + worksheet.activeRange.r1;
				var cMax = (activeCellsPasteFragment.c2 - activeCellsPasteFragment.c1) + worksheet.activeRange.c1;
				
				//если область вставки выходит за пределы доступной области
				if(cMax > gc_nMaxCol0 || rMax > gc_nMaxRow0)
				{
					if(isWriteError)
						worksheet.handlers.trigger ("onErrorEvent", Asc.c_oAscError.ID.PasteMaxRangeError, Asc.c_oAscError.Level.NoCritical);
					return false;
				}
				return true;
			},
			
			_getClassBinaryFromHtml: function(node)
			{
				var classNode, base64 = null, base64FromWord = null, base64FromPresentation = null;
				if(node.children[0] && node.children[0].getAttribute("class") != null && (node.children[0].getAttribute("class").indexOf("xslData;") > -1 || node.children[0].getAttribute("class").indexOf("docData;") > -1 || node.children[0].getAttribute("class").indexOf("pptData;") > -1))
					classNode = node.children[0].getAttribute("class");
				else if(node.children[0] && node.children[0].children[0] && node.children[0].children[0].getAttribute("class") != null && (node.children[0].children[0].getAttribute("class").indexOf("xslData;") > -1 || node.children[0].children[0].getAttribute("class").indexOf("docData;") > -1 || node.children[0].children[0].getAttribute("class").indexOf("pptData;") > -1))
					classNode = node.children[0].children[0].getAttribute("class");
				else if(node.children[0] && node.children[0].children[0] && node.children[0].children[0].children[0] && node.children[0].children[0].children[0].getAttribute("class") != null && (node.children[0].children[0].children[0].getAttribute("class").indexOf("xslData;") > -1 || node.children[0].children[0].children[0].getAttribute("class").indexOf("docData;") > -1  || node.children[0].children[0].children[0].getAttribute("class").indexOf("pptData;") > -1))
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
						else if(cL[i].indexOf("pptData;") > -1)
						{
							base64FromPresentation = cL[i].split('pptData;')[1];
						}
					}
				}
				
				return {base64: base64, base64FromWord: base64FromWord, base64FromPresentation: base64FromPresentation};
			},
			
			_loadImagesOnServer: function(aPastedImages, callback)
			{
				var api = asc["editor"];
				
				var oObjectsForDownload = GetObjectsForImageDownload(aPastedImages);

				sendImgUrls(api, oObjectsForDownload.aUrls, function (data) {
					var oImageMap = {};
					ResetNewUrls(data, oObjectsForDownload.aUrls, oObjectsForDownload.aBuilderImagesByUrl, oImageMap);

					callback();
				}, true);
			},
			
			ReadPresentationShapes: function(stream, worksheet)
			{
				History.TurnOff();
				
				var loader = new BinaryPPTYLoader();
				loader.presentation = worksheet.model;
				loader.Start_UseFullUrl();
				loader.stream = stream;
				//loader.presentation = editor.WordControl.m_oLogicDocument;
				//var presentation = editor.WordControl.m_oLogicDocument;
				var count = stream.GetULong();
				var arr_shapes = [];
				var arr_transforms = [];
				var arrBase64Img = [];
				var cStyle;
				
				for(var i = 0; i < count; ++i)
				{
					//loader.TempMainObject = presentation.Slides[presentation.CurPage];
					var style_index = null;
					//читаем флаг о наличии табличного стиля
					if(!loader.stream.GetBool())
					{
						if(loader.stream.GetBool())
						{
							loader.stream.Skip2(1);
							cStyle = loader.ReadTableStyle();
	
							loader.stream.GetBool();
							style_index = stream.GetString2();
						}
					}
					
					var drawing = loader.ReadGraphicObject();
					
					var x = stream.GetULong()/100000;
					var y = stream.GetULong()/100000;
					var extX = stream.GetULong()/100000;
					var extY = stream.GetULong()/100000;
					var base64 = stream.GetString2();
					
					if(count !== 1 && typeof CGraphicFrame !== "undefined" && drawing instanceof CGraphicFrame)
					{
						drawing = DrawingObjectsController.prototype.createImage(base64, x, y, extX, extY);
					}
					
					arr_shapes[i] = worksheet.objectRender.createDrawingObject();
					arr_shapes[i].graphicObject = drawing;
				}
				
				History.TurnOn();
				
				return {arrShapes: arr_shapes, arrImages: loader.End_UseFullUrl(), arrTransforms: arr_transforms};
			},
			
			ReadPresentationText: function(stream, worksheet)
			{
				History.TurnOff();
				
				var loader = new BinaryPPTYLoader();
				loader.Start_UseFullUrl();
				loader.stream = stream;
				loader.presentation = worksheet.model;

				var count = stream.GetULong() / 100000;
				
				//читаем контент, здесь только параграфы
				//var newDocContent = new CDocumentContent(shape.txBody, editor.WordControl.m_oDrawingDocument, 0 , 0, 0, 0, false, false);
				var elements = [], paragraph, selectedElement;
				for(var i = 0; i < count; ++i)
				{
					loader.stream.Skip2(1); // must be 0
					paragraph = loader.ReadParagraph(worksheet.model);
					
					elements.push(paragraph);
				}
				
				History.TurnOn();
				
				return elements;
			},
			
			_pasteInShape: function(worksheet, node, onlyFromLocalStorage, targetDocContent)
			{
				targetDocContent.DrawingDocument.m_oLogicDocument = null;
				
				var oPasteProcessor = new PasteProcessor({WordControl:{m_oLogicDocument: targetDocContent}, FontLoader: {}}, false, false, true, true);
				oPasteProcessor.map_font_index = this.Api.FontLoader.map_font_index;
				oPasteProcessor.bIsDoublePx = false;
				
				var newFonts;
				
				if(onlyFromLocalStorage)
					node = this.element;//this.lStorage.htmlInShape ? this.lStorage.htmlInShape : this.lStorage;
				
				//если находимся внутри диаграммы убираем ссылки
				if(targetDocContent && targetDocContent.Parent && targetDocContent.Parent.parent && targetDocContent.Parent.parent.chart)
				{
					var changeTag = $(node).find("a");
					this._changeHtmlTag(changeTag);
				}
				
				oPasteProcessor._Prepeare_recursive(node, true, true);
				
				oPasteProcessor.aContent = [];
                 
				newFonts = this._convertFonts(oPasteProcessor.oFonts);


				History.StartTransaction();
				oPasteProcessor._Execute(node, {}, true, true, false);
				if(!oPasteProcessor.aContent || !oPasteProcessor.aContent.length) {
					window.GlobalPasteFlag = false;
					window.GlobalPasteFlagCounter = 0;
					History.EndTransaction();
					return false;
				}

                var targetContent = worksheet.objectRender.controller.getTargetDocContent(true);//нужно для заголовков диаграмм
                targetContent.Remove(1, true, true);
					
				worksheet._loadFonts(newFonts, function () {
					oPasteProcessor.InsertInPlace(targetContent , oPasteProcessor.aContent);
                    var oTargetTextObject = getTargetTextObject(worksheet.objectRender.controller);
                    oTargetTextObject && oTargetTextObject.checkExtentsByDocContent && oTargetTextObject.checkExtentsByDocContent();
					worksheet.objectRender.controller.startRecalculate();
                    worksheet.objectRender.controller.cursorMoveRight(false, false);
					window.GlobalPasteFlag = false;
					window.GlobalPasteFlagCounter = 0;
					History.EndTransaction();
				});
				
 				return true;
			},
			//TODO сделать при получаении структуры. игнорировать размер шрифта и тп
			_changeHtmlTag: function(arr)
			{
				var oldElem, value, style, bold, underline, italic;
				for(var i = 0; i < arr.length; i++)
				{
					oldElem = arr[i];
					value = oldElem.innerText;
					
					underline = "none";
					if(oldElem.style.textDecoration && oldElem.style.textDecoration != "")
						underline = oldElem.style.textDecoration;
						
					italic = "normal";
					if(oldElem.style.textDecoration && oldElem.style.textDecoration != "")
						italic = oldElem.style.fontStyle;
						
					bold = "normal";
					if(oldElem.style.fontWeight && oldElem.style.fontWeight != "")
						bold = oldElem.style.fontWeight;
					
					style = ' style = "text-decoration:' + underline + ";" + "font-style:" + italic + ";" + "font-weight:" + bold + ";" + '"';
					$(oldElem).replaceWith("<span" + style +  ">" + value + "</span>");
				};
			},
			
			_convertFonts: function(oFonts)
			{
				var newFonts = {};
				var fontName;
				for(var i in oFonts)
				{
					fontName = oFonts[i].Name;
					newFonts[fontName] = 1;
				};
				return newFonts;
			},
			
            _editorPasteExec: function (worksheet, node, isText,onlyFromLocalStorage)
            {
				if(node == undefined)
					return;
					
				var aResult, binaryResult, pasteFragment = node, t = this, localStorageResult;

				if(isOnlyLocalBufferSafari && navigator.userAgent.toLowerCase().indexOf('safari') > -1 && navigator.userAgent.toLowerCase().indexOf('mac'))
					onlyFromLocalStorage = true;
				
				t.alreadyLoadImagesOnServer = false;
				
				//****binary****
				if(onlyFromLocalStorage)
				{
					onlyFromLocalStorage = null;
					node = this.element;
					pasteFragment = node;
				}
				
				//если находимся внутри шейпа
				var isIntoShape = worksheet.objectRender.controller.getTargetDocContent();
				if(isIntoShape)
				{
					var callback = function(isSuccess)
					{
						if(isSuccess)
							t._pasteInShape(worksheet, node, onlyFromLocalStorage, isIntoShape);
						else
						{
							window.GlobalPasteFlag = false;
							window.GlobalPasteFlagCounter = 0;
						}
					};
					
					worksheet.objectRender.controller.checkSelectedObjectsAndCallback2(callback);
					return;
				}
				
				//****binary****
				if(copyPasteUseBinary)
				{
					this.activeRange = worksheet.activeRange.clone(true);
					binaryResult = this._pasteFromBinary(worksheet, node, onlyFromLocalStorage, isIntoShape);
					
					if(binaryResult === true)
						return;
					else if(binaryResult !== false && binaryResult != undefined)
					{
						pasteFragment = binaryResult;
						node = binaryResult;
					}
				}

				this.activeRange = worksheet.activeRange.clone(true);
				
				
				var callBackAfterLoadImages = function()
				{
					History.TurnOff();
				
					var oPasteProcessor;
					var oTempDrawingDocument = worksheet.model.DrawingDocument;
					var newCDocument = new CDocument(oTempDrawingDocument, false);
					newCDocument.bFromDocument = true;
					//TODo!!!!!!
					newCDocument.Content[0].bFromDocument = true;
					newCDocument.theme = t.Api.wbModel.theme;
					
					oTempDrawingDocument.m_oLogicDocument = newCDocument;
					var oOldEditor = undefined;
					if ("undefined" != typeof editor)
						oOldEditor = editor;
					editor = {WordControl: oTempDrawingDocument, isDocumentEditor: true};
					var oPasteProcessor = new PasteProcessor({WordControl:{m_oLogicDocument: newCDocument}, FontLoader: {}}, false, false);
					oPasteProcessor._Prepeare_recursive(node, true, true)
					oPasteProcessor._Execute(node, {}, true, true, false);
					editor = oOldEditor;
					
					History.TurnOn();
					
					var pasteFromBinaryWord = new Asc.pasteFromBinaryWord(t, worksheet);
					pasteFromBinaryWord._paste(worksheet, {content: oPasteProcessor.aContent});
					window.GlobalPasteFlagCounter = 0;
					window.GlobalPasteFlag = false;
				};
				
				var aImagesToDownload = this._getImageFromHtml(node, true);
				if(aImagesToDownload !== null)//load to server
				{
                    var api = asc["editor"];
					sendImgUrls(api, aImagesToDownload, function (data) {
                       for (var i = 0, length = Math.min(data.length, aImagesToDownload.length); i < length; ++i) 
					   {
							var elem = data[i];
							var sFrom = aImagesToDownload[i];
							if (null != elem.url) 
							{
								var name = g_oDocumentUrls.imagePath2Local(elem.path);
								t.oImages[sFrom] = name;
							} 
							else 
							{
								t.oImages[sFrom] = sFrom;
							}
						}
						
						t.alreadyLoadImagesOnServer = true;
                        callBackAfterLoadImages();
						
                    }, true);
					
				}
				else
				{
					callBackAfterLoadImages();
				}
            },
			
			_pasteTextOnSheet: function(text, worksheet)
			{
				//TODO сделать вставку текста всегда через эту функцию
				this.activeRange = worksheet.activeRange.clone(true);
				
				//если находимся внутри шейпа
				var isIntoShape = worksheet.objectRender.controller.getTargetDocContent();
				if(isIntoShape)
				{
					var callback = function(isSuccess)
					{
						if(isSuccess === false)
						{
							return false;
						}
						
						var Count = text.length;
						for ( var Index = 0; Index < Count; Index++ )
						{
							var _char = text.charAt(Index);
							if (" " == _char)
								isIntoShape.Paragraph_Add(new ParaSpace());
							else
								isIntoShape.Paragraph_Add(new ParaText(_char));
						}
					};
					
					worksheet.objectRender.controller.checkSelectedObjectsAndCallback2(callback);
					return;
				}
				
				var aResult = [];
				aResult[this.activeRange.r1] = [];
				
				var oNewItem = [];
				oNewItem[0] = this._getDefaultCell(worksheet);
				aResult[this.activeRange.r1][this.activeRange.c1] = oNewItem;
				oNewItem[0][0].text = text;
				
				aResult.fontsNew = [];
				aResult.rowSpanSpCount = 0;
				aResult.cellCount = 1;
				aResult._images = undefined;
				aResult._aPastedImages = undefined;
				
				this._pasteResult(aResult, worksheet);
			},
			
			_getImageFromHtml: function(html, isGetUrlsArray)
			{
				var res = null;
				
				if(html)
				{
					var allImages = html.getElementsByTagName('img');
					
					if(allImages && allImages.length)
					{
						if(isGetUrlsArray)
						{
							var arrayImages = [];
							for(var i = 0; i < allImages.length; i++)
							{
								arrayImages[i] = allImages[i].src;
							}
							
							res = arrayImages;
						}
						else
						{
							res = allImages;
						}
					}
				}
				
				return res;
			},
			
			_pasteResult: function(aResult, worksheet)
			{
				//insert into document content
				if(aResult && !(aResult.onlyImages && window["Asc"]["editor"] && window["Asc"]["editor"].isChartEditor))
					worksheet.setSelectionInfo('paste',aResult,this);
				
				window.GlobalPasteFlagCounter = 0;
				window.GlobalPasteFlag = false;
			},
			
			ReadFromBinaryWord : function(sBase64, worksheet)
			{
			    History.TurnOff();
                g_oIdCounter.m_bRead = true;
				//передавать CDrawingDocument текущего worksheet
				var oTempDrawingDocument = worksheet.model.DrawingDocument;
				
			    var newCDocument = new CDocument(oTempDrawingDocument, false);
				newCDocument.bFromDocument = true;
				newCDocument.theme = this.Api.wbModel.theme;
				
			    oTempDrawingDocument.m_oLogicDocument = newCDocument;
			    var oOldEditor = undefined;
			    if ("undefined" != typeof editor)
			        oOldEditor = editor;
			    //создается глобальная переменная
			    editor = { isDocumentEditor: true, WordControl: { m_oLogicDocument: newCDocument } };
				
				window.global_pptx_content_loader.Clear();
				window.global_pptx_content_loader.Start_UseFullUrl();
				
			    var openParams = { checkFileSize: false, charCount: 0, parCount: 0 };
			    var oBinaryFileReader = new BinaryFileReader(newCDocument, openParams);
			    var oRes = oBinaryFileReader.ReadFromString(sBase64);
				
				window.global_pptx_content_loader.End_UseFullUrl();
				History.TurnOn();
                g_oIdCounter.m_bRead = false;
			    editor = oOldEditor;

			    return oRes;
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
			
			_checkMaxTextLength: function(aResult, r, c)
			{
				var result = false;
				var isChange = false;
				
				var currentCellData = aResult[r][c];
				if(currentCellData && currentCellData[0])
				{
					currentCellData = currentCellData[0];
					for(var i = 0; i < currentCellData.length; i++)
					{
						if(currentCellData[i] && currentCellData[i].text && currentCellData[i].text.length > c_oAscMaxCellOrCommentLength)
						{
							isChange = true;
							
							var text = currentCellData[i].text;
							var lengthOfText = text.length;
							var iterCount = Math.ceil(lengthOfText / c_oAscMaxCellOrCommentLength);
							var splitText;
							for(var j = 0; j < iterCount; j++)
							{
								splitText = text.substr(c_oAscMaxCellOrCommentLength * j, c_oAscMaxCellOrCommentLength * (j + 1));
								if(!aResult[r])
									aResult[r] = [];
								if(!aResult[r][c])
									aResult[r][c] = [];
								if(!aResult[r][c][0])
									aResult[r][c][0] = [];
								
								aResult[r][c][0] = currentCellData;
								aResult[r][c][0][0].text = splitText;
								
								if(iterCount !== j + 1)
									r++;
							}
						}
					}
					if(isChange)
						result = {aResult: aResult, r: r, c: c};
				}
				
				return result;
			},
			
			_selectElement: function (callback, copyCellValue) {
				var t = this, selection, rangeToSelect, overflowBody, firstWidth;
				
				overflowBody = document.body.style.overflow;
				if(copyCellValue)
				{
					firstWidth = t.element.style.width;
					t.element.style.width = document.body.offsetWidth - 1 + "px";
					t.element.focus();
				}
				else
					document.body.style.overflow = 'hidden';
				
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

							t.element.style.MozUserSelect = "none";
							
							if(firstWidth)
								t.element.style.width = firstWidth;
							document.body.style.overflow = overflowBody;
							
							// for paste event
							if (callback && callback.call) {callback();}
						},
						time_interval);
			},

			_makeNodesFromCellValue: function (val, defFN, defFS, cell) {
				var i, res, span, f;

				function getTextDecoration(format) {
					var res = [];
					if (Asc.EUnderline.underlineNone !== format.u) { res.push("underline"); }
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
					}
					
					f = val[i].format;
					if (f.c) 
					{
						if(f.c && f.c.rgb)
							span.style.color = number2color(f.c.rgb);
						else
							span.style.color = number2color(f.c);
					}
					
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
			
			_makeTableNode: function (range, worksheet, isCut, isIntoShape) {
				var fn = range.worksheet.workbook.getDefaultFont();
				var fs = range.worksheet.workbook.getDefaultSize();
				var bbox = range.getBBox0();
				var merged = [];
				var t = this;
				var table, tr, td, cell, j, row, col, mbbox, h, w, b;
				var objectRender = worksheet.objectRender;

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
				
				//копируем изображения
				//если выделены графические объекты внутри группы
				if(isIntoShape)//если курсор находится внутри шейпа
				{
					var CopyProcessor = new Asc.CopyProcessor();
					var divContent = document.createElement('div');
					CopyProcessor.CopyDocument(divContent, isIntoShape, true);
					
					var htmlInShape = "";
					if(divContent)
						htmlInShape = divContent;	
					
					t.lStorageText = this._getTextFromShape(isIntoShape);
					
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
							
							var altAttr = null;
							//altAttr = cloneImg.graphicObject.writeToBinaryForCopyPaste(cMemory);
							var isImage = cloneImg.graphicObject.isImage();
							var imageUrl;
							if(isImage)
								imageUrl = cloneImg.graphicObject.getImageUrl();
							if(isImage && imageUrl)
								url = getFullImageSrc2(imageUrl);
							else
								url = cloneImg.graphicObject.getBase64Img();
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
									localStText += '\t';
								var currentRange = range.worksheet.getCell3(row, col);
								//добавляем текст
								var textRange = currentRange.getValue();
								if(textRange == '')
									localStText += '\t';
								else
									localStText += textRange;
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

							cell = range.worksheet.getCell3(row, col);
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
								var cellMergeFinish = range.worksheet.getCell3(mbbox.r2, mbbox.c2);
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
								
							
							b = cell.getFill();
							// если b==0 мы не зайдем в if, хотя b==0 это ни что иное, как черный цвет заливки.
							if (b!=null) {td.style.backgroundColor = number2color(b.getRgb());}

							this._makeNodesFromCellValue(cell.getValue2(), fn ,fs, cell).forEach(
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
			
			_getTextFromHtml: function(html)
			{
				var text = "";
				for(var i = 0; i < html.children.length; i++)
				{
					if(html.children[i].nodeName.toLowerCase() == "p" && i != 0)
						text += '\n';	
					text += html.children[i].innerText;
				};
				
				return text;
			},
			
			_getTextFromShape: function(documentContent)
			{
				var res = "";
				
				if(documentContent && documentContent.Content && documentContent.Content.length)
				{
					for(var i = 0; i < documentContent.Content.length; i++)
					{
						if(documentContent.Content[i])
						{
							var paraText = documentContent.Content[i].Get_SelectedText();
							if(paraText)
							{
								if(i !== 0)
								{
									res += '\n';
								}
								res += paraText;
							}
						}
					}
				}
				
				return res;
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
						var fn = g_fontApplication.GetFontNameDictionary(style.fontFamily, false);
						if(fn == '')
							fn = g_fontApplication.GetFontNameDictionary(parent.style.fontFamily, true);
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
									u: td.indexOf("underline") >= 0 ? Asc.EUnderline.underlineSingle : Asc.EUnderline.underlineNone,
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
											u: td.indexOf("underline") >= 0 ? Asc.EUnderline.underlineSingle : Asc.EUnderline.underlineNone,
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
			
			_insertImagesFromBinary: function(ws, data, isIntoShape)
			{
				var activeRange = ws.activeRange;
				var curCol, drawingObject, curRow, startCol, startRow, xfrm, aImagesSync = [], activeRow, activeCol, tempArr, offX, offY, rot;

				History.Create_NewPoint();
				History.StartTransaction();
				
				//определяем стартовую позицию, если изображений несколько вставляется
				for(var i = 0; i < data.Drawings.length; i++)
				{
					drawingObject = data.Drawings[i];
					xfrm = drawingObject.graphicObject.spPr.xfrm;
					if(xfrm)
					{
						offX = 0;
						offY = 0;
						rot = isRealNumber(xfrm.rot) ? xfrm.rot : 0;
						rot = normalizeRotate(rot);
						if (checkNormalRotate(rot))
						{
							if(isRealNumber(xfrm.offX) && isRealNumber(xfrm.offY))
							{
								offX = xfrm.offX;
								offY = xfrm.offY;
							}
						}
						else
						{
							if(isRealNumber(xfrm.offX) && isRealNumber(xfrm.offY)
							&& isRealNumber(xfrm.extX) && isRealNumber(xfrm.extY))
							{
								offX = xfrm.offX + xfrm.extX/2 - xfrm.extY/2;
								offY = xfrm.offY + xfrm.extY/2 - xfrm.extX/2;
							}
						}

						if(i == 0)
						{
							startCol = offX;
							startRow = offY;
						}
						else 
						{
							if(startCol > offX)
							{
								startCol = offX;
							}	
							if(startRow > offY)
							{
								startRow = offY;
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
					data.Drawings[i].graphicObject = data.Drawings[i].graphicObject.copy();
					drawingObject = data.Drawings[i];
					
					
					//отдельная обработка для вставки таблички из презентаций
					if(data.Drawings.length === 1 && typeof CGraphicFrame !== "undefined" && drawingObject.graphicObject instanceof CGraphicFrame)
					{
						//вставляем табличку из презентаций
						var pasteFromBinaryWord = new Asc.pasteFromBinaryWord(this, ws);
						
						var newCDocument = new CDocument(oTempDrawingDocument, false);
						newCDocument.bFromDocument = true;
						newCDocument.theme = this.Api.wbModel.theme;
						
						drawingObject.graphicObject.setBDeleted(true);
						drawingObject.graphicObject.setWordFlag(false, newCDocument);
						
						var oTempDrawingDocument = ws.model.DrawingDocument;
						oTempDrawingDocument.m_oLogicDocument = newCDocument;
						
						drawingObject.graphicObject.graphicObject.Set_Parent(newCDocument);
						pasteFromBinaryWord._paste(ws, {DocumentContent: [drawingObject.graphicObject.graphicObject]});
						
						return;
					}

                    if(drawingObject.graphicObject.fromSerialize && drawingObject.graphicObject.setBFromSerialize)
                    {
                        drawingObject.graphicObject.setBFromSerialize(false);
                    }
					CheckSpPrXfrm(drawingObject.graphicObject);
					xfrm = drawingObject.graphicObject.spPr.xfrm;
					
					activeRow = activeRange.r1;
					activeCol = activeRange.c1;
					if(isIntoShape && isIntoShape.Parent &&  isIntoShape.Parent.parent && isIntoShape.Parent.parent.drawingBase && isIntoShape.Parent.parent.drawingBase.from)
					{
						activeRow = isIntoShape.Parent.parent.drawingBase.from.row;
						activeCol = isIntoShape.Parent.parent.drawingBase.from.col;
					}
					
					curCol = xfrm.offX - startCol + ws.objectRender.convertMetric(ws.cols[activeCol].left - ws.getCellLeft(0, 1), 1, 3);
					curRow = xfrm.offY - startRow + ws.objectRender.convertMetric(ws.rows[activeRow].top  - ws.getCellTop(0, 1), 1, 3);

					drawingObject = ws.objectRender.cloneDrawingObject(drawingObject);
					drawingObject.graphicObject.setDrawingBase(drawingObject);
					
					drawingObject.graphicObject.setDrawingObjects(ws.objectRender);
					drawingObject.graphicObject.setWorksheet(ws.model);

                    xfrm.setOffX(curCol);
                    xfrm.setOffY(curRow);


                    drawingObject.graphicObject.checkRemoveCache &&  drawingObject.graphicObject.checkRemoveCache();

					drawingObject.graphicObject.addToDrawingObjects();
                    if(drawingObject.graphicObject.checkDrawingBaseCoords)
                    {
                        drawingObject.graphicObject.checkDrawingBaseCoords();
                    }
                    drawingObject.graphicObject.recalculate();
					drawingObject.graphicObject.select(ws.objectRender.controller, 0);
					
					tempArr = [];
					drawingObject.graphicObject.getAllRasterImages(tempArr);
					
					if(tempArr.length)
					{	
						for(var n = 0; n < tempArr.length; n++)
						{
							aImagesSync.push(tempArr[n]);
						}
					}
				}

                ws.objectRender.showDrawingObjects(true);
                ws.objectRender.controller.updateOverlay();
                ws.setSelectionShape(true);
                History.EndTransaction();
                if(aImagesSync.length > 0)
                {
                    window["Asc"]["editor"].ImageLoader.LoadDocumentImages(aImagesSync, null,
                        function(){
                            ws.objectRender.showDrawingObjects(true);
                            ws.objectRender.controller.getGraphicObjectProps();
                        });
                }
			},
			
			_insertImagesFromHTML: function(ws, data)
			{
				var activeRange = ws.activeRange;
				var curCol, drawingObject, curRow, startCol, startRow, xfrm, aImagesSync = [], activeRow, activeCol, tempArr, offX, offY, rot, a_drawings = [];
				
				for (var im = 0; im < data.addImages.length; im++) 
				{
					var src = data.addImages[im].tag.src;
					var extX = ws.objectRender.convertPixToMM(data.addImages[im].tag.width);
					var extY = ws.objectRender.convertPixToMM(data.addImages[im].tag.height);
					var x = ws.objectRender.convertMetric(ws.cols[data.addImages[im].curCell.col].left - ws.getCellLeft(0, 1), 1, 3);
					var y = ws.objectRender.convertMetric(ws.rows[data.addImages[im].curCell.row].top - ws.getCellTop(0, 1), 1, 3);

					if(src) 
					{
						var drawing = DrawingObjectsController.prototype.createImage(src, x, y, extX, extY);
						var drawingBase = ws.objectRender.createDrawingObject();
						drawingBase.graphicObject = drawing;
						
						a_drawings.push(drawingBase);
					}
				}
				
				History.Create_NewPoint();
				History.StartTransaction();

				for(var i = 0; i < a_drawings.length; i++)
				{	
					a_drawings[i].graphicObject = a_drawings[i].graphicObject.copy();
					drawingObject = a_drawings[i];
					
					//отдельная обработка для вставки таблички из презентаций
					if(a_drawings.length === 1 && typeof CGraphicFrame !== "undefined" && drawingObject.graphicObject instanceof CGraphicFrame)
					{
						//вставляем табличку из презентаций
						var pasteFromBinaryWord = new Asc.pasteFromBinaryWord(this, ws);
						
						var newCDocument = new CDocument(oTempDrawingDocument, false);
						newCDocument.bFromDocument = true;
						newCDocument.theme = this.Api.wbModel.theme;
						
						drawingObject.graphicObject.setBDeleted(true);
						drawingObject.graphicObject.setWordFlag(false, newCDocument);
						
						var oTempDrawingDocument = ws.model.DrawingDocument;
						oTempDrawingDocument.m_oLogicDocument = newCDocument;
						
						drawingObject.graphicObject.graphicObject.Set_Parent(newCDocument);
						pasteFromBinaryWord._paste(ws, {DocumentContent: [drawingObject.graphicObject.graphicObject]});
						
						return;
					}

					CheckSpPrXfrm(drawingObject.graphicObject);
					xfrm = drawingObject.graphicObject.spPr.xfrm;

					drawingObject = ws.objectRender.cloneDrawingObject(drawingObject);
					drawingObject.graphicObject.setDrawingBase(drawingObject);
					
					drawingObject.graphicObject.setDrawingObjects(ws.objectRender);
					drawingObject.graphicObject.setWorksheet(ws.model);

                    drawingObject.graphicObject.checkRemoveCache &&  drawingObject.graphicObject.checkRemoveCache();

					drawingObject.graphicObject.addToDrawingObjects();
                    if(drawingObject.graphicObject.checkDrawingBaseCoords)
                    {
                        drawingObject.graphicObject.checkDrawingBaseCoords();
                    }
                    drawingObject.graphicObject.recalculate();
					drawingObject.graphicObject.select(ws.objectRender.controller, 0);
					
					tempArr = [];
					drawingObject.graphicObject.getAllRasterImages(tempArr);
					
					if(tempArr.length)
					{	
						for(var n = 0; n < tempArr.length; n++)
						{
							aImagesSync.push(tempArr[n]);
						}
					}
				}

                ws.objectRender.showDrawingObjects(true);
                ws.objectRender.controller.updateOverlay();
                ws.setSelectionShape(true);
                History.EndTransaction();
                if(aImagesSync.length > 0)
                {
                    window["Asc"]["editor"].ImageLoader.LoadDocumentImages(aImagesSync, null,
                        function(){
                            ws.objectRender.showDrawingObjects(true);
                            ws.objectRender.controller.getGraphicObjectProps();
                    });
                }
			},
			
			_insertImagesFromBinaryWord: function(ws, data, aImagesSync)
			{
				var activeRange = ws.activeRange;
				var curCol, drawingObject, curRow, startCol = 0, startRow = 0, xfrm, drawingBase, graphicObject, offX, offY, rot;

				History.Create_NewPoint();
				History.StartTransaction();
				
				var api = window["Asc"]["editor"];
				var addImagesFromWord = data.addImagesFromWord;
				//определяем стартовую позицию, если изображений несколько вставляется
				for(var i = 0; i < addImagesFromWord.length; i++)
				{
					graphicObject = addImagesFromWord[i].image.GraphicObj;
					
					//convert from word
                    if(graphicObject.setBDeleted2)
                    {
                        graphicObject.setBDeleted2(true);
                    }
                    else
                    {
                        graphicObject.bDeleted = true;
                    }
					graphicObject = graphicObject.convertToPPTX(ws.model.DrawingDocument, ws.model);
					
					//create new drawingBase
					drawingObject = ws.objectRender.createDrawingObject();
					drawingObject.graphicObject = graphicObject;

					if(drawingObject.graphicObject.spPr && drawingObject.graphicObject.spPr.xfrm)
					{
						xfrm = drawingObject.graphicObject.spPr.xfrm;
						offX = 0;
						offY = 0;
						rot = isRealNumber(xfrm.rot) ? xfrm.rot : 0;
						rot = normalizeRotate(rot);
						if (checkNormalRotate(rot))
						{
							if(isRealNumber(xfrm.offX) && isRealNumber(xfrm.offY))
							{
								offX = xfrm.offX;
								offY = xfrm.offY;
							}
						}
						else
						{
							if(isRealNumber(xfrm.offX) && isRealNumber(xfrm.offY)
								&& isRealNumber(xfrm.extX) && isRealNumber(xfrm.extY))
							{
								offX = xfrm.offX + xfrm.extX/2 - xfrm.extY/2;
								offY = xfrm.offY + xfrm.extY/2 - xfrm.extX/2;
							}
						}

						if(i == 0)
						{
							startCol = offX;
							startRow = offY;
						}
						else 
						{
							if(startCol > offX)
							{
								startCol = offX;
							}	
							if(startRow > offY)
							{
								startRow = offY;
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


					CheckSpPrXfrm(drawingObject.graphicObject);
					xfrm = drawingObject.graphicObject.spPr.xfrm;

					curCol = xfrm.offX - startCol + ws.objectRender.convertMetric(ws.cols[addImagesFromWord[i].col].left - ws.getCellLeft(0, 1), 1, 3);
					curRow = xfrm.offY - startRow + ws.objectRender.convertMetric(ws.rows[addImagesFromWord[i].row].top  - ws.getCellTop(0, 1), 1, 3);
					
					xfrm.setOffX(curCol);
					xfrm.setOffY(curRow);

					drawingObject = ws.objectRender.cloneDrawingObject(drawingObject);
					drawingObject.graphicObject.setDrawingBase(drawingObject);
					
					drawingObject.graphicObject.setDrawingObjects(ws.objectRender);
					drawingObject.graphicObject.setWorksheet(ws.model);

                    drawingObject.graphicObject.checkRemoveCache &&  drawingObject.graphicObject.checkRemoveCache();
                    //drawingObject.graphicObject.setDrawingDocument(ws.objectRender.drawingDocument);
					drawingObject.graphicObject.addToDrawingObjects();
                    if(drawingObject.graphicObject.checkDrawingBaseCoords)
                    {
                        drawingObject.graphicObject.checkDrawingBaseCoords();
                    }
					drawingObject.graphicObject.recalculate();
                    drawingObject.graphicObject.select(ws.objectRender.controller, 0);
				}

                var old_val = api.ImageLoader.bIsAsyncLoadDocumentImages;
                api.ImageLoader.bIsAsyncLoadDocumentImages = true;
                api.ImageLoader.LoadDocumentImages(aImagesSync, null, ws.objectRender.asyncImagesDocumentEndLoaded);
                api.ImageLoader.bIsAsyncLoadDocumentImages = old_val;

				ws.objectRender.showDrawingObjects(true);
                ws.setSelectionShape(true);
				ws.objectRender.controller.updateOverlay();
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
			this.isUsuallyPutImages = null;
			this.maxLengthRowCount = 0;
			
			return this;
		}

		pasteFromBinaryWord.prototype = {
			
			_paste : function(worksheet, pasteData)
			{
				var documentContent = pasteData.content;
				var activeRange = worksheet.activeRange.clone(true);
				if(pasteData.images && pasteData.images.length)
					this.isUsuallyPutImages = true;
				
				if(!documentContent || (documentContent && !documentContent.length))
					return;
				
				var documentContentBounds = new Asc.DocumentContentBounds();
				var coverDocument = documentContentBounds.getBounds(0,0, documentContent);
				this._parseChildren(coverDocument, activeRange);
				
				this.aResult.fontsNew = this.fontsNew;
				this.aResult.rowSpanSpCount = 0;
				this.aResult.cellCount = coverDocument.width;
				this.aResult._images = pasteData.images ? pasteData.images : this.aResult._images;
				this.aResult._aPastedImages = pasteData.aPastedImages ? pasteData.aPastedImages : this.aResult._aPastedImages;
				
				worksheet.setSelectionInfo('paste', this.aResult, this);
			},
			
			_parseChildren: function(children, activeRange)
			{
				var backgroundColor;
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
								
								//backgroundColor
								backgroundColor = this.getBackgroundColorTCell(childrens[i]);
								if(backgroundColor)
									this.aResult[row + activeRange.r1][col + activeRange.c1][0].bc = backgroundColor;
								
								this.aResult[row + activeRange.r1][col + activeRange.c1][0].borders = this._getBorders(childrens[i], row, col, this.aResult[row + activeRange.r1][col + activeRange.c1][0].borders);
							}
						}
					}
					
					if(childrens[i].children.length == 0)
					{
						//if parent - cell of table
						var colSpan = null;
						var rowSpan = null;
						
						this._parseParagraph(childrens[i], activeRange, childrens[i].top + activeRange.r1, childrens[i].left + activeRange.c1);
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
				if(top == cellTable.top && !formatBorders.t.s && borders.Top.Value !== 0/*border_None*/)
				{
					borderStyleName = this.clipboard._getBorderStyleName(defaultStyle, this.ws.objectRender.convertMetric(borders.Top.Size,3,1));
					if (null !== borderStyleName) {
						formatBorders.t.setStyle(borderStyleName);
						formatBorders.t.c = new RgbColor(this.clipboard._getBinaryColor("rgb(" + borders.Top.Color.r + "," + borders.Top.Color.g + "," + borders.Top.Color.b + ")"));
					}
				}
				//left border for cell
				if(left == cellTable.left && !formatBorders.l.s && borders.Left.Value !== 0/*border_None*/)
				{
					borderStyleName = this.clipboard._getBorderStyleName(defaultStyle, this.ws.objectRender.convertMetric(borders.Left.Size,3,1));
					if (null !== borderStyleName) {
						formatBorders.l.setStyle(borderStyleName);
						formatBorders.l.c = new RgbColor(this.clipboard._getBinaryColor("rgb(" + borders.Left.Color.r + "," + borders.Left.Color.g + "," + borders.Left.Color.b + ")"));
					}
				}
				//bottom border for cell
				if(top == cellTable.top + heigthCell - 1 && !formatBorders.b.s && borders.Bottom.Value !== 0/*border_None*/)
				{
					borderStyleName = this.clipboard._getBorderStyleName(defaultStyle, this.ws.objectRender.convertMetric(borders.Bottom.Size,3,1));
					if (null !== borderStyleName) {
						formatBorders.b.setStyle(borderStyleName);
						formatBorders.b.c = new RgbColor(this.clipboard._getBinaryColor("rgb(" + borders.Bottom.Color.r + "," + borders.Bottom.Color.g + "," + borders.Bottom.Color.b + ")"));
					}
				}
				//right border for cell
				if(left == cellTable.left + widthCell - 1 && !formatBorders.r.s && borders.Right.Value !== 0/*border_None*/)
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
				var content = paragraph.elem.Content;
				var row, cTextPr, fontFamily = "Arial";
				var text = null;
				var oNewItem = [], cloneNewItem;
				var paraRunContent;

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
				
				if(this.aResult[row + this.maxLengthRowCount] && this.aResult[row + this.maxLengthRowCount][col] && this.aResult[row + this.maxLengthRowCount][col][0] && this.aResult[row + this.maxLengthRowCount][col][0].length === 0 && (this.aResult[row + this.maxLengthRowCount][col][0].borders || this.aResult[row + this.maxLengthRowCount][col][0].rowSpan != null))
				{
					if(this.aResult[row + this.maxLengthRowCount][col][0].borders)
						oNewItem.borders = this.aResult[row + this.maxLengthRowCount][col][0].borders;
					if(this.aResult[row + this.maxLengthRowCount][col][0].rowSpan != null)
					{
						oNewItem.rowSpan = this.aResult[row + this.maxLengthRowCount][col][0].rowSpan;
						oNewItem.colSpan = this.aResult[row + this.maxLengthRowCount][col][0].colSpan;
					}
					delete this.aResult[row + this.maxLengthRowCount][col];
				};
	
				if(!aResult[row])
					aResult[row] = [];
					
				var s = 0;
				var c1 = col !== undefined ? col : activeRange.c1;
				
				//backgroundColor
				var backgroundColor = this.getBackgroundColorTCell(paragraph);
				if(backgroundColor)
					oNewItem.bc = backgroundColor;
				
				//настройки параграфа
				paragraph.elem.CompiledPr.NeedRecalc = true;
				var paraPr = paragraph.elem.Get_CompiledPr();
				var paragraphFontFamily = paraPr.TextPr.FontFamily.Name;
				
				//горизонтальное выравнивание
				var horisonalAlign = this._getAlignHorisontal(paraPr);
				if(horisonalAlign)
					oNewItem.a = this._getAlignHorisontal(paraPr);
				else if(horisonalAlign == null)
					oNewItem.wrap = true;
					
				//вертикальное выравнивание
				oNewItem.va = "center";
					
				//так же wrap выставляем у параграфа, чьим родителем является ячейка таблицы	
				if(this._getParentByTag(paragraph, c_oAscBoundsElementType.Cell) != null)
					oNewItem.wrap = false;
				
				//Numbering
				var LvlPr = null;
				var Lvl = null;
				var oNumPr = paragraph.elem.Numbering_Get();
				var numberingText = null;
				var formatText;
				if(oNumPr != null)
				{
					var aNum = paragraph.elem.Parent.Numbering.Get_AbstractNum( oNumPr.NumId );
					if(null != aNum)
					{
						LvlPr = aNum.Lvl[oNumPr.Lvl];
						Lvl = oNumPr.Lvl;
					};
					
					numberingText = this._parseNumbering(paragraph.elem);
					
					if(text == null)
						text = "";
					
					text += this._getAllNumberingText(Lvl, numberingText);
						
					formatText = this._getPrParaRun(paraPr, LvlPr.TextPr);
					fontFamily = formatText.format.fn;
					this.fontsNew[fontFamily] = 1;
					
					oNewItem.push(formatText);
					
					if(text !== null)
						oNewItem[oNewItem.length - 1].text = text;
						
					text = "";
				};

				
				//проходимся по контенту paragraph
				for(var n = 0; n < content.length; n++)
				{
					if(!aResult[row + this.maxLengthRowCount])
						aResult[row + this.maxLengthRowCount] = [];
					
					//s  - меняется в зависимости от табуляции
					if(!aResult[row + this.maxLengthRowCount][s + c1])
						aResult[row + this.maxLengthRowCount][s + c1] = [];
						
					if(text == null)
						text = "";
					
					
					switch(content[n].Type)
					{
						case para_Run://*paraRun*
						{
							s = this._parseParaRun(content[n], oNewItem, paraPr, s, row, c1, text);
							break;
						};
						case para_Hyperlink://*hyperLink*
						{	
							//если несколько ссылок в одном параграфе, то отменяем ссылки
							if(!oNewItem.doNotApplyHyperlink)
							{
								if(!oNewItem.hyperLink)
								{
									oNewItem.hyperLink = content[n].Value;
									oNewItem.toolTip = content[n].ToolTip;
								}
								else
								{
									oNewItem.hyperLink = null;
									oNewItem.toolTip = null;
									oNewItem.doNotApplyHyperlink = true;
								}
							}
							
							for(var h = 0; h < content[n].Content.length; h++)
							{
								switch(content[n].Content[h].Type)
								{
									case para_Run://*paraRun*
									{
										s = this._parseParaRun(content[n].Content[h], oNewItem, paraPr, s, row, c1, text);
										break;
									};
								};
							};
							break;
						};
					};
				};
				
			},
			
			_getAlignHorisontal: function(paraPr)
			{
				var result;
				var settings = paraPr.ParaPr;
				
				if(!settings)
					return;
				
				switch(settings.Jc)
				{
					case 0:
					{
						result = "right";
						break;
					}
					case 1:
					{
						result = "left";
						break;
					}
					case 2:
					{
						result = "center";
						break;
					}
					case 3:
					{
						result = null;
						break;
					}
				};
				
				return result;
			},
			
			getBackgroundColorTCell: function(elem)
			{
				var compiledPrCell, color;
				var backgroundColor = null;
				
				//TODO внутреннии таблицы без стиля - цвет фона белый
				var tableCell = this._getParentByTag(elem, c_oAscBoundsElementType.Cell);
				
				if(tableCell)
				{
					compiledPrCell = tableCell.elem.Get_CompiledPr();
					
					if(compiledPrCell && compiledPrCell.Shd.Value !== 1/*shd_Nil*/)
					{	
						var color = compiledPrCell.Shd.Color;
						backgroundColor = new RgbColor(this.clipboard._getBinaryColor("rgb(" + color.r + "," + color.g + "," + color.b + ")"));
					};
				};
				
				return backgroundColor;
			},
			
			_getParentByTag: function(elem, tag)
			{
				var result;
				if(!elem)
					return null;
				
				if(elem.type == tag)
					result =  elem;
				else if(elem.parent)
					result =  this._getParentByTag(elem.parent, tag);
				else if(!elem.parent)
					result =  null;
					
				return result;
			},
			
			_parseParaRun: function(paraRun, oNewItem, paraPr, s, row, c1, text)
			{
				var paraRunContent = paraRun.Content;
				var aResult = this.aResult;
				var paragraphFontFamily = paraPr.TextPr.FontFamily.Name;
				var cloneNewItem, formatText;
			
				var cTextPr = paraRun.Get_CompiledPr();
				if(cTextPr && !(paraRunContent.length == 1 && paraRunContent[0] instanceof ParaEnd))//settings for text	
					formatText = this._getPrParaRun(paraPr, cTextPr);
				else if(!formatText)
					formatText = this._getPrParaRun(paraPr, cTextPr);
				
				//проходимся по контенту paraRun
				for(var pR = 0; pR < paraRunContent.length; pR++)
				{

					switch(paraRunContent[pR].Type)
					{
						case para_Text://*paraText*
						{
							text += String.fromCharCode(paraRunContent[pR].Value);
							break;
						};
						
						case para_Space://*paraSpace*
						{
							text += " ";
							break;
						};
						
						case para_Tab://*paraEnd / paraTab*
						{
							//if(!oNewItem.length)
							//{
								this.fontsNew[paragraphFontFamily] = 1;
								
								oNewItem.push(formatText);
							//}
							
							if(text !== null)
								oNewItem[oNewItem.length - 1].text = text;
							
							cloneNewItem  = this._getCloneNewItem(oNewItem);
							
							//переходим в следующую ячейку
							if(typeof aResult[row + this.maxLengthRowCount][s + c1] == "object")
								aResult[row + this.maxLengthRowCount][s + c1][aResult[row + this.maxLengthRowCount][s + c1].length] = cloneNewItem;
							else
							{
								aResult[row + this.maxLengthRowCount][s + c1] = [];
								aResult[row + this.maxLengthRowCount][s + c1][0] = cloneNewItem;
							}
								
							text = "";
							oNewItem = [];
							s++;
							break;
						};
						
						case para_Drawing:
						{
							if(!aResult.addImagesFromWord)
								aResult.addImagesFromWord = [];
							aResult.addImagesFromWord[aResult.addImagesFromWord.length] = {image: paraRunContent[pR], col: s + c1, row: row};
							
							if(null === this.isUsuallyPutImages)
								this._addImageToMap(paraRunContent[pR]);
						};
						
						case para_End:
						{	
							if(typeof aResult[row][s + c1] == "object")
								aResult[row][s + c1][aResult[row][s + c1].length] = oNewItem;
							else
							{
								aResult[row][s + c1] = [];
								aResult[row][s + c1][0] = oNewItem;
							}
							
							var checkMaxTextLength = this.clipboard._checkMaxTextLength(this.aResult, row + this.maxLengthRowCount, s + c1);
							if(checkMaxTextLength)
							{	
								aResult = checkMaxTextLength.aResult;
								this.maxLengthRowCount += checkMaxTextLength.r - row;
							}
						};
					}
				};
				
				if(text != "")
				{	
					this.fontsNew[paragraphFontFamily] = 1;
					
					oNewItem.push(formatText);
					
					
					if(text !== null)
						oNewItem[oNewItem.length - 1].text = text;
						
					cloneNewItem  = this._getCloneNewItem(oNewItem);
					
					text = "";
				};
				
				return s;
			},
			
			_addImageToMap: function(paraDrawing)
			{
				var aResult = this.aResult;
				if(!aResult._aPastedImages)
					aResult._aPastedImages = [];
				if(!aResult._images)
					aResult._images = [];
				
				var oGraphicObj = paraDrawing.GraphicObj;
				if(!oGraphicObj || (oGraphicObj && !oGraphicObj.blipFill) || (oGraphicObj && oGraphicObj.blipFill && !oGraphicObj.blipFill.RasterImageId))
					return;
				
				var sImageUrl = oGraphicObj.blipFill.RasterImageId;
				aResult._aPastedImages[aResult._aPastedImages.length] = new CBuilderImages(oGraphicObj.blipFill, sImageUrl, oGraphicObj, oGraphicObj.spPr, null);
				aResult._images[aResult._images.length] = sImageUrl;
			},
			
			_getAllNumberingText: function(Lvl, numberingText)
			{
				var preSpace, beetweenSpace, result;
				if(Lvl == 0)
					preSpace = "     ";
				else if(Lvl == 1)
					preSpace = "          ";
				else if(Lvl >= 2)
					preSpace = "               ";
				
				var beetweenSpace =  "  ";	
				
				result = preSpace + numberingText + beetweenSpace;
				
				return result;
			},
			
			_parseNumbering: function(paragraph)
			{
				var Pr = paragraph.Get_CompiledPr();
				
				if ( paragraph.Numbering )
				{
					var NumberingItem = paragraph.Numbering;
					if ( para_Numbering === NumberingItem.Type )
					{
						var NumPr = Pr.ParaPr.NumPr;
						if ( undefined === NumPr || undefined === NumPr.NumId || 0 === NumPr.NumId || "0" === NumPr.NumId )
						{
							// Ничего не делаем
						}
						else
						{
							var Numbering = paragraph.Parent.Get_Numbering();
							var NumLvl    = Numbering.Get_AbstractNum( NumPr.NumId ).Lvl[NumPr.Lvl];
							var NumSuff   = NumLvl.Suff;
							var NumJc     = NumLvl.Jc;
							var NumTextPr = paragraph.Get_CompiledPr2(false).TextPr.Copy();

							// Word не рисует подчеркивание у символа списка, если оно пришло из настроек для
							// символа параграфа.

							var TextPr_temp = paragraph.TextPr.Value.Copy();
							TextPr_temp.Underline = undefined;

							NumTextPr.Merge( TextPr_temp );
							NumTextPr.Merge( NumLvl.TextPr );

							/*var X_start = X;

							if ( align_Right === NumJc )
								X_start = X - NumberingItem.WidthNum;
							else if ( align_Center === NumJc )
								X_start = X - NumberingItem.WidthNum / 2;

							NumTextPr.Unifill.check(PDSE.Theme, PDSE.ColorMap);
							var RGBA = NumTextPr.Unifill.getRGBAColor();
							if ( true === NumTextPr.Color.Auto )
								pGraphics.b_color1( AutoColor.r, AutoColor.g, AutoColor.b, 255);
							else
								pGraphics.b_color1(RGBA.R, RGBA.G, RGBA.B, 255 );*/

							// Рисуется только сам символ нумерации
							
							var oNumPr = paragraph.Numbering_Get();
							var LvlPr, Lvl;
							if(oNumPr != null)
							{
								var aNum = paragraph.Parent.Numbering.Get_AbstractNum( oNumPr.NumId );
								if(null != aNum)
								{
									LvlPr = aNum.Lvl[oNumPr.Lvl];
									Lvl = oNumPr.Lvl;
								};
							};
							

							var NumInfo = paragraph.Parent.Internal_GetNumInfo(paragraph.Id, NumPr);
							
							return this._getNumberingText( NumPr.Lvl, NumInfo, NumTextPr, null, LvlPr );
						}
					}
				}
			},
			
			
			 _getNumberingText : function(Lvl, NumInfo, NumTextPr, Theme, LvlPr)
			{
				var Text = LvlPr.LvlText;
				
				var Char = "";
				//Context.SetTextPr( NumTextPr, Theme );
				//Context.SetFontSlot( fontslot_ASCII );
				//g_oTextMeasurer.SetTextPr( NumTextPr, Theme );
				//g_oTextMeasurer.SetFontSlot( fontslot_ASCII );

				for ( var Index = 0; Index < Text.length; Index++ )
				{
					switch( Text[Index].Type )
					{
						case numbering_lvltext_Text:
						{
							var Hint = NumTextPr.RFonts.Hint;
							var bCS  = NumTextPr.CS;
							var bRTL = NumTextPr.RTL;
							var lcid = NumTextPr.Lang.EastAsia;

							var FontSlot = g_font_detector.Get_FontClass( Text[Index].Value.charCodeAt(0), Hint, lcid, bCS, bRTL );
							
							Char += Text[Index].Value;
							//Context.SetFontSlot( FontSlot );
							//g_oTextMeasurer.SetFontSlot( FontSlot );

							//Context.FillText( X, Y, Text[Index].Value );
							//X += g_oTextMeasurer.Measure( Text[Index].Value ).Width;

							break;
						}
						case numbering_lvltext_Num:
						{
							//Context.SetFontSlot( fontslot_ASCII );
							//g_oTextMeasurer.SetFontSlot( fontslot_ASCII );

							var CurLvl = Text[Index].Value;
							switch( LvlPr.Format )
							{
								case numbering_numfmt_Bullet:
								{
									break;
								}

								case numbering_numfmt_Decimal:
								{
									if ( CurLvl < NumInfo.length )
									{
										var T = "" + ( LvlPr.Start - 1 + NumInfo[CurLvl] );
										for ( var Index2 = 0; Index2 < T.length; Index2++ )
										{
											Char += T.charAt(Index2);
											//Context.FillText( X, Y, Char );
											//X += g_oTextMeasurer.Measure( Char ).Width;
										}
									}
									break;
								}

								case numbering_numfmt_DecimalZero:
								{
									if ( CurLvl < NumInfo.length )
									{
										var T = "" + ( LvlPr.Start - 1 + NumInfo[CurLvl] );

										if ( 1 === T.length )
										{
											//Context.FillText( X, Y, '0' );
											//X += g_oTextMeasurer.Measure( '0' ).Width;

											var Char = T.charAt(0);
											//Context.FillText( X, Y, Char );
											//X += g_oTextMeasurer.Measure( Char ).Width;
										}
										else
										{
											for ( var Index2 = 0; Index2 < T.length; Index2++ )
											{
												Char += T.charAt(Index2);
												//Context.FillText( X, Y, Char );
												//X += g_oTextMeasurer.Measure( Char ).Width;
											}
										}
									}
									break;
								}

								case numbering_numfmt_LowerLetter:
								case numbering_numfmt_UpperLetter:
								{
									if ( CurLvl < NumInfo.length )
									{
										// Формат: a,..,z,aa,..,zz,aaa,...,zzz,...
										var Num = LvlPr.Start - 1 + NumInfo[CurLvl] - 1;

										var Count = (Num - Num % 26) / 26;
										var Ost   = Num % 26;

										var T = "";

										var Letter;
										if ( numbering_numfmt_LowerLetter === LvlPr.Format )
											Letter = String.fromCharCode( Ost + 97 );
										else
											Letter = String.fromCharCode( Ost + 65 );

										for ( var Index2 = 0; Index2 < Count + 1; Index2++ )
											T += Letter;

										for ( var Index2 = 0; Index2 < T.length; Index2++ )
										{
											Char += T.charAt(Index2);
											//Context.FillText( X, Y, Char );
											//X += g_oTextMeasurer.Measure( Char ).Width;
										}
									}
									break;
								}

								case numbering_numfmt_LowerRoman:
								case numbering_numfmt_UpperRoman:
								{
									if ( CurLvl < NumInfo.length )
									{
										var Num = LvlPr.Start - 1 + NumInfo[CurLvl];

										// Переводим число Num в римскую систему исчисления
										var Rims;

										if ( numbering_numfmt_LowerRoman === LvlPr.Format )
											Rims = [  'm', 'cm', 'd', 'cd', 'c', 'xc', 'l', 'xl', 'x', 'ix', 'v', 'iv', 'i', ' '];
										else
											Rims = [  'M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I', ' '];

										var Vals = [ 1000,  900, 500,  400, 100,   90,  50,   40,  10,    9,   5,    4,   1,   0];

										var T = "";
										var Index2 = 0;
										while ( Num > 0 )
										{
											while ( Vals[Index2] <= Num )
											{
												T   += Rims[Index2];
												Num -= Vals[Index2];
											}

											Index2++;

											if ( Index2 >= Rims.length )
												break;
										}

										for ( var Index2 = 0; Index2 < T.length; Index2++ )
										{
											Char += T.charAt(Index2);
											//Context.FillText( X, Y, Char );
											//X += g_oTextMeasurer.Measure( T.charAt(Index2) ).Width;
										}
									}
									break;
								}
							}

							break;
						}
					}
				}
				return Char;
			},
			
			
			_getPrParaRun: function(paraPr, cTextPr)
			{
				var formatText, fontFamily, colorText;
				
				var paragraphFontSize = paraPr.TextPr.FontSize;
				var paragraphFontFamily = paraPr.TextPr && paraPr.TextPr.FontFamily ? paraPr.TextPr.FontFamily.Name : "Arial";
				var paragraphBold = paraPr.TextPr.Bold;
				var paragraphItalic = paraPr.TextPr.Italic;
				var paragraphStrikeout = paraPr.TextPr.Strikeout;
				var paragraphUnderline = paraPr.TextPr.Underline ? Asc.EUnderline.underlineSingle : Asc.EUnderline.underlineNone;
				var paragraphVertAlign = "none";
				if(paraPr.TextPr.VertAlign == 1)
					paragraphVertAlign = "superscript";
				else if(paraPr.TextPr.VertAlign == 2)
					paragraphVertAlign = "subscript";

				var colorParagraph = new RgbColor(this.clipboard._getBinaryColor("rgb(" + paraPr.TextPr.Color.r + "," + paraPr.TextPr.Color.g + "," + paraPr.TextPr.Color.b + ")"));
				
				if(cTextPr.Color)
					colorText = new RgbColor(this.clipboard._getBinaryColor("rgb(" + cTextPr.Color.r + "," + cTextPr.Color.g + "," + cTextPr.Color.b + ")"));
				else
					colorText = null;
				
				fontFamily = cTextPr.fontFamily ? cTextPr.fontFamily.Name : cTextPr.RFonts.CS ? cTextPr.RFonts.CS.Name : paragraphFontFamily;
				this.fontsNew[fontFamily] = 1;
				
				var verticalAlign;
				if(cTextPr.VertAlign == 2)
					verticalAlign = "subscript";
				else if(cTextPr.VertAlign == 1)
					verticalAlign = "superscript";
					
				formatText = {
					format: {
						fn: fontFamily,
						fs: cTextPr.FontSize ? cTextPr.FontSize : paragraphFontSize,
						c: colorText ? colorText : colorParagraph,
						b: cTextPr.Bold ? cTextPr.Bold : paragraphBold,
						i: cTextPr.Italic ? cTextPr.Italic : paragraphItalic,
						u: cTextPr.Underline ? Asc.EUnderline.underlineSingle : paragraphUnderline,
						s: cTextPr.Strikeout ? cTextPr.Strikeout : cTextPr.DStrikeout ? cTextPr.DStrikeout : paragraphStrikeout,
						va: verticalAlign ? verticalAlign : paragraphVertAlign
					}
				};
				
				return formatText;
			},
			
			_getCloneNewItem: function(oNewItem)
			{
				var result = [];
				
				for(var item = 0; item < oNewItem.length; item++)
				{
					result[item] = {text: oNewItem[item].text, format: oNewItem[item].format};
				};
				
				result.borders = oNewItem.borders;
				result.rowSpan = oNewItem.rowSpan;
				result.colSpan = oNewItem.colSpan;
				result.toolTip = result.toolTip;
				result.bc = oNewItem.bc;
				result.hyperLink = oNewItem.hyperLink;
				
				return result;
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
					{
						elem.ReIndexing(0);
						oNewElem = this._getTableMeasure(elem, oRes);
					}
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
		
		
		
		
		//пользуется класс из word, для копирования внутреннего контента автофигуры
		//TODO просмотреть, все ли функции необходимы
		function CopyProcessor(api, ElemToSelect)
		{
			//this.api = api;
			//this.oDocument = api.WordControl.m_oLogicDocument;
			//this.oBinaryFileWriter = new BinaryFileWriter(this.oDocument);
			//this.fontsArray = api.FontLoader.fontInfos;
			//this.ElemToSelect = ElemToSelect;
			this.Ul = document.createElement( "ul" );
			this.Ol = document.createElement( "ol" );
			this.Para = null;
			this.bOccurEndPar = null;
			this.oCurHyperlink = null;
			this.oCurHyperlinkElem = null;
			this.oPresentationWriter = new CBinaryFileWriter();
		}
		CopyProcessor.prototype =
		{
			RGBToCSS : function(rgb)
			{
				var sResult = "#";
				var sR = rgb.r.toString(16);
				if(sR.length == 1)
					sR = "0" + sR;
				var sG = rgb.g.toString(16);
				if(sG.length == 1)
					sG = "0" + sG;
				var sB = rgb.b.toString(16);
				if(sB.length == 1)
					sB = "0" + sB;
				return "#" + sR + sG + sB;
			},
			CommitList : function(oDomTarget)
			{
				if(this.Ul.childNodes.length > 0)
				{
					this.Ul.style.paddingLeft = "40px";
					oDomTarget.appendChild( this.Ul );
					this.Ul = document.createElement( "ul" );
				}
				if(this.Ol.childNodes.length > 0)
				{
					this.Ol.style.paddingLeft = "40px";
					oDomTarget.appendChild( this.Ol );
					this.Ol = document.createElement( "ol" );
				}
			},
			Commit_pPr : function(Item)
			{
				//pPr
				var apPr = [];
				var Def_pPr = this.oDocument.Styles.Default.ParaPr;
				var Item_pPr = Item.CompiledPr.Pr.ParaPr;
				if(Item_pPr)
				{
					//Ind
					if(Def_pPr.Ind.Left != Item_pPr.Ind.Left)
						apPr.push("margin-left:" + (Item_pPr.Ind.Left * g_dKoef_mm_to_pt) + "pt");
					if(Def_pPr.Ind.Right != Item_pPr.Ind.Right)
						apPr.push("margin-right:" + ( Item_pPr.Ind.Right * g_dKoef_mm_to_pt) + "pt");
					if(Def_pPr.Ind.FirstLine != Item_pPr.Ind.FirstLine)
						apPr.push("text-indent:" + (Item_pPr.Ind.FirstLine * g_dKoef_mm_to_pt) + "pt");
					//Jc
					if(Def_pPr.Jc != Item_pPr.Jc){
						switch(Item_pPr.Jc)
						{
							case AscCommon.align_Left: apPr.push("text-align:left");break;
							case AscCommon.align_Center: apPr.push("text-align:center");break;
							case AscCommon.align_Right: apPr.push("text-align:right");break;
							case AscCommon.align_Justify: apPr.push("text-align:justify");break;
						}
					}
					//KeepLines , WidowControl
					if(Def_pPr.KeepLines != Item_pPr.KeepLines || Def_pPr.WidowControl != Item_pPr.WidowControl)
					{
						if(Def_pPr.KeepLines != Item_pPr.KeepLines && Def_pPr.WidowControl != Item_pPr.WidowControl)
							apPr.push("mso-pagination:none lines-together");
						else if(Def_pPr.KeepLines != Item_pPr.KeepLines)
							apPr.push("mso-pagination:widow-orphan lines-together");
						else if(Def_pPr.WidowControl != Item_pPr.WidowControl)
							apPr.push("mso-pagination:none");
					}
					//KeepNext
					if(Def_pPr.KeepNext != Item_pPr.KeepNext)
						apPr.push("page-break-after:avoid");
					//PageBreakBefore
					if(Def_pPr.PageBreakBefore != Item_pPr.PageBreakBefore)
						apPr.push("page-break-before:always");
					//Spacing
					if(Def_pPr.Spacing.Line != Item_pPr.Spacing.Line)
					{
						if(Asc.linerule_AtLeast == Item_pPr.Spacing.LineRule)
							apPr.push("line-height:"+(Item_pPr.Spacing.Line * g_dKoef_mm_to_pt)+"pt");
						else if( Asc.linerule_Auto == Item_pPr.Spacing.LineRule)
						{
							if(1 == Item_pPr.Spacing.Line)
								apPr.push("line-height:normal");
							else
								apPr.push("line-height:"+parseInt(Item_pPr.Spacing.Line * 100)+"%");
						}
					}
					if(Def_pPr.Spacing.LineRule != Item_pPr.Spacing.LineRule)
					{
						if(Asc.linerule_Exact == Item_pPr.Spacing.LineRule)
							apPr.push("mso-line-height-rule:exactly");
					}
					//��� ������� � word ����� ����� ��� �������� ������������ ������
					//if(Def_pPr.Spacing.Before != Item_pPr.Spacing.Before)
					apPr.push("margin-top:" + (Item_pPr.Spacing.Before * g_dKoef_mm_to_pt) + "pt");
					//if(Def_pPr.Spacing.After != Item_pPr.Spacing.After)
					apPr.push("margin-bottom:" + (Item_pPr.Spacing.After * g_dKoef_mm_to_pt) + "pt");
					//Shd
					if(Def_pPr.Shd.Value != Item_pPr.Shd.Value)
						apPr.push("background-color:" + this.RGBToCSS(Item_pPr.Shd.Color));
					//Tabs
					if(Item_pPr.Tabs.Get_Count() > 0)
					{
						var sRes = "";
						//tab-stops:1.0cm 3.0cm 5.0cm
						for(var i = 0, length = Item_pPr.Tabs.Get_Count(); i < length; i++)
						{
							if(0 != i)
								sRes += " ";
							sRes += Item_pPr.Tabs.Get(i).Pos / 10 + "cm";
						}
						apPr.push("tab-stops:" + sRes);
					}
					//Border
					if(null != Item_pPr.Brd)
					{
						apPr.push("border:none");
						var borderStyle = this._BordersToStyle(Item_pPr.Brd, false, true, "mso-", "-alt");
						if(null != borderStyle)
						{
							var nborderStyleLength = borderStyle.length;
							if(nborderStyleLength> 0)
								borderStyle = borderStyle.substring(0, nborderStyleLength - 1);
							apPr.push(borderStyle);
						}
					}
				}
				if(apPr.length > 0)
					this.Para.setAttribute("style", apPr.join(';'));
			},
			parse_para_TextPr : function(Value)
			{
				var aProp = [];
				var aTagStart = [];
				var aTagEnd = [];
				var sRes = "";
				if (null != Value.RFonts) {
					var sFontName = null;
					if (null != Value.RFonts.Ascii)
						sFontName = Value.RFonts.Ascii.Name;
					else if (null != Value.RFonts.HAnsi)
						sFontName = Value.RFonts.HAnsi.Name;
					else if (null != Value.RFonts.EastAsia)
						sFontName = Value.RFonts.EastAsia.Name;
					else if (null != Value.RFonts.CS)
						sFontName = Value.RFonts.CS.Name;
					if (null != sFontName)
						aProp.push("font-family:" + "'" + CopyPasteCorrectString(sFontName) + "'");
				}
				if (null != Value.FontSize) {
					//if (!this.api.DocumentReaderMode)
						aProp.push("font-size:" + Value.FontSize + "pt");//font-size � pt ��� ��������� ������� � mm
					/*else
						aProp.push("font-size:" + this.api.DocumentReaderMode.CorrectFontSize(Value.FontSize));*/
				}
				if (true == Value.Bold) {
					aTagStart.push("<b>");
					aTagEnd.push("</b>");
				}
				if (true == Value.Italic) {
					aTagStart.push("<i>");
					aTagEnd.push("</i>");
				}
				if (true == Value.Strikeout) {
					aTagStart.push("<strike>");
					aTagEnd.push("</strike>");
				}
				if (true == Value.Underline) {
					aTagStart.push("<u>");
					aTagEnd.push("</u>");
				}
				if (null != Value.HighLight && highlight_None != Value.HighLight)
					aProp.push("background-color:" + this.RGBToCSS(Value.HighLight));
				
				var color;
				if (null != Value.Unifill)
				{
					var Unifill = Value.Unifill.getRGBAColor();
					if(Unifill)
					{
						color = this.RGBToCSS(new CDocumentColor(Unifill.R, Unifill.G, Unifill.B));
						aProp.push("color:" + color);
						aProp.push("mso-style-textfill-fill-color:" + color);
					}
				}
				else if (null != Value.Color) 
				{
					color = this.RGBToCSS(Value.Color);
					aProp.push("color:" + color);
					aProp.push("mso-style-textfill-fill-color:" + color);
				}
				if (null != Value.VertAlign) {
					if(AscCommon.vertalign_SuperScript == Value.VertAlign)
						aProp.push("vertical-align:super");
					else if(AscCommon.vertalign_SubScript == Value.VertAlign)
						aProp.push("vertical-align:sub");
				}

				return { style: aProp.join(';'), tagstart: aTagStart.join(''), tagend: aTagEnd.join('') };
			},
			ParseItem : function(ParaItem)
			{
				var sRes = "";
				switch ( ParaItem.Type )
				{
					case para_Text:
						//���������� �����������
						var sValue = String.fromCharCode(ParaItem.Value);
						if(sValue)
							sRes += CopyPasteCorrectString(sValue);
						break;
					case para_Space:    sRes += " "; break;
					case para_Tab:        sRes += "<span style='mso-tab-count:1'>    </span>"; break;
					case para_NewLine:
						if( break_Page == ParaItem.BreakType)
						{
							//todo ��������� ���� �������� � ������ �����
							sRes += "<br clear=\"all\" style=\"mso-special-character:line-break;page-break-before:always;\" />";
						}
						else
							sRes += "<br style=\"mso-special-character:line-break;\" />";
						break;
					//������� ������� ����� ��������� ������ �� ���������� ��������
					case para_End:        this.bOccurEndPar = true; break;
					case para_Drawing:
						var oGraphicObj = ParaItem.GraphicObj;
						var sSrc = oGraphicObj.getBase64Img();
						if(sSrc.length > 0)
						{
							sRes += "<img style=\"max-width:100%;\" width=\""+Math.round(ParaItem.Extent.W * g_dKoef_mm_to_pix)+"\" height=\""+Math.round(ParaItem.Extent.H * g_dKoef_mm_to_pix)+"\" src=\""+sSrc+"\" />";
							break;
						}
						// var _canvas     = document.createElement('canvas');
						// var w = img.width;
						// var h = img.height;

						// _canvas.width   = w;
						// _canvas.height  = h;

						// var _ctx        = _canvas.getContext('2d');
						// _ctx.globalCompositeOperation = "copy";
						// _ctx.drawImage(img, 0, 0);

						// var _data = _ctx.getImageData(0, 0, w, h);
						// _ctx = null;
						// delete _canvas;
						break;
				}
				return sRes;
			},
			CopyRun: function (Item, bUseSelection) {
				var sRes = "";
				var ParaStart = 0;
				var ParaEnd = Item.Content.length;
				if (true == bUseSelection) {
					ParaStart = Item.Selection.StartPos;
					ParaEnd = Item.Selection.EndPos;
					if (ParaStart > ParaEnd) {
						var Temp2 = ParaEnd;
						ParaEnd = ParaStart;
						ParaStart = Temp2;
					}
				}
				for (var i = ParaStart; i < ParaEnd; i++)
					sRes += this.ParseItem(Item.Content[i]);
				return sRes;
			},
			CopyRunContent: function (Container, bUseSelection) {
				var sRes = "";
				var ParaStart = 0;
				var ParaEnd = Container.Content.length - 1;
				if (true == bUseSelection) {
					ParaStart = Container.Selection.StartPos;
					ParaEnd = Container.Selection.EndPos;
					if (ParaStart > ParaEnd) {
						var Temp2 = ParaEnd;
						ParaEnd = ParaStart;
						ParaStart = Temp2;
					}
				}

				for (var i = ParaStart; i <= ParaEnd; i++) {
					var item = Container.Content[i];
					if (para_Run == item.Type) {
						var sRunContent = this.CopyRun(item, bUseSelection);
						if(sRunContent)
						{
							sRes += "<span";
							var oStyle = this.parse_para_TextPr(item.CompiledPr);
							if (oStyle && oStyle.style)
								sRes += " style=\"" + oStyle.style + "\"";
							sRes += ">";
							if (oStyle.tagstart)
								sRes += oStyle.tagstart;
							sRes += sRunContent;
							if (oStyle.tagend)
								sRes += oStyle.tagend;
							sRes += "</span>";
						}
					}
					else if (para_Hyperlink == item.Type) {
						sRes += "<a";
						var sValue = item.Get_Value();
						var sToolTip = item.Get_ToolTip();
						if (null != sValue && "" != sValue)
							sRes += " href=\"" + CopyPasteCorrectString(sValue) + "\"";
						if (null != sToolTip && "" != sToolTip)
							sRes += " title=\"" + CopyPasteCorrectString(sToolTip) + "\"";
						sRes += ">";
						sRes += this.CopyRunContent(item);
						sRes += "</a>";
					}
				}
				return sRes;
			},
			CopyParagraph : function(oDomTarget, Item, bLast, bUseSelection, aDocumentContent, nDocumentContentIndex)
			{
				var oDocument = this.oDocument;
				this.Para = null;
				//��� heading ����� � h1
				var styleId = Item.Style_Get();
				if(styleId)
				{
					var styleName = oDocument.Styles.Get_Name( styleId ).toLowerCase();
					//������ "heading n" (n=1:6)
					if(0 == styleName.indexOf("heading"))
					{
						var nLevel = parseInt(styleName.substring("heading".length));
						if(1 <= nLevel && nLevel <= 6)
							this.Para = document.createElement( "h" + nLevel );
					}
				}
				if(null == this.Para)
					this.Para = document.createElement( "p" );

				this.bOccurEndPar = false;
				var oNumPr;
				var bIsNullNumPr = false;
			
				oNumPr = Item.Numbering_Get();
				bIsNullNumPr = (null == oNumPr || 0 == oNumPr.NumId);
				
				
				if(bIsNullNumPr)
					this.CommitList(oDomTarget);
				else
				{
					var bBullet = false;
					var sListStyle = "";

					var aNum = this.oDocument.Numbering.Get_AbstractNum( oNumPr.NumId );
					if(null != aNum)
					{
						var LvlPr = aNum.Lvl[oNumPr.Lvl];
						if(null != LvlPr)
						{
							switch(LvlPr.Format)
							{
								case numbering_numfmt_Decimal: sListStyle = "decimal";break;
								case numbering_numfmt_LowerRoman: sListStyle = "lower-roman";break;
								case numbering_numfmt_UpperRoman: sListStyle = "upper-roman";break;
								case numbering_numfmt_LowerLetter: sListStyle = "lower-alpha";break;
								case numbering_numfmt_UpperLetter: sListStyle = "upper-alpha";break;
								default:
									sListStyle = "disc";
									bBullet = true;
									break;
							}
						}
					}
					

					var Li = document.createElement( "li" );
					Li.setAttribute("style", "list-style-type: " + sListStyle);
					Li.appendChild( this.Para );
					if(bBullet)
						this.Ul.appendChild( Li );
					else
						this.Ol.appendChild( Li );
				}
				//pPr
				//this.Commit_pPr(Item);

				this.Para.innerHTML = this.CopyRunContent(Item, bUseSelection);

				if(bLast && false == this.bOccurEndPar)
				{
					if(false == bIsNullNumPr)
					{
						//������ �������� � ������. ������� ������� �� ������. ���������� ����� ��� span
						var li = this.Para.parentNode;
						var ul = li.parentNode;
						ul.removeChild(li);
						this.CommitList(oDomTarget);
					}
					for(var i = 0; i < this.Para.childNodes.length; i++)
						oDomTarget.appendChild( this.Para.childNodes[i].cloneNode(true) );
				}
				else
				{
					//����� ��������� ������ ���������
					if(this.Para.childNodes.length == 0)
						this.Para.appendChild( document.createTextNode( '\xa0' ) );
					if(bIsNullNumPr)
						oDomTarget.appendChild( this.Para );
				}
			},
			_BorderToStyle : function(border, name)
			{
				var res = "";
				if(border_None == border.Value)
					res += name + ":none;";
				else
				{
					var size = 0.5;
					var color = { r : 0, g : 0, b : 0 };
					if(null != border.Size)
						size = border.Size * g_dKoef_mm_to_pt;
					if(null != border.Color)
						color = border.Color;
					res += name + ":"+size+"pt solid "+this.RGBToCSS(color)+";";
				}
				return res;
			},
			_MarginToStyle : function(margins, styleName)
			{
				var res = "";
				var nMarginLeft = 1.9;
				var nMarginTop = 0;
				var nMarginRight = 1.9;
				var nMarginBottom = 0;
				if(null != margins.Left && tblwidth_Mm == margins.Left.Type && null != margins.Left.W)
					nMarginLeft = margins.Left.W;
				if(null != margins.Top && tblwidth_Mm == margins.Top.Type && null != margins.Top.W)
					nMarginTop = margins.Top.W;
				if(null != margins.Right && tblwidth_Mm == margins.Right.Type && null != margins.Right.W)
					nMarginRight = margins.Right.W;
				if(null != margins.Bottom && tblwidth_Mm == margins.Bottom.Type && null != margins.Bottom.W)
					nMarginBottom = margins.Bottom.W;
				res = styleName + ":"+(nMarginTop * g_dKoef_mm_to_pt)+"pt "+(nMarginRight * g_dKoef_mm_to_pt)+"pt "+(nMarginBottom * g_dKoef_mm_to_pt)+"pt "+(nMarginLeft * g_dKoef_mm_to_pt)+"pt;";
				return res;
			},
			_BordersToStyle : function(borders, bUseInner, bUseBetween, mso, alt)
			{
				var res = "";
				if(null == mso)
					mso = "";
				if(null == alt)
					alt = "";
				if(null != borders.Left)
					res += this._BorderToStyle(borders.Left, mso + "border-left" + alt);
				if(null != borders.Top)
					res += this._BorderToStyle(borders.Top, mso + "border-top" + alt);
				if(null != borders.Right)
					res += this._BorderToStyle(borders.Right, mso + "border-right" + alt);
				if(null != borders.Bottom)
					res += this._BorderToStyle(borders.Bottom, mso + "border-bottom" + alt);
				if(bUseInner)
				{
					if(null != borders.InsideV)
						res += this._BorderToStyle(borders.InsideV, "mso-border-insidev");
					if(null != borders.InsideH)
						res += this._BorderToStyle(borders.InsideH, "mso-border-insideh");
				}
				if(bUseBetween)
				{
					if(null != borders.Between)
						res += this._BorderToStyle(borders.Between, "mso-border-between");
				}
				return res;
			},
			_MergeProp : function(elem1, elem2)
			{
				if( !elem1 || !elem2 )
				{
					return;
				}

				var p, v;
				for(p in elem2)
				{
					if(elem2.hasOwnProperty(p) && false == elem1.hasOwnProperty(p))
					{
						v = elem2[p];
						if(null != v)
							elem1[p] = v;
					}
				}
			},
			CopyDocument : function(oDomTarget, oDocument, bUseSelection)
			{
				var Start = 0;
				var End = 0;
				if(bUseSelection)
				{
					if ( true === oDocument.Selection.Use)
					{
						if ( selectionflag_DrawingObject === oDocument.Selection.Flag )
						{
							this.Para = document.createElement("p");
							this.Para.innerHTML = this.ParseItem(oDocument.Selection.Data.DrawingObject);

							for(var i = 0; i < this.Para.childNodes.length; i++)
								this.ElemToSelect.appendChild( this.Para.childNodes[i].cloneNode(true) );
						}
						else
						{
							Start = oDocument.Selection.StartPos;
							End = oDocument.Selection.EndPos;
							if ( Start > End )
							{
								var Temp = End;
								End = Start;
								Start = Temp;
							}
						}
					}
				}
				else
				{
					Start = 0;
					End = oDocument.Content.length - 1;
				}
				// HtmlText
				for ( var Index = Start; Index <= End; Index++ )
				{
					var Item = oDocument.Content[Index];

					if ( type_Paragraph === Item.GetType() )
					{
						//todo ����� ������ ��� �������� ������ ���� Index == End
						//this.oBinaryFileWriter.CopyParagraph(Item);
						this.CopyParagraph(oDomTarget, Item, Index == End, bUseSelection, oDocument.Content, Index);
					}
				}
				this.CommitList(oDomTarget);
			},
			Start : function(node)
			{
				this.oBinaryFileWriter.CopyStart();
				var oDocument = this.oDocument;
				if(g_bIsDocumentCopyPaste)
				{
					if(!this.api.DocumentReaderMode)
					{
						var Def_pPr = oDocument.Styles.Default.ParaPr;
						if(docpostype_HdrFtr === oDocument.CurPos.Type)
						{
							if(null != oDocument.HdrFtr && null != oDocument.HdrFtr.CurHdrFtr && null != oDocument.HdrFtr.CurHdrFtr.Content)
								oDocument = oDocument.HdrFtr.CurHdrFtr.Content;
						}

						if(oDocument.CurPos.Type === docpostype_DrawingObjects)
						{
							var content = oDocument.DrawingObjects.getTargetDocContent();
							if(content)
							{
								oDocument = content;
							}
							else if(oDocument.DrawingObjects.selection.groupSelection && oDocument.DrawingObjects.selection.groupSelection.selectedObjects && oDocument.DrawingObjects.selection.groupSelection.selectedObjects.length)
							{

									var s_arr = oDocument.DrawingObjects.selection.groupSelection.selectedObjects;

									this.Para = document.createElement( "p" );

									if(copyPasteUseBinary)
									{
										var newArr = null;
										var tempAr = null;
										if(s_arr)
										{
											tempAr = [];
											for(var k = 0; k < s_arr.length; k++)
											{
												tempAr[k] = s_arr[k].y;
											}
										}
										tempAr.sort(fSortAscending);
										newArr = [];
										for(var k = 0; k < tempAr.length; k++)
										{
											var absOffsetY = tempAr[k];
											for(var i = 0; i < s_arr.length; i++)
											{
												if(absOffsetY == s_arr[i].y)
												{
													newArr[k] = s_arr[i];
												}
											}
										}
										if(newArr != null)
											s_arr = newArr;
									}

									for(var i = 0; i < s_arr.length; ++i)
									{
										var paraDrawing = s_arr[i].parent ? s_arr[i].parent : s_arr[i].group.parent;
										var graphicObj = s_arr[i];
										
										if(isRealObject(paraDrawing.Parent))
										{
											var base64_img = paraDrawing.getBase64Img();

											if(copyPasteUseBinary)
											{
												var wrappingType = oDocument.DrawingObjects.selection.groupSelection.parent.wrappingType;
												var DrawingType = oDocument.DrawingObjects.selection.groupSelection.parent.DrawingType;
												var tempParagraph = new Paragraph(oDocument, oDocument, 0, 0, 0, 0, 0);
												var index = 0;
												
												tempParagraph.Content.unshift(new ParaRun());
												
												var paraRun = tempParagraph.Content[index];
												paraRun.Content.unshift(new ParaDrawing());
												paraRun.Content[index].wrappingType = wrappingType;
												paraRun.Content[index].DrawingType = DrawingType;
												paraRun.Content[index].GraphicObj = graphicObj;
												
												paraRun.Selection.EndPos = index + 1;
												paraRun.Selection.StartPos = index;
												paraRun.Selection.Use = true;
												
												tempParagraph.Selection.EndPos = index + 1;
												tempParagraph.Selection.StartPos = index;
												tempParagraph.Selection.Use = true;
												tempParagraph.bFromDocument = true;

												this.oBinaryFileWriter.CopyParagraph(tempParagraph);
											};

											var src = base64_img;
											this.Para.innerHTML += "<img style=\"max-width:100%;\" width=\""+Math.round(paraDrawing.Extent.W * g_dKoef_mm_to_pix)+"\" height=\""+Math.round(paraDrawing.Extent.H * g_dKoef_mm_to_pix)+"\" src=\""+src+"\" />";

											this.ElemToSelect.appendChild( this.Para );
										}

									}

									if(copyPasteUseBinary)
									{
										this.oBinaryFileWriter.CopyEnd();
										var sBase64 = this.oBinaryFileWriter.GetResult();
										if(this.ElemToSelect.children && this.ElemToSelect.children.length == 1 && window.USER_AGENT_SAFARI_MACOS)
										{
											$(this.ElemToSelect.children[0]).css("font-weight", "normal");
											$(this.ElemToSelect.children[0]).wrap(document.createElement("b"));
										}
										if(this.ElemToSelect.children[0])
											$(this.ElemToSelect.children[0]).addClass("docData;" + sBase64);
									}
							}
							else
							{
								var gr_objects = oDocument.DrawingObjects;
								var selection_array = gr_objects.selectedObjects;

								this.Para = document.createElement( "span" );
								var selectionTrue;
								var selectIndex;
								for(var i = 0; i < selection_array.length; ++i)
								{
									var cur_element = selection_array[i].parent;
									var base64_img = cur_element.getBase64Img();
									var src = base64_img;

									this.Para.innerHTML = "<img style=\"max-width:100%;\" width=\""+Math.round(cur_element.Extent.W * g_dKoef_mm_to_pix)+"\" height=\""+Math.round(cur_element.Extent.H * g_dKoef_mm_to_pix)+"\" src=\""+src+"\" />";

									this.ElemToSelect.appendChild( this.Para );

									if(copyPasteUseBinary)
									{
										var paragraph = cur_element.Parent;
										
										var inIndex;
										var paragraphIndex;
										var content;
										var curParaRun;
										for(var k = 0; k < paragraph.Content.length;k++)
										{
											content = paragraph.Content[k].Content;
											for(var n = 0; n < content.length; n++)
											{
												if(content[n] == cur_element)
												{
													curParaRun = paragraph.Content[k];
													inIndex = n;
													paragraphIndex = k;
													break;
												};
											};
										};
										
										selectionTrue =
										{
											EndPos : curParaRun.Selection.EndPos,
											StartPos: curParaRun.Selection.StartPos,
											EndPosParagraph : paragraph.Selection.EndPos,
											StartPosParagraph: paragraph.Selection.StartPos
										};
										
										//меняем Selection
										curParaRun.Selection.EndPos = inIndex + 1;
										curParaRun.Selection.StartPos = inIndex;
										curParaRun.Selection.Use = true;
										
										paragraph.Selection.EndPos = paragraphIndex;
										paragraph.Selection.StartPos = paragraphIndex;
										paragraph.Selection.Use = true;

										this.oBinaryFileWriter.CopyParagraph(paragraph);

										//возвращаем Selection
										curParaRun.Selection.StartPos = selectionTrue.StartPos;
										curParaRun.Selection.EndPos = selectionTrue.EndPos;
										
										paragraph.Selection.StartPos = selectionTrue.StartPosParagraph;
										paragraph.Selection.EndPos = selectionTrue.EndPosParagraph;
									}
								}
								
								if(copyPasteUseBinary)
								{
									this.oBinaryFileWriter.CopyEnd();
									var sBase64 = this.oBinaryFileWriter.GetResult();
									if(this.ElemToSelect.children && this.ElemToSelect.children.length == 1 && window.USER_AGENT_SAFARI_MACOS)
									{
										$(this.ElemToSelect.children[0]).css("font-weight", "normal");
										$(this.ElemToSelect.children[0]).wrap(document.createElement("b"));
									}
									if(this.ElemToSelect.children[0])
										$(this.ElemToSelect.children[0]).addClass("docData;" + sBase64);
								}
								return;
							}
						}
						if ( true === oDocument.Selection.Use )
						{
							this.CopyDocument(this.ElemToSelect, oDocument, true);
						}
					}
					else
						this.CopyDocument(this.ElemToSelect, oDocument, false);
				}
				
				
				this.oBinaryFileWriter.CopyEnd();
				if(copyPasteUseBinary && this.oBinaryFileWriter.copyParams.itemCount > 0)
				{
					var sBase64 = this.oBinaryFileWriter.GetResult();
					if(this.ElemToSelect.children && this.ElemToSelect.children.length == 1 && window.USER_AGENT_SAFARI_MACOS)
					{
						$(this.ElemToSelect.children[0]).css("font-weight", "normal");;
						$(this.ElemToSelect.children[0]).wrap(document.createElement("b"));
					}
					if(this.ElemToSelect.children[0])
						$(this.ElemToSelect.children[0]).addClass("docData;" + sBase64);
				}
			}

		};

		function SafariIntervalFocus2()
		{
			var api = window["Asc"]["editor"];
			if (api)
			{
				if((api.wb && api.wb.cellEditor && api.wb.cellEditor != null && api.wb.cellEditor.isTopLineActive) || (api.wb && api.wb.getWorksheet() && api.wb.getWorksheet().isSelectionDialogMode))
					return;
				var pastebin = document.getElementById(COPY_ELEMENT_ID2);
				var pastebinText = document.getElementById(kElementTextId);
				if(pastebinText && (api.wb && api.wb.getCellEditMode()) && api.IsFocus)
				{
					pastebinText.focus();
				}
				else if (pastebin && api.IsFocus)
					pastebin.focus();
				else if(!pastebin || !pastebinText)
				{
					// create
					Editor_CopyPaste_Create2(api);
				}
			}
		}

		function Editor_Copy_Event_Excel(e, ElemToSelect, isCut, isAlreadyReadyHtml)
		{
			var api = window["Asc"]["editor"];
			var wb = api.wb;
			var ws = wb.getWorksheet();

			var sBase64;
			if(!isAlreadyReadyHtml)
			{
				if (window["AscDesktopEditorButtonMode"] === true && window["AscDesktopEditor"])
					sBase64 = wb.clipboard._getHtmlBase64(ws.getSelectedRange(), ws, isCut, true);
				else
					sBase64 = wb.clipboard.copyRange(ws.getSelectedRange(), ws, isCut, true);
			}


			if(isCut)
				ws.emptySelection(Asc.c_oAscCleanOptions.All);

			if(sBase64)
				e.clipboardData.setData("text/x-custom", sBase64);
			e.clipboardData.setData("text/html", ElemToSelect.innerHTML);
			//TODO для вставки в ячейку(пересмотреть!!!)
			e.clipboardData.setData("text/plain", ElemToSelect.innerText);
		}

		function Editor_CopyPaste_Create2(api)
		{
			var ElemToSelect = document.createElement("div");
			ElemToSelect.id = COPY_ELEMENT_ID2;
			ElemToSelect.setAttribute("class", COPYPASTE_ELEMENT_CLASS);

			ElemToSelect.style.left = '0px';
			ElemToSelect.style.top = '100px';

			if(window.USER_AGENT_MACOS)
				ElemToSelect.style.width = '1000px';
			else
				ElemToSelect.style.width = '10000px';

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

			ElemToSelect.oncopy = function(e){
				var api = window["Asc"]["editor"];
				if(api.controller.isCellEditMode)
					return;

				Editor_Copy_Event_Excel(e, ElemToSelect);
				e.preventDefault();
			};

			ElemToSelect.oncut = function(e){
				var api = window["Asc"]["editor"];
				if(api.controller.isCellEditMode)
					return;

				Editor_Copy_Event_Excel(e, ElemToSelect, true);
				e.preventDefault();
			};

			ElemToSelect.onpaste = function(e){
				var api = window["Asc"]["editor"];
				var wb = api.wb;
				var ws = wb.getWorksheet();

				wb.clipboard._bodyPaste(ws,e);
				e.preventDefault();
			};

			ElemToSelect["onbeforecut"] = function(e){
				var api = window["Asc"]["editor"];
				if(api.controller.isCellEditMode)
					return;

				var selection = window.getSelection();
				var rangeToSelect = document.createRange();

				ElemToSelect.innerText = "&nbsp";

				rangeToSelect.selectNodeContents (ElemToSelect);

				selection.removeAllRanges ();
				selection.addRange (rangeToSelect);
			};

			ElemToSelect["onbeforecopy"] = function(e){
				var api = window["Asc"]["editor"];
				if(api.controller.isCellEditMode)
					return;

				var selection = window.getSelection();
				var rangeToSelect = document.createRange();

				ElemToSelect.innerText = "&nbsp";

				rangeToSelect.selectNodeContents (ElemToSelect);

				selection.removeAllRanges ();
				selection.addRange (rangeToSelect);
			};

			document.body.appendChild( ElemToSelect );


			//******для редактора ячейки
			var elementText = document.createElement("textarea");

			elementText.id = kElementTextId;
			elementText.style.position = "absolute";

			if(window.USER_AGENT_MACOS)
				ElemToSelect.style.width = '100px';
			else
				ElemToSelect.style.width = '10000px';

			elementText.style.height = '100px';
			elementText.style.left = '0px';
			elementText.style.top = '100px';
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
		
		/*
		 * Export
		 * -----------------------------------------------------------------------------
		 */
		window["Asc"].CopyProcessor = CopyProcessor;
		window["Asc"].Clipboard = Clipboard;
		window["Asc"].pasteFromBinaryWord = pasteFromBinaryWord;
		window["Asc"].DocumentContentBounds = DocumentContentBounds;

		window['AscCommonExcel'] = window['AscCommonExcel'] || {};
		window["AscCommonExcel"].SafariIntervalFocus2 = SafariIntervalFocus2;
	}
)(jQuery, window);
