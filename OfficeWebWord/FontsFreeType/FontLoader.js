function CFontFileLoader(sPath, id)
{
    this.Path       = sPath + ".js";
    this.Id         = id;
    this.IsLoaded   = false;
    this.stream_index = -1;
    this.IsStartLoaded = false;

    this.CheckLoaded = function()
    {
        return this.IsLoaded;
    }
    this.LoadFontAsync = function()
    {
        if (true === this.IsLoaded)
            return;
        if (true === this.IsStartLoaded)
            return;

        this.IsStartLoaded = true;
        if (false === this.IsLoaded)
        {
            //$.getScript(this.Path, function(data, textStatus){});

            var scriptElem = document.createElement('script');
            scriptElem.setAttribute('src',this.Path);
            scriptElem.setAttribute('type','text/javascript');
            document.getElementsByTagName('head')[0].appendChild(scriptElem);
        }
    }
}

function CDocumentFontLoader()
{
    this.m_oCurrentFontInfo = null;
    this.m_lCurrentDefaultFont = -1;
    this.m_bIsCompleteDefaultFonts = false;
    this.m_arrDefaultFontsIds = ["Arial", "Times New Roman", "Cambria", "Symbol", "Wingdings", "Wingdings 3"];

    this.LoadDefaultFonts = function()
    {
        this.m_lCurrentDefaultFont = 1;
        this.LoadFont(g_font_infos[map_font_index[this.m_arrDefaultFontsIds[0]]]);
    }

    this.LoadFont = function(fontinfo)
    {
        if (null != this.m_oCurrentFontInfo)
            return;

        var IsNeed = false;
        this.m_oCurrentFontInfo = fontinfo;

        if (-1 != this.m_oCurrentFontInfo.indexR && (false === g_font_files[this.m_oCurrentFontInfo.indexR].IsLoaded))
        {
            g_font_files[this.m_oCurrentFontInfo.indexR].LoadFontAsync();
            IsNeed = true;
        }
        if (-1 != this.m_oCurrentFontInfo.indexI && (false === g_font_files[this.m_oCurrentFontInfo.indexI].IsLoaded))
        {
            g_font_files[this.m_oCurrentFontInfo.indexI].LoadFontAsync();
            IsNeed = true;
        }
        if (-1 != this.m_oCurrentFontInfo.indexB && (false === g_font_files[this.m_oCurrentFontInfo.indexB].IsLoaded))
        {
            g_font_files[this.m_oCurrentFontInfo.indexB].LoadFontAsync();
            IsNeed = true;
        }
        if (-1 != this.m_oCurrentFontInfo.indexBI && (false === g_font_files[this.m_oCurrentFontInfo.indexBI].IsLoaded))
        {
            g_font_files[this.m_oCurrentFontInfo.indexBI].LoadFontAsync();
            IsNeed = true;
        }

        if (IsNeed)
        {
            this.Freeze();
            setTimeout(DocWaitTimeout, 50);
            return true;
        }
        else
        {
            this.m_oCurrentFontInfo = null;
            return false;
        }
    }

    this.WaitTimeout = function()
    {
        var IsNeed = false;
        if (-1 != this.m_oCurrentFontInfo.indexR && (false === g_font_files[this.m_oCurrentFontInfo.indexR].IsLoaded))
        {
            IsNeed = true;
        }
        else if (-1 != this.m_oCurrentFontInfo.indexI && (false === g_font_files[this.m_oCurrentFontInfo.indexI].IsLoaded))
        {
            IsNeed = true;
        }
        else if (-1 != this.m_oCurrentFontInfo.indexB && (false === g_font_files[this.m_oCurrentFontInfo.indexB].IsLoaded))
        {
            IsNeed = true;
        }
        else if (-1 != this.m_oCurrentFontInfo.indexBI && (false === g_font_files[this.m_oCurrentFontInfo.indexBI].IsLoaded))
        {
            IsNeed = true;
        }

        if (IsNeed)
        {
            setTimeout(DocWaitTimeout, 50);
        }
        else
        {
            this.UnFreeze();
        }
    }

    this.Freeze = function()
    {
    }
    this.UnFreeze = function()
    {
        this.m_oCurrentFontInfo = null;

        if (this.m_lCurrentDefaultFont < this.m_arrDefaultFontsIds.length)
        {
            this.LoadFont(g_font_infos[map_font_index[this.m_arrDefaultFontsIds[this.m_lCurrentDefaultFont]]]);
            this.m_lCurrentDefaultFont++;
            return;
        }

        if (false === this.m_bIsCompleteDefaultFonts)
        {
            // ��� ��������� ��������� ��������� ������
            this.m_bIsCompleteDefaultFonts = true;
            OnInit();
            return;
        }
        changeFontAttack();
    }
}

var DocumentFontLoader = new CDocumentFontLoader();
function DocWaitTimeout()
{
    DocumentFontLoader.WaitTimeout();
}

