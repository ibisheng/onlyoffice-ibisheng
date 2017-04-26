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

// Import
var FontStyle = AscFonts.FontStyle;
var g_fontApplication = AscFonts.g_fontApplication;

var CColor = AscCommon.CColor;
var CAscMathCategory = AscCommon.CAscMathCategory;
var g_oTableId = AscCommon.g_oTableId;
var g_oTextMeasurer = AscCommon.g_oTextMeasurer;
var global_mouseEvent = AscCommon.global_mouseEvent;
var History = AscCommon.History;
var global_MatrixTransformer = AscCommon.global_MatrixTransformer;
var g_dKoef_pix_to_mm = AscCommon.g_dKoef_pix_to_mm;
var g_dKoef_mm_to_pix = AscCommon.g_dKoef_mm_to_pix;

var _canvas_tables = null;
var _table_styles = null;

var c_oContentControlTrack = {
	Hover 	: 0,
	In 		: 1
};

function CColumnsMarkupColumn()
{
	this.W = 0;
	this.Space = 0;
}

function CColumnsMarkup()
{
	this.CurCol = 0;
	this.X = 0; // левое поле
	this.R = 0; // правое поле

	this.EqualWidth = true;
	this.Num = 1;
	this.Space = 30;
	this.Cols = [];

	this.SectPr = null;
}
CColumnsMarkup.prototype.Update_FromSectPr = function (SectPr)
{
	if (!SectPr)
		return;

	this.SectPr = SectPr;

	var Columns = SectPr.Columns;

	this.X = SectPr.Get_PageMargin_Left();
	this.R = SectPr.Get_PageWidth() - SectPr.Get_PageMargin_Right();
	this.EqualWidth = Columns.EqualWidth;
	this.Num = Columns.Num;
	this.Space = Columns.Space;

	this.Cols = [];
	for (var Index = 0, Count = Columns.Cols.length; Index < Count; ++Index)
	{
		this.Cols[Index] = new CColumnsMarkupColumn();
		this.Cols[Index].W = Columns.Cols[Index].W;
		this.Cols[Index].Space = Columns.Cols[Index].Space;
	}
};
CColumnsMarkup.prototype.Set_CurCol = function (CurCol)
{
	this.CurCol = CurCol;
};
CColumnsMarkup.prototype.CreateDuplicate = function ()
{
	var _ret = new CColumnsMarkup();
	_ret.SectPr = this.SectPr;
	_ret.CurCol = this.CurCol;
	_ret.X = this.X;
	_ret.R = this.R;

	_ret.EqualWidth = this.EqualWidth;
	_ret.Num = this.Num;
	_ret.Space = this.Space;

	_ret.Cols = [];

	for (var i = 0; i < this.Cols.length; i++)
	{
		var _col = new CColumnsMarkupColumn();
		_col.W = this.Cols[i].W;
		_col.Space = this.Cols[i].Space;
		_ret.Cols.push(_col);
	}
	return _ret;
};

function CTableOutlineDr()
{
	var image_64 = "u7u7/7u7u/+7u7v/u7u7/7u7u/+7u7v/u7u7/7u7u/+7u7v/u7u7/7u7u/+7u7v/u7u7/7u7u//6+vr/+vr6//r6+v/6+vr/+vr6//r6+v/6+vr/+vr6//r6+v/6+vr/+vr6/4+Pj/+7u7v/9vb2//b29v/39/f/9/f3//f39/83aMT/9/f3//f39//39/f/9/f3//f39/+Pj4//u7u7//Ly8v/y8vL/8vLy//Pz8/83aMT/N2jE/zdoxP/z8/P/8/Pz//Pz8//z8/P/j4+P/7u7u//u7u7/7u7u/+7u7v/u7u7/7u7u/zdoxP/u7u7/7u7u/+7u7v/u7u7/7u7u/4+Pj/+7u7v/6Ojo/+jo6P83aMT/6enp/+np6f83aMT/6enp/+np6f83aMT/6enp/+np6f+Pj4//u7u7/+Pj4/83aMT/N2jE/zdoxP83aMT/N2jE/zdoxP83aMT/N2jE/zdoxP/k5OT/j4+P/7u7u//o6Oj/6Ojo/zdoxP/o6Oj/6Ojo/zdoxP/o6Oj/6Ojo/zdoxP/o6Oj/6Ojo/4+Pj/+7u7v/7e3t/+3t7f/t7e3/7e3t/+3t7f83aMT/7e3t/+zs7P/s7Oz/7Ozs/+zs7P+Pj4//u7u7//Ly8v/y8vL/8vLy//Ly8v83aMT/N2jE/zdoxP/x8fH/8fHx//Hx8f/x8fH/j4+P/7u7u//19fX/9fX1//X19f/19fX/9fX1/zdoxP/19fX/9fX1//X19f/19fX/9fX1/4+Pj/+7u7v/+fn5//n5+f/5+fn/+fn5//n5+f/5+fn/+fn5//n5+f/5+fn/+fn5//j4+P+Pj4//u7u7/4+Pj/+Pj4//j4+P/4+Pj/+Pj4//j4+P/4+Pj/+Pj4//j4+P/4+Pj/+Pj4//j4+P/w==";

	this.image = document.createElement('canvas');
	this.image.width = 13;
	this.image.height = 13;

	var ctx = this.image.getContext('2d');
	var _data = ctx.createImageData(13, 13);

	AscFonts.DecodeBase64(_data, image_64);
	ctx.putImageData(_data, 0, 0);

	_data = null;
	image_64 = null;

	this.TableOutline = null;
	this.Counter = 0;
	this.bIsNoTable = true;
	this.bIsTracked = false;

	this.CurPos = null;
	this.TrackTablePos = 0; // 0 - left_top, 1 - right_top, 2 - right_bottom, 3 - left_bottom
	this.TrackOffsetX = 0;
	this.TrackOffsetY = 0;

	this.InlinePos = null;

	this.IsChangeSmall = true;
	this.ChangeSmallPoint = null;

	this.TableMatrix = null;
	this.CurrentPageIndex = null;

	this.checkMouseDown = function (pos, word_control)
	{
		if (null == this.TableOutline)
			return false;

		var _table_track = this.TableOutline;
		var _d = 13 * g_dKoef_pix_to_mm * 100 / word_control.m_nZoomValue;

		this.IsChangeSmall = true;
		this.ChangeSmallPoint = pos;

		this.CurPos = {X: this.ChangeSmallPoint.X, Y: this.ChangeSmallPoint.Y, Page: this.ChangeSmallPoint.Page};
		this.TrackOffsetX = 0;
		this.TrackOffsetY = 0;

		if (!this.TableMatrix || global_MatrixTransformer.IsIdentity(this.TableMatrix))
		{
			if (word_control.MobileTouchManager)
			{
				var _move_point = word_control.MobileTouchManager.TableMovePoint;

				if (_move_point == null || pos.Page != _table_track.PageNum)
					return false;

				var _pos1 = word_control.m_oDrawingDocument.ConvertCoordsToCursorWR(pos.X, pos.Y, pos.Page);
				var _pos2 = word_control.m_oDrawingDocument.ConvertCoordsToCursorWR(_move_point.X, _move_point.Y, pos.Page);

				var _eps = word_control.MobileTouchManager.TrackTargetEps;

				var _offset1 = word_control.MobileTouchManager.TableRulersRectOffset;
				var _offset2 = _offset1 + word_control.MobileTouchManager.TableRulersRectSize;
				if ((_pos1.X >= (_pos2.X - _offset2 - _eps)) && (_pos1.X <= (_pos2.X - _offset1 + _eps)) &&
					(_pos1.Y >= (_pos2.Y - _offset2 - _eps)) && (_pos1.Y <= (_pos2.Y - _offset1 + _eps)))
				{
					this.TrackTablePos = 0;
					return true;
				}

				return false;
			}

			switch (this.TrackTablePos)
			{
				case 1:
				{
					var _x = _table_track.X + _table_track.W;
					var _b = _table_track.Y;
					var _y = _b - _d;
					var _r = _x + _d;

					if ((pos.X > _x) && (pos.X < _r) && (pos.Y > _y) && (pos.Y < _b))
					{
						this.TrackOffsetX = pos.X - _x;
						this.TrackOffsetY = pos.Y - _b;

						this.CurPos.X -= this.TrackOffsetX;
						this.CurPos.Y -= this.TrackOffsetY;
						return true;
					}
					return false;
				}
				case 2:
				{
					var _x = _table_track.X + _table_track.W;
					var _y = _table_track.Y + _table_track.H;
					var _r = _x + _d;
					var _b = _y + _d;

					if ((pos.X > _x) && (pos.X < _r) && (pos.Y > _y) && (pos.Y < _b))
					{
						this.TrackOffsetX = pos.X - _x;
						this.TrackOffsetY = pos.Y - _y;
						return true;
					}
					return false;
				}
				case 3:
				{
					var _r = _table_track.X;
					var _x = _r - _d;
					var _y = _table_track.Y + _table_track.H;
					var _b = _y + _d;

					if ((pos.X > _x) && (pos.X < _r) && (pos.Y > _y) && (pos.Y < _b))
					{
						this.TrackOffsetX = pos.X - _r;
						this.TrackOffsetY = pos.Y - _y;

						this.CurPos.X -= this.TrackOffsetX;
						this.CurPos.Y -= this.TrackOffsetY;
						return true;
					}
					return false;
				}
				case 0:
				default:
				{
					var _r = _table_track.X;
					var _b = _table_track.Y;
					var _x = _r - _d;
					var _y = _b - _d;

					if ((pos.X > _x) && (pos.X < _r) && (pos.Y > _y) && (pos.Y < _b))
					{
						this.TrackOffsetX = pos.X - _r;
						this.TrackOffsetY = pos.Y - _b;

						this.CurPos.X -= this.TrackOffsetX;
						this.CurPos.Y -= this.TrackOffsetY;
						return true;
					}
					return false;
				}
			}
		}
		else
		{
			if (word_control.MobileTouchManager)
			{
				var _invert = global_MatrixTransformer.Invert(this.TableMatrix);
				var _posx = _invert.TransformPointX(pos.X, pos.Y);
				var _posy = _invert.TransformPointY(pos.X, pos.Y);

				var _move_point = word_control.MobileTouchManager.TableMovePoint;

				if (_move_point == null || pos.Page != _table_track.PageNum)
					return false;

				var _koef = g_dKoef_pix_to_mm * 100 / word_control.m_nZoomValue;
				var _eps = word_control.MobileTouchManager.TrackTargetEps * _koef;

				var _offset1 = word_control.MobileTouchManager.TableRulersRectOffset * _koef;
				var _offset2 = _offset1 + word_control.MobileTouchManager.TableRulersRectSize * _koef;
				if ((_posx >= (_move_point.X - _offset2 - _eps)) && (_posx <= (_move_point.X - _offset1 + _eps)) &&
					(_posy >= (_move_point.Y - _offset2 - _eps)) && (_posy <= (_move_point.Y - _offset1 + _eps)))
				{
					this.TrackTablePos = 0;
					return true;
				}

				return false;
			}

			var _invert = global_MatrixTransformer.Invert(this.TableMatrix);
			var _posx = _invert.TransformPointX(pos.X, pos.Y);
			var _posy = _invert.TransformPointY(pos.X, pos.Y);
			switch (this.TrackTablePos)
			{
				case 1:
				{
					var _x = _table_track.X + _table_track.W;
					var _b = _table_track.Y;
					var _y = _b - _d;
					var _r = _x + _d;

					if ((_posx > _x) && (_posx < _r) && (_posy > _y) && (_posy < _b))
					{
						this.TrackOffsetX = _posx - _x;
						this.TrackOffsetY = _posy - _b;

						this.CurPos.X -= this.TrackOffsetX;
						this.CurPos.Y -= this.TrackOffsetY;
						return true;
					}
					return false;
				}
				case 2:
				{
					var _x = _table_track.X + _table_track.W;
					var _y = _table_track.Y + _table_track.H;
					var _r = _x + _d;
					var _b = _y + _d;

					if ((_posx > _x) && (_posx < _r) && (_posy > _y) && (_posy < _b))
					{
						this.TrackOffsetX = _posx - _x;
						this.TrackOffsetY = _posy - _y;

						this.CurPos.X -= this.TrackOffsetX;
						this.CurPos.Y -= this.TrackOffsetY;
						return true;
					}
					return false;
				}
				case 3:
				{
					var _r = _table_track.X;
					var _x = _r - _d;
					var _y = _table_track.Y + _table_track.H;
					var _b = _y + _d;

					if ((_posx > _x) && (_posx < _r) && (_posy > _y) && (_posy < _b))
					{
						this.TrackOffsetX = _posx - _r;
						this.TrackOffsetY = _posy - _y;

						this.CurPos.X -= this.TrackOffsetX;
						this.CurPos.Y -= this.TrackOffsetY;
						return true;
					}
					return false;
				}
				case 0:
				default:
				{
					var _r = _table_track.X;
					var _b = _table_track.Y;
					var _x = _r - _d;
					var _y = _b - _d;

					if ((_posx > _x) && (_posx < _r) && (_posy > _y) && (_posy < _b))
					{
						this.TrackOffsetX = _posx - _r;
						this.TrackOffsetY = _posy - _b;

						this.CurPos.X -= this.TrackOffsetX;
						this.CurPos.Y -= this.TrackOffsetY;
						return true;
					}
					return false;
				}
			}
		}

		return false;
	}

	this.checkMouseUp = function (X, Y, word_control)
	{
		this.bIsTracked = false;

		if (null == this.TableOutline || (true === this.IsChangeSmall) || word_control.m_oApi.isViewMode)
			return false;

		var _d = 13 * g_dKoef_pix_to_mm * 100 / word_control.m_nZoomValue;

		var _outline = this.TableOutline;
		var _table = _outline.Table;

		_table.MoveCursorToStartPos();
		_table.Document_SetThisElementCurrent(true);

		if (!_table.Is_Inline())
		{
			var pos;
			switch (this.TrackTablePos)
			{
				case 1:
				{
					var _w_pix = this.TableOutline.W * g_dKoef_mm_to_pix * word_control.m_nZoomValue / 100;
					pos = word_control.m_oDrawingDocument.ConvertCoordsFromCursor2(X - _w_pix, Y);
					break;
				}
				case 2:
				{
					var _w_pix = this.TableOutline.W * g_dKoef_mm_to_pix * word_control.m_nZoomValue / 100;
					var _h_pix = this.TableOutline.H * g_dKoef_mm_to_pix * word_control.m_nZoomValue / 100;
					pos = word_control.m_oDrawingDocument.ConvertCoordsFromCursor2(X - _w_pix, Y - _h_pix);
					break;
				}
				case 3:
				{
					var _h_pix = this.TableOutline.H * g_dKoef_mm_to_pix * word_control.m_nZoomValue / 100;
					pos = word_control.m_oDrawingDocument.ConvertCoordsFromCursor2(X, Y - _h_pix);
					break;
				}
				case 0:
				default:
				{
					pos = word_control.m_oDrawingDocument.ConvertCoordsFromCursor2(X, Y);
					break;
				}
			}

			var NearestPos = word_control.m_oLogicDocument.Get_NearestPos(pos.Page, pos.X - this.TrackOffsetX, pos.Y - this.TrackOffsetY);
			_table.Move(pos.X - this.TrackOffsetX, pos.Y - this.TrackOffsetY, pos.Page, NearestPos);
			_outline.X = pos.X - this.TrackOffsetX;
			_outline.Y = pos.Y - this.TrackOffsetY;
			_outline.PageNum = pos.Page;
		}
		else
		{
			if (null != this.InlinePos)
			{
				// inline move
				_table.Move(this.InlinePos.X, this.InlinePos.Y, this.InlinePos.Page, this.InlinePos);
			}
		}
	}

	this.checkMouseMove = function (X, Y, word_control)
	{
		if (null == this.TableOutline)
			return false;

		if (true === this.IsChangeSmall)
		{
			var _pos = word_control.m_oDrawingDocument.ConvertCoordsFromCursor2(X, Y);
			var _dist = 15 * g_dKoef_pix_to_mm * 100 / word_control.m_nZoomValue;
			if ((Math.abs(_pos.X - this.ChangeSmallPoint.X) < _dist) && (Math.abs(_pos.Y - this.ChangeSmallPoint.Y) < _dist) && (_pos.Page == this.ChangeSmallPoint.Page))
			{
				this.CurPos = {
					X: this.ChangeSmallPoint.X,
					Y: this.ChangeSmallPoint.Y,
					Page: this.ChangeSmallPoint.Page
				};

				switch (this.TrackTablePos)
				{
					case 1:
					{
						this.CurPos.X -= this.TableOutline.W;
						break;
					}
					case 2:
					{
						this.CurPos.X -= this.TableOutline.W;
						this.CurPos.Y -= this.TableOutline.H;
						break;
					}
					case 3:
					{
						this.CurPos.Y -= this.TableOutline.H;
						break;
					}
					case 0:
					default:
					{
						break;
					}
				}

				this.CurPos.X -= this.TrackOffsetX;
				this.CurPos.Y -= this.TrackOffsetY;
				return;
			}
			this.IsChangeSmall = false;

			this.TableOutline.Table.RemoveSelection();
			this.TableOutline.Table.MoveCursorToStartPos();
			editor.WordControl.m_oLogicDocument.Document_UpdateSelectionState();
		}

		var _d = 13 * g_dKoef_pix_to_mm * 100 / word_control.m_nZoomValue;
		switch (this.TrackTablePos)
		{
			case 1:
			{
				var _w_pix = this.TableOutline.W * g_dKoef_mm_to_pix * word_control.m_nZoomValue / 100;
				this.CurPos = word_control.m_oDrawingDocument.ConvertCoordsFromCursor2(X - _w_pix, Y);
				break;
			}
			case 2:
			{
				var _w_pix = this.TableOutline.W * g_dKoef_mm_to_pix * word_control.m_nZoomValue / 100;
				var _h_pix = this.TableOutline.H * g_dKoef_mm_to_pix * word_control.m_nZoomValue / 100;
				this.CurPos = word_control.m_oDrawingDocument.ConvertCoordsFromCursor2(X - _w_pix, Y - _h_pix);
				break;
			}
			case 3:
			{
				var _h_pix = this.TableOutline.H * g_dKoef_mm_to_pix * word_control.m_nZoomValue / 100;
				this.CurPos = word_control.m_oDrawingDocument.ConvertCoordsFromCursor2(X, Y - _h_pix);
				break;
			}
			case 0:
			default:
			{
				this.CurPos = word_control.m_oDrawingDocument.ConvertCoordsFromCursor2(X, Y);
				break;
			}
		}

		this.CurPos.X -= this.TrackOffsetX;
		this.CurPos.Y -= this.TrackOffsetY;
	}

	this.CheckStartTrack = function (word_control, transform)
	{
		this.TableMatrix = null;
		if (transform)
			this.TableMatrix = transform.CreateDublicate();

		if (!this.TableMatrix || global_MatrixTransformer.IsIdentity(this.TableMatrix))
		{
			var pos = word_control.m_oDrawingDocument.ConvertCoordsToCursor(this.TableOutline.X, this.TableOutline.Y, this.TableOutline.PageNum, true);

			var _x0 = word_control.m_oEditor.AbsolutePosition.L;
			var _y0 = word_control.m_oEditor.AbsolutePosition.T;

			if (pos.X < _x0 && pos.Y < _y0)
			{
				this.TrackTablePos = 2;
			}
			else if (pos.X < _x0)
			{
				this.TrackTablePos = 1;
			}
			else if (pos.Y < _y0)
			{
				this.TrackTablePos = 3;
			}
			else
			{
				this.TrackTablePos = 0;
			}
		}
		else
		{
			var _x = this.TableOutline.X;
			var _y = this.TableOutline.Y;
			var _r = _x + this.TableOutline.W;
			var _b = _y + this.TableOutline.H;

			var x0 = transform.TransformPointX(_x, _y);
			var y0 = transform.TransformPointY(_x, _y);

			var x1 = transform.TransformPointX(_r, _y);
			var y1 = transform.TransformPointY(_r, _y);

			var x2 = transform.TransformPointX(_r, _b);
			var y2 = transform.TransformPointY(_r, _b);

			var x3 = transform.TransformPointX(_x, _b);
			var y3 = transform.TransformPointY(_x, _b);

			var _x0 = word_control.m_oEditor.AbsolutePosition.L * g_dKoef_mm_to_pix;
			var _y0 = word_control.m_oEditor.AbsolutePosition.T * g_dKoef_mm_to_pix;
			var _x1 = word_control.m_oEditor.AbsolutePosition.R * g_dKoef_mm_to_pix;
			var _y1 = word_control.m_oEditor.AbsolutePosition.B * g_dKoef_mm_to_pix;

			var pos0 = word_control.m_oDrawingDocument.ConvertCoordsToCursor(x0, y0, this.TableOutline.PageNum, true);
			if (pos0.X > _x0 && pos0.X < _x1 && pos0.Y > _y0 && pos0.Y < _y1)
			{
				this.TrackTablePos = 0;
				return;
			}

			pos0 = word_control.m_oDrawingDocument.ConvertCoordsToCursor(x1, y1, this.TableOutline.PageNum, true);
			if (pos0.X > _x0 && pos0.X < _x1 && pos0.Y > _y0 && pos0.Y < _y1)
			{
				this.TrackTablePos = 1;
				return;
			}

			pos0 = word_control.m_oDrawingDocument.ConvertCoordsToCursor(x3, y3, this.TableOutline.PageNum, true);
			if (pos0.X > _x0 && pos0.X < _x1 && pos0.Y > _y0 && pos0.Y < _y1)
			{
				this.TrackTablePos = 3;
				return;
			}

			pos0 = word_control.m_oDrawingDocument.ConvertCoordsToCursor(x2, y2, this.TableOutline.PageNum, true);
			if (pos0.X > _x0 && pos0.X < _x1 && pos0.Y > _y0 && pos0.Y < _y1)
			{
				this.TrackTablePos = 2;
				return;
			}

			this.TrackTablePos = 0;
		}
	}
}

function CCacheImage()
{
	this.image = null;
	this.image_locked = 0;
	this.image_unusedCount = 0;
}

function CCacheManager()
{
	this.arrayImages = [];
	this.arrayCount = 0;
	this.countValidImage = 1;

	this.CheckImagesForNeed = function ()
	{
		for (var i = 0; i < this.arrayCount; ++i)
		{
			if ((this.arrayImages[i].image_locked == 0) && (this.arrayImages[i].image_unusedCount >= this.countValidImage))
			{
				delete this.arrayImages[i].image;
				this.arrayImages.splice(i, 1);
				--i;
				--this.arrayCount;
			}
		}
	}

	this.UnLock = function (_cache_image)
	{
		if (null == _cache_image)
			return;

		_cache_image.image_locked = 0;
		_cache_image.image_unusedCount = 0;
		// ����� ����� �������� ������ � ���� (_cache_image = null) <- ��� ����������� !!!!!!!
	}

	this.Lock = function (_w, _h)
	{
		for (var i = 0; i < this.arrayCount; ++i)
		{
			if (this.arrayImages[i].image_locked)
				continue;
			var _wI = this.arrayImages[i].image.width;
			var _hI = this.arrayImages[i].image.height;
			if ((_wI == _w) && (_hI == _h))
			{
				this.arrayImages[i].image_locked = 1;
				this.arrayImages[i].image_unusedCount = 0;

				this.arrayImages[i].image.ctx.globalAlpha = 1.0;
				this.arrayImages[i].image.ctx.setTransform(1, 0, 0, 1, 0, 0);
				this.arrayImages[i].image.ctx.fillStyle = "#ffffff";
				this.arrayImages[i].image.ctx.fillRect(0, 0, _w, _h);
				return this.arrayImages[i];
			}
			this.arrayImages[i].image_unusedCount++;
		}
		this.CheckImagesForNeed();
		var index = this.arrayCount;
		this.arrayCount++;

		this.arrayImages[index] = new CCacheImage();
		this.arrayImages[index].image = document.createElement('canvas');
		this.arrayImages[index].image.width = _w;
		this.arrayImages[index].image.height = _h;
		this.arrayImages[index].image.ctx = this.arrayImages[index].image.getContext('2d');
		this.arrayImages[index].image.ctx.globalAlpha = 1.0;
		this.arrayImages[index].image.ctx.setTransform(1, 0, 0, 1, 0, 0);
		this.arrayImages[index].image.ctx.fillStyle = "#ffffff";
		this.arrayImages[index].image.ctx.fillRect(0, 0, _w, _h);
		this.arrayImages[index].image_locked = 1;
		this.arrayImages[index].image_unusedCount = 0;
		return this.arrayImages[index];
	}
}

function CPolygonPoint(X, Y)
{
	this.X = X;
	this.Y = Y;
}
function CPolygonVectors()
{
	this.Page = -1;
	this.VX = [];
	this.VY = [];
}
function CPolygonPath(precision)
{
	this.Page = -1;
	this.Direction = 1;
	this.precision = precision;
	this.Points = [];
}
CPolygonPath.prototype.PushPoint = function (x, y)
{
	this.Points.push(new CPolygonPoint(x / this.precision, y / this.precision));
};
CPolygonPath.prototype.CorrectExtremePoints = function ()
{
	var Lng = this.Points.length;

	this.Points[0].X = this.Points[Lng - 1].X;
	this.Points[Lng - 1].Y = this.Points[0].Y;
};

function CPolygon()
{
	this.Vectors = [];
	this.precision = 1000;
}
CPolygon.prototype.fill = function (arrBounds)
{
	this.Vectors.length = 0;

	if (arrBounds.length <= 0)
		return;

	var nStartLineIndex = 0, nStartIndex = 0,
		CountLines = arrBounds.length,
		CountBounds;

	while (nStartLineIndex < arrBounds.length)
	{
		CountBounds = arrBounds[nStartLineIndex].length;

		while (nStartIndex < CountBounds)
		{
			if (arrBounds[nStartLineIndex][nStartIndex].W < 0.001)
				nStartIndex++;
			else
				break;
		}

		if (nStartIndex < CountBounds)
			break;

		nStartLineIndex++;
		nStartIndex = 0;
	}

	if (nStartLineIndex >= arrBounds.length)
		return;

	var CurrentPage = arrBounds[nStartLineIndex][nStartIndex].Page,
		CurrentVectors = new CPolygonVectors(),
		VectorsX = CurrentVectors.VX,
		VectorsY = CurrentVectors.VY;

	CurrentVectors.Page = CurrentPage;
	this.Vectors.push(CurrentVectors);

	for (var LineIndex = nStartLineIndex; LineIndex < CountLines; nStartIndex = 0, LineIndex++)
	{
		if (arrBounds[LineIndex][nStartIndex].Page !== CurrentPage)
		{
			CurrentPage = arrBounds[LineIndex][nStartIndex].Page;

			CurrentVectors = new CPolygonVectors();
			VectorsX = CurrentVectors.VX;
			VectorsY = CurrentVectors.VY;
			CurrentVectors.Page = CurrentPage;
			this.Vectors.push(CurrentVectors);

		}

		for (var Index = nStartIndex; Index < arrBounds[LineIndex].length; Index++)
		{
			var oBound = arrBounds[LineIndex][Index];

			if (oBound.W < 0.001)
				continue;

			var x1 = Math.round(oBound.X * this.precision), x2 = Math.round((oBound.X + oBound.W) * this.precision),
				y1 = Math.round(oBound.Y * this.precision), y2 = Math.round((oBound.Y + oBound.H) * this.precision);

			if (VectorsX[y1] == undefined)
			{
				VectorsX[y1] = {};
			}

			this.IntersectionX(VectorsX, x2, x1, y1);

			if (VectorsY[x1] == undefined)
			{
				VectorsY[x1] = {};
			}

			this.IntersectionY(VectorsY, y1, y2, x1);

			if (VectorsX[y2] == undefined)
			{
				VectorsX[y2] = {};
			}

			this.IntersectionX(VectorsX, x1, x2, y2);

			if (VectorsY[x2] == undefined)
			{
				VectorsY[x2] = {};
			}

			this.IntersectionY(VectorsY, y2, y1, x2);
		}
	}
};
CPolygon.prototype.IntersectionX = function (VectorsX, BeginX, EndX, Y)
{
	var CurrentVector = {};
	CurrentVector[BeginX] = EndX;
	var VX = VectorsX[Y];

	if (BeginX > EndX)
	{
		while (true == this.IntersectVectorX(CurrentVector, VX))
		{
		}
	}
	else
	{
		while (true == this.IntersectVectorX(VX, CurrentVector))
		{
		}
	}

	for (var X in CurrentVector)
	{
		var VBeginX = parseInt(X);
		var VEndX = CurrentVector[VBeginX];

		if (VBeginX !== VEndX || VX[VBeginX] === undefined) // добавляем точку, только если она не существует, а ненулевой вектор всегда
		{
			VX[VBeginX] = VEndX;
		}
	}
};
CPolygon.prototype.IntersectVectorX = function (VectorOpp, VectorClW) // vector opposite, vector clockwise
{
	for (var X in VectorOpp)
	{
		var VBeginX = parseInt(X);
		var VEndX = VectorOpp[VBeginX];

		if (VEndX == VBeginX)
			continue;

		for (var ClwX in VectorClW)
		{
			var ClwBeginX = parseInt(ClwX);
			var ClwEndX = VectorClW[ClwBeginX];
			var bIntersection = false;

			if (ClwBeginX == ClwEndX)
				continue;

			if (ClwBeginX <= VEndX && VBeginX <= ClwEndX) // inside vector ClW
			{
				VectorOpp[VBeginX] = VBeginX;

				VectorClW[ClwBeginX] = VEndX;
				VectorClW[VBeginX] = ClwEndX;

				bIntersection = true;
			}
			else if (VEndX <= ClwBeginX && ClwEndX <= VBeginX) // inside vector Opposite clockwise
			{
				VectorClW[ClwBeginX] = ClwBeginX;

				VectorOpp[VBeginX] = ClwEndX;
				VectorOpp[ClwBeginX] = VEndX;

				bIntersection = true;

			}
			else if (ClwBeginX < VEndX && VEndX < ClwEndX) // intersect vector ClW
			{
				VectorClW[ClwBeginX] = VEndX;
				VectorOpp[VBeginX] = ClwEndX;

				bIntersection = true;
			}
			else if (ClwBeginX < VBeginX && VBeginX < ClwEndX) // intersect vector ClW
			{
				VectorOpp[ClwBeginX] = VEndX;
				VectorClW[VBeginX] = ClwEndX;

				delete VectorOpp[VBeginX];
				delete VectorClW[ClwBeginX];

				bIntersection = true;
			}

			if (bIntersection == true)
				return true;
		}
	}

	return false;
};
CPolygon.prototype.IntersectionY = function (VectorsY, BeginY, EndY, X)
{
	var bIntersect = false;

	for (var y in VectorsY[X])
	{
		var CurBeginY = parseInt(y);
		var CurEndY = VectorsY[X][CurBeginY];

		var minY, maxY;

		if (CurBeginY < CurEndY)
		{
			minY = CurBeginY;
			maxY = CurEndY;
		}
		else
		{
			minY = CurEndY;
			maxY = CurBeginY;
		}

		var bInterSection = !((maxY <= BeginY && maxY <= EndY) || (minY >= BeginY && minY >= EndY )), // нач или конечная точка нах-ся внутри данного отрезка
			bDirection = (CurBeginY - CurEndY) * (BeginY - EndY) < 0; // векторы противоположно направленны

		if (bInterSection && bDirection) // если направления векторов совпало, значит один Bounds нах-ся в другом, ничего не делаем, такого быть не должно
		{

			VectorsY[X][CurBeginY] = EndY;
			VectorsY[X][BeginY] = CurEndY;
			bIntersect = true;
		}
	}

	if (bIntersect == false)
	{
		VectorsY[X][BeginY] = EndY;
	}
};
CPolygon.prototype.GetPaths = function (shift)
{
	var Paths = [];

	shift *= this.precision;

	for (var PageIndex = 0; PageIndex < this.Vectors.length; PageIndex++)
	{
		var y, x1, x2,
			x, y1, y2;

		var VectorsX = this.Vectors[PageIndex].VX,
			VectorsY = this.Vectors[PageIndex].VY,
			Page = this.Vectors[PageIndex].Page;


		for (var LineIndex in VectorsX)
		{
			for (var Index in VectorsX[LineIndex])
			{
				var Polygon = new CPolygonPath(this.precision);
				Polygon.Page = Page;

				y = parseInt(LineIndex);
				x1 = parseInt(Index);
				x2 = VectorsX[y][x1];

				VectorsX[y][x1] = -1;

				var Direction = x1 > x2 ? 1 : -1;
				var minY = y;
				var SignRightLeft, SignDownUp;
				var X, Y;

				if (x2 !== -1)
				{
					SignRightLeft = x1 > x2 ? 1 : -1;
					Y = y - SignRightLeft * shift;

					Polygon.PushPoint(x1, Y);

					while (true)
					{
						x = x2;
						y1 = y;
						y2 = VectorsY[x][y1];

						if (y2 == -1)
						{
							break;
						}
						else if (y2 == undefined) // такой ситуации не должно произойти, если произошла, значит есть ошибка в алгоритме => не отрисовываем путь
						{
							return [];
						}

						VectorsY[x][y1] = -1;  // выставляем -1 => чтобы не добавить повторно путь с данными точками + проверка на возвращение в стартовую точку

						SignDownUp = y1 > y2 ? 1 : -1;
						X = x + SignDownUp * shift;

						Polygon.PushPoint(X, Y);

						y = y2;
						x1 = x;
						x2 = VectorsX[y][x1];

						if (x2 == -1)
						{
							break;
						}
						else if (x2 == undefined) // такой ситуации не должно произойти, если произошла, значит есть ошибка в алгоритме => не отрисовываем путь
						{
							return [];
						}

						VectorsX[y][x1] = -1; // выставляем -1 => чтобы не добавить повторно путь с данными точками + проверка на возвращение в стартовую точку

						SignRightLeft = x1 > x2 ? 1 : -1;
						Y = y - SignRightLeft * shift;

						Polygon.PushPoint(X, Y);

						if (y < minY) // направление обхода
						{
							minY = y;
							Direction = x1 > x2 ? 1 : -1;
						}

					}
					Polygon.PushPoint(X, Y);
					Polygon.CorrectExtremePoints();


					Polygon.Direction = Direction;
					Paths.push(Polygon);

				}
			}
		}
	}

	return Paths;
};

