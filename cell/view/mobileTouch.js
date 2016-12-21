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

	/**
	 * @extends {AscCommon.CMobileDelegateSimple}
	 */
	function CMobileDelegateEditorCell(_manager)
	{
		this.WB = _manager.Api.wb;
		this.DrawingDocument = this.WB.getWorksheet().objectRender.drawingDocument;

		this.Offset = { X: 0, Y: 0};

		CMobileDelegateEditorCell.superclass.constructor.call(this, _manager);
	}
	AscCommon.extendClass(CMobileDelegateEditorCell, AscCommon.CMobileDelegateSimple);

	CMobileDelegateEditorCell.prototype.ConvertCoordsToCursor = function(x, y, page, isGlobal)
	{
		var _res = this.WB.ConvertLogicToXY(x, y);
		var _point = {X: _res.X, Y: _res.Y, Page: 0, DrawPage: 0};
		return _point;
	};
	CMobileDelegateEditorCell.prototype.ConvertCoordsFromCursor = function(x, y)
	{
		var _element = document.getElementById("editor_sdk");
		this.Offset.X = _element.offsetLeft;
		this.Offset.Y = _element.offsetTop;

		var _res = this.WB.ConvertXYToLogic(x - this.Offset.X, y - this.Offset.Y);
		var _point = {X: _res.X, Y: _res.Y, Page: 0, DrawPage: 0};
		return _point;
	};
	CMobileDelegateEditorCell.prototype.GetZoomFit = function()
	{
		// min zoom
		return 50;
	};
	CMobileDelegateEditorCell.prototype.GetZoom = function()
	{
		return 100 * this.Api.asc_getZoom();
	};
	CMobileDelegateEditorCell.prototype.SetZoom = function(_value)
	{
		return this.Api.asc_setZoom(_value / 100);
	};
	CMobileDelegateEditorCell.prototype.GetScrollerSize = function()
	{
		return {
			W : this.WB.element.clientWidth + this.WB.m_dScrollX_max,
			H : this.WB.element.clientHeight + this.WB.m_dScrollY_max
		};
	};
	CMobileDelegateEditorCell.prototype.GetScrollerParent = function()
	{
		return this.WB.element;
	};
	CMobileDelegateEditorCell.prototype.GetObjectTrack = function(x, y, page)
	{
		return this.WB.getWorksheet().objectRender.controller.isPointInDrawingObjects3(x, y, page);
	};
	CMobileDelegateEditorCell.prototype.GetSelectionRectsBounds = function()
	{
		return this.WB.getWorksheet().objectRender.controller.Get_SelectionBounds();
	};
	CMobileDelegateEditorCell.prototype.ScrollTo = function(_scroll)
	{
		var _api = this.WB;

		if (_scroll.directionLocked == "v")
		{
			_api._onScrollY(-_scroll.y / _api.controller.settings.hscrollStep);
		}
		else if (_scroll.directionLocked == "h")
		{
			_api._onScrollX(-_scroll.x / _api.controller.settings.vscrollStep);
		}
		else if (_scroll.directionLocked == "n")
		{
			_api._onScrollX(-_scroll.x / _api.controller.settings.vscrollStep);
			_api._onScrollY(-_scroll.y / _api.controller.settings.hscrollStep);
		}
	};
	CMobileDelegateEditorCell.prototype.GetContextMenuType = function()
	{
		var _mode = AscCommon.MobileTouchContextMenuType.None;

		var _controller = this.WB.getWorksheet().objectRender.controller;

		if (!_controller.Is_SelectionUse())
			_mode = AscCommon.MobileTouchContextMenuType.Target;

		if (_controller.Get_SelectionBounds())
			_mode = AscCommon.MobileTouchContextMenuType.Select;

		if (_mode == 0 && _controller.getSelectedObjectsBounds())
			_mode = AscCommon.MobileTouchContextMenuType.Object;

		return _mode;
	};
	CMobileDelegateEditorCell.prototype.GetContextMenuPosition = function()
	{
		return { X : 0, Y : 0, Mode : AscCommon.MobileTouchContextMenuType.None };
		var _controller = this.WB.getWorksheet().objectRender.controller;

		var _posX = 0;
		var _posY = 0;
		var _page = 0;
		var _transform = null;
		var tmpX, tmpY, tmpX2, tmpY2;
		var _pos = null;

		var _mode = 0;

		var _target = _controller.Is_SelectionUse();
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

		var _select = _controller.Get_SelectionBounds();
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

		var _object_bounds = _controller.getSelectedObjectsBounds();
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

	CMobileDelegateEditorCell.prototype._convertLogicToEvent = function(e, x, y, page)
	{
		var _e = {};
		_e.pageX = x / AscBrowser.zoom;
		_e.pageY = y / AscBrowser.zoom;

		_e.altKey 	= global_mouseEvent.AltKey;
		_e.shiftKey = global_mouseEvent.ShiftKey;
		_e.ctrlKey 	= global_mouseEvent.CtrlKey;

		_e.button 	= global_mouseEvent.Button;
		return _e;
	};
	CMobileDelegateEditorCell.prototype.Logic_OnMouseDown = function(e, x, y, page)
	{
		return this.Api.controller._onMouseDown(this._convertLogicToEvent(e, x, y, page));
	};
	CMobileDelegateEditorCell.prototype.Logic_OnMouseMove = function(e, x, y, page)
	{
		return this.Api.controller._onMouseMove(this._convertLogicToEvent(e, x, y, page));
	};
	CMobileDelegateEditorCell.prototype.Logic_OnMouseUp = function(e, x, y, page)
	{
		return this.Api.controller._onMouseUp(this._convertLogicToEvent(e, x, y, page));
	};
	CMobileDelegateEditorCell.prototype.Drawing_OnMouseDown = function(e)
	{
		return this.Api.controller._onMouseDown(e);
	};
	CMobileDelegateEditorCell.prototype.Drawing_OnMouseMove = function(e)
	{
		return this.Api.controller._onMouseMove(e);
	};
	CMobileDelegateEditorCell.prototype.Drawing_OnMouseUp = function(e)
	{
		return this.Api.controller._onMouseUp(e);
	};

	/**
	 * @extends {AscCommon.CMobileTouchManagerBase}
	 */
	function CMobileTouchManager(_config)
	{
		CMobileTouchManager.superclass.constructor.call(this, _config || {});
	}
	AscCommon.extendClass(CMobileTouchManager, AscCommon.CMobileTouchManagerBase);

	CMobileTouchManager.prototype.Init = function(_api)
	{
		this.Api = _api;

		// создаем делегата. инициализация его - ПОСЛЕ создания iScroll
		this.delegate = new CMobileDelegateEditorCell(this);
		var _element = this.delegate.GetScrollerParent();
		this.CreateScrollerDiv(_element);

		this.iScroll = new window.IScroll(_element, {
			scrollbars: true,
			mouseWheel: true,
			interactiveScrollbars: true,
			shrinkScrollbars: 'scale',
			fadeScrollbars: true,
			scrollX : true,
			scroller_id : this.iScrollElement,
			bounce : false,
			eventsElement : this.eventsElement,
			click : false
		});

		this.delegate.Init();

		// никаких таблиц
		this.TableTrackEnabled = false;
	};

	CMobileTouchManager.prototype.MoveCursorToPoint = function()
	{
		// TODO:
	};

	CMobileTouchManager.prototype.onTouchStart = function(e)
	{
		this.IsTouching = true;

		global_mouseEvent.KoefPixToMM = 5;
		AscCommon.check_MouseDownEvent(e.touches ? e.touches[0] : e, true);
		global_mouseEvent.KoefPixToMM = 1;
		global_mouseEvent.LockMouse();
		this.Api.sendEvent("asc_onHidePopMenu");

		this.MoveAfterDown = false;
		this.TimeDown      = new Date().getTime();

		var bIsKoefPixToMM = false;
		var _matrix        = this.delegate.GetSelectionTransform();
		if (_matrix && global_MatrixTransformer.IsIdentity(_matrix))
			_matrix = null;

		if (!this.CheckSelectTrack())
		{
			bIsKoefPixToMM = this.CheckObjectTrack();
		}

		if (e.touches && 2 == e.touches.length)
		{
			this.Mode = AscCommon.MobileTouchMode.Zoom;
		}

		// если не используем этот моус даун - то уменьшаем количество кликов
		switch (this.Mode)
		{
			case AscCommon.MobileTouchMode.None:
			case AscCommon.MobileTouchMode.Scroll:
			case AscCommon.MobileTouchMode.InlineObj:
			case AscCommon.MobileTouchMode.FlowObj:
			case AscCommon.MobileTouchMode.Zoom:
			case AscCommon.MobileTouchMode.Cursor:
			case AscCommon.MobileTouchMode.TableMove:
			{
				// так как был уже check, нужно уменьшить количество кликов
				if (global_mouseEvent.ClickCount > 0)
					global_mouseEvent.ClickCount--;
				break;
			}
			default:
				break;
		}

		switch (this.Mode)
		{
			case AscCommon.MobileTouchMode.None:
			{
				this.Mode      = AscCommon.MobileTouchMode.Scroll;
				this.DownPoint = this.delegate.ConvertCoordsFromCursor(global_mouseEvent.X, global_mouseEvent.Y);

				this.DownPointOriginal.X = global_mouseEvent.X;
				this.DownPointOriginal.Y = global_mouseEvent.Y;

				this.iScroll._start(e);

				break;
			}
			case AscCommon.MobileTouchMode.Scroll:
			{
				// ничего не меняем, просто перемещаем точку
				this.DownPoint           = this.delegate.ConvertCoordsFromCursor(global_mouseEvent.X, global_mouseEvent.Y);
				this.DownPointOriginal.X = global_mouseEvent.X;
				this.DownPointOriginal.Y = global_mouseEvent.Y;

				this.iScroll._start(e);

				break;
			}
			case AscCommon.MobileTouchMode.Select:
			{
				var _x1 = this.RectSelect1.x;
				var _y1 = this.RectSelect1.y + this.RectSelect1.h / 2;

				var _x2 = this.RectSelect2.x + this.RectSelect2.w;
				var _y2 = this.RectSelect2.y + this.RectSelect2.h / 2;

				this.delegate.LogicDocument.Selection_Remove();
				if (1 == this.DragSelect)
				{
					global_mouseEvent.Button = 0;

					if (!_matrix)
					{
						this.delegate.Logic_OnMouseDown(global_mouseEvent, _x2, _y2, this.PageSelect2);
					}
					else
					{
						var __X = _matrix.TransformPointX(_x2, _y2);
						var __Y = _matrix.TransformPointY(_x2, _y2);

						this.delegate.Logic_OnMouseDown(global_mouseEvent, __X, __Y, this.PageSelect2);
					}

					var pos1 = this.delegate.ConvertCoordsFromCursor(global_mouseEvent.X, global_mouseEvent.Y);
					this.delegate.Logic_OnMouseMove(global_mouseEvent, pos1.X, pos1.Y, pos1.Page);
				}
				else if (2 == this.DragSelect)
				{
					global_mouseEvent.Button = 0;

					if (!_matrix)
					{
						this.delegate.Logic_OnMouseDown(global_mouseEvent, _x1, _y1, this.PageSelect1);
					}
					else
					{
						var __X = _matrix.TransformPointX (_x1, _y1);
						var __Y = _matrix.TransformPointY(_x1, _y1);

						this.delegate.Logic_OnMouseDown(global_mouseEvent, __X, __Y, this.PageSelect1);
					}

					var pos4 = this.delegate.ConvertCoordsFromCursor(global_mouseEvent.X, global_mouseEvent.Y);
					this.delegate.Logic_OnMouseMove(global_mouseEvent, pos4.X, pos4.Y, pos4.Page);
				}
				break;
			}
			case AscCommon.MobileTouchMode.InlineObj:
			{
				break;
			}
			case AscCommon.MobileTouchMode.FlowObj:
			{
				if (bIsKoefPixToMM)
				{
					global_mouseEvent.KoefPixToMM = 5;
				}
				this.delegate.Drawing_OnMouseDown(e.touches ? e.touches[0] : e);
				global_mouseEvent.KoefPixToMM = 1;
				break;
			}
			case AscCommon.MobileTouchMode.Zoom:
			{
				var _x1 = (e.touches[0].pageX !== undefined) ? e.touches[0].pageX : e.touches[0].clientX;
				var _y1 = (e.touches[0].pageY !== undefined) ? e.touches[0].pageY : e.touches[0].clientY;

				var _x2 = (e.touches[1].pageX !== undefined) ? e.touches[1].pageX : e.touches[1].clientX;
				var _y2 = (e.touches[1].pageY !== undefined) ? e.touches[1].pageY : e.touches[1].clientY;

				this.ZoomDistance = Math.sqrt((_x1 - _x2) * (_x1 - _x2) + (_y1 - _y2) * (_y1 - _y2));
				this.ZoomValue    = this.delegate.GetZoom();

				break;
			}
			case AscCommon.MobileTouchMode.Cursor:
			{
				this.Mode      = AscCommon.MobileTouchMode.Scroll;
				this.DownPoint = this.delegate.ConvertCoordsFromCursor(global_mouseEvent.X, global_mouseEvent.Y);
				break;
			}
		}

		if (this.Api.isViewMode)
		{
			if (e.preventDefault)
				e.preventDefault();
			else
				e.returnValue = false;
			return false;
		}
	};
	CMobileTouchManager.prototype.onTouchMove  = function(e)
	{
		if (this.Mode != AscCommon.MobileTouchMode.FlowObj && this.Mode != AscCommon.MobileTouchMode.TableMove)
			AscCommon.check_MouseMoveEvent(e.touches ? e.touches[0] : e);

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
			case AscCommon.MobileTouchMode.Cursor:
			{
				this.MoveCursorToPoint(true);
				break;
			}
			case AscCommon.MobileTouchMode.Scroll:
			{
				var _newTime = new Date().getTime();
				if ((_newTime - this.TimeDown) > this.ReadingGlassTime && !this.MoveAfterDown)
				{
					this.Mode = AscCommon.MobileTouchMode.Cursor;
					this.MoveCursorToPoint(false);
				}
				else
				{
					this.iScroll._move(e);
					AscCommon.stopEvent(e);
				}
				break;
			}
			case AscCommon.MobileTouchMode.Zoom:
			{
				if (2 != e.touches.length)
				{
					this.Mode = AscCommon.MobileTouchMode.None;
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

				this.delegate.SetZoom(_zoomCur);
				AscCommon.stopEvent(e);
				break;
			}
			case AscCommon.MobileTouchMode.InlineObj:
			{
				break;
			}
			case AscCommon.MobileTouchMode.FlowObj:
			{
				this.delegate.Drawing_OnMouseMove(e.touches ? e.touches[0] : e);
				AscCommon.stopEvent(e);
				break;
			}
			case AscCommon.MobileTouchMode.Select:
			{
				// во время движения может смениться порядок ректов
				global_mouseEvent.ClickCount = 1;
				var pos                      = this.delegate.ConvertCoordsFromCursor(global_mouseEvent.X, global_mouseEvent.Y);
				this.delegate.Logic_OnMouseMove(global_mouseEvent, pos.X, pos.Y, pos.Page);
				AscCommon.stopEvent(e);
				break;
			}
			default:
				break;
		}
	};
	CMobileTouchManager.prototype.onTouchEnd   = function(e)
	{
		this.IsTouching = false;

		var _e = e.changedTouches ? e.changedTouches[0] : e;
		if (this.Mode != AscCommon.MobileTouchMode.FlowObj && this.Mode != AscCommon.MobileTouchMode.TableMove)
		{
			AscCommon.check_MouseUpEvent(_e);
		}

		var isCheckContextMenuMode = true;

		switch (this.Mode)
		{
			case AscCommon.MobileTouchMode.Cursor:
			{
				// ничего не делаем. курсор уже установлен
				this.Mode = AscCommon.MobileTouchMode.None;
				break;
			}
			case AscCommon.MobileTouchMode.Scroll:
			{
				if (!this.MoveAfterDown)
				{
					global_mouseEvent.Button = 0;
					this.delegate.Drawing_OnMouseDown(_e);
					this.delegate.Drawing_OnMouseUp(_e);
					this.Api.sendEvent("asc_onTapEvent", e);
				}
				else
				{
					// нужно запускать анимацию скролла, если она есть
					// TODO:
					isCheckContextMenuMode = false;
					this.iScroll._end(e);
				}

				this.Mode = AscCommon.MobileTouchMode.None;
				break;
			}
			case AscCommon.MobileTouchMode.Zoom:
			{
				this.Mode = AscCommon.MobileTouchMode.None;
				isCheckContextMenuMode = false;
				break;
			}
			case AscCommon.MobileTouchMode.InlineObj:
			{
				// TODO:
				break;
			}
			case AscCommon.MobileTouchMode.FlowObj:
			{
				// TODO:
				this.delegate.Drawing_OnMouseUp(e.changedTouches ? e.changedTouches[0] : e);
				this.Mode = AscCommon.MobileTouchMode.None;
				break;
			}
			case AscCommon.MobileTouchMode.Select:
			{
				// ничего не нужно делать
				this.DragSelect = 0;
				this.Mode       = AscCommon.MobileTouchMode.None;
				var pos         = this.delegate.ConvertCoordsFromCursor(global_mouseEvent.X, global_mouseEvent.Y);
				this.delegate.Logic_OnMouseUp(global_mouseEvent, pos.X, pos.Y, pos.Page);
				AscCommon.stopEvent(e);
				break;
			}
			default:
				break;
		}

		if (this.Api.isViewMode)
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

	CMobileTouchManager.prototype.mainOnTouchStart = function(e)
	{
		if (AscCommon.g_inputContext && AscCommon.g_inputContext.externalChangeFocus())
			return;
		return this.onTouchStart(e);
	};
	CMobileTouchManager.prototype.mainOnTouchMove = function(e)
	{
		return this.onTouchMove(e);
	};
	CMobileTouchManager.prototype.mainOnTouchEnd = function(e)
	{
		return this.onTouchEnd(e);
	};


// 	function CMobileTouchManager()
// 	{
// 		this.LogicDocument = null;
// 		this.DrawingDocument = null;
// 		this.HtmlPage = null;
//
// 		this.Mode = 0;
//
// 		this.ReadingGlassTime = 750;
// 		this.TimeDown = 0;
// 		this.DownPoint = null;
// 		this.DownPointOriginal = {X: 0, Y: 0};
// 		this.MoveAfterDown = false;
// 		this.MoveMinDist = 10;
//
// 		this.RectSelect1 = null;
// 		this.RectSelect2 = null;
//
// 		this.PageSelect1 = 0;
// 		this.PageSelect2 = 0;
//
// 		this.ZoomDistance = 0;
// 		this.ZoomValue = 100;
// 		this.ZoomValueMin = 50;
// 		this.ZoomValueMax = 300;
//
// 		this.iScroll = null;
// 		this.ctrl = null;
//
// 		this.longTapFlag = false;
// 		this.longTapTimer = -1;
// 	}
//
// 	CMobileTouchManager.prototype.CreateScrollerDiv = function (_wrapper, _id)
// 	{
// 		var _scroller = document.createElement('div');
// 		var _style = "position: absolute; z-index: 0; margin: 0; padding: 0; -webkit-tap-highlight-color: rgba(0,0,0,0); width: 100%; heigth: 100%; display: block;";
// 		_style += "-webkit-transform: translateZ(0); -moz-transform: translateZ(0); -ms-transform: translateZ(0); -o-transform: translateZ(0); transform: translateZ(0);";
// 		_style += "-webkit-touch-callout: none; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none;";
// 		_style += "-webkit-text-size-adjust: none; -moz-text-size-adjust: none; -ms-text-size-adjust: none; -o-text-size-adjust: none; text-size-adjust: none;";
// 		_scroller.setAttribute("style", _style);
//
// 		_scroller.id = _id;
// 		_wrapper.appendChild(_scroller);
// 	};
// 	CMobileTouchManager.prototype.Init = function (ctrl)
// 	{
// 		this.ctrl = ctrl;
//
// 		this.CreateScrollerDiv(this.ctrl.element, "mobile_scroller_id");
//
// 		this.iScroll = new window.IScroll(this.ctrl.element, {
// 			scrollbars: true,
// 			mouseWheel: true,
// 			interactiveScrollbars: true,
// 			shrinkScrollbars: 'scale',
// 			fadeScrollbars: true,
// 			scrollX: true,
// 			scroller_id: "mobile_scroller_id",
// 			bounce: false,
// 			momentum: false
// 		});
// 		this.iScroll.manager = this;
//
// 		this.iScroll.on('scroll', function ()
// 		{
// 			var _api = this.manager.ctrl;
//
// 			if (this.directionLocked == "v")
// 			{
// 				_api._onScrollY(-this.y / _api.controller.settings.hscrollStep);
// 			}
// 			else if (this.directionLocked == "h")
// 			{
// 				_api._onScrollX(-this.x / _api.controller.settings.vscrollStep);
// 			}
// 			else if (this.directionLocked == "n")
// 			{
// 				_api._onScrollX(-this.x / _api.controller.settings.vscrollStep);
// 				_api._onScrollY(-this.y / _api.controller.settings.hscrollStep);
// 			}
// 		});
// 	};
//
// 	CMobileTouchManager.prototype.MoveCursorToPoint = function (e)
// 	{
// 		AscCommon.check_MouseMoveEvent(e);
// 		var pos = this.DrawingDocument.ConvertCoordsFromCursor2(global_mouseEvent.X, global_mouseEvent.Y);
//
// 		var old_click_count = global_mouseEvent.ClickCount;
// 		global_mouseEvent.ClickCount = 1;
//
// 		var nearPos = this.LogicDocument.Get_NearestPos(pos.Page, pos.X, pos.Y);
//
// 		this.DrawingDocument.NeedScrollToTargetFlag = true;
// 		this.LogicDocument.OnMouseDown(global_mouseEvent, nearPos.X, nearPos.Y, pos.Page);
// 		this.LogicDocument.OnMouseUp(global_mouseEvent, nearPos.X, nearPos.Y, pos.Page);
// 		this.DrawingDocument.NeedScrollToTargetFlag = false;
//
// 		global_mouseEvent.ClickCount = old_click_count;
// 	};
//
// 	CMobileTouchManager.prototype.onTouchStart = function (e)
// 	{
// 		this.longTapFlag = true;
// 		this.wasMove = false;
// 		var thas = this, evt = e,
// 			point = arguments[0].touches ? arguments[0].touches[0] : arguments[0];
//
// 		function longTapDetected()
// 		{
// 			if (thas.longTapFlag)
// 				alert("clientX " + point.clientX + " clientY " + point.clientY)
// 			thas.longTapFlag = false;
// 			clearInterval(this.longTapTimer);
// 		}
//
// 		this.DownPointOriginal.X = point.clientX;
// 		this.DownPointOriginal.Y = point.clientY;
//
// 		this.iScroll._start(e);
// 		e.preventDefault();
// 		e.returnValue = false;
// //        this.longTapTimer = setTimeout(longTapDetected,1000,e);
// 		return false;
// 	};
// 	CMobileTouchManager.prototype.onTouchMove = function (e)
// 	{
// 		this.longTapFlag = false;
// 		this.wasMove = true;
// //        clearInterval(this.longTapTimer);
// 		this.iScroll._move(e);
// 		e.preventDefault();
// 		e.returnValue = false;
// //        this.canZoom = false;
// 		return false;
// 	};
// 	CMobileTouchManager.prototype.onTouchEnd = function (e)
// 	{
// 		this.longTapFlag = false;
// //        clearInterval(this.longTapTimer);
// 		this.iScroll._end(e);
//
// 		var now = new Date().getTime(), point = e.changedTouches ? e.changedTouches[0] : e;
//
// 		/*        this.mylatesttap = this.mylatesttap||now+1
// 		 var timesince = now - this.mylatesttap;
// 		 if((timesince < 300) && (timesince > 0)){
// 		 //            this.ctrl.handlers.trigger("asc_onDoubleTapEvent",e);
// 		 this.mylatesttap = null;
// 		 if ( this.wasZoom ) {
// 		 this.zoomFactor = 1;
// 		 this.wasZoom = false;
// 		 }
// 		 else {
// 		 this.zoomFactor = 2;
// 		 this.wasZoom = true;
// 		 }
// 		 this.ctrl._onScrollY(0);
// 		 this.ctrl._onScrollX(0);
// 		 this.ctrl.changeZoom( this.zoomFactor );
// 		 this.iScroll.zoom( point.clientX, point.clientY, this.zoomFactor );
// 		 }else{
// 		 // too much time to be a doubletap
// 		 this.mylatesttap = now+1;
// 		 }*/
//
// 		if (Math.abs(this.DownPointOriginal.X - point.clientX) < this.ctrl.controller.settings.hscrollStep && Math.abs(this.DownPointOriginal.Y - point.clientY) < this.ctrl.controller.settings.vscrollStep)
// 			this.ctrl.handlers.trigger("asc_onTapEvent", e);
//
// 		e.preventDefault();
// 		e.returnValue = false;
// 		this.wasMove = false;
// 		return;
// 	};
//
// 	CMobileTouchManager.prototype.Resize = function ()
// 	{
// 		if (this.iScroll != null)
// 		{
// 			var _api = this.ctrl;
// 			var _pixelW = _api.element.clientWidth + _api.m_dScrollX_max;
// 			var _pixelH = _api.element.clientHeight + _api.m_dScrollY_max;
//
// 			this.iScroll.scroller.style.width = _pixelW + "px";
// 			this.iScroll.scroller.style.height = _pixelH + "px";
//
// 			this.iScroll.refresh();
// 		}
// 	};

	//--------------------------------------------------------export----------------------------------------------------
	window['AscCommonExcel'] = window['AscCommonExcel'] || {};
	window['AscCommonExcel'].CMobileTouchManager = CMobileTouchManager;
})(window);
