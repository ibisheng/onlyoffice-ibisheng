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
MathMenu.prototype =
{
	Get_Type : function()
    {
        return this.Type;
    }
}
function ParaMath()
{
    ParaMath.superclass.constructor.call(this);

    this.Id = g_oIdCounter.Get_NewId();
    this.Type  = para_Math;

    this.MathPara = true;  // false - внутристроковая формула, true - формула на отдельной строке (w:oMath/w:oMathPara)

    this.OldMathPara = null;

    this.Jc       = undefined;
    //this.Math = new CMathComposition();
    //this.Math.Parent = this;
    //this.Root = this.Math.Root;

    this.Root       = new CMathContent();
    this.Root.bRoot = true;

    this.X          = 0;
    this.Y          = 0;

    //this.CurrentContent    = this.RootComposition;
    //this.SelectContent     = this.RootComposition;
    this.bSelectionUse     = false;


    //this.State      = new CParaRunState();       // Положение курсора и селекта для данного run
    this.Paragraph  = null;

    this.NearPosArray = [];

    this.Width        = 0;
    this.WidthVisible = 0;
    this.Height       = 0;
    this.Ascent       = 0;
    this.Descent      = 0;

    this.DefaultTextPr = new CTextPr();
    //this.DefaultTextPr.Init_Default();

    this.DefaultTextPr.Italic     = true;
    this.DefaultTextPr.FontFamily = {Name  : "Cambria Math", Index : -1 };
    this.DefaultTextPr.RFonts.Set_All("Cambria Math", -1);


    /*this.MathPr =
    {
        naryLim:    NARY_UndOvr,
        intLim:     NARY_SubSup,
        brkBin:     BREAK_BEFORE,
        brkSubBin:  BREAK_MIN_MIN,
        wrapIndent: 0,
        smallFrac:  false,
        wrapRight:  false
    };*/

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
};

ParaMath.prototype.Set_Paragraph = function(Paragraph)
{
    this.Paragraph = Paragraph;
};

ParaMath.prototype.Is_Empty = function()
{
    return this.Root.content.length == 0;
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

    var TextPr = new CTextPr();

    var oContent = this.GetSelectContent();
    var mTextPr = oContent.Content.Get_CompiledTextPr(Copy);
    TextPr.Merge( mTextPr );

    return TextPr;
};

ParaMath.prototype.Add = function(Item)
{
    var Type = Item.Type;
    var oContent = this.GetSelectContent();
    var oStartContent = oContent.Content.content[oContent.Start];
    var oEndContent = oContent.Content.content[oContent.End];

    if ( para_Text === Type)
    {
        var oText = new CMathText(false);
        oText.add(Item.Value);
        oStartContent.Add(oText, true);
    }
    else if ( para_Space === Type )
    {
        //var oSpace = new ParaSpace(1);
        var oText = new CMathText(false);
        oText.addTxt(" ");
        oStartContent.Add(oText, true);
    }
    else if ( para_Math === Type )
    {
        if (oStartContent.Type == para_Math_Run && oStartContent.IsPlaceholder())
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

                for (var i=nLenStart-1; i>=nPosStart; i--)
                {
                    var Pos = oMRun.Content.length;
                    var EndPos = Pos + 1;
                    var oItem = oStartContent.Content[i];
                    oMRun.Add(oItem, true);
                    oStartContent.Remove_FromContent(i, 1, false);
                }
                oStartContent.Selection_Remove();
            }

            oContent.Content.Load_FromMenu(Item.Menu, this.Paragraph);

            if(nPosStart != nLenStart)
            {
                var items = [];
                oContent.Content.Add(oMRun,oContent.Content.CurPos+1);
                items.push(oMRun);
                var Pos = oContent.Content.CurPos,
                    PosEnd = Pos + 1;
                History.Add(oContent.Content, {Type: historyitem_Math_AddItem, Items: items, Pos: Pos, PosEnd: PosEnd});
            }


        }
        oContent.Content.SetRunEmptyToContent(true);
    }
};

