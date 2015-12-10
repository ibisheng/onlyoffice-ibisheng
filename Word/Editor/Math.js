"use strict";

/**
 * Created by Ilja.Kirillov on 18.03.14.
 */

var g_dMathArgSizeKoeff_1 = 0.76;
var g_dMathArgSizeKoeff_2 = 0.6498; // 0.76 * 0.855

function CMathPropertiesSettings()
{
    this.brkBin     = null;

    this.defJc      = null;
    this.dispDef    = null;

    this.intLim     = null;

    this.lMargin    = null;

    this.naryLim    = null;

    this.rMargin    = null;

    this.wrapIndent = null;

    //   не реализовано    //
    this.brkBinSub  = null;

    this.interSp    = null;

    this.intraSp    = null;

    this.mathFont   = null;

    this.postSp     = null;
    this.preSp      = null;

    this.smallFrac  = null;

    this.wrapRight  = null;

    //*********************//
}
CMathPropertiesSettings.prototype.SetDefaultPr = function()
{
    this.brkBin     = BREAK_BEFORE;
    this.defJc      = align_Justify;
    this.dispDef    = true;
    this.intLim     = NARY_SubSup;
    this.mathFont   = {Name  : "Cambria Math", Index : -1 };
    this.lMargin    = 0;
    this.naryLim    = NARY_UndOvr;
    this.rMargin    = 0;
    this.wrapIndent = 25; // mm
};
CMathPropertiesSettings.prototype.Merge = function(Pr)
{
    if(Pr.wrapIndent !== null && Pr.wrapIndent !== undefined)
        this.wrapIndent = Pr.wrapIndent;

    if(Pr.lMargin !== null && Pr.lMargin !== undefined)
        this.lMargin = Pr.lMargin;

    if(Pr.rMargin !== null && Pr.rMargin !== undefined)
        this.rMargin = Pr.rMargin;

    if(Pr.intLim !== null && Pr.intLim !== undefined)
        this.intLim = Pr.intLim;

    if(Pr.naryLim !== null && Pr.naryLim !== undefined)
        this.naryLim = Pr.naryLim;

    if(Pr.defJc !== null && Pr.defJc !== undefined)
        this.defJc = Pr.defJc;

    if(Pr.brkBin !== null && Pr.brkBin !== undefined)
        this.brkBin = Pr.brkBin;

    if(Pr.dispDef !== null && Pr.dispDef !== undefined)
        this.dispDef = Pr.dispDef;
	
    if(Pr.mathFont !== null && Pr.mathFont !== undefined)
        this.mathFont = Pr.mathFont;
};

function CMathSettings()
{
    this.Pr        = new CMathPropertiesSettings();
    this.CompiledPr= new CMathPropertiesSettings();
    this.DefaultPr = new CMathPropertiesSettings();

    this.DefaultPr.SetDefaultPr();

    this.bNeedCompile = true;
}
CMathSettings.prototype.SetPr = function(Pr)
{
    this.bNeedCompile = true;
    this.Pr.Merge(Pr);
    this.SetCompiledPr();
};
CMathSettings.prototype.GetPr = function()
{
    return this.Pr;
};
CMathSettings.prototype.SetCompiledPr = function()
{
    if(this.bNeedCompile)
    {
        this.CompiledPr.Merge(this.DefaultPr);
        this.CompiledPr.Merge(this.Pr);

        this.bNeedCompile = false;
    }
};
CMathSettings.prototype.GetPrDispDef = function()
{
    var Pr;
    if(this.CompiledPr.dispDef ==  false)
        Pr = this.DefaultPr;
    else
        Pr = this.CompiledPr;

    return Pr;
};
CMathSettings.prototype.Get_WrapIndent = function(WrapState)
{
    this.SetCompiledPr();

    var wrapIndent = 0;
    if(WrapState == ALIGN_MARGIN_WRAP || WrapState == ALIGN_WRAP)
        wrapIndent = this.GetPrDispDef().wrapIndent;

    return wrapIndent;
};
CMathSettings.prototype.IsWrap = function(WrapState)
{
    return WrapState == ALIGN_MARGIN_WRAP || WrapState == ALIGN_WRAP;
};
CMathSettings.prototype.Get_LeftMargin = function(WrapState)
{
    this.SetCompiledPr();

    var lMargin = 0;
    if(WrapState == ALIGN_MARGIN_WRAP || WrapState == ALIGN_MARGIN)
        lMargin = this.GetPrDispDef().lMargin;

    return lMargin;
};
CMathSettings.prototype.Get_RightMargin = function(WrapState)
{
    this.SetCompiledPr();
    var rMargin    =  0;
    if(WrapState == ALIGN_MARGIN_WRAP || WrapState == ALIGN_MARGIN)
        rMargin = this.GetPrDispDef().rMargin;

    return rMargin;
};
CMathSettings.prototype.Get_IntLim = function()
{
    this.SetCompiledPr();
    return this.CompiledPr.intLim;
};
CMathSettings.prototype.Get_NaryLim = function()
{
    this.SetCompiledPr();
    return this.CompiledPr.naryLim;
};
CMathSettings.prototype.Get_DefJc = function()
{
    this.SetCompiledPr();
    return this.GetPrDispDef().defJc;
};
CMathSettings.prototype.Get_DispDef = function()
{
    this.SetCompiledPr();
    return this.CompiledPr.dispDef;
};
CMathSettings.prototype.Get_BrkBin = function()
{
    this.SetCompiledPr();
    return this.CompiledPr.brkBin;
};

function Get_WordDocumentDefaultMathSettings()
{
    if (!editor)
        return new CMathSettings();

    return editor.WordControl.m_oLogicDocument.Settings.MathSettings;
}

function MathMenu(type)
{
	this.Type = para_Math;
	this.Menu = type;
}
MathMenu.prototype =
{
	Get_Type : function()
    {
        return this.Type;
    }
};

function CMathParametersWidth()
{
    this.Measure = 0;
    this.bMathWordLarge = false;
}

function CParaMathLineWidths()
{
    this.FirstLineOnPage  = -1;
    this.WrapState        = ALIGN_EMPTY;

    this.Widths           = [];

    this.MaxW             = 0; // without first line

    this.bWordLarge       = false;
    this.NeedUpdateWrap   = true;
}
CParaMathLineWidths.prototype.UpdateWidth = function(Line, W)
{
    var bUpdMaxWidth = false;

    if(Line >= this.Widths.length)
    {
        this.Widths[Line] = new CMathParametersWidth();
        this.Widths[Line].Measure = W;
        bUpdMaxWidth = this.UpdateMinMax(Line);
    }
    else if(Math.abs(this.Widths[Line].Measure - W) > 0.00001)
    {
        var lng = this.Widths.length;
        var Max = this.MaxW;

        this.Widths[Line].Measure = W;

        if(lng > 0)
        {
            this.MaxW = this.Widths[0].Measure;

            for(var i = 1; i < lng; i++)
            {
                this.UpdateMinMax(i);
            }
        }

        bUpdMaxWidth = Math.abs(Max - this.MaxW) > 0.0001;
    }

    return bUpdMaxWidth;
};
CParaMathLineWidths.prototype.SetWordLarge = function(Line, bWordLarge)
{
    if(Line >= this.Widths.length)
    {
        this.Widths[Line] = new CMathParametersWidth();
        this.Widths[Line].bMathWordLarge = bWordLarge;

        if(bWordLarge)
            this.bWordLarge = true;
    }
    else
    {
        if(this.Widths[Line].bMathWordLarge !== bWordLarge)
        {
            this.Widths[Line].bMathWordLarge = bWordLarge;

            var Lng = this.Widths.length;

            this.bWordLarge = false;
            for(var Pos = 0; Pos < Lng; Pos++)
            {
                if(this.Widths[Pos].bMathWordLarge == true)
                {
                    this.bWordLarge = true;
                    break;
                }
            }
        }
    }
};
CParaMathLineWidths.prototype.IsLarge = function()
{
    return this.bWordLarge;
};
CParaMathLineWidths.prototype.Get = function(Line)
{
    return this.private_GetW(Line);
};
CParaMathLineWidths.prototype.GetFirst = function()
{
    return this.private_GetW(0);
};
CParaMathLineWidths.prototype.GetMax = function()
{
    return this.MaxW;
};
CParaMathLineWidths.prototype.UpdateMinMax = function(Pos)
{
    var bUpdMaxWidth = false;

    var ItemW = this.Widths[Pos].Measure;

    if(this.MaxW < ItemW)
    {
        this.MaxW = ItemW;
        bUpdMaxWidth = true;
    }

    return bUpdMaxWidth;
};
CParaMathLineWidths.prototype.private_GetW = function(Line)
{
    var W;

    if(Line < this.Widths.length)
        W = this.Widths[Line].Measure;

    return W;
};
CParaMathLineWidths.prototype.GetCountLines = function()
{
    return this.Widths.length;
};
CParaMathLineWidths.prototype.GetNumberLine = function(Line)
{
    return Line - this.FirstLineOnPage;
};

function CMathPageInfo()
{
    this.WPages      = [];          // widths on page
    this.StartLine   = -1;
    this.StartPage   = -1;
    this.CurPage     = -1;
}
CMathPageInfo.prototype.Reset = function()
{
    this.StartLine     = -1;
    this.StartPage     = -1;
    this.CurPage       = -1;
    this.WPages.length =  0;
};
CMathPageInfo.prototype.Reset_Page = function(_Page)
{
    if(this.StartPage >= 0) // если нет, то только начали расчет формулы
    {
        var Page = _Page - this.StartPage;

        if(Page < this.WPages.length) // если нет, то только начали расчет страницы
        {
            // уберем из массива информацию о страницах, начиная с текущей
            // не делаем Reset для текущей страницы, т.к. это приведет к тому, что выставятся только параметры по умолчанию
            // а проверка на стартовую позицию рассчитана именно на длину массива this.WPages
            this.WPages.length = Page;
        }
    }
};
CMathPageInfo.prototype.SetStartPos = function(Page, StartLine)
{
    this.StartPage   = Page;
    this.StartLine   = StartLine;
};
CMathPageInfo.prototype.UpdateCurrentPage = function(Page, ParaLine)
{
    this.CurPage = Page - this.StartPage;

    var Lng = this.WPages.length;
    if(this.CurPage >= Lng)
    {
        var FirstLineOnPage = ParaLine - this.StartLine;

        this.WPages[this.CurPage] = new CParaMathLineWidths();
        this.WPages[this.CurPage].FirstLineOnPage = FirstLineOnPage;
    }
};
CMathPageInfo.prototype.UpdateCurrentWrap = function(DispDef, bInline)
{
    if(this.WPages[this.CurPage].NeedUpdateWrap == true)
    {
        var WrapState;

        if(DispDef == false || bInline == true)
            WrapState = ALIGN_EMPTY;
        else if(this.CurPage == 0)
            WrapState = ALIGN_MARGIN_WRAP;
        else
            WrapState = ALIGN_MARGIN;

        this.WPages[this.CurPage].WrapState = WrapState;
        this.WPages[this.CurPage].NeedUpdateWrap = false;
    }
};
CMathPageInfo.prototype.SetNeedUpdateWrap = function()
{
    this.WPages[this.CurPage].NeedUpdateWrap = true;
};
CMathPageInfo.prototype.SetCurrentWrapState = function(WrapState)
{
    this.WPages[this.CurPage].WrapState = WrapState;
};
CMathPageInfo.prototype.SetNextWrapState = function()
{
    var InfoPage = this.WPages[this.CurPage];

    if(InfoPage.WrapState !== ALIGN_EMPTY)
        InfoPage.WrapState++;
};
CMathPageInfo.prototype.SetStateWordLarge = function(_Line, bWordLarge)
{
    var Line = this.WPages[this.CurPage].GetNumberLine(_Line - this.StartLine);
    this.WPages[this.CurPage].SetWordLarge(Line, bWordLarge);
};
CMathPageInfo.prototype.GetCurrentWrapState = function()
{
    return this.WPages[this.CurPage].WrapState;
};
CMathPageInfo.prototype.GetWrapStateOnPage = function(_Page)
{
    var Page = _Page - this.StartPage;
    return this.WPages[Page].WrapState;
};
CMathPageInfo.prototype.GetCurrentStateWordLarge = function()
{
    return this.WPages[this.CurPage].IsLarge();
};
CMathPageInfo.prototype.GetStartLinetWidth = function()
{
    return this.WPages[0].GetFirst();
};
CMathPageInfo.prototype.UpdateCurrentWidth = function(_Line, Width)
{
    var Line = this.WPages[this.CurPage].GetNumberLine(_Line - this.StartLine);

    return this.WPages[this.CurPage].UpdateWidth(Line, Width);
};
CMathPageInfo.prototype.GetCurrentMaxWidthAllLines = function()
{
    var MaxW = 0;
    if(this.CurPage !== 0)
    {
        MaxW = this.WPages[this.CurPage].GetMax();
    }
    else
    {
        var MaxWOFirst = this.WPages[this.CurPage].GetMax(),
            FirstW     = this.WPages[this.CurPage].GetFirst();

        var MathSettings = Get_WordDocumentDefaultMathSettings(),
            WrapState = this.GetCurrentWrapState();

        var wrapIndent = MathSettings.Get_WrapIndent(WrapState);

        MaxW = FirstW > wrapIndent + MaxWOFirst ? FirstW: MaxWOFirst + wrapIndent;
    }

    return MaxW;
};
CMathPageInfo.prototype.GetMaxW = function(_Page) // without first page
{
    var Page = _Page - this.StartPage;

    return this.WPages[Page].GetMax();
};
CMathPageInfo.prototype.GetFirstLineOnPage = function(_Page)
{
    var FirstLine = null;
    var Page = _Page - this.StartPage;

    if(Page >= 0 && Page < this.WPages.length)
    {
        var FirstLineOnPage = this.WPages[Page].FirstLineOnPage;
        FirstLine = this.StartLine + FirstLineOnPage;
    }

    return FirstLine;
};
CMathPageInfo.prototype.IsResetNextPage = function(_Page)
{
    var bReset = true;

    if(this.CurPage == -1)
    {
        bReset = false;
    }
    else
    {
        var Page = _Page - this.StartPage;
        bReset = this.CurPage < Page;

    }

    return bReset;
};
CMathPageInfo.prototype.IsFirstLineOnPage = function(_Line, _Page)
{
    var bFirstLine = true;

    if(this.StartPage >= 0) // если нет, то только начали расчет формулы
    {
        var Page = _Page - this.StartPage;

        if(Page < this.WPages.length) // если нет, то только начали расчет страницы
        {
            var FirstLine = this.GetFirstLineOnPage(_Page);

            bFirstLine = _Line == FirstLine;
        }
    }

    return bFirstLine;
};


/**
 *
 * @constructor
 * @extends {CParagraphContentWithContentBase}
 */
function ParaMath()
{
    ParaMath.superclass.constructor.call(this);

    this.Id                 = g_oIdCounter.Get_NewId();
    this.Type               = para_Math;

    this.Jc                 = undefined;

    this.Root               = new CMathContent();
    this.Root.bRoot         = true;
    this.Root.ParentElement = this;

    this.X                  = 0;
    this.Y                  = 0;

    this.FirstPage          = -1;
    this.PageInfo           = new CMathPageInfo();

    this.ParaMathRPI        = new CMathRecalculateInfo();

    this.bSelectionUse      = false;
    this.Paragraph          = null;
    this.bFastRecalculate   = true;

    this.AbsolutePage       = 0;

    this.NearPosArray       = [];

    this.Width              = 0;
    this.WidthVisible       = 0;
    this.Height             = 0;
    this.Ascent             = 0;
    this.Descent            = 0;

    this.DispositionOpers   = [];

    this.DefaultTextPr     = new CTextPr();

    this.DefaultTextPr.FontFamily = {Name  : "Cambria Math", Index : -1 };
    this.DefaultTextPr.RFonts.Set_All("Cambria Math", -1);

    // Добавляем данный класс в таблицу Id (обязательно в конце конструктора)
	g_oTableId.Add( this, this.Id );
}
Asc.extendClass(ParaMath, CParagraphContentWithContentBase);
ParaMath.prototype.Get_Type = function()
{
    return this.Type;
};

ParaMath.prototype.Get_Id = function()
{
    return this.Id;
};

