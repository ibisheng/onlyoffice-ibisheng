/*
 * (c) Copyright Ascensio System SIA 2010-2017
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

//----------------------------------------------------------------------------------------------------------------------
//  asc_docs_api (Обращение из апи)
//----------------------------------------------------------------------------------------------------------------------
Asc['asc_docs_api'].prototype.asc_GetStyleFromFormatting = function()
{
    return this.WordControl.m_oLogicDocument.GetStyleFromFormatting();
};
Asc['asc_docs_api'].prototype.asc_AddNewStyle = function(oStyle)
{
    this.WordControl.m_oLogicDocument.Add_NewStyle(oStyle);
};
Asc['asc_docs_api'].prototype.asc_RemoveStyle = function(sName)
{
    this.WordControl.m_oLogicDocument.Remove_Style(sName);
};
Asc['asc_docs_api'].prototype.asc_RemoveAllCustomStyles = function()
{
    this.WordControl.m_oLogicDocument.Remove_AllCustomStyles();
};
Asc['asc_docs_api'].prototype.asc_IsStyleDefault = function(sName)
{
    return this.WordControl.m_oLogicDocument.Is_StyleDefault(sName);
};
Asc['asc_docs_api'].prototype.asc_IsDefaultStyleChanged = function(sName)
{
    return this.WordControl.m_oLogicDocument.Is_DefaultStyleChanged(sName);
};

Asc['asc_docs_api'].prototype['asc_GetStyleFromFormatting'] = Asc['asc_docs_api'].prototype.asc_GetStyleFromFormatting;
Asc['asc_docs_api'].prototype['asc_AddNewStyle']            = Asc['asc_docs_api'].prototype.asc_AddNewStyle;
Asc['asc_docs_api'].prototype['asc_RemoveStyle']            = Asc['asc_docs_api'].prototype.asc_RemoveStyle;
Asc['asc_docs_api'].prototype['asc_RemoveAllCustomStyles']  = Asc['asc_docs_api'].prototype.asc_RemoveAllCustomStyles;
Asc['asc_docs_api'].prototype['asc_IsStyleDefault']         = Asc['asc_docs_api'].prototype.asc_IsStyleDefault;
Asc['asc_docs_api'].prototype['asc_IsDefaultStyleChanged']  = Asc['asc_docs_api'].prototype.asc_IsDefaultStyleChanged;
//----------------------------------------------------------------------------------------------------------------------
//  CDocument
//----------------------------------------------------------------------------------------------------------------------
/**
 * Получаем стиль по выделенному фрагменту.
 */
CDocument.prototype.GetStyleFromFormatting = function()
{
    if (docpostype_HdrFtr === this.CurPos.Type)
    {
        return this.HdrFtr.GetStyleFromFormatting();
    }
    else if (docpostype_DrawingObjects === this.CurPos.Type)
    {
        return this.DrawingObjects.GetStyleFromFormatting();
    }
    else //if (docpostype_Content === this.CurPos.Type)
    {
        if (true == this.Selection.Use)
        {
            if (this.Selection.StartPos > this.Selection.EndPos)
                return this.Content[this.Selection.EndPos].GetStyleFromFormatting();
            else
                return this.Content[this.Selection.StartPos].GetStyleFromFormatting();
        }
        else
        {
            return this.Content[this.CurPos.ContentPos].GetStyleFromFormatting();
        }
    }
};
/**
 * Добавляем новый стиль (или заменяем старый с таким же названием).
 * И сразу применяем его к выделенному фрагменту.
 */
CDocument.prototype.Add_NewStyle = function(oStyle)
{
    if (false === this.Document_Is_SelectionLocked(AscCommon.changestype_Document_Styles, {Type : AscCommon.changestype_2_AdditionalTypes, Types : [AscCommon.changestype_Paragraph_Properties]}))
    {
        AscCommon.History.Create_NewPoint(AscDFH.historydescription_Document_AddNewStyle);
        var NewStyle = this.Styles.Create_StyleFromInterface(oStyle);
        this.SetParagraphStyle(NewStyle.Get_Name());
        this.Recalculate();
        this.Document_UpdateInterfaceState();
    }
};
/**
 * Удалем заданный стиль по имени.
 */
CDocument.prototype.Remove_Style = function(sStyleName)
{
    var StyleId = this.Styles.Get_StyleIdByName(sStyleName, false);
    // Сначала проверим есть ли стиль с таким именем
    if (null == StyleId)
        return;

    if (false === this.Document_Is_SelectionLocked(AscCommon.changestype_Document_Styles))
    {
        AscCommon.History.Create_NewPoint(AscDFH.historydescription_Document_RemoveStyle);
        this.Styles.Remove_StyleFromInterface(StyleId);
        this.Recalculate();
        this.Document_UpdateInterfaceState();
    }
};
/**
 * Удалем все недефолтовые стили в документе.
 */
