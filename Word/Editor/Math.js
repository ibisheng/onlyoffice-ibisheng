"use strict";

/**
 * Created by Ilja.Kirillov on 18.03.14.
 */
var g_oMathSettings = {};
function MathMenu (type)
{
	this.Type = para_Math;
	this.Menu = type;
}
function ParaMath()
{
    this.Id = g_oIdCounter.Get_NewId();
    this.Type  = para_Math;

    this.Jc   = undefined;
    //this.Math = new CMathComposition();
    //this.Math.Parent = this;
    //this.Root = this.Math.Root;

    this.Root       = new CMathContent();
    this.Root.bRoot = true;
    //this.Root.setComposition(this);

    this.X          = 0;
    this.Y          = 0;

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

    this.NearPosArray = [];

    this.Width        = 0;
    this.WidthVisible = 0;
    this.Height       = 0;
    this.Ascent       = 0;
    this.Descent      = 0;

    this.DefaultTextPr = new CTextPr();
    this.DefaultTextPr.Init_Default();

    this.DefaultTextPr.Italic     = true;
    this.DefaultTextPr.FontFamily = {Name  : "Cambria Math", Index : -1 };
    this.DefaultTextPr.RFonts.Set_All("Cambria Math", -1);



    this.MathPr =
    {
        naryLim:    NARY_UndOvr,
        intLim:     NARY_SubSup,
        brkBin:     BREAK_BEFORE,
        brkSubBin:  BREAK_MIN_MIN,
        wrapIndent: 0,
        smallFrac:  false,
        wrapRight:  false
    };

    // Добавляем данный класс в таблицу Id (обязательно в конце конструктора)
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

        if(Selected)
        {
            var result = this.GetSelectContent();
            NewMath.Root = result.Content.Copy(Selected);
            NewMath.Root.bRoot = true;
        }
        else
        {
            NewMath.Root = this.Root.Copy(Selected);
            NewMath.Root.bRoot = true;
        }

        /// argSize, bDot и bRoot выставить на объединении контентов

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

        var TextPr = new CTextPr();

        var mTextPr = this.Root.Get_TextPr(_ContentPos, Depth);
        TextPr.Merge( mTextPr );


        return TextPr;
    },
    Get_CompiledTextPr : function(Copy)
    {
        // TODO: ParaMath.Get_CompiledTextPr

        var TextPr = new CTextPr();
        TextPr.Init_Default();

        var oContent = this.GetSelectContent();
        var mTextPr = oContent.Content.Get_CompiledTextPr(Copy);
        TextPr.Merge( mTextPr );

        return TextPr;
    },
    Add : function(Item)
    {
		var Type = Item.Type;
		var oContent = this.GetSelectContent();
		var oStartContent = oContent.Content.content[oContent.Start];
		var oEndContent = oContent.Content.content[oContent.End];

		if ( para_Text === Type)
		{
			var oText = new CMathText(false);
			oText.addTxt(Item.Value);
			oStartContent.Add(oText);
		}
		else if ( para_Space === Type )
		{
			//var oSpace = new ParaSpace(1);
			var oText = new CMathText(false);
			oText.addTxt(" ");
			oStartContent.Add(oText);
		}
		else if ( para_Math === Type )
		{
			if (oStartContent.typeObj == MATH_PLACEHOLDER)
			{
				History.Create_NewPoint();
				
				var Items = [];
				Items.push(oContent.Content.content[0]);
				oContent.Content.content.splice( 0, 1 );
				History.Add(oContent.Content, {Type: historyitem_Math_RemoveItem, Items:Items, Pos: 0});
				
				oContent.Content.Load_FromMenu(Item.Menu, this.Paragraph);
			}
			else
			{
				var nPosStart = oStartContent.State.ContentPos,
					nLenStart = oStartContent.Content.length,
					nPosEnd = oEndContent.State.ContentPos;
				
				History.Create_NewPoint();
				
				if(nPosStart != nLenStart) //вставка идет в mathcontent
				{
					var oMRun = new ParaRun(this.Paragraph, true);
					oMRun.Pr = oStartContent.Pr;

					for (var i=nPosStart; i<nLenStart; i++)
					{
						var Pos = oMRun.Content.length;
						var EndPos = Pos + 1;
						var oItem = oStartContent.Content[i];
						oMRun.Add(oItem);
						oStartContent.Remove_FromContent(i, 1, false);
					}
				}

				oContent.Content.CurPos++;
				oContent.Content.Load_FromMenu(Item.Menu, this.Paragraph);

				if(nPosStart != nLenStart)
				{
					var items = [];
					oContent.Content.addElementToContent(oMRun);
					items.push(oMRun);
					var Pos = oContent.Content.CurPos,
						PosEnd = Pos + 1;
					History.Add(oContent.Content, {Type: historyitem_Math_AddItem, Items: items, Pos: Pos, PosEnd: PosEnd});
				}
				
				
			}
			oContent.Content.SetRunEmptyToContent(true);
		}
	},

    Remove : function(Direction, bOnAddText)
    {
		var oContent = this.GetSelectContent();
		if (oContent.Start == oContent.End)
		{
			var oElem = oContent.Content.getElem(oContent.Start);
			
			if (oElem.typeObj == MATH_COMP)
				this.RemoveElem(oContent, Direction, bOnAddText);
			else if (oElem.typeObj == MATH_PLACEHOLDER && bOnAddText == false)
			{
				var Comp = oContent.Content.GetParent();
				Comp.SetSelectAll();
				Comp.SelectToParent();
				this.bSelectionUse = true;
			}
			else if (oElem.typeObj == MATH_PLACEHOLDER && bOnAddText == true)
			{
				History.Create_NewPoint();
				
				var Items = [];
				Items.push(oContent.Content.content[0]);
				oContent.Content.content.splice( 0, 1 );
				History.Add(oContent.Content, {Type: historyitem_Math_RemoveItem, Items:Items, Pos: 0});
				
				var oMRun = new ParaRun(this.Paragraph, true);
				oMRun.StartLine = 0; oMRun.StartRange = 0;
				oContent.Content.addElementToContent(oMRun);
				var items = [];
				items.push(oMRun);
				var Pos = oContent.Content.CurPos,
					PosEnd = Pos + 1;
				History.Add(oContent.Content, {Type: historyitem_Math_AddItem, Items: items, Pos: Pos, PosEnd: PosEnd});
			}
			else	//pararun
			{
				if (Direction < 0 && oElem.State.ContentPos - 1 < 0) //backspase
				{
					if (oContent.Content.CurPos - 1 >= 0)//слева есть элементы
					{
						var prevElem = oContent.Content.getElem(oContent.Start - 1);
						if (prevElem.typeObj == MATH_COMP) //слева композиция
						{
							this.Set_Select_ToMComp(Direction);
							return;
						}
						else //слева ран
						{
							History.Create_NewPoint();
							prevElem.Remove(Direction, bOnAddText);
							
							if(prevElem.Content.length == 0 && !bOnAddText) //тк pararun пустой, удаляем его
							{
								var Items = [];
								Items.push(prevElem.Parent.content[0]);
								prevElem.Parent.content.splice( 0, 1 );
								History.Add(prevElem.Parent, {Type: historyitem_Math_RemoveItem, Items:Items, Pos: 0});
								prevElem.Parent.CurPos--;
							}
							return;
						}
					}
					else //переходим на уровень выше и выделяем композицию
					{
						var Comp = oContent.Content.GetParent();
						Comp.SetSelectAll();
						Comp.SelectToParent();
						this.bSelectionUse = true;
					}
				}
				else if (Direction > 0 && oElem.State.ContentPos + 1 > oElem.Content.length) //delete
				{
					if (oContent.Content.CurPos + 1 >= oContent.Content.content.length) //переходим на уровень выше и выделяем композицию
					{
						var Comp = oContent.Content.GetParent();
						Comp.SetSelectAll();
						Comp.SelectToParent();
						this.bSelectionUse = true;						
					}
					else //справа есть элемент
					{
						var nextElem = oContent.Content.getElem(oContent.Start + 1);
						if (nextElem.typeObj == MATH_COMP) //справа композиция
						{
							this.Set_Select_ToMComp(Direction);
							return;
						}
						else //справа ран
						{
							History.Create_NewPoint();
							nextElem.State.ContentPos = 0;
							nextElem.Remove(Direction, bOnAddText);
							if(nextElem.Content.length == 0 && !bOnAddText) //тк pararun пустой, удаляем его
							{
								var Items = [];
								Items.push(nextElem.Parent.content[0]);
								nextElem.Parent.content.splice( 0, 1 );
								History.Add(nextElem.Parent, {Type: historyitem_Math_RemoveItem, Items:Items, Pos: 0});
							}
							return;
						}
					}
				}

				History.Create_NewPoint();
				oElem.Remove(Direction, bOnAddText);
				if(oElem.Content.length == 0 && !bOnAddText) //тк pararun пустой, удаляем его
				{
					var Items = [];
					Items.push(oElem.Parent.content[0]);
					oElem.Parent.content.splice( 0, 1 );
					History.Add(oElem.Parent, {Type: historyitem_Math_RemoveItem, Items:Items, Pos: 0});
					if (Direction < 0)
						oContent.Content.CurPos--;
				}
			}
		}
		else
			return this.RemoveElem(oContent, Direction, bOnAddText);
		
    },
		
	RemoveElem: function(oContent, Direction, bOnAdd)
    {
        var start = oContent.Start,
            end   = oContent.End,
            oMathContent = oContent.Content;
		var len = end - start + 1;

        History.Create_NewPoint();		
        History.Create_NewPoint();
		var oStartContent = oContent.Content.content[start];
		var oEndContent = oContent.Content.content[end];
		var Items = [];
		for (var i=start; i<=end; i++)
			Items.push(oContent.Content.content[i]);

		oContent.Content.content.splice( oContent.Start, len );
		History.Add(oContent.Content, {Type: historyitem_Math_RemoveItem, Items:Items, Pos: oContent.Start});
		return;
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

        this.Root.Apply_TextPr(TextPr, IncFontSize, ApplyToAll);

    },

    Clear_TextPr : function()
    {

    },

    Check_NearestPos : function(ParaNearPos, Depth)
    {
        var MathNearPos = new CParagraphElementNearPos();
        MathNearPos.NearPos = ParaNearPos.NearPos;
        MathNearPos.Depth   = Depth;

        // CParagraphNearPos for ParaNearPos
        this.NearPosArray.push( MathNearPos );
        ParaNearPos.Classes.push( this );

        var CurPos = ParaNearPos.NearPos.ContentPos.Get(Depth);
        this.Content[CurPos].Check_NearestPos( ParaNearPos, Depth + 1 );
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

        this.Root.Create_FontMap(Map);

    },

    Get_AllFontNames : function(AllFonts)
    {
        // TODO: ParaMath.Get_AllFontNames
        AllFonts["Cambria Math"] = true;
    },

    Get_SelectedText : function(bAll, bClearText)
    {
        if ( true === bAll || true === this.Selection_IsUse() )
        {
            if ( true === bClearText )
                return null;

            return "";
        }
        
        return "";
    },

    Clear_TextFormatting : function( DefHyper )
    {
    },
    
    Can_AddDropCap : function()
    {
        return false;
    },
    
    Get_TextForDropCap : function(DropCapText, UseContentPos, ContentPos, Depth)
    {
        if ( true === DropCapText.Check )
            DropCapText.Mixed = true;
    },
    Add_ToContent : function(Pos, Item, UpdatePosition)
    {

    },