ParaMath.prototype.Copy = function(Selected)
{
    var NewMath = new ParaMath();
    NewMath.Root.bRoot = true;

    if(Selected)
    {
        var result = this.GetSelectContent();
        result.Content.CopyTo(NewMath.Root, Selected);
    }
    else
    {
        this.Root.CopyTo(NewMath.Root, Selected);
    }

    NewMath.Root.Correct_Content(true);

    return NewMath;
};
ParaMath.prototype.CopyContent = function(Selected)
{
    return [this.Copy(Selected)];
};
ParaMath.prototype.Set_Paragraph = function(Paragraph)
{
    this.Paragraph = Paragraph;
    this.Root.Set_Paragraph(Paragraph);
    this.Root.Set_ParaMath(this, null);
};

ParaMath.prototype.Get_Text = function(Text)
{
    Text.Text = null;
};

ParaMath.prototype.Is_Empty = function()
{
    if (this.Root.Content.length <= 0)
        return true;

    if (1 === this.Root.Content.length)
        return this.Root.Content[0].Is_Empty({SkipPlcHldr : true});

    return false;
};

ParaMath.prototype.Is_CheckingNearestPos = function()
{
    return this.Root.Is_CheckingNearestPos();
};

ParaMath.prototype.Is_StartFromNewLine = function()
{
    return false;
};

ParaMath.prototype.Get_TextPr = function(_ContentPos, Depth)
{
    var TextPr = new CTextPr();

    var mTextPr = this.Root.Get_TextPr(_ContentPos, Depth);
    TextPr.Merge( mTextPr );

    return TextPr;
};
ParaMath.prototype.Get_CompiledTextPr = function(Copy)
{
    var oContent = this.GetSelectContent();
    var mTextPr = oContent.Content.Get_CompiledTextPr(Copy);

    return mTextPr;
};

ParaMath.prototype.Add = function(Item)
{
    var LogicDocument  = (this.Paragraph ? this.Paragraph.LogicDocument : undefined);
    var TrackRevisions = (LogicDocument && true === LogicDocument.Is_TrackRevisions() ? true : false);

    var Type = Item.Type;
    var oSelectedContent = this.GetSelectContent();

    var oContent = oSelectedContent.Content;

    var StartPos = oSelectedContent.Start;
    var Run = oContent.Content[StartPos];

    // Мы вставляем только в Run
    if (para_Math_Run !== Run.Type)
        return;

    var NewElement = null;
    if (para_Text === Type)
    {
        // заглушка для текстовых настроек плейсхолдера

        if(oContent.bRoot == false && Run.IsPlaceholder())
        {
            var CtrRunPr = oContent.Get_ParentCtrRunPr(false); // ctrPrp (не копия)

            if (true === TrackRevisions)
                LogicDocument.Set_TrackRevisions(false);

            Run.Apply_TextPr(CtrRunPr, undefined, true);

            if (true === TrackRevisions)
                LogicDocument.Set_TrackRevisions(true);
        }

        if(Item.Value == 38)
        {
            NewElement = new CMathAmp();
            Run.Add(NewElement, true);
        }
        else
        {
            NewElement = new CMathText(false);
            NewElement.add(Item.Value);
            Run.Add(NewElement, true);
        }
    }
    else if (para_Space === Type)
    {
        NewElement = new CMathText(false);
        NewElement.add(32);
        Run.Add(NewElement, true);
    }
    else if (para_Math === Type)
    {
        var ContentPos = new CParagraphContentPos();

        if(this.bSelectionUse == true)
            this.Get_ParaContentPos(true, true, ContentPos);
        else
            this.Get_ParaContentPos(false, false, ContentPos);

        var TextPr = this.Root.GetMathTextPrForMenu(ContentPos, 0);

        // Нам нужно разделить данный Run на 2 части
        var RightRun = Run.Split2(Run.State.ContentPos);

        oContent.Internal_Content_Add(StartPos + 1, RightRun, false);
        // Выставляем позицию в начало этого рана
        oContent.CurPos = StartPos + 1;
        RightRun.Cursor_MoveToStartPos();

        var lng = oContent.Content.length;
        oContent.Load_FromMenu(Item.Menu, this.Paragraph);

        var lng2 = oContent.Content.length;
        var Pos_ApplyTextPr =
        {
            StartPos:   StartPos + 1,
            EndPos:     StartPos + lng2 - lng
        };

        TextPr.RFonts.Set_All("Cambria Math", -1);

        if (true === TrackRevisions)
            LogicDocument.Set_TrackRevisions(false);

        oContent.Apply_TextPr(TextPr, undefined, false, Pos_ApplyTextPr);

        if (true === TrackRevisions)
            LogicDocument.Set_TrackRevisions(true);
    }

    if ((para_Text === Type || para_Space === Type) && null !== NewElement)
    {
        this.bFastRecalculate = oContent.bOneLine == false; // многострочный контент => можно осуществлять быстрый пересчет

        // Пробуем произвести автозамену
        oContent.Process_AutoCorrect(NewElement);
    }

    // Корректируем данный контент
    oContent.Correct_Content(true);
};

ParaMath.prototype.Get_AlignToLine = function(_CurLine, _CurRange, _Page, _X, _XLimit)
{
    // отступ первой строки не учитывается для неинлайновых формул
    var X = _X;

    var MathSettings = Get_WordDocumentDefaultMathSettings();

    var AbsolutePage = this.Paragraph == null ? 0 : this.Paragraph.Get_StartPage_Absolute();
    var Page = AbsolutePage + _Page;

    var WrapState = this.PageInfo.GetWrapStateOnPage(Page);
    var bFirstLine = this.Root.IsStartLine(_CurLine);

    // выставим сначала Position до пересчета выравнивания для формулы
    // для расчета смещений относительно операторов

    var PosInfo = new CMathPosInfo();

    PosInfo.CurLine  = _CurLine;
    PosInfo.CurRange = _CurRange;

    if(true == this.NeedDispOperators(_CurLine))
    {
        this.DispositionOpers.length = 0;
        PosInfo.DispositionOpers = this.DispositionOpers;
    }

    var pos   = new CMathPosition();
    this.Root.setPosition(pos, PosInfo);

    var XStart, XEnd;

    if(this.ParaMathRPI.bInline == false)
    {
        XStart = this.ParaMathRPI.XStart;
        XEnd   = this.ParaMathRPI.XEnd;
    }
    else
    {
        XStart = _X;
        XEnd   = _XLimit;
    }

    XStart += MathSettings.Get_LeftMargin(WrapState);
    XEnd   -= MathSettings.Get_RightMargin(WrapState);

    var Jc = this.Get_Align();

    var W = this.PageInfo.GetMaxW(Page);

    var alignBrk = this.Root.GetAlignBrk(_CurLine, _CurRange);
    var DispLng = this.DispositionOpers.length;

    var bAlignAt = WrapState === ALIGN_MARGIN_WRAP && DispLng > 0 && bFirstLine === false && alignBrk > 0;

    if(bFirstLine == true || bAlignAt == true) // первая строка первой страницы, если строка разбивается на несколько отрезков, то это уже будет inline-формула => ф-ия Get_AlignToLine не будет вызвана
    {                                          // bAlignAt == true - учтем выравниевание первой строки + прибавим смещение для alnAt
        var StartLineWidth = this.PageInfo.GetStartLinetWidth(); // если страница не первая, то ширину первой строки формулы не учитываем

        switch(Jc)
        {
            case align_Left:    X = XStart; break;
            case align_Right:   X = Math.max(XEnd - StartLineWidth, XStart); break;
            case align_Center:  X = Math.max(XStart + (XEnd - XStart - StartLineWidth)/2, XStart); break;
            case align_Justify:
            {
                X = Math.max(XStart + (XEnd - XStart - W)/2, XStart);
                break;
            }
        }

        if(bAlignAt == true)
        {
            var PosAln  = alignBrk < DispLng ?  alignBrk -1 : DispLng - 1;
            X += this.DispositionOpers[PosAln];
        }
    }
    else
    {
        var wrap = 0;
        var wrapIndent = MathSettings.Get_WrapIndent(WrapState);

        if(true == MathSettings.IsWrap(WrapState))
        {
            wrap = this.Root.Get_WrapToLine(_CurLine, _CurRange, wrapIndent);
        }

        if(Jc == align_Justify)
        {
            X = XEnd - XStart > W ? XStart + (XEnd - XStart - W)/2 + wrap : XStart;
        }
        else
        {
            X = XEnd - XStart > W ? XStart + wrap : XStart;
        }
    }


    return X;
};

ParaMath.prototype.Remove = function(Direction, bOnAddText)
{
    var TrackRevisions = null;
    if (this.Paragraph && this.Paragraph.LogicDocument)
        TrackRevisions = this.Paragraph.LogicDocument.Is_TrackRevisions();

    var oSelectedContent = this.GetSelectContent();

    var nStartPos = oSelectedContent.Start;
    var nEndPos = oSelectedContent.End;
    var oContent = oSelectedContent.Content;

    if (nStartPos === nEndPos)
    {
        var oElement = oContent.getElem(nStartPos);
        var ElementReviewType = oElement.Get_ReviewType();

        // Если данный элемент - ран, удаляем внутри рана, если нет, тогда удаляем целиком элемент
        if (para_Math_Run === oElement.Type)
        {
            if ((true === oElement.IsPlaceholder()) || (false === oElement.Remove(Direction) && true !== this.bSelectionUse))
            {
                if ((Direction > 0 && oContent.Content.length - 1 === nStartPos) || (Direction < 0 && 0 === nStartPos))
                {
                    // Проверяем находимся ли мы на верхнем уровне
                    if (oContent.bRoot)
                        return false;

                    // Значит мы в каком-то элементе, тогда надо выделить данный элемент
                    oContent.ParentElement.Select_WholeElement();

                    return true;
                }

                if (Direction > 0)
                {
                    var oNextElement = oContent.getElem(nStartPos + 1);
                    if (para_Math_Run === oNextElement.Type)
                    {
                        // Здесь мы не проверяем результат Remove, потому что ран не должен быть пустым после
                        // Correct_Content
                        oNextElement.Cursor_MoveToStartPos();
                        oNextElement.Remove(1);

                        if (oNextElement.Is_Empty())
                        {
                            oContent.Correct_Content();
                            oContent.Correct_ContentPos(1);
                        }

                        this.Selection_Remove();
                    }
                    else
                    {
                        oContent.Select_ElementByPos(nStartPos + 1, true);
                    }
                }
                else //if (Direction < 0)
                {
                    var oPrevElement = oContent.getElem(nStartPos - 1);
                    if (para_Math_Run === oPrevElement.Type)
                    {
                        // Здесь мы не проверяем результат Remove, потому что ран не должен быть пустым после
                        // Correct_Content
                        oPrevElement.Cursor_MoveToEndPos();
                        oPrevElement.Remove(-1);

                        if (oPrevElement.Is_Empty())
                        {
                            oContent.Correct_Content();
                            oContent.Correct_ContentPos(-1);
                        }

                        this.Selection_Remove();
                    }
                    else
                    {
                        oContent.Select_ElementByPos(nStartPos - 1, true);
                    }
                }
            }
            else
            {
                if (oElement.Is_Empty())
                {
                    oContent.CurPos = nStartPos;
                    oContent.Correct_Content();
                    oContent.Correct_ContentPos(-1); // -1, потому что нам надо встать перед элементом, а не после
                }

                this.Selection_Remove();
            }

            return true;
        }
        else
        {
            this.Selection_Remove();
            if (true === TrackRevisions)
            {
                if (reviewtype_Common === ElementReviewType)
                {
                    if (para_Math_Run === oElement.Type !== oElement.Type)
                        oElement.Reject_RevisionChanges(c_oAscRevisionsChangeType.TextAdd, true);

                    oElement.Set_ReviewType(reviewtype_Remove);
                }
                else if (reviewtype_Add === ElementReviewType)
                {
                    oContent.Remove_FromContent(nStartPos, 1);
                    if (para_Math_Run === oContent.Content[nStartPos].Type)
                        oContent.Content[nStartPos].Cursor_MoveToStartPos();
                }
            }
            else
            {
                oContent.Remove_FromContent(nStartPos, 1);
                if (para_Math_Run === oContent.Content[nStartPos].Type)
                    oContent.Content[nStartPos].Cursor_MoveToStartPos();
            }
            oContent.CurPos = nStartPos;
            oContent.Correct_Content();
            oContent.Correct_ContentPos(-1); // -1, потому что нам надо встать перед элементом, а не после
        }
    }
    else
    {
        if (nStartPos > nEndPos)
        {
            var nTemp = nEndPos;
            nEndPos = nStartPos;
            nStartPos = nTemp;
        }

        // Проверяем начальный и конечный элементы
        var oStartElement = oContent.getElem(nStartPos);
        var oEndElement = oContent.getElem(nEndPos);

        if (true === TrackRevisions)
        {
            for (var CurPos = nEndPos; CurPos >= nStartPos; --CurPos)
            {
                var Element = oContent.getElem(CurPos);
                var ElementReviewType = Element.Get_ReviewType();

                if (para_Math_Run === Element.Type && (CurPos === nEndPos || CurPos === nStartPos))
                {
                    // Удаление разруливается внутри рана
                    Element.Remove(Direction);
                }
                else
                {
                    if (reviewtype_Common === ElementReviewType)
                    {
                        if (para_Math_Run === Element.Type !== Element.Type)
                            Element.Reject_RevisionChanges(c_oAscRevisionsChangeType.TextAdd, true);

                        Element.Set_ReviewType(reviewtype_Remove);
                    }
                    else if (reviewtype_Add === ElementReviewType)
                    {
                        oContent.Remove_FromContent(CurPos, 1);
                        nEndPos--;
                    }
                }
            }

            this.Selection_Remove();
            if (Direction < 0)
            {
                oContent.CurPos = nStartPos;
            }
            else
            {
                oContent.CurPos = nEndPos;
                if (para_Math_Run === oContent.Content[nEndPos].Type)
                    oContent.Content[nEndPos].Cursor_MoveToStartPos();
            }
        }
        else
        {
            // Если последний элемент - ран, удаляем внутри, если нет, тогда удаляем целиком элемент
            if (para_Math_Run === oEndElement.Type)
                oEndElement.Remove(Direction);
            else
                oContent.Remove_FromContent(nEndPos, 1);

            // Удаляем все промежуточные элементы
            oContent.Remove_FromContent(nStartPos + 1, nEndPos - nStartPos - 1);

            // Если первый элемент - ран, удаляем внутри рана, если нет, тогда удаляем целиком элемент
            if (para_Math_Run === oStartElement.Type)
                oStartElement.Remove(Direction);
            else
                oContent.Remove_FromContent(nStartPos, 1);

            this.Selection_Remove();
            oContent.CurPos = nStartPos;
        }
        oContent.Correct_Content();
        oContent.Correct_ContentPos(Direction);
    }
};

ParaMath.prototype.GetSelectContent = function()
{
    return this.Root.GetSelectContent();
};

ParaMath.prototype.Get_CurrentParaPos = function()
{
    return this.Root.Get_CurrentParaPos();
};

ParaMath.prototype.Apply_TextPr = function(TextPr, IncFontSize, ApplyToAll)
{
    if(ApplyToAll == true) // для ситуации, когда ApplyToAll = true, в Root формулы при этом позиции селекта не проставлены
    {
        this.Root.Apply_TextPr(TextPr, IncFontSize, true);
    }
    else
    {
        var content = this.GetSelectContent().Content;

        var NewTextPr = new CTextPr();
        var bSetInRoot = false;


        if(IncFontSize == undefined)
        {
            if(TextPr.Underline !== undefined)
            {

                NewTextPr.Underline   = TextPr.Underline;
                bSetInRoot            = true;
            }

            if(TextPr.FontSize !== undefined && content.IsNormalTextInRuns() == false)
            {
                NewTextPr.FontSize    = TextPr.FontSize;
                bSetInRoot            = true;

            }

            content.Apply_TextPr(TextPr, IncFontSize, ApplyToAll);

            if(bSetInRoot)
                this.Root.Apply_TextPr(NewTextPr, IncFontSize, true);
        }
        else
        {

            if(content.IsNormalTextInRuns() == false)
                this.Root.Apply_TextPr(TextPr, IncFontSize, true);
            else
                content.Apply_TextPr(TextPr, IncFontSize, ApplyToAll);
        }
    }
};

ParaMath.prototype.Clear_TextPr = function()
{

};

ParaMath.prototype.Check_NearestPos = function(ParaNearPos, Depth)
{
    this.Root.Check_NearestPos(ParaNearPos, Depth);
};

ParaMath.prototype.Get_DrawingObjectRun = function(Id)
{
    return null;
};

ParaMath.prototype.Get_DrawingObjectContentPos = function(Id, ContentPos, Depth)
{
    return false;
};

ParaMath.prototype.Get_Layout = function(DrawingLayout, UseContentPos, ContentPos, Depth)
{
    if (true === UseContentPos)
        DrawingLayout.Layout = true;
    else
        DrawingLayout.X += this.Width;
};

