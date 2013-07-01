//зависимости
//stream
//memory
//c_oAscChartType
//todo
//BinaryCommonWriter

var c_oSerConstants = {
    ErrorFormat: -2,
    ErrorUnknown: -1,
    ReadOk:0,
    ReadUnknown:1,
    ErrorStream:0x55
};
var c_oSerPropLenType = {
    Null:0,
    Byte:1,
    Short:2,
    Three:3,
    Long:4,
    Double:5,
    Variable:6
};
function BinaryCommonWriter(memory)
{
    this.memory = memory;
    this.WriteItem = function(type, fWrite)
    {
        //type
        this.memory.WriteByte(type);
        this.WriteItemWithLength(fWrite);
    };
    this.WriteItemWithLength = function(fWrite)
    {
        //«апоминаем позицию чтобы в конце записать туда длину
        var nStart = this.memory.GetCurPosition();
        this.memory.Skip(4);
        //pPr
        fWrite();
        //Length
        var nEnd = this.memory.GetCurPosition();
        this.memory.Seek(nStart);
        this.memory.WriteLong(nEnd - nStart - 4);
        this.memory.Seek(nEnd);
    };
    this.WriteBorder = function(border)
    {
        if(border_None != border.Value)
        {
            if(null != border.Color)
                this.WriteColor(c_oSerBorderType.Color, border.Color);
            if(null != border.Space)
            {
                this.memory.WriteByte(c_oSerBorderType.Space);
                this.memory.WriteByte(c_oSerPropLenType.Double);
                this.memory.WriteDouble(border.Space);
            }
            if(null != border.Size)
            {
                this.memory.WriteByte(c_oSerBorderType.Size);
                this.memory.WriteByte(c_oSerPropLenType.Double);
                this.memory.WriteDouble(border.Size);
            }
        }
        if(null != border.Value)
        {
            this.memory.WriteByte(c_oSerBorderType.Value);
            this.memory.WriteByte(c_oSerPropLenType.Byte);
            this.memory.WriteByte(border.Value);
        }
    };
    this.WriteBorders = function(Borders)
    {
        var oThis = this;
        //Left
        if(null != Borders.Left)
            this.WriteItem(c_oSerBordersType.left, function(){oThis.WriteBorder(Borders.Left);});
        //Top
        if(null != Borders.Top)
            this.WriteItem(c_oSerBordersType.top, function(){oThis.WriteBorder(Borders.Top);});
        //Right
        if(null != Borders.Right)
            this.WriteItem(c_oSerBordersType.right, function(){oThis.WriteBorder(Borders.Right);});
        //Bottom
        if(null != Borders.Bottom)
            this.WriteItem(c_oSerBordersType.bottom, function(){oThis.WriteBorder(Borders.Bottom);});
        //InsideV
        if(null != Borders.InsideV)
            this.WriteItem(c_oSerBordersType.insideV, function(){oThis.WriteBorder(Borders.InsideV);});
        //InsideH
        if(null != Borders.InsideH)
            this.WriteItem(c_oSerBordersType.insideH, function(){oThis.WriteBorder(Borders.InsideH);});
        //Between
        if(null != Borders.Between)
            this.WriteItem(c_oSerBordersType.between, function(){oThis.WriteBorder(Borders.Between);});
    };
    this.WriteColor = function(type, color)
    {
        this.memory.WriteByte(type);
        this.memory.WriteByte(c_oSerPropLenType.Three);
        this.memory.WriteByte(color.r);
        this.memory.WriteByte(color.g);
        this.memory.WriteByte(color.b);
    };
    this.WriteShd = function(Shd)
    {
        //Value
        if(null != Shd.Value)
        {
            this.memory.WriteByte(c_oSerShdType.Value);
            this.memory.WriteByte(c_oSerPropLenType.Byte);
            this.memory.WriteByte(Shd.Value);
        }
        //Value
        if(null != Shd.Color)
        {
            this.WriteColor(c_oSerShdType.Color, Shd.Color);
        }
    };
    this.WritePaddings = function(Paddings)
    {
        //left
        if(null != Paddings.L)
        {
            this.memory.WriteByte(c_oSerPaddingType.left);
            this.memory.WriteByte(c_oSerPropLenType.Double);
            this.memory.WriteDouble(Paddings.L);
        }
        //top
        if(null != Paddings.T)
        {
            this.memory.WriteByte(c_oSerPaddingType.top);
            this.memory.WriteByte(c_oSerPropLenType.Double);
            this.memory.WriteDouble(Paddings.T);
        }
        //Right
        if(null != Paddings.R)
        {
            this.memory.WriteByte(c_oSerPaddingType.right);
            this.memory.WriteByte(c_oSerPropLenType.Double);
            this.memory.WriteDouble(Paddings.R);
        }
        //bottom
        if(null != Paddings.B)
        {
            this.memory.WriteByte(c_oSerPaddingType.bottom);
            this.memory.WriteByte(c_oSerPropLenType.Double);
            this.memory.WriteDouble(Paddings.B);
        }
    };
	this.WriteColorSpreadsheet = function(color)
    {
		if(color instanceof ThemeColor)
		{
			//заглушка дл€ посещенных гиперссылок
			if(g_nColorHyperlinkVisited == color.theme && null == color.tint)
				color.theme = g_nColorHyperlink;
			if(null != color.theme)
			{
				this.memory.WriteByte(c_oSer_ColorObjectType.Theme);
				this.memory.WriteByte(c_oSerPropLenType.Byte);
				this.memory.WriteByte(color.theme);
			}
			if(null != color.tint)
			{
				this.memory.WriteByte(c_oSer_ColorObjectType.Tint);
				this.memory.WriteByte(c_oSerPropLenType.Double);
				this.memory.WriteDouble2(color.tint);
			}
		}
		else
		{
			this.memory.WriteByte(c_oSer_ColorObjectType.Rgb);
			this.memory.WriteByte(c_oSerPropLenType.Long);
			this.memory.WriteLong(color.getRgb());
		}
    };
};
function Binary_CommonReader(stream)
{
    this.stream = stream;
    
    this.ReadTable = function(fReadContent)
    {
        var res = c_oSerConstants.ReadOk;
        //stLen
        res = this.stream.EnterFrame(4);
        if(c_oSerConstants.ReadOk != res)
            return res;
        var stLen = this.stream.GetULongLE();
        //—мотрим есть ли данные под всю таблицу в дальнейшем спокойно пользуемс€ get функци€ми
        res = this.stream.EnterFrame(stLen);
        if(c_oSerConstants.ReadOk != res)
            return res;
        return this.Read1(stLen, fReadContent);
    };
    this.Read1 = function(stLen, fRead)
    {
        var res = c_oSerConstants.ReadOk;
        var stCurPos = 0;
        while(stCurPos < stLen)
        {
            //stItem
            var type = this.stream.GetUChar();
            var length = this.stream.GetULongLE();
            res = fRead(type, length);
            if(res === c_oSerConstants.ReadUnknown)
            {
                res = this.stream.Skip2(length);
                if(c_oSerConstants.ReadOk != res)
                    return res;
            }
            else if(res !== c_oSerConstants.ReadOk)
                return res;
            stCurPos += length + 5;
        }
        return res;
    };
    this.Read2 = function(stLen, fRead)
    {
        var res = c_oSerConstants.ReadOk;
        var stCurPos = 0;
        while(stCurPos < stLen)
        {
            //stItem
            var type = this.stream.GetUChar();
            var lenType = this.stream.GetUChar();
            var nCurPosShift = 2;
            var nRealLen;
            switch(lenType)
            {
                case c_oSerPropLenType.Null: nRealLen = 0;break;
                case c_oSerPropLenType.Byte: nRealLen = 1;break;
                case c_oSerPropLenType.Short: nRealLen = 2;break;
                case c_oSerPropLenType.Three: nRealLen = 3;break;
                case c_oSerPropLenType.Long:
                case c_oSerPropLenType.Double: nRealLen = 4;break;
                case c_oSerPropLenType.Variable:
                    nRealLen = this.stream.GetULongLE();
                    nCurPosShift += 4;
                    break;
                default:return c_oSerConstants.ErrorUnknown;
            }
            res = fRead(type, nRealLen);
            if(res === c_oSerConstants.ReadUnknown)
            {
                res = this.stream.Skip2(nRealLen);
                if(c_oSerConstants.ReadOk != res)
                    return res;
            }
            else if(res !== c_oSerConstants.ReadOk)
                return res;
            stCurPos += nRealLen + nCurPosShift;
        }
        return res;
    };
	this.Read2Spreadsheet = function(stLen, fRead)
    {
        var res = c_oSerConstants.ReadOk;
        var stCurPos = 0;
        while(stCurPos < stLen)
        {
            //stItem
            var type = this.stream.GetUChar();
            var lenType = this.stream.GetUChar();
            var nCurPosShift = 2;
            var nRealLen;
            switch(lenType)
            {
                case c_oSerPropLenType.Null: nRealLen = 0;break;
                case c_oSerPropLenType.Byte: nRealLen = 1;break;
                case c_oSerPropLenType.Short: nRealLen = 2;break;
                case c_oSerPropLenType.Three: nRealLen = 3;break;
                case c_oSerPropLenType.Long: nRealLen = 4;break;
                case c_oSerPropLenType.Double: nRealLen = 8;break;
                case c_oSerPropLenType.Variable:
                    nRealLen = this.stream.GetULongLE();
                    nCurPosShift += 4;
                    break;
                default:return c_oSerConstants.ErrorUnknown;
            }
            res = fRead(type, nRealLen);
            if(res === c_oSerConstants.ReadUnknown)
            {
                res = this.stream.Skip2(nRealLen);
                if(c_oSerConstants.ReadOk != res)
                    return res;
            }
            else if(res !== c_oSerConstants.ReadOk)
                return res;
            stCurPos += nRealLen + nCurPosShift;
        }
        return res;
    };
    this.ReadDouble = function()
    {
        var dRes = 0.0;
        dRes |= this.stream.GetUChar();
        dRes |= this.stream.GetUChar() << 8;
        dRes |= this.stream.GetUChar() << 16;
        dRes |= this.stream.GetUChar() << 24;
        dRes /= 100000;
        return dRes;
    }
    this.ReadColor = function()
    {
        var r = this.stream.GetUChar();
        var g = this.stream.GetUChar();
        var b = this.stream.GetUChar()
        return new CDocumentColor(r, g, b);
    }
    this.ReadShd = function(type, length, Shd)
    {
        var res = c_oSerConstants.ReadOk;
        switch(type)
        {
            case c_oSerShdType.Value: Shd.Value = this.stream.GetUChar();break;
            case c_oSerShdType.Color: Shd.Color = this.ReadColor();break;
            default:
                res = c_oSerConstants.ReadUnknown;
                break;
        }
        return res;
    };
	this.ReadColorSpreadsheet = function(type, length, color)
    {
        var res = c_oSerConstants.ReadOk;
        if ( c_oSer_ColorObjectType.Type == type )
            color.auto = (c_oSer_ColorType.Auto == this.stream.GetUChar());
        else if ( c_oSer_ColorObjectType.Rgb == type )
            color.rgb = 0xffffff & this.stream.GetULongLE();
		else if ( c_oSer_ColorObjectType.Theme == type )
            color.theme = this.stream.GetUChar();
		else if ( c_oSer_ColorObjectType.Tint == type )
            color.tint = this.stream.GetDoubleLE();
        else
            res = c_oSerConstants.ReadUnknown;
        return res;
    }
}
/** @constructor */
function FT_Stream2(data, size)
{
    this.obj = null;
    this.data = data;
    this.size = size;
    this.pos = 0;
    this.cur = 0;

    this.Seek = function(_pos)
    {
        if (_pos > this.size)
            return c_oSerConstants.ErrorStream;
        this.pos = _pos;
        return c_oSerConstants.ReadOk;
    }
    this.Seek2 = function(_cur)
    {
        if (_cur > this.size)
            return c_oSerConstants.ErrorStream;
        this.cur = _cur;
        return c_oSerConstants.ReadOk;
    }
    this.Skip = function(_skip)
    {
        if (_skip < 0)
            return c_oSerConstants.ErrorStream;
        return this.Seek(this.pos + _skip);
    }
    this.Skip2 = function(_skip)
    {
        if (_skip < 0)
            return c_oSerConstants.ErrorStream;
        return this.Seek2(this.cur + _skip);
    }
    
    // 1 bytes
    this.GetUChar = function()
    {
        if (this.cur >= this.size)
            return 0;
        return this.data[this.cur++];
    }

    this.GetByte = function()
    {
        return this.GetUChar();
    }

    this.GetBool = function()
    {
        var Value = this.GetUChar();
        return ( Value == 0 ? false : true );
    }

    // 2 byte
    this.GetUShortLE = function()
    {
        if (this.cur + 1 >= this.size)
            return 0;
        return (this.data[this.cur++] | this.data[this.cur++] << 8);
    }

    // 4 byte
    this.GetULongLE = function()
    {
        if (this.cur + 3 >= this.size)
            return 0;
        return (this.data[this.cur++] | this.data[this.cur++] << 8 | this.data[this.cur++] << 16 | this.data[this.cur++] << 24);
    }
    this.GetLongLE = function()
    {
        return this.GetULongLE();
    }

    this.GetLong = function()
    {
        return this.GetULongLE();
    };
    this.GetDoubleLE = function()
    {
        if (this.cur + 7 >= this.size)
            return 0;
        var arr = new Array();
        for(var i = 0; i < 8; ++i)
            arr.push(this.GetUChar());
        var dRes = this.doubleDecodeLE754(arr);
        return dRes;
    }
    this.doubleDecodeLE754 = function(a)
    {
        var s, e, m, i, d, nBits, mLen, eLen, eBias, eMax;
        var el = {len:8, mLen:52, rt:0};
        mLen = el.mLen, eLen = el.len*8-el.mLen-1, eMax = (1<<eLen)-1, eBias = eMax>>1;

        i = (el.len-1); d = -1; s = a[i]; i+=d; nBits = -7;
        for (e = s&((1<<(-nBits))-1), s>>=(-nBits), nBits += eLen; nBits > 0; e=e*256+a[i], i+=d, nBits-=8);
        for (m = e&((1<<(-nBits))-1), e>>=(-nBits), nBits += mLen; nBits > 0; m=m*256+a[i], i+=d, nBits-=8);

        switch (e)
        {
            case 0:
                // Zero, or denormalized number
                e = 1-eBias;
                break;
            case eMax:
                // NaN, or +/-Infinity
                return m?NaN:((s?-1:1)*Infinity);
            default:
                // Normalized number
                m = m + Math.pow(2, mLen);
                e = e - eBias;
                break;
        }
        return (s?-1:1) * m * Math.pow(2, e-mLen);
    };
    // 3 byte
    this.GetUOffsetLE = function()
    {
        if (this.cur + 2 >= this.size)
            return c_oSerConstants.ReadOk;
        return (this.data[this.cur++] | this.data[this.cur++] << 8 | this.data[this.cur++] << 16);
    }

    this.GetString2 = function()
    {
        var Len = this.GetLong();
        return this.GetString2LE(Len);
    }

    //String
    this.GetString2LE = function(len)
    {
        if (this.cur + len > this.size)
            return "";
        var t = "";
        for (var i = 0; i + 1 < len; i+=2)
        {
            var uni = this.data[this.cur + i];
            uni |= this.data[this.cur + i + 1] << 8;
            t += String.fromCharCode(uni);
        }
        this.cur += len;
        return t;
    }
	this.GetString = function()
    {
        var Len = this.GetLong();
        if (this.cur + 2 * Len > this.size)
            return "";
        var t = "";
        for (var i = 0; i + 1 < 2 * Len; i+=2)
        {
            var uni = this.data[this.cur + i];
            uni |= this.data[this.cur + i + 1] << 8;
            t += String.fromCharCode(uni);
        }
        this.cur += 2 * Len;
        return t;
	}
    this.GetCurPos = function()
	{
		return this.cur;
	}
	this.GetSize = function()
	{
		return this.size;
	}
    this.EnterFrame = function(count)
    {
        if (this.size - this.pos < count)
            return c_oSerConstants.ErrorStream;

        this.cur = this.pos;
        this.pos += count;
        return c_oSerConstants.ReadOk;
    }

    this.GetDouble = function()
    {
        var dRes = 0.0;
        dRes |= this.GetUChar();
        dRes |= this.GetUChar() << 8;
        dRes |= this.GetUChar() << 16;
        dRes |= this.GetUChar() << 24;
        dRes /= 100000;
        return dRes;
    }
}
var gc_nMaxRow = 1048576;
var gc_nMaxCol = 16384;
var gc_nMaxRow0 = gc_nMaxRow - 1;
var gc_nMaxCol0 = gc_nMaxCol - 1;
/**
 * @constructor
 */
