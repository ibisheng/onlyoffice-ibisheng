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
	var g_cCharDelimiter      = String.fromCharCode(5);
	var g_cGeneralFormat      = 'General';
	var FONT_THUMBNAIL_HEIGHT = (7 * 96.0 / 25.4) >> 0;
	var c_oAscMaxColumnWidth  = 255;
	var c_oAscMaxRowHeight    = 409;

	//files type for Saving & DownloadAs
	var c_oAscFileType = {
		UNKNOWN : 0,
		PDF     : 0x0201,
		HTML    : 0x0803,

		// Word
		DOCX : 0x0041,
		DOC  : 0x0042,
		ODT  : 0x0043,
		RTF  : 0x0044,
		TXT  : 0x0045,
		MHT  : 0x0047,
		EPUB : 0x0048,
		FB2  : 0x0049,
		MOBI : 0x004a,
		DOCY : 0x1001,
		JSON : 0x0808,	// Для mail-merge

		// Excel
		XLSX : 0x0101,
		XLS  : 0x0102,
		ODS  : 0x0103,
		CSV  : 0x0104,
		XLSY : 0x1002,

		// PowerPoint
		PPTX : 0x0081,
		PPT  : 0x0082,
		ODP  : 0x0083
	};

	var c_oAscError = {
		Level : {
			Critical   : -1,
			NoCritical : 0
		},
		ID    : {
			ServerSaveComplete   : 3,
			ConvertationProgress : 2,
			DownloadProgress     : 1,
			No                   : 0,
			Unknown              : -1,
			ConvertationTimeout  : -2,

			DownloadError        : -4,
			UnexpectedGuid       : -5,
			Database             : -6,
			FileRequest          : -7,
			FileVKey             : -8,
			UplImageSize         : -9,
			UplImageExt          : -10,
			UplImageFileCount    : -11,
			NoSupportClipdoard   : -12,
			UplImageUrl          : -13,

			StockChartError       : -17,
			CoAuthoringDisconnect : -18,
			ConvertationPassword  : -19,
			VKeyEncrypt           : -20,
			KeyExpire             : -21,
			UserCountExceed       : -22,
			AccessDeny            : -23,

			SplitCellMaxRows     : -30,
			SplitCellMaxCols     : -31,
			SplitCellRowsDivider : -32,

			MobileUnexpectedCharCount : -35,

			// Mail Merge
			MailMergeLoadFile : -40,
			MailMergeSaveFile : -41,

			// for AutoFilter
			AutoFilterDataRangeError         : -50,
			AutoFilterChangeFormatTableError : -51,
			AutoFilterChangeError            : -52,
			AutoFilterMoveToHiddenRangeError : -53,
			LockedAllError                   : -54,
			LockedWorksheetRename            : -55,
			FTChangeTableRangeError          : -56,
			FTRangeIncludedOtherTables       : -57,

			PasteMaxRangeError   : -64,
			PastInMergeAreaError : -65,
			CopyMultiselectAreaError : -66,

			DataRangeError  : -72,
			CannotMoveRange : -71,

			MaxDataSeriesError : -80,
			CannotFillRange    : -81,

			ConvertationOpenError : -82,
            ConvertationSaveError : -83,

			UserDrop : -100,
			Warning  : -101,

			PrintMaxPagesCount					: -110,

			SessionAbsolute: -120,
			SessionIdle: -121,
			SessionToken: -122,

			/* для формул */
			FrmlWrongCountParentheses   : -300,
			FrmlWrongOperator           : -301,
			FrmlWrongMaxArgument        : -302,
			FrmlWrongCountArgument      : -303,
			FrmlWrongFunctionName       : -304,
			FrmlAnotherParsingError     : -305,
			FrmlWrongArgumentRange      : -306,
			FrmlOperandExpected         : -307,
			FrmlParenthesesCorrectCount : -308,
			FrmlWrongReferences         : -309,

			InvalidReferenceOrName : -310,
			LockCreateDefName      : -311,

			OpenWarning : 500
		}
	};

	var c_oAscAsyncAction = {
		Open               : 0,  // открытие документа
		Save               : 1,  // сохранение
		LoadDocumentFonts  : 2,  // загружаем фонты документа (сразу после открытия)
		LoadDocumentImages : 3,  // загружаем картинки документа (сразу после загрузки шрифтов)
		LoadFont           : 4,  // подгрузка нужного шрифта
		LoadImage          : 5,  // подгрузка картинки
		DownloadAs         : 6,  // cкачать
		Print              : 7,  // конвертация в PDF и сохранение у пользователя
		UploadImage        : 8,  // загрузка картинки

		ApplyChanges : 9,  // применение изменений от другого пользователя.

		SlowOperation     : 11, // медленная операция
		LoadTheme         : 12, // загрузка темы
		MailMergeLoadFile : 13, // загрузка файла для mail merge
		DownloadMerge     : 14, // cкачать файл с mail merge
		SendMailMerge     : 15  // рассылка mail merge по почте
	};

	var c_oAscAdvancedOptionsID = {
		CSV : 0,
		TXT : 1,
		DRM : 2
	};

	var c_oAscAdvancedOptionsAction = {
		None : 0,
		Open : 1,
		Save : 2
	};

	// Режимы отрисовки
	var c_oAscFontRenderingModeType = {
		noHinting             : 1,
		hinting               : 2,
		hintingAndSubpixeling : 3
	};

	var c_oAscAsyncActionType = {
		Information      : 0,
		BlockInteraction : 1
	};

	var DownloadType = {
		None      : '',
		Download  : 'asc_onDownloadUrl',
		Print     : 'asc_onPrintUrl',
		MailMerge : 'asc_onSaveMailMerge'
	};

	var CellValueType = {
		Number : 0,
		String : 1,
		Bool   : 2,
		Error  : 3
	};

	//NumFormat defines
	var c_oAscNumFormatType = {
		General    : 0,
		Custom     : 1,
		Text       : 2,
		Number     : 3,
		Integer    : 4,
		Scientific : 5,
		Currency   : 6,
		Date       : 7,
		Time       : 8,
		Percent    : 9,
		Fraction   : 10,
		Accounting : 11
	};

	var c_oAscDrawingLayerType = {
		BringToFront : 0,
		SendToBack   : 1,
		BringForward : 2,
		SendBackward : 3
	};

	var c_oAscCellAnchorType = {
		cellanchorAbsolute : 0,
		cellanchorOneCell  : 1,
		cellanchorTwoCell  : 2
	};

	var c_oAscChartDefines = {
		defaultChartWidth  : 478,
		defaultChartHeight : 286
	};

	var c_oAscStyleImage = {
		Default  : 0,
		Document : 1
	};

	var c_oAscTypeSelectElement = {
		Paragraph  : 0,
		Table      : 1,
		Image      : 2,
		Header     : 3,
		Hyperlink  : 4,
		SpellCheck : 5,
		Shape      : 6,
		Slide      : 7,
		Chart      : 8,
		Math       : 9,
		MailMerge  : 10
	};

	var c_oAscLineDrawingRule = {
		Left   : 0,
		Center : 1,
		Right  : 2,
		Top    : 0,
		Bottom : 2
	};

	var align_Right   = 0;
	var align_Left    = 1;
	var align_Center  = 2;
	var align_Justify = 3;


	var linerule_AtLeast = 0x00;
	var linerule_Auto    = 0x01;
	var linerule_Exact   = 0x02;

	var c_oAscShdClear = 0;
	var c_oAscShdNil   = 1;

	var vertalign_Baseline    = 0;
	var vertalign_SuperScript = 1;
	var vertalign_SubScript   = 2;
	var hdrftr_Header         = 0x01;
	var hdrftr_Footer         = 0x02;

	var c_oAscDropCap = {
		None   : 0x00,
		Drop   : 0x01,
		Margin : 0x02
	};


	var c_oAscChartTitleShowSettings = {
		none      : 0,
		overlay   : 1,
		noOverlay : 2
	};

	var c_oAscChartHorAxisLabelShowSettings = {
		none      : 0,
		noOverlay : 1
	};

	var c_oAscChartVertAxisLabelShowSettings = {
		none       : 0,
		rotated    : 1,
		vertical   : 2,
		horizontal : 3
	};

	var c_oAscChartLegendShowSettings = {
		none         : 0,
		left         : 1,
		top          : 2,
		right        : 3,
		bottom       : 4,
		leftOverlay  : 5,
		rightOverlay : 6,
		layout       : 7,
		topRight     : 8 // ToDo добавить в меню
	};

	var c_oAscChartDataLabelsPos = {
		none    : 0,
		b       : 1,
		bestFit : 2,
		ctr     : 3,
		inBase  : 4,
		inEnd   : 5,
		l       : 6,
		outEnd  : 7,
		r       : 8,
		t       : 9
	};

	var c_oAscChartCatAxisSettings = {
		none        : 0,
		leftToRight : 1,
		rightToLeft : 2,
		noLabels    : 3
	};

	var c_oAscChartValAxisSettings = {
		none      : 0,
		byDefault : 1,
		thousands : 2,
		millions  : 3,
		billions  : 4,
		log       : 5
	};

	var c_oAscAxisTypeSettings = {
		vert : 0,
		hor  : 1
	};

	var c_oAscGridLinesSettings = {
		none       : 0,
		major      : 1,
		minor      : 2,
		majorMinor : 3
	};


	var c_oAscChartTypeSettings = {
		barNormal              : 0,
		barStacked             : 1,
		barStackedPer          : 2,
		barNormal3d            : 3,
		barStacked3d           : 4,
		barStackedPer3d        : 5,
		barNormal3dPerspective : 6,
		lineNormal             : 7,
		lineStacked            : 8,
		lineStackedPer         : 9,
		lineNormalMarker       : 10,
		lineStackedMarker      : 11,
		lineStackedPerMarker   : 12,
		line3d                 : 13,
		pie                    : 14,
		pie3d                  : 15,
		hBarNormal             : 16,
		hBarStacked            : 17,
		hBarStackedPer         : 18,
		hBarNormal3d           : 19,
		hBarStacked3d          : 20,
		hBarStackedPer3d       : 21,
		areaNormal             : 22,
		areaStacked            : 23,
		areaStackedPer         : 24,
		doughnut               : 25,
		stock                  : 26,
		scatter                : 27,
		scatterLine            : 28,
		scatterLineMarker      : 29,
		scatterMarker          : 30,
		scatterNone            : 31,
		scatterSmooth          : 32,
		scatterSmoothMarker    : 33,
		unknown                : 34
	};


	var c_oAscValAxisRule = {
		auto  : 0,
		fixed : 1
	};

	var c_oAscValAxUnits = {
		none              : 0,
		BILLIONS          : 1,
		HUNDRED_MILLIONS  : 2,
		HUNDREDS          : 3,
		HUNDRED_THOUSANDS : 4,
		MILLIONS          : 5,
		TEN_MILLIONS      : 6,
		TEN_THOUSANDS     : 7,
		TRILLIONS         : 8,
		CUSTOM            : 9,
		THOUSANDS         : 10

	};

	var c_oAscTickMark = {
		TICK_MARK_CROSS : 0,
		TICK_MARK_IN    : 1,
		TICK_MARK_NONE  : 2,
		TICK_MARK_OUT   : 3
	};

	var c_oAscTickLabelsPos = {
		TICK_LABEL_POSITION_HIGH    : 0,
		TICK_LABEL_POSITION_LOW     : 1,
		TICK_LABEL_POSITION_NEXT_TO : 2,
		TICK_LABEL_POSITION_NONE    : 3
	};

	var c_oAscCrossesRule = {
		auto     : 0,
		maxValue : 1,
		value    : 2,
		minValue : 3
	};

	var c_oAscHorAxisType = {
		auto : 0,
		date : 1,
		text : 2
	};

	var c_oAscBetweenLabelsRule = {
		auto   : 0,
		manual : 1
	};

	var c_oAscLabelsPosition = {
		byDivisions      : 0,
		betweenDivisions : 1
	};


	var c_oAscAxisType = {
		auto : 0,
		date : 1,
		text : 2,
		cat  : 3,
		val  : 4
	};

	var c_oAscHAnchor = {
		Margin : 0x00,
		Page   : 0x01,
		Text   : 0x02,

		PageInternal : 0xFF // только для внутреннего использования
	};

	var c_oAscXAlign = {
		Center  : 0x00,
		Inside  : 0x01,
		Left    : 0x02,
		Outside : 0x03,
		Right   : 0x04
	};
	var c_oAscYAlign = {
		Bottom  : 0x00,
		Center  : 0x01,
		Inline  : 0x02,
		Inside  : 0x03,
		Outside : 0x04,
		Top     : 0x05
	};

	var c_oAscVAnchor = {
		Margin : 0x00,
		Page   : 0x01,
		Text   : 0x02
	};

	var c_oAscRelativeFromH = {
		Character     : 0x00,
		Column        : 0x01,
		InsideMargin  : 0x02,
		LeftMargin    : 0x03,
		Margin        : 0x04,
		OutsideMargin : 0x05,
		Page          : 0x06,
		RightMargin   : 0x07
	};

	var c_oAscSizeRelFromH = {
		sizerelfromhMargin        : 0,
		sizerelfromhPage          : 1,
		sizerelfromhLeftMargin    : 2,
		sizerelfromhRightMargin   : 3,
		sizerelfromhInsideMargin  : 4,
		sizerelfromhOutsideMargin : 5
	};

	var c_oAscSizeRelFromV = {
		sizerelfromvMargin        : 0,
		sizerelfromvPage          : 1,
		sizerelfromvTopMargin     : 2,
		sizerelfromvBottomMargin  : 3,
		sizerelfromvInsideMargin  : 4,
		sizerelfromvOutsideMargin : 5
	};

	var c_oAscRelativeFromV = {
		BottomMargin  : 0x00,
		InsideMargin  : 0x01,
		Line          : 0x02,
		Margin        : 0x03,
		OutsideMargin : 0x04,
		Page          : 0x05,
		Paragraph     : 0x06,
		TopMargin     : 0x07
	};

	// image wrap style
	var c_oAscWrapStyle = {
		Inline : 0,
		Flow   : 1
	};

	// Толщина бордера
	var c_oAscBorderWidth     = {
		None   : 0,	// 0px
		Thin   : 1,	// 1px
		Medium : 2,	// 2px
		Thick  : 3		// 3px
	};
	// Располагаются в порядке значимости для отрисовки
	var c_oAscBorderStyles    = {
		None             : 0,
		Double           : 1,
		Hair             : 2,
		DashDotDot       : 3,
		DashDot          : 4,
		Dotted           : 5,
		Dashed           : 6,
		Thin             : 7,
		MediumDashDotDot : 8,
		SlantDashDot     : 9,
		MediumDashDot    : 10,
		MediumDashed     : 11,
		Medium           : 12,
		Thick            : 13
	};
	var c_oAscBorderType      = {
		Hor  : 1,
		Ver  : 2,
		Diag : 3
	};
	// PageOrientation
	var c_oAscPageOrientation = {
		PagePortrait  : 0x00,
		PageLandscape : 0x01
	};
	/**
	 * lock types
	 * @const
	 */
	var c_oAscLockTypes       = {
		kLockTypeNone   : 1, // никто не залочил данный объект
		kLockTypeMine   : 2, // данный объект залочен текущим пользователем
		kLockTypeOther  : 3, // данный объект залочен другим(не текущим) пользователем
		kLockTypeOther2 : 4, // данный объект залочен другим(не текущим) пользователем (обновления уже пришли)
		kLockTypeOther3 : 5  // данный объект был залочен (обновления пришли) и снова стал залочен
	};

	var c_oAscFormatPainterState = {
		kOff      : 0,
		kOn       : 1,
		kMultiple : 2
	};

	var c_oAscSaveTypes = {
		PartStart   : 0,
		Part        : 1,
		Complete    : 2,
		CompleteAll : 3
	};

	var c_oAscColor = {
		COLOR_TYPE_NONE   : 0,
		COLOR_TYPE_SRGB   : 1,
		COLOR_TYPE_PRST   : 2,
		COLOR_TYPE_SCHEME : 3,
		COLOR_TYPE_SYS    : 4
	};

	var c_oAscFill = {
		FILL_TYPE_NONE   : 0,
		FILL_TYPE_BLIP   : 1,
		FILL_TYPE_NOFILL : 2,
		FILL_TYPE_SOLID  : 3,
		FILL_TYPE_GRAD   : 4,
		FILL_TYPE_PATT   : 5,
		FILL_TYPE_GRP    : 6
	};

	// Chart defines
	var c_oAscChartType    = {
		line     : "Line",
		bar      : "Bar",
		hbar     : "HBar",
		area     : "Area",
		pie      : "Pie",
		scatter  : "Scatter",
		stock    : "Stock",
		doughnut : "Doughnut"
	};
	var c_oAscChartSubType = {
		normal     : "normal",
		stacked    : "stacked",
		stackedPer : "stackedPer"
	};

	var c_oAscFillGradType = {
		GRAD_LINEAR : 1,
		GRAD_PATH   : 2
	};
	var c_oAscFillBlipType = {
		STRETCH : 1,
		TILE    : 2
	};
	var c_oAscStrokeType   = {
		STROKE_NONE  : 0,
		STROKE_COLOR : 1
	};

	var c_oAscVAlign = {
		Bottom : 0, // (Text Anchor Enum ( Bottom ))
		Center : 1, // (Text Anchor Enum ( Center ))
		Dist   : 2, // (Text Anchor Enum ( Distributed ))
		Just   : 3, // (Text Anchor Enum ( Justified ))
		Top    : 4  // Top
	};

	var c_oAscVertDrawingText = {
		normal  : 1,
		vert    : 3,
		vert270 : 4
	};
	var c_oAscLineJoinType    = {
		Round : 1,
		Bevel : 2,
		Miter : 3
	};
	var c_oAscLineCapType     = {
		Flat   : 0,
		Round  : 1,
		Square : 2
	};
	var c_oAscLineBeginType   = {
		None     : 0,
		Arrow    : 1,
		Diamond  : 2,
		Oval     : 3,
		Stealth  : 4,
		Triangle : 5
	};
	var c_oAscLineBeginSize   = {
		small_small : 0,
		small_mid   : 1,
		small_large : 2,
		mid_small   : 3,
		mid_mid     : 4,
		mid_large   : 5,
		large_small : 6,
		large_mid   : 7,
		large_large : 8
	};
	var c_oAscCsvDelimiter    = {
		None      : 0,
		Tab       : 1,
		Semicolon : 2,
		Сolon     : 3,
		Comma     : 4,
		Space     : 5
	};
	var c_oAscUrlType         = {
		Invalid : 0,
		Http    : 1,
		Email   : 2
	};

	var c_oAscCellTextDirection = {
		LRTB : 0x00,
		TBRL : 0x01,
		BTLR : 0x02
	};

	var c_oAscDocumentUnits = {
		Millimeter : 0,
		Inch       : 1,
		Point      : 2
	};

	var c_oAscMouseMoveDataTypes = {
		Common       : 0,
		Hyperlink    : 1,
		LockedObject : 2,
		Footnote     : 3
	};

	// selection type
	var c_oAscSelectionType = {
		RangeCells     : 1,
		RangeCol       : 2,
		RangeRow       : 3,
		RangeMax       : 4,
		RangeImage     : 5,
		RangeChart     : 6,
		RangeShape     : 7,
		RangeShapeText : 8,
		RangeChartText : 9,
		RangeFrozen    : 10
	};
	var c_oAscInsertOptions = {
		InsertCellsAndShiftRight : 1,
		InsertCellsAndShiftDown  : 2,
		InsertColumns            : 3,
		InsertRows               : 4,
		InsertTableRowAbove      : 5,
		InsertTableRowBelow      : 6,
		InsertTableColLeft       : 7,
		InsertTableColRight      : 8
	};

	var c_oAscDeleteOptions = {
		DeleteCellsAndShiftLeft : 1,
		DeleteCellsAndShiftTop  : 2,
		DeleteColumns           : 3,
		DeleteRows              : 4,
		DeleteTable             : 5
	};


	// Print default options (in mm)
	var c_oAscPrintDefaultSettings = {
		// Размеры страницы при печати
		PageWidth       : 210,
		PageHeight      : 297,
		PageOrientation : c_oAscPageOrientation.PagePortrait,

		// Поля для страницы при печати
		PageLeftField   : 17.8,
		PageRightField  : 17.8,
		PageTopField    : 19.1,
		PageBottomField : 19.1,
		MinPageLeftField	: 0.17,
		MinPageRightField	: 0.17,
		MinPageTopField		: 0.17,
		MinPageBottomField	: 0.17,

		PageGridLines : 0,
		PageHeadings  : 0
	};

	var c_oZoomType = {
		FitToPage  : 1,
		FitToWidth : 2,
		CustomMode : 3
	};

	var c_oNotifyType = {
		Dirty: 0,
		Shift: 1,
		Move: 2,
		Delete: 3,
		Rebuild: 4,
		Changed: 5,
		ChangeDefName: 6,
		ChangeSheet: 7,
		DelColumnTable: 8
	};

	var c_oNotifyParentType = {
		CanDo: 0,
		Change: 1,
		ChangeFormula: 2,
		EndCalculate: 3,
		GetRangeCell: 4
	};

	var c_oDashType = {
		dash          : 0,
		dashDot       : 1,
		dot           : 2,
		lgDash        : 3,
		lgDashDot     : 4,
		lgDashDotDot  : 5,
		solid         : 6,
		sysDash       : 7,
		sysDashDot    : 8,
		sysDashDotDot : 9,
		sysDot        : 10
	};


    /** @enum {number} */
    var c_oAscMathInterfaceType = {
        Common        : 0x00,
        Fraction      : 0x01,
        Script        : 0x02,
        Radical       : 0x03,
        LargeOperator : 0x04,
        Delimiter     : 0x05,
        Function      : 0x06,
        Accent        : 0x07,
        BorderBox     : 0x08,
        Bar           : 0x09,
        Box           : 0x0a,
        Limit         : 0x0b,
        GroupChar     : 0x0c,
        Matrix        : 0x0d,
        EqArray       : 0x0e,
        Phantom       : 0x0f
    };


	/** @enum {number} */
	var c_oAscMathInterfaceBarPos = {
		Top    : 0,
		Bottom : 1
	};

	/** @enum {number} */
	var c_oAscMathInterfaceScript = {
		None      : 0x000,  // Удаление скрипта
		Sup       : 0x001,
		Sub       : 0x002,
		SubSup    : 0x003,
		PreSubSup : 0x004
	};

	/** @enum {number} */
	var c_oAscMathInterfaceFraction = {
		Bar    : 0x001,
		Skewed : 0x002,
		Linear : 0x003,
		NoBar  : 0x004
	};

	/** @enum {number} */
	var c_oAscMathInterfaceLimitPos = {
		None   : -1,  // Удаление предела
		Top    : 0,
		Bottom : 1
	};

	/** @enum {number} */
	var c_oAscMathInterfaceMatrixMatrixAlign = {
		Top    : 0,
		Center : 1,
		Bottom : 2
	};

	/** @enum {number} */
	var c_oAscMathInterfaceMatrixColumnAlign = {
		Left   : 0,
		Center : 1,
		Right  : 2
	};

	/** @enum {number} */
	var c_oAscMathInterfaceEqArrayAlign = {
		Top    : 0,
		Center : 1,
		Bottom : 2
	};

	/** @enum {number} */
	var c_oAscMathInterfaceNaryLimitLocation = {
		UndOvr : 0,
		SubSup : 1
	};

	/** @enum {number} */
	var c_oAscMathInterfaceGroupCharPos = {
		None   : -1,  // Удаление GroupChar
		Top    : 0,
		Bottom : 1
	};

	var c_oAscEncodings    = [
		[0, 28596, "ISO-8859-6", "Arabic (ISO 8859-6)"],
		[1, 720, "DOS-720", "Arabic (OEM 720)"],
		[2, 1256, "windows-1256", "Arabic (Windows)"],

		[3, 28594, "ISO-8859-4", "Baltic (ISO 8859-4)"],
		[4, 28603, "ISO-8859-13", "Baltic (ISO 8859-13)"],
		[5, 775, "IBM775", "Baltic (OEM 775)"],
		[6, 1257, "windows-1257", "Baltic (Windows)"],

		[7, 28604, "ISO-8859-14", "Celtic (ISO 8859-14)"],

		[8, 28595, "ISO-8859-5", "Cyrillic (ISO 8859-5)"],
		[9, 20866, "KOI8-R", "Cyrillic (KOI8-R)"],
		[10, 21866, "KOI8-U", "Cyrillic (KOI8-U)"],
		[11, 10007, "x-mac-cyrillic", "Cyrillic (Mac)"],
		[12, 855, "IBM855", "Cyrillic (OEM 855)"],
		[13, 866, "cp866", "Cyrillic (OEM 866)"],
		[14, 1251, "windows-1251", "Cyrillic (Windows)"],

		[15, 852, "IBM852", "Central European (OEM 852)"],
		[16, 1250, "windows-1250", "Central European (Windows)"],

		[17, 950, "Big5", "Chinese (Big5 Traditional)"],
		[18, 936, "GB2312", "Central (GB2312 Simplified)"],

		[19, 28592, "ISO-8859-2", "Eastern European (ISO 8859-2)"],

		[20, 28597, "ISO-8859-7", "Greek (ISO 8859-7)"],
		[21, 737, "IBM737", "Greek (OEM 737)"],
		[22, 869, "IBM869", "Greek (OEM 869)"],
		[23, 1253, "windows-1253", "Greek (Windows)"],

		[24, 28598, "ISO-8859-8", "Hebrew (ISO 8859-8)"],
		[25, 862, "DOS-862", "Hebrew (OEM 862)"],
		[26, 1255, "windows-1255", "Hebrew (Windows)"],

		[27, 932, "Shift_JIS", "Japanese (Shift-JIS)"],

		[28, 949, "KS_C_5601-1987", "Korean (Windows)"],
		[29, 51949, "EUC-KR", "Korean (EUC)"],

		[30, 861, "IBM861", "North European (Icelandic OEM 861)"],
		[31, 865, "IBM865", "North European (Nordic OEM 865)"],

		[32, 874, "windows-874", "Thai (TIS-620)"],

		[33, 28593, "ISO-8859-3", "Turkish (ISO 8859-3)"],
		[34, 28599, "ISO-8859-9", "Turkish (ISO 8859-9)"],
		[35, 857, "IBM857", "Turkish (OEM 857)"],
		[36, 1254, "windows-1254", "Turkish (Windows)"],

		[37, 28591, "ISO-8859-1", "Western European (ISO-8859-1)"],
		[38, 28605, "ISO-8859-15", "Western European (ISO-8859-15)"],
		[39, 850, "IBM850", "Western European (OEM 850)"],
		[40, 858, "IBM858", "Western European (OEM 858)"],
		[41, 860, "IBM860", "Western European (OEM 860 : Portuguese)"],
		[42, 863, "IBM863", "Western European (OEM 863 : French)"],
		[43, 437, "IBM437", "Western European (OEM-US)"],
		[44, 1252, "windows-1252", "Western European (Windows)"],

		[45, 1258, "windows-1258", "Vietnamese (Windows)"],

		[46, 65001, "UTF-8", "Unicode (UTF-8)"],
		[47, 65000, "UTF-7", "Unicode (UTF-7)"],

		[48, 1200, "UTF-16", "Unicode (UTF-16)"],
		[49, 1201, "UTF-16BE", "Unicode (UTF-16 Big Endian)"],

		[50, 12000, "UTF-32", "Unicode (UTF-32)"],
		[51, 12001, "UTF-32BE", "Unicode (UTF-32 Big Endian)"]
	];
	var c_oAscEncodingsMap = {
		"437"   : 43, "720" : 1, "737" : 21, "775" : 5, "850" : 39, "852" : 15, "855" : 12, "857" : 35, "858" : 40, "860" : 41, "861" : 30, "862" : 25, "863" : 42, "865" : 31, "866" : 13, "869" : 22, "874" : 32, "932" : 27, "936" : 18, "949" : 28, "950" : 17, "1200" : 48, "1201" : 49, "1250" : 16, "1251" : 14, "1252" : 44, "1253" : 23, "1254" : 36, "1255" : 26, "1256" : 2, "1257" : 6, "1258" : 45, "10007" : 11, "12000" : 50, "12001" : 51, "20866" : 9, "21866" : 10, "28591" : 37, "28592" : 19,
		"28593" : 33, "28594" : 3, "28595" : 8, "28596" : 0, "28597" : 20, "28598" : 24, "28599" : 34, "28603" : 4, "28604" : 7, "28605" : 38, "51949" : 29, "65000" : 47, "65001" : 46
	};
	var c_oAscCodePageUtf8 = 46;//65001

	// https://support.office.com/en-us/article/Excel-specifications-and-limits-16c69c74-3d6a-4aaf-ba35-e6eb276e8eaa?ui=en-US&rs=en-US&ad=US&fromAR=1
	var c_oAscMaxTooltipLength       = 256;
	var c_oAscMaxCellOrCommentLength = 32767;
	var c_oAscMaxFormulaLength       = 8192;

	var locktype_None   = 1; // никто не залочил данный объект
	var locktype_Mine   = 2; // данный объект залочен текущим пользователем
	var locktype_Other  = 3; // данный объект залочен другим(не текущим) пользователем
	var locktype_Other2 = 4; // данный объект залочен другим(не текущим) пользователем (обновления уже пришли)
	var locktype_Other3 = 5; // данный объект был залочен (обновления пришли) и снова стал залочен

	var changestype_None                 = 0; // Ничего не происходит с выделенным элементом (проверка идет через дополнительный параметр)
	var changestype_Paragraph_Content    = 1; // Добавление/удаление элементов в параграф
	var changestype_Paragraph_Properties = 2; // Изменение свойств параграфа
	var changestype_Document_Content     = 10; // Добавление/удаление элементов в Document или в DocumentContent
	var changestype_Document_Content_Add = 11; // Добавление элемента в класс Document или в класс DocumentContent
	var changestype_Document_SectPr      = 12; // Изменения свойств данной секции (размер страницы, поля и ориентация)
	var changestype_Document_Styles      = 13; // Изменяем стили документа (добавление/удаление/модифицирование)
	var changestype_Table_Properties     = 20; // Любые изменения в таблице
	var changestype_Table_RemoveCells    = 21; // Удаление ячеек (строк или столбцов)
	var changestype_Image_Properties     = 23; // Изменения настроек картинки
	var changestype_HdrFtr               = 30; // Изменения в колонтитуле (любые изменения)
	var changestype_Remove               = 40; // Удаление, через кнопку backspace (Удаление назад)
	var changestype_Delete               = 41; // Удаление, через кнопку delete (Удаление вперед)
	var changestype_Drawing_Props        = 51; // Изменение свойств фигуры
	var changestype_ColorScheme          = 60; // Изменение свойств фигуры
	var changestype_Text_Props           = 61; // Изменение свойств фигуры
	var changestype_RemoveSlide          = 62; // Изменение свойств фигуры
	var changestype_PresentationProps    = 63; // Изменение темы, цветовой схемы, размера слайда;
	var changestype_Theme                = 64; // Изменение темы;
	var changestype_SlideSize            = 65; // Изменение цветовой схемы;
	var changestype_SlideBg              = 66; // Изменение цветовой схемы;
	var changestype_SlideTiming          = 67; // Изменение цветовой схемы;
	var changestype_MoveComment          = 68;
	var changestype_AddSp                = 69;
	var changestype_AddComment           = 70;
	var changestype_Layout               = 71;
	var changestype_AddShape             = 72;
	var changestype_AddShapes            = 73;

	var changestype_2_InlineObjectMove       = 1; // Передвигаем объект в заданную позцию (проверяем место, в которое пытаемся передвинуть)
	var changestype_2_HdrFtr                 = 2; // Изменения с колонтитулом
	var changestype_2_Comment                = 3; // Работает с комментариями
	var changestype_2_Element_and_Type       = 4; // Проверяем возможно ли сделать изменение заданного типа с заданным элементом(а не с текущим)
	var changestype_2_ElementsArray_and_Type = 5; // Аналогично предыдущему, только идет массив элементов
	var changestype_2_AdditionalTypes        = 6; // Дополнительные проверки типа 1

	var contentchanges_Add    = 1;
	var contentchanges_Remove = 2;


	var offlineMode = '_offline_';

	//------------------------------------------------------------export--------------------------------------------------
	var prot;
	window['Asc']                          = window['Asc'] || {};
	window['Asc']['FONT_THUMBNAIL_HEIGHT'] = FONT_THUMBNAIL_HEIGHT;
	window['Asc']['c_oAscMaxColumnWidth']  = window['Asc'].c_oAscMaxColumnWidth = c_oAscMaxColumnWidth;
	window['Asc']['c_oAscMaxRowHeight'] = window['Asc'].c_oAscMaxRowHeight = c_oAscMaxRowHeight;
	window['Asc']['c_oAscFileType'] = window['Asc'].c_oAscFileType = c_oAscFileType;
	prot                         = c_oAscFileType;
	prot['UNKNOWN']              = prot.UNKNOWN;
	prot['PDF']                  = prot.PDF;
	prot['HTML']                 = prot.HTML;
	prot['DOCX']                 = prot.DOCX;
	prot['DOC']                  = prot.DOC;
	prot['ODT']                  = prot.ODT;
	prot['RTF']                  = prot.RTF;
	prot['TXT']                  = prot.TXT;
	prot['MHT']                  = prot.MHT;
	prot['EPUB']                 = prot.EPUB;
	prot['FB2']                  = prot.FB2;
	prot['MOBI']                 = prot.MOBI;
	prot['DOCY']                 = prot.DOCY;
	prot['JSON']                 = prot.JSON;
	prot['XLSX']                 = prot.XLSX;
	prot['XLS']                  = prot.XLS;
	prot['ODS']                  = prot.ODS;
	prot['CSV']                  = prot.CSV;
	prot['XLSY']                 = prot.XLSY;
	prot['PPTX']                 = prot.PPTX;
	prot['PPT']                  = prot.PPT;
	prot['ODP']                  = prot.ODP;
	window['Asc']['c_oAscError'] = window['Asc'].c_oAscError = c_oAscError;
	prot                                     = c_oAscError;
	prot['Level']                            = prot.Level;
	prot['ID']                               = prot.ID;
	prot                                     = c_oAscError.Level;
	prot['Critical']                         = prot.Critical;
	prot['NoCritical']                       = prot.NoCritical;
	prot                                     = c_oAscError.ID;
	prot['ServerSaveComplete']               = prot.ServerSaveComplete;
	prot['ConvertationProgress']             = prot.ConvertationProgress;
	prot['DownloadProgress']                 = prot.DownloadProgress;
	prot['No']                               = prot.No;
	prot['Unknown']                          = prot.Unknown;
	prot['ConvertationTimeout']              = prot.ConvertationTimeout;
	prot['ConvertationOpenError']            = prot.ConvertationOpenError;
	prot['ConvertationSaveError']            = prot.ConvertationSaveError;
	prot['DownloadError']                    = prot.DownloadError;
	prot['UnexpectedGuid']                   = prot.UnexpectedGuid;
	prot['Database']                         = prot.Database;
	prot['FileRequest']                      = prot.FileRequest;
	prot['FileVKey']                         = prot.FileVKey;
	prot['UplImageSize']                     = prot.UplImageSize;
	prot['UplImageExt']                      = prot.UplImageExt;
	prot['UplImageFileCount']                = prot.UplImageFileCount;
	prot['NoSupportClipdoard']               = prot.NoSupportClipdoard;
	prot['UplImageUrl']                      = prot.UplImageUrl;
	prot['StockChartError']                  = prot.StockChartError;
	prot['CoAuthoringDisconnect']            = prot.CoAuthoringDisconnect;
	prot['ConvertationPassword']             = prot.ConvertationPassword;
	prot['VKeyEncrypt']                      = prot.VKeyEncrypt;
	prot['KeyExpire']                        = prot.KeyExpire;
	prot['UserCountExceed']                  = prot.UserCountExceed;
	prot['AccessDeny']                       = prot.AccessDeny;
	prot['SplitCellMaxRows']                 = prot.SplitCellMaxRows;
	prot['SplitCellMaxCols']                 = prot.SplitCellMaxCols;
	prot['SplitCellRowsDivider']             = prot.SplitCellRowsDivider;
	prot['MobileUnexpectedCharCount']        = prot.MobileUnexpectedCharCount;
	prot['MailMergeLoadFile']                = prot.MailMergeLoadFile;
	prot['MailMergeSaveFile']                = prot.MailMergeSaveFile;
	prot['AutoFilterDataRangeError']         = prot.AutoFilterDataRangeError;
	prot['AutoFilterChangeFormatTableError'] = prot.AutoFilterChangeFormatTableError;
	prot['AutoFilterChangeError']            = prot.AutoFilterChangeError;
	prot['AutoFilterMoveToHiddenRangeError'] = prot.AutoFilterMoveToHiddenRangeError;
	prot['LockedAllError']                   = prot.LockedAllError;
	prot['LockedWorksheetRename']            = prot.LockedWorksheetRename;
	prot['FTChangeTableRangeError']          = prot.FTChangeTableRangeError;
	prot['FTRangeIncludedOtherTables']       = prot.FTRangeIncludedOtherTables;
	prot['PasteMaxRangeError']               = prot.PasteMaxRangeError;
	prot['PastInMergeAreaError']             = prot.PastInMergeAreaError;
	prot['CopyMultiselectAreaError']         = prot.CopyMultiselectAreaError;
	prot['DataRangeError']                   = prot.DataRangeError;
	prot['CannotMoveRange']                  = prot.CannotMoveRange;
	prot['MaxDataSeriesError']               = prot.MaxDataSeriesError;
	prot['CannotFillRange']                  = prot.CannotFillRange;
	prot['UserDrop']                         = prot.UserDrop;
	prot['Warning']                          = prot.Warning;
	prot['PrintMaxPagesCount']               = prot.PrintMaxPagesCount;
	prot['SessionAbsolute']                  = prot.SessionAbsolute;
	prot['SessionIdle']                      = prot.SessionIdle;
	prot['SessionToken']                     = prot.SessionToken;
	prot['FrmlWrongCountParentheses']        = prot.FrmlWrongCountParentheses;
	prot['FrmlWrongOperator']                = prot.FrmlWrongOperator;
	prot['FrmlWrongMaxArgument']             = prot.FrmlWrongMaxArgument;
	prot['FrmlWrongCountArgument']           = prot.FrmlWrongCountArgument;
	prot['FrmlWrongFunctionName']            = prot.FrmlWrongFunctionName;
	prot['FrmlAnotherParsingError']          = prot.FrmlAnotherParsingError;
	prot['FrmlWrongArgumentRange']           = prot.FrmlWrongArgumentRange;
	prot['FrmlOperandExpected']              = prot.FrmlOperandExpected;
	prot['FrmlParenthesesCorrectCount']      = prot.FrmlParenthesesCorrectCount;
	prot['FrmlWrongReferences']              = prot.FrmlWrongReferences;
	prot['InvalidReferenceOrName']           = prot.InvalidReferenceOrName;
	prot['LockCreateDefName']                = prot.LockCreateDefName;
	prot['OpenWarning']                      = prot.OpenWarning;
	window['Asc']['c_oAscAsyncAction']       = window['Asc'].c_oAscAsyncAction = c_oAscAsyncAction;
	prot                                     = c_oAscAsyncAction;
	prot['Open']                             = prot.Open;
	prot['Save']                             = prot.Save;
	prot['LoadDocumentFonts']                = prot.LoadDocumentFonts;
	prot['LoadDocumentImages']               = prot.LoadDocumentImages;
	prot['LoadFont']                         = prot.LoadFont;
	prot['LoadImage']                        = prot.LoadImage;
	prot['DownloadAs']                       = prot.DownloadAs;
	prot['Print']                            = prot.Print;
	prot['UploadImage']                      = prot.UploadImage;
	prot['ApplyChanges']                     = prot.ApplyChanges;
	prot['SlowOperation']                    = prot.SlowOperation;
	prot['LoadTheme']                        = prot.LoadTheme;
	prot['MailMergeLoadFile']                = prot.MailMergeLoadFile;
	prot['DownloadMerge']                    = prot.DownloadMerge;
	prot['SendMailMerge']                    = prot.SendMailMerge;
	window['Asc']['c_oAscAdvancedOptionsID'] = window['Asc'].c_oAscAdvancedOptionsID = c_oAscAdvancedOptionsID;
	prot                                         = c_oAscAdvancedOptionsID;
	prot['CSV']                                  = prot.CSV;
	prot['TXT']                                  = prot.TXT;
	prot['DRM']                                  = prot.DRM;
	window['Asc']['c_oAscFontRenderingModeType'] = window['Asc'].c_oAscFontRenderingModeType = c_oAscFontRenderingModeType;
	prot                                   = c_oAscFontRenderingModeType;
	prot['noHinting']                      = prot.noHinting;
	prot['hinting']                        = prot.hinting;
	prot['hintingAndSubpixeling']          = prot.hintingAndSubpixeling;
	window['Asc']['c_oAscAsyncActionType'] = window['Asc'].c_oAscAsyncActionType = c_oAscAsyncActionType;
	prot                                 = c_oAscAsyncActionType;
	prot['Information']                  = prot.Information;
	prot['BlockInteraction']             = prot.BlockInteraction;
	window['Asc']['c_oAscNumFormatType'] = window['Asc'].c_oAscNumFormatType = c_oAscNumFormatType;
	prot                                     = c_oAscNumFormatType;
	prot['General']                          = prot.General;
	prot['Custom']                           = prot.Custom;
	prot['Text']                             = prot.Text;
	prot['Number']                           = prot.Number;
	prot['Integer']                          = prot.Integer;
	prot['Scientific']                       = prot.Scientific;
	prot['Currency']                         = prot.Currency;
	prot['Date']                             = prot.Date;
	prot['Time']                             = prot.Time;
	prot['Percent']                          = prot.Percent;
	prot['Fraction']                         = prot.Fraction;
	prot['Accounting']                       = prot.Accounting;
	window['Asc']['c_oAscDrawingLayerType']  = c_oAscDrawingLayerType;
	prot                                     = c_oAscDrawingLayerType;
	prot['BringToFront']                     = prot.BringToFront;
	prot['SendToBack']                       = prot.SendToBack;
	prot['BringForward']                     = prot.BringForward;
	prot['SendBackward']                     = prot.SendBackward;
	window['Asc']['c_oAscTypeSelectElement'] = window['Asc'].c_oAscTypeSelectElement = c_oAscTypeSelectElement;
	prot                              = c_oAscTypeSelectElement;
	prot['Paragraph']                 = prot.Paragraph;
	prot['Table']                     = prot.Table;
	prot['Image']                     = prot.Image;
	prot['Header']                    = prot.Header;
	prot['Hyperlink']                 = prot.Hyperlink;
	prot['SpellCheck']                = prot.SpellCheck;
	prot['Shape']                     = prot.Shape;
	prot['Slide']                     = prot.Slide;
	prot['Chart']                     = prot.Chart;
	prot['Math']                      = prot.Math;
	prot['MailMerge']                 = prot.MailMerge;
	window['Asc']['linerule_AtLeast'] = window['Asc'].linerule_AtLeast = linerule_AtLeast;
	window['Asc']['linerule_Auto'] = window['Asc'].linerule_Auto = linerule_Auto;
	window['Asc']['linerule_Exact'] = window['Asc'].linerule_Exact = linerule_Exact;
	window['Asc']['c_oAscShdClear'] = window['Asc'].c_oAscShdClear = c_oAscShdClear;
	window['Asc']['c_oAscShdNil'] = window['Asc'].c_oAscShdNil = c_oAscShdNil;
	window['Asc']['c_oAscDropCap'] = window['Asc'].c_oAscDropCap = c_oAscDropCap;
	prot                                          = c_oAscDropCap;
	prot['None']                                  = prot.None;
	prot['Drop']                                  = prot.Drop;
	prot['Margin']                                = prot.Margin;
	window['Asc']['c_oAscChartTitleShowSettings'] = window['Asc'].c_oAscChartTitleShowSettings = c_oAscChartTitleShowSettings;
	prot                                                 = c_oAscChartTitleShowSettings;
	prot['none']                                         = prot.none;
	prot['overlay']                                      = prot.overlay;
	prot['noOverlay']                                    = prot.noOverlay;
	window['Asc']['c_oAscChartHorAxisLabelShowSettings'] = window['Asc'].c_oAscChartHorAxisLabelShowSettings = c_oAscChartHorAxisLabelShowSettings;
	prot                                                  = c_oAscChartHorAxisLabelShowSettings;
	prot['none']                                          = prot.none;
	prot['noOverlay']                                     = prot.noOverlay;
	window['Asc']['c_oAscChartVertAxisLabelShowSettings'] = window['Asc'].c_oAscChartVertAxisLabelShowSettings = c_oAscChartVertAxisLabelShowSettings;
	prot                                           = c_oAscChartVertAxisLabelShowSettings;
	prot['none']                                   = prot.none;
	prot['rotated']                                = prot.rotated;
	prot['vertical']                               = prot.vertical;
	prot['horizontal']                             = prot.horizontal;
	window['Asc']['c_oAscChartLegendShowSettings'] = window['Asc'].c_oAscChartLegendShowSettings = c_oAscChartLegendShowSettings;
	prot                                      = c_oAscChartLegendShowSettings;
	prot['none']                              = prot.none;
	prot['left']                              = prot.left;
	prot['top']                               = prot.top;
	prot['right']                             = prot.right;
	prot['bottom']                            = prot.bottom;
	prot['leftOverlay']                       = prot.leftOverlay;
	prot['rightOverlay']                      = prot.rightOverlay;
	prot['layout']                            = prot.layout;
	prot['topRight']                          = prot.topRight;
	window['Asc']['c_oAscChartDataLabelsPos'] = window['Asc'].c_oAscChartDataLabelsPos = c_oAscChartDataLabelsPos;
	prot                                     = c_oAscChartDataLabelsPos;
	prot['none']                             = prot.none;
	prot['b']                                = prot.b;
	prot['bestFit']                          = prot.bestFit;
	prot['ctr']                              = prot.ctr;
	prot['inBase']                           = prot.inBase;
	prot['inEnd']                            = prot.inEnd;
	prot['l']                                = prot.l;
	prot['outEnd']                           = prot.outEnd;
	prot['r']                                = prot.r;
	prot['t']                                = prot.t;
	window['Asc']['c_oAscGridLinesSettings'] = window['Asc'].c_oAscGridLinesSettings = c_oAscGridLinesSettings;
	prot                                     = c_oAscGridLinesSettings;
	prot['none']                             = prot.none;
	prot['major']                            = prot.major;
	prot['minor']                            = prot.minor;
	prot['majorMinor']                       = prot.majorMinor;
	window['Asc']['c_oAscChartTypeSettings'] = window['Asc'].c_oAscChartTypeSettings = c_oAscChartTypeSettings;
	prot                               = c_oAscChartTypeSettings;
	prot['barNormal']                  = prot.barNormal;
	prot['barStacked']                 = prot.barStacked;
	prot['barStackedPer']              = prot.barStackedPer;
	prot['barNormal3d']                = prot.barNormal3d;
	prot['barStacked3d']               = prot.barStacked3d;
	prot['barStackedPer3d']            = prot.barStackedPer3d;
	prot['barNormal3dPerspective']     = prot.barNormal3dPerspective;
	prot['lineNormal']                 = prot.lineNormal;
	prot['lineStacked']                = prot.lineStacked;
	prot['lineStackedPer']             = prot.lineStackedPer;
	prot['lineNormalMarker']           = prot.lineNormalMarker;
	prot['lineStackedMarker']          = prot.lineStackedMarker;
	prot['lineStackedPerMarker']       = prot.lineStackedPerMarker;
	prot['line3d']                     = prot.line3d;
	prot['pie']                        = prot.pie;
	prot['pie3d']                      = prot.pie3d;
	prot['hBarNormal']                 = prot.hBarNormal;
	prot['hBarStacked']                = prot.hBarStacked;
	prot['hBarStackedPer']             = prot.hBarStackedPer;
	prot['hBarNormal3d']               = prot.hBarNormal3d;
	prot['hBarStacked3d']              = prot.hBarStacked3d;
	prot['hBarStackedPer3d']           = prot.hBarStackedPer3d;
	prot['areaNormal']                 = prot.areaNormal;
	prot['areaStacked']                = prot.areaStacked;
	prot['areaStackedPer']             = prot.areaStackedPer;
	prot['doughnut']                   = prot.doughnut;
	prot['stock']                      = prot.stock;
	prot['scatter']                    = prot.scatter;
	prot['scatterLine']                = prot.scatterLine;
	prot['scatterLineMarker']          = prot.scatterLineMarker;
	prot['scatterMarker']              = prot.scatterMarker;
	prot['scatterNone']                = prot.scatterNone;
	prot['scatterSmooth']              = prot.scatterSmooth;
	prot['scatterSmoothMarker']        = prot.scatterSmoothMarker;
	prot['unknown']                    = prot.unknown;
	window['Asc']['c_oAscValAxisRule'] = window['Asc'].c_oAscValAxisRule = c_oAscValAxisRule;
	prot                              = c_oAscValAxisRule;
	prot['auto']                      = prot.auto;
	prot['fixed']                     = prot.fixed;
	window['Asc']['c_oAscValAxUnits'] = window['Asc'].c_oAscValAxUnits = c_oAscValAxUnits;
	prot                            = c_oAscValAxUnits;
	prot['BILLIONS']                = prot.BILLIONS;
	prot['HUNDRED_MILLIONS']        = prot.HUNDRED_MILLIONS;
	prot['HUNDREDS']                = prot.HUNDREDS;
	prot['HUNDRED_THOUSANDS']       = prot.HUNDRED_THOUSANDS;
	prot['MILLIONS']                = prot.MILLIONS;
	prot['TEN_MILLIONS']            = prot.TEN_MILLIONS;
	prot['TEN_THOUSANDS']           = prot.TEN_THOUSANDS;
	prot['TRILLIONS']               = prot.TRILLIONS;
	prot['CUSTOM']                  = prot.CUSTOM;
	prot['THOUSANDS']               = prot.THOUSANDS;
	window['Asc']['c_oAscTickMark'] = window['Asc'].c_oAscTickMark = c_oAscTickMark;
	prot                                 = c_oAscTickMark;
	prot['TICK_MARK_CROSS']              = prot.TICK_MARK_CROSS;
	prot['TICK_MARK_IN']                 = prot.TICK_MARK_IN;
	prot['TICK_MARK_NONE']               = prot.TICK_MARK_NONE;
	prot['TICK_MARK_OUT']                = prot.TICK_MARK_OUT;
	window['Asc']['c_oAscTickLabelsPos'] = window['Asc'].c_oAscTickLabelsPos = c_oAscTickLabelsPos;
	prot                                = c_oAscTickLabelsPos;
	prot['TICK_LABEL_POSITION_HIGH']    = prot.TICK_LABEL_POSITION_HIGH;
	prot['TICK_LABEL_POSITION_LOW']     = prot.TICK_LABEL_POSITION_LOW;
	prot['TICK_LABEL_POSITION_NEXT_TO'] = prot.TICK_LABEL_POSITION_NEXT_TO;
	prot['TICK_LABEL_POSITION_NONE']    = prot.TICK_LABEL_POSITION_NONE;
	window['Asc']['c_oAscCrossesRule']  = window['Asc'].c_oAscCrossesRule = c_oAscCrossesRule;
	prot                                     = c_oAscCrossesRule;
	prot['auto']                             = prot.auto;
	prot['maxValue']                         = prot.maxValue;
	prot['value']                            = prot.value;
	prot['minValue']                         = prot.minValue;
	window['Asc']['c_oAscBetweenLabelsRule'] = window['Asc'].c_oAscBetweenLabelsRule = c_oAscBetweenLabelsRule;
	prot                                  = c_oAscBetweenLabelsRule;
	prot['auto']                          = prot.auto;
	prot['manual']                        = prot.manual;
	window['Asc']['c_oAscLabelsPosition'] = window['Asc'].c_oAscLabelsPosition = c_oAscLabelsPosition;
	prot                            = c_oAscLabelsPosition;
	prot['byDivisions']             = prot.byDivisions;
	prot['betweenDivisions']        = prot.betweenDivisions;
	window['Asc']['c_oAscAxisType'] = window['Asc'].c_oAscAxisType = c_oAscAxisType;
	prot                           = c_oAscAxisType;
	prot['auto']                   = prot.auto;
	prot['date']                   = prot.date;
	prot['text']                   = prot.text;
	prot['cat']                    = prot.cat;
	prot['val']                    = prot.val;
	window['Asc']['c_oAscHAnchor'] = window['Asc'].c_oAscHAnchor = c_oAscHAnchor;
	prot                          = c_oAscHAnchor;
	prot['Margin']                = prot.Margin;
	prot['Page']                  = prot.Page;
	prot['Text']                  = prot.Text;
	prot['PageInternal']          = prot.PageInternal;
	window['Asc']['c_oAscXAlign'] = window['Asc'].c_oAscXAlign = c_oAscXAlign;
	prot                          = c_oAscXAlign;
	prot['Center']                = prot.Center;
	prot['Inside']                = prot.Inside;
	prot['Left']                  = prot.Left;
	prot['Outside']               = prot.Outside;
	prot['Right']                 = prot.Right;
	window['Asc']['c_oAscYAlign'] = window['Asc'].c_oAscYAlign = c_oAscYAlign;
	prot                           = c_oAscYAlign;
	prot['Bottom']                 = prot.Bottom;
	prot['Center']                 = prot.Center;
	prot['Inline']                 = prot.Inline;
	prot['Inside']                 = prot.Inside;
	prot['Outside']                = prot.Outside;
	prot['Top']                    = prot.Top;
	window['Asc']['c_oAscVAnchor'] = window['Asc'].c_oAscVAnchor = c_oAscVAnchor;
	prot                                 = c_oAscVAnchor;
	prot['Margin']                       = prot.Margin;
	prot['Page']                         = prot.Page;
	prot['Text']                         = prot.Text;
	window['Asc']['c_oAscRelativeFromH'] = window['Asc'].c_oAscRelativeFromH = c_oAscRelativeFromH;
	prot                                 = c_oAscRelativeFromH;
	prot['Character']                    = prot.Character;
	prot['Column']                       = prot.Column;
	prot['InsideMargin']                 = prot.InsideMargin;
	prot['LeftMargin']                   = prot.LeftMargin;
	prot['Margin']                       = prot.Margin;
	prot['OutsideMargin']                = prot.OutsideMargin;
	prot['Page']                         = prot.Page;
	prot['RightMargin']                  = prot.RightMargin;
	window['Asc']['c_oAscRelativeFromV'] = window['Asc'].c_oAscRelativeFromV = c_oAscRelativeFromV;
	prot                                   = c_oAscRelativeFromV;
	prot['BottomMargin']                   = prot.BottomMargin;
	prot['InsideMargin']                   = prot.InsideMargin;
	prot['Line']                           = prot.Line;
	prot['Margin']                         = prot.Margin;
	prot['OutsideMargin']                  = prot.OutsideMargin;
	prot['Page']                           = prot.Page;
	prot['Paragraph']                      = prot.Paragraph;
	prot['TopMargin']                      = prot.TopMargin;
	window['Asc']['c_oAscPageOrientation'] = window['AscCommon'].c_oAscBorderStyles = c_oAscBorderStyles;
	prot                         = c_oAscPageOrientation;
	prot['None']                 = prot.None;
	prot['Double']               = prot.Double;
	prot['Hair']                 = prot.Hair;
	prot['DashDotDot']           = prot.DashDotDot;
	prot['DashDot']              = prot.DashDot;
	prot['Dotted']               = prot.Dotted;
	prot['Dashed']               = prot.Dashed;
	prot['Thin']                 = prot.Thin;
	prot['MediumDashDotDot']     = prot.MediumDashDotDot;
	prot['SlantDashDot']         = prot.SlantDashDot;
	prot['MediumDashDot']        = prot.MediumDashDot;
	prot['MediumDashed']         = prot.MediumDashed;
	prot['Medium']               = prot.Medium;
	prot['Thick']                = prot.Thick;
	window['Asc']['c_oAscPageOrientation'] = window['Asc'].c_oAscPageOrientation = c_oAscPageOrientation;
	prot                         = c_oAscPageOrientation;
	prot['PagePortrait']         = prot.PagePortrait;
	prot['PageLandscape']        = prot.PageLandscape;
	window['Asc']['c_oAscColor'] = window['Asc'].c_oAscColor = c_oAscColor;
	prot                        = c_oAscColor;
	prot['COLOR_TYPE_NONE']     = prot.COLOR_TYPE_NONE;
	prot['COLOR_TYPE_SRGB']     = prot.COLOR_TYPE_SRGB;
	prot['COLOR_TYPE_PRST']     = prot.COLOR_TYPE_PRST;
	prot['COLOR_TYPE_SCHEME']   = prot.COLOR_TYPE_SCHEME;
	prot['COLOR_TYPE_SYS']      = prot.COLOR_TYPE_SYS;
	window['Asc']['c_oAscFill'] = window['Asc'].c_oAscFill = c_oAscFill;
	prot                                = c_oAscFill;
	prot['FILL_TYPE_NONE']              = prot.FILL_TYPE_NONE;
	prot['FILL_TYPE_BLIP']              = prot.FILL_TYPE_BLIP;
	prot['FILL_TYPE_NOFILL']            = prot.FILL_TYPE_NOFILL;
	prot['FILL_TYPE_SOLID']             = prot.FILL_TYPE_SOLID;
	prot['FILL_TYPE_GRAD']              = prot.FILL_TYPE_GRAD;
	prot['FILL_TYPE_PATT']              = prot.FILL_TYPE_PATT;
	prot['FILL_TYPE_GRP']               = prot.FILL_TYPE_GRP;
	window['Asc']['c_oAscFillGradType'] = window['Asc'].c_oAscFillGradType = c_oAscFillGradType;
	prot                                = c_oAscFillGradType;
	prot['GRAD_LINEAR']                 = prot.GRAD_LINEAR;
	prot['GRAD_PATH']                   = prot.GRAD_PATH;
	window['Asc']['c_oAscFillBlipType'] = window['Asc'].c_oAscFillBlipType = c_oAscFillBlipType;
	prot                              = c_oAscFillBlipType;
	prot['STRETCH']                   = prot.STRETCH;
	prot['TILE']                      = prot.TILE;
	window['Asc']['c_oAscStrokeType'] = window['Asc'].c_oAscStrokeType = c_oAscStrokeType;
	prot                                     = c_oAscStrokeType;
	prot['STROKE_NONE']                      = prot.STROKE_NONE;
	prot['STROKE_COLOR']                     = prot.STROKE_COLOR;
	window['Asc']['c_oAscVAlign'] = window['Asc'].c_oAscVAlign = c_oAscVAlign;
	prot                          = c_oAscVAlign;
	prot['Bottom']                = prot.Bottom;
	prot['Center']                = prot.Center;
	prot['Dist']                  = prot.Dist;
	prot['Just']                  = prot.Just;
	prot['Top']                   = prot.Top;
	window['Asc']['c_oAscVertDrawingText']   = c_oAscVertDrawingText;
	prot                                     = c_oAscVertDrawingText;
	prot['normal']                           = prot.normal;
	prot['vert']                             = prot.vert;
	prot['vert270']                          = prot.vert270;
	window['Asc']['c_oAscLineJoinType']      = c_oAscLineJoinType;
	prot                                     = c_oAscLineJoinType;
	prot['Round']                            = prot.Round;
	prot['Bevel']                            = prot.Bevel;
	prot['Miter']                            = prot.Miter;
	window['Asc']['c_oAscLineCapType']       = c_oAscLineCapType;
	prot                                     = c_oAscLineCapType;
	prot['Flat']                             = prot.Flat;
	prot['Round']                            = prot.Round;
	prot['Square']                           = prot.Square;
	window['Asc']['c_oAscLineBeginType']     = c_oAscLineBeginType;
	prot                                     = c_oAscLineBeginType;
	prot['None']                             = prot.None;
	prot['Arrow']                            = prot.Arrow;
	prot['Diamond']                          = prot.Diamond;
	prot['Oval']                             = prot.Oval;
	prot['Stealth']                          = prot.Stealth;
	prot['Triangle']                         = prot.Triangle;
	window['Asc']['c_oAscLineBeginSize']     = c_oAscLineBeginSize;
	prot                                     = c_oAscLineBeginSize;
	prot['small_small']                      = prot.small_small;
	prot['small_mid']                        = prot.small_mid;
	prot['small_large']                      = prot.small_large;
	prot['mid_small']                        = prot.mid_small;
	prot['mid_mid']                          = prot.mid_mid;
	prot['mid_large']                        = prot.mid_large;
	prot['large_small']                      = prot.large_small;
	prot['large_mid']                        = prot.large_mid;
	prot['large_large']                      = prot.large_large;
	window['Asc']['c_oAscCellTextDirection'] = window['Asc'].c_oAscCellTextDirection = c_oAscCellTextDirection;
	prot                                 = c_oAscCellTextDirection;
	prot['LRTB']                         = prot.LRTB;
	prot['TBRL']                         = prot.TBRL;
	prot['BTLR']                         = prot.BTLR;
	window['Asc']['c_oAscDocumentUnits'] = window['Asc'].c_oAscDocumentUnits = c_oAscDocumentUnits;
	prot                                    = c_oAscDocumentUnits;
	prot['Millimeter']                      = prot.Millimeter;
	prot['Inch']                            = prot.Inch;
	prot['Point']                           = prot.Point;
	window['Asc']['c_oAscMaxTooltipLength'] = window['Asc'].c_oAscMaxTooltipLength = c_oAscMaxTooltipLength;
	window['Asc']['c_oAscMaxCellOrCommentLength'] = window['Asc'].c_oAscMaxCellOrCommentLength = c_oAscMaxCellOrCommentLength;
	window['Asc']['c_oAscSelectionType'] = window['Asc'].c_oAscSelectionType = c_oAscSelectionType;
	prot                                 = c_oAscSelectionType;
	prot['RangeCells']                   = prot.RangeCells;
	prot['RangeCol']                     = prot.RangeCol;
	prot['RangeRow']                     = prot.RangeRow;
	prot['RangeMax']                     = prot.RangeMax;
	prot['RangeImage']                   = prot.RangeImage;
	prot['RangeChart']                   = prot.RangeChart;
	prot['RangeShape']                   = prot.RangeShape;
	prot['RangeShapeText']               = prot.RangeShapeText;
	prot['RangeChartText']               = prot.RangeChartText;
	prot['RangeFrozen']                  = prot.RangeFrozen;
	window['Asc']['c_oAscInsertOptions'] = window['Asc'].c_oAscInsertOptions = c_oAscInsertOptions;
	prot                                 = c_oAscInsertOptions;
	prot['InsertCellsAndShiftRight']     = prot.InsertCellsAndShiftRight;
	prot['InsertCellsAndShiftDown']      = prot.InsertCellsAndShiftDown;
	prot['InsertColumns']                = prot.InsertColumns;
	prot['InsertRows']                   = prot.InsertRows;
	prot['InsertTableRowAbove']          = prot.InsertTableRowAbove;
	prot['InsertTableRowBelow']          = prot.InsertTableRowBelow;
	prot['InsertTableColLeft']           = prot.InsertTableColLeft;
	prot['InsertTableColRight']          = prot.InsertTableColRight;
	window['Asc']['c_oAscDeleteOptions'] = window['Asc'].c_oAscDeleteOptions = c_oAscDeleteOptions;
	prot                            = c_oAscDeleteOptions;
	prot['DeleteCellsAndShiftLeft'] = prot.DeleteCellsAndShiftLeft;
	prot['DeleteCellsAndShiftTop']  = prot.DeleteCellsAndShiftTop;
	prot['DeleteColumns']           = prot.DeleteColumns;
	prot['DeleteRows']              = prot.DeleteRows;
	prot['DeleteTable']             = prot.DeleteTable;

	window['Asc']['c_oDashType'] = window['Asc'].c_oDashType = c_oDashType;
	prot                  = c_oDashType;
	prot['dash']          = prot.dash;
	prot['dashDot']       = prot.dashDot;
	prot['dot']           = prot.dot;
	prot['lgDash']        = prot.lgDash;
	prot['lgDashDot']     = prot.lgDashDot;
	prot['lgDashDotDot']  = prot.lgDashDotDot;
	prot['solid']         = prot.solid;
	prot['sysDash']       = prot.sysDash;
	prot['sysDashDot']    = prot.sysDashDot;
	prot['sysDashDotDot'] = prot.sysDashDotDot;
	prot['sysDot']        = prot.sysDot;


    window['Asc']['c_oAscMathInterfaceType'] = window['Asc'].c_oAscMathInterfaceType = c_oAscMathInterfaceType;
    prot                  = c_oAscMathInterfaceType;
    prot['Common'] = prot.Common;
    prot['Fraction'] = prot.Fraction;
    prot['Script'] = prot.Script;
    prot['Radical'] = prot.Radical;
    prot['LargeOperator'] = prot.LargeOperator;
    prot['Delimiter'] = prot.Delimiter;
    prot['Function'] = prot.Function;
    prot['Accent'] = prot.Accent;
    prot['BorderBox'] = prot.BorderBox;
    prot['Bar'] = prot.Bar;
    prot['Box'] = prot.Box;
    prot['Limit'] = prot.Limit;
    prot['GroupChar'] = prot.GroupChar;
    prot['Matrix'] = prot.Matrix;
    prot['EqArray'] = prot.EqArray;
    prot['Phantom'] = prot.Phantom;



	prot = window['Asc']['c_oAscMathInterfaceBarPos'] = window['Asc'].c_oAscMathInterfaceBarPos = c_oAscMathInterfaceBarPos;
	prot['Top']    = c_oAscMathInterfaceBarPos.Top;
	prot['Bottom'] = c_oAscMathInterfaceBarPos.Bottom;

	prot = window['Asc']['c_oAscMathInterfaceScript'] = window['Asc'].c_oAscMathInterfaceScript = c_oAscMathInterfaceScript;
	prot['None']      = c_oAscMathInterfaceScript.None;
	prot['Sup']       = c_oAscMathInterfaceScript.Sup;
	prot['Sub']       = c_oAscMathInterfaceScript.Sub;
	prot['SubSup']    = c_oAscMathInterfaceScript.SubSup;
	prot['PreSubSup'] = c_oAscMathInterfaceScript.PreSubSup;

	prot = window['Asc']['c_oAscMathInterfaceFraction'] = window['Asc'].c_oAscMathInterfaceFraction = c_oAscMathInterfaceFraction;
	prot['None']   = c_oAscMathInterfaceFraction.Bar;
	prot['Skewed'] = c_oAscMathInterfaceFraction.Skewed;
	prot['Linear'] = c_oAscMathInterfaceFraction.Linear;
	prot['NoBar']  = c_oAscMathInterfaceFraction.NoBar;

	prot = window['Asc']['c_oAscMathInterfaceLimitPos'] = window['Asc'].c_oAscMathInterfaceLimitPos = c_oAscMathInterfaceLimitPos;
	prot['None']   = c_oAscMathInterfaceLimitPos.None;
	prot['Top']    = c_oAscMathInterfaceLimitPos.Top;
	prot['Bottom'] = c_oAscMathInterfaceLimitPos.Bottom;

	prot = window['Asc']['c_oAscMathInterfaceMatrixMatrixAlign'] = window['Asc'].c_oAscMathInterfaceMatrixMatrixAlign = c_oAscMathInterfaceMatrixMatrixAlign;
	prot['Top']    = c_oAscMathInterfaceMatrixMatrixAlign.Top;
	prot['Center'] = c_oAscMathInterfaceMatrixMatrixAlign.Center;
	prot['Bottom'] = c_oAscMathInterfaceMatrixMatrixAlign.Bottom;

	prot = window['Asc']['c_oAscMathInterfaceMatrixColumnAlign'] = window['Asc'].c_oAscMathInterfaceMatrixColumnAlign = c_oAscMathInterfaceMatrixColumnAlign;
	prot['Left']   = c_oAscMathInterfaceMatrixColumnAlign.Left;
	prot['Center'] = c_oAscMathInterfaceMatrixColumnAlign.Center;
	prot['Right']  = c_oAscMathInterfaceMatrixColumnAlign.Right;

	prot = window['Asc']['c_oAscMathInterfaceEqArrayAlign'] = window['Asc'].c_oAscMathInterfaceEqArrayAlign = c_oAscMathInterfaceEqArrayAlign;
	prot['Top']    = c_oAscMathInterfaceEqArrayAlign.Top;
	prot['Center'] = c_oAscMathInterfaceEqArrayAlign.Center;
	prot['Bottom'] = c_oAscMathInterfaceEqArrayAlign.Bottom;

	prot = window['Asc']['c_oAscMathInterfaceNaryLimitLocation'] = window['Asc'].c_oAscMathInterfaceNaryLimitLocation = c_oAscMathInterfaceNaryLimitLocation;
	prot['UndOvr'] = c_oAscMathInterfaceNaryLimitLocation.UndOvr;
	prot['SubSup'] = c_oAscMathInterfaceNaryLimitLocation.SubSup;

	prot = window['Asc']['c_oAscMathInterfaceGroupCharPos'] = window['Asc'].c_oAscMathInterfaceGroupCharPos = c_oAscMathInterfaceGroupCharPos;
	prot['None']   = c_oAscMathInterfaceGroupCharPos.None;
	prot['Top']    = c_oAscMathInterfaceGroupCharPos.Top;
	prot['Bottom'] = c_oAscMathInterfaceGroupCharPos.Bottom;

    window['AscCommon']                             = window['AscCommon'] || {};
	window["AscCommon"].g_cCharDelimiter            = g_cCharDelimiter;
	window["AscCommon"].g_cGeneralFormat            = g_cGeneralFormat;
	window["AscCommon"].bDate1904                   = false;
	window["AscCommon"].c_oAscAdvancedOptionsAction = c_oAscAdvancedOptionsAction;
	window["AscCommon"].DownloadType                = DownloadType;
	window["AscCommon"].CellValueType               = CellValueType;
	window["AscCommon"].c_oAscCellAnchorType        = c_oAscCellAnchorType;
	window["AscCommon"].c_oAscChartDefines          = c_oAscChartDefines;
	window["AscCommon"].c_oAscStyleImage            = c_oAscStyleImage;
	window["AscCommon"].c_oAscLineDrawingRule       = c_oAscLineDrawingRule;
	window["AscCommon"].align_Right                 = align_Right;
	window["AscCommon"].align_Left                  = align_Left;
	window["AscCommon"].align_Center                = align_Center;
	window["AscCommon"].align_Justify               = align_Justify;
	window["AscCommon"].vertalign_Baseline          = vertalign_Baseline;
	window["AscCommon"].vertalign_SuperScript       = vertalign_SuperScript;
	window["AscCommon"].vertalign_SubScript         = vertalign_SubScript;
	window["AscCommon"].hdrftr_Header               = hdrftr_Header;
	window["AscCommon"].hdrftr_Footer               = hdrftr_Footer;
	window["AscCommon"].c_oAscSizeRelFromH          = c_oAscSizeRelFromH;
	window["AscCommon"].c_oAscSizeRelFromV          = c_oAscSizeRelFromV;
	window["AscCommon"].c_oAscWrapStyle             = c_oAscWrapStyle;
	window["AscCommon"].c_oAscBorderWidth           = c_oAscBorderWidth;
	window["AscCommon"].c_oAscBorderType            = c_oAscBorderType;
	window["AscCommon"].c_oAscLockTypes             = c_oAscLockTypes;
	window["AscCommon"].c_oAscFormatPainterState    = c_oAscFormatPainterState;
	window["AscCommon"].c_oAscSaveTypes             = c_oAscSaveTypes;
	window["AscCommon"].c_oAscChartType             = c_oAscChartType;
	window["AscCommon"].c_oAscChartSubType          = c_oAscChartSubType;
	window["AscCommon"].c_oAscCsvDelimiter          = c_oAscCsvDelimiter;
	window["AscCommon"].c_oAscUrlType               = c_oAscUrlType;
	window["AscCommon"].c_oAscMouseMoveDataTypes    = c_oAscMouseMoveDataTypes;
	window["AscCommon"].c_oAscPrintDefaultSettings  = c_oAscPrintDefaultSettings;
	window["AscCommon"].c_oZoomType                 = c_oZoomType;
	window["AscCommon"].c_oNotifyType               = c_oNotifyType;
	window["AscCommon"].c_oNotifyParentType         = c_oNotifyParentType;
	window["AscCommon"].c_oAscEncodings             = c_oAscEncodings;
	window["AscCommon"].c_oAscEncodingsMap          = c_oAscEncodingsMap;
	window["AscCommon"].c_oAscCodePageUtf8          = c_oAscCodePageUtf8;
	window["AscCommon"].c_oAscMaxFormulaLength      = c_oAscMaxFormulaLength;

	window["AscCommon"].locktype_None   = locktype_None;
	window["AscCommon"].locktype_Mine   = locktype_Mine;
	window["AscCommon"].locktype_Other  = locktype_Other;
	window["AscCommon"].locktype_Other2 = locktype_Other2;
	window["AscCommon"].locktype_Other3 = locktype_Other3;

	window["AscCommon"].changestype_None                     = changestype_None;
	window["AscCommon"].changestype_Paragraph_Content        = changestype_Paragraph_Content;
	window["AscCommon"].changestype_Paragraph_Properties     = changestype_Paragraph_Properties;
	window["AscCommon"].changestype_Document_Content         = changestype_Document_Content;
	window["AscCommon"].changestype_Document_Content_Add     = changestype_Document_Content_Add;
	window["AscCommon"].changestype_Document_SectPr          = changestype_Document_SectPr;
	window["AscCommon"].changestype_Document_Styles          = changestype_Document_Styles;
	window["AscCommon"].changestype_Table_Properties         = changestype_Table_Properties;
	window["AscCommon"].changestype_Table_RemoveCells        = changestype_Table_RemoveCells;
	window["AscCommon"].changestype_Image_Properties         = changestype_Image_Properties;
	window["AscCommon"].changestype_HdrFtr                   = changestype_HdrFtr;
	window["AscCommon"].changestype_Remove                   = changestype_Remove;
	window["AscCommon"].changestype_Delete                   = changestype_Delete;
	window["AscCommon"].changestype_Drawing_Props            = changestype_Drawing_Props;
	window["AscCommon"].changestype_ColorScheme              = changestype_ColorScheme;
	window["AscCommon"].changestype_Text_Props               = changestype_Text_Props;
	window["AscCommon"].changestype_RemoveSlide              = changestype_RemoveSlide;
	window["AscCommon"].changestype_Theme                    = changestype_Theme;
	window["AscCommon"].changestype_SlideSize                = changestype_SlideSize;
	window["AscCommon"].changestype_SlideBg                  = changestype_SlideBg;
	window["AscCommon"].changestype_SlideTiming              = changestype_SlideTiming;
	window["AscCommon"].changestype_MoveComment              = changestype_MoveComment;
	window["AscCommon"].changestype_AddComment               = changestype_AddComment;
	window["AscCommon"].changestype_Layout                   = changestype_Layout;
	window["AscCommon"].changestype_AddShape                 = changestype_AddShape;
	window["AscCommon"].changestype_AddShapes                = changestype_AddShapes;
	window["AscCommon"].changestype_2_InlineObjectMove       = changestype_2_InlineObjectMove;
	window["AscCommon"].changestype_2_HdrFtr                 = changestype_2_HdrFtr;
	window["AscCommon"].changestype_2_Comment                = changestype_2_Comment;
	window["AscCommon"].changestype_2_Element_and_Type       = changestype_2_Element_and_Type;
	window["AscCommon"].changestype_2_ElementsArray_and_Type = changestype_2_ElementsArray_and_Type;
	window["AscCommon"].changestype_2_AdditionalTypes        = changestype_2_AdditionalTypes;
	window["AscCommon"].contentchanges_Add                   = contentchanges_Add;
	window["AscCommon"].contentchanges_Remove                = contentchanges_Remove;

	window["AscCommon"].offlineMode = offlineMode;

	// ----------------------------- plugins ------------------------------- //
	var EPluginDataType =
		{
			none : "none",
			text : "text",
			ole  : "ole",
			html : "html"
		};

	window["Asc"]["EPluginDataType"] = window["Asc"].EPluginDataType = EPluginDataType;
	prot         = EPluginDataType;
	prot['none'] = prot.none;
	prot['text'] = prot.text;
	prot['ole']  = prot.ole;
	prot['html'] = prot.html;

	function CPluginVariation()
	{
		this.description = "";
		this.url         = "";
		this.baseUrl     = "";
		this.index       = 0;     // сверху не выставляем. оттуда в каком порядке пришли - в таком порядке и работают

		this.icons          = ["1x", "2x"];
		this.isViewer       = false;
		this.EditorsSupport = ["word", "cell", "slide"];

		this.isVisual     = false;      // визуальный ли
		this.isModal      = false;      // модальное ли окно (используется только для визуального)
		this.isInsideMode = false;      // отрисовка не в окне а внутри редактора (в панели) (используется только для визуального немодального)

		this.initDataType = EPluginDataType.none;
		this.initData     = "";

		this.isUpdateOleOnResize = false;

		this.buttons = [{"text" : "Ok", "primary" : true}, {"text" : "Cancel", "primary" : false}];

		this.size = undefined;
		this.initOnSelectionChanged = undefined;
	}

	CPluginVariation.prototype["get_Description"] = function()
	{
		return this.description;
	};
	CPluginVariation.prototype["set_Description"] = function(value)
	{
		this.description = value;
	};
	CPluginVariation.prototype["get_Url"]         = function()
	{
		return this.url;
	};
	CPluginVariation.prototype["set_Url"]         = function(value)
	{
		this.url = value;
	};

	CPluginVariation.prototype["get_Icons"] = function()
	{
		return this.icons;
	};
	CPluginVariation.prototype["set_Icons"] = function(value)
	{
		this.icons = value;
	};

	CPluginVariation.prototype["get_Viewer"]         = function()
	{
		return this.isViewer;
	};
	CPluginVariation.prototype["set_Viewer"]         = function(value)
	{
		this.isViewer = value;
	};
	CPluginVariation.prototype["get_EditorsSupport"] = function()
	{
		return this.EditorsSupport;
	};
	CPluginVariation.prototype["set_EditorsSupport"] = function(value)
	{
		this.EditorsSupport = value;
	};


	CPluginVariation.prototype["get_Visual"]     = function()
	{
		return this.isVisual;
	};
	CPluginVariation.prototype["set_Visual"]     = function(value)
	{
		this.isVisual = value;
	};
	CPluginVariation.prototype["get_Modal"]      = function()
	{
		return this.isModal;
	};
	CPluginVariation.prototype["set_Modal"]      = function(value)
	{
		this.isModal = value;
	};
	CPluginVariation.prototype["get_InsideMode"] = function()
	{
		return this.isInsideMode;
	};
	CPluginVariation.prototype["set_InsideMode"] = function(value)
	{
		this.isInsideMode = value;
	};

	CPluginVariation.prototype["get_InitDataType"] = function()
	{
		return this.initDataType;
	};
	CPluginVariation.prototype["set_InitDataType"] = function(value)
	{
		this.initDataType = value;
	};
	CPluginVariation.prototype["get_InitData"]     = function()
	{
		return this.initData;
	};
	CPluginVariation.prototype["set_InitData"]     = function(value)
	{
		this.initData = value;
	};

	CPluginVariation.prototype["get_UpdateOleOnResize"] = function()
	{
		return this.isUpdateOleOnResize;
	};
	CPluginVariation.prototype["set_UpdateOleOnResize"] = function(value)
	{
		this.isUpdateOleOnResize = value;
	};
	CPluginVariation.prototype["get_Buttons"]           = function()
	{
		return this.buttons;
	};
	CPluginVariation.prototype["set_Buttons"]           = function(value)
	{
		this.buttons = value;
	};
	CPluginVariation.prototype["get_Size"]           = function()
	{
		return this.size;
	};
	CPluginVariation.prototype["set_Size"]           = function(value)
	{
		this.size = value;
	};
	CPluginVariation.prototype["get_InitOnSelectionChanged"]           = function()
	{
		return this.initOnSelectionChanged;
	};
	CPluginVariation.prototype["set_InitOnSelectionChanged"]           = function(value)
	{
		this.initOnSelectionChanged = value;
	};

	CPluginVariation.prototype["serialize"]   = function()
	{
		var _object            = {};
		_object["description"] = this.description;
		_object["url"]         = this.url;
		_object["index"]       = this.index;

		_object["icons"]          = this.icons;
		_object["isViewer"]       = this.isViewer;
		_object["EditorsSupport"] = this.EditorsSupport;

		_object["isVisual"]     = this.isVisual;
		_object["isModal"]      = this.isModal;
		_object["isInsideMode"] = this.isInsideMode;

		_object["initDataType"] = this.initDataType;
		_object["initData"]     = this.initData;

		_object["isUpdateOleOnResize"] = this.isUpdateOleOnResize;

		_object["buttons"] = this.buttons;

		_object["size"] = this.size;
		_object["initOnSelectionChanged"] = this.initOnSelectionChanged;

		return _object;
	};
	CPluginVariation.prototype["deserialize"] = function(_object)
	{
		this.description = (_object["description"] != null) ? _object["description"] : this.description;
		this.url         = (_object["url"] != null) ? _object["url"] : this.url;
		this.index       = (_object["index"] != null) ? _object["index"] : this.index;

		this.icons          = (_object["icons"] != null) ? _object["icons"] : this.icons;
		this.isViewer       = (_object["isViewer"] != null) ? _object["isViewer"] : this.isViewer;
		this.EditorsSupport = (_object["EditorsSupport"] != null) ? _object["EditorsSupport"] : this.EditorsSupport;

		this.isVisual     = (_object["isVisual"] != null) ? _object["isVisual"] : this.isVisual;
		this.isModal      = (_object["isModal"] != null) ? _object["isModal"] : this.isModal;
		this.isInsideMode = (_object["isInsideMode"] != null) ? _object["isInsideMode"] : this.isInsideMode;

		this.initDataType = (_object["initDataType"] != null) ? _object["initDataType"] : this.initDataType;
		this.initData     = (_object["initData"] != null) ? _object["initData"] : this.initData;

		this.isUpdateOleOnResize = (_object["isUpdateOleOnResize"] != null) ? _object["isUpdateOleOnResize"] : this.isUpdateOleOnResize;

		this.buttons = (_object["buttons"] != null) ? _object["buttons"] : this.buttons;

		this.size = (_object["size"] != null) ? _object["size"] : this.size;
		this.initOnSelectionChanged = (_object["initOnSelectionChanged"] != null) ? _object["initOnSelectionChanged"] : this.initOnSelectionChanged;
	};

	function CPlugin()
	{
		this.name    = "";
		this.guid    = "";
		this.baseUrl = "";

		this.variations = [];
	}

	CPlugin.prototype["get_Name"]    = function()
	{
		return this.name;
	};
	CPlugin.prototype["set_Name"]    = function(value)
	{
		this.name = value;
	};
	CPlugin.prototype["get_Guid"]    = function()
	{
		return this.guid;
	};
	CPlugin.prototype["set_Guid"]    = function(value)
	{
		this.guid = value;
	};
	CPlugin.prototype["get_BaseUrl"] = function()
	{
		return this.baseUrl;
	};
	CPlugin.prototype["set_BaseUrl"] = function(value)
	{
		this.baseUrl = value;
	};

	CPlugin.prototype["get_Variations"] = function()
	{
		return this.variations;
	};
	CPlugin.prototype["set_Variations"] = function(value)
	{
		this.variations = value;
	};

	CPlugin.prototype["serialize"]   = function()
	{
		var _object           = {};
		_object["name"]       = this.name;
		_object["guid"]       = this.guid;
		_object["baseUrl"]    = this.baseUrl;
		_object["variations"] = [];
		for (var i = 0; i < this.variations.length; i++)
		{
			_object["variations"].push(this.variations[i].serialize());
		}
		return _object;
	}
	CPlugin.prototype["deserialize"] = function(_object)
	{
		this.name       = (_object["name"] != null) ? _object["name"] : this.name;
		this.guid       = (_object["guid"] != null) ? _object["guid"] : this.guid;
		this.baseUrl    = (_object["baseUrl"] != null) ? _object["baseUrl"] : this.baseUrl;
		this.variations = [];
		for (var i = 0; i < _object["variations"].length; i++)
		{
			var _variation = new CPluginVariation();
			_variation["deserialize"](_object["variations"][i]);
			this.variations.push(_variation);
		}
	}

	window["Asc"]["CPluginVariation"] = window["Asc"].CPluginVariation = CPluginVariation;
	window["Asc"]["CPlugin"] = window["Asc"].CPlugin = CPlugin;
	// --------------------------------------------------------------------- //
})(window);