ParaMath.prototype.Remove = function(Direction, bOnAddText)
{
    var oContent = this.GetSelectContent();
    if (oContent.Start == oContent.End)
    {
        var oElem = oContent.Content.getElem(oContent.Start);

        if (oElem.Type == para_Math_Composition)
            this.RemoveElem(oContent, Direction, bOnAddText);
        else if (oElem.Type == para_Math_Run && oElem.IsPlaceholder() && bOnAddText == false)
        {
            var Comp = oContent.Content.GetParent();
            Comp.SetSelectAll();
            Comp.SelectToParent();
            this.bSelectionUse = true;
        }
        else if (oElem.Type == para_Math_Run && oElem.IsPlaceholder() && bOnAddText == true)
        {
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
                    if (prevElem.Type == para_Math_Composition) //слева композиция
                    {
                        this.Set_Select_ToMComp(Direction);
                        return;
                    }
                    else //слева ран
                    {
						if(prevElem.Content.length == 0 && !bOnAddText)
						{
							this.RemoveEmptyRun(prevElem);
							this.Remove( Direction, bOnAddText );
							return;
						}
                        prevElem.Remove(Direction, bOnAddText);

                        if(prevElem.Content.length == 0 && !bOnAddText) //тк pararun пустой, удаляем его
							this.RemoveEmptyRun(prevElem);
                        return;
                    }
                }
                else if (!oElem.Selection.Use)//переходим на уровень выше и выделяем композицию
                {
					if (oContent.Content.bRoot) //мы находмися на выходе из формулы
						return false;
                    var Comp = oContent.Content.GetParent();
                    Comp.SetSelectAll();
                    Comp.SelectToParent();
                    this.bSelectionUse = true;
                }
            }
            else if (Direction > 0 && oElem.State.ContentPos + 1 > oElem.Content.length) //delete
            {
                if (oContent.Content.CurPos + 1 >= oContent.Content.content.length && !oElem.Selection.Use) //переходим на уровень выше и выделяем композицию
                {
					if (oContent.Content.bRoot) //мы находмися на выходе из формулы
						return false; 
                    var Comp = oContent.Content.GetParent();
                    Comp.SetSelectAll();
                    Comp.SelectToParent();
                    this.bSelectionUse = true;
                }
                else if (!oElem.Selection.Use)//справа есть элемент
                {
                    var nNextElem = oContent.Start + 1;
                    var nextElem = oContent.Content.getElem(nNextElem);
                    if (nextElem.Type == para_Math_Composition) //справа композиция
                    {
                        this.Set_Select_ToMComp(Direction);
                        return;
                    }
                    else //справа ран
                    {
                        nextElem.State.ContentPos = 0;
                        nextElem.Remove(Direction, bOnAddText);
                        if(nextElem.Content.length == 0 && !bOnAddText) //тк pararun пустой, удаляем его
                        {
                            var Items = [];
                            Items.push(nextElem);
                            nextElem.Parent.content.splice( nNextElem, 1 );
                            History.Add(nextElem.Parent, {Type: historyitem_Math_RemoveItem, Items:Items, Pos: 0});
                        }
                        return;
                    }
                }
            }

            oElem.Remove(Direction, bOnAddText);		
			
			if (oElem.Content.length == 0 && oContent.Start == oContent.Content.content.length - 1 &&
				oContent.Start >0 && oContent.Content.content[oContent.Start-1].Type == para_Math_Composition) //тк это крайний правый пустой ран и слева композиция, он остается.
					return;
            else if( oElem.Content.length == 0 && !bOnAddText) //тк pararun пустой, удаляем его
            {
                var Items = [];
                Items.push(oElem.Parent.content[oContent.Start]);
                oElem.Parent.content.splice( oContent.Start, 1 );
                History.Add(oElem.Parent, {Type: historyitem_Math_RemoveItem, Items:Items, Pos: oContent.Start});
				this.PosTransitLeft(oContent.Content);
				oContent.Content.SetRunEmptyToContent(true);
            }
        }
    }
    else
        return this.RemoveElem(oContent, Direction, bOnAddText);

},

