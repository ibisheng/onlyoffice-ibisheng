/**
 * Created by Ilja.Kirillov on 18.03.14.
 */

function ParaMath2()
{
    this.Id = g_oIdCounter.Get_NewId();

    this.Type  = para_Math;

    this.Jc   = undefined;
    this.Math = new CMathComposition();
    this.Math.Parent = this;

    this.Paragraph  = null;

    this.StartLine  = 0;
    this.StartRange = 0;

    this.Lines       = []; // Массив CParaRunLine
    this.Lines[0]    = new CParaRunLine();
    this.LinesLength = 0;

    this.Range = this.Lines[0].Ranges[0];

    this.Width        = 0;
    this.WidthVisible = 0;
    this.Height       = 0;
    this.Ascent       = 0;
    this.Descent      = 0;

    // Добавляем данный класс в таблицу Id (обязательно в конце конструктора)
    g_oTableId.Add( this, this.Id );
}

ParaMath2.prototype =
{
    Get_Id : function()
    {
        return this.Id;
    },

    Copy : function(Selected)
    {
        // TODO: ParaMath.Copy

        var NewMath = new ParaMath();

        return NewMath;
    },

    Set_Paragraph : function(Paragraph)
    {
        this.Paragraph = Paragraph;
    },

    Is_Empty : function()
    {
        return this.Math.Is_Empty();
    },

    Is_StartFromNewLine : function()
    {
        return false;
    },

    Get_TextPr : function(_ContentPos, Depth)
    {
        // TODO: ParaMath.Get_TextPr

        return new CTextPr();
    },

    Get_CompiledTextPr : function(Copy)
    {
        // TODO: ParaMath.Get_CompiledTextPr

        var TextPr = new CTextPr();
        TextPr.Init_Default();

        return TextPr;
    },

    Add : function(Item)
    {
        var Type = Item.Type;

        if ( para_Text === Type )
            this.Math.AddLetter( Item.Value.charCodeAt(0) );
        else if ( para_Space === Type )
            this.Math.AddLetter( 0x0020 );
        else if ( para_Math === Type )
        {
            var rPr = this.Math.GetCurrentRunPrp();
            Item.Math.Root.setRPrp(rPr);
            this.Math.AddToComposition(Item.Math.Root);
        }
    },

    AddText : function(oElem, sText, props)
    {
        if(sText)
        {
            var rPr = new CTextPr();
            var oMRun = new CMathRunPrp();
            if (props)
                oMRun.setMathRunPrp(props);
            oMRun.setTxtPrp(rPr);
            if (oElem)
            {
                oElem.addElementToContent(oMRun);
                for (var i=0;i<sText.length;i++)
                {
                    /*text[i].replace("&",	"&amp;");
                     text[i].Replace("'",	"&apos;");
                     text[i].Replace("<",	"&lt;");
                     text[i].Replace(">",	"&gt;");
                     text[i].Replace("\"",	"&quot;");*/
                    oText = new CMathText();
                    oText.addTxt(sText[i]);
                    oElem.addElementToContent(oText);
                }
            }
        }
    },

    CreateElem : function (oElem, oParent, props)
    {
        /*var ctrPrp = new CTextPr();
         oElem.setCtrPrp(ctrPrp);*/
        oElem.relate(oParent);
        oElem.init(props);

        if (oParent)
            oParent.addElementToContent(oElem);

    },

    CreateFraction : function (oFraction,oParentElem,props,sNumText,sDenText)
    {
        this.CreateElem(oFraction, oParentElem, props);

        var oElemDen = oFraction.getDenominator();
        this.AddText(oElemDen, sDenText);

        var oElemNum = oFraction.getNumerator();
        this.AddText(oElemNum, sNumText);
    },

    CreateDegree : function (oDegree, oParentElem,props,sBaseText,sSupText,sSubText)
    {
        this.CreateElem(oDegree, oParentElem, props);

        var oElem = oDegree.getBase();
        this.AddText(oElem, sBaseText);

        var oSup = oDegree.getUpperIterator();
        this.AddText(oSup, sSupText);

        var oSub = oDegree.getLowerIterator();
        this.AddText(oSub, sSubText);
    },

    CreateRadical : function (oRad,oParentElem,props,sElemText,sDegText)
    {
        this.CreateElem(oRad, oParentElem, props);

        var oElem = oRad.getBase();
        this.AddText(oElem, sElemText);

        var oDeg = oRad.getDegree();
        this.AddText(oDeg, sDegText);
    },

    CreateNary : function (oNary,oParentElem,props,sElemText,sSubText,sSupText)
    {
        this.CreateElem(oNary, oParentElem, props);

        var oElem = oNary.getBase();
        this.AddText(oElem, sElemText);

        var oSub = oNary.getLowerIterator();
        this.AddText(oSub, sSubText);

        var oSup = oNary.getUpperIterator();
        this.AddText(oSup, sSupText);
    },

    CreateBox : function (oBox,oParentElem,props,sElemText)
    {
        this.CreateElem(oBox, oParentElem, props);

        var oElem = oBox.getBase();
        this.AddText(oElem, sElemText);
    },

    Remove : function(Direction, bOnAddText)
    {
        return this.Math.Remove(Direction, bOnAddText);
    },

    Get_CurrentParaPos : function()
    {
        var CurPos = this.State.ContentPos;

        if ( CurPos >= 0 && CurPos < this.Content.length )
            return this.Content[CurPos].Get_CurrentParaPos();

        return new CParaPos( this.StartRange, this.StartLine, 0, 0 );
    },

    Apply_TextPr : function(TextPr, IncFontSize, ApplyToAll)
    {
        // TODO: ParaMath.Apply_TextPr
    },

    Check_NearestPos : function(ParaNearPos, Depth)
    {
    },

    Get_DrawingObjectRun : function(Id)
    {
        return null;
    },

    Get_DrawingObjectContentPos : function(Id, ContentPos, Depth)
    {
        return false;
    },

    Get_Layout : function(DrawingLayout, UseContentPos, ContentPos, Depth)
    {
    },

    Get_NextRunElements : function(RunElements, UseContentPos, Depth)
    {
    },

    Get_PrevRunElements : function(RunElements, UseContentPos, Depth)
    {
    },

    Collect_DocumentStatistics : function(ParaStats)
    {
        // TODO: ParaMath.Collect_DocumentStatistics
    },

    Create_FontMap : function(Map)
    {
        // TODO: ParaMath.Create_FontMap
    },

    Get_AllFontNames : function(AllFonts)
    {
        // TODO: ParaMath.Get_AllFontNames
    },
//-----------------------------------------------------------------------------------
// Функции пересчета
//-----------------------------------------------------------------------------------

    Recalculate_Reset : function(StartRange, StartLine)
    {
        this.StartLine   = StartLine;
        this.StartRange  = StartRange;
        this.LinesLength = 0;
    },

    Recalculate_Range : function(ParaPr, Depth)
    {
        // TODO: Пока у нас контент здесь состоит из 1 элемента (всего элемента Math). Поэтому у нас в данном
        //       контенте есть 2 позиции 0 и 1, т.е. до или после Math.

        var PRS = g_oPRSW;

        if ( this.Paragraph !== PRS.Paragraph )
        {
            this.Paragraph = PRS.Paragraph;
            this.Paragraph.RecalcInfo.Set_Type_0_Spell( pararecalc_0_Spell_All );
        }

        var CurLine  = PRS.Line - this.StartLine;
        var CurRange = ( 0 === CurLine ? PRS.Range - this.StartRange : PRS.Range );

        var Para      = PRS.Paragraph;
        var ParaLine  = PRS.Line;
        var ParaRange = PRS.Range;

        var TextPr = new CTextPr();
        TextPr.Init_Default();
        this.Math.RecalculateComposition(g_oTextMeasurer, TextPr);
        var Size = this.Math.getSize();

        this.Width        = Size.Width;
        this.Height       = Size.Height;
        this.WidthVisible = Size.WidthVisible;
        this.Ascent       = Size.Ascent;
        this.Descent      = Size.Descent;

        //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
        // TODO: ParaMath.Recalculate_Range
        // Пока логика пересчета здесь аналогична логике пересчета отдельного символа в ParaRun. В будущем надо будет
        // переделать с разбиванием на строки.
        //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

        // Отмечаем, что началось слово
        PRS.StartWord = true;

        // Обновляем метрику строки
        if ( PRS.LineAscent < this.Ascent )
            PRS.LineAscent = this.Ascent;

        if ( PRS.LineDescent < this.Descent )
            PRS.LineDescent = this.Descent;

        // При проверке, убирается ли слово, мы должны учитывать ширину предшествующих пробелов.
        var LetterLen = Size.Width;
        if ( true !== PRS.Word )
        {
            // Слово только началось. Делаем следующее:
            // 1) Если до него на строке ничего не было и данная строка не
            //    имеет разрывов, тогда не надо проверять убирается ли слово в строке.
            // 2) В противном случае, проверяем убирается ли слово в промежутке.

            // Если слово только началось, и до него на строке ничего не было, и в строке нет разрывов, тогда не надо проверять убирается ли оно на строке.
            if ( true !== PRS.FirstItemOnLine || false === Para.Internal_Check_Ranges(ParaLine, ParaRange) )
            {
                if ( PRS.X + PRS.SpaceLen + LetterLen > PRS.XEnd )
                {
                    PRS.NewRange  = true;
                }
            }

            if ( true !== PRS.NewRange )
            {
                // Отмечаем начало нового слова
                PRS.Set_LineBreakPos( 0 );
                PRS.WordLen = this.Width;
                PRS.Word    = true;
            }
        }
        else
        {
            if ( PRS.X + PRS.SpaceLen + PRS.WordLen + LetterLen > PRS.XEnd )
            {
                if ( true === PRS.FirstItemOnLine )
                {
                    // Слово оказалось единственным элементом в промежутке, и, все равно,
                    // не умещается целиком. Делаем следующее:
                    //
                    // 1) Если у нас строка без вырезов, тогда ставим перенос строки на
                    //    текущей позиции.
                    // 2) Если у нас строка с вырезом, и данный вырез не последний, тогда
                    //    ставим перенос внутри строки в начале слова.
                    // 3) Если у нас строка с вырезом и вырез последний, тогда ставим перенос
                    //    строки в начале слова.

                    if ( false === Para.Internal_Check_Ranges(ParaLine, ParaRange)  )
                    {
                        // Слово не убирается в отрезке. Переносим слово в следующий отрезок
                        PRS.MoveToLBP = true;
                        PRS.NewRange  = true;
                    }
                    else
                    {
                        PRS.EmptyLine   = false;
                        PRS.X          += WordLen;

                        // Слово не убирается в отрезке, но, поскольку, слово 1 на строке и отрезок тоже 1,
                        // делим слово в данном месте
                        PRS.NewRange = true;
                    }
                }
                else
                {
                    // Слово не убирается в отрезке. Переносим слово в следующий отрезок
                    PRS.MoveToLBP = true;
                    PRS.NewRange  = true;
                }
            }

            if ( true !== PRS.NewRange )
            {
                // Мы убираемся в пределах данной строки. Прибавляем ширину буквы к ширине слова
                PRS.WordLen += LetterLen;
            }
        }

        var RangeStartPos = 0;
        var RangeEndPos   = 0;

        if ( true !== PRS.NewRange )
            RangeEndPos = 1;

        if ( 0 === CurLine && 0 === CurRange )
        {
            this.Range.StartPos = RangeStartPos;
            this.Range.EndPos   = RangeEndPos;
            this.Lines[0].RangesLength = 1;

            if ( this.Lines[0].Ranges.length > 1 )
                this.Lines[0].Ranges.length = 1;
        }
        else
            this.Lines[CurLine].Add_Range( CurRange, RangeStartPos, RangeEndPos );

        //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    },

    Recalculate_Set_RangeEndPos : function(PRS, PRP, Depth)
    {
        var CurLine  = PRS.Line - this.StartLine;
        var CurRange = ( 0 === CurLine ? PRS.Range - this.StartRange : PRS.Range );
        var CurPos   = PRP.Get(Depth);

        this.Lines[CurLine].Ranges[CurRange].EndPos = CurPos;
    },

    Recalculate_Range_Width : function(PRSC, _CurLine, _CurRange)
    {
        var CurLine = _CurLine - this.StartLine;
        var CurRange = ( 0 === CurLine ? _CurRange - this.StartRange : _CurRange );

        var StartPos = this.Lines[CurLine].Ranges[CurRange].StartPos;
        var EndPos   = this.Lines[CurLine].Ranges[CurRange].EndPos;

        if ( EndPos >= 1 )
        {
            PRSC.Range.Letters++;

            if ( true !== PRSC.Word )
            {
                PRSC.Word = true;
                PRSC.Range.Words++;
            }

            PRSC.Range.W += this.Width;
            PRSC.Range.W += PRSC.SpaceLen;

            PRSC.SpaceLen = 0;

            // Пробелы перед первым словом в строке не считаем
            if ( PRSC.Range.Words > 1 )
                PRSC.Range.Spaces += PRSC.SpacesCount;
            else
                PRSC.Range.SpacesSkip += PRSC.SpacesCount;

            PRSC.SpacesCount = 0;
        }
    },

    Recalculate_Range_Spaces : function(PRSA, _CurLine, _CurRange, _CurPage)
    {
        var CurLine = _CurLine - this.StartLine;
        var CurRange = ( 0 === CurLine ? _CurRange - this.StartRange : _CurRange );

        var StartPos = this.Lines[CurLine].Ranges[CurRange].StartPos;
        var EndPos   = this.Lines[CurLine].Ranges[CurRange].EndPos;

        if ( EndPos >= 1 )
        {
            if ( 0 !== PRSA.LettersSkip )
            {
                this.WidthVisible = this.Width;
                PRSA.LettersSkip--;
            }
            else
                this.WidthVisible = this.Width + PRSA.JustifyWord;

            PRSA.X    += this.WidthVisible;
            PRSA.LastW = this.WidthVisible;
        }
    },

    Recalculate_PageEndInfo : function(PRSI, _CurLine, _CurRange)
    {
    },

    Save_Lines : function()
    {
        var HyperLines = new CParagraphLinesInfo(this.StartLine, this.StartRange);

        for ( var CurLine = 0; CurLine < this.LinesLength; CurLine++ )
        {
            HyperLines.Lines.push( this.Lines[CurLine].Copy() );
        }

        HyperLines.LinesLength = this.LinesLength;

        var ContentLen = this.Content.length;
        for ( var CurPos = 0; CurPos < ContentLen; CurPos++ )
        {
            var ContentLines = this.Content[CurPos].Save_Lines();
            HyperLines.Content.push( ContentLines );
        }

        return HyperLines;
    },

    Restore_Lines : function(HyperLines)
    {
        this.Lines       = HyperLines.Lines;
        this.LinesLength = HyperLines.LinesLength;
        this.Range       = this.Lines[0].Ranges[0];

        var ContentLen = this.Content.length;
        for ( var CurPos = 0; CurPos < ContentLen; CurPos++ )
        {
            this.Content[CurPos].Restore_Lines( HyperLines.Content[CurPos] );
        }
    },

    Is_EmptyRange : function(_CurLine, _CurRange)
    {
        var CurLine = _CurLine - this.StartLine;
        var CurRange = ( 0 === CurLine ? _CurRange - this.StartRange : _CurRange );

        var StartPos = this.Lines[CurLine].Ranges[CurRange].StartPos;
        var EndPos   = this.Lines[CurLine].Ranges[CurRange].EndPos;

        if ( EndPos >= 1 )
            return false;

        return true;
    },

    Check_BreakPageInRange : function(_CurLine, _CurRange)
    {
        return false;
    },

    Check_BreakPageEnd : function(PBChecker)
    {
        return false;
    },

    Get_ParaPosByContentPos : function(ContentPos, Depth)
    {
        var Pos = ContentPos.Get(Depth);

        var CurLine  = 0;
        var CurRange = 0;

        var LinesCount = this.LinesLength;
        for ( ; CurLine < LinesCount; CurLine++ )
        {
            var RangesCount = this.Lines[CurLine].RangesLength;
            for ( CurRange = 0; CurRange < RangesCount; CurRange++ )
            {
                var Range = this.Lines[CurLine].Ranges[CurRange];
                if ( Pos < Range.EndPos && Pos >= Range.StartPos )
                    return new CParaPos( ( CurLine === 0 ? CurRange + this.StartRange : CurRange ), CurLine + this.StartLine, 0, 0 );
            }
        }

        return new CParaPos( ( LinesCount === 1 ? this.Lines[0].RangesLength - 1 + this.StartRange : this.Lines[0].RangesLength - 1 ), LinesCount - 1 + this.StartLine, 0, 0 );
    },

    Recalculate_CurPos : function(_X, Y, CurrentRun, _CurRange, _CurLine, _CurPage, UpdateCurPos, UpdateTarget, ReturnTarget)
    {
        var CurLine  = _CurLine - this.StartLine;
        var CurRange = ( 0 === CurLine ? _CurRange - this.StartRange : _CurRange );
        var X = _X;

        var StartPos = this.Lines[CurLine].Ranges[CurRange].StartPos;
        var EndPos   = this.Lines[CurLine].Ranges[CurRange].EndPos;

        if ( EndPos >= 1 )
        {
            return this.Math.UpdateCursor();
        }

        return { X : X };
    },

    Refresh_RecalcData : function(Data)
    {
        this.Paragraph.Refresh_RecalcData2(0);
    },
//-----------------------------------------------------------------------------------
// Функции отрисовки
//-----------------------------------------------------------------------------------
    Draw_HighLights : function(PDSH)
    {
    },

    Draw_Elements : function(PDSE)
    {
        var CurLine  = PDSE.Line - this.StartLine;
        var CurRange = ( 0 === CurLine ? PDSE.Range - this.StartRange : PDSE.Range );

        var StartPos = this.Lines[CurLine].Ranges[CurRange].StartPos;
        var EndPos   = this.Lines[CurLine].Ranges[CurRange].EndPos;

        if ( EndPos >= 1 )
        {
            this.Math.Draw( PDSE.X, PDSE.Y, PDSE.Graphics );
            PDSE.X += this.Width;
        }
    },

    Draw_Lines : function(PDSL)
    {
    },
//-----------------------------------------------------------------------------------
// Функции для работы с курсором
//-----------------------------------------------------------------------------------
    Is_CursorPlaceable : function()
    {
        return true;
    },

    Cursor_Is_Start : function()
    {
        // TODO: ParaMath.Cursor_Is_Start
        return true;
    },

    Cursor_Is_NeededCorrectPos : function()
    {
        return false;
    },

    Cursor_Is_End : function()
    {
        // TODO: ParaMath.Cursor_Is_End
        return true;
    },

    Cursor_MoveToStartPos : function()
    {
        // TODO: ParaMath.Cursor_MoveToStartPos
    },

    Cursor_MoveToEndPos : function(SelectFromEnd)
    {
        // TODO: ParaMath.Cursor_MoveToEndPos
    },

    Get_ParaContentPosByXY : function(SearchPos, Depth, _CurLine, _CurRange, StepEnd)
    {
        // TODO: ParaMath.Get_ParaContentPosByXY
        return false;
    },

    Get_ParaContentPos : function(bSelection, bStart, ContentPos)
    {
        // TODO: ParaMath.Get_ParaContentPos
    },

    Set_ParaContentPos : function(ContentPos, Depth)
    {
        // TODO: ParaMath.Set_ParaContentPos
    },

    Get_PosByElement : function(Class, ContentPos, Depth, UseRange, Range, Line)
    {
        if ( this === Class )
            return true;

        // TODO: ParaMath.Get_PosByElement
    },

    Get_RunElementByPos : function(ContentPos, Depth)
    {
        return null;
    },

    Get_LeftPos : function(SearchPos, ContentPos, Depth, UseContentPos)
    {
        // TODO: ParaMath.Get_LeftPos
        return false;
    },

    Get_RightPos : function(SearchPos, ContentPos, Depth, UseContentPos, StepEnd)
    {
        // TODO: ParaMath.Get_RightPos
        return false;
    },

    Get_WordStartPos : function(SearchPos, ContentPos, Depth, UseContentPos)
    {
        // TODO: ParaMath.Get_StartEndPos
    },

    Get_WordEndPos : function(SearchPos, ContentPos, Depth, UseContentPos, StepEnd)
    {
        // TODO: ParaMath.Get_WordEndPos
    },

    Get_EndRangePos : function(_CurLine, _CurRange, SearchPos, Depth)
    {
        // TODO: ParaMath.Get_EndRangePos
    },

    Get_StartRangePos : function(_CurLine, _CurRange, SearchPos, Depth)
    {
        // TODO: ParaMath.Get_StartRangePos
    },

    Get_StartRangePos2 : function(_CurLine, _CurRange, ContentPos, Depth)
    {
        // TODO: ParaMath.Get_StartRangePos2
    },

    Get_StartPos : function(ContentPos, Depth)
    {
        // TODO: ParaMath.Get_StartPos
    },

    Get_EndPos : function(BehindEnd, ContentPos, Depth)
    {
        // TODO: ParaMath.Get_EndPos
    },
//-----------------------------------------------------------------------------------
// Функции для работы с селектом
//-----------------------------------------------------------------------------------
    Set_SelectionContentPos : function(StartContentPos, EndContentPos, Depth, StartFlag, EndFlag)
    {
        // TODO: ParaMath.Set_SelectionContentPos
    },

    Selection_IsUse : function()
    {
        // TODO: ParaMath.Selection_IsUse
        return false;
    },

    Selection_Stop : function()
    {
    },

    Selection_Remove : function()
    {
        // TODO: ParaMath.Selection_Remove
    },

    Select_All : function(Direction)
    {
        // TODO: ParaMath.Select_All
    },

    Selection_DrawRange : function(_CurLine, _CurRange, SelectionDraw)
    {
        var CurLine = _CurLine - this.StartLine;
        var CurRange = ( 0 === CurLine ? _CurRange - this.StartRange : _CurRange );

        var StartPos = this.Lines[CurLine].Ranges[CurRange].StartPos;
        var EndPos   = this.Lines[CurLine].Ranges[CurRange].EndPos;

        if ( EndPos >= 1 )
        {
            // TODO: ParaMath.Selection_Draw_Range
        }
    },

    Selection_IsEmpty : function(CheckEnd)
    {
        // TODO: ParaMath.Selection_IsEmpty
        return true;
    },

    Selection_CheckParaEnd : function()
    {
        return false;
    },
//----------------------------------------------------------------------------------------------------------------------
// Функции совместного редактирования
//----------------------------------------------------------------------------------------------------------------------
    Write_ToBinary2 : function(Writer)
    {
        // TODO: ParaMath.Write_ToBinary2
    },

    Read_FromBinary2 : function(Reader)
    {
        // TODO: ParaMath.Read_FromBinary2
    }
};