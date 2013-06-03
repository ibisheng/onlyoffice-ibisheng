//----------------------------------------------------------------------------------------------------------------------------------------------------------
var koef_mm_to_pix = 96 / 25.4;
var dZoom           = 1.0;
var scrollPositionX = 0;
var scrollPositionY = 0;
var documentWidth	= 0;
var documentHeight	= 0;
var arrayPages;
var pagesCount = 0;

var fontManager = new CFontManager();
fontManager.Initialize();

var _message_calc = "zero_delay_calc";
var _message_draw = "zero_delay_draw";
var _message_scroll = "zero_delay_scroll";

function _rect()
{
    this.x = 0;
    this.y = 0;
    this.w = 0;
    this.h = 0;
}

function handleMessage(event)
{
    if (event.source == window && event.data == _message_calc)
    {
        event.stopPropagation();
        //OnCalculate();OnPaint();
	OnPaint2();
    }
    /*else if (event.source == window && event.data == _message_draw)
    {
        event.stopPropagation();
        OnPaint();
    }*/
}
window.addEventListener("message", handleMessage, true);


var bIsMobile =  /android|avantgo|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od|ad)|iris|kindle|lge |maemo|midp|mmp|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent || navigator.vendor || window.opera);

//----------------------------------------------------------------------------------------------------------------------------------------------------------
function getBodyWidth()
{
var result = 0;
if (this.innerWidth)  
	result = this.innerWidth;  
else if (document.documentElement && document.documentElement.clientWidth)  
	result = document.documentElement.clientWidth;  
else if (document.body)  
	result = document.body.clientWidth; 
return result;
}
function getBodyHeight()
{
var result = 0;
if (this.innerHeight)  
	result = this.innerHeight;  
else if (document.documentElement && document.documentElement.clientHeight)  
	result = document.documentElement.clientHeight;  
else if (document.body)  
	result = document.body.clientHeight; 
return result;
}
function getScrollTop()
{
var result = 0;
var bIsIE = /*@cc_on ! @*/ false;
if (bIsIE)
	return document.documentElement.scrollTop;
return this.scrollY;
}
function getScrollLeft()
{
var result = 0;
var bIsIE = /*@cc_on ! @*/ false;
if (bIsIE)
	return document.documentElement.scrollLeft;
return this.scrollX;
}
function getScrollMaxY(_size)
{
var result = 0;
var bIsIE = /*@cc_on ! @*/ false;
if (_size >= documentHeight)
	return 1;
return documentHeight - _size;
}
function getScrollMaxX(_size)
{
var result = 0;
var bIsIE = /*@cc_on ! @*/ false;
if (_size >= documentWidth)
	return 1;
return documentWidth - _size;
}
//----------------------------------------------------------------------------------------------------------------------------------------------------------
function StartViewer()
{
InitDocument();
OnResize();
    
window.onscroll = OnScroll;
window.onresize = OnResize;
OnPaint();
}

var bIsScroll = false;
var scrollInterval = 40;

function OnScroll()
{
bIsScroll = true;
return;
/*
scrollPositionY = getScrollTop();
scrollPositionX = getScrollLeft();

if (bIsMobile)
{
var canvas = document.getElementById("wind");
if (null == canvas)
    return;
	
canvas.style.top = scrollPositionY + "px";
}

window.postMessage(_message_calc, "*");
window.postMessage(_message_draw, "*");
*/
}

function OnTimerRepaint()
{
if (documentRenderer.checkRepaint() == 1)
	window.postMessage(_message_calc, "*");
}
function OnTimerScroll()
{
if (!bIsScroll)
{
	if (documentRenderer.checkRepaint() == 1)
		window.postMessage(_message_calc, "*");
	return;
}
bIsScroll = false;
scrollPositionY = getScrollTop();
scrollPositionX = getScrollLeft();

if (bIsMobile)
{
var canvas = document.getElementById("wind");
if (null == canvas)
    return;
	
canvas.style.top = scrollPositionY + "px";
}

window.postMessage(_message_calc, "*");
//window.postMessage(_message_draw, "*");
}

function OnResize()
{
var main_div = document.getElementById("main_div");
main_div.style.height = documentHeight + "px";
if (documentWidth > document.body.clientWidth)
{
main_div.style.width = documentWidth + "px";
}

var canvas = document.getElementById("wind");
if (null == canvas)
    return;

canvas.width = document.body.clientWidth;
canvas.height = getBodyHeight();
var _width  = canvas.width;
var _height = canvas.height;

var context = canvas.getContext("2d");
context.fillStyle = "#eef0f2";
context.fillRect(0, 0, _width, _height);

window.postMessage(_message_calc, "*");
//window.postMessage(_message_draw, "*");
}

function InitDocument()
{
pagesCount = documentRenderer.pagesCount;
arrayPages = new Array(pagesCount);
InitDocumentPages(arrayPages);
CalculateDocumentSize();
//setInterval(OnTimerRepaint, 40);
setInterval(OnTimerScroll, scrollInterval);
}

function SetZoom()
{
CalculateDocumentSize();
}

function CalculateDocumentSize()
{
documentWidth = 0;
documentHeight = 0;

var dKoef = dZoom * koef_mm_to_pix;
for (var i = 0; i < pagesCount; ++i)
{
if (arrayPages[i].width_mm > documentWidth)
	documentWidth = arrayPages[i].width_mm;

documentHeight += 20;
documentHeight += (arrayPages[i].height_mm * dKoef);

arrayPages[i].width_pix = parseInt(arrayPages[i].width_mm * dKoef);
arrayPages[i].height_pix = parseInt(arrayPages[i].height_mm * dKoef);
}

documentWidth *= dKoef;

documentHeight += 20;

scrollPositionX = 0;
scrollPositionY = 0;
}