ParaMath.prototype.Get_NextRunElements = function(RunElements, UseContentPos, Depth)
{
};

ParaMath.prototype.Get_PrevRunElements = function(RunElements, UseContentPos, Depth)
{
};

ParaMath.prototype.Collect_DocumentStatistics = function(ParaStats)
{
    // TODO: ParaMath.Collect_DocumentStatistics
};

ParaMath.prototype.Create_FontMap = function(Map)
{
    // Styles.js
    // Document_CreateFontMap

    this.Root.Create_FontMap(Map);
};

ParaMath.prototype.Get_AllFontNames = function(AllFonts)
{
    // выставить для всех шрифтов, к-ые используются в AllFonts true
    AllFonts["Cambria Math"] = true;

    this.Root.Get_AllFontNames(AllFonts);
};

ParaMath.prototype.Get_SelectedElementsInfo = function(Info)
{
    Info.Set_Math(this);
};

ParaMath.prototype.Get_SelectedText = function(bAll, bClearText)
{
    if ( true === bAll || true === this.Selection_IsUse() )
    {
        if ( true === bClearText )
            return null;

        return "";
    }

    return "";
};

ParaMath.prototype.Get_SelectionDirection = function()
{
    return this.Root.Get_SelectionDirection();
};

ParaMath.prototype.Clear_TextFormatting = function( DefHyper )
{
};

ParaMath.prototype.Can_AddDropCap = function()
{
    return false;
};

ParaMath.prototype.Get_TextForDropCap = function(DropCapText, UseContentPos, ContentPos, Depth)
{
    if ( true === DropCapText.Check )
        DropCapText.Mixed = true;
};

ParaMath.prototype.Get_StartTabsCount = function(TabsCounter)
{
    return false;
};

ParaMath.prototype.Remove_StartTabs = function(TabsCounter)
{
    return false;
};

ParaMath.prototype.Add_ToContent = function(Pos, Item, UpdatePosition)
{

};
//-----------------------------------------------------------------------------------
// Функции пересчета
//-----------------------------------------------------------------------------------

