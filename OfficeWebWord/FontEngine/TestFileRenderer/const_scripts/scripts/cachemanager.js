function CCacheImage() {
// ---------------------------------
this.image = null;
this.image_locked = 0;
this.image_unusedCount = 0;
}

function CCacheManager() {
// ---------------------------------
this.arrayImages = new Array();
this.arrayCount = 0;
this.countValidImage = 5;
// ---------------------------------
this.CheckImagesForNeed = function()
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
// ---------------------------------
this.UnLock = function(_cache_image)
{
if (null == _cache_image)
    return;

_cache_image.image_locked = 0;
_cache_image.image_unusedCount = 0;
// затем нужно сбросить ссылку в ноль (_cache_image = null) <- это обязательно !!!!!!!
}
// ---------------------------------
this.Lock = function(_w, _h)
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
this.arrayImages[index].image.ctx.fillStyle = "#ffffff";
this.arrayImages[index].image.ctx.fillRect(0, 0, _w, _h);
this.arrayImages[index].image_locked = 1;
this.arrayImages[index].image_unusedCount = 0;
return this.arrayImages[index];
}
}