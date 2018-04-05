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

(function(window, undefined)
{
	window["AscInputMethod"] = window["AscInputMethod"] || {};
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

	function CTextInput(api)
	{
		this.Api = api;

		this.TargetId = null;			// id caret
		this.HtmlDiv  = null;			// для незаметной реализации одной textarea недостаточно

		this.TextArea_Not_ContentEditableDiv = true;
		this.HtmlArea = null;

		this.HtmlAreaOffset = 50; // height in pix
		this.HtmlAreaWidth = 200;

		this.LockerTargetTimer = -1;

		this.KeyDownFlag               = false;
		this.KeyPressFlag 			   = false;

		this.IsLockTargetMode = false;

		this.nativeFocusElement = null;
		this.nativeFocusElementNoRemoveOnElementFocus = false;
		this.InterfaceEnableKeyEvents = true;

		this.debugTexBoxMaxW = 100;
		this.debugTexBoxMaxH = 20;
		this.isDebug 	= false;
		this.isSystem 	= false;
		this.isShow		= false;

		// chrome element for left/top
		this.FixedPosCheckElementX = 0;
		this.FixedPosCheckElementY = 0;

		this.virtualKeyboardClickTimeout = -1;
		this.virtualKeyboardClickPrevent = false;

		// current text info
		this.TextBeforeComposition = "";
		this.Text = "";
		this.Target = 0;
		this.CompositionStart = 0;
		this.CompositionEnd = 0;

		this.IsComposition = false;
		this.ApiIsComposition = false;

		// Notes offset for slides
		this.TargetOffsetY = 0;

		// editor_sdk div sizes (for visible textarea)
		this.editorSdkW = 0;
		this.editorSdkH = 0;

		this.ReadOnlyCounter = 0;

		this.LastReplaceText = [];
		this.IsLastReplaceFlag = false;
	}

	CTextInput.prototype =
	{
		log : function(_val)
		{
			//console.log(_val);
		},

		init : function(target_id, parent_id)
		{
			this.TargetId   = target_id;

			var oHtmlParent = null;

			var oHtmlTarget = document.getElementById(this.TargetId);
			if (undefined == parent_id)
				oHtmlParent = oHtmlTarget.parentNode;
			else
				oHtmlParent = document.getElementById(parent_id);

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

			var _style = ("left:-" + (this.HtmlAreaWidth >> 1) + "px;top:" + (-this.HtmlAreaOffset) + "px;");
			_style += ("background:transparent;border:none;position:absolute;text-shadow:0 0 0 #000;outline:none;color:transparent;width:" + this.HtmlAreaWidth + "px;height:50px;");
			_style += "overflow:hidden;padding:0px;margin:0px;font-family:arial;font-size:10pt;resize:none;font-weight:normal;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;";
			this.HtmlArea.setAttribute("style", _style);
			this.HtmlArea.setAttribute("spellcheck", false);

			this.HtmlArea.setAttribute("autocapitalize", "none");
            this.HtmlArea.setAttribute("autocomplete", "off");
            this.HtmlArea.setAttribute("autocorrect", "off");

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
			    if (AscCommon.AscBrowser.isSafariMacOs)
                {
                    var cmdButton = (e.ctrlKey || e.metaKey) ? true : false;
                    var buttonCode = ((e.keyCode == 67) || (e.keyCode == 88) || (e.keyCode == 86));
                    if (cmdButton && buttonCode)
                        oThis.IsDisableKeyPress = true;
                    else
                        oThis.IsDisableKeyPress = false;
                }
				return oThis.onKeyDown(e);
			};
			this.HtmlArea["onkeypress"] = function(e)
			{
			    if (oThis.IsDisableKeyPress == true)
			    {
			        // macOS Sierra send keypress before copy event
			        oThis.IsDisableKeyPress = false;
			        var cmdButton = (e.ctrlKey || e.metaKey) ? true : false;
			        if (cmdButton)
                        return;
			    }
				return oThis.onKeyPress(e);
			};
			this.HtmlArea["onkeyup"]    = function(e)
			{
			    oThis.IsDisableKeyPress = false;
				return oThis.onKeyUp(e);
			};

			this.HtmlArea.addEventListener("input", function(e)
			{
				return oThis.onInput(e);
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

			this.Api.Input_UpdatePos();

			if (AscCommon.AscBrowser.isAndroid)
			{
				this.HtmlArea.onclick = function (e)
				{
					var _this = AscCommon.g_inputContext;

					if (-1 != _this.virtualKeyboardClickTimeout)
					{
						clearTimeout(_this.virtualKeyboardClickTimeout);
						_this.virtualKeyboardClickTimeout = -1;
					}

					if (!_this.virtualKeyboardClickPrevent)
						return;

					_this.HtmlArea.readOnly = true;
					_this.virtualKeyboardClickPrevent = false;
					AscCommon.stopEvent(e);
					_this.virtualKeyboardClickTimeout = setTimeout(function ()
					{
						_this.HtmlArea.readOnly = false;
						_this.virtualKeyboardClickTimeout = -1;
					}, 1);
					return false;
				};
			}
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

			if (this.Api.isMobileVersion)
			{
			    var _elem1 = document.getElementById("area_id_parent");
			    var _elem2 = document.getElementById("area_id");

			    _elem1.parentNode.style.pointerEvents = "";


                _elem1.style.left = "-100px";
			    _elem1.style.top = "-100px";
			    _elem1.style.right = "-100px";
			    _elem1.style.bottom = "-100px";
			    _elem1.style.width = "auto";
                _elem1.style.height = "auto";

			    _elem2.style.left = "0px";
                _elem2.style.top = "0px";
                _elem2.style.right = "0px";
                _elem2.style.bottom = "0px";
                _elem2.style.width = "100%";
                _elem2.style.height = "100%";

                if (AscCommon.AscBrowser.isIE)
				{
					document.body.style["msTouchAction"] = "none";
					document.body.style["touchAction"] = "none";
				}
			}

			var _editorSdk = document.getElementById("editor_sdk");
			this.editorSdkW = _editorSdk.clientWidth;
			this.editorSdkH = _editorSdk.clientHeight;
		},

		checkFocus : function()
		{
			if (this.Api.asc_IsFocus() && !AscCommon.g_clipboardBase.IsFocus() && !AscCommon.g_clipboardBase.IsWorking())
			{
				if (document.activeElement != this.HtmlArea)
					this.HtmlArea.focus();
			}
		},

		move : function(x, y)
		{
		    if (this.Api.isMobileVersion)
		        return;

			var oTarget = document.getElementById(this.TargetId);
			var xPos    = x ? x : parseInt(oTarget.style.left);
			var yPos    = (y ? y : parseInt(oTarget.style.top)) + parseInt(oTarget.style.height);

            if (AscCommon.AscBrowser.isSafari && AscCommon.AscBrowser.isMobile)
                xPos = -100;

			if (!this.isDebug && !this.isSystem)
			{
				this.HtmlDiv.style.left = xPos + this.FixedPosCheckElementX + "px";
				this.HtmlDiv.style.top  = yPos + this.FixedPosCheckElementY + this.TargetOffsetY + this.HtmlAreaOffset + "px";

				this.HtmlArea.scrollTop = this.HtmlArea.scrollHeight;
				//this.log("" + this.HtmlArea.scrollTop + ", " + this.HtmlArea.scrollHeight);
			}
			else
			{
				// this.HtmlAreaOffset - не сдвигаем, курсор должен быть виден
				this.debugCalculatePlace(xPos + this.FixedPosCheckElementX, yPos + this.FixedPosCheckElementY + this.TargetOffsetY);
			}
		},

		emulateKeyDownApi : function(code)
		{
			var _e = {
				altKey : false,
				ctrlKey : false,
				shiftKey : false,
				target : null,
				charCode : 0,
				which : 0,
				keyCode : code,
				code : "",

				preventDefault : function() {},
				stopPropagation : function() {}
			};

			this.Api.onKeyDown(_e);
			this.Api.onKeyUp(_e);
		},

		clear : function(isFromFocus)
		{
			if (!this.TextArea_Not_ContentEditableDiv)
			{
				this.HtmlArea.innerHTML = "";
			}
			else
			{
				this.HtmlArea.value = "";
			}

			if (isFromFocus !== true)
				this.HtmlArea.focus();

			this.TextBeforeComposition = "";
			this.Text = "";
			this.Target = 0;
			this.CompositionStart = 0;
			this.CompositionEnd = 0;
			this.IsComposition = false;
		},

		getAreaValue : function()
		{
			return this.TextArea_Not_ContentEditableDiv ? this.HtmlArea.value : this.HtmlArea.innerText;
		},

		setReadOnly : function(isLock)
		{
			if (isLock)
				this.ReadOnlyCounter++;
			else
				this.ReadOnlyCounter--;

			if (0 > this.ReadOnlyCounter)
				this.ReadOnlyCounter = 0;

			this.HtmlArea.readOnly = (0 == this.ReadOnlyCounter) ? false : true;
		},

		show : function()
		{
			if (this.isDebug || this.isSystem)
			{
				this.log("ti: show");

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

		unshow : function(isAttack)
		{
			if (this.isDebug || this.isSystem || (true == isAttack))
			{
				this.log("ti: unshow");

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

			var _r_max = this.editorSdkW;
			var _b_max = this.editorSdkH;

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

			if (AscCommon.AscBrowser.isSafari && AscCommon.AscBrowser.isMobile)
			    _left = -100;

			this.HtmlDiv.style.left = _left + "px";
			this.HtmlDiv.style.top  = _top + "px";

			var _height = 22;
			var _t = this.getAreaValue();

			if (0 != _t.length)
			{
				var _editorSdk = document.getElementById("editor_sdk");

				// теперь нужно расчитать ширину/высоту текстбокса
				var _p = document.createElement('p');
				_p.style.zIndex = "-1";
				_p.style.position = "absolute";
				_p.style.fontFamily = "arial";
				_p.style.fontSize = "12pt";
				_p.style.left = "0px";
				_p.style.width = this.debugTexBoxMaxW + "px";

				_editorSdk.appendChild(_p);

				_t = _t.replace(/ /g, "&nbsp;");
				_p.innerHTML = "<span>" + _t + "</span>";
				var _width = _p.firstChild.offsetWidth;
				_width = Math.min(_width + 20, this.debugTexBoxMaxW);

				if (AscCommon.AscBrowser.isIE)
					_width += 10;

				var area = document.createElement('textarea');
				area.style.zIndex = "-1";
				area.id = "area2_id";
				area.rows = 1;
				area.setAttribute("style", "font-family:arial;font-size:12pt;position:absolute;resize:none;padding:0px;margin:0px;font-weight:normal;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;");
				area.style.overflow = "hidden";
				area.style.width = _width + "px";
				_editorSdk.appendChild(area);

				area.value = this.getAreaValue();

				_height = area.clientHeight;
				if (area.scrollHeight > _height)
					_height = area.scrollHeight;

				_editorSdk.removeChild(_p);
				_editorSdk.removeChild(area);
			}

			if (_height > this.debugTexBoxMaxH)
				_height = this.debugTexBoxMaxH;

			this.HtmlDiv.style.width  = _width + "px";
			this.HtmlDiv.style.height = _height + "px";

			// вот такая заглушка под firefox если этого не делать, то будет плохо перерисовываться border)
			var oldZindex                  = parseInt(this.HtmlDiv.style.zIndex);
			var newZindex                  = (oldZindex == 90) ? "89" : "90";
			this.HtmlDiv.style.zIndex = newZindex;
		},

		onInput : function(e, isFromCompositionUpdate)
		{
			if (this.Api.isLongAction())
			{
				AscCommon.stopEvent(e);
				return false;
			}

			if (this.isSystem)
			{
				if (!this.isShow)
					this.show();

				this.debugCalculatePlace(undefined, undefined);
				return;
			}

			this.log("ti: onInput");

			// current text value
			this.Text = this.getAreaValue();
			this.Text = this.Text.split("&nbsp;").join(" ");

			var codes = [];
			if (this.IsComposition || this.ApiIsComposition)
			{
				var ieStart = -1;
				var ieEnd = -1;

				if (true)
				{
					var target = e.target;
					if (target["msGetInputContext"])
					{
						var ctx = target["msGetInputContext"]();

						if (ctx)
						{
							ieStart = ctx["compositionStartOffset"];
							ieEnd = ctx["compositionEndOffset"];
						}
					}
				}

				this.CompositionEnd = this.Text.length;
				this.CompositionStart = this.TextBeforeComposition.length;

				var textReplace = this.Text.substr(this.CompositionStart);
				var iter;
				for (iter = textReplace.getUnicodeIterator(); iter.check(); iter.next())
				{
					codes.push(iter.value());
				}

				var isAsync = AscFonts.FontPickerByCharacter.checkTextLight(codes, true);

				if (!isAsync)
				{
					// ie/edge могут не присылать onCompositeEnd. И тогда ориентир - дополнительный селект
					if (ieStart > this.CompositionStart)
					{
						textReplace = textReplace.substr(0, ieStart - this.CompositionStart);

						codes = [];
						for (iter = textReplace.getUnicodeIterator(); iter.check(); iter.next())
						{
							codes.push(iter.value());
						}

						this.apiCompositeReplace(codes);
						this.apiCompositeEnd();

						this.TextBeforeComposition = this.Text.substr(0, ieStart);

						this.apiCompositeStart();
						this.CompositionStart = ieStart;

						codes = [];
						textReplace = this.Text.substr(this.CompositionStart);
						for (iter = textReplace.getUnicodeIterator(); iter.check(); iter.next())
						{
							codes.push(iter.value());
						}

						this.apiCompositeReplace(codes);
					}
					else
					{
						this.apiCompositeReplace(codes);
					}

					if (!this.IsComposition)
					{
						this.apiCompositeEnd();
						this.TextBeforeComposition = this.Text;
					}
				}
				else
				{
					AscFonts.FontPickerByCharacter.loadFonts(this, function ()
					{

						this.apiCompositeReplace(codes);
						this.apiCompositeEnd();

						this.clear();
						this.setReadOnly(false);

					});

					AscCommon.stopEvent(e);
					this.setReadOnly(true);
					return false;
				}
			}
			else
			{
				var textToApi = this.Text.substr(this.TextBeforeComposition.length);
				for (var iter = textToApi.getUnicodeIterator(); iter.check(); iter.next())
				{
					codes.push(iter.value());
				}

				this.apiInputText(codes);
				this.TextBeforeComposition = this.Text;
			}

			if (!this.IsComposition)
			{
				if (this.Text.length > 0)
				{
					var _lastCode = this.Text.charCodeAt(this.Text.length - 1);
					if (_lastCode == 12290 || _lastCode == 46)
					{
						// китайская точка
						AscCommon.stopEvent(e);
						this.clear();
						return false;
					}
				}
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
			Object.defineProperty(oEvent, 'shiftKey', {
				get : function()
				{
					return this.shiftKeyVal;
				}
			});
			Object.defineProperty(oEvent, 'altKey', {
				get : function()
				{
					return this.altKeyVal;
				}
			});
			Object.defineProperty(oEvent, 'metaKey', {
				get : function()
				{
					return this.metaKeyVal;
				}
			});
			Object.defineProperty(oEvent, 'ctrlKey', {
				get : function()
				{
					return this.ctrlKeyVal;
				}
			});

			if (AscCommon.AscBrowser.isIE)
			{
				oEvent.preventDefault = function ()
				{
					try
					{
						Object.defineProperty(this, "defaultPrevented", {
							get: function ()
							{
								return true;
							}
						});
					}
					catch(err)
					{
					}
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
			oEvent.shiftKeyVal = e.shiftKey;
			oEvent.altKeyVal = e.altKey;
			oEvent.metaKeyVal = e.metaKey;
			oEvent.ctrlKeyVal = e.ctrlKey;

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

			this.HtmlArea.style.left = this.isSystem ? "0px" : ("-" + (this.HtmlAreaWidth >> 1) + "px");

			this.clear();
			if (this.isShow)
				this.unshow(true);

			if (this.Api.WordControl && this.Api.WordControl.m_oLogicDocument && this.Api.WordControl.m_oLogicDocument.Document_UpdateSelectionState)
				this.Api.WordControl.m_oLogicDocument.Document_UpdateSelectionState();
		},

		debugInputEnable : function(isEnabled)
		{
			if (this.isDebug == isEnabled)
				return;

			this.isDebug = isEnabled;
			this.HtmlArea.style.left = this.isDebug ? "0px" : ("-" + (this.HtmlAreaWidth >> 1) + "px");
		},

		apiInputText : function(codes)
		{
			var isAsync = AscFonts.FontPickerByCharacter.checkTextLight(codes, true);

			if (!isAsync)
			{
				this.apiCompositeStart();
				this.apiCompositeReplace(codes);
				this.apiCompositeEnd();
			}
			else
			{
				AscFonts.FontPickerByCharacter.loadFonts(this, function ()
				{

					this.apiCompositeStart();
					this.apiCompositeReplace(codes);
					this.apiCompositeEnd();

					this.setReadOnly(false);

				});

				this.setReadOnly(true);
				return false;
			}
		},

		onKeyDown : function(e)
		{
			if (this.Api.isLongAction())
			{
				AscCommon.stopEvent(e);
				return false;
			}

			if (this.isSystem && this.isShow)
			{
				// нужно проверить на enter
				// вся остальная обработка - в текстбоксе

				if (e.keyCode == 13)
				{
					var text = this.getAreaValue();
					var codes = [];
					for (var iter = text.getUnicodeIterator(); iter.check(); iter.next())
					{
						codes.push(iter.value());
					}

					this.apiInputText(codes);

					this.clear();
					this.unshow();

					AscCommon.stopEvent(e);
					return false;
				}
				else if (e.keyCode == 27)
				{
					this.clear();
					this.unshow();

					AscCommon.stopEvent(e);
					return false;
				}

				// вся обработка - в текстбоксе
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

			AscCommon.check_KeyboardEvent(e);
			var arrCodes = this.Api.getAddedTextOnKeyDown(AscCommon.global_keyboardEvent);

			var isAsync = AscFonts.FontPickerByCharacter.checkTextLight(arrCodes, true);

			if (isAsync)
			{
				AscFonts.FontPickerByCharacter.loadFonts(this, function ()
				{

					this.onKeyDown(e);
					this.onKeyUp(e);

					this.setReadOnly(false);

				});

				AscCommon.stopEvent(e);
				this.setReadOnly(true);
				return false;
			}

			var ret = this.Api.onKeyDown(e);

			switch (e.keyCode)
			{
				case 8:		// backspace
				case 9:		// tab
				case 13:	// enter
				case 37:	// left
				case 38:	// top
				case 39:	// right
				case 40:	// bottom
				case 33: 	// pageup
				case 34: 	// pagedown
				case 35: 	// end
				case 36: 	// home
				{
					this.clear();
					return false;
				}
				case 46:	// delete
				case 45:	// insert
				{
					if (!AscCommon.global_keyboardEvent.CtrlKey && !AscCommon.global_keyboardEvent.ShiftKey) // copy/cut/paste
					{
						// заканчиваем "непрерывный" ввод => очищаем текстбокс
						this.clear();
						return false;
					}
				}
				default:
					break;
			}

			return ret;
		},

		onKeyPress : function(e)
		{
			if (this.Api.isLongAction() || !this.Api.asc_IsFocus())
			{
				AscCommon.stopEvent(e);
				return false;
			}

			if (this.isSystem)
				return;

			if (this.KeyDownFlag)
				this.KeyPressFlag = true;

			if (this.IsComposition)
				return;

			if ((e.which == 13 && e.keyCode == 13) || (e.which == 10 && e.keyCode == 10))
			{
				AscCommon.stopEvent(e);
				return false;
			}

            var c = e.which || e.keyCode;

			var isAsync = AscFonts.FontPickerByCharacter.checkTextLight([c], true);

			if (isAsync)
			{
				AscFonts.FontPickerByCharacter.loadFonts(this, function ()
				{

					this.apiCompositeStart();
					this.apiCompositeReplace([c]);
					this.apiCompositeEnd();

					this.setReadOnly(false);

				});

				AscCommon.stopEvent(e);
				this.setReadOnly(true);
				return false;
			}

			var ret = this.Api.onKeyPress(e);

			switch (e.which)
			{
				case 46:
				{
					AscCommon.stopEvent(e);
					this.clear();
					return false;
				}
				default:
					break;
			}

			AscCommon.stopEvent(e);
			return ret;
		},

		onKeyUp : function(e)
		{
			if (this.Api.isLongAction())
			{
				AscCommon.stopEvent(e);
				return false;
			}

			if (this.isSystem && this.isShow)
				return;

			this.KeyDownFlag = false;
			this.KeyPressFlag = false;

			AscCommon.global_keyboardEvent.Up();
		},

		getAreaPos : function()
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
			return _offset;
		},

		checkTargetPosition : function(isCorrect)
		{
			var _offset = this.getAreaPos();

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

		clearLastCompositeText : function()
		{
			this.LastReplaceText = [];
			this.IsLastReplaceFlag = false;
		},

		apiCompositeStart : function()
		{
		},

		apiCompositeReplace : function(_value)
		{
			if (this.Api.isLongAction())
			{
				AscCommon.stopEvent(e);
				return false;
			}

			if (!this.ApiIsComposition)
			{
				this.Api.Begin_CompositeInput();
				this.clearLastCompositeText();
			}

            this.ApiIsComposition = true;

			if (this.IsLastReplaceFlag)
			{
				// check _value == this.LastReplaceText
				if (_value.length == this.LastReplaceText.length)
				{
					var isEqual = true;
					for (var nC = 0; nC < _value.length; nC++)
					{
						if (_value[nC] != this.LastReplaceText[nC])
						{
							isEqual = false;
							break;
						}
					}

					if (isEqual)
						return; // не посылаем одинаковые замены!
				}
			}

            this.Api.Replace_CompositeText(_value);

			this.LastReplaceText = _value.slice();
			this.IsLastReplaceFlag = true;
		},

		apiCompositeEnd : function()
		{
			if (!this.ApiIsComposition)
				return;

			this.ApiIsComposition = false;
			this.Api.End_CompositeInput();
			this.clearLastCompositeText();
		},

		onCompositionStart : function(e)
		{
			if (this.isSystem)
				return;

			this.IsComposition = true;
		},

		onCompositionUpdate : function(e)
		{
			if (this.isSystem)
				return;

			this.IsComposition = true;
			this.onInput(e, true);
		},

		onCompositionEnd : function(e)
		{
			if (this.isSystem)
				return;

			this.IsComposition = false;

			this.onInput(e, true);
		},

		setInterfaceEnableKeyEvents : function(value)
		{
			this.InterfaceEnableKeyEvents = value;
			if (true == this.InterfaceEnableKeyEvents)
			{
			    if (document.activeElement)
			    {
			        var _id = document.activeElement.id;
			        if (_id == "area_id" || (window.g_asc_plugins && window.g_asc_plugins.checkRunnedFrameId(_id)))
			            return;
			    }

				this.HtmlArea.focus();
			}
		},

		externalEndCompositeInput : function()
		{
			this.clear();
		},

		externalChangeFocus : function()
		{
			if (!this.IsComposition)
				return false;

			setTimeout(function() {
				window['AscCommon'].g_inputContext.clear();
			}, 10);

			return true;
		},

		isCompositionProcess : function()
		{
			return this.IsComposition;
		},

		preventVirtualKeyboard : function(e)
		{
			//AscCommon.stopEvent(e);

			if (AscCommon.AscBrowser.isAndroid)
			{
				this.virtualKeyboardClickPrevent = true;
			}
		},

		enableVirtualKeyboard : function()
		{
			if (AscCommon.AscBrowser.isAndroid)
			{
				if (-1 != this.virtualKeyboardClickTimeout)
				{
					clearTimeout(this.virtualKeyboardClickTimeout);
					this.virtualKeyboardClickTimeout = -1;
				}

				this.virtualKeyboardClickPrevent = false;
			}
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

	window['AscCommon'].InitBrowserInputContext = function(api, target_id, parent_id)
	{
		if (window['AscCommon'].g_inputContext)
			return;

		window['AscCommon'].g_inputContext = new CTextInput(api);
		window['AscCommon'].g_inputContext.init(target_id, parent_id);
		window['AscCommon'].g_clipboardBase.Init(api);
		window['AscCommon'].g_clipboardBase.inputContext = window['AscCommon'].g_inputContext;

		if (window['AscCommon'].TextBoxInputMode === true)
		{
			window['AscCommon'].g_inputContext.systemInputEnable(true);
		}

		//window["SetInputDebugMode"]();

		document.addEventListener("focus", function(e)
		{
			var t                = window['AscCommon'].g_inputContext;
			var _oldNativeFE	 = t.nativeFocusElement;
			t.nativeFocusElement = e.target;

			if (t.IsComposition)
			{
				t.apiCompositeEnd();
				t.externalEndCompositeInput();
			}

			if (!t.isSystem)
				t.clear(true);

			var _nativeFocusElementNoRemoveOnElementFocus = t.nativeFocusElementNoRemoveOnElementFocus;
			t.nativeFocusElementNoRemoveOnElementFocus = false;

			if (t.InterfaceEnableKeyEvents == false)
			{
				t.nativeFocusElement = null;
				return;
			}

			if (t.nativeFocusElement && (t.nativeFocusElement.id == t.HtmlArea.id))
			{
				t.Api.asc_enableKeyEvents(true, true);

				if (_nativeFocusElementNoRemoveOnElementFocus)
					t.nativeFocusElement = _oldNativeFE;
				else
					t.nativeFocusElement = null;

				return;
			}
			if (t.nativeFocusElement && (t.nativeFocusElement.id == window['AscCommon'].g_clipboardBase.CommonDivId))
			{
				t.nativeFocusElement = null;
				return;
			}

			t.nativeFocusElementNoRemoveOnElementFocus = false;

			var _isElementEditable = false;
			if (t.nativeFocusElement)
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

		window['AscCommon'].g_inputContext.debugInputEnable(true);
		window['AscCommon'].g_inputContext.show();
	};
})(window);
