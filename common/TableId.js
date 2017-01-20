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

/**
 * User: Ilja.Kirillov
 * Date: 26.10.2016
 * Time: 18:45
 */

(/**
 * @param {Window} window
 * @param {undefined} undefined
 */
	function(window, undefined)
{
	function CTableId()
	{
		this.m_aPairs        = null;
		this.m_bTurnOff      = false;
		this.m_oFactoryClass = {};
		this.Id              = null;
		this.isInit          = false;
	}

	CTableId.prototype.checkInit = function()
	{
		return this.isInit;
	};
	CTableId.prototype.init = function()
	{
		this.m_aPairs        = {};
		this.m_bTurnOff      = false;
		this.m_oFactoryClass = {};
		this.Id              = AscCommon.g_oIdCounter.Get_NewId();
		this.Add(this, this.Id);
		this.private_InitFactoryClass();
		this.isInit = true;
	};
	CTableId.prototype.Add = function(Class, Id)
	{
		if (false === this.m_bTurnOff)
		{
			Class.Id          = Id;
			this.m_aPairs[Id] = Class;

			AscCommon.History.Add(new AscCommon.CChangesTableIdAdd(this, Id, Class));
		}
	};
	CTableId.prototype.TurnOff = function()
	{
		this.m_bTurnOff = true;
	};
	CTableId.prototype.TurnOn = function()
	{
		this.m_bTurnOff = false;
	};
	/**
	 * Получаем указатель на класс по Id
	 * @param Id
	 * @returns {*}
	 */
	CTableId.prototype.Get_ById = function(Id)
	{
		if ("" === Id)
			return null;

		if (this.m_aPairs[Id])
			return this.m_aPairs[Id];

		return null;
	};
	/**
	 * Получаем Id, по классу (вообще, данную функцию лучше не использовать)
	 * @param Class
	 * @returns {*}
	 */
	CTableId.prototype.Get_ByClass = function(Class)
	{
		if (Class.Get_Id)
			return Class.Get_Id();

		if (Class.GetId())
			return Class.GetId();

		return null;
	};
	CTableId.prototype.Reset_Id = function(Class, Id_new, Id_old)
	{
		if (Class === this.m_aPairs[Id_old])
		{
			delete this.m_aPairs[Id_old];
			this.m_aPairs[Id_new] = Class;

			AscCommon.History.Add(new AscCommon.CChangesTableIdReset(this, Id_old, Id_new));
		}
		else
		{
			this.Add(Class, Id_new);
		}
	};
	CTableId.prototype.Get_Id = function()
	{
		return this.Id;
	};
	CTableId.prototype.Clear = function()
	{
		this.m_aPairs   = {};
		this.m_bTurnOff = false;
		this.Id         = AscCommon.g_oIdCounter.Get_NewId();
		this.Add(this, this.Id);
	};
	CTableId.prototype.private_InitFactoryClass = function()
	{
		this.m_oFactoryClass[AscDFH.historyitem_type_Paragraph]              = AscCommonWord.Paragraph;
		this.m_oFactoryClass[AscDFH.historyitem_type_TextPr]                 = AscCommonWord.ParaTextPr;
		this.m_oFactoryClass[AscDFH.historyitem_type_Hyperlink]              = AscCommonWord.ParaHyperlink;
		this.m_oFactoryClass[AscDFH.historyitem_type_Drawing]                = AscCommonWord.ParaDrawing;
		this.m_oFactoryClass[AscDFH.historyitem_type_Table]                  = AscCommonWord.CTable;
		this.m_oFactoryClass[AscDFH.historyitem_type_TableRow]               = AscCommonWord.CTableRow;
		this.m_oFactoryClass[AscDFH.historyitem_type_TableCell]              = AscCommonWord.CTableCell;
		this.m_oFactoryClass[AscDFH.historyitem_type_DocumentContent]        = AscCommonWord.CDocumentContent;
		this.m_oFactoryClass[AscDFH.historyitem_type_HdrFtr]                 = AscCommonWord.CHeaderFooter;
		this.m_oFactoryClass[AscDFH.historyitem_type_AbstractNum]            = AscCommonWord.CAbstractNum;
		this.m_oFactoryClass[AscDFH.historyitem_type_Comment]                = AscCommon.CComment;
		this.m_oFactoryClass[AscDFH.historyitem_type_Style]                  = AscCommonWord.CStyle;
		this.m_oFactoryClass[AscDFH.historyitem_type_CommentMark]            = AscCommon.ParaComment;
		this.m_oFactoryClass[AscDFH.historyitem_type_ParaRun]                = AscCommonWord.ParaRun;
		this.m_oFactoryClass[AscDFH.historyitem_type_Section]                = AscCommonWord.CSectionPr;
		this.m_oFactoryClass[AscDFH.historyitem_type_Field]                  = AscCommonWord.ParaField;
		this.m_oFactoryClass[AscDFH.historyitem_type_FootEndNote]            = AscCommonWord.CFootEndnote;
		this.m_oFactoryClass[AscDFH.historyitem_type_DefaultShapeDefinition] = AscFormat.DefaultShapeDefinition;
		this.m_oFactoryClass[AscDFH.historyitem_type_CNvPr]                  = AscFormat.CNvPr;
		this.m_oFactoryClass[AscDFH.historyitem_type_NvPr]                   = AscFormat.NvPr;
		this.m_oFactoryClass[AscDFH.historyitem_type_Ph]                     = AscFormat.Ph;
		this.m_oFactoryClass[AscDFH.historyitem_type_UniNvPr]                = AscFormat.UniNvPr;
		this.m_oFactoryClass[AscDFH.historyitem_type_StyleRef]               = AscFormat.StyleRef;
		this.m_oFactoryClass[AscDFH.historyitem_type_FontRef]                = AscFormat.FontRef;
		this.m_oFactoryClass[AscDFH.historyitem_type_Chart]                  = AscFormat.CChart;
		this.m_oFactoryClass[AscDFH.historyitem_type_ChartSpace]             = AscFormat.CChartSpace;
		this.m_oFactoryClass[AscDFH.historyitem_type_Legend]                 = AscFormat.CLegend;
		this.m_oFactoryClass[AscDFH.historyitem_type_Layout]                 = AscFormat.CLayout;
		this.m_oFactoryClass[AscDFH.historyitem_type_LegendEntry]            = AscFormat.CLegendEntry;
		this.m_oFactoryClass[AscDFH.historyitem_type_PivotFmt]               = AscFormat.CPivotFmt;
		this.m_oFactoryClass[AscDFH.historyitem_type_DLbl]                   = AscFormat.CDLbl;
		this.m_oFactoryClass[AscDFH.historyitem_type_Marker]                 = AscFormat.CMarker;
		this.m_oFactoryClass[AscDFH.historyitem_type_PlotArea]               = AscFormat.CPlotArea;
		this.m_oFactoryClass[AscDFH.historyitem_type_NumFmt]                 = AscFormat.CNumFmt;
		this.m_oFactoryClass[AscDFH.historyitem_type_Scaling]                = AscFormat.CScaling;
		this.m_oFactoryClass[AscDFH.historyitem_type_DTable]                 = AscFormat.CDTable;
		this.m_oFactoryClass[AscDFH.historyitem_type_LineChart]              = AscFormat.CLineChart;
		this.m_oFactoryClass[AscDFH.historyitem_type_DLbls]                  = AscFormat.CDLbls;
		this.m_oFactoryClass[AscDFH.historyitem_type_UpDownBars]             = AscFormat.CUpDownBars;
		this.m_oFactoryClass[AscDFH.historyitem_type_BarChart]               = AscFormat.CBarChart;
		this.m_oFactoryClass[AscDFH.historyitem_type_BubbleChart]            = AscFormat.CBubbleChart;
		this.m_oFactoryClass[AscDFH.historyitem_type_DoughnutChart]          = AscFormat.CDoughnutChart;
		this.m_oFactoryClass[AscDFH.historyitem_type_OfPieChart]             = AscFormat.COfPieChart;
		this.m_oFactoryClass[AscDFH.historyitem_type_PieChart]               = AscFormat.CPieChart;
		this.m_oFactoryClass[AscDFH.historyitem_type_RadarChart]             = AscFormat.CRadarChart;
		this.m_oFactoryClass[AscDFH.historyitem_type_ScatterChart]           = AscFormat.CScatterChart;
		this.m_oFactoryClass[AscDFH.historyitem_type_StockChart]             = AscFormat.CStockChart;
		this.m_oFactoryClass[AscDFH.historyitem_type_SurfaceChart]           = AscFormat.CSurfaceChart;
		this.m_oFactoryClass[AscDFH.historyitem_type_BandFmt]                = AscFormat.CBandFmt;
		this.m_oFactoryClass[AscDFH.historyitem_type_AreaChart]              = AscFormat.CAreaChart;
		this.m_oFactoryClass[AscDFH.historyitem_type_ScatterSer]             = AscFormat.CScatterSeries;
		this.m_oFactoryClass[AscDFH.historyitem_type_DPt]                    = AscFormat.CDPt;
		this.m_oFactoryClass[AscDFH.historyitem_type_ErrBars]                = AscFormat.CErrBars;
		this.m_oFactoryClass[AscDFH.historyitem_type_MinusPlus]              = AscFormat.CMinusPlus;
		this.m_oFactoryClass[AscDFH.historyitem_type_NumLit]                 = AscFormat.CNumLit;
		this.m_oFactoryClass[AscDFH.historyitem_type_NumericPoint]           = AscFormat.CNumericPoint;
		this.m_oFactoryClass[AscDFH.historyitem_type_NumRef]                 = AscFormat.CNumRef;
		this.m_oFactoryClass[AscDFH.historyitem_type_TrendLine]              = AscFormat.CTrendLine;
		this.m_oFactoryClass[AscDFH.historyitem_type_Tx]                     = AscFormat.CTx;
		this.m_oFactoryClass[AscDFH.historyitem_type_StrRef]                 = AscFormat.CStrRef;
		this.m_oFactoryClass[AscDFH.historyitem_type_StrCache]               = AscFormat.CStrCache;
		this.m_oFactoryClass[AscDFH.historyitem_type_StrPoint]               = AscFormat.CStringPoint;
		this.m_oFactoryClass[AscDFH.historyitem_type_XVal]                   = AscFormat.CXVal;
		this.m_oFactoryClass[AscDFH.historyitem_type_MultiLvlStrRef]         = AscFormat.CMultiLvlStrRef;
		this.m_oFactoryClass[AscDFH.historyitem_type_MultiLvlStrCache]       = AscFormat.CMultiLvlStrCache;
		this.m_oFactoryClass[AscDFH.historyitem_type_StringLiteral]          = AscFormat.CStringLiteral;
		this.m_oFactoryClass[AscDFH.historyitem_type_YVal]                   = AscFormat.CYVal;
		this.m_oFactoryClass[AscDFH.historyitem_type_AreaSeries]             = AscFormat.CAreaSeries;
		this.m_oFactoryClass[AscDFH.historyitem_type_Cat]                    = AscFormat.CCat;
		this.m_oFactoryClass[AscDFH.historyitem_type_PictureOptions]         = AscFormat.CPictureOptions;
		this.m_oFactoryClass[AscDFH.historyitem_type_RadarSeries]            = AscFormat.CRadarSeries;
		this.m_oFactoryClass[AscDFH.historyitem_type_BarSeries]              = AscFormat.CBarSeries;
		this.m_oFactoryClass[AscDFH.historyitem_type_LineSeries]             = AscFormat.CLineSeries;
		this.m_oFactoryClass[AscDFH.historyitem_type_PieSeries]              = AscFormat.CPieSeries;
		this.m_oFactoryClass[AscDFH.historyitem_type_SurfaceSeries]          = AscFormat.CSurfaceSeries;
		this.m_oFactoryClass[AscDFH.historyitem_type_BubbleSeries]           = AscFormat.CBubbleSeries;
		this.m_oFactoryClass[AscDFH.historyitem_type_ExternalData]           = AscFormat.CExternalData;
		this.m_oFactoryClass[AscDFH.historyitem_type_PivotSource]            = AscFormat.CPivotSource;
		this.m_oFactoryClass[AscDFH.historyitem_type_Protection]             = AscFormat.CProtection;
		this.m_oFactoryClass[AscDFH.historyitem_type_ChartWall]              = AscFormat.CChartWall;
		this.m_oFactoryClass[AscDFH.historyitem_type_View3d]                 = AscFormat.CView3d;
		this.m_oFactoryClass[AscDFH.historyitem_type_ChartText]              = AscFormat.CChartText;
		this.m_oFactoryClass[AscDFH.historyitem_type_ShapeStyle]             = AscFormat.CShapeStyle;
		this.m_oFactoryClass[AscDFH.historyitem_type_Xfrm]                   = AscFormat.CXfrm;
		this.m_oFactoryClass[AscDFH.historyitem_type_SpPr]                   = AscFormat.CSpPr;
		this.m_oFactoryClass[AscDFH.historyitem_type_ClrScheme]              = AscFormat.ClrScheme;
		this.m_oFactoryClass[AscDFH.historyitem_type_ClrMap]                 = AscFormat.ClrMap;
		this.m_oFactoryClass[AscDFH.historyitem_type_ExtraClrScheme]         = AscFormat.ExtraClrScheme;
		this.m_oFactoryClass[AscDFH.historyitem_type_FontCollection]         = AscFormat.FontCollection;
		this.m_oFactoryClass[AscDFH.historyitem_type_FontScheme]             = AscFormat.FontScheme;
		this.m_oFactoryClass[AscDFH.historyitem_type_FormatScheme]           = AscFormat.FmtScheme;
		this.m_oFactoryClass[AscDFH.historyitem_type_ThemeElements]          = AscFormat.ThemeElements;
		this.m_oFactoryClass[AscDFH.historyitem_type_HF]                     = AscFormat.HF;
		this.m_oFactoryClass[AscDFH.historyitem_type_BgPr]                   = AscFormat.CBgPr;
		this.m_oFactoryClass[AscDFH.historyitem_type_Bg]                     = AscFormat.CBg;
		this.m_oFactoryClass[AscDFH.historyitem_type_PrintSettings]          = AscFormat.CPrintSettings;
		this.m_oFactoryClass[AscDFH.historyitem_type_HeaderFooterChart]      = AscFormat.CHeaderFooterChart;
		this.m_oFactoryClass[AscDFH.historyitem_type_PageMarginsChart]       = AscFormat.CPageMarginsChart;
		this.m_oFactoryClass[AscDFH.historyitem_type_PageSetup]              = AscFormat.CPageSetup;
		this.m_oFactoryClass[AscDFH.historyitem_type_Shape]                  = AscFormat.CShape;
		this.m_oFactoryClass[AscDFH.historyitem_type_DispUnits]              = AscFormat.CDispUnits;
		this.m_oFactoryClass[AscDFH.historyitem_type_GroupShape]             = AscFormat.CGroupShape;
		this.m_oFactoryClass[AscDFH.historyitem_type_ImageShape]             = AscFormat.CImageShape;
		this.m_oFactoryClass[AscDFH.historyitem_type_Geometry]               = AscFormat.Geometry;
		this.m_oFactoryClass[AscDFH.historyitem_type_Path]                   = AscFormat.Path;
		this.m_oFactoryClass[AscDFH.historyitem_type_TextBody]               = AscFormat.CTextBody;
		this.m_oFactoryClass[AscDFH.historyitem_type_CatAx]                  = AscFormat.CCatAx;
		this.m_oFactoryClass[AscDFH.historyitem_type_ValAx]                  = AscFormat.CValAx;
		this.m_oFactoryClass[AscDFH.historyitem_type_WrapPolygon]            = AscCommonWord.CWrapPolygon;
		this.m_oFactoryClass[AscDFH.historyitem_type_DateAx]                 = AscFormat.CDateAx;
		this.m_oFactoryClass[AscDFH.historyitem_type_SerAx]                  = AscFormat.CSerAx;
		this.m_oFactoryClass[AscDFH.historyitem_type_Title]                  = AscFormat.CTitle;
		this.m_oFactoryClass[AscDFH.historyitem_type_OleObject]              = AscFormat.COleObject;
		this.m_oFactoryClass[AscDFH.historyitem_type_DrawingContent]         = AscFormat.CDrawingDocContent;
		this.m_oFactoryClass[AscDFH.historyitem_type_Math]                   = AscCommonWord.ParaMath;
		this.m_oFactoryClass[AscDFH.historyitem_type_MathContent]            = AscCommonWord.CMathContent;
		this.m_oFactoryClass[AscDFH.historyitem_type_acc]                    = AscCommonWord.CAccent;
		this.m_oFactoryClass[AscDFH.historyitem_type_bar]                    = AscCommonWord.CBar;
		this.m_oFactoryClass[AscDFH.historyitem_type_box]                    = AscCommonWord.CBox;
		this.m_oFactoryClass[AscDFH.historyitem_type_borderBox]              = AscCommonWord.CBorderBox;
		this.m_oFactoryClass[AscDFH.historyitem_type_delimiter]              = AscCommonWord.CDelimiter;
		this.m_oFactoryClass[AscDFH.historyitem_type_eqArr]                  = AscCommonWord.CEqArray;
		this.m_oFactoryClass[AscDFH.historyitem_type_frac]                   = AscCommonWord.CFraction;
		this.m_oFactoryClass[AscDFH.historyitem_type_mathFunc]               = AscCommonWord.CMathFunc;
		this.m_oFactoryClass[AscDFH.historyitem_type_groupChr]               = AscCommonWord.CGroupCharacter;
		this.m_oFactoryClass[AscDFH.historyitem_type_lim]                    = AscCommonWord.CLimit;
		this.m_oFactoryClass[AscDFH.historyitem_type_matrix]                 = AscCommonWord.CMathMatrix;
		this.m_oFactoryClass[AscDFH.historyitem_type_nary]                   = AscCommonWord.CNary;
		this.m_oFactoryClass[AscDFH.historyitem_type_phant]                  = AscCommonWord.CPhantom;
		this.m_oFactoryClass[AscDFH.historyitem_type_rad]                    = AscCommonWord.CRadical;
		this.m_oFactoryClass[AscDFH.historyitem_type_deg_subsup]             = AscCommonWord.CDegreeSubSup;
		this.m_oFactoryClass[AscDFH.historyitem_type_deg]                    = AscCommonWord.CDegree;

		if (window['AscCommonSlide'])
		{
			this.m_oFactoryClass[AscDFH.historyitem_type_Slide]         = AscCommonSlide.Slide;
			this.m_oFactoryClass[AscDFH.historyitem_type_SlideLayout]   = AscCommonSlide.SlideLayout;
			this.m_oFactoryClass[AscDFH.historyitem_type_SlideMaster]   = AscCommonSlide.MasterSlide;
			this.m_oFactoryClass[AscDFH.historyitem_type_SlideComments] = AscCommonSlide.SlideComments;
			this.m_oFactoryClass[AscDFH.historyitem_type_PropLocker]    = AscCommonSlide.PropLocker;
		}

		this.m_oFactoryClass[AscDFH.historyitem_type_Theme]                  = AscFormat.CTheme;
		this.m_oFactoryClass[AscDFH.historyitem_type_GraphicFrame]           = AscFormat.CGraphicFrame;

		if (window['AscCommonExcel'])
		{
			this.m_oFactoryClass[AscDFH.historyitem_type_Sparkline] = AscCommonExcel.sparklineGroup;
		}
	};
	CTableId.prototype.GetClassFromFactory = function(nType)
	{
		if (this.m_oFactoryClass[nType])
			return new this.m_oFactoryClass[nType]();

		return null;
	};
	CTableId.prototype.Refresh_RecalcData = function(Data)
	{
	};
	//-----------------------------------------------------------------------------------
	// Функции для работы с совместным редактирования
	//-----------------------------------------------------------------------------------
	CTableId.prototype.Unlock = function(Data)
	{
		// Ничего не делаем
	};

	window["AscCommon"].g_oTableId = new CTableId();
})(window);