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

// Import
var align_Left = AscCommon.align_Left;
var g_oTableId = AscCommon.g_oTableId;
var History = AscCommon.History;

var linerule_Auto = Asc.linerule_Auto;
var c_oAscShdClear = Asc.c_oAscShdClear;
var c_oAscShdNil = Asc.c_oAscShdNil;
var c_oAscDropCap = Asc.c_oAscDropCap;

var EvenAndOddHeaders = false;

var Default_Tab_Stop = 12.5;

var Default_Heading_Font = "Arial";
var Default_Font         = "Arial";

var highlight_None = -1;

var vertalign_Koef_Size  =  0.65;  // Коэффициент изменения размера текста для верхнего и нижнего индексов
var vertalign_Koef_Super =  0.35;  // Позиция верхнего индекса (относительно размера текста)
var vertalign_Koef_Sub   = -0.141; // Позиция нижнего индекса (относительно размера текста)

var smallcaps_Koef = 0.8; // Коэффициент изменения размера шрифта для малых прописных букв

var smallcaps_and_script_koef = vertalign_Koef_Size * smallcaps_Koef; // суммарный коэффициент, когда текст одновременно и в индексе, и написан малыми прописными

var g_dKoef_pt_to_mm = 25.4 / 72;
var g_dKoef_pc_to_mm = g_dKoef_pt_to_mm / 12;
var g_dKoef_in_to_mm = 25.4;
var g_dKoef_twips_to_mm = g_dKoef_pt_to_mm / 20;
var g_dKoef_mm_to_pt = 1 / g_dKoef_pt_to_mm;
var g_dKoef_mm_to_twips = 1 / g_dKoef_twips_to_mm;

var tblwidth_Auto = 0x00;
var tblwidth_Mm   = 0x01;
var tblwidth_Nil  = 0x02;
var tblwidth_Pct  = 0x03;

var tbllayout_Fixed   = 0x00;
var tbllayout_AutoFit = 0x01;

var border_None   = 0x0000;
var border_Single = 0x0001;

var vertalignjc_Top    = 0x00;
var vertalignjc_Center = 0x01;
var vertalignjc_Bottom = 0x02;

var vmerge_Restart  = 0x01;
var vmerge_Continue = 0x02;

var spacing_Auto = -1;

var styletype_Paragraph = 0x01;
var styletype_Numbering = 0x02;
var styletype_Table     = 0x03;
var styletype_Character = 0x04;

var textdirection_LRTB  = 0x00;
var textdirection_TBRL  = 0x01;
var textdirection_BTLR  = 0x02;
var textdirection_LRTBV = 0x03;
var textdirection_TBRLV = 0x04;
var textdirection_TBLRV = 0x05;

function IsEqualStyleObjects(Object1, Object2)
{
    if (undefined === Object1 && undefined === Object2)
        return true;

    if (undefined === Object1 || undefined === Object2)
        return false;

    return Object1.Is_Equal(Object2);
}

function CTableStylePr()
{
    this.TextPr      = new CTextPr();
    this.ParaPr      = new CParaPr();
    this.TablePr     = new CTablePr();
    this.TableRowPr  = new CTableRowPr();
    this.TableCellPr = new CTableCellPr();
}

CTableStylePr.prototype =
{
    Merge : function(TableStylePr)
    {
        this.TextPr.Merge( TableStylePr.TextPr );
        this.ParaPr.Merge( TableStylePr.ParaPr );
        this.TablePr.Merge( TableStylePr.TablePr );
        this.TableRowPr.Merge( TableStylePr.TableRowPr );
        this.TableCellPr.Merge( TableStylePr.TableCellPr );
    },

    Copy : function()
    {
        var TableStylePr = new CTableStylePr();
        TableStylePr.TextPr      = this.TextPr.Copy();
        TableStylePr.ParaPr      = this.ParaPr.Copy();
        TableStylePr.TablePr     = this.TablePr.Copy();
        TableStylePr.TableRowPr  = this.TableRowPr.Copy();
        TableStylePr.TableCellPr = this.TableCellPr.Copy();
        return TableStylePr;
    },

    Is_Equal : function(TableStylePr)
    {
        if (true !== this.TextPr.Is_Equal(TableStylePr.TextPr)
            || true !== this.ParaPr.Is_Equal(TableStylePr.ParaPr)
            || true !== this.TablePr.Is_Equal(TableStylePr.TablePr)
            || true !== this.TableRowPr.Is_Equal(TableStylePr.TableRowPr)
            || true !== this.TableCellPr.Is_Equal(TableStylePr.TableCellPr))
            return false;

        return false;
    },

    Check_PresentationPr : function(Theme)
    {
        this.TextPr.Check_PresentationPr();
        this.TableCellPr.Check_PresentationPr(Theme);
    },

    Set_FromObject : function(Obj)
    {
        if ( undefined != Obj.TextPr )
            this.TextPr.Set_FromObject( Obj.TextPr );

        if ( undefined != Obj.ParaPr )
            this.ParaPr.Set_FromObject( Obj.ParaPr );

        if ( undefined != Obj.TablePr )
            this.TablePr.Set_FromObject( Obj.TablePr );

        if ( undefined != Obj.TableRowPr )
            this.TableRowPr.Set_FromObject( Obj.TableRowPr );

        if ( undefined != Obj.TableCellPr )
            this.TableCellPr.Set_FromObject( Obj.TableCellPr );
    },

    Write_ToBinary : function(Writer)
    {
        this.TextPr.Write_ToBinary( Writer );
        this.ParaPr.Write_ToBinary( Writer );
        this.TablePr.Write_ToBinary( Writer );
        this.TableRowPr.Write_ToBinary( Writer );
        this.TableCellPr.Write_ToBinary( Writer );
    },

    Read_FromBinary : function(Reader)
    {
        this.TextPr.Read_FromBinary( Reader );
        this.ParaPr.Read_FromBinary( Reader );
        this.TablePr.Read_FromBinary( Reader );
        this.TableRowPr.Read_FromBinary( Reader );
        this.TableCellPr.Read_FromBinary( Reader );
    },

    Init_Default : function()
    {
        this.TextPr.Init_Default();
        this.ParaPr.Init_Default();
        this.TablePr.Init_Default();
        this.TableRowPr.Init_Default();
        this.TableCellPr.Init_Default();
    }
};

function CStyle(Name, BasedOnId, NextId, type, bNoCreateTablePr)
{
    this.Id = AscCommon.g_oIdCounter.Get_NewId();

    this.Name    = Name;
    this.BasedOn = BasedOnId;
    this.Next    = NextId;
    this.Type    = (null != type ? type : styletype_Paragraph);
    this.Link    = null;

    this.qFormat        = null;// false
    this.uiPriority     = null;// -1
    this.hidden         = null;// false
    this.semiHidden     = null;// false
    this.unhideWhenUsed = null;// false

    this.TextPr = new CTextPr();
    this.ParaPr = new CParaPr();

    this.TablePr     = new CTablePr();
    this.TableRowPr  = new CTableRowPr();
    this.TableCellPr = new CTableCellPr();

    if(bNoCreateTablePr !== true)
    {
        // Условные типы форматирования стилей таблицы
        this.TableBand1Horz  = new CTableStylePr();
        this.TableBand1Vert  = new CTableStylePr();
        this.TableBand2Horz  = new CTableStylePr();
        this.TableBand2Vert  = new CTableStylePr();
        this.TableFirstCol   = new CTableStylePr();
        this.TableFirstRow   = new CTableStylePr();
        this.TableLastCol    = new CTableStylePr();
        this.TableLastRow    = new CTableStylePr();
        this.TableTLCell     = new CTableStylePr();
        this.TableTRCell     = new CTableStylePr();
        this.TableBLCell     = new CTableStylePr();
        this.TableBRCell     = new CTableStylePr();
        this.TableWholeTable = new CTableStylePr();
    }

    // Добавляем данный класс в таблицу Id (обязательно в конце конструктора)
    g_oTableId.Add( this, this.Id );
}