ParaMath.prototype.Recalculate_Range = function(PRS, ParaPr, Depth)
{
    // Paragraph_Recalculate.js
    // private_RecalculateFastRange

    // Document.js
    // Recalculate
    // SimpleChanges

    // Paragraph.js
    // CRunRecalculateObject.Compare

    if(PRS.bFastRecalculate == true && this.bFastRecalculate == false)
        return;

    if( this.Paragraph !== PRS.Paragraph )
    {
        this.Paragraph = PRS.Paragraph;
        this.protected_UpdateSpellChecking();
    }

    this.AbsolutePage = this.Paragraph == null ? 0 : this.Paragraph.Get_StartPage_Absolute();

    var Para      = PRS.Paragraph;
    var ParaLine  = PRS.Line;
    var ParaRange = PRS.Range;
    var Page      = this.AbsolutePage + PRS.Page;

    var bStartRange    = this.Root.IsStartRange(ParaLine, ParaRange);


    // первый пересчет
    var PrevLineObject = PRS.RestartPageRecalcInfo.Object;
    var bCurrentObj = PrevLineObject == null || PrevLineObject == this;
    var PrevObject = bCurrentObj ? null : PrevLineObject;

    var bStartRecalculate = PrevLineObject == null && true == bStartRange && PRS.bFastRecalculate == false;
    var bContinueRecalc = this.ParaMathRPI.bInline == false && PRS.bContinueRecalc === true;

    var LDRecalcInfo  = this.Paragraph.Parent.RecalcInfo;

    if(bStartRecalculate == true && bContinueRecalc == false) // первый пересчет
    {
        // информация о пересчете
        var RPI = new CRPI();
        RPI.MergeMathInfo(this.ParaMathRPI);
        var ArgSize = new CMathArgSize();

        this.Root.PreRecalc(null, this, ArgSize, RPI);

        this.PageInfo.Reset();
        this.PageInfo.SetStartPos(Page, ParaLine);

        this.ParaMathRPI.Reset(PRS, ParaPr);
    }
    else
    {
        // true == this.PageInfo.IsResetNextPage(Page)
        /// при переходе на следующую страницу выставляем стартовые параметры для отрезка, в к-ом пересчитываем
        // может произойти в одной из 2-х ситуаций:
        // 1. первый раз пересчитываем формулу => для PageInfo ширины и др . параметры еще не рассчитали
        // 2. произошли изменения на пред страницах, их пересчитали, перешли к следующей => для PageInfo нужно выставить дефолтные настройки для параметров и обнулить массив ширин
        // параметры для ParaMathRPI выставляем дефолтные в любом из этих двух случаев

        // false == this.PageInfo.IsResetNextPage(Page) && true == this.PageInfo.IsFirstLineOnPage(Line, Page)
        // т.е. рассчитываем текущую страницу с первой строки
        // может произойти, если вновь стали (PrevLineObject !== null) пересчитывать формулу на данной странице (из-за того что изменилась макс ширина и нужно заново пересчитать формулу на странице и т.п.)
        // или же произошли какие-то изменения на странице и вызвался пересчет для этой страницы (PrevLineObject == null) и отсутствует быстрый пересчет (PRS.bFastRecalculate == false)

        var bResetNextPage = true == this.PageInfo.IsResetNextPage(Page);
        var bResetPageInfo = PrevLineObject == null && bContinueRecalc == false && PRS.bFastRecalculate == false && true == this.PageInfo.IsFirstLineOnPage(ParaLine, Page);

        if(bResetNextPage == true || bResetPageInfo == true)
        {
            this.ParaMathRPI.Reset(PRS, ParaPr);
            this.PageInfo.Reset_Page(Page);
        }
    }

    PRS.MathNotInline = this.ParaMathRPI.bInline  == false; // если неинлайновая формула, то рассчитываем Ranges по максимальному измерению

    if(this.ParaMathRPI.bInline == false)
    {
        PRS.RestartPageRecalcInfo.Object = this; // т.к. this.ParaMathRPI.bInline == false
        // и чтобы на проверке bResetPageInfo не перебить параметры
    }


    // такая сиуация возможна, если разместили формулу под картинкой и нужно заново пересчитать формулу
    // ддля этого меняем PRS.Y и ждем пока не произойдет private_RecalculateLineCheckRangeY
    // т.к. в противном случае мы можем изменить Ranges на те, что находятся PRS.Y, который был до того как его изменили в данном блоке (возникает из-за того, что ф-ия private_RecalculateLineCheckRanges нах-ся выше ф-ии private_RecalculateLineCheckRangeY)
    if(this.ParaMathRPI.ShiftY - PRS.Y > 0 || PRS.bMathRangeY == true)
    {
        // выполняем перенос здесь для того, чтобы перенести под нужную картинку
        // к примеру, у нас есть нескоолько картинок с выравниванием по контору и картинка с выравниванием top_bottom(она расположена ниже всех остальных картинок) =>
        // нужно сделать перенос под картинку top_bottom и пересчитывать заново формулу
        //
        //this.Set_EmptyRange(PRS);
        PRS.bMathRangeY = true;
        PRS.ForceNewPage = true;
        this.private_UpdateRangeY(PRS, this.ParaMathRPI.ShiftY);
    }
    else
    {
        // такая ситуация возможна  когда пришел пересчет заново и кол-во отрезков выравнивания 0 (либо меньше, чем нужно)
        // при этом если это первый Range данной формулы, то пришел еще Reset, то есть пересчитать придется, при этом не меняем max ширину, т.к. если мы уже пересчитали с учетом Range, она не должна поменяться
        this.Root.Set_Paragraph(Para);
        this.Root.Set_ParaMath(this, null);

        this.PageInfo.UpdateCurrentPage(Page, ParaLine);

        var bRecalcNormal = true;

        if(bCurrentObj == true && this.ParaMathRPI.bInline == false &&  PRS.bFastRecalculate == false) // меняем отрезки обтекания только для случая, когда пересчитываем текущий объект (а не вновь возвращаемся к последнему пересчету)
        {
            var UpdWrap = this.private_UpdateWrapSettings(PRS, ParaPr);

            if(UpdWrap == MATH_UPDWRAP_NEWRANGE)
            {
                // Уберем из массива информацию о рассчитанных ширинах, чтобы не учлась рассчитанная ранее максимальная ширина (в связи с тем, что отрезок, в к-ом нужно расположить, изменился по ширине)
                // выставляем EmptyLine = false, т.к. нужно сделать заново пересчет в новом отрезке (а не перенести формулу под картинку)
                // т.к. инициируем пересчет заново, то в проверку на ParaNewLine : if (true === NotInlineMath && true !== PRS.EmptyLine) не зайдем, т.к. NewRange = true
                this.PageInfo.Reset_Page(Page);
                this.ParaMathRPI.bInternalRanges = true;
                // не выставляем EmtyLine = false, т.к. так и так выйдем из пересчета данной строки при расчете Ranges, до пересчета картинок не дойдем, поэтому PRS.EmptyLine = false  выставлять не нужно
                //PRS.EmptyLine = false;
                this.private_SetRestartRecalcInfo(PRS);
            }
            else if(UpdWrap == MATH_UPDWRAP_UNDERFLOW)
            {
                // пересчитаем PRS.Y на след пересчете при this.ParaMathRPI.ShiftY - PRS.Y > 0
                // в блоке if(this.ParaMathRPI.ShiftY - PRS.Y > 0)
            }

            bRecalcNormal = UpdWrap == MATH_UPDWRAP_NOCHANGES; // пересчитываем всю строку заново, т.к. может получиться так, что добавилась еще одна картинка (+ к уже существующим) и нужно заново выбрать Range, в котором необходимо разместить формулу
        }

        if(bRecalcNormal == true) // пересчет в штатном режиме
        {
            var MathSettings = Get_WordDocumentDefaultMathSettings();

            var DispDef = MathSettings.Get_DispDef(),
                bInline = this.Is_Inline(); // учитываем, если формула внутристроковая или же разбивается плавающим объектом (в этом случае тоже нужно рассчитывать как инлайновую)

            //здесь обновляем WrapState, исходя из этого параметра будем считать WrapIndent
            this.PageInfo.UpdateCurrentWrap(DispDef, bInline);


            // формулы не инлайновая, есть Ranges пересчитываем формулу в макс Range => private_RecalculateRangeInsideInterval
            if(this.ParaMathRPI.IntervalState !== MATH_INTERVAL_EMPTY && this.ParaMathRPI.bInternalRanges == true/*this.ParaMathRPI.bStartRanges == true*/) // картинки в другом параграфе и формула пересчитывается с учетом Ranges
            {
                // X и XEnd не перебиваем выше, т.к. они понадобятся для учета попадания в Range в ф-ии  private_RecalculateRangeInsideInterval
                this.private_RecalculateRangeInsideInterval(PRS, ParaPr, Depth);
            }
            else
            {
                this.private_RecalculateRangeWrap(PRS, ParaPr, Depth);
            }

            this.ParaMathRPI.ClearRecalculate();
        }
    }

    // обновляем LDRecalcInfo здесь, т.к. формула - многострочный мат объект, нельзя каждый раз изменять LDRecalcInfo => иначе для четных/нечетных сток будет чередование ParaMath = this/null
    if (PRS.RecalcResult == recalcresult_PrevLine && (true === LDRecalcInfo.Can_RecalcObject() || true === LDRecalcInfo.Check_ParaMath(this)))
    {
        LDRecalcInfo.Set_ParaMath(this);
    }
    else if(true === LDRecalcInfo.Check_ParaMath(this))
    {
        LDRecalcInfo.Reset();
    }
    else
    {

    }

    if(bCurrentObj == true)
    {
        // этот параметр необходим для пересчета нескольких неинлайновых (и инлайновых формул) внутри одного параграфа,
        // чтобы не перетирать параметры внутри пересчитанных формул (и соответственно избежать зацикливания)
        PRS.bContinueRecalc = true;

        if(PRS.NewRange == false)
        {
            // на случай когда у нас несколько неинлайновых формул в одном параграфе
            PRS.RestartPageRecalcInfo.Object = null;
        }
    }
    else
    {
        PRS.RestartPageRecalcInfo.Object = PrevObject; // возвращаем формулу, которая инициировала пересчет (если это была текущая формула, то null)
    }

};
ParaMath.prototype.private_UpdateWrapSettings = function(PRS)
{
    // запомним PRS.Ranges.Y для смещения, чтобы выставить потом смещение, т.к. возможен случай, что картинка, под которой нужно расположить формулу, будет не первой, которая встретиться, пр первом пересчете, или же будет отсутствовать в текущем пересчете
    // (т.к. надо расположить под картинков), отсюда проще запомнить смещение, чем гонять пересчет до конкретной строки, чтобы private_RecalculateLineCheckRangeY вернула нужное значение

    /// значение this.ParaMathRPI.bInternalRanges может изменить значение после того как будет вызвана данная функция

    var UpdateWrap = MATH_UPDWRAP_NOCHANGES;

    var LngR       = PRS.Ranges.length,
        Ranges     = PRS.Ranges;


    if(LngR > 0)
    {
        this.ParaMathRPI.IntervalState = MATH_INTERVAL_ON_SIDE;

        var  RY_NotWrap   = null;

        for(var Pos = 0; Pos < LngR; Pos++)
        {
            var WrapType = Ranges[Pos].typeLeft;

            if(WrapType !== WRAPPING_TYPE_SQUARE && WrapType !== WRAPPING_TYPE_THROUGH && WrapType !== WRAPPING_TYPE_TIGHT)
            {
                // выберем картинку с max RangeY c учетом данного условия, под которой попробуем расположить формулу
                if(RY_NotWrap == null || RY_NotWrap < Ranges[Pos].Y1)
                {
                    RY_NotWrap = Ranges[Pos].Y1;
                }

                this.ParaMathRPI.IntervalState = MATH_INTERVAL_EMPTY;
            }
        }

        if(this.ParaMathRPI.IntervalState == MATH_INTERVAL_ON_SIDE) // WrapType == WRAPPING_TYPE_SQUARE || WrapType == WRAPPING_TYPE_THROUGH || WrapType == WRAPPING_TYPE_TIGHT
        {
            // вычтем здесь Ind.Left для корректного сравнения (т.к.стартовый отрезок = граница Range + Ind.Left ), а также если XStart окажется левой границей (прибаится лишний Ind.Left)
            var XRange = this.ParaMathRPI.XRange - this.ParaMathRPI.IndLeft,
                XLimit = this.ParaMathRPI.XLimit;

            // рассчитываем XStart, XEnd
            var XStart = XRange,
                XEnd   = Ranges[0].X0;

            for(var Pos = 0; Pos < LngR - 1; Pos++)
            {
                if(XEnd - XStart < Ranges[Pos+1].X0 - Ranges[Pos].X1)
                {
                    XStart = Ranges[Pos].X1;
                    XEnd   = Ranges[Pos+1].X0;
                }
            }

            if(XEnd - XStart < XLimit - Ranges[LngR - 1].X1)
            {
                XStart = Ranges[LngR - 1].X1;
                XEnd   = XLimit;
            }

            // учтем Ind.Left
            // если впоследствии Ind.Left в word не будет учитываться, то нужно пересмотреть схему => в каких случаях и с какими параметрами рассчитыывать в Range

            XStart += this.ParaMathRPI.IndLeft;


            // в конце сравним с текущим отрезком, т.к. может произойти например след ситуация :
            // 2 плавающих объекта находятся в различных строках +> PRS.Ranges.length <=1
            // при этом формула должна расположится в макс по ширине из отрезков, образованными обоими плавающими мат объектами

            // учтем предыдущие отрезки:
            if(this.ParaMathRPI.XStart > XStart)
            {
                XStart = this.ParaMathRPI.XStart;
            }

            if(this.ParaMathRPI.XEnd < XEnd)
            {
                XEnd = this.ParaMathRPI.XEnd;
            }

            // рассчитываем RangeY

            var RangeY = Ranges[0].Y1;

            for(var Pos = 1; Pos < Ranges.length; Pos++)
            {
                if(Ranges[Pos].Y1 < RangeY)
                    RangeY = Ranges[Pos].Y1;
            }

            if(this.ParaMathRPI.RangeY == null || RangeY < this.ParaMathRPI.RangeY)
            {
                this.ParaMathRPI.RangeY = RangeY;
            }


            var DiffXStart = Math.abs(this.ParaMathRPI.XStart - XStart),
                DiffXEnd   = Math.abs(this.ParaMathRPI.XEnd - XEnd);

            if(DiffXStart > 0.001 || DiffXEnd > 0.001)
            {
                this.ParaMathRPI.XStart     = XStart;
                this.ParaMathRPI.XEnd       = XEnd;

                UpdateWrap = MATH_UPDWRAP_NEWRANGE;
            }
        }
        else
        {
            // если появился плавающий объект, относительно которого нельзя разместить формулу (в одном из Range, образованным плавающими объектами), то, соответсвенно, формула должна располагаться под плавающим объектом

            this.private_SetShiftY(PRS, RY_NotWrap);
            UpdateWrap = MATH_UPDWRAP_UNDERFLOW;
        }

    }

    return UpdateWrap;
};
ParaMath.prototype.private_RecalculateRangeInsideInterval = function(PRS, ParaPr, Depth)
{
    // var bInsideRange = PRS.X - 0.001 < this.ParaMathRPI.XStart && this.ParaMathRPI.XEnd < PRS.XEnd + 0.001;
    // наложим менее строгие условия попадания в отрезок
    var bNotInsideRange = this.ParaMathRPI.XStart > PRS.XEnd || this.ParaMathRPI.XEnd < PRS.X;
    var bNextRangeSide   = this.ParaMathRPI.IntervalState == MATH_INTERVAL_ON_SIDE && bNotInsideRange == true; // пересчитываем только в том отрезке, в котором находится формула

    // Номер  Range не влияет на UpdateWrapSettings, т.к. картинки могут располагаться одна под другой, и в одной ситуации это будет 0-ой Range,  в другой 1-ый

    if(bNextRangeSide) // при пересчете формулы между картинками/сбоку от картинки рассчитываем формулу в самом большом Range, остальные делаем пустыми
    {
        // переход к следующему Range
        this.Set_EmptyRange(PRS);
    }
    else
    {
        PRS.X = this.ParaMathRPI.XStart;
        PRS.XEnd = this.ParaMathRPI.XEnd;

        this.private_UpdateXLimits(PRS);

        this.private_RecalculateRoot(PRS, ParaPr, Depth);


        if(PRS.bMathWordLarge == true)
        {
            this.private_SetShiftY(PRS, this.ParaMathRPI.RangeY);
        }
        else if(PRS.NewRange == false && PRS.EmptyLine == true) // формула пересчиталась корректно, располагаем в данной строке => не разбивается на слова, выставим EmptyLine = false, чтобы не перенесли под картинку
        {
            PRS.EmptyLine = false;
        }

        PRS.RestartPageRecalcInfo.Object = this;

        if(PRS.NewRange == true && PRS.RecalcResult !== recalcresult_PrevLine)
            PRS.ForceNewLine = true;
    }
};
ParaMath.prototype.private_RecalculateRangeWrap = function(PRS, ParaPr, Depth)
{
    // попадем сюда только, когда  либо нет плавающих объектов, привязанных к другому параграфу, нежели формула
    // либо когда не получилось расположить формулу в Range и формула пересчитывается обычным образом

    var PrevLineObject = PRS.RestartPageRecalcInfo.Object;

    if(PrevLineObject == null ||  PrevLineObject == this)
    {
        PRS.RecalcResult = recalcresult_NextLine;
        //PRS.Reset_RestartPageRecalcInfo();
        // не вызываем функцию Reset_RestartPageRecalcInfo, т.к. в данной функции учитывается флаг, что начали пересчитывать заново
        PRS.RestartPageRecalcInfo.Line   = 0;
        // выставляем только для инлайновых формул => может случится так, что в одном параграфе окажутся несколько формул и для того, чтобы при первом пересчете пересчитались настройки нужно возвращать null
        // при последующих пересчетах PRS.RestartPageRecalcInfo.Object будет выставлен null на Reset_RestartPageRecalcInfo в ф-ии private_RecalculatePage

        PRS.RestartPageRecalcInfo.Object = this.ParaMathRPI.bInline ? null : this;
    }

    if(this.ParaMathRPI.bInline == false)  // здесь перебивается для неинлайновых формул и отступ первой строки и тот случай, когда формула не пересекает область расположения картинки (FlowBounds), но тем неменее пришли
    {
        PRS.X = this.ParaMathRPI.XStart;
        PRS.XEnd = this.ParaMathRPI.XEnd;
    }

    this.private_UpdateXLimits(PRS);

    var bStartRange    = this.Root.IsStartRange(PRS.Line, PRS.Range);
    var bNotBrPosInLWord = this.ParaMathRPI.bInline == true && bStartRange == true && PRS.Ranges.length > 0 && PRS.Word == true;
    PRS.bBreakPosInLWord = bNotBrPosInLWord == false;  //не обновляем для инлайновой формулы, когда WordLarge (слово вышло за границы Range), перед формулой есть еще текст, чтобы не перебить LineBreakPos и выставить разбиение по тем меткам, которые были до пересчета формулы

    var bEmptyLine = PRS.EmptyLine;

    this.private_RecalculateRoot(PRS, ParaPr, Depth);

    var WrapState = this.PageInfo.GetCurrentWrapState();
    var bWordLarge =  PRS.bMathWordLarge == true && WrapState == ALIGN_EMPTY;
    this.PageInfo.SetStateWordLarge(PRS.Line, bWordLarge);

    if(PRS.bMathWordLarge == true)
    {
        if(WrapState !== ALIGN_EMPTY)
        {
            this.private_SetRestartRecalcInfo(PRS);
            this.PageInfo.SetNextWrapState();
        }
        else if(this.ParaMathRPI.bInline == true && PRS.Ranges.length > 0)
        {
            if(PRS.bBreakPosInLWord == true) // когда для инлайновой формулы WordLarge (слово вышло за границы Range), перед формулой есть еще текст, чтобы не перебить LineBreakPos и выставить разбиение по тем меткам, которые были до пересчета формулы
            {
                PRS.EmptyLine = bEmptyLine; // вернем пред знач-е
                this.Root.Math_Set_EmptyRange(PRS.Line, PRS.Range);
                PRS.bMathWordLarge = false;
                PRS.NewRange = true;
                PRS.MoveToLBP = false;
            }
            else
            {
                //не обновляем для инлайновой формулы, когда WordLarge, перед формулой есть еще текст, чтобы не перебить LineBreakPos и выставить по тем меткам, которые были до формулы разбиение
                PRS.MoveToLBP = true;
            }
        }
    }
};
ParaMath.prototype.private_RecalculateRoot = function(PRS, ParaPr, Depth)
{
    var Para      = PRS.Paragraph;
    var ParaLine  = PRS.Line;
    var ParaRange = PRS.Range;

    // заглушка для пересчета Gaps элементов в текущей строке
    // если быстрый пересчет проверим нужно ли пересчитывать gaps у элементов текущей строки
    if(PRS.bFastRecalculate == true)
    {
        this.Root.Math_UpdateGaps(ParaLine, ParaRange);
    }

    this.Root.Recalculate_Range(PRS, ParaPr, Depth);

    if(PRS.NewRange == false)
    {
        // обнуляем GapRight для операторов
        PRS.OperGapRight       = 0;

        var WidthLine = PRS.X - PRS.XRange + PRS.SpaceLen + PRS.WordLen;

        var bFirstItem =  PRS.FirstItemOnLine == true && true === Para.Internal_Check_Ranges(ParaLine, ParaRange);
        if(bFirstItem && PRS.X + PRS.SpaceLen + PRS.WordLen > PRS.XEnd)
        {
            PRS.bMathWordLarge = true;
        }

        this.UpdateWidthLine(PRS, WidthLine);
    }
};
ParaMath.prototype.private_SetRestartRecalcInfo = function(PRS)
{
    var Page = this.AbsolutePage + PRS.Page;
    var Line = this.PageInfo.GetFirstLineOnPage(Page);
    PRS.Set_RestartPageRecalcInfo(Line, this);
    PRS.RecalcResult = recalcresult_PrevLine;
    PRS.NewRange = true;
};
ParaMath.prototype.Set_EmptyRange = function(PRS)
{
    // не выставляем PRS.EmptyLine = false, чтобы корректно не произошел перенос на след строку для ParaNewLine (PRS.EmptyLine == false && bInline == false)

    this.Root.Math_Set_EmptyRange(PRS.Line, PRS.Range);

    PRS.RecalcResult = recalcresult_NextLine;
    PRS.RestartPageRecalcInfo.Object = this;

    PRS.NewRange = true;
};
ParaMath.prototype.private_UpdateRangeY = function(PRS, RY)
{
    if (Math.abs(RY - PRS.Y) < 0.001)
        PRS.Y = RY + 1; // смещаемся по 1мм
    else
        PRS.Y = RY + 0.001; // Добавляем 0.001, чтобы избавиться от погрешности


    PRS.NewRange = true;
};
ParaMath.prototype.private_SetShiftY = function(PRS, RY)
{
    this.PageInfo.SetNeedUpdateWrap();
    this.ParaMathRPI.UpdateShiftY(RY);
    this.ParaMathRPI.Reset_WrapSettings();
    this.private_SetRestartRecalcInfo(PRS);
};
ParaMath.prototype.private_UpdateXLimits = function(PRS)
{
    var MathSettings = Get_WordDocumentDefaultMathSettings();

    var WrapState = this.PageInfo.GetCurrentWrapState();

    PRS.X    += MathSettings.Get_LeftMargin(WrapState);
    PRS.XEnd -= MathSettings.Get_RightMargin(WrapState);


    PRS.WrapIndent = MathSettings.Get_WrapIndent(WrapState);
    PRS.bPriorityOper = this.ParaMathRPI.bInline == false;

    var bFirstLine = this.Root.IsStartLine(PRS.Line);
    PRS.bFirstLine = bFirstLine;

    if(bFirstLine == false && true == MathSettings.IsWrap(WrapState))
    {
        PRS.X += this.Root.Get_WrapToLine(PRS.Line, PRS.Range, PRS.WrapIndent);
    }

    PRS.XRange = PRS.X;
};
ParaMath.prototype.Save_MathInfo = function(Copy)
{
    var RecalculateObject = new CMathRecalculateObject();

    var StructRecalc =
    {
        bFastRecalculate:   this.bFastRecalculate,
        PageInfo:           this.PageInfo,
        bInline:            this.ParaMathRPI.bInline,
        Align:              this.Get_Align(),
        bEmptyFirstRange:   this.Root.Is_EmptyRange(this.Root.StartLine, this.Root.StartRange)
    };

    RecalculateObject.Fill(StructRecalc);

    return RecalculateObject;
};
ParaMath.prototype.Load_MathInfo = function(RecalculateObject)
{
    RecalculateObject.Load_MathInfo(this.PageInfo);
};
ParaMath.prototype.CompareMathInfo = function(RecalculateObject)
{
    return RecalculateObject.Compare(this.PageInfo);
};
ParaMath.prototype.Recalculate_Reset = function(CurRange, CurLine, RecalcResult)
{
    this.Root.Recalculate_Reset(CurRange, CurLine); // обновим StartLine и StartRange только для Root (в CParagraphContentWithContentBase), для внутренних элементов обновится на Recalculate_Range
};
ParaMath.prototype.Recalculate_Set_RangeEndPos = function(PRS, PRP, Depth)
{
    this.Root.Recalculate_Set_RangeEndPos(PRS, PRP, Depth);
};
ParaMath.prototype.Recalculate_LineMetrics = function(PRS, ParaPr, _CurLine, _CurRange)
{
    var ContentMetrics = new CMathBoundsMeasures();

    // обновляем LineAscent и LineDescent для пересчета инлайновой формулы с картинкой
    // если в формуле находится картинка, то может так получится, что в отрезках обтекания не будет ни одного элемента => PRS.Ascent и PRS.Descent равны 0
    // далее при вычилении отрезков (PRS.Ranges) для следующей строки  учитываются PRS.Ascent и PRS.Descent предыдщей строки, а они будут равны 0 , соответственно получим те же самые отрезки обтекания, что и в предыдущей строке
    // произойдет зацикливание

    this.Root.Recalculate_LineMetrics(PRS, ParaPr, _CurLine, _CurRange, ContentMetrics);

    var RootAscent  = this.Root.GetAscent(_CurLine, _CurRange),
        RootDescent = this.Root.GetDescent(_CurLine, _CurRange);


    if(PRS.LineAscent < RootAscent)
        PRS.LineAscent = RootAscent;

    if(PRS.LineDescent < RootDescent)
        PRS.LineDescent = RootDescent;

};
ParaMath.prototype.Recalculate_Range_Width = function(PRSC, _CurLine, _CurRange)
{
    var SpaceLen   = PRSC.SpaceLen;

    var bBrkBefore = this.Is_BrkBinBefore();

    var bGapLeft  = bBrkBefore == true,
        bGapRight = bBrkBefore == false;

    this.Root.UpdateOperators(_CurLine, _CurRange, bGapLeft, bGapRight);

    this.Root.Recalculate_Range_Width(PRSC, _CurLine, _CurRange);

    PRSC.Range.W        += PRSC.SpaceLen - SpaceLen;
    PRSC.Range.SpaceLen = SpaceLen;

    PRSC.Words++;
};
ParaMath.prototype.UpdateWidthLine = function(PRS, Width)
{
    var PrevRecalcObject = PRS.RestartPageRecalcInfo.Object;

    if(PrevRecalcObject == null || PrevRecalcObject == this)
    {
        var MathSettings = Get_WordDocumentDefaultMathSettings(),
            Page = this.AbsolutePage + PRS.Page;

        var WrapState = this.PageInfo.GetWrapStateOnPage(Page), // если впоследствии State будет изменен, то пересчитаем с первой строки текущей страницы
            WrapIndent = MathSettings.Get_WrapIndent(WrapState);

        var wrap = PRS.Page == 0 ? this.Root.Get_WrapToLine(PRS.Line, PRS.Range, WrapIndent) : 0;
        var W = Width - PRS.OperGapRight - PRS.OperGapLeft + wrap;

        var bChangeMaxW = this.PageInfo.UpdateCurrentWidth(PRS.Line, W);

        if(bChangeMaxW == true && this.Is_Inline() == false && align_Justify == this.Get_Align())
        {
            var Line = this.PageInfo.GetFirstLineOnPage(Page);
            PRS.Set_RestartPageRecalcInfo(Line, this);
            PRS.RecalcResult = recalcresult_PrevLine;
            PRS.NewRange = true;
        }
    }
};
ParaMath.prototype.Recalculate_Range_Spaces = function(PRSA, _CurLine, _CurRange, _CurPage)
{
    // до пересчета Bounds для текущей строки ранее должны быть вызваны Recalculate_Range_Width (для ширины), Recalculate_LineMetrics(для высоты и аскента)

    //var Page = 0;
    //if ( this.Paragraph !== null)
        //Page = this.Paragraph.Get_StartPage_Absolute();

    // для инлайновой формулы не вызывается ф-ия setPosition, поэтому необходимо вызвать здесь
    // для неилайновой setPosition вызывается на Get_AlignToLine

    var PosInfo = new CMathPosInfo();

    PosInfo.CurLine  = _CurLine;
    PosInfo.CurRange = _CurRange;

    var pos   = new CMathPosition();
    this.Root.setPosition(pos, PosInfo);

    // страиницу для смещния параграфа относительно документа добавим на Get_Bounds, т.к. если формула находится в автофигуре, то для нее не прийдет Recalculate_Range_Spaces при перемещении автофигуры а другую страницу

    this.Root.UpdateBoundsPosInfo(PRSA, _CurLine, _CurRange, _CurPage);

    this.Root.Recalculate_Range_Spaces(PRSA, _CurLine, _CurRange, _CurPage);
};
ParaMath.prototype.Recalculate_PageEndInfo = function(PRSI, _CurLine, _CurRange)
{

};
ParaMath.prototype.Save_RecalculateObject = function(Copy)
{
    var RecalcObj = this.Root.Save_RecalculateObject(Copy);
    RecalcObj.Save_MathInfo(this, Copy);

    return RecalcObj;
};
ParaMath.prototype.Load_RecalculateObject = function(RecalcObj)
{
    RecalcObj.Load_MathInfo(this);
    this.Root.Load_RecalculateObject(RecalcObj);
};
ParaMath.prototype.Prepare_RecalculateObject = function()
{
    this.Root.Prepare_RecalculateObject();
};
ParaMath.prototype.Is_EmptyRange = function(_CurLine, _CurRange)
{
    return this.Root.Is_EmptyRange(_CurLine, _CurRange);
};
ParaMath.prototype.Check_Range_OnlyMath = function(Checker, CurRange, CurLine)
{
    if (null !== Checker.Math)
    {
        Checker.Math   = null;
        Checker.Result = false;
    }
    else
        Checker.Math = this;
};

ParaMath.prototype.Check_MathPara = function(Checker)
{
    Checker.Found  = true;
    Checker.Result = false;
};

