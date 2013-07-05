function CCacheSlideImage()
{
    this.Image = null;
    this.Color = { r: 0, g: 0, b: 0};
}

var __nextFrame = (function() {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(callback) { return setTimeout(callback, 25); };
})();

var __cancelFrame = (function () {
        return window.cancelRequestAnimationFrame ||
            window.webkitCancelAnimationFrame ||
            window.webkitCancelRequestAnimationFrame ||
            window.mozCancelRequestAnimationFrame ||
            window.oCancelRequestAnimationFrame ||
            window.msCancelRequestAnimationFrame ||
            clearTimeout;
})();

function CTransitionAnimation(htmlpage)
{
    this.HtmlPage = htmlpage;

    this.Type       = 0;
    this.Param      = 0;
    this.Duration   = 0;

    this.StartTime  = 0;
    this.EndTime    = 0;
    this.CurrentTime = 0;

    this.CacheImage1 = new CCacheSlideImage();
    this.CacheImage2 = new CCacheSlideImage();

    this.Rect = new _rect();
    this.Params = null;

    this.IsBackward = false;
    this.DemonstrationObject = null;

    this.TimerId = null;
    var oThis = this;

    this.CalculateRect = function()
    {
        // эта функция определяет, где находится рект для перехода

        var _page = this.HtmlPage;

        var w = _page.m_oEditor.HtmlElement.width;
        var h = (((_page.m_oBody.AbsolutePosition.B - _page.m_oBody.AbsolutePosition.T) -
            (_page.m_oTopRuler.AbsolutePosition.B - _page.m_oTopRuler.AbsolutePosition.T)) * g_dKoef_mm_to_pix) >> 0;

        var _pageWidth = _page.m_oLogicDocument.Width * g_dKoef_mm_to_pix;
        var _pageHeight = _page.m_oLogicDocument.Height * g_dKoef_mm_to_pix;

        var _hor_Zoom = 100;
        if (0 != _pageWidth)
            _hor_Zoom = (100 * (w - 2 * _page.SlideDrawer.CONST_BORDER)) / _pageWidth;
        var _ver_Zoom = 100;
        if (0 != _pageHeight)
            _ver_Zoom = (100 * (h - 2 * _page.SlideDrawer.CONST_BORDER)) / _pageHeight;

        var _new_value = (Math.min(_hor_Zoom, _ver_Zoom) - 0.5) >> 0;

        if (_new_value < 5)
            _new_value = 5;

        var dKoef = (_new_value * g_dKoef_mm_to_pix / 100);

        var _slideW = (dKoef * _page.m_oLogicDocument.Width) >> 0;
        var _slideH = (dKoef * _page.m_oLogicDocument.Height) >> 0;

        var _centerX = (w / 2) >> 0;
        var _centerSlideX = (dKoef * _page.m_oLogicDocument.Width / 2) >> 0;
        var _hor_width_left = Math.min(0, _centerX - (_centerSlideX) - _page.SlideDrawer.CONST_BORDER);
        var _hor_width_right = Math.max(w - 1, _centerX + (_slideW - _centerSlideX) + _page.SlideDrawer.CONST_BORDER);

        var _centerY = (_page.m_oEditor.HtmlElement.height / 2) >> 0;
        var _centerSlideY = (dKoef * _page.m_oLogicDocument.Height / 2) >> 0;
        var _ver_height_top = Math.min(0, _centerY - _centerSlideY - _page.SlideDrawer.CONST_BORDER);
        var _ver_height_bottom = Math.max(_page.m_oEditor.HtmlElement.height - 1, _centerX + (_slideH - _centerSlideY) + _page.SlideDrawer.CONST_BORDER);

        this.Rect.x = _centerX - _centerSlideX - _hor_width_left;
        this.Rect.y = _centerY - _centerSlideY - _ver_height_top;
        this.Rect.w = _slideW;
        this.Rect.h = _slideH;
    }

    this.CalculateRectDemonstration = function()
    {
        var _width = this.HtmlPage.DemonstrationManager.Canvas.width;
        var _height = this.HtmlPage.DemonstrationManager.Canvas.height;

        var _w_mm = this.HtmlPage.m_oLogicDocument.Width;
        var _h_mm = this.HtmlPage.m_oLogicDocument.Height;

        // проверим аспект
        var aspectDisplay = _width / _height;
        var aspectPres = _w_mm / _h_mm;

        var _l = 0;
        var _t = 0;
        var _w = 0;
        var _h = 0;

        if (aspectPres > aspectDisplay)
        {
            _w = _width;
            _h = _w / aspectPres;
            _l = 0;
            _t = (_height - _h) >> 1;
        }
        else
        {
            _h = _height;
            _w = _h * aspectPres;
            _t = 0;
            _l = (_width - _w) >> 1;
        }

        this.Rect.x = _l >> 0;
        this.Rect.y = _t >> 0;
        this.Rect.w = _w >> 0;
        this.Rect.h = _h >> 0;
    }

    this.DrawImage1 = function(slide_num, _not_use_prev)
    {
        if (undefined === slide_num)
        {
            if (null == this.DemonstrationObject)
            {
                slide_num = this.HtmlPage.m_oDrawingDocument.SlideCurrent;
                if (slide_num >= this.HtmlPage.m_oDrawingDocument.SlidesCount)
                    slide_num = this.HtmlPage.m_oDrawingDocument.SlidesCount - 1;
            }
            else
            {
                slide_num = this.DemonstrationObject.SlideNum;
                if (slide_num >= this.HtmlPage.m_oDrawingDocument.SlidesCount)
                    slide_num = this.HtmlPage.m_oDrawingDocument.SlidesCount - 1;
            }
        }

        if (slide_num > 0 && (_not_use_prev !== true))
        {
            var _w = this.Rect.w;
            var _h = this.Rect.h;
            var _w_mm = this.HtmlPage.m_oLogicDocument.Width;
            var _h_mm = this.HtmlPage.m_oLogicDocument.Height;

            this.CacheImage1.Image = this.CreateImage(_w, _h);

            var g = new CGraphics();
            g.init(this.CacheImage1.Image.getContext('2d'), _w, _h, _w_mm, _h_mm);
            g.m_oFontManager = g_fontManager;

            g.transform(1,0,0,1,0,0);
            g.IsNoDrawingEmptyPlaceholder = true;

            this.HtmlPage.m_oLogicDocument.DrawPage(slide_num - 1, g);
        }
    }

    this.DrawImage2 = function(slide_num)
    {
        if (undefined === slide_num)
        {
            if (null == this.DemonstrationObject)
            {
                slide_num = this.HtmlPage.m_oDrawingDocument.SlideCurrent;
                if (slide_num >= this.HtmlPage.m_oDrawingDocument.SlidesCount)
                    slide_num = this.HtmlPage.m_oDrawingDocument.SlidesCount - 1;
            }
            else
            {
                slide_num = this.DemonstrationObject.SlideNum;
                if (slide_num >= this.HtmlPage.m_oDrawingDocument.SlidesCount)
                    slide_num = this.HtmlPage.m_oDrawingDocument.SlidesCount - 1;
            }
        }

        if (slide_num >= 0)
        {
            var _w = this.Rect.w;
            var _h = this.Rect.h;
            var _w_mm = this.HtmlPage.m_oLogicDocument.Width;
            var _h_mm = this.HtmlPage.m_oLogicDocument.Height;

            this.CacheImage2.Image = this.CreateImage(_w, _h);

            var g = new CGraphics();
            g.init(this.CacheImage2.Image.getContext('2d'), _w, _h, _w_mm, _h_mm);
            g.m_oFontManager = g_fontManager;

            g.transform(1,0,0,1,0,0);
            g.IsNoDrawingEmptyPlaceholder = true;

            this.HtmlPage.m_oLogicDocument.DrawPage(slide_num, g);
        }
    }

    this.Start = function(_not_use_prev)
    {
        if (null != this.DemonstrationObject)
            this.CalculateRectDemonstration();
        else
            this.CalculateRect();

        var _currentSlide = 0;
        if (null == this.DemonstrationObject)
        {
            _currentSlide = this.HtmlPage.m_oDrawingDocument.SlideCurrent;
            if (_currentSlide >= this.HtmlPage.m_oDrawingDocument.SlidesCount)
                _currentSlide = this.HtmlPage.m_oDrawingDocument.SlidesCount - 1;
        }
        else
        {
            _currentSlide = this.DemonstrationObject.SlideNum;
            if (_currentSlide >= this.HtmlPage.m_oDrawingDocument.SlidesCount)
                _currentSlide = this.HtmlPage.m_oDrawingDocument.SlidesCount - 1;
        }

        this.DrawImage1(_currentSlide, _not_use_prev);
        this.DrawImage2(_currentSlide);

        this.StartTime = new Date().getTime();
        this.EndTime = this.StartTime + this.Duration;

        switch (this.Type)
        {
            case c_oAscSlideTransitionTypes.Fade:
            {
                this._startFade();
                break;
            }
            case c_oAscSlideTransitionTypes.Push:
            {
                this._startPush();
                break;
            }
            case c_oAscSlideTransitionTypes.Wipe:
            {
                this._startWipe();
                break;
            }
            case c_oAscSlideTransitionTypes.Split:
            {
                this._startSplit();
                break;
            }
            case c_oAscSlideTransitionTypes.UnCover:
            {
                this._startUnCover();
                break;
            }
            case c_oAscSlideTransitionTypes.Cover:
            {
                this._startCover();
                break;
            }
            case c_oAscSlideTransitionTypes.Clock:
            {
                this._startClock();
                break;
            }
            case c_oAscSlideTransitionTypes.Zoom:
            {
                this._startZoom();
                break;
            }
            default:
                break;
        }
    }

    this.End = function(bIsAttack)
    {
        if (bIsAttack === true && null != this.TimerId)
            __cancelFrame(this.TimerId);

        this.TimerId = null;
        this.Params = null;

        if (this.DemonstrationObject != null)
        {
            this.DemonstrationObject.OnEndTransition(bIsAttack);

            this.CacheImage1.Image = null;
            this.CacheImage2.Image = null;
            return;
        }

        this.CacheImage1.Image = null;
        this.CacheImage2.Image = null;
        this.HtmlPage.OnScroll();
    }

    this.CreateImage = function(w, h)
    {
        var _im = document.createElement('canvas');
        _im.width = w;
        _im.height = h;
        return _im;
    }

    // animations
    this._startFade = function()
    {
        oThis.CurrentTime = new Date().getTime();

        if (oThis.CurrentTime >= oThis.EndTime)
        {
            oThis.End(false);
            return;
        }

        if (oThis.TimerId === null)
        {
            oThis.Params = { IsFirstAfterHalf : true };

            var _ctx1 = null;
            if (null == this.DemonstrationObject)
            {
                // отрисовываем на основной канве картинку первого слайда
                _ctx1 = oThis.HtmlPage.m_oEditor.HtmlElement.getContext('2d');
                _ctx1.fillStyle = "#B0B0B0";
                _ctx1.fillRect(0, 0, oThis.HtmlPage.m_oEditor.HtmlElement.width, oThis.HtmlPage.m_oEditor.HtmlElement.height);
            }
            else
            {
                _ctx1 = oThis.DemonstrationObject.Canvas.getContext('2d');
            }

            if (null != oThis.CacheImage1.Image)
            {
                _ctx1.drawImage(oThis.CacheImage1.Image, oThis.Rect.x, oThis.Rect.y, oThis.Rect.w, oThis.Rect.h);
            }
            else
            {
                var _c = oThis.CacheImage1.Color;
                _ctx1.fillStyle = "rgb(" + _c.r + "," + _c.g + "," + _c.b + ")";
                _ctx1.fillRect(oThis.Rect.x, oThis.Rect.y, oThis.Rect.w, oThis.Rect.h);
                _ctx1.beginPath();
            }
        }

        var _ctx2 = null;
        if (oThis.DemonstrationObject == null)
        {
            oThis.HtmlPage.m_oOverlayApi.Clear();
            oThis.HtmlPage.m_oOverlayApi.CheckRect(oThis.Rect.x, oThis.Rect.y, oThis.Rect.w, oThis.Rect.h);

            _ctx2 = oThis.HtmlPage.m_oOverlayApi.m_oContext;
        }
        else
        {
            _ctx2 = oThis.DemonstrationObject.Overlay.getContext('2d');
            _ctx2.clearRect(oThis.Rect.x, oThis.Rect.y, oThis.Rect.w, oThis.Rect.h);
        }

        var _part = (oThis.CurrentTime - oThis.StartTime) / oThis.Duration;
        if (oThis.IsBackward)
            _part = 1 - _part;

        if (oThis.Param == c_oAscSlideTransitionParams.Fade_Smoothly)
        {
            _ctx2.globalAlpha = _part;

            if (null != oThis.CacheImage2.Image)
            {
                _ctx2.drawImage(oThis.CacheImage2.Image, oThis.Rect.x, oThis.Rect.y, oThis.Rect.w, oThis.Rect.h);
            }
            else
            {
                var _c = oThis.CacheImage2.Color;
                _ctx2.fillStyle = "rgb(" + _c.r + "," + _c.g + "," + _c.b + ")";
                _ctx2.fillRect(oThis.Rect.x, oThis.Rect.y, oThis.Rect.w, oThis.Rect.h);
                _ctx2.beginPath();
            }

            _ctx2.globalAlpha = 1;
        }
        else if (oThis.Param == c_oAscSlideTransitionParams.Fade_Through_Black)
        {
            if (oThis.Params.IsFirstAfterHalf)
            {
                if (_part > 0.5)
                {
                    var _ctx1 = null;
                    if (null == this.DemonstrationObject)
                    {
                        // отрисовываем на основной канве картинку первого слайда
                        _ctx1 = oThis.HtmlPage.m_oEditor.HtmlElement.getContext('2d');
                    }
                    else
                    {
                        _ctx1 = oThis.DemonstrationObject.Canvas.getContext('2d');
                    }

                    _ctx1.fillStyle = "rgb(0,0,0)";
                    _ctx1.fillRect(oThis.Rect.x, oThis.Rect.y, oThis.Rect.w, oThis.Rect.h);
                    _ctx1.beginPath();

                    oThis.Params.IsFirstAfterHalf = false;
                }
            }

            if (oThis.Params.IsFirstAfterHalf)
            {
                _ctx2.globalAlpha = (2 * _part);
                _ctx2.fillStyle = "rgb(0,0,0)";
                _ctx2.fillRect(oThis.Rect.x, oThis.Rect.y, oThis.Rect.w, oThis.Rect.h);
                _ctx2.beginPath();
            }
            else
            {
                _ctx2.globalAlpha = (2 * (_part - 0.5));

                if (null != oThis.CacheImage2.Image)
                {
                    _ctx2.drawImage(oThis.CacheImage2.Image, oThis.Rect.x, oThis.Rect.y, oThis.Rect.w, oThis.Rect.h);
                }
                else
                {
                    var _c = oThis.CacheImage2.Color;
                    _ctx2.fillStyle = "rgb(" + _c.r + "," + _c.g + "," + _c.b + ")";
                    _ctx2.fillRect(oThis.Rect.x, oThis.Rect.y, oThis.Rect.w, oThis.Rect.h);
                    _ctx2.beginPath();
                }
            }

            _ctx2.globalAlpha = 1;
        }

        oThis.TimerId = __nextFrame(oThis._startFade);
    }

    this._startPush = function()
    {
        oThis.CurrentTime = new Date().getTime();

        if (oThis.CurrentTime >= oThis.EndTime)
        {
            oThis.End(false);
            return;
        }

        var _xDst = oThis.Rect.x;
        var _yDst = oThis.Rect.y;
        var _wDst = oThis.Rect.w;
        var _hDst = oThis.Rect.h;

        if (oThis.TimerId === null)
        {
            oThis.Params = { IsFirstAfterHalf : true };

            if (null == oThis.DemonstrationObject)
            {
                // отрисовываем на основной канве картинку первого слайда
                var _ctx1 = oThis.HtmlPage.m_oEditor.HtmlElement.getContext('2d');
                _ctx1.fillStyle = "#B0B0B0";
                _ctx1.fillRect(0, 0, oThis.HtmlPage.m_oEditor.HtmlElement.width, oThis.HtmlPage.m_oEditor.HtmlElement.height);
            }
        }

        var _xSrc = 0;
        var _ySrc = 0;

        var _xDstO = oThis.Rect.x;
        var _yDstO = oThis.Rect.y;
        var _wDstO = oThis.Rect.w;
        var _hDstO = oThis.Rect.h;

        var _xSrcO = 0;
        var _ySrcO = 0;

        var _part = (oThis.CurrentTime - oThis.StartTime) / oThis.Duration;
        if (oThis.IsBackward)
            _part = 1 - _part;

        var _offX = (_wDst * (1 - _part)) >> 0;
        var _offY = (_hDst * (1 - _part)) >> 0;

        switch (oThis.Param)
        {
            case c_oAscSlideTransitionParams.Param_Left:
            {
                _xSrc = _offX;
                _wDst -= _offX;

                _xDstO += _wDst;
                _wDstO -= _wDst;
                break;
            }
            case c_oAscSlideTransitionParams.Param_Right:
            {
                _xDst += _offX;
                _wDst -= _offX;

                _xSrcO = _wDst;
                _wDstO -= _wDst;
                break;
            }
            case c_oAscSlideTransitionParams.Param_Top:
            {
                _ySrc = _offY;
                _hDst -= _offY;

                _yDstO += _hDst;
                _hDstO -= _hDst;
                break;
            }
            case c_oAscSlideTransitionParams.Param_Bottom:
            {
                _yDst += _offY;
                _hDst -= _offY;

                _ySrcO = _hDst;
                _hDstO -= _hDst;
                break;
            }
            default:
                break;
        }

        var _ctx2 = null;

        if (null == oThis.DemonstrationObject)
        {
            oThis.HtmlPage.m_oOverlayApi.Clear();
            oThis.HtmlPage.m_oOverlayApi.CheckRect(oThis.Rect.x, oThis.Rect.y, oThis.Rect.w, oThis.Rect.h);
            _ctx2 = oThis.HtmlPage.m_oOverlayApi.m_oContext;
        }
        else
        {
            _ctx2 = oThis.DemonstrationObject.Overlay.getContext('2d');
        }

        if (_wDstO > 0 && _hDstO > 0)
        {
            if (null != oThis.CacheImage1.Image)
            {
                _ctx2.drawImage(oThis.CacheImage1.Image, _xSrcO, _ySrcO, _wDstO, _hDstO, _xDstO, _yDstO, _wDstO, _hDstO);
            }
            else
            {
                var _c = oThis.CacheImage2.Color;
                _ctx2.fillStyle = "rgb(" + _c.r + "," + _c.g + "," + _c.b + ")";
                _ctx2.fillRect(_xDstO, _yDstO, _wDstO, _hDstO);
                _ctx2.beginPath();
            }
        }

        if (_wDst > 0 && _hDst > 0)
        {
            if (null != oThis.CacheImage2.Image)
            {
                _ctx2.drawImage(oThis.CacheImage2.Image, _xSrc, _ySrc, _wDst, _hDst, _xDst, _yDst, _wDst, _hDst);
            }
            else
            {
                var _c = oThis.CacheImage2.Color;
                _ctx2.fillStyle = "rgb(" + _c.r + "," + _c.g + "," + _c.b + ")";
                _ctx2.fillRect(_xDst, _yDst, _wDst, _hDst);
                _ctx2.beginPath();
            }
        }

        oThis.TimerId = __nextFrame(oThis._startPush);
    }

    this._startWipe = function()
    {
        oThis.CurrentTime = new Date().getTime();

        if (oThis.CurrentTime >= oThis.EndTime)
        {
            oThis.End(false);
            return;
        }

        if (oThis.TimerId === null)
        {
            var _ctx1 = null;
            if (null == this.DemonstrationObject)
            {
                // отрисовываем на основной канве картинку первого слайда
                _ctx1 = oThis.HtmlPage.m_oEditor.HtmlElement.getContext('2d');
                _ctx1.fillStyle = "#B0B0B0";
                _ctx1.fillRect(0, 0, oThis.HtmlPage.m_oEditor.HtmlElement.width, oThis.HtmlPage.m_oEditor.HtmlElement.height);
            }
            else
            {
                _ctx1 = oThis.DemonstrationObject.Canvas.getContext('2d');
            }

            if (null != oThis.CacheImage1.Image)
            {
                _ctx1.drawImage(oThis.CacheImage1.Image, oThis.Rect.x, oThis.Rect.y, oThis.Rect.w, oThis.Rect.h);
            }
            else
            {
                var _c = oThis.CacheImage1.Color;
                _ctx1.fillStyle = "rgb(" + _c.r + "," + _c.g + "," + _c.b + ")";
                _ctx1.fillRect(oThis.Rect.x, oThis.Rect.y, oThis.Rect.w, oThis.Rect.h);
                _ctx1.beginPath();
            }
        }

        var _xDst = oThis.Rect.x;
        var _yDst = oThis.Rect.y;
        var _wDst = oThis.Rect.w;
        var _hDst = oThis.Rect.h;

        var _part = (oThis.CurrentTime - oThis.StartTime) / oThis.Duration;
        if (oThis.IsBackward)
            _part = 1 - _part;

        var _ctx2 = null;
        if (oThis.DemonstrationObject == null)
        {
            oThis.HtmlPage.m_oOverlayApi.Clear();
            oThis.HtmlPage.m_oOverlayApi.CheckRect(_xDst, _yDst, _wDst, _hDst);

            _ctx2 = oThis.HtmlPage.m_oOverlayApi.m_oContext;
            _ctx2.setTransform(1,0,0,1,0,0);
        }
        else
        {
            _ctx2 = oThis.DemonstrationObject.Overlay.getContext('2d');
            _ctx2.clearRect(_xDst, _yDst, _wDst, _hDst);
        }

        var _koefWipeLen = 1;

        switch (oThis.Param)
        {
            case c_oAscSlideTransitionParams.Param_Left:
            {
                if (null == oThis.TimerId)
                {
                    var _canvasTmp = document.createElement('canvas');
                    _canvasTmp.width = 256;
                    _canvasTmp.height = 1;
                    var _canvasTmpCtx = _canvasTmp.getContext('2d');
                    var _data = _canvasTmpCtx.createImageData(256, 1);
                    for (var i = 0; i < 256; i++)
                        _data.data[4 * i + 3] = 255 - i;
                    _canvasTmpCtx.putImageData(_data, 0, 0);

                    oThis.Params = { GradImage : _canvasTmp };
                }

                var _xPosStart = (_xDst - _koefWipeLen * _wDst) >> 0;
                var _xPos = (_xPosStart + (_part * (1 + _koefWipeLen) * _wDst)) >> 0;
                var _gradW = (_koefWipeLen * _wDst) >> 0;

                if (_xPos > _xDst)
                {
                    if ((_xPos + _gradW) > (_xDst + _wDst))
                    {
                        _ctx2.beginPath();
                        _ctx2.fillStyle = "#000000";
                        _ctx2.fillRect(_xDst, _yDst, _xPos - _xDst + 1, _hDst);
                        _ctx2.beginPath();

                        var _srcImageW = (256 * (_wDst - _xPos + _xDst) / _gradW) >> 0;
                        if (_srcImageW > 0 && (_wDst - _xPos + _xDst) > 0)
                            _ctx2.drawImage(oThis.Params.GradImage, 0, 0, _srcImageW, 1, _xPos, _yDst, _wDst - _xPos + _xDst, _hDst);
                    }
                    else
                    {
                        _ctx2.beginPath();
                        _ctx2.fillStyle = "#000000";
                        _ctx2.fillRect(_xDst, _yDst, _xPos - _xDst + 1, _hDst);
                        _ctx2.beginPath();

                        if (_gradW > 0)
                        {
                            _ctx2.drawImage(oThis.Params.GradImage, _xPos, _yDst, _gradW, _hDst);
                        }
                    }
                }
                else
                {
                    var _srcImageW = _xPos + _gradW - _xDst;
                    var _srcImageWW = 256 * (_xPos + _gradW - _xDst) / _gradW;

                    if (_srcImageW > 0 && _srcImageWW > 0)
                    {
                        _ctx2.drawImage(oThis.Params.GradImage, 256 - _srcImageWW, 0, _srcImageWW, 1, _xDst, _yDst, _srcImageW, _hDst);
                    }
                }
                break;
            }
            case c_oAscSlideTransitionParams.Param_Right:
            {
                if (null == oThis.TimerId)
                {
                    var _canvasTmp = document.createElement('canvas');
                    _canvasTmp.width = 256;
                    _canvasTmp.height = 1;
                    var _canvasTmpCtx = _canvasTmp.getContext('2d');
                    var _data = _canvasTmpCtx.createImageData(256, 1);
                    for (var i = 0; i < 256; i++)
                        _data.data[4 * i + 3] = i;
                    _canvasTmpCtx.putImageData(_data, 0, 0);

                    oThis.Params = { GradImage : _canvasTmp };
                }

                var _rDst = _xDst + _wDst;

                var _xPosStart = (_rDst + _koefWipeLen * _wDst) >> 0;
                var _xPos = (_xPosStart - (_part * (1 + _koefWipeLen) * _wDst)) >> 0;
                var _gradW = (_koefWipeLen * _wDst) >> 0;

                if (_xPos < _rDst)
                {
                    if ((_xPos - _gradW) < _xDst)
                    {
                        _ctx2.beginPath();
                        _ctx2.fillStyle = "#000000";
                        _ctx2.fillRect(_xPos, _yDst, _rDst - _xPos, _hDst);
                        _ctx2.beginPath();

                        var _srcImageW = (256 * (_xDst - _xPos + _gradW) / _gradW) >> 0;
                        if (_srcImageW > 0 && (_xPos - _xDst) > 0)
                            _ctx2.drawImage(oThis.Params.GradImage, _srcImageW, 0, 256 - _srcImageW, 1, _xDst, _yDst, _xPos - _xDst, _hDst);
                    }
                    else
                    {
                        _ctx2.beginPath();
                        _ctx2.fillStyle = "#000000";
                        _ctx2.fillRect(_xPos, _yDst, _rDst - _xPos + 1, _hDst);
                        _ctx2.beginPath();

                        if (_gradW > 0)
                        {
                            _ctx2.drawImage(oThis.Params.GradImage, _xPos - _gradW, _yDst, _gradW, _hDst);
                        }
                    }
                }
                else
                {
                    var _gradWW = _xPosStart - _xPos;
                    if (_gradWW > 0)
                    {
                         var _srcImageW = 256 * _gradWW / _gradW;

                         if (_srcImageW > 0 && (_rDst - _xPos + _gradW) > 0)
                         {
                             _ctx2.drawImage(oThis.Params.GradImage, 0, 0, _srcImageW, 1, _xPos - _gradW, _yDst, _rDst - _xPos + _gradW, _hDst);
                         }
                    }
                }
                break;
            }
            case c_oAscSlideTransitionParams.Param_Top:
            {
                if (null == oThis.TimerId)
                {
                    var _canvasTmp = document.createElement('canvas');
                    _canvasTmp.width = 1;
                    _canvasTmp.height = 256;
                    var _canvasTmpCtx = _canvasTmp.getContext('2d');
                    var _data = _canvasTmpCtx.createImageData(1, 256);
                    for (var i = 0; i < 256; i++)
                        _data.data[4 * i + 3] = 255 - i;
                    _canvasTmpCtx.putImageData(_data, 0, 0);

                    oThis.Params = { GradImage : _canvasTmp };
                }

                var _yPosStart = (_yDst - _koefWipeLen * _hDst) >> 0;
                var _yPos = (_yPosStart + (_part * (1 + _koefWipeLen) * _hDst)) >> 0;
                var _gradH = (_koefWipeLen * _hDst) >> 0;

                if (_yPos > _yDst)
                {
                    if ((_yPos + _gradH) > (_yDst + _hDst))
                    {
                        _ctx2.beginPath();
                        _ctx2.fillStyle = "#000000";
                        _ctx2.fillRect(_xDst, _yDst, _wDst, _yPos - _yDst + 1);
                        _ctx2.beginPath();

                        var _srcImageH = (256 * (_hDst - _yPos + _yDst) / _gradH) >> 0;
                        if (_srcImageH > 0 && (_hDst - _yPos + _yDst) > 0)
                            _ctx2.drawImage(oThis.Params.GradImage, 0, 0, 1, _srcImageH, _xDst, _yPos, _wDst, _hDst - _yPos + _yDst);
                    }
                    else
                    {
                        _ctx2.beginPath();
                        _ctx2.fillStyle = "#000000";
                        _ctx2.fillRect(_xDst, _yDst, _wDst, _yPos - _yDst + 1);
                        _ctx2.beginPath();

                        if (_gradH > 0)
                        {
                            _ctx2.drawImage(oThis.Params.GradImage, _xDst, _yPos, _wDst, _gradH);
                        }
                    }
                }
                else
                {
                    var _srcImageH = _yPos + _gradH - _yDst;
                    var _srcImageHH = 256 * (_yPos + _gradH - _yDst) / _gradH;

                    if (_srcImageH > 0 && _srcImageHH > 0)
                    {
                        _ctx2.drawImage(oThis.Params.GradImage, 0, 256 - _srcImageHH, 1, _srcImageHH, _xDst, _yDst, _wDst, _srcImageH);
                    }
                }
                break;
            }
            case c_oAscSlideTransitionParams.Param_Bottom:
            {
                if (null == oThis.TimerId)
                {
                    var _canvasTmp = document.createElement('canvas');
                    _canvasTmp.width = 1;
                    _canvasTmp.height = 256;
                    var _canvasTmpCtx = _canvasTmp.getContext('2d');
                    var _data = _canvasTmpCtx.createImageData(1, 256);
                    for (var i = 0; i < 256; i++)
                        _data.data[4 * i + 3] = i;
                    _canvasTmpCtx.putImageData(_data, 0, 0);

                    oThis.Params = { GradImage : _canvasTmp };
                }

                var _bDst = _yDst + _hDst;
                var _yPosStart = (_bDst + _koefWipeLen * _hDst) >> 0;
                var _yPos = (_yPosStart - (_part * (1 + _koefWipeLen) * _hDst)) >> 0;
                var _gradH = (_koefWipeLen * _hDst) >> 0;

                if (_yPos < _bDst)
                {
                    if ((_yPos - _gradH) < _yDst)
                    {
                        _ctx2.beginPath();
                        _ctx2.fillStyle = "#000000";
                        _ctx2.fillRect(_xDst, _yPos, _wDst, _bDst - _yPos);
                        _ctx2.beginPath();

                        var _srcImageH = (256 * (_yPos - _yDst) / _gradH) >> 0;
                        if (_srcImageH > 0 && (_yPos - _yDst) > 0)
                            _ctx2.drawImage(oThis.Params.GradImage, 0, 256 - _srcImageH, 1, _srcImageH, _xDst, _yDst, _wDst, _yPos - _yDst);
                    }
                    else
                    {
                        _ctx2.beginPath();
                        _ctx2.fillStyle = "#000000";
                        _ctx2.fillRect(_xDst, _yPos, _wDst, _bDst - _yPos);
                        _ctx2.beginPath();

                        if (_gradH > 0)
                        {
                            _ctx2.drawImage(oThis.Params.GradImage, _xDst, _yPos - _gradH, _wDst, _gradH);
                        }
                    }
                }
                else
                {
                    var _srcImageH = _bDst - (_yPos - _gradH);
                    var _srcImageHH = 256 * _srcImageH / _gradH;

                    if (_srcImageH > 0 && _srcImageHH > 0)
                    {
                        _ctx2.drawImage(oThis.Params.GradImage, 0, 0, 1, _srcImageHH, _xDst, _bDst - _srcImageH, _wDst, _srcImageH);
                    }
                }
                break;
            }
            case c_oAscSlideTransitionParams.Param_TopLeft:
            {
                if (null == oThis.TimerId)
                {
                    var _canvasTmp = document.createElement('canvas');
                    _canvasTmp.width = 256;
                    _canvasTmp.height = 1;
                    var _canvasTmpCtx = _canvasTmp.getContext('2d');
                    var _data = _canvasTmpCtx.createImageData(256, 1);
                    for (var i = 0; i < 256; i++)
                        _data.data[4 * i + 3] = 255 - i;
                    _canvasTmpCtx.putImageData(_data, 0, 0);

                    oThis.Params = { GradImage : _canvasTmp };
                }

                var _ang = Math.atan(_hDst / _wDst);
                var _sin = Math.sin(_ang);
                var _cos = Math.cos(_ang);

                var _hDstN2 = _wDst * _sin;
                var _hDstN = 2 * _hDstN2;
                var _wDstN = _wDst * _cos + _hDst * _sin;

                var _e_off_x = -_sin;
                var _e_off_y = -_cos;

                var _gradW = (_koefWipeLen * _hDstN) >> 0;

                var _cX = _xDst + _wDst / 2;
                var _cY = _yDst + _hDst / 2;
                var _cStartX = _cX + (_hDstN2 + _gradW / 2) * _e_off_x;
                var _cStartY = _cY + (_hDstN2 + _gradW / 2) * _e_off_y;

                var _cPosX = _cStartX - _e_off_x * _part * (_gradW + _hDstN);
                var _cPosY = _cStartY - _e_off_y * _part * (_gradW + _hDstN);

                _ctx2.save();
                _ctx2.beginPath();
                _ctx2.rect(_xDst, _yDst, _wDst, _hDst);
                _ctx2.clip();
                _ctx2.beginPath();

                _ctx2.translate(_cPosX, _cPosY);
                _ctx2.rotate(Math.PI/2 - _ang);

                // потом расчитать точнее!!!
                _ctx2.fillStyle = "#000000";
                _ctx2.fillRect(-_hDstN2 - _gradW, -_wDstN / 2, _gradW, _wDstN);
                _ctx2.beginPath();

                _ctx2.drawImage(oThis.Params.GradImage, -_hDstN2, -_wDstN / 2, _hDstN, _wDstN);

                _ctx2.restore();
                break;
            }
            case c_oAscSlideTransitionParams.Param_TopRight:
            {
                if (null == oThis.TimerId)
                {
                    var _canvasTmp = document.createElement('canvas');
                    _canvasTmp.width = 256;
                    _canvasTmp.height = 1;
                    var _canvasTmpCtx = _canvasTmp.getContext('2d');
                    var _data = _canvasTmpCtx.createImageData(256, 1);
                    for (var i = 0; i < 256; i++)
                        _data.data[4 * i + 3] = i;
                    _canvasTmpCtx.putImageData(_data, 0, 0);

                    oThis.Params = { GradImage : _canvasTmp };
                }

                var _ang = Math.atan(_hDst / _wDst);
                var _sin = Math.sin(_ang);
                var _cos = Math.cos(_ang);

                var _wDstN2 = _wDst * _sin;
                var _wDstN = 2 * _wDstN2;
                var _hDstN = _wDst * _cos + _hDst * _sin;

                var _e_off_x = _sin;
                var _e_off_y = -_cos;

                var _gradW = (_koefWipeLen * _wDstN) >> 0;

                var _cX = _xDst + _wDst / 2;
                var _cY = _yDst + _hDst / 2;
                var _cStartX = _cX + (_wDstN2 + _gradW / 2) * _e_off_x;
                var _cStartY = _cY + (_wDstN2 + _gradW / 2) * _e_off_y;

                var _cPosX = _cStartX - _e_off_x * _part * (_gradW + _wDstN);
                var _cPosY = _cStartY - _e_off_y * _part * (_gradW + _wDstN);

                _ctx2.save();
                _ctx2.beginPath();
                _ctx2.rect(_xDst, _yDst, _wDst, _hDst);
                _ctx2.clip();
                _ctx2.beginPath();

                _ctx2.translate(_cPosX, _cPosY);
                _ctx2.rotate(_ang - Math.PI / 2);

                // потом расчитать точнее!!!
                _ctx2.fillStyle = "#000000";
                _ctx2.fillRect(_wDstN2, -_hDstN / 2, _gradW, _hDstN);
                _ctx2.beginPath();

                _ctx2.drawImage(oThis.Params.GradImage, -_wDstN2, -_hDstN / 2, _wDstN, _hDstN);

                _ctx2.restore();
                break;
            }
            case c_oAscSlideTransitionParams.Param_BottomLeft:
            {
                if (null == oThis.TimerId)
                {
                    var _canvasTmp = document.createElement('canvas');
                    _canvasTmp.width = 256;
                    _canvasTmp.height = 1;
                    var _canvasTmpCtx = _canvasTmp.getContext('2d');
                    var _data = _canvasTmpCtx.createImageData(256, 1);
                    for (var i = 0; i < 256; i++)
                        _data.data[4 * i + 3] = 255 - i;
                    _canvasTmpCtx.putImageData(_data, 0, 0);

                    oThis.Params = { GradImage : _canvasTmp };
                }

                var _ang = Math.atan(_hDst / _wDst);
                var _sin = Math.sin(_ang);
                var _cos = Math.cos(_ang);

                var _wDstN2 = _wDst * _sin;
                var _wDstN = 2 * _wDstN2;
                var _hDstN = _wDst * _cos + _hDst * _sin;

                var _e_off_x = _sin;
                var _e_off_y = -_cos;

                var _gradW = (_koefWipeLen * _wDstN) >> 0;

                var _cX = _xDst + _wDst / 2;
                var _cY = _yDst + _hDst / 2;
                var _cStartX = _cX - (_wDstN2 + _gradW / 2) * _e_off_x;
                var _cStartY = _cY - (_wDstN2 + _gradW / 2) * _e_off_y;

                var _cPosX = _cStartX + _e_off_x * _part * (_gradW + _wDstN);
                var _cPosY = _cStartY + _e_off_y * _part * (_gradW + _wDstN);

                _ctx2.save();
                _ctx2.beginPath();
                _ctx2.rect(_xDst, _yDst, _wDst, _hDst);
                _ctx2.clip();
                _ctx2.beginPath();

                _ctx2.translate(_cPosX, _cPosY);
                _ctx2.rotate(_ang - Math.PI / 2);

                // потом расчитать точнее!!!
                _ctx2.fillStyle = "#000000";
                _ctx2.fillRect(-_wDstN2 - _gradW, -_hDstN / 2, _gradW, _hDstN);
                _ctx2.beginPath();

                _ctx2.drawImage(oThis.Params.GradImage, -_wDstN2, -_hDstN / 2, _wDstN, _hDstN);

                _ctx2.restore();
                break;
            }
            case c_oAscSlideTransitionParams.Param_BottomRight:
            {
                if (null == oThis.TimerId)
                {
                    var _canvasTmp = document.createElement('canvas');
                    _canvasTmp.width = 256;
                    _canvasTmp.height = 1;
                    var _canvasTmpCtx = _canvasTmp.getContext('2d');
                    var _data = _canvasTmpCtx.createImageData(256, 1);
                    for (var i = 0; i < 256; i++)
                        _data.data[4 * i + 3] = i;
                    _canvasTmpCtx.putImageData(_data, 0, 0);

                    oThis.Params = { GradImage : _canvasTmp };
                }

                var _ang = Math.atan(_hDst / _wDst);
                var _sin = Math.sin(_ang);
                var _cos = Math.cos(_ang);

                var _hDstN2 = _wDst * _sin;
                var _hDstN = 2 * _hDstN2;
                var _wDstN = _wDst * _cos + _hDst * _sin;

                var _e_off_x = _sin;
                var _e_off_y = _cos;

                var _gradW = (_koefWipeLen * _hDstN) >> 0;

                var _cX = _xDst + _wDst / 2;
                var _cY = _yDst + _hDst / 2;
                var _cStartX = _cX + (_hDstN2 + _gradW / 2) * _e_off_x;
                var _cStartY = _cY + (_hDstN2 + _gradW / 2) * _e_off_y;

                var _cPosX = _cStartX - _e_off_x * _part * (_gradW + _hDstN);
                var _cPosY = _cStartY - _e_off_y * _part * (_gradW + _hDstN);

                _ctx2.save();
                _ctx2.beginPath();
                _ctx2.rect(_xDst, _yDst, _wDst, _hDst);
                _ctx2.clip();
                _ctx2.beginPath();

                _ctx2.translate(_cPosX, _cPosY);
                _ctx2.rotate(Math.PI/2 - _ang);

                // потом расчитать точнее!!!
                _ctx2.fillStyle = "#000000";
                _ctx2.fillRect(_hDstN2, -_wDstN / 2, _gradW, _wDstN);
                _ctx2.beginPath();

                _ctx2.drawImage(oThis.Params.GradImage, -_hDstN2, -_wDstN / 2, _hDstN, _wDstN);

                _ctx2.restore();
                break;
            }
            default:
                break;
        }

        _ctx2.globalCompositeOperation = "source-atop";
        if (null != oThis.CacheImage2.Image)
        {
            _ctx2.drawImage(oThis.CacheImage2.Image, _xDst, _yDst, _wDst, _hDst);
        }
        else
        {
            var _c = oThis.CacheImage2.Color;
            _ctx2.fillStyle = "rgb(" + _c.r + "," + _c.g + "," + _c.b + ")";
            _ctx2.fillRect(_xDst, _yDst, _wDst, _hDst);
            _ctx2.beginPath();
        }

        _ctx2.globalCompositeOperation = "source-over";
        oThis.TimerId = __nextFrame(oThis._startWipe);
    }

    this._startSplit = function()
    {
        oThis.CurrentTime = new Date().getTime();

        if (oThis.CurrentTime >= oThis.EndTime)
        {
            oThis.End(false);
            return;
        }

        var _xDst = oThis.Rect.x;
        var _yDst = oThis.Rect.y;
        var _wDst = oThis.Rect.w;
        var _hDst = oThis.Rect.h;

        var _part = (oThis.CurrentTime - oThis.StartTime) / oThis.Duration;
        if (oThis.IsBackward)
            _part = 1 - _part;

        var _ctx2 = null;
        if (oThis.DemonstrationObject == null)
        {
            oThis.HtmlPage.m_oOverlayApi.Clear();
            oThis.HtmlPage.m_oOverlayApi.CheckRect(_xDst, _yDst, _wDst, _hDst);

            _ctx2 = oThis.HtmlPage.m_oOverlayApi.m_oContext;
            _ctx2.setTransform(1,0,0,1,0,0);
        }
        else
        {
            _ctx2 = oThis.DemonstrationObject.Overlay.getContext('2d');
            _ctx2.clearRect(_xDst, _yDst, _wDst, _hDst);
        }

        if (oThis.TimerId === null)
        {
            // отрисовываем на основной канве картинку первого слайда
            var _ctx1 = null;
            if (null == oThis.DemonstrationObject)
            {
                _ctx1 = oThis.HtmlPage.m_oEditor.HtmlElement.getContext('2d');
                _ctx1.fillStyle = "#B0B0B0";
                _ctx1.fillRect(0, 0, oThis.HtmlPage.m_oEditor.HtmlElement.width, oThis.HtmlPage.m_oEditor.HtmlElement.height);
            }
            else
            {
                _ctx1 = oThis.DemonstrationObject.Canvas.getContext('2d');
            }
            if (null != oThis.CacheImage1.Image)
            {
                _ctx1.drawImage(oThis.CacheImage1.Image, oThis.Rect.x, oThis.Rect.y, oThis.Rect.w, oThis.Rect.h);
            }
            else
            {
                var _c = oThis.CacheImage1.Color;
                _ctx1.fillStyle = "rgb(" + _c.r + "," + _c.g + "," + _c.b + ")";
                _ctx1.fillRect(oThis.Rect.x, oThis.Rect.y, oThis.Rect.w, oThis.Rect.h);
                _ctx1.beginPath();
            }
        }

        var _koefWipeLen = 1;

        switch (oThis.Param)
        {
            case c_oAscSlideTransitionParams.Split_VerticalOut:
            {
                if (oThis.TimerId === null)
                {
                    var _canvasTmp = document.createElement('canvas');
                    var __w = 256 + 255;
                    _canvasTmp.width = __w;
                    _canvasTmp.height = 1;
                    var _canvasTmpCtx = _canvasTmp.getContext('2d');
                    var _data = _canvasTmpCtx.createImageData(_canvasTmp.width, 1);
                    for (var i = 0; i < 256; i++)
                        _data.data[4 * i + 3] = i;
                    for (var i = 256; i < __w; i++)
                        _data.data[4 * i + 3] = __w - i - 1;
                    _canvasTmpCtx.putImageData(_data, 0, 0);

                    oThis.Params = { GradImage : _canvasTmp };
                }

                var _cX = _xDst + _wDst / 2;

                if (_part <= 0.5)
                {
                    var _w = (_part * 2 * _wDst) >> 0;
                    var _w2 = _w >> 1;

                    if (_w > 0 && _w2 > 0)
                    {
                        _ctx2.beginPath();
                        _ctx2.fillStyle = "#000000";
                        _ctx2.fillRect(Math.max(_xDst, _cX - _w2 / 2 - 1), _yDst, Math.min(_w2 + 2, _wDst), _hDst);
                        _ctx2.beginPath();

                        var _w4 = _w2 >> 1;
                        var _x = _cX - _w2;
                        var _r = _cX + _w4;
                        _ctx2.drawImage(oThis.Params.GradImage, 0, 0, 255, 1, _x, _yDst, _w4, _hDst);
                        _ctx2.drawImage(oThis.Params.GradImage, 255, 0, 255, 1, _r, _yDst, _w4, _hDst);
                    }
                }
                else
                {
                    var _w = (_part * _wDst) >> 0;
                    var _w2 = _w >> 1;

                    _ctx2.beginPath();
                    _ctx2.fillStyle = "#000000";
                    _ctx2.fillRect(Math.max(_xDst, _cX - _w2 - 1), _yDst, Math.min(_w + 2, _wDst), _hDst);
                    _ctx2.beginPath();

                    var _gradWW = (_wDst - _w) >> 1;
                    var _gradW = (_wDst / 4) >> 0;

                    var _srcOff = 256 * _gradWW / _gradW;
                    if (_gradWW > 0)
                    {
                        //_ctx2.drawImage(oThis.Params.GradImage, 256 - _srcOff, 0, _srcOff, 1, _xDst, _yDst, _gradWW, _hDst);
                        //_ctx2.drawImage(oThis.Params.GradImage, 255, 0, _srcOff, 1, _cX + _w2, _yDst, _gradWW, _hDst);
                        _ctx2.drawImage(oThis.Params.GradImage, 0, 0, 255, 1, _xDst, _yDst, _gradWW, _hDst);
                        _ctx2.drawImage(oThis.Params.GradImage, 255, 0, 255, 1, _cX + _w2, _yDst, _gradWW, _hDst);
                    }
                }
                break;
            }
            case c_oAscSlideTransitionParams.Split_VerticalIn:
            {
                if (oThis.TimerId === null)
                {
                    var _canvasTmp = document.createElement('canvas');
                    var __w = 256 + 255;
                    _canvasTmp.width = __w;
                    _canvasTmp.height = 1;
                    var _canvasTmpCtx = _canvasTmp.getContext('2d');
                    var _data = _canvasTmpCtx.createImageData(_canvasTmp.width, 1);
                    for (var i = 0; i < 256; i++)
                        _data.data[4 * i + 3] = i;
                    for (var i = 256; i < __w; i++)
                        _data.data[4 * i + 3] = __w - i - 1;
                    _canvasTmpCtx.putImageData(_data, 0, 0);

                    oThis.Params = { GradImage : _canvasTmp };
                }

                var _cX = _xDst + _wDst / 2;

                if (_part <= 0.5)
                {
                    var _w = (_part * 2 * _wDst) >> 0;
                    var _w2 = _w >> 1;
                    var _w4 = _w2 >> 1;

                    if (_w4 > 0)
                    {
                        _ctx2.beginPath();
                        _ctx2.fillStyle = "#000000";

                        _ctx2.fillRect(_xDst, _yDst, _w4 + 1, _hDst);
                        _ctx2.beginPath();
                        _ctx2.fillRect(_xDst + _wDst - _w4 - 1, _yDst, _w4 + 1, _hDst);
                        _ctx2.beginPath();

                        var _x = _xDst + _w4;
                        var _r = _xDst + _wDst - _w2;
                        _ctx2.drawImage(oThis.Params.GradImage, 255, 0, 255, 1, _x, _yDst, _w4, _hDst);
                        _ctx2.drawImage(oThis.Params.GradImage, 0, 0, 255, 1, _r, _yDst, _w4, _hDst);
                    }
                }
                else
                {
                    var _w = (_part * _wDst) >> 0;
                    var _w2 = _w >> 1;

                    _ctx2.beginPath();
                    _ctx2.fillStyle = "#000000";

                    _ctx2.fillRect(_xDst, _yDst, _w2 + 1, _hDst);
                    _ctx2.beginPath();
                    _ctx2.fillRect(_xDst + _wDst - _w2 - 1, _yDst, _w2 + 1, _hDst);
                    _ctx2.beginPath();

                    var _gradWW = (_wDst - _w) >> 1;
                    var _gradW = (_wDst / 4) >> 0;

                    var _srcOff = 256 * _gradWW / _gradW;

                    if (_gradWW > 0)
                    {
                        _ctx2.drawImage(oThis.Params.GradImage, 255, 0, 255, 1, _xDst + _w2, _yDst, _gradWW, _hDst);
                        _ctx2.drawImage(oThis.Params.GradImage, 0, 0, 255, 1, _cX, _yDst, _gradWW, _hDst);
                    }
                }
                break;
            }
            case c_oAscSlideTransitionParams.Split_HorizontalOut:
            {
                if (oThis.TimerId === null)
                {
                    var _canvasTmp = document.createElement('canvas');
                    var __w = 256 + 255;
                    _canvasTmp.width = 1;
                    _canvasTmp.height = __w;
                    var _canvasTmpCtx = _canvasTmp.getContext('2d');
                    var _data = _canvasTmpCtx.createImageData(1, __w);
                    for (var i = 0; i < 256; i++)
                        _data.data[4 * i + 3] = i;
                    for (var i = 256; i < __w; i++)
                        _data.data[4 * i + 3] = __w - i - 1;
                    _canvasTmpCtx.putImageData(_data, 0, 0);

                    oThis.Params = { GradImage : _canvasTmp };
                }

                var _cY = _yDst + _hDst / 2;

                if (_part <= 0.5)
                {
                    var _h = (_part * 2 * _hDst) >> 0;
                    var _h2 = _h >> 1;

                    if (_h > 0 && _h2 > 0)
                    {
                        _ctx2.beginPath();
                        _ctx2.fillStyle = "#000000";
                        _ctx2.fillRect(_xDst, Math.max(_cY - _h2 / 2 - 1), _wDst, Math.min(_h2 + 2, _hDst));
                        _ctx2.beginPath();

                        var _h4 = _h2 >> 1;
                        var _y = _cY - _h2;
                        var _b = _cY + _h4;

                        _ctx2.drawImage(oThis.Params.GradImage, 0, 0, 1, 255, _xDst, _y, _wDst, _h4);
                        _ctx2.drawImage(oThis.Params.GradImage, 0, 255, 1, 255, _xDst, _b, _wDst, _h4);
                    }
                }
                else
                {
                    var _h = (_part * _hDst) >> 0;
                    var _h2 = _h >> 1;

                    _ctx2.beginPath();
                    _ctx2.fillStyle = "#000000";
                    _ctx2.fillRect(_xDst, Math.max(_yDst, _cY - _h2 - 1), _wDst, Math.min(_h + 2, _hDst));
                    _ctx2.beginPath();

                    var _gradHH = (_hDst - _h) >> 1;
                    var _gradH = (_hDst / 4) >> 0;

                    //var _srcOff = 256 * _gradHH / _gradH;
                    if (_gradHH > 0)
                    {
                        _ctx2.drawImage(oThis.Params.GradImage, 0, 0, 1, 255, _xDst, _yDst, _wDst, _gradHH);
                        _ctx2.drawImage(oThis.Params.GradImage, 0, 255, 1, 255, _xDst, _cY + _h2, _wDst, _gradHH);
                    }
                }
                break;
            }
            case c_oAscSlideTransitionParams.Split_HorizontalIn:
            {
                if (oThis.TimerId === null)
                {
                    var _canvasTmp = document.createElement('canvas');
                    var __w = 256 + 255;
                    _canvasTmp.width = 1;
                    _canvasTmp.height = __w;
                    var _canvasTmpCtx = _canvasTmp.getContext('2d');
                    var _data = _canvasTmpCtx.createImageData(1, __w);
                    for (var i = 0; i < 256; i++)
                        _data.data[4 * i + 3] = i;
                    for (var i = 256; i < __w; i++)
                        _data.data[4 * i + 3] = __w - i - 1;
                    _canvasTmpCtx.putImageData(_data, 0, 0);

                    oThis.Params = { GradImage : _canvasTmp };
                }

                var _cY = _yDst + _hDst / 2;

                if (_part <= 0.5)
                {
                    var _h = (_part * 2 * _hDst) >> 0;
                    var _h2 = _h >> 1;
                    var _h4 = _h2 >> 1;

                    if (_h4 > 0)
                    {
                        _ctx2.beginPath();
                        _ctx2.fillStyle = "#000000";

                        _ctx2.fillRect(_xDst, _yDst, _wDst, _h4 + 1);
                        _ctx2.beginPath();
                        _ctx2.fillRect(_xDst, _yDst + _hDst - _h4 - 1, _wDst, _h4 + 1);
                        _ctx2.beginPath();

                        var _y = _yDst + _h4;
                        var _b = _yDst + _hDst - _h2;
                        _ctx2.drawImage(oThis.Params.GradImage, 0, 255, 1, 255, _xDst, _y, _wDst, _h4);
                        _ctx2.drawImage(oThis.Params.GradImage, 0, 0, 1, 255, _xDst, _b, _wDst, _h4);
                    }
                }
                else
                {
                    var _h = (_part * _hDst) >> 0;
                    var _h2 = _h >> 1;

                    _ctx2.beginPath();
                    _ctx2.fillStyle = "#000000";

                    _ctx2.fillRect(_xDst, _yDst, _wDst, _h2 + 1);
                    _ctx2.beginPath();
                    _ctx2.fillRect(_xDst, _yDst + _hDst - _h2 - 1, _wDst, _h2 + 1);
                    _ctx2.beginPath();

                    var _gradHH = (_hDst - _h) >> 1;
                    var _gradH = (_hDst / 4) >> 0;

                    //var _srcOff = 256 * _gradHH / _gradH;
                    if (_gradHH > 0)
                    {
                        _ctx2.drawImage(oThis.Params.GradImage, 0, 255, 1, 255, _xDst, _yDst + _h2, _wDst, _gradHH);
                        _ctx2.drawImage(oThis.Params.GradImage, 0, 0, 1, 255, _xDst, _cY, _wDst, _gradHH);
                    }
                }
                break;
            }
            default:
                break;
        }

        _ctx2.globalCompositeOperation = "source-atop";
        if (null != oThis.CacheImage2.Image)
        {
            _ctx2.drawImage(oThis.CacheImage2.Image, _xDst, _yDst, _wDst, _hDst);
        }
        else
        {
            var _c = oThis.CacheImage2.Color;
            _ctx2.fillStyle = "rgb(" + _c.r + "," + _c.g + "," + _c.b + ")";
            _ctx2.fillRect(_xDst, _yDst, _wDst, _hDst);
            _ctx2.beginPath();
        }

        _ctx2.globalCompositeOperation = "source-over";
        oThis.TimerId = __nextFrame(oThis._startSplit);
    }

    this._startUnCover = function()
    {
        oThis.CurrentTime = new Date().getTime();

        if (oThis.CurrentTime >= oThis.EndTime)
        {
            oThis.End(false);
            return;
        }

        if (oThis.TimerId === null)
        {
            var _ctx1 = null;
            if (null == this.DemonstrationObject)
            {
                // отрисовываем на основной канве картинку первого слайда
                _ctx1 = oThis.HtmlPage.m_oEditor.HtmlElement.getContext('2d');
                _ctx1.fillStyle = "#B0B0B0";
                _ctx1.fillRect(0, 0, oThis.HtmlPage.m_oEditor.HtmlElement.width, oThis.HtmlPage.m_oEditor.HtmlElement.height);
            }
            else
            {
                _ctx1 = oThis.DemonstrationObject.Canvas.getContext('2d');
            }

            if (null != oThis.CacheImage2.Image)
            {
                _ctx1.drawImage(oThis.CacheImage2.Image, oThis.Rect.x, oThis.Rect.y, oThis.Rect.w, oThis.Rect.h);
            }
            else
            {
                var _c = oThis.CacheImage2.Color;
                _ctx1.fillStyle = "rgb(" + _c.r + "," + _c.g + "," + _c.b + ")";
                _ctx1.fillRect(oThis.Rect.x, oThis.Rect.y, oThis.Rect.w, oThis.Rect.h);
                _ctx1.beginPath();
            }
        }

        var _xDst = oThis.Rect.x;
        var _yDst = oThis.Rect.y;
        var _wDst = oThis.Rect.w;
        var _hDst = oThis.Rect.h;

        var _xSrc = 0;
        var _ySrc = 0;

        var _part = (oThis.CurrentTime - oThis.StartTime) / oThis.Duration;
        if (oThis.IsBackward)
            _part = 1 - _part;

        var _offX = (_wDst * _part) >> 0;
        var _offY = (_hDst * _part) >> 0;

        switch (oThis.Param)
        {
            case c_oAscSlideTransitionParams.Param_Left:
            {
                _xDst += _offX;
                _wDst -= _offX;
                break;
            }
            case c_oAscSlideTransitionParams.Param_Right:
            {
                _xSrc = _offX;
                _wDst -= _offX;
                break;
            }
            case c_oAscSlideTransitionParams.Param_Top:
            {
                _yDst += _offY;
                _hDst -= _offY;
                break;
            }
            case c_oAscSlideTransitionParams.Param_Bottom:
            {
                _ySrc = _offY;
                _hDst -= _offY;
                break;
            }
            case c_oAscSlideTransitionParams.Param_TopLeft:
            {
                _xDst += _offX;
                _yDst += _offY;
                _wDst -= _offX;
                _hDst -= _offY;
                break;
            }
            case c_oAscSlideTransitionParams.Param_TopRight:
            {
                _xSrc = _offX;
                _yDst += _offY;
                _wDst -= _offX;
                _hDst -= _offY;
                break;
            }
            case c_oAscSlideTransitionParams.Param_BottomLeft:
            {
                _xDst += _offX;
                _ySrc = _offY;
                _wDst -= _offX;
                _hDst -= _offY;
                break;
            }
            case c_oAscSlideTransitionParams.Param_BottomRight:
            {
                _xSrc = _offX;
                _ySrc = _offY;
                _wDst -= _offX;
                _hDst -= _offY;
                break;
            }
            default:
                break;
        }

        var _ctx2 = null;
        if (oThis.DemonstrationObject == null)
        {
            oThis.HtmlPage.m_oOverlayApi.Clear();
            oThis.HtmlPage.m_oOverlayApi.CheckRect(oThis.Rect.x, oThis.Rect.y, oThis.Rect.w, oThis.Rect.h);

            _ctx2 = oThis.HtmlPage.m_oOverlayApi.m_oContext;
        }
        else
        {
            _ctx2 = oThis.DemonstrationObject.Overlay.getContext('2d');
            _ctx2.clearRect(oThis.Rect.x, oThis.Rect.y, oThis.Rect.w, oThis.Rect.h);
        }

        if (_wDst > 0 && _hDst > 0)
        {
            if (null != oThis.CacheImage1.Image)
            {
                _ctx2.drawImage(oThis.CacheImage1.Image, _xSrc, _ySrc, _wDst, _hDst, _xDst, _yDst, _wDst, _hDst);
            }
            else
            {
                var _c = oThis.CacheImage1.Color;
                _ctx2.fillStyle = "rgb(" + _c.r + "," + _c.g + "," + _c.b + ")";
                _ctx2.fillRect(_xDst, _yDst, _wDst, _hDst);
                _ctx2.beginPath();
            }
        }

        oThis.TimerId = __nextFrame(oThis._startUnCover);
    }

    this._startCover = function()
    {
        oThis.CurrentTime = new Date().getTime();

        if (oThis.CurrentTime >= oThis.EndTime)
        {
            oThis.End(false);
            return;
        }

        if (oThis.TimerId === null)
        {
            var _ctx1 = null;
            if (null == this.DemonstrationObject)
            {
                // отрисовываем на основной канве картинку первого слайда
                _ctx1 = oThis.HtmlPage.m_oEditor.HtmlElement.getContext('2d');
                _ctx1.fillStyle = "#B0B0B0";
                _ctx1.fillRect(0, 0, oThis.HtmlPage.m_oEditor.HtmlElement.width, oThis.HtmlPage.m_oEditor.HtmlElement.height);
            }
            else
            {
                _ctx1 = oThis.DemonstrationObject.Canvas.getContext('2d');
            }

            if (null != oThis.CacheImage1.Image)
            {
                _ctx1.drawImage(oThis.CacheImage1.Image, oThis.Rect.x, oThis.Rect.y, oThis.Rect.w, oThis.Rect.h);
            }
            else
            {
                var _c = oThis.CacheImage1.Color;
                _ctx1.fillStyle = "rgb(" + _c.r + "," + _c.g + "," + _c.b + ")";
                _ctx1.fillRect(oThis.Rect.x, oThis.Rect.y, oThis.Rect.w, oThis.Rect.h);
                _ctx1.beginPath();
            }
        }

        var _xDst = oThis.Rect.x;
        var _yDst = oThis.Rect.y;
        var _wDst = oThis.Rect.w;
        var _hDst = oThis.Rect.h;

        var _xSrc = 0;
        var _ySrc = 0;

        var _part = (oThis.CurrentTime - oThis.StartTime) / oThis.Duration;
        if (oThis.IsBackward)
            _part = 1 - _part;

        var _offX = (_wDst * (1 - _part)) >> 0;
        var _offY = (_hDst * (1 - _part)) >> 0;

        switch (oThis.Param)
        {
            case c_oAscSlideTransitionParams.Param_Left:
            {
                _xSrc = _offX;
                _wDst -= _offX;
                break;
            }
            case c_oAscSlideTransitionParams.Param_Right:
            {
                _xDst += _offX;
                _wDst -= _offX;
                break;
            }
            case c_oAscSlideTransitionParams.Param_Top:
            {
                _ySrc = _offY;
                _hDst -= _offY;
                break;
            }
            case c_oAscSlideTransitionParams.Param_Bottom:
            {
                _yDst += _offY;
                _hDst -= _offY;
                break;
            }
            case c_oAscSlideTransitionParams.Param_TopLeft:
            {
                _xSrc = _offX;
                _ySrc = _offY;
                _wDst -= _offX;
                _hDst -= _offY;
                break;
            }
            case c_oAscSlideTransitionParams.Param_TopRight:
            {
                _xDst += _offX;
                _ySrc = _offY;
                _wDst -= _offX;
                _hDst -= _offY;
                break;
            }
            case c_oAscSlideTransitionParams.Param_BottomLeft:
            {
                _xSrc = _offX;
                _yDst += _offY;
                _wDst -= _offX;
                _hDst -= _offY;
                break;
            }
            case c_oAscSlideTransitionParams.Param_BottomRight:
            {
                _xDst += _offX;
                _yDst += _offY;
                _wDst -= _offX;
                _hDst -= _offY;
                break;
            }
            default:
                break;
        }

        var _ctx2 = null;
        if (oThis.DemonstrationObject == null)
        {
            oThis.HtmlPage.m_oOverlayApi.Clear();
            oThis.HtmlPage.m_oOverlayApi.CheckRect(oThis.Rect.x, oThis.Rect.y, oThis.Rect.w, oThis.Rect.h);

            _ctx2 = oThis.HtmlPage.m_oOverlayApi.m_oContext;
        }
        else
        {
            _ctx2 = oThis.DemonstrationObject.Overlay.getContext('2d');
            _ctx2.clearRect(oThis.Rect.x, oThis.Rect.y, oThis.Rect.w, oThis.Rect.h);
        }

        if (_wDst > 0 && _hDst > 0)
        {
            if (null != oThis.CacheImage2.Image)
            {
                _ctx2.drawImage(oThis.CacheImage2.Image, _xSrc, _ySrc, _wDst, _hDst, _xDst, _yDst, _wDst, _hDst);
            }
            else
            {
                var _c = oThis.CacheImage2.Color;
                _ctx2.fillStyle = "rgb(" + _c.r + "," + _c.g + "," + _c.b + ")";
                _ctx2.fillRect(_xDst, _yDst, _wDst, _hDst);
                _ctx2.beginPath();
            }
        }

        oThis.TimerId = __nextFrame(oThis._startCover);
    }

    this._startClock = function()
    {
        oThis.CurrentTime = new Date().getTime();

        if (oThis.CurrentTime >= oThis.EndTime)
        {
            oThis.End(false);
            return;
        }

        if (oThis.TimerId === null)
        {
            var _ctx1 = null;
            if (null == this.DemonstrationObject)
            {
                // отрисовываем на основной канве картинку первого слайда
                _ctx1 = oThis.HtmlPage.m_oEditor.HtmlElement.getContext('2d');
                _ctx1.fillStyle = "#B0B0B0";
                _ctx1.fillRect(0, 0, oThis.HtmlPage.m_oEditor.HtmlElement.width, oThis.HtmlPage.m_oEditor.HtmlElement.height);
            }
            else
            {
                _ctx1 = oThis.DemonstrationObject.Canvas.getContext('2d');
            }

            if (null != oThis.CacheImage1.Image)
            {
                _ctx1.drawImage(oThis.CacheImage1.Image, oThis.Rect.x, oThis.Rect.y, oThis.Rect.w, oThis.Rect.h);
            }
            else
            {
                var _c = oThis.CacheImage1.Color;
                _ctx1.fillStyle = "rgb(" + _c.r + "," + _c.g + "," + _c.b + ")";
                _ctx1.fillRect(oThis.Rect.x, oThis.Rect.y, oThis.Rect.w, oThis.Rect.h);
                _ctx1.beginPath();
            }
        }

        var _xDst = oThis.Rect.x;
        var _yDst = oThis.Rect.y;
        var _wDst = oThis.Rect.w;
        var _hDst = oThis.Rect.h;

        var _part = (oThis.CurrentTime - oThis.StartTime) / oThis.Duration;
        if (oThis.IsBackward)
            _part = 1 - _part;

        var _anglePart1 = Math.atan(_wDst / _hDst);
        var _anglePart2 = Math.PI / 2 - _anglePart1;
        var _offset = 0;

        var _ctx2 = null;
        if (oThis.DemonstrationObject == null)
        {
            oThis.HtmlPage.m_oOverlayApi.Clear();
            oThis.HtmlPage.m_oOverlayApi.CheckRect(oThis.Rect.x, oThis.Rect.y, oThis.Rect.w, oThis.Rect.h);

            _ctx2 = oThis.HtmlPage.m_oOverlayApi.m_oContext;
        }
        else
        {
            _ctx2 = oThis.DemonstrationObject.Overlay.getContext('2d');
            _ctx2.clearRect(oThis.Rect.x, oThis.Rect.y, oThis.Rect.w, oThis.Rect.h);
        }

        _ctx2.save();
        _ctx2.beginPath();

        var _cX = _xDst + _wDst / 2;
        var _cY = _yDst + _hDst / 2;

        switch (oThis.Param)
        {
            case c_oAscSlideTransitionParams.Clock_Clockwise:
            {
                var _angle = 2 * Math.PI * _part;
                var _x = 0;
                var _y = 0;

                var _mainPart = (2 * _angle / Math.PI) >> 0;
                var _nomainPart = _angle - (_mainPart * Math.PI / 2);

                switch (_mainPart)
                {
                    case 0:
                    {
                        if (_nomainPart > _anglePart1)
                        {
                            _offset = _wDst * Math.tan((Math.PI / 2) - _nomainPart) / 2;

                            _x = _xDst + _wDst;
                            _y = _cY - _offset;

                            _ctx2.moveTo(_cX, _cY);
                            _ctx2.lineTo(_cX, _yDst);
                            _ctx2.lineTo(_x, _yDst);
                            _ctx2.lineTo(_x, _y);
                            _ctx2.closePath();
                        }
                        else
                        {
                            _offset = _hDst * Math.tan(_nomainPart) / 2;

                            _x = _cX + _offset;
                            _y = _yDst;

                            _ctx2.moveTo(_cX, _cY);
                            _ctx2.lineTo(_cX, _yDst);
                            _ctx2.lineTo(_x, _y);
                            _ctx2.closePath();
                        }

                        break;
                    }
                    case 1:
                    {
                        if (_nomainPart > _anglePart2)
                        {
                            _offset = _hDst * Math.tan((Math.PI / 2) - _nomainPart) / 2;

                            _x = _cX + _offset;
                            _y = _yDst + _hDst;

                            _ctx2.moveTo(_cX, _cY);
                            _ctx2.lineTo(_cX, _yDst);
                            _ctx2.lineTo(_xDst + _wDst, _yDst);
                            _ctx2.lineTo(_xDst + _wDst, _yDst + _hDst);
                            _ctx2.lineTo(_x, _y);
                            _ctx2.closePath();
                        }
                        else
                        {
                            _offset = _wDst * Math.tan(_nomainPart) / 2;

                            _x = _xDst + _wDst;
                            _y = _cY + _offset;

                            _ctx2.moveTo(_cX, _cY);
                            _ctx2.lineTo(_cX, _yDst);
                            _ctx2.lineTo(_x, _yDst);
                            _ctx2.lineTo(_x, _y);
                            _ctx2.closePath();
                        }

                        break;
                    }
                    case 2:
                    {
                        if (_nomainPart > _anglePart1)
                        {
                            _offset = _wDst * Math.tan((Math.PI / 2) - _nomainPart) / 2;

                            _x = _xDst;
                            _y = _cY + _offset;

                            _ctx2.moveTo(_cX, _cY);
                            _ctx2.lineTo(_cX, _yDst);
                            _ctx2.lineTo(_xDst + _wDst, _yDst);
                            _ctx2.lineTo(_xDst + _wDst, _yDst + _hDst);
                            _ctx2.lineTo(_xDst, _yDst + _hDst);
                            _ctx2.lineTo(_x, _y);
                            _ctx2.closePath();
                        }
                        else
                        {
                            _offset = _hDst * Math.tan(_nomainPart) / 2;

                            _x = _cX - _offset;
                            _y = _yDst + _hDst;

                            _ctx2.moveTo(_cX, _cY);
                            _ctx2.lineTo(_cX, _yDst);
                            _ctx2.lineTo(_xDst + _wDst, _yDst);
                            _ctx2.lineTo(_xDst + _wDst, _yDst + _hDst);
                            _ctx2.lineTo(_x, _y);
                            _ctx2.closePath();
                        }

                        break;
                    }
                    case 3:
                    {
                        if (_nomainPart > _anglePart2)
                        {
                            _offset = _hDst * Math.tan((Math.PI / 2) - _nomainPart) / 2;

                            _x = _cX - _offset;
                            _y = _yDst;

                            _ctx2.moveTo(_cX, _cY);
                            _ctx2.lineTo(_cX, _yDst);
                            _ctx2.lineTo(_xDst + _wDst, _yDst);
                            _ctx2.lineTo(_xDst + _wDst, _yDst + _hDst);
                            _ctx2.lineTo(_xDst, _yDst + _hDst);
                            _ctx2.lineTo(_xDst, _yDst);
                            _ctx2.lineTo(_x, _y);
                            _ctx2.closePath();
                        }
                        else
                        {
                            _offset = _wDst * Math.tan(_nomainPart) / 2;

                            _x = _xDst;
                            _y = _cY - _offset;

                            _ctx2.moveTo(_cX, _cY);
                            _ctx2.lineTo(_cX, _yDst);
                            _ctx2.lineTo(_xDst + _wDst, _yDst);
                            _ctx2.lineTo(_xDst + _wDst, _yDst + _hDst);
                            _ctx2.lineTo(_xDst, _yDst + _hDst);
                            _ctx2.lineTo(_x, _y);
                            _ctx2.closePath();
                        }

                        break;
                    }
                }
                break;
            }
            case c_oAscSlideTransitionParams.Clock_Counterclockwise:
            {
                var _angle = 2 * Math.PI * _part;
                var _x = 0;
                var _y = 0;

                var _mainPart = (2 * _angle / Math.PI) >> 0;
                var _nomainPart = _angle - (_mainPart * Math.PI / 2);

                switch (_mainPart)
                {
                    case 0:
                    {
                        if (_nomainPart > _anglePart1)
                        {
                            _offset = _wDst * Math.tan((Math.PI / 2) - _nomainPart) / 2;

                            _x = _xDst;
                            _y = _cY - _offset;

                            _ctx2.moveTo(_cX, _cY);
                            _ctx2.lineTo(_cX, _yDst);
                            _ctx2.lineTo(_x, _yDst);
                            _ctx2.lineTo(_x, _y);
                            _ctx2.closePath();
                        }
                        else
                        {
                            _offset = _hDst * Math.tan(_nomainPart) / 2;

                            _x = _cX - _offset;
                            _y = _yDst;

                            _ctx2.moveTo(_cX, _cY);
                            _ctx2.lineTo(_cX, _yDst);
                            _ctx2.lineTo(_x, _y);
                            _ctx2.closePath();
                        }

                        break;
                    }
                    case 1:
                    {
                        if (_nomainPart > _anglePart2)
                        {
                            _offset = _hDst * Math.tan((Math.PI / 2) - _nomainPart) / 2;

                            _x = _cX - _offset;
                            _y = _yDst + _hDst;

                            _ctx2.moveTo(_cX, _cY);
                            _ctx2.lineTo(_cX, _yDst);
                            _ctx2.lineTo(_xDst, _yDst);
                            _ctx2.lineTo(_xDst, _yDst + _hDst);
                            _ctx2.lineTo(_x, _y);
                            _ctx2.closePath();
                        }
                        else
                        {
                            _offset = _wDst * Math.tan(_nomainPart) / 2;

                            _x = _xDst;
                            _y = _cY + _offset;

                            _ctx2.moveTo(_cX, _cY);
                            _ctx2.lineTo(_cX, _yDst);
                            _ctx2.lineTo(_x, _yDst);
                            _ctx2.lineTo(_x, _y);
                            _ctx2.closePath();
                        }

                        break;
                    }
                    case 2:
                    {
                        if (_nomainPart > _anglePart1)
                        {
                            _offset = _wDst * Math.tan((Math.PI / 2) - _nomainPart) / 2;

                            _x = _xDst + _wDst;
                            _y = _cY + _offset;

                            _ctx2.moveTo(_cX, _cY);
                            _ctx2.lineTo(_cX, _yDst);
                            _ctx2.lineTo(_xDst, _yDst);
                            _ctx2.lineTo(_xDst, _yDst + _hDst);
                            _ctx2.lineTo(_xDst + _wDst, _yDst + _hDst);
                            _ctx2.lineTo(_x, _y);
                            _ctx2.closePath();
                        }
                        else
                        {
                            _offset = _hDst * Math.tan(_nomainPart) / 2;

                            _x = _cX + _offset;
                            _y = _yDst + _hDst;

                            _ctx2.moveTo(_cX, _cY);
                            _ctx2.lineTo(_cX, _yDst);
                            _ctx2.lineTo(_xDst, _yDst);
                            _ctx2.lineTo(_xDst, _yDst + _hDst);
                            _ctx2.lineTo(_x, _y);
                            _ctx2.closePath();
                        }

                        break;
                    }
                    case 3:
                    {
                        if (_nomainPart > _anglePart2)
                        {
                            _offset = _hDst * Math.tan((Math.PI / 2) - _nomainPart) / 2;

                            _x = _cX + _offset;
                            _y = _yDst;

                            _ctx2.moveTo(_cX, _cY);
                            _ctx2.lineTo(_cX, _yDst);
                            _ctx2.lineTo(_xDst, _yDst);
                            _ctx2.lineTo(_xDst, _yDst + _hDst);
                            _ctx2.lineTo(_xDst + _wDst, _yDst + _hDst);
                            _ctx2.lineTo(_xDst + _wDst, _yDst);
                            _ctx2.lineTo(_x, _y);
                            _ctx2.closePath();
                        }
                        else
                        {
                            _offset = _wDst * Math.tan(_nomainPart) / 2;

                            _x = _xDst + _wDst;
                            _y = _cY - _offset;

                            _ctx2.moveTo(_cX, _cY);
                            _ctx2.lineTo(_cX, _yDst);
                            _ctx2.lineTo(_xDst, _yDst);
                            _ctx2.lineTo(_xDst, _yDst + _hDst);
                            _ctx2.lineTo(_xDst + _wDst, _yDst + _hDst);
                            _ctx2.lineTo(_x, _y);
                            _ctx2.closePath();
                        }

                        break;
                    }
                }
                break;
            }
            case c_oAscSlideTransitionParams.Clock_Wedge:
            {
                var _angle = Math.PI * _part;
                var _x = 0;
                var _y = 0;

                var _mainPart = (2 * _angle / Math.PI) >> 0;
                var _nomainPart = _angle - (_mainPart * Math.PI / 2);

                switch (_mainPart)
                {
                    case 0:
                    {
                        if (_nomainPart > _anglePart1)
                        {
                            _offset = _wDst * Math.tan((Math.PI / 2) - _nomainPart) / 2;

                            _ctx2.moveTo(_cX, _cY);
                            _ctx2.lineTo(_xDst, _cY - _offset);
                            _ctx2.lineTo(_xDst, _yDst);
                            _ctx2.lineTo(_xDst + _wDst, _yDst);
                            _ctx2.lineTo(_xDst + _wDst, _cY - _offset);
                            _ctx2.closePath();
                        }
                        else
                        {
                            _offset = _hDst * Math.tan(_nomainPart) / 2;

                            _ctx2.moveTo(_cX, _cY);
                            _ctx2.lineTo(_cX - _offset, _yDst);
                            _ctx2.lineTo(_cX + _offset, _yDst);
                            _ctx2.closePath();
                        }

                        break;
                    }
                    case 1:
                    {
                        if (_nomainPart > _anglePart2)
                        {
                            _offset = _hDst * Math.tan((Math.PI / 2) - _nomainPart) / 2;

                            _ctx2.moveTo(_cX, _cY);
                            _ctx2.lineTo(_cX - _offset, _yDst + _hDst);
                            _ctx2.lineTo(_xDst, _yDst + _hDst);
                            _ctx2.lineTo(_xDst, _yDst);
                            _ctx2.lineTo(_xDst + _wDst, _yDst);
                            _ctx2.lineTo(_xDst + _wDst, _yDst + _hDst);
                            _ctx2.lineTo(_cX + _offset, _yDst + _hDst);
                            _ctx2.closePath();
                        }
                        else
                        {
                            _offset = _wDst * Math.tan(_nomainPart) / 2;

                            _ctx2.moveTo(_cX, _cY);
                            _ctx2.lineTo(_xDst, _cY + _offset);
                            _ctx2.lineTo(_xDst, _yDst);
                            _ctx2.lineTo(_xDst + _wDst, _yDst);
                            _ctx2.lineTo(_xDst + _wDst, _cY + _offset);
                        }

                        break;
                    }
                }
                break;
            }
            default:
                break;
        }

        _ctx2.clip();

        if (_wDst > 0 && _hDst > 0)
        {
            if (null != oThis.CacheImage2.Image)
            {
                _ctx2.drawImage(oThis.CacheImage2.Image, _xDst, _yDst, _wDst, _hDst);
            }
            else
            {
                var _c = oThis.CacheImage2.Color;
                _ctx2.fillStyle = "rgb(" + _c.r + "," + _c.g + "," + _c.b + ")";
                _ctx2.fillRect(_xDst, _yDst, _wDst, _hDst);
                _ctx2.beginPath();
            }
        }

        _ctx2.restore();

        oThis.TimerId = __nextFrame(oThis._startClock);
    }

    this._startZoom = function()
    {
        oThis.CurrentTime = new Date().getTime();

        if (oThis.CurrentTime >= oThis.EndTime)
        {
            oThis.End(false);
            return;
        }

        var _xDst = oThis.Rect.x;
        var _yDst = oThis.Rect.y;
        var _wDst = oThis.Rect.w;
        var _hDst = oThis.Rect.h;

        var _part = (oThis.CurrentTime - oThis.StartTime) / oThis.Duration;
        if (oThis.IsBackward)
            _part = 1 - _part;

        switch (oThis.Param)
        {
            case c_oAscSlideTransitionParams.Zoom_In:
            {
                var _ctx1 = null;
                if (null == this.DemonstrationObject)
                {
                    // отрисовываем на основной канве картинку первого слайда
                    _ctx1 = oThis.HtmlPage.m_oEditor.HtmlElement.getContext('2d');
                }
                else
                {
                    _ctx1 = oThis.DemonstrationObject.Canvas.getContext('2d');
                }
                _ctx1.fillStyle = "#B0B0B0";
                _ctx1.fillRect(0, 0, oThis.HtmlPage.m_oEditor.HtmlElement.width, oThis.HtmlPage.m_oEditor.HtmlElement.height);


                var _w = ((0.5 * _wDst) * (1 + _part)) >> 0;
                var _h = ((0.5 * _hDst) * (1 + _part)) >> 0;
                var _x = (_wDst - _w) >> 1;
                var _y = (_hDst - _h) >> 1;

                var _x1 = (0.25 * _wDst - _x) >> 0;
                var _y1 = (0.25 * _hDst - _y) >> 0;
                var _w1 = _wDst - 2 * _x1;
                var _h1 = _hDst - 2 * _y1;

                if (_w > 0 && _h > 0)
                {
                    if (null != oThis.CacheImage2.Image)
                    {
                        _ctx1.drawImage(oThis.CacheImage2.Image, _xDst + _x, _yDst + _y, _w, _h);
                    }
                    else
                    {
                        var _c = oThis.CacheImage2.Color;
                        _ctx1.fillStyle = "rgb(" + _c.r + "," + _c.g + "," + _c.b + ")";
                        _ctx1.fillRect(_xDst + _x, _yDst + _y, _w, _h);
                        _ctx1.beginPath();
                    }
                }

                _ctx1.globalAlpha = (1 - _part);
                if (null != oThis.CacheImage1.Image)
                {
                    _ctx1.drawImage(oThis.CacheImage1.Image, _x1, _y1, _w1, _h1, _xDst, _yDst, _wDst, _hDst);
                }
                else
                {
                    var _c = oThis.CacheImage1.Color;
                    _ctx1.fillStyle = "rgb(" + _c.r + "," + _c.g + "," + _c.b + ")";
                    _ctx1.fillRect(_xDst, _yDst, _wDst, _hDst);
                    _ctx1.beginPath();
                }
                _ctx1.globalAlpha = 1;

                break;
            }
            case c_oAscSlideTransitionParams.Zoom_Out:
            {
                var _ctx1 = null;
                if (null == this.DemonstrationObject)
                {
                    // отрисовываем на основной канве картинку первого слайда
                    _ctx1 = oThis.HtmlPage.m_oEditor.HtmlElement.getContext('2d');
                }
                else
                {
                    _ctx1 = oThis.DemonstrationObject.Canvas.getContext('2d');
                }
                _ctx1.fillStyle = "#B0B0B0";
                _ctx1.fillRect(0, 0, oThis.HtmlPage.m_oEditor.HtmlElement.width, oThis.HtmlPage.m_oEditor.HtmlElement.height);

                _part = 1 - _part;
                var _w = ((0.5 * _wDst) * (1 + _part)) >> 0;
                var _h = ((0.5 * _hDst) * (1 + _part)) >> 0;
                var _x = (_wDst - _w) >> 1;
                var _y = (_hDst - _h) >> 1;

                var _x1 = (0.25 * _wDst - _x) >> 0;
                var _y1 = (0.25 * _hDst - _y) >> 0;
                var _w1 = _wDst - 2 * _x1;
                var _h1 = _hDst - 2 * _y1;

                if (_w > 0 && _h > 0)
                {
                    if (null != oThis.CacheImage1.Image)
                    {
                        _ctx1.drawImage(oThis.CacheImage1.Image, _xDst + _x, _yDst + _y, _w, _h);
                    }
                    else
                    {
                        var _c = oThis.CacheImage1.Color;
                        _ctx1.fillStyle = "rgb(" + _c.r + "," + _c.g + "," + _c.b + ")";
                        _ctx1.fillRect(_xDst + _x, _yDst + _y, _w, _h);
                        _ctx1.beginPath();
                    }
                }

                _ctx1.globalAlpha = (1 - _part);
                if (null != oThis.CacheImage2.Image)
                {
                    _ctx1.drawImage(oThis.CacheImage2.Image, _x1, _y1, _w1, _h1, _xDst, _yDst, _wDst, _hDst);
                }
                else
                {
                    var _c = oThis.CacheImage2.Color;
                    _ctx1.fillStyle = "rgb(" + _c.r + "," + _c.g + "," + _c.b + ")";
                    _ctx1.fillRect(_xDst, _yDst, _wDst, _hDst);
                    _ctx1.beginPath();
                }
                _ctx1.globalAlpha = 1;

                break;
            }
            case c_oAscSlideTransitionParams.Zoom_AndRotate:
            {
                if (oThis.TimerId === null)
                {
                    var _ctx1 = null;
                    if (null == this.DemonstrationObject)
                    {
                        // отрисовываем на основной канве картинку первого слайда
                        _ctx1 = oThis.HtmlPage.m_oEditor.HtmlElement.getContext('2d');
                        _ctx1.fillStyle = "#B0B0B0";
                        _ctx1.fillRect(0, 0, oThis.HtmlPage.m_oEditor.HtmlElement.width, oThis.HtmlPage.m_oEditor.HtmlElement.height);
                    }
                    else
                    {
                        _ctx1 = oThis.DemonstrationObject.Canvas.getContext('2d');
                    }

                    if (null != oThis.CacheImage1.Image)
                    {
                        _ctx1.drawImage(oThis.CacheImage1.Image, oThis.Rect.x, oThis.Rect.y, oThis.Rect.w, oThis.Rect.h);
                    }
                    else
                    {
                        var _c = oThis.CacheImage1.Color;
                        _ctx1.fillStyle = "rgb(" + _c.r + "," + _c.g + "," + _c.b + ")";
                        _ctx1.fillRect(oThis.Rect.x, oThis.Rect.y, oThis.Rect.w, oThis.Rect.h);
                        _ctx1.beginPath();
                    }
                }

                var _ctx2 = null;
                if (oThis.DemonstrationObject == null)
                {
                    oThis.HtmlPage.m_oOverlayApi.Clear();
                    oThis.HtmlPage.m_oOverlayApi.CheckRect(oThis.Rect.x, oThis.Rect.y, oThis.Rect.w, oThis.Rect.h);

                    _ctx2 = oThis.HtmlPage.m_oOverlayApi.m_oContext;
                }
                else
                {
                    _ctx2 = oThis.DemonstrationObject.Overlay.getContext('2d');
                    _ctx2.clearRect(oThis.Rect.x, oThis.Rect.y, oThis.Rect.w, oThis.Rect.h);
                }

                // начинаем с угла в -45 градусов. затем крутим против часовой стрелки на 360 + 45 градусов
                // размер - от 5% до 100%
                var _angle = -45 + 405 * _part;
                var _scale = (0.05 + 0.95 * _part);
                _angle *= (Math.PI / 180);

                _ctx2.save();
                _ctx2.beginPath();
                _ctx2.rect(_xDst, _yDst, _wDst, _hDst);
                _ctx2.clip();
                _ctx2.beginPath();

                var _xC = _xDst + _wDst / 2;
                var _yC = _yDst + _hDst / 2;

                var localTransform = new CMatrixL();
                global_MatrixTransformer.TranslateAppend(localTransform, -_xC, -_yC);
                global_MatrixTransformer.ScaleAppend(localTransform, _scale, _scale);
                global_MatrixTransformer.RotateRadAppend(localTransform, _angle);
                global_MatrixTransformer.TranslateAppend(localTransform, _xC, _yC);

                _ctx2.setTransform(localTransform.sx, localTransform.shy, localTransform.shx, localTransform.sy, localTransform.tx, localTransform.ty);

                if (null != oThis.CacheImage2.Image)
                {
                    _ctx2.drawImage(oThis.CacheImage2.Image, _xDst, _yDst, _wDst, _hDst);
                }
                else
                {
                    var _c = oThis.CacheImage2.Color;
                    _ctx2.fillStyle = "rgb(" + _c.r + "," + _c.g + "," + _c.b + ")";
                    _ctx2.fillRect(_xDst, _yDst, _wDst, _hDst);
                    _ctx2.beginPath();
                }

                _ctx2.restore();

                break;
            }
            default:
                break;
        }


        oThis.TimerId = __nextFrame(oThis._startZoom);
    }
}

