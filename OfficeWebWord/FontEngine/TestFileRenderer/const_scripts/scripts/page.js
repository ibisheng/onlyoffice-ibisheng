var cacheManager = new CCacheManager();
var documentRenderer = new CDocumentRenderer();

function CPage(_w, _h, _pageIndex) {
// ---------------------------------
this.width_mm  = _w;
this.height_mm = _h;
this.width_pix = parseInt(_w * koef_mm_to_pix * dZoom);
this.height_pix = parseInt(_h * koef_mm_to_pix * dZoom);
this.pageIndex = _pageIndex;

this.cachedImage = null;
this.indexIteration = 0;
this.timerId = -1;
// ---------------------------------
this.Draw = function(context, xDst, yDst, wDst, hDst, contextW, contextH) {
if (null != this.cachedImage)
{
	context.strokeStyle = "#bbbbbb";
	context.strokeRect(xDst, yDst, wDst, hDst);
    // потом посмотреть на кусочную отрисовку
    context.drawImage(this.cachedImage.image, xDst, yDst, wDst, hDst);
}
else
{
	context.fillStyle = "#ffffff";
	context.strokeStyle = "#bbbbbb";
	context.fillRect(xDst, yDst, wDst, hDst);
	context.strokeRect(xDst, yDst, wDst, hDst);
    //this.startRendering();
}
}
this.UpdateSize = function(_w, _h) {
this.width_mm  = _w;
this.height_mm = _h;
this.width_pix = parseInt(_w * koef_mm_to_pix * dZoom);
this.height_pix = parseInt(_h * koef_mm_to_pix * dZoom);
}
this.startRendering = function()
{
if (null != this.cachedImage)
	return;

this.cachedImage = cacheManager.Lock(this.width_pix, this.height_pix);
this.indexIteration = 0;
//this.timerId = setInterval(documentRenderer.drawpage(this), 0);
//var Start = new Date().getTime();
documentRenderer.drawpage(this);
//document.getElementById("Draw").innerHTML = "Draw: " + ((new Date().getTime() - Start) / 1000) + " s";
}
this.startCalculate = function()
{
    if (null != this.cachedImage)
        return;
		
    this.cachedImage = cacheManager.Lock(this.width_pix, this.height_pix);
    this.indexIteration = 0;
	
	//var Start = new Date().getTime();
    documentRenderer.drawpage(this);
	//document.getElementById("Draw").innerHTML = "Draw: " + ((new Date().getTime() - Start) / 1000) + " s";
}
this.stopRendering = function()
{
if (-1 != this.timerId)
{
    clearInterval(this.timerId);
    this.timerId = -1;
}
}
this.stopRenderingAttack = function()
{
this.stopRendering();
cacheManager.UnLock(this.cachedImage);
this.cachedImage = null;
}
this.get_graphics = function(){
    var g = new CGraphics();
    g.init(this.cachedImage.image.ctx,this.width_pix,this.height_pix,this.width_mm,this.height_mm);
    g.m_oFontManager = fontManager;
    return g;
}
//------------------------------------
}