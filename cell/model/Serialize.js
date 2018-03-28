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
(function(window, undefined) {

      // Import
	var openXml = AscCommon.openXml;

      var g_memory = AscFonts.g_memory;
      var DecodeBase64Char = AscFonts.DecodeBase64Char;
      var b64_decode = AscFonts.b64_decode;
      
      var CellValueType = AscCommon.CellValueType;
      var c_oAscCellAnchorType = AscCommon.c_oAscCellAnchorType;
      var c_oAscBorderStyles = AscCommon.c_oAscBorderStyles;
      var gc_nMaxRow0 = AscCommon.gc_nMaxRow0;
      var gc_nMaxCol0 = AscCommon.gc_nMaxCol0;
      var Binary_CommonReader = AscCommon.Binary_CommonReader;
      var BinaryCommonWriter = AscCommon.BinaryCommonWriter;
      var c_oSerPropLenType = AscCommon.c_oSerPropLenType;
      var c_oSerConstants = AscCommon.c_oSerConstants;
    var History = AscCommon.History;
    var pptx_content_loader = AscCommon.pptx_content_loader;
    var pptx_content_writer = AscCommon.pptx_content_writer;

      var c_oAscPageOrientation = Asc.c_oAscPageOrientation;
    
    var g_oDefaultFormat = AscCommonExcel.g_oDefaultFormat;
	var g_StyleCache = AscCommonExcel.g_StyleCache;

//dif:
//Version:2 добавлены свойства колонок и строк CustomWidth, CustomHeight(раньше считались true)
    /** @enum */
    var c_oSerTableTypes =
    {
        Other: 0,
        SharedStrings: 1,
        Styles: 2,
        Workbook: 3,
        Worksheets: 4,
        CalcChain: 5
    };
    /** @enum */
    var c_oSerStylesTypes =
    {
        Borders: 0,
        Border: 1,
        CellXfs: 2,
        Xfs: 3,
        Fills: 4,
        Fill: 5,
        Fonts: 6,
        Font: 7,
        NumFmts: 8,
        NumFmt: 9,
        Dxfs: 10,
        Dxf: 11,
        TableStyles: 12,
        CellStyleXfs: 14,
        CellStyles: 15,
        CellStyle: 16
    };
    /** @enum */
    var c_oSerBorderTypes =
    {
        Bottom: 0,
        Diagonal: 1,
        End: 2,
        Horizontal: 3,
        Start: 4,
        Top: 5,
        Vertical: 6,
        DiagonalDown: 7,
        DiagonalUp: 8,
        Outline: 9
    };
    /** @enum */
    var c_oSerBorderPropTypes =
    {
        Color: 0,
        Style: 1
    };
    /** @enum */
    var c_oSerXfsTypes =
    {
        ApplyAlignment: 0,
        ApplyBorder: 1,
        ApplyFill: 2,
        ApplyFont: 3,
        ApplyNumberFormat: 4,
        ApplyProtection: 5,
        BorderId: 6,
        FillId: 7,
        FontId: 8,
        NumFmtId: 9,
        PivotButton: 10,
        QuotePrefix: 11,
        XfId: 12,
        Aligment: 13,
        Protection: 14
    };
    /** @enum */
    var c_oSerAligmentTypes =
    {
        Horizontal: 0,
        Indent: 1,
        JustifyLastLine: 2,
        ReadingOrder: 3,
        RelativeIndent: 4,
        ShrinkToFit: 5,
        TextRotation: 6,
        Vertical: 7,
        WrapText: 8
    };
    /** @enum */
    var c_oSerFillTypes =
    {
        PatternFill: 0,
        PatternFillBgColor: 1
    };
    /** @enum */
    var c_oSerFontTypes =
    {
        Bold: 0,
        Color: 1,
        Italic: 3,
        RFont: 4,
        Strike: 5,
        Sz: 6,
        Underline: 7,
        VertAlign: 8,
        Scheme: 9
    };
    /** @enum */
    var c_oSerNumFmtTypes =
    {
        FormatCode: 0,
        NumFmtId: 1
    };
    /** @enum */
    var c_oSerSharedStringTypes =
    {
        Si: 0,
        Run: 1,
        RPr: 2,
        Text: 3
    };
    /** @enum */
    var c_oSerWorkbookTypes =
    {
        WorkbookPr: 0,
        BookViews: 1,
        WorkbookView: 2,
        DefinedNames: 3,
        DefinedName: 4,
        ExternalReferences: 5,
        ExternalReference: 6,
        PivotCaches: 7,
        PivotCache: 8,
        ExternalBook: 9,
        OleLink:10,
		DdeLink: 11,
		VbaProject: 12,
		JsaProject: 13,
		Comments: 14
    };
    /** @enum */
    var c_oSerWorkbookPrTypes =
    {
        Date1904: 0,
        DateCompatibility: 1,
		HidePivotFieldList: 2,
		ShowPivotChartFilter: 3
    };
    /** @enum */
    var c_oSerWorkbookViewTypes =
    {
        ActiveTab: 0
    };
    /** @enum */
    var c_oSerDefinedNameTypes =
    {
        Name: 0,
        Ref: 1,
        LocalSheetId: 2,
        Hidden: 3
    };
    /** @enum */
    var c_oSerWorksheetsTypes =
    {
        Worksheet: 0,
        WorksheetProp: 1,
        Cols: 2,
        Col: 3,
        Dimension: 4,
        Hyperlinks: 5,
        Hyperlink: 6,
        MergeCells: 7,
        MergeCell: 8,
        SheetData: 9,
        Row: 10,
        SheetFormatPr: 11,
        Drawings: 12,
        Drawing: 13,
        PageMargins: 14,
        PageSetup: 15,
        PrintOptions: 16,
        Autofilter: 17,
        TableParts: 18,
        Comments: 19,
        Comment: 20,
        ConditionalFormatting: 21,
        SheetViews: 22,
        SheetView: 23,
        SheetPr: 24,
        SparklineGroups: 25,
		PivotTable: 26
    };
    /** @enum */
    var c_oSerWorksheetPropTypes =
    {
        Name: 0,
        SheetId: 1,
        State: 2,
        Ref: 3
    };
    /** @enum */
    var c_oSerWorksheetColTypes =
    {
        BestFit: 0,
        Hidden: 1,
        Max: 2,
        Min: 3,
        Style: 4,
        Width: 5,
        CustomWidth: 6
    };
    /** @enum */
    var c_oSerHyperlinkTypes =
    {
        Ref: 0,
        Hyperlink: 1,
        Location: 2,
        Tooltip: 3
    };
    /** @enum */
    var c_oSerSheetFormatPrTypes =
    {
        DefaultColWidth		: 0,
        DefaultRowHeight	: 1,
        BaseColWidth		: 2,
        CustomHeight		: 3,
        ZeroHeight			: 4
    };
    /** @enum */
    var c_oSerRowTypes =
    {
        Row: 0,
        Style: 1,
        Height: 2,
        Hidden: 3,
        Cells: 4,
        Cell: 5,
        CustomHeight: 6
    };
    /** @enum */
    var c_oSerCellTypes =
    {
        Ref: 0,
        Style: 1,
        Type: 2,
        Value: 3,
        Formula: 4,
        RefRowCol: 5,
        ValueText: 6
    };
    /** @enum */
    var c_oSerFormulaTypes =
    {
        Aca: 0,
        Bx: 1,
        Ca: 2,
        Del1: 3,
        Del2: 4,
        Dt2D: 5,
        Dtr: 6,
        R1: 7,
        R2: 8,
        Ref: 9,
        Si: 10,
        T: 11,
        Text: 12
    };
    /** @enum */
    var c_oSer_DrawingFromToType =
    {
        Col: 0,
        ColOff: 1,
        Row: 2,
        RowOff: 3
    };
    /** @enum */
    var c_oSer_DrawingPosType =
    {
        X: 0,
        Y: 1
    };
    /** @enum */
    var c_oSer_DrawingExtType =
    {
        Cx: 0,
        Cy: 1
    };
    /** @enum */
    var c_oSer_OtherType =
    {
        Media: 0,
        MediaItem: 1,
        MediaId: 2,
        MediaSrc: 3,
        Theme: 5
    };
    /** @enum */
    var c_oSer_CalcChainType =
    {
        CalcChainItem: 0,
        Array: 1,
        SheetId: 2,
        DependencyLevel: 3,
        Ref: 4,
        ChildChain: 5,
        NewThread: 6
    };
    /** @enum */
    var  c_oSer_PageMargins =
    {
        Left: 0,
        Top: 1,
        Right: 2,
        Bottom: 3,
        Header: 4,
        Footer: 5
    };
    /** @enum */
    var  c_oSer_PageSetup =
    {
        Orientation: 0,
        PaperSize: 1
    };
    /** @enum */
    var  c_oSer_PrintOptions =
    {
        GridLines: 0,
        Headings: 1
    };
    /** @enum */
    var c_oSer_TablePart =
    {
        Table:0,
        Ref:1,
        TotalsRowCount:2,
        DisplayName:3,
        AutoFilter:4,
        SortState:5,
        TableColumns:6,
        TableStyleInfo:7,
		HeaderRowCount:8,
		AltTextTable: 9
    };
    /** @enum */
    var c_oSer_TableStyleInfo =
    {
        Name:0,
        ShowColumnStripes:1,
        ShowRowStripes:2,
        ShowFirstColumn:3,
        ShowLastColumn:4
    };
    /** @enum */
    var c_oSer_TableColumns =
    {
        TableColumn:0,
        Name:1,
        DataDxfId:2,
        TotalsRowLabel:3,
        TotalsRowFunction:4,
        TotalsRowFormula:5,
        CalculatedColumnFormula:6
    };
    /** @enum */
    var c_oSer_SortState =
    {
        Ref:0,
        CaseSensitive:1,
        SortConditions:2,
        SortCondition:3,
        ConditionRef:4,
        ConditionSortBy:5,
        ConditionDescending:6,
        ConditionDxfId:7
    };
    /** @enum */
    var c_oSer_AutoFilter =
    {
        Ref:0,
        FilterColumns:1,
        FilterColumn:2,
        SortState:3
    };
    /** @enum */
    var c_oSer_FilterColumn =
    {
        ColId:0,
        Filters:1,
        Filter:2,
        DateGroupItem:3,
        CustomFilters:4,
        ColorFilter:5,
        Top10:6,
        DynamicFilter: 7,
        HiddenButton: 8,
        ShowButton: 9,
        FiltersBlank: 10
    };
    /** @enum */
    var c_oSer_Filter =
    {
        Val:0
    };
    /** @enum */
    var c_oSer_DateGroupItem =
    {
        DateTimeGrouping:0,
        Day:1,
        Hour:2,
        Minute:3,
        Month:4,
        Second:5,
        Year:6
    };
    /** @enum */
    var c_oSer_CustomFilters =
    {
        And:0,
        CustomFilters:1,
        CustomFilter:2,
        Operator:3,
        Val:4
    };
    /** @enum */
    var c_oSer_DynamicFilter =
    {
        Type: 0,
        Val: 1,
        MaxVal: 2
    };
    /** @enum */
    var c_oSer_ColorFilter =
    {
        CellColor:0,
        DxfId:1
    };
    /** @enum */
    var c_oSer_Top10 =
    {
        FilterVal:0,
        Percent:1,
        Top:2,
        Val:3
    };
    /** @enum */
    var c_oSer_Dxf =
    {
        Alignment:0,
        Border:1,
        Fill:2,
        Font:3,
        NumFmt:4
    };
    /** @enum */
    var c_oSer_TableStyles = {
        DefaultTableStyle:0,
        DefaultPivotStyle:1,
        TableStyles: 2,
        TableStyle: 3
    };
    var c_oSer_TableStyle = {
        Name: 0,
        Pivot: 1,
        Table: 2,
        Elements: 3,
        Element: 4,
        DisplayName: 5
    };
    var c_oSer_TableStyleElement = {
        DxfId: 0,
        Size: 1,
        Type: 2
    };
    var c_oSer_Comments =
    {
        Row: 0,
        Col: 1,
        CommentDatas : 2,
        CommentData : 3,
        Left: 4,
        LeftOffset: 5,
        Top: 6,
        TopOffset: 7,
        Right: 8,
        RightOffset: 9,
        Bottom: 10,
        BottomOffset: 11,
        LeftMM: 12,
        TopMM: 13,
        WidthMM: 14,
        HeightMM: 15,
        MoveWithCells: 16,
        SizeWithCells: 17
    };
    var c_oSer_CommentData =
    {
        Text : 0,
        Time : 1,
        UserId : 2,
        UserName : 3,
        QuoteText : 4,
        Solved : 5,
        Document : 6,
        Replies : 7,
        Reply : 8,
        OOTime : 9
    };
    var c_oSer_ConditionalFormatting = {
        Pivot						: 0,
        SqRef						: 1,
        ConditionalFormattingRule	: 2
    };
    var c_oSer_ConditionalFormattingRule = {
        AboveAverage	: 0,
        Bottom			: 1,
        DxfId			: 2,
        EqualAverage	: 3,
        Operator		: 4,
        Percent			: 5,
        Priority		: 6,
        Rank			: 7,
        StdDev			: 8,
        StopIfTrue		: 9,
        Text			: 10,
        TimePeriod		: 11,
        Type			: 12,
        ColorScale		: 14,
        DataBar			: 15,
        FormulaCF		: 16,
        IconSet			: 17
    };
    var c_oSer_ConditionalFormattingRuleColorScale = {
        CFVO			: 0,
        Color			: 1
    };
    var c_oSer_ConditionalFormattingDataBar = {
        CFVO			: 0,
        Color			: 1,
        MaxLength		: 2,
        MinLength		: 3,
        ShowValue		: 4
    };
    var c_oSer_ConditionalFormattingIconSet = {
        CFVO			: 0,
        IconSet			: 1,
        Percent			: 2,
        Reverse			: 3,
        ShowValue		: 4
    };
    var c_oSer_ConditionalFormattingValueObject = {
        Gte				: 0,
        Type			: 1,
        Val				: 2
    };
    var c_oSer_SheetView = {
        ColorId						: 0,
        DefaultGridColor			: 1,
        RightToLeft					: 2,
        ShowFormulas				: 3,
        ShowGridLines				: 4,
        ShowOutlineSymbols			: 5,
        ShowRowColHeaders			: 6,
        ShowRuler					: 7,
        ShowWhiteSpace				: 8,
        ShowZeros					: 9,
        TabSelected					: 10,
        TopLeftCell					: 11,
        View						: 12,
        WindowProtection			: 13,
        WorkbookViewId				: 14,
        ZoomScale					: 15,
        ZoomScaleNormal				: 16,
        ZoomScalePageLayoutView		: 17,
        ZoomScaleSheetLayoutView	: 18,

		Pane						: 19,
		Selection					: 20
    };
    var c_oSer_DrawingType =
    {
        Type: 0,
        From: 1,
        To: 2,
        Pos: 3,
        Pic: 4,
        PicSrc: 5,
        GraphicFrame: 6,
        Chart: 7,
        Ext: 8,
        pptxDrawing: 9,
        Chart2: 10
    };
    /** @enum */
    var c_oSer_Pane = {
        ActivePane	: 0,
		State		: 1,
        TopLeftCell	: 2,
        XSplit		: 3,
		YSplit		: 4
    };
	/** @enum */
	 var c_oSer_Selection = {
		ActiveCell: 0,
		ActiveCellId: 1,
		Sqref: 2,
		Pane: 3
	};
    /** @enum */
    var c_oSer_CellStyle = {
        BuiltinId		: 0,
        CustomBuiltin	: 1,
        Hidden			: 2,
        ILevel			: 3,
        Name			: 4,
        XfId			: 5
    };
    /** @enum */
    var c_oSer_SheetPr = {
        CodeName							: 0,
        EnableFormatConditionsCalculation	: 1,
        FilterMode							: 2,
        Published							: 3,
        SyncHorizontal						: 4,
        SyncRef								: 5,
        SyncVertical						: 6,
        TransitionEntry						: 7,
        TransitionEvaluation				: 8,

        TabColor							: 9
    };
    /** @enum */
    var c_oSer_Sparkline = {
        SparklineGroup: 0,
        ManualMax: 1,
        ManualMin: 2,
        LineWeight: 3,
        Type: 4,
        DateAxis: 5,
        DisplayEmptyCellsAs: 6,
        Markers: 7,
        High: 8,
        Low: 9,
        First: 10,
        Last: 11,
        Negative: 12,
        DisplayXAxis: 13,
        DisplayHidden: 14,
        MinAxisType: 15,
        MaxAxisType: 16,
        RightToLeft: 17,
        ColorSeries: 18,
        ColorNegative: 19,
        ColorAxis: 20,
        ColorMarkers: 21,
        ColorFirst: 22,
        ColorLast: 23,
        ColorHigh: 24,
        ColorLow: 25,
        Ref: 26,
        Sparklines: 27,
        Sparkline: 28,
        SparklineRef: 29,
        SparklineSqRef: 30
    };
	/** @enum */
	var c_oSer_AltTextTable = {
		AltText: 0,
		AltTextSummary: 1
	};
	/** @enum */
	var c_oSer_PivotTypes = {
		id: 0,
		cache: 1,
		record: 2,
		cacheId: 3,
		table: 4
	};
	/** @enum */
	var c_oSer_ExternalLinkTypes = {
		Id: 0,
		SheetNames: 1,
		SheetName: 2,
		DefinedNames: 3,
		DefinedName: 4,
		DefinedNameName: 5,
		DefinedNameRefersTo: 6,
		DefinedNameSheetId: 7,
		SheetDataSet: 8,
		SheetData: 9,
		SheetDataSheetId: 10,
		SheetDataRefreshError: 11,
		SheetDataRow: 12,
		SheetDataRowR: 13,
		SheetDataRowCell: 14,
		SheetDataRowCellRef: 15,
		SheetDataRowCellType: 16,
		SheetDataRowCellValue: 17
	};
	/** @enum */
    var EBorderStyle =
    {
        borderstyleDashDot:  0,
        borderstyleDashDotDot:  1,
        borderstyleDashed:  2,
        borderstyleDotted:  3,
        borderstyleDouble:  4,
        borderstyleHair:  5,
        borderstyleMedium:  6,
        borderstyleMediumDashDot:  7,
        borderstyleMediumDashDotDot:  8,
        borderstyleMediumDashed:  9,
        borderstyleNone: 10,
        borderstyleSlantDashDot: 11,
        borderstyleThick: 12,
        borderstyleThin: 13
    };
    /** @enum */
    var EUnderline =
    {
        underlineDouble:  0,
        underlineDoubleAccounting:  1,
        underlineNone:  2,
        underlineSingle:  3,
        underlineSingleAccounting:  4
    };
    /** @enum */
    var ECellAnchorType =
    {
        cellanchorAbsolute:  0,
        cellanchorOneCell:  1,
        cellanchorTwoCell:  2
    };
    /** @enum */
    var EVisibleType =
    {
        visibleHidden:  0,
        visibleVeryHidden:  1,
        visibleVisible:  2
    };
    /** @enum */
    var ECellTypeType =
    {
        celltypeBool:  0,
        celltypeDate:  1,
        celltypeError:  2,
        celltypeInlineStr:  3,
        celltypeNumber:  4,
        celltypeSharedString:  5,
        celltypeStr:  6
    };
    /** @enum */
    var ECellFormulaType =
    {
        cellformulatypeArray:  0,
        cellformulatypeDataTable:  1,
        cellformulatypeNormal:  2,
        cellformulatypeShared:  3
    };
    /** @enum */
    var EPageOrientation =
    {
        pageorientLandscape: 0,
        pageorientPortrait: 1
    };
    /** @enum */
    var EPageSize =
    {
        pagesizeLetterPaper:  1,
        pagesizeLetterSmall:  2,
        pagesizeTabloidPaper:  3,
        pagesizeLedgerPaper:  4,
        pagesizeLegalPaper:  5,
        pagesizeStatementPaper:  6,
        pagesizeExecutivePaper:  7,
        pagesizeA3Paper:  8,
        pagesizeA4Paper:  9,
        pagesizeA4SmallPaper:  10,
        pagesizeA5Paper:  11,
        pagesizeB4Paper:  12,
        pagesizeB5Paper:  13,
        pagesizeFolioPaper:  14,
        pagesizeQuartoPaper:  15,
        pagesizeStandardPaper1:  16,
        pagesizeStandardPaper2:  17,
        pagesizeNotePaper:  18,
        pagesize9Envelope:  19,
        pagesize10Envelope:  20,
        pagesize11Envelope:  21,
        pagesize12Envelope:  22,
        pagesize14Envelope:  23,
        pagesizeCPaper:  24,
        pagesizeDPaper:  25,
        pagesizeEPaper:  26,
        pagesizeDLEnvelope:  27,
        pagesizeC5Envelope:  28,
        pagesizeC3Envelope:  29,
        pagesizeC4Envelope:  30,
        pagesizeC6Envelope:  31,
        pagesizeC65Envelope:  32,
        pagesizeB4Envelope:  33,
        pagesizeB5Envelope:  34,
        pagesizeB6Envelope:  35,
        pagesizeItalyEnvelope:  36,
        pagesizeMonarchEnvelope:  37,
        pagesize6_3_4Envelope:  38,
        pagesizeUSStandardFanfold:  39,
        pagesizeGermanStandardFanfold:  40,
        pagesizeGermanLegalFanfold:  41,
        pagesizeISOB4:  42,
        pagesizeJapaneseDoublePostcard:  43,
        pagesizeStandardPaper3:  44,
        pagesizeStandardPaper4:  45,
        pagesizeStandardPaper5:  46,
        pagesizeInviteEnvelope:  47,
        pagesizeLetterExtraPaper:  50,
        pagesizeLegalExtraPaper:  51,
        pagesizeTabloidExtraPaper:  52,
        pagesizeA4ExtraPaper:  53,
        pagesizeLetterTransversePaper:  54,
        pagesizeA4TransversePaper:  55,
        pagesizeLetterExtraTransversePaper:  56,
        pagesizeSuperA_SuperA_A4Paper:  57,
        pagesizeSuperB_SuperB_A3Paper:  58,
        pagesizeLetterPlusPaper:  59,
        pagesizeA4PlusPaper:  60,
        pagesizeA5TransversePaper:  61,
        pagesizeJISB5TransversePaper:  62,
        pagesizeA3ExtraPaper:  63,
        pagesizeA5ExtraPaper:  64,
        pagesizeISOB5ExtraPaper:  65,
        pagesizeA2Paper:  66,
        pagesizeA3TransversePaper:  67,
        pagesizeA3ExtraTransversePaper:  68
    };
    /** @enum */
    var ETotalsRowFunction =
    {
        totalrowfunctionAverage: 1,
        totalrowfunctionCount: 2,
        totalrowfunctionCountNums: 3,
        totalrowfunctionCustom: 4,
        totalrowfunctionMax: 5,
        totalrowfunctionMin: 6,
        totalrowfunctionNone: 7,
        totalrowfunctionStdDev: 8,
        totalrowfunctionSum: 9,
        totalrowfunctionVar: 10
    };
    /** @enum */
    var ESortBy =
    {
        sortbyCellColor: 1,
        sortbyFontColor: 2,
        sortbyIcon: 3,
        sortbyValue: 4
    };
    /** @enum */
    var ECustomFilter =
    {
        customfilterEqual: 1,
        customfilterGreaterThan: 2,
        customfilterGreaterThanOrEqual: 3,
        customfilterLessThan: 4,
        customfilterLessThanOrEqual: 5,
        customfilterNotEqual: 6
    };
    /** @enum */
    var EDateTimeGroup =
    {
        datetimegroupDay: 1,
        datetimegroupHour: 2,
        datetimegroupMinute: 3,
        datetimegroupMonth: 4,
        datetimegroupSecond: 5,
        datetimegroupYear: 6
    };
    /** @enum */
    var ETableStyleType =
    {
        tablestyletypeBlankRow: 0,
        tablestyletypeFirstColumn: 1,
        tablestyletypeFirstColumnStripe: 2,
        tablestyletypeFirstColumnSubheading: 3,
        tablestyletypeFirstHeaderCell: 4,
        tablestyletypeFirstRowStripe: 5,
        tablestyletypeFirstRowSubheading: 6,
        tablestyletypeFirstSubtotalColumn: 7,
        tablestyletypeFirstSubtotalRow: 8,
        tablestyletypeFirstTotalCell: 9,
        tablestyletypeHeaderRow: 10,
        tablestyletypeLastColumn: 11,
        tablestyletypeLastHeaderCell: 12,
        tablestyletypeLastTotalCell: 13,
        tablestyletypePageFieldLabels: 14,
        tablestyletypePageFieldValues: 15,
        tablestyletypeSecondColumnStripe: 16,
        tablestyletypeSecondColumnSubheading: 17,
        tablestyletypeSecondRowStripe: 18,
        tablestyletypeSecondRowSubheading: 19,
        tablestyletypeSecondSubtotalColumn: 20,
        tablestyletypeSecondSubtotalRow: 21,
        tablestyletypeThirdColumnSubheading: 22,
        tablestyletypeThirdRowSubheading: 23,
        tablestyletypeThirdSubtotalColumn: 24,
        tablestyletypeThirdSubtotalRow: 25,
        tablestyletypeTotalRow: 26,
        tablestyletypeWholeTable: 27
    };
    /** @enum */
    var EFontScheme =
    {
        fontschemeMajor: 0,
        fontschemeMinor: 1,
        fontschemeNone: 2
    };
    /** @enum */
    var ECfOperator =
    {
        Operator_beginsWith: 0,
        Operator_between: 1,
        Operator_containsText: 2,
        Operator_endsWith: 3,
        Operator_equal: 4,
        Operator_greaterThan: 5,
        Operator_greaterThanOrEqual: 6,
        Operator_lessThan: 7,
        Operator_lessThanOrEqual: 8,
        Operator_notBetween: 9,
        Operator_notContains: 10,
        Operator_notEqual: 11
    };
    /** @enum */
    var ECfType =
    {
        aboveAverage: 0,
        beginsWith: 1,
        cellIs: 2,
        colorScale: 3,
        containsBlanks: 4,
        containsErrors: 5,
        containsText: 6,
        dataBar: 7,
        duplicateValues: 8,
        expression: 9,
        iconSet: 10,
        notContainsBlanks: 11,
        notContainsErrors: 12,
        notContainsText: 13,
        timePeriod: 14,
        top10: 15,
        uniqueValues: 16,
        endsWith: 17
    };
    /** @enum */
    var EIconSetType =
    {
        Arrows3: 0,
        Arrows3Gray: 1,
        Flags3: 2,
        Signs3: 3,
        Symbols3: 4,
        Symbols3_2: 5,
        Traffic3Lights1: 6,
        Traffic3Lights2: 7,
        Arrows4: 8,
        Arrows4Gray: 9,
        Rating4: 10,
        RedToBlack4: 11,
        Traffic4Lights: 12,
        Arrows5: 13,
        Arrows5Gray: 14,
        Quarters5: 15,
        Rating5: 16
    };
    var ECfvoType =
    {
        Formula: 0,
        Maximum: 1,
        Minimum: 2,
        Number: 3,
        Percent: 4,
        Percentile: 5
    };
    var ST_TimePeriod = {
        last7Days : 'last7Days',
        lastMonth : 'lastMonth',
        lastWeek  : 'lastWeek',
        nextMonth : 'nextMonth',
        nextWeek  : 'nextWeek',
        thisMonth : 'thisMonth',
        thisWeek  : 'thisWeek',
        today     : 'today',
        tomorrow  : 'tomorrow',
        yesterday : 'yesterday'
    };
    
    var g_nNumsMaxId = 160;

    var DocumentPageSize = new function() {
        this.oSizes = [
            {id:EPageSize.pagesizeLetterPaper, w_mm: 215.9, h_mm: 279.4},
            {id:EPageSize.pagesizeLetterSmall, w_mm: 215.9, h_mm: 279.4},
            {id:EPageSize.pagesizeTabloidPaper, w_mm: 279.4, h_mm: 431.7},
            {id:EPageSize.pagesizeLedgerPaper, w_mm: 431.8, h_mm: 279.4},
            {id:EPageSize.pagesizeLegalPaper, w_mm: 215.9, h_mm: 355.6},
            {id:EPageSize.pagesizeStatementPaper, w_mm: 495.3, h_mm: 215.9},
            {id:EPageSize.pagesizeExecutivePaper, w_mm: 184.2, h_mm: 266.7},
            {id:EPageSize.pagesizeA3Paper, w_mm: 297, h_mm: 420.1},
            {id:EPageSize.pagesizeA4Paper, w_mm: 210, h_mm: 297},
            {id:EPageSize.pagesizeA4SmallPaper, w_mm: 210, h_mm: 297},
            {id:EPageSize.pagesizeA5Paper, w_mm: 148.1, h_mm: 209.9},
            {id:EPageSize.pagesizeB4Paper, w_mm: 250, h_mm: 353},
            {id:EPageSize.pagesizeB5Paper, w_mm: 176, h_mm: 250.1},
            {id:EPageSize.pagesizeFolioPaper, w_mm: 215.9, h_mm: 330.2},
            {id:EPageSize.pagesizeQuartoPaper, w_mm: 215, h_mm: 275},
            {id:EPageSize.pagesizeStandardPaper1, w_mm: 254, h_mm: 355.6},
            {id:EPageSize.pagesizeStandardPaper2, w_mm: 279.4, h_mm: 431.8},
            {id:EPageSize.pagesizeNotePaper, w_mm: 215.9, h_mm: 279.4},
            {id:EPageSize.pagesize9Envelope, w_mm: 98.4, h_mm: 225.4},
            {id:EPageSize.pagesize10Envelope, w_mm: 104.8, h_mm: 241.3},
            {id:EPageSize.pagesize11Envelope, w_mm: 114.3, h_mm: 263.5},
            {id:EPageSize.pagesize12Envelope, w_mm: 120.7, h_mm: 279.4},
            {id:EPageSize.pagesize14Envelope, w_mm: 127, h_mm: 292.1},
            {id:EPageSize.pagesizeCPaper, w_mm: 431.8, h_mm: 558.8},
            {id:EPageSize.pagesizeDPaper, w_mm: 558.8, h_mm: 863.6},
            {id:EPageSize.pagesizeEPaper, w_mm: 863.6, h_mm: 1117.6},
            {id:EPageSize.pagesizeDLEnvelope, w_mm: 110.1, h_mm: 220.1},
            {id:EPageSize.pagesizeC5Envelope, w_mm: 162, h_mm: 229},
            {id:EPageSize.pagesizeC3Envelope, w_mm: 324, h_mm: 458},
            {id:EPageSize.pagesizeC4Envelope, w_mm: 229, h_mm: 324},
            {id:EPageSize.pagesizeC6Envelope, w_mm: 114, h_mm: 162},
            {id:EPageSize.pagesizeC65Envelope, w_mm: 114, h_mm: 229},
            {id:EPageSize.pagesizeB4Envelope, w_mm: 250, h_mm: 353},
            {id:EPageSize.pagesizeB5Envelope, w_mm: 176, h_mm: 250},
            {id:EPageSize.pagesizeB6Envelope, w_mm: 176, h_mm: 125},
            {id:EPageSize.pagesizeItalyEnvelope, w_mm: 110, h_mm: 230},
            {id:EPageSize.pagesizeMonarchEnvelope, w_mm: 98.4, h_mm: 190.5},
            {id:EPageSize.pagesize6_3_4Envelope, w_mm: 92.1, h_mm: 165.1},
            {id:EPageSize.pagesizeUSStandardFanfold, w_mm: 377.8, h_mm: 279.4},
            {id:EPageSize.pagesizeGermanStandardFanfold, w_mm: 215.9, h_mm: 304.8},
            {id:EPageSize.pagesizeGermanLegalFanfold, w_mm: 215.9, h_mm: 330.2},
            {id:EPageSize.pagesizeISOB4, w_mm: 250, h_mm: 353},
            {id:EPageSize.pagesizeJapaneseDoublePostcard, w_mm: 200, h_mm: 148},
            {id:EPageSize.pagesizeStandardPaper3, w_mm: 228.6, h_mm: 279.4},
            {id:EPageSize.pagesizeStandardPaper4, w_mm: 254, h_mm: 279.4},
            {id:EPageSize.pagesizeStandardPaper5, w_mm: 381, h_mm: 279.4},
            {id:EPageSize.pagesizeInviteEnvelope, w_mm: 220, h_mm: 220},
            {id:EPageSize.pagesizeLetterExtraPaper, w_mm: 235.6, h_mm: 304.8},
            {id:EPageSize.pagesizeLegalExtraPaper, w_mm: 235.6, h_mm: 381},
            {id:EPageSize.pagesizeTabloidExtraPaper, w_mm: 296.9, h_mm: 457.2},
            {id:EPageSize.pagesizeA4ExtraPaper, w_mm: 236, h_mm: 322},
            {id:EPageSize.pagesizeLetterTransversePaper, w_mm: 210.2, h_mm: 279.4},
            {id:EPageSize.pagesizeA4TransversePaper, w_mm: 210, h_mm: 297},
            {id:EPageSize.pagesizeLetterExtraTransversePaper, w_mm: 235.6, h_mm: 304.8},
            {id:EPageSize.pagesizeSuperA_SuperA_A4Paper, w_mm: 227, h_mm: 356},
            {id:EPageSize.pagesizeSuperB_SuperB_A3Paper, w_mm: 305, h_mm: 487},
            {id:EPageSize.pagesizeLetterPlusPaper, w_mm: 215.9, h_mm: 12.69},
            {id:EPageSize.pagesizeA4PlusPaper, w_mm: 210, h_mm: 330},
            {id:EPageSize.pagesizeA5TransversePaper, w_mm: 148, h_mm: 210},
            {id:EPageSize.pagesizeJISB5TransversePaper, w_mm: 182, h_mm: 257},
            {id:EPageSize.pagesizeA3ExtraPaper, w_mm: 322, h_mm: 445},
            {id:EPageSize.pagesizeA5ExtraPaper, w_mm: 174, h_mm: 235},
            {id:EPageSize.pagesizeISOB5ExtraPaper, w_mm: 201, h_mm: 276},
            {id:EPageSize.pagesizeA2Paper, w_mm: 420, h_mm: 594},
            {id:EPageSize.pagesizeA3TransversePaper, w_mm: 297, h_mm: 420},
            {id:EPageSize.pagesizeA3ExtraTransversePaper, w_mm: 322, h_mm: 445}
        ];
        this.getSizeByWH = function(widthMm, heightMm)
        {
            for( var index in this.oSizes)
            {
                var item = this.oSizes[index];
                if(widthMm == item.w_mm && heightMm == item.h_mm)
                    return item;
            }
            return this.oSizes[8];//A4
        };
        this.getSizeById = function(id)
        {
            for( var index in this.oSizes)
            {
                var item = this.oSizes[index];
                if(id == item.id)
                    return item;
            }
            return this.oSizes[8];//A4
        };
    };

      function OpenColor() {
          this.rgb = null;
          this.auto = null;
          this.theme = null;
          this.tint = null;
      }

	function ReadColorSpreadsheet2(bcr, length) {
		var output = null;
		var color = new OpenColor();
		var res = bcr.Read2Spreadsheet(length, function(t,l){
			return bcr.ReadColorSpreadsheet(t,l, color);
		});
		if(null != color.theme)
			output = AscCommonExcel.g_oColorManager.getThemeColor(color.theme, color.tint);
		else if(null != color.rgb)
			output = new AscCommonExcel.RgbColor(0x00ffffff & color.rgb);
		return output;
	}

	function getSqRefString(ranges) {
		var refs = [];
		for (var i = 0; i < ranges.length; ++i) {
			refs.push(ranges[i].getName());
		}
		return refs.join(' ');
	}

    /** @constructor */
    function BinaryTableWriter(memory, aDxfs, isCopyPaste)
    {
        this.memory = memory;
        this.aDxfs = aDxfs;
        this.bs = new BinaryCommonWriter(this.memory);
        this.isCopyPaste = isCopyPaste;
        this.Write = function(aTables, ws)
        {
            var oThis = this;
            for(var i = 0, length = aTables.length; i < length; ++i)
            {
                var rangeTable = null;
                //get range for copy/paste
                if (this.isCopyPaste)
                    rangeTable = aTables[i].Ref;

                if(!this.isCopyPaste || (this.isCopyPaste && rangeTable && this.isCopyPaste.isIntersect(rangeTable) && !ws.bExcludeHiddenRows))
                    this.bs.WriteItem(c_oSer_TablePart.Table, function(){oThis.WriteTable(aTables[i]);});
            }
        };
        this.WriteTable = function(table)
        {
            var oThis = this;
            //Ref
            if(null != table.Ref)
            {
                this.memory.WriteByte(c_oSer_TablePart.Ref);
                this.memory.WriteString2(table.Ref.getName());
            }
            //HeaderRowCount
            if(null != table.HeaderRowCount)
                this.bs.WriteItem(c_oSer_TablePart.HeaderRowCount, function(){oThis.memory.WriteLong(table.HeaderRowCount);});
            //TotalsRowCount
            if(null != table.TotalsRowCount)
                this.bs.WriteItem(c_oSer_TablePart.TotalsRowCount, function(){oThis.memory.WriteLong(table.TotalsRowCount);});
            //Display Name
            if(null != table.DisplayName)
            {
                this.memory.WriteByte(c_oSer_TablePart.DisplayName);
                this.memory.WriteString2(table.DisplayName);
            }
            //AutoFilter
            if(null != table.AutoFilter)
                this.bs.WriteItem(c_oSer_TablePart.AutoFilter, function(){oThis.WriteAutoFilter(table.AutoFilter);});
            //SortState
            if(null != table.SortState)
                this.bs.WriteItem(c_oSer_TablePart.SortState, function(){oThis.WriteSortState(table.SortState);});
            //TableColumns
            if(null != table.TableColumns)
                this.bs.WriteItem(c_oSer_TablePart.TableColumns, function(){oThis.WriteTableColumns(table.TableColumns);});
            //TableStyleInfo
            if(null != table.TableStyleInfo)
                this.bs.WriteItem(c_oSer_TablePart.TableStyleInfo, function(){oThis.WriteTableStyleInfo(table.TableStyleInfo);});
			if(null != table.altText || null != table.altTextSummary)
				this.bs.WriteItem(c_oSer_TablePart.AltTextTable, function(){oThis.WriteAltTextTable(table);});
        };
		this.WriteAltTextTable = function(table)
		{
			var oThis = this;
			if (null != table.altText) {
				this.memory.WriteByte(c_oSer_AltTextTable.AltText);
				this.memory.WriteString2(table.altText);
			}
			if (null != table.altTextSummary) {
				this.memory.WriteByte(c_oSer_AltTextTable.AltTextSummary);
				this.memory.WriteString2(table.altTextSummary);
			}
 		};
        this.WriteAutoFilter = function(autofilter)
        {
            var oThis = this;
            //Ref
            if(null != autofilter.Ref)
            {
				this.memory.WriteByte(c_oSer_AutoFilter.Ref);
                this.memory.WriteString2(autofilter.Ref.getName());
            }
            //FilterColumns
            if(null != autofilter.FilterColumns)
                this.bs.WriteItem(c_oSer_AutoFilter.FilterColumns, function(){oThis.WriteFilterColumns(autofilter.FilterColumns);});
            //SortState
            if(null != autofilter.SortState)
                this.bs.WriteItem(c_oSer_AutoFilter.SortState, function(){oThis.WriteSortState(autofilter.SortState);});
        };
        this.WriteFilterColumns = function(filterColumns)
        {
            var oThis = this;
            for(var i = 0, length = filterColumns.length; i < length; ++i)
                this.bs.WriteItem(c_oSer_AutoFilter.FilterColumn, function(){oThis.WriteFilterColumn(filterColumns[i]);});
        };
        this.WriteFilterColumn = function(filterColumn)
        {
            var oThis = this;
            //ColId
            if(null != filterColumn.ColId)
                this.bs.WriteItem(c_oSer_FilterColumn.ColId, function(){oThis.memory.WriteLong(filterColumn.ColId);});
            //Filters
            if(null != filterColumn.Filters)
                this.bs.WriteItem(c_oSer_FilterColumn.Filters, function(){oThis.WriteFilters(filterColumn.Filters);});
            //CustomFilters
            if(null != filterColumn.CustomFiltersObj)
                this.bs.WriteItem(c_oSer_FilterColumn.CustomFilters, function(){oThis.WriteCustomFilters(filterColumn.CustomFiltersObj);});
            //DynamicFilter
            if(null != filterColumn.DynamicFilter)
                this.bs.WriteItem(c_oSer_FilterColumn.DynamicFilter, function(){oThis.WriteDynamicFilter(filterColumn.DynamicFilter);});
            //ColorFilter
            if(null != filterColumn.ColorFilter)
                this.bs.WriteItem(c_oSer_FilterColumn.ColorFilter, function(){oThis.WriteColorFilter(filterColumn.ColorFilter);});
            //Top10
            if(null != filterColumn.Top10)
                this.bs.WriteItem(c_oSer_FilterColumn.Top10, function(){oThis.WriteTop10(filterColumn.Top10);});
            //ShowButton
            if(null != filterColumn.ShowButton)
                this.bs.WriteItem(c_oSer_FilterColumn.ShowButton, function(){oThis.memory.WriteBool(filterColumn.ShowButton);});
        };
        this.WriteFilters = function(filters)
        {
            var oThis = this;
            if(null != filters.Values)
            {
				for(var i in filters.Values)
					this.bs.WriteItem(c_oSer_FilterColumn.Filter, function(){oThis.WriteFilter(i);});
            }
            if(null != filters.Dates)
            {
                for(var i = 0, length = filters.Dates.length; i < length; ++i)
                    this.bs.WriteItem(c_oSer_FilterColumn.DateGroupItem, function(){oThis.WriteDateGroupItem(filters.Dates[i]);});
            }
            if(null != filters.Blank)
                this.bs.WriteItem(c_oSer_FilterColumn.FiltersBlank, function(){oThis.memory.WriteBool(filters.Blank);});
        };
        this.WriteFilter = function(val)
        {
            if(null != val)
            {
                this.memory.WriteByte(c_oSer_Filter.Val);
                this.memory.WriteString2(val);
            }
        };
        this.WriteDateGroupItem = function(dateGroupItem)
        {
			var oDateGroupItem = new AscCommonExcel.DateGroupItem();
			oDateGroupItem.convertRangeToDateGroupItem(dateGroupItem);
			dateGroupItem = oDateGroupItem;
			
			if(null != dateGroupItem.DateTimeGrouping)
            {
                this.memory.WriteByte(c_oSer_DateGroupItem.DateTimeGrouping);
                this.memory.WriteByte(c_oSerPropLenType.Byte);
                this.memory.WriteByte(dateGroupItem.DateTimeGrouping);
            }
            if(null != dateGroupItem.Day)
            {
                this.memory.WriteByte(c_oSer_DateGroupItem.Day);
                this.memory.WriteByte(c_oSerPropLenType.Long);
                this.memory.WriteLong(dateGroupItem.Day);
            }
            if(null != dateGroupItem.Hour)
            {
                this.memory.WriteByte(c_oSer_DateGroupItem.Hour);
                this.memory.WriteByte(c_oSerPropLenType.Long);
                this.memory.WriteLong(dateGroupItem.Hour);
            }
            if(null != dateGroupItem.Minute)
            {
                this.memory.WriteByte(c_oSer_DateGroupItem.Minute);
                this.memory.WriteByte(c_oSerPropLenType.Long);
                this.memory.WriteLong(dateGroupItem.Minute);
            }
            if(null != dateGroupItem.Month)
            {
                this.memory.WriteByte(c_oSer_DateGroupItem.Month);
                this.memory.WriteByte(c_oSerPropLenType.Long);
                this.memory.WriteLong(dateGroupItem.Month);
            }
            if(null != dateGroupItem.Second)
            {
                this.memory.WriteByte(c_oSer_DateGroupItem.Second);
                this.memory.WriteByte(c_oSerPropLenType.Long);
                this.memory.WriteLong(dateGroupItem.Second);
            }
            if(null != dateGroupItem.Year)
            {
                this.memory.WriteByte(c_oSer_DateGroupItem.Year);
                this.memory.WriteByte(c_oSerPropLenType.Long);
                this.memory.WriteLong(dateGroupItem.Year);
            }
        };
        this.WriteCustomFilters = function(customFilters)
        {
            var oThis = this;
            if(null != customFilters.And)
                this.bs.WriteItem(c_oSer_CustomFilters.And, function(){oThis.memory.WriteBool(customFilters.And);});
            if(null != customFilters.CustomFilters && customFilters.CustomFilters.length > 0)
                this.bs.WriteItem(c_oSer_CustomFilters.CustomFilters, function(){oThis.WriteCustomFiltersItems(customFilters.CustomFilters);});
        };
        this.WriteCustomFiltersItems = function(aCustomFilters)
        {
            var oThis = this;
            for(var i = 0, length = aCustomFilters.length; i < length; ++i)
                this.bs.WriteItem(c_oSer_CustomFilters.CustomFilter, function(){oThis.WriteCustomFiltersItem(aCustomFilters[i]);});
        };
        this.WriteCustomFiltersItem = function(customFilter)
        {
            if(null != customFilter.Operator)
            {
                this.memory.WriteByte(c_oSer_CustomFilters.Operator);
                this.memory.WriteByte(c_oSerPropLenType.Byte);
                this.memory.WriteByte(customFilter.Operator);
            }
            if(null != customFilter.Val)
            {
                this.memory.WriteByte(c_oSer_CustomFilters.Val);
                this.memory.WriteByte(c_oSerPropLenType.Variable);
                this.memory.WriteString2(customFilter.Val);
            }
        };
        this.WriteDynamicFilter = function(dynamicFilter)
        {
            if(null != dynamicFilter.Type)
            {
                this.memory.WriteByte(c_oSer_DynamicFilter.Type);
                this.memory.WriteByte(c_oSerPropLenType.Byte);
                this.memory.WriteByte(dynamicFilter.Type);
            }
            if(null != dynamicFilter.Val)
            {
                this.memory.WriteByte(c_oSer_DynamicFilter.Val);
                this.memory.WriteByte(c_oSerPropLenType.Double);
                this.memory.WriteDouble2(dynamicFilter.Val);
            }
            if(null != dynamicFilter.MaxVal)
            {
                this.memory.WriteByte(c_oSer_DynamicFilter.MaxVal);
                this.memory.WriteByte(c_oSerPropLenType.Double);
                this.memory.WriteDouble2(dynamicFilter.MaxVal);
            }
        };
        this.WriteColorFilter = function(colorFilter)
        {
            if(null != colorFilter.CellColor)
            {
                this.memory.WriteByte(c_oSer_ColorFilter.CellColor);
                this.memory.WriteByte(c_oSerPropLenType.Byte);
                this.memory.WriteBool(colorFilter.CellColor);
            }
            if(null != colorFilter.dxf)
            {
                this.memory.WriteByte(c_oSer_ColorFilter.DxfId);
                this.memory.WriteByte(c_oSerPropLenType.Long);
                this.memory.WriteLong(this.aDxfs.length);
                this.aDxfs.push(colorFilter.dxf);
            }
        };
        this.WriteTop10 = function(top10)
        {
            if(null != top10.FilterVal)
            {
                this.memory.WriteByte(c_oSer_Top10.FilterVal);
                this.memory.WriteByte(c_oSerPropLenType.Double);
                this.memory.WriteDouble2(top10.FilterVal);
            }
            if(null != top10.Percent)
            {
                this.memory.WriteByte(c_oSer_Top10.Percent);
                this.memory.WriteByte(c_oSerPropLenType.Byte);
                this.memory.WriteBool(top10.Percent);
            }
            if(null != top10.Top)
            {
                this.memory.WriteByte(c_oSer_Top10.Top);
                this.memory.WriteByte(c_oSerPropLenType.Byte);
                this.memory.WriteBool(top10.Top);
            }
            if(null != top10.Val)
            {
                this.memory.WriteByte(c_oSer_Top10.Val);
                this.memory.WriteByte(c_oSerPropLenType.Double);
                this.memory.WriteDouble2(top10.Val);
            }
        };
        this.WriteSortState = function(sortState)
        {
            var oThis = this;
            if(null != sortState.Ref)
            {
                this.memory.WriteByte(c_oSer_SortState.Ref);
                this.memory.WriteString2(sortState.Ref.getName());
            }
            if(null != sortState.CaseSensitive)
                this.bs.WriteItem(c_oSer_SortState.CaseSensitive, function(){oThis.memory.WriteBool(sortState.CaseSensitive);});
            if(null != sortState.SortConditions)
                this.bs.WriteItem(c_oSer_SortState.SortConditions, function(){oThis.WriteSortConditions(sortState.SortConditions);});
        };
        this.WriteSortConditions = function(sortConditions)
        {
            var oThis = this;
            for(var i = 0, length = sortConditions.length; i < length; ++i)
                this.bs.WriteItem(c_oSer_SortState.SortCondition, function(){oThis.WriteSortCondition(sortConditions[i]);});
        };
        this.WriteSortCondition = function(sortCondition)
        {
            if(null != sortCondition.Ref)
            {
                this.memory.WriteByte(c_oSer_SortState.ConditionRef);
                this.memory.WriteByte(c_oSerPropLenType.Variable);
                this.memory.WriteString2(sortCondition.Ref.getName());
            }
            if(null != sortCondition.ConditionSortBy)
            {
                this.memory.WriteByte(c_oSer_SortState.ConditionSortBy);
                this.memory.WriteByte(c_oSerPropLenType.Byte);
                this.memory.WriteByte(sortCondition.ConditionSortBy);
            }
            if(null != sortCondition.ConditionDescending)
            {
                this.memory.WriteByte(c_oSer_SortState.ConditionDescending);
                this.memory.WriteByte(c_oSerPropLenType.Byte);
                this.memory.WriteBool(sortCondition.ConditionDescending);
            }
            if(null != sortCondition.dxf)
            {
                this.memory.WriteByte(c_oSer_SortState.ConditionDxfId);
                this.memory.WriteByte(c_oSerPropLenType.Long);
                this.memory.WriteLong(this.aDxfs.length);
                this.aDxfs.push(sortCondition.dxf);
            }
        };
        this.WriteTableColumns = function(tableColumns)
        {
            var oThis = this;
            for(var i = 0, length = tableColumns.length; i < length; ++i)
                this.bs.WriteItem(c_oSer_TableColumns.TableColumn, function(){oThis.WriteTableColumn(tableColumns[i]);});
        };
        this.WriteTableColumn = function(tableColumn)
        {
            var oThis = this;
            if(null != tableColumn.Name)
            {
                this.memory.WriteByte(c_oSer_TableColumns.Name);
                this.memory.WriteString2(tableColumn.Name);
            }
            if(null != tableColumn.TotalsRowLabel)
            {
                this.memory.WriteByte(c_oSer_TableColumns.TotalsRowLabel);
                this.memory.WriteString2(tableColumn.TotalsRowLabel);
            }
            if(null != tableColumn.TotalsRowFunction)
                this.bs.WriteItem(c_oSer_TableColumns.TotalsRowFunction, function(){oThis.memory.WriteByte(tableColumn.TotalsRowFunction);});

            if(null != tableColumn.TotalsRowFormula)
            {
                this.memory.WriteByte(c_oSer_TableColumns.TotalsRowFormula);
                this.memory.WriteString2(tableColumn.TotalsRowFormula.Formula);
            }
            if(null != tableColumn.dxf)
            {
                this.bs.WriteItem(c_oSer_TableColumns.DataDxfId, function(){oThis.memory.WriteLong(oThis.aDxfs.length);});
                this.aDxfs.push(tableColumn.dxf);
            }
            if(null != tableColumn.CalculatedColumnFormula)
            {
                this.memory.WriteByte(c_oSer_TableColumns.CalculatedColumnFormula);
                this.memory.WriteString2(tableColumn.CalculatedColumnFormula);
            }
        };
        this.WriteTableStyleInfo = function(tableStyleInfo)
        {
            if(null != tableStyleInfo.Name)
            {
                this.memory.WriteByte(c_oSer_TableStyleInfo.Name);
                this.memory.WriteByte(c_oSerPropLenType.Variable);
                this.memory.WriteString2(tableStyleInfo.Name);
            }
            if(null != tableStyleInfo.ShowColumnStripes)
            {
                this.memory.WriteByte(c_oSer_TableStyleInfo.ShowColumnStripes);
                this.memory.WriteByte(c_oSerPropLenType.Byte);
                this.memory.WriteBool(tableStyleInfo.ShowColumnStripes);
            }
            if(null != tableStyleInfo.ShowRowStripes)
            {
                this.memory.WriteByte(c_oSer_TableStyleInfo.ShowRowStripes);
                this.memory.WriteByte(c_oSerPropLenType.Byte);
                this.memory.WriteBool(tableStyleInfo.ShowRowStripes);
            }
            if(null != tableStyleInfo.ShowFirstColumn)
            {
                this.memory.WriteByte(c_oSer_TableStyleInfo.ShowFirstColumn);
                this.memory.WriteByte(c_oSerPropLenType.Byte);
                this.memory.WriteBool(tableStyleInfo.ShowFirstColumn);
            }
            if(null != tableStyleInfo.ShowLastColumn)
            {
                this.memory.WriteByte(c_oSer_TableStyleInfo.ShowLastColumn);
                this.memory.WriteByte(c_oSerPropLenType.Byte);
                this.memory.WriteBool(tableStyleInfo.ShowLastColumn);
            }
        }
    }
    /** @constructor */
    function BinarySharedStringsTableWriter(memory, wb, oSharedStrings)
    {
        this.memory = memory;
		this.wb = wb;
        this.bs = new BinaryCommonWriter(this.memory);
        this.bsw = new BinaryStylesTableWriter(this.memory);
        this.oSharedStrings = oSharedStrings;
        this.Write = function()
        {
            var oThis = this;
            this.bs.WriteItemWithLength(function(){oThis.WriteSharedStringsContent();});
        };
        this.WriteSharedStringsContent = function()
        {
            var oThis = this;
            var aSharedStrings = [];
			for (var i in this.oSharedStrings.strings) {
				if (this.oSharedStrings.strings.hasOwnProperty(i)){
					var from = i - 0;
					var to = oSharedStrings.strings[i];
					aSharedStrings[to] = this.wb.sharedStrings.get(from);
                }
			}
			for (var i = 0; i < aSharedStrings.length; ++i) {
				this.bs.WriteItem(c_oSerSharedStringTypes.Si, function(){oThis.WriteSi(aSharedStrings[i]);});
			}
        };
        this.WriteSi = function(si)
        {
			var oThis = this;
			if (typeof si === 'string') {
				this.memory.WriteByte(c_oSerSharedStringTypes.Text);
				this.memory.WriteString2(si);
			} else {
				for (var i = 0, length = si.length; i < length; ++i) {
					this.bs.WriteItem(c_oSerSharedStringTypes.Run, function() {oThis.WriteRun(si[i]);});
				}
			}
        };
        this.WriteRun = function(run)
        {
            var oThis = this;
            if(null != run.format)
                this.bs.WriteItem(c_oSerSharedStringTypes.RPr, function(){oThis.bsw.WriteFont(run.format);});
            if(null != run.text)
            {
                this.memory.WriteByte(c_oSerSharedStringTypes.Text);
                this.memory.WriteString2(run.text);
            }
        };
    }

	function StyleWriteMap(action, prepare) {
		this.action = action;
		this.prepare = prepare;
		this.ids = {};
		this.elems = [];
	}

	StyleWriteMap.prototype.add = function(elem) {
		var index = 0;
		if (elem) {
			elem = this.action.call(g_StyleCache, elem);
			index = this.ids[elem.getIndexNumber()];
			if (undefined === index) {
				index = this.elems.length;
				this.ids[elem.getIndexNumber()] = index;
				this.elems.push(this.prepare ? this.prepare(elem) : elem);
			}
		}
		return index;
	};
	StyleWriteMap.prototype.addNoCheck = function(elem) {
		this.elems.push(elem);
	};
	function XfForWrite(xf) {
		this.xf = xf;
		this.fontid = 0;
		this.fillid = 0;
		this.borderid = 0;
		this.numid = 0;
		this.XfId = null;
	}

	function StylesForWrite() {
		var t = this;
		this.oXfsMap = new StyleWriteMap(g_StyleCache.addXf, function(xf) {
			return t._getElem(xf, null);
		});
		this.oFontMap = new StyleWriteMap(g_StyleCache.addFont);
		this.oFillMap = new StyleWriteMap(g_StyleCache.addFill);
		this.nDefaultFillIndex = 0;
		this.oBorderMap = new StyleWriteMap(g_StyleCache.addBorder);
		this.oNumMap = new StyleWriteMap(g_StyleCache.addNum);
		this.oXfsStylesMap = [];
	}

	StylesForWrite.prototype.init = function(defaultXfs) {
		var fill = new AscCommonExcel.Fill();
		this.oFillMap.add(fill);
		//second fill is equal to first (in Excel it is different, but it does not matter - they are ignored)
		this.oFillMap.addNoCheck(fill);
		this.oXfsMap.add(defaultXfs);
		//first 2 fills are predefined, so default fill can be not 0
		this.nDefaultFillIndex = this.oXfsMap.elems[this.oXfsMap.elems.length - 1].fillid;
	};
	StylesForWrite.prototype.add = function(xf) {
		return this.oXfsMap.add(xf);
	};
	StylesForWrite.prototype.addCellStyle = function(style) {
		this.oXfsStylesMap.push(this._getElem(style.xfs, style.XfId));
	};
	StylesForWrite.prototype.finalizeCellStyles = function() {
		//XfId это порядковый номер, поэтому сортируем
		this.oXfsStylesMap.sort(function(a, b) {
			return a.XfId - b.XfId;
		});
	};
	StylesForWrite.prototype.getNumIdByFormat = function(num) {
		var numid = null;
		if (null != num.id) {
			numid = num.id;
		} else {
			numid = AscCommonExcel.aStandartNumFormatsId[num.getFormat()];
		}

		if (null == numid) {
			numid = g_nNumsMaxId + this.oNumMap.add(num);
		}
		return numid;
	};
	StylesForWrite.prototype._getElem = function(xf, XfId) {
		var elem = new XfForWrite(xf);
		elem.fontid = this.oFontMap.add(xf.font);
		elem.fillid = xf.fill ? this.oFillMap.add(xf.fill) : this.nDefaultFillIndex;
		elem.borderid = this.oBorderMap.add(xf.border);
		elem.numid = xf.num ? this.getNumIdByFormat(xf.num) : 0;
		elem.XfId = XfId;
		return elem;
	};
    /** @constructor */
    function BinaryStylesTableWriter(memory, wb, oBinaryWorksheetsTableWriter)
    {
        this.memory = memory;
        this.bs = new BinaryCommonWriter(this.memory);
        this.wb = wb;
        this.aDxfs = null;
		this.stylesForWrite = null;
        if(null != oBinaryWorksheetsTableWriter)
        {
            this.aDxfs = oBinaryWorksheetsTableWriter.aDxfs;
			this.stylesForWrite = oBinaryWorksheetsTableWriter.stylesForWrite;
        }
        this.Write = function()
        {
            var oThis = this;
            this.bs.WriteItemWithLength(function(){oThis.WriteStylesContent();});
        };
        this.WriteStylesContent = function()
        {
            var oThis = this;
            var wb = this.wb;
            //borders
            this.bs.WriteItem(c_oSerStylesTypes.Borders, function(){oThis.WriteBorders();});
            //fills
            this.bs.WriteItem(c_oSerStylesTypes.Fills, function(){oThis.WriteFills();});
            //fonts
            this.bs.WriteItem(c_oSerStylesTypes.Fonts, function(){oThis.WriteFonts();});
            //CellStyleXfs
            this.bs.WriteItem(c_oSerStylesTypes.CellStyleXfs, function(){oThis.WriteCellStyleXfs();});
            //cellxfs
            this.bs.WriteItem(c_oSerStylesTypes.CellXfs, function(){oThis.WriteCellXfs();});

            //CellStyles
            this.bs.WriteItem(c_oSerStylesTypes.CellStyles, function(){oThis.WriteCellStyles(wb.CellStyles.CustomStyles);});

            if(null != wb.TableStyles)
                this.bs.WriteItem(c_oSerStylesTypes.TableStyles, function(){oThis.WriteTableStyles(wb.TableStyles);});
            //Dxfs пишется после TableStyles, потому что Dxfs может пополниться при записи TableStyles
            if(null != this.aDxfs && this.aDxfs.length > 0)
            {
                var oDxfsNumFormatToId = {};
                for(var i = 0, length = this.aDxfs.length; i < length; i++)
                {
                    var dxf = this.aDxfs[i];
                    if(dxf && dxf.num)
                        oDxfsNumFormatToId[dxf.num.getFormat()] = this.stylesForWrite.getNumIdByFormat(dxf.num);
                }
                this.bs.WriteItem(c_oSerStylesTypes.Dxfs, function(){oThis.WriteDxfs(oThis.aDxfs, oDxfsNumFormatToId);});
            }
            //numfmts пишется в конце потому что они могут пополниться при записи Dxfs
            this.bs.WriteItem(c_oSerStylesTypes.NumFmts, function(){oThis.WriteNumFmts();});
        };
        this.WriteBorders = function()
        {
            var oThis = this;
			var elems = this.stylesForWrite.oBorderMap.elems;
			for (var i = 0; i < elems.length; ++i) {
				//todo avoid diff
				var border = elems[i].getDif(g_oDefaultFormat.BorderAbs);
				this.bs.WriteItem(c_oSerStylesTypes.Border, function() {oThis.WriteBorder(border)});
            }
        };
        this.WriteBorder = function(border)
        {
            if(null == border)
                return;
            var oThis = this;
            //Bottom
            if(null != border.b)
                this.bs.WriteItem(c_oSerBorderTypes.Bottom, function(){oThis.WriteBorderProp(border.b);});
            //Diagonal
            if(null != border.d)
                this.bs.WriteItem(c_oSerBorderTypes.Diagonal, function(){oThis.WriteBorderProp(border.d);});
            //End
            if(null != border.r)
                this.bs.WriteItem(c_oSerBorderTypes.End, function(){oThis.WriteBorderProp(border.r);});
            //Horizontal
            if(null != border.ih)
                this.bs.WriteItem(c_oSerBorderTypes.Horizontal, function(){oThis.WriteBorderProp(border.ih);});
            //Start
            if(null != border.l)
                this.bs.WriteItem(c_oSerBorderTypes.Start, function(){oThis.WriteBorderProp(border.l);});
            //Top
            if(null != border.t)
                this.bs.WriteItem(c_oSerBorderTypes.Top, function(){oThis.WriteBorderProp(border.t);});
            //Vertical
            if(null != border.iv)
                this.bs.WriteItem(c_oSerBorderTypes.Vertical, function(){oThis.WriteBorderProp(border.iv);});
            //DiagonalDown
            if(null != border.dd)
                this.bs.WriteItem(c_oSerBorderTypes.DiagonalDown, function(){oThis.memory.WriteBool(border.dd);});
            //DiagonalUp
            if(null != border.du)
                this.bs.WriteItem(c_oSerBorderTypes.DiagonalUp, function(){oThis.memory.WriteBool(border.du);});
        };
        this.WriteBorderProp = function(borderProp)
        {
            var oThis = this;
            if(null != borderProp.c)
            {
                this.memory.WriteByte(c_oSerBorderPropTypes.Color);
                this.memory.WriteByte(c_oSerPropLenType.Variable);
                this.bs.WriteItemWithLength(function(){oThis.bs.WriteColorSpreadsheet(borderProp.c);});
            }
            if(null != borderProp.s)
            {
                var nStyle = EBorderStyle.borderstyleNone;
                switch(borderProp.s)
                {
                    case c_oAscBorderStyles.DashDot:			nStyle = EBorderStyle.borderstyleDashDot;break;
                    case c_oAscBorderStyles.DashDotDot:			nStyle = EBorderStyle.borderstyleDashDotDot;break;
                    case c_oAscBorderStyles.Dashed:				nStyle = EBorderStyle.borderstyleDashed;break;
                    case c_oAscBorderStyles.Dotted:				nStyle = EBorderStyle.borderstyleDotted;break;
                    case c_oAscBorderStyles.Double:				nStyle = EBorderStyle.borderstyleDouble;break;
                    case c_oAscBorderStyles.Hair:				nStyle = EBorderStyle.borderstyleHair;break;
                    case c_oAscBorderStyles.Medium:				nStyle = EBorderStyle.borderstyleMedium;break;
                    case c_oAscBorderStyles.MediumDashDot:		nStyle = EBorderStyle.borderstyleMediumDashDot;break;
                    case c_oAscBorderStyles.MediumDashDotDot:	nStyle = EBorderStyle.borderstyleMediumDashDotDot;break;
                    case c_oAscBorderStyles.MediumDashed:		nStyle = EBorderStyle.borderstyleMediumDashed;break;
                    case c_oAscBorderStyles.None:				nStyle = EBorderStyle.borderstyleNone;break;
                    case c_oAscBorderStyles.SlantDashDot:		nStyle = EBorderStyle.borderstyleSlantDashDot;break;
                    case c_oAscBorderStyles.Thick:				nStyle = EBorderStyle.borderstyleThick;break;
                    case c_oAscBorderStyles.Thin:				nStyle = EBorderStyle.borderstyleThin;break;
                }
                this.memory.WriteByte(c_oSerBorderPropTypes.Style);
                this.memory.WriteByte(c_oSerPropLenType.Byte);
                this.memory.WriteByte(nStyle);
            }
        };
        this.WriteFills = function()
        {
            var oThis = this;
			var elems = this.stylesForWrite.oFillMap.elems;
			for (var i = 0; i < elems.length; ++i) {
				this.bs.WriteItem(c_oSerStylesTypes.Fill, function() {oThis.WriteFill(elems[i]);});
            }
        };
        this.WriteFill = function(fill)
        {
            var oThis = this;
            this.bs.WriteItem(c_oSerFillTypes.PatternFill, function(){oThis.WritePatternFill(fill);});
        };
        this.WritePatternFill = function(fill)
        {
            var oThis = this;
            if(null != fill.bg)
                this.bs.WriteItem(c_oSerFillTypes.PatternFillBgColor, function(){oThis.bs.WriteColorSpreadsheet(fill.bg);});
        };
        this.WriteFonts = function()
        {
            var oThis = this;
			var elems = this.stylesForWrite.oFontMap.elems;
			for (var i = 0; i < elems.length; ++i) {
				this.bs.WriteItem(c_oSerStylesTypes.Font, function() {oThis.WriteFont(elems[i]);});
            }
        };
        this.WriteFont = function(font)
        {
            var oThis = this;
            if(null != font.b)
            {
                this.memory.WriteByte(c_oSerFontTypes.Bold);
                this.memory.WriteByte(c_oSerPropLenType.Byte);
                this.memory.WriteBool(font.b);
            }
            if(null != font.c)
            {
                this.memory.WriteByte(c_oSerFontTypes.Color);
                this.memory.WriteByte(c_oSerPropLenType.Variable);
                this.bs.WriteItemWithLength(function(){oThis.bs.WriteColorSpreadsheet(font.c);});
            }
            if(null != font.i)
            {
                this.memory.WriteByte(c_oSerFontTypes.Italic);
                this.memory.WriteByte(c_oSerPropLenType.Byte);
                this.memory.WriteBool(font.i);
            }
            if(null != font.fn)
            {
                this.memory.WriteByte(c_oSerFontTypes.RFont);
                this.memory.WriteByte(c_oSerPropLenType.Variable);
                this.memory.WriteString2(font.fn);
            }
            if(null != font.scheme)
            {
                this.memory.WriteByte(c_oSerFontTypes.Scheme);
                this.memory.WriteByte(c_oSerPropLenType.Byte);
                this.memory.WriteByte(font.scheme);
            }
            if(null != font.s)
            {
                this.memory.WriteByte(c_oSerFontTypes.Strike);
                this.memory.WriteByte(c_oSerPropLenType.Byte);
                this.memory.WriteBool(font.s);
            }
            if(null != font.fs)
            {
                this.memory.WriteByte(c_oSerFontTypes.Sz);
                this.memory.WriteByte(c_oSerPropLenType.Double);
                //tood write double
                this.memory.WriteDouble2(font.fs);
            }
            if(null != font.u)
            {
                this.memory.WriteByte(c_oSerFontTypes.Underline);
                this.memory.WriteByte(c_oSerPropLenType.Byte);
                this.memory.WriteByte(font.u);
            }
            if(null != font.va)
            {
                var va = font.va;
                //server constants SubScript:1, SuperScript: 2
                if (va === AscCommon.vertalign_SubScript) {
                    va = AscCommon.vertalign_SuperScript;
                } else if (va === AscCommon.vertalign_SuperScript) {
                    va = AscCommon.vertalign_SubScript;
                }
                this.memory.WriteByte(c_oSerFontTypes.VertAlign);
                this.memory.WriteByte(c_oSerPropLenType.Byte);
                this.memory.WriteByte(va);
            }
        };
        this.WriteNumFmts = function()
        {
            var oThis = this;
			var elems = this.stylesForWrite.oNumMap.elems;
			for (var i = 0; i < elems.length; ++i) {
				this.bs.WriteItem(c_oSerStylesTypes.NumFmt, function() {oThis.WriteNum(g_nNumsMaxId + i, elems[i].getFormat());});
            }
        };
        this.WriteNum = function(id, format)
        {
            if(null != format)
            {
                this.memory.WriteByte(c_oSerNumFmtTypes.FormatCode);
                this.memory.WriteByte(c_oSerPropLenType.Variable);
                this.memory.WriteString2(format);
            }
            if(null != id)
            {
                this.memory.WriteByte(c_oSerNumFmtTypes.NumFmtId);
                this.memory.WriteByte(c_oSerPropLenType.Long);
                this.memory.WriteLong(id);
            }
        };
        this.WriteCellStyleXfs = function()
        {
            var oThis = this;
			var elems = this.stylesForWrite.oXfsStylesMap;
			for (var i = 0; i < elems.length; ++i) {
				this.bs.WriteItem(c_oSerStylesTypes.Xfs, function() {oThis.WriteXfs(elems[i], true);});
            }
        };
        this.WriteCellXfs = function()
        {
            var oThis = this;
			var elems = this.stylesForWrite.oXfsMap.elems;
			for (var i = 0; i < elems.length; ++i) {
				this.bs.WriteItem(c_oSerStylesTypes.Xfs, function() {oThis.WriteXfs(elems[i]);});
            }
        };
        this.WriteXfs = function(xfForWrite, isCellStyle)
        {
            var oThis = this;
            var xf = xfForWrite.xf;
            if(null != xfForWrite.borderid)
            {
                if(0 != xfForWrite.borderid)
                {
                    this.memory.WriteByte(c_oSerXfsTypes.ApplyBorder);
                    this.memory.WriteByte(c_oSerPropLenType.Byte);
                    this.memory.WriteBool(true);
                }
                this.memory.WriteByte(c_oSerXfsTypes.BorderId);
                this.memory.WriteByte(c_oSerPropLenType.Long);
                this.memory.WriteLong(xfForWrite.borderid);
            }
            if(null != xfForWrite.fillid)
            {
                if(0 != xfForWrite.fillid)
                {
                    this.memory.WriteByte(c_oSerXfsTypes.ApplyFill);
                    this.memory.WriteByte(c_oSerPropLenType.Byte);
                    this.memory.WriteBool(true);
                }
                this.memory.WriteByte(c_oSerXfsTypes.FillId);
                this.memory.WriteByte(c_oSerPropLenType.Long);
                this.memory.WriteLong(xfForWrite.fillid);
            }
            if(null != xfForWrite.fontid)
            {
                if(0 != xfForWrite.fontid)
                {
                    this.memory.WriteByte(c_oSerXfsTypes.ApplyFont);
                    this.memory.WriteByte(c_oSerPropLenType.Byte);
                    this.memory.WriteBool(true);
                }
                this.memory.WriteByte(c_oSerXfsTypes.FontId);
                this.memory.WriteByte(c_oSerPropLenType.Long);
                this.memory.WriteLong(xfForWrite.fontid);
            }
            if(null != xfForWrite.numid)
            {
                if(0 != xfForWrite.numid)
                {
                    this.memory.WriteByte(c_oSerXfsTypes.ApplyNumberFormat);
                    this.memory.WriteByte(c_oSerPropLenType.Byte);
                    this.memory.WriteBool(true);
                }
                this.memory.WriteByte(c_oSerXfsTypes.NumFmtId);
                this.memory.WriteByte(c_oSerPropLenType.Long);
                this.memory.WriteLong(xfForWrite.numid);
            }
			if (xf) {
				if(null != xf.align)
				{
					var alignMinimized = xf.align.getDif(g_oDefaultFormat.AlignAbs);
					if(null != alignMinimized)
					{
						this.memory.WriteByte(c_oSerXfsTypes.ApplyAlignment);
						this.memory.WriteByte(c_oSerPropLenType.Byte);
						this.memory.WriteBool(true);

						this.memory.WriteByte(c_oSerXfsTypes.Aligment);
						this.memory.WriteByte(c_oSerPropLenType.Variable);
						this.bs.WriteItemWithLength(function(){oThis.WriteAlign(alignMinimized);});
					}
				}
				if(null != xf.QuotePrefix)
				{
					this.memory.WriteByte(c_oSerXfsTypes.QuotePrefix);
					this.memory.WriteByte(c_oSerPropLenType.Byte);
					this.memory.WriteBool(xf.QuotePrefix);
				}
				if(null != xf.PivotButton)
				{
					this.memory.WriteByte(c_oSerXfsTypes.PivotButton);
					this.memory.WriteByte(c_oSerPropLenType.Byte);
					this.memory.WriteBool(xf.PivotButton);
				}
				if(!isCellStyle && null != xf.XfId)
				{
					this.memory.WriteByte(c_oSerXfsTypes.XfId);
					this.memory.WriteByte(c_oSerPropLenType.Long);
					this.memory.WriteLong(xf.XfId);
				}
            }
        };
        this.WriteAlign = function(align)
        {
            if(null != align.hor)
            {
                var ha = 4;
                switch (align.hor) {
                    case AscCommon.align_Center :ha = 0;break;
                    case AscCommon.align_Justify :ha = 5;break;
                    case AscCommon.align_Left :ha = 6;break;
                    case AscCommon.align_Right :ha = 7;break;
                }
                this.memory.WriteByte(c_oSerAligmentTypes.Horizontal);
                this.memory.WriteByte(c_oSerPropLenType.Byte);
                this.memory.WriteByte(ha);
            }
            if(null != align.indent)
            {
                this.memory.WriteByte(c_oSerAligmentTypes.Indent);
                this.memory.WriteByte(c_oSerPropLenType.Long);
                this.memory.WriteLong(align.indent);
            }
            if(null != align.RelativeIndent)
            {
                this.memory.WriteByte(c_oSerAligmentTypes.RelativeIndent);
                this.memory.WriteByte(c_oSerPropLenType.Long);
                this.memory.WriteLong(align.RelativeIndent);
            }
            if(null != align.shrink)
            {
                this.memory.WriteByte(c_oSerAligmentTypes.ShrinkToFit);
                this.memory.WriteByte(c_oSerPropLenType.Byte);
                this.memory.WriteBool(align.shrink);
            }
            if(null != align.angle)
            {
                this.memory.WriteByte(c_oSerAligmentTypes.TextRotation);
                this.memory.WriteByte(c_oSerPropLenType.Long);
                this.memory.WriteLong(align.angle);
            }
            if(null != align.ver)
            {
                this.memory.WriteByte(c_oSerAligmentTypes.Vertical);
                this.memory.WriteByte(c_oSerPropLenType.Byte);
                this.memory.WriteByte(align.ver);
            }
            if(null != align.wrap)
            {
                this.memory.WriteByte(c_oSerAligmentTypes.WrapText);
                this.memory.WriteByte(c_oSerPropLenType.Byte);
                this.memory.WriteBool(align.wrap);
            }
        };
        this.WriteDxfs = function(Dxfs, oDxfsNumFormatToId)
        {
            var oThis = this;
            for(var i = 0, length = Dxfs.length; i < length; ++i)
                this.bs.WriteItem(c_oSerStylesTypes.Dxf, function(){oThis.WriteDxf(Dxfs[i], oDxfsNumFormatToId);});
        };
        this.WriteDxf = function(Dxf, oDxfsNumFormatToId)
        {
            var oThis = this;
            if(null != Dxf.align)
                this.bs.WriteItem(c_oSer_Dxf.Alignment, function(){oThis.WriteAlign(Dxf.align);});
            if(null != Dxf.border)
                this.bs.WriteItem(c_oSer_Dxf.Border, function(){oThis.WriteBorder(Dxf.border);});
            if(null != Dxf.fill)
                this.bs.WriteItem(c_oSer_Dxf.Fill, function(){oThis.WriteFill(Dxf.fill);});
            if(null != Dxf.font)
                this.bs.WriteItem(c_oSer_Dxf.Font, function(){oThis.WriteFont(Dxf.font);});
            if(null != Dxf.num && null != oDxfsNumFormatToId)
            {
                var numId = oDxfsNumFormatToId[Dxf.num.getFormat()];
                if(null != numId)
                    this.bs.WriteItem(c_oSer_Dxf.NumFmt, function(){oThis.WriteNum(numId, Dxf.num.getFormat());});
            }
        };
        this.WriteCellStyles = function (cellStyles) {
            var oThis = this;
            for(var i = 0, length = cellStyles.length; i < length; ++i)
            {
                var style = cellStyles[i];
                this.bs.WriteItem(c_oSerStylesTypes.CellStyle, function(){oThis.WriteCellStyle(style);});
            }
        };
        this.WriteCellStyle = function (oCellStyle) {
            var oThis = this;
            if (null != oCellStyle.BuiltinId)
                this.bs.WriteItem(c_oSer_CellStyle.BuiltinId, function(){oThis.memory.WriteLong(oCellStyle.BuiltinId);});
            if (null != oCellStyle.CustomBuiltin)
                this.bs.WriteItem(c_oSer_CellStyle.CustomBuiltin, function(){oThis.memory.WriteBool(oCellStyle.CustomBuiltin);});
            if (null != oCellStyle.Hidden)
                this.bs.WriteItem(c_oSer_CellStyle.Hidden, function(){oThis.memory.WriteBool(oCellStyle.Hidden);});
            if (null != oCellStyle.ILevel)
                this.bs.WriteItem(c_oSer_CellStyle.ILevel, function(){oThis.memory.WriteLong(oCellStyle.ILevel);});
            if (null != oCellStyle.Name) {
                this.memory.WriteByte(c_oSer_CellStyle.Name);
                this.memory.WriteString2(oCellStyle.Name);
            }
            if (null != oCellStyle.XfId)
                this.bs.WriteItem(c_oSer_CellStyle.XfId, function(){oThis.memory.WriteLong(oCellStyle.XfId);});
        };
        this.WriteTableStyles = function(tableStyles)
        {
            var oThis = this;
            if(null != tableStyles.DefaultTableStyle)
            {
                this.memory.WriteByte(c_oSer_TableStyles.DefaultTableStyle);
                this.memory.WriteString2(tableStyles.DefaultTableStyle);
            }
            if(null != tableStyles.DefaultPivotStyle)
            {
                this.memory.WriteByte(c_oSer_TableStyles.DefaultPivotStyle);
                this.memory.WriteString2(tableStyles.DefaultPivotStyle);
            }
            var bEmptyCustom = true;
            for(var i in tableStyles.CustomStyles)
            {
                bEmptyCustom = false;
                break;
            }
            if(false == bEmptyCustom)
            {
                this.bs.WriteItem(c_oSer_TableStyles.TableStyles, function(){oThis.WriteTableCustomStyles(tableStyles.CustomStyles);});
            }
        };
        this.WriteTableCustomStyles = function(customStyles)
        {
            var oThis = this;
            for(var i in customStyles)
            {
                var style = customStyles[i];
                this.bs.WriteItem(c_oSer_TableStyles.TableStyle, function(){oThis.WriteTableCustomStyle(style);});
            }
        };
        this.WriteTableCustomStyle = function(customStyle)
        {
            var oThis = this;
            if(null != customStyle.name)
            {
                this.memory.WriteByte(c_oSer_TableStyle.Name);
                this.memory.WriteString2(customStyle.name);
            }
            if(null != customStyle.pivot)
                this.bs.WriteItem(c_oSer_TableStyle.Pivot, function(){oThis.memory.WriteBool(customStyle.pivot);});
            if(null != customStyle.table)
                this.bs.WriteItem(c_oSer_TableStyle.Table, function(){oThis.memory.WriteBool(customStyle.table);});

            this.bs.WriteItem(c_oSer_TableStyle.Elements, function(){oThis.WriteTableCustomStyleElements(customStyle);});
        };
        this.WriteTableCustomStyleElements = function(customStyle)
        {
            var oThis = this;
            if(null != customStyle.blankRow)
                this.bs.WriteItem(c_oSer_TableStyle.Element, function(){oThis.WriteTableCustomStyleElement(ETableStyleType.tablestyletypeBlankRow, customStyle.blankRow);});
            if(null != customStyle.firstColumn)
                this.bs.WriteItem(c_oSer_TableStyle.Element, function(){oThis.WriteTableCustomStyleElement(ETableStyleType.tablestyletypeFirstColumn, customStyle.firstColumn);});
            if(null != customStyle.firstColumnStripe)
                this.bs.WriteItem(c_oSer_TableStyle.Element, function(){oThis.WriteTableCustomStyleElement(ETableStyleType.tablestyletypeFirstColumnStripe, customStyle.firstColumnStripe);});
            if(null != customStyle.firstColumnSubheading)
                this.bs.WriteItem(c_oSer_TableStyle.Element, function(){oThis.WriteTableCustomStyleElement(ETableStyleType.tablestyletypeFirstColumnSubheading, customStyle.firstColumnSubheading);});
            if(null != customStyle.firstHeaderCell)
                this.bs.WriteItem(c_oSer_TableStyle.Element, function(){oThis.WriteTableCustomStyleElement(ETableStyleType.tablestyletypeFirstHeaderCell, customStyle.firstHeaderCell);});
            if(null != customStyle.firstRowStripe)
                this.bs.WriteItem(c_oSer_TableStyle.Element, function(){oThis.WriteTableCustomStyleElement(ETableStyleType.tablestyletypeFirstRowStripe, customStyle.firstRowStripe);});
            if(null != customStyle.firstRowSubheading)
                this.bs.WriteItem(c_oSer_TableStyle.Element, function(){oThis.WriteTableCustomStyleElement(ETableStyleType.tablestyletypeFirstRowSubheading, customStyle.firstRowSubheading);});
            if(null != customStyle.firstSubtotalColumn)
                this.bs.WriteItem(c_oSer_TableStyle.Element, function(){oThis.WriteTableCustomStyleElement(ETableStyleType.tablestyletypeFirstSubtotalColumn, customStyle.firstSubtotalColumn);});
            if(null != customStyle.firstSubtotalRow)
                this.bs.WriteItem(c_oSer_TableStyle.Element, function(){oThis.WriteTableCustomStyleElement(ETableStyleType.tablestyletypeFirstSubtotalRow, customStyle.firstSubtotalRow);});
            if(null != customStyle.firstTotalCell)
                this.bs.WriteItem(c_oSer_TableStyle.Element, function(){oThis.WriteTableCustomStyleElement(ETableStyleType.tablestyletypeFirstTotalCell, customStyle.firstTotalCell);});
            if(null != customStyle.headerRow)
                this.bs.WriteItem(c_oSer_TableStyle.Element, function(){oThis.WriteTableCustomStyleElement(ETableStyleType.tablestyletypeHeaderRow, customStyle.headerRow);});
            if(null != customStyle.lastColumn)
                this.bs.WriteItem(c_oSer_TableStyle.Element, function(){oThis.WriteTableCustomStyleElement(ETableStyleType.tablestyletypeLastColumn, customStyle.lastColumn);});
            if(null != customStyle.lastHeaderCell)
                this.bs.WriteItem(c_oSer_TableStyle.Element, function(){oThis.WriteTableCustomStyleElement(ETableStyleType.tablestyletypeLastHeaderCell, customStyle.lastHeaderCell);});
            if(null != customStyle.lastTotalCell)
                this.bs.WriteItem(c_oSer_TableStyle.Element, function(){oThis.WriteTableCustomStyleElement(ETableStyleType.tablestyletypeLastTotalCell, customStyle.lastTotalCell);});
            if(null != customStyle.pageFieldLabels)
                this.bs.WriteItem(c_oSer_TableStyle.Element, function(){oThis.WriteTableCustomStyleElement(ETableStyleType.tablestyletypePageFieldLabels, customStyle.pageFieldLabels);});
            if(null != customStyle.pageFieldValues)
                this.bs.WriteItem(c_oSer_TableStyle.Element, function(){oThis.WriteTableCustomStyleElement(ETableStyleType.tablestyletypePageFieldValues, customStyle.pageFieldValues);});
            if(null != customStyle.secondColumnStripe)
                this.bs.WriteItem(c_oSer_TableStyle.Element, function(){oThis.WriteTableCustomStyleElement(ETableStyleType.tablestyletypeSecondColumnStripe, customStyle.secondColumnStripe);});
            if(null != customStyle.secondColumnSubheading)
                this.bs.WriteItem(c_oSer_TableStyle.Element, function(){oThis.WriteTableCustomStyleElement(ETableStyleType.tablestyletypeSecondColumnSubheading, customStyle.secondColumnSubheading);});
            if(null != customStyle.secondRowStripe)
                this.bs.WriteItem(c_oSer_TableStyle.Element, function(){oThis.WriteTableCustomStyleElement(ETableStyleType.tablestyletypeSecondRowStripe, customStyle.secondRowStripe);});
            if(null != customStyle.secondRowSubheading)
                this.bs.WriteItem(c_oSer_TableStyle.Element, function(){oThis.WriteTableCustomStyleElement(ETableStyleType.tablestyletypeSecondRowSubheading, customStyle.secondRowSubheading);});
            if(null != customStyle.secondSubtotalColumn)
                this.bs.WriteItem(c_oSer_TableStyle.Element, function(){oThis.WriteTableCustomStyleElement(ETableStyleType.tablestyletypeSecondSubtotalColumn, customStyle.secondSubtotalColumn);});
            if(null != customStyle.secondSubtotalRow)
                this.bs.WriteItem(c_oSer_TableStyle.Element, function(){oThis.WriteTableCustomStyleElement(ETableStyleType.tablestyletypeSecondSubtotalRow, customStyle.secondSubtotalRow);});
            if(null != customStyle.thirdColumnSubheading)
                this.bs.WriteItem(c_oSer_TableStyle.Element, function(){oThis.WriteTableCustomStyleElement(ETableStyleType.tablestyletypeThirdColumnSubheading, customStyle.thirdColumnSubheading);});
            if(null != customStyle.thirdRowSubheading)
                this.bs.WriteItem(c_oSer_TableStyle.Element, function(){oThis.WriteTableCustomStyleElement(ETableStyleType.tablestyletypeThirdRowSubheading, customStyle.thirdRowSubheading);});
            if(null != customStyle.thirdSubtotalColumn)
                this.bs.WriteItem(c_oSer_TableStyle.Element, function(){oThis.WriteTableCustomStyleElement(ETableStyleType.tablestyletypeThirdSubtotalColumn, customStyle.thirdSubtotalColumn);});
            if(null != customStyle.thirdSubtotalRow)
                this.bs.WriteItem(c_oSer_TableStyle.Element, function(){oThis.WriteTableCustomStyleElement(ETableStyleType.tablestyletypeThirdSubtotalRow, customStyle.thirdSubtotalRow);});
            if(null != customStyle.totalRow)
                this.bs.WriteItem(c_oSer_TableStyle.Element, function(){oThis.WriteTableCustomStyleElement(ETableStyleType.tablestyletypeTotalRow, customStyle.totalRow);});
            if(null != customStyle.wholeTable)
                this.bs.WriteItem(c_oSer_TableStyle.Element, function(){oThis.WriteTableCustomStyleElement(ETableStyleType.tablestyletypeWholeTable, customStyle.wholeTable);});
        };
        this.WriteTableCustomStyleElement = function(type, customElement)
        {
            if(null != type)
            {
                this.memory.WriteByte(c_oSer_TableStyleElement.Type);
                this.memory.WriteByte(c_oSerPropLenType.Byte);
                this.memory.WriteByte(type);
            }
            if(null != customElement.size)
            {
                this.memory.WriteByte(c_oSer_TableStyleElement.Size);
                this.memory.WriteByte(c_oSerPropLenType.Long);
                this.memory.WriteLong(customElement.size);
            }
            if(null != customElement.dxf && null != this.aDxfs)
            {
                this.memory.WriteByte(c_oSer_TableStyleElement.DxfId);
                this.memory.WriteByte(c_oSerPropLenType.Long);
                this.memory.WriteLong(this.aDxfs.length);
                this.aDxfs.push(customElement.dxf);
            }
        };
    }
    function BinaryWorkbookTableWriter(memory, wb, oBinaryWorksheetsTableWriter, isCopyPaste)
    {
        this.memory = memory;
        this.bs = new BinaryCommonWriter(this.memory);
        this.wb = wb;
        this.oBinaryWorksheetsTableWriter = oBinaryWorksheetsTableWriter;
        this.isCopyPaste = isCopyPaste;
        this.Write = function()
        {
            var oThis = this;
            this.bs.WriteItemWithLength(function(){oThis.WriteWorkbookContent();});
        };
        this.WriteWorkbookContent = function()
        {
            var oThis = this;
            //WorkbookPr
            this.bs.WriteItem(c_oSerWorkbookTypes.WorkbookPr, function(){oThis.WriteWorkbookPr();});

            //BookViews
            this.bs.WriteItem(c_oSerWorkbookTypes.BookViews, function(){oThis.WriteBookViews();});

            //DefinedNames
            this.bs.WriteItem(c_oSerWorkbookTypes.DefinedNames, function(){oThis.WriteDefinedNames();});

			//PivotCaches
			var isEmptyCaches = true;
			var pivotCaches = {};
			this.oBinaryWorksheetsTableWriter.wb.forEach(function(ws) {
				for (var i = 0; i < ws.pivotTables.length; ++i) {
					var pivotTable = ws.pivotTables[i];
					if (null !== pivotTable.cacheId && pivotTable.cacheDefinition) {
						isEmptyCaches = false;
						pivotCaches[pivotTable.cacheId] = pivotTable.cacheDefinition;
					}
				}
			}, this.oBinaryWorksheetsTableWriter.isCopyPaste);
			if (!isEmptyCaches) {
				this.bs.WriteItem(c_oSerWorkbookTypes.PivotCaches, function () {oThis.WritePivotCaches(pivotCaches);});
			}
			if (this.wb.externalReferences.length > 0) {
				this.bs.WriteItem(c_oSerWorkbookTypes.ExternalReferences, function() {oThis.WriteExternalReferences();});
			}
			if (!this.isCopyPaste) {
				var macros = this.wb.oApi.macros.GetData();
				if (macros) {
					this.bs.WriteItem(c_oSerWorkbookTypes.JsaProject, function() {oThis.memory.WriteXmlString(macros);});
				}
                if (this.wb.aComments.length > 0) {
                    this.bs.WriteItem(c_oSerWorkbookTypes.Comments, function() {oThis.WriteComments(oThis.wb.aComments);});
                }
			}
        };
        this.WriteWorkbookPr = function()
        {
            var oWorkbookPr = this.wb.WorkbookPr;
            if(null != oWorkbookPr)
            {
                if(null != oWorkbookPr.Date1904)
                {
                    this.memory.WriteByte(c_oSerWorkbookPrTypes.Date1904);
                    this.memory.WriteByte(c_oSerPropLenType.Byte);
                    this.memory.WriteBool(oWorkbookPr.Date1904);
                }
                else if (null != oWorkbookPr.DateCompatibility)
                {
                    this.memory.WriteByte(c_oSerWorkbookPrTypes.DateCompatibility);
                    this.memory.WriteByte(c_oSerPropLenType.Byte);
                    this.memory.WriteBool(oWorkbookPr.DateCompatibility);
                }
				else if (null != oWorkbookPr.HidePivotFieldList)
				{
					this.memory.WriteByte(c_oSerWorkbookPrTypes.HidePivotFieldList);
					this.memory.WriteByte(c_oSerPropLenType.Byte);
					this.memory.WriteBool(oWorkbookPr.HidePivotFieldList);
				}
				else if (null != oWorkbookPr.ShowPivotChartFilter)
				{
					this.memory.WriteByte(c_oSerWorkbookPrTypes.ShowPivotChartFilter);
					this.memory.WriteByte(c_oSerPropLenType.Byte);
					this.memory.WriteBool(oWorkbookPr.ShowPivotChartFilter);
				}
			}
        };
        this.WriteBookViews = function()
        {
            var oThis = this;
            this.bs.WriteItem(c_oSerWorkbookTypes.WorkbookView, function(){oThis.WriteWorkbookView();});
        };
        this.WriteWorkbookView = function()
        {
            if (null != this.wb.nActive)
            {
                this.memory.WriteByte( c_oSerWorkbookViewTypes.ActiveTab);
                this.memory.WriteByte(c_oSerPropLenType.Long);
                this.memory.WriteLong(this.wb.nActive);
            }
        };
        this.WriteDefinedNames = function()
        {
            var oThis = this;

            var defNameList = this.wb.dependencyFormulas.saveDefName();

            if(null != defNameList ){
                for(var i = 0; i < defNameList.length; i++){
                    this.bs.WriteItem(c_oSerWorkbookTypes.DefinedName, function(){oThis.WriteDefinedName(defNameList[i]);});
                }
            }

        };
        this.WriteDefinedName = function(oDefinedName, LocalSheetId)
        {
            var oThis = this;
            if (null != oDefinedName.Name)
            {
                this.memory.WriteByte(c_oSerDefinedNameTypes.Name);
                this.memory.WriteString2(oDefinedName.Name);
            }
            if (null != oDefinedName.Ref)
            {
                this.memory.WriteByte(c_oSerDefinedNameTypes.Ref);
                this.memory.WriteString2(oDefinedName.Ref);
            }
            if (null !== oDefinedName.LocalSheetId){
                this.bs.WriteItem(c_oSerDefinedNameTypes.LocalSheetId, function(){oThis.memory.WriteLong(oDefinedName.LocalSheetId);});
            }
            if (null != oDefinedName.Hidden)
            {
                this.memory.WriteByte(c_oSerDefinedNameTypes.Hidden);
                this.memory.WriteByte(c_oSerPropLenType.Byte);
                this.memory.WriteBool(oDefinedName.Hidden);
            }
        };
		this.WritePivotCaches = function(pivotCaches) {
			var oThis = this;
			for (var id in pivotCaches) {
				this.bs.WriteItem(c_oSerWorkbookTypes.PivotCache, function(){oThis.WritePivotCache(id, pivotCaches[id]);});
			}
		};
		this.WritePivotCache = function(id, pivotCache) {
			var oThis = this;
			var oldId = pivotCache.id;
			pivotCache.id = null;
			this.bs.WriteItem(c_oSer_PivotTypes.id, function() {
				oThis.memory.WriteLong(id - 0);
			});
			this.bs.WriteItem(c_oSer_PivotTypes.cache, function() {
				pivotCache.toXml(oThis.memory);
			});
			if (pivotCache.cacheRecords) {
				this.bs.WriteItem(c_oSer_PivotTypes.record, function() {
					pivotCache.cacheRecords.toXml(oThis.memory);
				});
			}
			pivotCache.id = oldId;
		};
		this.WriteExternalReferences = function() {
			var oThis = this;
			for (var i = 0; i < this.wb.externalReferences.length; i++) {
				var externalReference = this.wb.externalReferences[i];
				switch (externalReference.Type) {
					case 0:
						this.bs.WriteItem(c_oSerWorkbookTypes.ExternalBook, function() {
							oThis.WriteExternalReference(externalReference);
						});
						break;
					case 1:
						this.bs.WriteItem(c_oSerWorkbookTypes.OleLink, function() {
							oThis.memory.WriteBuffer(externalReference.Buffer, 0, externalReference.Buffer.length);
						});
						break;
					case 2:
						this.bs.WriteItem(c_oSerWorkbookTypes.DdeLink, function() {
							oThis.memory.WriteBuffer(externalReference.Buffer, 0, externalReference.Buffer.length);
						});
						break;
				}
			}
		};
		this.WriteExternalReference = function(externalReference) {
			var oThis = this;
			if (null != externalReference.Id) {
				oThis.memory.WriteByte(c_oSer_ExternalLinkTypes.Id);
				oThis.memory.WriteString2(externalReference.Id);
			}
			if (externalReference.SheetNames.length > 0) {
				this.bs.WriteItem(c_oSer_ExternalLinkTypes.SheetNames, function() {
					oThis.WriteExternalSheetNames(externalReference.SheetNames);
				});
			}
			if (externalReference.DefinedNames.length > 0) {
				this.bs.WriteItem(c_oSer_ExternalLinkTypes.DefinedNames, function() {
					oThis.WriteExternalDefinedNames(externalReference.DefinedNames);
				});
			}
			if (externalReference.SheetDataSet.length > 0) {
				this.bs.WriteItem(c_oSer_ExternalLinkTypes.SheetDataSet, function() {
					oThis.WriteExternalSheetDataSet(externalReference.SheetDataSet);
				});
			}
		};
		this.WriteExternalSheetNames = function(sheetNames) {
			for (var i = 0; i < sheetNames.length; i++) {
				this.memory.WriteByte(c_oSer_ExternalLinkTypes.SheetName);
				this.memory.WriteString2(sheetNames[i]);
			}
		};
		this.WriteExternalDefinedNames = function(definedNames) {
			var oThis = this;
			for (var i = 0; i < definedNames.length; i++) {
				this.bs.WriteItem(c_oSer_ExternalLinkTypes.DefinedName, function() {
					oThis.WriteExternalDefinedName(definedNames[i]);
				});
			}
		};
		this.WriteExternalDefinedName = function(definedName) {
			var oThis = this;
			if (null != definedName.Name) {
				oThis.memory.WriteByte(c_oSer_ExternalLinkTypes.DefinedNameName);
				oThis.memory.WriteString2(definedName.Name);
			}
			if (null != definedName.RefersTo) {
				oThis.memory.WriteByte(c_oSer_ExternalLinkTypes.DefinedNameRefersTo);
				oThis.memory.WriteString2(definedName.RefersTo);
			}
			if (null != definedName.SheetId) {
				this.bs.WriteItem(c_oSer_ExternalLinkTypes.DefinedNameSheetId, function() {
					oThis.memory.WriteLong(definedName.SheetId);
				});
			}
		};
		this.WriteExternalSheetDataSet = function(sheetDataSet) {
			var oThis = this;
			for (var i = 0; i < sheetDataSet.length; i++) {
				this.bs.WriteItem(c_oSer_ExternalLinkTypes.SheetData, function() {
					oThis.WriteExternalSheetData(sheetDataSet[i]);
				});
			}
		};
		this.WriteExternalSheetData = function(sheetData) {
			var oThis = this;
			if (null != sheetData.SheetId) {
				this.bs.WriteItem(c_oSer_ExternalLinkTypes.SheetDataSheetId, function() {
					oThis.memory.WriteLong(sheetData.SheetId);
				});
			}
			if (null != sheetData.RefreshError) {
				this.bs.WriteItem(c_oSer_ExternalLinkTypes.SheetDataRefreshError, function() {
					oThis.memory.WriteBool(sheetData.RefreshError);
				});
			}
			if (sheetData.Row.length > 0) {
				for (var i = 0; i < sheetData.Row.length; i++) {
					this.bs.WriteItem(c_oSer_ExternalLinkTypes.SheetDataRow, function() {
						oThis.WriteExternalRow(sheetData.Row[i]);
					});
				}
			}
		};
		this.WriteExternalRow = function(row) {
			var oThis = this;
			if (null != row.R) {
				this.bs.WriteItem(c_oSer_ExternalLinkTypes.SheetDataRowR, function() {
					oThis.memory.WriteLong(row.R);
				});
			}
			if (row.Cell.length > 0) {
				for (var i = 0; i < row.Cell.length; i++) {
					this.bs.WriteItem(c_oSer_ExternalLinkTypes.SheetDataRowCell, function() {
						oThis.WriteExternalCell(row.Cell[i]);
					});
				}
			}
		};
		this.WriteExternalCell = function(cell) {
			var oThis = this;
			if (null != cell.Ref) {
				oThis.memory.WriteByte(c_oSer_ExternalLinkTypes.SheetDataRowCellRef);
				oThis.memory.WriteString2(cell.Ref);
			}
			if (null != cell.CellType) {
				this.bs.WriteItem(c_oSer_ExternalLinkTypes.SheetDataRowCellType, function() {
					oThis.memory.WriteByte(cell.CellType);
				});
			}
			if (null != cell.CellValue) {
				oThis.memory.WriteByte(c_oSer_ExternalLinkTypes.SheetDataRowCellValue);
				oThis.memory.WriteString2(cell.CellValue);
			}
		};
        this.WriteComments = function(aComments) {
            var t = this;
            for (var i = 0; i < aComments.length; ++i) {
                this.bs.WriteItem( c_oSer_Comments.CommentData, function(){t.oBinaryWorksheetsTableWriter.WriteCommentData(aComments[i]);});
            }
        };
    }
	function BinaryWorksheetsTableWriter(memory, wb, oSharedStrings, aDxfs, isCopyPaste)
    {
        this.memory = memory;
        this.bs = new BinaryCommonWriter(this.memory);
        this.wb = wb;
        this.oSharedStrings = oSharedStrings;
        this.aDxfs = aDxfs;
		this.stylesForWrite = new StylesForWrite();
        this.isCopyPaste = isCopyPaste;
        this._prepeareStyles = function()
        {
			this.stylesForWrite.init(this.wb.oStyleManager.oDefaultXfs);
			var styles = this.wb.CellStyles.CustomStyles;
			var style = null;
			for(var i = 0; i < styles.length; ++i) {
				style = styles[i];
				if (style.xfs) {
					this.stylesForWrite.addCellStyle(style);
				}
			}
			this.stylesForWrite.finalizeCellStyles();
        };
        this.Write = function()
        {
            var oThis = this;
            this._prepeareStyles();
            this.bs.WriteItemWithLength(function(){oThis.WriteWorksheetsContent();});
        };
        this.WriteWorksheetsContent = function()
        {
			var oThis = this;
			this.wb.forEach(function (ws, index) {
				oThis.bs.WriteItem(c_oSerWorksheetsTypes.Worksheet, function () {
					oThis.WriteWorksheet(ws, index);
				});
			}, this.isCopyPaste);
        };
        this.WriteWorksheet = function(ws, index)
        {
            var i;
            var oThis = this;
            this.bs.WriteItem(c_oSerWorksheetsTypes.WorksheetProp, function(){oThis.WriteWorksheetProp(ws, index);});

            if(ws.aCols.length > 0 || null != ws.oAllCol)
                this.bs.WriteItem(c_oSerWorksheetsTypes.Cols, function(){oThis.WriteWorksheetCols(ws);});
            
            if(!oThis.isCopyPaste)
               this.bs.WriteItem(c_oSerWorksheetsTypes.SheetViews, function(){oThis.WriteSheetViews(ws);});

            if (null !== ws.sheetPr)
                this.bs.WriteItem(c_oSerWorksheetsTypes.SheetPr, function () {oThis.WriteSheetPr(ws.sheetPr);});

            this.bs.WriteItem(c_oSerWorksheetsTypes.SheetFormatPr, function(){oThis.WriteSheetFormatPr(ws);});

            if(null != ws.PagePrintOptions)
            {
                this.bs.WriteItem(c_oSerWorksheetsTypes.PageMargins, function(){oThis.WritePageMargins(ws.PagePrintOptions.asc_getPageMargins());});

                this.bs.WriteItem(c_oSerWorksheetsTypes.PageSetup, function(){oThis.WritePageSetup(ws.PagePrintOptions.asc_getPageSetup());});

                this.bs.WriteItem(c_oSerWorksheetsTypes.PrintOptions, function(){oThis.WritePrintOptions(ws.PagePrintOptions);});
            }

            this.bs.WriteItem(c_oSerWorksheetsTypes.SheetData, function(){oThis.WriteSheetData(ws);});

            this.bs.WriteItem(c_oSerWorksheetsTypes.Hyperlinks, function(){oThis.WriteHyperlinks(ws);});

            this.bs.WriteItem(c_oSerWorksheetsTypes.MergeCells, function(){oThis.WriteMergeCells(ws);});

            if (ws.Drawings && (ws.Drawings.length))
                this.bs.WriteItem(c_oSerWorksheetsTypes.Drawings, function(){oThis.WriteDrawings(ws.Drawings);});

            if (ws.aComments.length > 0) {
                this.bs.WriteItem(c_oSerWorksheetsTypes.Comments, function () {
                    oThis.WriteComments(ws.aComments, ws);
                });
            }

            var oBinaryTableWriter;
            if(null != ws.AutoFilter && !this.isCopyPaste)
            {
                oBinaryTableWriter = new BinaryTableWriter(this.memory, this.aDxfs);
                this.bs.WriteItem(c_oSerWorksheetsTypes.Autofilter, function(){oBinaryTableWriter.WriteAutoFilter(ws.AutoFilter);});
            }
            if(null != ws.TableParts && ws.TableParts.length > 0)
            {
                oBinaryTableWriter = new BinaryTableWriter(this.memory, this.aDxfs, this.isCopyPaste);
                this.bs.WriteItem(c_oSerWorksheetsTypes.TableParts, function(){oBinaryTableWriter.Write(ws.TableParts, ws);});
            }
			if (ws.aSparklineGroups.length > 0) {
                this.bs.WriteItem(c_oSerWorksheetsTypes.SparklineGroups, function(){oThis.WriteSparklineGroups(ws.aSparklineGroups);});
            }
            // ToDo combine rules for matching ranges
			for (i = 0; i < ws.aConditionalFormattingRules.length; ++i) {
				this.bs.WriteItem(c_oSerWorksheetsTypes.ConditionalFormatting, function(){oThis.WriteConditionalFormatting(ws.aConditionalFormattingRules[i]);});
			}
			for (i = 0; i < ws.pivotTables.length; ++i) {
				this.bs.WriteItem(c_oSerWorksheetsTypes.PivotTable, function(){oThis.WritePivotTable(ws.pivotTables[i])});
			}
        };
        this.WriteWorksheetProp = function(ws, index)
        {
            var oThis = this;
            //Name
            this.memory.WriteByte(c_oSerWorksheetPropTypes.Name);
            this.memory.WriteByte(c_oSerPropLenType.Variable);
            this.memory.WriteString2(ws.sName);
            //SheetId
            this.memory.WriteByte(c_oSerWorksheetPropTypes.SheetId);
            this.memory.WriteByte(c_oSerPropLenType.Long);
            this.memory.WriteLong(index + 1);
            //Hidden
            if(null != ws.bHidden)
            {
                this.memory.WriteByte(c_oSerWorksheetPropTypes.State);
                this.memory.WriteByte(c_oSerPropLenType.Byte);
                if(true == ws.bHidden)
                    this.memory.WriteByte(EVisibleType.visibleHidden);
                else
                    this.memory.WriteByte(EVisibleType.visibleVisible);
            }
            //activeRange(serialize activeRange)
            if(oThis.isCopyPaste)
            {
                var activeRange = oThis.isCopyPaste;

                var newRange = null;
                if(ws.bExcludeHiddenRows)
                {
                    for(var i = activeRange.r1; i < activeRange.r2; i++)
                    {
                        if(ws.getRowHidden(i))
                        {
                            if(!newRange)
                            {
								newRange = activeRange.clone();
                            }
							newRange.r2--;
                        }
                    }

                    if(newRange)
                    {
						activeRange = newRange;
                    }
                }

                this.memory.WriteByte(c_oSerWorksheetPropTypes.Ref);
                this.memory.WriteByte(c_oSerPropLenType.Variable);
                this.memory.WriteString2(activeRange.getName());
            }
        };
        this.WriteWorksheetCols = function(ws)
        {
            var oThis = this;
            var aCols = ws.aCols;
            var oPrevCol = null;
            var nPrevIndexStart = null;
            var nPrevIndex = null;
            var aIndexes = [];
            for(var i in aCols)
                aIndexes.push(i - 0);
            aIndexes.sort(AscCommon.fSortAscending);
            var fInitCol = function(col, nMin, nMax){
                var oRes = {BestFit: col.BestFit, hd: col.getHidden(), Max: nMax, Min: nMin, xfsid: null, width: col.width, CustomWidth: col.CustomWidth};
                if(null == oRes.width)
                {
                    if(null != ws.oSheetFormatPr.dDefaultColWidth)
                        oRes.width = ws.oSheetFormatPr.dDefaultColWidth;
                    else
                        oRes.width = AscCommonExcel.oDefaultMetrics.ColWidthChars;
                }
                if(null != col.xfs)
					oRes.xfsid = oThis.stylesForWrite.add(col.xfs);
                return oRes;
            };
            var oAllCol = null;
            if(null != ws.oAllCol)
            {
                oAllCol = fInitCol(ws.oAllCol, 0, gc_nMaxCol0);
            }
            for(var i = 0 , length = aIndexes.length; i < length; ++i)
            {
                var nIndex = aIndexes[i];
                var col = aCols[nIndex];
                if(null != col)
                {
                    if(false == col.isEmpty())
                    {
                        if(null != oAllCol && null == nPrevIndex && nIndex > 0)
                        {
                            oAllCol.Min = 1;
                            oAllCol.Max = nIndex;
                            this.bs.WriteItem(c_oSerWorksheetsTypes.Col, function(){oThis.WriteWorksheetCol(oAllCol);});
                        }
                        if(null != nPrevIndex && (nPrevIndex + 1 != nIndex || false == oPrevCol.isEqual(col)))
                        {
                            var oColToWrite = fInitCol(oPrevCol, nPrevIndexStart + 1, nPrevIndex + 1);
                            this.bs.WriteItem(c_oSerWorksheetsTypes.Col, function(){oThis.WriteWorksheetCol(oColToWrite);});
                            nPrevIndexStart = null;
                            if(null != oAllCol && nPrevIndex + 1 != nIndex)
                            {
                                oAllCol.Min = nPrevIndex + 2;
                                oAllCol.Max = nIndex;
                                this.bs.WriteItem(c_oSerWorksheetsTypes.Col, function(){oThis.WriteWorksheetCol(oAllCol);});
                            }
                        }
                        oPrevCol = col;
                        nPrevIndex = nIndex;
                        if(null == nPrevIndexStart)
                            nPrevIndexStart = nPrevIndex;
                    }
                }
            }
            if(null != nPrevIndexStart && null != nPrevIndex && null != oPrevCol)
            {
                var oColToWrite = fInitCol(oPrevCol, nPrevIndexStart + 1, nPrevIndex + 1);
                this.bs.WriteItem(c_oSerWorksheetsTypes.Col, function(){oThis.WriteWorksheetCol(oColToWrite);});
            }
            if(null != oAllCol)
            {
                if(null == nPrevIndex)
                {
                    oAllCol.Min = 1;
                    oAllCol.Max = gc_nMaxCol0 + 1;
                    this.bs.WriteItem(c_oSerWorksheetsTypes.Col, function(){oThis.WriteWorksheetCol(oAllCol);});
                }
                else if(gc_nMaxCol0 != nPrevIndex)
                {
                    oAllCol.Min = nPrevIndex + 2;
                    oAllCol.Max = gc_nMaxCol0 + 1;
                    this.bs.WriteItem(c_oSerWorksheetsTypes.Col, function(){oThis.WriteWorksheetCol(oAllCol);});
                }
            }
        };
        this.WriteWorksheetCol = function(oCol)
        {
            if(null != oCol.BestFit)
            {
                this.memory.WriteByte(c_oSerWorksheetColTypes.BestFit);
                this.memory.WriteByte(c_oSerPropLenType.Byte);
                this.memory.WriteBool(oCol.BestFit);
            }
            if(null != oCol.hd)
            {
                this.memory.WriteByte(c_oSerWorksheetColTypes.Hidden);
                this.memory.WriteByte(c_oSerPropLenType.Byte);
                this.memory.WriteBool(oCol.hd);
            }
            if(null != oCol.Max)
            {
                this.memory.WriteByte(c_oSerWorksheetColTypes.Max);
                this.memory.WriteByte(c_oSerPropLenType.Long);
                this.memory.WriteLong(oCol.Max);
            }
            if(null != oCol.Min)
            {
                this.memory.WriteByte(c_oSerWorksheetColTypes.Min);
                this.memory.WriteByte(c_oSerPropLenType.Long);
                this.memory.WriteLong(oCol.Min);
            }
            if(null != oCol.xfsid)
            {
                this.memory.WriteByte(c_oSerWorksheetColTypes.Style);
                this.memory.WriteByte(c_oSerPropLenType.Long);
                this.memory.WriteLong(oCol.xfsid);
            }
            if(null != oCol.width)
            {
                this.memory.WriteByte(c_oSerWorksheetColTypes.Width);
                this.memory.WriteByte(c_oSerPropLenType.Double);
                this.memory.WriteDouble2(oCol.width);
            }
            if(null != oCol.CustomWidth)
            {
                this.memory.WriteByte(c_oSerWorksheetColTypes.CustomWidth);
                this.memory.WriteByte(c_oSerPropLenType.Byte);
                this.memory.WriteBool(oCol.CustomWidth);
            }
        };
        this.WriteSheetViews = function (ws) {
            var oThis = this;
            for (var i = 0, length = ws.sheetViews.length; i < length; ++i) {
				this.bs.WriteItem(c_oSerWorksheetsTypes.SheetView, function(){oThis.WriteSheetView(ws, ws.sheetViews[i]);});
            }
        };
		this.WriteSheetView = function (ws, oSheetView) {
            var oThis = this;
            if (null !== oSheetView.showGridLines)
                this.bs.WriteItem(c_oSer_SheetView.ShowGridLines, function(){oThis.memory.WriteBool(oSheetView.showGridLines);});
            if (null !== oSheetView.showRowColHeaders)
                this.bs.WriteItem(c_oSer_SheetView.ShowRowColHeaders, function(){oThis.memory.WriteBool(oSheetView.showRowColHeaders);});
			if (null !== oSheetView.zoomScale)
				this.bs.WriteItem(c_oSer_SheetView.ZoomScale, function(){oThis.memory.WriteLong(oSheetView.zoomScale);});
            if (null !== oSheetView.pane && oSheetView.pane.isInit())
                this.bs.WriteItem(c_oSer_SheetView.Pane, function(){oThis.WriteSheetViewPane(oSheetView.pane);});
			if (null !== ws.selectionRange)
				this.bs.WriteItem(c_oSer_SheetView.Selection, function(){oThis.WriteSheetViewSelection(ws.selectionRange);});
        };
        this.WriteSheetViewPane = function (oPane) {
            var oThis = this;
			//this.bs.WriteItem(c_oSer_Pane.ActivePane, function(){oThis.memory.WriteByte();});
            // Всегда пишем Frozen
            this.bs.WriteItem(c_oSer_Pane.State, function(){oThis.memory.WriteString3(AscCommonExcel.c_oAscPaneState.Frozen);});
            this.bs.WriteItem(c_oSer_Pane.TopLeftCell, function(){oThis.memory.WriteString3(oPane.topLeftFrozenCell.getID());});

            var col = oPane.topLeftFrozenCell.getCol0();
            var row = oPane.topLeftFrozenCell.getRow0();
            if (0 < col)
                this.bs.WriteItem(c_oSer_Pane.XSplit, function(){oThis.memory.WriteDouble2(col);});
            if (0 < row)
                this.bs.WriteItem(c_oSer_Pane.YSplit, function(){oThis.memory.WriteDouble2(row);});
        };
		this.WriteSheetViewSelection = function (selectionRange) {
			var oThis = this;
			if (null != selectionRange.activeCell) {
				this.bs.WriteItem(c_oSer_Selection.ActiveCell, function(){oThis.memory.WriteString3(selectionRange.activeCell.getName());});
			}
			if (null != selectionRange.activeCellId) {
				this.bs.WriteItem(c_oSer_Selection.ActiveCellId, function(){oThis.memory.WriteLong(selectionRange.activeCellId);});
			}
			//this.bs.WriteItem(c_oSer_Selection.Pane, function(){oThis.memory.WriteByte();});
			if (null != selectionRange.ranges) {
				var sqref = getSqRefString(selectionRange.ranges);
				this.bs.WriteItem(c_oSer_Selection.Sqref, function(){oThis.memory.WriteString3(sqref);});
			}
		};
        this.WriteSheetPr = function (sheetPr) {
            var oThis = this;
            if (null !== sheetPr.CodeName)
                this.bs.WriteItem(c_oSer_SheetPr.CodeName, function(){oThis.memory.WriteString3(sheetPr.CodeName);});
            if (null !== sheetPr.EnableFormatConditionsCalculation)
                this.bs.WriteItem(c_oSer_SheetPr.EnableFormatConditionsCalculation, function(){oThis.memory.WriteBool(sheetPr.EnableFormatConditionsCalculation);});
            if (null !== sheetPr.FilterMode)
                this.bs.WriteItem(c_oSer_SheetPr.FilterMode, function(){oThis.memory.WriteBool(sheetPr.FilterMode);});
            if (null !== sheetPr.Published)
                this.bs.WriteItem(c_oSer_SheetPr.Published, function(){oThis.memory.WriteBool(sheetPr.Published);});
            if (null !== sheetPr.SyncHorizontal)
                this.bs.WriteItem(c_oSer_SheetPr.SyncHorizontal, function(){oThis.memory.WriteBool(sheetPr.SyncHorizontal);});
            if (null !== sheetPr.SyncRef)
                this.bs.WriteItem(c_oSer_SheetPr.SyncRef, function(){oThis.memory.WriteString3(sheetPr.SyncRef);});
            if (null !== sheetPr.SyncVertical)
                this.bs.WriteItem(c_oSer_SheetPr.SyncVertical, function(){oThis.memory.WriteBool(sheetPr.SyncVertical);});
            if (null !== sheetPr.TransitionEntry)
                this.bs.WriteItem(c_oSer_SheetPr.TransitionEntry, function(){oThis.memory.WriteBool(sheetPr.TransitionEntry);});
            if (null !== sheetPr.TransitionEvaluation)
                this.bs.WriteItem(c_oSer_SheetPr.TransitionEvaluation, function(){oThis.memory.WriteBool(sheetPr.TransitionEvaluation);});
            if (null !== sheetPr.TabColor)
                this.bs.WriteItem(c_oSer_SheetPr.TabColor, function(){oThis.bs.WriteColorSpreadsheet(sheetPr.TabColor);});
        };
        this.WriteSheetFormatPr = function(ws)
        {
            if (null !== ws.oSheetFormatPr.nBaseColWidth) {
                this.memory.WriteByte(c_oSerSheetFormatPrTypes.BaseColWidth);
                this.memory.WriteByte(c_oSerPropLenType.Long);
                this.memory.WriteLong(ws.oSheetFormatPr.nBaseColWidth);
            }
            if(null !== ws.oSheetFormatPr.dDefaultColWidth) {
                this.memory.WriteByte(c_oSerSheetFormatPrTypes.DefaultColWidth);
                this.memory.WriteByte(c_oSerPropLenType.Double);
                this.memory.WriteDouble2(ws.oSheetFormatPr.dDefaultColWidth);
            }
            if(null !== ws.oSheetFormatPr.oAllRow) {
                var oAllRow = ws.oSheetFormatPr.oAllRow;
                if(oAllRow.h)
                {
                    this.memory.WriteByte(c_oSerSheetFormatPrTypes.DefaultRowHeight);
                    this.memory.WriteByte(c_oSerPropLenType.Double);
                    this.memory.WriteDouble2(oAllRow.h);
                }
                if(oAllRow.getCustomHeight())
                {
                    this.memory.WriteByte(c_oSerSheetFormatPrTypes.CustomHeight);
                    this.memory.WriteByte(c_oSerPropLenType.Byte);
                    this.memory.WriteBool(true);
                }
                if(oAllRow.getHidden())
                {
                    this.memory.WriteByte(c_oSerSheetFormatPrTypes.ZeroHeight);
                    this.memory.WriteByte(c_oSerPropLenType.Byte);
                    this.memory.WriteBool(true);
                }
            }
        };
        this.WritePageMargins = function(oMargins)
        {
            //Left
            var dLeft = oMargins.asc_getLeft();
            if(null != dLeft)
            {
                this.memory.WriteByte(c_oSer_PageMargins.Left);
                this.memory.WriteByte(c_oSerPropLenType.Double);
                this.memory.WriteDouble2(dLeft);
            }
            //Top
            var dTop = oMargins.asc_getTop();
            if(null != dTop)
            {
                this.memory.WriteByte(c_oSer_PageMargins.Top);
                this.memory.WriteByte(c_oSerPropLenType.Double);
                this.memory.WriteDouble2(dTop);
            }
            //Right
            var dRight = oMargins.asc_getRight();
            if(null != dRight)
            {
                this.memory.WriteByte(c_oSer_PageMargins.Right);
                this.memory.WriteByte(c_oSerPropLenType.Double);
                this.memory.WriteDouble2(dRight);
            }
            //Bottom
            var dBottom = oMargins.asc_getBottom();
            if(null != dBottom)
            {
                this.memory.WriteByte(c_oSer_PageMargins.Bottom);
                this.memory.WriteByte(c_oSerPropLenType.Double);
                this.memory.WriteDouble2(dBottom);
            }

            this.memory.WriteByte(c_oSer_PageMargins.Header);
            this.memory.WriteByte(c_oSerPropLenType.Double);
            this.memory.WriteDouble2(12.7);//0.5inch

            this.memory.WriteByte(c_oSer_PageMargins.Footer);
            this.memory.WriteByte(c_oSerPropLenType.Double);
            this.memory.WriteDouble2(12.7);//0.5inch
        };
        this.WritePageSetup = function(oPageSetup)
        {
            //Orientation
            var byteOrientation = oPageSetup.asc_getOrientation();
            if(null != byteOrientation)
            {
                var byteFormatOrientation = null;
                switch(byteOrientation)
                {
                    case c_oAscPageOrientation.PagePortrait: byteFormatOrientation = EPageOrientation.pageorientPortrait;break;
                    case c_oAscPageOrientation.PageLandscape: byteFormatOrientation = EPageOrientation.pageorientLandscape;break;
                }
                if(null != byteFormatOrientation)
                {
                    this.memory.WriteByte(c_oSer_PageSetup.Orientation);
                    this.memory.WriteByte(c_oSerPropLenType.Byte);
                    this.memory.WriteByte(byteFormatOrientation);
                }
            }
            //PageSize
            var dWidth = oPageSetup.asc_getWidth();
            var dHeight = oPageSetup.asc_getHeight();
            if(null != dWidth && null != dHeight)
            {
                var item = DocumentPageSize.getSizeByWH(dWidth, dHeight);
                this.memory.WriteByte(c_oSer_PageSetup.PaperSize);
                this.memory.WriteByte(c_oSerPropLenType.Byte);
                this.memory.WriteByte(item.id);
            }
        };
        this.WritePrintOptions = function(oPrintOptions)
        {
            //GridLines
            var bGridLines = oPrintOptions.asc_getGridLines();
            if(null != bGridLines)
            {
                this.memory.WriteByte(c_oSer_PrintOptions.GridLines);
                this.memory.WriteByte(c_oSerPropLenType.Byte);
                this.memory.WriteBool(bGridLines);
            }
            //Headings
            var bHeadings = oPrintOptions.asc_getHeadings();
            if(null != bHeadings)
            {
                this.memory.WriteByte(c_oSer_PrintOptions.Headings);
                this.memory.WriteByte(c_oSerPropLenType.Byte);
                this.memory.WriteBool(bHeadings);
            }
        };
        this.WriteHyperlinks = function(ws)
        {
            var oThis = this;
            var oHyperlinks = ws.hyperlinkManager.getAll();
            //todo sort
            for(var i in oHyperlinks)
            {
                var elem = oHyperlinks[i];
                //write only active hyperlink, if copy/paste
                if(!this.isCopyPaste || (this.isCopyPaste && elem && elem.bbox && this.isCopyPaste.containsRange(elem.bbox)))
                    this.bs.WriteItem(c_oSerWorksheetsTypes.Hyperlink, function(){oThis.WriteHyperlink(elem.data);});
            }
        };
        this.WriteHyperlink = function (oHyperlink) {
            if (null != oHyperlink.Ref) {
                this.memory.WriteByte(c_oSerHyperlinkTypes.Ref);
                this.memory.WriteString2(oHyperlink.Ref.getName());
            }
            if (null != oHyperlink.Hyperlink) {
                this.memory.WriteByte(c_oSerHyperlinkTypes.Hyperlink);
                this.memory.WriteString2(oHyperlink.Hyperlink);
            }
            if (null !== oHyperlink.getLocation()) {
                this.memory.WriteByte(c_oSerHyperlinkTypes.Location);
                this.memory.WriteString2(oHyperlink.getLocation());
            }
            if (null != oHyperlink.Tooltip) {
                this.memory.WriteByte(c_oSerHyperlinkTypes.Tooltip);
                this.memory.WriteString2(oHyperlink.Tooltip);
            }
        };
        this.WriteMergeCells = function(ws)
        {
            var oMerged = ws.mergeManager.getAll();
			var aMergedUsed = {};//защита чтобы не писать один и тотже диапазон несколько раз
            for(var i in oMerged)
            {
                var elem = oMerged[i];
                var bbox = elem.bbox;
                if(bbox.r1 != bbox.r2 || bbox.c1 != bbox.c2)
                {
                    //write only active merge, if copy/paste
                    if(!this.isCopyPaste || (this.isCopyPaste && this.isCopyPaste.containsRange(bbox)))
                    {
						var sCurMerged = bbox.getName();
						if(null == aMergedUsed[sCurMerged]){
							aMergedUsed[sCurMerged] = 1;
							this.memory.WriteByte(c_oSerWorksheetsTypes.MergeCell);
							this.memory.WriteString2(sCurMerged);
						}
                    }
                }
            }
        };
        this.WriteDrawings = function(aDrawings)
        {
            var oThis = this;
            var oPPTXWriter = pptx_content_writer.BinaryFileWriter;
            oPPTXWriter.ClearIdMap();
            for(var i = 0, length = aDrawings.length; i < length; ++i)
            {
                //write only active drawing, if copy/paste
                var oDrawing = aDrawings[i];
                if(!this.isCopyPaste)
                    this.bs.WriteItem(c_oSerWorksheetsTypes.Drawing, function(){oThis.WriteDrawing(oDrawing);});
                else if(this.isCopyPaste && oDrawing.graphicObject.selected)//for copy/paste
                {
                    if(oDrawing.isGroup() && oDrawing.graphicObject.selectedObjects && oDrawing.graphicObject.selectedObjects.length)
                    {
                        var oDrawingSelected = oDrawing.graphicObject.selectedObjects;
                        var curDrawing, graphicObject;
                        for(var selDr = 0; selDr < oDrawingSelected.length; selDr++)
                        {
                            curDrawing = oDrawingSelected[selDr];

							//меняем graphicObject на время записи
							graphicObject = oDrawing.graphicObject;
							oDrawing.graphicObject = curDrawing;

                            this.bs.WriteItem(c_oSerWorksheetsTypes.Drawing, function(){oThis.WriteDrawing(oDrawing, curDrawing);});
							
							//возвращаем graphicObject обратно
							oDrawing.graphicObject = graphicObject;
                        }
                    }
                    else
                    {
                        var oCurDrawingToWrite;
                        if(!oDrawing.graphicObject.fromSerialize)
                        {
                            this.bs.WriteItem(c_oSerWorksheetsTypes.Drawing, function(){oThis.WriteDrawing(oDrawing);});
                        }
                        else
                        {
                            var oCurDrawingToWrite = AscFormat.ExecuteNoHistory(function()
                            {
                                var oRet = oDrawing.graphicObject.copy();
                                var oMetrics = oDrawing.getGraphicObjectMetrics();
                                AscFormat.SetXfrmFromMetrics(oRet, oMetrics);
                                return oRet;
                            }, this, []);
                            var oOldGrObject = oDrawing.graphicObject;
                            oDrawing.graphicObject = oCurDrawingToWrite;
                            this.bs.WriteItem(c_oSerWorksheetsTypes.Drawing, function(){oThis.WriteDrawing(oDrawing);});
                            oDrawing.graphicObject = oOldGrObject;
                        }
                    }
                }
            }
            oPPTXWriter.ClearIdMap();
        };
        this.WriteDrawing = function(oDrawing, curDrawing)
        {
            var oThis = this;
            if(null != oDrawing.Type)
                this.bs.WriteItem(c_oSer_DrawingType.Type, function(){oThis.memory.WriteByte(ECellAnchorType.cellanchorOneCell);});

            switch(oDrawing.Type)
            {
                case c_oAscCellAnchorType.cellanchorTwoCell:
                {
                    this.bs.WriteItem(c_oSer_DrawingType.From, function(){oThis.WriteFromTo(oDrawing.from);});
                    this.bs.WriteItem(c_oSer_DrawingType.To, function(){oThis.WriteFromTo(oDrawing.to);});
                    break;
                }
                case c_oAscCellAnchorType.cellanchorOneCell:
                {
                    this.bs.WriteItem(c_oSer_DrawingType.From, function(){oThis.WriteFromTo(oDrawing.from);});
                    this.bs.WriteItem(c_oSer_DrawingType.Ext, function(){oThis.WriteExt(oDrawing.ext);});
                    break;
                }
                case c_oAscCellAnchorType.cellanchorAbsolute:
                {
                    this.bs.WriteItem(c_oSer_DrawingType.Pos, function(){oThis.WritePos(oDrawing.Pos);});
                    this.bs.WriteItem(c_oSer_DrawingType.Ext, function(){oThis.WriteExt(oDrawing.ext);});
                    break;
                }
            }
            if(curDrawing)
                this.bs.WriteItem(c_oSer_DrawingType.pptxDrawing, function(){pptx_content_writer.WriteDrawing(oThis.memory, curDrawing, null, null, null);});
            else
                this.bs.WriteItem(c_oSer_DrawingType.pptxDrawing, function(){pptx_content_writer.WriteDrawing(oThis.memory, oDrawing.graphicObject, null, null, null);});
        };
        this.WriteFromTo = function(oFromTo)
        {
            if(null != oFromTo.col)
            {
                this.memory.WriteByte(c_oSer_DrawingFromToType.Col);
                this.memory.WriteByte(c_oSerPropLenType.Long);
                this.memory.WriteLong(oFromTo.col);
            }
            if(null != oFromTo.colOff)
            {
                this.memory.WriteByte(c_oSer_DrawingFromToType.ColOff);
                this.memory.WriteByte(c_oSerPropLenType.Double);
                this.memory.WriteDouble2(oFromTo.colOff);
            }
            if(null != oFromTo.row)
            {
                this.memory.WriteByte(c_oSer_DrawingFromToType.Row);
                this.memory.WriteByte(c_oSerPropLenType.Long);
                this.memory.WriteLong(oFromTo.row);
            }
            if(null != oFromTo.rowOff)
            {
                this.memory.WriteByte(c_oSer_DrawingFromToType.RowOff);
                this.memory.WriteByte(c_oSerPropLenType.Double);
                this.memory.WriteDouble2(oFromTo.rowOff);
            }
        };
        this.WritePos = function(oPos)
        {
            if(null != oPos.X)
            {
                this.memory.WriteByte(c_oSer_DrawingPosType.X);
                this.memory.WriteByte(c_oSerPropLenType.Double);
                this.memory.WriteDouble2(oPos.X);
            }
            if(null != oPos.Y)
            {
                this.memory.WriteByte(c_oSer_DrawingPosType.Y);
                this.memory.WriteByte(c_oSerPropLenType.Double);
                this.memory.WriteDouble2(oPos.Y);
            }
        };
        this.WriteExt = function(oExt)
        {
            if(null != oExt.cx)
            {
                this.memory.WriteByte(c_oSer_DrawingExtType.Cx);
                this.memory.WriteByte(c_oSerPropLenType.Double);
                this.memory.WriteDouble2(oExt.cx);
            }
            if(null != oExt.cy)
            {
                this.memory.WriteByte(c_oSer_DrawingExtType.Cy);
                this.memory.WriteByte(c_oSerPropLenType.Double);
                this.memory.WriteDouble2(oExt.cy);
            }
        };
        this.WriteSheetData = function(ws)
        {
            var oThis = this;
            var range;
            if(oThis.isCopyPaste ){
				range = ws.getRange3(oThis.isCopyPaste.r1, oThis.isCopyPaste.c1, oThis.isCopyPaste.r2, oThis.isCopyPaste.c2);
			} else {
				range = ws.getRange3(0, 0, gc_nMaxRow0, gc_nMaxCol0);
			}
			var bIsTablePartContainActiveRange;
			if (oThis.isCopyPaste) {
				bIsTablePartContainActiveRange = ws.autoFilters.isTablePartContainActiveRange(ws.selectionRange.getLast());
			}

			var nStartRow = -1;
			var nStartCells = -1;
            var curRow = -1;
            var allRow = ws.getAllRowNoEmpty();
			var tempRow = new AscCommonExcel.Row(ws);
			if (allRow) {
				tempRow.copyFrom(allRow);
			}
			range._foreachRowNoEmpty(function(row, excludedCount) {
				if (-1 != nStartRow) {
					oThis.bs.WriteItemWithLengthEnd(nStartCells);
					oThis.bs.WriteItemEnd(nStartRow);
				}
				nStartRow = oThis.bs.WriteItemStart(c_oSerWorksheetsTypes.Row);
				nStartCells = oThis.WriteRow(row, -excludedCount);
				curRow = row.getIndex();
			}, function(cell, nRow0, nCol0, nRowStart0, nColStart0, excludedCount) {
				if (curRow != nRow0) {
					if (-1 != nStartRow) {
						oThis.bs.WriteItemWithLengthEnd(nStartCells);
						oThis.bs.WriteItemEnd(nStartRow);
					}
					tempRow.setIndex(nRow0);
					nStartRow = oThis.bs.WriteItemStart(c_oSerWorksheetsTypes.Row);
					nStartCells = oThis.WriteRow(tempRow, -excludedCount);
					curRow = nRow0;
				}
				//готовим ячейку к записи
				var nXfsId;
				var cellXfs = cell.xfs;
				/*if (oThis.isCopyPaste && bIsTablePartContainActiveRange) {
					var compiledXfs = cell.getCompiledStyle();
					nXfsId = oThis.stylesForWrite.add(compiledXfs);
					cellXfs = compiledXfs;
				} else {*/
					nXfsId = oThis.stylesForWrite.add(cell.xfs);
				//}

				//сохраняем как и Excel даже пустой стиль(нужно чтобы убрать стиль строки/колонки)
				if (null != cellXfs || false == cell.isNullText()) {
					oThis.bs.WriteItem(c_oSerRowTypes.Cell, function () {
						oThis.WriteCell(cell, nXfsId, nRow0 - excludedCount);
					});
				}
			}, (ws.bExcludeHiddenRows && oThis.isCopyPaste));

			if (-1 != nStartRow) {
				this.bs.WriteItemWithLengthEnd(nStartCells);
				this.bs.WriteItemEnd(nStartRow);
			}
		};
      
        this.WriteRow = function(oRow, changeIndex)
        {
            var oThis = this;
            if(null != oRow.index)
            {
                this.memory.WriteByte(c_oSerRowTypes.Row);
                this.memory.WriteByte(c_oSerPropLenType.Long);
                this.memory.WriteLong(oRow.index + 1 + changeIndex);
            }
            if(null != oRow.xfs)
            {
                var nXfsId = this.stylesForWrite.add(oRow.xfs);
                this.memory.WriteByte(c_oSerRowTypes.Style);
                this.memory.WriteByte(c_oSerPropLenType.Long);
                this.memory.WriteLong(nXfsId);
            }
            if(null != oRow.h)
            {
                this.memory.WriteByte(c_oSerRowTypes.Height);
                this.memory.WriteByte(c_oSerPropLenType.Double);
                this.memory.WriteDouble2(oRow.h);
            }
            if(oRow.getCustomHeight())
            {
                this.memory.WriteByte(c_oSerRowTypes.CustomHeight);
                this.memory.WriteByte(c_oSerPropLenType.Byte);
                this.memory.WriteBool(true);
            }
            if(oRow.getHidden())
            {
                this.memory.WriteByte(c_oSerRowTypes.Hidden);
                this.memory.WriteByte(c_oSerPropLenType.Byte);
                this.memory.WriteBool(true);
            }

            this.memory.WriteByte(c_oSerRowTypes.Cells);
            this.memory.WriteByte(c_oSerPropLenType.Variable);
            return this.bs.WriteItemWithLengthStart();
        };
        this.WriteCell = function(cell, nXfsId, nRowIndex)
        {
            var oThis = this;
            if(cell.nCol >= 0)
            {
				this.bs.WriteItem(c_oSerCellTypes.RefRowCol, function(){oThis.memory.WriteLong(nRowIndex);oThis.memory.WriteLong(cell.nCol);});
				
				if(null != nXfsId)
				{
					this.bs.WriteItem(c_oSerCellTypes.Style, function(){oThis.memory.WriteLong(nXfsId);});
				}
				if(null != cell.formulaParsed)
					this.bs.WriteItem(c_oSerCellTypes.Formula, function(){oThis.WriteFormula(cell.formulaParsed);});
				if(!cell.isNullTextString())
				{
                    if (null != cell.formulaParsed && cell.isEmptyTextString()) {
                        this.bs.WriteItem(c_oSerCellTypes.Type, function(){oThis.memory.WriteByte(ECellTypeType.celltypeStr);});
                        this.bs.WriteItem(c_oSerCellTypes.ValueText, function(){oThis.memory.WriteString3("");});
                    } else {
                        var nCellType = cell.getType();
                        if(null != nCellType)
                        {
                            var nType = ECellTypeType.celltypeNumber;
                            switch(nCellType)
                            {
                                case CellValueType.Bool: nType = ECellTypeType.celltypeBool; break;
                                case CellValueType.Error: nType = ECellTypeType.celltypeError; break;
                                case CellValueType.Number: nType = ECellTypeType.celltypeNumber; break;
                                case CellValueType.String: nType = ECellTypeType.celltypeSharedString; break;
                            }
                            if(ECellTypeType.celltypeNumber != nType)
                                this.bs.WriteItem(c_oSerCellTypes.Type, function(){oThis.memory.WriteByte(nType);});
                        }
                        var dValue = 0;
                        if(CellValueType.Error == nCellType || CellValueType.String == nCellType)
                        {
                            var textIndex = cell.getTextIndex();
                            if (null !== textIndex) {
                                dValue = this.oSharedStrings.strings[textIndex];
                                if (undefined === dValue) {
                                    dValue = this.oSharedStrings.index++;
                                    this.oSharedStrings.strings[textIndex] = dValue;
                                }
                            }
                        }
                        else
                        {
                            if(null != cell.number)
                                dValue = cell.number;
                        }
                        this.bs.WriteItem(c_oSerCellTypes.Value, function(){oThis.memory.WriteDouble2(dValue);});
                    }
				}
			}
        };
        this.WriteFormula = function(formulaParsed)
        {
            // if(null != oFormula.aca)
            // {
            // this.memory.WriteByte(c_oSerFormulaTypes.Aca);
            // this.memory.WriteByte(c_oSerPropLenType.Byte);
            // this.memory.WriteBool(oFormula.aca);
            // }
            // if(null != oFormula.bx)
            // {
            // this.memory.WriteByte(c_oSerFormulaTypes.Bx);
            // this.memory.WriteByte(c_oSerPropLenType.Byte);
            // this.memory.WriteBool(oFormula.bx);
            // }
            if(true === formulaParsed.ca)
            {
                this.memory.WriteByte(c_oSerFormulaTypes.Ca);
                this.memory.WriteByte(c_oSerPropLenType.Byte);
                this.memory.WriteBool(formulaParsed.ca);
            }
            // if(null != oFormula.del1)
            // {
            // this.memory.WriteByte(c_oSerFormulaTypes.Del1);
            // this.memory.WriteByte(c_oSerPropLenType.Byte);
            // this.memory.WriteBool(oFormula.del1);
            // }
            // if(null != oFormula.del2)
            // {
            // this.memory.WriteByte(c_oSerFormulaTypes.Del2);
            // this.memory.WriteByte(c_oSerPropLenType.Byte);
            // this.memory.WriteBool(oFormula.del2);
            // }
            // if(null != oFormula.dt2d)
            // {
            // this.memory.WriteByte(c_oSerFormulaTypes.Dt2D);
            // this.memory.WriteByte(c_oSerPropLenType.Byte);
            // this.memory.WriteBool(oFormula.dt2d);
            // }
            // if(null != oFormula.dtr)
            // {
            // this.memory.WriteByte(c_oSerFormulaTypes.Dtr);
            // this.memory.WriteByte(c_oSerPropLenType.Byte);
            // this.memory.WriteBool(oFormula.dtr);
            // }
            // if(null != oFormula.r1)
            // {
            // this.memory.WriteByte(c_oSerFormulaTypes.R1);
            // this.memory.WriteByte(c_oSerPropLenType.Variable);
            // this.memory.WriteString2(oFormula.r1);
            // }
            // if(null != oFormula.r2)
            // {
            // this.memory.WriteByte(c_oSerFormulaTypes.R2);
            // this.memory.WriteByte(c_oSerPropLenType.Variable);
            // this.memory.WriteString2(oFormula.r2);
            // }
            // if(null != oFormula.ref)
            // {
            // this.memory.WriteByte(c_oSerFormulaTypes.Ref);
            // this.memory.WriteByte(c_oSerPropLenType.Variable);
            // this.memory.WriteString2(oFormula.ref);
            // }
            // if(null != oFormula.si)
            // {
            // this.memory.WriteByte(c_oSerFormulaTypes.Si);
            // this.memory.WriteByte(c_oSerPropLenType.Long);
            // this.memory.WriteLong(oFormula.si);
            // }
            // if(null != oFormula.t)
            // {
            // this.memory.WriteByte(c_oSerFormulaTypes.T);
            // this.memory.WriteByte(c_oSerPropLenType.Byte);
            // this.memory.WriteByte(oFormula.t);
            // }
            // if(null != oFormula.v)
            // {
            // this.memory.WriteByte(c_oSerFormulaTypes.Text);
            // this.memory.WriteByte(c_oSerPropLenType.Variable);
            // this.memory.WriteString2(oFormula.v);
            // }
            this.memory.WriteByte(c_oSerFormulaTypes.Text);
            this.memory.WriteByte(c_oSerPropLenType.Variable);
            this.memory.WriteString2(formulaParsed.Formula);
        };
        this.WriteComments = function(aComments, ws)
        {
            var oThis = this;
            var i, elem, coord;
            for(i = 0; i < aComments.length; ++i)
            {
                elem = aComments[i];
                //write only active comments, if copy/paste
                if(this.isCopyPaste)
				{
					//ignore hidden rows if ws.bExcludeHiddenRows === true
					if(!this.isCopyPaste.contains(elem.nCol, elem.nRow) || (ws.bExcludeHiddenRows && ws.getRowHidden(elem.nRow)))
					{
						continue;
					}
				}
                coord = elem.coords;
                if(null === coord.nLeft || null === coord.nTop || null === coord.nRight || null === coord.nBottom ||
                    null === coord.nLeftOffset || null === coord.nTopOffset || null === coord.nRightOffset || null === coord.nBottomOffset ||
                    null === coord.dLeftMM || null === coord.dTopMM || null === coord.dWidthMM || null === coord.dHeightMM)
                    continue;
                this.bs.WriteItem(c_oSerWorksheetsTypes.Comment, function(){oThis.WriteComment(elem);});
            }
        };
        this.WriteComment = function(comment)
        {
            var oThis = this;
            this.memory.WriteByte(c_oSer_Comments.Row);
            this.memory.WriteByte(c_oSerPropLenType.Long);
            this.memory.WriteLong(comment.coords.nRow);

            this.memory.WriteByte(c_oSer_Comments.Col);
            this.memory.WriteByte(c_oSerPropLenType.Long);
            this.memory.WriteLong(comment.coords.nCol);

            this.memory.WriteByte(c_oSer_Comments.CommentDatas);
            this.memory.WriteByte(c_oSerPropLenType.Variable);
            this.bs.WriteItemWithLength(function(){oThis.WriteCommentDatas(comment);});

            this.memory.WriteByte(c_oSer_Comments.Left);
            this.memory.WriteByte(c_oSerPropLenType.Long);
            this.memory.WriteLong(comment.coords.nLeft);

            this.memory.WriteByte(c_oSer_Comments.Top);
            this.memory.WriteByte(c_oSerPropLenType.Long);
            this.memory.WriteLong(comment.coords.nTop);

            this.memory.WriteByte(c_oSer_Comments.Right);
            this.memory.WriteByte(c_oSerPropLenType.Long);
            this.memory.WriteLong(comment.coords.nRight);

            this.memory.WriteByte(c_oSer_Comments.Bottom);
            this.memory.WriteByte(c_oSerPropLenType.Long);
            this.memory.WriteLong(comment.coords.nBottom);

            this.memory.WriteByte(c_oSer_Comments.LeftOffset);
            this.memory.WriteByte(c_oSerPropLenType.Long);
            this.memory.WriteLong(comment.coords.nLeftOffset);

            this.memory.WriteByte(c_oSer_Comments.TopOffset);
            this.memory.WriteByte(c_oSerPropLenType.Long);
            this.memory.WriteLong(comment.coords.nTopOffset);

            this.memory.WriteByte(c_oSer_Comments.RightOffset);
            this.memory.WriteByte(c_oSerPropLenType.Long);
            this.memory.WriteLong(comment.coords.nRightOffset);

            this.memory.WriteByte(c_oSer_Comments.BottomOffset);
            this.memory.WriteByte(c_oSerPropLenType.Long);
            this.memory.WriteLong(comment.coords.nBottomOffset);

            this.memory.WriteByte(c_oSer_Comments.LeftMM);
            this.memory.WriteByte(c_oSerPropLenType.Double);
            this.memory.WriteDouble2(comment.coords.dLeftMM);

            this.memory.WriteByte(c_oSer_Comments.TopMM);
            this.memory.WriteByte(c_oSerPropLenType.Double);
            this.memory.WriteDouble2(comment.coords.dTopMM);

            this.memory.WriteByte(c_oSer_Comments.WidthMM);
            this.memory.WriteByte(c_oSerPropLenType.Double);
            this.memory.WriteDouble2(comment.coords.dWidthMM);

            this.memory.WriteByte(c_oSer_Comments.HeightMM);
            this.memory.WriteByte(c_oSerPropLenType.Double);
            this.memory.WriteDouble2(comment.coords.dHeightMM);

            this.memory.WriteByte(c_oSer_Comments.MoveWithCells);
            this.memory.WriteByte(c_oSerPropLenType.Byte);
            this.memory.WriteBool(comment.coords.bMoveWithCells);

            this.memory.WriteByte(c_oSer_Comments.SizeWithCells);
            this.memory.WriteByte(c_oSerPropLenType.Byte);
            this.memory.WriteBool(comment.coords.bSizeWithCells);
        };
        this.WriteCommentDatas = function(data)
        {
            var oThis = this;
            this.bs.WriteItem( c_oSer_Comments.CommentData, function(){oThis.WriteCommentData(data);});
        };
        this.WriteCommentData = function(oCommentData)
        {
            var oThis = this;
            var sText = oCommentData.asc_getText();
            if(null != sText)
            {
                this.memory.WriteByte(c_oSer_CommentData.Text);
                this.memory.WriteString2(sText);
            }
            var sTime = oCommentData.asc_getTime();
            if(null != sTime && "" !== sTime)
            {
                var oDate = new Date(sTime - 0);

                this.memory.WriteByte(c_oSer_CommentData.Time);
                this.memory.WriteString2(this.DateToISO8601(oDate));
            }
            var sOOTime = oCommentData.asc_getOnlyOfficeTime();
            if(null != sOOTime && "" !== sOOTime)
            {
                var oDate = new Date(sOOTime - 0);

                this.memory.WriteByte(c_oSer_CommentData.OOTime);
                this.memory.WriteString2(this.DateToISO8601(oDate));
            }
            var sUserId = oCommentData.asc_getUserId();
            if(null != sUserId)
            {
                this.memory.WriteByte(c_oSer_CommentData.UserId);
                this.memory.WriteString2(sUserId);
            }
            var sUserName = oCommentData.asc_getUserName();
            if(null != sUserName)
            {
                this.memory.WriteByte(c_oSer_CommentData.UserName);
                this.memory.WriteString2(sUserName);
            }
            var sQuoteText = oCommentData.asc_getQuoteText();
            if(null != sQuoteText)
            {
                this.memory.WriteByte(c_oSer_CommentData.QuoteText);
                this.memory.WriteString2(sQuoteText);
            }
            var bSolved = oCommentData.asc_getSolved();
            if(null != bSolved)
                this.bs.WriteItem( c_oSer_CommentData.Solved, function(){oThis.memory.WriteBool(bSolved);});
            var bDocumentFlag = oCommentData.asc_getDocumentFlag();
            if(null != bDocumentFlag)
                this.bs.WriteItem( c_oSer_CommentData.Document, function(){oThis.memory.WriteBool(bDocumentFlag);});
            var aReplies = oCommentData.aReplies;
            if(null != aReplies && aReplies.length > 0)
                this.bs.WriteItem( c_oSer_CommentData.Replies, function(){oThis.WriteReplies(aReplies);});
        };
        this.DateToISO8601 = function(d)
        {
            function pad(n){return n < 10 ? '0' + n : n;}
            return d.getUTCFullYear() + '-' + pad(d.getUTCMonth() + 1) + '-' +
                pad(d.getUTCDate()) + 'T' + pad(d.getUTCHours()) + ':' +
                pad(d.getUTCMinutes()) + ':' + pad(d.getUTCSeconds())+'Z';
        };
        this.WriteReplies = function(aReplies)
        {
            var oThis = this;
            for(var i = 0, length = aReplies.length; i < length; ++i)
                this.bs.WriteItem( c_oSer_CommentData.Reply, function(){oThis.WriteCommentData(aReplies[i]);});
        };
		this.WriteConditionalFormatting = function(oRule)
		{
			var oThis = this;
			if (null != oRule.pivot) {
				this.bs.WriteItem(c_oSer_ConditionalFormatting.Pivot, function() {oThis.memory.WriteBool(oRule.pivot);});
			}
			if (null != oRule.ranges) {
				var sqref = getSqRefString(oRule.ranges);
				this.bs.WriteItem(c_oSer_ConditionalFormatting.SqRef, function() {oThis.memory.WriteString3(sqref);});
			}
			this.bs.WriteItem(c_oSer_ConditionalFormatting.ConditionalFormattingRule, function() {oThis.WriteConditionalFormattingRule(oRule);});
		};
		this.WriteConditionalFormattingRule = function(rule) {
			var oThis = this;
			if (null != rule.aboveAverage) {
				this.bs.WriteItem(c_oSer_ConditionalFormattingRule.AboveAverage, function() {oThis.memory.WriteBool(rule.aboveAverage);});
			}
			if (null != rule.bottom) {
				this.bs.WriteItem(c_oSer_ConditionalFormattingRule.Bottom, function() {oThis.memory.WriteBool(rule.bottom);});
			}
			if (null != rule.dxf) {
				var DxfId = this.aDxfs.length;
				this.aDxfs.push(rule.dxf);
				this.bs.WriteItem(c_oSer_ConditionalFormattingRule.DxfId, function() {oThis.memory.WriteLong(DxfId);});
			}
			if (null != rule.equalAverage) {
				this.bs.WriteItem(c_oSer_ConditionalFormattingRule.EqualAverage, function() {oThis.memory.WriteBool(rule.equalAverage);});
			}
			if (null != rule.operator) {
				this.bs.WriteItem(c_oSer_ConditionalFormattingRule.Operator, function() {oThis.memory.WriteByte(rule.operator);});
			}
			if (null != rule.percent) {
				this.bs.WriteItem(c_oSer_ConditionalFormattingRule.Percent, function() {oThis.memory.WriteBool(rule.percent);});
			}
			if (null != rule.priority) {
				this.bs.WriteItem(c_oSer_ConditionalFormattingRule.Priority, function() {oThis.memory.WriteLong(rule.priority);});
			}
			if (null != rule.rank) {
				this.bs.WriteItem(c_oSer_ConditionalFormattingRule.Rank, function() {oThis.memory.WriteLong(rule.rank);});
			}
			if (null != rule.stdDev) {
				this.bs.WriteItem(c_oSer_ConditionalFormattingRule.StdDev, function() {oThis.memory.WriteLong(rule.stdDev);});
			}
			if (null != rule.stopIfTrue) {
				this.bs.WriteItem(c_oSer_ConditionalFormattingRule.StopIfTrue, function() {oThis.memory.WriteBool(rule.stopIfTrue);});
			}
			if (null != rule.text) {
				this.bs.WriteItem(c_oSer_ConditionalFormattingRule.Text, function() {oThis.memory.WriteString3(rule.text);});
			}
			if (null != rule.timePeriod) {
				this.bs.WriteItem(c_oSer_ConditionalFormattingRule.TimePeriod, function() {oThis.memory.WriteString3(rule.timePeriod);});
			}
			if (null != rule.type) {
				this.bs.WriteItem(c_oSer_ConditionalFormattingRule.Type, function() {oThis.memory.WriteByte(rule.type);});
			}
			for (var i = 0; i < rule.aRuleElements.length; ++i) {
				var elem = rule.aRuleElements[i];
				if (elem instanceof AscCommonExcel.CColorScale) {
					this.bs.WriteItem(c_oSer_ConditionalFormattingRule.ColorScale, function() {oThis.WriteColorScale(elem);});
				} else if (elem instanceof AscCommonExcel.CDataBar) {
					this.bs.WriteItem(c_oSer_ConditionalFormattingRule.DataBar, function() {oThis.WriteDataBar(elem);});
				} else if (elem instanceof AscCommonExcel.CFormulaCF) {
					this.bs.WriteItem(c_oSer_ConditionalFormattingRule.FormulaCF, function() {oThis.memory.WriteString3(elem.Text);});
				} else if (elem instanceof AscCommonExcel.CIconSet) {
					this.bs.WriteItem(c_oSer_ConditionalFormattingRule.IconSet, function() {oThis.WriteIconSet(elem);});
				}
			}
		};
		this.WriteColorScale = function(colorScale) {
			var oThis = this;
			var i, elem;
			for (i = 0; i < colorScale.aCFVOs.length; ++i) {
				elem = colorScale.aCFVOs[i];
				this.bs.WriteItem(c_oSer_ConditionalFormattingRuleColorScale.CFVO, function() {oThis.WriteCFVO(elem);});
			}
			for (i = 0; i < colorScale.aColors.length; ++i) {
				elem = colorScale.aColors[i];
				this.bs.WriteItem(c_oSer_ConditionalFormattingRuleColorScale.Color, function() {oThis.bs.WriteColorSpreadsheet(elem);});
			}
		};
		this.WriteDataBar = function(dataBar) {
			var oThis = this;
			var i, elem;
			if (null != dataBar.MaxLength) {
				this.bs.WriteItem(c_oSer_ConditionalFormattingDataBar.MaxLength, function() {oThis.memory.WriteLong(dataBar.MaxLength);});
			}
			if (null != dataBar.MinLength) {
				this.bs.WriteItem(c_oSer_ConditionalFormattingDataBar.MinLength, function() {oThis.memory.WriteLong(dataBar.MinLength);});
			}
			if (null != dataBar.ShowValue) {
				this.bs.WriteItem(c_oSer_ConditionalFormattingDataBar.ShowValue, function() {oThis.memory.WriteBool(dataBar.ShowValue);});
			}
			if (null != dataBar.Color) {
				this.bs.WriteItem(c_oSer_ConditionalFormattingDataBar.Color, function() {oThis.bs.WriteColorSpreadsheet(dataBar.Color);});
			}
			for (i = 0; i < dataBar.aCFVOs.length; ++i) {
				elem = dataBar.aCFVOs[i];
				this.bs.WriteItem(c_oSer_ConditionalFormattingRuleColorScale.CFVO, function() {oThis.WriteCFVO(elem);});
			}
		};
		this.WriteIconSet = function(iconSet) {
			var oThis = this;
			var i, elem;
			if (null != iconSet.IconSet) {
				this.bs.WriteItem(c_oSer_ConditionalFormattingIconSet.IconSet, function() {oThis.memory.WriteByte(iconSet.IconSet);});
			}
			if (null != iconSet.Percent) {
				this.bs.WriteItem(c_oSer_ConditionalFormattingIconSet.Percent, function() {oThis.memory.WriteBool(iconSet.Percent);});
			}
			if (null != iconSet.Reverse) {
				this.bs.WriteItem(c_oSer_ConditionalFormattingIconSet.Reverse, function() {oThis.memory.WriteBool(iconSet.Reverse);});
			}
			if (null != iconSet.ShowValue) {
				this.bs.WriteItem(c_oSer_ConditionalFormattingIconSet.ShowValue, function() {oThis.memory.WriteBool(iconSet.ShowValue);});
			}
			for (i = 0; i < iconSet.aCFVOs.length; ++i) {
				elem = iconSet.aCFVOs[i];
				this.bs.WriteItem(c_oSer_ConditionalFormattingRuleColorScale.CFVO, function() {oThis.WriteCFVO(elem);});
			}
		};
		this.WriteCFVO = function(cfvo) {
			var oThis = this;
			if (null != cfvo.Gte) {
				this.bs.WriteItem(c_oSer_ConditionalFormattingValueObject.Gte, function() {oThis.memory.WriteBool(cfvo.Gte);});
			}
			if (null != cfvo.Type) {
				this.bs.WriteItem(c_oSer_ConditionalFormattingValueObject.Type, function() {oThis.memory.WriteByte(cfvo.Type);});
			}
			if (null != cfvo.Val) {
				this.bs.WriteItem(c_oSer_ConditionalFormattingValueObject.Val, function() {oThis.memory.WriteString3(cfvo.Val);});
			}
		};
		this.WriteSparklineGroups = function(aSparklineGroups)
        {
            var oThis = this;
            for(var i = 0, length = aSparklineGroups.length; i < length; ++i)
                this.bs.WriteItem( c_oSer_Sparkline.SparklineGroup, function(){oThis.WriteSparklineGroup(aSparklineGroups[i]);});
        };
		this.WriteSparklineGroup = function(oSparklineGroup)
        {
			var oThis = this;
			if (null != oSparklineGroup.manualMax) {
                this.bs.WriteItem( c_oSer_Sparkline.ManualMax, function(){oThis.memory.WriteDouble2(oSparklineGroup.manualMax);});
			}
			if (null != oSparklineGroup.manualMin) {
                this.bs.WriteItem( c_oSer_Sparkline.ManualMin, function(){oThis.memory.WriteDouble2(oSparklineGroup.manualMin);});
			}
			if (null != oSparklineGroup.lineWeight) {
                this.bs.WriteItem( c_oSer_Sparkline.LineWeight, function(){oThis.memory.WriteDouble2(oSparklineGroup.lineWeight);});
			}
			if (null != oSparklineGroup.type) {
                this.bs.WriteItem( c_oSer_Sparkline.Type, function(){oThis.memory.WriteByte(oSparklineGroup.type);});
			}
			if (null != oSparklineGroup.dateAxis) {
                this.bs.WriteItem( c_oSer_Sparkline.DateAxis, function(){oThis.memory.WriteBool(oSparklineGroup.dateAxis);});
			}
			if (null != oSparklineGroup.displayEmptyCellsAs) {
                this.bs.WriteItem( c_oSer_Sparkline.DisplayEmptyCellsAs, function(){oThis.memory.WriteByte(oSparklineGroup.displayEmptyCellsAs);});
			}
			if (null != oSparklineGroup.markers) {
                this.bs.WriteItem( c_oSer_Sparkline.Markers, function(){oThis.memory.WriteBool(oSparklineGroup.markers);});
			}
			if (null != oSparklineGroup.high) {
                this.bs.WriteItem( c_oSer_Sparkline.High, function(){oThis.memory.WriteBool(oSparklineGroup.high);});
			}
			if (null != oSparklineGroup.low) {
                this.bs.WriteItem( c_oSer_Sparkline.Low, function(){oThis.memory.WriteBool(oSparklineGroup.low);});
			}
			if (null != oSparklineGroup.first) {
                this.bs.WriteItem( c_oSer_Sparkline.First, function(){oThis.memory.WriteBool(oSparklineGroup.first);});
			}
			if (null != oSparklineGroup.last) {
                this.bs.WriteItem( c_oSer_Sparkline.Last, function(){oThis.memory.WriteBool(oSparklineGroup.last);});
			}
			if (null != oSparklineGroup.negative) {
                this.bs.WriteItem( c_oSer_Sparkline.Negative, function(){oThis.memory.WriteBool(oSparklineGroup.negative);});
			}
			if (null != oSparklineGroup.displayXAxis) {
                this.bs.WriteItem( c_oSer_Sparkline.DisplayXAxis, function(){oThis.memory.WriteBool(oSparklineGroup.displayXAxis);});
			}
			if (null != oSparklineGroup.displayHidden) {
                this.bs.WriteItem( c_oSer_Sparkline.DisplayHidden, function(){oThis.memory.WriteBool(oSparklineGroup.displayHidden);});
			}
			if (null != oSparklineGroup.minAxisType) {
                this.bs.WriteItem( c_oSer_Sparkline.MinAxisType, function(){oThis.memory.WriteByte(oSparklineGroup.minAxisType);});
			}
			if (null != oSparklineGroup.maxAxisType) {
                this.bs.WriteItem( c_oSer_Sparkline.MaxAxisType, function(){oThis.memory.WriteByte(oSparklineGroup.maxAxisType);});
			}
			if (null != oSparklineGroup.rightToLeft) {
                this.bs.WriteItem( c_oSer_Sparkline.RightToLeft, function(){oThis.memory.WriteBool(oSparklineGroup.rightToLeft);});
			}
			if (null != oSparklineGroup.colorSeries) {
                this.bs.WriteItem(c_oSer_Sparkline.ColorSeries, function(){oThis.bs.WriteColorSpreadsheet(oSparklineGroup.colorSeries);});
			}
			if (null != oSparklineGroup.colorNegative) {
                this.bs.WriteItem(c_oSer_Sparkline.ColorNegative, function(){oThis.bs.WriteColorSpreadsheet(oSparklineGroup.colorNegative);});
			}
			if (null != oSparklineGroup.colorAxis) {
                this.bs.WriteItem(c_oSer_Sparkline.ColorAxis, function(){oThis.bs.WriteColorSpreadsheet(oSparklineGroup.colorAxis);});
			}
			if (null != oSparklineGroup.colorMarkers) {
                this.bs.WriteItem(c_oSer_Sparkline.ColorMarkers, function(){oThis.bs.WriteColorSpreadsheet(oSparklineGroup.colorMarkers);});
			}
			if (null != oSparklineGroup.colorFirst) {
                this.bs.WriteItem(c_oSer_Sparkline.ColorFirst, function(){oThis.bs.WriteColorSpreadsheet(oSparklineGroup.colorFirst);});
			}
			if (null != oSparklineGroup.colorLast) {
                this.bs.WriteItem(c_oSer_Sparkline.ColorLast, function(){oThis.bs.WriteColorSpreadsheet(oSparklineGroup.colorLast);});
			}
			if (null != oSparklineGroup.colorHigh) {
                this.bs.WriteItem(c_oSer_Sparkline.ColorHigh, function(){oThis.bs.WriteColorSpreadsheet(oSparklineGroup.colorHigh);});
			}
			if (null != oSparklineGroup.colorLow) {
                this.bs.WriteItem(c_oSer_Sparkline.ColorLow, function(){oThis.bs.WriteColorSpreadsheet(oSparklineGroup.colorLow);});
			}
			if (null != oSparklineGroup.f) {
                this.memory.WriteByte(c_oSer_Sparkline.Ref);
                this.memory.WriteString2(oSparklineGroup.f);
			}
			if (null != oSparklineGroup.arrSparklines) {
				this.bs.WriteItem(c_oSer_Sparkline.Sparklines, function(){oThis.WriteSparklines(oSparklineGroup);});
			}
		};
		this.WriteSparklines = function(oSparklineGroup)
        {
            var oThis = this;
            for(var i = 0, length = oSparklineGroup.arrSparklines.length; i < length; ++i)
                this.bs.WriteItem( c_oSer_Sparkline.Sparkline, function(){oThis.WriteSparkline(oSparklineGroup.arrSparklines[i]);});
        };
		this.WriteSparkline = function(oSparkline)
        {
			if (null != oSparkline.f) {
                this.memory.WriteByte(c_oSer_Sparkline.SparklineRef);
                this.memory.WriteString2(oSparkline.f);
			}
			if (null != oSparkline.sqref) {
				this.memory.WriteByte(c_oSer_Sparkline.SparklineSqRef);
                this.memory.WriteString2(oSparkline.sqref.getName());
			}
		}
		this.WritePivotTable = function(pivotTable)
		{
			var oThis = this;
			if (null != pivotTable.cacheId) {
				this.bs.WriteItem(c_oSer_PivotTypes.cacheId, function() {oThis.memory.WriteLong(pivotTable.cacheId);});
			}
			this.bs.WriteItem(c_oSer_PivotTypes.table, function() {pivotTable.toXml(oThis.memory);});
		}
    }
    /** @constructor */
    function BinaryOtherTableWriter(memory, wb)
    {
        this.memory = memory;
        this.wb = wb;
        this.bs = new BinaryCommonWriter(this.memory);
        this.Write = function()
        {
            var oThis = this;
            this.bs.WriteItemWithLength(function(){oThis.WriteOtherContent();});
        };
        this.WriteOtherContent = function()
        {
            var oThis = this;
            this.bs.WriteItem(c_oSer_OtherType.Theme, function(){pptx_content_writer.WriteTheme(oThis.memory, oThis.wb.theme);});
        };
    }
    /** @constructor */
    function BinaryFileWriter(wb, isCopyPaste)
    {
        this.Memory = new AscCommon.CMemory();
        this.wb = wb;
        this.isCopyPaste = isCopyPaste;
        this.nLastFilePos = 0;
        this.nRealTableCount = 0;
        this.bs = new BinaryCommonWriter(this.Memory);
        this.Write = function(noBase64)
        {
            pptx_content_writer._Start();
			if (noBase64) {
				this.Memory.WriteXmlString(this.WriteFileHeader(0, Asc.c_nVersionNoBase64));
			}
            this.WriteMainTable();
            pptx_content_writer._End();
			if (noBase64) {
				return this.Memory.GetData();
			} else {
				return this.WriteFileHeader(this.Memory.GetCurPosition(), AscCommon.c_oSerFormat.Version) + this.Memory.GetBase64Memory();
			}
        };
        this.WriteFileHeader = function(nDataSize, version)
        {
            return AscCommon.c_oSerFormat.Signature + ";v" + version + ";" + nDataSize  + ";";
        };
        this.WriteMainTable = function()
        {
            var nTableCount = 128;//Специально ставим большое число, чтобы не увеличивать его при добавлении очередной таблицы.
            this.nRealTableCount = 0;//Специально ставим большое число, чтобы не увеличивать его при добавлении очередной таблицы.
            var nStart = this.Memory.GetCurPosition();
            //вычисляем с какой позиции можно писать таблицы
            var nmtItemSize = 5;//5 byte
            this.nLastFilePos = nStart + nTableCount * nmtItemSize;
            //Write mtLen 
            this.Memory.WriteByte(0);
            var oSharedStrings = {index: 0, strings: {}};
            //Write SharedStrings
            var nSharedStringsPos = this.ReserveTable(c_oSerTableTypes.SharedStrings);
            //Write Styles
            var nStylesTablePos = this.ReserveTable(c_oSerTableTypes.Styles);
            //Workbook
            var aDxfs = [];
            var oBinaryWorksheetsTableWriter = new BinaryWorksheetsTableWriter(this.Memory, this.wb, oSharedStrings, aDxfs, this.isCopyPaste);
            this.WriteTable(c_oSerTableTypes.Workbook, new BinaryWorkbookTableWriter(this.Memory, this.wb, oBinaryWorksheetsTableWriter, this.isCopyPaste));
            //Worksheets
            this.WriteTable(c_oSerTableTypes.Worksheets, oBinaryWorksheetsTableWriter);
            //OtherTable
            if(!this.isCopyPaste)
                this.WriteTable(c_oSerTableTypes.Other, new BinaryOtherTableWriter(this.Memory, this.wb));
            //Write SharedStrings
            this.WriteReserved(new BinarySharedStringsTableWriter(this.Memory, this.wb, oSharedStrings), nSharedStringsPos);
            //Write Styles
            this.WriteReserved(new BinaryStylesTableWriter(this.Memory, this.wb, oBinaryWorksheetsTableWriter), nStylesTablePos);
            //Пишем количество таблиц
            this.Memory.Seek(nStart);
            this.Memory.WriteByte(this.nRealTableCount);

            //seek в конец, потому что GetBase64Memory заканчивает запись на текущей позиции.
            this.Memory.Seek(this.nLastFilePos);
        };
        this.WriteTable = function(type, oTableSer)
        {
            //Write mtItem
            //Write mtiType
            this.Memory.WriteByte(type);
            //Write mtiOffBits
            this.Memory.WriteLong(this.nLastFilePos);

            //Write table
            //Запоминаем позицию в MainTable
            var nCurPos = this.Memory.GetCurPosition();
            //Seek в свободную область
            this.Memory.Seek(this.nLastFilePos);
            oTableSer.Write();
            //сдвигаем позицию куда можно следующую таблицу
            this.nLastFilePos = this.Memory.GetCurPosition();
            //Seek вобратно в MainTable
            this.Memory.Seek(nCurPos);

            this.nRealTableCount++;
        };
        this.ReserveTable = function(type)
        {
            var res = 0;
            //Write mtItem
            //Write mtiType
            this.Memory.WriteByte(type);
            res = this.Memory.GetCurPosition();
            //Write mtiOffBits
            this.Memory.WriteLong(this.nLastFilePos);
            return res;
        };
        this.WriteReserved = function(oTableSer, nPos)
        {
            this.Memory.Seek(nPos);
            this.Memory.WriteLong(this.nLastFilePos);

            //Write table
            //Запоминаем позицию в MainTable
            var nCurPos = this.Memory.GetCurPosition();
            //Seek в свободную область
            this.Memory.Seek(this.nLastFilePos);
            oTableSer.Write();
            //сдвигаем позицию куда можно следующую таблицу
            this.nLastFilePos = this.Memory.GetCurPosition();
            //Seek вобратно в MainTable
            this.Memory.Seek(nCurPos);

            this.nRealTableCount++;
        };
    }
    /** @constructor */
    function Binary_TableReader(stream, oReadResult, ws, Dxfs)
    {
        this.stream = stream;
        this.ws = ws;
        this.Dxfs = Dxfs;
        this.bcr = new Binary_CommonReader(this.stream);
        this.oReadResult = oReadResult;
        this.Read = function(length, aTables)
        {
            var res = c_oSerConstants.ReadOk;
            var oThis = this;
            res = this.bcr.Read1(length, function(t,l){
                return oThis.ReadTables(t,l, aTables);
            });
            return res;
        };
        this.ReadTables = function(type, length, aTables)
        {
            var res = c_oSerConstants.ReadOk;
            var oThis = this;
            if ( c_oSer_TablePart.Table == type )
            {
                var oNewTable = this.ws.createTablePart();
                res = this.bcr.Read1(length, function(t,l){
                    return oThis.ReadTable(t,l, oNewTable);
                });
                if(null != oNewTable.Ref && null != oNewTable.DisplayName)
                    this.ws.workbook.dependencyFormulas.addTableName(this.ws, oNewTable, true);
                aTables.push(oNewTable);
            }
            else
                res = c_oSerConstants.ReadUnknown;
            return res;
        };
        this.ReadTable = function(type, length, oTable)
        {
            var res = c_oSerConstants.ReadOk;
            var oThis = this;
            if ( c_oSer_TablePart.Ref == type )
                oTable.Ref = AscCommonExcel.g_oRangeCache.getAscRange(this.stream.GetString2LE(length));
            else if ( c_oSer_TablePart.HeaderRowCount == type )
                oTable.HeaderRowCount = this.stream.GetULongLE();
            else if ( c_oSer_TablePart.TotalsRowCount == type )
                oTable.TotalsRowCount = this.stream.GetULongLE();
            else if ( c_oSer_TablePart.DisplayName == type )
                oTable.DisplayName = this.stream.GetString2LE(length);
            else if ( c_oSer_TablePart.AutoFilter == type )
            {
                oTable.AutoFilter = new AscCommonExcel.AutoFilter();
                res = this.bcr.Read1(length, function(t,l){
                    return oThis.ReadAutoFilter(t,l, oTable.AutoFilter);
                });
            }
            else if ( c_oSer_TablePart.SortState == type )
            {
                oTable.SortState = new AscCommonExcel.SortState();
                res = this.bcr.Read1(length, function(t,l){
                    return oThis.ReadSortState(t,l, oTable.SortState);
                });
            }
            else if ( c_oSer_TablePart.TableColumns == type )
            {
                oTable.TableColumns = [];
                res = this.bcr.Read1(length, function(t,l){
                    return oThis.ReadTableColumns(t,l, oTable.TableColumns);
                });
            }
            else if ( c_oSer_TablePart.TableStyleInfo == type )
            {
                oTable.TableStyleInfo = new AscCommonExcel.TableStyleInfo();
                res = this.bcr.Read2Spreadsheet(length, function(t,l){
                    return oThis.ReadTableStyleInfo(t,l, oTable.TableStyleInfo);
                });
            }
			else if ( c_oSer_TablePart.AltTextTable == type )
			{
				res = this.bcr.Read1(length, function(t,l){
					return oThis.ReadAltTextTable(t,l, oTable);
				});
			}
            else
                res = c_oSerConstants.ReadUnknown;
            return res;
        };
		this.ReadAltTextTable = function(type, length, oTable)
		{
			var res = c_oSerConstants.ReadOk;
			var oThis = this;
			if (c_oSer_AltTextTable.AltText == type) {
				oTable.altText = this.stream.GetString2LE(length);
			} else if ( c_oSer_AltTextTable.AltTextSummary == type ) {
				oTable.altTextSummary  = this.stream.GetString2LE(length);
			} else
				res = c_oSerConstants.ReadUnknown;
			return res;
		};
        this.ReadAutoFilter = function(type, length, oAutoFilter)
        {
            var res = c_oSerConstants.ReadOk;
            var oThis = this;
            if ( c_oSer_AutoFilter.Ref == type )
			{
				var sRef = this.stream.GetString2LE(length);

				//TODO пересмотреть проверку
				//возможно здесь 3d ref - проверяем
				if(-1 !== sRef.indexOf("!"))
				{
					var is3DRef = AscCommon.parserHelp.parse3DRef(sRef);
					if(is3DRef){
						sRef = is3DRef.range;
					}
				}

				oAutoFilter.Ref = AscCommonExcel.g_oRangeCache.getAscRange(sRef);
			}
            else if ( c_oSer_AutoFilter.FilterColumns == type )
            {
                oAutoFilter.FilterColumns = [];
                res = this.bcr.Read1(length, function(t,l){
                    return oThis.ReadFilterColumns(t,l, oAutoFilter.FilterColumns);
                });
            }
            else if ( c_oSer_AutoFilter.SortState == type )
            {
                oAutoFilter.SortState = new AscCommonExcel.SortState();
                res = this.bcr.Read1(length, function(t,l){
                    return oThis.ReadSortState(t,l, oAutoFilter.SortState);
                });
            }
            else
                res = c_oSerConstants.ReadUnknown;
            return res;
        };
        this.ReadFilterColumns = function(type, length, aFilterColumns)
        {
            var res = c_oSerConstants.ReadOk;
            var oThis = this;
            if ( c_oSer_AutoFilter.FilterColumn == type )
            {
                var oFilterColumn = new AscCommonExcel.FilterColumn();
                res = this.bcr.Read1(length, function(t,l){
                    return oThis.ReadFilterColumn(t,l, oFilterColumn);
                });
                aFilterColumns.push(oFilterColumn);
            }
            else
                res = c_oSerConstants.ReadUnknown;
            return res;
        };
        this.ReadFilterColumn = function(type, length, oFilterColumn)
        {
            var res = c_oSerConstants.ReadOk;
            var oThis = this;
            if ( c_oSer_FilterColumn.ColId == type )
                oFilterColumn.ColId = this.stream.GetULongLE();
            else if ( c_oSer_FilterColumn.Filters == type )
            {
                oFilterColumn.Filters = new AscCommonExcel.Filters();
                res = this.bcr.Read1(length, function(t,l){
                    return oThis.ReadFilters(t,l, oFilterColumn.Filters);
                });
				
				//sort dates
				if(oFilterColumn.Filters && oFilterColumn.Filters.Dates && oFilterColumn.Filters.Dates.length)
				{
					oFilterColumn.Filters.Dates.sort (function sortArr(a, b)
					{
						return a.start - b.start;
					})
				}
            }
            else if ( c_oSer_FilterColumn.CustomFilters == type )
            {
                oFilterColumn.CustomFiltersObj = new Asc.CustomFilters();
                res = this.bcr.Read1(length, function(t,l){
                    return oThis.ReadCustomFilters(t,l, oFilterColumn.CustomFiltersObj);
                });
            }
            else if ( c_oSer_FilterColumn.DynamicFilter == type )
            {
                oFilterColumn.DynamicFilter = new Asc.DynamicFilter();
                res = this.bcr.Read2Spreadsheet(length, function(t,l){
                    return oThis.ReadDynamicFilter(t,l, oFilterColumn.DynamicFilter);
                });
            }else if ( c_oSer_FilterColumn.ColorFilter == type )
            {
                oFilterColumn.ColorFilter = new Asc.ColorFilter();
                res = this.bcr.Read2Spreadsheet(length, function(t,l){
                    return oThis.ReadColorFilter(t,l, oFilterColumn.ColorFilter);
                });
            }
            else if ( c_oSer_FilterColumn.Top10 == type )
            {
                oFilterColumn.Top10 = new Asc.Top10();
                res = this.bcr.Read2Spreadsheet(length, function(t,l){
                    return oThis.ReadTop10(t,l, oFilterColumn.Top10);
                });
            }
            else if ( c_oSer_FilterColumn.HiddenButton == type )
                oFilterColumn.ShowButton = !this.stream.GetBool();
            else if ( c_oSer_FilterColumn.ShowButton == type )
                oFilterColumn.ShowButton = this.stream.GetBool();
            else
                res = c_oSerConstants.ReadUnknown;
            return res;
        };
        this.ReadFilters = function(type, length, oFilters)
        {
            var res = c_oSerConstants.ReadOk;
            var oThis = this;
            if ( c_oSer_FilterColumn.Filter == type )
            {
                var oFilterVal = new AscCommonExcel.Filter();
                res = this.bcr.Read1(length, function(t,l){
                    return oThis.ReadFilter(t,l, oFilterVal);
                });
                if(null != oFilterVal.Val)
					oFilters.Values[oFilterVal.Val] = 1;
            }
            else if ( c_oSer_FilterColumn.DateGroupItem == type )
            {
                var oDateGroupItem = new AscCommonExcel.DateGroupItem();
                res = this.bcr.Read2Spreadsheet(length, function(t,l){
                    return oThis.ReadDateGroupItem(t,l, oDateGroupItem);
                });

				var autoFilterDateElem = new AscCommonExcel.AutoFilterDateElem();
				autoFilterDateElem.convertDateGroupItemToRange(oDateGroupItem);
				oFilters.Dates.push(autoFilterDateElem);
            }
            else if ( c_oSer_FilterColumn.FiltersBlank == type )
                oFilters.Blank = this.stream.GetBool();
            else
                res = c_oSerConstants.ReadUnknown;
            return res;
        };
        this.ReadFilter = function(type, length, oFilter)
        {
            var res = c_oSerConstants.ReadOk;
            if ( c_oSer_Filter.Val == type )
                oFilter.Val = this.stream.GetString2LE(length);
            else
                res = c_oSerConstants.ReadUnknown;
            return res;
        };
        this.ReadDateGroupItem = function(type, length, oDateGroupItem)
        {
            var res = c_oSerConstants.ReadOk;
            if ( c_oSer_DateGroupItem.DateTimeGrouping == type )
                oDateGroupItem.DateTimeGrouping = this.stream.GetUChar();
            else if ( c_oSer_DateGroupItem.Day == type )
                oDateGroupItem.Day = this.stream.GetULongLE();
            else if ( c_oSer_DateGroupItem.Hour == type )
                oDateGroupItem.Hour = this.stream.GetULongLE();
            else if ( c_oSer_DateGroupItem.Minute == type )
                oDateGroupItem.Minute = this.stream.GetULongLE();
            else if ( c_oSer_DateGroupItem.Month == type )
                oDateGroupItem.Month = this.stream.GetULongLE();
            else if ( c_oSer_DateGroupItem.Second == type )
                oDateGroupItem.Second = this.stream.GetULongLE();
            else if ( c_oSer_DateGroupItem.Year == type )
                oDateGroupItem.Year = this.stream.GetULongLE();
            else
                res = c_oSerConstants.ReadUnknown;
            return res;
        };
        this.ReadCustomFilters = function(type, length, oCustomFilters)
        {
            var res = c_oSerConstants.ReadOk;
            var oThis = this;
            if ( c_oSer_CustomFilters.And == type )
                oCustomFilters.And = this.stream.GetBool();
            else if ( c_oSer_CustomFilters.CustomFilters == type )
            {
                oCustomFilters.CustomFilters = [];
                res = this.bcr.Read1(length, function(t,l){
                    return oThis.ReadCustomFiltersItems(t,l, oCustomFilters.CustomFilters);
                });
            }
            else
                res = c_oSerConstants.ReadUnknown;
            return res;
        };
        this.ReadCustomFiltersItems = function(type, length, aCustomFilters)
        {
            var res = c_oSerConstants.ReadOk;
            var oThis = this;
            if ( c_oSer_CustomFilters.CustomFilter == type )
            {
                var oCustomFiltersItem = new Asc.CustomFilter();
                res = this.bcr.Read2Spreadsheet(length, function(t,l){
                    return oThis.ReadCustomFiltersItem(t,l, oCustomFiltersItem);
                });
                aCustomFilters.push(oCustomFiltersItem);
            }
            else
                res = c_oSerConstants.ReadUnknown;
            return res;
        };
        this.ReadCustomFiltersItem = function(type, length, oCustomFiltersItem)
        {
            var res = c_oSerConstants.ReadOk;
            if ( c_oSer_CustomFilters.Operator == type )
                oCustomFiltersItem.Operator = this.stream.GetUChar();
            else if ( c_oSer_CustomFilters.Val == type )
                oCustomFiltersItem.Val = this.stream.GetString2LE(length);
            else
                res = c_oSerConstants.ReadUnknown;
            return res;
        };
        this.ReadDynamicFilter = function(type, length, oDynamicFilter)
        {
            var res = c_oSerConstants.ReadOk;
            if ( c_oSer_DynamicFilter.Type == type )
                oDynamicFilter.Type = this.stream.GetUChar();
            else if ( c_oSer_DynamicFilter.Val == type )
                oDynamicFilter.Val = this.stream.GetDoubleLE();
            else if ( c_oSer_DynamicFilter.MaxVal == type )
                oDynamicFilter.MaxVal = this.stream.GetDoubleLE();
            else
                res = c_oSerConstants.ReadUnknown;
            return res;
        };
        this.ReadColorFilter = function(type, length, oColorFilter)
        {
            var res = c_oSerConstants.ReadOk;
            if ( c_oSer_ColorFilter.CellColor == type )
                oColorFilter.CellColor = this.stream.GetBool();
            else if ( c_oSer_ColorFilter.DxfId == type )
            {
                var DxfId = this.stream.GetULongLE();
                oColorFilter.dxf = this.Dxfs[DxfId];
            }
            else
                res = c_oSerConstants.ReadUnknown;
            return res;
        };
        this.ReadTop10 = function(type, length, oTop10)
        {
            var res = c_oSerConstants.ReadOk;
            if ( c_oSer_Top10.FilterVal == type )
                oTop10.FilterVal = this.stream.GetDoubleLE();
            else if ( c_oSer_Top10.Percent == type )
                oTop10.Percent = this.stream.GetBool();
            else if ( c_oSer_Top10.Top == type )
                oTop10.Top = this.stream.GetBool();
            else if ( c_oSer_Top10.Val == type )
                oTop10.Val = this.stream.GetDoubleLE();
            else
                res = c_oSerConstants.ReadUnknown;
            return res;
        };
        this.ReadSortConditionContent = function(type, length, oSortCondition)
        {
            var res = c_oSerConstants.ReadOk;
            if ( c_oSer_SortState.ConditionRef == type )
                oSortCondition.Ref = AscCommonExcel.g_oRangeCache.getAscRange(this.stream.GetString2LE(length));
            else if ( c_oSer_SortState.ConditionSortBy == type )
                oSortCondition.ConditionSortBy = this.stream.GetUChar();
            else if ( c_oSer_SortState.ConditionDescending == type )
                oSortCondition.ConditionDescending = this.stream.GetBool();
            else if ( c_oSer_SortState.ConditionDxfId == type )
            {
                var DxfId = this.stream.GetULongLE();
                oSortCondition.dxf = this.Dxfs[DxfId];
            }
            else
                res = c_oSerConstants.ReadUnknown;
            return res;
        };
        this.ReadSortCondition = function(type, length, aSortConditions)
        {
            var res = c_oSerConstants.ReadOk;
            var oThis = this;
            if ( c_oSer_SortState.SortCondition == type )
            {
                var oSortCondition = new AscCommonExcel.SortCondition();
                res = this.bcr.Read2Spreadsheet(length, function(t,l){
                    return oThis.ReadSortConditionContent(t,l, oSortCondition);
                });
                aSortConditions.push(oSortCondition);
            }
            else
                res = c_oSerConstants.ReadUnknown;
            return res;
        };
        this.ReadSortState = function(type, length, oSortState)
        {
            var res = c_oSerConstants.ReadOk;
            var oThis = this;
            if ( c_oSer_SortState.Ref == type )
                oSortState.Ref = AscCommonExcel.g_oRangeCache.getAscRange(this.stream.GetString2LE(length));
            else if ( c_oSer_SortState.CaseSensitive == type )
                oSortState.CaseSensitive = this.stream.GetBool();
            else if ( c_oSer_SortState.SortConditions == type )
            {
                oSortState.SortConditions = [];
                res = this.bcr.Read1(length, function(t,l){
                    return oThis.ReadSortCondition(t,l, oSortState.SortConditions);
                });
            }
            else
                res = c_oSerConstants.ReadUnknown;
            return res;
        };
        this.ReadTableColumn = function(type, length, oTableColumn)
        {
            var res = c_oSerConstants.ReadOk;
            if ( c_oSer_TableColumns.Name == type )
                oTableColumn.Name = this.stream.GetString2LE(length);
            else if ( c_oSer_TableColumns.TotalsRowLabel == type )
                oTableColumn.TotalsRowLabel = this.stream.GetString2LE(length);
            else if ( c_oSer_TableColumns.TotalsRowFunction == type )
                oTableColumn.TotalsRowFunction = this.stream.GetUChar();
            else if ( c_oSer_TableColumns.TotalsRowFormula == type ) {
                var formula = this.stream.GetString2LE(length);
                this.oReadResult.tableCustomFunc.push({formula: formula, column: oTableColumn, ws: this.ws});
            }  else if ( c_oSer_TableColumns.DataDxfId == type ) {
                var DxfId = this.stream.GetULongLE();
                oTableColumn.dxf = this.Dxfs[DxfId];
            }
            /*else if ( c_oSer_TableColumns.CalculatedColumnFormula == type )
			{
				oTableColumn.CalculatedColumnFormula = this.stream.GetString2LE(length);
			}*/
            else
                res = c_oSerConstants.ReadUnknown;
            return res;
        };
        this.ReadTableColumns = function(type, length, aTableColumns)
        {
            var res = c_oSerConstants.ReadOk;
            var oThis = this;
            if ( c_oSer_TableColumns.TableColumn == type )
            {
                var oTableColumn = new AscCommonExcel.TableColumn();
                res = this.bcr.Read1(length, function(t,l){
                    return oThis.ReadTableColumn(t,l, oTableColumn);
                });
                aTableColumns.push(oTableColumn);
            }
            else
                res = c_oSerConstants.ReadUnknown;
            return res;
        };
        this.ReadTableStyleInfo = function(type, length, oTableStyleInfo)
        {
            var res = c_oSerConstants.ReadOk;
            if ( c_oSer_TableStyleInfo.Name == type )
                oTableStyleInfo.Name = this.stream.GetString2LE(length);
            else if ( c_oSer_TableStyleInfo.ShowColumnStripes == type )
                oTableStyleInfo.ShowColumnStripes = this.stream.GetBool();
            else if ( c_oSer_TableStyleInfo.ShowRowStripes == type )
                oTableStyleInfo.ShowRowStripes = this.stream.GetBool();
            else if ( c_oSer_TableStyleInfo.ShowFirstColumn == type )
                oTableStyleInfo.ShowFirstColumn = this.stream.GetBool();
            else if ( c_oSer_TableStyleInfo.ShowLastColumn == type )
                oTableStyleInfo.ShowLastColumn = this.stream.GetBool();
            else
                res = c_oSerConstants.ReadUnknown;
            return res;
        };
    }
    /** @constructor */
    function Binary_SharedStringTableReader(stream, wb, aSharedStrings)
    {
        this.stream = stream;
        this.wb = wb;
        this.aSharedStrings = aSharedStrings;
        this.bcr = new Binary_CommonReader(this.stream);
        this.Read = function()
        {
            var oThis = this;
			var tempValue = {text: null, multiText: null};
            return this.bcr.ReadTable(function(t, l){
                return oThis.ReadSharedStringContent(t,l, tempValue);
            });
        };
        this.ReadSharedStringContent = function(type, length, tempValue)
        {
            var res = c_oSerConstants.ReadOk;
            if ( c_oSerSharedStringTypes.Si === type )
            {
                var oThis = this;
				tempValue.text = null;
				tempValue.multiText = null;
                res = this.bcr.Read1(length, function(t,l){
                    return oThis.ReadSharedString(t,l, tempValue);
                });
                if(null != this.aSharedStrings) {
					if (null != tempValue.text) {
						this.aSharedStrings.push(tempValue.text);
					} else if (null != tempValue.multiText) {
						this.aSharedStrings.push(tempValue.multiText);
					}
				}
            }
            else
                res = c_oSerConstants.ReadUnknown;
            return res;
        };
        this.ReadSharedString = function(type, length, tempValue)
        {
            var res = c_oSerConstants.ReadOk;
            if ( c_oSerSharedStringTypes.Run == type )
            {
                var oThis = this;
                var oRun = new AscCommonExcel.CMultiTextElem();
                res = this.bcr.Read1(length, function(t,l){
                    return oThis.ReadRun(t,l,oRun);
                });
                if(null == tempValue.multiText)
                    tempValue.multiText = [];
                tempValue.multiText.push(oRun);
            }
            else if ( c_oSerSharedStringTypes.Text == type )
            {
                if(null == tempValue.text)
                    tempValue.text = "";
                tempValue.text += this.stream.GetString2LE(length);
            }
            else
                res = c_oSerConstants.ReadUnknown;
            return res;
        };
        this.ReadRun = function(type, length, oRun)
        {
            var oThis = this;
            var res = c_oSerConstants.ReadOk;
            if ( c_oSerSharedStringTypes.RPr == type )
            {
                if(null == oRun.format)
                    oRun.format = new AscCommonExcel.Font();
                res = this.bcr.Read2Spreadsheet(length, function(t,l){
                    return oThis.ReadRPr(t,l, oRun.format);
                });
                this.CheckSchemeFont(oRun.format);
            }
            else if ( c_oSerSharedStringTypes.Text == type )
            {
                if(null == oRun.text)
                    oRun.text = "";
                oRun.text += this.stream.GetString2LE(length);
            }
            else
                res = c_oSerConstants.ReadUnknown;
            return res;
        };
        this.CheckSchemeFont = function(font)
        {
            if(null != font.scheme)
            {
                var theme = this.wb.theme;
                if(null != theme)
                {
                    var fontScheme = theme.themeElements.fontScheme;
                    var sFontName = null;
                    switch(font.scheme)
                    {
                        case EFontScheme.fontschemeMinor: sFontName = fontScheme.minorFont.latin;break;
                        case EFontScheme.fontschemeMajor: sFontName = fontScheme.majorFont.latin;break;
                    }
                    if(null != sFontName && "" != sFontName)
                        font.fn = sFontName;
                }
            }
        };
        this.ReadRPr = function(type, length, rPr)
        {
            var res = c_oSerConstants.ReadOk;
            var oThis = this;
            if ( c_oSerFontTypes.Bold == type )
                rPr.b = this.stream.GetBool();
            else if ( c_oSerFontTypes.Color == type ){
				var color = ReadColorSpreadsheet2(this.bcr, length);
				if (color) {
					rPr.c = color;
				}
			} else if ( c_oSerFontTypes.Italic == type )
                rPr.i = this.stream.GetBool();
            else if ( c_oSerFontTypes.RFont == type )
                rPr.fn = this.stream.GetString2LE(length);
            else if ( c_oSerFontTypes.Strike == type )
                rPr.s = this.stream.GetBool();
            else if ( c_oSerFontTypes.Sz == type )
                rPr.fs = this.stream.GetDoubleLE();
            else if ( c_oSerFontTypes.Underline == type )
                rPr.u = this.stream.GetUChar();
            else if ( c_oSerFontTypes.VertAlign == type )
            {
                rPr.va = this.stream.GetUChar();
                //server constants SubScript:1, SuperScript: 2
                if (rPr.va === AscCommon.vertalign_SubScript) {
                    rPr.va = AscCommon.vertalign_SuperScript;
                } else if (rPr.va === AscCommon.vertalign_SuperScript) {
                    rPr.va = AscCommon.vertalign_SubScript;
                }
            }
            else if ( c_oSerFontTypes.Scheme == type )
                rPr.scheme = this.stream.GetUChar();
            else
                res = c_oSerConstants.ReadUnknown;
            return res;
        };
    }
    /** @constructor */
    function Binary_StylesTableReader(stream, wb, aCellXfs, Dxfs, isCopyPaste, useNumId)
    {
        this.stream = stream;
        this.wb = wb;
        this.oStyleManager = wb.oStyleManager;
        this.aCellXfs = aCellXfs;
        this.Dxfs = Dxfs;
        this.bcr = new Binary_CommonReader(this.stream);
        this.bssr = new Binary_SharedStringTableReader(this.stream, wb);
		this.isCopyPaste = isCopyPaste;
		this.useNumId = useNumId;
        this.Read = function()
        {
            var oThis = this;
            var oStyleObject = {aBorders: [], aFills: [], aFonts: [], oNumFmts: {}, aCellStyleXfs: [],
                aCellXfs: [], aCellStyles: [], oCustomTableStyles: {}};
            var res = this.bcr.ReadTable(function (t, l) {
                return oThis.ReadStylesContent(t, l, oStyleObject);
            });
            this.InitStyleManager(oStyleObject);
            return res;
        };
        this.InitStyleManager = function (oStyleObject)
        {
			for (var i = 0; i < oStyleObject.aFonts.length; ++i) {
				oStyleObject.aFonts[i] = g_StyleCache.addFont(oStyleObject.aFonts[i]);
			}
			for (var i = 0; i < oStyleObject.aFills.length; ++i) {
				oStyleObject.aFills[i] = g_StyleCache.addFill(oStyleObject.aFills[i]);
			}
			for (var i = 0; i < oStyleObject.aBorders.length; ++i) {
				oStyleObject.aBorders[i] = g_StyleCache.addBorder(oStyleObject.aBorders[i]);
			}
			for (var XfIdTmp in oStyleObject.aCellStyleXfs) {
				var xf = oStyleObject.aCellStyleXfs[XfIdTmp];
				if (xf.align) {
					xf.align = g_StyleCache.addAlign(xf.align);
				}
			}
			for (var i = 0; i < oStyleObject.aCellXfs.length; ++i) {
				var xf = oStyleObject.aCellXfs[i];
				if (xf.align) {
					xf.align = g_StyleCache.addAlign(xf.align);
				}
			}
			for (var i = 0; i < this.Dxfs.length; ++i) {
				this.Dxfs[i] = g_StyleCache.addXf(this.Dxfs[i], true);
			}

            // ToDo убрать - это заглушка
            var arrStyleMap = {};
            // Начнем с 1, т.к. 2 зарегистрировано для normal
            var nIndexStyleMap = 1;
            var XfIdTmp;
            // Список имен для стилей
            var oCellStyleNames = {};

            for (var nIndex in oStyleObject.aCellStyles) {
                if (!oStyleObject.aCellStyles.hasOwnProperty(nIndex))
                    continue;

                var oCellStyle = oStyleObject.aCellStyles[nIndex];
                var oCellStyleXfs = oStyleObject.aCellStyleXfs[oCellStyle.XfId];
                // Если есть стиль, но нет описания, то уберем этот стиль (Excel делает также)
                if (null == oCellStyleXfs)
                    continue;

                var newXf = new AscCommonExcel.CellXfs();
                // XfId
                XfIdTmp = oCellStyle.XfId;
                if (null !== XfIdTmp) {
                    if (0 !== XfIdTmp) {
                        arrStyleMap[XfIdTmp] = nIndexStyleMap;
                        oCellStyle.XfId = nIndexStyleMap++;
                    }
                } else
                    continue;	// Если его нет, то это ошибка по спецификации

                // Border
                if (null != oCellStyleXfs.borderid) {
                    var borderCellStyle = oStyleObject.aBorders[oCellStyleXfs.borderid];
                    if(null != borderCellStyle)
						newXf.border = borderCellStyle;
                }
                // Fill
                if (null != oCellStyleXfs.fillid) {
                    var fillCellStyle = oStyleObject.aFills[oCellStyleXfs.fillid];
                    if(null != fillCellStyle)
						newXf.fill = fillCellStyle;
                }
                // Font
                if(null != oCellStyleXfs.fontid) {
                    var fontCellStyle = oStyleObject.aFonts[oCellStyleXfs.fontid];
                    if(null != fontCellStyle)
						newXf.font = fontCellStyle;
                }
                // NumFmt
                if(null != oCellStyleXfs.numid) {
                    var oCurNumCellStyle = oStyleObject.oNumFmts[oCellStyleXfs.numid];
                    if(null != oCurNumCellStyle)
						newXf.num = g_StyleCache.addNum(oCurNumCellStyle);
                    else
						newXf.num = g_StyleCache.addNum(this.ParseNum({id: oCellStyleXfs.numid, f: null}, oStyleObject.oNumFmts));
                }
                // QuotePrefix
                if(null != oCellStyleXfs.QuotePrefix)
					newXf.QuotePrefix = oCellStyleXfs.QuotePrefix;
				//PivotButton
				if(null != oCellStyleXfs.PivotButton)
					newXf.PivotButton = oCellStyleXfs.PivotButton;
                // align
                if(null != oCellStyleXfs.align)
					newXf.align = oCellStyleXfs.align;
                // ApplyBorder (ToDo возможно это свойство должно быть в xfs)
                if (null !== oCellStyleXfs.ApplyBorder)
                    oCellStyle.ApplyBorder = oCellStyleXfs.ApplyBorder;
                // ApplyFill (ToDo возможно это свойство должно быть в xfs)
                if (null !== oCellStyleXfs.ApplyFill)
                    oCellStyle.ApplyFill = oCellStyleXfs.ApplyFill;
                // ApplyFont (ToDo возможно это свойство должно быть в xfs)
                if (null !== oCellStyleXfs.ApplyFont)
                    oCellStyle.ApplyFont = oCellStyleXfs.ApplyFont;
                // ApplyNumberFormat (ToDo возможно это свойство должно быть в xfs)
                if (null !== oCellStyleXfs.ApplyNumberFormat)
                    oCellStyle.ApplyNumberFormat = oCellStyleXfs.ApplyNumberFormat;

				oCellStyle.xfs = g_StyleCache.addXf(newXf);
                // ToDo при отсутствии имени все не очень хорошо будет!
                this.wb.CellStyles.CustomStyles.push(oCellStyle);
                if (null !== oCellStyle.Name)
                    oCellStyleNames[oCellStyle.Name] = true;
            }

            // ToDo стоит это переделать в дальнейшем (пробежимся по именам, и у отсутствующих создадим имя)
            var nNewStyleIndex = 1, newStyleName;
            for (var i = 0, length = this.wb.CellStyles.CustomStyles.length; i < length; ++i) {
                if (null === this.wb.CellStyles.CustomStyles[i].Name) {
                    do {
                        newStyleName = "Style" + nNewStyleIndex++;
                    } while (oCellStyleNames[newStyleName])
                        ;
                    this.wb.CellStyles.CustomStyles[i].Name = newStyleName;
                }
            }

            // ToDo это нужно будет переделать (проходимся по всем стилям и меняем у них XfId по порядку)

            for(var i = 0, length = oStyleObject.aCellXfs.length; i < length; ++i) {
                var xfs = oStyleObject.aCellXfs[i];
                var newXf = new AscCommonExcel.CellXfs();

                if(null != xfs.borderid)
                {
                    var border = oStyleObject.aBorders[xfs.borderid];
                    if(null != border)
						newXf.border = border;
                }
                if(null != xfs.fillid)
                {
                    var fill = oStyleObject.aFills[xfs.fillid];
                    if(null != fill)
						newXf.fill = fill;
                }
                if(null != xfs.fontid)
                {
                    var font = oStyleObject.aFonts[xfs.fontid];
                    if(null != font)
						newXf.font = font;
                }
                if(null != xfs.numid)
                {
                    var oCurNum = oStyleObject.oNumFmts[xfs.numid];
                    //todo
                    if(null != oCurNum)
						newXf.num = g_StyleCache.addNum(oCurNum);
                    else
						newXf.num = g_StyleCache.addNum(this.ParseNum({id: xfs.numid, f: null}, oStyleObject.oNumFmts));
                }
                if(null != xfs.QuotePrefix)
					newXf.QuotePrefix = xfs.QuotePrefix;
				if(null != xfs.PivotButton)
					newXf.PivotButton = xfs.PivotButton;
                if(null != xfs.align)
					newXf.align = xfs.align;
                if (null !== xfs.XfId) {
                    XfIdTmp = arrStyleMap[xfs.XfId];
                    if (null == XfIdTmp)
                        XfIdTmp = 0;
					newXf.XfId = XfIdTmp;
                }

                if(0 == this.aCellXfs.length && !this.isCopyPaste)
                    this.oStyleManager.init(newXf, this.wb);
                this.aCellXfs.push(g_StyleCache.addXf(newXf));
            }
            for(var i in oStyleObject.oCustomTableStyles)
            {
                var item = oStyleObject.oCustomTableStyles[i];
                if(null != item)
                {
                    var style = item.style;
                    var elems = item.elements;
                    this.initTableStyle(style, elems, this.Dxfs);
                    this.wb.TableStyles.CustomStyles[i] = style;
                }
            }
        };
        this.initTableStyle = function(style, elems, Dxfs)
        {
            for(var j = 0, length2 = elems.length; j < length2; ++j)
            {
                var elem = elems[j];
                if(null != elem.DxfId)
                {
                    var Dxf = Dxfs[elem.DxfId];
                    if(null != Dxf)
                    {
                        var oTableStyleElement = new CTableStyleElement();
                        oTableStyleElement.dxf = Dxf;
                        if(null != elem.Size)
                            oTableStyleElement.size = elem.Size;
                        switch(elem.Type)
                        {
                            case ETableStyleType.tablestyletypeBlankRow: style.blankRow = oTableStyleElement;break;
                            case ETableStyleType.tablestyletypeFirstColumn: style.firstColumn = oTableStyleElement;break;
                            case ETableStyleType.tablestyletypeFirstColumnStripe: style.firstColumnStripe = oTableStyleElement;break;
                            case ETableStyleType.tablestyletypeFirstColumnSubheading: style.firstColumnSubheading = oTableStyleElement;break;
                            case ETableStyleType.tablestyletypeFirstHeaderCell: style.firstHeaderCell = oTableStyleElement;break;
                            case ETableStyleType.tablestyletypeFirstRowStripe: style.firstRowStripe = oTableStyleElement;break;
                            case ETableStyleType.tablestyletypeFirstRowSubheading: style.firstRowSubheading = oTableStyleElement;break;
                            case ETableStyleType.tablestyletypeFirstSubtotalColumn: style.firstSubtotalColumn = oTableStyleElement;break;
                            case ETableStyleType.tablestyletypeFirstSubtotalRow: style.firstSubtotalRow = oTableStyleElement;break;
                            case ETableStyleType.tablestyletypeFirstTotalCell: style.firstTotalCell = oTableStyleElement;break;
                            case ETableStyleType.tablestyletypeHeaderRow: style.headerRow = oTableStyleElement;break;
                            case ETableStyleType.tablestyletypeLastColumn: style.lastColumn = oTableStyleElement;break;
                            case ETableStyleType.tablestyletypeLastHeaderCell: style.lastHeaderCell = oTableStyleElement;break;
                            case ETableStyleType.tablestyletypeLastTotalCell: style.lastTotalCell = oTableStyleElement;break;
                            case ETableStyleType.tablestyletypePageFieldLabels: style.pageFieldLabels = oTableStyleElement;break;
                            case ETableStyleType.tablestyletypePageFieldValues: style.pageFieldValues = oTableStyleElement;break;
                            case ETableStyleType.tablestyletypeSecondColumnStripe: style.secondColumnStripe = oTableStyleElement;break;
                            case ETableStyleType.tablestyletypeSecondColumnSubheading: style.secondColumnSubheading = oTableStyleElement;break;
                            case ETableStyleType.tablestyletypeSecondRowStripe: style.secondRowStripe = oTableStyleElement;break;
                            case ETableStyleType.tablestyletypeSecondRowSubheading: style.secondRowSubheading = oTableStyleElement;break;
                            case ETableStyleType.tablestyletypeSecondSubtotalColumn: style.secondSubtotalColumn = oTableStyleElement;break;
                            case ETableStyleType.tablestyletypeSecondSubtotalRow: style.secondSubtotalRow = oTableStyleElement;break;
                            case ETableStyleType.tablestyletypeThirdColumnSubheading: style.thirdColumnSubheading = oTableStyleElement;break;
                            case ETableStyleType.tablestyletypeThirdRowSubheading: style.thirdRowSubheading = oTableStyleElement;break;
                            case ETableStyleType.tablestyletypeThirdSubtotalColumn: style.thirdSubtotalColumn = oTableStyleElement;break;
                            case ETableStyleType.tablestyletypeThirdSubtotalRow: style.thirdSubtotalRow = oTableStyleElement;break;
                            case ETableStyleType.tablestyletypeTotalRow: style.totalRow = oTableStyleElement;break;
                            case ETableStyleType.tablestyletypeWholeTable: style.wholeTable = oTableStyleElement;break;
                        }
                    }
                }
            }
        };
		this.ParseNum = function(oNum, oNumFmts) {
			var oRes = new AscCommonExcel.Num();
			var useNumId = false;
			if (null != oNum && null != oNum.f) {
				oRes.f = oNum.f;
			} else {
				var sStandartNumFormat = AscCommonExcel.aStandartNumFormats[oNum.id];
				if (null != sStandartNumFormat) {
					oRes.f = sStandartNumFormat;
				}
				if (null == oRes.f) {
					oRes.f = "General";
				}
				//format string is more priority then id. so, fill oRes.id only if format is empty
				useNumId = true;
			}
			if ((useNumId || this.useNumId) &&
				((5 <= oNum.id && oNum.id <= 8) || (14 <= oNum.id && oNum.id <= 17) || 22 == oNum.id ||
				(27 <= oNum.id && oNum.id <= 31) || (36 <= oNum.id && oNum.id <= 44))) {
				oRes.id = oNum.id;
			}
			if (null != oNumFmts) {
				oNumFmts[oNum.id] = oRes;
			}
			return oRes;
		};
        this.ReadStylesContent = function (type, length, oStyleObject) {
            var res = c_oSerConstants.ReadOk;
            var oThis = this;
            if (c_oSerStylesTypes.Borders === type) {
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadBorders(t, l, oStyleObject.aBorders);
                });
                oStyleObject.aBorders[0] = new AscCommonExcel.Border();
            } else if (c_oSerStylesTypes.Fills === type) {
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadFills(t, l, oStyleObject.aFills);
                });
                oStyleObject.aFills[0] = new AscCommonExcel.Fill();
                oStyleObject.aFills[1] = new AscCommonExcel.Fill();
            } else if (c_oSerStylesTypes.Fonts === type) {
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadFonts(t, l, oStyleObject.aFonts);
                });
            } else if (c_oSerStylesTypes.NumFmts === type) {
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadNumFmts(t, l, oStyleObject.oNumFmts);
                });
            } else if (c_oSerStylesTypes.CellStyleXfs === type) {
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadCellStyleXfs(t, l, oStyleObject.aCellStyleXfs);
                });
            } else if (c_oSerStylesTypes.CellXfs === type) {
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadCellXfs(t,l, oStyleObject.aCellXfs);
                });
            } else if (c_oSerStylesTypes.CellStyles === type) {
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadCellStyles(t, l, oStyleObject.aCellStyles);
                });
            } else if (c_oSerStylesTypes.Dxfs === type) {
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadDxfs(t, l, oThis.Dxfs);
                });
            } else if (c_oSerStylesTypes.TableStyles === type) {
                res = this.bcr.Read1(length, function (t, l){
                    return oThis.ReadTableStyles(t, l, oThis.wb.TableStyles, oStyleObject.oCustomTableStyles);
                });
            } else
                res = c_oSerConstants.ReadUnknown;
            return res;
        };
        this.ReadBorders = function(type, length, aBorders)
        {
            var res = c_oSerConstants.ReadOk;
            var oThis = this;
            if ( c_oSerStylesTypes.Border == type )
            {
                var oNewBorder = new AscCommonExcel.Border();
                res = this.bcr.Read1(length, function(t,l){
                    return oThis.ReadBorder(t,l,oNewBorder);
                });
                aBorders.push(oNewBorder);
            }
            else
                res = c_oSerConstants.ReadUnknown;
            return res;
        };
        this.ReadBorder = function(type, length, oNewBorder)
        {
            var res = c_oSerConstants.ReadOk;
            var oThis = this;
            if ( c_oSerBorderTypes.Bottom == type )
            {
                res = this.bcr.Read2Spreadsheet(length, function(t,l){
                    return oThis.ReadBorderProp(t,l,oNewBorder.b);
                });
            }
            else if ( c_oSerBorderTypes.Diagonal == type )
            {
                res = this.bcr.Read2Spreadsheet(length, function(t,l){
                    return oThis.ReadBorderProp(t,l,oNewBorder.d);
                });
            }
            else if ( c_oSerBorderTypes.End == type )
            {
                res = this.bcr.Read2Spreadsheet(length, function(t,l){
                    return oThis.ReadBorderProp(t,l,oNewBorder.r);
                });
            }
            else if ( c_oSerBorderTypes.Horizontal == type )
            {
                res = this.bcr.Read2Spreadsheet(length, function(t,l){
                    return oThis.ReadBorderProp(t,l,oNewBorder.ih);
                });
            }
            else if ( c_oSerBorderTypes.Start == type )
            {
                res = this.bcr.Read2Spreadsheet(length, function(t,l){
                    return oThis.ReadBorderProp(t,l,oNewBorder.l);
                });
            }
            else if ( c_oSerBorderTypes.Top == type )
            {
                res = this.bcr.Read2Spreadsheet(length, function(t,l){
                    return oThis.ReadBorderProp(t,l,oNewBorder.t);
                });
            }
            else if ( c_oSerBorderTypes.Vertical == type )
            {
                res = this.bcr.Read2Spreadsheet(length, function(t,l){
                    return oThis.ReadBorderProp(t,l,oNewBorder.iv);
                });
            }
            else if ( c_oSerBorderTypes.DiagonalDown == type )
            {
                oNewBorder.dd = this.stream.GetBool();
            }
            else if ( c_oSerBorderTypes.DiagonalUp == type )
            {
                oNewBorder.du = this.stream.GetBool();
            }
            // else if ( c_oSerBorderTypes.Outline == type )
            // {
            // oNewBorder.outline = this.stream.GetBool();
            // }
            else
                res = c_oSerConstants.ReadUnknown;
            return res;
        };
        this.ReadBorderProp = function(type, length, oBorderProp)
        {
            var res = c_oSerConstants.ReadOk;
            var oThis = this;
            if ( c_oSerBorderPropTypes.Style == type )
            {
                switch(this.stream.GetUChar())
                {
                    case EBorderStyle.borderstyleDashDot:			oBorderProp.setStyle(c_oAscBorderStyles.DashDot);break;
                    case EBorderStyle.borderstyleDashDotDot:		oBorderProp.setStyle(c_oAscBorderStyles.DashDotDot);break;
                    case EBorderStyle.borderstyleDashed:			oBorderProp.setStyle(c_oAscBorderStyles.Dashed);break;
                    case EBorderStyle.borderstyleDotted:			oBorderProp.setStyle(c_oAscBorderStyles.Dotted);break;
                    case EBorderStyle.borderstyleDouble:			oBorderProp.setStyle(c_oAscBorderStyles.Double);break;
                    case EBorderStyle.borderstyleHair:				oBorderProp.setStyle(c_oAscBorderStyles.Hair);break;
                    case EBorderStyle.borderstyleMedium:			oBorderProp.setStyle(c_oAscBorderStyles.Medium);break;
                    case EBorderStyle.borderstyleMediumDashDot:		oBorderProp.setStyle(c_oAscBorderStyles.MediumDashDot);break;
                    case EBorderStyle.borderstyleMediumDashDotDot:	oBorderProp.setStyle(c_oAscBorderStyles.MediumDashDotDot);break;
                    case EBorderStyle.borderstyleMediumDashed:		oBorderProp.setStyle(c_oAscBorderStyles.MediumDashed);break;
                    case EBorderStyle.borderstyleNone:				oBorderProp.setStyle(c_oAscBorderStyles.None);break;
                    case EBorderStyle.borderstyleSlantDashDot:		oBorderProp.setStyle(c_oAscBorderStyles.SlantDashDot);break;
                    case EBorderStyle.borderstyleThick:				oBorderProp.setStyle(c_oAscBorderStyles.Thick);break;
                    case EBorderStyle.borderstyleThin:				oBorderProp.setStyle(c_oAscBorderStyles.Thin);break;
                    default :										oBorderProp.setStyle(c_oAscBorderStyles.None);break;
                }
            }
            else if ( c_oSerBorderPropTypes.Color == type ) {
				var color = ReadColorSpreadsheet2(this.bcr, length);
				if (null != color) {
					oBorderProp.c = color;
				}
            }
            else
                res = c_oSerConstants.ReadUnknown;
            return res;
        };
        this.ReadCellStyleXfs = function (type, length, aCellStyleXfs) {
            var res = c_oSerConstants.ReadOk;
            var oThis = this;
            if (c_oSerStylesTypes.Xfs === type) {
                var oNewXfs = {ApplyAlignment: null, ApplyBorder: null, ApplyFill: null, ApplyFont: null, ApplyNumberFormat: null,
                    BorderId: null, FillId: null, FontId: null, NumFmtId: null, QuotePrefix: null, Aligment: null, PivotButton: null};
                res = this.bcr.Read2Spreadsheet(length, function (t, l) {
                    return oThis.ReadXfs(t, l, oNewXfs);
                });
                aCellStyleXfs.push(oNewXfs);
            } else
                res = c_oSerConstants.ReadUnknown;
            return res;
        };
        this.ReadCellXfs = function(type, length, aCellXfs)
        {
            var res = c_oSerConstants.ReadOk;
            var oThis = this;
            if ( c_oSerStylesTypes.Xfs == type )
            {
                var oNewXfs = {ApplyAlignment: null, ApplyBorder: null, ApplyFill: null, ApplyFont: null, ApplyNumberFormat: null,
                    BorderId: null, FillId: null, FontId: null, NumFmtId: null, QuotePrefix: null, Aligment: null, XfId: null, PivotButton: null};
                res = this.bcr.Read2Spreadsheet(length, function(t,l){
                    return oThis.ReadXfs(t,l,oNewXfs);
                });
                aCellXfs.push(oNewXfs);
            }
            else
                res = c_oSerConstants.ReadUnknown;
            return res;
        };
        this.ReadXfs = function(type, length, oXfs)
        {
            var res = c_oSerConstants.ReadOk;
            var oThis = this;
            if ( c_oSerXfsTypes.ApplyAlignment == type )
                oXfs.ApplyAlignment = this.stream.GetBool();
            else if ( c_oSerXfsTypes.ApplyBorder == type )
                oXfs.ApplyBorder = this.stream.GetBool();
            else if ( c_oSerXfsTypes.ApplyFill == type )
                oXfs.ApplyFill = this.stream.GetBool();
            else if ( c_oSerXfsTypes.ApplyFont == type )
                oXfs.ApplyFont = this.stream.GetBool();
            else if ( c_oSerXfsTypes.ApplyNumberFormat == type )
                oXfs.ApplyNumberFormat = this.stream.GetBool();
            else if ( c_oSerXfsTypes.BorderId == type )
                oXfs.borderid = this.stream.GetULongLE();
            else if ( c_oSerXfsTypes.FillId == type )
                oXfs.fillid = this.stream.GetULongLE();
            else if ( c_oSerXfsTypes.FontId == type )
                oXfs.fontid = this.stream.GetULongLE();
            else if ( c_oSerXfsTypes.NumFmtId == type )
                oXfs.numid = this.stream.GetULongLE();
            else if ( c_oSerXfsTypes.QuotePrefix == type )
                oXfs.QuotePrefix = this.stream.GetBool();
			else if ( c_oSerXfsTypes.PivotButton == type )
				oXfs.PivotButton = this.stream.GetBool();
            else if (c_oSerXfsTypes.XfId === type)
                oXfs.XfId = this.stream.GetULongLE();
            else if ( c_oSerXfsTypes.Aligment == type )
            {
                if(null == oXfs.Aligment)
                    oXfs.align = new AscCommonExcel.Align();
                res = this.bcr.Read2Spreadsheet(length, function(t,l){
                    return oThis.ReadAligment(t,l,oXfs.align);
                });
            }
            else
                res = c_oSerConstants.ReadUnknown;
            return res;
        };
        this.ReadAligment = function(type, length, oAligment)
        {
            var res = c_oSerConstants.ReadOk;
            if ( c_oSerAligmentTypes.Horizontal == type )
            {
                switch(this.stream.GetUChar())
                {
                    case 0 :
                    case 1 : oAligment.hor = AscCommon.align_Center;break;
                    case 2 :
                    case 3 :
                    case 5 : oAligment.hor = AscCommon.align_Justify;break;
                    case 4 : oAligment.hor = null;break;
                    case 6 : oAligment.hor = AscCommon.align_Left;break;
                    case 7 : oAligment.hor = AscCommon.align_Right;break;
                }
            }
            else if ( c_oSerAligmentTypes.Indent == type )
                oAligment.indent = this.stream.GetULongLE();
            else if ( c_oSerAligmentTypes.RelativeIndent == type )
                oAligment.RelativeIndent = this.stream.GetULongLE();
            else if ( c_oSerAligmentTypes.ShrinkToFit == type )
                oAligment.shrink = this.stream.GetBool();
            else if ( c_oSerAligmentTypes.TextRotation == type )
                oAligment.angle = this.stream.GetULongLE();
            else if ( c_oSerAligmentTypes.Vertical == type )
            {
                oAligment.ver = this.stream.GetUChar();
                if (Asc.c_oAscVAlign.Dist == oAligment.ver ||
                    Asc.c_oAscVAlign.Just == oAligment.ver) {
                    oAligment.ver = Asc.c_oAscVAlign.Center;
                }
            }
            else if ( c_oSerAligmentTypes.WrapText == type )
                oAligment.wrap= this.stream.GetBool();
            else
                res = c_oSerConstants.ReadUnknown;
            return res;
        };
        this.ReadFills = function(type, length, aFills)
        {
            var res = c_oSerConstants.ReadOk;
            var oThis = this;
            if ( c_oSerStylesTypes.Fill == type )
            {
                var oNewFill = new AscCommonExcel.Fill();
                res = this.bcr.Read1(length, function(t,l){
                    return oThis.ReadFill(t,l,oNewFill);
                });
                aFills.push(oNewFill);
            }
            else
                res = c_oSerConstants.ReadUnknown;
            return res;
        };
        this.ReadFill = function(type, length, oFill)
        {
            var res = c_oSerConstants.ReadOk;
            var oThis = this;
            if ( c_oSerFillTypes.PatternFill == type )
            {
                res = this.bcr.Read1(length, function(t,l){
                    return oThis.ReadPatternFill(t,l,oFill);
                });
            }
            else
                res = c_oSerConstants.ReadUnknown;
            return res;
        };
        this.ReadPatternFill = function(type, length, oFill)
        {
            var res = c_oSerConstants.ReadOk;
            var oThis = this;
            if ( c_oSerFillTypes.PatternFillBgColor == type ) {
				var color = ReadColorSpreadsheet2(this.bcr, length);
				if (null != color) {
					oFill.bg = color;
				}
            }
            else
                res = c_oSerConstants.ReadUnknown;
            return res;
        };
        this.ReadFonts = function(type, length, aFonts)
        {
            var res = c_oSerConstants.ReadOk;
            var oThis = this;
            if ( c_oSerStylesTypes.Font == type )
            {
                var oNewFont = new AscCommonExcel.Font();
                res = this.bcr.Read2Spreadsheet(length, function(t,l){
                    return oThis.bssr.ReadRPr(t,l,oNewFont);
                });
                this.bssr.CheckSchemeFont(oNewFont);
                aFonts.push(oNewFont);
            }
            else
                res = c_oSerConstants.ReadUnknown;
            return res;
        };
        this.ReadNumFmts = function(type, length, oNumFmts)
        {
            var res = c_oSerConstants.ReadOk;
            var oThis = this;
            if ( c_oSerStylesTypes.NumFmt == type )
            {
                var oNewNumFmt = {f: null, id: null};
                res = this.bcr.Read2Spreadsheet(length, function(t,l){
                    return oThis.ReadNumFmt(t,l,oNewNumFmt);
                });
				if (null != oNewNumFmt.id) {
					this.ParseNum(oNewNumFmt, oNumFmts);
				}
            }
            else
                res = c_oSerConstants.ReadUnknown;
            return res;
        };
        this.ReadNumFmt = function(type, length, oNumFmt)
        {
            var res = c_oSerConstants.ReadOk;
            if ( c_oSerNumFmtTypes.FormatCode == type )
            {
                oNumFmt.f = this.stream.GetString2LE(length);
            }
            else if ( c_oSerNumFmtTypes.NumFmtId == type )
            {
                oNumFmt.id = this.stream.GetULongLE();
            }
            else
                res = c_oSerConstants.ReadUnknown;
            return res;
        };
        this.ReadCellStyles = function (type, length, aCellStyles) {
            var res = c_oSerConstants.ReadOk;
            var oThis = this;
            var oCellStyle = null;
            if (c_oSerStylesTypes.CellStyle === type) {
                oCellStyle = new AscCommonExcel.CCellStyle();
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadCellStyle(t, l, oCellStyle);
                });
                aCellStyles.push(oCellStyle);
            } else
                res = c_oSerConstants.ReadUnknown;
            return res;
        };
        this.ReadCellStyle = function (type, length, oCellStyle) {
            var res = c_oSerConstants.ReadOk;
            if (c_oSer_CellStyle.BuiltinId === type)
                oCellStyle.BuiltinId = this.stream.GetULongLE();
            else if (c_oSer_CellStyle.CustomBuiltin === type)
                oCellStyle.CustomBuiltin = this.stream.GetBool();
            else if (c_oSer_CellStyle.Hidden === type)
                oCellStyle.Hidden = this.stream.GetBool();
            else if (c_oSer_CellStyle.ILevel === type)
                oCellStyle.ILevel = this.stream.GetULongLE();
            else if (c_oSer_CellStyle.Name === type)
                oCellStyle.Name = this.stream.GetString2LE(length);
            else if (c_oSer_CellStyle.XfId === type)
                oCellStyle.XfId = this.stream.GetULongLE();
            else
                res = c_oSerConstants.ReadUnknown;
            return res;
        };
        this.ReadDxfs = function(type, length, aDxfs)
        {
            var res = c_oSerConstants.ReadOk;
            var oThis = this;
            if ( c_oSerStylesTypes.Dxf == type )
            {
                var oDxf = new AscCommonExcel.CellXfs();
                res = this.bcr.Read1(length, function(t,l){
                    return oThis.ReadDxf(t,l,oDxf);
                });
                aDxfs.push(oDxf);
            }
            else
                res = c_oSerConstants.ReadUnknown;
            return res;
        };
        this.ReadDxf = function(type, length, oDxf)
        {
            var res = c_oSerConstants.ReadOk;
            var oThis = this;
            if ( c_oSer_Dxf.Alignment == type )
            {
                oDxf.align = new AscCommonExcel.Align();
                res = this.bcr.Read2Spreadsheet(length, function(t,l){
                    return oThis.ReadAligment(t,l,oDxf.align);
                });
            }
            else if ( c_oSer_Dxf.Border == type )
            {
                var oNewBorder = new AscCommonExcel.Border();
                res = this.bcr.Read1(length, function(t,l){
                    return oThis.ReadBorder(t,l,oNewBorder);
                });
                oDxf.border = oNewBorder;
            }
            else if ( c_oSer_Dxf.Fill == type )
            {
                var oNewFill = new AscCommonExcel.Fill();
                res = this.bcr.Read1(length, function(t,l){
                    return oThis.ReadFill(t,l,oNewFill);
                });
                oDxf.fill = oNewFill;
            }
            else if ( c_oSer_Dxf.Font == type )
            {
                var oNewFont = new AscCommonExcel.Font();
                res = this.bcr.Read2Spreadsheet(length, function(t,l){
                    return oThis.bssr.ReadRPr(t,l,oNewFont);
                });
                this.bssr.CheckSchemeFont(oNewFont);
                oDxf.font = oNewFont;
            }
            else if ( c_oSer_Dxf.NumFmt == type )
            {
                var oNewNumFmt = {f: null, id: null};
                res = this.bcr.Read2Spreadsheet(length, function(t,l){
                    return oThis.ReadNumFmt(t,l,oNewNumFmt);
                });
                if(null != oNewNumFmt.id)
                    oDxf.num = this.ParseNum(oNewNumFmt, null);
            }
            else
                res = c_oSerConstants.ReadUnknown;
            return res;
        };
        this.ReadTableStyles = function(type, length, oTableStyles, oCustomStyles)
        {
            var res = c_oSerConstants.ReadOk;
            var oThis = this;
            if ( c_oSer_TableStyles.DefaultTableStyle == type )
                oTableStyles.DefaultTableStyle = this.stream.GetString2LE(length);
            else if ( c_oSer_TableStyles.DefaultPivotStyle == type )
                oTableStyles.DefaultPivotStyle = this.stream.GetString2LE(length);
            else if ( c_oSer_TableStyles.TableStyles == type )
            {
                res = this.bcr.Read1(length, function(t,l){
                    return oThis.ReadTableCustomStyles(t,l, oCustomStyles);
                });
            }
            else
                res = c_oSerConstants.ReadUnknown;
            return res;
        };
        this.ReadTableCustomStyles = function(type, length, oCustomStyles)
        {
            var res = c_oSerConstants.ReadOk;
            var oThis = this;
            if (c_oSer_TableStyles.TableStyle === type)
            {
                var oNewStyle = new CTableStyle();
                var aElements = [];
                res = this.bcr.Read1(length, function(t,l){
                    return oThis.ReadTableCustomStyle(t,l, oNewStyle, aElements);
                });
                if(null != oNewStyle.name) {
                    if (null === oNewStyle.displayName)
                        oNewStyle.displayName = oNewStyle.name;
                    oCustomStyles[oNewStyle.name] = {style : oNewStyle, elements: aElements};
                }
            }
            else
                res = c_oSerConstants.ReadUnknown;
            return res;
        };
        this.ReadTableCustomStyle = function(type, length, oNewStyle, aElements)
        {
            var res = c_oSerConstants.ReadOk;
            var oThis = this;
            if (c_oSer_TableStyle.Name === type)
                oNewStyle.name = this.stream.GetString2LE(length);
            else if (c_oSer_TableStyle.Pivot === type)
                oNewStyle.pivot = this.stream.GetBool();
            else if (c_oSer_TableStyle.Table === type)
                oNewStyle.table = this.stream.GetBool();
            else if (c_oSer_TableStyle.Elements === type) {
                res = this.bcr.Read1(length, function(t,l){
                    return oThis.ReadTableCustomStyleElements(t,l, aElements);
                });
            } else if (c_oSer_TableStyle.DisplayName === type)
                oNewStyle.displayName = this.stream.GetString2LE(length);
            else
                res = c_oSerConstants.ReadUnknown;
            return res;
        };
        this.ReadTableCustomStyleElements = function(type, length, aElements)
        {
            var res = c_oSerConstants.ReadOk;
            var oThis = this;
            if (c_oSer_TableStyle.Element === type)
            {
                var oNewStyleElement = {Type: null, Size: null, DxfId: null};
                res = this.bcr.Read2Spreadsheet(length, function(t,l){
                    return oThis.ReadTableCustomStyleElement(t,l, oNewStyleElement);
                });
                if(null != oNewStyleElement.Type && null != oNewStyleElement.DxfId)
                    aElements.push(oNewStyleElement);
            }
            else
                res = c_oSerConstants.ReadUnknown;
            return res;
        };
        this.ReadTableCustomStyleElement = function(type, length, oNewStyleElement)
        {
            var res = c_oSerConstants.ReadOk;
            if (c_oSer_TableStyleElement.Type === type)
                oNewStyleElement.Type = this.stream.GetUChar();
            else if (c_oSer_TableStyleElement.Size === type)
                oNewStyleElement.Size = this.stream.GetULongLE();
            else if (c_oSer_TableStyleElement.DxfId === type)
                oNewStyleElement.DxfId = this.stream.GetULongLE();
            else
                res = c_oSerConstants.ReadUnknown;
            return res;
        };
    }
    /** @constructor */
    function Binary_WorkbookTableReader(stream, oWorkbook, bwtr)
    {
        this.stream = stream;
        this.oWorkbook = oWorkbook;
        this.bcr = new Binary_CommonReader(this.stream);
        this.bwtr = bwtr;
        this.Read = function()
        {
            var oThis = this;
            return this.bcr.ReadTable(function(t, l){
                return oThis.ReadWorkbookContent(t,l);
            });
        };
        this.ReadWorkbookContent = function(type, length)
        {
            var res = c_oSerConstants.ReadOk;
            var oThis = this;
            if ( c_oSerWorkbookTypes.WorkbookPr === type )
            {
                if(null == this.oWorkbook.WorkbookPr)
                    this.oWorkbook.WorkbookPr = {};
                res = this.bcr.Read2Spreadsheet(length, function(t,l){
                    return oThis.ReadWorkbookPr(t,l,oThis.oWorkbook.WorkbookPr);
                });
            }
            else if ( c_oSerWorkbookTypes.BookViews === type )
            {
                res = this.bcr.Read1(length, function(t,l){
                    return oThis.ReadBookViews(t,l);
                });
            }
            else if ( c_oSerWorkbookTypes.DefinedNames === type )
            {
                res = this.bcr.Read1(length, function(t,l){
                    return oThis.ReadDefinedNames(t,l);
                });
            }
			else if ( c_oSerWorkbookTypes.ExternalReferences === type )
			{
				res = this.bcr.Read1(length, function(t,l){
					return oThis.ReadExternalReferences(t,l);
				});
			}
			else if (c_oSerWorkbookTypes.JsaProject == type)
			{
				this.oWorkbook.oApi.macros.SetData(AscCommon.GetStringUtf8(this.stream, length));
			}
            else if (c_oSerWorkbookTypes.Comments == type)
            {
                res = this.bcr.Read1(length, function(t,l){
                    return oThis.bwtr.ReadCommentDatas(t,l, oThis.oWorkbook.aComments);
                });
            }
            else
                res = c_oSerConstants.ReadUnknown;
            return res;
        };
        this.ReadWorkbookPr = function(type, length, WorkbookPr)
        {
            var res = c_oSerConstants.ReadOk;
            if ( c_oSerWorkbookPrTypes.Date1904 == type )
            {
                WorkbookPr.Date1904 = this.stream.GetBool();
                AscCommon.bDate1904 = WorkbookPr.Date1904;
                AscCommonExcel.c_DateCorrectConst = AscCommon.bDate1904?AscCommonExcel.c_Date1904Const:AscCommonExcel.c_Date1900Const;
            }
            else if ( c_oSerWorkbookPrTypes.DateCompatibility == type )
                WorkbookPr.DateCompatibility = this.stream.GetBool();
			else if ( c_oSerWorkbookPrTypes.HidePivotFieldList == type ) {
				WorkbookPr.HidePivotFieldList = this.stream.GetBool();
			} else if ( c_oSerWorkbookPrTypes.ShowPivotChartFilter == type ) {
				WorkbookPr.ShowPivotChartFilter = this.stream.GetBool();
			} else
                res = c_oSerConstants.ReadUnknown;
            return res;
        };
        this.ReadBookViews = function(type, length)
        {
            var res = c_oSerConstants.ReadOk;
            var oThis = this;
            if ( c_oSerWorkbookTypes.WorkbookView == type )
            {
                res = this.bcr.Read2Spreadsheet(length, function(t,l){
                    return oThis.ReadWorkbookView(t,l);
                });
            }
            else
                res = c_oSerConstants.ReadUnknown;
            return res;
        };
        this.ReadWorkbookView = function(type, length)
        {
            var res = c_oSerConstants.ReadOk;
            if ( c_oSerWorkbookViewTypes.ActiveTab == type )
                this.oWorkbook.nActive = this.stream.GetULongLE();
            else
                res = c_oSerConstants.ReadUnknown;
            return res;
        };
        this.ReadDefinedNames = function(type, length)
        {
            var res = c_oSerConstants.ReadOk, LocalSheetId;
            var oThis = this;
            if ( c_oSerWorkbookTypes.DefinedName == type )
            {
                var oNewDefinedName = new Asc.asc_CDefName();
                res = this.bcr.Read1(length, function(t,l){
                    return oThis.ReadDefinedName(t,l,oNewDefinedName);
                });
                if (null != oNewDefinedName.Name && null != oNewDefinedName.Ref) {
                    this.oWorkbook.dependencyFormulas.addDefNameOpen(oNewDefinedName.Name, oNewDefinedName.Ref, oNewDefinedName.LocalSheetId, oNewDefinedName.Hidden, false);
                }
            }
            else
                res = c_oSerConstants.ReadUnknown;
            return res;
        };
        this.ReadDefinedName = function(type, length, oDefinedName)
        {
            var res = c_oSerConstants.ReadOk;
            if ( c_oSerDefinedNameTypes.Name == type )
                oDefinedName.Name = this.stream.GetString2LE(length);
            else if ( c_oSerDefinedNameTypes.Ref == type )
                oDefinedName.Ref = this.stream.GetString2LE(length);
            else if ( c_oSerDefinedNameTypes.LocalSheetId == type )
                oDefinedName.LocalSheetId = this.stream.GetULongLE();
            else if ( c_oSerDefinedNameTypes.Hidden == type )
                oDefinedName.Hidden = this.stream.GetBool();
            else
                res = c_oSerConstants.ReadUnknown;
            return res;
        };
		this.ReadExternalReferences = function(type, length) {
			var res = c_oSerConstants.ReadOk;
			var oThis = this;
			if (c_oSerWorkbookTypes.ExternalBook == type) {
				var externalBook = {Type: 0, Id: null, SheetNames: [], DefinedNames: [], SheetDataSet: []};
				res = this.bcr.Read1(length, function(t, l) {
					return oThis.ReadExternalBook(t, l, externalBook);
				});
				this.oWorkbook.externalReferences.push(externalBook);
			} else if (c_oSerWorkbookTypes.OleLink == type) {
				this.oWorkbook.externalReferences.push({Type: 1, Buffer: this.stream.GetBuffer(length)});
			} else if (c_oSerWorkbookTypes.DdeLink == type) {
				this.oWorkbook.externalReferences.push({Type: 2, Buffer: this.stream.GetBuffer(length)});
			} else {
				res = c_oSerConstants.ReadUnknown;
			}
			return res;
		};
		this.ReadExternalBook = function(type, length, externalBook) {
			var res = c_oSerConstants.ReadOk;
			var oThis = this;
			if (c_oSer_ExternalLinkTypes.Id == type) {
				externalBook.Id = this.stream.GetString2LE(length);
			} else if (c_oSer_ExternalLinkTypes.SheetNames == type) {
				res = this.bcr.Read1(length, function(t, l) {
					return oThis.ReadExternalSheetNames(t, l, externalBook.SheetNames);
				});
			} else if (c_oSer_ExternalLinkTypes.DefinedNames == type) {
				res = this.bcr.Read1(length, function(t, l) {
					return oThis.ReadExternalDefinedNames(t, l, externalBook.DefinedNames);
				});
			} else if (c_oSer_ExternalLinkTypes.SheetDataSet == type) {
				res = this.bcr.Read1(length, function(t, l) {
					return oThis.ReadExternalSheetDataSet(t, l, externalBook.SheetDataSet);
				});
			} else {
				res = c_oSerConstants.ReadUnknown;
			}
			return res;
		};
		this.ReadExternalSheetNames = function(type, length, sheetNames) {
			var res = c_oSerConstants.ReadOk;
			var oThis = this;
			if (c_oSer_ExternalLinkTypes.SheetName == type) {
				sheetNames.push(this.stream.GetString2LE(length));
			} else {
				res = c_oSerConstants.ReadUnknown;
			}
			return res;
		};
		this.ReadExternalDefinedNames = function(type, length, definedNames) {
			var res = c_oSerConstants.ReadOk;
			var oThis = this;
			if (c_oSer_ExternalLinkTypes.DefinedName == type) {
				var definedName = {Name: null, RefersTo: null, SheetId: null};
				res = this.bcr.Read1(length, function(t, l) {
					return oThis.ReadExternalDefinedName(t, l, definedName);
				});
				definedNames.push(definedName);
			} else {
				res = c_oSerConstants.ReadUnknown;
			}
			return res;
		};
		this.ReadExternalDefinedName = function(type, length, definedName) {
			var res = c_oSerConstants.ReadOk;
			var oThis = this;
			if (c_oSer_ExternalLinkTypes.DefinedNameName == type) {
				definedName.Name = this.stream.GetString2LE(length);
			} else if (c_oSer_ExternalLinkTypes.DefinedNameRefersTo == type) {
				definedName.RefersTo = this.stream.GetString2LE(length);
			} else if (c_oSer_ExternalLinkTypes.DefinedNameSheetId == type) {
				definedName.SheetId = this.stream.GetULongLE();
			} else {
				res = c_oSerConstants.ReadUnknown;
			}
			return res;
		};
		this.ReadExternalSheetDataSet = function(type, length, sheetDataSet) {
			var res = c_oSerConstants.ReadOk;
			var oThis = this;
			if (c_oSer_ExternalLinkTypes.SheetData == type) {
				var sheetData = {SheetId: null, RefreshError: null, Row: []};
				res = this.bcr.Read1(length, function(t, l) {
					return oThis.ReadExternalSheetData(t, l, sheetData);
				});
				sheetDataSet.push(sheetData);
			} else {
				res = c_oSerConstants.ReadUnknown;
			}
			return res;
		};
		this.ReadExternalSheetData = function(type, length, sheetData) {
			var res = c_oSerConstants.ReadOk;
			var oThis = this;
			if (c_oSer_ExternalLinkTypes.SheetDataSheetId == type) {
				sheetData.SheetId = this.stream.GetULongLE();
			} else if (c_oSer_ExternalLinkTypes.SheetDataRefreshError == type) {
				sheetData.RefreshError = this.stream.GetBool();
			} else if (c_oSer_ExternalLinkTypes.SheetDataRow == type) {
				var row = {R: null, Cell: []};
				res = this.bcr.Read1(length, function(t, l) {
					return oThis.ReadExternalRow(t, l, row);
				});
				sheetData.Row.push(row);
			} else {
				res = c_oSerConstants.ReadUnknown;
			}
			return res;
		};
		this.ReadExternalRow = function(type, length, row) {
			var res = c_oSerConstants.ReadOk;
			var oThis = this;
			if (c_oSer_ExternalLinkTypes.SheetDataRowR == type) {
				row.R = this.stream.GetULongLE();
			} else if (c_oSer_ExternalLinkTypes.SheetDataRowCell == type) {
				var cell = {Ref: null, CellType: null, CellValue: null};
				res = this.bcr.Read1(length, function(t, l) {
					return oThis.ReadExternalCell(t, l, cell);
				});
				row.Cell.push(cell);
			} else {
				res = c_oSerConstants.ReadUnknown;
			}
			return res;
		};
		this.ReadExternalCell = function(type, length, cell) {
			var res = c_oSerConstants.ReadOk;
			var oThis = this;
			if (c_oSer_ExternalLinkTypes.SheetDataRowCellRef == type) {
				cell.Ref = this.stream.GetString2LE(length);
			} else if (c_oSer_ExternalLinkTypes.SheetDataRowCellType == type) {
				cell.CellType = this.stream.GetUChar();
			} else if (c_oSer_ExternalLinkTypes.SheetDataRowCellValue == type) {
				cell.CellValue = this.stream.GetString2LE(length);
			} else {
				res = c_oSerConstants.ReadUnknown;
			}
			return res;
		};
    }
    /** @constructor */
    function Binary_WorksheetTableReader(stream, oReadResult, wb, aSharedStrings, aCellXfs, Dxfs, oMediaArray, copyPasteObj)
    {
        this.stream = stream;
        this.wb = wb;
        this.aSharedStrings = aSharedStrings;
        this.oMediaArray = oMediaArray;
        this.aCellXfs = aCellXfs;
        this.Dxfs = Dxfs;
        this.bcr = new Binary_CommonReader(this.stream);
        this.aMerged = [];
        this.aHyperlinks = [];
        this.copyPasteObj = copyPasteObj;
        this.curWorksheet = null;
        this.oReadResult = oReadResult;
        this.Read = function()
        {
            var oThis = this;
            return this.bcr.ReadTable(function(t, l){
                return oThis.ReadWorksheetsContent(t,l);
            });
        };
        this.ReadWorksheetsContent = function(type, length)
        {
            var res = c_oSerConstants.ReadOk;
            var oThis = this;
            if ( c_oSerWorksheetsTypes.Worksheet === type )
            {
                this.aMerged = [];
                this.aHyperlinks = [];
                var oNewWorksheet = new AscCommonExcel.Worksheet(this.wb, wb.aWorksheets.length);
                oNewWorksheet.aFormulaExt = [];
				
				//TODO при copy/paste в word из excel необходимо подменить DrawingDocument из word - пересмотреть правку!
				if(typeof editor != "undefined" && editor && editor.WordControl && editor.WordControl.m_oLogicDocument && editor.WordControl.m_oLogicDocument.DrawingDocument)
					oNewWorksheet.DrawingDocument = editor.WordControl.m_oLogicDocument.DrawingDocument;
				else if(this.copyPasteObj && this.copyPasteObj.isCopyPaste)
				{
					oNewWorksheet.DrawingDocument = window["Asc"]["editor"].wbModel.getActiveWs().DrawingDocument;
				}
				
                this.curWorksheet = oNewWorksheet;
                res = this.bcr.Read1(length, function(t,l){
                    return oThis.ReadWorksheet(t,l, oNewWorksheet);
                });
                this.curWorksheet = null;
                //merged
                var i;
                for(i = 0, length = this.aMerged.length; i < length; ++i)
                {
                    var range = oNewWorksheet.getRange2(this.aMerged[i]);
                    if(null != range)
                        range.mergeOpen();
                }
                //hyperlinks
                for(i = 0, length = this.aHyperlinks.length; i < length; ++i)
                {
                    var hyperlink = this.aHyperlinks[i];
                    if (null !== hyperlink.Ref)
                        hyperlink.Ref.setHyperlinkOpen(hyperlink);
                }
                this.wb.aWorksheets.push(oNewWorksheet);
                this.wb.aWorksheetsById[oNewWorksheet.getId()] = oNewWorksheet;
            }
            else
                res = c_oSerConstants.ReadUnknown;
            return res;
        };
        this.ReadWorksheet = function(type, length, oWorksheet)
        {
            var res = c_oSerConstants.ReadOk;
            var oThis = this;
            var oBinary_TableReader, oConditionalFormatting;
            if ( c_oSerWorksheetsTypes.WorksheetProp == type )
            {
                res = this.bcr.Read2Spreadsheet(length, function(t,l){
                    return oThis.ReadWorksheetProp(t,l, oWorksheet);
                });
            }
            else if ( c_oSerWorksheetsTypes.Cols == type )
            {
                if(null == oWorksheet.Cols)
                    oWorksheet.aCols = [];
                var aTempCols = [];
                res = this.bcr.Read1(length, function(t,l){
                    return oThis.ReadWorksheetCols(t,l, aTempCols, oWorksheet);
                });

                var fInitCol = function(oFrom, oTo)
                {
                    if(null != oFrom.BestFit)
                        oTo.BestFit = oFrom.BestFit;
                    oTo.setHidden(oFrom.hd);
                    if(null != oFrom.xfs)
                        oTo.setStyle(oFrom.xfs);
                    else if(null != oFrom.xfsid)
                    {
                        var xfs = oThis.aCellXfs[oFrom.xfsid];
                        if(null != xfs)
                        {
                            oFrom.xfs = xfs;
                            oTo.setStyle(xfs);
                        }
                    }
                    if(null != oFrom.width)
                        oTo.width = oFrom.width;
                    if(null != oFrom.CustomWidth)
                        oTo.CustomWidth = oFrom.CustomWidth;
                    if(oTo.index >= oWorksheet.nColsCount)
                        oWorksheet.nColsCount = oTo.index + 1;
                };
                //если есть стиль последней колонки, назначаем его стилем всей таблицы и убираем из колонок
                var oAllCol = null;
                if(aTempCols.length > 0)
                {
                    var oLast = aTempCols[aTempCols.length - 1];
                    if(AscCommon.gc_nMaxCol == oLast.Max)
                    {
                        oAllCol = oLast;
                        fInitCol(oAllCol, oWorksheet.getAllCol());
                    }
                }
                for(var i = 0, length = aTempCols.length; i < length; ++i)
                {
                    var elem = aTempCols[i];
                    if(null != oAllCol && elem.BestFit == oAllCol.BestFit && elem.hd == oAllCol.hd && elem.xfs == oAllCol.xfs && elem.width == oAllCol.width && elem.CustomWidth == oAllCol.CustomWidth)
                        continue;
                    if(null == elem.width)
                    {
                        elem.width = 0;
                        elem.hd = true;
                    }
                    for(var j = elem.Min; j <= elem.Max; j++){
                        var oNewCol = new AscCommonExcel.Col(oWorksheet, j - 1);
                        fInitCol(elem, oNewCol);
                        oWorksheet.aCols[oNewCol.index] = oNewCol;
                    }
                }
            }
            else if ( c_oSerWorksheetsTypes.SheetFormatPr == type )
            {
                res = this.bcr.Read2Spreadsheet(length, function(t,l){
                    return oThis.ReadSheetFormatPr(t,l, oWorksheet);
                });
            }
            else if ( c_oSerWorksheetsTypes.PageMargins == type )
            {
                var oPageMargins = new Asc.asc_CPageMargins();
                res = this.bcr.Read2Spreadsheet(length, function(t,l){
                    return oThis.ReadPageMargins(t,l, oPageMargins);
                });
                if(null == oWorksheet.PagePrintOptions)
                    oWorksheet.PagePrintOptions = new Asc.asc_CPageOptions();
                oWorksheet.PagePrintOptions.asc_setPageMargins(oPageMargins);
            }
            else if ( c_oSerWorksheetsTypes.PageSetup == type )
            {
                var oPageSetup = new Asc.asc_CPageSetup();
                res = this.bcr.Read2Spreadsheet(length, function(t,l){
                    return oThis.ReadPageSetup(t,l, oPageSetup);
                });
                if(null == oWorksheet.PagePrintOptions)
                    oWorksheet.PagePrintOptions = new Asc.asc_CPageOptions();
                oWorksheet.PagePrintOptions.asc_setPageSetup(oPageSetup);
            }
            else if ( c_oSerWorksheetsTypes.PrintOptions == type )
            {
                if(null == oWorksheet.PagePrintOptions)
                    oWorksheet.PagePrintOptions = new Asc.asc_CPageOptions();
                res = this.bcr.Read2Spreadsheet(length, function(t,l){
                    return oThis.ReadPrintOptions(t,l, oWorksheet.PagePrintOptions);
                });
            }
            else if ( c_oSerWorksheetsTypes.Hyperlinks == type )
            {
                res = this.bcr.Read1(length, function(t,l){
                    return oThis.ReadHyperlinks(t,l, oWorksheet);
                });
            }
            else if ( c_oSerWorksheetsTypes.MergeCells == type )
            {
                res = this.bcr.Read1(length, function(t,l){
                    return oThis.ReadMergeCells(t,l, oWorksheet);
                });
            }
            else if ( c_oSerWorksheetsTypes.SheetData == type )
            {
				var tempRow = new AscCommonExcel.Row(oWorksheet);
				var tmpData = {pos: null, len: null, prevRow: -1, prevCol: -1};
                res = this.bcr.Read1(length, function(t,l){
                    return oThis.ReadSheetData(t,l, oWorksheet, tempRow, tmpData);
                });
            }
            else if ( c_oSerWorksheetsTypes.Drawings == type )
            {
                res = this.bcr.Read1(length, function(t,l){
                    return oThis.ReadDrawings(t,l, oWorksheet.Drawings, oWorksheet);
                });
            }
            else if ( c_oSerWorksheetsTypes.Autofilter == type )
            {
                oBinary_TableReader = new Binary_TableReader(this.stream, this.oReadResult, oWorksheet, this.Dxfs);
                oWorksheet.AutoFilter = new AscCommonExcel.AutoFilter();
                res = this.bcr.Read1(length, function(t,l){
                    return oBinary_TableReader.ReadAutoFilter(t,l, oWorksheet.AutoFilter);
                });
            }
            else if ( c_oSerWorksheetsTypes.TableParts == type )
            {
                oBinary_TableReader = new Binary_TableReader(this.stream, this.oReadResult, oWorksheet, this.Dxfs);
                oBinary_TableReader.Read(length, oWorksheet.TableParts);
            } else if ( c_oSerWorksheetsTypes.Comments == type
                && !(typeof editor !== "undefined" && editor.WordControl && editor.WordControl.m_oLogicDocument && Array.isArray(editor.WordControl.m_oLogicDocument.Slides))) {
                res = this.bcr.Read1(length, function(t,l){
                    return oThis.ReadComments(t,l, oWorksheet);
                });
            } else if (c_oSerWorksheetsTypes.ConditionalFormatting === type && typeof AscCommonExcel.CConditionalFormatting != "undefined") {
                oConditionalFormatting = new AscCommonExcel.CConditionalFormatting();
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadConditionalFormatting(t, l, oConditionalFormatting);
                });
				if (oConditionalFormatting.isValid()) {
					oConditionalFormatting.initRules();
					oWorksheet.aConditionalFormattingRules =
						oWorksheet.aConditionalFormattingRules.concat(oConditionalFormatting.aRules);
				}
            } else if (c_oSerWorksheetsTypes.SheetViews === type) {
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadSheetViews(t, l, oWorksheet.sheetViews);
                });
            } else if (c_oSerWorksheetsTypes.SheetPr === type) {
                oWorksheet.sheetPr = new AscCommonExcel.asc_CSheetPr();
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadSheetPr(t, l, oWorksheet.sheetPr);
                });
			} else if (c_oSerWorksheetsTypes.SparklineGroups === type) {
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadSparklineGroups(t, l, oWorksheet);
                });
            } else
                res = c_oSerConstants.ReadUnknown;
            return res;
        };
        this.ReadWorksheetProp = function(type, length, oWorksheet)
        {
            var res = c_oSerConstants.ReadOk;
            if ( c_oSerWorksheetPropTypes.Name == type )
                oWorksheet.sName = this.stream.GetString2LE(length);
            else if ( c_oSerWorksheetPropTypes.SheetId == type )
                oWorksheet.nSheetId = this.stream.GetULongLE();
            else if ( c_oSerWorksheetPropTypes.State == type )
            {
                switch(this.stream.GetUChar())
                {
                    case EVisibleType.visibleHidden: oWorksheet.bHidden = true;break;
                    case EVisibleType.visibleVeryHidden: oWorksheet.bHidden = true;break;
                    case EVisibleType.visibleVisible: oWorksheet.bHidden = false;break;
                }
            }
            else if(this.copyPasteObj.isCopyPaste && c_oSerWorksheetPropTypes.Ref == type)
                this.copyPasteObj.activeRange = this.stream.GetString2LE(length);
            else
                res = c_oSerConstants.ReadUnknown;
            return res;
        };
        this.ReadWorksheetCols = function(type, length, aTempCols, oWorksheet)
        {
            var res = c_oSerConstants.ReadOk;
            var oThis = this;
            if ( c_oSerWorksheetsTypes.Col == type )
            {
                var oTempCol = {BestFit: null, hd: null, Max: null, Min: null, xfs: null, xfsid: null, width: null, CustomWidth: null};
                res = this.bcr.Read2Spreadsheet(length, function(t,l){
                    return oThis.ReadWorksheetCol(t,l, oTempCol);
                });
                aTempCols.push(oTempCol);
            }
            else
                res = c_oSerConstants.ReadUnknown;
            return res;
        };
        this.ReadWorksheetCol = function(type, length, oCol)
        {
            var res = c_oSerConstants.ReadOk;
            if ( c_oSerWorksheetColTypes.BestFit == type )
                oCol.BestFit = this.stream.GetBool();
            else if ( c_oSerWorksheetColTypes.Hidden == type )
                oCol.hd = this.stream.GetBool();
            else if ( c_oSerWorksheetColTypes.Max == type )
                oCol.Max = this.stream.GetULongLE();
            else if ( c_oSerWorksheetColTypes.Min == type )
                oCol.Min = this.stream.GetULongLE();
            else if ( c_oSerWorksheetColTypes.Style == type )
                oCol.xfsid = this.stream.GetULongLE();
            else if ( c_oSerWorksheetColTypes.Width == type )
            {
                oCol.width = this.stream.GetDoubleLE();
				if (oCol.width < 0) {
					oCol.width = 0;
				} else if (oCol.width > Asc.c_oAscMaxColumnWidth) {
					oCol.width = Asc.c_oAscMaxColumnWidth;
				}
                if(AscCommon.CurFileVersion < 2)
                    oCol.CustomWidth = 1;
            }
            else if ( c_oSerWorksheetColTypes.CustomWidth == type )
                oCol.CustomWidth = this.stream.GetBool();
            else
                res = c_oSerConstants.ReadUnknown;
            return res;
        };
        this.ReadSheetFormatPr = function(type, length, oWorksheet)
        {
            var res = c_oSerConstants.ReadOk;
            if ( c_oSerSheetFormatPrTypes.DefaultColWidth == type )
                oWorksheet.oSheetFormatPr.dDefaultColWidth = this.stream.GetDoubleLE();
            else if (c_oSerSheetFormatPrTypes.BaseColWidth === type)
                oWorksheet.oSheetFormatPr.nBaseColWidth = this.stream.GetULongLE();
            else if ( c_oSerSheetFormatPrTypes.DefaultRowHeight == type )
            {
                var oAllRow = oWorksheet.getAllRow();
                oAllRow.setHeight(this.stream.GetDoubleLE());
            }
            else if ( c_oSerSheetFormatPrTypes.CustomHeight == type )
            {
                var oAllRow = oWorksheet.getAllRow();
				var CustomHeight = this.stream.GetBool();
				if(CustomHeight)
					oAllRow.setCustomHeight(true);
            }
            else if ( c_oSerSheetFormatPrTypes.ZeroHeight == type )
            {
                var oAllRow = oWorksheet.getAllRow();
				var hd = this.stream.GetBool();
				if(hd)
					oAllRow.setHidden(true);
            }
            else
                res = c_oSerConstants.ReadUnknown;
            return res;
        };
        this.ReadPageMargins = function(type, length, oPageMargins)
        {
            var res = c_oSerConstants.ReadOk;
            if ( c_oSer_PageMargins.Left == type )
                oPageMargins.asc_setLeft(this.stream.GetDoubleLE());
            else if ( c_oSer_PageMargins.Top == type )
                oPageMargins.asc_setTop(this.stream.GetDoubleLE());
            else if ( c_oSer_PageMargins.Right == type )
                oPageMargins.asc_setRight(this.stream.GetDoubleLE());
            else if ( c_oSer_PageMargins.Bottom == type )
                oPageMargins.asc_setBottom(this.stream.GetDoubleLE());
            else
                res = c_oSerConstants.ReadUnknown;
            return res;
        };
        this.ReadPageSetup = function(type, length, oPageSetup)
        {
            var res = c_oSerConstants.ReadOk;
            if ( c_oSer_PageSetup.Orientation == type )
            {
                var byteFormatOrientation = this.stream.GetUChar();
                var byteOrientation = null;
                switch(byteFormatOrientation)
                {
                    case EPageOrientation.pageorientPortrait: byteOrientation = c_oAscPageOrientation.PagePortrait;break;
                    case EPageOrientation.pageorientLandscape: byteOrientation = c_oAscPageOrientation.PageLandscape;break;
                }
                if(null != byteOrientation)
                    oPageSetup.asc_setOrientation(byteOrientation);
            }
            else if ( c_oSer_PageSetup.PaperSize == type )
            {
                var bytePaperSize = this.stream.GetUChar();
                var item = DocumentPageSize.getSizeById(bytePaperSize);
                oPageSetup.asc_setWidth(item.w_mm);
                oPageSetup.asc_setHeight(item.h_mm);
            }
            else
                res = c_oSerConstants.ReadUnknown;
            return res;
        };
        this.ReadPrintOptions = function(type, length, oPrintOptions)
        {
            var res = c_oSerConstants.ReadOk;
            if ( c_oSer_PrintOptions.GridLines == type )
                oPrintOptions.asc_setGridLines(this.stream.GetBool());
            else if ( c_oSer_PrintOptions.Headings == type )
                oPrintOptions.asc_setHeadings(this.stream.GetBool());
            else
                res = c_oSerConstants.ReadUnknown;
            return res;
        };
        this.ReadHyperlinks = function(type, length, ws)
        {
            var res = c_oSerConstants.ReadOk;
            var oThis = this;
            if ( c_oSerWorksheetsTypes.Hyperlink == type )
            {
                var oNewHyperlink = new AscCommonExcel.Hyperlink();
                res = this.bcr.Read1(length, function(t,l){
                    return oThis.ReadHyperlink(t,l, ws, oNewHyperlink);
                });
                this.aHyperlinks.push(oNewHyperlink);
            }
            else
                res = c_oSerConstants.ReadUnknown;
            return res;
        };
        this.ReadHyperlink = function(type, length, ws, oHyperlink)
        {
            var res = c_oSerConstants.ReadOk;
            if ( c_oSerHyperlinkTypes.Ref == type )
                oHyperlink.Ref = ws.getRange2(this.stream.GetString2LE(length));
            else if ( c_oSerHyperlinkTypes.Hyperlink == type )
                oHyperlink.Hyperlink = this.stream.GetString2LE(length);
            else if ( c_oSerHyperlinkTypes.Location == type )
                oHyperlink.setLocation(this.stream.GetString2LE(length));
            else if ( c_oSerHyperlinkTypes.Tooltip == type )
                oHyperlink.Tooltip = this.stream.GetString2LE(length);
            else
                res = c_oSerConstants.ReadUnknown;
            return res;
        };
        this.ReadMergeCells = function(type, length)
        {
            var res = c_oSerConstants.ReadOk;
            if ( c_oSerWorksheetsTypes.MergeCell == type )
            {
                this.aMerged.push(this.stream.GetString2LE(length));
            }
            else
                res = c_oSerConstants.ReadUnknown;
            return res;
        };
        this.ReadSheetData = function(type, length, ws, tempRow, tmpData)
        {
            var res = c_oSerConstants.ReadOk;
            var oThis = this;
            if ( c_oSerWorksheetsTypes.Row == type )
            {
				tmpData.pos =  null;
				tmpData.len = null;
				tempRow.clear();
                res = this.bcr.Read2Spreadsheet(length, function(t,l){
                    return oThis.ReadRow(t,l, tempRow, ws, tmpData);
                });
				if(null === tempRow.index) {
					tempRow.index = tmpData.prevRow + 1;
				}
				tempRow.saveContent();
				if(tempRow.index >= ws.nRowsCount)
					ws.nRowsCount = tempRow.index + 1;
				tmpData.prevRow = tempRow.index;
				tmpData.prevCol = -1;
				//читаем ячейки
				if (null != tmpData.pos && null != tmpData.len) {
					var nOldPos = this.stream.GetCurPos();
					this.stream.Seek2(tmpData.pos);
					var tempCell = new AscCommonExcel.Cell(ws);
					res = this.bcr.Read1(tmpData.len, function(t, l) {
						return oThis.ReadCells(t, l, ws, tempCell, tmpData);
					});
					 this.stream.Seek2(nOldPos);
				}
            }
            else
                res = c_oSerConstants.ReadUnknown;
            return res;
        };
        this.ReadRow = function(type, length, oRow, ws, tmpData)
        {
            var res = c_oSerConstants.ReadOk;
            var oThis = this;
            if ( c_oSerRowTypes.Row == type )
            {
            	var index = this.stream.GetULongLE() - 1;
                oRow.setIndex(index);
            }
            else if ( c_oSerRowTypes.Style == type )
            {
                var xfs = this.aCellXfs[this.stream.GetULongLE()];
                if(xfs)
                    oRow.setStyle(xfs);
            }
            else if ( c_oSerRowTypes.Height == type )
            {
            	var h = this.stream.GetDoubleLE();
                oRow.setHeight(h);
                if(AscCommon.CurFileVersion < 2)
					oRow.setCustomHeight(true);
            }
            else if ( c_oSerRowTypes.CustomHeight == type )
			{
				var CustomHeight = this.stream.GetBool();
				if(CustomHeight)
					oRow.setCustomHeight(true);
			}
            else if ( c_oSerRowTypes.Hidden == type )
			{
				var hd = this.stream.GetBool();
				if(hd)
					oRow.setHidden(true);
			}
            else if ( c_oSerRowTypes.Cells == type )
            {
				//запоминам место чтобы читать Cells в конце, когда уже зачитан oRow.index
				tmpData.pos = this.stream.GetCurPos();
				tmpData.len = length;
				res = c_oSerConstants.ReadUnknown;
            }
            else
                res = c_oSerConstants.ReadUnknown;
            return res;
        };
        this.ReadCells = function(type, length, ws, tempCell, tmpData)
        {
            var res = c_oSerConstants.ReadOk;
            var oThis = this;
            if ( c_oSerRowTypes.Cell == type )
            {
				tempCell.clear();
                res = this.bcr.Read1(length, function(t,l){
                    return oThis.ReadCell(t,l, ws, tempCell, tmpData.prevRow);
                });
                if (tempCell.hasRowCol()) {
                    tmpData.prevCol = tempCell.nCol;
                } else {
                    tmpData.prevCol++;
                    tempCell.setRowCol(tmpData.prevRow, tmpData.prevCol);
                }
				tempCell.saveContent();
                if (tempCell.nCol >= ws.nColsCount) {
                    ws.nColsCount = tempCell.nCol + 1;
                }
            }
            else
                res = c_oSerConstants.ReadUnknown;
            return res;
        };
        this.ReadCell = function(type, length, ws, oCell, nRowIndex)
        {
            var res = c_oSerConstants.ReadOk;
            var oThis = this;
            if ( c_oSerCellTypes.Ref == type ){
				var oCellAddress = AscCommon.g_oCellAddressUtils.getCellAddress(this.stream.GetString2LE(length));
				oCell.setRowCol(nRowIndex, oCellAddress.getCol0());
			}
            else if ( c_oSerCellTypes.RefRowCol == type ){
				var nRow = this.stream.GetULongLE();//todo не используем можно убрать
				oCell.setRowCol(nRowIndex, this.stream.GetULongLE());
			}
            else if( c_oSerCellTypes.Style == type )
            {
                var nStyleIndex = this.stream.GetULongLE();
                if(0 != nStyleIndex)
                {
                    var xfs = this.aCellXfs[nStyleIndex];
                    if(null != xfs)
                        oCell.setStyle(xfs);
                }
            }
            else if( c_oSerCellTypes.Type == type )
            {
                switch(this.stream.GetUChar())
                {
                    case ECellTypeType.celltypeBool: oCell.setTypeInternal(CellValueType.Bool);break;
                    case ECellTypeType.celltypeError: oCell.setTypeInternal(CellValueType.Error);break;
                    case ECellTypeType.celltypeNumber: oCell.setTypeInternal(CellValueType.Number);break;
                    case ECellTypeType.celltypeSharedString: oCell.setTypeInternal(CellValueType.String);break;
                }
            }
            else if( c_oSerCellTypes.Formula == type )
            {
                var cellWithFormula = new AscCommonExcel.CCellWithFormula(ws, oCell.nRow, oCell.nCol);
				var oFormulaExt = {cell: cellWithFormula, aca: null, bx: null, ca: null, del1: null, del2: null, dt2d: null, dtr: null, r1: null, r2: null, ref: null, si: null, t: null, v: null};
                res = this.bcr.Read2Spreadsheet(length, function(t,l){
                    return oThis.ReadFormula(t,l, oFormulaExt);
                });
				ws.aFormulaExt.push(oFormulaExt);
            }
			else if (c_oSerCellTypes.Value == type) {
				var val = this.stream.GetDoubleLE();
				if (CellValueType.String == oCell.getType() || CellValueType.Error == oCell.getType()) {
					var ss = this.aSharedStrings[val];
                    if (typeof ss === 'string') {
                        oCell.setValueTextInternal(ss);
                    } else {
                        oCell.setValueMultiTextInternal(ss);
                    }
				} else {
                    oCell.setValueNumberInternal(val);
				}
            }
            else
                res = c_oSerConstants.ReadUnknown;
            return res;
        };
        this.ReadFormula = function(type, length, oFormula)
        {
            var res = c_oSerConstants.ReadOk;
            if ( c_oSerFormulaTypes.Aca == type )
                oFormula.aca = this.stream.GetBool();
            else if ( c_oSerFormulaTypes.Bx == type )
                oFormula.bx = this.stream.GetBool();
            else if ( c_oSerFormulaTypes.Ca == type )
                oFormula.ca = this.stream.GetBool();
            else if ( c_oSerFormulaTypes.Del1 == type )
                oFormula.del1 = this.stream.GetBool();
            else if ( c_oSerFormulaTypes.Del2 == type )
                oFormula.del2 = this.stream.GetBool();
            else if ( c_oSerFormulaTypes.Dt2D == type )
                oFormula.dt2d = this.stream.GetBool();
            else if ( c_oSerFormulaTypes.Dtr == type )
                oFormula.dtr = this.stream.GetBool();
            else if ( c_oSerFormulaTypes.R1 == type )
                oFormula.r1 = this.stream.GetString2LE(length);
            else if ( c_oSerFormulaTypes.R2 == type )
                oFormula.r2 = this.stream.GetString2LE(length);
            else if ( c_oSerFormulaTypes.Ref == type )
                oFormula.ref = this.stream.GetString2LE(length);
            else if ( c_oSerFormulaTypes.Si == type )
                oFormula.si = this.stream.GetULongLE();
            else if ( c_oSerFormulaTypes.T == type )
                oFormula.t = this.stream.GetUChar();
            else if ( c_oSerFormulaTypes.Text == type )
                oFormula.v = this.stream.GetString2LE(length);
            else
                res = c_oSerConstants.ReadUnknown;
            return res;
        };
        this.ReadDrawings = function(type, length, aDrawings, ws)
        {
            var res = c_oSerConstants.ReadOk;
            var oThis = this;
            if ( c_oSerWorksheetsTypes.Drawing == type )
            {
                var objectRender = new AscFormat.DrawingObjects();
                var oFlags = {from: false, to: false, pos: false, ext: false};
                var oNewDrawing = objectRender.createDrawingObject();
                res = this.bcr.Read1(length, function(t, l) {
                    return oThis.ReadDrawing(t, l, oNewDrawing, oFlags);
                });
                if(null != oNewDrawing.graphicObject)
                {
                    if(false != oFlags.from && false != oFlags.to)
                        oNewDrawing.Type = c_oAscCellAnchorType.cellanchorTwoCell;
                    else if(false != oFlags.from && false != oFlags.ext)
                        oNewDrawing.Type = c_oAscCellAnchorType.cellanchorOneCell;
                    else if(false != oFlags.pos && false != oFlags.ext)
                        oNewDrawing.Type = c_oAscCellAnchorType.cellanchorAbsolute;
                    if(oNewDrawing.graphicObject)
                    {
						//TODO при copy/paste в word из excel пропадает метод setWorksheet
						if(typeof oNewDrawing.graphicObject.setWorksheet != "undefined")
							oNewDrawing.graphicObject.setWorksheet(ws);
                    }
                    if(!oNewDrawing.graphicObject.spPr)
                    {
                        oNewDrawing.graphicObject.setSpPr(new AscFormat.CSpPr());
                        oNewDrawing.graphicObject.spPr.setParent(oNewDrawing.graphicObject);
                    }
                    if(!oNewDrawing.graphicObject.spPr.xfrm)
                    {
                        oNewDrawing.graphicObject.spPr.setXfrm(new AscFormat.CXfrm());
                        oNewDrawing.graphicObject.spPr.xfrm.setParent(oNewDrawing.graphicObject.spPr);
                        oNewDrawing.graphicObject.spPr.xfrm.setOffX(0);
                        oNewDrawing.graphicObject.spPr.xfrm.setOffY(0);
                        oNewDrawing.graphicObject.spPr.xfrm.setExtX(0);
                        oNewDrawing.graphicObject.spPr.xfrm.setExtY(0);
                    }
                    if(oNewDrawing.graphicObject.setBFromSerialize)
                    {
                        oNewDrawing.graphicObject.setBFromSerialize(true);
                    }
                    oNewDrawing.graphicObject.fromSerialize = true;
                    aDrawings.push(oNewDrawing);
                }
            }
            else
                res = c_oSerConstants.ReadUnknown;
            return res;
        };
        this.ReadDrawing = function(type, length, oDrawing, oFlags)
        {
            var res = c_oSerConstants.ReadOk;
            var oThis = this;
            if ( c_oSer_DrawingType.Type == type )
                oDrawing.Type = this.stream.GetUChar();
            else if ( c_oSer_DrawingType.From == type )
            {
                oFlags.from = true;
                res = this.bcr.Read2Spreadsheet(length, function(t,l){
                    return oThis.ReadFromTo(t,l, oDrawing.from);
                });
            }
            else if ( c_oSer_DrawingType.To == type )
            {
                oFlags.to = true;
                res = this.bcr.Read2Spreadsheet(length, function(t,l){
                    return oThis.ReadFromTo(t,l, oDrawing.to);
                });
            }
            else if ( c_oSer_DrawingType.Pos == type )
            {
                oFlags.pos = true;
                if(null == oDrawing.Pos)
                    oDrawing.Pos = {};
                res = this.bcr.Read2Spreadsheet(length, function(t,l){
                    return oThis.ReadPos(t,l, oDrawing.Pos);
                });
            }
            else if ( c_oSer_DrawingType.Ext == type )
            {
                oFlags.ext = true;
                res = this.bcr.Read2Spreadsheet(length, function(t,l){
                    return oThis.ReadExt(t,l, oDrawing.ext);
                });
            }
            else if ( c_oSer_DrawingType.Pic == type )
            {
                oDrawing.image = new Image();
                res = this.bcr.Read1(length, function(t,l){
                    //return oThis.ReadPic(t,l, oDrawing.Pic);
                    return oThis.ReadPic(t,l, oDrawing);
                });
            }
            /** proprietary begin **/
            else if ( c_oSer_DrawingType.GraphicFrame == type )
            {
                //todo удалить
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadGraphicFrame(t, l, oDrawing);
                });
            }
            /** proprietary end **/
            else if ( c_oSer_DrawingType.pptxDrawing == type )
            {

               // res = c_oSerConstants.ReadUnknown;
                var oGraphicObject = pptx_content_loader.ReadGraphicObject(this.stream, this.curWorksheet);
                if(null != oGraphicObject
                    && !((oGraphicObject.getObjectType() === AscDFH.historyitem_type_Shape || oGraphicObject.getObjectType() === AscDFH.historyitem_type_ImageShape) && !oGraphicObject.spPr)
                    && !AscCommon.IsHiddenObj(oGraphicObject))
                {
                    oDrawing.graphicObject = oGraphicObject;
					//TODO при copy/paste в word из excel пропадает метод setDrawingBase
					if(typeof oGraphicObject.setDrawingBase != "undefined")
						oGraphicObject.setDrawingBase(oDrawing);
                }
            }
            else
                res = c_oSerConstants.ReadUnknown;
            return res;
        };
        this.ReadGraphicFrame = function (type, length, oDrawing) {
            var res = c_oSerConstants.ReadOk;
            if (c_oSer_DrawingType.Chart2 == type) {
                var oNewChartSpace = new AscFormat.CChartSpace();
                var oBinaryChartReader = new AscCommon.BinaryChartReader(this.stream);
                res = oBinaryChartReader.ExternalReadCT_ChartSpace(length, oNewChartSpace, this.curWorksheet);
                oDrawing.graphicObject = oNewChartSpace;
                oNewChartSpace.setBDeleted(false);
                if(oNewChartSpace.setDrawingBase)
                {
                    oNewChartSpace.setDrawingBase(oDrawing);
                }
            }
            else
                res = c_oSerConstants.ReadUnknown;
            return res;
        };
        this.ReadFromTo = function(type, length, oFromTo)
        {
            var res = c_oSerConstants.ReadOk;
            if ( c_oSer_DrawingFromToType.Col == type )
            //oFromTo.Col = this.stream.GetULongLE();
                oFromTo.col = this.stream.GetULongLE();
            else if ( c_oSer_DrawingFromToType.ColOff == type )
            //oFromTo.ColOff = this.stream.GetDoubleLE();
                oFromTo.colOff = this.stream.GetDoubleLE();
            else if ( c_oSer_DrawingFromToType.Row == type )
            //oFromTo.Row = this.stream.GetULongLE();
                oFromTo.row = this.stream.GetULongLE();
            else if ( c_oSer_DrawingFromToType.RowOff == type )
            //oFromTo.RowOff = this.stream.GetDoubleLE();
                oFromTo.rowOff = this.stream.GetDoubleLE();
            else
                res = c_oSerConstants.ReadUnknown;
            return res;
        };
        this.ReadPos = function(type, length, oPos)
        {
            var res = c_oSerConstants.ReadOk;
            if ( c_oSer_DrawingPosType.X == type )
                oPos.X = this.stream.GetDoubleLE();
            else if ( c_oSer_DrawingPosType.Y == type )
                oPos.Y = this.stream.GetDoubleLE();
            else
                res = c_oSerConstants.ReadUnknown;
            return res;
        };
        this.ReadExt = function(type, length, oExt)
        {
            var res = c_oSerConstants.ReadOk;
            if ( c_oSer_DrawingExtType.Cx == type )
                oExt.cx = this.stream.GetDoubleLE();
            else if ( c_oSer_DrawingExtType.Cy == type )
                oExt.cy = this.stream.GetDoubleLE();
            else
                res = c_oSerConstants.ReadUnknown;
            return res;
        };
        this.ReadPic = function(type, length, oDrawing)
        {
            var res = c_oSerConstants.ReadOk;
            if ( c_oSer_DrawingType.PicSrc == type )
            {
                var nIndex = this.stream.GetULongLE();
                var src = this.oMediaArray[nIndex];
                if(null != src)
                {
                  oDrawing.image.src = src;
                  oDrawing.imageUrl = src;
                }
            }
            else
                res = c_oSerConstants.ReadUnknown;
            return res;
        };
        this.ReadComments = function(type, length, oWorksheet)
        {
            var res = c_oSerConstants.ReadOk;
            var oThis = this;
            if ( c_oSerWorksheetsTypes.Comment == type && AscCommonExcel.asc_CCommentCoords)
            {
                var oCommentCoords = new AscCommonExcel.asc_CCommentCoords();
                var aCommentData = [];
                res = this.bcr.Read2Spreadsheet(length, function(t,l){
                    return oThis.ReadComment(t,l, oCommentCoords, aCommentData);
                });
                //todo проверка
                var i;
                for(i = 0, length = aCommentData.length; i < length; ++i)
                {
					aCommentData[i].coords = oCommentCoords;

                    var elem = aCommentData[i];
                    elem.asc_putRow(oCommentCoords.nRow);
                    elem.asc_putCol(oCommentCoords.nCol);

                    if (elem.asc_getDocumentFlag()) {
                        elem.nId = "doc_" + (this.wb.aComments.length + 1);
                        this.wb.aComments.push(elem);
                    } else {
                        elem.wsId = oWorksheet.Id;
                        elem.nId = "sheet" + elem.wsId + "_" + (oWorksheet.aComments.length + 1);
                        oWorksheet.aComments.push(elem);
                    }
                }
            }
            else
                res = c_oSerConstants.ReadUnknown;
            return res;
        };
        this.ReadComment = function(type, length, oCommentCoords, aCommentData)
        {
            var res = c_oSerConstants.ReadOk;
            var oThis = this;
            if ( c_oSer_Comments.Row == type )
                oCommentCoords.nRow = this.stream.GetULongLE();
            else if ( c_oSer_Comments.Col == type )
                oCommentCoords.nCol = this.stream.GetULongLE();
            else if ( c_oSer_Comments.CommentDatas == type )
            {
                res = this.bcr.Read1(length, function(t,l){
                    return oThis.ReadCommentDatas(t,l, aCommentData);
                });
            }
            else if ( c_oSer_Comments.Left == type )
                oCommentCoords.nLeft = this.stream.GetULongLE();
            else if ( c_oSer_Comments.LeftOffset == type )
                oCommentCoords.nLeftOffset = this.stream.GetULongLE();
            else if ( c_oSer_Comments.Top == type )
                oCommentCoords.nTop = this.stream.GetULongLE();
            else if ( c_oSer_Comments.TopOffset == type )
                oCommentCoords.nTopOffset = this.stream.GetULongLE();
            else if ( c_oSer_Comments.Right == type )
                oCommentCoords.nRight = this.stream.GetULongLE();
            else if ( c_oSer_Comments.RightOffset == type )
                oCommentCoords.nRightOffset = this.stream.GetULongLE();
            else if ( c_oSer_Comments.Bottom == type )
                oCommentCoords.nBottom = this.stream.GetULongLE();
            else if ( c_oSer_Comments.BottomOffset == type )
                oCommentCoords.nBottomOffset = this.stream.GetULongLE();
            else if ( c_oSer_Comments.LeftMM == type )
                oCommentCoords.dLeftMM = this.stream.GetDoubleLE();
            else if ( c_oSer_Comments.TopMM == type )
                oCommentCoords.dTopMM = this.stream.GetDoubleLE();
            else if ( c_oSer_Comments.WidthMM == type )
                oCommentCoords.dWidthMM = this.stream.GetDoubleLE();
            else if ( c_oSer_Comments.HeightMM == type )
                oCommentCoords.dHeightMM = this.stream.GetDoubleLE();
            else if ( c_oSer_Comments.MoveWithCells == type )
                oCommentCoords.bMoveWithCells = this.stream.GetBool();
            else if ( c_oSer_Comments.SizeWithCells == type )
                oCommentCoords.bSizeWithCells = this.stream.GetBool();
            else
                res = c_oSerConstants.ReadUnknown;
            return res;
        };
        this.ReadCommentDatas = function(type, length, aCommentData)
        {
            var res = c_oSerConstants.ReadOk;
            var oThis = this;
            if ( c_oSer_Comments.CommentData === type )
            {
                var oCommentData = new Asc.asc_CCommentData();
                oCommentData.asc_putDocumentFlag(false);
                res = this.bcr.Read1(length, function(t,l){
                    return oThis.ReadCommentData(t,l,oCommentData);
                });
                aCommentData.push(oCommentData);
            }
            else
                res = c_oSerConstants.ReadUnknown;
            return res;
        };
        this.ReadCommentData = function(type, length, oCommentData)
        {
            var res = c_oSerConstants.ReadOk;
            var oThis = this;
            if ( c_oSer_CommentData.Text == type )
                oCommentData.asc_putText(this.stream.GetString2LE(length));
            else if ( c_oSer_CommentData.Time == type )
            {
                var oDate = this.Iso8601ToDate(this.stream.GetString2LE(length));
                if(null != oDate)
                    oCommentData.asc_putTime(oDate.getTime() + "");
            }
            else if ( c_oSer_CommentData.OOTime == type )
            {
                var oDate = this.Iso8601ToDate(this.stream.GetString2LE(length));
                if(null != oDate)
                    oCommentData.asc_putOnlyOfficeTime(oDate.getTime() + "");
            }
            else if ( c_oSer_CommentData.UserId == type )
                oCommentData.asc_putUserId(this.stream.GetString2LE(length));
            else if ( c_oSer_CommentData.UserName == type )
                oCommentData.asc_putUserName(this.stream.GetString2LE(length));
            else if ( c_oSer_CommentData.QuoteText == type )
                oCommentData.asc_putQuoteText(this.stream.GetString2LE(length));
            else if ( c_oSer_CommentData.Replies == type )
            {
                res = this.bcr.Read1(length, function(t,l){
                    return oThis.ReadReplies(t,l, oCommentData);
                });
            }
            else if ( c_oSer_CommentData.Solved == type )
                oCommentData.asc_putSolved(this.stream.GetBool());
            else if ( c_oSer_CommentData.Document == type )
                oCommentData.asc_putDocumentFlag(this.stream.GetBool());
            else
                res = c_oSerConstants.ReadUnknown;
            return res;
        };
        this.ReadConditionalFormatting = function (type, length, oConditionalFormatting) {
            var res = c_oSerConstants.ReadOk;
            var oThis = this;
            var oConditionalFormattingRule = null;
            if (c_oSer_ConditionalFormatting.Pivot === type)
                oConditionalFormatting.pivot = this.stream.GetBool();
            else if (c_oSer_ConditionalFormatting.SqRef === type) {
                oConditionalFormatting.setSqref(this.stream.GetString2LE(length));
            }
            else if (c_oSer_ConditionalFormatting.ConditionalFormattingRule === type) {
                oConditionalFormattingRule = new AscCommonExcel.CConditionalFormattingRule();
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadConditionalFormattingRule(t, l, oConditionalFormattingRule);
                });
                oConditionalFormatting.aRules.push(oConditionalFormattingRule);
            }
            else
                res = c_oSerConstants.ReadUnknown;
            return res;
        };
        this.ReadConditionalFormattingRule = function (type, length, oConditionalFormattingRule) {
            var res = c_oSerConstants.ReadOk;
            var oThis = this;
            var oConditionalFormattingRuleElement = null;

            if (c_oSer_ConditionalFormattingRule.AboveAverage === type)
                oConditionalFormattingRule.aboveAverage = this.stream.GetBool();
            else if (c_oSer_ConditionalFormattingRule.Bottom === type)
                oConditionalFormattingRule.bottom = this.stream.GetBool();
            else if (c_oSer_ConditionalFormattingRule.DxfId === type)
            {
                var DxfId = this.stream.GetULongLE();
                oConditionalFormattingRule.dxf = this.Dxfs[DxfId];
            }
            else if (c_oSer_ConditionalFormattingRule.EqualAverage === type)
                oConditionalFormattingRule.equalAverage = this.stream.GetBool();
            else if (c_oSer_ConditionalFormattingRule.Operator === type)
                oConditionalFormattingRule.operator = this.stream.GetUChar();
            else if (c_oSer_ConditionalFormattingRule.Percent === type)
                oConditionalFormattingRule.percent = this.stream.GetBool();
            else if (c_oSer_ConditionalFormattingRule.Priority === type)
                oConditionalFormattingRule.priority = this.stream.GetULongLE();
            else if (c_oSer_ConditionalFormattingRule.Rank === type)
                oConditionalFormattingRule.rank = this.stream.GetULongLE();
            else if (c_oSer_ConditionalFormattingRule.StdDev === type)
                oConditionalFormattingRule.stdDev = this.stream.GetULongLE();
            else if (c_oSer_ConditionalFormattingRule.StopIfTrue === type)
                oConditionalFormattingRule.stopIfTrue = this.stream.GetBool();
            else if (c_oSer_ConditionalFormattingRule.Text === type)
                oConditionalFormattingRule.text = this.stream.GetString2LE(length);
            else if (c_oSer_ConditionalFormattingRule.TimePeriod === type)
                oConditionalFormattingRule.timePeriod = this.stream.GetString2LE(length);
            else if (c_oSer_ConditionalFormattingRule.Type === type)
                oConditionalFormattingRule.type = this.stream.GetUChar();
            else if (c_oSer_ConditionalFormattingRule.ColorScale === type) {
                oConditionalFormattingRuleElement = new AscCommonExcel.CColorScale();
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadColorScale(t, l, oConditionalFormattingRuleElement);
                });
                oConditionalFormattingRule.aRuleElements.push(oConditionalFormattingRuleElement);
            } else if (c_oSer_ConditionalFormattingRule.DataBar === type) {
                oConditionalFormattingRuleElement = new AscCommonExcel.CDataBar();
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadDataBar(t, l, oConditionalFormattingRuleElement);
                });
                oConditionalFormattingRule.aRuleElements.push(oConditionalFormattingRuleElement);
            } else if (c_oSer_ConditionalFormattingRule.FormulaCF === type) {
                oConditionalFormattingRuleElement = new AscCommonExcel.CFormulaCF();
                oConditionalFormattingRuleElement.Text = this.stream.GetString2LE(length);
                oConditionalFormattingRule.aRuleElements.push(oConditionalFormattingRuleElement);
            } else if (c_oSer_ConditionalFormattingRule.IconSet === type) {
                oConditionalFormattingRuleElement = new AscCommonExcel.CIconSet();
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadIconSet(t, l, oConditionalFormattingRuleElement);
                });
                oConditionalFormattingRule.aRuleElements.push(oConditionalFormattingRuleElement);
            } else
                res = c_oSerConstants.ReadUnknown;
            return res;
        };
        this.ReadColorScale = function (type, length, oColorScale) {
            var res = c_oSerConstants.ReadOk;
            var oThis = this;
            var oObject = null;
            if (c_oSer_ConditionalFormattingRuleColorScale.CFVO === type) {
                oObject = new AscCommonExcel.CConditionalFormatValueObject();
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadCFVO(t, l, oObject);
                });
                oColorScale.aCFVOs.push(oObject);
            } else if (c_oSer_ConditionalFormattingRuleColorScale.Color === type) {
				var color = ReadColorSpreadsheet2(this.bcr, length);
				if (null != color) {
					oColorScale.aColors.push(color);
				}
            } else
                res = c_oSerConstants.ReadUnknown;
            return res;
        };
        this.ReadDataBar = function (type, length, oDataBar) {
            var res = c_oSerConstants.ReadOk;
            var oThis = this;
            var oObject = null;
            if (c_oSer_ConditionalFormattingDataBar.MaxLength === type)
                oDataBar.MaxLength = this.stream.GetULongLE();
            else if (c_oSer_ConditionalFormattingDataBar.MinLength === type)
                oDataBar.MinLength = this.stream.GetULongLE();
            else if (c_oSer_ConditionalFormattingDataBar.ShowValue === type)
                oDataBar.ShowValue = this.stream.GetBool();
            else if (c_oSer_ConditionalFormattingDataBar.Color === type) {
				var color = ReadColorSpreadsheet2(this.bcr, length);
				if (color) {
					oDataBar.Color = color;
				}
            } else if (c_oSer_ConditionalFormattingDataBar.CFVO === type) {
                oObject = new AscCommonExcel.CConditionalFormatValueObject();
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadCFVO(t, l, oObject);
                });
                oDataBar.aCFVOs.push(oObject);
            } else
                res = c_oSerConstants.ReadUnknown;
            return res;
        };
        this.ReadIconSet = function (type, length, oIconSet) {
            var res = c_oSerConstants.ReadOk;
            var oThis = this;
            var oObject = null;
            if (c_oSer_ConditionalFormattingIconSet.IconSet === type)
                oIconSet.IconSet = this.stream.GetUChar();
            else if (c_oSer_ConditionalFormattingIconSet.Percent === type)
                oIconSet.Percent = this.stream.GetBool();
            else if (c_oSer_ConditionalFormattingIconSet.Reverse === type)
                oIconSet.Reverse = this.stream.GetBool();
            else if (c_oSer_ConditionalFormattingIconSet.ShowValue === type)
                oIconSet.ShowValue = this.stream.GetBool();
            else if (c_oSer_ConditionalFormattingIconSet.CFVO === type) {
                oObject = new AscCommonExcel.CConditionalFormatValueObject();
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadCFVO(t, l, oObject);
                });
                oIconSet.aCFVOs.push(oObject);
            } else
                res = c_oSerConstants.ReadUnknown;
            return res;
        };
        this.ReadCFVO = function (type, length, oCFVO) {
            var res = c_oSerConstants.ReadOk;
            if (c_oSer_ConditionalFormattingValueObject.Gte === type)
                oCFVO.Gte = this.stream.GetBool();
            else if (c_oSer_ConditionalFormattingValueObject.Type === type)
                oCFVO.Type = this.stream.GetUChar();
            else if (c_oSer_ConditionalFormattingValueObject.Val === type)
                oCFVO.Val = this.stream.GetString2LE(length);
            else
                res = c_oSerConstants.ReadUnknown;
            return res;
        };
        this.ReadSheetViews = function (type, length, aSheetViews) {
            var res = c_oSerConstants.ReadOk;
            var oThis = this;
            var oSheetView = null;

            if (c_oSerWorksheetsTypes.SheetView === type) {
                oSheetView = new AscCommonExcel.asc_CSheetViewSettings();
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadSheetView(t, l, oSheetView);
                });
                aSheetViews.push(oSheetView);
            }
            else
                res = c_oSerConstants.ReadUnknown;
            return res;
        };
        this.ReadSheetView = function (type, length, oSheetView) {
            var oThis = this;
            var res = c_oSerConstants.ReadOk;
			if (c_oSer_SheetView.ColorId === type) {
				this.stream.GetLong();
			} else if (c_oSer_SheetView.DefaultGridColor === type) {
				this.stream.GetBool();
			} else if (c_oSer_SheetView.RightToLeft === type) {
				this.stream.GetBool();
			} else if (c_oSer_SheetView.ShowFormulas === type) {
				this.stream.GetBool();
			} else if (c_oSer_SheetView.ShowGridLines === type) {
				oSheetView.showGridLines = this.stream.GetBool();
			} else if (c_oSer_SheetView.ShowOutlineSymbols === type) {
				this.stream.GetBool();
			} else if (c_oSer_SheetView.ShowRowColHeaders === type) {
				oSheetView.showRowColHeaders = this.stream.GetBool();
			} else if (c_oSer_SheetView.ShowRuler === type) {
				this.stream.GetBool();
			} else if (c_oSer_SheetView.ShowWhiteSpace === type) {
				this.stream.GetBool();
			} else if (c_oSer_SheetView.ShowZeros === type) {
				this.stream.GetBool();
			} else if (c_oSer_SheetView.TabSelected === type) {
				this.stream.GetBool();
			} else if (c_oSer_SheetView.TopLeftCell === type) {
				this.stream.GetString2LE(length);
			} else if (c_oSer_SheetView.View === type) {
				this.stream.GetUChar();
			} else if (c_oSer_SheetView.WindowProtection === type) {
				this.stream.GetBool();
			} else if (c_oSer_SheetView.WorkbookViewId === type) {
				this.stream.GetLong();
			} else if (c_oSer_SheetView.ZoomScale === type) {
				oSheetView.asc_setZoomScale(this.stream.GetLong());
			} else if (c_oSer_SheetView.ZoomScaleNormal === type) {
				this.stream.GetLong();
			} else if (c_oSer_SheetView.ZoomScalePageLayoutView === type) {
				this.stream.GetLong();
			} else if (c_oSer_SheetView.ZoomScaleSheetLayoutView === type) {
				this.stream.GetLong();
            } else if (c_oSer_SheetView.Pane === type) {
                oSheetView.pane = new AscCommonExcel.asc_CPane();
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadPane(t, l, oSheetView.pane);
                });
                oSheetView.pane.init();
			} else if (c_oSer_SheetView.Selection === type) {
				this.curWorksheet.selectionRange.clean();
				res = this.bcr.Read1(length, function (t, l) {
					return oThis.ReadSelection(t, l, oThis.curWorksheet.selectionRange);
				});
				this.curWorksheet.selectionRange.update();
            } else
                res = c_oSerConstants.ReadUnknown;
            return res;
        };
        this.ReadPane = function (type, length, oPane) {
            var res = c_oSerConstants.ReadOk;
			if (c_oSer_Pane.ActivePane === type)
				this.stream.GetUChar();
			else if (c_oSer_Pane.State === type)
				oPane.state = this.stream.GetString2LE(length);
            else if (c_oSer_Pane.TopLeftCell === type)
				oPane.topLeftCell = this.stream.GetString2LE(length);
			else if (c_oSer_Pane.XSplit === type)
				oPane.xSplit = this.stream.GetDoubleLE();
			else if (c_oSer_Pane.YSplit === type)
				oPane.ySplit = this.stream.GetDoubleLE();
            else
                res = c_oSerConstants.ReadUnknown;
            return res;
        };
		this.ReadSelection = function (type, length, selectionRange) {
			var res = c_oSerConstants.ReadOk;
			if (c_oSer_Selection.ActiveCell === type) {
				var activeCell = AscCommonExcel.g_oRangeCache.getAscRange(this.stream.GetString2LE(length));
				if (activeCell) {
					selectionRange.activeCell = new AscCommon.CellBase(activeCell.r1, activeCell.c1);
				}
			} else if (c_oSer_Selection.ActiveCellId === type) {
				selectionRange.activeCellId = this.stream.GetLong();
			} else if (c_oSer_Selection.Sqref === type) {
				var sqref = this.stream.GetString2LE(length);
				var selectionNew = AscCommonExcel.g_oRangeCache.getActiveRangesFromSqRef(sqref);
				if (selectionNew.length > 0) {
					selectionRange.ranges = selectionNew;
				}
			} else if (c_oSer_Selection.Pane === type) {
				this.stream.GetUChar();
			} else
				res = c_oSerConstants.ReadUnknown;
			return res;
		};
        this.ReadSheetPr = function (type, length, oSheetPr) {
            var oThis = this;
            var res = c_oSerConstants.ReadOk;
            if (c_oSer_SheetPr.CodeName === type)
                oSheetPr.CodeName = this.stream.GetString2LE(length);
            else if (c_oSer_SheetPr.EnableFormatConditionsCalculation === type)
                oSheetPr.EnableFormatConditionsCalculation = this.stream.GetBool();
            else if (c_oSer_SheetPr.FilterMode === type)
                oSheetPr.FilterMode = this.stream.GetBool();
            else if (c_oSer_SheetPr.Published === type)
                oSheetPr.Published = this.stream.GetBool();
            else if (c_oSer_SheetPr.SyncHorizontal === type)
                oSheetPr.SyncHorizontal = this.stream.GetBool();
            else if (c_oSer_SheetPr.SyncRef === type)
                oSheetPr.SyncRef = this.stream.GetString2LE(length);
            else if (c_oSer_SheetPr.SyncVertical === type)
                oSheetPr.SyncVertical = this.stream.GetBool();
            else if (c_oSer_SheetPr.TransitionEntry === type)
                oSheetPr.TransitionEntry = this.stream.GetBool();
            else if (c_oSer_SheetPr.TransitionEvaluation === type)
                oSheetPr.TransitionEvaluation = this.stream.GetBool();
            else if (c_oSer_SheetPr.TabColor === type) {
				var color = ReadColorSpreadsheet2(this.bcr, length);
				if (color) {
					oSheetPr.TabColor = color;
				}
            } else
                res = c_oSerConstants.ReadUnknown;

            return res;
        };
		this.ReadSparklineGroups = function (type, length, oWorksheet) {
            var oThis = this;
            var res = c_oSerConstants.ReadOk;
            if (c_oSer_Sparkline.SparklineGroup === type) {
				var newSparklineGroup = new AscCommonExcel.sparklineGroup(true);
                newSparklineGroup.setWorksheet(oWorksheet);
				res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadSparklineGroup(t, l, newSparklineGroup);
                });
                oWorksheet.aSparklineGroups.push(newSparklineGroup);
			} else
                res = c_oSerConstants.ReadUnknown;
            return res;
        };
		this.ReadSparklineGroup = function (type, length, oSparklineGroup) {
            var oThis = this;
            var res = c_oSerConstants.ReadOk;
            if (c_oSer_Sparkline.ManualMax === type) {
				oSparklineGroup.manualMax = this.stream.GetDoubleLE();
			} else if (c_oSer_Sparkline.ManualMin === type) {
				oSparklineGroup.manualMin = this.stream.GetDoubleLE();
			} else if (c_oSer_Sparkline.LineWeight === type) {
				oSparklineGroup.lineWeight = this.stream.GetDoubleLE();
			} else if (c_oSer_Sparkline.Type === type) {
				oSparklineGroup.type = this.stream.GetUChar();
			} else if (c_oSer_Sparkline.DateAxis === type) {
				oSparklineGroup.dateAxis = this.stream.GetBool();
			} else if (c_oSer_Sparkline.DisplayEmptyCellsAs === type) {
				oSparklineGroup.displayEmptyCellsAs = this.stream.GetUChar();
			} else if (c_oSer_Sparkline.Markers === type) {
				oSparklineGroup.markers = this.stream.GetBool();
			} else if (c_oSer_Sparkline.High === type) {
				oSparklineGroup.high = this.stream.GetBool();
			} else if (c_oSer_Sparkline.Low === type) {
				oSparklineGroup.low = this.stream.GetBool();
			} else if (c_oSer_Sparkline.First === type) {
				oSparklineGroup.first = this.stream.GetBool();
			} else if (c_oSer_Sparkline.Last === type) {
				oSparklineGroup.last = this.stream.GetBool();
			} else if (c_oSer_Sparkline.Negative === type) {
				oSparklineGroup.negative = this.stream.GetBool();
			} else if (c_oSer_Sparkline.DisplayXAxis === type) {
				oSparklineGroup.displayXAxis = this.stream.GetBool();
			} else if (c_oSer_Sparkline.DisplayHidden === type) {
				oSparklineGroup.displayHidden = this.stream.GetBool();
			} else if (c_oSer_Sparkline.MinAxisType === type) {
				oSparklineGroup.minAxisType = this.stream.GetUChar();
			} else if (c_oSer_Sparkline.MaxAxisType === type) {
				oSparklineGroup.maxAxisType = this.stream.GetUChar();
			} else if (c_oSer_Sparkline.RightToLeft === type) {
				oSparklineGroup.rightToLeft = this.stream.GetBool();
			} else if (c_oSer_Sparkline.ColorSeries === type) {
				oSparklineGroup.colorSeries = ReadColorSpreadsheet2(this.bcr, length);
			} else if (c_oSer_Sparkline.ColorNegative === type) {
				oSparklineGroup.colorNegative = ReadColorSpreadsheet2(this.bcr, length);
			} else if (c_oSer_Sparkline.ColorAxis === type) {
				oSparklineGroup.colorAxis = ReadColorSpreadsheet2(this.bcr, length);
			} else if (c_oSer_Sparkline.ColorMarkers === type) {
				oSparklineGroup.colorMarkers = ReadColorSpreadsheet2(this.bcr, length);
			} else if (c_oSer_Sparkline.ColorFirst === type) {
				oSparklineGroup.colorFirst = ReadColorSpreadsheet2(this.bcr, length);
			} else if (c_oSer_Sparkline.ColorLast === type) {
				oSparklineGroup.colorLast = ReadColorSpreadsheet2(this.bcr, length);
			} else if (c_oSer_Sparkline.ColorHigh === type) {
				oSparklineGroup.colorHigh = ReadColorSpreadsheet2(this.bcr, length);
			} else if (c_oSer_Sparkline.ColorLow === type) {
				oSparklineGroup.colorLow = ReadColorSpreadsheet2(this.bcr, length);
			} else if (c_oSer_Sparkline.Ref === type) {
				oSparklineGroup.f = this.stream.GetString2LE(length);
			} else if (c_oSer_Sparkline.Sparklines === type) {
				res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadSparklines(t, l, oSparklineGroup);
                });
			} else
                res = c_oSerConstants.ReadUnknown;
            return res;
        };
		this.ReadSparklines = function (type, length, oSparklineGroup) {
            var oThis = this;
            var res = c_oSerConstants.ReadOk;
            if (c_oSer_Sparkline.Sparkline === type) {
				var newSparkline = new AscCommonExcel.sparkline();
				res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadSparkline(t, l, newSparkline);
                });
				oSparklineGroup.arrSparklines.push(newSparkline);
			} else
                res = c_oSerConstants.ReadUnknown;
            return res;
        };
		this.ReadSparkline = function (type, length, oSparkline) {
            var res = c_oSerConstants.ReadOk;
            if (c_oSer_Sparkline.SparklineRef === type) {
				oSparkline.setF(this.stream.GetString2LE(length));
			} else if (c_oSer_Sparkline.SparklineSqRef === type) {
				oSparkline.setSqref(this.stream.GetString2LE(length));
			} else
                res = c_oSerConstants.ReadUnknown;
            return res;
        };
        this.Iso8601ToDate = function(sDate)
        {
            var numericKeys = [ 1, 4, 5, 6, 7, 10, 11 ];
            var minutesOffset = 0;
            var struct;
            if ((struct = /^(\d{4}|[+\-]\d{6})(?:-(\d{2})(?:-(\d{2}))?)?(?:T(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{3}))?)?(?:(Z)|([+\-])(\d{2})(?::(\d{2}))?)?)?$/.exec(sDate))) {
                // avoid NaN timestamps caused by “undefined” values being passed to Date.UTC
                for (var i = 0, k; (k = numericKeys[i]); ++i) {
                    struct[k] = +struct[k] || 0;
                }

                // allow undefined days and months
                struct[2] = (+struct[2] || 1) - 1;
                struct[3] = +struct[3] || 1;

                if (struct[8] !== 'Z' && struct[9] !== undefined) {
                    minutesOffset = struct[10] * 60 + struct[11];

                    if (struct[9] === '+') {
                        minutesOffset = 0 - minutesOffset;
                    }
                }

                return new Date(Date.UTC(struct[1], struct[2], struct[3], struct[4], struct[5] + minutesOffset, struct[6], struct[7]));
            }
            return null;
        };
        this.ReadReplies = function(type, length, oCommentData)
        {
            var res = c_oSerConstants.ReadOk;
            var oThis = this;
            if ( c_oSer_CommentData.Reply === type )
            {
                var oReplyData = new Asc.asc_CCommentData();
                oReplyData.asc_putDocumentFlag(false);
                res = this.bcr.Read1(length, function(t,l){
                    return oThis.ReadCommentData(t,l,oReplyData);
                });
                oCommentData.aReplies.push(oReplyData);
            }
            else
                res = c_oSerConstants.ReadUnknown;
            return res;
        };
    }
    /** @constructor */
    function Binary_CalcChainTableReader(stream, aCalcChain)
    {
        this.stream = stream;
        this.aCalcChain = aCalcChain;
        this.bcr = new Binary_CommonReader(this.stream);
        this.Read = function()
        {
            var oThis = this;
            return this.bcr.ReadTable(function(t, l){
                return oThis.ReadCalcChainContent(t,l);
            });
        };
        this.ReadCalcChainContent = function(type, length)
        {
            var res = c_oSerConstants.ReadOk;
            var oThis = this;
            if ( c_oSer_CalcChainType.CalcChainItem === type )
            {
                var oNewCalcChain = {};
                res = this.bcr.Read2Spreadsheet(length, function(t,l){
                    return oThis.ReadCalcChain(t,l, oNewCalcChain);
                });
                this.aCalcChain.push(oNewCalcChain);
            }
            else
                res = c_oSerConstants.ReadUnknown;
            return res;
        };
        this.ReadCalcChain = function(type, length, oCalcChain)
        {
            var res = c_oSerConstants.ReadOk;
            if ( c_oSer_CalcChainType.Array == type )
                oCalcChain.Array = this.stream.GetBool();
            else if ( c_oSer_CalcChainType.SheetId == type )
                oCalcChain.SheetId = this.stream.GetULongLE();
            else if ( c_oSer_CalcChainType.DependencyLevel == type )
                oCalcChain.DependencyLevel = this.stream.GetBool();
            else if ( c_oSer_CalcChainType.Ref == type )
                oCalcChain.Ref = this.stream.GetString2LE(length);
            else if ( c_oSer_CalcChainType.ChildChain == type )
                oCalcChain.ChildChain = this.stream.GetBool();
            else if ( c_oSer_CalcChainType.NewThread == type )
                oCalcChain.NewThread = this.stream.GetBool();
            else
                res = c_oSerConstants.ReadUnknown;
            return res;
        };
    }
    /** @constructor */
    function Binary_OtherTableReader(stream, oMedia, wb)
    {
        this.stream = stream;
        this.oMedia = oMedia;
        this.wb = wb;
        this.bcr = new Binary_CommonReader(this.stream);
        this.Read = function()
        {
            var oThis = this;
            var oRes = this.bcr.ReadTable(function(t, l){
                return oThis.ReadOtherContent(t,l);
            });
            this.wb.clrSchemeMap = AscFormat.GenerateDefaultColorMap();
            if(null == this.wb.theme)
                this.wb.theme = AscFormat.GenerateDefaultTheme(this.wb, 'Calibri');

            Asc.getBinaryOtherTableGVar(this.wb);

            return oRes;
        };
        this.ReadOtherContent = function(type, length)
        {
            var res = c_oSerConstants.ReadOk;
            var oThis = this;
            if ( c_oSer_OtherType.Media === type )
            {
                res = this.bcr.Read1(length, function(t,l){
                    return oThis.ReadMediaContent(t,l);
                });
            }
            else if ( c_oSer_OtherType.Theme === type )
            {
                this.wb.theme = pptx_content_loader.ReadTheme(this, this.stream);
                res = c_oSerConstants.ReadUnknown;
            }
            else
                res = c_oSerConstants.ReadUnknown;
            return res;
        };
        this.ReadMediaContent = function(type, length)
        {
            var res = c_oSerConstants.ReadOk;
            var oThis = this;
            if ( c_oSer_OtherType.MediaItem === type )
            {
                var oNewMedia = {};
                res = this.bcr.Read1(length, function(t,l){
                    return oThis.ReadMediaItem(t,l, oNewMedia);
                });
                if(null != oNewMedia.id && null != oNewMedia.src)
                    this.oMedia[oNewMedia.id] = oNewMedia.src;
            }
            else
                res = c_oSerConstants.ReadUnknown;
            return res;
        };
        this.ReadMediaItem = function(type, length, oNewMedia)
        {
            var res = c_oSerConstants.ReadOk;
            if ( c_oSer_OtherType.MediaSrc === type )
            {
                var src = this.stream.GetString2LE(length);
                if(0 != src.indexOf("http:") && 0 != src.indexOf("data:") && 0 != src.indexOf("https:") && 0 != src.indexOf("ftp:") && 0 != src.indexOf("file:"))
                    oNewMedia.src = AscCommon.g_oDocumentUrls.getImageUrl(src);
                else
                    oNewMedia.src = src;
            }
            else if ( c_oSer_OtherType.MediaId === type )
                oNewMedia.id = this.stream.GetULongLE();
            else
                res = c_oSerConstants.ReadUnknown;
            return res;
        };
    }

    function getBinaryOtherTableGVar(wb)
    {
        AscCommonExcel.g_oColorManager.setTheme(wb.theme);

        var sMinorFont = null;
        if(null != wb.theme.themeElements && null != wb.theme.themeElements.fontScheme && null != wb.theme.themeElements.fontScheme.minorFont)
            sMinorFont = wb.theme.themeElements.fontScheme.minorFont.latin;
        var sDefFont = "Calibri";
        if(null != sMinorFont && "" != sMinorFont)
            sDefFont = sMinorFont;
        g_oDefaultFormat.Font = new AscCommonExcel.Font();
		g_oDefaultFormat.Font.assignFromObject({
		    fn: sDefFont,
            scheme: EFontScheme.fontschemeMinor,
			fs: 11,
			c: AscCommonExcel.g_oColorManager.getThemeColor(AscCommonExcel.g_nColorTextDefault)
		});
        g_oDefaultFormat.Fill = g_oDefaultFormat.FillAbs = new AscCommonExcel.Fill({bg : null});
        g_oDefaultFormat.Border = g_oDefaultFormat.BorderAbs = new AscCommonExcel.Border({
            l : new AscCommonExcel.BorderProp(),
            t : new AscCommonExcel.BorderProp(),
            r : new AscCommonExcel.BorderProp(),
            b : new AscCommonExcel.BorderProp(),
            d : new AscCommonExcel.BorderProp(),
            ih : new AscCommonExcel.BorderProp(),
            iv : new AscCommonExcel.BorderProp(),
            dd : false,
            du : false
        });
        g_oDefaultFormat.Num = g_oDefaultFormat.NumAbs = new AscCommonExcel.Num({f : "General"});
        g_oDefaultFormat.Align = g_oDefaultFormat.AlignAbs = new AscCommonExcel.Align({
            hor : null,
            indent : 0,
            RelativeIndent : 0,
            shrink : false,
            angle : 0,
            ver : Asc.c_oAscVAlign.Bottom,
            wrap : false
        });
    }


    /** @constructor */
    function BinaryFileReader(isCopyPaste)
    {
        this.stream = null;
        this.copyPasteObj =
        {
            isCopyPaste: isCopyPaste,
            activeRange: null
        };
        this.oReadResult = {
            tableCustomFunc: []
        };
        this.getbase64DecodedData = function(szSrc)
        {
			var isBase64 = typeof szSrc === 'string';
			var srcLen = szSrc.length;
			var nWritten = 0;
			
            var nType = 0;
            var index = AscCommon.c_oSerFormat.Signature.length;
            var version = "";
            var dst_len = "";
            while (true)
            {
                index++;
                var _c = isBase64 ? szSrc.charCodeAt(index) : szSrc[index];
                if (_c == ";".charCodeAt(0))
                {

                    if(0 == nType)
                    {
                        nType = 1;
                        continue;
                    }
                    else
                    {
                        index++;
                        break;
                    }
                }
                if(0 == nType)
                    version += String.fromCharCode(_c);
                else
                    dst_len += String.fromCharCode(_c);
            }
			var nVersion = 0;
			if(version.length > 1)
			{
				var nTempVersion = version.substring(1) - 0;
				if(nTempVersion)
					AscCommon.CurFileVersion = nVersion = nTempVersion;
			}
			var stream;
			if (Asc.c_nVersionNoBase64 !== nVersion) {
				var dstLen = parseInt(dst_len);

				var pointer = g_memory.Alloc(dstLen);
				stream = new AscCommon.FT_Stream2(pointer.data, dstLen);
				stream.obj = pointer.obj;

				var dstPx = stream.data;

				if (window.chrome)
				{
					while (index < srcLen)
					{
						var dwCurr = 0;
						var i;
						var nBits = 0;
						for (i=0; i<4; i++)
						{
							if (index >= srcLen)
								break;
							var nCh = DecodeBase64Char(isBase64 ? szSrc.charCodeAt(index++) : szSrc[index++]);
							if (nCh == -1)
							{
								i--;
								continue;
							}
							dwCurr <<= 6;
							dwCurr |= nCh;
							nBits += 6;
						}

						dwCurr <<= 24-nBits;
						for (i=0; i<nBits/8; i++)
						{
							dstPx[nWritten++] = ((dwCurr & 0x00ff0000) >>> 16);
							dwCurr <<= 8;
						}
					}
				}
				else
				{
					var p = b64_decode;
					while (index < srcLen)
					{
						var dwCurr = 0;
						var i;
						var nBits = 0;
						for (i=0; i<4; i++)
						{
							if (index >= srcLen)
								break;
							var nCh = p[isBase64 ? szSrc.charCodeAt(index++) : szSrc[index++]];
							if (nCh == undefined)
							{
								i--;
								continue;
							}
							dwCurr <<= 6;
							dwCurr |= nCh;
							nBits += 6;
						}

						dwCurr <<= 24-nBits;
						for (i=0; i<nBits/8; i++)
						{
							dstPx[nWritten++] = ((dwCurr & 0x00ff0000) >>> 16);
							dwCurr <<= 8;
						}
					}
				}
			} else {
				stream = new AscCommon.FT_Stream2(szSrc, szSrc.length);
				//skip header
				stream.EnterFrame(index);
				stream.Seek(index);
			}

            return stream;
        };
        this.getbase64DecodedData2 = function(szSrc, szSrcOffset, stream, streamOffset)
        {
            var srcLen = szSrc.length;
            var nWritten = streamOffset;
            var dstPx = stream.data;
            var index = szSrcOffset;

            if (window.chrome)
            {
                while (index < srcLen)
                {
                    var dwCurr = 0;
                    var i;
                    var nBits = 0;
                    for (i=0; i<4; i++)
                    {
                        if (index >= srcLen)
                            break;
                        var nCh = DecodeBase64Char(szSrc.charCodeAt(index++));
                        if (nCh == -1)
                        {
                            i--;
                            continue;
                        }
                        dwCurr <<= 6;
                        dwCurr |= nCh;
                        nBits += 6;
                    }

                    dwCurr <<= 24-nBits;
                    var nLen = (nBits/8) | 0;
                    for (i=0; i<nLen; i++)
                    {
                        dstPx[nWritten++] = ((dwCurr & 0x00ff0000) >>> 16);
                        dwCurr <<= 8;
                    }
                }
            }
            else
            {
                var p = b64_decode;
                while (index < srcLen)
                {
                    var dwCurr = 0;
                    var i;
                    var nBits = 0;
                    for (i=0; i<4; i++)
                    {
                        if (index >= srcLen)
                            break;
                        var nCh = p[szSrc.charCodeAt(index++)];
                        if (nCh == undefined)
                        {
                            i--;
                            continue;
                        }
                        dwCurr <<= 6;
                        dwCurr |= nCh;
                        nBits += 6;
                    }

                    dwCurr <<= 24-nBits;
                    var nLen = (nBits/8) | 0;
                    for (i=0; i<nLen; i++)
                    {
                        dstPx[nWritten++] = ((dwCurr & 0x00ff0000) >>> 16);
                        dwCurr <<= 8;
                    }
                }
            }
            return nWritten;
        };
        this.Read = function(data, wb)
        {
            pptx_content_loader.Clear();
			var pasteBinaryFromExcel = false;
			if(this.copyPasteObj && this.copyPasteObj.isCopyPaste && typeof editor != "undefined" && editor)
				pasteBinaryFromExcel = true;
			
			this.stream = this.getbase64DecodedData(data);
			if(!pasteBinaryFromExcel)
				History.TurnOff();
            this.ReadFile(wb);

            if(!this.copyPasteObj.isCopyPaste)
            {
                ReadDefCellStyles(wb, wb.CellStyles.DefaultStyles);
                // ReadDefTableStyles(wb, wb.TableStyles.DefaultStyles);
                // wb.TableStyles.concatStyles();
            }
			if(!pasteBinaryFromExcel)
				History.TurnOn();
			//чтобы удалялся stream с бинарником
			pptx_content_loader.Clear(true);
        };
        this.ReadFile = function(wb)
        {
            return this.ReadMainTable(wb);
        };
        this.ReadMainTable = function(wb)
        {
            var res = c_oSerConstants.ReadOk;
            //mtLen
            res = this.stream.EnterFrame(1);
            if(c_oSerConstants.ReadOk != res)
                return res;
            var mtLen = this.stream.GetUChar();
            var aSeekTable = [];
            var nOtherTableOffset = null;
            var nSharedStringTableOffset = null;
            var nStyleTableOffset = null;
            var nWorkbookTableOffset = null;
            for(var i = 0; i < mtLen; ++i)
            {
                //mtItem
                res = this.stream.EnterFrame(5);
                if(c_oSerConstants.ReadOk != res)
                    return res;
                var mtiType = this.stream.GetUChar();
                var mtiOffBits = this.stream.GetULongLE();
                if(c_oSerTableTypes.Other == mtiType)
                    nOtherTableOffset = mtiOffBits;
                else if(c_oSerTableTypes.SharedStrings == mtiType)
                    nSharedStringTableOffset = mtiOffBits;
                else if(c_oSerTableTypes.Styles == mtiType)
                    nStyleTableOffset = mtiOffBits;
                else if(c_oSerTableTypes.Workbook == mtiType)
                    nWorkbookTableOffset = mtiOffBits;
                else
                    aSeekTable.push( {type: mtiType, offset: mtiOffBits} );
            }
            var aSharedStrings = [];
            var aCellXfs = [];
            var aDxfs = [];
            var oMediaArray = {};
            wb.aWorksheets = [];
            if(null != nOtherTableOffset)
            {
                res = this.stream.Seek(nOtherTableOffset);
                if(c_oSerConstants.ReadOk == res)
                    res = (new Binary_OtherTableReader(this.stream, oMediaArray, wb)).Read();
            }
            if(null != nSharedStringTableOffset)
            {
                res = this.stream.Seek(nSharedStringTableOffset);
                if(c_oSerConstants.ReadOk == res)
                    res = (new Binary_SharedStringTableReader(this.stream, wb, aSharedStrings)).Read();
            }
            if(null != nStyleTableOffset)
            {
                res = this.stream.Seek(nStyleTableOffset);
                if(c_oSerConstants.ReadOk == res)
                    res = (new Binary_StylesTableReader(this.stream, wb, aCellXfs, aDxfs, this.copyPasteObj.isCopyPaste)).Read();
            }
            if(c_oSerConstants.ReadOk == res)
            {
                for(var i = 0; i < aSeekTable.length; ++i)
                {
                    var seek = aSeekTable[i];
                    var mtiType = seek.type;
                    var mtiOffBits = seek.offset;
                    res = this.stream.Seek(mtiOffBits);
                    if(c_oSerConstants.ReadOk != res)
                        break;
                    var bwtr = new Binary_WorksheetTableReader(this.stream, this.oReadResult, wb, aSharedStrings, aCellXfs, aDxfs, oMediaArray, this.copyPasteObj);
                    switch(mtiType)
                    {
                        // case c_oSerTableTypes.SharedStrings:
                        // res = (new Binary_SharedStringTableReader(this.stream, aSharedStrings)).Read();
                        // break;
                        // case c_oSerTableTypes.Styles:
                        // res = (new Binary_StylesTableReader(this.stream, wb.oStyleManager, aCellXfs)).Read();
                        // break;
                        // case c_oSerTableTypes.Workbook:
                        // res = (new Binary_WorkbookTableReader(this.stream, wb)).Read();
                        // break;
                        case c_oSerTableTypes.Worksheets:
                            res = bwtr.Read();
                            break;
                        // case c_oSerTableTypes.CalcChain:
                        //     res = (new Binary_CalcChainTableReader(this.stream, wb.calcChain)).Read();
                        //     break;
                        // case c_oSerTableTypes.Other:
                        // res = (new Binary_OtherTableReader(this.stream, oMediaArray)).Read();
                        // break;
                    }
                    if(c_oSerConstants.ReadOk != res)
                        break;
                }
            }
            //todo инициализация формул из-за именованных диапазонов перенесена в wb.init ее надо вызывать в любом случае(Rev: 61959)
            //надо вернуть чтение Binary_WorkbookTableReader, когда будем реализовывать копирования именованных диапазонов
            if(!this.copyPasteObj.isCopyPaste)
            {
                if(null != nWorkbookTableOffset)
                {
                    res = this.stream.Seek(nWorkbookTableOffset);
                    if(c_oSerConstants.ReadOk == res)
                        res = (new Binary_WorkbookTableReader(this.stream, wb, bwtr)).Read();
                }
                wb.init(this.oReadResult.tableCustomFunc, false, true);
            } else if(window["Asc"] && window["Asc"]["editor"] !== undefined){
                wb.init(this.oReadResult.tableCustomFunc, true);
            }
            return res;
        };
    }
    function CTableStyles()
    {
        this.DefaultTableStyle = "TableStyleMedium2";
        this.DefaultPivotStyle = "PivotStyleLight16";
        this.CustomStyles = {};
        this.DefaultStyles = {};
		this.DefaultStylesPivot = {};
        this.AllStyles = {};
    }
    CTableStyles.prototype =
    {
        concatStyles : function()
        {
            for(var i in this.DefaultStyles)
                this.AllStyles[i] = this.DefaultStyles[i];
			for(var i in this.DefaultStylesPivot)
				this.AllStyles[i] = this.DefaultStylesPivot[i];
            for(var i in this.CustomStyles)
                this.AllStyles[i] = this.CustomStyles[i];
        },
		readAttributes: function(attr, uq) {
			if (attr()) {
				var vals = attr();
				var val;
				val = vals["defaultTableStyle"];
				if (undefined !== val) {
					this.DefaultTableStyle = AscCommon.unleakString(uq(val));
				}
				val = vals["defaultPivotStyle"];
				if (undefined !== val) {
					this.DefaultPivotStyle = AscCommon.unleakString(uq(val));
				}
			}
		},
		onStartNode: function(elem, attr, uq) {
			var newContext = this;
			if ("tableStyle" === elem) {
				newContext = new CTableStyle();
				if (newContext.readAttributes) {
					newContext.readAttributes(attr, uq);
				}
				this.CustomStyles[newContext.name] = newContext;
				openXml.SaxParserDataTransfer.curTableStyle = newContext;
			} else {
				newContext = null;
			}
			return newContext;
		}
    };
	function CTableStyleStripe(size, offset, opt_row){
		this.size = size;
		this.offset = offset;
		this.row = opt_row;
	}
    function CTableStyle()
    {
        this.name = null;
        this.pivot = true;
        this.table = true;
        this.displayName = null; // Показываемое имя (для дефалтовых оно будет с пробелами, а для пользовательских совпадает с name)

        this.blankRow = null;
        this.firstColumn = null;
        this.firstColumnStripe = null;
        this.firstColumnSubheading = null;
        this.firstHeaderCell = null;
        this.firstRowStripe = null;
        this.firstRowSubheading = null;
        this.firstSubtotalColumn = null;
        this.firstSubtotalRow = null;
        this.firstTotalCell = null;
        this.headerRow = null;
        this.lastColumn = null;
        this.lastHeaderCell = null;
        this.lastTotalCell = null;
        this.pageFieldLabels = null;
        this.pageFieldValues = null;
        this.secondColumnStripe = null;
        this.secondColumnSubheading = null;
        this.secondRowStripe = null;
        this.secondRowSubheading = null;
        this.secondSubtotalColumn = null;
        this.secondSubtotalRow = null;
        this.thirdColumnSubheading = null;
        this.thirdRowSubheading = null;
        this.thirdSubtotalColumn = null;
        this.thirdSubtotalRow = null;
        this.totalRow = null;
        this.wholeTable = null;
    }
	CTableStyle.prototype.initStyle = function (sheetMergedStyles, bbox, options, headerRowCount, totalsRowCount) {
		var r1Data = bbox.r1 + headerRowCount;
		var r2Data = bbox.r2 - totalsRowCount;
		var bboxTmp;
		var offsetStripe;
		var stripe;
		if (this.wholeTable) {
			sheetMergedStyles.setTablePivotStyle(bbox, this.wholeTable.dxf);
		}
		if (r1Data <= r2Data) {
			if (options.ShowColumnStripes) {
				if (this.firstColumnStripe) {
					offsetStripe = this.secondColumnStripe ? this.secondColumnStripe.size : 1;
					stripe = new CTableStyleStripe(this.firstColumnStripe.size, offsetStripe);
					bboxTmp = new Asc.Range(bbox.c1, r1Data, bbox.c2, r2Data);
					sheetMergedStyles.setTablePivotStyle(bboxTmp, this.firstColumnStripe.dxf, stripe);
				}
				if (this.secondColumnStripe) {
					offsetStripe = this.firstColumnStripe ? this.firstColumnStripe.size : 1;
					stripe = new CTableStyleStripe(this.secondColumnStripe.size, offsetStripe);
					if (bbox.c1 + offsetStripe <= bbox.c2) {
						bboxTmp = new Asc.Range(bbox.c1 + offsetStripe, r1Data, bbox.c2, r2Data);
						sheetMergedStyles.setTablePivotStyle(bboxTmp, this.secondColumnStripe.dxf, stripe);
					}
				}
			}
			if (options.ShowRowStripes) {
				if (this.firstRowStripe) {
					offsetStripe = this.secondRowStripe ? this.secondRowStripe.size : 1;
					stripe = new CTableStyleStripe(this.firstRowStripe.size, offsetStripe, true);
					bboxTmp = new Asc.Range(bbox.c1, r1Data, bbox.c2, r2Data);
					sheetMergedStyles.setTablePivotStyle(bboxTmp, this.firstRowStripe.dxf, stripe);
				}
				if (this.secondRowStripe) {
					offsetStripe = this.firstRowStripe ? this.firstRowStripe.size : 1;
					stripe = new CTableStyleStripe(this.secondRowStripe.size, offsetStripe, true);
					if (r1Data + offsetStripe <= r2Data) {
						bboxTmp = new Asc.Range(bbox.c1, r1Data + offsetStripe, bbox.c2, r2Data);
						sheetMergedStyles.setTablePivotStyle(bboxTmp, this.secondRowStripe.dxf, stripe);
					}
				}
			}
		}
		if (options.ShowLastColumn && this.lastColumn) {
			bboxTmp = new Asc.Range(bbox.c2, bbox.r1, bbox.c2, bbox.r2);
			sheetMergedStyles.setTablePivotStyle(bboxTmp, this.lastColumn.dxf);
		}
		if (options.ShowFirstColumn && this.firstColumn) {
			bboxTmp = new Asc.Range(bbox.c1, bbox.r1, bbox.c1, bbox.r2);
			sheetMergedStyles.setTablePivotStyle(bboxTmp, this.firstColumn.dxf);
		}
		if (this.headerRow && headerRowCount > 0) {
			bboxTmp = new Asc.Range(bbox.c1, bbox.r1, bbox.c2, bbox.r1);
			sheetMergedStyles.setTablePivotStyle(bboxTmp, this.headerRow.dxf);
		}
		if (this.totalRow && totalsRowCount > 0) {
			bboxTmp = new Asc.Range(bbox.c1, bbox.r2, bbox.c2, bbox.r2);
			sheetMergedStyles.setTablePivotStyle(bboxTmp, this.totalRow.dxf);
		}
		if (this.firstHeaderCell && headerRowCount > 0) {
			bboxTmp = new Asc.Range(bbox.c1, bbox.r1, bbox.c1, bbox.r1);
			sheetMergedStyles.setTablePivotStyle(bboxTmp, this.firstHeaderCell.dxf);
		}
		if (this.lastHeaderCell && headerRowCount > 0) {
			bboxTmp = new Asc.Range(bbox.c2, bbox.r1, bbox.c2, bbox.r1);
			sheetMergedStyles.setTablePivotStyle(bboxTmp, this.lastHeaderCell.dxf);
		}
		if (this.firstTotalCell && totalsRowCount > 0) {
			bboxTmp = new Asc.Range(bbox.c1, bbox.r2, bbox.c1, bbox.r2);
			sheetMergedStyles.setTablePivotStyle(bboxTmp, this.firstTotalCell.dxf);
		}
		if (this.lastTotalCell && totalsRowCount > 0) {
			bboxTmp = new Asc.Range(bbox.c2, bbox.r2, bbox.c2, bbox.r2);
			sheetMergedStyles.setTablePivotStyle(bboxTmp, this.lastTotalCell.dxf);
		}
	};
	CTableStyle.prototype.readAttributes = function (attr, uq) {
		if (attr()) {
			var vals = attr();
			var val;
			val = vals["name"];
			if (undefined !== val) {
				this.name = AscCommon.unleakString(uq(val));
				this.displayName = this.name;
			}
			val = vals["displayName"];
			if (undefined !== val) {
				this.displayName = AscCommon.unleakString(uq(val));
			}
			val = vals["pivot"];
			if (undefined !== val) {
				this.pivot = getBoolFromXml(val);
			}
			val = vals["table"];
			if (undefined !== val) {
				this.table = getBoolFromXml(val);
			}
		}
	};
	CTableStyle.prototype.onStartNode = function (elem, attr, uq) {
		var newContext = this;
		if ("tableStyleElement" === elem) {
			newContext = new CTableStyleElement();
			if (newContext.readAttributes) {
				newContext.readAttributes(attr, uq);
			}
		} else {
			newContext = null;
		}
		return newContext;
	};

    function CTableStyleElement()
    {
        this.size = 1;
        this.dxf = null;
    }
	CTableStyleElement.prototype.readAttributes = function(attr, uq) {
		if(attr()){
			var vals = attr();
			var val;
			val = vals["type"];
			if(undefined !== val){
				var tableStyle = openXml.SaxParserDataTransfer.curTableStyle;
				if("wholeTable"===val)
					tableStyle.wholeTable = this;
				else if("headerRow"===val)
					tableStyle.headerRow = this;
				else if("totalRow"===val)
					tableStyle.totalRow = this;
				else if("firstColumn"===val)
					tableStyle.firstColumn = this;
				else if("lastColumn"===val)
					tableStyle.lastColumn = this;
				else if("firstRowStripe"===val)
					tableStyle.firstRowStripe = this;
				else if("secondRowStripe"===val)
					tableStyle.secondRowStripe = this;
				else if("firstColumnStripe"===val)
					tableStyle.firstColumnStripe = this;
				else if("secondColumnStripe"===val)
					tableStyle.secondColumnStripe = this;
				else if("firstHeaderCell"===val)
					tableStyle.firstHeaderCell = this;
				else if("lastHeaderCell"===val)
					tableStyle.lastHeaderCell = this;
				else if("firstTotalCell"===val)
					tableStyle.firstTotalCell = this;
				else if("lastTotalCell"===val)
					tableStyle.lastTotalCell = this;
				else if("firstSubtotalColumn"===val)
					tableStyle.firstSubtotalColumn = this;
				else if("secondSubtotalColumn"===val)
					tableStyle.secondSubtotalColumn = this;
				else if("thirdSubtotalColumn"===val)
					tableStyle.thirdSubtotalColumn = this;
				else if("firstSubtotalRow"===val)
					tableStyle.firstSubtotalRow = this;
				else if("secondSubtotalRow"===val)
					tableStyle.secondSubtotalRow = this;
				else if("thirdSubtotalRow"===val)
					tableStyle.thirdSubtotalRow = this;
				else if("blankRow"===val)
					tableStyle.blankRow = this;
				else if("firstColumnSubheading"===val)
					tableStyle.firstColumnSubheading = this;
				else if("secondColumnSubheading"===val)
					tableStyle.secondColumnSubheading = this;
				else if("thirdColumnSubheading"===val)
					tableStyle.thirdColumnSubheading = this;
				else if("firstRowSubheading"===val)
					tableStyle.firstRowSubheading = this;
				else if("secondRowSubheading"===val)
					tableStyle.secondRowSubheading = this;
				else if("thirdRowSubheading"===val)
					tableStyle.thirdRowSubheading = this;
				else if("pageFieldLabels"===val)
					tableStyle.pageFieldLabels = this;
				else if("pageFieldValues"===val)
					tableStyle.pageFieldValues = this;
			}
			val = vals["size"];
			if(undefined !== val){
				this.size = val - 0;
			}
			val = vals["dxfId"];
			if (undefined !== val) {
				this.dxf = openXml.SaxParserDataTransfer.dxfs[tableStyle.pivot ? val - 0 : val - 1] || null;
			}
		}
	};
    function ReadDefTableStyles(wb)
    {
    	var stylesZip = "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";
		var jsZipWrapper = new AscCommon.JSZipWrapper();
		return jsZipWrapper.loadAsync(stylesZip, {"base64": true}).then(function(zip) {
			return zip.files["presetTableStyles.xml"].async("string");
		}).then(function(content) {
			jsZipWrapper.close();
			var stylesXml = new CT_PresetTableStyles(wb.TableStyles.DefaultStyles, wb.TableStyles.DefaultStylesPivot);
			new openXml.SaxParserBase().parse(content, stylesXml);
			wb.TableStyles.concatStyles();
		});
    }
    function ReadDefCellStyles(wb, oOutput)
    {
        var Types = {
            Style		: 0,
            BuiltinId	: 1,
            Hidden		: 2,
            CellStyle	: 3,
            Xfs			: 4,
            Font		: 5,
            Fill		: 6,
            Border		: 7,
            NumFmts		: 8
        };
        // Пишем тип и размер (версию не пишем)
        var sStyles = "XLSY;;11499;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aQBiAHIAaQAJAQEGBQAAAAAAACZABhcAAAAAEgAAAAENAAAAAgEFAwXNZeYyc5npPwcAAAAAAKwAAAABBAAAACYAAAADKAAAAAQaAAAAMgAwACUAIAAtACAAQQBjAGMAZQBuAHQAMwAFBAAAAAEAAAAEIQAAAAABAAEBAAQBAAYEAAAAAAcEAgAAAAgEAQAAAAkEAAAAAAUqAAAAAQYDAAAAAgEBBAYOAAAAQwBhAGwAaQBiAHIAaQAJAQEGBQAAAAAAACZABhcAAAAAEgAAAAENAAAAAgEGAwXNZeYyc5npPwcAAAAAAKwAAAABBAAAACoAAAADKAAAAAQaAAAAMgAwACUAIAAtACAAQQBjAGMAZQBuAHQANAAFBAAAAAEAAAAEIQAAAAABAAEBAAQBAAYEAAAAAAcEAgAAAAgEAQAAAAkEAAAAAAUqAAAAAQYDAAAAAgEBBAYOAAAAQwBhAGwAaQBiAHIAaQAJAQEGBQAAAAAAACZABhcAAAAAEgAAAAENAAAAAgEHAwXNZeYyc5npPwcAAAAAAKwAAAABBAAAAC4AAAADKAAAAAQaAAAAMgAwACUAIAAtACAAQQBjAGMAZQBuAHQANQAFBAAAAAEAAAAEIQAAAAABAAEBAAQBAAYEAAAAAAcEAgAAAAgEAQAAAAkEAAAAAAUqAAAAAQYDAAAAAgEBBAYOAAAAQwBhAGwAaQBiAHIAaQAJAQEGBQAAAAAAACZABhcAAAAAEgAAAAENAAAAAgEIAwXNZeYyc5npPwcAAAAAAKwAAAABBAAAADIAAAADKAAAAAQaAAAAMgAwACUAIAAtACAAQQBjAGMAZQBuAHQANgAFBAAAAAEAAAAEIQAAAAABAAEBAAQBAAYEAAAAAAcEAgAAAAgEAQAAAAkEAAAAAAUqAAAAAQYDAAAAAgEBBAYOAAAAQwBhAGwAaQBiAHIAaQAJAQEGBQAAAAAAACZABhcAAAAAEgAAAAENAAAAAgEJAwXNZeYyc5npPwcAAAAAAKwAAAABBAAAAB8AAAADKAAAAAQaAAAANAAwACUAIAAtACAAQQBjAGMAZQBuAHQAMQAFBAAAAAEAAAAEIQAAAAABAAEBAAQBAAYEAAAAAAcEAgAAAAgEAQAAAAkEAAAAAAUqAAAAAQYDAAAAAgEBBAYOAAAAQwBhAGwAaQBiAHIAaQAJAQEGBQAAAAAAACZABhcAAAAAEgAAAAENAAAAAgEEAwWazExmJjPjPwcAAAAAAKwAAAABBAAAACMAAAADKAAAAAQaAAAANAAwACUAIAAtACAAQQBjAGMAZQBuAHQAMgAFBAAAAAEAAAAEIQAAAAABAAEBAAQBAAYEAAAAAAcEAgAAAAgEAQAAAAkEAAAAAAUqAAAAAQYDAAAAAgEBBAYOAAAAQwBhAGwAaQBiAHIAaQAJAQEGBQAAAAAAACZABhcAAAAAEgAAAAENAAAAAgEFAwWazExmJjPjPwcAAAAAAKwAAAABBAAAACcAAAADKAAAAAQaAAAANAAwACUAIAAtACAAQQBjAGMAZQBuAHQAMwAFBAAAAAEAAAAEIQAAAAABAAEBAAQBAAYEAAAAAAcEAgAAAAgEAQAAAAkEAAAAAAUqAAAAAQYDAAAAAgEBBAYOAAAAQwBhAGwAaQBiAHIAaQAJAQEGBQAAAAAAACZABhcAAAAAEgAAAAENAAAAAgEGAwWazExmJjPjPwcAAAAAAKwAAAABBAAAACsAAAADKAAAAAQaAAAANAAwACUAIAAtACAAQQBjAGMAZQBuAHQANAAFBAAAAAEAAAAEIQAAAAABAAEBAAQBAAYEAAAAAAcEAgAAAAgEAQAAAAkEAAAAAAUqAAAAAQYDAAAAAgEBBAYOAAAAQwBhAGwAaQBiAHIAaQAJAQEGBQAAAAAAACZABhcAAAAAEgAAAAENAAAAAgEHAwWazExmJjPjPwcAAAAAAKwAAAABBAAAAC8AAAADKAAAAAQaAAAANAAwACUAIAAtACAAQQBjAGMAZQBuAHQANQAFBAAAAAEAAAAEIQAAAAABAAEBAAQBAAYEAAAAAAcEAgAAAAgEAQAAAAkEAAAAAAUqAAAAAQYDAAAAAgEBBAYOAAAAQwBhAGwAaQBiAHIAaQAJAQEGBQAAAAAAACZABhcAAAAAEgAAAAENAAAAAgEIAwWazExmJjPjPwcAAAAAAKwAAAABBAAAADMAAAADKAAAAAQaAAAANAAwACUAIAAtACAAQQBjAGMAZQBuAHQANgAFBAAAAAEAAAAEIQAAAAABAAEBAAQBAAYEAAAAAAcEAgAAAAgEAQAAAAkEAAAAAAUqAAAAAQYDAAAAAgEBBAYOAAAAQwBhAGwAaQBiAHIAaQAJAQEGBQAAAAAAACZABhcAAAAAEgAAAAENAAAAAgEJAwWazExmJjPjPwcAAAAAAKwAAAABBAAAACAAAAADKAAAAAQaAAAANgAwACUAIAAtACAAQQBjAGMAZQBuAHQAMQAFBAAAAAEAAAAEIQAAAAABAAEBAAQBAAYEAAAAAAcEAgAAAAgEAQAAAAkEAAAAAAUqAAAAAQYDAAAAAgEABAYOAAAAQwBhAGwAaQBiAHIAaQAJAQEGBQAAAAAAACZABhcAAAAAEgAAAAENAAAAAgEEAwXNZGYyM5nZPwcAAAAAAKwAAAABBAAAACQAAAADKAAAAAQaAAAANgAwACUAIAAtACAAQQBjAGMAZQBuAHQAMgAFBAAAAAEAAAAEIQAAAAABAAEBAAQBAAYEAAAAAAcEAgAAAAgEAQAAAAkEAAAAAAUqAAAAAQYDAAAAAgEABAYOAAAAQwBhAGwAaQBiAHIAaQAJAQEGBQAAAAAAACZABhcAAAAAEgAAAAENAAAAAgEFAwXNZGYyM5nZPwcAAAAAAKwAAAABBAAAACgAAAADKAAAAAQaAAAANgAwACUAIAAtACAAQQBjAGMAZQBuAHQAMwAFBAAAAAEAAAAEIQAAAAABAAEBAAQBAAYEAAAAAAcEAgAAAAgEAQAAAAkEAAAAAAUqAAAAAQYDAAAAAgEABAYOAAAAQwBhAGwAaQBiAHIAaQAJAQEGBQAAAAAAACZABhcAAAAAEgAAAAENAAAAAgEGAwXNZGYyM5nZPwcAAAAAAKwAAAABBAAAACwAAAADKAAAAAQaAAAANgAwACUAIAAtACAAQQBjAGMAZQBuAHQANAAFBAAAAAEAAAAEIQAAAAABAAEBAAQBAAYEAAAAAAcEAgAAAAgEAQAAAAkEAAAAAAUqAAAAAQYDAAAAAgEABAYOAAAAQwBhAGwAaQBiAHIAaQAJAQEGBQAAAAAAACZABhcAAAAAEgAAAAENAAAAAgEHAwXNZGYyM5nZPwcAAAAAAKwAAAABBAAAADAAAAADKAAAAAQaAAAANgAwACUAIAAtACAAQQBjAGMAZQBuAHQANQAFBAAAAAEAAAAEIQAAAAABAAEBAAQBAAYEAAAAAAcEAgAAAAgEAQAAAAkEAAAAAAUqAAAAAQYDAAAAAgEABAYOAAAAQwBhAGwAaQBiAHIAaQAJAQEGBQAAAAAAACZABhcAAAAAEgAAAAENAAAAAgEIAwXNZGYy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";

        var oBinaryFileReader = new BinaryFileReader();
        var stream = oBinaryFileReader.getbase64DecodedData(sStyles);
        var bcr = new Binary_CommonReader(stream);
        var oBinary_StylesTableReader = new Binary_StylesTableReader(stream, wb, [], [], undefined, true);

        var length = stream.GetULongLE();

        var fReadStyle = function(type, length, oCellStyle, oStyleObject) {
            var res = c_oSerConstants.ReadOk;
            if (Types.BuiltinId === type) {
                oCellStyle.BuiltinId = stream.GetULongLE();
            } else if (Types.Hidden === type) {
                oCellStyle.Hidden = stream.GetBool();
            } else if (Types.CellStyle === type) {
                res = bcr.Read1(length, function(t, l) {
                    return oBinary_StylesTableReader.ReadCellStyle(t, l, oCellStyle);
                });
            } else if (Types.Xfs === type) {
                oStyleObject.xfs = {ApplyAlignment: null, ApplyBorder: null, ApplyFill: null, ApplyFont: null, ApplyNumberFormat: null,
                    BorderId: null, FillId: null, FontId: null, NumFmtId: null, QuotePrefix: null, Aligment: null, XfId: null, PivotButton: null};
                res = bcr.Read2Spreadsheet(length, function (t, l) {
                    return oBinary_StylesTableReader.ReadXfs(t, l, oStyleObject.xfs);
                });
            } else if (Types.Font === type) {
                oStyleObject.font = new AscCommonExcel.Font();
                res = bcr.Read2Spreadsheet(length, function (t, l) {
                    return oBinary_StylesTableReader.bssr.ReadRPr(t, l, oStyleObject.font);
                });
                oBinary_StylesTableReader.bssr.CheckSchemeFont(oStyleObject.font);
            } else if (Types.Fill === type) {
                oStyleObject.fill = new AscCommonExcel.Fill();
                res = bcr.Read1(length, function (t, l) {
                    return oBinary_StylesTableReader.ReadFill(t, l, oStyleObject.fill);
                });
            } else if (Types.Border === type) {
                oStyleObject.border = new AscCommonExcel.Border();
                res = bcr.Read1(length, function (t, l) {
                    return oBinary_StylesTableReader.ReadBorder(t, l, oStyleObject.border);
                });
            } else if (Types.NumFmts === type) {
                res = bcr.Read1(length, function (t, l) {
                    return oBinary_StylesTableReader.ReadNumFmts(t, l, oStyleObject.oNumFmts);
                });
            } else
                res = c_oSerConstants.ReadUnknown;
            return res;
        };
        var fReadStyles = function (type, length, oOutput) {
            var res = c_oSerConstants.ReadOk;
            var oStyleObject = {font: null, fill: null, border: null, oNumFmts: {}, xfs: null};
            if (Types.Style === type) {
                var oCellStyle = new AscCommonExcel.CCellStyle();
                res = bcr.Read1(length, function (t, l) {
                    return fReadStyle(t,l, oCellStyle, oStyleObject);
                });

                var newXf = new AscCommonExcel.CellXfs();
                // Border
                if (null !== oStyleObject.border)
					newXf.border = g_StyleCache.addBorder(oStyleObject.border);
                // Fill
                if (null !== oStyleObject.fill)
					newXf.fill = g_StyleCache.addFill(oStyleObject.fill);
                // Font
                if (null !== oStyleObject.font)
					newXf.font = g_StyleCache.addFont(oStyleObject.font);
                // NumFmt
                if (null !== oStyleObject.xfs.numid) {
                    var oCurNum = oStyleObject.oNumFmts[oStyleObject.xfs.numid];
                    if(null != oCurNum)
						newXf.num = g_StyleCache.addNum(oCurNum);
                    else
						newXf.num = g_StyleCache.addNum(oBinary_StylesTableReader.ParseNum({id: oStyleObject.xfs.numid, f: null}, oStyleObject.oNumFmts));
                }
                // QuotePrefix
                if(null != oStyleObject.xfs.QuotePrefix)
					newXf.QuotePrefix = oStyleObject.xfs.QuotePrefix;
				// PivotButton
				if(null != oStyleObject.xfs.PivotButton)
					newXf.PivotButton = oStyleObject.xfs.PivotButton;
                // align
                if(null != oStyleObject.xfs.align)
					newXf.align = g_StyleCache.addAlign(oStyleObject.xfs.align);
                // XfId
                if (null !== oStyleObject.xfs.XfId)
					newXf.XfId = oStyleObject.xfs.XfId;
                // ApplyBorder (ToDo возможно это свойство должно быть в xfs)
                if (null !== oStyleObject.xfs.ApplyBorder)
                    oCellStyle.ApplyBorder = oStyleObject.xfs.ApplyBorder;
                // ApplyFill (ToDo возможно это свойство должно быть в xfs)
                if (null !== oStyleObject.xfs.ApplyFill)
                    oCellStyle.ApplyFill = oStyleObject.xfs.ApplyFill;
                // ApplyFont (ToDo возможно это свойство должно быть в xfs)
                if (null !== oStyleObject.xfs.ApplyFont)
                    oCellStyle.ApplyFont = oStyleObject.xfs.ApplyFont;
                // ApplyNumberFormat (ToDo возможно это свойство должно быть в xfs)
                if (null !== oStyleObject.xfs.ApplyNumberFormat)
                    oCellStyle.ApplyNumberFormat = oStyleObject.xfs.ApplyNumberFormat;
                oCellStyle.xfs = g_StyleCache.addXf(newXf);

                oOutput.push(oCellStyle);
            } else
                res = c_oSerConstants.ReadUnknown;
            return res;
        };

        var res = bcr.Read1(length, function (t, l) {
            return fReadStyles(t, l, oOutput);
        });

        // Если нет стилей в документе, то добавим
        if (0 === wb.CellStyles.CustomStyles.length && 0 < oOutput.length) {
            wb.CellStyles.CustomStyles.push(oOutput[0].clone());
            wb.CellStyles.CustomStyles[0].XfId = 0;
        }
        // Если XfId не задан, то определим его
        if (null == g_oDefaultFormat.XfId) {
            g_oDefaultFormat.XfId = 0;
        }
    }

	function CT_PresetTableStyles(tableStyles, pivotStyles) {
		this.tableStyles = tableStyles;
		this.pivotStyles = pivotStyles;
	}

	CT_PresetTableStyles.prototype.onStartNode = function(elem, attr, uq) {
		var newContext = this;
		if ("presetTableStyles" === elem) {
		} else if (0 === elem.indexOf("TableStyle") || 0 === elem.indexOf("PivotStyle")) {
			newContext = new CT_Stylesheet(new Asc.CTableStyles());
		} else {
			newContext = null;
		}
		return newContext;
	};
	CT_PresetTableStyles.prototype.onEndNode = function(prevContext, elem) {
		if (0 === elem.indexOf("TableStyle")) {
			for (var i in prevContext.tableStyles.CustomStyles) {
				this.tableStyles[i] = prevContext.tableStyles.CustomStyles[i];
			}
		} else if (0 === elem.indexOf("PivotStyle")) {
			for (var i in prevContext.tableStyles.CustomStyles) {
				this.pivotStyles[i] = prevContext.tableStyles.CustomStyles[i];
			}
		}
	};

	function CT_Stylesheet(tableStyles) {
		//Members
		this.numFmts = [];
		this.fonts = [];
		this.fills = [];
		this.borders = [];
		this.cellStyleXfs = [];
		this.cellXfs = [];
		this.cellStyles = [];
		this.dxfs = [];
		this.tableStyles = tableStyles;
	}

	CT_Stylesheet.prototype.onStartNode = function(elem, attr, uq) {
		var newContext = this;
		if ("styleSheet" === elem) {
			if (newContext.readAttributes) {
				newContext.readAttributes(attr, uq);
			}
		} else if ("numFmts" === elem) {
			openXml.SaxParserDataTransfer.numFmts = this.numFmts;
		} else if ("numFmt" === elem) {
			newContext = new AscCommonExcel.Num();
			if (newContext.readAttributes) {
				newContext.readAttributes(attr, uq);
			}
			this.numFmts.push(newContext);
		} else if ("fonts" === elem) {
			openXml.SaxParserDataTransfer.fonts = this.fonts;
		} else if ("font" === elem) {
			newContext = new AscCommonExcel.Font();
			if (newContext.readAttributes) {
				newContext.readAttributes(attr, uq);
			}
			this.fonts.push(newContext);
		} else if ("fills" === elem) {
			openXml.SaxParserDataTransfer.fills = this.fills;
			openXml.SaxParserDataTransfer.priorityBg = false;
		} else if ("fill" === elem) {
			newContext = new AscCommonExcel.Fill();
			if (newContext.readAttributes) {
				newContext.readAttributes(attr, uq);
			}
			this.fills.push(newContext);
		} else if ("borders" === elem) {
			openXml.SaxParserDataTransfer.borders = this.borders;
		} else if ("border" === elem) {
			newContext = new AscCommonExcel.Border();
			if (newContext.readAttributes) {
				newContext.readAttributes(attr, uq);
			}
			this.borders.push(newContext);
			// } else if("cellStyleXfs" === elem){
			// 	newContext = new CT_CellStyleXfs();
			// 	if(newContext.readAttributes){
			// 		newContext.readAttributes(attr, uq);
			// 	}
			// 	this.cellStyleXfs = newContext;
			// } else if("cellXfs" === elem){
			// 	newContext = new CT_CellXfs();
			// 	if(newContext.readAttributes){
			// 		newContext.readAttributes(attr, uq);
			// 	}
			// 	this.cellXfs = newContext;
			// } else if("cellStyles" === elem){
			// 	newContext = new CT_CellStyles();
			// 	if(newContext.readAttributes){
			// 		newContext.readAttributes(attr, uq);
			// 	}
			// 	this.cellStyles = newContext;
		} else if ("dxfs" === elem) {
			openXml.SaxParserDataTransfer.dxfs = this.dxfs;
			openXml.SaxParserDataTransfer.priorityBg = true;
		} else if ("dxf" === elem) {
			newContext = new CT_Dxf();
			if (newContext.readAttributes) {
				newContext.readAttributes(attr, uq);
			}
		} else if ("tableStyles" === elem) {
			newContext = this.tableStyles;
		} else {
			newContext = null;
		}
		return newContext;
	};
	CT_Stylesheet.prototype.onEndNode = function(prevContext, elem) {
		if ("dxf" === elem) {
			this.dxfs.push(g_StyleCache.addXf(prevContext.xf, true));
		}
	};

	function CT_Dxf() {
		//Members
		this.xf = new AscCommonExcel.CellXfs();
	}

	CT_Dxf.prototype.onStartNode = function(elem, attr, uq) {
		var newContext = this;
		if ("font" === elem) {
			newContext = new AscCommonExcel.Font();
			if (newContext.readAttributes) {
				newContext.readAttributes(attr, uq);
			}
			this.xf.font = newContext;
		} else if ("numFmt" === elem) {
			newContext = new AscCommonExcel.Num();
			if (newContext.readAttributes) {
				newContext.readAttributes(attr, uq);
			}
			this.xf.num = newContext;
		} else if ("fill" === elem) {
			newContext = new AscCommonExcel.Fill();
			if (newContext.readAttributes) {
				newContext.readAttributes(attr, uq);
			}
			this.xf.fill = newContext;
		} else if ("alignment" === elem) {
			newContext = new AscCommonExcel.Align();
			if (newContext.readAttributes) {
				newContext.readAttributes(attr, uq);
			}
			this.xf.align = newContext;
		} else if ("border" === elem) {
			newContext = new AscCommonExcel.Border();
			if (newContext.readAttributes) {
				newContext.readAttributes(attr, uq);
			}
			this.xf.border = newContext;
		} else {
			newContext = null;
		}
		return newContext;
	};

    window['Asc'] = window['Asc'] || {};
    window['AscCommonExcel'] = window['AscCommonExcel'] || {};
    window["Asc"].EBorderStyle = EBorderStyle;
    window["Asc"].EUnderline = EUnderline;
    window["Asc"].ECellAnchorType = ECellAnchorType;
    window["Asc"].EVisibleType = EVisibleType;
    window["Asc"].ECellTypeType = ECellTypeType;
    window["Asc"].ECellFormulaType = ECellFormulaType;
    window["Asc"].EPageOrientation = EPageOrientation;
    window["Asc"].EPageSize = EPageSize;
    window["Asc"].ETotalsRowFunction = ETotalsRowFunction;
    window["Asc"].ESortBy = ESortBy;
    window["Asc"].ECustomFilter = ECustomFilter;
    window["Asc"].EDateTimeGroup = EDateTimeGroup;
    window["Asc"].ETableStyleType = ETableStyleType;
    window["Asc"].EFontScheme = EFontScheme;
    window["Asc"].EIconSetType = EIconSetType;
    window["AscCommonExcel"].ECfOperator = ECfOperator;
	window["AscCommonExcel"].ECfType = ECfType;
    window["AscCommonExcel"].ECfvoType = ECfvoType;
    window["AscCommonExcel"].ST_TimePeriod = ST_TimePeriod;

    window["Asc"].CTableStyles = CTableStyles;
    window["Asc"].CTableStyle = CTableStyle;
    window["Asc"].CTableStyleElement = CTableStyleElement;
    window["Asc"].CTableStyleStripe = CTableStyleStripe;
    window["AscCommonExcel"].BinaryFileReader = BinaryFileReader;
    window["AscCommonExcel"].BinaryFileWriter = BinaryFileWriter;

    window["AscCommonExcel"].BinaryTableWriter = BinaryTableWriter;
    window["AscCommonExcel"].Binary_TableReader = Binary_TableReader;

    window["Asc"].getBinaryOtherTableGVar = getBinaryOtherTableGVar;
    window["Asc"].ReadDefTableStyles = ReadDefTableStyles;
})(window);
