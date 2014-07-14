"use strict";

/**
 * User: Ilja.Kirillov
 * Date: 24.06.13
 * Time: 12:35
 */

//----------------------------------------------------------------------------------------------------------------------
// CDocumentSpelling
//         Проверка орфографии в документе. Здесь будут хранится параграфы, которые надо проверить. Параграфы, в
//         которых уже есть неверно набранные слова, а также набор слов, которые игнорируются при проверке.
//----------------------------------------------------------------------------------------------------------------------
function CDocumentSpelling()
{
    this.Use         = true; 
    this.Paragraphs  = {}; // Параграфы, в которых есть ошибки в орфографии (объект с ключом - Id параграфа)
    this.Words       = {}; // Слова, которые пользователь решил пропустить(нажал "пропустить все") при проверке орфографии
    this.CheckPara   = {}; // Параграфы, в которых нужно запустить проверку орфографии
    this.CurPara     = {}; // Параграфы, в которых мы не проверили некотырые слова, из-за того что в них стоял курсор
    
    // Добавим в список исключений слово Teamlab
    this.Words["Teamlab"] = true;
    this.Words["teamlab"] = true;
}

CDocumentSpelling.prototype =
{
    Add_Paragraph : function(Id, Para)
    {
        this.Paragraphs[Id] = Para;
    },

    Remove_Paragraph : function(Id)
    {
        delete this.Paragraphs[Id];
    },

    Check_Word : function(Word)
    {
        if ( undefined != this.Words[Word] )
            return true;

        return false;
    },

    Add_Word : function(Word)
    {
        this.Words[Word] = true;

        for ( var Id in this.Paragraphs )
        {
            var Para = this.Paragraphs[Id];
            Para.SpellChecker.Ignore( Word );
        }
    },

    Add_ParagraphToCheck : function(Id, Para)
    {
        this.CheckPara[Id] = Para;
    },

    Continue_CheckSpelling : function()
    {
        // Эта функция запускается в таймере, поэтому здесь сразу все параграфы не проверяем, чтобы не было
        // притормоза большого, а запускаем по несколько штук.

        var Counter = 0;
        for ( var Id in this.CheckPara )
        {
            var Para = this.CheckPara[Id];
            Para.Continue_CheckSpelling();
            delete this.CheckPara[Id];
            Counter++;

            if ( Counter > 200 )
                break;
        }

        for ( var Id in this.CurPara )
        {
            var Para = this.CurPara[Id];
            delete this.CurPara[Id];
            Para.SpellChecker.Reset_ElementsWithCurPos();
            Para.SpellChecker.Check();
        }
    },

    Add_CurPara : function(Id, Para)
    {
        this.CurPara[Id] = Para;
    },

    Check_CurParas : function()
    {
        for ( var Id in this.CheckPara )
        {
            var Para = this.CheckPara[Id];
            Para.Continue_CheckSpelling();
            delete this.CheckPara[Id];
        }

        for ( var Id in this.CurPara )
        {
            var Para = this.CurPara[Id];
            delete this.CurPara[Id];
            Para.SpellChecker.Reset_ElementsWithCurPos();
            Para.SpellChecker.Check(undefined, true);
        }
    }

};

//----------------------------------------------------------------------------------------------------------------------
// CParaSpellChecker
//         Проверка орфографии внутри одного параграфа. Тут хранится массив всех слов(CParaSpellCheckerElement) в
//         параграфе.
//----------------------------------------------------------------------------------------------------------------------
function CParaSpellChecker(Paragraph)
{
    this.Elements  = [];
    this.RecalcId  = -1;
    this.ParaId    = -1;
    this.Paragraph = Paragraph;
}