ParaMath.prototype.RemoveElem = function(oContent, Direction, bOnAdd)
{
	var oMath = oContent.Content;
	var oMathContent = oMath.content;
	
    var start = oMath.Selection.Start,
        end   = oMath.Selection.End;
		
	var bRightSelect = true;
		
	if(start > end)
	{
		bRightSelect = false;
		start = oMath.Selection.End;
        end   = oMath.Selection.Start;
	}
	
	var oStartContent = oMathContent[start]; 
	if ( para_Math_Run == oStartContent.Type)
		if (oStartContent.Selection.StartPos == oStartContent.Selection.EndPos == oStartContent.Content.length)
			start++;//у левого рана буквы не заселекчены, но в селект он попал, так что его удалять не надо
		
	var oEndContent = oMathContent[end];
	if ( para_Math_Run == oEndContent.Type && !bRightSelect)
		if (oEndContent.Selection.StartPos == oEndContent.Selection.EndPos &&  oEndContent.Selection.EndPos == oEndContent.Content.length)
			end--;//у правого рана буквы не заселекчены, но в селект он попал, так что его удалять не надо
	
	var nStartContent 	= start;
	var nEndContent 	= end;

    History.Create_NewPoint();
    var Items = [];
    
	var oElem = oMathContent[start];		
	if ( para_Math_Run == oElem.Type && oElem.Selection.Use)
	{
		if  (oElem.Selection.EndPos - oElem.Selection.StartPos != oElem.Content.length)
		{
			oElem.Remove(Direction,false);
			start++;
			if (!bRightSelect)
				oMath.CurPos++;
		}
		else 
			nStartContent--;
	}
	else
	{
		Items.push(oElem);			
		History.Add(oMath, {Type: historyitem_Math_RemoveItem, Items:Items, Pos: start});
	}
	
	if ( start != end)
	{
		Items = [];
		for (var i=nStartContent+1; i<nEndContent; i++)
		{
			oElem = oMathContent[i];
			Items.push(oElem);
		}
		if (Items.length > 0)
			History.Add(oMath, {Type: historyitem_Math_RemoveItem, Items:Items, Pos: nStartContent+1});		
		
		Items = [];
		var oElem = oMathContent[end];
		if ( para_Math_Run == oElem.Type && oElem.Selection.Use)
		{
			if  (oElem.Selection.EndPos - oElem.Selection.StartPos != oElem.Content.length)
			{
				oElem.Remove(Direction,false);
				end--;
				if (bRightSelect)
					this.PosTransitLeft(oMath);
			}
			else
				nEndContent++;
		}
		else
		{
			Items.push(oElem);			 
			History.Add(oMath, {Type: historyitem_Math_RemoveItem, Items:Items, Pos: end});
		}
	}
	
	var len = end - start + 1;
	oMathContent.splice( start, len );
	
	if (bRightSelect)
		oMath.CurPos = oMath.CurPos - len + 1;
	
	//добавляем пустой ран на месте удаленных элементов, и ставим на него селект		
	var oMRun = new ParaRun(this.Paragraph, true);
    //oMRun.Pr = oStartContent.Pr;		
	var items = [];
    oMathContent.splice(oMath.CurPos, 0, oMRun);
    items.push(oMRun);
    var Pos = oMath.CurPos,
        PosEnd = Pos + 1;
    History.Add(oContent.Content, {Type: historyitem_Math_AddItem, Items: items, Pos: Pos, PosEnd: PosEnd});		

	oContent.Content.SetRunEmptyToContent(true);
	if (oMath.CurPos < 0)
		oMath.CurPos = 0;

	this.Selection_Remove();
    return;
};

ParaMath.prototype.RemoveEmptyRun = function(oElem)
 {
    var Items = [];
    Items.push(oElem.Parent.content[oElem.Parent.CurPos]);
    oElem.Parent.content.splice( oElem.Parent.CurPos, 1 );
    History.Add(oElem.Parent, {Type: historyitem_Math_RemoveItem, Items:Items, Pos: oElem.Parent.CurPos});
    this.PosTransitLeft(oElem.Parent)
}

ParaMath.prototype.PosTransitLeft = function(oElem)
{
	var oPreElem;
	if (oElem.CurPos > 0)
	{
		oElem.CurPos--;
		oPreElem = oElem.content[oElem.CurPos];		
		if (oPreElem.Type == para_Math_Run)
			oPreElem.State.ContentPos = oPreElem.Content.length;
	}
	
}

