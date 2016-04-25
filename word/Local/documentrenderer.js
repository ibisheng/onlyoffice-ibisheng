"use strict";

function CDocMeta()
{
    this.Fonts = [];
    this.ImageMap = {};

    this.Pages = null;
    this.PagesCount = 0;

    this.LockObject = null;
    this.stream = null;

    this.CountParagraphs = 0;
    this.CountWords = 0;
    this.CountSymbols = 0;
    this.CountSpaces = 0;

    this.Drawings = [];

    this.Selection = new CDocMetaSelection();
    this.TextMatrix = new CMatrix();

    this.SearchInfo =
    {
        Id      : null,
        Page    : 0,
        Text    : null
    };

    this.SearchResults = {
        IsSearch    : false,
        Text        : "",
        MachingCase : false,
        Pages       : [],
        CurrentPage : -1,
        Current     : -1,
        Show        : false,
        Count       : 0
    };

    var oThisDoc = this;

    this.Load = function(url, doc_bin_base64)
    {
        var stream = CreateDocumentData(doc_bin_base64);

        this.PagesCount = stream.GetLong();
        this.Pages = new Array(this.PagesCount);

        this.CountParagraphs = 0;
        this.CountWords = 0;
        this.CountSymbols = 0;
        this.CountSpaces = 0;

        for (var i = 0; i < this.PagesCount; i++)
        {
            var pageInfo = new CPageMeta();
            pageInfo.width_mm = stream.GetDouble();
            pageInfo.height_mm = stream.GetDouble();
            pageInfo.start = 0;
            pageInfo.end = 0;

            this.Pages[i] = pageInfo;
        }

        if (0 == this.PagesCount)
        {
            this.PagesCount = 1;
            this.Pages = new Array(this.PagesCount);

            var pageInfo = new CPageMeta();
            pageInfo.width_mm = 210;
            pageInfo.height_mm = 297;
            pageInfo.start = 0;
            pageInfo.end = 0;

            this.Pages[0] = pageInfo;
        }

        this.stream = stream;

        if (0 != this.Drawings.length)
        {
            this.Drawings.splice(0, this.Drawings.length);
        }

        window.g_font_loader.LoadEmbeddedFonts("fonts/", this.Fonts);

        setInterval(function() {oThisDoc.NativeDrawTimer();}, 40);
    }

    this.NativeDrawTimer = function()
    {
        var _ret = window["AscDesktopEditor"]["NativeViewerGetCompleteTasks"]();

        var _drDoc = editor.WordControl.m_oDrawingDocument;

        var _count = _ret.length / 4;
        for (var i = 0; i < _count; ++i)
        {
            var _url = _ret[i * 4 + 0];
            var _page = _ret[i * 4 + 1];
            var _x = _ret[i * 4 + 2];
            var _y = _ret[i * 4 + 3];

            if (_page >= _drDoc.m_lDrawingFirst && _page <= _drDoc.m_lDrawingEnd)
            {
                _drDoc.StopRenderingPage(_page);
                editor.WordControl.OnScroll();
            }
        }
    }

    this.InitDocument = function(drDoc)
    {
        for (var i = 0; i < this.PagesCount; i++)
        {
            var _page = new CPage();
            _page.width_mm = this.Pages[i].width_mm;
            _page.height_mm = this.Pages[i].height_mm;
            _page.pageIndex = i;
            drDoc.m_arrPages[i] = _page;
        }

        drDoc.m_arrPages.splice(0, drDoc.m_lPagesCount);
        drDoc.m_lCurrentPage = 0;
        drDoc.m_lPagesCount = this.PagesCount;
        drDoc.m_lCountCalculatePages = this.PagesCount;

        this.SearchResults.Pages = new Array(this.PagesCount);
        for (var i = 0; i < this.PagesCount; i++)
        {
            this.SearchResults.Pages[i] = [];
        }

        editor.sync_countPagesCallback(this.PagesCount);
        editor.sync_currentPageCallback(0);
    }

    this.drawPage = function(pageIndex, g)
    {
        var drObject = new CDrawingObject();
        drObject.Page = pageIndex;
        drObject.StreamPos = this.Pages[pageIndex].start;
        drObject.Graphics = g;

        this.Drawings[this.Drawings.length] = drObject;
        this.OnImageLoad(drObject);
    }

    this.stopRenderingPage = function(pageIndex)
    {
        for (var i = 0; i < this.Drawings.length; i++)
        {
            if (pageIndex == this.Drawings[i].Page)
            {
                oThisDoc.Drawings[i].BreakDrawing = 1;

                if (oThisDoc.Drawings[i].Graphics.IsClipContext)
                {
                    oThisDoc.Drawings[i].Graphics.m_oContext.restore();
                    oThisDoc.Drawings[i].Graphics.IsClipContext = false;
                }

                oThisDoc.Drawings.splice(i, 1);
                i--;
            }
        }
    }

    this.OnImageLoad = function(obj)
    {
        if (obj.BreakDrawing == 1)
        {
            return;
        }

        var page = oThisDoc.Pages[obj.Page];
        var g = obj.Graphics;

        g.SetIntegerGrid(true);

        var _url = window["AscDesktopEditor"]["NativeViewerGetPageUrl"](obj.Page, g.m_lWidthPix, g.m_lHeightPix,
            editor.WordControl.m_oDrawingDocument.m_lDrawingFirst, editor.WordControl.m_oDrawingDocument.m_lDrawingEnd);

        if (_url == "")
        {
            // ждем возврата задачи
            return;
        }


        var img = new Image();
        img.onload = function(){
            if (1 != obj.BreakDrawing)
            {
                var _ctx = g.m_oContext;
                _ctx.drawImage(img, 0, 0, img.width, img.height);
            }

            // дорисовали страницу. теперь нужно удалить все объекты, у которых страница такая же
            // по идее удаляем только obj
            oThisDoc.stopRenderingPage(obj.Page);
            editor.WordControl.OnScroll();
        };
        img.onerror = function(){
            oThisDoc.stopRenderingPage(obj.Page);
        };
        img.src = _url;
    }

    this.GetNearestPos = function(pageNum, x, y)
    {
        var page = this.Pages[pageNum];
        var s = this.stream;
        s.Seek(page.start);

        // textline parameters
        var _line = -1;
        var _glyph = -1;
        var _minDist = 0xFFFFFF;

        // textline parameters
        var _lineX = 0;
        var _lineY = 0;
        var _lineEx = 0;
        var _lineEy = 0;
        var _lineAscent = 0;
        var _lineDescent = 0;
        var _lineWidth = 0;
        var _lineGidExist = false;
        var _linePrevCharX = 0;
        var _lineCharCount = 0;
        var _lineLastGlyphWidth = 0;
        var _arrayGlyphOffsets = [];

        var _numLine = -1;

        var _lenGls = 0;
        var tmp = 0;

        while (s.pos < page.end)
        {
            var command = s.GetUChar();

            switch (command)
            {
                case 41:
                {
                    s.Skip(12);
                    break;
                }
                case 22:
                {
                    s.Skip(4);
                    break;
                }
                case 1:
                {
                    s.Skip(4);
                    break;
                }
                case 3:
                {
                    s.Skip(4);
                    break;
                }
                case 131:
                {
                    break;
                }
                case 130:
                {
                    s.Skip(24);
                    break;
                }
                case 80:
                {
                    if (0 != _lineCharCount)
                        _linePrevCharX += s.GetDouble2();

                    _arrayGlyphOffsets[_lineCharCount] = _linePrevCharX;

                    _lineCharCount++;

                    if (_lineGidExist)
                        s.Skip(4);
                    else
                        s.Skip(2);

                    if (0 == _lineWidth)
                        _lineLastGlyphWidth = s.GetDouble2();
                    else
                        s.Skip(2);

                    break;
                }
                case 98:
                case 100:
                {
                    break;
                }
                case 91:
                {
                    // moveto
                    s.Skip(8);
                    break;
                }
                case 92:
                {
                    // lineto
                    s.Skip(8);
                    break;
                }
                case 94:
                {
                    // curveto
                    s.Skip(24);break;
                }
                case 97:
                {
                    break;
                }
                case 99:
                {
                    // drawpath
                    s.Skip(4);
                    break;
                }
                case 110:
                {
                    // drawImage
                    s.SkipImage();
                    break;
                }
                case 160:
                {
                    // textline
                    _linePrevCharX = 0;
                    _lineCharCount = 0;
                    _lineWidth = 0;

                    _arrayGlyphOffsets.splice(0, _arrayGlyphOffsets.length);

                    ++_numLine;

                    var mask = s.GetUChar();
                    _lineX = s.GetDouble();
                    _lineY = s.GetDouble();

                    if ((mask & 0x01) != 0)
                    {
                        _lineEx = 1;
                        _lineEy = 0;
                    }
                    else
                    {
                        _lineEx = s.GetDouble();
                        _lineEy = s.GetDouble();
                    }

                    _lineAscent = s.GetDouble();
                    _lineDescent = s.GetDouble();

                    if ((mask & 0x04) != 0)
                        _lineWidth = s.GetDouble();

                    if ((mask & 0x02) != 0)
                        _lineGidExist = true;
                    else
                        _lineGidExist = false;

                    break;
                }
                case 162:
                {
                    // textline end

                    // âñå ïîäñ÷èòàíî
                    if (0 == _lineWidth)
                        _lineWidth = _linePrevCharX + _lineLastGlyphWidth;

                    // â ïðèíöèïå êîä îäèí è òîò æå. Íî ïî÷òè âñåãäà ëèíèè ãîðèçîíòàëüíûå.
                    // à äëÿ ãîðèçîíòàëüíîé ëèíèè âñå ìîæíî ïîîïòèìèçèðîâàòü
                    if (_lineEx == 1 && _lineEy == 0)
                    {
                        var _distX = x - _lineX;
                        if (y >= (_lineY - _lineAscent) && y <= (_lineY + _lineDescent) && _distX >= 0 && _distX <= _lineWidth)
                        {
                            // ïîïàëè âíóòðü ëèíèè. Òåïåðü íóæíî íàéòè ãëèô
                            _line = _numLine;

                            _lenGls = _arrayGlyphOffsets.length;
                            for (_glyph = 0; _glyph < _lenGls; _glyph++)
                            {
                                if (_arrayGlyphOffsets[_glyph] > _distX)
                                    break;
                            }
                            if (_glyph > 0)
                                --_glyph;

                            return { Line : _line, Glyph : _glyph };
                        }

                        if (_distX >= 0 && _distX <= _lineWidth)
                            tmp = Math.abs(y - _lineY);
                        else if (_distX < 0)
                        {
                            tmp = Math.sqrt((x - _lineX) * (x - _lineX) + (y - _lineY) * (y - _lineY));
                        }
                        else
                        {
                            var _xx1 = _lineX + _lineWidth;
                            tmp = Math.sqrt((x - _xx1) * (x - _xx1) + (y - _lineY) * (y - _lineY));
                        }

                        if (tmp < _minDist)
                        {
                            _minDist = tmp;
                            _line = _numLine;

                            if (_distX < 0)
                                _glyph = -2;
                            else if (_distX > _lineWidth)
                            {
                                _glyph = -1;
                            }
                            else
                            {
                                _lenGls = _arrayGlyphOffsets.length;
                                for (_glyph = 0; _glyph < _lenGls; _glyph++)
                                {
                                    if (_arrayGlyphOffsets[_glyph] > _distX)
                                        break;
                                }

                                if (_glyph > 0)
                                    _glyph--;
                            }
                        }

                        // Íè÷åãî íå íàäî äåëàòü, óæå íàéäåíà áîëåå "áëèæíÿÿ" ëèíèÿ
                    }
                    else
                    {
                        // îïðåäåëÿåì òî÷êè descent ëèíèè
                        var ortX = -_lineEy;
                        var ortY = _lineEx;

                        var _dx = _lineX + ortX * _lineDescent;
                        var _dy = _lineY + ortY * _lineDescent;

                        // òåïåðü ïðîåêöèè (ñî çíàêîì) íà ëèíèþ descent
                        var h = -((x - _dx) * ortX + (y - _dy) * ortY);
                        var w = (x - _dx) * _lineEx + (y - _dy) * _lineEy;

                        if (w >= 0 && w <= _lineWidth && h >= 0 && h <= (_lineDescent + _lineAscent))
                        {
                            // ïîïàëè âíóòðü ëèíèè. Òåïåðü íóæíî íàéòè ãëèô
                            _line = _numLine;

                            _lenGls = _arrayGlyphOffsets.length;
                            for (_glyph = 0; _glyph < _lenGls; _glyph++)
                            {
                                if (_arrayGlyphOffsets[_glyph] > w)
                                    break;
                            }

                            if (_glyph > 0)
                                _glyph--;

                            return { Line : _line, Glyph : _glyph };
                        }

                        if (w >= 0 && w <= _lineWidth)
                            tmp = Math.abs(h - _lineDescent);
                        else if (w < 0)
                        {
                            tmp = Math.sqrt((x - _lineX) * (x - _lineX) + (y - _lineY) * (y - _lineY));
                        }
                        else
                        {
                            var _tmpX = _lineX + _lineWidth * _lineEx;
                            var _tmpY = _lineY + _lineWidth * _lineEy;
                            tmp = Math.sqrt((x - _tmpX) * (x - _tmpX) + (y - _tmpY) * (y - _tmpY));
                        }

                        //tmp = Math.abs(h - _lineDescent);
                        if (tmp < _minDist)
                        {
                            _minDist = tmp;
                            _line = _numLine;

                            if (w < 0)
                                _glyph = -2;
                            else if (w > _lineWidth)
                                _glyph = -1;
                            else
                            {
                                _lenGls = _arrayGlyphOffsets.length;
                                for (_glyph = 0; _glyph < _lenGls; _glyph++)
                                {
                                    if (_arrayGlyphOffsets[_glyph] > w)
                                        break;
                                }

                                if (_glyph > 0)
                                    _glyph--;
                            }
                        }

                        // Íè÷åãî íå íàäî äåëàòü, óæå íàéäåíà áîëåå "áëèæíÿÿ" ëèíèÿ
                    }

                    break;
                }
                case 161:
                {
                    // text transform
                    s.Skip(16);
                    break;
                }
                case 163:
                {
                    break;
                }
                case 164:
                {
                    s.Skip(16);
                    break;
                }
                case 121:
                case 122:
                {
                    // begin/end command
                    s.Skip(4);
                    break;
                }
                default:
                {
                    s.pos = page.end;
                }
            }
        }

        return { Line : _line, Glyph : _glyph };
    }

    this.GetCountLines = function(pageNum)
    {
        var page = this.Pages[pageNum];
        var s = this.stream;
        s.Seek(page.start);

        var _lineGidExist = false;
        var _lineCharCount = 0;
        var _numLine = -1;

        while (s.pos < page.end)
        {
            var command = s.GetUChar();

            switch (command)
            {
                case 41:
                {
                    s.Skip(12);
                    break;
                }
                case 22:
                {
                    s.Skip(4);
                    break;
                }
                case 1:
                {
                    s.Skip(4);
                    break;
                }
                case 3:
                {
                    s.Skip(4);
                    break;
                }
                case 131:
                {
                    break;
                }
                case 130:
                {
                    s.Skip(24);
                    break;
                }
                case 80:
                {
                    if (0 != _lineCharCount)
                        s.Skip(2);

                    _lineCharCount++;

                    if (_lineGidExist)
                        s.Skip(4);
                    else
                        s.Skip(2);

                    s.Skip(2);

                    break;
                }
                case 98:
                case 100:
                {
                    break;
                }
                case 91:
                {
                    // moveto
                    s.Skip(8);
                    break;
                }
                case 92:
                {
                    // lineto
                    s.Skip(8);
                    break;
                }
                case 94:
                {
                    // curveto
                    s.Skip(24);break;
                }
                case 97:
                {
                    break;
                }
                case 99:
                {
                    // drawpath
                    s.Skip(4);
                    break;
                }
                case 110:
                {
                    // drawImage
                    s.SkipImage();
                    break;
                }
                case 160:
                {
                    // textline
                    _lineCharCount = 0;
                    ++_numLine;

                    var mask = s.GetUChar();
                    s.Skip(8);

                    if ((mask & 0x01) == 0)
                        s.Skip(8);

                    s.Skip(8);

                    if ((mask & 0x04) != 0)
                        s.Skip(4);

                    if ((mask & 0x02) != 0)
                        _lineGidExist = true;
                    else
                        _lineGidExist = false;

                    break;
                }
                case 162:
                {
                    break;
                }
                case 161:
                {
                    // text transform
                    s.Skip(16);
                    break;
                }
                case 163:
                {
                    break;
                }
                case 164:
                {
                    s.Skip(16);
                    break;
                }
                case 121:
                case 122:
                {
                    // begin/end command
                    s.Skip(4);
                    break;
                }
                default:
                {
                    s.pos = page.end;
                }
            }
        }

        return _numLine;
    }

    this.DrawSelection = function(pageNum, overlay, xDst, yDst, width, height)
    {
        var sel = this.Selection;
        var Page1 = 0;
        var Page2 = 0;
        var Line1 = 0;
        var Line2 = 0;
        var Glyph1 = 0;
        var Glyph2 = 0;

        if (sel.Page2 > sel.Page1)
        {
            Page1 = sel.Page1;
            Page2 = sel.Page2;
            Line1 = sel.Line1;
            Line2 = sel.Line2;
            Glyph1 = sel.Glyph1;
            Glyph2 = sel.Glyph2;
        }
        else if (sel.Page2 < sel.Page1)
        {
            Page1 = sel.Page2;
            Page2 = sel.Page1;
            Line1 = sel.Line2;
            Line2 = sel.Line1;
            Glyph1 = sel.Glyph2;
            Glyph2 = sel.Glyph1;
        }
        else if (sel.Page1 == sel.Page2)
        {
            Page1 = sel.Page1;
            Page2 = sel.Page2;

            if (sel.Line1 < sel.Line2)
            {
                Line1 = sel.Line1;
                Line2 = sel.Line2;
                Glyph1 = sel.Glyph1;
                Glyph2 = sel.Glyph2;
            }
            else if (sel.Line2 < sel.Line1)
            {
                Line1 = sel.Line2;
                Line2 = sel.Line1;
                Glyph1 = sel.Glyph2;
                Glyph2 = sel.Glyph1;
            }
            else
            {
                Line1 = sel.Line1;
                Line2 = sel.Line2;

                if (-1 == sel.Glyph1)
                {
                    Glyph1 = sel.Glyph2;
                    Glyph2 = sel.Glyph1;
                }
                else if (-1 == sel.Glyph2)
                {
                    Glyph1 = sel.Glyph1;
                    Glyph2 = sel.Glyph2;
                }
                else if (sel.Glyph1 < sel.Glyph2)
                {
                    Glyph1 = sel.Glyph1;
                    Glyph2 = sel.Glyph2;
                }
                else
                {
                    Glyph1 = sel.Glyph2;
                    Glyph2 = sel.Glyph1;
                }
            }
        }

        if (Page1 > pageNum  || Page2 < pageNum)
            return;

        if (Page1 < pageNum)
        {
            Page1 = pageNum;
            Line1 = 0;
            Glyph1 = -2;
        }
        var bIsFillToEnd = false;
        if (Page2 > pageNum)
            bIsFillToEnd = true;

        var page = this.Pages[pageNum];
        var s = this.stream;
        s.Seek(page.start);

        // textline parameters
        var _lineX = 0;
        var _lineY = 0;
        var _lineEx = 0;
        var _lineEy = 0;
        var _lineAscent = 0;
        var _lineDescent = 0;
        var _lineWidth = 0;
        var _lineGidExist = false;
        var _linePrevCharX = 0;
        var _lineCharCount = 0;
        var _lineLastGlyphWidth = 0;
        var _arrayGlyphOffsets = [];

        var _numLine = -1;

        var dKoefX = width / page.width_mm;
        var dKoefY = height / page.height_mm;

        while (s.pos < page.end)
        {
            var command = s.GetUChar();

            switch (command)
            {
                case 41:
                {
                    s.Skip(12);
                    break;
                }
                case 22:
                {
                    s.Skip(4);
                    break;
                }
                case 1:
                {
                    s.Skip(4);
                    break;
                }
                case 3:
                {
                    s.Skip(4);
                    break;
                }
                case 131:
                {
                    break;
                }
                case 130:
                {
                    s.Skip(24);
                    break;
                }
                case 80:
                {
                    if (0 != _lineCharCount)
                        _linePrevCharX += s.GetDouble2();

                    _arrayGlyphOffsets[_lineCharCount] = _linePrevCharX;

                    _lineCharCount++;

                    if (_lineGidExist)
                        s.Skip(4);
                    else
                        s.Skip(2);

                    if (0 == _lineWidth)
                        _lineLastGlyphWidth = s.GetDouble2();
                    else
                        s.Skip(2);

                    break;
                }
                case 98:
                case 100:
                {
                    break;
                }
                case 91:
                {
                    // moveto
                    s.Skip(8);
                    break;
                }
                case 92:
                {
                    // lineto
                    s.Skip(8);
                    break;
                }
                case 94:
                {
                    // curveto
                    s.Skip(24);break;
                }
                case 97:
                {
                    break;
                }
                case 99:
                {
                    // drawpath
                    s.Skip(4);
                    break;
                }
                case 110:
                {
                    // drawImage
                    s.SkipImage();
                    break;
                }
                case 160:
                {
                    // textline
                    _linePrevCharX = 0;
                    _lineCharCount = 0;
                    _lineWidth = 0;

                    _arrayGlyphOffsets.splice(0, _arrayGlyphOffsets.length);

                    ++_numLine;

                    var mask = s.GetUChar();
                    _lineX = s.GetDouble();
                    _lineY = s.GetDouble();

                    if ((mask & 0x01) != 0)
                    {
                        _lineEx = 1;
                        _lineEy = 0;
                    }
                    else
                    {
                        _lineEx = s.GetDouble();
                        _lineEy = s.GetDouble();
                    }

                    _lineAscent = s.GetDouble();
                    _lineDescent = s.GetDouble();

                    if ((mask & 0x04) != 0)
                        _lineWidth = s.GetDouble();

                    if ((mask & 0x02) != 0)
                        _lineGidExist = true;
                    else
                        _lineGidExist = false;

                    break;
                }
                case 162:
                {
                    // textline end
                    var off1 = 0;
                    var off2 = 0;

                    if (_numLine < Line1)
                        break;
                    if (_numLine > Line2 && !bIsFillToEnd)
                        return;

                    // âñå ïîäñ÷èòàíî
                    if (0 == _lineWidth)
                        _lineWidth = _linePrevCharX + _lineLastGlyphWidth;

                    if (Line1 == _numLine)
                    {
                        if (-2 == Glyph1)
                            off1 = 0;
                        else if (-1 == Glyph1)
                            off1 = _lineWidth;
                        else
                            off1 = _arrayGlyphOffsets[Glyph1];
                    }
                    if (bIsFillToEnd || Line2 != _numLine)
                        off2 = _lineWidth;
                    else
                    {
                        if (Glyph2 == -2)
                            off2 = 0;
                        else if (Glyph2 == -1)
                            off2 = _lineWidth;
                        else
                        {
                            off2 = _arrayGlyphOffsets[Glyph2];
                            /*
                            if (Glyph2 >= (_arrayGlyphOffsets.length - 1))
                                off2 = _lineWidth;
                            else
                                off2 = _arrayGlyphOffsets[Glyph2 + 1];
                            */
                        }
                    }

                    if (off2 <= off1)
                        break;

                    // â ïðèíöèïå êîä îäèí è òîò æå. Íî ïî÷òè âñåãäà ëèíèè ãîðèçîíòàëüíûå.
                    // à äëÿ ãîðèçîíòàëüíîé ëèíèè âñå ìîæíî ïîîïòèìèçèðîâàòü
                    if (_lineEx == 1 && _lineEy == 0)
                    {
                        var _x = parseInt(xDst + dKoefX * (_lineX + off1)) - 0.5;
                        var _y = parseInt(yDst + dKoefY * (_lineY - _lineAscent)) - 0.5;

                        var _w = parseInt(dKoefX * (off2 - off1)) + 1;
                        var _h = parseInt(dKoefY * (_lineAscent + _lineDescent)) + 1;

                        if (_x < overlay.min_x)
                            overlay.min_x = _x;
                        if ((_x + _w) > overlay.max_x)
                            overlay.max_x = _x + _w;

                        if (_y < overlay.min_y)
                            overlay.min_y = _y;
                        if ((_y + _h) > overlay.max_y)
                            overlay.max_y = _y + _h;

                        overlay.m_oContext.rect(_x,_y,_w,_h);
                    }
                    else
                    {
                        // îïðåäåëÿåì òî÷êè descent ëèíèè
                        var ortX = -_lineEy;
                        var ortY = _lineEx;

                        var _dx = _lineX + ortX * _lineDescent;
                        var _dy = _lineY + ortY * _lineDescent;

                        var _x1 = _dx + off1 * _lineEx;
                        var _y1 = _dy + off1 * _lineEy;

                        var _x2 = _x1 - ortX * (_lineAscent + _lineDescent);
                        var _y2 = _y1 - ortY * (_lineAscent + _lineDescent);

                        var _x3 = _x2 + (off2 - off1) * _lineEx;
                        var _y3 = _y2 + (off2 - off1) * _lineEy;

                        var _x4 = _x3 + ortX * (_lineAscent + _lineDescent);
                        var _y4 = _y3 + ortY * (_lineAscent + _lineDescent);

                        _x1 = xDst + dKoefX * _x1;
                        _x2 = xDst + dKoefX * _x2;
                        _x3 = xDst + dKoefX * _x3;
                        _x4 = xDst + dKoefX * _x4;

                        _y1 = yDst + dKoefY * _y1;
                        _y2 = yDst + dKoefY * _y2;
                        _y3 = yDst + dKoefY * _y3;
                        _y4 = yDst + dKoefY * _y4;

                        overlay.CheckPoint(_x1, _y1);
                        overlay.CheckPoint(_x2, _y2);
                        overlay.CheckPoint(_x3, _y3);
                        overlay.CheckPoint(_x4, _y4);

                        var ctx = overlay.m_oContext;
                        ctx.moveTo(_x1, _y1);
                        ctx.lineTo(_x2, _y2);
                        ctx.lineTo(_x3, _y3);
                        ctx.lineTo(_x4, _y4);
                        ctx.closePath();
                    }

                    break;
                }
                case 161:
                {
                    // text transform
                    s.Skip(16);
                    break;
                }
                case 163:
                {
                    break;
                }
                case 164:
                {
                    s.Skip(16);
                    break;
                }
                case 121:
                case 122:
                {
                    // begin/end command
                    s.Skip(4);
                    break;
                }
                default:
                {
                    s.pos = page.end;
                }
            }
        }
    }

    this.CopySelection = function(pageNum, _text_format)
    {
        var ret = "";

        var sel = this.Selection;
        var Page1 = 0;
        var Page2 = 0;
        var Line1 = 0;
        var Line2 = 0;
        var Glyph1 = 0;
        var Glyph2 = 0;

        if (sel.Page2 > sel.Page1)
        {
            Page1 = sel.Page1;
            Page2 = sel.Page2;
            Line1 = sel.Line1;
            Line2 = sel.Line2;
            Glyph1 = sel.Glyph1;
            Glyph2 = sel.Glyph2;
        }
        else if (sel.Page2 < sel.Page1)
        {
            Page1 = sel.Page2;
            Page2 = sel.Page1;
            Line1 = sel.Line2;
            Line2 = sel.Line1;
            Glyph1 = sel.Glyph2;
            Glyph2 = sel.Glyph1;
        }
        else if (sel.Page1 == sel.Page2)
        {
            Page1 = sel.Page1;
            Page2 = sel.Page2;

            if (sel.Line1 < sel.Line2)
            {
                Line1 = sel.Line1;
                Line2 = sel.Line2;
                Glyph1 = sel.Glyph1;
                Glyph2 = sel.Glyph2;
            }
            else if (sel.Line2 < sel.Line1)
            {
                Line1 = sel.Line2;
                Line2 = sel.Line1;
                Glyph1 = sel.Glyph2;
                Glyph2 = sel.Glyph1;
            }
            else
            {
                Line1 = sel.Line1;
                Line2 = sel.Line2;

                if (sel.Glyph1 < sel.Glyph2 || -1 == sel.Glyph2)
                {
                    Glyph1 = sel.Glyph1;
                    Glyph2 = sel.Glyph2;
                }
                else
                {
                    Glyph1 = sel.Glyph2;
                    Glyph2 = sel.Glyph1;
                }
            }
        }

        if (Page1 > pageNum  || Page2 < pageNum)
            return;

        if (Page1 < pageNum)
        {
            Page1 = pageNum;
            Line1 = 0;
            Glyph1 = -2;
        }
        var bIsFillToEnd = false;
        if (Page2 > pageNum)
            bIsFillToEnd = true;


        var page = this.Pages[pageNum];
        var s = this.stream;
        s.Seek(page.start);

        var lineSpans = [];
        var curSpan = new CSpan();
        var isChangeSpan = false;

        var _lineCharCount = 0;
        var _lineGidExist = false;

        var _numLine = -1;

        while (s.pos < page.end)
        {
            var command = s.GetUChar();

            switch (command)
            {
                case 41:
                {
                    curSpan.fontName = s.GetULong();
                    s.Skip(4);
                    curSpan.fontSize = s.GetDouble();
                    isChangeSpan = true;
                    break;
                }
                case 22:
                {
                    curSpan.colorR = s.GetUChar();
                    curSpan.colorG = s.GetUChar();
                    curSpan.colorB = s.GetUChar();
                    s.Skip(1);
                    isChangeSpan = true;
                    break;
                }
                case 1:
                {
                    s.Skip(4);
                    break;
                }
                case 3:
                {
                    s.Skip(4);
                    break;
                }
                case 131:
                {
                    break;
                }
                case 130:
                {
                    s.Skip(24);
                    break;
                }
                case 80:
                {
                    if (0 != _lineCharCount)
                        s.Skip(2);

                    _lineCharCount++;
                    if (isChangeSpan)
                    {
                        lineSpans[lineSpans.length] = curSpan.CreateDublicate();
                    }
                    var sp = lineSpans[lineSpans.length - 1];

                    var _char = s.GetUShort();
                    if (0xFFFF == _char)
                        sp.inner += " ";
                    else
                        sp.inner += String.fromCharCode(_char);

                    if (_lineGidExist)
                        s.Skip(2);

                    s.Skip(2);

                    isChangeSpan = false;
                    break;
                }
                case 98:
                case 100:
                {
                    break;
                }
                case 91:
                {
                    // moveto
                    s.Skip(8);
                    break;
                }
                case 92:
                {
                    // lineto
                    s.Skip(8);
                    break;
                }
                case 94:
                {
                    // curveto
                    s.Skip(24);break;
                }
                case 97:
                {
                    break;
                }
                case 99:
                {
                    // drawpath
                    s.Skip(4);
                    break;
                }
                case 110:
                {
                    // drawImage
                    s.SkipImage();
                    break;
                }
                case 160:
                {
                    // textline
                    isChangeSpan = true;
                    lineSpans.splice(0, lineSpans.length);
                    _lineCharCount = 0;
                    ++_numLine;

                    var mask = s.GetUChar();
                    s.Skip(8);

                    if ((mask & 0x01) == 0)
                    {
                        s.Skip(8);
                    }

                    s.Skip(8);

                    if ((mask & 0x04) != 0)
                        s.Skip(4);

                    if ((mask & 0x02) != 0)
                        _lineGidExist = true;
                    else
                        _lineGidExist = false;

                    break;
                }
                case 162:
                {
                    // textline end
                    // ñïàíû íàáèòû. òåïåðü íóæíî ñôîðìèðîâàòü ëèíèþ è ñãåíåðèðîâàòü íóæíóþ ñòðîêó.
                    if (Line1 <= _numLine && ((!bIsFillToEnd && Line2 >= _numLine) || bIsFillToEnd))
                    {
                        var _g1 = -2;
                        var _g2 = -1;
                        if (Line1 == _numLine)
                        {
                            _g1 = Glyph1;
                        }
                        if (bIsFillToEnd || Line2 != _numLine)
                        {
                            _g2 = -1;
                        }
                        else
                        {
                            _g2 = Glyph2;
                        }

                        if (_g1 != -1 && _g2 != -2)
                        {
                            var textLine = "<p>";

                            if (-2 == _g1 && -1 == _g2)
                            {
                                var countSpans = lineSpans.length;
                                for (var i = 0; i < countSpans; i++)
                                {
                                    textLine += "<span>";
                                    textLine += lineSpans[i].inner;
                                    textLine += "</span>";

                                    if (_text_format)
                                        _text_format.Text += lineSpans[i].inner;
                                }
                            }
                            else
                            {
                                var curIndex = 0;
                                var countSpans = lineSpans.length;
                                for (var i = 0; i < countSpans; i++)
                                {
                                    var old = curIndex;
                                    var start = curIndex;
                                    var end = start + lineSpans[i].inner.length;
                                    curIndex = end + 1;

                                    if (_g1 > start)
                                        start = _g1;
                                    if (_g2 != -1 && _g2 < end)
                                        end = _g2;

                                    if (start > end)
                                        continue;

                                    start -= old;
                                    end -= old;

                                    textLine += "<span>";
                                    textLine += lineSpans[i].inner.substring(start, end);
                                    textLine += "</span>";

                                    if (_text_format)
                                        _text_format.Text += lineSpans[i].inner.substring(start, end);
                                }
                            }

                            textLine += "</p>";

                            if (_text_format)
                                _text_format.Text += "\n";

                            ret += textLine;
                        }
                    }

                    break;
                }
                case 161:
                {
                    // text transform
                    s.Skip(16);
                    break;
                }
                case 163:
                {
                    break;
                }
                case 164:
                {
                    s.Skip(16);
                    break;
                }
                case 121:
                case 122:
                {
                    // begin/end command
                    s.Skip(4);
                    break;
                }
                default:
                {
                    s.pos = page.end;
                }
            }
        }
        return ret;
    }

    this.SearchPage = function(pageNum, text)
    {
        var page = this.Pages[pageNum];
        var s = this.stream;
        s.Seek(page.start);

        var glyphsEqualFound = 0;
        var glyphsFindCount = text.length;

        if (0 == glyphsFindCount)
            return;

        var _numLine = -1;
        var _lineGidExist = false;
        var _linePrevCharX = 0;
        var _lineCharCount = 0;
        var _lineLastGlyphWidth = 0;

        var _findLine = 0;
        var _findLineOffsetX = 0;
        var _findLineOffsetR = 0;
        var _findGlyphIndex = 0;

        var _SeekToNextPoint = 0;
        var _SeekLinePrevCharX = 0;

        var arrayLines = [];
        var curLine = null;

        while (s.pos < page.end)
        {
            var command = s.GetUChar();

            switch (command)
            {
                case 41:
                {
                    s.Skip(12);
                    break;
                }
                case 22:
                {
                    s.Skip(4);
                    break;
                }
                case 1:
                {
                    s.Skip(4);
                    break;
                }
                case 3:
                {
                    s.Skip(4);
                    break;
                }
                case 131:
                {
                    break;
                }
                case 130:
                {
                    s.Skip(24);
                    break;
                }
                case 80:
                {
                    if (0 != _lineCharCount)
                        _linePrevCharX += s.GetDouble2();

                    _lineCharCount++;

                    var _char = s.GetUShort();
                    if (_lineGidExist)
                        s.Skip(2);

                    if (0xFFFF == _char)
                        curLine.text += " ";
                    else
                        curLine.text += String.fromCharCode(_char);

                    if (curLine.W != 0)
                        s.Skip(2);
                    else
                        curLine.W = s.GetDouble2();

                    break;
                }
                case 98:
                case 100:
                {
                    break;
                }
                case 91:
                {
                    // moveto
                    s.Skip(8);
                    break;
                }
                case 92:
                {
                    // lineto
                    s.Skip(8);
                    break;
                }
                case 94:
                {
                    // curveto
                    s.Skip(24);break;
                }
                case 97:
                {
                    break;
                }
                case 99:
                {
                    // drawpath
                    s.Skip(4);
                    break;
                }
                case 110:
                {
                    // drawImage
                    s.SkipImage();
                    break;
                }
                case 160:
                {
                    _linePrevCharX = 0;
                    _lineCharCount = 0;

                    arrayLines[arrayLines.length] = new CLineInfo();
                    curLine = arrayLines[arrayLines.length - 1];

                    var mask = s.GetUChar();
                    curLine.X = s.GetDouble();
                    curLine.Y = s.GetDouble();

                    if ((mask & 0x01) == 1)
                    {
                        var dAscent = s.GetDouble();
                        var dDescent = s.GetDouble();

                        curLine.Y -= dAscent;
                        curLine.H = dAscent + dDescent;
                    }
                    else
                    {
                        curLine.Ex = s.GetDouble();
                        curLine.Ey = s.GetDouble();

                        var dAscent = s.GetDouble();
                        var dDescent = s.GetDouble();

                        curLine.X = curLine.X + dAscent * curLine.Ey;
                        curLine.Y = curLine.Y - dAscent * curLine.Ex;

                        curLine.H = dAscent + dDescent;
                    }

                    if ((mask & 0x04) != 0)
                        curLine.W = s.GetDouble();

                    if ((mask & 0x02) != 0)
                        _lineGidExist = true;
                    else
                        _lineGidExist = false;

                    break;
                }
                case 162:
                {
                    break;
                }
                case 161:
                {
                    // text transform
                    s.Skip(16);
                    break;
                }
                case 163:
                {
                    break;
                }
                case 164:
                {
                    s.Skip(16);
                    break;
                }
                case 121:
                case 122:
                {
                    // begin/end command
                    s.Skip(4);
                    break;
                }
                default:
                {
                    s.pos = page.end;
                }
            }
        }

        // òåêñò çàïîëíåí. òåïåðü íóæíî ïðîñòî ïðîáåãàòüñÿ è ñìîòðåòü
        // îòêóäà ñîâïàäåíèå íà÷àëîñü è ãäå çàêîí÷èëîñü
        _linePrevCharX = 0;
        _lineCharCount = 0;
        _numLine = 0;

        s.Seek(page.start);

        while (s.pos < page.end)
        {
            var command = s.GetUChar();

            switch (command)
            {
                case 41:
                {
                    s.Skip(12);
                    break;
                }
                case 22:
                {
                    s.Skip(4);
                    break;
                }
                case 1:
                {
                    s.Skip(4);
                    break;
                }
                case 3:
                {
                    s.Skip(4);
                    break;
                }
                case 131:
                {
                    break;
                }
                case 130:
                {
                    s.Skip(24);
                    break;
                }
                case 80:
                {
                    if (0 != _lineCharCount)
                        _linePrevCharX += s.GetDouble2();

                    _lineCharCount++;

                    var _char = s.GetUShort();
                    if (_lineGidExist)
                        s.Skip(2);

                    if (0xFFFF == _char)
                        _char = " ".charCodeAt(0);

                    _lineLastGlyphWidth = s.GetDouble2();
                    if (_char == text.charCodeAt(glyphsEqualFound))
                    {
                        if (0 == glyphsEqualFound)
                        {
                            _findLine = _numLine;
                            _findLineOffsetX = _linePrevCharX;
                            _findGlyphIndex = _lineCharCount;

                            _SeekToNextPoint = s.pos;
                            _SeekLinePrevCharX = _linePrevCharX;
                        }

                        glyphsEqualFound++;
                        _findLineOffsetR = _linePrevCharX + _lineLastGlyphWidth;
                        if (glyphsFindCount == glyphsEqualFound)
                        {
                            var _text = "";
                            var _rects = [];
                            for (var i = _findLine; i <= _numLine; i++)
                            {
                                var ps = 0;
                                if (_findLine == i)
                                    ps = _findLineOffsetX;
                                var pe = arrayLines[i].W;
                                if (i == _numLine)
                                    pe = _findLineOffsetR;

                                var _l = arrayLines[i];
                                if (i == _findLine && i == _numLine)
                                {
                                    _text = _l.text.substring(0, _findGlyphIndex - 1);
                                    _text += "<b>";
                                    _text += _l.text.substring(_findGlyphIndex - 1, _lineCharCount);
                                    _text += "</b>";
                                    _text += _l.text.substring(_lineCharCount);
                                }
                                else if (i == _findLine)
                                {
                                    _text = _l.text.substring(0, _findGlyphIndex - 1);
                                    _text += "<b>";
                                    _text += _l.text.substring(_findGlyphIndex - 1);
                                }
                                else if (i == _numLine)
                                {
                                    _text += _l.text.substring(0, _lineCharCount);
                                    _text += "</b>";
                                    _text += _l.text.substring(_lineCharCount);
                                }
                                else
                                {
                                    _text += _l.text;
                                }

                                if (_l.Ex == 1 && _l.Ey == 0)
                                {
                                    _rects[_rects.length] = { PageNum : pageNum, X : _l.X + ps, Y : _l.Y, W : pe - ps, H : _l.H };
                                }
                                else
                                {
                                    _rects[_rects.length] = { PageNum : pageNum, X : _l.X + ps * _l.Ex, Y : _l.Y + ps * _l.Ey, W : pe - ps, H : _l.H, Ex : _l.Ex, Ey : _l.Ey };
                                }
                            }

                            //console.log(_text);
                            editor.WordControl.m_oDrawingDocument.AddPageSearch(_text, _rects, search_Common);

                            /*
                            // âñå íàéäåíî. íóæíî äîáàâèòü ðåêòû
                            if (_findLineEx == 1 && _findLineEy == 0)
                            {
                                var navigator = { Page : pageNum, X: _findLineX + _findLineOffsetX, Y: _findLineY - _findAscent,
                                    W : (_findLineOffsetR - _findLineOffsetX) , H : (_findAscent + _findDescent) };

                                var _find = { text: "", navigator : navigator };
                                editor.WordControl.m_oApi.sync_SearchFoundCallback(_find);

                                var _rect = [];
                                _rect[0] = { PageNum : pageNum, X : navigator.X, Y : navigator.Y, W : navigator.W, H : navigator.H };
                                editor.WordControl.m_oDrawingDocument.AddPageSearch("", _rect);
                            }
                            else
                            {
                                var ortX = _findLineEx;
                                var ortY = -_findLineEy;

                                var _x = _lineX + ortX * _findAscent;
                                var _y = _lineY + ortY * _findAscent;

                                var navigator = { Page : pageNum, X: _x, Y: _y,
                                    W : (_findLineOffsetR - _findLineOffsetX) , H : (_findAscent + _findDescent),
                                    Ex: _findLineEx, Ey: _findLineEy };

                                var _find = { text: "", navigator : navigator };
                                editor.WordControl.m_oApi.sync_SearchFoundCallback(_find);
                            }
                            */

                            // íóæíî âåðíóòüñÿ è ïîïðîáîâàòü èñêàòü ñî ñëåä áóêâû.
                            glyphsEqualFound = 0;
                            s.pos = _SeekToNextPoint;
                            _linePrevCharX = _SeekLinePrevCharX;
                            _lineCharCount = _findGlyphIndex;
                            _numLine = _findLine;
                        }
                    }
                    else
                    {
                        if (0 != glyphsEqualFound)
                        {
                            // íóæíî âåðíóòüñÿ è ïîïðîáîâàòü èñêàòü ñî ñëåä áóêâû.
                            glyphsEqualFound = 0;
                            s.pos = _SeekToNextPoint;
                            _linePrevCharX = _SeekLinePrevCharX;
                            _lineCharCount = _findGlyphIndex;
                            _numLine = _findLine;
                        }
                    }

                    break;
                }
                case 98:
                case 100:
                {
                    break;
                }
                case 91:
                {
                    // moveto
                    s.Skip(8);
                    break;
                }
                case 92:
                {
                    // lineto
                    s.Skip(8);
                    break;
                }
                case 94:
                {
                    // curveto
                    s.Skip(24);break;
                }
                case 97:
                {
                    break;
                }
                case 99:
                {
                    // drawpath
                    s.Skip(4);
                    break;
                }
                case 110:
                {
                    // drawImage
                    s.SkipImage();
                    break;
                }
                case 160:
                {
                    // textline
                    _linePrevCharX = 0;
                    _lineCharCount = 0;

                    var mask = s.GetUChar();
                    s.Skip(8);

                    if ((mask & 0x01) == 0)
                        s.Skip(8);

                    s.Skip(8);

                    if ((mask & 0x04) != 0)
                        s.Skip(4);

                    if ((mask & 0x02) != 0)
                        _lineGidExist = true;
                    else
                        _lineGidExist = false;

                    break;
                }
                case 162:
                {
                    ++_numLine;
                    break;
                }
                case 161:
                {
                    // text transform
                    s.Skip(16);
                    break;
                }
                case 163:
                {
                    break;
                }
                case 164:
                {
                    s.Skip(16);
                    break;
                }
                case 121:
                case 122:
                {
                    // begin/end command
                    s.Skip(4);
                    break;
                }
                default:
                {
                    s.pos = page.end;
                }
            }
        }
    }

    this.SearchPage2 = function(pageNum)
    {
        var page = this.Pages[pageNum];
        var s = this.stream;
        s.Seek(page.start);

        var _searchResults = this.SearchResults;
        var _navRects = _searchResults.Pages[pageNum];

        var glyphsEqualFound = 0;
        var text = _searchResults.Text;
        var glyphsFindCount = text.length;

        if (!_searchResults.MachingCase)
        {
            text = text.toLowerCase();
        }

        if (0 == glyphsFindCount)
            return;

        var _numLine = -1;
        var _lineGidExist = false;
        var _linePrevCharX = 0;
        var _lineCharCount = 0;
        var _lineLastGlyphWidth = 0;

        var _findLine = 0;
        var _findLineOffsetX = 0;
        var _findLineOffsetR = 0;
        var _findGlyphIndex = 0;

        var _SeekToNextPoint = 0;
        var _SeekLinePrevCharX = 0;

        var arrayLines = [];
        var curLine = null;

        while (s.pos < page.end)
        {
            var command = s.GetUChar();

            switch (command)
            {
                case 41:
                {
                    s.Skip(12);
                    break;
                }
                case 22:
                {
                    s.Skip(4);
                    break;
                }
                case 1:
                {
                    s.Skip(4);
                    break;
                }
                case 3:
                {
                    s.Skip(4);
                    break;
                }
                case 131:
                {
                    break;
                }
                case 130:
                {
                    s.Skip(24);
                    break;
                }
                case 80:
                {
                    if (0 != _lineCharCount)
                        _linePrevCharX += s.GetDouble2();

                    _lineCharCount++;

                    var _char = s.GetUShort();
                    if (_lineGidExist)
                        s.Skip(2);

                    if (0xFFFF == _char)
                        curLine.text += " ";
                    else
                        curLine.text += String.fromCharCode(_char);

                    if (curLine.W != 0)
                        s.Skip(2);
                    else
                        curLine.W = s.GetDouble2();

                    break;
                }
                case 98:
                case 100:
                {
                    break;
                }
                case 91:
                {
                    // moveto
                    s.Skip(8);
                    break;
                }
                case 92:
                {
                    // lineto
                    s.Skip(8);
                    break;
                }
                case 94:
                {
                    // curveto
                    s.Skip(24);break;
                }
                case 97:
                {
                    break;
                }
                case 99:
                {
                    // drawpath
                    s.Skip(4);
                    break;
                }
                case 110:
                {
                    // drawImage
                    s.SkipImage();
                    break;
                }
                case 160:
                {
                    _linePrevCharX = 0;
                    _lineCharCount = 0;

                    arrayLines[arrayLines.length] = new CLineInfo();
                    curLine = arrayLines[arrayLines.length - 1];

                    var mask = s.GetUChar();
                    curLine.X = s.GetDouble();
                    curLine.Y = s.GetDouble();

                    if ((mask & 0x01) == 1)
                    {
                        var dAscent = s.GetDouble();
                        var dDescent = s.GetDouble();

                        curLine.Y -= dAscent;
                        curLine.H = dAscent + dDescent;
                    }
                    else
                    {
                        curLine.Ex = s.GetDouble();
                        curLine.Ey = s.GetDouble();

                        var dAscent = s.GetDouble();
                        var dDescent = s.GetDouble();

                        curLine.X = curLine.X + dAscent * curLine.Ey;
                        curLine.Y = curLine.Y - dAscent * curLine.Ex;

                        curLine.H = dAscent + dDescent;
                    }

                    if ((mask & 0x04) != 0)
                        curLine.W = s.GetDouble();

                    if ((mask & 0x02) != 0)
                        _lineGidExist = true;
                    else
                        _lineGidExist = false;

                    break;
                }
                case 162:
                {
                    break;
                }
                case 161:
                {
                    // text transform
                    s.Skip(16);
                    break;
                }
                case 163:
                {
                    break;
                }
                case 164:
                {
                    s.Skip(16);
                    break;
                }
                case 121:
                case 122:
                {
                    // begin/end command
                    s.Skip(4);
                    break;
                }
                default:
                {
                    s.pos = page.end;
                }
            }
        }

        // òåêñò çàïîëíåí. òåïåðü íóæíî ïðîñòî ïðîáåãàòüñÿ è ñìîòðåòü
        // îòêóäà ñîâïàäåíèå íà÷àëîñü è ãäå çàêîí÷èëîñü
        _linePrevCharX = 0;
        _lineCharCount = 0;
        _numLine = 0;

        s.Seek(page.start);

        while (s.pos < page.end)
        {
            var command = s.GetUChar();

            switch (command)
            {
                case 41:
                {
                    s.Skip(12);
                    break;
                }
                case 22:
                {
                    s.Skip(4);
                    break;
                }
                case 1:
                {
                    s.Skip(4);
                    break;
                }
                case 3:
                {
                    s.Skip(4);
                    break;
                }
                case 131:
                {
                    break;
                }
                case 130:
                {
                    s.Skip(24);
                    break;
                }
                case 80:
                {
                    if (0 != _lineCharCount)
                        _linePrevCharX += s.GetDouble2();

                    _lineCharCount++;

                    var _char = s.GetUShort();
                    if (_lineGidExist)
                        s.Skip(2);

                    if (0xFFFF == _char)
                        _char = " ".charCodeAt(0);

                    _lineLastGlyphWidth = s.GetDouble2();

                    var _isFound = false;
                    if (_searchResults.MachingCase)
                    {
                        if (_char == text.charCodeAt(glyphsEqualFound))
                            _isFound = true;
                    }
                    else
                    {
                        var _strMem = String.fromCharCode(_char);
                        _strMem = _strMem.toLowerCase();
                        if (_strMem.charCodeAt(0) == text.charCodeAt(glyphsEqualFound))
                            _isFound = true;
                    }

                    if (_isFound)
                    {
                        if (0 == glyphsEqualFound)
                        {
                            _findLine = _numLine;
                            _findLineOffsetX = _linePrevCharX;
                            _findGlyphIndex = _lineCharCount;

                            _SeekToNextPoint = s.pos;
                            _SeekLinePrevCharX = _linePrevCharX;
                        }

                        glyphsEqualFound++;
                        _findLineOffsetR = _linePrevCharX + _lineLastGlyphWidth;
                        if (glyphsFindCount == glyphsEqualFound)
                        {
                            var _rects = [];
                            for (var i = _findLine; i <= _numLine; i++)
                            {
                                var ps = 0;
                                if (_findLine == i)
                                    ps = _findLineOffsetX;
                                var pe = arrayLines[i].W;
                                if (i == _numLine)
                                    pe = _findLineOffsetR;

                                var _l = arrayLines[i];
                                if (_l.Ex == 1 && _l.Ey == 0)
                                {
                                    _rects[_rects.length] = { PageNum : pageNum, X : _l.X + ps, Y : _l.Y, W : pe - ps, H : _l.H };
                                }
                                else
                                {
                                    _rects[_rects.length] = { PageNum : pageNum, X : _l.X + ps * _l.Ex, Y : _l.Y + ps * _l.Ey, W : pe - ps, H : _l.H, Ex : _l.Ex, Ey : _l.Ey };
                                }
                            }

                            _navRects[_navRects.length] = _rects;

                            // íóæíî âåðíóòüñÿ è ïîïðîáîâàòü èñêàòü ñî ñëåä áóêâû.
                            glyphsEqualFound = 0;
                            s.pos = _SeekToNextPoint;
                            _linePrevCharX = _SeekLinePrevCharX;
                            _lineCharCount = _findGlyphIndex;
                            _numLine = _findLine;
                        }
                    }
                    else
                    {
                        if (0 != glyphsEqualFound)
                        {
                            // íóæíî âåðíóòüñÿ è ïîïðîáîâàòü èñêàòü ñî ñëåä áóêâû.
                            glyphsEqualFound = 0;
                            s.pos = _SeekToNextPoint;
                            _linePrevCharX = _SeekLinePrevCharX;
                            _lineCharCount = _findGlyphIndex;
                            _numLine = _findLine;
                        }
                    }

                    break;
                }
                case 98:
                case 100:
                {
                    break;
                }
                case 91:
                {
                    // moveto
                    s.Skip(8);
                    break;
                }
                case 92:
                {
                    // lineto
                    s.Skip(8);
                    break;
                }
                case 94:
                {
                    // curveto
                    s.Skip(24);break;
                }
                case 97:
                {
                    break;
                }
                case 99:
                {
                    // drawpath
                    s.Skip(4);
                    break;
                }
                case 110:
                {
                    // drawImage
                    s.SkipImage();
                    break;
                }
                case 160:
                {
                    // textline
                    _linePrevCharX = 0;
                    _lineCharCount = 0;

                    var mask = s.GetUChar();
                    s.Skip(8);

                    if ((mask & 0x01) == 0)
                        s.Skip(8);

                    s.Skip(8);

                    if ((mask & 0x04) != 0)
                        s.Skip(4);

                    if ((mask & 0x02) != 0)
                        _lineGidExist = true;
                    else
                        _lineGidExist = false;

                    break;
                }
                case 162:
                {
                    ++_numLine;
                    break;
                }
                case 161:
                {
                    // text transform
                    s.Skip(16);
                    break;
                }
                case 163:
                {
                    break;
                }
                case 164:
                {
                    s.Skip(16);
                    break;
                }
                case 121:
                case 122:
                {
                    // begin/end command
                    s.Skip(4);
                    break;
                }
                default:
                {
                    s.pos = page.end;
                }
            }
        }
    }

    this.OnMouseDown = function(page, x, y)
    {
        var ret = this.GetNearestPos(page, x, y);

        var sel = this.Selection;
        sel.Page1 = page;
        sel.Line1 = ret.Line;
        sel.Glyph1 = ret.Glyph;

        sel.Page2 = page;
        sel.Line2 = ret.Line;
        sel.Glyph2 = ret.Glyph;

        sel.IsSelection = true;
        this.OnUpdateSelection();
    }

    this.OnMouseMove = function(page, x, y)
    {
        if (false === this.Selection.IsSelection)
            return;

        var ret = this.GetNearestPos(page, x, y);

        var sel = this.Selection;
        sel.Page2 = page;
        sel.Line2 = ret.Line;
        sel.Glyph2 = ret.Glyph;

        this.OnUpdateSelection();
    }

    this.OnMouseUp = function()
    {
        this.Selection.IsSelection = false;
    }

    this.OnUpdateSelection = function()
    {
        editor.WordControl.m_oOverlayApi.Show();
        editor.WordControl.OnUpdateOverlay();
    }

    this.Copy = function(_text_format)
    {
        var sel = this.Selection;
        var page1 = sel.Page1;
        var page2 = sel.Page2;

        if (page2 < page1)
        {
            page1 = page2;
            page2 = sel.Page1;
        }

        var ret = "<div>";
        for (var i = page1; i <= page2; i++)
        {
            ret += this.CopySelection(i, _text_format);
        }
        ret += "</div>";

        //console.log(ret);
        return ret;
    }

    this.OnKeyDown = function(e)
    {
        if (!editor.bInit_word_control)
            return false;

        var bRetValue = false;

        if ( e.KeyCode == 33 ) // PgUp
        {
            editor.WordControl.m_oScrollVerApi.scrollByY(-editor.WordControl.m_oEditor.HtmlElement.height, false);
        }
        else if ( e.KeyCode == 34 ) // PgDn
        {
            editor.WordControl.m_oScrollVerApi.scrollByY(editor.WordControl.m_oEditor.HtmlElement.height, false);
        }
        else if ( e.KeyCode == 35 ) // êëàâèøà End
        {
            if ( true === e.CtrlKey ) // Ctrl + End - ïåðåõîä â êîíåö äîêóìåíòà
            {
                editor.WordControl.m_oScrollVerApi.scrollToY(editor.WordControl.m_dScrollY_max, false);
            }

            bRetValue = true;
        }
        else if ( e.KeyCode == 36 ) // êëàâèøà Home
        {
            if ( true === e.CtrlKey ) // Ctrl + Home - ïåðåõîä â íà÷àëî äîêóìåíòà
            {
                editor.WordControl.m_oScrollVerApi.scrollToY(0, false);
            }

            bRetValue = true;
        }
        else if ( e.KeyCode == 37 ) // Left Arrow
        {
            bRetValue = true;
        }
        else if ( e.KeyCode == 38 ) // Top Arrow
        {
            bRetValue = true;
        }
        else if ( e.KeyCode == 39 ) // Right Arrow
        {
            bRetValue = true;
        }
        else if ( e.KeyCode == 40 ) // Bottom Arrow
        {
            bRetValue = true;
        }
        else if ( e.KeyCode == 65 && true === e.CtrlKey ) // Ctrl + A - âûäåëÿåì âñå
        {
            bRetValue = true;

            var sel = this.Selection;

            sel.Page1 = 0;
            sel.Line1 = 0;
            sel.Glyph1 = 0;

            sel.Page2 = 0;
            sel.Line2 = 0;
            sel.Glyph2 = 0;

            sel.IsSelection = false;

            if (0 != this.PagesCount)
            {
                var lLinesLastPage = this.GetCountLines(this.PagesCount - 1);
                if (1 != this.PagesCount || 0 != lLinesLastPage)
                {
                    sel.Glyph1 = -2;
                    sel.Page2 = this.PagesCount - 1;
                    sel.Line2 = lLinesLastPage;
                    sel.Glyph2 = -1;

                    this.OnUpdateSelection();
                }
            }
        }
        else if ( e.KeyCode == 67 && true === e.CtrlKey ) // Ctrl + C + ...
        {
            AscCommon.Editor_Copy(editor);
            //íå âîçâðàùàåì true ÷òîáû íå áûëî preventDefault
        }
		else if ( e.KeyCode == 80 && true === e.CtrlKey ) // Ctrl + P + ...
        {
            editor.onPrint();
            bRetValue = true;
        }
        else if ( e.KeyCode == 83 && true === e.CtrlKey ) // Ctrl + S + ...
        {
            // nothing
            bRetValue = true;
        }

        return bRetValue;
    }

    this.StartSearch = function(text)
    {
        editor.WordControl.m_oDrawingDocument.StartSearch();

        this.SearchInfo.Text = text;
        this.SearchInfo.Page = 0;
        this.SearchInfo.Id = setTimeout(oThisDoc.OnSearchPage, 1);
    }

    this.OnSearchPage = function()
    {
        oThisDoc.SearchPage(oThisDoc.SearchInfo.Page, oThisDoc.SearchInfo.Text);
        oThisDoc.SearchInfo.Page++;

        if (oThisDoc.SearchInfo.Page >= oThisDoc.PagesCount)
        {
            oThisDoc.StopSearch();
            return;
        }

        oThisDoc.SearchInfo.Id = setTimeout(oThisDoc.OnSearchPage, 1);
    }

    this.StopSearch = function()
    {
        if (null != this.SearchInfo.Id)
        {
            clearTimeout(this.SearchInfo.Id);
            this.SearchInfo.Id = null;
        }
        editor.WordControl.m_oDrawingDocument.EndSearch(false);
    }

    this.findText = function(text, isMachingCase, isNext)
    {
        this.SearchResults.IsSearch = true;
        if (text == this.SearchResults.Text && isMachingCase == this.SearchResults.MachingCase)
        {
            if (this.SearchResults.Count == 0)
            {
                editor.WordControl.m_oDrawingDocument.CurrentSearchNavi = null;
                this.SearchResults.CurrentPage = -1;
                this.SearchResults.Current = -1;
                return;
            }

            // поиск совпал, просто делаем навигацию к нужному месту
            if (isNext)
            {
                if ((this.SearchResults.Current + 1) < this.SearchResults.Pages[this.SearchResults.CurrentPage].length)
                {
                    // результат на этой же странице
                    this.SearchResults.Current++;
                }
                else
                {
                    var _pageFind = this.SearchResults.CurrentPage + 1;
                    var _bIsFound = false;
                    for (var i = _pageFind; i < this.PagesCount; i++)
                    {
                        if (0 < this.SearchResults.Pages[i].length)
                        {
                            this.SearchResults.Current = 0;
                            this.SearchResults.CurrentPage = i;
                            _bIsFound = true;
                            break;
                        }
                    }
                    if (!_bIsFound)
                    {
                        for (var i = 0; i < _pageFind; i++)
                        {
                            if (0 < this.SearchResults.Pages[i].length)
                            {
                                this.SearchResults.Current = 0;
                                this.SearchResults.CurrentPage = i;
                                _bIsFound = true;
                                break;
                            }
                        }
                    }
                }
            }
            else
            {
                if (this.SearchResults.Current > 0)
                {
                    // результат на этой же странице
                    this.SearchResults.Current--;
                }
                else
                {
                    var _pageFind = this.SearchResults.CurrentPage - 1;
                    var _bIsFound = false;
                    for (var i = _pageFind; i >= 0; i--)
                    {
                        if (0 < this.SearchResults.Pages[i].length)
                        {
                            this.SearchResults.Current = this.SearchResults.Pages[i].length - 1;
                            this.SearchResults.CurrentPage = i;
                            _bIsFound = true;
                            break;
                        }
                    }
                    if (!_bIsFound)
                    {
                        for (var i = this.PagesCount - 1; i > _pageFind; i++)
                        {
                            if (0 < this.SearchResults.Pages[i].length)
                            {
                                this.SearchResults.Current = this.SearchResults.Pages[i].length - 1;
                                this.SearchResults.CurrentPage = i;
                                _bIsFound = true;
                                break;
                            }
                        }
                    }
                }
            }

            editor.WordControl.m_oDrawingDocument.CurrentSearchNavi =
                this.SearchResults.Pages[this.SearchResults.CurrentPage][this.SearchResults.Current];

            editor.WordControl.ToSearchResult();
            return;
        }
        // новый поиск
        for (var i = 0; i < this.PagesCount; i++)
        {
            this.SearchResults.Pages[i].splice(0,  this.SearchResults.Pages[i].length);
        }
        this.SearchResults.Count = 0;

        this.SearchResults.CurrentPage = -1;
        this.SearchResults.Current = -1;

        this.SearchResults.Text = text;
        this.SearchResults.MachingCase = isMachingCase;

        for (var i = 0; i < this.PagesCount; i++)
        {
            this.SearchPage2(i);
            this.SearchResults.Count += this.SearchResults.Pages[i].length;
        }

        if (this.SearchResults.Count == 0)
        {
            editor.WordControl.m_oDrawingDocument.CurrentSearchNavi = null;
            editor.WordControl.OnUpdateOverlay();
            return;
        }

        for (var i = 0; i < this.SearchResults.Pages.length; i++)
        {
            if (0 != this.SearchResults.Pages[i].length)
            {
                this.SearchResults.CurrentPage = i;
                this.SearchResults.Current = 0;

                break;
            }
        }

        editor.WordControl.m_oDrawingDocument.CurrentSearchNavi =
            this.SearchResults.Pages[this.SearchResults.CurrentPage][this.SearchResults.Current];

        editor.WordControl.ToSearchResult();
    }
}