CParaSpellChecker.prototype =
{
    Clear : function()
    {
        var Count = this.Elements.length;

        for (var Index = 0; Index < Count; Index++)
        {
            var Element = this.Elements[Index];

            var Count2 = Element.ClassesS.length;
            for ( var Index2 = 1; Index2 < Count2; Index2++ )
            {
                Element.ClassesS[Index2].Clear_SpellingMarks();
            }

            Count2 = Element.ClassesE.length;
            for ( var Index2 = 1; Index2 < Count2; Index2++ )
            {
                Element.ClassesE[Index2].Clear_SpellingMarks();
            }
        }

        this.Elements = [];
    },

    Add : function(StartPos, EndPos, Word, Lang)
    {
        var SpellCheckerEl = new CParaSpellCheckerElement( StartPos, EndPos, Word, Lang );
        this.Paragraph.Add_SpellCheckerElement( SpellCheckerEl );
        this.Elements.push( SpellCheckerEl );
    },

    Check : function(ParagraphForceRedraw, _bForceCheckCur)
    {
        var bForceCheckCur = ( true != _bForceCheckCur ? false : true )
        var Paragraph = g_oTableId.Get_ById( this.ParaId );
        var bCurrent = ( true === bForceCheckCur ? false : Paragraph.Is_ThisElementCurrent() );

        var CurPos = -1;

        if ( true === bCurrent && false === Paragraph.Selection.Use )
            CurPos = Paragraph.Get_ParaContentPos( false, false );

        var usrWords = [];
        var usrLang  = [];

        var Count = this.Elements.length;
        for ( var Index = 0; Index < Count; Index++ )
        {
            var Element = this.Elements[Index];
            Element.CurPos = false;

            if ( 1 >= Element.Word.length )
                Element.Checked = true;
            else if ( null === Element.Checked && -1 != CurPos && Element.EndPos.Compare( CurPos ) >= 0 && Element.StartPos.Compare( CurPos ) <= 0 )
            {
                Element.Checked = true;
                Element.CurPos  = true;
                editor.WordControl.m_oLogicDocument.Spelling.Add_CurPara( this.ParaId, g_oTableId.Get_ById( this.ParaId ) );
            }

            if ( null === Element.Checked )
            {
                usrWords.push(this.Elements[Index].Word);
                usrLang.push(this.Elements[Index].Lang);
            }
        }

        if ( 0 < usrWords.length )
            spellCheck(editor, {"type": "spell", "ParagraphId": this.ParaId, "RecalcId" : this.RecalcId, "ElementId" : 0, "usrWords" : usrWords, "usrLang" : usrLang });
        else if ( undefined != ParagraphForceRedraw )
            ParagraphForceRedraw.ReDraw();
    },

    Check_CallBack : function(RecalcId, UsrCorrect)
    {
        if ( RecalcId == this.RecalcId )
        {
            var DocumentSpelling = editor.WordControl.m_oLogicDocument.Spelling;
            var Count = this.Elements.length;
            var Index2 = 0;
            for ( var Index = 0; Index < Count; Index++ )
            {
                var Element = this.Elements[Index];

                if ( null === Element.Checked && true != Element.Checked )
                {
                    // Если слово есть в локальном словаре, не проверяем его
                    if ( true === DocumentSpelling.Check_Word( Element.Word ) )
                        Element.Checked = true;
                    else
                        Element.Checked = UsrCorrect[Index2];

                    Index2++;
                }
            }

            this.Internal_UpdateParagraphState();
        }
    },

    Internal_UpdateParagraphState : function()
    {
        var DocumentSpelling = editor.WordControl.m_oLogicDocument.Spelling;

        var bMisspeled = false;
        var Count = this.Elements.length;
        for ( var Index = 0; Index < Count; Index++ )
        {
            // Если есть хоть одно неправильное слово, запоминаем этот параграф
            if ( false === this.Elements[Index].Checked )
                bMisspeled = true;
        }

        if ( true === bMisspeled )
            DocumentSpelling.Add_Paragraph( this.ParaId, g_oTableId.Get_ById( this.ParaId ) );
        else
            DocumentSpelling.Remove_Paragraph( this.ParaId );
    },

    Check_Spelling : function(Pos)
    {
        var Count = this.Elements.length;
        for ( var Index = 0; Index < Count; Index++ )
        {
            var Element = this.Elements[Index];
            if ( Element.StartPos > Pos )
                break;
            else if ( Element.EndPos < Pos )
                continue;
            else
            {
                return (Element.Checked === null ? true : Element.Checked);
            }
        }

        return true;
    },

    Get_DrawingInfo : function(Pos)
    {
        var Counter = 0;

        var Count = this.Elements.length;
        for ( var Index = 0; Index < Count; Index++ )
        {
            var Element = this.Elements[Index];
            if ( false === Element.Checked )
            {
                if ( Element.StartPos.Compare( Pos ) < 0 && Element.EndPos.Compare( Pos ) >= 0 )
                    Counter++;
            }
        }

        return Counter;
    },

    Document_UpdateInterfaceState : function(StartPos, EndPos)
    {
        // Надо определить, попадает ли какое-либо неверно набранное слово в заданный промежуток, и одно ли оно
        var Count = this.Elements.length;
        var FoundElement = null;
        var FoundIndex   = -1;
        for ( var Index = 0; Index < Count; Index++ )
        {
            var Element = this.Elements[Index];
            if ( Element.StartPos.Compare(EndPos) <= 0 && Element.EndPos.Compare(StartPos) >= 0 && false === Element.Checked )
            {
                if ( null != FoundElement )
                {
                    FoundElement = null;
                    break;
                }
                else
                {
                    FoundIndex   = Index;
                    FoundElement = Element;
                }
            }
        }

        var Word     = "";
        var Variants = null;
        var Checked  = null;

        if ( null != FoundElement )
        {
            Word     = FoundElement.Word;
            Variants = FoundElement.Variants;
            Checked  = FoundElement.Checked;

            if ( null === Variants )
            {
                spellCheck(editor, {"type": "suggest", "ParagraphId": this.ParaId, "RecalcId" : this.RecalcId, "ElementId" : FoundIndex, "usrWords" : [Word], "usrLang" : [FoundElement.Lang] });
            }
        }

        // Неопределенное слово посылаем как хорошее в интерфейс
        if ( null === Checked )
            Checked = true;

        editor.sync_SpellCheckCallback( Word, Checked, Variants, this.ParaId, FoundIndex );
    },

    Check_CallBack2: function(RecalcId, ElementId, usrVariants)
    {
        if ( RecalcId == this.RecalcId )
        {
            this.Elements[ElementId].Variants = usrVariants[0];
        }
    },

    Ignore : function(Word)
    {
        var Count = this.Elements.length;
        for ( var Index = 0; Index < Count; Index++ )
        {
            var Element = this.Elements[Index];
            if ( false === Element.Checked && Word === Element.Word )
                Element.Checked = true;
        }

        this.Internal_UpdateParagraphState();
    },

    Update_OnAdd : function(Paragraph, Pos, Item)
    {
        var RecalcInfo = ( undefined !== Paragraph.Paragraph ? Paragraph.Paragraph.RecalcInfo : Paragraph.RecalcInfo );
        RecalcInfo.Set_Type_0_Spell( pararecalc_0_Spell_All );
    },

    Update_OnRemove : function(Paragraph, Pos, Count)
    {
        var RecalcInfo = ( undefined !== Paragraph.Paragraph ? Paragraph.Paragraph.RecalcInfo : Paragraph.RecalcInfo );
        RecalcInfo.Set_Type_0_Spell( pararecalc_0_Spell_All );
    },

    Get_ElementsBeforeAfterPos : function(StartPos,EndPos)
    {
        var Before = [];
        var After  = [];

        var Count = this.Elements.length;
        for ( var Index = 0; Index < Count; Index++ )
        {
            var Element = this.Elements[Index];
            if ( Element.EndPos < StartPos )
                Before.push( Element );
            else if ( Element.StartPos >= EndPos )
                After.push( Element );
        }
        return { Before : Before, After : After };
    },

    Reset_ElementsWithCurPos : function()
    {
        var Count = this.Elements.length;
        for ( var Index = 0; Index < Count; Index++ )
        {
            var Element = this.Elements[Index];
            if ( true === Element.CurPos )
                Element.Checked = null;
        }
    },

    Compare_WithPrevious : function(OldElements)
    {
        var OldElementsCount = OldElements.length;
        var ElementsCount = this.Elements.length;

        for ( var Index = 0; Index < ElementsCount; Index++ )
        {
            var Element = this.Elements[Index];

            var Word = Element.Word;
            var Lang = Element.Lang;

            for ( var Index2 = 0; Index2 < OldElementsCount; Index2++ )
            {
                var OldElement = OldElements[Index2];

                if ( Word === OldElement.Word && Lang === OldElement.Lang && true !== OldElement.CurPos )
                {
                    Element.Checked  = OldElement.Checked;
                    Element.Variants = OldElement.Variants;

                    break;
                }
            }
        }

        // Далее мы проверяем нужно ли перерисовывать параграф. Его нужно перерисовать если у нас какой-то слово было
        // подчеркнуто как неправильное, а в новом массиве либо его нет, либо оно отмечено как правильное или
        // неопределенное. Тогда, чтобы избавиться от подчеркивания мы перерисовываем параграф.
        for ( var Index = 0; Index < OldElementsCount; Index++ )
        {
            var OldElement = OldElements[Index];
            var Word = OldElement.Word;

            if ( false === OldElement.Checked )
            {
                var bFound = false;
                for ( var Index2 = 0; Index2 < ElementsCount; Index2++ )
                {
                    var Element = this.Elements[Index2];

                    if ( Word === Element.Word )
                    {
                        bFound = true;

                        if ( false !== Element.Checked )
                            return true;

                        break;
                    }
                }

                if ( false === bFound )
                    return true;
            }
        }

        return false;
    }
};

