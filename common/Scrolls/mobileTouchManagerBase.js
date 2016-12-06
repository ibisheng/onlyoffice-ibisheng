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

	function CMobileDelegateSimple(_api)
	{
		this.Api = _api;
	}

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
	CMobileDelegateSimple.prototype.GetObjectTrack = function(x, y, page)
	{
		return false;
	};
	CMobileDelegateSimple.prototype.GetContextMenuType = function()
	{
		return AscCommon.MobileTouchContextMenuType.None;
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
	CMobileDelegateSimple.prototype.ConvertCoordsFromCursor = function(x, y)
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
				var pos = this.DrawingDocument.ConvertCoordsFromCursor(global_mouseEvent.X, global_mouseEvent.Y);
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

	//--------------------------------------------------------export----------------------------------------------------
	AscCommon.CMobileTouchManagerBase = CMobileTouchManagerBase;
})(window);
