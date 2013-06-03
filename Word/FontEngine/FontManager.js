function LoadFontFile(library, stream_index, name, faceindex)
{
    var args = new FT_Open_Args();
    args.flags = 0x02;
    args.stream = g_fonts_streams[stream_index];

    var face = library.FT_Open_Face(args, faceindex);
    if (null == face)
        return null;

    var font = new CFontFile(name, faceindex);

    font.m_lUnits_Per_Em = face.units_per_EM;
    font.m_lAscender = face.ascender;
    font.m_lDescender = face.descender;
    font.m_lLineHeight = face.height;

    font.m_nNum_charmaps = face.num_charmaps;
    //if (null == face.charmap && 0 != this.m_nNum_charmaps)
    //    alert('loadCharmap');

    font.m_pFace = face;
    font.LoadDefaultCharAndSymbolicCmapIndex();
    font.m_nError = FT_Set_Char_Size(face, 0, font.m_fSize * 64, 0, 0);

    if (!font.IsSuccess())
    {
        font = null;
        face = null;
        return null;
    }

    font.ResetTextMatrix();
    font.ResetFontMatrix();

    if (true === this.m_bUseKerning)
    {
        this.m_bUseKerning = ((face.face_flags & 64) != 0 ? true : false);
    }

    return font;
}

function CFontFilesCache()
{
    this.m_oLibrary = null;
    this.m_lMaxSize = 1000;
    this.m_lCurrentSize = 0;
    this.Fonts = {};

    this.LockFont = function(stream_index, fontName, faceIndex, fontSize)
    {
        var key = fontName + faceIndex + parseInt(fontSize);
        var pFontFile = this.Fonts[key];
        if (pFontFile)
            return pFontFile;

        pFontFile = this.Fonts[key] = LoadFontFile(this.m_oLibrary, stream_index, fontName, faceIndex);
        return pFontFile;
    }
}

function CDefaultFont()
{
    this.m_oLibrary = null;
    this.m_arrDefaultFont = new Array(4);
    this.SetDefaultFont = function(sFamilyName)
    {
        var fontInfo = g_font_infos[map_font_index[sFamilyName]];
        var font = null;

        font = g_font_infos[fontInfo.indexR];
        this.m_arrDefaultFont[0] = this.m_oLibrary.LoadFont(font.stream_index, font.id, fontInfo.faceIndexR);
        this.m_arrDefaultFont[0].UpdateStyles(false, false);

        font = g_font_infos[fontInfo.indexB];
        this.m_arrDefaultFont[1] = this.m_oLibrary.LoadFont(font.stream_index, font.id, fontInfo.faceIndexB);
        this.m_arrDefaultFont[1].UpdateStyles(true, false);

        font = g_font_infos[fontInfo.indexI];
        this.m_arrDefaultFont[2] = this.m_oLibrary.LoadFont(font.stream_index, font.id, fontInfo.faceIndexI);
        this.m_arrDefaultFont[2].UpdateStyles(false, true);

        font = g_font_infos[fontInfo.indexBI];
        this.m_arrDefaultFont[3] = this.m_oLibrary.LoadFont(font.stream_index, font.id, fontInfo.faceIndexBI);
        this.m_arrDefaultFont[3].UpdateStyles(true, true);
    }

    this.GetDefaultFont = function(bBold, bItalic)
    {
        var nIndex = (bBold ? 1 : 0) + (bItalic ? 2 : 0);
        return this.m_arrDefaultFont[nIndex];
    }
}
var FONT_ITALIC_ANGLE = 0.3090169943749;
var FT_ENCODING_UNICODE = 1970170211;
var FT_ENCODING_NONE = 0;
var FT_ENCODING_MS_SYMBOL = 1937337698;
var FT_ENCODING_APPLE_ROMAN = 1634889070;

var LOAD_MODE = 40970;
var REND_MODE = 0;

var FontStyle =
{
    FontStyleRegular:    0,
    FontStyleBold:       1,
    FontStyleItalic:     2,
    FontStyleBoldItalic: 3,
    FontStyleUnderline:  4,
    FontStyleStrikeout:  8
};

var EGlyphState = 
{
	glyphstateNormal:   0,  // символ отрисовался в нужном шрифте
	glyphstateDeafault: 1,  // символ отрисовался в дефолтовом шрифте
	glyphstateMiss:     2   // символ не отрисовался
};

