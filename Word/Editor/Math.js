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
    this.Widths         = [];

    this.bLarge         = false;
    this.MinW           = 0; // without first line
    this.MaxW           = 0; // without first line
}
CParaMathLineWidths.prototype.UpdateWidth = function(Line, W)
{
    var bFastUpdate = false;

    if(Line >= this.Widths.length)
    {
        bFastUpdate = true;
        this.Widths[Line] = new CMathParametersWidth();
    }

    var bUpdMaxWidth = false;

    var bNeedUpdate = bFastUpdate == false && Math.abs(this.Widths[Line].Measure - W) > 0.00001;

    this.Widths[Line].Measure = W; // присваиваем до RecalcMaxMin

    if(Line !== 0)
    {
        if(bFastUpdate)
        {
            bUpdMaxWidth = this.UpdateMinMax(Line);
        }
        else if(bNeedUpdate)
        {
            var lng = this.Widths.length;
            var Max = this.MaxW;

            if(lng > 1)
            {
                this.MaxW = this.Widths[1].Measure;
                this.MinW = this.Widths[1].Measure;

                for(var i = 2; i < lng; i++)
                {
                    this.UpdateMinMax(i);
                }
            }

            bUpdMaxWidth = Math.abs(Max - this.MaxW) > 0.0001;
        }
    }

    return bUpdMaxWidth;
};
CParaMathLineWidths.prototype.SetWordLarge = function(Line, bWordLarge)
{
    if(Line >= this.Widths.length)
    {
        this.Widths[Line] = new CMathParametersWidth();

        this.bLarge = this.bLarge || bWordLarge;
    }
    else
    {
        if(this.Widths[Line].bMathWordLarge !== bWordLarge)
        {
            this.Widths[Line].bMathWordLarge = bWordLarge;

            var Lng = this.Widths.length;

            this.bLarge = false;
            for(var Pos = 0; Pos < Lng; Pos++)
            {
                if(this.Widths[Pos].bMathWordLarge == true)
                {
                    this.bLarge = true;
                    break;
                }
            }
        }
    }
};
CParaMathLineWidths.prototype.IsLarge = function()
{
    return this.bLarge;
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
CParaMathLineWidths.prototype.GetMin = function()
{
    return this.MinW;
};
CParaMathLineWidths.prototype.UpdateMinMax = function(Pos)
{
    var bUpdMaxWidth = false;

    var Item = this.Widths[Pos].Measure;

    if(this.MaxW < Item)
    {
        this.MaxW = Item;
        bUpdMaxWidth = true;
    }

    if(this.MinW > Item)
    {
        this.MinW = Item;
    }

    return bUpdMaxWidth;
};
CParaMathLineWidths.prototype.private_GetW = function(CurLine)
{
    var res;

    if(CurLine < this.Widths.length)
        res = this.Widths[CurLine].Measure;

    return res;
};
CParaMathLineWidths.prototype.GetCountLines = function()
{
    return this.Widths.length;
};

function CMathInfo()
{
    this.FirstLineOnPage  = -1;
    this.WrapState        = ALIGN_EMPTY;
    this.LineWidths       = new CParaMathLineWidths();
    this.bWordLarge       = false;
    this.NeedUpdateWrap   = true;
}
CMathInfo.prototype.GetFirstLineOnPage = function()
{
    return this.FirstLineOnPage;
};
CMathInfo.prototype.GetCountLines = function()
{
    return this.LineWidths.GetCountLines();
};
CMathInfo.prototype.GetNumberLine = function(Line)
{
    return Line - this.FirstLineOnPage;
};

function CMathPageInfo()
{
    this.Info        = [];
    this.StartLine   = -1;
    this.StartPage   = -1;
    this.CurPage     = -1;
}
CMathPageInfo.prototype.Reset = function()
{
    this.CurPage     = -1;
    this.Info.length =  0;
};
CMathPageInfo.prototype.SetStartPos = function(Page, StartLine)
{
    this.StartPage   = Page;
    this.StartLine   = StartLine;
};
CMathPageInfo.prototype.UpdateCurrentPage = function(Page)
{
    this.CurPage = Page - this.StartPage;
};
CMathPageInfo.prototype.UpdateCurrentWrap = function(DispDef, bInline)
{
    this.private_CheckInfo(this.CurPage);

    if(this.Info[this.CurPage].NeedUpdateWrap == true)
    {
        var WrapState;

        if(DispDef == false || bInline == true)
            WrapState = ALIGN_EMPTY;
        else if(this.CurPage == 0)
            WrapState = ALIGN_MARGIN_WRAP;
        else
            WrapState = ALIGN_MARGIN;

        this.Info[this.CurPage].WrapState = WrapState;
        this.Info[this.CurPage].NeedUpdateWrap = false;
    }
};
CMathPageInfo.prototype.GetCurrentWrapState = function()
{
    return this.Info[this.CurPage].WrapState;
};
CMathPageInfo.prototype.SetCurrentWrapState = function(WrapState)
{
    this.Info[this.CurPage].WrapState = WrapState;
};
CMathPageInfo.prototype.SetNextWrapState = function()
{
    var InfoPage = this.Info[this.CurPage];

    if(InfoPage.WrapState !== ALIGN_EMPTY)
        InfoPage.WrapState++;
};
CMathPageInfo.prototype.SetStateWordLarge = function(_Line, bWordLarge)
{
    this.private_CheckInfo(this.CurPage);

    var Line = this.Info[this.CurPage].GetNumberLine(_Line - this.StartLine);

    this.Info[this.CurPage].LineWidths.SetWordLarge(Line, bWordLarge);

    //var Line = _Line - this.StartLine - this.Info[this.CurPage].FirstLineOnPage;
};
CMathPageInfo.prototype.GetWrap = function(_Page)
{
    var Page = _Page - this.StartPage;

    return this.Info[Page].WrapState;
};
CMathPageInfo.prototype.GetCurrentStateWordLarge = function()
{
    return this.Info[this.CurPage].LineWidths.IsLarge();
};
CMathPageInfo.prototype.IsFirstPage = function(_Page)
{
    return _Page - this.StartPage == 0;
};
CMathPageInfo.prototype.GetStarLinetWidth = function()
{
    return this.Info[0].LineWidths.Get(0);
};
CMathPageInfo.prototype.UpdateCurrentWidth = function(_Line, Width)
{
    this.private_CheckInfo(this.CurPage);

    var Line = this.Info[this.CurPage].GetNumberLine(_Line - this.StartLine);
    //var Line = _Line - this.StartLine - this.Info[this.CurPage].FirstLineOnPage;

    return this.Info[this.CurPage].LineWidths.UpdateWidth(Line, Width);
};
CMathPageInfo.prototype.GetCurrentMaxWidth = function()
{
    return this.Info[this.CurPage].LineWidths.GetMax();
};
CMathPageInfo.prototype.GetCurrentMaxWidthAllLines = function()
{
    var MaxW = 0;
    if(this.CurPage !== 0)
    {
        MaxW = this.Info[this.CurPage].LineWidths.GetMax();
    }
    else
    {
        var MaxWOFirst = this.Info[this.CurPage].LineWidths.GetMax(),
            FirstW     = this.Info[this.CurPage].LineWidths.GetFirst();

        var MathSettings = Get_WordDocumentDefaultMathSettings(),
            WrapState = this.GetCurrentWrapState();

        var wrapIndent = MathSettings.Get_WrapIndent(WrapState);

        MaxW = FirstW > wrapIndent + MaxWOFirst ? FirstW: MaxWOFirst + wrapIndent;
    }

    return MaxW;
};
CMathPageInfo.prototype.GetMaxWidthOnPage = function(_Page) // without first page
{
    var Page = _Page - this.StartPage;

    return this.Info[Page].LineWidths.GetMax();
};
CMathPageInfo.prototype.SetCurrentMaxWidth = function(MaxW)
{
    this.Info[this.CurPage].MaxW = MaxW;
};
CMathPageInfo.prototype.private_CheckInfo = function(_CurrentPage)
{
    var Lng = this.Info.length;
    if(_CurrentPage >= Lng)
    {
        var PrevInfo = this.Info[Lng - 1];
        var FirstLineOnPage = Lng == 0 ? 0 : PrevInfo.FirstLineOnPage + PrevInfo.GetCountLines();

        this.Info[_CurrentPage] = new CMathInfo();
        this.Info[_CurrentPage].FirstLineOnPage = FirstLineOnPage;
    }
};
CMathPageInfo.prototype.GetFirstLineOnPage = function(_Page)
{
    var Page = _Page - this.StartPage;

    var FirstLineOnPage = this.Info[Page].GetFirstLineOnPage();

    return this.StartLine + FirstLineOnPage;
};


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

    this.NearPosArray       = [];

    this.Width              = 0;
    this.WidthVisible       = 0;
    this.Height             = 0;
    this.Ascent             = 0;
    this.Descent            = 0;

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

    /// argSize, bDot и bRoot выставить на объединении контентов

    NewMath.Root.Correct_Content(true);

    return NewMath;
};