function CDrawingPage()
{
	this.left = 0;
	this.top = 0;
	this.right = 0;
	this.bottom = 0;

	this.cachedImage = null;

	this.IsRecalculate = false;
	this.RecalculateTime = -1;
}
CDrawingPage.prototype =
{
	SetRepaint: function (cache_manager)
	{
		if (this.cachedImage != null && this.cachedImage.image != null)
		{
			this.IsRecalculate = true;
			if (-1 == this.RecalculateTime)
				this.RecalculateTime = new Date().getTime();
			return;
		}
		this.UnLock(cache_manager);
	},

	UnLock: function (cache_manager)
	{
		cache_manager.UnLock(this.cachedImage);
		this.cachedImage = null;
		this.IsRecalculate = false;
		this.RecalculateTime = -1;
	}
};

var g_page_outline_inner = false;//AscCommon.AscBrowser.isChrome;
function CPage()
{
	this.width_mm = 210;
	this.height_mm = 297;

	this.margin_left = 0;
	this.margin_top = 0;
	this.margin_right = 0;
	this.margin_bottom = 0;

	this.pageIndex = -1;

	this.searchingArray = [];
	this.selectionArray = [];
	this.drawingPage = new CDrawingPage();

	this.Draw = function (context, xDst, yDst, wDst, hDst, contextW, contextH)
	{
		if (null != this.drawingPage.cachedImage)
		{
			if (!g_page_outline_inner)
			{
				context.strokeStyle = GlobalSkin.PageOutline;
				context.lineWidth = 1;

				// ctx.strokeRect(x - 0.5, y - 0.5, w + 1, h + 1);
				context.beginPath();
				context.moveTo(xDst - 0.5, yDst - 0.5);
				context.lineTo(xDst + wDst + 0.5, yDst - 0.5);
				context.lineTo(xDst + wDst + 0.5, yDst + hDst + 0.5);
				context.lineTo(xDst - 0.5, yDst + hDst + 0.5);
				context.closePath();
				context.stroke();
				context.beginPath();
			}

			context.drawImage(this.drawingPage.cachedImage.image, xDst, yDst, wDst, hDst);
		}
		else
		{
			context.fillStyle = "#ffffff";

			if (!g_page_outline_inner)
			{
				context.strokeStyle = GlobalSkin.PageOutline;
				context.lineWidth = 1;

				// ctx.strokeRect(x - 0.5, y - 0.5, w + 1, h + 1);
				context.beginPath();
				context.moveTo(xDst - 0.5, yDst - 0.5);
				context.lineTo(xDst + wDst + 0.5, yDst - 0.5);
				context.lineTo(xDst + wDst + 0.5, yDst + hDst + 0.5);
				context.lineTo(xDst - 0.5, yDst + hDst + 0.5);
				context.closePath();
				context.stroke();
				context.beginPath();
			}

			context.fillRect(xDst, yDst, wDst, hDst);
		}
	};

	this.DrawSelection = function (overlay, xDst, yDst, wDst, hDst, TextMatrix)
	{
		var dKoefX = wDst / this.width_mm;
		var dKoefY = hDst / this.height_mm;

		var selectionArray = this.selectionArray;

		if (null == TextMatrix || global_MatrixTransformer.IsIdentity(TextMatrix))
		{
			for (var i = 0; i < selectionArray.length; i++)
			{
				var r = selectionArray[i];

				var _x = ((xDst + dKoefX * r.x) >> 0) - 0.5;
				var _y = ((yDst + dKoefY * r.y) >> 0) - 0.5;

				var _w = (dKoefX * r.w + 1) >> 0;
				var _h = (dKoefY * r.h + 1) >> 0;

				if (_x < overlay.min_x)
					overlay.min_x = _x;
				if ((_x + _w) > overlay.max_x)
					overlay.max_x = _x + _w;

				if (_y < overlay.min_y)
					overlay.min_y = _y;
				if ((_y + _h) > overlay.max_y)
					overlay.max_y = _y + _h;

				overlay.m_oContext.rect(_x, _y, _w, _h);
			}
		}
		else
		{
			for (var i = 0; i < selectionArray.length; i++)
			{
				var r = selectionArray[i];

				var _x1 = TextMatrix.TransformPointX(r.x, r.y);
				var _y1 = TextMatrix.TransformPointY(r.x, r.y);

				var _x2 = TextMatrix.TransformPointX(r.x + r.w, r.y);
				var _y2 = TextMatrix.TransformPointY(r.x + r.w, r.y);

				var _x3 = TextMatrix.TransformPointX(r.x + r.w, r.y + r.h);
				var _y3 = TextMatrix.TransformPointY(r.x + r.w, r.y + r.h);

				var _x4 = TextMatrix.TransformPointX(r.x, r.y + r.h);
				var _y4 = TextMatrix.TransformPointY(r.x, r.y + r.h);

				var x1 = xDst + dKoefX * _x1;
				var y1 = yDst + dKoefY * _y1;

				var x2 = xDst + dKoefX * _x2;
				var y2 = yDst + dKoefY * _y2;

				var x3 = xDst + dKoefX * _x3;
				var y3 = yDst + dKoefY * _y3;

				var x4 = xDst + dKoefX * _x4;
				var y4 = yDst + dKoefY * _y4;

				overlay.CheckPoint(x1, y1);
				overlay.CheckPoint(x2, y2);
				overlay.CheckPoint(x3, y3);
				overlay.CheckPoint(x4, y4);

				var ctx = overlay.m_oContext;
				ctx.moveTo(x1, y1);
				ctx.lineTo(x2, y2);
				ctx.lineTo(x3, y3);
				ctx.lineTo(x4, y4);
				ctx.closePath();
			}
		}
	}
	this.DrawSearch = function (overlay, xDst, yDst, wDst, hDst, drDoc)
	{
		var dKoefX = wDst / this.width_mm;
		var dKoefY = hDst / this.height_mm;

		// проверяем колонтитулы ------------
		var ret = this.drawInHdrFtr(overlay, xDst, yDst, wDst, hDst, dKoefX, dKoefY, drDoc._search_HdrFtr_All);
		if (!ret && this.pageIndex != 0)
			ret = this.drawInHdrFtr(overlay, xDst, yDst, wDst, hDst, dKoefX, dKoefY, drDoc._search_HdrFtr_All_no_First);
		if (!ret && this.pageIndex == 0)
			ret = this.drawInHdrFtr(overlay, xDst, yDst, wDst, hDst, dKoefX, dKoefY, drDoc._search_HdrFtr_First);
		if (!ret && (this.pageIndex & 1) == 1)
			ret = this.drawInHdrFtr(overlay, xDst, yDst, wDst, hDst, dKoefX, dKoefY, drDoc._search_HdrFtr_Even);
		if (!ret && (this.pageIndex & 1) == 0)
			ret = this.drawInHdrFtr(overlay, xDst, yDst, wDst, hDst, dKoefX, dKoefY, drDoc._search_HdrFtr_Odd);
		if (!ret && (this.pageIndex != 0))
			ret = this.drawInHdrFtr(overlay, xDst, yDst, wDst, hDst, dKoefX, dKoefY, drDoc._search_HdrFtr_Odd_no_First);
		// ----------------------------------

		var ctx = overlay.m_oContext;
		for (var i = 0; i < this.searchingArray.length; i++)
		{
			var place = this.searchingArray[i];

			if (!place.Transform)
			{
				if (undefined === place.Ex)
				{
					var _x = ((xDst + dKoefX * place.X) >> 0) - 0.5;
					var _y = ((yDst + dKoefY * place.Y) >> 0) - 0.5;

					var _w = ((dKoefX * place.W) >> 0) + 1;
					var _h = ((dKoefY * place.H) >> 0) + 1;

					if (_x < overlay.min_x)
						overlay.min_x = _x;
					if ((_x + _w) > overlay.max_x)
						overlay.max_x = _x + _w;

					if (_y < overlay.min_y)
						overlay.min_y = _y;
					if ((_y + _h) > overlay.max_y)
						overlay.max_y = _y + _h;

					ctx.rect(_x, _y, _w, _h);
				}
				else
				{
					var _x1 = (xDst + dKoefX * place.X) >> 0;
					var _y1 = (yDst + dKoefY * place.Y) >> 0;

					var x2 = place.X + place.W * place.Ex;
					var y2 = place.Y + place.W * place.Ey;
					var _x2 = (xDst + dKoefX * x2) >> 0;
					var _y2 = (yDst + dKoefY * y2) >> 0;

					var x3 = x2 - place.H * place.Ey;
					var y3 = y2 + place.H * place.Ex;
					var _x3 = (xDst + dKoefX * x3) >> 0;
					var _y3 = (yDst + dKoefY * y3) >> 0;

					var x4 = place.X - place.H * place.Ey;
					var y4 = place.Y + place.H * place.Ex;
					var _x4 = (xDst + dKoefX * x4) >> 0;
					var _y4 = (yDst + dKoefY * y4) >> 0;

					overlay.CheckPoint(_x1, _y1);
					overlay.CheckPoint(_x2, _y2);
					overlay.CheckPoint(_x3, _y3);
					overlay.CheckPoint(_x4, _y4);

					ctx.moveTo(_x1, _y1);
					ctx.lineTo(_x2, _y2);
					ctx.lineTo(_x3, _y3);
					ctx.lineTo(_x4, _y4);
					ctx.lineTo(_x1, _y1);
				}
			}
			else
			{
				var _tr = place.Transform;
				if (undefined === place.Ex)
				{
					var _x1 = xDst + dKoefX * _tr.TransformPointX(place.X, place.Y);
					var _y1 = yDst + dKoefY * _tr.TransformPointY(place.X, place.Y);

					var _x2 = xDst + dKoefX * _tr.TransformPointX(place.X + place.W, place.Y);
					var _y2 = yDst + dKoefY * _tr.TransformPointY(place.X + place.W, place.Y);

					var _x3 = xDst + dKoefX * _tr.TransformPointX(place.X + place.W, place.Y + place.H);
					var _y3 = yDst + dKoefY * _tr.TransformPointY(place.X + place.W, place.Y + place.H);

					var _x4 = xDst + dKoefX * _tr.TransformPointX(place.X, place.Y + place.H);
					var _y4 = yDst + dKoefY * _tr.TransformPointY(place.X, place.Y + place.H);

					overlay.CheckPoint(_x1, _y1);
					overlay.CheckPoint(_x2, _y2);
					overlay.CheckPoint(_x3, _y3);
					overlay.CheckPoint(_x4, _y4);

					ctx.moveTo(_x1, _y1);
					ctx.lineTo(_x2, _y2);
					ctx.lineTo(_x3, _y3);
					ctx.lineTo(_x4, _y4);
					ctx.lineTo(_x1, _y1);
				}
				else
				{
					var x2 = place.X + place.W * place.Ex;
					var y2 = place.Y + place.W * place.Ey;

					var x3 = x2 - place.H * place.Ey;
					var y3 = y2 + place.H * place.Ex;

					var x4 = place.X - place.H * place.Ey;
					var y4 = place.Y + place.H * place.Ex;

					var _x1 = xDst + dKoefX * _tr.TransformPointX(place.X, place.Y);
					var _y1 = yDst + dKoefY * _tr.TransformPointY(place.X, place.Y);

					var _x2 = xDst + dKoefX * _tr.TransformPointX(x2, y2);
					var _y2 = yDst + dKoefY * _tr.TransformPointY(x2, y2);

					var _x3 = xDst + dKoefX * _tr.TransformPointX(x3, y3);
					var _y3 = yDst + dKoefY * _tr.TransformPointY(x3, y3);

					var _x4 = xDst + dKoefX * _tr.TransformPointX(x4, y4);
					var _y4 = yDst + dKoefY * _tr.TransformPointY(x4, y4);

					overlay.CheckPoint(_x1, _y1);
					overlay.CheckPoint(_x2, _y2);
					overlay.CheckPoint(_x3, _y3);
					overlay.CheckPoint(_x4, _y4);

					ctx.moveTo(_x1, _y1);
					ctx.lineTo(_x2, _y2);
					ctx.lineTo(_x3, _y3);
					ctx.lineTo(_x4, _y4);
					ctx.lineTo(_x1, _y1);
				}
			}
		}
	}

	this.DrawSearch2 = function (overlay, xDst, yDst, wDst, hDst, _searching)
	{
		var dKoefX = wDst / this.width_mm;
		var dKoefY = hDst / this.height_mm;

		var ctx = overlay.m_oContext;
		for (var i = 0; i < _searching.length; i++)
		{
			var _find_count = _searching[i].length;

			for (var j = 0; j < _find_count; j++)
			{
				var place = _searching[i][j];

				if (!place.Transform)
				{
					if (undefined === place.Ex)
					{
						var _x = ((xDst + dKoefX * place.X) >> 0) - 0.5;
						var _y = ((yDst + dKoefY * place.Y) >> 0) - 0.5;

						var _w = ((dKoefX * place.W) >> 0) + 1;
						var _h = ((dKoefY * place.H) >> 0) + 1;

						if (_x < overlay.min_x)
							overlay.min_x = _x;
						if ((_x + _w) > overlay.max_x)
							overlay.max_x = _x + _w;

						if (_y < overlay.min_y)
							overlay.min_y = _y;
						if ((_y + _h) > overlay.max_y)
							overlay.max_y = _y + _h;

						ctx.rect(_x, _y, _w, _h);
					}
					else
					{
						var _x1 = (xDst + dKoefX * place.X) >> 0;
						var _y1 = (yDst + dKoefY * place.Y) >> 0;

						var x2 = place.X + place.W * place.Ex;
						var y2 = place.Y + place.W * place.Ey;
						var _x2 = (xDst + dKoefX * x2) >> 0;
						var _y2 = (yDst + dKoefY * y2) >> 0;

						var x3 = x2 - place.H * place.Ey;
						var y3 = y2 + place.H * place.Ex;
						var _x3 = (xDst + dKoefX * x3) >> 0;
						var _y3 = (yDst + dKoefY * y3) >> 0;

						var x4 = place.X - place.H * place.Ey;
						var y4 = place.Y + place.H * place.Ex;
						var _x4 = (xDst + dKoefX * x4) >> 0;
						var _y4 = (yDst + dKoefY * y4) >> 0;

						overlay.CheckPoint(_x1, _y1);
						overlay.CheckPoint(_x2, _y2);
						overlay.CheckPoint(_x3, _y3);
						overlay.CheckPoint(_x4, _y4);

						ctx.moveTo(_x1, _y1);
						ctx.lineTo(_x2, _y2);
						ctx.lineTo(_x3, _y3);
						ctx.lineTo(_x4, _y4);
						ctx.lineTo(_x1, _y1);
					}
				}
			}
		}
	}

	this.drawInHdrFtr = function (overlay, xDst, yDst, wDst, hDst, dKoefX, dKoefY, arr)
	{
		var _c = arr.length;
		if (0 == _c)
			return false;

		var ctx = overlay.m_oContext;
		for (var i = 0; i < _c; i++)
		{
			var place = arr[i];

			if (!place.Transform)
			{
				if (undefined === place.Ex)
				{
					var _x = ((xDst + dKoefX * place.X) >> 0) - 0.5;
					var _y = ((yDst + dKoefY * place.Y) >> 0) - 0.5;

					var _w = ((dKoefX * place.W) >> 0) + 1;
					var _h = ((dKoefY * place.H) >> 0) + 1;

					if (_x < overlay.min_x)
						overlay.min_x = _x;
					if ((_x + _w) > overlay.max_x)
						overlay.max_x = _x + _w;

					if (_y < overlay.min_y)
						overlay.min_y = _y;
					if ((_y + _h) > overlay.max_y)
						overlay.max_y = _y + _h;

					ctx.rect(_x, _y, _w, _h);
				}
				else
				{
					var _x1 = (xDst + dKoefX * place.X) >> 0;
					var _y1 = (yDst + dKoefY * place.Y) >> 0;

					var x2 = place.X + place.W * place.Ex;
					var y2 = place.Y + place.W * place.Ey;
					var _x2 = (xDst + dKoefX * x2) >> 0;
					var _y2 = (yDst + dKoefY * y2) >> 0;

					var x3 = x2 - place.H * place.Ey;
					var y3 = y2 + place.H * place.Ex;
					var _x3 = (xDst + dKoefX * x3) >> 0;
					var _y3 = (yDst + dKoefY * y3) >> 0;

					var x4 = place.X - place.H * place.Ey;
					var y4 = place.Y + place.H * place.Ex;
					var _x4 = (xDst + dKoefX * x4) >> 0;
					var _y4 = (yDst + dKoefY * y4) >> 0;

					overlay.CheckPoint(_x1, _y1);
					overlay.CheckPoint(_x2, _y2);
					overlay.CheckPoint(_x3, _y3);
					overlay.CheckPoint(_x4, _y4);

					ctx.moveTo(_x1, _y1);
					ctx.lineTo(_x2, _y2);
					ctx.lineTo(_x3, _y3);
					ctx.lineTo(_x4, _y4);
					ctx.lineTo(_x1, _y1);
				}
			}
			else
			{
				var _tr = place.Transform;
				if (undefined === place.Ex)
				{
					var _x1 = xDst + dKoefX * _tr.TransformPointX(place.X, place.Y);
					var _y1 = yDst + dKoefY * _tr.TransformPointY(place.X, place.Y);

					var _x2 = xDst + dKoefX * _tr.TransformPointX(place.X + place.W, place.Y);
					var _y2 = yDst + dKoefY * _tr.TransformPointY(place.X + place.W, place.Y);

					var _x3 = xDst + dKoefX * _tr.TransformPointX(place.X + place.W, place.Y + place.H);
					var _y3 = yDst + dKoefY * _tr.TransformPointY(place.X + place.W, place.Y + place.H);

					var _x4 = xDst + dKoefX * _tr.TransformPointX(place.X, place.Y + place.H);
					var _y4 = yDst + dKoefY * _tr.TransformPointY(place.X, place.Y + place.H);

					overlay.CheckPoint(_x1, _y1);
					overlay.CheckPoint(_x2, _y2);
					overlay.CheckPoint(_x3, _y3);
					overlay.CheckPoint(_x4, _y4);

					ctx.moveTo(_x1, _y1);
					ctx.lineTo(_x2, _y2);
					ctx.lineTo(_x3, _y3);
					ctx.lineTo(_x4, _y4);
					ctx.lineTo(_x1, _y1);
				}
				else
				{
					var x2 = place.X + place.W * place.Ex;
					var y2 = place.Y + place.W * place.Ey;

					var x3 = x2 - place.H * place.Ey;
					var y3 = y2 + place.H * place.Ex;

					var x4 = place.X - place.H * place.Ey;
					var y4 = place.Y + place.H * place.Ex;

					var _x1 = xDst + dKoefX * _tr.TransformPointX(place.X, place.Y);
					var _y1 = yDst + dKoefY * _tr.TransformPointY(place.X, place.Y);

					var _x2 = xDst + dKoefX * _tr.TransformPointX(x2, y2);
					var _y2 = yDst + dKoefY * _tr.TransformPointY(x2, y2);

					var _x3 = xDst + dKoefX * _tr.TransformPointX(x3, y3);
					var _y3 = yDst + dKoefY * _tr.TransformPointY(x3, y3);

					var _x4 = xDst + dKoefX * _tr.TransformPointX(x4, y4);
					var _y4 = yDst + dKoefY * _tr.TransformPointY(x4, y4);

					overlay.CheckPoint(_x1, _y1);
					overlay.CheckPoint(_x2, _y2);
					overlay.CheckPoint(_x3, _y3);
					overlay.CheckPoint(_x4, _y4);

					ctx.moveTo(_x1, _y1);
					ctx.lineTo(_x2, _y2);
					ctx.lineTo(_x3, _y3);
					ctx.lineTo(_x4, _y4);
					ctx.lineTo(_x1, _y1);
				}
			}
		}
		return true;
	}

	this.DrawSearchCur = function (overlay, xDst, yDst, wDst, hDst, places)
	{
		var dKoefX = wDst / this.width_mm;
		var dKoefY = hDst / this.height_mm;

		var len = places.length;

		var ctx = overlay.m_oContext;

		ctx.fillStyle = "rgba(51,102,204,255)";

		for (var i = 0; i < len; i++)
		{
			var place = places[i];
			if (undefined === place.Ex)
			{
				var _x = ((xDst + dKoefX * place.X) >> 0) - 0.5;
				var _y = ((yDst + dKoefY * place.Y) >> 0) - 0.5;

				var _w = ((dKoefX * place.W) >> 0) + 1;
				var _h = ((dKoefY * place.H) >> 0) + 1;

				if (_x < overlay.min_x)
					overlay.min_x = _x;
				if ((_x + _w) > overlay.max_x)
					overlay.max_x = _x + _w;

				if (_y < overlay.min_y)
					overlay.min_y = _y;
				if ((_y + _h) > overlay.max_y)
					overlay.max_y = _y + _h;

				ctx.rect(_x, _y, _w, _h);
			}
			else
			{
				var _x1 = (xDst + dKoefX * place.X) >> 0;
				var _y1 = (yDst + dKoefY * place.Y) >> 0;

				var x2 = place.X + place.W * place.Ex;
				var y2 = place.Y + place.W * place.Ey;
				var _x2 = (xDst + dKoefX * x2) >> 0;
				var _y2 = (yDst + dKoefY * y2) >> 0;

				var x3 = x2 - place.H * place.Ey;
				var y3 = y2 + place.H * place.Ex;
				var _x3 = (xDst + dKoefX * x3) >> 0;
				var _y3 = (yDst + dKoefY * y3) >> 0;

				var x4 = place.X - place.H * place.Ey;
				var y4 = place.Y + place.H * place.Ex;
				var _x4 = (xDst + dKoefX * x4) >> 0;
				var _y4 = (yDst + dKoefY * y4) >> 0;

				overlay.CheckPoint(_x1, _y1);
				overlay.CheckPoint(_x2, _y2);
				overlay.CheckPoint(_x3, _y3);
				overlay.CheckPoint(_x4, _y4);

				ctx.moveTo(_x1, _y1);
				ctx.lineTo(_x2, _y2);
				ctx.lineTo(_x3, _y3);
				ctx.lineTo(_x4, _y4);
				ctx.lineTo(_x1, _y1);
			}
		}

		ctx.fill();
		ctx.beginPath();
	}

	this.DrawTableOutline = function (overlay, xDst, yDst, wDst, hDst, table_outline_dr)
	{
		var transform = table_outline_dr.TableMatrix;
		if (null == transform || transform.IsIdentity2())
		{
			var dKoefX = wDst / this.width_mm;
			var dKoefY = hDst / this.height_mm;

			var _offX = (null == transform) ? 0 : transform.tx;
			var _offY = (null == transform) ? 0 : transform.ty;

			var _x = 0;
			var _y = 0;
			switch (table_outline_dr.TrackTablePos)
			{
				case 1:
				{
					_x = (xDst + dKoefX * (table_outline_dr.TableOutline.X + table_outline_dr.TableOutline.W + _offX)) >> 0;
					_y = ((yDst + dKoefY * (table_outline_dr.TableOutline.Y + _offY)) >> 0) - 13;
					break;
				}
				case 2:
				{
					_x = (xDst + dKoefX * (table_outline_dr.TableOutline.X + table_outline_dr.TableOutline.W + _offX)) >> 0;
					_y = (yDst + dKoefY * (table_outline_dr.TableOutline.Y + table_outline_dr.TableOutline.H + _offY)) >> 0;
					break;
				}
				case 3:
				{
					_x = ((xDst + dKoefX * (table_outline_dr.TableOutline.X + _offX)) >> 0) - 13;
					_y = (yDst + dKoefY * (table_outline_dr.TableOutline.Y + table_outline_dr.TableOutline.H + _offY)) >> 0;
					break;
				}
				case 0:
				default:
				{
					_x = ((xDst + dKoefX * (table_outline_dr.TableOutline.X + _offX)) >> 0) - 13;
					_y = ((yDst + dKoefY * (table_outline_dr.TableOutline.Y + _offY)) >> 0) - 13;
					break;
				}
			}

			var _w = 13;
			var _h = 13;

			if (_x < overlay.min_x)
				overlay.min_x = _x;
			if ((_x + _w) > overlay.max_x)
				overlay.max_x = _x + _w;

			if (_y < overlay.min_y)
				overlay.min_y = _y;
			if ((_y + _h) > overlay.max_y)
				overlay.max_y = _y + _h;

			overlay.m_oContext.drawImage(table_outline_dr.image, _x, _y);
		}
		else
		{
			var ctx = overlay.m_oContext;


			var _ft = new AscCommon.CMatrix();
			_ft.sx = transform.sx;
			_ft.shx = transform.shx;
			_ft.shy = transform.shy;
			_ft.sy = transform.sy;
			_ft.tx = transform.tx;
			_ft.ty = transform.ty;

			var coords = new AscCommon.CMatrix();
			coords.sx = wDst / this.width_mm;
			coords.sy = hDst / this.height_mm;
			coords.tx = xDst;
			coords.ty = yDst;

			global_MatrixTransformer.MultiplyAppend(_ft, coords);

			ctx.transform(_ft.sx, _ft.shy, _ft.shx, _ft.sy, _ft.tx, _ft.ty);

			var _x = 0;
			var _y = 0;
			var _w = 13 / coords.sx;
			var _h = 13 / coords.sy;
			switch (table_outline_dr.TrackTablePos)
			{
				case 1:
				{
					_x = (table_outline_dr.TableOutline.X + table_outline_dr.TableOutline.W);
					_y = (table_outline_dr.TableOutline.Y - _h);
					break;
				}
				case 2:
				{
					_x = (table_outline_dr.TableOutline.X + table_outline_dr.TableOutline.W);
					_y = (table_outline_dr.TableOutline.Y + table_outline_dr.TableOutline.H);
					break;
				}
				case 3:
				{
					_x = (table_outline_dr.TableOutline.X - _w);
					_y = (table_outline_dr.TableOutline.Y + table_outline_dr.TableOutline.H);
					break;
				}
				case 0:
				default:
				{
					_x = (table_outline_dr.TableOutline.X - _w);
					_y = (table_outline_dr.TableOutline.Y - _h);
					break;
				}
			}

			overlay.CheckPoint(_ft.TransformPointX(_x, _y), _ft.TransformPointY(_x, _y));
			overlay.CheckPoint(_ft.TransformPointX(_x + _w, _y), _ft.TransformPointY(_x + _w, _y));
			overlay.CheckPoint(_ft.TransformPointX(_x + _w, _y + _h), _ft.TransformPointY(_x + _w, _y + _h));
			overlay.CheckPoint(_ft.TransformPointX(_x, _y + _h), _ft.TransformPointY(_x, _y + _h));

			overlay.m_oContext.drawImage(table_outline_dr.image, _x, _y, _w, _h);
			ctx.setTransform(1, 0, 0, 1, 0, 0);
		}
	}
}