//----------------------------------------------------------------------------------------------------------------------
// CParaSpellCheckerElement
//----------------------------------------------------------------------------------------------------------------------
function CParaSpellCheckerElement(StartPos, EndPos, Word, Lang)
{
    this.StartPos = StartPos;
    this.EndPos   = EndPos;
    this.Word     = Word;
    this.Lang     = Lang;
    this.Checked  = null; // null - неизвестно, true - правильное слово, false - неправильное слово
    this.CurPos   = false;
    this.Variants = null;

    this.ClassesS = [];
    this.ClassesE = [];
}

//----------------------------------------------------------------------------------------------------------------------
// SpellCheck_CallBack
//          Функция ответа от сервера.
//----------------------------------------------------------------------------------------------------------------------
function SpellCheck_CallBack(Obj)
{
    if ( undefined != Obj && undefined != Obj["ParagraphId"] )
    {
        var ParaId = Obj["ParagraphId"];
        var Paragraph = g_oTableId.Get_ById( ParaId );
        var Type   = Obj["type"];
        if ( null != Paragraph )
        {
            if ( "spell" === Type )
            {
                Paragraph.SpellChecker.Check_CallBack( Obj["RecalcId"], Obj["usrCorrect"] );
                Paragraph.ReDraw();
            }
            else if ( "suggest" === Type )
            {
                Paragraph.SpellChecker.Check_CallBack2( Obj["RecalcId"], Obj["ElementId"], Obj["usrSuggest"] );
                editor.sync_SpellCheckVariantsFound();
            }
        }
    }
};