function CDemonstrationManager(htmlpage)
{
    this.HtmlPage   = htmlpage;
    this.Transition = new CTransitionAnimation(htmlpage);

    this.MainDivId          = "";
    this.DemonstrationDiv   = null;
    this.DivEndPresentation = null;
    this.EndShowMessage     = "";

    this.SlideNum           = -1;
    this.SlidesCount        = 0;

    this.Mode      = false;
    this.Canvas    = null;
    this.Overlay   = null;

    this.SlideImage = null;

    this.IsPlayMode = true;
    this.CheckSlideDuration = -1;
    this.Transition.DemonstrationObject = this;

    var oThis = this;

    this.Start = function(main_div_id, start_slide_num, is_play_mode)
    {
        this.SlidesCount = this.HtmlPage.m_oDrawingDocument.SlidesCount;
        this.DemonstrationDiv = document.getElementById(main_div_id);
        if (this.DemonstrationDiv == null || start_slide_num < 0 || start_slide_num >= this.SlidesCount)
            return;

        this.MainDivId = main_div_id;
        var _width  = this.DemonstrationDiv.clientWidth;
        var _height = this.DemonstrationDiv.clientHeight;

        this.Mode = true;
        this.Canvas = document.createElement('canvas');
        this.Canvas.style = "position:absolute;margin:0;padding:0;left:0px;top:0px;width:100%;height:100%;zIndex:2;";
        this.Canvas.width = _width;
        this.Canvas.height = _height;

        this.SlideNum = start_slide_num;

        this.HtmlPage.m_oApi.sync_DemonstrationSlideChanged(this.SlideNum);

        //this.DemonstrationCanvas.onmousedown  = this.onMouseDownDemonstration;
        //this.DemonstrationCanvas.onmousemove  = this.onMouseMoveDemonstration;
        this.Canvas.onmouseup    = this.onMouseUp;

        this.Canvas.onmousewheel = this.onMouseWhell;
        if (this.Canvas.addEventListener)
            this.Canvas.addEventListener("DOMMouseScroll", this.onMouseWhell, false);

        this.DemonstrationDiv.appendChild(this.Canvas);
        this.IsPlayMode = true;

        if (false === is_play_mode)
            this.IsPlayMode = false;

        this.StartSlide(true, true);
    }

    this.StartSlide = function(is_transition_use, is_first_play)
    {
        oThis.StopTransition();

        if (oThis.SlideNum == oThis.SlidesCount)
        {
            if (null == oThis.DivEndPresentation)
            {
                oThis.DivEndPresentation = document.createElement('div');
                oThis.DivEndPresentation.setAttribute("style", "position:absolute;margin:0px;padding:0px;left:0px;top:0px;width:100%;height:100%;z-index:4;text-align:center;font-family:monospace;font-size:12pt;color:#FFFFFF;");
                oThis.DivEndPresentation.innerHTML = oThis.EndShowMessage;

                //oThis.DemonstrationDivEndPresentation.onmousedown  = oThis.onMouseDownDemonstration;
                //oThis.DemonstrationDivEndPresentation.onmousemove  = oThis.onMouseMoveDemonstration;
                oThis.DivEndPresentation.onmouseup    = oThis.onMouseUp;

                oThis.DivEndPresentation.onmousewheel = oThis.onMouseWhell;
                if (oThis.DivEndPresentation.addEventListener)
                    oThis.DivEndPresentation.addEventListener("DOMMouseScroll", oThis.onMouseWhell, false);

                oThis.DemonstrationDiv.appendChild(oThis.DivEndPresentation);
            }
            return;
        }

        var _slides = oThis.HtmlPage.m_oLogicDocument.Slides;
        var _timing = null;
        if (is_transition_use)
        {
            _timing = _slides[oThis.SlideNum].timing;
        }

        if (_timing.TransitionType != c_oAscSlideTransitionTypes.None && _timing.TransitionDuration > 0)
        {
            oThis.StartTransition(_timing, is_first_play);
            return;
        }

        oThis.OnPaintSlide(false);
    }

    this.StopTransition = function()
    {
        if (oThis.Transition.TimerId)
            oThis.Transition.End(true);
    }

    this.StartTransition = function(_timing, is_first)
    {
        // сначала проверим, создан ли уже оверлей (в идеале спрашивать еще у транзишна, нужен ли ему оверлей)
        // пока так.
        if (null == oThis.Overlay)
        {
            oThis.Overlay = document.createElement('canvas');
            oThis.Overlay.style = "position:absolute;margin:0;padding:0;left:0px;top:0px;width:100%;height:100%;zIndex:3;";
            oThis.Overlay.width = oThis.Canvas.width;
            oThis.Overlay.height = oThis.Canvas.height;

            //oThis.Overlay.onmousedown  = oThis.onMouseDownDemonstration;
            //oThis.Overlay.onmousemove  = oThis.onMouseMoveDemonstration;
            oThis.Overlay.onmouseup    = oThis.onMouseUp;

            oThis.Overlay.onmousewheel = oThis.onMouseWhell;
            if (oThis.Overlay.addEventListener)
                oThis.Overlay.addEventListener("DOMMouseScroll", oThis.onMouseWhell, false);

            this.DemonstrationDiv.appendChild(oThis.Overlay);
        }

        oThis.Transition.Type = _timing.TransitionType;
        oThis.Transition.Param = _timing.TransitionOption;
        oThis.Transition.Duration = _timing.TransitionDuration;

        oThis.Transition.Start(is_first);
    }

    this.OnEndTransition = function(bIsAttack)
    {
        if (oThis.Transition.IsBackward)
        {
            oThis.SlideImage = oThis.Transition.CacheImage1.Image;
            oThis.SlideNum--;
        }
        else
        {
            oThis.SlideImage = oThis.Transition.CacheImage2.Image;
        }

        this.OnPaintSlide(true);
    }

    this.OnPaintSlide = function(is_clear_overlay)
    {
        if (is_clear_overlay)
        {
            var _ctx2 = oThis.Overlay.getContext('2d');
            _ctx2.clearRect(oThis.Transition.Rect.x, oThis.Transition.Rect.y, oThis.Transition.Rect.w, oThis.Transition.Rect.r);
        }

        var _ctx1 = oThis.Canvas.getContext('2d');
        oThis.Transition.CalculateRectDemonstration();
        _ctx1.drawImage(oThis.SlideImage, oThis.Transition.Rect.x, oThis.Transition.Rect.y, oThis.Transition.Rect.w, oThis.Transition.Rect.r);

        // теперь запустим функцию

        var _slides = oThis.HtmlPage.m_oLogicDocument.Slides;
        var _timing = _slides[oThis.SlideNum].timing;
        this.CheckSlideDuration = setTimeout(function(){
            oThis.StartSlide(true, false);
        }, _timing.SlideAdvanceDuration);
    }

    this.End = function()
    {
        if (!this.Mode)
            return;

        if (null != this.DivEndPresentation)
        {
            this.DemonstrationDiv.removeChild(this.DivEndPresentation);
            this.DivEndPresentation = null;
        }

        if (null != this.Overlay)
        {
            this.DemonstrationDiv.removeChild(this.Overlay);
            this.Overlay = null;
        }

        this.DemonstrationDiv.removeChild(this.Canvas);
        this.Canvas = null;

        this.SlideNum = -1;
        this.DemonstrationDiv = null;
        this.Mode = false;

        this.HtmlPage.m_oApi.sync_endDemonstration();

        if (-1 != this.CheckSlideDuration)
            clearTimeout(this.CheckSlideDuration);
    }

    this.NextSlide = function()
    {
        if (!this.Mode)
            return;

        this.SlideNum++;
        if (this.SlideNum > this.SlidesCount)
            this.End();
        else
        {
            this.HtmlPage.m_oApi.sync_DemonstrationSlideChanged(this.SlideNum);
            this.StartSlide(true, false);
        }
    }

    this.PrevSlide = function()
    {
        if (!this.Mode)
            return;

        if (0 != this.SlideNum)
        {
            this.SlideNum--;
            this.m_oApi.sync_DemonstrationSlideChanged(this.DemonstrationSlideNum);

            // TODO: backward transition
            this.StartSlide(true, false);
        }
    }

    this.GoToSlide = function(slideNum)
    {
        if (!this.DemonstrationManager.Mode)
            return;

        if ((slideNum == this.DemonstrationSlideNum) || (slideNum < 0) || (slideNum >= this.m_oDrawingDocument.SlidesCount))
            return;

        this.SlideNum = slideNum;
        this.m_oApi.sync_DemonstrationSlideChanged(this.DemonstrationSlideNum);

        this.StartSlide(true, false);
    }

    this.Play = function()
    {
        this.IsPlayMode = true;
    }

    this.Pause = function()
    {
        this.IsPlayMode = false;
    }

    // manipulators
    this.onKeyDown = function(e)
    {
        check_KeyboardEvent(e);

        switch (global_keyboardEvent.KeyCode)
        {
            case 13:    // enter
            case 32:    // space
            case 34:    // PgDn
            case 39:    // right arrow
            case 40:    // bottom arrow
            {
                oThis.NextSlide();
                break;
            }
            case 33:
            case 37:
            case 38:
            {
                oThis.PrevSlide();
                break;
            }
            case 36:    // home
            {
                oThis.GoToSlide(0);
                break;
            }
            case 35:    // end
            {
                oThis.GoToSlide(this.SlidesCount - 1);
                break;
            }
            case 27:    // escape
            {
                oThis.End();
                break;
            }
            default:
                break;
        }

        oThis.HtmlPage.IsKeyDownButNoPress = true;
        return false;
    }

    this.onMouseDown = function(e)
    {
        e.preventDefault();
        return false;
    }

    this.onMouseMove = function(e)
    {
        e.preventDefault();
        return false;
    }

    this.onMouseUp = function(e)
    {
        // next slide
        oThis.NextSlide();

        e.preventDefault();
        return false;
    }

    this.onMouseWhell = function(e)
    {
        var delta = 0;
        if (undefined != e.wheelDelta)
            delta = (e.wheelDelta > 0) ? -1 : 1;
        else
            delta = (e.detail > 0) ? 1 : -1;

        if (delta > 0)
        {
            oThis.NextSlide();
        }
        else
        {
            oThis.PrevSlide();
        }

        e.preventDefault();
        return false;
    }

    this.Resize = function()
    {
    }
}