ParaMath.prototype.GetSelectContent = function()
{
    return this.Root.GetSelectContent();
};

ParaMath.prototype.Get_CurrentParaPos = function()
{
    //var CurPos = this.State.ContentPos;

    /*if ( CurPos >= 0 && CurPos < this.Content.length )
     return this.Content[CurPos].Get_CurrentParaPos();*/

    return new CParaPos( this.StartRange, this.StartLine, 0, 0 );
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
        content.Apply_TextPr(TextPr, IncFontSize, ApplyToAll);
    }

};

ParaMath.prototype.Clear_TextPr = function()
{

};

ParaMath.prototype.Check_NearestPos = function(ParaNearPos, Depth)
{
    /*var MathNearPos = new CParagraphElementNearPos();
     MathNearPos.NearPos = ParaNearPos.NearPos;
     MathNearPos.Depth   = Depth;

     // CParagraphNearPos for ParaNearPos
     this.NearPosArray.push( MathNearPos );
     ParaNearPos.Classes.push( this );

     var CurPos = ParaNearPos.NearPos.ContentPos.Get(Depth);
     this.Content[CurPos].Check_NearestPos( ParaNearPos, Depth + 1 );*/
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

    var RPI = new CRPI();
    RPI.bInline       = this.MathPara === false;
    RPI.bChangeInline = this.MathPara != this.OldMathPara;

    var ArgSize = new CMathArgSize();

    if(PRS.NewRange  == false)
        this.Root.Recalculate_Reset(PRS.Range, PRS.Line);

    this.Root.Resize(g_oTextMeasurer, null, this, RPI/*recalculate properties info*/, ArgSize,  TextPr);

    //this.Root.Resize(null, this, g_oTextMeasurer, RPI/*recalculate properties info*/, TextPr);
    this.OldMathPara = this.MathPara;


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

    var RangeStartPos = this.protected_AddRange(CurLine, CurRange);
    var RangeEndPos   = 0;

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

    if ( true !== PRS.NewRange )
    {
        RangeEndPos = this.Root.content.length; // RangeEndPos = 1;    to    RangeEndPos = this.Content.length;

        // Обновляем метрику строки
        if ( PRS.LineAscent < this.Ascent )
            PRS.LineAscent = this.Ascent;

        if ( PRS.LineDescent < this.Descent )
            PRS.LineDescent = this.Descent;
    }

    this.protected_FillRange(CurLine, CurRange, RangeStartPos, RangeEndPos);
    //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
};

ParaMath.prototype.Recalculate_Set_RangeEndPos = function(PRS, PRP, Depth)
{
    var CurLine  = PRS.Line - this.StartLine;
    var CurRange = ( 0 === CurLine ? PRS.Range - this.StartRange : PRS.Range );
    var CurPos   = PRP.Get(Depth);

    this.protected_FillRangeEndPos(CurLine, CurRange, CurPos);
};

ParaMath.prototype.Recalculate_Range_Width = function(PRSC, _CurLine, _CurRange)
{
    var CurLine = _CurLine - this.StartLine;
    var CurRange = ( 0 === CurLine ? _CurRange - this.StartRange : _CurRange );

    var StartPos = this.protected_GetRangeStartPos(CurLine, CurRange);
    var EndPos   = this.protected_GetRangeEndPos(CurLine, CurRange);

    if ( EndPos >= 1 )
    {
        PRSC.Letters++;

        if ( true !== PRSC.Word )
        {
            PRSC.Word = true;
            PRSC.Words++;
        }

        PRSC.Range.W += this.Width;
        PRSC.Range.W += PRSC.SpaceLen;

        PRSC.SpaceLen = 0;

        // Пробелы перед первым словом в строке не считаем
        if (PRSC.Words > 1)
            PRSC.Spaces += PRSC.SpacesCount;
        else
            PRSC.SpacesSkip += PRSC.SpacesCount;

        PRSC.SpacesCount = 0;
    }
};

