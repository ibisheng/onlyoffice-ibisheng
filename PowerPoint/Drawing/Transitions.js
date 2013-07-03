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

    this.Start = function()
    {
        this.CalculateRect();

        var _currentSlide = this.HtmlPage.m_oDrawingDocument.SlideCurrent;
        if (_currentSlide >= this.HtmlPage.m_oDrawingDocument.SlidesCount)
            _currentSlide = this.HtmlPage.m_oDrawingDocument.SlidesCount - 1;

        var _w = this.Rect.w;
        var _h = this.Rect.h;
        var _w_mm = this.HtmlPage.m_oLogicDocument.Width;
        var _h_mm = this.HtmlPage.m_oLogicDocument.Height;

        var g = null;
        if (_currentSlide >= 0)
        {
            this.CacheImage2.Image = this.CreateImage(_w, _h);

            g = new CGraphics();
            g.init(this.CacheImage2.Image.getContext('2d'), _w, _h, _w_mm, _h_mm);
            g.m_oFontManager = g_fontManager;

            g.transform(1,0,0,1,0,0);
            g.IsNoDrawingEmptyPlaceholder = true;

            this.HtmlPage.m_oLogicDocument.DrawPage(_currentSlide, g);
        }
        if (_currentSlide > 0)
        {
            this.CacheImage1.Image = this.CreateImage(_w, _h);

            g = new CGraphics();
            g.init(this.CacheImage1.Image.getContext('2d'), _w, _h, _w_mm, _h_mm);
            g.m_oFontManager = g_fontManager;

            g.transform(1,0,0,1,0,0);
            g.IsNoDrawingEmptyPlaceholder = true;

            this.HtmlPage.m_oLogicDocument.DrawPage(_currentSlide - 1, g);
        }

        var _time = new Date().getTime();
        this.StartTime = _time;
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

        this.HtmlPage.OnScroll();

        this.CacheImage1.Image = null;
        this.CacheImage2.Image = null;
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

            // отрисовываем на основной канве картинку первого слайда
            var _ctx1 = oThis.HtmlPage.m_oEditor.HtmlElement.getContext('2d');
            _ctx1.fillStyle = "#B0B0B0";
            _ctx1.fillRect(0, 0, oThis.HtmlPage.m_oEditor.HtmlElement.width, oThis.HtmlPage.m_oEditor.HtmlElement.height);
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

        oThis.HtmlPage.m_oOverlayApi.Clear();
        oThis.HtmlPage.m_oOverlayApi.CheckRect(oThis.Rect.x, oThis.Rect.y, oThis.Rect.w, oThis.Rect.h);

        var _part = (oThis.CurrentTime - oThis.StartTime) / oThis.Duration;
        if (oThis.Param == c_oAscSlideTransitionParams.Fade_Smoothly)
        {
            var _ctx2 = oThis.HtmlPage.m_oOverlayApi.m_oContext;
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
                    var _ctx1 = oThis.HtmlPage.m_oEditor.HtmlElement.getContext('2d');
                    _ctx1.fillStyle = "rgb(0,0,0)";
                    _ctx1.fillRect(oThis.Rect.x, oThis.Rect.y, oThis.Rect.w, oThis.Rect.h);
                    _ctx1.beginPath();

                    oThis.Params.IsFirstAfterHalf = false;
                }
            }

            var _ctx2 = oThis.HtmlPage.m_oOverlayApi.m_oContext;
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

            // отрисовываем на основной канве картинку первого слайда
            var _ctx1 = oThis.HtmlPage.m_oEditor.HtmlElement.getContext('2d');
            _ctx1.fillStyle = "#B0B0B0";
            _ctx1.fillRect(0, 0, oThis.HtmlPage.m_oEditor.HtmlElement.width, oThis.HtmlPage.m_oEditor.HtmlElement.height);
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

        oThis.HtmlPage.m_oOverlayApi.Clear();
        oThis.HtmlPage.m_oOverlayApi.CheckRect(oThis.Rect.x, oThis.Rect.y, oThis.Rect.w, oThis.Rect.h);

        var _ctx2 = oThis.HtmlPage.m_oOverlayApi.m_oContext;

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
            oThis.Params = { IsFirstAfterHalf : true };

            // отрисовываем на основной канве картинку первого слайда
            var _ctx1 = oThis.HtmlPage.m_oEditor.HtmlElement.getContext('2d');
            _ctx1.fillStyle = "#B0B0B0";
            _ctx1.fillRect(0, 0, oThis.HtmlPage.m_oEditor.HtmlElement.width, oThis.HtmlPage.m_oEditor.HtmlElement.height);
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

        oThis.HtmlPage.m_oOverlayApi.Clear();
        oThis.HtmlPage.m_oOverlayApi.CheckRect(_xDst, _yDst, _wDst, _hDst);

        var _ctx2 = oThis.HtmlPage.m_oOverlayApi.m_oContext;
        _ctx2.setTransform(1,0,0,1,0,0);

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

        oThis.HtmlPage.m_oOverlayApi.Clear();
        oThis.HtmlPage.m_oOverlayApi.CheckRect(_xDst, _yDst, _wDst, _hDst);

        var _ctx2 = oThis.HtmlPage.m_oOverlayApi.m_oContext;
        _ctx2.setTransform(1,0,0,1,0,0);

        var _koefWipeLen = 1;

        switch (oThis.Param)
        {
            case c_oAscSlideTransitionParams.Split_VerticalIn:
            {
                if (oThis.TimerId === null)
                {
                    // отрисовываем на основной канве картинку первого слайда
                    var _ctx1 = oThis.HtmlPage.m_oEditor.HtmlElement.getContext('2d');
                    _ctx1.fillStyle = "#B0B0B0";
                    _ctx1.fillRect(0, 0, oThis.HtmlPage.m_oEditor.HtmlElement.width, oThis.HtmlPage.m_oEditor.HtmlElement.height);
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
            case c_oAscSlideTransitionParams.Split_VerticalOut:
            {
                break;
            }
            case c_oAscSlideTransitionParams.Split_HorizontalIn:
            {
                break;
            }
            case c_oAscSlideTransitionParams.Split_HorizontalOut:
            {
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
            oThis.Params = { IsFirstAfterHalf : true };

            // отрисовываем на основной канве картинку первого слайда
            var _ctx1 = oThis.HtmlPage.m_oEditor.HtmlElement.getContext('2d');
            _ctx1.fillStyle = "#B0B0B0";
            _ctx1.fillRect(0, 0, oThis.HtmlPage.m_oEditor.HtmlElement.width, oThis.HtmlPage.m_oEditor.HtmlElement.height);
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

        oThis.HtmlPage.m_oOverlayApi.Clear();
        oThis.HtmlPage.m_oOverlayApi.CheckRect(_xDst, _yDst, _wDst, _hDst);

        if (_wDst > 0 && _hDst > 0)
        {
            var _ctx2 = oThis.HtmlPage.m_oOverlayApi.m_oContext;

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
            oThis.Params = { IsFirstAfterHalf : true };

            // отрисовываем на основной канве картинку первого слайда
            var _ctx1 = oThis.HtmlPage.m_oEditor.HtmlElement.getContext('2d');
            _ctx1.fillStyle = "#B0B0B0";
            _ctx1.fillRect(0, 0, oThis.HtmlPage.m_oEditor.HtmlElement.width, oThis.HtmlPage.m_oEditor.HtmlElement.height);
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

        oThis.HtmlPage.m_oOverlayApi.Clear();
        oThis.HtmlPage.m_oOverlayApi.CheckRect(_xDst, _yDst, _wDst, _hDst);

        if (_wDst > 0 && _hDst > 0)
        {
            var _ctx2 = oThis.HtmlPage.m_oOverlayApi.m_oContext;

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
            oThis.Params = { IsFirstAfterHalf : true };

            // отрисовываем на основной канве картинку первого слайда
            var _ctx1 = oThis.HtmlPage.m_oEditor.HtmlElement.getContext('2d');
            _ctx1.fillStyle = "#B0B0B0";
            _ctx1.fillRect(0, 0, oThis.HtmlPage.m_oEditor.HtmlElement.width, oThis.HtmlPage.m_oEditor.HtmlElement.height);
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

        oThis.HtmlPage.m_oOverlayApi.Clear();
        oThis.HtmlPage.m_oOverlayApi.CheckRect(_xDst, _yDst, _wDst, _hDst);

        var _anglePart1 = Math.atan(_wDst / _hDst);
        var _anglePart2 = Math.PI / 2 - _anglePart1;
        var _offset = 0;

        var _ctx2 = oThis.HtmlPage.m_oOverlayApi.m_oContext;

        oThis.HtmlPage.m_oOverlayApi.Clear();
        oThis.HtmlPage.m_oOverlayApi.CheckRect(_xDst, _yDst, _wDst, _hDst);

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

        switch (oThis.Param)
        {
            case c_oAscSlideTransitionParams.Zoom_In:
            {
                var _ctx1 = oThis.HtmlPage.m_oEditor.HtmlElement.getContext('2d');
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
                var _ctx1 = oThis.HtmlPage.m_oEditor.HtmlElement.getContext('2d');
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
                    oThis.Params = { IsFirstAfterHalf : true };

                    // отрисовываем на основной канве картинку первого слайда
                    var _ctx1 = oThis.HtmlPage.m_oEditor.HtmlElement.getContext('2d');
                    _ctx1.fillStyle = "#B0B0B0";
                    _ctx1.fillRect(0, 0, oThis.HtmlPage.m_oEditor.HtmlElement.width, oThis.HtmlPage.m_oEditor.HtmlElement.height);
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

                oThis.HtmlPage.m_oOverlayApi.Clear();
                oThis.HtmlPage.m_oOverlayApi.CheckRect(_xDst, _yDst, _wDst, _hDst);

                // начинаем с угла в -45 градусов. затем крутим против часовой стрелки на 360 + 45 градусов
                // размер - от 5% до 100%
                var _angle = -45 + 405 * _part;
                var _scale = (0.05 + 0.95 * _part);
                _angle *= (Math.PI / 180);

                var _ctx2 = oThis.HtmlPage.m_oOverlayApi.m_oContext;
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