//----------------------------------------------------------------------------------------------------------------------
// CDocument
//----------------------------------------------------------------------------------------------------------------------
CDocument.prototype.Set_DefaultLanguage = function(Lang)
{
    // Устанавливаем словарь по умолчанию
    var Styles = this.Styles;
    Styles.Default.TextPr.Lang.Val = Lang;

    // Нужно заново запустить проверку орфографии
    this.Restart_CheckSpelling();
    
    this.Document_UpdateInterfaceState();
};

CDocument.prototype.Get_DefaultLanguage = function()
{
    var Styles = this.Styles;
    return Styles.Default.TextPr.Lang.Val;
};

CDocument.prototype.Restart_CheckSpelling = function()
{
    // TODO: добавить обработку в автофигурах
    this.SectionsInfo.Restart_CheckSpelling();

    var Count = this.Content.length;
    for ( var Index = 0; Index < Count; Index++ )
    {
        this.Content[Index].Restart_CheckSpelling();
    }
};

CDocument.prototype.Continue_CheckSpelling = function()
{
    this.Spelling.Continue_CheckSpelling();
};

//----------------------------------------------------------------------------------------------------------------------
// CDocumentContent
//----------------------------------------------------------------------------------------------------------------------
CDocumentContent.prototype.Restart_CheckSpelling = function()
{
    var Count = this.Content.length;
    for ( var Index = 0; Index < Count; Index++ )
    {
        this.Content[Index].Restart_CheckSpelling();
    }
};