CStyle.prototype =
{
//-----------------------------------------------------------------------------------
// Работаем с Id данного объекта
//-----------------------------------------------------------------------------------
    GetId : function()
    {
        return this.Id;
    },

    Get_Id : function()
    {
        return this.GetId();
    },
//-----------------------------------------------------------------------------------
// Базовые функции для работы со стилем
//-----------------------------------------------------------------------------------
    Copy : function()
    {
        var Style = new CStyle();

        Style.Name           = this.Name;
        Style.BasedOn        = this.BasedOn;
        Style.Next           = this.Next;
        Style.Type           = this.Type;
        Style.qFormat        = this.qFormat       ;
        Style.uiPriority     = this.uiPriority    ;
        Style.hidden         = this.hidden        ;
        Style.semiHidden     = this.semiHidden    ;
        Style.unhideWhenUsed = this.unhideWhenUsed;

        Style.TextPr      = this.TextPr.Copy();
        Style.ParaPr      = this.ParaPr.Copy();
        Style.TablePr     = this.TablePr.Copy();
        Style.TablePr     = this.TablePr.Copy();
        Style.TableRowPr  = this.TableRowPr.Copy();
        Style.TableCellPr = this.TableCellPr.Copy();

        if (undefined !== this.TableBand1Horz)
        {
            Style.TableBand1Horz = this.TableBand1Horz.Copy();
            Style.TableBand1Vert = this.TableBand1Vert.Copy();
            Style.TableBand2Horz = this.TableBand2Horz.Copy();
            Style.TableBand2Vert = this.TableBand2Vert.Copy();
            Style.TableFirstCol  = this.TableFirstCol.Copy();
            Style.TableFirstRow  = this.TableFirstRow.Copy();
            Style.TableLastCol   = this.TableLastCol.Copy();
            Style.TableLastRow   = this.TableLastRow.Copy();
            Style.TableTLCell    = this.TableTLCell.Copy();
            Style.TableTRCell    = this.TableTRCell.Copy();
            Style.TableBLCell    = this.TableBLCell.Copy();
            Style.TableBRCell    = this.TableBRCell.Copy();
            Style.TableWholeTable= this.TableWholeTable.Copy();
        }

        return Style;
    },

	RemapIdReferences : function(OldId, NewId)
	{
		if (OldId === this.BasedOn)
			this.Set_BasedOn(NewId);

		if (OldId === this.Link)
			this.Set_Link(NewId);

		if (OldId === this.Next)
			this.Set_Next(NewId);
	},

	Set_TextPr : function(Value)
	{
		var Old = this.TextPr;
		var New = new CTextPr();
		New.Set_FromObject(Value);

		this.TextPr = New;

		History.Add(new CChangesStyleTextPr(this, Old, New));
	},

	Set_ParaPr : function(Value)
	{
		var Old = this.ParaPr;
		var New = new CParaPr();
		New.Set_FromObject(Value);

		this.ParaPr = New;

		History.Add(new CChangesStyleParaPr(this, Old, New));
	},

	Set_TablePr : function(Value)
	{
		var Old = this.TablePr;
		var New = new CTablePr();
		New.Set_FromObject(Value);

		this.TablePr = New;

		History.Add(new CChangesStyleTablePr(this, Old, New));
	},

	Set_TableRowPr : function(Value)
	{
		var Old = this.TableRowPr;
		var New = new CTableRowPr();
		New.Set_FromObject(Value);

		this.TableRowPr = New;

		History.Add(new CChangesStyleTableRowPr(this, Old, New));
	},

	Set_TableCellPr : function(Value)
	{
		var Old = this.TableCellPr;
		var New = new CTableCellPr();
		New.Set_FromObject(Value);

		this.TableCellPr = New;

		History.Add(new CChangesStyleTableCellPr(this, Old, New));
	},

	Set_TableBand1Horz : function(Value)
	{
		var Old = this.TableBand1Horz;
		var New = new CTableStylePr();
		New.Set_FromObject(Value);

		this.TableBand1Horz = New;

		History.Add(new CChangesStyleTableBand1Horz(this, Old, New));
	},

	Set_TableBand1Vert : function(Value)
	{
		var Old = this.TableBand1Vert;
		var New = new CTableStylePr();
		New.Set_FromObject(Value);

		this.TableBand1Vert = New;

		History.Add(new CChangesStyleTableBand1Vert(this, Old, New));
	},

    Set_TableBand2Horz : function(Value)
    {
        var Old = this.TableBand2Horz;
        var New = new CTableStylePr();
        New.Set_FromObject(Value);

        this.TableBand2Horz = New;

        History.Add(new CChangesStyleTableBand2Horz(this, Old, New));
    },

	Set_TableBand2Vert : function(Value)
	{
		var Old = this.TableBand2Vert;
		var New = new CTableStylePr();
		New.Set_FromObject(Value);

		this.TableBand2Vert = New;

		History.Add(new CChangesStyleTableBand2Vert(this, Old, New));
	},

	Set_TableFirstCol : function(Value)
	{
		var Old = this.TableFirstCol;
		var New = new CTableStylePr();
		New.Set_FromObject(Value);

		this.TableFirstCol = New;

		History.Add(new CChangesStyleTableFirstCol(this, Old, New));
	},

	Set_TableFirstRow : function(Value)
	{
		var Old = this.TableFirstRow;
		var New = new CTableStylePr();
		New.Set_FromObject(Value);

		this.TableFirstRow = New;

		History.Add(new CChangesStyleTableFirstRow(this, Old, New));
	},

	Set_TableLastCol : function(Value)
	{
		var Old = this.TableLastCol;
		var New = new CTableStylePr();
		New.Set_FromObject(Value);

		this.TableLastCol = New;

		History.Add(new CChangesStyleTableLastCol(this, Old, New));
	},

	Set_TableLastRow : function(Value)
	{
		var Old = this.TableLastRow;
		var New = new CTableStylePr();
		New.Set_FromObject(Value);

		this.TableLastRow = New;

		History.Add(new CChangesStyleTableLastRow(this, Old, New));
	},

	Set_TableTLCell : function(Value)
	{
		var Old = this.TableTLCell;
		var New = new CTableStylePr();
		New.Set_FromObject(Value);

		this.TableTLCell = New;

		History.Add(new CChangesStyleTableTLCell(this, Old, New));
	},

	Set_TableTRCell : function(Value)
	{
		var Old = this.TableTRCell;
		var New = new CTableStylePr();
		New.Set_FromObject(Value);

		this.TableTRCell = New;

		History.Add(new CChangesStyleTableTRCell(this, Old, New));
	},

	Set_TableBLCell : function(Value)
	{
		var Old = this.TableBLCell;
		var New = new CTableStylePr();
		New.Set_FromObject(Value);

		this.TableBLCell = New;

		History.Add(new CChangesStyleTableBLCell(this, Old, New));
	},

	Set_TableBRCell : function(Value)
	{
		var Old = this.TableBRCell;
		var New = new CTableStylePr();
		New.Set_FromObject(Value);

		this.TableBRCell = New;

		History.Add(new CChangesStyleTableBRCell(this, Old, New));
	},

	Set_TableWholeTable : function(Value)
	{
		var Old = this.TableWholeTable;
		var New = new CTableStylePr();
		New.Set_FromObject(Value);

		this.TableWholeTable = New;

		History.Add(new CChangesStyleTableWholeTable(this, Old, New));
	},

	Set_Name : function(Value)
	{
		History.Add(new CChangesStyleName(this, this.Name, Value));
		this.Name = Value;
	},

    Get_Name : function()
    {
        return this.Name;
    },

	Set_BasedOn : function(Value)
	{
		History.Add(new CChangesStyleBasedOn(this, this.BasedOn, Value));
		this.BasedOn = Value;
	},

    Get_BasedOn : function()
    {
        return this.BasedOn;
    },

	Set_Next : function(Value)
	{
		History.Add(new CChangesStyleNext(this, this.Next, Value));
		this.Next = Value;
	},

    Get_Next : function()
    {
        return this.Next;
    },

	Set_Link : function(Value)
	{
		History.Add(new CChangesStyleLink(this, this.Link, Value));
		this.Link = Value;
	},

	Set_Type : function(Value)
	{
		History.Add(new CChangesStyleType(this, this.Type, Value));
		this.Type = Value;
	},

    Get_Type : function()
    {
        return this.Type;
    },

	Set_QFormat : function(Value)
	{
		History.Add(new CChangesStyleQFormat(this, this.qFormat, Value));
		this.qFormat = Value;
	},

    Get_QFormat : function()
    {
        return this.qFormat;
    },

	Set_UiPriority : function(Value)
	{
		History.Add(new CChangesStyleUiPriority(this, this.uiPriority, Value));
		this.uiPriority = Value;
	},

    Get_UiPriority : function()
    {
        return this.uiPriority;
    },

	Set_Hidden : function(Value)
	{
		History.Add(new CChangesStyleHidden(this, this.hidden, Value));
		this.hidden = Value;
	},

    Get_Hidden : function()
    {
        return this.hidden;
    },

	Set_SemiHidden : function(Value)
	{
		History.Add(new CChangesStyleSemiHidden(this, this.semiHidden, Value));
		this.semiHidden = Value;
	},

    Get_SemiHidden : function()
    {
        return this.semiHidden;
    },

	Set_UnhideWhenUsed : function(Value)
	{
		History.Add(new CChangesStyleUnhideWhenUsed(this, this.unhideWhenUsed, Value));
		this.unhideWhenUsed = Value;
	},

    Get_UnhideWhenUsed : function()
    {
        return this.unhideWhenUsed;
    },

    Clear : function(Name, BasedOnId, NextId, Type)
    {
        this.Set_Name(Name);
        this.Set_BasedOn(BasedOnId);
        this.Set_Next(NextId);
        this.Set_Type(Type);

        if (undefined != this.Link && null != this.Link)
            this.Set_Link(null);

        if (undefined != this.qFormat && null != this.qFormat)
            this.Set_QFormat(null);

        if (undefined != this.uiPriority && null != this.uiPriority)
            this.Set_UiPriority(null);

        if (undefined != this.hidden && null != this.hidden)
            this.Set_Hidden(null);

        if (undefined != this.semiHidden && null != this.semiHidden)
            this.Set_SemiHidden(null);

        if (undefined != this.unhideWhenUsed && null != this.unhideWhenUsed)
            this.Set_UnhideWhenUsed(null);

        this.Set_TextPr(new CTextPr());
        this.Set_ParaPr(new CParaPr());
        this.Set_TablePr(new CTablePr());
        this.Set_TableRowPr(new CTableRowPr());
        this.Set_TableCellPr(new CTableCellPr());

        if (undefined != this.TableBand1Horz ) this.Set_TableBand1Horz (new CTableStylePr());
        if (undefined != this.TableBand1Vert ) this.Set_TableBand1Vert (new CTableStylePr());
        if (undefined != this.TableBand2Horz ) this.Set_TableBand2Horz (new CTableStylePr());
        if (undefined != this.TableBand2Vert ) this.Set_TableBand2Vert (new CTableStylePr());
        if (undefined != this.TableFirstCol  ) this.Set_TableFirstCol  (new CTableStylePr());
        if (undefined != this.TableFirstRow  ) this.Set_TableFirstRow  (new CTableStylePr());
        if (undefined != this.TableLastCol   ) this.Set_TableLastCol   (new CTableStylePr());
        if (undefined != this.TableLastRow   ) this.Set_TableLastRow   (new CTableStylePr());
        if (undefined != this.TableTLCell    ) this.Set_TableTLCell    (new CTableStylePr());
        if (undefined != this.TableTRCell    ) this.Set_TableTRCell    (new CTableStylePr());
        if (undefined != this.TableBLCell    ) this.Set_TableBLCell    (new CTableStylePr());
        if (undefined != this.TableBRCell    ) this.Set_TableBRCell    (new CTableStylePr());
        if (undefined != this.TableWholeTable) this.Set_TableWholeTable(new CTableStylePr());
    },
//-----------------------------------------------------------------------------------
//
//-----------------------------------------------------------------------------------
    Document_Get_AllFontNames : function(AllFonts)
    {
        if ( undefined != this.TextPr )
            this.TextPr.Document_Get_AllFontNames(AllFonts);
    },

	Create_Default_Paragraph : function()
	{
		this.Set_QFormat(true);
	},

    Create_Default_Character : function()
    {
        this.Set_UiPriority( 1 );
        this.Set_SemiHidden( true );
        this.Set_UnhideWhenUsed( true );
    },

    Create_Default_Numbering : function()
    {
        this.Set_UiPriority( 99 );
        this.Set_SemiHidden( true );
        this.Set_UnhideWhenUsed( true );
    },

	private_CreateDefaultUnifillColor : function()
	{
		var Unifill        = new AscFormat.CUniFill();
		Unifill.fill       = new AscFormat.CSolidFill();
		Unifill.fill.color = AscFormat.builder_CreateSchemeColor('tx1');
		return Unifill;
	},

	Create_Heading1 : function()
	{
		var ParaPr = {
			KeepNext  : true,
			KeepLines : true,

			Spacing : {
				Before : 24 * g_dKoef_pt_to_mm,
				After  : 0
			},

			OutlineLvl : 0
		};

		var TextPr = {
			FontSize   : 24,
			FontSizeCS : 24,
			RFonts     : {
				Ascii    : {Name : Default_Heading_Font, Index : -1},
				EastAsia : {Name : Default_Heading_Font, Index : -1},
				HAnsi    : {Name : Default_Heading_Font, Index : -1},
				CS       : {Name : Default_Heading_Font, Index : -1}
			},

			Bold   : true,
			BoldCS : true,
			Color  : {
				r : 0,
				g : 0,
				b : 0
			},
			Unifill : this.private_CreateDefaultUnifillColor()
		};

        this.Set_QFormat( true );
        this.Set_UiPriority( 9 );
        this.Set_ParaPr( ParaPr );
        this.Set_TextPr( TextPr );
    },

	Create_Heading2 : function()
	{
		var ParaPr = {
			KeepNext  : true,
			KeepLines : true,

			Spacing : {
				Before : 10 * g_dKoef_pt_to_mm,
				After  : 0
			},

			OutlineLvl : 1
		};

		var TextPr = {
			FontSize   : 20,
			RFonts     : {
				Ascii    : {Name : Default_Heading_Font, Index : -1},
				EastAsia : {Name : Default_Heading_Font, Index : -1},
				HAnsi    : {Name : Default_Heading_Font, Index : -1},
				CS       : {Name : Default_Heading_Font, Index : -1}
			},
			Bold       : true,
			BoldCS     : true,
			Color      : {
				r : 0,
				g : 0,
				b : 0
			},
			Unifill    : this.private_CreateDefaultUnifillColor()
		};

		this.Set_QFormat(true);
		this.Set_UiPriority(9);
		this.Set_UnhideWhenUsed(true);
		this.Set_TextPr(TextPr);
		this.Set_ParaPr(ParaPr);
	},

	Create_Heading3 : function()
	{
		var ParaPr = {
			KeepNext  : true,
			KeepLines : true,

			Spacing : {
				Before : 10 * g_dKoef_pt_to_mm,
				After  : 0
			},

			OutlineLvl : 2
		};

		var TextPr = {
			FontSize   : 18,
			FontSizeCS : 18,
			RFonts     : {
				Ascii    : {Name : Default_Heading_Font, Index : -1},
				EastAsia : {Name : Default_Heading_Font, Index : -1},
				HAnsi    : {Name : Default_Heading_Font, Index : -1},
				CS       : {Name : Default_Heading_Font, Index : -1}
			},
			Bold       : true,
			BoldCS     : true,
			Italic     : true,
			ItalicCS   : true,
			Color      : {
				r : 0,
				g : 0,
				b : 0
			},
			Unifill    : this.private_CreateDefaultUnifillColor()
		};

		this.Set_QFormat(true);
		this.Set_UiPriority(9);
		this.Set_UnhideWhenUsed(true);
		this.Set_TextPr(TextPr);
		this.Set_ParaPr(ParaPr);
	},

	Create_Heading4 : function()
	{
		var ParaPr = {
			KeepNext  : true,
			KeepLines : true,

			Spacing : {
				Before : 10 * g_dKoef_pt_to_mm,
				After  : 0
			},

			OutlineLvl : 3
		};

		var TextPr = {
			FontSize   : 16,
			FontSizeCS : 16,
			RFonts     : {
				Ascii    : {Name : Default_Heading_Font, Index : -1},
				EastAsia : {Name : Default_Heading_Font, Index : -1},
				HAnsi    : {Name : Default_Heading_Font, Index : -1},
				CS       : {Name : Default_Heading_Font, Index : -1}
			},

			Color   : {
				r : 0x23,
				g : 0x23,
				b : 0x23
			}
		};

		this.Set_QFormat(true);
		this.Set_UiPriority(9);
		this.Set_UnhideWhenUsed(true);
		this.Set_TextPr(TextPr);
		this.Set_ParaPr(ParaPr);
	},

	Create_Heading5 : function()
	{
		var ParaPr = {
			KeepNext  : true,
			KeepLines : true,

			Spacing : {
				Before : 10 * g_dKoef_pt_to_mm,
				After  : 0
			},

			OutlineLvl : 4
		};

		var TextPr =
			{
				FontSize   : 14,
				FontSizeCS : 14,
				RFonts     : {
					Ascii    : {Name : Default_Heading_Font, Index : -1},
					EastAsia : {Name : Default_Heading_Font, Index : -1},
					HAnsi    : {Name : Default_Heading_Font, Index : -1},
					CS       : {Name : Default_Heading_Font, Index : -1}
				},
				Bold       : true,
				BoldCS     : true,
				Color      : {
					r : 0x44,
					g : 0x44,
					b : 0x44
				}
			};

		this.Set_QFormat(true);
		this.Set_UiPriority(9);
		this.Set_UnhideWhenUsed(true);
		this.Set_TextPr(TextPr);
		this.Set_ParaPr(ParaPr);
	},

	Create_Heading6 : function()
	{
		var ParaPr = {
			KeepNext   : true,
			KeepLines  : true,
			Spacing    : {
				Before : 10 * g_dKoef_pt_to_mm,
				After  : 0
			},
			OutlineLvl : 5
		};

		var TextPr = {
			FontSize   : 14,
			FontSizeCS : 14,
			Italic     : true,
			ItalicCS   : true,
			RFonts     : {
				Ascii    : {Name : Default_Heading_Font, Index : -1},
				EastAsia : {Name : Default_Heading_Font, Index : -1},
				HAnsi    : {Name : Default_Heading_Font, Index : -1},
				CS       : {Name : Default_Heading_Font, Index : -1}
			},
			Color      : {
				r : 0x23,
				g : 0x23,
				b : 0x23
			}
		};

		this.Set_QFormat(true);
		this.Set_UiPriority(9);
		this.Set_UnhideWhenUsed(true);
		this.Set_TextPr(TextPr);
		this.Set_ParaPr(ParaPr);
	},

	Create_Heading7 : function()
	{
		var ParaPr = {
			KeepNext   : true,
			KeepLines  : true,
			Spacing    : {
				Before : 10 * g_dKoef_pt_to_mm,
				After  : 0
			},
			OutlineLvl : 6
		};

		var TextPr = {
			FontSize   : 12,
			FontSizeCS : 12,
			RFonts     : {
				Ascii    : {Name : Default_Heading_Font, Index : -1},
				EastAsia : {Name : Default_Heading_Font, Index : -1},
				HAnsi    : {Name : Default_Heading_Font, Index : -1},
				CS       : {Name : Default_Heading_Font, Index : -1}
			},
			Bold       : true,
			BoldCS     : true,
			Color      : {
				r : 0x60,
				g : 0x60,
				b : 0x60
			}
		};

		this.Set_QFormat(true);
		this.Set_UiPriority(9);
		this.Set_UnhideWhenUsed(true);
		this.Set_TextPr(TextPr);
		this.Set_ParaPr(ParaPr);
	},

	Create_Heading8 : function()
	{
		var ParaPr = {
			KeepNext   : true,
			KeepLines  : true,
			Spacing    : {
				Before : 10 * g_dKoef_pt_to_mm,
				After  : 0
			},
			OutlineLvl : 7
		};

		var TextPr = {
			FontSize   : 12,
			FontSizeCS : 12,
			RFonts     : {
				Ascii    : {Name : Default_Heading_Font, Index : -1},
				EastAsia : {Name : Default_Heading_Font, Index : -1},
				HAnsi    : {Name : Default_Heading_Font, Index : -1},
				CS       : {Name : Default_Heading_Font, Index : -1}
			},
			Color      : {
				r : 0x44,
				g : 0x44,
				b : 0x44
			}
		};

		this.Set_QFormat(true);
		this.Set_UiPriority(9);
		this.Set_UnhideWhenUsed(true);
		this.Set_TextPr(TextPr);
		this.Set_ParaPr(ParaPr);
	},

	Create_Heading9 : function()
	{
		var ParaPr = {
			KeepNext   : true,
			KeepLines  : true,
			Spacing    : {
				Before : 10 * g_dKoef_pt_to_mm,
				After  : 0
			},
			OutlineLvl : 8
		};

		var TextPr = {
			FontSize   : 11.5,
			FontSizeCS : 11.5,
			RFonts     : {
				Ascii    : {Name : Default_Heading_Font, Index : -1},
				EastAsia : {Name : Default_Heading_Font, Index : -1},
				HAnsi    : {Name : Default_Heading_Font, Index : -1},
				CS       : {Name : Default_Heading_Font, Index : -1}
			},
			Italic     : true,
			ItalicCS   : true,
			Color      : {
				r : 0x44,
				g : 0x44,
				b : 0x44
			}
		};

		this.Set_QFormat(true);
		this.Set_UiPriority(9);
		this.Set_UnhideWhenUsed(true);
		this.Set_TextPr(TextPr);
		this.Set_ParaPr(ParaPr);
	},

	Create_ListParagraph : function()
	{
		var ParaPr = {
			Ind : {
				Left : 36 * g_dKoef_pt_to_mm
			},

			ContextualSpacing : true
		};

		this.Set_QFormat(true);
		this.Set_UiPriority(34);
		this.Set_ParaPr(ParaPr);
	},

    Create_NoSpacing : function()
    {
        this.uiPriority = 1;
        this.qFormat    = true;

        var ParaPr =
        {
            Spacing :
            {
                Line     : 1,
                LineRule : linerule_Auto,
                After    : 0
            }
        };

        var TextPr =
        {
            FontFamily : { Name : "Arial", Index : -1 },
            Color      :
            {
                r : 0x00,
                g : 0x00,
                b : 0x00
            }
        };

        this.Set_QFormat( true );
        this.Set_UiPriority( 1 );
        this.Set_TextPr( TextPr );
        this.Set_ParaPr( ParaPr );
    },

    Create_Header : function()
    {
        var RPos = 297 - 30 - 15; // Ширина страницы - левое поле - правое поле
        var CPos = RPos / 2;

        var ParaPr =
        {
            Spacing:
            {
                After    : 0,
                Line     : 1,
                LineRule : linerule_Auto
            },

            Tabs :
            {
                Tabs :
                    [
                        {
                            Value : tab_Center,
                            Pos   : CPos
                        },
                        {
                            Value : tab_Right,
                            Pos   : RPos
                        }
                    ]
            }
        };

        var TextPr =
        {
            FontSize  : 11,
            FontFamily: { Name : "Arial", Index : -1 },
            Color     : { r : 0x00, g : 0x00, b : 0x00 }
        };

        this.Set_UiPriority( 99 );
        this.Set_UnhideWhenUsed( true );
        this.Set_TextPr( TextPr );
        this.Set_ParaPr( ParaPr );
    },

    Create_Footer : function()
    {
        var RPos = 297 - 30 - 15; // Ширина страницы - левое поле - правое поле
        var CPos = RPos / 2;

        var ParaPr =
        {
            Spacing:
            {
                After    : 0,
                Line     : 1,
                LineRule : linerule_Auto
            },

            Tabs :
            {
                Tabs :
                    [
                        {
                            Value : tab_Center,
                            Pos   : CPos
                        },
                        {
                            Value : tab_Right,
                            Pos   : RPos
                        }
                    ]
            }
        };

        var TextPr =
        {
            FontSize  : 11,
            FontFamily: { Name : "Arial", Index : -1 },
            Color     : { r : 0x00, g : 0x00, b : 0x00 }
        };

        this.Set_UiPriority( 99 );
        this.Set_UnhideWhenUsed( true );
        this.Set_TextPr( TextPr );
        this.Set_ParaPr( ParaPr );
    },

    Create_NormalTable : function()
    {
        var TablePr =
        {
            TableInd : 0 ,
            TableCellMar :
            {
                Top :
                {
                    W    : 0,
                    Type : tblwidth_Mm
                },

                Left :
                {
                    W    : 1.9, // 5.4pt
                    Type : tblwidth_Mm
                },

                Bottom :
                {
                    W    : 0,
                    Type : tblwidth_Mm
                },

                Right :
                {
                    W    : 1.9, // 5.4pt
                    Type : tblwidth_Mm
                }
            }
        };

        this.Set_UiPriority( 99 );
        this.Set_SemiHidden( true );
        this.Set_UnhideWhenUsed( true );
        this.Set_TablePr( TablePr );
    },

    Create_TableGrid : function()
    {
        var ParaPr =
        {
            Spacing :
            {
                After    : 0,
                Line     : 1,
                LineRule : linerule_Auto
            }
        };

        var TablePr =
        {
            TableInd : 0,

            TableBorders :
            {
                Top :
                {
                    Color : { r : 0, g : 0, b : 0 },
                    Space : 0,
                    Size  : 0.5 * g_dKoef_pt_to_mm,
                    Value : border_Single
                },

                Left :
                {
                    Color : { r : 0, g : 0, b : 0 },
                    Space : 0,
                    Size  : 0.5 * g_dKoef_pt_to_mm,
                    Value : border_Single
                },

                Bottom :
                {
                    Color : { r : 0, g : 0, b : 0 },
                    Space : 0,
                    Size  : 0.5 * g_dKoef_pt_to_mm,
                    Value : border_Single
                },

                Right :
                {
                    Color : { r : 0, g : 0, b : 0 },
                    Space : 0,
                    Size  : 0.5 * g_dKoef_pt_to_mm,
                    Value : border_Single
                },

                InsideH :
                {
                    Color : { r : 0, g : 0, b : 0 },
                    Space : 0,
                    Size  : 0.5 * g_dKoef_pt_to_mm,
                    Value : border_Single
                },

                InsideV :
                {
                    Color : { r : 0, g : 0, b : 0 },
                    Space : 0,
                    Size  : 0.5 * g_dKoef_pt_to_mm,
                    Value : border_Single
                }
            },

            TableCellMar :
            {
                Top :
                {
                    W    : 0,
                    Type : tblwidth_Mm
                },

                Left :
                {
                    W    : 1.9,
                    Type : tblwidth_Mm
                },

                Bottom :
                {
                    W    : 0,
                    Type : tblwidth_Mm
                },

                Right :
                {
                    W    : 1.9,
                    Type : tblwidth_Mm
                }
            }
        };

        this.Set_UiPriority(59);
        this.Set_TablePr(TablePr);
        this.Set_ParaPr(ParaPr);
    },

    Create_Quote : function()
    {
        var ParaPr =
        {
            Ind :
            {
                Left : 60 // 6 см
            },

            Brd :
            {
                Bottom :
                {
                    Color : { r : 0xA6, g : 0xA6, b : 0xA6 },
                    Space : 1,
                    Size  : 1.5 * g_dKoef_pt_to_mm,
                    Value : border_Single
                },

                Left :
                {
                    Color : { r : 0xA6, g : 0xA6, b : 0xA6 },
                    Space : 4,
                    Size  : 1.5 * g_dKoef_pt_to_mm,
                    Value : border_Single
                }
            }
        };

        var TextPr =
        {
            FontSize   : 9,
            FontFamily : { Name : "Arial", Index : -1 },
            Italic     : true,
            Color      :
            {
                r : 0x37,
                g : 0x37,
                b : 0x37
            }
        };

        this.Set_QFormat( true );
        this.Set_UiPriority( 29 );
        this.Set_TextPr( TextPr );
        this.Set_ParaPr( ParaPr );
    },

    Create_Subtitle : function()
    {
        this.uiPriority = 11;
        this.qFormat    = true;

        var ParaPr =
        {
            Spacing :
            {
                Line     : 1,
                LineRule : linerule_Auto
            },

            OutlineLvl : 0
        };

        var TextPr =
        {
            FontSize   : 26,
            FontFamily : { Name : "Arial", Index : -1 },
            Italic     : true,
            Color      :
            {
                r : 0x44,
                g : 0x44,
                b : 0x44
            }
        };

        this.Set_QFormat( true );
        this.Set_UiPriority( 11 );
        this.Set_TextPr( TextPr );
        this.Set_ParaPr( ParaPr );
    },

    Create_IntenseQuote : function()
    {
        var ParaPr =
        {
            Ind :
            {
                Left  : 10, // 1 cm
                Right : 10  // 1 cm
            },

            Shd :
            {
                Value : c_oAscShdClear,
                Color :
                {
                    r : 0xD9,
                    g : 0xD9,
                    b : 0xD9
                }
            },

            Brd :
            {
                Bottom :
                {
                    Color : { r : 0x80, g : 0x80, b : 0x80 },
                    Space : 1,
                    Size  : 0.5 * g_dKoef_pt_to_mm,
                    Value : border_Single
                },

                Left :
                {
                    Color : { r : 0x80, g : 0x80, b : 0x80 },
                    Space : 4,
                    Size  : 0.5 * g_dKoef_pt_to_mm,
                    Value : border_Single
                },

                Right :
                {
                    Color : { r : 0x80, g : 0x80, b : 0x80 },
                    Space : 4,
                    Size  : 0.5 * g_dKoef_pt_to_mm,
                    Value : border_Single
                },

                Top :
                {
                    Color : { r : 0x80, g : 0x80, b : 0x80 },
                    Space : 1,
                    Size  : 0.5 * g_dKoef_pt_to_mm,
                    Value : border_Single
                }
            }
        };

        var TextPr =
        {
            FontSize   : 9.5,
            FontFamily : { Name : "Arial", Index : -1 },
            Italic     : true,
            Color      :
            {
                r : 0x60,
                g : 0x60,
                b : 0x60
            }
        };

        this.Set_QFormat( true );
        this.Set_UiPriority( 30 );
        this.Set_TextPr( TextPr );
        this.Set_ParaPr( ParaPr );
    },

    Create_Title : function()
    {
        this.uiPriority = 10;
        this.qFormat    = true;

        var ParaPr =
        {
            Spacing :
            {
                Line              : 1,
                LineRule          : linerule_Auto,
                Before            : 15 * g_dKoef_pt_to_mm,
                After             :  4 * g_dKoef_pt_to_mm
            },

            Brd :
            {
                Bottom :
                {
                    Color : { r : 0x00, g : 0x00, b : 0x00 },
                    Space : 0,
                    Size  : 3 * g_dKoef_pt_to_mm,
                    Value : border_Single
                }
            },

            OutlineLvl : 0
        };

        var TextPr =
        {
            FontSize   : 36,
            FontFamily : { Name : "Arial", Index : -1 },
            Bold       : true,
            Color      :
            {
                r : 0x00,
                g : 0x00,
                b : 0x00
            }
        };

        this.Set_QFormat( true );
        this.Set_UiPriority( 10 );
        this.Set_TextPr( TextPr );
        this.Set_ParaPr( ParaPr );
    },

    Create_Table_LightShading : function()
    {
        this.uiPriority = 60;

        var ParaPr =
        {
            Spacing :
            {
                After    : 0,
                Line     : 1,
                LineRule : linerule_Auto
            }
        };

        var TablePr =
        {
            TableStyleColBandSize : 1,
            TableStyleRowBandSize : 1,
            TableInd : 0,

            TableBorders :
            {
                Top :
                {
                    Color : { r : 0, g : 0, b : 0 },
                    Space : 0,
                    Size  : 18 / 8 * g_dKoef_pt_to_mm,
                    Value : border_Single
                },

                Bottom :
                {
                    Color : { r : 0, g : 0, b : 0 },
                    Space : 0,
                    Size  : 18 / 8 * g_dKoef_pt_to_mm,
                    Value : border_Single
                }
            },

            TableCellMar :
            {
                Top :
                {
                    W    : 0,
                    Type : tblwidth_Mm
                },
                Left :
                {
                    W    : 5.75 * g_dKoef_pt_to_mm, // 0.08 inch
                    Type : tblwidth_Mm
                },

                Bottom :
                {
                    W    : 0,
                    Type : tblwidth_Mm
                },

                Right :
                {
                    W    : 5.75 * g_dKoef_pt_to_mm, // 0.08 inch
                    Type : tblwidth_Mm
                }
            }
        };

        var TableFirstRow =
        {
            TextPr :
            {
                Bold : true,
                Color :
                {
                    r : 255,
                    g : 255,
                    b : 255
                }
            },

            ParaPr :
            {
                Spacing :
                {
                    After    : 0,
                    Before   : 0,
                    Line     : 1,
                    LineRule : linerule_Auto
                }
            },

            TableCellPr :
            {
                TableCellBorders :
                {
                    Bottom :
                    {
                        Color : { r : 0, g : 0, b : 0 },
                        Space : 0,
                        Size  : 18 / 8 * g_dKoef_pt_to_mm,
                        Value : border_Single
                    },

                    Left :
                    {
                        Value : border_None
                    },

                    Right :
                    {
                        Value : border_None
                    },

                    Top :
                    {
                        Color : { r : 0, g : 0, b : 0 },
                        Space : 0,
                        Size  : 18 / 8 * g_dKoef_pt_to_mm,
                        Value : border_Single
                    }
                },

                Shd :
                {
                    Value : c_oAscShdClear,
                    Color :
                    {
                        r : 0x4F,
                        g : 0x81,
                        b : 0xBD
                    }
                }
            }
        };

        var TableLastRow =
        {
            TextPr :
            {
                Color :
                {
                    r : 0,
                    g : 0,
                    b : 0
                }
            },

            TableCellPr :
            {
                TableCellBorders :
                {
                    Bottom :
                    {
                        Color : { r : 0, g : 0, b : 0 },
                        Space : 0,
                        Size  : 18 / 8 * g_dKoef_pt_to_mm,
                        Value : border_Single
                    },

                    Left :
                    {
                        Value : border_None
                    },

                    Right :
                    {
                        Value : border_None
                    },

                    Top :
                    {
                        Color : { r : 0, g : 0, b : 0 },
                        Space : 0,
                        Size  : 12 / 8 * g_dKoef_pt_to_mm,
                        Value : border_Single
                    }
                },

                Shd :
                {
                    Value : c_oAscShdClear,
                    Color :
                    {
                        r : 0xFF,
                        g : 0xFF,
                        b : 0xFF
                    }
                }
            }
        };

        var TableFirstCol =
        {
            TextPr :
            {
                Bold  : true,
                Color :
                {
                    r : 255,
                    g : 255,
                    b : 255
                }
            },

            ParaPr :
            {
                Spacing :
                {
                    After    : 0,
                    Before   : 0,
                    Line     : 1,
                    LineRule : linerule_Auto
                }
            },

            TableCellPr :
            {
                TableCellBorder :
                {
                    Bottom :
                    {
                        Color : { r : 0, g : 0, b : 0 },
                        Space : 0,
                        Size  : 18 / 8 * g_dKoef_pt_to_mm,
                        Value : border_Single
                    },

                    Left :
                    {
                        Value : border_None
                    },

                    Right :
                    {
                        Value : border_None
                    },

                    Top :
                    {
                        Value : border_None
                    }
                },

                Shd :
                {
                    Value : c_oAscShdClear,
                    Color :
                    {
                        r : 0x4F,
                        g : 0x81,
                        b : 0xBD
                    }
                }
            }

        };

        var TableLastCol =
        {
            TextPr :
            {
                Bold  : true,
                Color :
                {
                    r : 255,
                    g : 255,
                    b : 255
                }
            },

            TableCellPr :
            {
                TableCellBorders :
                {
                    Left :
                    {
                        Value : border_None
                    },

                    Right :
                    {
                        Value : border_None
                    }
                },

                Shd :
                {
                    Value : c_oAscShdClear,
                    Color :
                    {
                        r : 0x4F,
                        g : 0x81,
                        b : 0xBD
                    }
                }
            }
        };

        var TableBand1Vert =
        {
            TableCellPr :
            {
                TableCellBorders :
                {
                    Left :
                    {
                        Value : border_None
                    },

                    Right :
                    {
                        Value : border_None
                    }
                },

                Shd :
                {
                    Value : c_oAscShdClear,
                    Color :
                    {
                        r : 0xD8,
                        g : 0xD8,
                        b : 0xD8
                    }
                }
            }
        };

        var TableBand1Horz =
        {
            TableCellPr :
            {
                Shd :
                {
                    Value : c_oAscShdClear,
                    Color :
                    {
                        r : 0xD8,
                        g : 0xD8,
                        b : 0xD8
                    }
                }
            }
        };

        var TableTRCell =
        {
            TableCellPr :
            {
                TableCellBorders:
                {
                    Bottom :
                    {
                        Color : { r : 0, g : 0, b : 0 },
                        Space : 0,
                        Size  : 18 / 8 * g_dKoef_pt_to_mm,
                        Value : border_Single
                    },

                    Left :
                    {
                        Value : border_None
                    },

                    Right :
                    {
                        Value : border_None
                    },

                    Top :
                    {
                        Color : { r : 0, g : 0, b : 0 },
                        Space : 0,
                        Size  : 18 / 8 * g_dKoef_pt_to_mm,
                        Value : border_Single
                    }
                },

                Shd :
                {
                    Value : c_oAscShdClear,
                    Color :
                    {
                        r : 0,
                        g : 255,
                        b : 0
                    }
                }
            }
        };

        var TableTLCell =
        {
            TextPr :
            {
                Color :
                {
                    r : 255,
                    g : 255,
                    b : 255
                }
            },

            TableCellPr :
            {
                TableCellBorders:
                {
                    Bottom :
                    {
                        Color : { r : 0, g : 0, b : 0 },
                        Space : 0,
                        Size  : 18 / 8 * g_dKoef_pt_to_mm,
                        Value : border_Single
                    },

                    Left :
                    {
                        Value : border_None
                    },

                    Right :
                    {
                        Value : border_None
                    },

                    Top :
                    {
                        Color : { r : 0, g : 0, b : 0 },
                        Space : 0,
                        Size  : 18 / 8 * g_dKoef_pt_to_mm,
                        Value : border_Single
                    }
                }          ,

                Shd :
                {
                    Value : c_oAscShdClear,
                    Color :
                    {
                        r : 255,
                        g : 0,
                        b : 0
                    }
                }
            }
        };

        this.Set_UiPriority( 60 );
        this.Set_ParaPr( ParaPr );
        this.Set_TablePr( TablePr );
        this.Set_TableFirstRow( TableFirstRow );
        this.Set_TableLastRow( TableLastRow );
        this.Set_TableFirstCol( TableFirstCol );
        this.Set_TableLastCol( TableLastCol );
        this.Set_TableBand1Horz( TableBand1Horz );
        this.Set_TableBand1Vert( TableBand1Vert );
        this.Set_TableTRCell( TableTRCell );
        this.Set_TableTLCell( TableTLCell );
    },

    Create_Table_ColorfulListAccent6 : function()
    {
        this.uiPriority = 72;

        var ParaPr =
        {
            Spacing :
            {
                After    : 0,
                Line     : 1,
                LineRule : linerule_Auto
            }
        };

        var TextPr =
        {
            Color : { r : 0, g : 0, b : 0 }
        };

        var TablePr =
        {
            TableStyleColBandSize : 1,
            TableStyleRowBandSize : 1,
            TableInd              : 0,

            TableCellMar :
            {
                TableCellMar :
                {
                    Top :
                    {
                        W    : 0,
                        Type : tblwidth_Mm
                    },
                    Left :
                    {
                        W    : 5.75 * g_dKoef_pt_to_mm, // 0.08 inch
                        Type : tblwidth_Mm
                    },

                    Bottom :
                    {
                        W    : 0,
                        Type : tblwidth_Mm
                    },

                    Right :
                    {
                        W    : 5.75 * g_dKoef_pt_to_mm, // 0.08 inch
                        Type : tblwidth_Mm
                    }
                }
            }
        };

        var TableCellPr =
        {
            Shd :
            {
                Value : c_oAscShdClear,
                Color : { r : 0xFE, g : 0xF4, b : 0xEC }
            }
        };

        var TableFirstRow =
        {
            TextPr :
            {
                Bold  : true,
                Color : { r : 0xFF, g : 0xFF, b : 0xFF }
            },

            TableCellPr :
            {
                TableCellBorders :
                {
                    Bottom :
                    {
                        Color : { r : 0xFF, g : 0xFF, b : 0xFF },
                        Space : 0,
                        Size  : 12 / 8 * g_dKoef_pt_to_mm,
                        Value : border_Single
                    }
                },

                Shd :
                {
                    Value : c_oAscShdClear,
                    Color : { r : 0x34, g : 0x8D, b : 0xA5 }
                }
            }
        };

        var TableLastRow =
        {
            TextPr :
            {
                Bold  : true,
                Color : { r : 0x34, g : 0x8D, b : 0xA5 }
            },

            TableCellPr :
            {
                TableCellBorders :
                {
                    Top :
                    {
                        Color : { r : 0, g : 0, b : 0 },
                        Space : 0,
                        Size  : 12 / 8 * g_dKoef_pt_to_mm,
                        Value : border_Single
                    }
                },

                Shd :
                {
                    Value : c_oAscShdClear,
                    Color : { r : 0xFF, g : 0xFF, b : 0xFF }
                }
            }
        };

        var TableFirstCol =
        {
            TextPr :
            {
                Bold : true
            }
        };

        var TableLastCol =
        {
            TextPr :
            {
                Bold : true
            }
        };

        var TableBand1Vert =
        {
            TableCellPr :
            {
                TableCellBorders :
                {
                    Top     : { Value : border_None },
                    Left    : { Value : border_None },
                    Bottom  : { Value : border_None },
                    Right   : { Value : border_None },
                    InsideH : { Value : border_None },
                    InsideV : { Value : border_None }
                },

                Shd :
                {
                    Value : c_oAscShdClear,
                    Color : { r : 0xFD, g : 0xE4, b : 0xD0 }
                }
            }
        };

        var TableBand1Horz =
        {
            TableCellPr :
            {
                Shd :
                {
                    Value : c_oAscShdClear,
                    Color : { r : 0xFD, g : 0xE9, b : 0xD9 }
                }
            }
        };

        this.Set_UiPriority( 72 );
        this.Set_ParaPr( ParaPr );
        this.Set_TextPr( TextPr );
        this.Set_TablePr( TablePr );
        this.Set_TableCellPr( TableCellPr );
        this.Set_TableFirstRow( TableFirstRow );
        this.Set_TableLastRow( TableLastRow );
        this.Set_TableFirstCol( TableFirstCol );
        this.Set_TableLastCol( TableLastCol );
        this.Set_TableBand1Horz( TableBand1Horz );
        this.Set_TableBand1Vert( TableBand1Vert );
    },

    Create_Table_Lined : function(Color1, Color2)
    {
        var TextColor1 = new CDocumentColor(0xF2, 0xF2, 0xF2, false);
        var TextFont1  = { Name : "Arial", Index : -1 };
        var TextSize1  = 11;

        var CellShd1   = new CDocumentShd();
        CellShd1.Value = c_oAscShdClear;
        CellShd1.Color = new CDocumentColor(Color1.r, Color1.g, Color1.b);

        var TableStylePrBoundary =
        {
            TextPr :
            {
                RFonts   : { Ascii : TextFont1, HAnsi : TextFont1 },
                Color    : TextColor1,
                FontSize : TextSize1
            },

            TableCellPr :
            {
                Shd : CellShd1
            }
        };

        var ParaPr =
        {
            Spacing :
            {
                After    : 0,
                Line     : 1,
                LineRule : linerule_Auto
            },

            Borders :
            {
                Top :
                {
                    Color : { r : 0, g : 0, b : 0, Auto : true },
                    Space : 0,
                    Size  : 0,
                    Value : border_None
                },

                Left :
                {
                    Color : { r : 0, g : 0, b : 0, Auto : true },
                    Space : 0,
                    Size  : 0,
                    Value : border_None
                },

                Bottom :
                {
                    Color : { r : 0, g : 0, b : 0, Auto : true },
                    Space : 0,
                    Size  : 0,
                    Value : border_None
                },

                Right :
                {
                    Color : { r : 0, g : 0, b : 0, Auto : true },
                    Space : 0,
                    Size  : 0,
                    Value : border_None
                },

                Between :
                {
                    Color : { r : 0, g : 0, b : 0, Auto : true },
                    Space : 0,
                    Size  : 0,
                    Value : border_None
                }
            }
        };

        var TextPr =
        {
            Color : { r : 0x40, g : 0x40, b : 0x40 }
        };

        var TablePr =
        {
            TableStyleColBandSize : 1,
            TableStyleRowBandSize : 1,
            TableInd : 0,

            TableCellMar :
            {
                Top    : new CTableMeasurement(tblwidth_Mm, 4.8 * g_dKoef_pt_to_mm),
                Left   : new CTableMeasurement(tblwidth_Mm, 8.5 * g_dKoef_pt_to_mm),
                Bottom : new CTableMeasurement(tblwidth_Mm, 4.8 * g_dKoef_pt_to_mm),
                Right  : new CTableMeasurement(tblwidth_Mm, 8.5 * g_dKoef_pt_to_mm)
            }
        };

        var TableStylePrBand1 =
        {
            TextPr :
            {
                RFonts   : { Ascii : TextFont1, HAnsi : TextFont1 },
                Color    : { r : 0x40, g : 0x40, b : 0x40 },
                FontSize : TextSize1
            }
        };

        var TableStylePrBand2 =
        {
            TextPr :
            {
                RFonts   : { Ascii : TextFont1, HAnsi : TextFont1 },
                Color    : { r : 0x40, g : 0x40, b : 0x40 },
                FontSize : TextSize1
            },

            TableCellPr :
            {
                Shd :
                {
                    Value : c_oAscShdClear,
                    Color : { r : Color2.r, g : Color2.g, b : Color2.b}
                }
            }
        };

        this.Set_UiPriority(99);
        this.Set_ParaPr(ParaPr);
        this.Set_TextPr(TextPr);
        this.Set_TablePr(TablePr);

        this.Set_TableFirstRow(TableStylePrBoundary);
        this.Set_TableLastRow(TableStylePrBoundary);
        this.Set_TableFirstCol(TableStylePrBoundary);
        this.Set_TableLastCol(TableStylePrBoundary);

        this.Set_TableBand1Horz(TableStylePrBand1);
        this.Set_TableBand1Vert(TableStylePrBand1);

        this.Set_TableBand2Horz(TableStylePrBand2);
        this.Set_TableBand2Vert(TableStylePrBand2);
    },

    Create_Table_Bordered : function(Color1, Color2)
    {
        var TableTextPr =
        {
            RFonts   : {Ascii : {Name : "Arial", Index : -1}, HAnsi : {Name : "Arial", Index : -1}},
            Color    : { r : 0x40, g : 0x40, b : 0x40 },
            FontSize : 11
        };

        var ParaPr =
        {
            Spacing :
            {
                After    : 0,
                Line     : 1,
                LineRule : linerule_Auto
            },

            Borders :
            {
                Top :
                {
                    Color : { r : 0, g : 0, b : 0, Auto : true },
                    Space : 0,
                    Size  : 0,
                    Value : border_None
                },

                Left :
                {
                    Color : { r : 0, g : 0, b : 0, Auto : true },
                    Space : 0,
                    Size  : 0,
                    Value : border_None
                },

                Bottom :
                {
                    Color : { r : 0, g : 0, b : 0, Auto : true },
                    Space : 0,
                    Size  : 0,
                    Value : border_None
                },

                Right :
                {
                    Color : { r : 0, g : 0, b : 0, Auto : true },
                    Space : 0,
                    Size  : 0,
                    Value : border_None
                },

                Between :
                {
                    Color : { r : 0, g : 0, b : 0, Auto : true },
                    Space : 0,
                    Size  : 0,
                    Value : border_None
                }
            }
        };

        var TextPr =
        {
            Color : { r : 0x40, g : 0x40, b : 0x40 }
        };

        var TableBorder1 =
        {
            Color : { r : Color1.r, g : Color1.g, b : Color1.b },
            Value : border_Single,
            Size  : 0.5 * g_dKoef_pt_to_mm,
            Space : 0
        };

        var TableBorder2 =
        {
            Color : { r : Color2.r, g : Color2.g, b : Color2.b },
            Value : border_Single,
            Size  : 1.5 * g_dKoef_pt_to_mm,
            Space : 0
        };

        var TablePr =
        {
            TableStyleColBandSize : 1,
            TableStyleRowBandSize : 1,
            TableInd : 0,

            TableBorders :
            {
                Top     : TableBorder1,
                Left    : TableBorder1,
                Bottom  : TableBorder1,
                Right   : TableBorder1,
                InsideH : TableBorder1,
                InsideV : TableBorder1
            },

            TableCellMar :
            {
                Top    : new CTableMeasurement(tblwidth_Mm, 4.8 * g_dKoef_pt_to_mm),
                Left   : new CTableMeasurement(tblwidth_Mm, 8.5 * g_dKoef_pt_to_mm),
                Bottom : new CTableMeasurement(tblwidth_Mm, 4.8 * g_dKoef_pt_to_mm),
                Right  : new CTableMeasurement(tblwidth_Mm, 8.5 * g_dKoef_pt_to_mm)
            }
        };

        var TableFirstRow =
        {
            TextPr : TableTextPr,

            TableCellPr :
            {
                TableCellBorders :
                {
                    Bottom : TableBorder2
                }
            }
        };

        var TableLastRow =
        {
            TextPr      : TableTextPr,
            TableCellPr :
            {
                TableCellBorders :
                {
                    Top : TableBorder2
                }
            }
        };

        var TableFirstCol =
        {
            TextPr      : TableTextPr,
            TableCellPr :
            {
                TableCellBorders :
                {
                    Right : TableBorder2
                }
            }
        };

        var TableLastCol =
        {
            TextPr      : TableTextPr,
            TableCellPr :
            {
                TableCellBorders :
                {
                    Left : TableBorder2
                }
            }
        };

        var TableBand1Horz =
        {
            TextPr : TableTextPr,
            TableCellPr :
            {
                TableCellBorders :
                {
                    Top     : TableBorder1,
                    Left    : TableBorder1,
                    Bottom  : TableBorder1,
                    Right   : TableBorder1,
                    InsideH : TableBorder1,
                    InsideV : TableBorder1
                }
            }
        };

        this.Set_UiPriority(99);
        this.Set_ParaPr(ParaPr);
        this.Set_TablePr(TablePr);
        this.Set_TableFirstRow(TableFirstRow);
        this.Set_TableLastRow(TableLastRow);
        this.Set_TableFirstCol(TableFirstCol);
        this.Set_TableLastCol(TableLastCol);
        this.Set_TableBand1Horz(TableBand1Horz);
    },

    Create_Table_BorderedAndLined : function(TableBorder, TableShdColorBoundary, TableShdColorVertBand, TableShdColorHorzBand)
    {
        var TextPr1 =
        {
            RFonts   : { Ascii : { Name : "Arial", Index : -1 }, HAnsi : { Name : "Arial", Index : -1 } },
            Color    : { r : 0xF2, g : 0xF2, b : 0xF2 },
            FontSize : 11
        };

        var TextPr2 =
        {
            RFonts   : { Ascii : { Name : "Arial", Index : -1 }, HAnsi : { Name : "Arial", Index : -1 } },
            Color    : { r : 0x40, g : 0x40, b : 0x40 },
            FontSize : 11
        };

        var TableCellPr1 =
        {
            Shd :
            {
                Value : c_oAscShdClear,
                Color : { r : TableShdColorBoundary.r, g : TableShdColorBoundary.g, b : TableShdColorBoundary.b}
            }
        };

        var TableCellPrVert =
        {
            Shd :
            {
                Value : c_oAscShdClear,
                Color : { r : TableShdColorVertBand.r, g : TableShdColorVertBand.g, b : TableShdColorVertBand.b}
            }
        };

        var TableCellPrHorz =
        {
            Shd :
            {
                Value : c_oAscShdClear,
                Color : { r : TableShdColorHorzBand.r, g : TableShdColorHorzBand.g, b : TableShdColorHorzBand.b}
            }
        };

        var ParaPr =
        {
            Spacing :
            {
                After    : 0,
                Line     : 1,
                LineRule : linerule_Auto
            },

            Borders :
            {
                Top :
                {
                    Color : { r : 0, g : 0, b : 0, Auto : true },
                    Space : 0,
                    Size  : 0,
                    Value : border_None
                },

                Left :
                {
                    Color : { r : 0, g : 0, b : 0, Auto : true },
                    Space : 0,
                    Size  : 0,
                    Value : border_None
                },

                Bottom :
                {
                    Color : { r : 0, g : 0, b : 0, Auto : true },
                    Space : 0,
                    Size  : 0,
                    Value : border_None
                },

                Right :
                {
                    Color : { r : 0, g : 0, b : 0, Auto : true },
                    Space : 0,
                    Size  : 0,
                    Value : border_None
                },

                Between :
                {
                    Color : { r : 0, g : 0, b : 0, Auto : true },
                    Space : 0,
                    Size  : 0,
                    Value : border_None
                }
            }
        };

        var TextPr =
        {
            Color : { r : 0x40, g : 0x40, b : 0x40 }
        };

        var TableBorder1 =
        {
            Color : { r : TableBorder.r, g : TableBorder.g, b : TableBorder.b },
            Value : border_Single,
            Size  : 0.5 * g_dKoef_pt_to_mm,
            Space : 0
        };

        var TablePr =
        {
            TableStyleColBandSize : 1,
            TableStyleRowBandSize : 1,
            TableInd : 0,

            TableCellMar :
            {
                Top    : new CTableMeasurement(tblwidth_Mm, 4.8 * g_dKoef_pt_to_mm),
                Left   : new CTableMeasurement(tblwidth_Mm, 8.5 * g_dKoef_pt_to_mm),
                Bottom : new CTableMeasurement(tblwidth_Mm, 4.8 * g_dKoef_pt_to_mm),
                Right  : new CTableMeasurement(tblwidth_Mm, 8.5 * g_dKoef_pt_to_mm)
            },

            TableBorders :
            {
                Top     : TableBorder1,
                Left    : TableBorder1,
                Bottom  : TableBorder1,
                Right   : TableBorder1,
                InsideH : TableBorder1,
                InsideV : TableBorder1
            }
        };

        var TableFirstRow =
        {
            TextPr      : TextPr1,
            TableCellPr : TableCellPr1
        };

        var TableLastRow =
        {
            TextPr      : TextPr1,
            TableCellPr : TableCellPr1
        };

        var TableFirstCol =
        {
            TextPr      : TextPr1,
            TableCellPr : TableCellPr1
        };

        var TableLastCol =
        {
            TextPr      : TextPr1,
            TableCellPr : TableCellPr1
        };

        var TableBand1Vert =
        {
            TextPr : TextPr2
        };

        var TableBand2Vert =
        {
            TextPr      : TextPr2,
            TableCellPr : TableCellPrVert
        };

        var TableBand1Horz =
        {
            TextPr : TextPr2
        };

        var TableBand2Horz =
        {
            TextPr      : TextPr2,
            TableCellPr : TableCellPrHorz
        };

        this.Set_UiPriority(99);
        this.Set_ParaPr(ParaPr);
        this.Set_TextPr(TextPr);
        this.Set_TablePr(TablePr);
        this.Set_TableFirstRow(TableFirstRow);
        this.Set_TableLastRow(TableLastRow);
        this.Set_TableFirstCol(TableFirstCol);
        this.Set_TableLastCol(TableLastCol);
        this.Set_TableBand1Horz(TableBand1Horz);
        this.Set_TableBand1Vert(TableBand1Vert);
        this.Set_TableBand2Horz(TableBand2Horz);
        this.Set_TableBand2Vert(TableBand2Vert);
    },

    Create_Character_Hyperlink : function()
    {
        var TextPr =
        {
            Color     : { r : 0x00, g : 0x00, b : 0xFF },
            Underline : true,
            Unifill   : AscFormat.CreateUniFillSchemeColorWidthTint(11, 0)
        };

        this.Set_UiPriority( 99 );
        this.Set_UnhideWhenUsed( true );
        this.Set_TextPr( TextPr );
    },

    isEqual: function(cStyles)
    {
        var result = false;
        if(this.BasedOn == cStyles.BasedOn && this.Name == cStyles.Name && this.Next == cStyles.Next && this.Type == cStyles.Type && this.hidden == cStyles.hidden)
        {
            if(this.qFormat == cStyles.qFormat && this.semiHidden == cStyles.semiHidden && this.uiPriority == cStyles.uiPriority && this.unhideWhenUsed == cStyles.unhideWhenUsed)
            {
                var isEqualParaPr = this.ParaPr.isEqual(this.ParaPr, cStyles.ParaPr);
                var isEqualTextPr = this.TextPr.isEqual(this.TextPr, cStyles.TextPr);
                if(isEqualParaPr && isEqualTextPr)
                    result = true;
            }
        }
        return result;
    },

    Is_Equal : function(oStyle)
    {
        if (oStyle.Name != this.Name
            || this.BasedOn !== oStyle.BasedOn
            || this.Next !== oStyle.Next
            || this.Type !== oStyle.Type
            || this.Link !== oStyle.Link
            || this.qFormat !== oStyle.qFormat
            || this.uiPriority !== oStyle.uiPriority
            || this.hidden !== oStyle.hidden
            || this.semiHidden !== oStyle.semiHidden
            || this.unhideWhenUsed !== oStyle.unhideWhenUsed
            || true !== this.TextPr.Is_Equal(oStyle.TextPr)
            || true !== this.ParaPr.Is_Equal(oStyle.ParaPr)
            || (styletype_Table === this.Type
                && (true !== this.TablePr.Is_Equal(oStyle.TablePr)
                    || true !== this.TableRowPr.Is_Equal(oStyle.TableRowPr)
                    || true !== this.TableCellPr.Is_Equal(oStyle.TableCellPr)
                    || true !== IsEqualStyleObjects(this.TableBand1Horz , oStyle.TableBand1Horz )
                    || true !== IsEqualStyleObjects(this.TableBand1Vert , oStyle.TableBand1Vert )
                    || true !== IsEqualStyleObjects(this.TableBand2Horz , oStyle.TableBand2Horz )
                    || true !== IsEqualStyleObjects(this.TableBand2Vert , oStyle.TableBand2Vert )
                    || true !== IsEqualStyleObjects(this.TableFirstCol  , oStyle.TableFirstCol  )
                    || true !== IsEqualStyleObjects(this.TableFirstRow  , oStyle.TableFirstRow  )
                    || true !== IsEqualStyleObjects(this.TableLastCol   , oStyle.TableLastCol   )
                    || true !== IsEqualStyleObjects(this.TableLastRow   , oStyle.TableLastRow   )
                    || true !== IsEqualStyleObjects(this.TableTLCell    , oStyle.TableTLCell    )
                    || true !== IsEqualStyleObjects(this.TableTRCell    , oStyle.TableTRCell    )
                    || true !== IsEqualStyleObjects(this.TableBLCell    , oStyle.TableBLCell    )
                    || true !== IsEqualStyleObjects(this.TableBRCell    , oStyle.TableBRCell    )
                    || true !== IsEqualStyleObjects(this.TableWholeTable, oStyle.TableWholeTable)
                    )
                )
            )
            return false;

        return true;
    },
//-----------------------------------------------------------------------------------
// Undo/Redo функции
//-----------------------------------------------------------------------------------
    Get_SelectionState : function()
    {
    },

    Set_SelectionState : function(State, StateIndex)
    {
    },

    Get_ParentObject_or_DocumentPos : function()
    {
        return { Type : AscDFH.historyitem_recalctype_Inline, Data : 0 };
    },

    Refresh_RecalcData : function(Data)
    {
        var Type = Data.Type;

        var bNeedRecalc = false;

        switch ( Type )
        {
            case AscDFH.historyitem_Style_TextPr          :
            case AscDFH.historyitem_Style_ParaPr          :
            case AscDFH.historyitem_Style_TablePr         :
            case AscDFH.historyitem_Style_TableRowPr      :
            case AscDFH.historyitem_Style_TableCellPr     :
            case AscDFH.historyitem_Style_TableBand1Horz  :
            case AscDFH.historyitem_Style_TableBand1Vert  :
            case AscDFH.historyitem_Style_TableBand2Horz  :
            case AscDFH.historyitem_Style_TableBand2Vert  :
            case AscDFH.historyitem_Style_TableFirstCol   :
            case AscDFH.historyitem_Style_TableFirstRow   :
            case AscDFH.historyitem_Style_TableLastCol    :
            case AscDFH.historyitem_Style_TableLastRow    :
            case AscDFH.historyitem_Style_TableTLCell     :
            case AscDFH.historyitem_Style_TableTRCell     :
            case AscDFH.historyitem_Style_TableBLCell     :
            case AscDFH.historyitem_Style_TableBRCell     :
            case AscDFH.historyitem_Style_TableWholeTable :
            case AscDFH.historyitem_Style_Name            :
            case AscDFH.historyitem_Style_BasedOn         :
            case AscDFH.historyitem_Style_Next            :
            case AscDFH.historyitem_Style_Type            :
            case AscDFH.historyitem_Style_QFormat         :
            case AscDFH.historyitem_Style_UiPriority      :
            case AscDFH.historyitem_Style_Hidden          :
            case AscDFH.historyitem_Style_SemiHidden      :
            case AscDFH.historyitem_Style_UnhideWhenUsed  :
            case AscDFH.historyitem_Style_Link            :
            {
                bNeedRecalc = true;
                break;
            }
        }

        if ( true === bNeedRecalc )
        {
            // Сообщаем родительскому классу, что изменения произошли в элементе с номером this.Index и на странице this.PageNum
            return this.Refresh_RecalcData2();
        }
    },

	Refresh_RecalcData2 : function()
	{
		var oHistory = History;
		if (!oHistory)
			return;

		if (!oHistory.AddChangedStyleToRecalculateData(this.Get_Id(), this))
			return;

		var LogicDocument = editor.WordControl.m_oLogicDocument;
		var Styles        = LogicDocument.Get_Styles();

		var AllParagraphs = [];

		if (this.Id != Styles.Default.Paragraph)
		{
			var AllStylesId = Styles.private_GetAllBasedStylesId(this.Id);
			AllParagraphs   = oHistory.GetAllParagraphsForRecalcData({Style : true, StylesId : AllStylesId});
			LogicDocument.Add_ChangedStyle(AllStylesId);
		}
		else
		{
			AllParagraphs = oHistory.GetAllParagraphsForRecalcData({All : true});
			LogicDocument.Add_ChangedStyle([this.Id]);
		}

		var Count = AllParagraphs.length;
		for (var Index = 0; Index < Count; Index++)
		{
			var Para = AllParagraphs[Index];
			Para.Refresh_RecalcData({Type : AscDFH.historyitem_Paragraph_PStyle});
		}
	},
//-----------------------------------------------------------------------------------
// Функции для совместного редактирования
//-----------------------------------------------------------------------------------
    Write_ToBinary2 : function(Writer)
    {
        Writer.WriteLong(AscDFH.historyitem_type_Style);

        // String   : Id
        // Bool(und) -> Bool(null) -> String : Name
        // Bool(und) -> Bool(null) -> String : BasedOn
        // Bool(und) -> Bool(null) -> String : Next
        // Long : Type
        // Bool(und) -> Bool(null) -> Long : uiPriority
        // Bool(und) -> Bool(null) -> Bool : qFormat
        // Bool(und) -> Bool(null) -> Bool : hidden
        // Bool(und) -> Bool(null) -> Bool : semiHidden
        // Bool(und) -> Bool(null) -> Bool : unhideWhenUsed
        // Variable(CTextPr)      : TextPr
        // Variable(CParaPr)      : ParaPr
        // Variable(CTablePr)     : TablePr
        // Variable(CTableRowPr)  : TableRowPr
        // Variable(CTableCellPr) : TableCellPr
        // Variable(CTableStylePr) : TableBand1Horz
        // Variable(CTableStylePr) : TableBand1Vert
        // Variable(CTableStylePr) : TableBand2Horz
        // Variable(CTableStylePr) : TableBand2Vert
        // Variable(CTableStylePr) : TableFirstCol
        // Variable(CTableStylePr) : TableFirstRow
        // Variable(CTableStylePr) : TableLastCol
        // Variable(CTableStylePr) : TableLastRow
        // Variable(CTableStylePr) : TableTLCell
        // Variable(CTableStylePr) : TableTRCell
        // Variable(CTableStylePr) : TableBLCell
        // Variable(CTableStylePr) : TableBRCell
        // Variable(CTableStylePr) : TableWholeTable

        Writer.WriteString2(this.Id);

        this.private_WriteUndefinedNullString(Writer, this.Name);
        this.private_WriteUndefinedNullString(Writer, this.BasedOn);
        this.private_WriteUndefinedNullString(Writer, this.Next);

        Writer.WriteLong(this.Type);

        this.private_WriterUndefinedNullLong(Writer, this.uiPriority);
        this.private_WriterUndefinedNullBool(Writer, this.qFormat);
        this.private_WriterUndefinedNullBool(Writer, this.hidden);
        this.private_WriterUndefinedNullBool(Writer, this.semiHidden);
        this.private_WriterUndefinedNullBool(Writer, this.unhideWhenUsed);

        this.TextPr.Write_ToBinary(Writer);
        this.ParaPr.Write_ToBinary(Writer);

        this.TablePr.Write_ToBinary(Writer);
        this.TableRowPr.Write_ToBinary(Writer);
        this.TableCellPr.Write_ToBinary(Writer);

        this.TableBand1Horz.Write_ToBinary(Writer);
        this.TableBand1Vert.Write_ToBinary(Writer);
        this.TableBand2Horz.Write_ToBinary(Writer);
        this.TableBand2Vert.Write_ToBinary(Writer);
        this.TableFirstCol.Write_ToBinary(Writer);
        this.TableFirstRow.Write_ToBinary(Writer);
        this.TableLastCol.Write_ToBinary(Writer);
        this.TableLastRow.Write_ToBinary(Writer);
        this.TableTLCell.Write_ToBinary(Writer);
        this.TableTRCell.Write_ToBinary(Writer);
        this.TableBLCell.Write_ToBinary(Writer);
        this.TableBRCell.Write_ToBinary(Writer);
        this.TableWholeTable.Write_ToBinary(Writer);
    },

    private_WriteUndefinedNullString : function(Writer, Value)
    {
        if (undefined === Value)
        {
            Writer.WriteBool(true);
        }
        else
        {
            Writer.WriteBool(false);
            if (null === Value)
            {
                Writer.WriteBool(true);
            }
            else
            {
                Writer.WriteBool(false);
                Writer.WriteString2(Value);
            }
        }
    },

    private_WriterUndefinedNullLong : function(Writer, Value)
    {
        if (undefined === Value)
        {
            Writer.WriteBool(true);
        }
        else
        {
            Writer.WriteBool(false);
            if (null === Value)
            {
                Writer.WriteBool(true);
            }
            else
            {
                Writer.WriteBool(false);
                Writer.WriteLong(Value);
            }
        }
    },

    private_WriterUndefinedNullBool : function(Writer, Value)
    {
        if (undefined === Value)
        {
            Writer.WriteBool(true);
        }
        else
        {
            Writer.WriteBool(false);
            if (null === Value)
            {
                Writer.WriteBool(true);
            }
            else
            {
                Writer.WriteBool(false);
                Writer.WriteBool(Value);
            }
        }
    },

    private_ReadUndefinedNullString : function(Reader)
    {
        if (true === Reader.GetBool())
            return undefined;
        else if (true === Reader.GetBool())
            return null;
        else
            return Reader.GetString2();
    },

    private_ReadUndefinedNullLong : function(Reader)
    {
        if (true === Reader.GetBool())
            return undefined;
        else if (true === Reader.GetBool())
            return null;
        else
            return Reader.GetLong();
    },

    private_ReadUndefinedNullBool : function(Reader)
    {
        if (true === Reader.GetBool())
            return undefined;
        else if (true === Reader.GetBool())
            return null;
        else
            return Reader.GetBool();
    },

    Read_FromBinary2 : function(Reader)
    {
        // String   : Id
        // Bool(und) -> Bool(null) -> String : Name
        // Bool(und) -> Bool(null) -> String : BasedOn
        // Bool(und) -> Bool(null) -> String : Next
        // Long : Type
        // Bool(und) -> Bool(null) -> Long : uiPriority
        // Bool(und) -> Bool(null) -> Bool : qFormat
        // Bool(und) -> Bool(null) -> Bool : hidden
        // Bool(und) -> Bool(null) -> Bool : semiHidden
        // Bool(und) -> Bool(null) -> Bool : unhideWhenUsed
        // Variable(CTextPr)      : TextPr
        // Variable(CParaPr)      : ParaPr
        // Variable(CTablePr)     : TablePr
        // Variable(CTableRowPr)  : TableRowPr
        // Variable(CTableCellPr) : TableCellPr
        // Variable(CTableStylePr) : TableBand1Horz
        // Variable(CTableStylePr) : TableBand1Vert
        // Variable(CTableStylePr) : TableBand2Horz
        // Variable(CTableStylePr) : TableBand2Vert
        // Variable(CTableStylePr) : TableFirstCol
        // Variable(CTableStylePr) : TableFirstRow
        // Variable(CTableStylePr) : TableLastCol
        // Variable(CTableStylePr) : TableLastRow
        // Variable(CTableStylePr) : TableTLCell
        // Variable(CTableStylePr) : TableTRCell
        // Variable(CTableStylePr) : TableBLCell
        // Variable(CTableStylePr) : TableBRCell
        // Variable(CTableStylePr) : TableWholeTable

        this.Id = Reader.GetString2();

        this.Name    = this.private_ReadUndefinedNullString(Reader);
        this.BasedOn = this.private_ReadUndefinedNullString(Reader);
        this.Next    = this.private_ReadUndefinedNullString(Reader);

        this.Type = Reader.GetLong();

        this.uiPriority     = this.private_ReadUndefinedNullLong(Reader);
        this.qFormat        = this.private_ReadUndefinedNullBool(Reader);
        this.hidden         = this.private_ReadUndefinedNullBool(Reader);
        this.semiHidden     = this.private_ReadUndefinedNullBool(Reader);
        this.unhideWhenUsed = this.private_ReadUndefinedNullBool(Reader);

        this.TextPr.Read_FromBinary(Reader);
        this.ParaPr.Read_FromBinary(Reader);

        this.TablePr.Read_FromBinary(Reader);
        this.TableRowPr.Read_FromBinary(Reader);
        this.TableCellPr.Read_FromBinary(Reader);

        this.TableBand1Horz.Read_FromBinary(Reader);
        this.TableBand1Vert.Read_FromBinary(Reader);
        this.TableBand2Horz.Read_FromBinary(Reader);
        this.TableBand2Vert.Read_FromBinary(Reader);
        this.TableFirstCol.Read_FromBinary(Reader);
        this.TableFirstRow.Read_FromBinary(Reader);
        this.TableLastCol.Read_FromBinary(Reader);
        this.TableLastRow.Read_FromBinary(Reader);
        this.TableTLCell.Read_FromBinary(Reader);
        this.TableTRCell.Read_FromBinary(Reader);
        this.TableBLCell.Read_FromBinary(Reader);
        this.TableBRCell.Read_FromBinary(Reader);
        this.TableWholeTable.Read_FromBinary(Reader);
    },

    Load_LinkData : function(LinkData)
    {
        if (true === LinkData.StyleUpdate)
        {
            var LogicDocument = editor.WordControl.m_oLogicDocument;
            if (!LogicDocument)
                return;

            var Styles = LogicDocument.Get_Styles();
            if (!Styles)
                return;

            var AllParagraphs = [];
            if (this.Id != Styles.Default.Paragraph)
            {
                var AllStylesId = Styles.private_GetAllBasedStylesId(this.Id);
                AllParagraphs = LogicDocument.Get_AllParagraphsByStyle(AllStylesId);
                LogicDocument.Add_ChangedStyle(AllStylesId);
            }
            else
            {
                AllParagraphs = LogicDocument.Get_AllParagraphs({All : true});
                LogicDocument.Add_ChangedStyle([this.Id]);
            }

            var Count = AllParagraphs.length;
            for ( var Index = 0; Index < Count; Index++ )
            {
                var Para = AllParagraphs[Index];
                Para.Recalc_CompiledPr();
                Para.Recalc_RunsCompiledPr();
            }
        }
    }
};
CStyle.prototype.CreateFootnoteText = function()
{
	var oParaPr = {
		Spacing : {
			After    : 0,
			Line     : 1,
			LineRule : linerule_Auto
		}
	};

	var oTextPr = {
		FontSize : 10
	};

	this.Set_UiPriority(99);
	this.Set_SemiHidden(true);
	this.Set_UnhideWhenUsed(true);
	this.Set_TextPr(oTextPr);
	this.Set_ParaPr(oParaPr);
};
CStyle.prototype.CreateFootnoteTextChar = function()
{
	var oTextPr = {
		FontSize : 10
	};

	this.Set_UiPriority(99);
	this.Set_SemiHidden(true);
	this.Set_TextPr(oTextPr);
};
CStyle.prototype.CreateFootnoteReference = function()
{
	var oTextPr = {
		VertAlign : AscCommon.vertalign_SuperScript
	};

	this.Set_UiPriority(99);
	this.Set_SemiHidden(true);
	this.Set_UnhideWhenUsed(true);
	this.Set_TextPr(oTextPr);
};