ParaMath.prototype.Check_PageBreak = function()
{
    return false;
};

ParaMath.prototype.Check_BreakPageEnd = function(PBChecker)
{
    return false;
};
ParaMath.prototype.Get_ParaPosByContentPos = function(ContentPos, Depth)
{
    return this.Root.Get_ParaPosByContentPos(ContentPos, Depth);
};

ParaMath.prototype.Recalculate_CurPos = function(_X, Y, CurrentRun, _CurRange, _CurLine, _CurPage, UpdateCurPos, UpdateTarget, ReturnTarget)
{
    return this.Root.Recalculate_CurPos(_X, Y, CurrentRun, _CurRange, _CurLine, _CurPage, UpdateCurPos, UpdateTarget, ReturnTarget);
};

ParaMath.prototype.Refresh_RecalcData = function(Data)
{
    this.Paragraph.Refresh_RecalcData2(0);
};

ParaMath.prototype.Refresh_RecalcData2 = function(Data)
{
    this.Paragraph.Refresh_RecalcData2(0);
};

ParaMath.prototype.Recalculate_MinMaxContentWidth = function(MinMax)
{
    var RPI = new CRPI();
    RPI.MergeMathInfo(this.ParaMathRPI);
    var ArgSize = new CMathArgSize();

    this.Root.PreRecalc(null, this, ArgSize, RPI);
    this.Root.Recalculate_MinMaxContentWidth(MinMax);
};

ParaMath.prototype.Get_Range_VisibleWidth = function(RangeW, _CurLine, _CurRange)
{
    this.Root.Get_Range_VisibleWidth(RangeW, _CurLine, _CurRange);
};
ParaMath.prototype.Is_BrkBinBefore = function()
{
    var MathSettings = Get_WordDocumentDefaultMathSettings();

    return this.Is_Inline() ? false : MathSettings.Get_BrkBin() == BREAK_BEFORE;
};
ParaMath.prototype.Shift_Range = function(Dx, Dy, _CurLine, _CurRange)
{
    this.Root.Shift_Range(Dx, Dy, _CurLine, _CurRange);
    var CurrentAbsolutePage = this.Paragraph.Get_StartPage_Absolute();

    if(this.Paragraph !== null && this.AbsolutePage !== CurrentAbsolutePage)
    {
        this.Root.ShiftPage(CurrentAbsolutePage - this.AbsolutePage);
        this.AbsolutePage = CurrentAbsolutePage;
    }
};
//-----------------------------------------------------------------------------------
// Функция для работы с формулой
// в тч с  дефолтными текстовыми настройками и argSize
//-----------------------------------------------------------------------------------
ParaMath.prototype.Set_Inline = function(value)
{
    if(value !== this.ParaMathRPI.bInline)
    {
        this.ParaMathRPI.bChangeInline = true;
        this.ParaMathRPI.bInline = value;
        this.bFastRecalculate = false;          // после смены инлайновости, требуется полностью пересчитать формулу
    }
};
ParaMath.prototype.Get_Inline = function()
{
    return this.ParaMathRPI.bInline;
};
ParaMath.prototype.Is_Inline = function()
{
    return this.ParaMathRPI.bInline == true /*|| (this.ParaMathRPI.bInternalRanges == true && this.ParaMathRPI.bStartRanges == false)*/;
};
ParaMath.prototype.NeedDispOperators = function(Line)
{
    return false === this.Is_Inline() &&  true == this.Root.IsStartLine(Line);
};
ParaMath.prototype.Get_Align = function()
{
    var Jc;
    if(this.ParaMathRPI.bInline)
    {
        var ParaPr = this.Paragraph.Get_CompiledPr2(false).ParaPr;
        Jc = ParaPr.Jc;
    }
    else if (undefined !== this.Jc)
    {
        Jc = this.Jc;
    }
    else
    {
        var MathSettings = Get_WordDocumentDefaultMathSettings();

        Jc = MathSettings.Get_DefJc();
    }

    return Jc;
};
ParaMath.prototype.Set_Align = function(Align)
{
    if (this.Jc !== Align)
    {
        History.Add(this, new CChangesMathParaJc(Align, this.Jc));
        this.raw_SetAlign(Align);
    }
};
ParaMath.prototype.raw_SetAlign = function(Align)
{
    this.Jc = Align;
};
ParaMath.prototype.SetRecalcCtrPrp = function(Class)
{
    if(this.Root.Content.length > 0 && this.ParaMathRPI.bRecalcCtrPrp == false)
    {
        this.ParaMathRPI.bRecalcCtrPrp = this.Root.Content[0] == Class;
    }
};
ParaMath.prototype.MathToImageConverter = function(bCopy, _canvasInput, _widthPx, _heightPx, raster_koef)
{
    var bTurnOnId = false;
    if (false === g_oTableId.m_bTurnOff)
    {
        g_oTableId.m_bTurnOff = true;
        bTurnOnId = true;
    }

	History.TurnOff();

    var oldDefTabStop = Default_Tab_Stop;
    Default_Tab_Stop = 1;

    var hdr = new CHeaderFooter(editor.WordControl.m_oLogicDocument.HdrFtr, editor.WordControl.m_oLogicDocument, editor.WordControl.m_oDrawingDocument, hdrftr_Header);
    var _dc = hdr.Content;

    var par = new Paragraph(editor.WordControl.m_oDrawingDocument, _dc, 0, 0, 0, 0, false);

    if (bCopy)
        par.Internal_Content_Add(0, this.Copy(false), false);
    else
        par.Internal_Content_Add(0, this, false);

    _dc.Internal_Content_Add(0, par, false);

    par.Set_Align(align_Left);
    par.Set_Tabs(new CParaTabs());

    var _ind = new CParaInd();
    _ind.FirstLine = 0;
    _ind.Left = 0;
    _ind.Right = 0;
    par.Set_Ind(_ind, false);

    var _sp = new CParaSpacing();
    _sp.Line              = 1;
    _sp.LineRule          = linerule_Auto;
    _sp.Before            = 0;
    _sp.BeforeAutoSpacing = false;
    _sp.After             = 0;
    _sp.AfterAutoSpacing  = false;
    par.Set_Spacing(_sp, false);

    _dc.Reset(0, 0, 10000, 10000);
    _dc.Recalculate_Page(0, true);

    _dc.Reset(0, 0, par.Lines[0].Ranges[0].W + 0.001, 10000);
    _dc.Recalculate_Page(0, true);

    Default_Tab_Stop = oldDefTabStop;

    if (true === bTurnOnId)
        g_oTableId.m_bTurnOff = false;

    History.TurnOn();

    window.IsShapeToImageConverter = true;

    var dKoef = g_dKoef_mm_to_pix;
    var w_mm = this.Width;
    var h_mm = this.Height;
    var w_px = (w_mm * dKoef) >> 0;
    var h_px = (h_mm * dKoef) >> 0;

    if (undefined !== raster_koef)
    {
        w_px *= raster_koef;
        h_px *= raster_koef;

        if (undefined !== _widthPx)
            _widthPx *= raster_koef;
        if (undefined !== _heightPx)
            _heightPx *= raster_koef;
    }

    var _canvas = (_canvasInput === undefined) ? document.createElement('canvas') : _canvasInput;

    _canvas.width   = (undefined == _widthPx) ? w_px : _widthPx;
    _canvas.height  = (undefined == _heightPx) ? h_px : _heightPx;

    var _ctx = _canvas.getContext('2d');

    var g = new CGraphics();
    g.init(_ctx, w_px, h_px, w_mm, h_mm);
    g.m_oFontManager = g_fontManager;

    g.m_oCoordTransform.tx = 0;
    g.m_oCoordTransform.ty = 0;

    if (_widthPx !== undefined && _heightPx !== undefined)
    {
        g.m_oCoordTransform.tx = (_widthPx - w_px) / 2;
        g.m_oCoordTransform.ty = (_heightPx - h_px) / 2;
    }

    g.transform(1,0,0,1,0,0);

    par.Draw(0, g);

    window.IsShapeToImageConverter = false;

    if (undefined === _canvasInput)
    {
        var _ret = { ImageNative: _canvas, ImageUrl: "" };
        try
        {
            _ret.ImageUrl = _canvas.toDataURL("image/png");
        }
        catch (err)
        {
            _ret.ImageUrl = "";
        }
        return _ret;
    }
    return null;
};
ParaMath.prototype.Get_FirstTextPr = function()
{
    return this.Root.Get_FirstTextPr();
};
ParaMath.prototype.GetFirstRPrp = function()
{
    return this.Root.getFirstRPrp();
};
ParaMath.prototype.GetShiftCenter = function(oMeasure, font)
{
    oMeasure.SetFont(font);
    var metrics = oMeasure.Measure2Code(0x2217); // "+"

    return 0.6*metrics.Height;
};
ParaMath.prototype.GetPlh = function(oMeasure, font)
{
    oMeasure.SetFont(font);

    return oMeasure.Measure2Code(0x2B1A).Height;
};
ParaMath.prototype.GetA = function(oMeasure, font)
{
    oMeasure.SetFont(font);

    return oMeasure.Measure2Code(0x61).Height;
};

ParaMath.prototype.SetMathProperties = function(props)
{
    //*****  FOR FORMULA  *****//

    // В документации везде, где нет примера использования свояства, означает, что Word не поддерживает это свойство !

    if(props.naryLim == NARY_UndOvr || props.naryLim  == NARY_SubSup)
        this.MathPr.naryLim = props.naryLim;

    if(props.intLim == NARY_UndOvr || props.intLim  == NARY_SubSup)
        this.MathPr.intLim = props.intLim;

    if(props.brkBin == BREAK_BEFORE || props.brkBin == BREAK_AFTER || props.brkBin == BREAK_REPEAT)
        this.MathPr.brkBin = props.brkBin;

    // for minus operator
    // when brkBin is set to repeat
    if(props.brkSubBin == BREAK_MIN_MIN || props.brkSubBin == BREAK_PLUS_MIN || props.brkSubBin == BREAK_MIN_PLUS)
        this.MathPr.brkSubBin = props.brkSubBin;

    // в случае если smallFrac = true,
    if(props.smallFrac == true || props.smallFrac == false)
        this.MathPr.smallFrac = props.smallFrac;

    if(props.wrapIndent + 0 == props.wrapIndent && isNaN(props.wrapIndent)) // проверка на число
        this.MathPr.wrapIndent = props.wrapIndent/1440;

    //********  check for element 0x1FFD - 0xA721  *******//
    // This element specifies the right justification of the wrapped line of an instance of mathematical text
    // Instance : Arrows 0x2190-0x21B3, 0x21B6, 0x21B7, 0x21BA-0x21E9, 0x21F4-0x21FF,
    // 0x3D, 0x2234 - 0x2237, 0x2239, 0x223B - 0x228B, 0x228F - 0x2292, 0x22A2 - 0x22B9,
    // 0x22C8-0x22CD, 0x22D0, 0x22D1, 0x22D5 - 0x22EE,0x22F0-0x22FF, 0x27F0 - 0x297F (arrows and fishes), 0x29CE - 0x29D5
    // 0x2A66 - 0x2AF0 (equals), 0x2AF2-0x2AF3, 0x2AF7 - 0x2AFA


    if(props.wrapRight == true || props.wrapRight == false)
        this.MathPr.wrapRight = props.wrapRight;


    //*****  FOR DOCUMENT  *****//

    // defaultJc
    // выравнивание формулы в документе

    this.MathPr.defJc = props.defJc;

    // dispDef
    // свойство: применять/ не применять paragraph settings (в тч defaultJc)

    this.MathPr.dispDef = props.dispDef;

    // added to paragraph settings for margins
    // rMargin
    // lMargin

    this.MathPr.lMargin = props.lMargin;
    this.MathPr.rMargin = props.rMargin;

    //*****  НЕПОДДЕРЖИВАЕМЫЕ Вордом свойства  *****//

    // mathFont: в качестве font поддерживается только Cambria Math
    // остальные шрифты  возможно будут поддержаны MS в будущем

    this.MathPr.mathFont = props.mathFont;

    // Default font for math zones
    // Gives a drop-down list of math fonts that can be used as the default math font to be used in the document.
    // Currently only Cambria Math has thorough math support, but others such as the STIX fonts are coming soon.

    // http://blogs.msdn.com/b/murrays/archive/2008/10/27/default-document-math-properties.aspx


    //*****  FOR FORMULA  *****//

    // http://msdn.microsoft.com/en-us/library/ff529906(v=office.12).aspx
    // Word ignores the interSp attribute and fails to write it back out.
    this.MathPr.interSp = props.interSp;

    // http://msdn.microsoft.com/en-us/library/ff529301(v=office.12).aspx
    // Word does not implement this feature and does not write the intraSp element.
    this.MathPr.intraSp = intraSp;

    //*****  FOR DOCUMENT  *****//

    // http://msdn.microsoft.com/en-us/library/ff533406(v=office.12).aspx
    // Word ignores and discards postSp
    this.MathPr.postSp = props.postSp;
    this.MathPr.preSp = props.preSp;

    // RichEdit Hot Keys
    // http://blogs.msdn.com/b/murrays/archive/2013/10/30/richedit-hot-keys.aspx

};

ParaMath.prototype.GetMathPr = function()
{
    return this.MathPr;
};

ParaMath.prototype.Get_Default_TPrp = function()
{
    return this.DefaultTextPr;
};
//-----------------------------------------------------------------------------------
// Функции отрисовки
//-----------------------------------------------------------------------------------
ParaMath.prototype.Draw_HighLights = function(PDSH)
{
    if(false == this.Root.IsEmptyRange(PDSH.Line, PDSH.Range))
    {
        var X  = PDSH.X;
        var Y0 = PDSH.Y0;
        var Y1 = PDSH.Y1;

        var Comm = PDSH.Save_Comm();
        var Coll = PDSH.Save_Coll();

        this.Root.Draw_HighLights(PDSH, false);

        var CommFirst = PDSH.Comm.Get_Next();
        var CollFirst = PDSH.Coll.Get_Next();

        PDSH.Load_Comm(Comm);
        PDSH.Load_Coll(Coll);

        if (null !== CommFirst)
        {
            var CommentsCount = PDSH.Comments.length;
            var CommentId     = ( CommentsCount > 0 ? PDSH.Comments[CommentsCount - 1] : null );
            var CommentsFlag  = PDSH.CommentsFlag;

            var Bounds = this.Root.Get_LineBound(PDSH.Line, PDSH.Range);
            Comm.Add(Bounds.Y, Bounds.Y + Bounds.H, Bounds.X, Bounds.X + Bounds.W, 0, 0, 0, 0, { Active : CommentsFlag === comments_ActiveComment ? true : false, CommentId : CommentId } );
        }

        if (null !== CollFirst)
        {
            var Bounds = this.Root.Get_LineBound(PDSH.Line, PDSH.Range);
            Coll.Add(Bounds.Y, Bounds.Y + Bounds.H, Bounds.X, Bounds.X + Bounds.W, 0, CollFirst.r, CollFirst.g, CollFirst.b);
        }

        PDSH.Y0 = Y0;
        PDSH.Y1 = Y1;
    }
};
ParaMath.prototype.Draw_Elements = function(PDSE)
{
    /*PDSE.Graphics.p_color(255,0,0, 255);
     PDSE.Graphics.drawHorLine(0, PDSE.Y - this.Ascent, PDSE.X - 30, PDSE.X + this.Width + 30 , 1);*/

    var X = PDSE.X;

    this.Root.Draw_Elements(PDSE);

    PDSE.X = X + this.Root.GetWidth(PDSE.Line, PDSE.Range);

    /*PDSE.Graphics.p_color(255,0,0, 255);
     PDSE.Graphics.drawHorLine(0, PDSE.Y - this.Ascent + this.Height, PDSE.X - 30, PDSE.X + this.Width + 30 , 1);*/
};
ParaMath.prototype.GetLinePosition = function(Line, Range)
{
    return this.Root.GetPos(Line, Range);
};
ParaMath.prototype.Draw_Lines = function(PDSL)
{
    if(false == this.Root.IsEmptyRange(PDSL.Line, PDSL.Range))
    {
        // Underline всей формулы
        var FirstRPrp = this.GetFirstRPrp();

        var Para = PDSL.Paragraph;

        var aUnderline  = PDSL.Underline;

        var X          = PDSL.X;
        var Y          = PDSL.Baseline;
        var UndOff     = PDSL.UnderlineOffset;
        var UnderlineY = Y + UndOff;
        var LineW      = (FirstRPrp.FontSize / 18) * g_dKoef_pt_to_mm;


        var BgColor = PDSL.BgColor;
        if ( undefined !== FirstRPrp.Shd && shd_Nil !== FirstRPrp.Shd.Value )
            BgColor = FirstRPrp.Shd.Get_Color( Para );
        var AutoColor = ( undefined != BgColor && false === BgColor.Check_BlackAutoColor() ? new CDocumentColor( 255, 255, 255, false ) : new CDocumentColor( 0, 0, 0, false ) );
        var CurColor, RGBA, Theme = this.Paragraph.Get_Theme(), ColorMap = this.Paragraph.Get_ColorMap();

        // Выставляем цвет обводки
        if ( true === PDSL.VisitedHyperlink && ( undefined === FirstRPrp.Color && undefined === FirstRPrp.Unifill ) )
            CurColor = new CDocumentColor( 128, 0, 151 );
        else if ( true === FirstRPrp.Color.Auto && !FirstRPrp.Unifill)
            CurColor = new CDocumentColor( AutoColor.r, AutoColor.g, AutoColor.b );
        else
        {
            if(FirstRPrp.Unifill)
            {
                FirstRPrp.Unifill.check(Theme, ColorMap);
                RGBA = FirstRPrp.Unifill.getRGBAColor();
                CurColor = new CDocumentColor( RGBA.R, RGBA.G, RGBA.B );
            }
            else
            {
                CurColor = new CDocumentColor( FirstRPrp.Color.r, FirstRPrp.Color.g, FirstRPrp.Color.b );
            }
        }

        var Bound = this.Root.Get_LineBound(PDSL.Line, PDSL.Range),
            Width = Bound.W;

        if ( true === FirstRPrp.Underline )
            aUnderline.Add( UnderlineY, UnderlineY, X, X + Width, LineW, CurColor.r, CurColor.g, CurColor.b );


        this.Root.Draw_Lines(PDSL);

        PDSL.X = Bound.X + Width;
    }
};

