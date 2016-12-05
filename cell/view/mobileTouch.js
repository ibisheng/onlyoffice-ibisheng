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
(/**
 * @param {Window} window
 * @param {undefined} undefined
 */
	function (window, undefined)
{
	// Import
	var MATRIX_ORDER_PREPEND = AscCommon.MATRIX_ORDER_PREPEND;
	var global_mouseEvent = AscCommon.global_mouseEvent;

	var MobileTouchMode =
		{
			None: 0,
			Scroll: 1,
			Zoom: 2,
			Select: 3,
			InlineObj: 4,
			FlowObj: 5,
			Cursor: 6,
			TableMove: 7,
			TableRuler: 8
		};

	function CMobileTouchManager()
	{
		this.AnimateScroll = false;
		this.AnimateZoom = false;

		this.bIsTextSelected = false;
		this.bIsTextSelecting = false;

		this.LogicDocument = null;
		this.DrawingDocument = null;
		this.HtmlPage = null;

		this.Mode = 0;

		this.ReadingGlassTime = 750;
		this.TimeDown = 0;
		this.DownPoint = null;
		this.DownPointOriginal = {X: 0, Y: 0};
		this.MoveAfterDown = false;
		this.MoveMinDist = 10;

		this.RectSelect1 = null;
		this.RectSelect2 = null;

		this.PageSelect1 = 0;
		this.PageSelect2 = 0;

		this.CheckFirstRect = true;
		this.TrackTargetEps = 20;

		this.ScrollH = 0;
		this.ScrollV = 0;

		this.ZoomDistance = 0;
		this.ZoomValue = 100;
		this.ZoomValueMin = 50;
		this.ZoomValueMax = 300;

		this.iScroll = null;
		this.ctrl = null;

		this.TableMovePoint = null;
		this.TableHorRulerPoints = null;
		this.TableVerRulerPoints = null;
		this.TableStartTrack_Check = false;

		this.TableRulersRectOffset = 5;
		this.TableRulersRectSize = 20;

		this.TableCurrentMoveDir = -1;
		this.TableCurrentMovePos = -1;
		this.TableCurrentMoveValue = 0;
		this.TableCurrentMoveValueOld = 0;

		this.TableCurrentMoveValueMin = null;
		this.TableCurrentMoveValueMax = null;

		this.ShowMenuTimerId = -1;

		this.longTapFlag = false;
		this.longTapTimer = -1;
		this.mylatesttap = null;
		this.zoomFactor = 1;
		this.wasZoom = false;
		this.canZoom = true;
		this.wasMove = false;
	}

	CMobileTouchManager.prototype.CreateScrollerDiv = function (_wrapper, _id)
	{
		var _scroller = document.createElement('div');
		var _style = "position: absolute; z-index: 0; margin: 0; padding: 0; -webkit-tap-highlight-color: rgba(0,0,0,0); width: 100%; heigth: 100%; display: block;";
		_style += "-webkit-transform: translateZ(0); -moz-transform: translateZ(0); -ms-transform: translateZ(0); -o-transform: translateZ(0); transform: translateZ(0);";
		_style += "-webkit-touch-callout: none; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none;";
		_style += "-webkit-text-size-adjust: none; -moz-text-size-adjust: none; -ms-text-size-adjust: none; -o-text-size-adjust: none; text-size-adjust: none;";
		_scroller.style = _style;

		_scroller.id = _id;
		_wrapper.appendChild(_scroller);
	};
	CMobileTouchManager.prototype.Init = function (ctrl)
	{
		this.ctrl = ctrl;

		this.CreateScrollerDiv(this.ctrl.element, "mobile_scroller_id");

		this.iScroll = new window.IScroll(this.ctrl.element, {
			scrollbars: true,
			mouseWheel: true,
			interactiveScrollbars: true,
			shrinkScrollbars: 'scale',
			fadeScrollbars: true,
			scrollX: true,
			scroller_id: "mobile_scroller_id",
			bounce: false,
			momentum: false
		});
		this.iScroll.manager = this;

		this.iScroll.on('scroll', function ()
		{
			var _api = this.manager.ctrl;

			if (this.directionLocked == "v")
			{
				_api._onScrollY(-this.y / _api.controller.settings.hscrollStep);
			}
			else if (this.directionLocked == "h")
			{
				_api._onScrollX(-this.x / _api.controller.settings.vscrollStep);
			}
			else if (this.directionLocked == "n")
			{
				_api._onScrollX(-this.x / _api.controller.settings.vscrollStep);
				_api._onScrollY(-this.y / _api.controller.settings.hscrollStep);
			}
		});
	};

	CMobileTouchManager.prototype.MoveCursorToPoint = function (e)
	{
		AscCommon.check_MouseMoveEvent(e);
		var pos = this.DrawingDocument.ConvertCoordsFromCursor2(global_mouseEvent.X, global_mouseEvent.Y);

		var old_click_count = global_mouseEvent.ClickCount;
		global_mouseEvent.ClickCount = 1;

		var nearPos = this.LogicDocument.Get_NearestPos(pos.Page, pos.X, pos.Y);

		this.DrawingDocument.NeedScrollToTargetFlag = true;
		this.LogicDocument.OnMouseDown(global_mouseEvent, nearPos.X, nearPos.Y, pos.Page);
		this.LogicDocument.OnMouseUp(global_mouseEvent, nearPos.X, nearPos.Y, pos.Page);
		this.DrawingDocument.NeedScrollToTargetFlag = false;

		global_mouseEvent.ClickCount = old_click_count;
	};

	CMobileTouchManager.prototype.onTouchStart = function (e)
	{
		this.longTapFlag = true;
		this.wasMove = false;
		var thas = this, evt = e,
			point = arguments[0].touches ? arguments[0].touches[0] : arguments[0];

		function longTapDetected()
		{
			if (thas.longTapFlag)
				alert("clientX " + point.clientX + " clientY " + point.clientY)
			thas.longTapFlag = false;
			clearInterval(this.longTapTimer);
		}

		this.DownPointOriginal.X = point.clientX;
		this.DownPointOriginal.Y = point.clientY;

		this.iScroll._start(e);
		e.preventDefault();
		e.returnValue = false;
//        this.longTapTimer = setTimeout(longTapDetected,1000,e);
		return false;
	};
	CMobileTouchManager.prototype.onTouchMove = function (e)
	{
		this.longTapFlag = false;
		this.wasMove = true;
//        clearInterval(this.longTapTimer);
		this.iScroll._move(e);
		e.preventDefault();
		e.returnValue = false;
//        this.canZoom = false;
		return false;
	};
	CMobileTouchManager.prototype.onTouchEnd = function (e)
	{
		this.longTapFlag = false;
//        clearInterval(this.longTapTimer);
		this.iScroll._end(e);

		var now = new Date().getTime(), point = e.changedTouches ? e.changedTouches[0] : e;

		/*        this.mylatesttap = this.mylatesttap||now+1
		 var timesince = now - this.mylatesttap;
		 if((timesince < 300) && (timesince > 0)){
		 //            this.ctrl.handlers.trigger("asc_onDoubleTapEvent",e);
		 this.mylatesttap = null;
		 if ( this.wasZoom ) {
		 this.zoomFactor = 1;
		 this.wasZoom = false;
		 }
		 else {
		 this.zoomFactor = 2;
		 this.wasZoom = true;
		 }
		 this.ctrl._onScrollY(0);
		 this.ctrl._onScrollX(0);
		 this.ctrl.changeZoom( this.zoomFactor );
		 this.iScroll.zoom( point.clientX, point.clientY, this.zoomFactor );
		 }else{
		 // too much time to be a doubletap
		 this.mylatesttap = now+1;
		 }*/

		if (Math.abs(this.DownPointOriginal.X - point.clientX) < this.ctrl.controller.settings.hscrollStep && Math.abs(this.DownPointOriginal.Y - point.clientY) < this.ctrl.controller.settings.vscrollStep)
			this.ctrl.handlers.trigger("asc_onTapEvent", e);

		e.preventDefault();
		e.returnValue = false;
		this.wasMove = false;
		return;
	};

	CMobileTouchManager.prototype.Resize = function ()
	{
		if (this.iScroll != null)
		{
			var _api = this.ctrl;
			var _pixelW = _api.element.clientWidth + _api.m_dScrollX_max;
			var _pixelH = _api.element.clientHeight + _api.m_dScrollY_max;

			this.iScroll.scroller.style.width = _pixelW + "px";
			this.iScroll.scroller.style.height = _pixelH + "px";

			this.iScroll.refresh();
		}
	};

	//--------------------------------------------------------export----------------------------------------------------
	window['AscCommonExcel'] = window['AscCommonExcel'] || {};
	window['AscCommonExcel'].CMobileTouchManager = CMobileTouchManager;
})(window);
