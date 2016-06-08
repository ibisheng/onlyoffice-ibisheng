"use strict";

(function(window, undefined)
{
	var c_oCompositionState = {
		start 	: 0,
		process : 1,
		end		: 2
	};
	function CTextInput(api)
	{
		this.Api = api;

		this.compositionValue = [];		// коды символов
		this.compositionState = c_oCompositionState.end;

		this.TargetId 	= null;			// id caret
		this.HtmlDiv 	= null;			// для незаметной реализации одной textarea недостаточно
		this.HtmlArea	= null;

		this.HtmlAreaOffset = 60;

		this.Listener 	= null;

		this.KeyDownFlag = false;
	}

	CTextInput.prototype =
	{
		init : function(target_id)
		{
			this.TargetId = target_id;
			var oHtmlTarget = document.getElementById(this.TargetId);
			var oHtmlParent = oHtmlTarget.parentNode;

			this.HtmlDiv = document.createElement("div");
			this.HtmlDiv.style.background = "transparent";
			this.HtmlDiv.style.border = "none";
			this.HtmlDiv.style.position = "absolute";
			this.HtmlDiv.style.zIndex = 0;
			this.HtmlDiv.style.width = "20px";
			this.HtmlDiv.style.height = "50px";
			this.HtmlDiv.style.overflow = "hidden";

			this.HtmlArea = document.createElement("textarea");
			this.HtmlArea.id = "area_id";
			this.HtmlArea.style.background = "transparent";
			this.HtmlArea.style.border = "none";
			this.HtmlArea.style.position = "absolute";
			this.HtmlArea.style["text-shadow"] = "0 0 0 #000";
			this.HtmlArea.style.outline = "none";
			this.HtmlArea.style.color = "transparent";
			this.HtmlArea.style.width = "1000px";
			this.HtmlArea.style.height = "50px";
			this.HtmlArea.style.overflow = "hidden";

			this.HtmlArea.style.left = "0px;";
			this.HtmlArea.style.top = (-this.HtmlAreaOffset) + "px";

			this.HtmlArea.setAttribute("spellcheck", false);

			this.HtmlDiv.appendChild(this.HtmlArea);

			oHtmlParent.appendChild(this.HtmlDiv);

			// events:
			var oThis = this;
			this.HtmlArea["onkeydown"] 	= function(e) { return oThis.onKeyDown(e); };
			this.HtmlArea["onkeypress"] = function(e) { return oThis.onKeyPress(e); };
			this.HtmlArea["oninput"] 	= function(e) { return oThis.onInput(e); };

			//this.HtmlArea["oncompositionstart"] 	= function(e) { return oThis.onCompositionStart(e); };
			//this.HtmlArea["oncompositionupdate"] 	= function(e) { return oThis.onCompositionUpdate(e); };
			//this.HtmlArea["oncompositionend"] 	= function(e) { return oThis.onCompositionEnd(e); };

			this.HtmlArea.addEventListener("compositionstart", function(e) { return oThis.onCompositionStart(e); }, false);
			this.HtmlArea.addEventListener("compositionupdate", function(e) { return oThis.onCompositionUpdate(e); }, false);
			this.HtmlArea.addEventListener("compositionend", function(e) { return oThis.onCompositionEnd(e); }, false);

			this.Listener = this.Api.WordControl.m_oLogicDocument;

			// TODO:
			setInterval(function(){
				oThis.HtmlArea.focus();
			}, 10);
		},

		move : function()
		{
			var oTarget = document.getElementById(this.TargetId);
			var xPos = parseInt(oTarget.style.left);
			var yPos = parseInt(oTarget.style.top) + parseInt(oTarget.style.height);

			this.HtmlDiv.style.left = xPos + "px";
			this.HtmlDiv.style.top = yPos + this.HtmlAreaOffset + "px"; // еще бы сдвинуться на высоту строки
		},

		clear : function()
		{
			this.compositionValue = "";
			this.compositionState = c_oCompositionState.end;
			this.HtmlArea.value = "";
		},

		onInput : function(e)
		{
			// none
		},

		onKeyDown : function(e)
		{
			return this.Api.WordControl.onKeyDown(e);
		},

		onKeyPress : function(e)
		{
			if (c_oCompositionState.end != this.compositionState)
				return;

			return this.Api.WordControl.onKeyPress(e);
		},

		onCompositionStart : function(e)
		{
			if (!this.Listener)
				this.Listener = this.Api.WordControl.m_oLogicDocument;

			this.compositionState = c_oCompositionState.start;
			this.Listener.Begin_CompositeInput();
		},

		onCompositionUpdate : function(e)
		{
			this.checkCompositionData(e.data);
			this.Listener.Replace_CompositeText(this.compositionValue);
			this.compositionState = c_oCompositionState.process;
		},

		onCompositionEnd : function(e)
		{
			this.clear();
			this.Listener.End_CompositeInput();
		},

		checkCompositionData : function(data)
		{
			this.compositionValue = [];
			var _length = data.length;
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
		}
	};

	window['AscCommon'] = window['AscCommon'] || {};
	window['AscCommon'].CTextInput = CTextInput;
})(window);