ParaMath.prototype.Set_Paragraph = function(Paragraph)
{
    this.Paragraph = Paragraph;
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
    // TODO: ParaMath.Get_TextPr

    var TextPr = new CTextPr();

    var mTextPr = this.Root.Get_TextPr(_ContentPos, Depth);
    TextPr.Merge( mTextPr );


    return TextPr;
};

ParaMath.prototype.Get_CompiledTextPr = function(Copy)
{
    // TODO: ParaMath.Get_CompiledTextPr

    //var TextPr = new CTextPr();

    var oContent = this.GetSelectContent();
    var mTextPr = oContent.Content.Get_CompiledTextPr(Copy);
    //TextPr.Merge( mTextPr );

    return mTextPr;
};

ParaMath.prototype.Add = function(Item)
{
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
            var ctrPrp = oContent.Parent.Get_CtrPrp(); // копия ctrPrp
            Run.Apply_TextPr(ctrPrp, undefined, true);
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
        oContent.Apply_TextPr(TextPr, undefined, false, Pos_ApplyTextPr);
        //oContent.Set_MathTextPr2(MathTxtPr.TextPr, MathTxtPr.MathPr, false, StartPos + 1, lng2 - lng);
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
    var X = _X;

    var MathSettings = Get_WordDocumentDefaultMathSettings();

    var AbsolutePage = this.Paragraph == null ? 0 : this.Paragraph.Get_StartPage_Absolute();
    var Page = AbsolutePage + _Page;

    var WrapState = this.PageInfo.GetWrap(Page);

    var wrapIndent = MathSettings.Get_WrapIndent(WrapState);

    _X      +=  MathSettings.Get_LeftMargin(WrapState);
    _XLimit -=  MathSettings.Get_RightMargin(WrapState);

    var Jc = this.Get_Align();

    var LinesCount = this.Root.protected_GetLinesCount();


    var StartLineWidth = LinesCount > 0 ? this.PageInfo.GetStarLinetWidth() : 0; // если страница не первая, то ширину первой строки формулы не учитываем

    var W = 0;
    var MaxW = this.PageInfo.GetMaxWidthOnPage(Page);

    if( this.PageInfo.IsFirstPage(Page) ) // CurrentPage == 0
    {
        var bSingleLine = LinesCount == 1 && this.Root.Math_Is_End(_CurLine, _CurRange);
        if(bSingleLine)  // чтобы не сравнивать с wrapIndent, когда формула занимает одну строку
            W = StartLineWidth;
        else
            W = Math.max(MaxW + wrapIndent, StartLineWidth);
    }
    else
    {
        W = MaxW;
    }

    if(this.Root.IsStartLine(_CurLine)) // первая строка первой страницы
    {
        switch(Jc)
        {
            case align_Left:    X = _X; break;
            case align_Right:   X = Math.max(_XLimit - StartLineWidth, _X); break;
            case align_Center:  X = Math.max(_X + (_XLimit - _X - StartLineWidth)/2, _X); break;
            case align_Justify:
            {
                X = Math.max(_X + (_XLimit - _X - W)/2, _X);
                break;
            }
        }
    }
    else
    {
        if(Jc == align_Justify)
        {
            X = _XLimit - _X > W ? _X + (_XLimit - _X - W)/2 + wrapIndent : _X;
        }
        else
        {
            X = _XLimit - _X > W ? _X + wrapIndent : _X;
        }
    }


    return X;
};
ParaMath.prototype.Remove = function(Direction, bOnAddText)
{
    var oSelectedContent = this.GetSelectContent();

    var nStartPos = oSelectedContent.Start;
    var nEndPos = oSelectedContent.End;
    var oContent = oSelectedContent.Content;

    if (nStartPos === nEndPos)
    {
        var oElement = oContent.getElem(nStartPos);

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
            oContent.Remove_FromContent(nStartPos, 1);

            oContent.CurPos = nStartPos;

            if (para_Math_Run === oContent.Content[nStartPos].Type)
                oContent.Content[nStartPos].Cursor_MoveToStartPos();

            oContent.Correct_Content();
            oContent.Correct_ContentPos(-1); // -1, потому что нам надо встать перед элементом, а не после

            this.Selection_Remove();
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

        oContent.CurPos = nStartPos;
        oContent.Correct_Content();
        oContent.Correct_ContentPos(Direction);
        this.Selection_Remove();
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
    // TODO: ParaMath.Apply_TextPr

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
    // TODO: ParaMath.Create_FontMap

    // Styles.js
    // Document_CreateFontMap

    this.Root.Create_FontMap(Map);

};

ParaMath.prototype.Get_AllFontNames = function(AllFonts)
{
    // TODO: ParaMath.Get_AllFontNames

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

    if ( this.Paragraph !== PRS.Paragraph )
    {
        this.Paragraph = PRS.Paragraph;
        this.protected_UpdateSpellChecking();
    }

    var AbsolutePage = this.Paragraph == null ? 0 : this.Paragraph.Get_StartPage_Absolute();

    var Para      = PRS.Paragraph;
    var ParaLine  = PRS.Line;
    var ParaRange = PRS.Range;
    var Page      = AbsolutePage + PRS.Page;

    var PrevLineObject = PRS.RestartPageRecalcInfo.Object;
    var bStartLine = this.Root.IsStartLine(ParaLine);

    var MathSettings = Get_WordDocumentDefaultMathSettings();

    // информация о пересчете
    var RPI = new CRPI();
    RPI.MergeMathInfo(this.ParaMathRPI);
    var ArgSize = new CMathArgSize();

    // первый пересчет
    if(PrevLineObject == null && true == bStartLine && PRS.bFastRecalculate == false)
    {
        this.PageInfo.Reset();
        this.PageInfo.SetStartPos(Page, ParaLine);

        this.Root.PreRecalc(null, this, ArgSize, RPI);
    }

    // пока будем каждый раз обновлять информацию (т.к. когда не inline формула становиться inline может получиться так, что пересчет для первой строки не придет)
    // когда пересчет всегда будет приходить для первой строки, эта часть будет выполняться только при первом пересчете первой строки

    this.Root.Set_Paragraph(Para);
    this.Root.Set_ParaMath(this, null);

    ////////////////////////////////////////////////////////////

    this.PageInfo.UpdateCurrentPage(Page);

    var DispDef = MathSettings.Get_DispDef(),
        bInline = this.ParaMathRPI.bInline;

    //здесь обновляем WrapState, исходя из этого параметра будем считать WrapIndent
    this.PageInfo.UpdateCurrentWrap(DispDef, bInline);

    var WrapState = this.PageInfo.GetCurrentWrapState();

    PRS.X    += MathSettings.Get_LeftMargin(WrapState);
    PRS.XEnd -= MathSettings.Get_RightMargin(WrapState);

    var WrapIndent = MathSettings.Get_WrapIndent(WrapState);

    PRS.WrapIndent = WrapIndent;

    if(bStartLine == false)
    {
        PRS.X += WrapIndent;
        PRS.bCompareWrapIndent = false;
    }
    else
    {
        PRS.bCompareWrapIndent = true;
    }

    PRS.XRange = PRS.X;

    if(PrevLineObject == null ||  PrevLineObject == this)
    {
        PRS.RecalcResult = recalcresult_NextLine;
        PRS.Reset_RestartPageRecalcInfo();
    }

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

        if(PRS.FirstItemOnLine == true && PRS.X + PRS.SpaceLen + PRS.WordLen > PRS.XEnd)
        {
            PRS.bMathWordLarge = true;
        }

        this.UpdateWidthLine(PRS, WidthLine);
    }

    var bWordLarge =  PRS.bMathWordLarge == true && WrapState == ALIGN_EMPTY;
    this.PageInfo.SetStateWordLarge(PRS.Line, bWordLarge);

    if(PRS.bMathWordLarge == true && WrapState !== ALIGN_EMPTY)
    {
        this.UpdateInfoForBreak(PRS);
        this.PageInfo.SetNextWrapState();
    }

    this.ParaMathRPI.ClearRecalculate();
};
ParaMath.prototype.UpdateInfoForBreak = function(PRS)
{
    var AbsolutePage = this.Paragraph == null ? 0 : this.Paragraph.Get_StartPage_Absolute();
    var Page      = AbsolutePage + PRS.Page;

    PRS.Set_RestartPageRecalcInfo(this.PageInfo.GetFirstLineOnPage(Page), this);
    PRS.RecalcResult = recalcresult_PrevLine;
    PRS.NewRange = true;
};
ParaMath.prototype.Save_MathInfo = function(Copy)
{
    var RecalculateObject = new CMathRecalculateObject();

    var StructRecalc =
    {
        bFastRecalculate:   this.bFastRecalculate,
        PageInfo:           this.PageInfo,
        bInline:            this.ParaMathRPI.bInline,
        Align:              this.Get_Align()
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
ParaMath.prototype.Recalculate_Reset = function(CurRange, CurLine)
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
    this.Root.Recalculate_LineMetrics(PRS, ParaPr, _CurLine, _CurRange, ContentMetrics);
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
        var W = Width - PRS.OperGapRight - PRS.OperGapLeft;
        var bChangeMaxW = this.PageInfo.UpdateCurrentWidth(PRS.Line, W);

        if(bChangeMaxW == true && this.ParaMathRPI.bInline == false && align_Justify == this.Get_Align())
            this.UpdateInfoForBreak(PRS);
    }
};
ParaMath.prototype.Recalculate_Range_Spaces = function(PRSA, _CurLine, _CurRange, _CurPage)
{
    // до пересчета Bounds для текущей строки ранее должны быть вызваны Recalculate_Range_Width (для ширины), Recalculate_LineMetrics(для высоты и аскента)

    var Page = 0;
    if ( this.Paragraph !== null)
        Page = this.Paragraph.Get_StartPage_Absolute();

    var pos = new CMathPosition();
    this.Root.setPosition(pos, PRSA, _CurLine, _CurRange, Page + _CurPage);

    this.Root.Recalculate_Range_Spaces(PRSA, _CurLine, _CurRange, Page + _CurPage);
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
    return true;
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
    // TODO переделать
    if (true === this.NeedResize)
    {
        var RPI = new CRPI();
        RPI.MergeMathInfo(this.ParaMathRPI);

        this.Root.PreRecalc(null, this,  new CMathArgSize(), RPI);
        this.Root.Resize(g_oTextMeasurer, RPI);

        this.Width        = this.Root.size.width;
    }

    if ( false === MinMax.bWord )
    {
        MinMax.bWord    = true;
        MinMax.nWordLen = this.Width;
    }
    else
    {
        MinMax.nWordLen += this.Width;
    }

    if ( MinMax.nSpaceLen > 0 )
    {
        MinMax.nCurMaxWidth += MinMax.nSpaceLen;
        MinMax.nSpaceLen     = 0;
    }

    MinMax.nCurMaxWidth += this.Width;
};

