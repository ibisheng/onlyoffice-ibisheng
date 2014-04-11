/**
 * Created by Ilja.Kirillov on 18.03.14.
 */

function ParaMath(bAddMenu)
{
    this.Id = g_oIdCounter.Get_NewId();
    this.Type  = para_Math;

    this.Jc   = undefined;
    this.Math = new CMathComposition();
    this.Math.Parent = this;
    this.Root = this.Math.Root;
    //this.CurrentContent    = this.RootComposition;
    //this.SelectContent     = this.RootComposition;
    this.bSelectionUse     = false;


    this.State      = new CParaRunState();       // Положение курсора и селекта для данного run
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
    if (!bAddMenu)		
		g_oTableId.Add( this, this.Id );
}

ParaMath.prototype =
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
        return this.Root.content.length == 0;
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
		var oPos = this.GetSelectContent();

		if ( para_Text === Type)
		{
			var oText = new CMathText();
			oText.addTxt(Item.Value);
			oPos.Content.content[oPos.Start].Add(oText);
		}
		else if ( para_Space === Type )
		{
			var oSpace = new ParaSpace(1);
			oPos.Content.content[oPos.Start].Add(oSpace);
		}
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
            var MathRun = new ParaRun(this.Paragraph, true);
			
			var Pos = oElem.CurPos,
				PosEnd = Pos + 1;
			var items = new Array();

            for (var Pos=0; Pos < sText.length; Pos++)
            {
                var oText = new CMathText();
                oText.addTxt(sText[Pos]);				
                MathRun.Content.splice( Pos, 0, oText );
				
				//var element = new mathElem(oText);
				items.push(oText);
            }

            oElem.addElementToContent(MathRun);
			
			History.Add(oElem, {Type: historyitem_Math_AddItem, Items: items, Pos: Pos, PosEnd: PosEnd});
        }        

        /*if(sText)
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
                    *//*text[i].replace("&",	"&amp;");
                     text[i].Replace("'",	"&apos;");
                     text[i].Replace("<",	"&lt;");
                     text[i].Replace(">",	"&gt;");
                     text[i].Replace("\"",	"&quot;");*//*
                    oText = new CMathText();
                    oText.addTxt(sText[i]);
                    oElem.addElementToContent(oText);
                }
            }
        }*/
    },

    CreateElem : function (oElem, oParent, props)
    {
        /*var ctrPrp = new CTextPr();
         oElem.setCtrPrp(ctrPrp);*/
        oElem.relate(oParent);
        oElem.init(props);

		var Pos = oParent.CurPos,
				PosEnd = Pos + 1;
		var items = new Array();
		
        if (oParent)
		{
            oParent.addElementToContent(oElem);

			var element = new mathElem(oElem);
			items.push(element);
			History.Add(oParent, {Type: historyitem_Math_AddItem, Items: items, Pos: Pos, PosEnd: PosEnd});
		}

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

    GetSelectContent: function()
    {
        return this.Root.GetSelectContent();
    },

    Get_CurrentParaPos : function()
    {
        //var CurPos = this.State.ContentPos;

        /*if ( CurPos >= 0 && CurPos < this.Content.length )
            return this.Content[CurPos].Get_CurrentParaPos();*/

        return new CParaPos( this.StartRange, this.StartLine, 0, 0 );
    },

    Apply_TextPr : function(TextPr, IncFontSize, ApplyToAll)
    {
        // TODO: ParaMath.Apply_TextPr
    },

    Clear_TextPr : function()
    {

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
        AllFonts["Cambria Math"] = true;
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
        var Size = this.Math.Size;

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

        // Если это первый отрезок в данной строке, тогда нам надо добавить строку (первую строку не добавляем,
        // т.к. она всегда есть)
        if ( 0 === CurRange )
        {
            if ( 0 !== CurLine )
            {
                this.Lines[CurLine] = new CParaRunLine();
                this.LinesLength    = CurLine + 1;
            }
            else
            {
                this.LinesLength  = CurLine + 1;
            }
        }

        // Отмечаем, что началось слово
        PRS.StartWord = true;

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
                        PRS.NewRange  = true; // перенос на новую строку
                    }
                    else
                    {
                        PRS.EmptyLine   = false;
                        PRS.X          += WordLen;

                        // Слово не убирается в отрезке, но, поскольку, слово 1 на строке и отрезок тоже 1,
                        // делим слово в данном месте
                        PRS.NewRange = true; // перенос на новую строку
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
        {
            RangeEndPos = this.Root.content.length; // RangeEndPos = 1;    to    RangeEndPos = this.Content.length;

            // Удаляем лишние строки, оставшиеся после предыдущего пересчета в самом конце
            if ( this.Lines.length > this.LinesLength )
                this.Lines.length = this.LinesLength;

            // Обновляем метрику строки
            if ( PRS.LineAscent < this.Ascent )
                PRS.LineAscent = this.Ascent;

            if ( PRS.LineDescent < this.Descent )
                PRS.LineDescent = this.Descent;
        }

        if ( 0 === CurLine && 0 === CurRange )
        {
            this.Range.StartPos = RangeStartPos;
            this.Range.EndPos   = RangeEndPos;

            /*this.Lines[0].RangesLength = 1;
             this.Lines[0].Ranges.length = this.Content.length - 1;*/

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

    Save_RecalculateObject : function(Copy)
    {
        var RecalcObj = new CRunRecalculateObject(this.StartLine, this.StartRange);
        RecalcObj.Save_Lines( this, Copy );
        
        // TODO: Сделать сохранение пересчета у формулы
        
        return RecalcObj;
    },

    Load_RecalculateObject : function(RecalcObj)
    {
        RecalcObj.Load_Lines(this);
        RecalcObj.Load_ZeroRange(this);
    },

    Prepare_RecalculateObject : function()
    {
        this.Lines       = [];
        this.Lines[0]    = new CParaRunLine();
        this.LinesLength = 0;

        this.Range = this.Lines[0].Ranges[0];
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

        //var StartPos = this.Lines[CurLine].Ranges[CurRange].StartPos;
        var EndPos   = this.Lines[CurLine].Ranges[CurRange].EndPos;


        var result = {X: _X + this.Root.size.width};


        if ( EndPos >= 1 && CurrentRun == true)
        {
            result = this.Root.Recalculate_CurPos(_X, Y, CurrentRun, _CurRange, _CurLine, _CurPage, UpdateCurPos, UpdateTarget, ReturnTarget);
        }



        return result;
    },

    Refresh_RecalcData : function(Data)
    {
        this.Paragraph.Refresh_RecalcData2(0);
    },
	
    Refresh_RecalcData2 : function(Data)
    {
        this.Paragraph.Refresh_RecalcData2(0);
    },


    Recalculate_MinMaxContentWidth : function(MinMax)
    {
        // TODO: Если формула не измерена, тогда здесь её надо измерить

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
    },

    Get_Range_VisibleWidth : function(RangeW, _CurLine, _CurRange)
    {
        var CurLine = _CurLine - this.StartLine;
        var CurRange = ( 0 === CurLine ? _CurRange - this.StartRange : _CurRange );

        var StartPos = this.Lines[CurLine].Ranges[CurRange].StartPos;
        var EndPos   = this.Lines[CurLine].Ranges[CurRange].EndPos;

        if ( EndPos >= 1 )
        {
            RangeW.W += this.Width;
        }
    },
//-----------------------------------------------------------------------------------
// Функции отрисовки
//-----------------------------------------------------------------------------------
    Draw_HighLights : function(PDSH)
    {
        var CurLine  = PDSH.Line - this.StartLine;
        var CurRange = ( 0 === CurLine ? PDSH.Range - this.StartRange : PDSH.Range );

        var StartPos = this.Lines[CurLine].Ranges[CurRange].StartPos;
        var EndPos   = this.Lines[CurLine].Ranges[CurRange].EndPos;

        if ( EndPos >= 1 )
        {
            PDSH.X += this.Width;
        }
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
        var CurLine  = PDSL.Line - this.StartLine;
        var CurRange = ( 0 === CurLine ? PDSL.Range - this.StartRange : PDSL.Range );

        var StartPos = this.Lines[CurLine].Ranges[CurRange].StartPos;
        var EndPos   = this.Lines[CurLine].Ranges[CurRange].EndPos;

        if ( EndPos >= 1 )
        {
            PDSL.X += this.Width;
        }
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

        return this.Root.Cursor_Is_Start();
    },

    Cursor_Is_NeededCorrectPos : function()
    {
        return false;
    },

    Cursor_Is_End : function()
    {
        // TODO: ParaMath.Cursor_Is_End

        return this.Root.Cursor_Is_End();
    },

    Cursor_MoveToStartPos : function()
    {
        // TODO: ParaMath.Cursor_MoveToStartPos

        this.Math.Cursor_MoveToStartPos();
    },

    Cursor_MoveToEndPos : function(SelectFromEnd)
    {
        // TODO: ParaMath.Cursor_MoveToEndPos

        this.Math.Cursor_MoveToEndPos();
    },

    Get_ParaContentPosByXY : function(SearchPos, Depth, _CurLine, _CurRange, StepEnd, Flag) // получить логическую позицию по XY
    {
        // TODO: ParaMath.Get_ParaContentPosByXY

        var Result = false;

        var CurLine  = _CurLine - this.StartLine;
        var CurRange = ( 0 === CurLine ? _CurRange - this.StartRange : _CurRange ); // если находимся в нулевой строке (для текущей позиции), то CurRange мб ненулевой

        var Range = this.Lines[CurLine].Ranges[CurRange];
        var StartPos = Range.StartPos;  //  0
        var EndPos   = Range.EndPos;    //  this.content.length

        // TODO: реализовать поиск по Y (для случая, когда формула занимает больше одной строки)

        // Проверяем, попали ли мы в формулу

        var Dx = this.Root.size.width;
        var D = SearchPos.X - SearchPos.CurX;
        var Diff = Math.abs(D) < Math.abs(D + Dx) ? Math.abs(D) : Math.abs(D + Dx);

        var CurX = SearchPos.CurX;

        if(Math.abs(Diff) < SearchPos.DiffX + 0.001 )
        {

            if ( D >= - 0.001 && D <= Dx + 0.001 )
            {
                var X = SearchPos.X,
                    Y = SearchPos.Y;


                SearchPos.X -= this.Math.absPos.x;
                SearchPos.Y -= this.Math.absPos.y;

                SearchPos.DiffX = Diff;

                this.Root.Get_ParaContentPosByXY(SearchPos, Depth);

                SearchPos.X = X;
                SearchPos.Y = Y;



                Result = true;

                //////////


                SearchPos.InText = true;
                SearchPos.DiffX =  0.001; // сравниваем расстояние до ближайшего элемента
            }

        }

        SearchPos.CurX = CurX + Dx;

        return Result;
    },

    Get_ParaContentPos : function(bSelection, bStart, ContentPos) // получить текущую логическую позицию
    {
        // TODO: ParaMath.Get_ParaContentPos

        this.Root.Get_ParaContentPos(bSelection, bStart, ContentPos);

        return ContentPos;
    },
    Set_ParaContentPos : function(ContentPos, Depth) // выставить логическую позицию в контенте
    {
        // TODO: ParaMath.Set_ParaContentPos

        var Pos = ContentPos.Get(Depth);
        this.State.ContentPos = Pos;

        this.Root.Set_ParaContentPos(ContentPos, Depth);
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

        this.Root.Set_SelectionContentPos(StartContentPos, EndContentPos, Depth, StartFlag, EndFlag);

        this.bSelectionUse = true;
    },

    Selection_IsUse : function()
    {
        // TODO: ParaMath.Selection_IsUse
        return this.bSelectionUse;
    },

    Selection_Stop : function()
    {

    },
    Selection_Remove : function()
    {
        // TODO: ParaMath.Selection_Remove

        this.bSelectionUse = false;

    },
    Select_All : function(Direction)
    {
        // TODO: ParaMath.Select_All
        this.bSelectionUse = true;
        this.Root.Select_All();
    },

    Selection_DrawRange : function(_CurLine, _CurRange, SelectionDraw)
    {
        var CurLine = _CurLine - this.StartLine;
        var CurRange = ( 0 === CurLine ? _CurRange - this.StartRange : _CurRange );

        var StartPos = this.Lines[CurLine].Ranges[CurRange].StartPos;
        var EndPos   = this.Lines[CurLine].Ranges[CurRange].EndPos;


        if ( EndPos >= 1 )
        {
            if ( true === this.bSelectionUse )
            {
            // TODO: ParaMath.Selection_Draw_Range

                var result = this.GetSelectContent();

                var Start = result.Start,
                    End = result.End,
                    oCont = result.Content;

                SelectionDraw.StartX += oCont.pos.x + oCont.WidthToElement[Start];

                if(Start == End)
                    oCont.content[Start].Selection_DrawRange(0, 0, SelectionDraw);
                else
                {
                    oCont.content[Start].Selection_DrawRange(0, 0, SelectionDraw);

                    SelectionDraw.FindStart = false; // выставляем здесь флаг, для того чтобы правильно отрисовался селект для случая пустой ран мат. объект пустой ран
                    SelectionDraw.W += oCont.WidthToElement[End] - oCont.WidthToElement[Start + 1]; // startPos < endPos !

                    oCont.content[End].Selection_DrawRange(0,0, SelectionDraw);
                }

                if(!oCont.bRoot)
                {
                    SelectionDraw.StartY += oCont.pos.y;
                    SelectionDraw.H = oCont.size.height;
                }

            }
            else
            {
                if ( true === SelectionDraw.FindStart )
                {
                    SelectionDraw.StartX += this.Width;
                }
            }

        }
    },

    Selection_IsEmpty : function(CheckEnd)
    {
        // TODO: ParaMath.Selection_IsEmpty

        //return false;
        return this.Root.Selection_IsEmpty();
    },

    Selection_CheckParaEnd : function()
    {
        return false;
    },

    Is_SelectedAll : function(Props)
    {
        // TODO: ParaMath.Is_SelectedAll
        return this.Root.Is_SelectedAll(Props);
    },

    Selection_CorrectLeftPos : function(Direction)
    {
        return false;
    },
//----------------------------------------------------------------------------------------------------------------------
// Функции совместного редактирования
//----------------------------------------------------------------------------------------------------------------------
    /*Save_Changes : function(Data, Writer)
    {

    },

    Load_Changes : function(Reader)
    {
		this.Math.CurrentContent.Load_Changes(Reader);
    }*/
	Write_ToBinary : function(Writer)
    {
        // Long   : Type
        // String : Id

        Writer.WriteLong( this.Type );
        Writer.WriteString2( this.Id );
    },
	Write_ToBinary2 : function(Writer)
    {
		Writer.WriteLong( historyitem_type_Math );
		
		/*var oThis = this;
		this.bs = new BinaryCommonWriter(Writer);
		this.boMaths = new Binary_oMathWriter(Writer);

		this.bs.WriteItemWithLength ( function(){oThis.boMaths.WriteOMathParaCollaborative(oThis.Math);});//WriteOMathParaCollaborative
		*/
	},

    Read_FromBinary2 : function(Reader)
    {
		/*var oThis = this;
		this.boMathr = new Binary_oMathReader(Reader);
		this.bcr = new Binary_CommonReader(Reader);
		
		var length = Reader.GetUChar();
		
		var res = false;
		Reader.cur += 3;
		res = this.bcr.Read1(length, function(t, l){
			return oThis.boMathr.ReadMathOMathParaCollaborative(t,l,oThis.Math);
		});
		*/
	}
};