ParaMath.prototype.Recalculate_Range_Spaces = function(PRSA, _CurLine, _CurRange, _CurPage)
{
    var CurLine = _CurLine - this.StartLine;
    var CurRange = ( 0 === CurLine ? _CurRange - this.StartRange : _CurRange );

    var StartPos = this.protected_GetRangeStartPos(CurLine, CurRange);
    var EndPos   = this.protected_GetRangeEndPos(CurLine, CurRange);

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
};

ParaMath.prototype.Recalculate_PageEndInfo = function(PRSI, _CurLine, _CurRange)
{
};

ParaMath.prototype.Save_RecalculateObject = function(Copy)
{
    var RecalcObj = new CRunRecalculateObject(this.StartLine, this.StartRange);
    RecalcObj.Save_Lines( this, Copy );

    // TODO: Сделать сохранение пересчета у формулы

    return RecalcObj;
};

ParaMath.prototype.Load_RecalculateObject = function(RecalcObj)
{
    RecalcObj.Load_Lines(this);
};

ParaMath.prototype.Prepare_RecalculateObject = function()
{
    this.protected_ClearLines();
};

ParaMath.prototype.Is_EmptyRange = function(_CurLine, _CurRange)
{
    var CurLine = _CurLine - this.StartLine;
    var CurRange = ( 0 === CurLine ? _CurRange - this.StartRange : _CurRange );

    var StartPos = this.protected_GetRangeStartPos(CurLine, CurRange);
    var EndPos   = this.protected_GetRangeEndPos(CurLine, CurRange);

    if ( EndPos >= 1 )
        return false;

    return true;
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
    var Pos = ContentPos.Get(Depth);

    var CurLine  = 0;
    var CurRange = 0;

    var LinesCount = this.protected_GetLinesCount();
    for ( ; CurLine < LinesCount; CurLine++ )
    {
        var RangesCount = this.protected_GetRangesCount(CurLine);
        for ( CurRange = 0; CurRange < RangesCount; CurRange++ )
        {
            var StartPos = this.protected_GetRangeStartPos(CurLine, CurRange);
            var EndPos   = this.protected_GetRangeEndPos(CurLine, CurRange);

            if (Pos < EndPos && Pos >= StartPos)
                return new CParaPos((CurLine === 0 ? CurRange + this.StartRange : CurRange), CurLine + this.StartLine, 0, 0);
        }
    }

    return new CParaPos((LinesCount === 1 ? this.protected_GetRangesCount(0) - 1 + this.StartRange : this.protected_GetRangesCount(0) - 1), LinesCount - 1 + this.StartLine, 0, 0);
};

ParaMath.prototype.Recalculate_CurPos = function(_X, Y, CurrentRun, _CurRange, _CurLine, _CurPage, UpdateCurPos, UpdateTarget, ReturnTarget)
{
    var CurLine  = _CurLine - this.StartLine;
    var CurRange = ( 0 === CurLine ? _CurRange - this.StartRange : _CurRange );

    var StartPos = this.protected_GetRangeStartPos(CurLine, CurRange);
    var EndPos   = this.protected_GetRangeEndPos(CurLine, CurRange);

    var result = {X: _X + this.Root.size.width};


    if ( EndPos >= 1 && CurrentRun == true)
    {
        result = this.Root.Recalculate_CurPos(_X, Y, CurrentRun, _CurRange, _CurLine, _CurPage, UpdateCurPos, UpdateTarget, ReturnTarget);
    }


    return result;
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

ParaMath.prototype.Shift_Range = function(Dx, Dy, _CurLine, _CurRange)
{
    var CurLine = _CurLine - this.StartLine;
    var CurRange = ( 0 === CurLine ? _CurRange - this.StartRange : _CurRange );

    var StartPos = this.protected_GetRangeStartPos(CurLine, CurRange);
    var EndPos   = this.protected_GetRangeEndPos(CurLine, CurRange);

    if ( EndPos >= 1 )
    {
        // TODO: Сделать смещение на Dx, Dy
    }
};
//-----------------------------------------------------------------------------------
// Функция для работы с формулой
// в тч с  дефолтными текстовыми настройками и argSize
//-----------------------------------------------------------------------------------
ParaMath.prototype.MathToImageConverter= function()
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
};