//-----------------------------------------------------------------------------------
// Функции пересчета
//-----------------------------------------------------------------------------------

    Recalculate_Reset : function(StartRange, StartLine)
    {
        this.StartLine   = StartLine;
        this.StartRange  = StartRange;
        this.LinesLength = 0;

        this.Root.Recalculate_Reset(StartRange, StartLine);
    },

    Recalculate_Range : function(PRS, ParaPr, Depth)
    {
        // TODO: Пока у нас контент здесь состоит из 1 элемента (всего элемента Math). Поэтому у нас в данном
        //       контенте есть 2 позиции 0 и 1, т.е. до или после Math.

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

        //this.Math.RecalculateComposition(g_oTextMeasurer, TextPr);

        this.Root.Resize(null, this, g_oTextMeasurer, TextPr);

        var pos = new CMathPosition();
        pos.x = 0;
        pos.y = 0;
        this.Root.setPosition(pos);

        this.Width        = this.Root.size.width;
        this.Height       = this.Root.size.height;
        this.WidthVisible = this.Root.size.width;
        this.Ascent       = this.Root.size.ascent;
        this.Descent      = this.Root.size.height - this.Root.size.ascent;

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
        var LetterLen = this.Width;
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
                        //PRS.X          += WordLen;

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

            // Позиция в документе для формулы
            //this.Math.absPos = {x: PRSA.X, y: PRSA.Y - this.Root.size.ascent};
            this.X     = PRSA.X;
            this.Y     = PRSA.Y - this.Root.size.ascent;

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
    
    Shift_Range : function(Dx, Dy, _CurLine, _CurRange)
    {
        var CurLine = _CurLine - this.StartLine;
        var CurRange = ( 0 === CurLine ? _CurRange - this.StartRange : _CurRange );

        var StartPos = this.Lines[CurLine].Ranges[CurRange].StartPos;
        var EndPos   = this.Lines[CurLine].Ranges[CurRange].EndPos;

        if ( EndPos >= 1 )
        {
            // TODO: Сделать смещение на Dx, Dy
        }        
    },
//-----------------------------------------------------------------------------------
// Функция для работы с формулой
// в тч с  дефолтными текстовыми настройками и argSize
//-----------------------------------------------------------------------------------
    MathToImageConverter: function()
    {
        window.IsShapeToImageConverter = true;

        var dKoef = g_dKoef_mm_to_pix;
        var w_mm = this.Width;
        var h_mm = this.Height;
        var w_px = (w_mm * dKoef) >> 0;
        var h_px = (h_mm * dKoef) >> 0;

        var _canvas = document.createElement('canvas');
        _canvas.width = w_px;
        _canvas.height = h_px;

        var _ctx = _canvas.getContext('2d');

        var g = new CGraphics();
        g.init(_ctx, w_px, h_px, w_mm, h_mm);
        g.m_oFontManager = g_fontManager;

        g.m_oCoordTransform.tx = 0;
        g.m_oCoordTransform.ty = 0;
        g.transform(1,0,0,1,0,0);

        this.Root.draw(0, 0, g);

        window.IsShapeToImageConverter = false;

        var _ret = { ImageNative : _canvas, ImageUrl : "" };
        try
        {
            _ret.ImageUrl = _canvas.toDataURL("image/png");
        }
        catch (err)
        {
            _ret.ImageUrl = "";
        }
        return _ret;
    },
    ApplyArgSize : function(oWPrp, argSize)
    {
        var tPrp = new CTextPr();
        /*var defaultWPrp =
        {
            FontFamily:     {Name  : "Cambria Math", Index : -1 },
            FontSize:       11,
            Italic:         true,
            Bold:           false,
            RFonts:         {},
            Lang:           {}
        };*/

        tPrp.Merge(this.DefaultTextPr);
        tPrp.Merge(oWPrp);

        var FSize = tPrp.FontSize;

        if(argSize == -1)
        {
            //FSize = 0.0009*FSize*FSize + 0.68*FSize + 0.26;
            FSize = 0.76*FSize;

        }
        else if(argSize == -2)
        {
            //FSize = -0.0004*FSize*FSize + 0.66*FSize + 0.87;
            FSize = 0.76*0.855*FSize;
        }

        tPrp.FontSize = FSize;

        oWPrp.Merge(tPrp);

    },
    /*GetDefaultTxtPrp: function()
    {
        var txtPrp = new CTextPr();

        var defaultTxtPr =
        {
            FontFamily:     {Name  : "Cambria Math", Index : -1 },
            FontSize:       11,
            Italic:         true,
            Bold:           false
        };

       txtPrp.Set_FromObject(defaultTxtPr);

        return txtPrp;
    },*/
    GetFirstRPrp: function()
    {
        return this.Root.getFirstRPrp(this);
    },
    GetShiftCenter: function(oMeasure, font)
    {
        oMeasure.SetFont(font);
        var metrics = oMeasure.Measure2Code(0x2217); // "+"

        return 0.6*metrics.Height;
    },
    SetMathProperties: function(props)
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

    },
    GetMathPr: function()
    {
        return this.MathPr;
    },
    Get_Default_TPrp: function()
    {
        /*var TextPrp = new CTextPr();
        TextPrp.Init_Default();

        var mathFont = new CTextPr();

        var obj =
        {
            FontFamily:     {Name  : "Cambria Math", Index : -1 },
            RFonts:
            {
                Ascii:      {Name  : "Cambria Math", Index : -1 }
            }
        };

        mathFont.Set_FromObject(obj);


        TextPrp.Merge(mathFont);*/


        /*var DefaultPrp =
         {
         FontFamily:     {Name  : "Cambria Math", Index : -1 },
         RFonts:
         {
         Ascii:      {Name  : "Cambria Math", Index : -1 }
         },
         FontSize:       11,
         FontSizeCS:     11,
         Italic:         true,
         Bold:           false
         };

         TextPrp.Set_FromObject(DefaultPrp);*/

        var DefaultTextPrp = this.DefaultTextPr.Copy();
        DefaultTextPrp.Italic = false;

        return DefaultTextPrp;
    },
    Set_Select_ToMComp: function(Direction)
    {
        this.bSelectionUse = true;
        this.Root.Set_Select_ToMComp(Direction);
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
            //this.Math.Draw( PDSE.X, PDSE.Y, PDSE.Graphics );
            // CMathComposition     =>   this.Root.draw(this.absPos.x, this.absPos.y , pGraphics);
            // this.absPos.x ~> this.X
            // this.absPos.y ~> this.Y
            this.Root.draw( PDSE.X, PDSE.Y - this.Ascent, PDSE.Graphics );
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

        //console.log("Cursor_MoveToStartPos");

        this.Root.Cursor_MoveToStartPos();
    },

    Cursor_MoveToEndPos : function(SelectFromEnd)
    {
        // TODO: ParaMath.Cursor_MoveToEndPos

        this.Root.Cursor_MoveToEndPos();
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

        var startDx = Math.abs(D),
            endDx = Math.abs(D - Dx);

        var Diff = startDx < endDx ? startDx : endDx;

        var CurX = SearchPos.CurX;

        if(Math.abs(Diff) < SearchPos.DiffX + 0.001)
        {
            if ( D >= - 0.001 && D <= Dx + 0.001 )
            {
                var X = SearchPos.X,
                    Y = SearchPos.Y;

                //SearchPos.X -= this.Math.absPos.x;
                //SearchPos.Y -= this.Math.absPos.y;

                SearchPos.X -= this.X;
                SearchPos.Y -= this.Y;



                this.Root.Get_ParaContentPosByXY(SearchPos, Depth);

                SearchPos.X = X;
                SearchPos.Y = Y;


                //////////

                SearchPos.InText = true;
                SearchPos.DiffX =  0.001; // сравниваем расстояние до ближайшего элемента

            }
            else if(startDx < endDx)
            {
                this.Get_StartPos(SearchPos.Pos, Depth);
                SearchPos.DiffX = Diff;
            }
            else
            {
                this.Get_EndPos(false, SearchPos.Pos, Depth);
                SearchPos.DiffX = Diff - 0.0015;

            }

            Result = true;

        }

        SearchPos.CurX = CurX + Dx;

        return Result;
    },

    Get_ParaContentPos : function(bSelection, bStart, ContentPos) // получить текущую логическую позицию
    {
        // TODO: ParaMath.Get_ParaContentPos

        this.Root.Get_ParaContentPos(bSelection, bStart, ContentPos);

        /*console.log("Get_ParaContentPos");
        var str = "";
        for(var i = 0; i < ContentPos.Data.length; i++)
        {
            str += ContentPos.Data[i] + ", ";
        }

        console.log(str);*/

        return ContentPos;
    },
    Set_ParaContentPos : function(ContentPos, Depth) // выставить логическую позицию в контенте
    {
        // TODO: ParaMath.Set_ParaContentPos

        this.State.ContentPos = ContentPos.Get(Depth);

        /*console.log("Set_ParaContentPos");
        var str = "";
        for(var i = 0; i < ContentPos.Data.length; i++)
        {
            str += ContentPos.Data[i] + "  ";
        }

        console.log(str);*/

        this.Root.Set_ParaContentPos(ContentPos, Depth);

    },
    Get_PosByElement : function(Class, ContentPos, Depth, UseRange, Range, Line)
    {
        if ( this === Class )
            return true;

        // TODO: ParaMath.Get_PosByElement
    },

    Get_PosByDrawing : function(Id, ContentPos, Depth)
    {
        return false;
    },

    Get_RunElementByPos : function(ContentPos, Depth)
    {
        return null;
    },

    Get_LastRunInRange : function(_CurLine, _CurRange)
    {
        return null;
    },

    Get_LeftPos : function(SearchPos, ContentPos, Depth, UseContentPos)
    {
        // TODO: ParaMath.Get_LeftPos

        return this.Root.Get_LeftPos(SearchPos, ContentPos, Depth, UseContentPos, false);
    },

    Get_RightPos : function(SearchPos, ContentPos, Depth, UseContentPos, StepEnd)
    {
        // TODO: ParaMath.Get_RightPos

        return this.Root.Get_RightPos(SearchPos, ContentPos, Depth, UseContentPos, StepEnd, false);
    },

    Get_WordStartPos : function(SearchPos, ContentPos, Depth, UseContentPos)
    {
        // TODO: ParaMath.Get_StartEndPos
        this.Root.Get_WordStartPos(SearchPos, ContentPos, Depth, UseContentPos, false);

        /*var str = "";

        for(var i = 0; i < SearchPos.Pos.Data.length; i++)
        {
            str += SearchPos.Pos.Data[i] + "  ";
        }

        console.log(str);*/
    },

    Get_WordEndPos : function(SearchPos, ContentPos, Depth, UseContentPos, StepEnd)
    {
        // TODO: ParaMath.Get_WordEndPos
        this.Root.Get_WordEndPos(SearchPos, ContentPos, Depth, UseContentPos, StepEnd, false);
    },

    Get_EndRangePos : function(_CurLine, _CurRange, SearchPos, Depth)
    {
        // TODO: ParaMath.Get_EndRangePos

        // Сделать для случая, когда формула будет занимать несколько строк

        this.Root.Get_EndPos(false, SearchPos, Depth);

    },

    Get_StartRangePos : function(_CurLine, _CurRange, SearchPos, Depth)
    {
        // TODO: ParaMath.Get_StartRangePos

        // Сделать для случая, когда формула будет занимать несколько строк, переделать

        this.Root.Get_StartPos(SearchPos, Depth);

    },

    Get_StartRangePos2 : function(_CurLine, _CurRange, ContentPos, Depth)
    {
        // TODO: ParaMath.Get_StartRangePos2

        // Сделать для случая, когда формула будет занимать несколько строк, переделать

        this.Root.Get_StartPos(ContentPos, Depth);

    },

    Get_StartPos : function(ContentPos, Depth)
    {
        // TODO: ParaMath.Get_StartPos

        this.Root.Get_StartPos(ContentPos, Depth);

        /*var str = "";

        for(var i = 0 ; i < ContentPos.Data.length; i++)
        {

        }*/

        //console.log("Get_StartPos");
    },

    Get_EndPos : function(BehindEnd, ContentPos, Depth)
    {
        // TODO: ParaMath.Get_EndPos
        this.Root.Get_EndPos(BehindEnd, ContentPos, Depth);
    },