//-----------------------------------------------------------------------------------
// Функции для работы с курсором
//-----------------------------------------------------------------------------------
ParaMath.prototype.Is_CursorPlaceable = function()
{
    return true;
};

ParaMath.prototype.Cursor_Is_Start = function()
{
    // TODO: ParaMath.Cursor_Is_Start

    return this.Root.Cursor_Is_Start();
};

ParaMath.prototype.Cursor_Is_NeededCorrectPos = function()
{
    return false;
};

ParaMath.prototype.Cursor_Is_End = function()
{
    // TODO: ParaMath.Cursor_Is_End

    return this.Root.Cursor_Is_End();
};

ParaMath.prototype.Cursor_MoveToStartPos = function()
{
    // TODO: ParaMath.Cursor_MoveToStartPos

    this.Root.Cursor_MoveToStartPos();
};

ParaMath.prototype.Cursor_MoveToEndPos = function(SelectFromEnd)
{
    // TODO: ParaMath.Cursor_MoveToEndPos

    this.Root.Cursor_MoveToEndPos(SelectFromEnd);
};

ParaMath.prototype.Get_ParaContentPosByXY = function(SearchPos, Depth, _CurLine, _CurRange, StepEnd, Flag) // получить логическую позицию по XY
{

    var Result = this.Root.Get_ParaContentPosByXY(SearchPos, Depth, _CurLine, _CurRange, StepEnd);

    if(SearchPos.InText)
        SearchPos.DiffX  = 0.001; // чтобы всегда встать в формулу, если попали в текст

    return Result;
};

ParaMath.prototype.Get_ParaContentPos = function(bSelection, bStart, ContentPos) // получить текущую логическую позицию
{
    this.Root.Get_ParaContentPos(bSelection, bStart, ContentPos);
};

ParaMath.prototype.Set_ParaContentPos = function(ContentPos, Depth) // выставить логическую позицию в контенте
{
    this.Root.Set_ParaContentPos(ContentPos, Depth);
};

ParaMath.prototype.Get_PosByElement = function(Class, ContentPos, Depth, UseRange, Range, Line)
{
    if ( this === Class )
        return true;

    return this.Root.Get_PosByElement(Class, ContentPos, Depth, UseRange, Range, Line);
};

ParaMath.prototype.Get_ElementByPos = function(ContentPos, Depth)
{
    return this.Root.Get_ElementByPos(ContentPos, Depth);
};

ParaMath.prototype.Get_ClassesByPos = function(Classes, ContentPos, Depth)
{
    Classes.push(this);

    this.Root.Get_ClassesByPos(Classes, ContentPos, Depth);
};

ParaMath.prototype.Get_PosByDrawing = function(Id, ContentPos, Depth)
{
    return false;
};

ParaMath.prototype.Get_RunElementByPos = function(ContentPos, Depth)
{
    return null;
};

ParaMath.prototype.Get_LastRunInRange = function(_CurLine, _CurRange)
{
    return this.Root.Get_LastRunInRange(_CurLine, _CurRange);
};

ParaMath.prototype.Get_LeftPos = function(SearchPos, ContentPos, Depth, UseContentPos)
{
    return this.Root.Get_LeftPos(SearchPos, ContentPos, Depth, UseContentPos, false);
};

ParaMath.prototype.Get_RightPos = function(SearchPos, ContentPos, Depth, UseContentPos, StepEnd)
{
    return this.Root.Get_RightPos(SearchPos, ContentPos, Depth, UseContentPos, StepEnd, false);
};

ParaMath.prototype.Get_WordStartPos = function(SearchPos, ContentPos, Depth, UseContentPos)
{
    this.Root.Get_WordStartPos(SearchPos, ContentPos, Depth, UseContentPos, false);
};

ParaMath.prototype.Get_WordEndPos = function(SearchPos, ContentPos, Depth, UseContentPos, StepEnd)
{
    this.Root.Get_WordEndPos(SearchPos, ContentPos, Depth, UseContentPos, StepEnd, false);
};
ParaMath.prototype.Get_EndRangePos = function(_CurLine, _CurRange, SearchPos, Depth)
{
    return this.Root.Get_EndRangePos(_CurLine, _CurRange, SearchPos, Depth);
};
ParaMath.prototype.Get_StartRangePos = function(_CurLine, _CurRange, SearchPos, Depth)
{
    return this.Root.Get_StartRangePos(_CurLine, _CurRange, SearchPos, Depth);
};
ParaMath.prototype.Get_StartRangePos2 = function(_CurLine, _CurRange, ContentPos, Depth)
{
    return this.Root.Get_StartRangePos2(_CurLine, _CurRange, ContentPos, Depth);
};

ParaMath.prototype.Get_StartPos = function(ContentPos, Depth)
{
    this.Root.Get_StartPos(ContentPos, Depth);
};

ParaMath.prototype.Get_EndPos = function(BehindEnd, ContentPos, Depth)
{
    this.Root.Get_EndPos(BehindEnd, ContentPos, Depth);
};
//-----------------------------------------------------------------------------------
// Функции для работы с селектом
//-----------------------------------------------------------------------------------
ParaMath.prototype.Set_SelectionContentPos = function(StartContentPos, EndContentPos, Depth, StartFlag, EndFlag)
{
    this.Root.Set_SelectionContentPos(StartContentPos, EndContentPos, Depth, StartFlag, EndFlag);
    this.bSelectionUse = true;
};

ParaMath.prototype.Selection_IsUse = function()
{
    return this.bSelectionUse;
};

ParaMath.prototype.Selection_Stop = function()
{
};

ParaMath.prototype.Selection_Remove = function()
{
    this.bSelectionUse = false;
    this.Root.Selection_Remove();
};

ParaMath.prototype.Select_All = function(Direction)
{
    this.bSelectionUse = true;
    this.Root.Select_All();
};

ParaMath.prototype.Selection_DrawRange = function(_CurLine, _CurRange, SelectionDraw)
{
    this.Root.Selection_DrawRange(_CurLine, _CurRange, SelectionDraw);
};
ParaMath.prototype.Selection_IsEmpty = function(CheckEnd)
{
    return this.Root.Selection_IsEmpty();
};

ParaMath.prototype.Selection_IsPlaceholder = function()
{
    var bPlaceholder = false;
    var result = this.GetSelectContent(),
        SelectContent = result.Content;
    var start = result.Start,
        end = result.End;

    if(start == end)
    {
        bPlaceholder = SelectContent.IsPlaceholder();
    }

    return bPlaceholder;
};

ParaMath.prototype.Selection_CheckParaEnd = function()
{
    return false;
};

ParaMath.prototype.Selection_CheckParaContentPos = function(ContentPos, Depth, bStart, bEnd)
{
    return this.Root.Selection_CheckParaContentPos(ContentPos, Depth, bStart, bEnd);
};

ParaMath.prototype.Is_SelectedAll = function(Props)
{
    // TODO: ParaMath.Is_SelectedAll
    return this.Root.Is_SelectedAll(Props);
};

ParaMath.prototype.Selection_CorrectLeftPos = function(Direction)
{
    return false;
};
//----------------------------------------------------------------------------------------------------------------------
// Функции совместного редактирования
//----------------------------------------------------------------------------------------------------------------------
ParaMath.prototype.Undo = function(Data)
{
    Data.Undo(this);
};

ParaMath.prototype.Redo = function(Data)
{
    Data.Redo(this);
};

ParaMath.prototype.Save_Changes = function(Data, Writer)
{
    WriteChanges_ToBinary(Data, Writer);
};

ParaMath.prototype.Load_Changes = function(Reader)
{
    ReadChanges_FromBinary(Reader, this);
};

ParaMath.prototype.Write_ToBinary2 = function(Writer)
{
    Writer.WriteLong( historyitem_type_Math );

    // String : this.Id
    // Long   : this.Type
    // String : Root.Id

    Writer.WriteString2(this.Id);
    Writer.WriteLong(this.Type);
    Writer.WriteString2(this.Root.Id);
};

ParaMath.prototype.Read_FromBinary2 = function(Reader)
{
    // String : this.Id
    // Long   : this.Type
    // String : Root.Id

    this.Id   = Reader.GetString2();
    this.Type = Reader.GetLong();
    this.Root = g_oTableId.Get_ById(Reader.GetString2());
    this.Root.bRoot = true;
    this.Root.ParentElement = this;
};

ParaMath.prototype.Get_ContentSelection = function()
{
    var Bounds = null;
    var oContent = this.GetSelectContent().Content;

    if (oContent.bRoot == false)
    {
        if(oContent.bOneLine)
        {
            Bounds = oContent.Get_Bounds();
        }
        else
        {
            Bounds = this.private_GetBounds(oContent);
        }
    }

    return Bounds;
};

ParaMath.prototype.Recalc_RunsCompiledPr = function()
{
    this.Root.Recalc_RunsCompiledPr();
};

/**
 * Проверяем находимся ли мы во внутреннем (не самом верхнем) контенте формулы.
 */
ParaMath.prototype.Is_InInnerContent = function()
{
    var oContent = this.GetSelectContent().Content;

    if (oContent.bRoot)
        return false;

    return true;
};

/**
 * Обработка нажатия Enter внутри формулы
 */
ParaMath.prototype.Handle_AddNewLine = function()
{
    var ContentPos = new CParagraphContentPos();

    var CurrContent = this.GetSelectContent().Content;

    if (true === CurrContent.bRoot)
        return false;

    CurrContent.Get_ParaContentPos(this.bSelectionUse, true, ContentPos);

    var NeedRecalculate = false;

    if(MATH_EQ_ARRAY === CurrContent.ParentElement.kind)
    {
        var NewContent = CurrContent.Parent.addRow();
        CurrContent.SplitContent(NewContent, ContentPos, 0);
        NewContent.Correct_Content(true);
        CurrContent.Correct_Content(true);

        NewContent.Cursor_MoveToStartPos();

        NeedRecalculate = true;
    }
    else if(MATH_MATRIX !== CurrContent.ParentElement.kind)
    {
        var ctrPrp = CurrContent.Parent.CtrPrp.Copy();
        var props = {row: 2, ctrPrp: ctrPrp};
        var EqArray = new CEqArray(props);

        var FirstContent  = EqArray.getElementMathContent(0);
        var SecondContent = EqArray.getElementMathContent(1);

        CurrContent.SplitContent(SecondContent, ContentPos, 0);
        CurrContent.CopyTo(FirstContent, false);

        // вставим пустой Run в Content, чтобы не упала ф-ия Remove_FromContent
        // первый элемент всегда Run
        var Run = CurrContent.getElem(0);
        Run.Remove_FromContent(0, Run.Content.length, true);

        CurrContent.Remove_FromContent(1, CurrContent.Content.length);
        CurrContent.Add_ToContent(1, EqArray);
        CurrContent.Correct_Content(true);

        var CurrentContent = new CParagraphContentPos();
        this.Get_ParaContentPos(false, false, CurrentContent);

        var RightContentPos = new CParagraphSearchPos();
        this.Get_RightPos(RightContentPos, CurrentContent, 0, true);
        this.Set_ParaContentPos(RightContentPos.Pos, 0);

        EqArray.CurPos = 1;
        SecondContent.Cursor_MoveToStartPos();

        NeedRecalculate = true;
    }


    return NeedRecalculate;
};

/**
 * Разделение формулы на 2 части в заданной позиции. В текущем объекте остается левая часть формулы.
 * @param ContentPos Позиция
 * @param Depth
 * @returns Возвращается правая часть формулы.
 */
ParaMath.prototype.Split = function (ContentPos, Depth)
{
    var NewParaMath = new ParaMath();
    NewParaMath.Jc = this.Jc;

    this.Root.SplitContent(NewParaMath.Root, ContentPos, Depth);

    return NewParaMath;
};

/**
 * Пытаемся выполнить автозамену в формуле.
 * @returns {boolean} Выполнилась ли автозамена.
 */
ParaMath.prototype.Make_AutoCorrect = function()
{
    return false;
};

/**
 * Получаем рект формулы
 * @constructor
 */
ParaMath.prototype.Get_Bounds = function()
{
    if (undefined === this.Paragraph || null === this.Paragraph)
    {
        return [{X : 0, Y : 0, W : 0, H : 0, Page : 0}];
    }
    else
    {
        return this.private_GetBounds(this.Root);
    }
};
ParaMath.prototype.private_GetBounds = function(Content)
{
    var Bounds = [];
    var StartParaPage = this.Paragraph.Get_StartPage_Absolute();

    var ContentBounds = Content.Get_Bounds();

    for(var Line = 0; Line < ContentBounds.length; Line++)
    {
        Bounds[Line] = [];
        var CurLine = Line + Content.StartLine;
        var HLine = this.Paragraph.Lines[CurLine].Bottom - this.Paragraph.Lines[CurLine].Top;
        var Height = HLine;
        var Y;

        for(var Range = 0; Range < ContentBounds[Line].length; Range++)
        {
            var oBound   = ContentBounds[Line][Range],
                ParaPage = oBound.Page,
                YLine    = this.Paragraph.Pages[ParaPage].Y + this.Paragraph.Lines[CurLine].Top;

            Y = YLine;

            if(Content.bRoot == false)
            {
                if(HLine < oBound.H)
                {
                    Height = HLine;
                    Y = YLine;
                }
                else
                {
                    Height = oBound.H;
                    Y  = oBound.Y;
                }
            }

            Bounds[Line][Range] =
            {
                X:      oBound.X,
                Y:      Y,
                W:      oBound.W,
                H:      Height,
                Page:   oBound.Page + StartParaPage
            };
        }
    }

    return Bounds;
};

ParaMath.prototype.getPropsForWrite = function()
{
    return {Jc : this.Jc};
};

/**
 * Обновляем состояние интерфейса.
 */
ParaMath.prototype.Document_UpdateInterfaceState = function()
{
    var SelectedContent = this.GetSelectContent();
    var MathContent = SelectedContent.Content;

    var MathProps = new CMathProp();

    if (MathContent.bRoot)
    {
        MathProps.Type = c_oAscMathInterfaceType.Common;
        MathProps.Pr   = null;
    }
    else if (undefined !== MathContent.ParentElement && null !== MathContent.ParentElement)
    {
        MathContent.ParentElement.Document_UpdateInterfaceState(MathProps);
    }

    editor.sync_MathPropCallback(MathProps);
};

/**
 * Проверяем используется ли заданный MathContent на текущем уровне формулы
 * @param MathContent
 */
ParaMath.prototype.Is_ContentUse  = function(MathContent)
{
    if (this.Root === MathContent)
        return true;

    return false;
};

/*
 * Выполняем коректировку формулы после конвертирования ее из старой формулы (Equation 2-3).
 */
ParaMath.prototype.Correct_AfterConvertFromEquation = function()
{
    this.ParaMathRPI.bCorrect_FontSize = true;
    //this.Root.Correct_AfterConvertFromEquation();
};

