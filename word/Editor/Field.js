/*
 * (c) Copyright Ascensio System SIA 2010-2018
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation. In accordance with
 * Section 7(a) of the GNU AGPL its Section 15 shall be amended to the effect
 * that Ascensio System SIA expressly excludes the warranty of non-infringement
 * of any third-party rights.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For
 * details, see the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia,
 * EU, LV-1021.
 *
 * The  interactive user interfaces in modified source and object code versions
 * of the Program must display Appropriate Legal Notices, as required under
 * Section 5 of the GNU AGPL version 3.
 *
 * Pursuant to Section 7(b) of the License you must retain the original Product
 * logo when distributing the program. Pursuant to Section 7(e) we decline to
 * grant you any rights under trademark law for use of our trademarks.
 *
 * All the Product's GUI elements, including illustrations and icon sets, as
 * well as technical writing content are licensed under the terms of the
 * Creative Commons Attribution-ShareAlike 4.0 International. See the License
 * terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 */

"use strict";

// Import
var History = AscCommon.History;

/**
 *
 * @param FieldType
 * @param Arguments
 * @param Switches
 * @constructor
 * @extends {CParagraphContentWithParagraphLikeContent}
 */
function ParaField(FieldType, Arguments, Switches)
{
	CParagraphContentWithParagraphLikeContent.call(this);

    this.Id = AscCommon.g_oIdCounter.Get_NewId();

    this.Type    = para_Field;

    this.FieldType = (undefined === FieldType ? fieldtype_UNKNOWN : FieldType);
    this.Arguments = (undefined === Arguments ? []                : Arguments);
    this.Switches  = (undefined === Switches  ? []                : Switches);

    this.TemplateContent = this.Content;

    this.Bounds = {};

	this.FormFieldName        = "";
	this.FormFieldDefaultText = "";

    // Добавляем данный класс в таблицу Id (обязательно в конце конструктора)
    AscCommon.g_oTableId.Add( this, this.Id );
}

ParaField.prototype = Object.create(CParagraphContentWithParagraphLikeContent.prototype);
ParaField.prototype.constructor = ParaField;

