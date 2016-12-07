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
	// define after window['AscCommon']
	var AscCommon = window['AscCommon'];

	AscCommon.MobileTouchMode =
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

	AscCommon.MobileTouchContextMenuType =
		{
			None		: 0,
			Target		: 1,
			Select		: 2,
			Object		: 3,
			Slide		: 4
		};

	AscCommon.MOBILE_SELECT_TRACK_ROUND = 14;
	AscCommon.MOBILE_TABLE_RULER_DIAMOND = 7;

	/*
	config : {
		isSelection : true,
		isTableTrack : true,
		isZoomEnabled : true
	}
	delegate : {
	onTouchDown : function() {},
	onTouchMove : function() {},
	onTouchEnd : function() {}
	*/

	function CMobileDelegateSimple(_manager)
	{
		this.Manager = _manager;
		this.Api = _manager.Api;
	}

	CMobileDelegateSimple.prototype.Init = function()
	{
		this.Manager.iScroll.manager = this.Manager;

		this.Manager.iScroll.on('scroll', function()
		{
			this.ScrollTo(this);
		});
		this.Manager.iScroll.on('scrollEnd', function()
		{
			this.ScrollEnd(this);
		});
	};

	CMobileDelegateSimple.prototype.GetSelectionTransform = function()
	{
		return null;
	};
	CMobileDelegateSimple.prototype.ConvertCoordsToCursor = function(x, y, page)
	{
		return null;
	};
	CMobileDelegateSimple.prototype.ConvertCoordsFromCursor = function(x, y)
	{
		return null;
	};
	CMobileDelegateSimple.prototype.GetElementOffset = function()
	{
		return null;
	};
	CMobileDelegateSimple.prototype.GetTableDrawing = function()
	{
		return null;
	};
	CMobileDelegateSimple.prototype.GetZoom = function()
	{
		return null;
	};
	CMobileDelegateSimple.prototype.SetZoom = function(_value)
	{
	};
	CMobileDelegateSimple.prototype.GetObjectTrack = function(x, y, page)
	{
		return false;
	};
	CMobileDelegateSimple.prototype.GetContextMenuType = function()
	{
		return AscCommon.MobileTouchContextMenuType.None;
	};
	CMobileDelegateEditor.prototype.GetContextMenuPosition = function()
	{
		return null;
	};
	CMobileDelegateSimple.prototype.GetZoomFit = function()
	{
		return 100;
	};
	CMobileDelegateSimple.prototype.GetScrollerParent = function()
	{
		return null;
	};
	CMobileDelegateSimple.prototype.GetScrollerSize = function()
	{
		return { W : 100, H : 100 };
	};
	CMobileDelegateSimple.prototype.ScrollTo = function(_scroll)
	{
		return;
	};
	CMobileDelegateSimple.prototype.ScrollEnd = function(_scroll)
	{
		return;
	};
	CMobileDelegateSimple.prototype.GetSelectionRectsBounds = function()
	{
		return this.LogicDocument.Get_SelectionBounds();
	};
	CMobileDelegateSimple.prototype.IsReader = function()
	{
		return false;
	};

	/**
	 * @extends {CMobileDelegateSimple}
	 */
	function CMobileDelegateEditor(_api)
	{
		CMobileDelegateEditor.superclass.constructor.call(this, _api);

		this.HtmlPage 			= _api.WordControl;
		this.LogicDocument		= _api.WordControl.m_oLogicDocument;
		this.DrawingDocument 	= _api.WordControl.m_oDrawingDocument;
	}
	AscCommon.extendClass(CMobileDelegateEditor, CMobileDelegateSimple);

	CMobileDelegateEditor.prototype.GetSelectionTransform = function()
	{
		return this.DrawingDocument.SelectionMatrix;
	};
	CMobileDelegateEditor.prototype.ConvertCoordsToCursor = function(x, y, page)
	{
		return this.DrawingDocument.ConvertCoordsToCursor(x, y, page);
	};
	CMobileDelegateEditor.prototype.ConvertCoordsFromCursor = function(x, y)
	{
		return this.DrawingDocument.ConvertCoordsFromCursor2(x, y);
	};
	CMobileDelegateEditor.prototype.GetElementOffset = function()
	{
		var _xOffset = this.HtmlPage.X;
		var _yOffset = this.HtmlPage.Y;

		if (true === this.HtmlPage.m_bIsRuler)
		{
			_xOffset += (5 * g_dKoef_mm_to_pix);
			_yOffset += (7 * g_dKoef_mm_to_pix);
		}

		return { X : _xOffset, Y : _yOffset };
	};
	CMobileDelegateEditor.prototype.GetTableDrawing = function()
	{
		return this.DrawingDocument.TableOutlineDr;
	};
	CMobileDelegateEditor.prototype.GetZoom = function()
	{
		return this.HtmlPage.m_nZoomValue;
	};
	CMobileDelegateEditor.prototype.SetZoom = function(_value)
	{
		this.HtmlPage.m_oApi.zoom(_value);
	};
	CMobileDelegateEditor.prototype.GetObjectTrack = function(x, y, page)
	{
		return this.LogicDocument.DrawingObjects.isPointInDrawingObjects3(x, y, page);
	};
	CMobileDelegateEditor.prototype.GetContextMenuType = function()
	{
		var _mode = AscCommon.MobileTouchContextMenuType.None;

		if (!this.LogicDocument.Is_SelectionUse())
			_mode = AscCommon.MobileTouchContextMenuType.Target;

		if (this.LogicDocument.Get_SelectionBounds())
			_mode = AscCommon.MobileTouchContextMenuType.Select;

		if (_mode == 0 && this.LogicDocument.DrawingObjects.getSelectedObjectsBounds())
			_mode = AscCommon.MobileTouchContextMenuType.Object;

		return _mode;
	};
	CMobileDelegateEditor.prototype.GetContextMenuPosition = function()
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
	CMobileDelegateEditor.prototype.GetZoomFit = function()
	{
		var Zoom = 100;

		var w = this.HtmlPage.m_oEditor.AbsolutePosition.R - this.HtmlPage.m_oEditor.AbsolutePosition.L;

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

		return (Zoom - 0.5) >> 0;
	};
	CMobileDelegateEditor.prototype.GetScrollerParent = function()
	{
		return this.HtmlPage.m_oMainView.HtmlElement;
	};
	CMobileDelegateEditor.prototype.GetScrollerSize = function()
	{
		return { W : this.HtmlPage.m_dDocumentWidth, H : this.HtmlPage.m_dDocumentHeight };
	};
	CMobileDelegateEditor.prototype.ScrollTo = function(_scroll)
	{
		this.HtmlPage.NoneRepaintPages = (true === _scroll.isAnimating) ? true : false;
		if (_scroll.directionLocked == "v")
		{
			this.HtmlPage.m_oScrollVerApi.scrollToY(-_scroll.y);
		}
		else if (_scroll.directionLocked == "h")
		{
			this.HtmlPage.m_oScrollHorApi.scrollToX(-_scroll.x);
		}
		else if (_scroll.directionLocked == "n")
		{
			this.HtmlPage.m_oScrollHorApi.scrollToX(-_scroll.x);
			this.HtmlPage.m_oScrollVerApi.scrollToY(-_scroll.y);
		}
	};
	CMobileDelegateEditor.prototype.ScrollEnd = function(_scroll)
	{
		this.HtmlPage.NoneRepaintPages = (true === _scroll.isAnimating) ? true : false;
		_scroll.manager.OnScrollAnimationEnd();
		this.HtmlPage.OnScroll();
	};
	CMobileDelegateEditor.prototype.GetSelectionRectsBounds = function()
	{
		return this.LogicDocument.Get_SelectionBounds();
	};
	CMobileDelegateEditor.prototype.IsReader = function()
	{
		return (null != this.DrawingDocument.m_oDocumentRenderer);
	};

	CMobileDelegateEditor.prototype.Logic_GetNearestPos = function(x, y, page)
	{
		return this.LogicDocument.Get_NearestPos(page, x, y);
	};
	CMobileDelegateEditor.prototype.Logic_OnMouseDown = function(e, x, y, page)
	{
		return this.LogicDocument.OnMouseDown(global_mouseEvent, x, y, page);
	};
	CMobileDelegateEditor.prototype.Logic_OnMouseMove = function()
	{
		return this.LogicDocument.OnMouseMove(global_mouseEvent, x, y, page);
	};
	CMobileDelegateEditor.prototype.Logic_OnMouseUp = function()
	{
		return this.LogicDocument.OnMouseUp(global_mouseEvent, x, y, page);
	};
	CMobileDelegateEditor.prototype.Drawing_OnMouseDown = function(e)
	{
		return this.HtmlPage.onMouseDown(e);
	};
	CMobileDelegateEditor.prototype.Drawing_OnMouseMove = function(e)
	{
		return this.HtmlPage.onMouseMove(e);
	};
	CMobileDelegateEditor.prototype.Drawing_OnMouseUp = function(e)
	{
		return this.HtmlPage.onMouseUp(e);
	};

	function CMobileTouchManagerBase(_config, _delegate)
	{
		this.Api			= null;
		this.Mode 			= AscCommon.MobileTouchMode.None;

		this.IsTouching		= false;

		this.ReadingGlassTime  = 750;
		this.TimeDown          = 0;
		this.DownPoint         = null;
		this.DownPointOriginal = {X : 0, Y : 0};
		this.MoveAfterDown     = false;
		this.MoveMinDist       = 10;

		/* select text */
		this.SelectEnabled = (_config.isSelection !== false);
		this.RectSelect1 = null;
		this.RectSelect2 = null;
		this.PageSelect1 = 0;
		this.PageSelect2 = 0;

		this.TrackTargetEps = 20;

		/* zoom */
		this.ZoomEnabled  = (_config.isZoomEnabled !== false);
		this.ZoomDistance = 0;
		this.ZoomValue    = 100;
		this.ZoomValueMin = 50;
		this.ZoomValueMax = 300;

		/* table track */
		this.TableTrackEnabled 	   = (_config.isTableTrack !== false);
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

		/* context menu */
		this.ContextMenuLastMode 		= AscCommon.MobileTouchContextMenuType.None;
		this.ContextMenuLastModeCounter = 0;
		this.ContextMenuShowTimerId 	= -1;

		/* scroll object */
		this.iScroll = null;

		/* delegate */
		this.delegate = null;
	}

	CMobileTouchManagerBase.prototype.CreateScrollerDiv = function(_wrapper, _id)
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

	CMobileTouchManagerBase.prototype.LoadMobileImages = function()
	{
		window.g_table_track_mobile_move = new Image();
		window.g_table_track_mobile_move.asc_complete = false;
		window.g_table_track_mobile_move.onload       = function()
		{
			window.g_table_track_mobile_move.asc_complete = true;
		};
		window.g_table_track_mobile_move.src          = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAArlJREFUeNqMlc9rWkEQx8ffGqMJBJpSUEIISInxpCfT1krioQQ85xISEKGBkGuhpxwEL4GAoOBJ8V9IxJCQ1l4SkFKxQvEfKEXQ0Nb4IxLtfBefvMeriQPj7ps377Mzu7OjZjgckoYlGo2+tFqtcZ1OFyAiG00nfx8eHj7f3d19SKfTP5g11LBRs7u761lYWPiytbVl9/l8ZDKZpqL1ej0qlUp0enr6p9FovM5kMhU92w02my0OmN/vJ0TcbreJVxZzCH9ARqORQqGQCurxeAC2n52dxfkxDOCMXq9/5fV6aTAYEIc/BkHYkWKx2Ni2ubn5X+j5+fkbweIf5GdFmoAhMkny+TzF43GyWCzi+ejoSIA3NjYUQA4IA5xMmGnhBO33+4rowuEwbW9vKz7Gdtzf36uiHH2n1eJQkCoE0WFeKBTE2O12qdlsKhQ2vLu6uhKjXMHSyuhivLi4oEQiQVLUk/T4+JiKxaLCJtKXQNDLy0tKJpM0NzcnrThR4HNyciLm6+vraiAEB8P1KE9hoqCMzGYzGQwG4asASoZAIEDz8/OUSqWeBGLxg4MDWl1dHe+rKkKUDWpqf3//SeDh4SG5XC5x6nKGYg+lW+J2u6nT6TwKBEzuo0pZPiJSyPX1NWWz2bFdy1UWiUQIt0rykUSe8pDrr837MCMvakgwGCSHw0G5XE487+3t0dLSkip6FDozumABOODVvt3c3PiXl5cVjq1Wi1ZWVmhnZ0dcL6fTqYoMUqlUYP8Klg7dhlNp3N7evuM7a0DZcE9UrL64uEh2u318APJ35XIZl6HN0I/1er2GfmhkfcGb/JYP4/3s7OwaL2Ceph/yvnU5i+/VajVVq9U+semnaLCjTvGM9TkuAaKesmP3WX+z/mKts3Y00l/ACDIzamfa0UKPCU4QR9tDEwIcfwH/BBgAl4G4NBf6Z6AAAAAASUVORK5CYII=";
	};

	CMobileTouchManagerBase.prototype.CheckSelectTrack = function()
	{
		if (!this.SelectEnabled)
			return false;

		var _matrix = this.delegate.GetSelectionTransform();
		if (_matrix && global_MatrixTransformer.IsIdentity(_matrix))
			_matrix = null;

		// проверим на попадание в селект - это может произойти на любом mode
		if (null != this.RectSelect1 && null != this.RectSelect2)
		{
			var pos1 = null;
			var pos4 = null;

			if (!_matrix)
			{
				pos1 = this.delegate.ConvertCoordsToCursor(this.RectSelect1.x, this.RectSelect1.y, this.PageSelect1);
				pos4 = this.delegate.ConvertCoordsToCursor(this.RectSelect2.x + this.RectSelect2.w, this.RectSelect2.y + this.RectSelect2.h, this.PageSelect2);
			}
			else
			{
				var _xx1 = _matrix.TransformPointX(this.RectSelect1.x, this.RectSelect1.y);
				var _yy1 = _matrix.TransformPointY(this.RectSelect1.x, this.RectSelect1.y);

				var _xx2 = _matrix.TransformPointX(this.RectSelect2.x + this.RectSelect2.w, this.RectSelect2.y + this.RectSelect2.h);
				var _yy2 = _matrix.TransformPointY(this.RectSelect2.x + this.RectSelect2.w, this.RectSelect2.y + this.RectSelect2.h);

				pos1 = this.delegate.ConvertCoordsToCursor(_xx1, _yy1, this.PageSelect1);
				pos4 = this.delegate.ConvertCoordsToCursor(_xx2, _yy2, this.PageSelect2);
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

	CMobileTouchManagerBase.prototype.CheckTableTrack = function()
	{
		if (!this.TableTrackEnabled)
			return false;

		var _offset = this.delegate.GetElementOffset();

		var _eps     = this.TrackTargetEps;
		var bIsTable = false;

		var _table_outline_dr = this.delegate.GetTableDrawing();
		if (this.TableMovePoint != null && _table_outline_dr)
		{
			var _Transform = _table_outline_dr.TableMatrix;
			var _PageNum   = _table_outline_dr.CurrentPageIndex;

			if (!_Transform || global_MatrixTransformer.IsIdentity(_Transform))
			{
				var _x = global_mouseEvent.X - _offset.X;
				var _y = global_mouseEvent.Y - _offset.Y;

				var posLT   = this.delegate.ConvertCoordsToCursor(this.TableMovePoint.X, this.TableMovePoint.Y, _PageNum);
				var _offset = this.TableRulersRectSize + this.TableRulersRectOffset;

				if (_x > (posLT.X - _offset - _eps) && _x < (posLT.X - this.TableRulersRectOffset + _eps) &&
					_y > (posLT.Y - _offset - _eps) && _y < (posLT.Y - this.TableRulersRectOffset + _eps))
				{
					this.Mode = AscCommon.MobileTouchMode.TableMove;
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
							var posM1 = this.delegate.ConvertCoordsToCursor(this.TableHorRulerPoints[i].C, this.TableMovePoint.Y, _PageNum);
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
							this.Mode                     = AscCommon.MobileTouchMode.TableRuler;

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
							var posM1 = this.delegate.ConvertCoordsToCursor(this.TableMovePoint.X, this.TableVerRulerPoints[i].Y, _PageNum);
							var posM2 = this.delegate.ConvertCoordsToCursor(this.TableMovePoint.X, this.TableVerRulerPoints[i].Y + this.TableVerRulerPoints[i].H, _PageNum);

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
							this.Mode                     = AscCommon.MobileTouchMode.TableRuler;

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
				var pos = this.delegate.ConvertCoordsFromCursor(global_mouseEvent.X, global_mouseEvent.Y);
				if (pos.Page == _PageNum)
				{
					var _invert = global_MatrixTransformer.Invert(_Transform);
					var _posx   = _invert.TransformPointX(pos.X, pos.Y);
					var _posy   = _invert.TransformPointY(pos.X, pos.Y);

					var _koef = AscCommon.g_dKoef_pix_to_mm * 100 / this.delegate.GetZoom();
					var _eps1 = this.TrackTargetEps * _koef;

					var _offset1 = this.TableRulersRectOffset * _koef;
					var _offset2 = _offset1 + this.TableRulersRectSize * _koef;
					if ((_posx >= (this.TableMovePoint.X - _offset2 - _eps1)) && (_posx <= (this.TableMovePoint.X - _offset1 + _eps1)) &&
						(_posy >= (this.TableMovePoint.Y - _offset2 - _eps1)) && (_posy <= (this.TableMovePoint.Y - _offset1 + _eps1)))
					{
						this.Mode = AscCommon.MobileTouchMode.TableMove;
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
									this.Mode                     = AscCommon.MobileTouchMode.TableRuler;

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
									this.Mode                     = AscCommon.MobileTouchMode.TableRuler;

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

		return bIsTable;
	};

	CMobileTouchManagerBase.prototype.CheckObjectTrack = function()
	{
		var pos = this.delegate.ConvertCoordsFromCursor(global_mouseEvent.X, global_mouseEvent.Y);

		var dKoef                     = (100 * AscCommon.g_dKoef_pix_to_mm / this.delegate.GetZoom());
		global_mouseEvent.KoefPixToMM = 5;
		if (this.delegate.GetObjectTrack(pos.X, pos.Y, pos.Page))
		{
			this.Mode      = AscCommon.MobileTouchMode.FlowObj;
		}
		else
		{
			this.Mode = AscCommon.MobileTouchMode.None;
		}
		global_mouseEvent.KoefPixToMM = 1;

		return (AscCommon.MobileTouchMode.FlowObj == this.Mode);
	};

	CMobileTouchManagerBase.prototype.CheckZoomCriticalValues = function(zoomMin)
	{
		if (zoomMin !== undefined)
		{
			this.ZoomValueMin = zoomMin;
			return;
		}

		var _new_value = this.delegate.GetZoomFit();

		this.ZoomValueMin = _new_value;
		if (this.ZoomValue < this.ZoomValueMin)
		{
			this.ZoomValue = this.ZoomValueMin;
			this.delegate.SetZoom(this.ZoomValue);
		}
	};

	CMobileTouchManagerBase.prototype.Resize = function()
	{
		if (this.iScroll != null)
		{
			var _size = this.delegate.GetScrollerSize();
			this.iScroll.scroller.style.width = _size.W + "px";
			this.iScroll.scroller.style.height = _size.H + "px";

			this.iScroll.refresh(true);
		}
	};

	CMobileTouchManagerBase.prototype.IsWorkedPosition = function()
	{
		if (this.IsTouching)
			return true;

		if (this.iScroll && this.iScroll.isAnimating)
			return true;

		return false;
	};

	CMobileTouchManagerBase.prototype.Destroy = function()
	{
		var _scroller = document.getElementById("mobile_scroller_id");
		this.delegate.GetScrollerParent().removeChild(_scroller);

		if (this.iScroll != null)
			this.iScroll.destroy();
	};

	/* contect menu */
	CMobileTouchManagerBase.prototype.SendShowContextMenu = function()
	{
		if (-1 != this.ContextMenuShowTimerId)
		{
			clearTimeout(this.ContextMenuShowTimerId);
		}
		var that             = this;
		this.ContextMenuShowTimerId = setTimeout(function()
		{
			var _pos = that.delegate.GetContextMenuPosition();
			that.Api.sendEvent("asc_onShowPopMenu", _pos.X, _pos.Y, (_pos.Mode > 1) ? true : false);
		}, 500);
	};

	CMobileTouchManagerBase.prototype.CheckContextMenuTouchEnd = function(isCheck)
	{
		// isCheck: если пришли сюда после скролла или зума (или их анимации) - то не нужно проверять состояние редактора.
		// Нужно проверять последнее сохраненной состояние

		if (isCheck)
		{
			var _mode = this.delegate.GetContextMenuType();
			if (_mode == this.ContextMenuLastMode)
			{
				this.ContextMenuLastModeCounter++;
				this.ContextMenuLastModeCounter &= 0x01;
			}
			else
			{
				this.ContextMenuLastModeCounter = 0;
			}

			this.ContextMenuLastMode = _mode;
		}

		if (this.ContextMenuLastMode > AscCommon.MobileTouchContextMenuType.None && 1 == this.ContextMenuLastModeCounter)
			this.SendShowContextMenu();
	};

	CMobileTouchManagerBase.prototype.ClearContextMenu = function()
	{
		this.ContextMenuLastMode 		= AscCommon.MobileTouchContextMenuType.None;
		this.ContextMenuLastModeCounter = 0;
		this.Api.sendEvent("asc_onHidePopMenu");
	};

	CMobileTouchManagerBase.prototype.OnScrollAnimationEnd = function()
	{
		if (this.Api.isViewMode)
			return;

		this.CheckContextMenuTouchEnd(false);
	};

	/* select rects */
	CMobileTouchManagerBase.prototype.CheckSelectRects = function()
	{
		this.RectSelect1 = null;
		this.RectSelect2 = null;

		var _select = this.delegate.GetSelectionRectsBounds();
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

	CMobileTouchManagerBase.prototype.CheckSelect = function(overlay)
	{
		this.CheckSelectRects();
		if (null == this.RectSelect1 || null == this.RectSelect2)
			return;

		var _matrix = this.delegate.GetSelectionTransform();
		var ctx         = overlay.m_oContext;
		ctx.strokeStyle = "#146FE1";
		ctx.fillStyle 	= "#146FE1";

		if (!_matrix || global_MatrixTransformer.IsIdentity(_matrix))
		{
			var pos1 = this.delegate.ConvertCoordsToCursor(this.RectSelect1.x, this.RectSelect1.y, this.PageSelect1);
			var pos2 = this.delegate.ConvertCoordsToCursor(this.RectSelect1.x, this.RectSelect1.y + this.RectSelect1.h, this.PageSelect1);

			var pos3 = this.delegate.ConvertCoordsToCursor(this.RectSelect2.x + this.RectSelect2.w, this.RectSelect2.y, this.PageSelect2);
			var pos4 = this.delegate.ConvertCoordsToCursor(this.RectSelect2.x + this.RectSelect2.w, this.RectSelect2.y + this.RectSelect2.h, this.PageSelect2);

			ctx.beginPath();

			ctx.moveTo(pos1.X >> 0, pos1.Y >> 0);
			ctx.lineTo(pos2.X >> 0, pos2.Y >> 0);

			ctx.moveTo(pos3.X >> 0, pos3.Y >> 0);
			ctx.lineTo(pos4.X >> 0, pos4.Y >> 0);

			ctx.lineWidth = 2;
			ctx.stroke();

			ctx.beginPath();

			overlay.AddEllipse(pos1.X, pos1.Y - 5, AscCommon.MOBILE_SELECT_TRACK_ROUND / 2);
			overlay.AddEllipse(pos4.X, pos4.Y + 5, AscCommon.MOBILE_SELECT_TRACK_ROUND / 2);
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

			var pos1 = this.delegate.ConvertCoordsToCursor(_xx11, _yy11, this.PageSelect1);
			var pos2 = this.delegate.ConvertCoordsToCursor(_xx12, _yy12, this.PageSelect1);

			var pos3 = this.delegate.ConvertCoordsToCursor(_xx21, _yy21, this.PageSelect2);
			var pos4 = this.delegate.ConvertCoordsToCursor(_xx22, _yy22, this.PageSelect2);

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

			overlay.AddEllipse(_x1, _y1, AscCommon.MOBILE_SELECT_TRACK_ROUND / 2);
			overlay.AddEllipse(_x2, _y2, AscCommon.MOBILE_SELECT_TRACK_ROUND / 2);
			ctx.fill();

			ctx.beginPath();
		}
	};

	CMobileTouchManagerBase.prototype.CheckTableRules = function(overlay)
	{
		if (this.Api.isViewMode || !this.TableTrackEnabled)
			return;

		var HtmlPage = this.delegate.HtmlPage;
		var DrawingDocument = this.delegate.DrawingDocument;

		var horRuler = HtmlPage.m_oHorRuler;
		var verRuler = HtmlPage.m_oVerRuler;

		var _table_outline_dr = this.delegate.GetTableDrawing();
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

			var pos1 = rawingDocument.ConvertCoordsToCursorWR(_tableOutline.X, _tableOutline.Y, _tableOutline.PageNum);
			var pos2 = rawingDocument.ConvertCoordsToCursorWR(_tableOutline.X + _tableW, _tableOutline.Y, _tableOutline.PageNum);

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

			var pos3 = DrawingDocument.ConvertCoordsToCursorWR(_tableOutline.X, _y1, DrawingDocument.m_lCurrentPage);
			var pos4 = DrawingDocument.ConvertCoordsToCursorWR(_tableOutline.X, _y2, DrawingDocument.m_lCurrentPage);

			var _ttX = (pos1.X >> 0) + 0.5 - (_epsRects + _rectWidth);
			gradObj  = ctx.createLinearGradient(_ttX, (pos3.Y >> 0) + 0.5, _ttX, (pos3.Y >> 0) + 0.5 + (pos4.Y - pos3.Y) >> 0);
			gradObj.addColorStop(0, "#f1f1f1");
			gradObj.addColorStop(1, "#dfdfdf");
			ctx.fillStyle = gradObj;

			overlay.AddRoundRect((pos1.X >> 0) + 1.5 - (_epsRects + _rectWidth), (pos3.Y >> 0) + 0.5, _rectWidth - 1, (pos4.Y - pos3.Y) >> 0, 4);

			ctx.fill();
			ctx.stroke();

			ctx.beginPath();

			var dKoef = (HtmlPage.m_nZoomValue * g_dKoef_mm_to_pix / 100);
			var xDst  = DrawingDocument.m_arrPages[DrawingDocument.m_lCurrentPage].drawingPage.left;
			var yDst  = DrawingDocument.m_arrPages[DrawingDocument.m_lCurrentPage].drawingPage.top;

			var _oldY = _table_markup.Rows[0].Y + _table_markup.Rows[0].H;

			this.TableVerRulerPoints = [];
			var _rectIndex           = 0;
			var _x                   = (pos1.X - _epsRects - _rectWidth) >> 0;

			ctx.fillStyle = "#146FE1";
			for (var i = 1; i <= _count; i++)
			{
				var _newPos = (i != _count) ? _table_markup.Rows[i].Y : _oldY;

				var _p = {Y : _oldY, H : (_newPos - _oldY)};
				var _y = DrawingDocument.ConvertCoordsToCursorWR(0, _oldY, _tableOutline.PageNum);

				ctx.beginPath();
				overlay.AddDiamond(_x + 1.5 + (_rectWidth >> 1), _y.Y, AscCommon.MOBILE_TABLE_RULER_DIAMOND);
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
				overlay.AddDiamond(__c, TableMoveRect_y +_rectWidth / 2, AscCommon.MOBILE_TABLE_RULER_DIAMOND);
				ctx.fill();
				ctx.beginPath();

				this.TableHorRulerPoints[_rectIndex++] = {X : _x, W : _r - _x, C : _col};
			}

			ctx.beginPath();
			if (this.Mode == AscCommon.MobileTouchMode.TableRuler)
			{
				if (0 == this.TableCurrentMoveDir)
				{
					var _pos = DrawingDocument.ConvertCoordsToCursorWR(this.TableCurrentMoveValue, 0, _table_outline_dr.CurrentPageIndex);
					overlay.VertLine(_pos.X, true);
				}
				else
				{
					var _pos = DrawingDocument.ConvertCoordsToCursorWR(0, this.TableCurrentMoveValue, _table_outline_dr.CurrentPageIndex);
					overlay.HorLine(_pos.Y, true);
				}
			}
		}
		else
		{
			var dKoef = (HtmlPage.m_nZoomValue * g_dKoef_mm_to_pix / 100);

			var xDst  = DrawingDocument.m_arrPages[DrawingDocument.m_lCurrentPage].drawingPage.left;
			var yDst  = DrawingDocument.m_arrPages[DrawingDocument.m_lCurrentPage].drawingPage.top;

			ctx.lineWidth = 1 / dKoef;

			if (overlay.IsRetina)
				dKoef *= 2;

			var _coord_transform = new AscCommon.CMatrix();
			_coord_transform.sx  = dKoef;
			_coord_transform.sy  = dKoef;
			_coord_transform.tx  = xDst;
			_coord_transform.ty  = yDst;

			var _diamond_size = AscCommon.MOBILE_TABLE_RULER_DIAMOND;
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
			if (this.Mode == AscCommon.MobileTouchMode.TableRuler)
			{
				if (0 == this.TableCurrentMoveDir)
				{
					var _pos = DrawingDocument.ConvertCoordsToCursorWR(this.TableCurrentMoveValue, 0, _table_outline_dr.CurrentPageIndex, _table_outline_dr.TableMatrix);
					overlay.VertLine(_pos.X, true);
				}
				else
				{
					var _pos = DrawingDocument.ConvertCoordsToCursorWR(0, this.TableCurrentMoveValue, _table_outline_dr.CurrentPageIndex, _table_outline_dr.TableMatrix);
					overlay.HorLine(_pos.Y, true);
				}
			}
		}
	};

	/* viewer methods */
	CMobileTouchManagerBase.prototype.onTouchStart_renderer = function(e)
	{
		AscCommon.check_MouseDownEvent(e.touches ? e.touches[0] : e, true);
		global_mouseEvent.LockMouse();

		this.MoveAfterDown = false;

		if (e.touches && 2 == e.touches.length)
		{
			this.Mode = AscCommon.MobileTouchMode.Zoom;
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
			case AscCommon.MobileTouchMode.Zoom:
			{
				this.delegate.HtmlPage.NoneRepaintPages = true;

				var _x1 = (e.touches[0].pageX !== undefined) ? e.touches[0].pageX : e.touches[0].clientX;
				var _y1 = (e.touches[0].pageY !== undefined) ? e.touches[0].pageY : e.touches[0].clientY;

				var _x2 = (e.touches[1].pageX !== undefined) ? e.touches[1].pageX : e.touches[1].clientX;
				var _y2 = (e.touches[1].pageY !== undefined) ? e.touches[1].pageY : e.touches[1].clientY;

				this.ZoomDistance = Math.sqrt((_x1 - _x2) * (_x1 - _x2) + (_y1 - _y2) * (_y1 - _y2));
				this.ZoomValue    = this.delegate.GetZoom();

				break;
			}
		}

		if (e.preventDefault)
			e.preventDefault();
		else
			e.returnValue = false;
	};
	CMobileTouchManagerBase.prototype.onTouchMove_renderer  = function(e)
	{
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
			case AscCommon.MobileTouchMode.Scroll:
			{
				var _offsetX = global_mouseEvent.X - this.DownPointOriginal.X;
				var _offsetY = global_mouseEvent.Y - this.DownPointOriginal.Y;

				this.iScroll._move(e);
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
	CMobileTouchManagerBase.prototype.onTouchEnd_renderer   = function(e)
	{
		AscCommon.check_MouseUpEvent(e.changedTouches ? e.changedTouches[0] : e);

		switch (this.Mode)
		{
			case AscCommon.MobileTouchMode.Scroll:
			{
				this.iScroll._end(e);
				this.Mode = AscCommon.MobileTouchMode.None;

				if (!this.MoveAfterDown)
				{
					this.Api.sendEvent("asc_onTapEvent", e);
				}
				break;
			}
			case AscCommon.MobileTouchMode.Zoom:
			{
				// здесь нужно запускать отрисовку, если есть анимация зума
				this.delegate.HtmlPage.NoneRepaintPdelegate.ages = false;
				this.delegate.HtmlPage.m_bIsFullRepaint = true;
				this.delegate.HtmlPage.OnScroll();

				this.Mode = AscCommon.MobileTouchMode.None;
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

	/* simple click */
	CMobileTouchManagerBase.prototype.MoveCursorToPoint = function(isHalfHeight)
	{
		AscCommon.check_MouseMoveEvent(e);
		var pos = this.delegate.ConvertCoordsFromCursor(global_mouseEvent.X, global_mouseEvent.Y);

		var old_click_count          = global_mouseEvent.ClickCount;
		global_mouseEvent.ClickCount = 1;

		var nearPos = this.delegate.Logic_GetNearestPos(pos.Page, pos.X, pos.Y);

		this.delegate.DrawingDocument.NeedScrollToTargetFlag = true;
		var y = nearPos.Y;
		if (isHalfHeight)
			y += nearPos.Height / 2;
		this.delegate.Logic_OnMouseDown(global_mouseEvent, nearPos.X, y, pos.Page);
		this.delegate.Logic_OnMouseUp(global_mouseEvent, nearPos.X, y, pos.Page);
		this.delegate.DrawingDocument.NeedScrollToTargetFlag = false;

		global_mouseEvent.ClickCount = old_click_count;
	};

	//--------------------------------------------------------export----------------------------------------------------
	AscCommon.CMobileTouchManagerBase = CMobileTouchManagerBase;
	AscCommon.CMobileDelegateEditor = CMobileDelegateEditor;
})(window);