function CellAddressUtils(){
	this._oCodeA = 'A'.charCodeAt();
	this._aColnumToColstr = new Array();
	this.colnumToColstr = function(num){
		var sResult = this._aColnumToColstr[num];
		if(!sResult){
			// convert 1 to A, 2 to B, ..., 27 to AA etc.
			if(num == 0) return "";
			var val = "";
			var sResult = "";
			var n = num - 1;
			if (n >= 702) {
				val = (Asc.floor(n / 676) - 1) % 26;
				sResult += String.fromCharCode(val + 65);
			}
			if (n >= 26) {
				val = (Asc.floor(n / 26) - 1) % 26;
				sResult += String.fromCharCode(val + 65);
			}
			sResult += String.fromCharCode( (n % 26) + 65);
			this._aColnumToColstr[num] = sResult;
		}
		return sResult;
	};
	this.colstrToColnum = function(col_str) {
		//convert A to 1; AA to 27
		var col_num = 0;
		for (var i = 0; i < col_str.length; ++i)
			col_num = 26 * col_num + (col_str.charCodeAt(i) - this._oCodeA + 1);
		return col_num
	}
};
var g_oCellAddressUtils = new CellAddressUtils();
/**
 * @constructor
 */
function CellAddress(){
	var argc = arguments.length;
	this._valid = true;
	this._invalidId = false;
	this._invalidCoord = false;
	this.id = null;
	this.row = null;
	this.col = null;
	this.colLetter = null;
	if(1 == argc){
		//—разу пришло ID вида "A1"
		this.id = arguments[0].toUpperCase();
		this._invalidCoord = true;
		this._checkId();
	}
	else if(2 == argc){
		//адрес вида (1,1) = "A1". ¬нутренний формат начинаетс€ с 1
		this.row = arguments[0];
		this.col = arguments[1];
		this._checkCoord();
		this._invalidId = true;
	}
	else if(3 == argc){
		//тоже самое что и 2 аргумента, только 0-based
		this.row = arguments[0] + 1;
		this.col = arguments[1] + 1;
		this._checkCoord();
		this._invalidId = true;
	}
};
CellAddress.prototype._isDigit=function(symbol){
	return '0' <= symbol && symbol <= '9';
};
CellAddress.prototype._isAlpha=function(symbol){
	return 'A' <= symbol && symbol <= 'Z';
};
CellAddress.prototype._checkId=function(){
	this._invalidCoord = true;
	this._recalculate(true, false);
	this._checkCoord();
};
CellAddress.prototype._checkCoord=function(){
	if( !(this.row >= 1 && this.row <= gc_nMaxRow) )
		this._valid = false;
	else if( !(this.col >= 1 && this.col <= gc_nMaxCol) )
		this._valid = false;
	else
		this._valid = true;
};
CellAddress.prototype._recalculate=function(bCoord, bId){
	if(bCoord && this._invalidCoord){
		this._invalidCoord = false;
		var nIndex = 0;
		var nIdLength = this.id.length;
		while(this._isAlpha(this.id.charAt(nIndex)) && nIndex < nIdLength)
			nIndex++;
		if(0 == nIndex){
			//  (1,Infinity)
			this.col = gc_nMaxCol;
			this.colLetter = g_oCellAddressUtils.colnumToColstr(this.col);
			this.row = this.id.substring(nIndex) - 0;
			this.id = this.colLetter + this.row;
		}
		else if(nIndex == nIdLength){
			//  (Infinity,1)
			this.colLetter = this.id;
			this.col = g_oCellAddressUtils.colstrToColnum(this.colLetter);
			this.row = gc_nMaxRow;
			this.id = this.colLetter + this.row;
		}
		else{
			this.colLetter = this.id.substring(0, nIndex);
			this.col = g_oCellAddressUtils.colstrToColnum(this.colLetter);
			this.row = this.id.substring(nIndex) - 0;
		}
	}
	else if(bId && this._invalidId){
		this._invalidId = false;
		this.colLetter = g_oCellAddressUtils.colnumToColstr(this.col);
		this.id = this.colLetter + this.row;
	}
};
CellAddress.prototype.isValid=function(){
	return this._valid;
};
CellAddress.prototype.getID=function(){
	this._recalculate(false, true);
	return this.id;
};
CellAddress.prototype.getIDAbsolute=function(){
	this._recalculate(true, false);
	return "$" + this.getColLetter() + "$" + this.getRow();
};
CellAddress.prototype.getRow=function(){
	this._recalculate(true, false);
	return this.row;
};
CellAddress.prototype.getRow0=function(){
	//0 - based
	this._recalculate(true, false);
	return this.row - 1;
};
CellAddress.prototype.getCol=function(){
	this._recalculate(true, false);
	return this.col;
};
CellAddress.prototype.getCol0=function(){
	//0 - based
	this._recalculate(true, false);
	return this.col - 1;
};
CellAddress.prototype.getColLetter=function(){
	this._recalculate(false, true);
	return this.colLetter;
};
CellAddress.prototype.setRow=function(val){
	if( !(this.row >= 0 && this.row <= gc_nMaxRow) )
		this._valid = false;
	this._invalidId = true;
	this.row = val;
};
CellAddress.prototype.setCol=function(val){
	if( !(val >= 0 && val <= gc_nMaxCol) )
		return;
	this._invalidId = true;
	this.col = val;
};
CellAddress.prototype.setId=function(val){
	this._invalidCoord = true;
	this.id = val;
	this._checkId();
};
CellAddress.prototype.moveRow=function(diff){
	var val = this.row + diff;
	if( !(val >= 0 && val <= gc_nMaxRow) )
		return;
	this._invalidId = true;
	this.row = val;
};
CellAddress.prototype.moveCol=function(diff){
	var val = this.col + diff;
	if( !( val >= 0 && val <= gc_nMaxCol) )
		return;
	this._invalidId = true;
	this.col = val;
};