//-----------------------------------------------------------------------------------
// Функции для работы с селектом
//-----------------------------------------------------------------------------------
    Set_SelectionContentPos : function(StartContentPos, EndContentPos, Depth, StartFlag, EndFlag)
    {
        // TODO: ParaMath.Set_SelectionContentPos

        //console.log(" Set_SelectionContentPos " );

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

        this.Root.Selection_Remove();
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
                {
                    oCont.content[Start].Selection_DrawRange(0, 0, SelectionDraw);
                }
                else
                {
                    oCont.content[Start].Selection_DrawRange(0, 0, SelectionDraw);

                    SelectionDraw.FindStart = false; // выставляем здесь флаг, для того чтобы правильно отрисовался селект для случая пустой ран мат. объект пустой ран
                    SelectionDraw.W += oCont.WidthToElement[End] - oCont.WidthToElement[Start + 1]; // startPos < endPos !

                    oCont.content[End].Selection_DrawRange(0,0, SelectionDraw);
                }

                if(!oCont.bRoot)
                {
                    //SelectionDraw.StartY = this.Math.absPos.y + oCont.pos.y; // выставляем так, чтобы для формул с различной высотой в одной строке, всё было ok
                    SelectionDraw.StartY = this.Y + oCont.pos.y; // выставляем так, чтобы для формул с различной высотой в одной строке, всё было ok
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

        return this.Root.Selection_IsEmpty();
    },
    Selection_IsPlaceholder : function()
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
    Save_Changes : function(Data, Writer)
    {
		Writer.WriteLong( historyitem_type_Math );
    },

    Load_Changes : function(Reader)
    {
				
    },
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
		Writer.WriteString2( this.Root.Id );
	},

    Read_FromBinary2 : function(Reader)
    {
		var Element = g_oTableId.Get_ById( Reader.GetString2() );
		Element.bRoot = true;
		this.Root = Element;
		
	}
};

var MATH_CTX = null;

function TEST_MATH_ImageConverter()
{
    var dataImg = editor.WordControl.m_oLogicDocument.Content[0].Content[0].MathToImageConverter();

    console.log(dataImg.ImageUrl);
}