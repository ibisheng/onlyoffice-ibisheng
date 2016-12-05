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

(function (window, undefined)
{

// Import
	var AscBrowser = AscCommon.AscBrowser;

	var FT_Get_Sfnt_Table = AscFonts.FT_Get_Sfnt_Table;
	var FT_Matrix = AscFonts.FT_Matrix;
	var FT_Set_Char_Size = AscFonts.FT_Set_Char_Size;
	var FT_Set_Transform = AscFonts.FT_Set_Transform;
	var __FT_CharmapRec = AscFonts.__FT_CharmapRec;
	var FT_Set_Charmap = AscFonts.FT_Set_Charmap;
	var FT_Get_Char_Index = AscFonts.FT_Get_Char_Index;
	var FT_Load_Glyph = AscFonts.FT_Load_Glyph;
	var FT_Get_Glyph = AscFonts.FT_Get_Glyph;
	var FT_BBox = AscFonts.FT_BBox;
	var FT_Glyph_Get_CBox = AscFonts.FT_Glyph_Get_CBox;
	var FT_Done_Glyph = AscFonts.FT_Done_Glyph;
	var FT_Outline_Decompose = AscFonts.FT_Outline_Decompose;
	var FT_Render_Glyph = AscFonts.FT_Render_Glyph;
	var raster_memory = AscFonts.raster_memory;
	var FT_Get_Charmap_Index = AscFonts.FT_Get_Charmap_Index;

	var FONT_ITALIC_ANGLE = 0.3090169943749;
	var FT_ENCODING_UNICODE = 1970170211;
	var FT_ENCODING_NONE = 0;
	var FT_ENCODING_MS_SYMBOL = 1937337698;
	var FT_ENCODING_APPLE_ROMAN = 1634889070;
	var REND_MODE = 0;

	var EGlyphState =
	{
		glyphstateNormal: 0,  // символ отрисовался в нужном шрифте
		glyphstateDeafault: 1,  // символ отрисовался в дефолтовом шрифте
		glyphstateMiss: 2   // символ не отрисовался
	};

	function get_raster_bounds(data, width, height, stride)
	{
		var ret = {dist_l: 0, dist_t: 0, dist_r: 0, dist_b: 0};

		// left
		var bIsBreak = false;
		for (var i = 0; i < width; i++)
		{
			var _ind = i * 4 + 3;
			for (var j = 0; j < height; j++, _ind += stride)
			{
				if (data[_ind] != 0)
				{
					bIsBreak = true;
					break;
				}
			}
			if (bIsBreak)
				break;

			ret.dist_l++;
		}

		// right
		bIsBreak = false;
		for (var i = width - 1; i >= 0; i--)
		{
			var _ind = i * 4 + 3;
			for (var j = 0; j < height; j++, _ind += stride)
			{
				if (data[_ind] != 0)
				{
					bIsBreak = true;
					break;
				}
			}
			if (bIsBreak)
				break;

			ret.dist_r++;
		}

		// top
		var bIsBreak = false;
		for (var j = 0; j < height; j++)
		{
			var _ind = j * stride + 3;
			for (var i = 0; i < width; i++, _ind += 4)
			{
				if (data[_ind] != 0)
				{
					bIsBreak = true;
					break;
				}
			}
			if (bIsBreak)
				break;

			ret.dist_t++;
		}

		// bottom
		var bIsBreak = false;
		for (var j = height - 1; j >= 0; j--)
		{
			var _ind = j * stride + 3;
			for (var i = 0; i < width; i++, _ind += 4)
			{
				if (data[_ind] != 0)
				{
					bIsBreak = true;
					break;
				}
			}
			if (bIsBreak)
				break;

			ret.dist_b++;
		}

		// clear
		if (null != raster_memory.m_oBuffer)
		{
			var nIndexDst = 3;
			var nPitch = 4 * (raster_memory.width - width);
			var dst = raster_memory.m_oBuffer.data;
			for (var j = 0; j < height; j++)
			{
				for (var i = 0; i < width; i++)
				{
					dst[nIndexDst] = 0;
					nIndexDst += 4;
				}
				nIndexDst += nPitch;
			}
		}

		return ret;
	}

	function CGlyphData()
	{
		this.m_oCanvas = null;
		this.m_oContext = null;
		this.R = 0;
		this.G = 0;
		this.B = 0;

		this.RasterData = null;

		this.TempImage = null;
	}

	CGlyphData.prototype =
	{
		init: function (width, height)
		{
			if (width == 0 || height == 0)
				return;

			this.m_oCanvas = document.createElement('canvas');

			this.m_oCanvas.width = width;
			this.m_oCanvas.height = height;

			this.m_oContext = this.m_oCanvas.getContext('2d');
			this.m_oContext.globalCompositeOperation = "source-in";
		},
		checkColor: function (r, g, b, w, h)
		{
			if ((r == this.R) && (g == this.G) && (b == this.B))
				return;

			if (/*!AscBrowser.isAppleDevices*/true)
			{
				this.R = r;
				this.G = g;
				this.B = b;

				if (this.m_oCanvas != null)
				{
					if (AscBrowser.isMozilla && AscBrowser.isLinuxOS)
					{
						this.m_oContext.fillStyle = (this.R == 0xFF && this.G == 0xFF && this.B == 0xFF) ? "rgb(255,255,254)" : "rgb(" + this.R + "," + this.G + "," + this.B + ")";
						this.m_oContext.fillRect(0, 0, w, h);
					}
					else
					{
						this.m_oContext.fillStyle = "rgb(" + this.R + "," + this.G + "," + this.B + ")";
						this.m_oContext.fillRect(0, 0, w, h);
					}
				}
				else
				{
					if (AscBrowser.isMozilla && AscBrowser.isLinuxOS)
					{
						var _raster = this.RasterData;
						_raster.Chunk.CanvasCtx.fillStyle = (this.R == 0xFF && this.G == 0xFF && this.B == 0xFF) ? "rgb(255,255,254)" : "rgb(" + this.R + "," + this.G + "," + this.B + ")";
						var _x = _raster.Line.Height * _raster.Index;
						var _y = _raster.Line.Y;
						this.RasterData.Chunk.CanvasCtx.fillRect(_x, _y, w, h);
					}
					else
					{
						var _raster = this.RasterData;
						_raster.Chunk.CanvasCtx.fillStyle = "rgb(" + this.R + "," + this.G + "," + this.B + ")";
						var _x = _raster.Line.Height * _raster.Index;
						var _y = _raster.Line.Y;
						this.RasterData.Chunk.CanvasCtx.fillRect(_x, _y, w, h);
					}
				}
			}
			else
			{
				var _r = r;
				var _g = g;
				var _b = b;

				this.TempImage = document.createElement("canvas");
				this.TempImage.width = w;
				this.TempImage.height = h;
				var ctxD = this.TempImage.getContext("2d");
				var pixDst = null;

				if (this.m_oCanvas != null)
				{
					pixDst = this.m_oContext.getImageData(0, 0, w, h);
					var dataPx = pixDst.data;

					var cur = 0;
					var cnt = w * h;
					for (var i = 0; i < cnt; i++)
					{
						dataPx[cur++] = _r;
						dataPx[cur++] = _g;
						dataPx[cur++] = _b;
						cur++;
					}
				}
				else
				{
					var _raster = this.RasterData;
					var _x = _raster.Line.Height * _raster.Index;
					var _y = _raster.Line.Y;

					pixDst = _raster.Chunk.CanvasCtx.getImageData(_x, _y, w, h);
					var dataPx = pixDst.data;

					var cur = 0;
					var cnt = w * h;
					for (var i = 0; i < cnt; i++)
					{
						dataPx[cur++] = _r;
						dataPx[cur++] = _g;
						dataPx[cur++] = _b;
						cur++;
					}
				}

				ctxD.putImageData(pixDst, 0, 0, 0, 0, w, h);
			}
		}
	};

	function TGlyphBitmap()
	{
		this.nX = 0;            // Сдвиг по X начальной точки для рисования символа
		this.nY = 0;            // Сдвиг по Y начальной точки для рисования символа
		this.nWidth = 0;        // Ширина символа
		this.nHeight = 0;       // Высота символа

		this.oGlyphData = new CGlyphData();
	}

	TGlyphBitmap.prototype =
	{
		fromAlphaMask: function (font_manager)
		{
			var bIsCanvas = false;
			var _chunk_size = (font_manager.RasterMemory == null) ? 0 : font_manager.RasterMemory.ChunkHeapSize;
			if (Math.max(this.nWidth, this.nHeight) > (_chunk_size / 10))
				bIsCanvas = true;

			var _x = 0;
			var _y = 0;
			var ctx = null;

			if (bIsCanvas)
			{
				this.oGlyphData.init(this.nWidth, this.nHeight);
				ctx = this.oGlyphData.m_oContext;
			}
			else
			{
				this.oGlyphData.RasterData = font_manager.RasterMemory.Alloc(this.nWidth, this.nHeight);
				ctx = this.oGlyphData.RasterData.Chunk.CanvasCtx;
				_x = this.oGlyphData.RasterData.Line.Height * this.oGlyphData.RasterData.Index;
				_y = this.oGlyphData.RasterData.Line.Y;
			}

			if (true)
			{
				ctx.putImageData(raster_memory.m_oBuffer, _x, _y, 0, 0, this.nWidth, this.nHeight);
			}
			else
			{
				var gamma = 1.1;

				var nIndexDst = 3;
				var nPitch = 4 * (raster_memory.width - this.nWidth);
				var dst = raster_memory.m_oBuffer.data;
				for (var j = 0; j < this.nHeight; j++)
				{
					for (var i = 0; i < this.nWidth; i++)
					{
						dst[nIndexDst] = Math.min(parseInt(dst[nIndexDst] * gamma), 255);
						nIndexDst += 4;
					}
					nIndexDst += nPitch;
				}

				ctx.putImageData(raster_memory.m_oBuffer, _x, _y, 0, 0, this.nWidth, this.nHeight);
			}

			if (null != raster_memory.m_oBuffer)
			{
				var nIndexDst = 3;
				var nPitch = 4 * (raster_memory.width - this.nWidth);
				var dst = raster_memory.m_oBuffer.data;
				for (var j = 0; j < this.nHeight; j++)
				{
					for (var i = 0; i < this.nWidth; i++)
					{
						dst[nIndexDst] = 0;
						nIndexDst += 4;
					}
					nIndexDst += nPitch;
				}
			}
		},

		draw: function (context2D, x, y)
		{
			var nW = this.nWidth;
			var nH = this.nHeight;
			if (null != this.oGlyphData.TempImage)
			{
				context2D.drawImage(this.oGlyphData.TempImage, 0, 0, nW, nH, x, y, nW, nH);
				this.oGlyphData.TempImage = null;
			}
			else if (null != this.oGlyphData.m_oCanvas)
			{
				// своя память
				context2D.drawImage(this.oGlyphData.m_oCanvas, 0, 0, nW, nH, x, y, nW, nH);
			}
			else
			{
				var _raster = this.oGlyphData.RasterData;
				var _x = _raster.Line.Height * _raster.Index;
				var _y = _raster.Line.Y;
				context2D.drawImage(_raster.Chunk.CanvasImage, _x, _y, nW, nH, x, y, nW, nH);
			}
		},

		drawCrop: function (context2D, x, y, w, h, cx)
		{
			if (null != this.oGlyphData.TempImage)
			{
				context2D.drawImage(this.oGlyphData.TempImage, cx, 0, w, h, x, y, w, h);
				this.oGlyphData.TempImage = null;
			}
			else if (null != this.oGlyphData.m_oCanvas)
			{
				// своя память
				context2D.drawImage(this.oGlyphData.m_oCanvas, cx, 0, w, h, x, y, w, h);
			}
			else
			{
				var _raster = this.oGlyphData.RasterData;
				var _x = _raster.Line.Height * _raster.Index;
				var _y = _raster.Line.Y;
				context2D.drawImage(_raster.Chunk.CanvasImage, _x + cx, _y, w, h, x, y, w, h);
			}
		},

		drawCropInRect: function (context2D, x, y, clipRect)
		{
			var _x = x;
			var _y = y;
			var _r = x + this.nWidth;
			var _b = y + this.nHeight;

			var _dstX = 0;
			var _dstY = 0;
			var _dstW = this.nWidth;
			var _dstH = this.nHeight;

			if (_x < clipRect.l)
			{
				_dstX = clipRect.l - _x;
				_x += _dstX;
				_dstW -= _dstX;
			}
			if (_y < clipRect.t)
			{
				_dstY = clipRect.t - _y;
				_y += _dstY;
				_dstH -= _dstY;
			}
			if (_r > clipRect.r)
			{
				_dstW -= (_r - clipRect.r);
			}
			if (_b > clipRect.b)
			{
				_dstH -= (_b - clipRect.b);
			}

			if (_dstW <= 0 || _dstH <= 0)
				return;

			if (null != this.oGlyphData.TempImage)
			{
				context2D.drawImage(this.oGlyphData.TempImage, _dstX, _dstY, _dstW, _dstH, _x, _y, _dstW, _dstH);
				this.oGlyphData.TempImage = null;
			}
			else if (null != this.oGlyphData.m_oCanvas)
			{
				// своя память
				context2D.drawImage(this.oGlyphData.m_oCanvas, _dstX, _dstY, _dstW, _dstH, _x, _y, _dstW, _dstH);
			}
			else
			{
				var _raster = this.oGlyphData.RasterData;
				var __x = _raster.Line.Height * _raster.Index;
				var __y = _raster.Line.Y;
				context2D.drawImage(_raster.Chunk.CanvasImage, __x + _dstX, __y + _dstY, _dstW, _dstH, _x, _y, _dstW, _dstH);
			}
		},

		Free: function ()
		{
			if (null != this.oGlyphData.RasterData)
			{
				this.oGlyphData.RasterData.Chunk.Free(this.oGlyphData.RasterData);
			}
		}
	};

	function TBBox()
	{
		this.fMinX = 0;
		this.fMaxX = 0;
		this.fMinY = 0;
		this.fMaxY = 0;

		this.rasterDistances = null;
	}

	function TMetrics()
	{
		this.fWidth = 0;
		this.fHeight = 0;

		this.fHoriBearingX = 0;
		this.fHoriBearingY = 0;
		this.fHoriAdvance = 0;

		this.fVertBearingX = 0;
		this.fVertBearingY = 0;
		this.fVertAdvance = 0;
	}

	function TFontCacheSizes()
	{
		this.ushUnicode; // Значение символа в юникоде
		this.eState;     // Есть ли символ в шрифте/стандартном шрифте
		this.nCMapIndex; // Номер таблицы 'cmap', в которой был найден данный символ

		this.ushGID;

		this.fAdvanceX;

		this.oBBox = new TBBox();
		this.oMetrics = new TMetrics();

		this.bBitmap = false;
		this.oBitmap = null;
	}

	function CCMapIndex()
	{
		this.index = 0;
	}

	function CGlyphVectorPainter()
	{
		// сдвиг
		this.X = 0;
		this.Y = 0;

		// scale
		this.KoefX = 25.4 / 72;
		this.KoefY = 25.4 / 72;

		this.NeedClosed = false;

		this.shift = 0;
		this.delta = 0;

		this.CurX = 0;
		this.CurY = 0;
	}

	CGlyphVectorPainter.prototype =
	{
		start: function ()
		{

		},

		move_to: function (to, worker)
		{
			if (this.NeedClosed)
			{
				worker._z();
				this.NeedClosed = false;
			}

			this.CurX = this.X + this.KoefX * (to.x / 64.0);
			this.CurY = this.Y - this.KoefY * (to.y / 64.0);

			worker._m(this.CurX, this.CurY);

			return 0;
		},

		line_to: function (to, worker)
		{
			this.CurX = this.X + this.KoefX * (to.x / 64.0);
			this.CurY = this.Y - this.KoefY * (to.y / 64.0);

			worker._l(this.CurX, this.CurY);

			this.NeedClosed = true;
			return 0;
		},

		conic_to: function (control, to, worker)
		{
			var dX0 = this.CurX;
			var dY0 = this.CurY;

			var dXc = this.X + this.KoefX * (control.x / 64.0);
			var dYc = this.Y - this.KoefY * (control.y / 64.0);
			var dX3 = this.X + this.KoefX * (to.x / 64.0);
			var dY3 = this.Y - this.KoefY * (to.y / 64.0);

			// Строим кривую Безье второго порядка, с помощью кривой Безье третего порядка. Если p0, pC, p3 -
			// начальная, контрольная и конечная точки, соответственно, для кривой Безье второго порядка. Тогда
			// для этой же кривой, рассматриваемой как кривая Безье третьего порядка, точки p0, p1, p2, p3 будут
			// начальной, две контрольные, конечная точки. Где p1 и p2 рассчитываются по следующим формулам:
			//     p1 = (1/3) * (p0 + 2pС)
			//     p2 = (1/3) * (2pС + p3)

			var dX1 = (1.0 / 3.0) * (dX0 + 2 * dXc);
			var dY1 = (1.0 / 3.0) * (dY0 + 2 * dYc);
			var dX2 = (1.0 / 3.0) * (2 * dXc + dX3);
			var dY2 = (1.0 / 3.0) * (2 * dYc + dY3);

			worker._c(dX1, dY1, dX2, dY2, dX3, dY3);

			this.CurX = dX3;
			this.CurY = dY3;

			this.NeedClosed = true;
			return 0;
		},

		cubic_to: function (control1, control2, to, worker)
		{
			this.CurX = this.X + this.KoefX * (to.x / 64.0);
			this.CurY = this.Y - this.KoefY * (to.y / 64.0);

			worker._c(
				this.X + this.KoefX * (control1.x / 64.0),
				this.Y - this.KoefY * (control1.y / 64.0),
				this.X + this.KoefX * (control2.x / 64.0),
				this.Y - this.KoefY * (control2.y / 64.0),
				this.CurX,
				this.CurY);

			this.NeedClosed = true;
			return 0;
		},

		end: function (worker)
		{
			if (this.NeedClosed)
			{
				worker._z();
				this.NeedClosed = false;
			}
		}
	};

	function CFontFile(fileName, faceIndex)
	{
		this.m_arrdFontMatrix = new Array(6);
		this.m_arrdTextMatrix = new Array(6);
		this.m_bAntiAliasing = true;
		this.m_bUseKerning = false;

		this.m_fSize = 1.0;       // Размер шрифта
		this.m_unHorDpi = 0;      // Горизонтальное разрешение
		this.m_unVerDpi = 0;      // Вертикальное разрешение

		this.m_bNeedDoItalic = false;
		this.m_bNeedDoBold = false;

		this.m_fCharSpacing = 0.0;

		this.m_nMinX = 0;        //
		this.m_nMinY = 0;        // Glyph BBox
		this.m_nMaxX = 0;        //
		this.m_nMaxY = 0;        //

		this.m_sFileName = fileName;
		this.m_lFaceIndex = faceIndex;
		this.m_nError = 0;
		this.m_pFace = null;

		this.m_dUnitsKoef = 1.0;
		this.m_nDefaultChar = -1;
		this.m_nSymbolic = -1;
		this.m_dTextScale = 0;

		this.m_bStringGID = false;

		this.m_oFontMatrix = new FT_Matrix();
		this.m_oTextMatrix = new FT_Matrix();

		this.m_nNum_charmaps = 0;

		this.m_lAscender = 0;
		this.m_lDescender = 0;
		this.m_lLineHeight = 0;
		this.m_lUnits_Per_Em = 0;

		this.m_arrCacheSizes = [];
		this.m_arrCacheSizesGid = [];

		this.m_bUseDefaultFont = false;
		this.m_pDefaultFont = null;

		this.m_bIsNeedUpdateMatrix12 = true;
		this.m_oFontManager = null;
		this.HintsSupport = true;
		this.HintsSubpixelSupport = true;

		this.SetDefaultFont = function (pDefFont)
		{
			this.m_pDefaultFont = pDefFont;
		}

		this.FT_Load_Glyph_Wrapper = function(pFace, unGID, _LOAD_MODE)
		{
			var err = FT_Load_Glyph(pFace, unGID, _LOAD_MODE);
			if (0 != err && this.HintsSupport)
			{
				var err2 = FT_Load_Glyph(pFace, unGID, 40970);
				if (err2 != 0)
					return err;
				this.HintsSupport = false;
				return err2;
			}
			return err;
		}

		this.LoadDefaultCharAndSymbolicCmapIndex = function ()
		{
			this.m_nDefaultChar = -1;
			this.m_nSymbolic = -1;

			var pTable = FT_Get_Sfnt_Table(this.m_pFace, 2);
			if (null == pTable)
				return;

			this.m_nDefaultChar = pTable.usDefaultChar;

			// version
			if (0xFFFF == pTable.version)
				return;

			var ulCodePageRange1 = pTable.ulCodePageRange1;
			var ulCodePageRange2 = pTable.ulCodePageRange2;
			if (!(ulCodePageRange1 & 0x80000000) && !(ulCodePageRange1 == 0 && ulCodePageRange2 == 0))
				return;

			var charMapArray = this.m_pFace.charmaps;
			for (var nIndex = 0; nIndex < this.m_nNum_charmaps; ++nIndex)
			{
				var pCharMap = __FT_CharmapRec(charMapArray[nIndex]);

				var nPlatformId = pCharMap.platform_id;
				var nEncodingId = pCharMap.encoding_id;
				// Symbol
				if (0 == nEncodingId && 3 == nPlatformId)
				{
					this.m_nSymbolic = nIndex;
					return;
				}
			}
		}

		this.ResetFontMatrix = function ()
		{
			if (this.m_pDefaultFont)
				this.m_pDefaultFont.ResetFontMatrix();

			var m = this.m_arrdFontMatrix;
			if (this.m_bNeedDoItalic)
			{
				m[0] = 1;
				m[1] = 0;
				m[2] = FONT_ITALIC_ANGLE;
				m[3] = 1;
				m[4] = 0;
				m[5] = 0;
			}
			else
			{
				m[0] = 1;
				m[1] = 0;
				m[2] = 0;
				m[3] = 1;
				m[4] = 0;
				m[5] = 0;
			}

			this.UpdateMatrix0();
		}

		this.ResetTextMatrix = function ()
		{
			var m = this.m_arrdTextMatrix;
			m[0] = 1;
			m[1] = 0;
			m[2] = 0;
			m[3] = 1;
			m[4] = 0;
			m[5] = 0;

			this.CheckTextMatrix();
		}

		this.CheckTextMatrix = function ()
		{
			this.m_bIsNeedUpdateMatrix12 = true;
			var m = this.m_arrdTextMatrix;
			if ((m[0] == 1) && (m[1] == 0) && (m[2] == 0) && (m[3] == 1))
			{
				this.m_bIsNeedUpdateMatrix12 = false;

				if (this.m_pDefaultFont)
					this.m_pDefaultFont.UpdateMatrix1();
				this.UpdateMatrix1();
			}
		}

		this.UpdateMatrix0 = function ()
		{
			var dSize = this.m_fSize;

			var m1 = this.m_arrdTextMatrix[2];
			var m2 = this.m_arrdTextMatrix[3];
			this.m_dTextScale = Math.sqrt(m1 * m1 + m2 * m2);

			var bbox = this.m_pFace.bbox;
			var xMin = bbox.xMin;
			var yMin = bbox.yMin;
			var xMax = bbox.xMax;
			var yMax = bbox.yMax;

			if (this.m_lUnits_Per_Em == 0)
				this.m_lUnits_Per_Em = this.m_pFace.units_per_EM = 2048;

			var units_per_EM = this.m_lUnits_Per_Em;
			var dDiv = xMax > 20000 ? 65536 : 1;
			var del = dDiv * units_per_EM;

			var m = this.m_arrdFontMatrix;

			var nX = parseInt(((m[0] * xMin + m[2] * yMin) * dSize / del));
			this.m_nMinX = this.m_nMaxX = nX;

			var nY = parseInt(((m[1] * xMin + m[3] * yMin) * dSize / del));
			this.m_nMinY = this.m_nMaxY = nY;

			nX = parseInt(((m[0] * xMin + m[2] * yMax) * dSize / del));

			if (nX < this.m_nMinX)
				this.m_nMinX = nX;
			else if (nX > this.m_nMaxX)
				this.m_nMaxX = nX;

			nY = parseInt(((m[1] * xMin + m[3] * yMax) * dSize / del));

			if (nY < this.m_nMinY)
				this.m_nMinY = nY;
			else if (nY > this.m_nMaxY)
				this.m_nMaxY = nY;

			nX = parseInt(((m[0] * xMax + m[2] * yMin) * dSize / del));
			if (nX < this.m_nMinX)
				this.m_nMinX = nX;
			else if (nX > this.m_nMaxX)
				this.m_nMaxX = nX;

			nY = parseInt(((m[1] * xMax + m[3] * yMin) * dSize / del));
			if (nY < this.m_nMinY)
				this.m_nMinY = nY;
			else if (nY > this.m_nMaxY)
				this.m_nMaxY = nY;

			nX = parseInt(((m[0] * xMax + m[2] * yMax) * dSize / del));
			if (nX < this.m_nMinX)
				this.m_nMinX = nX;
			else if (nX > this.m_nMaxX)
				this.m_nMaxX = nX;

			nY = parseInt(((m[1] * xMax + m[3] * yMax) * dSize / del));
			if (nY < this.m_nMinY)
				this.m_nMinY = nY;
			else if (nY > this.m_nMaxY)
				this.m_nMaxY = nY;

			// This is a kludge: some buggy PDF generators embed fonts with  zero bounding boxes.
			if (this.m_nMaxX == this.m_nMinX)
			{
				this.m_nMinX = 0;
				this.m_nMaxX = parseInt(dSize);
			}

			if (this.m_nMaxY == this.m_nMinY)
			{
				this.m_nMinY = 0;
				this.m_nMaxY = parseInt((1.2 * dSize));
			}

			// �������� ������� �������������� (FontMatrix)
			var fm = this.m_oFontMatrix;
			fm.xx = Math.floor((m[0] * 65536));
			fm.yx = Math.floor((m[1] * 65536));
			fm.xy = Math.floor((m[2] * 65536));
			fm.yy = Math.floor((m[3] * 65536));

			var tm = this.m_oTextMatrix;
			tm.xx = Math.floor(((this.m_arrdTextMatrix[0] / this.m_dTextScale) * 65536));
			tm.yx = Math.floor(((this.m_arrdTextMatrix[1] / this.m_dTextScale) * 65536));
			tm.xy = Math.floor(((this.m_arrdTextMatrix[2] / this.m_dTextScale) * 65536));
			tm.yy = Math.floor(((this.m_arrdTextMatrix[3] / this.m_dTextScale) * 65536));

			FT_Set_Transform(this.m_pFace, fm, 0);
		}

		this.UpdateMatrix1 = function ()
		{
			var m = this.m_arrdFontMatrix;
			var fm = this.m_oFontMatrix;
			fm.xx = Math.floor((m[0] * 65536));
			fm.yx = Math.floor((m[1] * 65536));
			fm.xy = Math.floor((m[2] * 65536));
			fm.yy = Math.floor((m[3] * 65536));

			FT_Set_Transform(this.m_pFace, this.m_oFontMatrix, 0);
		}

		this.UpdateMatrix2 = function ()
		{
			var m = this.m_arrdFontMatrix;
			var t = this.m_arrdTextMatrix;
			var fm = this.m_oFontMatrix;

			fm.xx = parseInt((m[0] * t[0] + m[1] * t[2] ) * 65536);
			fm.yx = parseInt((m[0] * t[1] + m[1] * t[3] ) * 65536);
			fm.xy = parseInt((m[2] * t[0] + m[3] * t[2] ) * 65536);
			fm.yy = parseInt((m[2] * t[1] + m[3] * t[3] ) * 65536);

			FT_Set_Transform(this.m_pFace, fm, 0);
		}

		this.SetSizeAndDpi = function (fSize, _unHorDpi, _unVerDpi)
		{
			var unHorDpi = parseInt(_unHorDpi + 0.5);
			var unVerDpi = parseInt(_unVerDpi + 0.5);

			if (this.m_pDefaultFont)
				this.m_pDefaultFont.SetSizeAndDpi(fSize, unHorDpi, unVerDpi);

			var fOldSize = this.m_fSize;
			var fNewSize = fSize;
			var fKoef = fNewSize / fOldSize;

			if (fKoef > 1.001 || fKoef < 0.999 || unHorDpi != this.m_unHorDpi || unVerDpi != this.m_unVerDpi)
			{
				this.m_unHorDpi = unHorDpi;
				this.m_unVerDpi = unVerDpi;

				if (fKoef > 1.001 || fKoef < 0.999)
				{
					this.m_fSize = fNewSize;
					this.UpdateMatrix0();
				}

				this.m_dUnitsKoef = this.m_unHorDpi / 72.0 * this.m_fSize;

				// ���������� ������ ������ (dSize) � DPI
				this.m_nError = FT_Set_Char_Size(this.m_pFace, 0, parseInt(fNewSize * 64), unHorDpi, unVerDpi);

				this.ClearCache();
			}
		}

		this.ClearCache = function ()
		{
			this.Destroy();
			this.ClearCacheNoAttack();
		}
		this.ClearCacheNoAttack = function ()
		{
			this.m_arrCacheSizes = [];
			this.m_arrCacheSizesGid = [];
		}

		this.Destroy = function ()
		{
			if (this.m_oFontManager != null && this.m_oFontManager.RasterMemory != null)
			{
				var _arr = this.m_arrCacheSizes;
				for (var i in _arr)
				{
					if (_arr[i].oBitmap != null)
						_arr[i].oBitmap.Free();
				}
				_arr = this.m_arrCacheSizesGid;
				for (var i in _arr)
				{
					if (_arr[i].oBitmap != null)
						_arr[i].oBitmap.Free();
				}
			}
		}

		this.SetTextMatrix = function (fA, fB, fC, fD, fE, fF)
		{
			var m = this.m_arrdTextMatrix;

			var b1 = (m[0] == fA && m[1] == -fB && m[2] == -fC && m[3] == fD);
			if (b1 && m[4] == fE && m[5] == fF)
				return false;

			if (this.m_pDefaultFont)
				this.m_pDefaultFont.SetTextMatrix(fA, fB, fC, fD, fE, fF);

			m[0] = fA;
			m[1] = -fB;
			m[2] = -fC;
			m[3] = fD;
			m[4] = fE;
			m[5] = fF;

			if (!b1)
			{
				this.ClearCache();
			}
			this.CheckTextMatrix();
			return true;
		}

		this.SetFontMatrix = function (fA, fB, fC, fD, fE, fF)
		{
			if (this.m_pDefaultFont)
				this.m_pDefaultFont.SetFontMatrix(fA, fB, fC, fD, fE, fF);

			var m = this.m_arrdFontMatrix;
			if (this.m_bNeedDoItalic)
			{
				m[0] = fA;
				m[1] = fB;
				m[2] = fC + fA * FONT_ITALIC_ANGLE;
				m[3] = fD + fB * FONT_ITALIC_ANGLE;
				m[4] = fE;
				m[5] = fF;
			}
			else
			{
				m[0] = fA;
				m[1] = fB;
				m[2] = fC;
				m[3] = fD;
				m[4] = fE;
				m[5] = fF;
			}

			this.ClearCache();
		}

		this.GetString = function (pString)
		{
			if (pString.GetLength() <= 0)
				return true;

			var unPrevGID = 0;
			var fPenX = 0, fPenY = 0;

			// Сначала мы все рассчитываем исходя только из матрицы шрифта FontMatrix
			if (this.m_bIsNeedUpdateMatrix12)
			{
				if (this.m_pDefaultFont)
					this.m_pDefaultFont.UpdateMatrix1();
				this.UpdateMatrix1();
			}

			var _cache_array = (this.m_bStringGID === false) ? this.m_arrCacheSizes : this.m_arrCacheSizesGid;

			for (var nIndex = 0; nIndex < pString.GetLength(); ++nIndex)
			{
				nCMapIndex.index = 0;
				var pFace = this.m_pFace;
				var pCurentGliph = pFace.m_pGlyph;

				var pCurGlyph = pString.GetAt(nIndex);
				var ushUnicode = pCurGlyph.lUnicode;

				var unGID = 0;
				var charSymbolObj = _cache_array[ushUnicode];
				if (undefined == charSymbolObj)
				{
					var nCMapIndex = new CCMapIndex();
					unGID = this.SetCMapForCharCode(ushUnicode, nCMapIndex);

					var oSizes = new TFontCacheSizes();
					oSizes.ushUnicode = ushUnicode;

					if (!((unGID > 0) || (-1 != this.m_nSymbolic && (ushUnicode < 0xF000) && 0 < (unGID = this.SetCMapForCharCode(ushUnicode + 0xF000, nCMapIndex)))))
					{
						// Пробуем загрузить через стандартный шрифт
						if (false === this.m_bUseDefaultFont || null == this.m_pDefaultFont || 0 >= (unGID = this.m_pDefaultFont.SetCMapForCharCode(ushUnicode, nCMapIndex)))
						{
							if (this.m_nDefaultChar < 0)
							{
								oSizes.ushGID = -1;
								oSizes.eState = EGlyphState.glyphstateMiss;
								var max_advance = this.m_pFace.size.metrics.max_advance;
								oSizes.fAdvanceX = (max_advance >> 6) / 2.0;

								return;
							}
							else
							{
								unGID = this.m_nDefaultChar;
								oSizes.eState = EGlyphState.glyphstateNormal;

								pFace = this.m_pFace;
								pCurentGliph = pFace.glyph;
							}
						}
						else
						{
							oSizes.eState = EGlyphState.glyphstateDeafault;

							pFace = this.m_pDefaultFont.m_pFace;
							pCurentGliph = this.m_pDefaultFont.m_pGlyph;
						}
					}
					else
					{
						oSizes.eState = EGlyphState.glyphstateNormal;
					}

					oSizes.ushGID = unGID;
					oSizes.nCMapIndex = nCMapIndex.index;

					var _LOAD_MODE = this.GetCharLoadMode();
					if (0 != this.FT_Load_Glyph_Wrapper(pFace, unGID, _LOAD_MODE))
						return;

					var pGlyph = FT_Get_Glyph(pCurentGliph);
					if (null == pGlyph)
						return;

					var oBBox = new FT_BBox();

					FT_Glyph_Get_CBox(pGlyph, 1, oBBox);
					var xMin = oBBox.xMin;
					var yMin = oBBox.yMin;
					var xMax = oBBox.xMax;
					var yMax = oBBox.yMax;
					FT_Done_Glyph(pGlyph);
					pGlyph = null;

					var linearHoriAdvance = pCurentGliph.linearHoriAdvance;
					var units_per_EM = this.m_lUnits_Per_Em;

					oSizes.fAdvanceX = (linearHoriAdvance * this.m_dUnitsKoef / units_per_EM);
					oSizes.oBBox.fMinX = (xMin >> 6);
					oSizes.oBBox.fMaxX = (xMax >> 6);
					oSizes.oBBox.fMinY = (yMin >> 6);
					oSizes.oBBox.fMaxY = (yMax >> 6);

					if (this.m_bNeedDoBold && this.m_oFontManager.IsAdvanceNeedBoldFonts)
						oSizes.fAdvanceX += 1;

					var dstM = oSizes.oMetrics;
					var srcM = pCurentGliph.metrics;

					dstM.fWidth = (srcM.width >> 6);
					dstM.fHeight = (srcM.height >> 6);
					dstM.fHoriBearingX = (srcM.horiBearingX >> 6);
					dstM.fHoriBearingY = (srcM.horiBearingY >> 6);
					dstM.fHoriAdvance = (srcM.horiAdvance >> 6);
					dstM.fVertBearingX = (srcM.vertBearingX >> 6);
					dstM.fVertBearingY = (srcM.vertBearingY >> 6);
					dstM.fVertAdvance = (srcM.vertAdvance >> 6);

					oSizes.bBitmap = false;
					oSizes.oBitmap = null;

					_cache_array[oSizes.ushUnicode] = oSizes;
				}
				else
				{
					var _cmap_index = charSymbolObj.nCMapIndex;
					unGID = charSymbolObj.ushGID;
					var eState = charSymbolObj.eState;

					if (EGlyphState.glyphstateMiss == eState)
					{
						pString.SetStartPoint(nIndex, fPenX, fPenY);
						pString.SetBBox(nIndex, 0, 0, 0, 0);
						pString.SetState(nIndex, EGlyphState.glyphstateMiss);

						fPenX += charSymbolObj.fAdvanceX + this.m_fCharSpacing;
						unPrevGID = 0;

						continue;
					}
					else if (EGlyphState.glyphstateDeafault == eState)
					{
						pString.SetState(nIndex, EGlyphState.glyphstateDeafault);
						//pFace = pDefFace;
					}
					else // if ( glyphstateNormal == eState )
					{
						pString.SetState(nIndex, EGlyphState.glyphstateNormal);
						//pFace = pSrcFace;
					}

					if (0 != this.m_nNum_charmaps)
					{
						var nCharmap = pFace.charmap;
						var nCurCMapIndex = FT_Get_Charmap_Index(nCharmap);
						if (nCurCMapIndex != _cmap_index)
						{
							_cmap_index = Math.max(0, _cmap_index);
							nCharmap = pFace.charmaps[_cmap_index];
							FT_Set_Charmap(pFace, nCharmap);
						}
					}

					if (this.m_bUseKerning && unPrevGID && (nIndex >= 0 && pString.GetAt(nIndex).eState == pString.GetAt(nIndex - 1).eState))
					{
						fPenX += this.GetKerning(unPrevGID, unGID);
					}

					var fX = pString.m_fX + fPenX;
					var fY = pString.m_fY + fPenY;

					// ��������� ����� ������������ ����� ������ �� ���������� �������
					var fXX = (pString.m_arrCTM[4] + fX * pString.m_arrCTM[0] + fY * pString.m_arrCTM[2] - pString.m_fX);
					var fYY = (pString.m_arrCTM[5] + fX * pString.m_arrCTM[1] + fY * pString.m_arrCTM[3] - pString.m_fY);

					pString.SetStartPoint(nIndex, fXX, fYY);

					var _metrics = charSymbolObj.oMetrics;
					pString.SetMetrics(nIndex, _metrics.fWidth, _metrics.fHeight, _metrics.fHoriAdvance, _metrics.fHoriBearingX, _metrics.fHoriBearingY, _metrics.fVertAdvance, _metrics.fVertBearingX, _metrics.fVertBearingY);
					pString.SetBBox(nIndex, charSymbolObj.oBBox.fMinX, charSymbolObj.oBBox.fMaxY, charSymbolObj.oBBox.fMaxX, charSymbolObj.oBBox.fMinY);
					fPenX += charSymbolObj.fAdvanceX + this.m_fCharSpacing;

					if (this.m_bNeedDoBold && this.m_oFontManager.IsAdvanceNeedBoldFonts)
					{
						// Когда текст делаем жирным сами, то мы увеличиваем расстояние на 1 пиксель в ширину (независимо от DPI и размера текста всегда 1 пиксель)
						fPenX += 1;
					}
				}
				unPrevGID = unGID;
			}

			pString.m_fEndX = fPenX + pString.m_fX;
			pString.m_fEndY = fPenY + pString.m_fY;

			if (this.m_bIsNeedUpdateMatrix12)
			{
				if (this.m_pDefaultFont)
					this.m_pDefaultFont.UpdateMatrix2();
				this.UpdateMatrix2();
			}
		}

		this.GetString2 = function (pString)
		{
			if (pString.GetLength() <= 0)
				return true;

			var unPrevGID = 0;
			var fPenX = 0, fPenY = 0;

			var _cache_array = (this.m_bStringGID === false) ? this.m_arrCacheSizes : this.m_arrCacheSizesGid;

			for (var nIndex = 0; nIndex < pString.GetLength(); ++nIndex)
			{
				// Сначала мы все рассчитываем исходя только из матрицы шрифта FontMatrix
				if (this.m_bIsNeedUpdateMatrix12)
				{
					if (this.m_pDefaultFont)
						this.m_pDefaultFont.UpdateMatrix1();
					this.UpdateMatrix1();
				}

				var pFace = this.m_pFace;
				var pCurentGliph = pFace.glyph;

				var pCurGlyph = pString.GetAt(nIndex);
				var ushUnicode = pCurGlyph.lUnicode;

				var unGID = 0;
				var charSymbolObj = _cache_array[ushUnicode];
				if (undefined == charSymbolObj || null == charSymbolObj.oBitmap)
				{
					var nCMapIndex = new CCMapIndex();
					unGID = this.SetCMapForCharCode(ushUnicode, nCMapIndex);

					var oSizes = new TFontCacheSizes();
					oSizes.ushUnicode = ushUnicode;

					if (!((unGID > 0) || (-1 != this.m_nSymbolic && (ushUnicode < 0xF000) && 0 < (unGID = this.SetCMapForCharCode(ushUnicode + 0xF000, nCMapIndex)))))
					{
						// Пробуем загрузить через стандартный шрифт
						if (false === this.m_bUseDefaultFont || null == this.m_pDefaultFont || 0 >= (unGID = this.m_pDefaultFont.SetCMapForCharCode(ushUnicode, nCMapIndex)))
						{
							if (this.m_nDefaultChar < 0)
							{
								oSizes.ushGID = -1;
								oSizes.eState = EGlyphState.glyphstateMiss;
								var max_advance = this.m_pFace.size.metrics.max_advance;
								oSizes.fAdvanceX = (max_advance >> 6) / 2.0;

								return;
							}
							else
							{
								unGID = this.m_nDefaultChar;
								oSizes.eState = EGlyphState.glyphstateNormal;

								pFace = this.m_pFace;
								pCurentGliph = pFace.glyph;
							}
						}
						else
						{
							oSizes.eState = EGlyphState.glyphstateDeafault;

							pFace = this.m_pDefaultFont.m_pFace;
							pCurentGliph = this.m_pDefaultFont.m_pFace.glyph;
						}
					}
					else
					{
						oSizes.eState = EGlyphState.glyphstateNormal;
					}

					oSizes.ushGID = unGID;
					oSizes.nCMapIndex = nCMapIndex.index;

					if (this.m_bIsNeedUpdateMatrix12)
					{
						if (this.m_pDefaultFont)
							this.m_pDefaultFont.UpdateMatrix2();
						this.UpdateMatrix2();
					}

					var _LOAD_MODE = this.GetCharLoadMode();
					if (0 != this.FT_Load_Glyph_Wrapper(pFace, unGID, _LOAD_MODE))
						return;

					var pGlyph = FT_Get_Glyph(this.m_pFace.glyph);
					if (null == pGlyph)
						return;

					var oBBox = new FT_BBox();

					FT_Glyph_Get_CBox(pGlyph, 1, oBBox);
					var xMin = oBBox.xMin;
					var yMin = oBBox.yMin;
					var xMax = oBBox.xMax;
					var yMax = oBBox.yMax;
					FT_Done_Glyph(pGlyph);
					pGlyph = null;

					pCurentGliph = this.m_pFace.glyph;

					var linearHoriAdvance = pCurentGliph.linearHoriAdvance;
					var units_per_EM = this.m_lUnits_Per_Em;

					oSizes.fAdvanceX = (linearHoriAdvance * this.m_dUnitsKoef / units_per_EM);
					oSizes.oBBox.fMinX = (xMin >> 6);
					oSizes.oBBox.fMaxX = (xMax >> 6);
					oSizes.oBBox.fMinY = (yMin >> 6);
					oSizes.oBBox.fMaxY = (yMax >> 6);

					var dstM = oSizes.oMetrics;
					var srcM = pCurentGliph.metrics;

					dstM.fWidth = (srcM.width >> 6);
					dstM.fHeight = (srcM.height >> 6);
					dstM.fHoriBearingX = (srcM.horiBearingX >> 6);
					dstM.fHoriBearingY = (srcM.horiBearingY >> 6);
					dstM.fHoriAdvance = (srcM.horiAdvance >> 6);
					dstM.fVertBearingX = (srcM.vertBearingX >> 6);
					dstM.fVertBearingY = (srcM.vertBearingY >> 6);
					dstM.fVertAdvance = (srcM.vertAdvance >> 6);

					oSizes.bBitmap = true;
					if (FT_Render_Glyph(pCurentGliph, REND_MODE))
						return;

					oSizes.oBitmap = new TGlyphBitmap();
					oSizes.oBitmap.nX = pCurentGliph.bitmap_left;
					oSizes.oBitmap.nY = pCurentGliph.bitmap_top;
					oSizes.oBitmap.nWidth = pCurentGliph.bitmap.width;
					oSizes.oBitmap.nHeight = pCurentGliph.bitmap.rows;

					var _width = pCurentGliph.bitmap.pitch;

					var _disable_need_bold = (pFace.os2 && (pFace.os2.version != 0xFFFF) && (pFace.os2.usWeightClass >= 800)) ? true : false;

					if (_width != 0)
					{
						var nRowSize = 0;
						if (this.m_bAntiAliasing)
						{
							if (this.m_bNeedDoBold && !_disable_need_bold)
								oSizes.oBitmap.nWidth++;

							nRowSize = oSizes.oBitmap.nWidth;
						}
						else
						{
							nRowSize = (oSizes.oBitmap.nWidth + 7) >> 3;
						}

						if (this.m_bNeedDoBold && this.m_bAntiAliasing && !_disable_need_bold)
						{
							var _width_im = oSizes.oBitmap.nWidth;
							var _height = oSizes.oBitmap.nHeight;

							var nY, nX;
							var pDstBuffer;

							var _input = raster_memory.m_oBuffer.data;
							for (nY = 0, pDstBuffer = 0; nY < _height; ++nY, pDstBuffer += (raster_memory.pitch))
							{
								for (nX = _width_im - 1; nX >= 0; --nX)
								{
									if (0 != nX) // иначе ничего не делаем
									{
										var _pos_x = pDstBuffer + nX * 4 + 3;

										if (_width_im - 1 == nX)
										{
											// последний - просто копируем
											_input[_pos_x] = _input[_pos_x - 4];
										}
										else
										{
											// сдвигаем все вправо
											_input[_pos_x] = Math.min(255, _input[_pos_x - 4] + _input[_pos_x]);
										}
									}
								}
							}
						}

						pCurGlyph.bBitmap = oSizes.bBitmap;
						pCurGlyph.oBitmap = oSizes.oBitmap;

						// new scheme!!! --------------------------
						oSizes.oBitmap.fromAlphaMask(this.m_oFontManager);
						// ----------------------------------------
					}

					_cache_array[oSizes.ushUnicode] = oSizes;
					charSymbolObj = oSizes;
				}
				if (null != charSymbolObj)
				{
					var nCMapIndex = charSymbolObj.nCMapIndex;
					unGID = charSymbolObj.ushGID;
					var eState = charSymbolObj.eState;

					if (EGlyphState.glyphstateMiss == eState)
					{
						pString.SetStartPoint(nIndex, fPenX, fPenY);
						pString.SetBBox(nIndex, 0, 0, 0, 0);
						pString.SetState(nIndex, EGlyphState.glyphstateMiss);

						fPenX += charSymbolObj.fAdvanceX + this.m_fCharSpacing;
						unPrevGID = 0;

						continue;
					}
					else if (EGlyphState.glyphstateDeafault == eState)
					{
						pString.SetState(nIndex, EGlyphState.glyphstateDeafault);
						//pFace = pDefFace;
					}
					else
					{
						pString.SetState(nIndex, EGlyphState.glyphstateNormal);
						//pFace = pSrcFace;
					}

					if (0 != this.m_nNum_charmaps)
					{
						var nCharmap = pFace.charmap;
						var nCurCMapIndex = FT_Get_Charmap_Index(nCharmap);
						if (nCurCMapIndex != nCMapIndex)
						{
							nCMapIndex = Math.max(0, nCMapIndex);
							nCharmap = this.m_pFace.charmaps[nCMapIndex];
							FT_Set_Charmap(this.m_pFace, nCharmap);
						}
					}

					if (this.m_bUseKerning && unPrevGID && (nIndex >= 0 && pString.GetAt(nIndex).eState == pString.GetAt(nIndex - 1).eState))
					{
						fPenX += this.GetKerning(unPrevGID, unGID);
					}

					var fX = pString.m_fX + fPenX;
					var fY = pString.m_fY + fPenY;

					// ��������� ����� ������������ ����� ������ �� ���������� �������
					var fXX = (pString.m_arrCTM[4] + fX * pString.m_arrCTM[0] + fY * pString.m_arrCTM[2] - pString.m_fX);
					var fYY = (pString.m_arrCTM[5] + fX * pString.m_arrCTM[1] + fY * pString.m_arrCTM[3] - pString.m_fY);

					pString.SetStartPoint(nIndex, fXX, fYY);

					//pString.SetMetrics (nIndex, charSymbolObj.oMetrics.fWidth, charSymbolObj.oMetrics.fHeight, charSymbolObj.oMetrics.fHoriAdvance, charSymbolObj.oMetrics.fHoriBearingX, charSymbolObj.oMetrics.fHoriBearingY, charSymbolObj.oMetrics.fVertAdvance, charSymbolObj.oMetrics.fVertBearingX, charSymbolObj.oMetrics.fVertBearingY);
					pString.m_pGlyphsBuffer[nIndex].oMetrics = charSymbolObj.oMetrics;
					pString.SetBBox(nIndex, charSymbolObj.oBBox.fMinX, charSymbolObj.oBBox.fMaxY, charSymbolObj.oBBox.fMaxX, charSymbolObj.oBBox.fMinY);
					fPenX += charSymbolObj.fAdvanceX + this.m_fCharSpacing;

					if (this.m_bNeedDoBold && this.m_oFontManager.IsAdvanceNeedBoldFonts)
					{
						// Когда текст делаем жирным сами, то мы увеличиваем расстояние на 1 пиксель в ширину (независимо от DPI и размера текста всегда 1 пиксель)
						fPenX += 1;
					}

					pCurGlyph.bBitmap = charSymbolObj.bBitmap;
					pCurGlyph.oBitmap = charSymbolObj.oBitmap;
				}
				unPrevGID = unGID;
			}

			pString.m_fEndX = fPenX + pString.m_fX;
			pString.m_fEndY = fPenY + pString.m_fY;

			if (this.m_bIsNeedUpdateMatrix12)
			{
				if (this.m_pDefaultFont)
					this.m_pDefaultFont.UpdateMatrix2();
				this.UpdateMatrix2();
			}
		}

		this.GetString2C = function (pString)
		{
			var unPrevGID = 0;
			var fPenX = 0, fPenY = 0;

			// Сначала мы все рассчитываем исходя только из матрицы шрифта FontMatrix
			if (this.m_bIsNeedUpdateMatrix12)
			{
				if (this.m_pDefaultFont)
					this.m_pDefaultFont.UpdateMatrix1();
				this.UpdateMatrix1();
			}

			var pCurGlyph = pString.m_pGlyphsBuffer[0];
			var ushUnicode = pCurGlyph.lUnicode;

			var _cache_array = (this.m_bStringGID === false) ? this.m_arrCacheSizes : this.m_arrCacheSizesGid;

			var unGID = 0;
			var charSymbolObj = _cache_array[ushUnicode];
			if (undefined == charSymbolObj || (null == charSymbolObj.oBitmap && charSymbolObj.bBitmap === false))
			{
				var nCMapIndex = new CCMapIndex();
				unGID = this.SetCMapForCharCode(ushUnicode, nCMapIndex);

				var oSizes = new TFontCacheSizes();
				oSizes.ushUnicode = ushUnicode;

				if (!((unGID > 0) || (-1 != this.m_nSymbolic && (ushUnicode < 0xF000) && 0 < (unGID = this.SetCMapForCharCode(ushUnicode + 0xF000, nCMapIndex)))))
				{
					// Пробуем загрузить через стандартный шрифт
					if (false === this.m_bUseDefaultFont || null == this.m_pDefaultFont || 0 >= (unGID = this.m_pDefaultFont.SetCMapForCharCode(ushUnicode, nCMapIndex)))
					{
						if (this.m_nDefaultChar < 0)
						{
							oSizes.ushGID = -1;
							oSizes.eState = EGlyphState.glyphstateMiss;
							var max_advance = this.m_pFace.size.metrics.max_advance;
							oSizes.fAdvanceX = (max_advance >> 6) / 2.0;

							return;
						}
						else
						{
							unGID = this.m_nDefaultChar;
							oSizes.eState = EGlyphState.glyphstateNormal;
						}
					}
					else
					{
						oSizes.eState = EGlyphState.glyphstateDeafault;
					}
				}
				else
				{
					oSizes.eState = EGlyphState.glyphstateNormal;
				}

				oSizes.ushGID = unGID;
				oSizes.nCMapIndex = nCMapIndex.index;

				if (this.m_bIsNeedUpdateMatrix12)
				{
					if (this.m_pDefaultFont)
						this.m_pDefaultFont.UpdateMatrix2();
					this.UpdateMatrix2();
				}

				if (true)
				{
					var fX = pString.m_fX + fPenX;
					var fY = pString.m_fY + fPenY;

					var _m = pString.m_arrCTM;

					// ��������� ����� ������������ ����� ������ �� ���������� �������
					pCurGlyph.fX = (_m[4] + fX * _m[0] + fY * _m[2] - pString.m_fX);
					pCurGlyph.fY = (_m[5] + fX * _m[1] + fY * _m[3] - pString.m_fY);
				}

				var _LOAD_MODE = this.GetCharLoadMode();
				if (0 != this.FT_Load_Glyph_Wrapper(this.m_pFace, unGID, _LOAD_MODE))
					return;

				var pGlyph = FT_Get_Glyph(this.m_pFace.glyph);
				if (null == pGlyph)
					return;

				var oBBox = new FT_BBox();

				FT_Glyph_Get_CBox(pGlyph, 1, oBBox);
				var xMin = oBBox.xMin;
				var yMin = oBBox.yMin;
				var xMax = oBBox.xMax;
				var yMax = oBBox.yMax;
				FT_Done_Glyph(pGlyph);
				pGlyph = null;

				var pCurentGliph = this.m_pFace.glyph;

				var linearHoriAdvance = pCurentGliph.linearHoriAdvance;
				var units_per_EM = this.m_lUnits_Per_Em;

				oSizes.fAdvanceX = (linearHoriAdvance * this.m_dUnitsKoef / units_per_EM);
				oSizes.oBBox.fMinX = (xMin >> 6);
				oSizes.oBBox.fMaxX = (xMax >> 6);
				oSizes.oBBox.fMinY = (yMin >> 6);
				oSizes.oBBox.fMaxY = (yMax >> 6);

				var dstM = oSizes.oMetrics;
				var srcM = pCurentGliph.metrics;

				dstM.fWidth = (srcM.width >> 6);
				dstM.fHeight = (srcM.height >> 6);
				dstM.fHoriBearingX = (srcM.horiBearingX >> 6);
				dstM.fHoriBearingY = (srcM.horiBearingY >> 6);
				dstM.fHoriAdvance = (srcM.horiAdvance >> 6);
				dstM.fVertBearingX = (srcM.vertBearingX >> 6);
				dstM.fVertBearingY = (srcM.vertBearingY >> 6);
				dstM.fVertAdvance = (srcM.vertAdvance >> 6);

				oSizes.bBitmap = true;
				if (FT_Render_Glyph(pCurentGliph, REND_MODE))
					return;

				var _width = pCurentGliph.bitmap.pitch;
				if (0 != _width)
				{
					oSizes.oBitmap = new TGlyphBitmap();
					oSizes.oBitmap.nX = pCurentGliph.bitmap_left;
					oSizes.oBitmap.nY = pCurentGliph.bitmap_top;
					oSizes.oBitmap.nWidth = pCurentGliph.bitmap.width;
					oSizes.oBitmap.nHeight = pCurentGliph.bitmap.rows;

					var _disable_need_bold = (this.m_pFace.os2 && (this.m_pFace.os2.version != 0xFFFF) && (this.m_pFace.os2.usWeightClass >= 800)) ? true : false;

					var nRowSize = 0;
					if (this.m_bAntiAliasing && !_disable_need_bold)
					{
						if (this.m_bNeedDoBold)
							oSizes.oBitmap.nWidth++;

						nRowSize = oSizes.oBitmap.nWidth;
					}
					else
					{
						nRowSize = (oSizes.oBitmap.nWidth + 7) >> 3;
					}

					if (this.m_bNeedDoBold && this.m_bAntiAliasing && !_disable_need_bold)
					{
						var _width_im = oSizes.oBitmap.nWidth;
						var _height = oSizes.oBitmap.nHeight;

						var nY, nX;
						var pDstBuffer;

						var _input = raster_memory.m_oBuffer.data;
						for (nY = 0, pDstBuffer = 0; nY < _height; ++nY, pDstBuffer += (raster_memory.pitch))
						{
							for (nX = _width_im - 1; nX >= 0; --nX)
							{
								if (0 != nX) // иначе ничего не делаем
								{
									var _pos_x = pDstBuffer + nX * 4 + 3;

									if (_width_im - 1 == nX)
									{
										// последний - просто копируем
										_input[_pos_x] = _input[_pos_x - 4];
									}
									else
									{
										// сдвигаем все вправо
										_input[_pos_x] = Math.min(255, _input[_pos_x - 4] + _input[_pos_x]);
									}
								}
							}
						}
					}

					pCurGlyph.bBitmap = oSizes.bBitmap;
					pCurGlyph.oBitmap = oSizes.oBitmap;

					// new scheme!!! --------------------------
					oSizes.oBitmap.fromAlphaMask(this.m_oFontManager);
					// ----------------------------------------
				}

				_cache_array[oSizes.ushUnicode] = oSizes;
				charSymbolObj = oSizes;
			}
			else
			{
				var nCMapIndex = charSymbolObj.nCMapIndex;
				unGID = charSymbolObj.ushGID;
				var eState = charSymbolObj.eState;

				if (EGlyphState.glyphstateMiss == eState)
				{
					pCurGlyph.fX = fPenX;
					pCurGlyph.fY = fPenY;

					pCurGlyph.fLeft = fLeft;
					pCurGlyph.fTop = fTop;
					pCurGlyph.fRight = fRight;
					pCurGlyph.fBottom = fBottom;

					pCurGlyph.eState = EGlyphState.glyphstateMiss;

					fPenX += charSymbolObj.fAdvanceX + this.m_fCharSpacing;
					unPrevGID = 0;

					return;
				}
				else if (EGlyphState.glyphstateDeafault == eState)
				{
					pCurGlyph.eState = EGlyphState.glyphstateDeafault;
					//pFace = pDefFace;
				}
				else
				{
					pCurGlyph.eState = EGlyphState.glyphstateNormal;
					//pFace = pSrcFace;
				}

				/*
				 if (0 != this.m_nNum_charmaps)
				 {
				 var nCharmap = this.m_pFace.charmap;
				 var nCurCMapIndex = FT_Get_Charmap_Index(nCharmap);
				 if (nCurCMapIndex != nCMapIndex)
				 {
				 nCMapIndex = Math.max(0, nCMapIndex);
				 nCharmap = this.m_pFace.charmaps[nCMapIndex];
				 FT_Set_Charmap(this.m_pFace, nCharmap);
				 }
				 }
				 */

				// кернинга нету пока.
				if (true)
				{
					var fX = pString.m_fX + fPenX;
					var fY = pString.m_fY + fPenY;

					var _m = pString.m_arrCTM;

					// ��������� ����� ������������ ����� ������ �� ���������� �������
					pCurGlyph.fX = (_m[4] + fX * _m[0] + fY * _m[2] - pString.m_fX);
					pCurGlyph.fY = (_m[5] + fX * _m[1] + fY * _m[3] - pString.m_fY);
				}

				//pString.SetMetrics (nIndex, charSymbolObj.oMetrics.fWidth, charSymbolObj.oMetrics.fHeight, charSymbolObj.oMetrics.fHoriAdvance, charSymbolObj.oMetrics.fHoriBearingX, charSymbolObj.oMetrics.fHoriBearingY, charSymbolObj.oMetrics.fVertAdvance, charSymbolObj.oMetrics.fVertBearingX, charSymbolObj.oMetrics.fVertBearingY);
				pCurGlyph.oMetrics = charSymbolObj.oMetrics;

				/*
				 pCurGlyph.fLeft   = charSymbolObj.oBBox.fMinX;
				 pCurGlyph.fTop    = charSymbolObj.oBBox.fMaxY;
				 pCurGlyph.fRight  = charSymbolObj.oBBox.fMaxX;
				 pCurGlyph.fBottom = charSymbolObj.oBBox.fMinY;
				 */

				pCurGlyph.bBitmap = charSymbolObj.bBitmap;
				pCurGlyph.oBitmap = charSymbolObj.oBitmap;
			}

			fPenX += charSymbolObj.fAdvanceX + this.m_fCharSpacing;
			if (this.m_bNeedDoBold && this.m_oFontManager.IsAdvanceNeedBoldFonts)
			{
				// Когда текст делаем жирным сами, то мы увеличиваем расстояние на 1 пиксель в ширину (независимо от DPI и размера текста всегда 1 пиксель)
				//fPenX += 1;
				fPenX += this.m_unHorDpi / 72;
			}

			pString.m_fEndX = fPenX + pString.m_fX;
			pString.m_fEndY = fPenY + pString.m_fY;


			if (this.m_bIsNeedUpdateMatrix12)
			{
				if (this.m_pDefaultFont)
					this.m_pDefaultFont.UpdateMatrix2();
				this.UpdateMatrix2();
			}
		}

		this.SetCMapForCharCode = function (lUnicode, pnCMapIndex)
		{
			if (this.m_bStringGID || !this.m_pFace || 0 == this.m_nNum_charmaps)
				return lUnicode;

			var nCharIndex = 0;

			var charMapArray = this.m_pFace.charmaps;
			for (var nIndex = 0; nIndex < this.m_nNum_charmaps; ++nIndex)
			{
				var pCMap = charMapArray[nIndex];
				var pCharMap = __FT_CharmapRec(pCMap);

				if (0 != FT_Set_Charmap(this.m_pFace, pCMap))
					continue;

				var pEncoding = pCharMap.encoding;

				if (FT_ENCODING_UNICODE == pEncoding)
				{
					if ((nCharIndex = FT_Get_Char_Index(this.m_pFace, lUnicode)) != 0)
					{
						pnCMapIndex.index = nIndex;
						return nCharIndex;
					}
				}
				else if (FT_ENCODING_NONE == pEncoding || FT_ENCODING_MS_SYMBOL == pEncoding || FT_ENCODING_APPLE_ROMAN == pEncoding)
				{
					/*
					 var res_code = FT_Get_First_Char(this.m_pFace);
					 while (res_code.gindex != 0)
					 {
					 res_code = FT_Get_Next_Char(this.m_pFace, res_code.char_code);
					 if (res_code.char_code == lUnicode)
					 {
					 nCharIndex = res_code.gindex;
					 pnCMapIndex.index = nIndex;
					 break;
					 }
					 }
					 */

					nCharIndex = FT_Get_Char_Index(this.m_pFace, lUnicode);
					if (0 != nCharIndex)
						pnCMapIndex.index = nIndex;
				}
			}

			return nCharIndex;
		}

		this.GetChar = function (lUnicode, is_raster_distances)
		{
			var pFace = this.m_pFace;
			var pCurentGliph = pFace.glyph;

			var Result;
			var ushUnicode = lUnicode;

			// Сначала мы все рассчитываем исходя только из матрицы шрифта FontMatrix
			if (this.m_bIsNeedUpdateMatrix12)
			{
				if (this.m_pDefaultFont)
					this.m_pDefaultFont.UpdateMatrix1();
				this.UpdateMatrix1();
			}

			var unGID = 0;

			var _cache_array = (this.m_bStringGID === false) ? this.m_arrCacheSizes : this.m_arrCacheSizesGid;

			var charSymbolObj = _cache_array[ushUnicode];
			if (undefined == charSymbolObj)
			{
				var nCMapIndex = new CCMapIndex();
				unGID = this.SetCMapForCharCode(ushUnicode, nCMapIndex);

				var oSizes = new TFontCacheSizes();
				oSizes.ushUnicode = ushUnicode;

				if (!((unGID > 0) || (-1 != this.m_nSymbolic && (ushUnicode < 0xF000) && 0 < (unGID = this.SetCMapForCharCode(ushUnicode + 0xF000, nCMapIndex)))))
				{
					// Пробуем загрузить через стандартный шрифт
					if (false === this.m_bUseDefaultFont || null == this.m_pDefaultFont || 0 >= (unGID = this.m_pDefaultFont.SetCMapForCharCode(ushUnicode, nCMapIndex)))
					{
						if (this.m_nDefaultChar < 0)
						{
							oSizes.ushGID = -1;
							oSizes.eState = EGlyphState.glyphstateMiss;
							var max_advance = pFace.size.metrics.max_advance;
							oSizes.fAdvanceX = (max_advance >> 6) / 2.0;

							return;
						}
						else
						{
							unGID = this.m_nDefaultChar;
							oSizes.eState = EGlyphState.glyphstateNormal;

							pFace = this.m_pFace;
							pCurentGliph = pFace.glyph;
						}
					}
					else
					{
						oSizes.eState = EGlyphState.glyphstateDeafault;

						pFace = this.m_pDefaultFont.m_pFace;
						pCurentGliph = this.m_pDefaultFont.m_pGlyph;
					}
				}
				else
				{
					oSizes.eState = EGlyphState.glyphstateNormal;
				}

				oSizes.ushGID = unGID;
				oSizes.nCMapIndex = nCMapIndex.index;

				var _LOAD_MODE = this.GetCharLoadMode();
				if (0 != this.FT_Load_Glyph_Wrapper(pFace, unGID, _LOAD_MODE))
					return;

				var pGlyph = FT_Get_Glyph(pCurentGliph);
				if (null == pGlyph)
					return;

				var oBBox = new FT_BBox();

				FT_Glyph_Get_CBox(pGlyph, 1, oBBox);
				var xMin = oBBox.xMin;
				var yMin = oBBox.yMin;
				var xMax = oBBox.xMax;
				var yMax = oBBox.yMax;
				FT_Done_Glyph(pGlyph);
				pGlyph = null;

				var linearHoriAdvance = pCurentGliph.linearHoriAdvance;
				var units_per_EM = this.m_lUnits_Per_Em;

				oSizes.fAdvanceX = (linearHoriAdvance * this.m_dUnitsKoef / units_per_EM);
				oSizes.oBBox.fMinX = (xMin >> 6);
				oSizes.oBBox.fMaxX = (xMax >> 6);
				oSizes.oBBox.fMinY = (yMin >> 6);
				oSizes.oBBox.fMaxY = (yMax >> 6);

				if (this.m_bNeedDoBold && this.m_oFontManager.IsAdvanceNeedBoldFonts)
					oSizes.fAdvanceX += 1;

				var dstM = oSizes.oMetrics;
				var srcM = pCurentGliph.metrics;

				dstM.fWidth = (srcM.width >> 6);
				dstM.fHeight = (srcM.height >> 6);
				dstM.fHoriBearingX = (srcM.horiBearingX >> 6);
				dstM.fHoriBearingY = (srcM.horiBearingY >> 6);
				dstM.fHoriAdvance = (srcM.horiAdvance >> 6);
				dstM.fVertBearingX = (srcM.vertBearingX >> 6);
				dstM.fVertBearingY = (srcM.vertBearingY >> 6);
				dstM.fVertAdvance = (srcM.vertAdvance >> 6);

				oSizes.bBitmap = false;
				oSizes.oBitmap = null;

				if (is_raster_distances === true)
				{
					if (0 == FT_Render_Glyph(pCurentGliph, REND_MODE))
					{
						oSizes.oBBox.rasterDistances = get_raster_bounds(raster_memory.m_oBuffer.data, pCurentGliph.bitmap.width, pCurentGliph.bitmap.rows, raster_memory.pitch);
					}
				}

				_cache_array[oSizes.ushUnicode] = oSizes;
				Result = oSizes;
			}
			else
			{
				var nCMapIndex = charSymbolObj.nCMapIndex;
				unGID = charSymbolObj.ushGID;
				var eState = charSymbolObj.eState;

				if (EGlyphState.glyphstateMiss == eState)
				{
					return;
				}
				else if (EGlyphState.glyphstateDeafault == eState)
				{
					//pFace = pDefFace;
				}
				else // if ( glyphstateNormal == eState )
				{
					//pFace = pSrcFace;
				}

				/*
				 if (0 != this.m_nNum_charmaps)
				 {
				 var nCharmap = pFace.charmap;
				 var nCurCMapIndex = FT_Get_Charmap_Index(nCharmap);
				 if (nCurCMapIndex != nCMapIndex)
				 {
				 nCMapIndex = Math.max(0, nCMapIndex);
				 nCharmap = this.m_pFace.charmaps[nCMapIndex];
				 FT_Set_Charmap(this.m_pFace, nCharmap);
				 }
				 }
				 */

				Result = charSymbolObj;
			}

			if (this.m_bIsNeedUpdateMatrix12)
			{
				if (this.m_pDefaultFont)
					this.m_pDefaultFont.UpdateMatrix2();
				this.UpdateMatrix2();
			}

			return Result;
		}

		this.GetKerning = function (unPrevGID, unGID)
		{
			var pDelta = new FT_Vector();
			FT_Get_Kerning(this.m_pFace, unPrevGID, unGID, 0, pDelta);
			return (pDelta.x >> 6);
		}

		this.SetStringGID = function (bGID)
		{
			if (this.m_bStringGID == bGID)
				return;

			//this.ClearCache();
			this.m_bStringGID = bGID;
		}
		this.GetStringGID = function ()
		{
			return this.m_bStringGID;
		}
		this.SetUseDefaultFont = function (bUse)
		{
			this.m_bUseDefaultFont = bUse;
		}
		this.GetUseDefaultFont = function ()
		{
			return this.m_bUseDefaultFont;
		}
		this.SetCharSpacing = function (fCharSpacing)
		{
			this.m_fCharSpacing = fCharSpacing;
		}
		this.GetCharSpacing = function ()
		{
			return this.m_fCharSpacing;
		}

		this.GetStyleName = function ()
		{
			return this.m_pFace.style_name;
		}

		this.UpdateStyles = function (bBold, bItalic)
		{
			var sStyle = this.GetStyleName();

			// Смотрим какой стиль у исходного шрифта
			var bSrcBold = (-1 != sStyle.indexOf("Bold"));
			var bSrcItalic = (-1 != sStyle.indexOf("Italic"));

			if (!bBold) // Нам нужен не жирный шрифт
			{
				this.m_bNeedDoBold = false;
			}
			else if (bBold) // Нам нужно сделать шрифт жирным
			{
				if (bSrcBold)
				{
					// Исходный шрифт уже жирный, поэтому ничего дополнительного делать не надо
					this.m_bNeedDoBold = false;
				}
				else
				{
					// Иходный шрифт не жирный, поэтому жирность делаем сами
					this.m_bNeedDoBold = true;
				}
			}

			if (!bItalic) // Нам нужен не наклонный шрифт
			{
				this.SetItalic(false);
			}
			else if (bItalic) // Нам нужно сделать наклонный шрифт
			{
				if (bSrcItalic)
				{
					// Исходный шрифт уже наклонный, поэтому ничего дополнительного делать не надо
					this.SetItalic(false);
				}
				else
				{
					// Иходный шрифт не наклонный, поэтому делаем его наклонным сами
					this.SetItalic(true);
				}
			}

		}

		this.SetItalic = function (value)
		{
			if (this.m_bNeedDoItalic != value)
			{
				this.ClearCache();
				this.m_bNeedDoItalic = value;
				this.ResetFontMatrix();
			}
		}
		this.SetNeedBold = function (value)
		{
			if (this.m_bNeedDoBold != value)
				this.ClearCache();

			this.m_bNeedDoBold = value;
		}

		this.ReleaseFontFace = function ()
		{
			this.m_pFace = null;
		}

		this.IsSuccess = function ()
		{
			return (0 == this.m_nError);
		}

		this.GetAscender = function ()
		{
			return this.m_lAscender;
		}
		this.GetDescender = function ()
		{
			return this.m_lDescender;
		}
		this.GetHeight = function ()
		{
			return this.m_lLineHeight;
		}
		this.Units_Per_Em = function ()
		{
			return this.m_lUnits_Per_Em;
		}

		this.CheckHintsSupport = function ()
		{
			this.HintsSupport = true;

			if (!this.m_pFace || !this.m_pFace.driver || !this.m_pFace.driver.clazz)
				return;

			if (this.m_pFace.driver.clazz.name != "truetype")
			{
				this.HintsSupport = false;
				return;
			}

			if (this.m_pFace.family_name == "MS Mincho" ||
				this.m_pFace.family_name == "Castellar")
			{
				this.HintsSupport = false;
			}
			else if (this.m_pFace.family_name == "Microsoft JhengHei UI Light" ||
				this.m_pFace.family_name == "Kalinga")
			{
				this.HintsSubpixelSupport = false;
			}
		}

		this.GetCharLoadMode = function ()
		{
			return (this.HintsSupport && this.HintsSubpixelSupport) ? this.m_oFontManager.LOAD_MODE : 40970;
		}

		this.GetCharPath = function (lUnicode, worker, x, y)
		{
			var pFace = this.m_pFace;
			var pCurentGliph = pFace.glyph;

			var Result;
			var ushUnicode = lUnicode;

			// Сначала мы все рассчитываем исходя только из матрицы шрифта FontMatrix
			if (this.m_bIsNeedUpdateMatrix12)
			{
				if (this.m_pDefaultFont)
					this.m_pDefaultFont.UpdateMatrix1();
				this.UpdateMatrix1();
			}

			var unGID = 0;
			var nCMapIndex = new CCMapIndex();
			unGID = this.SetCMapForCharCode(ushUnicode, nCMapIndex);

			if (!((unGID > 0) || (-1 != this.m_nSymbolic && (ushUnicode < 0xF000) &&
				0 < (unGID = this.SetCMapForCharCode(ushUnicode + 0xF000, nCMapIndex)))))
			{
				// Пробуем загрузить через стандартный шрифт
				if (false === this.m_bUseDefaultFont || null == this.m_pDefaultFont ||
					0 >= (unGID = this.m_pDefaultFont.SetCMapForCharCode(ushUnicode, nCMapIndex)))
				{
					if (this.m_nDefaultChar < 0)
					{
						return;
					}
					else
					{
						unGID = this.m_nDefaultChar;

						pFace = this.m_pFace;
						pCurentGliph = pFace.glyph;
					}
				}
				else
				{
					pFace = this.m_pDefaultFont.m_pFace;
					pCurentGliph = this.m_pDefaultFont.m_pGlyph;
				}
			}

			var _LOAD_MODE = this.GetCharLoadMode();
			if (0 != this.FT_Load_Glyph_Wrapper(pFace, unGID, _LOAD_MODE))
				return;

			var pGlyph = FT_Get_Glyph(pCurentGliph);
			if (null == pGlyph)
				return;

			var _painter = new CGlyphVectorPainter();
			_painter.KoefX = 25.4 / this.m_unHorDpi;
			_painter.KoefY = 25.4 / this.m_unVerDpi;

			if (x !== undefined)
				_painter.X = x;
			if (y !== undefined)
				_painter.Y = y;

			_painter.start(worker);
			FT_Outline_Decompose(pGlyph.outline, _painter, worker);
			_painter.end(worker);

			if (this.m_bIsNeedUpdateMatrix12)
			{
				if (this.m_pDefaultFont)
					this.m_pDefaultFont.UpdateMatrix2();
				this.UpdateMatrix2();
			}
		}

		this.GetStringPath = function (string, worker)
		{
			var _len = string.GetLength();
			if (_len <= 0)
				return true;

			for (var nIndex = 0; nIndex < _len; ++nIndex)
			{
				var _glyph = string.m_pGlyphsBuffer[nIndex];
				var _x = string.m_fX + 25.4 * _glyph.fX / this.m_unHorDpi;
				var _y = string.m_fY + 25.4 * _glyph.fY / this.m_unVerDpi;

				worker._s();
				this.GetCharPath(_glyph.lUnicode, worker, _x, _y);
				worker.df();
				worker._e();
			}
		}
	}

	//--------------------------------------------------------export------------------------------------------------------
	window['AscFonts'] = window['AscFonts'] || {};
	window['AscFonts'].EGlyphState = EGlyphState;
	window['AscFonts'].CFontFile = CFontFile;
})(window);