////////////////////////////////////////////////////////////////////

var _global_lock_params_timing = false;
function InitPanelAnimation()
{
    var _body_elem  = document.body;

    var _div_caption = document.createElement('div');
    _div_caption.id = "animationPropDrag";
    _div_caption.setAttribute("style", "display:block;width:200px;background-color:#fff;top:57px;right:25px;z-index:100;position:absolute;padding-top: 5px;border: 4px ridge silver;cursor:move;");

    _div_caption.innerHTML = "<div id=\"animationPropDragCaption\" style=\"float:left;width:200px;text-align: center;\">\
                                <b>Timing</b>\
                                </div>";

    var _div_animation_prop = document.createElement('div');
    _div_animation_prop.id = "animationProp";
    _div_animation_prop.setAttribute("style", "display:display;width:200px;background-color:#fff;top:87px;right:25px;z-index:100;position:absolute;padding-top: 5px;border: 4px ridge silver;");

    _div_animation_prop.innerHTML = "<div style=\"float:left;padding-left:5px;width:200px\">\
        <div style=\"float:left;width:190px;text-align: center;\">Transition</div>\
        <select id=\"animationType\" style=\"width:180px;\" onchange=\"AnimationType_Changed()\">\
            <option value=\"0\">None</option>\
            <option value=\"1\">Fade</option>\
            <option value=\"2\">Push</option>\
            <option value=\"3\">Wipe</option>\
            <option value=\"4\">Split</option>\
            <option value=\"5\">UnCover</option>\
            <option value=\"6\">Cover</option>\
            <option value=\"7\">Clock</option>\
            <option value=\"9\">Zoom</option>\
        </select>\
        <select id=\"animationParam\" style=\"width:180px;\" onchange=\"AnimationParam_Changed()\">\
        </select>\
    Time <input id=\"animationSpeed\" style=\"width:70px;\" value=\"2.0\" onchange=\"AnimationSpeed_Changed()\"/>\
    <input id=\"animationPlay\" style=\"width:60px;\" type=\"button\" value=\"Play\"/>\
    <div style=\"float:left;width:190px;text-align: center;\">__________________</div>\
    <div style=\"margin-top:10px;margin-bottom:10px;float:left;width:190px;text-align: center;\">Advance Slide</div>\
    <br/>\
    <input id=\"box_tr1\" type=\"checkbox\" onchange=\"SA_Check_Box_OnMouseClick()\"/> On Mouse Click\
    <br/>\
    <input id=\"box_tr2\" style=\"margin-top:10px;\" type=\"checkbox\" onchange=\"SA_Check_Box_After()\"/> After: \
    <input id=\"slideDuration\" style=\"width:60px;margin-top:10px;\" value=\"10.0\" onchange=\"SlideDuration_Changed()\">\
    <input id=\"slideApplyToAll\" style=\"width:170px;margin-top:10px;margin-bottom:10px;\" type=\"button\" value=\"Apply To All\"/>\
<div>";

    Drag.init( _div_caption, null, null, null, null, null, true );
    _div_caption.onDrag = function(X, Y)
    {
        var sTop = Y + 30 + "px", sRight = X + "px";
        _div_animation_prop.style.top   = sTop;
        _div_animation_prop.style.right = sRight;
    };

    _body_elem.appendChild(_div_caption);
    _body_elem.appendChild(_div_animation_prop);

    document.getElementById("animationPlay").onclick = AnimationPlay;
    document.getElementById("slideApplyToAll").onclick = TimingApplyToAll;

    $("#animationSpeed")
        .focus(function(){editor.asc_enableKeyEvents(false);})
        .blur(function(){editor.asc_enableKeyEvents(true);});

    $("#slideDuration")
        .focus(function(){editor.asc_enableKeyEvents(false);})
        .blur(function(){editor.asc_enableKeyEvents(true);});

    $("#id_viewer").mousedown(function(){ this.focus(); editor.asc_enableKeyEvents(true);});
}

