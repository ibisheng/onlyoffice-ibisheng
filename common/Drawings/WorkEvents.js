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
	AscCommon.isTouch 			= false;
	AscCommon.isTouchMove 		= false;
	AscCommon.TouchStartTime 	= -1;
	// Import
	var AscBrowser               = AscCommon.AscBrowser;
	var global_MatrixTransformer = AscCommon.global_MatrixTransformer;
	var g_dKoef_mm_to_pix        = AscCommon.g_dKoef_mm_to_pix;

	// ��������� ��� ����
	var g_mouse_event_type_down  = 0;
	var g_mouse_event_type_move  = 1;
	var g_mouse_event_type_up    = 2;
	var g_mouse_event_type_wheel = 3;

	var g_mouse_button_left   = 0;
	var g_mouse_button_center = 1;
	var g_mouse_button_right  = 2;

	var MouseUpLock = {
		MouseUpLockedSend : false
	};

	AscCommon.stopEvent = function(e)
	{
		if (e.preventDefault)
			e.preventDefault();
		if (e.stopPropagation)
			e.stopPropagation();
	};

	function CMouseEventHandler()
	{
		this.X = 0;                            // ������� ������� X
		this.Y = 0;                            // ������� ������� Y

		this.Button = g_mouse_button_left;          // ������ ����
		this.Type   = g_mouse_event_type_move;      // ��� ������

		this.AltKey   = false;                        // ������ �� ������ alt
		this.CtrlKey  = false;                        // ������ �� ������ ctrl
		this.ShiftKey = false;                        // ������ �� ������ shift

		this.Sender = null;                         // �� ������ html �������� ������ �����

		this.LastClickTime = -1;                       // ����� ���������� mousedown
		this.ClickCount    = 0;                        // ���������� ������

		this.WheelDelta = 0;

		// ���������� ����� ��� ���������� mousedown (��� mousemove)
		this.IsPressed = false;                        // ���� �� ������ ������
		this.LastX     = 0;
		this.LastY     = 0;

		this.KoefPixToMM = 1;

		this.IsLocked      = false;
		this.IsLockedEvent = false;

		this.buttonObject = null;

		this.AscHitToHandlesEpsilon = 0;

		this.LockMouse   = function()
		{
			if (!this.IsLocked)
			{
				this.IsLocked = true;

				if (window.captureEvents)
					window.captureEvents(Event.MOUSEDOWN | Event.MOUSEUP);

				/*
				 var parent = window;
				 while (true)
				 {
				 if (!parent)
				 break;

				 if (parent.captureEvents)
				 parent.captureEvents(Event.MOUSEDOWN | Event.MOUSEUP);

				 if (parent == parent.parent)
				 break;

				 parent = parent.parent;
				 }
				 */

				return true;
			}
			return false;
		};
		this.UnLockMouse = function()
		{
			if (this.IsLocked)
			{
				this.IsLocked = false;

				if (window.releaseEvents)
					window.releaseEvents(Event.MOUSEMOVE);

				/*
				 var parent = window;
				 while (true)
				 {
				 if (!parent)
				 break;

				 if (parent.releaseEvents)
				 parent.releaseEvents(Event.MOUSEMOVE);

				 if (parent == parent.parent)
				 break;

				 parent = parent.parent;
				 }
				 */

				return true;
			}
			return false;
		};
	}

	function CKeyboardEvent()
	{
		this.AltKey   = false;                        // ������ �� ������ alt
		this.CtrlKey  = false;                        // ������ �� ������ ctrl
		this.ShiftKey = false;                        // ������ �� ������ shift
		this.AltGr    = false;

		this.Sender = null;                         // �� ������ html �������� ������ �����

		this.CharCode = 0;
		this.KeyCode  = 0;
	}

	var global_mouseEvent    = new CMouseEventHandler();
	var global_keyboardEvent = new CKeyboardEvent();

	function check_KeyboardEvent(e)
	{
		global_keyboardEvent.AltKey = e.altKey;

		if (e.metaKey !== undefined)
			global_keyboardEvent.CtrlKey = e.ctrlKey || e.metaKey;
		else
			global_keyboardEvent.CtrlKey = e.ctrlKey;

		global_keyboardEvent.AltGr = (global_keyboardEvent.CtrlKey && global_keyboardEvent.AltKey) ? true : false;
		if (AscBrowser.isMacOs)
		{
			global_keyboardEvent.AltGr = (!global_keyboardEvent.CtrlKey && global_keyboardEvent.AltKey) ? true : false;
		}

		if (global_keyboardEvent.AltGr)
			global_keyboardEvent.CtrlKey = false;

		global_keyboardEvent.ShiftKey = e.shiftKey;

		global_keyboardEvent.Sender = (e.srcElement) ? e.srcElement : e.target;

		global_keyboardEvent.CharCode = e.charCode;
		global_keyboardEvent.KeyCode  = e.keyCode;
		global_keyboardEvent.Which    = e.which;

		if ((global_keyboardEvent.KeyCode == 229) && ((e.code == "space") || (e.code == "Space") || (e.key == "Spacebar")))
		{
			global_keyboardEvent.KeyCode = 12288;
		}
	}

	function check_KeyboardEvent2(e)
	{
		global_keyboardEvent.AltKey = e.altKey;

		if (e.metaKey !== undefined)
			global_keyboardEvent.CtrlKey = e.ctrlKey || e.metaKey;
		else
			global_keyboardEvent.CtrlKey = e.ctrlKey;

		global_keyboardEvent.ShiftKey = e.shiftKey;

		global_keyboardEvent.AltGr = (global_keyboardEvent.CtrlKey && global_keyboardEvent.AltKey) ? true : false;

		if (global_keyboardEvent.CtrlKey && global_keyboardEvent.AltKey)
			global_keyboardEvent.CtrlKey = false;
	}

	function check_MouseMoveEvent(e)
	{
		// ���� ���� ��������, �� ����� ������ �� ����.
		if (e.IsLocked && !e.IsLockedEvent)
			return;

		if (e.pageX || e.pageY)
		{
			global_mouseEvent.X = e.pageX;
			global_mouseEvent.Y = e.pageY;
		}
		else if (e.clientX || e.clientY)
		{
			global_mouseEvent.X = e.clientX;
			global_mouseEvent.Y = e.clientY;
		}

		global_mouseEvent.X = (global_mouseEvent.X * AscBrowser.zoom) >> 0;
		global_mouseEvent.Y = (global_mouseEvent.Y * AscBrowser.zoom) >> 0;

		global_mouseEvent.AltKey   = e.altKey;
		global_mouseEvent.ShiftKey = e.shiftKey;
		global_mouseEvent.CtrlKey  = e.ctrlKey || e.metaKey;

		global_mouseEvent.Type = g_mouse_event_type_move;

		if (!global_mouseEvent.IsLocked)
		{
			global_mouseEvent.Sender = (e.srcElement) ? e.srcElement : e.target;
		}

		var _eps = 3 * global_mouseEvent.KoefPixToMM;
		if ((Math.abs(global_mouseEvent.X - global_mouseEvent.LastX) > _eps) || (Math.abs(global_mouseEvent.Y - global_mouseEvent.LastY) > _eps))
		{
			global_mouseEvent.LastClickTime = -1;
			global_mouseEvent.ClickCount    = 0;
		}
	}

	function CreateMouseUpEventObject(x, y)
	{
		var e   = {};
		e.PageX = x;
		e.PageY = y;

		e.altKey   = global_mouseEvent.AltKey;
		e.shiftKey = global_mouseEvent.ShiftKey;
		e.ctrlKey  = global_mouseEvent.CtrlKey;

		e.srcElement = global_mouseEvent.Sender;
		e.button     = 0;
		return e;
	}

	function check_MouseUpEvent(e)
	{
		if (e.pageX || e.pageY)
		{
			global_mouseEvent.X = e.pageX;
			global_mouseEvent.Y = e.pageY;
		}
		else if (e.clientX || e.clientY)
		{
			global_mouseEvent.X = e.clientX;
			global_mouseEvent.Y = e.clientY;
		}

		global_mouseEvent.X = (global_mouseEvent.X * AscBrowser.zoom) >> 0;
		global_mouseEvent.Y = (global_mouseEvent.Y * AscBrowser.zoom) >> 0;

		global_mouseEvent.AltKey   = e.altKey;
		global_mouseEvent.ShiftKey = e.shiftKey;
		global_mouseEvent.CtrlKey  = e.ctrlKey || e.metaKey;

		global_keyboardEvent.AltKey   = global_mouseEvent.AltKey;
		global_keyboardEvent.ShiftKey = global_mouseEvent.ShiftKey;
		global_keyboardEvent.CtrlKey  = global_mouseEvent.CtrlKey;

		global_mouseEvent.Type   = g_mouse_event_type_up;
		global_mouseEvent.Button = (e.button !== undefined) ? e.button : 0;

		var lockedElement = null;

		var newSender = (e.srcElement) ? e.srcElement : e.target;
		if (!newSender)
		    newSender = { id : "emulation_oo_id" };

		if (global_mouseEvent.Sender && global_mouseEvent.Sender.id == newSender.id)
		{
			lockedElement = global_mouseEvent.Sender;
		}

		if (global_mouseEvent.IsLocked == true && global_mouseEvent.Sender != newSender && false === MouseUpLock.MouseUpLockedSend)
		{
			Window_OnMouseUp(e);
		}
		MouseUpLock.MouseUpLockedSend = true;
		global_mouseEvent.Sender      = newSender;

		global_mouseEvent.UnLockMouse();

		global_mouseEvent.IsPressed = false;

		return lockedElement;
	}

	function check_MouseDownEvent(e, isClicks)
	{
		if (e.pageX || e.pageY)
		{
			global_mouseEvent.X = e.pageX;
			global_mouseEvent.Y = e.pageY;
		}
		else if (e.clientX || e.clientY)
		{
			global_mouseEvent.X = e.clientX;
			global_mouseEvent.Y = e.clientY;
		}

		global_mouseEvent.X = (global_mouseEvent.X * AscBrowser.zoom) >> 0;
		global_mouseEvent.Y = (global_mouseEvent.Y * AscBrowser.zoom) >> 0;

		var _eps = 3 * global_mouseEvent.KoefPixToMM;
		if ((Math.abs(global_mouseEvent.X - global_mouseEvent.LastX) > _eps) || (Math.abs(global_mouseEvent.Y - global_mouseEvent.LastY) > _eps))
		{
			// not only move!!! (touch - fast click in different places)
			global_mouseEvent.LastClickTime = -1;
			global_mouseEvent.ClickCount    = 0;
		}

		global_mouseEvent.LastX = global_mouseEvent.X;
		global_mouseEvent.LastY = global_mouseEvent.Y;

		global_mouseEvent.AltKey   = e.altKey;
		global_mouseEvent.ShiftKey = e.shiftKey;
		global_mouseEvent.CtrlKey  = e.ctrlKey || e.metaKey;

		global_keyboardEvent.AltKey   = global_mouseEvent.AltKey;
		global_keyboardEvent.ShiftKey = global_mouseEvent.ShiftKey;
		global_keyboardEvent.CtrlKey  = global_mouseEvent.CtrlKey;

		global_mouseEvent.Type   = g_mouse_event_type_down;
		global_mouseEvent.Button = (e.button !== undefined) ? e.button : 0;

		global_mouseEvent.Sender = (e.srcElement) ? e.srcElement : e.target;

		if (isClicks)
		{
			var CurTime = new Date().getTime();
			if (0 == global_mouseEvent.ClickCount)
			{
				global_mouseEvent.ClickCount    = 1;
				global_mouseEvent.LastClickTime = CurTime;
			}
			else
			{
				if (500 > CurTime - global_mouseEvent.LastClickTime)
				{
					global_mouseEvent.LastClickTime = CurTime;
					global_mouseEvent.ClickCount++;
				}
				else
				{
					global_mouseEvent.ClickCount    = 1;
					global_mouseEvent.LastClickTime = CurTime;
				}
			}
		}
		else
		{
			global_mouseEvent.LastClickTime = -1;
			global_mouseEvent.ClickCount    = 1;
		}

		MouseUpLock.MouseUpLockedSend = false;
	}

	function check_MouseDownEvent2(x, y)
	{
		global_mouseEvent.X = x;
		global_mouseEvent.Y = y;

		global_mouseEvent.LastX = global_mouseEvent.X;
		global_mouseEvent.LastY = global_mouseEvent.Y;

		global_mouseEvent.Type = g_mouse_event_type_down;

		global_mouseEvent.Sender = editor.WordControl.m_oEditor.HtmlElement;

		global_mouseEvent.LastClickTime = -1;
		global_mouseEvent.ClickCount    = 1;

		MouseUpLock.MouseUpLockedSend = false;
	}

	function global_OnMouseWheel(e)
	{
		global_mouseEvent.AltKey   = e.altKey;
		global_mouseEvent.ShiftKey = e.shiftKey;
		global_mouseEvent.CtrlKey  = e.ctrlKey || e.metaKey;

		if (undefined != e.wheelDelta)
			global_mouseEvent.WheelDelta = (e.wheelDelta > 0) ? -45 : 45;
		else
			global_mouseEvent.WheelDelta = (e.detail > 0) ? 45 : -45;

		global_mouseEvent.type = g_mouse_event_type_wheel;

		global_mouseEvent.Sender = (e.srcElement) ? e.srcElement : e.target;

		global_mouseEvent.LastClickTime = -1;
		global_mouseEvent.ClickCount    = 0;
	}

	function InitCaptureEvents()
	{
		window.onmousemove = function(event)
		{
			return Window_OnMouseMove(event)
		};
		window.onmouseup   = function(event)
		{
			return Window_OnMouseUp(event)
		};
		/*
		 var parent = window;
		 while (true)
		 {
		 if (!parent)
		 return;

		 parent.onmousemove  = function(event){return Window_OnMouseMove(event)};
		 parent.onmouseup    = function(event){return Window_OnMouseUp(event)};

		 if (parent == parent.parent)
		 return;

		 parent = parent.parent;
		 }
		 */
	}

	function Window_OnMouseMove(e)
	{
		if (!global_mouseEvent.IsLocked)
			return;

		if ((undefined != global_mouseEvent.Sender) && (null != global_mouseEvent.Sender) &&
			(undefined != global_mouseEvent.Sender.onmousemove) && (null != global_mouseEvent.Sender.onmousemove))
		{
			global_mouseEvent.IsLockedEvent = true;
			global_mouseEvent.Sender.onmousemove(e);
			global_mouseEvent.IsLockedEvent = false;
		}
	}

	function Window_OnMouseUp(e)
	{
		if (false === MouseUpLock.MouseUpLockedSend)
		{
			MouseUpLock.MouseUpLockedSend = true;
			if (global_mouseEvent.IsLocked)
			{
				if (undefined != global_mouseEvent.Sender.onmouseup && null != global_mouseEvent.Sender.onmouseup)
				{
					global_mouseEvent.Sender.onmouseup(e, true);
				}
			}
		}

		if (window.g_asc_plugins)
		    window.g_asc_plugins.onExternalMouseUp();
	}

	InitCaptureEvents();

	function button_eventHandlers(disable_pos, norm_pos, over_pos, down_pos, control, click_func_delegate)
	{
		this.state_normal = norm_pos;
		this.state_over   = over_pos;
		this.state_down   = down_pos;

		this.Click_func = click_func_delegate;
		this.Control    = control;
		this.IsPressed  = false;

		var oThis = this;

		this.Control.HtmlElement.onmouseover = function(e)
		{
			check_MouseMoveEvent(e);

			if (global_mouseEvent.IsLocked)
			{
				if (global_mouseEvent.Sender.id != oThis.Control.HtmlElement.id)
				{
					// ��� �� ���������� ������
					return;
				}
				// ���������� ������
				oThis.Control.HtmlElement.style.backgroundPosition = oThis.state_down;
				return;
			}
			oThis.Control.HtmlElement.style.backgroundPosition = oThis.state_over;
		}
		this.Control.HtmlElement.onmouseout  = function(e)
		{
			check_MouseMoveEvent(e);

			if (global_mouseEvent.IsLocked)
			{
				if (global_mouseEvent.Sender.id != oThis.Control.HtmlElement.id)
				{
					// ��� �� ���������� ������
					return;
				}
				// ���������� ������
				oThis.Control.HtmlElement.style.backgroundPosition = oThis.state_over;
				return;
			}
			oThis.Control.HtmlElement.style.backgroundPosition = oThis.state_normal;
		}
		this.Control.HtmlElement.onmousedown = function(e)
		{
			check_MouseDownEvent(e);
			global_mouseEvent.LockMouse();
			global_mouseEvent.buttonObject = oThis;

			AscCommon.stopEvent(e);

			if (global_mouseEvent.IsLocked)
			{
				if (global_mouseEvent.Sender.id != oThis.Control.HtmlElement.id)
				{
					// ��� �� ���������� ������
					return;
				}
				// ���������� ������
				oThis.Control.HtmlElement.style.backgroundPosition = oThis.state_down;
				return;
			}
			oThis.Control.HtmlElement.style.backgroundPosition = oThis.state_down;
		}
		this.Control.HtmlElement.onmouseup   = function(e)
		{
			var lockedElement = check_MouseUpEvent(e);

			if (e.preventDefault)
				e.preventDefault();
			else
				e.returnValue = false;

			if (null != lockedElement && global_mouseEvent.buttonObject != null)
			{
				oThis.Click_func();
			}

			if (null != lockedElement)
			{
				oThis.Control.HtmlElement.style.backgroundPosition = oThis.state_over;
			}
			else
			{
				if (null != global_mouseEvent.buttonObject)
					global_mouseEvent.buttonObject.Control.HtmlElement.style.backgroundPosition = global_mouseEvent.buttonObject.state_normal;

				if ((global_mouseEvent.buttonObject == null) || (oThis.Control.HtmlElement.id != global_mouseEvent.buttonObject.Control.HtmlElement.id))
					oThis.Control.HtmlElement.style.backgroundPosition = oThis.state_over;
			}
			global_mouseEvent.buttonObject = null;
		}

		// теперь touch
		this.Control.HtmlElement.ontouchstart = function(e)
		{
			oThis.Control.HtmlElement.onmousedown(e.touches[0]);
			return false;
		}
		this.Control.HtmlElement.ontouchend   = function(e)
		{
			var lockedElement = check_MouseUpEvent(e.changedTouches[0]);

			if (null != lockedElement)
			{
				oThis.Click_func();
				oThis.Control.HtmlElement.style.backgroundPosition = oThis.state_normal;
			}
			else
			{
				if (null != global_mouseEvent.buttonObject)
					global_mouseEvent.buttonObject.Control.HtmlElement.style.backgroundPosition = global_mouseEvent.buttonObject.state_normal;

				if (oThis.Control.HtmlElement.id != global_mouseEvent.buttonObject.Control.HtmlElement.id)
					oThis.Control.HtmlElement.style.backgroundPosition = oThis.state_normal;
			}
			global_mouseEvent.buttonObject = null;
			return false;
		}
	}

	function emulateKeyDown(_code, _element)
	{
		var oEvent = document.createEvent('KeyboardEvent');

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
				return false;
			}
		});
		Object.defineProperty(oEvent, 'altKey', {
			get : function()
			{
				return false;
			}
		});
		Object.defineProperty(oEvent, 'metaKey', {
			get : function()
			{
				return false;
			}
		});
		Object.defineProperty(oEvent, 'ctrlKey', {
			get : function()
			{
				return false;
			}
		});

		if (AscCommon.AscBrowser.isIE)
		{
			oEvent.preventDefault = function () {
				Object.defineProperty(this, "defaultPrevented", {get: function () {return true;}});
			};
		}

		if (oEvent.initKeyboardEvent)
		{
			oEvent.initKeyboardEvent("keydown", true, true, window, false, false, false, false, _code, _code);
		}
		else
		{
			oEvent.initKeyEvent("keydown", true, true, window, false, false, false, false, _code, 0);
		}

		oEvent.keyCodeVal = _code;

		_element.dispatchEvent(oEvent);
		return oEvent.defaultPrevented;
	}

	function CTouchManager()
	{
		this.touches = [];
		this.ScrollY = null;
		this.ScrollH = null;

		this.ScrollHandleV = null;
		this.ScrollHandleH = null;

		this.StartTouches = function(e, scrollX, scrollY)
		{
			this.ScrollH = scrollX;
			this.ScrollY = scrollY;

			this.touches.splice(0, this.touches.length);
			var len = e.touches.length;
			for (var i = 0; i < len; i++)
			{
				var _e = e.touches[i];

				if (_e.pageX || _e.pageY)
				{
					this.touches.push({x : _e.pageX, y : _e.pageY});
				}
				else if (e.clientX || e.clientY)
				{
					this.touches.push({x : _e.clientX, y : _e.clientY});
				}
			}

			if (this.touches.length > 1)
			{
				if (e.preventDefault)
					e.preventDefault();
				else
					e.returnValue = false;

				return false;
			}
			return true;
		}

		this.MoveTouches = function(e)
		{
			if (this.touches.length > 1 && e.touches.length > 1)
			{
				if (e.preventDefault)
					e.preventDefault();
				else
					e.returnValue = false;

				var len   = Math.min(this.touches.length, e.touches.length);
				var _maxX = 0;
				var _maxY = 0;

				for (var i = 0; i < len; i++)
				{
					var _e = e.touches[i];

					if (_e.pageX || _e.pageY)
					{
						var _x = _e.pageX - this.touches[i].x;
						var _y = _e.pageY - this.touches[i].y;

						if (Math.abs(_x) > Math.abs(_maxX))
						{
							_maxX = _x;
						}
						if (Math.abs(_y) > Math.abs(_maxY))
						{
							_maxY = _y;
						}
					}
					else if (e.clientX || e.clientY)
					{
						var _x = _e.clientX - this.touches[i].x;
						var _y = _e.clientY - this.touches[i].y;

						if (Math.abs(_x) > Math.abs(_maxX))
						{
							_maxX = _x;
						}
						if (Math.abs(_y) > Math.abs(_maxY))
						{
							_maxY = _y;
						}
					}
				}

				if (this.ScrollH === undefined)
					_maxX = 0;
				if (this.ScrollY === undefined)
					_maxY = 0;

				if (_maxX != 0 || _maxY != 0)
				{
					if (Math.abs(_maxX) > Math.abs(_maxY) && null != this.ScrollHandleH)
					{
						this.ScrollHandleH(this.ScrollH - _maxX);
					}
					else if (null != this.ScrollHandleV)
					{
						this.ScrollHandleV(this.ScrollY - _maxY);
					}
				}

				return false;
			}
			return true;
		}

		this.EndTouches = function(e)
		{
			if (this.touches.length > 1)
			{
				if (e.preventDefault)
					e.preventDefault();
				else
					e.returnValue = false;

				return false;
			}
			this.touches.splice(0, this.touches.length);
			return true;
		}
	}

	var MobileTouchMode =
		{
			None       : 0,
			Scroll     : 1,
			Zoom       : 2,
			Select     : 3,
			InlineObj  : 4,
			FlowObj    : 5,
			Cursor     : 6,
			TableMove  : 7,
			TableRuler : 8
		};

	var MOBILE_SELECT_TRACK_ROUND = 14;
	var MOBILE_TABLE_RULER_DIAMOND = 7;

	function CMobileTouchManager()
	{
		this.AnimateScroll = false;
		this.AnimateZoom   = false;

		this.bIsTextSelected  = false;
		this.bIsTextSelecting = false;

		this.LogicDocument   = null;
		this.DrawingDocument = null;
		this.HtmlPage        = null;
		this.Api 			 = null;

		this.Mode = 0;
		this.IsTouching		= false;

		this.ReadingGlassTime  = 750;
		this.TimeDown          = 0;
		this.DownPoint         = null;
		this.DownPointOriginal = {X : 0, Y : 0};
		this.MoveAfterDown     = false;
		this.MoveMinDist       = 10;

		this.RectSelect1 = null;
		this.RectSelect2 = null;

		this.PageSelect1 = 0;
		this.PageSelect2 = 0;

		this.CheckFirstRect = true;
		this.TrackTargetEps = 20;

		this.ScrollH = 0;
		this.ScrollV = 0;

		this.ZoomDistance = 0;
		this.ZoomValue    = 100;
		this.ZoomValueMin = 50;
		this.ZoomValueMax = 300;

		this.iScroll = null;

		this.TableMovePoint        = null;
		this.TableHorRulerPoints   = null;
		this.TableVerRulerPoints   = null;
		this.TableStartTrack_Check = false;

		this.TableRulersRectOffset = 5;
		this.TableRulersRectSize   = 20;

		this.TableCurrentMoveDir      = -1;
		this.TableCurrentMovePos      = -1;
		this.TableCurrentMoveValue    = 0;
		this.TableCurrentMoveValueOld = 0;

		this.TableCurrentMoveValueMin = null;
		this.TableCurrentMoveValueMax = null;

		this.ContextMenuLastMode 		= 0; // 0 - none, 1 - target, 2 - select (text), 3 - object(s)
		this.ContextMenuLastModeCounter = 0;
		this.ContextMenuShowTimerId = -1;

		this.CreateScrollerDiv = function(_wrapper, _id)
		{
			var _scroller = document.createElement('div');
			var _style = "position: absolute; z-index: 0; margin: 0; padding: 0; -webkit-tap-highlight-color: rgba(0,0,0,0); width: 100%; heigth: 100%; display: block;";
			_style += "-webkit-transform: translateZ(0); -moz-transform: translateZ(0); -ms-transform: translateZ(0); -o-transform: translateZ(0); transform: translateZ(0);";
			_style += "-webkit-touch-callout: none; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none;";
			_style += "-webkit-text-size-adjust: none; -moz-text-size-adjust: none; -ms-text-size-adjust: none; -o-text-size-adjust: none; text-size-adjust: none;";
			_scroller.setAttribute("style", _style);

			_scroller.id = _id;
			_wrapper.appendChild(_scroller);
		};

		this.Init = function(ctrl)
		{
			this.HtmlPage        = ctrl;
			this.LogicDocument   = ctrl.m_oLogicDocument;
			this.DrawingDocument = ctrl.m_oDrawingDocument;
			this.Api			 = this.HtmlPage.m_oApi;

			this.CreateScrollerDiv(this.HtmlPage.m_oMainView.HtmlElement, "mobile_scroller_id");

			this.iScroll = new window.IScroll(this.HtmlPage.m_oMainView.HtmlElement, {
				scrollbars: true,
				mouseWheel: true,
				interactiveScrollbars: true,
				shrinkScrollbars: 'scale',
				fadeScrollbars: true,
				scrollX : true,
				scroller_id : "mobile_scroller_id",
				bounce : false
			});
			this.iScroll.manager = this;

			this.iScroll.on('scroll', function()
			{
				this.manager.HtmlPage.NoneRepaintPages = (true === this.isAnimating) ? true : false;
				if (this.directionLocked == "v")
				{
					this.manager.HtmlPage.m_oScrollVerApi.scrollToY(-this.y);
				}
				else if (this.directionLocked == "h")
				{
					this.manager.HtmlPage.m_oScrollHorApi.scrollToX(-this.x);
				}
				else if (this.directionLocked == "n")
				{
					this.manager.HtmlPage.m_oScrollHorApi.scrollToX(-this.x);
					this.manager.HtmlPage.m_oScrollVerApi.scrollToY(-this.y);
				}
			});
			this.iScroll.on('scrollEnd', function()
			{
				this.manager.HtmlPage.NoneRepaintPages = (true === this.isAnimating) ? true : false;
				this.manager.OnScrollAnimationEnd();
				this.manager.HtmlPage.OnScroll();
			});

			LoadMobileImages();
		};

		this.MoveCursorToPoint = function(e)
		{
			check_MouseMoveEvent(e);
			var pos = this.DrawingDocument.ConvertCoordsFromCursor2(global_mouseEvent.X, global_mouseEvent.Y);

			var old_click_count          = global_mouseEvent.ClickCount;
			global_mouseEvent.ClickCount = 1;

			var nearPos = this.LogicDocument.Get_NearestPos(pos.Page, pos.X, pos.Y);

			this.DrawingDocument.NeedScrollToTargetFlag = true;
			this.LogicDocument.OnMouseDown(global_mouseEvent, nearPos.X, nearPos.Y, pos.Page);
			this.LogicDocument.OnMouseUp(global_mouseEvent, nearPos.X, nearPos.Y, pos.Page);
			this.DrawingDocument.NeedScrollToTargetFlag = false;

			global_mouseEvent.ClickCount = old_click_count;
		};

		this.IsWorkedPosition = function()
		{
			if (this.IsTouching)
				return true;

			if (this.iScroll && this.iScroll.isAnimating)
				return true;

			return false;
		};

		this.onTouchStart = function(e)
		{
			this.IsTouching = true;

			if (null != this.DrawingDocument.m_oDocumentRenderer)
				return this.onTouchStart_renderer(e);

            global_mouseEvent.KoefPixToMM = 5;
			check_MouseDownEvent(e.touches ? e.touches[0] : e, true);
            global_mouseEvent.KoefPixToMM = 1;
			global_mouseEvent.LockMouse();
			this.HtmlPage.m_oApi.sendEvent("asc_onHidePopMenu");

			this.ScrollH = this.HtmlPage.m_dScrollX;
			this.ScrollV = this.HtmlPage.m_dScrollY;

			this.TableCurrentMoveValueMin = null;
			this.TableCurrentMoveValueMax = null;

			this.MoveAfterDown = false;
			this.TimeDown      = new Date().getTime();

			var bIsKoefPixToMM = false;
			var _matrix        = this.DrawingDocument.SelectionMatrix;
			if (_matrix && global_MatrixTransformer.IsIdentity(_matrix))
				_matrix = null;

			// проверим на попадание в селект - это может произойти на любом mode
			if (null != this.RectSelect1 && null != this.RectSelect2)
			{
				var pos1 = null;
				var pos4 = null;

				if (!_matrix)
				{
					pos1 = this.DrawingDocument.ConvertCoordsToCursor3(this.RectSelect1.x, this.RectSelect1.y, this.PageSelect1);
					pos4 = this.DrawingDocument.ConvertCoordsToCursor3(this.RectSelect2.x + this.RectSelect2.w, this.RectSelect2.y + this.RectSelect2.h, this.PageSelect2);
				}
				else
				{
					var _xx1 = _matrix.TransformPointX(this.RectSelect1.x, this.RectSelect1.y);
					var _yy1 = _matrix.TransformPointY(this.RectSelect1.x, this.RectSelect1.y);

					var _xx2 = _matrix.TransformPointX(this.RectSelect2.x + this.RectSelect2.w, this.RectSelect2.y + this.RectSelect2.h);
					var _yy2 = _matrix.TransformPointY(this.RectSelect2.x + this.RectSelect2.w, this.RectSelect2.y + this.RectSelect2.h);

					pos1 = this.DrawingDocument.ConvertCoordsToCursor3(_xx1, _yy1, this.PageSelect1);
					pos4 = this.DrawingDocument.ConvertCoordsToCursor3(_xx2, _yy2, this.PageSelect2);
				}

				if (Math.abs(pos1.X - global_mouseEvent.X) < this.TrackTargetEps && Math.abs(pos1.Y - global_mouseEvent.Y) < this.TrackTargetEps)
				{
					this.Mode       = MobileTouchMode.Select;
					this.DragSelect = 1;
				}
				else if (Math.abs(pos4.X - global_mouseEvent.X) < this.TrackTargetEps && Math.abs(pos4.Y - global_mouseEvent.Y) < this.TrackTargetEps)
				{
					this.Mode       = MobileTouchMode.Select;
					this.DragSelect = 2;
				}
			}
			else
			{
				var _xOffset = this.HtmlPage.X;
				var _yOffset = this.HtmlPage.Y;

				if (true === this.HtmlPage.m_bIsRuler)
				{
					_xOffset += (5 * g_dKoef_mm_to_pix);
					_yOffset += (7 * g_dKoef_mm_to_pix);
				}

				var _eps     = this.TrackTargetEps;
				var bIsTable = false;

				var _table_outline_dr = this.DrawingDocument.TableOutlineDr;
				if (this.TableMovePoint != null && _table_outline_dr)
				{
					var _Transform = _table_outline_dr.TableMatrix;
					var _PageNum   = _table_outline_dr.CurrentPageIndex;

					if (!_Transform || global_MatrixTransformer.IsIdentity(_Transform))
					{
						var _x = global_mouseEvent.X - _xOffset;
						var _y = global_mouseEvent.Y - _yOffset;

						var posLT   = this.DrawingDocument.ConvertCoordsToCursorWR(this.TableMovePoint.X, this.TableMovePoint.Y, _PageNum);
						var _offset = this.TableRulersRectSize + this.TableRulersRectOffset;

						if (_x > (posLT.X - _offset - _eps) && _x < (posLT.X - this.TableRulersRectOffset + _eps) &&
							_y > (posLT.Y - _offset - _eps) && _y < (posLT.Y - this.TableRulersRectOffset + _eps))
						{
							this.Mode = MobileTouchMode.TableMove;
							bIsTable  = true;
						}

						if (!bIsTable)
						{
							if (_y > (posLT.Y - _offset - _eps) && _y < (posLT.Y - this.TableRulersRectOffset + _eps))
							{
								var _len    = this.TableHorRulerPoints.length;
								var _indexF = -1;
								var _minF   = 1000000;
								for (var i = 0; i < _len; i++)
								{
									var posM1 = this.DrawingDocument.ConvertCoordsToCursorWR(this.TableHorRulerPoints[i].C, this.TableMovePoint.Y, _PageNum);
									var _dist = Math.abs(_x - posM1.X);
									if (_minF > _dist)
									{
										_indexF = i;
										_minF   = _dist;
									}
								}

								if (_minF < _eps)
								{
									var _p = this.TableHorRulerPoints[_indexF];

									this.TableCurrentMoveDir = 0;
									this.TableCurrentMovePos = _indexF;

									this.TableCurrentMoveValue    = _p.X;
									this.TableCurrentMoveValueOld = this.TableCurrentMoveValue;
									this.Mode                     = MobileTouchMode.TableRuler;

									if (_indexF == 0)
									{
										this.TableCurrentMoveValueMin = this.TableMovePoint.X;
									}
									else
									{
										this.TableCurrentMoveValueMin = this.TableHorRulerPoints[_indexF - 1].X + this.TableHorRulerPoints[_indexF - 1].W;
									}

									if (_indexF < (_len - 1))
									{
										this.TableCurrentMoveValueMax = this.TableHorRulerPoints[_indexF + 1].X;
									}
									else
									{
										this.TableCurrentMoveValueMax = null;
									}

									bIsTable = true;
								}
							}

							if (!bIsTable && _x >= (posLT.X - _offset - _eps) && _x <= (posLT.X - this.TableRulersRectOffset + _eps))
							{
								var _len    = this.TableVerRulerPoints.length;
								var _indexF = -1;
								var _minF   = 1000000;
								for (var i = 0; i < _len; i++)
								{
									var posM1 = this.DrawingDocument.ConvertCoordsToCursorWR(this.TableMovePoint.X, this.TableVerRulerPoints[i].Y, _PageNum);
									var posM2 = this.DrawingDocument.ConvertCoordsToCursorWR(this.TableMovePoint.X, this.TableVerRulerPoints[i].Y + this.TableVerRulerPoints[i].H, _PageNum);

									if (_y >= (posM1.Y - _eps) && _y <= (posM2.Y + _eps))
									{
										var _dist = Math.abs(_y - ((posM1.Y + posM2.Y) / 2));
										if (_minF > _dist)
										{
											_indexF = i;
											_minF   = _dist;
										}
									}
								}

								if (_indexF != -1)
								{
									var _p = this.TableVerRulerPoints[_indexF];

									this.TableCurrentMoveDir = 1;
									this.TableCurrentMovePos = _indexF;

									this.TableCurrentMoveValue    = _p.Y;
									this.TableCurrentMoveValueOld = this.TableCurrentMoveValue;
									this.Mode                     = MobileTouchMode.TableRuler;

									if (_indexF == 0)
									{
										this.TableCurrentMoveValueMin = this.TableMovePoint.Y;
									}
									else
									{
										this.TableCurrentMoveValueMin = this.TableVerRulerPoints[_indexF - 1].Y + this.TableVerRulerPoints[_indexF - 1].H;
									}

									if (_indexF < (_len - 1))
									{
										this.TableCurrentMoveValueMax = this.TableVerRulerPoints[_indexF + 1].Y;
									}
									else
									{
										this.TableCurrentMoveValueMax = null;
									}

									bIsTable = true;
								}
							}
						}
					}
					else
					{
						var pos = this.DrawingDocument.ConvertCoordsFromCursor2(global_mouseEvent.X, global_mouseEvent.Y);
						if (pos.Page == _PageNum)
						{
							var _invert = global_MatrixTransformer.Invert(_Transform);
							var _posx   = _invert.TransformPointX(pos.X, pos.Y);
							var _posy   = _invert.TransformPointY(pos.X, pos.Y);

							var _koef = AscCommon.g_dKoef_pix_to_mm * 100 / this.HtmlPage.m_nZoomValue;
							var _eps1 = this.TrackTargetEps * _koef;

							var _offset1 = this.TableRulersRectOffset * _koef;
							var _offset2 = _offset1 + this.TableRulersRectSize * _koef;
							if ((_posx >= (this.TableMovePoint.X - _offset2 - _eps1)) && (_posx <= (this.TableMovePoint.X - _offset1 + _eps1)) &&
								(_posy >= (this.TableMovePoint.Y - _offset2 - _eps1)) && (_posy <= (this.TableMovePoint.Y - _offset1 + _eps1)))
							{
								this.Mode = MobileTouchMode.TableMove;
								bIsTable  = true;
							}

							if (!bIsTable)
							{
								if (_posy > (this.TableMovePoint.Y - _offset2 - _eps1) && _posy < (this.TableMovePoint.Y - _offset1 + _eps1))
								{
									var _len = this.TableHorRulerPoints.length;
									for (var i = 0; i < _len; i++)
									{
										var _p = this.TableHorRulerPoints[i];

										if (_posx > (_p.X - _eps1) && _posx < (_p.X + _p.W + _eps1))
										{
											this.TableCurrentMoveDir = 0;
											this.TableCurrentMovePos = i;

											this.TableCurrentMoveValue    = this.TableHorRulerPoints[i].X;
											this.TableCurrentMoveValueOld = this.TableCurrentMoveValue;
											this.Mode                     = MobileTouchMode.TableRuler;

											if (i == 0)
											{
												this.TableCurrentMoveValueMin = this.TableMovePoint.X;
											}
											else
											{
												this.TableCurrentMoveValueMin = this.TableHorRulerPoints[i - 1].X + this.TableHorRulerPoints[i - 1].W;
											}

											if (i < (_len - 1))
											{
												this.TableCurrentMoveValueMax = this.TableHorRulerPoints[i + 1].X;
											}
											else
											{
												this.TableCurrentMoveValueMax = null;
											}

											bIsTable = true;
											break;
										}
									}
								}

								if (!bIsTable && _posx >= (this.TableMovePoint.X - _offset2 - _eps1) && _posx <= (this.TableMovePoint.X - _offset1 + _eps1))
								{
									var _len = this.TableVerRulerPoints.length;
									for (var i = 0; i < _len; i++)
									{
										var _p = this.TableVerRulerPoints[i];

										if (_posy >= (_p.Y - _eps1) && _posy <= (_p.Y + _p.H + _eps1))
										{
											this.TableCurrentMoveDir = 1;
											this.TableCurrentMovePos = i;

											this.TableCurrentMoveValue    = this.TableVerRulerPoints[i].Y;
											this.TableCurrentMoveValueOld = this.TableCurrentMoveValue;
											this.Mode                     = MobileTouchMode.TableRuler;

											if (i == 0)
											{
												this.TableCurrentMoveValueMin = this.TableMovePoint.Y;
											}
											else
											{
												this.TableCurrentMoveValueMin = this.TableVerRulerPoints[i - 1].Y + this.TableVerRulerPoints[i - 1].H;
											}

											if (i < (_len - 1))
											{
												this.TableCurrentMoveValueMax = this.TableVerRulerPoints[i + 1].Y;
											}
											else
											{
												this.TableCurrentMoveValueMax = null;
											}

											bIsTable = true;
											break;
										}
									}
								}
							}
						}
					}
				}

				if (!bIsTable)
				{
					var pos = this.DrawingDocument.ConvertCoordsFromCursor2(global_mouseEvent.X, global_mouseEvent.Y);

					var dKoef                     = (100 * AscCommon.g_dKoef_pix_to_mm / this.HtmlPage.m_nZoomValue);
					global_mouseEvent.KoefPixToMM = 5;
					if (this.LogicDocument.DrawingObjects.isPointInDrawingObjects3(pos.X, pos.Y, pos.Page))
					{
						bIsKoefPixToMM = true;
						this.Mode      = MobileTouchMode.FlowObj;
					}
					else
					{
						this.Mode = MobileTouchMode.None;
					}
					global_mouseEvent.KoefPixToMM = 1;
				}
			}

			if (e.touches && 2 == e.touches.length)
			{
				this.Mode = MobileTouchMode.Zoom;
			}

			switch (this.Mode)
			{
				case MobileTouchMode.None:
				{
					this.Mode      = MobileTouchMode.Scroll;
					this.DownPoint = this.DrawingDocument.ConvertCoordsFromCursor2(global_mouseEvent.X, global_mouseEvent.Y);

					this.DownPointOriginal.X = global_mouseEvent.X;
					this.DownPointOriginal.Y = global_mouseEvent.Y;

					this.iScroll._start(e);

					break;
				}
				case MobileTouchMode.Scroll:
				{
					// ничего не меняем, просто перемещаем точку
					this.DownPoint           = this.DrawingDocument.ConvertCoordsFromCursor2(global_mouseEvent.X, global_mouseEvent.Y);
					this.DownPointOriginal.X = global_mouseEvent.X;
					this.DownPointOriginal.Y = global_mouseEvent.Y;

					this.iScroll._start(e);

					break;
				}
				case MobileTouchMode.Select:
				{
				    var _x1 = this.RectSelect1.x;
				    var _y1 = this.RectSelect1.y + this.RectSelect1.h / 2;

				    var _x2 = this.RectSelect2.x + this.RectSelect2.w;
                    var _y2 = this.RectSelect2.y + this.RectSelect2.h / 2;

				    this.LogicDocument.Selection_Remove();
					if (1 == this.DragSelect)
					{
						global_mouseEvent.Button = 0;

						if (!_matrix)
						{
							this.LogicDocument.OnMouseDown(global_mouseEvent, _x2, _y2, this.PageSelect2);
						}
						else
						{
							var __X = _matrix.TransformPointX(_x2, _y2);
							var __Y = _matrix.TransformPointY(_x2, _y2);

							this.LogicDocument.OnMouseDown(global_mouseEvent, __X, __Y, this.PageSelect2);
						}

						var pos1 = this.DrawingDocument.ConvertCoordsFromCursor2(global_mouseEvent.X, global_mouseEvent.Y);
						this.LogicDocument.OnMouseMove(global_mouseEvent, pos1.X, pos1.Y, pos1.Page);
					}
					else if (2 == this.DragSelect)
					{
						global_mouseEvent.Button = 0;

						if (!_matrix)
						{
							this.LogicDocument.OnMouseDown(global_mouseEvent, _x1, _y1, this.PageSelect1);
						}
						else
						{
							var __X = _matrix.TransformPointX(_x1, _y1);
							var __Y = _matrix.TransformPointY(_x1, _y1);

							this.LogicDocument.OnMouseDown(global_mouseEvent, __X, __Y, this.PageSelect1);
						}

						var pos4 = this.DrawingDocument.ConvertCoordsFromCursor2(global_mouseEvent.X, global_mouseEvent.Y);
						this.LogicDocument.OnMouseMove(global_mouseEvent, pos4.X, pos4.Y, pos4.Page);
					}
					break;
				}
				case MobileTouchMode.InlineObj:
				{
					break;
				}
				case MobileTouchMode.FlowObj:
				{
					// так как был уже check, нужно уменьшить количество кликов
					if (global_mouseEvent.ClickCount > 0)
						global_mouseEvent.ClickCount--;

					if (bIsKoefPixToMM)
					{
						global_mouseEvent.KoefPixToMM = 5;
					}
					this.HtmlPage.onMouseDown(e.touches ? e.touches[0] : e);
					global_mouseEvent.KoefPixToMM = 1;
					break;
				}
				case MobileTouchMode.Zoom:
				{
					this.HtmlPage.NoneRepaintPages = true;

					var _x1 = (e.touches[0].pageX !== undefined) ? e.touches[0].pageX : e.touches[0].clientX;
					var _y1 = (e.touches[0].pageY !== undefined) ? e.touches[0].pageY : e.touches[0].clientY;

					var _x2 = (e.touches[1].pageX !== undefined) ? e.touches[1].pageX : e.touches[1].clientX;
					var _y2 = (e.touches[1].pageY !== undefined) ? e.touches[1].pageY : e.touches[1].clientY;

					this.ZoomDistance = Math.sqrt((_x1 - _x2) * (_x1 - _x2) + (_y1 - _y2) * (_y1 - _y2));
					this.ZoomValue    = this.HtmlPage.m_nZoomValue;

					break;
				}
				case MobileTouchMode.Cursor:
				{
					this.Mode      = MobileTouchMode.Scroll;
					this.DownPoint = this.DrawingDocument.ConvertCoordsFromCursor2(global_mouseEvent.X, global_mouseEvent.Y);
					break;
				}
				case MobileTouchMode.TableMove:
				{
					// так как был уже check, нужно уменьшить количество кликов
					if (global_mouseEvent.ClickCount > 0)
						global_mouseEvent.ClickCount--;
					this.HtmlPage.onMouseDown(e.touches ? e.touches[0] : e);
					break;
				}
				case MobileTouchMode.TableRuler:
				{
					this.HtmlPage.OnUpdateOverlay();
					break;
				}
			}

			if (this.HtmlPage.m_oApi.isViewMode)
			{
				if (e.preventDefault)
					e.preventDefault();
				else
					e.returnValue = false;
				return false;
			}
		};
		this.onTouchMove  = function(e)
		{
			if (null != this.DrawingDocument.m_oDocumentRenderer)
				return this.onTouchMove_renderer(e);

			if (this.Mode != MobileTouchMode.FlowObj && this.Mode != MobileTouchMode.TableMove)
				check_MouseMoveEvent(e.touches ? e.touches[0] : e);

			if (!this.MoveAfterDown)
			{
				if (Math.abs(this.DownPointOriginal.X - global_mouseEvent.X) > this.MoveMinDist ||
					Math.abs(this.DownPointOriginal.Y - global_mouseEvent.Y) > this.MoveMinDist)
				{
					this.MoveAfterDown = true;
				}
			}

			switch (this.Mode)
			{
				case MobileTouchMode.Cursor:
				{
					var pos = this.DrawingDocument.ConvertCoordsFromCursor2(global_mouseEvent.X, global_mouseEvent.Y);

					var old_click_count          = global_mouseEvent.ClickCount;
					global_mouseEvent.ClickCount = 1;

					var nearPos = this.LogicDocument.Get_NearestPos(pos.Page, pos.X, pos.Y);

					this.DrawingDocument.NeedScrollToTargetFlag = true;
					global_mouseEvent.Type                      = g_mouse_event_type_down;
					this.LogicDocument.OnMouseDown(global_mouseEvent, nearPos.X, nearPos.Y + nearPos.Height / 2, pos.Page);
					global_mouseEvent.Type = g_mouse_event_type_up;
					this.LogicDocument.OnMouseUp(global_mouseEvent, nearPos.X, nearPos.Y + nearPos.Height / 2, pos.Page);
					this.DrawingDocument.NeedScrollToTargetFlag = false;

					global_mouseEvent.ClickCount = old_click_count;

					break;
				}
				case MobileTouchMode.Scroll:
				{
					var _newTime = new Date().getTime();
					if ((_newTime - this.TimeDown) > this.ReadingGlassTime && !this.MoveAfterDown)
					{
						this.Mode = MobileTouchMode.Cursor;

						var pos = this.DrawingDocument.ConvertCoordsFromCursor2(global_mouseEvent.X, global_mouseEvent.Y);

						var old_click_count          = global_mouseEvent.ClickCount;
						global_mouseEvent.ClickCount = 1;

						var nearPos = this.LogicDocument.Get_NearestPos(pos.Page, pos.X, pos.Y);

						this.DrawingDocument.NeedScrollToTargetFlag = true;
						global_mouseEvent.Type                      = g_mouse_event_type_down;
						this.LogicDocument.OnMouseDown(global_mouseEvent, nearPos.X, nearPos.Y, pos.Page);
						global_mouseEvent.Type = g_mouse_event_type_up;
						this.LogicDocument.OnMouseUp(global_mouseEvent, nearPos.X, nearPos.Y, pos.Page);
						this.DrawingDocument.NeedScrollToTargetFlag = false;

						global_mouseEvent.ClickCount = old_click_count;
					}
					else
					{
						var _offsetX = global_mouseEvent.X - this.DownPointOriginal.X;
						var _offsetY = global_mouseEvent.Y - this.DownPointOriginal.Y;

						this.iScroll._move(e);
						/*
						 if (_offsetX != 0 && this.HtmlPage.m_dScrollX_max > 0)
						 {
						 this.HtmlPage.m_oScrollHorApi.scrollToX(this.ScrollH - _offsetX);
						 }
						 if (_offsetY != 0 && this.HtmlPage.m_dScrollY_max > 0)
						 {
						 this.HtmlPage.m_oScrollVerApi.scrollToY(this.ScrollV - _offsetY);
						 }*/

						AscCommon.stopEvent(e);
					}
					break;
				}
				case MobileTouchMode.Zoom:
				{
					if (2 != e.touches.length)
					{
						this.Mode = MobileTouchMode.None;
						return;
					}

					var _x1 = (e.touches[0].pageX !== undefined) ? e.touches[0].pageX : e.touches[0].clientX;
					var _y1 = (e.touches[0].pageY !== undefined) ? e.touches[0].pageY : e.touches[0].clientY;

					var _x2 = (e.touches[1].pageX !== undefined) ? e.touches[1].pageX : e.touches[1].clientX;
					var _y2 = (e.touches[1].pageY !== undefined) ? e.touches[1].pageY : e.touches[1].clientY;

					var zoomCurrentDist = Math.sqrt((_x1 - _x2) * (_x1 - _x2) + (_y1 - _y2) * (_y1 - _y2));

					if (zoomCurrentDist == 0)
						zoomCurrentDist = 1;

					var _zoomFix = this.ZoomValue / 100;
					var _zoomCur = _zoomFix * (zoomCurrentDist / this.ZoomDistance);

					_zoomCur = (_zoomCur * 100) >> 0;
					if (_zoomCur < this.ZoomValueMin)
						_zoomCur = this.ZoomValueMin;
					else if (_zoomCur > this.ZoomValueMax)
						_zoomCur = this.ZoomValueMax;

					this.HtmlPage.m_oApi.zoom(_zoomCur);
                    AscCommon.stopEvent(e);
					break;
				}
				case MobileTouchMode.InlineObj:
				{
					break;
				}
				case MobileTouchMode.FlowObj:
				{
					this.HtmlPage.onMouseMove(e.touches ? e.touches[0] : e);
					AscCommon.stopEvent(e);
					break;
				}
				case MobileTouchMode.Select:
				{
					// во время движения может смениться порядок ректов
					global_mouseEvent.ClickCount = 1;
					var pos                      = this.DrawingDocument.ConvertCoordsFromCursor2(global_mouseEvent.X, global_mouseEvent.Y);
					this.LogicDocument.OnMouseMove(global_mouseEvent, pos.X, pos.Y, pos.Page);
					AscCommon.stopEvent(e);
					break;
				}
				case MobileTouchMode.TableMove:
				{
					this.HtmlPage.onMouseMove(e.touches ? e.touches[0] : e);
					AscCommon.stopEvent(e);
					break;
				}
				case MobileTouchMode.TableRuler:
				{
					var pos = this.DrawingDocument.ConvertCoordsFromCursorPage(global_mouseEvent.X, global_mouseEvent.Y, this.DrawingDocument.TableOutlineDr.CurrentPageIndex);

					var _Transform = null;
					if (this.DrawingDocument.TableOutlineDr)
						_Transform = this.DrawingDocument.TableOutlineDr.TableMatrix;

					if (_Transform && !global_MatrixTransformer.IsIdentity(_Transform))
					{
						var _invert = _Transform.CreateDublicate();
						_invert.Invert();

						var __x = _invert.TransformPointX(pos.X, pos.Y);
						var __y = _invert.TransformPointY(pos.X, pos.Y);

						pos.X = __x;
						pos.Y = __y;
					}

					if (this.TableCurrentMoveDir == 0)
					{
						this.TableCurrentMoveValue = pos.X;

						if (null != this.TableCurrentMoveValueMin)
						{
							if (this.TableCurrentMoveValueMin > this.TableCurrentMoveValue)
								this.TableCurrentMoveValue = this.TableCurrentMoveValueMin;
						}
						if (null != this.TableCurrentMoveValueMax)
						{
							if (this.TableCurrentMoveValueMax < this.TableCurrentMoveValue)
								this.TableCurrentMoveValue = this.TableCurrentMoveValueMax;
						}
					}
					else
					{
						this.TableCurrentMoveValue = pos.Y;

						if (null != this.TableCurrentMoveValueMin)
						{
							if (this.TableCurrentMoveValueMin > this.TableCurrentMoveValue)
								this.TableCurrentMoveValue = this.TableCurrentMoveValueMin;
						}
						if (null != this.TableCurrentMoveValueMax)
						{
							if (this.TableCurrentMoveValueMax < this.TableCurrentMoveValue)
								this.TableCurrentMoveValue = this.TableCurrentMoveValueMax;
						}
					}
					this.HtmlPage.OnUpdateOverlay();

					AscCommon.stopEvent(e);
					break;
				}
				default:
					break;
			}
		};
		this.onTouchEnd   = function(e)
		{
			this.IsTouching = false;

			if (null != this.DrawingDocument.m_oDocumentRenderer)
				return this.onTouchEnd_renderer(e);

			if (this.Mode != MobileTouchMode.FlowObj && this.Mode != MobileTouchMode.TableMove)
            {
				check_MouseUpEvent(e.changedTouches ? e.changedTouches[0] : e);
            }

			this.ScrollH = this.HtmlPage.m_dScrollX;
			this.ScrollV = this.HtmlPage.m_dScrollY;

			var isCheckContextMenuMode = true;

			switch (this.Mode)
			{
				case MobileTouchMode.Cursor:
				{
					// ничего не делаем. курсор уже установлен
					this.Mode = MobileTouchMode.None;
					break;
				}
				case MobileTouchMode.Scroll:
				{
					if (!this.MoveAfterDown)
					{
						global_mouseEvent.Button = 0;
						var pos                  = this.DrawingDocument.ConvertCoordsFromCursor2(global_mouseEvent.X, global_mouseEvent.Y);

						this.LogicDocument.OnMouseDown(global_mouseEvent, pos.X, pos.Y, pos.Page);
						global_mouseEvent.Type = g_mouse_event_type_up;
						this.LogicDocument.OnMouseUp(global_mouseEvent, pos.X, pos.Y, pos.Page);

						this.LogicDocument.Document_UpdateInterfaceState();

						var horRuler      = this.HtmlPage.m_oHorRuler;
						var _oldRulerType = horRuler.CurrentObjectType;
						this.LogicDocument.Document_UpdateRulersState();

						if (horRuler.CurrentObjectType != _oldRulerType)
							this.HtmlPage.OnUpdateOverlay();

						this.LogicDocument.Update_CursorType(pos.X, pos.Y, pos.Page, global_mouseEvent);

						this.HtmlPage.m_oApi.sendEvent("asc_onTapEvent", e);
					}
					else
					{
						// нужно запускать анимацию скролла, если она есть
						// TODO:
						isCheckContextMenuMode = false;
						this.iScroll._end(e);
					}

					this.Mode = MobileTouchMode.None;
					break;
				}
				case MobileTouchMode.Zoom:
				{
					// здесь нужно запускать отрисовку, если есть анимация зума
					this.HtmlPage.NoneRepaintPages = false;
					this.HtmlPage.m_bIsFullRepaint = true;
					this.HtmlPage.OnScroll();

					this.Mode = MobileTouchMode.None;
					isCheckContextMenuMode = false;
					break;
				}
				case MobileTouchMode.InlineObj:
				{
					// TODO:
					break;
				}
				case MobileTouchMode.FlowObj:
				{
					// TODO:
					this.HtmlPage.onMouseUp(e.changedTouches ? e.changedTouches[0] : e);
					this.Mode = MobileTouchMode.None;
					break;
				}
				case MobileTouchMode.Select:
				{
					// ничего не нужно делать
					this.DragSelect = 0;
					this.Mode       = MobileTouchMode.None;
					var pos         = this.DrawingDocument.ConvertCoordsFromCursor2(global_mouseEvent.X, global_mouseEvent.Y);
                    this.LogicDocument.OnMouseUp(global_mouseEvent, pos.X, pos.Y, pos.Page);
                    AscCommon.stopEvent(e);
					break;
				}
				case MobileTouchMode.TableMove:
				{
					this.HtmlPage.onMouseUp(e.changedTouches ? e.changedTouches[0] : e);
					this.Mode = MobileTouchMode.None;
					break;
				}
				case MobileTouchMode.TableRuler:
				{
					this.HtmlPage.StartUpdateOverlay();

					this.Mode = MobileTouchMode.None;

					var _xOffset = this.HtmlPage.X;
					var _yOffset = this.HtmlPage.Y;

					if (true === this.HtmlPage.m_bIsRuler)
					{
						_xOffset += (5 * g_dKoef_mm_to_pix);
						_yOffset += (7 * g_dKoef_mm_to_pix);
					}

					var pos = this.DrawingDocument.ConvertCoordsFromCursorPage(global_mouseEvent.X, global_mouseEvent.Y, this.DrawingDocument.TableOutlineDr.CurrentPageIndex);

					var _Transform = null;
					if (this.DrawingDocument.TableOutlineDr)
						_Transform = this.DrawingDocument.TableOutlineDr.TableMatrix;

					if (_Transform && !global_MatrixTransformer.IsIdentity(_Transform))
					{
						var _invert = _Transform.CreateDublicate();
						_invert.Invert();

						var __x = _invert.TransformPointX(pos.X, pos.Y);
						var __y = _invert.TransformPointY(pos.X, pos.Y);

						pos.X = __x;
						pos.Y = __y;
					}

					if (this.TableCurrentMoveDir == 0)
					{
						this.TableCurrentMoveValue = pos.X;

						if (null != this.TableCurrentMoveValueMin)
						{
							if (this.TableCurrentMoveValueMin > this.TableCurrentMoveValue)
								this.TableCurrentMoveValue = this.TableCurrentMoveValueMin;
						}
						if (null != this.TableCurrentMoveValueMax)
						{
							if (this.TableCurrentMoveValueMax < this.TableCurrentMoveValue)
								this.TableCurrentMoveValue = this.TableCurrentMoveValueMax;
						}

						var _markup                            = this.HtmlPage.m_oHorRuler.m_oTableMarkup;
						_markup.Cols[this.TableCurrentMovePos] += (this.TableCurrentMoveValue - this.TableCurrentMoveValueOld);
						_markup.Cols[this.TableCurrentMovePos] = Math.max(_markup.Cols[this.TableCurrentMovePos], 1);

						if ( false === this.HtmlPage.m_oLogicDocument.Document_Is_SelectionLocked(AscCommon.changestype_Table_Properties) )
                        {
                            this.HtmlPage.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Document_SetTableMarkup_Hor);
                            _markup.Table.Update_TableMarkupFromRuler(_markup, true, this.TableCurrentMovePos + 1);
                            this.HtmlPage.m_oLogicDocument.Document_UpdateInterfaceState();
                        }
					}
					else
					{
						this.TableCurrentMoveValue = pos.Y;

						if (null != this.TableCurrentMoveValueMin)
						{
							if (this.TableCurrentMoveValueMin > this.TableCurrentMoveValue)
								this.TableCurrentMoveValue = this.TableCurrentMoveValueMin;
						}
						if (null != this.TableCurrentMoveValueMax)
						{
							if (this.TableCurrentMoveValueMax < this.TableCurrentMoveValue)
								this.TableCurrentMoveValue = this.TableCurrentMoveValueMax;
						}

						var _markup = this.HtmlPage.m_oHorRuler.m_oTableMarkup;
						_markup.Rows[this.TableCurrentMovePos].H += (this.TableCurrentMoveValue - this.TableCurrentMoveValueOld);

						if ( false === this.HtmlPage.m_oLogicDocument.Document_Is_SelectionLocked(AscCommon.changestype_Table_Properties) )
                        {
                            this.HtmlPage.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Document_SetTableMarkup_Hor);
                            _markup.Table.Update_TableMarkupFromRuler(_markup, false, this.TableCurrentMovePos + 1);
                            this.HtmlPage.m_oLogicDocument.Document_UpdateInterfaceState();
                        }
					}

					this.HtmlPage.OnUpdateOverlay();
					this.HtmlPage.EndUpdateOverlay();

					break;
				}
				default:
					break;
			}

			if (this.HtmlPage.m_oApi.isViewMode)
			{
				if (e.preventDefault)
					e.preventDefault();
				else
					e.returnValue = false;
				return false;
			}

			if (true !== this.iScroll.isAnimating)
				this.CheckContextMenuTouchEnd(isCheckContextMenuMode);
		};

		this.onTouchStart_renderer = function(e)
		{
			check_MouseDownEvent(e.touches ? e.touches[0] : e, true);
			global_mouseEvent.LockMouse();

			this.ScrollH = this.HtmlPage.m_dScrollX;
			this.ScrollV = this.HtmlPage.m_dScrollY;

			this.MoveAfterDown = false;

			if (e.touches && 2 == e.touches.length)
			{
				this.Mode = MobileTouchMode.Zoom;
			}

			switch (this.Mode)
			{
				case MobileTouchMode.None:
				{
					this.Mode      = MobileTouchMode.Scroll;
					this.DownPoint = this.DrawingDocument.ConvertCoordsFromCursor2(global_mouseEvent.X, global_mouseEvent.Y);

					this.DownPointOriginal.X = global_mouseEvent.X;
					this.DownPointOriginal.Y = global_mouseEvent.Y;

					this.iScroll._start(e);

					break;
				}
				case MobileTouchMode.Scroll:
				{
					// ничего не меняем, просто перемещаем точку
					this.DownPoint           = this.DrawingDocument.ConvertCoordsFromCursor2(global_mouseEvent.X, global_mouseEvent.Y);
					this.DownPointOriginal.X = global_mouseEvent.X;
					this.DownPointOriginal.Y = global_mouseEvent.Y;

					this.iScroll._start(e);

					break;
				}
				case MobileTouchMode.Zoom:
				{
					this.HtmlPage.NoneRepaintPages = true;

					var _x1 = (e.touches[0].pageX !== undefined) ? e.touches[0].pageX : e.touches[0].clientX;
					var _y1 = (e.touches[0].pageY !== undefined) ? e.touches[0].pageY : e.touches[0].clientY;

					var _x2 = (e.touches[1].pageX !== undefined) ? e.touches[1].pageX : e.touches[1].clientX;
					var _y2 = (e.touches[1].pageY !== undefined) ? e.touches[1].pageY : e.touches[1].clientY;

					this.ZoomDistance = Math.sqrt((_x1 - _x2) * (_x1 - _x2) + (_y1 - _y2) * (_y1 - _y2));
					this.ZoomValue    = this.HtmlPage.m_nZoomValue;

					break;
				}
			}

			if (e.preventDefault)
				e.preventDefault();
			else
				e.returnValue = false;
		};
		this.onTouchMove_renderer  = function(e)
		{
			check_MouseMoveEvent(e.touches ? e.touches[0] : e);

			if (!this.MoveAfterDown)
			{
				if (Math.abs(this.DownPointOriginal.X - global_mouseEvent.X) > this.MoveMinDist ||
					Math.abs(this.DownPointOriginal.Y - global_mouseEvent.Y) > this.MoveMinDist)
				{
					this.MoveAfterDown = true;
				}
			}

			switch (this.Mode)
			{
				case MobileTouchMode.Scroll:
				{
					var _offsetX = global_mouseEvent.X - this.DownPointOriginal.X;
					var _offsetY = global_mouseEvent.Y - this.DownPointOriginal.Y;

					this.iScroll._move(e);
					break;
				}
				case MobileTouchMode.Zoom:
				{
					if (2 != e.touches.length)
					{
						this.Mode = MobileTouchMode.None;
						return;
					}

					var _x1 = (e.touches[0].pageX !== undefined) ? e.touches[0].pageX : e.touches[0].clientX;
					var _y1 = (e.touches[0].pageY !== undefined) ? e.touches[0].pageY : e.touches[0].clientY;

					var _x2 = (e.touches[1].pageX !== undefined) ? e.touches[1].pageX : e.touches[1].clientX;
					var _y2 = (e.touches[1].pageY !== undefined) ? e.touches[1].pageY : e.touches[1].clientY;

					var zoomCurrentDist = Math.sqrt((_x1 - _x2) * (_x1 - _x2) + (_y1 - _y2) * (_y1 - _y2));

					if (zoomCurrentDist == 0)
						zoomCurrentDist = 1;

					var _zoomFix = this.ZoomValue / 100;
					var _zoomCur = _zoomFix * (zoomCurrentDist / this.ZoomDistance);

					_zoomCur = (_zoomCur * 100) >> 0;
					if (_zoomCur < this.ZoomValueMin)
						_zoomCur = this.ZoomValueMin;
					else if (_zoomCur > this.ZoomValueMax)
						_zoomCur = this.ZoomValueMax;

					this.HtmlPage.m_oApi.zoom(_zoomCur);

					break;
				}
				default:
					break;
			}

			if (e.preventDefault)
				e.preventDefault();
			else
				e.returnValue = false;
		};
		this.onTouchEnd_renderer   = function(e)
		{
			check_MouseUpEvent(e.changedTouches ? e.changedTouches[0] : e);

			this.ScrollH = this.HtmlPage.m_dScrollX;
			this.ScrollV = this.HtmlPage.m_dScrollY;

			switch (this.Mode)
			{
				case MobileTouchMode.Scroll:
				{
					this.iScroll._end(e);
					this.Mode = MobileTouchMode.None;

					if (!this.MoveAfterDown)
					{
						this.HtmlPage.m_oApi.sendEvent("asc_onTapEvent", e);
					}
					break;
				}
				case MobileTouchMode.Zoom:
				{
					// здесь нужно запускать отрисовку, если есть анимация зума
					this.HtmlPage.NoneRepaintPages = false;
					this.HtmlPage.m_bIsFullRepaint = true;
					this.HtmlPage.OnScroll();

					this.Mode = MobileTouchMode.None;
					break;
				}
				default:
					break;
			}

			if (e.preventDefault)
				e.preventDefault();
			else
				e.returnValue = false;
		};

		this.CheckZoomCriticalValues = function(zoomMin)
		{
			if (zoomMin !== undefined)
			{
				this.ZoomValueMin = zoomMin;
				return;
			}

			var w = this.HtmlPage.m_oEditor.AbsolutePosition.R - this.HtmlPage.m_oEditor.AbsolutePosition.L;

			var Zoom = 100;
			if (0 != this.HtmlPage.m_dDocumentPageWidth)
			{
				Zoom = 100 * (w - 10) / this.HtmlPage.m_dDocumentPageWidth;

				if (Zoom < 5)
					Zoom = 5;

				if (this.HtmlPage.m_oApi.isMobileVersion)
				{
					var _w = this.HtmlPage.m_oEditor.HtmlElement.width;
					if (this.HtmlPage.bIsRetinaSupport)
					{
						_w >>= 1;
					}
					Zoom = 100 * _w * AscCommon.g_dKoef_pix_to_mm / this.HtmlPage.m_dDocumentPageWidth;
				}
			}
			var _new_value = (Zoom - 0.5) >> 0;

			this.ZoomValueMin = _new_value;
			if (this.ZoomValue < this.ZoomValueMin)
			{
				this.ZoomValue = this.ZoomValueMin;
				this.HtmlPage.m_oApi.zoom(this.ZoomValue);
			}
		};

		this.Resize = function()
		{
			if (this.iScroll != null)
			{
				this.iScroll.scroller.style.width = this.HtmlPage.m_dDocumentWidth + "px";
				this.iScroll.scroller.style.height = this.HtmlPage.m_dDocumentHeight + "px";

				this.iScroll.refresh(true);
			}
		};

		this.SendShowContextMenu = function()
		{
			if (-1 != this.ContextMenuShowTimerId)
			{
				clearTimeout(this.ContextMenuShowTimerId);
			}
			var that             = this;
			this.ContextMenuShowTimerId = setTimeout(function()
			{
				var _pos = that.GetContextMenuPosition();
				that.HtmlPage.m_oApi.sendEvent("asc_onShowPopMenu", _pos.X, _pos.Y, (_pos.Mode > 1) ? true : false);
			}, 500);
		};

		this.GetContextMenuPosition = function()
		{
			var _posX = 0;
			var _posY = 0;
			var _page = 0;
			var _transform = null;
			var tmpX, tmpY, tmpX2, tmpY2;
			var _pos = null;

			var _mode = 0;

			var _target = this.LogicDocument.Is_SelectionUse();
			if (_target === false)
			{
				_posX = this.DrawingDocument.m_dTargetX;
				_posY = this.DrawingDocument.m_dTargetY;
				_page = this.DrawingDocument.m_lTargetPage;
				_transform = this.DrawingDocument.TextMatrix;

				if (_transform)
				{
					tmpX = _transform.TransformPointX(_posX, _posY);
					tmpY = _transform.TransformPointY(_posX, _posY);
				}
				else
				{
					tmpX = _posX;
					tmpY = _posY;
				}

				_pos = this.DrawingDocument.ConvertCoordsToCursorWR(tmpX, tmpY, _page);
				_posX = _pos.X;
				_posY = _pos.Y;

				_mode = 1;
			}

			var _select = this.LogicDocument.Get_SelectionBounds();
			if (_select)
			{
				var _rect1 = _select.Start;
				var _rect2 = _select.End;

				tmpX = _rect1.X;
				tmpY = _rect1.Y;
				tmpX2 = _rect2.X + _rect2.W;
				tmpY2 = _rect2.Y + _rect2.H;

				_transform = this.DrawingDocument.SelectionMatrix;

				if (_transform)
				{
					_posX = _transform.TransformPointX(tmpX, tmpY);
					_posY = _transform.TransformPointY(tmpX, tmpY);

					tmpX = _posX;
					tmpY = _posY;

					_posX = _transform.TransformPointX(tmpX2, tmpY2);
					_posY = _transform.TransformPointY(tmpX2, tmpY2);

					tmpX2 = _posX;
					tmpY2 = _posY;
				}

				_pos = this.DrawingDocument.ConvertCoordsToCursorWR(tmpX, tmpY, _rect1.Page);
				_posX = _pos.X;
				_posY = _pos.Y;

				_pos = this.DrawingDocument.ConvertCoordsToCursorWR(tmpX2, tmpY2, _rect2.Page);
				_posX += _pos.X;
				_posX = _posX >> 1;

				_mode = 2;
			}

			var _object_bounds = this.LogicDocument.DrawingObjects.getSelectedObjectsBounds();
			if ((0 == _mode) && _object_bounds)
			{
				_pos = this.DrawingDocument.ConvertCoordsToCursorWR(_object_bounds.minX, _object_bounds.minY, _object_bounds.pageIndex);
				_posX = _pos.X;
				_posY = _pos.Y;

				_pos = this.DrawingDocument.ConvertCoordsToCursorWR(_object_bounds.maxX, _object_bounds.maxY, _object_bounds.pageIndex);
				_posX += _pos.X;
				_posX = _posX >> 1;

				_mode = 3;
			}

			return { X : _posX, Y : _posY, Mode : _mode };
		};

		this.GetContextMenuType = function()
		{
			var _mode = 0;

			if (!this.LogicDocument.Is_SelectionUse())
				_mode = 1; // target

			if (this.LogicDocument.Get_SelectionBounds())
				_mode = 2; // select

			if (_mode == 0 && this.LogicDocument.DrawingObjects.getSelectedObjectsBounds())
				_mode = 3; // object

			return _mode;
		};

		this.CheckContextMenuTouchEnd = function(isCheck)
		{
			// isCheck: если пришли сюда после скролла или зума (или их анимации) - то не нужно проверять состояние редактора.
			// Нужно проверять последнее сохраненной состояние

			if (isCheck)
			{
				var _mode = this.GetContextMenuType();
				if (_mode == this.ContextMenuLastMode)
				{
					this.ContextMenuLastModeCounter++;
					this.ContextMenuLastModeCounter &= 0x01;
				}
				else
					this.ContextMenuLastModeCounter = 0;

				this.ContextMenuLastMode = _mode;
			}

			if (this.ContextMenuLastMode > 0 && 1 == this.ContextMenuLastModeCounter)
				this.SendShowContextMenu();
		};

		this.ClearContextMenu = function()
		{
			this.ContextMenuLastMode 		= 0;
			this.ContextMenuLastModeCounter = 0;
			this.HtmlPage.m_oApi.sendEvent("asc_onHidePopMenu");
		};

		this.OnScrollAnimationEnd = function()
		{
			if (this.HtmlPage.m_oApi.isViewMode)
				return;

			this.CheckContextMenuTouchEnd(false);
		};

		this.CheckSelectRects = function()
		{
			this.RectSelect1 = null;
			this.RectSelect2 = null;

			if (!this.LogicDocument)
				return;

			var _select = this.LogicDocument.Get_SelectionBounds();
			if (!_select)
				return;

			var _rect1 = _select.Start;
			var _rect2 = _select.End;

			if (!_rect1 || !_rect2)
				return;

			this.RectSelect1 	= new AscCommon._rect();
			this.RectSelect1.x 	= _rect1.X;
			this.RectSelect1.y 	= _rect1.Y;
			this.RectSelect1.w 	= _rect1.W;
			this.RectSelect1.h 	= _rect1.H;
			this.PageSelect1 	= _rect1.Page;

			this.RectSelect2 	= new AscCommon._rect();
			this.RectSelect2.x 	= _rect2.X;
			this.RectSelect2.y 	= _rect2.Y;
			this.RectSelect2.w 	= _rect2.W;
			this.RectSelect2.h 	= _rect2.H;
			this.PageSelect2 	= _rect2.Page;
		};

		this.CheckSelect = function(overlay)
		{
			this.CheckSelectRects();
			if (null == this.RectSelect1 || null == this.RectSelect2)
				return;

			var _matrix = this.DrawingDocument.SelectionMatrix;
			var ctx         = overlay.m_oContext;
			ctx.strokeStyle = "#146FE1";
			ctx.fillStyle 	= "#146FE1";

			if (!_matrix || global_MatrixTransformer.IsIdentity(_matrix))
			{
				var pos1 = this.DrawingDocument.ConvertCoordsToCursorWR(this.RectSelect1.x, this.RectSelect1.y, this.PageSelect1);
				var pos2 = this.DrawingDocument.ConvertCoordsToCursorWR(this.RectSelect1.x, this.RectSelect1.y + this.RectSelect1.h, this.PageSelect1);

				var pos3 = this.DrawingDocument.ConvertCoordsToCursorWR(this.RectSelect2.x + this.RectSelect2.w, this.RectSelect2.y, this.PageSelect2);
				var pos4 = this.DrawingDocument.ConvertCoordsToCursorWR(this.RectSelect2.x + this.RectSelect2.w, this.RectSelect2.y + this.RectSelect2.h, this.PageSelect2);

				ctx.beginPath();

				ctx.moveTo(pos1.X >> 0, pos1.Y >> 0);
				ctx.lineTo(pos2.X >> 0, pos2.Y >> 0);

				ctx.moveTo(pos3.X >> 0, pos3.Y >> 0);
				ctx.lineTo(pos4.X >> 0, pos4.Y >> 0);

				ctx.lineWidth = 2;
				ctx.stroke();

				ctx.beginPath();

				overlay.AddEllipse(pos1.X, pos1.Y - 5, MOBILE_SELECT_TRACK_ROUND / 2);
				overlay.AddEllipse(pos4.X, pos4.Y + 5, MOBILE_SELECT_TRACK_ROUND / 2);
				ctx.fill();

				ctx.beginPath();
			}
			else
			{
				var _xx11 = _matrix.TransformPointX(this.RectSelect1.x, this.RectSelect1.y);
				var _yy11 = _matrix.TransformPointY(this.RectSelect1.x, this.RectSelect1.y);

				var _xx12 = _matrix.TransformPointX(this.RectSelect1.x, this.RectSelect1.y + this.RectSelect1.h);
				var _yy12 = _matrix.TransformPointY(this.RectSelect1.x, this.RectSelect1.y + this.RectSelect1.h);

				var _xx21 = _matrix.TransformPointX(this.RectSelect2.x + this.RectSelect2.w, this.RectSelect2.y);
				var _yy21 = _matrix.TransformPointY(this.RectSelect2.x + this.RectSelect2.w, this.RectSelect2.y);

				var _xx22 = _matrix.TransformPointX(this.RectSelect2.x + this.RectSelect2.w, this.RectSelect2.y + this.RectSelect2.h);
				var _yy22 = _matrix.TransformPointY(this.RectSelect2.x + this.RectSelect2.w, this.RectSelect2.y + this.RectSelect2.h);

				var pos1 = this.DrawingDocument.ConvertCoordsToCursorWR(_xx11, _yy11, this.PageSelect1);
				var pos2 = this.DrawingDocument.ConvertCoordsToCursorWR(_xx12, _yy12, this.PageSelect1);

				var pos3 = this.DrawingDocument.ConvertCoordsToCursorWR(_xx21, _yy21, this.PageSelect2);
				var pos4 = this.DrawingDocument.ConvertCoordsToCursorWR(_xx22, _yy22, this.PageSelect2);

				ctx.beginPath();

				ctx.moveTo(pos1.X, pos1.Y);
				ctx.lineTo(pos2.X, pos2.Y);

				ctx.moveTo(pos3.X, pos3.Y);
				ctx.lineTo(pos4.X, pos4.Y);

				ctx.lineWidth = 2;
				ctx.stroke();

				ctx.beginPath();

				var ex01 = _matrix.TransformPointX(0, 0);
				var ey01 = _matrix.TransformPointY(0, 0);

				var ex11 = _matrix.TransformPointX(0, 1);
				var ey11 = _matrix.TransformPointY(0, 1);

				var _len = Math.sqrt((ex11 - ex01) * (ex11 - ex01) + (ey11 - ey01) * (ey11 - ey01));
				if (_len == 0)
					_len = 0.01;

				var ex = 5 * (ex11 - ex01) / _len;
				var ey = 5 * (ey11 - ey01) / _len;

				var _x1 = (pos1.X - ex) >> 0;
				var _y1 = (pos1.Y - ey) >> 0;

				var _x2 = (pos4.X + ex) >> 0;
				var _y2 = (pos4.Y + ey) >> 0;

				overlay.AddEllipse(_x1, _y1, MOBILE_SELECT_TRACK_ROUND / 2);
				overlay.AddEllipse(_x2, _y2, MOBILE_SELECT_TRACK_ROUND / 2);
				ctx.fill();

				ctx.beginPath();
			}
		};

		this.CheckTableRules = function(overlay)
		{
			if (this.HtmlPage.m_oApi.isViewMode)
				return;

			var horRuler = this.HtmlPage.m_oHorRuler;
			var verRuler = this.HtmlPage.m_oVerRuler;

			var _table_outline_dr = this.DrawingDocument.TableOutlineDr;
			var _tableOutline     = _table_outline_dr.TableOutline;

			if (horRuler.CurrentObjectType != RULER_OBJECT_TYPE_TABLE || verRuler.CurrentObjectType != RULER_OBJECT_TYPE_TABLE || !_tableOutline)
			{
				this.TableMovePoint      = null;
				this.TableHorRulerPoints = null;
				this.TableVerRulerPoints = null;
				return;
			}

			if (!window.g_table_track_mobile_move.asc_complete)
				return;

			var _table_markup = horRuler.m_oTableMarkup;
			if (_table_markup.Rows.length == 0)
			    return;

			this.HtmlPage.CheckShowOverlay();

			var _epsRects  = this.TableRulersRectOffset;
			var _rectWidth = this.TableRulersRectSize;

			var ctx = overlay.m_oContext;
			ctx.strokeStyle = "#616161";
			ctx.lineWidth   = 1;

			var _tableW = 0;
			var _cols   = _table_markup.Cols;
			for (var i = 0; i < _cols.length; i++)
			{
				_tableW += _cols[i];
			}

			if (!_table_outline_dr.TableMatrix || global_MatrixTransformer.IsIdentity(_table_outline_dr.TableMatrix))
			{
				this.TableMovePoint = {X : _tableOutline.X, Y : _tableOutline.Y};

				var pos1 = this.DrawingDocument.ConvertCoordsToCursorWR(_tableOutline.X, _tableOutline.Y, _tableOutline.PageNum);
				var pos2 = this.DrawingDocument.ConvertCoordsToCursorWR(_tableOutline.X + _tableW, _tableOutline.Y, _tableOutline.PageNum);

				ctx.beginPath();

				var TableMoveRect_x = (pos1.X >> 0) + 0.5 - (_epsRects + _rectWidth);
				var TableMoveRect_y = (pos1.Y >> 0) + 0.5 - (_epsRects + _rectWidth);

				overlay.CheckPoint(TableMoveRect_x, TableMoveRect_y);
				overlay.CheckPoint(TableMoveRect_x + _rectWidth, TableMoveRect_y + _rectWidth);
				ctx.drawImage(window.g_table_track_mobile_move, TableMoveRect_x, TableMoveRect_y);

				var gradObj = ctx.createLinearGradient((pos1.X >> 0) + 0.5, TableMoveRect_y, (pos1.X >> 0) + 0.5, TableMoveRect_y + _rectWidth);
				gradObj.addColorStop(0, "#f1f1f1");
				gradObj.addColorStop(1, "#dfdfdf");
				ctx.fillStyle = gradObj;

				overlay.AddRoundRect((pos1.X >> 0) + 0.5, TableMoveRect_y, (pos2.X - pos1.X) >> 0, _rectWidth, 4);

				ctx.fill();
				ctx.stroke();

				ctx.beginPath();

				var _count = _table_markup.Rows.length;
				var _y1    = 0;
				var _y2    = 0;
				for (var i = 0; i < _count; i++)
				{
					if (i == 0)
						_y1 = _table_markup.Rows[i].Y;

					_y2 = _table_markup.Rows[i].Y;
					_y2 += _table_markup.Rows[i].H;
				}

				var pos3 = this.DrawingDocument.ConvertCoordsToCursorWR(_tableOutline.X, _y1, this.DrawingDocument.m_lCurrentPage);
				var pos4 = this.DrawingDocument.ConvertCoordsToCursorWR(_tableOutline.X, _y2, this.DrawingDocument.m_lCurrentPage);

				var _ttX = (pos1.X >> 0) + 0.5 - (_epsRects + _rectWidth);
				gradObj  = ctx.createLinearGradient(_ttX, (pos3.Y >> 0) + 0.5, _ttX, (pos3.Y >> 0) + 0.5 + (pos4.Y - pos3.Y) >> 0);
				gradObj.addColorStop(0, "#f1f1f1");
				gradObj.addColorStop(1, "#dfdfdf");
				ctx.fillStyle = gradObj;

				overlay.AddRoundRect((pos1.X >> 0) + 1.5 - (_epsRects + _rectWidth), (pos3.Y >> 0) + 0.5, _rectWidth - 1, (pos4.Y - pos3.Y) >> 0, 4);

				ctx.fill();
				ctx.stroke();

				ctx.beginPath();

				var dKoef = (this.HtmlPage.m_nZoomValue * g_dKoef_mm_to_pix / 100);
				var xDst  = this.DrawingDocument.m_arrPages[this.DrawingDocument.m_lCurrentPage].drawingPage.left;
				var yDst  = this.DrawingDocument.m_arrPages[this.DrawingDocument.m_lCurrentPage].drawingPage.top;

				var _oldY = _table_markup.Rows[0].Y + _table_markup.Rows[0].H;

				this.TableVerRulerPoints = [];
				var _rectIndex           = 0;
				var _x                   = (pos1.X - _epsRects - _rectWidth) >> 0;

				ctx.fillStyle = "#146FE1";
				for (var i = 1; i <= _count; i++)
				{
					var _newPos = (i != _count) ? _table_markup.Rows[i].Y : _oldY;

					var _p = {Y : _oldY, H : (_newPos - _oldY)};
					var _y = this.DrawingDocument.ConvertCoordsToCursorWR(0, _oldY, _tableOutline.PageNum);

					ctx.beginPath();
					overlay.AddDiamond(_x + 1.5 + (_rectWidth >> 1), _y.Y, MOBILE_TABLE_RULER_DIAMOND);
					ctx.fill();
					ctx.beginPath();

					this.TableVerRulerPoints[_rectIndex++] = _p;

					if (i != _count)
						_oldY = _table_markup.Rows[i].Y + _table_markup.Rows[i].H;
				}

				this.TableHorRulerPoints = [];
				_rectIndex               = 0;
				var _col                 = _table_markup.X;
				for (var i = 1; i <= _cols.length; i++)
				{
					_col += _cols[i - 1];
					var _x = _col - _table_markup.Margins[i - 1].Right;
					var _r = _col + ((i == _cols.length) ? 0 : _table_markup.Margins[i].Left);

					var __c = ((xDst + dKoef * _col) >> 0) + 0.5;

					ctx.beginPath();
					overlay.AddDiamond(__c, TableMoveRect_y +_rectWidth / 2, MOBILE_TABLE_RULER_DIAMOND);
					ctx.fill();
					ctx.beginPath();

					this.TableHorRulerPoints[_rectIndex++] = {X : _x, W : _r - _x, C : _col};
				}

				ctx.beginPath();
				if (this.Mode == MobileTouchMode.TableRuler)
				{
					if (0 == this.TableCurrentMoveDir)
					{
						var _pos = this.DrawingDocument.ConvertCoordsToCursorWR(this.TableCurrentMoveValue, 0, _table_outline_dr.CurrentPageIndex);
						overlay.VertLine(_pos.X, true);
					}
					else
					{
						var _pos = this.DrawingDocument.ConvertCoordsToCursorWR(0, this.TableCurrentMoveValue, _table_outline_dr.CurrentPageIndex);
						overlay.HorLine(_pos.Y, true);
					}
				}
			}
			else
			{
				var dKoef = (this.HtmlPage.m_nZoomValue * g_dKoef_mm_to_pix / 100);

				var xDst  = this.DrawingDocument.m_arrPages[this.DrawingDocument.m_lCurrentPage].drawingPage.left;
				var yDst  = this.DrawingDocument.m_arrPages[this.DrawingDocument.m_lCurrentPage].drawingPage.top;

				ctx.lineWidth = 1 / dKoef;

				if (overlay.IsRetina)
					dKoef *= 2;

				var _coord_transform = new AscCommon.CMatrix();
				_coord_transform.sx  = dKoef;
				_coord_transform.sy  = dKoef;
				_coord_transform.tx  = xDst;
				_coord_transform.ty  = yDst;

				var _diamond_size = MOBILE_TABLE_RULER_DIAMOND;
				if (overlay.IsRetina)
				{
					_coord_transform.tx *= 2;
					_coord_transform.ty *= 2;

					_diamond_size *= 2;
				}

				ctx.save();

				_coord_transform.Multiply(_table_outline_dr.TableMatrix, AscCommon.MATRIX_ORDER_PREPEND);
				ctx.setTransform(_coord_transform.sx, _coord_transform.shy, _coord_transform.shx, _coord_transform.sy, _coord_transform.tx, _coord_transform.ty);

				this.TableMovePoint = {X : _tableOutline.X, Y : _tableOutline.Y};

				ctx.beginPath();

				var _rectW  = _rectWidth / dKoef;
				var _offset = (_epsRects + _rectWidth) / dKoef;
				if (overlay.IsRetina)
				{
					_rectW *= 2;
					_offset *= 2;
				}

				ctx.drawImage(window.g_table_track_mobile_move, this.TableMovePoint.X - _offset, this.TableMovePoint.Y - _offset, _rectW, _rectW);

				var gradObj = ctx.createLinearGradient(this.TableMovePoint.X, this.TableMovePoint.Y - _offset, this.TableMovePoint.X, this.TableMovePoint.Y - _offset + _rectW);
				gradObj.addColorStop(0, "#f1f1f1");
				gradObj.addColorStop(1, "#dfdfdf");
				ctx.fillStyle = gradObj;

				overlay.AddRoundRectCtx(ctx, this.TableMovePoint.X, this.TableMovePoint.Y - _offset, _tableW, _rectW, 5 / dKoef);

				ctx.fill();
				ctx.stroke();

				ctx.beginPath();

				var _count = _table_markup.Rows.length;
				var _y1    = 0;
				var _y2    = 0;
				for (var i = 0; i < _count; i++)
				{
					if (i == 0)
						_y1 = _table_markup.Rows[i].Y;

					_y2 = _table_markup.Rows[i].Y;
					_y2 += _table_markup.Rows[i].H;
				}

				gradObj = ctx.createLinearGradient(this.TableMovePoint.X - _offset, this.TableMovePoint.Y, this.TableMovePoint.X - _offset, this.TableMovePoint.X - _offset + _y2 - _y1);
				gradObj.addColorStop(0, "#f1f1f1");
				gradObj.addColorStop(1, "#dfdfdf");
				ctx.fillStyle = gradObj;

				overlay.AddRoundRectCtx(ctx, this.TableMovePoint.X - _offset, this.TableMovePoint.Y, _rectW, _y2 - _y1, 5 / dKoef);

				overlay.CheckRectT(this.TableMovePoint.X, this.TableMovePoint.Y, _tableW, _y2 - _y1, _coord_transform, 2 * (_epsRects + _rectWidth));

				ctx.fill();
				ctx.stroke();

				ctx.beginPath();

				var _oldY = _table_markup.Rows[0].Y + _table_markup.Rows[0].H;
				_oldY -= _table_outline_dr.TableMatrix.ty;

				ctx.fillStyle = "#146FE1";
				this.TableVerRulerPoints = [];
				var _rectIndex           = 0;
				var _xx                  = this.TableMovePoint.X - _offset;
				for (var i = 1; i <= _count; i++)
				{
					var _newPos = (i != _count) ? (_table_markup.Rows[i].Y - _table_outline_dr.TableMatrix.ty) : _oldY;

					var _p = {Y : _oldY, H : (_newPos - _oldY)};

					var ___y = (_p.Y + (_p.H / 2));
					ctx.beginPath();
					overlay.AddDiamond(_xx + _rectW / 2, ___y, _diamond_size / dKoef);
					ctx.fill();
					ctx.beginPath();

					this.TableVerRulerPoints[_rectIndex++] = _p;

					if (i != _count)
					{
						_oldY = _table_markup.Rows[i].Y + _table_markup.Rows[i].H;
						_oldY -= _table_outline_dr.TableMatrix.ty;
					}
				}

				this.TableHorRulerPoints = [];
				_rectIndex               = 0;
				var _col                 = this.TableMovePoint.X;
				for (var i = 1; i <= _cols.length; i++)
				{
					_col += _cols[i - 1];
					var _x = _col - _table_markup.Margins[i - 1].Right;
					var _r = _col + ((i == _cols.length) ? 0 : _table_markup.Margins[i].Left);

					ctx.beginPath();
					overlay.AddDiamond(_col, this.TableMovePoint.Y - _offset + _rectW / 2, _diamond_size / dKoef);
					ctx.fill();
					ctx.beginPath();

					this.TableHorRulerPoints[_rectIndex++] = {X : _x, W : _r - _x, C : _col};
				}

				ctx.restore();

				ctx.beginPath();
				if (this.Mode == MobileTouchMode.TableRuler)
				{
					if (0 == this.TableCurrentMoveDir)
					{
						var _pos = this.DrawingDocument.ConvertCoordsToCursorWR(this.TableCurrentMoveValue, 0, _table_outline_dr.CurrentPageIndex, _table_outline_dr.TableMatrix);
						overlay.VertLine(_pos.X, true);
					}
					else
					{
						var _pos = this.DrawingDocument.ConvertCoordsToCursorWR(0, this.TableCurrentMoveValue, _table_outline_dr.CurrentPageIndex, _table_outline_dr.TableMatrix);
						overlay.HorLine(_pos.Y, true);
					}
				}
			}
		};

		this.Destroy = function()
		{
			var _scroller = document.getElementById("mobile_scroller_id");
			this.HtmlPage.m_oMainView.HtmlElement.removeChild(_scroller);

			if (this.iScroll != null)
				this.iScroll.destroy();
		};
	}

	function CReaderTouchManager()
	{
		this.HtmlPage = null;
		this.iScroll  = null;

		this.bIsLock          = false;
		this.bIsMoveAfterDown = false;

		this.Init = function(ctrl)
		{
			this.HtmlPage        = ctrl;
			this.LogicDocument   = ctrl.m_oLogicDocument;
			this.DrawingDocument = ctrl.m_oDrawingDocument;

			this.iScroll = new window.IScroll(this.HtmlPage.m_oMainView.HtmlElement, {
				scrollbars: true,
				mouseWheel: true,
				interactiveScrollbars: true,
				shrinkScrollbars: 'scale',
				fadeScrollbars: true,
				scrollX : true,
				scroller_id : "reader_id",
				bounce : false
			});
			this.iScroll.manager = this;

			this.HtmlPage.m_oApi.sendEvent("asc_onHidePopMenu");
		};

		this.onTouchStart = function(e)
		{
			this.iScroll._start(e);
			this.bIsLock          = true;
			this.bIsMoveAfterDown = false;
		};
		this.onTouchMove  = function(e)
		{
			if (!this.bIsLock)
				return;
			this.iScroll._move(e);
			this.bIsMoveAfterDown = true;
		};
		this.onTouchEnd   = function(e)
		{
			this.iScroll._end(e);
			this.bIsLock = false;

			if (this.bIsMoveAfterDown === false)
			{
				this.HtmlPage.m_oApi.sendEvent("asc_onTapEvent", e);
			}
		};

		this.Resize = function()
		{
			this.HtmlPage.ReaderModeDivWrapper.style.width  = this.HtmlPage.m_oMainView.HtmlElement.style.width;
			this.HtmlPage.ReaderModeDivWrapper.style.height = this.HtmlPage.m_oMainView.HtmlElement.style.height;

			if (this.iScroll != null)
				this.iScroll.refresh();
		};

		this.ChangeFontSize = function()
		{
			if (this.iScroll != null)
				this.iScroll.refresh();
		};

		this.Destroy = function()
		{
			if (this.iScroll != null)
				this.iScroll.destroy();
		};
	}

	function LoadMobileImages()
	{
		window.g_table_track_mobile_move = new Image();
		window.g_table_track_mobile_move;
		window.g_table_track_mobile_move.asc_complete = false;
		window.g_table_track_mobile_move.onload       = function()
		{
			window.g_table_track_mobile_move.asc_complete = true;
		};
		window.g_table_track_mobile_move.src          = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAArlJREFUeNqMlc9rWkEQx8ffGqMJBJpSUEIISInxpCfT1krioQQ85xISEKGBkGuhpxwEL4GAoOBJ8V9IxJCQ1l4SkFKxQvEfKEXQ0Nb4IxLtfBefvMeriQPj7ps377Mzu7OjZjgckoYlGo2+tFqtcZ1OFyAiG00nfx8eHj7f3d19SKfTP5g11LBRs7u761lYWPiytbVl9/l8ZDKZpqL1ej0qlUp0enr6p9FovM5kMhU92w02my0OmN/vJ0TcbreJVxZzCH9ARqORQqGQCurxeAC2n52dxfkxDOCMXq9/5fV6aTAYEIc/BkHYkWKx2Ni2ubn5X+j5+fkbweIf5GdFmoAhMkny+TzF43GyWCzi+ejoSIA3NjYUQA4IA5xMmGnhBO33+4rowuEwbW9vKz7Gdtzf36uiHH2n1eJQkCoE0WFeKBTE2O12qdlsKhQ2vLu6uhKjXMHSyuhivLi4oEQiQVLUk/T4+JiKxaLCJtKXQNDLy0tKJpM0NzcnrThR4HNyciLm6+vraiAEB8P1KE9hoqCMzGYzGQwG4asASoZAIEDz8/OUSqWeBGLxg4MDWl1dHe+rKkKUDWpqf3//SeDh4SG5XC5x6nKGYg+lW+J2u6nT6TwKBEzuo0pZPiJSyPX1NWWz2bFdy1UWiUQIt0rykUSe8pDrr837MCMvakgwGCSHw0G5XE487+3t0dLSkip6FDozumABOODVvt3c3PiXl5cVjq1Wi1ZWVmhnZ0dcL6fTqYoMUqlUYP8Klg7dhlNp3N7evuM7a0DZcE9UrL64uEh2u318APJ35XIZl6HN0I/1er2GfmhkfcGb/JYP4/3s7OwaL2Ceph/yvnU5i+/VajVVq9U+semnaLCjTvGM9TkuAaKesmP3WX+z/mKts3Y00l/ACDIzamfa0UKPCU4QR9tDEwIcfwH/BBgAl4G4NBf6Z6AAAAAASUVORK5CYII=";
	}

	//--------------------------------------------------------export----------------------------------------------------
	window['AscCommon']                          = window['AscCommon'] || {};
	window['AscCommon'].g_mouse_event_type_down  = g_mouse_event_type_down;
	window['AscCommon'].g_mouse_event_type_move  = g_mouse_event_type_move;
	window['AscCommon'].g_mouse_event_type_up    = g_mouse_event_type_up;
	window['AscCommon'].g_mouse_button_left      = g_mouse_button_left;
	window['AscCommon'].g_mouse_button_center    = g_mouse_button_center;
	window['AscCommon'].g_mouse_button_right     = g_mouse_button_right;
	window['AscCommon'].MouseUpLock              = MouseUpLock;
	window['AscCommon'].CMouseEventHandler       = CMouseEventHandler;
	window['AscCommon'].CKeyboardEvent           = CKeyboardEvent;
	window['AscCommon'].global_mouseEvent        = global_mouseEvent;
	window['AscCommon'].global_keyboardEvent     = global_keyboardEvent;
	window['AscCommon'].check_KeyboardEvent      = check_KeyboardEvent;
	window['AscCommon'].check_KeyboardEvent2     = check_KeyboardEvent2;
	window['AscCommon'].check_MouseMoveEvent     = check_MouseMoveEvent;
	window['AscCommon'].CreateMouseUpEventObject = CreateMouseUpEventObject;
	window['AscCommon'].check_MouseUpEvent       = check_MouseUpEvent;
	window['AscCommon'].check_MouseDownEvent     = check_MouseDownEvent;
	window['AscCommon'].Window_OnMouseUp         = Window_OnMouseUp;
	window['AscCommon'].button_eventHandlers     = button_eventHandlers;
	window['AscCommon'].CMobileTouchManager      = CMobileTouchManager;
	window['AscCommon'].CReaderTouchManager      = CReaderTouchManager;
	window['AscCommon'].emulateKeyDown 			 = emulateKeyDown;

})(window);