function OnPaint()
{
    var canvas = document.getElementById("wind");
    if (null == canvas)
        return;

    var context = canvas.getContext("2d");
    var _width = canvas.width;
    var _height = canvas.height;

    var hor_pos_median = parseInt(_width / 2);
    if (0 != scrollPositionX)
    {
        var part = scrollPositionX / getScrollMaxX(_width);
        hor_pos_median = parseInt(documentWidth / 2 + part * (_width - documentWidth));
    }

    var documentMaxY = documentHeight - _height;
    if (documentMaxY < 0)
        documentMaxY = 0;

    var lCurrentTopInDoc = parseInt(scrollPositionY * documentMaxY / getScrollMaxY(_height));
    var lCurrentBottomInDoc = lCurrentTopInDoc + _height;

    var _xDst = Math.max(0, hor_pos_median - parseInt(documentWidth / 2) - 5);
    var _wDst = Math.min(documentWidth + 10,_width);
    context.fillStyle = "#eef0f2";
    context.fillRect(_xDst, 0, _wDst, _height);


    var lStart = 0;
    for (var i = 0; i < pagesCount; ++i)
    {
        if (lStart > lCurrentBottomInDoc)
        {
            arrayPages[i].stopRenderingAttack();
            continue;
            //break;
        }

        var _pageWidth = arrayPages[i].width_pix;
        var _pageHeight = arrayPages[i].height_pix;

        if (lStart + 20 + _pageHeight < lCurrentTopInDoc)
        {
            lStart += (20 + _pageHeight);
            arrayPages[i].stopRenderingAttack();
            continue;
        }

        var xDst = hor_pos_median - parseInt(_pageWidth / 2);
        var wDst = _pageWidth;
        var yDst = lStart + 20 - lCurrentTopInDoc;
        var hDst = _pageHeight;

        arrayPages[i].Draw(context, xDst, yDst, wDst, hDst);

        lStart += (20 + _pageHeight);
    }
}

function OnCalculate()
{
    var canvas = document.getElementById("wind");
    if (null == canvas)
        return;

    var context = canvas.getContext("2d");
    var _width = canvas.width;
    var _height = canvas.height;

    var hor_pos_median = parseInt(_width / 2);
    if (0 != scrollPositionX)
    {
        var part = scrollPositionX / getScrollMaxX(_width);
        hor_pos_median = parseInt(documentWidth / 2 + part * (_width - documentWidth));
    }

    var documentMaxY = documentHeight - _height;
    if (documentMaxY < 0)
        documentMaxY = 0;

    var lCurrentTopInDoc = parseInt(scrollPositionY * documentMaxY / getScrollMaxY(_height));
    var lCurrentBottomInDoc = lCurrentTopInDoc + _height;

    var lStart = 0;
    for (var i = 0; i < pagesCount; ++i)
    {
        if (lStart > lCurrentBottomInDoc)
        {
            arrayPages[i].stopRenderingAttack();
            continue;
            //break;
        }

        var _pageWidth = arrayPages[i].width_pix;
        var _pageHeight = arrayPages[i].height_pix;

        if (lStart + 20 + _pageHeight < lCurrentTopInDoc)
        {
            lStart += (20 + _pageHeight);
            arrayPages[i].stopRenderingAttack();
            continue;
        }

        var xDst = hor_pos_median - parseInt(_pageWidth / 2);
        var wDst = _pageWidth;
        var yDst = lStart + 20 - lCurrentTopInDoc;
        var hDst = _pageHeight;

        arrayPages[i].startCalculate();

        lStart += (20 + _pageHeight);
    }
}

function OnPaint2()
{
    var canvas = document.getElementById("wind");
    if (null == canvas)
        return;

    var context = canvas.getContext("2d");
    var _width = canvas.width;
    var _height = canvas.height;

    var hor_pos_median = parseInt(_width / 2);
    if (0 != scrollPositionX || (documentWidth > _width))
    {
        var part = scrollPositionX / getScrollMaxX(_width);
        hor_pos_median = parseInt(documentWidth / 2 + part * (_width - documentWidth));
    }

    var documentMaxY = documentHeight - _height;
    if (documentMaxY < 0)
        documentMaxY = 0;

    var lCurrentTopInDoc = parseInt(scrollPositionY * documentMaxY / getScrollMaxY(_height));
    var lCurrentBottomInDoc = lCurrentTopInDoc + _height;

    var _xDst = Math.max(0, hor_pos_median - parseInt(documentWidth / 2) - 5);
    var _wDst = Math.min(documentWidth + 10,_width);
    context.fillStyle = "#eef0f2";
    context.fillRect(_xDst, 0, _wDst, _height);


    var lStart = 0;
    for (var i = 0; i < pagesCount; ++i)
    {
        if (lStart > lCurrentBottomInDoc)
        {
            arrayPages[i].stopRenderingAttack();
            continue;
            //break;
        }

        var _pageWidth = arrayPages[i].width_pix;
        var _pageHeight = arrayPages[i].height_pix;

        if (lStart + 20 + _pageHeight < lCurrentTopInDoc)
        {
            lStart += (20 + _pageHeight);
            arrayPages[i].stopRenderingAttack();
            continue;
        }

        var xDst = hor_pos_median - parseInt(_pageWidth / 2);
        var wDst = _pageWidth;
        var yDst = lStart + 20 - lCurrentTopInDoc;
        var hDst = _pageHeight;

		arrayPages[i].startCalculate();
        arrayPages[i].Draw(context, xDst, yDst, wDst, hDst);

        lStart += (20 + _pageHeight);
    }
}