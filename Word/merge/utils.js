var jsdom = require("jsdom").jsdom;
var document = jsdom(null, null/*, {
   features: {
     FetchExternalResources : ["script", "img", "css", "frame", "iframe", "link"]
   }
   }*/);
var window = document.createWindow();
var Image = window.Image;
var navigator = require('navigator');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
/*var window = {chrome:1};
window.postMessage = function(){};
window.addEventListener = function(){};
function XMLHttpRequest()
{
	return undefined;
}
function Image()
{
	this.onload = null;
}
function FT_Memory()
{
    this.Alloc = function(size)
    {
        var p = { data: new Uint8Array(size), size : size };
		p.obj = p.data;
        return p;
    }
}

var g_memory = new FT_Memory();

var charA = "A".charCodeAt(0);
var charZ = "Z".charCodeAt(0);
var chara = "a".charCodeAt(0);
var charz = "z".charCodeAt(0);
var char0 = "0".charCodeAt(0);
var char9 = "9".charCodeAt(0);
var charp = "+".charCodeAt(0);
var chars = "/".charCodeAt(0);

function DecodeBase64Char(ch)
{
    if (ch >= charA && ch <= charZ)
        return ch - charA + 0;
    if (ch >= chara && ch <= charz)
        return ch - chara + 26;
    if (ch >= char0 && ch <= char9)
        return ch - char0 + 52;
    if (ch == charp)
        return 62;
    if (ch == chars)
        return 63;
    return -1;
}
var g_stringBase64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
function Base64Encode(srcData, nSrcLen)
{
    var nWritten = 0;
    var nLen1 = (parseInt(nSrcLen / 3) * 4);
    var nLen2 = parseInt(nLen1 / 76);
    var nLen3 = 19;
    var srcInd = 0;
    var dstStr = "";

    for (var i=0; i<=nLen2; i++)
    {
        if (i == nLen2)
            nLen3 = parseInt((nLen1%76)/4);

        for (var j=0;j<nLen3;j++)
        {
            var dwCurr = 0;
            for (var n=0; n<3; n++)
            {
                dwCurr |= srcData[srcInd++];
                dwCurr <<= 8;
            }
            for (var k=0; k<4; k++)
            {
                var b = (dwCurr>>>26)&0xFF;
                dstStr += g_stringBase64[b];
                dwCurr <<= 6;
                dwCurr &= 0xFFFFFFFF;
            }
        }
    }
    nLen2 = (nSrcLen%3 != 0) ? (nSrcLen%3 + 1) : 0;
    if (nLen2)
    {
        var dwCurr = 0;
        for (var n=0; n<3; n++)
        {
            if (n<(nSrcLen%3))
                dwCurr |= srcData[srcInd++];
            dwCurr <<= 8;
        }
        for (var k=0; k<nLen2; k++)
        {
            var b = (dwCurr>>>26)&0xFF;
            dstStr += g_stringBase64[b];
            dwCurr <<= 6;
        }

        nLen3 = (nLen2 != 0) ? 4-nLen2 : 0;
        for (var j=0; j<nLen3; j++)
        {
            dstStr += '=';
        }
    }
    return dstStr;
}
function CMemory()
{
    this.Init = function()
    {
        this.len = 1024*1024*5;
		this.data = new Uint8Array(this.len);
        this.pos = 0;
    }
    
    this.ImData = null;
    this.data = null;
    this.len = 0;
    this.pos = 0;
    this.Init();

    this.CheckSize = function(count)
    {
        if (this.pos + count >= this.len)
        {
            var oldData = this.data;
            var oldPos = this.pos;

            this.len *= 2;

			this.data = new Uint8Array(this.len);
            var newData = this.data;

            for (var i=0;i<this.pos;i++)
                newData[i]=oldData[i];
        }
    }
    this.GetBase64Memory = function()
    {
        return Base64Encode(this.data,this.pos);
    }
	this.GetCurPosition = function()
	{
		return this.pos;
	}
	this.Seek = function(nPos)
	{
		this.pos = nPos;
	}
	this.Skip = function(nDif)
	{
		this.pos += nDif;
	}
	this.WriteBool = function(val)
    {
        this.CheckSize(1);
		if(false == val)
			this.data[this.pos++] = 0;
		else
			this.data[this.pos++] = 1;
    }
    this.WriteByte = function(val)
    {
        this.CheckSize(1);
        this.data[this.pos++] = val;
    }
    this.WriteLong = function(val)
    {
        this.CheckSize(4);
        this.data[this.pos++] = (val)&0xFF;
        this.data[this.pos++] = (val >>> 8)&0xFF;
        this.data[this.pos++] = (val >>> 16)&0xFF;
        this.data[this.pos++] = (val >>> 24)&0xFF;
    }
    this.WriteDouble = function(val)
    {
        this.CheckSize(4);
        var lval = parseInt(val * 100000) & 0xFFFFFFFF; // спасаем пять знаков после запятой.
        this.data[this.pos++] = (lval)&0xFF;
        this.data[this.pos++] = (lval >>> 8)&0xFF;
        this.data[this.pos++] = (lval >>> 16)&0xFF;
        this.data[this.pos++] = (lval >>> 24)&0xFF;
    }
    this.WriteString = function(text)
    {
        var count = text.length&0xFFFF;
        this.CheckSize(count+2);
        this.data[this.pos++] = count&0xFF;
        this.data[this.pos++] = (count >>> 8)&0xFF;
        for (var i=0;i<count;i++)
        {
            var c = text.charCodeAt(i) & 0xFFFF;
            this.data[this.pos++] = c&0xFF;
            this.data[this.pos++] = (c >>> 8)&0xFF;
        }
    }
    this.WriteString2 = function(text)
    {
		var count = text.length & 0x7FFFFFFF
		var countWrite = 2 * count;
		this.WriteLong(countWrite);
        this.CheckSize(countWrite);
        for (var i=0;i<count;i++)
        {
            var c = text.charCodeAt(i) & 0xFFFF;
            this.data[this.pos++] = c&0xFF;
            this.data[this.pos++] = (c >>> 8)&0xFF;
        }
    }
}
var FontStyle =
{
    FontStyleRegular:    0,
    FontStyleBold:       1,
    FontStyleItalic:     2,
    FontStyleBoldItalic: 3,
    FontStyleUnderline:  4,
    FontStyleStrikeout:  8
};*/