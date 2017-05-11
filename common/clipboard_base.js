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

(function(window, undefined)
{
	///
	// api редактора должен иметь методы
	// 1) asc_IsFocus(true /* bIsNaturalFocus */) - это принимаем ли мы сейчас клавиатуру.
	// bIsNaturalFocus - это параметр, говорящий о том, что нам нужен фокус наш, исключая поля для ввода (иероглифы например)
	// 2) asc_CheckCopy(_clipboard /* CClipboardData */, _formats) - для наполнения буфера обмена.
	// В нем вызывать _clipboard.pushData(_format, _data); _formats - какие форматы нужны
	// 3) asc_PasteData(_format, ...)
	// 4) incrementCounterLongAction / decrementCounterLongAction - для залочивания вставки
	// 5) asc_SelectionCut();
	///

	// Для инициализации вызвать g_clipboardBase.Init(api); в любой момент времени

	// Import
	var AscBrowser = AscCommon.AscBrowser;

	var c_oAscClipboardDataFormat       = {
		Text        : 1,
		Html        : 2,
		Internal    : 4,
		HtmlElement : 8
	};
	AscCommon.c_oAscClipboardDataFormat = c_oAscClipboardDataFormat;

	function CClipboardBase()
	{
		this.PasteFlag = false;
		this.CopyFlag  = false;

		this.Api = null;

		this.IsNeedDivOnCopy  = AscBrowser.isIE;
		this.IsNeedDivOnPaste = AscBrowser.isIE/* || AscBrowser.isMozilla*/;

		this.IsCopyCutOnlyInEditable = AscBrowser.isIE || AscBrowser.isMozilla;
		this.IsPasteOnlyInEditable   = AscBrowser.isIE || AscBrowser.isMozilla || AscBrowser.isSafari;

		this.CommonDivClassName = "sdk-element";

		this.CommonDivIdParent = "";

		this.CommonDivId = "asc_pasteBin";
		this.CommonDiv   = null;

		this.CommonIframeId = "asc_pasteFrame";
		this.CommonIframe   = null;

		this.ClosureParams = {};

		this.CopyPasteFocus = false;
		this.CopyPasteFocusTimer = -1;

		this.inputContext = null;
		this.LastCopyBinary = null; // для вставки по кнопке, еогда браузер не позволяет

		// images counter
		this.PasteImagesCount = 0;
		this.PasteImagesCounter = 0;
		this.PasteImagesBody = "";
		
		//special paste
		this.specialPasteData = {};//данные последней вставки перед специальной вставкой
		
		//параметры специальной вставки из меню.используется класс для EXCEL СSpecialPasteProps. чтобы не протаскивать через все вызываемые функции, добавил это свойство
		this.specialPasteProps = null;
		
		this.showSpecialPasteButton = false;//нужно показывать или нет кнопку специальной вставки
		this.specialPasteButtonProps = {};//параметры кнопки специальной вставки - позиция. нужно при прокрутке документа, изменения масштаба и тп
		
		this.specialPasteStart = false;//если true, то в данный момент выполняется специальная вставка
		this.pasteStart = false;//идет процесс вставки, выставится в false только после полного ее окончания(загрузка картинок и шрифтов)

		this.bIsEndTransaction = false;//временный флаг для excel. TODO пересмотреть!

		this.showButtonIdParagraph = null;
		this.endRecalcDocument = false;//для документов, закончен ли пересчет документа. нужно, чтобы грамотно рассчитать позицию иконки с/в
	}

	CClipboardBase.prototype =
	{
		_console_log : function(_obj)
		{
			//console.log(_obj);
		},

		_private_oncopy : function(e)
		{
			this._console_log("oncopy");

			if (!this.Api.asc_IsFocus(true))
				return;

			this.ClosureParams._e = e;
			if (this.IsNeedDivOnCopy)
			{
				this.CommonDiv_Copy();
			}
			else
			{
				this.LastCopyBinary = null;
				this.Api.asc_CheckCopy(this, AscCommon.c_oAscClipboardDataFormat.Text | AscCommon.c_oAscClipboardDataFormat.Html | AscCommon.c_oAscClipboardDataFormat.Internal);

				setTimeout(function(){
					g_clipboardBase.EndFocus();
				}, 0);

				e.preventDefault();
				return false;
			}
		},

		_private_oncut : function(e)
		{
			this._console_log("oncut");

			if (!this.Api.asc_IsFocus(true))
				return;

			this.ClosureParams._e = e;
			if (this.IsNeedDivOnCopy)
			{
				this.CommonDiv_Copy();
			}
			else
			{
				this.LastCopyBinary = null;
				this.Api.asc_CheckCopy(this, AscCommon.c_oAscClipboardDataFormat.Text | AscCommon.c_oAscClipboardDataFormat.Html | AscCommon.c_oAscClipboardDataFormat.Internal);
			}

			this.Api.asc_SelectionCut();

			if (!this.IsNeedDivOnCopy)
			{
				setTimeout(function(){
					g_clipboardBase.EndFocus();
				}, 0);

				e.preventDefault();
				return false;
			}
		},

		_private_onpaste : function(e)
		{
			this._console_log("onpaste");

			if (!this.Api.asc_IsFocus(true))
				return;

			if (!this.IsNeedDivOnPaste)
				e.preventDefault();

			this.ClosureParams._e = e;
			if (this.Api.isLongAction())
				return false;

			this.PasteFlag = true;
			this.Api.incrementCounterLongAction();

			if (this.IsNeedDivOnPaste)
			{
				window.setTimeout(function()
				{

					g_clipboardBase.Api.asc_PasteData(AscCommon.c_oAscClipboardDataFormat.HtmlElement, g_clipboardBase.CommonDiv);
					g_clipboardBase.CommonDiv_End();
					g_clipboardBase.Paste_End();

				}, 0);
				return;
			}
			else
			{
				var _clipboard = (e && e.clipboardData) ? e.clipboardData : window.clipboardData;
				if (!_clipboard || !_clipboard.getData)
					return false;

				var _internal = this.ClosureParams.getData("text/x-custom");
				if (_internal && _internal != "" && _internal.indexOf("asc_internalData;") == 0)
				{
					this.Api.asc_PasteData(AscCommon.c_oAscClipboardDataFormat.Internal, _internal.substr("asc_internalData;".length));
					g_clipboardBase.Paste_End();
					return false;
				}

				var _html_format = this.ClosureParams.getData("text/html");
				if (_html_format && _html_format != "")
				{
					var nIndex = _html_format.indexOf("</html>");
					if (-1 != nIndex)
						_html_format = _html_format.substring(0, nIndex + "</html>".length);

					this.CommonIframe_PasteStart(_html_format);
					return false;
				}

				var _text_format = this.ClosureParams.getData("text/plain");
				if (_text_format && _text_format != "")
				{
					var sHtml     = "<html><body>";
					var sCurPar   = "";
					var nParCount = 0;
					for (var i = 0, length = _text_format.length; i < length; i++)
					{
						var Char = _text_format.charAt(i);
						var Code = _text_format.charCodeAt(i);
						var Item = null;

						if ('\n' === Char)
						{
							if ("" == sCurPar)
								sHtml += "<p><span>&nbsp;</span></p>";
							else
							{
								sHtml += "<p><span>" + sCurPar + "</span></p>";
								sCurPar = "";
							}
							nParCount++;
						}
						else if (13 === Code)
						{
							continue;
						}
						else
						{
							if (32 == Code || 160 == Code) //160 - nbsp
								sCurPar += " ";
							else if (9 === Code)
								sCurPar += "<span style='mso-tab-count:1'>    </span>";
							else
							{
								if (Char == '&')
									sCurPar += "&amp;";
								else if (Char == '<')
									sCurPar += "&lt;";
								else if (Char == '>')
									sCurPar += "&gt;";
								else if (Char == '\'')
									sCurPar += "&apos;";
								else if (Char == '\"')
									sCurPar += "&quot;";
								else
									sCurPar += Char;
							}
						}
					}
					if ("" != sCurPar)
					{
						if (0 == nParCount)
							sHtml += ("<span>" + sCurPar + "</span>");
						else
							sHtml += ("<p><span>" + sCurPar + "</span></p>");
						sCurPar = "";
					}
					sHtml += "</body></html>";

					this.CommonIframe_PasteStart(sHtml, _text_format);
					return false;
				}

				var items = _clipboard.items;
                if (null != items && 0 != items.length)
                {
                    g_clipboardBase.PasteImagesBody = "";
                    g_clipboardBase.PasteImagesCount = items.length;
                    g_clipboardBase.PasteImagesCounter = 0;
                    for (var i = 0; i < items.length; ++i)
                    {
                        if (items[i].kind == 'file' && items[i].type.indexOf('image/') !== -1)
                        {
                            var blob = items[i].getAsFile();
                            var reader = new FileReader();

                            reader.onload = function(e) {
                                g_clipboardBase.PasteImagesCounter++;
                                g_clipboardBase.PasteImagesBody += ("<img src=\"" + e.target.result + "\"/>");

                                if (g_clipboardBase.PasteImagesCounter == g_clipboardBase.PasteImagesCount)
                                {
                                    g_clipboardBase.CommonIframe_PasteStart("<html><body>" + g_clipboardBase.PasteImagesBody + "</body></html>");

                                    g_clipboardBase.PasteImagesBody = "";
                                    g_clipboardBase.PasteImagesCounter = 0;
                                    g_clipboardBase.PasteImagesCount = 0;
                                }
                            };

                            reader.onabort = reader.onerror = function(e) {
                                g_clipboardBase.PasteImagesCounter++;

                                if (g_clipboardBase.PasteImagesCounter == g_clipboardBase.PasteImagesCount)
                                {
                                    g_clipboardBase.CommonIframe_PasteStart("<html><body>" + g_clipboardBase.PasteImagesBody + "</body></html>");

                                    g_clipboardBase.PasteImagesBody = "";
                                    g_clipboardBase.PasteImagesCounter = 0;
                                    g_clipboardBase.PasteImagesCount = 0;
                                }
                            };

                            reader.readAsDataURL(blob);
                        }
                        else
                        {
                            g_clipboardBase.PasteImagesCounter++;
                        }
                    }

                    if (g_clipboardBase.PasteImagesCounter == g_clipboardBase.PasteImagesCount)
                        g_clipboardBase.Paste_End();

                    return false;
                }
			}

            g_clipboardBase.Paste_End();
			return false;
		},

		_private_onbeforepaste : function(e, isAttackEmulate)
		{
			this._console_log("onbeforepaste");
			
			//TODO условие добавил, чтобы не терялся фокус со строки формул при copy/paste. проверить!
			if (!this.Api.asc_IsFocus(true))
				return;
			
			//if (isAttackEmulate === true)
			{
				this.CommonDiv = this.CommonDiv_Check();
				this.CommonDiv_Start();

				this.CommonDiv.focus();
				this.StartFocus();
				this.CommonDiv_Select();
				return;
			}

			return false;
		},

		_private_onbeforecopy_select : function()
		{
			if (AscBrowser.isIE)
			{
				this._console_log("onbeforecopy_select");

				this.CommonDiv = this.CommonDiv_Check();
				this.CommonDiv_Start();
				this.CommonDiv.innerHTML = "<span> </span>";

				this.CommonDiv.focus();
				this.StartFocus();
				this.CommonDiv_Select();
			}
		},

		_private_onbeforecopy : function(e, isAttackEmulate)
		{
			this._console_log("onbeforecopy");
			
			//TODO условие добавил, чтобы не терялся фокус со строки формул при copy/paste. проверить!
			if (!this.Api.asc_IsFocus(true))
				return;
			
			//if (isAttackEmulate === true)
			{
				this.CommonDiv = this.CommonDiv_Check();
				this.CommonDiv_Start();
				this.CommonDiv.innerHTML = "<span> </span>";

				this.CommonDiv.focus();
				this.StartFocus();
				this.CommonDiv_Select();
			}

			return false;
		},

		Init : function(_api)
		{
			this.Api = _api;

			this.ClosureParams.getData = function(type)
			{
				var _clipboard = (this._e && this._e.clipboardData) ? this._e.clipboardData : window.clipboardData;
				if (!_clipboard || !_clipboard.getData)
					return null;

				var _type = type;
				if (AscBrowser.isIE && (type == 'text' || type == 'text/plain'))
					_type = "Text";

				try
				{
					return _clipboard.getData(_type);
				}
				catch (e)
				{
				}
				return null;
			};

			this.ClosureParams.setData = function(type, _data)
			{
				var _clipboard = (this._e && this._e.clipboardData) ? this._e.clipboardData : window.clipboardData;
				if (!_clipboard || !_clipboard.setData)
					return null;

				var _type = type;
				if (AscBrowser.isIE && (type == 'text' || type == 'text/plain'))
					_type = "Text";

				try
				{
					_clipboard.setData(_type, _data);
				}
				catch (e)
				{
				}
			};

			if (!AscBrowser.isIE)
			{
				document.oncopy           = function(e)
				{
					return g_clipboardBase._private_oncopy(e)
				};
				document.oncut            = function(e)
				{
					return g_clipboardBase._private_oncut(e)
				};
				document.onpaste          = function(e)
				{
					return g_clipboardBase._private_onpaste(e);
				};
				document["onbeforecopy"]  = function(e)
				{
					return g_clipboardBase._private_onbeforecopy(e);
				};
				document["onbeforecut"]   = function(e)
				{
					return g_clipboardBase._private_onbeforecopy(e);
				};
				document["onbeforepaste"] = function(e)
				{
					return g_clipboardBase._private_onbeforepaste(e);
				};
			}
			else
			{
				document.addEventListener("copy", function(e)
				{
					return g_clipboardBase._private_oncopy(e);
				});
				document.addEventListener("cut", function(e)
				{
					return g_clipboardBase._private_oncut(e);
				});
				document.addEventListener("paste", function(e)
				{
					return g_clipboardBase._private_onpaste(e);
				});
				document.addEventListener("beforepaste", function(e)
				{
					return g_clipboardBase._private_onbeforepaste(e);
				});
				document.addEventListener("beforecopy", function(e)
				{
					return g_clipboardBase._private_onbeforecopy(e);
				});
				document.addEventListener("beforecut", function(e)
				{
					return g_clipboardBase._private_onbeforecopy(e);
				});
			}

			if (this.IsCopyCutOnlyInEditable || this.IsPasteOnlyInEditable)
			{
				document.onkeydown = function(e)
				{
					if (!g_clipboardBase.Api.asc_IsFocus(true) || g_clipboardBase.Api.isLongAction())
						return;


					var isCtrl  = (e.ctrlKey === true || e.metaKey === true);
					var isShift = e.shiftKey;
					var keyCode = e.keyCode;

					if (g_clipboardBase.IsCopyCutOnlyInEditable)
					{
						var bIsBeforeCopyCutEmulate = false;
						var _cut                    = false;
						if (isCtrl && !isShift && (keyCode == 67 || keyCode == 88)) // copy
							bIsBeforeCopyCutEmulate = true;
						if (!isCtrl && isShift && keyCode == 45) // cut
						{
							bIsBeforeCopyCutEmulate = true;
							_cut                    = true;
						}

						if (bIsBeforeCopyCutEmulate)
						{
							//g_clipboardBase._private_onbeforecopy_select();

							g_clipboardBase._console_log("emulate_beforecopycut");
							var isEmulate = false;
							try
							{
								isEmulate = _cut ? document.execCommand("beforecut") : document.execCommand("beforecopy");
							}
							catch (err)
							{
							}

							g_clipboardBase._private_onbeforecopy(undefined, !isEmulate);
						}
					}

					if (g_clipboardBase.IsPasteOnlyInEditable)
					{
						var bIsBeforePasteEmulate = false;
						if (isCtrl && !isShift && keyCode == 86)
							bIsBeforePasteEmulate = true;
						if (!isCtrl && isShift && keyCode == 45)
							bIsBeforePasteEmulate = true;

						if (bIsBeforePasteEmulate)
						{
							g_clipboardBase._console_log("emulate_beforepaste");
							var isEmulate = false;
							try
							{
								isEmulate = document.execCommand("beforepaste");
							}
							catch (err)
							{
							}

							g_clipboardBase._private_onbeforepaste(undefined, !isEmulate);
						}
					}
				};
			}

			if (AscBrowser.isSafari && false)
			{
				this.CommonDiv = this.CommonDiv_Check();

				setInterval(function()
				{
					if (g_clipboardBase.Api.asc_IsFocus(true))
						g_clipboardBase.CommonDiv.focus();

				}, 100);
			}
		},

		IsWorking : function()
		{
			return (this.CopyFlag || this.PasteFlag) ? true : false;
		},

		StartFocus : function()
		{
			// не плодим таймеры
			this.EndFocus(false);

			this.CopyPasteFocus = true;

			// этот метод используется на beforeCopy/Cut/Paste
			// нужно не отдать фокус текстовому полю (до настоящих Copy/Cut/Paste)
			// время ставим с запасом, так как обрубим на конец Copy/Cut/Paste
			this.CopyPasteFocusTimer = setTimeout(function(){
				g_clipboardBase.EndFocus();
			}, 1000);

		},

		EndFocus : function(isFocusToEditor)
		{
			this.CopyPasteFocus = false;
			if (-1 != this.CopyPasteFocusTimer)
			{
				clearTimeout(this.CopyPasteFocusTimer);
				this.CopyPasteFocusTimer = -1;


				if (false !== isFocusToEditor && null != this.inputContext)
				{
					if (this.inputContext.HtmlArea)
						this.inputContext.HtmlArea.focus();
				}
			}
		},

		IsFocus : function()
		{
			return this.CopyPasteFocus;
		},

		CommonDiv_Check : function()
		{
			var ElemToSelect = document.getElementById(this.CommonDivId);
			if (!ElemToSelect)
			{
				ElemToSelect                              = document.createElement("div");
				ElemToSelect.id                           = this.CommonDivId;
				ElemToSelect.className                    = this.CommonDivClassName;
				ElemToSelect.style.position               = "fixed";
				ElemToSelect.style.left                   = '0px';
				ElemToSelect.style.top                    = '-100px';
				ElemToSelect.style.width                  = '10000px';
				ElemToSelect.style.height                 = '100px';
				ElemToSelect.style.overflow               = 'hidden';
				ElemToSelect.style.zIndex                 = -1000;
				ElemToSelect.style.MozUserSelect          = "text";
				ElemToSelect.style["-khtml-user-select"]  = "text";
				ElemToSelect.style["-o-user-select"]      = "text";
				ElemToSelect.style["user-select"]         = "text";
				ElemToSelect.style["-webkit-user-select"] = "text";
				ElemToSelect.setAttribute("contentEditable", true);

				var _parent = ("" == this.CommonDivIdParent) ? document.body : document.getElementById(this.CommonDivIdParent);
				_parent.appendChild(ElemToSelect);
			}
			return ElemToSelect;
		},

		CommonDiv_Select : function()
		{
			var ElemToSelect = this.CommonDiv;
			if (window.getSelection) // all browsers, except IE before version 9
			{
				var selection     = window.getSelection();
				var rangeToSelect = document.createRange();

				var is_gecko = AscBrowser.isGecko;
				if (is_gecko)
				{
					ElemToSelect.appendChild(document.createTextNode('\xa0'));
					ElemToSelect.insertBefore(document.createTextNode('\xa0'), ElemToSelect.firstChild);
					rangeToSelect.setStartAfter(ElemToSelect.firstChild);
					rangeToSelect.setEndBefore(ElemToSelect.lastChild);
				}
				else
				{
					var aChildNodes = ElemToSelect.childNodes;
					if (aChildNodes.length == 1)
					{
						var elem = aChildNodes[0];
						var wrap = document.createElement("b");
						wrap.setAttribute("style", "font-weight:normal; background-color: transparent; color: transparent;");
						elem = ElemToSelect.removeChild(elem);
						wrap.appendChild(elem);
						ElemToSelect.appendChild(wrap);
					}
					rangeToSelect.selectNodeContents(ElemToSelect);
				}

				selection.removeAllRanges();
				selection.addRange(rangeToSelect);
			}
			else
			{
				if (document.body.createTextRange) // Internet Explorer
				{
					var rangeToSelect = document.body.createTextRange();
					rangeToSelect.moveToElementText(ElemToSelect);
					rangeToSelect.select();
				}
			}
		},

		CommonDiv_Start : function()
		{
			this.ClosureParams.overflowBody = document.body.style.overflow;
			document.body.style.overflow    = 'hidden';

			this.ClosureParams.backgroundcolorBody  = document.body.style["background-color"];
			document.body.style["background-color"] = "transparent";

			var ElemToSelect           = this.CommonDiv;
			ElemToSelect.style.display = "block";

			while (ElemToSelect.hasChildNodes())
				ElemToSelect.removeChild(ElemToSelect.lastChild);

			document.body.style.MozUserSelect = "text";
			delete document.body.style["-khtml-user-select"];
			delete document.body.style["-o-user-select"];
			delete document.body.style["user-select"];
			document.body.style["-webkit-user-select"] = "text";

			ElemToSelect.style.MozUserSelect = "all";
		},

		CommonDiv_End : function()
		{
			var ElemToSelect = this.CommonDiv;

			ElemToSelect.style.display                 = AscBrowser.isSafari ? "block" : "none";
			document.body.style.MozUserSelect          = "none";
			document.body.style["-khtml-user-select"]  = "none";
			document.body.style["-o-user-select"]      = "none";
			document.body.style["user-select"]         = "none";
			document.body.style["-webkit-user-select"] = "none";

			document.body.style["background-color"] = this.ClosureParams.backgroundcolorBody;

			ElemToSelect.style.MozUserSelect = "none";
			document.body.style.overflow     = this.ClosureParams.overflowBody;

			this.CopyFlag = false;
			this.EndFocus();
		},

		CommonDiv_Copy : function()
		{
			this.CopyFlag  = true;
			this.CommonDiv = this.CommonDiv_Check();

			this.CommonDiv_Start();

			this.ClosureParams.isDivCopy = true;
			this.LastCopyBinary = null;
			this.Api.asc_CheckCopy(this, AscCommon.c_oAscClipboardDataFormat.Text | AscCommon.c_oAscClipboardDataFormat.Html | AscCommon.c_oAscClipboardDataFormat.Internal);
			this.ClosureParams.isDivCopy = false;

			this.CommonDiv_Select();

			window.setTimeout(function()
			{

				g_clipboardBase.CommonDiv_End();

			}, 0);
		},

		CommonDiv_Execute_CopyCut : function()
		{
			if (this.IsCopyCutOnlyInEditable)
			{
				this._private_onbeforecopy(undefined, true);
			}
		},

		CommonIframe_PasteStart : function(_html_data, text_data)
		{
			var ifr = document.getElementById(this.CommonIframeId);
			if (!ifr)
			{
				ifr                = document.createElement("iframe");
				ifr.name           = this.CommonIframeId;
				ifr.id             = this.CommonIframeId;
				ifr.style.position = 'absolute';
				ifr.style.top      = '-100px';
				ifr.style.left     = '0px';
				ifr.style.width    = '10000px';
				ifr.style.height   = '100px';
				ifr.style.overflow = 'hidden';
				ifr.style.zIndex   = -1000;
				ifr.setAttribute("sandbox", "allow-same-origin");
				document.body.appendChild(ifr);

				this.CommonIframe = ifr;
			}
			else
				ifr.style.width = '10000px';

			var frameWindow = window.frames[this.CommonIframeId];
			if (frameWindow)
			{
				frameWindow.document.open();
				frameWindow.document.write(_html_data);
				frameWindow.document.close();
				if (null != frameWindow.document && null != frameWindow.document.body)
				{
					ifr.style.display = "block";

					this.Api.asc_PasteData(AscCommon.c_oAscClipboardDataFormat.HtmlElement, frameWindow.document.body, ifr, text_data);
				}
			}

			ifr.style.width = '100px';

			g_clipboardBase.Paste_End();
		},

		CommonIframe_PasteEnd : function()
		{
			if (this.CommonIframe && this.CommonIframe.style.display != "none")
			{
				this.CommonIframe.blur();
				this.CommonIframe.style.display = "none";
			}
		},

		Paste_End : function()
		{
			this.CommonIframe_PasteEnd();
			this.Api.decrementCounterLongAction();
			this.PasteFlag = false;
			this.EndFocus();
		},

		pushData : function(_format, _data)
		{
			if (null == this.LastCopyBinary)
				this.LastCopyBinary = [];
			this.LastCopyBinary.push({ type: _format, data : _data });

			if (this.ClosureParams.isDivCopy === true)
			{
				if (_format == AscCommon.c_oAscClipboardDataFormat.Html)
					this.CommonDiv.innerHTML = _data;
				return;
			}

			var _data_format = "";
			switch (_format)
			{
				case AscCommon.c_oAscClipboardDataFormat.Html:
					_data_format = "text/html";
					break;
				case AscCommon.c_oAscClipboardDataFormat.Text:
					_data_format = "text/plain";
					break;
				case AscCommon.c_oAscClipboardDataFormat.Internal:
					_data_format = "text/x-custom";
					break;
				default:
					break;
			}

			if (_data_format != "" && _data !== null)
			{
				if (_data_format == "text/x-custom")
					this.ClosureParams.setData(_data_format, "asc_internalData;" + _data);
				else
					this.ClosureParams.setData(_data_format, _data);
			}
		},

		Button_Copy : function()
		{
			if (this.inputContext)
				this.inputContext.HtmlArea.focus();
			this.Api.asc_enableKeyEvents(true, true);

			this.CommonDiv_Execute_CopyCut();
			var _ret = document.execCommand("copy");
			if (!_ret)
			{
				//　копирования не было
				this.LastCopyBinary = null;
				this.Api.asc_CheckCopy(this, AscCommon.c_oAscClipboardDataFormat.Text | AscCommon.c_oAscClipboardDataFormat.Html | AscCommon.c_oAscClipboardDataFormat.Internal);
			}
			return  _ret;
		},

		Button_Cut : function()
		{
			if (this.inputContext)
				this.inputContext.HtmlArea.focus();
			this.Api.asc_enableKeyEvents(true, true);

			this.CommonDiv_Execute_CopyCut();
			var _ret = document.execCommand("cut");
			if (!_ret)
			{
				//　копирования не было
				this.LastCopyBinary = null;
				this.Api.asc_CheckCopy(this, AscCommon.c_oAscClipboardDataFormat.Text | AscCommon.c_oAscClipboardDataFormat.Html | AscCommon.c_oAscClipboardDataFormat.Internal);

				this.Api.asc_SelectionCut();
			}
			return _ret;
		},

		Button_Paste : function()
		{
			if (this.inputContext)
				this.inputContext.HtmlArea.focus();
			this.Api.asc_enableKeyEvents(true, true);

			var _ret = document.execCommand("paste");
			if (!_ret && null != this.LastCopyBinary)
			{
				var _data = null;
				var _isInternal = false;
				for (var i = 0; i < this.LastCopyBinary.length; i++)
				{
					if (c_oAscClipboardDataFormat.Internal == this.LastCopyBinary[i].type)
					{
						this.Api.asc_PasteData(AscCommon.c_oAscClipboardDataFormat.Internal, this.LastCopyBinary[i].data);
						_isInternal = true;
					}
				}

				if (!_isInternal && this.LastCopyBinary.length > 0)
					this.Api.asc_PasteData(this.LastCopyBinary[0].type, this.LastCopyBinary[0].data);
			}
			return _ret;
		},
		
		Special_Paste : function(props)
		{
			this.Api.asc_SpecialPasteData(props);
			return true;
		},
		
		Clean_SpecialPasteObj : function()
		{
			this.specialPasteData = {};
		},
		
		Special_Paste_Start : function()
		{
			this.specialPasteStart = true;
		},
		
		Special_Paste_End : function()
		{
			this.specialPasteStart = false;
		},
		
		Paste_Process_Start : function()
		{
			this.pasteStart = true;
		},
		
		Paste_Process_End : function()
		{
			this.pasteStart = false;
			this.specialPasteProps = null;
			//процесс специальной вставки заканчивается вместе с общей вставкой
			if(this.specialPasteStart)
			{
				this.Special_Paste_End();
			}
			else//если не было специальной вставки, необходимо показать кнопку специальной вставки
			{
				this.SpecialPasteButton_Show();
			}

			//TODO для excel заглушка. пересмотреть!
			if(this.bIsEndTransaction)
			{
				this.bIsEndTransaction = false;
				History.EndTransaction();
			}
		},
		
		SpecialPasteButton_Show : function(props)
		{
			//при быстром совместном редактировании отключаем возможность специальной вставки
			if(AscCommon.CollaborativeEditing && AscCommon.CollaborativeEditing.m_bFast)
			{
				return;
			}

			if(!props)
			{
				props = this.specialPasteButtonProps.props;
			}
			if(props)
			{
				this.showSpecialPasteButton = true;
				if(window["Asc"] && window["Asc"]["editor"])
				{
					this.Api.asc_ShowSpecialPasteButton(props);
				}
			}
		},


		SpecialPasteButtonById_Show: function()
		{
			//при быстром совместном редактировании отключаем возможность специальной вставки
			if(AscCommon.CollaborativeEditing && AscCommon.CollaborativeEditing.m_bFast)
			{
				return;
			}

			var specialPasteShowOptions = this.specialPasteButtonProps ? this.specialPasteButtonProps.props : null;
			if(specialPasteShowOptions && null !== this.showButtonIdParagraph)
			{
				var isUpdate = specialPasteShowOptions.cellCoord;
				var id = this.showButtonIdParagraph;
				var elem = g_oTableId.Get_ById(id);

				var _X, _Y;
				if(elem.GetTargetPos)
				{
					var testPos = elem.GetTargetPos();
					var diffX = 0;
					var diffY = 0;
					if(testPos.Transform)
					{
						diffX = testPos.Transform.tx;
						diffY = testPos.Transform.ty;
					}

					_Y = testPos.Y + testPos.Height + diffY;
					_X = testPos.X + diffX;
				}
				else
				{
					_Y = elem.Y + elem.AnchorPosition.H;
					_X = elem.X + elem.AnchorPosition.W;
				}

				var _PageNum = this.Api.WordControl.m_oLogicDocument.CurPage;

				this.specialPasteButtonProps.fixPosition = {x: _X, y: _Y, pageNum: _PageNum};

				var _coord = this.Api.WordControl.m_oLogicDocument.DrawingDocument.ConvertCoordsToCursorWR(_X, _Y, _PageNum);
				var curCoord = new AscCommon.asc_CRect( _coord.X, _coord.Y, 0, 0 );
				specialPasteShowOptions.asc_setCellCoord(curCoord);

				if(isUpdate)
				{
					specialPasteShowOptions.options = [];
					this.Api.asc_UpdateSpecialPasteButton(specialPasteShowOptions);
				}
				else
				{
					this.Api.asc_ShowSpecialPasteButton(specialPasteShowOptions);
				}
			}

			this.showButtonIdParagraph = null;
		},

		SpecialPasteButton_Hide : function()
		{
			if(this.showSpecialPasteButton)
			{
				this.showSpecialPasteButton = false;
				this.Api.asc_HideSpecialPasteButton();
			}
		},
		
		SpecialPasteButton_Update_Position : function()
		{
			//TODO метод должен быть общий для всех редакторов
			if(this.showSpecialPasteButton && this.specialPasteButtonProps.fixPosition)
			{
				var specialPasteShowOptions = new Asc.SpecialPasteShowOptions();
				
				var _Y = this.specialPasteButtonProps.fixPosition.y;
				var _X = this.specialPasteButtonProps.fixPosition.x;
				var _PageNum = this.specialPasteButtonProps.fixPosition.pageNum;
				
				var _сoord = this.Api.WordControl.m_oLogicDocument.DrawingDocument.ConvertCoordsToCursorWR(_X, _Y, _PageNum);
				var curCoord = new AscCommon.asc_CRect( _сoord.X, _сoord.Y, 0, 0 );
				specialPasteShowOptions.asc_setCellCoord(curCoord);
				
				this.Api.asc_ShowSpecialPasteButton(specialPasteShowOptions);
			}
		}
	};

	var g_clipboardBase = new CClipboardBase();
	window['AscCommon'] = window['AscCommon'] || {};
	window['AscCommon'].g_clipboardBase = g_clipboardBase;
})(window);

// copy/paste focus error!!!
window["asc_desktop_copypaste"] = function(_api, _method)
{
	var bIsFocus = _api.asc_IsFocus();
	if (!bIsFocus)
		_api.asc_enableKeyEvents(true);
	window["AscDesktopEditor"][_method]();
	if (!bIsFocus)
		_api.asc_enableKeyEvents(false);
};