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

(function (window, undefined)
{
	window['Asc'] = window['Asc'] || {};
// ---------------------------------------------------------------
	function CAscTableStyle()
	{
		this.Id = "";
		this.Type = 0;
		this.Image = "";
	}

	CAscTableStyle.prototype.get_Id = function ()
	{
		return this.Id;
	};
	CAscTableStyle.prototype.get_Image = function ()
	{
		return this.Image;
	};
	CAscTableStyle.prototype.get_Type = function ()
	{
		return this.Type;
	};
	window['Asc']['CAscTableStyle'] = window['Asc'].CAscTableStyle = CAscTableStyle;
	CAscTableStyle.prototype['get_Id'] = CAscTableStyle.prototype.get_Id;
	CAscTableStyle.prototype['get_Image'] = CAscTableStyle.prototype.get_Image;
	CAscTableStyle.prototype['get_Type'] = CAscTableStyle.prototype.get_Type;

// ---------------------------------------------------------------
// CBackground
// Value : тип заливки(прозрачная или нет),
// Color : { r : 0, g : 0, b : 0 }
	function CBackground(obj)
	{
		if (obj)
		{
			if (obj.Unifill && obj.Unifill.fill && obj.Unifill.fill.type === window['Asc'].c_oAscFill.FILL_TYPE_SOLID && obj.Unifill.fill.color)
			{
				this.Color = AscCommon.CreateAscColor(obj.Unifill.fill.color);
			}
			else
			{
				this.Color = (undefined != obj.Color && null != obj.Color) ? AscCommon.CreateAscColorCustom(obj.Color.r, obj.Color.g, obj.Color.b) : null;
			}
			this.Value = (undefined != obj.Value) ? obj.Value : null;
		}
		else
		{
			this.Color = AscCommon.CreateAscColorCustom(0, 0, 0);
			this.Value = 1;
		}
	}

	CBackground.prototype.get_Color = function ()
	{
		return this.Color;
	};
	CBackground.prototype.put_Color = function (v)
	{
		this.Color = (v) ? v : null;
	};
	CBackground.prototype.get_Value = function ()
	{
		return this.Value;
	};
	CBackground.prototype.put_Value = function (v)
	{
		this.Value = v;
	};

	window['Asc']['CBackground'] = window['Asc'].CBackground = CBackground;
	CBackground.prototype['get_Color'] = CBackground.prototype.get_Color;
	CBackground.prototype['put_Color'] = CBackground.prototype.put_Color;
	CBackground.prototype['get_Value'] = CBackground.prototype.get_Value;
	CBackground.prototype['put_Value'] = CBackground.prototype.put_Value;

// ---------------------------------------------------------------
	function CTablePositionH(obj)
	{
		if (obj)
		{
			this.RelativeFrom = ( undefined === obj.RelativeFrom ) ? Asc.c_oAscHAnchor.Margin : obj.RelativeFrom;
			this.UseAlign = ( undefined === obj.UseAlign     ) ? false : obj.UseAlign;
			this.Align = ( undefined === obj.Align        ) ? undefined : obj.Align;
			this.Value = ( undefined === obj.Value        ) ? 0 : obj.Value;
		}
		else
		{
			this.RelativeFrom = Asc.c_oAscHAnchor.Column;
			this.UseAlign = false;
			this.Align = undefined;
			this.Value = 0;
		}
	}

	CTablePositionH.prototype.get_RelativeFrom = function ()
	{
		return this.RelativeFrom;
	};
	CTablePositionH.prototype.put_RelativeFrom = function (v)
	{
		this.RelativeFrom = v;
	};
	CTablePositionH.prototype.get_UseAlign = function ()
	{
		return this.UseAlign;
	};
	CTablePositionH.prototype.put_UseAlign = function (v)
	{
		this.UseAlign = v;
	};
	CTablePositionH.prototype.get_Align = function ()
	{
		return this.Align;
	};
	CTablePositionH.prototype.put_Align = function (v)
	{
		this.Align = v;
	};
	CTablePositionH.prototype.get_Value = function ()
	{
		return this.Value;
	};
	CTablePositionH.prototype.put_Value = function (v)
	{
		this.Value = v;
	};

	function CTablePositionV(obj)
	{
		if (obj)
		{
			this.RelativeFrom = ( undefined === obj.RelativeFrom ) ? Asc.c_oAscVAnchor.Text : obj.RelativeFrom;
			this.UseAlign = ( undefined === obj.UseAlign     ) ? false : obj.UseAlign;
			this.Align = ( undefined === obj.Align        ) ? undefined : obj.Align;
			this.Value = ( undefined === obj.Value        ) ? 0 : obj.Value;
		}
		else
		{
			this.RelativeFrom = Asc.c_oAscVAnchor.Text;
			this.UseAlign = false;
			this.Align = undefined;
			this.Value = 0;
		}
	}

	CTablePositionV.prototype.get_RelativeFrom = function ()
	{
		return this.RelativeFrom;
	};
	CTablePositionV.prototype.put_RelativeFrom = function (v)
	{
		this.RelativeFrom = v;
	};
	CTablePositionV.prototype.get_UseAlign = function ()
	{
		return this.UseAlign;
	};
	CTablePositionV.prototype.put_UseAlign = function (v)
	{
		this.UseAlign = v;
	};
	CTablePositionV.prototype.get_Align = function ()
	{
		return this.Align;
	};
	CTablePositionV.prototype.put_Align = function (v)
	{
		this.Align = v;
	};
	CTablePositionV.prototype.get_Value = function ()
	{
		return this.Value;
	};
	CTablePositionV.prototype.put_Value = function (v)
	{
		this.Value = v;
	};

	window['Asc']['CTablePositionH'] = CTablePositionH;
	CTablePositionH.prototype['get_RelativeFrom'] = CTablePositionH.prototype.get_RelativeFrom;
	CTablePositionH.prototype['put_RelativeFrom'] = CTablePositionH.prototype.put_RelativeFrom;
	CTablePositionH.prototype['get_UseAlign'] = CTablePositionH.prototype.get_UseAlign;
	CTablePositionH.prototype['put_UseAlign'] = CTablePositionH.prototype.put_UseAlign;
	CTablePositionH.prototype['get_Align'] = CTablePositionH.prototype.get_Align;
	CTablePositionH.prototype['put_Align'] = CTablePositionH.prototype.put_Align;
	CTablePositionH.prototype['get_Value'] = CTablePositionH.prototype.get_Value;
	CTablePositionH.prototype['put_Value'] = CTablePositionH.prototype.put_Value;
	window['Asc']['CTablePositionV'] = CTablePositionV;
	CTablePositionV.prototype['get_RelativeFrom'] = CTablePositionV.prototype.get_RelativeFrom;
	CTablePositionV.prototype['put_RelativeFrom'] = CTablePositionV.prototype.put_RelativeFrom;
	CTablePositionV.prototype['get_UseAlign'] = CTablePositionV.prototype.get_UseAlign;
	CTablePositionV.prototype['put_UseAlign'] = CTablePositionV.prototype.put_UseAlign;
	CTablePositionV.prototype['get_Align'] = CTablePositionV.prototype.get_Align;
	CTablePositionV.prototype['put_Align'] = CTablePositionV.prototype.put_Align;
	CTablePositionV.prototype['get_Value'] = CTablePositionV.prototype.get_Value;
	CTablePositionV.prototype['put_Value'] = CTablePositionV.prototype.put_Value;

// ---------------------------------------------------------------
	function CTablePropLook(obj)
	{
		this.FirstCol = false;
		this.FirstRow = false;
		this.LastCol = false;
		this.LastRow = false;
		this.BandHor = false;
		this.BandVer = false;

		if (obj)
		{
			this.FirstCol = ( undefined === obj.m_bFirst_Col ? false : obj.m_bFirst_Col );
			this.FirstRow = ( undefined === obj.m_bFirst_Row ? false : obj.m_bFirst_Row );
			this.LastCol = ( undefined === obj.m_bLast_Col ? false : obj.m_bLast_Col );
			this.LastRow = ( undefined === obj.m_bLast_Row ? false : obj.m_bLast_Row );
			this.BandHor = ( undefined === obj.m_bBand_Hor ? false : obj.m_bBand_Hor );
			this.BandVer = ( undefined === obj.m_bBand_Ver ? false : obj.m_bBand_Ver );
		}
	}

	CTablePropLook.prototype.get_FirstCol = function ()
	{
		return this.FirstCol;
	};
	CTablePropLook.prototype.put_FirstCol = function (v)
	{
		this.FirstCol = v;
	};
	CTablePropLook.prototype.get_FirstRow = function ()
	{
		return this.FirstRow;
	};
	CTablePropLook.prototype.put_FirstRow = function (v)
	{
		this.FirstRow = v;
	};
	CTablePropLook.prototype.get_LastCol = function ()
	{
		return this.LastCol;
	};
	CTablePropLook.prototype.put_LastCol = function (v)
	{
		this.LastCol = v;
	};
	CTablePropLook.prototype.get_LastRow = function ()
	{
		return this.LastRow;
	};
	CTablePropLook.prototype.put_LastRow = function (v)
	{
		this.LastRow = v;
	};
	CTablePropLook.prototype.get_BandHor = function ()
	{
		return this.BandHor;
	};
	CTablePropLook.prototype.put_BandHor = function (v)
	{
		this.BandHor = v;
	};
	CTablePropLook.prototype.get_BandVer = function ()
	{
		return this.BandVer;
	};
	CTablePropLook.prototype.put_BandVer = function (v)
	{
		this.BandVer = v;
	};

	window['Asc']['CTablePropLook'] = window['Asc'].CTablePropLook = CTablePropLook;
	CTablePropLook.prototype['get_FirstCol'] = CTablePropLook.prototype.get_FirstCol;
	CTablePropLook.prototype['put_FirstCol'] = CTablePropLook.prototype.put_FirstCol;
	CTablePropLook.prototype['get_FirstRow'] = CTablePropLook.prototype.get_FirstRow;
	CTablePropLook.prototype['put_FirstRow'] = CTablePropLook.prototype.put_FirstRow;
	CTablePropLook.prototype['get_LastCol'] = CTablePropLook.prototype.get_LastCol;
	CTablePropLook.prototype['put_LastCol'] = CTablePropLook.prototype.put_LastCol;
	CTablePropLook.prototype['get_LastRow'] = CTablePropLook.prototype.get_LastRow;
	CTablePropLook.prototype['put_LastRow'] = CTablePropLook.prototype.put_LastRow;
	CTablePropLook.prototype['get_BandHor'] = CTablePropLook.prototype.get_BandHor;
	CTablePropLook.prototype['put_BandHor'] = CTablePropLook.prototype.put_BandHor;
	CTablePropLook.prototype['get_BandVer'] = CTablePropLook.prototype.get_BandVer;
	CTablePropLook.prototype['put_BandVer'] = CTablePropLook.prototype.put_BandVer;

	/*
	 {
	 TableWidth   : null - галочка убрана, либо заданное значение в мм
	 TableSpacing : null - галочка убрана, либо заданное значение в мм

	 TableDefaultMargins :  // маргины для всей таблицы(значение по умолчанию)
	 {
	 Left   : 1.9,
	 Right  : 1.9,
	 Top    : 0,
	 Bottom : 0
	 }

	 CellMargins :
	 {
	 Left   : 1.9, (null - неопределенное значение)
	 Right  : 1.9, (null - неопределенное значение)
	 Top    : 0,   (null - неопределенное значение)
	 Bottom : 0,   (null - неопределенное значение)
	 Flag   : 0 - У всех выделенных ячеек значение берется из TableDefaultMargins
	 1 - У выделенных ячеек есть ячейки с дефолтовыми значениями, и есть со своими собственными
	 2 - У всех ячеек свои собственные значения
	 }

	 TableAlignment : 0, 1, 2 (слева, по центру, справа)
	 TableIndent : значение в мм,
	 TableWrappingStyle : 0, 1 (inline, flow)
	 TablePaddings:
	 {
	 Left   : 3.2,
	 Right  : 3.2,
	 Top    : 0,
	 Bottom : 0
	 }

	 TableBorders : // границы таблицы
	 {
	 Bottom :
	 {
	 Color : { r : 0, g : 0, b : 0 },
	 Value : border_Single,
	 Size  : 0.5 * g_dKoef_pt_to_mm
	 Space :
	 },

	 Left :
	 {
	 Color : { r : 0, g : 0, b : 0 },
	 Value : border_Single,
	 Size  : 0.5 * g_dKoef_pt_to_mm
	 Space :
	 },

	 Right :
	 {
	 Color : { r : 0, g : 0, b : 0 },
	 Value : border_Single,
	 Size  : 0.5 * g_dKoef_pt_to_mm
	 Space :
	 },

	 Top :
	 {
	 Color : { r : 0, g : 0, b : 0 },
	 Value : border_Single,
	 Size  : 0.5 * g_dKoef_pt_to_mm
	 Space :
	 },

	 InsideH :
	 {
	 Color : { r : 0, g : 0, b : 0 },
	 Value : border_Single,
	 Size  : 0.5 * g_dKoef_pt_to_mm
	 Space :
	 },

	 InsideV :
	 {
	 Color : { r : 0, g : 0, b : 0 },
	 Value : border_Single,
	 Size  : 0.5 * g_dKoef_pt_to_mm
	 Space :
	 }
	 }

	 CellBorders : // границы выделенных ячеек
	 {
	 ForSelectedCells : true,

	 Bottom :
	 {
	 Color : { r : 0, g : 0, b : 0 },
	 Value : border_Single,
	 Size  : 0.5 * g_dKoef_pt_to_mm
	 Space :
	 },

	 Left :
	 {
	 Color : { r : 0, g : 0, b : 0 },
	 Value : border_Single,
	 Size  : 0.5 * g_dKoef_pt_to_mm
	 Space :
	 },

	 Right :
	 {
	 Color : { r : 0, g : 0, b : 0 },
	 Value : border_Single,
	 Size  : 0.5 * g_dKoef_pt_to_mm
	 Space :
	 },

	 Top :
	 {
	 Color : { r : 0, g : 0, b : 0 },
	 Value : border_Single,
	 Size  : 0.5 * g_dKoef_pt_to_mm
	 Space :
	 },

	 InsideH : // данного элемента может не быть, если у выделенных ячеек
	 // нет горизонтальных внутренних границ
	 {
	 Color : { r : 0, g : 0, b : 0 },
	 Value : border_Single,
	 Size  : 0.5 * g_dKoef_pt_to_mm
	 Space :
	 },

	 InsideV : // данного элемента может не быть, если у выделенных ячеек
	 // нет вертикальных внутренних границ
	 {
	 Color : { r : 0, g : 0, b : 0 },
	 Value : border_Single,
	 Size  : 0.5 * g_dKoef_pt_to_mm
	 Space :
	 }
	 }

	 TableBackground :
	 {
	 Value : тип заливки(прозрачная или нет),
	 Color : { r : 0, g : 0, b : 0 }
	 }
	 CellsBackground : null если заливка не определена для выделенных ячеек
	 {
	 Value : тип заливки(прозрачная или нет),
	 Color : { r : 0, g : 0, b : 0 }
	 }

	 Position:
	 {
	 X:0,
	 Y:0
	 }
	 }
	 */
	function CTableProp(tblProp)
	{
		if (tblProp)
		{
			this.CanBeFlow = (undefined != tblProp.CanBeFlow ? tblProp.CanBeFlow : false );
			this.CellSelect = (undefined != tblProp.CellSelect ? tblProp.CellSelect : false );
			this.CellSelect = (undefined != tblProp.CellSelect) ? tblProp.CellSelect : false;
			this.TableWidth = (undefined != tblProp.TableWidth) ? tblProp.TableWidth : null;
			this.TableSpacing = (undefined != tblProp.TableSpacing) ? tblProp.TableSpacing : null;
			this.TableDefaultMargins = (undefined != tblProp.TableDefaultMargins && null != tblProp.TableDefaultMargins) ? new Asc.asc_CPaddings(tblProp.TableDefaultMargins) : null;

			this.CellMargins = (undefined != tblProp.CellMargins && null != tblProp.CellMargins) ? new CMargins(tblProp.CellMargins) : null;

			this.TableAlignment = (undefined != tblProp.TableAlignment) ? tblProp.TableAlignment : null;
			this.TableIndent = (undefined != tblProp.TableIndent) ? tblProp.TableIndent : null;
			this.TableWrappingStyle = (undefined != tblProp.TableWrappingStyle) ? tblProp.TableWrappingStyle : null;

			this.TablePaddings = (undefined != tblProp.TablePaddings && null != tblProp.TablePaddings) ? new Asc.asc_CPaddings(tblProp.TablePaddings) : null;

			this.TableBorders = (undefined != tblProp.TableBorders && null != tblProp.TableBorders) ? new CBorders(tblProp.TableBorders) : null;
			this.CellBorders = (undefined != tblProp.CellBorders && null != tblProp.CellBorders) ? new CBorders(tblProp.CellBorders) : null;
			this.TableBackground = (undefined != tblProp.TableBackground && null != tblProp.TableBackground) ? new CBackground(tblProp.TableBackground) : null;
			this.CellsBackground = (undefined != tblProp.CellsBackground && null != tblProp.CellsBackground) ? new CBackground(tblProp.CellsBackground) : null;
			this.Position = (undefined != tblProp.Position && null != tblProp.Position) ? new Asc.CPosition(tblProp.Position) : null;
			this.PositionH = ( undefined != tblProp.PositionH && null != tblProp.PositionH ) ? new CTablePositionH(tblProp.PositionH) : undefined;
			this.PositionV = ( undefined != tblProp.PositionV && null != tblProp.PositionV ) ? new CTablePositionV(tblProp.PositionV) : undefined;
			this.Internal_Position = ( undefined != tblProp.Internal_Position ) ? tblProp.Internal_Position : undefined;

			this.ForSelectedCells = (undefined != tblProp.ForSelectedCells) ? tblProp.ForSelectedCells : true;
			this.TableStyle = (undefined != tblProp.TableStyle) ? tblProp.TableStyle : null;
			this.TableLook = (undefined != tblProp.TableLook) ? new CTablePropLook(tblProp.TableLook) : null;
			this.RowsInHeader = (undefined != tblProp.RowsInHeader) ? tblProp.RowsInHeader : 0;
			this.CellsVAlign = (undefined != tblProp.CellsVAlign) ? tblProp.CellsVAlign : c_oAscVertAlignJc.Top;
			this.AllowOverlap = (undefined != tblProp.AllowOverlap) ? tblProp.AllowOverlap : undefined;
			this.TableLayout = tblProp.TableLayout;
			this.CellsTextDirection = tblProp.CellsTextDirection;
			this.CellsNoWrap = tblProp.CellsNoWrap;
			this.CellsWidth = tblProp.CellsWidth;
			this.CellsWidthNotEqual = tblProp.CellsWidthNotEqual;
			this.Locked = (undefined != tblProp.Locked) ? tblProp.Locked : false;
			this.PercentFullWidth = tblProp.PercentFullWidth;
			this.TableDescription = tblProp.TableDescription;
			this.TableCaption = tblProp.TableCaption;
		}
		else
		{
			//Все свойства класса CTableProp должны быть undefined если они не изменялись
			//this.CanBeFlow = false;
			this.CellSelect = false; //обязательное свойство
			/*this.TableWidth = null;
			 this.TableSpacing = null;
			 this.TableDefaultMargins = new Asc.asc_CPaddings ();

			 this.CellMargins = new CMargins ();

			 this.TableAlignment = 0;
			 this.TableIndent = 0;
			 this.TableWrappingStyle = c_oAscWrapStyle.Inline;

			 this.TablePaddings = new Asc.asc_CPaddings ();

			 this.TableBorders = new CBorders ();
			 this.CellBorders = new CBorders ();
			 this.TableBackground = new CBackground ();
			 this.CellsBackground = new CBackground ();;
			 this.Position = new CPosition ();
			 this.ForSelectedCells = true;*/

			this.Locked = false;
		}
	}

	CTableProp.prototype.get_Width = function ()
	{
		return this.TableWidth;
	};
	CTableProp.prototype.put_Width = function (v)
	{
		this.TableWidth = v;
	};
	CTableProp.prototype.get_Spacing = function ()
	{
		return this.TableSpacing;
	};
	CTableProp.prototype.put_Spacing = function (v)
	{
		this.TableSpacing = v;
	};
	CTableProp.prototype.get_DefaultMargins = function ()
	{
		return this.TableDefaultMargins;
	};
	CTableProp.prototype.put_DefaultMargins = function (v)
	{
		this.TableDefaultMargins = v;
	};
	CTableProp.prototype.get_CellMargins = function ()
	{
		return this.CellMargins;
	};
	CTableProp.prototype.put_CellMargins = function (v)
	{
		this.CellMargins = v;
	};
	CTableProp.prototype.get_TableAlignment = function ()
	{
		return this.TableAlignment;
	};
	CTableProp.prototype.put_TableAlignment = function (v)
	{
		this.TableAlignment = v;
	};
	CTableProp.prototype.get_TableIndent = function ()
	{
		return this.TableIndent;
	};
	CTableProp.prototype.put_TableIndent = function (v)
	{
		this.TableIndent = v;
	};
	CTableProp.prototype.get_TableWrap = function ()
	{
		return this.TableWrappingStyle;
	};
	CTableProp.prototype.put_TableWrap = function (v)
	{
		this.TableWrappingStyle = v;
	};
	CTableProp.prototype.get_TablePaddings = function ()
	{
		return this.TablePaddings;
	};
	CTableProp.prototype.put_TablePaddings = function (v)
	{
		this.TablePaddings = v;
	};
	CTableProp.prototype.get_TableBorders = function ()
	{
		return this.TableBorders;
	};
	CTableProp.prototype.put_TableBorders = function (v)
	{
		this.TableBorders = v;
	};
	CTableProp.prototype.get_CellBorders = function ()
	{
		return this.CellBorders;
	};
	CTableProp.prototype.put_CellBorders = function (v)
	{
		this.CellBorders = v;
	};
	CTableProp.prototype.get_TableBackground = function ()
	{
		return this.TableBackground;
	};
	CTableProp.prototype.put_TableBackground = function (v)
	{
		this.TableBackground = v;
	};
	CTableProp.prototype.get_CellsBackground = function ()
	{
		return this.CellsBackground;
	};
	CTableProp.prototype.put_CellsBackground = function (v)
	{
		this.CellsBackground = v;
	};
	CTableProp.prototype.get_Position = function ()
	{
		return this.Position;
	};
	CTableProp.prototype.put_Position = function (v)
	{
		this.Position = v;
	};
	CTableProp.prototype.get_PositionH = function ()
	{
		return this.PositionH;
	};
	CTableProp.prototype.put_PositionH = function (v)
	{
		this.PositionH = v;
	};
	CTableProp.prototype.get_PositionV = function ()
	{
		return this.PositionV;
	};
	CTableProp.prototype.put_PositionV = function (v)
	{
		this.PositionV = v;
	};
	CTableProp.prototype.get_Value_X = function (RelativeFrom)
	{
		if (undefined != this.Internal_Position) return this.Internal_Position.Calculate_X_Value(RelativeFrom);
		return 0;
	};
	CTableProp.prototype.get_Value_Y = function (RelativeFrom)
	{
		if (undefined != this.Internal_Position) return this.Internal_Position.Calculate_Y_Value(RelativeFrom);
		return 0;
	};
	CTableProp.prototype.get_ForSelectedCells = function ()
	{
		return this.ForSelectedCells;
	};
	CTableProp.prototype.put_ForSelectedCells = function (v)
	{
		this.ForSelectedCells = v;
	};
	CTableProp.prototype.put_CellSelect = function (v)
	{
		this.CellSelect = v;
	};
	CTableProp.prototype.get_CellSelect = function ()
	{
		return this.CellSelect
	};
	CTableProp.prototype.get_CanBeFlow = function ()
	{
		return this.CanBeFlow;
	};
	CTableProp.prototype.get_RowsInHeader = function ()
	{
		return this.RowsInHeader;
	};
	CTableProp.prototype.put_RowsInHeader = function (v)
	{
		this.RowsInHeader = v;
	};
	CTableProp.prototype.get_Locked = function ()
	{
		return this.Locked;
	};
	CTableProp.prototype.get_CellsVAlign = function ()
	{
		return this.CellsVAlign;
	};
	CTableProp.prototype.put_CellsVAlign = function (v)
	{
		this.CellsVAlign = v;
	};
	CTableProp.prototype.get_TableLook = function ()
	{
		return this.TableLook;
	};
	CTableProp.prototype.put_TableLook = function (v)
	{
		this.TableLook = v;
	};
	CTableProp.prototype.get_TableStyle = function ()
	{
		return this.TableStyle;
	};
	CTableProp.prototype.put_TableStyle = function (v)
	{
		this.TableStyle = v;
	};
	CTableProp.prototype.get_AllowOverlap = function ()
	{
		return this.AllowOverlap;
	};
	CTableProp.prototype.put_AllowOverlap = function (v)
	{
		this.AllowOverlap = v;
	};
	CTableProp.prototype.get_TableLayout = function ()
	{
		return this.TableLayout;
	};
	CTableProp.prototype.put_TableLayout = function (v)
	{
		this.TableLayout = v;
	};
	CTableProp.prototype.get_CellsTextDirection = function ()
	{
		return this.CellsTextDirection;
	};
	CTableProp.prototype.put_CellsTextDirection = function (v)
	{
		this.CellsTextDirection = v;
	};
	CTableProp.prototype.get_CellsNoWrap = function ()
	{
		return this.CellsNoWrap;
	};
	CTableProp.prototype.put_CellsNoWrap = function (v)
	{
		this.CellsNoWrap = v;
	};
	CTableProp.prototype.get_CellsWidth = function ()
	{
		return this.CellsWidth;
	};
	CTableProp.prototype.put_CellsWidth = function (v)
	{
		this.CellsWidth = v;
	};
	CTableProp.prototype.get_PercentFullWidth = function ()
	{
		return this.PercentFullWidth;
	};
	CTableProp.prototype.get_CellsWidthNotEqual = function ()
	{
		return this.CellsWidthNotEqual;
	};
	CTableProp.prototype.get_TableDescription = function ()
	{
		return this.TableDescription;
	};
	CTableProp.prototype.put_TableDescription = function (v)
	{
		this.TableDescription = v;
	};
	CTableProp.prototype.get_TableCaption = function ()
	{
		return this.TableCaption;
	};
	CTableProp.prototype.put_TableCaption = function (v)
	{
		this.TableCaption = v;
	};

	window['Asc']['CTableProp'] = window['Asc'].CTableProp = CTableProp;
	CTableProp.prototype['get_Width'] = CTableProp.prototype.get_Width;
	CTableProp.prototype['put_Width'] = CTableProp.prototype.put_Width;
	CTableProp.prototype['get_Spacing'] = CTableProp.prototype.get_Spacing;
	CTableProp.prototype['put_Spacing'] = CTableProp.prototype.put_Spacing;
	CTableProp.prototype['get_DefaultMargins'] = CTableProp.prototype.get_DefaultMargins;
	CTableProp.prototype['put_DefaultMargins'] = CTableProp.prototype.put_DefaultMargins;
	CTableProp.prototype['get_CellMargins'] = CTableProp.prototype.get_CellMargins;
	CTableProp.prototype['put_CellMargins'] = CTableProp.prototype.put_CellMargins;
	CTableProp.prototype['get_TableAlignment'] = CTableProp.prototype.get_TableAlignment;
	CTableProp.prototype['put_TableAlignment'] = CTableProp.prototype.put_TableAlignment;
	CTableProp.prototype['get_TableIndent'] = CTableProp.prototype.get_TableIndent;
	CTableProp.prototype['put_TableIndent'] = CTableProp.prototype.put_TableIndent;
	CTableProp.prototype['get_TableWrap'] = CTableProp.prototype.get_TableWrap;
	CTableProp.prototype['put_TableWrap'] = CTableProp.prototype.put_TableWrap;
	CTableProp.prototype['get_TablePaddings'] = CTableProp.prototype.get_TablePaddings;
	CTableProp.prototype['put_TablePaddings'] = CTableProp.prototype.put_TablePaddings;
	CTableProp.prototype['get_TableBorders'] = CTableProp.prototype.get_TableBorders;
	CTableProp.prototype['put_TableBorders'] = CTableProp.prototype.put_TableBorders;
	CTableProp.prototype['get_CellBorders'] = CTableProp.prototype.get_CellBorders;
	CTableProp.prototype['put_CellBorders'] = CTableProp.prototype.put_CellBorders;
	CTableProp.prototype['get_TableBackground'] = CTableProp.prototype.get_TableBackground;
	CTableProp.prototype['put_TableBackground'] = CTableProp.prototype.put_TableBackground;
	CTableProp.prototype['get_CellsBackground'] = CTableProp.prototype.get_CellsBackground;
	CTableProp.prototype['put_CellsBackground'] = CTableProp.prototype.put_CellsBackground;
	CTableProp.prototype['get_Position'] = CTableProp.prototype.get_Position;
	CTableProp.prototype['put_Position'] = CTableProp.prototype.put_Position;
	CTableProp.prototype['get_PositionH'] = CTableProp.prototype.get_PositionH;
	CTableProp.prototype['put_PositionH'] = CTableProp.prototype.put_PositionH;
	CTableProp.prototype['get_PositionV'] = CTableProp.prototype.get_PositionV;
	CTableProp.prototype['put_PositionV'] = CTableProp.prototype.put_PositionV;
	CTableProp.prototype['get_Value_X'] = CTableProp.prototype.get_Value_X;
	CTableProp.prototype['get_Value_Y'] = CTableProp.prototype.get_Value_Y;
	CTableProp.prototype['get_ForSelectedCells'] = CTableProp.prototype.get_ForSelectedCells;
	CTableProp.prototype['put_ForSelectedCells'] = CTableProp.prototype.put_ForSelectedCells;
	CTableProp.prototype['put_CellSelect'] = CTableProp.prototype.put_CellSelect;
	CTableProp.prototype['get_CellSelect'] = CTableProp.prototype.get_CellSelect;
	CTableProp.prototype['get_CanBeFlow'] = CTableProp.prototype.get_CanBeFlow;
	CTableProp.prototype['get_RowsInHeader'] = CTableProp.prototype.get_RowsInHeader;
	CTableProp.prototype['put_RowsInHeader'] = CTableProp.prototype.put_RowsInHeader;
	CTableProp.prototype['get_Locked'] = CTableProp.prototype.get_Locked;
	CTableProp.prototype['get_CellsVAlign'] = CTableProp.prototype.get_CellsVAlign;
	CTableProp.prototype['put_CellsVAlign'] = CTableProp.prototype.put_CellsVAlign;
	CTableProp.prototype['get_TableLook'] = CTableProp.prototype.get_TableLook;
	CTableProp.prototype['put_TableLook'] = CTableProp.prototype.put_TableLook;
	CTableProp.prototype['get_TableStyle'] = CTableProp.prototype.get_TableStyle;
	CTableProp.prototype['put_TableStyle'] = CTableProp.prototype.put_TableStyle;
	CTableProp.prototype['get_AllowOverlap'] = CTableProp.prototype.get_AllowOverlap;
	CTableProp.prototype['put_AllowOverlap'] = CTableProp.prototype.put_AllowOverlap;
	CTableProp.prototype['get_TableLayout'] = CTableProp.prototype.get_TableLayout;
	CTableProp.prototype['put_TableLayout'] = CTableProp.prototype.put_TableLayout;
	CTableProp.prototype['get_CellsTextDirection'] = CTableProp.prototype.get_CellsTextDirection;
	CTableProp.prototype['put_CellsTextDirection'] = CTableProp.prototype.put_CellsTextDirection;
	CTableProp.prototype['get_CellsNoWrap'] = CTableProp.prototype.get_CellsNoWrap;
	CTableProp.prototype['put_CellsNoWrap'] = CTableProp.prototype.put_CellsNoWrap;
	CTableProp.prototype['get_CellsWidth'] = CTableProp.prototype.get_CellsWidth;
	CTableProp.prototype['put_CellsWidth'] = CTableProp.prototype.put_CellsWidth;
	CTableProp.prototype['get_PercentFullWidth'] = CTableProp.prototype.get_PercentFullWidth;
	CTableProp.prototype['get_CellsWidthNotEqual'] = CTableProp.prototype.get_CellsWidthNotEqual;
	CTableProp.prototype['get_TableDescription'] = CTableProp.prototype.get_TableDescription;
	CTableProp.prototype['put_TableDescription'] = CTableProp.prototype.put_TableDescription;
	CTableProp.prototype['get_TableCaption'] = CTableProp.prototype.get_TableCaption;
	CTableProp.prototype['put_TableCaption'] = CTableProp.prototype.put_TableCaption;

// ---------------------------------------------------------------
	function CBorders(obj)
	{
		if (obj)
		{
			this.Left = (undefined != obj.Left && null != obj.Left) ? new Asc.asc_CTextBorder(obj.Left) : null;
			this.Top = (undefined != obj.Top && null != obj.Top) ? new Asc.asc_CTextBorder(obj.Top) : null;
			this.Right = (undefined != obj.Right && null != obj.Right) ? new Asc.asc_CTextBorder(obj.Right) : null;
			this.Bottom = (undefined != obj.Bottom && null != obj.Bottom) ? new Asc.asc_CTextBorder(obj.Bottom) : null;
			this.InsideH = (undefined != obj.InsideH && null != obj.InsideH) ? new Asc.asc_CTextBorder(obj.InsideH) : null;
			this.InsideV = (undefined != obj.InsideV && null != obj.InsideV) ? new Asc.asc_CTextBorder(obj.InsideV) : null;
		}
		//Все свойства класса CBorders должны быть undefined если они не изменялись
		/*else
		 {
		 this.Left = null;
		 this.Top = null;
		 this.Right = null;
		 this.Bottom = null;
		 this.InsideH = null;
		 this.InsideV = null;
		 }*/
	}

	CBorders.prototype.get_Left = function ()
	{
		return this.Left;
	};
	CBorders.prototype.put_Left = function (v)
	{
		this.Left = (v) ? new Asc.asc_CTextBorder(v) : null;
	};
	CBorders.prototype.get_Top = function ()
	{
		return this.Top;
	};
	CBorders.prototype.put_Top = function (v)
	{
		this.Top = (v) ? new Asc.asc_CTextBorder(v) : null;
	};
	CBorders.prototype.get_Right = function ()
	{
		return this.Right;
	};
	CBorders.prototype.put_Right = function (v)
	{
		this.Right = (v) ? new Asc.asc_CTextBorder(v) : null;
	};
	CBorders.prototype.get_Bottom = function ()
	{
		return this.Bottom;
	};
	CBorders.prototype.put_Bottom = function (v)
	{
		this.Bottom = (v) ? new Asc.asc_CTextBorder(v) : null;
	};
	CBorders.prototype.get_InsideH = function ()
	{
		return this.InsideH;
	};
	CBorders.prototype.put_InsideH = function (v)
	{
		this.InsideH = (v) ? new Asc.asc_CTextBorder(v) : null;
	};
	CBorders.prototype.get_InsideV = function ()
	{
		return this.InsideV;
	};
	CBorders.prototype.put_InsideV = function (v)
	{
		this.InsideV = (v) ? new Asc.asc_CTextBorder(v) : null;
	};

	function CMargins(obj)
	{
		if (obj)
		{
			this.Left = (undefined != obj.Left) ? obj.Left : null;
			this.Right = (undefined != obj.Right) ? obj.Right : null;
			this.Top = (undefined != obj.Top) ? obj.Top : null;
			this.Bottom = (undefined != obj.Bottom) ? obj.Bottom : null;
			this.Flag = (undefined != obj.Flag) ? obj.Flag : null;
		}
		else
		{
			this.Left = null;
			this.Right = null;
			this.Top = null;
			this.Bottom = null;
			this.Flag = null;
		}
	}

	CMargins.prototype.get_Left = function ()
	{
		return this.Left;
	};
	CMargins.prototype.put_Left = function (v)
	{
		this.Left = v;
	};
	CMargins.prototype.get_Right = function ()
	{
		return this.Right;
	};
	CMargins.prototype.put_Right = function (v)
	{
		this.Right = v;
	};
	CMargins.prototype.get_Top = function ()
	{
		return this.Top;
	};
	CMargins.prototype.put_Top = function (v)
	{
		this.Top = v;
	};
	CMargins.prototype.get_Bottom = function ()
	{
		return this.Bottom;
	};
	CMargins.prototype.put_Bottom = function (v)
	{
		this.Bottom = v;
	};
	CMargins.prototype.get_Flag = function ()
	{
		return this.Flag;
	};
	CMargins.prototype.put_Flag = function (v)
	{
		this.Flag = v;
	};

	window['Asc']['CBorders'] = window['Asc'].CBorders = CBorders;
	CBorders.prototype['get_Left'] = CBorders.prototype.get_Left;
	CBorders.prototype['put_Left'] = CBorders.prototype.put_Left;
	CBorders.prototype['get_Top'] = CBorders.prototype.get_Top;
	CBorders.prototype['put_Top'] = CBorders.prototype.put_Top;
	CBorders.prototype['get_Right'] = CBorders.prototype.get_Right;
	CBorders.prototype['put_Right'] = CBorders.prototype.put_Right;
	CBorders.prototype['get_Bottom'] = CBorders.prototype.get_Bottom;
	CBorders.prototype['put_Bottom'] = CBorders.prototype.put_Bottom;
	CBorders.prototype['get_InsideH'] = CBorders.prototype.get_InsideH;
	CBorders.prototype['put_InsideH'] = CBorders.prototype.put_InsideH;
	CBorders.prototype['get_InsideV'] = CBorders.prototype.get_InsideV;
	CBorders.prototype['put_InsideV'] = CBorders.prototype.put_InsideV;
	window['Asc']['CMargins'] = window['Asc'].CMargins = CMargins;
	CMargins.prototype['get_Left'] = CMargins.prototype.get_Left;
	CMargins.prototype['put_Left'] = CMargins.prototype.put_Left;
	CMargins.prototype['get_Right'] = CMargins.prototype.get_Right;
	CMargins.prototype['put_Right'] = CMargins.prototype.put_Right;
	CMargins.prototype['get_Top'] = CMargins.prototype.get_Top;
	CMargins.prototype['put_Top'] = CMargins.prototype.put_Top;
	CMargins.prototype['get_Bottom'] = CMargins.prototype.get_Bottom;
	CMargins.prototype['put_Bottom'] = CMargins.prototype.put_Bottom;
	CMargins.prototype['get_Flag'] = CMargins.prototype.get_Flag;
	CMargins.prototype['put_Flag'] = CMargins.prototype.put_Flag;

// ---------------------------------------------------------------
	function CParagraphPropEx(obj)
	{
		if (obj)
		{
			this.ContextualSpacing = (undefined != obj.ContextualSpacing) ? obj.ContextualSpacing : null;
			this.Ind = (undefined != obj.Ind && null != obj.Ind) ? new Asc.asc_CParagraphInd(obj.Ind) : null;
			this.Jc = (undefined != obj.Jc) ? obj.Jc : null;
			this.KeepLines = (undefined != obj.KeepLines) ? obj.KeepLines : null;
			this.KeepNext = (undefined != obj.KeepNext) ? obj.KeepNext : null;
			this.PageBreakBefore = (undefined != obj.PageBreakBefore) ? obj.PageBreakBefore : null;
			this.Spacing = (undefined != obj.Spacing && null != obj.Spacing) ? new AscCommon.asc_CParagraphSpacing(obj.Spacing) : null;
			this.Shd = (undefined != obj.Shd && null != obj.Shd) ? new Asc.asc_CParagraphShd(obj.Shd) : null;
			this.WidowControl = (undefined != obj.WidowControl) ? obj.WidowControl : null;                  // Запрет висячих строк
			this.Tabs = obj.Tabs;
		}
		else
		{
			//ContextualSpacing : false,            // Удалять ли интервал между параграфами одинакового стиля
			//
			//    Ind :
			//    {
			//        Left      : 0,                    // Левый отступ
			//        Right     : 0,                    // Правый отступ
			//        FirstLine : 0                     // Первая строка
			//    },
			//
			//    Jc : align_Left,                      // Прилегание параграфа
			//
			//    KeepLines : false,                    // переносить параграф на новую страницу,
			//                                          // если на текущей он целиком не убирается
			//    KeepNext  : false,                    // переносить параграф вместе со следующим параграфом
			//
			//    PageBreakBefore : false,              // начинать параграф с новой страницы
			//    Spacing :
			//    {
			//        Line     : 1.15,                  // Расстояние между строками внутри абзаца
			//        LineRule : linerule_Auto,         // Тип расстрояния между строками
			//        Before   : 0,                     // Дополнительное расстояние до абзаца
			//        After    : 10 * g_dKoef_pt_to_mm  // Дополнительное расстояние после абзаца
			//    },
			//
			//    Shd :
			//    {
			//        Value : shd_Nil,
			//        Color :
			//        {
			//            r : 255,
			//            g : 255,
			//            b : 255
			//        }
			//    },
			//
			//    WidowControl : true,                  // Запрет висячих строк
			//
			//    Tabs : []
			this.ContextualSpacing = false;
			this.Ind = new Asc.asc_CParagraphInd();
			this.Jc = AscCommon.align_Left;
			this.KeepLines = false;
			this.KeepNext = false;
			this.PageBreakBefore = false;
			this.Spacing = new AscCommon.asc_CParagraphSpacing();
			this.Shd = new Asc.asc_CParagraphShd();
			this.WidowControl = true;                  // Запрет висячих строк
			this.Tabs = null;
		}
	}

	CParagraphPropEx.prototype.get_ContextualSpacing = function ()
	{
		return this.ContextualSpacing;
	};
	CParagraphPropEx.prototype.get_Ind = function ()
	{
		return this.Ind;
	};
	CParagraphPropEx.prototype.get_Jc = function ()
	{
		return this.Jc;
	};
	CParagraphPropEx.prototype.get_KeepLines = function ()
	{
		return this.KeepLines;
	};
	CParagraphPropEx.prototype.get_KeepNext = function ()
	{
		return this.KeepNext;
	};
	CParagraphPropEx.prototype.get_PageBreakBefore = function ()
	{
		return this.PageBreakBefore;
	};
	CParagraphPropEx.prototype.get_Spacing = function ()
	{
		return this.Spacing;
	};
	CParagraphPropEx.prototype.get_Shd = function ()
	{
		return this.Shd;
	};
	CParagraphPropEx.prototype.get_WidowControl = function ()
	{
		return this.WidowControl;
	};
	CParagraphPropEx.prototype.get_Tabs = function ()
	{
		return this.Tabs;
	};

	function CTextProp(obj)
	{
		if (obj)
		{
			this.Bold = (undefined != obj.Bold) ? obj.Bold : null;
			this.Italic = (undefined != obj.Italic) ? obj.Italic : null;
			this.Underline = (undefined != obj.Underline) ? obj.Underline : null;
			this.Strikeout = (undefined != obj.Strikeout) ? obj.Strikeout : null;
			this.FontFamily = (undefined != obj.FontFamily && null != obj.FontFamily) ? new AscCommon.asc_CTextFontFamily(obj.FontFamily) : null;
			this.FontSize = (undefined != obj.FontSize) ? obj.FontSize : null;
			this.Color = (undefined != obj.Color && null != obj.Color) ? AscCommon.CreateAscColorCustom(obj.Color.r, obj.Color.g, obj.Color.b) : null;
			this.VertAlign = (undefined != obj.VertAlign) ? obj.VertAlign : null;
			this.HighLight = (undefined != obj.HighLight) ? obj.HighLight == AscCommonWord.highlight_None ? obj.HighLight : new AscCommon.CColor(obj.HighLight.r, obj.HighLight.g, obj.HighLight.b) : null;
			this.DStrikeout = (undefined != obj.DStrikeout) ? obj.DStrikeout : null;
			this.Spacing = (undefined != obj.Spacing) ? obj.Spacing : null;
			this.Caps = (undefined != obj.Caps) ? obj.Caps : null;
			this.SmallCaps = (undefined != obj.SmallCaps) ? obj.SmallCaps : null;
		}
		else
		{
			//    Bold       : false,
			//    Italic     : false,
			//    Underline  : false,
			//    Strikeout  : false,
			//    FontFamily :
			//    {
			//        Name  : "Times New Roman",
			//        Index : -1
			//    },
			//    FontSize   : 12,
			//    Color      :
			//    {
			//        r : 0,
			//        g : 0,
			//        b : 0
			//    },
			//    VertAlign : vertalign_Baseline,
			//    HighLight : highlight_None
			this.Bold = false;
			this.Italic = false;
			this.Underline = false;
			this.Strikeout = false;
			this.FontFamily = new asc_CTextFontFamily();
			this.FontSize = 12;
			this.Color = AscCommon.CreateAscColorCustom(0, 0, 0);
			this.VertAlign = AscCommon.vertalign_Baseline;
			this.HighLight = AscCommonWord.highlight_None;
			this.DStrikeout = false;
			this.Spacing = 0;
			this.Caps = false;
			this.SmallCaps = false;
		}
	}

	CTextProp.prototype.get_Bold = function ()
	{
		return this.Bold;
	};
	CTextProp.prototype.get_Italic = function ()
	{
		return this.Italic;
	};
	CTextProp.prototype.get_Underline = function ()
	{
		return this.Underline;
	};
	CTextProp.prototype.get_Strikeout = function ()
	{
		return this.Strikeout;
	};
	CTextProp.prototype.get_FontFamily = function ()
	{
		return this.FontFamily;
	};
	CTextProp.prototype.get_FontSize = function ()
	{
		return this.FontSize;
	};
	CTextProp.prototype.get_Color = function ()
	{
		return this.Color;
	};
	CTextProp.prototype.get_VertAlign = function ()
	{
		return this.VertAlign;
	};
	CTextProp.prototype.get_HighLight = function ()
	{
		return this.HighLight;
	};
	CTextProp.prototype.get_Spacing = function ()
	{
		return this.Spacing;
	};
	CTextProp.prototype.get_DStrikeout = function ()
	{
		return this.DStrikeout;
	};
	CTextProp.prototype.get_Caps = function ()
	{
		return this.Caps;
	};
	CTextProp.prototype.get_SmallCaps = function ()
	{
		return this.SmallCaps;
	};

	CParagraphPropEx.prototype['get_ContextualSpacing'] = CParagraphPropEx.prototype.get_ContextualSpacing;
	CParagraphPropEx.prototype['get_Ind'] = CParagraphPropEx.prototype.get_Ind;
	CParagraphPropEx.prototype['get_Jc'] = CParagraphPropEx.prototype.get_Jc;
	CParagraphPropEx.prototype['get_KeepLines'] = CParagraphPropEx.prototype.get_KeepLines;
	CParagraphPropEx.prototype['get_KeepNext'] = CParagraphPropEx.prototype.get_KeepNext;
	CParagraphPropEx.prototype['get_PageBreakBefore'] = CParagraphPropEx.prototype.get_PageBreakBefore;
	CParagraphPropEx.prototype['get_Spacing'] = CParagraphPropEx.prototype.get_Spacing;
	CParagraphPropEx.prototype['get_Shd'] = CParagraphPropEx.prototype.get_Shd;
	CParagraphPropEx.prototype['get_WidowControl'] = CParagraphPropEx.prototype.get_WidowControl;
	CParagraphPropEx.prototype['get_Tabs'] = CParagraphPropEx.prototype.get_Tabs;
	CTextProp.prototype['get_Bold'] = CTextProp.prototype.get_Bold;
	CTextProp.prototype['get_Italic'] = CTextProp.prototype.get_Italic;
	CTextProp.prototype['get_Underline'] = CTextProp.prototype.get_Underline;
	CTextProp.prototype['get_Strikeout'] = CTextProp.prototype.get_Strikeout;
	CTextProp.prototype['get_FontFamily'] = CTextProp.prototype.get_FontFamily;
	CTextProp.prototype['get_FontSize'] = CTextProp.prototype.get_FontSize;
	CTextProp.prototype['get_Color'] = CTextProp.prototype.get_Color;
	CTextProp.prototype['get_VertAlign'] = CTextProp.prototype.get_VertAlign;
	CTextProp.prototype['get_HighLight'] = CTextProp.prototype.get_HighLight;
	CTextProp.prototype['get_Spacing'] = CTextProp.prototype.get_Spacing;
	CTextProp.prototype['get_DStrikeout'] = CTextProp.prototype.get_DStrikeout;
	CTextProp.prototype['get_Caps'] = CTextProp.prototype.get_Caps;
	CTextProp.prototype['get_SmallCaps'] = CTextProp.prototype.get_SmallCaps;

// paragraph and text properties objects container
	function CParagraphAndTextProp(paragraphProp, textProp)
	{
		this.ParaPr = (undefined != paragraphProp && null != paragraphProp) ? new CParagraphPropEx(paragraphProp) : null;
		this.TextPr = (undefined != textProp && null != textProp) ? new CTextProp(textProp) : null;
	}

	CParagraphAndTextProp.prototype.get_ParaPr = function ()
	{
		return this.ParaPr;
	};
	CParagraphAndTextProp.prototype.get_TextPr = function ()
	{
		return this.TextPr;
	};

	window['Asc']['CParagraphAndTextProp'] = window['Asc'].CParagraphAndTextProp = CParagraphAndTextProp;
	CParagraphAndTextProp.prototype['get_ParaPr'] = CParagraphAndTextProp.prototype.get_ParaPr;
	CParagraphAndTextProp.prototype['get_TextPr'] = CParagraphAndTextProp.prototype.get_TextPr;
// ---------------------------------------------------------------

	function GenerateTableStyles(drawingDoc, logicDoc, tableLook)
	{
		var _dst_styles = [];

		var _styles = logicDoc.Styles.Get_AllTableStyles();
		var _styles_len = _styles.length;

		if (_styles_len == 0)
			return _dst_styles;

		var _x_mar = 10;
		var _y_mar = 10;
		var _r_mar = 10;
		var _b_mar = 10;
		var _pageW = 297;
		var _pageH = 210;

		var W = (_pageW - _x_mar - _r_mar);
		var H = (_pageH - _y_mar - _b_mar);
		var Grid = [];

		var Rows = 5;
		var Cols = 5;

		for (var i = 0; i < Cols; i++)
			Grid[i] = W / Cols;

		var _canvas = document.createElement('canvas');
		if (!this.m_oWordControl.bIsRetinaSupport)
		{
			_canvas.width = TABLE_STYLE_WIDTH_PIX;
			_canvas.height = TABLE_STYLE_HEIGHT_PIX;
		}
		else
		{
			_canvas.width = (TABLE_STYLE_WIDTH_PIX << 1);
			_canvas.height = (TABLE_STYLE_HEIGHT_PIX << 1);
		}
		var ctx = _canvas.getContext('2d');

		AscCommon.History.TurnOff();
		for (var i1 = 0; i1 < _styles_len; i1++)
		{
			var i = _styles[i1];
			var _style = logicDoc.Styles.Style[i];

			if (!_style || _style.Type != styletype_Table)
				continue;

			var table = new CTable(drawingDoc, logicDoc, true, 0, _x_mar, _y_mar, 1000, 1000, Rows, Cols, Grid);
			table.Set_Props({TableStyle: i});

			for (var j = 0; j < Rows; j++)
				table.Content[j].Set_Height(H / Rows, Asc.linerule_AtLeast);

			ctx.fillStyle = "#FFFFFF";
			ctx.fillRect(0, 0, _canvas.width, _canvas.height);

			var graphics = new AscCommon.CGraphics();
			graphics.init(ctx, _canvas.width, _canvas.height, _pageW, _pageH);
			graphics.m_oFontManager = AscCommon.g_fontManager;
			graphics.transform(1, 0, 0, 1, 0, 0);

			table.Recalculate_Page(0);
			table.Draw(0, graphics);

			var _styleD = new CAscTableStyle();
			_styleD.Type = 0;
			_styleD.Image = _canvas.toDataURL("image/png");
			_styleD.Id = i;
			_dst_styles.push(_styleD);
		}
		AscCommon.History.TurnOn();

		return _dst_styles;
	}

	/*
	 структура заголовков, предварительно, выглядит так
	 {
	 headerText: "Header1",//заголовок
	 pageNumber: 0, //содержит номер страницы, где находится искомая последовательность
	 X: 0,//координаты по OX начала последовательности на данной страницы
	 Y: 0,//координаты по OY начала последовательности на данной страницы
	 level: 0//уровень заголовка
	 }
	 заголовки приходят либо в списке, либо последовательно.
	 */

	function CHeader(obj)
	{
		if (obj)
		{
			this.headerText = (undefined != obj.headerText) ? obj.headerText : null;	//заголовок
			this.pageNumber = (undefined != obj.pageNumber) ? obj.pageNumber : null;	//содержит номер страницы, где находится искомая последовательность
			this.X = (undefined != obj.X) ? obj.X : null;						//координаты по OX начала последовательности на данной страницы
			this.Y = (undefined != obj.Y) ? obj.Y : null;						//координаты по OY начала последовательности на данной страницы
			this.level = (undefined != obj.level) ? obj.level : null;				//позиция заголовка
		}
		else
		{
			this.headerText = null;				//заголовок
			this.pageNumber = null;				//содержит номер страницы, где находится искомая последовательность
			this.X = null;				//координаты по OX начала последовательности на данной страницы
			this.Y = null;				//координаты по OY начала последовательности на данной страницы
			this.level = null;				//позиция заголовка
		}
	}

	CHeader.prototype.get_headerText = function ()
	{
		return this.headerText;
	};
	CHeader.prototype.get_pageNumber = function ()
	{
		return this.pageNumber;
	};
	CHeader.prototype.get_X = function ()
	{
		return this.X;
	};
	CHeader.prototype.get_Y = function ()
	{
		return this.Y;
	};
	CHeader.prototype.get_Level = function ()
	{
		return this.level;
	};

	window['Asc']['CHeader'] = window['Asc'].CHeader = CHeader;
	CHeader.prototype['get_headerText'] = CHeader.prototype.get_headerText;
	CHeader.prototype['get_pageNumber'] = CHeader.prototype.get_pageNumber;
	CHeader.prototype['get_X'] = CHeader.prototype.get_X;
	CHeader.prototype['get_Y'] = CHeader.prototype.get_Y;
	CHeader.prototype['get_Level'] = CHeader.prototype.get_Level;
})(window, undefined);