ParaMath.prototype.ApplyArgSize = function(oWPrp, argSize)
{
    var tPrp = new CTextPr();

    tPrp.Merge(this.DefaultTextPr);
    tPrp.Merge(oWPrp);

    //var FSize = tPrp.FontSize;

    if(argSize == -1)
    {
        //FSize = 0.0009*FSize*FSize + 0.68*FSize + 0.26;
        tPrp.FontSize   = 0.76*tPrp.FontSize;
        tPrp.FontSizeCS = 0.76*tPrp.FontSizeCS;
    }
    else if(argSize == -2)
    {
        //FSize = -0.0004*FSize*FSize + 0.66*FSize + 0.87;
        tPrp.FontSize   = 0.76*0.855*tPrp.FontSize;
        tPrp.FontSizeCS = 0.76*0.855*tPrp.FontSizeCS;
    }

    //tPrp.FontSize = FSize;

    oWPrp.Merge(tPrp);

};

/*ParaMath.prototype.GetDefaultTxtPrp= function()
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
 };*/

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
};

ParaMath.prototype.Set_Select_ToMComp = function(Direction)
{
    this.bSelectionUse = true;
    this.Root.Set_Select_ToMComp(Direction);
};
//-----------------------------------------------------------------------------------
// Функции отрисовки
//-----------------------------------------------------------------------------------
ParaMath.prototype.Draw_HighLights = function(PDSH)
{
    var CurLine  = PDSH.Line - this.StartLine;
    var CurRange = ( 0 === CurLine ? PDSH.Range - this.StartRange : PDSH.Range );

    var StartPos = this.protected_GetRangeStartPos(CurLine, CurRange);
    var EndPos   = this.protected_GetRangeEndPos(CurLine, CurRange);

    if ( EndPos >= 1 )
    {
        PDSH.X += this.Width;
    }
};

ParaMath.prototype.Draw_Elements = function(PDSE)
{
    var CurLine  = PDSE.Line - this.StartLine;
    var CurRange = ( 0 === CurLine ? PDSE.Range - this.StartRange : PDSE.Range );

    var StartPos = this.protected_GetRangeStartPos(CurLine, CurRange);
    var EndPos   = this.protected_GetRangeEndPos(CurLine, CurRange);

    /*PDSE.Graphics.p_color(255,0,0, 255);
     PDSE.Graphics.drawHorLine(0, PDSE.Y - this.Ascent, PDSE.X - 30, PDSE.X + this.Width + 30 , 1);*/

    if ( EndPos >= 1 )
    {
        //this.Math.Draw( PDSE.X, PDSE.Y, PDSE.Graphics );
        // CMathComposition     =>   this.Root.draw(this.absPos.x, this.absPos.y , pGraphics);
        // this.absPos.x ~> this.X
        // this.absPos.y ~> this.Y

        this.Root.draw( PDSE.X, PDSE.Y - this.Ascent, PDSE.Graphics);

        PDSE.X += this.Width;


    }

    /*PDSE.Graphics.p_color(255,0,0, 255);
     PDSE.Graphics.drawHorLine(0, PDSE.Y - this.Ascent + this.Height, PDSE.X - 30, PDSE.X + this.Width + 30 , 1);*/
};