//----------------------------------------------------------------------------------------------------------------------
// CHeaderFooter
//----------------------------------------------------------------------------------------------------------------------
CHeaderFooter.prototype.Restart_CheckSpelling = function()
{
    this.Content.Restart_CheckSpelling();
};

//----------------------------------------------------------------------------------------------------------------------
// CDocumentSectionsInfo
//----------------------------------------------------------------------------------------------------------------------
CDocumentSectionsInfo.prototype.Restart_CheckSpelling = function()
{
    var bEvenOdd = EvenAndOddHeaders;
    var Count = this.Elements.length;
    for ( var Index = 0; Index < Count; Index++ )
    {
        var SectPr = this.Elements[Index].SectPr;
        var bFirst = SectPr.Get_TitlePage();

        if ( null != SectPr.HeaderFirst && true === bFirst )
            SectPr.HeaderFirst.Restart_CheckSpelling();

        if ( null != SectPr.HeaderEven && true === bEvenOdd )
            SectPr.HeaderEven.Restart_CheckSpelling();

        if ( null != SectPr.HeaderDefault )
            SectPr.HeaderDefault.Restart_CheckSpelling();

        if ( null != SectPr.FooterFirst && true === bFirst )
            SectPr.FooterFirst.Restart_CheckSpelling();

        if ( null != SectPr.FooterEven && true === bEvenOdd )
            SectPr.FooterEven.Restart_CheckSpelling();

        if ( null != SectPr.FooterDefault )
            SectPr.FooterDefault.Restart_CheckSpelling();
    }
};

//----------------------------------------------------------------------------------------------------------------------
// CTable
//----------------------------------------------------------------------------------------------------------------------
CTable.prototype.Restart_CheckSpelling = function()
{
    var RowsCount = this.Content.length;
    for ( var CurRow = 0; CurRow < RowsCount; CurRow++ )
    {
        var Row = this.Content[CurRow];
        var CellsCount = Row.Get_CellsCount();

        for ( var CurCell = 0; CurCell < CellsCount; CurCell++ )
        {
            Row.Get_Cell( CurCell ).Content.Restart_CheckSpelling();
        }
    }
};

//----------------------------------------------------------------------------------------------------------------------
// Paragraph
//----------------------------------------------------------------------------------------------------------------------
Paragraph.prototype.Restart_CheckSpelling = function()
{
    this.RecalcInfo.Set_Type_0_Spell( pararecalc_0_Spell_All );
    
    // Пересчитываем скомпилированный стиль для самого параграфа и для всех ранов в данном параграфе
    this.Recalc_CompiledPr();
    this.Recalc_RunsCompiledPr();

    this.LogicDocument.Spelling.Add_ParagraphToCheck(this.Get_Id(), this);
};

