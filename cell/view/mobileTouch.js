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
		this.Name = "cell";
		this.WB = _manager.Api.wb;
		this.DrawingDocument = this.WB.getWorksheet().objectRender.drawingDocument;

		this.Offset = { X: 0, Y: 0};
		this.Size = { W : 0, H : 0 };

		AscCommon.CMobileDelegateSimple.call(this, _manager);
	}

	CMobileDelegateEditorCell.prototype = Object.create(AscCommon.CMobileDelegateSimple.prototype);
	CMobileDelegateEditorCell.prototype.constructor = CMobileDelegateEditorCell;
	CMobileDelegateEditorCell.prototype.Resize = function()
	{
		var _element = document.getElementById("editor_sdk");
		this.Offset.X = _element.offsetLeft;
		this.Offset.Y = _element.offsetTop;

		this.Size.W = _element.offsetWidth;
		this.Size.H = _element.offsetHeight;
	};
	CMobileDelegateEditorCell.prototype.ConvertCoordsToCursor = function(x, y, page, isGlobal, isNoCell)
	{
		var _res = this.WB.ConvertLogicToXY(x, y);
		var _point = {X: _res.X, Y: _res.Y, Page: 0, DrawPage: 0};

		if (AscBrowser.isRetina)
		{
			if (isNoCell === true)
			{
				_point.X /= AscCommon.AscBrowser.retinaPixelRatio;
				_point.Y /= AscCommon.AscBrowser.retinaPixelRatio;
			}
			else
			{
				_point.X /= AscCommon.AscBrowser.retinaPixelRatio;
				_point.Y /= AscCommon.AscBrowser.retinaPixelRatio;

				_point.X = _point.X >> 0;
				_point.Y = _point.Y >> 0;
			}
		}

		if (isGlobal !== false)
		{
			_point.X += this.Offset.X;
			_point.Y += this.Offset.Y;
		}

		return _point;
	};
	CMobileDelegateEditorCell.prototype.ConvertCoordsFromCursor = function(x, y)
	{
		var _x = x - this.Offset.X;
		var _y = y - this.Offset.Y;

		if (AscBrowser.isRetina)
		{
			_x *= AscCommon.AscBrowser.retinaPixelRatio;
			_y *= AscCommon.AscBrowser.retinaPixelRatio;
		}

		var _res = this.WB.ConvertXYToLogic(_x, _y);
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
	CMobileDelegateEditorCell.prototype.GetSelectionTransform = function()
	{
		if (this.WB.getWorksheet().objectRender.controller.selectedObjects.length == 0)
			return null;
		return this.WB.getWorksheet().objectRender.controller.drawingDocument.SelectionMatrix;
	};
	CMobileDelegateEditorCell.prototype.GetScrollerParent = function()
	{
		return this.WB.element;
	};
	CMobileDelegateEditorCell.prototype.GetObjectTrack = function(x, y, page, bSelected, bText)
	{
		return this.WB.getWorksheet().objectRender.controller.isPointInDrawingObjects3(x, y, page, bSelected, bText);
	};
	CMobileDelegateEditorCell.prototype.GetSelectionRectsBounds = function()
	{
		var _selection = this.WB.GetSelectionRectsBounds();

		if (_selection)
		{
			var _obj = {
				Start : { X: _selection.X, Y: _selection.Y, W: _selection.W, H: _selection.H, Page: 0 },
				End : { X: _selection.X, Y: _selection.Y, W: _selection.W, H: _selection.H, Page: 0 },
				Type : _selection.T
			};

			var _captionSize;
			switch (_selection.T)
			{
				case Asc.c_oAscSelectionType.RangeCol:
				{
					_captionSize = this.WB.GetCaptionSize();
					_obj.Start.Y = _obj.End.Y = -_captionSize.H;
					_obj.Start.H = _obj.End.H = _captionSize.H;
					break;
				}
				case Asc.c_oAscSelectionType.RangeRow:
				{
					_captionSize = this.WB.GetCaptionSize();
					_obj.Start.X = _obj.End.X = -_captionSize.W;
					_obj.Start.W = _obj.End.W = _captionSize.W;
					break;
				}
				default:
					break;
			}
			return _obj;
		}

		return this.WB.getWorksheet().objectRender.controller.Get_SelectionBounds();
	};
	CMobileDelegateEditorCell.prototype.ScrollTo = function(_scroll)
	{
		var _api = this.WB;

		if (_scroll.directionLocked == "v")
		{
			var _deltaY = -_scroll.y / _api.controller.settings.hscrollStep;
			if (_scroll.y == _scroll.maxScrollY)
				_deltaY += 1;
			_api._onScrollY(_deltaY);
		}
		else if (_scroll.directionLocked == "h")
		{
			var _deltaX = -_scroll.x / _api.controller.settings.vscrollStep;
			if (_scroll.x == _scroll.maxScrollX)
				_deltaX += 1;
			_api._onScrollX(_deltaX);
		}
		else if (_scroll.directionLocked == "n")
		{
			var _deltaY = -_scroll.y / _api.controller.settings.hscrollStep;
			if (_scroll.y == _scroll.maxScrollY)
				_deltaY += 1;
			var _deltaX = -_scroll.x / _api.controller.settings.vscrollStep;
			if (_scroll.x == _scroll.maxScrollX)
				_deltaX += 1;
			_api._onScrollX(_deltaX);
			_api._onScrollY(_deltaY);
		}
	};
	CMobileDelegateEditorCell.prototype.GetContextMenuType = function()
	{
		var _mode = AscCommon.MobileTouchContextMenuType.None;

		var _controller = this.WB.getWorksheet().objectRender.controller;
		var _selection = this.WB.GetSelectionRectsBounds();

		if (!_controller.Is_SelectionUse() && !_selection)
			_mode = AscCommon.MobileTouchContextMenuType.Target;

		if (_controller.Get_SelectionBounds() || _selection)
			_mode = AscCommon.MobileTouchContextMenuType.Select;

		if (_mode == 0 && _controller.getSelectedObjectsBounds())
			_mode = AscCommon.MobileTouchContextMenuType.Object;

		return _mode;
	};
	CMobileDelegateEditorCell.prototype.IsInObject = function()
	{
		var _controller = this.WB.getWorksheet().objectRender.controller;
		return (null != _controller.getSelectedObjectsBounds(true));
	};
	CMobileDelegateEditorCell.prototype.GetContextMenuInfo = function(info)
	{
		info.Clear();
		var _info = null;
		var _transform = null;

		var _x = 0;
		var _y = 0;

		var _controller = this.WB.getWorksheet().objectRender.controller;
		var _target = _controller.Is_SelectionUse();
		var _selection = this.WB.GetSelectionRectsBounds();

		if (!_target && !_selection)
		{
			_info = {
				X : this.DrawingDocument.m_dTargetX,
				Y : this.DrawingDocument.m_dTargetY,
				Page : this.DrawingDocument.m_lTargetPage
			};

			_transform = this.DrawingDocument.TextMatrix;
			if (_transform)
			{
				_x = _transform.TransformPointX(_info.X, _info.Y);
				_y = _transform.TransformPointY(_info.X, _info.Y);

				_info.X = _x;
				_info.Y = _y;
			}
			info.targetPos = _info;
			return;
		}

		var _select = _controller.Get_SelectionBounds();
		if (_select)
		{
			var _rect1 = _select.Start;
			var _rect2 = _select.End;

			_info = {
				X1 : _rect1.X,
				Y1 : _rect1.Y,
				Page1 : _rect1.Page,
				X2 : _rect2.X + _rect2.W,
				Y2 : _rect2.Y + _rect2.H,
				Page2 : _rect2.Page
			};

			_transform = this.DrawingDocument.SelectionMatrix;

			if (_transform)
			{
				_x = _transform.TransformPointX(_info.X1, _info.Y1);
				_y = _transform.TransformPointY(_info.X1, _info.Y1);
				_info.X1 = _x;
				_info.Y1 = _y;

				_x = _transform.TransformPointX(_info.X2, _info.Y2);
				_y = _transform.TransformPointY(_info.X2, _info.Y2);
				_info.X2 = _x;
				_info.Y2 = _y;
			}

			info.selectText = _info;
			return;
		}
		else if (_selection)
		{
			info.selectCell = {
				X : _selection.X,
				Y : _selection.Y,
				W : _selection.W,
				H : _selection.H
			};
			return;
		}

		var _object_bounds = _controller.getSelectedObjectsBounds();
		if (_object_bounds)
		{
			info.objectBounds = {
				X : _object_bounds.minX,
				Y : _object_bounds.minY,
				R : _object_bounds.maxX,
				B : _object_bounds.maxY,
				Page : _object_bounds.pageIndex
			};
		}
	};
	CMobileDelegateEditorCell.prototype.GetContextMenuPosition = function()
	{
		var _controller = this.WB.getWorksheet().objectRender.controller;

		var _posX = 0;
		var _posY = 0;
		var _page = 0;
		var _transform = null;
		var tmpX, tmpY, tmpX2, tmpY2;
		var _pos = null;

		var _mode = 0;

		var _target = _controller.Is_SelectionUse();
		var _selection = this.WB.GetSelectionRectsBounds();

		if (!_target && !_selection)
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

			_pos = this.ConvertCoordsToCursor(tmpX, tmpY, _page);
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

			_pos = this.ConvertCoordsToCursor(tmpX, tmpY, _rect1.Page);
			_posX = _pos.X;
			_posY = _pos.Y;

			_pos = this.ConvertCoordsToCursor(tmpX2, tmpY2, _rect2.Page);
			_posX += _pos.X;
			_posX = _posX >> 1;

			_mode = 2;
		}
		else if (_selection)
		{
			tmpX = _selection.X;
			tmpY = _selection.Y;
			tmpX2 = _selection.X + _selection.W;
			tmpY2 = _selection.Y + _selection.H;

			_pos = this.ConvertCoordsToCursor(tmpX, tmpY, 0);
			_posX = _pos.X;
			_posY = _pos.Y;

			_pos = this.ConvertCoordsToCursor(tmpX2, tmpY2, 0);
			_posX += _pos.X;
			_posX = _posX >> 1;

			_mode = 2;
		}

		var _object_bounds = _controller.getSelectedObjectsBounds(true);
		if (_object_bounds)
		{
			_pos = this.ConvertCoordsToCursor(_object_bounds.minX, _object_bounds.minY, _object_bounds.pageIndex);
			_posX = _pos.X;
			_posY = _pos.Y;

			_pos = this.ConvertCoordsToCursor(_object_bounds.maxX, _object_bounds.maxY, _object_bounds.pageIndex);
			_posX += _pos.X;
			_posX = _posX >> 1;

			_mode = 3;
		}

		_posX -= this.Offset.X;
		_posY -= this.Offset.Y;
		return { X : _posX, Y : _posY, Mode : _mode };
	};

	CMobileDelegateEditorCell.prototype._convertLogicToEvent = function(e, x, y, page)
	{
		var _e = {};
		var _pos = this.ConvertCoordsToCursor(x, y, 0);

		_e.pageX = _pos.X / AscBrowser.zoom;
		_e.pageY = _pos.Y / AscBrowser.zoom;

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
		AscCommon.CMobileTouchManagerBase.call(this, _config || {});
	}


	CMobileTouchManager.prototype = Object.create(AscCommon.CMobileTouchManagerBase.prototype);
	CMobileTouchManager.prototype.constructor = CMobileTouchManager;
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

		this.CellEditorType = Asc.c_oAscCellEditorState.editEnd;

		var _that = this;
		this.Api.asc_registerCallback('asc_onEditCell', function(_state) {
			_that.CellEditorType = _state;
		});
	};

	CMobileTouchManager.prototype.MoveCursorToPoint = function()
	{
		// TODO:
	};

	CMobileTouchManager.prototype.onTouchStart = function(e)
	{
		var _e = e.touches ? e.touches[0] : e;
		this.IsTouching = true;
		AscCommon.g_inputContext.enableVirtualKeyboard();

		this.checkPointerMultiTouchAdd(e);

		global_mouseEvent.KoefPixToMM = 5;
		AscCommon.check_MouseDownEvent(_e, true);
		global_mouseEvent.KoefPixToMM = 1;
		global_mouseEvent.LockMouse();
		this.ClearContextMenu();

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

		if ((e.touches && 2 == e.touches.length) || (2 == this.getPointerCount()))
		{
			this.Mode = AscCommon.MobileTouchMode.Zoom;
		}

		if (this.Mode == AscCommon.MobileTouchMode.None)
			this.CheckSelectTrackObject();

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
			case AscCommon.MobileTouchMode.SelectTrack:
			{
				// так как был уже check, нужно уменьшить количество кликов
				if (global_mouseEvent.ClickCount > 0)
					global_mouseEvent.ClickCount--;
				break;
			}
			default:
				break;
		}

		var isPreventDefault = false;
		switch (this.Mode)
		{
			case AscCommon.MobileTouchMode.Select: // in cell select too
			case AscCommon.MobileTouchMode.InlineObj:
			case AscCommon.MobileTouchMode.FlowObj:
			case AscCommon.MobileTouchMode.Zoom:
			case AscCommon.MobileTouchMode.TableMove:
			case AscCommon.MobileTouchMode.SelectTrack:
			{
				isPreventDefault = true;
				break;
			}
			case AscCommon.MobileTouchMode.None:
			case AscCommon.MobileTouchMode.Scroll:
			{
				isPreventDefault = !this.CheckObjectText();
				break;
			}
			default:
			{
				break;
			}
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
				var _x1 = this.RectSelect1.x + 0.5;
				var _y1 = this.RectSelect1.y + 0.5;

				var _x2 = this.RectSelect2.x + this.RectSelect2.w - 0.5;
				var _y2 = this.RectSelect2.y + this.RectSelect2.h - 0.5;

				if (this.RectSelectType == Asc.c_oAscSelectionType.RangeCol || this.RectSelectType == Asc.c_oAscSelectionType.RangeRow)
					AscCommon.global_mouseEvent.KoefPixToMM = -10; // чтобы не попасть в движения

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

					this.delegate.Drawing_OnMouseMove(_e);
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

					this.delegate.Drawing_OnMouseMove(_e);
				}
				break;
			}
			case AscCommon.MobileTouchMode.InlineObj:
			{
				break;
			}
			case AscCommon.MobileTouchMode.FlowObj:
			case AscCommon.MobileTouchMode.SelectTrack:
			{
				if (bIsKoefPixToMM || this.Mode == AscCommon.MobileTouchMode.SelectTrack)
				{
					global_mouseEvent.KoefPixToMM = 5;
				}

				if (this.Mode == AscCommon.MobileTouchMode.SelectTrack)
					this.delegate.Drawing_OnMouseMove(e.touches ? e.touches[0] : e);

				this.delegate.Drawing_OnMouseDown(e.touches ? e.touches[0] : e);
				global_mouseEvent.KoefPixToMM = 1;
				break;
			}
			case AscCommon.MobileTouchMode.Zoom:
			{
				this.Api.asc_closeCellEditor();

				this.ZoomDistance = this.getPointerDistance(e);
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

		if (AscCommon.AscBrowser.isAndroid)
			isPreventDefault = false;

		if (this.Api.isViewMode || isPreventDefault)
			AscCommon.stopEvent(e);

		return false;
	};
	CMobileTouchManager.prototype.onTouchMove  = function(e)
	{
		this.checkPointerMultiTouchAdd(e);

		var _e = e.touches ? e.touches[0] : e;
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
				var isTouch2 = ((e.touches && 2 == e.touches.length) || (2 == this.getPointerCount()));
				if (!isTouch2)
				{
					this.Mode = AscCommon.MobileTouchMode.None;
					return;
				}

				var zoomCurrentDist = this.getPointerDistance(e);

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
			case AscCommon.MobileTouchMode.SelectTrack:
			{
				this.delegate.Drawing_OnMouseMove(e.touches ? e.touches[0] : e);
				AscCommon.stopEvent(e);
				break;
			}
			case AscCommon.MobileTouchMode.Select:
			{
				// во время движения может смениться порядок ректов
				global_mouseEvent.ClickCount = 1;
				this.delegate.Drawing_OnMouseMove(_e);
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

		var isCheckContextMenuSelect = false;
		var isCheckContextMenuCursor = (this.Mode == AscCommon.MobileTouchMode.Cursor);

		var isPreventDefault = false;
		switch (this.Mode)
		{
			case AscCommon.MobileTouchMode.Select:  // in cell select too
			case AscCommon.MobileTouchMode.Scroll:
			case AscCommon.MobileTouchMode.InlineObj:
			case AscCommon.MobileTouchMode.FlowObj:
			case AscCommon.MobileTouchMode.Zoom:
			case AscCommon.MobileTouchMode.TableMove:
			case AscCommon.MobileTouchMode.SelectTrack:
			{
				isPreventDefault = true;
				break;
			}
			default:
			{
				break;
			}
		}

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
					global_mouseEvent.KoefPixToMM = 5;
					this.delegate.Drawing_OnMouseDown(_e);
					this.delegate.Drawing_OnMouseUp(_e);
					global_mouseEvent.KoefPixToMM = 1;
					this.Api.sendEvent("asc_onTapEvent", e);

					var typeMenu = this.delegate.GetContextMenuType();
					if (typeMenu == AscCommon.MobileTouchContextMenuType.Target ||
						(typeMenu == AscCommon.MobileTouchContextMenuType.Select && this.delegate.IsInObject()))
						isPreventDefault = false;
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
			case AscCommon.MobileTouchMode.SelectTrack:
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
				this.delegate.Drawing_OnMouseUp(_e);
				//AscCommon.stopEvent(e);
				isCheckContextMenuSelect = true;
				break;
			}
			default:
				break;
		}

		this.checkPointerMultiTouchRemove(e);

		if (true)
		{
			// нужно послать мув в никуда, чтобы сбросить состояния (схема, где все решает мув а не даун)
			var _e = {};

			_e.pageX = -1000;
			_e.pageY = -1000;

			_e.altKey 	= false;
			_e.shiftKey = false;
			_e.ctrlKey 	= false;

			_e.button 	= 0;

			this.delegate.Api.controller._onMouseMove(_e);
		}

		if (this.CellEditorType == Asc.c_oAscCellEditorState.editFormula)
			isPreventDefault = false;

		if (this.Api.isViewMode || isPreventDefault)
			AscCommon.g_inputContext.preventVirtualKeyboard(e);

		if (true !== this.iScroll.isAnimating && (this.CellEditorType != Asc.c_oAscCellEditorState.editFormula))
			this.CheckContextMenuTouchEnd(isCheckContextMenuMode, isCheckContextMenuSelect, isCheckContextMenuCursor);

		return false;
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
	CMobileTouchManager.prototype.CheckSelect = function(overlay, color, drDocument)
	{
		if (!this.SelectEnabled)
			return;

		if (color !== undefined)
			overlay.Clear();

		this.CheckSelectRects();
		if (null == this.RectSelect1 || null == this.RectSelect2)
			return;

		var _matrix = this.delegate.GetSelectionTransform();
		var ctx         = overlay.m_oContext;

		ctx.lineWidth = 2;
		if (undefined === color)
		{
			ctx.strokeStyle = "#146FE1";
			ctx.fillStyle = "#146FE1";
		}
		else
		{
			ctx.strokeStyle = "rgba(" + color.r + "," + color.g + "," + color.b + "," + color.a + ")";
			ctx.fillStyle = "rgba(" + color.r + "," + color.g + "," + color.b + "," + color.a + ")";
		}

		var _koef = AscCommon.AscBrowser.isRetina ? AscCommon.AscBrowser.retinaPixelRatio : 1;

		var _oldGlobalAlpha = ctx.globalAlpha;
		ctx.globalAlpha = 1.0;

		if (!_matrix || global_MatrixTransformer.IsIdentity(_matrix))
		{
			var pos1 = this.delegate.ConvertCoordsToCursor(this.RectSelect1.x, this.RectSelect1.y, this.PageSelect1, false, true);
			var pos2 = this.delegate.ConvertCoordsToCursor(this.RectSelect1.x, this.RectSelect1.y + this.RectSelect1.h, this.PageSelect1, false, true);

			var pos3 = this.delegate.ConvertCoordsToCursor(this.RectSelect2.x + this.RectSelect2.w, this.RectSelect2.y, this.PageSelect2, false, true);
			var pos4 = this.delegate.ConvertCoordsToCursor(this.RectSelect2.x + this.RectSelect2.w, this.RectSelect2.y + this.RectSelect2.h, this.PageSelect2, false, true);

			if (undefined === color)
			{
				ctx.beginPath();

				ctx.moveTo((_koef * pos1.X) >> 0, (_koef * pos1.Y) >> 0);
				ctx.lineTo((_koef * pos2.X) >> 0, (_koef * pos2.Y) >> 0);

				ctx.moveTo((_koef * pos3.X) >> 0, (_koef * pos3.Y) >> 0);
				ctx.lineTo((_koef * pos4.X) >> 0, (_koef * pos4.Y) >> 0);

				ctx.stroke();
			}

			ctx.beginPath();

			var _offset = (undefined === color) ? 5 : 0;

			if (this.RectSelectType == Asc.c_oAscSelectionType.RangeCol)
			{
				pos2.Y = pos4.Y = (pos2.Y - pos1.Y);
				pos1.Y = pos3.Y = 0;

				ctx.beginPath();

				var _x1C = ((_koef * pos1.X + 0.5) >> 0) - 1;
				var _x2C = ((_koef * pos3.X + 1.5) >> 0) - 1;

				ctx.moveTo(_x1C, (_koef * pos1.Y) >> 0);
				ctx.lineTo(_x1C, (_koef * pos2.Y) >> 0);

				ctx.moveTo(_x2C, (_koef * pos3.Y) >> 0);
				ctx.lineTo(_x2C, (_koef * pos4.Y) >> 0);

				ctx.stroke();
				ctx.beginPath();

				if (_x2C > (_x1C + 10 * _koef))
				{
					var _y1 = ((_koef * pos1.Y) >> 0) + 2 * _koef;
					var _y2 = ((_koef * pos2.Y) >> 0) - 2 * _koef;

					if (_y2 > _y1)
					{
						ctx.moveTo(_x2C - 2 * _koef, _y1);
						ctx.lineTo(_x2C - 2 * _koef, _y2);

						ctx.lineTo(_x2C - 6 * _koef, _y2);
						ctx.lineTo(_x2C - 6 * _koef, _y1);
						ctx.closePath();
					}
				}

				ctx.fill();

				ctx.beginPath();

				overlay.CheckPoint(_x1C, pos1.Y);
				overlay.CheckPoint(_x2C, pos4.Y);

				var _yC = _koef * (this.delegate.Size.H + pos4.Y) / 2;
				overlay.AddEllipse(_x1C, _yC, _koef * AscCommon.MOBILE_SELECT_TRACK_ROUND / 2);
				overlay.AddEllipse(_x2C, _yC, _koef * AscCommon.MOBILE_SELECT_TRACK_ROUND / 2);
				ctx.fill();
			}
			else if (this.RectSelectType == Asc.c_oAscSelectionType.RangeRow)
			{
				pos3.X = pos4.X = (pos3.X - pos1.X);
				pos1.X = pos2.X = 0;

				ctx.beginPath();

				var _y1C = ((_koef * pos1.Y + 0.5) >> 0) - 1;
				var _y2C = ((_koef * pos2.Y + 1.5) >> 0) - 1;

				ctx.moveTo((_koef * pos1.X) >> 0, _y1C);
				ctx.lineTo((_koef * pos3.X) >> 0, _y1C);

				ctx.moveTo((_koef * pos2.X) >> 0, _y2C);
				ctx.lineTo((_koef * pos4.X) >> 0, _y2C);

				ctx.stroke();
				ctx.beginPath();

				if (_y2C > (_y1C + 10 * _koef))
				{
					var _x1 = ((_koef * pos1.X) >> 0) + 2 * _koef;
					var _x2 = ((_koef * pos3.X) >> 0) - 2 * _koef;

					if (_x2 > _x1)
					{
						ctx.moveTo(_x1, _y2C - 2 * _koef);
						ctx.lineTo(_x2, _y2C - 2 * _koef);

						ctx.lineTo(_x2, _y2C - 6 * _koef);
						ctx.lineTo(_x1, _y2C - 6 * _koef);
						ctx.closePath();
					}
				}

				ctx.fill();

				ctx.beginPath();

				overlay.CheckPoint(pos1.X, _y1C);
				overlay.CheckPoint(pos4.X, _y2C);

				var _xC = _koef * (this.delegate.Size.W + pos4.X) / 2;
				overlay.AddEllipse(_xC, _y1C, _koef * AscCommon.MOBILE_SELECT_TRACK_ROUND / 2);
				overlay.AddEllipse(_xC, _y2C, _koef * AscCommon.MOBILE_SELECT_TRACK_ROUND / 2);
				ctx.fill();
			}
			else
			{
				overlay.AddEllipse(_koef * pos1.X, _koef * (pos1.Y - _offset), _koef * AscCommon.MOBILE_SELECT_TRACK_ROUND / 2);
				overlay.AddEllipse(_koef * pos4.X, _koef * (pos4.Y + _offset), _koef * AscCommon.MOBILE_SELECT_TRACK_ROUND / 2);
				ctx.fill();
			}

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

				ctx.moveTo(_koef * pos1.X, _koef * pos1.Y);
				ctx.lineTo(_koef * pos2.X, _koef * pos2.Y);

				ctx.moveTo(_koef * pos3.X, _koef * pos3.Y);
				ctx.lineTo(_koef * pos4.X, _koef * pos4.Y);

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

				overlay.AddEllipse(_koef * _x1, _koef * _y1, _koef * AscCommon.MOBILE_SELECT_TRACK_ROUND / 2);
				overlay.AddEllipse(_koef * _x2, _koef * _y2, _koef * AscCommon.MOBILE_SELECT_TRACK_ROUND / 2);
			}
			else
			{
				overlay.AddEllipse(_koef * pos1.X, _koef * pos1.Y, _koef * AscCommon.MOBILE_SELECT_TRACK_ROUND / 2);
				overlay.AddEllipse(_koef * pos4.X, _koef * pos4.Y, _koef * AscCommon.MOBILE_SELECT_TRACK_ROUND / 2);
			}
			ctx.fill();

			ctx.beginPath();
		}

		ctx.globalAlpha = _oldGlobalAlpha;
	};

	CMobileTouchManager.prototype.CheckSelectTrack = function()
	{
		if (this.RectSelectType != Asc.c_oAscSelectionType.RangeRow && this.RectSelectType != Asc.c_oAscSelectionType.RangeCol)
			return AscCommon.CMobileTouchManagerBase.prototype.CheckSelectTrack.call(this);

		// проверим на попадание в селект - это может произойти на любом mode
		if (null != this.RectSelect1 && null != this.RectSelect2)
		{
			var pos1 = null;
			var pos4 = null;

			var _pos = this.delegate.ConvertCoordsToCursor(0, 0, 0, false);

			if (this.RectSelectType == Asc.c_oAscSelectionType.RangeCol)
			{
				var Y = this.delegate.ConvertCoordsFromCursor(0, this.delegate.Offset.Y + (this.delegate.Size.H + _pos.Y) / 2).Y;
				pos1 = this.delegate.ConvertCoordsToCursor(this.RectSelect1.x, Y, this.PageSelect1);
				pos4 = this.delegate.ConvertCoordsToCursor(this.RectSelect2.x + this.RectSelect2.w, Y, this.PageSelect2);
			}
			else
			{
				var X = this.delegate.ConvertCoordsFromCursor(this.delegate.Offset.X + (this.delegate.Size.W + _pos.X) / 2, 0).X;
				pos1 = this.delegate.ConvertCoordsToCursor(X, this.RectSelect1.y, this.PageSelect1);
				pos4 = this.delegate.ConvertCoordsToCursor(X, this.RectSelect2.y + this.RectSelect2.h, this.PageSelect2);
			}

			if (Math.abs(pos1.X - global_mouseEvent.X) < this.TrackTargetEps && Math.abs(pos1.Y - global_mouseEvent.Y) < this.TrackTargetEps)
			{
				this.Mode       = AscCommon.MobileTouchMode.Select;
				this.DragSelect = 1;
			}
			else if (Math.abs(pos4.X - global_mouseEvent.X) < this.TrackTargetEps && Math.abs(pos4.Y - global_mouseEvent.Y) < this.TrackTargetEps)
			{
				this.Mode       = AscCommon.MobileTouchMode.Select;
				this.DragSelect = 2;
			}
		}

		return (this.Mode == AscCommon.MobileTouchMode.Select);
	};

	CMobileTouchManager.prototype.CheckSelectTrackObject = function()
	{
		if (!this.delegate.WB.Is_SelectionUse())
			return;

		if (null != this.RectSelect1 && null != this.RectSelect2)
		{
			var pos1 = this.delegate.ConvertCoordsToCursor(this.RectSelect1.x, this.RectSelect1.y, this.PageSelect1);
			var pos4 = this.delegate.ConvertCoordsToCursor(this.RectSelect2.x + this.RectSelect2.w, this.RectSelect2.y + this.RectSelect2.h, this.PageSelect2);

			if (this.RectSelectType == Asc.c_oAscSelectionType.RangeCol)
			{
				// только правая граница
				if (Math.abs(pos4.X - global_mouseEvent.X) < this.TrackTargetEps)
				{
					if (pos4.X > global_mouseEvent.X)
						this.Mode = AscCommon.MobileTouchMode.SelectTrack;
				}
			}
			else if (this.RectSelectType == Asc.c_oAscSelectionType.RangeRow)
			{
				// только нижняя граница
				if (Math.abs(pos4.Y - global_mouseEvent.Y) < this.TrackTargetEps)
				{
					if (pos4.Y > global_mouseEvent.Y)
						this.Mode = AscCommon.MobileTouchMode.SelectTrack;
				}
			}
			else
			{
				if (Math.abs(pos1.X - global_mouseEvent.X) < this.TrackTargetEps && global_mouseEvent.Y > pos1.Y && global_mouseEvent.Y < pos4.Y)
					this.Mode = AscCommon.MobileTouchMode.SelectTrack;
				else if (Math.abs(pos4.X - global_mouseEvent.X) < this.TrackTargetEps && global_mouseEvent.Y > pos1.Y && global_mouseEvent.Y < pos4.Y)
					this.Mode = AscCommon.MobileTouchMode.SelectTrack;
				else if (Math.abs(pos1.Y - global_mouseEvent.Y) < this.TrackTargetEps && global_mouseEvent.X > pos1.X && global_mouseEvent.X < pos4.X)
					this.Mode = AscCommon.MobileTouchMode.SelectTrack;
				else if (Math.abs(pos4.Y - global_mouseEvent.Y) < this.TrackTargetEps && global_mouseEvent.X > pos1.X && global_mouseEvent.X < pos4.X)
					this.Mode = AscCommon.MobileTouchMode.SelectTrack;
			}
		}
		return (this.Mode == AscCommon.MobileTouchMode.SelectTrack);
	};

	//--------------------------------------------------------export----------------------------------------------------
	window['AscCommonExcel'] = window['AscCommonExcel'] || {};
	window['AscCommonExcel'].CMobileTouchManager = CMobileTouchManager;
})(window);