function CDrawingCollaborativeTarget()
{
	this.Id = "";
	this.ShortId = "";

	this.X = 0;
	this.Y = 0;
	this.Size = 0;
	this.Page = -1;

	this.Color = null;
	this.Transform = null;

	this.HtmlElement = null;
	this.HtmlElementX = 0;
	this.HtmlElementY = 0;

	this.Color = null;

	this.Style = "";
}
CDrawingCollaborativeTarget.prototype =
{
	CheckPosition: function (_drawing_doc, _x, _y, _size, _page, _transform)
	{
		// 1) создаем новый элемент, если еще его не было
		var bIsHtmlElementCreate = false;
		if (this.HtmlElement == null)
		{
			bIsHtmlElementCreate = true;
			this.HtmlElement = document.createElement('canvas');
			this.HtmlElement.style.cssText = "pointer-events: none;position:absolute;padding:0;margin:0;-webkit-user-select:none;width:1px;height:1px;display:block;z-index:3;";
			this.HtmlElement.width = 1;
			this.HtmlElement.height = 1;

			this.Color = AscCommon.getUserColorById(this.ShortId, null, true);
			this.Style = "rgb(" + this.Color.r + "," + this.Color.g + "," + this.Color.b + ")";
		}

		// 2) определяем размер
		this.Transform = _transform;
		this.Size = _size;

		var _old_x = this.X;
		var _old_y = this.Y;
		var _old_page = this.Page;

		this.X = _x;
		this.Y = _y;
		this.Page = _page;

		var _oldW = this.HtmlElement.width;
		var _oldH = this.HtmlElement.height;

		var _newW = 2;
		var _newH = (this.Size * _drawing_doc.m_oWordControl.m_nZoomValue * g_dKoef_mm_to_pix / 100) >> 0;

		if (null != this.Transform && !global_MatrixTransformer.IsIdentity2(this.Transform))
		{
			var _x1 = this.Transform.TransformPointX(_x, _y);
			var _y1 = this.Transform.TransformPointY(_x, _y);

			var _x2 = this.Transform.TransformPointX(_x, _y + this.Size);
			var _y2 = this.Transform.TransformPointY(_x, _y + this.Size);

			var pos1 = _drawing_doc.ConvertCoordsToCursor2(_x1, _y1, this.Page);
			var pos2 = _drawing_doc.ConvertCoordsToCursor2(_x2, _y2, this.Page);

			_newW = (Math.abs(pos1.X - pos2.X) >> 0) + 1;
			_newH = (Math.abs(pos1.Y - pos2.Y) >> 0) + 1;

			if (2 > _newW)
				_newW = 2;
			if (2 > _newH)
				_newH = 2;

			if (_oldW == _newW && _oldH == _newH)
			{
				if (_newW != 2 && _newH != 2)
				{
					// просто очищаем
					this.HtmlElement.width = _newW;
				}
			}
			else
			{
				this.HtmlElement.style.width = _newW + "px";
				this.HtmlElement.style.height = _newH + "px";

				this.HtmlElement.width = _newW;
				this.HtmlElement.height = _newH;
			}
			var ctx = this.HtmlElement.getContext('2d');

			if (_newW == 2 || _newH == 2)
			{
				ctx.fillStyle = this.Style;
				ctx.fillRect(0, 0, _newW, _newH);
			}
			else
			{
				ctx.beginPath();
				ctx.strokeStyle = this.Style;
				ctx.lineWidth = 2;

				if (((pos1.X - pos2.X) * (pos1.Y - pos2.Y)) >= 0)
				{
					ctx.moveTo(0, 0);
					ctx.lineTo(_newW, _newH);
				}
				else
				{
					ctx.moveTo(0, _newH);
					ctx.lineTo(_newW, 0);
				}

				ctx.stroke();
			}

			this.HtmlElementX = Math.min(pos1.X, pos2.X) >> 0;
			this.HtmlElementY = Math.min(pos1.Y, pos2.Y) >> 0;
			if ((!_drawing_doc.m_oWordControl.MobileTouchManager && !AscCommon.AscBrowser.isSafariMacOs) || !AscCommon.AscBrowser.isWebkit)
			{
				this.HtmlElement.style.left = this.HtmlElementX + "px";
				this.HtmlElement.style.top = this.HtmlElementY + "px";
			}
			else
			{
				this.HtmlElement.style.left = "0px";
				this.HtmlElement.style.top = "0px";
				this.HtmlElement.style["webkitTransform"] = "matrix(1, 0, 0, 1, " + this.HtmlElementX + "," + this.HtmlElementY + ")";
			}
		}
		else
		{
			if (_oldW == _newW && _oldH == _newH)
			{
				// просто очищаем
				this.HtmlElement.width = _newW;
			}
			else
			{
				this.HtmlElement.style.width = _newW + "px";
				this.HtmlElement.style.height = _newH + "px";

				this.HtmlElement.width = _newW;
				this.HtmlElement.height = _newH;
			}

			var ctx = this.HtmlElement.getContext('2d');

			ctx.fillStyle = this.Style;
			ctx.fillRect(0, 0, _newW, _newH);

			if (null != this.Transform)
			{
				_x += this.Transform.tx;
				_y += this.Transform.ty;
			}

			var pos = _drawing_doc.ConvertCoordsToCursor2(_x, _y, this.Page);

			this.HtmlElementX = pos.X >> 0;
			this.HtmlElementY = pos.Y >> 0;

			if ((!_drawing_doc.m_oWordControl.MobileTouchManager && !AscCommon.AscBrowser.isSafariMacOs) || !AscCommon.AscBrowser.isWebkit)
			{
				this.HtmlElement.style.left = this.HtmlElementX + "px";
				this.HtmlElement.style.top = this.HtmlElementY + "px";
			}
			else
			{
				this.HtmlElement.style.left = "0px";
				this.HtmlElement.style.top = "0px";
				this.HtmlElement.style["webkitTransform"] = "matrix(1, 0, 0, 1, " + this.HtmlElementX + "," + this.HtmlElementY + ")";
			}
		}

		if (AscCommon.CollaborativeEditing)
			AscCommon.CollaborativeEditing.Update_ForeignCursorLabelPosition(this.Id, this.HtmlElementX, this.HtmlElementY, this.Color);

		// 3) добавить, если нужно
		if (bIsHtmlElementCreate)
		{
			_drawing_doc.m_oWordControl.m_oMainView.HtmlElement.appendChild(this.HtmlElement);
		}
	},

	Remove: function (_drawing_doc)
	{
		_drawing_doc.m_oWordControl.m_oMainView.HtmlElement.removeChild(this.HtmlElement);
	},

	Update: function (_drawing_doc)
	{
		this.CheckPosition(_drawing_doc, this.X, this.Y, this.Size, this.Page, this.Transform);
	}
};