ParaMath.prototype.Check_RevisionsChanges = function(Checker, ContentPos, Depth)
{
    return this.Root.Check_RevisionsChanges(Checker, ContentPos, Depth);
};
ParaMath.prototype.Accept_RevisionChanges = function(Type, bAll)
{
    return this.Root.Accept_RevisionChanges(Type, bAll);
};
ParaMath.prototype.Reject_RevisionChanges = function(Type, bAll)
{
    return this.Root.Reject_RevisionChanges(Type, bAll);
};
ParaMath.prototype.Set_ReviewType = function(ReviewType, RemovePrChange)
{
    return this.Root.Set_ReviewType(ReviewType, RemovePrChange);
};

//----------------------------------------------------------------------------------------------------------------------
// Классы с изменениями
//----------------------------------------------------------------------------------------------------------------------
var historyitem_Math_AddItem                   =  1; // Добавляем элемент
var historyitem_Math_RemoveItem                =  2; // Удаляем элемент
var historyitem_Math_CtrPrpFSize               =  3; // CtrPrp
var historyitem_Math_ParaJc                    =  4; // ParaMath.Jc
var historyitem_Math_CtrPrpShd                 =  5;
var historyitem_Math_AddItems_ToMathBase       =  6;
var historyitem_Math_EqArrayPr                 =  7; // Изменение настроек у CEqArray
var historyitem_Math_CtrPrpColor               =  8;
var historyitem_Math_CtrPrpUnifill             =  9;
var historyitem_Math_CtrPrpUnderline           =  10;
var historyitem_Math_CtrPrpStrikeout           =  11;
var historyitem_Math_CtrPrpDoubleStrikeout     =  12;
var historyitem_Math_CtrPrpItalic              =  13;
var historyitem_Math_CtrPrpBold                =  14;
var historyitem_Math_RFontsAscii               =  15;
var historyitem_Math_RFontsHAnsi               =  16;
var historyitem_Math_RFontsCS                  =  17;
var historyitem_Math_RFontsEastAsia            =  18;
var historyitem_Math_RFontsHint                =  19;
var historyitem_Math_CtrPrpHighLight           =  20;
var historyitem_Math_ArgSize                   =  21;
var historyitem_Math_ReviewType                =  22;
var historyitem_Math_CtrPrpTextFill            =  23;
var historyitem_Math_CtrPrpTextOutline         =  24;


function ReadChanges_FromBinary(Reader, Class)
{
    var Type = Reader.GetLong();
    var Changes = null;

    switch(Type)
    {
        case historyitem_Math_CtrPrpFSize           : Changes = new CChangesMathFontSize(); break;
        case historyitem_Math_ParaJc                : Changes = new CChangesMathParaJc(); break;
        case historyitem_Math_CtrPrpShd             : Changes = new CChangesMathShd(); break;
        case historyitem_Math_AddItems_ToMathBase   : Changes = new CChangesMathAddItems(); break;
        case historyitem_Math_EqArrayPr             : Changes = new CChangesMathEqArrayPr(); break;
        case historyitem_Math_CtrPrpColor           : Changes = new CChangesMathColor(); break;
        case historyitem_Math_CtrPrpUnifill         : Changes = new CChangesMathUnifill(); break;
        case historyitem_Math_CtrPrpUnderline       : Changes = new CChangesMathUnderline(); break;
        case historyitem_Math_CtrPrpStrikeout       : Changes = new CChangesMathStrikeout(); break;
        case historyitem_Math_CtrPrpDoubleStrikeout : Changes = new CChangesMath_DoubleStrikeout(); break;
        case historyitem_Math_CtrPrpItalic          : Changes = new CChangesMathItalic(); break;
        case historyitem_Math_CtrPrpBold            : Changes = new CChangesMathBold(); break;
        case historyitem_Math_RFontsAscii           : Changes = new CChangesMath_RFontsAscii(); break;
        case historyitem_Math_RFontsHAnsi           : Changes = new CChangesMath_RFontsHAnsi(); break;
        case historyitem_Math_RFontsCS              : Changes = new CChangesMath_RFontsCS(); break;
        case historyitem_Math_RFontsEastAsia        : Changes = new CChangesMath_RFontsEastAsia(); break;
        case historyitem_Math_RFontsHint            : Changes = new CChangesMath_RFontsHint(); break;
        case historyitem_Math_CtrPrpHighLight       : Changes = new CChangesMathHighLight(); break;
        case historyitem_Math_ReviewType            : Changes = new CChangesMathBaseReviewType(); break;
        case historyitem_Math_CtrPrpTextFill        : Changes = new CChangesMathTextFill(); break;
        case historyitem_Math_CtrPrpTextOutline     : Changes = new CChangesMathTextOutline(); break;
    }

    if (null !== Changes)
        Changes.Load_Changes(Reader, Class);
}

function WriteChanges_ToBinary(Changes, Writer)
{
    Writer.WriteLong(Changes.Type);
    Changes.Save_Changes(Writer);
}

//----------------------------------------------------------------------------------------------------------------------
// Классы с изменениями
//----------------------------------------------------------------------------------------------------------------------
function CChangesMathFontSize(NewValue, OldValue)
{
    this.New = NewValue;
    this.Old = OldValue;
}

CChangesMathFontSize.prototype.Type = historyitem_Math_CtrPrpFSize;

CChangesMathFontSize.prototype.Undo = function(Class)
{
    Class.raw_SetFontSize(this.Old);
};
CChangesMathFontSize.prototype.Redo = function(Class)
{
    Class.raw_SetFontSize(this.New);
};
CChangesMathFontSize.prototype.Save_Changes = function(Writer)
{
    // Bool : IsUndefined
    // Long : New
    if (undefined === this.New)
        Writer.WriteBool(true);
    else
    {
        Writer.WriteBool(false);
        Writer.WriteLong(this.New);
    }
};
CChangesMathFontSize.prototype.Load_Changes = function(Reader, Class)
{
    // Bool : IsUndefined
    // Long : New

    if (true === Reader.GetBool())
        this.New = undefined;
    else
        this.New = Reader.GetLong();

    this.Redo(Class);
};

function CChangesMathShd(NewValue, OldValue)
{
    this.New = NewValue;
    this.Old = OldValue;
}
CChangesMathShd.prototype.Type = historyitem_Math_CtrPrpShd;
CChangesMathShd.prototype.Undo = function(Class)
{
    Class.raw_SetShd(this.Old);
};
CChangesMathShd.prototype.Redo = function(Class)
{
    Class.raw_SetShd(this.New);
};
CChangesMathShd.prototype.Save_Changes = function(Writer)
{
    // Bool : IsUndefined

    if ( undefined !== this.New )
    {
        Writer.WriteBool(false);
        this.New.Write_ToBinary(Writer);
    }
    else
        Writer.WriteBool(true);

};
CChangesMathShd.prototype.Load_Changes = function(Reader, Class)
{
    // Bool : IsUndefined

    if ( Reader.GetBool() == false)
    {
        this.New = new CDocumentShd();
        this.New.Read_FromBinary( Reader );
    }
    else
    {
        this.New = undefined;
    }

    this.Redo(Class);
};

function CChangesMathHighLight(NewValue, OldValue)
{
    this.New = NewValue;
    this.Old = OldValue;
}
CChangesMathHighLight.prototype.Type = historyitem_Math_CtrPrpHighLight;
CChangesMathHighLight.prototype.Undo = function(Class)
{
    Class.raw_SetHighLight(this.Old);
};
CChangesMathHighLight.prototype.Redo = function(Class)
{
    Class.raw_SetHighLight(this.New);
};
CChangesMathHighLight.prototype.Save_Changes = function(Writer)
{
    if ( undefined != this.New )
    {
        Writer.WriteBool(false);
        if ( highlight_None != this.New )
        {
            Writer.WriteBool( false );
            this.New.Write_ToBinary( Writer );
        }
        else
            Writer.WriteBool( true );
    }
    else
        Writer.WriteBool(true);
};
CChangesMathHighLight.prototype.Load_Changes = function(Reader, Class)
{
    if ( Reader.GetBool() == false )
    {
        if ( Reader.GetBool() == false )
        {
            this.New = new CDocumentColor(0,0,0);
            this.New.Read_FromBinary(Reader);
        }
        else
            this.New = highlight_None;
    }
    else
        this.New = undefined;

    this.Redo(Class);
};

function CChangesMathColor(NewValue, OldValue)
{
    this.New = NewValue;
    this.Old = OldValue;
}
CChangesMathColor.prototype.Type = historyitem_Math_CtrPrpColor;
CChangesMathColor.prototype.Undo = function(Class)
{
    Class.raw_SetColor(this.Old);
};
CChangesMathColor.prototype.Redo = function(Class)
{
    Class.raw_SetColor(this.New);
};
CChangesMathColor.prototype.Save_Changes = function(Writer)
{
    // Bool : IsUndefined

    if ( undefined !== this.New )
    {
        Writer.WriteBool(false);
        this.New.Write_ToBinary(Writer);
    }
    else
    {
        Writer.WriteBool(true);
    }
};
CChangesMathColor.prototype.Load_Changes = function(Reader, Class)
{
    // Bool : IsUndefined

    if ( Reader.GetBool() == false)
    {
        this.New = new CDocumentColor(0, 0, 0, false);
        this.New.Read_FromBinary(Reader);
    }
    else
    {
        this.New = undefined;
    }

    this.Redo(Class);
};

function CChangesMathUnifill(NewValue, OldValue)
{
    this.New = NewValue;
    this.Old = OldValue;
}
CChangesMathUnifill.prototype.Type = historyitem_Math_CtrPrpUnifill;
CChangesMathUnifill.prototype.Undo = function(Class)
{
    Class.raw_SetUnifill(this.Old);
};
CChangesMathUnifill.prototype.Redo = function(Class)
{
    Class.raw_SetUnifill(this.New);
};
CChangesMathUnifill.prototype.Save_Changes = function(Writer)
{
    // Bool : IsUndefined

    if ( undefined !== this.New )
    {
        Writer.WriteBool(false);
        this.New.Write_ToBinary(Writer);
    }
    else
    {
        Writer.WriteBool(true);
    }
};
CChangesMathUnifill.prototype.Load_Changes = function(Reader, Class)
{
    // Bool : IsUndefined

    if ( Reader.GetBool() == false)
    {
        this.New = new CUniFill();
        this.New.Read_FromBinary(Reader);
    }
    else
    {
        this.New = undefined;
    }

    this.Redo(Class);
};
function CChangesMathTextFill(NewValue, OldValue)
{
    this.New = NewValue;
    this.Old = OldValue;
}
CChangesMathTextFill.prototype.Type = historyitem_Math_CtrPrpTextFill;
CChangesMathTextFill.prototype.Undo = function(Class)
{
    Class.raw_SetTextFill(this.Old);
};
CChangesMathTextFill.prototype.Redo = function(Class)
{
    Class.raw_SetTextFill(this.New);
};
CChangesMathTextFill.prototype.Save_Changes = function(Writer)
{
    // Bool : IsUndefined

    if ( undefined !== this.New )
    {
        Writer.WriteBool(false);
        this.New.Write_ToBinary(Writer);
    }
    else
    {
        Writer.WriteBool(true);
    }
};
CChangesMathTextFill.prototype.Load_Changes = function(Reader, Class)
{
    // Bool : IsUndefined

    if ( Reader.GetBool() == false)
    {
        this.New = new CUniFill();
        this.New.Read_FromBinary(Reader);
    }
    else
    {
        this.New = undefined;
    }
    this.Redo(Class);
};
function CChangesMathTextOutline(NewValue, OldValue)
{
    this.New = NewValue;
    this.Old = OldValue;
}
CChangesMathTextOutline.prototype.Type = historyitem_Math_CtrPrpTextOutline;
CChangesMathTextOutline.prototype.Undo = function(Class)
{
    Class.raw_SetTextOutline(this.Old);
};
CChangesMathTextOutline.prototype.Redo = function(Class)
{
    Class.raw_SetTextOutline(this.New);
};
CChangesMathTextOutline.prototype.Save_Changes = function(Writer)
{
    // Bool : IsUndefined

    if ( undefined !== this.New )
    {
        Writer.WriteBool(false);
        this.New.Write_ToBinary(Writer);
    }
    else
    {
        Writer.WriteBool(true);
    }
};
CChangesMathTextOutline.prototype.Load_Changes = function(Reader, Class)
{
    // Bool : IsUndefined

    if ( Reader.GetBool() == false)
    {
        this.New = new CLn();
        this.New.Read_FromBinary(Reader);
    }
    else
    {
        this.New = undefined;
    }
    this.Redo(Class);
};
function CChangesMathUnderline(NewValue, OldValue)
{
    this.New = NewValue;
    this.Old = OldValue;
}
CChangesMathUnderline.prototype.Type = historyitem_Math_CtrPrpUnderline;
CChangesMathUnderline.prototype.Undo = function(Class)
{
    Class.raw_SetUnderline(this.Old);
};
CChangesMathUnderline.prototype.Redo = function(Class)
{
    Class.raw_SetUnderline(this.New);
};
CChangesMathUnderline.prototype.Save_Changes = function(Writer)
{
    // Bool : IsUndefined
    // Bool : IsUnderline

    if (undefined === this.New)
        Writer.WriteBool(true);
    else
    {
        Writer.WriteBool(false);
        Writer.WriteBool(this.New);
    }

};
CChangesMathUnderline.prototype.Load_Changes = function(Reader, Class)
{
    // Bool : IsUndefined
    // Bool : IsUnderline

    if(true === Reader.GetBool())
        this.New = undefined;
    else
        this.New = Reader.GetBool();

    this.Redo(Class);
}

function CChangesMathStrikeout(NewValue, OldValue)
{
    this.New = NewValue;
    this.Old = OldValue;
}
CChangesMathStrikeout.prototype.Type = historyitem_Math_CtrPrpStrikeout;
CChangesMathStrikeout.prototype.Undo = function(Class)
{
    Class.raw_SetStrikeout(this.Old);
};
CChangesMathStrikeout.prototype.Redo = function(Class)
{
    Class.raw_SetStrikeout(this.New);
};
CChangesMathStrikeout.prototype.Save_Changes = function(Writer)
{
    // Bool : IsUndefined
    // Bool : IsStrikeOut

    if (undefined === this.New)
        Writer.WriteBool(true);
    else
    {
        Writer.WriteBool(false);
        Writer.WriteBool(this.New);
    }
};
CChangesMathStrikeout.prototype.Load_Changes = function(Reader, Class)
{
    // Bool : IsUndefined
    // Bool : IsStrikeOut

    if(true === Reader.GetBool())
        this.New = undefined;
    else
        this.New = Reader.GetBool();

    this.Redo(Class);
};

function CChangesMath_DoubleStrikeout(NewValue, OldValue)
{
    this.New = NewValue;
    this.Old = OldValue;
}
CChangesMath_DoubleStrikeout.prototype.Type = historyitem_Math_CtrPrpDoubleStrikeout;
CChangesMath_DoubleStrikeout.prototype.Undo = function(Class)
{
    Class.raw_Set_DoubleStrikeout(this.Old);
};
CChangesMath_DoubleStrikeout.prototype.Redo = function(Class)
{
    Class.raw_Set_DoubleStrikeout(this.New);
};
CChangesMath_DoubleStrikeout.prototype.Save_Changes = function(Writer)
{
    // Bool : IsUndefined
    // Bool : IsDoubleStrikeOut

    if (undefined === this.New)
        Writer.WriteBool(true);
    else
    {
        Writer.WriteBool(false);
        Writer.WriteBool(this.New);
    }
};
CChangesMath_DoubleStrikeout.prototype.Load_Changes = function(Reader, Class)
{
    // Bool : IsUndefined
    // Bool : IsDoubleStrikeOut

    if(true === Reader.GetBool())
        this.New = undefined;
    else
        this.New = Reader.GetBool();

    this.Redo(Class);
};

function CChangesMathItalic(NewValue, OldValue)
{
    this.New = NewValue;
    this.Old = OldValue;
}
CChangesMathItalic.prototype.Type = historyitem_Math_CtrPrpItalic;
CChangesMathItalic.prototype.Undo = function(Class)
{
    Class.raw_SetItalic(this.Old);
};
CChangesMathItalic.prototype.Redo = function(Class)
{
    Class.raw_SetItalic(this.New);
};
CChangesMathItalic.prototype.Save_Changes = function(Writer)
{
    // Bool : IsUndefined
    // Bool : IsItalic

    if (undefined === this.New)
        Writer.WriteBool(true);
    else
    {
        Writer.WriteBool(false);
        Writer.WriteBool(this.New);
    }

};
CChangesMathItalic.prototype.Load_Changes = function(Reader, Class)
{
    // Bool : IsUndefined
    // Bool : IsItalic

    if(true === Reader.GetBool())
        this.New = undefined;
    else
        this.New = Reader.GetBool();

    this.Redo(Class);

};

