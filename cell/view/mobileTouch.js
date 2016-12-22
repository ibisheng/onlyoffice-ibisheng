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
	var AscBrowser = AscCommon.AscBrowser;

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

	CMobileDelegateEditorCell.prototype.Resize = function()
	{
		var _element = document.getElementById("editor_sdk");
		this.Offset.X = _element.offsetLeft;
		this.Offset.Y = _element.offsetTop;
	};
	CMobileDelegateEditorCell.prototype.ConvertCoordsToCursor = function(x, y, page, isGlobal)
	{
		var _res = this.WB.ConvertLogicToXY(x, y);
		var _point = {X: _res.X, Y: _res.Y, Page: 0, DrawPage: 0};
		return _point;
	};
	CMobileDelegateEditorCell.prototype.ConvertCoordsFromCursor = function(x, y)
	{
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
		var _selection = this.WB.GetSelectionRectsBounds();
		if (_selection)
		{
			var _obj = {
				Start : { X: _selection.X, Y: _selection.Y, W: _selection.W, H: _selection.H, Page: 0 },
				End : { X: _selection.X, Y: _selection.Y, W: _selection.W, H: _selection.H, Page: 0 }
			};
			return _obj;
		}

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

	// отрисовка текстового селекта
	CMobileTouchManager.prototype.CheckSelect = function(overlay, color)
	{
		if (!this.SelectEnabled)
			return;

		this.CheckSelectRects();
		if (null == this.RectSelect1 || null == this.RectSelect2)
			return;

		var _matrix = this.delegate.GetSelectionTransform();
		var ctx         = overlay.m_oContext;

		if (undefined === color)
		{
			ctx.strokeStyle = "#146FE1";
			ctx.fillStyle = "#146FE1";
		}
		else
		{
			ctx.fillStyle = "rgba(" + color.r + "," + color.g + "," + color.b + "," + color.a + ")";
		}

		if (!_matrix || global_MatrixTransformer.IsIdentity(_matrix))
		{
			var pos1 = this.delegate.ConvertCoordsToCursor(this.RectSelect1.x, this.RectSelect1.y, this.PageSelect1, false);
			var pos2 = this.delegate.ConvertCoordsToCursor(this.RectSelect1.x, this.RectSelect1.y + this.RectSelect1.h, this.PageSelect1, false);

			var pos3 = this.delegate.ConvertCoordsToCursor(this.RectSelect2.x + this.RectSelect2.w, this.RectSelect2.y, this.PageSelect2, false);
			var pos4 = this.delegate.ConvertCoordsToCursor(this.RectSelect2.x + this.RectSelect2.w, this.RectSelect2.y + this.RectSelect2.h, this.PageSelect2, false);

			if (undefined === color)
			{
				ctx.beginPath();

				ctx.moveTo(pos1.X >> 0, pos1.Y >> 0);
				ctx.lineTo(pos2.X >> 0, pos2.Y >> 0);

				ctx.moveTo(pos3.X >> 0, pos3.Y >> 0);
				ctx.lineTo(pos4.X >> 0, pos4.Y >> 0);

				ctx.lineWidth = 2;
				ctx.stroke();
			}

			ctx.beginPath();

			var _offset = (undefined === color) ? 5 : 0;

			overlay.AddEllipse(pos1.X, pos1.Y - _offset, AscCommon.MOBILE_SELECT_TRACK_ROUND / 2);
			overlay.AddEllipse(pos4.X, pos4.Y + _offset, AscCommon.MOBILE_SELECT_TRACK_ROUND / 2);
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

			var pos1 = this.delegate.ConvertCoordsToCursor(_xx11, _yy11, this.PageSelect1, false);
			var pos2 = this.delegate.ConvertCoordsToCursor(_xx12, _yy12, this.PageSelect1, false);

			var pos3 = this.delegate.ConvertCoordsToCursor(_xx21, _yy21, this.PageSelect2, false);
			var pos4 = this.delegate.ConvertCoordsToCursor(_xx22, _yy22, this.PageSelect2, false);

			if (undefined === color)
			{
				ctx.beginPath();

				ctx.moveTo(pos1.X, pos1.Y);
				ctx.lineTo(pos2.X, pos2.Y);

				ctx.moveTo(pos3.X, pos3.Y);
				ctx.lineTo(pos4.X, pos4.Y);

				ctx.lineWidth = 2;
				ctx.stroke();
			}

			ctx.beginPath();

			if (undefined === color)
			{
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

				overlay.AddEllipse(_x1, _y1, AscCommon.MOBILE_SELECT_TRACK_ROUND / 2);
				overlay.AddEllipse(_x2, _y2, AscCommon.MOBILE_SELECT_TRACK_ROUND / 2);
			}
			else
			{
				overlay.AddEllipse(pos1.X, pos1.Y, AscCommon.MOBILE_SELECT_TRACK_ROUND / 2);
				overlay.AddEllipse(pos4.X, pos4.Y, AscCommon.MOBILE_SELECT_TRACK_ROUND / 2);
			}
			ctx.fill();

			ctx.beginPath();
		}
	};

	//--------------------------------------------------------export----------------------------------------------------
	window['AscCommonExcel'] = window['AscCommonExcel'] || {};
	window['AscCommonExcel'].CMobileTouchManager = CMobileTouchManager;
})(window);