Paragraph.prototype.Internal_CheckPunctuationBreak = function(_Pos)
{
    // В позиции Pos у нас стоит знак пунктуации, проверяем, идет ли за ним сразу текст

    var Count = this.Content.length;
    for ( var Pos = _Pos + 1; Pos < Count; Pos++ )
    {
        var Item = this.Content[Pos];

        if ( para_Text === Item.Type &&  false === Item.Is_Punctuation() && false === Item.Is_NBSP() && false === Item.Is_Number() && false === Item.Is_SpecialSymbol() )
        {
            return true;
        }
        else if ( para_CollaborativeChangesEnd === Item.Type || para_CollaborativeChangesStart === Item.Type )
            continue;
        else
        {
            return false;
        }
    }

};

Paragraph.prototype.Internal_CheckSpelling = function()
{
    if ( pararecalc_0_Spell_None !== this.RecalcInfo.Recalc_0_Spell.Type )
    {
        if ( null != g_oTableId.Get_ById( this.Get_Id() ) )
            this.LogicDocument && this.LogicDocument.Spelling.Add_ParagraphToCheck(this.Get_Id(), this);
    }
};

Paragraph.prototype.Continue_CheckSpelling = function()
{
    var ParaForceRedraw = undefined;
    var CheckLang = false;
    if ( pararecalc_0_Spell_None === this.RecalcInfo.Recalc_0_Spell.Type )
        return;
    else
    {
        var OldElements = this.SpellChecker.Elements;

        this.SpellChecker.Elements = [];
        var SpellCheckerEngine = new CParagraphSpellCheckerEngine( this.SpellChecker );

        var ContentLen = this.Content.length;
        for ( var Pos = 0; Pos < ContentLen; Pos++ )
        {
            var Item = this.Content[Pos];

            SpellCheckerEngine.ContentPos.Update( Pos, 0 );
            Item.Check_Spelling( SpellCheckerEngine, 1 );
        }

        //if ( true === this.SpellChecker.Compare_WithPrevious( OldElements ) )
        //    ParaForceRedraw = this;

        // TODO: Мы не можем здесь проверить надо ли перерисовывать параграф или нет, потому что возможно у нас в
        //       параграф вставили/удалили элемент, который не повлиял на орфографию, т.е. фактически ни 1 слова не
        //       изменилось, но при этом изменились метки начала и конца подчеркивания орфографии. Если можно это 
        //       отследить, тогда можно будет вернуться к предыдущему варианту.
        this.SpellChecker.Compare_WithPrevious( OldElements );
        ParaForceRedraw = this;

        // Не надо проверять отдельно языки
        CheckLang = false;
    }

    var PrevPara = this.Get_DocumentPrev();
    if ( null != PrevPara && type_Paragraph === PrevPara.GetType() && undefined != PrevPara.Get_FramePr() && undefined != PrevPara.Get_FramePr().DropCap )
    {
        if ( this.SpellChecker.Elements.length > 0 )
        {
            var bDontCheckFirstWord = true;
            var Element = this.SpellChecker.Elements[0];
            var StartPos = Element.StartPos;
            for ( var TempPos = 0; TempPos < StartPos; TempPos++  )
            {
                var Item = this.Content[TempPos];
                if ( para_Space === Item.Type )
                {
                    bDontCheckFirstWord = false;
                    break;
                }
            }

            if ( true === bDontCheckFirstWord && true != Element.Checked )
            {
                Element.Checked = true;
                ParaForceRedraw = this;
            }
        }
    }

    if ( true === CheckLang )
    {
        // Пройдемся по всем словам и проверим словарь, в котором должно проверяться слово (если словарь поменялся,
        // тогда слово отправляет на проверку)
        var WordsCount = this.SpellChecker.Elements.length;
        for ( var ElemId = 0; ElemId < WordsCount; ElemId++ )
        {
            var Element = this.SpellChecker.Elements[ElemId];
            var CurLang = Element.Lang;
            var Lang = this.Internal_GetLang( Element.EndPos );
            if ( CurLang != Lang.Val )
            {
                Element.Lang     = Lang.Val;
                Element.Checked  = null;
                Element.Variants = null;
            }
        }
    }

    // Если у нас осталось одно слово в параграфе, состоящее из одной буквы, тогда надо перерисовать данный параграф,
    // чтобы избавиться от подчеркивания.
    if ( 1 === this.SpellChecker.Elements.length && 1 === this.SpellChecker.Elements[0].Word.length )
        ParaForceRedraw = this;

    this.SpellChecker.RecalcId = this.LogicDocument.RecalcId;
    this.SpellChecker.ParaId   = this.Get_Id();
    this.SpellChecker.Check(ParaForceRedraw );

    this.RecalcInfo.Recalc_0_Spell.Type = pararecalc_0_Spell_None;
};

