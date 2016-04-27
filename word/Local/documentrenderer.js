"use strict";

CDocMeta.prototype.Load = function(url, doc_bin_base64)
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

        this.Pages[0] = pageInfo;
    }

    if (0 != this.Drawings.length)
    {
        this.Drawings.splice(0, this.Drawings.length);
    }

    AscCommon.g_font_loader.LoadEmbeddedFonts("fonts/", this.Fonts);

    var oThis = this;
    setInterval(function() {oThis.NativeDrawTimer();}, 40);
};

CDocMeta.prototype.NativeDrawTimer = function()
{
    var _ret = window["AscDesktopEditor"]["NativeViewerGetCompleteTasks"]();

    var _drDoc = editor.WordControl.m_oDrawingDocument;

    var _current = 0;

    var _countDrawTasks = _ret[_current++];
    var _countTextTasks = _ret[_current++];

    for (var i = 0; i < _countDrawTasks; ++i)
    {
        var _url    = _ret[_current++];
        var _page   = _ret[_current++];
        var _x      = _ret[_current++];
        var _y      = _ret[_current++];

        if (_page >= _drDoc.m_lDrawingFirst && _page <= _drDoc.m_lDrawingEnd)
        {
            _drDoc.StopRenderingPage(_page);
            editor.WordControl.OnScroll();
        }
    }

    for (var i = 0; i < _countTextTasks; ++i)
    {
        var _stream = CreateDocumentData(_ret[_current++]);
        var _page = _ret[_current++];
        this.pagestreams[_page] = _stream;
        this.Pages[_page].end   = this.pagestreams[_page] ? this.pagestreams[_page].size : 0;

        this.CountParagraphs    = _ret[_current++];
        this.CountWords         = _ret[_current++];
        this.CountSpaces        = _ret[_current++];
        this.CountSymbols       = _ret[_current++];

        if (_page == (this.PagesCount - 1))
        {
            this.selectAllCheckEnd();
        }
    }
};

CDocMeta.prototype.getStreamPage = function(pageNum)
{
    return this.pagestreams[pageNum] ? this.pagestreams[pageNum] : new CStream(null, 0);
};

CDocMeta.prototype.OnImageLoad = function(obj)
{
    if (obj.BreakDrawing == 1)
    {
        return;
    }

    var page = this.Pages[obj.Page];
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
        obj.MetaDoc.stopRenderingPage(obj.Page);
        editor.WordControl.OnScroll();
    };
    img.onerror = function(){
        obj.MetaDoc.stopRenderingPage(obj.Page);
    };
    img.src = _url;
};

CDocMeta.prototype.selectAllCheckStart = function()
{
    if (this.pagestreams[this.PagesCount - 1] !== undefined)
    {
        this.waitSelectAll = false;
        return true;
    }

    this.waitSelectAll = true;
    editor.sync_StartAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.SlowOperation);
};

CDocMeta.prototype.selectAllCheckEnd = function()
{
    if (this.waitSelectAll)
    {
        this.waitSelectAll = false;
        editor.sync_EndAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.SlowOperation);
        this.selectAll();
    }
};