function AnimationType_Changed()
{
    var _type = document.getElementById("animationType").selectedIndex;
    var _elem = document.getElementById("animationParam");

    if (!_global_lock_params_timing)
    {
        var _timing = new CAscSlideTiming();
        _timing.setUndefinedOptions();
        _timing.TransitionType = _type;
        editor.ApplySlideTiming(_timing);
    }

    if (!bIsIE)
    {
        switch (_type)
        {
            case c_oAscSlideTransitionTypes.None:
            {
                _elem.innerHTML = "";
                break;
            }
            case c_oAscSlideTransitionTypes.Fade:
            {
                _elem.innerHTML = "<option value=\"0\">Smoothly</option><option value=\"1\">Through Black</option>";
                _elem.selectedIndex = 0;
                break;
            }
            case c_oAscSlideTransitionTypes.Push:
            {
                _elem.innerHTML = "<option value=\"0\">Bottom</option>\
                <option value=\"1\">Left</option>\
                <option value=\"2\">Right</option>\
                <option value=\"3\">Top</option>";
                _elem.selectedIndex = 0;
                break;
            }
            case c_oAscSlideTransitionTypes.Wipe:
            {
                _elem.innerHTML = "<option value=\"0\">Right</option>\
                <option value=\"2\">Top</option>\
                <option value=\"3\">Left</option>\
                <option value=\"4\">Bottom</option>\
                <option value=\"5\">Top-Right</option>\
                <option value=\"6\">Bottom-Right</option>\
                <option value=\"7\">Top-Left</option>\
                <option value=\"8\">Bottom-Left</option>";
                _elem.selectedIndex = 0;
                break;
            }
            case c_oAscSlideTransitionTypes.Split:
            {
                _elem.innerHTML = "<option value=\"0\">Vertical Out</option>\
                <option value=\"1\">Horizontal In</option>\
                <option value=\"2\">Horizontal Out</option>\
                <option value=\"3\">Vertical In</option>";
                _elem.selectedIndex = 0;
                break;
            }
            case c_oAscSlideTransitionTypes.UnCover:
            {
                _elem.innerHTML = "<option value=\"0\">Right</option>\
                <option value=\"1\">Top</option>\
                <option value=\"2\">Left</option>\
                <option value=\"3\">Bottom</option>\
                <option value=\"4\">Top-Right</option>\
                <option value=\"5\">Bottom-Right</option>\
                <option value=\"6\">Top-Left</option>\
                <option value=\"7\">Bottom-Left</option>";
                _elem.selectedIndex = 0;
                break;
            }
            case c_oAscSlideTransitionTypes.Cover:
            {
                _elem.innerHTML = "<option value=\"0\">Right</option>\
                <option value=\"1\">Top</option>\
                <option value=\"2\">Left</option>\
                <option value=\"3\">Bottom</option>\
                <option value=\"4\">Top-Right</option>\
                <option value=\"5\">Bottom-Right</option>\
                <option value=\"6\">Top-Left</option>\
                <option value=\"7\">Bottom-Left</option>";
                _elem.selectedIndex = 0;
                break;
            }
            case c_oAscSlideTransitionTypes.Clock:
            {
                _elem.innerHTML = "<option value=\"0\">Clockwise</option>\
                <option value=\"1\">Counterclockwise</option>\
                <option value=\"2\">Wedge</option>";
                _elem.selectedIndex = 0;
                break;
            }
            case c_oAscSlideTransitionTypes.Zoom:
            {
                _elem.innerHTML = "<option value=\"0\">In</option>\
                <option value=\"1\">Out</option>\
                <option value=\"2\">Zoom and Rotate</option>";
                _elem.selectedIndex = 0;
                break;
            }
            default:
                break;
        }
    }
    else
    {
        _elem.innerHTML = "";
        switch (_type)
        {
            case c_oAscSlideTransitionTypes.None:
            {
                break;
            }
            case c_oAscSlideTransitionTypes.Fade:
            {
                var opt1 = document.createElement("option");opt1.value= 0;opt1.innerHTML = "Smoothly";_elem.appendChild(opt1);
                var opt2 = document.createElement("option");opt2.value= 1;opt2.innerHTML = "Through Black";_elem.appendChild(opt2);

                _elem.selectedIndex = 0;
                break;
            }
            case c_oAscSlideTransitionTypes.Push:
            {
                var opt1 = document.createElement("option");opt1.value= 0;opt1.innerHTML = "Bottom";_elem.appendChild(opt1);
                var opt2 = document.createElement("option");opt2.value= 2;opt2.innerHTML = "Left";_elem.appendChild(opt2);
                var opt3 = document.createElement("option");opt3.value= 3;opt3.innerHTML = "Right";_elem.appendChild(opt3);
                var opt4 = document.createElement("option");opt4.value= 4;opt4.innerHTML = "Top";_elem.appendChild(opt4);

                _elem.selectedIndex = 0;
                break;
            }
            case c_oAscSlideTransitionTypes.Wipe:
            {
                var opt1 = document.createElement("option");opt1.value= 0;opt1.innerHTML = "Right";_elem.appendChild(opt1);
                var opt2 = document.createElement("option");opt2.value= 2;opt2.innerHTML = "Top";_elem.appendChild(opt2);
                var opt3 = document.createElement("option");opt3.value= 3;opt3.innerHTML = "Left";_elem.appendChild(opt3);
                var opt4 = document.createElement("option");opt4.value= 4;opt4.innerHTML = "Bottom";_elem.appendChild(opt4);
                var opt5 = document.createElement("option");opt5.value= 0;opt5.innerHTML = "Top-Right";_elem.appendChild(opt5);
                var opt6 = document.createElement("option");opt6.value= 2;opt6.innerHTML = "Bottom-Right";_elem.appendChild(opt6);
                var opt7 = document.createElement("option");opt7.value= 3;opt7.innerHTML = "Top-Left";_elem.appendChild(opt7);
                var opt8 = document.createElement("option");opt8.value= 4;opt8.innerHTML = "Bottom-Left";_elem.appendChild(opt8);

                _elem.selectedIndex = 0;
                break;
            }
            case c_oAscSlideTransitionTypes.Split:
            {
                var opt1 = document.createElement("option");opt1.value= 0;opt1.innerHTML = "Vertical Out";_elem.appendChild(opt1);
                var opt2 = document.createElement("option");opt2.value= 2;opt2.innerHTML = "Horizontal In";_elem.appendChild(opt2);
                var opt3 = document.createElement("option");opt3.value= 3;opt3.innerHTML = "Horizontal Out";_elem.appendChild(opt3);
                var opt4 = document.createElement("option");opt4.value= 4;opt4.innerHTML = "Vertical In";_elem.appendChild(opt4);

                _elem.selectedIndex = 0;
                break;
            }
            case c_oAscSlideTransitionTypes.UnCover:
            {
                var opt1 = document.createElement("option");opt1.value= 0;opt1.innerHTML = "Right";_elem.appendChild(opt1);
                var opt2 = document.createElement("option");opt2.value= 2;opt2.innerHTML = "Top";_elem.appendChild(opt2);
                var opt3 = document.createElement("option");opt3.value= 3;opt3.innerHTML = "Left";_elem.appendChild(opt3);
                var opt4 = document.createElement("option");opt4.value= 4;opt4.innerHTML = "Bottom";_elem.appendChild(opt4);
                var opt5 = document.createElement("option");opt5.value= 0;opt5.innerHTML = "Top-Right";_elem.appendChild(opt5);
                var opt6 = document.createElement("option");opt6.value= 2;opt6.innerHTML = "Bottom-Right";_elem.appendChild(opt6);
                var opt7 = document.createElement("option");opt7.value= 3;opt7.innerHTML = "Top-Left";_elem.appendChild(opt7);
                var opt8 = document.createElement("option");opt8.value= 4;opt8.innerHTML = "Bottom-Left";_elem.appendChild(opt8);

                _elem.selectedIndex = 0;
                break;
            }
            case c_oAscSlideTransitionTypes.Cover:
            {
                var opt1 = document.createElement("option");opt1.value= 0;opt1.innerHTML = "Right";_elem.appendChild(opt1);
                var opt2 = document.createElement("option");opt2.value= 2;opt2.innerHTML = "Top";_elem.appendChild(opt2);
                var opt3 = document.createElement("option");opt3.value= 3;opt3.innerHTML = "Left";_elem.appendChild(opt3);
                var opt4 = document.createElement("option");opt4.value= 4;opt4.innerHTML = "Bottom";_elem.appendChild(opt4);
                var opt5 = document.createElement("option");opt5.value= 0;opt5.innerHTML = "Top-Right";_elem.appendChild(opt5);
                var opt6 = document.createElement("option");opt6.value= 2;opt6.innerHTML = "Bottom-Right";_elem.appendChild(opt6);
                var opt7 = document.createElement("option");opt7.value= 3;opt7.innerHTML = "Top-Left";_elem.appendChild(opt7);
                var opt8 = document.createElement("option");opt8.value= 4;opt8.innerHTML = "Bottom-Left";_elem.appendChild(opt8);

                _elem.selectedIndex = 0;
                break;
            }
            case c_oAscSlideTransitionTypes.Clock:
            {
                var opt1 = document.createElement("option");opt1.value= 0;opt1.innerHTML = "Clockwise";_elem.appendChild(opt1);
                var opt2 = document.createElement("option");opt2.value= 2;opt2.innerHTML = "Counterclockwise";_elem.appendChild(opt2);
                var opt3 = document.createElement("option");opt3.value= 3;opt3.innerHTML = "Wedge";_elem.appendChild(opt3);

                _elem.selectedIndex = 0;
                break;
            }
            case c_oAscSlideTransitionTypes.Zoom:
            {
                var opt1 = document.createElement("option");opt1.value= 0;opt1.innerHTML = "In";_elem.appendChild(opt1);
                var opt2 = document.createElement("option");opt2.value= 2;opt2.innerHTML = "Out";_elem.appendChild(opt2);
                var opt3 = document.createElement("option");opt3.value= 3;opt3.innerHTML = "Zoom and Rotate";_elem.appendChild(opt3);

                _elem.selectedIndex = 0;
                break;
            }
            default:
                break;
        }
    }

    AnimationParam_Changed();
}