function CStyles(bCreateDefault)
{
    if (bCreateDefault !== false)
    {
        this.Id = AscCommon.g_oIdCounter.Get_NewId();
        this.Lock = new AscCommon.CLock();

		this.Default = {
			ParaPr      : new CParaPr(),
			TextPr      : new CTextPr(),
			TablePr     : new CTablePr(),
			TableRowPr  : new CTableRowPr(),
			TableCellPr : new CTableCellPr(),

			Paragraph         : null,
			Character         : null,
			Numbering         : null,
			Table             : null,
			TableGrid         : null,
			Headings          : [],
			ParaList          : null,
			Header            : null,
			Footer            : null,
			Hyperlink         : null,
			FootnoteText      : null,
			FootnoteTextChar  : null,
			FootnoteReference : null
		};

        // Заполняем значения по умолчанию
        this.Default.ParaPr.Init_Default();
        this.Default.TextPr.Init_Default();
        this.Default.TablePr.Init_Default();
        this.Default.TableRowPr.Init_Default();
        this.Default.TableCellPr.Init_Default();

        this.Style = [];

        // Создадим стандартные стили

        // Дефолтовый стиль для параграфа
        var Style_Para_Def = new CStyle( "Normal", null, null, styletype_Paragraph );
        Style_Para_Def.Create_Default_Paragraph();
        this.Default.Paragraph = this.Add( Style_Para_Def );

        // Дефолтовый стиль для текста
        var Style_Char_Def = new CStyle( "Default Paragraph Font", null, null, styletype_Character );
        Style_Char_Def.Create_Default_Character();
        this.Default.Character = this.Add( Style_Char_Def );

        // Дефолтовый стиль для нумерации в списках
        var Style_Num_Def = new CStyle( "No List", null, null, styletype_Numbering );
        Style_Num_Def.Create_Default_Numbering();
        this.Default.Numbering = this.Add( Style_Num_Def );

        // Создаем стандартные стили для заголовков
        var Style_H1 = new CStyle("Heading 1", this.Default.Paragraph, this.Default.Paragraph, styletype_Paragraph );
        Style_H1.Create_Heading1();
        this.Default.Headings[0] = this.Add( Style_H1 );

        // Создаем стандартные стили для заголовков
        var Style_H2 = new CStyle("Heading 2", this.Default.Paragraph, this.Default.Paragraph, styletype_Paragraph );
        Style_H2.Create_Heading2();
        this.Default.Headings[1] = this.Add( Style_H2 );

        // Создаем стандартные стили для заголовков
        var Style_H3 = new CStyle("Heading 3", this.Default.Paragraph, this.Default.Paragraph, styletype_Paragraph );
        Style_H3.Create_Heading3();
        this.Default.Headings[2] = this.Add( Style_H3 );

        // Создаем стандартные стили для заголовков
        var Style_H4 = new CStyle("Heading 4", this.Default.Paragraph, this.Default.Paragraph, styletype_Paragraph );
        Style_H4.Create_Heading4();
        this.Default.Headings[3] = this.Add( Style_H4 );

        // Создаем стандартные стили для заголовков
        var Style_H5 = new CStyle("Heading 5", this.Default.Paragraph, this.Default.Paragraph, styletype_Paragraph );
        Style_H5.Create_Heading5();
        this.Default.Headings[4] = this.Add( Style_H5 );

        // Создаем стандартные стили для заголовков
        var Style_H6 = new CStyle("Heading 6", this.Default.Paragraph, this.Default.Paragraph, styletype_Paragraph );
        Style_H6.Create_Heading6();
        this.Default.Headings[5] = this.Add( Style_H6 );

        // Создаем стандартные стили для заголовков
        var Style_H7 = new CStyle("Heading 7", this.Default.Paragraph, this.Default.Paragraph, styletype_Paragraph );
        Style_H7.Create_Heading7();
        this.Default.Headings[6] = this.Add( Style_H7 );

        // Создаем стандартные стили для заголовков
        var Style_H8 = new CStyle("Heading 8", this.Default.Paragraph, this.Default.Paragraph, styletype_Paragraph );
        Style_H8.Create_Heading8();
        this.Default.Headings[7] = this.Add( Style_H8 );

        // Создаем стандартные стили для заголовков
        var Style_H9 = new CStyle("Heading 9", this.Default.Paragraph, this.Default.Paragraph, styletype_Paragraph );
        Style_H9.Create_Heading9();
        this.Default.Headings[8] = this.Add( Style_H9 );

        // Создаем стандартный стиль для нумерованных параграфов
        var Style_Para_List = new CStyle("List Paragraph", this.Default.Paragraph, null, styletype_Paragraph );
        Style_Para_List.Create_ListParagraph();
        this.Default.ParaList = this.Add( Style_Para_List );

        // Создаем стандартный стиль для таблиц
        var Style_Table = new CStyle("Normal Table", null, null, styletype_Table );
        Style_Table.Create_NormalTable();
        this.Default.Table = this.Add( Style_Table );

        // Создаем стиль "Без интервала"
        var Style_NoSpacing = new CStyle("No Spacing", this.Default.Paragraph, null, styletype_Paragraph );
        Style_NoSpacing.Create_NoSpacing();
        this.Add( Style_NoSpacing );

        // Создаем стиль "Заголовок"
        var Style_Title = new CStyle("Title", this.Default.Paragraph, this.Default.Paragraph, styletype_Paragraph );
        Style_Title.Create_Title();
        this.Add( Style_Title );

        // Создаем стиль "Подзаголовок"
        var Style_Subtitle = new CStyle("Subtitle", this.Default.Paragraph, this.Default.Paragraph, styletype_Paragraph );
        Style_Subtitle.Create_Subtitle();
        this.Add( Style_Subtitle );

        // Создаем стиль "Цитата"
        var Style_Quote = new CStyle("Quote", this.Default.Paragraph, this.Default.Paragraph, styletype_Paragraph );
        Style_Quote.Create_Quote();
        this.Add( Style_Quote );

        // Создаем стиль "Выделенная цитата"
        var Style_IntenseQuote = new CStyle("Intense Quote", this.Default.Paragraph, this.Default.Paragraph, styletype_Paragraph );
        Style_IntenseQuote.Create_IntenseQuote();
        this.Add( Style_IntenseQuote );

        // Создаем стандартный стиль верхнего колонтитула
        var Style_Header = new CStyle("Header", this.Default.Paragraph, null, styletype_Paragraph );
        Style_Header.Create_Header();
        this.Default.Header = this.Add( Style_Header );

        // Создаем стандартный стиль нижнего колонтитула
        var Style_Footer = new CStyle("Footer", this.Default.Paragraph, null, styletype_Paragraph );
        Style_Footer.Create_Footer();
        this.Default.Footer = this.Add( Style_Footer );

        // Создаем стиль для таблиц, который будет применяться к новым таблицам
        var Style_TableGrid = new CStyle("Table Grid", this.Default.Table, null, styletype_Table );
        Style_TableGrid.Create_TableGrid();
        this.Default.TableGrid = this.Add( Style_TableGrid );

        /*
         // Создаем стандартный стиль для таблиц
         var Style_Table = new CStyle("LightShading", this.Default.Table, null, styletype_Table );
         Style_Table.Create_Table_LightShading();
         this.Add( Style_Table );

         // Создаем стандартный стиль для таблиц
         var Style_Table = new CStyle("ColorfulListAccent6", this.Default.Table, null, styletype_Table );
         Style_Table.Create_Table_ColorfulListAccent6();
         this.Add( Style_Table );
         */

        // Стандартные стили таблиц
        var Style_Table_Lined = new CStyle("Lined", this.Default.Table, null, styletype_Table );
        Style_Table_Lined.Create_Table_Lined(new CDocumentColor(0x7F, 0x7F, 0x7F), new CDocumentColor(0xF2, 0xF2, 0xF2));
        this.Add( Style_Table_Lined );

        var Style_Table_Lined_Accent1 = new CStyle("Lined - Accent 1", this.Default.Table, null, styletype_Table );
        Style_Table_Lined_Accent1.Create_Table_Lined( new CDocumentColor(0x54, 0x8D, 0xD4), new CDocumentColor(0xC6, 0xD9, 0xF1));
        this.Add( Style_Table_Lined_Accent1 );

        var Style_Table_Lined_Accent2 = new CStyle("Lined - Accent 2", this.Default.Table, null, styletype_Table );
        Style_Table_Lined_Accent2.Create_Table_Lined( new CDocumentColor(0xD9, 0x95, 0x94), new CDocumentColor(0xF2, 0xDB, 0xDB));
        this.Add( Style_Table_Lined_Accent2 );

        var Style_Table_Lined_Accent3 = new CStyle("Lined - Accent 3", this.Default.Table, null, styletype_Table );
        Style_Table_Lined_Accent3.Create_Table_Lined( new CDocumentColor(0x9B, 0xB5, 0x59), new CDocumentColor(0xEA, 0xF1, 0xDD));
        this.Add( Style_Table_Lined_Accent3 );

        var Style_Table_Lined_Accent4 = new CStyle("Lined - Accent 4", this.Default.Table, null, styletype_Table );
        Style_Table_Lined_Accent4.Create_Table_Lined( new CDocumentColor(0xB2, 0xA1, 0xC7), new CDocumentColor(0xE5, 0xDF, 0xEC));
        this.Add( Style_Table_Lined_Accent4 );

        var Style_Table_Lined_Accent5 = new CStyle("Lined - Accent 5", this.Default.Table, null, styletype_Table );
        Style_Table_Lined_Accent5.Create_Table_Lined( new CDocumentColor(0x4B, 0xAC, 0xC6), new CDocumentColor(0xDA, 0xEE, 0xF3));
        this.Add( Style_Table_Lined_Accent5 );

        var Style_Table_Lined_Accent6 = new CStyle("Lined - Accent 6", this.Default.Table, null, styletype_Table );
        Style_Table_Lined_Accent6.Create_Table_Lined( new CDocumentColor(0xF7, 0x96, 0x46), new CDocumentColor(0xFD, 0xE9, 0xD9));
        this.Add( Style_Table_Lined_Accent6 );

        var Style_Table_Bordered = new CStyle("Bordered", this.Default.Table, null, styletype_Table );
        Style_Table_Bordered.Create_Table_Bordered( new CDocumentColor(0xD9, 0xD9, 0xD9), new CDocumentColor(0x7F, 0x7F, 0x7F));
        this.Add( Style_Table_Bordered );

        var Style_Table_Bordered_Accent_1 = new CStyle("Bordered - Accent 1", this.Default.Table, null, styletype_Table );
        Style_Table_Bordered_Accent_1.Create_Table_Bordered( new CDocumentColor(0xB8, 0xCC, 0xE4), new CDocumentColor(0x4F, 0x81, 0xBD));
        this.Add( Style_Table_Bordered_Accent_1 );

        var Style_Table_Bordered_Accent_2 = new CStyle("Bordered - Accent 2", this.Default.Table, null, styletype_Table );
        Style_Table_Bordered_Accent_2.Create_Table_Bordered( new CDocumentColor(0xE5, 0xB8, 0xB7), new CDocumentColor(0xD9, 0x95, 0x94));
        this.Add( Style_Table_Bordered_Accent_2 );

        var Style_Table_Bordered_Accent_3 = new CStyle("Bordered - Accent 3", this.Default.Table, null, styletype_Table );
        Style_Table_Bordered_Accent_3.Create_Table_Bordered( new CDocumentColor(0xD6, 0xE3, 0xBC), new CDocumentColor(0xC2, 0xD6, 0x9B));
        this.Add( Style_Table_Bordered_Accent_3 );

        var Style_Table_Bordered_Accent_4 = new CStyle("Bordered - Accent 4", this.Default.Table, null, styletype_Table );
        Style_Table_Bordered_Accent_4.Create_Table_Bordered( new CDocumentColor(0xCC, 0xC0, 0xD9), new CDocumentColor(0xB2, 0xA1, 0xC7));
        this.Add( Style_Table_Bordered_Accent_4 );

        var Style_Table_Bordered_Accent_5 = new CStyle("Bordered - Accent 5", this.Default.Table, null, styletype_Table );
        Style_Table_Bordered_Accent_5.Create_Table_Bordered( new CDocumentColor(0xB6, 0xDD, 0xE8), new CDocumentColor(0x92, 0xCD, 0xDC));
        this.Add( Style_Table_Bordered_Accent_5 );

        var Style_Table_Bordered_Accent_6 = new CStyle("Bordered - Accent 6", this.Default.Table, null, styletype_Table );
        Style_Table_Bordered_Accent_6.Create_Table_Bordered( new CDocumentColor(0xFB, 0xD4, 0xB4), new CDocumentColor(0xFA, 0xBF, 0x8F));
        this.Add( Style_Table_Bordered_Accent_6 );

        var Style_Table_BorderedLined = new CStyle("Bordered & Lined", this.Default.Table, null, styletype_Table );
        Style_Table_BorderedLined.Create_Table_BorderedAndLined(new CDocumentColor(0x59, 0x59, 0x59), new CDocumentColor(0x7F, 0x7F, 0x7F), new CDocumentColor(0xD9, 0xD9, 0xD9), new CDocumentColor(0xF2, 0xF2, 0xF2));
        this.Add( Style_Table_BorderedLined );

        var Style_Table_BorderedLined_Accent1 = new CStyle("Bordered & Lined - Accent 1", this.Default.Table, null, styletype_Table );
        Style_Table_BorderedLined_Accent1.Create_Table_BorderedAndLined(new CDocumentColor(0x1F, 0x49, 0x7D), new CDocumentColor(0x54, 0x8D, 0xD4), new CDocumentColor(0xC6, 0xD9, 0xF1), new CDocumentColor(0xC6, 0xD9, 0xF1));
        this.Add( Style_Table_BorderedLined_Accent1 );

        var Style_Table_BorderedLined_Accent2 = new CStyle("Bordered & Lined - Accent 2", this.Default.Table, null, styletype_Table );
        Style_Table_BorderedLined_Accent2.Create_Table_BorderedAndLined( new CDocumentColor(0xC0, 0x50, 0x4D), new CDocumentColor(0xD9, 0x95, 0x94), new CDocumentColor(0xF2, 0xDB, 0xDB), new CDocumentColor(0xF2, 0xDB, 0xDB));
        this.Add( Style_Table_BorderedLined_Accent2 );

        var Style_Table_BorderedLined_Accent3 = new CStyle("Bordered & Lined - Accent 3", this.Default.Table, null, styletype_Table );
        Style_Table_BorderedLined_Accent3.Create_Table_BorderedAndLined( new CDocumentColor(0x76, 0x92, 0x3C), new CDocumentColor(0x9B, 0xBB, 0x59), new CDocumentColor(0xEA, 0xF1, 0xDD), new CDocumentColor(0xEA, 0xF1, 0xDD));
        this.Add( Style_Table_BorderedLined_Accent3 );

        var Style_Table_BorderedLined_Accent4 = new CStyle("Bordered & Lined - Accent 4", this.Default.Table, null, styletype_Table );
        Style_Table_BorderedLined_Accent4.Create_Table_BorderedAndLined( new CDocumentColor(0x80, 0x64, 0xA2), new CDocumentColor(0xB2, 0xA1, 0xC7), new CDocumentColor(0xE5, 0xDF, 0xEC), new CDocumentColor(0xE5, 0xDF, 0xEC));
        this.Add( Style_Table_BorderedLined_Accent4 );

        var Style_Table_BorderedLined_Accent5 = new CStyle("Bordered & Lined - Accent 5", this.Default.Table, null, styletype_Table );
        Style_Table_BorderedLined_Accent5.Create_Table_BorderedAndLined( new CDocumentColor(0x31, 0x84, 0x9B), new CDocumentColor(0x4B, 0xAC, 0xC6), new CDocumentColor(0xDA, 0xEE, 0xF3), new CDocumentColor(0xDA, 0xEE, 0xF3));
        this.Add( Style_Table_BorderedLined_Accent5 );

        var Style_Table_BorderedLined_Accent6 = new CStyle("Bordered & Lined - Accent 6", this.Default.Table, null, styletype_Table );
        Style_Table_BorderedLined_Accent6.Create_Table_BorderedAndLined( new CDocumentColor(0xE3, 0x6C, 0x0A), new CDocumentColor(0xF7, 0x96, 0x46), new CDocumentColor(0xFD, 0xE9, 0xD9), new CDocumentColor(0xFD, 0xE9, 0xD9));
        this.Add( Style_Table_BorderedLined_Accent6 );

        // Создаем стиль гиперссылки
        var Style_Hyperlink = new CStyle("Hyperlink", null, null, styletype_Character );
        Style_Hyperlink.Create_Character_Hyperlink();
        this.Default.Hyperlink = this.Add( Style_Hyperlink );

		// Создаем стили для сносок
		var StyleFootnoteText = new CStyle("footnote text", this.Default.Paragraph, null, styletype_Paragraph);
		StyleFootnoteText.CreateFootnoteText();
		this.Default.FootnoteText = this.Add(StyleFootnoteText);

		var StyleFootnoteTextChar = new CStyle("Footnote Text Char", this.Default.Character, null, styletype_Character);
		StyleFootnoteTextChar.CreateFootnoteTextChar();
		this.Default.FootnoteTextChar = this.Add(StyleFootnoteTextChar);

		StyleFootnoteTextChar.Set_Link(StyleFootnoteText.GetId());
		StyleFootnoteText.Set_Link(StyleFootnoteTextChar.GetId());

		var StyleFootnoteReference = new CStyle("footnote reference", this.Default.Character, null, styletype_Character);
		StyleFootnoteReference.CreateFootnoteReference();
		this.Default.FootnoteReference = this.Add(StyleFootnoteReference);

        // Добавляем данный класс в таблицу Id (обязательно в конце конструктора)
        g_oTableId.Add( this, this.Id );
    }
	else
	{
		this.Default = {
			ParaPr      : new CParaPr(),
			TextPr      : new CTextPr(),
			TablePr     : new CTablePr(),
			TableRowPr  : new CTableRowPr(),
			TableCellPr : new CTableCellPr(),

			Paragraph         : null,
			Character         : null,
			Numbering         : null,
			Table             : null,
			TableGrid         : null,
			Headings          : [],
			ParaList          : null,
			Header            : null,
			Footer            : null,
			Hyperlink         : null,
			FootnoteText      : null,
			FootnoteTextChar  : null,
			FootnoteReference : null
		};

		// Заполняем значения по умолчанию
		this.Default.ParaPr.Init_Default();
		this.Default.TextPr.Init_Default();
		this.Default.TablePr.Init_Default();
		this.Default.TableRowPr.Init_Default();
		this.Default.TableCellPr.Init_Default();

		this.Style = [];
	}

    this.LogicDocument = null;
}

CStyles.prototype =
{
//-----------------------------------------------------------------------------------
// Работаем с Id данного объекта
//-----------------------------------------------------------------------------------
    GetId : function()
    {
        return this.Id;
    },

    Get_Id : function()
    {
        return this.GetId();
    },
//-----------------------------------------------------------------------------------
// Базовые функции для работы со стилем
//-----------------------------------------------------------------------------------
	Add : function(Style)
	{
		var Id = Style.Get_Id();
		History.Add(new CChangesStylesAdd(this, Id, Style));
		this.Style[Id] = Style;
		this.Update_Interface(Id);
		return Id;
	},

	Remove : function(Id)
	{
		History.Add(new CChangesStylesRemove(this, Id, this.Style[Id]));
		delete this.Style[Id];
		this.Update_Interface(Id);
	},

	SetDefaultParagraph : function(Id)
	{
		if (Id !== this.Default.Paragraph)
		{
			History.Add(new CChangesStylesChangeDefaultParagraphId(this, this.Default.Paragraph, Id));
			this.Default.Paragraph = Id;
		}
	},

	SetDefaultCharacter : function(Id)
	{
		if (Id !== this.Default.Character)
		{
			History.Add(new CChangesStylesChangeDefaultCharacterId(this, this.Default.Character, Id));
			this.Default.Character = Id;
		}
	},

	SetDefaultNumbering : function(Id)
	{
		if (Id !== this.Default.Numbering)
		{
			History.Add(new CChangesStylesChangeDefaultNumberingId(this, this.Default.Numbering, Id));
			this.Default.Numbering = Id;
		}
	},

	SetDefaultTable : function(Id)
	{
		if (Id !== this.Default.Table)
		{
			History.Add(new CChangesStylesChangeDefaultTableId(this, this.Default.Table, Id));
			this.Default.Table = Id;
		}
	},

	SetDefaultTableGrid : function(Id)
	{
		if (Id !== this.Default.TableGrid)
		{
			History.Add(new CChangesStylesChangeDefaultTableGridId(this, this.Default.TableGrid, Id));
			this.Default.TableGrid = Id;
		}
	},

	SetDefaultParaList : function(Id)
	{
		if (Id !== this.Default.ParaList)
		{
			History.Add(new CChangesStylesChangeDefaultParaListId(this, this.Default.ParaList, Id));
			this.Default.ParaList = Id;
		}
	},

	SetDefaultHeader : function(Id)
	{
		if (Id !== this.Default.Header)
		{
			History.Add(new CChangesStylesChangeDefaultHeaderId(this, this.Default.Header, Id));
			this.Default.Header = Id;
		}
	},

	SetDefaultFooter : function(Id)
	{
		if (Id !== this.Default.Footer)
		{
			History.Add(new CChangesStylesChangeDefaultFooterId(this, this.Default.Footer, Id));
			this.Default.Footer = Id;
		}
	},
	
	SetDefaultHyperlink : function(Id)
	{
		if (Id !== this.Default.Hyperlink)
		{
			History.Add(new CChangesStylesChangeDefaultHyperlinkId(this, this.Default.Hyperlink, Id));
			this.Default.Hyperlink = Id;
		}
	},

	SetDefaultFootnoteText : function(Id)
	{
		if (Id !== this.Default.FootnoteText)
		{
			History.Add(new CChangesStylesChangeDefaultFootnoteTextId(this, this.Default.FootnoteText, Id));
			this.Default.FootnoteText = Id;
		}
	},

	SetDefaultFootnoteTextChar : function(Id)
	{
		if (Id !== this.Default.FootnoteTextChar)
		{
			History.Add(new CChangesStylesChangeDefaultFootnoteTextCharId(this, this.Default.FootnoteTextChar, Id));
			this.Default.FootnoteTextChar = Id;
		}
	},

	SetDefaultFootnoteReference : function(Id)
	{
		if (Id !== this.Default.FootnoteReference)
		{
			History.Add(new CChangesStylesChangeDefaultFootnoteReferenceId(this, this.Default.FootnoteReference, Id));
			this.Default.FootnoteReference = Id;
		}
	},

	SetDefaultHeading : function(Id, Lvl)
	{
		if (Id !== this.Default.Headings[Lvl])
		{
			History.Add(new CChangesStylesChangeDefaultHeadingsId(this, this.Default.Headings[Lvl], Id, Lvl));
			this.Default.Headings[Lvl] = Id;
		}
	},

	RemapIdReferences : function(OldId, NewId)
	{
		if (OldId === this.Default.Paragraph)
			this.SetDefaultParagraph(NewId);

		if (OldId === this.Default.Character)
			this.SetDefaultCharacter(NewId);

		if (OldId === this.Default.Numbering)
			this.SetDefaultNumbering(NewId);

		if (OldId === this.Default.Table)
			this.SetDefaultTable(NewId);

		if (OldId === this.Default.TableGrid)
			this.SetDefaultTableGrid(NewId);

		if (OldId === this.Default.ParaList)
			this.SetDefaultParaList(NewId);

		if (OldId === this.Default.Header)
			this.SetDefaultHeader(NewId);

		if (OldId === this.Default.Footer)
			this.SetDefaultFooter(NewId);

		if (OldId === this.Default.Hyperlink)
			this.SetDefaultHyperlink(NewId);

		if (OldId === this.Default.FootnoteText)
			this.SetDefaultFootnoteText(NewId);

		if (OldId === this.Default.FootnoteTextChar)
			this.SetDefaultFootnoteTextChar(NewId);

		if (OldId === this.Default.FootnoteReference)
			this.SetDefaultFootnoteReference(NewId);

		for (var nIndex = 0, nCount = this.Default.Headings.length; nIndex < nCount; ++nIndex)
		{
			if (OldId === this.Default.Headings[nIndex])
				this.SetDefaultHeading(NewId, nIndex);
		}

		for (var Id in this.Style)
		{
			this.Style[Id].RemapIdReferences(OldId, NewId);
		}
	},

    Copy : function()
    {
        var Styles = new CStyles();

        Styles.Default.ParaPr      = this.Default.ParaPr.Copy();
        Styles.Default.TextPr      = this.Default.TextPr.Copy();
        Styles.Default.TablePr     = this.Default.TablePr.Copy();
        Styles.Default.TableRowPr  = this.Default.TableRowPr.Copy();
        Styles.Default.TableCellPr = this.Default.TableCellPr.Copy();

        // Тут можно копировать напрямую, т.к. это либо null, либо StyleId, который мы повторяем
        Styles.Default.Paragraph   = this.Default.Paragraph;
        Styles.Default.Character   = this.Default.Character;
        Styles.Default.Numbering   = this.Default.Numbering;
        Styles.Default.Table       = this.Default.Table    ;
        Styles.Default.TableGrid   = this.Default.TableGrid;
        Styles.Default.ParaList    = this.Default.ParaList ;
        Styles.Default.Header      = this.Default.Header   ;
        Styles.Default.Footer      = this.Default.Footer   ;
        Styles.Default.Hyperlink   = this.Default.Hyperlink;

        for (var Index = 0, Count = this.Default.Headings.length; Index < Count; Index++)
        {
            Styles.Default.Headings[Index] = this.Default.Headings[Index];
        }

        for (var StyleId in this.Style)
        {
            Styles.Style[StyleId] = this.Style[StyleId].Copy();
        }

        return Styles;
    },
    
    CopyStyle : function()
    {
        var res = [];
        for (var StyleId in this.Style)
        {
            res[StyleId] = this.Style[StyleId].Copy();
        }
        return res;
    },

    Get_DefaultParaPr : function()
    {
        return this.Default.ParaPr;
    },

	Set_DefaultParaPr : function(ParaPr)
	{
		History.Add(new CChangesStylesChangeDefaultParaPr(this, this.Default.ParaPr, ParaPr));
		this.Default.ParaPr.Init_Default();
		this.Default.ParaPr.Merge(ParaPr);

		// TODO: Пока данная функция используется только в билдере, как только будет использоваться в самом редакторе,
		//       надо будет сделать, чтобы происходил пересчет всех стилей.
	},

    Get_DefaultTextPr : function()
    {
        return this.Default.TextPr;
    },

	Set_DefaultTextPr : function(TextPr)
	{
		History.Add(new CChangesStylesChangeDefaultTextPr(this, this.Default.TextPr, TextPr));
        this.Default.TextPr.Init_Default();
		this.Default.TextPr.Merge(TextPr);

		// TODO: Пока данная функция используется только в билдере, как только будет использоваться в самом редакторе,
		//       надо будет сделать, чтобы происходил пересчет всех стилей.
	},
//-----------------------------------------------------------------------------------
//
//-----------------------------------------------------------------------------------
    Set_LogicDocument : function(LogicDocument)
    {
        this.LogicDocument = LogicDocument;
    },

    Get_Pr : function(StyleId, Type, TableStyle, ShapeStyle)
    {
        var Pr = {TextPr : new CTextPr(), ParaPr : new CParaPr()};
        // Сначала копируем параметры заданные в табличном стиле
        switch (Type)
        {
            case styletype_Paragraph:
            {
                if (undefined === StyleId)
                    StyleId = this.Default.Paragraph;

                if (TableStyle != null || ShapeStyle != null)
                {
                    if (TableStyle != null)
                    {
                        Pr.TextPr.Merge(TableStyle.TextPr);
                        Pr.ParaPr.Merge(TableStyle.ParaPr);
                    }
                    if (ShapeStyle != null)
                    {
                        Pr.TextPr.Merge(ShapeStyle.TextPr);
                        if(!TableStyle)
                        {
                            Pr.ParaPr.Merge(ShapeStyle.ParaPr);
                        }

                    }
                }
                else
                {
                    Pr.TextPr.Merge(this.Default.TextPr);
                    Pr.ParaPr.Merge(this.Default.ParaPr);
                }
                break;
            }
            case styletype_Table:
            {
                if (undefined === StyleId)
                    StyleId = this.Default.Table;

                // Сначала копируем параметры по умолчанию
                Pr.TextPr = this.Default.TextPr.Copy();
                Pr.ParaPr = this.Default.ParaPr.Copy();

                // В таблицах мы не учитываем настройки дефолтового параграфа, т.е. стиля Normal (баг 31469)

                Pr.TablePr     = this.Default.TablePr.Copy();
                Pr.TableRowPr  = this.Default.TableRowPr.Copy();
                Pr.TableCellPr = this.Default.TableCellPr.Copy();

                Pr.TableFirstCol   = new CTableStylePr();
                Pr.TableFirstRow   = new CTableStylePr();
                Pr.TableLastCol    = new CTableStylePr();
                Pr.TableLastRow    = new CTableStylePr();
                Pr.TableBand1Horz  = new CTableStylePr();
                Pr.TableBand1Vert  = new CTableStylePr();
                Pr.TableBand2Horz  = new CTableStylePr();
                Pr.TableBand2Vert  = new CTableStylePr();
                Pr.TableTLCell     = new CTableStylePr();
                Pr.TableTRCell     = new CTableStylePr();
                Pr.TableBLCell     = new CTableStylePr();
                Pr.TableBRCell     = new CTableStylePr();
                Pr.TableWholeTable = new CTableStylePr();

                break;
            }
            case styletype_Character:
            {
                if (undefined === StyleId)
                    StyleId = this.Default.Character;

                Pr.TextPr = new CTextPr();
                break;
            }
        }

        // Рассчитываем стиль
        this.Internal_Get_Pr(Pr, StyleId, Type, ( null === TableStyle && null == ShapeStyle ? true : false ), [], StyleId);

        if (styletype_Table === Type)
        {
            // В таблицах мы не учитываем настройки дефолтового параграфа, т.е. стиля Normal (баг 31469)

            // Соединим настройки для всей таблицы в одну общую настройку и удалим одну из них за ненадобностью
            Pr.ParaPr.Merge(Pr.TableWholeTable.ParaPr);
            Pr.TextPr.Merge(Pr.TableWholeTable.TextPr);
            Pr.TablePr.Merge(Pr.TableWholeTable.TablePr);
            Pr.TableRowPr.Merge(Pr.TableWholeTable.TableRowPr);
            Pr.TableCellPr.Merge(Pr.TableWholeTable.TableCellPr);
        }

        return Pr;
    },

    Get_Next : function(StyleId)
    {
        var NextId = this.Style[StyleId].Next;

        if (null !== NextId && undefined !== this.Style[NextId])
            return NextId;

        return null;
    },

    Get_Name : function(StyleId)
    {
        if ( undefined != this.Style[StyleId] )
            return this.Style[StyleId].Name;

        return "";
    },

    Get : function(StyleId)
    {
        if (undefined != this.Style[StyleId])
            return this.Style[StyleId];

        return null;
    },

    Get_Default_Paragraph : function()
    {
        return this.Default.Paragraph;
    },

    Get_Default_Character : function()
    {
        return this.Default.Character;
    },

    Get_Default_Numbering : function()
    {
        return this.Default.Numbering;
    },

    Get_Default_Table : function()
    {
        return this.Default.Table;
    },

    Get_Default_TableGrid : function()
    {
        return this.Default.TableGrid;
    },

    Get_Default_Heading : function(Lvl)
    {
        Lvl = Math.max( Math.min( Lvl, 8 ), 0 );
        return this.Default.Headings[Lvl];
    },

    Get_Default_ParaList : function()
    {
        return this.Default.ParaList;
    },

    Get_Default_Header : function()
    {
        return this.Default.Header;
    },

    Get_Default_Footer : function()
    {
        return this.Default.Footer;
    },

    Get_Default_Hyperlink : function()
    {
        return this.Default.Hyperlink;
    },

    Get_StyleIdByName : function (Name, bUseDefault)
    {
        for ( var Id in this.Style )
        {
            var Style = this.Style[Id];
            if ( Style.Name === Name )
                return Id;
        }

        if (false !== bUseDefault)
            return this.Default.Paragraph;

        return null;
    },

    Internal_Get_Pr : function(Pr, StyleId, Type, bUseDefault, PassedStyles, StartStyleId)
    {
        // Делаем проверку от зацикливания, среди уже пройденных стилей ищем текущий стриль.
        for (var nIndex = 0, nCount = PassedStyles.length; nIndex < nCount; nIndex++)
        {
            if (PassedStyles[nIndex] == StyleId)
                return;
        }
        PassedStyles.push(StyleId);

        var Style = this.Style[StyleId];
        if ( undefined == StyleId || undefined === Style )
        {
            if ( true === bUseDefault )
            {
                // Копируем свойства по умолчанию для данного типа
                switch ( Type )
                {
                    case styletype_Paragraph:
                    {
                        var DefId = this.Default.Paragraph;

                        if (undefined != this.Style[DefId])
                        {
                            Pr.ParaPr.Merge(this.Style[DefId].ParaPr);
                            Pr.TextPr.Merge(this.Style[DefId].TextPr);
                        }

                        break;
                    }
                    case styletype_Numbering:
                    {
                        var DefId = this.Default.Numbering;
                        break;
                    }
                    case styletype_Table:
                    {
                        var DefId = this.Default.Table;

                        if (undefined != this.Style[DefId])
                        {
                            Pr.ParaPr.Merge(this.Style[DefId].ParaPr);
                            Pr.TextPr.Merge(this.Style[DefId].TextPr);
                            Pr.TablePr.Merge(this.Styles[DefId].TablePr);
                            Pr.TableRowPr.Merge(this.Styles[DefId].TableRowPr);
                            Pr.TableCellPr.Merge(this.Styles[DefId].TableCellPr);
                        }

                        break;
                    }
                    case styletype_Character:
                    {
                        var DefId = this.Default.Character;

                        if (undefined != this.Style[DefId])
                        {
                            Pr.TextPr.Merge(this.Style[DefId].TextPr);
                        }

                        break;
                    }
                }
            }

            return;
        }

        if ( null === Style.BasedOn )
        {
            // TODO: Проверить нужно ли копировать стили по умолчанию для данного типа стиля, когда сам стиль задан
            //       Для параграфа, вроде как не нужно (см. ivanova_veronica.docx стиль "Colon")
            
            // Копируем свойства по умолчанию для данного типа
            if ( true === bUseDefault )
            {
                // Копируем свойства по умолчанию для данного типа
                switch ( Type )
                {
                    case styletype_Paragraph:
                    {
//                        var DefId = this.Default.Paragraph;
//
//                        Pr.ParaPr.Merge( this.Style[DefId].ParaPr );
//                        Pr.TextPr.Merge( this.Style[DefId].TextPr );

                        break;
                    }
                    case styletype_Numbering:
                    {
                        var DefId = this.Default.Numbering;
                        break;
                    }
                    case styletype_Table:
                    {
                        var DefId = this.Default.Table;

                        /*
                        Pr.ParaPr.Merge( this.Style[DefId].ParaPr );
                        Pr.TextPr.Merge( this.Style[DefId].TextPr );
                        Pr.TablePr.Merge( this.Styles[DefId].TablePr );
                        Pr.TableRowPr.Merge( this.Styles[DefId].TableRowPr );
                        Pr.TableCellPr.Merge( this.Styles[DefId].TableCellPr );
                        */

                        break;
                    }
                    case styletype_Character:
                    {
                        var DefId = this.Default.Character;

                        if (undefined != this.Style[DefId])
                        {
                            Pr.TextPr.Merge(this.Style[DefId].TextPr);
                        }

                        break;
                    }
                }
            }

            // Копируем свойства текущего стиля
            switch ( Type )
            {
                case styletype_Paragraph:
                {
                    Pr.ParaPr.Merge( Style.ParaPr );
                    Pr.TextPr.Merge( Style.TextPr );

                    break;
                }
                case styletype_Numbering:
                {
                    break;
                }
                case styletype_Table:
                {
                    Pr.ParaPr.Merge( Style.ParaPr );
                    Pr.TextPr.Merge( Style.TextPr );

                    // Заглушка на случай, если в табличные стили начнут объединять с не табличными стилями
                    if ( undefined != Style.TablePr )
                    {
                        Pr.TablePr.Merge(     Style.TablePr );
                        Pr.TableRowPr.Merge(  Style.TableRowPr );
                        Pr.TableCellPr.Merge( Style.TableCellPr );

                        Pr.TableBand1Horz.Merge(  Style.TableBand1Horz  );
                        Pr.TableBand1Vert.Merge(  Style.TableBand1Vert  );
                        Pr.TableBand2Horz.Merge(  Style.TableBand2Horz  );
                        Pr.TableBand2Vert.Merge(  Style.TableBand2Vert  );
                        Pr.TableFirstCol.Merge(   Style.TableFirstCol   );
                        Pr.TableFirstRow.Merge(   Style.TableFirstRow   );
                        Pr.TableLastCol.Merge(    Style.TableLastCol    );
                        Pr.TableLastRow.Merge(    Style.TableLastRow    );
                        Pr.TableTLCell.Merge(     Style.TableTLCell     );
                        Pr.TableTRCell.Merge(     Style.TableTRCell     );
                        Pr.TableBLCell.Merge(     Style.TableBLCell     );
                        Pr.TableBRCell.Merge(     Style.TableBRCell     );
                        Pr.TableWholeTable.Merge( Style.TableWholeTable );
                    }

                    break;
                }
                case styletype_Character:
                {
                    Pr.TextPr.Merge( Style.TextPr );

                    break;
                }
            }
        }
        else
        {
            // Копируем свойства родительского стиля
			this.Internal_Get_Pr(Pr, Style.BasedOn, Type, false, PassedStyles, StartStyleId);

            // Копируем свойства из стиля нумерации, если она задана, но только для самого стиля, а не для базовых
			if ((styletype_Paragraph === Type || styletype_Table === Type) && ( undefined != Style.ParaPr.NumPr ) && StyleId === StartStyleId)
			{
				var Numbering = editor.WordControl.m_oLogicDocument.Get_Numbering();
				if (undefined != Style.ParaPr.NumPr.NumId && 0 != Style.ParaPr.NumPr.NumId)
				{
					var AbstractNum = Numbering.Get_AbstractNum(Style.ParaPr.NumPr.NumId);
					var Lvl         = AbstractNum.Get_LvlByStyle(StyleId);
					if (-1 != Lvl)
						Pr.ParaPr.Merge(Numbering.Get_ParaPr(Style.ParaPr.NumPr.NumId, Lvl));
					else
						Pr.ParaPr.NumPr = undefined;
				}
			}

            // Копируем свойства текущего стиля
            switch ( Type )
            {
                case styletype_Paragraph:
                {
                    Pr.ParaPr.Merge( Style.ParaPr );
                    Pr.TextPr.Merge( Style.TextPr );

                    break;
                }
                case styletype_Numbering:
                {
                    break;
                }
                case styletype_Table:
                {
                    Pr.ParaPr.Merge( Style.ParaPr );
                    Pr.TextPr.Merge( Style.TextPr );

                    if ( undefined != Style.TablePr )
                    {
                        Pr.TablePr.Merge(     Style.TablePr );
                        Pr.TableRowPr.Merge(  Style.TableRowPr );
                        Pr.TableCellPr.Merge( Style.TableCellPr );

                        Pr.TableBand1Horz.Merge(  Style.TableBand1Horz  );
                        Pr.TableBand1Vert.Merge(  Style.TableBand1Vert  );
                        Pr.TableBand2Horz.Merge(  Style.TableBand2Horz  );
                        Pr.TableBand2Vert.Merge(  Style.TableBand2Vert  );
                        Pr.TableFirstCol.Merge(   Style.TableFirstCol   );
                        Pr.TableFirstRow.Merge(   Style.TableFirstRow   );
                        Pr.TableLastCol.Merge(    Style.TableLastCol    );
                        Pr.TableLastRow.Merge(    Style.TableLastRow    );
                        Pr.TableTLCell.Merge(     Style.TableTLCell     );
                        Pr.TableTRCell.Merge(     Style.TableTRCell     );
                        Pr.TableBLCell.Merge(     Style.TableBLCell     );
                        Pr.TableBRCell.Merge(     Style.TableBRCell     );
                        Pr.TableWholeTable.Merge( Style.TableWholeTable );
                    }

                    break;
                }
                case styletype_Character:
                {
                    Pr.TextPr.Merge( Style.TextPr );

                    break;
                }
            }
        }
    },

    Document_Get_AllFontNames : function(AllFonts)
    {
        for ( var Id in this.Style )
        {
            var Style = this.Style[Id];
            Style.Document_Get_AllFontNames(AllFonts);
        }

        this.Default.TextPr.Document_Get_AllFontNames(AllFonts);
    },

    Get_AllTableStyles : function()
    {
        var TableStyles = [];
        for ( var Id in this.Style )
        {
            var Style = this.Style[Id];
            if ( styletype_Table === Style.Type )
                TableStyles.push( Id );
        }

        return TableStyles;
    },

    Update_Interface : function(StyleId)
    {
        if (null != this.LogicDocument && undefined !== this.LogicDocument)
        {
            // Данный стиль может быть базовым для других стилей, поэтому нам нужно пересчитать все параграфы, не только у
            // которых выставлен данный стиль, но и у которых выставлен стиль, для которого данный будет базовым (в любом поколении).

            this.LogicDocument.Add_ChangedStyle(this.private_GetAllBasedStylesId(StyleId));
        }
    },

    private_GetAllBasedStylesId : function(StyleId)
    {
        var arrStyles = [];

        // Отдельно добавляем StyleId, т.к. данная функция вызывается и после удаления стиля из списка,
        // но при этом в данный массив стиль должен попасть.
        arrStyles.push(StyleId);

        for (var CurStyleId in this.Style)
        {
            if (CurStyleId == StyleId)
            {
                arrStyles.push(StyleId);
            }

            var oStyle = this.Style[CurStyleId];
            var BaseId = oStyle.Get_BasedOn();
            var PassedStyles = [];
            while (null != BaseId && undefined != BaseId)
            {
                var bBreak = false;
                // Делаем проверку от зацикливания, среди уже пройденных стилей ищем текущий стриль.
                for (var nIndex = 0, nCount = PassedStyles.length; nIndex < nCount; nIndex++)
                {
                    if (PassedStyles[nIndex] == BaseId)
                    {
                        bBreak = true;
                        break;
                    }
                }

                if (true === bBreak)
                    break;

                PassedStyles.push(BaseId);

                if (BaseId == StyleId)
                {
                    arrStyles.push(CurStyleId);
                    break;
                }

                var BaseStyle = this.Style[BaseId];
                if (!BaseStyle)
                    break;

                BaseId = BaseStyle.Get_BasedOn();
            }
        }

        return arrStyles;
    },

    Check_StyleNumberingOnLoad : function(Numbering)
    {
        // TODO: Похоже Word сначала пробегается по дефолтовым стилям, типа Heading, потом по остальным.
        for (var StyleId in this.Style)
        {
            var Style = this.Style[StyleId];

            var NumPr = Style.ParaPr.NumPr;
            if (!NumPr || !NumPr.NumId)
                continue;

            var AbstractNum = Numbering.Get_AbstractNum(NumPr.NumId);
            if (!AbstractNum)
                continue;

            var iLvl = (NumPr.Lvl ? NumPr.Lvl : 0);
            var NumLvl = AbstractNum.Get_Lvl(iLvl);

            if (!NumLvl || NumLvl.PStyle)
                continue;

            var NewLvl = AbstractNum.Internal_CopyLvl(NumLvl);
            NewLvl.PStyle = StyleId;
            AbstractNum.Set_Lvl(iLvl, NewLvl);
        }
    },
//-----------------------------------------------------------------------------------
// Undo/Redo функции
//-----------------------------------------------------------------------------------
    Get_SelectionState : function()
    {
    },

    Set_SelectionState : function(State, StateIndex)
    {
    },

    Get_ParentObject_or_DocumentPos : function()
    {
        return { Type : AscDFH.historyitem_recalctype_Inline, Data : 0 };
    },

    Refresh_RecalcData : function(Data)
    {
        var Type = Data.Type;

        var bNeedRecalc = false;

        switch ( Type )
        {
            case AscDFH.historyitem_Styles_Add   :
            case AscDFH.historyitem_Styles_Remove:
            {
                bNeedRecalc = true;
                break;
            }
        }

        if ( true === bNeedRecalc )
        {
            // Сообщаем родительскому классу, что изменения произошли в элементе с номером this.Index и на странице this.PageNum
            return this.Refresh_RecalcData2(Data.Id);
        }
    },

    Refresh_RecalcData2 : function(StyleId)
    {
        if (undefined != StyleId)
        {
            // TODO: Надо сделать механизм, чтобы данное действие не вызывалось много раз подряд, а только 1.
            var LogicDocument = editor.WordControl.m_oLogicDocument;

            var AllParagraphs = [];

            if (StyleId != this.Default.Paragraph)
            {
                var AllStylesId = this.private_GetAllBasedStylesId(StyleId);
                AllParagraphs = LogicDocument.Get_AllParagraphsByStyle(AllStylesId);
            }
            else
            {
                AllParagraphs = LogicDocument.Get_AllParagraphs({All : true});
            }

            var Count = AllParagraphs.length;
            for (var Index = 0; Index < Count; Index++)
            {
                var Para = AllParagraphs[Index];
                Para.Refresh_RecalcData({ Type : AscDFH.historyitem_Paragraph_PStyle });
            }
        }
    },
//-----------------------------------------------------------------------------------
// Функции для совместного редактирования
//-----------------------------------------------------------------------------------
    Load_LinkData : function(LinkData)
    {
        if (undefined !== LinkData.UpdateStyleId)
        {
            var StyleId = LinkData.UpdateStyleId;

            var LogicDocument = editor.WordControl.m_oLogicDocument;
            if (!LogicDocument)
                return;

            var AllParagraphs = [];

            if (StyleId != this.Default.Paragraph)
            {
                var AllStylesId = this.private_GetAllBasedStylesId(StyleId);
                AllParagraphs = LogicDocument.Get_AllParagraphsByStyle(AllStylesId);
            }
            else
            {
                AllParagraphs = LogicDocument.Get_AllParagraphs({All : true});
            }

            var Count = AllParagraphs.length;
            for (var Index = 0; Index < Count; Index++)
            {
                var Para = AllParagraphs[Index];
                Para.Recalc_CompiledPr();
                Para.Recalc_RunsCompiledPr();
            }
        }
    }
};
CStyles.prototype.GetDefaultFootnoteText = function()
{
	return this.Default.FootnoteText;
};
CStyles.prototype.GetDefaultFootnoteTextChar = function()
{
	return this.Default.FootnoteTextChar;
};
CStyles.prototype.GetDefaultFootnoteReference = function()
{
	return this.Default.FootnoteReference;
};

