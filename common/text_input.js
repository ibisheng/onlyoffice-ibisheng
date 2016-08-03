/*
 * (c) Copyright Ascensio System SIA 2010-2016
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
	// такие методы нужны в апи
	// baseEditorsApi.prototype.Begin_CompositeInput = function()
	// baseEditorsApi.prototype.Replace_CompositeText = function(arrCharCodes)
	// baseEditorsApi.prototype.Set_CursorPosInCompositeText = function(nPos)
	// baseEditorsApi.prototype.Get_CursorPosInCompositeText = function()
	// baseEditorsApi.prototype.End_CompositeInput = function()
	// baseEditorsApi.prototype.Get_MaxCursorPosInCompositeText = function()

	// baseEditorsApi.prototype.onKeyDown = function(e)
	// baseEditorsApi.prototype.onKeyPress = function(e)
	// baseEditorsApi.prototype.onKeyUp = function(e)
	///

	var c_oCompositionState = {
		start   : 0,
		process : 1,
		end     : 2
	};

	function CKeyboardEventWrapper(e)
	{
		// emulate
		this.altKey 	= e.altKey;
		this.ctrlKey 	= e.ctrlKey;
		this.metaKey 	= e.metaKey;
		this.shiftKey 	= e.shiftKey;

		this.charCode 	= e.charCode;
		this.keyCode 	= e.keyCode;
		this.which 		= e.which;

		this.code 		= e.code;
		this.key 		= e.key;

		this.srcElement = e.srcElement;
		this.target		= e.target;

		// work
		this._isDefaultPrevented = false;
	}
	CKeyboardEventWrapper.prototype =
	{
		preventDefault : function()
		{
			this._isDefaultPrevented = true;
		},
		stopPropagation : function()
		{
			// nothing
		}
	};

	function ti_console_log(_log)
	{
		//console.log(_log);
	}
	function ti_console_log2(_log)
	{
		//console.log(_log);
	}

	function CTextInput(api)
	{
		this.Api = api;

		this.compositionValue = [];		// коды символов
		this.compositionState = c_oCompositionState.end;

		this.TargetId = null;			// id caret
		this.HtmlDiv  = null;			// для незаметной реализации одной textarea недостаточно

		this.TextArea_Not_ContentEditableDiv = AscCommon.AscBrowser.isIeEdge ? false : true;
		this.TextArea_Not_ContentEditableDiv = true;//AscCommon.AscBrowser.isIeEdge ? false : true;
		this.HtmlArea = null;

		this.HtmlAreaOffset = 60;

		this.LockerTargetTimer = -1;

		this.KeyDownFlag               = false;
		this.TextInputAfterComposition = false;

		this.IsLockTargetMode = false;

		this.IsUseFirstTextInputAfterComposition = false;

		this.nativeFocusElement = null;
		this.nativeFocusElementNoRemoveOnElementFocus = false;
		this.InterfaceEnableKeyEvents = true;

		this.ieNonCompositionPrefix = "";
		this.ieNonCompositionPrefixConfirm = "";
		this.isFirstCompositionUpdateAfterStart = true;

		this.debugTexBoxMaxW = 100;
		this.debugTexBoxMaxH = 20;
		this.isDebug 	= false;
		this.isSystem 	= false;
		this.isShow		= false;

		// в хроме бывают случаи, когда приходит keyDown, но не приходит keyPress
		// и это без композитного ввода (например китайский язык, набирать кнопки 0 -- 9)
		// следим так: на onInput - если
		// 1) был keyDown, и на нем "ждем" keyPress
		// 2) не было keyPress, composition events
		// 3) тогда вставляем
		// в ie такие же проблемы. приходят только пустые start и end
		// поэтому учитываем только update, заодно запоминаем дату на старте (только для ие)
		this.isChromeKeysNoKeyPressPresent = false;
		this.isChromeKeysNoKeyPressPresentStartValue = "";

		// chrome element for left/top
		this.FixedPosCheckElementX = 0;
		this.FixedPosCheckElementY = 0;

		// еще один режим для ie & edge
		this.IsUseInputEventOnlyWithCtx = false;//(AscCommon.AscBrowser.isIE) ? true : false;
	}

	CTextInput.prototype =
	{
		init : function(target_id)
		{
			this.TargetId   = target_id;
			var oHtmlTarget = document.getElementById(this.TargetId);
			var oHtmlParent = oHtmlTarget.parentNode;

			this.HtmlDiv                  = document.createElement("div");
			this.HtmlDiv.id               = "area_id_parent";
			this.HtmlDiv.style.background = "transparent";
			this.HtmlDiv.style.border     = "none";

			// в хроме скроллируется редактор, когда курсор текстового поля выходит за пределы окна
			if (AscCommon.AscBrowser.isChrome)
				this.HtmlDiv.style.position = "fixed";
			else
				this.HtmlDiv.style.position   = "absolute";
			this.HtmlDiv.style.zIndex     = 10;
			this.HtmlDiv.style.width      = "20px";
			this.HtmlDiv.style.height     = "50px";
			this.HtmlDiv.style.overflow   = "hidden";

			this.HtmlDiv.style.boxSizing 		= "content-box";
			this.HtmlDiv.style.webkitBoxSizing 	= "content-box";
			this.HtmlDiv.style.MozBoxSizing 	= "content-box";

			if (this.TextArea_Not_ContentEditableDiv)
			{
				this.HtmlArea               	= document.createElement("textarea");
			}
			else
			{
				this.HtmlArea					= document.createElement("div");
				this.HtmlArea.setAttribute("contentEditable", true);
			}
			this.HtmlArea.id                   	= "area_id";

			var _style = "left:0px;top:" + (-this.HtmlAreaOffset) + "px;";
			_style += "background:transparent;border:none;position:absolute;text-shadow:0 0 0 #000;outline:none;color:transparent;width:1000px;height:50px;";
			_style += "overflow:hidden;padding:0px;margin:0px;font-family:arial;font-size:12pt;resize:none;font-weight:normal;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;";
			this.HtmlArea.setAttribute("style", _style);
			this.HtmlArea.setAttribute("spellcheck", false);

			this.HtmlDiv.appendChild(this.HtmlArea);

			if (true)
			{
				// нужен еще один родитель. чтобы скроллился он, а не oHtmlParent
				var oHtmlDivScrollable              = document.createElement("div");
				oHtmlDivScrollable.id 				= "area_id_main";
				oHtmlDivScrollable.setAttribute("style", "background:transparent;border:none;position:absolute;padding:0px;margin:0px;z-index:0;pointer-events:none;");

				var parentStyle                   = getComputedStyle(oHtmlParent);
				oHtmlDivScrollable.style.left     = parentStyle.left;
				oHtmlDivScrollable.style.top      = parentStyle.top;
				oHtmlDivScrollable.style.width    = parentStyle.width;
				oHtmlDivScrollable.style.height   = parentStyle.height;
				oHtmlDivScrollable.style.overflow = "hidden";

				oHtmlDivScrollable.appendChild(this.HtmlDiv);
				oHtmlParent.parentNode.appendChild(oHtmlDivScrollable);
			}
			else
			{
				oHtmlParent.appendChild(this.HtmlDiv);
			}

			// events:
			var oThis                   = this;
			this.HtmlArea["onkeydown"]  = function(e)
			{
				return oThis.onKeyDown(e);
			};
			this.HtmlArea["onkeypress"] = function(e)
			{
				return oThis.onKeyPress(e);
			};
			this.HtmlArea["onkeyup"]    = function(e)
			{
				return oThis.onKeyUp(e);
			};

			this.HtmlArea.addEventListener("input", function(e)
			{
				return oThis.onInput(e);
			}, false);
			this.HtmlArea.addEventListener("textInput", function(e)
			{
				return oThis.onTextInput(e);
			}, false);
			this.HtmlArea.addEventListener("text", function(e)
			{
				return oThis.onTextInput(e);
			}, false);

			this.HtmlArea.addEventListener("compositionstart", function(e)
			{
				return oThis.onCompositionStart(e);
			}, false);
			this.HtmlArea.addEventListener("compositionupdate", function(e)
			{
				return oThis.onCompositionUpdate(e);
			}, false);
			this.HtmlArea.addEventListener("compositionend", function(e)
			{
				return oThis.onCompositionEnd(e);
			}, false);

			this.show();

			/*
			 setInterval(function(){
			 if (oThis.Api.asc_IsFocus() && !AscCommon.g_clipboardBase.IsFocus() && !AscCommon.g_clipboardBase.IsWorking())
			 {
			 if (document.activeElement != oThis.HtmlArea)
			 oThis.HtmlArea.focus();
			 }
			 }, 10);
			 */

			this.Api.Input_UpdatePos();
		},

		onResize : function(_editorContainerId)
		{
			var _elem          = document.getElementById("area_id_main");
			var _elemSrc       = document.getElementById(_editorContainerId);

			if (AscCommon.AscBrowser.isChrome)
			{
				var rectObject = _elemSrc.getBoundingClientRect();
				this.FixedPosCheckElementX = rectObject.left;
				this.FixedPosCheckElementY = rectObject.top;
			}

			var _width = _elemSrc.style.width;
			if ((null == _width || "" == _width) && window.getComputedStyle)
			{
				var _s = window.getComputedStyle(_elemSrc);
				_elem.style.left   = _s.left;
				_elem.style.top    = _s.top;
				_elem.style.width  = _s.width;
				_elem.style.height = _s.height;
			}
			else
			{
				_elem.style.left   = _elemSrc.style.left;
				_elem.style.top    = _elemSrc.style.top;
				_elem.style.width  = _width;
				_elem.style.height = _elemSrc.style.height;
			}
		},

		checkFocus : function()
		{
			if (oThis.Api.asc_IsFocus() && !AscCommon.g_clipboardBase.IsFocus() && !AscCommon.g_clipboardBase.IsWorking())
			{
				if (document.activeElement != oThis.HtmlArea)
					oThis.HtmlArea.focus();
			}
		},

		move : function(x, y)
		{
			var oTarget = document.getElementById(this.TargetId);
			var xPos    = x ? x : parseInt(oTarget.style.left);
			var yPos    = (y ? y : parseInt(oTarget.style.top)) + parseInt(oTarget.style.height);

			if (!this.isDebug && !this.isSystem)
			{
				this.HtmlDiv.style.left = xPos + this.FixedPosCheckElementX + "px";
				this.HtmlDiv.style.top  = yPos + this.FixedPosCheckElementY + this.HtmlAreaOffset + "px";
			}
			else
			{
				// this.HtmlAreaOffset - не сдвигаем, курсор должен быть виден
				this.debugCalculatePlace(xPos + this.FixedPosCheckElementX, yPos + this.FixedPosCheckElementY);
			}
		},

		putAreaValue : function(val)
		{
			if (this.TextArea_Not_ContentEditableDiv)
				this.HtmlArea.value = val;
			else
				this.HtmlArea.innerHTML = val;
		},

		getAreaValue : function()
		{
			return this.TextArea_Not_ContentEditableDiv ? this.HtmlArea.value : this.HtmlArea.innerHTML;
		},

		clear : function(isFromCompositionEnd)
		{
			this.compositionValue = [];
			this.compositionState = c_oCompositionState.end;

			if (isFromCompositionEnd !== true)
			{
				this.putAreaValue("");

				this.ieNonCompositionPrefix = "";
				this.ieNonCompositionPrefixConfirm = "";
			}
		},

		show : function()
		{
			if (this.isDebug || this.isSystem)
			{
				ti_console_log("ti: show");

				document.getElementById("area_id_main").style.zIndex = 10;

				this.HtmlArea.style.top   	= "0px";
				this.HtmlArea.style.width 	= "100%";
				this.HtmlArea.style.height 	= "100%";

				this.HtmlArea.style.background = "#FFFFFF";
				this.HtmlArea.style.color = "black";
				this.HtmlDiv.style.zIndex = 90;

				this.HtmlDiv.style.border = "2px solid #4363A4";

				this.isShow = true;
			}
		},

		unshow : function()
		{
			if (this.isDebug || this.isSystem)
			{
				ti_console_log("ti: unshow");

				document.getElementById("area_id_main").style.zIndex = 0;

				this.HtmlArea.style.top   	= ((-this.HtmlAreaOffset) + "px");
				this.HtmlArea.style.width 	= "1000px";
				this.HtmlArea.style.height 	= "50px";

				this.HtmlArea.style.background = "transparent";
				this.HtmlArea.style.color = "transparent";
				this.HtmlDiv.style.zIndex = 0;

				this.HtmlDiv.style.border = "none";

				this.isShow = false;
			}
		},

		debugCalculatePlace : function(x, y)
		{
			var _left = x;
			var _top = y;

			if (undefined == _left)
				_left = parseInt(this.HtmlDiv.style.left);
			if (undefined == _top)
				_top = parseInt(this.HtmlDiv.style.top);

			var _editorSdk = document.getElementById("editor_sdk");
			var _r_max = parseInt(_editorSdk.clientWidth);
			var _b_max = parseInt(_editorSdk.clientHeight);

			_r_max -= 60;
			if ((_r_max - _left) > 50)
			{
				this.debugTexBoxMaxW = _r_max - _left;
			}
			else
			{
				_left                = _r_max - 50;
				this.debugTexBoxMaxW	 = 50;
			}
			_b_max -= 40;
			if ((_b_max - _top) > 50)
			{
				this.debugTexBoxMaxH = _b_max - _top;
			}
			else
			{
				_top				= _b_max - 50;
				this.debugTexBoxMaxH = 50;
			}

			this.HtmlDiv.style.left = _left + "px";
			this.HtmlDiv.style.top  = _top + "px";

			// теперь нужно расчитать ширину/высоту текстбокса
			var _p              = document.createElement('p');
			_p.style.zIndex     = "-1";
			_p.style.position   = "absolute";
			_p.style.fontFamily = "arial";
			_p.style.fontSize   = "12pt";
			_p.style.left       = "0px";
			_p.style.width      = this.debugTexBoxMaxW + "px";

			_editorSdk.appendChild(_p);

			var _t       = this.getAreaValue();
			_t           = _t.replace(/ /g, "&nbsp;");
			_p.innerHTML = "<span>" + _t + "</span>";
			var _width   = _p.firstChild.offsetWidth;
			_width       = Math.min(_width + 20, this.debugTexBoxMaxW);

			if (AscCommon.AscBrowser.isIE)
				_width += 10;

			var area          = document.createElement('textarea');
			area.style.zIndex = "-1";
			area.id           = "area2_id";
			area.rows         = 1;
			area.setAttribute("style", "font-family:arial;font-size:12pt;position:absolute;resize:none;padding:0px;margin:0px;font-weight:normal;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;");
			area.style.overflow = "hidden";
			area.style.width    = _width + "px";
			_editorSdk.appendChild(area);

			area.value = this.getAreaValue();

			var _height = area.clientHeight;
			if (area.scrollHeight > _height)
				_height = area.scrollHeight;

			if (_height > this.debugTexBoxMaxH)
				_height = this.debugTexBoxMaxH;

			_editorSdk.removeChild(_p);
			_editorSdk.removeChild(area);

			this.HtmlDiv.style.width  = _width + "px";
			this.HtmlDiv.style.height = _height + "px";

			// вот такая заглушка под firefox если этого не делать, то будет плохо перерисовываться border)
			var oldZindex                  = parseInt(this.HtmlDiv.style.zIndex);
			var newZindex                  = (oldZindex == 90) ? "89" : "90";
			this.HtmlDiv.style.zIndex = newZindex;
		},

		onInput : function(e)
		{
			if (this.isSystem)
			{
				if (!this.isShow)
					this.show();

				this.debugCalculatePlace(undefined, undefined);
				return;
			}

			ti_console_log("ti: onInput");

			if (AscCommon.AscBrowser.isMozilla)
			{
				if (c_oCompositionState.process == this.compositionState)
				{
					this.checkTargetPosition(false);
				}
			}

			var _value = this.getAreaValue();
			if (!this.KeyDownFlag && c_oCompositionState.end == this.compositionState && !this.TextInputAfterComposition && _value != "")
			{
				ti_console_log("ti: external input");

				this.Api.Begin_CompositeInput();
				this.checkCompositionData(_value);
				this.Api.Replace_CompositeText(this.compositionValue);
				this.Api.End_CompositeInput();
			}

			this.TextInputAfterComposition = false;

			if (this.isChromeKeysNoKeyPressPresent && c_oCompositionState.end == this.compositionState)
			{
				this.Api.Begin_CompositeInput();

				if (this.isChromeKeysNoKeyPressPresentStartValue != "")
				{
					if (0 == _value.indexOf(this.isChromeKeysNoKeyPressPresentStartValue))
						_value = _value.substr(this.isChromeKeysNoKeyPressPresentStartValue.length);
				}

				this.checkCompositionData(_value);
				this.Api.Replace_CompositeText(this.compositionValue);
				this.Api.End_CompositeInput();
			}

			if (this.IsUseInputEventOnlyWithCtx)
			{
				var ctx = e.target["msGetInputContext"]();

				var _start = ctx["compositionStartOffset"];
				var _end = ctx["compositionEndOffset"];

				var bIsComposite = false;
				if (ctx && _end > _start)
					bIsComposite = true;

				if (this.compositionState == c_oCompositionState.end && !bIsComposite)
					return;

				if (this.compositionState == c_oCompositionState.end && bIsComposite)
				{
					this.Api.Begin_CompositeInput();
					console.log("input_start");
				}

				console.log("input: " + _value);

				if (bIsComposite)
					this.compositionState = c_oCompositionState.process;

				if (this.compositionState == c_oCompositionState.process)
				{
					this.ieNonCompositionPrefix = (_start > 0) ? _value.substr(0, _start) : "";
					if (this.ieNonCompositionPrefix != this.ieNonCompositionPrefixConfirm)
					{
						var _newConfirm = this.ieNonCompositionPrefix.substr(this.ieNonCompositionPrefixConfirm.length);

						console.log("input_confirm: " + _newConfirm);

						this.ieNonCompositionPrefixConfirm = this.ieNonCompositionPrefix;

						this.checkCompositionData(_newConfirm);
						this.Api.Replace_CompositeText(this.compositionValue);
						this.Api.End_CompositeInput();

						this.Api.Begin_CompositeInput();
					}

					var _compositionData = _value.substr(_start);

					console.log("input_update: " + _compositionData);

					this.checkCompositionData(_compositionData);
					this.Api.Replace_CompositeText(this.compositionValue);
				}

				if (this.compositionState == c_oCompositionState.process && !bIsComposite)
				{
					this.Api.End_CompositeInput();
					this.compositionState = c_oCompositionState.end;

					console.log("input_end");
				}
			}

			if (c_oCompositionState.end == this.compositionState)
			{
				if (AscCommon.AscBrowser.isChrome && AscCommon.AscBrowser.isLinuxOS)
				{
					// space!!!
					var _code = (_value.length == 1) ? _value.charCodeAt(0) : 0;
					if (_code == 12288 || _code == 32)
					{
						var _e = {
							altKey : false,
							ctrlKey : false,
							shiftKey : false,
							target : null,
							charCode : 0,
							which : 0,
							keyCode : 12288,
							code : "space",

							preventDefault : function() {},
							stopPropagation : function() {}
						};
						this.Api.onKeyDown(_e);
						this.Api.onKeyUp(_e);
					}

					ti_console_log("ti: ea space");
				}

				if (!AscCommon.AscBrowser.isMozilla)
				{
					// у мозиллы есть проблемы, если делать тут clear
					// например на корейском языке - слетает композиция в некоторых случаях
					// (просто набор одного символа несколько раз подряд)
					// поэтому очистку вставляем в текстовый евент.
					// но для хрома есть мега заглушки на IsUseFirstTextInputAfterComposition
					// поэтому разделяем
					this.clear();
				}
			}
		},

		onTextInput : function(e)
		{
			if (this.IsUseFirstTextInputAfterComposition)
			{
				ti_console_log("ti: first textinput after composition");
				this.onCompositionEnd(e);
				this.IsUseFirstTextInputAfterComposition = false;
			}

			if (AscCommon.AscBrowser.isMozilla)
			{
				if (c_oCompositionState.end == this.compositionState)
					this.clear();
			}

			if (AscCommon.AscBrowser.isIeEdge && this.TextInputAfterComposition)
			{
				this.TextInputAfterComposition = false;
				this.clear();
			}
		},

		emulateNativeKeyDown : function(e)
		{
			var oEvent = document.createEvent('KeyboardEvent');

			/*
			 var _event = new KeyboardEvent("keydown", {
			 bubbles : true,
			 cancelable : true,
			 char : e.charCode,
			 shiftKey : e.shiftKey,
			 ctrlKey : e.ctrlKey,
			 metaKey : e.metaKey,
			 altKey : e.altKey,
			 keyCode : e.keyCode,
			 which : e.which,
			 key : e.key
			 });
			 */

			// Chromium Hack
			Object.defineProperty(oEvent, 'keyCode', {
				get : function()
				{
					return this.keyCodeVal;
				}
			});
			Object.defineProperty(oEvent, 'which', {
				get : function()
				{
					return this.keyCodeVal;
				}
			});

			if (AscCommon.AscBrowser.isIE)
			{
				oEvent.preventDefault = function () {
					Object.defineProperty(this, "defaultPrevented", {get: function () {return true;}});
				};
			}

			var k = e.keyCode;
			if (oEvent.initKeyboardEvent)
			{
				oEvent.initKeyboardEvent("keydown", true, true, window, false, false, false, false, k, k);
			}
			else
			{
				oEvent.initKeyEvent("keydown", true, true, window, false, false, false, false, k, 0);
			}

			oEvent.keyCodeVal = k;

			var _elem = _getElementKeyboardDown(this.nativeFocusElement, 3);
			_elem.dispatchEvent(oEvent);

			return oEvent.defaultPrevented;
		},

		isSpaceSymbol : function(e)
		{
			if (e.keyCode == 32)
				return true;

			if ((e.keyCode == 229) && ((e.code == "space") || (e.code == "Space") || (e.key == "Spacebar")))
				return true;

			return false;
		},

		systemInputEnable : function(isEnabled)
		{
			if (this.isSystem == isEnabled)
				return;

			this.isSystem = isEnabled;

			this.putAreaValue("");
			if (this.isShow)
				this.unshow();
		},

		systemConfirmText : function()
		{
			var _value 			= this.getAreaValue();
			var _fontSelections = g_fontApplication.g_fontSelections;
			var _language       = _fontSelections.checkText(_value);

			ti_console_log("ti: detect language - " + _language);

			/*
			 switch (_language)
			 {
			 case LanguagesFontSelectTypes.Arabic:
			 {
			 console.log("arabic");
			 break;
			 }
			 case LanguagesFontSelectTypes.Korean:
			 {
			 console.log("korean");
			 break;
			 }
			 case LanguagesFontSelectTypes.Japan:
			 {
			 console.log("japan");
			 break;
			 }
			 case LanguagesFontSelectTypes.Chinese:
			 {
			 console.log("chinese");
			 break;
			 }
			 case LanguagesFontSelectTypes.Unknown:
			 {
			 console.log("unknown");
			 break;
			 }
			 default:
			 {
			 console.log("error");
			 break;
			 }
			 }*/

			if (_language == AscFonts.LanguagesFontSelectTypes.Unknown || undefined === this.Api.WordControl)
			{
				this.Api.Begin_CompositeInput();
				this.checkCompositionData(_value);
				this.Api.Replace_CompositeText(this.compositionValue);
				this.Api.End_CompositeInput();
			}
			else
			{
				var _textPr = this.Api.WordControl.m_oLogicDocument.Get_Paragraph_TextPr();

				var _check_obj = _fontSelections.checkPasteText(_textPr, _language);
				if (_check_obj.is_async)
				{
					var loader   = AscCommon.g_font_loader;
					var fontinfo = g_fontApplication.GetFontInfo(_check_obj.name);
					var isasync  = loader.LoadFont(fontinfo);
					if (false === isasync)
					{
						var _rfonts = _fontSelections.getSetupRFonts(_check_obj);
						this.Api.WordControl.m_oLogicDocument.TextBox_Put(_value, _rfonts);
					}
					else
					{
						_check_obj.text = _value;
						this.Api.asyncMethodCallback = function() {

							var _fontSelections = g_fontApplication.g_fontSelections;
							var _rfonts = _fontSelections.getSetupRFonts(_check_obj);

							var _api = window['AscCommon'].g_inputContext.Api;
							_api.WordControl.m_oLogicDocument.TextBox_Put(_check_obj.text, _rfonts);
							_api.sync_EndAction(Asc.c_oAscAsyncActionType.BlockInteraction, Asc.c_oAscAsyncAction.LoadFont);
						};

						this.Api.sync_StartAction(Asc.c_oAscAsyncActionType.BlockInteraction, Asc.c_oAscAsyncAction.LoadFont);
					}
				}
				else
				{
					this.Api.Begin_CompositeInput();
					this.checkCompositionData(_value);
					this.Api.Replace_CompositeText(this.compositionValue);
					this.Api.End_CompositeInput();
				}
			}
		},

		onKeyDown : function(e)
		{
			this.isChromeKeysNoKeyPressPresent = false;
			if (this.isSystem && this.isShow)
			{
				// нужно проверить на enter
				// вся остальная обработка - в текстбоксе

				if (e.keyCode == 13)
				{
					this.systemConfirmText();

					this.putAreaValue("");
					this.unshow();

					e.preventDefault();
					return false;
				}
				else if (e.keyCode == 27)
				{
					this.putAreaValue("");
					this.unshow();

					e.preventDefault();
					return false;
				}

				// вся обработка - в текстбоксе
				return;
			}

			if (c_oCompositionState.end != this.compositionState)
			{
				if (this.IsUseFirstTextInputAfterComposition && e.keyCode == 8 || e.keyCode == 46) // del, backspace
				{
					ti_console_log("ti: keydown emulate composition end (del/backspace)");
					this.onCompositionEnd(e, this.getAreaValue());
					this.IsUseFirstTextInputAfterComposition = false;
				}

				return;
			}

			if (null != this.nativeFocusElement)
			{
				if (this.emulateNativeKeyDown(e))
				{
					e.preventDefault();
					return false;
				}
			}

			// некоторые рукописные вводы не присылают keyUp
			var _code = e.keyCode;
			if (_code != 8 && _code != 46)
				this.KeyDownFlag = true;

			if (AscCommon.AscBrowser.isIE && !AscCommon.AscBrowser.isIeEdge)
			{
				if (_code == 13 || this.isSpaceSymbol(e))
				{
					// не даем редактору превентить ничего
					var _e = new CKeyboardEventWrapper(e);
					this.Api.onKeyDown(_e);
					return;
				}
			}

			var _ret = this.Api.onKeyDown(e);
			if (!e.defaultPrevented && (AscCommon.AscBrowser.isIE || AscCommon.AscBrowser.isChrome))
				this.isChromeKeysNoKeyPressPresent = true;
		},

		onKeyPress : function(e)
		{
			this.isChromeKeysNoKeyPressPresent = false;
			if (this.isSystem)
				return;

			if (c_oCompositionState.end != this.compositionState)
				return;

			return this.Api.onKeyPress(e);
		},

		onKeyUp : function(e)
		{
			this.isChromeKeysNoKeyPressPresent = false;
			if (this.isSystem && this.isShow)
				return;

			this.KeyDownFlag = false;

			if (c_oCompositionState.end != this.compositionState)
			{
				if (this.IsUseFirstTextInputAfterComposition && e.keyCode == 8 || e.keyCode == 46) // del, backspace
				{
					ti_console_log("ti: keyup emulate composition end (del/backspace)");
					this.onCompositionEnd(e, this.getAreaValue());
					this.IsUseFirstTextInputAfterComposition = false;

					return;
				}
			}

			if (c_oCompositionState.end == this.compositionState)
				return this.Api.onKeyUp(e);

			if (AscCommon.AscBrowser.isChrome ||
				AscCommon.AscBrowser.isSafari ||
				AscCommon.AscBrowser.isIE)
			{
				this.checkTargetPosition();
			}

			if (this.IsUseFirstTextInputAfterComposition && c_oCompositionState.process == this.compositionState)
			{
				// chrome escape input. empty data and textInput not called

				this.onCompositionEnd(e, "");
				this.IsUseFirstTextInputAfterComposition = false;
			}
		},

		checkTargetPosition : function(isCorrect)
		{
			var _offset = 0;
			if (this.TextArea_Not_ContentEditableDiv)
			{
				_offset = this.HtmlArea.selectionEnd;
			}
			else
			{
				var sel = window.getSelection();
				if (sel.rangeCount > 0)
				{
					var range = sel.getRangeAt(0);
					_offset = range.endOffset;
				}
			}

			if (false !== isCorrect)
			{
				var _value = this.getAreaValue();
				_offset -= (_value.length - this.compositionValue.length);
			}

			if (!this.IsLockTargetMode)
			{
				// никакого смысла прыгать курсором туда-сюда
				if (_offset == 0 && this.compositionValue.length == 1)
					_offset = 1;
			}

			this.Api.Set_CursorPosInCompositeText(_offset);

			this.unlockTarget();
		},

		lockTarget : function()
		{
			if (!this.IsLockTargetMode)
				return;

			if (-1 != this.LockerTargetTimer)
				clearTimeout(this.LockerTargetTimer);

			this.Api.asc_LockTargetUpdate(true);

			var oThis              = this;
			this.LockerTargetTimer = setTimeout(function()
			{
				oThis.unlockTarget();
			}, 1000);
		},

		unlockTarget : function()
		{
			if (!this.IsLockTargetMode)
				return;

			if (-1 != this.LockerTargetTimer)
				clearTimeout(this.LockerTargetTimer);
			this.LockerTargetTimer = -1;

			this.Api.asc_LockTargetUpdate(false);
		},

		onCompositionStart : function(e)
		{
			if (this.IsUseInputEventOnlyWithCtx)
			{
				if (this.compositionState == c_oCompositionState.end)
					this.Api.Begin_CompositeInput();

				this.compositionState = c_oCompositionState.start;
				return;
			}

			if (!AscCommon.AscBrowser.isIE)
				this.isChromeKeysNoKeyPressPresent = false;

			if (this.isSystem)
			{
				this.isChromeKeysNoKeyPressPresent = false;
				return;
			}

			ti_console_log2("begin");
			if (this.compositionState == c_oCompositionState.end)
				this.Api.Begin_CompositeInput();

			this.compositionState = c_oCompositionState.start;

			this.isFirstCompositionUpdateAfterStart = true;

			if (AscCommon.AscBrowser.isIE)
			{
				this.isChromeKeysNoKeyPressPresentStartValue = this.getAreaValue();
			}

			ti_console_log("ti: onCompositionStart");

			if (AscCommon.AscBrowser.isIE && e.target["msGetInputContext"])
			{
				var ctx = e.target["msGetInputContext"]();

				if (undefined != ctx["compositionStartOffset"] && undefined != ctx["compositionEndOffset"] &&
					ctx["compositionEndOffset"] > ctx["compositionStartOffset"])
				{
					// edge: sometimes send start but not sent update
					ti_console_log("ti: onCompositionStart->onCompositionUpdate");
					this.onCompositionUpdate(e);
				}
			}
		},

		onCompositionUpdate : function(e, isLockTarget, _data, isFromEnd)
		{
			if (this.IsUseInputEventOnlyWithCtx)
			{
				return;
			}

			if (!AscCommon.AscBrowser.isIE)
				this.isChromeKeysNoKeyPressPresent = false;
			else if (undefined == isFromEnd)
				this.isChromeKeysNoKeyPressPresent = false;

			if (!this.isChromeKeysNoKeyPressPresent)
				this.isChromeKeysNoKeyPressPresentStartValue = "";

			if (this.isSystem)
			{
				this.isChromeKeysNoKeyPressPresent = false;
				return;
			}

			ti_console_log("ti: onCompositionUpdate: " + e.data);

			var _old = this.compositionValue.splice(0);

			if (_data != null)
			{
				this.checkCompositionData(_data);
			}
			else
			{
				if (!e.target["msGetInputContext"])
				{
					this.checkCompositionData(e.data);
				}
				else
				{
					var ctx = e.target["msGetInputContext"]();

					var _value = this.getAreaValue();

					/*
					 1) 	ie может не присылать onCompositionEnd (например при длительном наборе текста на японском)
					 в этом случае некоторая дата просто просто перестает быть частью композиции. Ее нужно ввести, а композицию продолжить
					 2) 	но, если пришел onCompositionEnd, то нужно запомнить эту дату (которая не в композиции) - но ее не вводить,
					 так как она дублируется (проверить можно на корейском вводе).

					 Поэтому действуем так: применяем дату на onCompositionUpdate, действуем аналогично при onCompositionEnd,
					 только не добавляем дату в редактор. А очищаем только на onInput, когда нет композиции
					 */

					var _offsetData = "";
					if (undefined !== ctx["compositionStartOffset"])
					{
						this.ieNonCompositionPrefix = "";
						if (0 < ctx["compositionStartOffset"])
							this.ieNonCompositionPrefix = _value.substr(0, ctx["compositionStartOffset"]);

						ti_console_log("ti: ieNonCompositionPrefix: " + this.ieNonCompositionPrefix);

						if (this.isFirstCompositionUpdateAfterStart)
						{
							// нельзя очищать текст HtmlArea на onCompositeEnd, так как может блокироваться следующая композиция
							// но тогда может возникать ситуация, когда не сбросилась дата (не пришел onInput не в композиции)
							// поэтому первый текст this.ieNonCompositionPrefix после старта копозиции - считаем введенным
							this.ieNonCompositionPrefixConfirm = this.ieNonCompositionPrefix;
							ti_console_log("ti: ieNonCompositionPrefixConfirm1: " + this.ieNonCompositionPrefixConfirm);
						}

						if (ctx["compositionEndOffset"] > ctx["compositionStartOffset"])
						{
							_offsetData = _value.substr(ctx["compositionStartOffset"], ctx["compositionEndOffset"] - ctx["compositionStartOffset"]);
							ti_console_log("ti: msContext offsetData: " + _offsetData);
						}
						/*
						if (AscCommon.AscBrowser.isIeEdge && isFromEnd && _offsetData == "")
						{
							if (_value != (this.ieNonCompositionPrefixConfirm + e.data))
								return;
						}
						*/

						if (this.ieNonCompositionPrefix != this.ieNonCompositionPrefixConfirm)
						{
							var _newConfirm = this.ieNonCompositionPrefix.substr(this.ieNonCompositionPrefixConfirm.length);

							this.ieNonCompositionPrefixConfirm = this.ieNonCompositionPrefix;
							ti_console_log("ti: ieNonCompositionPrefixConfirm2: " + this.ieNonCompositionPrefixConfirm);

							if (true !== isFromEnd || _offsetData != "")
							{
								ti_console_log("ti: emulateCompositeConfirm: " + _newConfirm);

								this.checkCompositionData(_newConfirm);
								ti_console_log2("replace: " + this.compositionValue);
								this.Api.Replace_CompositeText(this.compositionValue);
								ti_console_log2("end");
								this.Api.End_CompositeInput();

								ti_console_log2("begin");
								this.Api.Begin_CompositeInput();
							}
						}
					}

					if (AscCommon.AscBrowser.isIE && e.data == "")
						this.checkCompositionData(_offsetData);
					else
						this.checkCompositionData(e.data);
				}
			}

			var _isEqualLen = (_old.length == this.compositionValue.length);
			var _isEqual    = _isEqualLen;
			if (_isEqual)
			{
				var _len = this.compositionValue.length;
				for (var i = 0; i < _len; i++)
				{
					if (_old[i] != this.compositionValue[i])
					{
						_isEqual = false;
						break;
					}
				}
			}

			if (isLockTarget !== false)
				this.lockTarget();

			var _isNeedSavePos = !this.IsLockTargetMode;
			if (!_isEqual)
			{
				var _old = 0;
				var _max = 0;
				if (_isNeedSavePos)
				{
					_old = this.Api.Get_CursorPosInCompositeText();
					_max = this.Api.Get_MaxCursorPosInCompositeText();
				}
				ti_console_log2("replace: " + this.compositionValue);
				this.Api.Replace_CompositeText(this.compositionValue);
				if (_isNeedSavePos)
				{
					if (_old != _max)
						this.Api.Set_CursorPosInCompositeText(_old);
				}
			}

			this.compositionState = c_oCompositionState.process;
			this.isFirstCompositionUpdateAfterStart = false;
		},

		isWaitFirstTextInputEvent : function(e)
		{
			if (e.data === undefined || e.data === null)
				return true;

			if (AscCommon.AscBrowser.isChrome/* && AscCommon.AscBrowser.isLinuxOS*/ && e.data == "")
				return true;

			return false;
		},

		onCompositionEnd : function(e, _data)
		{
			if (this.IsUseInputEventOnlyWithCtx)
			{
				if (AscCommon.AscBrowser.isIE && e.target["msGetInputContext"])
				{
					var ctx = e.target["msGetInputContext"]();

					if (ctx["compositionStartOffset"] == ctx["compositionEndOffset"])
					{
						if (e.data == "")
							this.Api.Replace_CompositeText([]);

						this.Api.End_CompositeInput();

						this.unlockTarget();
						this.TextInputAfterComposition = true;
					}
				}

				return;
			}

			if (!AscCommon.AscBrowser.isIE)
				this.isChromeKeysNoKeyPressPresent = false;

			if (this.isSystem)
			{
				this.isChromeKeysNoKeyPressPresent = false;
				return;
			}

			ti_console_log("ti: onCompositionEnd");

			if (!this.IsUseFirstTextInputAfterComposition && this.isWaitFirstTextInputEvent(e))
			{
				// always data == ""
				this.IsUseFirstTextInputAfterComposition = true;
				return;
			}

			ti_console_log("ti: onCompositionEnd -> onCompositionUpdate");
			this.onCompositionUpdate(e, false, _data, true);
			this.Api.Set_CursorPosInCompositeText(1000); // max

			this.clear(true);
			ti_console_log2("end");

			if (AscCommon.AscBrowser.isIE && e.target["msGetInputContext"])
			{
				var ctx = e.target["msGetInputContext"]();

				if (undefined != ctx["compositionStartOffset"] && undefined != ctx["compositionEndOffset"] &&
					ctx["compositionEndOffset"] > ctx["compositionStartOffset"])
				{
					// edge: не натуральный end!!!
					this.compositionState = c_oCompositionState.process;
					this.isChromeKeysNoKeyPressPresent = false;
					return;
				}
				else
				{
					this.Api.End_CompositeInput();
				}
			}
			else
			{
				this.Api.End_CompositeInput();
			}

			this.Api.End_CompositeInput();

			this.unlockTarget();
			this.TextInputAfterComposition = true;
		},

		checkCompositionData : function(data)
		{
			this.compositionValue = [];
			var _length           = (data != null) ? data.length : 0;
			for (var i = 0; i < _length; i++)
			{
				var _code = data.charCodeAt(i);
				if ((_code < 0xD800 || _code >= 0xDC00) || i >= (_length - 1))
					this.compositionValue.push(_code);
				else
				{
					i++;
					var _code2 = data.charCodeAt(i);
					if (_code2 < 0xDC00 || _code2 >= 0xDFFF)
					{
						this.compositionValue.push(_code);
						this.compositionValue.push(_code2);
					}
					else
					{
						this.compositionValue.push(((_code & 0x3FF) << 10) | (_code2 & 0x3FF));
					}
				}
			}
		},

		setInterfaceEnableKeyEvents : function(value)
		{
			this.InterfaceEnableKeyEvents = value;
			if (true == this.InterfaceEnableKeyEvents)
			{
				this.HtmlArea.focus();
			}
		},

		externalEndCompositeInput : function()
		{

		}
	};

	function _getAttirbute(_elem, _attr, _depth)
	{
		var _elemTest = _elem;
		for (var _level = 0; _elemTest && (_level < _depth); ++_level, _elemTest = _elemTest.parentNode)
		{
			var _res = _elemTest.getAttribute ? _elemTest.getAttribute(_attr) : null;
			if (null != _res)
				return _res;
		}
		return null;
	}
	function _getElementKeyboardDown(_elem, _depth)
	{
		var _elemTest = _elem;
		for (var _level = 0; _elemTest && (_level < _depth); ++_level, _elemTest = _elemTest.parentNode)
		{
			var _res = _elemTest.getAttribute ? _elemTest.getAttribute("oo_editor_keyboard") : null;
			if (null != _res)
				return _elemTest;
		}
		return null;
	}
	function _getDefaultKeyboardInput(_elem, _depth)
	{
		var _elemTest = _elem;
		for (var _level = 0; _elemTest && (_level < _depth); ++_level, _elemTest = _elemTest.parentNode)
		{
			var _name = " " + _elemTest.className + " ";
			if (_name.indexOf(" dropdown-menu" ) > -1 ||
				_name.indexOf(" dropdown-toggle ") > -1 ||
				_name.indexOf(" dropdown-submenu ") > -1 ||
				_name.indexOf(" canfocused ") > -1)
			{
				return "true";
			}
		}
		return null;
	}

	window['AscCommon']            = window['AscCommon'] || {};
	window['AscCommon'].CTextInput = CTextInput;

	window['AscCommon'].InitBrowserInputContext = function(api, target_id)
	{
		if (window['AscCommon'].g_inputContext)
			return;

		window['AscCommon'].g_inputContext = new CTextInput(api);
		window['AscCommon'].g_inputContext.init(target_id);
		window['AscCommon'].g_clipboardBase.Init(api);
		window['AscCommon'].g_clipboardBase.inputContext = window['AscCommon'].g_inputContext;

		if (window['AscCommon'].TextBoxInputMode === true)
		{
			window['AscCommon'].g_inputContext.systemInputEnable(true);
		}

		document.addEventListener("focus", function(e)
		{
			var t                = window['AscCommon'].g_inputContext;
			var _oldNativeFE	 = t.nativeFocusElement;
			t.nativeFocusElement = e.target;

			//console.log(t.nativeFocusElement);

			var _nativeFocusElementNoRemoveOnElementFocus = t.nativeFocusElementNoRemoveOnElementFocus;
			t.nativeFocusElementNoRemoveOnElementFocus = false;

			if (t.InterfaceEnableKeyEvents == false)
			{
				t.nativeFocusElement = null;
				return;
			}

			if (t.nativeFocusElement.id == t.HtmlArea.id)
			{
				t.Api.asc_enableKeyEvents(true, true);

				if (_nativeFocusElementNoRemoveOnElementFocus)
					t.nativeFocusElement = _oldNativeFE;
				else
					t.nativeFocusElement = null;

				return;
			}
			if (t.nativeFocusElement.id == window['AscCommon'].g_clipboardBase.CommonDivId)
			{
				t.nativeFocusElement = null;
				return;
			}

			t.nativeFocusElementNoRemoveOnElementFocus = false;

			var _isElementEditable = false;
			if (true)
			{
				// detect _isElementEditable
				var _name = t.nativeFocusElement.nodeName;
				if (_name)
					_name = _name.toUpperCase();

				if ("INPUT" == _name || "TEXTAREA" == _name)
					_isElementEditable = true;
				else if ("DIV" == _name)
				{
					if (t.nativeFocusElement.getAttribute("contenteditable") == "true")
						_isElementEditable = true;
				}
			}
			if ("IFRAME" == _name)
			{
				// перехват клавиатуры
				t.Api.asc_enableKeyEvents(false, true);
				t.nativeFocusElement = null;
				return;
			}

			// перехватывает ли элемент ввод
			var _oo_editor_input    = _getAttirbute(t.nativeFocusElement, "oo_editor_input", 3);
			// нужно ли прокидывать нажатие клавиш элементу (ТОЛЬКО keyDown)
			var _oo_editor_keyboard = _getAttirbute(t.nativeFocusElement, "oo_editor_keyboard", 3);

			if (!_oo_editor_input && !_oo_editor_keyboard)
				_oo_editor_input = _getDefaultKeyboardInput(t.nativeFocusElement, 3);

			if (_oo_editor_keyboard == "true")
				_oo_editor_input = undefined;

			if (_oo_editor_input == "true")
			{
				// перехват клавиатуры
				t.Api.asc_enableKeyEvents(false, true);
				t.nativeFocusElement = null;
				return;
			}

			if (_isElementEditable && (_oo_editor_input != "false"))
			{
				// перехват клавиатуры
				t.Api.asc_enableKeyEvents(false, true);
				t.nativeFocusElement = null;
				return;
			}

			// итак, ввод у нас. теперь определяем, нужна ли клавиатура элементу
			if (_oo_editor_keyboard != "true")
				t.nativeFocusElement = null;

			var _elem = t.nativeFocusElement;
			t.nativeFocusElementNoRemoveOnElementFocus = true; // ie focus async
			t.HtmlArea.focus();
			t.nativeFocusElement = _elem;
			t.Api.asc_enableKeyEvents(true, true);

		}, true);

		// send focus
		window['AscCommon'].g_inputContext.HtmlArea.focus();
	};

	window["SetInputDebugMode"] = function()
	{
		if (!window['AscCommon'].g_inputContext)
			return;

		window['AscCommon'].g_inputContext.isDebug = true;
		window['AscCommon'].g_inputContext.show();
	};
})(window);