function AnimationParam_Changed()
{
    var _type = document.getElementById("animationType").selectedIndex;
    var _elem = document.getElementById("animationParam").selectedIndex;

    var _array_Params = [
        [],
        [c_oAscSlideTransitionParams.Fade_Smoothly, c_oAscSlideTransitionParams.Fade_Through_Black],
        [c_oAscSlideTransitionParams.Param_Bottom, c_oAscSlideTransitionParams.Param_Left, c_oAscSlideTransitionParams.Param_Right, c_oAscSlideTransitionParams.Param_Top],
        [c_oAscSlideTransitionParams.Param_Right, c_oAscSlideTransitionParams.Param_Top, c_oAscSlideTransitionParams.Param_Left, c_oAscSlideTransitionParams.Param_Bottom, c_oAscSlideTransitionParams.Param_TopRight, c_oAscSlideTransitionParams.Param_BottomRight, c_oAscSlideTransitionParams.Param_TopLeft, c_oAscSlideTransitionParams.Param_BottomLeft],
        [c_oAscSlideTransitionParams.Split_VerticalOut, c_oAscSlideTransitionParams.Split_HorizontalIn, c_oAscSlideTransitionParams.Split_HorizontalOut, c_oAscSlideTransitionParams.Split_VerticalIn],
        [c_oAscSlideTransitionParams.Param_Right, c_oAscSlideTransitionParams.Param_Top, c_oAscSlideTransitionParams.Param_Left, c_oAscSlideTransitionParams.Param_Bottom, c_oAscSlideTransitionParams.Param_TopRight, c_oAscSlideTransitionParams.Param_BottomRight, c_oAscSlideTransitionParams.Param_TopLeft, c_oAscSlideTransitionParams.Param_BottomLeft],
        [c_oAscSlideTransitionParams.Param_Right, c_oAscSlideTransitionParams.Param_Top, c_oAscSlideTransitionParams.Param_Left, c_oAscSlideTransitionParams.Param_Bottom, c_oAscSlideTransitionParams.Param_TopRight, c_oAscSlideTransitionParams.Param_BottomRight, c_oAscSlideTransitionParams.Param_TopLeft, c_oAscSlideTransitionParams.Param_BottomLeft],
        [c_oAscSlideTransitionParams.Clock_Clockwise, c_oAscSlideTransitionParams.Clock_Counterclockwise, c_oAscSlideTransitionParams.Clock_Wedge],
        [c_oAscSlideTransitionParams.Zoom_In, c_oAscSlideTransitionParams.Zoom_Out, c_oAscSlideTransitionParams.Zoom_AndRotate]
    ];

    var _param = _array_Params[_type][_elem];

    if (!_global_lock_params_timing)
    {
        var _timing = new CAscSlideTiming();
        _timing.setUndefinedOptions();
        _timing.TransitionOption = _param;
        editor.ApplySlideTiming(_timing);
    }
}