function CDocumentColor(r,g,b, Auto)
{
    this.r = r;
    this.g = g;
    this.b = b;

    this.Auto = ( Auto === undefined ? false : Auto );
}

CDocumentColor.prototype =
{
    Copy : function()
    {
        return new CDocumentColor(this.r, this.g, this.b, this.Auto);
    },

    Write_ToBinary : function(Writer)
    {
        // Byte : r
        // Byte : g
        // Byte : b
        // Bool : Auto

        Writer.WriteByte( this.r );
        Writer.WriteByte( this.g );
        Writer.WriteByte( this.b );
        Writer.WriteBool( this.Auto );
    },

    Read_FromBinary : function(Reader)
    {
        // Byte : r
        // Byte : g
        // Byte : b
        // Bool : Auto

        this.r = Reader.GetByte();
        this.g = Reader.GetByte();
        this.b = Reader.GetByte();
        this.Auto = Reader.GetBool();
    },

    Set : function(r, g, b, Auto)
    {
        this.r = r;
        this.g = g;
        this.b = b;
        this.Auto = ( Auto === undefined ? false : Auto );
    },

    Compare : function(Color)
    {
        if (this.r === Color.r
            && this.g === Color.g
            && this.b === Color.b
            && (this.Auto === Color.Auto
                || (false === this.Auto
                    && Color.Auto === undefined)))
            return true;

        return false;
    },

    Is_Equal : function(Color)
    {
        if (this.r !== Color.r
            || this.g !== Color.g
            || this.b !== Color.b
            || this.Auto !== Color.Auto)
            return false;

        return true;
    },

    Check_BlackAutoColor : function()
    {
        // TODO: Коэффициенты подобраны опытным путем. В некоторых "пограничных" случаях
        //       может быть несовпадение с Word (когда изменение на 1 одного из каналов
        //       меняет цвет), чтобы такого не было надо более точно подобрать коэффициенты.
        if ( 0.5 * this.r + this.g + 0.195 * this.b < 103 )
            return false;

        return true;
    }
};

function CDocumentShd()
{
    this.Value = c_oAscShdNil;
    this.Color = new CDocumentColor(255, 255, 255);
    this.Unifill = undefined;
    this.FillRef = undefined;
}

CDocumentShd.prototype =
{
    Copy : function()
    {
        var Shd = new CDocumentShd();
        Shd.Value = this.Value;

        if ( undefined !== this.Color )
            Shd.Color.Set( this.Color.r, this.Color.g, this.Color.b, this.Color.Auto );
        
        if( undefined !== this.Unifill )
            Shd.Unifill = this.Unifill.createDuplicate();

        if( undefined !== this.FillRef )
            Shd.FillRef = this.FillRef.createDuplicate();

        return Shd;
    },

    Compare : function(Shd)
    {
        if ( undefined === Shd )
            return false;
        
        if ( this.Value === Shd.Value )
        {
            switch ( this.Value )
            {
                case c_oAscShdNil:
                    return true;

                case c_oAscShdClear:
                {
                    return this.Color.Compare( Shd.Color ) && AscFormat.CompareUnifillBool(this.Unifill, Shd.Unifill);
                }
            }
        }

        return false;
    },

    Is_Equal : function(Shd)
    {
        if (this.Value !== Shd.Value
            || true !== IsEqualStyleObjects(this.Color, Shd.Color)
            || true !== IsEqualStyleObjects(this.Unifill, Shd.Unifill))
            return false;

        return true;
    },
    
    Get_Color : function(Paragraph)
    {
        if ( undefined !== this.Unifill )
        {
            this.Unifill.check(Paragraph.Get_Theme(), Paragraph.Get_ColorMap());
            var RGBA = this.Unifill.getRGBAColor();
            return new CDocumentColor( RGBA.R, RGBA.G, RGBA.B, false );
        }
        else
            return this.Color;
    },

    Get_Color2 : function(Theme, ColorMap)
    {
        if ( undefined !== this.Unifill )
        {
            this.Unifill.check(Theme, ColorMap);
            var RGBA = this.Unifill.getRGBAColor();
            return new CDocumentColor( RGBA.R, RGBA.G, RGBA.B, false );
        }
        else
            return this.Color;
    },

    Get_Color3 : function(Theme, ColorMap)
    {
        if ( undefined !== this.Unifill )
        {
            this.Unifill.check(Theme, ColorMap);
            return this.Unifill.getRGBAColor();
        }
        else
        {
            return {R: 255, G: 255, B: 255, A: 255};
        }
    },
    
    Init_Default : function()
    {
        this.Value = c_oAscShdNil;
        this.Color.Set( 0, 0, 0, false );
        this.Unifill = undefined;
        this.FillRef = undefined;
    },

    Set_FromObject : function(Shd)
    {
        if ( undefined === Shd )
        {
            this.Value = c_oAscShdNil;
            return;
        }
        
        this.Value = Shd.Value;
        if ( c_oAscShdNil != Shd.Value )
        {
            if( undefined != Shd.Color )
                this.Color.Set( Shd.Color.r, Shd.Color.g, Shd.Color.b, Shd.Color.Auto );
            if(undefined != Shd.Unifill)
            {
                this.Unifill = Shd.Unifill.createDuplicate();
            }
            if(undefined != Shd.FillRef)
            {
                this.FillRef = Shd.FillRef.createDuplicate();
            }
        }
        else if ( undefined === Shd.Color )
            this.Color = undefined;
    },

    Check_PresentationPr : function(Theme)
    {
        if(this.FillRef && Theme)
        {
            this.Unifill = Theme.getFillStyle(this.FillRef.idx, this.FillRef.Color);
            this.FillRef = undefined;
        }
    },

    Write_ToBinary : function(Writer)
    {
        // Byte : Value
        //
        // Если c_oAscShdClear
        // Variable : Color

        Writer.WriteByte( this.Value );
        if ( c_oAscShdClear === this.Value )
        {
            this.Color.Write_ToBinary(Writer);
            if(this.Unifill)
            {
                Writer.WriteBool(true);
                this.Unifill.Write_ToBinary(Writer);
            }
            else
            {
                Writer.WriteBool(false);
            }
            if(this.FillRef)
            {
                Writer.WriteBool(true);
                this.FillRef.Write_ToBinary(Writer);
            }
            else
            {
                Writer.WriteBool(false);
            }
        }
    },

    Read_FromBinary : function(Reader)
    {
        // Byte : Value
        //
        // Если c_oAscShdClear
        // Variable : Color

        this.Value = Reader.GetByte();

        if ( c_oAscShdClear === this.Value )
        {
            this.Color.Read_FromBinary(Reader);
            if(Reader.GetBool())
            {
                this.Unifill = new AscFormat.CUniFill();
                this.Unifill.Read_FromBinary(Reader);
            }
            if(Reader.GetBool())
            {
                this.FillRef = new AscFormat.StyleRef();
                this.FillRef.Read_FromBinary(Reader);
            }
        }
        else
            this.Color.Set(0, 0, 0);
    }
};

function CDocumentBorder()
{
    this.Color = new CDocumentColor( 0, 0, 0 );
    this.Unifill = undefined;
    this.LineRef = undefined;
    this.Space = 0;
    this.Size  = 0.5 * g_dKoef_pt_to_mm;
    this.Value = border_None;
}

CDocumentBorder.prototype =
{
    Copy : function()
    {
        var Border = new CDocumentBorder();

        if ( undefined === this.Color )
            Border.Color = undefined;
        else
            Border.Color.Set(this.Color.r, this.Color.g, this.Color.b);

        if(undefined === this.Unifill)
            Border.Unifill = undefined;
        else
            Border.Unifill = this.Unifill.createDuplicate();

        if(undefined === this.LineRef)
        {
            Border.LineRef = undefined;
        }
        else
        {
            Border.LineRef = this.LineRef.createDuplicate();
        }

        if ( undefined === this.Space )
            Border.Space = undefined;
        else
            Border.Space = this.Space;

        if ( undefined === this.Size )
            Border.Size = undefined;
        else
            Border.Size  = this.Size;

        if ( undefined === this.Value )
            Border.Value = undefined;
        else
            Border.Value = this.Value;

        return Border;
    },

    Compare : function(Border)
    {
        if ( false === this.Color.Compare(Border.Color) )
            return false;

        if(AscFormat.CompareUnifillBool(this.Unifill, Border.Unifill) === false)
            return false;

        if(this.LineRef !== undefined && Border.LineRef === undefined || Border.LineRef !== undefined && this.LineRef === undefined)
            return false;

        if(this.LineRef !== undefined && !this.LineRef.compare(Border.LineRef))
        {
            return false;
        }

        if ( Math.abs( this.Size - Border.Size ) > 0.001 )
            return false;

        if ( Math.abs( this.Space - Border.Space ) > 0.001 )
            return false;

        if ( this.Value != Border.Value )
            return false;

        return true;
    },

    Is_Equal : function(Border)
    {
        if (true !== IsEqualStyleObjects(this.Color, Border.Color)
            || true !== IsEqualStyleObjects(this.Unifill, Border.Unifill)
            || this.Space !== Border.Space
            || this.Size !== Border.Size
            || this.Value !== Border.Value)
            return false;

        return true;
    },

    Get_Color : function(Paragraph)
    {
        if ( undefined !== this.Unifill )
        {
            this.Unifill.check(Paragraph.Get_Theme(), Paragraph.Get_ColorMap());
            var RGBA = this.Unifill.getRGBAColor();
            return new CDocumentColor( RGBA.R, RGBA.G, RGBA.B, false );
        }
        else
            return this.Color;
    },

    Get_Color2 : function(Theme, ColorMap)
    {
        if ( undefined !== this.Unifill )
        {
            this.Unifill.check(Theme, ColorMap);
            var RGBA = this.Unifill.getRGBAColor();
            return new CDocumentColor( RGBA.R, RGBA.G, RGBA.B, false );
        }
        else
            return this.Color;
    },

    Check_PresentationPr : function(Theme)
    {
        if(this.LineRef && Theme)
        {
            var pen = Theme.getLnStyle(this.LineRef.idx, this.LineRef.Color);

            this.Unifill = pen.Fill;
            this.LineRef = undefined;
            this.Size = AscFormat.isRealNumber(pen.w) ? pen.w / 36000 : 12700 /36000;
        }
        if(!this.Unifill || !this.Unifill.fill || this.Unifill.fill.type === Asc.c_oAscFill.FILL_TYPE_NOFILL)
        {
            this.Value = border_None;
        }
    },

    Set_FromObject : function(Border)
    {
        this.Space = Border.Space;
        this.Size  = Border.Size;
        this.Value = Border.Value;

        if ( undefined != Border.Color )
            this.Color = new CDocumentColor( Border.Color.r, Border.Color.g, Border.Color.b );
        else
            this.Color = undefined;

        if(undefined != Border.Unifill)
        {
            this.Unifill = Border.Unifill.createDuplicate();
        }
        if(undefined != Border.LineRef)
        {
            this.LineRef = Border.LineRef.createDuplicate();
        }
    },

    Check_Null : function()
    {
        if ( undefined === this.Space || undefined === this.Size || undefined === this.Value || undefined === this.Color || undefined === this.Unifill || undefined === this.LineRef)
            return false;

        return true;
    },

    Write_ToBinary : function(Writer)
    {
        // Double   : Size
        // Long     : Space
        // Byte     : Value
        // Variable : Color

        Writer.WriteDouble( this.Size );
        Writer.WriteLong( this.Space );
        Writer.WriteByte( this.Value );
        this.Color.Write_ToBinary( Writer );
        if(this.Unifill)
        {
            Writer.WriteBool(true);
            this.Unifill.Write_ToBinary(Writer);
        }
        else
        {
            Writer.WriteBool(false);
        }
        if(this.LineRef)
        {
            Writer.WriteBool(true);
            this.LineRef.Write_ToBinary(Writer);
        }
        else
        {
            Writer.WriteBool(false);
        }

    },

    Read_FromBinary : function(Reader)
    {
        // Double   : Size
        // Long     : Space
        // Byte     : Value
        // Variable : Color

        this.Size  = Reader.GetDouble();
        this.Space = Reader.GetLong();
        this.Value = Reader.GetByte();
        this.Color.Read_FromBinary( Reader );
        if(Reader.GetBool())
        {
            this.Unifill = new AscFormat.CUniFill();
            this.Unifill.Read_FromBinary(Reader);
        }
        if(Reader.GetBool())
        {
            this.LineRef = new AscFormat.StyleRef();
            this.LineRef.Read_FromBinary(Reader);
        }
    }
};
CDocumentBorder.prototype.IsNone = function()
{
	return this.Value === border_None ? true : false;
};

function CTableMeasurement(Type, W)
{
    this.Type = Type;
    this.W    = W;
}

CTableMeasurement.prototype =
{
    Copy : function()
    {
        return new CTableMeasurement(this.Type, this.W);
    },

    Is_Equal : function(Other)
    {
        if (this.Type !== Other.Type
            || this.W !== Other.W)
            return false;

        return true;
    },

    Write_ToBinary : function(Writer)
    {
        // Double : W
        // Long   : Type
        Writer.WriteDouble( this.W );
        Writer.WriteLong( this.Type );
    },

    Read_FromBinary : function(Reader)
    {
        // Double : W
        // Long   : Type

        this.W    = Reader.GetDouble();
        this.Type = Reader.GetLong();
    },

    Set_FromObject : function(Obj)
    {
        this.W    = Obj.W;
        this.Type = Obj.Type;
    }
};

function CTablePr()
{
    this.TableStyleColBandSize = undefined;
    this.TableStyleRowBandSize = undefined;
    this.Jc                    = undefined;
    this.Shd                   = undefined;
    this.TableBorders          =
    {
        Bottom  : undefined,
        Left    : undefined,
        Right   : undefined,
        Top     : undefined,
        InsideH : undefined,
        InsideV : undefined
    };
    this.TableCellMar          =
    {
        Bottom : undefined,
        Left   : undefined,
        Right  : undefined,
        Top    : undefined
    };
    this.TableCellSpacing      = undefined;
    this.TableInd              = undefined;
    this.TableW                = undefined;
    this.TableLayout           = undefined;
    this.TableDescription      = undefined;
    this.TableCaption          = undefined;
}

CTablePr.prototype =
{
    Copy : function()
    {
        var TablePr = new CTablePr();

        TablePr.TableStyleColBandSize = this.TableStyleColBandSize;
        TablePr.TableStyleRowBandSize = this.TableStyleRowBandSize;
        TablePr.Jc                    = this.Jc;

        if ( undefined != this.Shd )
            TablePr.Shd = this.Shd.Copy();

        // TableBorders
        if ( undefined != this.TableBorders.Bottom )
            TablePr.TableBorders.Bottom = this.TableBorders.Bottom.Copy();

        if ( undefined != this.TableBorders.Left )
            TablePr.TableBorders.Left = this.TableBorders.Left.Copy();

        if ( undefined != this.TableBorders.Right )
            TablePr.TableBorders.Right = this.TableBorders.Right.Copy();

        if ( undefined != this.TableBorders.Top )
            TablePr.TableBorders.Top = this.TableBorders.Top.Copy();

        if ( undefined != this.TableBorders.InsideH )
            TablePr.TableBorders.InsideH = this.TableBorders.InsideH.Copy();

        if ( undefined != this.TableBorders.InsideV )
            TablePr.TableBorders.InsideV = this.TableBorders.InsideV.Copy();

        // TableCellMar
        if ( undefined != this.TableCellMar.Bottom )
            TablePr.TableCellMar.Bottom = this.TableCellMar.Bottom.Copy();

        if ( undefined != this.TableCellMar.Left )
            TablePr.TableCellMar.Left = this.TableCellMar.Left.Copy();

        if ( undefined != this.TableCellMar.Right )
            TablePr.TableCellMar.Right = this.TableCellMar.Right.Copy();

        if ( undefined != this.TableCellMar.Top )
            TablePr.TableCellMar.Top = this.TableCellMar.Top.Copy();

        TablePr.TableCellSpacing = this.TableCellSpacing;
        TablePr.TableInd         = this.TableInd;

        if ( undefined != this.TableW )
            TablePr.TableW = this.TableW.Copy();

        TablePr.TableLayout = this.TableLayout;

        TablePr.TableDescription = this.TableDescription;
        TablePr.TableCaption     = this.TableCaption;

        return TablePr;
    },

    Merge : function(TablePr)
    {
        if ( undefined != TablePr.TableStyleColBandSize )
            this.TableStyleColBandSize = TablePr.TableStyleColBandSize;

        if ( undefined != TablePr.TableStyleRowBandSize )
            this.TableStyleRowBandSize = TablePr.TableStyleRowBandSize;

        if ( undefined != TablePr.Jc )
            this.Jc = TablePr.Jc;

        if ( undefined != TablePr.Shd )
            this.Shd = TablePr.Shd.Copy();

        // TableBorders
        if ( undefined != TablePr.TableBorders.Bottom )
            this.TableBorders.Bottom = TablePr.TableBorders.Bottom.Copy();

        if ( undefined != TablePr.TableBorders.Left )
            this.TableBorders.Left = TablePr.TableBorders.Left.Copy();

        if ( undefined != TablePr.TableBorders.Right )
            this.TableBorders.Right = TablePr.TableBorders.Right.Copy();

        if ( undefined != TablePr.TableBorders.Top )
            this.TableBorders.Top = TablePr.TableBorders.Top.Copy();

        if ( undefined != TablePr.TableBorders.InsideH )
            this.TableBorders.InsideH = TablePr.TableBorders.InsideH.Copy();

        if ( undefined != TablePr.TableBorders.InsideV )
            this.TableBorders.InsideV = TablePr.TableBorders.InsideV.Copy();

        // TableCellMar
        if ( undefined != TablePr.TableCellMar.Bottom )
            this.TableCellMar.Bottom = TablePr.TableCellMar.Bottom.Copy();

        if ( undefined != TablePr.TableCellMar.Left )
            this.TableCellMar.Left = TablePr.TableCellMar.Left.Copy();

        if ( undefined != TablePr.TableCellMar.Right )
            this.TableCellMar.Right = TablePr.TableCellMar.Right.Copy();

        if ( undefined != TablePr.TableCellMar.Top )
            this.TableCellMar.Top = TablePr.TableCellMar.Top.Copy();

        if ( undefined != TablePr.TableCellSpacing )
            this.TableCellSpacing = TablePr.TableCellSpacing;

        if ( undefined != TablePr.TableInd )
            this.TableInd         = TablePr.TableInd;

        if ( undefined != TablePr.TableW )
            this.TableW = TablePr.TableW.Copy();

        if ( undefined != TablePr.TableLayout )
            this.TableLayout = TablePr.TableLayout;

        if (undefined !== TablePr.TableDescription)
        	this.TableDescription = TablePr.TableDescription;

        if (undefined !== TablePr.TableCaption)
        	this.TableCaption = TablePr.TableCaption;
    },

    Is_Equal : function(TablePr)
    {
        if (this.TableStyleColBandSize !== TablePr.TableStyleColBandSize
            || this.TableStyleRowBandSize !== TablePr.TableStyleRowBandSize
            || this.Jc !== TablePr.Jc
            || true !== IsEqualStyleObjects(this.TableBorders.Bottom, TablePr.TableBorders.Bottom)
            || true !== IsEqualStyleObjects(this.TableBorders.Left   , TablePr.TableBorders.Left   )
            || true !== IsEqualStyleObjects(this.TableBorders.Right  , TablePr.TableBorders.Right  )
            || true !== IsEqualStyleObjects(this.TableBorders.Top    , TablePr.TableBorders.Top    )
            || true !== IsEqualStyleObjects(this.TableBorders.InsideH, TablePr.TableBorders.InsideH)
            || true !== IsEqualStyleObjects(this.TableBorders.InsideV, TablePr.TableBorders.InsideV)
            || true !== IsEqualStyleObjects(this.TableCellMar.Bottom, TablePr.TableCellMar.Bottom)
            || true !== IsEqualStyleObjects(this.TableCellMar.Left  , TablePr.TableCellMar.Left  )
            || true !== IsEqualStyleObjects(this.TableCellMar.Right , TablePr.TableCellMar.Right )
            || true !== IsEqualStyleObjects(this.TableCellMar.Top   , TablePr.TableCellMar.Top   )
            || this.TableCellSpacing !== TablePr.TableCellSpacing
            || this.TableInd !== TablePr.TableInd
            || true !== IsEqualStyleObjects(this.TableW, TablePr.TableW)
            || this.TableLayout !== TablePr.TableLayout)
            return false;

        return true;
    },

    Init_Default : function()
    {
        this.TableStyleColBandSize = 1;
        this.TableStyleRowBandSize = 1;
        this.Jc                    = align_Left;
        this.Shd                   = new CDocumentShd();
        this.TableBorders.Bottom   = new CDocumentBorder();
        this.TableBorders.Left     = new CDocumentBorder();
        this.TableBorders.Right    = new CDocumentBorder();
        this.TableBorders.Top      = new CDocumentBorder();
        this.TableBorders.InsideH  = new CDocumentBorder();
        this.TableBorders.InsideV  = new CDocumentBorder();
        this.TableCellMar.Bottom   = new CTableMeasurement(tblwidth_Mm, 0);
        this.TableCellMar.Left     = new CTableMeasurement(tblwidth_Mm, 1.9/*5.4 * g_dKoef_pt_to_mm*/); // 5.4pt
        this.TableCellMar.Right    = new CTableMeasurement(tblwidth_Mm, 1.9/*5.4 * g_dKoef_pt_to_mm*/); // 5.4pt
        this.TableCellMar.Top      = new CTableMeasurement(tblwidth_Mm, 0);
        this.TableCellSpacing      = null;
        this.TableInd              = 0;
        this.TableW                = new CTableMeasurement(tblwidth_Auto, 0);
        this.TableLayout           = tbllayout_AutoFit;
        this.TableDescription      = "";
        this.TableCaption          = "";
    },

    Set_FromObject : function(TablePr)
    {
        this.TableStyleColBandSize = TablePr.TableStyleColBandSize;
        this.TableStyleRowBandSize = TablePr.TableStyleRowBandSize;
        this.Jc = TablePr.Jc;

        if ( undefined != TablePr.Shd )
        {
            this.Shd = new CDocumentShd();
            this.Shd.Set_FromObject(TablePr.Shd);
        }
        else
            this.Shd = undefined;

        if ( undefined != TablePr.TableBorders )
        {
            if ( undefined != TablePr.TableBorders.Bottom )
            {
                this.TableBorders.Bottom = new CDocumentBorder();
                this.TableBorders.Bottom.Set_FromObject( TablePr.TableBorders.Bottom );
            }
            else
                this.TableBorders.Bottom = undefined;

            if ( undefined != TablePr.TableBorders.Left )
            {
                this.TableBorders.Left = new CDocumentBorder();
                this.TableBorders.Left.Set_FromObject( TablePr.TableBorders.Left );
            }
            else
                this.TableBorders.Left = undefined;

            if ( undefined != TablePr.TableBorders.Right )
            {
                this.TableBorders.Right = new CDocumentBorder();
                this.TableBorders.Right.Set_FromObject( TablePr.TableBorders.Right );
            }
            else
                this.TableBorders.Right = undefined;

            if ( undefined != TablePr.TableBorders.Top )
            {
                this.TableBorders.Top = new CDocumentBorder();
                this.TableBorders.Top.Set_FromObject( TablePr.TableBorders.Top );
            }
            else
                this.TableBorders.Top = undefined;

            if ( undefined != TablePr.TableBorders.InsideH )
            {
                this.TableBorders.InsideH = new CDocumentBorder();
                this.TableBorders.InsideH.Set_FromObject( TablePr.TableBorders.InsideH );
            }
            else
                this.TableBorders.InsideH = undefined;

            if ( undefined != TablePr.TableBorders.InsideV )
            {
                this.TableBorders.InsideV = new CDocumentBorder();
                this.TableBorders.InsideV.Set_FromObject( TablePr.TableBorders.InsideV );
            }
            else
                this.TableBorders.InsideV = undefined;
        }
        else
        {
            this.TableBorders.Bottom  = undefined;
            this.TableBorders.Left    = undefined;
            this.TableBorders.Right   = undefined;
            this.TableBorders.Top     = undefined;
            this.TableBorders.InsideH = undefined;
            this.TableBorders.InsideV = undefined;
        }

        if ( undefined != TablePr.TableCellMar )
        {
            if ( undefined != TablePr.TableCellMar.Bottom )
                this.TableCellMar.Bottom = new CTableMeasurement( TablePr.TableCellMar.Bottom.Type, TablePr.TableCellMar.Bottom.W );
            else
                this.TableCellMar.Bottom = undefined;

            if ( undefined != TablePr.TableCellMar.Left )
                this.TableCellMar.Left = new CTableMeasurement( TablePr.TableCellMar.Left.Type, TablePr.TableCellMar.Left.W );
            else
                this.TableCellMar.Left = undefined;

            if ( undefined != TablePr.TableCellMar.Right )
                this.TableCellMar.Right = new CTableMeasurement( TablePr.TableCellMar.Right.Type, TablePr.TableCellMar.Right.W );
            else
                this.TableCellMar.Right = undefined;

            if ( undefined != TablePr.TableCellMar.Top )
                this.TableCellMar.Top = new CTableMeasurement( TablePr.TableCellMar.Top.Type, TablePr.TableCellMar.Top.W );
            else
                this.TableCellMar.Top = undefined;
        }
        else
        {
            this.TableCellMar.Bottom = undefined;
            this.TableCellMar.Left   = undefined;
            this.TableCellMar.Right  = undefined;
            this.TableCellMar.Top    = undefined;
        }

        this.TableCellSpacing = TablePr.TableCellSpacing;
        this.TableInd         = TablePr.TableInd;

        if ( undefined != TablePr.TableW )
            this.TableW = new CTableMeasurement( TablePr.TableW.Type, TablePr.TableW.W );
        else
            this.TableW = undefined;

        this.TableLayout = TablePr.TableLayout;

        this.TableDescription = TablePr.TableDescription;
        this.TableCaption     = TablePr.TableCaption;
    },

    Check_PresentationPr : function(Theme)
    {
        if(this.Shd)
        {
            this.Shd.Check_PresentationPr(Theme);
        }
        if(this.TableBorders.Bottom)
        {
            this.TableBorders.Bottom.Check_PresentationPr(Theme);
        }
        if(this.TableBorders.Left)
        {
            this.TableBorders.Left.Check_PresentationPr(Theme);
        }
        if(this.TableBorders.Right)
        {
            this.TableBorders.Right.Check_PresentationPr(Theme);
        }
        if(this.TableBorders.Top)
        {
            this.TableBorders.Top.Check_PresentationPr(Theme);
        }
        if(this.TableBorders.InsideH)
        {
            this.TableBorders.InsideH.Check_PresentationPr(Theme);
        }
        if(this.TableBorders.InsideV)
        {
            this.TableBorders.InsideV.Check_PresentationPr(Theme);
        }
    },

    Write_ToBinary : function(Writer)
    {
        var StartPos = Writer.GetCurPosition();
        Writer.Skip(4);
        var Flags = 0;

        if ( undefined != this.TableStyleColBandSize )
        {
            Writer.WriteLong( this.TableStyleColBandSize );
            Flags |= 1;
        }

        if ( undefined != this.TableStyleRowBandSize )
        {
            Writer.WriteLong( this.TableStyleRowBandSize );
            Flags |= 2;
        }

        if ( undefined != this.Jc )
        {
            Writer.WriteLong( this.Jc );
            Flags |= 4;
        }

        if ( undefined != this.Shd )
        {
            this.Shd.Write_ToBinary( Writer );
            Flags |= 8;
        }

        if ( undefined != this.TableBorders.Bottom )
        {
            this.TableBorders.Bottom.Write_ToBinary( Writer );
            Flags |= 16;
        }

        if ( undefined != this.TableBorders.Left )
        {
            this.TableBorders.Left.Write_ToBinary( Writer );
            Flags |= 32;
        }

        if ( undefined != this.TableBorders.Right )
        {
            this.TableBorders.Right.Write_ToBinary( Writer );
            Flags |= 64;
        }

        if ( undefined != this.TableBorders.Top )
        {
            this.TableBorders.Top.Write_ToBinary( Writer );
            Flags |= 128;
        }

        if ( undefined != this.TableBorders.InsideH )
        {
            this.TableBorders.InsideH.Write_ToBinary( Writer );
            Flags |= 256;
        }

        if ( undefined != this.TableBorders.InsideV )
        {
            this.TableBorders.InsideV.Write_ToBinary( Writer );
            Flags |= 512;
        }

        if ( undefined != this.TableCellMar.Bottom )
        {
            this.TableCellMar.Bottom.Write_ToBinary( Writer );
            Flags |= 1024;
        }

        if ( undefined != this.TableCellMar.Left )
        {
            this.TableCellMar.Left.Write_ToBinary( Writer );
            Flags |= 2048;
        }

        if ( undefined != this.TableCellMar.Right )
        {
            this.TableCellMar.Right.Write_ToBinary( Writer );
            Flags |= 4096;
        }

        if ( undefined != this.TableCellMar.Top )
        {
            this.TableCellMar.Top.Write_ToBinary( Writer );
            Flags |= 8192;
        }

        if ( undefined != this.TableCellSpacing )
        {
            if ( null === this.TableCellSpacing )
                Writer.WriteBool(true);
            else
            {
                Writer.WriteBool(false);
                Writer.WriteDouble(this.TableCellSpacing);
            }

            Flags |= 16384;
        }

        if ( undefined != this.TableInd )
        {
            Writer.WriteDouble(this.TableInd);

            Flags |= 32768;
        }

        if ( undefined != this.TableW )
        {
            this.TableW.Write_ToBinary( Writer );
            Flags |= 65536;
        }

        if ( undefined != this.TableLayout )
        {
            Writer.WriteLong( this.TableLayout );
            Flags |= 131072;
        }

        if (undefined !== this.TableDescription)
		{
			Writer.WriteString2(this.TableDescription);
			Flags |= 262144;
		}

		if (undefined !== this.TableCaption)
		{
			Writer.WriteString2(this.TableCaption);
			Flags |= 524288;
		}

        var EndPos = Writer.GetCurPosition();
        Writer.Seek( StartPos );
        Writer.WriteLong( Flags );
        Writer.Seek( EndPos );
    },

    Read_FromBinary : function(Reader)
    {
        var Flags = Reader.GetLong();

        if ( 1 & Flags )
            this.TableStyleColBandSize = Reader.GetLong();

        if ( 2 & Flags )
            this.TableStyleRowBandSize = Reader.GetLong();

        if ( 4 & Flags )
            this.Jc = Reader.GetLong();

        if ( 8 & Flags )
        {
            this.Shd = new CDocumentShd();
            this.Shd.Read_FromBinary(Reader);
        }

        if ( 16 & Flags )
        {
            this.TableBorders.Bottom = new CDocumentBorder();
            this.TableBorders.Bottom.Read_FromBinary( Reader );
        }

        if ( 32 & Flags )
        {
            this.TableBorders.Left = new CDocumentBorder();
            this.TableBorders.Left.Read_FromBinary( Reader );
        }

        if ( 64 & Flags )
        {
            this.TableBorders.Right = new CDocumentBorder();
            this.TableBorders.Right.Read_FromBinary( Reader );
        }

        if ( 128 & Flags )
        {
            this.TableBorders.Top = new CDocumentBorder();
            this.TableBorders.Top.Read_FromBinary( Reader );
        }

        if ( 256 & Flags )
        {
            this.TableBorders.InsideH = new CDocumentBorder();
            this.TableBorders.InsideH.Read_FromBinary( Reader );
        }

        if ( 512 & Flags )
        {
            this.TableBorders.InsideV = new CDocumentBorder();
            this.TableBorders.InsideV.Read_FromBinary( Reader );
        }

        if ( 1024 & Flags )
        {
            this.TableCellMar.Bottom = new CTableMeasurement(tblwidth_Auto, 0);
            this.TableCellMar.Bottom.Read_FromBinary(Reader);
        }

        if ( 2048 & Flags )
        {
            this.TableCellMar.Left = new CTableMeasurement(tblwidth_Auto, 0);
            this.TableCellMar.Left.Read_FromBinary(Reader);
        }

        if ( 4096 & Flags )
        {
            this.TableCellMar.Right = new CTableMeasurement(tblwidth_Auto, 0);
            this.TableCellMar.Right.Read_FromBinary(Reader);
        }

        if ( 8192 & Flags )
        {
            this.TableCellMar.Top = new CTableMeasurement(tblwidth_Auto, 0);
            this.TableCellMar.Top.Read_FromBinary(Reader);
        }

        if ( 16384 & Flags )
        {
            if ( true === Reader.GetBool() )
                this.TableCellSpacing = null;
            else
                this.TableCellSpacing = Reader.GetDouble()
        }

        if ( 32768 & Flags )
            this.TableInd = Reader.GetDouble();

        if ( 65536 & Flags )
        {
            this.TableW = new CTableMeasurement(tblwidth_Auto, 0);
            this.TableW.Read_FromBinary(Reader);
        }

        if ( 131072 & Flags )
            this.TableLayout = Reader.GetLong();

		if (262144 & Flags)
			this.TableDescription = Reader.GetString2();

		if (524288 & Flags)
			this.TableCaption = Reader.GetString2();
    }
};