function CDrawingDocument()
{
	this.IsLockObjectsEnable = false;

	this.cursorMarkerFormat = "";
	if (AscCommon.AscBrowser.isIE)
	{
		// Пути указаны относительно html в меню, не надо их исправлять
		// и коммитить на пути относительно тестового меню
		this.cursorMarkerFormat = "url(../../../../sdkjs/common/Images/marker_format.cur), pointer";
	}
	else if (window.opera)
	{
		this.cursorMarkerFormat = "pointer";
	}
	else
	{
		this.cursorMarkerFormat = "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAQCAYAAAAbBi9cAAAACXBIWXMAAAsTAAALEwEAmpwYAAAKT2lDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjanVNnVFPpFj333vRCS4iAlEtvUhUIIFJCi4AUkSYqIQkQSoghodkVUcERRUUEG8igiAOOjoCMFVEsDIoK2AfkIaKOg6OIisr74Xuja9a89+bN/rXXPues852zzwfACAyWSDNRNYAMqUIeEeCDx8TG4eQuQIEKJHAAEAizZCFz/SMBAPh+PDwrIsAHvgABeNMLCADATZvAMByH/w/qQplcAYCEAcB0kThLCIAUAEB6jkKmAEBGAYCdmCZTAKAEAGDLY2LjAFAtAGAnf+bTAICd+Jl7AQBblCEVAaCRACATZYhEAGg7AKzPVopFAFgwABRmS8Q5ANgtADBJV2ZIALC3AMDOEAuyAAgMADBRiIUpAAR7AGDIIyN4AISZABRG8lc88SuuEOcqAAB4mbI8uSQ5RYFbCC1xB1dXLh4ozkkXKxQ2YQJhmkAuwnmZGTKBNA/g88wAAKCRFRHgg/P9eM4Ors7ONo62Dl8t6r8G/yJiYuP+5c+rcEAAAOF0ftH+LC+zGoA7BoBt/qIl7gRoXgugdfeLZrIPQLUAoOnaV/Nw+H48PEWhkLnZ2eXk5NhKxEJbYcpXff5nwl/AV/1s+X48/Pf14L7iJIEyXYFHBPjgwsz0TKUcz5IJhGLc5o9H/LcL//wd0yLESWK5WCoU41EScY5EmozzMqUiiUKSKcUl0v9k4t8s+wM+3zUAsGo+AXuRLahdYwP2SycQWHTA4vcAAPK7b8HUKAgDgGiD4c93/+8//UegJQCAZkmScQAAXkQkLlTKsz/HCAAARKCBKrBBG/TBGCzABhzBBdzBC/xgNoRCJMTCQhBCCmSAHHJgKayCQiiGzbAdKmAv1EAdNMBRaIaTcA4uwlW4Dj1wD/phCJ7BKLyBCQRByAgTYSHaiAFiilgjjggXmYX4IcFIBBKLJCDJiBRRIkuRNUgxUopUIFVIHfI9cgI5h1xGupE7yAAygvyGvEcxlIGyUT3UDLVDuag3GoRGogvQZHQxmo8WoJvQcrQaPYw2oefQq2gP2o8+Q8cwwOgYBzPEbDAuxsNCsTgsCZNjy7EirAyrxhqwVqwDu4n1Y8+xdwQSgUXACTYEd0IgYR5BSFhMWE7YSKggHCQ0EdoJNwkDhFHCJyKTqEu0JroR+cQYYjIxh1hILCPWEo8TLxB7iEPENyQSiUMyJ7mQAkmxpFTSEtJG0m5SI+ksqZs0SBojk8naZGuyBzmULCAryIXkneTD5DPkG+Qh8lsKnWJAcaT4U+IoUspqShnlEOU05QZlmDJBVaOaUt2ooVQRNY9aQq2htlKvUYeoEzR1mjnNgxZJS6WtopXTGmgXaPdpr+h0uhHdlR5Ol9BX0svpR+iX6AP0dwwNhhWDx4hnKBmbGAcYZxl3GK+YTKYZ04sZx1QwNzHrmOeZD5lvVVgqtip8FZHKCpVKlSaVGyovVKmqpqreqgtV81XLVI+pXlN9rkZVM1PjqQnUlqtVqp1Q61MbU2epO6iHqmeob1Q/pH5Z/YkGWcNMw09DpFGgsV/jvMYgC2MZs3gsIWsNq4Z1gTXEJrHN2Xx2KruY/R27iz2qqaE5QzNKM1ezUvOUZj8H45hx+Jx0TgnnKKeX836K3hTvKeIpG6Y0TLkxZVxrqpaXllirSKtRq0frvTau7aedpr1Fu1n7gQ5Bx0onXCdHZ4/OBZ3nU9lT3acKpxZNPTr1ri6qa6UbobtEd79up+6Ynr5egJ5Mb6feeb3n+hx9L/1U/W36p/VHDFgGswwkBtsMzhg8xTVxbzwdL8fb8VFDXcNAQ6VhlWGX4YSRudE8o9VGjUYPjGnGXOMk423GbcajJgYmISZLTepN7ppSTbmmKaY7TDtMx83MzaLN1pk1mz0x1zLnm+eb15vft2BaeFostqi2uGVJsuRaplnutrxuhVo5WaVYVVpds0atna0l1rutu6cRp7lOk06rntZnw7Dxtsm2qbcZsOXYBtuutm22fWFnYhdnt8Wuw+6TvZN9un2N/T0HDYfZDqsdWh1+c7RyFDpWOt6azpzuP33F9JbpL2dYzxDP2DPjthPLKcRpnVOb00dnF2e5c4PziIuJS4LLLpc+Lpsbxt3IveRKdPVxXeF60vWdm7Obwu2o26/uNu5p7ofcn8w0nymeWTNz0MPIQ+BR5dE/C5+VMGvfrH5PQ0+BZ7XnIy9jL5FXrdewt6V3qvdh7xc+9j5yn+M+4zw33jLeWV/MN8C3yLfLT8Nvnl+F30N/I/9k/3r/0QCngCUBZwOJgUGBWwL7+Hp8Ib+OPzrbZfay2e1BjKC5QRVBj4KtguXBrSFoyOyQrSH355jOkc5pDoVQfujW0Adh5mGLw34MJ4WHhVeGP45wiFga0TGXNXfR3ENz30T6RJZE3ptnMU85ry1KNSo+qi5qPNo3ujS6P8YuZlnM1VidWElsSxw5LiquNm5svt/87fOH4p3iC+N7F5gvyF1weaHOwvSFpxapLhIsOpZATIhOOJTwQRAqqBaMJfITdyWOCnnCHcJnIi/RNtGI2ENcKh5O8kgqTXqS7JG8NXkkxTOlLOW5hCepkLxMDUzdmzqeFpp2IG0yPTq9MYOSkZBxQqohTZO2Z+pn5mZ2y6xlhbL+xW6Lty8elQfJa7OQrAVZLQq2QqboVFoo1yoHsmdlV2a/zYnKOZarnivN7cyzytuQN5zvn//tEsIS4ZK2pYZLVy0dWOa9rGo5sjxxedsK4xUFK4ZWBqw8uIq2Km3VT6vtV5eufr0mek1rgV7ByoLBtQFr6wtVCuWFfevc1+1dT1gvWd+1YfqGnRs+FYmKrhTbF5cVf9go3HjlG4dvyr+Z3JS0qavEuWTPZtJm6ebeLZ5bDpaql+aXDm4N2dq0Dd9WtO319kXbL5fNKNu7g7ZDuaO/PLi8ZafJzs07P1SkVPRU+lQ27tLdtWHX+G7R7ht7vPY07NXbW7z3/T7JvttVAVVN1WbVZftJ+7P3P66Jqun4lvttXa1ObXHtxwPSA/0HIw6217nU1R3SPVRSj9Yr60cOxx++/p3vdy0NNg1VjZzG4iNwRHnk6fcJ3/ceDTradox7rOEH0x92HWcdL2pCmvKaRptTmvtbYlu6T8w+0dbq3nr8R9sfD5w0PFl5SvNUyWna6YLTk2fyz4ydlZ19fi753GDborZ752PO32oPb++6EHTh0kX/i+c7vDvOXPK4dPKy2+UTV7hXmq86X23qdOo8/pPTT8e7nLuarrlca7nuer21e2b36RueN87d9L158Rb/1tWeOT3dvfN6b/fF9/XfFt1+cif9zsu72Xcn7q28T7xf9EDtQdlD3YfVP1v+3Njv3H9qwHeg89HcR/cGhYPP/pH1jw9DBY+Zj8uGDYbrnjg+OTniP3L96fynQ89kzyaeF/6i/suuFxYvfvjV69fO0ZjRoZfyl5O/bXyl/erA6xmv28bCxh6+yXgzMV70VvvtwXfcdx3vo98PT+R8IH8o/2j5sfVT0Kf7kxmTk/8EA5jz/GMzLdsAAAAgY0hSTQAAeiUAAICDAAD5/wAAgOkAAHUwAADqYAAAOpgAABdvkl/FRgAAANNJREFUeNq8VEsKhTAMnL5UDyMUPIsbF+4ET+VCXLjobQSh18nbPEs/saKL11VmEoZJSKqYGcnLCABKyKkQa0mkaRpPOOdOXoU55xwHMVTiiI0xmZ3jODIHxpiTFx2BiLDvu8dt24otElHEfVIhrXVUEOCrOtwJoSRUVVVZKC1I8f+F6rou4iu+5IifONJSQdd1j1sThay1Hvd9/07IWothGCL8Zth+Cbdty5bzNzdO9osBsLhtRIRxHLGua5abpgkAsCyLj+d5zo5W+kbURS464u8AmWhBvQBxpekAAAAASUVORK5CYII=') 14 8, pointer";
	}

	this.m_oWordControl = null;
	this.m_oLogicDocument = null;
	this.m_oDocumentRenderer = null;

	this.m_arrPages = [];
	this.m_lPagesCount = 0;

	this.m_lDrawingFirst = -1;
	this.m_lDrawingEnd = -1;
	this.m_lCurrentPage = -1;

	this.FrameRect = {
		IsActive: false, Rect: {X: 0, Y: 0, R: 0, B: 0}, Frame: null,
		Track: {X: 0, Y: 0, L: 0, T: 0, R: 0, B: 0, PageIndex: 0, Type: -1}, IsTracked: false, PageIndex: 0
	};

	this.MathRect = {IsActive: false, Bounds: [], ContentSelection: null};
	this.MathPolygons = [];
	this.MathSelectPolygons = [];
	this.FieldTrack = {IsActive: false, Rects: []};

	this.m_oCacheManager = new CCacheManager();

	this.m_lCountCalculatePages = 0;

	this.m_lTimerTargetId = -1;
	this.m_dTargetX = -1;
	this.m_dTargetY = -1;
	this.m_lTargetPage = -1;
	this.m_dTargetSize = 1;

	this.NeedScrollToTargetFlag = false;

	this.TargetHtmlElement = null;
	this.TargetHtmlElementBlock = false; // true - block, false - visibility
	this.TargetHtmlElementLeft = 0;
	this.TargetHtmlElementTop = 0;

	this.CollaborativeTargets = [];
	this.CollaborativeTargetsUpdateTasks = [];

	this.m_bIsBreakRecalculate = false;
	this.m_bIsUpdateDocSize = false;

	this.m_bIsSelection = false;
	this.m_bIsSearching = false;
	this.m_lCountRect = 0;

	this.CurrentSearchNavi = null;
	this.SearchTransform = null;

	this.m_lTimerUpdateTargetID = -1;
	this.m_tempX = 0;
	this.m_tempY = 0;
	this.m_tempPageIndex = 0;

	var oThis = this;
	this.m_sLockedCursorType = "";
	this.TableOutlineDr = new CTableOutlineDr();

	this.m_lCurrentRendererPage = -1;
	this.m_oDocRenderer = null;
	this.m_bOldShowMarks = false;

	this.UpdateTargetFromPaint = false;
	this.UpdateTargetCheck = false;
	this.NeedTarget = true;
	this.TextMatrix = null;
	this.TargetShowFlag = false;
	this.TargetShowNeedFlag = false;

	this.SelectionMatrix = null;

	this.CanvasHit = document.createElement('canvas');
	this.CanvasHit.width = 10;
	this.CanvasHit.height = 10;
	this.CanvasHitContext = this.CanvasHit.getContext('2d');

	this.TargetCursorColor = {R: 0, G: 0, B: 0};

	this.GuiControlColorsMap = null;
	this.IsSendStandartColors = false;

	this.GuiCanvasFillTextureParentId = "";
	this.GuiCanvasFillTexture = null;
	this.GuiCanvasFillTextureCtx = null;
	this.LastDrawingUrl = "";

	this.GuiCanvasTextProps = null;
	this.GuiCanvasTextPropsId = "gui_textprops_canvas_id";
	this.GuiLastTextProps = null;

	this.TableStylesLastLook = null;
	this.LastParagraphMargins = null;

	this.TableStylesCheckLook = null;
	this.TableStylesCheckLookFlag = false;

	this.InlineTextTrackEnabled = false;
	this.InlineTextTrack = null;
	this.InlineTextTrackPage = -1;

	this.AutoShapesTrack = null;
	this.AutoShapesTrackLockPageNum = -1;

	this.Overlay = null;
	this.IsTextMatrixUse = false;
	this.IsTextSelectionOutline = false;

	this.HorVerAnchors = [];

	this.MathMenuLoad = false;

	this.UpdateRulerStateFlag = false;
	this.UpdateRulerStateParams = [];

	this.ContentControlObject = null;

	// массивы ректов для поиска
	this._search_HdrFtr_All = []; // Поиск в колонтитуле, который находится на всех страницах
	this._search_HdrFtr_All_no_First = []; // Поиск в колонтитуле, который находится на всех страницах, кроме первой
	this._search_HdrFtr_First = []; // Поиск в колонтитуле, который находится только на первой странице
	this._search_HdrFtr_Even = []; // Поиск в колонтитуле, который находится только на нечетных страницах
	this._search_HdrFtr_Odd = []; // Поиск в колонтитуле, который находится только на четных страницах, включая первую
	this._search_HdrFtr_Odd_no_First = []; // Поиск в колонтитуле, который находится только на нечетных страницах, кроме первой

	this.showTarget = function (isShow)
	{
		if (this.TargetHtmlElementBlock)
			this.TargetHtmlElement.style.display = isShow ? "display" : "none";
		else
			this.TargetHtmlElement.style.visibility = isShow ? "visible" : "hidden";
	};
	this.isShowTarget = function ()
	{
		if (this.TargetHtmlElementBlock)
			return (this.TargetHtmlElement.style.display == "display") ? true : false;
		else
			return (this.TargetHtmlElement.style.visibility == "visible") ? true : false;
	};

	this.Start_CollaborationEditing = function ()
	{
		this.IsLockObjectsEnable = true;
		this.m_oWordControl.OnRePaintAttack();
	}
	this.SetCursorType = function (sType, Data)
	{
		if ("" == this.m_sLockedCursorType)
		{
			if (AscCommon.c_oAscFormatPainterState.kOff !== this.m_oWordControl.m_oApi.isPaintFormat && "default" == sType)
				this.m_oWordControl.m_oMainContent.HtmlElement.style.cursor = AscCommon.kCurFormatPainterWord;
			else if (this.m_oWordControl.m_oApi.isMarkerFormat && "default" == sType)
				this.m_oWordControl.m_oMainContent.HtmlElement.style.cursor = this.cursorMarkerFormat;
			else
				this.m_oWordControl.m_oMainContent.HtmlElement.style.cursor = sType;
		}
		else
			this.m_oWordControl.m_oMainContent.HtmlElement.style.cursor = this.m_sLockedCursorType;

		if ("undefined" === typeof(Data) || null === Data)
			Data = new AscCommon.CMouseMoveData();

		editor.sync_MouseMoveCallback(Data);
	}
	this.LockCursorType = function (sType)
	{
		this.m_sLockedCursorType = sType;
		this.m_oWordControl.m_oMainContent.HtmlElement.style.cursor = this.m_sLockedCursorType;
	}
	this.LockCursorTypeCur = function ()
	{
		this.m_sLockedCursorType = this.m_oWordControl.m_oMainContent.HtmlElement.style.cursor;
	}
	this.UnlockCursorType = function ()
	{
		this.m_sLockedCursorType = "";
	}

	this.OnStartRecalculate = function (pageCount)
	{
		if (this.m_oWordControl)
			this.m_oWordControl.m_oApi.checkLastWork();

		this.m_lCountCalculatePages = pageCount;
		//console.log("start " + this.m_lCountCalculatePages);

		if (this.m_oWordControl && this.m_oWordControl.MobileTouchManager)
			this.m_oWordControl.MobileTouchManager.ClearContextMenu();
	}

	this.OnRepaintPage = function (index)
	{
		if (this.m_oWordControl)
			this.m_oWordControl.m_oApi.checkLastWork();

		var page = this.m_arrPages[index];
		if (!page)
			return;

		page.drawingPage.SetRepaint(this.m_oCacheManager);

		// перерисовать, если только страница видна на экране
		if (index >= this.m_lDrawingFirst && index <= this.m_lDrawingEnd)
		{
			this.m_oWordControl.OnScroll();
		}
	}

	this.OnRecalculatePage = function (index, pageObject)
	{
		if (!this.m_oWordControl.MobileTouchManager)
			this.TableOutlineDr.TableOutline = null;
		editor.sendEvent("asc_onDocumentChanged");
		if (true === this.m_bIsSearching)
		{
			this.SearchClear();
			this.m_oWordControl.OnUpdateOverlay();
		}

		if (this.m_bIsBreakRecalculate)
		{
			this.m_bIsBreakRecalculate = false;
			this.m_lCountCalculatePages = index;
		}

		this.m_lCountCalculatePages = index + 1;
		//console.log("calc " + this.m_lCountCalculatePages);

		/*
		 if (index >= this.m_lPagesCount)
		 {
		 this.m_arrPages[index] = new CPage();
		 }
		 */
		if (undefined === this.m_arrPages[index])
			this.m_arrPages[index] = new CPage();

		var page = this.m_arrPages[index];

		page.width_mm = pageObject.Width;
		page.height_mm = pageObject.Height;

		page.margin_left = pageObject.Margins.Left;
		page.margin_top = pageObject.Margins.Top;
		page.margin_right = pageObject.Margins.Right;
		page.margin_bottom = pageObject.Margins.Bottom;

		page.index = index;

		page.drawingPage.SetRepaint(this.m_oCacheManager);

		// ������ ���� ��� �������� �� ������ - �� ����� ������� ���������
		if (index >= this.m_lDrawingFirst && index <= this.m_lDrawingEnd)
		{
			this.m_oWordControl.OnScroll();
		}

		if (this.m_lCountCalculatePages > (this.m_lPagesCount + 50) || (0 == this.m_lPagesCount && 0 != this.m_lCountCalculatePages))
		{
			this.OnEndRecalculate(false);
		}
	}

	this.OnEndRecalculate = function (isFull, isBreak)
	{
		if (this.m_oWordControl)
			this.m_oWordControl.m_oApi.checkLastWork();

		if (undefined != isBreak)
		{
			this.m_lCountCalculatePages = this.m_lPagesCount;
		}

		for (var index = this.m_lCountCalculatePages; index < this.m_lPagesCount; index++)
		{
			var page = this.m_arrPages[index];
			page.drawingPage.SetRepaint(this.m_oCacheManager);
		}

		this.m_bIsBreakRecalculate = (isFull === true) ? false : true;
		if (((this.m_lPagesCount != this.m_lCountCalculatePages) && isFull) || this.m_bIsUpdateDocSize)
		{
			if (this.m_lPagesCount > this.m_lCountCalculatePages)
			{
				this.m_arrPages.splice(this.m_lCountCalculatePages, this.m_lPagesCount - this.m_lCountCalculatePages);
			}

			this.m_lPagesCount = this.m_lCountCalculatePages;
			this.m_oWordControl.CalculateDocumentSize();
			/*
			 if (true === this.m_bIsUpdateDocSize)
			 {
			 this.m_oWordControl.OnScroll();
			 this.m_oWordControl.OnUpdateSelection();
			 }
			 */

			this.m_bIsUpdateDocSize = false;
		}
		else if ((this.m_lPagesCount + 50) < this.m_lCountCalculatePages)
		{
			this.m_lPagesCount = this.m_lCountCalculatePages;
			this.m_oWordControl.CalculateDocumentSize();
		}
		else if (0 == this.m_lPagesCount && 0 != this.m_lCountCalculatePages)
		{
			this.m_lPagesCount = this.m_lCountCalculatePages;
			this.m_oWordControl.CalculateDocumentSize();
		}

		//if (this.m_lCurrentPage >= this.m_lPagesCount)
		//    this.m_lCurrentPage = this.m_lPagesCount - 1;
		if (true === isBreak || isFull)
		{
			//this.m_oWordControl.m_oLogicDocument.RecalculateCurPos();
			this.m_lCurrentPage = this.m_oWordControl.m_oLogicDocument.Get_CurPage();
			this.m_oWordControl.m_oApi.sendEvent("asc_onEndCalculate");
		}

		if (-1 != this.m_lCurrentPage)
		{
			this.m_oWordControl.m_oApi.sync_currentPageCallback(this.m_lCurrentPage);
			this.m_oWordControl.m_oApi.sync_countPagesCallback(this.m_lPagesCount);

			var bIsSendCurPage = true;
			if (this.m_oWordControl.m_oLogicDocument && this.m_oWordControl.m_oLogicDocument.DrawingObjects)
			{
				var param = this.m_oWordControl.m_oLogicDocument.DrawingObjects.isNeedUpdateRulers();
				if (true === param)
				{
					bIsSendCurPage = false;
					this.m_oWordControl.SetCurrentPage(false);
				}
			}

			if (bIsSendCurPage && this.FrameRect.IsActive)
			{
				bIsSendCurPage = false;
				this.m_oWordControl.SetCurrentPage(false);
			}

			if (bIsSendCurPage)
			{
				this.m_oWordControl.SetCurrentPage(false);
			}
		}

		if (isFull)
		{
			this.m_oWordControl.OnScroll();
		}

		//console.log("end " + this.m_lCountCalculatePages + "," + isFull + "," + isBreak);
	}

	this.ChangePageAttack = function (pageIndex)
	{
		if (pageIndex < this.m_lDrawingFirst || pageIndex > this.m_lDrawingEnd)
			return;

		this.StopRenderingPage(pageIndex);
		this.m_oWordControl.OnScroll();
	}

	this.CheckPagesSizeMaximum = function(_w, _h)
	{
		var w = _w;
		var h = _h;

		// заглушка под мобильную версию (iPad не рисует большие картинки (наверное страховка по памяти))
		if (g_bIsMobile)
		{
			var _mobile_max = 2500;
			if (w > _mobile_max || h > _mobile_max)
			{
				if (w > h)
				{
					h = (h * _mobile_max / w) >> 0;
					w = _mobile_max;
				}
				else
				{
					w = (w * _mobile_max / h) >> 0;
					h = _mobile_max;
				}
			}
		}

		return [w, h];
	}

	this.CheckRecalculatePage = function (width, height, pageIndex)
	{
		var _drawingPage = this.m_arrPages[pageIndex].drawingPage;
		var isUnlock = false;

		if (_drawingPage.cachedImage != null && _drawingPage.cachedImage.image != null)
		{
			var _check = this.CheckPagesSizeMaximum(width, height);
			if (_check[0] != _drawingPage.cachedImage.image.width || _check[1] != _drawingPage.cachedImage.image.height)
				isUnlock = true;
		}

		if (_drawingPage.IsRecalculate)
		{
			if (this.IsFreezePage(pageIndex))
			{
				// убрал выкидывание страницы. лишнее это. пусть всегда рисуется старая, пока не перерисуем
				//if ((Math.abs(_drawingPage.RecalculateTime - (new Date().getTime())) > 500 /*0.5 sec*/))
				//	isUnlock = true;
			}
			else
			{
				isUnlock = true;
			}
		}

		if (isUnlock)
			_drawingPage.UnLock(this.m_oCacheManager);
	}

	this.StartRenderingPage = function (pageIndex)
	{
		if (true === this.IsFreezePage(pageIndex))
		{
			return;
		}

		var page = this.m_arrPages[pageIndex];

		var dKoef = (this.m_oWordControl.m_nZoomValue * g_dKoef_mm_to_pix / 100);

		var w = (page.width_mm * dKoef + 0.5) >> 0;
		var h = (page.height_mm * dKoef + 0.5) >> 0;

		if (this.m_oWordControl.bIsRetinaSupport)
		{
			w = AscCommon.AscBrowser.convertToRetinaValue(w, true);
			h = AscCommon.AscBrowser.convertToRetinaValue(h, true);
		}

		var _check = this.CheckPagesSizeMaximum(w, h);
		w = _check[0];
		h = _check[1];

		page.drawingPage.UnLock(this.m_oCacheManager);
		page.drawingPage.cachedImage = this.m_oCacheManager.Lock(w, h);

		//var StartTime = new Date().getTime();

		// ������ ����� �������
		var g = new AscCommon.CGraphics();
		g.init(page.drawingPage.cachedImage.image.ctx, w, h, page.width_mm, page.height_mm);
		g.m_oFontManager = AscCommon.g_fontManager;

		g.transform(1, 0, 0, 1, 0, 0);

		if (null == this.m_oDocumentRenderer)
			this.m_oLogicDocument.DrawPage(pageIndex, g);
		else
			this.m_oDocumentRenderer.drawPage(pageIndex, g);

		if (g_page_outline_inner)
		{
			var context = page.drawingPage.cachedImage.image.ctx;

			context.strokeStyle = GlobalSkin.PageOutline;
			context.lineWidth = 1;

			context.beginPath();
			context.moveTo(0.5, 0.5);
			context.lineTo(w - 0.5, 0.5);
			context.lineTo(w - 0.5, h - 0.5);
			context.lineTo(0.5, h - 0.5);
			context.closePath();
			context.stroke();
			context.beginPath();
		}

		//var EndTime = new Date().getTime();

		//alert("" + ((EndTime - StartTime) / 1000));
	}

	this.IsFreezePage = function (pageIndex)
	{
		if (pageIndex >= 0 && (pageIndex < Math.min(this.m_lCountCalculatePages, this.m_lPagesCount)))
		{
			if (this.m_oLogicDocument)
			{
				if (pageIndex >= this.m_oLogicDocument.Pages.length)
					return true;
				else if (!this.m_oLogicDocument.CanDrawPage(pageIndex))
					return true;
			}
			return false;
		}
		return true;
	}

	this.RenderDocument = function (Renderer)
	{
		for (var i = 0; i < this.m_lPagesCount; i++)
		{
			var page = this.m_arrPages[i];
			Renderer.BeginPage(page.width_mm, page.height_mm);
			this.m_oLogicDocument.DrawPage(i, Renderer);
			Renderer.EndPage();
		}
	}

	this.ToRenderer = function ()
	{
		var Renderer = new AscCommon.CDocumentRenderer();
		Renderer.VectorMemoryForPrint = new AscCommon.CMemory();
		var old_marks = this.m_oWordControl.m_oApi.ShowParaMarks;
		this.m_oWordControl.m_oApi.ShowParaMarks = false;
		this.RenderDocument(Renderer);
		this.m_oWordControl.m_oApi.ShowParaMarks = old_marks;
		var ret = Renderer.Memory.GetBase64Memory();
		//console.log(ret);
		return ret;
	}

	this.ToRenderer2 = function ()
	{
		var Renderer = new AscCommon.CDocumentRenderer();

		var old_marks = this.m_oWordControl.m_oApi.ShowParaMarks;
		this.m_oWordControl.m_oApi.ShowParaMarks = false;

		var ret = "";
		for (var i = 0; i < this.m_lPagesCount; i++)
		{
			var page = this.m_arrPages[i];
			Renderer.BeginPage(page.width_mm, page.height_mm);
			this.m_oLogicDocument.DrawPage(i, Renderer);
			Renderer.EndPage();

			ret += Renderer.Memory.GetBase64Memory();
			Renderer.Memory.Seek(0);
		}

		this.m_oWordControl.m_oApi.ShowParaMarks = old_marks;
		//console.log(ret);
		return ret;
	}
	this.ToRendererPart = function ()
	{
		var pagescount = Math.min(this.m_lPagesCount, this.m_lCountCalculatePages);

		if (-1 == this.m_lCurrentRendererPage)
		{
			this.m_oDocRenderer = new AscCommon.CDocumentRenderer();
			this.m_oDocRenderer.VectorMemoryForPrint = new AscCommon.CMemory();
			this.m_lCurrentRendererPage = 0;
			this.m_bOldShowMarks = this.m_oWordControl.m_oApi.ShowParaMarks;
			this.m_oWordControl.m_oApi.ShowParaMarks = false;
		}

		var start = this.m_lCurrentRendererPage;
		var end = pagescount - 1;

		var renderer = this.m_oDocRenderer;
		renderer.Memory.Seek(0);
		renderer.VectorMemoryForPrint.ClearNoAttack();

		for (var i = start; i <= end; i++)
		{
			var page = this.m_arrPages[i];
			renderer.BeginPage(page.width_mm, page.height_mm);
			this.m_oLogicDocument.DrawPage(i, renderer);
			renderer.EndPage();
		}

		this.m_lCurrentRendererPage = end + 1;

		if (this.m_lCurrentRendererPage >= pagescount)
		{
			this.m_lCurrentRendererPage = -1;
			this.m_oDocRenderer = null;
			this.m_oWordControl.m_oApi.ShowParaMarks = this.m_bOldShowMarks;
		}

		return renderer.Memory.GetBase64Memory();
	}

	this.StopRenderingPage = function (pageIndex)
	{
		if (null != this.m_oDocumentRenderer)
			this.m_oDocumentRenderer.stopRenderingPage(pageIndex);

		this.m_arrPages[pageIndex].drawingPage.UnLock(this.m_oCacheManager);
	}

	this.ClearCachePages = function ()
	{
		for (var i = 0; i < this.m_lPagesCount; i++)
		{
			var page = this.m_arrPages[i];
			if (page)
				page.drawingPage.SetRepaint(this.m_oCacheManager);
		}
	}

	this.CloseFile = function ()
	{
		this.ClearCachePages();
		this.m_arrPages.splice(0, this.m_arrPages.length);
		this.m_lPagesCount = 0;

		this.m_lDrawingFirst = -1;
		this.m_lDrawingEnd = -1;
		this.m_lCurrentPage = -1;
	}

	this.CheckRasterImageOnScreen = function (src)
	{
		if (null == this.m_oWordControl.m_oLogicDocument)
			return;

		if (this.m_lDrawingFirst == -1 || this.m_lDrawingEnd == -1)
			return;

		var bIsRaster = false;
		var _checker = this.m_oWordControl.m_oLogicDocument.DrawingObjects;
		for (var i = this.m_lDrawingFirst; i <= this.m_lDrawingEnd; i++)
		{
			var _imgs = _checker.getAllRasterImagesOnPage(i);

			var _len = _imgs.length;
			for (var j = 0; j < _len; j++)
			{
				if (AscCommon.getFullImageSrc2(_imgs[j]) == src)
				{
					this.StopRenderingPage(i);
					bIsRaster = true;
					break;
				}
			}
		}

		if (bIsRaster)
			this.m_oWordControl.OnScroll();
	}

	this.FirePaint = function ()
	{
		this.m_oWordControl.OnScroll();
	}

	this.ConvertCoordsFromCursor = function (x, y, bIsRul)
	{
		var _x = x;
		var _y = y;

		var dKoef = (100 * g_dKoef_pix_to_mm / this.m_oWordControl.m_nZoomValue);

		if (undefined == bIsRul)
		{
			var _xOffset = this.m_oWordControl.X;
			var _yOffset = this.m_oWordControl.Y;

			/*
			 if (true == this.m_oWordControl.m_bIsRuler)
			 {
			 _xOffset += (5 * g_dKoef_mm_to_pix);
			 _yOffset += (7 * g_dKoef_mm_to_pix);
			 }
			 */

			_x = x - _xOffset;
			_y = y - _yOffset;
		}

		for (var i = this.m_lDrawingFirst; i <= this.m_lDrawingEnd; i++)
		{
			var rect = this.m_arrPages[i].drawingPage;

			if ((rect.left <= _x) && (_x <= rect.right) && (rect.top <= _y) && (_y <= rect.bottom))
			{
				var x_mm = (_x - rect.left) * dKoef;
				var y_mm = (_y - rect.top) * dKoef;

				return {X: x_mm, Y: y_mm, Page: rect.pageIndex, DrawPage: i};
			}
		}

		return {X: 0, Y: 0, Page: -1, DrawPage: -1};
	}

	this.ConvertCoordsFromCursorPage = function (x, y, page, bIsRul)
	{
		var _x = x;
		var _y = y;

		var dKoef = (100 * g_dKoef_pix_to_mm / this.m_oWordControl.m_nZoomValue);

		if (undefined == bIsRul)
		{
			var _xOffset = this.m_oWordControl.X;
			var _yOffset = this.m_oWordControl.Y;

			/*
			 if (true == this.m_oWordControl.m_bIsRuler)
			 {
			 _xOffset += (5 * g_dKoef_mm_to_pix);
			 _yOffset += (7 * g_dKoef_mm_to_pix);
			 }
			 */

			_x = x - _xOffset;
			_y = y - _yOffset;
		}

		if (page < 0 || page >= this.m_lPagesCount)
			return {X: 0, Y: 0, Page: -1, DrawPage: -1};

		var rect = this.m_arrPages[page].drawingPage;
		var x_mm = (_x - rect.left) * dKoef;
		var y_mm = (_y - rect.top) * dKoef;

		return {X: x_mm, Y: y_mm, Page: rect.pageIndex, DrawPage: page};
	}

	this.ConvertCoordsToAnotherPage = function (x, y, pageCoord, pageNeed)
	{
		if (pageCoord < 0 || pageCoord >= this.m_lPagesCount || pageNeed < 0 || pageNeed >= this.m_lPagesCount)
			return {X: 0, Y: 0, Error: true};

		var dKoef1 = this.m_oWordControl.m_nZoomValue * g_dKoef_mm_to_pix / 100;
		var dKoef2 = 100 * g_dKoef_pix_to_mm / this.m_oWordControl.m_nZoomValue;

		var page1 = this.m_arrPages[pageCoord].drawingPage;
		var page2 = this.m_arrPages[pageNeed].drawingPage;

		var xCursor = page1.left + x * dKoef1;
		var yCursor = page1.top + y * dKoef1;

		var _x = (xCursor - page2.left) * dKoef2;
		var _y = (yCursor - page2.top) * dKoef2;

		return {X: _x, Y: _y, Error: false};
	}

	this.ConvertCoordsFromCursor2 = function (x, y, bIsRul, bIsNoNormalize, _zoomVal)
	{
		var _x = x;
		var _y = y;

		var dKoef = (100 * g_dKoef_pix_to_mm / this.m_oWordControl.m_nZoomValue);
		if (undefined !== _zoomVal)
			dKoef = (100 * g_dKoef_pix_to_mm / _zoomVal);

		if (undefined == bIsRul)
		{
			var _xOffset = this.m_oWordControl.X;
			var _yOffset = this.m_oWordControl.Y;

			if (true == this.m_oWordControl.m_bIsRuler)
			{
				_xOffset += (5 * g_dKoef_mm_to_pix);
				_yOffset += (7 * g_dKoef_mm_to_pix);
			}

			_x = x - _xOffset;
			_y = y - _yOffset;
		}

		if (-1 == this.m_lDrawingFirst || -1 == this.m_lDrawingEnd)
			return {X: 0, Y: 0, Page: -1, DrawPage: -1};

		for (var i = this.m_lDrawingFirst; i <= this.m_lDrawingEnd; i++)
		{
			var rect = this.m_arrPages[i].drawingPage;

			if ((rect.left <= _x) && (_x <= rect.right) && (rect.top <= _y) && (_y <= rect.bottom))
			{
				var x_mm = (_x - rect.left) * dKoef;
				var y_mm = (_y - rect.top) * dKoef;

				if (x_mm > (this.m_arrPages[i].width_mm + 10))
					x_mm = this.m_arrPages[i].width_mm + 10;
				if (x_mm < -10)
					x_mm = -10;

				return {X: x_mm, Y: y_mm, Page: rect.pageIndex, DrawPage: i};
			}
		}

		// в страницу не попали. вторая попытка - это попробовать найти страницу по вертикали
		var _start = Math.max(this.m_lDrawingFirst - 1, 0);
		var _end = Math.min(this.m_lDrawingEnd + 1, this.m_lPagesCount - 1);
		for (var i = _start; i <= _end; i++)
		{
			var rect = this.m_arrPages[i].drawingPage;

			var bIsCurrent = false;
			if (i == this.m_lDrawingFirst && rect.top > _y)
			{
				bIsCurrent = true;
			}
			else if ((rect.top <= _y) && (_y <= rect.bottom))
			{
				bIsCurrent = true;
			}
			else if (i != this.m_lPagesCount - 1)
			{
				if (_y > rect.bottom && _y < this.m_arrPages[i + 1].drawingPage.top)
					bIsCurrent = true;
			}
			else if (_y < rect.top)
			{
				// либо вышли раньше, либо это самая первая видимая страница
				bIsCurrent = true;
			}
			else if (i == this.m_lDrawingEnd)
			{
				if (_y > rect.bottom)
					bIsCurrent = true;
			}

			if (bIsCurrent)
			{
				var x_mm = (_x - rect.left) * dKoef;
				var y_mm = (_y - rect.top) * dKoef;

				if (true === bIsNoNormalize)
				{
					if (x_mm > (this.m_arrPages[i].width_mm + 10))
						x_mm = this.m_arrPages[i].width_mm + 10;
					if (x_mm < -10)
						x_mm = -10;
				}

				return {X: x_mm, Y: y_mm, Page: rect.pageIndex, DrawPage: i};
			}
		}

		return {X: 0, Y: 0, Page: -1, DrawPage: -1};
	}

	this.ConvetToPageCoords = function (x, y, pageIndex)
	{
		if (pageIndex < 0 || pageIndex >= this.m_lPagesCount)
		{
			return {X: 0, Y: 0, Page: pageIndex, Error: true};
		}
		var dKoef = (100 * g_dKoef_pix_to_mm / this.m_oWordControl.m_nZoomValue);
		var rect = this.m_arrPages[pageIndex].drawingPage;

		var _x = (x - rect.left) * dKoef;
		var _y = (y - rect.top) * dKoef;

		return {X: _x, Y: _y, Page: pageIndex, Error: false};
	}

	this.IsCursorInTableCur = function (x, y, page)
	{
		var _table = this.TableOutlineDr.TableOutline;
		if (_table == null)
			return false;

		if (page != _table.PageNum)
			return false;

		var _dist = this.TableOutlineDr.image.width * g_dKoef_pix_to_mm;
		_dist *= (100 / this.m_oWordControl.m_nZoomValue);

		var _x = _table.X;
		var _y = _table.Y;
		var _r = _x + _table.W;
		var _b = _y + _table.H;

		if ((x > (_x - _dist)) && (x < _r) && (y > (_y - _dist)) && (y < _b))
		{
			if ((x < _x) || (y < _y))
			{
				this.TableOutlineDr.Counter = 0;
				this.TableOutlineDr.bIsNoTable = false;
				return true;
			}
		}
		return false;
	}

	this.ConvertCoordsToCursorWR = function (x, y, pageIndex, transform, id_ruler_no_use)
	{
		var dKoef = (this.m_oWordControl.m_nZoomValue * g_dKoef_mm_to_pix / 100);

		var _x = 0;
		var _y = 0;
		if (true == this.m_oWordControl.m_bIsRuler && (id_ruler_no_use !== false))
		{
			_x = 5 * g_dKoef_mm_to_pix;
			_y = 7 * g_dKoef_mm_to_pix;
		}

		// теперь крутить всякие циклы нет смысла
		if (pageIndex < 0 || pageIndex >= this.m_lPagesCount)
		{
			return {X: 0, Y: 0, Error: true};
		}

		var __x = x;
		var __y = y;
		if (transform)
		{
			__x = transform.TransformPointX(x, y);
			__y = transform.TransformPointY(x, y);
		}

		var x_pix = (this.m_arrPages[pageIndex].drawingPage.left + __x * dKoef + _x) >> 0;
		var y_pix = (this.m_arrPages[pageIndex].drawingPage.top + __y * dKoef + _y) >> 0;

		return {X: x_pix, Y: y_pix, Error: false};
	}

	this.ConvertCoordsToCursor = function (x, y, pageIndex, bIsRul)
	{
		var dKoef = (this.m_oWordControl.m_nZoomValue * g_dKoef_mm_to_pix / 100);

		var _x = 0;
		var _y = 0;
		if (true == this.m_oWordControl.m_bIsRuler)
		{
			if (undefined == bIsRul)
			{
				//_x = 5 * g_dKoef_mm_to_pix;
				//_y = 7 * g_dKoef_mm_to_pix;
			}
		}

		// теперь крутить всякие циклы нет смысла
		if (pageIndex < 0 || pageIndex >= this.m_lPagesCount)
		{
			return {X: 0, Y: 0, Error: true};
		}

		var x_pix = (this.m_arrPages[pageIndex].drawingPage.left + x * dKoef + _x) >> 0;
		var y_pix = (this.m_arrPages[pageIndex].drawingPage.top + y * dKoef + _y) >> 0;

		return {X: x_pix, Y: y_pix, Error: false};

		// old version
		for (var i = this.m_lDrawingFirst; i <= this.m_lDrawingEnd; i++)
		{
			var rect = this.m_arrPages[i].drawingPage;

			if (this.m_arrPages[i].pageIndex == pageIndex)
			{
				var x_pix = (rect.left + x * dKoef + _x) >> 0;
				var y_pix = (rect.top + y * dKoef + _y) >> 0;

				return {X: x_pix, Y: y_pix, Error: false};
			}
		}

		return {X: 0, Y: 0, Error: true};
	}
	this.ConvertCoordsToCursor2 = function (x, y, pageIndex, bIsRul)
	{
		var dKoef = (this.m_oWordControl.m_nZoomValue * g_dKoef_mm_to_pix / 100);

		var _x = 0;
		var _y = 0;
		if (true == this.m_oWordControl.m_bIsRuler)
		{
			if (undefined == bIsRul)
			{
				//_x = 5 * g_dKoef_mm_to_pix;
				//_y = 7 * g_dKoef_mm_to_pix;
			}
		}

		// теперь крутить всякие циклы нет смысла
		if (pageIndex < 0 || pageIndex >= this.m_lPagesCount)
		{
			return {X: 0, Y: 0, Error: true};
		}

		var x_pix = (this.m_arrPages[pageIndex].drawingPage.left + x * dKoef + _x - 0.5) >> 0;
		var y_pix = (this.m_arrPages[pageIndex].drawingPage.top + y * dKoef + _y - 0.5) >> 0;

		return {X: x_pix, Y: y_pix, Error: false};
	}
	this.ConvertCoordsToCursor3 = function (x, y, pageIndex, isGlobal)
	{
		// теперь крутить всякие циклы нет смысла
		if (pageIndex < 0 || pageIndex >= this.m_lPagesCount)
		{
			return {X: 0, Y: 0, Error: true};
		}

		var dKoef = (this.m_oWordControl.m_nZoomValue * g_dKoef_mm_to_pix / 100);

		var _x = 0;
		var _y = 0;
		if (isGlobal)
		{
			_x = this.m_oWordControl.X;
			_y = this.m_oWordControl.Y;

			if (true == this.m_oWordControl.m_bIsRuler)
			{
				_x += 5 * g_dKoef_mm_to_pix;
				_y += 7 * g_dKoef_mm_to_pix;
			}
		}

		var x_pix = (this.m_arrPages[pageIndex].drawingPage.left + x * dKoef + _x + 0.5) >> 0;
		var y_pix = (this.m_arrPages[pageIndex].drawingPage.top + y * dKoef + _y + 0.5) >> 0;

		return {X: x_pix, Y: y_pix, Error: false};
	}

	this.ConvertCoordsToCursor4 = function (x, y, pageIndex)
	{
		// теперь крутить всякие циклы нет смысла
		if (pageIndex < 0 || pageIndex >= this.m_lPagesCount)
		{
			return {X: 0, Y: 0, Error: true};
		}

		var dKoef = (this.m_oWordControl.m_nZoomValue * g_dKoef_mm_to_pix / 100);

		var x_pix = (this.m_arrPages[pageIndex].drawingPage.left + x * dKoef + 0.5) >> 0;
		var y_pix = (this.m_arrPages[pageIndex].drawingPage.top + y * dKoef + 0.5) >> 0;

		return {X: x_pix, Y: y_pix, Error: false};
	}

	this.InitViewer = function ()
	{
	}

	this.TargetStart = function ()
	{
		if (this.m_lTimerTargetId != -1)
			clearInterval(this.m_lTimerTargetId);
		this.m_lTimerTargetId = setInterval(oThis.DrawTarget, 500);
	}
	this.TargetEnd = function ()
	{
		//if (!this.TargetShowFlag)
		//    return;

		this.TargetShowFlag = false;
		this.TargetShowNeedFlag = false;

		if (this.m_lTimerTargetId != -1)
		{
			clearInterval(this.m_lTimerTargetId);
			this.m_lTimerTargetId = -1;
		}

		this.showTarget(false);
	}
	this.UpdateTargetNoAttack = function ()
	{
		if (null == this.m_oWordControl)
			return;

		this.CheckTargetDraw(this.m_dTargetX, this.m_dTargetY);
	}

	this.GetTargetStyle = function ()
	{
		return "rgb(" + this.TargetCursorColor.R + "," + this.TargetCursorColor.G + "," + this.TargetCursorColor.B + ")";
	}

	this.SetTargetColor = function (r, g, b)
	{
		this.TargetCursorColor.R = r;
		this.TargetCursorColor.G = g;
		this.TargetCursorColor.B = b;
	}

	this.CheckTargetDraw = function (x, y)
	{
		var _oldW = this.TargetHtmlElement.width;
		var _oldH = this.TargetHtmlElement.height;

		var _newW = 2;
		var _newH = (this.m_dTargetSize * this.m_oWordControl.m_nZoomValue * g_dKoef_mm_to_pix / 100) >> 0;

		if (null != this.TextMatrix && !global_MatrixTransformer.IsIdentity2(this.TextMatrix))
		{
			var _x1 = this.TextMatrix.TransformPointX(x, y);
			var _y1 = this.TextMatrix.TransformPointY(x, y);

			var _x2 = this.TextMatrix.TransformPointX(x, y + this.m_dTargetSize);
			var _y2 = this.TextMatrix.TransformPointY(x, y + this.m_dTargetSize);

			var pos1 = this.ConvertCoordsToCursor2(_x1, _y1, this.m_lCurrentPage);
			var pos2 = this.ConvertCoordsToCursor2(_x2, _y2, this.m_lCurrentPage);

			_newW = (Math.abs(pos1.X - pos2.X) >> 0) + 1;
			_newH = (Math.abs(pos1.Y - pos2.Y) >> 0) + 1;

			if (2 > _newW)
				_newW = 2;
			if (2 > _newH)
				_newH = 2;

			if (_oldW == _newW && _oldH == _newH)
			{
				if (_newW != 2 && _newH != 2)
				{
					// просто очищаем
					this.TargetHtmlElement.width = _newW;
				}
			}
			else
			{
				this.TargetHtmlElement.style.width = _newW + "px";
				this.TargetHtmlElement.style.height = _newH + "px";

				this.TargetHtmlElement.width = _newW;
				this.TargetHtmlElement.height = _newH;
			}
			var ctx = this.TargetHtmlElement.getContext('2d');

			if (_newW == 2 || _newH == 2)
			{
				ctx.fillStyle = this.GetTargetStyle();
				ctx.fillRect(0, 0, _newW, _newH);
			}
			else
			{
				ctx.beginPath();
				ctx.strokeStyle = this.GetTargetStyle();
				ctx.lineWidth = 2;

				if (((pos1.X - pos2.X) * (pos1.Y - pos2.Y)) >= 0)
				{
					ctx.moveTo(0, 0);
					ctx.lineTo(_newW, _newH);
				}
				else
				{
					ctx.moveTo(0, _newH);
					ctx.lineTo(_newW, 0);
				}

				ctx.stroke();
			}

			oThis.TargetHtmlElementLeft = Math.min(pos1.X, pos2.X) >> 0;
			oThis.TargetHtmlElementTop = Math.min(pos1.Y, pos2.Y) >> 0;
			if ((!oThis.m_oWordControl.MobileTouchManager && !AscCommon.AscBrowser.isSafariMacOs) || !AscCommon.AscBrowser.isWebkit)
			{
				oThis.TargetHtmlElement.style.left = oThis.TargetHtmlElementLeft + "px";
				oThis.TargetHtmlElement.style.top = oThis.TargetHtmlElementTop + "px";
			}
			else
			{
				oThis.TargetHtmlElement.style.left = "0px";
				oThis.TargetHtmlElement.style.top = "0px";
				oThis.TargetHtmlElement.style["webkitTransform"] = "matrix(1, 0, 0, 1, " + oThis.TargetHtmlElementLeft + "," + oThis.TargetHtmlElementTop + ")";
			}
		}
		else
		{
			if (_oldW == _newW && _oldH == _newH)
			{
				// просто очищаем
				this.TargetHtmlElement.width = _newW;
			}
			else
			{
				this.TargetHtmlElement.style.width = _newW + "px";
				this.TargetHtmlElement.style.height = _newH + "px";

				this.TargetHtmlElement.width = _newW;
				this.TargetHtmlElement.height = _newH;
			}

			var ctx = this.TargetHtmlElement.getContext('2d');

			ctx.fillStyle = this.GetTargetStyle();
			ctx.fillRect(0, 0, _newW, _newH);

			if (null != this.TextMatrix)
			{
				x += this.TextMatrix.tx;
				y += this.TextMatrix.ty;
			}

			var pos = this.ConvertCoordsToCursor2(x, y, this.m_lCurrentPage);

			this.TargetHtmlElementLeft = pos.X >> 0;
			this.TargetHtmlElementTop = pos.Y >> 0;

			if ((!oThis.m_oWordControl.MobileTouchManager && !AscCommon.AscBrowser.isSafariMacOs) || !AscCommon.AscBrowser.isWebkit)
			{
				this.TargetHtmlElement.style.left = this.TargetHtmlElementLeft + "px";
				this.TargetHtmlElement.style.top = this.TargetHtmlElementTop + "px";
			}
			else
			{
				oThis.TargetHtmlElement.style.left = "0px";
				oThis.TargetHtmlElement.style.top = "0px";
				oThis.TargetHtmlElement.style["webkitTransform"] = "matrix(1, 0, 0, 1, " + oThis.TargetHtmlElementLeft + "," + oThis.TargetHtmlElementTop + ")";
			}
		}

		this.MoveTargetInInputContext();
	};

	this.MoveTargetInInputContext = function ()
	{
		if (AscCommon.g_inputContext)
			AscCommon.g_inputContext.move(this.TargetHtmlElementLeft, this.TargetHtmlElementTop);
	}

	this.UpdateTargetTransform = function (matrix)
	{
		this.TextMatrix = matrix;
	}

	this.MultiplyTargetTransform = function (matrix)
	{
		if (!this.TextMatrix)
			this.TextMatrix = matrix;
		else if (matrix)
		{
			this.TextMatrix.Multiply(matrix, AscCommon.MATRIX_ORDER_PREPEND);
		}
	}

	this.UpdateTarget = function (x, y, pageIndex)
	{
		if (this.m_oWordControl)
			this.m_oWordControl.m_oApi.checkLastWork();

		this.m_oWordControl.m_oLogicDocument.Set_TargetPos(x, y, pageIndex);

		if (this.UpdateTargetFromPaint === false)
		{
			this.UpdateTargetCheck = true;
			return;
		}

		var bNeedScrollToTarget = true;
		if (this.m_dTargetX == x && this.m_dTargetY == y && this.m_lTargetPage == pageIndex)
			bNeedScrollToTarget = false;

		if (-1 != this.m_lTimerUpdateTargetID)
		{
			clearTimeout(this.m_lTimerUpdateTargetID);
			this.m_lTimerUpdateTargetID = -1;
		}

		if (pageIndex >= this.m_arrPages.length)
			return;

		var bIsPageChanged = false;
		if (this.m_lCurrentPage != pageIndex)
		{
			this.m_lCurrentPage = pageIndex;
			this.m_oWordControl.SetCurrentPage2();
			this.m_oWordControl.OnScroll();
			bIsPageChanged = true;
		}

		var targetSize = Number(this.m_dTargetSize * this.m_oWordControl.m_nZoomValue * g_dKoef_mm_to_pix / 100);

		var pos = null;
		var __x = x;
		var __y = y;
		if (!this.TextMatrix)
		{
			pos = this.ConvertCoordsToCursor2(x, y, this.m_lCurrentPage);
		}
		else
		{
			__x = this.TextMatrix.TransformPointX(x, y);
			__y = this.TextMatrix.TransformPointY(x, y);

			pos = this.ConvertCoordsToCursor2(__x, __y, this.m_lCurrentPage);
		}

		//pos.Y -= targetSize;

		if (true == pos.Error && (false == bIsPageChanged))
			return;

		// �������, ����� �� ������ �� ������

		var _ww = this.m_oWordControl.m_oEditor.HtmlElement.width;
		var _hh = this.m_oWordControl.m_oEditor.HtmlElement.height;
		if (this.m_oWordControl.bIsRetinaSupport)
		{
			_ww /= AscCommon.AscBrowser.retinaPixelRatio;
			_hh /= AscCommon.AscBrowser.retinaPixelRatio;
		}

		var boxX = 0;
		var boxY = 0;
		var boxR = _ww - 2;
		var boxB = _hh - targetSize;

		/*
		 if (true == this.m_oWordControl.m_bIsRuler)
		 {
		 boxX += Number(5 * g_dKoef_mm_to_pix);
		 boxY += Number(7 * g_dKoef_mm_to_pix);
		 boxR += Number(5 * g_dKoef_mm_to_pix);
		 boxB += Number(7 * g_dKoef_mm_to_pix);
		 }
		 */

		var nValueScrollHor = 0;
		if (pos.X < boxX)
		{
			nValueScrollHor = this.m_oWordControl.GetHorizontalScrollTo(__x - 5, pageIndex);
		}
		if (pos.X > boxR)
		{
			var _mem = __x + 5 - g_dKoef_pix_to_mm * _ww * 100 / this.m_oWordControl.m_nZoomValue;
			nValueScrollHor = this.m_oWordControl.GetHorizontalScrollTo(_mem, pageIndex);
		}

		var nValueScrollVer = 0;
		if (pos.Y < boxY)
		{
			nValueScrollVer = this.m_oWordControl.GetVerticalScrollTo(__y - 5, pageIndex);
		}
		if (pos.Y > boxB)
		{
			var _mem = __y + targetSize + 5 - g_dKoef_pix_to_mm * _hh * 100 / this.m_oWordControl.m_nZoomValue;
			nValueScrollVer = this.m_oWordControl.GetVerticalScrollTo(_mem, pageIndex);
		}

		if (!bNeedScrollToTarget)
		{
			nValueScrollHor = 0;
			nValueScrollVer = 0;
		}

		if (0 != nValueScrollHor || 0 != nValueScrollVer)
		{
			if (this.m_oWordControl.m_bIsMouseUpSend === true && AscCommon.global_keyboardEvent.ClickCount != 1)
			{
				this.m_tempX = x;
				this.m_tempY = y;
				this.m_tempPageIndex = pageIndex;
				var oThis = this;
				this.m_lTimerUpdateTargetID = setTimeout(this.UpdateTargetTimer, 100);
				return;
			}
		}

		this.m_dTargetX = x;
		this.m_dTargetY = y;
		this.m_lTargetPage = pageIndex;
		var isNeedScroll = false;
		if (0 != nValueScrollHor)
		{
			isNeedScroll = true;
			this.m_oWordControl.m_bIsUpdateTargetNoAttack = true;
			var temp = nValueScrollHor * this.m_oWordControl.m_dScrollX_max / (this.m_oWordControl.m_dDocumentWidth - _ww);
			this.m_oWordControl.m_oScrollHorApi.scrollToX(parseInt(temp), false);
		}
		if (0 != nValueScrollVer)
		{
			isNeedScroll = true;
			this.m_oWordControl.m_bIsUpdateTargetNoAttack = true;
			var temp = nValueScrollVer * this.m_oWordControl.m_dScrollY_max / (this.m_oWordControl.m_dDocumentHeight - _hh);
			this.m_oWordControl.m_oScrollVerApi.scrollToY(parseInt(temp), false);
		}

		if (true == isNeedScroll)
		{
			this.m_oWordControl.m_bIsUpdateTargetNoAttack = true;
			this.m_oWordControl.OnScroll();
			return;
		}

		this.CheckTargetDraw(x, y);
	}
	this.UpdateTarget2 = function (x, y, pageIndex)
	{
		if (pageIndex >= this.m_arrPages.length)
			return;

		this.m_oWordControl.m_oLogicDocument.Set_TargetPos(x, y, pageIndex);

		var bIsPageChanged = false;
		if (this.m_lCurrentPage != pageIndex)
		{
			this.m_lCurrentPage = pageIndex;
			this.m_oWordControl.SetCurrentPage2();
			this.m_oWordControl.OnScroll();
			bIsPageChanged = true;
		}

		this.m_dTargetX = x;
		this.m_dTargetY = y;
		this.m_lTargetPage = pageIndex;

		var pos = this.ConvertCoordsToCursor(x, y, this.m_lCurrentPage);

		if (true == pos.Error && (false == bIsPageChanged))
			return;

		var _ww = this.m_oWordControl.m_oEditor.HtmlElement.width;
		var _hh = this.m_oWordControl.m_oEditor.HtmlElement.height;
		if (this.m_oWordControl.bIsRetinaSupport)
		{
			_ww /= AscCommon.AscBrowser.retinaPixelRatio;
			_hh /= AscCommon.AscBrowser.retinaPixelRatio;
		}

		// �������, ����� �� ������ �� ������
		var boxX = 0;
		var boxY = 0;
		var boxR = _ww;
		var boxB = _hh;

		/*
		 if (true == this.m_oWordControl.m_bIsRuler)
		 {
		 boxX += Number(5 * g_dKoef_mm_to_pix);
		 boxY += Number(7 * g_dKoef_mm_to_pix);
		 boxR += Number(5 * g_dKoef_mm_to_pix);
		 boxB += Number(7 * g_dKoef_mm_to_pix);
		 }
		 */

		var nValueScrollHor = 0;
		if (pos.X < boxX)
		{
			nValueScrollHor = this.m_oWordControl.GetHorizontalScrollTo(x - 5, pageIndex);
		}
		if (pos.X > boxR)
		{
			var _mem = x + 5 - g_dKoef_pix_to_mm * _ww * 100 / this.m_oWordControl.m_nZoomValue;
			nValueScrollHor = this.m_oWordControl.GetHorizontalScrollTo(_mem, pageIndex);
		}

		var nValueScrollVer = 0;
		if (pos.Y < boxY)
		{
			nValueScrollVer = this.m_oWordControl.GetVerticalScrollTo(y - 5, pageIndex);
		}
		if (pos.Y > boxB)
		{
			var _mem = y + this.m_dTargetSize + 5 - g_dKoef_pix_to_mm * _hh * 100 / this.m_oWordControl.m_nZoomValue;
			nValueScrollVer = this.m_oWordControl.GetVerticalScrollTo(_mem, pageIndex);
		}

		var isNeedScroll = false;
		if (0 != nValueScrollHor)
		{
			isNeedScroll = true;
			var temp = nValueScrollHor * this.m_oWordControl.m_dScrollX_max / (this.m_oWordControl.m_dDocumentWidth - _ww);
			this.m_oWordControl.m_oScrollHorApi.scrollToX(parseInt(temp), false);
		}
		if (0 != nValueScrollVer)
		{
			isNeedScroll = true;
			var temp = nValueScrollVer * this.m_oWordControl.m_dScrollY_max / (this.m_oWordControl.m_dDocumentHeight - _hh);
			this.m_oWordControl.m_oScrollVerApi.scrollToY(parseInt(temp), false);
		}

		if (true == isNeedScroll)
		{
			this.m_oWordControl.OnScroll();
			return;
		}
	}

	this.UpdateTargetTimer = function ()
	{
		var x = oThis.m_tempX;
		var y = oThis.m_tempY;
		var pageIndex = oThis.m_tempPageIndex;

		oThis.m_lTimerUpdateTargetID = -1;
		if (pageIndex >= oThis.m_arrPages.length)
			return;

		var oWordControl = oThis.m_oWordControl;

		var bIsPageChanged = false;
		if (oThis.m_lCurrentPage != pageIndex)
		{
			oThis.m_lCurrentPage = pageIndex;
			oWordControl.SetCurrentPage2();
			oWordControl.OnScroll();
			bIsPageChanged = true;
		}

		oThis.m_dTargetX = x;
		oThis.m_dTargetY = y;
		oThis.m_lTargetPage = pageIndex;

		var targetSize = Number(oThis.m_dTargetSize * oWordControl.m_nZoomValue * g_dKoef_mm_to_pix / 100);
		var pos = oThis.ConvertCoordsToCursor2(x, y, oThis.m_lCurrentPage);
		//pos.Y -= targetSize;

		if (true === pos.Error && (false === bIsPageChanged))
			return;

		// �������, ����� �� ������ �� ������
		var boxX = 0;
		var boxY = 0;
		var boxR = oWordControl.m_oEditor.HtmlElement.width - 2;
		var boxB = oWordControl.m_oEditor.HtmlElement.height - targetSize;

		/*
		 if (true === oWordControl.m_bIsRuler)
		 {
		 boxX += Number(5 * g_dKoef_mm_to_pix);
		 boxY += Number(7 * g_dKoef_mm_to_pix);
		 boxR += Number(5 * g_dKoef_mm_to_pix);
		 boxB += Number(7 * g_dKoef_mm_to_pix);
		 }
		 */

		var nValueScrollHor = 0;
		if (pos.X < boxX)
		{
			nValueScrollHor = boxX - pos.X;
		}
		if (pos.X > boxR)
		{
			nValueScrollHor = boxR - pos.X;
		}

		var nValueScrollVer = 0;
		if (pos.Y < boxY)
		{
			nValueScrollVer = boxY - pos.Y;
		}
		if (pos.Y > boxB)
		{
			nValueScrollVer = boxB - pos.Y;
		}

		var isNeedScroll = false;
		if (0 != nValueScrollHor)
		{
			isNeedScroll = true;
			oWordControl.m_bIsUpdateTargetNoAttack = true;
			oWordControl.m_oScrollHorApi.scrollByX(-nValueScrollHor, false);
		}
		if (0 != nValueScrollVer)
		{
			isNeedScroll = true;
			oWordControl.m_bIsUpdateTargetNoAttack = true;
			oWordControl.m_oScrollVerApi.scrollByY(-nValueScrollVer, false);
		}

		if (true === isNeedScroll)
		{
			oWordControl.m_bIsUpdateTargetNoAttack = true;
			oWordControl.OnScroll();
			return;
		}

		oThis.TargetHtmlElementLeft = pos.X >> 0;
		oThis.TargetHtmlElementTop = pos.Y >> 0;
		oThis.TargetHtmlElement.style.left = oThis.TargetHtmlElementLeft + "px";
		oThis.TargetHtmlElement.style.top = oThis.TargetHtmlElementTop + "px";
	}

	this.SetTargetSize = function (size)
	{
		this.m_dTargetSize = size;
		//this.TargetHtmlElement.style.height = Number(this.m_dTargetSize * this.m_oWordControl.m_nZoomValue * g_dKoef_mm_to_pix / 100) + "px";
		//this.TargetHtmlElement.style.width = "2px";
	}
	this.DrawTarget = function ()
	{
		if (oThis.NeedTarget && oThis.m_oWordControl.IsFocus)
		{
			oThis.showTarget(!oThis.isShowTarget());
		}
	};

	this.TargetShow = function ()
	{
		this.TargetShowNeedFlag = true;
	}
	this.CheckTargetShow = function ()
	{
		if (this.TargetShowFlag && this.TargetShowNeedFlag)
		{
			this.showTarget(true);
			this.TargetShowNeedFlag = false;
			return;
		}

		if (!this.TargetShowNeedFlag)
			return;

		this.TargetShowNeedFlag = false;

		if (-1 == this.m_lTimerTargetId)
			this.TargetStart();

		if (oThis.NeedTarget)
			this.showTarget(true);

		this.TargetShowFlag = true;
	}
	this.StartTrackImage = function (obj, x, y, w, h, type, pagenum)
	{
	}
	this.StartTrackTable = function (obj, transform)
	{
		if (this.m_oWordControl.MobileTouchManager)
		{
			if (!this.m_oWordControl.MobileTouchManager.TableStartTrack_Check)
				return;
		}

		this.TableOutlineDr.TableOutline = obj;
		this.TableOutlineDr.Counter = 0;
		this.TableOutlineDr.bIsNoTable = false;
		this.TableOutlineDr.CheckStartTrack(this.m_oWordControl, transform);

		if (this.m_oWordControl.MobileTouchManager)
			this.m_oWordControl.OnUpdateOverlay();
	}
	this.EndTrackTable = function (pointer, bIsAttack)
	{
		if (this.TableOutlineDr.TableOutline != null)
		{
			if (pointer == this.TableOutlineDr.TableOutline.Table || bIsAttack)
			{
				this.TableOutlineDr.TableOutline = null;
				this.TableOutlineDr.Counter = 0;
			}
		}
	}
	this.CheckTrackTable = function ()
	{
		if (null == this.TableOutlineDr.TableOutline)
			return;

		if (this.TableOutlineDr.bIsNoTable && this.TableOutlineDr.bIsTracked === false)
		{
			this.TableOutlineDr.Counter++;
			if (this.TableOutlineDr.Counter > 100)
			{
				this.TableOutlineDr.TableOutline = null;
				this.m_oWordControl.OnUpdateOverlay();
			}
		}
	}

	this.DrawFrameTrack = function (overlay)
	{
		if (!this.FrameRect.IsActive)
			return;

		var _page = this.m_arrPages[this.FrameRect.PageIndex];
		var drPage = _page.drawingPage;

		var dKoefX = (drPage.right - drPage.left) / _page.width_mm;
		var dKoefY = (drPage.bottom - drPage.top) / _page.height_mm;

		var _x = (drPage.left + dKoefX * this.FrameRect.Rect.X);
		var _y = (drPage.top + dKoefY * this.FrameRect.Rect.Y);
		var _r = (drPage.left + dKoefX * this.FrameRect.Rect.R);
		var _b = (drPage.top + dKoefY * this.FrameRect.Rect.B);

		if (_x < overlay.min_x)
			overlay.min_x = _x;
		if (_r > overlay.max_x)
			overlay.max_x = _r;

		if (_y < overlay.min_y)
			overlay.min_y = _y;
		if (_b > overlay.max_y)
			overlay.max_y = _b;

		var ctx = overlay.m_oContext;
		ctx.strokeStyle = "#939393";
		ctx.lineWidth = 1;

		ctx.beginPath();
		this.AutoShapesTrack.AddRectDashClever(ctx, _x >> 0, _y >> 0, _r >> 0, _b >> 0, 2, 2, true);
		ctx.beginPath();

		var _w = 4;
		var _wc = 5;

		var _x1 = (_x >> 0) + 1;
		var _y1 = (_y >> 0) + 1;

		var _x2 = (_r >> 0) - _w;
		var _y2 = (_b >> 0) - _w;

		var _xc = ((_x + _r - _wc) / 2) >> 0;
		var _yc = ((_y + _b - _wc) / 2) >> 0;

		ctx.rect(_x1, _y1, _w, _w);
		ctx.rect(_xc, _y1, _wc, _w);
		ctx.rect(_x2, _y1, _w, _w);
		ctx.rect(_x1, _yc, _w, _wc);
		ctx.rect(_x2, _yc, _w, _wc);
		ctx.rect(_x1, _y2, _w, _w);
		ctx.rect(_xc, _y2, _wc, _w);
		ctx.rect(_x2, _y2, _w, _w);

		ctx.fillStyle = "#777777";
		ctx.fill();
		ctx.beginPath();

		// move
		if (this.FrameRect.IsTracked)
		{
			_page = this.m_arrPages[this.FrameRect.Track.PageIndex];
			drPage = _page.drawingPage;

			dKoefX = (drPage.right - drPage.left) / _page.width_mm;
			dKoefY = (drPage.bottom - drPage.top) / _page.height_mm;

			var __x = (drPage.left + dKoefX * this.FrameRect.Track.L) >> 0;
			var __y = (drPage.top + dKoefY * this.FrameRect.Track.T) >> 0;
			var __r = (drPage.left + dKoefX * this.FrameRect.Track.R) >> 0;
			var __b = (drPage.top + dKoefY * this.FrameRect.Track.B) >> 0;

			if (__x < overlay.min_x)
				overlay.min_x = __x;
			if (__r > overlay.max_x)
				overlay.max_x = __r;

			if (__y < overlay.min_y)
				overlay.min_y = __y;
			if (__b > overlay.max_y)
				overlay.max_y = __b;

			ctx.strokeStyle = "#FFFFFF";

			ctx.beginPath();
			ctx.rect(__x + 0.5, __y + 0.5, __r - __x, __b - __y);
			ctx.stroke();

			ctx.strokeStyle = "#000000";
			ctx.beginPath();
			this.AutoShapesTrack.AddRectDashClever(ctx, __x, __y, __r, __b, 3, 3, true);
			ctx.beginPath();
		}
	};

	this.DrawContentControl = function(id, type, page, rects)
	{
		if (type == c_oContentControlTrack.In)
			this.ContentControlObject = { id : id, page : page, rect : rect };

		var overlay = this.m_oHtmlPage.m_oOverlayApi;

		var ctx = overlay.m_oContext;
		ctx.strokeStyle = "#ADADAD";
		ctx.lineWidth = 1;

		var _page = this.m_arrPages[page];
		var drPage = _page.drawingPage;

		var dKoefX = (drPage.right - drPage.left) / _page.width_mm;
		var dKoefY = (drPage.bottom - drPage.top) / _page.height_mm;

		ctx.beginPath();

		var _x, _y, _r, _b;
		for (var i = 0; i < rects.length; i++)
		{
			_x = (drPage.left + dKoefX * rect.X);
			_y = (drPage.top + dKoefY * rect.Y);
			_r = (drPage.left + dKoefX * rect.R);
			_b = (drPage.top + dKoefY * rect.B);

			if (_x < overlay.min_x)
				overlay.min_x = _x;
			if (_r > overlay.max_x)
				overlay.max_x = _r;

			if (_y < overlay.min_y)
				overlay.min_y = _y;
			if (_b > overlay.max_y)
				overlay.max_y = _b;

			ctx.rect((_x >> 0) + 0.5, (_y >> 0) + 0.5, (_r - _x) >> 0, (_b - _t) >> 0);
		}

		if (type == c_oContentControlTrack.Hover)
		{
			ctx.fillStyle = "rgba(235, 235, 235, 0.5);";
			ctx.fill();
		}
		ctx.stroke();

		ctx.beginPath();

		if (type == c_oContentControlTrack.In)
		{

		}
	};

	this.private_DrawMathTrack = function (overlay, oPath, shift, color, dKoefX, dKoefY, drPage)
	{
		var ctx = overlay.m_oContext;
		ctx.strokeStyle = color;
		ctx.lineWidth = 1;
		ctx.beginPath();

		var Points = oPath.Points;

		var nCount = Points.length;
		// берем предпоследнюю точку, т.к. последняя совпадает с первой
		var PrevX = Points[nCount - 2].X, PrevY = Points[nCount - 2].Y;
		var _x = drPage.left + dKoefX * Points[nCount - 2].X,
			_y = drPage.top + dKoefY * Points[nCount - 2].Y;
		var StartX, StartY;

		for (var nIndex = 0; nIndex < nCount; nIndex++)
		{
			if (PrevX > Points[nIndex].X)
			{
				_y = drPage.top + dKoefY * Points[nIndex].Y - shift;
			}
			else if (PrevX < Points[nIndex].X)
			{
				_y = drPage.top + dKoefY * Points[nIndex].Y + shift;
			}

			if (PrevY < Points[nIndex].Y)
			{
				_x = drPage.left + dKoefX * Points[nIndex].X - shift;
			}
			else if (PrevY > Points[nIndex].Y)
			{
				_x = drPage.left + dKoefX * Points[nIndex].X + shift;
			}

			PrevX = Points[nIndex].X;
			PrevY = Points[nIndex].Y;

			if (nIndex > 0)
			{
				overlay.CheckPoint(_x, _y);

				if (1 == nIndex)
				{
					StartX = _x;
					StartY = _y;
					overlay.m_oContext.moveTo((_x >> 0) + 0.5, (_y >> 0) + 0.5);
				}
				else
				{
					overlay.m_oContext.lineTo((_x >> 0) + 0.5, (_y >> 0) + 0.5);
				}
			}
		}

		overlay.m_oContext.lineTo((StartX >> 0) + 0.5, (StartY >> 0) + 0.5);

		ctx.closePath();
		ctx.stroke();
		ctx.beginPath();
	};
	this.private_DrawMathTrackWithMatrix = function (overlay, oPath, ShiftX, ShiftY, color, dKoefX, dKoefY, drPage, m)
	{
		var ctx = overlay.m_oContext;
		ctx.strokeStyle = color;
		ctx.lineWidth = 1;
		ctx.beginPath();

		var Points = oPath.Points;

		var nCount = Points.length;
		// берем предпоследнюю точку, т.к. последняя совпадает с первой
		var x = Points[nCount - 2].X, y = Points[nCount - 2].Y;
		var _x, _y;

		var PrevX = Points[nCount - 2].X, PrevY = Points[nCount - 2].Y;
		var StartX, StartY;

		for (var nIndex = 0; nIndex < nCount; nIndex++)
		{
			if (PrevX > Points[nIndex].X)
			{
				y = Points[nIndex].Y - ShiftY;
			}
			else if (PrevX < Points[nIndex].X)
			{
				y = Points[nIndex].Y + ShiftY;
			}

			if (PrevY < Points[nIndex].Y)
			{
				x = Points[nIndex].X - ShiftX;
			}
			else if (PrevY > Points[nIndex].Y)
			{
				x = Points[nIndex].X + ShiftX;
			}

			PrevX = Points[nIndex].X;
			PrevY = Points[nIndex].Y;

			if (nIndex > 0)
			{
				_x = (drPage.left + dKoefX * m.TransformPointX(x, y));
				_y = (drPage.top + dKoefY * m.TransformPointY(x, y));

				overlay.CheckPoint(_x, _y);

				if (1 == nIndex)
				{
					StartX = _x;
					StartY = _y;
					overlay.m_oContext.moveTo((_x >> 0) + 0.5, (_y >> 0) + 0.5);
				}
				else
				{
					overlay.m_oContext.lineTo((_x >> 0) + 0.5, (_y >> 0) + 0.5);
				}
			}

		}

		overlay.m_oContext.lineTo((StartX >> 0) + 0.5, (StartY >> 0) + 0.5);

		ctx.closePath();
		ctx.stroke();
		ctx.beginPath();
	};

	this.DrawMathTrack = function (overlay)
	{
		if (!this.MathRect.IsActive)
			return;

		overlay.Show();

		var ctx = overlay.m_oContext;
		var nIndex, nCount;
		var oPath, SelectPaths;
		var _page, drPage, dKoefX, dKoefY;
		var PathLng = this.MathPolygons.length;
		var Points, nPointIndex, _x, _y;

		if (null == this.TextMatrix || global_MatrixTransformer.IsIdentity(this.TextMatrix))
		{
			for (nIndex = 0; nIndex < PathLng; nIndex++)
			{
				oPath = this.MathPolygons[nIndex];

				_page = this.m_arrPages[oPath.Page];
				drPage = _page.drawingPage;

				dKoefX = (drPage.right - drPage.left) / _page.width_mm;
				dKoefY = (drPage.bottom - drPage.top) / _page.height_mm;

				this.private_DrawMathTrack(overlay, oPath, 0, "#939393", dKoefX, dKoefY, drPage);
				this.private_DrawMathTrack(overlay, oPath, 1, "#FFFFFF", dKoefX, dKoefY, drPage);
			}

			SelectPaths = this.MathSelectPolygons;

			for (nIndex = 0, nCount = SelectPaths.length; nIndex < nCount; nIndex++)
			{
				oPath = SelectPaths[nIndex];
				_page = this.m_arrPages[oPath.Page];
				drPage = _page.drawingPage;

				dKoefX = (drPage.right - drPage.left) / _page.width_mm;
				dKoefY = (drPage.bottom - drPage.top) / _page.height_mm;

				ctx.fillStyle = "#375082";
				ctx.beginPath();

				Points = oPath.Points;
				for (nPointIndex = 0; nPointIndex < Points.length - 1; nPointIndex++)
				{
					_x = drPage.left + dKoefX * Points[nPointIndex].X;
					_y = drPage.top + dKoefY * Points[nPointIndex].Y;

					overlay.CheckPoint(_x, _y);

					if (0 == nPointIndex)
						ctx.moveTo((_x >> 0) + 0.5, (_y >> 0) + 0.5);
					else
						ctx.lineTo((_x >> 0) + 0.5, (_y >> 0) + 0.5);
				}

				ctx.globalAlpha = 0.2;
				ctx.fill();
				ctx.globalAlpha = 1;

			}
		}
		else
		{
			for (nIndex = 0; nIndex < PathLng; nIndex++)
			{
				oPath = this.MathPolygons[nIndex];
				_page = this.m_arrPages[oPath.Page];
				drPage = _page.drawingPage;

				dKoefX = (drPage.right - drPage.left) / _page.width_mm;
				dKoefY = (drPage.bottom - drPage.top) / _page.height_mm;

				var _1px_mm_x = 1 / Math.max(dKoefX, 0.001);
				var _1px_mm_y = 1 / Math.max(dKoefY, 0.001);

				this.private_DrawMathTrackWithMatrix(overlay, oPath, 0, 0, "#939393", dKoefX, dKoefY, drPage, this.TextMatrix);
				this.private_DrawMathTrackWithMatrix(overlay, oPath, _1px_mm_x, _1px_mm_y, "#FFFFFF", dKoefX, dKoefY, drPage, this.TextMatrix);
			}

			SelectPaths = this.MathSelectPolygons;

			for (nIndex = 0, nCount = SelectPaths.length; nIndex < nCount; nIndex++)
			{
				oPath = SelectPaths[nIndex];
				_page = this.m_arrPages[oPath.Page];
				drPage = _page.drawingPage;

				dKoefX = (drPage.right - drPage.left) / _page.width_mm;
				dKoefY = (drPage.bottom - drPage.top) / _page.height_mm;

				ctx.fillStyle = "#375082";
				ctx.beginPath();

				Points = oPath.Points;
				for (nPointIndex = 0; nPointIndex < Points.length - 1; nPointIndex++)
				{
					var x = Points[nPointIndex].X, y = Points[nPointIndex].Y;
					_x = drPage.left + dKoefX * this.TextMatrix.TransformPointX(x, y);
					_y = drPage.top + dKoefY * this.TextMatrix.TransformPointY(x, y);

					overlay.CheckPoint(_x, _y);

					if (0 == nPointIndex)
						ctx.moveTo((_x >> 0) + 0.5, (_y >> 0) + 0.5);
					else
						ctx.lineTo((_x >> 0) + 0.5, (_y >> 0) + 0.5);
				}

				ctx.globalAlpha = 0.2;
				ctx.fill();
				ctx.globalAlpha = 1;

			}
		}
	};

	this.DrawFieldTrack = function (overlay)
	{
		if (!this.FieldTrack.IsActive)
			return;

		overlay.Show();

		for (var nIndex = 0, nCount = this.FieldTrack.Rects.length; nIndex < nCount; nIndex++)
		{
			var FieldRect = this.FieldTrack.Rects[nIndex];

			var _page = this.m_arrPages[FieldRect.PageIndex];
			var drPage = _page.drawingPage;

			var dKoefX = (drPage.right - drPage.left) / _page.width_mm;
			var dKoefY = (drPage.bottom - drPage.top) / _page.height_mm;

			if (null == this.TextMatrix || global_MatrixTransformer.IsIdentity(this.TextMatrix))
			{
				var _x = (drPage.left + dKoefX * FieldRect.X0);
				var _y = (drPage.top + dKoefY * FieldRect.Y0);
				var _r = (drPage.left + dKoefX * FieldRect.X1);
				var _b = (drPage.top + dKoefY * FieldRect.Y1);

				if (_x < overlay.min_x)
					overlay.min_x = _x;
				if (_r > overlay.max_x)
					overlay.max_x = _r;

				if (_y < overlay.min_y)
					overlay.min_y = _y;
				if (_b > overlay.max_y)
					overlay.max_y = _b;

				var ctx = overlay.m_oContext;
				ctx.fillStyle = "#375082";

				ctx.beginPath();
				this.AutoShapesTrack.AddRect(ctx, _x >> 0, _y >> 0, _r >> 0, _b >> 0);

				ctx.globalAlpha = 0.2;
				ctx.fill();
				ctx.globalAlpha = 1;
				ctx.beginPath();
			}
			else
			{
				var _arrSelect = TransformRectByMatrix(this.TextMatrix, [FieldRect.X0, FieldRect.Y0, FieldRect.X1, FieldRect.Y1], drPage.left, drPage.top, dKoefX, dKoefY);

				overlay.CheckPoint(_arrSelect[0], _arrSelect[1]);
				overlay.CheckPoint(_arrSelect[2], _arrSelect[3]);
				overlay.CheckPoint(_arrSelect[4], _arrSelect[5]);
				overlay.CheckPoint(_arrSelect[6], _arrSelect[7]);

				var ctx = overlay.m_oContext;
				ctx.fillStyle = "#375082";

				ctx.beginPath();

				ctx.moveTo(_arrSelect[0], _arrSelect[1]);
				ctx.lineTo(_arrSelect[2], _arrSelect[3]);
				ctx.lineTo(_arrSelect[4], _arrSelect[5]);
				ctx.lineTo(_arrSelect[6], _arrSelect[7]);
				ctx.closePath();

				ctx.globalAlpha = 0.2;
				ctx.fill();
				ctx.globalAlpha = 1;
				ctx.beginPath();
			}
		}
	}

	this.DrawTableTrack = function (overlay)
	{
		if (null == this.TableOutlineDr.TableOutline)
			return;

		var _table = this.TableOutlineDr.TableOutline.Table;

		if (!_table.Is_Inline())
		{
			if (null == this.TableOutlineDr.CurPos)
				return;

			var _page = this.m_arrPages[this.TableOutlineDr.CurPos.Page];
			var drPage = _page.drawingPage;

			var dKoefX = (drPage.right - drPage.left) / _page.width_mm;
			var dKoefY = (drPage.bottom - drPage.top) / _page.height_mm;

			if (!this.TableOutlineDr.TableMatrix || global_MatrixTransformer.IsIdentity(this.TableOutlineDr.TableMatrix))
			{
				var _x = ((drPage.left + dKoefX * this.TableOutlineDr.CurPos.X) >> 0) + 0.5;
				var _y = ((drPage.top + dKoefY * this.TableOutlineDr.CurPos.Y) >> 0) + 0.5;

				var _r = _x + ((dKoefX * this.TableOutlineDr.TableOutline.W) >> 0);
				var _b = _y + ((dKoefY * this.TableOutlineDr.TableOutline.H) >> 0);

				if (_x < overlay.min_x)
					overlay.min_x = _x;
				if (_r > overlay.max_x)
					overlay.max_x = _r;

				if (_y < overlay.min_y)
					overlay.min_y = _y;
				if (_b > overlay.max_y)
					overlay.max_y = _b;

				var ctx = overlay.m_oContext;
				ctx.strokeStyle = "#FFFFFF";

				ctx.beginPath();
				ctx.rect(_x, _y, _r - _x, _b - _y);
				ctx.stroke();

				ctx.strokeStyle = "#000000";
				ctx.beginPath();

				// набиваем пунктир
				var dot_size = 3;
				for (var i = _x; i < _r; i += dot_size)
				{
					ctx.moveTo(i, _y);
					i += dot_size;

					if (i > _r)
						i = _r;

					ctx.lineTo(i, _y);
				}
				for (var i = _y; i < _b; i += dot_size)
				{
					ctx.moveTo(_r, i);
					i += dot_size;

					if (i > _b)
						i = _b;

					ctx.lineTo(_r, i);
				}
				for (var i = _r; i > _x; i -= dot_size)
				{
					ctx.moveTo(i, _b);
					i -= dot_size;

					if (i < _x)
						i = _x;

					ctx.lineTo(i, _b);
				}
				for (var i = _b; i > _y; i -= dot_size)
				{
					ctx.moveTo(_x, i);
					i -= dot_size;

					if (i < _y)
						i = _y;

					ctx.lineTo(_x, i);
				}

				ctx.stroke();
				ctx.beginPath();
			}
			else
			{
				var _x = this.TableOutlineDr.CurPos.X + _table.Get_TableOffsetCorrection();
				var _y = this.TableOutlineDr.CurPos.Y;
				var _r = _x + this.TableOutlineDr.TableOutline.W;
				var _b = _y + this.TableOutlineDr.TableOutline.H;

				var transform = this.TableOutlineDr.TableMatrix;

				var x1 = transform.TransformPointX(_x, _y);
				var y1 = transform.TransformPointY(_x, _y);

				var x2 = transform.TransformPointX(_r, _y);
				var y2 = transform.TransformPointY(_r, _y);

				var x3 = transform.TransformPointX(_r, _b);
				var y3 = transform.TransformPointY(_r, _b);

				var x4 = transform.TransformPointX(_x, _b);
				var y4 = transform.TransformPointY(_x, _b);

				overlay.CheckPoint(x1, y1);
				overlay.CheckPoint(x2, y2);
				overlay.CheckPoint(x3, y3);
				overlay.CheckPoint(x4, y4);

				var ctx = overlay.m_oContext;
				ctx.strokeStyle = "#FFFFFF";

				ctx.beginPath();
				ctx.moveTo(x1, y1);
				ctx.lineTo(x2, y2);
				ctx.lineTo(x3, y3);
				ctx.lineTo(x4, y4);
				ctx.closePath();
				ctx.stroke();

				ctx.strokeStyle = "#000000";
				ctx.beginPath();
				this.AutoShapesTrack.AddRectDash(ctx, x1, y1, x2, y2, x4, y4, x3, y3, 3, 3, true);
				ctx.beginPath();
			}
		}
		else
		{
			this.LockCursorType("default");

			var _x = global_mouseEvent.X;
			var _y = global_mouseEvent.Y;
			var posMouse = this.ConvertCoordsFromCursor2(_x, _y);

			this.TableOutlineDr.InlinePos = this.m_oWordControl.m_oLogicDocument.Get_NearestPos(posMouse.Page, posMouse.X, posMouse.Y);
			this.TableOutlineDr.InlinePos.Page = posMouse.Page;
			//var posView = this.ConvertCoordsToCursor(this.TableOutlineDr.InlinePos.X, this.TableOutlineDr.InlinePos.Y, posMouse.Page, true);

			var _near = this.TableOutlineDr.InlinePos;
			this.AutoShapesTrack.SetCurrentPage(_near.Page);
			this.AutoShapesTrack.DrawInlineMoveCursor(_near.X, _near.Y, _near.Height, _near.transform);
		}
	}
	this.SetCurrentPage = function (PageIndex)
	{
		if (PageIndex >= this.m_arrPages.length)
			return;
		if (this.m_lCurrentPage == PageIndex)
			return;

		this.m_lCurrentPage = PageIndex;
		this.m_oWordControl.SetCurrentPage();
	}

	this.SelectEnabled = function (bIsEnabled)
	{
		this.m_bIsSelection = bIsEnabled;
		if (false === this.m_bIsSelection)
		{
			this.SelectClear();
			//this.m_oWordControl.CheckUnShowOverlay();
			this.m_oWordControl.OnUpdateOverlay();
			this.m_oWordControl.m_oOverlayApi.m_oContext.globalAlpha = 1.0;
		}
	}
	this.SelectClear = function ()
	{
		if (this.m_oWordControl.MobileTouchManager)
		{
			this.m_oWordControl.MobileTouchManager.RectSelect1 = null;
			this.m_oWordControl.MobileTouchManager.RectSelect2 = null;
		}
	}
	this.SearchClear = function ()
	{
		for (var i = 0; i < this.m_lPagesCount; i++)
		{
			this.m_arrPages[i].searchingArray.splice(0, this.m_arrPages[i].searchingArray.length);
		}

		this._search_HdrFtr_All.splice(0, this._search_HdrFtr_All.length);
		this._search_HdrFtr_All_no_First.splice(0, this._search_HdrFtr_All_no_First.length);
		this._search_HdrFtr_First.splice(0, this._search_HdrFtr_First.length);
		this._search_HdrFtr_Even.splice(0, this._search_HdrFtr_Even.length);
		this._search_HdrFtr_Odd.splice(0, this._search_HdrFtr_Odd.length);
		this._search_HdrFtr_Odd_no_First.splice(0, this._search_HdrFtr_Odd_no_First.length);

		this.m_oWordControl.m_oOverlayApi.Clear();
		this.m_bIsSearching = false;
	}
	this.AddPageSearch = function (findText, rects, type)
	{
		var _len = rects.length;
		if (_len == 0)
			return;

		if (this.m_oWordControl.m_oOverlay.HtmlElement.style.display == "none")
		{
			this.m_oWordControl.ShowOverlay();
			this.m_oWordControl.m_oOverlayApi.m_oContext.globalAlpha = 0.2;
		}

		var navigator = {Page: rects[0].PageNum, Place: rects, Type: type};

		var _find = {text: findText, navigator: navigator};
		this.m_oWordControl.m_oApi.sync_SearchFoundCallback(_find);

		var is_update = false;

		var _type = type & 0x00FF;
		switch (_type)
		{
			case search_Common:
			{
				var _pages = this.m_arrPages;
				for (var i = 0; i < _len; i++)
				{
					var r = rects[i];

					if (this.SearchTransform)
						r.Transform = this.SearchTransform;

					_pages[r.PageNum].searchingArray[_pages[r.PageNum].searchingArray.length] = r;

					if (r.PageNum >= this.m_lDrawingFirst && r.PageNum <= this.m_lDrawingEnd)
						is_update = true;
				}
				break;
			}
			case search_HdrFtr_All:
			{
				for (var i = 0; i < _len; i++)
				{
					if (this.SearchTransform)
						rects[i].Transform = this.SearchTransform;

					this._search_HdrFtr_All[this._search_HdrFtr_All.length] = rects[i];
				}
				is_update = true;

				break;
			}
			case search_HdrFtr_All_no_First:
			{
				for (var i = 0; i < _len; i++)
				{
					if (this.SearchTransform)
						rects[i].Transform = this.SearchTransform;

					this._search_HdrFtr_All_no_First[this._search_HdrFtr_All_no_First.length] = rects[i];
				}
				if (this.m_lDrawingEnd > 0)
					is_update = true;

				break;
			}
			case search_HdrFtr_First:
			{
				for (var i = 0; i < _len; i++)
				{
					if (this.SearchTransform)
						rects[i].Transform = this.SearchTransform;

					this._search_HdrFtr_First[this._search_HdrFtr_First.length] = rects[i];
				}
				if (this.m_lDrawingFirst == 0)
					is_update = true;

				break;
			}
			case search_HdrFtr_Even:
			{
				for (var i = 0; i < _len; i++)
				{
					if (this.SearchTransform)
						rects[i].Transform = this.SearchTransform;

					this._search_HdrFtr_Even[this._search_HdrFtr_Even.length] = rects[i];
				}
				var __c = this.m_lDrawingEnd - this.m_lDrawingFirst;

				if (__c > 1)
					is_update = true;
				else if (__c == 1 && (this.m_lDrawingFirst & 1) == 1)
					is_update = true;

				break;
			}
			case search_HdrFtr_Odd:
			{
				for (var i = 0; i < _len; i++)
				{
					if (this.SearchTransform)
						rects[i].Transform = this.SearchTransform;

					this._search_HdrFtr_Odd[this._search_HdrFtr_Odd.length] = rects[i];
				}
				var __c = this.m_lDrawingEnd - this.m_lDrawingFirst;

				if (__c > 1)
					is_update = true;
				else if (__c == 1 && (this.m_lDrawingFirst & 1) == 0)
					is_update = true;

				break;
			}
			case search_HdrFtr_Odd_no_First:
			{
				for (var i = 0; i < _len; i++)
				{
					if (this.SearchTransform)
						rects[i].Transform = this.SearchTransform;

					this._search_HdrFtr_Odd_no_First[this._search_HdrFtr_Odd_no_First.length] = rects[i];
				}

				if (this.m_lDrawingEnd > 1)
				{
					var __c = this.m_lDrawingEnd - this.m_lDrawingFirst;
					if (__c > 1)
						is_update = true;
					else if (__c == 1 && (this.m_lDrawingFirst & 1) == 0)
						is_update = true;
				}

				break;
			}
			default:
				break;
		}

		if (is_update)
			this.m_oWordControl.OnUpdateOverlay();

	}

	this.StartSearchTransform = function (transform)
	{
		this.SearchTransform = transform.CreateDublicate();
	}

	this.EndSearchTransform = function ()
	{
		this.SearchTransform = null;
	}

	this.StartSearch = function ()
	{
		this.SearchClear();
		if (this.m_bIsSelection)
			this.m_oWordControl.OnUpdateOverlay();
		this.m_bIsSearching = true;
	}
	this.EndSearch = function (bIsChange)
	{
		if (bIsChange)
		{
			this.SearchClear();
			this.m_bIsSearching = false;
			this.m_oWordControl.OnUpdateOverlay();
		}
		else
		{
			this.m_bIsSearching = true;
			this.m_oWordControl.OnUpdateOverlay();
		}
		this.m_oWordControl.m_oApi.sync_SearchEndCallback();
	}

	this.SetTextSelectionOutline = function (isSelectionOutline)
	{
		this.IsTextSelectionOutline = isSelectionOutline;
	}

	this.private_StartDrawSelection = function (overlay)
	{
		this.Overlay = overlay;
		this.IsTextMatrixUse = ((null != this.TextMatrix) && !global_MatrixTransformer.IsIdentity(this.TextMatrix));

		this.Overlay.m_oContext.fillStyle = "rgba(51,102,204,255)";
		this.Overlay.m_oContext.beginPath();

		if (this.m_oWordControl.MobileTouchManager)
		{
			this.m_oWordControl.MobileTouchManager.RectSelect1 = null;
			this.m_oWordControl.MobileTouchManager.RectSelect2 = null;
		}
	}
	this.private_EndDrawSelection = function ()
	{
		var ctx = this.Overlay.m_oContext;

		ctx.globalAlpha = 0.2;
		ctx.fill();

		if (this.IsTextMatrixUse && this.IsTextSelectionOutline)
		{
			ctx.strokeStyle = "#9ADBFE";
			ctx.lineWidth = 1;
			ctx.globalAlpha = 1.0;
			ctx.stroke();
		}

		ctx.beginPath();
		ctx.globalAlpha = 1.0;

		this.IsTextMatrixUse = false;
		this.Overlay = null;
	}

	this.AddPageSelection = function (pageIndex, x, y, w, h)
	{
		if (null == this.SelectionMatrix)
			this.SelectionMatrix = this.TextMatrix;

		this.IsTextMatrixUse = ((null != this.TextMatrix) && !global_MatrixTransformer.IsIdentity(this.TextMatrix));

		var page = this.m_arrPages[pageIndex];
		var drawPage = page.drawingPage;

		var dKoefX = (drawPage.right - drawPage.left) / page.width_mm;
		var dKoefY = (drawPage.bottom - drawPage.top) / page.height_mm;

		if (!this.IsTextMatrixUse)
		{
			var _x = ((drawPage.left + dKoefX * x) >> 0);
			var _y = ((drawPage.top + dKoefY * y) >> 0);

			var _r = ((drawPage.left + dKoefX * (x + w)) >> 0);
			var _b = ((drawPage.top + dKoefY * (y + h)) >> 0);

			var _w = _r - _x + 1;
			var _h = _b - _y + 1;

			this.Overlay.CheckRect(_x, _y, _w, _h);
			this.Overlay.m_oContext.rect(_x, _y, _w, _h);
		}
		else
		{
			var _x1 = this.TextMatrix.TransformPointX(x, y);
			var _y1 = this.TextMatrix.TransformPointY(x, y);

			var _x2 = this.TextMatrix.TransformPointX(x + w, y);
			var _y2 = this.TextMatrix.TransformPointY(x + w, y);

			var _x3 = this.TextMatrix.TransformPointX(x + w, y + h);
			var _y3 = this.TextMatrix.TransformPointY(x + w, y + h);

			var _x4 = this.TextMatrix.TransformPointX(x, y + h);
			var _y4 = this.TextMatrix.TransformPointY(x, y + h);

			var x1 = drawPage.left + dKoefX * _x1;
			var y1 = drawPage.top + dKoefY * _y1;

			var x2 = drawPage.left + dKoefX * _x2;
			var y2 = drawPage.top + dKoefY * _y2;

			var x3 = drawPage.left + dKoefX * _x3;
			var y3 = drawPage.top + dKoefY * _y3;

			var x4 = drawPage.left + dKoefX * _x4;
			var y4 = drawPage.top + dKoefY * _y4;

			if (global_MatrixTransformer.IsIdentity2(this.TextMatrix))
			{
				x1 = (x1 >> 0) + 0.5;
				y1 = (y1 >> 0) + 0.5;

				x2 = (x2 >> 0) + 0.5;
				y2 = (y2 >> 0) + 0.5;

				x3 = (x3 >> 0) + 0.5;
				y3 = (y3 >> 0) + 0.5;

				x4 = (x4 >> 0) + 0.5;
				y4 = (y4 >> 0) + 0.5;
			}

			this.Overlay.CheckPoint(x1, y1);
			this.Overlay.CheckPoint(x2, y2);
			this.Overlay.CheckPoint(x3, y3);
			this.Overlay.CheckPoint(x4, y4);

			var ctx = this.Overlay.m_oContext;
			ctx.moveTo(x1, y1);
			ctx.lineTo(x2, y2);
			ctx.lineTo(x3, y3);
			ctx.lineTo(x4, y4);
			ctx.closePath();
		}
	}

	this.CheckSelectMobile = function (overlay)
	{
		var _select = this.m_oWordControl.m_oLogicDocument.GetSelectionBounds();
		if (!_select)
			return;

		var _rect1 = _select.Start;
		var _rect2 = _select.End;

		if (!_rect1 || !_rect2)
			return;

		var _matrix = this.TextMatrix;

		var ctx = overlay.m_oContext;

		var pos1, pos2, pos3, pos4;

		if (!_matrix || global_MatrixTransformer.IsIdentity(_matrix))
		{
			pos1 = this.ConvertCoordsToCursorWR(_rect1.X, _rect1.Y, _rect1.Page, undefined, false);
			pos2 = this.ConvertCoordsToCursorWR(_rect1.X, _rect1.Y + _rect1.H, _rect1.Page, undefined, false);

			pos3 = this.ConvertCoordsToCursorWR(_rect2.X + _rect2.W, _rect2.Y, _rect2.Page, undefined, false);
			pos4 = this.ConvertCoordsToCursorWR(_rect2.X + _rect2.W, _rect2.Y + _rect2.H, _rect2.Page, undefined, false);

			ctx.strokeStyle = "#1B63BA";

			ctx.moveTo(pos1.X >> 0, pos1.Y >> 0);
			ctx.lineTo(pos2.X >> 0, pos2.Y >> 0);

			ctx.moveTo(pos3.X >> 0, pos3.Y >> 0);
			ctx.lineTo(pos4.X >> 0, pos4.Y >> 0);

			ctx.lineWidth = 2;
			ctx.stroke();

			/*
			 ctx.beginPath();

			 ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
			 overlay.AddEllipse(pos1.X, pos1.Y - 5, 6.5);
			 overlay.AddEllipse(pos4.X, pos4.Y + 5, 6.5);
			 ctx.fill();

			 ctx.beginPath();

			 ctx.fillStyle = "#FFFFFF";
			 overlay.AddEllipse(pos1.X, pos1.Y - 5, 6);
			 overlay.AddEllipse(pos4.X, pos4.Y + 5, 6);
			 ctx.fill();
			 */

			ctx.beginPath();

			ctx.fillStyle = "#1B63BA";
			overlay.AddEllipse(pos1.X, pos1.Y - 5, 5);
			overlay.AddEllipse(pos4.X, pos4.Y + 5, 5);
			ctx.fill();
		}
		else
		{
			var _xx11 = _matrix.TransformPointX(_rect1.X, _rect1.Y);
			var _yy11 = _matrix.TransformPointY(_rect1.X, _rect1.Y);

			var _xx12 = _matrix.TransformPointX(_rect1.X, _rect1.Y + _rect1.H);
			var _yy12 = _matrix.TransformPointY(_rect1.X, _rect1.Y + _rect1.H);

			var _xx21 = _matrix.TransformPointX(_rect2.X + _rect2.W, _rect2.Y);
			var _yy21 = _matrix.TransformPointY(_rect2.X + _rect2.W, _rect2.Y);

			var _xx22 = _matrix.TransformPointX(_rect2.X + _rect2.W, _rect2.Y + _rect2.H);
			var _yy22 = _matrix.TransformPointY(_rect2.X + _rect2.W, _rect2.Y + _rect2.H);

			pos1 = this.ConvertCoordsToCursorWR(_xx11, _yy11, _rect1.Page, undefined, false);
			pos2 = this.ConvertCoordsToCursorWR(_xx12, _yy12, _rect1.Page, undefined, false);

			pos3 = this.ConvertCoordsToCursorWR(_xx21, _yy21, _rect2.Page, undefined, false);
			pos4 = this.ConvertCoordsToCursorWR(_xx22, _yy22, _rect2.Page, undefined, false);

			ctx.strokeStyle = "#1B63BA";

			ctx.moveTo(pos1.X, pos1.Y);
			ctx.lineTo(pos2.X, pos2.Y);

			ctx.moveTo(pos3.X, pos3.Y);
			ctx.lineTo(pos4.X, pos4.Y);

			ctx.lineWidth = 2;
			ctx.stroke();

			/*
			 ctx.beginPath();

			 ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
			 overlay.AddEllipse(pos1.X, pos1.Y - 5, 6.5);
			 overlay.AddEllipse(pos4.X, pos4.Y + 5, 6.5);
			 ctx.fill();

			 ctx.beginPath();

			 ctx.fillStyle = "#FFFFFF";
			 overlay.AddEllipse(pos1.X, pos1.Y - 5, 6);
			 overlay.AddEllipse(pos4.X, pos4.Y + 5, 6);
			 ctx.fill();
			 */

			ctx.beginPath();

			ctx.fillStyle = "#1B63BA";
			overlay.AddEllipse(pos1.X, pos1.Y - 5, 5);
			overlay.AddEllipse(pos4.X, pos4.Y + 5, 5);
			ctx.fill();
		}
	}

	this.SelectShow = function ()
	{
		this.m_oWordControl.OnUpdateOverlay();
	}

	this.Set_RulerState_Start = function ()
	{
		this.UpdateRulerStateFlag = true;
	}
	this.Set_RulerState_End = function ()
	{
		if (this.UpdateRulerStateFlag)
		{
			this.UpdateRulerStateFlag = false;
			if (this.UpdateRulerStateParams.length > 0)
			{
				switch (this.UpdateRulerStateParams[0])
				{
					case 0:
					{
						this.Set_RulerState_Table(this.UpdateRulerStateParams[1],
							this.UpdateRulerStateParams[2]);
						break;
					}
					case 1:
					{
						this.Set_RulerState_Paragraph(this.UpdateRulerStateParams[1],
							this.UpdateRulerStateParams[2]);
						break;
					}
					case 2:
					{
						this.Set_RulerState_HdrFtr(this.UpdateRulerStateParams[1],
							this.UpdateRulerStateParams[2],
							this.UpdateRulerStateParams[3]);
						break;
					}
					case 3:
					{
						this.Set_RulerState_Columns(this.UpdateRulerStateParams[1]);
						break;
					}
					default:
						break;
				}

				this.UpdateRulerStateParams = [];
			}
		}
	}

	this.Set_RulerState_Table = function (markup, transform)
	{
		if (this.UpdateRulerStateFlag)
		{
			this.UpdateRulerStateParams.splice(0, this.UpdateRulerStateParams.length);
			this.UpdateRulerStateParams.push(0);
			this.UpdateRulerStateParams.push(markup);
			this.UpdateRulerStateParams.push(transform);
			return;
		}

		this.FrameRect.IsActive = false;

		var hor_ruler = this.m_oWordControl.m_oHorRuler;
		var ver_ruler = this.m_oWordControl.m_oVerRuler;

		hor_ruler.CurrentObjectType = RULER_OBJECT_TYPE_TABLE;
		hor_ruler.m_oTableMarkup = markup.CreateDublicate();

		ver_ruler.CurrentObjectType = RULER_OBJECT_TYPE_TABLE;
		ver_ruler.m_oTableMarkup = markup.CreateDublicate();

		this.TableOutlineDr.TableMatrix = null;
		this.TableOutlineDr.CurrentPageIndex = this.m_lCurrentPage;
		if (transform)
		{
			hor_ruler.m_oTableMarkup.TransformX = transform.tx;
			hor_ruler.m_oTableMarkup.TransformY = transform.ty;

			ver_ruler.m_oTableMarkup.TransformX = transform.tx;
			ver_ruler.m_oTableMarkup.TransformY = transform.ty;

			hor_ruler.m_oTableMarkup.CorrectFrom();
			ver_ruler.m_oTableMarkup.CorrectFrom();

			this.TableOutlineDr.TableMatrix = transform.CreateDublicate();
		}

		hor_ruler.CalculateMargins();

		if (0 <= this.m_lCurrentPage && this.m_lCurrentPage < this.m_lPagesCount)
		{
			hor_ruler.CreateBackground(this.m_arrPages[this.m_lCurrentPage]);
			ver_ruler.CreateBackground(this.m_arrPages[this.m_lCurrentPage]);
		}

		this.m_oWordControl.UpdateHorRuler();
		this.m_oWordControl.UpdateVerRuler();

		if (this.m_oWordControl.MobileTouchManager)
		{
			this.m_oWordControl.MobileTouchManager.TableStartTrack_Check = true;
			markup.Table.Start_TrackTable();
			this.m_oWordControl.MobileTouchManager.TableStartTrack_Check = false;
		}
	}

	this.Set_RulerState_Paragraph = function (margins, isCanTrackMargins)
	{
		if (this.UpdateRulerStateFlag)
		{
			this.UpdateRulerStateParams.splice(0, this.UpdateRulerStateParams.length);
			this.UpdateRulerStateParams.push(1);
			this.UpdateRulerStateParams.push(margins);
			this.UpdateRulerStateParams.push(isCanTrackMargins);
			return;
		}

		if (margins && margins.Frame !== undefined)
		{
			var bIsUpdate = false;

			if (!this.FrameRect.IsActive)
				bIsUpdate = true;

			if (!bIsUpdate)
			{
				if (this.FrameRect.Rect.X != margins.L ||
					this.FrameRect.Rect.Y != margins.T ||
					this.FrameRect.Rect.R != margins.R ||
					this.FrameRect.Rect.B != margins.B ||
					this.FrameRect.PageIndex != margins.PageIndex)
				{
					bIsUpdate = true;
				}
			}

			this.FrameRect.IsActive = true;
			this.FrameRect.Rect.X = margins.L;
			this.FrameRect.Rect.Y = margins.T;
			this.FrameRect.Rect.R = margins.R;
			this.FrameRect.Rect.B = margins.B;
			this.FrameRect.PageIndex = margins.PageIndex;
			this.FrameRect.Frame = margins.Frame;

			if (bIsUpdate)
			{
				if (this.m_oWordControl.m_oOverlay.HtmlElement.style.display != "block")
					this.m_oWordControl.ShowOverlay();

				this.m_oWordControl.OnUpdateOverlay();
			}
		}
		else
		{
			if (this.FrameRect.IsActive)
			{
				if (this.m_oWordControl.m_oOverlay.HtmlElement.style.display != "block")
					this.m_oWordControl.ShowOverlay();

				this.FrameRect.IsActive = false;
				this.m_oWordControl.OnUpdateOverlay();
			}
			else
				this.FrameRect.IsActive = false;
		}

		var hor_ruler = this.m_oWordControl.m_oHorRuler;
		var ver_ruler = this.m_oWordControl.m_oVerRuler;

		if (hor_ruler.CurrentObjectType == RULER_OBJECT_TYPE_PARAGRAPH && ver_ruler.CurrentObjectType == RULER_OBJECT_TYPE_PARAGRAPH)
		{
			if ((margins && !hor_ruler.IsCanMoveMargins) || (!margins && hor_ruler.IsCanMoveMargins))
			{
				var bIsNeedUpdate = false;
				if (margins && this.LastParagraphMargins)
				{
					if (margins.L != this.LastParagraphMargins.L ||
						margins.T != this.LastParagraphMargins.T ||
						margins.R != this.LastParagraphMargins.R ||
						margins.B != this.LastParagraphMargins.B)
					{
						bIsNeedUpdate = true;
					}
				}

				if (!bIsNeedUpdate)
					return;
			}
		}

		hor_ruler.CurrentObjectType = RULER_OBJECT_TYPE_PARAGRAPH;
		hor_ruler.m_oTableMarkup = null;
		hor_ruler.m_oColumnMarkup = null;

		ver_ruler.CurrentObjectType = RULER_OBJECT_TYPE_PARAGRAPH;
		ver_ruler.m_oTableMarkup = null;

		// вообще надо посмотреть... может и был параграф до этого.
		// тогда вэкграунд перерисовывать не нужно. Только надо знать, на той же странице это было или нет
		if (-1 != this.m_lCurrentPage)
		{
			if (margins)
			{
				var cachedPage = {};
				cachedPage.width_mm = this.m_arrPages[this.m_lCurrentPage].width_mm;
				cachedPage.height_mm = this.m_arrPages[this.m_lCurrentPage].height_mm;

				cachedPage.margin_left = margins.L;
				cachedPage.margin_top = margins.T;
				cachedPage.margin_right = margins.R;
				cachedPage.margin_bottom = margins.B;

				hor_ruler.CreateBackground(cachedPage);
				ver_ruler.CreateBackground(cachedPage);

				// disable margins
				if (true !== isCanTrackMargins)
				{
					hor_ruler.IsCanMoveMargins = false;
					ver_ruler.IsCanMoveMargins = false;
				}
				else
				{
					hor_ruler.IsCanMoveMargins = true;
					ver_ruler.IsCanMoveMargins = true;
				}

				this.LastParagraphMargins = {};
				this.LastParagraphMargins.L = margins.L;
				this.LastParagraphMargins.T = margins.T;
				this.LastParagraphMargins.R = margins.R;
				this.LastParagraphMargins.B = margins.B;
			}
			else
			{
				hor_ruler.CreateBackground(this.m_arrPages[this.m_lCurrentPage]);
				ver_ruler.CreateBackground(this.m_arrPages[this.m_lCurrentPage]);

				// enable margins
				hor_ruler.IsCanMoveMargins = true;
				ver_ruler.IsCanMoveMargins = true;

				this.LastParagraphMargins = null;
			}
		}

		this.m_oWordControl.UpdateHorRuler();
		this.m_oWordControl.UpdateVerRuler();
	}

	this.Set_RulerState_Columns = function (markup)
	{
		if (this.UpdateRulerStateFlag)
		{
			this.UpdateRulerStateParams.splice(0, this.UpdateRulerStateParams.length);
			this.UpdateRulerStateParams.push(3);
			this.UpdateRulerStateParams.push(markup);
			return;
		}

		this.FrameRect.IsActive = false;

		var hor_ruler = this.m_oWordControl.m_oHorRuler;
		var ver_ruler = this.m_oWordControl.m_oVerRuler;

		hor_ruler.CurrentObjectType = RULER_OBJECT_TYPE_COLUMNS;
		hor_ruler.m_oTableMarkup = null;
		hor_ruler.m_oColumnMarkup = markup.CreateDuplicate();

		ver_ruler.CurrentObjectType = RULER_OBJECT_TYPE_PARAGRAPH;
		ver_ruler.m_oTableMarkup = null;

		this.TableOutlineDr.TableMatrix = null;
		this.TableOutlineDr.CurrentPageIndex = this.m_lCurrentPage;

		hor_ruler.CalculateMargins();

		if (0 <= this.m_lCurrentPage && this.m_lCurrentPage < this.m_lPagesCount)
		{
			hor_ruler.CreateBackground(this.m_arrPages[this.m_lCurrentPage]);
			ver_ruler.CreateBackground(this.m_arrPages[this.m_lCurrentPage]);
		}

		this.m_oWordControl.UpdateHorRuler();
		this.m_oWordControl.UpdateVerRuler();
	};

	this.Set_RulerState_HdrFtr = function (bHeader, Y0, Y1)
	{
		if (this.UpdateRulerStateFlag)
		{
			this.UpdateRulerStateParams.splice(0, this.UpdateRulerStateParams.length);
			this.UpdateRulerStateParams.push(2);
			this.UpdateRulerStateParams.push(bHeader);
			this.UpdateRulerStateParams.push(Y0);
			this.UpdateRulerStateParams.push(Y1);
			return;
		}

		this.FrameRect.IsActive = false;

		var hor_ruler = this.m_oWordControl.m_oHorRuler;
		var ver_ruler = this.m_oWordControl.m_oVerRuler;

		hor_ruler.CurrentObjectType = RULER_OBJECT_TYPE_PARAGRAPH;
		hor_ruler.m_oTableMarkup = null;
		hor_ruler.m_oColumnMarkup = null;

		ver_ruler.CurrentObjectType = (true === bHeader) ? RULER_OBJECT_TYPE_HEADER : RULER_OBJECT_TYPE_FOOTER;
		ver_ruler.header_top = Y0;
		ver_ruler.header_bottom = Y1;
		ver_ruler.m_oTableMarkup = null;

		// вообще надо посмотреть... может и бал параграф до этого.
		// тогда вэкграунд перерисовывать не нужно. Только надо знать, на той же странице это было или нет
		if (-1 != this.m_lCurrentPage)
		{
			hor_ruler.CreateBackground(this.m_arrPages[this.m_lCurrentPage]);
			ver_ruler.CreateBackground(this.m_arrPages[this.m_lCurrentPage]);
		}

		this.m_oWordControl.UpdateHorRuler();
		this.m_oWordControl.UpdateVerRuler();
	}

	this.Update_MathTrack = function (IsActive, IsContentActive, oMath)
	{
		this.MathRect.IsActive = IsActive;

		if (true === IsActive && null !== oMath)
		{
			var selectBounds = true === IsContentActive ? oMath.Get_ContentSelection() : null;
			if (selectBounds != null)
			{
				var SelectPolygon = new CPolygon();
				SelectPolygon.fill(selectBounds);
				this.MathSelectPolygons = SelectPolygon.GetPaths(0);
			}
			else
			{
				this.MathSelectPolygons.length = 0;
			}

			var arrBounds = oMath.Get_Bounds();

			if (arrBounds.length <= 0)
				return;

			var MPolygon = new CPolygon();
			MPolygon.fill(arrBounds);

			var PixelError = this.GetMMPerDot(1) * 3;
			this.MathPolygons = MPolygon.GetPaths(PixelError);
		}
	};

	this.Update_FieldTrack = function (IsActive, aRects)
	{
		this.FieldTrack.IsActive = IsActive;

		if (true === IsActive)
			this.FieldTrack.Rects = aRects;
		else
			this.FieldTrack.Rects = [];
	};

	this.Update_ParaTab = function (Default_Tab, ParaTabs)
	{
		var hor_ruler = this.m_oWordControl.m_oHorRuler;

		var __tabs = ParaTabs.Tabs;
		if (undefined === __tabs)
			__tabs = ParaTabs;

		var _len = __tabs.length;
		if ((Default_Tab == hor_ruler.m_dDefaultTab) && (hor_ruler.m_arrTabs.length == _len) && (_len == 0))
		{
			// потом можно и проверить сами табы
			return;
		}

		hor_ruler.m_dDefaultTab = Default_Tab;
		hor_ruler.m_arrTabs = [];
		var _ar = hor_ruler.m_arrTabs;

		for (var i = 0; i < _len; i++)
		{
			if (__tabs[i].Value == tab_Left)
				_ar[i] = new CTab(__tabs[i].Pos, AscCommon.g_tabtype_left);
			else if (__tabs[i].Value == tab_Center)
				_ar[i] = new CTab(__tabs[i].Pos, AscCommon.g_tabtype_center);
			else if (__tabs[i].Value == tab_Right)
				_ar[i] = new CTab(__tabs[i].Pos, AscCommon.g_tabtype_right);
			else
			{
				// не должно такого быть. но приходит
				_ar[i] = new CTab(__tabs[i].Pos, AscCommon.g_tabtype_left);
			}
		}

		hor_ruler.CorrectTabs();
		this.m_oWordControl.UpdateHorRuler();
	}

	this.CorrectRulerPosition = function (pos)
	{
		if (AscCommon.global_keyboardEvent.AltKey)
			return pos;

		return ((pos / 2.5 + 0.5) >> 0) * 2.5;
	}

	this.UpdateTableRuler = function (isCols, index, position)
	{
		var dKoef_mm_to_pix = g_dKoef_mm_to_pix * this.m_oWordControl.m_nZoomValue / 100;
		if (false === isCols)
		{
			var markup = this.m_oWordControl.m_oVerRuler.m_oTableMarkup;
			if (markup == null)
				return;

			position += markup.TransformY;
			if (0 == index)
			{
				var delta = position - markup.Rows[0].Y;
				markup.Rows[0].Y = position;
				markup.Rows[0].H -= delta;
			}
			else
			{
				var delta = (markup.Rows[index - 1].Y + markup.Rows[index - 1].H) - position;

				markup.Rows[index - 1].H -= delta;

				if (index != markup.Rows.length)
				{
					markup.Rows[index].Y -= delta;
					markup.Rows[index].H += delta;
				}
			}

			if ("none" == this.m_oWordControl.m_oOverlay.HtmlElement.style.display)
				this.m_oWordControl.ShowOverlay();

			this.m_oWordControl.UpdateVerRulerBack();
			this.m_oWordControl.m_oOverlayApi.HorLine(this.m_arrPages[this.m_lCurrentPage].drawingPage.top + position * dKoef_mm_to_pix);
		}
		else
		{
			var markup = this.m_oWordControl.m_oHorRuler.m_oTableMarkup;
			if (markup == null)
				return;

			position += markup.TransformX;

			if (0 == index)
			{
				var _add = markup.X - position;
				markup.X = position;
				if (markup.Cols.length > 0)
					markup.Cols[0] += _add;
			}
			else
			{
				var _start = markup.X;
				for (var i = 0; i < (index - 1); i++)
				{
					_start += markup.Cols[i];
				}

				var _old = markup.Cols[index - 1];
				markup.Cols[index - 1] = position - _start;

				if (index != markup.Cols.length)
				{
					markup.Cols[index] += (_old - markup.Cols[index - 1]);
				}
			}

			if ("none" == this.m_oWordControl.m_oOverlay.HtmlElement.style.display)
				this.m_oWordControl.ShowOverlay();

			this.m_oWordControl.UpdateHorRulerBack();
			this.m_oWordControl.m_oOverlayApi.VertLine(this.m_arrPages[this.m_lCurrentPage].drawingPage.left + position * dKoef_mm_to_pix);
		}
	}
	this.GetDotsPerMM = function (value)
	{
		return value * this.m_oWordControl.m_nZoomValue * g_dKoef_mm_to_pix / 100;
	}

	this.GetMMPerDot = function (value)
	{
		return value / this.GetDotsPerMM(1);
	}
	this.GetVisibleMMHeight = function ()
	{
		var pixHeigth = this.m_oWordControl.m_oEditor.HtmlElement.height;
		if (this.m_oWordControl.bIsRetinaSupport)
			pixHeigth /= AscCommon.AscBrowser.retinaPixelRatio;
		var pixBetweenPages = 20 * (this.m_lDrawingEnd - this.m_lDrawingFirst);

		return (pixHeigth - pixBetweenPages) * g_dKoef_pix_to_mm * 100 / this.m_oWordControl.m_nZoomValue;
	}

	// вот оооочень важная функция. она выкидывает из кэша неиспользуемые шрифты
	this.CheckFontCache = function ()
	{
		var map_used = this.m_oWordControl.m_oLogicDocument.Document_CreateFontMap();

		var _measure_map = g_oTextMeasurer.m_oManager.m_oFontsCache.Fonts;
		var _drawing_map = AscCommon.g_fontManager.m_oFontsCache.Fonts;

		var map_keys = {};
		var api = this.m_oWordControl.m_oApi;
		for (var i in map_used)
		{
			var key = AscFonts.GenerateMapId(api, g_fontApplication.GetFontInfoName(map_used[i].Name), map_used[i].Style, map_used[i].Size);
			map_keys[key] = true;
		}

		// а теперь просто пробегаем по кэшам и удаляем ненужное
		for (var i in _measure_map)
		{
			if (map_keys[i] == undefined)
			{
				//_measure_map[i] = undefined;
				delete _measure_map[i];
			}
		}
		for (var i in _drawing_map)
		{
			if (map_keys[i] == undefined)
			{
				//_drawing_map[i] = undefined;
				if (null != _drawing_map[i])
					_drawing_map[i].Destroy();
				delete _drawing_map[i];
			}
		}
	}

	// при загрузке документа - нужно понять какие шрифты используются
	this.CheckFontNeeds = function ()
	{
		var map_keys = this.m_oWordControl.m_oLogicDocument.Document_Get_AllFontNames();
		var dstfonts = [];
		for (var i in map_keys)
		{
			dstfonts[dstfonts.length] = new AscFonts.CFont(i, 0, "", 0, null);
		}
		this.m_oWordControl.m_oLogicDocument.Fonts = dstfonts;
		return;

		/*
		 var map_used = this.m_oWordControl.m_oLogicDocument.Document_CreateFontMap();

		 var map_keys = {};
		 for (var i in map_used)
		 {
		 var search = map_used[i];
		 var found = map_keys[search.Name];

		 var _need_style = 0;
		 switch (search.Style)
		 {
		 case FontStyle.FontStyleRegular:
		 {
		 _need_style = fontstyle_mask_regular;
		 break;
		 }
		 case FontStyle.FontStyleBold:
		 {
		 _need_style = fontstyle_mask_bold;
		 break;
		 }
		 case FontStyle.FontStyleItalic:
		 {
		 _need_style = fontstyle_mask_italic;
		 break;
		 }
		 case FontStyle.FontStyleBoldItalic:
		 {
		 _need_style = fontstyle_mask_bolditalic;
		 break;
		 }
		 default:
		 {
		 _need_style = fontstyle_mask_regular | fontstyle_mask_italic | fontstyle_mask_bold | fontstyle_mask_bolditalic;
		 break;
		 }
		 }

		 if (undefined === found)
		 {
		 map_keys[search.Name] = _need_style;
		 }
		 else
		 {
		 map_keys[search.Name] |= _need_style;
		 }
		 }

		 // теперь просто пробегаем и заполняем все объектами
		 var dstfonts = [];
		 for (var i in map_keys)
		 {
		 dstfonts[dstfonts.length] = new CFont(i, 0, "", 0, map_keys[i]);
		 }
		 this.m_oWordControl.m_oLogicDocument.Fonts = dstfonts;
		 */
	}

	// фукнции для старта работы
	this.OpenDocument = function ()
	{
		//SetHintsProps(false, false);
		this.m_oDocumentRenderer.InitDocument(this);

		this.m_oWordControl.CalculateDocumentSize();
		this.m_oWordControl.OnScroll();
	}

	// вот здесь весь трекинг
	this.DrawTrack = function (type, matrix, left, top, width, height, isLine, canRotate, isNoMove)
	{
		this.AutoShapesTrack.DrawTrack(type, matrix, left, top, width, height, isLine, canRotate, isNoMove);
	}

	this.DrawTrackSelectShapes = function (x, y, w, h)
	{
		this.AutoShapesTrack.DrawTrackSelectShapes(x, y, w, h);
	}

	this.DrawAdjustment = function (matrix, x, y, bTextWarp)
	{
		this.AutoShapesTrack.DrawAdjustment(matrix, x, y, bTextWarp);
	}

	this.LockTrackPageNum = function (nPageNum)
	{
		this.AutoShapesTrackLockPageNum = nPageNum;
	}
	this.UnlockTrackPageNum = function ()
	{
		this.AutoShapesTrackLockPageNum = -1;
	}

	this.CheckGuiControlColors = function ()
	{
		// потом реализовать проверку на то, что нужно ли посылать
		var _theme = this.m_oWordControl.m_oLogicDocument.theme;
		var _clrMap = this.m_oWordControl.m_oLogicDocument.clrSchemeMap.color_map;

		var arr_colors = new Array(10);
		var rgba = {R: 0, G: 0, B: 0, A: 255};
		// bg1,tx1,bg2,tx2,accent1 - accent6
		var array_colors_types = [6, 15, 7, 16, 0, 1, 2, 3, 4, 5];
		var _count = array_colors_types.length;

		var color = new AscFormat.CUniColor();
		color.color = new AscFormat.CSchemeColor();
		for (var i = 0; i < _count; ++i)
		{
			color.color.id = array_colors_types[i];
			color.Calculate(_theme, _clrMap, rgba);

			var _rgba = color.RGBA;
			arr_colors[i] = new CColor(_rgba.R, _rgba.G, _rgba.B);
		}

		// теперь проверим
		var bIsSend = false;
		if (this.GuiControlColorsMap != null)
		{
			for (var i = 0; i < _count; ++i)
			{
				var _color1 = this.GuiControlColorsMap[i];
				var _color2 = arr_colors[i];

				if ((_color1.r != _color2.r) || (_color1.g != _color2.g) || (_color1.b != _color2.b))
				{
					bIsSend = true;
					break;
				}
			}
		}
		else
		{
			this.GuiControlColorsMap = new Array(_count);
			bIsSend = true;
		}

		if (bIsSend)
		{
			for (var i = 0; i < _count; ++i)
			{
				this.GuiControlColorsMap[i] = arr_colors[i];
			}

			this.SendControlColors();
		}
	}

	this.SendControlColors = function ()
	{
		var standart_colors = null;
		if (!this.IsSendStandartColors)
		{
			var standartColors = AscCommon.g_oStandartColors;
			var _c_s = standartColors.length;
			standart_colors = new Array(_c_s);

			for (var i = 0; i < _c_s; ++i)
			{
				standart_colors[i] = new CColor(standartColors[i].R, standartColors[i].G, standartColors[i].B);
			}

			this.IsSendStandartColors = true;
		}

		var _count = this.GuiControlColorsMap.length;

		var _ret_array = new Array(_count * 6);
		var _cur_index = 0;

		for (var i = 0; i < _count; ++i)
		{
			var _color_src = this.GuiControlColorsMap[i];

			_ret_array[_cur_index] = new CColor(_color_src.r, _color_src.g, _color_src.b);
			_cur_index++;

			// теперь с модификаторами
			var _count_mods = 5;
			for (var j = 0; j < _count_mods; ++j)
			{
				var dst_mods = new AscFormat.CColorModifiers();
				dst_mods.Mods = AscCommon.GetDefaultMods(_color_src.r, _color_src.g, _color_src.b, j + 1, 1);

				var _rgba = {R: _color_src.r, G: _color_src.g, B: _color_src.b, A: 255};
				dst_mods.Apply(_rgba);

				_ret_array[_cur_index] = new CColor(_rgba.R, _rgba.G, _rgba.B);
				_cur_index++;
			}
		}

		this.m_oWordControl.m_oApi.sync_SendThemeColors(_ret_array, standart_colors);

		// regenerate styles
		if (null == this.m_oWordControl.m_oApi._gui_styles)
		{
			if (window["NATIVE_EDITOR_ENJINE"] === true)
			{
				if (!this.m_oWordControl.m_oApi.asc_checkNeedCallback("asc_onInitEditorStyles"))
					return;
			}
			var StylesPainter = new CStylesPainter();
			StylesPainter.GenerateStyles(this.m_oWordControl.m_oApi, this.m_oWordControl.m_oLogicDocument.Get_Styles().Style);
		}
	}

	this.DrawImageTextureFillShape = function (url)
	{
		if (this.GuiCanvasFillTexture == null)
		{
			this.InitGuiCanvasShape(this.GuiCanvasFillTextureParentId);
		}

		if (this.GuiCanvasFillTexture == null || this.GuiCanvasFillTextureCtx == null || url == this.LastDrawingUrl)
			return;

		this.LastDrawingUrl = url;
		var _width = this.GuiCanvasFillTexture.width;
		var _height = this.GuiCanvasFillTexture.height;

		this.GuiCanvasFillTextureCtx.clearRect(0, 0, _width, _height);

		if (null == this.LastDrawingUrl)
			return;

		var _img = this.m_oWordControl.m_oApi.ImageLoader.map_image_index[AscCommon.getFullImageSrc2(this.LastDrawingUrl)];
		if (_img != undefined && _img.Image != null && _img.Status != AscFonts.ImageLoadStatus.Loading)
		{
			var _x = 0;
			var _y = 0;
			var _w = Math.max(_img.Image.width, 1);
			var _h = Math.max(_img.Image.height, 1);

			var dAspect1 = _width / _height;
			var dAspect2 = _w / _h;

			_w = _width;
			_h = _height;
			if (dAspect1 >= dAspect2)
			{
				_w = dAspect2 * _height;
				_x = (_width - _w) / 2;
			}
			else
			{
				_h = _w / dAspect2;
				_y = (_height - _h) / 2;
			}

			this.GuiCanvasFillTextureCtx.drawImage(_img.Image, _x, _y, _w, _h);
		}
		else if (!_img || !_img.Image)
		{
			this.GuiCanvasFillTextureCtx.lineWidth = 1;

			this.GuiCanvasFillTextureCtx.beginPath();
			this.GuiCanvasFillTextureCtx.moveTo(0, 0);
			this.GuiCanvasFillTextureCtx.lineTo(_width, _height);
			this.GuiCanvasFillTextureCtx.moveTo(_width, 0);
			this.GuiCanvasFillTextureCtx.lineTo(0, _height);
			this.GuiCanvasFillTextureCtx.strokeStyle = "#FF0000";
			this.GuiCanvasFillTextureCtx.stroke();

			this.GuiCanvasFillTextureCtx.beginPath();
			this.GuiCanvasFillTextureCtx.moveTo(0, 0);
			this.GuiCanvasFillTextureCtx.lineTo(_width, 0);
			this.GuiCanvasFillTextureCtx.lineTo(_width, _height);
			this.GuiCanvasFillTextureCtx.lineTo(0, _height);
			this.GuiCanvasFillTextureCtx.closePath();

			this.GuiCanvasFillTextureCtx.strokeStyle = "#000000";
			this.GuiCanvasFillTextureCtx.stroke();
			this.GuiCanvasFillTextureCtx.beginPath();
		}
	}

	this.InitGuiCanvasShape = function (div_id)
	{
		if (null != this.GuiCanvasFillTexture)
		{
			var _div_elem = document.getElementById(this.GuiCanvasFillTextureParentId);
			if (_div_elem)
				_div_elem.removeChild(this.GuiCanvasFillTexture);

			this.GuiCanvasFillTexture = null;
			this.GuiCanvasFillTextureCtx = null;
		}

		this.GuiCanvasFillTextureParentId = div_id;
		var _div_elem = document.getElementById(this.GuiCanvasFillTextureParentId);
		if (!_div_elem)
			return;

		this.GuiCanvasFillTexture = document.createElement('canvas');
		this.GuiCanvasFillTexture.width = parseInt(_div_elem.style.width);
		this.GuiCanvasFillTexture.height = parseInt(_div_elem.style.height);

		this.LastDrawingUrl = "";
		this.GuiCanvasFillTextureCtx = this.GuiCanvasFillTexture.getContext('2d');

		_div_elem.appendChild(this.GuiCanvasFillTexture);
	}

	this.InitGuiCanvasTextProps = function (div_id)
	{
		var _div_elem = document.getElementById(div_id);
		if (null != this.GuiCanvasTextProps)
		{
			var elem = _div_elem.getElementsByTagName('canvas');
			if (elem.length == 0)
			{
				_div_elem.appendChild(this.GuiCanvasTextProps);
			}
			else
			{
				var _width = parseInt(_div_elem.offsetWidth);
				var _height = parseInt(_div_elem.offsetHeight);
				if (0 == _width)
					_width = 300;
				if (0 == _height)
					_height = 80;

				if (this.GuiCanvasTextProps.width != _width || this.GuiCanvasTextProps.height != _height)
				{
					this.GuiCanvasTextProps.width = _width;
					this.GuiCanvasTextProps.height = _height;
				}
			}
		}
		else
		{
			this.GuiCanvasTextProps = document.createElement('canvas');
			this.GuiCanvasTextProps.style.position = "absolute";
			this.GuiCanvasTextProps.style.left = "0px";
			this.GuiCanvasTextProps.style.top = "0px";

			var _width = parseInt(_div_elem.offsetWidth);
			var _height = parseInt(_div_elem.offsetHeight);
			if (0 == _width)
				_width = 300;
			if (0 == _height)
				_height = 80;

			this.GuiCanvasTextProps.width = _width;
			this.GuiCanvasTextProps.height = _height;

			_div_elem.appendChild(this.GuiCanvasTextProps);
		}
	}

	this.DrawGuiCanvasTextProps = function (props)
	{
		var bIsChange = false;
		if (null == this.GuiLastTextProps)
		{
			bIsChange = true;

			this.GuiLastTextProps = new Asc.asc_CParagraphProperty();

			this.GuiLastTextProps.Subscript = props.Subscript;
			this.GuiLastTextProps.Superscript = props.Superscript;
			this.GuiLastTextProps.SmallCaps = props.SmallCaps;
			this.GuiLastTextProps.AllCaps = props.AllCaps;
			this.GuiLastTextProps.Strikeout = props.Strikeout;
			this.GuiLastTextProps.DStrikeout = props.DStrikeout;

			this.GuiLastTextProps.TextSpacing = props.TextSpacing;
			this.GuiLastTextProps.Position = props.Position;
		}
		else
		{
			if (this.GuiLastTextProps.Subscript != props.Subscript)
			{
				this.GuiLastTextProps.Subscript = props.Subscript;
				bIsChange = true;
			}
			if (this.GuiLastTextProps.Superscript != props.Superscript)
			{
				this.GuiLastTextProps.Superscript = props.Superscript;
				bIsChange = true;
			}
			if (this.GuiLastTextProps.SmallCaps != props.SmallCaps)
			{
				this.GuiLastTextProps.SmallCaps = props.SmallCaps;
				bIsChange = true;
			}
			if (this.GuiLastTextProps.AllCaps != props.AllCaps)
			{
				this.GuiLastTextProps.AllCaps = props.AllCaps;
				bIsChange = true;
			}
			if (this.GuiLastTextProps.Strikeout != props.Strikeout)
			{
				this.GuiLastTextProps.Strikeout = props.Strikeout;
				bIsChange = true;
			}
			if (this.GuiLastTextProps.DStrikeout != props.DStrikeout)
			{
				this.GuiLastTextProps.DStrikeout = props.DStrikeout;
				bIsChange = true;
			}
			if (this.GuiLastTextProps.TextSpacing != props.TextSpacing)
			{
				this.GuiLastTextProps.TextSpacing = props.TextSpacing;
				bIsChange = true;
			}
			if (this.GuiLastTextProps.Position != props.Position)
			{
				this.GuiLastTextProps.Position = props.Position;
				bIsChange = true;
			}
		}

		if (undefined !== this.GuiLastTextProps.Position && isNaN(this.GuiLastTextProps.Position))
			this.GuiLastTextProps.Position = undefined;
		if (undefined !== this.GuiLastTextProps.TextSpacing && isNaN(this.GuiLastTextProps.TextSpacing))
			this.GuiLastTextProps.TextSpacing = undefined;

		if (!bIsChange)
			return;

		History.TurnOff();
		var _oldTurn = editor.isViewMode;
		editor.isViewMode = true;

		var par = new Paragraph(this, this.m_oWordControl.m_oLogicDocument);

		par.MoveCursorToStartPos();

		var _paraPr = new CParaPr();
		par.Pr = _paraPr;
		var _textPr = new CTextPr();
		_textPr.FontFamily = {Name: "Arial", Index: -1};

		_textPr.Strikeout = this.GuiLastTextProps.Strikeout;

		if (true === this.GuiLastTextProps.Subscript)
			_textPr.VertAlign = AscCommon.vertalign_SubScript;
		else if (true === this.GuiLastTextProps.Superscript)
			_textPr.VertAlign = AscCommon.vertalign_SuperScript;
		else
			_textPr.VertAlign = AscCommon.vertalign_Baseline;

		_textPr.DStrikeout = this.GuiLastTextProps.DStrikeout;
		_textPr.Caps = this.GuiLastTextProps.AllCaps;
		_textPr.SmallCaps = this.GuiLastTextProps.SmallCaps;

		_textPr.Spacing = this.GuiLastTextProps.TextSpacing;
		_textPr.Position = this.GuiLastTextProps.Position;

		var parRun = new ParaRun(par);
		var Pos = 0;
		parRun.Set_Pr(_textPr);
		parRun.Add_ToContent(Pos++, new ParaText("H"), false);
		parRun.Add_ToContent(Pos++, new ParaText("e"), false);
		parRun.Add_ToContent(Pos++, new ParaText("l"), false);
		parRun.Add_ToContent(Pos++, new ParaText("l"), false);
		parRun.Add_ToContent(Pos++, new ParaText("o"), false);
		parRun.Add_ToContent(Pos++, new ParaSpace(1), false);
		parRun.Add_ToContent(Pos++, new ParaText("W"), false);
		parRun.Add_ToContent(Pos++, new ParaText("o"), false);
		parRun.Add_ToContent(Pos++, new ParaText("r"), false);
		parRun.Add_ToContent(Pos++, new ParaText("l"), false);
		parRun.Add_ToContent(Pos++, new ParaText("d"), false);
		par.Add_ToContent(0, parRun);

		par.Reset(0, 0, 1000, 1000, 0, 0, 1);
		par.Recalculate_Page(0);

		var baseLineOffset = par.Lines[0].Y;
		var _bounds = par.Get_PageBounds(0);

		var ctx = this.GuiCanvasTextProps.getContext('2d');
		var _wPx = this.GuiCanvasTextProps.width;
		var _hPx = this.GuiCanvasTextProps.height;

		var _wMm = _wPx * g_dKoef_pix_to_mm;
		var _hMm = _hPx * g_dKoef_pix_to_mm;

		ctx.fillStyle = "#FFFFFF";
		ctx.fillRect(0, 0, _wPx, _hPx);

		var _pxBoundsW = par.Lines[0].Ranges[0].W * g_dKoef_mm_to_pix;//(_bounds.Right - _bounds.Left) * g_dKoef_mm_to_pix;
		var _pxBoundsH = (_bounds.Bottom - _bounds.Top) * g_dKoef_mm_to_pix;

		if (this.GuiLastTextProps.Position !== undefined && this.GuiLastTextProps.Position != null && this.GuiLastTextProps.Position != 0)
		{
			// TODO: нужна высота без учета Position
			// _pxBoundsH -= (this.GuiLastTextProps.Position * g_dKoef_mm_to_pix);
		}

		if (_pxBoundsH < _hPx && _pxBoundsW < _wPx)
		{
			// рисуем линию
			var _lineY = (((_hPx + _pxBoundsH) / 2) >> 0) + 0.5;
			var _lineW = (((_wPx - _pxBoundsW) / 4) >> 0);

			ctx.strokeStyle = "#000000";
			ctx.lineWidth = 1;

			ctx.beginPath();
			ctx.moveTo(0, _lineY);
			ctx.lineTo(_lineW, _lineY);

			ctx.moveTo(_wPx - _lineW, _lineY);
			ctx.lineTo(_wPx, _lineY);

			ctx.stroke();
			ctx.beginPath();
		}

		var _yOffset = (((_hPx + _pxBoundsH) / 2) - baseLineOffset * g_dKoef_mm_to_pix) >> 0;
		var _xOffset = ((_wPx - _pxBoundsW) / 2) >> 0;

		var graphics = new AscCommon.CGraphics();
		graphics.init(ctx, _wPx, _hPx, _wMm, _hMm);
		graphics.m_oFontManager = AscCommon.g_fontManager;

		graphics.m_oCoordTransform.tx = _xOffset;
		graphics.m_oCoordTransform.ty = _yOffset;

		graphics.transform(1, 0, 0, 1, 0, 0);

		var old_marks = this.m_oWordControl.m_oApi.ShowParaMarks;
		this.m_oWordControl.m_oApi.ShowParaMarks = false;
		par.Draw(0, graphics);
		this.m_oWordControl.m_oApi.ShowParaMarks = old_marks;

		History.TurnOn();
		editor.isViewMode = _oldTurn;
	}

	this.StartTableStylesCheck = function ()
	{
		this.TableStylesCheckLookFlag = true;
	}

	this.EndTableStylesCheck = function ()
	{
		this.TableStylesCheckLookFlag = false;
		if (this.TableStylesCheckLook != null)
		{
			this.CheckTableStyles(this.TableStylesCheckLook);
			this.TableStylesCheckLook = null;
		}
	}

	this.CheckTableStyles = function (tableLook)
	{
		if (this.TableStylesCheckLookFlag)
		{
			this.TableStylesCheckLook = tableLook;
			return;
		}

		// сначала проверим, подписан ли кто на этот евент
		// а то во вьюере не стоит ничего посылать
		if (!this.m_oWordControl.m_oApi.asc_checkNeedCallback("asc_onInitTableTemplates"))
			return;

		var bIsChanged = false;
		if (null == this.TableStylesLastLook)
		{
			this.TableStylesLastLook = new Asc.CTablePropLook();

			this.TableStylesLastLook.FirstCol = tableLook.FirstCol;
			this.TableStylesLastLook.FirstRow = tableLook.FirstRow;
			this.TableStylesLastLook.LastCol = tableLook.LastCol;
			this.TableStylesLastLook.LastRow = tableLook.LastRow;
			this.TableStylesLastLook.BandHor = tableLook.BandHor;
			this.TableStylesLastLook.BandVer = tableLook.BandVer;
			bIsChanged = true;
		}
		else
		{
			if (this.TableStylesLastLook.FirstCol != tableLook.FirstCol)
			{
				this.TableStylesLastLook.FirstCol = tableLook.FirstCol;
				bIsChanged = true;
			}
			if (this.TableStylesLastLook.FirstRow != tableLook.FirstRow)
			{
				this.TableStylesLastLook.FirstRow = tableLook.FirstRow;
				bIsChanged = true;
			}
			if (this.TableStylesLastLook.LastCol != tableLook.LastCol)
			{
				this.TableStylesLastLook.LastCol = tableLook.LastCol;
				bIsChanged = true;
			}
			if (this.TableStylesLastLook.LastRow != tableLook.LastRow)
			{
				this.TableStylesLastLook.LastRow = tableLook.LastRow;
				bIsChanged = true;
			}
			if (this.TableStylesLastLook.BandHor != tableLook.BandHor)
			{
				this.TableStylesLastLook.BandHor = tableLook.BandHor;
				bIsChanged = true;
			}
			if (this.TableStylesLastLook.BandVer != tableLook.BandVer)
			{
				this.TableStylesLastLook.BandVer = tableLook.BandVer;
				bIsChanged = true;
			}
		}

		if (!bIsChanged)
			return;

		var logicDoc = this.m_oWordControl.m_oLogicDocument;
		var _dst_styles = [];

		var _styles = logicDoc.Styles.Get_AllTableStyles();
		var _styles_len = _styles.length;

		if (_styles_len == 0)
			return _dst_styles;

		var _x_mar = 10;
		var _y_mar = 10;
		var _r_mar = 10;
		var _b_mar = 10;
		var _pageW = 297;
		var _pageH = 210;

		var W = (_pageW - _x_mar - _r_mar);
		var H = (_pageH - _y_mar - _b_mar);

		if (_canvas_tables == null)
		{
			_canvas_tables = document.createElement('canvas');

			if (!this.m_oWordControl.bIsRetinaSupport)
			{
				_canvas_tables.width = TABLE_STYLE_WIDTH_PIX;
				_canvas_tables.height = TABLE_STYLE_HEIGHT_PIX;
			}
			else
			{
				_canvas_tables.width = (TABLE_STYLE_WIDTH_PIX * AscCommon.AscBrowser.retinaPixelRatio) >> 0;
				_canvas_tables.height = (TABLE_STYLE_HEIGHT_PIX * AscCommon.AscBrowser.retinaPixelRatio) >> 0;
			}
		}

		var _canvas = _canvas_tables;
		var ctx = _canvas.getContext('2d');

		var Rows = 5;

		History.TurnOff();
		g_oTableId.m_bTurnOff = true;
		for (var i1 = 0; i1 < _styles_len; i1++)
		{
			var i = _styles[i1];
			var _style = logicDoc.Styles.Style[i];

			if (!_style || _style.Type != styletype_Table)
				continue;

			if (_table_styles == null)
			{
				var Cols = 5;

				var Grid = [];
				for (var ii = 0; ii < Cols; ii++)
					Grid[ii] = W / Cols;

				_table_styles = new CTable(this, logicDoc, true, Rows, Cols, Grid);
				_table_styles.Reset(_x_mar, _y_mar, 1000, 1000, 0, 0, 1);
				_table_styles.Set_Props({
					TableStyle: i,
					TableLook: tableLook,
					TableLayout: c_oAscTableLayout.Fixed
				});
				_table_styles.Set_Props({
					TableDefaultMargins : {Top : 0, Bottom : 0}
				});

				for (var j = 0; j < Rows; j++)
					_table_styles.Content[j].Set_Height(H / Rows, Asc.linerule_AtLeast);
			}
			else
			{
				_table_styles.Set_Props({
					TableStyle: i,
					TableLook: tableLook,
					TableLayout: c_oAscTableLayout.Fixed,
					CellSelect: false
				});
				_table_styles.Set_Props({
					TableDefaultMargins : {Top : 0, Bottom : 0}
				});
				_table_styles.Recalc_CompiledPr2();

				for (var j = 0; j < Rows; j++)
					_table_styles.Content[j].Set_Height(H / Rows, Asc.linerule_AtLeast);
			}


			ctx.fillStyle = "#FFFFFF";
			ctx.fillRect(0, 0, _canvas.width, _canvas.height);

			var graphics = new AscCommon.CGraphics();
			graphics.init(ctx, _canvas.width, _canvas.height, _pageW, _pageH);
			graphics.m_oFontManager = AscCommon.g_fontManager;
			graphics.transform(1, 0, 0, 1, 0, 0);

			_table_styles.Recalculate_Page(0);

			var _old_mode = editor.isViewMode;
			editor.isViewMode = true;
			editor.isShowTableEmptyLineAttack = true;
			_table_styles.Draw(0, graphics);
			editor.isShowTableEmptyLineAttack = false;
			editor.isViewMode = _old_mode;

			var _styleD = new Asc.CAscTableStyle();
			_styleD.Type = 0;
			_styleD.Image = _canvas.toDataURL("image/png");
			_styleD.Id = i;
			_dst_styles.push(_styleD);
		}
		g_oTableId.m_bTurnOff = false;
		History.TurnOn();

		this.m_oWordControl.m_oApi.sync_InitEditorTableStyles(_dst_styles, this.m_oWordControl.bIsRetinaSupport);
	}

	this.IsMobileVersion = function ()
	{
		if (this.m_oWordControl.MobileTouchManager)
			return true;
		return false;
	}

	this.OnSelectEnd = function ()
	{
		if (this.m_oWordControl && this.m_oWordControl.MobileTouchManager)
			this.m_oWordControl.MobileTouchManager.CheckSelectRects();
	}

	// mouse events
	this.checkMouseDown_Drawing = function (pos)
	{
		var oWordControl = this.m_oWordControl;
		var _ret = this.TableOutlineDr.checkMouseDown(pos, oWordControl);
		if (_ret === true)
		{
			oWordControl.m_oLogicDocument.RemoveSelection(true);
			this.TableOutlineDr.bIsTracked = true;
			this.LockCursorType("move");

			this.TableOutlineDr.TableOutline.Table.SelectAll();
			this.TableOutlineDr.TableOutline.Table.Document_SetThisElementCurrent(true);

			if (-1 == oWordControl.m_oTimerScrollSelect)
			{
				oWordControl.m_oTimerScrollSelect = setInterval(oWordControl.SelectWheel, 20);
			}
			oWordControl.EndUpdateOverlay();
			return true;
		}

		if (this.FrameRect.IsActive)
		{
			var eps = 10 * g_dKoef_pix_to_mm * 100 / oWordControl.m_nZoomValue;
			var _check = this.checkCursorOnTrackRect(pos.X, pos.Y, eps, this.FrameRect.Rect);

			if (-1 != _check)
			{
				this.FrameRect.IsTracked = true;
				this.FrameRect.Track.X = pos.X;
				this.FrameRect.Track.Y = pos.Y;
				this.FrameRect.Track.Type = _check;

				switch (_check)
				{
					case 0:
					{
						this.LockCursorType("nw-resize");
						break;
					}
					case 1:
					{
						this.LockCursorType("n-resize");
						break;
					}
					case 2:
					{
						this.LockCursorType("ne-resize");
						break;
					}
					case 3:
					{
						this.LockCursorType("e-resize");
						break;
					}
					case 4:
					{
						this.LockCursorType("se-resize");
						break;
					}
					case 5:
					{
						this.LockCursorType("s-resize");
						break;
					}
					case 6:
					{
						this.LockCursorType("sw-resize");
						break;
					}
					case 7:
					{
						this.LockCursorType("w-resize");
						break;
					}
					default:
					{
						this.LockCursorType("move");
						break;
					}
				}

				if (-1 == oWordControl.m_oTimerScrollSelect)
				{
					oWordControl.m_oTimerScrollSelect = setInterval(oWordControl.SelectWheel, 20);
				}
				oWordControl.EndUpdateOverlay();
				return true;
			}
		}

		return false;
	}

	this.checkMouseMove_Drawing = function (pos)
	{
		var oWordControl = this.m_oWordControl;
		if (this.TableOutlineDr.bIsTracked)
		{
			this.TableOutlineDr.checkMouseMove(global_mouseEvent.X, global_mouseEvent.Y, oWordControl);
			oWordControl.ShowOverlay();
			oWordControl.OnUpdateOverlay();
			oWordControl.EndUpdateOverlay();
			return true;
		}

		if (this.InlineTextTrackEnabled)
		{
			this.InlineTextTrack = oWordControl.m_oLogicDocument.Get_NearestPos(pos.Page, pos.X, pos.Y);
			this.InlineTextTrackPage = pos.Page;

			oWordControl.ShowOverlay();
			oWordControl.OnUpdateOverlay();
			oWordControl.EndUpdateOverlay();
			return true;
		}

		if (this.FrameRect.IsActive)
		{
			if (!this.FrameRect.IsTracked && this.FrameRect.PageIndex == pos.Page)
			{
				var eps = 10 * g_dKoef_pix_to_mm * 100 / oWordControl.m_nZoomValue;
				var _check = this.checkCursorOnTrackRect(pos.X, pos.Y, eps, this.FrameRect.Rect);

				if (_check != -1)
				{
					switch (_check)
					{
						case 0:
						{
							this.SetCursorType("nw-resize");
							break;
						}
						case 1:
						{
							this.SetCursorType("n-resize");
							break;
						}
						case 2:
						{
							this.SetCursorType("ne-resize");
							break;
						}
						case 3:
						{
							this.SetCursorType("e-resize");
							break;
						}
						case 4:
						{
							this.SetCursorType("se-resize");
							break;
						}
						case 5:
						{
							this.SetCursorType("s-resize");
							break;
						}
						case 6:
						{
							this.SetCursorType("sw-resize");
							break;
						}
						case 7:
						{
							this.SetCursorType("w-resize");
							break;
						}
						default:
						{
							this.SetCursorType("move");
							break;
						}
					}
					// оверлей не нужно перерисовывать
					oWordControl.EndUpdateOverlay();
					return true;
				}
			}
			else
			{
				this.checkTrackRect(pos);

				oWordControl.ShowOverlay();
				oWordControl.OnUpdateOverlay();
				oWordControl.EndUpdateOverlay();
				return true;
			}
		}

		return false;
	}

	this.checkMouseUp_Drawing = function (pos)
	{
		var oWordControl = this.m_oWordControl;
		if (this.TableOutlineDr.bIsTracked)
		{
			this.TableOutlineDr.checkMouseUp(global_mouseEvent.X, global_mouseEvent.Y, oWordControl);
			oWordControl.m_oLogicDocument.Document_UpdateInterfaceState();
			oWordControl.m_oLogicDocument.Document_UpdateRulersState();

			if (-1 != oWordControl.m_oTimerScrollSelect)
			{
				clearInterval(oWordControl.m_oTimerScrollSelect);
				oWordControl.m_oTimerScrollSelect = -1;
			}
			oWordControl.OnUpdateOverlay();

			oWordControl.EndUpdateOverlay();
			return true;
		}

		if (this.InlineTextTrackEnabled)
		{
			this.InlineTextTrack = oWordControl.m_oLogicDocument.Get_NearestPos(pos.Page, pos.X, pos.Y);
			this.InlineTextTrackPage = pos.Page;
			this.EndTrackText();

			oWordControl.ShowOverlay();
			oWordControl.OnUpdateOverlay();
			oWordControl.EndUpdateOverlay();
			return true;
		}

		if (this.FrameRect.IsActive && this.FrameRect.IsTracked)
		{
			this.FrameRect.IsTracked = false;

			this.checkTrackRect(pos);
			var _track = this.FrameRect.Track;
			this.FrameRect.Frame.Change_Frame(_track.L, _track.T, _track.R - _track.L, _track.B - _track.T, _track.PageIndex);

			if (-1 != oWordControl.m_oTimerScrollSelect)
			{
				clearInterval(oWordControl.m_oTimerScrollSelect);
				oWordControl.m_oTimerScrollSelect = -1;
			}
			oWordControl.OnUpdateOverlay();

			oWordControl.EndUpdateOverlay();
			return true;
		}

		return false;
	}

	this.checkCursorOnTrackRect = function (X, Y, eps, rect)
	{
		// 0-1-...-7 - точки по часовой стрелке, начиная с left-top,
		// 8-..-11 - стороны по часовой стрелке, начиная с top

		var __x_dist1 = Math.abs(X - rect.X);
		var __x_dist2 = Math.abs(X - ((rect.X + rect.R) / 2));
		var __x_dist3 = Math.abs(X - rect.R);

		var __y_dist1 = Math.abs(Y - rect.Y);
		var __y_dist2 = Math.abs(Y - ((rect.Y + rect.B) / 2));
		var __y_dist3 = Math.abs(Y - rect.B);

		if (__y_dist1 < eps)
		{
			if ((X < (rect.X - eps)) || (X > (rect.R + eps)))
				return -1;

			if (__x_dist1 <= __x_dist2 && __x_dist1 <= __x_dist3)
				return (__x_dist1 < eps) ? 0 : 8;

			if (__x_dist2 <= __x_dist1 && __x_dist2 <= __x_dist3)
				return (__x_dist2 < eps) ? 1 : 8;

			if (__x_dist3 <= __x_dist1 && __x_dist3 <= __x_dist2)
				return (__x_dist3 < eps) ? 2 : 8;

			return 8;
		}

		if (__y_dist3 < eps)
		{
			if ((X < (rect.X - eps)) || (X > (rect.R + eps)))
				return -1;

			if (__x_dist1 <= __x_dist2 && __x_dist1 <= __x_dist3)
				return (__x_dist1 < eps) ? 6 : 10;

			if (__x_dist2 <= __x_dist1 && __x_dist2 <= __x_dist3)
				return (__x_dist2 < eps) ? 5 : 10;

			if (__x_dist3 <= __x_dist1 && __x_dist3 <= __x_dist2)
				return (__x_dist3 < eps) ? 4 : 10;

			return 8;
		}

		if (__x_dist1 < eps)
		{
			if ((Y < (rect.Y - eps)) || (Y > (rect.B + eps)))
				return -1;

			if (__y_dist1 <= __y_dist2 && __y_dist1 <= __y_dist3)
				return (__y_dist1 < eps) ? 0 : 11;

			if (__y_dist2 <= __y_dist1 && __y_dist2 <= __y_dist3)
				return (__y_dist2 < eps) ? 7 : 11;

			if (__y_dist3 <= __y_dist1 && __y_dist3 <= __y_dist2)
				return (__y_dist3 < eps) ? 6 : 11;

			return 11;
		}

		if (__x_dist3 < eps)
		{
			if ((Y < (rect.Y - eps)) || (Y > (rect.B + eps)))
				return -1;

			if (__y_dist1 <= __y_dist2 && __y_dist1 <= __y_dist3)
				return (__y_dist1 < eps) ? 2 : 9;

			if (__y_dist2 <= __y_dist1 && __y_dist2 <= __y_dist3)
				return (__y_dist2 < eps) ? 3 : 9;

			if (__y_dist3 <= __y_dist1 && __y_dist3 <= __y_dist2)
				return (__y_dist3 < eps) ? 4 : 9;

			return 9;
		}

		return -1;
	}

	this.checkTrackRect = function (pos)
	{
		var _min_dist = 3; // mm;

		var _track = this.FrameRect.Track;
		var _rect = this.FrameRect.Rect;
		_track.PageIndex = this.FrameRect.PageIndex;
		switch (_track.Type)
		{
			case 0:
			{
				_track.L = _rect.X + (pos.X - _track.X);
				_track.T = _rect.Y + (pos.Y - _track.Y);
				_track.R = _rect.R;
				_track.B = _rect.B;

				if (_track.L > (_track.R - _min_dist))
					_track.L = _track.R - _min_dist;
				if (_track.T > (_track.B - _min_dist))
					_track.T = _track.B - _min_dist;

				break;
			}
			case 1:
			{
				_track.L = _rect.X;
				_track.T = _rect.Y + (pos.Y - _track.Y);
				_track.R = _rect.R;
				_track.B = _rect.B;

				if (_track.T > (_track.B - _min_dist))
					_track.T = _track.B - _min_dist;

				break;
			}
			case 2:
			{
				_track.L = _rect.X;
				_track.T = _rect.Y + (pos.Y - _track.Y);
				_track.R = _rect.R + (pos.X - _track.X);
				_track.B = _rect.B;

				if (_track.R < (_track.L + _min_dist))
					_track.R = _track.L + _min_dist;
				if (_track.T > (_track.B - _min_dist))
					_track.T = _track.B - _min_dist;

				break;
			}
			case 3:
			{
				_track.L = _rect.X;
				_track.T = _rect.Y;
				_track.R = _rect.R + (pos.X - _track.X);
				_track.B = _rect.B;

				if (_track.R < (_track.L + _min_dist))
					_track.R = _track.L + _min_dist;

				break;
			}
			case 4:
			{
				_track.L = _rect.X;
				_track.T = _rect.Y;
				_track.R = _rect.R + (pos.X - _track.X);
				_track.B = _rect.B + (pos.Y - _track.Y);

				if (_track.R < (_track.L + _min_dist))
					_track.R = _track.L + _min_dist;
				if (_track.B < (_track.T + _min_dist))
					_track.B = _track.T + _min_dist;

				break;
			}
			case 5:
			{
				_track.L = _rect.X;
				_track.T = _rect.Y;
				_track.R = _rect.R;
				_track.B = _rect.B + (pos.Y - _track.Y);

				if (_track.B < (_track.T + _min_dist))
					_track.B = _track.T + _min_dist;

				break;
			}
			case 6:
			{
				_track.L = _rect.X + (pos.X - _track.X);
				_track.T = _rect.Y;
				_track.R = _rect.R;
				_track.B = _rect.B + (pos.Y - _track.Y);

				if (_track.L > (_track.R - _min_dist))
					_track.L = _track.R - _min_dist;
				if (_track.B < (_track.T + _min_dist))
					_track.B = _track.T + _min_dist;

				break;
			}
			case 7:
			{
				_track.L = _rect.X + (pos.X - _track.X);
				_track.T = _rect.Y;
				_track.R = _rect.R;
				_track.B = _rect.B;

				if (_track.L > (_track.R - _min_dist))
					_track.L = _track.R - _min_dist;

				break;
			}
			default:
			{
				_track.L = pos.X - (_track.X - _rect.X);
				_track.T = pos.Y - (_track.Y - _rect.Y);
				_track.R = _track.L + _rect.R - _rect.X;
				_track.B = _track.T + _rect.B - _rect.Y;

				_track.PageIndex = pos.Page;
				break;
			}
		}
	}

	this.DrawVerAnchor = function (pageNum, xPos, bIsFromDrawings)
	{
		if (undefined === bIsFromDrawings)
		{
			if (this.m_oWordControl.m_oApi.ShowSnapLines)
			{
				this.HorVerAnchors.push({Type: 0, Page: pageNum, Pos: xPos});
			}
			return;
		}

		var _pos = this.ConvertCoordsToCursor4(xPos, 0, pageNum);
		if (_pos.Error === false)
		{
			this.m_oWordControl.m_oOverlayApi.DashLineColor = "#C8C8C8";
			this.m_oWordControl.m_oOverlayApi.VertLine2(_pos.X);
			this.m_oWordControl.m_oOverlayApi.DashLineColor = "#000000";
		}
	}

	this.DrawHorAnchor = function (pageNum, yPos, bIsFromDrawings)
	{
		if (undefined === bIsFromDrawings)
		{
			if (this.m_oWordControl.m_oApi.ShowSnapLines)
			{
				this.HorVerAnchors.push({Type: 1, Page: pageNum, Pos: yPos});
			}
			return;
		}

		var _pos = this.ConvertCoordsToCursor4(0, yPos, pageNum);
		if (_pos.Error === false)
		{
			this.m_oWordControl.m_oOverlayApi.DashLineColor = "#C8C8C8";
			this.m_oWordControl.m_oOverlayApi.HorLine2(_pos.Y);
			this.m_oWordControl.m_oOverlayApi.DashLineColor = "#000000";
		}
	}

	this.DrawHorVerAnchor = function ()
	{
		for (var i = 0; i < this.HorVerAnchors.length; i++)
		{
			var _anchor = this.HorVerAnchors[i];
			if (_anchor.Type == 0)
				this.DrawVerAnchor(_anchor.Page, _anchor.Pos, true);
			else
				this.DrawHorAnchor(_anchor.Page, _anchor.Pos, true);
		}
		this.HorVerAnchors.splice(0, this.HorVerAnchors.length);
	}

	// track text (inline)
	this.StartTrackText = function ()
	{
		this.InlineTextTrackEnabled = true;
		this.InlineTextTrack = null;
		this.InlineTextTrackPage = -1;
	}
	this.EndTrackText = function ()
	{
		this.InlineTextTrackEnabled = false;

		this.m_oWordControl.m_oLogicDocument.On_DragTextEnd(this.InlineTextTrack, AscCommon.global_keyboardEvent.CtrlKey);
		this.InlineTextTrack = null;
		this.InlineTextTrackPage = -1;
	}

	this.IsTrackText = function ()
	{
		return this.InlineTextTrackEnabled;
	}

	this.CancelTrackText = function ()
	{
		this.InlineTextTrackEnabled = false;
		this.InlineTextTrack = null;
		this.InlineTextTrackPage = -1;
	}

	this.SendMathToMenu = function ()
	{
		if (this.MathMenuLoad)
			return;

		// GENERATE_IMAGES
		//var _MathPainter = new CMathPainter(this.m_oWordControl.m_oApi);
		//_MathPainter.StartLoad();
		//return;

		var _MathPainter = new CMathPainter(this.m_oWordControl.m_oApi);
		_MathPainter.Generate();
		this.MathMenuLoad = true;
	};

	// collaborative targets
	this.Collaborative_UpdateTarget = function (_id, _shortId, _x, _y, _size, _page, _transform, is_from_paint)
	{
		if (is_from_paint !== true)
		{
			this.CollaborativeTargetsUpdateTasks.push([_id, _shortId, _x, _y, _size, _page, _transform]);
			return;
		}

		for (var i = 0; i < this.CollaborativeTargets.length; i++)
		{
			if (_id == this.CollaborativeTargets[i].Id)
			{
				this.CollaborativeTargets[i].CheckPosition(this, _x, _y, _size, _page, _transform);
				return;
			}
		}
		var _target = new CDrawingCollaborativeTarget();
		_target.Id = _id;
		_target.ShortId = _shortId;
		_target.CheckPosition(this, _x, _y, _size, _page, _transform);
		this.CollaborativeTargets[this.CollaborativeTargets.length] = _target;
	};
	this.Collaborative_RemoveTarget = function (_id)
	{
		for (var i = 0; i < this.CollaborativeTargets.length; i++)
		{
			if (_id == this.CollaborativeTargets[i].Id)
			{
				this.CollaborativeTargets[i].Remove(this);
				this.CollaborativeTargets.splice(i, 1);
			}
		}
	};
	this.Collaborative_TargetsUpdate = function (bIsChangePosition)
	{
		var _len_tasks = this.CollaborativeTargetsUpdateTasks.length;
		var i = 0;
		for (i = 0; i < _len_tasks; i++)
		{
			var _tmp = this.CollaborativeTargetsUpdateTasks[i];
			this.Collaborative_UpdateTarget(_tmp[0], _tmp[1], _tmp[2], _tmp[3], _tmp[4], _tmp[5], _tmp[6], true);
		}
		if (_len_tasks != 0)
			this.CollaborativeTargetsUpdateTasks.splice(0, _len_tasks);

		if (bIsChangePosition)
		{
			for (i = 0; i < this.CollaborativeTargets.length; i++)
			{
				this.CollaborativeTargets[i].Update(this);
			}
		}
	};
	this.Collaborative_GetTargetPosition = function (UserId)
	{
		for (var i = 0; i < this.CollaborativeTargets.length; i++)
		{
			if (UserId == this.CollaborativeTargets[i].Id)
				return {X: this.CollaborativeTargets[i].HtmlElementX, Y: this.CollaborativeTargets[i].HtmlElementY};
		}

		return null;
	};
}
function CStylesPainter()
{
	this.defaultStyles = null;
	this.docStyles = null;

	this.mergedStyles = null;

	this.STYLE_THUMBNAIL_WIDTH = GlobalSkin.STYLE_THUMBNAIL_WIDTH;
	this.STYLE_THUMBNAIL_HEIGHT = GlobalSkin.STYLE_THUMBNAIL_HEIGHT;

	this.CurrentTranslate = null;
	this.IsRetinaEnabled = false;
}
CStylesPainter.prototype =
{
	GenerateStyles: function (_api, ds)
	{
		var _oldX = this.STYLE_THUMBNAIL_WIDTH;
		var _oldY = this.STYLE_THUMBNAIL_HEIGHT;
		if (_api.WordControl.bIsRetinaSupport)
		{
			this.STYLE_THUMBNAIL_WIDTH 	= AscCommon.AscBrowser.convertToRetinaValue(this.STYLE_THUMBNAIL_WIDTH, true);
			this.STYLE_THUMBNAIL_HEIGHT = AscCommon.AscBrowser.convertToRetinaValue(this.STYLE_THUMBNAIL_HEIGHT, true);
			this.IsRetinaEnabled = true;
		}

		this.CurrentTranslate = _api.CurrentTranslate;

		this.GenerateDefaultStyles(_api, ds);
		this.GenerateDocumentStyles(_api);

		// стили сформированы. осталось просто сформировать единый список
		var _count_default = this.defaultStyles.length;
		var _count_doc = 0;
		if (null != this.docStyles)
			_count_doc = this.docStyles.length;

		var aPriorityStyles = [];
		var fAddToPriorityStyles = function (style)
		{
			var index = style.uiPriority;
			if (null == index)
				index = 0;
			var aSubArray = aPriorityStyles[index];
			if (null == aSubArray)
			{
				aSubArray = [];
				aPriorityStyles[index] = aSubArray;
			}
			aSubArray.push(style);
		}
		var _map_document = {};

		for (var i = 0; i < _count_doc; i++)
		{
			var style = this.docStyles[i];
			_map_document[style.Name] = 1;
			fAddToPriorityStyles(style);
		}

		for (var i = 0; i < _count_default; i++)
		{
			var style = this.defaultStyles[i];
			if (null == _map_document[style.Name])
				fAddToPriorityStyles(style);
		}

		this.mergedStyles = [];
		for (var index in aPriorityStyles)
		{
			var aSubArray = aPriorityStyles[index];
			aSubArray.sort(function (a, b)
			{
				if (a.Name < b.Name)
					return -1;
				else if (a.Name > b.Name)
					return 1;
				else
					return 0;
			});
			for (var i = 0, length = aSubArray.length; i < length; ++i)
			{
				this.mergedStyles.push(aSubArray[i]);
			}
		}

		if (_api.WordControl.bIsRetinaSupport)
		{
			this.STYLE_THUMBNAIL_WIDTH = _oldX;
			this.STYLE_THUMBNAIL_HEIGHT = _oldY;
		}

		// export
		this["STYLE_THUMBNAIL_WIDTH"] = this.STYLE_THUMBNAIL_WIDTH;
		this["STYLE_THUMBNAIL_HEIGHT"] = this.STYLE_THUMBNAIL_HEIGHT;

		// теперь просто отдаем евент наверх
		_api.sync_InitEditorStyles(this);
	},
	GenerateDefaultStyles: function (_api, ds)
	{
		var styles = ds;

		// добавили переводы => нельзя кэшировать
		var _canvas = document.createElement('canvas');
		_canvas.width = this.STYLE_THUMBNAIL_WIDTH;
		_canvas.height = this.STYLE_THUMBNAIL_HEIGHT;
		var ctx = _canvas.getContext('2d');

		ctx.fillStyle = "#FFFFFF";
		ctx.fillRect(0, 0, _canvas.width, _canvas.height);

		var graphics = new AscCommon.CGraphics();
		if (!this.IsRetinaEnabled)
		{
			graphics.init(ctx, _canvas.width, _canvas.height, _canvas.width * g_dKoef_pix_to_mm, _canvas.height * g_dKoef_pix_to_mm);
		}
		else
		{
			graphics.init(ctx, _canvas.width, _canvas.height,
				_canvas.width * g_dKoef_pix_to_mm / AscCommon.AscBrowser.retinaPixelRatio,
				_canvas.height * g_dKoef_pix_to_mm / AscCommon.AscBrowser.retinaPixelRatio);
		}
		graphics.m_oFontManager = AscCommon.g_fontManager;

		var DocumentStyles = _api.WordControl.m_oLogicDocument.Get_Styles();
		this.defaultStyles = [];
		for (var i in styles)
		{
			var style = styles[i];
			if (true == style.qFormat && null === DocumentStyles.Get_StyleIdByName(style.Name, false))
			{
				this.drawStyle(graphics, style);
				this.defaultStyles.push(new AscCommon.CStyleImage(style.Name, AscCommon.c_oAscStyleImage.Default, _canvas.toDataURL("image/png"), style.uiPriority));
			}
		}
	},

	GenerateDocumentStyles: function (_api)
	{
		if (_api.WordControl.m_oLogicDocument == null)
		{
			return;
		}

		var __Styles = _api.WordControl.m_oLogicDocument.Get_Styles();
		var styles = __Styles.Style;

		if (styles == null)
		{
			return;
		}

		var cur_index = 0;

		var _canvas = document.createElement('canvas');
		_canvas.width = this.STYLE_THUMBNAIL_WIDTH;
		_canvas.height = this.STYLE_THUMBNAIL_HEIGHT;
		var ctx = _canvas.getContext('2d');

		if (window["flat_desine"] !== true)
		{
			ctx.fillStyle = "#FFFFFF";
			ctx.fillRect(0, 0, _canvas.width, _canvas.height);
		}

		var graphics = new AscCommon.CGraphics();
		if (!this.IsRetinaEnabled)
		{
			graphics.init(ctx, _canvas.width, _canvas.height, _canvas.width * g_dKoef_pix_to_mm, _canvas.height * g_dKoef_pix_to_mm);
		}
		else
		{
			graphics.init(ctx, _canvas.width, _canvas.height,
				_canvas.width * g_dKoef_pix_to_mm / AscCommon.AscBrowser.retinaPixelRatio,
				_canvas.height * g_dKoef_pix_to_mm / AscCommon.AscBrowser.retinaPixelRatio);
		}
		graphics.m_oFontManager = AscCommon.g_fontManager;

		this.docStyles = [];
		for (var i in styles)
		{
			var style = styles[i];
			if (true == style.qFormat)
			{
				// как только меняется сериалайзер - меняется и код здесь. Да, не очень удобно,
				// зато быстро делается
				var formalStyle = i.toLowerCase().replace(/\s/g, "");
				var res = formalStyle.match(/^heading([1-9][0-9]*)$/);
				var index = (res) ? res[1] - 1 : -1;

				var _dr_style = __Styles.Get_Pr(i, styletype_Paragraph);
				_dr_style.Name = style.Name;
				_dr_style.Id = i;

				this.drawStyle(graphics, _dr_style);
				this.docStyles[cur_index] = new AscCommon.CStyleImage(style.Name, AscCommon.c_oAscStyleImage.Document, _canvas.toDataURL("image/png"), style.uiPriority);

				// алгоритм смены имени
				if (style.Default)
				{
					switch (style.Default)
					{
						case 1:
							break;
						case 2:
							this.docStyles[cur_index].Name = "No List";
							break;
						case 3:
							this.docStyles[cur_index].Name = "Normal";
							break;
						case 4:
							this.docStyles[cur_index].Name = "Normal Table";
							break;
					}
				}
				else if (index != -1)
				{
					this.docStyles[cur_index].Name = "Heading ".concat(index + 1);
				}

				cur_index++;
			}
		}
	},
	drawStyle: function (graphics, style)
	{
		var ctx = graphics.m_oContext;
		ctx.fillStyle = "#FFFFFF";
		ctx.fillRect(0, 0, this.STYLE_THUMBNAIL_WIDTH, this.STYLE_THUMBNAIL_HEIGHT);

		var font = {
			FontFamily: {Name: "Times New Roman", Index: -1},
			Color: {r: 0, g: 0, b: 0},
			Bold: false,
			Italic: false,
			FontSize: 10
		};

		var textPr = style.TextPr;
		if (textPr.FontFamily != undefined)
		{
			font.FontFamily.Name = textPr.FontFamily.Name;
			font.FontFamily.Index = textPr.FontFamily.Index;
		}

		if (textPr.Bold != undefined)
			font.Bold = textPr.Bold;
		if (textPr.Italic != undefined)
			font.Italic = textPr.Italic;

		if (textPr.FontSize != undefined)
			font.FontSize = textPr.FontSize;

		graphics.SetFont(font);

		if (textPr.Color == undefined)
			graphics.b_color1(0, 0, 0, 255);
		else
			graphics.b_color1(textPr.Color.r, textPr.Color.g, textPr.Color.b, 255);

		var dKoefToMM = g_dKoef_pix_to_mm;
		if (this.IsRetinaEnabled)
			dKoefToMM /= AscCommon.AscBrowser.retinaPixelRatio;

		if (window["flat_desine"] !== true)
		{
			var y = 0;
			var b = dKoefToMM * this.STYLE_THUMBNAIL_HEIGHT;
			var w = dKoefToMM * this.STYLE_THUMBNAIL_WIDTH;

			graphics.transform(1, 0, 0, 1, 0, 0);
			graphics.save();
			graphics._s();
			graphics._m(-0.5, y);
			graphics._l(w, y);
			graphics._l(w, b);
			graphics._l(0, b);
			graphics._z();
			graphics.clip();

			graphics.t(this.CurrentTranslate.StylesText, 0.5, (y + b) / 2);

			ctx.setTransform(1, 0, 0, 1, 0, 0);
			ctx.fillStyle = "#E8E8E8";

			var _b = this.STYLE_THUMBNAIL_HEIGHT - 1.5;
			var _x = 2;
			var _w = this.STYLE_THUMBNAIL_WIDTH - 4;
			var _h = (this.STYLE_THUMBNAIL_HEIGHT / 3) >> 0;
			ctx.beginPath();
			ctx.moveTo(_x, _b - _h);
			ctx.lineTo(_x + _w, _b - _h);
			ctx.lineTo(_x + _w, _b);
			ctx.lineTo(_x, _b);
			ctx.closePath();
			ctx.fill();

			ctx.lineWidth = 1;
			ctx.strokeStyle = "#D8D8D8";
			ctx.beginPath();
			ctx.rect(0.5, 0.5, this.STYLE_THUMBNAIL_WIDTH - 1, this.STYLE_THUMBNAIL_HEIGHT - 1);

			ctx.stroke();

			graphics.restore();
		}
		else
		{
			g_oTableId.m_bTurnOff = true;
			History.TurnOff();

			var oldDefTabStop = AscCommonWord.Default_Tab_Stop;
			AscCommonWord.Default_Tab_Stop = 1;

			var hdr = new CHeaderFooter(editor.WordControl.m_oLogicDocument.HdrFtr, editor.WordControl.m_oLogicDocument, editor.WordControl.m_oDrawingDocument, AscCommon.hdrftr_Header);
			var _dc = hdr.Content;//new CDocumentContent(editor.WordControl.m_oLogicDocument, editor.WordControl.m_oDrawingDocument, 0, 0, 0, 0, false, true, false);

			var par = new Paragraph(editor.WordControl.m_oDrawingDocument, _dc, false);
			var run = new ParaRun(par, false);

			for (var i = 0; i < style.Name.length; i++)
			{
				run.Add_ToContent(i, new ParaText(style.Name.charAt(i)), false);
			}

			_dc.Internal_Content_Add(0, par, false);
			par.Add_ToContent(0, run);
			par.Style_Add(style.Id, false);
			par.Set_Align(AscCommon.align_Left);
			par.Set_Tabs(new CParaTabs());

			var _brdL = style.ParaPr.Brd.Left;
			if (undefined !== _brdL && null !== _brdL)
			{
				var brdL = new CDocumentBorder();
				brdL.Set_FromObject(_brdL);
				brdL.Space = 0;
				par.Set_Border(brdL, AscDFH.historyitem_Paragraph_Borders_Left);
			}

			var _brdT = style.ParaPr.Brd.Top;
			if (undefined !== _brdT && null !== _brdT)
			{
				var brd = new CDocumentBorder();
				brd.Set_FromObject(_brdT);
				brd.Space = 0;
				par.Set_Border(brd, AscDFH.historyitem_Paragraph_Borders_Top);
			}

			var _brdB = style.ParaPr.Brd.Bottom;
			if (undefined !== _brdB && null !== _brdB)
			{
				var brd = new CDocumentBorder();
				brd.Set_FromObject(_brdB);
				brd.Space = 0;
				par.Set_Border(brd, AscDFH.historyitem_Paragraph_Borders_Bottom);
			}

			var _brdR = style.ParaPr.Brd.Right;
			if (undefined !== _brdR && null !== _brdR)
			{
				var brd = new CDocumentBorder();
				brd.Set_FromObject(_brdR);
				brd.Space = 0;
				par.Set_Border(brd, AscDFH.historyitem_Paragraph_Borders_Right);
			}

			var _ind = new CParaInd();
			_ind.FirstLine = 0;
			_ind.Left = 0;
			_ind.Right = 0;
			par.Set_Ind(_ind, false);

			var _sp = new CParaSpacing();
			_sp.Line = 1;
			_sp.LineRule = Asc.linerule_Auto;
			_sp.Before = 0;
			_sp.BeforeAutoSpacing = false;
			_sp.After = 0;
			_sp.AfterAutoSpacing = false;
			par.Set_Spacing(_sp, false);

			_dc.Reset(0, 0, 10000, 10000);
			_dc.Recalculate_Page(0, true);

			_dc.Reset(0, 0, par.Lines[0].Ranges[0].W + 0.001, 10000);
			_dc.Recalculate_Page(0, true);
			//par.Reset(0, 0, 10000, 10000, 0);
			//par.Recalculate_Page(0);

			var y = 0;
			var b = dKoefToMM * this.STYLE_THUMBNAIL_HEIGHT;
			var w = dKoefToMM * this.STYLE_THUMBNAIL_WIDTH;
			var off = 10 * dKoefToMM;
			var off2 = 5 * dKoefToMM;
			var off3 = 1 * dKoefToMM;

			graphics.transform(1, 0, 0, 1, 0, 0);
			graphics.save();
			graphics._s();
			graphics._m(off2, y + off3);
			graphics._l(w - off, y + off3);
			graphics._l(w - off, b - off3);
			graphics._l(off2, b - off3);
			graphics._z();
			graphics.clip();

			//graphics.t(style.Name, off + 0.5, y + 0.75 * (b - y));
			var baseline = par.Lines[0].Y;
			par.Shift(0, off + 0.5, y + 0.75 * (b - y) - baseline);
			par.Draw(0, graphics);

			graphics.restore();

			AscCommonWord.Default_Tab_Stop = oldDefTabStop;

			g_oTableId.m_bTurnOff = false;
			History.TurnOn();
		}
	}
};
CStylesPainter.prototype.get_MergedStyles = function ()
{
	return this.mergedStyles;
};



