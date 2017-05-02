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
(function(window, undefined) {

      // Import
      var g_memory = AscFonts.g_memory;
      var DecodeBase64Char = AscFonts.DecodeBase64Char;
      var b64_decode = AscFonts.b64_decode;
      
      var CellValueType = AscCommon.CellValueType;
      var c_oAscCellAnchorType = AscCommon.c_oAscCellAnchorType;
      var c_oAscBorderStyles = AscCommon.c_oAscBorderStyles;
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
		PivotCache: 8
    };
    /** @enum */
    var c_oSerWorkbookPrTypes =
    {
        Date1904: 0,
        DateCompatibility: 1
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
        RefRowCol: 5
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
        EmbeddedFonts: 4,
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
        Reply : 8
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
        this.Write = function(aTables)
        {
            var oThis = this;
            for(var i = 0, length = aTables.length; i < length; ++i)
            {
                var rangeTable = null;
                //get range for copy/paste
                if (this.isCopyPaste)
                    rangeTable = aTables[i].Ref;

                if(!this.isCopyPaste || (this.isCopyPaste && rangeTable && this.isCopyPaste.containsRange(rangeTable)))
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
    function BinarySharedStringsTableWriter(memory, oSharedStrings)
    {
        this.memory = memory;
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
            for(var i in this.oSharedStrings.strings)
            {
                var item = this.oSharedStrings.strings[i];
                if(null != item.t)
                    aSharedStrings[item.t.id] = {t: item.t.val};
                if(null != item.a)
                {
                    for(var j = 0, length2 = item.a.length; j < length2; ++j)
                    {
                        var oCurText = item.a[j];
                        aSharedStrings[oCurText.id] = {a: oCurText.val};
                    }
                }
            }
            for(var i = 0, length = aSharedStrings.length; i < length; ++i)
            {
                var si = aSharedStrings[i];
                if(null != si)
                    this.bs.WriteItem(c_oSerSharedStringTypes.Si, function(){oThis.WriteSi(si);});
            }
        };
        this.WriteSi = function(si)
        {
            var oThis = this;
            if(null != si.t)
            {
                this.memory.WriteByte(c_oSerSharedStringTypes.Text);
                this.memory.WriteString2(si.t);
            }
            else if(null != si.a)
            {
                for(var i = 0, length = si.a.length; i < length; ++i)
                {
                    var run = si.a[i];
                    this.bs.WriteItem(c_oSerSharedStringTypes.Run, function(){oThis.WriteRun(run);});
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
    /** @constructor */
    function BinaryStylesTableWriter(memory, wb, oBinaryWorksheetsTableWriter)
    {
        this.memory = memory;
        this.bs = new BinaryCommonWriter(this.memory);
        this.wb = wb;
        this.aDxfs = null;
        this.oXfsStylesMap = null;
        this.oXfsMap = null;
        this.oFontMap = null;
        this.oFillMap = null;
        this.oBorderMap = null;
        this.oNumMap = null;
        this.oBinaryWorksheetsTableWriter = oBinaryWorksheetsTableWriter;
        if(null != oBinaryWorksheetsTableWriter)
        {
            this.aDxfs = oBinaryWorksheetsTableWriter.aDxfs;
            this.oXfsStylesMap = oBinaryWorksheetsTableWriter.oXfsStylesMap;
            this.oXfsMap = oBinaryWorksheetsTableWriter.oXfsMap;
            this.oFontMap = oBinaryWorksheetsTableWriter.oFontMap;
            this.oFillMap = oBinaryWorksheetsTableWriter.oFillMap;
            this.oBorderMap = oBinaryWorksheetsTableWriter.oBorderMap;
            this.oNumMap = oBinaryWorksheetsTableWriter.oNumMap;
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
                        oDxfsNumFormatToId[dxf.num.getFormat()] = this.oBinaryWorksheetsTableWriter.getNumIdByFormat(dxf.num);
                }
                this.bs.WriteItem(c_oSerStylesTypes.Dxfs, function(){oThis.WriteDxfs(oThis.aDxfs, oDxfsNumFormatToId);});
            }
            //numfmts пишется в конце потому что они могут пополниться при записи Dxfs
            this.bs.WriteItem(c_oSerStylesTypes.NumFmts, function(){oThis.WriteNumFmts();});
        };
        this.WriteBorders = function()
        {
            var oThis = this;
            var aBorders = [];
            for(var i in this.oBorderMap)
            {
                var elem = this.oBorderMap[i];
                aBorders[elem.index] = elem.val;
            }
            for(var i = 0, length = aBorders.length; i < length; ++i)
            {
                var border = aBorders[i];
                this.bs.WriteItem(c_oSerStylesTypes.Border, function(){oThis.WriteBorder(border.getDif(g_oDefaultFormat.BorderAbs));});
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
            var aFills = [];
            for(var i in this.oFillMap)
            {
                var elem = this.oFillMap[i];
                aFills[elem.index] = elem.val;
            }
            //делаем второй fill как первый(Excel пишет не такой, но это не важно - они игнорируются)
            aFills[1] = aFills[0];
            for(var i = 0, length = aFills.length; i < length; ++i)
            {
                var fill = aFills[i];
                this.bs.WriteItem(c_oSerStylesTypes.Fill, function(){oThis.WriteFill(fill);});
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
            var aFonts = [];
            for(var i in this.oFontMap)
            {
                var elem = this.oFontMap[i];
                aFonts[elem.index] = elem.val;
            }
            for(var i = 0, length = aFonts.length; i < length; ++i) {
                this.bs.WriteItem(c_oSerStylesTypes.Font, function(){oThis.WriteFont(aFonts[i]);});
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
            for(var i in this.oNumMap)
            {
                var num = this.oNumMap[i];
                if(false == num.val.isEqual(g_oDefaultFormat.NumAbs))
                    this.bs.WriteItem(c_oSerStylesTypes.NumFmt, function(){oThis.WriteNum({id: num.index, f: num.val.getFormat()});});
            }
        };
        this.WriteNum = function(num)
        {
            if(null != num.f)
            {
                this.memory.WriteByte(c_oSerNumFmtTypes.FormatCode);
                this.memory.WriteByte(c_oSerPropLenType.Variable);
                this.memory.WriteString2(num.f);
            }
            if(null != num.id)
            {
                this.memory.WriteByte(c_oSerNumFmtTypes.NumFmtId);
                this.memory.WriteByte(c_oSerPropLenType.Long);
                this.memory.WriteLong(num.id);
            }
        };
        this.WriteCellStyleXfs = function()
        {
            var oThis = this;
            for(var i = 0, length = this.oXfsStylesMap.length; i < length; ++i)
            {
                var cellStyleXfs = this.oXfsStylesMap[i];
                this.bs.WriteItem(c_oSerStylesTypes.Xfs, function(){oThis.WriteXfs(cellStyleXfs);});
            }
        };
        this.WriteCellXfs = function()
        {
            var oThis = this;
            var aXfs = [];
            for(var i in this.oXfsMap)
            {
                var elem = this.oXfsMap[i];
                aXfs[elem.index] = elem.val;
            }
            for(var i = 0, length = aXfs.length; i < length; ++i)
            {
                var cellxfs = aXfs[i];
                this.bs.WriteItem(c_oSerStylesTypes.Xfs, function(){oThis.WriteXfs(cellxfs);});
            }
        };
        this.WriteXfs = function(xfs)
        {
            var oThis = this;
            if(null != xfs.borderid)
            {
                if(0 != xfs.borderid)
                {
                    this.memory.WriteByte(c_oSerXfsTypes.ApplyBorder);
                    this.memory.WriteByte(c_oSerPropLenType.Byte);
                    this.memory.WriteBool(true);
                }
                this.memory.WriteByte(c_oSerXfsTypes.BorderId);
                this.memory.WriteByte(c_oSerPropLenType.Long);
                this.memory.WriteLong(xfs.borderid);
            }
            if(null != xfs.fillid)
            {
                if(0 != xfs.fillid)
                {
                    this.memory.WriteByte(c_oSerXfsTypes.ApplyFill);
                    this.memory.WriteByte(c_oSerPropLenType.Byte);
                    this.memory.WriteBool(true);
                }
                this.memory.WriteByte(c_oSerXfsTypes.FillId);
                this.memory.WriteByte(c_oSerPropLenType.Long);
                this.memory.WriteLong(xfs.fillid);
            }
            if(null != xfs.fontid)
            {
                if(0 != xfs.fontid)
                {
                    this.memory.WriteByte(c_oSerXfsTypes.ApplyFont);
                    this.memory.WriteByte(c_oSerPropLenType.Byte);
                    this.memory.WriteBool(true);
                }
                this.memory.WriteByte(c_oSerXfsTypes.FontId);
                this.memory.WriteByte(c_oSerPropLenType.Long);
                this.memory.WriteLong(xfs.fontid);
            }
            if(null != xfs.numid)
            {
                if(0 != xfs.numid)
                {
                    this.memory.WriteByte(c_oSerXfsTypes.ApplyNumberFormat);
                    this.memory.WriteByte(c_oSerPropLenType.Byte);
                    this.memory.WriteBool(true);
                }
                this.memory.WriteByte(c_oSerXfsTypes.NumFmtId);
                this.memory.WriteByte(c_oSerPropLenType.Long);
                this.memory.WriteLong(xfs.numid);
            }
            if(null != xfs.align)
            {
                var alignMinimized = xfs.align.getDif(g_oDefaultFormat.AlignAbs);
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
            if(null != xfs.QuotePrefix)
            {
                this.memory.WriteByte(c_oSerXfsTypes.QuotePrefix);
                this.memory.WriteByte(c_oSerPropLenType.Byte);
                this.memory.WriteBool(xfs.QuotePrefix);
            }
			if(null != xfs.PivotButton)
			{
				this.memory.WriteByte(c_oSerXfsTypes.PivotButton);
				this.memory.WriteByte(c_oSerPropLenType.Byte);
				this.memory.WriteBool(xfs.PivotButton);
			}
            if(null != xfs.XfId)
            {
                this.memory.WriteByte(c_oSerXfsTypes.XfId);
                this.memory.WriteByte(c_oSerPropLenType.Long);
                this.memory.WriteLong(xfs.XfId);
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
                    this.bs.WriteItem(c_oSer_Dxf.NumFmt, function(){oThis.WriteNum({id: numId, f: Dxf.num.getFormat()});});
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
    function BinaryWorkbookTableWriter(memory, wb)
    {
        this.memory = memory;
        this.bs = new BinaryCommonWriter(this.memory);
        this.wb = wb;
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
			var isEmpty = true;
			for (var id in wb.pivotCaches) {
				isEmpty = false;
				break;
			}
			if(!isEmpty){
				this.bs.WriteItem(c_oSerWorkbookTypes.PivotCaches, function(){oThis.WritePivotCaches();});
			}
        };
        this.WriteWorkbookPr = function()
        {
            var oWorkbookPr = this.wb.WorkbookPr;
            if(null != oWorkbookPr)
            {
                if(null != oWorkbookPr.Date1904)
                {
                    this.memory.WriteByte(c_oSerBorderPropTypes.Date1904);
                    this.memory.WriteByte(c_oSerPropLenType.Byte);
                    this.memory.WriteBool(oWorkbookPr.Date1904);
                }
                else if (null != oWorkbookPr.DateCompatibility)
                {
                    this.memory.WriteByte(c_oSerBorderPropTypes.DateCompatibility);
                    this.memory.WriteByte(c_oSerPropLenType.Byte);
                    this.memory.WriteBool(oWorkbookPr.DateCompatibility);
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
		this.WritePivotCaches = function() {
			var oThis = this;
			for (var id in wb.pivotCaches) {
				this.bs.WriteItem(c_oSerWorkbookTypes.PivotCache, function(){oThis.WritePivotCache(id, wb.pivotCaches[id]);});
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
    }
    function BinaryWorksheetsTableWriter(memory, wb, oSharedStrings, aDxfs, aXfs, aFonts, aFills, aBorders, aNums, idWorksheet, isCopyPaste)
    {
        this.memory = memory;
        this.bs = new BinaryCommonWriter(this.memory);
        this.wb = wb;
        this.oSharedStrings = oSharedStrings;
        this.aDxfs = aDxfs;
        this.aXfs = aXfs;
        this.aFonts = aFonts;
        this.aFills = aFills;
        this.aBorders = aBorders;
        this.aNums = aNums;
        this.oXfsStylesMap = [];
        this.oXfsMap = {};
        this.nXfsMapIndex = 0;
        this.oFontMap = {};
        this.nFontMapIndex = 0;
        this.oFillMap = {};
        this.nFillMapIndex = 0;
        this.nDefaultFillIndex = 0;//может быть 0(если default заливка пустая) или 2(если default заливка не пустая)
        this.oBorderMap = {};
        this.nBorderMapIndex = 0;
        this.oNumMap = {};
        this.nNumMapIndex = 0;
        this.idWorksheet = idWorksheet;
        this.oAllColXfsId = null;
        this.isCopyPaste = isCopyPaste;
        this._getCrc32FromObjWithProperty = function(val)
        {
            return Asc.crc32(this._getStringFromObjWithProperty(val));
        };
        this._getStringFromObjWithProperty = function(val)
        {
            var sRes = "";
            if(val.getProperties)
            {
                var properties = val.getProperties();
                for(var i in properties)
                {
                    var oCurProp = val.getProperty(properties[i]);
                    if(null != oCurProp && oCurProp.getProperties)
                        sRes += this._getStringFromObjWithProperty(oCurProp);
                    else
                        sRes += oCurProp;
                }
            }
            return sRes;
        };
        this._prepeareStyles = function()
        {
            this.oFontMap[this._getStringFromObjWithProperty(g_oDefaultFormat.Font)] = {index: this.nFontMapIndex++, val: g_oDefaultFormat.Font};
            //первый 2 fill должны быть стандартными. Excel игнорирует то что записано, берет стандартные
            this.oFillMap[this._getStringFromObjWithProperty(new AscCommonExcel.Fill())] = { index: this.nFillMapIndex++, val: new AscCommonExcel.Fill() };
            //не добавляем в oFillMap а делаем nFillMapIndex, потому что элементы совпадают и перетрут друг друга
            this.nFillMapIndex++;
            //проверяем совпадает ли g_oDefaultFill с new Fill
            var sFillHash = this._getStringFromObjWithProperty(g_oDefaultFormat.Fill);
            var oFillDefElement = this.oFillMap[sFillHash];
            if (null == oFillDefElement) {
                this.nDefaultFillIndex = this.nFillMapIndex;
                oFillDefElement =  {index: this.nFillMapIndex++, val: g_oDefaultFormat.Fill};
                this.oFillMap[sFillHash] = oFillDefElement;
            }
            this.oBorderMap[this._getStringFromObjWithProperty(g_oDefaultFormat.Border)] = {index: this.nBorderMapIndex++, val: g_oDefaultFormat.Border};
            this.nNumMapIndex = g_nNumsMaxId;
            var sAlign = "0";
            var oAlign = null;
            if(false == g_oDefaultFormat.Align.isEqual(g_oDefaultFormat.AlignAbs))
            {
                oAlign = g_oDefaultFormat.Align;
                sAlign = this._getStringFromObjWithProperty(g_oDefaultFormat.Align);
            }
            this.prepareXfsStyles();
            var xfs = { borderid: 0, fontid: 0, fillid: oFillDefElement.index, numid: 0, align: oAlign, QuotePrefix: null, PivotButton: null };
            this.oXfsMap["0|0|" + this.nDefaultFillIndex + "|0|" + sAlign] = { index: this.nXfsMapIndex++, val: xfs };
        };
        this.Write = function()
        {
            var oThis = this;
            this._prepeareStyles();
            window["Asc"]["editor"].wb._initCommentsToSave();
            this.bs.WriteItemWithLength(function(){oThis.WriteWorksheetsContent();});
        };
        this.WriteWorksheetsContent = function()
        {
            var oThis = this;
            for(var i = 0, length = this.wb.aWorksheets.length; i < length; ++i)
            {
                //if copy/paste - write only actve ws
                if(this.isCopyPaste && i != this.wb.nActive)
                    continue;
                var ws = this.wb.aWorksheets[i];
                if(null == this.idWorksheet || this.idWorksheet == ws.getId())
                    this.bs.WriteItem(c_oSerWorksheetsTypes.Worksheet, function(){oThis.WriteWorksheet(ws, i);});
            }
        };
        this.WriteWorksheet = function(ws, index)
        {
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

            var aComments = (0 === index) ? this.wb.aComments.concat(ws.aComments) : ws.aComments;
            var aCommentsCoords = (0 === index) ? this.wb.aCommentsCoords.concat(ws.aCommentsCoords) :
              ws.aCommentsCoords;
            if (aComments.length > 0 && aCommentsCoords.length > 0) {
                this.bs.WriteItem(c_oSerWorksheetsTypes.Comments, function () {
                    oThis.WriteComments(aComments, aCommentsCoords);
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
                this.bs.WriteItem(c_oSerWorksheetsTypes.TableParts, function(){oBinaryTableWriter.Write(ws.TableParts);});
            }
			if (ws.aSparklineGroups.length > 0) {
                this.bs.WriteItem(c_oSerWorksheetsTypes.SparklineGroups, function(){oThis.WriteSparklineGroups(ws.aSparklineGroups);});
            }
			for (var i = 0; i < ws.aConditionalFormatting.length; ++i) {
				this.bs.WriteItem(c_oSerWorksheetsTypes.ConditionalFormatting, function(){oThis.WriteConditionalFormatting(ws.aConditionalFormatting[i]);});
			}
			for (var i = 0; i < ws.pivotTables.length; ++i) {
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
                this.memory.WriteByte(c_oSerWorksheetPropTypes.Ref);
                this.memory.WriteByte(c_oSerPropLenType.Variable);
                this.memory.WriteString2(oThis.isCopyPaste.getName());
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
                var oRes = {BestFit: col.BestFit, hd: col.hd, Max: nMax, Min: nMin, xfsid: null, width: col.width, CustomWidth: col.CustomWidth};
                if(null == oRes.width)
                {
                    if(null != ws.oSheetFormatPr.dDefaultColWidth)
                        oRes.width = ws.oSheetFormatPr.dDefaultColWidth;
                    else
                        oRes.width = AscCommonExcel.oDefaultMetrics.ColWidthChars;
                }
                if(null != col.xfs)
                    oRes.xfsid = oThis.prepareXfs(col.xfs);
                return oRes;
            };
            var oAllCol = null;
            if(null != ws.oAllCol)
            {
                oAllCol = fInitCol(ws.oAllCol, 0, gc_nMaxCol0);
                this.oAllColXfsId = oAllCol.xfsid;
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
                if(0 != (AscCommonExcel.g_nRowFlag_CustomHeight & oAllRow.flags))
                {
                    this.memory.WriteByte(c_oSerSheetFormatPrTypes.CustomHeight);
                    this.memory.WriteByte(c_oSerPropLenType.Byte);
                    this.memory.WriteBool(true);
                }
                if(0 != (AscCommonExcel.g_nRowFlag_hd & oAllRow.flags))
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
            //сортируем Row по индексам
            var aIndexes = [];
            //write only active cells, if copy/paste
            if(oThis.isCopyPaste)
            {
                for(var i = oThis.isCopyPaste.r1; i <= oThis.isCopyPaste.r2; i++)
                    aIndexes.push(i);
            }
            else
            {
                for(var i in ws.aGCells)
                    aIndexes.push(i - 0);
            }
            aIndexes.sort(AscCommon.fSortAscending);
            for(var i = 0, length = aIndexes.length; i < length; ++i)
            {
                var row = ws.aGCells[aIndexes[i]];
                if(null != row)
                {
                    if(false == row.isEmpty())
                        this.bs.WriteItem(c_oSerWorksheetsTypes.Row, function(){oThis.WriteRow(row);});
                }
            }
        };
        this.WriteRow = function(oRow)
        {
            var oThis = this;
            if(null != oRow.index)
            {
                this.memory.WriteByte(c_oSerRowTypes.Row);
                this.memory.WriteByte(c_oSerPropLenType.Long);
                this.memory.WriteLong(oRow.index + 1);
            }
            if(null != oRow.xfs)
            {
                var nXfsId = this.prepareXfs(oRow.xfs);
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
            if(0 != (AscCommonExcel.g_nRowFlag_CustomHeight & oRow.flags))
            {
                this.memory.WriteByte(c_oSerRowTypes.CustomHeight);
                this.memory.WriteByte(c_oSerPropLenType.Byte);
                this.memory.WriteBool(true);
            }
            if(0 != (AscCommonExcel.g_nRowFlag_hd & oRow.flags))
            {
                this.memory.WriteByte(c_oSerRowTypes.Hidden);
                this.memory.WriteByte(c_oSerPropLenType.Byte);
                this.memory.WriteBool(true);
            }

            this.memory.WriteByte(c_oSerRowTypes.Cells);
            this.memory.WriteByte(c_oSerPropLenType.Variable);
            this.bs.WriteItemWithLength(function(){oThis.WriteCells(oRow);});
        };
        this.WriteCells = function (row) {
            var oThis = this;
            var aIndexes = [];
            var bIsTablePartContainActiveRange;
            if (oThis.isCopyPaste) {
                for (var i = oThis.isCopyPaste.c1; i <= oThis.isCopyPaste.c2; i++) {
                    aIndexes.push(i);
                }

                var api = window["Asc"]["editor"];
                var ws = api.wb.getWorksheet();
                bIsTablePartContainActiveRange = ws.model.autoFilters.isTablePartContainActiveRange(ws.model.selectionRange.getLast());
            } else {
                for (var i in row.c) {
                    aIndexes.push(i - 0);
                }
            }
            aIndexes.sort(AscCommon.fSortAscending);
            for (var i = 0, length = aIndexes.length; i < length; ++i) {
                var cell = row.c[aIndexes[i]];
                //готовим ячейку к записи
                if (!oThis.isCopyPaste || (oThis.isCopyPaste && cell)) {
                    var nXfsId;
                    var cellXfs = cell.xfs;
                    if (oThis.isCopyPaste && bIsTablePartContainActiveRange) {
                        nXfsId = this.prepareXfs(cell.compiledXfs);
                        cellXfs = cell.compiledXfs;
                    } else {
                        nXfsId = this.prepareXfs(cell.xfs);
                    }

                    //сохраняем как и Excel даже пустой стиль(нужно чтобы убрать стиль строки/колонки)
                    if (null != cellXfs || false == cell.isEmptyText()) {
                        this.bs.WriteItem(c_oSerRowTypes.Cell, function () {
                            oThis.WriteCell(cell, nXfsId, row.index);
                        });
                    }
                }
            }
        };
        this.prepareXfsStyles = function () {
            var styles = this.wb.CellStyles.CustomStyles;
            var xfs = null;
            for(var i = 0, length = styles.length; i < length; ++i) {
				var style = styles[i];
				xfs = style.xfs;
                if (xfs) {
                    var sStyle = this.prepareXfsStyle(xfs);
					//XfId в CustomStyles писать не нужно, поэтому null
                    var oXfs = {borderid: sStyle.borderid, fontid: sStyle.fontid, fillid: sStyle.fillid,
                        numid: sStyle.numid, align: null, QuotePrefix: null, XfId: null, index: style.XfId, PivotButton: null};
                    if("0" != sStyle.align)
                        oXfs.align = xfs.align;
                    if(null != xfs.QuotePrefix)
                        oXfs.QuotePrefix = xfs.QuotePrefix;
					if(null != xfs.PivotButton)
						oXfs.PivotButton = xfs.PivotButton;

                    this.oXfsStylesMap.push(oXfs);
                }
            }
			//XfId это порядковый номер, поэтому сортируем
			this.oXfsStylesMap.sort(function (a, b) {
				return a.index - b.index;
			});
        };
        this.prepareXfsStyle = function(xfs) {
            var sStyle = {val: "", borderid: 0, fontid: 0, fillid: 0, numid: 0, align: "0"};
            if(null != xfs)
            {
                if(null != xfs.font)
                {
                    var sHash = this._getStringFromObjWithProperty(xfs.font);
                    var elem = this.oFontMap[sHash];
                    if(null == elem)
                    {
                        sStyle.fontid = this.nFontMapIndex++;
                        this.oFontMap[sHash] = {index: sStyle.fontid, val: xfs.font};
                    }
                    else
                        sStyle.fontid = elem.index;
                }
                sStyle.val += sStyle.fontid.toString();

                if(null != xfs.fill)
                {
                    var sHash = this._getStringFromObjWithProperty(xfs.fill);
                    var elem = this.oFillMap[sHash];
                    if(null == elem)
                    {
                        sStyle.fillid = this.nFillMapIndex++;
                        this.oFillMap[sHash] = {index: sStyle.fillid, val: xfs.fill};
                    }
                    else
                        sStyle.fillid = elem.index;
                }
                else if (0 != this.nDefaultFillIndex) {
                    //если default fill не пустой, то надо его надо записывать даже если null != xfs.fill
                    sStyle.fillid = this.nDefaultFillIndex;
                }
                sStyle.val += "|" + sStyle.fillid.toString();

                if(null != xfs.border)
                {
                    var sHash = this._getStringFromObjWithProperty(xfs.border);
                    var elem = this.oBorderMap[sHash];
                    if(null == elem)
                    {
                        sStyle.borderid = this.nBorderMapIndex++;
                        this.oBorderMap[sHash] = {index: sStyle.borderid, val: xfs.border};
                    }
                    else
                        sStyle.borderid = elem.index;
                }
                sStyle.val += "|" + sStyle.borderid.toString();

                if(null != xfs.num)
                    sStyle.numid = this.getNumIdByFormat(xfs.num);
                sStyle.val += "|" + sStyle.numid.toString();

                if(null != xfs.align && false == xfs.align.isEqual(g_oDefaultFormat.AlignAbs))
                    sStyle.align = this._getStringFromObjWithProperty(xfs.align);
                sStyle.val += "|" + sStyle.align;
                sStyle.val += "|";
                if (null != xfs.QuotePrefix) {
                  sStyle.val += xfs.QuotePrefix;
                }
				sStyle.val += "|";
				if (null != xfs.PivotButton) {
					sStyle.val += xfs.PivotButton;
				}
                sStyle.val += "|";
                if (null != xfs.XfId) {
                  sStyle.val += xfs.XfId;
                }
            }

            return sStyle;
        };
      this.getNumIdByFormat = function(num) {
        var numid = null;
        //стандартные форматы не записываем в map, на них можно ссылаться по id
        var nStandartId;
        if (null != num.id) {
          nStandartId = num.id;
        } else {
          nStandartId = AscCommonExcel.aStandartNumFormatsId[num.getFormat()];
        }

        if (null == nStandartId) {
          var sHash = this._getStringFromObjWithProperty(num);
          var elem = this.oNumMap[sHash];
          if (null == elem) {
            numid = this.nNumMapIndex++;
            this.oNumMap[sHash] = {index: numid, val: num};
          } else {
            numid = elem.index;
          }
        } else {
          numid = nStandartId;
        }
        return numid;
      };
        this.prepareXfs = function(xfs)
        {
            var nXfsId = 0;
            if(null != xfs)
            {
                var sStyle = this.prepareXfsStyle(xfs);
                var oXfsMapObj = this.oXfsMap[sStyle.val];
                if(null == oXfsMapObj)
                {
                    nXfsId = this.nXfsMapIndex;
                    var oXfs = {borderid: sStyle.borderid, fontid: sStyle.fontid, fillid: sStyle.fillid,
                        numid: sStyle.numid, align: null, QuotePrefix: null, XfId: xfs.XfId, PivotButton: null};
                    if("0" != sStyle.align)
                        oXfs.align = xfs.align;
                    if(null != xfs.QuotePrefix)
                        oXfs.QuotePrefix = xfs.QuotePrefix;
					if(null != xfs.PivotButton)
						oXfs.PivotButton = xfs.PivotButton;
                    this.oXfsMap[sStyle.val] = {index: this.nXfsMapIndex++, val: oXfs};
                }
                else
                    nXfsId = oXfsMapObj.index;
            }
            return nXfsId;
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
				if(null != cell.formulaParsed)
					this.bs.WriteItem(c_oSerCellTypes.Formula, function(){oThis.WriteFormula(cell.formulaParsed);});
				if(null != cell.oValue && false == cell.oValue.isEmpty())
				{
					var dValue = 0;
					if(CellValueType.Error == nCellType || CellValueType.String == nCellType)
					{
						var sText = "";
						var aText = null;
						if(null != cell.oValue.text)
							sText = cell.oValue.text;
						else if(null != cell.oValue.multiText)
						{
							aText = cell.oValue.multiText;
							for(var i = 0, length = cell.oValue.multiText.length; i < length; ++i)
								sText += cell.oValue.multiText[i].text;
						}
						var item = this.oSharedStrings.strings[sText];
						var bAddItem = false;
						if(null == item)
						{
							item = {t: null, a: []};
							bAddItem = true;
						}
						if(null == aText)
						{
							if(null == item.t)
							{
								dValue = this.oSharedStrings.index++;
								item.t = {id: dValue, val: sText};
							}
							else
								dValue = item.t.id;
						}
						else
						{
							var bFound = false;
							for(var i = 0, length = item.a.length; i < length; ++i)
							{
								var oCurItem = item.a[i];
								if(oCurItem.val.length == aText.length)
								{
									var bEqual = true;
									for(var j = 0, length2 = aText.length; j < length2; ++j)
									{
										if(false == aText[j].isEqual(oCurItem.val[j]))
										{
											bEqual = false;
											break;
										}
									}
									if(bEqual)
									{
										bFound = true;
										dValue = oCurItem.id;
										break;
									}
								}
							}
							if(false == bFound)
							{
								dValue = this.oSharedStrings.index++;
								item.a.push({id: dValue, val: aText});
							}
						}
						if(bAddItem)
							this.oSharedStrings.strings[sText] = item;
					}
					else
					{
						if(null != cell.oValue.number)
							dValue = cell.oValue.number;
					}
					this.bs.WriteItem(c_oSerCellTypes.Value, function(){oThis.memory.WriteDouble2(dValue);});
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
        this.WriteComments = function(aComments, aCommentsCoords)
        {
            var oThis = this;
            var oNewComments = {}, i, length, elem, nRow, nCol, row, comment;
            for(i = 0, length = aComments.length; i < length; ++i)
            {
                //write only active comments, if copy/paste
                if(this.isCopyPaste && !this.isCopyPaste.contains(aComments[i].nCol, aComments[i].nRow))
                    continue;

                elem = aComments[i];
                nRow = elem.asc_getRow();
                if(null == nRow)
                    nRow = 0;
                nCol = elem.asc_getCol();
                if(null == nCol)
                    nCol = 0;
                row = oNewComments[nRow];
                if(null == row)
                {
                    row = {};
                    oNewComments[nRow] = row;
                }
                comment = row[nCol];
                if(null == comment)
                {
                    comment = {data: [], coord: null};
                    row[nCol] = comment;
                }
                comment.data.push(elem);
            }
            for(i = 0, length = aCommentsCoords.length; i < length; ++i)
            {
                //write only active comments, if copy/paste
                if(this.isCopyPaste && !this.isCopyPaste.contains(aCommentsCoords[i].nCol, aCommentsCoords[i].nRow))
                    continue;
                elem = aCommentsCoords[i];
                nRow = elem.asc_getRow();
                if(null == nRow)
                    nRow = 0;
                nCol = elem.asc_getCol();
                if(null == nCol)
                    nCol = 0;
                row = oNewComments[nRow];
                if(null == row)
                {
                    row = {};
                    oNewComments[nRow] = row;
                }
                comment = row[nCol];
                if(null == comment)
                {
                    comment = {data: [], coord: null};
                    row[nCol] = comment;
                }
                comment.coord = elem;
            }
            for(i in oNewComments)
            {
                row = oNewComments[i];
                for(var j in row)
                {
                    comment = row[j];
                    if(null == comment.coord || 0 == comment.data.length)
                        continue;
                    var coord = comment.coord;
                    if(null == coord.asc_getLeft() || null == coord.asc_getTop() || null == coord.asc_getRight() || null == coord.asc_getBottom() ||
                        null == coord.asc_getLeftOffset() || null == coord.asc_getTopOffset() || null == coord.asc_getRightOffset() || null == coord.asc_getBottomOffset() ||
                        null == coord.asc_getLeftMM() || null == coord.asc_getTopMM() || null == coord.asc_getWidthMM() || null == coord.asc_getHeightMM())
                        continue;
                    this.bs.WriteItem(c_oSerWorksheetsTypes.Comment, function(){oThis.WriteComment(comment);});
                }
            }
        };
        this.WriteComment = function(comment)
        {
            var oThis = this;
            this.memory.WriteByte(c_oSer_Comments.Row);
            this.memory.WriteByte(c_oSerPropLenType.Long);
            this.memory.WriteLong(comment.coord.asc_getRow());

            this.memory.WriteByte(c_oSer_Comments.Col);
            this.memory.WriteByte(c_oSerPropLenType.Long);
            this.memory.WriteLong(comment.coord.asc_getCol());

            this.memory.WriteByte(c_oSer_Comments.CommentDatas);
            this.memory.WriteByte(c_oSerPropLenType.Variable);
            this.bs.WriteItemWithLength(function(){oThis.WriteCommentDatas(comment.data);});

            this.memory.WriteByte(c_oSer_Comments.Left);
            this.memory.WriteByte(c_oSerPropLenType.Long);
            this.memory.WriteLong(comment.coord.asc_getLeft());

            this.memory.WriteByte(c_oSer_Comments.Top);
            this.memory.WriteByte(c_oSerPropLenType.Long);
            this.memory.WriteLong(comment.coord.asc_getTop());

            this.memory.WriteByte(c_oSer_Comments.Right);
            this.memory.WriteByte(c_oSerPropLenType.Long);
            this.memory.WriteLong(comment.coord.asc_getRight());

            this.memory.WriteByte(c_oSer_Comments.Bottom);
            this.memory.WriteByte(c_oSerPropLenType.Long);
            this.memory.WriteLong(comment.coord.asc_getBottom());

            this.memory.WriteByte(c_oSer_Comments.LeftOffset);
            this.memory.WriteByte(c_oSerPropLenType.Long);
            this.memory.WriteLong(comment.coord.asc_getLeftOffset());

            this.memory.WriteByte(c_oSer_Comments.TopOffset);
            this.memory.WriteByte(c_oSerPropLenType.Long);
            this.memory.WriteLong(comment.coord.asc_getTopOffset());

            this.memory.WriteByte(c_oSer_Comments.RightOffset);
            this.memory.WriteByte(c_oSerPropLenType.Long);
            this.memory.WriteLong(comment.coord.asc_getRightOffset());

            this.memory.WriteByte(c_oSer_Comments.BottomOffset);
            this.memory.WriteByte(c_oSerPropLenType.Long);
            this.memory.WriteLong(comment.coord.asc_getBottomOffset());

            this.memory.WriteByte(c_oSer_Comments.LeftMM);
            this.memory.WriteByte(c_oSerPropLenType.Double);
            this.memory.WriteDouble2(comment.coord.asc_getLeftMM());

            this.memory.WriteByte(c_oSer_Comments.TopMM);
            this.memory.WriteByte(c_oSerPropLenType.Double);
            this.memory.WriteDouble2(comment.coord.asc_getTopMM());

            this.memory.WriteByte(c_oSer_Comments.WidthMM);
            this.memory.WriteByte(c_oSerPropLenType.Double);
            this.memory.WriteDouble2(comment.coord.asc_getWidthMM());

            this.memory.WriteByte(c_oSer_Comments.HeightMM);
            this.memory.WriteByte(c_oSerPropLenType.Double);
            this.memory.WriteDouble2(comment.coord.asc_getHeightMM());

            this.memory.WriteByte(c_oSer_Comments.MoveWithCells);
            this.memory.WriteByte(c_oSerPropLenType.Byte);
            this.memory.WriteBool(comment.coord.asc_getMoveWithCells());

            this.memory.WriteByte(c_oSer_Comments.SizeWithCells);
            this.memory.WriteByte(c_oSerPropLenType.Byte);
            this.memory.WriteBool(comment.coord.asc_getSizeWithCells());
        };
        this.WriteCommentDatas = function(aDatas)
        {
            var oThis = this;
            for(var i = 0, length = aDatas.length; i < length; ++i)
                this.bs.WriteItem( c_oSer_Comments.CommentData, function(){oThis.WriteCommentData(aDatas[i]);});
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
		this.WriteConditionalFormatting = function(oCf)
		{
			var oThis = this;
			if (null != oCf.pivot) {
				this.bs.WriteItem(c_oSer_ConditionalFormatting.Pivot, function() {oThis.memory.WriteBool(oCf.pivot);});
			}
			if (null != oCf.ranges) {
				var sqref = getSqRefString(oCf.ranges);
				this.bs.WriteItem(c_oSer_ConditionalFormatting.SqRef, function() {oThis.memory.WriteString3(sqref);});
			}
			for (var i = 0; i < oCf.aRules.length; ++i) {
				this.bs.WriteItem(c_oSer_ConditionalFormatting.ConditionalFormattingRule, function() {oThis.WriteConditionalFormattingRule(oCf.aRules[i]);});
			}
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
        this.Write = function(idWorksheet)
        {
            //если idWorksheet не null, то надо серализовать только его.
            pptx_content_writer._Start();
            this.WriteMainTable(idWorksheet);
            pptx_content_writer._End();
            return this.WriteFileHeader(this.Memory.GetCurPosition()) + this.Memory.GetBase64Memory();
        };
        this.Write2 = function(idWorksheet)
        {
            //если idWorksheet не null, то надо серализовать только его.
            pptx_content_writer._Start();
            this.WriteMainTable(idWorksheet);
            pptx_content_writer._End();
        };
        this.WriteFileHeader = function(nDataSize)
        {
            return AscCommon.c_oSerFormat.Signature + ";v" + AscCommon.c_oSerFormat.Version + ";" + nDataSize  + ";";
        };
        this.WriteMainTable = function(idWorksheet)
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
            this.WriteTable(c_oSerTableTypes.Workbook, new BinaryWorkbookTableWriter(this.Memory, this.wb));
            //Worksheets
            var aXfs = [];
            var aFonts = [];
            var aFills = [];
            var aBorders = [];
            var aNums = [];
            var aDxfs = [];
            var oBinaryWorksheetsTableWriter = new BinaryWorksheetsTableWriter(this.Memory, this.wb, oSharedStrings, aDxfs, aXfs, aFonts, aFills, aBorders, aNums, idWorksheet, this.isCopyPaste);
            this.WriteTable(c_oSerTableTypes.Worksheets, oBinaryWorksheetsTableWriter);
            //OtherTable
            if(!this.isCopyPaste)
                this.WriteTable(c_oSerTableTypes.Other, new BinaryOtherTableWriter(this.Memory, this.wb));
            //Write SharedStrings
            this.WriteReserved(new BinarySharedStringsTableWriter(this.Memory, oSharedStrings), nSharedStringsPos);
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
                oAutoFilter.Ref = AscCommonExcel.g_oRangeCache.getAscRange(this.stream.GetString2LE(length));
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
            return this.bcr.ReadTable(function(t, l){
                return oThis.ReadSharedStringContent(t,l);
            });
        };
        this.ReadSharedStringContent = function(type, length)
        {
            var res = c_oSerConstants.ReadOk;
            if ( c_oSerSharedStringTypes.Si === type )
            {
                var oThis = this;
                var Si = new AscCommonExcel.CCellValue();
                res = this.bcr.Read1(length, function(t,l){
                    return oThis.ReadSharedString(t,l,Si);
                });
                if(null != this.aSharedStrings)
                    this.aSharedStrings.push(Si);
            }
            else
                res = c_oSerConstants.ReadUnknown;
            return res;
        };
        this.ReadSharedString = function(type, length, Si)
        {
            var res = c_oSerConstants.ReadOk;
            if ( c_oSerSharedStringTypes.Run == type )
            {
                var oThis = this;
                var oRun = new AscCommonExcel.CCellValueMultiText();
                res = this.bcr.Read1(length, function(t,l){
                    return oThis.ReadRun(t,l,oRun);
                });
                if(null == Si.multiText)
                    Si.multiText = [];
                Si.multiText.push(oRun);
            }
            else if ( c_oSerSharedStringTypes.Text == type )
            {
                if(null == Si.text)
                    Si.text = "";
                Si.text += this.stream.GetString2LE(length);
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
    function Binary_StylesTableReader(stream, wb, aCellXfs, Dxfs, isCopyPaste)
    {
        this.stream = stream;
        this.wb = wb;
        this.oStyleManager = wb.oStyleManager;
        this.aCellXfs = aCellXfs;
        this.Dxfs = Dxfs;
        this.bcr = new Binary_CommonReader(this.stream);
        this.bssr = new Binary_SharedStringTableReader(this.stream, wb);
		this.isCopyPaste = isCopyPaste;
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

                oCellStyle.xfs = new AscCommonExcel.CellXfs();
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
                        oCellStyle.xfs.border = borderCellStyle.clone();
                }
                // Fill
                if (null != oCellStyleXfs.fillid) {
                    var fillCellStyle = oStyleObject.aFills[oCellStyleXfs.fillid];
                    if(null != fillCellStyle)
                        oCellStyle.xfs.fill = fillCellStyle.clone();
                }
                // Font
                if(null != oCellStyleXfs.fontid) {
                    var fontCellStyle = oStyleObject.aFonts[oCellStyleXfs.fontid];
                    if(null != fontCellStyle)
                        oCellStyle.xfs.font = fontCellStyle.clone();
                }
                // NumFmt
                if(null != oCellStyleXfs.numid) {
                    var oCurNumCellStyle = oStyleObject.oNumFmts[oCellStyleXfs.numid];
                    if(null != oCurNumCellStyle)
                        oCellStyle.xfs.num = this.ParseNum(oCurNumCellStyle, oStyleObject.oNumFmts);
                    else
                        oCellStyle.xfs.num = this.ParseNum({id: oCellStyleXfs.numid, f: null}, oStyleObject.oNumFmts);
                }
                // QuotePrefix
                if(null != oCellStyleXfs.QuotePrefix)
                    oCellStyle.xfs.QuotePrefix = oCellStyleXfs.QuotePrefix;
				//PivotButton
				if(null != oCellStyleXfs.PivotButton)
					oCellStyle.xfs.PivotButton = oCellStyleXfs.PivotButton;
                // align
                if(null != oCellStyleXfs.align)
                    oCellStyle.xfs.align = oCellStyleXfs.align.clone();
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
                var oNewXfs = new AscCommonExcel.CellXfs();

                if(null != xfs.borderid)
                {
                    var border = oStyleObject.aBorders[xfs.borderid];
                    if(null != border)
                        oNewXfs.border = border.clone();
                }
                if(null != xfs.fillid)
                {
                    var fill = oStyleObject.aFills[xfs.fillid];
                    if(null != fill)
                        oNewXfs.fill = fill.clone();
                }
                if(null != xfs.fontid)
                {
                    var font = oStyleObject.aFonts[xfs.fontid];
                    if(null != font)
                        oNewXfs.font = font.clone();
                }
                if(null != xfs.numid)
                {
                    var oCurNum = oStyleObject.oNumFmts[xfs.numid];
                    if(null != oCurNum)
                        oNewXfs.num = this.ParseNum(oCurNum, oStyleObject.oNumFmts);
                    else
                        oNewXfs.num = this.ParseNum({id: xfs.numid, f: null}, oStyleObject.oNumFmts);
                }
                if(null != xfs.QuotePrefix)
                    oNewXfs.QuotePrefix = xfs.QuotePrefix;
				if(null != xfs.PivotButton)
					oNewXfs.PivotButton = xfs.PivotButton;
                if(null != xfs.align)
                    oNewXfs.align = xfs.align.clone();
                if (null !== xfs.XfId) {
                    XfIdTmp = arrStyleMap[xfs.XfId];
                    if (null == XfIdTmp)
                        XfIdTmp = 0;
                    oNewXfs.XfId = XfIdTmp;
                }

                if(0 == this.aCellXfs.length && !this.isCopyPaste)
                    this.oStyleManager.init(oNewXfs, this.wb);
                // При открытии стиль будет ссылкой
                oNewXfs.isReference = true;
                this.aCellXfs.push(oNewXfs);
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
        var oRes = null;
        var sFormat = null;
        if (null != oNum && null != oNum.f) {
          sFormat = oNum.f;
        } else {
          var sStandartNumFormat = AscCommonExcel.aStandartNumFormats[oNum.id];
          if (null != sStandartNumFormat) {
            sFormat = sStandartNumFormat;
          }
          if (null == sFormat) {
            sFormat = "General";
          }
          if (null != oNumFmts) {
            oNumFmts[oNum.id] = {id: oNum.id, f: sFormat};
          }
        }
        if (null != sFormat) {
          oRes = new AscCommonExcel.Num();
          oRes.f = sFormat;
          if ((5 <= oNum.id && oNum.id <= 8) || (14 <= oNum.id && oNum.id <= 17) || 22 ==  oNum.id || (27 <= oNum.id && oNum.id <= 31) || (36 <= oNum.id && oNum.id <= 44)) {
            oRes.id = oNum.id;
          }
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
            } else if (c_oSerStylesTypes.Fills === type) {
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadFills(t, l, oStyleObject.aFills);
                });
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
                if(null != oNewNumFmt.id && null != oNewNumFmt.f)
                    oNumFmts[oNewNumFmt.id] = oNewNumFmt;
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
                    oDxf.num = this.ParseNum({id: oNewNumFmt.id, f: null}, null);
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
    function Binary_WorkbookTableReader(stream, oWorkbook)
    {
        this.stream = stream;
        this.oWorkbook = oWorkbook;
        this.bcr = new Binary_CommonReader(this.stream);
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
            else
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
					var api = window["Asc"]["editor"];
					var nActiveSheet = api.wb.model.nActive;
					var ws = api.wb.model.aWorksheets[nActiveSheet];
					var DrawingDocument = ws.DrawingDocument;
					
					oNewWorksheet.DrawingDocument = DrawingDocument;
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
            var oBinary_TableReader;
            if ( c_oSerWorksheetsTypes.WorksheetProp == type )
            {
                res = this.bcr.Read2Spreadsheet(length, function(t,l){
                    return oThis.ReadWorksheetProp(t,l, oWorksheet);
                });
            }
            else if ( c_oSerWorksheetsTypes.Cols == type )
            {
                var oConditionalFormatting = null;
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
                    if(null != oFrom.hd)
                        oTo.hd = oFrom.hd;
                    if(null != oFrom.xfs)
                        oTo.xfs = oFrom.xfs.clone();
                    else if(null != oFrom.xfsid)
                    {
                        var xfs = oThis.aCellXfs[oFrom.xfsid];
                        if(null != xfs)
                        {
                            oFrom.xfs = xfs;
                            oTo.xfs = xfs.clone();
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
                res = this.bcr.Read1(length, function(t,l){
                    return oThis.ReadSheetData(t,l, oWorksheet);
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
					oWorksheet.aConditionalFormatting.push(oConditionalFormatting);
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
                oAllRow.h = this.stream.GetDoubleLE();
            }
            else if ( c_oSerSheetFormatPrTypes.CustomHeight == type )
            {
                var oAllRow = oWorksheet.getAllRow();
				var CustomHeight = this.stream.GetBool();
				if(CustomHeight)
					oAllRow.flags |= AscCommonExcel.g_nRowFlag_CustomHeight;
            }
            else if ( c_oSerSheetFormatPrTypes.ZeroHeight == type )
            {
                var oAllRow = oWorksheet.getAllRow();
				var hd = this.stream.GetBool();
				if(hd)
					oAllRow.flags |= AscCommonExcel.g_nRowFlag_hd;
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
        this.ReadSheetData = function(type, length, ws)
        {
            var res = c_oSerConstants.ReadOk;
            var oThis = this;
            if ( c_oSerWorksheetsTypes.Row == type )
            {
				var oCellOffset = {pos: null, len: null};
                var oNewRow = new AscCommonExcel.Row(ws);
                res = this.bcr.Read2Spreadsheet(length, function(t,l){
                    return oThis.ReadRow(t,l, oNewRow, ws, oCellOffset);
                });
                if(oNewRow.index >= 0){
					//читаем ячейки
					if(null != oCellOffset.pos && null != oCellOffset.len){
						var nOldPos = this.stream.GetCurPos();
						this.stream.Seek2(oCellOffset.pos);
						res = this.bcr.Read1(oCellOffset.len, function(t,l){
							return oThis.ReadCells(t,l, ws, oNewRow);
						});
						this.stream.Seek2(nOldPos);
					}
                    ws.aGCells[oNewRow.index] = oNewRow;
				}
            }
            else
                res = c_oSerConstants.ReadUnknown;
            return res;
        };
        this.ReadRow = function(type, length, oRow, ws, oCellOffset)
        {
            var res = c_oSerConstants.ReadOk;
            var oThis = this;
            if ( c_oSerRowTypes.Row == type )
            {
                oRow.index = this.stream.GetULongLE() - 1;
                if(oRow.index >= ws.nRowsCount)
                    ws.nRowsCount = oRow.index + 1;
            }
            else if ( c_oSerRowTypes.Style == type )
            {
                var xfs = this.aCellXfs[this.stream.GetULongLE()];
                if(null != xfs)
                    oRow.xfs = xfs.clone();
            }
            else if ( c_oSerRowTypes.Height == type )
            {
                oRow.h = this.stream.GetDoubleLE();
                if(AscCommon.CurFileVersion < 2)
                    oRow.flags |= AscCommonExcel.g_nRowFlag_CustomHeight;
            }
            else if ( c_oSerRowTypes.CustomHeight == type )
			{
				var CustomHeight = this.stream.GetBool();
				if(CustomHeight)
					oRow.flags |= AscCommonExcel.g_nRowFlag_CustomHeight;
			}
            else if ( c_oSerRowTypes.Hidden == type )
			{
				var hd = this.stream.GetBool();
				if(hd)
					oRow.flags |= AscCommonExcel.g_nRowFlag_hd;
			}
            else if ( c_oSerRowTypes.Cells == type )
            {
				//запоминам место чтобы читать Cells в конце, когда уже зачитан oRow.index
				oCellOffset.pos = this.stream.GetCurPos();
				oCellOffset.len = length;
				res = c_oSerConstants.ReadUnknown;
            }
            else
                res = c_oSerConstants.ReadUnknown;
            return res;
        };
        this.ReadCells = function(type, length, ws, row)
        {
            var res = c_oSerConstants.ReadOk;
            var oThis = this;
            if ( c_oSerRowTypes.Cell == type )
            {
                var oNewCell = new AscCommonExcel.Cell(ws);
                res = this.bcr.Read1(length, function(t,l){
                    return oThis.ReadCell(t,l, ws, oNewCell, row.index);
                });
                if(oNewCell.nRow >= 0 && oNewCell.nCol >= 0)
                {
                    //вычисляем nColsCount
                    var nCellCol = oNewCell.nCol;
                    if(nCellCol >= ws.nColsCount)
                        ws.nColsCount = nCellCol + 1;
                    if(null != oNewCell.oValue.number && (CellValueType.String == oNewCell.oValue.type || CellValueType.Error == oNewCell.oValue.type))
                    {
                        var ss = this.aSharedStrings[oNewCell.oValue.number];
                        if(null != ss)
                        {
                            var nType = oNewCell.oValue.type;
                            oNewCell.oValue = ss.clone(oNewCell);
                            oNewCell.oValue.type = nType;
                        }
                    }
                    row.c[nCellCol] = oNewCell;
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
				oCell.nRow = nRowIndex;
				oCell.nCol = oCellAddress.getCol0();
			}
            else if ( c_oSerCellTypes.RefRowCol == type ){
				var nRow = this.stream.GetULongLE();//todo не используем можно убрать
				oCell.nRow = nRowIndex;
				oCell.nCol = this.stream.GetULongLE();
			}
            else if( c_oSerCellTypes.Style == type )
            {
                var nStyleIndex = this.stream.GetULongLE();
                if(0 != nStyleIndex)
                {
                    var xfs = this.aCellXfs[nStyleIndex];
                    if(null != xfs)
                        oCell.xfs = xfs;  // Не делаем копию, оставляем ссылку
                }
            }
            else if( c_oSerCellTypes.Type == type )
            {
                switch(this.stream.GetUChar())
                {
                    case ECellTypeType.celltypeBool: oCell.oValue.type = CellValueType.Bool;break;
                    case ECellTypeType.celltypeError: oCell.oValue.type = CellValueType.Error;break;
                    case ECellTypeType.celltypeNumber: oCell.oValue.type = CellValueType.Number;break;
                    case ECellTypeType.celltypeSharedString: oCell.oValue.type = CellValueType.String;break;
                }
            }
            else if( c_oSerCellTypes.Formula == type )
            {
				var oFormulaExt = {aca: null, bx: null, ca: null, del1: null, del2: null, dt2d: null, dtr: null, r1: null, r2: null, ref: null, si: null, t: null, v: null};
                res = this.bcr.Read2Spreadsheet(length, function(t,l){
                    return oThis.ReadFormula(t,l, oFormulaExt);
                });
				ws.aFormulaExt.push({cell: oCell, ext: oFormulaExt});
            }
            else if( c_oSerCellTypes.Value == type )
                oCell.oValue.number = this.stream.GetDoubleLE();
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
                if(null != oGraphicObject && !((oGraphicObject.getObjectType() === AscDFH.historyitem_type_Shape || oGraphicObject.getObjectType() === AscDFH.historyitem_type_ImageShape) && !oGraphicObject.spPr))
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
            if ( c_oSerWorksheetsTypes.Comment == type )
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
                    var elem = aCommentData[i];
                    elem.asc_putRow(oCommentCoords.asc_getRow());
                    elem.asc_putCol(oCommentCoords.asc_getCol());

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
                oCommentCoords.asc_setRow(this.stream.GetULongLE());
            else if ( c_oSer_Comments.Col == type )
                oCommentCoords.asc_setCol(this.stream.GetULongLE());
            else if ( c_oSer_Comments.CommentDatas == type )
            {
                res = this.bcr.Read1(length, function(t,l){
                    return oThis.ReadCommentDatas(t,l, aCommentData);
                });
            }
            else if ( c_oSer_Comments.Left == type )
                oCommentCoords.asc_setLeft(this.stream.GetULongLE());
            else if ( c_oSer_Comments.LeftOffset == type )
                oCommentCoords.asc_setLeftOffset(this.stream.GetULongLE());
            else if ( c_oSer_Comments.Top == type )
                oCommentCoords.asc_setTop(this.stream.GetULongLE());
            else if ( c_oSer_Comments.TopOffset == type )
                oCommentCoords.asc_setTopOffset(this.stream.GetULongLE());
            else if ( c_oSer_Comments.Right == type )
                oCommentCoords.asc_setRight(this.stream.GetULongLE());
            else if ( c_oSer_Comments.RightOffset == type )
                oCommentCoords.asc_setRightOffset(this.stream.GetULongLE());
            else if ( c_oSer_Comments.Bottom == type )
                oCommentCoords.asc_setBottom(this.stream.GetULongLE());
            else if ( c_oSer_Comments.BottomOffset == type )
                oCommentCoords.asc_setBottomOffset(this.stream.GetULongLE());
            else if ( c_oSer_Comments.LeftMM == type )
                oCommentCoords.asc_setLeftMM(this.stream.GetDoubleLE());
            else if ( c_oSer_Comments.TopMM == type )
                oCommentCoords.asc_setTopMM(this.stream.GetDoubleLE());
            else if ( c_oSer_Comments.WidthMM == type )
                oCommentCoords.asc_setWidthMM(this.stream.GetDoubleLE());
            else if ( c_oSer_Comments.HeightMM == type )
                oCommentCoords.asc_setHeightMM(this.stream.GetDoubleLE());
            else if ( c_oSer_Comments.MoveWithCells == type )
                oCommentCoords.asc_setMoveWithCells(this.stream.GetBool());
            else if ( c_oSer_Comments.SizeWithCells == type )
                oCommentCoords.asc_setSizeWithCells(this.stream.GetBool());
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
            else if ( c_oSer_OtherType.EmbeddedFonts === type )
            {
                var _count = this.stream.GetULongLE();
                var _embedded_fonts = [];
                for (var i = 0; i < _count; i++)
                {
                    var _at = this.stream.GetUChar();
                    if (_at != AscCommon.g_nodeAttributeStart)
                        break;

                    var _f_i = {};

                    while (true)
                    {
                        _at = this.stream.GetUChar();
                        if (_at == AscCommon.g_nodeAttributeEnd)
                            break;

                        switch (_at)
                        {
                            case 0:
                            {
                                _f_i.Name = this.stream.GetString();
                                break;
                            }
                            case 1:
                            {
                                _f_i.Style = this.stream.GetULongLE();
                                break;
                            }
                            case 2:
                            {
                                _f_i.IsCut = this.stream.GetBool();
                                break;
                            }
                            case 3:
                            {
                                _f_i.IndexCut = this.stream.GetULongLE();
                                break;
                            }
                            default:
                                break;
                        }
                    }

                    _embedded_fonts.push(_f_i);
                }
                var api = this.wb.oApi;
                if(true == api.isUseEmbeddedCutFonts)
                {
                    var font_cuts = api.FontLoader.embedded_cut_manager;
                    font_cuts.Url = AscCommon.g_oDocumentUrls.getUrl('fonts/fonts.js');
                    font_cuts.init_cut_fonts(_embedded_fonts);
                    font_cuts.bIsCutFontsUse = true;
                }
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
            var nType = 0;
            var index = AscCommon.c_oSerFormat.Signature.length;
            var version = "";
            var dst_len = "";
            while (true)
            {
                index++;
                var _c = szSrc.charCodeAt(index);
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

            var dstLen = dst_len >> 0;
            var pointer = g_memory.Alloc(dstLen);
            var stream = new AscCommon.FT_Stream2(pointer.data, dstLen);
            stream.obj = pointer.obj;

            this.getbase64DecodedData2(szSrc, index, stream, 0);

            if(version.length > 1)
            {
                var nTempVersion = version.substring(1) - 0;
                if(nTempVersion)
                    AscCommon.CurFileVersion = nTempVersion;
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
        this.ReadData = function(data, wb)
        {
            History.TurnOff();

            this.stream = new AscCommon.FT_Stream2(data, data.length);
            this.ReadFile(wb);

            ReadDefCellStyles(wb, wb.CellStyles.DefaultStyles);
            //todo
            //ReadDefTableStyles(wb, wb.TableStyles.DefaultStyles);
            //wb.TableStyles.concatStyles();

            History.TurnOn();
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
                            res = (new Binary_WorksheetTableReader(this.stream, this.oReadResult, wb, aSharedStrings, aCellXfs, aDxfs, oMediaArray, this.copyPasteObj)).Read();
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
                        res = (new Binary_WorkbookTableReader(this.stream, wb)).Read();
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
					this.DefaultTableStyle = uq(val);
				}
				val = vals["defaultPivotStyle"];
				if (undefined !== val) {
					this.DefaultPivotStyle = uq(val);
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
    function CTableStyle()
    {
        this.name = null;
        this.pivot = true;
        this.table = true;
        this.displayName = null; // Показываемое имя (для дефалтовых оно будет с пробелами, а для пользовательских совпадает с name)

        this.compiled = null;

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
    CTableStyle.prototype =
    {
        getStyle: function(bbox, rowIndex, colIndex, options, headerRowCount, totalsRowCount)
        {
            //todo есть проблемы при малых размерах таблиц
            var res = null;
            if(null == this.compiled)
                this._compile();
            var styles = this._getOption(options, headerRowCount, totalsRowCount);
            if(headerRowCount > 0 && rowIndex == bbox.r1)
            {
                if(colIndex == bbox.c1)
                    res = styles.headerLeftTop;
                else if(colIndex == bbox.c2)
                    res = styles.headerRightTop;
                else
                    res = styles.header;
            }
            else if(totalsRowCount > 0 && rowIndex == bbox.r2)
            {
                if(colIndex == bbox.c1)
                    res = styles.totalLeftBottom;
                else if(colIndex == bbox.c2)
                    res = styles.totalRightBottom;
                else
                    res = styles.total;
            }
            else if(options.ShowFirstColumn && colIndex == bbox.c1)
            {
                if(rowIndex == bbox.r1 + headerRowCount)
                    res = styles.leftTopFC;
                else if(rowIndex == bbox.r2 - totalsRowCount)
                {
                    if(0 == (rowIndex - headerRowCount) % 2)
                        res = styles.leftBottomRowBand1FC;
                    else
                        res = styles.leftBottomRowBand2FC;
                }
                else
                {
                    if(0 == (rowIndex - headerRowCount) % 2)
                        res = styles.leftRowBand1FC;
                    else
                        res = styles.leftRowBand2FC;
                }
            }
            else if(options.ShowLastColumn && colIndex == bbox.c2)
            {
                if(rowIndex == bbox.r1 + headerRowCount)
                {
                    if(0 == colIndex % 2)
                        res = styles.rightTopColBand1LC;
                    else
                        res = styles.rightTopColBand2LC;
                }
                else if(rowIndex == bbox.r2 - totalsRowCount)
                {
                    if(0 == (rowIndex - headerRowCount) % 2)
                    {
                        if(0 == colIndex % 2)
                            res = styles.rightBottomRowBand1ColBand1LC;
                        else
                            res = styles.rightBottomRowBand1ColBand2LC;
                    }
                    else
                    {
                        if(0 == colIndex % 2)
                            res = styles.rightBottomRowBand2ColBand1LC;
                        else
                            res = styles.rightBottomRowBand2ColBand2LC;
                    }
                }
                else
                {
                    if(0 == (rowIndex - headerRowCount) % 2)
                    {
                        if(0 == colIndex % 2)
                            res = styles.rightRowBand1ColBand1LC;
                        else
                            res = styles.rightRowBand1ColBand2LC;
                    }
                    else
                    {
                        if(0 == colIndex % 2)
                            res = styles.rightRowBand2ColBand1LC;
                        else
                            res = styles.rightRowBand2ColBand2LC;
                    }
                }
            }
            else if(options.ShowRowStripes || options.ShowColumnStripes)
            {
                if(rowIndex == bbox.r1 + headerRowCount)
                {
                    if(colIndex == bbox.c1)
                        res = styles.leftTop;
                    else if(colIndex == bbox.c2)
                    {
                        if(0 == colIndex % 2)
                            res = styles.rightTopColBand1;
                        else
                            res = styles.rightTopColBand2;
                    }
                    else
                    {
                        if(0 == colIndex % 2)
                            res = styles.topColBand1;
                        else
                            res = styles.topColBand2;
                    }
                }
                else if(rowIndex == bbox.r2 - totalsRowCount)
                {
                    if(colIndex == bbox.c1)
                    {
                        if(0 == (rowIndex - headerRowCount) % 2)
                            res = styles.leftBottomRowBand1;
                        else
                            res = styles.leftBottomRowBand2;
                    }
                    else if(colIndex == bbox.c2)
                    {
                        if(0 == (rowIndex - headerRowCount) % 2)
                        {
                            if(0 == colIndex % 2)
                                res = styles.rightBottomRowBand1ColBand1;
                            else
                                res = styles.rightBottomRowBand1ColBand2;
                        }
                        else
                        {
                            if(0 == colIndex % 2)
                                res = styles.rightBottomRowBand2ColBand1;
                            else
                                res = styles.rightBottomRowBand2ColBand2;
                        }
                    }
                    else
                    {
                        if(0 == (rowIndex - headerRowCount) % 2)
                        {
                            if(0 == colIndex % 2)
                                res = styles.bottomRowBand1ColBand1;
                            else
                                res = styles.bottomRowBand1ColBand2;
                        }
                        else
                        {
                            if(0 == colIndex % 2)
                                res = styles.bottomRowBand2ColBand1;
                            else
                                res = styles.bottomRowBand2ColBand2;
                        }
                    }
                }
                else if(colIndex == bbox.c1)
                {
                    if(0 == (rowIndex - headerRowCount) % 2)
                        res = styles.leftRowBand1;
                    else
                        res = styles.leftRowBand2;
                }
                else if(colIndex == bbox.c2)
                {
                    if(0 == (rowIndex - headerRowCount) % 2)
                    {
                        if(0 == colIndex % 2)
                            res = styles.rightRowBand1ColBand1;
                        else
                            res = styles.rightRowBand1ColBand2;
                    }
                    else
                    {
                        if(0 == colIndex % 2)
                            res = styles.rightRowBand2ColBand1;
                        else
                            res = styles.rightRowBand2ColBand2;
                    }
                }
                else
                {
                    if(0 == (rowIndex - headerRowCount) % 2)
                    {
                        if(0 == colIndex % 2)
                            res = styles.innerRowBand1ColBand1;
                        else
                            res = styles.innerRowBand1ColBand2;
                    }
                    else
                    {
                        if(0 == colIndex % 2)
                            res = styles.innerRowBand2ColBand1;
                        else
                            res = styles.innerRowBand2ColBand2;
                    }
                }
            }
            else
            {
                if(rowIndex == bbox.r1 + headerRowCount)
                {
                    if(colIndex == bbox.c1)
                        res = styles.leftTop;
                    else if(colIndex == bbox.c2)
                        res = styles.rightTopColBand1;
                    else
                        res = styles.topColBand1;
                }
                else if(rowIndex == bbox.r2 - totalsRowCount)
                {
                    if(colIndex == bbox.c1)
                        res = styles.leftBottomRowBand1;
                    else if(colIndex == bbox.c2)
                        res = styles.rightBottomRowBand1ColBand1;
                    else
                        res = styles.bottomRowBand1ColBand1;
                }
                else if(colIndex == bbox.c1)
                    res = styles.leftRowBand1;
                else if(colIndex == bbox.c2)
                    res = styles.rightRowBand1ColBand1;
                else
                    res = styles.innerRowBand1ColBand1;
            }
            return res;
        },
        _getOption: function(options, headerRowCount, totalsRowCount)
        {
            var nBitMask = 0;
            if(options.ShowFirstColumn)
                nBitMask += 1;
            if(options.ShowLastColumn)
                nBitMask += 1 << 1;
            if(options.ShowRowStripes)
                nBitMask += 1 << 2;
            if(options.ShowColumnStripes)
                nBitMask += 1 << 3;
            if(headerRowCount > 0)
                nBitMask += 1 << 4;
            if(totalsRowCount > 0)
                nBitMask += 1 << 5;
            var styles = this.compiled.options[nBitMask];
            if(null == styles)
            {
                var configs = {
                    header: {header: true, top: true},
                    headerLeftTop: {header: true, left: true, top: true},
                    headerRightTop: {header: true, right: true, top: true},
                    total: {total: true, bottom: true},
                    totalLeftBottom: {total: true, left: true, bottom: true},
                    totalRightBottom: {total: true, right: true, bottom: true},
                    leftTop: {ShowRowStripes: true, ShowColumnStripes: true, left: true, top: true, RowBand1: true, ColBand1: true},
                    leftBottomRowBand1: {ShowRowStripes: true, ShowColumnStripes: true, left: true, bottom: true, RowBand1: true, ColBand1: true},
                    leftBottomRowBand2: {ShowRowStripes: true, ShowColumnStripes: true, left: true, bottom: true, RowBand2: true, ColBand1: true},
                    leftRowBand1: {ShowRowStripes: true, ShowColumnStripes: true, left: true, RowBand1: true, ColBand1: true},
                    leftRowBand2: {ShowRowStripes: true, ShowColumnStripes: true, left: true, RowBand2: true, ColBand1: true},
                    rightTopColBand1: {ShowRowStripes: true, ShowColumnStripes: true, right: true, top: true, RowBand1: true, ColBand1: true},
                    rightTopColBand2: {ShowRowStripes: true, ShowColumnStripes: true, right: true, top: true, RowBand1: true, ColBand2: true},
                    rightRowBand1ColBand1: {ShowRowStripes: true, ShowColumnStripes: true, right: true, RowBand1: true, ColBand1: true},
                    rightRowBand1ColBand2: {ShowRowStripes: true, ShowColumnStripes: true, right: true, RowBand1: true, ColBand2: true},
                    rightRowBand2ColBand1: {ShowRowStripes: true, ShowColumnStripes: true, right: true, RowBand2: true, ColBand1: true},
                    rightRowBand2ColBand2: {ShowRowStripes: true, ShowColumnStripes: true, right: true, RowBand2: true, ColBand2: true},
                    rightBottomRowBand1ColBand1: {ShowRowStripes: true, ShowColumnStripes: true, right: true, bottom: true, RowBand1: true, ColBand1: true},
                    rightBottomRowBand1ColBand2: {ShowRowStripes: true, ShowColumnStripes: true, right: true, bottom: true, RowBand1: true, ColBand2: true},
                    rightBottomRowBand2ColBand1: {ShowRowStripes: true, ShowColumnStripes: true, right: true, bottom: true, RowBand2: true, ColBand1: true},
                    rightBottomRowBand2ColBand2: {ShowRowStripes: true, ShowColumnStripes: true, right: true, bottom: true, RowBand2: true, ColBand2: true},
                    topColBand1: {ShowRowStripes: true, ShowColumnStripes: true, top: true, RowBand1: true, ColBand1: true},
                    topColBand2: {ShowRowStripes: true, ShowColumnStripes: true, top: true, RowBand1: true, ColBand2: true},
                    bottomRowBand1ColBand1: {ShowRowStripes: true, ShowColumnStripes: true, bottom: true, RowBand1: true, ColBand1: true},
                    bottomRowBand1ColBand2: {ShowRowStripes: true, ShowColumnStripes: true, bottom: true, RowBand1: true, ColBand2: true},
                    bottomRowBand2ColBand1: {ShowRowStripes: true, ShowColumnStripes: true, bottom: true, RowBand2: true, ColBand1: true},
                    bottomRowBand2ColBand2: {ShowRowStripes: true, ShowColumnStripes: true, bottom: true, RowBand2: true, ColBand2: true},
                    innerRowBand1ColBand1: {ShowRowStripes: true, ShowColumnStripes: true, RowBand1: true, ColBand1: true},
                    innerRowBand1ColBand2: {ShowRowStripes: true, ShowColumnStripes: true, RowBand1: true, ColBand2: true},
                    innerRowBand2ColBand1: {ShowRowStripes: true, ShowColumnStripes: true, RowBand2: true, ColBand1: true},
                    innerRowBand2ColBand2: {ShowRowStripes: true, ShowColumnStripes: true, RowBand2: true, ColBand2: true},
                    leftTopFC: {ShowFirstColumn: true, ShowRowStripes: true, ShowColumnStripes: true, left: true, top: true, RowBand1: true, ColBand1: true},
                    leftBottomRowBand1FC: {ShowFirstColumn: true, ShowRowStripes: true, ShowColumnStripes: true, left: true, bottom: true, RowBand1: true, ColBand1: true},
                    leftBottomRowBand2FC: {ShowFirstColumn: true, ShowRowStripes: true, ShowColumnStripes: true, left: true, bottom: true, RowBand2: true, ColBand1: true},
                    leftRowBand1FC: {ShowFirstColumn: true, ShowRowStripes: true, ShowColumnStripes: true, left: true, RowBand1: true, ColBand1: true},
                    leftRowBand2FC: {ShowFirstColumn: true, ShowRowStripes: true, ShowColumnStripes: true, left: true, RowBand2: true, ColBand1: true},
                    rightTopColBand1LC: {ShowLastColumn: true, ShowRowStripes: true, ShowColumnStripes: true, right: true, top: true, RowBand1: true, ColBand1: true},
                    rightTopColBand2LC: {ShowLastColumn: true, ShowRowStripes: true, ShowColumnStripes: true, right: true, top: true, RowBand1: true, ColBand2: true},
                    rightRowBand1ColBand1LC: {ShowLastColumn: true, ShowRowStripes: true, ShowColumnStripes: true, right: true, RowBand1: true, ColBand1: true},
                    rightRowBand1ColBand2LC: {ShowLastColumn: true, ShowRowStripes: true, ShowColumnStripes: true, right: true, RowBand1: true, ColBand2: true},
                    rightRowBand2ColBand1LC: {ShowLastColumn: true, ShowRowStripes: true, ShowColumnStripes: true, right: true, RowBand2: true, ColBand1: true},
                    rightRowBand2ColBand2LC: {ShowLastColumn: true, ShowRowStripes: true, ShowColumnStripes: true, right: true, RowBand2: true, ColBand2: true},
                    rightBottomRowBand1ColBand1LC: {ShowLastColumn: true, ShowRowStripes: true, ShowColumnStripes: true, right: true, bottom: true, RowBand1: true, ColBand1: true},
                    rightBottomRowBand1ColBand2LC: {ShowLastColumn: true, ShowRowStripes: true, ShowColumnStripes: true, right: true, bottom: true, RowBand1: true, ColBand2: true},
                    rightBottomRowBand2ColBand1LC: {ShowLastColumn: true, ShowRowStripes: true, ShowColumnStripes: true, right: true, bottom: true, RowBand2: true, ColBand1: true},
                    rightBottomRowBand2ColBand2LC: {ShowLastColumn: true, ShowRowStripes: true, ShowColumnStripes: true, right: true, bottom: true, RowBand2: true, ColBand2: true}
                }
                var styles = {};
                for(var i in configs)
                {
                    styles[i] = new AscCommonExcel.CellXfs();
                }
                this._compileOption(options, headerRowCount, totalsRowCount, styles, configs);
                this.compiled.options[nBitMask] = styles;
            }
            return styles;
        },
        _compileSetBorder : function(inputDxf, outputDxf, bLeft, bTop, bRight, bBottom, bInnerHor, bInnerVer)
        {
            if(null != inputDxf && null != inputDxf.border)
            {
                var oCurBorder = inputDxf.border;
                var oNewBorder = new AscCommonExcel.Border();
                if(bLeft)
                    oNewBorder.l = oCurBorder.l;
                else if(bInnerVer)
                    oNewBorder.l = oCurBorder.iv;
                if(bTop)
                    oNewBorder.t = oCurBorder.t;
                else if(bInnerHor)
                    oNewBorder.t = oCurBorder.ih;
                if(bRight)
                    oNewBorder.r = oCurBorder.r;
                else if(bInnerVer)
                    oNewBorder.r = oCurBorder.iv;
                if(bBottom)
                    oNewBorder.b = oCurBorder.b;
                else if(bInnerHor)
                    oNewBorder.b = oCurBorder.ih;

                if(null == outputDxf.border)
                    outputDxf.border = oNewBorder;
                else
                    outputDxf.border = outputDxf.border.merge(oNewBorder);
            }
        },
        _compileSetHeaderBorder : function(inputDxf, outputDxf, bHeader)
        {
            if(null != inputDxf && null != inputDxf.border)
            {
                var oCurBorder = inputDxf.border;
                var oNewBorder = new AscCommonExcel.Border();
                if(bHeader)
                    oNewBorder.t = oCurBorder.b;
                else
                    oNewBorder.b = oCurBorder.t;
                if(null == outputDxf.border)
                    outputDxf.border = oNewBorder;
                else
                    outputDxf.border = outputDxf.border.merge(oNewBorder);
            }
        },
        _compileOption : function(options, headerRowCount, totalsRowCount, styles, configs)
        {
            for(var i in styles)
            {
                var xfs = styles[i];
                var config = configs[i];
                //заглушка для бордеров, чтобы при конфликте нижние бордеры не перекрывали бордеры заголовка
                if(headerRowCount > 0 && config.top && true != config.header)
                {
                    if(options.ShowFirstColumn && null != this.firstHeaderCell && config.left)
                        this._compileSetHeaderBorder(this.firstHeaderCell.dxf, xfs, true);
                    else if(options.ShowLastColumn && null != this.lastHeaderCell && config.right)
                        this._compileSetHeaderBorder(this.lastHeaderCell.dxf, xfs, true);
                    if(null != this.headerRow)
                        this._compileSetHeaderBorder(this.headerRow.dxf, xfs, true);
                }
                if(totalsRowCount > 0 && config.bottom && true != config.total)
                {
                    if(options.ShowFirstColumn && null != this.firstTotalCell && config.left)
                        this._compileSetHeaderBorder(this.firstTotalCell.dxf, xfs, false);
                    else if(options.ShowLastColumn && null != this.lastTotalCell && config.right)
                        this._compileSetHeaderBorder(this.lastTotalCell.dxf, xfs, false);
                    if(null != this.totalRow)
                        this._compileSetHeaderBorder(this.totalRow.dxf, xfs, false);
                }
                if(headerRowCount > 0 && config.header)
                {
                    if(options.ShowFirstColumn && null != this.firstHeaderCell && config.left)
                        xfs = xfs.merge(this.firstHeaderCell.dxf);
                    if(options.ShowLastColumn && null != this.lastHeaderCell && config.right)
                        xfs = xfs.merge(this.lastHeaderCell.dxf);
                    if(null != this.headerRow)
                    {
                        xfs = xfs.merge(this.compiled.headerRow.dxf);
                        //применяем бордер
                        if(config.left)
                            this._compileSetBorder(this.headerRow.dxf, xfs, true, true, false, true, false, true);
                        else if(config.right)
                            this._compileSetBorder(this.headerRow.dxf, xfs, false, true, true, true, false, true);
                        else
                            this._compileSetBorder(this.headerRow.dxf, xfs, false, true, false, true, false, true);
                    }
                    if(options.ShowFirstColumn && null != this.firstColumn && config.left)
                    {
                        xfs = xfs.merge(this.compiled.firstColumn.dxf);
                        //применяем бордер
                        this._compileSetBorder(this.firstColumn.dxf, xfs, true, true, true, false, true, false);
                    }
                    if(options.ShowLastColumn && null != this.lastColumn && config.right)
                    {
                        xfs = xfs.merge(this.compiled.lastColumn.dxf);
                        //применяем бордер
                        this._compileSetBorder(this.lastColumn.dxf, xfs, true, true, true, false, true, false);
                    }
                }
                else if(totalsRowCount > 0 && config.total)
                {
                    if(options.ShowFirstColumn && null != this.firstTotalCell && config.left)
                        xfs = xfs.merge(this.firstTotalCell.dxf);
                    if(options.ShowLastColumn && null != this.lastTotalCell && config.right)
                        xfs = xfs.merge(this.lastTotalCell.dxf);
                    if(null != this.totalRow)
                    {
                        xfs = xfs.merge(this.compiled.totalRow.dxf);
                        //применяем бордер
                        if(config.left)
                            this._compileSetBorder(this.totalRow.dxf, xfs, true, true, false, true, false, true);
                        else if(config.right)
                            this._compileSetBorder(this.totalRow.dxf, xfs, false, true, true, true, false, true);
                        else
                            this._compileSetBorder(this.totalRow.dxf, xfs, false, true, false, true, false, true);
                    }
                    if(options.ShowFirstColumn && null != this.firstColumn && config.left)
                    {
                        xfs = xfs.merge(this.compiled.firstColumn.dxf);
                        //применяем бордер
                        this._compileSetBorder(this.firstColumn.dxf, xfs, true, false, true, true, true, false);
                    }
                    if(options.ShowLastColumn && null != this.lastColumn && config.right)
                    {
                        xfs = xfs.merge(this.compiled.lastColumn.dxf);
                        //применяем бордер
                        this._compileSetBorder(this.lastColumn.dxf, xfs, true, false, true, true, true, false);
                    }
                }
                else
                {
                    if(options.ShowFirstColumn && null != this.firstColumn && config.ShowFirstColumn)
                    {
                        xfs = xfs.merge(this.compiled.firstColumn.dxf);
                        //применяем бордер
                        if(config.left && config.top)
                        {
                            if(headerRowCount > 0)
                                this._compileSetBorder(this.firstColumn.dxf, xfs, true, false, true, false, true, false);
                            else
                                this._compileSetBorder(this.firstColumn.dxf, xfs, true, true, true, false, true, false);
                        }
                        else if(config.left && config.bottom)
                        {
                            if(totalsRowCount > 0)
                                this._compileSetBorder(this.firstColumn.dxf, xfs, true, false, true, false, true, false);
                            else
                                this._compileSetBorder(this.firstColumn.dxf, xfs, true, false, true, true, true, false);
                        }
                        else
                            this._compileSetBorder(this.firstColumn.dxf, xfs, true, false, true, false, true, false);
                    }
                    else if(options.ShowLastColumn && null != this.lastColumn && config.ShowLastColumn)
                    {
                        xfs = xfs.merge(this.compiled.lastColumn.dxf);
                        //применяем бордер
                        if(config.right && config.top)
                        {
                            if(headerRowCount > 0)
                                this._compileSetBorder(this.lastColumn.dxf, xfs, true, false, true, false, true, false);
                            else
                                this._compileSetBorder(this.lastColumn.dxf, xfs, true, true, true, false, true, false);
                        }
                        else if(config.right && config.bottom)
                        {
                            if(totalsRowCount > 0)
                                this._compileSetBorder(this.lastColumn.dxf, xfs, true, false, true, false, true, false);
                            else
                                this._compileSetBorder(this.lastColumn.dxf, xfs, true, false, true, true, true, false);
                        }
                        else
                            this._compileSetBorder(this.lastColumn.dxf, xfs, true, false, true, false, true, false);
                    }
                    if(options.ShowRowStripes && config.ShowRowStripes)
                    {
                        if(null != this.firstRowStripe && config.RowBand1)
                        {
                            xfs = xfs.merge(this.compiled.firstRowStripe.dxf);
                            //применяем бордер
                            if(config.left)
                                this._compileSetBorder(this.firstRowStripe.dxf, xfs, true, true, false, true, false, true);
                            else if(config.right)
                                this._compileSetBorder(this.firstRowStripe.dxf, xfs, false, true, true, true, false, true);
                            else
                                this._compileSetBorder(this.firstRowStripe.dxf, xfs, false, true, false, true, false, true);
                        }
                        else if(null != this.secondRowStripe && config.RowBand2)
                        {
                            xfs = xfs.merge(this.compiled.secondRowStripe.dxf);
                            //применяем бордер
                            if(config.left)
                                this._compileSetBorder(this.secondRowStripe.dxf, xfs, true, true, false, true, false, true);
                            else if(config.right)
                                this._compileSetBorder(this.secondRowStripe.dxf, xfs, false, true, true, true, false, true);
                            else
                                this._compileSetBorder(this.secondRowStripe.dxf, xfs, false, true, false, true, false, true);
                        }
                    }
                    if(options.ShowColumnStripes && config.ShowRowStripes)
                    {
                        if(null != this.firstColumnStripe && config.ColBand1)
                        {
                            xfs = xfs.merge(this.compiled.firstColumnStripe.dxf);
                            //применяем бордер
                            if(config.top)
                                this._compileSetBorder(this.firstColumnStripe.dxf, xfs, true, true, true, false, true, false);
                            else if(config.bottom)
                                this._compileSetBorder(this.firstColumnStripe.dxf, xfs, true, false, true, true, true, false);
                            else
                                this._compileSetBorder(this.firstColumnStripe.dxf, xfs, true, false, true, false, true, false);
                        }
                        else if(null != this.secondColumnStripe && config.ColBand2)
                        {
                            xfs = xfs.merge(this.compiled.secondColumnStripe.dxf);
                            //применяем бордер
                            if(config.top)
                                this._compileSetBorder(this.secondColumnStripe.dxf, xfs, true, true, true, false, true, false);
                            else if(config.bottom)
                                this._compileSetBorder(this.secondColumnStripe.dxf, xfs, true, false, true, true, true, false);
                            else
                                this._compileSetBorder(this.secondColumnStripe.dxf, xfs, true, false, true, false, true, false);
                        }
                    }
                }
                if(null != this.wholeTable)
                {
                    xfs = xfs.merge(this.compiled.wholeTable.dxf);
                    //применяем бордер
                    if(config.top)
                    {
                        if(headerRowCount > 0 && true != config.header)
                        {
                            if(config.left)
                                this._compileSetBorder(this.wholeTable.dxf, xfs, true, false, false, false, true, true);
                            else if(config.right)
                                this._compileSetBorder(this.wholeTable.dxf, xfs, false, false, true, false, true, true);
                            else
                                this._compileSetBorder(this.wholeTable.dxf, xfs, false, false, false, false, true, true);
                        }
                        else
                        {
                            if(config.left)
                                this._compileSetBorder(this.wholeTable.dxf, xfs, true, true, false, false, true, true);
                            else if(config.right)
                                this._compileSetBorder(this.wholeTable.dxf, xfs, false, true, true, false, true, true);
                            else
                                this._compileSetBorder(this.wholeTable.dxf, xfs, false, true, false, false, true, true);
                        }
                    }
                    else if(config.bottom)
                    {
                        if(totalsRowCount > 0 && true != config.total)
                        {
                            if(config.left)
                                this._compileSetBorder(this.wholeTable.dxf, xfs, true, false, false, false, true, true);
                            else if(config.right)
                                this._compileSetBorder(this.wholeTable.dxf, xfs, false, false, true, false, true, true);
                            else
                                this._compileSetBorder(this.wholeTable.dxf, xfs, false, false, false, false, true, true);
                        }
                        else
                        {
                            if(config.left)
                                this._compileSetBorder(this.wholeTable.dxf, xfs, true, false, false, true, true, true);
                            else if(config.right)
                                this._compileSetBorder(this.wholeTable.dxf, xfs, false, false, true, true, true, true);
                            else
                                this._compileSetBorder(this.wholeTable.dxf, xfs, false, false, false, true, true, true);
                        }
                    }
                    else if(config.left)
                        this._compileSetBorder(this.wholeTable.dxf, xfs, true, false, false, false, true, true);
                    else if(config.right)
                        this._compileSetBorder(this.wholeTable.dxf, xfs, false, false, true, false, true, true);
                    else
                        this._compileSetBorder(this.wholeTable.dxf, xfs, false, false, false, false, true, true);
                }
                styles[i] = xfs;
            }
        },
        _compile : function()
        {
            this.compiled = {
                options: {},
                blankRow: null,
                firstColumn: null,
                firstColumnStripe: null,
                firstColumnSubheading: null,
                firstHeaderCell: null,
                firstRowStripe: null,
                firstRowSubheading: null,
                firstSubtotalColumn: null,
                firstSubtotalRow: null,
                firstTotalCell: null,
                headerRow: null,
                lastColumn: null,
                lastHeaderCell: null,
                lastTotalCell: null,
                pageFieldLabels: null,
                pageFieldValues: null,
                secondColumnStripe: null,
                secondColumnSubheading: null,
                secondRowStripe: null,
                secondRowSubheading: null,
                secondSubtotalColumn: null,
                secondSubtotalRow: null,
                thirdColumnSubheading: null,
                thirdRowSubheading: null,
                thirdSubtotalColumn: null,
                thirdSubtotalRow: null,
                totalRow: null,
                wholeTable: null
            }
            //копируем исходные стили только без border
            for(var i in this)
            {
                var elem = this[i];
                if(null != elem && elem instanceof CTableStyleElement)
                {
                    var oNewElem = new CTableStyleElement();
                    oNewElem.size = elem.size;
                    oNewElem.dxf = elem.dxf.clone();
                    oNewElem.dxf.border = null;
                    this.compiled[i] = oNewElem;
                }
            }
        },
		readAttributes: function(attr, uq) {
			if (attr()) {
				var vals = attr();
				var val;
				val = vals["name"];
				if (undefined !== val) {
					this.name = uq(val);
					this.displayName = this.name;
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
		},
		onStartNode: function(elem, attr, uq) {
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
		}
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
			if(undefined !== val){
				this.dxf = openXml.SaxParserDataTransfer.dxfs[val - 1] || null;
			}
		}
	};
    function ReadDefTableStyles(wb)
    {
    	var stylesZip = "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";
		return require('jszip').loadAsync(stylesZip, {"base64": true}).then(function(zip) {
			return zip.files["presetTableStyles.xml"].async("string");
		}).then(function(content) {
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
        var sStyles = "XLSY;;11509;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aQBiAHIAaQAJAQEGBQAAAAAAACZABhcAAAAAEgAAAAENAAAAAgEFAwXNZeYyc5npPwcAAAAAAKwAAAABBAAAACYAAAADKAAAAAQaAAAAMgAwACUAIAAtACAAQQBjAGMAZQBuAHQAMwAFBAAAAAEAAAAEIQAAAAABAAEBAAQBAAYEAAAAAAcEAgAAAAgEAQAAAAkEAAAAAAUqAAAAAQYDAAAAAgEBBAYOAAAAQwBhAGwAaQBiAHIAaQAJAQEGBQAAAAAAACZABhcAAAAAEgAAAAENAAAAAgEGAwXNZeYyc5npPwcAAAAAAKwAAAABBAAAACoAAAADKAAAAAQaAAAAMgAwACUAIAAtACAAQQBjAGMAZQBuAHQANAAFBAAAAAEAAAAEIQAAAAABAAEBAAQBAAYEAAAAAAcEAgAAAAgEAQAAAAkEAAAAAAUqAAAAAQYDAAAAAgEBBAYOAAAAQwBhAGwAaQBiAHIAaQAJAQEGBQAAAAAAACZABhcAAAAAEgAAAAENAAAAAgEHAwXNZeYyc5npPwcAAAAAAKwAAAABBAAAAC4AAAADKAAAAAQaAAAAMgAwACUAIAAtACAAQQBjAGMAZQBuAHQANQAFBAAAAAEAAAAEIQAAAAABAAEBAAQBAAYEAAAAAAcEAgAAAAgEAQAAAAkEAAAAAAUqAAAAAQYDAAAAAgEBBAYOAAAAQwBhAGwAaQBiAHIAaQAJAQEGBQAAAAAAACZABhcAAAAAEgAAAAENAAAAAgEIAwXNZeYyc5npPwcAAAAAAKwAAAABBAAAADIAAAADKAAAAAQaAAAAMgAwACUAIAAtACAAQQBjAGMAZQBuAHQANgAFBAAAAAEAAAAEIQAAAAABAAEBAAQBAAYEAAAAAAcEAgAAAAgEAQAAAAkEAAAAAAUqAAAAAQYDAAAAAgEBBAYOAAAAQwBhAGwAaQBiAHIAaQAJAQEGBQAAAAAAACZABhcAAAAAEgAAAAENAAAAAgEJAwXNZeYyc5npPwcAAAAAAKwAAAABBAAAAB8AAAADKAAAAAQaAAAANAAwACUAIAAtACAAQQBjAGMAZQBuAHQAMQAFBAAAAAEAAAAEIQAAAAABAAEBAAQBAAYEAAAAAAcEAgAAAAgEAQAAAAkEAAAAAAUqAAAAAQYDAAAAAgEBBAYOAAAAQwBhAGwAaQBiAHIAaQAJAQEGBQAAAAAAACZABhcAAAAAEgAAAAENAAAAAgEEAwWazExmJjPjPwcAAAAAAKwAAAABBAAAACMAAAADKAAAAAQaAAAANAAwACUAIAAtACAAQQBjAGMAZQBuAHQAMgAFBAAAAAEAAAAEIQAAAAABAAEBAAQBAAYEAAAAAAcEAgAAAAgEAQAAAAkEAAAAAAUqAAAAAQYDAAAAAgEBBAYOAAAAQwBhAGwAaQBiAHIAaQAJAQEGBQAAAAAAACZABhcAAAAAEgAAAAENAAAAAgEFAwWazExmJjPjPwcAAAAAAKwAAAABBAAAACcAAAADKAAAAAQaAAAANAAwACUAIAAtACAAQQBjAGMAZQBuAHQAMwAFBAAAAAEAAAAEIQAAAAABAAEBAAQBAAYEAAAAAAcEAgAAAAgEAQAAAAkEAAAAAAUqAAAAAQYDAAAAAgEBBAYOAAAAQwBhAGwAaQBiAHIAaQAJAQEGBQAAAAAAACZABhcAAAAAEgAAAAENAAAAAgEGAwWazExmJjPjPwcAAAAAAKwAAAABBAAAACsAAAADKAAAAAQaAAAANAAwACUAIAAtACAAQQBjAGMAZQBuAHQANAAFBAAAAAEAAAAEIQAAAAABAAEBAAQBAAYEAAAAAAcEAgAAAAgEAQAAAAkEAAAAAAUqAAAAAQYDAAAAAgEBBAYOAAAAQwBhAGwAaQBiAHIAaQAJAQEGBQAAAAAAACZABhcAAAAAEgAAAAENAAAAAgEHAwWazExmJjPjPwcAAAAAAKwAAAABBAAAAC8AAAADKAAAAAQaAAAANAAwACUAIAAtACAAQQBjAGMAZQBuAHQANQAFBAAAAAEAAAAEIQAAAAABAAEBAAQBAAYEAAAAAAcEAgAAAAgEAQAAAAkEAAAAAAUqAAAAAQYDAAAAAgEBBAYOAAAAQwBhAGwAaQBiAHIAaQAJAQEGBQAAAAAAACZABhcAAAAAEgAAAAENAAAAAgEIAwWazExmJjPjPwcAAAAAAKwAAAABBAAAADMAAAADKAAAAAQaAAAANAAwACUAIAAtACAAQQBjAGMAZQBuAHQANgAFBAAAAAEAAAAEIQAAAAABAAEBAAQBAAYEAAAAAAcEAgAAAAgEAQAAAAkEAAAAAAUqAAAAAQYDAAAAAgEBBAYOAAAAQwBhAGwAaQBiAHIAaQAJAQEGBQAAAAAAACZABhcAAAAAEgAA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";

        var oBinaryFileReader = new BinaryFileReader();
        var stream = oBinaryFileReader.getbase64DecodedData(sStyles);
        var bcr = new Binary_CommonReader(stream);
        var oBinary_StylesTableReader = new Binary_StylesTableReader(stream, wb, [], []);

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
            var oStyleObject = {font: null, fill: null, border: null, oNumFmts: [], xfs: null};
            if (Types.Style === type) {
                var oCellStyle = new AscCommonExcel.CCellStyle();
                res = bcr.Read1(length, function (t, l) {
                    return fReadStyle(t,l, oCellStyle, oStyleObject);
                });

                oCellStyle.xfs = new AscCommonExcel.CellXfs();
                // Border
                if (null !== oStyleObject.border)
                    oCellStyle.xfs.border = oStyleObject.border.clone();
                // Fill
                if (null !== oStyleObject.fill)
                    oCellStyle.xfs.fill = oStyleObject.fill.clone();
                // Font
                if (null !== oStyleObject.font)
                    oCellStyle.xfs.font = oStyleObject.font.clone();
                // NumFmt
                if (null !== oStyleObject.xfs.numid) {
                    var oCurNum = oStyleObject.oNumFmts[oStyleObject.xfs.numid];
                    if(null != oCurNum)
                        oCellStyle.xfs.num = oBinary_StylesTableReader.ParseNum(oCurNum, oStyleObject.oNumFmts);
                    else
                        oCellStyle.xfs.num = oBinary_StylesTableReader.ParseNum({id: oStyleObject.xfs.numid, f: null}, oStyleObject.oNumFmts);
                }
                // QuotePrefix
                if(null != oStyleObject.xfs.QuotePrefix)
                    oCellStyle.xfs.QuotePrefix = oStyleObject.xfs.QuotePrefix;
				// PivotButton
				if(null != oStyleObject.xfs.PivotButton)
					oCellStyle.xfs.PivotButton = oStyleObject.xfs.PivotButton;
                // align
                if(null != oStyleObject.xfs.align)
                    oCellStyle.xfs.align = oStyleObject.xfs.align.clone();
                // XfId
                if (null !== oStyleObject.xfs.XfId)
                    oCellStyle.xfs.XfId = oStyleObject.xfs.XfId;
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
			this.dxfs.push(newContext.xf);
		} else if ("tableStyles" === elem) {
			newContext = this.tableStyles;
		} else {
			newContext = null;
		}
		return newContext;
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
    window["AscCommonExcel"].BinaryFileReader = BinaryFileReader;
    window["AscCommonExcel"].BinaryFileWriter = BinaryFileWriter;

    window["AscCommonExcel"].BinaryTableWriter = BinaryTableWriter;
    window["AscCommonExcel"].Binary_TableReader = Binary_TableReader;

    window["Asc"].getBinaryOtherTableGVar = getBinaryOtherTableGVar;
    window["Asc"].ReadDefTableStyles = ReadDefTableStyles;
})(window);