function CTableRowHeight(Value, HRule)
{
    this.Value = Value;
    this.HRule = HRule;
}

CTableRowHeight.prototype =
{
    Copy : function()
    {
        return new CTableRowHeight(this.Value, this.HRule);
    },

    Is_Equal : function(Other)
    {
        if (this.Value !== Other.Value
            || this.HRule !== Other.HRule)
            return false;

        return true;
    },

    Write_ToBinary : function(Writer)
    {
        // Double : Value
        // Long   : HRule
        Writer.WriteDouble( this.Value );
        Writer.WriteLong( this.HRule );
    },

    Read_FromBinary : function(Reader)
    {
        // Double : Value
        // Long   : HRule

        this.Value = Reader.GetDouble();
        this.HRule = Reader.GetLong();
    }
};

function CTableRowPr()
{
    this.CantSplit        = undefined;
    this.GridAfter        = undefined;
    this.GridBefore       = undefined;
    this.Jc               = undefined;
    this.TableCellSpacing = undefined;
    this.Height           = undefined;
    this.WAfter           = undefined;
    this.WBefore          = undefined;
    this.TableHeader      = undefined;
}

CTableRowPr.prototype =
{
    Copy : function()
    {
        var RowPr = new CTableRowPr();

        RowPr.CantSplit        = this.CantSplit;
        RowPr.GridAfter        = this.GridAfter;
        RowPr.GridBefore       = this.GridBefore;
        RowPr.Jc               = this.Jc;
        RowPr.TableCellSpacing = this.TableCellSpacing;

        if ( undefined != this.Height )
            RowPr.Height = this.Height.Copy();

        if ( undefined != this.WAfter )
            RowPr.WAfter = this.WAfter.Copy();

        if ( undefined != this.WBefore )
            RowPr.WBefore = this.WBefore.Copy();

        RowPr.TableHeader = this.TableHeader;

        return RowPr;
    },

    Merge : function(RowPr)
    {
        if ( undefined != RowPr.CantSplit )
            this.CantSplit = RowPr.CantSplit;

        if ( undefined != RowPr.GridAfter )
            this.GridAfter = RowPr.GridAfter;

        if ( undefined != RowPr.GridBefore )
            this.GridBefore = RowPr.GridBefore;

        if ( undefined != RowPr.Jc )
            this.Jc = RowPr.Jc;

        if ( undefined != RowPr.TableCellSpacing )
            this.TableCellSpacing = RowPr.TableCellSpacing;

        if ( undefined != RowPr.Height )
            this.Height = RowPr.Height.Copy();

        if ( undefined != RowPr.WAfter )
            this.WAfter = RowPr.WAfter.Copy();

        if ( undefined != RowPr.WBefore )
            this.WBefore = RowPr.WBefore.Copy();

        if ( undefined != RowPr.TableHeader )
            this.TableHeader = RowPr.TableHeader;
    },

    Is_Equal : function(RowPr)
    {
        if (this.CantSplit !== RowPr.CantSplit
            || this.GridAfter !== RowPr.GridAfter
            || this.GridBefore !== RowPr.GridBefore
            || this.Jc !== RowPr.Jc
            || this.TableCellSpacing !== RowPr.TableCellSpacing
            || true !== IsEqualStyleObjects(this.Height, RowPr.Height)
            || true !== IsEqualStyleObjects(this.WAfter, RowPr.WAfter)
            || true !== IsEqualStyleObjects(this.WBefore, RowPr.WBefore)
            || this.TableHeader !== RowPr.TableHeader)
            return false;

        return true;
    },

    Init_Default : function()
    {
        this.CantSplit        = false;
        this.GridAfter        = 0;
        this.GridBefore       = 0;
        this.Jc               = align_Left;
        this.TableCellSpacing = null;
        this.Height           = new CTableRowHeight(0, Asc.linerule_Auto);
        this.WAfter           = new CTableMeasurement(tblwidth_Auto, 0);
        this.WBefore          = new CTableMeasurement(tblwidth_Auto, 0);
        this.TableHeader      = false;
    },

    Set_FromObject : function(RowPr)
    {
        this.CantSplit        = RowPr.CantSplit;
        this.GridAfter        = RowPr.GridAfter;
        this.GridBefore       = RowPr.GridBefore;
        this.Jc               = RowPr.Jc;
        this.TableCellSpacing = RowPr.TableCellSpacing;

        if ( undefined != RowPr.Height )
            this.Height = new CTableRowHeight( RowPr.Height.Value, RowPr.Height.HRule );
        else
            this.Height = undefined;

        if ( undefined != RowPr.WAfter )
            this.WAfter = new CTableMeasurement( RowPr.WAfter.Type, RowPr.WAfter.W );
        else
            this.WAfter = undefined;

        if ( undefined != RowPr.WBefore )
            this.WBefore = new CTableMeasurement( RowPr.WBefore.Type, RowPr.WBefore.W );
        else
            this.WBefore = undefined;

        this.TableHeader = RowPr.TableHeader;
    },

    Write_ToBinary : function(Writer)
    {
        var StartPos = Writer.GetCurPosition();
        Writer.Skip(4);
        var Flags = 0;

        if ( undefined != this.CantSplit )
        {
            Writer.WriteBool( this.CantSplit );
            Flags |= 1;
        }

        if ( undefined != this.GridAfter )
        {
            Writer.WriteLong( this.GridAfter );
            Flags |= 2;
        }

        if ( undefined != this.GridBefore )
        {
            Writer.WriteLong( this.GridBefore );
            Flags |= 4;
        }

        if ( undefined != this.Jc )
        {
            Writer.WriteLong( this.Jc );
            Flags |= 8;
        }

        if ( undefined != this.TableCellSpacing )
        {
            if ( null === this.TableCellSpacing )
                Writer.WriteBool( true );
            else
            {
                Writer.WriteBool( false );
                Writer.WriteDouble( this.TableCellSpacing );
            }

            Flags |= 16;
        }

        if ( undefined != this.Height )
        {
            this.Height.Write_ToBinary( Writer );
            Flags |= 32;
        }

        if ( undefined != this.WAfter )
        {
            this.WAfter.Write_ToBinary(Writer);
            Flags |= 64;
        }

        if ( undefined != this.WBefore )
        {
            this.WBefore.Write_ToBinary(Writer);
            Flags |= 128;
        }

        if ( undefined != this.TableHeader )
        {
            Writer.WriteBool( this.TableHeader );
            Flags |= 256;
        }

        var EndPos = Writer.GetCurPosition();
        Writer.Seek( StartPos );
        Writer.WriteLong( Flags );
        Writer.Seek( EndPos );
    },

    Read_FromBinary : function(Reader)
    {
        var Flags = Reader.GetLong();

        if ( 1 & Flags )
            this.CantSplit = Reader.GetBool();

        if ( 2 & Flags )
            this.GridAfter = Reader.GetLong();

        if ( 4 & Flags )
            this.GridBefore = Reader.GetLong();

        if ( 8 & Flags )
            this.Jc = Reader.GetLong();

        if ( 16 & Flags )
        {
            if ( true === Reader.GetBool() )
                this.TableCellSpacing = Reader.GetLong();
            else
                this.TableCellSpacing = Reader.GetDouble();
        }

        if ( 32 & Flags )
        {
            this.Height = new CTableRowHeight(0, Asc.linerule_Auto);
            this.Height.Read_FromBinary(Reader);
        }

        if ( 64 & Flags )
        {
            this.WAfter = new CTableMeasurement(tblwidth_Auto, 0);
            this.WAfter.Read_FromBinary(Reader);
        }

        if ( 128 & Flags )
        {
            this.WBefore = new CTableMeasurement(tblwidth_Auto, 0);
            this.WBefore.Read_FromBinary(Reader);
        }

        if ( 256 & Flags )
            this.TableHeader = Reader.GetBool();
    }
};

function CTableCellPr()
{
    this.GridSpan         = undefined;
    this.Shd              = undefined;
    this.TableCellMar     = undefined; // undefined/null/{Top, Left, Right, Bottom}
    this.TableCellBorders =
    {
        Bottom : undefined,
        Left   : undefined,
        Right  : undefined,
        Top    : undefined
    };
    this.TableCellW       = undefined;
    this.VAlign           = undefined;
    this.VMerge           = undefined;
    this.TextDirection    = undefined;
    this.NoWrap           = undefined;
}

CTableCellPr.prototype =
{
    Copy : function()
    {
        var CellPr = new CTableCellPr();

        CellPr.GridSpan = this.GridSpan;

        if (undefined != this.Shd)
            CellPr.Shd = this.Shd.Copy();

        if (undefined === this.TableCellMar)
            CellPr.TableCellMar = undefined;
        else if (null === this.TableCellMar)
            CellPr.TableCellMar = null;
        else
        {
            CellPr.TableCellMar        = {};
            CellPr.TableCellMar.Bottom = undefined != this.TableCellMar.Bottom ? this.TableCellMar.Bottom.Copy() : undefined;
            CellPr.TableCellMar.Left   = undefined != this.TableCellMar.Left ? this.TableCellMar.Left.Copy() : undefined;
            CellPr.TableCellMar.Right  = undefined != this.TableCellMar.Right ? this.TableCellMar.Right.Copy() : undefined;
            CellPr.TableCellMar.Top    = undefined != this.TableCellMar.Top ? this.TableCellMar.Top.Copy() : undefined;
        }

        if (undefined != this.TableCellBorders.Bottom)
            CellPr.TableCellBorders.Bottom = this.TableCellBorders.Bottom.Copy();

        if (undefined != this.TableCellBorders.Left)
            CellPr.TableCellBorders.Left = this.TableCellBorders.Left.Copy();

        if (undefined != this.TableCellBorders.Right)
            CellPr.TableCellBorders.Right = this.TableCellBorders.Right.Copy();

        if (undefined != this.TableCellBorders.Top)
            CellPr.TableCellBorders.Top = this.TableCellBorders.Top.Copy();

        if (undefined != this.TableCellW)
            CellPr.TableCellW = this.TableCellW.Copy();

        CellPr.VAlign        = this.VAlign;
        CellPr.VMerge        = this.VMerge;
        CellPr.TextDirection = this.TextDirection;
        CellPr.NoWrap        = this.NoWrap;
        return CellPr;
    },

    Merge : function(CellPr)
    {
        if (undefined != CellPr.GridSpan)
            this.GridSpan = CellPr.GridSpan;

        if (undefined != CellPr.Shd)
            this.Shd = CellPr.Shd.Copy();

        if (undefined === CellPr.TableCellMar)
        {
        }
        else if (null === CellPr.TableCellMar)
            this.TableCellMar = null;
        else
        {
            this.TableCellMar        = {};
            this.TableCellMar.Bottom = undefined != CellPr.TableCellMar.Bottom ? CellPr.TableCellMar.Bottom.Copy() : undefined;
            this.TableCellMar.Left   = undefined != CellPr.TableCellMar.Left ? CellPr.TableCellMar.Left.Copy() : undefined;
            this.TableCellMar.Right  = undefined != CellPr.TableCellMar.Right ? CellPr.TableCellMar.Right.Copy() : undefined;
            this.TableCellMar.Top    = undefined != CellPr.TableCellMar.Top ? CellPr.TableCellMar.Top.Copy() : undefined;
        }

        if (undefined != CellPr.TableCellBorders.Bottom)
            this.TableCellBorders.Bottom = CellPr.TableCellBorders.Bottom.Copy();

        if (undefined != CellPr.TableCellBorders.Left)
            this.TableCellBorders.Left = CellPr.TableCellBorders.Left.Copy();

        if (undefined != CellPr.TableCellBorders.Right)
            this.TableCellBorders.Right = CellPr.TableCellBorders.Right.Copy();

        if (undefined != CellPr.TableCellBorders.Top)
            this.TableCellBorders.Top = CellPr.TableCellBorders.Top.Copy();

        if (undefined != CellPr.TableCellW)
            this.TableCellW = CellPr.TableCellW.Copy();

        if (undefined != CellPr.VAlign)
            this.VAlign = CellPr.VAlign;

        if (undefined != CellPr.VMerge)
            this.VMerge = CellPr.VMerge;

        if (undefined != CellPr.TextDirection)
            this.TextDirection = CellPr.TextDirection;

        if (undefined !== CellPr.NoWrap)
            this.NoWrap = CellPr.NoWrap;
    },

    Is_Equal : function(CellPr)
    {
        if (this.GridSpan !== CellPr.GridSpan
            || true !== IsEqualStyleObjects(this.Shd, CellPr.Shd)
            || (this.TableCellMar !== undefined
                && CellPr.TableCellMar === undefined)
            || (CellPr.TableCellMar !== undefined
                && this.TableCellMar === undefined)
            || (this.TableCellMar !== null
                && CellPr.TableCellMar === null)
            || (CellPr.TableCellMar !== null
                && this.TableCellMar === null)
            || (this.TableCellMar !== undefined
                && this.TableCellMar !== null
                && (true !== IsEqualStyleObjects(this.TableCellMar.Top, CellPr.TableCellMar.Top)
                    || true !== IsEqualStyleObjects(this.TableCellMar.Left, CellPr.TableCellMar.Left)
                    || true !== IsEqualStyleObjects(this.TableCellMar.Right, CellPr.TableCellMar.Right)
                    || true !== IsEqualStyleObjects(this.TableCellMar.Bottom, CellPr.TableCellMar.Bottom)))
            || true !== IsEqualStyleObjects(this.TableCellBorders.Bottom, CellPr.TableCellBorders.Bottom)
            || true !== IsEqualStyleObjects(this.TableCellBorders.Left, CellPr.TableCellBorders.Left)
            || true !== IsEqualStyleObjects(this.TableCellBorders.Right, CellPr.TableCellBorders.Right)
            || true !== IsEqualStyleObjects(this.TableCellBorders.Top, CellPr.TableCellBorders.Top)
            || true !== IsEqualStyleObjects(this.TableCellW, CellPr.TableCellW)
            || this.VAlign !== CellPr.VAlign
            || this.VMerge !== CellPr.VMerge
            || this.TextDirection !== CellPr.TextDirection
            || this.NoWrap !== CellPr.NoWrap)
            return false;

        return true;
    },

    Init_Default : function()
    {
        this.GridSpan                = 1;
        this.Shd                     = new CDocumentShd();
        this.TableCellMar            = null;
        this.TableCellBorders.Bottom = undefined;
        this.TableCellBorders.Left   = undefined;
        this.TableCellBorders.Right  = undefined;
        this.TableCellBorders.Top    = undefined;
        this.TableCellW              = new CTableMeasurement(tblwidth_Auto, 0);
        this.VAlign                  = vertalignjc_Top;
        this.VMerge                  = vmerge_Restart;
        this.TextDirection           = textdirection_LRTB;
        this.NoWrap                  = false;
    },

    Set_FromObject : function(CellPr)
    {
        this.GridSpan = CellPr.GridSpan;

        if ( undefined != CellPr.Shd )
        {
            this.Shd = new CDocumentShd();
            this.Shd.Set_FromObject( CellPr.Shd );
        }
        else
            this.Shd = undefined;

        if ( undefined === CellPr.TableCellMar )
            this.TableCellMar = undefined;
        else if ( null === CellPr.TableCellMar )
            this.TableCellMar = null;
        else
        {
            this.TableCellMar = {};

            if ( undefined != CellPr.TableCellMar.Bottom )
                this.TableCellMar.Bottom = new CTableMeasurement( CellPr.TableCellMar.Bottom.Type, CellPr.TableCellMar.Bottom.W );
            else
                this.TableCellMar.Bottom = undefined;

            if ( undefined != CellPr.TableCellMar.Left )
                this.TableCellMar.Left = new CTableMeasurement( CellPr.TableCellMar.Left.Type, CellPr.TableCellMar.Left.W );
            else
                this.TableCellMar.Left = undefined;

            if ( undefined != CellPr.TableCellMar.Right )
                this.TableCellMar.Right = new CTableMeasurement( CellPr.TableCellMar.Right.Type, CellPr.TableCellMar.Right.W );
            else
                this.TableCellMar.Right = undefined;

            if ( undefined != CellPr.TableCellMar.Top )
                this.TableCellMar.Top = new CTableMeasurement( CellPr.TableCellMar.Top.Type, CellPr.TableCellMar.Top.W );
            else
                this.TableCellMar.Top = undefined;
        }

        if ( undefined != CellPr.TableCellBorders )
        {
            if ( undefined != CellPr.TableCellBorders.Bottom )
            {
                this.TableCellBorders.Bottom = new CDocumentBorder();
                this.TableCellBorders.Bottom.Set_FromObject( CellPr.TableCellBorders.Bottom );
            }
            else
                this.TableCellBorders.Bottom = undefined;

            if ( undefined != CellPr.TableCellBorders.Left )
            {
                this.TableCellBorders.Left = new CDocumentBorder();
                this.TableCellBorders.Left.Set_FromObject( CellPr.TableCellBorders.Left );
            }
            else
                this.TableCellBorders.Left = undefined;

            if ( undefined != CellPr.TableCellBorders.Right )
            {
                this.TableCellBorders.Right = new CDocumentBorder();
                this.TableCellBorders.Right.Set_FromObject( CellPr.TableCellBorders.Right );
            }
            else
                this.TableCellBorders.Right = undefined;

            if ( undefined != CellPr.TableCellBorders.Top )
            {
                this.TableCellBorders.Top = new CDocumentBorder();
                this.TableCellBorders.Top.Set_FromObject( CellPr.TableCellBorders.Top );
            }
            else
                this.TableCellBorders.Top = undefined;
        }
        else
        {
            this.TableCellBorders.Bottom = undefined;
            this.TableCellBorders.Left   = undefined;
            this.TableCellBorders.Right  = undefined;
            this.TableCellBorders.Top    = undefined;
        }

        if ( undefined != CellPr.TableCellW )
            this.TableCellW = new CTableMeasurement( CellPr.TableCellW.Type, CellPr.TableCellW.W );
        else
            this.TableCellW = undefined;


        this.VAlign = CellPr.VAlign;
        this.VMerge = CellPr.VMerge;
        this.TextDirection = CellPr.TextDirection;
        this.NoWrap = CellPr.NoWrap;
    },

    Check_PresentationPr : function(Theme)
    {
        if(this.Shd)
        {
            this.Shd.Check_PresentationPr(Theme);
        }
        if(this.TableCellBorders.Bottom)
        {
            this.TableCellBorders.Bottom.Check_PresentationPr(Theme);
        }
        if(this.TableCellBorders.Left)
        {
            this.TableCellBorders.Left.Check_PresentationPr(Theme);
        }
        if(this.TableCellBorders.Right)
        {
            this.TableCellBorders.Right.Check_PresentationPr(Theme);
        }
        if(this.TableCellBorders.Top)
        {
            this.TableCellBorders.Top.Check_PresentationPr(Theme);
        }
    },

    Write_ToBinary : function(Writer)
    {
        var StartPos = Writer.GetCurPosition();
        Writer.Skip(4);
        var Flags = 0;

        if ( undefined != this.GridSpan )
        {
            Writer.WriteLong( this.GridSpan );
            Flags |= 1;
        }

        if ( undefined != this.Shd )
        {
            this.Shd.Write_ToBinary( Writer );
            Flags |= 2;
        }

        if ( undefined != this.TableCellMar )
        {
            if ( null === this.TableCellMar )
            {
                Flags |= 4;
            }
            else
            {
                if ( undefined != this.TableCellMar.Bottom )
                {
                    this.TableCellMar.Bottom.Write_ToBinary(Writer);
                    Flags |= 8;
                }

                if ( undefined != this.TableCellMar.Left )
                {
                    this.TableCellMar.Left.Write_ToBinary(Writer);
                    Flags |= 16;
                }

                if ( undefined != this.TableCellMar.Right )
                {
                    this.TableCellMar.Right.Write_ToBinary(Writer);
                    Flags |= 32;
                }

                if ( undefined != this.TableCellMar.Top )
                {
                    this.TableCellMar.Top.Write_ToBinary(Writer);
                    Flags |= 64;
                }

                Flags |= 128;
            }
        }

        if ( undefined != this.TableCellBorders.Bottom )
        {
            this.TableCellBorders.Bottom.Write_ToBinary( Writer );
            Flags |= 256;
        }

        if ( undefined != this.TableCellBorders.Left )
        {
            this.TableCellBorders.Left.Write_ToBinary( Writer );
            Flags |= 512;
        }

        if ( undefined != this.TableCellBorders.Right )
        {
            this.TableCellBorders.Right.Write_ToBinary( Writer );
            Flags |= 1024;
        }

        if ( undefined != this.TableCellBorders.Top )
        {
            this.TableCellBorders.Top.Write_ToBinary( Writer );
            Flags |= 2048;
        }

        if ( undefined != this.TableCellW )
        {
            this.TableCellW.Write_ToBinary(Writer);
            Flags |= 4096;
        }

        if ( undefined != this.VAlign )
        {
            Writer.WriteLong( this.VAlign );
            Flags |= 8192;
        }

        if ( undefined != this.VMerge )
        {
            Writer.WriteLong( this.VMerge );
            Flags |= 16384;
        }

        if (undefined !== this.TextDirection)
        {
            Writer.WriteLong( this.TextDirection );
            Flags |= 32768;
        }

        if (undefined !== this.NoWrap)
        {
            Writer.WriteBool(this.NoWrap);
            Flags |= 65536;
        }

        var EndPos = Writer.GetCurPosition();
        Writer.Seek( StartPos );
        Writer.WriteLong( Flags );
        Writer.Seek( EndPos );
    },

    Read_FromBinary : function(Reader)
    {
        var Flags = Reader.GetLong();

        if ( 1 & Flags )
            this.GridSpan = Reader.GetLong();

        if ( 2 & Flags )
        {
            this.Shd = new CDocumentShd();
            this.Shd.Read_FromBinary( Reader );
        }

        if ( 4 & Flags )
            this.TableCellMar = null;
        else if ( 128 & Flags )
        {
            this.TableCellMar = {};
            if ( 8 & Flags )
            {
                this.TableCellMar.Bottom = new CTableMeasurement(tblwidth_Auto, 0);
                this.TableCellMar.Bottom.Read_FromBinary( Reader );
            }

            if ( 16 & Flags )
            {
                this.TableCellMar.Left = new CTableMeasurement(tblwidth_Auto, 0);
                this.TableCellMar.Left.Read_FromBinary( Reader );
            }

            if ( 32 & Flags )
            {
                this.TableCellMar.Right = new CTableMeasurement(tblwidth_Auto, 0);
                this.TableCellMar.Right.Read_FromBinary( Reader );
            }

            if ( 64 & Flags )
            {
                this.TableCellMar.Top = new CTableMeasurement(tblwidth_Auto, 0);
                this.TableCellMar.Top.Read_FromBinary( Reader );
            }
        }

        if ( 256 & Flags )
        {
            this.TableCellBorders.Bottom = new CDocumentBorder();
            this.TableCellBorders.Bottom.Read_FromBinary( Reader );
        }

        if ( 512 & Flags )
        {
            this.TableCellBorders.Left = new CDocumentBorder();
            this.TableCellBorders.Left.Read_FromBinary( Reader );
        }

        if ( 1024 & Flags )
        {
            this.TableCellBorders.Right = new CDocumentBorder();
            this.TableCellBorders.Right.Read_FromBinary( Reader );
        }

        if ( 2048 & Flags )
        {
            this.TableCellBorders.Top = new CDocumentBorder();
            this.TableCellBorders.Top.Read_FromBinary( Reader );
        }

        if ( 4096 & Flags )
        {
            this.TableCellW = new CTableMeasurement(tblwidth_Auto, 0);
            this.TableCellW.Read_FromBinary( Reader );
        }

        if ( 8192 & Flags )
            this.VAlign = Reader.GetLong();

        if ( 16384 & Flags )
            this.VMerge = Reader.GetLong();

        if (32768 & Flags)
            this.TextDirection = Reader.GetLong();

        if (65536 & Flags)
            this.NoWrap = Reader.GetBool();
    }
};
CTableCellPr.prototype.Is_Empty = function()
{
	if (undefined !== this.GridSpan
		|| undefined !== this.Shd
		|| undefined !== this.TableCellMar
		|| undefined !== this.TableCellBorders.Bottom
		|| undefined !== this.TableCellBorders.Left
		|| undefined !== this.TableCellBorders.Right
		|| undefined !== this.TableCellBorders.Top
		|| undefined !== this.TableCellW
		|| undefined !== this.VAlign
		|| undefined !== this.VMerge
		|| undefined !== this.TextDirection
		|| undefined !== this.NoWrap)
		return false;

	return true;
};

function CRFonts()
{
    this.Ascii    = undefined;
    this.EastAsia = undefined;
    this.HAnsi    = undefined;
    this.CS       = undefined;
    this.Hint     = undefined;
}

CRFonts.prototype =
{
    Set_All : function(FontName, FontIndex)
    {
        this.Ascii =
        {
            Name  : FontName,
            Index : FontIndex
        };

        this.EastAsia =
        {
            Name  : FontName,
            Index : FontIndex
        };

        this.HAnsi =
        {
            Name  : FontName,
            Index : FontIndex
        };

        this.CS =
        {
            Name  : FontName,
            Index : FontIndex
        };

        this.Hint = fonthint_Default;
    },

    Copy : function()
    {
        var RFonts = new CRFonts();
        if ( undefined !== this.Ascii )
        {
            RFonts.Ascii = {Name: this.Ascii.Name, Index: this.Ascii.Index};
        }
        if ( undefined !== this.EastAsia )
        {
            RFonts.EastAsia = {Name: this.EastAsia.Name, Index: this.EastAsia.Index};
        }
        if ( undefined !== this.HAnsi )
        {
            RFonts.HAnsi = {Name: this.HAnsi.Name, Index: this.HAnsi.Index};
        }
        if ( undefined !== this.CS )
        {
            RFonts.CS = {Name: this.CS.Name, Index: this.CS.Index};
        }
        if ( undefined != this.Hint )
            this.Hint = RFonts.Hint;
        return RFonts;
    },

    Merge : function(RFonts)
    {
        if ( undefined !== RFonts.Ascii )
            this.Ascii = RFonts.Ascii;

        if ( undefined != RFonts.EastAsia )
            this.EastAsia = RFonts.EastAsia;

        if ( undefined != RFonts.HAnsi )
            this.HAnsi = RFonts.HAnsi;

        if ( undefined != RFonts.CS )
            this.CS = RFonts.CS;

        if ( undefined != RFonts.Hint )
            this.Hint = RFonts.Hint;
    },

    Init_Default : function()
    {
        this.Ascii =
        {
            Name  : "Arial",
            Index : -1
        };

        this.EastAsia =
        {
            Name  : "Arial",
            Index : -1
        };

        this.HAnsi =
        {
            Name  : "Arial",
            Index : -1
        };

        this.CS =
        {
            Name  : "Arial",
            Index : -1
        };

        this.Hint = fonthint_Default;
    },

    Set_FromObject : function(RFonts)
    {
        if ( undefined != RFonts.Ascii )
        {
            this.Ascii =
            {
                Name  : RFonts.Ascii.Name,
                Index : RFonts.Ascii.Index
            };
        }
        else
            this.Ascii = undefined;

        if ( undefined != RFonts.EastAsia )
        {
            this.EastAsia =
            {
                Name  : RFonts.EastAsia.Name,
                Index : RFonts.EastAsia.Index
            };
        }
        else
            this.EastAsia = undefined;

        if ( undefined != RFonts.HAnsi )
        {
            this.HAnsi =
            {
                Name  : RFonts.HAnsi.Name,
                Index : RFonts.HAnsi.Index
            };
        }
        else
            this.HAnsi = undefined;

        if ( undefined != RFonts.CS )
        {
            this.CS =
            {
                Name  : RFonts.CS.Name,
                Index : RFonts.CS.Index
            };
        }
        else
            this.CS = undefined;

        this.Hint = RFonts.Hint;
    },

    Compare : function(RFonts)
    {
        // Ascii
        if ( undefined !== this.Ascii && ( undefined === RFonts.Ascii || this.Ascii.Name !== RFonts.Ascii.Name ) )
            this.Ascii = undefined;

        // EastAsia
        if ( undefined !== this.EastAsia && ( undefined === RFonts.EastAsia || this.EastAsia.Name !== RFonts.EastAsia.Name ) )
            this.EastAsia = undefined;

        // HAnsi
        if ( undefined !== this.HAnsi && ( undefined === RFonts.HAnsi || this.HAnsi.Name !== RFonts.HAnsi.Name ) )
            this.HAnsi = undefined;

        // CS
        if ( undefined !== this.CS && ( undefined === RFonts.CS || this.CS.Name !== RFonts.CS.Name ) )
            this.CS = undefined;

        // Hint
        if ( undefined !== this.Hint && ( undefined === RFonts.Hint || this.Hint !== RFonts.Hint ) )
            this.Hint = undefined;
    },

    Write_ToBinary : function(Writer)
    {
        var StartPos = Writer.GetCurPosition();
        Writer.Skip(4);
        var Flags = 0;

        if ( undefined != this.Ascii )
        {
            Writer.WriteString2( this.Ascii.Name );
            Flags |= 1;
        }

        if ( undefined != this.EastAsia )
        {
            Writer.WriteString2( this.EastAsia.Name );
            Flags |= 2;
        }

        if ( undefined != this.HAnsi )
        {
            Writer.WriteString2( this.HAnsi.Name );
            Flags |= 4;
        }

        if ( undefined != this.CS )
        {
            Writer.WriteString2( this.CS.Name );
            Flags |= 8;
        }

        if ( undefined != this.Hint )
        {
            Writer.WriteLong( this.Hint );
            Flags |= 16;
        }

        var EndPos = Writer.GetCurPosition();
        Writer.Seek( StartPos );
        Writer.WriteLong( Flags );
        Writer.Seek( EndPos );
    },

    Read_FromBinary : function(Reader)
    {
        var Flags = Reader.GetLong();

        // Ascii
        if ( Flags & 1 )
            this.Ascii = { Name : Reader.GetString2(), Index : -1 };

        // EastAsia
        if ( Flags & 2 )
            this.EastAsia = { Name : Reader.GetString2(), Index : -1 };

        // HAnsi
        if ( Flags & 4 )
            this.HAnsi = { Name : Reader.GetString2(), Index : -1 };

        // CS
        if ( Flags & 8 )
            this.CS = { Name : Reader.GetString2(), Index : -1 };

        // Hint
        if ( Flags & 16 )
            this.Hint = Reader.GetLong();
    },

    Is_Equal : function(RFonts)
    {
        if ((undefined === this.Ascii && undefined !== RFonts.Ascii) || (undefined !== this.Ascii && (undefined === RFonts.Ascii || this.Ascii.Name !== RFonts.Ascii.Name)))
            return false;

        if ((undefined === this.EastAsia && undefined !== RFonts.EastAsia) || (undefined !== this.EastAsia && (undefined === RFonts.EastAsia || this.EastAsia.Name !== RFonts.EastAsia.Name)))
            return false;

        if ((undefined === this.HAnsi && undefined !== RFonts.HAnsi) || (undefined !== this.HAnsi && (undefined === RFonts.HAnsi || this.HAnsi.Name !== RFonts.HAnsi.Name)))
            return false;

        if ((undefined == this.CS && undefined !== RFonts.CS) || (undefined !== this.CS && (undefined === RFonts.CS || this.CS.Name !== RFonts.CS.Name)))
            return false;

        if ((undefined === this.Hint && undefined !== RFonts.Hint) || (undefined !== this.Hint && (undefined === RFonts.Hint || this.Hint !== RFonts.Hint)))
            return false;

        return true;
    }
};
CRFonts.prototype.Is_Empty = function()
{
	if (undefined !== this.Ascii
		|| undefined !== this.EastAsia
		|| undefined !== this.HAnsi
		|| undefined !== this.CS
		|| undefined !== this.Hint)
		return false;

	return true;
};