function SA_Check_Box_After()
{
    var _is_ = document.getElementById("box_tr2").checked;

    if (!_global_lock_params_timing)
    {
        var _timing = new CAscSlideTiming();
        _timing.setUndefinedOptions();
        _timing.SlideAdvanceAfter = _is_;
        editor.ApplySlideTiming(_timing);
    }
}

function SA_Check_Box_OnMouseClick()
{
    var _is_ = document.getElementById("box_tr1").checked;

    if (!_global_lock_params_timing)
    {
        var _timing = new CAscSlideTiming();
        _timing.setUndefinedOptions();
        _timing.SlideAdvanceOnMouseClick = _is_;
        editor.ApplySlideTiming(_timing);
    }
}

function SlideDuration_Changed()
{
    var duration = (parseFloat(document.getElementById("slideDuration").value) * 1000) >> 0;

    if (!_global_lock_params_timing)
    {
        var _timing = new CAscSlideTiming();
        _timing.setUndefinedOptions();
        _timing.SlideAdvanceDuration = duration;
        editor.ApplySlideTiming(_timing);
    }
}

function AnimationSpeed_Changed()
{
    var duration = (parseFloat(document.getElementById("animationSpeed").value) * 1000) >> 0;

    if (!_global_lock_params_timing)
    {
        var _timing = new CAscSlideTiming();
        _timing.setUndefinedOptions();
        _timing.TransitionDuration = duration;
        editor.ApplySlideTiming(_timing);
    }
}

