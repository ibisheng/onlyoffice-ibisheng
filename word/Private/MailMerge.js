/*
 * (c) Copyright Ascensio System SIA 2010-2016
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
var c_oAscError = Asc.c_oAscError;

//----------------------------------------------------------------------------------------------------------------------
// Функции для работы с MailMerge
//----------------------------------------------------------------------------------------------------------------------
Asc['asc_docs_api'].prototype.asc_StartMailMerge = function(oData)
{
    this.mailMergeFileData = oData;
    this.asc_DownloadAs(Asc.c_oAscFileType.JSON);
};
Asc['asc_docs_api'].prototype.asc_StartMailMergeByList = function(aList)
{
    if (!aList || !aList.length || aList.length <= 0)
        aList = [[]];

    var aFields = aList[0];
    if (!aFields || !aFields.length || aFields.length <= 0)
        aFields = [];

    // Пробегаемся по названиям полей и делаем следующее:
    // Если название пустой, тогда задем ему имя "F<номер столбца>"
    // Если название совпадает, тогда добавляем ему число, чтобы имя стало уникальным.

    var UsedNames = {};
    for (var Pos = 0, Count = aFields.length; Pos < Count; Pos++)
    {
        if ("" === aFields[Pos])
            aFields[Pos] = "F" + (Pos + 1);

        if (undefined !== UsedNames[aFields[Pos]])
        {
            var Add = 1;
            var NewName = aFields[Pos] + Add;
            while (undefined !== UsedNames[NewName])
            {
                Add++;
                NewName = aFields[Pos] + Add;
            }
            aFields[Pos] = NewName;
        }

        UsedNames[aFields[Pos]] = 1;
    }

    var DstList = [];
    var FieldsCount = aFields.length;
    for (var Index = 1, Count = aList.length; Index < Count; Index++)
    {
        var oSrcElement = aList[Index];
        var oDstElement = {};
        for (var FieldIndex = 0; FieldIndex < FieldsCount; FieldIndex++)
        {
            var sFieldName = aFields[FieldIndex];
            oDstElement[sFieldName] = oSrcElement[FieldIndex];
        }

        DstList.push(oDstElement);
    }

    this.WordControl.m_oLogicDocument.Start_MailMerge(DstList, aFields);
};
Asc['asc_docs_api'].prototype.asc_GetReceptionsCount = function()
{
    return this.WordControl.m_oLogicDocument.Get_MailMergeReceptionsCount();
};
Asc['asc_docs_api'].prototype.asc_GetMailMergeFieldsNameList = function()
{
    return this.WordControl.m_oLogicDocument.Get_MailMergeFieldsNameList();
};
Asc['asc_docs_api'].prototype.asc_AddMailMergeField = function(Name)
{
    this.WordControl.m_oLogicDocument.Add_MailMergeField(Name);
};
Asc['asc_docs_api'].prototype.asc_SetHighlightMailMergeFields = function(Value)
{
    this.WordControl.m_oLogicDocument.Set_HightlightMailMergeFields(Value);
};
Asc['asc_docs_api'].prototype.asc_PreviewMailMergeResult = function(Index)
{
    this.WordControl.m_oLogicDocument.Preview_MailMergeResult(Index);
};
Asc['asc_docs_api'].prototype.asc_EndPreviewMailMergeResult = function()
{
    this.WordControl.m_oLogicDocument.EndPreview_MailMergeResult();
};
Asc['asc_docs_api'].prototype.sync_StartMailMerge = function()
{
    this.sendEvent("asc_onStartMailMerge");
};
Asc['asc_docs_api'].prototype.sync_PreviewMailMergeResult = function(Index)
{
    this.sendEvent("asc_onPreviewMailMergeResult", Index);
};
Asc['asc_docs_api'].prototype.sync_EndPreviewMailMergeResult = function()
{
    this.sendEvent("asc_onEndPreviewMailMergeResult");
};
Asc['asc_docs_api'].prototype.sync_HighlightMailMergeFields = function(Value)
{
    this.sendEvent("asc_onHighlightMailMergeFields", Value);
};
Asc['asc_docs_api'].prototype.asc_getMailMergeData = function()
{
    return this.WordControl.m_oLogicDocument.Get_MailMergeReceptionsList();
};
Asc['asc_docs_api'].prototype.asc_setMailMergeData = function(aList)
{
    this.asc_StartMailMergeByList(aList);
};
Asc['asc_docs_api'].prototype.asc_sendMailMergeData = function(oData)
{
    var actionType = Asc.c_oAscAsyncAction.SendMailMerge;
    oData.put_UserId(this.documentUserId);
    oData.put_RecordCount(oData.get_RecordTo() - oData.get_RecordFrom() + 1);
    var options = {oMailMergeSendData: oData, isNoCallback: true};
    var t = this;
    this._downloadAs("sendmm", Asc.c_oAscFileType.TXT, actionType, options, function(input) {
        if (null != input && "sendmm" == input["type"])
        {
            if ("ok" == input["status"])
            {
                ;
            }
            else
            {
                t.sendEvent("asc_onError", AscCommon.mapAscServerErrorToAscError(parseInt(input["data"])), c_oAscError.Level.NoCritical);
            }
        }
        else
        {
            t.sendEvent("asc_onError", c_oAscError.ID.Unknown, c_oAscError.Level.NoCritical);
        }
        t.sync_EndAction(Asc.c_oAscAsyncActionType.BlockInteraction, actionType);
    });
};
Asc['asc_docs_api'].prototype.asc_GetMailMergeFiledValue = function(nIndex, sName)
{
    return this.WordControl.m_oLogicDocument.Get_MailMergeFileldValue(nIndex, sName);
};
Asc['asc_docs_api'].prototype.asc_DownloadAsMailMerge = function(typeFile, StartIndex, EndIndex, bIsDownload)
{
    var oDocumentMailMerge = this.WordControl.m_oLogicDocument.Get_MailMergedDocument(StartIndex, EndIndex);
    if (null != oDocumentMailMerge)
    {
        var actionType = null;
        var options = {oDocumentMailMerge: oDocumentMailMerge, downloadType: AscCommon.DownloadType.MailMerge, errorDirect: c_oAscError.ID.MailMergeSaveFile};
        if (bIsDownload) {
            actionType = Asc.c_oAscAsyncAction.DownloadMerge;
            options.downloadType = AscCommon.DownloadType.None;
        }
        this._downloadAs("save", typeFile, actionType, options, null);
    }
    return null != oDocumentMailMerge ? true : false;
};

Asc['asc_docs_api'].prototype['asc_StartMailMerge']              = Asc['asc_docs_api'].prototype.asc_StartMailMerge;
Asc['asc_docs_api'].prototype['asc_StartMailMergeByList']        = Asc['asc_docs_api'].prototype.asc_StartMailMergeByList;
Asc['asc_docs_api'].prototype['asc_GetReceptionsCount']          = Asc['asc_docs_api'].prototype.asc_GetReceptionsCount;
Asc['asc_docs_api'].prototype['asc_GetMailMergeFieldsNameList']  = Asc['asc_docs_api'].prototype.asc_GetMailMergeFieldsNameList;
Asc['asc_docs_api'].prototype['asc_AddMailMergeField']           = Asc['asc_docs_api'].prototype.asc_AddMailMergeField;
Asc['asc_docs_api'].prototype['asc_SetHighlightMailMergeFields'] = Asc['asc_docs_api'].prototype.asc_SetHighlightMailMergeFields;
Asc['asc_docs_api'].prototype['asc_PreviewMailMergeResult']      = Asc['asc_docs_api'].prototype.asc_PreviewMailMergeResult;
Asc['asc_docs_api'].prototype['asc_EndPreviewMailMergeResult']   = Asc['asc_docs_api'].prototype.asc_EndPreviewMailMergeResult;
Asc['asc_docs_api'].prototype['sync_StartMailMerge']             = Asc['asc_docs_api'].prototype.sync_StartMailMerge;
Asc['asc_docs_api'].prototype['sync_PreviewMailMergeResult']     = Asc['asc_docs_api'].prototype.sync_PreviewMailMergeResult;
Asc['asc_docs_api'].prototype['sync_EndPreviewMailMergeResult']  = Asc['asc_docs_api'].prototype.sync_EndPreviewMailMergeResult;
Asc['asc_docs_api'].prototype['sync_HighlightMailMergeFields']   = Asc['asc_docs_api'].prototype.sync_HighlightMailMergeFields;
Asc['asc_docs_api'].prototype['asc_getMailMergeData']            = Asc['asc_docs_api'].prototype.asc_getMailMergeData;
Asc['asc_docs_api'].prototype['asc_setMailMergeData']            = Asc['asc_docs_api'].prototype.asc_setMailMergeData;
Asc['asc_docs_api'].prototype['asc_sendMailMergeData']           = Asc['asc_docs_api'].prototype.asc_sendMailMergeData;
Asc['asc_docs_api'].prototype['asc_GetMailMergeFiledValue']      = Asc['asc_docs_api'].prototype.asc_GetMailMergeFiledValue;
Asc['asc_docs_api'].prototype['asc_DownloadAsMailMerge']         = Asc['asc_docs_api'].prototype.asc_DownloadAsMailMerge;
//----------------------------------------------------------------------------------------------------------------------
// Функции для работы с MailMerge
//----------------------------------------------------------------------------------------------------------------------
CDocument.prototype.Start_MailMerge = function(MailMergeMap, arrFields)
{
	this.EndPreview_MailMergeResult();

	this.MailMergeMap    = MailMergeMap;
	this.MailMergeFields = arrFields;
	editor.sync_HighlightMailMergeFields(this.MailMergeFieldsHighlight);
	editor.sync_StartMailMerge();
};
CDocument.prototype.Get_MailMergeReceptionsCount = function()
{
    if (null === this.MailMergeMap || !this.MailMergeMap)
        return 0;

    return this.MailMergeMap.length;
};
CDocument.prototype.Get_MailMergeFieldsNameList = function()
{
    if (this.Get_MailMergeReceptionsCount() <= 0)
        return this.MailMergeFields;

    // Предполагаем, что в первом элементе перечислены все поля
    var Element = this.MailMergeMap[0];
    var aList = [];
    for (var sId in Element)
    {
        aList.push(sId);
    }

    return aList;
};
CDocument.prototype.Add_MailMergeField = function(Name)
{
    if (false === this.Document_Is_SelectionLocked(AscCommon.changestype_Paragraph_Content))
    {
        this.Create_NewHistoryPoint(AscDFH.historydescription_Document_AddMailMergeField);

        var oField = new ParaField(fieldtype_MERGEFIELD, [Name], []);
        var oRun = new ParaRun();

        var Index = 0;
        oRun.Add_ToContent(Index++, new ParaText("«"));
        for (var Len = Name.length; Index <= Len; Index++)
        {
            oRun.Add_ToContent(Index, new ParaText(Name.charAt(Index - 1)));
        }
        oRun.Add_ToContent(Index, new ParaText("»"));
        oField.Add_ToContent(0, oRun);

        this.Register_Field(oField);
        this.Paragraph_Add(oField);
        this.Document_UpdateInterfaceState();
    }
};
CDocument.prototype.Set_HightlightMailMergeFields = function(Value)
{
    if (Value !== this.MailMergeFieldsHighlight)
    {
        this.MailMergeFieldsHighlight = Value;
        this.DrawingDocument.ClearCachePages();
        this.DrawingDocument.FirePaint();
        this.DrawingDocument.Update_FieldTrack(false);
        editor.sync_HighlightMailMergeFields(this.MailMergeFieldsHighlight);
    }
};
CDocument.prototype.Preview_MailMergeResult = function(Index)
{
    if (null === this.MailMergeMap)
        return;

    if (true !== this.MailMergePreview)
    {
        this.MailMergePreview = true;
        this.Selection_Remove();
        AscCommon.CollaborativeEditing.m_bGlobalLock = true;
    }

    this.FieldsManager.Update_MailMergeFields(this.MailMergeMap[Index]);
    this.Recalculate_FromStart(true);

    editor.sync_PreviewMailMergeResult(Index);
};
CDocument.prototype.EndPreview_MailMergeResult = function()
{
    if (null === this.MailMergeMap || true !== this.MailMergePreview)
        return;

    this.MailMergePreview = false;
    AscCommon.CollaborativeEditing.m_bGlobalLock = false;

    this.FieldsManager.Restore_MailMergeTemplate();
    this.Recalculate_FromStart(true);

    editor.sync_EndPreviewMailMergeResult();
};
CDocument.prototype.Get_MailMergeReceptionsList = function()
{
    var aList = [];

    var aHeaders = [];
    var nCount = this.MailMergeMap.length;
    if (nCount <= 0)
        return [this.MailMergeFields];

    for (var sId in this.MailMergeMap[0])
        aHeaders.push(sId);

    var nHeadersCount = aHeaders.length;

    aList.push(aHeaders);
    for (var nIndex = 0; nIndex < nCount; nIndex++)
    {
        var aReception = [];
        var oReception = this.MailMergeMap[nIndex];
        for (var nHeaderIndex = 0; nHeaderIndex < nHeadersCount; nHeaderIndex++)
        {
            var sValue = oReception[aHeaders[nHeaderIndex]];
            aReception.push(sValue ? sValue : "");
        }

        aList.push(aReception);
    }

    return aList;
};
CDocument.prototype.Get_MailMergeFileldValue = function(nIndex, sName)
{
    if (null === this.MailMergeMap)
        return null;

    return this.MailMergeMap[nIndex][sName];
};
CDocument.prototype.Get_MailMergedDocument = function(_nStartIndex, _nEndIndex)
{
    var nStartIndex = (undefined !== _nStartIndex ? Math.max(0, _nStartIndex) : 0);
    var nEndIndex   = (undefined !== _nEndIndex   ? Math.min(_nEndIndex, this.MailMergeMap.length - 1) : this.MailMergeMap.length - 1);

    if (null === this.MailMergeMap || nStartIndex > nEndIndex || nStartIndex >= this.MailMergeMap.length)
        return null;

    AscCommon.History.TurnOff();
    AscCommon.g_oTableId.TurnOff();

    var LogicDocument = new CDocument(undefined, false);
    AscCommon.History.Document = this;

    // Копируем стили, они все одинаковые для всех документов
    LogicDocument.Styles = this.Styles.Copy();

    // Нумерацию придется повторить для каждого отдельного файла
    LogicDocument.Numbering.Clear();


    LogicDocument.theme = this.theme.createDuplicate();
    LogicDocument.clrSchemeMap   = this.clrSchemeMap.createDuplicate();

    var FieldsManager = this.FieldsManager;

    var ContentCount = this.Content.length;
    var OverallIndex = 0;
    this.ForceCopySectPr = true;

    for (var Index = nStartIndex; Index <= nEndIndex; Index++)
    {
        // Подменяем ссылку на менеджер полей, чтобы скопированные поля регистрировались в новом классе
        this.FieldsManager = LogicDocument.FieldsManager;
        var NewNumbering = this.Numbering.Copy_All_AbstractNums();
        LogicDocument.Numbering.Append_AbstractNums(NewNumbering.AbstractNums);

        this.CopyNumberingMap = NewNumbering.Map;

        for (var ContentIndex = 0; ContentIndex < ContentCount; ContentIndex++)
        {
            LogicDocument.Content[OverallIndex++] = this.Content[ContentIndex].Copy(LogicDocument, this.DrawingDocument);

            if (type_Paragraph === this.Content[ContentIndex].Get_Type())
            {
                var ParaSectPr = this.Content[ContentIndex].Get_SectionPr();
                if (ParaSectPr)
                {
                    var NewParaSectPr = new CSectionPr();
                    NewParaSectPr.Copy(ParaSectPr, true);
                    LogicDocument.Content[OverallIndex - 1].Set_SectionPr(NewParaSectPr, false);
                }
            }
        }

        // Добавляем дополнительный параграф с окончанием секции
        var SectionPara = new Paragraph(this.DrawingDocument, this, 0, 0, 0, 0, 0);
        var SectPr = new CSectionPr();
        SectPr.Copy(this.SectPr, true);
        SectPr.Set_Type(c_oAscSectionBreakType.NextPage);
        SectionPara.Set_SectionPr(SectPr, false);
        LogicDocument.Content[OverallIndex++] = SectionPara;

        LogicDocument.FieldsManager.Replace_MailMergeFields(this.MailMergeMap[Index]);
    }

    this.CopyNumberingMap = null;
    this.ForceCopySectPr  = false;

    // Добавляем дополнительный параграф в самом конце для последней секции документа
    var SectPara = new Paragraph(this.DrawingDocument, this, 0, 0, 0, 0, 0);
    LogicDocument.Content[OverallIndex++] = SectPara;
    LogicDocument.SectPr.Copy(this.SectPr);
    LogicDocument.SectPr.Set_Type(c_oAscSectionBreakType.Continuous);

    for (var Index = 0, Count = LogicDocument.Content.length; Index < Count; Index++)
    {
        if (0 === Index)
            LogicDocument.Content[Index].Prev = null;
        else
            LogicDocument.Content[Index].Prev = LogicDocument.Content[Index - 1];

        if (Count - 1 === Index)
            LogicDocument.Content[Index].Next = null;
        else
            LogicDocument.Content[Index].Next = LogicDocument.Content[Index + 1];

        LogicDocument.Content[Index].Parent = LogicDocument;
    }

    this.FieldsManager = FieldsManager;
    AscCommon.g_oTableId.TurnOn();
    AscCommon.History.TurnOn();

    return LogicDocument;
};