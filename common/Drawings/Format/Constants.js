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

(/**
 * @param {Window} window
 * @param {undefined} undefined
 */
	function(window, undefined)
{
	function Get_HistoryPointStringDescription(nDescription)
	{
		var sString = "Unknown";
		switch (nDescription)
		{
			case AscDFH.historydescription_Cut                                         :
				sString = "Cut                                        ";
				break;
			case AscDFH.historydescription_PasteButtonIE                               :
				sString = "PasteButtonIE                              ";
				break;
			case AscDFH.historydescription_PasteButtonNotIE                            :
				sString = "PasteButtonNotIE                           ";
				break;
			case AscDFH.historydescription_ChartDrawingObjects                         :
				sString = "ChartDrawingObjects                        ";
				break;
			case AscDFH.historydescription_CommonControllerCheckChartText              :
				sString = "CommonControllerCheckChartText             ";
				break;
			case AscDFH.historydescription_CommonControllerUnGroup                     :
				sString = "CommonControllerUnGroup                    ";
				break;
			case AscDFH.historydescription_CommonControllerCheckSelected               :
				sString = "CommonControllerCheckSelected              ";
				break;
			case AscDFH.historydescription_CommonControllerSetGraphicObject            :
				sString = "CommonControllerSetGraphicObject           ";
				break;
			case AscDFH.historydescription_CommonStatesAddNewShape                     :
				sString = "CommonStatesAddNewShape                    ";
				break;
			case AscDFH.historydescription_CommonStatesRotate                          :
				sString = "CommonStatesRotate                         ";
				break;
			case AscDFH.historydescription_PasteNative                                 :
				sString = "PasteNative                                ";
				break;
			case AscDFH.historydescription_Document_GroupUnGroup                       :
				sString = "Document_GroupUnGroup                      ";
				break;
			case AscDFH.historydescription_Document_SetDefaultLanguage                 :
				sString = "Document_SetDefaultLanguage                ";
				break;
			case AscDFH.historydescription_Document_ChangeColorScheme                  :
				sString = "Document_ChangeColorScheme                 ";
				break;
			case AscDFH.historydescription_Document_AddChart                           :
				sString = "Document_AddChart                          ";
				break;
			case AscDFH.historydescription_Document_EditChart                          :
				sString = "Document_EditChart                         ";
				break;
			case AscDFH.historydescription_Document_DragText                           :
				sString = "Document_DragText                          ";
				break;
			case AscDFH.historydescription_Document_DocumentContentExtendToPos         :
				sString = "Document_DocumentContentExtendToPos        ";
				break;
			case AscDFH.historydescription_Document_AddHeader                          :
				sString = "Document_AddHeader                         ";
				break;
			case AscDFH.historydescription_Document_AddFooter                          :
				sString = "Document_AddFooter                         ";
				break;
			case AscDFH.historydescription_Document_ParagraphExtendToPos               :
				sString = "Document_ParagraphExtendToPos              ";
				break;
			case AscDFH.historydescription_Document_ParagraphChangeFrame               :
				sString = "Document_ParagraphChangeFrame              ";
				break;
			case AscDFH.historydescription_Document_ReplaceAll                         :
				sString = "Document_ReplaceAll                        ";
				break;
			case AscDFH.historydescription_Document_ReplaceSingle                      :
				sString = "Document_ReplaceSingle                     ";
				break;
			case AscDFH.historydescription_Document_TableAddNewRowByTab                :
				sString = "Document_TableAddNewRowByTab               ";
				break;
			case AscDFH.historydescription_Document_AddNewShape                        :
				sString = "Document_AddNewShape                       ";
				break;
			case AscDFH.historydescription_Document_EditWrapPolygon                    :
				sString = "Document_EditWrapPolygon                   ";
				break;
			case AscDFH.historydescription_Document_MoveInlineObject                   :
				sString = "Document_MoveInlineObject                  ";
				break;
			case AscDFH.historydescription_Document_CopyAndMoveInlineObject            :
				sString = "Document_CopyAndMoveInlineObject           ";
				break;
			case AscDFH.historydescription_Document_RotateInlineDrawing                :
				sString = "Document_RotateInlineDrawing               ";
				break;
			case AscDFH.historydescription_Document_RotateFlowDrawingCtrl              :
				sString = "Document_RotateFlowDrawingCtrl             ";
				break;
			case AscDFH.historydescription_Document_RotateFlowDrawingNoCtrl            :
				sString = "Document_RotateFlowDrawingNoCtrl           ";
				break;
			case AscDFH.historydescription_Document_MoveInGroup                        :
				sString = "Document_MoveInGroup                       ";
				break;
			case AscDFH.historydescription_Document_ChangeWrapContour                  :
				sString = "Document_ChangeWrapContour                 ";
				break;
			case AscDFH.historydescription_Document_ChangeWrapContourAddPoint          :
				sString = "Document_ChangeWrapContourAddPoint         ";
				break;
			case AscDFH.historydescription_Document_GrObjectsBringToFront              :
				sString = "Document_GrObjectsBringToFront             ";
				break;
			case AscDFH.historydescription_Document_GrObjectsBringForwardGroup         :
				sString = "Document_GrObjectsBringForwardGroup        ";
				break;
			case AscDFH.historydescription_Document_GrObjectsBringForward              :
				sString = "Document_GrObjectsBringForward             ";
				break;
			case AscDFH.historydescription_Document_GrObjectsSendToBackGroup           :
				sString = "Document_GrObjectsSendToBackGroup          ";
				break;
			case AscDFH.historydescription_Document_GrObjectsSendToBack                :
				sString = "Document_GrObjectsSendToBack               ";
				break;
			case AscDFH.historydescription_Document_GrObjectsBringBackwardGroup        :
				sString = "Document_GrObjectsBringBackwardGroup       ";
				break;
			case AscDFH.historydescription_Document_GrObjectsBringBackward             :
				sString = "Document_GrObjectsBringBackward            ";
				break;
			case AscDFH.historydescription_Document_GrObjectsChangeWrapPolygon         :
				sString = "Document_GrObjectsChangeWrapPolygon        ";
				break;
			case AscDFH.historydescription_Document_MathAutoCorrect                    :
				sString = "Document_MathAutoCorrect                   ";
				break;
			case AscDFH.historydescription_Document_SetFramePrWithFontFamily           :
				sString = "Document_SetFramePrWithFontFamily          ";
				break;
			case AscDFH.historydescription_Document_SetFramePr                         :
				sString = "Document_SetFramePr                        ";
				break;
			case AscDFH.historydescription_Document_SetFramePrWithFontFamilyLong       :
				sString = "Document_SetFramePrWithFontFamilyLong      ";
				break;
			case AscDFH.historydescription_Document_SetTextFontName                    :
				sString = "Document_SetTextFontName                   ";
				break;
			case AscDFH.historydescription_Document_SetTextFontSize                    :
				sString = "Document_SetTextFontSize                   ";
				break;
			case AscDFH.historydescription_Document_SetTextBold                        :
				sString = "Document_SetTextBold                       ";
				break;
			case AscDFH.historydescription_Document_SetTextItalic                      :
				sString = "Document_SetTextItalic                     ";
				break;
			case AscDFH.historydescription_Document_SetTextUnderline                   :
				sString = "Document_SetTextUnderline                  ";
				break;
			case AscDFH.historydescription_Document_SetTextStrikeout                   :
				sString = "Document_SetTextStrikeout                  ";
				break;
			case AscDFH.historydescription_Document_SetTextDStrikeout                  :
				sString = "Document_SetTextDStrikeout                 ";
				break;
			case AscDFH.historydescription_Document_SetTextSpacing                     :
				sString = "Document_SetTextSpacing                    ";
				break;
			case AscDFH.historydescription_Document_SetTextCaps                        :
				sString = "Document_SetTextCaps                       ";
				break;
			case AscDFH.historydescription_Document_SetTextSmallCaps                   :
				sString = "Document_SetTextSmallCaps                  ";
				break;
			case AscDFH.historydescription_Document_SetTextPosition                    :
				sString = "Document_SetTextPosition                   ";
				break;
			case AscDFH.historydescription_Document_SetTextLang                        :
				sString = "Document_SetTextLang                       ";
				break;
			case AscDFH.historydescription_Document_SetParagraphLineSpacing            :
				sString = "Document_SetParagraphLineSpacing           ";
				break;
			case AscDFH.historydescription_Document_SetParagraphLineSpacingBeforeAfter :
				sString = "Document_SetParagraphLineSpacingBeforeAfter";
				break;
			case AscDFH.historydescription_Document_IncFontSize                        :
				sString = "Document_IncFontSize                       ";
				break;
			case AscDFH.historydescription_Document_DecFontSize                        :
				sString = "Document_DecFontSize                       ";
				break;
			case AscDFH.historydescription_Document_SetParagraphBorders                :
				sString = "Document_SetParagraphBorders               ";
				break;
			case AscDFH.historydescription_Document_SetParagraphPr                     :
				sString = "Document_SetParagraphPr                    ";
				break;
			case AscDFH.historydescription_Document_SetParagraphAlign                  :
				sString = "Document_SetParagraphAlign                 ";
				break;
			case AscDFH.historydescription_Document_SetTextVertAlign                   :
				sString = "Document_SetTextVertAlign                  ";
				break;
			case AscDFH.historydescription_Document_SetParagraphNumbering              :
				sString = "Document_SetParagraphNumbering             ";
				break;
			case AscDFH.historydescription_Document_SetParagraphStyle                  :
				sString = "Document_SetParagraphStyle                 ";
				break;
			case AscDFH.historydescription_Document_SetParagraphPageBreakBefore        :
				sString = "Document_SetParagraphPageBreakBefore       ";
				break;
			case AscDFH.historydescription_Document_SetParagraphWidowControl           :
				sString = "Document_SetParagraphWidowControl          ";
				break;
			case AscDFH.historydescription_Document_SetParagraphKeepLines              :
				sString = "Document_SetParagraphKeepLines             ";
				break;
			case AscDFH.historydescription_Document_SetParagraphKeepNext               :
				sString = "Document_SetParagraphKeepNext              ";
				break;
			case AscDFH.historydescription_Document_SetParagraphContextualSpacing      :
				sString = "Document_SetParagraphContextualSpacing     ";
				break;
			case AscDFH.historydescription_Document_SetTextHighlightNone               :
				sString = "Document_SetTextHighlightNone              ";
				break;
			case AscDFH.historydescription_Document_SetTextHighlightColor              :
				sString = "Document_SetTextHighlightColor             ";
				break;
			case AscDFH.historydescription_Document_SetTextColor                       :
				sString = "Document_SetTextColor                      ";
				break;
			case AscDFH.historydescription_Document_SetParagraphShd                    :
				sString = "Document_SetParagraphShd                   ";
				break;
			case AscDFH.historydescription_Document_SetParagraphIndent                 :
				sString = "Document_SetParagraphIndent                ";
				break;
			case AscDFH.historydescription_Document_IncParagraphIndent                 :
				sString = "Document_IncParagraphIndent                ";
				break;
			case AscDFH.historydescription_Document_DecParagraphIndent                 :
				sString = "Document_DecParagraphIndent                ";
				break;
			case AscDFH.historydescription_Document_SetParagraphIndentRight            :
				sString = "Document_SetParagraphIndentRight           ";
				break;
			case AscDFH.historydescription_Document_SetParagraphIndentFirstLine        :
				sString = "Document_SetParagraphIndentFirstLine       ";
				break;
			case AscDFH.historydescription_Document_SetPageOrientation                 :
				sString = "Document_SetPageOrientation                ";
				break;
			case AscDFH.historydescription_Document_SetPageSize                        :
				sString = "Document_SetPageSize                       ";
				break;
			case AscDFH.historydescription_Document_AddPageBreak                       :
				sString = "Document_AddPageBreak                      ";
				break;
			case AscDFH.historydescription_Document_AddPageNumToHdrFtr                 :
				sString = "Document_AddPageNumToHdrFtr                ";
				break;
			case AscDFH.historydescription_Document_AddPageNumToCurrentPos             :
				sString = "Document_AddPageNumToCurrentPos            ";
				break;
			case AscDFH.historydescription_Document_SetHdrFtrDistance                  :
				sString = "Document_SetHdrFtrDistance                 ";
				break;
			case AscDFH.historydescription_Document_SetHdrFtrFirstPage                 :
				sString = "Document_SetHdrFtrFirstPage                ";
				break;
			case AscDFH.historydescription_Document_SetHdrFtrEvenAndOdd                :
				sString = "Document_SetHdrFtrEvenAndOdd               ";
				break;
			case AscDFH.historydescription_Document_SetHdrFtrLink                      :
				sString = "Document_SetHdrFtrLink                     ";
				break;
			case AscDFH.historydescription_Document_AddTable                           :
				sString = "Document_AddTable                          ";
				break;
			case AscDFH.historydescription_Document_TableAddRowAbove                   :
				sString = "Document_TableAddRowAbove                  ";
				break;
			case AscDFH.historydescription_Document_TableAddRowBelow                   :
				sString = "Document_TableAddRowBelow                  ";
				break;
			case AscDFH.historydescription_Document_TableAddColumnLeft                 :
				sString = "Document_TableAddColumnLeft                ";
				break;
			case AscDFH.historydescription_Document_TableAddColumnRight                :
				sString = "Document_TableAddColumnRight               ";
				break;
			case AscDFH.historydescription_Document_TableRemoveRow                     :
				sString = "Document_TableRemoveRow                    ";
				break;
			case AscDFH.historydescription_Document_TableRemoveColumn                  :
				sString = "Document_TableRemoveColumn                 ";
				break;
			case AscDFH.historydescription_Document_RemoveTable                        :
				sString = "Document_RemoveTable                       ";
				break;
			case AscDFH.historydescription_Document_MergeTableCells                    :
				sString = "Document_MergeTableCells                   ";
				break;
			case AscDFH.historydescription_Document_SplitTableCells                    :
				sString = "Document_SplitTableCells                   ";
				break;
			case AscDFH.historydescription_Document_ApplyTablePr                       :
				sString = "Document_ApplyTablePr                      ";
				break;
			case AscDFH.historydescription_Document_AddImageUrl                        :
				sString = "Document_AddImageUrl                       ";
				break;
			case AscDFH.historydescription_Document_AddImageUrlLong                    :
				sString = "Document_AddImageUrlLong                   ";
				break;
			case AscDFH.historydescription_Document_AddImageToPage                     :
				sString = "Document_AddImageToPage                    ";
				break;
			case AscDFH.historydescription_Document_ApplyImagePrWithUrl                :
				sString = "Document_ApplyImagePrWithUrl               ";
				break;
			case AscDFH.historydescription_Document_ApplyImagePrWithUrlLong            :
				sString = "Document_ApplyImagePrWithUrlLong           ";
				break;
			case AscDFH.historydescription_Document_ApplyImagePrWithFillUrl            :
				sString = "Document_ApplyImagePrWithFillUrl           ";
				break;
			case AscDFH.historydescription_Document_ApplyImagePrWithFillUrlLong        :
				sString = "Document_ApplyImagePrWithFillUrlLong       ";
				break;
			case AscDFH.historydescription_Document_ApplyImagePr                       :
				sString = "Document_ApplyImagePr                      ";
				break;
			case AscDFH.historydescription_Document_AddHyperlink                       :
				sString = "Document_AddHyperlink                      ";
				break;
			case AscDFH.historydescription_Document_ChangeHyperlink                    :
				sString = "Document_ChangeHyperlink                   ";
				break;
			case AscDFH.historydescription_Document_RemoveHyperlink                    :
				sString = "Document_RemoveHyperlink                   ";
				break;
			case AscDFH.historydescription_Document_ReplaceMisspelledWord              :
				sString = "Document_ReplaceMisspelledWord             ";
				break;
			case AscDFH.historydescription_Document_AddComment                         :
				sString = "Document_AddComment                        ";
				break;
			case AscDFH.historydescription_Document_RemoveComment                      :
				sString = "Document_RemoveComment                     ";
				break;
			case AscDFH.historydescription_Document_ChangeComment                      :
				sString = "Document_ChangeComment                     ";
				break;
			case AscDFH.historydescription_Document_SetTextFontNameLong                :
				sString = "Document_SetTextFontNameLong               ";
				break;
			case AscDFH.historydescription_Document_AddImage                           :
				sString = "Document_AddImage                          ";
				break;
			case AscDFH.historydescription_Document_ClearFormatting                    :
				sString = "Document_ClearFormatting                   ";
				break;
			case AscDFH.historydescription_Document_AddSectionBreak                    :
				sString = "Document_AddSectionBreak                   ";
				break;
			case AscDFH.historydescription_Document_AddMath                            :
				sString = "Document_AddMath                           ";
				break;
			case AscDFH.historydescription_Document_SetParagraphTabs                   :
				sString = "Document_SetParagraphTabs                  ";
				break;
			case AscDFH.historydescription_Document_SetParagraphIndentFromRulers       :
				sString = "Document_SetParagraphIndentFromRulers      ";
				break;
			case AscDFH.historydescription_Document_SetDocumentMargin_Hor              :
				sString = "Document_SetDocumentMargin_Hor             ";
				break;
			case AscDFH.historydescription_Document_SetTableMarkup_Hor                 :
				sString = "Document_SetTableMarkup_Hor                ";
				break;
			case AscDFH.historydescription_Document_SetDocumentMargin_Ver              :
				sString = "Document_SetDocumentMargin_Ver             ";
				break;
			case AscDFH.historydescription_Document_SetHdrFtrBounds                    :
				sString = "Document_SetHdrFtrBounds                   ";
				break;
			case AscDFH.historydescription_Document_SetTableMarkup_Ver                 :
				sString = "Document_SetTableMarkup_Ver                ";
				break;
			case AscDFH.historydescription_Document_DocumentExtendToPos                :
				sString = "Document_DocumentExtendToPos               ";
				break;
			case AscDFH.historydescription_Document_AddDropCap                         :
				sString = "Document_AddDropCap                        ";
				break;
			case AscDFH.historydescription_Document_RemoveDropCap                      :
				sString = "Document_RemoveDropCap                     ";
				break;
			case AscDFH.historydescription_Document_SetTextHighlight                   :
				sString = "Document_SetTextHighlight                  ";
				break;
			case AscDFH.historydescription_Document_BackSpaceButton                    :
				sString = "Document_BackSpaceButton                   ";
				break;
			case AscDFH.historydescription_Document_MoveParagraphByTab                 :
				sString = "Document_MoveParagraphByTab                ";
				break;
			case AscDFH.historydescription_Document_AddTab                             :
				sString = "Document_AddTab                            ";
				break;
			case AscDFH.historydescription_Document_EnterButton                        :
				sString = "Document_EnterButton                       ";
				break;
			case AscDFH.historydescription_Document_SpaceButton                        :
				sString = "Document_SpaceButton                       ";
				break;
			case AscDFH.historydescription_Document_ShiftInsert                        :
				sString = "Document_ShiftInsert                       ";
				break;
			case AscDFH.historydescription_Document_ShiftInsertSafari                  :
				sString = "Document_ShiftInsertSafari                 ";
				break;
			case AscDFH.historydescription_Document_DeleteButton                       :
				sString = "Document_DeleteButton                      ";
				break;
			case AscDFH.historydescription_Document_ShiftDeleteButton                  :
				sString = "Document_ShiftDeleteButton                 ";
				break;
			case AscDFH.historydescription_Document_SetStyleHeading1                   :
				sString = "Document_SetStyleHeading1                  ";
				break;
			case AscDFH.historydescription_Document_SetStyleHeading2                   :
				sString = "Document_SetStyleHeading2                  ";
				break;
			case AscDFH.historydescription_Document_SetStyleHeading3                   :
				sString = "Document_SetStyleHeading3                  ";
				break;
			case AscDFH.historydescription_Document_SetTextStrikeoutHotKey             :
				sString = "Document_SetTextStrikeoutHotKey            ";
				break;
			case AscDFH.historydescription_Document_SetTextBoldHotKey                  :
				sString = "Document_SetTextBoldHotKey                 ";
				break;
			case AscDFH.historydescription_Document_SetParagraphAlignHotKey            :
				sString = "Document_SetParagraphAlignHotKey           ";
				break;
			case AscDFH.historydescription_Document_AddEuroLetter                      :
				sString = "Document_AddEuroLetter                     ";
				break;
			case AscDFH.historydescription_Document_SetTextItalicHotKey                :
				sString = "Document_SetTextItalicHotKey               ";
				break;
			case AscDFH.historydescription_Document_SetParagraphAlignHotKey2           :
				sString = "Document_SetParagraphAlignHotKey2          ";
				break;
			case AscDFH.historydescription_Document_SetParagraphNumberingHotKey        :
				sString = "Document_SetParagraphNumberingHotKey       ";
				break;
			case AscDFH.historydescription_Document_SetParagraphAlignHotKey3           :
				sString = "Document_SetParagraphAlignHotKey3          ";
				break;
			case AscDFH.historydescription_Document_AddPageNumHotKey                   :
				sString = "Document_AddPageNumHotKey                  ";
				break;
			case AscDFH.historydescription_Document_SetParagraphAlignHotKey4           :
				sString = "Document_SetParagraphAlignHotKey4          ";
				break;
			case AscDFH.historydescription_Document_SetTextUnderlineHotKey             :
				sString = "Document_SetTextUnderlineHotKey            ";
				break;
			case AscDFH.historydescription_Document_FormatPasteHotKey                  :
				sString = "Document_FormatPasteHotKey                 ";
				break;
			case AscDFH.historydescription_Document_PasteHotKey                        :
				sString = "Document_PasteHotKey                       ";
				break;
			case AscDFH.historydescription_Document_PasteSafariHotKey                  :
				sString = "Document_PasteSafariHotKey                 ";
				break;
			case AscDFH.historydescription_Document_CutHotKey                          :
				sString = "Document_CutHotKey                         ";
				break;
			case AscDFH.historydescription_Document_SetTextVertAlignHotKey             :
				sString = "Document_SetTextVertAlignHotKey            ";
				break;
			case AscDFH.historydescription_Document_AddMathHotKey                      :
				sString = "Document_AddMathHotKey                     ";
				break;
			case AscDFH.historydescription_Document_SetTextVertAlignHotKey2            :
				sString = "Document_SetTextVertAlignHotKey2           ";
				break;
			case AscDFH.historydescription_Document_MinusButton                        :
				sString = "Document_MinusButton                       ";
				break;
			case AscDFH.historydescription_Document_SetTextVertAlignHotKey3            :
				sString = "Document_SetTextVertAlignHotKey3           ";
				break;
			case AscDFH.historydescription_Document_AddLetter                          :
				sString = "Document_AddLetter                         ";
				break;
			case AscDFH.historydescription_Document_MoveTableBorder                    :
				sString = "Document_MoveTableBorder                   ";
				break;
			case AscDFH.historydescription_Document_FormatPasteHotKey2                 :
				sString = "Document_FormatPasteHotKey2                ";
				break;
			case AscDFH.historydescription_Document_SetTextHighlight2                  :
				sString = "Document_SetTextHighlight2                 ";
				break;
			case AscDFH.historydescription_Document_AddTextFromTextBox                 :
				sString = "Document_AddTextFromTextBox                ";
				break;
			case AscDFH.historydescription_Document_AddMailMergeField                  :
				sString = "Document_AddMailMergeField                 ";
				break;
			case AscDFH.historydescription_Document_MoveInlineTable                    :
				sString = "Document_MoveInlineTable                   ";
				break;
			case AscDFH.historydescription_Document_MoveFlowTable                      :
				sString = "Document_MoveFlowTable                     ";
				break;
			case AscDFH.historydescription_Document_RestoreFieldTemplateText           :
				sString = "Document_RestoreFieldTemplateText          ";
				break;

			case AscDFH.historydescription_Spreadsheet_SetCellFontName                 :
				sString = "Spreadsheet_SetCellFontName                ";
				break;
			case AscDFH.historydescription_Spreadsheet_SetCellFontSize                 :
				sString = "Spreadsheet_SetCellFontSize                ";
				break;
			case AscDFH.historydescription_Spreadsheet_SetCellBold                     :
				sString = "Spreadsheet_SetCellBold                    ";
				break;
			case AscDFH.historydescription_Spreadsheet_SetCellItalic                   :
				sString = "Spreadsheet_SetCellItalic                  ";
				break;
			case AscDFH.historydescription_Spreadsheet_SetCellUnderline                :
				sString = "Spreadsheet_SetCellUnderline               ";
				break;
			case AscDFH.historydescription_Spreadsheet_SetCellStrikeout                :
				sString = "Spreadsheet_SetCellStrikeout               ";
				break;
			case AscDFH.historydescription_Spreadsheet_SetCellSubscript                :
				sString = "Spreadsheet_SetCellSubscript               ";
				break;
			case AscDFH.historydescription_Spreadsheet_SetCellSuperscript              :
				sString = "Spreadsheet_SetCellSuperscript             ";
				break;
			case AscDFH.historydescription_Spreadsheet_SetCellAlign                    :
				sString = "Spreadsheet_SetCellAlign                   ";
				break;
			case AscDFH.historydescription_Spreadsheet_SetCellVertAlign                :
				sString = "Spreadsheet_SetCellVertAlign               ";
				break;
			case AscDFH.historydescription_Spreadsheet_SetCellTextColor                :
				sString = "Spreadsheet_SetCellTextColor               ";
				break;
			case AscDFH.historydescription_Spreadsheet_SetCellBackgroundColor          :
				sString = "Spreadsheet_SetCellBackgroundColor         ";
				break;
			case AscDFH.historydescription_Spreadsheet_SetCellIncreaseFontSize         :
				sString = "Spreadsheet_SetCellIncreaseFontSize        ";
				break;
			case AscDFH.historydescription_Spreadsheet_SetCellDecreaseFontSize         :
				sString = "Spreadsheet_SetCellDecreaseFontSize        ";
				break;
			case AscDFH.historydescription_Spreadsheet_SetCellHyperlinkAdd             :
				sString = "Spreadsheet_SetCellHyperlinkAdd            ";
				break;
			case AscDFH.historydescription_Spreadsheet_SetCellHyperlinkModify          :
				sString = "Spreadsheet_SetCellHyperlinkModify         ";
				break;
			case AscDFH.historydescription_Spreadsheet_SetCellHyperlinkRemove          :
				sString = "Spreadsheet_SetCellHyperlinkRemove         ";
				break;
			case AscDFH.historydescription_Spreadsheet_EditChart                       :
				sString = "Spreadsheet_EditChart                      ";
				break;
			case AscDFH.historydescription_Spreadsheet_Remove                          :
				sString = "Spreadsheet_Remove                         ";
				break;
			case AscDFH.historydescription_Spreadsheet_AddTab                          :
				sString = "Spreadsheet_AddTab                         ";
				break;
			case AscDFH.historydescription_Spreadsheet_AddNewParagraph                 :
				sString = "Spreadsheet_AddNewParagraph                ";
				break;
			case AscDFH.historydescription_Spreadsheet_AddSpace                        :
				sString = "Spreadsheet_AddSpace                       ";
				break;
			case AscDFH.historydescription_Spreadsheet_AddItem                         :
				sString = "Spreadsheet_AddItem                        ";
				break;
			case AscDFH.historydescription_Spreadsheet_PutPrLineSpacing                :
				sString = "Spreadsheet_PutPrLineSpacing               ";
				break;
			case AscDFH.historydescription_Spreadsheet_SetParagraphSpacing             :
				sString = "Spreadsheet_SetParagraphSpacing            ";
				break;
			case AscDFH.historydescription_Spreadsheet_SetGraphicObjectsProps          :
				sString = "Spreadsheet_SetGraphicObjectsProps         ";
				break;
			case AscDFH.historydescription_Spreadsheet_ParaApply                       :
				sString = "Spreadsheet_ParaApply                      ";
				break;
			case AscDFH.historydescription_Spreadsheet_GraphicObjectLayer              :
				sString = "Spreadsheet_GraphicObjectLayer             ";
				break;
			case AscDFH.historydescription_Spreadsheet_ParagraphAdd                    :
				sString = "Spreadsheet_ParagraphAdd                   ";
				break;
			case AscDFH.historydescription_Spreadsheet_CreateGroup                     :
				sString = "Spreadsheet_CreateGroup                    ";
				break;
			case AscDFH.historydescription_CommonDrawings_ChangeAdj                    :
				sString = "CommonDrawings_ChangeAdj                   ";
				break;
			case AscDFH.historydescription_CommonDrawings_EndTrack                     :
				sString = "CommonDrawings_EndTrack                    ";
				break;
			case AscDFH.historydescription_CommonDrawings_CopyCtrl                     :
				sString = "CommonDrawings_CopyCtrl                    ";
				break;
			case AscDFH.historydescription_Presentation_ParaApply                      :
				sString = "Presentation_ParaApply                     ";
				break;
			case AscDFH.historydescription_Presentation_ParaFormatPaste                :
				sString = "Presentation_ParaFormatPaste               ";
				break;
			case AscDFH.historydescription_Presentation_AddNewParagraph                :
				sString = "Presentation_AddNewParagraph               ";
				break;
			case AscDFH.historydescription_Presentation_CreateGroup                    :
				sString = "Presentation_CreateGroup                   ";
				break;
			case AscDFH.historydescription_Presentation_UnGroup                        :
				sString = "Presentation_UnGroup                       ";
				break;
			case AscDFH.historydescription_Presentation_AddChart                       :
				sString = "Presentation_AddChart                      ";
				break;
			case AscDFH.historydescription_Presentation_EditChart                      :
				sString = "Presentation_EditChart                     ";
				break;
			case AscDFH.historydescription_Presentation_ParagraphAdd                   :
				sString = "Presentation_ParagraphAdd                  ";
				break;
			case AscDFH.historydescription_Presentation_ParagraphClearFormatting       :
				sString = "Presentation_ParagraphClearFormatting      ";
				break;
			case AscDFH.historydescription_Presentation_SetParagraphAlign              :
				sString = "Presentation_SetParagraphAlign             ";
				break;
			case AscDFH.historydescription_Presentation_SetParagraphSpacing            :
				sString = "Presentation_SetParagraphSpacing           ";
				break;
			case AscDFH.historydescription_Presentation_SetParagraphTabs               :
				sString = "Presentation_SetParagraphTabs              ";
				break;
			case AscDFH.historydescription_Presentation_SetParagraphIndent             :
				sString = "Presentation_SetParagraphIndent            ";
				break;
			case AscDFH.historydescription_Presentation_SetParagraphNumbering          :
				sString = "Presentation_SetParagraphNumbering         ";
				break;
			case AscDFH.historydescription_Presentation_ParagraphIncDecFontSize        :
				sString = "Presentation_ParagraphIncDecFontSize       ";
				break;
			case AscDFH.historydescription_Presentation_ParagraphIncDecIndent          :
				sString = "Presentation_ParagraphIncDecIndent         ";
				break;
			case AscDFH.historydescription_Presentation_SetImageProps                  :
				sString = "Presentation_SetImageProps                 ";
				break;
			case AscDFH.historydescription_Presentation_SetShapeProps                  :
				sString = "Presentation_SetShapeProps                 ";
				break;
			case AscDFH.historydescription_Presentation_ChartApply                     :
				sString = "Presentation_ChartApply                    ";
				break;
			case AscDFH.historydescription_Presentation_ChangeShapeType                :
				sString = "Presentation_ChangeShapeType               ";
				break;
			case AscDFH.historydescription_Presentation_SetVerticalAlign               :
				sString = "Presentation_SetVerticalAlign              ";
				break;
			case AscDFH.historydescription_Presentation_HyperlinkAdd                   :
				sString = "Presentation_HyperlinkAdd                  ";
				break;
			case AscDFH.historydescription_Presentation_HyperlinkModify                :
				sString = "Presentation_HyperlinkModify               ";
				break;
			case AscDFH.historydescription_Presentation_HyperlinkRemove                :
				sString = "Presentation_HyperlinkRemove               ";
				break;
			case AscDFH.historydescription_Presentation_DistHor                        :
				sString = "Presentation_DistHor                       ";
				break;
			case AscDFH.historydescription_Presentation_DistVer                        :
				sString = "Presentation_DistVer                       ";
				break;
			case AscDFH.historydescription_Presentation_BringToFront                   :
				sString = "Presentation_BringToFront                  ";
				break;
			case AscDFH.historydescription_Presentation_BringForward                   :
				sString = "Presentation_BringForward                  ";
				break;
			case AscDFH.historydescription_Presentation_SendToBack                     :
				sString = "Presentation_SendToBack                    ";
				break;
			case AscDFH.historydescription_Presentation_BringBackward                  :
				sString = "Presentation_BringBackward                 ";
				break;
			case AscDFH.historydescription_Presentation_ApplyTiming                    :
				sString = "Presentation_ApplyTiming                   ";
				break;
			case AscDFH.historydescription_Presentation_MoveSlidesToEnd                :
				sString = "Presentation_MoveSlidesToEnd               ";
				break;
			case AscDFH.historydescription_Presentation_MoveSlidesNextPos              :
				sString = "Presentation_MoveSlidesNextPos             ";
				break;
			case AscDFH.historydescription_Presentation_MoveSlidesPrevPos              :
				sString = "Presentation_MoveSlidesPrevPos             ";
				break;
			case AscDFH.historydescription_Presentation_MoveSlidesToStart              :
				sString = "Presentation_MoveSlidesToStart             ";
				break;
			case AscDFH.historydescription_Presentation_MoveComments                   :
				sString = "Presentation_MoveComments                  ";
				break;
			case AscDFH.historydescription_Presentation_TableBorder                    :
				sString = "Presentation_TableBorder                   ";
				break;
			case AscDFH.historydescription_Presentation_AddFlowImage                   :
				sString = "Presentation_AddFlowImage                  ";
				break;
			case AscDFH.historydescription_Presentation_AddFlowTable                   :
				sString = "Presentation_AddFlowTable                  ";
				break;
			case AscDFH.historydescription_Presentation_ChangeBackground               :
				sString = "Presentation_ChangeBackground              ";
				break;
			case AscDFH.historydescription_Presentation_AddNextSlide                   :
				sString = "Presentation_AddNextSlide                  ";
				break;
			case AscDFH.historydescription_Presentation_ShiftSlides                    :
				sString = "Presentation_ShiftSlides                   ";
				break;
			case AscDFH.historydescription_Presentation_DeleteSlides                   :
				sString = "Presentation_DeleteSlides                  ";
				break;
			case AscDFH.historydescription_Presentation_ChangeLayout                   :
				sString = "Presentation_ChangeLayout                  ";
				break;
			case AscDFH.historydescription_Presentation_ChangeSlideSize                :
				sString = "Presentation_ChangeSlideSize               ";
				break;
			case AscDFH.historydescription_Presentation_ChangeColorScheme              :
				sString = "Presentation_ChangeColorScheme             ";
				break;
			case AscDFH.historydescription_Presentation_AddComment                     :
				sString = "Presentation_AddComment                    ";
				break;
			case AscDFH.historydescription_Presentation_ChangeComment                  :
				sString = "Presentation_ChangeComment                 ";
				break;
			case AscDFH.historydescription_Presentation_PutTextPrFontName              :
				sString = "Presentation_PutTextPrFontName             ";
				break;
			case AscDFH.historydescription_Presentation_PutTextPrFontSize              :
				sString = "Presentation_PutTextPrFontSize             ";
				break;
			case AscDFH.historydescription_Presentation_PutTextPrBold                  :
				sString = "Presentation_PutTextPrBold                 ";
				break;
			case AscDFH.historydescription_Presentation_PutTextPrItalic                :
				sString = "Presentation_PutTextPrItalic               ";
				break;
			case AscDFH.historydescription_Presentation_PutTextPrUnderline             :
				sString = "Presentation_PutTextPrUnderline            ";
				break;
			case AscDFH.historydescription_Presentation_PutTextPrStrikeout             :
				sString = "Presentation_PutTextPrStrikeout            ";
				break;
			case AscDFH.historydescription_Presentation_PutTextPrLineSpacing           :
				sString = "Presentation_PutTextPrLineSpacing          ";
				break;
			case AscDFH.historydescription_Presentation_PutTextPrSpacingBeforeAfter    :
				sString = "Presentation_PutTextPrSpacingBeforeAfter   ";
				break;
			case AscDFH.historydescription_Presentation_PutTextPrIncreaseFontSize      :
				sString = "Presentation_PutTextPrIncreaseFontSize     ";
				break;
			case AscDFH.historydescription_Presentation_PutTextPrDecreaseFontSize      :
				sString = "Presentation_PutTextPrDecreaseFontSize     ";
				break;
			case AscDFH.historydescription_Presentation_PutTextPrAlign                 :
				sString = "Presentation_PutTextPrAlign                ";
				break;
			case AscDFH.historydescription_Presentation_PutTextPrBaseline              :
				sString = "Presentation_PutTextPrBaseline             ";
				break;
			case AscDFH.historydescription_Presentation_PutTextPrListType              :
				sString = "Presentation_PutTextPrListType             ";
				break;
			case AscDFH.historydescription_Presentation_PutTextColor                   :
				sString = "Presentation_PutTextColor                  ";
				break;
			case AscDFH.historydescription_Presentation_PutTextColor2                  :
				sString = "Presentation_PutTextColor2                 ";
				break;
			case AscDFH.historydescription_Presentation_PutPrIndent                    :
				sString = "Presentation_PutPrIndent                   ";
				break;
			case AscDFH.historydescription_Presentation_PutPrIndentRight               :
				sString = "Presentation_PutPrIndentRight              ";
				break;
			case AscDFH.historydescription_Presentation_PutPrFirstLineIndent           :
				sString = "Presentation_PutPrFirstLineIndent          ";
				break;
			case AscDFH.historydescription_Presentation_AddPageBreak                   :
				sString = "Presentation_AddPageBreak                  ";
				break;
			case AscDFH.historydescription_Presentation_AddRowAbove                    :
				sString = "Presentation_AddRowAbove                   ";
				break;
			case AscDFH.historydescription_Presentation_AddRowBelow                    :
				sString = "Presentation_AddRowBelow                   ";
				break;
			case AscDFH.historydescription_Presentation_AddColLeft                     :
				sString = "Presentation_AddColLeft                    ";
				break;
			case AscDFH.historydescription_Presentation_AddColRight                    :
				sString = "Presentation_AddColRight                   ";
				break;
			case AscDFH.historydescription_Presentation_RemoveRow                      :
				sString = "Presentation_RemoveRow                     ";
				break;
			case AscDFH.historydescription_Presentation_RemoveCol                      :
				sString = "Presentation_RemoveCol                     ";
				break;
			case AscDFH.historydescription_Presentation_RemoveTable                    :
				sString = "Presentation_RemoveTable                   ";
				break;
			case AscDFH.historydescription_Presentation_MergeCells                     :
				sString = "Presentation_MergeCells                    ";
				break;
			case AscDFH.historydescription_Presentation_SplitCells                     :
				sString = "Presentation_SplitCells                    ";
				break;
			case AscDFH.historydescription_Presentation_TblApply                       :
				sString = "Presentation_TblApply                      ";
				break;
			case AscDFH.historydescription_Presentation_RemoveComment                  :
				sString = "Presentation_RemoveComment                 ";
				break;
			case AscDFH.historydescription_Presentation_EndFontLoad                    :
				sString = "Presentation_EndFontLoad                   ";
				break;
			case AscDFH.historydescription_Presentation_ChangeTheme                    :
				sString = "Presentation_ChangeTheme                   ";
				break;
			case AscDFH.historydescription_Presentation_TableMoveFromRulers            :
				sString = "Presentation_TableMoveFromRulers           ";
				break;
			case AscDFH.historydescription_Presentation_TableMoveFromRulersInline      :
				sString = "Presentation_TableMoveFromRulersInline     ";
				break;
			case AscDFH.historydescription_Presentation_PasteOnThumbnails              :
				sString = "Presentation_PasteOnThumbnails             ";
				break;
			case AscDFH.historydescription_Presentation_PasteOnThumbnailsSafari        :
				sString = "Presentation_PasteOnThumbnailsSafari       ";
				break;
			case AscDFH.historydescription_Document_ConvertOldEquation                 :
				sString = "Document_ConvertOldEquation                ";
				break;
			case AscDFH.historydescription_Document_AddNewStyle                        :
				sString = "Document_AddNewStyle                       ";
				break;
			case AscDFH.historydescription_Document_RemoveStyle                        :
				sString = "Document_RemoveStyle                       ";
				break;
			case AscDFH.historydescription_Document_AddTextArt                         :
				sString = "Document_AddTextArt                        ";
				break;
			case AscDFH.historydescription_Document_RemoveAllCustomStyles              :
				sString = "Document_RemoveAllCustomStyles             ";
				break;
			case AscDFH.historydescription_Document_AcceptAllRevisionChanges           :
				sString = "Document_AcceptAllRevisionChanges          ";
				break;
			case AscDFH.historydescription_Document_RejectAllRevisionChanges           :
				sString = "Document_RejectAllRevisionChanges          ";
				break;
			case AscDFH.historydescription_Document_AcceptRevisionChange               :
				sString = "Document_AcceptRevisionChange              ";
				break;
			case AscDFH.historydescription_Document_RejectRevisionChange               :
				sString = "Document_RejectRevisionChange              ";
				break;
			case AscDFH.historydescription_Document_AcceptRevisionChangesBySelection   :
				sString = "Document_AcceptRevisionChangesBySelection  ";
				break;
			case AscDFH.historydescription_Document_RejectRevisionChangesBySelection   :
				sString = "Document_RejectRevisionChangesBySelection  ";
				break;
			case AscDFH.historydescription_Document_AddLetterUnion                     :
				sString = "Document_AddLetterUnion                    ";
				break;
			case AscDFH.historydescription_Document_SetColumnsFromRuler                :
				sString = "Document_SetColumnsFromRuler               ";
				break;
			case AscDFH.historydescription_Document_SetColumnsProps                    :
				sString = "Document_SetColumnsProps                   ";
				break;
			case AscDFH.historydescription_Document_AddColumnBreak                     :
				sString = "Document_AddColumnBreak                    ";
				break;
			case AscDFH.historydescription_Document_AddTabToMath                       :
				sString = "Document_AddTabToMath                      ";
				break;
			case AscDFH.historydescription_Document_ApplyPrToMath:
				sString = "Document_ApplyPrToMath                     ";
				break;
			case AscDFH.historydescription_Document_SetMathProps:
				sString = "Document_SetMathProps                      ";
				break;
			case AscDFH.historydescription_Document_SetSectionProps:
				sString = "Document_SetColumnsProps                   ";
				break;
			case AscDFH.historydescription_Document_ApiBuilder:
				sString = "Document_ApiBuilder                        ";
				break;
			case AscDFH.historydescription_Document_AddOleObject:
				sString = "Document_AddOleObject                      ";
				break;
			case AscDFH.historydescription_Document_EditOleObject:
				sString = "Document_EditOleObject                     ";
				break;
			case AscDFH.historydescription_Document_CompositeInput:
				sString = "Document_CompositeInput                    ";
				break;
		}
		return sString;
	}

	//------------------------------------------------------------export--------------------------------------------------
	window['AscDFH']                                   = window['AscDFH'] || {};
	window['AscDFH'].Get_HistoryPointStringDescription = Get_HistoryPointStringDescription;

	window['AscDFH'].historyitem_ChartFormatSetChart                 = 1001;
	window['AscDFH'].historyitem_AutoShapes_SetDrawingBaseCoors      = 1000;
	window['AscDFH'].historyitem_AutoShapes_SetWorksheet             = 1002;
	window['AscDFH'].historyitem_AutoShapes_AddToDrawingObjects      = 1003;
	window['AscDFH'].historyitem_AutoShapes_RemoveFromDrawingObjects = 1004;
	window['AscDFH'].historyitem_AutoShapes_SetBFromSerialize        = 1009;
	window['AscDFH'].historyitem_AutoShapes_SetLocks                 = 1010;
	window['AscDFH'].historyitem_CommonChart_RemoveSeries            = 1005;
	window['AscDFH'].historyitem_CommonSeries_RemoveDPt              = 1006;
	window['AscDFH'].historyitem_CommonLit_RemoveDPt                 = 1007;
	window['AscDFH'].historyitem_CommonChartFormat_SetParent         = 1008;
	window['AscDFH'].historyitem_ColorMod_SetName                    = 2001;
	window['AscDFH'].historyitem_ColorMod_SetVal                     = 2002;
	window['AscDFH'].historyitem_ColorModifiers_AddColorMod          = 2003;
	window['AscDFH'].historyitem_ColorModifiers_RemoveColorMod       = 2004;
	window['AscDFH'].historyitem_SysColor_SetId                      = 2004;
	window['AscDFH'].historyitem_SysColor_SetR                       = 2005;
	window['AscDFH'].historyitem_SysColor_SetG                       = 2006;
	window['AscDFH'].historyitem_SysColor_SetB                       = 2007;
	window['AscDFH'].historyitem_PrstColor_SetId                     = 2005;
	window['AscDFH'].historyitem_RGBColor_SetColor                   = 2006;
	window['AscDFH'].historyitem_SchemeColor_SetId                   = 2007;
	window['AscDFH'].historyitem_UniColor_SetColor                   = 2008;
	window['AscDFH'].historyitem_UniColor_SetMods                    = 2009;
	window['AscDFH'].historyitem_SrcRect_SetLTRB                     = 2010;
	window['AscDFH'].historyitem_BlipFill_SetRasterImageId           = 2011;
	window['AscDFH'].historyitem_BlipFill_SetVectorImageBin          = 2012;
	window['AscDFH'].historyitem_BlipFill_SetSrcRect                 = 2013;
	window['AscDFH'].historyitem_BlipFill_SetStretch                 = 2014;
	window['AscDFH'].historyitem_BlipFill_SetTile                    = 2015;
	window['AscDFH'].historyitem_BlipFill_SetRotWithShape            = 2016;
	window['AscDFH'].historyitem_SolidFill_SetColor                  = 2017;
	window['AscDFH'].historyitem_Gs_SetColor                         = 2018;
	window['AscDFH'].historyitem_Gs_SetPos                           = 2019;
	window['AscDFH'].historyitem_GradLin_SetAngle                    = 2020;
	window['AscDFH'].historyitem_GradLin_SetScale                    = 2021;
	window['AscDFH'].historyitem_GradPath_SetPath                    = 2022;
	window['AscDFH'].historyitem_GradPath_SetRect                    = 2023;
	window['AscDFH'].historyitem_GradFill_AddColor                   = 2024;
	window['AscDFH'].historyitem_GradFill_SetLin                     = 2025;
	window['AscDFH'].historyitem_GradFill_SetPath                    = 2026;
	window['AscDFH'].historyitem_PathFill_SetFType                   = 2027;
	window['AscDFH'].historyitem_PathFill_SetFgClr                   = 2028;
	window['AscDFH'].historyitem_PathFill_SetBgClr                   = 2029;
	window['AscDFH'].historyitem_UniFill_SetFill                     = 2030;
	window['AscDFH'].historyitem_UniFill_SetTransparent              = 2031;
	window['AscDFH'].historyitem_EndArrow_SetType                    = 2032;
	window['AscDFH'].historyitem_EndArrow_SetLen                     = 2033;
	window['AscDFH'].historyitem_EndArrow_SetW                       = 2034;
	window['AscDFH'].historyitem_LineJoin_SetType                    = 2035;
	window['AscDFH'].historyitem_LineJoin_SetLimit                   = 2036;
	window['AscDFH'].historyitem_Ln_SetFill                          = 2037;
	window['AscDFH'].historyitem_Ln_SetPrstDash                      = 2038;
	window['AscDFH'].historyitem_Ln_SetJoin                          = 2040;
	window['AscDFH'].historyitem_Ln_SetHeadEnd                       = 2041;
	window['AscDFH'].historyitem_Ln_SetTailEnd                       = 2042;
	window['AscDFH'].historyitem_Ln_SetAlgn                          = 2043;
	window['AscDFH'].historyitem_Ln_SetCap                           = 2044;
	window['AscDFH'].historyitem_Ln_SetCmpd                          = 2046;
	window['AscDFH'].historyitem_Ln_SetW                             = 2047;
	window['AscDFH'].historyitem_DefaultShapeDefinition_SetSpPr      = 2048;
	window['AscDFH'].historyitem_DefaultShapeDefinition_SetBodyPr    = 2049;
	window['AscDFH'].historyitem_DefaultShapeDefinition_SetLstStyle  = 2050;
	window['AscDFH'].historyitem_DefaultShapeDefinition_SetStyle     = 2051;
	window['AscDFH'].historyitem_CNvPr_SetId                         = 2052;
	window['AscDFH'].historyitem_CNvPr_SetName                       = 2053;
	window['AscDFH'].historyitem_CNvPr_SetIsHidden                   = 2054;
	window['AscDFH'].historyitem_NvPr_SetIsPhoto                     = 2055;
	window['AscDFH'].historyitem_NvPr_SetUserDrawn                   = 2056;
	window['AscDFH'].historyitem_NvPr_SetPh                          = 2057;
	window['AscDFH'].historyitem_Ph_SetHasCustomPrompt               = 2058;
	window['AscDFH'].historyitem_Ph_SetIdx                           = 2059;
	window['AscDFH'].historyitem_Ph_SetOrient                        = 2060;
	window['AscDFH'].historyitem_Ph_SetSz                            = 2061;
	window['AscDFH'].historyitem_Ph_SetType                          = 2062;
	window['AscDFH'].historyitem_UniNvPr_SetCNvPr                    = 2063;
	window['AscDFH'].historyitem_UniNvPr_SetUniPr                    = 2064;
	window['AscDFH'].historyitem_UniNvPr_SetNvPr                     = 2065;
	window['AscDFH'].historyitem_StyleRef_SetIdx                     = 2066;
	window['AscDFH'].historyitem_StyleRef_SetColor                   = 2067;
	window['AscDFH'].historyitem_FontRef_SetIdx                      = 2068;
	window['AscDFH'].historyitem_FontRef_SetColor                    = 2069;
	window['AscDFH'].historyitem_Chart_SetAutoTitleDeleted           = 2070;
	window['AscDFH'].historyitem_Chart_SetBackWall                   = 2071;
	window['AscDFH'].historyitem_Chart_SetDispBlanksAs               = 2072;
	window['AscDFH'].historyitem_Chart_SetFloor                      = 2073;
	window['AscDFH'].historyitem_Chart_SetLegend                     = 2074;
	window['AscDFH'].historyitem_Chart_AddPivotFmt                   = 2075;
	window['AscDFH'].historyitem_Chart_SetPlotArea                   = 2076;
	window['AscDFH'].historyitem_Chart_SetPlotVisOnly                = 2077;
	window['AscDFH'].historyitem_Chart_SetShowDLblsOverMax           = 2078;
	window['AscDFH'].historyitem_Chart_SetSideWall                   = 2079;
	window['AscDFH'].historyitem_Chart_SetTitle                      = 2080;
	window['AscDFH'].historyitem_Chart_SetView3D                     = 2081;
	window['AscDFH'].historyitem_ChartSpace_SetChart                 = 2082;
	window['AscDFH'].historyitem_ChartSpace_SetClrMapOvr             = 2083;
	window['AscDFH'].historyitem_ChartSpace_SetDate1904              = 2084;
	window['AscDFH'].historyitem_ChartSpace_SetExternalData          = 2085;
	window['AscDFH'].historyitem_ChartSpace_SetLang                  = 2086;
	window['AscDFH'].historyitem_ChartSpace_SetPivotSource           = 2087;
	window['AscDFH'].historyitem_ChartSpace_SetPrintSettings         = 2088;
	window['AscDFH'].historyitem_ChartSpace_SetProtection            = 2089;
	window['AscDFH'].historyitem_ChartSpace_SetRoundedCorners        = 2090;
	window['AscDFH'].historyitem_ChartSpace_SetSpPr                  = 2091;
	window['AscDFH'].historyitem_ChartSpace_SetStyle                 = 2092;
	window['AscDFH'].historyitem_ChartSpace_SetTxPr                  = 2093;
	window['AscDFH'].historyitem_ChartSpace_SetUserShapes            = 2094;
	window['AscDFH'].historyitem_ChartSpace_SetThemeOverride         = 2095;
	window['AscDFH'].historyitem_ChartSpace_SetGroup                 = 2096;
	window['AscDFH'].historyitem_ChartSpace_SetParent                = 2097;
	window['AscDFH'].historyitem_ChartSpace_SetNvGrFrProps           = 2098;
	window['AscDFH'].historyitem_Legend_SetLayout                    = 2095;
	window['AscDFH'].historyitem_Legend_AddLegendEntry               = 2096;
	window['AscDFH'].historyitem_Legend_SetLegendPos                 = 2097;
	window['AscDFH'].historyitem_Legend_SetOverlay                   = 2098;
	window['AscDFH'].historyitem_Legend_SetSpPr                      = 2099;
	window['AscDFH'].historyitem_Legend_SetTxPr                      = 2100;
	window['AscDFH'].historyitem_Layout_SetH                         = 2101;
	window['AscDFH'].historyitem_Layout_SetHMode                     = 2102;
	window['AscDFH'].historyitem_Layout_SetLayoutTarget              = 2103;
	window['AscDFH'].historyitem_Layout_SetW                         = 2103;
	window['AscDFH'].historyitem_Layout_SetWMode                     = 2104;
	window['AscDFH'].historyitem_Layout_SetX                         = 2105;
	window['AscDFH'].historyitem_Layout_SetXMode                     = 2105;
	window['AscDFH'].historyitem_Layout_SetY                         = 2106;
	window['AscDFH'].historyitem_Layout_SetYMode                     = 2107;
	window['AscDFH'].historyitem_LegendEntry_SetDelete               = 2108;
	window['AscDFH'].historyitem_LegendEntry_SetIdx                  = 2109;
	window['AscDFH'].historyitem_LegendEntry_SetTxPr                 = 2110;
	window['AscDFH'].historyitem_PivotFmt_SetDLbl                    = 2110;
	window['AscDFH'].historyitem_PivotFmt_SetIdx                     = 2111;
	window['AscDFH'].historyitem_PivotFmt_SetMarker                  = 2112;
	window['AscDFH'].historyitem_PivotFmt_SetSpPr                    = 2113;
	window['AscDFH'].historyitem_PivotFmt_SetTxPr                    = 2114;
	window['AscDFH'].historyitem_DLbl_SetDelete                      = 2115;
	window['AscDFH'].historyitem_DLbl_SetDLblPos                     = 2116;
	window['AscDFH'].historyitem_DLbl_SetIdx                         = 2117;
	window['AscDFH'].historyitem_DLbl_SetLayout                      = 2118;
	window['AscDFH'].historyitem_DLbl_SetNumFmt                      = 2119;
	window['AscDFH'].historyitem_DLbl_SetSeparator                   = 2120;
	window['AscDFH'].historyitem_DLbl_SetShowBubbleSize              = 2121;
	window['AscDFH'].historyitem_DLbl_SetShowCatName                 = 2122;
	window['AscDFH'].historyitem_DLbl_SetShowLegendKey               = 2123;
	window['AscDFH'].historyitem_DLbl_SetShowPercent                 = 2124;
	window['AscDFH'].historyitem_DLbl_SetShowSerName                 = 2125;
	window['AscDFH'].historyitem_DLbl_SetShowVal                     = 2126;
	window['AscDFH'].historyitem_DLbl_SetSpPr                        = 2127;
	window['AscDFH'].historyitem_DLbl_SetTx                          = 2128;
	window['AscDFH'].historyitem_DLbl_SetTxPr                        = 2129;
	window['AscDFH'].historyitem_Marker_SetSize                      = 2130;
	window['AscDFH'].historyitem_Marker_SetSpPr                      = 2131;
	window['AscDFH'].historyitem_Marker_SetSymbol                    = 2132;
	window['AscDFH'].historyitem_PlotArea_AddChart                   = 2133;
	window['AscDFH'].historyitem_PlotArea_SetCatAx                   = 2134;
	window['AscDFH'].historyitem_PlotArea_SetDateAx                  = 2135;
	window['AscDFH'].historyitem_PlotArea_SetDTable                  = 2136;
	window['AscDFH'].historyitem_PlotArea_SetLayout                  = 2137;
	window['AscDFH'].historyitem_PlotArea_SetSerAx                   = 2138;
	window['AscDFH'].historyitem_PlotArea_SetSpPr                    = 2139;
	window['AscDFH'].historyitem_PlotArea_SetValAx                   = 2140;
	window['AscDFH'].historyitem_PlotArea_AddAxis                    = 2141;
	window['AscDFH'].historyitem_PlotArea_RemoveChart                = 2142;
	window['AscDFH'].historyitem_PlotArea_RemoveAxis                 = 2143;
	window['AscDFH'].historyitem_NumFmt_SetFormatCode                = 2171;
	window['AscDFH'].historyitem_NumFmt_SetSourceLinked              = 2172;
	window['AscDFH'].historyitem_Scaling_SetLogBase                  = 2173;
	window['AscDFH'].historyitem_Scaling_SetMax                      = 2174;
	window['AscDFH'].historyitem_Scaling_SetMin                      = 2175;
	window['AscDFH'].historyitem_Scaling_SetOrientation              = 2176;
	window['AscDFH'].historyitem_Scaling_SetParent                   = 2177;
	window['AscDFH'].historyitem_DTable_SetShowHorzBorder            = 2177;
	window['AscDFH'].historyitem_DTable_SetShowKeys                  = 2178;
	window['AscDFH'].historyitem_DTable_SetShowOutline               = 2179;
	window['AscDFH'].historyitem_DTable_SetShowVertBorder            = 2180;
	window['AscDFH'].historyitem_DTable_SetSpPr                      = 2181;
	window['AscDFH'].historyitem_DTable_SetTxPr                      = 2182;
	window['AscDFH'].historyitem_LineChart_AddAxId                   = 2183;
	window['AscDFH'].historyitem_LineChart_SetDLbls                  = 2184;
	window['AscDFH'].historyitem_LineChart_SetDropLines              = 2185;
	window['AscDFH'].historyitem_LineChart_SetGrouping               = 2186;
	window['AscDFH'].historyitem_LineChart_SetHiLowLines             = 2187;
	window['AscDFH'].historyitem_LineChart_SetMarker                 = 2188;
	window['AscDFH'].historyitem_LineChart_AddSer                    = 2189;
	window['AscDFH'].historyitem_LineChart_SetSmooth                 = 2190;
	window['AscDFH'].historyitem_LineChart_SetUpDownBars             = 2191;
	window['AscDFH'].historyitem_LineChart_SetVaryColors             = 2192;
	window['AscDFH'].historyitem_DLbls_SetDelete                     = 2193;
	window['AscDFH'].historyitem_DLbls_SetDLbl                       = 2194;
	window['AscDFH'].historyitem_DLbls_SetDLblPos                    = 2195;
	window['AscDFH'].historyitem_DLbls_SetLeaderLines                = 2196;
	window['AscDFH'].historyitem_DLbls_SetNumFmt                     = 2197;
	window['AscDFH'].historyitem_DLbls_SetSeparator                  = 2198;
	window['AscDFH'].historyitem_DLbls_SetShowBubbleSize             = 2199;
	window['AscDFH'].historyitem_DLbls_SetShowCatName                = 2200;
	window['AscDFH'].historyitem_DLbls_SetShowLeaderLines            = 2201;
	window['AscDFH'].historyitem_DLbls_SetShowLegendKey              = 2202;
	window['AscDFH'].historyitem_DLbls_SetShowPercent                = 2203;
	window['AscDFH'].historyitem_DLbls_SetShowSerName                = 2204;
	window['AscDFH'].historyitem_DLbls_SetShowVal                    = 2205;
	window['AscDFH'].historyitem_DLbls_SetSpPr                       = 2206;
	window['AscDFH'].historyitem_DLbls_SetTxPr                       = 2207;
	window['AscDFH'].historyitem_UpDownBars_SetDownBars              = 2208;
	window['AscDFH'].historyitem_UpDownBars_SetGapWidth              = 2209;
	window['AscDFH'].historyitem_UpDownBars_SetUpBars                = 2210;
	window['AscDFH'].historyitem_BarChart_AddAxId                    = 2211;
	window['AscDFH'].historyitem_BarChart_SetBarDir                  = 2212;
	window['AscDFH'].historyitem_BarChart_SetDLbls                   = 2213;
	window['AscDFH'].historyitem_BarChart_SetGapWidth                = 2214;
	window['AscDFH'].historyitem_BarChart_SetGrouping                = 2215;
	window['AscDFH'].historyitem_BarChart_SetOverlap                 = 2216;
	window['AscDFH'].historyitem_BarChart_AddSer                     = 2217;
	window['AscDFH'].historyitem_BarChart_SetSerLines                = 2218;
	window['AscDFH'].historyitem_BarChart_SetVaryColors              = 2219;
	window['AscDFH'].historyitem_BarChart_Set3D                      = 2220;
	window['AscDFH'].historyitem_BarChart_SetGapDepth                = 2221;
	window['AscDFH'].historyitem_BarChart_SetShape                   = 2222;
	window['AscDFH'].historyitem_BubbleChart_AddAxId                 = 2220;
	window['AscDFH'].historyitem_BubbleChart_SetBubble3D             = 2221;
	window['AscDFH'].historyitem_BubbleChart_SetBubbleScale          = 2222;
	window['AscDFH'].historyitem_BubbleChart_SetDLbls                = 2223;
	window['AscDFH'].historyitem_BubbleChart_AddSerie                = 2224;
	window['AscDFH'].historyitem_BubbleChart_SetShowNegBubbles       = 2225;
	window['AscDFH'].historyitem_BubbleChart_SetSizeRepresents       = 2226;
	window['AscDFH'].historyitem_BubbleChart_SetVaryColors           = 2227;
	window['AscDFH'].historyitem_DoughnutChart_SetDLbls              = 2228;
	window['AscDFH'].historyitem_DoughnutChart_SetFirstSliceAng      = 2229;
	window['AscDFH'].historyitem_DoughnutChart_SetHoleSize           = 2230;
	window['AscDFH'].historyitem_DoughnutChart_AddSer                = 2231;
	window['AscDFH'].historyitem_DoughnutChart_SetVaryColor          = 2232;
	window['AscDFH'].historyitem_OfPieChart_AddCustSplit             = 2233;
	window['AscDFH'].historyitem_OfPieChart_SetDLbls                 = 2234;
	window['AscDFH'].historyitem_OfPieChart_SetGapWidth              = 2235;
	window['AscDFH'].historyitem_OfPieChart_SetOfPieType             = 2236;
	window['AscDFH'].historyitem_OfPieChart_SetSecondPieSize         = 2237;
	window['AscDFH'].historyitem_OfPieChart_AddSer                   = 2238;
	window['AscDFH'].historyitem_OfPieChart_SetSerLines              = 2239;
	window['AscDFH'].historyitem_OfPieChart_SetSplitPos              = 2240;
	window['AscDFH'].historyitem_OfPieChart_SetSplitType             = 2241;
	window['AscDFH'].historyitem_OfPieChart_SetVaryColors            = 2242;
	window['AscDFH'].historyitem_PieChart_SetDLbls                   = 2243;
	window['AscDFH'].historyitem_PieChart_SetFirstSliceAng           = 2244;
	window['AscDFH'].historyitem_PieChart_AddSer                     = 2245;
	window['AscDFH'].historyitem_PieChart_SetVaryColors              = 2246;
	window['AscDFH'].historyitem_RadarChart_AddAxId                  = 2247;
	window['AscDFH'].historyitem_RadarChart_SetDLbls                 = 2248;
	window['AscDFH'].historyitem_RadarChart_SetRadarStyle            = 2249;
	window['AscDFH'].historyitem_RadarChart_AddSer                   = 2250;
	window['AscDFH'].historyitem_RadarChart_SetVaryColors            = 2251;
	window['AscDFH'].historyitem_ScatterChart_AddAxId                = 2247;
	window['AscDFH'].historyitem_ScatterChart_SetDLbls               = 2248;
	window['AscDFH'].historyitem_ScatterChart_SetScatterStyle        = 2249;
	window['AscDFH'].historyitem_ScatterChart_AddSer                 = 2250;
	window['AscDFH'].historyitem_ScatterChart_SetVaryColors          = 2251;
	window['AscDFH'].historyitem_StockChart_AddAxId                  = 2252;
	window['AscDFH'].historyitem_StockChart_SetDLbls                 = 2253;
	window['AscDFH'].historyitem_StockChart_SetDropLines             = 2254;
	window['AscDFH'].historyitem_StockChart_SetHiLowLines            = 2255;
	window['AscDFH'].historyitem_StockChart_AddSer                   = 2256;
	window['AscDFH'].historyitem_StockChart_SetUpDownBars            = 2257;
	window['AscDFH'].historyitem_SurfaceChart_AddAxId                = 2258;
	window['AscDFH'].historyitem_SurfaceChart_AddBandFmt             = 2259;
	window['AscDFH'].historyitem_SurfaceChart_AddSer                 = 2260;
	window['AscDFH'].historyitem_SurfaceChart_SetWireframe           = 2261;
	window['AscDFH'].historyitem_BandFmt_SetIdx                      = 2262;
	window['AscDFH'].historyitem_BandFmt_SetSpPr                     = 2263;
	window['AscDFH'].historyitem_AreaChart_AddAxId                   = 2264;
	window['AscDFH'].historyitem_AreaChart_SetDLbls                  = 2265;
	window['AscDFH'].historyitem_AreaChart_SetDropLines              = 2266;
	window['AscDFH'].historyitem_AreaChart_SetGrouping               = 2267;
	window['AscDFH'].historyitem_AreaChart_AddSer                    = 2268;
	window['AscDFH'].historyitem_AreaChart_SetVaryColors             = 2269;
	window['AscDFH'].historyitem_ScatterSer_SetDLbls                 = 2270;
	window['AscDFH'].historyitem_ScatterSer_SetDPt                   = 2271;
	window['AscDFH'].historyitem_ScatterSer_SetErrBars               = 2272;
	window['AscDFH'].historyitem_ScatterSer_SetIdx                   = 2273;
	window['AscDFH'].historyitem_ScatterSer_SetMarker                = 2274;
	window['AscDFH'].historyitem_ScatterSer_SetOrder                 = 2275;
	window['AscDFH'].historyitem_ScatterSer_SetSmooth                = 2276;
	window['AscDFH'].historyitem_ScatterSer_SetSpPr                  = 2277;
	window['AscDFH'].historyitem_ScatterSer_SetTrendline             = 2278;
	window['AscDFH'].historyitem_ScatterSer_SetTx                    = 2279;
	window['AscDFH'].historyitem_ScatterSer_SetXVal                  = 2280;
	window['AscDFH'].historyitem_ScatterSer_SetYVal                  = 2281;
	window['AscDFH'].historyitem_DPt_SetBubble3D                     = 2282;
	window['AscDFH'].historyitem_DPt_SetExplosion                    = 2283;
	window['AscDFH'].historyitem_DPt_SetIdx                          = 2284;
	window['AscDFH'].historyitem_DPt_SetInvertIfNegative             = 2285;
	window['AscDFH'].historyitem_DPt_SetMarker                       = 2286;
	window['AscDFH'].historyitem_DPt_SetPictureOptions               = 2287;
	window['AscDFH'].historyitem_DPt_SetSpPr                         = 2288;
	window['AscDFH'].historyitem_ErrBars_SetErrBarType               = 2289;
	window['AscDFH'].historyitem_ErrBars_SetErrDir                   = 2290;
	window['AscDFH'].historyitem_ErrBars_SetErrValType               = 2291;
	window['AscDFH'].historyitem_ErrBars_SetMinus                    = 2292;
	window['AscDFH'].historyitem_ErrBars_SetNoEndCap                 = 2293;
	window['AscDFH'].historyitem_ErrBars_SetPlus                     = 2294;
	window['AscDFH'].historyitem_ErrBars_SetSpPr                     = 2295;
	window['AscDFH'].historyitem_ErrBars_SetVal                      = 2296;
	window['AscDFH'].historyitem_MinusPlus_SetnNumLit                = 2297;
	window['AscDFH'].historyitem_MinusPlus_SetnNumRef                = 2298;
	window['AscDFH'].historyitem_NumLit_SetFormatCode                = 2299;
	window['AscDFH'].historyitem_NumLit_AddPt                        = 2300;
	window['AscDFH'].historyitem_NumLit_SetPtCount                   = 2301;
	window['AscDFH'].historyitem_NumericPoint_SetFormatCode          = 2302;
	window['AscDFH'].historyitem_NumericPoint_SetIdx                 = 2303;
	window['AscDFH'].historyitem_NumericPoint_SetVal                 = 2304;
	window['AscDFH'].historyitem_NumRef_SetF                         = 2305;
	window['AscDFH'].historyitem_NumRef_SetNumCache                  = 2306;
	window['AscDFH'].historyitem_Trendline_SetBackward               = 2307;
	window['AscDFH'].historyitem_Trendline_SetDispEq                 = 2308;
	window['AscDFH'].historyitem_Trendline_SetDispRSqr               = 2309;
	window['AscDFH'].historyitem_Trendline_SetForward                = 2310;
	window['AscDFH'].historyitem_Trendline_SetIntercept              = 2311;
	window['AscDFH'].historyitem_Trendline_SetName                   = 2312;
	window['AscDFH'].historyitem_Trendline_SetOrder                  = 2313;
	window['AscDFH'].historyitem_Trendline_SetPeriod                 = 2314;
	window['AscDFH'].historyitem_Trendline_SetSpPr                   = 2315;
	window['AscDFH'].historyitem_Trendline_SetTrendlineLbl           = 2316;
	window['AscDFH'].historyitem_Trendline_SetTrendlineType          = 2317;
	window['AscDFH'].historyitem_Tx_SetStrRef                        = 2318;
	window['AscDFH'].historyitem_Tx_SetVal                           = 2319;
	window['AscDFH'].historyitem_StrRef_SetF                         = 2319;
	window['AscDFH'].historyitem_StrRef_SetStrCache                  = 2320;
	window['AscDFH'].historyitem_StrCache_AddPt                      = 2321;
	window['AscDFH'].historyitem_StrCache_SetPtCount                 = 2322;
	window['AscDFH'].historyitem_StrPoint_SetIdx                     = 2323;
	window['AscDFH'].historyitem_StrPoint_SetVal                     = 2324;
	window['AscDFH'].historyitem_XVal_SetMultiLvlStrRef              = 2325;
	window['AscDFH'].historyitem_XVal_SetNumLit                      = 2326;
	window['AscDFH'].historyitem_XVal_SetNumRef                      = 2327;
	window['AscDFH'].historyitem_XVal_SetStrLit                      = 2328;
	window['AscDFH'].historyitem_XVal_SetStrRef                      = 2329;
	window['AscDFH'].historyitem_MultiLvlStrRef_SetF                 = 2330;
	window['AscDFH'].historyitem_MultiLvlStrRef_SetMultiLvlStrCache  = 2331;
	window['AscDFH'].historyitem_MultiLvlStrCache_SetLvl             = 2332;
	window['AscDFH'].historyitem_MultiLvlStrCache_SetPtCount         = 2333;
	window['AscDFH'].historyitem_StringLiteral_SetPt                 = 2334;
	window['AscDFH'].historyitem_StringLiteral_SetPtCount            = 2335;
	window['AscDFH'].historyitem_YVal_SetNumLit                      = 2336;
	window['AscDFH'].historyitem_YVal_SetNumRef                      = 2337;
	window['AscDFH'].historyitem_AreaSeries_SetCat                   = 2338;
	window['AscDFH'].historyitem_AreaSeries_SetDLbls                 = 2339;
	window['AscDFH'].historyitem_AreaSeries_SetDPt                   = 2340;
	window['AscDFH'].historyitem_AreaSeries_SetErrBars               = 2341;
	window['AscDFH'].historyitem_AreaSeries_SetIdx                   = 2342;
	window['AscDFH'].historyitem_AreaSeries_SetOrder                 = 2343;
	window['AscDFH'].historyitem_AreaSeries_SetPictureOptions        = 2344;
	window['AscDFH'].historyitem_AreaSeries_SetSpPr                  = 2345;
	window['AscDFH'].historyitem_AreaSeries_SetTrendline             = 2346;
	window['AscDFH'].historyitem_AreaSeries_SetTx                    = 2347;
	window['AscDFH'].historyitem_AreaSeries_SetVal                   = 2348;
	window['AscDFH'].historyitem_Cat_SetMultiLvlStrRef               = 2347;
	window['AscDFH'].historyitem_Cat_SetNumLit                       = 2348;
	window['AscDFH'].historyitem_Cat_SetNumRef                       = 2349;
	window['AscDFH'].historyitem_Cat_SetStrLit                       = 2350;
	window['AscDFH'].historyitem_Cat_SetStrRef                       = 2351;
	window['AscDFH'].historyitem_PictureOptions_SetApplyToEnd        = 2352;
	window['AscDFH'].historyitem_PictureOptions_SetApplyToFront      = 2353;
	window['AscDFH'].historyitem_PictureOptions_SetApplyToSides      = 2354;
	window['AscDFH'].historyitem_PictureOptions_SetPictureFormat     = 2355;
	window['AscDFH'].historyitem_PictureOptions_SetPictureStackUnit  = 2356;
	window['AscDFH'].historyitem_RadarSeries_SetCat                  = 2357;
	window['AscDFH'].historyitem_RadarSeries_SetDLbls                = 2357;
	window['AscDFH'].historyitem_RadarSeries_SetDPt                  = 2358;
	window['AscDFH'].historyitem_RadarSeries_SetIdx                  = 2359;
	window['AscDFH'].historyitem_RadarSeries_SetMarker               = 2360;
	window['AscDFH'].historyitem_RadarSeries_SetOrder                = 2361;
	window['AscDFH'].historyitem_RadarSeries_SetSpPr                 = 2362;
	window['AscDFH'].historyitem_RadarSeries_SetTx                   = 2363;
	window['AscDFH'].historyitem_RadarSeries_SetVal                  = 2364;
	window['AscDFH'].historyitem_BarSeries_SetCat                    = 2365;
	window['AscDFH'].historyitem_BarSeries_SetDLbls                  = 2366;
	window['AscDFH'].historyitem_BarSeries_SetDPt                    = 2367;
	window['AscDFH'].historyitem_BarSeries_SetErrBars                = 2368;
	window['AscDFH'].historyitem_BarSeries_SetIdx                    = 2369;
	window['AscDFH'].historyitem_BarSeries_SetInvertIfNegative       = 2370;
	window['AscDFH'].historyitem_BarSeries_SetOrder                  = 2371;
	window['AscDFH'].historyitem_BarSeries_SetPictureOptions         = 2372;
	window['AscDFH'].historyitem_BarSeries_SetShape                  = 2373;
	window['AscDFH'].historyitem_BarSeries_SetSpPr                   = 2374;
	window['AscDFH'].historyitem_BarSeries_SetTrendline              = 2375;
	window['AscDFH'].historyitem_BarSeries_SetTx                     = 2376;
	window['AscDFH'].historyitem_BarSeries_SetVal                    = 2377;
	window['AscDFH'].historyitem_LineSeries_SetCat                   = 2378;
	window['AscDFH'].historyitem_LineSeries_SetDLbls                 = 2379;
	window['AscDFH'].historyitem_LineSeries_SetDPt                   = 2380;
	window['AscDFH'].historyitem_LineSeries_SetErrBars               = 2381;
	window['AscDFH'].historyitem_LineSeries_SetIdx                   = 2382;
	window['AscDFH'].historyitem_LineSeries_SetMarker                = 2383;
	window['AscDFH'].historyitem_LineSeries_SetOrder                 = 2384;
	window['AscDFH'].historyitem_LineSeries_SetSmooth                = 2385;
	window['AscDFH'].historyitem_LineSeries_SetSpPr                  = 2386;
	window['AscDFH'].historyitem_LineSeries_SetTrendline             = 2387;
	window['AscDFH'].historyitem_LineSeries_SetTx                    = 2388;
	window['AscDFH'].historyitem_LineSeries_SetVal                   = 2389;
	window['AscDFH'].historyitem_PieSeries_SetCat                    = 2390;
	window['AscDFH'].historyitem_PieSeries_SetDLbls                  = 2391;
	window['AscDFH'].historyitem_PieSeries_SetDPt                    = 2392;
	window['AscDFH'].historyitem_PieSeries_SetExplosion              = 2393;
	window['AscDFH'].historyitem_PieSeries_SetIdx                    = 2394;
	window['AscDFH'].historyitem_PieSeries_SetOrder                  = 2395;
	window['AscDFH'].historyitem_PieSeries_SetSpPr                   = 2396;
	window['AscDFH'].historyitem_PieSeries_SetTx                     = 2397;
	window['AscDFH'].historyitem_PieSeries_SetVal                    = 2398;
	window['AscDFH'].historyitem_SurfaceSeries_SetCat                = 2399;
	window['AscDFH'].historyitem_SurfaceSeries_SetIdx                = 2400;
	window['AscDFH'].historyitem_SurfaceSeries_SetOrder              = 2401;
	window['AscDFH'].historyitem_SurfaceSeries_SetSpPr               = 2402;
	window['AscDFH'].historyitem_SurfaceSeries_SetTx                 = 2403;
	window['AscDFH'].historyitem_SurfaceSeries_SetVal                = 2404;
	window['AscDFH'].historyitem_BubbleSeries_SetBubble3D            = 2405;
	window['AscDFH'].historyitem_BubbleSeries_SetBubbleSize          = 2406;
	window['AscDFH'].historyitem_BubbleSeries_SetDLbls               = 2407;
	window['AscDFH'].historyitem_BubbleSeries_SetDPt                 = 2408;
	window['AscDFH'].historyitem_BubbleSeries_SetErrBars             = 2409;
	window['AscDFH'].historyitem_BubbleSeries_SetIdx                 = 2410;
	window['AscDFH'].historyitem_BubbleSeries_SetInvertIfNegative    = 2411;
	window['AscDFH'].historyitem_BubbleSeries_SetOrder               = 2412;
	window['AscDFH'].historyitem_BubbleSeries_SetSpPr                = 2413;
	window['AscDFH'].historyitem_BubbleSeries_SetTrendline           = 2414;
	window['AscDFH'].historyitem_BubbleSeries_SetTx                  = 2415;
	window['AscDFH'].historyitem_BubbleSeries_SetXVal                = 2416;
	window['AscDFH'].historyitem_BubbleSeries_SetYVal                = 2417;
	window['AscDFH'].historyitem_ExternalData_SetAutoUpdate          = 2418;
	window['AscDFH'].historyitem_ExternalData_SetId                  = 2419;
	window['AscDFH'].historyitem_PivotSource_SetFmtId                = 2420;
	window['AscDFH'].historyitem_PivotSource_SetName                 = 2421;
	window['AscDFH'].historyitem_Protection_SetChartObject           = 2422;
	window['AscDFH'].historyitem_Protection_SetData                  = 2423;
	window['AscDFH'].historyitem_Protection_SetFormatting            = 2424;
	window['AscDFH'].historyitem_Protection_SetSelection             = 2425;
	window['AscDFH'].historyitem_Protection_SetUserInterface         = 2426;
	window['AscDFH'].historyitem_ChartWall_SetPictureOptions         = 2427;
	window['AscDFH'].historyitem_ChartWall_SetSpPr                   = 2428;
	window['AscDFH'].historyitem_ChartWall_SetThickness              = 2429;
	window['AscDFH'].historyitem_View3d_SetDepthPercent              = 2430;
	window['AscDFH'].historyitem_View3d_SetHPercent                  = 2431;
	window['AscDFH'].historyitem_View3d_SetPerspective               = 2432;
	window['AscDFH'].historyitem_View3d_SetRAngAx                    = 2433;
	window['AscDFH'].historyitem_View3d_SetRotX                      = 2434;
	window['AscDFH'].historyitem_View3d_SetRotY                      = 2435;
	window['AscDFH'].historyitem_Title_SetLayout                     = 2436;
	window['AscDFH'].historyitem_Title_SetOverlay                    = 2437;
	window['AscDFH'].historyitem_Title_SetSpPr                       = 2438;
	window['AscDFH'].historyitem_Title_SetTx                         = 2439;
	window['AscDFH'].historyitem_Title_SetTxPr                       = 2440;
	window['AscDFH'].historyitem_ChartText_SetRich                   = 2441;
	window['AscDFH'].historyitem_ChartText_SetStrRef                 = 2442;
	window['AscDFH'].historyitem_ShapeStyle_SetLnRef                 = 2443;
	window['AscDFH'].historyitem_ShapeStyle_SetFillRef               = 2444;
	window['AscDFH'].historyitem_ShapeStyle_SetFontRef               = 2445;
	window['AscDFH'].historyitem_ShapeStyle_SetEffectRef             = 2446;
	window['AscDFH'].historyitem_Xfrm_SetOffX                        = 2446;
	window['AscDFH'].historyitem_Xfrm_SetOffY                        = 2447;
	window['AscDFH'].historyitem_Xfrm_SetExtX                        = 2448;
	window['AscDFH'].historyitem_Xfrm_SetExtY                        = 2449;
	window['AscDFH'].historyitem_Xfrm_SetChOffX                      = 2450;
	window['AscDFH'].historyitem_Xfrm_SetChOffY                      = 2451;
	window['AscDFH'].historyitem_Xfrm_SetChExtX                      = 2452;
	window['AscDFH'].historyitem_Xfrm_SetChExtY                      = 2453;
	window['AscDFH'].historyitem_Xfrm_SetFlipH                       = 2454;
	window['AscDFH'].historyitem_Xfrm_SetFlipV                       = 2455;
	window['AscDFH'].historyitem_Xfrm_SetRot                         = 2456;
	window['AscDFH'].historyitem_Xfrm_SetParent                      = 2457;
	window['AscDFH'].historyitem_SpPr_SetBwMode                      = 2457;
	window['AscDFH'].historyitem_SpPr_SetXfrm                        = 2458;
	window['AscDFH'].historyitem_SpPr_SetGeometry                    = 2459;
	window['AscDFH'].historyitem_SpPr_SetFill                        = 2460;
	window['AscDFH'].historyitem_SpPr_SetLn                          = 2461;
	window['AscDFH'].historyitem_SpPr_SetParent                      = 2462;
	window['AscDFH'].historyitem_ClrScheme_AddClr                    = 2462;
	window['AscDFH'].historyitem_ClrScheme_SetName                   = 2463;
	window['AscDFH'].historyitem_ClrMap_SetClr                       = 2464;

	window['AscDFH'].historyitem_Common_AddWatermark = 100390;

	window['AscDFH'].historyitem_ExtraClrScheme_SetClrScheme = 2465;
	window['AscDFH'].historyitem_ExtraClrScheme_SetClrMap    = 2466;

	window['AscDFH'].historyitem_FontCollection_SetFontScheme         = 2467;
	window['AscDFH'].historyitem_FontCollection_SetLatin              = 2467;
	window['AscDFH'].historyitem_FontCollection_SetEA                 = 2468;
	window['AscDFH'].historyitem_FontCollection_SetCS                 = 2469;
	window['AscDFH'].historyitem_FontScheme_SetName                   = 2470;
	window['AscDFH'].historyitem_FontScheme_SetMajorFont              = 2471;
	window['AscDFH'].historyitem_FontScheme_SetMinorFont              = 2472;
	window['AscDFH'].historyitem_FormatScheme_SetName                 = 2473;
	window['AscDFH'].historyitem_FormatScheme_AddFillToStyleLst       = 2474;
	window['AscDFH'].historyitem_FormatScheme_AddLnToStyleLst         = 2475;
	window['AscDFH'].historyitem_FormatScheme_AddEffectToStyleLst     = 2476;
	window['AscDFH'].historyitem_FormatScheme_AddBgFillToStyleLst     = 2477;
	window['AscDFH'].historyitem_ThemeElements_SetClrScheme           = 2478;
	window['AscDFH'].historyitem_ThemeElements_SetFontScheme          = 2479;
	window['AscDFH'].historyitem_ThemeElements_SetFmtScheme           = 2480;
	window['AscDFH'].historyitem_HF_SetDt                             = 2481;
	window['AscDFH'].historyitem_HF_SetFtr                            = 2482;
	window['AscDFH'].historyitem_HF_SetHdr                            = 2483;
	window['AscDFH'].historyitem_HF_SetSldNum                         = 2484;
	window['AscDFH'].historyitem_BgPr_SetFill                         = 2485;
	window['AscDFH'].historyitem_BgPr_SetShadeToTitle                 = 2486;
	window['AscDFH'].historyitem_BgSetBwMode                          = 2487;
	window['AscDFH'].historyitem_BgSetBgPr                            = 2488;
	window['AscDFH'].historyitem_BgSetBgRef                           = 2489;
	window['AscDFH'].historyitem_PrintSettingsSetHeaderFooter         = 2490;
	window['AscDFH'].historyitem_PrintSettingsSetPageMargins          = 2491;
	window['AscDFH'].historyitem_PrintSettingsSetPageSetup            = 2492;
	window['AscDFH'].historyitem_HeaderFooterChartSetAlignWithMargins = 2493;
	window['AscDFH'].historyitem_HeaderFooterChartSetDifferentFirst   = 2494;
	window['AscDFH'].historyitem_HeaderFooterChartSetDifferentOddEven = 2495;
	window['AscDFH'].historyitem_HeaderFooterChartSetEvenFooter       = 2496;
	window['AscDFH'].historyitem_HeaderFooterChartSetEvenHeader       = 2497;
	window['AscDFH'].historyitem_HeaderFooterChartSetFirstFooter      = 2498;
	window['AscDFH'].historyitem_HeaderFooterChartSetFirstHeader      = 2499;
	window['AscDFH'].historyitem_HeaderFooterChartSetOddFooter        = 2500;
	window['AscDFH'].historyitem_HeaderFooterChartSetOddHeader        = 2501;
	window['AscDFH'].historyitem_PageMarginsSetB                      = 2502;
	window['AscDFH'].historyitem_PageMarginsSetFooter                 = 2503;
	window['AscDFH'].historyitem_PageMarginsSetHeader                 = 2504;
	window['AscDFH'].historyitem_PageMarginsSetL                      = 2505;
	window['AscDFH'].historyitem_PageMarginsSetR                      = 2506;
	window['AscDFH'].historyitem_PageMarginsSetT                      = 2507;
	window['AscDFH'].historyitem_PageSetupSetBlackAndWhite            = 2508;
	window['AscDFH'].historyitem_PageSetupSetCopies                   = 2509;
	window['AscDFH'].historyitem_PageSetupSetDraft                    = 2510;
	window['AscDFH'].historyitem_PageSetupSetFirstPageNumber          = 2511;
	window['AscDFH'].historyitem_PageSetupSetHorizontalDpi            = 2512;
	window['AscDFH'].historyitem_PageSetupSetOrientation              = 2513;
	window['AscDFH'].historyitem_PageSetupSetPaperHeight              = 2514;
	window['AscDFH'].historyitem_PageSetupSetPaperSize                = 2515;
	window['AscDFH'].historyitem_PageSetupSetPaperWidth               = 2516;
	window['AscDFH'].historyitem_PageSetupSetUseFirstPageNumb         = 2517;
	window['AscDFH'].historyitem_PageSetupSetVerticalDpi              = 2518;

	window['AscDFH'].historyitem_ShapeSetBDeleted           = 2518;
	window['AscDFH'].historyitem_ShapeSetNvSpPr             = 2519;
	window['AscDFH'].historyitem_ShapeSetSpPr               = 2520;
	window['AscDFH'].historyitem_ShapeSetStyle              = 2521;
	window['AscDFH'].historyitem_ShapeSetTxBody             = 2522;
	window['AscDFH'].historyitem_ShapeSetTextBoxContent     = 2523;
	window['AscDFH'].historyitem_ShapeSetParent             = 2524;
	window['AscDFH'].historyitem_ShapeSetGroup              = 2525;
	window['AscDFH'].historyitem_ShapeSetBodyPr             = 2526;
	window['AscDFH'].historyitem_ShapeSetWordShape          = 2527;
	window['AscDFH'].historyitem_DispUnitsSetBuiltInUnit    = 2526;
	window['AscDFH'].historyitem_DispUnitsSetCustUnit       = 2527;
	window['AscDFH'].historyitem_DispUnitsSetDispUnitsLbl   = 2528;
	window['AscDFH'].historyitem_DispUnitsSetParent         = 2529;
	window['AscDFH'].historyitem_GroupShapeSetNvGrpSpPr     = 2529;
	window['AscDFH'].historyitem_GroupShapeSetSpPr          = 2530;
	window['AscDFH'].historyitem_GroupShapeAddToSpTree      = 2531;
	window['AscDFH'].historyitem_GroupShapeSetParent        = 2532;
	window['AscDFH'].historyitem_GroupShapeSetGroup         = 2533;
	window['AscDFH'].historyitem_GroupShapeRemoveFromSpTree = 2534;
	window['AscDFH'].historyitem_ImageShapeSetNvPicPr       = 2535;
	window['AscDFH'].historyitem_ImageShapeSetSpPr          = 2536;
	window['AscDFH'].historyitem_ImageShapeSetBlipFill      = 2537;
	window['AscDFH'].historyitem_ImageShapeSetParent        = 2538;
	window['AscDFH'].historyitem_ImageShapeSetGroup         = 2539;
	window['AscDFH'].historyitem_ImageShapeSetStyle         = 2540;
	window['AscDFH'].historyitem_ImageShapeSetData          = 2541;
	window['AscDFH'].historyitem_ImageShapeSetApplicationId = 2542;
	window['AscDFH'].historyitem_ImageShapeSetPixSizes      = 2543;
	window['AscDFH'].historyitem_GeometrySetParent          = 2540;
	window['AscDFH'].historyitem_GeometryAddAdj             = 2541;
	window['AscDFH'].historyitem_GeometryAddGuide           = 2542;
	window['AscDFH'].historyitem_GeometryAddCnx             = 2543;
	window['AscDFH'].historyitem_GeometryAddHandleXY        = 2544;
	window['AscDFH'].historyitem_GeometryAddHandlePolar     = 2545;
	window['AscDFH'].historyitem_GeometryAddPath            = 2546;
	window['AscDFH'].historyitem_GeometryAddRect            = 2547;
	window['AscDFH'].historyitem_GeometrySetPreset          = 2548;
	window['AscDFH'].historyitem_PathSetStroke              = 2549;
	window['AscDFH'].historyitem_PathSetExtrusionOk         = 2550;
	window['AscDFH'].historyitem_PathSetFill                = 2551;
	window['AscDFH'].historyitem_PathSetPathH               = 2552;
	window['AscDFH'].historyitem_PathSetPathW               = 2553;
	window['AscDFH'].historyitem_PathAddPathCommand         = 2554;
	window['AscDFH'].historyitem_TextBodySetBodyPr          = 2555;
	window['AscDFH'].historyitem_TextBodySetLstStyle        = 2557;
	window['AscDFH'].historyitem_TextBodySetContent         = 2558;
	window['AscDFH'].historyitem_TextBodySetParent          = 2559;
	window['AscDFH'].historyitem_CatAxSetAuto               = 2560;
	window['AscDFH'].historyitem_CatAxSetAxId               = 2561;
	window['AscDFH'].historyitem_CatAxSetAxPos              = 2562;
	window['AscDFH'].historyitem_CatAxSetCrossAx            = 2563;
	window['AscDFH'].historyitem_CatAxSetCrosses            = 2564;
	window['AscDFH'].historyitem_CatAxSetCrossesAt          = 2565;
	window['AscDFH'].historyitem_CatAxSetDelete             = 2566;
	window['AscDFH'].historyitem_CatAxSetExtLst             = 2567;
	window['AscDFH'].historyitem_CatAxSetLblAlgn            = 2568;
	window['AscDFH'].historyitem_CatAxSetLblOffset          = 2569;
	window['AscDFH'].historyitem_CatAxSetMajorGridlines     = 2570;
	window['AscDFH'].historyitem_CatAxSetMajorTickMark      = 2571;
	window['AscDFH'].historyitem_CatAxSetMinorGridlines     = 2572;
	window['AscDFH'].historyitem_CatAxSetMinorTickMark      = 2573;
	window['AscDFH'].historyitem_CatAxSetNoMultiLvlLbl      = 2574;
	window['AscDFH'].historyitem_CatAxSetNumFmt             = 2575;
	window['AscDFH'].historyitem_CatAxSetScaling            = 2576;
	window['AscDFH'].historyitem_CatAxSetSpPr               = 2577;
	window['AscDFH'].historyitem_CatAxSetTickLblPos         = 2578;
	window['AscDFH'].historyitem_CatAxSetTickLblSkip        = 2579;
	window['AscDFH'].historyitem_CatAxSetTickMarkSkip       = 2580;
	window['AscDFH'].historyitem_CatAxSetTitle              = 2581;
	window['AscDFH'].historyitem_CatAxSetTxPr               = 2582;

	window['AscDFH'].historyitem_ValAxSetAxId           = 2583;
	window['AscDFH'].historyitem_ValAxSetAxPos          = 2584;
	window['AscDFH'].historyitem_ValAxSetCrossAx        = 2585;
	window['AscDFH'].historyitem_ValAxSetCrossBetween   = 2586;
	window['AscDFH'].historyitem_ValAxSetCrosses        = 2587;
	window['AscDFH'].historyitem_ValAxSetCrossesAt      = 2588;
	window['AscDFH'].historyitem_ValAxSetDelete         = 2589;
	window['AscDFH'].historyitem_ValAxSetDispUnits      = 2590;
	window['AscDFH'].historyitem_ValAxSetExtLst         = 2591;
	window['AscDFH'].historyitem_ValAxSetMajorGridlines = 2592;
	window['AscDFH'].historyitem_ValAxSetMajorTickMark  = 2593;
	window['AscDFH'].historyitem_ValAxSetMajorUnit      = 2594;
	window['AscDFH'].historyitem_ValAxSetMinorGridlines = 2595;
	window['AscDFH'].historyitem_ValAxSetMinorTickMark  = 2596;
	window['AscDFH'].historyitem_ValAxSetMinorUnit      = 2597;
	window['AscDFH'].historyitem_ValAxSetNumFmt         = 2598;
	window['AscDFH'].historyitem_ValAxSetScaling        = 2599;
	window['AscDFH'].historyitem_ValAxSetSpPr           = 2600;
	window['AscDFH'].historyitem_ValAxSetTickLblPos     = 2601;
	window['AscDFH'].historyitem_ValAxSetTitle          = 2602;
	window['AscDFH'].historyitem_ValAxSetTxPr           = 2603;

	window['AscDFH'].historyitem_WrapPolygonSetEdited    = 2607;
	window['AscDFH'].historyitem_WrapPolygonSetRelPoints = 2608;
	window['AscDFH'].historyitem_WrapPolygonSetWrapSide  = 2608;


	window['AscDFH'].historyitem_DateAxAuto           = 2609;
	window['AscDFH'].historyitem_DateAxAxId           = 2610;
	window['AscDFH'].historyitem_DateAxAxPos          = 2611;
	window['AscDFH'].historyitem_DateAxBaseTimeUnit   = 2612;
	window['AscDFH'].historyitem_DateAxCrossAx        = 2613;
	window['AscDFH'].historyitem_DateAxCrosses        = 2614;
	window['AscDFH'].historyitem_DateAxCrossesAt      = 2615;
	window['AscDFH'].historyitem_DateAxDelete         = 2616;
	window['AscDFH'].historyitem_DateAxLblOffset      = 2617;
	window['AscDFH'].historyitem_DateAxMajorGridlines = 2618;
	window['AscDFH'].historyitem_DateAxMajorTickMark  = 2619;
	window['AscDFH'].historyitem_DateAxMajorTimeUnit  = 2620;
	window['AscDFH'].historyitem_DateAxMajorUnit      = 2621;
	window['AscDFH'].historyitem_DateAxMinorGridlines = 2622;
	window['AscDFH'].historyitem_DateAxMinorTickMark  = 2623;
	window['AscDFH'].historyitem_DateAxMinorTimeUnit  = 2624;
	window['AscDFH'].historyitem_DateAxMinorUnit      = 2625;
	window['AscDFH'].historyitem_DateAxNumFmt         = 2626;
	window['AscDFH'].historyitem_DateAxScaling        = 2627;
	window['AscDFH'].historyitem_DateAxSpPr           = 2628;
	window['AscDFH'].historyitem_DateAxTickLblPos     = 2629;
	window['AscDFH'].historyitem_DateAxTitle          = 2630;
	window['AscDFH'].historyitem_DateAxTxPr           = 2631;

	window['AscDFH'].historyitem_SlideSetComments       = 2632;
	window['AscDFH'].historyitem_SlideSetShow           = 2633;
	window['AscDFH'].historyitem_SlideSetShowPhAnim     = 2634;
	window['AscDFH'].historyitem_SlideSetShowMasterSp   = 2635;
	window['AscDFH'].historyitem_SlideSetLayout         = 2636;
	window['AscDFH'].historyitem_SlideSetNum            = 2637;
	window['AscDFH'].historyitem_SlideSetTiming         = 2638;
	window['AscDFH'].historyitem_SlideSetSize           = 2639;
	window['AscDFH'].historyitem_SlideSetBg             = 2640;
	window['AscDFH'].historyitem_SlideSetLocks          = 2641;
	window['AscDFH'].historyitem_SlideRemoveFromSpTree  = 2642;
	window['AscDFH'].historyitem_SlideAddToSpTree       = 2643;
	window['AscDFH'].historyitem_SlideSetCSldName       = 2644;
	window['AscDFH'].historyitem_SlideSetClrMapOverride = 2645;


	window['AscDFH'].historyitem_PropLockerSetId = 2646;


	window['AscDFH'].historyitem_SlideLayoutSetMaster         = 2646;
	window['AscDFH'].historyitem_SlideLayoutSetMatchingName   = 2647;
	window['AscDFH'].historyitem_SlideLayoutSetType           = 2648;
	window['AscDFH'].historyitem_SlideLayoutSetBg             = 2649;
	window['AscDFH'].historyitem_SlideLayoutSetCSldName       = 2650;
	window['AscDFH'].historyitem_SlideLayoutSetShow           = 2651;
	window['AscDFH'].historyitem_SlideLayoutSetShowPhAnim     = 2652;
	window['AscDFH'].historyitem_SlideLayoutSetShowMasterSp   = 2653;
	window['AscDFH'].historyitem_SlideLayoutSetClrMapOverride = 2654;
	window['AscDFH'].historyitem_SlideLayoutAddToSpTree       = 2655;
	window['AscDFH'].historyitem_SlideLayoutSetSize           = 2656;

	window['AscDFH'].historyitem_SlideMasterAddToSpTree       = 2656;
	window['AscDFH'].historyitem_SlideMasterSetTheme          = 2657;
	window['AscDFH'].historyitem_SlideMasterSetBg             = 2658;
	window['AscDFH'].historyitem_SlideMasterSetTxStyles       = 2659;
	window['AscDFH'].historyitem_SlideMasterSetCSldName       = 2660;
	window['AscDFH'].historyitem_SlideMasterSetClrMapOverride = 2661;
	window['AscDFH'].historyitem_SlideMasterAddLayout         = 2662;
	window['AscDFH'].historyitem_SlideMasterSetThemeIndex     = 2663;
	window['AscDFH'].historyitem_SlideMasterSetSize           = 2664;

	window['AscDFH'].historyitem_ThemeSetColorScheme = 2663;
	window['AscDFH'].historyitem_ThemeSetFontScheme  = 2664;
	window['AscDFH'].historyitem_ThemeSetFmtScheme   = 2665;

	window['AscDFH'].historyitem_Presentation_AddSlide          = 2666;
	window['AscDFH'].historyitem_Presentation_RemoveSlide       = 2667;
	window['AscDFH'].historyitem_Presentation_SlideSize         = 2668;
	window['AscDFH'].historyitem_Presentation_AddSlideMaster    = 2669;
	window['AscDFH'].historyitem_Presentation_ChangeTheme       = 2670;
	window['AscDFH'].historyitem_Presentation_ChangeColorScheme = 2671;
	window['AscDFH'].historyitem_Presentation_SetShowPr         = 2672;

	window['AscDFH'].historyitem_GraphicFrameSetSpPr          = 2672;
	window['AscDFH'].historyitem_GraphicFrameSetGraphicObject = 2673;
	window['AscDFH'].historyitem_GraphicFrameSetSetNvSpPr     = 2674;
	window['AscDFH'].historyitem_GraphicFrameSetSetParent     = 2675;
	window['AscDFH'].historyitem_GraphicFrameSetSetGroup      = 2676;


	window['AscDFH'].historyitem_SlideCommentsAddComment    = 2677;
	window['AscDFH'].historyitem_SlideCommentsRemoveComment = 2678;

	window['AscDFH'].historyitem_SerAxSetAxId           = 2632;
	window['AscDFH'].historyitem_SerAxSetAxPos          = 2633;
	window['AscDFH'].historyitem_SerAxSetCrossAx        = 2634;
	window['AscDFH'].historyitem_SerAxSetCrosses        = 2635;
	window['AscDFH'].historyitem_SerAxSetCrossesAt      = 2636;
	window['AscDFH'].historyitem_SerAxSetDelete         = 2637;
	window['AscDFH'].historyitem_SerAxSetMajorGridlines = 2638;
	window['AscDFH'].historyitem_SerAxSetMajorTickMark  = 2639;
	window['AscDFH'].historyitem_SerAxSetMinorGridlines = 2640;
	window['AscDFH'].historyitem_SerAxSetMinorTickMark  = 2641;
	window['AscDFH'].historyitem_SerAxSetNumFmt         = 2642;
	window['AscDFH'].historyitem_SerAxSetScaling        = 2643;
	window['AscDFH'].historyitem_SerAxSetSpPr           = 2644;
	window['AscDFH'].historyitem_SerAxSetTickLblPos     = 2645;
	window['AscDFH'].historyitem_SerAxSetTickLblSkip    = 2646;
	window['AscDFH'].historyitem_SerAxSetTickMarkSkip   = 2647;
	window['AscDFH'].historyitem_SerAxSetTitle          = 2648;
	window['AscDFH'].historyitem_SerAxSetTxPr           = 2649;

	window['AscDFH'].historyitem_type_ColorMod               = 1001;
	window['AscDFH'].historyitem_type_ColorModifiers         = 1002;
	window['AscDFH'].historyitem_type_SysColor               = 1003;
	window['AscDFH'].historyitem_type_PrstColor              = 1004;
	window['AscDFH'].historyitem_type_RGBColor               = 1005;
	window['AscDFH'].historyitem_type_SchemeColor            = 1006;
	window['AscDFH'].historyitem_type_UniColor               = 1007;
	window['AscDFH'].historyitem_type_SrcRect                = 1008;
	window['AscDFH'].historyitem_type_BlipFill               = 1009;
	window['AscDFH'].historyitem_type_SolidFill              = 1010;
	window['AscDFH'].historyitem_type_Gs                     = 1011;
	window['AscDFH'].historyitem_type_GradLin                = 1012;
	window['AscDFH'].historyitem_type_GradPath               = 1013;
	window['AscDFH'].historyitem_type_GradFill               = 1014;
	window['AscDFH'].historyitem_type_PathFill               = 1015;
	window['AscDFH'].historyitem_type_NoFill                 = 1016;
	window['AscDFH'].historyitem_type_UniFill                = 1017;
	window['AscDFH'].historyitem_type_EndArrow               = 1018;
	window['AscDFH'].historyitem_type_LineJoin               = 1019;
	window['AscDFH'].historyitem_type_Ln                     = 1020;
	window['AscDFH'].historyitem_type_DefaultShapeDefinition = 1021;
	window['AscDFH'].historyitem_type_CNvPr                  = 1022;
	window['AscDFH'].historyitem_type_NvPr                   = 1023;
	window['AscDFH'].historyitem_type_Ph                     = 1024;
	window['AscDFH'].historyitem_type_UniNvPr                = 1025;
	window['AscDFH'].historyitem_type_StyleRef               = 1026;
	window['AscDFH'].historyitem_type_FontRef                = 1027;
	window['AscDFH'].historyitem_type_Chart                  = 1028;
	window['AscDFH'].historyitem_type_ChartSpace             = 1029;
	window['AscDFH'].historyitem_type_Legend                 = 1030;
	window['AscDFH'].historyitem_type_Layout                 = 1031;
	window['AscDFH'].historyitem_type_LegendEntry            = 1032;
	window['AscDFH'].historyitem_type_PivotFmt               = 1033;
	window['AscDFH'].historyitem_type_DLbl                   = 1034;
	window['AscDFH'].historyitem_type_Marker                 = 1035;
	window['AscDFH'].historyitem_type_PlotArea               = 1036;
	window['AscDFH'].historyitem_type_Axis                   = 1037;
	window['AscDFH'].historyitem_type_NumFmt                 = 1038;
	window['AscDFH'].historyitem_type_Scaling                = 1039;
	window['AscDFH'].historyitem_type_DTable                 = 1040;
	window['AscDFH'].historyitem_type_LineChart              = 1041;
	window['AscDFH'].historyitem_type_DLbls                  = 1042;
	window['AscDFH'].historyitem_type_UpDownBars             = 1043;
	window['AscDFH'].historyitem_type_BarChart               = 1044;
	window['AscDFH'].historyitem_type_BubbleChart            = 1045;
	window['AscDFH'].historyitem_type_DoughnutChart          = 1046;
	window['AscDFH'].historyitem_type_OfPieChart             = 1047;
	window['AscDFH'].historyitem_type_PieChart               = 1048;
	window['AscDFH'].historyitem_type_RadarChart             = 1049;
	window['AscDFH'].historyitem_type_ScatterChart           = 1050;
	window['AscDFH'].historyitem_type_StockChart             = 1051;
	window['AscDFH'].historyitem_type_SurfaceChart           = 1052;
	window['AscDFH'].historyitem_type_BandFmt                = 1053;
	window['AscDFH'].historyitem_type_AreaChart              = 1054;
	window['AscDFH'].historyitem_type_ScatterSer             = 1055;
	window['AscDFH'].historyitem_type_DPt                    = 1056;
	window['AscDFH'].historyitem_type_ErrBars                = 1057;
	window['AscDFH'].historyitem_type_MinusPlus              = 1058;
	window['AscDFH'].historyitem_type_NumLit                 = 1059;
	window['AscDFH'].historyitem_type_NumericPoint           = 1060;
	window['AscDFH'].historyitem_type_NumRef                 = 1061;
	window['AscDFH'].historyitem_type_TrendLine              = 1062;
	window['AscDFH'].historyitem_type_Tx                     = 1063;
	window['AscDFH'].historyitem_type_StrRef                 = 1064;
	window['AscDFH'].historyitem_type_StrCache               = 1065;
	window['AscDFH'].historyitem_type_StrPoint               = 1066;
	window['AscDFH'].historyitem_type_XVal                   = 1067;
	window['AscDFH'].historyitem_type_MultiLvlStrRef         = 1068;
	window['AscDFH'].historyitem_type_MultiLvlStrCache       = 1068;
	window['AscDFH'].historyitem_type_StringLiteral          = 1069;
	window['AscDFH'].historyitem_type_YVal                   = 1070;
	window['AscDFH'].historyitem_type_AreaSeries             = 1071;
	window['AscDFH'].historyitem_type_Cat                    = 1072;
	window['AscDFH'].historyitem_type_PictureOptions         = 1073;
	window['AscDFH'].historyitem_type_RadarSeries            = 1074;
	window['AscDFH'].historyitem_type_BarSeries              = 1075;
	window['AscDFH'].historyitem_type_LineSeries             = 1076;
	window['AscDFH'].historyitem_type_PieSeries              = 1077;
	window['AscDFH'].historyitem_type_SurfaceSeries          = 1078;
	window['AscDFH'].historyitem_type_BubbleSeries           = 1079;
	window['AscDFH'].historyitem_type_ExternalData           = 1080;
	window['AscDFH'].historyitem_type_PivotSource            = 1081;
	window['AscDFH'].historyitem_type_Protection             = 1082;
	window['AscDFH'].historyitem_type_ChartWall              = 1083;
	window['AscDFH'].historyitem_type_View3d                 = 1084;
	window['AscDFH'].historyitem_type_ChartText              = 1085;
	window['AscDFH'].historyitem_type_ShapeStyle             = 1086;
	window['AscDFH'].historyitem_type_Xfrm                   = 1087;
	window['AscDFH'].historyitem_type_SpPr                   = 1088;
	window['AscDFH'].historyitem_type_ClrScheme              = 1089;
	window['AscDFH'].historyitem_type_ClrMap                 = 1090;
	window['AscDFH'].historyitem_type_ExtraClrScheme         = 1091;
	window['AscDFH'].historyitem_type_FontCollection         = 1092;
	window['AscDFH'].historyitem_type_FontScheme             = 1093;
	window['AscDFH'].historyitem_type_FormatScheme           = 1094;
	window['AscDFH'].historyitem_type_ThemeElements          = 1095;
	window['AscDFH'].historyitem_type_HF                     = 1096;
	window['AscDFH'].historyitem_type_BgPr                   = 1097;
	window['AscDFH'].historyitem_type_Bg                     = 1098;
	window['AscDFH'].historyitem_type_PrintSettings          = 1099;
	window['AscDFH'].historyitem_type_HeaderFooterChart      = 1100;
	window['AscDFH'].historyitem_type_PageMarginsChart       = 1101;
	window['AscDFH'].historyitem_type_PageSetup              = 1102;
	window['AscDFH'].historyitem_type_Shape                  = 1103;
	window['AscDFH'].historyitem_type_DispUnits              = 1104;
	window['AscDFH'].historyitem_type_GroupShape             = 1105;
	window['AscDFH'].historyitem_type_ImageShape             = 1106;
	window['AscDFH'].historyitem_type_Geometry               = 1107;
	window['AscDFH'].historyitem_type_Path                   = 1108;
	window['AscDFH'].historyitem_type_TextBody               = 1109;
	window['AscDFH'].historyitem_type_CatAx                  = 1110;
	window['AscDFH'].historyitem_type_ValAx                  = 1111;
	window['AscDFH'].historyitem_type_WrapPolygon            = 1112;
	window['AscDFH'].historyitem_type_DateAx                 = 1113;
	window['AscDFH'].historyitem_type_SerAx                  = 1114;
	window['AscDFH'].historyitem_type_Title                  = 1115;
	window['AscDFH'].historyitem_type_Slide                  = 1116;
	window['AscDFH'].historyitem_type_SlideLayout            = 1117;
	window['AscDFH'].historyitem_type_SlideMaster            = 1118;
	window['AscDFH'].historyitem_type_SlideComments          = 1119;
	window['AscDFH'].historyitem_type_PropLocker             = 1120;
	window['AscDFH'].historyitem_type_Theme                  = 1121;
	window['AscDFH'].historyitem_type_GraphicFrame           = 1122;
	window['AscDFH'].historyitem_type_GrpFill                = 1123;
	window['AscDFH'].historyitem_type_OleObject              = 1124;
	window['AscDFH'].historyitem_type_DrawingContent         = 1125;


	// Типы изменений в классе CDocument
	window['AscDFH'].historyitem_Document_AddItem           = 1; // Добавляем элемент в документ
	window['AscDFH'].historyitem_Document_RemoveItem        = 2; // Удаляем элемент из документа
	window['AscDFH'].historyitem_Document_Margin            = 3; // Меняем маргины(поля) документа
	window['AscDFH'].historyitem_Document_PageSize          = 4; // Меняем размер страницы у документа
	window['AscDFH'].historyitem_Document_Orientation       = 5; // Меняем ориентацию страниц у документа
	window['AscDFH'].historyitem_Document_DefaultTab        = 6; // Меняем таб по умолчанию
	window['AscDFH'].historyitem_Document_EvenAndOddHeaders = 7; // Меняем настройку различия четных/нечетных колонтитулов
	window['AscDFH'].historyitem_Document_DefaultLanguage   = 8; // Меняем язык по умолчанию для всего документа
	window['AscDFH'].historyitem_Document_MathSettings      = 9; // Меняем настройки формул

	// Типы изменений в классе Paragraph
	window['AscDFH'].historyitem_Paragraph_AddItem                   = 1; // Добавляем элемент в параграф
	window['AscDFH'].historyitem_Paragraph_RemoveItem                = 2; // Удаляем элемент из параграфа
	window['AscDFH'].historyitem_Paragraph_Numbering                 = 3; // Добавляем/Убираем/Изменяем нумерацию у параграфа
	window['AscDFH'].historyitem_Paragraph_Align                     = 4; // Изменяем прилегание параграфа
	window['AscDFH'].historyitem_Paragraph_Ind_First                 = 5; // Изменяем отспут первой строки
	window['AscDFH'].historyitem_Paragraph_Ind_Right                 = 6; // Изменяем правый отступ
	window['AscDFH'].historyitem_Paragraph_Ind_Left                  = 7; // Изменяем левый отступ
	window['AscDFH'].historyitem_Paragraph_ContextualSpacing         = 8; // Изменяем свойство contextualSpacing
	window['AscDFH'].historyitem_Paragraph_KeepLines                 = 9; // Изменяем свойство KeepLines
	window['AscDFH'].historyitem_Paragraph_KeepNext                  = 10; // Изменяем свойство KeepNext
	window['AscDFH'].historyitem_Paragraph_PageBreakBefore           = 11; // Изменяем свойство PageBreakBefore
	window['AscDFH'].historyitem_Paragraph_Spacing_Line              = 12; // Изменяем свойство Spacing.Line
	window['AscDFH'].historyitem_Paragraph_Spacing_LineRule          = 13; // Изменяем свойство Spacing.LineRule
	window['AscDFH'].historyitem_Paragraph_Spacing_Before            = 14; // Изменяем свойство Spacing.Before
	window['AscDFH'].historyitem_Paragraph_Spacing_After             = 15; // Изменяем свойство Spacing.After
	window['AscDFH'].historyitem_Paragraph_Spacing_AfterAutoSpacing  = 16; // Изменяем свойство Spacing.AfterAutoSpacing
	window['AscDFH'].historyitem_Paragraph_Spacing_BeforeAutoSpacing = 17; // Изменяем свойство Spacing.BeforeAutoSpacing
	window['AscDFH'].historyitem_Paragraph_Shd_Value                 = 18; // Изменяем свойство Shd.Value
	window['AscDFH'].historyitem_Paragraph_Shd_Color                 = 19; // Изменяем свойство Shd.Color
	window['AscDFH'].historyitem_Paragraph_Shd_Unifill               = 20; // Изменяем свойство Shd.Color
	window['AscDFH'].historyitem_Paragraph_WidowControl              = 21; // Изменяем свойство WidowControl
	window['AscDFH'].historyitem_Paragraph_Tabs                      = 22; // Изменяем табы у параграфа
	window['AscDFH'].historyitem_Paragraph_PStyle                    = 23; // Изменяем стиль параграфа
	window['AscDFH'].historyitem_Paragraph_DocNext                   = 24; // Изменяем указатель на следующий объект
	window['AscDFH'].historyitem_Paragraph_DocPrev                   = 25; // Изменяем указатель на предыдущий объект
	window['AscDFH'].historyitem_Paragraph_Parent                    = 26; // Изменяем указатель на родительский объект
	window['AscDFH'].historyitem_Paragraph_Borders_Between           = 27; // Изменяем промежуточную границу
	window['AscDFH'].historyitem_Paragraph_Borders_Bottom            = 28; // Изменяем верхнюю границу
	window['AscDFH'].historyitem_Paragraph_Borders_Left              = 29; // Изменяем левую границу
	window['AscDFH'].historyitem_Paragraph_Borders_Right             = 30; // Изменяем правую границу
	window['AscDFH'].historyitem_Paragraph_Borders_Top               = 31; // Изменяем нижнюю границу
	window['AscDFH'].historyitem_Paragraph_Pr                        = 32; // Изменяем свойства полностью
	window['AscDFH'].historyitem_Paragraph_PresentationPr_Bullet     = 33; // Изменяем свойства нумерации у параграфа в презентации
	window['AscDFH'].historyitem_Paragraph_PresentationPr_Level      = 34; // Изменяем уровень параграфа в презентациях
	window['AscDFH'].historyitem_Paragraph_FramePr                   = 35; // Изменяем настройки рамки
	window['AscDFH'].historyitem_Paragraph_Shd                       = 36; // Изменяем настройки заливки целиком
	window['AscDFH'].historyitem_Paragraph_SectionPr                 = 37; // Изменяем настройки секции
	window['AscDFH'].historyitem_Paragraph_PrChange                  = 38; // Добавляем элемент PrChange в Paragraph.Pr
	window['AscDFH'].historyitem_Paragraph_PrReviewInfo              = 39; // Изменяем информацию о рецензировании

	// Типы изменений в классе ParaRun
	window['AscDFH'].historyitem_ParaRun_AddItem           = 1;
	window['AscDFH'].historyitem_ParaRun_RemoveItem        = 2;
	window['AscDFH'].historyitem_ParaRun_Bold              = 3;
	window['AscDFH'].historyitem_ParaRun_Italic            = 4;
	window['AscDFH'].historyitem_ParaRun_Strikeout         = 5; // �������� ������������ ������
	window['AscDFH'].historyitem_ParaRun_Underline         = 6; // �������� ������������� ������
	window['AscDFH'].historyitem_ParaRun_FontFamily        = 7; // �������� ��� ������
	window['AscDFH'].historyitem_ParaRun_FontSize          = 8; // �������� ������ ������
	window['AscDFH'].historyitem_ParaRun_Color             = 9; // �������� ���� ������
	window['AscDFH'].historyitem_ParaRun_VertAlign         = 10; // �������� ������������ ����������
	window['AscDFH'].historyitem_ParaRun_HighLight         = 11; // �������� ��������� ������
	window['AscDFH'].historyitem_ParaRun_RStyle            = 12; // �������� ����� ������
	window['AscDFH'].historyitem_ParaRun_Spacing           = 13; // �������� ���������� ����� ���������
	window['AscDFH'].historyitem_ParaRun_DStrikeout        = 14; // �������� ������� ������������
	window['AscDFH'].historyitem_ParaRun_Caps              = 15; // �������� ��� ����� �� ���������
	window['AscDFH'].historyitem_ParaRun_SmallCaps         = 16; // �������� ��� ����� �� ����� ���������
	window['AscDFH'].historyitem_ParaRun_Position          = 17; // �������� ������������ ���������
	window['AscDFH'].historyitem_ParaRun_Value             = 18; // �������� ������� ��� ���������
	window['AscDFH'].historyitem_ParaRun_RFonts            = 19; // �������� ��������� �������
	window['AscDFH'].historyitem_ParaRun_Lang              = 20; // �������� ��������� �����
	window['AscDFH'].historyitem_ParaRun_RFonts_Ascii      = 21; // �������� ��������� �������
	window['AscDFH'].historyitem_ParaRun_RFonts_HAnsi      = 22; // �������� ��������� �������
	window['AscDFH'].historyitem_ParaRun_RFonts_CS         = 23; // �������� ��������� �������
	window['AscDFH'].historyitem_ParaRun_RFonts_EastAsia   = 24; // �������� ��������� �������
	window['AscDFH'].historyitem_ParaRun_RFonts_Hint       = 25; // �������� ��������� �������
	window['AscDFH'].historyitem_ParaRun_Lang_Bidi         = 26; // �������� ��������� �����
	window['AscDFH'].historyitem_ParaRun_Lang_EastAsia     = 27; // �������� ��������� �����
	window['AscDFH'].historyitem_ParaRun_Lang_Val          = 28; // �������� ��������� �����
	window['AscDFH'].historyitem_ParaRun_TextPr            = 29; // �������� ��� ��������� �������
	window['AscDFH'].historyitem_ParaRun_Unifill           = 30; // �������� ��� ��������� �������
	window['AscDFH'].historyitem_ParaRun_Shd               = 31;
	window['AscDFH'].historyitem_ParaRun_MathStyle         = 32; // Меняем свойство style для MathPr
	window['AscDFH'].historyitem_ParaRun_MathPrp           = 33; // Меняем MathPr
	window['AscDFH'].historyitem_ParaRun_ReviewType        = 34; // Тип для рецензирования
	window['AscDFH'].historyitem_ParaRun_PrChange          = 35; // Добавляем элемент PrChange в Run.Pr
	window['AscDFH'].historyitem_ParaRun_TextFill          = 36; // Заливка Текста в WordArt'ах
	window['AscDFH'].historyitem_ParaRun_TextOutline       = 37; // Обводка текста в WordArt'ах
	window['AscDFH'].historyitem_ParaRun_PrReviewInfo      = 38; // Изменение информации о рецензировании настроек рана
	window['AscDFH'].historyitem_ParaRun_ContentReviewInfo = 39; // Изменение информации о рецензировании содержимого рана
	window['AscDFH'].historyitem_ParaRun_OnStartSplit      = 40; // Специальное измненение для контролля позиции курсора и селекта
	window['AscDFH'].historyitem_ParaRun_OnEndSplit        = 41; // Специальное измненение для контролля позиции курсора и селекта
	window['AscDFH'].historyitem_ParaRun_MathAlnAt         = 42; // меняем alnAt в математических свойствах Run
	window['AscDFH'].historyitem_ParaRun_MathForcedBreak   = 43; // добавляем/удаляем Forced Break


	// Типы изменений в классе ParaTextPr
	window['AscDFH'].historyitem_TextPr_Change          = 1; // Изменяем настройку
	window['AscDFH'].historyitem_TextPr_Bold            = 2; // Изменяем жирность
	window['AscDFH'].historyitem_TextPr_Italic          = 3; // Изменяем наклонность
	window['AscDFH'].historyitem_TextPr_Strikeout       = 4; // Изменяем зачеркивание текста
	window['AscDFH'].historyitem_TextPr_Underline       = 5; // Изменяем подчеркивание текста
	window['AscDFH'].historyitem_TextPr_FontFamily      = 6; // Изменяем имя шрифта
	window['AscDFH'].historyitem_TextPr_FontSize        = 7; // Изменяем размер шрифта
	window['AscDFH'].historyitem_TextPr_Color           = 8; // Изменяем цвет текста
	window['AscDFH'].historyitem_TextPr_VertAlign       = 9; // Изменяем вертикальное прилегание
	window['AscDFH'].historyitem_TextPr_HighLight       = 10; // Изменяем выделение текста
	window['AscDFH'].historyitem_TextPr_RStyle          = 11; // Изменяем стиль текста
	window['AscDFH'].historyitem_TextPr_Spacing         = 12; // Изменяем расстояние между символами
	window['AscDFH'].historyitem_TextPr_DStrikeout      = 13; // Изменяем двойное зачеркивание
	window['AscDFH'].historyitem_TextPr_Caps            = 14; // Изменяем все буквы на прописные
	window['AscDFH'].historyitem_TextPr_SmallCaps       = 15; // Изменяем все буквы на малые прописные
	window['AscDFH'].historyitem_TextPr_Position        = 16; // Изменяем вертикальное положение
	window['AscDFH'].historyitem_TextPr_Value           = 17; // Изменяем целиком все настройки
	window['AscDFH'].historyitem_TextPr_RFonts          = 18; // Изменяем настройки шрифтов
	window['AscDFH'].historyitem_TextPr_Lang            = 19; // Изменяем настройку языка
	window['AscDFH'].historyitem_TextPr_RFonts_Ascii    = 20; // Изменяем настройки шрифтов
	window['AscDFH'].historyitem_TextPr_RFonts_HAnsi    = 21; // Изменяем настройки шрифтов
	window['AscDFH'].historyitem_TextPr_RFonts_CS       = 22; // Изменяем настройки шрифтов
	window['AscDFH'].historyitem_TextPr_RFonts_EastAsia = 23; // Изменяем настройки шрифтов
	window['AscDFH'].historyitem_TextPr_RFonts_Hint     = 24; // Изменяем настройки шрифтов
	window['AscDFH'].historyitem_TextPr_Lang_Bidi       = 25; // Изменяем настройку языка
	window['AscDFH'].historyitem_TextPr_Lang_EastAsia   = 26; // Изменяем настройку языка
	window['AscDFH'].historyitem_TextPr_Lang_Val        = 27; // Изменяем настройку языка
	window['AscDFH'].historyitem_TextPr_Unifill         = 28; // Изменяем настройку языка
	window['AscDFH'].historyitem_TextPr_FontSizeCS      = 29;
	window['AscDFH'].historyitem_TextPr_Outline         = 30; // Изменяем обводку текста
	window['AscDFH'].historyitem_TextPr_Fill            = 31; // Изменяем заливку текста

	// Типы изменений в классе ParaDrawing
	window['AscDFH'].historyitem_Drawing_Size              = 1; // Изменяем размер картинки
	window['AscDFH'].historyitem_Drawing_Url               = 2; // Изменяем адрес картинку (т.е. меняем само изображение)
	window['AscDFH'].historyitem_Drawing_DrawingType       = 3; // Изменяем тип объекта (anchor/inline)
	window['AscDFH'].historyitem_Drawing_WrappingType      = 4; // Изменяем тип обтекания
	window['AscDFH'].historyitem_Drawing_Distance          = 5; // Изменяем расстояние до окружающего текста
	window['AscDFH'].historyitem_Drawing_AllowOverlap      = 6; // Изменяем возможность перекрытия плавающих картинок
	window['AscDFH'].historyitem_Drawing_PositionH         = 7; // Изменяем привязку по горизонтали
	window['AscDFH'].historyitem_Drawing_PositionV         = 8; // Изменяем привязку по вертикали
	window['AscDFH'].historyitem_Drawing_BehindDoc         = 10;// Изменяем положение объекта (за/перед текстом)
	window['AscDFH'].historyitem_Drawing_SetGraphicObject  = 11;
	window['AscDFH'].historyitem_SetSimplePos              = 12;
	window['AscDFH'].historyitem_SetExtent                 = 13;
	window['AscDFH'].historyitem_SetWrapPolygon            = 14;
	window['AscDFH'].historyitem_Drawing_SetLocked         = 15;// Устанавливаем привязку к конкретному параграфу]
	window['AscDFH'].historyitem_Drawing_SetRelativeHeight = 16;// Устанавливаем Z-Index
	window['AscDFH'].historyitem_Drawing_SetEffectExtent   = 17;// Устанавливаем EffectExtent
	window['AscDFH'].historyitem_Drawing_SetParent         = 18;// Устанавливаем Parent
	window['AscDFH'].historyitem_Drawing_SetParaMath       = 19; // Добавляем новую формулу для конвертации старого формата в новый
	window['AscDFH'].historyitem_Drawing_LayoutInCell      = 20; // Устанавливаем параметр расположения в таблице
	window['AscDFH'].historyitem_Drawing_SetSizeRelH       = 21;//Ширина объекта в процентах
	window['AscDFH'].historyitem_Drawing_SetSizeRelV       = 22;//Высота объекта в процентах


	// Типы изменений в классе CDrawingObjects
	window['AscDFH'].historyitem_DrawingObjects_AddItem    = 1;
	window['AscDFH'].historyitem_DrawingObjects_RemoveItem = 2;

	// Типы изменений в классе FlowObjects
	window['AscDFH'].historyitem_FlowObjects_AddItem    = 1;
	window['AscDFH'].historyitem_FlowObjects_RemoveItem = 2;

	// Типы изменений в классе FlowImage
	window['AscDFH'].historyitem_FlowImage_Position = 1; // Изменяем позицию картинки
	window['AscDFH'].historyitem_FlowImage_Size     = 2; // Изменяем размер картинки
	window['AscDFH'].historyitem_FlowImage_Paddings = 3; // Изменяем отступы от картинки
	window['AscDFH'].historyitem_FlowImage_PageNum  = 4; // Изменяем номер страницы картинки
	window['AscDFH'].historyitem_FlowImage_Url      = 5; // Изменяем адрес картинку (т.е. меняем само изображение)
	window['AscDFH'].historyitem_FlowImage_Parent   = 6; // Изменяем указатель на родительский объект

	// Типы изменений в классе CTable
	window['AscDFH'].historyitem_Table_DocNext               = 1; // Изменяем указатель на следующий объект
	window['AscDFH'].historyitem_Table_DocPrev               = 2; // Изменяем указатель на предыдущий объект
	window['AscDFH'].historyitem_Table_Parent                = 3; // Изменяем указатель на родительский объект
	window['AscDFH'].historyitem_Table_TableW                = 4; // Изменяем ширину таблицы
	window['AscDFH'].historyitem_Table_TableCellMar          = 5; // Изменяем отступы(по умолчанию) внутри ячеек
	window['AscDFH'].historyitem_Table_TableAlign            = 6; // Изменяем прилегание(для inline таблиц)
	window['AscDFH'].historyitem_Table_TableInd              = 7; // Изменяем отступ(для inline таблиц)
	window['AscDFH'].historyitem_Table_TableBorder_Left      = 8; // Изменяем левую границу таблицы
	window['AscDFH'].historyitem_Table_TableBorder_Top       = 9; // Изменяем верхнюю границу таблицы
	window['AscDFH'].historyitem_Table_TableBorder_Right     = 10; // Изменяем правую границу таблицы
	window['AscDFH'].historyitem_Table_TableBorder_Bottom    = 11; // Изменяем нижнюю границу таблицы
	window['AscDFH'].historyitem_Table_TableBorder_InsideH   = 12; // Изменяем внутренюю горизонтальную границу
	window['AscDFH'].historyitem_Table_TableBorder_InsideV   = 13; // Изменяем внутренюю вертикальную границу
	window['AscDFH'].historyitem_Table_TableShd              = 14; // Изменяем заливку таблицы
	window['AscDFH'].historyitem_Table_Inline                = 15; // Изменяем свойствой inline
	window['AscDFH'].historyitem_Table_AddRow                = 16; // Добавляем строку в таблицу
	window['AscDFH'].historyitem_Table_RemoveRow             = 17; // Удаляем строку из таблицы
	window['AscDFH'].historyitem_Table_TableGrid             = 18; // Изменяем сетку колонок
	window['AscDFH'].historyitem_Table_TableLook             = 19; // Изменяем тип условного форматирования таблицы
	window['AscDFH'].historyitem_Table_TableStyleRowBandSize = 20; // Изменяем количество строк в группе
	window['AscDFH'].historyitem_Table_TableStyleColBandSize = 21; // Изменяем количество колонок в группе
	window['AscDFH'].historyitem_Table_TableStyle            = 22; // Изменяем стиль таблицы
	window['AscDFH'].historyitem_Table_AllowOverlap          = 23; // Изменяем возможность перекрытия плавающих таблиц
	window['AscDFH'].historyitem_Table_PositionH             = 24; // Изменяем привязку по горизонтали
	window['AscDFH'].historyitem_Table_PositionV             = 25; // Изменяем привязку по вертикали
	window['AscDFH'].historyitem_Table_Distance              = 26; // Изменяем расстояние до окружающего текста
	window['AscDFH'].historyitem_Table_Pr                    = 27; // Изменяем настройки таблицы целиком
	window['AscDFH'].historyitem_Table_TableLayout           = 28; // Изменяем настройки рассчета ширины колонок

	// Типы изменений в классе CTableRow
	window['AscDFH'].historyitem_TableRow_Before      = 1; // Изменяем свойство Before
	window['AscDFH'].historyitem_TableRow_After       = 2; // Изменяем свойство After
	window['AscDFH'].historyitem_TableRow_CellSpacing = 3; // Изменяем свойство CellSpacing
	window['AscDFH'].historyitem_TableRow_Height      = 4; // Изменяем свойство Height
	window['AscDFH'].historyitem_TableRow_AddCell     = 5; // Добавляем ячейку
	window['AscDFH'].historyitem_TableRow_RemoveCell  = 6; // Удаляем ячейку
	window['AscDFH'].historyitem_TableRow_TableHeader = 7; // Изменяем свойство TableHeader
	window['AscDFH'].historyitem_TableRow_Pr          = 8; // Изменяем настройки строки целиком

	// Типы изменений в классе CTableCell
	window['AscDFH'].historyitem_TableCell_GridSpan      = 1; // Изменяем горизонтальное объединение
	window['AscDFH'].historyitem_TableCell_Margins       = 2; // Изменяем отступы
	window['AscDFH'].historyitem_TableCell_Shd           = 3; // Изменяем заливку
	window['AscDFH'].historyitem_TableCell_VMerge        = 4; // Изменяем вертикальное объединение
	window['AscDFH'].historyitem_TableCell_Border_Left   = 5; // Изменяем левую границу ячейки
	window['AscDFH'].historyitem_TableCell_Border_Right  = 6; // Изменяем правую границу ячейки
	window['AscDFH'].historyitem_TableCell_Border_Top    = 7; // Изменяем верхнюю границу ячейки
	window['AscDFH'].historyitem_TableCell_Border_Bottom = 8; // Изменяем нижнюю границу ячейки
	window['AscDFH'].historyitem_TableCell_VAlign        = 9; // Изменяем вертикальное выравнивание ячейки
	window['AscDFH'].historyitem_TableCell_W             = 10; // Изменяем ширину ячейки
	window['AscDFH'].historyitem_TableCell_Pr            = 11; // Изменяем настройки целиком
	window['AscDFH'].historyitem_TableCell_TextDirection = 12; // Изменяем направление текста
	window['AscDFH'].historyitem_TableCell_NoWrap        = 13; // Изменяем настройку NoWrap

	// Типы изменений в классе CDocumentContent
	window['AscDFH'].historyitem_DocumentContent_AddItem    = 1; // Добавляем элемент в документ
	window['AscDFH'].historyitem_DocumentContent_RemoveItem = 2; // Удаляем элемент из документа

	// Типы изменений в классе CFlowTable
	window['AscDFH'].historyitem_FlowTable_Position = 1; // Изменяем позиции
	window['AscDFH'].historyitem_FlowTable_Paddings = 2; // Изменяем отступов
	window['AscDFH'].historyitem_FlowTable_PageNum  = 3; // Изменяем номер страницы у таблицы
	window['AscDFH'].historyitem_FlowTable_Parent   = 4; // Изменяем указатель на родительский объект

	// Типы изменений в классе CHeaderFooterController
	window['AscDFH'].historyitem_HdrFtrController_AddItem    = 1; // Добавляем колонтитул
	window['AscDFH'].historyitem_HdrFtrController_RemoveItem = 2; // Удаляем колонтитул

	// Типы изменений в классе CHeaderFooter
	window['AscDFH'].historyitem_HdrFtr_BoundY2 = 1; // Изменяем отступ колонтитула (для верхнего от верха,  для нижнего от низа)

	// Типы изменений в классе CAbstractNum
	window['AscDFH'].historyitem_AbstractNum_LvlChange    = 1; // Изменили заданный уровень
	window['AscDFH'].historyitem_AbstractNum_TextPrChange = 2; // Изменили текстовую настройку у заданного уровня
	window['AscDFH'].historyitem_AbstractNum_ParaPrChange = 3; // Изменили настройку параграфа у заданного уровня

	// Типы изменений в классе CTableId
	window['AscDFH'].historyitem_TableId_Add         = 1;      // Добавили новую ссылку в глобальную таблицу
	window['AscDFH'].historyitem_TableId_Reset       = 2;      // Изменили Id ссылки
	window['AscDFH'].historyitem_TableId_Description = 0xFFFF; // Описание произошедших в точке изменений

	// Типы изменений в классе CComments
	window['AscDFH'].historyitem_Comments_Add    = 1; // Добавили новый комментарий
	window['AscDFH'].historyitem_Comments_Remove = 2; // Удалили комментарий

	// Типы изменений в классе СComment
	window['AscDFH'].historyitem_Comment_Change   = 3; // Изменили комментарий
	window['AscDFH'].historyitem_Comment_TypeInfo = 4; // Изменили информацию о типе комментария
	window['AscDFH'].historyitem_Comment_Position = 5; // Изменили информацию о типе комментария

	// Типы изменений в классе ParaComment
	window['AscDFH'].historyitem_ParaComment_CommentId = 1; // Изменяем Id комментария, к которому привязана метка

	// Типы изменений в классе CParaHyperlinkStart
	window['AscDFH'].historyitem_Hyperlink_Value      = 1; // Изменяем значение гиперссылки
	window['AscDFH'].historyitem_Hyperlink_ToolTip    = 2; // Изменяем подсказку гиперссылки
	window['AscDFH'].historyitem_Hyperlink_AddItem    = 3;
	window['AscDFH'].historyitem_Hyperlink_RemoveItem = 4;

	// Типы изменений в классе ParaField
	window['AscDFH'].historyitem_Field_AddItem    = 1;
	window['AscDFH'].historyitem_Field_RemoveItem = 2;

	//Типы изменений в классе CGraphicObjects
	window['AscDFH'].historyitem_AddNewGraphicObject = 0;
	window['AscDFH'].historyitem_RemoveGraphicObject = 1;


	//Типы изменений в классе GraphicObjects
	window['AscDFH'].historyitem_ChangeColorScheme = 1;

	//Типы изменений в классе HeaderFooterGraphicObjects
	window['AscDFH'].historyitem_AddHdr    = 0;
	window['AscDFH'].historyitem_AddFtr    = 1;
	window['AscDFH'].historyitem_RemoveHdr = 2;
	window['AscDFH'].historyitem_RemoveFtr = 3;


	//Типы изменений в классе WordGroupShapes
	window['AscDFH'].historyitem_InternalChanges  = 6;
	window['AscDFH'].historyitem_GroupRecalculate = 32;


	// Типы изменений в классе CStyle
	window['AscDFH'].historyitem_Style_TextPr          = 1;  // Изменяем TextPr
	window['AscDFH'].historyitem_Style_ParaPr          = 2;  // Изменяем ParaPr
	window['AscDFH'].historyitem_Style_TablePr         = 3;  // Изменяем TablePr
	window['AscDFH'].historyitem_Style_TableRowPr      = 4;  // Изменяем TableRowPr
	window['AscDFH'].historyitem_Style_TableCellPr     = 5;  // Изменяем TableCellPr
	window['AscDFH'].historyitem_Style_TableBand1Horz  = 6;  // Изменяем TableBand1Horz
	window['AscDFH'].historyitem_Style_TableBand1Vert  = 7;  // Изменяем TableBand1Vert
	window['AscDFH'].historyitem_Style_TableBand2Horz  = 8;  // Изменяем TableBand2Horz
	window['AscDFH'].historyitem_Style_TableBand2Vert  = 9;  // Изменяем TableBand2Vert
	window['AscDFH'].historyitem_Style_TableFirstCol   = 10; // Изменяем TableFirstCol
	window['AscDFH'].historyitem_Style_TableFirstRow   = 11; // Изменяем TableFirstRow
	window['AscDFH'].historyitem_Style_TableLastCol    = 12; // Изменяем TableLastCol
	window['AscDFH'].historyitem_Style_TableLastRow    = 13; // Изменяем TableLastRow
	window['AscDFH'].historyitem_Style_TableTLCell     = 14; // Изменяем TableTLCell
	window['AscDFH'].historyitem_Style_TableTRCell     = 15; // Изменяем TableTRCell
	window['AscDFH'].historyitem_Style_TableBLCell     = 16; // Изменяем TableBLCell
	window['AscDFH'].historyitem_Style_TableBRCell     = 17; // Изменяем TableBRCell
	window['AscDFH'].historyitem_Style_TableWholeTable = 18; // Изменяем TableWholeTable
	window['AscDFH'].historyitem_Style_Name            = 101; // Изменяем Name
	window['AscDFH'].historyitem_Style_BasedOn         = 102; // Изменяем BasedOn
	window['AscDFH'].historyitem_Style_Next            = 103; // Изменяем Next
	window['AscDFH'].historyitem_Style_Type            = 104; // Изменяем Type
	window['AscDFH'].historyitem_Style_QFormat         = 105; // Изменяем QFormat
	window['AscDFH'].historyitem_Style_UiPriority      = 106; // Изменяем UiPriority
	window['AscDFH'].historyitem_Style_Hidden          = 107; // Изменяем Hidden
	window['AscDFH'].historyitem_Style_SemiHidden      = 108; // Изменяем SemiHidden
	window['AscDFH'].historyitem_Style_UnhideWhenUsed  = 109; // Изменяем UnhideWhenUsed
	window['AscDFH'].historyitem_Style_Link            = 110; // Изменяем Link

	// Типы изменений в классе CStyles
	window['AscDFH'].historyitem_Styles_Add                 = 1; // Добавляем стиль
	window['AscDFH'].historyitem_Styles_Remove              = 2; // Удаляем стиль
	window['AscDFH'].historyitem_Styles_ChangeDefaultTextPr = 3; // Изменяем настройки текста по умолчанию
	window['AscDFH'].historyitem_Styles_ChangeDefaultParaPr = 4; // Изменяем настройки параграфа по умолчанию

	// Тип изменений в классе CSectionPr
	window['AscDFH'].historyitem_Section_PageSize_Orient    = 1; // Меняем ориентацию страницы
	window['AscDFH'].historyitem_Section_PageSize_Size      = 2; // Меняем размер страницы
	window['AscDFH'].historyitem_Section_PageMargins        = 3; // Меняем отступы страницы
	window['AscDFH'].historyitem_Section_Type               = 4; // Меняем тип секции
	window['AscDFH'].historyitem_Section_Borders_Left       = 5; // Меняем левую границу
	window['AscDFH'].historyitem_Section_Borders_Top        = 6; // Меняем верхнюю границу
	window['AscDFH'].historyitem_Section_Borders_Right      = 7; // Меняем правую границу
	window['AscDFH'].historyitem_Section_Borders_Bottom     = 8; // Меняем нижнюю границу
	window['AscDFH'].historyitem_Section_Borders_Display    = 9; // Меняем тип страниц, на которых рисуются границы
	window['AscDFH'].historyitem_Section_Borders_OffsetFrom = 10; // Меняем тип отступа границ
	window['AscDFH'].historyitem_Section_Borders_ZOrder     = 11; // Меняем Z-index границ
	window['AscDFH'].historyitem_Section_Header_First       = 12; // Меняем верхний колонтитул первой страницы
	window['AscDFH'].historyitem_Section_Header_Even        = 13; // Меняем верхний колонтитул четных страниц
	window['AscDFH'].historyitem_Section_Header_Default     = 14; // Меняем верхний колонтитул по умолчанию
	window['AscDFH'].historyitem_Section_Footer_First       = 15; // Меняем нижний колонтитул первой страницы
	window['AscDFH'].historyitem_Section_Footer_Even        = 16; // Меняем нижний колонтитул четных страниц
	window['AscDFH'].historyitem_Section_Footer_Default     = 17; // Меняем нижний колонтитул по умолчанию
	window['AscDFH'].historyitem_Section_TitlePage          = 18; // Меняем настройку наличия специального колонтитула для первой страницы
	window['AscDFH'].historyitem_Section_PageMargins_Header = 19; // Меняем расстояние от верха страницы до верхнего колонтитула
	window['AscDFH'].historyitem_Section_PageMargins_Footer = 20; // Меняем расстояние от низа страницы до нижнего колонтитула
	window['AscDFH'].historyitem_Section_PageNumType_Start  = 21; // Изменяем начальное значение для нумерации страниц
	window['AscDFH'].historyitem_Section_Columns_EqualWidth = 22;
	window['AscDFH'].historyitem_Section_Columns_Space      = 23;
	window['AscDFH'].historyitem_Section_Columns_Num        = 24;
	window['AscDFH'].historyitem_Section_Columns_Sep        = 25;
	window['AscDFH'].historyitem_Section_Columns_Col        = 26;
	window['AscDFH'].historyitem_Section_Columns_SetCols    = 27;

	// Тип класса, к которому относится данный элемент истории
	window['AscDFH'].historyitem_State_Unknown         = 0;
	window['AscDFH'].historyitem_State_Document        = 1;
	window['AscDFH'].historyitem_State_DocumentContent = 2;
	window['AscDFH'].historyitem_State_Paragraph       = 3;
	window['AscDFH'].historyitem_State_Table           = 4;

	// Типы произошедших изменений
	window['AscDFH'].historyitem_recalctype_Inline  = 0; // Изменения произошли в обычном тексте (с верхним классом CDocument)
	window['AscDFH'].historyitem_recalctype_Flow    = 1; // Изменения произошли в "плавающем" объекте
	window['AscDFH'].historyitem_recalctype_HdrFtr  = 2; // Изменения произошли в колонтитуле
	window['AscDFH'].historyitem_recalctype_Drawing = 3; // Изменения произошли в drawing'е

	// Типы классов, в которых происходили изменения (типы нужны для совместного редактирования)
	window['AscDFH'].historyitem_type_Unknown          = 0;
	window['AscDFH'].historyitem_type_TableId          = 1;
	window['AscDFH'].historyitem_type_Document         = 2;
	window['AscDFH'].historyitem_type_Paragraph        = 3;
	window['AscDFH'].historyitem_type_TextPr           = 4;
	window['AscDFH'].historyitem_type_Drawing          = 5;
	window['AscDFH'].historyitem_type_DrawingObjects   = 6;
	window['AscDFH'].historyitem_type_FlowObjects      = 7;
	window['AscDFH'].historyitem_type_FlowImage        = 8;
	window['AscDFH'].historyitem_type_Table            = 9;
	window['AscDFH'].historyitem_type_TableRow         = 10;
	window['AscDFH'].historyitem_type_TableCell        = 11;
	window['AscDFH'].historyitem_type_DocumentContent  = 12;
	window['AscDFH'].historyitem_type_FlowTable        = 13;
	window['AscDFH'].historyitem_type_HdrFtrController = 14;
	window['AscDFH'].historyitem_type_HdrFtr           = 15;
	window['AscDFH'].historyitem_type_AbstractNum      = 16;
	window['AscDFH'].historyitem_type_Comment          = 17;
	window['AscDFH'].historyitem_type_Comments         = 18;
	window['AscDFH'].historyitem_type_Image            = 19;
	window['AscDFH'].historyitem_type_GrObjects        = 20;
	window['AscDFH'].historyitem_type_Hyperlink        = 21;
	window['AscDFH'].historyitem_type_Style            = 23;
	window['AscDFH'].historyitem_type_Styles           = 24;
	window['AscDFH'].historyitem_type_ChartTitle       = 25;
	window['AscDFH'].historyitem_type_Math             = 26;
	window['AscDFH'].historyitem_type_CommentMark      = 27;
	window['AscDFH'].historyitem_type_ParaRun          = 28;
	window['AscDFH'].historyitem_type_MathContent      = 29;
	window['AscDFH'].historyitem_type_Section          = 30;
	window['AscDFH'].historyitem_type_acc              = 31;
	window['AscDFH'].historyitem_type_bar              = 32;
	window['AscDFH'].historyitem_type_borderBox        = 33;
	window['AscDFH'].historyitem_type_box              = 34;
	window['AscDFH'].historyitem_type_delimiter        = 35;
	window['AscDFH'].historyitem_type_eqArr            = 36;
	window['AscDFH'].historyitem_type_frac             = 37;
	window['AscDFH'].historyitem_type_mathFunc         = 38;
	window['AscDFH'].historyitem_type_groupChr         = 39;
	window['AscDFH'].historyitem_type_lim              = 40;
	window['AscDFH'].historyitem_type_matrix           = 41;
	window['AscDFH'].historyitem_type_nary             = 42;
	window['AscDFH'].historyitem_type_integral         = 43;
	window['AscDFH'].historyitem_type_double_integral  = 44;
	window['AscDFH'].historyitem_type_triple_integral  = 45;
	window['AscDFH'].historyitem_type_contour_integral = 46;
	window['AscDFH'].historyitem_type_surface_integral = 47;
	window['AscDFH'].historyitem_type_volume_integral  = 48;
	window['AscDFH'].historyitem_type_phant            = 49;
	window['AscDFH'].historyitem_type_rad              = 50;
	window['AscDFH'].historyitem_type_deg_subsup       = 51;
	window['AscDFH'].historyitem_type_iterators        = 52;
	window['AscDFH'].historyitem_type_deg              = 53;
	window['AscDFH'].historyitem_type_ParaComment      = 54;
	window['AscDFH'].historyitem_type_Field            = 55;
	window['AscDFH'].historyitem_type_Footnotes        = 56;
	window['AscDFH'].historyitem_type_FootEndNote      = 57;

	window['AscDFH'].historyitem_Math_AddItem               = 1; // Добавляем элемент
	window['AscDFH'].historyitem_Math_RemoveItem            = 2; // Удаляем элемент
	window['AscDFH'].historyitem_Math_CtrPrpFSize           = 3; // CtrPrp
	window['AscDFH'].historyitem_Math_ParaJc                = 4; // ParaMath.Jc
	window['AscDFH'].historyitem_Math_CtrPrpShd             = 5;
	window['AscDFH'].historyitem_Math_AddItems_ToMathBase   = 6;
	window['AscDFH'].historyitem_Math_CtrPrpColor           = 7;
	window['AscDFH'].historyitem_Math_CtrPrpUnifill         = 8;
	window['AscDFH'].historyitem_Math_CtrPrpUnderline       = 9;
	window['AscDFH'].historyitem_Math_CtrPrpStrikeout       = 10;
	window['AscDFH'].historyitem_Math_CtrPrpDoubleStrikeout = 11;
	window['AscDFH'].historyitem_Math_CtrPrpItalic          = 12;
	window['AscDFH'].historyitem_Math_CtrPrpBold            = 13;
	window['AscDFH'].historyitem_Math_RFontsAscii           = 14;
	window['AscDFH'].historyitem_Math_RFontsHAnsi           = 15;
	window['AscDFH'].historyitem_Math_RFontsCS              = 16;
	window['AscDFH'].historyitem_Math_RFontsEastAsia        = 17;
	window['AscDFH'].historyitem_Math_RFontsHint            = 18;
	window['AscDFH'].historyitem_Math_CtrPrpHighLight       = 19;
	window['AscDFH'].historyitem_Math_ArgSize               = 20;
	window['AscDFH'].historyitem_Math_ReviewType            = 21;
	window['AscDFH'].historyitem_Math_CtrPrpTextFill        = 22;
	window['AscDFH'].historyitem_Math_CtrPrpTextOutline     = 23;
	window['AscDFH'].historyitem_Math_BoxAlnAt              = 24;
	window['AscDFH'].historyitem_Math_FractionType          = 25;
	window['AscDFH'].historyitem_Math_RadicalHideDegree     = 26;
	window['AscDFH'].historyitem_Math_NaryLimLoc            = 27;
	window['AscDFH'].historyitem_Math_NaryUpperLimit        = 28;
	window['AscDFH'].historyitem_Math_NaryLowerLimit        = 29;
	window['AscDFH'].historyitem_Math_DelimBegOper          = 30;
	window['AscDFH'].historyitem_Math_DelimEndOper          = 31;
	window['AscDFH'].historyitem_Math_BaseSetColumn         = 32;
	window['AscDFH'].historyitem_Math_BaseRemoveItems       = 33;
	window['AscDFH'].historyitem_Math_DelimiterGrow         = 34;
	window['AscDFH'].historyitem_Math_DelimiterShape        = 35;
	window['AscDFH'].historyitem_Math_GroupCharPr           = 36;
	window['AscDFH'].historyitem_Math_LimitType             = 37;
	window['AscDFH'].historyitem_Math_BorderBoxTop          = 38;
	window['AscDFH'].historyitem_Math_BorderBoxBot          = 39;
	window['AscDFH'].historyitem_Math_BorderBoxLeft         = 40;
	window['AscDFH'].historyitem_Math_BorderBoxRight        = 41;
	window['AscDFH'].historyitem_Math_BorderBoxHor          = 42;
	window['AscDFH'].historyitem_Math_BorderBoxVer          = 43;
	window['AscDFH'].historyitem_Math_BorderBoxTopLTR       = 44;
	window['AscDFH'].historyitem_Math_BorderBoxTopRTL       = 45;
	window['AscDFH'].historyitem_Math_MatrixAddRow          = 46;
	window['AscDFH'].historyitem_Math_MatrixRemoveRow       = 47;
	window['AscDFH'].historyitem_Math_MatrixAddColumn       = 48;
	window['AscDFH'].historyitem_Math_MatrixRemoveColumn    = 49;
	window['AscDFH'].historyitem_Math_MatrixBaseJc          = 50;
	window['AscDFH'].historyitem_Math_MatrixColumnJc        = 51;
	window['AscDFH'].historyitem_Math_MatrixInterval        = 52;
	window['AscDFH'].historyitem_Math_MatrixPlh             = 53;
	window['AscDFH'].historyitem_Math_MatrixMinColumnWidth  = 54;
	window['AscDFH'].historyitem_Math_BarLinePos            = 55;
	window['AscDFH'].historyitem_Math_BoxForcedBreak        = 56;
	window['AscDFH'].historyitem_Math_DegreeSubSupType      = 57;

	window['AscDFH'].historyitem_Footnotes_AddFootnote = 1;

	window['AscDFH'].historydescription_Cut                                         = 0x0001;
	window['AscDFH'].historydescription_PasteButtonIE                               = 0x0002;
	window['AscDFH'].historydescription_PasteButtonNotIE                            = 0x0003;
	window['AscDFH'].historydescription_ChartDrawingObjects                         = 0x0004;
	window['AscDFH'].historydescription_CommonControllerCheckChartText              = 0x0005;
	window['AscDFH'].historydescription_CommonControllerUnGroup                     = 0x0006;
	window['AscDFH'].historydescription_CommonControllerCheckSelected               = 0x0007;
	window['AscDFH'].historydescription_CommonControllerSetGraphicObject            = 0x0008;
	window['AscDFH'].historydescription_CommonStatesAddNewShape                     = 0x0009;
	window['AscDFH'].historydescription_CommonStatesRotate                          = 0x000a;
	window['AscDFH'].historydescription_PasteNative                                 = 0x000b;
	window['AscDFH'].historydescription_Document_GroupUnGroup                       = 0x000c;
	window['AscDFH'].historydescription_Document_SetDefaultLanguage                 = 0x000d;
	window['AscDFH'].historydescription_Document_ChangeColorScheme                  = 0x000e;
	window['AscDFH'].historydescription_Document_AddChart                           = 0x000f;
	window['AscDFH'].historydescription_Document_EditChart                          = 0x0010;
	window['AscDFH'].historydescription_Document_DragText                           = 0x0011;
	window['AscDFH'].historydescription_Document_DocumentContentExtendToPos         = 0x0012;
	window['AscDFH'].historydescription_Document_AddHeader                          = 0x0013;
	window['AscDFH'].historydescription_Document_AddFooter                          = 0x0014;
	window['AscDFH'].historydescription_Document_ParagraphExtendToPos               = 0x0015;
	window['AscDFH'].historydescription_Document_ParagraphChangeFrame               = 0x0016;
	window['AscDFH'].historydescription_Document_ReplaceAll                         = 0x0017;
	window['AscDFH'].historydescription_Document_ReplaceSingle                      = 0x0018;
	window['AscDFH'].historydescription_Document_TableAddNewRowByTab                = 0x0019;
	window['AscDFH'].historydescription_Document_AddNewShape                        = 0x001a;
	window['AscDFH'].historydescription_Document_EditWrapPolygon                    = 0x001b;
	window['AscDFH'].historydescription_Document_MoveInlineObject                   = 0x001c;
	window['AscDFH'].historydescription_Document_CopyAndMoveInlineObject            = 0x001d;
	window['AscDFH'].historydescription_Document_RotateInlineDrawing                = 0x001e;
	window['AscDFH'].historydescription_Document_RotateFlowDrawingCtrl              = 0x001f;
	window['AscDFH'].historydescription_Document_RotateFlowDrawingNoCtrl            = 0x0020;
	window['AscDFH'].historydescription_Document_MoveInGroup                        = 0x0021;
	window['AscDFH'].historydescription_Document_ChangeWrapContour                  = 0x0022;
	window['AscDFH'].historydescription_Document_ChangeWrapContourAddPoint          = 0x0023;
	window['AscDFH'].historydescription_Document_GrObjectsBringToFront              = 0x0024;
	window['AscDFH'].historydescription_Document_GrObjectsBringForwardGroup         = 0x0025;
	window['AscDFH'].historydescription_Document_GrObjectsBringForward              = 0x0026;
	window['AscDFH'].historydescription_Document_GrObjectsSendToBackGroup           = 0x0027;
	window['AscDFH'].historydescription_Document_GrObjectsSendToBack                = 0x0028;
	window['AscDFH'].historydescription_Document_GrObjectsBringBackwardGroup        = 0x0029;
	window['AscDFH'].historydescription_Document_GrObjectsBringBackward             = 0x002a;
	window['AscDFH'].historydescription_Document_GrObjectsChangeWrapPolygon         = 0x002b;
	window['AscDFH'].historydescription_Document_MathAutoCorrect                    = 0x002c;
	window['AscDFH'].historydescription_Document_SetFramePrWithFontFamily           = 0x002d;
	window['AscDFH'].historydescription_Document_SetFramePr                         = 0x002e;
	window['AscDFH'].historydescription_Document_SetFramePrWithFontFamilyLong       = 0x002f;
	window['AscDFH'].historydescription_Document_SetTextFontName                    = 0x0030;
	window['AscDFH'].historydescription_Document_SetTextFontSize                    = 0x0031;
	window['AscDFH'].historydescription_Document_SetTextBold                        = 0x0032;
	window['AscDFH'].historydescription_Document_SetTextItalic                      = 0x0033;
	window['AscDFH'].historydescription_Document_SetTextUnderline                   = 0x0034;
	window['AscDFH'].historydescription_Document_SetTextStrikeout                   = 0x0035;
	window['AscDFH'].historydescription_Document_SetTextDStrikeout                  = 0x0036;
	window['AscDFH'].historydescription_Document_SetTextSpacing                     = 0x0037;
	window['AscDFH'].historydescription_Document_SetTextCaps                        = 0x0038;
	window['AscDFH'].historydescription_Document_SetTextSmallCaps                   = 0x0039;
	window['AscDFH'].historydescription_Document_SetTextPosition                    = 0x003a;
	window['AscDFH'].historydescription_Document_SetTextLang                        = 0x003b;
	window['AscDFH'].historydescription_Document_SetParagraphLineSpacing            = 0x003c;
	window['AscDFH'].historydescription_Document_SetParagraphLineSpacingBeforeAfter = 0x003d;
	window['AscDFH'].historydescription_Document_IncFontSize                        = 0x003e;
	window['AscDFH'].historydescription_Document_DecFontSize                        = 0x003f;
	window['AscDFH'].historydescription_Document_SetParagraphBorders                = 0x0040;
	window['AscDFH'].historydescription_Document_SetParagraphPr                     = 0x0041;
	window['AscDFH'].historydescription_Document_SetParagraphAlign                  = 0x0042;
	window['AscDFH'].historydescription_Document_SetTextVertAlign                   = 0x0043;
	window['AscDFH'].historydescription_Document_SetParagraphNumbering              = 0x0044;
	window['AscDFH'].historydescription_Document_SetParagraphStyle                  = 0x0045;
	window['AscDFH'].historydescription_Document_SetParagraphPageBreakBefore        = 0x0046;
	window['AscDFH'].historydescription_Document_SetParagraphWidowControl           = 0x0047;
	window['AscDFH'].historydescription_Document_SetParagraphKeepLines              = 0x0048;
	window['AscDFH'].historydescription_Document_SetParagraphKeepNext               = 0x0049;
	window['AscDFH'].historydescription_Document_SetParagraphContextualSpacing      = 0x004a;
	window['AscDFH'].historydescription_Document_SetTextHighlightNone               = 0x004b;
	window['AscDFH'].historydescription_Document_SetTextHighlightColor              = 0x004c;
	window['AscDFH'].historydescription_Document_SetTextColor                       = 0x004d;
	window['AscDFH'].historydescription_Document_SetParagraphShd                    = 0x004e;
	window['AscDFH'].historydescription_Document_SetParagraphIndent                 = 0x004f;
	window['AscDFH'].historydescription_Document_IncParagraphIndent                 = 0x0050;
	window['AscDFH'].historydescription_Document_DecParagraphIndent                 = 0x0051;
	window['AscDFH'].historydescription_Document_SetParagraphIndentRight            = 0x0052;
	window['AscDFH'].historydescription_Document_SetParagraphIndentFirstLine        = 0x0053;
	window['AscDFH'].historydescription_Document_SetPageOrientation                 = 0x0054;
	window['AscDFH'].historydescription_Document_SetPageSize                        = 0x0055;
	window['AscDFH'].historydescription_Document_AddPageBreak                       = 0x0056;
	window['AscDFH'].historydescription_Document_AddPageNumToHdrFtr                 = 0x0057;
	window['AscDFH'].historydescription_Document_AddPageNumToCurrentPos             = 0x0058;
	window['AscDFH'].historydescription_Document_SetHdrFtrDistance                  = 0x0059;
	window['AscDFH'].historydescription_Document_SetHdrFtrFirstPage                 = 0x005a;
	window['AscDFH'].historydescription_Document_SetHdrFtrEvenAndOdd                = 0x005b;
	window['AscDFH'].historydescription_Document_SetHdrFtrLink                      = 0x005c;
	window['AscDFH'].historydescription_Document_AddTable                           = 0x005d;
	window['AscDFH'].historydescription_Document_TableAddRowAbove                   = 0x005e;
	window['AscDFH'].historydescription_Document_TableAddRowBelow                   = 0x005f;
	window['AscDFH'].historydescription_Document_TableAddColumnLeft                 = 0x0060;
	window['AscDFH'].historydescription_Document_TableAddColumnRight                = 0x0061;
	window['AscDFH'].historydescription_Document_TableRemoveRow                     = 0x0062;
	window['AscDFH'].historydescription_Document_TableRemoveColumn                  = 0x0063;
	window['AscDFH'].historydescription_Document_RemoveTable                        = 0x0064;
	window['AscDFH'].historydescription_Document_MergeTableCells                    = 0x0065;
	window['AscDFH'].historydescription_Document_SplitTableCells                    = 0x0066;
	window['AscDFH'].historydescription_Document_ApplyTablePr                       = 0x0067;
	window['AscDFH'].historydescription_Document_AddImageUrl                        = 0x0068;
	window['AscDFH'].historydescription_Document_AddImageUrlLong                    = 0x0069;
	window['AscDFH'].historydescription_Document_AddImageToPage                     = 0x006a;
	window['AscDFH'].historydescription_Document_ApplyImagePrWithUrl                = 0x006b;
	window['AscDFH'].historydescription_Document_ApplyImagePrWithUrlLong            = 0x006c;
	window['AscDFH'].historydescription_Document_ApplyImagePrWithFillUrl            = 0x006d;
	window['AscDFH'].historydescription_Document_ApplyImagePrWithFillUrlLong        = 0x006e;
	window['AscDFH'].historydescription_Document_ApplyImagePr                       = 0x006f;
	window['AscDFH'].historydescription_Document_AddHyperlink                       = 0x0070;
	window['AscDFH'].historydescription_Document_ChangeHyperlink                    = 0x0071;
	window['AscDFH'].historydescription_Document_RemoveHyperlink                    = 0x0072;
	window['AscDFH'].historydescription_Document_ReplaceMisspelledWord              = 0x0073;
	window['AscDFH'].historydescription_Document_AddComment                         = 0x0074;
	window['AscDFH'].historydescription_Document_RemoveComment                      = 0x0075;
	window['AscDFH'].historydescription_Document_ChangeComment                      = 0x0076;
	window['AscDFH'].historydescription_Document_SetTextFontNameLong                = 0x0077;
	window['AscDFH'].historydescription_Document_AddImage                           = 0x0078;
	window['AscDFH'].historydescription_Document_ClearFormatting                    = 0x0079;
	window['AscDFH'].historydescription_Document_AddSectionBreak                    = 0x007a;
	window['AscDFH'].historydescription_Document_AddMath                            = 0x007b;
	window['AscDFH'].historydescription_Document_SetParagraphTabs                   = 0x007c;
	window['AscDFH'].historydescription_Document_SetParagraphIndentFromRulers       = 0x007d;
	window['AscDFH'].historydescription_Document_SetDocumentMargin_Hor              = 0x007e;
	window['AscDFH'].historydescription_Document_SetTableMarkup_Hor                 = 0x007f;
	window['AscDFH'].historydescription_Document_SetDocumentMargin_Ver              = 0x0080;
	window['AscDFH'].historydescription_Document_SetHdrFtrBounds                    = 0x0081;
	window['AscDFH'].historydescription_Document_SetTableMarkup_Ver                 = 0x0082;
	window['AscDFH'].historydescription_Document_DocumentExtendToPos                = 0x0083;
	window['AscDFH'].historydescription_Document_AddDropCap                         = 0x0084;
	window['AscDFH'].historydescription_Document_RemoveDropCap                      = 0x0085;
	window['AscDFH'].historydescription_Document_SetTextHighlight                   = 0x0086;
	window['AscDFH'].historydescription_Document_BackSpaceButton                    = 0x0087;
	window['AscDFH'].historydescription_Document_MoveParagraphByTab                 = 0x0088;
	window['AscDFH'].historydescription_Document_AddTab                             = 0x0089;
	window['AscDFH'].historydescription_Document_EnterButton                        = 0x008a;
	window['AscDFH'].historydescription_Document_SpaceButton                        = 0x008b;
	window['AscDFH'].historydescription_Document_ShiftInsert                        = 0x008c;
	window['AscDFH'].historydescription_Document_ShiftInsertSafari                  = 0x008d;
	window['AscDFH'].historydescription_Document_DeleteButton                       = 0x008e;
	window['AscDFH'].historydescription_Document_ShiftDeleteButton                  = 0x008f;
	window['AscDFH'].historydescription_Document_SetStyleHeading1                   = 0x0090;
	window['AscDFH'].historydescription_Document_SetStyleHeading2                   = 0x0091;
	window['AscDFH'].historydescription_Document_SetStyleHeading3                   = 0x0092;
	window['AscDFH'].historydescription_Document_SetTextStrikeoutHotKey             = 0x0093;
	window['AscDFH'].historydescription_Document_SetTextBoldHotKey                  = 0x0094;
	window['AscDFH'].historydescription_Document_SetParagraphAlignHotKey            = 0x0095;
	window['AscDFH'].historydescription_Document_AddEuroLetter                      = 0x0096;
	window['AscDFH'].historydescription_Document_SetTextItalicHotKey                = 0x0097;
	window['AscDFH'].historydescription_Document_SetParagraphAlignHotKey2           = 0x0098;
	window['AscDFH'].historydescription_Document_SetParagraphNumberingHotKey        = 0x0099;
	window['AscDFH'].historydescription_Document_SetParagraphAlignHotKey3           = 0x009a;
	window['AscDFH'].historydescription_Document_AddPageNumHotKey                   = 0x009b;
	window['AscDFH'].historydescription_Document_SetParagraphAlignHotKey4           = 0x009c;
	window['AscDFH'].historydescription_Document_SetTextUnderlineHotKey             = 0x009d;
	window['AscDFH'].historydescription_Document_FormatPasteHotKey                  = 0x009e;
	window['AscDFH'].historydescription_Document_PasteHotKey                        = 0x009f;
	window['AscDFH'].historydescription_Document_PasteSafariHotKey                  = 0x00a0;
	window['AscDFH'].historydescription_Document_CutHotKey                          = 0x00a1;
	window['AscDFH'].historydescription_Document_SetTextVertAlignHotKey             = 0x00a2;
	window['AscDFH'].historydescription_Document_AddMathHotKey                      = 0x00a3;
	window['AscDFH'].historydescription_Document_SetTextVertAlignHotKey2            = 0x00a4;
	window['AscDFH'].historydescription_Document_MinusButton                        = 0x00a5;
	window['AscDFH'].historydescription_Document_SetTextVertAlignHotKey3            = 0x00a6;
	window['AscDFH'].historydescription_Document_AddLetter                          = 0x00a7;
	window['AscDFH'].historydescription_Document_MoveTableBorder                    = 0x00a8;
	window['AscDFH'].historydescription_Document_FormatPasteHotKey2                 = 0x00a9;
	window['AscDFH'].historydescription_Document_SetTextHighlight2                  = 0x00aa;
	window['AscDFH'].historydescription_Document_AddTextFromTextBox                 = 0x00ab;
	window['AscDFH'].historydescription_Document_AddMailMergeField                  = 0x00ac;
	window['AscDFH'].historydescription_Document_MoveInlineTable                    = 0x00ad;
	window['AscDFH'].historydescription_Document_MoveFlowTable                      = 0x00ae;
	window['AscDFH'].historydescription_Document_RestoreFieldTemplateText           = 0x00af;
	window['AscDFH'].historydescription_Spreadsheet_SetCellFontName                 = 0x00b0;
	window['AscDFH'].historydescription_Spreadsheet_SetCellFontSize                 = 0x00b1;
	window['AscDFH'].historydescription_Spreadsheet_SetCellBold                     = 0x00b2;
	window['AscDFH'].historydescription_Spreadsheet_SetCellItalic                   = 0x00b3;
	window['AscDFH'].historydescription_Spreadsheet_SetCellUnderline                = 0x00b4;
	window['AscDFH'].historydescription_Spreadsheet_SetCellStrikeout                = 0x00b5;
	window['AscDFH'].historydescription_Spreadsheet_SetCellSubscript                = 0x00b6;
	window['AscDFH'].historydescription_Spreadsheet_SetCellSuperscript              = 0x00b7;
	window['AscDFH'].historydescription_Spreadsheet_SetCellAlign                    = 0x00b8;
	window['AscDFH'].historydescription_Spreadsheet_SetCellVertAlign                = 0x00b9;
	window['AscDFH'].historydescription_Spreadsheet_SetCellTextColor                = 0x00ba;
	window['AscDFH'].historydescription_Spreadsheet_SetCellBackgroundColor          = 0x00bb;
	window['AscDFH'].historydescription_Spreadsheet_SetCellIncreaseFontSize         = 0x00bc;
	window['AscDFH'].historydescription_Spreadsheet_SetCellDecreaseFontSize         = 0x00bd;
	window['AscDFH'].historydescription_Spreadsheet_SetCellHyperlinkAdd             = 0x00be;
	window['AscDFH'].historydescription_Spreadsheet_SetCellHyperlinkModify          = 0x00bf;
	window['AscDFH'].historydescription_Spreadsheet_SetCellHyperlinkRemove          = 0x00c0;
	window['AscDFH'].historydescription_Spreadsheet_EditChart                       = 0x00c1;
	window['AscDFH'].historydescription_Spreadsheet_Remove                          = 0x00c2;
	window['AscDFH'].historydescription_Spreadsheet_AddTab                          = 0x00c3;
	window['AscDFH'].historydescription_Spreadsheet_AddNewParagraph                 = 0x00c4;
	window['AscDFH'].historydescription_Spreadsheet_AddSpace                        = 0x00c5;
	window['AscDFH'].historydescription_Spreadsheet_AddItem                         = 0x00c6;
	window['AscDFH'].historydescription_Spreadsheet_PutPrLineSpacing                = 0x00c7;
	window['AscDFH'].historydescription_Spreadsheet_SetParagraphSpacing             = 0x00c8;
	window['AscDFH'].historydescription_Spreadsheet_SetGraphicObjectsProps          = 0x00c9;
	window['AscDFH'].historydescription_Spreadsheet_ParaApply                       = 0x00ca;
	window['AscDFH'].historydescription_Spreadsheet_GraphicObjectLayer              = 0x00cb;
	window['AscDFH'].historydescription_Spreadsheet_ParagraphAdd                    = 0x00cc;
	window['AscDFH'].historydescription_Spreadsheet_CreateGroup                     = 0x00cd;
	window['AscDFH'].historydescription_CommonDrawings_ChangeAdj                    = 0x00ce;
	window['AscDFH'].historydescription_CommonDrawings_EndTrack                     = 0x00cf;
	window['AscDFH'].historydescription_CommonDrawings_CopyCtrl                     = 0x00d0;
	window['AscDFH'].historydescription_Presentation_ParaApply                      = 0x00d1;
	window['AscDFH'].historydescription_Presentation_ParaFormatPaste                = 0x00d2;
	window['AscDFH'].historydescription_Presentation_AddNewParagraph                = 0x00d3;
	window['AscDFH'].historydescription_Presentation_CreateGroup                    = 0x00d4;
	window['AscDFH'].historydescription_Presentation_UnGroup                        = 0x00d5;
	window['AscDFH'].historydescription_Presentation_AddChart                       = 0x00d6;
	window['AscDFH'].historydescription_Presentation_EditChart                      = 0x00d7;
	window['AscDFH'].historydescription_Presentation_ParagraphAdd                   = 0x00d8;
	window['AscDFH'].historydescription_Presentation_ParagraphClearFormatting       = 0x00d9;
	window['AscDFH'].historydescription_Presentation_SetParagraphAlign              = 0x00da;
	window['AscDFH'].historydescription_Presentation_SetParagraphSpacing            = 0x00db;
	window['AscDFH'].historydescription_Presentation_SetParagraphTabs               = 0x00dc;
	window['AscDFH'].historydescription_Presentation_SetParagraphIndent             = 0x00dd;
	window['AscDFH'].historydescription_Presentation_SetParagraphNumbering          = 0x00de;
	window['AscDFH'].historydescription_Presentation_ParagraphIncDecFontSize        = 0x00df;
	window['AscDFH'].historydescription_Presentation_ParagraphIncDecIndent          = 0x00e0;
	window['AscDFH'].historydescription_Presentation_SetImageProps                  = 0x00e1;
	window['AscDFH'].historydescription_Presentation_SetShapeProps                  = 0x00e2;
	window['AscDFH'].historydescription_Presentation_ChartApply                     = 0x00e3;
	window['AscDFH'].historydescription_Presentation_ChangeShapeType                = 0x00e4;
	window['AscDFH'].historydescription_Presentation_SetVerticalAlign               = 0x00e5;
	window['AscDFH'].historydescription_Presentation_HyperlinkAdd                   = 0x00e6;
	window['AscDFH'].historydescription_Presentation_HyperlinkModify                = 0x00e7;
	window['AscDFH'].historydescription_Presentation_HyperlinkRemove                = 0x00e8;
	window['AscDFH'].historydescription_Presentation_DistHor                        = 0x00e9;
	window['AscDFH'].historydescription_Presentation_DistVer                        = 0x00ea;
	window['AscDFH'].historydescription_Presentation_BringToFront                   = 0x00eb;
	window['AscDFH'].historydescription_Presentation_BringForward                   = 0x00ec;
	window['AscDFH'].historydescription_Presentation_SendToBack                     = 0x00ed;
	window['AscDFH'].historydescription_Presentation_BringBackward                  = 0x00ef;
	window['AscDFH'].historydescription_Presentation_ApplyTiming                    = 0x00f0;
	window['AscDFH'].historydescription_Presentation_MoveSlidesToEnd                = 0x00f1;
	window['AscDFH'].historydescription_Presentation_MoveSlidesNextPos              = 0x00f2;
	window['AscDFH'].historydescription_Presentation_MoveSlidesPrevPos              = 0x00f3;
	window['AscDFH'].historydescription_Presentation_MoveSlidesToStart              = 0x00f4;
	window['AscDFH'].historydescription_Presentation_MoveComments                   = 0x00f5;
	window['AscDFH'].historydescription_Presentation_TableBorder                    = 0x00f6;
	window['AscDFH'].historydescription_Presentation_AddFlowImage                   = 0x00f7;
	window['AscDFH'].historydescription_Presentation_AddFlowTable                   = 0x00f8;
	window['AscDFH'].historydescription_Presentation_ChangeBackground               = 0x00f9;
	window['AscDFH'].historydescription_Presentation_AddNextSlide                   = 0x00fa;
	window['AscDFH'].historydescription_Presentation_ShiftSlides                    = 0x00fb;
	window['AscDFH'].historydescription_Presentation_DeleteSlides                   = 0x00fc;
	window['AscDFH'].historydescription_Presentation_ChangeLayout                   = 0x00fd;
	window['AscDFH'].historydescription_Presentation_ChangeSlideSize                = 0x00fe;
	window['AscDFH'].historydescription_Presentation_ChangeColorScheme              = 0x00ff;
	window['AscDFH'].historydescription_Presentation_AddComment                     = 0x0100;
	window['AscDFH'].historydescription_Presentation_ChangeComment                  = 0x0101;
	window['AscDFH'].historydescription_Presentation_PutTextPrFontName              = 0x0102;
	window['AscDFH'].historydescription_Presentation_PutTextPrFontSize              = 0x0103;
	window['AscDFH'].historydescription_Presentation_PutTextPrBold                  = 0x0104;
	window['AscDFH'].historydescription_Presentation_PutTextPrItalic                = 0x0105;
	window['AscDFH'].historydescription_Presentation_PutTextPrUnderline             = 0x0106;
	window['AscDFH'].historydescription_Presentation_PutTextPrStrikeout             = 0x0107;
	window['AscDFH'].historydescription_Presentation_PutTextPrLineSpacing           = 0x0108;
	window['AscDFH'].historydescription_Presentation_PutTextPrSpacingBeforeAfter    = 0x0109;
	window['AscDFH'].historydescription_Presentation_PutTextPrIncreaseFontSize      = 0x010a;
	window['AscDFH'].historydescription_Presentation_PutTextPrDecreaseFontSize      = 0x010b;
	window['AscDFH'].historydescription_Presentation_PutTextPrAlign                 = 0x010c;
	window['AscDFH'].historydescription_Presentation_PutTextPrBaseline              = 0x010d;
	window['AscDFH'].historydescription_Presentation_PutTextPrListType              = 0x010e;
	window['AscDFH'].historydescription_Presentation_PutTextColor                   = 0x010f;
	window['AscDFH'].historydescription_Presentation_PutTextColor2                  = 0x010f;
	window['AscDFH'].historydescription_Presentation_PutPrIndent                    = 0x010f;
	window['AscDFH'].historydescription_Presentation_PutPrIndentRight               = 0x010f;
	window['AscDFH'].historydescription_Presentation_PutPrFirstLineIndent           = 0x010f;
	window['AscDFH'].historydescription_Presentation_AddPageBreak                   = 0x010f;
	window['AscDFH'].historydescription_Presentation_AddRowAbove                    = 0x0110;
	window['AscDFH'].historydescription_Presentation_AddRowBelow                    = 0x0111;
	window['AscDFH'].historydescription_Presentation_AddColLeft                     = 0x0112;
	window['AscDFH'].historydescription_Presentation_AddColRight                    = 0x0113;
	window['AscDFH'].historydescription_Presentation_RemoveRow                      = 0x0114;
	window['AscDFH'].historydescription_Presentation_RemoveCol                      = 0x0115;
	window['AscDFH'].historydescription_Presentation_RemoveTable                    = 0x0116;
	window['AscDFH'].historydescription_Presentation_MergeCells                     = 0x0117;
	window['AscDFH'].historydescription_Presentation_SplitCells                     = 0x0118;
	window['AscDFH'].historydescription_Presentation_TblApply                       = 0x0119;
	window['AscDFH'].historydescription_Presentation_RemoveComment                  = 0x011a;
	window['AscDFH'].historydescription_Presentation_EndFontLoad                    = 0x011b;
	window['AscDFH'].historydescription_Presentation_ChangeTheme                    = 0x011c;
	window['AscDFH'].historydescription_Presentation_TableMoveFromRulers            = 0x011d;
	window['AscDFH'].historydescription_Presentation_TableMoveFromRulersInline      = 0x011e;
	window['AscDFH'].historydescription_Presentation_PasteOnThumbnails              = 0x011f;
	window['AscDFH'].historydescription_Presentation_PasteOnThumbnailsSafari        = 0x0120;
	window['AscDFH'].historydescription_Document_ConvertOldEquation                 = 0x0121;
	window['AscDFH'].historydescription_Presentation_SetVert                        = 0x0122;
	window['AscDFH'].historydescription_Document_AddNewStyle                        = 0x0123;
	window['AscDFH'].historydescription_Document_RemoveStyle                        = 0x0124;
	window['AscDFH'].historydescription_Document_AddTextArt                         = 0x0125;
	window['AscDFH'].historydescription_Document_RemoveAllCustomStyles              = 0x0126;
	window['AscDFH'].historydescription_Document_AcceptAllRevisionChanges           = 0x0127;
	window['AscDFH'].historydescription_Document_RejectAllRevisionChanges           = 0x0128;
	window['AscDFH'].historydescription_Document_AcceptRevisionChange               = 0x0129;
	window['AscDFH'].historydescription_Document_RejectRevisionChange               = 0x012a;
	window['AscDFH'].historydescription_Document_AcceptRevisionChangesBySelection   = 0x012b;
	window['AscDFH'].historydescription_Document_RejectRevisionChangesBySelection   = 0x012c;
	window['AscDFH'].historydescription_Document_AddLetterUnion                     = 0x012d;
	window['AscDFH'].historydescription_Presentation_ApplyTimingToAll               = 0x012e;
	window['AscDFH'].historydescription_Document_SetColumnsFromRuler                = 0x012f;
	window['AscDFH'].historydescription_Document_SetColumnsProps                    = 0x0130;
	window['AscDFH'].historydescription_Document_AddColumnBreak                     = 0x0131;
	window['AscDFH'].historydescription_Document_SetSectionProps                    = 0x0132;
	window['AscDFH'].historydescription_Document_AddTabToMath                       = 0x0133;
	window['AscDFH'].historydescription_Document_SetMathProps                       = 0x0134;
	window['AscDFH'].historydescription_Document_ApplyPrToMath                      = 0x0135;
	window['AscDFH'].historydescription_Document_ApiBuilder                         = 0x0136;
	window['AscDFH'].historydescription_Document_AddOleObject                       = 0x0137;
	window['AscDFH'].historydescription_Document_EditOleObject                      = 0x0138;
	window['AscDFH'].historydescription_Document_CompositeInput                     = 0x0139;
})(window);