function AnimationPlay()
{
    editor.SlideTransitionPlay();
}

function TimingApplyToAll()
{
    editor.SlideTimingApplyToAll();
}

function UnInitPanelAnimation()
{
    var _1 = document.getElementById('animationPropDrag');
    var _2 = document.getElementById('animationProp');

    if (_1 && _2)
    {
        var _body_elem  = document.body;
        _body_elem.removeChild(_1);
        _body_elem.removeChild(_2);
    }
}

var Drag = {

    obj : null,

    init : function(o, oRoot, minX, maxX, minY, maxY, bSwapHorzRef, bSwapVertRef, fXMapper, fYMapper)
    {
        o.onmousedown   = Drag.start;

        o.hmode         = bSwapHorzRef ? false : true ;
        o.vmode         = bSwapVertRef ? false : true ;

        o.root = oRoot && oRoot != null ? oRoot : o ;

        if (o.hmode  && isNaN(parseInt(o.root.style.left  ))) o.root.style.left   = "0px";
        if (o.vmode  && isNaN(parseInt(o.root.style.top   ))) o.root.style.top    = "350px";
        if (!o.hmode && isNaN(parseInt(o.root.style.right ))) o.root.style.right  = "0px";
        if (!o.vmode && isNaN(parseInt(o.root.style.bottom))) o.root.style.bottom = "0px";

        o.minX  = typeof minX != 'undefined' ? minX : null;
        o.minY  = typeof minY != 'undefined' ? minY : null;
        o.maxX  = typeof maxX != 'undefined' ? maxX : null;
        o.maxY  = typeof maxY != 'undefined' ? maxY : null;

        o.xMapper = fXMapper ? fXMapper : null;
        o.yMapper = fYMapper ? fYMapper : null;

        o.root.onDragStart  = new Function();
        o.root.onDragEnd    = new Function();
        o.root.onDrag       = new Function();
    },

    start : function(e)
    {
        var o = Drag.obj = this;
        e = Drag.fixE(e);
        var y = parseInt(o.vmode ? o.root.style.top  : o.root.style.bottom);
        var x = parseInt(o.hmode ? o.root.style.left : o.root.style.right );
        o.root.onDragStart(x, y);

        o.lastMouseX    = e.clientX;
        o.lastMouseY    = e.clientY;

        if (o.hmode) {
            if (o.minX != null) o.minMouseX = e.clientX - x + o.minX;
            if (o.maxX != null) o.maxMouseX = o.minMouseX + o.maxX - o.minX;
        } else {
            if (o.minX != null) o.maxMouseX = -o.minX + e.clientX + x;
            if (o.maxX != null) o.minMouseX = -o.maxX + e.clientX + x;
        }

        if (o.vmode) {
            if (o.minY != null) o.minMouseY = e.clientY - y + o.minY;
            if (o.maxY != null) o.maxMouseY = o.minMouseY + o.maxY - o.minY;
        } else {
            if (o.minY != null) o.maxMouseY = -o.minY + e.clientY + y;
            if (o.maxY != null) o.minMouseY = -o.maxY + e.clientY + y;
        }

        document.onmousemove    = Drag.drag;
        document.onmouseup      = Drag.end;

        return false;
    },

    drag : function(e)
    {
        e = Drag.fixE(e);
        var o = Drag.obj;

        var ey  = e.clientY;
        var ex  = e.clientX;
        var y = parseInt(o.vmode ? o.root.style.top  : o.root.style.bottom);
        var x = parseInt(o.hmode ? o.root.style.left : o.root.style.right );
        var nx, ny;

        if (o.minX != null) ex = o.hmode ? Math.max(ex, o.minMouseX) : Math.min(ex, o.maxMouseX);
        if (o.maxX != null) ex = o.hmode ? Math.min(ex, o.maxMouseX) : Math.max(ex, o.minMouseX);
        if (o.minY != null) ey = o.vmode ? Math.max(ey, o.minMouseY) : Math.min(ey, o.maxMouseY);
        if (o.maxY != null) ey = o.vmode ? Math.min(ey, o.maxMouseY) : Math.max(ey, o.minMouseY);

        nx = x + ((ex - o.lastMouseX) * (o.hmode ? 1 : -1));
        ny = y + ((ey - o.lastMouseY) * (o.vmode ? 1 : -1));

        if (o.xMapper)      nx = o.xMapper(y)
        else if (o.yMapper) ny = o.yMapper(x)

        if(o.hmode)
        {
            Drag.obj.root.style.left = nx + "px";
        }
        else
        {
            Drag.obj.root.style.right = nx + "px";
        }

        if(o.vmode)
        {
            Drag.obj.root.style.top = ny + "px";
        }
        else
        {
            Drag.obj.root.style.bottom = ny + "px";
        }

        Drag.obj.lastMouseX = ex;
        Drag.obj.lastMouseY = ey;
        Drag.obj.root.onDrag(nx, ny);

        return false;
    },

    end : function()
    {
        document.onmousemove = null;
        document.onmouseup   = null;
        var x_pos = parseInt( Drag.obj.hmode ? Drag.obj.root.style.left : Drag.obj.root.style.right );
        var y_pos = parseInt( Drag.obj.vmode ? Drag.obj.root.style.top : Drag.obj.root.style.bottom );
        Drag.obj.root.onDragEnd( x_pos, y_pos );
        Drag.obj = null;
    },

    fixE : function(e)
    {
        if (typeof e == 'undefined') e = window.event;
        if (typeof e.layerX == 'undefined') e.layerX = e.offsetX;
        if (typeof e.layerY == 'undefined') e.layerY = e.offsetY;
        return e;
    }
};