ParaField.prototype.Get_Id = function()
{
    return this.Id;
};
ParaField.prototype.Copy = function(Selected, oPr)
{
    var NewField = CParagraphContentWithParagraphLikeContent.prototype.Copy.apply(this, arguments);

    // TODO: Сделать функциями с иторией
    NewField.FieldType = this.FieldType;
    NewField.Arguments = this.Arguments;
    NewField.Switches  = this.Switches;

    if (editor)
        editor.WordControl.m_oLogicDocument.Register_Field(NewField);

    return NewField;
};
ParaField.prototype.GetSelectedElementsInfo = function(Info, ContentPos, Depth)
{
	Info.Set_Field(this);
	CParagraphContentWithParagraphLikeContent.prototype.GetSelectedElementsInfo.apply(this, arguments);
};
ParaField.prototype.Get_Bounds = function()
{
    var aBounds = [];
    for (var Place in this.Bounds)
    {
        aBounds.push(this.Bounds[Place]);
    }

    return aBounds;
};
ParaField.prototype.Add_ToContent = function(Pos, Item, UpdatePosition)
{
	History.Add(new CChangesParaFieldAddItem(this, Pos, [Item]));
	CParagraphContentWithParagraphLikeContent.prototype.Add_ToContent.apply(this, arguments);
};
ParaField.prototype.Remove_FromContent = function(Pos, Count, UpdatePosition)
{
	// Получим массив удаляемых элементов
	var DeletedItems = this.Content.slice(Pos, Pos + Count);
	History.Add(new CChangesParaFieldRemoveItem(this, Pos, DeletedItems));

	CParagraphContentWithParagraphLikeContent.prototype.Remove_FromContent.apply(this, arguments);
};
ParaField.prototype.Add = function(Item)
{
	if (para_Field === Item.Type)
	{
		// Вместо добавления самого элемента добавляем его содержимое
		var Count = Item.Content.length;

		if (Count > 0)
		{
			var CurPos  = this.State.ContentPos;
			var CurItem = this.Content[CurPos];

			var CurContentPos = new CParagraphContentPos();
			CurItem.Get_ParaContentPos(false, false, CurContentPos);

			var NewItem = CurItem.Split(CurContentPos, 0);
			for (var Index = 0; Index < Count; Index++)
			{
				this.Add_ToContent(CurPos + Index + 1, Item.Content[Index], false);
			}
			this.Add_ToContent(CurPos + Count + 1, NewItem, false);
			this.State.ContentPos = CurPos + Count;
			this.Content[this.State.ContentPos].MoveCursorToEndPos();
		}
	}
	else
	{
		CParagraphContentWithParagraphLikeContent.prototype.Add.apply(this, arguments);
	}
};
ParaField.prototype.Split = function (ContentPos, Depth)
{
    // Не даем разделять поле
    return null;
};
ParaField.prototype.CanSplit = function()
{
	return false;
};
ParaField.prototype.Recalculate_Range_Spaces = function(PRSA, _CurLine, _CurRange, _CurPage)
{
    var CurLine  = _CurLine - this.StartLine;
    var CurRange = (0 === _CurLine ? _CurRange - this.StartRange : _CurRange);

    if (0 === CurLine && 0 === CurRange && true !== PRSA.RecalcFast)
        this.Bounds = {};

    var X0 = PRSA.X;
    var Y0 = PRSA.Y0;
    var Y1 = PRSA.Y1;

    CParagraphContentWithParagraphLikeContent.prototype.Recalculate_Range_Spaces.apply(this, arguments);

	var X1 = PRSA.X;

	this.Bounds[((CurLine << 16) & 0xFFFF0000) | (CurRange & 0x0000FFFF)] = {
		X0        : X0,
		X1        : X1,
		Y0        : Y0,
		Y1        : Y1,
		PageIndex : PRSA.Paragraph.Get_AbsolutePage(_CurPage)
	};
};
ParaField.prototype.Draw_HighLights = function(PDSH)
{
    var X0 = PDSH.X;
    var Y0 = PDSH.Y0;
    var Y1 = PDSH.Y1;

    CParagraphContentWithParagraphLikeContent.prototype.Draw_HighLights.apply(this, arguments);

    var X1 = PDSH.X;

    if (Math.abs(X0 - X1) > 0.001 && (true === PDSH.DrawMMFields || fieldtype_FORMTEXT === this.Get_FieldType()))
    {
        PDSH.MMFields.Add(Y0, Y1, X0, X1, 0, 0, 0, 0  );
    }
};
ParaField.prototype.Is_UseInDocument = function()
{
	return (this.Paragraph && true === this.Paragraph.Is_UseInDocument() && true === this.Is_UseInParagraph() ? true : false);
};
ParaField.prototype.Is_UseInParagraph = function()
{
	if (!this.Paragraph)
		return false;

	var ContentPos = this.Paragraph.Get_PosByElement(this);
	if (!ContentPos)
		return false;

	return true;
};
ParaField.prototype.Get_LeftPos = function(SearchPos, ContentPos, Depth, UseContentPos)
{
	if (false === UseContentPos && this.Content.length > 0)
	{
		// При переходе в новый контент встаем в его конец
		var CurPos = this.Content.length - 1;
		this.Content[CurPos].Get_EndPos(false, SearchPos.Pos, Depth + 1);
		SearchPos.Pos.Update(CurPos, Depth);
		SearchPos.Found = true;
		return true;
	}

	CParagraphContentWithParagraphLikeContent.prototype.Get_LeftPos.call(this, SearchPos, ContentPos, Depth, UseContentPos);
};
ParaField.prototype.Get_RightPos = function(SearchPos, ContentPos, Depth, UseContentPos, StepEnd)
{
	if (false === UseContentPos && this.Content.length > 0)
	{
		// При переходе в новый контент встаем в его начало
		this.Content[0].Get_StartPos(SearchPos.Pos, Depth + 1);
		SearchPos.Pos.Update(0, Depth);
		SearchPos.Found = true;
		return true;
	}

	CParagraphContentWithParagraphLikeContent.prototype.Get_RightPos.call(this, SearchPos, ContentPos, Depth, UseContentPos, StepEnd);
};
ParaField.prototype.Remove = function(nDirection, bOnAddText)
{
	CParagraphContentWithParagraphLikeContent.prototype.Remove.call(this, nDirection, bOnAddText);

	if (this.Is_Empty() && !bOnAddText && fieldtype_FORMTEXT === this.Get_FieldType() && this.Paragraph && this.Paragraph.LogicDocument && true === this.Paragraph.LogicDocument.IsFillingFormMode())
	{
		var sDefaultText = this.FormFieldDefaultText == "" ? "     " : this.FormFieldDefaultText;
		this.SetValue(sDefaultText);
	}
};
ParaField.prototype.Shift_Range = function(Dx, Dy, _CurLine, _CurRange)
{
	CParagraphContentWithParagraphLikeContent.prototype.Shift_Range.call(this, Dx, Dy, _CurLine, _CurRange);

	var CurLine = _CurLine - this.StartLine;
	var CurRange = ( 0 === CurLine ? _CurRange - this.StartRange : _CurRange );

	var oRangeBounds = this.Bounds[((CurLine << 16) & 0xFFFF0000) | (CurRange & 0x0000FFFF)];
	if (oRangeBounds)
	{
		oRangeBounds.X0 += Dx;
		oRangeBounds.X1 += Dx;
		oRangeBounds.Y0 += Dy;
		oRangeBounds.Y1 += Dy;
	}
};
ParaField.prototype.Get_LeftPos = function(SearchPos, ContentPos, Depth, UseContentPos)
{
	var bResult = CParagraphContentWithParagraphLikeContent.prototype.Get_LeftPos.call(this, SearchPos, ContentPos, Depth, UseContentPos);

	if (true !== bResult && this.Paragraph && this.Paragraph.LogicDocument && true === this.Paragraph.LogicDocument.IsFillingFormMode())
	{
		this.Get_StartPos(SearchPos.Pos, Depth);
		SearchPos.Found = true;
		return true;
	}

	return bResult;
};
ParaField.prototype.Get_RightPos = function(SearchPos, ContentPos, Depth, UseContentPos, StepEnd)
{
	var bResult = CParagraphContentWithParagraphLikeContent.prototype.Get_RightPos.call(this, SearchPos, ContentPos, Depth, UseContentPos, StepEnd);

	if (true !== bResult && this.Paragraph && this.Paragraph.LogicDocument && true === this.Paragraph.LogicDocument.IsFillingFormMode())
	{
		this.Get_EndPos(false, SearchPos.Pos, Depth);
		SearchPos.Found = true;
		return true;
	}

	return bResult;
};
ParaField.prototype.Get_WordStartPos = function(SearchPos, ContentPos, Depth, UseContentPos)
{
	CParagraphContentWithParagraphLikeContent.prototype.Get_WordStartPos.call(this, SearchPos, ContentPos, Depth, UseContentPos);

	if (true !== SearchPos.Found && this.Paragraph && this.Paragraph.LogicDocument && true === this.Paragraph.LogicDocument.IsFillingFormMode())
	{
		this.Get_StartPos(SearchPos.Pos, Depth);
		SearchPos.UpdatePos = true;
		SearchPos.Found     = true;
	}
};
ParaField.prototype.Get_WordEndPos = function(SearchPos, ContentPos, Depth, UseContentPos, StepEnd)
{
	CParagraphContentWithParagraphLikeContent.prototype.Get_WordEndPos.call(this, SearchPos, ContentPos, Depth, UseContentPos, StepEnd);

	if (true !== SearchPos.Found && this.Paragraph && this.Paragraph.LogicDocument && true === this.Paragraph.LogicDocument.IsFillingFormMode())
	{
		this.Get_EndPos(false, SearchPos.Pos, Depth);
		SearchPos.UpdatePos = true;
		SearchPos.Found     = true;
	}
};
//----------------------------------------------------------------------------------------------------------------------
// Работа с данными поля
//----------------------------------------------------------------------------------------------------------------------
ParaField.prototype.Get_Argument = function(Index)
{
    return this.Arguments[Index];
};
ParaField.prototype.Get_FieldType = function()
{
    return this.FieldType;
};
ParaField.prototype.Map_MailMerge = function(_Value)
{
    // Пока у нас в Value может быть только текст, в будущем планируется, чтобы могли быть картинки.
    var Value = _Value;
    if (undefined === Value || null === Value)
        Value = "";

    History.TurnOff();

    var oRun = this.private_GetMappedRun(Value);

    // Подменяем содержимое поля
    this.Content = [];
    this.Content[0] = oRun;

    this.MoveCursorToStartPos();

    History.TurnOn();
};
ParaField.prototype.Restore_StandardTemplate = function()
{
    // В любом случае сначала восстанавливаем исходное содержимое.
    this.Restore_Template();

    if (fieldtype_MERGEFIELD === this.FieldType && true === AscCommon.CollaborativeEditing.Is_SingleUser() && 1 === this.Arguments.length)
    {
        var oRun = this.private_GetMappedRun("«" + this.Arguments[0] + "»");
        this.Remove_FromContent(0, this.Content.length);
        this.Add_ToContent(0, oRun);
        this.MoveCursorToStartPos();

        this.TemplateContent = this.Content;
    }
};
ParaField.prototype.Restore_Template = function()
{
    // Восстанавливаем содержимое поля.
    this.Content = this.TemplateContent;
    this.MoveCursorToStartPos();
};
ParaField.prototype.Is_NeedRestoreTemplate = function()
{
    if (1 !== this.TemplateContent.length)
        return true;

    var oRun = this.TemplateContent[0];
    if (fieldtype_MERGEFIELD === this.FieldType)
    {
        var sStandardText = "«" + this.Arguments[0] + "»";

        var oRunText = new CParagraphGetText();
        oRun.Get_Text(oRunText);

        if (sStandardText === oRunText.Text)
            return false;

        return true;
    }

    return false;
};
ParaField.prototype.Replace_MailMerge = function(_Value)
{
    // Пока у нас в Value может быть только текст, в будущем планируется, чтобы могли быть картинки.
    var Value = _Value;
    if (undefined === Value || null === Value)
        Value = "";

    var Paragraph = this.Paragraph;

    if (!Paragraph)
        return false;

    // Получим ран, на который мы подменяем поле
    var oRun = this.private_GetMappedRun(Value);

    // Ищем расположение данного поля в параграфе
    var ParaContentPos = Paragraph.Get_PosByElement(this);

    if (null === ParaContentPos)
        return false;

    var Depth    = ParaContentPos.Get_Depth();
    var FieldPos = ParaContentPos.Get(Depth);

    if (Depth < 0)
        return false;

    ParaContentPos.Decrease_Depth(1);
    var FieldContainer = Paragraph.Get_ElementByPos(ParaContentPos);
    if (!FieldContainer || !FieldContainer.Content || FieldContainer.Content[FieldPos] !== this)
        return false;

    FieldContainer.Remove_FromContent(FieldPos, 1);
    FieldContainer.Add_ToContent(FieldPos, oRun);

    return true;
};
ParaField.prototype.private_GetMappedRun = function(sValue)
{
	return this.CreateRunWithText(sValue);
};
ParaField.prototype.SetFormFieldName = function(sName)
{
	History.Add(new CChangesParaFieldFormFieldName(this, this.FormFieldName, sName));
	this.FormFieldName = sName;
};
ParaField.prototype.GetFormFieldName = function()
{
	return this.FormFieldName;
};
ParaField.prototype.SetFormFieldDefaultText = function(sText)
{
	History.Add(new CChangesParaFieldFormFieldDefaultText(this, this.FormFieldDefaultText, sText));
	this.FormFieldDefaultText = sText;
};
ParaField.prototype.GetValue = function()
{
	var oText = new CParagraphGetText();
	oText.SetBreakOnNonText(false);
	oText.SetParaEndToSpace(true);

	this.Get_Text(oText);

	return oText.Text;
};
ParaField.prototype.SetValue = function(sValue)
{
	this.ReplaceAllWithText(sValue);
};
ParaField.prototype.IsFillingForm = function()
{
	if (fieldtype_FORMTEXT === this.Get_FieldType())
		return true;

	return false;
};
ParaField.prototype.FindNextFillingForm = function(isNext, isCurrent, isStart)
{
	if (!this.IsFillingForm())
		return CParagraphContentWithParagraphLikeContent.prototype.FindNextFillingForm.apply(this, arguments);

	if (isCurrent && true === this.IsSelectedAll())
	{
		if (isNext)
			return CParagraphContentWithParagraphLikeContent.prototype.FindNextFillingForm.apply(this, arguments);

		return null;
	}

	if (!isCurrent && isNext)
		return this;

	var oRes = CParagraphContentWithParagraphLikeContent.prototype.FindNextFillingForm.apply(this, arguments);
	if (!oRes && !isNext)
		return this;

	return null;
};
//----------------------------------------------------------------------------------------------------------------------
// Функции совместного редактирования
//----------------------------------------------------------------------------------------------------------------------
ParaField.prototype.Write_ToBinary2 = function(Writer)
{
    Writer.WriteLong(AscDFH.historyitem_type_Field);

    // String : Id
    // Long   : FieldType
    // Long   : Количество аргументов
    // Array of Strings : массив аргументов
    // Long   : Количество переключателей
    // Array of Strings : массив переключателей
    // Long   : Количество элементов
    // Array of Strings : массив с Id элементов

    Writer.WriteString2(this.Id);
    Writer.WriteLong(this.FieldType);

    var ArgsCount = this.Arguments.length;
    Writer.WriteLong(ArgsCount);
    for (var Index = 0; Index < ArgsCount; Index++)
        Writer.WriteString2(this.Arguments[Index]);

    var SwitchesCount = this.Switches.length;
    Writer.WriteLong(SwitchesCount);
    for (var Index = 0; Index < SwitchesCount; Index++)
        Writer.WriteString2(this.Switches[Index]);

    var Count = this.Content.length;
    Writer.WriteLong(Count);
    for (var Index = 0; Index < Count; Index++)
        Writer.WriteString2(this.Content[Index].Get_Id());
};
ParaField.prototype.Read_FromBinary2 = function(Reader)
{
    // String : Id
    // Long   : FieldType
    // Long   : Количество аргументов
    // Array of Strings : массив аргументов
    // Long   : Количество переключателей
    // Array of Strings : массив переключателей
    // Long   : Количество элементов
    // Array of Strings : массив с Id элементов

    this.Id = Reader.GetString2();
    this.FieldType = Reader.GetLong();

    var Count = Reader.GetLong();
    this.Arguments = [];
    for (var Index = 0; Index < Count; Index++)
        this.Arguments.push(Reader.GetString2());

    Count = Reader.GetLong();
    this.Switches = [];
    for (var Index = 0; Index < Count; Index++)
        this.Switches.push(Reader.GetString2());

    Count = Reader.GetLong();
    this.Content = [];
    for (var Index = 0; Index < Count; Index++)
    {
        var Element = AscCommon.g_oTableId.Get_ById(Reader.GetString2());
        if (null !== Element)
            this.Content.push(Element);
    }

    this.TemplateContent = this.Content;

    if (editor)
        editor.WordControl.m_oLogicDocument.Register_Field(this);
};
//----------------------------------------------------------------------------------------------------------------------
ParaField.prototype.IsStopCursorOnEntryExit = function()
{
	return true;
};
//--------------------------------------------------------export----------------------------------------------------
window['AscCommonWord'] = window['AscCommonWord'] || {};
window['AscCommonWord'].ParaField = ParaField;