function CFontInfo(sName, indexR, faceIndexR, indexI, faceIndexI, indexB, faceIndexB, indexBI, faceIndexBI)
{
    this.Name       = sName;

    this.indexR     = indexR;
    this.faceIndexR = faceIndexR;

    this.indexI     = indexI;
    this.faceIndexI = faceIndexI;

    this.indexB     = indexB;
    this.faceIndexB = faceIndexB;

    this.indexBI    = indexBI;
    this.faceIndexBI= faceIndexBI;

    this.LoadFont = function(fontManager, fEmSize, lStyle, dHorDpi, dVerDpi)
    {
        // ����� ����� ������� ��� ����� ������������� ������.
        // �� ����� �����, ������ ��� ����� ����� ������� �� �� ����
        // (�.�. false == (this.PresentR == 0 && this.PresentI == 0 && this.PresentB == 0 && this.PresentBI == 0);
        var sReturnName = this.Name;
        var bNeedBold   = false;
        var bNeedItalic = false;

        var index       = -1;
        var faceIndex   = 0;

        var bSrcItalic  = false;
        var bSrcBold    = false;

        switch (lStyle)
        {
            case FontStyle.FontStyleBoldItalic:
            {
                bSrcItalic  = true;
                bSrcBold    = true;

                bNeedBold   = true;
                bNeedItalic = true;
                if (-1 != this.indexBI)
                {
                    index = this.indexBI;
                    faceIndex = this.faceIndexBI;
                    bNeedBold   = false;
                    bNeedItalic = false;
                }
                else if (-1 != this.indexB)
                {
                    index = this.indexB;
                    faceIndex = this.faceIndexB;
                    bNeedBold = false;
                }
                else if (-1 != this.indexI)
                {
                    index = this.indexI;
                    faceIndex = this.faceIndexI;
                    bNeedItalic = false;
                }
                else
                {
                    index = this.indexR;
                    faceIndex = this.faceIndexR;
                }
                break;
            }
            case FontStyle.FontStyleBold:
            {
                bSrcBold    = true;

                bNeedBold   = true;
                bNeedItalic = false;
                if (-1 != this.indexB)
                {
                    index = this.indexB;
                    faceIndex = this.faceIndexB;
                    bNeedBold = false;
                }
                else if (-1 != this.indexR)
                {
                    index = this.indexR;
                    faceIndex = this.faceIndexR;
                }
                else if (-1 != this.indexBI)
                {
                    index = this.indexBI;
                    faceIndex = this.faceIndexBI;
                    bNeedBold = false;
                }
                else
                {
                    index = this.indexI;
                    faceIndex = this.faceIndexI;
                }
                break;
            }
            case FontStyle.FontStyleItalic:
            {
                bSrcItalic  = true;

                bNeedBold   = false;
                bNeedItalic = true;
                if (-1 != this.indexI)
                {
                    index = this.indexI;
                    faceIndex = this.faceIndexI;
                    bNeedItalic = false;
                }
                else if (-1 != this.indexR)
                {
                    index = this.indexR;
                    faceIndex = this.faceIndexR;
                }
                else if (-1 != this.indexBI)
                {
                    index = this.indexBI;
                    faceIndex = this.faceIndexBI;
                    bNeedItalic = false;
                }
                else
                {
                    index = this.indexB;
                    faceIndex = this.faceIndexB;
                }
                break;
            }
            case FontStyle.FontStyleRegular:
            {
                bNeedBold   = false;
                bNeedItalic = false;
                if (-1 != this.indexR)
                {
                    index = this.indexR;
                    faceIndex = this.faceIndexR;
                }
                else if (-1 != this.indexI)
                {
                    index = this.indexI;
                    faceIndex = this.faceIndexI;
                }
                else if (-1 != this.indexB)
                {
                    index = this.indexB;
                    faceIndex = this.faceIndexB;
                }
                else
                {
                    index = this.indexBI;
                    faceIndex = this.faceIndexBI;
                }
            }
        }

        // index != -1 (!!!)
        var fontfile = g_font_files[index];
        var pFontFile = fontManager.m_oFontsCache.LockFont(fontfile.stream_index, fontfile.Id, faceIndex, fEmSize);

        if (!pFontFile)
            pFontFile = fontManager.m_oDefaultFont.GetDefaultFont(bSrcBold, bSrcItalic);
        else
            pFontFile.SetDefaultFont(fontManager.m_oDefaultFont.GetDefaultFont(bSrcBold, bSrcItalic));

        if (!pFontFile)
            return false;

        fontManager.m_pFont = pFontFile;
        pFontFile.m_bNeedDoBold = bNeedBold;
        pFontFile.SetItalic(bNeedItalic);

        var _fEmSize = fontManager.UpdateSize(fEmSize, dVerDpi, dVerDpi);
        pFontFile.SetSizeAndDpi(_fEmSize, dHorDpi, dVerDpi);

        pFontFile.SetStringGID(fontManager.m_bStringGID);
        pFontFile.SetUseDefaultFont(fontManager.m_bUseDefaultFont);
        pFontFile.SetCharSpacing(fontManager.m_fCharSpacing);

        fontManager.m_oGlyphString.ResetCTM();
        fontManager.m_pFont.SetTextMatrix(1, 0, 0, 1, 0, 0);

        fontManager.AfterLoad();
    }
}