function CLang()
{
    this.Bidi     = undefined;
    this.EastAsia = undefined;
    this.Val      = undefined;
}

CLang.prototype =
{
    Copy : function()
    {
        var Lang = new CLang();
        Lang.Bidi     = this.Bidi;
        Lang.EastAsia = this.EastAsia;
        Lang.Val      = this.Val;
        return Lang;
    },

    Merge : function(Lang)
    {
        if ( undefined !== Lang.Bidi )
            this.Bidi = Lang.Bidi;

        if ( undefined !== Lang.EastAsia )
            this.EastAsia = Lang.EastAsia;

        if ( undefined !== Lang.Val )
            this.Val = Lang.Val;
    },

    Init_Default : function()
    {
        this.Bidi     = lcid_enUS;
        this.EastAsia = lcid_enUS;
        this.Val      = lcid_enUS;
    },

    Set_FromObject : function(Lang)
    {
        this.Bidi     = Lang.Bidi;
        this.EastAsia = Lang.EastAsia;
        this.Val      = Lang.Val;
    },

    Compare : function(Lang)
    {
        // Bidi
        if ( undefined !== this.Bidi && this.Bidi !== Lang.Bidi )
            this.Bidi = undefined;

        // EastAsia
        if ( undefined !== this.EastAsia && this.EastAsia !== Lang.EastAsia )
            this.EastAsia = undefined;

        // Val
        if ( undefined !== this.Val && this.Val !== Lang.Val )
            this.Val = undefined;
    },

    Write_ToBinary : function(Writer)
    {
        var StartPos = Writer.GetCurPosition();
        Writer.Skip(4);
        var Flags = 0;

        if ( undefined != this.Bidi )
        {
            Writer.WriteLong( this.Bidi );
            Flags |= 1;
        }

        if ( undefined != this.EastAsia )
        {
            Writer.WriteLong( this.EastAsia );
            Flags |= 2;
        }

        if ( undefined != this.Val )
        {
            Writer.WriteLong( this.Val );
            Flags |= 4;
        }

        var EndPos = Writer.GetCurPosition();
        Writer.Seek( StartPos );
        Writer.WriteLong( Flags );
        Writer.Seek( EndPos );
    },

    Read_FromBinary : function(Reader)
    {
        var Flags = Reader.GetLong();

        // Bidi
        if ( Flags & 1 )
            this.Bidi = Reader.GetLong();

        // EastAsia
        if ( Flags & 2 )
            this.EastAsia = Reader.GetLong();

        // Val
        if ( Flags & 4 )
            this.Val = Reader.GetLong();
    },

    Is_Equal : function(Lang)
    {
        if (this.Bidi !== Lang.Bidi
            || this.EastAsia !== Lang.EastAsia
            || this.Val !== Lang.Val)
            return false;

        return true;
    }
};
CLang.prototype.Is_Empty = function()
{
	if (undefined !== this.Bidi
		|| undefined !== this.EastAsia
		|| undefined !== this.Val)
		return false;

	return true;
};

function CTextPr()
{
    this.Bold       = undefined; // Жирный текст
    this.Italic     = undefined; // Наклонный текст
    this.Strikeout  = undefined; // Зачеркивание
    this.Underline  = undefined;
    this.FontFamily = undefined;
    this.FontSize   = undefined;
    this.Color      = undefined;
    this.VertAlign  = undefined;
    this.HighLight  = undefined; // highlight_None/Color
    this.RStyle     = undefined;
    this.Spacing    = undefined; // Дополнительное расстояние между символвами
    this.DStrikeout = undefined; // Двойное зачеркивание
    this.Caps       = undefined;
    this.SmallCaps  = undefined;
    this.Position   = undefined; // Смещение по Y

    this.RFonts     = new CRFonts();
    this.BoldCS     = undefined;
    this.ItalicCS   = undefined;
    this.FontSizeCS = undefined;
    this.CS         = undefined;
    this.RTL        = undefined;
    this.Lang       = new CLang();
    this.Unifill    = undefined;
    this.FontRef    = undefined;

    this.Shd        = undefined;
    this.Vanish     = undefined;

    this.TextOutline = undefined;
    this.TextFill    = undefined;
}

CTextPr.prototype =
{
    Clear : function()
    {
        this.Bold       = undefined;
        this.Italic     = undefined;
        this.Strikeout  = undefined;
        this.Underline  = undefined;
        this.FontFamily = undefined;
        this.FontSize   = undefined;
        this.Color      = undefined;
        this.VertAlign  = undefined;
        this.HighLight  = undefined;
        this.RStyle     = undefined;
        this.Spacing    = undefined;
        this.DStrikeout = undefined;
        this.Caps       = undefined;
        this.SmallCaps  = undefined;
        this.Position   = undefined;

        this.RFonts     = new CRFonts();
        this.BoldCS     = undefined;
        this.ItalicCS   = undefined;
        this.FontSizeCS = undefined;
        this.CS         = undefined;
        this.RTL        = undefined;
        this.Lang       = new CLang();
        this.Unifill    = undefined;
        this.FontRef    = undefined;
        this.Shd        = undefined;
        this.Vanish     = undefined;
        this.TextOutline = undefined;
        this.TextFill    = undefined;
        this.AscFill    = undefined;
        this.AscUnifill = undefined;
        this.AscLine    = undefined;
    },

    Copy : function(bCopyPrChange)
    {
        var TextPr = new CTextPr();
        TextPr.Bold      = this.Bold;
        TextPr.Italic    = this.Italic;
        TextPr.Strikeout = this.Strikeout;
        TextPr.Underline = this.Underline;

        if ( undefined != this.FontFamily )
        {
            TextPr.FontFamily = {};
            TextPr.FontFamily.Name  = this.FontFamily.Name;
            TextPr.FontFamily.Index = this.FontFamily.Index;
        }

        TextPr.FontSize   = this.FontSize;

        if ( undefined != this.Color )
            TextPr.Color = new CDocumentColor(this.Color.r, this.Color.g, this.Color.b, this.Color.Auto);

        TextPr.VertAlign = this.VertAlign;
        TextPr.HighLight = this.Copy_HighLight();

        TextPr.RStyle     = this.RStyle;
        TextPr.Spacing    = this.Spacing;
        TextPr.DStrikeout = this.DStrikeout;
        TextPr.Caps       = this.Caps;
        TextPr.SmallCaps  = this.SmallCaps;
        TextPr.Position   = this.Position;
        TextPr.RFonts     = this.RFonts.Copy();
        TextPr.BoldCS     = this.BoldCS;
        TextPr.ItalicCS   = this.ItalicCS;
        TextPr.FontSizeCS = this.FontSizeCS;
        TextPr.CS         = this.CS;
        TextPr.RTL        = this.RTL;
        TextPr.Lang       = this.Lang.Copy();
        if(undefined != this.Unifill)
            TextPr.Unifill = this.Unifill.createDuplicate();
        if(undefined != this.FontRef)
            TextPr.FontRef = this.FontRef.createDuplicate();
        
        if (undefined !== this.Shd )
            TextPr.Shd = this.Shd.Copy();
        
        TextPr.Vanish     = this.Vanish;

        if (true === bCopyPrChange && undefined !== this.PrChange)
        {
            TextPr.PrChange   = this.PrChange.Copy();
            TextPr.ReviewInfo = this.ReviewInfo.Copy();
        }
        if(undefined != this.TextOutline)
        {
            TextPr.TextOutline = this.TextOutline.createDuplicate();
        }
        if(undefined != this.TextFill)
        {
            TextPr.TextFill = this.TextFill.createDuplicate();
        }

        return TextPr;
    },

    Copy_HighLight : function()
    {
        if ( undefined === this.HighLight )
            return undefined;
        else if ( highlight_None === this.HighLight )
            return highlight_None;
        else
            return this.HighLight.Copy();

        return undefined;
    },

    Merge : function(TextPr)
    {
        if ( undefined != TextPr.Bold )
            this.Bold = TextPr.Bold;

        if ( undefined != TextPr.Italic )
            this.Italic = TextPr.Italic;

        if ( undefined != TextPr.Strikeout )
            this.Strikeout = TextPr.Strikeout;

        if ( undefined != TextPr.Underline )
            this.Underline = TextPr.Underline;

        if ( undefined != TextPr.FontFamily )
        {
            this.FontFamily = {};
            this.FontFamily.Name  = TextPr.FontFamily.Name;
            this.FontFamily.Index = TextPr.FontFamily.Index;
        }

        if ( undefined != TextPr.FontSize )
            this.FontSize = TextPr.FontSize;

        if ( undefined != TextPr.Color )
            this.Color = TextPr.Color.Copy();

        if ( undefined != TextPr.VertAlign )
            this.VertAlign = TextPr.VertAlign;

        if ( undefined === TextPr.HighLight )
        {}
        else if ( highlight_None === TextPr.HighLight )
            this.HighLight = highlight_None;
        else
            this.HighLight = TextPr.HighLight.Copy();

        if ( undefined != TextPr.RStyle )
            this.RStyle = TextPr.RStyle;

        if ( undefined != TextPr.Spacing )
            this.Spacing = TextPr.Spacing;

        if ( undefined != TextPr.DStrikeout )
            this.DStrikeout = TextPr.DStrikeout;

        if ( undefined != TextPr.SmallCaps )
            this.SmallCaps = TextPr.SmallCaps;

        if ( undefined != TextPr.Caps )
            this.Caps = TextPr.Caps;

        if ( undefined != TextPr.Position )
            this.Position = TextPr.Position;

        this.RFonts.Merge( TextPr.RFonts );

        if ( undefined != TextPr.BoldCS )
            this.BoldCS = TextPr.BoldCS;

        if ( undefined != TextPr.ItalicCS )
            this.ItalicCS = TextPr.ItalicCS;

        if ( undefined != TextPr.FontSizeCS )
            this.FontSizeCS = TextPr.FontSizeCS;

        if ( undefined != TextPr.CS )
            this.CS = TextPr.CS;

        if ( undefined != TextPr.RTL )
            this.RTL = TextPr.RTL;

        this.Lang.Merge( TextPr.Lang );

        if(undefined != TextPr.Unifill)
            this.Unifill = TextPr.Unifill.createDuplicate();
        else
        {
            if(undefined != TextPr.Color)
            {
                this.Unifill = undefined;
            }
        }
        if(undefined != TextPr.FontRef)
        {
            this.FontRef = TextPr.FontRef.createDuplicate();
        }
        
        if ( undefined !== TextPr.Shd )
            this.Shd = TextPr.Shd.Copy();
        
        if ( undefined !== TextPr.Vanish )
            this.Vanish = TextPr.Vanish;

        if(undefined != TextPr.TextOutline)
        {
            this.TextOutline = TextPr.TextOutline.createDuplicate();
        }
        if(undefined != TextPr.TextFill)
        {
            this.TextFill = TextPr.TextFill.createDuplicate();
        }
    },

    Init_Default : function()
    {
        this.Bold       = false;
        this.Italic     = false;
        this.Underline  = false;
        this.Strikeout  = false;
        this.FontFamily =
        {
            Name  : "Arial",
            Index : -1
        };
        this.FontSize   = 11;
        this.Color      = new CDocumentColor(0, 0, 0, true);
        this.VertAlign  = AscCommon.vertalign_Baseline;
        this.HighLight  = highlight_None;
        this.RStyle     = undefined;
        this.Spacing    = 0;
        this.DStrikeout = false;
        this.SmallCaps  = false;
        this.Caps       = false;
        this.Position   = 0;
        this.RFonts.Init_Default();
        this.BoldCS     = false;
        this.ItalicCS   = false;
        this.FontSizeCS = 11;
        this.CS         = false;
        this.RTL        = false;
        this.Lang.Init_Default();
        this.Unifill    = undefined;
        this.FontRef    = undefined;
        this.Shd        = undefined;     
        this.Vanish     = false;

        this.TextOutline = undefined;
        this.TextFill    = undefined;
    },

    Set_FromObject : function(TextPr)
    {
        this.Bold      = TextPr.Bold;
        this.Italic    = TextPr.Italic;
        this.Strikeout = TextPr.Strikeout;
        this.Underline = TextPr.Underline;

        if ( undefined != TextPr.FontFamily )
        {
            this.FontFamily = {};
            this.FontFamily.Name  = TextPr.FontFamily.Name;
            this.FontFamily.Index = TextPr.FontFamily.Index;
        }
        else
            this.FontFamily = undefined;

        this.FontSize   = TextPr.FontSize;

        if ( undefined != TextPr.Color )
            this.Color = new CDocumentColor( TextPr.Color.r, TextPr.Color.g, TextPr.Color.b, TextPr.Color.Auto );
        else
            this.Color = undefined;

        this.VertAlign = TextPr.VertAlign;

        if ( undefined === TextPr.HighLight )
            this.HighLight = undefined;
        else if ( highlight_None === TextPr.HighLight )
            this.HighLight = highlight_None;
        else
            this.HighLight = new CDocumentColor( TextPr.HighLight.r, TextPr.HighLight.g, TextPr.HighLight.b );

        if ( undefined != TextPr.RStyle )
            this.RStyle = TextPr.RStyle;

        this.Spacing    = TextPr.Spacing;
        this.DStrikeout = TextPr.DStrikeout;
        this.Caps       = TextPr.Caps;
        this.SmallCaps  = TextPr.SmallCaps;
        this.Position   = TextPr.Position;

        if ( undefined != TextPr.RFonts )
            this.RFonts.Set_FromObject( TextPr.RFonts );

        this.BoldCS       = TextPr.BoldCS;
        this.ItalicCS     = TextPr.ItalicCS;
        this.FontSizeCS   = TextPr.FontSizeCS;
        this.CS           = TextPr.CS;
        this.RTL          = TextPr.RTL;

        if ( undefined != TextPr.Lang )
            this.Lang.Set_FromObject( TextPr.Lang );

        if ( undefined != TextPr.Unifill )
            this.Unifill =  TextPr.Unifill ;

        if( undefined != TextPr.FontRef )
        {
            this.FontRef = TextPr.FontRef;
        }
        
        if ( undefined !== TextPr.Shd )
        {
            this.Shd = new CDocumentShd();
            this.Shd.Set_FromObject( TextPr.Shd );
        }
        else
            this.Shd = undefined;
        
        this.Vanish   = TextPr.Vanish;


        if(undefined != TextPr.TextFill)
        {
            this.TextFill = TextPr.TextFill;
        }

        if(undefined != TextPr.TextOutline)
        {
            this.TextOutline = TextPr.TextOutline;
        }
        if(undefined != TextPr.AscFill)
        {
            this.AscFill = TextPr.AscFill;
        }
        if(undefined != TextPr.AscUnifill)
        {
            this.AscUnifill = TextPr.AscUnifill;
        }
        if(undefined != TextPr.AscLine)
        {
            this.AscLine = TextPr.AscLine;
        }
    },

    Check_PresentationPr: function()
    {
        if(this.FontRef && !this.Unifill)
        {
            var prefix;
            if(this.FontRef.idx === AscFormat.fntStyleInd_minor)
            {
                prefix = "+mn-";
            }
            else
            {
                prefix = "+mj-";
            }
            this.RFonts.Set_FromObject(
                {
                    Ascii: {
                        Name: prefix+"lt",
                        Index: -1
                    },
                    EastAsia: {
                        Name: prefix+"ea",
                        Index: -1
                    },
                    HAnsi: {
                        Name: prefix+"lt",
                        Index: -1
                    },
                    CS: {
                        Name: prefix+"lt",
                        Index: -1
                    }
                }
            );
            if(this.FontRef.Color && !this.Unifill)
            {
                this.Unifill = AscFormat.CreateUniFillByUniColorCopy(this.FontRef.Color);
            }
        }
    },

    Compare : function(TextPr)
    {
        // Bold
        if ( undefined !== this.Bold && this.Bold !== TextPr.Bold )
            this.Bold = undefined;

        // Italic
        if ( undefined !== this.Italic && this.Italic !== TextPr.Italic )
            this.Italic = undefined;

        // Strikeout
        if ( undefined !== this.Strikeout && this.Strikeout !== TextPr.Strikeout )
            this.Strikeout = undefined;

        // Underline
        if ( undefined !== this.Underline && this.Underline !== TextPr.Underline )
            this.Underline = undefined;

        // FontFamily
        if ( undefined !== this.FontFamily && ( undefined === TextPr.FontFamily || this.FontFamily.Name !== TextPr.FontFamily.Name ) )
            this.FontFamily = undefined;

        // FontSize
        if ( undefined !== this.FontSize && ( undefined === TextPr.FontSize || Math.abs( this.FontSize - TextPr.FontSize ) >= 0.001 ) )
            this.FontSize = undefined;

        // Color
        if ( undefined !== this.Color && ( undefined === TextPr.Color || true !== this.Color.Compare(TextPr.Color) ) )
            this.Color = undefined;

        // VertAlign
        if ( undefined !== this.VertAlign && this.VertAlign !== TextPr.VertAlign )
            this.VertAlign = undefined;

        // HighLight
        if ( undefined !== this.HighLight && ( undefined === TextPr.HighLight || ( highlight_None === this.HighLight && highlight_None !== TextPr.HighLight )  || ( highlight_None !== this.HighLight && highlight_None === TextPr.HighLight ) || ( highlight_None !== this.HighLight && highlight_None !== TextPr.HighLight && true !== this.HighLight.Compare( TextPr.HighLight ) ) ) )
            this.HighLight = undefined;

        // RStyle
        if ( undefined !== this.RStyle && ( undefined === TextPr.RStyle || this.RStyle !== TextPr.RStyle ) )
            this.RStyle = undefined;

        // Spacing
        if ( undefined !== this.Spacing && ( undefined === TextPr.Spacing || Math.abs(this.Spacing - TextPr.Spacing) >= 0.001 ) )
            this.Spacing = undefined;

        // DStrikeout
        if ( undefined !== this.DStrikeout && ( undefined === TextPr.DStrikeout || this.DStrikeout !== TextPr.DStrikeout ) )
            this.DStrikeout = undefined;

        // Caps
        if ( undefined !== this.Caps && ( undefined === TextPr.Caps || this.Caps !== TextPr.Caps ) )
            this.Caps = undefined;

        // SmallCaps
        if ( undefined !== this.SmallCaps && ( undefined === TextPr.SmallCaps || this.SmallCaps !== TextPr.SmallCaps ) )
            this.SmallCaps = undefined;

        // Position
        if ( undefined !== this.Position && ( undefined === TextPr.Position || Math.abs(this.Position - TextPr.Position) >= 0.001 ) )
            this.Position = undefined;

        // RFonts
        this.RFonts.Compare( TextPr.RFonts );

        // BoldCS
        if ( undefined !== this.BoldCS && this.BoldCS !== TextPr.BoldCS )
            this.BoldCS = undefined;

        // ItalicCS
        if ( undefined !== this.ItalicCS && this.ItalicCS !== TextPr.ItalicCS )
            this.ItalicCS = undefined;

        // FontSizeCS
        if ( undefined !== this.FontSizeCS && ( undefined === TextPr.FontSizeCS || Math.abs( this.FontSizeCS - TextPr.FontSizeCS ) >= 0.001 ) )
            this.FontSizeCS = undefined;

        // CS
        if ( undefined !== this.CS && this.CS !== TextPr.CS )
            this.CS = undefined;

        // RTL
        if ( undefined !== this.RTL && this.RTL !== TextPr.RTL )
            this.RTL = undefined;

        // Lang
        this.Lang.Compare( TextPr.Lang );
        //Result_TextPr.Unifill = CompareUniFill(this.Unifill, TextPr.Unifill);       
        
        // Vanish
        if ( undefined !== this.Vanish && this.Vanish !== TextPr.Vanish )
            this.Vanish = undefined;

        if(undefined !== this.Unifill && !this.Unifill.IsIdentical(TextPr.Unifill))
        {
            this.Unifill = AscFormat.CompareUniFill(this.Unifill, TextPr.Unifill);
            if(null === this.Unifill){
                this.Unifill = undefined;
            }
            this.Color = undefined;
            this.TextFill = undefined;
        }


        if(undefined !== this.TextFill &&  !this.TextFill.IsIdentical(TextPr.TextFill))
        {
            this.Unifill = undefined;
            this.Color = undefined;
            this.TextFill = AscFormat.CompareUniFill(this.TextFill, TextPr.TextFill);
            if(null === this.TextFill){
                this.TextFill = undefined;
            }
        }


        if(undefined !== this.TextOutline &&  !this.TextOutline.IsIdentical(TextPr.TextOutline)){
            if(TextPr.TextOutline !== undefined){
                this.TextOutline = this.TextOutline.compare(TextPr.TextOutline);
            }
            else{
                this.TextOutline = undefined;
            }

        }




        return this;
    },

    Write_ToBinary : function(Writer)
    {
        var StartPos = Writer.GetCurPosition();
        Writer.Skip(4);
        var Flags = 0;

        if ( undefined != this.Bold )
        {
            Writer.WriteBool( this.Bold );
            Flags |= 1;
        }

        if ( undefined != this.Italic )
        {
            Writer.WriteBool( this.Italic );
            Flags |= 2;
        }

        if ( undefined != this.Underline )
        {
            Writer.WriteBool( this.Underline );
            Flags |= 4;
        }

        if ( undefined != this.Strikeout )
        {
            Writer.WriteBool( this.Strikeout );
            Flags |= 8;
        }

        if ( undefined != this.FontFamily )
        {
            Writer.WriteString2( this.FontFamily.Name );
            Flags |= 16;
        }

        if ( undefined != this.FontSize )
        {
            Writer.WriteDouble( this.FontSize );
            Flags |= 32;
        }

        if ( undefined != this.Color )
        {
            this.Color.Write_ToBinary(Writer);
            Flags |= 64;
        }

        if ( undefined != this.VertAlign )
        {
            Writer.WriteLong( this.VertAlign );
            Flags |= 128;
        }

        if ( undefined != this.HighLight )
        {
            if ( highlight_None === this.HighLight )
            {
                Writer.WriteLong( highlight_None );
            }
            else
            {
                Writer.WriteLong( 0 );
                this.HighLight.Write_ToBinary( Writer );
            }

            Flags |= 256;
        }

        if ( undefined != this.RStyle )
        {
            Writer.WriteString2( this.RStyle );
            Flags |= 512;
        }

        if ( undefined != this.Spacing )
        {
            Writer.WriteDouble( this.Spacing );
            Flags |= 1024;
        }

        if ( undefined != this.DStrikeout )
        {
            Writer.WriteBool( this.DStrikeout );
            Flags |= 2048;
        }

        if ( undefined != this.Caps )
        {
            Writer.WriteBool( this.Caps );
            Flags |= 4096;
        }

        if ( undefined != this.SmallCaps )
        {
            Writer.WriteBool( this.SmallCaps );
            Flags |= 8192;
        }

        if ( undefined != this.Position )
        {
            Writer.WriteDouble( this.Position );
            Flags |= 16384;
        }

        if ( undefined != this.RFonts )
        {
            this.RFonts.Write_ToBinary( Writer );
            Flags |= 32768;
        }

        if ( undefined != this.BoldCS )
        {
            Writer.WriteBool( this.BoldCS );
            Flags |= 65536;
        }

        if ( undefined != this.ItalicCS )
        {
            Writer.WriteBool( this.ItalicCS );
            Flags |= 131072;
        }

        if ( undefined != this.FontSizeCS )
        {
            Writer.WriteDouble( this.FontSizeCS );
            Flags |= 262144;
        }

        if ( undefined != this.CS )
        {
            Writer.WriteBool( this.CS );
            Flags |= 524288;
        }

        if ( undefined != this.RTL )
        {
            Writer.WriteBool( this.RTL );
            Flags |= 1048576;
        }

        if ( undefined != this.Lang )
        {
            this.Lang.Write_ToBinary( Writer );
            Flags |= 2097152;
        }

        if(undefined != this.Unifill)
        {
            this.Unifill.Write_ToBinary(Writer);
            Flags |= 4194304;
        }
        
        if ( undefined !== this.Shd )
        {
            this.Shd.Write_ToBinary(Writer);
            Flags |= 8388608;
        }
        
        if ( undefined !== this.Vanish )
        {
            Writer.WriteBool( this.Vanish );    
            Flags |= 16777216;
        }

        if( undefined !== this.FontRef )
        {
            this.FontRef.Write_ToBinary(Writer);
            Flags |= 33554432;
        }

        if (undefined !== this.PrChange)
        {
            this.PrChange.Write_ToBinary(Writer);
            Flags |= 67108864;
        }
        if(undefined !== this.TextOutline)
        {
            this.TextOutline.Write_ToBinary(Writer);
            Flags |= 134217728;
        }
        if(undefined !== this.TextFill)
        {
            this.TextFill.Write_ToBinary(Writer);
            Flags |= 268435456;
        }

        if (undefined !== this.PrChange)
        {
            this.PrChange.Write_ToBinary(Writer);
            this.ReviewInfo.Write_ToBinary(Writer);
            Flags |= 536870912;
        }

        var EndPos = Writer.GetCurPosition();
        Writer.Seek( StartPos );
        Writer.WriteLong( Flags );
        Writer.Seek( EndPos );
    },

    Read_FromBinary : function(Reader)
    {
        var Flags = Reader.GetLong();

        // Bold
        if ( Flags & 1 )
            this.Bold = Reader.GetBool();

        // Italic
        if ( Flags & 2 )
            this.Italic = Reader.GetBool();

        // Underline
        if ( Flags & 4 )
            this.Underline = Reader.GetBool();

        // Strikeout
        if ( Flags & 8 )
            this.Strikeout = Reader.GetBool();

        // FontFamily
        if ( Flags & 16 )
            this.FontFamily = { Name : Reader.GetString2(), Index : -1 };

        // FontSize
        if ( Flags & 32 )
            this.FontSize = Reader.GetDouble();

        // Color
        if ( Flags & 64 )
        {
            this.Color = new CDocumentColor(0, 0, 0);
            this.Color.Read_FromBinary(Reader);
        }

        // VertAlign
        if ( Flags & 128 )
            this.VertAlign = Reader.GetLong();

        // HighLight
        if ( Flags & 256 )
        {
            var HL_type = Reader.GetLong();
            if ( highlight_None == HL_type )
                this.HighLight = highlight_None;
            else
            {
                this.HighLight = new CDocumentColor(0, 0, 0);
                this.HighLight.Read_FromBinary(Reader);
            }
        }

        // RStyle
        if ( Flags & 512 )
            this.RStyle = Reader.GetString2();

        // Spacing
        if ( Flags & 1024 )
            this.Spacing = Reader.GetDouble();

        // DStrikeout
        if ( Flags & 2048 )
            this.DStrikeout = Reader.GetBool();

        // Caps
        if ( Flags & 4096 )
            this.Caps = Reader.GetBool();

        // SmallCaps
        if ( Flags & 8192 )
            this.SmallCaps = Reader.GetBool();

        // Position
        if ( Flags & 16384 )
            this.Position = Reader.GetDouble();

        // RFonts
        if ( Flags & 32768 )
            this.RFonts.Read_FromBinary( Reader );

        // BoldCS
        if ( Flags & 65536 )
            this.BoldCS = Reader.GetBool();

        // ItalicCS
        if ( Flags & 131072 )
            this.ItalicCS = Reader.GetBool();

        // FontSizeCS
        if ( Flags & 262144 )
            this.FontSizeCS = Reader.GetDouble();

        // CS
        if ( Flags & 524288 )
            this.CS = Reader.GetBool();

        // RTL
        if ( Flags & 1048576 )
            this.RTL = Reader.GetBool();

        // Lang
        if ( Flags & 2097152 )
            this.Lang.Read_FromBinary( Reader );

        // Unifill
        if ( Flags & 4194304 )
        {
            this.Unifill = new AscFormat.CUniFill()
            this.Unifill.Read_FromBinary( Reader );
        }
        
        // Shd
        if ( Flags & 8388608 )
        {
            this.Shd = new CDocumentShd();
            this.Shd.Read_FromBinary( Reader );
        }
        
        // Vanish
        if ( Flags & 16777216 )
            this.Vanish = Reader.GetBool();

        if ( Flags & 33554432 )
        {
            this.FontRef = new AscFormat.FontRef();
            this.FontRef.Read_FromBinary(Reader);
        }

        if (Flags & 67108864)
        {
            this.PrChange = new CTextPr();
            this.PrChange.Read_FromBinary(Reader);
        }

        if(Flags & 134217728)
        {
            this.TextOutline = new AscFormat.CLn();
            this.TextOutline.Read_FromBinary(Reader);
        }

        if(Flags & 268435456)
        {
            this.TextFill = new AscFormat.CUniFill();
            this.TextFill.Read_FromBinary(Reader);
        }

        if (Flags & 536870912)
        {
            this.PrChange   = new CTextPr();
            this.ReviewInfo = new CReviewInfo();
            this.PrChange.Read_FromBinary(Reader);
            this.ReviewInfo.Read_FromBinary(Reader);
        }
    },

    Check_NeedRecalc : function()
    {
        // Потому что в параграфе внутри Internal_recalculate_0 кэшируются ParaTextPr
        return true;

        if ( undefined != this.Bold )
            return true;

        if ( undefined != this.Italic )
            return true;

        if ( undefined != this.FontFamily )
            return true;

        if ( undefined != this.FontSize )
            return true;

        if ( undefined != this.VertAlign )
            return true;

        if ( undefined != this.Spacing )
            return true;

        if ( undefined != this.Caps )
            return true;

        if ( undefined != this.SmallCaps )
            return true;

        if ( undefined != this.Position )
            return true;

        if ( undefined != this.RFonts.Ascii )
            return true;

        if ( undefined != this.RFonts.EastAsia )
            return true;

        if ( undefined != this.RFonts.HAnsi )
            return true;

        if ( undefined != this.RFonts.CS )
            return true;

        if ( undefined != this.RTL || undefined != this.CS || undefined != this.BoldCS || undefined != this.ItalicCS || undefined != this.FontSizeCS )
            return true;

        if ( undefined != this.Lang.Val )
            return true;

        // Потому что в параграфе внутри Internal_recalculate_0 кэшируются ParaTextPr
        if ( undefined != this.Color )
            return true;

        if ( undefined != this.HighLight )
            return true;
        
        if ( undefined != this.Shd )
            return true;

        return false;
    },

    Get_FontKoef : function()
    {
        var dFontKoef  = 1;

        switch ( this.VertAlign )
        {
            case AscCommon.vertalign_Baseline:
            {
                dFontKoef = 1;
                break;
            }
            case AscCommon.vertalign_SubScript:
            case AscCommon.vertalign_SuperScript:
            {
                dFontKoef = vertalign_Koef_Size;
                break;
            }
        }

        return dFontKoef;
    },

    Document_Get_AllFontNames : function(AllFonts)
    {
        if ( undefined != this.RFonts.Ascii )
            AllFonts[this.RFonts.Ascii.Name] = true;

        if ( undefined != this.RFonts.HAnsi )
            AllFonts[this.RFonts.HAnsi.Name] = true;

        if ( undefined != this.RFonts.EastAsia )
            AllFonts[this.RFonts.EastAsia.Name] = true;

        if ( undefined != this.RFonts.CS )
            AllFonts[this.RFonts.CS.Name] = true;
    },

    Document_CreateFontMap : function(FontMap, FontScheme)
    {
        var Style   = ( true === this.Bold   ? 1 : 0 ) + ( true === this.Italic   ? 2 : 0 );
        var StyleCS = ( true === this.BoldCS ? 1 : 0 ) + ( true === this.ItalicCS ? 2 : 0 );
        var Size    = this.FontSize;
        var SizeCS  = this.FontSizeCS;

        var RFonts = this.RFonts;
        var CheckedName;
        if ( undefined != RFonts.Ascii )
        {
            CheckedName = FontScheme.checkFont(RFonts.Ascii.Name);
            var Key = "" + CheckedName + "_" + Style + "_" + Size;
            FontMap[Key] =
            {
                Name  : CheckedName,
                Style : Style,
                Size  : Size
            };
        }

        if ( undefined != RFonts.EastAsia )
        {
            CheckedName = FontScheme.checkFont(RFonts.EastAsia.Name);
            var Key = "" + CheckedName + "_" + Style + "_" + Size;
            FontMap[Key] =
            {
                Name  : CheckedName,
                Style : Style,
                Size  : Size
            };
        }

        if ( undefined != RFonts.HAnsi )
        {
            CheckedName = FontScheme.checkFont(RFonts.HAnsi.Name);
            var Key = "" + CheckedName + "_" + Style + "_" + Size;
            FontMap[Key] =
            {
                Name  : CheckedName,
                Style : Style,
                Size  : Size
            };
        }

        if ( undefined != RFonts.CS )
        {

            CheckedName = FontScheme.checkFont(RFonts.CS.Name);
            var Key = "" + CheckedName + "_" + StyleCS + "_" + SizeCS;
            FontMap[Key] =
            {
                Name  : CheckedName,
                Style : StyleCS,
                Size  : SizeCS
            };
        }
    },

    isEqual: function(TextPrOld, TextPrNew)
    {
        if(TextPrOld == undefined || TextPrNew == undefined)
            return false;
        for(var TextPr in TextPrOld)
        {
            if(typeof TextPrOld[TextPr] == 'object')
            {
                /*for(var cpPr in TextPrOld[TextPr])
                 {
                 if(TextPrOld[TextPr][cpPr] != TextPrNew[TextPr][cpPr])
                 return false;
                 }*/
                this.isEqual(TextPrOld[TextPr],TextPrNew[TextPr]);
            }
            else
            {
                if(typeof TextPrOld[TextPr] == "number" && typeof TextPrNew[TextPr] == "number")
                {
                    if(Math.abs(TextPrOld[TextPr] - TextPrNew[TextPr]) > 0.001)
                        return false;
                }
                else if(TextPrOld[TextPr] != TextPrNew[TextPr])
                    return false;
            }
        }
        return true;
    },

    Is_Equal : function(TextPr)
    {
        if (this.Bold !== TextPr.Bold)
            return false;

        if (this.Italic !== TextPr.Italic)
            return false;

        if (this.Strikeout !== TextPr.Strikeout)
            return false;

        if (this.Underline !== TextPr.Underline)
            return false;

		if ((undefined === this.FontFamily && undefined !== TextPr.FontFamily) || (undefined !== this.FontFamily && (undefined === TextPr.FontFamily || this.FontFamily.Name !== TextPr.FontFamily.Name)))
			return false;

        if (false
            || (undefined === this.FontSize
                && undefined !== TextPr.FontSize)
            || (undefined !== this.FontSize
                && (undefined === TextPr.FontSize
                    || Math.abs(this.FontSize - TextPr.FontSize) >= 0.001)))
            return false;

        if ((undefined === this.Color && undefined !== TextPr.Color) || (undefined !== this.Color && (undefined === TextPr.Color || true !== this.Color.Compare(TextPr.Color))))
            return false;

        if (this.VertAlign !== TextPr.VertAlign)
            return false;

        if ((undefined === this.HighLight && undefined !== TextPr.HighLight) || (undefined !== this.HighLight && (undefined === TextPr.HighLight || (highlight_None === this.HighLight && highlight_None !== TextPr.HighLight) || (highlight_None !== this.HighLight && highlight_None === TextPr.HighLight) || (highlight_None !== this.HighLight && highlight_None !== TextPr.HighLight && true !== this.HighLight.Compare(TextPr.HighLight)))))
            return false;

        if (this.RStyle !== TextPr.RStyle)
            return false;

        if ((undefined === this.Spacing && undefined !== TextPr.Spacing) || (undefined !== this.Spacing && (undefined === TextPr.Spacing || Math.abs(this.Spacing - TextPr.Spacing) >= 0.001)))
            return false;

        if (this.DStrikeout !== TextPr.DStrikeout)
            return false;

        if (this.Caps !== TextPr.Caps)
            return false;

        if (this.SmallCaps !== TextPr.SmallCaps)
            return false;

        if ((undefined === this.Position && undefined !== TextPr.Position) || (undefined !== this.Position && (undefined === TextPr.Position || Math.abs(this.Position - TextPr.Position) >= 0.001)))
            return false;

        if (true !== this.RFonts.Is_Equal(TextPr.RFonts))
            return false;

        if (this.BoldCS !== TextPr.BoldCS)
            return false;

        if (this.ItalicCS !== TextPr.ItalicCS)
            return false;

        if (false
            || (undefined === this.FontSizeCS
                && undefined !== TextPr.FontSizeCS)
            || (undefined !== this.FontSizeCS
                && (undefined === TextPr.FontSizeCS
                    || Math.abs(this.FontSizeCS - TextPr.FontSizeCS) >= 0.001)))
            return false;

        if (this.CS !== TextPr.CS)
            return false;

        if (this.RTL !== TextPr.RTL)
            return false;

        if (true !== this.Lang.Is_Equal(TextPr.Lang))
            return false;

        if ((undefined === this.Unifill && undefined !== TextPr.Unifill) || (undefined !== this.Unifill && (undefined === TextPr.Unifill || true !== this.Unifill.IsIdentical(TextPr.Unifill))))
            return false;

        if ((undefined === this.TextOutline && undefined !== TextPr.TextOutline) || (undefined !== this.TextOutline && (undefined === TextPr.TextOutline || true !== this.TextOutline.IsIdentical(TextPr.TextOutline))))
            return false;

        if ((undefined === this.TextFill && undefined !== TextPr.TextFill) || (undefined !== this.TextFill && (undefined === TextPr.TextFill || true !== this.TextFill.IsIdentical(TextPr.TextFill))))
            return false;

        if (this.Vanish !== TextPr.Vanish)
            return false;

		if (!IsEqualStyleObjects(this.Shd, TextPr.Shd))
			return false;
		if(undefined != TextPr.AscLine){
		    return false;
        }
        if(undefined != TextPr.AscUnifill){
            return false;
        }
        if(undefined != TextPr.AscFill){
            return false;
        }

        return true;
    },

    Have_PrChange : function()
    {
        if (undefined === this.PrChange || null === this.PrChange)
            return false;

        return true;
    },

    Add_PrChange : function()
    {
        this.PrChange   = this.Copy();
        this.ReviewInfo = new CReviewInfo();
        this.ReviewInfo.Update();
    },

    Set_PrChange : function(PrChange, ReviewInfo)
    {
        this.PrChange   = PrChange;
        this.ReviewInfo = ReviewInfo;
    },

    Remove_PrChange : function()
    {
        delete this.PrChange;
        delete this.ReviewInfo;
    },

    Get_DiffPrChange : function()
    {
        var TextPr = new CTextPr();

        if (false === this.Have_PrChange())
            return TextPr;

        var PrChange = this.PrChange;
        if (this.Bold !== PrChange.Bold)
            TextPr.Bold = this.Bold;

        if (this.Italic !== PrChange.Italic)
            TextPr.Italic = this.Italic;

        if (this.Strikeout !== PrChange.Strikeout)
            TextPr.Strikeout = this.Strikeout;

        if (this.Underline !== PrChange.Underline)
            TextPr.Underline = this.Underline;

        if (undefined !== this.FontFamily && (undefined === PrChange.FontFamily || this.FontFamily.Name !== PrChange.FontFamily.Name))
            TextPr.FontFamily = {Name : this.FontFamily.Name, Index : -1};

        if (undefined !== this.FontSize && (undefined === PrChange.FontSize || Math.abs(this.FontSize - PrChange.FontSize) >= 0.001))
            TextPr.FontSize = this.FontSize;

        if (undefined !== this.Color && (undefined === PrChange.Color || true !== this.Color.Compare(PrChange.Color)))
            TextPr.Color = this.Color.Copy();

        if (this.VertAlign !== PrChange.VertAlign)
            TextPr.VertAlign = this.VertAlign;

        if (highlight_None === this.HighLight)
        {
            if (highlight_None !== PrChange.HighLight)
                TextPr.HighLight = highlight_None;
        }
        else if (undefined !== this.HighLight)
        {
            if (undefined === PrChange.HighLight || highlight_None === PrChange.HighLight || true !== this.HighLight.Compare(PrChange.HighLight))
                TextPr.HighLight = this.HighLight.Copy();
        }

        if (this.RStyle !== PrChange.RStyle)
            TextPr.RStyle = this.RStyle;

        if (undefined !== this.Spacing && (undefined === PrChange.Spacing || Math.abs(this.Spacing - PrChange.Spacing) >= 0.001))
            TextPr.Spacing = this.Spacing;

        if (this.DStrikeout !== PrChange.DStrikeout)
            TextPr.DStrikeout = this.DStrikeout;

        if (this.Caps !== PrChange.Caps)
            TextPr.Caps = this.Caps;

        if (this.SmallCaps !== PrChange.SmallCaps)
            TextPr.SmallCaps = this.SmallCaps;

        if (undefined !== this.Position && (undefined === PrChange.Position || Math.abs(this.Position - PrChange.Position) >= 0.001))
            TextPr.Position = this.Position;

        if (undefined !== this.RFonts && (undefined === PrChange.RFonts || true !== this.RFonts.Is_Equal(TextPr.RFonts)))
            TextPr.RFonts = this.RFonts.Copy();

        if (this.BoldCS !== PrChange.BoldCS)
            TextPr.BoldCS = this.BoldCS;

        if (this.ItalicCS !== PrChange.ItalicCS)
            TextPr.ItalicCS = this.ItalicCS;

        if (undefined !== this.FontSizeCS && (undefined === PrChange.FontSizeCS || Math.abs(this.FontSizeCS - PrChange.FontSizeCS) >= 0.001))
            TextPr.FontSizeCS = this.FontSizeCS;

        if (this.CS !== PrChange.CS)
            TextPr.CS = this.CS;

        if (this.RTL !== PrChange.RTL)
            TextPr.RTL = this.RTL;

        if (undefined !== this.Lang && (undefined === PrChange.Lang || true !== this.Lang.Is_Equal(PrChange.Lang)))
            TextPr.Lang = this.Lang.Copy();

        if (undefined !== this.Unifill && (undefined === PrChange.Unifill || true !== this.Unifill.IsIdentical(PrChange.Unifill)))
            TextPr.Unifill = this.Unifill.createDuplicate();

        if (undefined !== this.TextOutline && (undefined === PrChange.TextOutline || true !== this.TextOutline.IsIdentical(PrChange.TextOutline)))
            TextPr.TextOutline = this.TextOutline.createDuplicate();

        if (undefined !== this.TextFill && (undefined === PrChange.TextFill || true !== this.TextFill.IsIdentical(PrChange.TextFill)))
            TextPr.TextFill = this.TextFill.createDuplicate();

        if (this.Vanish !== PrChange.Vanish)
            TextPr.Vanish = this.Vanish;

        // TODO: Shd

        return TextPr;
    },

    Get_Description : function()
    {
        var Description = "Text formatting: ";

        if (undefined !== this.Bold)
            Description += this.Bold ? "Bold; " : "No Bold; ";

        if (undefined !== this.Italic)
            Description += this.Italic ? "Italic; " : "No Italic; ";

        if (undefined !== this.Strikeout)
            Description += this.Strikeout ? "Strikeout; " : "No Strikeout; ";

        if (undefined !== this.DStrikeout)
            Description += this.DStrikeout ? "Double Strikeout; " : "No Double Strikeout; ";

        if (undefined !== this.FontSize)
            Description += this.FontSize + "FontSize; ";

//        if (undefined !== this.Color && (undefined === PrChange.Color || true !== this.Color.Compare(PrChange.Color)))
//            TextPr.Color = this.Color.Copy();
//
//        if (this.VertAlign !== PrChange.VertAlign)
//            TextPr.VertAlign = this.VertAlign;
//
//        if (highlight_None === this.HighLight)
//        {
//            if (highlight_None !== PrChange.HighLight)
//                TextPr.HighLight = highlight_None;
//        }
//        else if (undefined !== this.HighLight)
//        {
//            if (undefined === PrChange.HighLight || highlight_None === PrChange.HighLight || true !== this.HighLight.Compare(PrChange.HighLight))
//                TextPr.HighLight = this.HighLight.Copy();
//        }
//
//        if (this.RStyle !== PrChange.RStyle)
//            TextPr.RStyle = this.RStyle;
//
//        if (undefined !== this.Spacing && (undefined === PrChange.Spacing || Math.abs(this.Spacing - PrChange.Spacing) >= 0.001))
//            TextPr.Spacing = this.Spacing;
//
//        if (this.Caps !== PrChange.Caps)
//            TextPr.Caps = this.Caps;
//
//        if (this.SmallCaps !== PrChange.SmallCaps)
//            TextPr.SmallCaps = this.SmallCaps;
//
//        if (undefined !== this.Position && (undefined === PrChange.Position || Math.abs(this.Position - PrChange.Position) >= 0.001))
//            TextPr.Position = this.Position;
//
//        if (undefined !== this.RFonts && (undefined === PrChange.RFonts || true !== this.RFonts.Is_Equal(TextPr.RFonts)))
//            TextPr.RFonts = this.RFonts.Copy();
//
//        if (this.BoldCS !== PrChange.BoldCS)
//            TextPr.BoldCS = this.BoldCS;
//
//        if (this.ItalicCS !== PrChange.ItalicCS)
//            TextPr.ItalicCS = this.ItalicCS;
//
//        if (undefined !== this.FontSizeCS && (undefined === PrChange.FontSizeCS || Math.abs(this.FontSizeCS - PrChange.FontSizeCS) >= 0.001))
//            TextPr.FontSizeCS = this.FontSizeCS;
//
//        if (this.CS !== PrChange.CS)
//            TextPr.CS = this.CS;
//
//        if (this.RTL !== PrChange.RTL)
//            TextPr.RTL = this.RTL;
//
//        if (undefined !== this.Lang && (undefined === PrChange.Lang || true !== this.Lang.Is_Equal(PrChange.Lang)))
//            TextPr.Lang = this.Lang.Copy();
//
//        if (undefined !== this.Unifill && (undefined === PrChange.Unifill || true !== this.Unifill.IsIdentical(PrChange.Unifill)))
//            TextPr.Unifill = this.Unifill.createDuplicate();
//
//        if (undefined !== this.TextOutline && (undefined === PrChange.TextOutline || true !== this.TextOutline.IsIdentical(PrChange.TextOutline)))
//            TextPr.TextOutline = this.TextOutline.createDublicate();
//
//        if (undefined !== this.TextFill && (undefined === PrChange.TextFill || true !== this.TextFill.IsIdentical(PrChange.TextFill)))
//            TextPr.TextFill = this.TextFill.createDublicate();
//
//        if (this.Vanish !== PrChange.Vanish)
//            TextPr.Vanish = this.Vanish;

        return Description;
    }
};
CTextPr.prototype.Is_Empty = function()
{
	if (undefined !== this.Bold
		|| undefined !== this.Italic
		|| undefined !== this.Strikeout
		|| undefined !== this.Underline
		|| undefined !== this.FontFamily
		|| undefined !== this.FontSize
		|| undefined !== this.Color
		|| undefined !== this.VertAlign
		|| undefined !== this.HighLight
		|| undefined !== this.RStyle
		|| undefined !== this.Spacing
		|| undefined !== this.DStrikeout
		|| undefined !== this.Caps
		|| undefined !== this.SmallCaps
		|| undefined !== this.Position
		|| true !== this.RFonts.Is_Empty()
		|| undefined !== this.BoldCS
		|| undefined !== this.ItalicCS
		|| undefined !== this.FontSizeCS
		|| undefined !== this.CS
		|| undefined !== this.RTL
		|| true !== this.Lang.Is_Empty()
		|| undefined !== this.Unifill
		|| undefined !== this.FontRef
		|| undefined !== this.Shd
		|| undefined !== this.Vanish
		|| undefined !== this.TextOutline
		|| undefined !== this.TextFill)
		return false;

	return true;
};
CTextPr.prototype.Get_Bold = function()
{
    return this.Bold;
};
CTextPr.prototype.Get_Italic = function()
{
    return this.Italic;
};
CTextPr.prototype.Get_Strikeout = function()
{
    return this.Strikeout;
};
CTextPr.prototype.Get_Underline = function()
{
    return this.Underline;
};
CTextPr.prototype.Get_Color = function()
{
    return this.Color;
};
CTextPr.prototype.Get_VertAlign = function()
{
    return this.VertAlign;
};
CTextPr.prototype.Get_Highlight = function()
{
    return this.HighLight;
};
CTextPr.prototype.Get_Spacing = function()
{
    return this.Spacing;
};
CTextPr.prototype.Get_DStrikeout = function()
{
    return this.DStrikeout;
};
CTextPr.prototype.Get_Caps = function()
{
    return this.Caps;
};
CTextPr.prototype.Get_SmallCaps = function()
{
    return this.SmallCaps;
};
CTextPr.prototype.Get_Position = function()
{
    return this.Position;
};
CTextPr.prototype.Get_FontFamily = function()
{
    if (this.RFonts && this.RFonts.Ascii && this.RFonts.Ascii.Name)
        return this.RFonts.Ascii.Name;

    return undefined;
};
CTextPr.prototype.Get_FontSize = function()
{
    return this.FontSize;
};
CTextPr.prototype.Get_Lang = function()
{
    if (this.Lang)
        return this.Lang.Val;

    return undefined;
};
CTextPr.prototype.Get_Shd = function()
{
    return this.Shd;
};
//----------------------------------------------------------------------------------------------------------------------
// CTextPr Export
//----------------------------------------------------------------------------------------------------------------------
CTextPr.prototype['Get_Bold']       = CTextPr.prototype.Get_Bold;
CTextPr.prototype['Get_Italic']     = CTextPr.prototype.Get_Italic;
CTextPr.prototype['Get_Strikeout']  = CTextPr.prototype.Get_Strikeout;
CTextPr.prototype['Get_Underline']  = CTextPr.prototype.Get_Underline;
CTextPr.prototype['Get_Color']      = CTextPr.prototype.Get_Color;
CTextPr.prototype['Get_VertAlign']  = CTextPr.prototype.Get_VertAlign;
CTextPr.prototype['Get_Highlight']  = CTextPr.prototype.Get_Highlight;
CTextPr.prototype['Get_Spacing']    = CTextPr.prototype.Get_Spacing;
CTextPr.prototype['Get_DStrikeout'] = CTextPr.prototype.Get_DStrikeout;
CTextPr.prototype['Get_Caps']       = CTextPr.prototype.Get_Caps;
CTextPr.prototype['Get_SmallCaps']  = CTextPr.prototype.Get_SmallCaps;
CTextPr.prototype['Get_Position']   = CTextPr.prototype.Get_Position;
CTextPr.prototype['Get_FontFamily'] = CTextPr.prototype.Get_FontFamily;
CTextPr.prototype['Get_FontSize']   = CTextPr.prototype.Get_FontSize;
CTextPr.prototype['Get_Lang']       = CTextPr.prototype.Get_Lang;
CTextPr.prototype['Get_Shd']        = CTextPr.prototype.Get_Shd;
//----------------------------------------------------------------------------------------------------------------------