CDocument.prototype.Remove_AllCustomStyles = function()
{
    if (false === this.Document_Is_SelectionLocked(AscCommon.changestype_Document_Styles))
    {
        AscCommon.History.Create_NewPoint(AscDFH.historydescription_Document_RemoveAllCustomStyles);
        this.Styles.Remove_AllCustomStylesFromInterface();
        this.Recalculate();
        this.Document_UpdateInterfaceState();
    }
};
/**
 * Проверяем является ли заданный стиль дефолтовым.
 */
CDocument.prototype.Is_StyleDefault = function(sName)
{
    return this.Styles.Is_StyleDefault(sName);
};
/**
 * Проверяем изменен ли дефолтовый стиль.
 */
CDocument.prototype.Is_DefaultStyleChanged = function(sName)
{
    return this.Styles.Is_DefaultStyleChanged(sName);
};
//----------------------------------------------------------------------------------------------------------------------
//  CStyles
//----------------------------------------------------------------------------------------------------------------------
CStyles.prototype.Create_StyleFromInterface = function(oAscStyle, bCheckLink)
{
	var sStyleName = oAscStyle.get_Name();
	var sStyleId   = this.Get_StyleIdByName(sStyleName, false);
	if (null !== sStyleId)
	{
		var oStyle = this.Style[sStyleId];

		var NewStyleParaPr = oAscStyle.get_ParaPr();
		var NewStyleTextPr = oAscStyle.get_TextPr();

		var BasedOnId = this.Get_StyleIdByName(oAscStyle.get_BasedOn(), false);
		var NextId    = this.Get_StyleIdByName(oAscStyle.get_Next(), false);

		oStyle.Set_Type(oAscStyle.get_Type());

		if (BasedOnId === sStyleId || sStyleId === this.Default.Paragraph)
		{
			oStyle.Set_BasedOn(null);
			var OldStyleParaPr = oStyle.ParaPr.Copy();
			var OldStyleTextPr = oStyle.TextPr.Copy();
			OldStyleParaPr.Merge(NewStyleParaPr);
			OldStyleTextPr.Merge(NewStyleTextPr);
			NewStyleParaPr = OldStyleParaPr;
			NewStyleTextPr = OldStyleTextPr;
		}
		else
		{
			oStyle.Set_BasedOn(BasedOnId);
		}

		if (null === oStyle.Get_Next() || (null !== NextId && NextId !== sStyleId))
		{
			if (NextId === sStyleId)
				oStyle.Set_Next(null);
			else
				oStyle.Set_Next(NextId);
		}

		var oAscLink = oAscStyle.get_Link();
		if (false != bCheckLink && null != oAscLink && undefined !== oAscLink)
		{
			var oLinkedStyle = this.Create_StyleFromInterface(oAscLink, false);
			oStyle.Set_Link(oLinkedStyle.Get_Id());
			oLinkedStyle.Set_Link(oStyle.Get_Id());
		}

		oStyle.Set_TextPr(NewStyleTextPr);
		oStyle.Set_ParaPr(NewStyleParaPr);

		return oStyle;
	}
	else
	{
		var oStyle = new CStyle();

		var BasedOnId = this.Get_StyleIdByName(oAscStyle.get_BasedOn(), false);
		oStyle.Set_BasedOn(BasedOnId);
		oStyle.Set_Next(this.Get_StyleIdByName(oAscStyle.get_Next(), false));
		oStyle.Set_Type(oAscStyle.get_Type());
		oStyle.Set_TextPr(oAscStyle.get_TextPr());
		oStyle.Set_ParaPr(oAscStyle.get_ParaPr());
		oStyle.Set_Name(sStyleName);

		if (styletype_Paragraph === oStyle.Get_Type())
			oStyle.Set_QFormat(true);

		var oAscLink = oAscStyle.get_Link();
		if (false != bCheckLink && null != oAscLink && undefined !== oAscLink)
		{
			var oLinkedStyle = this.Create_StyleFromInterface(oAscLink, false);
			oStyle.Set_Link(oLinkedStyle.Get_Id());
			oLinkedStyle.Set_Link(oStyle.Get_Id());
		}

		this.Add(oStyle);
		return oStyle;
	}
};
CStyles.prototype.Remove_StyleFromInterface = function(StyleId)
{
    // Если этот стиль не один из стилей по умолчанию, тогда мы просто удаляем этот стиль
    // и очищаем все параграфы с сылкой на этот стиль.

    var Style = this.Style[StyleId];
    if (StyleId == this.Default.Paragraph)
    {
        Style.Clear("Normal", null, null, styletype_Paragraph);
        Style.Create_Default_Paragraph();
    }
    else if (StyleId == this.Default.Character)
    {
        Style.Clear("Default Paragraph Font", null, null, styletype_Character);
        Style.Create_Default_Character();
    }
    else if (StyleId == this.Default.Numbering)
    {
        Style.Clear("No List", null, null, styletype_Numbering);
        Style.Create_Default_Numbering();
    }
    else if (StyleId == this.Default.Table)
    {
        Style.Clear("Normal Table", null, null, styletype_Table);
        Style.Create_NormalTable();
    }
    else if (StyleId == this.Default.TableGrid)
    {
        Style.Clear("Table Grid", this.Default.Table, null, styletype_Table);
        Style.Create_TableGrid();
    }
    else if (StyleId == this.Default.Headings[0])
    {
        Style.Clear("Heading 1", this.Default.Paragraph, this.Default.Paragraph, styletype_Paragraph);
        Style.Create_Heading1();
    }
    else if (StyleId == this.Default.Headings[1])
    {
        Style.Clear("Heading 2", this.Default.Paragraph, this.Default.Paragraph, styletype_Paragraph);
        Style.Create_Heading2();
    }
    else if (StyleId == this.Default.Headings[2])
    {
        Style.Clear("Heading 3", this.Default.Paragraph, this.Default.Paragraph, styletype_Paragraph);
        Style.Create_Heading3();
    }
    else if (StyleId == this.Default.Headings[3])
    {
        Style.Clear("Heading 4", this.Default.Paragraph, this.Default.Paragraph, styletype_Paragraph);
        Style.Create_Heading4();
    }
    else if (StyleId == this.Default.Headings[4])
    {
        Style.Clear("Heading 5", this.Default.Paragraph, this.Default.Paragraph, styletype_Paragraph);
        Style.Create_Heading5();
    }
    else if (StyleId == this.Default.Headings[5])
    {
        Style.Clear("Heading 6", this.Default.Paragraph, this.Default.Paragraph, styletype_Paragraph);
        Style.Create_Heading6();
    }
    else if (StyleId == this.Default.Headings[6])
    {
        Style.Clear("Heading 7", this.Default.Paragraph, this.Default.Paragraph, styletype_Paragraph);
        Style.Create_Heading7();
    }
    else if (StyleId == this.Default.Headings[7])
    {
        Style.Clear("Heading 8", this.Default.Paragraph, this.Default.Paragraph, styletype_Paragraph);
        Style.Create_Heading8();
    }
    else if (StyleId == this.Default.Headings[8])
    {
        Style.Clear("Heading 9", this.Default.Paragraph, this.Default.Paragraph, styletype_Paragraph);
        Style.Create_Heading9();
    }
    else if (StyleId == this.Default.ParaList)
    {
        Style.Clear("List Paragraph", this.Default.Paragraph, null, styletype_Paragraph);
        Style.Create_ListParagraph();
    }
    else if (StyleId == this.Default.Header)
    {
        Style.Clear("Header", this.Default.Paragraph, null, styletype_Paragraph);
        Style.Create_Header();
    }
    else if (StyleId == this.Default.Footer)
    {
        Style.Clear("Footer", this.Default.Paragraph, null, styletype_Paragraph);
        Style.Create_Footer();
    }
    else if (StyleId == this.Default.Hyperlink)
    {
        Style.Clear("Hyperlink", null, null, styletype_Character);
        Style.Create_Character_Hyperlink();
    }
    else
    {
        this.Remove(StyleId);

        if (this.LogicDocument)
        {
            var AllParagraphs = this.LogicDocument.GetAllParagraphsByStyle([StyleId]);
            var Count = AllParagraphs.length;
            for (var Index = 0; Index < Count; Index++)
            {
                var Para = AllParagraphs[Index];
                Para.Style_Remove();
            }
        }
    }
    this.Update_Interface(StyleId);
};
CStyles.prototype.Remove_AllCustomStylesFromInterface = function()
{
    for (var StyleId in this.Style)
    {
        var Style = this.Style[StyleId];
        if ((styletype_Paragraph === Style.Get_Type() || styletype_Character === Style.Get_Type()) && true === Style.Get_QFormat())
        {
            this.Remove_StyleFromInterface(StyleId);
        }
    }
};
CStyles.prototype.Is_StyleDefault = function(sStyleName)
{
    var StyleId = this.Get_StyleIdByName(sStyleName, false);
    if (null === StyleId)
        return false;

    if (StyleId == this.Default.Paragraph
        || StyleId == this.Default.Character
        || StyleId == this.Default.Numbering
        || StyleId == this.Default.Table
        || StyleId == this.Default.TableGrid
        || StyleId == this.Default.Headings[0]
        || StyleId == this.Default.Headings[1]
        || StyleId == this.Default.Headings[2]
        || StyleId == this.Default.Headings[3]
        || StyleId == this.Default.Headings[4]
        || StyleId == this.Default.Headings[5]
        || StyleId == this.Default.Headings[6]
        || StyleId == this.Default.Headings[7]
        || StyleId == this.Default.Headings[8]
        || StyleId == this.Default.ParaList
        || StyleId == this.Default.Header
        || StyleId == this.Default.Footer
        || StyleId == this.Default.Hyperlink)
    {
        return true;
    }

    return false;
};
CStyles.prototype.Is_DefaultStyleChanged = function(sStyleName)
{
    if (true != this.Is_StyleDefault(sStyleName))
        return false;

    var StyleId = this.Get_StyleIdByName(sStyleName, false);
    if (null === StyleId)
        return false;

    var CurrentStyle = this.Style[StyleId];
    this.LogicDocument.TurnOffHistory();

    var Style = new CStyle();
    if (StyleId == this.Default.Paragraph)
    {
        Style.Clear("Normal", null, null, styletype_Paragraph);
        Style.Create_Default_Paragraph();
    }
    else if (StyleId == this.Default.Character)
    {
        Style.Clear("Default Paragraph Font", null, null, styletype_Character);
        Style.Create_Default_Character();
    }
    else if (StyleId == this.Default.Numbering)
    {
        Style.Clear("No List", null, null, styletype_Numbering);
        Style.Create_Default_Numbering();
    }
    else if (StyleId == this.Default.Table)
    {
        Style.Clear("Normal Table", null, null, styletype_Table);
        Style.Create_NormalTable();
    }
    else if (StyleId == this.Default.TableGrid)
    {
        Style.Clear("Table Grid", this.Default.Table, null, styletype_Table);
        Style.Create_TableGrid();
    }
    else if (StyleId == this.Default.Headings[0])
    {
        Style.Clear("Heading 1", this.Default.Paragraph, this.Default.Paragraph, styletype_Paragraph);
        Style.Create_Heading1();
    }
    else if (StyleId == this.Default.Headings[1])
    {
        Style.Clear("Heading 2", this.Default.Paragraph, this.Default.Paragraph, styletype_Paragraph);
        Style.Create_Heading2();
    }
    else if (StyleId == this.Default.Headings[2])
    {
        Style.Clear("Heading 3", this.Default.Paragraph, this.Default.Paragraph, styletype_Paragraph);
        Style.Create_Heading3();
    }
    else if (StyleId == this.Default.Headings[3])
    {
        Style.Clear("Heading 4", this.Default.Paragraph, this.Default.Paragraph, styletype_Paragraph);
        Style.Create_Heading4();
    }
    else if (StyleId == this.Default.Headings[4])
    {
        Style.Clear("Heading 5", this.Default.Paragraph, this.Default.Paragraph, styletype_Paragraph);
        Style.Create_Heading5();
    }
    else if (StyleId == this.Default.Headings[5])
    {
        Style.Clear("Heading 6", this.Default.Paragraph, this.Default.Paragraph, styletype_Paragraph);
        Style.Create_Heading6();
    }
    else if (StyleId == this.Default.Headings[6])
    {
        Style.Clear("Heading 7", this.Default.Paragraph, this.Default.Paragraph, styletype_Paragraph);
        Style.Create_Heading7();
    }
    else if (StyleId == this.Default.Headings[7])
    {
        Style.Clear("Heading 8", this.Default.Paragraph, this.Default.Paragraph, styletype_Paragraph);
        Style.Create_Heading8();
    }
    else if (StyleId == this.Default.Headings[8])
    {
        Style.Clear("Heading 9", this.Default.Paragraph, this.Default.Paragraph, styletype_Paragraph);
        Style.Create_Heading9();
    }
    else if (StyleId == this.Default.ParaList)
    {
        Style.Clear("List Paragraph", this.Default.Paragraph, null, styletype_Paragraph);
        Style.Create_ListParagraph();
    }
    else if (StyleId == this.Default.Header)
    {
        Style.Clear("Header", this.Default.Paragraph, null, styletype_Paragraph);
        Style.Create_Header();
    }
    else if (StyleId == this.Default.Footer)
    {
        Style.Clear("Footer", this.Default.Paragraph, null, styletype_Paragraph);
        Style.Create_Footer();
    }
    else if (StyleId == this.Default.Hyperlink)
    {
        Style.Clear("Hyperlink", null, null, styletype_Character);
        Style.Create_Character_Hyperlink();
    }

    this.LogicDocument.TurnOnHistory();

    return (true === Style.Is_Equal(CurrentStyle) ? false : true);
};