function SlideTimingCallback(_timing)
{
    var _elem = document.getElementById("animationType");
    if (!_elem)
        return;

    _global_lock_params_timing = true;

    document.getElementById("animationType").selectedIndex = _timing.TransitionType;
    AnimationType_Changed();

    switch (_timing.TransitionType)
    {
        case c_oAscSlideTransitionTypes.Fade:
        {
            switch (_timing.TransitionOption)
            {
                case c_oAscSlideTransitionParams.Fade_Smoothly:
                {
                    document.getElementById("animationParam").selectedIndex = 0;
                    break;
                }
                case c_oAscSlideTransitionParams.Fade_Through_Black:
                {
                    document.getElementById("animationParam").selectedIndex = 1;
                    break;
                }
                default:
                    break;
            }
            break;
        }
        case c_oAscSlideTransitionTypes.Push:
        {
            switch (_timing.TransitionOption)
            {
                case c_oAscSlideTransitionParams.Param_Bottom:
                {
                    document.getElementById("animationParam").selectedIndex = 0;
                    break;
                }
                case c_oAscSlideTransitionParams.Param_Left:
                {
                    document.getElementById("animationParam").selectedIndex = 1;
                    break;
                }
                case c_oAscSlideTransitionParams.Param_Right:
                {
                    document.getElementById("animationParam").selectedIndex = 2;
                    break;
                }
                case c_oAscSlideTransitionParams.Param_Top:
                {
                    document.getElementById("animationParam").selectedIndex = 3;
                    break;
                }
                default:
                    break;
            }
            break;
        }
        case c_oAscSlideTransitionTypes.Wipe:
        case c_oAscSlideTransitionTypes.UnCover:
        case c_oAscSlideTransitionTypes.Cover:
        {
            switch (_timing.TransitionOption)
            {
                case c_oAscSlideTransitionParams.Param_Right:
                {
                    document.getElementById("animationParam").selectedIndex = 0;
                    break;
                }
                case c_oAscSlideTransitionParams.Param_Top:
                {
                    document.getElementById("animationParam").selectedIndex = 1;
                    break;
                }
                case c_oAscSlideTransitionParams.Param_Left:
                {
                    document.getElementById("animationParam").selectedIndex = 2;
                    break;
                }
                case c_oAscSlideTransitionParams.Param_Bottom:
                {
                    document.getElementById("animationParam").selectedIndex = 3;
                    break;
                }
                case c_oAscSlideTransitionParams.Param_TopRight:
                {
                    document.getElementById("animationParam").selectedIndex = 4;
                    break;
                }
                case c_oAscSlideTransitionParams.Param_BottomRight:
                {
                    document.getElementById("animationParam").selectedIndex = 5;
                    break;
                }
                case c_oAscSlideTransitionParams.Param_TopLeft:
                {
                    document.getElementById("animationParam").selectedIndex = 6;
                    break;
                }
                case c_oAscSlideTransitionParams.Param_BottomLeft:
                {
                    document.getElementById("animationParam").selectedIndex = 7;
                    break;
                }
                default:
                    break;
            }
            break;
        }
        case c_oAscSlideTransitionTypes.Split:
        {
            switch (_timing.TransitionOption)
            {
                case c_oAscSlideTransitionParams.Split_VerticalOut:
                {
                    document.getElementById("animationParam").selectedIndex = 0;
                    break;
                }
                case c_oAscSlideTransitionParams.Split_HorizontalIn:
                {
                    document.getElementById("animationParam").selectedIndex = 1;
                    break;
                }
                case c_oAscSlideTransitionParams.Split_HorizontalOut:
                {
                    document.getElementById("animationParam").selectedIndex = 2;
                    break;
                }
                case c_oAscSlideTransitionParams.Split_VerticalIn:
                {
                    document.getElementById("animationParam").selectedIndex = 3;
                    break;
                }
                default:
                    break;
            }
            break;
        }
        case c_oAscSlideTransitionTypes.Clock:
        {
            switch (_timing.TransitionOption)
            {
                case c_oAscSlideTransitionParams.Clock_Clockwise:
                {
                    document.getElementById("animationParam").selectedIndex = 0;
                    break;
                }
                case c_oAscSlideTransitionParams.Clock_Counterclockwise:
                {
                    document.getElementById("animationParam").selectedIndex = 1;
                    break;
                }
                case c_oAscSlideTransitionParams.Clock_Wedge:
                {
                    document.getElementById("animationParam").selectedIndex = 2;
                    break;
                }
                default:
                    break;
            }
            break;
        }
        case c_oAscSlideTransitionTypes.Zoom:
        {
            switch (_timing.TransitionOption)
            {
                case c_oAscSlideTransitionParams.Zoom_In:
                {
                    document.getElementById("animationParam").selectedIndex = 0;
                    break;
                }
                case c_oAscSlideTransitionParams.Zoom_Out:
                {
                    document.getElementById("animationParam").selectedIndex = 1;
                    break;
                }
                case c_oAscSlideTransitionParams.Zoom_AndRotate:
                {
                    document.getElementById("animationParam").selectedIndex = 2;
                    break;
                }
                default:
                    break;
            }
            break;
        }
        default:
            break;
    }

    AnimationParam_Changed();

    document.getElementById("animationSpeed").value = "" + (_timing.TransitionDuration / 1000);

    document.getElementById("box_tr1").checked = (true === _timing.SlideAdvanceOnMouseClick);
    document.getElementById("box_tr2").checked = (true === _timing.SlideAdvanceAfter);
    document.getElementById("slideDuration").value = "" + (_timing.SlideAdvanceDuration / 1000);

    _global_lock_params_timing = false;
}

var _global_slide_timing_timer_ = setInterval(function() {
    if (window.editor)
    {
        editor.asc_registerCallback("asc_onSlideTiming", function(){
            SlideTimingCallback(arguments[0]);
        });

        clearInterval(_global_slide_timing_timer_);
    }
}, 1000);

////////////////////////////////////////////////////////////////////