function CParaTab(Value, Pos)
{
    this.Value = Value;
    this.Pos   = Pos;
}

CParaTab.prototype =
{
    Copy : function()
    {
        return new CParaTab(this.Value, this.Pos);
    },

    Is_Equal : function(Tab)
    {
        if (this.Value !== Tab.Value
            || this.Pos !== Tab.Pos)
            return false;

        return true;
    }
};

function CParaTabs()
{
    this.Tabs = [];
}

CParaTabs.prototype =
{
    Add : function(_Tab)
    {
        var Index = 0;
        for (Index = 0; Index < this.Tabs.length; Index++ )
        {
            var Tab = this.Tabs[Index];

            if ( Math.abs( Tab.Pos - _Tab.Pos ) < 0.001 )
            {
                this.Tabs.splice( Index, 1, _Tab );
                break;
            }

            if ( Tab.Pos > _Tab.Pos )
                break;
        }

        if ( -1 != Index )
            this.Tabs.splice( Index, 0, _Tab );
    },

    Merge : function(Tabs)
    {
        var _Tabs = Tabs.Tabs;

        for ( var Index = 0; Index < _Tabs.length; Index++ )
        {
            var _Tab = _Tabs[Index];

            var Index2 = 0;
            var Flag   = 0;
            for (Index2 = 0; Index2 < this.Tabs.length; Index2++ )
            {
                var Tab = this.Tabs[Index2];

                if ( Math.abs(  Tab.Pos - _Tab.Pos ) < 0.001 )
                {
                    if ( tab_Clear === _Tab.Value )
                        Flag = -2; // таб нужно удалить
                    else
                        Flag = -1; // табы совпали, не надо новый добавлять

                    break;
                }

                if ( Tab.Pos > _Tab.Pos )
                    break;
            }

            if ( -2 === Flag )
                this.Tabs.splice( Index2, 1 );
            else if ( -1 != Flag )
                this.Tabs.splice( Index2, 0, _Tab );
        }
    },

    Is_Equal : function(Tabs)
    {
        if (this.Tabs.length !== Tabs.Tabs.length)
            return false;

        for(var CurTab = 0, TabsCount = this.Tabs.length; CurTab < TabsCount; CurTab++)
        {
            if (true !== this.Tabs[CurTab].Is_Equal(Tabs.Tabs[CurTab]))
                return false;
        }

        return true;
    },

    Copy : function()
    {
        var Tabs = new CParaTabs();
        var Count = this.Tabs.length;

        for ( var Index = 0; Index < Count; Index++ )
            Tabs.Add( this.Tabs[Index].Copy() );

        return Tabs;
    },

    Set_FromObject : function(Tabs)
    {
        if ( Tabs instanceof Array )
        {
            var Count = Tabs.length;
            for ( var Index = 0; Index < Count; Index++ )
                this.Add( new CParaTab( Tabs[Index].Value, Tabs[Index].Pos ) );
        }
    },

    Get_Count : function()
    {
        return this.Tabs.length;
    },

    Get : function(Index)
    {
        return this.Tabs[Index];
    },

    Get_Value : function(Pos)
    {
        var Count = this.Tabs.length;
        for ( var Index = 0; Index < Count; Index++ )
        {
            var Tab = this.Tabs[Index];
            if ( Math.abs(Tab.Pos - Pos) < 0.001 )
                return Tab.Value;
        }

        return -1;
    },

    Write_ToBinary : function(Writer)
    {
        // Long : количество (если 0, удаляем элемент)
        // Массив
        // Byte   : Value
        // Double : Pos

        var Count = this.Tabs.length;
        Writer.WriteLong( Count );

        for ( var Index = 0; Index < Count; Index++ )
        {
            Writer.WriteByte( this.Tabs[Index].Value );
            Writer.WriteDouble( this.Tabs[Index].Pos );
        }
    },

    Read_FromBinary : function(Reader)
    {
        // Long : количество (если 0, удаляем элемент)
        // Массив
        // Byte   : Value
        // Double : Pos

        var Count = Reader.GetLong();
        this.Tabs = [];

        for ( var Index = 0; Index < Count; Index++ )
        {
            var Value = Reader.GetByte();
            var Pos   = Reader.GetDouble();
            this.Add( new CParaTab( Value, Pos ) );
        }
    }
};

function CParaInd()
{
    this.Left      = undefined; // Левый отступ
    this.Right     = undefined; // Правый отступ
    this.FirstLine = undefined; // Первая строка
}

CParaInd.prototype =
{
    Copy : function()
    {
        var Ind = new CParaInd();
        Ind.Left      = this.Left;
        Ind.Right     = this.Right;
        Ind.FirstLine = this.FirstLine;
        return Ind;
    },

    Merge : function(Ind)
    {
        if ( undefined != Ind.Left )
            this.Left = Ind.Left;

        if ( undefined != Ind.Right )
            this.Right = Ind.Right;

        if ( undefined != Ind.FirstLine )
            this.FirstLine = Ind.FirstLine;
    },

    Is_Equal  : function(Ind)
    {
        if (this.Left !== Ind.Left
            || this.Right !== Ind.Right
            || this.FirstLine !== Ind.FirstLine)
            return false;

        return true;
    },

    Set_FromObject : function(Ind)
    {
        if ( undefined != Ind.Left )
            this.Left = Ind.Left;
        else
            this.Left = undefined;

        if ( undefined != Ind.Right )
            this.Right = Ind.Right;
        else
            this.Right = undefined;

        if ( undefined != Ind.FirstLine )
            this.FirstLine = Ind.FirstLine;
        else
            this.FirstLine = undefined;
    },

    Write_ToBinary : function(Writer)
    {
        var StartPos = Writer.GetCurPosition();
        Writer.Skip(4);
        var Flags = 0;

        if ( undefined != this.Left )
        {
            Writer.WriteDouble( this.Left );
            Flags |= 1;
        }

        if ( undefined != this.Right )
        {
            Writer.WriteDouble( this.Right );
            Flags |= 2;
        }

        if ( undefined != this.FirstLine )
        {
            Writer.WriteDouble( this.FirstLine );
            Flags |= 4;
        }

        var EndPos = Writer.GetCurPosition();
        Writer.Seek( StartPos );
        Writer.WriteLong( Flags );
        Writer.Seek( EndPos );
    },

    Read_FromBinary : function(Reader)
    {
        var Flags = Reader.GetLong();

        if ( Flags & 1 )
            this.Left = Reader.GetDouble();

        if ( Flags & 2 )
            this.Right = Reader.GetDouble();

        if ( Flags & 4 )
            this.FirstLine = Reader.GetDouble();
    }
};
CParaInd.prototype.Is_Empty = function()
{
	if (undefined !== this.Left
		|| undefined !== this.Right
		|| undefined !== this.FirstLine)
		return false;

	return true;
};
CParaInd.prototype.Get_Diff = function(Ind)
{
    var DiffInd = new CParaInd();

    if (this.Left !== Ind.Left)
        DiffInd.Left = this.Left;

    if (this.Left !== Ind.Right)
        DiffInd.Right = this.Right;

    if (this.FirstLine !== Ind.FirstLine)
        DiffInd.FirstLine = this.FirstLine;

    return DiffInd;
};

function CParaSpacing()
{
    this.Line              = undefined; // Расстояние между строками внутри абзаца
    this.LineRule          = undefined; // Тип расстрояния между строками
    this.Before            = undefined; // Дополнительное расстояние до абзаца
    this.BeforeAutoSpacing = undefined; // Использовать ли автоматический расчет расстояния до параграфа
    this.After             = undefined; // Дополнительное расстояние после абзаца
    this.AfterAutoSpacing  = undefined; // Использовать ли автоматический расчет расстояния после параграфа
}

CParaSpacing.prototype =
{
    Copy : function()
    {
        var Spacing = new CParaSpacing();
        Spacing.Line              = this.Line;
        Spacing.LineRule          = this.LineRule;
        Spacing.Before            = this.Before;
        Spacing.BeforeAutoSpacing = this.BeforeAutoSpacing;
        Spacing.After             = this.After;
        Spacing.AfterAutoSpacing  = this.AfterAutoSpacing;
        return Spacing;
    },

    Merge : function(Spacing)
    {
        if ( undefined != Spacing.Line )
            this.Line = Spacing.Line;

        if ( undefined != Spacing.LineRule )
            this.LineRule = Spacing.LineRule;

        if ( undefined != Spacing.Before )
            this.Before = Spacing.Before;

        if ( undefined != Spacing.BeforeAutoSpacing )
            this.BeforeAutoSpacing = Spacing.BeforeAutoSpacing;

        if ( undefined != Spacing.After )
            this.After = Spacing.After;

        if ( undefined != Spacing.AfterAutoSpacing )
            this.AfterAutoSpacing = Spacing.AfterAutoSpacing;
    },

	Is_Equal : function(Spacing)
	{
		if (this.Line !== Spacing.Line
			|| this.LineRule !== Spacing.LineRule
			|| (this.Before === undefined && Spacing.Before !== undefined)
			|| (this.Before !== undefined && Spacing.Before === undefined)
			|| ((this.Before !== undefined && Spacing.Before !== undefined) && (this.Before - Spacing.Before) > 0.001)
			|| this.BeforeAutoSpacing !== Spacing.BeforeAutoSpacing
			|| (this.After === undefined && Spacing.After !== undefined)
			|| (this.After !== undefined && Spacing.After === undefined)
			|| ((this.After !== undefined && Spacing.After !== undefined) && (this.After - Spacing.After) > 0.001)
			|| this.AfterAutoSpacing !== Spacing.AfterAutoSpacing)
			return false;

		return true;
	},

    Set_FromObject : function(Spacing)
    {
        this.Line              = Spacing.Line;
        this.LineRule          = Spacing.LineRule;
        this.Before            = Spacing.Before;
        this.BeforeAutoSpacing = Spacing.BeforeAutoSpacing;
        this.After             = Spacing.After;
        this.AfterAutoSpacing  = Spacing.AfterAutoSpacing;
    },

    Write_ToBinary : function(Writer)
    {
        var StartPos = Writer.GetCurPosition();
        Writer.Skip(4);
        var Flags = 0;

        if ( undefined != this.Line )
        {
            Writer.WriteDouble( this.Line );
            Flags |= 1;
        }

        if ( undefined != this.LineRule )
        {
            Writer.WriteByte( this.LineRule );
            Flags |= 2;
        }

        if ( undefined != this.Before )
        {
            Writer.WriteDouble( this.Before );
            Flags |= 4;
        }

        if ( undefined != this.After )
        {
            Writer.WriteDouble( this.After );
            Flags |= 8;
        }

        if ( undefined != this.AfterAutoSpacing )
        {
            Writer.WriteBool( this.AfterAutoSpacing );
            Flags |= 16;
        }

        if ( undefined != this.BeforeAutoSpacing )
        {
            Writer.WriteBool( this.BeforeAutoSpacing );
            Flags |= 32;
        }

        var EndPos = Writer.GetCurPosition();
        Writer.Seek( StartPos );
        Writer.WriteLong( Flags );
        Writer.Seek( EndPos );
    },

    Read_FromBinary : function(Reader)
    {
        var Flags = Reader.GetLong();

        if ( Flags & 1 )
            this.Line = Reader.GetDouble();

        if ( Flags & 2 )
            this.LineRule = Reader.GetByte();

        if ( Flags & 4 )
            this.Before = Reader.GetDouble();

        if ( Flags & 8 )
            this.After = Reader.GetDouble();

        if ( Flags & 16 )
            this.AfterAutoSpacing = Reader.GetBool();

        if ( Flags & 32 )
            this.BeforeAutoSpacing = Reader.GetBool();
    }
};
CParaSpacing.prototype.Get_Diff = function(Spacing)
{
    var DiffSpacing = new CParaSpacing();

    if (this.Line !== Spacing.Line)
        DiffSpacing.Line = this.Line;

    if (this.LineRule !== Spacing.LineRule)
        DiffSpacing.LineRule = this.LineRule;

    if (this.Before !== Spacing.Before)
        DiffSpacing.Before = this.Before;

    if (this.BeforeAutoSpacing !== Spacing.BeforeAutoSpacing)
        DiffSpacing.BeforeAutoSpacing = this.BeforeAutoSpacing;

    if (this.After !== Spacing.After)
        DiffSpacing.After = this.After;

    if (this.AfterAutoSpacing !== Spacing.AfterAutoSpacing)
        DiffSpacing.AfterAutoSpacing = this.AfterAutoSpacing;

    return DiffSpacing;
};
CParaSpacing.prototype.Is_Empty = function()
{
	if (undefined !== this.Line
		|| undefined !== this.LineRule
		|| undefined !== this.Before
		|| undefined !== this.BeforeAutoSpacing
		|| undefined !== this.After
		|| undefined !== this.AfterAutoSpacing)
		return false;

	return true;
};

function CNumPr()
{
    this.NumId = "-1";
    this.Lvl   =    0;
}

CNumPr.prototype =
{
    Copy : function()
    {
        var NumPr = new CNumPr();
        NumPr.NumId = this.NumId;
        NumPr.Lvl   = this.Lvl;
        return NumPr;
    },

    Merge : function(NumPr)
    {
        if ( undefined != NumPr.NumId )
            this.NumId = NumPr.NumId;

        if ( undefined != NumPr.Lvl )
            this.Lvl = NumPr.Lvl;
    },

    Is_Equal : function(NumPr)
    {
        if (this.NumId != NumPr.NumId
            || this.Lvl !== NumPr.Lvl)
            return false;

        return true;
    },

    Set : function(NumId, Lvl)
    {
        this.NumId = NumId;
        this.Lvl   = Lvl;
    },

    Set_FromObject : function(NumPr)
    {
        this.NumId = NumPr.NumId;
        this.Lvl   = NumPr.Lvl;
    },

    Write_ToBinary : function(Writer)
    {
        // Bool   : Is NumId undefined
        // String : NumId
        // Bool   : IsLvl undefined
        // Byte   : Lvl

        if ( undefined === this.NumId )
            Writer.WriteBool( true );
        else
        {
            Writer.WriteBool( false );
            Writer.WriteString2( this.NumId );
        }

        if ( undefined === this.Lvl )
            Writer.WriteBool( true );
        else
        {
            Writer.WriteBool( false );
            Writer.WriteByte( this.Lvl );
        }
    },

    Read_FromBinary : function(Reader)
    {
        // Bool   : Is NumId undefined
        // String : NumId
        // Byte   : Lvl

        if ( true === Reader.GetBool() )
            this.NumId = undefined;
        else
            this.NumId = Reader.GetString2();

        if ( true === Reader.GetBool() )
            this.Lvl = undefined;
        else
            this.Lvl = Reader.GetByte();
    }
};

var wrap_Around    = 0x01;
var wrap_Auto      = 0x02;
var wrap_None      = 0x03;
var wrap_NotBeside = 0x04;
var wrap_Through   = 0x05;
var wrap_Tight     = 0x06;

function CFramePr()
{
    this.DropCap = undefined; // Является ли данный элемент буквицей
    this.H       = undefined;
    this.HAnchor = undefined;
    this.HRule   = undefined;
    this.HSpace  = undefined;
    this.Lines   = undefined;
    this.VAnchor = undefined;
    this.VSpace  = undefined;
    this.W       = undefined;
    this.Wrap    = undefined;
    this.X       = undefined;
    this.XAlign  = undefined;
    this.Y       = undefined;
    this.YAlign  = undefined;
}

CFramePr.prototype =
{
    Copy : function()
    {
        var FramePr = new CFramePr();

        FramePr.DropCap = this.DropCap;
        FramePr.H       = this.H;
        FramePr.HAnchor = this.HAnchor;
        FramePr.HRule   = this.HRule;
        FramePr.HSpace  = this.HSpace;
        FramePr.Lines   = this.Lines;
        FramePr.VAnchor = this.VAnchor;
        FramePr.VSpace  = this.VSpace;
        FramePr.W       = this.W;
        FramePr.Wrap    = this.Wrap;
        FramePr.X       = this.X;
        FramePr.XAlign  = this.XAlign;
        FramePr.Y       = this.Y;
        FramePr.YAlign  = this.YAlign;

        return FramePr;
    },

    Compare : function(FramePr)
    {
        if (this.DropCap != FramePr.DropCap
            || Math.abs(this.H - FramePr.H) > 0.001
            || this.HAnchor != FramePr.HAnchor
            || this.HRule != FramePr.HRule
            || this.HSpace != FramePr.HSpace
            || this.Lines != FramePr.Lines
            || this.VAnchor != FramePr.VAnchor
            || this.VSpace != FramePr.VSpace
            || Math.abs(this.W - FramePr.W) > 0.001
            || this.Wrap != FramePr.Wrap
            || Math.abs(this.X - FramePr.X) > 0.001
            || this.XAlign != FramePr.XAlign
            || Math.abs(this.Y - FramePr.Y) > 0.001
            || this.YAlign != FramePr.YAlign)
            return false;

        return true;
    },

    Is_Equal : function(FramePr)
    {
        return this.Compare(FramePr);
    },

    Set_FromObject : function(FramePr)
    {
        this.DropCap = FramePr.DropCap;
        this.H       = FramePr.H;
        this.HAnchor = FramePr.HAnchor;
        this.HRule   = FramePr.HRule;
        this.HSpace  = FramePr.HSpace;
        this.Lines   = FramePr.Lines;
        this.VAnchor = FramePr.VAnchor;
        this.VSpace  = FramePr.VSpace;
        this.W       = FramePr.W;
        this.Wrap    = FramePr.Wrap;
        this.X       = FramePr.X;
        this.XAlign  = FramePr.XAlign;
        this.Y       = FramePr.Y;
        this.YAlign  = FramePr.YAlign;
    },

	Write_ToBinary : function(Writer)
	{
		var StartPos = Writer.GetCurPosition();
		Writer.Skip(4);
		var Flags = 0;

		if (undefined != this.DropCap)
		{
			Writer.WriteLong(this.DropCap);
			Flags |= 1;
		}

		if (undefined != this.H)
		{
			Writer.WriteDouble(this.H);
			Flags |= 2;
		}

		if (undefined != this.HAnchor)
		{
			Writer.WriteLong(this.HAnchor);
			Flags |= 4;
		}

		if (undefined != this.HRule)
		{
			Writer.WriteLong(this.HRule);
			Flags |= 8;
		}

		if (undefined != this.HSpace)
		{
			Writer.WriteDouble(this.HSpace);
			Flags |= 16;
		}

		if (undefined != this.Lines)
		{
			Writer.WriteLong(this.Lines);
			Flags |= 32;
		}

		if (undefined != this.VAnchor)
		{
			Writer.WriteLong(this.VAnchor);
			Flags |= 64;
		}

		if (undefined != this.VSpace)
		{
			Writer.WriteDouble(this.VSpace);
			Flags |= 128;
		}

		if (undefined != this.W)
		{
			Writer.WriteDouble(this.W);
			Flags |= 256;
		}

		if (undefined != this.X)
		{
			Writer.WriteDouble(this.X);
			Flags |= 512;
		}

		if (undefined != this.XAlign)
		{
			Writer.WriteLong(this.XAlign);
			Flags |= 1024;
		}

		if (undefined != this.Y)
		{
			Writer.WriteDouble(this.Y);
			Flags |= 2048;
		}

		if (undefined != this.YAlign)
		{
			Writer.WriteLong(this.YAlign);
			Flags |= 4096;
		}

		if (undefined !== this.Wrap)
		{
			Writer.WriteLong(this.Wrap);
			Flags |= 8192;
		}

		var EndPos = Writer.GetCurPosition();
		Writer.Seek(StartPos);
		Writer.WriteLong(Flags);
		Writer.Seek(EndPos);
	},

	Read_FromBinary : function(Reader)
	{
		var Flags = Reader.GetLong();

		if (Flags & 1)
			this.DropCap = Reader.GetLong();

		if (Flags & 2)
			this.H = Reader.GetDouble();

		if (Flags & 4)
			this.HAnchor = Reader.GetLong();

		if (Flags & 8)
			this.HRule = Reader.GetLong();

		if (Flags & 16)
			this.HSpace = Reader.GetDouble();

		if (Flags & 32)
			this.Lines = Reader.GetLong();

		if (Flags & 64)
			this.VAnchor = Reader.GetLong();

		if (Flags & 128)
			this.VSpace = Reader.GetDouble();

		if (Flags & 256)
			this.W = Reader.GetDouble();

		if (Flags & 512)
			this.X = Reader.GetDouble();

		if (Flags & 1024)
			this.XAlign = Reader.GetLong();

		if (Flags & 2048)
			this.Y = Reader.GetDouble();

		if (Flags & 4096)
			this.YAlign = Reader.GetLong();

		if (Flags & 8192)
			this.Wrap = Reader.GetLong();
	},

    Init_Default_DropCap : function(bInside)
    {
        this.DropCap = ( true === bInside ? c_oAscDropCap.Drop : c_oAscDropCap.Margin );
        this.Lines   = 3;
        this.Wrap    = wrap_Around;
        this.VAnchor = Asc.c_oAscVAnchor.Text;
        this.HAnchor = ( true === bInside ? Asc.c_oAscHAnchor.Text : Asc.c_oAscHAnchor.Page );

        this.X       = undefined;
        this.XAlign  = undefined;
        this.Y       = undefined;
        this.YAlign  = undefined;

        this.H       = undefined;
        this.W       = undefined;
        this.HRule   = undefined;
    },

    Get_W : function()
    {
        return this.W;
    },

    Get_H : function()
    {
        return this.H;
    },

    Is_DropCap : function()
    {
        if ( c_oAscDropCap.Margin === this.DropCap || c_oAscDropCap.Drop === this.DropCap )
            return true;

        return false;
    }
};

function CParaPr()
{
    this.ContextualSpacing = undefined;          // Удалять ли интервал между параграфами одинакового стиля
    this.Ind               = new CParaInd();     // Отступы
    this.Jc                = undefined;          // Прилегание параграфа
    this.KeepLines         = undefined;          // Неразрывный параграф
    this.KeepNext          = undefined;          // Не разъединять со следующим параграфом
    this.PageBreakBefore   = undefined;          // Разрыв страницы перед параграфом
    this.Spacing           = new CParaSpacing(); // Расстояния между строками внутри параграфа и между параграфами
    this.Shd               = undefined;          // Заливка параграфа
    this.Brd =
    {
        First   : undefined,            // Является ли данный параграф первым в группе параграфов с одинаковыми краями и настройками границ
        Last    : undefined,            // Является ли данный параграф последним в группе параграфов с одинаковыми краями и настройками границ
        Between : undefined,
        Bottom  : undefined,
        Left    : undefined,
        Right   : undefined,
        Top     : undefined
    };
    this.WidowControl      = undefined; // Запрет висячих строк
    this.Tabs              = undefined; // Заданные табы
    this.NumPr             = undefined; // Нумерация
    this.PStyle            = undefined; // Стиль параграфа
    this.FramePr           = undefined;

    this.DefaultRunPr      = undefined;
    this.Bullet            = undefined;
    this.Lvl               = undefined;
    this.DefaultTabSize    = undefined;

    this.PrChange          = undefined;
}