ParaMath.prototype.Get_Range_VisibleWidth = function(RangeW, _CurLine, _CurRange)
{
    var CurLine = _CurLine - this.StartLine;
    var CurRange = ( 0 === CurLine ? _CurRange - this.StartRange : _CurRange );

    var StartPos = this.protected_GetRangeStartPos(CurLine, CurRange);
    var EndPos   = this.protected_GetRangeEndPos(CurLine, CurRange);

    if ( EndPos >= 1 )
    {
        RangeW.W += this.Width;
    }
};

ParaMath.prototype.Is_BrkBinBefore = function()
{
    var MathSettings = Get_WordDocumentDefaultMathSettings();

    return this.Is_Inline() ? false : MathSettings.Get_BrkBin() == BREAK_BEFORE;
};
ParaMath.prototype.Shift_Range = function(Dx, Dy, _CurLine, _CurRange)
{
    this.Root.Shift_Range(Dx, Dy, _CurLine, _CurRange);
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
        this.bFastRecalculate = false;
    }
};
ParaMath.prototype.Get_Inline = function()
{
    return this.ParaMathRPI.bInline;
};
ParaMath.prototype.Is_Inline = function()
{
    return this.ParaMathRPI.bInline;
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
ParaMath.prototype.GetFirstRPrp = function()
{
    return this.Root.getFirstRPrp(this);
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
    if(false == this.Root.IsEmptyLine(PDSH.Line, PDSH.Range))
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

            var Bounds = this.Root.Get_LineBound(PDSH.Line);
            Comm.Add(Bounds.Y, Bounds.Y + Bounds.H, Bounds.X, Bounds.X + Bounds.W, 0, 0, 0, 0, { Active : CommentsFlag === comments_ActiveComment ? true : false, CommentId : CommentId } );
        }

        if (null !== CollFirst)
        {
            var Bounds = this.Root.Get_LineBound(PDSH.Line);
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

    PDSE.X = X + this.Root.Get_LineBound(PDSE.Line).W;

    /*PDSE.Graphics.p_color(255,0,0, 255);
     PDSE.Graphics.drawHorLine(0, PDSE.Y - this.Ascent + this.Height, PDSE.X - 30, PDSE.X + this.Width + 30 , 1);*/
};
ParaMath.prototype.GetLinePosition = function(Line)
{
    return this.Root.GetPos(Line);
};
ParaMath.prototype.Draw_Lines = function(PDSL)
{
    if(false == this.Root.IsEmptyLine(PDSL.Line, PDSL.Range))
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

        var Bound = this.Root.Get_LineBound(PDSL.Line),
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

ParaMath.prototype.old_Get_ParaContentPosByXY = function(SearchPos, Depth, _CurLine, _CurRange, StepEnd, Flag) // получить логическую позицию по XY
{
    var Result = false;

    var CurLine  = _CurLine - this.StartLine;
    var CurRange = ( 0 === CurLine ? _CurRange - this.StartRange : _CurRange ); // если находимся в нулевой строке (для текущей позиции), то CurRange мб ненулевой

    var EndPos   = this.protected_GetRangeEndPos(CurLine, CurRange);

    // Проверяем, попали ли мы в формулу

    if ( EndPos >= 1 )
    {
        var Dx = this.Root.size.width;
        var D = SearchPos.X - SearchPos.CurX;

        var CurX = SearchPos.CurX;

        Result = this.Root.Get_ParaContentPosByXY(SearchPos, Depth, _CurLine, _CurRange, StepEnd);

        if ( D >= - 0.001 && D <= Dx + 0.001 )
        {
            SearchPos.InText = true;
            SearchPos.DiffX  = 0.001;

            SearchPos.InTextPos.Copy_FromDepth(SearchPos.Pos, Depth);
        }

        SearchPos.CurX = CurX + Dx;
    }

    return Result;
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

    // TODO: ParaMath.Get_PosByElement

    return false;
};

ParaMath.prototype.Get_ElementByPos = function(ContentPos, Depth)
{
    return this.Root.Get_ElementByPos(ContentPos, Depth);
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
    return null;
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
    // TODO: ParaMath.Selection_IsEmpty

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
    var oContent = this.GetSelectContent().Content;

    if (oContent.bRoot)
        return null;

    var Bounds = oContent.Get_Bounds();
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

    //var Pos = ContentPos.Get(Depth);

    /*if(this.Root.Content[Pos].Type == para_Math_Run)
    {


        var NewRun = this.Root.Content[Pos].Split(ContentPos, Depth+1);
        NewParaMath.Root.Add_ToContent(0, NewRun);

        var len = this.Root.Content.length;

        if(Pos < len - 1)
        {
            NewParaMath.Root.Concat_ToContent( this.Root.Content.slice(Pos + 1) );
            this.Root.Remove_FromContent(Pos+1, len - Pos - 1);
        }

        this.SetNeedResize();
        NewParaMath.SetNeedResize();

    }*/

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
        return [{X : 0, Y : 0, W : 0, H : 0, Page : 0}];
    else
        return this.Root.Get_Bounds();
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
    this.bChangeInline     = true;
    this.bRecalcCtrPrp     = false; // необходимо для пересчета CtrPrp (когда изменились текстовые настройки у первого элемнента, ctrPrp нужно пересчитать заново для всей формулы)
    this.bInline           = false;
    this.bCorrect_FontSize = false;
}
CMathRecalculateInfo.prototype.ClearRecalculate = function()
{
    this.bRecalcCtrPrp   = false;
    this.bChangeInline   = false;
    this.bRecalcCtrPrp   = false;
    this.bCorrect_FontSize = false;
};

function CMathRecalculateObject()
{
    this.WrapState        = ALIGN_EMPTY;
    this.MaxW             = 0;              // для рассчета выравнивания формулы нужно учитывать изменилась ли максимальная ширина или нет
    this.bWordLarge       = false;          // если формула выходит за границы докумена, то не нужно учитывать выравнивание, а значит можно сделать быстрый пересчет
    this.bFastRecalculate = true;   /*если добавляем буквы во внутренний контент, который не бьется на строки, то отменяем быстрый пересчет,
                                      т.к. высота контента может поменяться (она рассчитывается точно исходя из размеров внутр элементов)*/

    this.bInline          = false;
    this.Align            = align_Justify;
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

    var DiffMaxW = this.MaxW - PageInfo.GetCurrentMaxWidthAllLines();

    if(DiffMaxW < 0)
        DiffMaxW = -DiffMaxW;

    var LargeComposition = this.bWordLarge == true && true == PageInfo.GetCurrentStateWordLarge();

    if(LargeComposition == false && this.bInline == false && this.Align == align_Justify && DiffMaxW > 0.001)
        result = false;

    return result;
};