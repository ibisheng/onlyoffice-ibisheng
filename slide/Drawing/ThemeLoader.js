"use strict";

function CThemeLoadInfo()
{
    this.FontMap = null;
    this.ImageMap = null;

    this.Theme = null;
    this.Master = null;
    this.Layouts = [];
}

function CThemeLoader()
{
    this.Themes = new CAscThemes();

    // editor themes info
    this.themes_info_editor     = [];
    var count = this.Themes.EditorThemes.length;
    for (var i = 0; i < count; i++)
        this.themes_info_editor[i] = null;

    this.themes_info_document   = [];

    this.Api = null;
    this.CurrentLoadThemeIndex = -1;
    this.ThemesUrl = "";
    this.ThemesUrlAbs = "";

    this.IsReloadBinaryThemeEditorNow = false;

    var oThis = this;

    this.StartLoadTheme = function(indexTheme)
    {
        var theme_info = null;
        var theme_load_info = null;

        this.Api.StartLoadTheme();
        this.CurrentLoadThemeIndex = -1;

        if (indexTheme >= 0)
        {
            theme_info = this.Themes.EditorThemes[indexTheme];
            theme_load_info = this.themes_info_editor[indexTheme];
            this.CurrentLoadThemeIndex = indexTheme;
        }
        else
        {
            theme_info = this.Themes.DocumentThemes[-indexTheme - 1];
            theme_load_info = this.themes_info_document[-indexTheme - 1];
            // при загрузке документа все данные загрузились
            this.Api.EndLoadTheme(theme_load_info);
            return;
        }

        // применяется тема из стандартных.
        if (null != theme_load_info)
        {
            if (indexTheme >= 0 && theme_load_info.Master.sldLayoutLst.length === 0)
            {
                // мега схема. нужно переоткрыть бинарник, чтобы все открылось с историей
                this.IsReloadBinaryThemeEditorNow = true;
                this._callback_theme_load();
                return;
            }

			this.Api.sync_StartAction(Asc.c_oAscAsyncActionType.BlockInteraction, Asc.c_oAscAsyncAction.LoadTheme);
            this.Api.EndLoadTheme(theme_load_info);
            return;
        }

        this.Api.sync_StartAction(Asc.c_oAscAsyncActionType.BlockInteraction, Asc.c_oAscAsyncAction.LoadTheme);

        // значит эта тема еще не загружалась
        var theme_src = this.ThemesUrl + "theme" + (this.CurrentLoadThemeIndex + 1) + "/theme.js";
        this.LoadThemeJSAsync(theme_src);

        this.Api.StartLoadTheme();
    };

    this.LoadThemeJSAsync = function(theme_src)
    {
        var scriptElem = document.createElement('script');

        if (scriptElem.readyState && false)
        {
            scriptElem.onreadystatechange = function () {
                if (this.readyState == 'complete' || this.readyState == 'loaded')
                {
                    scriptElem.onreadystatechange = null;
                    setTimeout(oThis._callback_theme_load, 0);
                }
            }
        }
        scriptElem.onload = scriptElem.onerror = oThis._callback_theme_load;

        scriptElem.setAttribute('src',theme_src);
        scriptElem.setAttribute('type','text/javascript');
        document.getElementsByTagName('head')[0].appendChild(scriptElem);
    };

    this._callback_theme_load = function()
    {
        var g_th = window["g_theme" + (oThis.CurrentLoadThemeIndex + 1)];
        if (g_th !== undefined)
        {
            var _loader = new AscCommon.BinaryPPTYLoader();
            _loader.Api = oThis.Api;
            _loader.IsThemeLoader = true;

            var pres = {};
            pres.themes = [];
            pres.slideMasters = [];
            pres.slideLayouts = [];
            pres.DrawingDocument = editor.WordControl.m_oDrawingDocument;

            History.MinorChanges = true;
            _loader.Load(g_th, pres);
            for(var i = 0; i < pres.slideMasters.length; ++i)
            {
                pres.slideMasters[i].setThemeIndex(oThis.CurrentLoadThemeIndex);
            }
            History.MinorChanges = false;

            if (oThis.IsReloadBinaryThemeEditorNow)
            {
                oThis.asyncImagesEndLoaded();
                oThis.IsReloadBinaryThemeEditorNow = false;
                return;
            }

            // теперь объект this.themes_info_editor[this.CurrentLoadThemeIndex]
            oThis.Api.FontLoader.ThemeLoader = oThis;
            oThis.Api.FontLoader.LoadDocumentFonts2(oThis.themes_info_editor[oThis.CurrentLoadThemeIndex].FontMap);
            return;
        }
        // ошибка!!!
    };

    this.asyncFontsStartLoaded = function()
    {
        // началась загрузка шрифтов
    };

    this.asyncFontsEndLoaded = function()
    {
        // загрузка шрифтов
        this.Api.FontLoader.ThemeLoader = null;
        this.Api.ImageLoader.ThemeLoader = this;

        this.Api.ImageLoader.LoadDocumentImages(this.themes_info_editor[this.CurrentLoadThemeIndex].ImageMap);
    };

    this.asyncImagesStartLoaded = function()
    {
        // началась загрузка картинок
    };

    this.asyncImagesEndLoaded = function()
    {
        this.Api.ImageLoader.ThemeLoader = null;

        this.Api.EndLoadTheme(this.themes_info_editor[this.CurrentLoadThemeIndex]);
        this.CurrentLoadThemeIndex = -1;
    };
}