function TransformRectByMatrix(m, arr, offX, offY, koefX, koefY)
{
	var ret = [];
	ret.push(offX + koefX * m.TransformPointX(arr[0], arr[1]));
	ret.push(offY + koefY * m.TransformPointY(arr[0], arr[1]));

	ret.push(offX + koefX * m.TransformPointX(arr[2], arr[1]));
	ret.push(offY + koefY * m.TransformPointY(arr[2], arr[1]));

	ret.push(offX + koefX * m.TransformPointX(arr[2], arr[3]));
	ret.push(offY + koefY * m.TransformPointY(arr[2], arr[3]));

	ret.push(offX + koefX * m.TransformPointX(arr[0], arr[3]));
	ret.push(offY + koefY * m.TransformPointY(arr[0], arr[3]));
	return ret;
}

//--------------------------------------------------------export----------------------------------------------------
window['AscCommon'] = window['AscCommon'] || {};
window['AscCommonWord'] = window['AscCommonWord'] || {};
window['AscCommon'].CPage = CPage;
window['AscCommon'].CDrawingDocument = CDrawingDocument;

window['AscCommonWord'].CStylesPainter = CStylesPainter;
CStylesPainter.prototype['get_MergedStyles'] = CStylesPainter.prototype.get_MergedStyles;