CParaPr.prototype =
{
    Copy : function(bCopyPrChange)
    {
        var ParaPr = new CParaPr();

        ParaPr.ContextualSpacing = this.ContextualSpacing;

        if ( undefined != this.Ind )
            ParaPr.Ind = this.Ind.Copy();

        ParaPr.Jc              = this.Jc;
        ParaPr.KeepLines       = this.KeepLines;
        ParaPr.KeepNext        = this.KeepNext;
        ParaPr.PageBreakBefore = this.PageBreakBefore;

        if ( undefined != this.Spacing )
            ParaPr.Spacing = this.Spacing.Copy();

        if ( undefined != this.Shd )
            ParaPr.Shd = this.Shd.Copy();

        ParaPr.Brd.First = this.Brd.First;
        ParaPr.Brd.Last  = this.Brd.Last;

        if ( undefined != this.Brd.Between )
            ParaPr.Brd.Between = this.Brd.Between.Copy();

        if ( undefined != this.Brd.Bottom )
            ParaPr.Brd.Bottom = this.Brd.Bottom.Copy();

        if ( undefined != this.Brd.Left )
            ParaPr.Brd.Left = this.Brd.Left.Copy();

        if ( undefined != this.Brd.Right )
            ParaPr.Brd.Right = this.Brd.Right.Copy();

        if ( undefined != this.Brd.Top )
            ParaPr.Brd.Top = this.Brd.Top.Copy();

        ParaPr.WidowControl = this.WidowControl;

        if ( undefined != this.Tabs )
            ParaPr.Tabs = this.Tabs.Copy();

        if ( undefined != this.NumPr )
            ParaPr.NumPr = this.NumPr.Copy();

        if ( undefined != this.PStyle )
            ParaPr.PStyle = this.PStyle;

        if ( undefined != this.FramePr )
            ParaPr.FramePr = this.FramePr.Copy();
        else
            ParaPr.FramePr = undefined;

        if( undefined != this.DefaultRunPr)
            ParaPr.DefaultRunPr = this.DefaultRunPr.Copy();

        if( undefined != this.Bullet)
            ParaPr.Bullet = this.Bullet.createDuplicate();

        if(undefined != this.Lvl)
            ParaPr.Lvl = this.Lvl;

        if(undefined != this.DefaultTabSize)
            ParaPr.DefaultTabSize = this.DefaultTabSize;

        if (true === bCopyPrChange && undefined !== this.PrChange)
        {
            ParaPr.PrChange   = this.PrChange.Copy();
            ParaPr.ReviewInfo = this.ReviewInfo.Copy();
        }

        return ParaPr;
    },

    Merge : function(ParaPr)
    {
        if ( undefined != ParaPr.ContextualSpacing )
            this.ContextualSpacing = ParaPr.ContextualSpacing;

        if ( undefined != ParaPr.Ind )
            this.Ind.Merge( ParaPr.Ind );

        if ( undefined != ParaPr.Jc )
            this.Jc = ParaPr.Jc;

        if ( undefined != ParaPr.KeepLines )
            this.KeepLines = ParaPr.KeepLines;

        if ( undefined != ParaPr.KeepNext )
            this.KeepNext = ParaPr.KeepNext;

        if ( undefined != ParaPr.PageBreakBefore )
            this.PageBreakBefore = ParaPr.PageBreakBefore;

        if ( undefined != ParaPr.Spacing )
            this.Spacing.Merge( ParaPr.Spacing );

        if ( undefined != ParaPr.Shd )
            this.Shd = ParaPr.Shd.Copy();

        if ( undefined != ParaPr.Brd.First )
            this.Brd.First = ParaPr.Brd.First;

        if ( undefined != ParaPr.Brd.Last )
            this.Brd.Last  = ParaPr.Brd.Last;

        if ( undefined != ParaPr.Brd.Between )
            this.Brd.Between = ParaPr.Brd.Between.Copy();

        if ( undefined != ParaPr.Brd.Bottom )
            this.Brd.Bottom = ParaPr.Brd.Bottom.Copy();

        if ( undefined != ParaPr.Brd.Left )
            this.Brd.Left = ParaPr.Brd.Left.Copy();

        if ( undefined != ParaPr.Brd.Right )
            this.Brd.Right = ParaPr.Brd.Right.Copy();

        if ( undefined != ParaPr.Brd.Top )
            this.Brd.Top = ParaPr.Brd.Top.Copy();

        if ( undefined != ParaPr.WidowControl )
            this.WidowControl = ParaPr.WidowControl;

        if ( undefined != ParaPr.Tabs )
        {
            if ( undefined === this.Tabs )
                this.Tabs = ParaPr.Tabs.Copy();
            else
                this.Tabs.Merge( ParaPr.Tabs );
        }

        if ( undefined != ParaPr.NumPr )
        {
            if ( undefined === this.NumPr )
                this.NumPr = ParaPr.NumPr.Copy();
            else
                this.NumPr.Merge( ParaPr.NumPr );

            if ( undefined != this.NumPr && this.NumPr.Lvl > 8 )
                this.NumPr = undefined;
        }

        if ( undefined != ParaPr.PStyle )
            this.PStyle = ParaPr.PStyle;

        this.FramePr = undefined;

        if( undefined != ParaPr.DefaultRunPr )
        {
            if( undefined == this.DefaultRunPr )
                this.DefaultRunPr = new CTextPr();
            this.DefaultRunPr.Merge(ParaPr.DefaultRunPr);
        }

        if( undefined != ParaPr.Bullet && ParaPr.Bullet.isBullet())
            this.Bullet = ParaPr.Bullet.createDuplicate();

        if(undefined != ParaPr.Lvl)
            this.Lvl = ParaPr.Lvl;

        if(undefined != ParaPr.DefaultTabSize)
            this.DefaultTabSize = ParaPr.DefaultTabSize;

    },

    Init_Default : function()
    {
        this.ContextualSpacing         = false;
        this.Ind                       = new CParaInd();
        this.Ind.Left                  = 0;
        this.Ind.Right                 = 0;
        this.Ind.FirstLine             = 0;
        this.Jc                        = align_Left;
        this.KeepLines                 = false;
        this.KeepNext                  = false;
        this.PageBreakBefore           = false;
        this.Spacing                   = new CParaSpacing();
        this.Spacing.Line              = 1.15;
        this.Spacing.LineRule          = linerule_Auto;
        this.Spacing.Before            = 0;
        this.Spacing.BeforeAutoSpacing = false;
        this.Spacing.After             = 10 * g_dKoef_pt_to_mm;
        this.Spacing.AfterAutoSpacing  = false;
        this.Shd                       = new CDocumentShd();
        this.Brd.First                 = true;
        this.Brd.Last                  = true;
        this.Brd.Between               = new CDocumentBorder();
        this.Brd.Bottom                = new CDocumentBorder();
        this.Brd.Left                  = new CDocumentBorder();
        this.Brd.Right                 = new CDocumentBorder();
        this.Brd.Top                   = new CDocumentBorder();
        this.WidowControl              = true;
        this.Tabs                      = new CParaTabs();
        this.NumPr                     = undefined;
        this.PStyle                    = undefined;
        this.FramePr                   = undefined;

        this.DefaultRunPr              = undefined;
        this.Bullet                    = undefined;
        this.DefaultTabSize            = undefined;
    },

    Set_FromObject : function(ParaPr)
    {
        this.ContextualSpacing = ParaPr.ContextualSpacing;

		this.Ind = new CParaInd();
		if (undefined != ParaPr.Ind)
			this.Ind.Set_FromObject(ParaPr.Ind);

        this.Jc              = ParaPr.Jc;
        this.KeepLines       = ParaPr.KeepLines;
        this.KeepNext        = ParaPr.KeepNext;
        this.PageBreakBefore = ParaPr.PageBreakBefore;

		this.Spacing = new CParaSpacing();
		if (undefined != ParaPr.Spacing)
			this.Spacing.Set_FromObject(ParaPr.Spacing);

        if ( undefined != ParaPr.Shd )
        {
            this.Shd = new CDocumentShd();
            this.Shd.Set_FromObject( ParaPr.Shd );
        }
        else
            this.Shd = undefined;

        if ( undefined != ParaPr.Brd )
        {
            if ( undefined != ParaPr.Brd.Between )
            {
                this.Brd.Between = new CDocumentBorder();
                this.Brd.Between.Set_FromObject( ParaPr.Brd.Between );
            }
            else
                this.Brd.Between = undefined;

            if ( undefined != ParaPr.Brd.Bottom )
            {
                this.Brd.Bottom = new CDocumentBorder();
                this.Brd.Bottom.Set_FromObject( ParaPr.Brd.Bottom );
            }
            else
                this.Brd.Bottom = undefined;

            if ( undefined != ParaPr.Brd.Left )
            {
                this.Brd.Left = new CDocumentBorder();
                this.Brd.Left.Set_FromObject( ParaPr.Brd.Left );
            }
            else
                this.Brd.Left = undefined;

            if ( undefined != ParaPr.Brd.Right )
            {
                this.Brd.Right = new CDocumentBorder();
                this.Brd.Right.Set_FromObject( ParaPr.Brd.Right );
            }
            else
                this.Brd.Right = undefined;

            if ( undefined != ParaPr.Brd.Top )
            {
                this.Brd.Top = new CDocumentBorder();
                this.Brd.Top.Set_FromObject( ParaPr.Brd.Top );
            }
            else
                this.Brd.Top = undefined;
        }
        else
        {
            this.Brd.Between = undefined;
            this.Brd.Bottom  = undefined;
            this.Brd.Left    = undefined;
            this.Brd.Right   = undefined;
            this.Brd.Top     = undefined;
        }

        this.WidowControl = ParaPr.WidowControl;

        if ( undefined != ParaPr.Tabs )
        {
            this.Tabs = new CParaTabs();
            this.Tabs.Set_FromObject( ParaPr.Tabs.Tabs );
        }
        else
            this.Tabs = undefined;

        if ( undefined != ParaPr.NumPr )
        {
            this.NumPr = new CNumPr();
            this.NumPr.Set_FromObject( ParaPr.NumPr );
        }
        else
            this.NumPr = undefined;

        if ( undefined != ParaPr.FramePr )
        {
            this.FramePr = new CFramePr();
            this.FramePr.Set_FromObject( ParaPr.FramePr );
        }
        else
            this.FramePr = undefined;

        if( undefined != ParaPr.DefaultRunPr )
        {
            this.DefaultRunPr = new CTextPr();
            this.DefaultRunPr.Set_FromObject(ParaPr.DefaultRunPr);
        }

        if( undefined != ParaPr.Bullet )
        {
            this.Bullet = new AscFormat.CBullet();
            this.Bullet.Set_FromObject(ParaPr.Bullet);
        }

        if(undefined != ParaPr.DefaultTabSize)
        {
            this.DefaultTabSize = ParaPr.DefaultTabSize;
        }
    },

    Compare : function(ParaPr)
    {
        // При сравнении добавляем 1 элемент Locked
        var Result_ParaPr = new CParaPr();
        Result_ParaPr.Locked  = false;

        if ( ParaPr.ContextualSpacing === this.ContextualSpacing )
            Result_ParaPr.ContextualSpacing = ParaPr.ContextualSpacing;

        Result_ParaPr.Ind = new CParaInd();
        if ( undefined != ParaPr.Ind && undefined != this.Ind )
        {
            if ( undefined != ParaPr.Ind.Left && undefined != this.Ind.Left && Math.abs( ParaPr.Ind.Left - this.Ind.Left ) < 0.001 )
                Result_ParaPr.Ind.Left = ParaPr.Ind.Left;

            if ( undefined != ParaPr.Ind.Right && undefined != this.Ind.Right && Math.abs( ParaPr.Ind.Right - this.Ind.Right ) < 0.001 )
                Result_ParaPr.Ind.Right = ParaPr.Ind.Right;

            if ( undefined != ParaPr.Ind.FirstLine && undefined != this.Ind.FirstLine && Math.abs( ParaPr.Ind.FirstLine - this.Ind.FirstLine ) < 0.001 )
                Result_ParaPr.Ind.FirstLine = ParaPr.Ind.FirstLine;
        }

        if ( ParaPr.Jc === this.Jc )
            Result_ParaPr.Jc = ParaPr.Jc;

        if ( ParaPr.KeepLines === this.KeepLines )
            Result_ParaPr.KeepLines = ParaPr.KeepLines;

        if ( ParaPr.KeepNext === this.KeepNext )
            Result_ParaPr.KeepNext = ParaPr.KeepNext;

        if ( ParaPr.PageBreakBefore === this.PageBreakBefore )
            Result_ParaPr.PageBreakBefore = ParaPr.PageBreakBefore;

        Result_ParaPr.Spacing = new CParaSpacing();
        if ( undefined != this.Spacing && undefined != ParaPr.Spacing )
        {
            if ( undefined != this.Spacing.After && undefined != ParaPr.Spacing.After && Math.abs( this.Spacing.After - ParaPr.Spacing.After ) < 0.001 )
                Result_ParaPr.Spacing.After = ParaPr.Spacing.After;

            if ( this.Spacing.AfterAutoSpacing === ParaPr.Spacing.AfterAutoSpacing )
                Result_ParaPr.Spacing.AfterAutoSpacing = ParaPr.Spacing.AfterAutoSpacing;

            if ( undefined != this.Spacing.Before && undefined != ParaPr.Spacing.Before && Math.abs( this.Spacing.Before - ParaPr.Spacing.Before ) < 0.001 )
                Result_ParaPr.Spacing.Before = ParaPr.Spacing.Before;

            if ( this.Spacing.BeforeAutoSpacing === ParaPr.Spacing.BeforeAutoSpacing )
                Result_ParaPr.Spacing.BeforeAutoSpacing = ParaPr.Spacing.BeforeAutoSpacing;

            if ( undefined != this.Spacing.Line && undefined != ParaPr.Spacing.Line && Math.abs( this.Spacing.Line - ParaPr.Spacing.Line ) < 0.001 )
                Result_ParaPr.Spacing.Line = ParaPr.Spacing.Line;

            if ( this.Spacing.LineRule === ParaPr.Spacing.LineRule )
                Result_ParaPr.Spacing.LineRule = ParaPr.Spacing.LineRule;
        }

        if ( undefined != this.Shd && undefined != ParaPr.Shd && true === this.Shd.Compare(ParaPr.Shd) )
            Result_ParaPr.Shd = ParaPr.Shd.Copy();

        if ( undefined != this.Brd.Between && undefined != ParaPr.Brd.Between && true === this.Brd.Between.Compare( ParaPr.Brd.Between ) )
            Result_ParaPr.Brd.Between = ParaPr.Brd.Between.Copy();

        if ( undefined != this.Brd.Bottom && undefined != ParaPr.Brd.Bottom && true === this.Brd.Bottom.Compare( ParaPr.Brd.Bottom ) )
            Result_ParaPr.Brd.Bottom = ParaPr.Brd.Bottom.Copy();

        if ( undefined != this.Brd.Left && undefined != ParaPr.Brd.Left && true === this.Brd.Left.Compare( ParaPr.Brd.Left ) )
            Result_ParaPr.Brd.Left = ParaPr.Brd.Left.Copy();

        if ( undefined != this.Brd.Right && undefined != ParaPr.Brd.Right && true === this.Brd.Right.Compare( ParaPr.Brd.Right ) )
            Result_ParaPr.Brd.Right = ParaPr.Brd.Right.Copy();

        if ( undefined != this.Brd.Top && undefined != ParaPr.Brd.Top && true === this.Brd.Top.Compare( ParaPr.Brd.Top ) )
            Result_ParaPr.Brd.Top = ParaPr.Brd.Top.Copy();

        if ( ParaPr.WidowControl === this.WidowControl )
            Result_ParaPr.WidowControl = ParaPr.WidowControl;

        // PStyle
        if ( undefined != this.PStyle && undefined != ParaPr.PStyle && this.PStyle === ParaPr.PStyle )
            Result_ParaPr.PStyle = ParaPr.PStyle;

        // NumPr
        if ( undefined != this.NumPr && undefined != ParaPr.NumPr && this.NumPr.NumId === ParaPr.NumPr.NumId )
        {
            Result_ParaPr.NumPr = new CParaPr();
            Result_ParaPr.NumPr.NumId = ParaPr.NumPr.NumId;
            Result_ParaPr.NumPr.Lvl   = Math.max( this.NumPr.Lvl, ParaPr.NumPr.Lvl );
        }

        // Locked
        if ( undefined != this.Locked && undefined != ParaPr.Locked )
        {
            if ( this.Locked != ParaPr.Locked )
                Result_ParaPr.Locked = true;
            else
                Result_ParaPr.Locked = ParaPr.Locked;
        }

        // FramePr
        if ( undefined != this.FramePr && undefined != ParaPr.FramePr && true === this.FramePr.Compare(ParaPr.FramePr) )
            Result_ParaPr.FramePr = this.FramePr;

        if(undefined != this.Bullet && undefined != ParaPr.Bullet )
            Result_ParaPr.Bullet = AscFormat.CompareBullets(ParaPr.Bullet, this.Bullet);

        if(undefined != this.DefaultRunPr && undefined != ParaPr.DefaultRunPr)
            Result_ParaPr.DefaultRunPr = this.DefaultRunPr.Compare(ParaPr.DefaultRunPr);

        if(undefined != this.Lvl && undefined != ParaPr.Lvl && ParaPr.Lvl === this.Lvl)
            Result_ParaPr.Lvl = this.Lvl;


        if(undefined != this.DefaultTabSize && undefined != ParaPr.DefaultTabSize && ParaPr.DefaultTabSize === this.DefaultTabSize)
            Result_ParaPr.DefaultTabSize = this.DefaultTabSize;

        if (undefined !== this.Tabs && undefined !== ParaPr.Tabs && this.Tabs.Is_Equal(ParaPr.Tabs))
        	Result_ParaPr.Tabs = this.Tabs.Copy();


        return Result_ParaPr;
    },

    Write_ToBinary : function(Writer)
    {
        var StartPos = Writer.GetCurPosition();
        Writer.Skip(4);
        var Flags = 0;

        if ( undefined != this.ContextualSpacing )
        {
            Writer.WriteBool( this.ContextualSpacing );
            Flags |= 1;
        }

        if ( undefined != this.Ind )
        {
            this.Ind.Write_ToBinary(Writer);
            Flags |= 2;
        }

        if ( undefined != this.Jc )
        {
            Writer.WriteByte( this.Jc );
            Flags |= 4;
        }

        if ( undefined != this.KeepLines )
        {
            Writer.WriteBool( this.KeepLines );
            Flags |= 8;
        }

        if ( undefined != this.KeepNext )
        {
            Writer.WriteBool( this.KeepNext );
            Flags |= 16;
        }

        if ( undefined != this.PageBreakBefore )
        {
            Writer.WriteBool( this.PageBreakBefore );
            Flags |= 32;
        }

        if ( undefined != this.Spacing )
        {
            this.Spacing.Write_ToBinary(Writer);
            Flags |= 64;
        }

        if ( undefined != this.Shd )
        {
            this.Shd.Write_ToBinary(Writer);
            Flags |= 128;
        }

        if ( undefined != this.Brd.Between )
        {
            this.Brd.Between.Write_ToBinary( Writer );
            Flags |= 256;
        }

        if ( undefined != this.Brd.Bottom )
        {
            this.Brd.Bottom.Write_ToBinary( Writer );
            Flags |= 512;
        }

        if ( undefined != this.Brd.Left )
        {
            this.Brd.Left.Write_ToBinary( Writer );
            Flags |= 1024;
        }

        if ( undefined != this.Brd.Right )
        {
            this.Brd.Right.Write_ToBinary( Writer );
            Flags |= 2048;
        }

        if ( undefined != this.Brd.Top )
        {
            this.Brd.Top.Write_ToBinary( Writer );
            Flags |= 4096;
        }

        if ( undefined != this.WidowControl )
        {
            Writer.WriteBool( this.WidowControl );
            Flags |= 8192;
        }

        if ( undefined != this.Tabs )
        {
            this.Tabs.Write_ToBinary( Writer );
            Flags |= 16384;
        }

        if ( undefined != this.NumPr )
        {
            this.NumPr.Write_ToBinary( Writer );
            Flags |= 32768;
        }

        if ( undefined != this.PStyle )
        {
            Writer.WriteString2( this.PStyle );
            Flags |= 65536;
        }

        if ( undefined != this.FramePr )
        {
            this.FramePr.Write_ToBinary( Writer );
            Flags |= 131072;
        }

        if(undefined != this.DefaultRunPr)
        {
            this.DefaultRunPr.Write_ToBinary( Writer );
            Flags |= 262144;
        }

        if(undefined != this.Bullet)
        {
            this.Bullet.Write_ToBinary( Writer );
            Flags |= 524288;
        }

        if(undefined != this.Lvl)
        {
            Writer.WriteByte(this.Lvl);
            Flags |= 1048576;
        }

        if(undefined != this.DefaultTabSize)
        {
            Writer.WriteDouble(this.DefaultTabSize);
            Flags |= 2097152;
        }

        var EndPos = Writer.GetCurPosition();
        Writer.Seek( StartPos );
        Writer.WriteLong( Flags );
        Writer.Seek( EndPos );
    },

    Read_FromBinary : function(Reader)
    {
        var Flags = Reader.GetLong();

        if ( Flags & 1 )
            this.ContextualSpacing = Reader.GetBool();

        if ( Flags & 2 )
        {
            this.Ind = new CParaInd();
            this.Ind.Read_FromBinary( Reader );
        }

        if ( Flags & 4 )
            this.Jc = Reader.GetByte();

        if ( Flags & 8 )
            this.KeepLines = Reader.GetBool();

        if ( Flags & 16 )
            this.KeepNext = Reader.GetBool();

        if ( Flags & 32 )
            this.PageBreakBefore = Reader.GetBool();

        if ( Flags & 64 )
        {
            this.Spacing = new CParaSpacing();
            this.Spacing.Read_FromBinary( Reader );
        }

        if ( Flags & 128 )
        {
            this.Shd = new CDocumentShd();
            this.Shd.Read_FromBinary( Reader );
        }

        if ( Flags & 256 )
        {
            this.Brd.Between = new CDocumentBorder();
            this.Brd.Between.Read_FromBinary( Reader );
        }

        if ( Flags & 512 )
        {
            this.Brd.Bottom = new CDocumentBorder();
            this.Brd.Bottom.Read_FromBinary( Reader );
        }

        if ( Flags & 1024 )
        {
            this.Brd.Left = new CDocumentBorder();
            this.Brd.Left.Read_FromBinary( Reader );
        }

        if ( Flags & 2048 )
        {
            this.Brd.Right = new CDocumentBorder();
            this.Brd.Right.Read_FromBinary( Reader );
        }

        if ( Flags & 4096 )
        {
            this.Brd.Top = new CDocumentBorder();
            this.Brd.Top.Read_FromBinary( Reader );
        }

        if ( Flags & 8192 )
            this.WidowControl = Reader.GetBool();

        if ( Flags & 16384 )
        {
            this.Tabs = new CParaTabs();
            this.Tabs.Read_FromBinary( Reader );
        }

        if ( Flags & 32768 )
        {
            this.NumPr = new CNumPr();
            this.NumPr.Read_FromBinary( Reader );
        }

        if ( Flags & 65536 )
            this.PStyle = Reader.GetString2();

        if ( Flags & 131072 )
        {
            this.FramePr = new CFramePr();
            this.FramePr.Read_FromBinary( Reader );
        }

        if(Flags & 262144)
        {
            this.DefaultRunPr = new CTextPr();
            this.DefaultRunPr.Read_FromBinary(Reader);
        }

        if(Flags & 524288)
        {
            this.Bullet = new AscFormat.CBullet();
            this.Bullet.Read_FromBinary(Reader);
        }

        if(Flags & 1048576)
        {
            this.Lvl = Reader.GetByte();
        }

        if(Flags & 2097152)
        {
            this.DefaultTabSize = Reader.GetDouble();
        }
    },

    isEqual: function(ParaPrUOld,ParaPrNew)
    {
        if(ParaPrUOld == undefined || ParaPrNew == undefined)
            return false;
        for(var pPr in ParaPrUOld)
        {
            if(typeof ParaPrUOld[pPr] == 'object')
            {
                if(!this.isEqual(ParaPrUOld[pPr],ParaPrNew[pPr]))
                    return false
            }
            else
            {
                if(typeof ParaPrUOld[pPr] == "number" && typeof ParaPrNew[pPr] == "number")
                {
                    if(Math.abs(ParaPrUOld[pPr] - ParaPrNew[pPr]) > 0.001)
                        return false;
                }
                else if(ParaPrUOld[pPr] != ParaPrNew[pPr])
                    return false;
            }
        }
        return true;
    },

    Is_Equal : function(ParaPr)
    {
        if (this.ContextualSpacing !== ParaPr.ContextualSpacing
            || true !== IsEqualStyleObjects(this.Ind, ParaPr.Ind)
            || this.Jc !== ParaPr.Jc
            || this.KeepLines !== ParaPr.KeepLines
            || this.KeepNext !== ParaPr.KeepNext
            || this.PageBreakBefore !== ParaPr.PageBreakBefore
            || true !== IsEqualStyleObjects(this.Spacing, ParaPr.Spacing)
            || true !== IsEqualStyleObjects(this.Shd, ParaPr.Shd)
            || true !== IsEqualStyleObjects(this.Brd.Between, ParaPr.Brd.Between)
            || true !== IsEqualStyleObjects(this.Brd.Bottom , ParaPr.Brd.Bottom )
            || true !== IsEqualStyleObjects(this.Brd.Left   , ParaPr.Brd.Left   )
            || true !== IsEqualStyleObjects(this.Brd.Right  , ParaPr.Brd.Right  )
            || true !== IsEqualStyleObjects(this.Brd.Top    , ParaPr.Brd.Top    )
            || this.WidowControl !== ParaPr.WidowControl
            || true !== IsEqualStyleObjects(this.Tabs, ParaPr.Tabs)
            || true !== IsEqualStyleObjects(this.NumPr, ParaPr.NumPr)
            || this.PStyle !== ParaPr.PStyle
            || true !== IsEqualStyleObjects(this.FramePr, ParaPr.FramePr))
            return false;

        return true;
    },

    Get_PresentationBullet: function()
    {
        var Bullet = new CPresentationBullet();
        if(this.Bullet && this.Bullet.isBullet())
        {
            switch(this.Bullet.bulletType.type)
            {
                case AscFormat.BULLET_TYPE_BULLET_CHAR:
                {
                    Bullet.m_nType = numbering_presentationnumfrmt_Char;
                    if(typeof this.Bullet.bulletType.Char === "string" && this.Bullet.bulletType.Char.length > 0)
                    {
                        Bullet.m_sChar = this.Bullet.bulletType.Char.substring(0, 1);
                    }
                    else
                    {
                        Bullet.m_sChar = "•";
                    }
                    if(this.Bullet.bulletTypeface && this.Bullet.bulletTypeface.type == AscFormat.BULLET_TYPE_TYPEFACE_BUFONT)
                    {
                        Bullet.m_bFontTx = false;
                        Bullet.m_sFont = this.Bullet.bulletTypeface.typeface;
                    }
                    break;
                }

                case AscFormat.BULLET_TYPE_BULLET_AUTONUM :
                {
                    Bullet.m_nType = g_NumberingArr[this.Bullet.bulletType.AutoNumType];
                    Bullet.m_nStartAt = this.Bullet.bulletType.startAt;
                    if(this.Bullet.bulletTypeface && this.Bullet.bulletTypeface.type == AscFormat.BULLET_TYPE_TYPEFACE_BUFONT)
                    {
                        Bullet.m_bFontTx = false;
                        Bullet.m_sFont = this.Bullet.bulletTypeface.typeface;
                    }
                    break;
                }
                case AscFormat.BULLET_TYPE_BULLET_NONE :
                {
                    break;
                }
                case AscFormat.BULLET_TYPE_BULLET_BLIP :
                {
                    Bullet.m_nType = numbering_presentationnumfrmt_Char;
                    Bullet.m_sChar = "•";
                    break;
                }
            }
        }
        return Bullet;
    },

    Have_PrChange : function()
    {
        if (undefined === this.PrChange || null === this.PrChange)
            return false;

        return true;
    },

    Add_PrChange : function()
    {
        this.PrChange = this.Copy();
        this.ReviewInfo = new CReviewInfo();
        this.ReviewInfo.Update();
    },

    Set_PrChange : function(PrChange, ReviewInfo)
    {
        this.PrChange   = PrChange;
        this.ReviewInfo = ReviewInfo;
    },

    Remove_PrChange : function()
    {
        delete this.PrChange;
        delete this.ReviewInfo;
    }
};
CParaPr.prototype.Is_Empty         = function()
{
	if (undefined !== this.ContextualSpacing
		|| true !== this.Ind.Is_Empty()
		|| undefined !== this.Jc
		|| undefined !== this.KeepLines
		|| undefined !== this.KeepNext
		|| undefined !== this.PageBreakBefore
		|| true !== this.Spacing.Is_Empty()
		|| undefined !== this.Shd
		|| undefined !== this.Brd.First
		|| undefined !== this.Brd.Last
		|| undefined !== this.Brd.Between
		|| undefined !== this.Brd.Bottom
		|| undefined !== this.Brd.Left
		|| undefined !== this.Brd.Right
		|| undefined !== this.Brd.Top
		|| undefined !== this.WidowControl
		|| undefined !== this.Tabs
		|| undefined !== this.NumPr
		|| undefined !== this.PStyle)
		return false;

	return true;
};
CParaPr.prototype.Get_DiffPrChange = function()
{
    var ParaPr = new CParaPr();

    if (false === this.Have_PrChange())
        return ParaPr;

    var PrChange = this.PrChange;

    if (this.ContextualSpacing !== PrChange.ContextualSpacing)
        ParaPr.ContextualSpacing = this.ContextualSpacing;

    ParaPr.Ind = this.Ind.Get_Diff(PrChange.Ind);

    if (this.Jc !== PrChange.Jc)
        ParaPr.Jc = this.Jc;

    if (this.KeepLines !== PrChange.KeepLines)
        ParaPr.KeepLines = this.KeepLines;

    if (this.KeepNext !== PrChange.KeepNext)
        ParaPr.KeepNext = this.KeepNext;

    if (this.PageBreakBefore !== PrChange.PageBreakBefore)
        ParaPr.PageBreakBefore = this.PageBreakBefore;

    ParaPr.Spacing = this.Spacing.Get_Diff(PrChange.Spacing);

    // TODO: Shd
    // TODO: Brd

    if (this.WidowControl !== PrChange.WidowControl)
        ParaPr.WidowControl = this.WidowControl;

    if (this.Tabs !== PrChange.Tabs)
        ParaPr.Tabs = this.Tabs;

    if (this.NumPr !== PrChange.NumPr)
        ParaPr.NumPr = this.NumPr;

    if (this.PStyle !== PrChange.PStyle)
        ParaPr.PStyle = this.PStyle;

    return ParaPr;
};
CParaPr.prototype.Get_ContextualSpacing = function()
{
    return this.ContextualSpacing;
};
CParaPr.prototype.Get_IndLeft = function()
{
    return this.Ind.Left;
};
CParaPr.prototype.Get_IndRight = function()
{
    return this.Ind.Right;
};
CParaPr.prototype.Get_IndFirstLine = function()
{
    return this.Ind.FirstLine;
};
CParaPr.prototype.Get_Jc = function()
{
    return this.Jc;
};
CParaPr.prototype.Get_KeepLines = function()
{
    return this.KeepLines;
};
CParaPr.prototype.Get_KeepNext = function()
{
    return this.KeepNext;
};
CParaPr.prototype.Get_PageBreakBefore = function()
{
    return this.PageBreakBefore;
};
CParaPr.prototype.Get_SpacingLine = function()
{
    return this.Spacing.Line;
};
CParaPr.prototype.Get_SpacingLineRule = function()
{
    return this.Spacing.LineRule;
};
CParaPr.prototype.Get_SpacingBefore = function()
{
    return this.Spacing.Before;
};
CParaPr.prototype.Get_SpacingBeforeAutoSpacing = function()
{
    return this.Spacing.BeforeAutoSpacing;
};
CParaPr.prototype.Get_SpacingAfter = function()
{
    return this.Spacing.After;
};
CParaPr.prototype.Get_SpacingAfterAutoSpacing = function()
{
    return this.Spacing.AfterAutoSpacing;
};
CParaPr.prototype.Get_WidowControl = function()
{
    return this.WidowControl;
};
CParaPr.prototype.Get_Tabs = function()
{
    return this.Tabs;
};
CParaPr.prototype.Get_NumPr = function()
{
    return this.NumPr;
};
CParaPr.prototype.Get_PStyle = function()
{
    return this.PStyle;
};
//----------------------------------------------------------------------------------------------------------------------
// CParaPr Export
//----------------------------------------------------------------------------------------------------------------------
CParaPr.prototype['Get_ContextualSpacing']        = CParaPr.prototype.Get_ContextualSpacing;
CParaPr.prototype['Get_IndLeft']                  = CParaPr.prototype.Get_IndLeft;
CParaPr.prototype['Get_IndRight']                 = CParaPr.prototype.Get_IndRight;
CParaPr.prototype['Get_IndFirstLine']             = CParaPr.prototype.Get_IndFirstLine;
CParaPr.prototype['Get_Jc']                       = CParaPr.prototype.Get_Jc;
CParaPr.prototype['Get_KeepLines']                = CParaPr.prototype.Get_KeepLines;
CParaPr.prototype['Get_KeepNext']                 = CParaPr.prototype.Get_KeepNext;
CParaPr.prototype['Get_PageBreakBefore']          = CParaPr.prototype.Get_PageBreakBefore;
CParaPr.prototype['Get_SpacingLine']              = CParaPr.prototype.Get_SpacingLine;
CParaPr.prototype['Get_SpacingLineRule']          = CParaPr.prototype.Get_SpacingLineRule;
CParaPr.prototype['Get_SpacingBefore']            = CParaPr.prototype.Get_SpacingBefore;
CParaPr.prototype['Get_SpacingBeforeAutoSpacing'] = CParaPr.prototype.Get_SpacingBeforeAutoSpacing;
CParaPr.prototype['Get_SpacingAfter']             = CParaPr.prototype.Get_SpacingAfter;
CParaPr.prototype['Get_SpacingAfterAutoSpacing']  = CParaPr.prototype.Get_SpacingAfterAutoSpacing;
CParaPr.prototype['Get_WidowControl']             = CParaPr.prototype.Get_WidowControl;
CParaPr.prototype['Get_Tabs']                     = CParaPr.prototype.Get_Tabs;
CParaPr.prototype['Get_NumPr']                    = CParaPr.prototype.Get_NumPr;
CParaPr.prototype['Get_PStyle']                   = CParaPr.prototype.Get_PStyle;
//----------------------------------------------------------------------------------------------------------------------

function Copy_Bounds(Bounds)
{
    if ( undefined === Bounds )
        return {};
    var Bounds_new = {};
    Bounds_new.Bottom = Bounds.Bottom;
    Bounds_new.Left   = Bounds.Left;
    Bounds_new.Right  = Bounds.Right;
    Bounds_new.Top    = Bounds.Top;
    return Bounds_new;
}

function asc_CStyle()
{
    this.Name    = "";

    this.BasedOn = "";
    this.Next    = "";
    this.Link    = "";
    this.Type    = styletype_Paragraph;

    this.TextPr = new CTextPr();
    this.ParaPr = new CParaPr();
}
asc_CStyle.prototype.get_Name = function()
{
    return this.Name;
};
asc_CStyle.prototype.put_Name = function(sName)
{
    this.Name = sName;
};
asc_CStyle.prototype.put_BasedOn = function(Name)
{
    this.BasedOn = Name;
};
asc_CStyle.prototype.get_BasedOn = function()
{
    return this.BasedOn;
};
asc_CStyle.prototype.put_Next = function(Name)
{
    this.Next = Name;
};
asc_CStyle.prototype.get_Next = function()
{
    return this.Next;
};
asc_CStyle.prototype.put_Type = function(Type)
{
    this.Type = Type;
};
asc_CStyle.prototype.get_Type = function()
{
    return this.Type;
};
asc_CStyle.prototype.put_Link = function(LinkStyle)
{
    this.Link = LinkStyle;
};
asc_CStyle.prototype.get_Link = function()
{
    return this.Link;
};
asc_CStyle.prototype.fill_ParaPr = function(oPr)
{
    this.ParaPr = oPr.Copy();
};
asc_CStyle.prototype.get_ParaPr = function()
{
    return this.ParaPr;
};
asc_CStyle.prototype.fill_TextPr = function(oPr)
{
    this.TextPr = oPr.Copy();
};
asc_CStyle.prototype.get_TextPr = function()
{
    return this.TextPr;
};

//---------------------------------------------------------export---------------------------------------------------
window['Asc'] = window['Asc'] || {};
window['AscCommonWord'] = window['AscCommonWord'] || {};
window["Asc"]["asc_CStyle"] = window["Asc"].asc_CStyle = asc_CStyle;
asc_CStyle.prototype["get_Name"]    = asc_CStyle.prototype.get_Name;
asc_CStyle.prototype["put_Name"]    = asc_CStyle.prototype.put_Name;
asc_CStyle.prototype["get_BasedOn"] = asc_CStyle.prototype.get_BasedOn;
asc_CStyle.prototype["put_BasedOn"] = asc_CStyle.prototype.put_BasedOn;
asc_CStyle.prototype["get_Next"]    = asc_CStyle.prototype.get_Next;
asc_CStyle.prototype["put_Next"]    = asc_CStyle.prototype.put_Next;
asc_CStyle.prototype["get_Type"]    = asc_CStyle.prototype.get_Type;
asc_CStyle.prototype["put_Type"]    = asc_CStyle.prototype.put_Type;
asc_CStyle.prototype["get_Link"]    = asc_CStyle.prototype.get_Link;
asc_CStyle.prototype["put_Link"]    = asc_CStyle.prototype.put_Link;

window["AscCommonWord"].CDocumentColor = CDocumentColor;
window["AscCommonWord"].CStyle = CStyle;
window["AscCommonWord"].CTextPr = CTextPr;
window["AscCommonWord"].CParaTabs = CParaTabs;
window["AscCommonWord"].g_dKoef_pt_to_mm = g_dKoef_pt_to_mm;
window["AscCommonWord"].border_Single = border_Single;
window["AscCommonWord"].Default_Tab_Stop = Default_Tab_Stop;
window["AscCommonWord"].highlight_None = highlight_None;
window["AscCommonWord"].spacing_Auto = spacing_Auto;
window["AscCommonWord"].wrap_NotBeside = wrap_NotBeside;
window["AscCommonWord"].wrap_Around = wrap_Around;

// Создаем глобальные дефолтовые стили, чтобы быстро можно было отдать дефолтовые настройки
var g_oDocumentDefaultTextPr = new CTextPr();
var g_oDocumentDefaultParaPr = new CParaPr();
var g_oDocumentDefaultTablePr = new CTablePr();
var g_oDocumentDefaultTableCellPr = new CTableCellPr();
var g_oDocumentDefaultTableRowPr = new CTableRowPr();
var g_oDocumentDefaultTableStylePr = new CTableStylePr();
g_oDocumentDefaultTextPr.Init_Default();
g_oDocumentDefaultParaPr.Init_Default();
g_oDocumentDefaultTablePr.Init_Default();
g_oDocumentDefaultTableCellPr.Init_Default();
g_oDocumentDefaultTableRowPr.Init_Default();
g_oDocumentDefaultTableStylePr.Init_Default();

// ----------------------------------------------------------------