ParaMath.prototype.Draw_Lines = function(PDSL)
{
    var CurLine  = PDSL.Line - this.StartLine;
    var CurRange = ( 0 === CurLine ? PDSL.Range - this.StartRange : PDSL.Range );

    var StartPos = this.protected_GetRangeStartPos(CurLine, CurRange);
    var EndPos   = this.protected_GetRangeEndPos(CurLine, CurRange);

    if ( EndPos >= 1 )
    {
        PDSL.X += this.Width;

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
    // TODO: ParaMath.Get_ParaContentPosByXY

    var Result = false;

    var CurLine  = _CurLine - this.StartLine;
    var CurRange = ( 0 === CurLine ? _CurRange - this.StartRange : _CurRange ); // если находимся в нулевой строке (для текущей позиции), то CurRange мб ненулевой

    var StartPos = this.protected_GetRangeStartPos(CurLine, CurRange);
    var EndPos   = this.protected_GetRangeEndPos(CurLine, CurRange);

    // TODO: реализовать поиск по Y (для случая, когда формула занимает больше одной строки)

    // Проверяем, попали ли мы в формулу

    if ( EndPos >= 1 )
    {
        var Dx = this.Root.size.width;
        var D = SearchPos.X - SearchPos.CurX;

        var CurX = SearchPos.CurX;

        Result = this.Root.Get_ParaContentPosByXY(SearchPos, Depth, _CurLine, _CurRange, StepEnd);

        if ( D >= - 0.001 && D <= Dx + 0.001 )
        {
            SearchPos.DiffX =  0.001;
        }

        SearchPos.CurX = CurX + Dx;
    }


    return Result;
};

ParaMath.prototype.Get_ParaContentPos = function(bSelection, bStart, ContentPos) // получить текущую логическую позицию
{
    // TODO: ParaMath.Get_ParaContentPos

    this.Root.Get_ParaContentPos(bSelection, bStart, ContentPos);


    return ContentPos;
};

ParaMath.prototype.Set_ParaContentPos = function(ContentPos, Depth) // выставить логическую позицию в контенте
{
    // TODO: ParaMath.Set_ParaContentPos

    //this.State.ContentPos = ContentPos.Get(Depth);

    /*console.log("Set_ParaContentPos");
     var str = "";
     for(var i = 0; i < ContentPos.Data.length; i++)
     {
     str += ContentPos.Data[i] + "  ";
     }

     console.log(str);*/

    //console.log("Set_ParaContentPos");

    this.Root.Set_ParaContentPos(ContentPos, Depth);

};

ParaMath.prototype.Get_PosByElement = function(Class, ContentPos, Depth, UseRange, Range, Line)
{
    if ( this === Class )
        return true;

    // TODO: ParaMath.Get_PosByElement
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
    // TODO: ParaMath.Get_LeftPos

    return this.Root.Get_LeftPos(SearchPos, ContentPos, Depth, UseContentPos, false);
};

ParaMath.prototype.Get_RightPos = function(SearchPos, ContentPos, Depth, UseContentPos, StepEnd)
{
    // TODO: ParaMath.Get_RightPos

    return this.Root.Get_RightPos(SearchPos, ContentPos, Depth, UseContentPos, StepEnd, false);
};

ParaMath.prototype.Get_WordStartPos = function(SearchPos, ContentPos, Depth, UseContentPos)
{
    // TODO: ParaMath.Get_StartEndPos
    this.Root.Get_WordStartPos(SearchPos, ContentPos, Depth, UseContentPos, false);
};

ParaMath.prototype.Get_WordEndPos = function(SearchPos, ContentPos, Depth, UseContentPos, StepEnd)
{
    // TODO: ParaMath.Get_WordEndPos
    this.Root.Get_WordEndPos(SearchPos, ContentPos, Depth, UseContentPos, StepEnd, false);
};

ParaMath.prototype.Get_EndRangePos = function(_CurLine, _CurRange, SearchPos, Depth)
{
    // TODO: ParaMath.Get_EndRangePos

    // Сделать для случая, когда формула будет занимать несколько строк

    return this.Root.Get_EndRangePos(_CurLine, _CurRange, SearchPos, Depth);

};

ParaMath.prototype.Get_StartRangePos = function(_CurLine, _CurRange, SearchPos, Depth)
{
    // TODO: ParaMath.Get_StartRangePos

    // Сделать для случая, когда формула будет занимать несколько строк, переделать

    return this.Root.Get_StartRangePos(_CurLine, _CurRange, SearchPos, Depth);
    //this.Root.Get_StartPos(SearchPos.Pos, Depth);

};

ParaMath.prototype.Get_StartRangePos2 = function(_CurLine, _CurRange, ContentPos, Depth)
{
    // TODO: ParaMath.Get_StartRangePos2

    // Сделать для случая, когда формула будет занимать несколько строк, переделать

    this.Root.Get_StartRangePos2(_CurLine, _CurRange, ContentPos, Depth);

};

ParaMath.prototype.Get_StartPos = function(ContentPos, Depth)
{
    // TODO: ParaMath.Get_StartPos

    this.Root.Get_StartPos(ContentPos, Depth);
};

ParaMath.prototype.Get_EndPos = function(BehindEnd, ContentPos, Depth)
{
    // TODO: ParaMath.Get_EndPos
    this.Root.Get_EndPos(BehindEnd, ContentPos, Depth);
};
//-----------------------------------------------------------------------------------
// Функции для работы с селектом
//-----------------------------------------------------------------------------------
ParaMath.prototype.Set_SelectionContentPos = function(StartContentPos, EndContentPos, Depth, StartFlag, EndFlag)
{
    // TODO: ParaMath.Set_SelectionContentPos

    this.Root.Set_SelectionContentPos(StartContentPos, EndContentPos, Depth, StartFlag, EndFlag);
    this.bSelectionUse = true;
};

ParaMath.prototype.Selection_IsUse = function()
{
    // TODO: ParaMath.Selection_IsUse

    return this.bSelectionUse;
};

ParaMath.prototype.Selection_Stop = function()
{

};

ParaMath.prototype.Selection_Remove = function()
{
    // TODO: ParaMath.Selection_Remove

    this.bSelectionUse = false;
    this.Root.Selection_Remove();
};

ParaMath.prototype.Select_All = function(Direction)
{
    // TODO: ParaMath.Select_All
    this.bSelectionUse = true;
    this.Root.Select_All();
};

ParaMath.prototype.Selection_DrawRange = function(_CurLine, _CurRange, SelectionDraw)
{
    var CurLine = _CurLine - this.StartLine;
    var CurRange = ( 0 === CurLine ? _CurRange - this.StartRange : _CurRange );

    var StartPos = this.protected_GetRangeStartPos(CurLine, CurRange);
    var EndPos   = this.protected_GetRangeEndPos(CurLine, CurRange);

    if ( EndPos >= 1 )
    {
        if ( true === this.bSelectionUse )
        {
            // TODO: ParaMath.Selection_Draw_Range

            var result = this.GetSelectContent();

            result.Content.Selection_DrawRange(_CurLine, _CurRange, SelectionDraw);

            /*

             var Start = result.Start,
             End = result.End,
             oCont = result.Content;


             SelectionDraw.StartX += oCont.pos.x + oCont.WidthToElement[Start];


             if(Start == End)
             {
             oCont.content[Start].Selection_DrawRange(_CurLine, _CurRange, SelectionDraw);
             }
             else
             {
             oCont.content[Start].Selection_DrawRange(_CurLine, _CurRange, SelectionDraw);

             SelectionDraw.FindStart = false; // выставляем здесь флаг, для того чтобы правильно отрисовался селект для случая пустой ран мат. объект пустой ран
             SelectionDraw.W += oCont.WidthToElement[End] - oCont.WidthToElement[Start + 1]; // startPos < endPos !

             oCont.content[End].Selection_DrawRange(_CurLine, _CurRange, SelectionDraw);
             }

             if(!oCont.bRoot)
             {
             //SelectionDraw.StartY = this.Math.absPos.y + oCont.pos.y; // выставляем так, чтобы для формул с различной высотой в одной строке, всё было ok
             SelectionDraw.StartY = this.Y + oCont.pos.y; // выставляем так, чтобы для формул с различной высотой в одной строке, всё было ok
             SelectionDraw.H = oCont.size.height;
             }*/

        }
        else
        {
            if ( true === SelectionDraw.FindStart )
            {
                SelectionDraw.StartX += this.Width;
            }
        }

    }

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
ParaMath.prototype.Save_Changes = function(Data, Writer)
{
    Writer.WriteLong( historyitem_type_Math );
};

ParaMath.prototype.Load_Changes = function(Reader)
{

};

ParaMath.prototype.Write_ToBinary = function(Writer)
{
    // Long   : Type
    // String : Id
    Writer.WriteLong( this.Type );
    Writer.WriteString2( this.Id );
};

ParaMath.prototype.Write_ToBinary2 = function(Writer)
{
    Writer.WriteLong( historyitem_type_Math );
    Writer.WriteString2( this.Root.Id );
};

ParaMath.prototype.Read_FromBinary2 = function(Reader)
{
    var Element = g_oTableId.Get_ById( Reader.GetString2() );
    Element.bRoot = true;
    this.Root = Element;

};