function CChangesMathBold(NewValue, OldValue)
{
    this.New = NewValue;
    this.Old = OldValue;
}
CChangesMathBold.prototype.Type = historyitem_Math_CtrPrpBold;
CChangesMathBold.prototype.Undo = function(Class)
{
    Class.raw_SetBold(this.Old);
};
CChangesMathBold.prototype.Redo = function(Class)
{
    Class.raw_SetBold(this.New);
};
CChangesMathBold.prototype.Save_Changes = function(Writer)
{
    // Bool : IsUndefined
    // Bool : IsBold

    if (undefined === this.New)
        Writer.WriteBool(true);
    else
    {
        Writer.WriteBool(false);
        Writer.WriteBool(this.New);
    }

};
CChangesMathBold.prototype.Load_Changes = function(Reader, Class)
{
    // Bool : IsUndefined
    // Bool : IsBold

    if(true === Reader.GetBool())
        this.New = undefined;
    else
        this.New = Reader.GetBool();

    this.Redo(Class);

};


function CChangesMath_RFontsAscii(NewValue, OldValue)
{
    this.New = NewValue;
    this.Old = OldValue;
}
CChangesMath_RFontsAscii.prototype.Type = historyitem_Math_RFontsAscii;
CChangesMath_RFontsAscii.prototype.Undo = function(Class)
{
    Class.raw_SetRFontsAscii(this.Old);
};
CChangesMath_RFontsAscii.prototype.Redo = function(Class)
{
    Class.raw_SetRFontsAscii(this.New);
};
CChangesMath_RFontsAscii.prototype.Save_Changes = function(Writer)
{
    // Bool   : IsUndefined
    // String : Font

    if (undefined === this.New)
    {
        Writer.WriteBool(true);
    }
    else
    {
        Writer.WriteBool(false);
        Writer.WriteString2(this.New.Name);
    }
};
CChangesMath_RFontsAscii.prototype.Load_Changes = function(Reader, Class)
{
    // Bool   : IsUndefined
    // String : Font

    if(true === Reader.GetBool())
        this.New = undefined;
    else
    {
        this.New =
        {
            Name  : Reader.GetString2(),
            Index : -1
        };
    }

    this.Redo(Class);
};

function CChangesMath_RFontsHAnsi(NewValue, OldValue)
{
    this.New = NewValue;
    this.Old = OldValue;
}
CChangesMath_RFontsHAnsi.prototype.Type = historyitem_Math_RFontsHAnsi;
CChangesMath_RFontsHAnsi.prototype.Undo = function(Class)
{
    Class.raw_SetRFontsHAnsi(this.Old);
};
CChangesMath_RFontsHAnsi.prototype.Redo = function(Class)
{
    Class.raw_SetRFontsHAnsi(this.New);
};
CChangesMath_RFontsHAnsi.prototype.Save_Changes = function(Writer)
{
    // Bool   : IsUndefined
    // String : Font

    if (undefined === this.New)
    {
        Writer.WriteBool(true);
    }
    else
    {
        Writer.WriteBool(false);
        Writer.WriteString2(this.New.Name);
    }
};
CChangesMath_RFontsHAnsi.prototype.Load_Changes = function(Reader, Class)
{
    // Bool   : IsUndefined
    // String : Font

    if(true === Reader.GetBool())
        this.New = undefined;
    else
    {
        this.New =
        {
            Name  : Reader.GetString2(),
            Index : -1
        };
    }

    this.Redo(Class);
};


function CChangesMath_RFontsCS(NewValue, OldValue)
{
    this.New = NewValue;
    this.Old = OldValue;
}
CChangesMath_RFontsCS.prototype.Type = historyitem_Math_RFontsCS;
CChangesMath_RFontsCS.prototype.Undo = function(Class)
{
    Class.raw_SetRFontsCS(this.Old);
};
CChangesMath_RFontsCS.prototype.Redo = function(Class)
{
    Class.raw_SetRFontsCS(this.New);
};
CChangesMath_RFontsCS.prototype.Save_Changes = function(Writer)
{
    // Bool   : IsUndefined
    // String : Font

    if (undefined === this.New)
    {
        Writer.WriteBool(true);
    }
    else
    {
        Writer.WriteBool(false);
        Writer.WriteString2(this.New.Name);
    }
};
CChangesMath_RFontsCS.prototype.Load_Changes = function(Reader, Class)
{
    // Bool   : IsUndefined
    // String : Font

    if(true === Reader.GetBool())
        this.New = undefined;
    else
    {
        this.New =
        {
            Name  : Reader.GetString2(),
            Index : -1
        };
    }

    this.Redo(Class);
};

function CChangesMath_RFontsEastAsia(NewValue, OldValue)
{
    this.New = NewValue;
    this.Old = OldValue;
}
CChangesMath_RFontsEastAsia.prototype.Type = historyitem_Math_RFontsEastAsia;
CChangesMath_RFontsEastAsia.prototype.Undo = function(Class)
{
    Class.raw_SetRFontsEastAsia(this.Old);
};
CChangesMath_RFontsEastAsia.prototype.Redo = function(Class)
{
    Class.raw_SetRFontsEastAsia(this.New);
};
CChangesMath_RFontsEastAsia.prototype.Save_Changes = function(Writer)
{
    // Bool   : IsUndefined
    // String : Font

    if (undefined === this.New)
    {
        Writer.WriteBool(true);
    }
    else
    {
        Writer.WriteBool(false);
        Writer.WriteString2(this.New.Name);
    }


};
CChangesMath_RFontsEastAsia.prototype.Load_Changes = function(Reader, Class)
{
    // Bool   : IsUndefined
    // String : Font

    if(true === Reader.GetBool())
        this.New = undefined;
    else
    {
        this.New =
        {
            Name  : Reader.GetString2(),
            Index : -1
        };
    }

    this.Redo(Class);
};

function CChangesMath_RFontsHint(NewValue, OldValue)
{
    this.New = NewValue;
    this.Old = OldValue;
}
CChangesMath_RFontsHint.prototype.Type = historyitem_Math_RFontsHint;
CChangesMath_RFontsHint.prototype.Undo = function(Class)
{
    Class.raw_SetRFontsHint(this.Old);
};
CChangesMath_RFontsHint.prototype.Redo = function(Class)
{
    Class.raw_SetRFontsHint(this.New);
};
CChangesMath_RFontsHint.prototype.Save_Changes = function(Writer)
{
    // Bool   : IsUndefined
    // String : Font

    if (undefined === this.New)
    {
        Writer.WriteBool(true);
    }
    else
    {
        Writer.WriteBool(false);
        Writer.WriteLong(this.New);
    }
};
CChangesMath_RFontsHint.prototype.Load_Changes = function(Reader, Class)
{
    // Bool   : IsUndefined
    // String : Font

    if(true === Reader.GetBool())
        this.New = undefined;
    else
        this.New = Reader.GetLong();

    this.Redo(Class);
};


function CChangesMathAddItems(Pos, Items)
{
    this.Pos   = Pos;
    this.Items = Items;
}
CChangesMathAddItems.prototype.Type = historyitem_Math_AddItems_ToMathBase;
CChangesMathAddItems.prototype.Undo = function(Class)
{
    Class.raw_RemoveFromContent(this.Pos, this.Items.length);
};
CChangesMathAddItems.prototype.Redo = function(Class)
{
    Class.raw_AddToContent(this.Pos, this.Items, false);
};
CChangesMathAddItems.prototype.Save_Changes = function(Writer)
{
    // Long : Count
    // Long : Pos
    // Array of String : Id

    var Count = this.Items.length;
    Writer.WriteLong(Count);
    Writer.WriteLong(this.Pos);

    for(var Index = 0; Index < Count; Index++)
    {
        Writer.WriteString2(this.Items[Index].Get_Id());
    }
};
CChangesMathAddItems.prototype.Load_Changes = function(Reader, Class)
{
    // Long : Count
    // Long : Pos
    // Array of String : Id

    var Count = Reader.GetLong();
    this.Pos  = Reader.GetLong();

    this.Items = [];
    for(var Index = 0; Index < Count; Index++)
    {
        var Element = g_oTableId.Get_ById(Reader.GetString2());

        if (null !== Element)
            this.Items.push(Element);
    }

    this.Redo(Class);
};

function CChangesMathParaJc(NewValue, OldValue)
{
    this.New = NewValue;
    this.Old = OldValue;
}
CChangesMathParaJc.prototype.Type = historyitem_Math_ParaJc;
CChangesMathParaJc.prototype.Undo = function(Class)
{
    Class.raw_SetAlign(this.Old);
};
CChangesMathParaJc.prototype.Redo = function(Class)
{
    Class.raw_SetAlign(this.New);
};
CChangesMathParaJc.prototype.Save_Changes = function(Writer)
{
    // Bool : undefined?
    // Long : value
    if (undefined === this.New)
        Writer.WriteBool(true);
    else
    {
        Writer.WriteBool(false);
        Writer.WriteLong(this.New);
    }
};
CChangesMathParaJc.prototype.Load_Changes = function(Reader, Class)
{
    if (true === Reader.GetBool())
        this.New = undefined;
    else
        this.New = Reader.GetLong();

    this.Redo(Class);
};

function CChangesMathEqArrayPr(NewPr, OldPr)
{
    this.New = NewPr;
    this.Old = OldPr;
}
CChangesMathEqArrayPr.prototype.Type = historyitem_Math_EqArrayPr;
CChangesMathEqArrayPr.prototype.Undo = function(Class)
{
    Class.raw_SetPr(this.Old);
};
CChangesMathEqArrayPr.prototype.Redo = function(Class)
{
    Class.raw_SetPr(this.New);
};
CChangesMathEqArrayPr.prototype.Save_Changes = function(Writer)
{
    // Bool : undefined?
    // Long : value
    if (undefined === this.New)
        Writer.WriteBool(true);
    else
    {
        Writer.WriteBool(false);
        this.New.Write_ToBinary(Writer);
    }
};
CChangesMathEqArrayPr.prototype.Load_Changes = function(Reader, Class)
{
    if (true === Reader.GetBool())
        this.New = undefined;
    else
    {
        this.New = new CMathEqArrPr();
        this.New.Read_FromBinary(Reader);
    }

    this.Redo(Class);
};


function CChangesMathBaseReviewType(NewType, NewInfo, OldType, OldInfo)
{
    this.NewType = NewType;
    this.NewInfo = NewInfo ? NewInfo.Copy() : undefined;
    this.OldType = OldType;
    this.OldInfo = OldInfo ? OldInfo.Copy() : undefined;
}
CChangesMathBaseReviewType.prototype.Type = historyitem_Math_ReviewType;
CChangesMathBaseReviewType.prototype.Undo = function(Class)
{
    Class.raw_SetReviewType(this.OldType, this.OldInfo);
};
CChangesMathBaseReviewType.prototype.Redo = function(Class)
{
    Class.raw_SetReviewType(this.NewType, this.NewInfo);
};
CChangesMathBaseReviewType.prototype.Save_Changes = function(Writer)
{
    // Long        : ReviewType
    // Bool        : ReviewInfo undefined ?
    //   false     : ReviewInfo

    Writer.WriteLong(this.NewType);

    if (undefined === this.NewInfo)
    {
        Writer.WriteBool(true);
    }
    else
    {
        Writer.WriteBool(false);
        this.NewInfo.Write_ToBinary(Writer);
    }
};
CChangesMathBaseReviewType.prototype.Load_Changes = function(Reader, Class)
{
    // Long        : ReviewType
    // CReviewInfo : ReviewInfo

    this.NewType = Reader.GetLong();

    if (true === Reader.GetBool())
    {
        this.NewInfo = undefined;
    }
    else
    {
        this.NewInfo = new CReviewInfo();
        this.NewInfo.Read_FromBinary(Reader);
    }

    this.Redo(Class);
};

function MatGetKoeffArgSize(FontSize, ArgSize)
{
    var FontKoef = 1;

    if(ArgSize == -1)
    {
        FontKoef = g_dMathArgSizeKoeff_1;
    }
    else if(ArgSize == -2)
    {
        FontKoef = g_dMathArgSizeKoeff_2;
    }

    if (1 !== FontKoef )
    {
        FontKoef = (((FontSize * FontKoef * 2 + 0.5) | 0) / 2) / FontSize;
    }

    return FontKoef;
}

function CMathRecalculateInfo()
{
    this.bInline                = false;
    this.bChangeInline          = true;
    this.bRecalcCtrPrp          = false; // необходимо для пересчета CtrPrp (когда изменились текстовые настройки у первого элемнента, ctrPrp нужно пересчитать заново для всей формулы)
    this.bCorrect_FontSize      = false;

    this.IntervalState          = MATH_INTERVAL_EMPTY;
    this.XStart                 = 0;
    this.XEnd                   = 0;
    this.XRange                 = 0;
    this.XLimit                 = 0;
    this.IndLeft                = 0;
    this.bInternalRanges        = false;

    this.RangeY                 = null; // max среди нижних границ плавающих объектов
    this.ShiftY                 = 0;
}
CMathRecalculateInfo.prototype.Reset = function(PRS, ParaPr)
{
    this.XRange                 = PRS.XStart + ParaPr.Ind.Left;
    this.XLimit                 = PRS.XLimit;
    this.IndLeft                = ParaPr.Ind.Left;
    this.ShiftY                 = 0;

    this.Reset_WrapSettings();
};
CMathRecalculateInfo.prototype.Reset_WrapSettings = function()
{
    this.RangeY                 = null;

    this.bInternalRanges        = false;
    this.IntervalState          = MATH_INTERVAL_EMPTY;

    this.XStart                 = this.XRange;
    this.XEnd                   = this.XLimit;
};
CMathRecalculateInfo.prototype.UpdateShiftY = function(RY)
{
    this.ShiftY = RY;
};
CMathRecalculateInfo.prototype.ClearRecalculate = function()
{
    this.bChangeInline     = false;
    this.bRecalcCtrPrp     = false;
    this.bCorrect_FontSize = false;
};

function CMathRecalculateObject()
{
    this.WrapState        = ALIGN_EMPTY;
    this.MaxW             = 0;              // для рассчета выравнивания формулы нужно учитывать изменилась ли максимальная ширина или нет
    this.bWordLarge       = false;          // если формула выходит за границы докумена, то не нужно учитывать выравнивание, а значит можно сделать быстрый пересчет
    this.bFastRecalculate = true;           /*если добавляем буквы во внутренний контент, который не бьется на строки, то отменяем быстрый пересчет,
                                            т.к. высота контента может поменяться (она рассчитывается точно исходя из размеров внутр элементов)*/

    this.bInline          = false;
    this.Align            = align_Justify;
    this.bEmptyFirstRange = false;
}
CMathRecalculateObject.prototype.Fill = function(StructRecalc)
{
    this.bFastRecalculate = StructRecalc.bFastRecalculate;
    this.bInline          = StructRecalc.bInline;
    this.Align            = StructRecalc.Align;

    var PageInfo          = StructRecalc.PageInfo;

    this.WrapState        = PageInfo.GetCurrentWrapState();
    this.MaxW             = PageInfo.GetCurrentMaxWidthAllLines();
    this.bWordLarge       = PageInfo.GetCurrentStateWordLarge();

    this.bEmptyFirstRange = StructRecalc.bEmptyFirstRange;
};
CMathRecalculateObject.prototype.Load_MathInfo = function(PageInfo)
{
    PageInfo.SetCurrentWrapState(this.WrapState);

    // текущая MaxW и MaxW в PageInfo это не одно и то же
    //PageInfo.SetCurrentMaxWidth(this.MaxW);
};
CMathRecalculateObject.prototype.Compare = function(PageInfo)
{
    var result = true;

    if(this.bFastRecalculate == false)
        result = false;

    if(this.WrapState !== PageInfo.GetCurrentWrapState())
        result = false;

    if(this.bEmptyFirstRange !== PageInfo.bEmptyFirstRange)
        result = false;

    var DiffMaxW = this.MaxW - PageInfo.GetCurrentMaxWidthAllLines();

    if(DiffMaxW < 0)
        DiffMaxW = -DiffMaxW;

    var LargeComposition = this.bWordLarge == true && true == PageInfo.GetCurrentStateWordLarge();

    if(LargeComposition == false && this.bInline == false && this.Align == align_Justify && DiffMaxW > 0.001)
        result = false;

    return result;
};