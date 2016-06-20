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

/**
 * Интерфейс для классов, которые работают с колонтитулами/автофигурами/сносками
 * @param {CDocument} LogicDocument - Ссылка на главный документ.
 * @constructor
 */
function CDocumentControllerBase(LogicDocument)
{
    this.LogicDocument   = LogicDocument;
    this.DrawingDocument = LogicDocument.Get_DrawingDocument();
}

/**
 * Получаем ссылку на CDocument.
 * @returns {CDocument}
 */
CDocumentControllerBase.prototype.Get_LogicDocument = function()
{
    return this.LogicDocument;
};
/**
 * Получаем ссылку на CDrawingDocument.
 * @returns {CDrawingDocument}
 */
CDocumentControllerBase.prototype.Get_DrawingDocument = function()
{
    return this.DrawingDocument;
};
/**
 * Является ли данный класс контроллером для колонтитулов.
 * @param {boolean} bReturnHdrFtr Если true, тогда возвращаем ссылку на колонтитул.
 * @returns {boolean | CHeaderFooter}
 */
CDocumentControllerBase.prototype.Is_HdrFtr = function(bReturnHdrFtr)
{
    if (bReturnHdrFtr)
        return null;

    return false;
};
/**
 * Является ли данный класс контроллером для автофигур.
 * @param {boolean} bReturnShape Если true, тогда возвращаем ссылку на автофигуру.
 * @returns {boolean | CShape}
 */
CDocumentControllerBase.prototype.Is_HdrFtr = function(bReturnShape)
{
    if (bReturnShape)
        return null;

    return false;
};
/**
 * Получаем абосолютный номер страницы по относительному.
 * @param {number} CurPage
 * @returns {number}
 */
CDocumentControllerBase.prototype.Get_AbsolutePage = function(CurPage)
{
    return CurPage;
};
/**
 * Получаем абосолютный номер колноки по относительному номеру страницы.
 * @param {number} CurPage
 * @returns {number}
 */
CDocumentControllerBase.prototype.Get_AbsoluteColumn = function(CurPage)
{
    return 0;
};
/**
 * Проверяем, является ли данный класс верхним, по отношению к другим классам DocumentContent, Document
 * @param {boolean} bReturnTopDocument Если true, тогда возвращаем ссылку на документ.
 * @returns {СDocument | CDocumentContent | null}
 */
CDocumentControllerBase.prototype.Is_TopDocument = function(bReturnTopDocument)
{
    if (bReturnTopDocument)
        return null;

    return false;
};
/**
 * Получаем ссылку на объект, работающий с нумерацией.
 * @returns {CNumbering}
 */
CDocumentControllerBase.prototype.Get_Numbering = function()
{
    return this.LogicDocument.Get_Numbering();
};
/**
 * Получаем ссылку на объект, работающий со стилями.
 * @returns {CStyles}
 */
CDocumentControllerBase.prototype.Get_Styles = function()
{
    return this.LogicDocument.Get_Styles();
};
/**
 * Получаем ссылку на табличный стиль для параграфа.
 * @returns {null}
 */
CDocumentControllerBase.prototype.Get_TableStyleForPara = function()
{
    return null;
};
/**
 * Получаем ссылку на стиль автофигур для параграфа.
 * @returns {null}
 */
CDocumentControllerBase.prototype.Get_ShapeStyleForPara = function()
{
    return null;
};
/**
 * Запрашиваем цвет заливки.
 * @returns {null}
 */
CDocumentControllerBase.prototype.Get_TextBackGroundColor = function()
{
    return undefined;
};
/**
 * Является ли данный класс ячейкой.
 * @returns {false}
 */
CDocumentControllerBase.prototype.Is_Cell = function()
{
    return false;
};
/**
 * Получаем настройки темы для документа.
 */
CDocumentControllerBase.prototype.Get_Theme = function()
{
    return this.LogicDocument.Get_Theme();
};
/**
 * Получаем мап цветов.
 */
CDocumentControllerBase.prototype.Get_ColorMap = function()
{
    return this.LogicDocument.Get_ColorMap();
};
/**
 * Запрашиваем информацию о конце пересчета предыдущего элемента.
 * @param CurElement
 * @returns {null}
 */
CDocumentControllerBase.prototype.Get_PrevElementEndInfo = function(CurElement)
{
    return null;
};
/**
 * Получаем текущее преобразование.
 * @returns {null}
 */
CDocumentControllerBase.prototype.Get_ParentTextTransform = function()
{
    return null;
};
