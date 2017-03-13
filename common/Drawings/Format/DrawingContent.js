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
(function (window, undefined){


    /**
     * CDrawingDocContent
     * @constructor
     * @extends {CDocumentContent}
     */
    function CDrawingDocContent(Parent, DrawingDocument, X, Y, XLimit, YLimit) {
		CDocumentContent.call(this, Parent, DrawingDocument, X, Y, XLimit, YLimit, false, false, true);
        this.FullRecalc = new CDocumentRecalculateState();
    }

	CDrawingDocContent.prototype = Object.create(CDocumentContent.prototype);
	CDrawingDocContent.prototype.constructor = CDrawingDocContent;

    CDrawingDocContent.prototype.Get_SummaryHeight = function(){
        var fSummHeight = 0;
        var nColumnsCount = this.Get_ColumnsCount();
        for(var i = 0; i < this.Pages.length; ++i){
            var oPage = this.Pages[i];
            var fPageHeight = 0;
            if(oPage.Sections.length > 0){
                var aColumns = oPage.Sections[0].Columns;
                for(var j = 0; j < aColumns.length; ++j){
                    var oColumn = aColumns[j];
                    for(var k = oColumn.Pos; k <= oColumn.EndPos; ++k){
                        var nElementPageIndex = this.private_GetElementPageIndex(k, i, j, nColumnsCount);
                        var fParagraphPageBottom = this.Content[k].Get_PageBounds(nElementPageIndex).Bottom;
                        if(fPageHeight < fParagraphPageBottom){
                            fPageHeight = fParagraphPageBottom;
                        }
                    }
                }
            }
            else{
                var Bounds = this.Get_PageBounds(i);
                fPageHeight = Bounds.Bottom - Bounds.Top;
            }
            fSummHeight += fPageHeight;
        }
        return fSummHeight;
    };
    CDrawingDocContent.prototype.Get_ColumnsCount = function(){
        var nColumnCount = 1;
        if(this.Parent.getBodyPr){
            var oBodyPr = this.Parent.getBodyPr();
            nColumnCount = AscFormat.isRealNumber(oBodyPr.numCol) ? oBodyPr.numCol : 1;
        }
        return nColumnCount;
    };

    CDrawingDocContent.prototype.Get_PageContentStartPos2 = function(StartPageIndex, StartColumnIndex, ElementPageIndex, ElementIndex){
        var ColumnsCount = this.Get_ColumnsCount();
        var nColumnIndex    = (StartColumnIndex + ElementPageIndex) - ((StartColumnIndex + ElementPageIndex) / ColumnsCount | 0) * ColumnsCount;
        return this.Get_PageContentStartPos3(nColumnIndex);
    };


    CDrawingDocContent.prototype.Get_PageContentStartPos3 = function(nColumnIndex){

        var X = this.X;
        var Y = this.Y;
        var XLimit = this.XLimit;
        var YLimit = this.YLimit;
        var ColumnSpaceBefore = 0;
        var ColumnSpaceAfter = 0;
        var nNumCol = this.Get_ColumnsCount();
        var oBodyPr = this.Parent.getBodyPr && this.Parent.getBodyPr();
        if(nNumCol > 1 && oBodyPr)
        {
            var fSpace = AscFormat.isRealNumber(oBodyPr.spcCol) ? oBodyPr.spcCol : 0;
            var fColumnWidth = Math.max((this.XLimit - this.X - (nNumCol - 1)*fSpace)/nNumCol, 0);
            X += nColumnIndex*(fColumnWidth + fSpace);
            XLimit = X + fColumnWidth;
            if(nColumnIndex > 0)
            {
                ColumnSpaceBefore = fSpace;
            }
            if(nColumnIndex < nNumCol - 1)
            {
                ColumnSpaceAfter = fSpace;
            }
        }
        return {
            X                 : X,
            Y                 : Y,
            XLimit            : XLimit,
            YLimit            : YLimit,
            ColumnSpaceBefore : ColumnSpaceBefore,
            ColumnSpaceAfter  : ColumnSpaceAfter
        };
    };


    CDrawingDocContent.prototype.RecalculateContent = function(fWidth, fHeight, nStartPage){
        if(this.Get_ColumnsCount() === 1){
            CDocumentContent.prototype.RecalculateContent.call(this, fWidth, fHeight, nStartPage);
        }
        else{
            this.Start_Recalculate(fWidth, fHeight);
            if(this.Pages.length > 1){
                var fSummaryHeight = this.Get_SummaryHeight();
                var fNeedHeight = fSummaryHeight;
                if(this.Get_ColumnsCount() > 1){
                    var fLow = fHeight, fHigh = fSummaryHeight;
                    while((fHigh - fLow) > 0.1){
                        var fCheckHeight = fLow +  (fHigh - fLow)/2;
                        this.Start_Recalculate(fWidth, fCheckHeight);
                        if(this.Pages.length > 1){
                            fLow = fCheckHeight;
                        }
                        else{
                            fHigh = fCheckHeight;
                            fNeedHeight = fCheckHeight;
                        }
                    }
                }
                this.Start_Recalculate(fWidth, fNeedHeight + 0.01);
            }
        }
    };

    CDrawingDocContent.prototype.Start_Recalculate = function(fWidth, fHeight){
        this.FullRecalc.PageIndex         = 0;
        this.FullRecalc.SectionIndex      = 0;
        this.FullRecalc.ColumnIndex       = 0;
        this.FullRecalc.StartIndex        = 0;
        this.FullRecalc.Start             = true;
        this.FullRecalc.StartPage         = 0;
        this.Reset(0, 0, fWidth, fHeight);
        this.Recalculate_PageDrawing();
    };

    CDrawingDocContent.prototype.Recalculate_PageDrawing   = function()
    {
        var nColumnsCount = this.Get_ColumnsCount();
        var nPageIndex = this.FullRecalc.PageIndex;
        this.Pages.length = nPageIndex + 1;
        if(0 === this.FullRecalc.ColumnIndex && true === this.FullRecalc.Start)
        {
            var oPage      = new CDocumentPage();
            oPage.Pos = this.FullRecalc.StartIndex;
            oPage.Sections[0] = new CDocumentPageSection();
            for (var i = 0; i < nColumnsCount; ++i)
            {
                oPage.Sections[0].Columns[i] = new CDocumentPageColumn();
            }
            this.Pages[nPageIndex] = oPage;
        }
        this.Recalculate_PageColumn();
    };

    CDrawingDocContent.prototype.Recalculate_PageColumn = function()
    {
        var nPageIndex          = this.FullRecalc.PageIndex;
        var nColumnIndex        = this.FullRecalc.ColumnIndex;
        var nStartIndex         = this.FullRecalc.StartIndex;

        var oStartPos = this.Get_PageContentStartPos3(nColumnIndex);
        var X = oStartPos.X;
        var Y = oStartPos.Y;
        var XLimit = oStartPos.XLimit;
        var YLimit = oStartPos.YLimit;

        var nColumnsCount = this.Get_ColumnsCount();

        var aContent = this.Content;
        var nCount = aContent.length;
        var nRecalcResult = recalcresult_NextPage;
        var oParagraph;
        var bContinue = false;

        var oPage = this.Pages[nPageIndex];
        var oSection = oPage.Sections[0];
        var oColumn = oSection.Columns[nColumnIndex];
        oColumn.X           = X;
        oColumn.XLimit      = XLimit;
        oColumn.Y           = Y;
        oColumn.YLimit      = YLimit;
        oColumn.Pos         = nStartIndex;
        oColumn.Empty       = false;
        oColumn.SpaceBefore = oStartPos.ColumnSpaceBefore;
        oColumn.SpaceAfter  = oStartPos.ColumnSpaceAfter;
        for(var i = nStartIndex; i < nCount; ++i)
        {
            oParagraph = this.Content[i];

            if((0 === i && 0 === nPageIndex && 0 === nColumnIndex) || i != nStartIndex || (i === nStartIndex && true === this.FullRecalc.ResetStartElement))
            {
                oParagraph.Set_DocumentIndex(i);
                oParagraph.Reset(X, Y, XLimit, YLimit, nPageIndex, nColumnIndex, nColumnsCount);
            }
            var nElementPageIndex = this.private_GetElementPageIndex(i, nPageIndex, nColumnIndex, nColumnsCount);
            nRecalcResult = oParagraph.Recalculate_Page(nElementPageIndex);
            if(nRecalcResult & recalcresult_NextElement)
            {
                Y = oParagraph.Get_PageBounds(nElementPageIndex).Bottom;
            }
            oColumn.Bounds.Bottom = Y;
            if (nRecalcResult & recalcresult_CurPage)
            {
                if (nRecalcResult & recalcresultflags_Column)
                {
                    this.FullRecalc.ColumnIndex = nColumnIndex;
                }
                else
                {
                    this.FullRecalc.ColumnIndex = 0;
                }
                bContinue = true;
                break;
            }
            else if(nRecalcResult & recalcresult_NextPage)
            {
                if (nRecalcResult & recalcresultflags_LastFromNewColumn)
                {
                    oColumn.EndPos  = i - 1;
                    oSection.EndPos = i - 1;
                    oPage.EndPos    = i - 1;
                    bContinue       = true;
                    this.FullRecalc.ColumnIndex = nColumnIndex + 1;
                    this.FullRecalc.PageIndex   = nPageIndex;
                    this.FullRecalc.StartIndex  = i;
                    this.FullRecalc.Start       = true;
                    if (this.FullRecalc.ColumnIndex >= nColumnsCount)
                    {
                        this.FullRecalc.ColumnIndex = 0;
                        this.FullRecalc.PageIndex   = nPageIndex + 1;
                    }
                    break;
                }
                else if (nRecalcResult & recalcresultflags_LastFromNewPage)
                {
                    oColumn.EndPos  = i - 1;
                    oSection.EndPos = i - 1;
                    oPage.EndPos    = i - 1;
                    bContinue = true;
                    this.FullRecalc.SectionIndex = 0;
                    this.FullRecalc.ColumnIndex  = 0;
                    this.FullRecalc.PageIndex    = nPageIndex + 1;
                    this.FullRecalc.StartIndex   = i;
                    this.FullRecalc.Start        = true;
                    if (oColumn.EndPos === oColumn.Pos)
                    {
                        var Element          = this.Content[oColumn.Pos];
                        var ElementPageIndex = this.private_GetElementPageIndex(i, nPageIndex, nColumnIndex, nColumnsCount);
                        if (true === Element.Is_EmptyPage(ElementPageIndex))
                            oColumn.Empty = true;
                    }
                    for (var TempColumnIndex = ColumnIndex + 1; TempColumnIndex < ColumnsCount; ++TempColumnIndex)
                    {
                        oSection.Columns[TempColumnIndex].Empty  = true;
                        oSection.Columns[TempColumnIndex].Pos    = i;
                        oSection.Columns[TempColumnIndex].EndPos = i - 1;
                    }
                    break;
                }
                else if (nRecalcResult & recalcresultflags_Page)
                {
                    oColumn.EndPos  = i;
                    oSection.EndPos = i;
                    oPage.EndPos    = i;

                    bContinue = true;

                    this.FullRecalc.SectionIndex = 0;
                    this.FullRecalc.ColumnIndex  = 0;
                    this.FullRecalc.PageIndex    = nPageIndex + 1;
                    this.FullRecalc.StartIndex   = i;
                    this.FullRecalc.Start       = true;

                    if (oColumn.EndPos === oColumn.Pos)
                    {
                        var Element          = this.Content[oColumn.Pos];
                        var ElementPageIndex = this.private_GetElementPageIndex(i, nPageIndex, nColumnIndex, nColumnsCount);
                        if (true === Element.Is_EmptyPage(nElementPageIndex))
                            oColumn.Empty = true;
                    }
                    for (var TempColumnIndex = nColumnIndex + 1; TempColumnIndex < nColumnsCount; ++TempColumnIndex)
                    {
                        var ElementPageIndex = this.private_GetElementPageIndex(i, nPageIndex, TempColumnIndex, nColumnsCount);
                        this.Content[Index].Recalculate_SkipPage(ElementPageIndex);
                        oSection.Columns[TempColumnIndex].Empty  = true;
                        oSection.Columns[TempColumnIndex].Pos    = i;
                        oSection.Columns[TempColumnIndex].EndPos = i - 1;
                    }
                    break;
                }
                else
                {
                    oColumn.EndPos  = i;
                    oSection.EndPos = i;
                    oPage.EndPos    = i;

                    bContinue = true;

                    this.FullRecalc.ColumnIndex = nColumnIndex + 1;
                    if (this.FullRecalc.ColumnIndex >= nColumnsCount)
                    {
                        this.FullRecalc.SectionIndex = 0;
                        this.FullRecalc.ColumnIndex  = 0;
                        this.FullRecalc.PageIndex    = nPageIndex + 1;
                    }

                    this.FullRecalc.StartIndex = i;
                    this.FullRecalc.Start     = true;

                    if (oColumn.EndPos === oColumn.Pos)
                    {
                        var Element          = this.Content[oColumn.Pos];
                        var ElementPageIndex = this.private_GetElementPageIndex(i, nPageIndex, nColumnIndex, nColumnsCount);
                        if (true === Element.Is_EmptyPage(ElementPageIndex))
                            oColumn.Empty = true;
                    }

                    break;
                }
            }
        }
        if (i === nCount)
        {
            oPage.EndPos    = nCount - 1;
            oSection.EndPos = nCount - 1;
            oColumn.EndPos  = nCount  - 1;
        }
        if(bContinue)
        {
            this.Recalculate_PageDrawing();
        }
    };

    CDrawingDocContent.prototype.Draw = function(nPageIndex, pGraphics){
        if(this.Pages.length > 0){

            var oSection = this.Pages[0].Sections[0];
            if(oSection){

                if (pGraphics.Start_Command)
                {
                    pGraphics.Start_Command(AscFormat.DRAW_COMMAND_CONTENT);
                }

                for (var ColumnIndex = 0, ColumnsCount = oSection.Columns.length; ColumnIndex < ColumnsCount; ++ColumnIndex)
                {
                    var Column         = oSection.Columns[ColumnIndex];
                    var ColumnStartPos = Column.Pos;
                    var ColumnEndPos   = Column.EndPos;

                    // Плавающие объекты не должны попадать в клип колонок
                    var FlowElements = [];

                    if (ColumnsCount > 1)
                    {
                        //    pGraphics.SaveGrState();

                        var X    = ColumnIndex === 0 ? 0 : Column.X - Column.SpaceBefore / 2;
                        // var XEnd = (ColumnIndex >= ColumnsCount - 1 ? Page.Width : Column.XLimit + Column.SpaceAfter / 2);
                        //  pGraphics.AddClipRect(X, 0, XEnd - X, Page.Height);
                    }

                    for (var ContentPos = ColumnStartPos; ContentPos <= ColumnEndPos; ++ContentPos)
                    {
                        var ElementPageIndex = this.private_GetElementPageIndex(ContentPos, 0, ColumnIndex, ColumnsCount);
                        this.Content[ContentPos].Draw(ElementPageIndex, pGraphics);
                    }

                    /*if (ColumnsCount > 1)
                     {
                     pGraphics.RestoreGrState();
                     }*/
                }

                if (pGraphics.End_Command)
                {
                    pGraphics.End_Command();
                }
            }

            else{
                CDocumentContent.prototype.Draw.call(this, nPageIndex, pGraphics);
            }
        }
    };

    CDrawingDocContent.prototype.Write_ToBinary2 = function(oWriter){
        oWriter.WriteLong(AscDFH.historyitem_type_DrawingContent);
        CDocumentContent.prototype.Write_ToBinary2.call(this, oWriter);
    };
    CDrawingDocContent.prototype.Read_FromBinary2 = function(oReader){
        oReader.GetLong();//type of DocumentContent
        CDocumentContent.prototype.Read_FromBinary2.call(this, oReader);
    };
    CDrawingDocContent.prototype.Is_TableCellContent = function(){
        return false;
    };

    CDrawingDocContent.prototype.Is_ChartTitleContent = function(){
        if(this.Parent instanceof AscFormat.CTextBody &&
        this.Parent.parent instanceof AscFormat.CTitle){
            return true;
        }
        return false;
    };

    CDrawingDocContent.prototype.Selection_Draw_Page = function(PageIndex){
        var CurPage = PageIndex;
        if (CurPage < 0 || CurPage >= this.Pages.length)
            return;
        var Pos_start = this.Pages[CurPage].Pos;
        var Pos_end   = this.Pages[CurPage].EndPos;

        if (true === this.Selection.Use)
        {
            if(this.Selection.Flag === selectionflag_Common)
            {
                var Start = this.Selection.StartPos;
                var End   = this.Selection.EndPos;

                if (Start > End)
                {
                    Start = this.Selection.EndPos;
                    End   = this.Selection.StartPos;
                }

                var Start = Math.max(Start, Pos_start);
                var End   = Math.min(End, Pos_end);

                var Page = this.Pages[PageIndex];
                if(this.Pages[PageIndex].Sections.length === 0){
                    for (var Index = Start; Index <= End; Index++)
                    {
                        var ElementPageIndex = this.private_GetElementPageIndex(Index, CurPage, 0, 1);
                        this.Content[Index].Selection_Draw_Page(ElementPageIndex);
                    }
                }
                else{
                    var PageSection = Page.Sections[0];
                    for (var ColumnIndex = 0, ColumnsCount = PageSection.Columns.length; ColumnIndex < ColumnsCount; ++ColumnIndex)
                    {
                        var Pos_start = Page.Pos;
                        var Pos_end   = Page.EndPos;

                        var Start = this.Selection.StartPos;
                        var End   = this.Selection.EndPos;

                        if (Start > End)
                        {
                            Start = this.Selection.EndPos;
                            End   = this.Selection.StartPos;
                        }

                        var Start = Math.max(Start, Pos_start);
                        var End   = Math.min(End, Pos_end);

                        for (var Index = Start; Index <= End; ++Index)
                        {
                            var ElementPage = this.private_GetElementPageIndex(Index, 0, ColumnIndex, ColumnsCount);
                            this.Content[Index].Selection_Draw_Page(ElementPage);
                        }

                    }
                }

            }
        }
    };

    CDrawingDocContent.prototype.Internal_GetContentPosByXY = function(X, Y, PageNum, ColumnsInfo)
    {
        if (!ColumnsInfo)
            ColumnsInfo = {Column : 0, ColumnsCount : 1};

        if (undefined === PageNum || null === PageNum)
            PageNum = this.CurPage;
        // Теперь проверим пустые параграфы с окончанием секций
        var SectCount = this.Pages[PageNum].EndSectionParas.length;
        if(this.Pages[PageNum].Sections.length === 0){
            return CDocumentContent.prototype.Internal_GetContentPosByXY.call(this, X, Y, PageNum, ColumnsInfo);
        }
        for (var Index = 0; Index < SectCount; ++Index)
        {
            var Item   = this.Pages[PageNum].EndSectionParas[Index];
            var Bounds = Item.Pages[0].Bounds;

            if (Y < Bounds.Bottom && Y > Bounds.Top && X > Bounds.Left && X < Bounds.Right)
            {
                var Element              = this.Content[Item.Index];
                ColumnsInfo.Column       = Element.Get_StartColumn();
                ColumnsInfo.ColumnsCount = Element.Get_ColumnsCount();
                return Item.Index;
            }
        }

        // Сначала мы определим секцию и колонку, в которую попали
        var Page = this.Pages[PageNum];

        var SectionIndex = 0;
        for (var SectionsCount = Page.Sections.length; SectionIndex < SectionsCount - 1; ++SectionIndex)
        {
            if (Y < Page.Sections[SectionIndex + 1].Y)
                break;
        }

        var PageSection  = this.Pages[PageNum].Sections[SectionIndex];
        var ColumnsCount = PageSection.Columns.length;
        var ColumnIndex  = 0;
        for (; ColumnIndex < ColumnsCount - 1; ++ColumnIndex)
        {
            if (X < (PageSection.Columns[ColumnIndex].XLimit + PageSection.Columns[ColumnIndex + 1].X) / 2)
                break;
        }

        // TODO: Разобраться с ситуацией, когда пустые колонки стоят не только в конце
        while (ColumnIndex > 0 && true === PageSection.Columns[ColumnIndex].Empty)
            ColumnIndex--;

        ColumnsInfo.Column       = ColumnIndex;
        ColumnsInfo.ColumnsCount = ColumnsCount;

        var Column   = PageSection.Columns[ColumnIndex];
        var StartPos = Column.Pos;
        var EndPos   = Column.EndPos;

        for (var Pos = StartPos; Pos < EndPos; ++Pos)
        {
            var Item = this.Content[Pos + 1];
            var PageBounds = Item.Get_PageBounds(0);
            if (Y < PageBounds.Top)
                return Pos;
        }

        if (Pos === EndPos)
        {
            return EndPos;
        }
        return 0;
    };

    CDrawingDocContent.prototype.private_GetElementPageIndexByXY = function(ElementPos, X, Y, PageIndex){
        if(this.Pages.length > 0){
            if(this.Pages[0].Sections.length > 0){
                return CDocument_prototype_private_GetElementPageIndexByXY.call(this, ElementPos, X, Y, PageIndex);
            }
        }
        return CDocumentContent.prototype.private_GetElementPageIndexByXY.call(this, ElementPos, X, Y, PageIndex);
    };
    CDrawingDocContent.prototype.Copy            = function(Parent, DrawingDocument)
    {
        var DC = new CDrawingDocContent(Parent, DrawingDocument ? DrawingDocument : this.DrawingDocument, 0, 0, 0, 0, this.Split, this.TurnOffInnerWrap, this.bPresentation);

        // Копируем содержимое
        DC.Internal_Content_RemoveAll();

        var Count = this.Content.length;
        for (var Index = 0; Index < Count; Index++)
        {
            DC.Internal_Content_Add(Index, this.Content[Index].Copy(DC, DrawingDocument), false);
        }

        return DC;
    };
    CDrawingDocContent.prototype.Copy3           = function(Parent)//для заголовков диаграмм
    {
        var DC = new CDrawingDocContent(Parent, this.DrawingDocument, 0, 0, 0, 0, this.Split, this.TurnOffInnerWrap, true);

        // Копируем содержимое
        DC.Internal_Content_RemoveAll();

        var Count = this.Content.length;
        for (var Index = 0; Index < Count; Index++)
        {
            DC.Internal_Content_Add(Index, this.Content[Index].Copy2(DC), false);
        }
        return DC;
    };

    // TODO: сделать по-нормальному!!!
    function CDocument_prototype_private_GetElementPageIndexByXY(ElementPos, X, Y, PageIndex)
    {
        var Element = this.Content[ElementPos];
    	if (!Element)
    		return 0;

    	var Page = this.Pages[PageIndex];
    	if (!Page)
    		return 0;

    	var PageSection = null;
    	for (var SectionIndex = 0, SectionsCount = Page.Sections.length; SectionIndex < SectionsCount; ++SectionIndex)
    	{
    		if (Page.Sections[SectionIndex].Pos <= ElementPos && ElementPos <= Page.Sections[SectionIndex].EndPos)
    		{
    			PageSection = Page.Sections[SectionIndex];
    			break;
    		}
    	}

    	if (!PageSection)
    		return 0;

    	var ElementStartPage   = Element.Get_StartPage_Relative();
    	var ElementStartColumn = Element.Get_StartColumn();
    	var ElementPagesCount  = Element.Get_PagesCount();

    	var ColumnsCount = PageSection.Columns.length;
    	var StartColumn  = 0;
    	var EndColumn    = ColumnsCount - 1;

    	if (PageIndex === ElementStartPage)
    	{
    		StartColumn = Element.Get_StartColumn();
    		EndColumn   = Math.min(ElementStartColumn + ElementPagesCount - 1, ColumnsCount - 1);
    	}
    	else
    	{
    		StartColumn = 0;
    		EndColumn   = Math.min(ElementPagesCount - ElementStartColumn + (PageIndex - ElementStartPage) * ColumnsCount, ColumnsCount - 1);
    	}

    	// TODO: Разобраться с ситуацией, когда пустые колонки стоят не только в конце
    	while (true === PageSection.Columns[EndColumn].Empty && EndColumn > StartColumn)
    		EndColumn--;

    	var ResultColumn = EndColumn;
    	for (var ColumnIndex = StartColumn; ColumnIndex < EndColumn; ++ColumnIndex)
    	{
    		if (X < (PageSection.Columns[ColumnIndex].XLimit + PageSection.Columns[ColumnIndex + 1].X) / 2)
    		{
    			ResultColumn = ColumnIndex;
    			break;
    		}
    	}

    	return this.private_GetElementPageIndex(ElementPos, PageIndex, ResultColumn, ColumnsCount);
    }

    AscFormat.CDrawingDocContent = CDrawingDocContent;
})(window);