Paragraph.prototype.Add_SpellCheckerElement = function(Element)
{
    Element.ClassesS.push( this );
    Element.ClassesE.push( this );

    var StartPos = Element.StartPos.Get(0);
    var EndPos   = Element.EndPos.Get(0);

    this.Content[StartPos].Add_SpellCheckerElement( Element, true, 1 );
    this.Content[EndPos].Add_SpellCheckerElement( Element, false, 1 );
};
//----------------------------------------------------------------------------------------------------------------------
// ParaRun
//----------------------------------------------------------------------------------------------------------------------
ParaRun.prototype.Check_Spelling = function(SpellCheckerEngine, Depth)
{
    this.SpellingMarks = [];

    // Пропускаем пустые раны
    if ( true === this.Is_Empty() )
        return;

    var bWord        = SpellCheckerEngine.bWord;
    var sWord        = SpellCheckerEngine.sWord;
    var CurLcid      = SpellCheckerEngine.CurLcid;
    var SpellChecker = SpellCheckerEngine.SpellChecker;
    var ContentPos   = SpellCheckerEngine.ContentPos;

    var CurTextPr = this.Get_CompiledPr( false );

    if ( true === bWord && CurLcid !== CurTextPr.Lang.Val )
    {
        bWord = false;
        SpellChecker.Add( SpellCheckerEngine.StartPos, SpellCheckerEngine.EndPos, sWord, CurLcid );
    }

    CurLcid = CurTextPr.Lang.Val;

    var ContentLen = this.Content.length;
    for ( var Pos = 0; Pos < ContentLen; Pos++ )
    {
        var Item = this.Content[Pos];

        //if ( para_Text === Item.Type && ( false === Item.Is_Punctuation() || ( true === bWord && true === this.Internal_CheckPunctuationBreak( Pos ) ) ) && false === Item.Is_NBSP() && false === Item.Is_Number() && false === Item.Is_SpecialSymbol() )
        if ( para_Text === Item.Type && false === Item.Is_Punctuation() && false === Item.Is_NBSP() && false === Item.Is_Number() && false === Item.Is_SpecialSymbol() )
        {
            if ( false === bWord )
            {
                var StartPos = ContentPos.Copy();
                var EndPos   = ContentPos.Copy();

                StartPos.Update( Pos, Depth );
                EndPos.Update( Pos + 1, Depth );

                bWord = true;

                if ( true != CurTextPr.Caps )
                    sWord = Item.Value;
                else
                    sWord = Item.Value.toUpperCase();

                SpellCheckerEngine.StartPos = StartPos;
                SpellCheckerEngine.EndPos   = EndPos;
            }
            else
            {
                if ( true != CurTextPr.Caps )
                    sWord += Item.Value;
                else
                    sWord += Item.Value.toUpperCase();

                var EndPos = ContentPos.Copy();
                EndPos.Update( Pos + 1, Depth );

                SpellCheckerEngine.EndPos = EndPos;
            }
        }
        else
        {
            if ( true === bWord )
            {
                bWord = false;
                SpellChecker.Add( SpellCheckerEngine.StartPos, SpellCheckerEngine.EndPos, sWord, CurLcid );
            }
        }
    }

    SpellCheckerEngine.bWord   = bWord;
    SpellCheckerEngine.sWord   = sWord;
    SpellCheckerEngine.CurLcid = CurLcid;
};