function CPoint1()
{
	this.fX = 0;
	this.fY = 0;
	this.fWidth = 0;
	this.fHeight = 0;
}

function CPoint2()
{
	this.fLeft = 0;
	this.fTop = 0;
	this.fRight = 0;
	this.fBottom = 0;
}

function CGlyphData()
{
    this.m_oCanvas  = null;
    this.m_oContext = null;
    this.R          = 0;
    this.G          = 0;
    this.B          = 0;

    this.init = function(width,height)
    {
        if (width == 0 || height == 0)
            return;

        this.m_oCanvas = document.createElement('canvas');

        this.m_oCanvas.width = width;
        this.m_oCanvas.height = height;
        
        this.m_oContext = this.m_oCanvas.getContext('2d');
        this.m_oContext.globalCompositeOperation = "source-atop";
    }
    this.checkColor = function(r,g,b,w,h)
    {
        if ((r == this.R) && (g == this.G) && (b == this.B))
            return;
        this.R = r;
        this.G = g;
        this.B = b;
        this.m_oContext.fillStyle = "rgb(" + this.R + "," + this.G + "," + this.B + ")";
        this.m_oContext.fillRect(0,0,w,h);
    }
}

function TGlyphBitmap()
{
	this.nX = 0;            // Сдвиг по X начальной точки для рисования символа
    this.nY = 0;            // Сдвиг по Y начальной точки для рисования символа
    this.nWidth = 0;        // Ширина символа
    this.nHeight = 0;       // Высота символа

    this.oGlyphData = new CGlyphData();

    this.fromAlphaMask = function()
    {
        this.oGlyphData.init(this.nWidth,this.nHeight);

        if (true)
        {
            if (null != this.oGlyphData.m_oContext)
                this.oGlyphData.m_oContext.putImageData(raster_memory.m_oBuffer,0,0,0,0,this.nWidth,this.nHeight);
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

            this.oGlyphData.m_oContext.putImageData(raster_memory.m_oBuffer,0,0,0,0,this.nWidth,this.nHeight);
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
    }
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

function TGlyph()
{
	this.lUnicode = 0; // Юникод
	this.fX = 0;       // Позиция глифа
	this.fY = 0;       // на BaseLine

	this.fLeft = 0;    //
	this.fTop = 0;     // BBox
	this.fRight = 0;   //
	this.fBottom = 0;  //
	
	this.oMetrics = null;

	this.eState = EGlyphState.glyphstateNormal;

	this.bBitmap = false;
	this.oBitmap = null;
	
	this.Clear = function()
	{
		this.bBitmap = false;
		this.eState = EGlyphState.glyphstateNormal;
	}
}

function TBBox()
{
	this.fMinX;
	this.fMaxX;
	this.fMinY;
	this.fMaxY;
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

function CGlyphString()
{
	this.m_fX = 0;
	this.m_fY = 0;

	this.m_fEndX = 0;
	this.m_fEndY = 0;

	this.m_nGlyphIndex   = -1;
	this.m_nGlyphsCount  = 0;
	this.m_pGlyphsBuffer = new Array(100);

	this.m_arrCTM = new Array();
	this.m_dIDet = 1;

	this.m_fTransX = 0;
	this.m_fTransY = 0;
	
	this.SetString = function(wsString, fX, fY)
	{
		this.m_fX = fX + this.m_fTransX;
		this.m_fY = fY + this.m_fTransY;

		this.m_nGlyphsCount = wsString.length;
		this.m_nGlyphIndex  = 0;
		
		//this.m_pGlyphsBuffer = new Array(this.m_nGlyphsCount);

		for (var nIndex = 0; nIndex < this.m_nGlyphsCount; ++nIndex)
		{
			if (undefined == this.m_pGlyphsBuffer[nIndex])
				this.m_pGlyphsBuffer[nIndex] = new TGlyph();
			else
				this.m_pGlyphsBuffer[nIndex].Clear();
			this.m_pGlyphsBuffer[nIndex].lUnicode = wsString.charCodeAt(nIndex);
			this.m_pGlyphsBuffer[nIndex].bBitmap  = false;
		}
	}
	this.SetStringGID = function(gid, fX, fY)
	{
		this.m_fX = fX + this.m_fTransX;
		this.m_fY = fY + this.m_fTransY;

		this.m_nGlyphsCount = 1;
		this.m_nGlyphIndex  = 0;
		
		//this.m_pGlyphsBuffer = new Array(this.m_nGlyphsCount);

		for (var nIndex = 0; nIndex < this.m_nGlyphsCount; ++nIndex)
		{
			if (undefined == this.m_pGlyphsBuffer[nIndex])
				this.m_pGlyphsBuffer[nIndex] = new TGlyph();
			else
				this.m_pGlyphsBuffer[nIndex].Clear();
			this.m_pGlyphsBuffer[nIndex].lUnicode = gid;
			this.m_pGlyphsBuffer[nIndex].bBitmap  = false;
		}
	}
	
	this.GetLength = function()
	{
		return this.m_nGlyphsCount;
	}
	
	this.GetAt = function(nIndex)
	{
		if (this.m_nGlyphsCount <= 0)
			return null;

		var nCurIndex = Math.min (this.m_nGlyphsCount - 1, Math.max(0, nIndex));
		return this.m_pGlyphsBuffer[nCurIndex];
	}
	
	this.SetStartPoint = function(nIndex, fX, fY)
	{
		if (this.m_nGlyphsCount <= 0)
			return;

		var nCurIndex = Math.min (this.m_nGlyphsCount - 1, Math.max(0, nIndex));

		this.m_pGlyphsBuffer[nCurIndex].fX = fX;
		this.m_pGlyphsBuffer[nCurIndex].fY = fY;
	}
	
	this.SetState = function(nIndex, eState)
	{
		if (this.m_nGlyphsCount <= 0)
			return;

		var nCurIndex = Math.min (this.m_nGlyphsCount - 1, Math.max(0, nIndex));

		this.m_pGlyphsBuffer[nCurIndex].eState = eState;
	}
	
	this.SetBBox = function (nIndex, fLeft, fTop, fRight, fBottom)
	{
		if (this.m_nGlyphsCount <= 0)
			return;

		var nCurIndex = Math.min (this.m_nGlyphsCount - 1, Math.max (0, nIndex));

        var _g = this.m_pGlyphsBuffer[nCurIndex];
        _g.fLeft   = fLeft;
        _g.fTop    = fTop;
        _g.fRight  = fRight;
        _g.fBottom = fBottom;
	}
	
	this.SetMetrics = function (nIndex, fWidth, fHeight, fHoriAdvance, fHoriBearingX, fHoriBearingY, fVertAdvance, fVertBearingX, fVertBearingY)
	{
		if (this.m_nGlyphsCount <= 0)
			return;

		var nCurIndex = Math.min (this.m_nGlyphsCount - 1, Math.max (0, nIndex));

        var _g = this.m_pGlyphsBuffer[nCurIndex];
        _g.oMetrics.fHeight       = fHeight;
        _g.oMetrics.fHoriAdvance  = fHoriAdvance;
        _g.oMetrics.fHoriBearingX = fHoriBearingX;
        _g.oMetrics.fHoriBearingY = fHoriBearingY;
        _g.oMetrics.fVertAdvance  = fVertAdvance;
        _g.oMetrics.fVertBearingX = fVertBearingX;
        _g.oMetrics.fVertBearingY = fVertBearingY;
        _g.oMetrics.fWidth        = fWidth;
	}
	
	this.ResetCTM = function()
	{
        var m = this.m_arrCTM;
        m[0] = 1;
        m[1] = 0;
        m[2] = 0;
        m[3] = 1;
        m[4] = 0;
        m[5] = 0;

		this.m_dIDet      = 1;
	}
	
	this.GetBBox = function(nIndex, nType)
	{
		var oPoint = new CPoint2();
		if (typeof nIndex == "undefined")
			nIndex = -1;
		if (typeof nType == "undefined")
			nType = 0;
			
		var nCurIndex = 0;
		if (nIndex < 0)
		{
			if (this.m_nGlyphsCount <= 0 || this.m_nGlyphIndex < 1 || this.m_nGlyphIndex > this.m_nGlyphsCount)
				return oPoint;

			nCurIndex = this.m_nGlyphIndex - 1;
		}
		else
		{
			if (this.m_nGlyphsCount <= 0)
				return oPoint;

			nCurIndex = Math.min(this.m_nGlyphsCount - 1, Math.max(0, nIndex));
		}

        var _g = this.m_pGlyphsBuffer[nCurIndex];
        var m = this.m_arrCTM;

		var fBottom = -_g.fBottom;
		var fRight  =  _g.fRight;
		var fLeft   =  _g.fLeft;
		var fTop    = -_g.fTop;


		if (0 == nType && !(1 == m[0] && 0 == m[1] && 0 == m[2] && 1 == m[3] && 0 == m[4] && 0 == m[5]))
		{
			// Применяем глобальную матрицу преобразования и пересчитываем BBox
			var arrfX =[fLeft, fLeft, fRight, fRight];
			var arrfY = [fTop, fBottom, fBottom, fTop];

			var fMinX = (arrfX[0] * m[0] + arrfY[0] * m[2]);
			var fMinY = (arrfX[0] * m[1] + arrfY[0] * m[3]);
			var fMaxX = fMinX;
			var fMaxY = fMinY;
			
			for (var nIndex = 1; nIndex < 4; ++nIndex)
			{
				var fX = (arrfX[nIndex] * m[0] + arrfY[nIndex] * m[2]);
				var fY = (arrfX[nIndex] * m[1] + arrfY[nIndex] * m[3]);

				fMaxX = Math.max(fMaxX, fX);
				fMinX = Math.min(fMinX, fX);

				fMaxY = Math.max(fMaxY, fY);
				fMinY = Math.min(fMinY, fY);
			}

			fLeft   = fMinX;
			fRight  = fMaxX;
			fTop    = fMinY;
			fBottom = fMaxY;
		}

		oPoint.fLeft   = fLeft   + _g.fX + this.m_fX;
		oPoint.fRight  = fRight  + _g.fX + this.m_fX;
		oPoint.fTop    = fTop    + _g.fY + this.m_fY;
		oPoint.fBottom = fBottom + _g.fY + this.m_fY;
		
		return oPoint;
	}
	this.GetBBox2 = function()
	{
		var oPoint = new CPoint2();
		if (this.m_nGlyphsCount <= 0)
			return oPoint;

		var fBottom = 0;
		var fRight  = 0;
		var fLeft   = 0;
		var fTop    = 0;

		for (var nIndex = 0; nIndex < this.m_nGlyphsCount; ++nIndex)
		{
			fBottom = Math.max(fBottom, -this.m_pGlyphsBuffer[nIndex].fBottom);
			fTop    = Math.min(fTop, -this.m_pGlyphsBuffer[nIndex].fTop);
		}
        var m = this.m_arrCTM;
		if (!(1 == m[0] && 0 == m[1] && 0 == m[2] && 1 == m[3] && 0 == m[4] && 0 == m[5]))
		{
			// Применяем глобальную матрицу преобразования и пересчитываем BBox
			var arrfX = [fLeft, fLeft, fRight, fRight];
			var arrfY = [fTop, fBottom, fBottom, fTop];

			var fMinX = (arrfX[0] * m[0] + arrfY[0] * m[2]);
			var fMinY = (arrfX[0] * m[1] + arrfY[0] * m[3]);
			var fMaxX = fMinX;
			var fMaxY = fMinY;
			
			for (var nIndex = 1; nIndex < 4; ++nIndex)
			{
				var fX = (arrfX[nIndex] * m[0] + arrfY[nIndex] * m[2]);
				var fY = (arrfX[nIndex] * m[1] + arrfY[nIndex] * m[3]);

				fMaxX = Math.max (fMaxX, fX);
				fMinX = Math.min (fMinX, fX);

				fMaxY = Math.max (fMaxY, fY);
				fMinY = Math.min (fMinY, fY);
			}

			fLeft   = fMinX;
			fRight  = fMaxX;
			fTop    = fMinY;
			fBottom = fMaxY;
		}

		fLeft   += this.m_fX;
		fRight  += this.m_fX;
		fTop    += this.m_fY;
		fBottom += this.m_fY; 

		oPoint.fLeft  = Math.min (fLeft, Math.min (this.m_fX, this.m_fEndX));
		oPoint.fRight = Math.max (fRight, Math.max (this.m_fX, this.m_fEndX));
		oPoint.fTop   = Math.min (fTop, Math.min (this.m_fY, this.m_fEndY));
		oPoint.fBottom = Math.max (fBottom, Math.max (this.m_fY, this.m_fEndY));
		
		return oPoint;
	}
	
	this.GetNext = function()
	{
		if (this.m_nGlyphIndex >= this.m_nGlyphsCount || this.m_nGlyphIndex < 0)
			return undefined;

		return this.m_pGlyphsBuffer[this.m_nGlyphIndex++];
	}
	
	this.SetTrans = function(fX, fY)
	{
        var m = this.m_arrCTM;
		this.m_fTransX = this.m_dIDet * (fX * m[3] - m[2] * fY);
		this.m_fTransY = this.m_dIDet * (fY * m[0] - m[1] * fX);
	}
	
	this.SetCTM = function(fA, fB, fC, fD, fE , fF)
	{
        var m = this.m_arrCTM;
        m[0] = fA;
        m[1] = fB;
        m[2] = fC;
        m[3] = fD;
        m[4] = fE;
        m[5] = fF;

		var dDet = fA * fD - fB * fC;

		if (dDet < 0.001 && dDet >= 0)
			dDet =  0.001;
		else if (dDet > - 0.001 && dDet < 0)
			dDet = -0.001;

		this.m_dIDet = 1 / dDet;
	}
}

function CFontManager()
{
	this.m_oLibrary = null;
	
	this.m_pFont = null;
	this.m_oGlyphString = new CGlyphString();
	
	this.error = 0;

	this.fontName = undefined;

    this.m_bUseDefaultFont = false;
    this.m_fCharSpacing = 0.0;
    this.m_bStringGID = false;

    this.m_oFontsCache = null;
    this.m_oDefaultFont = new CDefaultFont();

    this.m_lUnits_Per_Em = 0;
    this.m_lAscender = 0;
    this.m_lDescender = 0;
    this.m_lLineHeight = 0;

    this.AfterLoad = function()
    {
        if (null == this.m_pFont)
        {
            this.m_lUnits_Per_Em = 0;
            this.m_lAscender = 0;
            this.m_lDescender = 0;
            this.m_lLineHeight = 0;
        }
        else
        {
            var f = this.m_pFont;
            this.m_lUnits_Per_Em = f.m_lUnits_Per_Em;
            this.m_lAscender = f.m_lAscender;
            this.m_lDescender = f.m_lDescender;
            this.m_lLineHeight = f.m_lLineHeight;
        }
    }

    this.Initialize = function()
    {
        this.m_oLibrary = new FT_Library();
        this.m_oLibrary.Init();

        this.m_oFontsCache = new CFontFilesCache();
        this.m_oFontsCache.m_oLibrary = this.m_oLibrary;
    }

    this.SetDefaultFont = function(name)
    {
        this.m_oDefaultFont.m_oLibrary = this.m_oLibrary;
        this.m_oDefaultFont.SetDefaultFont(name);
    }

    this.UpdateSize = function(dOldSize, dDpi, dNewDpi)
	{
		if (0 == dNewDpi)
			dNewDpi = 72.0;
		if (0 == dDpi)
			dDpi = 72.0;

		return dOldSize * dDpi / dNewDpi;
	}
	
	this.LoadString = function(wsBuffer, fX, fY)
	{
		if (!this.m_pFont)
			return false;
		
		this.m_oGlyphString.SetString(wsBuffer, fX, fY);
		this.m_pFont.GetString(this.m_oGlyphString);
		
		return true;
	}
	
	this.LoadString2 = function(wsBuffer, fX, fY)
	{
		if (!this.m_pFont)
			return false;

		this.m_oGlyphString.SetString(wsBuffer, fX, fY);
		this.m_pFont.GetString2(this.m_oGlyphString);
		
		return true;
	}
	this.LoadString3 = function(gid, fX, fY)
	{
		if (!this.m_pFont)
			return false;

		this.SetStringGID(true);
		this.m_oGlyphString.SetStringGID (gid, fX, fY);
		this.m_pFont.GetString2(this.m_oGlyphString);
		this.SetStringGID(false);
		
		return true;
	}
    this.LoadString3C = function(gid, fX, fY)
    {
        if (!this.m_pFont)
            return false;

        this.SetStringGID(true);

        // это SetString
        var string = this.m_oGlyphString;

        string.m_fX = fX + string.m_fTransX;
        string.m_fY = fY + string.m_fTransY;

        string.m_nGlyphsCount = 1;
        string.m_nGlyphIndex  = 0;

        var buffer = string.m_pGlyphsBuffer;
        if (buffer[0] == undefined)
            buffer[0] = new TGlyph();

        var _g = buffer[0];
        _g.bBitmap = false;
        _g.oBitmap = null;
        _g.eState = EGlyphState.glyphstateNormal;
        _g.lUnicode = gid;

        this.m_pFont.GetString2C(string);
        this.SetStringGID(false);

        return true;
    }
    this.LoadString2C = function(wsBuffer, fX, fY)
    {
        if (!this.m_pFont)
            return false;

        // это SetString
        var string = this.m_oGlyphString;

        string.m_fX = fX + string.m_fTransX;
        string.m_fY = fY + string.m_fTransY;

        string.m_nGlyphsCount = 1;
        string.m_nGlyphIndex  = 0;

        var buffer = string.m_pGlyphsBuffer;
        if (buffer[0] == undefined)
            buffer[0] = new TGlyph();

        var _g = buffer[0];
        _g.bBitmap = false;
        _g.oBitmap = null;
        _g.eState = EGlyphState.glyphstateNormal;
        _g.lUnicode = wsBuffer.charCodeAt(0);

        this.m_pFont.GetString2C(string);
        return string.m_fEndX;
    }

    this.LoadChar = function(lUnicode)
    {
        if (!this.m_pFont)
            return false;

        return this.m_pFont.GetChar2(lUnicode);
    }

    this.MeasureChar = function(lUnicode)
    {
        if (!this.m_pFont)
            return;

        return this.m_pFont.GetChar(lUnicode);
    }

    this.GetKerning = function(unPrevGID, unGID)
    {
        if (!this.m_pFont)
            return;

        return this.m_pFont.GetKerning(unPrevGID, unGID);
    }

	this.MeasureString = function()
	{
		var oPoint = new CPoint1();
		var len = this.m_oGlyphString.GetLength();
		if (len <= 0)
			return oPoint;

		var fTop = 0xFFFF, fBottom = -0xFFFF, fLeft = 0xFFFF, fRight = -0xFFFF;
		for (var nIndex = 0; nIndex < len; ++nIndex)
		{
			var oSizeTmp = this.m_oGlyphString.GetBBox (nIndex);

			if (fBottom < oSizeTmp.fBottom)
				fBottom = oSizeTmp.fBottom;

			if (fTop > oSizeTmp.fTop)
				fTop = oSizeTmp.fTop;

			if (fLeft > oSizeTmp.fLeft)
				fLeft = oSizeTmp.fLeft;

			if (fRight < oSizeTmp.fRight)
				fRight = oSizeTmp.fRight;
		}

		oPoint.fX = fLeft;
		oPoint.fY = fTop;

		oPoint.fWidth  = Math.abs((fRight - fLeft));
		oPoint.fHeight = Math.abs((fTop - fBottom));
		
		return oPoint;
	}
	
	this.MeasureString2 = function()
	{
		var oPoint = new CPoint1();
		
		if (this.m_oGlyphString.GetLength() <= 0)
			return oPoint;

		var fTop = 0xFFFF, fBottom = -0xFFFF, fLeft = 0xFFFF, fRight = -0xFFFF;

		var oSizeTmp = this.m_oGlyphString.GetBBox2();

		oPoint.fX = oSizeTmp.fLeft;
		oPoint.fY = oSizeTmp.fTop;

		oPoint.fWidth  = Math.abs((oSizeTmp.fRight - oSizeTmp.fLeft));
		oPoint.fHeight = Math.abs((oSizeTmp.fTop - oSizeTmp.fBottom));
		
		return oPoint;
	}
	
	this.GetNextChar2 = function()
	{
		return this.m_oGlyphString.GetNext();
	}
	
	this.IsSuccess = function()
	{
		return (0 == this.error);
	}

    this.SetTextMatrix = function(fA, fB, fC, fD, fE, fF)
    {
        if (!this.m_pFont)
            return false;

        if (this.m_pFont.SetTextMatrix (fA, fB, fC, fD, 0, 0))
			this.m_oGlyphString.SetCTM(fA, fB, fC, fD, 0, 0);
		this.m_oGlyphString.SetTrans(fE, fF);

        return true;
    }
	
	this.SetStringGID = function(bStringGID)
	{
		this.m_bStringGID = bStringGID;

		if (!this.m_pFont)
			return;

		this.m_pFont.SetStringGID(this.m_bStringGID);
	}
}