/** @enum */
var c_oSer_DrawingType =
{
    Type: 0,
    From: 1,
    To: 2,
    Pos: 3,
    Pic: 4,
    PicSrc:5,
	GraphicFrame: 6,
	Chart: 7,
	Ext: 8
};
/** @enum */
var c_oSer_ChartType =
{
	Legend: 0,
	Title: 1,
	PlotArea: 2,
	Style: 3,
	TitlePptx: 4,
	TitleTxPrPptx: 5,
	ShowBorder: 6
};
/** @enum */
var c_oSer_ChartLegendType =
{
	LegendPos: 0,
	Overlay: 1,
	Layout: 2,
	LegendEntry: 3
};
/** @enum */
var c_oSer_ChartLegendEntryType =
{
	Delete: 0,
	Index: 1,
	TxPrPptx: 2
};
/** @enum */
var c_oSer_ChartLegendLayoutType =
{
	H: 0,
	HMode: 1,
	LayoutTarget: 2,
	W: 3,
	WMode: 4,
	X: 5,
	XMode: 6,
	Y: 7,
	YMode: 8
};
/** @enum */
var c_oSer_ChartPlotAreaType =
{
	CatAx: 0,
	ValAx: 1,
	SerAx: 2,
	ValAxPos: 3,
	BasicChart: 4
};
/** @enum */
var c_oSer_ChartCatAxType =
{
	Title: 0,
	MajorGridlines: 1,
	Delete: 2,
	AxPos: 3,
	TitlePptx: 4,
	TitleTxPrPptx: 5,
	TxPrPptx: 6
};
/** @enum */
var c_oSer_BasicChartType =
{
	Type: 0,
	BarDerection: 1,
	Grouping: 2,
	Overlap: 3,
	Series: 4,
	Seria: 5,
	DataLabels: 6
};
/** @enum */
var c_oSer_ChartSeriesType =
{
	Val: 0,
	Tx: 1,
	Marker: 2,
	OutlineColor: 3,
	xVal: 4,
	TxRef: 5,
	Index: 6,
	Order: 7
};
/** @enum */
var c_oSer_ChartSeriesMarkerType =
{
	Size: 0,
	Symbol: 1
};
/** @enum */
var c_oSer_ChartSeriesDataLabelsType =
{
	ShowVal: 0,
	TxPrPptx: 1
};
/** @enum */
var c_oSer_ChartSeriesNumCacheType =
{
	Formula: 0,
	NumCache: 1,
	NumCacheVal: 2
};
/** @enum */
var EChartAxPos =
{
	chartaxposLeft:  0,
	chartaxposTop:  1,
	chartaxposRight:  2,
	chartaxposBottom:  3
};
/** @enum */
var EChartLegendPos =
{
	chartlegendposLeft: 0,
	chartlegendposTop: 1,
	chartlegendposRight: 2,
	chartlegendposBottom: 3,
	chartlegendposRightTop: 4
};
/** @enum */
var EChartBasicTypes =
{
	chartbasicBarChart:  0,
	chartbasicBar3DChart:  1,
	chartbasicLineChart:  2,
	chartbasicLine3DChart:  3,
	chartbasicAreaChart:  4,
	chartbasicPieChart:  5,
	chartbasicBubbleChart:  6,
	chartbasicScatterChart:  7,
	chartbasicRadarChart:  8,
	chartbasicDoughnutChart:  9,
	chartbasicStockChart:  10
};
/** @enum */
var EChartBarDerection =
{
	chartbardirectionBar:  0,
	chartbardirectionCol:  1
};
/** @enum */
var EChartBarGrouping =
{
	chartbargroupingClustered: 0,
	chartbargroupingPercentStacked: 1,
	chartbargroupingStacked: 2,
	chartbargroupingStandard: 3
};
/** @enum */
var EChartSymbol =
{
	chartsymbolCircle:  0,
	chartsymbolDash:  1,
	chartsymbolDiamond:  2,
	chartsymbolDot:  3,
	chartsymbolNone:  4,
	chartsymbolPicture:  5,
	chartsymbolPlus:  6,
	chartsymbolSquare:  7,
	chartsymbolStare:  8,
	chartsymbolStar:  9,
	chartsymbolTriangle:  10,
	chartsymbolX:  11
};
/** @constructor */
function BinaryChartWriter(memory)
{
	this.memory = memory;
	this.bs = new BinaryCommonWriter(this.memory);
	this.Write = function(chart)
    {
		var oThis = this;
        this.bs.WriteItem(c_oSer_DrawingType.Chart, function(){oThis.WriteChartContent(chart);});
    };
	this.WriteChartContent = function(chart)
    {
        var oThis = this;
		if(null != chart.legend && true == chart.legend.bShow)
			this.bs.WriteItem(c_oSer_ChartType.Legend, function(){oThis.WriteLegend(chart.legend);});
		if (null != chart.header.title && ("" != chart.header.title || true == chart.header.bDefaultTitle))
		{
			this.memory.WriteByte(c_oSer_ChartType.Title);
            this.memory.WriteString2(chart.header.title);
		}
		this.bs.WriteItem(c_oSer_ChartType.PlotArea, function(){oThis.WritePlotArea(chart);});
		if(null != chart.styleId)
			this.bs.WriteItem(c_oSer_ChartType.Style, function(){oThis.memory.WriteLong(chart.styleId);});
    };
	this.WriteLegend = function(legend)
    {
        var oThis = this;
		if(null != legend.position)
		{
			var byteLegendPos = null;
			switch(legend.position)
			{
				case c_oAscChartLegend.left: byteLegendPos = EChartLegendPos.chartlegendposLeft;break;
				case c_oAscChartLegend.right: byteLegendPos = EChartLegendPos.chartlegendposRight;break;
				case c_oAscChartLegend.top: byteLegendPos = EChartLegendPos.chartlegendposTop;break;
				case c_oAscChartLegend.bottom: byteLegendPos = EChartLegendPos.chartlegendposBottom;break;
			}
			if(null != byteLegendPos)
				this.bs.WriteItem(c_oSer_ChartLegendType.LegendPos, function(){oThis.memory.WriteByte(byteLegendPos);});
		}
		if(null != legend.bOverlay)
			this.bs.WriteItem(c_oSer_ChartLegendType.Overlay, function(){oThis.memory.WriteBool(legend.bOverlay);});
    };
	this.WritePlotArea = function(chart)
    {
        var oThis = this;
		var xAxis = chart.xAxis;
		var yAxis = chart.yAxis;
		if(c_oAscChartType.hbar == chart.type)
		{
			var oTemp = xAxis;
			xAxis = yAxis;
			yAxis = oTemp;
		}
		if(null != xAxis && null != yAxis)
		{
			if(c_oAscChartType.scatter == chart.type)
				this.bs.WriteItem(c_oSer_ChartPlotAreaType.ValAx, function(){oThis.WriteCatAx(xAxis, yAxis, true);});
			else
				this.bs.WriteItem(c_oSer_ChartPlotAreaType.CatAx, function(){oThis.WriteCatAx(xAxis, yAxis, true);});
			this.bs.WriteItem(c_oSer_ChartPlotAreaType.ValAx, function(){oThis.WriteCatAx(yAxis, xAxis, false);});
		}
		
		this.bs.WriteItem(c_oSer_ChartPlotAreaType.BasicChart, function(){oThis.WriteBasicChart(chart);});
    };
	this.WriteCatAx = function(axis, axis2, bBottom)
    {
        var oThis = this;
		if(null != axis.title && ("" != axis.title || true == axis.bDefaultTitle))
		{
			this.memory.WriteByte(c_oSer_ChartCatAxType.Title);
            this.memory.WriteString2(axis.title);
		}
		if(null != axis.bGrid)
			this.bs.WriteItem(c_oSer_ChartCatAxType.MajorGridlines, function(){oThis.memory.WriteBool(axis2.bGrid);});
		if(null != axis.bShow)
			this.bs.WriteItem(c_oSer_ChartCatAxType.Delete, function(){oThis.memory.WriteBool(!axis.bShow);});
		if(bBottom)
			this.bs.WriteItem(c_oSer_ChartCatAxType.AxPos, function(){oThis.memory.WriteByte(EChartAxPos.chartaxposBottom);});
		else
			this.bs.WriteItem(c_oSer_ChartCatAxType.AxPos, function(){oThis.memory.WriteByte(EChartAxPos.chartaxposLeft);});
    };
	this.WriteBasicChart = function(chart)
    {
        var oThis = this;
		var byteType = null;
		if(null != chart.type)
		{
			var byteSubtype = null;
			switch(chart.type)
			{
				case c_oAscChartType.line: byteType = EChartBasicTypes.chartbasicLineChart;break;
				case c_oAscChartType.bar: byteType = EChartBasicTypes.chartbasicBarChart;
										byteSubtype = EChartBarDerection.chartbardirectionCol;
										break;
				case c_oAscChartType.hbar: byteType = EChartBasicTypes.chartbasicBarChart;
										byteSubtype = EChartBarDerection.chartbardirectionBar;
										break;
				case c_oAscChartType.area: byteType = EChartBasicTypes.chartbasicAreaChart;break;
				case c_oAscChartType.pie: byteType = EChartBasicTypes.chartbasicPieChart;break;
				case c_oAscChartType.scatter: byteType = EChartBasicTypes.chartbasicScatterChart;break;
				case c_oAscChartType.stock: byteType = EChartBasicTypes.chartbasicStockChart;break;
			}
			if(null != byteType)
			{
				this.memory.WriteByte(c_oSer_BasicChartType.Type);
				this.memory.WriteByte(c_oSerPropLenType.Byte);
				this.memory.WriteByte(byteType);
				
				if(null != byteSubtype)
				{
					this.memory.WriteByte(c_oSer_BasicChartType.BarDerection);
					this.memory.WriteByte(c_oSerPropLenType.Byte);
					this.memory.WriteByte(byteSubtype);
				}
			}
		}
		if(null != chart.subType)
		{
			if(EChartBasicTypes.chartbasicLineChart == byteType || EChartBasicTypes.chartbasicBarChart == byteType || EChartBasicTypes.chartbasicAreaChart == byteType)
			{
				var byteGrouping = null;
				switch(chart.subType)
				{
					case c_oAscChartSubType.normal: byteGrouping = EChartBarGrouping.chartbargroupingStandard;break;
					case c_oAscChartSubType.stacked: byteGrouping = EChartBarGrouping.chartbargroupingStacked;break;
					case c_oAscChartSubType.stackedPer: byteGrouping = EChartBarGrouping.chartbargroupingPercentStacked;break;
				}
				if(null != byteGrouping)
				{
					this.memory.WriteByte(c_oSer_BasicChartType.Grouping);
					this.memory.WriteByte(c_oSerPropLenType.Byte);
					this.memory.WriteByte(byteGrouping);
				}
				if(EChartBasicTypes.chartbasicBarChart == byteType && null != byteGrouping && EChartBarGrouping.chartbargroupingStandard != byteGrouping)
				{
					this.memory.WriteByte(c_oSer_BasicChartType.Overlap);
					this.memory.WriteByte(c_oSerPropLenType.Long);
					this.memory.WriteLong(100);
				}
			}
		}
		if(null != chart.range)
		{
			var chartRange = chart.range;			
			if(null != chartRange.intervalObject || null != chart.data)
			{
				this.memory.WriteByte(c_oSer_BasicChartType.Series);
				this.memory.WriteByte(c_oSerPropLenType.Variable);
				this.bs.WriteItemWithLength(function(){oThis.WriteSeries(chartRange, chart.data, chart.type);});
			}
		}
		if(null != chart.bShowValue)
		{
			this.memory.WriteByte(c_oSer_BasicChartType.DataLabels);
			this.memory.WriteByte(c_oSerPropLenType.Variable);
			this.bs.WriteItemWithLength(function(){oThis.WriteDataLabels(chart);});
		}
    };
	this.WriteSeries = function(chartRange, data, chartType)
    {
        var oThis = this;
		if(null != chartRange.intervalObject)
		{
			var oBBox = chartRange.intervalObject.getBBox0();
			var wsName = chartRange.intervalObject.getWorksheet().getName();
			if(false == rx_test_ws_name.test(wsName))
				wsName = "'" + wsName + "'";
			if(c_oAscChartType.scatter == chartType)
			{
				if(true == chartRange.rows)
				{
					if(oBBox.r1 != oBBox.r2)
					{
						for(var i = oBBox.r1 + 1; i <= oBBox.r2; ++i)
							this.bs.WriteItem(c_oSer_BasicChartType.Seria, function(){oThis.WriteSeria(chartType, wsName, chartRange.rows, i, oBBox.c1, oBBox.c2, oBBox.r1);});
					}
					else
						this.bs.WriteItem(c_oSer_BasicChartType.Seria, function(){oThis.WriteSeria(null, wsName, chartRange.rows, oBBox.r1, oBBox.c1, oBBox.c2, oBBox.r1);});
				}
				else
				{
					if(oBBox.c1 != oBBox.c2)
					{
						for(var i = oBBox.c1 + 1; i <= oBBox.c2; ++i)
							this.bs.WriteItem(c_oSer_BasicChartType.Seria, function(){oThis.WriteSeria(chartType, wsName, chartRange.rows, i, oBBox.r1, oBBox.r2, oBBox.c1);});
					}
					else
						this.bs.WriteItem(c_oSer_BasicChartType.Seria, function(){oThis.WriteSeria(null, wsName, chartRange.rows, oBBox.c1, oBBox.r1, oBBox.r2, oBBox.c1);});
				}
			}
			else
			{
				if(true == chartRange.rows)
				{
					for(var i = oBBox.r1; i <= oBBox.r2; ++i)
						this.bs.WriteItem(c_oSer_BasicChartType.Seria, function(){oThis.WriteSeria(chartType, wsName, chartRange.rows, i, oBBox.c1, oBBox.c2, oBBox.r1);});
				}
				else
				{
					for(var i = oBBox.c1; i <= oBBox.c2; ++i)
						this.bs.WriteItem(c_oSer_BasicChartType.Seria, function(){oThis.WriteSeria(chartType, wsName, chartRange.rows, i, oBBox.r1, oBBox.r2, oBBox.c1);});
				}
			}
		}
		else if(null != data && data.length > 0)
		{
			var nRowCount = data.length;
			var nColCount = data[0].length;
			var wsName = "Sheet1";
			if(c_oAscChartType.scatter == chartType)
			{
				if(true == chartRange.rows)
				{
					if(1 != nRowCount)
					{
						for(var i = 1; i < nRowCount; ++i)
							this.bs.WriteItem(c_oSer_BasicChartType.Seria, function(){oThis.WriteSeria(chartType, wsName, chartRange.rows, i, 0, nColCount - 1, 0, data);});
					}
					else
						this.bs.WriteItem(c_oSer_BasicChartType.Seria, function(){oThis.WriteSeria(chartType, wsName, chartRange.rows, 0, 0, nColCount - 1, 0, data);});
				}
				else
				{
					if(1 != nColCount)
					{
						for(var i = 1; i < nColCount; ++i)
							this.bs.WriteItem(c_oSer_BasicChartType.Seria, function(){oThis.WriteSeria(chartType, wsName, chartRange.rows, i, 0, nRowCount - 1, 0, data);});
					}
					else
						this.bs.WriteItem(c_oSer_BasicChartType.Seria, function(){oThis.WriteSeria(chartType, wsName, chartRange.rows, 0, 0, nRowCount - 1, 0, data);});
				}
			}
			else
			{
				if(true == chartRange.rows)
				{
					for(var i = 0; i < nRowCount; ++i)
						this.bs.WriteItem(c_oSer_BasicChartType.Seria, function(){oThis.WriteSeria(chartType, wsName, chartRange.rows, i, 0, nColCount - 1, 0, data);});
				}
				else
				{
					for(var i = 0; i < nColCount; ++i)
						this.bs.WriteItem(c_oSer_BasicChartType.Seria, function(){oThis.WriteSeria(chartType, wsName, chartRange.rows, i, 0, nRowCount - 1, 0, data);});
				}
			}
		}
    };
	this.WriteSeria = function(chartType, wsName, bRow, v1, v2, v3, v4, data)
    {
        var oThis = this;
		if(c_oAscChartType.scatter == chartType)
			this.bs.WriteItem(c_oSer_ChartSeriesType.xVal, function(){oThis.WriteSeriesNumCache(wsName, bRow, v4, v2, v3, data);});
		this.bs.WriteItem(c_oSer_ChartSeriesType.Val, function(){oThis.WriteSeriesNumCache(wsName, bRow, v1, v2, v3, data);});
		// if(null != tx)
			// this.bs.WriteItem(c_oSer_ChartSeriesType.Tx, function(){oThis.memory.WriteString2(tx);});
		this.bs.WriteItem(c_oSer_ChartSeriesType.Marker, function(){oThis.WriteSeriesMarkers({Symbol: EChartSymbol.chartsymbolNone});});
    };
	this.WriteSeriesNumCache = function(wsName, bRow, v1, v2, v3, data)
    {
        var oThis = this;
		var sRef = wsName + "!";
		if(bRow)
		{
			var oLeft = new CellAddress(v1, v2, 0);
			sRef += oLeft.getIDAbsolute();
			if(v2 != v3)
			{
				sRef += ":";
				var oRight = new CellAddress(v1, v3, 0);
				sRef += oRight.getIDAbsolute();
			}
		}
		else
		{
			var oTop = new CellAddress(v2, v1, 0);
			sRef += oTop.getIDAbsolute();
			if(v2 != v3)
			{
				sRef += ":";
				var oBottom = new CellAddress(v3, v1, 0);
				sRef += oBottom.getIDAbsolute();
			}
		}
		this.memory.WriteByte(c_oSer_ChartSeriesNumCacheType.Formula);
        this.memory.WriteString2(sRef);
		
		if(null != data)
			this.bs.WriteItem(c_oSer_ChartSeriesNumCacheType.NumCache, function(){oThis.WriteSeriesNumCacheValues(bRow, v1, v2, v3, data);});
    };
	this.WriteSeriesNumCacheValues = function(bRow, v1, v2, v3, data)
    {
		var oThis = this;
		if(bRow)
		{
			var subData = data[v1];
			if(null != subData)
			{
				for(var i = v2; i <= v3; ++i)
				{
					var val = subData[i].value;
					if(null != val)
					{
						this.memory.WriteByte(c_oSer_ChartSeriesNumCacheType.NumCacheVal);
						this.memory.WriteString2(val);
					}
				}
			}
		}
		else
		{
			for(var i = v2; i <= v3; ++i)
			{
				var subData = data[i];
				if(null != subData)
				{
					var val = subData[v1].value;
					if(null != val)
					{
						this.memory.WriteByte(c_oSer_ChartSeriesNumCacheType.NumCacheVal);
						this.memory.WriteString2(val);
					}
				}
			}
		}
	}
	this.WriteSeriesMarkers = function(marker)
    {
        var oThis = this;
		if(null != marker.Size)
		{
			this.memory.WriteByte(c_oSer_ChartSeriesMarkerType.Size);
			this.memory.WriteByte(c_oSerPropLenType.Long);
			this.memory.WriteLong(marker.Size);
		}
		if(null != marker.Symbol)
		{
			this.memory.WriteByte(c_oSer_ChartSeriesMarkerType.Symbol);
			this.memory.WriteByte(c_oSerPropLenType.Byte);
			this.memory.WriteByte(marker.Symbol);
		}
    };
	this.WriteDataLabels = function(chart)
    {
        var oThis = this;
		if(null != chart.bShowValue)
		{
			this.memory.WriteByte(c_oSer_ChartSeriesDataLabelsType.ShowVal);
			this.memory.WriteByte(c_oSerPropLenType.Byte);
			this.memory.WriteBool(chart.bShowValue);
		}
    };
}
/** @constructor */
function Binary_ChartReader(stream, chart)
{
	this.stream = stream;
	this.bcr = new Binary_CommonReader(this.stream);
	this.chart = chart;
	this.chartType = null;
	this.oLegendEntries = new Object();
	this.oSeriesByIndex = new Object();
	this.PreRead = function()
	{
		this.oLegendEntries = new Object();
		this.oSeriesByIndex = new Object();
		this.chart.legend.bShow = false;
	}
	this.Read = function(length)
	{
		var res = c_oSerConstants.ReadOk;
        var oThis = this;
		this.PreRead();
        res = this.bcr.Read1(length, function(t,l){
                return oThis.GraphicFrame(t,l);
            });
		this.PostRead();
		return res;
	};
	this.PostRead = function()
	{
		if("" != this.chartType && null != this.chart.series && this.chart.series.length > 0)
		{
			//инициализируем interval в Woorksheet.init
			this.chart.type = this.chartType;
			for(var i in this.oLegendEntries)
			{
				var index = i - 0;
				var legendEntries = this.oLegendEntries[i];
				if(null != legendEntries.oTxPr)
				{
					var seria = this.oSeriesByIndex[i];
					if(null != seria && null != legendEntries.oTxPr.font)
						seria.titleFont = legendEntries.oTxPr.font;
				}
			}
		}
	}
	this.GraphicFrame = function(type, length)
	{
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if ( c_oSer_DrawingType.Chart === type )
        {
			res = this.bcr.Read1(length, function(t,l){
					return oThis.ReadChart(t,l);
				});
		}
		else
            res = c_oSerConstants.ReadUnknown;
		return res;
	}
	this.ReadChart = function(type, length)
	{
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if ( c_oSer_ChartType.Legend === type )
        {
			this.chart.legend.bShow = true;
			res = this.bcr.Read1(length, function(t,l){
					return oThis.ReadLegend(t,l, this.oLegendEntries);
				});
		}
		else if ( c_oSer_ChartType.Title === type )
		{
			this.chart.header.title = this.stream.GetString2LE(length);
			if("" == this.chart.header.title)
				this.chart.header.bDefaultTitle = true;
		}
		else if ( c_oSer_ChartType.PlotArea === type )
		{
			var oAxis = {CatAx: null, aValAx: new Array()};
			res = this.bcr.Read1(length, function(t,l){
					return oThis.ReadPlotArea(t,l, oAxis);
				});
			var xAxis = null;
			var yAxis = null;
			if(null != oAxis.CatAx)
			{
				xAxis = oAxis.CatAx;
				if(oAxis.aValAx.length > 0)
					yAxis = oAxis.aValAx[0];
			}
			else
			{
				if(oAxis.aValAx.length > 0)
					xAxis = oAxis.aValAx[0];
				if(oAxis.aValAx.length > 1)
					yAxis = oAxis.aValAx[1];
				if(null != xAxis && null != yAxis && null != xAxis.axPos && null != yAxis.axPos)
				{
					if(EChartAxPos.chartaxposLeft == xAxis.axPos || EChartAxPos.chartaxposRight == xAxis.axPos)
					{
						var oTemp = xAxis;
						xAxis = yAxis;
						yAxis = oTemp;
					}
				}
			}
			//выставл€ем начальные значени€ как у Excel
			this.chart.xAxis.bShow = this.chart.yAxis.bShow = false;
			this.chart.xAxis.bGrid = this.chart.yAxis.bGrid = false;
			var fExecAxis = function(oFrom, oTo)
			{
				if(null != oFrom.title)
					oTo.title = oFrom.title;
				if(null != oFrom.bDefaultTitle)
					oTo.bDefaultTitle = oFrom.bDefaultTitle;
				if(null != oFrom.bShow)
					oTo.bShow = oFrom.bShow;
				if(null != oFrom.bGrid)
					oTo.bGrid = oFrom.bGrid;
				if(null != oFrom.titlefont)
					oTo.titleFont = oFrom.titlefont;
				if(null != oFrom.lablefont)
					oTo.labelFont = oFrom.lablefont;
			}
			if(null != xAxis)
				fExecAxis(xAxis, this.chart.xAxis);
			if(null != yAxis)
				fExecAxis(yAxis, this.chart.yAxis);
			//мен€ем местами из-за разного понимани€ флагов нами и Excel
			var bTemp = this.chart.xAxis.bGrid;
			this.chart.xAxis.bGrid = this.chart.yAxis.bGrid;
			this.chart.yAxis.bGrid = bTemp;
			if(c_oAscChartType.hbar == this.chartType)
			{
				var oTemp = this.chart.xAxis;
				this.chart.xAxis = this.chart.yAxis;
				this.chart.yAxis = oTemp;
			}
		}
		else if ( c_oSer_ChartType.Style === type )
		{
			this.chart.styleId = this.stream.GetULongLE();
		}
		else if ( c_oSer_ChartType.TitlePptx === type || c_oSer_ChartType.TitleTxPrPptx === type)
		{
			var oPresentationSimpleSerializer = new PresentationSimpleSerializer();
			var textBody = oPresentationSimpleSerializer.ReadTextBody(this.stream);
			var params = this.ParsePptxParagraph(textBody);
			if(c_oSer_ChartType.TitlePptx === type)
				this.chart.header.title = params.text;
			else
				this.chart.header.bDefaultTitle = true;
			if(null != params.font)
				this.chart.header.font = params.font;
		}
		else if ( c_oSer_ChartType.ShowBorder === type )
			this.chart.bShowBorder = this.stream.GetBool();
		else
            res = c_oSerConstants.ReadUnknown;
		return res;
	};
	this.ReadLegend = function(type, length, oLegendEntries)
	{
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if ( c_oSer_ChartLegendType.Layout === type )
        {
			var oLegendLayout = new Object();
			res = this.bcr.Read2Spreadsheet(length, function(t,l){
					return oThis.ReadLegendLayout(t,l, oLegendLayout);
				});
		}
		else if ( c_oSer_ChartLegendType.LegendPos === type )
        {
			var byteLegendPos = this.stream.GetUChar();
			switch(byteLegendPos)
			{
			case EChartLegendPos.chartlegendposLeft: this.chart.legend.position = c_oAscChartLegend.left;break;
			case EChartLegendPos.chartlegendposTop: this.chart.legend.position = c_oAscChartLegend.top;break;
			case EChartLegendPos.chartlegendposRight:
			case EChartLegendPos.chartlegendposRightTop: this.chart.legend.position = c_oAscChartLegend.right;break;
			case EChartLegendPos.chartlegendposBottom: this.chart.legend.position = c_oAscChartLegend.bottom;break;
			}
		}
		else if ( c_oSer_ChartLegendType.Overlay === type )
			this.chart.legend.bOverlay = this.stream.GetBool();
		else if ( c_oSer_ChartLegendType.LegendEntry === type )
		{
			var oNewLegendEntry = {nIndex: null, bDelete: null, oTxPr: null};
			res = this.bcr.Read1(length, function(t,l){
					return oThis.ReadLegendEntry(t,l, oNewLegendEntry);
				});
			if(null != oNewLegendEntry.nIndex)
				this.oLegendEntries[oNewLegendEntry.nIndex] = oNewLegendEntry;
		}
		else
            res = c_oSerConstants.ReadUnknown;
		return res;
	};
	this.ReadLegendEntry = function(type, length, oLegendEntry)
	{
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if(c_oSer_ChartLegendEntryType.Index === type)
			oLegendEntry.nIndex = this.stream.GetULongLE();
		else if(c_oSer_ChartLegendEntryType.Delete === type)
			oLegendEntry.bDelete = this.stream.GetBool();
		else if(c_oSer_ChartLegendEntryType.TxPrPptx === type)
		{
			var oPresentationSimpleSerializer = new PresentationSimpleSerializer();
			var textBody = oPresentationSimpleSerializer.ReadTextBody(this.stream);
			oLegendEntry.oTxPr = this.ParsePptxParagraph(textBody);
		}
		else
            res = c_oSerConstants.ReadUnknown;
		return res;
	};
	this.ReadLegendLayout = function(type, length, oLegendLayout)
	{
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if(c_oSer_ChartLegendLayoutType.H === type)
			oLegendLayout.H = stream.GetDoubleLE();
		else if(c_oSer_ChartLegendLayoutType.HMode === type)
			oLegendLayout.HMode = this.stream.GetUChar();
		else if(c_oSer_ChartLegendLayoutType.LayoutTarget === type)
			oLegendLayout.LayoutTarget = this.stream.GetUChar();
		else if(c_oSer_ChartLegendLayoutType.W === type)
			oLegendLayout.W = stream.GetDoubleLE();
		else if(c_oSer_ChartLegendLayoutType.WMode === type)
			oLegendLayout.WMode = this.stream.GetUChar();
		else if(c_oSer_ChartLegendLayoutType.X === type)
			oLegendLayout.X = stream.GetDoubleLE();
		else if(c_oSer_ChartLegendLayoutType.XMode === type)
			oLegendLayout.XMode = this.stream.GetUChar();
		else if(c_oSer_ChartLegendLayoutType.Y === type)
			oLegendLayout.Y = stream.GetDoubleLE();
		else if(c_oSer_ChartLegendLayoutType.YMode === type)
			oLegendLayout.YMode = this.stream.GetUChar();
		else
            res = c_oSerConstants.ReadUnknown;
		return res;
	};
	this.ReadPlotArea = function(type, length, oAxis)
	{
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if ( c_oSer_ChartPlotAreaType.CatAx === type )
        {
			oAxis.CatAx = {title: null, bDefaultTitle: null, bGrid: null, bShow: null, axPos: null, titlefont: null, lablefont: null};
			res = this.bcr.Read1(length, function(t,l){
					return oThis.ReadAx(t,l, oAxis.CatAx);
				});
		}
		else if ( c_oSer_ChartPlotAreaType.ValAx === type )
        {
			var oNewValAx = {title: null, bDefaultTitle: null, bGrid: null, bShow: null, axPos: null, titlefont: null, lablefont: null};
			res = this.bcr.Read1(length, function(t,l){
					return oThis.ReadAx(t,l, oNewValAx);
				});
			oAxis.aValAx.push(oNewValAx);
		}
		else if ( c_oSer_ChartPlotAreaType.BasicChart === type )
        {
			var oData = {BarDerection: null};
			res = this.bcr.Read2Spreadsheet(length, function(t,l){
					return oThis.ReadBasicChart(t,l, oData);
				});
			if(null != oData.BarDerection && c_oAscChartType.hbar == this.chartType)
			{
				switch(oData.BarDerection)
				{
					case EChartBarDerection.chartbardirectionBar:break;
					case EChartBarDerection.chartbardirectionCol: this.chartType = c_oAscChartType.bar;break;
				}
			}
		}
		else
            res = c_oSerConstants.ReadUnknown;
		return res;
	}
	this.ReadAx = function(type, length, oAx)
	{
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if ( c_oSer_ChartCatAxType.Title === type )
		{
			oAx.title = this.stream.GetString2LE(length);
			if("" == oAx.title)
				oAx.bDefaultTitle = true;
		}
		else if ( c_oSer_ChartCatAxType.MajorGridlines === type )
			oAx.bGrid = this.stream.GetBool();
		else if ( c_oSer_ChartCatAxType.Delete === type )
			oAx.bShow = !this.stream.GetBool();
		else if ( c_oSer_ChartCatAxType.AxPos === type )
			oAx.axPos = this.stream.GetUChar();
		else if ( c_oSer_ChartCatAxType.TitlePptx === type || c_oSer_ChartCatAxType.TitleTxPrPptx === type)
		{
			var oPresentationSimpleSerializer = new PresentationSimpleSerializer();
			var textBody = oPresentationSimpleSerializer.ReadTextBody(this.stream);
			var params = this.ParsePptxParagraph(textBody);
			if(c_oSer_ChartCatAxType.TitlePptx === type)
				oAx.title = params.text;
			else
				oAx.bDefaultTitle = true;
			if(null != params.font)
				oAx.titlefont = params.font;
		}
		else if ( c_oSer_ChartCatAxType.TxPrPptx === type )
		{
			var oPresentationSimpleSerializer = new PresentationSimpleSerializer();
			var textBody = oPresentationSimpleSerializer.ReadTextBody(this.stream);
			var params = this.ParsePptxParagraph(textBody);
			if("" != params.text)
				oAx.title = params.text;
			else
				oAx.bDefaultTitle  = true;
			if(null != params.font)
				oAx.lablefont = params.font;
		}
		else
            res = c_oSerConstants.ReadUnknown;
		return res;
	};
	this.ReadBasicChart = function(type, length, oData)
	{
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if ( c_oSer_BasicChartType.Type === type )
		{
			var byteType = this.stream.GetUChar();
			switch(byteType)
			{
				case EChartBasicTypes.chartbasicBarChart:
				case EChartBasicTypes.chartbasicBar3DChart: this.chartType = c_oAscChartType.hbar;break;
				case EChartBasicTypes.chartbasicAreaChart:
				case EChartBasicTypes.chartbasicRadarChart: this.chartType = c_oAscChartType.area;break;
				case EChartBasicTypes.chartbasicLineChart:
				case EChartBasicTypes.chartbasicLine3DChart: this.chartType = c_oAscChartType.line;break;
				case EChartBasicTypes.chartbasicPieChart:
				case EChartBasicTypes.chartbasicDoughnutChart: this.chartType = c_oAscChartType.pie;break;
				case EChartBasicTypes.chartbasicBubbleChart:
				case EChartBasicTypes.chartbasicScatterChart: this.chartType = c_oAscChartType.scatter;break;
				case EChartBasicTypes.chartbasicStockChart: this.chartType = c_oAscChartType.stock;break;
			}
		}
		else if ( c_oSer_BasicChartType.BarDerection === type )
			oData.BarDerection = this.stream.GetUChar();
		else if ( c_oSer_BasicChartType.Grouping === type )
		{
			var byteGrouping = this.stream.GetUChar();
			var subtype = null;
			switch(byteGrouping)
			{
				case EChartBarGrouping.chartbargroupingClustered:
				case EChartBarGrouping.chartbargroupingStandard: subtype = c_oAscChartSubType.normal;break;
				case EChartBarGrouping.chartbargroupingPercentStacked: subtype = c_oAscChartSubType.stackedPer;break;
				case EChartBarGrouping.chartbargroupingStacked: subtype = c_oAscChartSubType.stacked;break;
			}
			if(null != subtype)
				this.chart.subType = subtype;
		}
		else if ( c_oSer_BasicChartType.Overlap === type )
		{
			var nOverlap = this.stream.GetULongLE();
		}
		else if ( c_oSer_BasicChartType.Series === type )
		{
			res = this.bcr.Read1(length, function(t,l){
					return oThis.ReadSeries(t,l);
				});
		}
		else if ( c_oSer_BasicChartType.DataLabels === type )
		{
			res = this.bcr.Read2Spreadsheet(length, function(t,l){
					return oThis.ReadDataLabels(t,l);
				});
		}
		else
            res = c_oSerConstants.ReadUnknown;
		return res;
	};
	this.ReadSeries = function(type, length)
	{
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if ( c_oSer_BasicChartType.Seria === type )
		{
			var seria = new asc_CChartSeria();
			res = this.bcr.Read1(length, function(t,l){
					return oThis.ReadSeria(t,l, seria);
				});
			this.chart.series.push(seria);
		}
		else
            res = c_oSerConstants.ReadUnknown;
		return res;
	};
	this.ReadSeria = function(type, length, seria)
	{
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if ( c_oSer_ChartSeriesType.xVal === type )
		{
			res = this.bcr.Read1(length, function(t,l){
					return oThis.ReadSeriesNumCache(t,l, seria.xVal);
				});
		}
		else if ( c_oSer_ChartSeriesType.Val === type )
		{
			res = this.bcr.Read1(length, function(t,l){
					return oThis.ReadSeriesNumCache(t,l, seria.Val);
				});
		}
		else if ( c_oSer_ChartSeriesType.Tx === type )
			seria.title = this.stream.GetString2LE(length);
		// else if ( c_oSer_ChartSeriesType.TxRef === type )
		// {
			// seria.TxRef = new Object();
			// res = this.bcr.Read1(length, function(t,l){
					// return oThis.ReadSeriesNumCache(t,l, seria.TxRef);
				// });
		// }
		else if ( c_oSer_ChartSeriesType.Marker === type )
		{
			res = this.bcr.Read2Spreadsheet(length, function(t,l){
					return oThis.ReadSeriesMarkers(t,l, seria.Marker);
				});
		}
		else if ( c_oSer_ChartSeriesType.OutlineColor === type )
		{
            var color = new OpenColor();
            res = this.bcr.Read2Spreadsheet(length, function(t,l){
                    return oThis.bcr.ReadColorSpreadsheet(t,l, color);
                });
			if(null != color.theme)
				seria.OutlineColor = g_oColorManager.getThemeColor(color.theme, color.tint);
			else if(null != color.rgb)
                seria.OutlineColor = new RgbColor(0x00ffffff & color.rgb);
		}
		else if ( c_oSer_ChartSeriesType.Index === type )
		{
            this.oSeriesByIndex[this.stream.GetULongLE()] = seria;
		}
		else if ( c_oSer_ChartSeriesType.Order === type )
		{
            this.stream.GetULongLE();
		}
		else
            res = c_oSerConstants.ReadUnknown;
		return res;
	};
	this.ReadSeriesNumCache = function(type, length, Val)
	{
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if ( c_oSer_ChartSeriesNumCacheType.Formula === type )
			Val.Formula = this.stream.GetString2LE(length);
		else if ( c_oSer_ChartSeriesNumCacheType.NumCache === type )
		{
			res = this.bcr.Read1(length, function(t,l){
					return oThis.ReadSeriesNumCacheValues(t,l, Val.NumCache);
				});
		}
		else
            res = c_oSerConstants.ReadUnknown;
		return res;
	};
	this.ReadSeriesNumCacheValues = function(type, length, aValues)
	{
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if ( c_oSer_ChartSeriesNumCacheType.NumCacheVal === type )
			aValues.push(this.stream.GetString2LE(length));
		else
            res = c_oSerConstants.ReadUnknown;
		return res;
	};
	this.ReadSeriesMarkers = function(type, length, oMarker)
	{
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if ( c_oSer_ChartSeriesMarkerType.Size === type )
			oMarker.Size = this.stream.GetULongLE();
		else if ( c_oSer_ChartSeriesMarkerType.Symbol === type )
			oMarker.Symbol = this.stream.GetUChar();
		else
            res = c_oSerConstants.ReadUnknown;
		return res;
	};
	this.ReadDataLabels = function(type, length)
	{
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if ( c_oSer_ChartSeriesDataLabelsType.ShowVal === type )
			this.chart.bShowValue = this.stream.GetBool();
		else if ( c_oSer_ChartSeriesDataLabelsType.TxPrPptx === type )
		{
			var oPresentationSimpleSerializer = new PresentationSimpleSerializer();
			var textBody = oPresentationSimpleSerializer.ReadTextBody(this.stream);
			//this.ParsePptxParagraph(textBody);
		}
		else
            res = c_oSerConstants.ReadUnknown;
		return res;
	};
	this.ParsePptxParagraph = function(textbody)
	{
		var res = {text: "", font: null};
		for(var i = 0, length = textbody.content.length; i < length; ++i)
		{
			var par = textbody.content[i];
			if(0 != i)
				res.text += "\r\n";
			else
			{
				if(null != par.rPr)
				{
					res.font = new asc_CChartFont();
					if(null != par.rPr.Bold)
						res.font.bold = par.rPr.Bold ? 1 : 0;
					if(null != par.rPr.Italic)
						res.font.italic = par.rPr.Italic ? 1 : 0;
					if(null != par.rPr.Underline)
						res.font.underline = par.rPr.Underline ? 1 : 0;
					if(null != par.rPr.FontSize)
						res.font.size = par.rPr.FontSize;
					if(null != par.rPr.FontFamily && null != par.rPr.FontFamily.Name && "" != par.rPr.FontFamily.Name)
						res.font.name = par.rPr.FontFamily.Name;
					// if(null != par.rPr.unifill)
					// {
						// var fill = par.rPr.unifill.fill;
						// if(null != fill && FILL_TYPE_SOLID == fill.type)
						// {
							// var color = fill.color;
							// if(null != color.color)
							// {
								// color = color.color;
								// if(null != color)
								// {
									// var rgba = {R:0, G:0, B:0, A:255};
									// if(COLOR_TYPE_SRGB == color.type)
									// {
										// rgba.R = color.RGBA.R;
										// rgba.G = color.RGBA.G;
										// rgba.B = color.RGBA.B;
									// }
									// else if(COLOR_TYPE_SCHEME == color.type)
									// {
										// var _theme = null;
										// var _clrMap = null;
										// if(null != Asc && null != Asc.editor && null != Asc.editor.wbModel)
										// {
											// _theme = Asc.editor.wbModel.theme;
											// _clrMap = Asc.editor.wbModel.clrSchemeMap;
										// }
										// else if(null != editor && null != editor.WordControl && null != editor.WordControl.m_oLogicDocument)
										// {
											// _theme = editor.WordControl.m_oLogicDocument.theme;
											// _clrMap = editor.WordControl.m_oLogicDocument.clrSchemeMap;
										// }
										// if(null != _theme && null != _clrMap)
											// color.Calculate(_theme, _clrMap, rgba);
									// }
									// var num = rgba.R << 16 | rgba.G << 8 | rgba.B;
									// var c = num.toString(16);
									// while (c.length < 6) {c = "0" + c;}
									// res.font.color = num;	
								// }
							// }
						// }
					// }
				}
			}
			res.text += par.text;
		}
		return res;
	}
}

function isRealObject(obj)
{
    return obj !== null && typeof obj === "object";
}
function WriteObjectLong(Writer, Object)
{
    var field_count = 0;
    for(var key in Object)
    {
        ++field_count;
    }
    Writer.WriteLong(field_count);
    for(key in Object)
    {
        Writer.WriteString2(key);
        Writer.WriteLong(Object[key]);
    }
}
function ReadObjectLong(Reader)
{
    var ret = {};
    var field_count = Reader.GetLong();
    for(var index =0; index < field_count; ++index)
    {
        var key = Reader.GetString2();
        ret[key] = Reader.GetLong();
    }
    return ret;
}