ParaRun.prototype.Add_SpellCheckerElement = function(Element, Start, Depth)
{
    if ( true === Start )
        Element.ClassesS.push(this);
    else
        Element.ClassesE.push(this);

    this.SpellingMarks.push( new CParagraphSpellingMark( Element, Start, Depth ) );
};

ParaRun.prototype.Clear_SpellingMarks = function()
{
    this.SpellingMarks = [];
};
//----------------------------------------------------------------------------------------------------------------------
// ParaHyperlink
//----------------------------------------------------------------------------------------------------------------------
ParaHyperlink.prototype.Check_Spelling = function(SpellCheckerEngine, Depth)
{
    this.SpellingMarks = [];

    var ContentLen = this.Content.length;
    for ( var Pos = 0; Pos < ContentLen; Pos++ )
    {
        var Item = this.Content[Pos];

        SpellCheckerEngine.ContentPos.Update( Pos, Depth );
        Item.Check_Spelling( SpellCheckerEngine, Depth + 1 );
    }
};

ParaHyperlink.prototype.Add_SpellCheckerElement = function(Element, Start, Depth)
{
    if ( true === Start )
    {
        Element.ClassesS.push(this);
        this.Content[Element.StartPos.Get(Depth)].Add_SpellCheckerElement(Element, Start, Depth + 1);
    }
    else
    {
        Element.ClassesE.push(this);
        this.Content[Element.EndPos.Get(Depth)].Add_SpellCheckerElement(Element, Start, Depth + 1);
    }

    this.SpellingMarks.push( new CParagraphSpellingMark( Element, Start, Depth ) );
};

ParaHyperlink.prototype.Clear_SpellingMarks = function()
{
    this.SpellingMarks = [];
};

//----------------------------------------------------------------------------------------------------------------------
// ParaComment
//----------------------------------------------------------------------------------------------------------------------
ParaComment.prototype.Check_Spelling = function(SpellCheckerEngine, Depth)
{
};

ParaComment.prototype.Add_SpellCheckerElement = function(Element, Start, Depth)
{
};

ParaComment.prototype.Clear_SpellingMarks = function()
{
};
//----------------------------------------------------------------------------------------------------------------------
// ParaMath
//----------------------------------------------------------------------------------------------------------------------
ParaMath.prototype.Check_Spelling = function(SpellCheckerEngine, Depth)
{
    if ( true === SpellCheckerEngine.bWord )
    {
        SpellCheckerEngine.bWord = false;
        SpellCheckerEngine.SpellChecker.Add( SpellCheckerEngine.StartPos, SpellCheckerEngine.EndPos, SpellCheckerEngine.sWord, SpellCheckerEngine.CurLcid );
    }
};

ParaMath.prototype.Add_SpellCheckerElement = function(Element, Start, Depth)
{
};

ParaMath.prototype.Clear_SpellingMarks = function()
{
};



function CParagraphSpellCheckerEngine(SpellChecker)
{
    this.ContentPos   = new CParagraphContentPos();
    this.SpellChecker = SpellChecker;

    this.CurLcid    = -1;
    this.bWord      = false;
    this.sWord      = "";
    this.StartPos   = null; // CParagraphContentPos
    this.EndPos     = null; // CParagraphContentPos
}

function CParagraphSpellingMark(SpellCheckerElement, Start, Depth)
{
    this.Element = SpellCheckerElement;
    this.Start   = Start;
    this.Depth   = Depth;
}