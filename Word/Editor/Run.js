"use strict";
/**
 * User: Ilja.Kirillov
 * Date: 03.12.13
 * Time: 18:28
 */

var reviewtype_Common = 0x00;
var reviewtype_Remove = 0x01;
var reviewtype_Add    = 0x02;

/**
 *
 * @param Paragraph
 * @param bMathRun
 * @constructor
 * @extends {CParagraphContentWithContentBase}
 */
function ParaRun(Paragraph, bMathRun)
{
    ParaRun.superclass.constructor.call(this);
    
    this.Id         = g_oIdCounter.Get_NewId();  // Id данного элемента
    this.Type       = para_Run;                  // тип данного элемента
    this.Paragraph  = Paragraph;                 // Ссылка на параграф
    this.Pr         = new CTextPr();             // Текстовые настройки данного run
    this.Content    = [];                        // Содержимое данного run
        
    this.State      = new CParaRunState();       // Положение курсора и селекта в данного run
    this.Selection  = this.State.Selection;
    this.CompiledPr = new CTextPr();             // Скомпилированные настройки
    this.RecalcInfo = new CParaRunRecalcInfo();  // Флаги для пересчета (там же флаг пересчета стиля)

    this.TextAscent  = 0; // текстовый ascent + linegap
    this.TextAscent  = 0; // текстовый ascent + linegap
    this.TextDescent = 0; // текстовый descent
    this.TextHeight  = 0; // высота текста
    this.TextAscent2 = 0; // текстовый ascent
    this.Ascent      = 0; // общий ascent
    this.Descent     = 0; // общий descent
    this.YOffset     = 0; // смещение по Y

    this.CollPrChangeMine   = false;
    this.CollPrChangeOther  = false;
    this.CollaborativeMarks = new CRunCollaborativeMarks();
    this.m_oContentChanges  = new CContentChanges(); // список изменений(добавление/удаление элементов)

    this.NearPosArray  = [];
    this.SearchMarks   = [];
    this.SpellingMarks = [];

    this.ReviewType    = reviewtype_Common;
    this.ReviewInfo    = new CReviewInfo();
    if (editor && !editor.isPresentationEditor && editor.WordControl && editor.WordControl.m_oLogicDocument && true === editor.WordControl.m_oLogicDocument.Is_TrackRevisions())
    {
        this.ReviewType = reviewtype_Add;
        this.ReviewInfo.Update();
    }

    if(bMathRun)
    {
        this.Type = para_Math_Run;

        // запомним позицию для Recalculate_CurPos, когда  Run пустой
        this.pos          = new CMathPosition();
        this.ParaMath     = null;
        this.Parent       = null;
        this.ArgSize      = 0;
        this.size         = new CMathSize();
        this.MathPrp      = new CMPrp();
        this.bEqArray     = false;
    }
    this.StartState = null;

    // Добавляем данный класс в таблицу Id (обязательно в конце конструктора)
    g_oTableId.Add( this, this.Id );
    if(this.Paragraph && !this.Paragraph.bFromDocument)
    {
        this.Save_StartState();
    }
}

Asc.extendClass(ParaRun, CParagraphContentWithContentBase);

ParaRun.prototype.Get_Type = function()
{
    return this.Type;
};
//-----------------------------------------------------------------------------------
// Функции для работы с Id
//-----------------------------------------------------------------------------------
ParaRun.prototype.Set_Id = function(newId)
{
    g_oTableId.Reset_Id( this, newId, this.Id );
    this.Id = newId;
};

ParaRun.prototype.Get_Id = function()
{
    return this.Id;
};

ParaRun.prototype.Get_Paragraph = function()
{
    return this.Paragraph;
};

ParaRun.prototype.Set_Paragraph = function(Paragraph)
{
    this.Paragraph = Paragraph;
};

ParaRun.prototype.Set_ParaMath = function(ParaMath, Parent)
{
    this.ParaMath = ParaMath;
    this.Parent   = Parent;

    for(var i = 0; i < this.Content.length; i++)
    {
        this.Content[i].relate(this);
    }
};
ParaRun.prototype.Save_StartState = function()
{
    this.StartState = new CParaRunStartState(this);
};
//-----------------------------------------------------------------------------------
// Функции для работы с содержимым данного рана
//-----------------------------------------------------------------------------------
ParaRun.prototype.Copy = function(Selected)
{
    var bMath = this.Type == para_Math_Run ? true : false;

    var NewRun = new ParaRun(this.Paragraph, bMath);

    NewRun.Set_Pr( this.Pr.Copy() );

    if (this.Paragraph && this.Paragraph.LogicDocument && true === this.Paragraph.LogicDocument.Is_TrackRevisions())
        NewRun.Set_ReviewType(reviewtype_Add);

    if(true === bMath)
        NewRun.MathPrp = this.MathPrp.Copy();

    var StartPos = 0;
    var EndPos   = this.Content.length;

    if (true === Selected && true === this.State.Selection.Use)
    {
        StartPos = this.State.Selection.StartPos;
        EndPos   = this.State.Selection.EndPos;

        if (StartPos > EndPos)
        {
            StartPos = this.State.Selection.EndPos;
            EndPos   = this.State.Selection.StartPos;
        }
    }
    else if (true === Selected && true !== this.State.Selection.Use)
        EndPos = -1;

    for ( var CurPos = StartPos; CurPos < EndPos; CurPos++ )
    {
        var Item = this.Content[CurPos];

        // TODO: Как только перенесем para_End в сам параграф (как и нумерацию) убрать здесь
        if ( para_End !== Item.Type )
            NewRun.Add_ToContent( CurPos - StartPos, Item.Copy(), false );
    }

    return NewRun;
};

ParaRun.prototype.Copy2 = function()
{
    var NewRun = new ParaRun(this.Paragraph);

    NewRun.Set_Pr( this.Pr.Copy() );

    var StartPos = 0;
    var EndPos   = this.Content.length;

    for ( var CurPos = StartPos; CurPos < EndPos; CurPos++ )
    {
        var Item = this.Content[CurPos];
        NewRun.Add_ToContent( CurPos - StartPos, Item.Copy(), false );
    }
    return NewRun;
};

ParaRun.prototype.CopyContent = function(Selected)
{
    return [this.Copy(Selected)];
};

ParaRun.prototype.Get_AllDrawingObjects = function(DrawingObjs)
{
    var Count = this.Content.length;
    for ( var Index = 0; Index < Count; Index++ )
    {
        var Item = this.Content[Index];

        if ( para_Drawing === Item.Type )
            DrawingObjs.push(Item);
    }
};

ParaRun.prototype.Clear_ContentChanges = function()
{
    this.m_oContentChanges.Clear();
};

ParaRun.prototype.Add_ContentChanges = function(Changes)
{
    this.m_oContentChanges.Add( Changes );
};

ParaRun.prototype.Refresh_ContentChanges = function()
{
    this.m_oContentChanges.Refresh();
};

ParaRun.prototype.Get_Text = function(Text)
{
    if ( null === Text.Text )
        return;

    var ContentLen = this.Content.length;

    for ( var CurPos = 0; CurPos < ContentLen; CurPos++ )
    {
        var Item = this.Content[CurPos];
        var ItemType = Item.Type;

        var bBreak = false;

        switch ( ItemType )
        {
            case para_Drawing:
            case para_End:
            case para_PageNum:
            {
                Text.Text = null;
                bBreak = true;
                break;
            }

            case para_Text : Text.Text += String.fromCharCode(Item.Value); break;
            case para_Space:
            case para_Tab  : Text.Text += " "; break;
        }

        if ( true === bBreak )
            break;
    }
};

// Проверяем пустой ли ран
ParaRun.prototype.Is_Empty = function(Props)
{
    var SkipAnchor = (undefined !== Props ? Props.SkipAnchor : false);
    var SkipEnd    = (undefined !== Props ? Props.SkipEnd    : false);
    var SkipPlcHldr= (undefined !== Props ? Props.SkipPlcHldr: false);
    var SkipNewLine= (undefined !== Props ? Props.SkipNewLine: false);

    var Count = this.Content.length;

    if (true !== SkipAnchor && true !== SkipEnd && true !== SkipPlcHldr && true !== SkipNewLine)
    {
        if ( Count > 0 )
            return false;
        else
            return true;
    }
    else
    {
        for ( var CurPos = 0; CurPos < this.Content.length; CurPos++ )
        {
            var Item = this.Content[CurPos];
            var ItemType = Item.Type;

            if ((true !== SkipAnchor || para_Drawing !== ItemType || false !== Item.Is_Inline()) && (true !== SkipEnd || para_End !== ItemType) && (true !== SkipPlcHldr || true !== Item.IsPlaceholder()) && (true !== SkipNewLine || para_NewLine !== ItemType))
                return false;
        }

        return true;
    }
};

ParaRun.prototype.Is_CheckingNearestPos = function()
{
    if (this.NearPosArray.length > 0)
        return true;

    return false;
};

// Начинается ли данный ран с новой строки
ParaRun.prototype.Is_StartFromNewLine = function()
{
    if (this.protected_GetLinesCount() < 2 || 0 !== this.protected_GetRangeStartPos(1, 0))
        return false;

    return true;
};

// Добавляем элемент в текущую позицию
ParaRun.prototype.Add = function(Item, bMath)
{
    if (this.Paragraph && this.Paragraph.LogicDocument && true === this.Paragraph.LogicDocument.CheckLanguageOnTextAdd && editor)
    {
        var nRequiredLanguage = editor.asc_getKeyboardLanguage();
        var nCurrentLanguage  = this.Get_CompiledPr(false).Lang.Val;
        if (-1 !== nRequiredLanguage && nRequiredLanguage !== nCurrentLanguage)
        {
            var NewLang = new CLang();
            NewLang.Val = nRequiredLanguage;

            if (this.Is_Empty())
                this.Set_Lang(NewLang);
            else
            {
                var Parent  = this.Get_Parent();
                var RunPos = this.private_GetPosInParent();
                if (null !== Parent && -1 !== RunPos)
                {
                    // Если мы стоим в начале рана, тогда добавим новый ран в начало, если мы стоим в конце рана, тогда
                    // добавим новый ран после текущего, а если мы в середине рана, тогда надо разбивать текущий ран.

                    var NewRun = new ParaRun(this.Paragraph, bMath);
                    NewRun.Set_Pr(this.Pr.Copy());
                    NewRun.Set_Lang(NewLang);
                    NewRun.Cursor_MoveToStartPos();
                    NewRun.Add(Item, bMath);

                    var CurPos = this.State.ContentPos;
                    if (0 === CurPos)
                        Parent.Add_ToContent(RunPos, NewRun);
                    else if (this.Content.length === CurPos)
                        Parent.Add_ToContent(RunPos + 1, NewRun);
                    else
                    {
                        // Нужно разделить данный ран в текущей позиции
                        var RightRun = this.Split2(CurPos);
                        Parent.Add_ToContent(RunPos + 1, NewRun);
                        Parent.Add_ToContent(RunPos + 2, RightRun);
                    }

                    NewRun.Make_ThisElementCurrent();
                    return;
                }
            }
        }
    }

    var TrackRevisions = false;
    if (this.Paragraph && this.Paragraph.LogicDocument)
        TrackRevisions = this.Paragraph.LogicDocument.Is_TrackRevisions();

    var ReviewType = this.Get_ReviewType();
    if ((true === TrackRevisions && (reviewtype_Add !== ReviewType || true !== this.ReviewInfo.Is_CurrentUser())) || (false === TrackRevisions && reviewtype_Common !== ReviewType))
    {
        var DstReviewType = true === TrackRevisions ? reviewtype_Add : reviewtype_Common;

        // Если мы стоим в конце рана, тогда проверяем следующий элемент родительского класса, аналогично если мы стоим
        // в начале рана, проверяем предыдущий элемент родительского класса.

        var Parent = this.Get_Parent();
        if (null === Parent)
            return;

        // Ищем данный элемент в родительском классе
        var RunPos = this.private_GetPosInParent(Parent);

        if (-1 === RunPos)
            return;

        var CurPos = this.State.ContentPos;
        if (0 === CurPos && RunPos > 0)
        {
            var PrevElement = Parent.Content[RunPos - 1];
            if (para_Run === PrevElement.Type && DstReviewType === PrevElement.Get_ReviewType() && true === this.Pr.Is_Equal(PrevElement.Pr) && PrevElement.ReviewInfo && true === PrevElement.ReviewInfo.Is_CurrentUser())
            {
                PrevElement.State.ContentPos = PrevElement.Content.length;
                PrevElement.Add_ToContent(PrevElement.Content.length, Item, true);
                PrevElement.Make_ThisElementCurrent();
                return;
            }
        }

        if (this.Content.length === CurPos && (RunPos < Parent.Content.length - 2 || (RunPos < Parent.Content.length - 1 && !(Parent instanceof Paragraph))))
        {
            var NextElement = Parent.Content[RunPos + 1];
            if (para_Run === NextElement.Type && DstReviewType === NextElement.Get_ReviewType() && true === this.Pr.Is_Equal(NextElement.Pr) && NextElement.ReviewInfo && true === NextElement.ReviewInfo.Is_CurrentUser())
            {
                NextElement.State.ContentPos = 0;
                NextElement.Add_ToContent(0, Item, true);
                NextElement.Make_ThisElementCurrent();
                return;
            }
        }

        // Если мы дошли до сюда, значит нам надо создать новый ран
        var NewRun = new ParaRun(this.Paragraph, bMath);
        NewRun.Set_Pr(this.Pr.Copy());
        NewRun.Set_ReviewType(DstReviewType);
        NewRun.Add_ToContent(0, Item, true);

        if (0 === CurPos)
            Parent.Add_ToContent(RunPos, NewRun);
        else if (this.Content.length === CurPos)
            Parent.Add_ToContent(RunPos + 1, NewRun);
        else
        {
            var OldReviewInfo = (this.ReviewInfo ? this.ReviewInfo.Copy() : undefined);
            var OldReviewType = this.ReviewType;

            // Нужно разделить данный ран в текущей позиции
            var RightRun = this.Split2(CurPos);
            Parent.Add_ToContent(RunPos + 1, NewRun);
            Parent.Add_ToContent(RunPos + 2, RightRun);

            this.Set_ReviewTypeWithInfo(OldReviewType, OldReviewInfo);
            RightRun.Set_ReviewTypeWithInfo(OldReviewType, OldReviewInfo);
        }

        NewRun.Make_ThisElementCurrent();
    }
    else if(this.Type == para_Math_Run && this.State.ContentPos == 0 && true === this.Is_StartForcedBreakOperator()) // если в начале текущего Run идет принудительный перенос => создаем новый Run
    {
        var NewRun = new ParaRun(this.Paragraph, bMath);
        NewRun.Set_Pr(this.Pr.Copy());
        NewRun.Add_ToContent(0, Item, true);

        // Ищем данный элемент в родительском классе
        var RunPos = this.private_GetPosInParent(this.Parent);

        this.Parent.Internal_Content_Add(RunPos, NewRun, true);
    }
    else
        this.Add_ToContent(this.State.ContentPos, Item, true);
};

ParaRun.prototype.Remove = function(Direction, bOnAddText)
{
    var TrackRevisions = null;
    if (this.Paragraph && this.Paragraph.LogicDocument)
        TrackRevisions = this.Paragraph.LogicDocument.Is_TrackRevisions();

    var Selection = this.State.Selection;

    var ReviewType = this.Get_ReviewType();
    if (true === TrackRevisions && reviewtype_Add !== ReviewType)
    {
        if (reviewtype_Remove === ReviewType)
        {
            // Тут мы ничего не делаем, просто перешагиваем через удаленный текст
            if (true !== Selection.Use)
            {
                var CurPos = this.State.ContentPos;

                // Просто перешагиваем через элемент
                if (Direction < 0)
                {
                    // Пропускаем все Flow-объекты
                    while (CurPos > 0 && para_Drawing === this.Content[CurPos - 1].Type && false === this.Content[CurPos - 1].Is_Inline())
                        CurPos--;

                    if (CurPos <= 0)
                        return false;

                    this.State.ContentPos--;
                }
                else
                {
                    if (CurPos >= this.Content.length || para_End === this.Content[CurPos].Type)
                        return false;

                    this.State.ContentPos++;
                }

                this.Make_ThisElementCurrent();
            }
            else
            {
                // Ничего не делаем
            }
        }
        else
        {
            if (true === Selection.Use)
            {
                // Мы должны данный ран разбить в начальной и конечной точках выделения и центральный ран пометить как
                // удаленный.

                var StartPos = Selection.StartPos;
                var EndPos   = Selection.EndPos;

                if (StartPos > EndPos)
                {
                    StartPos = Selection.EndPos;
                    EndPos   = Selection.StartPos;
                }

                var Parent = this.Get_Parent();
                var RunPos = this.private_GetPosInParent(Parent);

                if (-1 !== RunPos)
                {
                    var DeletedRun = null;
                    if (StartPos <= 0 && EndPos >= this.Content.length)
                        DeletedRun = this;
                    else if (StartPos <= 0)
                    {
                        this.Split2(EndPos, Parent, RunPos);
                        DeletedRun = this;
                    }
                    else if (EndPos >= this.Content.length)
                    {
                        DeletedRun = this.Split2(StartPos, Parent, RunPos);
                    }
                    else
                    {
                        this.Split2(EndPos, Parent, RunPos);
                        DeletedRun = this.Split2(StartPos, Parent, RunPos);
                    }

                    DeletedRun.Set_ReviewType(reviewtype_Remove);
                }
            }
            else
            {
                var Parent = this.Get_Parent();
                var RunPos = this.private_GetPosInParent(Parent);

                var CurPos = this.State.ContentPos;
                if (Direction < 0)
                {
                    // Пропускаем все Flow-объекты
                    while (CurPos > 0 && para_Drawing === this.Content[CurPos - 1].Type && false === this.Content[CurPos - 1].Is_Inline())
                        CurPos--;

                    if (CurPos <= 0)
                        return false;

                    // Проверяем, возможно предыдущий элемент - инлайн картинка, тогда мы его не удаляем, а выделяем как картинку
                    if (para_Drawing == this.Content[CurPos - 1].Type && true === this.Content[CurPos - 1].Is_Inline())
                    {
                        return this.Paragraph.Parent.Select_DrawingObject(this.Content[CurPos - 1].Get_Id());
                    }

                    if (1 === CurPos && 1 === this.Content.length)
                    {
                        this.Set_ReviewType(reviewtype_Remove);
                        this.State.ContentPos = CurPos - 1;
                        this.Make_ThisElementCurrent();
                        return true;
                    }
                    else if (1 === CurPos && Parent && RunPos > 0)
                    {
                        var PrevElement = Parent.Content[RunPos - 1];
                        if (para_Run === PrevElement.Type && reviewtype_Remove === PrevElement.Get_ReviewType() && true === this.Pr.Is_Equal(PrevElement.Pr))
                        {
                            var Item = this.Content[CurPos - 1];
                            this.Remove_FromContent(CurPos - 1, 1, true);
                            PrevElement.Add_ToContent(PrevElement.Content.length, Item);
                            PrevElement.State.ContentPos = PrevElement.Content.length - 1;
                            PrevElement.Make_ThisElementCurrent();
                            return true;
                        }
                    }
                    else if (CurPos === this.Content.length && Parent && RunPos < Parent.Content.length - 1)
                    {
                        var NextElement = Parent.Content[RunPos + 1];
                        if (para_Run === NextElement.Type && reviewtype_Remove === NextElement.Get_ReviewType() && true === this.Pr.Is_Equal(NextElement.Pr))
                        {
                            var Item = this.Content[CurPos - 1];
                            this.Remove_FromContent(CurPos - 1, 1, true);
                            NextElement.Add_ToContent(0, Item);
                            this.State.ContentPos = CurPos - 1;
                            this.Make_ThisElementCurrent();
                            return true;
                        }
                    }

                    // Если мы дошли до сюда, значит данный элемент нужно выделять в отдельный ран
                    var RRun = this.Split2(CurPos, Parent, RunPos);
                    var CRun = this.Split2(CurPos - 1, Parent, RunPos);

                    CRun.Set_ReviewType(reviewtype_Remove);
                    this.State.ContentPos = CurPos - 1;
                    this.Make_ThisElementCurrent();
                }
                else
                {
                    if (CurPos >= this.Content.length || para_End === this.Content[CurPos].Type)
                        return false;

                    // Проверяем, возможно следующий элемент - инлайн картинка, тогда мы его не удаляем, а выделяем как картинку
                    if (para_Drawing == this.Content[CurPos].Type && true === this.Content[CurPos].Is_Inline())
                    {
                        return this.Paragraph.Parent.Select_DrawingObject(this.Content[CurPos].Get_Id());
                    }

                    if (CurPos === this.Content.length - 1 && 0 === CurPos)
                    {
                        this.Set_ReviewType(reviewtype_Remove);
                        this.State.ContentPos = 1;
                        this.Make_ThisElementCurrent();
                        return true;
                    }
                    else if (0 === CurPos && Parent && RunPos > 0)
                    {
                        var PrevElement = Parent.Content[RunPos - 1];
                        if (para_Run === PrevElement.Type && reviewtype_Remove === PrevElement.Get_ReviewType() && true === this.Pr.Is_Equal(PrevElement.Pr))
                        {
                            var Item = this.Content[CurPos];
                            this.Remove_FromContent(CurPos, 1, true);
                            PrevElement.Add_ToContent(PrevElement.Content.length, Item);
                            this.State.ContentPos = CurPos;
                            this.Make_ThisElementCurrent();
                            return true;
                        }
                    }
                    else if (CurPos === this.Content.length - 1 && Parent && RunPos < Parent.Content.length - 1)
                    {
                        var NextElement = Parent.Content[RunPos + 1];
                        if (para_Run === NextElement.Type && reviewtype_Remove === NextElement.Get_ReviewType() && true === this.Pr.Is_Equal(NextElement.Pr))
                        {
                            var Item = this.Content[CurPos];
                            this.Remove_FromContent(CurPos, 1, true);
                            NextElement.Add_ToContent(0, Item);
                            NextElement.State.ContentPos = 1;
                            NextElement.Make_ThisElementCurrent();
                            return true;
                        }
                    }

                    // Если мы дошли до сюда, значит данный элемент нужно выделять в отдельный ран
                    var RRun = this.Split2(CurPos + 1, Parent, RunPos);
                    var CRun = this.Split2(CurPos, Parent, RunPos);

                    CRun.Set_ReviewType(reviewtype_Remove);

                    RRun.State.ContentPos = 0;
                    RRun.Make_ThisElementCurrent();
                }
            }
        }
    }
    else
    {
        if (true === Selection.Use)
        {
            var StartPos = Selection.StartPos;
            var EndPos = Selection.EndPos;

            if (StartPos > EndPos)
            {
                var Temp = StartPos;
                StartPos = EndPos;
                EndPos = Temp;
            }

            // Если в выделение попадает ParaEnd, тогда удаляем все кроме этого элемента
            if (true === this.Selection_CheckParaEnd())
            {
                for (var CurPos = EndPos - 1; CurPos >= StartPos; CurPos--)
                {
                    if (para_End !== this.Content[CurPos].Type)
                        this.Remove_FromContent(CurPos, 1, true);
                }
            }
            else
            {
                this.Remove_FromContent(StartPos, EndPos - StartPos, true);
            }

            this.Selection_Remove();
            this.State.ContentPos = StartPos;
        }
        else
        {
            var CurPos = this.State.ContentPos;

            if (Direction < 0)
            {
                // Пропускаем все Flow-объекты
                while (CurPos > 0 && para_Drawing === this.Content[CurPos - 1].Type && false === this.Content[CurPos - 1].Is_Inline())
                    CurPos--;

                if (CurPos <= 0)
                    return false;

                // Проверяем, возможно предыдущий элемент - инлайн картинка, тогда мы его не удаляем, а выделяем как картинку
                if (para_Drawing == this.Content[CurPos - 1].Type && true === this.Content[CurPos - 1].Is_Inline())
                {
                    return this.Paragraph.Parent.Select_DrawingObject(this.Content[CurPos - 1].Get_Id());
                }

                this.Remove_FromContent(CurPos - 1, 1, true);

                this.State.ContentPos = CurPos - 1;
            }
            else
            {
                if (CurPos >= this.Content.length || para_End === this.Content[CurPos].Type)
                    return false;

                // Проверяем, возможно следующий элемент - инлайн картинка, тогда мы его не удаляем, а выделяем как картинку
                if (para_Drawing == this.Content[CurPos].Type && true === this.Content[CurPos].Is_Inline())
                {
                    return this.Paragraph.Parent.Select_DrawingObject(this.Content[CurPos].Get_Id());
                }

                this.Remove_FromContent(CurPos, 1, true);

                this.State.ContentPos = CurPos;
            }
        }
    }

    return true;
};

ParaRun.prototype.Remove_ParaEnd = function()
{
    var Pos = -1;

    var ContentLen = this.Content.length;
    for ( var CurPos = 0; CurPos < ContentLen; CurPos++ )
    {
        if ( para_End === this.Content[CurPos].Type )
        {
            Pos = CurPos;
            break;
        }
    }

    if ( -1 === Pos )
        return false;

    this.Remove_FromContent( Pos, ContentLen - Pos, true );

    return true;
};

/**
 * Обновляем позиции селекта, курсора и переносов строк при добавлении элемента в контент данного рана.
 * @param Pos
 */
ParaRun.prototype.private_UpdatePositionsOnAdd = function(Pos)
{
    // Обновляем текущую позицию
    if (this.State.ContentPos >= Pos)
        this.State.ContentPos++;

    // Обновляем начало и конец селекта
    if (true === this.State.Selection.Use)
    {
        if (this.State.Selection.StartPos >= Pos)
            this.State.Selection.StartPos++;

        if (this.State.Selection.EndPos >= Pos)
            this.State.Selection.EndPos++;
    }

    // Также передвинем всем метки переносов страниц и строк
    var LinesCount = this.protected_GetLinesCount();
    for (var CurLine = 0; CurLine < LinesCount; CurLine++)
    {
        var RangesCount = this.protected_GetRangesCount(CurLine);

        for (var CurRange = 0; CurRange < RangesCount; CurRange++)
        {
            var StartPos = this.protected_GetRangeStartPos(CurLine, CurRange);
            var EndPos = this.protected_GetRangeEndPos(CurLine, CurRange);

            if (StartPos > Pos)
                StartPos++;

            if (EndPos > Pos)
                EndPos++;

            this.protected_FillRange(CurLine, CurRange, StartPos, EndPos);
        }

        // Особый случай, когда мы добавляем элемент в самый последний ран
        if (Pos === this.Content.length - 1 && LinesCount - 1 === CurLine)
        {
            this.protected_FillRangeEndPos(CurLine, RangesCount - 1, this.protected_GetRangeEndPos(CurLine, RangesCount - 1) + 1);
        }
    }
};

/**
 * Обновляем позиции селекта, курсора и переносов строк при удалении элементов из контента данного рана.
 * @param Pos
 * @param Count
 */
ParaRun.prototype.private_UpdatePositionsOnRemove = function(Pos, Count)
{
    // Обновим текущую позицию
    if (this.State.ContentPos > Pos + Count)
        this.State.ContentPos -= Count;
    else if (this.State.ContentPos > Pos)
        this.State.ContentPos = Pos;

    // Обновим начало и конец селекта
    if (true === this.State.Selection.Use)
    {
        if (this.State.Selection.StartPos <= this.State.Selection.EndPos)
        {
            if (this.State.Selection.StartPos > Pos + Count)
                this.State.Selection.StartPos -= Count;
            else if (this.State.Selection.StartPos > Pos)
                this.State.Selection.StartPos = Pos;

            if (this.State.Selection.EndPos >= Pos + Count)
                this.State.Selection.EndPos -= Count;
            else if (this.State.Selection.EndPos > Pos)
                this.State.Selection.EndPos = Math.max(0, Pos - 1);
        }
        else
        {
            if (this.State.Selection.StartPos >= Pos + Count)
                this.State.Selection.StartPos -= Count;
            else if (this.State.Selection.StartPos > Pos)
                this.State.Selection.StartPos = Math.max(0, Pos - 1);

            if (this.State.Selection.EndPos > Pos + Count)
                this.State.Selection.EndPos -= Count;
            else if (this.State.Selection.EndPos > Pos)
                this.State.Selection.EndPos = Pos;
        }
    }

    // Также передвинем всем метки переносов страниц и строк
    var LinesCount = this.protected_GetLinesCount();
    for (var CurLine = 0; CurLine < LinesCount; CurLine++)
    {
        var RangesCount = this.protected_GetRangesCount(CurLine);
        for (var CurRange = 0; CurRange < RangesCount; CurRange++)
        {
            var StartPos = this.protected_GetRangeStartPos(CurLine, CurRange);
            var EndPos = this.protected_GetRangeEndPos(CurLine, CurRange);

            if (StartPos > Pos + Count)
                StartPos -= Count;
            else if (StartPos > Pos)
                StartPos = Math.max(0, Pos);

            if (EndPos >= Pos + Count)
                EndPos -= Count;
            else if (EndPos >= Pos)
                EndPos = Math.max(0, Pos);

            this.protected_FillRange(CurLine, CurRange, StartPos, EndPos);
        }
    }
};

// Добавляем элемент в позицию с сохранием в историю
ParaRun.prototype.Add_ToContent = function(Pos, Item, UpdatePosition)
{
    History.Add( this, { Type : historyitem_ParaRun_AddItem, Pos : Pos, EndPos : Pos, Items : [ Item ] } );
    this.Content.splice( Pos, 0, Item );

    if (true === UpdatePosition)
        this.private_UpdatePositionsOnAdd(Pos);

    // Обновляем позиции в NearestPos
    var NearPosLen = this.NearPosArray.length;
    for ( var Index = 0; Index < NearPosLen; Index++ )
    {
        var RunNearPos = this.NearPosArray[Index];
        var ContentPos = RunNearPos.NearPos.ContentPos;
        var Depth      = RunNearPos.Depth;

        if ( ContentPos.Data[Depth] >= Pos )
            ContentPos.Data[Depth]++;
    }

    // Обновляем позиции в поиске
    var SearchMarksCount = this.SearchMarks.length;
    for ( var Index = 0; Index < SearchMarksCount; Index++ )
    {
        var Mark       = this.SearchMarks[Index];
        var ContentPos = ( true === Mark.Start ? Mark.SearchResult.StartPos : Mark.SearchResult.EndPos );
        var Depth      = Mark.Depth;

        if ( ContentPos.Data[Depth] >= Pos )
            ContentPos.Data[Depth]++;
    }

    // Обновляем позиции для орфографии
    var SpellingMarksCount = this.SpellingMarks.length;
    for ( var Index = 0; Index < SpellingMarksCount; Index++ )
    {
        var Mark       = this.SpellingMarks[Index];
        var ContentPos = ( true === Mark.Start ? Mark.Element.StartPos : Mark.Element.EndPos );
        var Depth      = Mark.Depth;

        if ( ContentPos.Data[Depth] >= Pos )
            ContentPos.Data[Depth]++;
    }

    this.protected_UpdateSpellChecking();
    this.private_UpdateTrackRevisionOnChangeContent(true);

    // Обновляем позиции меток совместного редактирования
    this.CollaborativeMarks.Update_OnAdd( Pos );

    // Отмечаем, что надо перемерить элементы в данном ране
    this.RecalcInfo.Measure = true;
};

ParaRun.prototype.Remove_FromContent = function(Pos, Count, UpdatePosition)
{
    // Получим массив удаляемых элементов
    var DeletedItems = this.Content.slice( Pos, Pos + Count );
    History.Add( this, { Type : historyitem_Paragraph_RemoveItem, Pos : Pos, EndPos : Pos + Count - 1, Items : DeletedItems } );

    this.Content.splice( Pos, Count );

    if (true === UpdatePosition)
        this.private_UpdatePositionsOnRemove(Pos, Count);

    // Обновляем позиции в NearestPos
    var NearPosLen = this.NearPosArray.length;
    for ( var Index = 0; Index < NearPosLen; Index++ )
    {
        var RunNearPos = this.NearPosArray[Index];
        var ContentPos = RunNearPos.NearPos.ContentPos;
        var Depth      = RunNearPos.Depth;

        if ( ContentPos.Data[Depth] > Pos + Count )
            ContentPos.Data[Depth] -= Count;
        else if ( ContentPos.Data[Depth] > Pos )
            ContentPos.Data[Depth] = Math.max( 0 , Pos );
    }

    // Обновляем позиции в поиске
    var SearchMarksCount = this.SearchMarks.length;
    for ( var Index = 0; Index < SearchMarksCount; Index++ )
    {
        var Mark       = this.SearchMarks[Index];
        var ContentPos = ( true === Mark.Start ? Mark.SearchResult.StartPos : Mark.SearchResult.EndPos );
        var Depth      = Mark.Depth;

        if ( ContentPos.Data[Depth] > Pos + Count )
            ContentPos.Data[Depth] -= Count;
        else if ( ContentPos.Data[Depth] > Pos )
            ContentPos.Data[Depth] = Math.max( 0 , Pos );
    }

    // Обновляем позиции для орфографии
    var SpellingMarksCount = this.SpellingMarks.length;
    for ( var Index = 0; Index < SpellingMarksCount; Index++ )
    {
        var Mark       = this.SpellingMarks[Index];
        var ContentPos = ( true === Mark.Start ? Mark.Element.StartPos : Mark.Element.EndPos );
        var Depth      = Mark.Depth;

        if ( ContentPos.Data[Depth] > Pos + Count )
            ContentPos.Data[Depth] -= Count;
        else if ( ContentPos.Data[Depth] > Pos )
            ContentPos.Data[Depth] = Math.max( 0 , Pos );
    }

    this.protected_UpdateSpellChecking();
    this.private_UpdateTrackRevisionOnChangeContent(true);

    // Обновляем позиции меток совместного редактирования
    this.CollaborativeMarks.Update_OnRemove( Pos, Count );

    // Отмечаем, что надо перемерить элементы в данном ране
    this.RecalcInfo.Measure = true;
};

ParaRun.prototype.Concat_ToContent = function(NewItems)
{
    var StartPos = this.Content.length;
    this.Content = this.Content.concat( NewItems );

    History.Add( this, { Type : historyitem_ParaRun_AddItem, Pos : StartPos, EndPos : this.Content.length - 1, Items : NewItems, Color : false } );

    this.private_UpdateTrackRevisionOnChangeContent(true);

    // Отмечаем, что надо перемерить элементы в данном ране
    this.RecalcInfo.Measure = true;
};

// Определим строку и отрезок текущей позиции
ParaRun.prototype.Get_CurrentParaPos = function()
{
    var Pos = this.State.ContentPos;

    if (-1 === this.StartLine)
        return new CParaPos(-1, -1, -1, -1);

    var CurLine  = 0;
    var CurRange = 0;

    var LinesCount = this.protected_GetLinesCount();
    for (; CurLine < LinesCount; CurLine++)
    {
        var RangesCount = this.protected_GetRangesCount(CurLine);
        for (CurRange = 0; CurRange < RangesCount; CurRange++)
        {
            var StartPos = this.protected_GetRangeStartPos(CurLine, CurRange);
            var EndPos   = this.protected_GetRangeEndPos(CurLine, CurRange);
            if ( Pos < EndPos && Pos >= StartPos )
                return new CParaPos((CurLine === 0 ? CurRange + this.StartRange : CurRange), CurLine + this.StartLine, 0, 0);
        }
    }

    // Значит курсор стоит в самом конце, поэтому посылаем последний отрезок
    if(this.Type == para_Math_Run && LinesCount > 1)
    {
        var Line  = LinesCount - 1,
            Range = this.protected_GetRangesCount(LinesCount - 1) - 1;

        StartPos = this.protected_GetRangeStartPos(Line, Range);
        EndPos   = this.protected_GetRangeEndPos(Line, Range);

        // учтем, что в одной строке в формуле может быть только один Range
        while(StartPos == EndPos && Line > 0 && this.Content.length !== 0) // == this.Content.length, т.к. последний Range
        {
            Line--;
            StartPos = this.protected_GetRangeStartPos(Line, Range);
            EndPos   = this.protected_GetRangeEndPos(Line, Range);
        }

        return new CParaPos((this.protected_GetRangesCount(Line) - 1), Line + this.StartLine, 0, 0 );
    }

    return new CParaPos((LinesCount <= 1 ? this.protected_GetRangesCount(0) - 1 + this.StartRange : this.protected_GetRangesCount(LinesCount - 1) - 1), LinesCount - 1 + this.StartLine, 0, 0 );
};

ParaRun.prototype.Get_ParaPosByContentPos = function(ContentPos, Depth)
{
    if (this.StartRange < 0 || this.StartLine < 0)
        return new CParaPos(0, 0, 0, 0);

    var Pos = ContentPos.Get(Depth);

    var CurLine  = 0;
    var CurRange = 0;

    var LinesCount = this.protected_GetLinesCount();
    if (LinesCount <= 0)
        return new CParaPos(0, 0, 0, 0);

    for (; CurLine < LinesCount; CurLine++)
    {
        var RangesCount = this.protected_GetRangesCount(CurLine);
        for (CurRange = 0; CurRange < RangesCount; CurRange++)
        {
            var StartPos = this.protected_GetRangeStartPos(CurLine, CurRange);
            var EndPos   = this.protected_GetRangeEndPos(CurLine, CurRange);

            var bUpdateMathRun = Pos == EndPos && StartPos == EndPos && EndPos == this.Content.length && this.Type == para_Math_Run; // для para_Run позиция может быть после последнего элемента (пример: Run, за ним идет мат объект)
            if (Pos < EndPos && Pos >= StartPos || bUpdateMathRun)
                return new CParaPos((CurLine === 0 ? CurRange + this.StartRange : CurRange), CurLine + this.StartLine, 0, 0);
        }
    }

    return new CParaPos((LinesCount === 1 ? this.protected_GetRangesCount(0) - 1 + this.StartRange : this.protected_GetRangesCount(0) - 1), LinesCount - 1 + this.StartLine, 0, 0);
};

ParaRun.prototype.Recalculate_CurPos = function(X, Y, CurrentRun, _CurRange, _CurLine, CurPage, UpdateCurPos, UpdateTarget, ReturnTarget)
{
    var Para = this.Paragraph;

    var CurLine  = _CurLine - this.StartLine;
    var CurRange = ( 0 === CurLine ? _CurRange - this.StartRange : _CurRange );

    var StartPos = this.protected_GetRangeStartPos(CurLine, CurRange);
    var EndPos   = this.protected_GetRangeEndPos(CurLine, CurRange);

    var Pos = StartPos;
    var _EndPos = ( true === CurrentRun ? Math.min( EndPos, this.State.ContentPos ) : EndPos );

    if(this.Type == para_Math_Run)
    {
        var Lng = this.Content.length;

        Pos = _EndPos;

        var LocParaMath = this.ParaMath.GetLinePosition(_CurLine, _CurRange);
        X = LocParaMath.x;
        Y = LocParaMath.y;

        var MATH_Y = Y;
        var loc;

        if(Lng == 0)
        {
            X += this.pos.x;
            Y += this.pos.y;
        }
        else if(Pos < EndPos)
        {
            loc = this.Content[Pos].GetLocationOfLetter();

            X += loc.x;
            Y += loc.y;
        }
        else if(!(StartPos == EndPos)) // исключаем этот случай StartPos == EndPos && EndPos == Pos, это возможно когда конец Run находится в начале строки, при этом ни одна из букв этого Run не входит в эту строку
        {
            var Letter = this.Content[Pos - 1];
            loc = Letter.GetLocationOfLetter();

            X += loc.x + Letter.Get_WidthVisible();
            Y += loc.y;
        }

    }
    else
    {
        for ( ; Pos < _EndPos; Pos++ )
        {
            var Item = this.Content[Pos];
            var ItemType = Item.Type;

            switch( ItemType )
            {
                case para_Text:
                case para_Space:
                case para_Sym:
                case para_PageNum:
                case para_Tab:
                case para_End:
                case para_NewLine:
                case para_Math_Text:
                case para_Math_BreakOperator:
                case para_Math_Placeholder:
                case para_Math_Ampersand:
                {
                    X += Item.Get_WidthVisible();
                    break;
                }
                case para_Drawing:
                {
                    if ( drawing_Inline != Item.DrawingType )
                        break;

                    X += Item.Get_WidthVisible();
                    break;
                }
            }
        }
    }

    if ( true === CurrentRun && Pos === this.State.ContentPos )
    {
        if ( true === UpdateCurPos )
        {
            // Обновляем позицию курсора в параграфе

            Para.CurPos.X        = X;
            Para.CurPos.Y        = Y;
            Para.CurPos.PagesPos = CurPage;

            if ( true === UpdateTarget )
            {
                var CurTextPr = this.Get_CompiledPr(false);

                g_oTextMeasurer.SetTextPr( CurTextPr, this.Paragraph.Get_Theme() );
                g_oTextMeasurer.SetFontSlot( fontslot_ASCII, CurTextPr.Get_FontKoef() );
                var Height    = g_oTextMeasurer.GetHeight();
                var Descender = Math.abs( g_oTextMeasurer.GetDescender() );
                var Ascender  = Height - Descender;


                Para.DrawingDocument.SetTargetSize( Height );


                var RGBA;
                Para.DrawingDocument.UpdateTargetTransform(Para.Get_ParentTextTransform());
                if(CurTextPr.TextFill)
                {
                    CurTextPr.TextFill.check(Para.Get_Theme(), Para.Get_ColorMap());
                    var oColor = CurTextPr.TextFill.getRGBAColor();
                    Para.DrawingDocument.SetTargetColor( oColor.R, oColor.G, oColor.B );
                }
                else if(CurTextPr.Unifill)
                {
                    CurTextPr.Unifill.check(Para.Get_Theme(), Para.Get_ColorMap());
                    RGBA = CurTextPr.Unifill.getRGBAColor();
                    Para.DrawingDocument.SetTargetColor( RGBA.R, RGBA.G, RGBA.B );
                }
                else
                {
                    if ( true === CurTextPr.Color.Auto )
                    {
                        // Выясним какая заливка у нашего текста
                        var Pr = Para.Get_CompiledPr();
                        var BgColor = undefined;
                        if ( undefined !== Pr.ParaPr.Shd && shd_Nil !== Pr.ParaPr.Shd.Value )
                        {
                            if(Pr.ParaPr.Shd.Unifill)
                            {
                                Pr.ParaPr.Shd.Unifill.check(this.Paragraph.Get_Theme(), this.Paragraph.Get_ColorMap());
                                var RGBA =  Pr.ParaPr.Shd.Unifill.getRGBAColor();
                                BgColor = new CDocumentColor(RGBA.R, RGBA.G, RGBA.B, false);
                            }
                            else
                            {
                                BgColor = Pr.ParaPr.Shd.Color;
                            }
                        }
                        else
                        {
                            // Нам надо выяснить заливку у родительского класса (возможно мы находимся в ячейке таблицы с забивкой)
                            BgColor = Para.Parent.Get_TextBackGroundColor();

                            if ( undefined !== CurTextPr.Shd && shd_Nil !== CurTextPr.Shd.Value )
                                BgColor = CurTextPr.Shd.Get_Color( this.Paragraph );
                        }

                        // Определим автоцвет относительно заливки
                        var AutoColor = ( undefined != BgColor && false === BgColor.Check_BlackAutoColor() ? new CDocumentColor( 255, 255, 255, false ) : new CDocumentColor( 0, 0, 0, false ) );
                        Para.DrawingDocument.SetTargetColor( AutoColor.r, AutoColor.g, AutoColor.b );
                    }
                    else
                        Para.DrawingDocument.SetTargetColor( CurTextPr.Color.r, CurTextPr.Color.g, CurTextPr.Color.b );
                }

                var TargetY = Y - Ascender - CurTextPr.Position;
                switch( CurTextPr.VertAlign )
                {
                    case vertalign_SubScript:
                    {
                        TargetY -= CurTextPr.FontSize * g_dKoef_pt_to_mm * vertalign_Koef_Sub;
                        break;
                    }
                    case vertalign_SuperScript:
                    {
                        TargetY -= CurTextPr.FontSize * g_dKoef_pt_to_mm * vertalign_Koef_Super;
                        break;
                    }
                }

                var PageAbs = Para.Get_AbsolutePage(CurPage)
                Para.DrawingDocument.UpdateTarget(X, TargetY, PageAbs);

                // TODO: Тут делаем, чтобы курсор не выходил за границы буквицы. На самом деле, надо делать, чтобы
                //       курсор не выходил за границы строки, но для этого надо делать обрезку по строкам, а без нее
                //       такой вариант будет смотреться плохо.
                if ( undefined != Para.Get_FramePr() )
                {
                    var __Y0 = TargetY, __Y1 = TargetY + Height;
                    var ___Y0 = Para.Pages[CurPage].Y + Para.Lines[CurLine].Top;
                    var ___Y1 = Para.Pages[CurPage].Y + Para.Lines[CurLine].Bottom;

                    __Y0 = Math.max( __Y0, ___Y0 );
                    __Y1 = Math.min( __Y1, ___Y1 );

                    Para.DrawingDocument.SetTargetSize( __Y1 - __Y0 );
                    Para.DrawingDocument.UpdateTarget( X, __Y0, PageAbs );
                }

                if (para_Math_Run === this.Type && null !== this.Parent && true !== this.Parent.bRoot && this.Parent.bMath_OneLine)
                {
                    var oBounds = this.Parent.Get_Bounds();

                    var __Y0 = TargetY, __Y1 = TargetY + Height;
                    //var ___Y0 = oBounds.Y - 0.2 * oBounds.H;
                    //var ___Y1 = oBounds.Y + 1.4 * oBounds.H;

                    // пока так
                    // TO DO : переделать

                    var YY = this.Parent.pos.y - this.Parent.size.ascent,
                        XX = this.Parent.pos.x;

                    var ___Y0 = MATH_Y + YY - 0.2 * oBounds.H;
                    var ___Y1 = MATH_Y + YY + 1.4 * oBounds.H;

                    __Y0 = Math.max( __Y0, ___Y0 );
                    __Y1 = Math.min( __Y1, ___Y1 );

                    Para.DrawingDocument.SetTargetSize( __Y1 - __Y0 );
                    Para.DrawingDocument.UpdateTarget( X, __Y0, PageAbs );
                }
            }
        }

        if ( true === ReturnTarget )
        {
            var CurTextPr = this.Get_CompiledPr(false);

            g_oTextMeasurer.SetTextPr( CurTextPr, this.Paragraph.Get_Theme() );
            g_oTextMeasurer.SetFontSlot( fontslot_ASCII, CurTextPr.Get_FontKoef() );


            var Height    = g_oTextMeasurer.GetHeight();
            var Descender = Math.abs( g_oTextMeasurer.GetDescender() );
            var Ascender  = Height - Descender;

            var TargetY = Y - Ascender - CurTextPr.Position;

            switch( CurTextPr.VertAlign )
            {
                case vertalign_SubScript:
                {
                    TargetY -= CurTextPr.FontSize * g_dKoef_pt_to_mm * vertalign_Koef_Sub;
                    break;
                }
                case vertalign_SuperScript:
                {
                    TargetY -= CurTextPr.FontSize * g_dKoef_pt_to_mm * vertalign_Koef_Super;
                    break;
                }
            }


            return { X : X, Y : TargetY, Height : Height, PageNum : Para.Get_AbsolutePage(CurPage), Internal : { Line : CurLine, Page : CurPage, Range : CurRange } };
        }
        else
            return { X : X, Y : Y, PageNum : Para.Get_AbsolutePage(CurPage), Internal : { Line : CurLine, Page : CurPage, Range : CurRange } };

    }

    return { X : X, Y: Y,  PageNum : Para.Get_AbsolutePage(CurPage), Internal : { Line : CurLine, Page : CurPage, Range : CurRange } };
};

// Проверяем, произошло ли простейшее изменение (набор или удаление текста)
ParaRun.prototype.Is_SimpleChanges = function(Changes)
{
    var ParaPos = null;

    var Count = Changes.length;
    for (var Index = 0; Index < Count; Index++)
    {
        var Data = Changes[Index].Data;

        if (undefined === Data.Items || 1 !== Data.Items.length)
            return false;

        var Type = Data.Type;
        var Item = Data.Items[0];

        if (undefined === Item)
            return false;

        if (historyitem_ParaRun_AddItem !== Type && historyitem_ParaRun_RemoveItem !== Type)
            return false;

        // Добавление/удаление картинок может изменить размер строки. Добавление/удаление переноса строки/страницы/колонки
        // нельзя обсчитывать функцией Recalculate_Fast.
        // TODO: Но на самом деле стоило бы сделать нормальную проверку на высоту строки в функции Recalculate_Fast
        var ItemType = Item.Type;
        if (para_Drawing === ItemType || para_NewLine === ItemType)
            return false;

        // Проверяем, что все изменения произошли в одном и том же отрезке
        var CurParaPos = this.Get_SimpleChanges_ParaPos([Changes[Index]]);
        if (null === CurParaPos)
            return false;

        if (null === ParaPos)
            ParaPos = CurParaPos;
        else if (ParaPos.Line !== CurParaPos.Line || ParaPos.Range !== CurParaPos.Range)
            return false;
    }

    return true;
};

/*
    Проверяем произошло ли простое изменение параграфа, сейчас главное, чтобы это было не добавление или удаление картинки.
    На вход приходит либо массив изменений, либо одно изменение (можно не в массиве).
 */
ParaRun.prototype.Is_ParagraphSimpleChanges = function(_Changes)
{
    var Changes = _Changes;
    if (!_Changes.length)
        Changes = [_Changes];

    var ChangesCount = Changes.length;
    for (var ChangesIndex = 0; ChangesIndex < ChangesCount; ChangesIndex++)
    {
        var Data = Changes[ChangesIndex].Data;
        var ChangeType = Data.Type;

        if (historyitem_ParaRun_AddItem === ChangeType || historyitem_ParaRun_RemoveItem === ChangeType)
        {
            for (var ItemIndex = 0, ItemsCount = Data.Items.length; ItemIndex < ItemsCount; ItemIndex++)
            {
                var Item = Data.Items[ItemIndex];
                if (para_Drawing === Item.Type)
                    return false;
            }
        }
    }

    return true;
};

// Возвращаем строку и отрезок, в котором произошли простейшие изменения
ParaRun.prototype.Get_SimpleChanges_ParaPos = function(Changes)
{
    var Change = Changes[0].Data;
    var Type   = Changes[0].Data.Type;
    var Pos    = Change.Pos;

    var CurLine  = 0;
    var CurRange = 0;

    var LinesCount = this.protected_GetLinesCount();
    for (; CurLine < LinesCount; CurLine++)
    {
        var RangesCount = this.protected_GetRangesCount(CurLine);
        for (CurRange = 0; CurRange < RangesCount; CurRange++)
        {
            var RangeStartPos = this.protected_GetRangeStartPos(CurLine, CurRange);
            var RangeEndPos   = this.protected_GetRangeEndPos(CurLine, CurRange);

            if  ( ( historyitem_ParaRun_AddItem === Type && Pos < RangeEndPos && Pos >= RangeStartPos ) || ( historyitem_ParaRun_RemoveItem === Type && Pos < RangeEndPos && Pos >= RangeStartPos ) || ( historyitem_ParaRun_RemoveItem === Type && Pos >= RangeEndPos && CurLine === LinesCount - 1 && CurRange === RangesCount - 1 ) )
            {
                // Если отрезок остается пустым, тогда надо все заново пересчитывать
                if ( RangeStartPos === RangeEndPos )
                    return null;

                return new CParaPos( ( CurLine === 0 ? CurRange + this.StartRange : CurRange ), CurLine + this.StartLine, 0, 0 );
            }
        }
    }

    // Если отрезок остается пустым, тогда надо все заново пересчитывать
    if (this.protected_GetRangeStartPos(0, 0) === this.protected_GetRangeEndPos(0, 0))
        return null;

    return new CParaPos( this.StartRange, this.StartLine, 0, 0 );
};

ParaRun.prototype.Split = function (ContentPos, Depth)
{
    var CurPos = ContentPos.Get(Depth);
    return this.Split2( CurPos );
};

ParaRun.prototype.Split2 = function(CurPos, Parent, ParentPos)
{
    History.Add(this, {Type : historyitem_ParaRun_OnStartSplit, Pos : CurPos});
    CollaborativeEditing.OnStart_SplitRun(this, CurPos);

    // Если задается Parent и ParentPos, тогда ран автоматически добавляется в родительский класс
    var UpdateParent    = (undefined !== Parent && undefined !== ParentPos && this === Parent.Content[ParentPos] ? true : false);
    var UpdateSelection = (true === UpdateParent && true === Parent.Is_SelectionUse() && true === this.Is_SelectionUse() ? true : false);

    // Создаем новый ран
    var bMathRun = this.Type == para_Math_Run;
    var NewRun = new ParaRun(this.Paragraph, bMathRun);

    // Копируем настройки
    NewRun.Set_Pr(this.Pr.Copy(true));
    NewRun.Set_ReviewType(this.ReviewType);

    NewRun.CollPrChangeMine  = this.CollPrChangeMine;
    NewRun.CollPrChangeOther = this.CollPrChangeOther;

    if(bMathRun)
        NewRun.Set_MathPr(this.MathPrp.Copy());

    // TODO: Как только избавимся от para_End переделать тут
    // Проверим, если наш ран содержит para_End, тогда мы должны para_End переметить в правый ран

    var CheckEndPos = -1;
    var CheckEndPos2 = Math.min( CurPos, this.Content.length );
    for ( var Pos = 0; Pos < CheckEndPos2; Pos++ )
    {
        if ( para_End === this.Content[Pos].Type )
        {
            CheckEndPos = Pos;
            break;
        }
    }

    if ( -1 !== CheckEndPos )
        CurPos = CheckEndPos;

    var ParentOldSelectionStartPos, ParentOldSelectionEndPos, OldSelectionStartPos, OldSelectionEndPos;
    if (true === UpdateSelection)
    {
        ParentOldSelectionStartPos = Parent.Selection.StartPos;
        ParentOldSelectionEndPos   = Parent.Selection.EndPos;
        OldSelectionStartPos = this.Selection.StartPos;
        OldSelectionEndPos   = this.Selection.EndPos;
    }

    if (true === UpdateParent)
    {
        Parent.Add_ToContent(ParentPos + 1, NewRun);

        // Обновим массив NearPosArray
        for (var Index = 0, Count = this.NearPosArray.length; Index < Count; Index++)
        {
            var RunNearPos = this.NearPosArray[Index];
            var ContentPos = RunNearPos.NearPos.ContentPos;
            var Depth      = RunNearPos.Depth;

            var Pos = ContentPos.Get(Depth);

            if (Pos >= CurPos)
            {
                ContentPos.Update2(Pos - CurPos, Depth);
                ContentPos.Update2(ParentPos + 1, Depth - 1);

                this.NearPosArray.splice(Index, 1);
                Count--;
                Index--;

                NewRun.NearPosArray.push(RunNearPos);

                if (this.Paragraph)
                {
                    for (var ParaIndex = 0, ParaCount = this.Paragraph.NearPosArray.length; ParaIndex < ParaCount; ParaIndex++)
                    {
                        var ParaNearPos = this.Paragraph.NearPosArray[ParaIndex];
                        if (ParaNearPos.Classes[ParaNearPos.Classes.length - 1] === this)
                            ParaNearPos.Classes[ParaNearPos.Classes.length - 1] = NewRun;
                    }
                }
            }
        }
    }

    // Разделяем содержимое по ранам
    NewRun.Concat_ToContent( this.Content.slice(CurPos) );
    this.Remove_FromContent( CurPos, this.Content.length - CurPos, true );

    // Если были точки орфографии, тогда переместим их в новый ран
    var SpellingMarksCount = this.SpellingMarks.length;
    for ( var Index = 0; Index < SpellingMarksCount; Index++ )
    {
        var Mark    = this.SpellingMarks[Index];
        var MarkPos = ( true === Mark.Start ? Mark.Element.StartPos.Get(Mark.Depth) : Mark.Element.EndPos.Get(Mark.Depth) );

        if ( MarkPos >= CurPos )
        {
            var MarkElement = Mark.Element;
            if ( true === Mark.Start )
            {
                MarkElement.StartPos.Data[Mark.Depth] -= CurPos;
            }
            else
            {
                MarkElement.EndPos.Data[Mark.Depth] -= CurPos;
            }

            NewRun.SpellingMarks.push( Mark );

            this.SpellingMarks.splice( Index, 1 );
            SpellingMarksCount--;
            Index--;
        }
    }

    if (true === UpdateSelection)
    {
        if (ParentOldSelectionStartPos <= ParentPos && ParentPos <= ParentOldSelectionEndPos)
            Parent.Selection.EndPos = ParentOldSelectionEndPos + 1;
        else if (ParentOldSelectionEndPos <= ParentPos && ParentPos <= ParentOldSelectionStartPos)
            Parent.Selection.StartPos = ParentOldSelectionStartPos + 1;

        if (OldSelectionStartPos <= CurPos && CurPos <= OldSelectionEndPos)
        {
            this.Selection.EndPos = this.Content.length;
            NewRun.Selection.Use      = true;
            NewRun.Selection.StartPos = 0;
            NewRun.Selection.EndPos   = OldSelectionEndPos - CurPos;
        }
        else if (OldSelectionEndPos <= CurPos && CurPos <= OldSelectionStartPos)
        {
            this.Selection.StartPos = this.Content.length;
            NewRun.Selection.Use      = true;
            NewRun.Selection.EndPos   = 0;
            NewRun.Selection.StartPos = OldSelectionStartPos - CurPos;
        }
    }

    History.Add(this, {Type : historyitem_ParaRun_OnEndSplit, NewRun : NewRun});
    CollaborativeEditing.OnEnd_SplitRun(NewRun);
    return NewRun;
};


ParaRun.prototype.Check_NearestPos = function(ParaNearPos, Depth)
{
    var RunNearPos = new CParagraphElementNearPos();
    RunNearPos.NearPos = ParaNearPos.NearPos;
    RunNearPos.Depth   = Depth;

    this.NearPosArray.push( RunNearPos );
    ParaNearPos.Classes.push( this );
};

ParaRun.prototype.Get_DrawingObjectRun = function(Id)
{
    var ContentLen = this.Content.length;
    for ( var CurPos = 0; CurPos < ContentLen; CurPos++ )
    {
        var Element = this.Content[CurPos];

        if ( para_Drawing === Element.Type && Id === Element.Get_Id() )
            return this;
    }

    return null;
};

ParaRun.prototype.Get_DrawingObjectContentPos = function(Id, ContentPos, Depth)
{
    var ContentLen = this.Content.length;
    for ( var CurPos = 0; CurPos < ContentLen; CurPos++ )
    {
        var Element = this.Content[CurPos];

        if ( para_Drawing === Element.Type && Id === Element.Get_Id() )
        {
            ContentPos.Update( CurPos, Depth );
            return true;
        }
    }

    return false;
};

ParaRun.prototype.Get_DrawingObjectSimplePos = function(Id)
{
    var ContentLen = this.Content.length;
    for (var CurPos = 0; CurPos < ContentLen; CurPos++)
    {
        var Element = this.Content[CurPos];
        if (para_Drawing === Element.Type && Id === Element.Get_Id())
            return CurPos;
    }

    return -1;
};

ParaRun.prototype.Remove_DrawingObject = function(Id)
{
    var ContentLen = this.Content.length;
    for ( var CurPos = 0; CurPos < ContentLen; CurPos++ )
    {
        var Element = this.Content[CurPos];

        if ( para_Drawing === Element.Type && Id === Element.Get_Id() )
        {
            var TrackRevisions = null;
            if (this.Paragraph && this.Paragraph.LogicDocument)
                TrackRevisions = this.Paragraph.LogicDocument.Is_TrackRevisions();

            if (true === TrackRevisions)
            {
                var ReviewType = this.Get_ReviewType();
                if (reviewtype_Common === ReviewType)
                {
                    // Разбиваем ран на две части
                    var StartPos = CurPos;
                    var EndPos = CurPos + 1;

                    var Parent = this.Get_Parent();
                    var RunPos = this.private_GetPosInParent(Parent);

                    if (-1 !== RunPos && Parent)
                    {
                        var DeletedRun = null;
                        if (StartPos <= 0 && EndPos >= this.Content.length)
                            DeletedRun = this;
                        else if (StartPos <= 0)
                        {
                            this.Split2(EndPos, Parent, RunPos);
                            DeletedRun = this;
                        }
                        else if (EndPos >= this.Content.length)
                        {
                            DeletedRun = this.Split2(StartPos, Parent, RunPos);
                        }
                        else
                        {
                            this.Split2(EndPos, Parent, RunPos);
                            DeletedRun = this.Split2(StartPos, Parent, RunPos);
                        }

                        DeletedRun.Set_ReviewType(reviewtype_Remove);
                    }
                }
                else if (reviewtype_Add === ReviewType)
                {
                    this.Remove_FromContent(CurPos, 1, true);
                }
                else if (reviewtype_Remove === ReviewType)
                {
                    // Ничего не делаем
                }
            }
            else
            {
                this.Remove_FromContent(CurPos, 1, true);
            }

            return;
        }
    }
};

ParaRun.prototype.Get_Layout = function(DrawingLayout, UseContentPos, ContentPos, Depth)
{
    var CurLine  = DrawingLayout.Line - this.StartLine;
    var CurRange = ( 0 === CurLine ? DrawingLayout.Range - this.StartRange : DrawingLayout.Range );

    var StartPos = this.protected_GetRangeStartPos(CurLine, CurRange);
    var EndPos   = this.protected_GetRangeEndPos(CurLine, CurRange);

    var CurContentPos = ( true === UseContentPos ? ContentPos.Get(Depth) : -1 );

    var CurPos = StartPos;
    for ( ; CurPos < EndPos; CurPos++ )
    {
        if ( CurContentPos === CurPos )
            break;

        var Item         = this.Content[CurPos];
        var ItemType     = Item.Type;
        var WidthVisible = Item.Get_WidthVisible();

        switch ( ItemType )
        {
            case para_Text:
            case para_Space:
            case para_PageNum:
            {
                DrawingLayout.LastW = WidthVisible;

                break;
            }
            case para_Drawing:
            {
                if ( true === Item.Is_Inline() || true === DrawingLayout.Paragraph.Parent.Is_DrawingShape() )
                {
                    DrawingLayout.LastW = WidthVisible;
                }

                break;
            }
        }

        DrawingLayout.X += WidthVisible;
    }

    if (CurContentPos === CurPos)
        DrawingLayout.Layout = true;
};

ParaRun.prototype.Get_NextRunElements = function(RunElements, UseContentPos, Depth)
{
    var StartPos   = ( true === UseContentPos ? RunElements.ContentPos.Get(Depth) : 0 );
    var ContentLen = this.Content.length;

    for ( var CurPos = StartPos; CurPos < ContentLen; CurPos++ )
    {
        var Item = this.Content[CurPos];
        var ItemType = Item.Type;

        if ( para_Text === ItemType || para_Space === ItemType || para_Tab === ItemType)
        {
            RunElements.Elements.push( Item );
            RunElements.Count--;

            if ( RunElements.Count <= 0 )
                return;
        }
    }
};

ParaRun.prototype.Get_PrevRunElements = function(RunElements, UseContentPos, Depth)
{
    var StartPos   = ( true === UseContentPos ? RunElements.ContentPos.Get(Depth) - 1 : this.Content.length - 1 );
    var ContentLen = this.Content.length;

    for ( var CurPos = StartPos; CurPos >= 0; CurPos-- )
    {
        var Item = this.Content[CurPos];
        var ItemType = Item.Type;

        if ( para_Text === ItemType || para_Space === ItemType || para_Tab === ItemType )
        {
            RunElements.Elements.push( Item );
            RunElements.Count--;

            if ( RunElements.Count <= 0 )
                return;
        }
    }
};

ParaRun.prototype.Collect_DocumentStatistics = function(ParaStats)
{
    var Count = this.Content.length;
    for ( var Index = 0; Index < Count; Index++ )
    {
        var Item = this.Content[Index];
        var ItemType = Item.Type;

        var bSymbol  = false;
        var bSpace   = false;
        var bNewWord = false;

        if ((para_Text === ItemType && false === Item.Is_NBSP()) || (para_PageNum === ItemType))
        {
            if ( false === ParaStats.Word )
                bNewWord = true;

            bSymbol = true;
            bSpace  = false;

            ParaStats.Word           = true;
            ParaStats.EmptyParagraph = false;
        }
        else if ((para_Text === ItemType && true === Item.Is_NBSP()) || para_Space === ItemType || para_Tab === ItemType)
        {
            bSymbol = true;
            bSpace  = true;

            ParaStats.Word = false;
        }

        if ( true === bSymbol )
            ParaStats.Stats.Add_Symbol( bSpace );

        if ( true === bNewWord )
            ParaStats.Stats.Add_Word();
    }
};

ParaRun.prototype.Create_FontMap = function(Map)
{
    // для Math_Para_Pun argSize учитывается, когда мержатся текстовые настройки в Internal_Compile_Pr()
    if ( undefined !== this.Paragraph && null !== this.Paragraph )
    {
        var TextPr;
        var FontSize, FontSizeCS;
        if(this.Type === para_Math_Run)
        {
            TextPr = this.Get_CompiledPr(false);

            FontSize   = TextPr.FontSize;
            FontSizeCS = TextPr.FontSizeCS;

            if(null !== this.Parent && undefined !== this.Parent && null !== this.Parent.ParaMath && undefined !== this.Parent.ParaMath)
            {
                TextPr.FontSize   = this.Math_GetRealFontSize(TextPr.FontSize);
                TextPr.FontSizeCS = this.Math_GetRealFontSize(TextPr.FontSizeCS);
            }
        }
        else
            TextPr = this.Get_CompiledPr(false);

        TextPr.Document_CreateFontMap(Map, this.Paragraph.Get_Theme().themeElements.fontScheme);
        var Count = this.Content.length;
        for (var Index = 0; Index < Count; Index++)
        {
            var Item = this.Content[Index];

            if ( para_Drawing === Item.Type )
                Item.documentCreateFontMap( Map );
        }

        if(this.Type === para_Math_Run)
        {
            TextPr.FontSize   = FontSize;
            TextPr.FontSizeCS = FontSizeCS;
        }
    }
};

ParaRun.prototype.Get_AllFontNames = function(AllFonts)
{
    this.Pr.Document_Get_AllFontNames( AllFonts );

    var Count = this.Content.length;
    for (var Index = 0; Index < Count; Index++)
    {
        var Item = this.Content[Index];

        if ( para_Drawing === Item.Type )
            Item.documentGetAllFontNames( AllFonts );
    }
};

ParaRun.prototype.Get_SelectedText = function(bAll, bClearText)
{
    var StartPos = 0;
    var EndPos   = 0;

    if ( true === bAll )
    {
        StartPos = 0;
        EndPos   = this.Content.length;
    }
    else if ( true === this.Selection.Use )
    {
        StartPos = this.State.Selection.StartPos;
        EndPos   = this.State.Selection.EndPos;

        if ( StartPos > EndPos )
        {
            var Temp = EndPos;
            EndPos   = StartPos;
            StartPos = Temp;
        }
    }

    var Str = "";

    for ( var Pos = StartPos; Pos < EndPos; Pos++ )
    {
        var Item = this.Content[Pos];
        var ItemType = Item.Type;

        switch ( ItemType )
        {
            case para_Drawing:
            //case para_End:
            case para_Numbering:
            case para_PresentationNumbering:
            case para_PageNum:
            {
                if ( true === bClearText )
                    return null;

                break;
            }

            case para_Text : Str += String.fromCharCode(Item.Value); break;
            case para_Space:
            case para_Tab  : Str += " "; break;
        }
    }

    return Str;
};

ParaRun.prototype.Get_SelectionDirection = function()
{
    if (true !== this.Selection.Use)
        return 0;

    if (this.Selection.StartPos <= this.Selection.EndPos)
        return 1;

    return -1;
};

ParaRun.prototype.Can_AddDropCap = function()
{
    var Count = this.Content.length;

    for ( var Pos = 0; Pos < Count; Pos++ )
    {
        var Item = this.Content[Pos];
        var ItemType = Item.Type;

        switch ( ItemType )
        {
            case para_Text:
                return true;

            case para_Space:
            case para_Tab:
            case para_PageNum:
                return false;

        }
    }

    return null;
};

ParaRun.prototype.Get_TextForDropCap = function(DropCapText, UseContentPos, ContentPos, Depth)
{
    var EndPos = ( true === UseContentPos ? ContentPos.Get(Depth) : this.Content.length );

    for ( var Pos = 0; Pos < EndPos; Pos++ )
    {
        var Item = this.Content[Pos];
        var ItemType = Item.Type;

        if ( true === DropCapText.Check )
        {
            if ( para_Space === ItemType || para_Tab === ItemType || para_PageNum === ItemType || para_Drawing === ItemType )
            {
                DropCapText.Mixed = true;
                return;
            }
        }
        else
        {
            if ( para_Text === ItemType )
            {
                DropCapText.Runs.push(this);
                DropCapText.Text.push(Item);

                this.Remove_FromContent( Pos, 1, true );
                Pos--;
                EndPos--;

                if ( true === DropCapText.Mixed )
                    return;
            }
        }
    }
};

ParaRun.prototype.Get_StartTabsCount = function(TabsCounter)
{
    var ContentLen = this.Content.length;

    for ( var Pos = 0; Pos < ContentLen; Pos++ )
    {
        var Item = this.Content[Pos];
        var ItemType = Item.Type;

        if ( para_Tab === ItemType )
        {
            TabsCounter.Count++;
            TabsCounter.Pos.push( Pos );
        }
        else if ( para_Text === ItemType || para_Space === ItemType || (para_Drawing === ItemType && true === Item.Is_Inline() ) || para_PageNum === ItemType || para_Math === ItemType )
            return false;
    }

    return true;
};

ParaRun.prototype.Remove_StartTabs = function(TabsCounter)
{
    var ContentLen = this.Content.length;
    for ( var Pos = 0; Pos < ContentLen; Pos++ )
    {
        var Item = this.Content[Pos];
        var ItemType = Item.Type;

        if ( para_Tab === ItemType )
        {
            this.Remove_FromContent( Pos, 1, true );

            TabsCounter.Count--;
            Pos--;
            ContentLen--;
        }
        else if ( para_Text === ItemType || para_Space === ItemType || (para_Drawing === ItemType && true === Item.Is_Inline() ) || para_PageNum === ItemType || para_Math === ItemType )
            return false;
    }

    return true;
};
//-----------------------------------------------------------------------------------
// Функции пересчета
//-----------------------------------------------------------------------------------   
// Пересчитываем размеры всех элементов
ParaRun.prototype.Recalculate_MeasureContent = function()
{
    if ( false === this.RecalcInfo.Measure )
        return;

    var Pr = this.Get_CompiledPr(false);

    var Theme = this.Paragraph.Get_Theme();
    g_oTextMeasurer.SetTextPr(Pr, Theme);
    g_oTextMeasurer.SetFontSlot(fontslot_ASCII);

    // Запрашиваем текущие метрики шрифта, под TextAscent мы будем понимать ascent + linegap(которые записаны в шрифте)
    this.TextHeight  = g_oTextMeasurer.GetHeight();
    this.TextDescent = Math.abs( g_oTextMeasurer.GetDescender() );
    this.TextAscent  = this.TextHeight - this.TextDescent;
    this.TextAscent2 = g_oTextMeasurer.GetAscender();
    this.YOffset     = Pr.Position;

    var ContentLength = this.Content.length;

    var InfoMathText;
    if(para_Math_Run == this.Type)
    {
        var InfoTextPr =
        {
            TextPr:         Pr,
            ArgSize:        this.Parent.Compiled_ArgSz.value,
            bNormalText:    this.IsNormalText(),
            bEqArray:       this.Parent.IsEqArray()
        };


        InfoMathText = new CMathInfoTextPr(InfoTextPr);
    }

    for ( var Pos = 0; Pos < ContentLength; Pos++ )
    {
        var Item = this.Content[Pos];
        var ItemType = Item.Type;

        if (para_Drawing === ItemType)
        {
            Item.Parent          = this.Paragraph;
            Item.DocumentContent = this.Paragraph.Parent;
            Item.DrawingDocument = this.Paragraph.Parent.DrawingDocument;
        }

        // TODO: Как только избавимся от para_End переделать здесь
        if ( para_End === ItemType )
        {
            var EndTextPr = this.Paragraph.Get_CompiledPr2(false).TextPr.Copy();
            EndTextPr.Merge(this.Paragraph.TextPr.Value);

            g_oTextMeasurer.SetTextPr( EndTextPr, this.Paragraph.Get_Theme());
            Item.Measure( g_oTextMeasurer, EndTextPr );

            continue;
        }

        Item.Measure( g_oTextMeasurer, Pr, InfoMathText );


        if (para_Drawing === Item.Type)
        {
            // После автофигур надо заново выставлять настройки
            g_oTextMeasurer.SetTextPr(Pr, Theme);
            g_oTextMeasurer.SetFontSlot(fontslot_ASCII);
        }
    }

    this.RecalcInfo.Recalc  = true;
    this.RecalcInfo.Measure = false;
};
ParaRun.prototype.Recalculate_Measure2 = function(Metrics)
{
    var TAscent  = Metrics.Ascent;
    var TDescent = Metrics.Descent;

    var Count = this.Content.length;
    for ( var Index = 0; Index < Count; Index++ )
    {
        var Item = this.Content[Index];
        var ItemType = Item.Type;

        if ( para_Text === ItemType )
        {
            var Temp = g_oTextMeasurer.Measure2(String.fromCharCode(Item.Value));

            if ( null === TAscent || TAscent < Temp.Ascent )
                TAscent = Temp.Ascent;

            if ( null === TDescent || TDescent > Temp.Ascent - Temp.Height )
                TDescent = Temp.Ascent - Temp.Height;
        }
    }

    Metrics.Ascent  = TAscent;
    Metrics.Descent = TDescent;
};

ParaRun.prototype.Recalculate_Range = function(PRS, ParaPr, Depth)
{
    if ( this.Paragraph !== PRS.Paragraph )
    {
        this.Paragraph = PRS.Paragraph;
        this.RecalcInfo.TextPr  = true;
        this.RecalcInfo.Measure = true;

        this.protected_UpdateSpellChecking();
    }

    // Сначала измеряем элементы (можно вызывать каждый раз, внутри разруливается, чтобы измерялось 1 раз)
    this.Recalculate_MeasureContent();

    var CurLine  = PRS.Line - this.StartLine;
    var CurRange = ( 0 === CurLine ? PRS.Range - this.StartRange : PRS.Range );

    // Если мы рассчитываем первый отрезок в первой строке, тогда нам нужно обновить информацию о нумерации
    if ( 0 === CurRange && 0 === CurLine )
    {
        var PrevRecalcInfo = PRS.RunRecalcInfoLast;

        // Либо до этого ничего не было (изначально первая строка и первый отрезок), либо мы заново пересчитываем
        // первую строку и первый отрезок (из-за обтекания, например).
        if ( null === PrevRecalcInfo )
            this.RecalcInfo.NumberingAdd = true;
        else
            this.RecalcInfo.NumberingAdd = PrevRecalcInfo.NumberingAdd;

        this.RecalcInfo.NumberingUse  = false;
        this.RecalcInfo.NumberingItem = null;
    }

    // Сохраняем ссылку на информацию пересчета данного рана
    PRS.RunRecalcInfoLast = this.RecalcInfo;

    // Добавляем информацию о новом отрезке
    var RangeStartPos = this.protected_AddRange(CurLine, CurRange);
    var RangeEndPos   = 0;

    var Para                = PRS.Paragraph;

    var MoveToLBP           = PRS.MoveToLBP;
    var NewRange            = PRS.NewRange;
    var ForceNewPage        = PRS.ForceNewPage;
    var NewPage             = PRS.NewPage;
    var End                 = PRS.End;

    var Word                = PRS.Word;
    var StartWord           = PRS.StartWord;
    var FirstItemOnLine     = PRS.FirstItemOnLine;
    var EmptyLine           = PRS.EmptyLine;

    var RangesCount         = PRS.RangesCount;

    var SpaceLen            = PRS.SpaceLen;
    var WordLen             = PRS.WordLen;

    var X                   = PRS.X;
    var XEnd                = PRS.XEnd;

    var ParaLine            = PRS.Line;
    var ParaRange           = PRS.Range;
    var bMathWordLarge      = PRS.bMathWordLarge;
    var OperGapRight        = PRS.OperGapRight;
    var OperGapLeft         = PRS.OperGapLeft;

    var bInsideOper         = PRS.bInsideOper;
    var bContainCompareOper = PRS.bContainCompareOper;
    var bEndRunToContent    = PRS.bEndRunToContent;
    var bNoOneBreakOperator = PRS.bNoOneBreakOperator;
    var bForcedBreak        = PRS.bForcedBreak;

    var Pos = RangeStartPos;

    var ContentLen = this.Content.length;
    var XRange    = PRS.XRange;
    var oSectionPr = undefined;

    if (false === StartWord && true === FirstItemOnLine && XEnd - X < 0.001 && RangesCount > 0)
    {
        NewRange = true;
        RangeEndPos = Pos;
    }
    else
    {
        for (; Pos < ContentLen; Pos++)
        {
            var Item = this.Content[Pos];
            var ItemType = Item.Type;

            // Проверяем, не нужно ли добавить нумерацию к данному элементу
            if (true === this.RecalcInfo.NumberingAdd && true === Item.Can_AddNumbering())
                X = this.private_RecalculateNumbering(PRS, Item, ParaPr, X);

            switch (ItemType)
            {
                case para_Sym:
                case para_Text:
                {
                    // Отмечаем, что началось слово
                    StartWord = true;

                    // При проверке, убирается ли слово, мы должны учитывать ширину предшествующих пробелов.
                    var LetterLen = Item.Width / TEXTWIDTH_DIVIDER;//var LetterLen = Item.Get_Width();

                    if (true !== Word)
                    {
                        // Слово только началось. Делаем следующее:
                        // 1) Если до него на строке ничего не было и данная строка не
                        //    имеет разрывов, тогда не надо проверять убирается ли слово в строке.
                        // 2) В противном случае, проверяем убирается ли слово в промежутке.

                        // Если слово только началось, и до него на строке ничего не было, и в строке нет разрывов, тогда не надо проверять убирается ли оно на строке.
                        if (true !== FirstItemOnLine || false === Para.Internal_Check_Ranges(ParaLine, ParaRange))
                        {
                            if (X + SpaceLen + LetterLen > XEnd)
                            {
                                NewRange = true;
                                RangeEndPos = Pos;
                            }
                        }

                        if (true !== NewRange)
                        {
                            // Отмечаем начало нового слова
                            PRS.Set_LineBreakPos(Pos);

                            // Если текущий символ с переносом, например, дефис, тогда на нем заканчивается слово
                            if (Item.Flags & PARATEXT_FLAGS_SPACEAFTER)//if ( true === Item.Is_SpaceAfter() )
                            {
                                // Добавляем длину пробелов до слова и ширину самого слова.
                                X += SpaceLen + LetterLen;

                                Word = false;
                                FirstItemOnLine = false;
                                EmptyLine = false;
                                SpaceLen = 0;
                                WordLen = 0;
                            }
                            else
                            {
                                Word = true;
                                WordLen = LetterLen;
                            }
                        }

                    }
                    else
                    {
                        if(X + SpaceLen + WordLen + LetterLen > XEnd)
                        {
                            if(true === FirstItemOnLine)
                            {
                                // Слово оказалось единственным элементом в промежутке, и, все равно,
                                // не умещается целиком. Делаем следующее:
                                //
                                //
                                // 1) Если у нас строка без вырезов, тогда ставим перенос строки на
                                //    текущей позиции.
                                // 2) Если у нас строка с вырезом, и данный вырез не последний, тогда
                                //    ставим перенос внутри строки в начале слова.
                                // 3) Если у нас строка с вырезом и вырез последний, тогда ставим перенос
                                //    строки в начале слова.

                                if (false === Para.Internal_Check_Ranges(ParaLine, ParaRange))
                                {
                                    // Слово не убирается в отрезке. Переносим слово в следующий отрезок
                                    MoveToLBP = true;
                                    NewRange = true;
                                }
                                else
                                {
                                    EmptyLine = false;
                                    X += WordLen;

                                    // Слово не убирается в отрезке, но, поскольку, слово 1 на строке и отрезок тоже 1,
                                    // делим слово в данном месте
                                    NewRange = true;
                                    RangeEndPos = Pos;
                                }
                            }
                            else
                            {
                                // Слово не убирается в отрезке. Переносим слово в следующий отрезок
                                MoveToLBP = true;
                                NewRange = true;
                            }
                        }

                        if (true !== NewRange)
                        {
                            // Мы убираемся в пределах данной строки. Прибавляем ширину буквы к ширине слова
                            WordLen += LetterLen;

                            // Если текущий символ с переносом, например, дефис, тогда на нем заканчивается слово
                            if (Item.Flags & PARATEXT_FLAGS_SPACEAFTER)//if ( true === Item.Is_SpaceAfter() )
                            {
                                // Добавляем длину пробелов до слова и ширину самого слова.
                                X += SpaceLen + WordLen;

                                Word = false;
                                FirstItemOnLine = false;
                                EmptyLine = false;
                                SpaceLen = 0;
                                WordLen = 0;
                            }
                        }
                    }

                    break;
                }
                case para_Math_Text:
                case para_Math_Ampersand:
                case para_Math_Placeholder:
                {
                    // Отмечаем, что началось слово
                    StartWord = true;

                    // При проверке, убирается ли слово, мы должны учитывать ширину предшествующих пробелов.
                    var LetterLen = Item.Get_Width2() / TEXTWIDTH_DIVIDER;//var LetterLen = Item.Get_Width();

                    if (true !== Word)
                    {
                        // Если слово только началось, и до него на строке ничего не было, и в строке нет разрывов, тогда не надо проверять убирается ли оно на строке.
                        if (true !== FirstItemOnLine /*|| false === Para.Internal_Check_Ranges(ParaLine, ParaRange)*/)
                        {
                            if (X + SpaceLen + LetterLen > XEnd)
                            {
                                NewRange = true;
                                RangeEndPos = Pos;
                            }
                            else if(bForcedBreak == true)
                            {
                                MoveToLBP = true;
                                NewRange = true;
                                PRS.Set_LineBreakPos(Pos);
                            }
                        }

                        if(true !== NewRange)
                        {
                            if(this.Parent.bRoot == true)
                                PRS.Set_LineBreakPos(Pos);

                            WordLen += LetterLen;
                            Word = true;
                        }

                    }
                    else
                    {
                        if(X + SpaceLen + WordLen + LetterLen > XEnd)
                        {
                            if(true === FirstItemOnLine /*&& true === Para.Internal_Check_Ranges(ParaLine, ParaRange)*/)
                            {
                                // Слово оказалось единственным элементом в промежутке, и, все равно, не умещается целиком.
                                // для Формулы слово не разбиваем, перенос не делаем, пишем в одну строку (слово выйдет за границу как в Ворде)

                                bMathWordLarge = true;

                            }
                            else
                            {
                                // Слово не убирается в отрезке. Переносим слово в следующий отрезок
                                MoveToLBP = true;
                                NewRange = true;
                            }
                        }

                        if (true !== NewRange)
                        {
                            // Мы убираемся в пределах данной строки. Прибавляем ширину буквы к ширине слова
                            WordLen += LetterLen;
                        }
                    }

                    break;
                }
                case para_Space:
                {
                    FirstItemOnLine = false;

                    if (true === Word)
                    {
                        // Добавляем длину пробелов до слова + длина самого слова. Не надо проверять
                        // убирается ли слово, мы это проверяем при добавленнии букв.
                        X += SpaceLen + WordLen;

                        Word = false;
                        EmptyLine = false;
                        SpaceLen = 0;
                        WordLen = 0;
                    }

                    // На пробеле не делаем перенос. Перенос строки или внутристрочный
                    // перенос делаем при добавлении любого непробельного символа
                    SpaceLen += Item.Width / TEXTWIDTH_DIVIDER;//SpaceLen += Item.Get_Width();

                    break;
                }
                case para_Math_BreakOperator:
                {
                    var BrkLen = Item.Get_Width2()/TEXTWIDTH_DIVIDER;

                    var bCompareOper = Item.Is_CompareOperator();
                    var bOperBefore = this.ParaMath.Is_BrkBinBefore() == true;

                    var bOperInEndContent = bOperBefore === false && bEndRunToContent === true && Pos == ContentLen - 1 && Word == true, // необходимо для того, чтобы у контентов мат объектов (к-ые могут разбиваться на строки) не было отметки Set_LineBreakPos, иначе скобка (или GapLeft), перед которой стоит break_Operator, перенесется на следующую строку (без текста !)
                        bLowPriority      = bCompareOper == false && bContainCompareOper == false;

                    if(Pos == 0 && true === this.IsForcedBreak()) // принудительный перенос срабатывает всегда
                    {
                        if(FirstItemOnLine === true && Word == false && bNoOneBreakOperator == true) // первый оператор в строке
                        {
                            WordLen += BrkLen;
                        }
                        else if(bOperBefore)
                        {
                            X += SpaceLen + WordLen;
                            WordLen = 0;
                            SpaceLen = 0;
                            NewRange = true;
                            RangeEndPos = Pos;

                        }
                        else
                        {
                            if(FirstItemOnLine == false && X + SpaceLen + WordLen + BrkLen > XEnd)
                            {
                                MoveToLBP = true;
                                NewRange = true;
                            }
                            else
                            {
                                X += SpaceLen + WordLen;
                                Word = false;
                                MoveToLBP = true;
                                NewRange = true;
                                PRS.Set_LineBreakPos(1);
                            }
                        }
                    }
                    else if(bOperInEndContent || bLowPriority) // у этого break Operator приоритет низкий(в контенте на данном уровне есть другие операторы с более высоким приоритетом) => по нему не разбиваем, обрабатываем как обычную букву
                    {
                        if(X + SpaceLen + WordLen + BrkLen > XEnd)
                        {
                            if(FirstItemOnLine == true)
                            {
                                bMathWordLarge = true;
                            }
                            else
                            {
                                // Слово не убирается в отрезке. Переносим слово в следующий отрезок
                                MoveToLBP = true;
                                NewRange = true;
                            }
                        }
                        else
                        {
                            WordLen += BrkLen;
                        }
                    }
                    else
                    {
                        var WorLenCompareOper = WordLen + X - XRange + (bOperBefore  ? SpaceLen : BrkLen);

                        var bOverXEnd, bOverXEndMWordLarge;
                        var bNotUpdBreakOper = false;

                        var bCompareWrapIndent = PRS.bFirstLine == true ? WorLenCompareOper > PRS.WrapIndent : true;

                        if(PRS.bPriorityOper == true && bCompareOper == true && bContainCompareOper == true && bCompareWrapIndent == true && !(Word == false && FirstItemOnLine === true)) // (Word == true && FirstItemOnLine == true) - не первый элемент в строке
                            bContainCompareOper = false;

                        if(bOperBefore)  // оператор "до" => оператор находится в начале строки
                        {
                            bOverXEnd = X + WordLen + SpaceLen + BrkLen > XEnd; // BrkLen прибавляем дла случая, если идут подряд Brk Operators в конце
                            bOverXEndMWordLarge = X + WordLen + SpaceLen > XEnd; // ширину самого оператора не учитываем при расчете bMathWordLarge, т.к. он будет находится на следующей строке


                            if(bOverXEnd)
                            {
                                // если вышли за границы не обновляем параметр bInsideOper, т.к. если уже были breakOperator, то, соответственно, он уже выставлен в true
                                // а если на этом уровне не было breakOperator, то и обновлять его нне нужо

                                if(FirstItemOnLine === false)
                                {
                                    MoveToLBP = true;
                                    NewRange = true;
                                }
                                else
                                {
                                    if(Word == true && bOverXEndMWordLarge == true)
                                    {
                                        bMathWordLarge = true;
                                    }

                                    X += SpaceLen + WordLen;

                                    if(PRS.bBreakPosInLWord == true)
                                    {
                                        PRS.Set_LineBreakPos(Pos);

                                    }
                                    else
                                    {
                                        bNotUpdBreakOper = true;
                                    }

                                    RangeEndPos = Pos;

                                    SpaceLen = 0;
                                    WordLen = 0;

                                    NewRange = true;
                                    EmptyLine = false;
                                }
                            }
                            else
                            {
                                if(FirstItemOnLine === false)
                                    bInsideOper = true;


                                if(Word == false && FirstItemOnLine == true )
                                {
                                    SpaceLen += BrkLen;
                                }
                                else
                                {
                                    // проверка на FirstItemOnLine == false нужна для случая, если иду подряд несколько breakOperator
                                    // в этом случае Word == false && FirstItemOnLine == false, нужно также поставить отметку для потенциального переноса

                                    X += SpaceLen + WordLen;
                                    PRS.Set_LineBreakPos(Pos);
                                    EmptyLine = false;
                                    WordLen = BrkLen;
                                    SpaceLen = 0;

                                }

                                // в первой строке может не быть ни одного break Operator, при этом слово не выходит за границы, т.о. обновляем FirstItemOnLine также и на Word = true
                                // т.к. оператор идет в начале строки, то соответственно слово в стоке не будет первым, если в строке больше одного оператора
                                if(bNoOneBreakOperator == false || Word == true)
                                    FirstItemOnLine = false;

                            }
                        }
                        else   // оператор "после" => оператор находится в конце строки
                        {
                            bOverXEnd = X + WordLen + BrkLen - Item.GapRight > XEnd;
                            bOverXEndMWordLarge = bOverXEnd;

                            if(bOverXEnd && FirstItemOnLine === false) // Слово не убирается в отрезке. Переносим слово в следующий отрезок
                            {
                                MoveToLBP = true;
                                NewRange = true;

                                if(Word == false)
                                    PRS.Set_LineBreakPos(Pos);
                            }
                            else
                            {
                                bInsideOper = true;

                                // осуществляем здесь, чтобы не изменить GapRight в случае, когда новое слово не убирается на break_Operator
                                OperGapRight = Item.GapRight;

                                if(bOverXEndMWordLarge == true) // FirstItemOnLine == true
                                {
                                    bMathWordLarge = true;

                                }

                                X += BrkLen + WordLen;

                                EmptyLine = false;
                                SpaceLen = 0;
                                WordLen = 0;

                                var bNotUpdate = bOverXEnd == true && PRS.bBreakPosInLWord == false;

                                // FirstItemOnLine == true
                                if(bNotUpdate == false) // LineBreakPos обновляем здесь, т.к. слово может начаться с мат объекта, а не с Run, в мат объекте нет соответствующей проверки
                                {
                                    PRS.Set_LineBreakPos(Pos+1);
                                }
                                else
                                {
                                    bNotUpdBreakOper = true;
                                }

                                FirstItemOnLine = false;

                                Word = false;

                            }
                        }
                    }

                    if(bNotUpdBreakOper == false)
                        bNoOneBreakOperator = false;

                    break;
                }
                case para_Drawing:
                {
                    if(oSectionPr === undefined)
                    {
                        oSectionPr = Para.Get_SectPr();
                    }
                    Item.CheckRecalcAutoFit(oSectionPr);
                    if (true === Item.Is_Inline() || true === Para.Parent.Is_DrawingShape())
                    {
                        if (true !== Item.Is_Inline())
                            Item.Set_DrawingType(drawing_Inline);

                        if (true === StartWord)
                            FirstItemOnLine = false;

                        Item.YOffset = this.YOffset;

                        // Если до этого было слово, тогда не надо проверять убирается ли оно, но если стояли пробелы,
                        // тогда мы их учитываем при проверке убирается ли данный элемент, и добавляем только если
                        // данный элемент убирается
                        if (true === Word || WordLen > 0)
                        {
                            // Добавляем длину пробелов до слова + длина самого слова. Не надо проверять
                            // убирается ли слово, мы это проверяем при добавленнии букв.
                            X += SpaceLen + WordLen;

                            Word = false;
                            EmptyLine = false;
                            SpaceLen = 0;
                            WordLen = 0;
                        }

                        var DrawingWidth = Item.Get_Width();
                        if (X + SpaceLen + DrawingWidth > XEnd && ( false === FirstItemOnLine || false === Para.Internal_Check_Ranges(ParaLine, ParaRange) ))
                        {
                            // Автофигура не убирается, ставим перенос перед ней
                            NewRange = true;
                            RangeEndPos = Pos;
                        }
                        else
                        {
                            // Добавляем длину пробелов до автофигуры
                            X += SpaceLen + DrawingWidth;

                            FirstItemOnLine = false;
                            EmptyLine = false;
                        }

                        SpaceLen = 0;
                    }
                    else
                    {
                        // Основная обработка происходит в Recalculate_Range_Spaces. Здесь обрабатывается единственный случай,
                        // когда после второго пересчета с уже добавленной картинкой оказывается, что место в параграфе, где
                        // идет картинка ушло на следующую страницу. В этом случае мы ставим перенос страницы перед картинкой.

                        var LogicDocument = Para.Parent;
                        var LDRecalcInfo = LogicDocument.RecalcInfo;
                        var DrawingObjects = LogicDocument.DrawingObjects;
                        var CurPage = PRS.Page;

                        if (true === LDRecalcInfo.Check_FlowObject(Item) && true === LDRecalcInfo.Is_PageBreakBefore())
                        {
                            LDRecalcInfo.Reset();

                            // Добавляем разрыв страницы. Если это первая страница, тогда ставим разрыв страницы в начале параграфа,
                            // если нет, тогда в начале текущей строки.

                            if (null != Para.Get_DocumentPrev() && true != Para.Parent.Is_TableCellContent() && 0 === CurPage)
                            {
                                Para.Recalculate_Drawing_AddPageBreak(0, 0, true);
                                PRS.RecalcResult = recalcresult_NextPage;
                                PRS.NewRange = true;
                                return;
                            }
                            else
                            {
                                if (ParaLine != Para.Pages[CurPage].FirstLine)
                                {
                                    Para.Recalculate_Drawing_AddPageBreak(ParaLine, CurPage, false);
                                    PRS.RecalcResult = recalcresult_NextPage;
                                    PRS.NewRange = true;
                                    return;
                                }
                                else
                                {
                                    RangeEndPos = Pos;
                                    NewRange = true;
                                    ForceNewPage = true;
                                }
                            }


                            // Если до этого было слово, тогда не надо проверять убирается ли оно
                            if (true === Word || WordLen > 0)
                            {
                                // Добавляем длину пробелов до слова + длина самого слова. Не надо проверять
                                // убирается ли слово, мы это проверяем при добавленнии букв.
                                X += SpaceLen + WordLen;

                                Word = false;
                                SpaceLen = 0;

                                WordLen = 0;
                            }
                        }
                    }

                    break;
                }
                case para_PageNum:
                {
                    // Выставляем номер страницы

                    var LogicDocument = Para.LogicDocument;
                    var SectionPage = LogicDocument.Get_SectionPageNumInfo2(Para.Get_AbsolutePage(PRS.Page)).CurPage;

                    Item.Set_Page(SectionPage);

                    // Если до этого было слово, тогда не надо проверять убирается ли оно, но если стояли пробелы,
                    // тогда мы их учитываем при проверке убирается ли данный элемент, и добавляем только если
                    // данный элемент убирается
                    if (true === Word || WordLen > 0)
                    {
                        // Добавляем длину пробелов до слова + длина самого слова. Не надо проверять
                        // убирается ли слово, мы это проверяем при добавленнии букв.
                        X += SpaceLen + WordLen;

                        Word = false;
                        EmptyLine = false;
                        SpaceLen = 0;
                        WordLen = 0;
                    }

                    // Если на строке начиналось какое-то слово, тогда данная строка уже не пустая
                    if (true === StartWord)
                        FirstItemOnLine = false;

                    var PageNumWidth = Item.Get_Width();
                    if (X + SpaceLen + PageNumWidth > XEnd && ( false === FirstItemOnLine || false === Para.Internal_Check_Ranges(ParaLine, ParaRange) ))
                    {
                        // Данный элемент не убирается, ставим перенос перед ним
                        NewRange = true;
                        RangeEndPos = Pos;
                    }
                    else
                    {
                        // Добавляем длину пробелов до слова и ширину данного элемента
                        X += SpaceLen + PageNumWidth;

                        FirstItemOnLine = false;
                        EmptyLine = false;
                    }

                    SpaceLen = 0;

                    break;
                }
                case para_Tab:
                {
                    // Сначала проверяем, если у нас уже есть таб, которым мы должны рассчитать, тогда высчитываем
                    // его ширину.

                    X = this.Internal_Recalculate_LastTab(PRS.LastTab, X, XEnd, Word, WordLen, SpaceLen);

                    // Добавляем длину пробелов до слова + длина самого слова. Не надо проверять
                    // убирается ли слово, мы это проверяем при добавленнии букв.
                    X += SpaceLen + WordLen;
                    Word = false;
                    SpaceLen = 0;
                    WordLen = 0;

                    var TabPos = Para.private_RecalculateGetTabPos(X, ParaPr, PRS.Page);
                    var NewX = TabPos.NewX;
                    var TabValue = TabPos.TabValue;

                    // Если таб не левый, значит он не может быть сразу рассчитан, а если левый, тогда
                    // рассчитываем его сразу здесь
                    if (tab_Left !== TabValue)
                    {
                        PRS.LastTab.TabPos = NewX;
                        PRS.LastTab.Value = TabValue;
                        PRS.LastTab.X = X;
                        PRS.LastTab.Item = Item;

                        Item.Width = 0;
                        Item.WidthVisible = 0;
                    }
                    else
                    {
                        if (true !== TabPos.DefaultTab && NewX > XEnd - 0.001 && XEnd < 558.7 && PRS.Range >= PRS.RangesCount - 1)
                        {
                            Para.Lines[PRS.Line].Ranges[PRS.Range].XEnd = 558.7;
                            XEnd = 558.7;
                            PRS.BadLeftTab = true;
                        }

                        if (NewX > XEnd && ( false === FirstItemOnLine || false === Para.Internal_Check_Ranges(ParaLine, ParaRange) ))
                        {
                            WordLen = NewX - X;
                            RangeEndPos = Pos;
                            NewRange = true;
                        }
                        else
                        {
                            Item.Width = NewX - X;
                            Item.WidthVisible = NewX - X;

                            X = NewX;
                        }
                    }

                    // Если перенос идет по строке, а не из-за обтекания, тогда разрываем перед табом, а если
                    // из-за обтекания, тогда разрываем перед последним словом, идущим перед табом
                    if (RangesCount === CurRange)
                    {
                        if (true === StartWord)
                        {
                            FirstItemOnLine = false;
                            EmptyLine = false;
                        }
                    }

                    // Считаем, что с таба начинается слово
                    PRS.Set_LineBreakPos(Pos);

                    StartWord = true;
                    Word = true;

                    break;
                }
                case para_NewLine:
                {
                    // Сначала проверяем, если у нас уже есть таб, которым мы должны рассчитать, тогда высчитываем
                    // его ширину.
                    X = this.Internal_Recalculate_LastTab(PRS.LastTab, X, XEnd, Word, WordLen, SpaceLen);

                    X += WordLen;

                    if (true === Word)
                    {
                        EmptyLine = false;
                        Word = false;
                        X += SpaceLen;
                        SpaceLen = 0;
                    }

                    if (break_Page === Item.BreakType || break_Column === Item.BreakType)
                    {
                        PRS.BreakPageLine = true;
                        if (break_Page === Item.BreakType)
                            PRS.BreakRealPageLine = true;

                        if (true === Para.Check_BreakPageEnd(Item))
                            continue;

                        Item.Flags.NewLine = true;

                        // PageBreak вне самого верхнего документа не надо учитывать
                        if (!(Para.Parent instanceof CDocument) || true !== Para.Is_Inline())
                        {
                            // TODO: Продумать, как избавиться от данного элемента, т.к. удалять его при пересчете нельзя,
                            //       иначе будут проблемы с совместным редактированием.

                            Item.Flags.Use = false;
                            continue;
                        }

                        NewPage       = true;
                        NewRange      = true;
                    }
                    else
                    {
                        NewRange = true;
                        EmptyLine = false;

                        // здесь оставляем проверку, т.к. в случае, если после неинлайновой формулы нах-ся инлайновая необходимо в любом случае сделать перенос (проверка в private_RecalculateRange(), где выставляется PRS.ForceNewLine = true не пройдет)
                        if (true === PRS.MathNotInline)
                            PRS.ForceNewLine = true;
                    }

                    RangeEndPos = Pos + 1;

                    break;
                }
                case para_End:
                {
                    if (true === Word)
                    {
                        FirstItemOnLine = false;
                        EmptyLine       = false;
                    }

                    X += WordLen;

                    if (true === Word)
                    {
                        X += SpaceLen;
                        SpaceLen = 0;
                        WordLen  = 0;
                    }

                    X = this.Internal_Recalculate_LastTab(PRS.LastTab, X, XEnd, Word, WordLen, SpaceLen);

                    NewRange = true;
                    End      = true;

                    RangeEndPos = Pos + 1;

                    break;
                }
            }


            if (true === NewRange)
                break;
        }
    }


    PRS.MoveToLBP       = MoveToLBP;
    PRS.NewRange        = NewRange;
    PRS.ForceNewPage    = ForceNewPage;
    PRS.NewPage         = NewPage;
    PRS.End             = End;

    PRS.Word            = Word;
    PRS.StartWord       = StartWord;
    PRS.FirstItemOnLine = FirstItemOnLine;
    PRS.EmptyLine       = EmptyLine;

    PRS.SpaceLen        = SpaceLen;
    PRS.WordLen         = WordLen;
    PRS.bMathWordLarge  = bMathWordLarge;
    PRS.OperGapRight    = OperGapRight;
    PRS.OperGapLeft     = OperGapLeft;

    PRS.X               = X;
    PRS.XEnd            = XEnd;

    PRS.bInsideOper         = bInsideOper;
    PRS.bContainCompareOper = bContainCompareOper;
    PRS.bEndRunToContent    = bEndRunToContent;
    PRS.bNoOneBreakOperator = bNoOneBreakOperator;
    PRS.bForcedBreak        = bForcedBreak;


    if(this.Type == para_Math_Run)
    {
        if(true === NewRange)
        {
            var WidthLine = X - XRange;

            if(this.ParaMath.Is_BrkBinBefore() == false)
                WidthLine += SpaceLen;

            this.ParaMath.UpdateWidthLine(PRS, WidthLine);
        }
        else
        {
            // для пустого Run, обновляем LineBreakPos на случай, если пустой Run находится между break_operator (мат. объект) и мат объектом
            if(this.Content.length == 0)
            {
                if(PRS.bForcedBreak == true)
                {
                    PRS.MoveToLBP = true;
                    PRS.NewRange = true;
                    PRS.Set_LineBreakPos(0);
                }
                else if(this.ParaMath.Is_BrkBinBefore() == false && Word == false && PRS.bBreakBox == true)
                {
                    PRS.Set_LineBreakPos(Pos);
                    PRS.X += SpaceLen;
                    PRS.SpaceLen = 0;
                }
            }

            // запоминаем конец Run
            PRS.PosEndRun.Set(PRS.CurPos);
            PRS.PosEndRun.Update2(this.Content.length, Depth);

        }
    }

    if ( Pos >= ContentLen )
    {
        RangeEndPos = Pos;
    }

    this.protected_FillRange(CurLine, CurRange, RangeStartPos, RangeEndPos);

    this.RecalcInfo.Recalc = false;
};

ParaRun.prototype.Recalculate_Set_RangeEndPos = function(PRS, PRP, Depth)
{
    var CurLine  = PRS.Line - this.StartLine;
    var CurRange = ( 0 === CurLine ? PRS.Range - this.StartRange : PRS.Range );
    var CurPos   = PRP.Get(Depth);

    this.protected_FillRangeEndPos(CurLine, CurRange, CurPos);
};

ParaRun.prototype.Recalculate_LineMetrics = function(PRS, ParaPr, _CurLine, _CurRange, ContentMetrics)
{
    var Para = PRS.Paragraph;

    // Если заданный отрезок пустой, тогда мы не должны учитывать метрики данного рана.

    var CurLine  = _CurLine - this.StartLine;
    var CurRange = ( 0 === CurLine ? _CurRange - this.StartRange : _CurRange );

    var StartPos = this.protected_GetRangeStartPos(CurLine, CurRange);
    var EndPos   = this.protected_GetRangeEndPos(CurLine, CurRange);

    var UpdateLineMetricsText = false;
    var LineRule = ParaPr.Spacing.LineRule;

    for (var CurPos = StartPos; CurPos < EndPos; CurPos++)
    {
        var Item = this.Content[CurPos];

        if (Item === Para.Numbering.Item)
        {
            PRS.LineAscent = Para.Numbering.LineAscent;
        }

        switch (Item.Type)
        {
            case para_Sym:
            case para_Text:
            case para_PageNum:
            {
                UpdateLineMetricsText = true;
                break;
            }
            case para_Math_Text:
            case para_Math_Ampersand:
            case para_Math_Placeholder:
            case para_Math_BreakOperator:
            {
                ContentMetrics.UpdateMetrics(Item.size);
                
                break;
            }
            case para_Space:
            {
                break;
            }
            case para_Drawing:
            {
                if (true === Item.Is_Inline() || true === Para.Parent.Is_DrawingShape())
                {
                    // Обновим метрики строки
                    if (linerule_Exact === LineRule)
                    {
                        if (PRS.LineAscent < Item.Height)
                            PRS.LineAscent = Item.Height;
                    }
                    else
                    {
                        if (PRS.LineAscent < Item.Height + this.YOffset)
                            PRS.LineAscent = Item.Height + this.YOffset;

                        if (PRS.LineDescent < -this.YOffset)
                            PRS.LineDescent = -this.YOffset;
                    }
                }

                break;
            }

            case para_End:
            {
                // TODO: Тут можно сделать проверку на пустую строку.
                break;
            }
        }
    }

    if ( true === UpdateLineMetricsText)
    {
        // Пересчитаем метрику строки относительно размера данного текста
        if ( PRS.LineTextAscent < this.TextAscent )
            PRS.LineTextAscent = this.TextAscent;

        if ( PRS.LineTextAscent2 < this.TextAscent2 )
            PRS.LineTextAscent2 = this.TextAscent2;

        if ( PRS.LineTextDescent < this.TextDescent )
            PRS.LineTextDescent = this.TextDescent;

        if ( linerule_Exact === LineRule )
        {
            // Смещение не учитывается в метриках строки, когда расстояние между строк точное
            if ( PRS.LineAscent < this.TextAscent )
                PRS.LineAscent = this.TextAscent;

            if ( PRS.LineDescent < this.TextDescent )
                PRS.LineDescent = this.TextDescent;
        }
        else
        {
            if ( PRS.LineAscent < this.TextAscent + this.YOffset  )
                PRS.LineAscent = this.TextAscent + this.YOffset;

            if ( PRS.LineDescent < this.TextDescent - this.YOffset )
                PRS.LineDescent = this.TextDescent - this.YOffset;
        }
    }
};

ParaRun.prototype.Recalculate_Range_Width = function(PRSC, _CurLine, _CurRange)
{
    var CurLine  = _CurLine - this.StartLine;
    var CurRange = ( 0 === CurLine ? _CurRange - this.StartRange : _CurRange );

    var StartPos = this.protected_GetRangeStartPos(CurLine, CurRange);
    var EndPos   = this.protected_GetRangeEndPos(CurLine, CurRange);

    for ( var Pos = StartPos; Pos < EndPos; Pos++ )
    {
        var Item = this.Content[Pos];
        var ItemType = Item.Type;

        switch( ItemType )
        {
            case para_Sym:
            case para_Text:
            {
                PRSC.Letters++;

                if ( true !== PRSC.Word )
                {
                    PRSC.Word = true;
                    PRSC.Words++;
                }

                PRSC.Range.W += Item.Width / TEXTWIDTH_DIVIDER;//Item.Get_Width();
                PRSC.Range.W += PRSC.SpaceLen;

                PRSC.SpaceLen = 0;

                // Пробелы перед первым словом в строке не считаем
                if (PRSC.Words > 1)
                    PRSC.Spaces += PRSC.SpacesCount;
                else
                    PRSC.SpacesSkip += PRSC.SpacesCount;

                PRSC.SpacesCount = 0;

                // Если текущий символ, например, дефис, тогда на нем заканчивается слово
                if (Item.Flags & PARATEXT_FLAGS_SPACEAFTER)//if ( true === Item.Is_SpaceAfter() )
                    PRSC.Word = false;

                break;
            }
            case para_Math_Text:
            case para_Math_Placeholder:
            case para_Math_Ampersand:
            case para_Math_BreakOperator:
            {
                PRSC.Letters++;

                PRSC.Range.W += Item.Get_Width() / TEXTWIDTH_DIVIDER; // Get_Width рассчитываем ширину с учетом состояний Gaps
                break;
            }
            case para_Space:
            {
                if ( true === PRSC.Word )
                {
                    PRSC.Word        = false;
                    PRSC.SpacesCount = 1;
                    PRSC.SpaceLen    = Item.Width / TEXTWIDTH_DIVIDER;//Item.Get_Width();
                }
                else
                {
                    PRSC.SpacesCount++;
                    PRSC.SpaceLen += Item.Width / TEXTWIDTH_DIVIDER;//Item.Get_Width();
                }

                break;
            }
            case para_Drawing:
            {
                PRSC.Words++;
                PRSC.Range.W += PRSC.SpaceLen;

                if (PRSC.Words > 1)
                    PRSC.Spaces += PRSC.SpacesCount;
                else
                    PRSC.SpacesSkip += PRSC.SpacesCount;

                PRSC.Word        = false;
                PRSC.SpacesCount = 0;
                PRSC.SpaceLen    = 0;

                if ( true === Item.Is_Inline() || true === PRSC.Paragraph.Parent.Is_DrawingShape() )
                    PRSC.Range.W += Item.Get_Width();

                break;
            }
            case para_PageNum:
            {
                PRSC.Words++;
                PRSC.Range.W += PRSC.SpaceLen;

                if (PRSC.Words > 1)
                    PRSC.Spaces += PRSC.SpacesCount;
                else
                    PRSC.SpacesSkip += PRSC.SpacesCount;

                PRSC.Word        = false;
                PRSC.SpacesCount = 0;
                PRSC.SpaceLen    = 0;

                PRSC.Range.W += Item.Get_Width();

                break;
            }
            case para_Tab:
            {
                PRSC.Range.W += Item.Get_Width();
                PRSC.Range.W += PRSC.SpaceLen;

                // Учитываем только слова и пробелы, идущие после последнего таба

                PRSC.LettersSkip += PRSC.Letters;
                PRSC.SpacesSkip  += PRSC.Spaces;

                PRSC.Words   = 0;
                PRSC.Spaces  = 0;
                PRSC.Letters = 0;

                PRSC.SpaceLen    = 0;
                PRSC.SpacesCount = 0;
                PRSC.Word        = false;

                break;
            }

            case para_NewLine:
            {
                if (true === PRSC.Word && PRSC.Words > 1)
                    PRSC.Spaces += PRSC.SpacesCount;

                PRSC.SpacesCount = 0;
                PRSC.Word        = false;

                break;
            }
            case para_End:
            {
                if ( true === PRSC.Word )
                    PRSC.Spaces += PRSC.SpacesCount;

                break;
            }
        }
    }
};

ParaRun.prototype.Recalculate_Range_Spaces = function(PRSA, _CurLine, _CurRange, CurPage)
{
    var CurLine  = _CurLine - this.StartLine;
    var CurRange = ( 0 === CurLine ? _CurRange - this.StartRange : _CurRange );

    var StartPos = this.protected_GetRangeStartPos(CurLine, CurRange);
    var EndPos   = this.protected_GetRangeEndPos(CurLine, CurRange);

    for ( var Pos = StartPos; Pos < EndPos; Pos++ )
    {
        var Item = this.Content[Pos];
        var ItemType = Item.Type;

        switch( ItemType )
        {
            case para_Sym:
            case para_Text:
            {
                var WidthVisible = 0;

                if ( 0 !== PRSA.LettersSkip )
                {
                    WidthVisible = Item.Width / TEXTWIDTH_DIVIDER;//WidthVisible = Item.Get_Width();
                    PRSA.LettersSkip--;
                }
                else
                    WidthVisible = Item.Width / TEXTWIDTH_DIVIDER + PRSA.JustifyWord;//WidthVisible = Item.Get_Width() + PRSA.JustifyWord;

                Item.WidthVisible = (WidthVisible * TEXTWIDTH_DIVIDER) | 0;//Item.Set_WidthVisible(WidthVisible);

                PRSA.X    += WidthVisible;
                PRSA.LastW = WidthVisible;

                break;
            }
            case para_Math_Text:
            case para_Math_Placeholder:
            case para_Math_BreakOperator:
            case para_Math_Ampersand:
            {
                var WidthVisible = Item.Get_Width() / TEXTWIDTH_DIVIDER; // Get_Width рассчитываем ширину с учетом состояний Gaps
                Item.WidthVisible = (WidthVisible * TEXTWIDTH_DIVIDER)| 0;//Item.Set_WidthVisible(WidthVisible);

                PRSA.X    += WidthVisible;
                PRSA.LastW = WidthVisible;

                break;
            }
            case para_Space:
            {
                var WidthVisible = Item.Width / TEXTWIDTH_DIVIDER;//WidthVisible = Item.Get_Width();

                if ( 0 !== PRSA.SpacesSkip )
                {
                    PRSA.SpacesSkip--;
                }
                else if ( 0 !== PRSA.SpacesCounter )
                {
                    WidthVisible += PRSA.JustifySpace;
                    PRSA.SpacesCounter--;
                }

                Item.WidthVisible = (WidthVisible * TEXTWIDTH_DIVIDER) | 0;//Item.Set_WidthVisible(WidthVisible);

                PRSA.X    += WidthVisible;
                PRSA.LastW = WidthVisible;

                break;
            }
            case para_Drawing:
            {
                var Para = PRSA.Paragraph;
                var PageAbs = Para.private_GetAbsolutePageIndex(CurPage);
                var PageRel = Para.private_GetRelativePageIndex(CurPage);

                var LogicDocument = this.Paragraph.LogicDocument;
                var LD_PageLimits = LogicDocument.Get_PageLimits(PageAbs);
                var LD_PageFields = LogicDocument.Get_PageFields(PageAbs);

                var Page_Width  = LD_PageLimits.XLimit;
                var Page_Height = LD_PageLimits.YLimit;

                var X_Left_Field   = LD_PageFields.X;
                var Y_Top_Field    = LD_PageFields.Y;
                var X_Right_Field  = LD_PageFields.XLimit;
                var Y_Bottom_Field = LD_PageFields.YLimit;

                var X_Left_Margin   = X_Left_Field;
                var X_Right_Margin  = Page_Width  - X_Right_Field;
                var Y_Bottom_Margin = Page_Height - Y_Bottom_Field;
                var Y_Top_Margin    = Y_Top_Field;

                var DrawingObjects = Para.Parent.DrawingObjects;
                var PageLimits     = Para.Parent.Get_PageLimits(PageRel);
                var PageFields     = Para.Parent.Get_PageFields(PageRel);

                var ColumnStartX = (0 === CurPage ? Para.X_ColumnStart : Para.Pages[CurPage].X     );
                var ColumnEndX   = (0 === CurPage ? Para.X_ColumnEnd   : Para.Pages[CurPage].XLimit);

                var Top_Margin    = Y_Top_Margin;
                var Bottom_Margin = Y_Bottom_Margin;
                var Page_H        = Page_Height;

                if ( true === Para.Parent.Is_TableCellContent() && true == Item.Use_TextWrap() )
                {
                    Top_Margin    = 0;
                    Bottom_Margin = 0;
                    Page_H        = 0;
                }

                var PageLimitsOrigin = Para.Parent.Get_PageLimits(PageRel);
                if (true === Para.Parent.Is_TableCellContent() && false === Item.Is_LayoutInCell())
                {
                    PageLimitsOrigin = LogicDocument.Get_PageLimits(PageAbs);
                }

                if ( true != Item.Use_TextWrap() )
                {
                    PageFields.X      = X_Left_Field;
                    PageFields.Y      = Y_Top_Field;
                    PageFields.XLimit = X_Right_Field;
                    PageFields.YLimit = Y_Bottom_Field;

                    PageLimits.X = 0;
                    PageLimits.Y = 0;
                    PageLimits.XLimit = Page_Width;
                    PageLimits.YLimit = Page_Height;
                }

                if ( true === Item.Is_Inline() || true === Para.Parent.Is_DrawingShape() )
                {
                    Item.Update_Position(PRSA.Paragraph, new CParagraphLayout( PRSA.X, PRSA.Y , PageAbs, PRSA.LastW, ColumnStartX, ColumnEndX, X_Left_Margin, X_Right_Margin, Page_Width, Top_Margin, Bottom_Margin, Page_H, PageFields.X, PageFields.Y, Para.Pages[CurPage].Y + Para.Lines[CurLine].Y - Para.Lines[CurLine].Metrics.Ascent, Para.Pages[CurPage].Y), PageLimits, PageLimitsOrigin, _CurLine);
                    Item.Reset_SavedPosition();

                    PRSA.X    += Item.WidthVisible;
                    PRSA.LastW = Item.WidthVisible;
                }
                else
                {
                    Para.Pages[CurPage].Add_Drawing(Item);

                    if ( true === PRSA.RecalcFast )
                    {
                        // Если у нас быстрый пересчет, тогда мы не трогаем плавающие картинки
                        // TODO: Если здесь привязка к символу, тогда быстрый пересчет надо отменить
                        break;
                    }

                    if (true === PRSA.RecalcFast2)
                    {
                        // Тут мы должны сравнить положение картинок
                        var oRecalcObj = Item.Save_RecalculateObject();
                        Item.Update_Position(PRSA.Paragraph, new CParagraphLayout( PRSA.X, PRSA.Y , PageAbs, PRSA.LastW, ColumnStartX, ColumnEndX, X_Left_Margin, X_Right_Margin, Page_Width, Top_Margin, Bottom_Margin, Page_H, PageFields.X, PageFields.Y, Para.Pages[CurPage].Y + Para.Lines[CurLine].Y - Para.Lines[CurLine].Metrics.Ascent, Para.Pages[CurPage].Y), PageLimits, PageLimitsOrigin, _CurLine);

                        if (Math.abs(Item.X - oRecalcObj.X) > 0.001 || Math.abs(Item.Y - oRecalcObj.Y) > 0.001 || Item.PageNum !== oRecalcObj.PageNum)
                        {
                            // Положение картинок не совпало, отправляем пересчет текущей страницы.
                            PRSA.RecalcResult = recalcresult_CurPage | recalcresultflags_Page;
                            return;
                        }

                        break;
                    }

                    // У нас Flow-объект. Если он с обтеканием, тогда мы останавливаем пересчет и
                    // запоминаем текущий объект. В функции Internal_Recalculate_2 пересчитываем
                    // его позицию и сообщаем ее внешнему классу.

                    if ( true === Item.Use_TextWrap() )
                    {
                        var LogicDocument = Para.Parent;
                        var LDRecalcInfo  = Para.Parent.RecalcInfo;
                        if ( true === LDRecalcInfo.Can_RecalcObject() )
                        {
                            // Обновляем позицию объекта
                            Item.Update_Position(PRSA.Paragraph, new CParagraphLayout( PRSA.X, PRSA.Y , PageAbs, PRSA.LastW, ColumnStartX, ColumnEndX, X_Left_Margin, X_Right_Margin, Page_Width, Top_Margin, Bottom_Margin, Page_H, PageFields.X, PageFields.Y, Para.Pages[CurPage].Y + Para.Lines[CurLine].Y - Para.Lines[CurLine].Metrics.Ascent, Para.Pages[CurPage].Y), PageLimits, PageLimitsOrigin, _CurLine);
                            LDRecalcInfo.Set_FlowObject( Item, 0, recalcresult_NextElement, -1 );

                            // TODO: Добавить проверку на не попадание в предыдущие колонки
                            if (0 === PRSA.CurPage && Item.wrappingPolygon.top > PRSA.PageY + 0.001 && Item.wrappingPolygon.left > PRSA.PageX + 0.001)
                                PRSA.RecalcResult = recalcresult_CurPagePara;
                            else
                                PRSA.RecalcResult = recalcresult_CurPage | recalcresultflags_Page;

                            return;
                        }
                        else if ( true === LDRecalcInfo.Check_FlowObject(Item) )
                        {
                            // Если мы находимся с таблице, тогда делаем как Word, не пересчитываем предыдущую страницу,
                            // даже если это необходимо. Такое поведение нужно для точного определения рассчиталась ли
                            // данная страница окончательно или нет. Если у нас будет ветка с переходом на предыдущую страницу,
                            // тогда не рассчитав следующую страницу мы о конечном рассчете текущей страницы не узнаем.

                            // Если данный объект нашли, значит он уже был рассчитан и нам надо проверить номер страницы.
                            // Заметим, что даже если картинка привязана к колонке, и после пересчета место привязки картинки
                            // сдвигается в следующую колонку, мы проверяем все равно только реальную страницу (без
                            // учета колонок, так делает и Word).
                            if ( Item.PageNum === PageAbs )
                            {
                                // Все нормально, можно продолжить пересчет
                                LDRecalcInfo.Reset();
                                Item.Reset_SavedPosition();
                            }
                            else if ( true === Para.Parent.Is_TableCellContent() )
                            {
                                // Картинка не на нужной странице, но так как это таблица
                                // мы пересчитываем заново текущую страницу, а не предыдущую

                                // Обновляем позицию объекта
                                Item.Update_Position(PRSA.Paragraph, new CParagraphLayout( PRSA.X, PRSA.Y, PageAbs, PRSA.LastW, ColumnStartX, ColumnEndX, X_Left_Margin, X_Right_Margin, Page_Width, Top_Margin, Bottom_Margin, Page_H, PageFields.X, PageFields.Y, Para.Pages[CurPage].Y + Para.Lines[CurLine].Y - Para.Lines[CurLine].Metrics.Ascent, Para.Pages[CurPage].Y), PageLimits, PageLimitsOrigin, _CurLine);

                                LDRecalcInfo.Set_FlowObject( Item, 0, recalcresult_NextElement, -1 );
                                LDRecalcInfo.Set_PageBreakBefore( false );
                                PRSA.RecalcResult = recalcresult_CurPage | recalcresultflags_Page;
                                return;
                            }
                            else
                            {
                                LDRecalcInfo.Set_PageBreakBefore( true );
                                DrawingObjects.removeById( Item.PageNum, Item.Get_Id() );
                                PRSA.RecalcResult = recalcresult_PrevPage | recalcresultflags_Page;
                                return;
                            }
                        }
                        else
                        {
                            // Либо данный элемент уже обработан, либо будет обработан в будущем
                        }

                        continue;
                    }
                    else
                    {
                        // Картинка ложится на или под текст, в данном случае пересчет можно спокойно продолжать
                        // Здесь под верхом параграфа понимаем верх первой строки, а не значение, с которого начинается пересчет.
                        var ParagraphTop = Para.Lines[Para.Pages[CurPage].StartLine].Top + Para.Pages[CurPage].Y;
                        Item.Update_Position(PRSA.Paragraph, new CParagraphLayout( PRSA.X, PRSA.Y , PageAbs, PRSA.LastW, ColumnStartX, ColumnEndX, X_Left_Margin, X_Right_Margin, Page_Width, Top_Margin, Bottom_Margin, Page_H, PageFields.X, PageFields.Y, Para.Pages[CurPage].Y + Para.Lines[CurLine].Y - Para.Lines[CurLine].Metrics.Ascent, ParagraphTop), PageLimits, PageLimitsOrigin, _CurLine);
                        Item.Reset_SavedPosition();
                    }
                }


                break;
            }
            case para_PageNum:
            {
                PRSA.X    += Item.WidthVisible;
                PRSA.LastW = Item.WidthVisible;

                break;
            }
            case para_Tab:
            {
                PRSA.X += Item.WidthVisible;

                break;
            }
            case para_End:
            {
                var SectPr = PRSA.Paragraph.Get_SectionPr();
                if (!PRSA.Paragraph.LogicDocument || PRSA.Paragraph.LogicDocument !== PRSA.Paragraph.Parent)
                    SectPr = undefined;

                if ( undefined !== SectPr )
                {
                    // Нас интересует следующая секция
                    var LogicDocument = PRSA.Paragraph.LogicDocument;
                    var NextSectPr = LogicDocument.SectionsInfo.Get_SectPr(PRSA.Paragraph.Index + 1).SectPr;

                    Item.Update_SectionPr(NextSectPr, PRSA.XEnd - PRSA.X);
                }
                else
                    Item.Clear_SectionPr();

                PRSA.X += Item.Get_Width();

                break;
            }
            case para_NewLine:
            {
                if (break_Page === Item.BreakType || break_Column === Item.BreakType)
                    Item.Update_String( PRSA.XEnd - PRSA.X );

                PRSA.X += Item.WidthVisible;

                break;
            }
        }
    }
};

ParaRun.prototype.Recalculate_PageEndInfo = function(PRSI, _CurLine, _CurRange)
{
};

ParaRun.prototype.private_RecalculateNumbering = function(PRS, Item, ParaPr, _X)
{
    var X = PRS.Recalculate_Numbering(Item, this, ParaPr, _X);

    // Запоминаем, что на данном элементе была добавлена нумерация
    this.RecalcInfo.NumberingAdd  = false;
    this.RecalcInfo.NumberingUse  = true;
    this.RecalcInfo.NumberingItem = PRS.Paragraph.Numbering;

    return X;
};

ParaRun.prototype.Internal_Recalculate_LastTab = function(LastTab, X, XEnd, Word, WordLen, SpaceLen)
{
    if ( -1 !== LastTab.Value )
    {
        var TempXPos = X;

        if ( true === Word || WordLen > 0 )
            TempXPos += SpaceLen + WordLen;

        var TabItem   = LastTab.Item;
        var TabStartX = LastTab.X;
        var TabRangeW = TempXPos - TabStartX;
        var TabValue  = LastTab.Value;
        var TabPos    = LastTab.TabPos;

        var TabCalcW = 0;
        if ( tab_Right === TabValue )
            TabCalcW = Math.max( TabPos - (TabStartX + TabRangeW), 0 );
        else if ( tab_Center === TabValue )
            TabCalcW = Math.max( TabPos - (TabStartX + TabRangeW / 2), 0 );

        if ( X + TabCalcW > XEnd )
            TabCalcW = XEnd - X;

        TabItem.Width        = TabCalcW;
        TabItem.WidthVisible = TabCalcW;

        LastTab.Reset();

        return X + TabCalcW;
    }

    return X;
};

ParaRun.prototype.Refresh_RecalcData = function(Data)
{
    var Para = this.Paragraph;

    if(this.Type == para_Math_Run)
    {
        if(this.Parent !== null && this.Parent !== undefined)
        {
            this.Parent.Refresh_RecalcData();
        }
    }
    else if ( -1 !== this.StartLine && undefined !== Para )
    {
        var CurLine = this.StartLine;

        var PagesCount = Para.Pages.length;
        for (var CurPage = 0 ; CurPage < PagesCount; CurPage++ )
        {
            var Page = Para.Pages[CurPage];
            if ( Page.StartLine <= CurLine && Page.EndLine >= CurLine  )
            {
                Para.Refresh_RecalcData2(CurPage);
                return;
            }

        }

        Para.Refresh_RecalcData2(0);
    }
};
ParaRun.prototype.Save_RecalculateObject = function(Copy)
{
    var RecalcObj = new CRunRecalculateObject(this.StartLine, this.StartRange);
    RecalcObj.Save_Lines( this, Copy );
    RecalcObj.Save_RunContent( this, Copy );
    return RecalcObj;
};
ParaRun.prototype.Load_RecalculateObject = function(RecalcObj)
{
    RecalcObj.Load_Lines(this);
    RecalcObj.Load_RunContent(this);
};
ParaRun.prototype.Prepare_RecalculateObject = function()
{
    this.protected_ClearLines();

    var Count = this.Content.length;
    for ( var Index = 0; Index < Count; Index++ )
    {
        var Item = this.Content[Index];
        var ItemType = Item.Type;

        if ( para_PageNum === ItemType || para_Drawing === ItemType )
            Item.Prepare_RecalculateObject();
    }
};
ParaRun.prototype.Is_EmptyRange = function(_CurLine, _CurRange)
{
    var CurLine  = _CurLine - this.StartLine;
    var CurRange = ( 0 === CurLine ? _CurRange - this.StartRange : _CurRange );

    var StartPos = this.protected_GetRangeStartPos(CurLine, CurRange);
    var EndPos   = this.protected_GetRangeEndPos(CurLine, CurRange);

    if ( EndPos <= StartPos )
        return true;

    return false;
};

ParaRun.prototype.Check_Range_OnlyMath = function(Checker, _CurRange, _CurLine)
{
    var CurLine  = _CurLine - this.StartLine;
    var CurRange = ( 0 === CurLine ? _CurRange - this.StartRange : _CurRange );

    var StartPos = this.protected_GetRangeStartPos(CurLine, CurRange);
    var EndPos   = this.protected_GetRangeEndPos(CurLine, CurRange);

    for (var Pos = StartPos; Pos < EndPos; Pos++)
    {
        var Item = this.Content[Pos];
        var ItemType = Item.Type;

        if (para_End === ItemType || para_NewLine === ItemType || (para_Drawing === ItemType && true !== Item.Is_Inline()))
            continue;
        else
        {
            Checker.Result = false;
            Checker.Math   = null;
            break;
        }
    }
};

ParaRun.prototype.Check_MathPara = function(Checker)
{
    var Count = this.Content.length;
    if ( Count <= 0 )
        return;

    var Item = ( Checker.Direction > 0 ? this.Content[0] : this.Content[Count - 1] );
    var ItemType = Item.Type;

    if ( para_End === ItemType || para_NewLine === ItemType )
    {
        Checker.Result = true;
        Checker.Found  = true;
    }
    else
    {
        Checker.Result = false;
        Checker.Found  = true;
    }
};

ParaRun.prototype.Check_PageBreak = function()
{
    var Count = this.Content.length;
    for (var Pos = 0; Pos < Count; Pos++)
    {
        var Item = this.Content[Pos];
        if (para_NewLine === Item.Type && (break_Page === Item.BreakType || break_Column === Item.BreakType))
            return true;
    }

    return false;
};

ParaRun.prototype.Check_BreakPageEnd = function(PBChecker)
{
    var ContentLen = this.Content.length;
    for ( var CurPos = 0; CurPos < ContentLen; CurPos++ )
    {
        var Item = this.Content[CurPos];

        if ( true === PBChecker.FindPB )
        {
            if ( Item === PBChecker.PageBreak )
            {
                PBChecker.FindPB = false;
                PBChecker.PageBreak.Flags.NewLine = true;
            }
        }
        else
        {
            var ItemType = Item.Type;

            if ( para_End === ItemType )
                return true;
            else if ( para_Drawing !== ItemType || drawing_Anchor !== Item.Get_DrawingType() )
                return false;
        }
    }

    return true;
};

ParaRun.prototype.Recalculate_MinMaxContentWidth = function(MinMax)
{
    this.Recalculate_MeasureContent();

    var bWord        = MinMax.bWord;
    var nWordLen     = MinMax.nWordLen;
    var nSpaceLen    = MinMax.nSpaceLen;
    var nMinWidth    = MinMax.nMinWidth;
    var nMaxWidth    = MinMax.nMaxWidth;
    var nCurMaxWidth = MinMax.nCurMaxWidth;
    var nMaxHeight   = MinMax.nMaxHeight;

    var bCheckTextHeight = false;
    var Count = this.Content.length;
    for ( var Pos = 0; Pos < Count; Pos++ )
    {
        var Item = this.Content[Pos];
        var ItemType = Item.Type;

        switch( ItemType )
        {
            case para_Text:
            {
                var ItemWidth = Item.Width / TEXTWIDTH_DIVIDER;//var ItemWidth = Item.Get_Width();
                if ( false === bWord )
                {
                    bWord    = true;
                    nWordLen = ItemWidth;
                }
                else
                {
                    nWordLen += ItemWidth;

                    if (Item.Flags & PARATEXT_FLAGS_SPACEAFTER)
                    {
                        if ( nMinWidth < nWordLen )
                            nMinWidth = nWordLen;

                        bWord    = false;
                        nWordLen = 0;
                    }
                }

                if ( nSpaceLen > 0 )
                {
                    nCurMaxWidth += nSpaceLen;
                    nSpaceLen     = 0;
                }

                nCurMaxWidth += ItemWidth;
                bCheckTextHeight = true;
                break;
            }
            case para_Math_Text:
            case para_Math_Ampersand:
            case para_Math_Placeholder:
            {
                var ItemWidth = Item.Get_Width() / TEXTWIDTH_DIVIDER;
                if ( false === bWord )
                {
                    bWord    = true;
                    nWordLen = ItemWidth;
                }
                else
                {
                    nWordLen += ItemWidth;
                }

                nCurMaxWidth += ItemWidth;
                bCheckTextHeight = true;
                break;
            }
            case para_Space:
            {
                if ( true === bWord )
                {
                    if ( nMinWidth < nWordLen )
                        nMinWidth = nWordLen;

                    bWord    = false;
                    nWordLen = 0;
                }

                // Мы сразу не добавляем ширину пробелов к максимальной ширине, потому что
                // пробелы, идущие в конце параграфа или перед переносом строки(явным), не
                // должны учитываться.
                nSpaceLen += Item.Width / TEXTWIDTH_DIVIDER;//nSpaceLen += Item.Get_Width();
                bCheckTextHeight = true;
                break;
            }
            case para_Math_BreakOperator:
            {
                if ( true === bWord )
                {
                    if ( nMinWidth < nWordLen )
                        nMinWidth = nWordLen;

                    bWord    = false;
                    nWordLen = 0;
                }

                nCurMaxWidth += Item.Get_Width() / TEXTWIDTH_DIVIDER;
                bCheckTextHeight = true;
                break;
            }

            case para_Drawing:
            {
                if ( true === bWord )
                {
                    if ( nMinWidth < nWordLen )
                        nMinWidth = nWordLen;

                    bWord    = false;
                    nWordLen = 0;
                }

                if ((true === Item.Is_Inline() || true === this.Paragraph.Parent.Is_DrawingShape()) && Item.Width > nMinWidth)
                {
                    nMinWidth = Item.Width;
                }
                else if (true === Item.Use_TextWrap())
                {
                    var DrawingW = Item.getXfrmExtX();
                    if (DrawingW > nMinWidth)
                        nMinWidth = DrawingW;
                }

                if ((true === Item.Is_Inline() || true === this.Paragraph.Parent.Is_DrawingShape()) && Item.Height > nMaxHeight)
                {
                    nMaxHeight = Item.Height;
                }
                else if (true === Item.Use_TextWrap())
                {
                    var DrawingH = Item.getXfrmExtY();
                    if (DrawingH > nMaxHeight)
                        nMaxHeight = DrawingH;
                }

                if ( nSpaceLen > 0 )
                {
                    nCurMaxWidth += nSpaceLen;
                    nSpaceLen     = 0;
                }

                if ( true === Item.Is_Inline() || true === this.Paragraph.Parent.Is_DrawingShape() )
                    nCurMaxWidth += Item.Width;

                break;
            }

            case para_PageNum:
            {
                if ( true === bWord )
                {
                    if ( nMinWidth < nWordLen )
                        nMinWidth = nWordLen;

                    bWord    = false;
                    nWordLen = 0;
                }

                if ( Item.Width > nMinWidth )
                    nMinWidth = Item.Width;

                if ( nSpaceLen > 0 )
                {
                    nCurMaxWidth += nSpaceLen;
                    nSpaceLen     = 0;
                }

                nCurMaxWidth += Item.Width;
                bCheckTextHeight = true;
                break;
            }

            case para_Tab:
            {
                nWordLen += Item.Width;

                if ( nMinWidth < nWordLen )
                    nMinWidth = nWordLen;

                bWord    = false;
                nWordLen = 0;

                if ( nSpaceLen > 0 )
                {
                    nCurMaxWidth += nSpaceLen;
                    nSpaceLen     = 0;
                }

                nCurMaxWidth += Item.Width;
                bCheckTextHeight = true;
                break;
            }

            case para_NewLine:
            {
                if ( nMinWidth < nWordLen )
                    nMinWidth = nWordLen;

                bWord    = false;
                nWordLen = 0;

                nSpaceLen = 0;

                if ( nCurMaxWidth > nMaxWidth )
                    nMaxWidth = nCurMaxWidth;

                nCurMaxWidth = 0;
                bCheckTextHeight = true;
                break;
            }

            case para_End:
            {
                if ( nMinWidth < nWordLen )
                    nMinWidth = nWordLen;

                if ( nCurMaxWidth > nMaxWidth )
                    nMaxWidth = nCurMaxWidth;

                if (nMaxHeight < 0.001)
                    bCheckTextHeight = true;

                break;
            }
        }
    }

    if (true === bCheckTextHeight && nMaxHeight < this.TextAscent + this.TextDescent)
        nMaxHeight = this.TextAscent + this.TextDescent;

    MinMax.bWord        = bWord;
    MinMax.nWordLen     = nWordLen;
    MinMax.nSpaceLen    = nSpaceLen;
    MinMax.nMinWidth    = nMinWidth;
    MinMax.nMaxWidth    = nMaxWidth;
    MinMax.nCurMaxWidth = nCurMaxWidth;
    MinMax.nMaxHeight   = nMaxHeight;
};

ParaRun.prototype.Get_Range_VisibleWidth = function(RangeW, _CurLine, _CurRange)
{
    var CurLine  = _CurLine - this.StartLine;
    var CurRange = ( 0 === CurLine ? _CurRange - this.StartRange : _CurRange );

    var StartPos = this.protected_GetRangeStartPos(CurLine, CurRange);
    var EndPos   = this.protected_GetRangeEndPos(CurLine, CurRange);

    for ( var Pos = StartPos; Pos < EndPos; Pos++ )
    {
        var Item = this.Content[Pos];
        var ItemType = Item.Type;

        switch( ItemType )
        {
            case para_Sym:
            case para_Text:
            case para_Space:
            case para_Math_Text:
            case para_Math_Ampersand:
            case para_Math_Placeholder:
            case para_Math_BreakOperator:
            {
                RangeW.W += Item.Get_WidthVisible();
                break;
            }
            case para_Drawing:
            {
                if ( true === Item.Is_Inline() )
                    RangeW.W += Item.Width;

                break;
            }
            case para_PageNum:
            case para_Tab:
            {
                RangeW.W += Item.Width;
                break;
            }
            case para_NewLine:
            {
                RangeW.W += Item.WidthVisible;

                break;
            }
            case para_End:
            {
                RangeW.W += Item.Get_WidthVisible();
                RangeW.End = true;

                break;
            }
        }
    }
};

ParaRun.prototype.Shift_Range = function(Dx, Dy, _CurLine, _CurRange)
{
    var CurLine = _CurLine - this.StartLine;
    var CurRange = ( 0 === CurLine ? _CurRange - this.StartRange : _CurRange );

    var StartPos = this.protected_GetRangeStartPos(CurLine, CurRange);
    var EndPos   = this.protected_GetRangeEndPos(CurLine, CurRange);

    for ( var CurPos = StartPos; CurPos < EndPos; CurPos++ )
    {
        var Item = this.Content[CurPos];

        if ( para_Drawing === Item.Type )
            Item.Shift( Dx, Dy );
    }
};
//-----------------------------------------------------------------------------------
// Функции отрисовки
//-----------------------------------------------------------------------------------
ParaRun.prototype.Draw_HighLights = function(PDSH)
{
    var pGraphics = PDSH.Graphics;

    var CurLine   = PDSH.Line - this.StartLine;
    var CurRange  = ( 0 === CurLine ? PDSH.Range - this.StartRange : PDSH.Range );

    var aHigh     = PDSH.High;
    var aColl     = PDSH.Coll;
    var aFind     = PDSH.Find;
    var aComm     = PDSH.Comm;
    var aShd      = PDSH.Shd;

    var StartPos = this.protected_GetRangeStartPos(CurLine, CurRange);
    var EndPos   = this.protected_GetRangeEndPos(CurLine, CurRange);

    var Para     = PDSH.Paragraph;
    var SearchResults = Para.SearchResults;

    var bDrawFind = PDSH.DrawFind;
    var bDrawColl = PDSH.DrawColl;

    var oCompiledPr = this.Get_CompiledPr(false);
    var oShd = oCompiledPr.Shd;
    var bDrawShd  = ( oShd === undefined || shd_Nil === oShd.Value ? false : true );
    var ShdColor  = ( true === bDrawShd ? oShd.Get_Color( PDSH.Paragraph ) : null );

    if(this.Type == para_Math_Run && this.IsPlaceholder())
        bDrawShd = false;

    var X  = PDSH.X;
    var Y0 = PDSH.Y0;
    var Y1 = PDSH.Y1;

    var CommentsCount = PDSH.Comments.length;
    var CommentId     = ( CommentsCount > 0 ? PDSH.Comments[CommentsCount - 1] : null );
    var CommentsFlag  = PDSH.CommentsFlag;

    var HighLight = oCompiledPr.HighLight;

    var SearchMarksCount = this.SearchMarks.length;

    this.CollaborativeMarks.Init_Drawing();

    for ( var Pos = StartPos; Pos < EndPos; Pos++ )
    {
        var Item = this.Content[Pos];
        var ItemType         = Item.Type;
        var ItemWidthVisible = Item.Get_WidthVisible();

        // Определим попадание в поиск и совместное редактирование. Попадание в комментарий определять не надо,
        // т.к. класс CParaRun попадает или не попадает в комментарий целиком.

        for ( var SPos = 0; SPos < SearchMarksCount; SPos++)
        {
            var Mark = this.SearchMarks[SPos];
            var MarkPos = Mark.SearchResult.StartPos.Get(Mark.Depth);

            if ( Pos === MarkPos && true === Mark.Start )
                PDSH.SearchCounter++;
        }

        var DrawSearch = ( PDSH.SearchCounter > 0 && true === bDrawFind ? true : false );

        var DrawColl = this.CollaborativeMarks.Check( Pos );

        if ( true === bDrawShd )
            aShd.Add( Y0, Y1, X, X + ItemWidthVisible, 0, ShdColor.r, ShdColor.g, ShdColor.b, undefined, oShd );

        switch( ItemType )
        {
            case para_PageNum:
            case para_Drawing:
            case para_Tab:
            case para_Text:
            case para_Math_Text:
            case para_Math_Placeholder:
            case para_Math_BreakOperator:
            case para_Math_Ampersand:
            case para_Sym:
            {
                if ( para_Drawing === ItemType && !Item.Is_Inline() )
                    break;

                if ( CommentsFlag != comments_NoComment )
                    aComm.Add( Y0, Y1, X, X + ItemWidthVisible, 0, 0, 0, 0, { Active : CommentsFlag === comments_ActiveComment ? true : false, CommentId : CommentId } );
                else if ( highlight_None != HighLight )
                    aHigh.Add( Y0, Y1, X, X + ItemWidthVisible, 0, HighLight.r, HighLight.g, HighLight.b, undefined, HighLight );

                if ( true === DrawSearch )
                    aFind.Add( Y0, Y1, X, X + ItemWidthVisible, 0, 0, 0, 0  );
                else if ( null !== DrawColl )
                    aColl.Add( Y0, Y1, X, X + ItemWidthVisible, 0, DrawColl.r, DrawColl.g, DrawColl.b );

                if ( para_Drawing != ItemType || Item.Is_Inline() )
                    X += ItemWidthVisible;

                break;
            }
            case para_Space:
            {
                // Пробелы в конце строки (и строку состоящую из пробелов) не подчеркиваем, не зачеркиваем и не выделяем
                if ( PDSH.Spaces > 0 )
                {
                    if ( CommentsFlag != comments_NoComment )
                        aComm.Add( Y0, Y1, X, X + ItemWidthVisible, 0, 0, 0, 0, { Active : CommentsFlag === comments_ActiveComment ? true : false, CommentId : CommentId } );
                    else if ( highlight_None != HighLight )
                        aHigh.Add( Y0, Y1, X, X + ItemWidthVisible, 0, HighLight.r, HighLight.g, HighLight.b, undefined, HighLight );

                    PDSH.Spaces--;
                }

                if ( true === DrawSearch )
                    aFind.Add( Y0, Y1, X, X + ItemWidthVisible, 0, 0, 0, 0  );
                else if ( null !== DrawColl )
                    aColl.Add( Y0, Y1, X, X + ItemWidthVisible, 0, DrawColl.r, DrawColl.g, DrawColl.b  );

                X += ItemWidthVisible;

                break;
            }
            case para_End:
            {
                if ( null !== DrawColl )
                    aColl.Add( Y0, Y1, X, X + ItemWidthVisible, 0, DrawColl.r, DrawColl.g, DrawColl.b  );

                X += Item.Get_Width();
                break;
            }
            case para_NewLine:
            {
                X += ItemWidthVisible;
                break;
            }
        }

        for ( var SPos = 0; SPos < SearchMarksCount; SPos++)
        {
            var Mark = this.SearchMarks[SPos];
            var MarkPos = Mark.SearchResult.EndPos.Get(Mark.Depth);

            if ( Pos + 1 === MarkPos && true !== Mark.Start )
                PDSH.SearchCounter--;
        }
    }

    // Обновим позицию X
    PDSH.X = X;
};

ParaRun.prototype.Draw_Elements = function(PDSE)
{
    var CurLine  = PDSE.Line - this.StartLine;
    var CurRange = ( 0 === CurLine ? PDSE.Range - this.StartRange : PDSE.Range );
    var CurPage  = PDSE.Page;

    var StartPos = this.protected_GetRangeStartPos(CurLine, CurRange);
    var EndPos   = this.protected_GetRangeEndPos(CurLine, CurRange);

    var Para      = PDSE.Paragraph;
    var pGraphics = PDSE.Graphics;
    var BgColor   = PDSE.BgColor;
    var Theme     = PDSE.Theme;

    var X = PDSE.X;
    var Y = PDSE.Y;

    var CurTextPr = this.Get_CompiledPr( false );
    pGraphics.SetTextPr( CurTextPr, Theme );

    var InfoMathText ;
    if(this.Type == para_Math_Run)
    {
        var ArgSize = this.Parent.Compiled_ArgSz.value,
            bNormalText = this.IsNormalText();

        var InfoTextPr =
        {
            TextPr:         CurTextPr,
            ArgSize:        ArgSize,
            bNormalText:    bNormalText,
            bEqArray:       this.bEqArray
        };

        InfoMathText = new CMathInfoTextPr(InfoTextPr);
    }

    if ( undefined !== CurTextPr.Shd && shd_Nil !== CurTextPr.Shd.Value )
        BgColor = CurTextPr.Shd.Get_Color( Para );

    var AutoColor = ( undefined != BgColor && false === BgColor.Check_BlackAutoColor() ? new CDocumentColor( 255, 255, 255, false ) : new CDocumentColor( 0, 0, 0, false ) );

    var RGBA;
    var ReviewType  = this.Get_ReviewType();
    var ReviewColor = null;
    if (reviewtype_Add === ReviewType || reviewtype_Remove === ReviewType)
    {
        ReviewColor = this.Get_ReviewColor();
        pGraphics.b_color1(ReviewColor.r, ReviewColor.g, ReviewColor.b, 255);
    }
    else if (CurTextPr.Unifill)
    {
        CurTextPr.Unifill.check(PDSE.Theme, PDSE.ColorMap);
        RGBA = CurTextPr.Unifill.getRGBAColor();

        if ( true === PDSE.VisitedHyperlink && ( undefined === this.Pr.Color && undefined === this.Pr.Unifill ) )
        {
            G_O_VISITED_HLINK_COLOR.check(PDSE.Theme, PDSE.ColorMap);
            RGBA = G_O_VISITED_HLINK_COLOR.getRGBAColor();
            pGraphics.b_color1( RGBA.R, RGBA.G, RGBA.B, RGBA.A );
        }
        else
        {
            pGraphics.b_color1( RGBA.R, RGBA.G, RGBA.B, RGBA.A);
        }
    }
    else
    {
        if ( true === PDSE.VisitedHyperlink && ( undefined === this.Pr.Color && undefined === this.Pr.Unifill ) )
        {
            G_O_VISITED_HLINK_COLOR.check(PDSE.Theme, PDSE.ColorMap);
            RGBA = G_O_VISITED_HLINK_COLOR.getRGBAColor();
            pGraphics.b_color1( RGBA.R, RGBA.G, RGBA.B, RGBA.A );
        }
        else if ( true === CurTextPr.Color.Auto )
        {
            pGraphics.b_color1( AutoColor.r, AutoColor.g, AutoColor.b, 255);
        }
        else
        {
            pGraphics.b_color1( CurTextPr.Color.r, CurTextPr.Color.g, CurTextPr.Color.b, 255);
        }
    }

    for ( var Pos = StartPos; Pos < EndPos; Pos++ )
    {
        var Item = this.Content[Pos];
        var ItemType = Item.Type;

        var TempY = Y;
        switch( CurTextPr.VertAlign )
        {
            case vertalign_SubScript:
            {
                Y -= vertalign_Koef_Sub * CurTextPr.FontSize * g_dKoef_pt_to_mm;

                break;
            }
            case vertalign_SuperScript:
            {
                Y -= vertalign_Koef_Super * CurTextPr.FontSize * g_dKoef_pt_to_mm;

                break;
            }
        }

        switch( ItemType )
        {
            case para_PageNum:
            case para_Drawing:
            case para_Tab:
            case para_Text:
            case para_Sym:
            {
                if (para_Tab === ItemType)
                {
                    pGraphics.p_color(0, 0, 0, 255);
                    pGraphics.b_color1(0, 0, 0, 255);
                }

                if (para_Drawing != ItemType || Item.Is_Inline())
                {
                    Item.Draw(X, Y - this.YOffset, pGraphics);
                    X += Item.Get_WidthVisible();
                }

                // Внутри отрисовки инлайн-автофигур могут изменится цвета и шрифт, поэтому восстанавливаем настройки
                if ((para_Drawing === ItemType && Item.Is_Inline()) || (para_Tab === ItemType))
                {
                    pGraphics.SetTextPr( CurTextPr, Theme );

                    if (reviewtype_Add === ReviewType || reviewtype_Remove === ReviewType)
                    {
                        pGraphics.b_color1(ReviewColor.r, ReviewColor.g, ReviewColor.b, 255);
                    }
                    else if (RGBA)
                    {
                        pGraphics.b_color1( RGBA.R, RGBA.G, RGBA.B, 255);
                        pGraphics.p_color( RGBA.R, RGBA.G, RGBA.B, 255);
                    }
                    else
                    {
                        if ( true === CurTextPr.Color.Auto )
                        {
                            pGraphics.b_color1( AutoColor.r, AutoColor.g, AutoColor.b, 255);
                            pGraphics.p_color( AutoColor.r, AutoColor.g, AutoColor.b, 255);
                        }
                        else
                        {
                            pGraphics.b_color1( CurTextPr.Color.r, CurTextPr.Color.g, CurTextPr.Color.b, 255);
                            pGraphics.p_color(  CurTextPr.Color.r, CurTextPr.Color.g, CurTextPr.Color.b, 255);
                        }
                    }
                }

                break;
            }
            case para_Space:
            {
                Item.Draw( X, Y - this.YOffset, pGraphics );

                X += Item.Get_WidthVisible();

                break;
            }
            case para_End:
            {
                var SectPr = Para.Get_SectionPr();
                if (!Para.LogicDocument || Para.LogicDocument !== Para.Parent)
                    SectPr = undefined;

                if ( undefined === SectPr )
                {
                    // Выставляем настройки для символа параграфа
                    var EndTextPr = Para.Get_CompiledPr2(false).TextPr.Copy();
                    EndTextPr.Merge(Para.TextPr.Value);

                    if (reviewtype_Common !== ReviewType)
                    {
                        pGraphics.SetTextPr(EndTextPr, PDSE.Theme);
                        pGraphics.b_color1(ReviewColor.r, ReviewColor.g, ReviewColor.b, 255);
                    }
                    else if (EndTextPr.Unifill)
                    {
                        EndTextPr.Unifill.check(PDSE.Theme, PDSE.ColorMap);
                        var RGBAEnd = EndTextPr.Unifill.getRGBAColor();
                        pGraphics.SetTextPr(EndTextPr, PDSE.Theme);
                        pGraphics.b_color1(RGBAEnd.R, RGBAEnd.G, RGBAEnd.B, 255);
                    }
                    else
                    {
                        pGraphics.SetTextPr(EndTextPr, PDSE.Theme);
                        if (true === EndTextPr.Color.Auto)
                            pGraphics.b_color1(AutoColor.r, AutoColor.g, AutoColor.b, 255);
                        else
                            pGraphics.b_color1(EndTextPr.Color.r, EndTextPr.Color.g, EndTextPr.Color.b, 255);
                    }

                    var bEndCell = false;
                    if (null === Para.Get_DocumentNext() && true === Para.Parent.Is_TableCellContent())
                        bEndCell = true;

                    Item.Draw(X, Y - this.YOffset, pGraphics, bEndCell, reviewtype_Common !== ReviewType ?  true : false);
                }
                else
                {
                    Item.Draw(X, Y - this.YOffset, pGraphics, false, false);
                }

                X += Item.Get_Width();

                break;
            }
            case para_NewLine:
            {
                Item.Draw( X, Y - this.YOffset, pGraphics );
                X += Item.WidthVisible;
                break;
            }
            case para_Math_Ampersand:
            case para_Math_Text:
            case para_Math_BreakOperator:
            {
                var PosLine = this.ParaMath.GetLinePosition(PDSE.Line, PDSE.Range);
                Item.Draw(PosLine.x, PosLine.y, pGraphics, InfoMathText);
                X += Item.Get_WidthVisible();
                break;
            }
            case para_Math_Placeholder:
            {
                if(pGraphics.RENDERER_PDF_FLAG !== true) // если идет печать/ конвертация в PDF плейсхолдер не отрисовываем
                {
                    var PosLine = this.ParaMath.GetLinePosition(PDSE.Line, PDSE.Range);
                    Item.Draw(PosLine.x, PosLine.y, pGraphics, InfoMathText);
                    X += Item.Get_WidthVisible();
                }
                break;
            }
        }

        Y = TempY;
    }
    // Обновляем позицию
    PDSE.X = X;
};

ParaRun.prototype.Draw_Lines = function(PDSL)
{
    var CurLine  = PDSL.Line - this.StartLine;
    var CurRange = ( 0 === CurLine ? PDSL.Range - this.StartRange : PDSL.Range );

    var StartPos = this.protected_GetRangeStartPos(CurLine, CurRange);
    var EndPos   = this.protected_GetRangeEndPos(CurLine, CurRange);

    var X        = PDSL.X;
    var Y        = PDSL.Baseline;
    var UndOff   = PDSL.UnderlineOffset;

    var Para       = PDSL.Paragraph;

    var aStrikeout  = PDSL.Strikeout;
    var aDStrikeout = PDSL.DStrikeout;
    var aUnderline  = PDSL.Underline;
    var aSpelling   = PDSL.Spelling;

    var CurTextPr = this.Get_CompiledPr( false );
    var StrikeoutY = Y - this.YOffset;

    var fontCoeff = 1; // учтем ArgSize
    if(this.Type == para_Math_Run)
    {
        var ArgSize = this.Parent.Compiled_ArgSz;
        fontCoeff   = MatGetKoeffArgSize(CurTextPr.FontSize, ArgSize.value);
    }

    switch(CurTextPr.VertAlign)
    {
        case vertalign_Baseline   : StrikeoutY += -CurTextPr.FontSize * fontCoeff * g_dKoef_pt_to_mm * 0.27; break;
        case vertalign_SubScript  : StrikeoutY += -CurTextPr.FontSize * fontCoeff * vertalign_Koef_Size * g_dKoef_pt_to_mm * 0.27 - vertalign_Koef_Sub * CurTextPr.FontSize  * fontCoeff * g_dKoef_pt_to_mm; break;
        case vertalign_SuperScript: StrikeoutY += -CurTextPr.FontSize * fontCoeff * vertalign_Koef_Size * g_dKoef_pt_to_mm * 0.27 - vertalign_Koef_Super * CurTextPr.FontSize * fontCoeff * g_dKoef_pt_to_mm; break;
    }

    var UnderlineY = Y + UndOff -  this.YOffset;
    var LineW      = (CurTextPr.FontSize / 18) * g_dKoef_pt_to_mm;


    var BgColor = PDSL.BgColor;
    if ( undefined !== CurTextPr.Shd && shd_Nil !== CurTextPr.Shd.Value )
        BgColor = CurTextPr.Shd.Get_Color( Para );

    var AutoColor = ( undefined != BgColor && false === BgColor.Check_BlackAutoColor() ? new CDocumentColor( 255, 255, 255, false ) : new CDocumentColor( 0, 0, 0, false ) );

    var CurColor, RGBA, Theme = this.Paragraph.Get_Theme(), ColorMap = this.Paragraph.Get_ColorMap();

    var ReviewType  = this.Get_ReviewType();
    var bAddReview  = reviewtype_Add === ReviewType ? true : false;
    var bRemReview  = reviewtype_Remove === ReviewType ? true : false;
    var ReviewColor = this.Get_ReviewColor();

    // Выставляем цвет обводки
    if ( true === PDSL.VisitedHyperlink && ( undefined === this.Pr.Color && undefined === this.Pr.Unifill ) )
        CurColor = new CDocumentColor( 128, 0, 151 );
    else if ( true === CurTextPr.Color.Auto && !CurTextPr.Unifill)
        CurColor = new CDocumentColor( AutoColor.r, AutoColor.g, AutoColor.b );
    else
    {
        if(CurTextPr.Unifill)
        {
            CurTextPr.Unifill.check(Theme, ColorMap);
            RGBA = CurTextPr.Unifill.getRGBAColor();
            CurColor = new CDocumentColor( RGBA.R, RGBA.G, RGBA.B );
        }
        else
        {
            CurColor = new CDocumentColor( CurTextPr.Color.r, CurTextPr.Color.g, CurTextPr.Color.b );
        }
    }

    var SpellingMarksArray = {};
    var SpellingMarksCount = this.SpellingMarks.length;
    for ( var SPos = 0; SPos < SpellingMarksCount; SPos++)
    {
        var Mark = this.SpellingMarks[SPos];

        if ( false === Mark.Element.Checked )
        {
            if ( true === Mark.Start )
            {
                var MarkPos = Mark.Element.StartPos.Get(Mark.Depth);

                if ( undefined === SpellingMarksArray[MarkPos] )
                    SpellingMarksArray[MarkPos] = 1;
                else
                    SpellingMarksArray[MarkPos] += 1;
            }
            else
            {
                var MarkPos = Mark.Element.EndPos.Get(Mark.Depth);

                if ( undefined === SpellingMarksArray[MarkPos] )
                    SpellingMarksArray[MarkPos] = 2;
                else
                    SpellingMarksArray[MarkPos] += 2;
            }
        }
    }

    for ( var Pos = StartPos; Pos < EndPos; Pos++ )
    {
        var Item             = this.Content[Pos];
        var ItemType         = Item.Type;
        var ItemWidthVisible = Item.Get_WidthVisible();

        if ( 1 === SpellingMarksArray[Pos] || 3 === SpellingMarksArray[Pos] )
            PDSL.SpellingCounter++;

        switch( ItemType )
        {
            case para_End:
            {
                if (this.Paragraph)
                {
                    if (bAddReview)
                        aUnderline.Add(UnderlineY, UnderlineY, X, X + ItemWidthVisible, LineW, ReviewColor.r, ReviewColor.g, ReviewColor.b);
                    else if (bRemReview)
                        aStrikeout.Add(StrikeoutY, StrikeoutY, X, X + ItemWidthVisible, LineW, ReviewColor.r, ReviewColor.g, ReviewColor.b);
                }

                X += ItemWidthVisible;

                break;
            }
            case para_NewLine:
            {
                X += ItemWidthVisible;
                break;
            }

            case para_PageNum:
            case para_Drawing:
            case para_Tab:
            case para_Text:
            case para_Sym:
            {
                if ( para_Drawing != ItemType || Item.Is_Inline() )
                {
                    if (true === bRemReview)
                        aStrikeout.Add(StrikeoutY, StrikeoutY, X, X + ItemWidthVisible, LineW, ReviewColor.r, ReviewColor.g, ReviewColor.b);
                    else if (true === CurTextPr.DStrikeout)
                        aDStrikeout.Add( StrikeoutY, StrikeoutY, X, X + ItemWidthVisible, LineW, CurColor.r, CurColor.g, CurColor.b, undefined, CurTextPr );
                    else if ( true === CurTextPr.Strikeout )
                        aStrikeout.Add( StrikeoutY, StrikeoutY, X, X + ItemWidthVisible, LineW, CurColor.r, CurColor.g, CurColor.b, undefined, CurTextPr );

                    if (true === bAddReview)
                        aUnderline.Add(UnderlineY, UnderlineY, X, X + ItemWidthVisible, LineW, ReviewColor.r, ReviewColor.g, ReviewColor.b);
                    else if (true === CurTextPr.Underline)
                        aUnderline.Add(UnderlineY, UnderlineY, X, X + ItemWidthVisible, LineW, CurColor.r, CurColor.g, CurColor.b, undefined, CurTextPr );

                    if ( PDSL.SpellingCounter > 0 )
                        aSpelling.Add( UnderlineY, UnderlineY, X, X + ItemWidthVisible, LineW, 0, 0, 0 );

                    X += ItemWidthVisible;
                }

                break;
            }
            case para_Space:
            {
                // Пробелы, идущие в конце строки, не подчеркиваем и не зачеркиваем
                if ( PDSL.Spaces > 0 )
                {
                    if (true === bRemReview)
                        aStrikeout.Add(StrikeoutY, StrikeoutY, X, X + ItemWidthVisible, LineW, ReviewColor.r, ReviewColor.g, ReviewColor.b);
                    else if (true === CurTextPr.DStrikeout)
                        aDStrikeout.Add( StrikeoutY, StrikeoutY, X, X + ItemWidthVisible, LineW, CurColor.r, CurColor.g, CurColor.b, undefined, CurTextPr  );
                    else if ( true === CurTextPr.Strikeout )
                        aStrikeout.Add( StrikeoutY, StrikeoutY, X, X + ItemWidthVisible, LineW, CurColor.r, CurColor.g, CurColor.b, undefined, CurTextPr  );

                    if (true === bAddReview)
                        aUnderline.Add(UnderlineY, UnderlineY, X, X + ItemWidthVisible, LineW, ReviewColor.r, ReviewColor.g, ReviewColor.b);
                    else if (true === CurTextPr.Underline)
                        aUnderline.Add( UnderlineY, UnderlineY, X, X + ItemWidthVisible, LineW, CurColor.r, CurColor.g, CurColor.b, undefined, CurTextPr );

                    PDSL.Spaces--;
                }

                X += ItemWidthVisible;

                break;
            }
            case para_Math_Text:
            case para_Math_BreakOperator:
            case para_Math_Ampersand:
            {
                if (true === bRemReview)
                    aStrikeout.Add( StrikeoutY, StrikeoutY, X, X + ItemWidthVisible, LineW, ReviewColor.r, ReviewColor.g, ReviewColor.b, undefined, CurTextPr );
                else if (true === CurTextPr.DStrikeout)
                    aDStrikeout.Add( StrikeoutY, StrikeoutY, X, X + ItemWidthVisible, LineW, CurColor.r, CurColor.g, CurColor.b, undefined, CurTextPr );
                else if ( true === CurTextPr.Strikeout )
                    aStrikeout.Add( StrikeoutY, StrikeoutY, X, X + ItemWidthVisible, LineW, CurColor.r, CurColor.g, CurColor.b, undefined, CurTextPr );


                X += ItemWidthVisible;
                break;
            }
            case para_Math_Placeholder:
            {
                var ctrPrp = this.Parent.GetCtrPrp();
                if (true === bRemReview)
                    aStrikeout.Add( StrikeoutY, StrikeoutY, X, X + ItemWidthVisible, LineW, ReviewColor.r, ReviewColor.g, ReviewColor.b, undefined, CurTextPr );
                if(true === ctrPrp.DStrikeout)
                    aDStrikeout.Add( StrikeoutY, StrikeoutY, X, X + ItemWidthVisible, LineW, CurColor.r, CurColor.g, CurColor.b, undefined, CurTextPr );
                else if(true === ctrPrp.Strikeout)
                    aStrikeout.Add( StrikeoutY, StrikeoutY, X, X + ItemWidthVisible, LineW, CurColor.r, CurColor.g, CurColor.b, undefined, CurTextPr );

                X += ItemWidthVisible;
                break;
            }
        }

        if ( 2 === SpellingMarksArray[Pos + 1] || 3 === SpellingMarksArray[Pos + 1] )
            PDSL.SpellingCounter--;
    }

    if (true === this.Pr.Have_PrChange() && para_Math_Run !== this.Type)
    {
        var ReviewColor = this.Get_PrReviewColor();
        PDSL.RunReview.Add(0, 0, PDSL.X, X, 0, ReviewColor.r, ReviewColor.g, ReviewColor.b, {RunPr: this.Pr});
    }

    var CollPrChangeColor = this.private_GetCollPrChangeOther();
    if (false !== CollPrChangeColor)
        PDSL.CollChange.Add(0, 0, PDSL.X, X, 0, CollPrChangeColor.r, CollPrChangeColor.g, CollPrChangeColor.b, {RunPr : this.Pr});

    // Обновляем позицию
    PDSL.X = X;
};
//-----------------------------------------------------------------------------------
// Функции для работы с курсором
//-----------------------------------------------------------------------------------
// Находится ли курсор в начале рана
ParaRun.prototype.Is_CursorPlaceable = function()
{
    return true;
};

ParaRun.prototype.Cursor_Is_Start = function()
{
    if ( this.State.ContentPos <= 0 )
        return true;

    return false;
};

// Проверяем нужно ли поправить позицию курсора
ParaRun.prototype.Cursor_Is_NeededCorrectPos = function()
{
    if ( true === this.Is_Empty(false) )
        return true;

    var NewRangeStart = false;
    var RangeEnd      = false;

    var Pos = this.State.ContentPos;

    var LinesLen = this.protected_GetLinesCount();
    for ( var CurLine = 0; CurLine < LinesLen; CurLine++ )
    {
        var RangesLen = this.protected_GetRangesCount(CurLine);
        for ( var CurRange = 0; CurRange < RangesLen; CurRange++ )
        {
            var StartPos = this.protected_GetRangeStartPos(CurLine, CurRange);
            var EndPos   = this.protected_GetRangeEndPos(CurLine, CurRange);

            if (0 !== CurLine || 0 !== CurRange)
            {
                if (Pos === StartPos)
                {
                    NewRangeStart = true;
                }
            }

            if (Pos === EndPos)
            {
                RangeEnd = true;
            }
        }

        if ( true === NewRangeStart )
            break;
    }

    if ( true !== NewRangeStart && true !== RangeEnd && true === this.Cursor_Is_Start() )
        return true;

    return false;
};

ParaRun.prototype.Cursor_Is_End = function()
{
    if ( this.State.ContentPos >= this.Content.length )
        return true;

    return false;
};

ParaRun.prototype.Cursor_MoveToStartPos = function()
{
    this.State.ContentPos = 0;
};

ParaRun.prototype.Cursor_MoveToEndPos = function(SelectFromEnd)
{
    if ( true === SelectFromEnd )
    {
        var Selection = this.State.Selection;
        Selection.Use      = true;
        Selection.StartPos = this.Content.length;
        Selection.EndPos   = this.Content.length;
    }
    else
    {
        var CurPos = this.Content.length;

        while ( CurPos > 0 )
        {
            if ( para_End === this.Content[CurPos - 1].Type )
                CurPos--;
            else
                break;
        }

        this.State.ContentPos = CurPos;
    }
};

ParaRun.prototype.Get_ParaContentPosByXY = function(SearchPos, Depth, _CurLine, _CurRange, StepEnd)
{
    var Result = false;

    var CurLine  = _CurLine - this.StartLine;
    var CurRange = ( 0 === CurLine ? _CurRange - this.StartRange : _CurRange );

    var StartPos = this.protected_GetRangeStartPos(CurLine, CurRange);
    var EndPos   = this.protected_GetRangeEndPos(CurLine, CurRange);

    var CurPos = StartPos;
    var InMathText = this.Type == para_Math_Run ? SearchPos.InText == true : false;


    for (; CurPos < EndPos; CurPos++ )
    {
        var Item = this.Content[CurPos];
        var ItemType = Item.Type;

        var TempDx = 0;

        if (para_Drawing != ItemType || true === Item.Is_Inline())
        {
            TempDx = Item.Get_WidthVisible();
        }

        if(this.Type == para_Math_Run)
        {
            var PosLine = this.ParaMath.GetLinePosition(_CurLine, _CurRange);
            var loc = this.Content[CurPos].GetLocationOfLetter();
            SearchPos.CurX = PosLine.x + loc.x; // позиция формулы в строке + смещение буквы в контенте
        }

        // Проверяем, попали ли мы в данный элемент
        var Diff = SearchPos.X - SearchPos.CurX;


        if ((Math.abs( Diff ) < SearchPos.DiffX + 0.001 && (SearchPos.CenterMode || SearchPos.X > SearchPos.CurX)) && InMathText == false)
        {
            SearchPos.DiffX = Math.abs( Diff );
            SearchPos.Pos.Update( CurPos, Depth );
            Result = true;

            if ( Diff >= - 0.001 && Diff <= TempDx + 0.001 )
            {
                SearchPos.InTextPos.Update( CurPos, Depth );
                SearchPos.InText = true;
            }
        }

        SearchPos.CurX += TempDx;

        // Заглушка для знака параграфа и конца строки
        Diff = SearchPos.X - SearchPos.CurX;
        if ((Math.abs( Diff ) < SearchPos.DiffX + 0.001 && (SearchPos.CenterMode || SearchPos.X > SearchPos.CurX)) && InMathText == false)
        {
            if ( para_End === ItemType )
            {
                SearchPos.End = true;

                // Если мы ищем позицию для селекта, тогда нужно искать и за знаком параграфа
                if ( true === StepEnd )
                {
                    SearchPos.Pos.Update( this.Content.length, Depth );
                    Result = true;
                }
            }
            else if ( CurPos === EndPos - 1 && para_NewLine != ItemType )
            {
                SearchPos.Pos.Update( EndPos, Depth );
                Result = true;
            }
        }
    }

    // Такое возможно, если все раны до этого (в том числе и этот) были пустыми, тогда, чтобы не возвращать
    // неправильную позицию вернем позицию начала данного путого рана.
    if ( SearchPos.DiffX > 1000000 - 1 )
    {
        SearchPos.Pos.Update( StartPos, Depth );
        Result = true;
    }

    if (this.Type == para_Math_Run) // не только для пустых Run, но и для проверки на конец Run (т.к. Diff не обновляется)
    {
        //для пустых Run искомая позиция - позиция самого Run
        var bEmpty = this.Is_Empty();

        var PosLine = this.ParaMath.GetLinePosition(_CurLine, _CurRange);

        if(bEmpty)
            SearchPos.CurX = PosLine.x + this.pos.x;

        Diff = SearchPos.X - SearchPos.CurX;
        if(SearchPos.InText == false && (bEmpty || StartPos !== EndPos) && (Math.abs( Diff ) < SearchPos.DiffX + 0.001 && (SearchPos.CenterMode || SearchPos.X > SearchPos.CurX)))
        {
            SearchPos.DiffX = Math.abs( Diff );
            SearchPos.Pos.Update( CurPos, Depth );
            Result = true;
        }
    }

    return Result;
};

ParaRun.prototype.Get_ParaContentPos = function(bSelection, bStart, ContentPos)
{
    var Pos = ( true !== bSelection ? this.State.ContentPos : ( false !== bStart ? this.State.Selection.StartPos : this.State.Selection.EndPos ) );
    ContentPos.Add(Pos);
};

ParaRun.prototype.Set_ParaContentPos = function(ContentPos, Depth)
{
    var Pos = ContentPos.Get(Depth);

    var Count = this.Content.length;
    if ( Pos > Count )
        Pos = Count;

    // TODO: Как только переделаем работу c Para_End переделать здесь
    for ( var TempPos = 0; TempPos < Pos; TempPos++ )
    {
        if ( para_End === this.Content[TempPos].Type )
        {
            Pos = TempPos;
            break;
        }
    }

    if ( Pos < 0 )
        Pos = 0;

    this.State.ContentPos = Pos;
};

ParaRun.prototype.Get_PosByElement = function(Class, ContentPos, Depth, UseRange, Range, Line)
{
    if ( this === Class )
        return true;

    return false;
};

ParaRun.prototype.Get_ElementByPos = function(ContentPos, Depth)
{
    return this;
};

ParaRun.prototype.Get_PosByDrawing = function(Id, ContentPos, Depth)
{
    var Count = this.Content.length;
    for ( var CurPos = 0; CurPos < Count; CurPos++ )
    {
        var Item = this.Content[CurPos];
        if ( para_Drawing === Item.Type && Id === Item.Get_Id() )
        {
            ContentPos.Update( CurPos, Depth );
            return true;
        }
    }

    return false;
};

ParaRun.prototype.Get_RunElementByPos = function(ContentPos, Depth)
{
    if ( undefined !== ContentPos )
    {
        var CurPos = ContentPos.Get(Depth);
        var ContentLen = this.Content.length;

        if ( CurPos >= this.Content.length || CurPos < 0 )
            return null;

        return this.Content[CurPos];
    }
    else
    {
        if ( this.Content.length > 0 )
            return this.Content[0];
        else
            return null;
    }
};

ParaRun.prototype.Get_LastRunInRange = function(_CurLine, _CurRange)
{
    var CurLine = _CurLine - this.StartLine;
    var CurRange = ( 0 === CurLine ? _CurRange - this.StartRange : _CurRange );

    return this;
};

ParaRun.prototype.Get_LeftPos = function(SearchPos, ContentPos, Depth, UseContentPos)
{
    var CurPos = ( true === UseContentPos ? ContentPos.Get(Depth) : this.Content.length );

    while ( true )
    {
        CurPos--;

        var Item = this.Content[CurPos];
        if ( CurPos < 0 || para_Drawing !== Item.Type || false !== Item.Is_Inline() )
            break;
    }

    if ( CurPos >= 0 )
    {
        SearchPos.Found = true;
        SearchPos.Pos.Update( CurPos, Depth );
    }
};

ParaRun.prototype.Get_RightPos = function(SearchPos, ContentPos, Depth, UseContentPos, StepEnd)
{
    var CurPos = ( true === UseContentPos ? ContentPos.Get(Depth) : 0 );

    var Count = this.Content.length;
    while ( true )
    {
        CurPos++;

        // Мы встали в конец рана:
        //   Если мы перешагнули para_End или para_Drawing Anchor, тогда возвращаем false
        //   В противном случае true
        if ( Count === CurPos )
        {
            if ( CurPos === 0 )
                return;

            var PrevItem = this.Content[CurPos - 1];
            var PrevItemType = PrevItem.Type;
            if ((true !== StepEnd && para_End === PrevItemType) || (para_Drawing === PrevItemType && false === PrevItem.Is_Inline()))
                return;

            break;
        }

        if (CurPos > Count)
            break;

        var Item = this.Content[CurPos];
        var ItemType = Item.Type;
        if ((para_Drawing !== ItemType && (false !== StepEnd || para_End !== this.Content[CurPos - 1].Type)) || (para_Drawing === ItemType && false !== Item.Is_Inline()))
            break;
    }

    if ( CurPos <= Count )
    {
        SearchPos.Found = true;
        SearchPos.Pos.Update( CurPos, Depth );
    }
};

ParaRun.prototype.Get_WordStartPos = function(SearchPos, ContentPos, Depth, UseContentPos)
{
    var CurPos = ( true === UseContentPos ? ContentPos.Get(Depth) - 1 : this.Content.length - 1 );

    if ( CurPos < 0 )
        return;

    SearchPos.Shift = true;

    var NeedUpdate = false;

    // На первом этапе ищем позицию первого непробельного элемента
    if ( 0 === SearchPos.Stage )
    {
        while ( true )
        {
            var Item = this.Content[CurPos];
            var Type = Item.Type;

            var bSpace = false;

            if ( para_Space === Type || para_Tab === Type || ( para_Text === Type && true === Item.Is_NBSP() ) || ( para_Drawing === Type && true !== Item.Is_Inline() ) )
                bSpace = true;

            if ( true === bSpace )
            {
                CurPos--;

                // Выходим из данного рана
                if ( CurPos < 0 )
                    return;
            }
            else
            {
                // Если мы остановились на нетекстовом элементе, тогда его и возвращаем
                if ( para_Text !== this.Content[CurPos].Type && para_Math_Text !== this.Content[CurPos].Type)
                {
                    SearchPos.Pos.Update( CurPos, Depth );
                    SearchPos.Found     = true;
                    SearchPos.UpdatePos = true;
                    return;
                }

                SearchPos.Pos.Update( CurPos, Depth );
                SearchPos.Stage       = 1;
                SearchPos.Punctuation = this.Content[CurPos].Is_Punctuation();
                NeedUpdate            = true;

                break;
            }
        }
    }
    else
    {
        CurPos = ( true === UseContentPos ? ContentPos.Get(Depth) : this.Content.length );
    }

    // На втором этапе мы смотрим на каком элементе мы встали: если текст - пунктуация, тогда сдвигаемся
    // до конца всех знаков пунктуации

    while ( CurPos > 0 )
    {
        CurPos--;
        var Item = this.Content[CurPos];
        var TempType = Item.Type;

        if ( (para_Text !== TempType && para_Math_Text !== TempType) || true === Item.Is_NBSP() || ( true === SearchPos.Punctuation && true !== Item.Is_Punctuation() ) || ( false === SearchPos.Punctuation && false !== Item.Is_Punctuation() ) )
        {
            SearchPos.Found = true;
            break;
        }
        else
        {
            SearchPos.Pos.Update( CurPos, Depth );
            NeedUpdate = true;
        }
    }

    SearchPos.UpdatePos = NeedUpdate;
};

ParaRun.prototype.Get_WordEndPos = function(SearchPos, ContentPos, Depth, UseContentPos, StepEnd)
{
    var CurPos = ( true === UseContentPos ? ContentPos.Get(Depth) : 0 );

    var ContentLen = this.Content.length;
    if ( CurPos >= ContentLen )
        return;

    var NeedUpdate = false;

    if ( 0 === SearchPos.Stage )
    {
        // На первом этапе ищем первый нетекстовый ( и не таб ) элемент
        while ( true )
        {
            var Item = this.Content[CurPos];
            var Type = Item.Type;
            var bText = false;

            if ( (para_Text === Type || para_Math_Text === Type) && true != Item.Is_NBSP() && ( true === SearchPos.First || ( SearchPos.Punctuation === Item.Is_Punctuation() ) ) )
                bText = true;

            if ( true === bText )
            {
                if ( true === SearchPos.First )
                {
                    SearchPos.First       = false;
                    SearchPos.Punctuation = Item.Is_Punctuation();
                }

                CurPos++;

                // Отмечаем, что сдвиг уже произошел
                SearchPos.Shift = true;

                // Выходим из рана
                if ( CurPos >= ContentLen )
                    return;
            }
            else
            {
                SearchPos.Stage = 1;

                // Первый найденный элемент не текстовый, смещаемся вперед
                if ( true === SearchPos.First )
                {
                    // Если первый найденный элемент - конец параграфа, тогда выходим из поиска
                    if ( para_End === Type )
                    {
                        if ( true === StepEnd )
                        {
                            SearchPos.Pos.Update( CurPos + 1, Depth );
                            SearchPos.Found     = true;
                            SearchPos.UpdatePos = true;
                        }

                        return;
                    }

                    CurPos++;

                    // Отмечаем, что сдвиг уже произошел
                    SearchPos.Shift = true;
                }

                break;
            }
        }
    }

    if ( CurPos >= ContentLen )
        return;


    // На втором этапе мы смотрим на каком элементе мы встали: если это не пробел, тогда
    // останавливаемся здесь. В противном случае сдвигаемся вперед, пока не попали на первый
    // не пробельный элемент.
    if ( !(para_Space === this.Content[CurPos].Type || ( para_Text === this.Content[CurPos].Type && true === this.Content[CurPos].Is_NBSP() ) ) )
    {
        SearchPos.Pos.Update( CurPos, Depth );
        SearchPos.Found     = true;
        SearchPos.UpdatePos = true;
    }
    else
    {
        while ( CurPos < ContentLen - 1 )
        {
            CurPos++;
            var Item = this.Content[CurPos];
            var TempType = Item.Type;

            if ( (true !== StepEnd && para_End === TempType) || !( para_Space === TempType || ( para_Text === TempType && true === Item.Is_NBSP() ) ) )
            {
                SearchPos.Found = true;
                break;
            }
        }

        // Обновляем позицию в конце каждого рана (хуже от этого не будет)
        SearchPos.Pos.Update( CurPos, Depth );
        SearchPos.UpdatePos = true;
    }
};

ParaRun.prototype.Get_EndRangePos = function(_CurLine, _CurRange, SearchPos, Depth)
{
    var CurLine = _CurLine - this.StartLine;
    var CurRange = ( 0 === CurLine ? _CurRange - this.StartRange : _CurRange );

    var StartPos = this.protected_GetRangeStartPos(CurLine, CurRange);
    var EndPos   = this.protected_GetRangeEndPos(CurLine, CurRange);

    var LastPos = -1;
    for ( var CurPos = StartPos; CurPos < EndPos; CurPos++ )
    {
        var Item = this.Content[CurPos];
        var ItemType = Item.Type;
        if ( !((para_Drawing === ItemType && true !== Item.Is_Inline()) || para_End === ItemType || (para_NewLine === ItemType && break_Line === Item.BreakType)))
            LastPos = CurPos + 1;
    }

    // Проверяем, попал ли хоть один элемент в данный отрезок, если нет, тогда не регистрируем такой ран
    if ( -1 !== LastPos )
    {
        SearchPos.Pos.Update( LastPos, Depth );
        return true;
    }
    else
        return false;
};

ParaRun.prototype.Get_StartRangePos = function(_CurLine, _CurRange, SearchPos, Depth)
{
    var CurLine = _CurLine - this.StartLine;
    var CurRange = ( 0 === CurLine ? _CurRange - this.StartRange : _CurRange );

    var StartPos = this.protected_GetRangeStartPos(CurLine, CurRange);
    var EndPos   = this.protected_GetRangeEndPos(CurLine, CurRange);

    var FirstPos = -1;
    for ( var CurPos = EndPos - 1; CurPos >= StartPos; CurPos-- )
    {
        var Item = this.Content[CurPos];
        if ( !(para_Drawing === Item.Type && true !== Item.Is_Inline()) )
            FirstPos = CurPos;
    }

    // Проверяем, попал ли хоть один элемент в данный отрезок, если нет, тогда не регистрируем такой ран
    if ( -1 !== FirstPos )
    {
        SearchPos.Pos.Update( FirstPos, Depth );
        return true;
    }
    else
        return false;
};

ParaRun.prototype.Get_StartRangePos2 = function(_CurLine, _CurRange, ContentPos, Depth)
{
    var CurLine  = _CurLine - this.StartLine;
    var CurRange = ( 0 === CurLine ? _CurRange - this.StartRange : _CurRange );

    var Pos = this.protected_GetRangeStartPos(CurLine, CurRange);
    ContentPos.Update( Pos, Depth );
};

ParaRun.prototype.Get_StartPos = function(ContentPos, Depth)
{
    ContentPos.Update( 0, Depth );
};

ParaRun.prototype.Get_EndPos = function(BehindEnd, ContentPos, Depth)
{
    var ContentLen = this.Content.length;

    if ( true === BehindEnd )
        ContentPos.Update( ContentLen, Depth );
    else
    {
        for ( var CurPos = 0; CurPos < ContentLen; CurPos++ )
        {
            if ( para_End === this.Content[CurPos].Type )
            {
                ContentPos.Update( CurPos, Depth );
                return;
            }
        }

        // Не нашли para_End
        ContentPos.Update( ContentLen, Depth );
    }
};
//-----------------------------------------------------------------------------------
// Функции для работы с селектом
//-----------------------------------------------------------------------------------
ParaRun.prototype.Set_SelectionContentPos = function(StartContentPos, EndContentPos, Depth, StartFlag, EndFlag)
{
    var StartPos = 0;
    switch (StartFlag)
    {
        case  1: StartPos = 0; break;
        case -1: StartPos = this.Content.length; break;
        case  0: StartPos = StartContentPos.Get(Depth); break;
    }

    var EndPos = 0;
    switch (EndFlag)
    {
        case  1: EndPos = 0; break;
        case -1: EndPos = this.Content.length; break;
        case  0: EndPos = EndContentPos.Get(Depth); break;
    }

    var Selection = this.State.Selection;
    Selection.StartPos = StartPos;
    Selection.EndPos   = EndPos;
    Selection.Use      = true;
};
ParaRun.prototype.Set_ContentSelection = function(StartDocPos, EndDocPos, Depth, StartFlag, EndFlag)
{
    var StartPos = 0;
    switch (StartFlag)
    {
        case  1: StartPos = 0; break;
        case -1: StartPos = this.Content.length; break;
        case  0: StartPos = StartDocPos[Depth].Position; break;
    }

    var EndPos = 0;
    switch (EndFlag)
    {
        case  1: EndPos = 0; break;
        case -1: EndPos = this.Content.length; break;
        case  0: EndPos = EndDocPos[Depth].Position; break;
    }

    var Selection = this.State.Selection;
    Selection.StartPos = StartPos;
    Selection.EndPos   = EndPos;
    Selection.Use      = true;
};
ParaRun.prototype.Set_ContentPosition = function(DocPos, Depth, Flag)
{
    var Pos = 0;
    switch (Flag)
    {
        case  1: Pos = 0; break;
        case -1: Pos = this.Content.length; break;
        case  0: Pos = DocPos[Depth].Position; break;
    }

    this.State.ContentPos = Pos;
};
ParaRun.prototype.Set_SelectionAtEndPos = function()
{
    this.Set_SelectionContentPos(null, null, 0, -1, -1);
};

ParaRun.prototype.Set_SelectionAtStartPos = function()
{
    this.Set_SelectionContentPos(null, null, 0, 1, 1);
};

ParaRun.prototype.Selection_IsUse = function()
{
    return this.State.Selection.Use;
};

ParaRun.prototype.Is_SelectionUse = function()
{
    return this.State.Selection.Use;
};

ParaRun.prototype.Is_SelectedAll = function(Props)
{
    var Selection = this.State.Selection;
    if ( false === Selection.Use && true !== this.Is_Empty( Props ) )
        return false;

    var SkipAnchor = Props ? Props.SkipAnchor : false;
    var SkipEnd    = Props ? Props.SkipEnd    : false;

    var StartPos = Selection.StartPos;
    var EndPos   = Selection.EndPos;

    if ( EndPos < StartPos )
    {
        StartPos = Selection.EndPos;
        EndPos   = Selection.StartPos;
    }

    for ( var Pos = 0; Pos < StartPos; Pos++ )
    {
        var Item = this.Content[Pos];
        var ItemType = Item.Type;

        if ( !( ( true === SkipAnchor && ( para_Drawing === ItemType && true !== Item.Is_Inline() ) ) || ( true === SkipEnd && para_End === ItemType ) ) )
            return false;
    }

    var Count = this.Content.length;
    for ( var Pos = EndPos; Pos < Count; Pos++ )
    {
        var Item = this.Content[Pos];
        var ItemType = Item.Type;

        if ( !( ( true === SkipAnchor && ( para_Drawing === ItemType && true !== Item.Is_Inline() ) ) || ( true === SkipEnd && para_End === ItemType ) ) )
            return false;
    }

    return true;
};

ParaRun.prototype.Selection_CorrectLeftPos = function(Direction)
{
    if ( false === this.Selection.Use || true === this.Is_Empty( { SkipAnchor : true } ) )
        return true;

    var Selection = this.State.Selection;
    var StartPos = Math.min( Selection.StartPos, Selection.EndPos );
    var EndPos   = Math.max( Selection.StartPos, Selection.EndPos );

    for ( var Pos = 0; Pos < StartPos; Pos++ )
    {
        var Item = this.Content[Pos];
        if ( para_Drawing !== Item.Type || true === Item.Is_Inline() )
            return false;
    }

    for ( var Pos = StartPos; Pos < EndPos; Pos++ )
    {
        var Item = this.Content[Pos];
        if ( para_Drawing === Item.Type && true !== Item.Is_Inline() )
        {
            if ( 1 === Direction )
                Selection.StartPos = Pos + 1;
            else
                Selection.EndPos   = Pos + 1;
        }
        else
            return false;
    }

    return true;
};

ParaRun.prototype.Selection_Stop = function()
{
};

ParaRun.prototype.Selection_Remove = function()
{
    var Selection = this.State.Selection;

    Selection.Use      = false;
    Selection.StartPos = 0;
    Selection.EndPos   = 0;
};

ParaRun.prototype.Select_All = function(Direction)
{
    var Selection = this.State.Selection;

    Selection.Use      = true;

    if ( -1 === Direction )
    {
        Selection.StartPos = this.Content.length;
        Selection.EndPos   = 0;
    }
    else
    {
        Selection.StartPos = 0;
        Selection.EndPos   = this.Content.length;
    }
};

ParaRun.prototype.Selection_DrawRange = function(_CurLine, _CurRange, SelectionDraw)
{
    var CurLine  = _CurLine - this.StartLine;
    var CurRange = ( 0 === CurLine ? _CurRange - this.StartRange : _CurRange );

    var StartPos = this.protected_GetRangeStartPos(CurLine, CurRange);
    var EndPos   = this.protected_GetRangeEndPos(CurLine, CurRange);

    var Selection = this.State.Selection;
    var SelectionUse      = Selection.Use;
    var SelectionStartPos = Selection.StartPos;
    var SelectionEndPos   = Selection.EndPos;

    if ( SelectionStartPos > SelectionEndPos )
    {
        SelectionStartPos = Selection.EndPos;
        SelectionEndPos   = Selection.StartPos;
    }

    var FindStart = SelectionDraw.FindStart;

    for(var CurPos = StartPos; CurPos < EndPos; CurPos++)
    {
        var Item = this.Content[CurPos];
        var ItemType = Item.Type;
        var DrawSelection = false;

        if ( true === FindStart )
        {
            if ( true === Selection.Use && CurPos >= SelectionStartPos && CurPos < SelectionEndPos )
            {
                FindStart = false;

                DrawSelection = true;
            }
            else
            {
                if ( para_Drawing !== ItemType || true === Item.Is_Inline() )
                    SelectionDraw.StartX += Item.Get_WidthVisible();
            }
        }
        else
        {
            if ( true === Selection.Use && CurPos >= SelectionStartPos && CurPos < SelectionEndPos )
            {
                DrawSelection = true;
            }
        }

        if ( true === DrawSelection )
        {
            if (para_Drawing === ItemType && true !== Item.Is_Inline())
            {
                if (true === SelectionDraw.Draw)
                    Item.Draw_Selection();
            }
            else
                SelectionDraw.W += Item.Get_WidthVisible();
        }
    }

    SelectionDraw.FindStart = FindStart;
};

ParaRun.prototype.Selection_IsEmpty = function(CheckEnd)
{
    var Selection = this.State.Selection;
    if (true !== Selection.Use)
        return true;

    if(this.Type == para_Math_Run && this.IsPlaceholder())
        return true;

    var StartPos = Selection.StartPos;
    var EndPos   = Selection.EndPos;

    if ( StartPos > EndPos )
    {
        StartPos = Selection.EndPos;
        EndPos   = Selection.StartPos;
    }

    if ( true === CheckEnd )
        return ( EndPos > StartPos ? false : true );
    else if(this.Type == para_Math_Run && this.Is_Empty())
    {
        return false;
    }
    else
    {
        for ( var CurPos = StartPos; CurPos < EndPos; CurPos++ )
        {
            var ItemType = this.Content[CurPos].Type;
            if (para_End !== ItemType)
                return false;
        }
    }

    return true;
};

ParaRun.prototype.Selection_CheckParaEnd = function()
{
    var Selection = this.State.Selection;
    if ( true !== Selection.Use )
        return false;

    var StartPos = Selection.StartPos;
    var EndPos   = Selection.EndPos;

    if ( StartPos > EndPos )
    {
        StartPos = Selection.EndPos;
        EndPos   = Selection.StartPos;
    }

    for ( var CurPos = StartPos; CurPos < EndPos; CurPos++ )
    {
        var Item = this.Content[CurPos];

        if ( para_End === Item.Type )
            return true;
    }

    return false;
};

ParaRun.prototype.Selection_CheckParaContentPos = function(ContentPos, Depth, bStart, bEnd)
{
    var CurPos = ContentPos.Get(Depth);

    if (this.Selection.StartPos <= this.Selection.EndPos && this.Selection.StartPos <= CurPos && CurPos <= this.Selection.EndPos)
    {
        if ((true !== bEnd)   || (true === bEnd   && CurPos !== this.Selection.EndPos))
            return true;
    }
    else if (this.Selection.StartPos > this.Selection.EndPos && this.Selection.EndPos <= CurPos && CurPos <= this.Selection.StartPos)
    {
        if ((true !== bEnd)   || (true === bEnd   && CurPos !== this.Selection.StartPos))
            return true;
    }

    return false;
};
//-----------------------------------------------------------------------------------
// Функции для работы с настройками текста свойств
//-----------------------------------------------------------------------------------
ParaRun.prototype.Clear_TextFormatting = function( DefHyper )
{
    // Highlight и Lang не сбрасываются при очистке текстовых настроек

    this.Set_Bold( undefined );
    this.Set_Italic( undefined );
    this.Set_Strikeout( undefined );
    this.Set_Underline( undefined );
    this.Set_FontSize( undefined );
    this.Set_Color( undefined );
    this.Set_Unifill( undefined );
    this.Set_VertAlign( undefined );
    this.Set_Spacing( undefined );
    this.Set_DStrikeout( undefined );
    this.Set_Caps( undefined );
    this.Set_SmallCaps( undefined );
    this.Set_Position( undefined );
    this.Set_RFonts2( undefined );
    this.Set_RStyle( undefined );
    this.Set_Shd( undefined );
    this.Set_TextFill( undefined );
    this.Set_TextOutline( undefined );

    // Насильно заставим пересчитать стиль, т.к. как данная функция вызывается у параграфа, у которого мог смениться стиль
    this.Recalc_CompiledPr(true);
};

ParaRun.prototype.Get_TextPr = function()
{
    return this.Pr.Copy();
};

ParaRun.prototype.Get_FirstTextPr = function()
{
    return this.Pr;
};

ParaRun.prototype.Get_CompiledTextPr = function(Copy)
{
    if ( true === this.State.Selection.Use && true === this.Selection_CheckParaEnd() )
    {
        var ThisTextPr = this.Get_CompiledPr( true );

        var Para       = this.Paragraph;
        var EndTextPr  = Para.Get_CompiledPr2(false).TextPr.Copy();
        EndTextPr.Merge( Para.TextPr.Value );

        ThisTextPr = ThisTextPr.Compare( EndTextPr );

        return ThisTextPr;
    }
    else
        return this.Get_CompiledPr(Copy);
};

ParaRun.prototype.Recalc_CompiledPr = function(RecalcMeasure)
{
    this.RecalcInfo.TextPr  = true;

    // Если изменение какой-то текстовой настройки требует пересчета элементов
    if ( true === RecalcMeasure )
        this.RecalcInfo.Measure = true;

    // Если мы в формуле, тогда ее надо пересчитывать
    this.private_RecalcCtrPrp();
};

ParaRun.prototype.Recalc_RunsCompiledPr = function()
{
    this.Recalc_CompiledPr(true);
};

ParaRun.prototype.Get_CompiledPr = function(bCopy)
{
    if ( true === this.RecalcInfo.TextPr )
    {
        this.RecalcInfo.TextPr = false;
        this.CompiledPr = this.Internal_Compile_Pr();
    }

    if ( false === bCopy )
        return this.CompiledPr;
    else
        return this.CompiledPr.Copy(); // Отдаем копию объекта, чтобы никто не поменял извне настройки стиля
};

ParaRun.prototype.Internal_Compile_Pr = function ()
{
    if ( undefined === this.Paragraph || null === this.Paragraph )
    {
        // Сюда мы никогда не должны попадать, но на всякий случай,
        // чтобы не выпадало ошибок сгенерим дефолтовые настройки
        var TextPr = new CTextPr();
        TextPr.Init_Default();
        this.RecalcInfo.TextPr = true;
        return TextPr;
    }

    // Получим настройки текста, для данного параграфа
    var TextPr = this.Paragraph.Get_CompiledPr2(false).TextPr.Copy();

    // Если в прямых настройках задан стиль, тогда смержим настройки стиля
    if ( undefined != this.Pr.RStyle )
    {
        var Styles = this.Paragraph.Parent.Get_Styles();
        var StyleTextPr = Styles.Get_Pr( this.Pr.RStyle, styletype_Character ).TextPr;
        TextPr.Merge( StyleTextPr );
    }

    if(this.Type == para_Math_Run)
    {
        if (undefined === this.Parent || null === this.Parent)
        {
            // Сюда мы никогда не должны попадать, но на всякий случай,
            // чтобы не выпадало ошибок сгенерим дефолтовые настройки
            var TextPr = new CTextPr();
            TextPr.Init_Default();
            this.RecalcInfo.TextPr = true;
            return TextPr;
        }

        if(!this.IsNormalText()) // math text
        {
            // выставим дефолтные текстовые настройки  для математических Run
            var Styles = this.Paragraph.Parent.Get_Styles();
            // скопируем текстовые настройки прежде чем подменим на пустые

            var StyleDefaultTextPr = Styles.Default.TextPr.Copy();
            var MathFont = {Name : "Cambria Math", Index : -1};

            // Ascii - по умолчанию шрифт Cambria Math
            // hAnsi, eastAsia, cs - по умолчанию шрифты не Cambria Math, а те, которые компилируются в документе
            Styles.Default.TextPr.RFonts.Merge({Ascii: MathFont});

            var StyleId    = this.Paragraph.Style_Get();

            var Pr = Styles.Get_Pr( StyleId, styletype_Paragraph, null, null );

            TextPr.RFonts.Set_FromObject(Pr.TextPr.RFonts);

            // подменяем обратно
            Styles.Default.TextPr = StyleDefaultTextPr;
        }


        if(this.IsPlaceholder())
        {

            TextPr.Merge(this.Parent.GetCtrPrp());
            TextPr.Merge( this.Pr );            // Мержим прямые настройки данного рана
        }
        else
        {
            TextPr.Merge( this.Pr );            // Мержим прямые настройки данного рана

            if(!this.IsNormalText()) // math text
            {
                var MPrp = this.MathPrp.GetTxtPrp();
                TextPr.Merge(MPrp); // bold, italic
            }
        }
    }
    else
    {
        TextPr.Merge( this.Pr ); // Мержим прямые настройки данного рана
        if(this.Pr.Color && !this.Pr.Unifill)
        {
            TextPr.Unifill = undefined;
        }
    }

    // Для совместимости со старыми версиями запишем FontFamily
    TextPr.FontFamily.Name  = TextPr.RFonts.Ascii.Name;
    TextPr.FontFamily.Index = TextPr.RFonts.Ascii.Index;

    return TextPr;
};

// В данной функции мы жестко меняем настройки на те, которые пришли (т.е. полностью удаляем старые)
ParaRun.prototype.Set_Pr = function(TextPr)
{
    var OldValue = this.Pr;
    this.Pr = TextPr;

    History.Add( this, { Type : historyitem_ParaRun_TextPr, New : TextPr, Old : OldValue, Color : this.private_IsCollPrChangeMine() } );
    this.Recalc_CompiledPr(true);

    this.protected_UpdateSpellChecking();
    this.private_UpdateTrackRevisionOnChangeTextPr(true);
};

ParaRun.prototype.Apply_TextPr = function(TextPr, IncFontSize, ApplyToAll)
{
    var bReview = false;
    if (this.Paragraph && this.Paragraph.LogicDocument && true === this.Paragraph.LogicDocument.Is_TrackRevisions())
        bReview = true;

    var ReviewType = this.Get_ReviewType();
    var IsPrChange = this.Have_PrChange();
    if ( true === ApplyToAll )
    {
        if (true === bReview && true !== this.Have_PrChange())
            this.Add_PrChange();

        if ( undefined === IncFontSize )
        {
            this.Apply_Pr(TextPr);
        }
        else
        {
            var _TextPr = new CTextPr();
            var CurTextPr = this.Get_CompiledPr( false );

            this.private_AddCollPrChangeMine();
            this.Set_FontSize( FontSize_IncreaseDecreaseValue( IncFontSize, CurTextPr.FontSize ) );
        }

        // Дополнительно проверим, если у нас para_End лежит в данном ране и попадает в выделение, тогда
        // применим заданные настроки к символу конца параграфа

        // TODO: Возможно, стоит на этапе пересчета запонимать, лежит ли para_End в данном ране. Чтобы в каждом
        //       ране потом не бегать каждый раз по всему массиву в поисках para_End.

        var bEnd = false;
        var Count = this.Content.length;
        for ( var Pos = 0; Pos < Count; Pos++ )
        {
            if ( para_End === this.Content[Pos].Type )
            {
                bEnd = true;
                break;
            }
        }

        if ( true === bEnd )
        {
            if ( undefined === IncFontSize )
            {
                if(!TextPr.AscFill && !TextPr.AscLine && !TextPr.AscUnifill)
                {
                    this.Paragraph.TextPr.Apply_TextPr( TextPr );
                }
                else
                {
                    var EndTextPr = this.Paragraph.Get_CompiledPr2(false).TextPr.Copy();
                    EndTextPr.Merge( this.Paragraph.TextPr.Value );
                    if(TextPr.AscFill)
                    {
                        this.Paragraph.TextPr.Set_TextFill(CorrectUniFill(TextPr.AscFill, EndTextPr.TextFill, 0));
                    }
                    if(TextPr.AscUnifill)
                    {
                        this.Paragraph.TextPr.Set_Unifill(CorrectUniFill(TextPr.AscUnifill, EndTextPr.Unifill, 0));
                    }
                    if(TextPr.AscLine)
                    {
                        this.Paragraph.TextPr.Set_TextOutline(CorrectUniStroke(TextPr.AscLine, EndTextPr.TextOutline, 0));
                    }
                }
            }
            else
            {
                var Para = this.Paragraph;

                // Выставляем настройки для символа параграфа
                var EndTextPr = Para.Get_CompiledPr2(false).TextPr.Copy();
                EndTextPr.Merge( Para.TextPr.Value );

                // TODO: Как только перенесем историю изменений TextPr в сам класс CTextPr, переделать тут
                Para.TextPr.Set_FontSize( FontSize_IncreaseDecreaseValue( IncFontSize, EndTextPr.FontSize ) );
            }
        }
    }
    else
    {
        var Result = [];
        var LRun = this, CRun = null, RRun = null;

        if ( true === this.State.Selection.Use )
        {
            var StartPos = this.State.Selection.StartPos;
            var EndPos   = this.State.Selection.EndPos;

            var Direction = 1;
            if ( StartPos > EndPos )
            {
                var Temp = StartPos;
                StartPos = EndPos;
                EndPos = Temp;
                Direction = -1;
            }

            // Если выделено не до конца, тогда разделяем по последней точке
            if ( EndPos < this.Content.length )
            {
                RRun = LRun.Split_Run(EndPos);
                RRun.Set_ReviewType(ReviewType);
                if (IsPrChange)
                    RRun.Add_PrChange();
            }

            // Если выделено не с начала, тогда делим по начальной точке
            if ( StartPos > 0 )
            {
                CRun = LRun.Split_Run(StartPos);
                CRun.Set_ReviewType(ReviewType);
                if (IsPrChange)
                    CRun.Add_PrChange();
            }
            else
            {
                CRun = LRun;
                LRun = null;
            }

            if ( null !== LRun )
            {
                LRun.Selection.Use      = true;
                LRun.Selection.StartPos = LRun.Content.length;
                LRun.Selection.EndPos   = LRun.Content.length;
            }

            CRun.Select_All(Direction);

            if (true === bReview && true !== CRun.Have_PrChange())
                CRun.Add_PrChange();

            if ( undefined === IncFontSize )
                CRun.Apply_Pr( TextPr );
            else
            {
                var _TextPr = new CTextPr();
                var CurTextPr = this.Get_CompiledPr( false );

                CRun.private_AddCollPrChangeMine();
                CRun.Set_FontSize( FontSize_IncreaseDecreaseValue( IncFontSize, CurTextPr.FontSize ) );
            }

            if ( null !== RRun )
            {
                RRun.Selection.Use      = true;
                RRun.Selection.StartPos = 0;
                RRun.Selection.EndPos   = 0;
            }

            // Дополнительно проверим, если у нас para_End лежит в данном ране и попадает в выделение, тогда
            // применим заданные настроки к символу конца параграфа

            // TODO: Возможно, стоит на этапе пересчета запонимать, лежит ли para_End в данном ране. Чтобы в каждом
            //       ране потом не бегать каждый раз по всему массиву в поисках para_End.

            if ( true === this.Selection_CheckParaEnd() )
            {
                if ( undefined === IncFontSize )
                {
                    if(!TextPr.AscFill && !TextPr.AscLine && !TextPr.AscUnifill)
                    {
                        this.Paragraph.TextPr.Apply_TextPr( TextPr );
                    }
                    else
                    {
                        var EndTextPr = this.Paragraph.Get_CompiledPr2(false).TextPr.Copy();
                        EndTextPr.Merge( this.Paragraph.TextPr.Value );
                        if(TextPr.AscFill)
                        {
                            this.Paragraph.TextPr.Set_TextFill(CorrectUniFill(TextPr.AscFill, EndTextPr.TextFill, 0));
                        }
                        if(TextPr.AscUnifill)
                        {
                            this.Paragraph.TextPr.Set_Unifill(CorrectUniFill(TextPr.AscUnifill, EndTextPr.Unifill, 0));
                        }
                        if(TextPr.AscLine)
                        {
                            this.Paragraph.TextPr.Set_TextOutline(CorrectUniStroke(TextPr.AscLine, EndTextPr.TextOutline, 0));
                        }
                    }
                }
                else
                {
                    var Para = this.Paragraph;

                    // Выставляем настройки для символа параграфа
                    var EndTextPr = Para.Get_CompiledPr2(false).TextPr.Copy();
                    EndTextPr.Merge( Para.TextPr.Value );

                    // TODO: Как только перенесем историю изменений TextPr в сам класс CTextPr, переделать тут
                    Para.TextPr.Set_FontSize( FontSize_IncreaseDecreaseValue( IncFontSize, EndTextPr.FontSize ) );
                }
            }
        }
        else
        {
            var CurPos = this.State.ContentPos;

            // Если выделено не до конца, тогда разделяем по последней точке
            if ( CurPos < this.Content.length )
            {
                RRun = LRun.Split_Run(CurPos);
                RRun.Set_ReviewType(ReviewType);
                if (IsPrChange)
                    RRun.Add_PrChange();
            }

            if ( CurPos > 0 )
            {
                CRun = LRun.Split_Run(CurPos);
                CRun.Set_ReviewType(ReviewType);
                if (IsPrChange)
                    CRun.Add_PrChange();
            }
            else
            {
                CRun = LRun;
                LRun = null;
            }

            if ( null !== LRun )
                LRun.Selection_Remove();

            CRun.Selection_Remove();
            CRun.Cursor_MoveToStartPos();

            if (true === bReview && true !== CRun.Have_PrChange())
                CRun.Add_PrChange();

            if ( undefined === IncFontSize )
            {
                CRun.Apply_Pr( TextPr );
            }
            else
            {
                var _TextPr = new CTextPr();
                var CurTextPr = this.Get_CompiledPr( false );
                CRun.private_AddCollPrChangeMine();
                CRun.Set_FontSize( FontSize_IncreaseDecreaseValue( IncFontSize, CurTextPr.FontSize ) );
            }


            if ( null !== RRun )
                RRun.Selection_Remove();
        }

        Result.push( LRun );
        Result.push( CRun );
        Result.push( RRun );

        return Result;
    }
};

ParaRun.prototype.Split_Run = function(Pos)
{
    History.Add(this, {Type : historyitem_ParaRun_OnStartSplit, Pos : Pos});
    CollaborativeEditing.OnStart_SplitRun(this, Pos);

    // Создаем новый ран
    var bMathRun = this.Type == para_Math_Run;
    var NewRun = new ParaRun(this.Paragraph, bMathRun);

    // Копируем настройки
    NewRun.Set_Pr(this.Pr.Copy(true));

    if(bMathRun)
        NewRun.Set_MathPr(this.MathPrp.Copy());


    var OldCrPos = this.State.ContentPos;
    var OldSSPos = this.State.Selection.StartPos;
    var OldSEPos = this.State.Selection.EndPos;

    // Разделяем содержимое по ранам
    NewRun.Concat_ToContent( this.Content.slice(Pos) );
    this.Remove_FromContent( Pos, this.Content.length - Pos, true );

    // Подправим точки селекта и текущей позиции
    if ( OldCrPos >= Pos )
    {
        NewRun.State.ContentPos = OldCrPos - Pos;
        this.State.ContentPos   = this.Content.length;
    }
    else
    {
        NewRun.State.ContentPos = 0;
    }

    if ( OldSSPos >= Pos )
    {
        NewRun.State.Selection.StartPos = OldSSPos - Pos;
        this.State.Selection.StartPos   = this.Content.length;
    }
    else
    {
        NewRun.State.Selection.StartPos = 0;
    }

    if ( OldSEPos >= Pos )
    {
        NewRun.State.Selection.EndPos = OldSEPos - Pos;
        this.State.Selection.EndPos   = this.Content.length;
    }
    else
    {
        NewRun.State.Selection.EndPos = 0;
    }

    // Если были точки орфографии, тогда переместим их в новый ран
    var SpellingMarksCount = this.SpellingMarks.length;
    for ( var Index = 0; Index < SpellingMarksCount; Index++ )
    {
        var Mark    = this.SpellingMarks[Index];
        var MarkPos = ( true === Mark.Start ? Mark.Element.StartPos.Get(Mark.Depth) : Mark.Element.EndPos.Get(Mark.Depth) );

        if ( MarkPos >= Pos )
        {
            var MarkElement = Mark.Element;
            if ( true === Mark.Start )
            {
                //MarkElement.ClassesS[Mark.Depth]       = NewRun;
                MarkElement.StartPos.Data[Mark.Depth] -= Pos;
            }
            else
            {
                //MarkElement.ClassesE[Mark.Depth]     = NewRun;
                MarkElement.EndPos.Data[Mark.Depth] -= Pos;
            }

            NewRun.SpellingMarks.push( Mark );

            this.SpellingMarks.splice( Index, 1 );
            SpellingMarksCount--;
            Index--;
        }
    }

    History.Add(this, {Type : historyitem_ParaRun_OnEndSplit, NewRun : NewRun});
    CollaborativeEditing.OnEnd_SplitRun(NewRun);
    return NewRun;
};

ParaRun.prototype.Clear_TextPr = function()
{
    // Данная функция вызывается пока только при изменении стиля параграфа. Оставляем в этой ситуации язык неизмененным.
    var NewTextPr = new CTextPr();
    NewTextPr.Lang = this.Pr.Lang.Copy();
    this.Set_Pr( NewTextPr );
};

// В данной функции мы применяем приходящие настройки поверх старых, т.е. старые не удаляем
ParaRun.prototype.Apply_Pr = function(TextPr)
{
    this.private_AddCollPrChangeMine();

    if(this.Type == para_Math_Run && false === this.IsNormalText())
    {
        if(null === TextPr.Bold && null === TextPr.Italic)
            this.Math_Apply_Style(undefined);
        else
        {
            if(undefined != TextPr.Bold)
            {
                if(TextPr.Bold == true)
                {
                    if(this.MathPrp.sty == STY_ITALIC || this.MathPrp.sty == undefined)
                        this.Math_Apply_Style(STY_BI);
                    else if(this.MathPrp.sty == STY_PLAIN)
                        this.Math_Apply_Style(STY_BOLD);

                }
                else if(TextPr.Bold == false || TextPr.Bold == null)
                {
                    if(this.MathPrp.sty == STY_BI || this.MathPrp.sty == undefined)
                        this.Math_Apply_Style(STY_ITALIC);
                    else if(this.MathPrp.sty == STY_BOLD)
                        this.Math_Apply_Style(STY_PLAIN);
                }
            }

            if(undefined != TextPr.Italic)
            {
                if(TextPr.Italic == true)
                {
                    if(this.MathPrp.sty == STY_BOLD)
                        this.Math_Apply_Style(STY_BI);
                    else if(this.MathPrp.sty == STY_PLAIN || this.MathPrp.sty == undefined)
                        this.Math_Apply_Style(STY_ITALIC);
                }
                else if(TextPr.Italic == false || TextPr.Italic == null)
                {
                    if(this.MathPrp.sty == STY_BI)
                        this.Math_Apply_Style(STY_BOLD);
                    else if(this.MathPrp.sty == STY_ITALIC || this.MathPrp.sty == undefined)
                        this.Math_Apply_Style(STY_PLAIN);
                }
            }
        }
    }
    else
    {
        if ( undefined != TextPr.Bold )
            this.Set_Bold( null === TextPr.Bold ? undefined : TextPr.Bold );

        if( undefined != TextPr.Italic )
            this.Set_Italic( null === TextPr.Italic ? undefined : TextPr.Italic );
    }

    if ( undefined != TextPr.Strikeout )
        this.Set_Strikeout( null === TextPr.Strikeout ? undefined : TextPr.Strikeout );

    if ( undefined !== TextPr.Underline )
        this.Set_Underline( null === TextPr.Underline ? undefined : TextPr.Underline );

    if ( undefined != TextPr.FontSize )
        this.Set_FontSize( null === TextPr.FontSize ? undefined : TextPr.FontSize );

    if ( undefined !== TextPr.Color && undefined === TextPr.Unifill )
    {
        this.Set_Color( null === TextPr.Color ? undefined : TextPr.Color );
        this.Set_Unifill( undefined );
        this.Set_TextFill(undefined);
    }

    if ( undefined !== TextPr.Unifill )
    {
        this.Set_Unifill(null === TextPr.Unifill ? undefined : TextPr.Unifill);
        this.Set_Color(undefined);
        this.Set_TextFill(undefined);
    }
    else if(undefined !== TextPr.AscUnifill && this.Paragraph)
    {
        if(!this.Paragraph.bFromDocument)
        {
            var oCompiledPr = this.Get_CompiledPr(true);
            this.Set_Unifill(CorrectUniFill(TextPr.AscUnifill, oCompiledPr.Unifill, 0), isRealObject(TextPr.AscUnifill) && TextPr.AscUnifill.asc_CheckForseSet() );
            this.Set_Color(undefined);
            this.Set_TextFill(undefined);
        }
    }

    if(undefined !== TextPr.TextFill)
    {
        this.Set_Unifill(undefined);
        this.Set_Color(undefined);
        this.Set_TextFill(null === TextPr.TextFill ? undefined : TextPr.TextFill);
    }
    else if(undefined !== TextPr.AscFill && this.Paragraph)
    {
        var oMergeUnifill, oColor;
        if(this.Paragraph.bFromDocument)
        {
            var oCompiledPr = this.Get_CompiledPr(true);
            if(oCompiledPr.TextFill)
            {
                oMergeUnifill = oCompiledPr.TextFill;
            }
            else if(oCompiledPr.Unifill)
            {
                oMergeUnifill = oCompiledPr.Unifill;
            }
            else if(oCompiledPr.Color)
            {
                oColor = oCompiledPr.Color;
                oMergeUnifill = CreateUnfilFromRGB(oColor.r, oColor.g, oColor.b);
            }
            this.Set_Unifill(undefined);
            this.Set_Color(undefined);
            this.Set_TextFill(CorrectUniFill(TextPr.AscFill, oMergeUnifill, 0), isRealObject(TextPr.AscFill) && TextPr.AscFill.asc_CheckForseSet());
        }
    }

    if(undefined !== TextPr.TextOutline)
    {
        this.Set_TextOutline(null === TextPr.TextOutline ? undefined : TextPr.TextOutline);
    }
    else if(undefined !== TextPr.AscLine && this.Paragraph)
    {
		var oCompiledPr = this.Get_CompiledPr(true);
		this.Set_TextOutline(CorrectUniStroke(TextPr.AscLine, oCompiledPr.TextOutline, 0));
    }

    if ( undefined != TextPr.VertAlign )
        this.Set_VertAlign( null === TextPr.VertAlign ? undefined : TextPr.VertAlign );

    if ( undefined != TextPr.HighLight )
        this.Set_HighLight( null === TextPr.HighLight ? undefined : TextPr.HighLight );

    if ( undefined !== TextPr.RStyle )
        this.Set_RStyle( null === TextPr.RStyle ? undefined : TextPr.RStyle );

    if ( undefined != TextPr.Spacing )
        this.Set_Spacing( null === TextPr.Spacing ? undefined : TextPr.Spacing );

    if ( undefined != TextPr.DStrikeout )
        this.Set_DStrikeout( null === TextPr.DStrikeout ? undefined : TextPr.DStrikeout );

    if ( undefined != TextPr.Caps )
        this.Set_Caps( null === TextPr.Caps ? undefined : TextPr.Caps );

    if ( undefined != TextPr.SmallCaps )
        this.Set_SmallCaps( null === TextPr.SmallCaps ? undefined : TextPr.SmallCaps );

    if ( undefined != TextPr.Position )
        this.Set_Position( null === TextPr.Position ? undefined : TextPr.Position );

    if ( undefined != TextPr.RFonts )
    {
       if(this.Type == para_Math_Run && !this.IsNormalText()) // при смене Font в этом случае (даже на Cambria Math) cs, eastAsia не меняются
        {
            // только для редактирования
            // делаем так для проверки действительно ли нужно сменить Font, чтобы при смене других текстовых настроек не выставился Cambria Math (TextPr.RFonts приходит всегда в виде объекта)
            if(TextPr.RFonts.Ascii !== undefined || TextPr.RFonts.HAnsi !== undefined)
            {
                var RFonts = new CRFonts();
                RFonts.Set_All("Cambria Math", -1);

                this.Set_RFonts2(RFonts);
            }
        }
        else
            this.Set_RFonts2(TextPr.RFonts);
    }


    if ( undefined != TextPr.Lang )
        this.Set_Lang2( TextPr.Lang );

    if ( undefined !== TextPr.Shd )
        this.Set_Shd( TextPr.Shd );
};

ParaRun.prototype.Have_PrChange = function()
{
    return this.Pr.Have_PrChange();
};

ParaRun.prototype.Get_PrReviewColor = function()
{
    if (this.Pr.ReviewInfo)
        return this.Pr.ReviewInfo.Get_Color();

    return REVIEW_COLOR;
};

ParaRun.prototype.Add_PrChange = function()
{
    if (false === this.Have_PrChange())
    {
        this.Pr.Add_PrChange();
        History.Add(this, {Type : historyitem_ParaRun_PrChange, New : {PrChange : this.Pr.PrChange, ReviewInfo : this.Pr.ReviewInfo}, Old : {PrChange : undefined, ReviewInfo : undefined}});
        this.private_UpdateTrackRevisions();
    }
};

ParaRun.prototype.Set_PrChange = function(PrChange, ReviewInfo)
{
    History.Add(this, {Type : historyitem_ParaRun_PrChange, New : {PrChange : PrChange, ReviewInfo : ReviewInfo ? ReviewInfo.Copy() : undefined}, Old : {PrChange : this.Pr.PrChange, ReviewInfo : this.Pr.ReviewInfo ? this.Pr.ReviewInfo.Copy() : undefined}});
    this.Pr.Set_PrChange(PrChange, ReviewInfo);
    this.private_UpdateTrackRevisions();
};

ParaRun.prototype.Remove_PrChange = function()
{
    if (true === this.Have_PrChange())
    {
        History.Add(this, {Type : historyitem_ParaRun_PrChange, New : {PrChange : undefined, ReviewInfo : undefined}, Old : {PrChange : this.Pr.PrChange, ReviewInfo : this.Pr.ReviewInfo}});
        this.Pr.Remove_PrChange();
        this.private_UpdateTrackRevisions();
    }
};

ParaRun.prototype.Reject_PrChange = function()
{
    if (true === this.Have_PrChange())
    {
        this.Set_Pr(this.Pr.PrChange);
        this.Remove_PrChange();
    }
};

ParaRun.prototype.Accept_PrChange = function()
{
    this.Remove_PrChange();
};

ParaRun.prototype.Get_DiffPrChange = function()
{
    return this.Pr.Get_DiffPrChange();
};

ParaRun.prototype.Set_Bold = function(Value)
{
    if ( Value !== this.Pr.Bold )
    {
        var OldValue = this.Pr.Bold;
        this.Pr.Bold = Value;

        History.Add( this, { Type : historyitem_ParaRun_Bold, New : Value, Old : OldValue, Color : this.private_IsCollPrChangeMine() } );

        this.Recalc_CompiledPr(true);
        this.private_UpdateTrackRevisionOnChangeTextPr(true);
    }
};

ParaRun.prototype.Get_Bold = function()
{
    return this.Get_CompiledPr(false).Bold;
};

ParaRun.prototype.Set_Italic = function(Value)
{
    if ( Value !== this.Pr.Italic )
    {
        var OldValue = this.Pr.Italic;
        this.Pr.Italic = Value;

        History.Add( this, { Type : historyitem_ParaRun_Italic, New : Value, Old : OldValue, Color : this.private_IsCollPrChangeMine() } );

        this.Recalc_CompiledPr(true);
        this.private_UpdateTrackRevisionOnChangeTextPr(true);
    }
};

ParaRun.prototype.Get_Italic = function()
{
    return this.Get_CompiledPr(false).Italic;
};

ParaRun.prototype.Set_Strikeout = function(Value)
{
    if ( Value !== this.Pr.Strikeout )
    {
        var OldValue = this.Pr.Strikeout;
        this.Pr.Strikeout = Value;

        History.Add( this, { Type : historyitem_ParaRun_Strikeout, New : Value, Old : OldValue, Color : this.private_IsCollPrChangeMine() } );

        this.Recalc_CompiledPr(false);
        this.private_UpdateTrackRevisionOnChangeTextPr(true);
    }
};

ParaRun.prototype.Get_Strikeout = function()
{
    return this.Get_CompiledPr(false).Strikeout;
};

ParaRun.prototype.Set_Underline = function(Value)
{
    if ( Value !== this.Pr.Underline )
    {
        var OldValue = this.Pr.Underline;
        this.Pr.Underline = Value;

        History.Add( this, { Type : historyitem_ParaRun_Underline, New : Value, Old : OldValue, Color : this.private_IsCollPrChangeMine() } );

        this.Recalc_CompiledPr(false);
        this.private_UpdateTrackRevisionOnChangeTextPr(true);
    }
};

ParaRun.prototype.Get_Underline = function()
{
    return this.Get_CompiledPr(false).Underline;
};

ParaRun.prototype.Set_FontSize = function(Value)
{
    if ( Value !== this.Pr.FontSize )
    {
        var OldValue = this.Pr.FontSize;
        this.Pr.FontSize = Value;

        History.Add( this, { Type : historyitem_ParaRun_FontSize, New : Value, Old : OldValue, Color : this.private_IsCollPrChangeMine() } );

        this.Recalc_CompiledPr(true);
        this.private_UpdateTrackRevisionOnChangeTextPr(true);
    }
};

ParaRun.prototype.Get_FontSize = function()
{
    return this.Get_CompiledPr(false).FontSize;
};

ParaRun.prototype.Set_Color = function(Value)
{
    if ( ( undefined === Value && undefined !== this.Pr.Color ) || ( Value instanceof CDocumentColor && ( undefined === this.Pr.Color || false === Value.Compare(this.Pr.Color) ) ) )
    {
        var OldValue = this.Pr.Color;
        this.Pr.Color = Value;

        History.Add( this, { Type : historyitem_ParaRun_Color, New : Value, Old : OldValue, Color : this.private_IsCollPrChangeMine() } );

        this.Recalc_CompiledPr(false);
        this.private_UpdateTrackRevisionOnChangeTextPr(true);
    }
};

ParaRun.prototype.Set_Unifill = function(Value, bForce)
{
    if ( ( undefined === Value && undefined !== this.Pr.Unifill ) || ( Value instanceof CUniFill && ( undefined === this.Pr.Unifill || false === CompareUnifillBool(this.Pr.Unifill, Value) ) ) || bForce )
    {
        var OldValue = this.Pr.Unifill;
        this.Pr.Unifill = Value;

        History.Add( this, { Type : historyitem_ParaRun_Unifill, New : Value, Old : OldValue, Color : this.private_IsCollPrChangeMine() } );

        this.Recalc_CompiledPr(false);
        this.private_UpdateTrackRevisionOnChangeTextPr(true);
    }
};
ParaRun.prototype.Set_TextFill = function(Value, bForce)
{
    if ( ( undefined === Value && undefined !== this.Pr.TextFill ) || ( Value instanceof CUniFill && ( undefined === this.Pr.TextFill || false === CompareUnifillBool(this.Pr.TextFill.IsIdentical, Value) ) ) || bForce )
    {
        var OldValue = this.Pr.TextFill;
        this.Pr.TextFill = Value;

        History.Add( this, { Type : historyitem_ParaRun_TextFill, New : Value, Old : OldValue, Color : this.private_IsCollPrChangeMine() } );

        this.Recalc_CompiledPr(false);
        this.private_UpdateTrackRevisionOnChangeTextPr(true);
    }
};

ParaRun.prototype.Set_TextOutline = function(Value)
{
    if ( ( undefined === Value && undefined !== this.Pr.TextOutline ) || ( Value instanceof CLn && ( undefined === this.Pr.TextOutline || false === this.Pr.TextOutline.IsIdentical(Value) ) ) )
    {
        var OldValue = this.Pr.TextOutline;
        this.Pr.TextOutline = Value;

        History.Add( this, { Type : historyitem_ParaRun_TextOutline, New : Value, Old : OldValue, Color : this.private_IsCollPrChangeMine() } );

        this.Recalc_CompiledPr(false);
        this.private_UpdateTrackRevisionOnChangeTextPr(true);
    }
};

ParaRun.prototype.Get_Color = function()
{
    return this.Get_CompiledPr(false).Color;
};

ParaRun.prototype.Set_VertAlign = function(Value)
{
    if ( Value !== this.Pr.VertAlign )
    {
        var OldValue = this.Pr.VertAlign;
        this.Pr.VertAlign = Value;

        History.Add( this, { Type : historyitem_ParaRun_VertAlign, New : Value, Old : OldValue, Color : this.private_IsCollPrChangeMine() } );

        this.Recalc_CompiledPr(true);
        this.private_UpdateTrackRevisionOnChangeTextPr(true);
    }
};

ParaRun.prototype.Get_VertAlign = function()
{
    return this.Get_CompiledPr(false).VertAlign;
};

ParaRun.prototype.Set_HighLight = function(Value)
{
    var OldValue = this.Pr.HighLight;
    if ( (undefined === Value && undefined !== OldValue) || ( highlight_None === Value && highlight_None !== OldValue ) || ( Value instanceof CDocumentColor && ( undefined === OldValue || highlight_None === OldValue || false === Value.Compare(OldValue) ) ) )
    {
        this.Pr.HighLight = Value;
        History.Add( this, { Type : historyitem_ParaRun_HighLight, New : Value, Old : OldValue, Color : this.private_IsCollPrChangeMine() } );

        this.Recalc_CompiledPr(false);
        this.private_UpdateTrackRevisionOnChangeTextPr(true);
    }
};

ParaRun.prototype.Get_HighLight = function()
{
    return this.Get_CompiledPr(false).HighLight;
};

ParaRun.prototype.Set_RStyle = function(Value)
{
    if ( Value !== this.Pr.RStyle )
    {
        var OldValue = this.Pr.RStyle;
        this.Pr.RStyle = Value;

        History.Add( this, { Type : historyitem_ParaRun_RStyle, New : Value, Old : OldValue, Color : this.private_IsCollPrChangeMine() } );

        this.Recalc_CompiledPr(true);
        this.private_UpdateTrackRevisionOnChangeTextPr(true);
    }
};

ParaRun.prototype.Set_Spacing = function(Value)
{
    if (Value !== this.Pr.Spacing)
    {
        var OldValue = this.Pr.Spacing;
        this.Pr.Spacing = Value;

        History.Add( this, { Type : historyitem_ParaRun_Spacing, New : Value, Old : OldValue, Color : this.private_IsCollPrChangeMine() } );

        this.Recalc_CompiledPr(true);
        this.private_UpdateTrackRevisionOnChangeTextPr(true);
    }
};

ParaRun.prototype.Get_Spacing = function()
{
    return this.Get_CompiledPr(false).Spacing;
};

ParaRun.prototype.Set_DStrikeout = function(Value)
{
    if ( Value !== this.Pr.Value )
    {
        var OldValue = this.Pr.DStrikeout;
        this.Pr.DStrikeout = Value;

        History.Add( this, { Type : historyitem_ParaRun_DStrikeout, New : Value, Old : OldValue, Color : this.private_IsCollPrChangeMine() } );

        this.Recalc_CompiledPr(false);
        this.private_UpdateTrackRevisionOnChangeTextPr(true);
    }
};

ParaRun.prototype.Get_DStrikeout = function()
{
    return this.Get_CompiledPr(false).DStrikeout;
};

ParaRun.prototype.Set_Caps = function(Value)
{
    if ( Value !== this.Pr.Caps )
    {
        var OldValue = this.Pr.Caps;
        this.Pr.Caps = Value;

        History.Add( this, { Type : historyitem_ParaRun_Caps, New : Value, Old : OldValue, Color : this.private_IsCollPrChangeMine() } );
        this.Recalc_CompiledPr(true);
        this.private_UpdateTrackRevisionOnChangeTextPr(true);
    }
};

ParaRun.prototype.Get_Caps = function()
{
    return this.Get_CompiledPr(false).Caps;
};

ParaRun.prototype.Set_SmallCaps = function(Value)
{
    if ( Value !== this.Pr.SmallCaps )
    {
        var OldValue = this.Pr.SmallCaps;
        this.Pr.SmallCaps = Value;

        History.Add( this, { Type : historyitem_ParaRun_SmallCaps, New : Value, Old : OldValue, Color : this.private_IsCollPrChangeMine() } );
        this.Recalc_CompiledPr(true);
        this.private_UpdateTrackRevisionOnChangeTextPr(true);
    }
};

ParaRun.prototype.Get_SmallCaps = function()
{
    return this.Get_CompiledPr(false).SmallCaps;
};

ParaRun.prototype.Set_Position = function(Value)
{
    if ( Value !== this.Pr.Position )
    {
        var OldValue = this.Pr.Position;
        this.Pr.Position = Value;

        History.Add( this, { Type : historyitem_ParaRun_Position, New : Value, Old : OldValue, Color : this.private_IsCollPrChangeMine() } );
        this.Recalc_CompiledPr(false);
        this.private_UpdateTrackRevisionOnChangeTextPr(true);

        this.YOffset = this.Get_Position();
    }
};

ParaRun.prototype.Get_Position = function()
{
    return this.Get_CompiledPr(false).Position;
};

ParaRun.prototype.Set_RFonts = function(Value)
{
    var OldValue = this.Pr.RFonts;
    this.Pr.RFonts = Value;

    History.Add( this, { Type : historyitem_ParaRun_RFonts, New : Value, Old : OldValue, Color : this.private_IsCollPrChangeMine() } );

    this.Recalc_CompiledPr(true);
    this.private_UpdateTrackRevisionOnChangeTextPr(true);
};

ParaRun.prototype.Get_RFonts = function()
{
    return this.Get_CompiledPr(false).RFonts;
};

ParaRun.prototype.Set_RFonts2 = function(RFonts)
{
    if ( undefined != RFonts )
    {
        if ( undefined != RFonts.Ascii )
            this.Set_RFonts_Ascii( RFonts.Ascii );

        if ( undefined != RFonts.HAnsi )
            this.Set_RFonts_HAnsi( RFonts.HAnsi );

        if ( undefined != RFonts.CS )
            this.Set_RFonts_CS( RFonts.CS );

        if ( undefined != RFonts.EastAsia )
            this.Set_RFonts_EastAsia( RFonts.EastAsia );

        if ( undefined != RFonts.Hint )
            this.Set_RFonts_Hint( RFonts.Hint );
    }
    else
    {
        this.Set_RFonts_Ascii( undefined );
        this.Set_RFonts_HAnsi( undefined );
        this.Set_RFonts_CS( undefined );
        this.Set_RFonts_EastAsia( undefined );
        this.Set_RFonts_Hint( undefined );
    }
};
ParaRun.prototype.Set_RFont_ForMathRun = function()
{
    this.Set_RFonts_Ascii({Name : "Cambria Math", Index : -1});
    this.Set_RFonts_CS({Name : "Cambria Math", Index : -1});
    this.Set_RFonts_EastAsia({Name : "Cambria Math", Index : -1});
    this.Set_RFonts_HAnsi({Name : "Cambria Math", Index : -1});
};
ParaRun.prototype.Set_RFonts_Ascii = function(Value)
{
    if ( Value !== this.Pr.RFonts.Ascii )
    {
        var OldValue = this.Pr.RFonts.Ascii;
        this.Pr.RFonts.Ascii = Value;

        History.Add( this, { Type : historyitem_ParaRun_RFonts_Ascii, New : Value, Old : OldValue, Color : this.private_IsCollPrChangeMine() } );
        this.Recalc_CompiledPr(true);
        this.private_UpdateTrackRevisionOnChangeTextPr(true);
    }
};

ParaRun.prototype.Set_RFonts_HAnsi = function(Value)
{
    if ( Value !== this.Pr.RFonts.HAnsi )
    {
        var OldValue = this.Pr.RFonts.HAnsi;
        this.Pr.RFonts.HAnsi = Value;

        History.Add( this, { Type : historyitem_ParaRun_RFonts_HAnsi, New : Value, Old : OldValue, Color : this.private_IsCollPrChangeMine() } );
        this.Recalc_CompiledPr(true);
        this.private_UpdateTrackRevisionOnChangeTextPr(true);
    }
};

ParaRun.prototype.Set_RFonts_CS = function(Value)
{
    if ( Value !== this.Pr.RFonts.CS )
    {
        var OldValue = this.Pr.RFonts.CS;
        this.Pr.RFonts.CS = Value;

        History.Add( this, { Type : historyitem_ParaRun_RFonts_CS, New : Value, Old : OldValue, Color : this.private_IsCollPrChangeMine() } );
        this.Recalc_CompiledPr(true);
        this.private_UpdateTrackRevisionOnChangeTextPr(true);
    }
};

ParaRun.prototype.Set_RFonts_EastAsia = function(Value)
{
    if ( Value !== this.Pr.RFonts.EastAsia )
    {
        var OldValue = this.Pr.RFonts.EastAsia;
        this.Pr.RFonts.EastAsia = Value;

        History.Add( this, { Type : historyitem_ParaRun_RFonts_EastAsia, New : Value, Old : OldValue, Color : this.private_IsCollPrChangeMine() } );
        this.Recalc_CompiledPr(true);
        this.private_UpdateTrackRevisionOnChangeTextPr(true);
    }
};

ParaRun.prototype.Set_RFonts_Hint = function(Value)
{
    if ( Value !== this.Pr.RFonts.Hint )
    {
        var OldValue = this.Pr.RFonts.Hint;
        this.Pr.RFonts.Hint = Value;

        History.Add( this, { Type : historyitem_ParaRun_RFonts_Hint, New : Value, Old : OldValue, Color : this.private_IsCollPrChangeMine() } );
        this.Recalc_CompiledPr(true);
        this.private_UpdateTrackRevisionOnChangeTextPr(true);
    }
};

ParaRun.prototype.Set_Lang = function(Value)
{
    var OldValue = this.Pr.Lang;

    this.Pr.Lang = new CLang();
    if ( undefined != Value )
        this.Pr.Lang.Set_FromObject( Value );

    History.Add( this, { Type : historyitem_ParaRun_Lang, New : this.Pr.Lang, Old : OldValue, Color : this.private_IsCollPrChangeMine() } );
    this.Recalc_CompiledPr(false);
    this.private_UpdateTrackRevisionOnChangeTextPr(true);
};

ParaRun.prototype.Set_Lang2 = function(Lang)
{
    if ( undefined != Lang )
    {
        if ( undefined != Lang.Bidi )
            this.Set_Lang_Bidi( Lang.Bidi );

        if ( undefined != Lang.EastAsia )
            this.Set_Lang_EastAsia( Lang.EastAsia );

        if ( undefined != Lang.Val )
            this.Set_Lang_Val( Lang.Val );

        this.protected_UpdateSpellChecking();
    }
};

ParaRun.prototype.Set_Lang_Bidi = function(Value)
{
    if ( Value !== this.Pr.Lang.Bidi )
    {
        var OldValue = this.Pr.Lang.Bidi;
        this.Pr.Lang.Bidi = Value;

        History.Add( this, { Type : historyitem_ParaRun_Lang_Bidi, New : Value, Old : OldValue, Color : this.private_IsCollPrChangeMine() } );
        this.Recalc_CompiledPr(false);
        this.private_UpdateTrackRevisionOnChangeTextPr(true);
    }
};

ParaRun.prototype.Set_Lang_EastAsia = function(Value)
{
    if ( Value !== this.Pr.Lang.EastAsia )
    {
        var OldValue = this.Pr.Lang.EastAsia;
        this.Pr.Lang.EastAsia = Value;

        History.Add( this, { Type : historyitem_ParaRun_Lang_EastAsia, New : Value, Old : OldValue, Color : this.private_IsCollPrChangeMine() } );
        this.Recalc_CompiledPr(false);
        this.private_UpdateTrackRevisionOnChangeTextPr(true);
    }
};

ParaRun.prototype.Set_Lang_Val = function(Value)
{
    if ( Value !== this.Pr.Lang.Val )
    {
        var OldValue = this.Pr.Lang.Val;
        this.Pr.Lang.Val = Value;

        History.Add( this, { Type : historyitem_ParaRun_Lang_Val, New : Value, Old : OldValue, Color : this.private_IsCollPrChangeMine() } );
        this.Recalc_CompiledPr(false);
        this.private_UpdateTrackRevisionOnChangeTextPr(true);
    }
};

ParaRun.prototype.Set_Shd = function(Shd)
{
    if ( (undefined === this.Pr.Shd && undefined === Shd) || (undefined !== this.Pr.Shd && undefined !== Shd && true === this.Pr.Shd.Compare( Shd ) ) )
        return;

    var OldShd = this.Pr.Shd;

    if ( undefined !== Shd )
    {
        this.Pr.Shd = new CDocumentShd();
        this.Pr.Shd.Set_FromObject( Shd );
    }
    else
        this.Pr.Shd = undefined;

    History.Add( this, { Type : historyitem_ParaRun_Shd, New : this.Pr.Shd, Old : OldShd, Color : this.private_IsCollPrChangeMine() } );
    this.Recalc_CompiledPr(false);
    this.private_UpdateTrackRevisionOnChangeTextPr(true);
};

//-----------------------------------------------------------------------------------
// Undo/Redo функции
//-----------------------------------------------------------------------------------
ParaRun.prototype.Undo = function(Data)
{
    var Type = Data.Type;

    switch ( Type )
    {
        case historyitem_ParaRun_AddItem :
        {
            this.Content.splice( Data.Pos, Data.EndPos - Data.Pos + 1 );

            this.RecalcInfo.Measure = true;
            this.protected_UpdateSpellChecking();
            this.private_UpdateTrackRevisionOnChangeContent(false);

            break;
        }

        case historyitem_ParaRun_RemoveItem :
        {
            var Pos = Data.Pos;

            var Array_start = this.Content.slice( 0, Pos );
            var Array_end   = this.Content.slice( Pos );

            this.Content = Array_start.concat( Data.Items, Array_end );

            this.RecalcInfo.Measure = true;
            this.protected_UpdateSpellChecking();
            this.private_UpdateTrackRevisionOnChangeContent(false);

            break;
        }

        case historyitem_ParaRun_TextPr:
        {
            if ( undefined != Data.Old )
                this.Pr = Data.Old;
            else
                this.Pr = undefined;

            this.Recalc_CompiledPr(true);
            this.private_UpdateTrackRevisionOnChangeTextPr(false);

            break;
        }

        case historyitem_ParaRun_Bold:
        {
            if ( undefined != Data.Old )
                this.Pr.Bold = Data.Old;
            else
                this.Pr.Bold = undefined;

            this.Recalc_CompiledPr(true);
            this.private_UpdateTrackRevisionOnChangeTextPr(false);

            break;
        }

        case historyitem_ParaRun_Italic:
        {
            if ( undefined != Data.Old )
                this.Pr.Italic = Data.Old;
            else
                this.Pr.Italic = undefined;

            this.Recalc_CompiledPr(true);
            this.private_UpdateTrackRevisionOnChangeTextPr(false);

            break;
        }

        case historyitem_ParaRun_Strikeout:
        {
            if ( undefined != Data.Old )
                this.Pr.Strikeout = Data.Old;
            else
                this.Pr.Strikeout = undefined;

            this.Recalc_CompiledPr(false);
            this.private_UpdateTrackRevisionOnChangeTextPr(false);

            break;
        }

        case historyitem_ParaRun_Underline:
        {
            if ( undefined != Data.Old )
                this.Pr.Underline = Data.Old;
            else
                this.Pr.Underline = undefined;

            this.Recalc_CompiledPr(false);
            this.private_UpdateTrackRevisionOnChangeTextPr(false);

            break;
        }

        case historyitem_ParaRun_FontSize:
        {
            if ( undefined != Data.Old )
                this.Pr.FontSize = Data.Old;
            else
                this.Pr.FontSize = undefined;

            this.Recalc_CompiledPr(true);
            this.private_UpdateTrackRevisionOnChangeTextPr(false);

            break;
        }

        case historyitem_ParaRun_Color:
        {
            if ( undefined != Data.Old )
                this.Pr.Color = Data.Old;
            else
                this.Pr.Color = undefined;

            this.Recalc_CompiledPr(false);
            this.private_UpdateTrackRevisionOnChangeTextPr(false);

            break;
        }
        case historyitem_ParaRun_Unifill:
        {
            if ( undefined != Data.Old )
                this.Pr.Unifill = Data.Old;
            else
                this.Pr.Unifill = undefined;

            this.Recalc_CompiledPr(false);
            this.private_UpdateTrackRevisionOnChangeTextPr(false);
            break;
        }

        case historyitem_ParaRun_TextFill:
        {
            if ( undefined != Data.Old )
                this.Pr.TextFill = Data.Old;
            else
                this.Pr.TextFill = undefined;

            this.Recalc_CompiledPr(false);
            this.private_UpdateTrackRevisionOnChangeTextPr(false);
            break;
        }
        case historyitem_ParaRun_TextOutline:
        {
            if ( undefined != Data.Old )
                this.Pr.TextOutline = Data.Old;
            else
                this.Pr.TextOutline = undefined;

            this.Recalc_CompiledPr(false);
            this.private_UpdateTrackRevisionOnChangeTextPr(false);
            break;
        }

        case historyitem_ParaRun_VertAlign:
        {
            if ( undefined != Data.Old )
                this.Pr.VertAlign = Data.Old;
            else
                this.Pr.VertAlign = undefined;

            this.Recalc_CompiledPr(true);
            this.private_UpdateTrackRevisionOnChangeTextPr(false);
            break;
        }

        case historyitem_ParaRun_HighLight:
        {
            if ( undefined != Data.Old )
                this.Pr.HighLight = Data.Old;
            else
                this.Pr.HighLight = undefined;

            this.Recalc_CompiledPr(false);
            this.private_UpdateTrackRevisionOnChangeTextPr(false);
            break;
        }

        case historyitem_ParaRun_RStyle:
        {
            if ( undefined != Data.Old )
                this.Pr.RStyle = Data.Old;
            else
                this.Pr.RStyle = undefined;

            this.Recalc_CompiledPr(true);
            this.private_UpdateTrackRevisionOnChangeTextPr(false);
            break;
        }

        case historyitem_ParaRun_Spacing:
        {
            if ( undefined != Data.Old )
                this.Pr.Spacing = Data.Old;
            else
                this.Pr.Spacing = undefined;

            this.Recalc_CompiledPr(true);
            this.private_UpdateTrackRevisionOnChangeTextPr(false);
            break;
        }
        case historyitem_ParaRun_DStrikeout:
        {
            if ( undefined != Data.Old )
                this.Pr.DStrikeout = Data.Old;
            else
                this.Pr.DStrikeout = undefined;

            this.Recalc_CompiledPr(false);
            this.private_UpdateTrackRevisionOnChangeTextPr(false);
            break;
        }
        case historyitem_ParaRun_Caps:
        {
            if ( undefined != Data.Old )
                this.Pr.Caps = Data.Old;
            else
                this.Pr.Caps = undefined;

            this.Recalc_CompiledPr(true);
            this.private_UpdateTrackRevisionOnChangeTextPr(false);
            break;
        }
        case historyitem_ParaRun_SmallCaps:
        {
            if ( undefined != Data.Old )
                this.Pr.SmallCaps = Data.Old;
            else
                this.Pr.SmallCaps = undefined;

            this.Recalc_CompiledPr(true);
            this.private_UpdateTrackRevisionOnChangeTextPr(false);
            break;
        }

        case historyitem_ParaRun_Position:
        {
            if ( undefined != Data.Old )
                this.Pr.Position = Data.Old;
            else
                this.Pr.Position = undefined;

            this.Recalc_CompiledPr(true);
            this.private_UpdateTrackRevisionOnChangeTextPr(false);
            break;
        }

        case historyitem_ParaRun_RFonts:
        {
            if ( undefined != Data.Old )
                this.Pr.RFonts = Data.Old;
            else
                this.Pr.RFonts = new CRFonts();

            this.Recalc_CompiledPr(true);
            this.private_UpdateTrackRevisionOnChangeTextPr(false);
            break;
        }

        case historyitem_ParaRun_RFonts_Ascii:
        {
            if ( undefined != Data.Old )
                this.Pr.RFonts.Ascii = Data.Old;
            else
                this.Pr.RFonts.Ascii = undefined;

            this.Recalc_CompiledPr(true);
            this.private_UpdateTrackRevisionOnChangeTextPr(false);
            break;
        }

        case historyitem_ParaRun_RFonts_HAnsi:
        {
            if ( undefined != Data.Old )
                this.Pr.RFonts.HAnsi = Data.Old;
            else
                this.Pr.RFonts.HAnsi = undefined;

            this.Recalc_CompiledPr(true);
            this.private_UpdateTrackRevisionOnChangeTextPr(false);
            break;
        }

        case historyitem_ParaRun_RFonts_CS:
        {
            if ( undefined != Data.Old )
                this.Pr.RFonts.CS = Data.Old;
            else
                this.Pr.RFonts.CS = undefined;

            this.Recalc_CompiledPr(true);
            this.private_UpdateTrackRevisionOnChangeTextPr(false);
            break;
        }

        case historyitem_ParaRun_RFonts_EastAsia:
        {
            if ( undefined != Data.Old )
                this.Pr.RFonts.EastAsia = Data.Old;
            else
                this.Pr.RFonts.EastAsia = undefined;

            this.Recalc_CompiledPr(true);
            this.private_UpdateTrackRevisionOnChangeTextPr(false);
            break;
        }

        case historyitem_ParaRun_RFonts_Hint:
        {
            if ( undefined != Data.Old )
                this.Pr.RFonts.Hint = Data.Old;
            else
                this.Pr.RFonts.Hint = undefined;

            this.Recalc_CompiledPr(true);
            this.private_UpdateTrackRevisionOnChangeTextPr(false);
            break;
        }

        case historyitem_ParaRun_Lang:
        {
            if ( undefined != Data.Old )
                this.Pr.Lang = Data.Old;
            else
                this.Pr.Lang = new CLang();

            this.Recalc_CompiledPr(false);
            this.protected_UpdateSpellChecking();
            this.private_UpdateTrackRevisionOnChangeTextPr(false);
            break;
        }

        case historyitem_ParaRun_Lang_Bidi:
        {
            if ( undefined != Data.Old )
                this.Pr.Lang.Bidi = Data.Old;
            else
                this.Pr.Lang.Bidi = undefined;

            this.Recalc_CompiledPr(false);
            this.protected_UpdateSpellChecking();
            this.private_UpdateTrackRevisionOnChangeTextPr(false);
            break;
        }

        case historyitem_ParaRun_Lang_EastAsia:
        {
            if ( undefined != Data.Old )
                this.Pr.Lang.EastAsia = Data.Old;
            else
                this.Pr.Lang.EastAsia = undefined;

            this.Recalc_CompiledPr(false);
            this.protected_UpdateSpellChecking();
            this.private_UpdateTrackRevisionOnChangeTextPr(false);
            break;
        }

        case historyitem_ParaRun_Lang_Val:
        {
            if ( undefined != Data.Old )
                this.Pr.Lang.Val = Data.Old;
            else
                this.Pr.Lang.Val = undefined;

            this.Recalc_CompiledPr(false);
            this.protected_UpdateSpellChecking();
            this.private_UpdateTrackRevisionOnChangeTextPr(false);
            break;
        }

        case historyitem_ParaRun_Shd:
        {
            this.Pr.Shd = Data.Old;
            this.Recalc_CompiledPr(false);
            this.private_UpdateTrackRevisionOnChangeTextPr(false);
            break;
        }

        case historyitem_ParaRun_MathStyle:
        {
            this.MathPrp.sty = Data.Old;
            this.Recalc_CompiledPr(true);
            this.private_UpdateTrackRevisionOnChangeTextPr(false);
            break;
        }

        case historyitem_ParaRun_MathPrp:
        {
            this.MathPrp = Data.Old;
            this.Recalc_CompiledPr(true);
            this.private_UpdateTrackRevisionOnChangeTextPr(false);
            break;
        }

        case historyitem_ParaRun_ReviewType:
        {
            this.ReviewType = Data.Old.ReviewType;
            this.ReviewInfo = Data.Old.ReviewInfo;
            this.private_UpdateTrackRevisions();
            break;
        }

        case historyitem_ParaRun_PrChange:
        {
            this.Pr.PrChange   = Data.Old.PrChange;
            this.Pr.ReviewInfo = Data.Old.ReviewInfo;
            this.private_UpdateTrackRevisions();
            break;
        }

        case historyitem_ParaRun_ContentReviewInfo:
        {
            this.ReviewInfo = Data.Old;
            break;
        }

        case historyitem_ParaRun_PrReviewInfo:
        {
            this.Pr.ReviewInfo = Data.Old;
            break;
        }
        case historyitem_ParaRun_MathAlnAt:
        {
            this.MathPrp.Apply_AlnAt(Data.Old);
            break;
        }
        case historyitem_ParaRun_MathForcedBreak:
        {
            if(Data.bInsert)
            {
                this.MathPrp.Delete_ForcedBreak();
            }
            else
            {
                this.MathPrp.Insert_ForcedBreak(Data.alnAt);
            }

            break;
        }
    }
};

ParaRun.prototype.Redo = function(Data)
{
    var Type = Data.Type;

    switch ( Type )
    {
        case  historyitem_ParaRun_AddItem:
        {
            var Pos = Data.Pos;

            var Array_start = this.Content.slice( 0, Pos );
            var Array_end   = this.Content.slice( Pos );

            this.Content = Array_start.concat( Data.Items, Array_end );

            this.RecalcInfo.Measure = true;
            this.protected_UpdateSpellChecking();
            this.private_UpdateTrackRevisionOnChangeContent(false);
            break;

        }

        case historyitem_ParaRun_RemoveItem:
        {
            this.Content.splice( Data.Pos, Data.EndPos - Data.Pos + 1 );

            this.RecalcInfo.Measure = true;
            this.protected_UpdateSpellChecking();
            this.private_UpdateTrackRevisionOnChangeContent(false);
            break;
        }

        case historyitem_ParaRun_TextPr:
        {
            if ( undefined != Data.New )
                this.Pr = Data.New;
            else
                this.Pr = undefined;

            this.Recalc_CompiledPr(true);
            this.private_UpdateTrackRevisionOnChangeTextPr(false);
            break;
        }

        case historyitem_ParaRun_Bold:
        {
            if ( undefined != Data.New )
                this.Pr.Bold = Data.New;
            else
                this.Pr.Bold = undefined;

            this.Recalc_CompiledPr(true);
            this.private_UpdateTrackRevisionOnChangeTextPr(false);
            break;
        }

        case historyitem_ParaRun_Italic:
        {
            if ( undefined != Data.New )
                this.Pr.Italic = Data.New;
            else
                this.Pr.Italic = undefined;

            this.Recalc_CompiledPr(true);
            this.private_UpdateTrackRevisionOnChangeTextPr(false);
            break;
        }

        case historyitem_ParaRun_Strikeout:
        {
            if ( undefined != Data.New )
                this.Pr.Strikeout = Data.New;
            else
                this.Pr.Strikeout = undefined;

            this.Recalc_CompiledPr(false);
            this.private_UpdateTrackRevisionOnChangeTextPr(false);
            break;
        }

        case historyitem_ParaRun_Underline:
        {
            if ( undefined != Data.New )
                this.Pr.Underline = Data.New;
            else
                this.Pr.Underline = undefined;

            this.Recalc_CompiledPr(false);
            this.private_UpdateTrackRevisionOnChangeTextPr(false);
            break;
        }

        case historyitem_ParaRun_FontSize:
        {
            if ( undefined != Data.New )
                this.Pr.FontSize = Data.New;
            else
                this.Pr.FontSize = undefined;

            this.Recalc_CompiledPr(true);
            this.private_UpdateTrackRevisionOnChangeTextPr(false);
            break;
        }

        case historyitem_ParaRun_Color:
        {
            if ( undefined != Data.New )
                this.Pr.Color = Data.New;
            else
                this.Pr.Color = undefined;

            this.Recalc_CompiledPr(false);
            this.private_UpdateTrackRevisionOnChangeTextPr(false);
            break;
        }
        case historyitem_ParaRun_Unifill:
        {
            if ( undefined != Data.New )
                this.Pr.Unifill = Data.New;
            else
                this.Pr.Unifill = undefined;

            this.Recalc_CompiledPr(false);
            this.private_UpdateTrackRevisionOnChangeTextPr(false);
            break;
        }

        case historyitem_ParaRun_TextFill:
        {
            if ( undefined != Data.New )
                this.Pr.TextFill = Data.New;
            else
                this.Pr.TextFill = undefined;

            this.Recalc_CompiledPr(false);
            this.private_UpdateTrackRevisionOnChangeTextPr(false);
            break;
        }
        case historyitem_ParaRun_TextOutline:
        {
            if ( undefined != Data.New )
                this.Pr.TextOutline = Data.New;
            else
                this.Pr.TextOutline = undefined;

            this.Recalc_CompiledPr(false);
            this.private_UpdateTrackRevisionOnChangeTextPr(false);
            break;
        }


        case historyitem_ParaRun_VertAlign:
        {
            if ( undefined != Data.New )
                this.Pr.VertAlign = Data.New;
            else
                this.Pr.VertAlign = undefined;

            this.Recalc_CompiledPr(true);
            this.private_UpdateTrackRevisionOnChangeTextPr(false);
            break;
        }

        case historyitem_ParaRun_HighLight:
        {
            if ( undefined != Data.New )
                this.Pr.HighLight = Data.New;
            else
                this.Pr.HighLight = undefined;

            this.Recalc_CompiledPr(false);
            this.private_UpdateTrackRevisionOnChangeTextPr(false);
            break;
        }

        case historyitem_ParaRun_RStyle:
        {
            if ( undefined != Data.New )
                this.Pr.RStyle = Data.New;
            else
                this.Pr.RStyle = undefined;

            this.Recalc_CompiledPr(true);
            this.private_UpdateTrackRevisionOnChangeTextPr(false);
            break;
        }

        case historyitem_ParaRun_Spacing:
        {
            if ( undefined != Data.New )
                this.Pr.Spacing = Data.New;
            else
                this.Pr.Spacing = undefined;

            this.Recalc_CompiledPr(true);
            this.private_UpdateTrackRevisionOnChangeTextPr(false);
            break;
        }
        case historyitem_ParaRun_DStrikeout:
        {
            if ( undefined != Data.New )
                this.Pr.DStrikeout = Data.New;
            else
                this.Pr.DStrikeout = undefined;

            this.Recalc_CompiledPr(false);
            this.private_UpdateTrackRevisionOnChangeTextPr(false);
            break;
        }
        case historyitem_ParaRun_Caps:
        {
            if ( undefined != Data.New )
                this.Pr.Caps = Data.New;
            else
                this.Pr.Caps = undefined;

            this.Recalc_CompiledPr(true);
            this.private_UpdateTrackRevisionOnChangeTextPr(false);
            break;
        }
        case historyitem_ParaRun_SmallCaps:
        {
            if ( undefined != Data.New )
                this.Pr.SmallCaps = Data.New;
            else
                this.Pr.SmallCaps = undefined;

            this.Recalc_CompiledPr(true);
            this.private_UpdateTrackRevisionOnChangeTextPr(false);
            break;
        }

        case historyitem_ParaRun_Position:
        {
            if ( undefined != Data.New )
                this.Pr.Position = Data.New;
            else
                this.Pr.Position = undefined;

            this.Recalc_CompiledPr(true);
            this.private_UpdateTrackRevisionOnChangeTextPr(false);
            break;
        }

        case historyitem_ParaRun_RFonts:
        {
            if ( undefined != Data.New )
                this.Pr.RFonts = Data.New;
            else
                this.Pr.RFonts = new CRFonts();

            this.Recalc_CompiledPr(true);
            this.private_UpdateTrackRevisionOnChangeTextPr(false);
            break;
        }

        case historyitem_ParaRun_RFonts_Ascii:
        {
            if ( undefined != Data.New )
                this.Pr.RFonts.Ascii = Data.New;
            else
                this.Pr.RFonts.Ascii = undefined;

            this.Recalc_CompiledPr(true);
            this.private_UpdateTrackRevisionOnChangeTextPr(false);
            break;
        }

        case historyitem_ParaRun_RFonts_HAnsi:
        {
            if ( undefined != Data.New )
                this.Pr.RFonts.HAnsi = Data.New;
            else
                this.Pr.RFonts.HAnsi = undefined;

            this.Recalc_CompiledPr(true);
            this.private_UpdateTrackRevisionOnChangeTextPr(false);
            break;
        }

        case historyitem_ParaRun_RFonts_CS:
        {
            if ( undefined != Data.New )
                this.Pr.RFonts.CS = Data.New;
            else
                this.Pr.RFonts.CS = undefined;

            this.Recalc_CompiledPr(true);
            this.private_UpdateTrackRevisionOnChangeTextPr(false);
            break;
        }

        case historyitem_ParaRun_RFonts_EastAsia:
        {
            if ( undefined != Data.New )
                this.Pr.RFonts.EastAsia = Data.New;
            else
                this.Pr.RFonts.EastAsia = undefined;

            this.Recalc_CompiledPr(true);
            this.private_UpdateTrackRevisionOnChangeTextPr(false);
            break;
        }

        case historyitem_ParaRun_RFonts_Hint:
        {
            if ( undefined != Data.New )
                this.Pr.RFonts.Hint = Data.New;
            else
                this.Pr.RFonts.Hint = undefined;

            this.Recalc_CompiledPr(true);
            this.private_UpdateTrackRevisionOnChangeTextPr(false);
            break;
        }

        case historyitem_ParaRun_Lang:
        {
            if ( undefined != Data.New )
                this.Pr.Lang = Data.New;
            else
                this.Pr.Lang = new CLang();

            this.Recalc_CompiledPr(false);
            this.protected_UpdateSpellChecking();
            this.private_UpdateTrackRevisionOnChangeTextPr(false);
            break;
        }

        case historyitem_ParaRun_Lang_Bidi:
        {
            if ( undefined != Data.New )
                this.Pr.Lang.Bidi = Data.New;
            else
                this.Pr.Lang.Bidi = undefined;

            this.Recalc_CompiledPr(false);
            this.protected_UpdateSpellChecking();
            this.private_UpdateTrackRevisionOnChangeTextPr(false);
            break;
        }

        case historyitem_ParaRun_Lang_EastAsia:
        {
            if ( undefined != Data.New )
                this.Pr.Lang.EastAsia = Data.New;
            else
                this.Pr.Lang.EastAsia = undefined;

            this.Recalc_CompiledPr(false);
            this.protected_UpdateSpellChecking();
            this.private_UpdateTrackRevisionOnChangeTextPr(false);
            break;
        }

        case historyitem_ParaRun_Lang_Val:
        {
            if ( undefined != Data.New )
                this.Pr.Lang.Val = Data.New;
            else
                this.Pr.Lang.Val = undefined;

            this.Recalc_CompiledPr(false);
            this.protected_UpdateSpellChecking();
            this.private_UpdateTrackRevisionOnChangeTextPr(false);
            break;
        }

        case historyitem_ParaRun_Shd:
        {
            this.Pr.Shd = Data.New;
            this.Recalc_CompiledPr(false);
            this.private_UpdateTrackRevisionOnChangeTextPr(false);
            break;
        }

        case historyitem_ParaRun_MathStyle:
        {
            this.MathPrp.sty = Data.New;
            this.Recalc_CompiledPr(true);
            this.private_UpdateTrackRevisionOnChangeTextPr(false);
            break;
        }

        case historyitem_ParaRun_MathPrp:
        {
            this.MathPrp = Data.New;
            this.Recalc_CompiledPr(true);
            this.private_UpdateTrackRevisionOnChangeTextPr(false);
            break;
        }

        case historyitem_ParaRun_ReviewType:
        {
            this.ReviewType = Data.New.ReviewType;
            this.ReviewInfo = Data.New.ReviewInfo;
            this.private_UpdateTrackRevisions();
            break;
        }

        case historyitem_ParaRun_PrChange:
        {
            this.Pr.PrChange   = Data.New.PrChange;
            this.Pr.ReviewInfo = Data.New.ReviewInfo;
            this.private_UpdateTrackRevisions();
            break;
        }

        case historyitem_ParaRun_ContentReviewInfo:
        {
            this.ReviewInfo = Data.New;
            break;
        }

        case historyitem_ParaRun_PrReviewInfo:
        {
            this.Pr.ReviewInfo = Data.New;
            break;
        }

        case historyitem_ParaRun_MathAlnAt:
        {
            this.MathPrp.Apply_AlnAt(Data.New);
            break;
        }
        case historyitem_ParaRun_MathForcedBreak:
        {
            if(Data.bInsert)
            {
                this.MathPrp.Insert_ForcedBreak(Data.alnAt);
            }
            else
            {
                this.MathPrp.Delete_ForcedBreak();
            }

            break;
        }
    }
};
ParaRun.prototype.Check_HistoryUninon = function(Data1, Data2)
{
    var Type1 = Data1.Type;
    var Type2 = Data2.Type;

    if ( historyitem_ParaRun_AddItem === Type1 && historyitem_ParaRun_AddItem === Type2 )
    {
        if ( 1 === Data1.Items.length && 1 === Data2.Items.length && Data1.Pos === Data2.Pos - 1 && para_Text === Data1.Items[0].Type && para_Text === Data2.Items[0].Type )
            return true;
    }

    return false;
};
//-----------------------------------------------------------------------------------
// Функции для совместного редактирования
//-----------------------------------------------------------------------------------
ParaRun.prototype.Save_Changes = function(Data, Writer)
{
    // Сохраняем изменения из тех, которые используются для Undo/Redo в бинарный файл.
    // Long : тип класса
    // Long : тип изменений

    Writer.WriteLong( historyitem_type_ParaRun );

    var Type = Data.Type;

    // Пишем тип
    Writer.WriteLong( Type );

    switch ( Type )
    {
        case historyitem_ParaRun_AddItem:
        {
            // Bool     : Подсвечивать ли данные изменения
            // Long     : Количество элементов
            // Array of :
            //  {
            //    Long     : Позиция
            //    Variable : Элемент
            //  }

            var bArray = Data.UseArray;
            var Count  = Data.Items.length;

            if (false === Data.Color)
                Writer.WriteBool(false);
            else
                Writer.WriteBool(true);

            Writer.WriteLong( Count );

            for ( var Index = 0; Index < Count; Index++ )
            {
                if ( true === bArray )
                    Writer.WriteLong( Data.PosArray[Index] );
                else
                    Writer.WriteLong( Data.Pos + Index );

                Data.Items[Index].Write_ToBinary(Writer);
            }

            break;
        }

        case historyitem_ParaRun_RemoveItem:
        {
            // Long          : Количество удаляемых элементов
            // Array of Long : позиции удаляемых элементов

            var bArray = Data.UseArray;
            var Count  = Data.Items.length;

            var StartPos = Writer.GetCurPosition();
            Writer.Skip(4);
            var RealCount = Count;
            for ( var Index = 0; Index < Count; Index++ )
            {
                if ( true === bArray )
                {
                    if ( false === Data.PosArray[Index] )
                    {
                        RealCount--;
                    }
                    else
                    {
                        Writer.WriteLong(Data.PosArray[Index]);
                    }
                }
                else
                {
                    Writer.WriteLong(Data.Pos);
                }
            }

            var EndPos = Writer.GetCurPosition();
            Writer.Seek( StartPos );
            Writer.WriteLong( RealCount );
            Writer.Seek( EndPos );

            break;
        }

        case historyitem_ParaRun_TextPr:
        {
            // Bool     : Подсвечивать ли данные изменения
            // CTextPr
            if (false === Data.Color)
                Writer.WriteBool(false);
            else
                Writer.WriteBool(true);

            this.Pr.Write_ToBinary( Writer );

            break;
        }

        case historyitem_ParaRun_Bold:
        case historyitem_ParaRun_Italic:
        case historyitem_ParaRun_Strikeout:
        case historyitem_ParaRun_Underline:
        {
            // Bool : Подсвечивать ли данные изменения
            // Bool : IsUndefined
            // Bool : Value

            if (false === Data.Color)
                Writer.WriteBool(false);
            else
                Writer.WriteBool(true);

            if ( undefined != Data.New )
            {
                Writer.WriteBool( false );
                Writer.WriteBool( Data.New );
            }
            else
                Writer.WriteBool( true );

            break;
        }

        case historyitem_ParaRun_FontSize:
        {
            // Bool : Подсвечивать ли данные изменения
            // Bool   : IsUndefined
            // Double : FontSize

            if (false === Data.Color)
                Writer.WriteBool(false);
            else
                Writer.WriteBool(true);

            if ( undefined != Data.New )
            {
                Writer.WriteBool(false);
                Writer.WriteDouble( Data.New );
            }
            else
                Writer.WriteBool(true);

            break;
        }

        case historyitem_ParaRun_Color:
        {
            // Bool : Подсвечивать ли данные изменения
            // Bool     : IsUndefined
            // Variable : Color (CDocumentColor)

            if (false === Data.Color)
                Writer.WriteBool(false);
            else
                Writer.WriteBool(true);

            if ( undefined != Data.New )
            {
                Writer.WriteBool(false);
                Data.New.Write_ToBinary( Writer );
            }
            else
                Writer.WriteBool(true);

            break;
        }

        case historyitem_ParaRun_Unifill:
        case historyitem_ParaRun_TextFill:
        case historyitem_ParaRun_TextOutline:
        {
            if (false === Data.Color)
                Writer.WriteBool(false);
            else
                Writer.WriteBool(true);

            if ( undefined != Data.New )
            {
                Writer.WriteBool(false);
                Data.New.Write_ToBinary( Writer );
            }
            else
                Writer.WriteBool(true);

            break;
        }

        case historyitem_ParaRun_VertAlign:
        {
            // Bool  : IsUndefined
            // Long  : VertAlign

            if (false === Data.Color)
                Writer.WriteBool(false);
            else
                Writer.WriteBool(true);

            if ( undefined != Data.New )
            {
                Writer.WriteBool(false);
                Writer.WriteLong(Data.New);
            }
            else
                Writer.WriteBool(true);

            break;
        }

        case historyitem_ParaRun_HighLight:
        {
            // Bool  : IsUndefined
            // Если false
            //   Bool  : IsNone
            //   Если false
            //     Variable : Color (CDocumentColor)

            if (false === Data.Color)
                Writer.WriteBool(false);
            else
                Writer.WriteBool(true);

            if ( undefined != Data.New )
            {
                Writer.WriteBool(false);
                if ( highlight_None != Data.New )
                {
                    Writer.WriteBool( false );
                    Data.New.Write_ToBinary( Writer );
                }
                else
                    Writer.WriteBool( true );
            }
            else
                Writer.WriteBool(true);

            break;
        }

        case historyitem_ParaRun_RStyle:
        {
            // Bool : IsUndefined
            // Если false
            //   String : RStyle

            if (false === Data.Color)
                Writer.WriteBool(false);
            else
                Writer.WriteBool(true);

            if ( undefined != Data.New )
            {
                Writer.WriteBool( false );
                Writer.WriteString2( Data.New );
            }
            else
                Writer.WriteBool( true );

            break;
        }

        case historyitem_ParaRun_Spacing:
        case historyitem_ParaRun_Position:
        {
            // Bool : IsUndefined
            // Если false
            //   Double : Spacing

            if (false === Data.Color)
                Writer.WriteBool(false);
            else
                Writer.WriteBool(true);

            if ( undefined != Data.New )
            {
                Writer.WriteBool( false );
                Writer.WriteDouble( Data.New );
            }
            else
                Writer.WriteBool( true );

            break;
        }

        case historyitem_ParaRun_DStrikeout:
        case historyitem_ParaRun_Caps:
        case historyitem_ParaRun_SmallCaps:
        {
            // Bool : IsUndefined
            // Если false
            //   Bool : value

            if (false === Data.Color)
                Writer.WriteBool(false);
            else
                Writer.WriteBool(true);

            if ( undefined != Data.New )
            {
                Writer.WriteBool( false );
                Writer.WriteBool( Data.New );
            }
            else
                Writer.WriteBool( true );

            break;
        }

        case historyitem_ParaRun_RFonts:
        {
            // Bool : undefined ?
            // false -> CRFonts

            if (false === Data.Color)
                Writer.WriteBool(false);
            else
                Writer.WriteBool(true);

            if ( undefined != Data.New )
            {
                Writer.WriteBool( false );
                Data.New.Write_ToBinary( Writer );
            }
            else
                Writer.WriteBool( true );

            break;
        }

        case historyitem_ParaRun_RFonts_Ascii:
        case historyitem_ParaRun_RFonts_HAnsi:
        case historyitem_ParaRun_RFonts_CS:
        case historyitem_ParaRun_RFonts_EastAsia:
        {
            // Bool : undefined?
            // false -> String

            if (false === Data.Color)
                Writer.WriteBool(false);
            else
                Writer.WriteBool(true);

            if ( undefined != Data.New )
            {
                Writer.WriteBool( false );
                Writer.WriteString2( Data.New.Name );
            }
            else
                Writer.WriteBool( true );

            break;
        }

        case historyitem_ParaRun_RFonts_Hint:
        {
            // Bool : undefined?
            // false -> Long

            if (false === Data.Color)
                Writer.WriteBool(false);
            else
                Writer.WriteBool(true);

            if ( undefined != Data.New )
            {
                Writer.WriteBool( false );
                Writer.WriteLong( Data.New );
            }
            else
                Writer.WriteBool( true );

            break;
        }

        case historyitem_ParaRun_Lang:
        {
            // Bool : undefined ?
            // false -> CLang

            if (false === Data.Color)
                Writer.WriteBool(false);
            else
                Writer.WriteBool(true);

            if ( undefined != Data.New )
            {
                Writer.WriteBool( false );
                Data.New.Write_ToBinary( Writer );
            }
            else
                Writer.WriteBool( true );

            break;
        }

        case historyitem_ParaRun_Lang_Bidi:
        case historyitem_ParaRun_Lang_EastAsia:
        case historyitem_ParaRun_Lang_Val:
        {
            // Bool : undefined ?
            // false -> Long

            if (false === Data.Color)
                Writer.WriteBool(false);
            else
                Writer.WriteBool(true);

            if ( undefined != Data.New )
            {
                Writer.WriteBool( false );
                Writer.WriteLong( Data.New );
            }
            else
                Writer.WriteBool( true );

            break;
        }

        case historyitem_ParaRun_Shd:
        {
            // Bool : undefined
            // false - >
            // Variable : CDocumentShd

            if (false === Data.Color)
                Writer.WriteBool(false);
            else
                Writer.WriteBool(true);

            if ( undefined !== Data.New )
            {
                Writer.WriteBool(false);
                Data.New.Write_ToBinary(Writer);
            }
            else
                Writer.WriteBool(true);

            break;
        }
        case historyitem_ParaRun_MathStyle:
        {
            // Bool : undefined ?
            // false -> Long
            if ( undefined != Data.New )
            {
                Writer.WriteBool( false );
                Writer.WriteLong( Data.New );
            }
            else
                Writer.WriteBool( true );

            break;
        }
        case historyitem_ParaRun_MathPrp:
        {
            var StartPos = Writer.GetCurPosition();
            Writer.Skip(4);
            var Flags = 0;
            if ( undefined != this.MathPrp.aln )
            {
                Writer.WriteBool( this.MathPrp.aln );
                Flags |= 1;
            }
            if ( undefined != this.MathPrp.brk )
            {
                this.MathPrp.brk.Write_ToBinary(Writer);
                Flags |= 2;
            }
            if ( undefined != this.MathPrp.lit )
            {
                Writer.WriteBool( this.MathPrp.lit );
                Flags |= 4;
            }
            if ( undefined != this.MathPrp.nor )
            {
                Writer.WriteBool( this.MathPrp.nor );
                Flags |= 8;
            }
            if ( undefined != this.MathPrp.scr )
            {
                Writer.WriteLong( this.MathPrp.scr );
                Flags |= 16;
            }
            if ( undefined != this.MathPrp.sty )
            {
                Writer.WriteLong( this.MathPrp.sty );
                Flags |= 32;
            }
            var EndPos = Writer.GetCurPosition();
            Writer.Seek( StartPos );
            Writer.WriteLong( Flags );
            Writer.Seek( EndPos );
            break;
        }

        case historyitem_ParaRun_ReviewType:
        {
            // Long        : ReviewType
            // CReviewInfo : ReviewInfo
            Writer.WriteLong(Data.New.ReviewType);
            Data.New.ReviewInfo.Write_ToBinary(Writer);
            break;
        }

        case historyitem_ParaRun_PrChange:
        {
            // Bool : is undefined ?
            // false -> TextPr
            // Bool : is undefined ?
            // false -> ReviewInfo

            if (undefined === Data.New.PrChange)
            {
                Writer.WriteBool(true);
            }
            else
            {
                Writer.WriteBool(false);
                Data.New.PrChange.Write_ToBinary(Writer);
            }

            if (undefined === Data.New.ReviewInfo)
            {
                Writer.WriteBool(true);
            }
            else
            {
                Writer.WriteBool(false);
                Data.New.ReviewInfo.Write_ToBinary(Writer);
            }

            break;
        }

        case historyitem_ParaRun_ContentReviewInfo:
        {
            // Bool : is undefined ?
            // false -> ReviewInfo
            if (undefined === Data.New)
            {
                Writer.WriteBool(true);
            }
            else
            {
                Writer.WriteBool(false);
                Data.New.Write_ToBinary(Writer);
            }
            break;
        }

        case historyitem_ParaRun_PrReviewInfo:
        {
            // Bool : is undefined ?
            // false -> ReviewInfo
            if (undefined === Data.New)
            {
                Writer.WriteBool(true);
            }
            else
            {
                Writer.WriteBool(false);
                Data.New.Write_ToBinary(Writer);
            }
            break;
        }

        case historyitem_ParaRun_OnStartSplit:
        {
            Writer.WriteLong(Data.Pos);
            break;
        }
        case historyitem_ParaRun_OnEndSplit:
        {
            Writer.WriteString2(Data.NewRun.Get_Id());
            break;
        }
        case historyitem_ParaRun_MathAlnAt:
        {
            if ( undefined != Data.New )
            {
                Writer.WriteBool( false );
                Writer.WriteLong( Data.New );
            }
            else
            {
                Writer.WriteBool( true );
            }

            break;
        }
        case historyitem_ParaRun_MathForcedBreak:
        {
            if(Data.bInsert)
            {
                Writer.WriteBool( true );
            }
            else
            {
                Writer.WriteBool( false );
            }

            break;
        }

    }

    return Writer;
};

ParaRun.prototype.Load_Changes = function(Reader, Reader2, Color)
{
    // Сохраняем изменения из тех, которые используются для Undo/Redo в бинарный файл.
    // Long : тип класса
    // Long : тип изменений

    var ClassType = Reader.GetLong();
    if ( historyitem_type_ParaRun != ClassType )
        return;

    var Type = Reader.GetLong();

    var bColorPrChange = false;
    switch ( Type )
    {
        case historyitem_ParaRun_AddItem :
        {
            // Bool     : Подсвечивать ли данные изменения
            // Long     : Количество элементов
            // Array of :
            //  {
            //    Long     : Позиция
            //    Variable : Id Элемента
            //  }

            var bColorChanges = Reader.GetBool();
            var Count = Reader.GetLong();

            for ( var Index = 0; Index < Count; Index++ )
            {
                var Pos     = this.m_oContentChanges.Check( contentchanges_Add, Reader.GetLong() );
                var Element = ParagraphContent_Read_FromBinary(Reader);

                if ( null != Element )
                {
                    if (true === bColorChanges && null !== Color)
                    {
                        this.CollaborativeMarks.Update_OnAdd( Pos );
                        this.CollaborativeMarks.Add( Pos, Pos + 1, Color );
                        CollaborativeEditing.Add_ChangedClass(this);
                    }

                    this.Content.splice(Pos, 0, Element);
                    this.private_UpdatePositionsOnAdd(Pos);
                    CollaborativeEditing.Update_DocumentPositionsOnAdd(this, Pos);
                }
            }

            this.RecalcInfo.Measure = true;
            this.protected_UpdateSpellChecking();
            this.private_UpdateTrackRevisionOnChangeContent(false);
            break;
        }

        case historyitem_ParaRun_RemoveItem:
        {
            // Long          : Количество удаляемых элементов
            // Array of Long : позиции удаляемых элементов

            var Count = Reader.GetLong();
            for ( var Index = 0; Index < Count; Index++ )
            {
                var ChangesPos = this.m_oContentChanges.Check(contentchanges_Remove, Reader.GetLong());

                // действие совпало, не делаем его
                if (false === ChangesPos)
                    continue;

                this.CollaborativeMarks.Update_OnRemove(ChangesPos, 1);
                this.Content.splice(ChangesPos, 1);
                this.private_UpdatePositionsOnRemove(ChangesPos, 1);
                CollaborativeEditing.Update_DocumentPositionsOnRemove(this, ChangesPos, 1);
            }

            this.RecalcInfo.Measure = true;
            this.protected_UpdateSpellChecking();
            this.private_UpdateTrackRevisionOnChangeContent(false);
            break;
        }

        case historyitem_ParaRun_TextPr:
        {
            // CTextPr
            bColorPrChange = Reader.GetBool();
            this.Pr = new CTextPr();
            this.Pr.Read_FromBinary( Reader );

            var unifill = this.Pr.Unifill;
            if(typeof CollaborativeEditing !== "undefined")
            {
                if(unifill && unifill.fill && unifill.fill.type === FILL_TYPE_BLIP && typeof unifill.fill.RasterImageId === "string" && unifill.fill.RasterImageId.length > 0)
                {
                    CollaborativeEditing.Add_NewImage(getFullImageSrc2(unifill.fill.RasterImageId));
                }
            }

            this.Recalc_CompiledPr(true);
            this.private_UpdateTrackRevisionOnChangeTextPr(false);
            break;
        }

        case historyitem_ParaRun_Bold:
        {
            // Bool : IsUndefined
            // Bool : Bold

            bColorPrChange = Reader.GetBool();

            if ( true === Reader.GetBool() )
                this.Pr.Bold = undefined;
            else
                this.Pr.Bold = Reader.GetBool();

            this.Recalc_CompiledPr(true);
            this.private_UpdateTrackRevisionOnChangeTextPr(false);
            break;
        }

        case historyitem_ParaRun_Italic:
        {
            // Bool : IsUndefined
            // Bool : Italic

            bColorPrChange = Reader.GetBool();

            if ( true === Reader.GetBool() )
                this.Pr.Italic = undefined;
            else
                this.Pr.Italic = Reader.GetBool();

            this.Recalc_CompiledPr(true);
            this.private_UpdateTrackRevisionOnChangeTextPr(false);
            break;
        }

        case historyitem_ParaRun_Strikeout:
        {
            // Bool : IsUndefined
            // Bool : Strikeout
            bColorPrChange = Reader.GetBool();
            if ( true === Reader.GetBool() )
                this.Pr.Strikeout = undefined;
            else
                this.Pr.Strikeout = Reader.GetBool();

            this.Recalc_CompiledPr(false);
            this.private_UpdateTrackRevisionOnChangeTextPr(false);
            break;
        }

        case historyitem_ParaRun_Underline:
        {
            // Bool   : IsUndefined?
            // Bool   : Underline
            bColorPrChange = Reader.GetBool();
            if ( true != Reader.GetBool() )
                this.Pr.Underline = Reader.GetBool();
            else
                this.Pr.Underline = undefined;

            this.Recalc_CompiledPr(false);
            this.private_UpdateTrackRevisionOnChangeTextPr(false);
            break;
        }

        case historyitem_ParaRun_FontSize:
        {
            // Bool   : IsUndefined
            // Double : FontSize
            bColorPrChange = Reader.GetBool();
            if ( true != Reader.GetBool() )
                this.Pr.FontSize = Reader.GetDouble();
            else
                this.Pr.FontSize = undefined;

            this.Recalc_CompiledPr(true);
            this.private_UpdateTrackRevisionOnChangeTextPr(false);
            break;
        }

        case historyitem_ParaRun_Color:
        {
            // Bool     : IsUndefined
            // Variable : Color (CDocumentColor)
            bColorPrChange = Reader.GetBool();
            if ( true != Reader.GetBool() )
            {
                this.Pr.Color = new CDocumentColor(0, 0, 0, false);
                this.Pr.Color.Read_FromBinary(Reader);
            }
            else
                this.Pr.Color = undefined;

            this.Recalc_CompiledPr(false);
            this.private_UpdateTrackRevisionOnChangeTextPr(false);
            break;
        }


        case historyitem_ParaRun_Unifill:
        {
            bColorPrChange = Reader.GetBool();
            if ( true != Reader.GetBool() )
            {
                var unifill = new CUniFill();
                unifill.Read_FromBinary(Reader);
                this.Pr.Unifill = unifill;
                if(typeof CollaborativeEditing !== "undefined")
                {
                    if(unifill.fill && unifill.fill.type === FILL_TYPE_BLIP && typeof unifill.fill.RasterImageId === "string" && unifill.fill.RasterImageId.length > 0)
                    {
                        CollaborativeEditing.Add_NewImage(getFullImageSrc2(unifill.fill.RasterImageId));
                    }
                }
            }
            else
                this.Pr.Unifill = undefined;

            this.Recalc_CompiledPr(false);
            this.private_UpdateTrackRevisionOnChangeTextPr(false);
            break;
        }



        case historyitem_ParaRun_TextFill:
        {
            bColorPrChange = Reader.GetBool();
            if ( true != Reader.GetBool() )
            {
                var unifill = new CUniFill();
                unifill.Read_FromBinary(Reader);
                this.Pr.TextFill = unifill;
            }
            else
                this.Pr.TextFill = undefined;

            this.Recalc_CompiledPr(false);
            this.private_UpdateTrackRevisionOnChangeTextPr(false);
            break;
        }
        case historyitem_ParaRun_TextOutline:
        {
            bColorPrChange = Reader.GetBool();
            if ( true != Reader.GetBool() )
            {
                var ln = new CLn();
                ln.Read_FromBinary(Reader);
                this.Pr.TextOutline = ln;
            }
            else
                this.Pr.TextOutline = undefined;

            this.Recalc_CompiledPr(false);
            this.private_UpdateTrackRevisionOnChangeTextPr(false);
            break;
        }
        case historyitem_ParaRun_VertAlign:
        {
            // Bool  : IsUndefined
            // Long  : VertAlign
            bColorPrChange = Reader.GetBool();
            if ( true != Reader.GetBool() )
                this.Pr.VertAlign = Reader.GetLong();
            else
                this.Pr.VertAlign = undefined;

            this.Recalc_CompiledPr(true);
            this.private_UpdateTrackRevisionOnChangeTextPr(false);
            break;
        }

        case historyitem_ParaRun_HighLight:
        {
            // Bool  : IsUndefined
            // Если false
            //   Bool  : IsNull
            //   Если false
            //     Variable : Color (CDocumentColor)
            bColorPrChange = Reader.GetBool();
            if ( true != Reader.GetBool() )
            {
                if ( true != Reader.GetBool() )
                {
                    this.Pr.HighLight = new CDocumentColor(0,0,0);
                    this.Pr.HighLight.Read_FromBinary(Reader);
                }
                else
                    this.Pr.HighLight = highlight_None;
            }
            else
                this.Pr.HighLight = undefined;

            this.Recalc_CompiledPr(false);
            this.private_UpdateTrackRevisionOnChangeTextPr(false);
            break;
        }

        case historyitem_ParaRun_RStyle:
        {
            // Bool : IsUndefined
            // Если false
            //   String : RStyle
            bColorPrChange = Reader.GetBool();
            if ( true != Reader.GetBool() )
                this.Pr.RStyle = Reader.GetString2();
            else
                this.Pr.RStyle = undefined;

            this.Recalc_CompiledPr(true);
            this.private_UpdateTrackRevisionOnChangeTextPr(false);
            break;
        }

        case historyitem_ParaRun_Spacing:
        {
            // Bool : IsUndefined
            // Если false
            //   Double : Spacing
            bColorPrChange = Reader.GetBool();
            if ( true != Reader.GetBool() )
                this.Pr.Spacing = Reader.GetDouble();
            else
                this.Pr.Spacing = undefined;

            this.Recalc_CompiledPr(true);
            this.private_UpdateTrackRevisionOnChangeTextPr(false);
            break;
        }

        case historyitem_ParaRun_DStrikeout:
        {
            // Bool : IsUndefined
            // Если false
            //   Bool : DStrikeout
            bColorPrChange = Reader.GetBool();
            if ( true != Reader.GetBool() )
                this.Pr.DStrikeout = Reader.GetBool();
            else
                this.Pr.DStrikeout = undefined;

            this.Recalc_CompiledPr(false);
            this.private_UpdateTrackRevisionOnChangeTextPr(false);
            break;
        }

        case historyitem_ParaRun_Caps:
        {
            // Bool : IsUndefined
            // Если false
            //   Bool : Caps
            bColorPrChange = Reader.GetBool();
            if ( true != Reader.GetBool() )
                this.Pr.Caps = Reader.GetBool();
            else
                this.Pr.Caps = undefined;

            this.Recalc_CompiledPr(true);
            this.private_UpdateTrackRevisionOnChangeTextPr(false);
            break;
        }

        case historyitem_ParaRun_SmallCaps:
        {
            // Bool : IsUndefined
            // Если false
            //   Bool : SmallCaps
            bColorPrChange = Reader.GetBool();
            if ( true != Reader.GetBool() )
                this.Pr.SmallCaps = Reader.GetBool();
            else
                this.Pr.SmallCaps = undefined;

            this.Recalc_CompiledPr(true);
            this.private_UpdateTrackRevisionOnChangeTextPr(false);
            break;
        }

        case historyitem_ParaRun_Position:
        {
            // Bool : IsUndefined
            // Если false
            //   Double : Position
            bColorPrChange = Reader.GetBool();
            if ( true != Reader.GetBool() )
                this.Pr.Position = Reader.GetDouble();
            else
                this.Pr.Position = undefined;

            this.Recalc_CompiledPr(true);
            this.private_UpdateTrackRevisionOnChangeTextPr(false);
            break;
        }

        case historyitem_ParaRun_RFonts:
        {
            // Bool : undefined ?
            // false -> CRFonts
            bColorPrChange = Reader.GetBool();
            if ( false === Reader.GetBool() )
            {
                this.Pr.RFonts = new CRFonts();
                this.Pr.RFonts.Read_FromBinary( Reader );
            }
            else
                this.Pr.RFonts = new CRFonts();

            this.Recalc_CompiledPr(true);
            this.private_UpdateTrackRevisionOnChangeTextPr(false);
            break;
        }

        case historyitem_ParaRun_RFonts_Ascii:
        {
            // Bool : undefined ?
            // false -> String
            bColorPrChange = Reader.GetBool();
            if ( false === Reader.GetBool() )
            {
                this.Pr.RFonts.Ascii =
                {
                    Name  : Reader.GetString2(),
                    Index : -1
                };
            }
            else
                this.Pr.RFonts.Ascii = undefined;

            this.Recalc_CompiledPr(true);
            this.private_UpdateTrackRevisionOnChangeTextPr(false);
            break;
        }

        case historyitem_ParaRun_RFonts_HAnsi:
        {
            // Bool : undefined ?
            // false -> String
            bColorPrChange = Reader.GetBool();
            if ( false === Reader.GetBool() )
            {
                this.Pr.RFonts.HAnsi =
                {
                    Name  : Reader.GetString2(),
                    Index : -1
                };
            }
            else
                this.Pr.RFonts.HAnsi = undefined;

            this.Recalc_CompiledPr(true);
            this.private_UpdateTrackRevisionOnChangeTextPr(false);
            break;
        }

        case historyitem_ParaRun_RFonts_CS:
        {
            // Bool : undefined ?
            // false -> String
            bColorPrChange = Reader.GetBool();
            if ( false === Reader.GetBool() )
            {
                this.Pr.RFonts.CS =
                {
                    Name  : Reader.GetString2(),
                    Index : -1
                };
            }
            else
                this.Pr.RFonts.CS = undefined;

            this.Recalc_CompiledPr(true);
            this.private_UpdateTrackRevisionOnChangeTextPr(false);
            break;
        }

        case historyitem_ParaRun_RFonts_EastAsia:
        {
            // Bool : undefined ?
            // false -> String
            bColorPrChange = Reader.GetBool();
            if ( false === Reader.GetBool() )
            {
                this.Pr.RFonts.EastAsia =
                {
                    Name  : Reader.GetString2(),
                    Index : -1
                };
            }
            else
                this.Pr.RFonts.EastAsia = undefined;

            this.Recalc_CompiledPr(true);
            this.private_UpdateTrackRevisionOnChangeTextPr(false);
            break;
        }

        case historyitem_ParaRun_RFonts_Hint:
        {
            // Bool : undefined ?
            // false -> Long
            bColorPrChange = Reader.GetBool();
            if ( false === Reader.GetBool() )
                this.Pr.RFonts.Hint = Reader.GetLong();
            else
                this.Pr.RFonts.Hint = undefined;

            this.Recalc_CompiledPr(true);
            this.private_UpdateTrackRevisionOnChangeTextPr(false);
            break;
        }

        case historyitem_ParaRun_Lang:
        {
            // Bool : undefined ?
            // false -> Lang
            bColorPrChange = Reader.GetBool();
            if ( false === Reader.GetBool() )
            {
                this.Pr.Lang = new CLang();
                this.Pr.Lang.Read_FromBinary( Reader );
            }
            else
                this.Pr.Lang = new CLang();

            this.Recalc_CompiledPr(true);
            this.protected_UpdateSpellChecking();
            this.private_UpdateTrackRevisionOnChangeTextPr(false);
            break;
        }

        case historyitem_ParaRun_Lang_Bidi:
        {
            // Bool : undefined ?
            // false -> Long
            bColorPrChange = Reader.GetBool();
            if ( false === Reader.GetBool() )
                this.Pr.Lang.Bidi = Reader.GetLong();
            else
                this.Pr.Lang.Bidi = undefined;

            this.Recalc_CompiledPr(true);
            this.protected_UpdateSpellChecking();
            this.private_UpdateTrackRevisionOnChangeTextPr(false);
            break;
        }

        case historyitem_ParaRun_Lang_EastAsia:
        {
            // Bool : undefined ?
            // false -> Long
            bColorPrChange = Reader.GetBool();
            if ( false === Reader.GetBool() )
                this.Pr.Lang.EastAsia = Reader.GetLong();
            else
                this.Pr.Lang.EastAsia = undefined;

            this.Recalc_CompiledPr(true);
            this.protected_UpdateSpellChecking();
            this.private_UpdateTrackRevisionOnChangeTextPr(false);
            break;
        }

        case historyitem_ParaRun_Lang_Val:
        {
            // Bool : undefined ?
            // false -> Long
            bColorPrChange = Reader.GetBool();
            if ( false === Reader.GetBool() )
                this.Pr.Lang.Val = Reader.GetLong();
            else
                this.Pr.Lang.Val = undefined;

            this.Recalc_CompiledPr(true);
            this.protected_UpdateSpellChecking();
            this.private_UpdateTrackRevisionOnChangeTextPr(false);
            break;
        }

        case historyitem_ParaRun_Shd:
        {
            // Bool : undefined
            // false - >
            // Variable : CDocumentShd
            bColorPrChange = Reader.GetBool();
            if ( false === Reader.GetBool() )
            {
                this.Pr.Shd = new CDocumentShd();
                this.Pr.Shd.Read_FromBinary( Reader );
            }
            else
                this.Pr.Shd = undefined;

            this.Recalc_CompiledPr(false);
            this.private_UpdateTrackRevisionOnChangeTextPr(false);
            break;
        }
        case historyitem_ParaRun_MathStyle:
        {
            // Bool : undefined ?
            // false -> Long
            if ( false === Reader.GetBool() )
                this.MathPrp.sty = Reader.GetLong();
            else
                this.MathPrp.sty = undefined;

            this.Recalc_CompiledPr(true);
            this.private_UpdateTrackRevisionOnChangeTextPr(false);
            break;
        }
        case historyitem_ParaRun_MathPrp:
        {
            var Flags = Reader.GetLong();
            if ( Flags & 1 )
                this.MathPrp.aln = Reader.GetBool();

            if ( Flags & 2 )
            {
                this.MathPrp.brk = new CMathBreak();
                this.MathPrp.brk.Read_FromBinary(Reader);
            }

            if ( Flags & 4 )
                this.MathPrp.lit = Reader.GetBool();
            if ( Flags & 8 )
                this.MathPrp.nor = Reader.GetBool();
            if ( Flags & 16 )
                this.MathPrp.scr = Reader.GetLong();
            if ( Flags & 32 )
                this.MathPrp.sty = Reader.GetLong();

            this.Recalc_CompiledPr(true);
            this.private_UpdateTrackRevisionOnChangeTextPr(false);
            break;
        }

        case historyitem_ParaRun_ReviewType:
        {
            // Long        : ReviewType
            // CReviewInfo : ReviewInfo
            this.ReviewType = Reader.GetLong();
            this.ReviewInfo.Read_FromBinary(Reader);
            this.private_UpdateTrackRevisions();
            break;
        }

        case historyitem_ParaRun_PrChange:
        {
            // Bool : is undefined ?
            // false -> TextPr
            // Bool : is undefined ?
            // false -> ReviewInfo

            if (false === Reader.GetBool())
            {
                this.Pr.PrChange = new CTextPr();
                this.Pr.PrChange.Read_FromBinary(Reader);
            }
            else
            {
                this.Pr.PrChange = undefined;
            }

            if (false === Reader.GetBool())
            {
                this.Pr.ReviewInfo = new CReviewInfo();
                this.Pr.ReviewInfo.Read_FromBinary(Reader);
            }
            else
            {
                this.Pr.ReviewInfo = undefined;
            }

            this.private_UpdateTrackRevisions();
            break;
        }

        case historyitem_ParaRun_ContentReviewInfo:
        {
            // Bool : is undefined ?
            // false -> ReviewInfo
            if (false === Reader.GetBool())
            {
                this.ReviewInfo = new CReviewInfo();
                this.ReviewInfo.Read_FromBinary(Reader);
            }
            break;
        }

        case historyitem_ParaRun_PrReviewInfo:
        {
            // Bool : is undefined ?
            // false -> ReviewInfo
            if (false === Reader.GetBool())
            {
                this.ReviewInfo = new CReviewInfo();
                this.ReviewInfo.Read_FromBinary(Reader);
            }
            else
            {
                this.ReviewInfo = undefined;
            }
            break;
        }

        case historyitem_ParaRun_OnStartSplit:
        {
            // Long
            var Pos = Reader.GetLong();
            CollaborativeEditing.OnStart_SplitRun(this, Pos);
            break;
        }
        case historyitem_ParaRun_OnEndSplit:
        {
            // String2
            var RunId = Reader.GetString2();
            CollaborativeEditing.OnEnd_SplitRun(g_oTableId.Get_ById(RunId));
            break;
        }
        case historyitem_ParaRun_MathAlnAt:
        {
            if ( false === Reader.GetBool() )
                this.MathPrp.brk.Apply_AlnAt(Reader.GetLong());
            else
                this.MathPrp.brk.Apply_AlnAt(undefined);

            break;
        }
        case historyitem_ParaRun_MathForcedBreak:
        {
            if ( true === Reader.GetBool() )
            {
                this.MathPrp.brk = new CMathBreak();
            }
            else
            {
                this.MathPrp.brk = undefined;
            }

            break;
        }
    }

    if (bColorPrChange && Color)
    {
        this.private_AddCollPrChangeOther(Color);
    }
};

ParaRun.prototype.Write_ToBinary2 = function(Writer)
{
    Writer.WriteLong( historyitem_type_ParaRun );

    // Long     : Type
    // String   : Id
    // String   : Paragraph Id
    // Variable : CTextPr
    // Long     : ReviewType
    // Bool     : isUndefined ReviewInfo
    // ->false  : ReviewInfo
    // Long     : Количество элементов
    // Array of variable : массив с элементами

    Writer.WriteLong(this.Type);
    var ParagraphToWrite, PrToWrite, ContentToWrite;
    if(this.StartState)
    {
        ParagraphToWrite = this.StartState.Paragraph;
        PrToWrite = this.StartState.Pr;
        ContentToWrite = this.StartState.Content;
    }
    else
    {
        ParagraphToWrite = this.Paragraph;
        PrToWrite = this.Pr;
        ContentToWrite = this.Content;
    }

    Writer.WriteString2( this.Id );
    Writer.WriteString2( null !== ParagraphToWrite && undefined !== ParagraphToWrite ? ParagraphToWrite.Get_Id() : "" );
    PrToWrite.Write_ToBinary( Writer );
    Writer.WriteLong(this.ReviewType);
    if (this.ReviewInfo)
    {
        Writer.WriteBool(false);
        this.ReviewInfo.Write_ToBinary(Writer);
    }
    else
    {
        Writer.WriteBool(true);
    }

    var Count = ContentToWrite.length;
    Writer.WriteLong( Count );
    for ( var Index = 0; Index < Count; Index++ )
    {
        var Item = ContentToWrite[Index];
        Item.Write_ToBinary( Writer );
    }
};

ParaRun.prototype.Read_FromBinary2 = function(Reader)
{
    // Long     : Type
    // String   : Id
    // String   : Paragraph Id
    // Variable : CTextPr
    // Long     : ReviewType
    // Bool     : isUndefined ReviewInfo
    // ->false  : ReviewInfo
    // Long     : Количество элементов
    // Array of variable : массив с элементами

    this.Type      = Reader.GetLong();
    this.Id        = Reader.GetString2();
    this.Paragraph = g_oTableId.Get_ById( Reader.GetString2() );
    this.Pr        = new CTextPr();
    this.Pr.Read_FromBinary( Reader );
    this.ReviewType = Reader.GetLong();
    this.ReviewInfo = new CReviewInfo();
    if (false === Reader.GetBool())
        this.ReviewInfo.Read_FromBinary(Reader);

    if (para_Math_Run == this.Type)
	{
        this.MathPrp = new CMPrp();
		this.size    = new CMathSize();
        this.pos     = new CMathPosition();
	}

    if(undefined !== editor && true === editor.isDocumentEditor)
    {
        var Count = Reader.GetLong();
        this.Content = [];
        for ( var Index = 0; Index < Count; Index++ )
        {
            var Element = ParagraphContent_Read_FromBinary( Reader );
            if ( null !== Element )
                this.Content.push( Element );
        }
    }
};

ParaRun.prototype.Clear_CollaborativeMarks = function()
{
    this.CollaborativeMarks.Clear();
    this.CollPrChangeOther = false;
};
ParaRun.prototype.private_AddCollPrChangeMine = function()
{
    this.CollPrChangeMine  = true;
    this.CollPrChangeOther = false;
};
ParaRun.prototype.private_IsCollPrChangeMine = function()
{
    if (true === this.CollPrChangeMine)
        return true;

    return false;
};
ParaRun.prototype.private_AddCollPrChangeOther = function(Color)
{
    this.CollPrChangeOther = Color;
    CollaborativeEditing.Add_ChangedClass(this);
};
ParaRun.prototype.private_GetCollPrChangeOther = function()
{
    return this.CollPrChangeOther;
};

ParaRun.prototype.private_RecalcCtrPrp = function()
{
    if (para_Math_Run === this.Type && undefined !== this.Parent && null !== this.Parent && null !== this.Parent.ParaMath)
        this.Parent.ParaMath.SetRecalcCtrPrp(this);
};
function CParaRunSelection()
{
    this.Use      = false;
    this.StartPos = 0;
    this.EndPos   = 0;
}

function CParaRunState()
{
    this.Selection  = new CParaRunSelection();
    this.ContentPos = 0;
}

function CParaRunRecalcInfo()
{
    this.TextPr  = true; // Нужно ли пересчитать скомпилированные настройки
    this.Measure = true; // Нужно ли перемерять элементы
    this.Recalc  = true; // Нужно ли пересчитывать (только если текстовый ран)
    this.RunLen  = 0;

    // Далее идут параметры, которые выставляются после пересчета данного Range, такие как пересчитывать ли нумерацию
    this.NumberingItem = null;
    this.NumberingUse  = false; // Используется ли нумерация в данном ране
    this.NumberingAdd  = true;  // Нужно ли в следующем ране использовать нумерацию
}

CParaRunRecalcInfo.prototype =
{
    Reset : function()
    {
        this.TextPr  = true;
        this.Measure = true;
        this.Recalc  = true;
        this.RunLen  = 0;
    }

};

function CParaRunRange(StartPos, EndPos)
{
    this.StartPos = StartPos; // Начальная позиция в контенте, с которой начинается данный отрезок
    this.EndPos   = EndPos;   // Конечная позиция в контенте, на которой заканчивается данный отрезок (перед которой)
}

function CParaRunLine()
{
    this.Ranges       = [];
    this.Ranges[0]    = new CParaRunRange( 0, 0 );
    this.RangesLength = 0;
}

CParaRunLine.prototype =
{
    Add_Range : function(RangeIndex, StartPos, EndPos)
    {
        if ( 0 !== RangeIndex )
        {
            this.Ranges[RangeIndex] = new CParaRunRange( StartPos, EndPos );
            this.RangesLength  = RangeIndex + 1;
        }
        else
        {
            this.Ranges[0].StartPos = StartPos;
            this.Ranges[0].EndPos   = EndPos;
            this.RangesLength = 1;
        }

        if ( this.Ranges.length > this.RangesLength )
            this.Ranges.legth = this.RangesLength;
    },

    Copy : function()
    {
        var NewLine = new CParaRunLine();

        NewLine.RangesLength = this.RangesLength;

        for ( var CurRange = 0; CurRange < this.RangesLength; CurRange++ )
        {
            var Range = this.Ranges[CurRange];
            NewLine.Ranges[CurRange] = new CParaRunRange( Range.StartPos, Range.EndPos );
        }

        return NewLine;
    },

    Compare : function(OtherLine, CurRange)
    {
        // Сначала проверим наличие данного отрезка в обеих строках
        if ( this.RangesLength <= CurRange || OtherLine.RangesLength <= CurRange )
            return false;

        var OtherRange = OtherLine.Ranges[CurRange];
        var ThisRange  = this.Ranges[CurRange];

        if ( OtherRange.StartPos !== ThisRange.StartPos || OtherRange.EndPos !== ThisRange.EndPos )
            return false;

        return true;
    }


};

// Метка о конце или начале изменений пришедших от других соавторов документа
var pararun_CollaborativeMark_Start = 0x00;
var pararun_CollaborativeMark_End   = 0x01;

function CParaRunCollaborativeMark(Pos, Type)
{
    this.Pos  = Pos;
    this.Type = Type;
}

function FontSize_IncreaseDecreaseValue(bIncrease, Value)
{
    // Закон изменения размеров :
    // 1. Если значение меньше 8, тогда мы увеличиваем/уменьшаем по 1 (от 1 до 8)
    // 2. Если значение больше 72, тогда мы увеличиваем/уменьшаем по 10 (от 80 до бесконечности
    // 3. Если значение в отрезке [8,72], тогда мы переходим по следующим числам 8,9,10,11,12,14,16,18,20,22,24,26,28,36,48,72

    var Sizes = [8,9,10,11,12,14,16,18,20,22,24,26,28,36,48,72];

    var NewValue = Value;
    if ( true === bIncrease )
    {
        if ( Value < Sizes[0] )
        {
            if ( Value >= Sizes[0] - 1 )
                NewValue = Sizes[0];
            else
                NewValue = Math.floor(Value + 1);
        }
        else if ( Value >= Sizes[Sizes.length - 1] )
        {
            NewValue = Math.min( 300, Math.floor( Value / 10 + 1 ) * 10 );
        }
        else
        {
            for ( var Index = 0; Index < Sizes.length; Index++ )
            {
                if ( Value < Sizes[Index] )
                {
                    NewValue = Sizes[Index];
                    break;
                }
            }
        }
    }
    else
    {
        if ( Value <= Sizes[0] )
        {
            NewValue = Math.max( Math.floor( Value - 1 ), 1 );
        }
        else if ( Value > Sizes[Sizes.length - 1] )
        {
            if ( Value <= Math.floor( Sizes[Sizes.length - 1] / 10 + 1 ) * 10 )
                NewValue = Sizes[Sizes.length - 1];
            else
                NewValue = Math.floor( Math.ceil(Value / 10) - 1 ) * 10;
        }
        else
        {
            for ( var Index = Sizes.length - 1; Index >= 0; Index-- )
            {
                if ( Value > Sizes[Index] )
                {
                    NewValue = Sizes[Index];
                    break;
                }
            }
        }
    }

    return NewValue;
}


function CRunCollaborativeMarks()
{
    this.Ranges = [];
    this.DrawingObj = {};
}

CRunCollaborativeMarks.prototype =
{
    Add : function(PosS, PosE, Color)
    {
        var Count = this.Ranges.length;
        for ( var Index = 0; Index < Count; Index++ )
        {
            var Range = this.Ranges[Index];

            if ( PosS > Range.PosE )
                continue;
            else if ( PosS >= Range.PosS && PosS <= Range.PosE && PosE >= Range.PosS && PosE <= Range.PosE )
            {
                if ( true !== Color.Compare(Range.Color) )
                {
                    var _PosE = Range.PosE;
                    Range.PosE = PosS;
                    this.Ranges.splice( Index + 1, 0, new CRunCollaborativeRange(PosS, PosE, Color) );
                    this.Ranges.splice( Index + 2, 0, new CRunCollaborativeRange(PosE, _PosE, Range.Color) );
                }

                return;
            }
            else if ( PosE < Range.PosS )
            {
                this.Ranges.splice( Index, 0, new CRunCollaborativeRange(PosS, PosE, Color) );
                return;
            }
            else if ( PosS < Range.PosS && PosE > Range.PosE )
            {
                Range.PosS = PosS;
                Range.PosE = PosE;
                Range.Color = Color;
                return;
            }
            else if ( PosS < Range.PosS ) // && PosE <= Range.PosE )
            {
                if ( true === Color.Compare(Range.Color) )
                    Range.PosS = PosS;
                else
                {
                    Range.PosS = PosE;
                    this.Ranges.splice( Index, 0, new CRunCollaborativeRange(PosS, PosE, Color) );
                }

                return;
            }
            else //if ( PosS >= Range.PosS && PosE > Range.Pos.E )
            {
                if ( true === Color.Compare(Range.Color) )
                    Range.PosE = PosE;
                else
                {
                    Range.PosE = PosS;
                    this.Ranges.splice( Index + 1, 0, new CRunCollaborativeRange(PosS, PosE, Color) );
                }

                return;
            }
        }

        this.Ranges.push( new CRunCollaborativeRange(PosS, PosE, Color) );
    },

    Update_OnAdd : function(Pos)
    {
        var Count = this.Ranges.length;
        for ( var Index = 0; Index < Count; Index++ )
        {
            var Range = this.Ranges[Index];

            if ( Pos <= Range.PosS )
            {
                Range.PosS++;
                Range.PosE++;
            }
            else if ( Pos > Range.PosS && Pos < Range.PosE )
            {
                var NewRange = new CRunCollaborativeRange( Pos + 1, Range.PosE + 1, Range.Color.Copy() );
                this.Ranges.splice( Index + 1, 0, NewRange );
                Range.PosE = Pos;
                Count++;
                Index++;
            }
            //else if ( Pos < Range.PosE )
            //    Range.PosE++;
        }
    },

    Update_OnRemove : function(Pos, Count)
    {
        var Len = this.Ranges.length;
        for ( var Index = 0; Index < Len; Index++ )
        {
            var Range = this.Ranges[Index];

            var PosE = Pos + Count;
            if ( Pos < Range.PosS )
            {
                if ( PosE <= Range.PosS )
                {
                    Range.PosS -= Count;
                    Range.PosE -= Count;
                }
                else if ( PosE >= Range.PosE )
                {
                    this.Ranges.splice( Index, 1 );
                    Len--;
                    Index--;continue;
                }
                else
                {
                    Range.PosS = Pos;
                    Range.PosE -= Count;
                }
            }
            else if ( Pos >= Range.PosS && Pos < Range.PosE )
            {
                if ( PosE >= Range.PosE )
                    Range.PosE = Pos;
                else
                    Range.PosE -= Count;
            }
            else
                continue;
        }
    },

    Clear : function()
    {
        this.Ranges = [];
    },

    Init_Drawing  : function()
    {
        this.DrawingObj = {};

        var Count = this.Ranges.length;
        for ( var CurPos = 0; CurPos < Count; CurPos++ )
        {
            var Range = this.Ranges[CurPos];

            for ( var Pos = Range.PosS; Pos < Range.PosE; Pos++ )
                this.DrawingObj[Pos] = Range.Color;
        }
    },

    Check : function(Pos)
    {
        if ( undefined !== this.DrawingObj[Pos] )
            return this.DrawingObj[Pos];

        return null;
    }
};

function CRunCollaborativeRange(PosS, PosE, Color)
{
    this.PosS  = PosS;
    this.PosE  = PosE;
    this.Color = Color;
}

ParaRun.prototype.Math_SetPosition = function(pos, PosInfo)
{
    var Line  = PosInfo.CurLine,
        Range = PosInfo.CurRange;

    var CurLine  = Line - this.StartLine;
    var CurRange = ( 0 === CurLine ? Range - this.StartRange : Range );

    var StartPos = this.protected_GetRangeStartPos(CurLine, CurRange);
    var EndPos   = this.protected_GetRangeEndPos(CurLine, CurRange);

    // запомним позицию для Recalculate_CurPos, когда  Run пустой
    this.pos.x = pos.x;
    this.pos.y = pos.y;

    for(var Pos = StartPos; Pos < EndPos; Pos++)
    {
        var Item = this.Content[Pos];
        if(PosInfo.DispositionOpers !== null && Item.Type == para_Math_BreakOperator)
        {
            PosInfo.DispositionOpers.push(pos.x + Item.GapLeft);
        }

        this.Content[Pos].setPosition(pos);
        pos.x += this.Content[Pos].Get_WidthVisible(); // Get_Width => Get_WidthVisible
                                                     // Get_WidthVisible - Width + Gaps с учетом настроек состояния
    }
};
ParaRun.prototype.Math_Get_StartRangePos = function(_CurLine, _CurRange, SearchPos, Depth, bStartLine)
{
    var CurLine  = _CurLine - this.StartLine;
    var CurRange = ( 0 === CurLine ? _CurRange - this.StartRange : _CurRange );

    var StartPos = this.protected_GetRangeStartPos(CurLine, CurRange);

    var Pos = this.State.ContentPos;
    var Result = true;

    if(bStartLine || StartPos < Pos)
    {
        SearchPos.Pos.Update(StartPos, Depth);
    }
    else
    {
        Result = false;
    }

    return Result;
};
ParaRun.prototype.Math_Get_EndRangePos = function(_CurLine, _CurRange, SearchPos, Depth, bEndLine)
{
    var CurLine  = _CurLine - this.StartLine;
    var CurRange = ( 0 === CurLine ? _CurRange - this.StartRange : _CurRange );

    var EndPos = this.protected_GetRangeEndPos(CurLine, CurRange);

    var Pos = this.State.ContentPos;
    var Result = true;

    if(bEndLine  || Pos < EndPos)
    {
        SearchPos.Pos.Update(EndPos, Depth);
    }
    else
    {
        Result = false;
    }

    return Result;
};
ParaRun.prototype.Math_Is_End = function(_CurLine, _CurRange)
{
    var CurLine  = _CurLine - this.StartLine;
    var CurRange = ( 0 === CurLine ? _CurRange - this.StartRange : _CurRange );

    var EndPos = this.protected_GetRangeEndPos(CurLine, CurRange);

    return EndPos == this.Content.length;
};
ParaRun.prototype.IsEmptyRange = function(_CurLine, _CurRange)
{
    var CurLine  = _CurLine - this.StartLine;
    var CurRange = ( 0 === CurLine ? _CurRange - this.StartRange : _CurRange );

    var StartPos = this.protected_GetRangeStartPos(CurLine, CurRange);
    var EndPos   = this.protected_GetRangeEndPos(CurLine, CurRange);

    return StartPos == EndPos;
};
ParaRun.prototype.Recalculate_Range_OneLine = function(PRS, ParaPr, Depth)
{
    // данная функция используется только для мат объектов, которые на строки не разбиваются

    // ParaText (ParagraphContent.js)
    // для настройки TextPr
    // Measure

    // FontClassification.js
    // Get_FontClass

    var Lng = this.Content.length;

    var CurLine  = PRS.Line - this.StartLine;
    var CurRange = ( 0 === CurLine ? PRS.Range - this.StartRange : PRS.Range );


    // обновляем позиции start и end для Range
    var RangeStartPos = this.protected_AddRange(CurLine, CurRange);
    var RangeEndPos = Lng;

    this.Math_RecalculateContent(PRS);

    this.protected_FillRange(CurLine, CurRange, RangeStartPos, RangeEndPos);
};
ParaRun.prototype.Math_RecalculateContent = function(PRS)
{
    var WidthPoints = this.Parent.Get_WidthPoints();
    this.bEqArray = this.Parent.IsEqArray();

    var ascent = 0, descent = 0, width = 0;

    this.Recalculate_MeasureContent();
    var Lng = this.Content.length;

    for(var i = 0 ; i < Lng; i++)
    {
        var Item = this.Content[i];
        var size = Item.size,
            Type = Item.Type;

        var WidthItem = Item.Get_WidthVisible(); // Get_Width => Get_WidthVisible
                                                 // Get_WidthVisible - Width + Gaps с учетом настроек состояния
        width += WidthItem;

        if(ascent < size.ascent)
            ascent = size.ascent;

        if (descent < size.height - size.ascent)
            descent = size.height - size.ascent;

        if(this.bEqArray)
        {
            if(Type === para_Math_Ampersand && true === Item.IsAlignPoint())
            {
                WidthPoints.AddNewAlignRange();
            }
            else
            {
                WidthPoints.UpdatePoint(WidthItem);
            }
        }
    }

    this.size.width  = width;
    this.size.ascent = ascent;
    this.size.height = ascent + descent;
};
ParaRun.prototype.Math_Set_EmptyRange = function(_CurLine, _CurRange)
{
    var CurLine  = _CurLine - this.StartLine;
    var CurRange = (0 === CurLine ? _CurRange - this.StartRange : _CurRange);

    var RangeStartPos = this.protected_AddRange(CurLine, CurRange);
    var RangeEndPos   = RangeStartPos;

    this.protected_FillRange(CurLine, CurRange, RangeStartPos, RangeEndPos);
};
// в этой функции проставляем состояние Gaps (крайние или нет) для всех операторов, к-ые участвуют в разбиении, чтобы не получилось случайно, что при изменении разбивки формулы на строки произошло, что у оператора не будет проставлен Gap
ParaRun.prototype.UpdateOperators = function(_CurLine, _CurRange, bEmptyGapLeft, bEmptyGapRight)
{
    var CurLine  = _CurLine - this.StartLine;
    var CurRange = ( 0 === CurLine ? _CurRange - this.StartRange : _CurRange );

    var StartPos = this.protected_GetRangeStartPos(CurLine, CurRange);
    var EndPos   = this.protected_GetRangeEndPos(CurLine, CurRange);

    for(var Pos = StartPos; Pos < EndPos; Pos++)
    {
        var _bEmptyGapLeft  = bEmptyGapLeft && Pos == StartPos,
            _bEmptyGapRight = bEmptyGapRight && Pos == EndPos - 1;

        this.Content[Pos].Update_StateGapLeft(_bEmptyGapLeft);
        this.Content[Pos].Update_StateGapRight(_bEmptyGapRight);
    }
};
ParaRun.prototype.Math_Apply_Style = function(Value)
{
    if(Value !== this.MathPrp.sty)
    {
        var OldValue     = this.MathPrp.sty;
        this.MathPrp.sty = Value;

        History.Add( this, { Type : historyitem_ParaRun_MathStyle, New : Value, Old : OldValue } );

        this.Recalc_CompiledPr(true);
        this.private_UpdateTrackRevisionOnChangeTextPr(true);
    }
};
ParaRun.prototype.IsNormalText = function()
{
    var comp_MPrp = this.MathPrp.GetCompiled_ScrStyles();
    return comp_MPrp.nor === true;
};
ParaRun.prototype.getPropsForWrite = function()
{
    var wRPrp = this.Pr.Copy(),
        mathRPrp = this.MathPrp.Copy();

    return {wRPrp: wRPrp, mathRPrp: mathRPrp};
};
ParaRun.prototype.Get_MathPr = function(bCopy)
{
    if(this.Type = para_Math_Run)
    {
        if(bCopy)
            return this.MathPrp.Copy();
        else
            return this.MathPrp;
    }
};
ParaRun.prototype.Math_PreRecalc = function(Parent, ParaMath, ArgSize, RPI, GapsInfo)
{
    this.Parent    = Parent;
    this.Paragraph = ParaMath.Paragraph;

    var FontSize = this.Get_CompiledPr(false).FontSize;

    if(RPI.bChangeInline)
        this.RecalcInfo.Measure = true; // нужно сделать пересчет элементов, например для дроби, т.к. ArgSize у внутренних контентов будет другой => размер

    if(RPI.bCorrect_ConvertFontSize) // изменение FontSize после конвертации из старого формата в новый
    {
        var FontKoef;

        if(ArgSize == -1 || ArgSize == -2)
        {
            var Pr = new CTextPr();

            if(this.Pr.FontSize !== null && this.Pr.FontSize !== undefined)
            {
                FontKoef = MatGetKoeffArgSize(this.Pr.FontSize, ArgSize);
                Pr.FontSize = (((this.Pr.FontSize/FontKoef * 2 + 0.5) | 0) / 2);
                this.RecalcInfo.TextPr  = true;
                this.RecalcInfo.Measure = true;
            }

            if(this.Pr.FontSizeCS !== null && this.Pr.FontSizeCS !== undefined)
            {
                FontKoef = MatGetKoeffArgSize( this.Pr.FontSizeCS, ArgSize);
                Pr.FontSizeCS = (((this.Pr.FontSizeCS/FontKoef * 2 + 0.5) | 0) / 2);
                this.RecalcInfo.TextPr  = true;
                this.RecalcInfo.Measure = true;
            }

            this.Apply_Pr(Pr);
        }
    }

    for (var Pos = 0 ; Pos < this.Content.length; Pos++ )
    {
        if( !this.Content[Pos].IsAlignPoint() )
            GapsInfo.setGaps(this.Content[Pos], FontSize);

        this.Content[Pos].PreRecalc(this, ParaMath);
        this.Content[Pos].SetUpdateGaps(false);
    }

};
ParaRun.prototype.Math_GetRealFontSize = function(FontSize)
{
    var RealFontSize = FontSize ;

    if(FontSize !== null && FontSize !== undefined)
    {
        var ArgSize   = this.Parent.Compiled_ArgSz.value;
        RealFontSize  = FontSize*MatGetKoeffArgSize(FontSize, ArgSize);
    }

    return RealFontSize;
};
ParaRun.prototype.Math_CompareFontSize = function(ComparableFontSize, bStartLetter)
{
    var lng = this.Content.length;

    var Letter = this.Content[lng - 1];

    if(bStartLetter == true)
        Letter = this.Content[0];


    var CompiledPr = this.Get_CompiledPr(false);
    var LetterFontSize = Letter.Is_LetterCS() ? CompiledPr.FontSizeCS : CompiledPr.FontSize;

    return ComparableFontSize == this.Math_GetRealFontSize(LetterFontSize);
};
ParaRun.prototype.Math_EmptyRange = function(_CurLine, _CurRange) // до пересчета нужно узнать будет ли данный Run пустым или нет в данном Range, необходимо для того, чтобы выставить wrapIndent
{
    var bEmptyRange = true;
    var Lng = this.Content.length;

    if(Lng > 0)
    {
        var CurLine  = _CurLine - this.StartLine;
        var CurRange = ( 0 === CurLine ? _CurRange - this.StartRange : _CurRange );

        bEmptyRange = this.protected_GetPrevRangeEndPos(CurLine, CurRange) >= Lng;
    }

    return bEmptyRange;
};
ParaRun.prototype.Math_UpdateGaps = function(_CurLine, _CurRange, GapsInfo)
{
    var CurLine  = _CurLine - this.StartLine;
    var CurRange = ( 0 === CurLine ? _CurRange - this.StartRange : _CurRange );

    var StartPos = this.protected_GetRangeStartPos(CurLine, CurRange);
    var EndPos   = this.protected_GetRangeEndPos(CurLine, CurRange);

    var FontSize = this.Get_CompiledPr(false).FontSize;

    for(var Pos = StartPos; Pos < EndPos; Pos++)
    {
        GapsInfo.updateCurrentObject(this.Content[Pos], FontSize);

        var bUpdateCurrent = this.Content[Pos].IsNeedUpdateGaps();

        if(bUpdateCurrent || GapsInfo.bUpdate)
        {
            GapsInfo.updateGaps();
        }

        GapsInfo.bUpdate = bUpdateCurrent;

        this.Content[Pos].SetUpdateGaps(false);

    }
};
ParaRun.prototype.Math_Can_ModidyForcedBreak = function(Pr, bStart, bEnd)
{
    var Pos = this.Math_GetPosForcedBreak(bStart, bEnd);

    if(Pos !== null)
    {
        if(this.MathPrp.IsBreak())
        {
            Pr.Set_DeleteForcedBreak();
        }
        else
        {
            Pr.Set_InsertForcedBreak();
        }
    }

};
ParaRun.prototype.Math_GetPosForcedBreak = function(bStart, bEnd)
{
    var ResultPos = null;

    if(this.Content.length > 0)
    {
        var StartPos = this.Selection.StartPos,
            EndPos   = this.Selection.EndPos,
            bSelect  = this.Selection.Use;

        if(StartPos > EndPos)
        {
            StartPos = this.Selection.EndPos;
            EndPos   = this.Selection.StartPos;
        }

        var bCheckTwoItem = bSelect == false || (bSelect == true && EndPos == StartPos),
            bCheckOneItem = bSelect == true && EndPos - StartPos == 1;

        if(bStart)
        {
            ResultPos = this.Content[0].Type == para_Math_BreakOperator ? 0 : ResultPos;
        }
        else if(bEnd)
        {
            var lastPos = this.Content.length - 1;
            ResultPos = this.Content[lastPos].Type == para_Math_BreakOperator ? lastPos : ResultPos;
        }
        else if(bCheckTwoItem)
        {
            var Pos = bSelect == false ? this.State.ContentPos : StartPos;
            var bPrevBreakOperator  = Pos > 0 ? this.Content[Pos - 1].Type == para_Math_BreakOperator : false,
                bCurrBreakOperator  = Pos < this.Content.length ? this.Content[Pos].Type == para_Math_BreakOperator : false;

            if(bCurrBreakOperator)
            {
                ResultPos = Pos
            }
            else if(bPrevBreakOperator)
            {
                ResultPos = Pos - 1;
            }

        }
        else if(bCheckOneItem)
        {
            if(this.Content[StartPos].Type == para_Math_BreakOperator)
            {
                ResultPos = StartPos;
            }
        }
    }

    return ResultPos;
};
ParaRun.prototype.Check_ForcedBreak = function(bStart, bEnd)
{
    return this.Math_GetPosForcedBreak(bStart, bEnd) !== null;
};
ParaRun.prototype.Set_MathForcedBreak = function(bInsert)
{
    if(bInsert == true && false == this.MathPrp.IsBreak())
    {
        History.Add(this, {Type: historyitem_ParaRun_MathForcedBreak, bInsert: true, alnAt: undefined });
        this.MathPrp.Insert_ForcedBreak();
    }
    else if(bInsert == false && true == this.MathPrp.IsBreak())
    {
        History.Add(this, {Type: historyitem_ParaRun_MathForcedBreak, bInsert: false, alnAt: this.MathPrp.Get_AlnAt()});
        this.MathPrp.Delete_ForcedBreak();
    }
};
ParaRun.prototype.Math_SplitRunForcedBreak = function()
{
    var Pos =  this.Math_GetPosForcedBreak();
    var NewRun = null;

    if(Pos != null && Pos > 0) // разбиваем Run на два
    {
        NewRun = this.Split_Run(Pos);
    }

    return NewRun;
};
ParaRun.prototype.UpdLastElementForGaps = function(_CurLine, _CurRange, GapsInfo)
{
    var CurLine  = _CurLine - this.StartLine;
    var CurRange = ( 0 === CurLine ? _CurRange - this.StartRange : _CurRange );

    var EndPos   = this.protected_GetRangeEndPos(CurLine, CurRange);
    var FontSize = this.Get_CompiledPr(false).FontSize;
    var Last     = this.Content[EndPos];

    GapsInfo.updateCurrentObject(Last, FontSize);

};
ParaRun.prototype.IsPlaceholder = function()
{
    return this.Content.length == 1 && this.Content[0].IsPlaceholder();
};
ParaRun.prototype.fillPlaceholders = function()
{
    var placeholder = new CMathText(false);
    placeholder.fillPlaceholders();

    this.Add_ToContent(0, placeholder, false);
};
ParaRun.prototype.Math_Correct_Content = function()
{
    for(var i = 0; i < this.Content.length; i++)
    {
        if(this.Content[i].Type == para_Math_Placeholder)
            this.Remove_FromContent(i, 1, true);
    }
};
ParaRun.prototype.OnlyOnePlaceholder = function()
{
    return this.Content.length == 1 && this.Content[0].Type == para_Math_Placeholder;
};
ParaRun.prototype.Set_MathPr = function(MPrp)
{
    var OldValue = this.MathPrp;
    this.MathPrp.Set_Pr(MPrp);

    History.Add( this, { Type : historyitem_ParaRun_MathPrp, New : this.MathPrp, Old : OldValue } );
    this.Recalc_CompiledPr(true);
    this.private_UpdateTrackRevisionOnChangeTextPr(true);
};
ParaRun.prototype.Set_MathTextPr2 = function(TextPr, MathPr)
{
    this.Set_Pr(TextPr.Copy());
    this.Set_MathPr(MathPr.Copy());
};
ParaRun.prototype.IsAccent = function()
{
    return this.Parent.IsAccent();
};
ParaRun.prototype.GetCompiled_ScrStyles = function()
{
    return this.MathPrp.GetCompiled_ScrStyles();
};
ParaRun.prototype.IsEqArray = function()
{
    return this.Parent.IsEqArray();
};
ParaRun.prototype.IsForcedBreak = function()
{
    return false == this.ParaMath.Is_Inline() && true == this.MathPrp.IsBreak();
};
ParaRun.prototype.Is_StartForcedBreakOperator = function()
{
    return true == this.IsForcedBreak() && true == this.Is_StartBreakOperator();
};
ParaRun.prototype.Is_StartBreakOperator = function()
{
    return this.Content.length > 0 && this.Content[0].Type == para_Math_BreakOperator;
};
ParaRun.prototype.Get_AlignBrk = function()
{
    return true == this.Is_StartForcedBreakOperator() ? this.MathPrp.Get_AlignBrk() : 0;
};
ParaRun.prototype.Math_Is_InclineLetter = function()
{
    var result = false;

    if(this.Content.length == 1)
        result = this.Content[0].Is_InclineLetter();

    return result;
};
ParaRun.prototype.GetMathTextPrForMenu = function()
{
    var TextPr = new CTextPr();

    if(this.IsPlaceholder())
        TextPr.Merge(this.Parent.GetCtrPrp());

    TextPr.Merge(this.Pr);

    var MathTextPr = this.MathPrp.Copy();
    var BI = MathTextPr.GetBoldItalic();

    TextPr.Italic = BI.Italic;
    TextPr.Bold   = BI.Bold;

    return TextPr;
};
ParaRun.prototype.ApplyPoints = function(PointsInfo)
{
    if(this.Parent.IsEqArray())
    {
        this.size.width = 0;

        for(var Pos = 0; Pos < this.Content.length; Pos++)
        {
            var Item = this.Content[Pos];
            if(Item.Type === para_Math_Ampersand && true === Item.IsAlignPoint())
            {
                PointsInfo.NextAlignRange();
                Item.size.width = PointsInfo.GetAlign();
            }

            this.size.width += this.Content[Pos].Get_WidthVisible(); // Get_Width => Get_WidthVisible
                                                                     // Get_WidthVisible - Width + Gaps с учетом настроек состояния
        }
    }
};
ParaRun.prototype.Get_TextForAutoCorrect = function(AutoCorrectEngine, RunPos)
{
    var ActionElement = AutoCorrectEngine.Get_ActionElement();
    var nCount = this.Content.length;
    for (var nPos = 0; nPos < nCount; nPos++)
    {
        var Item = this.Content[nPos];
        if (para_Math_Text === Item.Type || para_Math_BreakOperator === Item.Type)
        {
            AutoCorrectEngine.Add_Text(String.fromCharCode(Item.value), this, nPos, RunPos);
        }
		else if (para_Math_Ampersand === Item.Type)
		{
			 AutoCorrectEngine.Add_Text('&', this, nPos, RunPos);
		}

        if (Item === ActionElement)
        {
            AutoCorrectEngine.Stop_CollectText();
            break;
        }
    }

    if (null === AutoCorrectEngine.TextPr)
        AutoCorrectEngine.TextPr = this.Pr.Copy();

    if (null == AutoCorrectEngine.MathPr)
        AutoCorrectEngine.MathPr = this.MathPrp.Copy();
};
ParaRun.prototype.IsShade = function()
{
    var oShd = this.Get_CompiledPr(false).Shd;
    return !(oShd === undefined || shd_Nil === oShd.Value);
};
ParaRun.prototype.Get_RangesByPos = function(Pos)
{
    var Ranges = [];
    var LinesCount = this.protected_GetLinesCount();
    for (var LineIndex = 0; LineIndex < LinesCount; LineIndex++)
    {
        var RangesCount = this.protected_GetRangesCount(LineIndex);
        for (var RangeIndex = 0; RangeIndex < RangesCount; RangeIndex++)
        {
            var StartPos = this.protected_GetRangeStartPos(LineIndex, RangeIndex);
            var EndPos   = this.protected_GetRangeEndPos(LineIndex, RangeIndex);

            if (StartPos <= Pos && Pos <= EndPos)
                Ranges.push({Range : (LineIndex === 0 ? RangeIndex + this.StartRange : RangeIndex), Line : LineIndex + this.StartLine});
        }
    }

    return Ranges;
};
ParaRun.prototype.Compare_DrawingsLogicPositions = function(CompareObject)
{
    var Drawing1 = CompareObject.Drawing1;
    var Drawing2 = CompareObject.Drawing2;

    for (var Pos = 0, Count = this.Content.length; Pos < Count; Pos++)
    {
        var Item = this.Content[Pos];

        if (Item === Drawing1)
        {
            CompareObject.Result = 1;
            return;
        }
        else if (Item === Drawing2)
        {
            CompareObject.Result = -1;
            return;
        }
    }
};
ParaRun.prototype.Get_ReviewType = function()
{
    return this.ReviewType;
};
ParaRun.prototype.Get_ReviewColor = function()
{
    if (this.ReviewInfo)
        return this.ReviewInfo.Get_Color();

    return REVIEW_COLOR;
};
ParaRun.prototype.Set_ReviewType = function(Value)
{
    if (Value !== this.ReviewType)
    {
        var OldReviewType = this.ReviewType;
        var OldReviewInfo = this.ReviewInfo.Copy();

        this.ReviewType = Value;
        this.ReviewInfo.Update();

        History.Add(this, {Type : historyitem_ParaRun_ReviewType, New : {ReviewType :  this.ReviewType, ReviewInfo : this.ReviewInfo.Copy()}, Old : {ReviewType :  OldReviewType, ReviewInfo : OldReviewInfo}});
        this.private_UpdateTrackRevisions();
    }
};
ParaRun.prototype.Set_ReviewTypeWithInfo = function(ReviewType, ReviewInfo)
{
    History.Add(this, {Type : historyitem_ParaRun_ReviewType, Old : {ReviewType :  this.ReviewType, ReviewInfo : this.ReviewInfo ? this.ReviewInfo.Copy() : undefined}, New : {ReviewType :  ReviewType, ReviewInfo : ReviewInfo ? ReviewInfo.Copy() : undefined}});

    this.ReviewType = ReviewType;
    this.ReviewInfo = ReviewInfo;

    this.private_UpdateTrackRevisions();
};
ParaRun.prototype.Get_Parent = function()
{
    if (!this.Paragraph)
        return null;

    var ContentPos = this.Paragraph.Get_PosByElement(this);
    if (null == ContentPos || undefined == ContentPos || ContentPos.Get_Depth() < 0)
        return null;

    ContentPos.Decrease_Depth(1);
    return this.Paragraph.Get_ElementByPos(ContentPos);
};
ParaRun.prototype.private_GetPosInParent = function(_Parent)
{
    var Parent = (_Parent? _Parent : this.Get_Parent());
    if (!Parent)
        return -1;

    // Ищем данный элемент в родительском классе
    var RunPos = -1;
    for (var Pos = 0, Count = Parent.Content.length; Pos < Count; Pos++)
    {
        if (this === Parent.Content[Pos])
        {
            RunPos = Pos;
            break;
        }
    }

    return RunPos;
};
ParaRun.prototype.Make_ThisElementCurrent = function()
{
    if (this.Paragraph && true === this.Paragraph.Is_UseInDocument() && true === this.Is_UseInParagraph())
    {
        var ContentPos = this.Paragraph.Get_PosByElement(this);
        ContentPos.Add(this.State.ContentPos);
        this.Paragraph.Set_ParaContentPos(ContentPos, true, -1, -1);
        this.Paragraph.Document_SetThisElementCurrent(false);
    }
};
ParaRun.prototype.Get_AllParagraphs = function(Props, ParaArray)
{
    var ContentLen = this.Content.length;
    for (var CurPos = 0; CurPos < ContentLen; CurPos++)
    {
        if (para_Drawing == this.Content[CurPos].Type)
            this.Content[CurPos].Get_AllParagraphs(Props, ParaArray);
    }
};
ParaRun.prototype.Check_RevisionsChanges = function(Checker, ContentPos, Depth)
{
    if (this.Is_Empty())
        return;

    if (true !== Checker.Is_ParaEndRun() && true !== Checker.Is_CheckOnlyTextPr())
    {
        var ReviewType = this.Get_ReviewType();
        if (ReviewType !== Checker.Get_AddRemoveType() || (reviewtype_Common !== ReviewType && this.ReviewInfo.Get_UserId() !== Checker.Get_AddRemoveUserId()))
        {
            Checker.Flush_AddRemoveChange();
            ContentPos.Update(0, Depth);

            if (reviewtype_Add === ReviewType || reviewtype_Remove === ReviewType)
                Checker.Start_AddRemove(ReviewType, ContentPos);
        }

        if (reviewtype_Add === ReviewType || reviewtype_Remove === ReviewType)
        {
            var Text = "";
            var ContentLen = this.Content.length;
            for (var CurPos = 0; CurPos < ContentLen; CurPos++)
            {
                var Item = this.Content[CurPos];
                var ItemType = Item.Type;
                switch (ItemType)
                {
                    case para_Drawing:
                    {
                        Checker.Add_Text(Text);
                        Text = "";
                        Checker.Add_Drawing(Item);
                        break;
                    }
                    case para_Text :
                    {
                        Text += String.fromCharCode(Item.Value);
                        break;
                    }
                    case para_Math_Text:
                    {
                        Text += String.fromCharCode(Item.getCodeChr());
                        break;
                    }
                    case para_Space:
                    case para_Tab  :
                    {
                        Text += " ";
                        break;
                    }
                }
            }
            Checker.Add_Text(Text);
            ContentPos.Update(this.Content.length, Depth);
            Checker.Set_AddRemoveEndPos(ContentPos);
            Checker.Update_AddRemoveReviewInfo(this.ReviewInfo);
        }
    }

    var HavePrChange = this.Have_PrChange();
    var DiffPr = this.Get_DiffPrChange();
    if (HavePrChange !== Checker.Have_PrChange() || true !== Checker.Compare_PrChange(DiffPr) || this.Pr.ReviewInfo.Get_UserId() !== Checker.Get_PrChangeUserId())
    {
        Checker.Flush_TextPrChange();
        ContentPos.Update(0, Depth);
        if (true === HavePrChange)
        {
            Checker.Start_PrChange(DiffPr, ContentPos);
        }
    }

    if (true === HavePrChange)
    {
        ContentPos.Update(this.Content.length, Depth);
        Checker.Set_PrChangeEndPos(ContentPos);
        Checker.Update_PrChangeReviewInfo(this.Pr.ReviewInfo);
    }
};
ParaRun.prototype.private_UpdateTrackRevisionOnChangeContent = function(bUpdateInfo)
{
    if (reviewtype_Common !== this.Get_ReviewType())
    {
        this.private_UpdateTrackRevisions();

        if (true === bUpdateInfo && this.Paragraph && this.Paragraph.LogicDocument && true === this.Paragraph.LogicDocument.Is_TrackRevisions() && this.ReviewInfo && true === this.ReviewInfo.Is_CurrentUser())
        {
            var OldReviewInfo = this.ReviewInfo.Copy();
            this.ReviewInfo.Update();
            History.Add(this, {Type : historyitem_ParaRun_ContentReviewInfo, Old : OldReviewInfo, New : this.ReviewInfo.Copy()});
        }
    }
};
ParaRun.prototype.private_UpdateTrackRevisionOnChangeTextPr = function(bUpdateInfo)
{
    if (true === this.Have_PrChange())
    {
        this.private_UpdateTrackRevisions();

        if (true === bUpdateInfo && this.Paragraph && this.Paragraph.LogicDocument && true === this.Paragraph.LogicDocument.Is_TrackRevisions())
        {
            var OldReviewInfo = this.Pr.ReviewInfo.Copy();
            this.Pr.ReviewInfo.Update();
            History.Add(this, {Type : historyitem_ParaRun_PrReviewInfo, Old : OldReviewInfo, New : this.Pr.ReviewInfo.Copy()});
        }
    }
};
ParaRun.prototype.private_UpdateTrackRevisions = function()
{
    if (this.Paragraph && this.Paragraph.LogicDocument && this.Paragraph.LogicDocument.Get_TrackRevisionsManager)
    {
        var RevisionsManager = this.Paragraph.LogicDocument.Get_TrackRevisionsManager();
        RevisionsManager.Check_Paragraph(this.Paragraph);
    }
};
ParaRun.prototype.Accept_RevisionChanges = function(Type, bAll)
{
    var Parent = this.Get_Parent();
    var RunPos = this.private_GetPosInParent();

    var ReviewType = this.Get_ReviewType();
    var HavePrChange = this.Have_PrChange();

    // Нет изменений в данном ране
    if (reviewtype_Common === ReviewType && true !== HavePrChange)
        return;

    if (true === this.Selection.Use || true === bAll)
    {
        var StartPos = this.Selection.StartPos;
        var EndPos = this.Selection.EndPos;
        if (StartPos > EndPos)
        {
            StartPos = this.Selection.EndPos;
            EndPos = this.Selection.StartPos;
        }

        if (true === bAll)
        {
            StartPos = 0;
            EndPos   = this.Content.length;
        }

        var CenterRun = null, CenterRunPos = RunPos;
        if (0 === StartPos && this.Content.length === EndPos)
        {
            CenterRun = this;
        }
        else if (StartPos > 0 && this.Content.length === EndPos)
        {
            CenterRun = this.Split2(StartPos, Parent, RunPos);
            CenterRunPos = RunPos + 1;
        }
        else if (0 === StartPos && this.Content.length > EndPos)
        {
            CenterRun = this;
            this.Split2(EndPos, Parent, RunPos);
        }
        else
        {
            this.Split2(EndPos, Parent, RunPos);
            CenterRun = this.Split2(StartPos, Parent, RunPos);
            CenterRunPos = RunPos + 1;
        }

        if (true === HavePrChange && (undefined === Type || c_oAscRevisionsChangeType.TextPr === Type))
        {
            CenterRun.Remove_PrChange();
        }

        if (reviewtype_Add === ReviewType && (undefined === Type || c_oAscRevisionsChangeType.TextAdd === Type))
        {
            CenterRun.Set_ReviewType(reviewtype_Common);
        }
        else if (reviewtype_Remove === ReviewType && (undefined === Type || c_oAscRevisionsChangeType.TextRem === Type))
        {
            Parent.Remove_FromContent(CenterRunPos, 1);

            if (Parent.Get_ContentLength() <= 0)
            {
                Parent.Selection_Remove();
                Parent.Add_ToContent(0, new ParaRun());
                Parent.Cursor_MoveToStartPos();
            }
        }
    }
};
ParaRun.prototype.Reject_RevisionChanges = function(Type, bAll)
{
    var Parent = this.Get_Parent();
    var RunPos = this.private_GetPosInParent();

    var ReviewType = this.Get_ReviewType();
    var HavePrChange = this.Have_PrChange();

    // Нет изменений в данном ране
    if (reviewtype_Common === ReviewType && true !== HavePrChange)
        return;

    if (true === this.Selection.Use || true === bAll)
    {
        var StartPos = this.Selection.StartPos;
        var EndPos = this.Selection.EndPos;
        if (StartPos > EndPos)
        {
            StartPos = this.Selection.EndPos;
            EndPos = this.Selection.StartPos;
        }

        if (true === bAll)
        {
            StartPos = 0;
            EndPos   = this.Content.length;
        }

        var CenterRun = null, CenterRunPos = RunPos;
        if (0 === StartPos && this.Content.length === EndPos)
        {
            CenterRun = this;
        }
        else if (StartPos > 0 && this.Content.length === EndPos)
        {
            CenterRun = this.Split2(StartPos, Parent, RunPos);
            CenterRunPos = RunPos + 1;
        }
        else if (0 === StartPos && this.Content.length > EndPos)
        {
            CenterRun = this;
            this.Split2(EndPos, Parent, RunPos);
        }
        else
        {
            this.Split2(EndPos, Parent, RunPos);
            CenterRun = this.Split2(StartPos, Parent, RunPos);
            CenterRunPos = RunPos + 1;
        }

        if (true === HavePrChange && (undefined === Type || c_oAscRevisionsChangeType.TextPr === Type))
        {
            CenterRun.Set_Pr(CenterRun.Pr.PrChange);
        }

        if (reviewtype_Add === ReviewType && (undefined === Type || c_oAscRevisionsChangeType.TextAdd === Type))
        {
            Parent.Remove_FromContent(CenterRunPos, 1);

            if (Parent.Get_ContentLength() <= 0)
            {
                Parent.Selection_Remove();
                Parent.Add_ToContent(0, new ParaRun());
                Parent.Cursor_MoveToStartPos();
            }
        }
        else if (reviewtype_Remove === ReviewType && (undefined === Type || c_oAscRevisionsChangeType.TextRem === Type))
        {
            CenterRun.Set_ReviewType(reviewtype_Common);
        }
    }
};
ParaRun.prototype.Is_InHyperlink = function()
{
    if (!this.Paragraph)
        return false;

    var ContentPos = this.Paragraph.Get_PosByElement(this);
    var Classes    = this.Paragraph.Get_ClassesByPos(ContentPos);

    var bHyper = false;
    var bRun   = false;

    for (var Index = 0, Count = Classes.length; Index < Count; Index++)
    {
        var Item = Classes[Index];
        if (Item === this)
        {
            bRun = true;
            break;
        }
        else if (Item instanceof ParaHyperlink)
        {
            bHyper = true;
        }
    }

    return (bHyper && bRun);
};
ParaRun.prototype.Get_ClassesByPos = function(Classes, ContentPos, Depth)
{
    Classes.push(this);
};
ParaRun.prototype.Get_DocumentPositionFromObject = function(PosArray)
{
    if (!PosArray)
        PosArray = [];

    if (this.Paragraph)
    {
        var ParaContentPos = this.Paragraph.Get_PosByElement(this);
        if (null !== ParaContentPos)
        {
            var Depth = ParaContentPos.Get_Depth();
            while (Depth > 0)
            {
                var Pos = ParaContentPos.Get(Depth);
                ParaContentPos.Decrease_Depth(1);
                var Class = this.Paragraph.Get_ElementByPos(ParaContentPos);
                Depth--;

                PosArray.splice(0, 0, {Class : Class, Position : Pos});
            }
            PosArray.splice(0, 0, {Class : this.Paragraph, Position : ParaContentPos.Get(0)});
        }

        this.Paragraph.Get_DocumentPositionFromObject(PosArray);
    }

    return PosArray;
};
ParaRun.prototype.Is_UseInParagraph = function()
{
    if (!this.Paragraph)
        return false;

    var ContentPos = this.Paragraph.Get_PosByElement(this);
    if (!ContentPos)
        return false;

    return true;
};
ParaRun.prototype.Displace_BreakOperator = function(_CurLine, _CurRange, isForward, CountOperators)
{
    if(true === this.Is_StartForcedBreakOperator())
    {
        var AlnAt = this.MathPrp.Get_AlnAt();

        var NotIncrease = AlnAt == CountOperators && isForward == true;

        if(NotIncrease == false)
        {
            this.MathPrp.Displace_Break(isForward);

            var NewAlnAt = this.MathPrp.Get_AlnAt();

            if(AlnAt !== NewAlnAt)
            {
                History.Add(this, {Type: historyitem_ParaRun_MathAlnAt, New: NewAlnAt, Old: AlnAt});
            }
        }
    }
};
ParaRun.prototype.Math_UpdateLineMetrics = function(PRS, ParaPr)
{
    var LineRule = ParaPr.Spacing.LineRule;

    // Пересчитаем метрику строки относительно размера данного текста
    if ( PRS.LineTextAscent < this.TextAscent )
        PRS.LineTextAscent = this.TextAscent;

    if ( PRS.LineTextAscent2 < this.TextAscent2 )
        PRS.LineTextAscent2 = this.TextAscent2;

    if ( PRS.LineTextDescent < this.TextDescent )
        PRS.LineTextDescent = this.TextDescent;

    if ( linerule_Exact === LineRule )
    {
        // Смещение не учитывается в метриках строки, когда расстояние между строк точное
        if ( PRS.LineAscent < this.TextAscent )
            PRS.LineAscent = this.TextAscent;

        if ( PRS.LineDescent < this.TextDescent )
            PRS.LineDescent = this.TextDescent;
    }
    else
    {
        if ( PRS.LineAscent < this.TextAscent + this.YOffset  )
            PRS.LineAscent = this.TextAscent + this.YOffset;

        if ( PRS.LineDescent < this.TextDescent - this.YOffset )
            PRS.LineDescent = this.TextDescent - this.YOffset;
    }

};

function CParaRunStartState(Run)
{
    this.Paragraph = Run.Paragraph;
    this.Pr = Run.Pr.Copy();
    this.Content = [];
    for(var i = 0; i < Run.Content.length; ++i)
    {
        this.Content.push(Run.Content[i]);
    }
}

function CReviewInfo()
{
    this.Editor   = editor;
    this.UserId   = "";
    this.UserName = "";
    this.DateTime = "";
}
CReviewInfo.prototype.Update = function()
{
    if (this.Editor && this.Editor.DocInfo)
    {
        this.UserId   = this.Editor.DocInfo.get_UserId();
        this.UserName = this.Editor.DocInfo.get_UserName();
        this.DateTime = (new Date()).getTime();
    }
};
CReviewInfo.prototype.Copy = function()
{
    var Info = new CReviewInfo();
    Info.UserId   = this.UserId;
    Info.UserName = this.UserName;
    Info.DateTime = this.DateTime;
    return Info;
};
CReviewInfo.prototype.Get_UserId = function()
{
    return this.UserId;
};
CReviewInfo.prototype.Get_UserName = function()
{
    return this.UserName;
};
CReviewInfo.prototype.Get_DateTime = function()
{
    return this.DateTime;
};
CReviewInfo.prototype.Write_ToBinary = function(Writer)
{
    Writer.WriteString2(this.UserId);
    Writer.WriteString2(this.UserName);
    Writer.WriteString2(this.DateTime);
};
CReviewInfo.prototype.Read_FromBinary = function(Reader)
{
    this.UserId   = Reader.GetString2();
    this.UserName = Reader.GetString2();
    this.DateTime = parseInt(Reader.GetString2());
};
CReviewInfo.prototype.Get_Color = function()
{
    if (!this.UserId && !this.UserName)
        return REVIEW_COLOR;

    return getUserColorById(this.UserId, this.UserName, true, false);
};
CReviewInfo.prototype.Is_CurrentUser = function()
{
    if (this.Editor)
    {
        var UserId = this.Editor.DocInfo.get_UserId();
        return (UserId === this.UserId);
    }

    return true;
};
CReviewInfo.prototype.Get_UserId = function()
{
    return this.UserId;
};