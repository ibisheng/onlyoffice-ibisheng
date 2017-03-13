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
var History = AscCommon.History;

var MATH_MC_JC = MCJC_CENTER;

function CMathMatrixColumnPr()
{
    this.count = 1;
    this.mcJc  = MCJC_CENTER;
}
CMathMatrixColumnPr.prototype.Set_FromObject = function(Obj)
{
    if (undefined !== Obj.count && null !== Obj.count)
        this.count = Obj.count;
    else
        this.count = 1;

    if (MCJC_LEFT === Obj.mcJc || MCJC_RIGHT === Obj.mcJc || MCJC_CENTER === Obj.mcJc)
        this.mcJc = Obj.mcJc;
    else
        this.mcJc = MCJC_CENTER;
};
CMathMatrixColumnPr.prototype.Copy = function()
{
    var NewPr = new CMathMatrixColumnPr();

    NewPr.count = this.count;
    NewPr.mcJc  = this.mcJc;

    return NewPr;
};
CMathMatrixColumnPr.prototype.Write_ToBinary = function(Writer)
{
    // Long : count
    // Long : mcJc

    Writer.WriteLong(this.count);
    Writer.WriteLong(this.mcJc);
};
CMathMatrixColumnPr.prototype.Read_FromBinary = function(Reader)
{
    // Long : count
    // Long : mcJc

    this.count = Reader.GetLong();
    this.mcJc  = Reader.GetLong();
};

function CMathMatrixPr()
{
    this.row     = 1;

    this.cGp     = 0;
    this.cGpRule = 0;
    this.cSp     = 0;

    this.rSp     = 0;
    this.rSpRule = 0;

    this.mcs     = [];
    this.baseJc  = BASEJC_CENTER;
    this.plcHide = false;
}
CMathMatrixPr.prototype.Set_FromObject = function(Obj)
{
    if (undefined !== Obj.row && null !== Obj.row)
        this.row = Obj.row;

    if (undefined !== Obj.cGp && null !== Obj.cGp)
        this.cGp = Obj.cGp;

    if (undefined !== Obj.cGpRule && null !== Obj.cGpRule)
        this.cGpRule = Obj.cGpRule;

    if (undefined !== Obj.cSp && null !== Obj.cSp)
        this.cSp = Obj.cSp;

    if (undefined !== Obj.rSpRule && null !== Obj.rSpRule)
        this.rSpRule = Obj.rSpRule;

    if (undefined !== Obj.rSp && null !== Obj.rSp)
        this.rSp = Obj.rSp;

    if(true === Obj.plcHide || 1 === Obj.plcHide)
        this.plcHide = true;
    else
        this.plcHide = false;

    if(BASEJC_CENTER === Obj.baseJc || BASEJC_TOP === Obj.baseJc || BASEJC_BOTTOM === Obj.baseJc)
        this.baseJc = Obj.baseJc;

    var nColumnsCount = 0;
    if (undefined !== Obj.mcs.length)
    {
        var nMcsCount = Obj.mcs.length;

        if (0 !== nMcsCount)
        {
            this.mcs.length = nMcsCount;
            for (var nMcsIndex = 0; nMcsIndex < nMcsCount; nMcsIndex++)
            {
                this.mcs[nMcsIndex] = new CMathMatrixColumnPr();
                this.mcs[nMcsIndex].Set_FromObject(Obj.mcs[nMcsIndex]);
                nColumnsCount += this.mcs[nMcsIndex].count;
            }
        }
        else if (undefined !== Obj.column)
            nColumnsCount = Obj.column;
    }

    return nColumnsCount;
};
CMathMatrixPr.prototype.Copy = function()
{
    var NewPr = new CMathMatrixPr();

    NewPr.row     = this.row    ;
    NewPr.cGp     = this.cGp    ;
    NewPr.cGpRule = this.cGpRule;
    NewPr.cSp     = this.cSp    ;
    NewPr.rSp     = this.rSp    ;
    NewPr.rSpRule = this.rSpRule;
    NewPr.baseJc  = this.baseJc ;
    NewPr.plcHide = this.plcHide;

    var nCount = this.mcs.length;
    for (var nMcsIndex = 0; nMcsIndex < nCount; nMcsIndex++)
    {
        NewPr.mcs[nMcsIndex] = this.mcs[nMcsIndex].Copy();
    }

    return NewPr;
};
CMathMatrixPr.prototype.Get_ColumnsCount = function()
{
    var nColumnsCount = 0;
    for (var nMcsIndex = 0, nMcsCount = this.mcs.length; nMcsIndex < nMcsCount; nMcsIndex++)
    {
        nColumnsCount += this.mcs[nMcsIndex].count;
    }
    return nColumnsCount;
};
CMathMatrixPr.prototype.Get_ColumnPrPos = function(PosColumn)
{
    var Count = 0;
    for(var Pos = 0,  nMcsCount = this.mcs.length; Pos < nMcsCount - 1; Pos++)
    {
        if(PosColumn < Count + this.mcs[Pos].count)
            break;

        Count += this.mcs[Pos].count;
    }

    return Pos;
};
CMathMatrixPr.prototype.Modify_ColumnCount = function(PosColumn, DiffCount)
{
    var Pos = this.Get_ColumnPrPos(PosColumn);
    this.mcs[Pos].count += DiffCount;
};
CMathMatrixPr.prototype.Get_ColumnMcJc = function(PosColumn)
{
    var Pos = this.Get_ColumnPrPos(PosColumn);
    return this.mcs[Pos].mcJc;
};
CMathMatrixPr.prototype.Set_Row = function(Value)
{
    this.row = Value;
};
CMathMatrixPr.prototype.Set_BaseJc = function(Value)
{
    this.baseJc = Value;
};
CMathMatrixPr.prototype.Set_ColumnJc = function(Value, PosColumn)
{
    var Count = 0, nMcsCount = this.mcs.length;
    var Pos, MColumnPr;

    for(Pos = 0; Pos < nMcsCount - 1; Pos++)
    {
        if(PosColumn < Count + this.mcs[Pos].count)
            break;

        Count += this.mcs[Pos].count;
    }

    if(this.mcs[Pos].count == 1)
    {
        this.mcs[Pos].mcJc = Value;
    }
    else if(Count < PosColumn  && PosColumn < Count + this.mcs[Pos].count)
    {
        var CountRight = this.mcs[Pos].count + Count - PosColumn - 1,
            CountLeft  = this.mcs[Pos].count - CountRight - 1;

        this.mcs[Pos].count  = CountLeft;
        var MColumnPrRight   = new CMathMatrixColumnPr();
        MColumnPrRight.count = CountRight;
        MColumnPrRight.mcJc  = this.mcs[Pos].mcJc;

        this.mcs.splice(Pos + 1, 0, MColumnPrRight);

        MColumnPr = new CMathMatrixColumnPr();
        MColumnPr.count = 1;
        MColumnPr.mcJc  = Value;
        this.mcs.splice(Pos + 1, 0, MColumnPr);
    }
    else
    {
        this.mcs[Pos].count--;
        var ColumnPos = PosColumn == Count ? Pos : Pos + 1;
        MColumnPr = new CMathMatrixColumnPr();
        MColumnPr.count = 1;
        MColumnPr.mcJc  = Value;
        this.mcs.splice(ColumnPos, 0, MColumnPr);
    }

};
CMathMatrixPr.prototype.Write_ToBinary = function(Writer)
{
    // Long  : row
    // Long  : cGp
    // Long  : cGpRule
    // Long  : rSp
    // Long  : rSpRule
    // Long  : baseJc
    // Bool  : plcHide
    // Long  : count of mcs
    // Array : mcs (CMathMatrixColumnPr)

    Writer.WriteLong(this.row);
    Writer.WriteLong(this.cGp);
    Writer.WriteLong(this.cGpRule);
    Writer.WriteLong(this.rSp);
    Writer.WriteLong(this.rSpRule);
    Writer.WriteLong(this.baseJc);
    Writer.WriteBool(this.plcHide);

    var nMcsCount = this.mcs.length;
    Writer.WriteLong(nMcsCount);
    for (var nIndex = 0; nIndex < nMcsCount; nIndex++)
    {
        this.mcs[nIndex].Write_ToBinary(Writer);
    }
};
CMathMatrixPr.prototype.Read_FromBinary = function(Reader)
{
    // Long  : row
    // Long  : cGp
    // Long  : cGpRule
    // Long  : rSp
    // Long  : rSpRule
    // Long  : baseJc
    // Bool  : plcHide
    // Long  : count of mcs
    // Array : mcs (CMColumnsPr)

    this.row = Reader.GetLong();
    this.cGp = Reader.GetLong();
    this.cGpRule = Reader.GetLong();
    this.rSp     = Reader.GetLong();
    this.rSpRule = Reader.GetLong();
    this.baseJc  = Reader.GetLong();
    this.plcHide = Reader.GetBool();

    var nMcsCount = Reader.GetLong();
    this.mcs.length = nMcsCount;
    for (var nIndex = 0; nIndex < nMcsCount; nIndex++)
    {
        this.mcs[nIndex] = new CMathMatrixColumnPr();
        this.mcs[nIndex].Read_FromBinary(Reader);
    }
};

function CMathMatrixGapPr(Type)
{
    this.Type   = Type;
    this.Rule   = 0;
    this.Gap    = 0;
    this.MinGap = 0;
}
CMathMatrixGapPr.prototype.Set_DefaultSpace = function(Rule, Gap, MinGap)
{
    this.Rule   = Rule;
    this.Gap    = Gap;
    this.MinGap = MinGap;
};


/**
 *
 * @constructor
 * @extends {CMathBase}
 */
function CMatrixBase()
{
	CMathBase.call(this);

    this.SpaceRow       = new CMathMatrixGapPr(MATH_MATRIX_ROW);
    this.SpaceColumn    = new CMathMatrixGapPr(MATH_MATRIX_COLUMN);

    this.gaps =
    {
        row: [],
        column: []
    };

    this.Set_DefaultSpace();
}
CMatrixBase.prototype = Object.create(CMathBase.prototype);
CMatrixBase.prototype.constructor = CMatrixBase;
CMatrixBase.prototype.recalculateSize = function(oMeasure, RPI)
{
    if(this.RecalcInfo.bProps)
    {
        if(this.nRow > 1)
            this.Set_RuleGap(this.SpaceRow, this.Pr.rSpRule, this.Pr.rSp);

        if(this.nCol > 1)
        {
            this.Set_RuleGap(this.SpaceColumn, this.Pr.cGpRule, this.Pr.cGp, this.Pr.cSp);
        }

        if(this.kind == MATH_MATRIX)
        {
            // выставим выравнивание для столбцов
            if(this.Pr.mcs !== undefined)
            {
                var lng = this.Pr.mcs.length;
                var col = 0;

                this.alignment.wdt.length = 0;

                for(var j = 0; j < lng; j++)
                {
                    var mc = this.Pr.mcs[j],
                        count = mc.count;

                    for(var i = 0; i < count; i++)
                    {
                        this.alignment.wdt[col] = mc.mcJc;
                        col++;
                    }
                }
            }


            if(this.Pr.plcHide)
                this.hidePlaceholder(true);
        }

        this.RecalcInfo.bProps = false;
    }

    var FontSize = this.Get_TxtPrControlLetter().FontSize;
    var metrics = this.getMetrics();

    if(this.nCol > 1)
    {
        var gapsCol = this.Get_ColumnGap(this.SpaceColumn, FontSize);

        for(var i = 0; i < this.nCol - 1; i++)
            this.gaps.column[i] = gapsCol;
    }

    this.gaps.column[this.nCol - 1] = 0;

    if(this.nRow > 1)
    {
        var intervalRow = this.Get_RowSpace(this.SpaceRow, FontSize);

        var divCenter = 0;

        var plH = 0.2743827160493827*FontSize;
        var minGp = this.SpaceRow.MinGap*FontSize*g_dKoef_pt_to_mm;
        minGp -= plH;

        for(var j = 0; j < this.nRow - 1; j++)
        {
            divCenter = intervalRow - (metrics.descents[j] + metrics.ascents[j + 1]);
            this.gaps.row[j] = minGp > divCenter ? minGp : divCenter;
        }
    }

    this.gaps.row[this.nRow - 1] = 0;


    var height = 0, width = 0;

    for(var i = 0; i < this.nCol; i++)
        width +=  this.gaps.column[i] + metrics.widths[i];

    for(var j = 0; j < this.nRow; j++)
        height += this.gaps.row[j] + metrics.ascents[j] + metrics.descents[j];

    var ascent = 0;

    if(this.Pr.baseJc == BASEJC_TOP)
    {
        for(var j = 0; j < this.nCol; j++)
            ascent = this.elements[0][j].size.ascent > ascent ? this.elements[0][j].size.ascent : ascent;
    }
    else if(this.Pr.baseJc == BASEJC_BOTTOM)
    {
        var descent = 0,
            currDsc;
        for(var j = 0; j < this.nCol; j++)
        {
            currDsc = this.elements[this.nRow -1][j].size.height - this.elements[this.nRow -1][j].size.ascent;
            descent = currDsc > descent ? currDsc : descent;

            ascent = height - descent;
        }
    }
    else /*this.Pr.baseJc == 0*/
        ascent = this.getAscent(oMeasure, height);


    width += this.GapLeft + this.GapRight;

    this.size.height = height;
    this.size.width  = width;
    this.size.ascent = ascent;
};
CMatrixBase.prototype.Set_DefaultSpace = function()
{
    this.SpaceRow.Set_DefaultSpace(0, 0, 13/12); // MinGap - em
    this.SpaceColumn.Set_DefaultSpace(0, 0, 0);  // MinGap / 20 pt
};
CMatrixBase.prototype.Set_RuleGap = function(oSpace, Rule, Gap, MinGap)
{
    var bInt  =  Rule == Rule - 0 && Rule == Rule^0,
        bRule =  Rule >= 0 && Rule <= 4;

    if(bInt && bRule)
        oSpace.Rule = Rule;

    if(Gap == Gap - 0 && Gap == Gap^0)
        oSpace.Gap = Gap;

    if(MinGap == MinGap - 0 && MinGap == MinGap^0)
        oSpace.MinGap = MinGap;
};
CMatrixBase.prototype.Get_ColumnGap = function(SpaceColumn, FontSize)
{
    var ColumnGap = this.Get_Gap(SpaceColumn, FontSize, 1);

    var wPlh = 0.324*FontSize;
    var MinGap = SpaceColumn.MinGap / 20 * g_dKoef_pt_to_mm - wPlh;

    return ColumnGap > MinGap ? ColumnGap : MinGap;
};
CMatrixBase.prototype.Get_RowSpace = function(SpaceRow, FontSize)
{
    var LineGap = this.Get_Gap(SpaceRow, FontSize, 7/6);

    var MinGap = SpaceRow.MinGap*FontSize*g_dKoef_pt_to_mm;

    return LineGap > MinGap ? LineGap : MinGap;
};
CMatrixBase.prototype.Get_Gap = function(oSpace, FontSize, coeff)
{
    var Space, Gap;

    if(oSpace.Rule == 0)
        Space = coeff;                  //em
    else if(oSpace.Rule == 1)
        Space = coeff*1.5;              //em
    else if(oSpace.Rule == 2)
        Space = coeff*2;                //em
    else if(oSpace.Rule == 3)
        Space = oSpace.Gap/20;          //pt
    else if(oSpace.Rule == 4)
        Space = coeff * oSpace.Gap/2;   //em
    else
        Space = coeff;


    if(oSpace.Rule == 3)
        Gap = Space*g_dKoef_pt_to_mm;          //pt
    else
        Gap = Space*FontSize*g_dKoef_pt_to_mm; //em


    return Gap;
};
CMatrixBase.prototype.getRowsCount = function()
{
    return this.Pr.row;
};
CMatrixBase.prototype.Add_Row = function(Pos)
{
	var Items       = [],
		CountColumn = this.getColsCount();

	for (var CurPos = 0; CurPos < CountColumn; CurPos++)
	{
		var NewContent = new CMathContent();
		NewContent.Correct_Content(true);
		Items.push(NewContent);
	}

	History.Add(new CChangesMathMatrixAddRow(this, Pos, Items));
	this.raw_AddRow(Pos, Items);
};
CMatrixBase.prototype.raw_AddRow = function(Pos, Items)
{
    // изменить кол-во строк в матрицы и добавить элементы новой строки нужно в одной точке истории
    // т.к. при добавлении, удалении элементов учитывается кол-во строк и столбцов для заполнения массива elements

    this.Pr.Set_Row(this.Pr.row + 1);
    this.raw_AddToContent(Pos, Items, true);

    // чтобы корректно обновить NearPos пройдемся циклом еще раз по всем позициям добавленных контентов
    for(var CurPos = Pos; CurPos < Pos + Items.length; CurPos++)
    {
        this.private_UpdatePosOnAdd( CurPos, true);
    }
};
CMatrixBase.prototype.raw_RemoveRow = function(Pos, Count)
{
    this.Pr.Set_Row(this.Pr.row - 1);
    this.raw_RemoveFromContent(Pos, Count);

    // Обновим текущую позицию
    if (this.CurPos > Pos + Count)
        this.CurPos -= Count;
    else if (this.CurPos > Pos )
        this.CurPos = Pos;

    this.private_CorrectCurPos();
    this.private_UpdatePosOnRemove(Pos, Count);
};
CMatrixBase.prototype.Remove_Row = function(RowPos)
{
	if (this.Pr.row > 1)
	{
		var ColumnCount = this.getColsCount();
		var NextPos     = RowPos * ColumnCount;
		var Items       = this.Content.slice(NextPos, NextPos + ColumnCount);

		History.Add(new CChangesMathMatrixRemoveRow(this, NextPos, Items));
		this.raw_RemoveRow(NextPos, Items.length);
	}
};
CMatrixBase.prototype.SetBaseJc = function(Value)
{
	if (this.Pr.baseJc !== Value)
	{
		History.Add(new CChangesMathMatrixBaseJc(this, this.Pr.baseJc, Value));
		this.raw_SetBaseJc(Value);
	}
};
CMatrixBase.prototype.raw_SetBaseJc = function(Value)
{
    this.Pr.Set_BaseJc(Value);
};
CMatrixBase.prototype.Modify_Interval = function(Item, NewRule, NewGap)
{
    var OldRule, OldGap;

    if(Item.Type == MATH_MATRIX_ROW)
    {
        OldRule = this.Pr.rSpRule;
        OldGap  = this.Pr.rSp;
    }
    else
    {
        OldRule = this.Pr.cGpRule;
        OldGap  = this.Pr.cGp;
    }

    if(NewRule !== OldRule || NewGap !== OldGap)
    {
        History.Add(new CChangesMathMatrixInterval(this, Item.Type, OldRule, OldGap, NewRule, NewGap));
        this.raw_SetInterval(Item.Type, NewRule, NewGap);
    }
};
CMatrixBase.prototype.raw_SetInterval = function(Item, Rule, Gap)
{
    if(Item == MATH_MATRIX_ROW)
    {
        this.Pr.rSpRule = Rule;
        this.Pr.rSp     = Gap;
        this.Set_RuleGap(this.SpaceRow, Rule, Gap);
    }
    else if(Item == MATH_MATRIX_COLUMN)
    {
        this.Pr.cGpRule = Rule;
        this.Pr.cGp     = Gap;
        this.Set_RuleGap(this.SpaceColumn, Rule, Gap, this.Pr.cSp);
    }
};

/**
 *
 * @param props
 * @constructor
 * @extends {CMatrixBase}
 */
function CMathMatrix(props)
{
	CMatrixBase.call(this);

	this.Id             = AscCommon.g_oIdCounter.Get_NewId();
    this.Pr             = new CMathMatrixPr();

    this.column         = 0;

    if(props !== null && props !== undefined)
        this.init(props);

    AscCommon.g_oTableId.Add( this, this.Id );
}
CMathMatrix.prototype = Object.create(CMatrixBase.prototype);
CMathMatrix.prototype.constructor = CMathMatrix;

CMathMatrix.prototype.ClassType = AscDFH.historyitem_type_matrix;
CMathMatrix.prototype.kind      = MATH_MATRIX;
CMathMatrix.prototype.init = function(props)
{
    this.setProperties(props);
    this.column = this.Pr.Get_ColumnsCount();

    var nRowsCount = this.getRowsCount();
    var nColsCount = this.getColsCount();

    this.Fill_LogicalContent(nRowsCount * nColsCount);

    this.fillContent();
};
CMathMatrix.prototype.setPosition = function(pos, PosInfo)
{
    this.pos.x = pos.x;

    if(this.bInside === true)
        this.pos.y = pos.y;
    else
        this.pos.y = pos.y - this.size.ascent; ///!!!!

    this.UpdatePosBound(pos, PosInfo);

    var maxWH = this.getWidthsHeights();
    var Widths = maxWH.widths;
    var Heights = maxWH.heights;

    var NewPos = new CMathPosition();

    var h = 0, w = 0;

    for(var i=0; i < this.nRow; i++)
    {
        w = 0;
        for(var j = 0; j < this.nCol; j++)
        {
            var Item = this.elements[i][j];
            var al = this.align(i, j);
            NewPos.x = this.pos.x + this.GapLeft + al.x + w;
            NewPos.y = this.pos.y + al.y + h + Item.size.ascent;

            Item.setPosition(NewPos, PosInfo);
            w += Widths[j] + this.gaps.column[j];
        }
        h += Heights[i] + this.gaps.row[i];
    }

    pos.x += this.size.width;
};
CMathMatrix.prototype.getMetrics = function(RPI)
{
    var Ascents = [];
    var Descents = [];
    var Widths = [];

    for(var i=0; i < this.nRow; i++)
    {
        Ascents[i]  = 0;
        Descents[i] = 0;

        for(var j = 0; j < this.nCol ; j++)
        {
            var size = this.elements[i][j].size;
            Widths[j]   = i > 0  && ( Widths[j] > size.width ) ? Widths[j] : size.width;
            Ascents[i]  = (Ascents[i] > size.ascent ) ? Ascents[i] : size.ascent;
            Descents[i] = (Descents[i] > size.height - size.ascent ) ? Descents[i] : size.height - size.ascent;
        }
    }

    return {ascents: Ascents, descents: Descents, widths: Widths}
};
CMathMatrix.prototype.getContentElement = function(nRowIndex, nColIndex)
{
    return this.Content[nRowIndex * this.getColsCount() + nColIndex];
};
CMathMatrix.prototype.fillContent = function()
{
    this.column = this.Pr.Get_ColumnsCount();

    var nRowsCount = this.getRowsCount();
    var nColsCount = this.getColsCount();

    this.setDimension(nRowsCount, nColsCount);

    for(var nRowIndex = 0; nRowIndex < nRowsCount; nRowIndex++)
    {
        for (var nColIndex = 0; nColIndex < nColsCount; nColIndex++)
        {
            this.elements[nRowIndex][nColIndex] = this.getContentElement(nRowIndex, nColIndex);
        }
    }
};
CMathMatrix.prototype.getColsCount = function()
{
    return this.column;
};
CMathMatrix.prototype.Get_RowPos = function(Pos)
{
    var ColumnCount = this.getColsCount();

    return Pos/ColumnCount >> 0;
};
CMathMatrix.prototype.Get_ColumnPos = function(Pos)
{
    var ColumnCount = this.getColsCount();
    var RowPos      = Pos/ColumnCount >> 0; // номер строки

    return Pos - ColumnCount*RowPos;
};
CMathMatrix.prototype.Apply_MenuProps = function(Props)
{
	if (Props.Type == Asc.c_oAscMathInterfaceType.Matrix)
	{
		var ColumnCount = this.getColsCount(),
			RowPos      = this.Get_RowPos(this.CurPos),
			ColumnPos   = this.Get_ColumnPos(this.CurPos);

		var bGapWholeNumber, bGapNumber;
		var NextPos;

		if (Props.BaseJc !== undefined)
		{
			var BaseJc = this.Pr.baseJc;

			if (Props.BaseJc === Asc.c_oAscMathInterfaceMatrixMatrixAlign.Center)
			{
				BaseJc = BASEJC_CENTER;
			}
			else if (Props.BaseJc === Asc.c_oAscMathInterfaceMatrixMatrixAlign.Bottom)
			{
				BaseJc = BASEJC_BOTTOM;
			}
			else if (Props.BaseJc === Asc.c_oAscMathInterfaceMatrixMatrixAlign.Top)
			{
				BaseJc = BASEJC_TOP;
			}

			this.SetBaseJc(BaseJc);
		}

		if (Props.ColumnJc !== undefined)
		{
			var CurrentMcJc = this.Pr.Get_ColumnMcJc(ColumnPos);
			var McJc        = CurrentMcJc;

			if (Props.ColumnJc === Asc.c_oAscMathInterfaceMatrixColumnAlign.Center)
			{
				McJc = MCJC_CENTER;
			}
			else if (Props.ColumnJc === Asc.c_oAscMathInterfaceMatrixColumnAlign.Left)
			{
				McJc = MCJC_LEFT;
			}
			else if (Props.ColumnJc === Asc.c_oAscMathInterfaceMatrixColumnAlign.Right)
			{
				McJc = MCJC_RIGHT;
			}

			if (CurrentMcJc !== McJc)
			{
				History.Add(new CChangesMathMatrixColumnJc(this, CurrentMcJc, McJc, ColumnPos));
				this.raw_SetColumnJc(McJc, ColumnPos);
			}
		}

		if (Props.RowRule !== undefined)
		{
			switch (Props.RowRule)
			{
				case c_oAscMathInterfaceMatrixRowRule.Single:
				{
					this.Modify_Interval(this.SpaceRow, 0, 0);
					break;
				}
				case c_oAscMathInterfaceMatrixRowRule.OneAndHalf:
				{
					this.Modify_Interval(this.SpaceRow, 1, 0);
					break;
				}
				case c_oAscMathInterfaceMatrixRowRule.Double:
				{
					this.Modify_Interval(this.SpaceRow, 2, 0);
					break;
				}
				case c_oAscMathInterfaceMatrixRowRule.Exactly:
				{
					bGapWholeNumber = Props.Gap !== undefined && Props.Gap + 0 == Props.Gap && Props.Gap >> 0 == Props.Gap;

					if (bGapWholeNumber == true && Props.Gap >= 0 && Props.Gap <= 31680)
					{
						this.Modify_Interval(this.SpaceRow, 3, Props.Gap * 20);
					}

					break;
				}
				case c_oAscMathInterfaceMatrixRowRule.Multiple:
				{
					bGapNumber = Props.Gap !== undefined && Props.Gap + 0 == Props.Gap;

					if (bGapNumber == true && Props.Gap >= 0 && Props.Gap <= 111)
					{
						var Gap = (Props.Gap * 2 + 0.5) >> 0;

						this.Modify_Interval(this.SpaceRow, 4, Gap);
					}

					break;
				}
			}
		}

		if (Props.ColumnRule !== undefined)
		{
			switch (Props.ColumnRule)
			{
				case c_oAscMathInterfaceMatrixColumnRule.Single:
				{
					this.Modify_Interval(this.SpaceColumn, 0, 0);
					break;
				}
				case c_oAscMathInterfaceMatrixColumnRule.OneAndHalf:
				{
					this.Modify_Interval(this.SpaceColumn, 1, 0);
					break;
				}
				case c_oAscMathInterfaceMatrixColumnRule.Double:
				{
					this.Modify_Interval(this.SpaceColumn, 2, 0);
					break;
				}
				case c_oAscMathInterfaceMatrixColumnRule.Exactly:
				{
					bGapWholeNumber = Props.Gap !== undefined && Props.Gap + 0 == Props.Gap && Props.Gap >> 0 == Props.Gap;

					if (bGapWholeNumber == true && Props.Gap >= 0 && Props.Gap <= 31680)
					{
						this.Modify_Interval(this.SpaceColumn, 3, Props.Gap * 20);
					}

					break;
				}
				case c_oAscMathInterfaceMatrixColumnRule.Multiple:
				{
					bGapNumber = Props.Gap !== undefined && Props.Gap + 0 == Props.Gap;

					if (bGapNumber == true && Props.Gap >= 0 && Props.Gap <= 55.87)
					{
						var Gap         = (Props.Gap / 0.21163) >> 0,
							NextMenuGap = (((0.21163 * (Gap + 1)) * 100 + 0.5) >> 0 ) / 100; // учтем округление
																							 // (пример: Props.Gap =
																							 // 2.96)

						if (Props.Gap >= NextMenuGap)
							Gap++;

						this.Modify_Interval(this.SpaceColumn, 4, Gap);
					}

					break;
				}
			}
		}

		if (Props.Action & c_oMathMenuAction.DeleteMatrixRow && this.getRowsCount() > 1)
		{
			this.Remove_Row(RowPos);
		}

		if (Props.Action & c_oMathMenuAction.DeleteMatrixColumn && ColumnCount > 1)
		{
			this.Remove_Column(ColumnPos);
		}

		if (Props.Action & c_oMathMenuAction.InsertMatrixRow)
		{
			if (Props.Action & c_oMathMenuAction.InsertBefore)
			{
				NextPos = RowPos * ColumnCount;
				this.Add_Row(NextPos);
			}
			else
			{
				NextPos = (RowPos + 1) * ColumnCount;     // позиция для вставки массива контентов
				this.Add_Row(NextPos);
			}
		}

		if (Props.Action & c_oMathMenuAction.InsertMatrixColumn)
		{
			if (Props.Action & c_oMathMenuAction.InsertBefore)
			{
				this.Add_Column(ColumnPos);
			}
			else
			{
				this.Add_Column(ColumnPos + 1);
			}
		}

		if (Props.bHidePlh !== undefined)
		{
			if (Props.bHidePlh !== this.Pr.plcHide)
			{
				History.Add(new CChangesMathMatrixPlh(this, this.Pr.plcHide, Props.bHidePlh));
				this.raw_HidePlh(Props.bHidePlh);
			}
		}
	}
};
CMathMatrix.prototype.Get_InterfaceProps = function()
{
    return new CMathMenuMatrix(this);
};
CMathMatrix.prototype.Add_Column = function(ColumnPos)
{
	var Items    = [],
		CountRow = this.getRowsCount();

	for (var CurPos = 0; CurPos < CountRow; CurPos++)
	{
		var NewContent = new CMathContent();
		NewContent.Correct_Content(true);
		Items.push(NewContent);
	}

	History.Add(new CChangesMathMatrixAddColumn(this, ColumnPos, Items));
	this.raw_AddColumn(ColumnPos, Items);
};
CMathMatrix.prototype.raw_AddColumn = function(Pos, Items)
{
    var CountColumn = this.getColsCount();

    var RowPos  = this.CurPos/CountColumn >> 0; // номер строки

    for(var CurPos = 0; CurPos < Items.length; CurPos++)
    {
        this.Content.splice((CountColumn + 1)*CurPos + Pos, 0, Items[CurPos]);
        Items[CurPos].ParentElement = this;

        this.private_UpdatePosOnAdd( (CountColumn + 1)*CurPos + Pos, true);
    }

    this.Modify_ColumnCount(this.CurPos - CountColumn*RowPos, 1);

    this.fillContent();
};
CMathMatrix.prototype.Remove_Column = function(ColumnPos)
{
	var Items       = [],
		CountRow    = this.getRowsCount(),
		CountColumn = this.getColsCount();

	for (var CurPos = 0; CurPos < CountRow; CurPos++)
	{
		Items.push(this.Content[CountColumn * CurPos + ColumnPos]);
	}

	History.Add(new CChangesMathMatrixRemoveColumn(this, ColumnPos, Items));
	this.raw_RemoveColumn(ColumnPos, Items.length);
};
CMathMatrix.prototype.raw_RemoveColumn = function(Pos, CountItems)
{
    var CountColumn = this.getColsCount();
    var RowPos  = this.CurPos/CountColumn >> 0; // номер строки

    for(var CurPos = 0; CurPos < CountItems; CurPos++)
    {
        this.Content.splice((CountColumn-1)*CurPos + Pos, 1);
    }

    this.Modify_ColumnCount(this.CurPos - CountColumn*RowPos, -1);

    this.fillContent();

    // Обновим текущую позицию
    if (this.CurPos > Pos - RowPos)
        this.CurPos -= RowPos;
    else if (this.CurPos > Pos )
        this.CurPos = Pos;

    this.private_CorrectCurPos();
    this.private_UpdatePosOnRemove(Pos, RowPos);
};
CMathMatrix.prototype.Modify_ColumnCount = function(Pos, Count)
{
    this.Pr.Modify_ColumnCount(Pos, Count);
    this.column = this.Pr.Get_ColumnsCount();
};
CMathMatrix.prototype.raw_SetColumnJc = function(Value, ColumnPos)
{
    this.RecalcInfo.bProps = true;
    this.Pr.Set_ColumnJc(Value, ColumnPos);
};
CMathMatrix.prototype.raw_HidePlh = function(Value)
{
    this.Pr.plcHide = Value;
    this.hidePlaceholder(Value);
};
CMathMatrix.prototype.raw_Set_MinColumnWidth = function(Value)
{
    this.Pr.cSp = Value;
    this.Set_RuleGap(this.SpaceColumn, this.Pr.cGpRule, this.Pr.cGp, Value);
};
CMathMatrix.prototype.Is_DeletedItem = function(Action)
{
    var bDeleteMatrix = false;

    if( c_oMathMenuAction.DeleteMatrixRow == Action && 1 == this.getRowsCount())
        bDeleteMatrix = true;
    else if(c_oMathMenuAction.DeleteMatrixColumn == Action && 1 == this.getColsCount())
        bDeleteMatrix = true;

    return bDeleteMatrix;
};
CMathMatrix.prototype.Get_DeletedItemsThroughInterface = function()
{
    return [];
};

/**
 *
 * @param CMathMenuMatrix
 * @constructor
 * @extends {CMathMenuBase}
 */
function CMathMenuMatrix(MathMatrix)
{
	CMathMenuBase.call(this, MathMatrix);

    this.Type           = Asc.c_oAscMathInterfaceType.Matrix;

    if (undefined !== MathMatrix)
    {
        var ColumnPos = MathMatrix.Get_ColumnPos(MathMatrix.CurPos);

        var RowRule, RowGap, ColumnRule, ColumnGap;
        switch (MathMatrix.SpaceRow.Rule)
        {
            default:
            case 0:
            {
                RowRule = c_oAscMathInterfaceMatrixRowRule.Single;
                break;
            }
            case 1:
            {
                RowRule = c_oAscMathInterfaceMatrixRowRule.OneAndHalf;
                break;
            }
            case 2:
            {
                RowRule = c_oAscMathInterfaceMatrixRowRule.Double;
                break;
            }
            case 3:
            {
                RowRule = c_oAscMathInterfaceMatrixRowRule.Exactly;
                RowGap  = MathMatrix.SpaceRow.Gap / 20;
                break;
            }
            case 4:
            {
                RowRule = c_oAscMathInterfaceMatrixRowRule.Multiple;
                RowGap  = MathMatrix.SpaceRow.Gap * 0.5;
                break;
            }
        }

        switch (MathMatrix.SpaceColumn.Rule)
        {
            default:
            case 0:
            {
                ColumnRule = c_oAscMathInterfaceMatrixColumnRule.Single;
                break;
            }
            case 1:
            {
                ColumnRule = c_oAscMathInterfaceMatrixColumnRule.OneAndHalf;
                break;
            }
            case 2:
            {
                ColumnRule = c_oAscMathInterfaceMatrixColumnRule.Double;
                break;
            }
            case 3:
            {
                ColumnRule = c_oAscMathInterfaceMatrixColumnRule.Exactly;
                ColumnGap  = MathMatrix.SpaceColumn.Gap / 20;
                break;
            }
            case 4:
            {
                ColumnRule = c_oAscMathInterfaceMatrixColumnRule.Multiple;
                ColumnGap  = (((0.21163 * MathMatrix.SpaceColumn.Gap) * 100 + 0.5) >> 0 ) / 100;
                break;
            }
        }

        var ColumnJc = MathMatrix.Pr.Get_ColumnMcJc(ColumnPos);

        this.BaseJc         = MathMatrix.Pr.baseJc === BASEJC_CENTER ? Asc.c_oAscMathInterfaceMatrixMatrixAlign.Center : (MathMatrix.Pr.baseJc === BASEJC_BOTTOM ? Asc.c_oAscMathInterfaceMatrixMatrixAlign.Bottom : Asc.c_oAscMathInterfaceMatrixMatrixAlign.Top);
        this.ColumnJc       = ColumnJc === MCJC_CENTER ? Asc.c_oAscMathInterfaceMatrixColumnAlign.Center : (ColumnJc === MCJC_RIGHT ? Asc.c_oAscMathInterfaceMatrixColumnAlign.Right : Asc.c_oAscMathInterfaceMatrixColumnAlign.Left);
        this.RowRule        = RowRule;
        this.RowGap         = RowGap;
        this.ColumnRule     = ColumnRule;
        this.ColumnGap      = ColumnGap;
        this.MinColumnWidth = MathMatrix.Pr.cSp / 20;
        this.bHidePlh       = MathMatrix.Pr.plcHide;
    }
    else
    {
        this.BaseJc         = undefined;
        this.ColumnJc       = undefined;
        this.RowRule        = undefined;
        this.RowGap         = undefined;
        this.ColumnRule     = undefined;
        this.ColumnGap      = undefined;
        this.MinColumnWidth = undefined;
        this.bHidePlh       = undefined;
    }
}
CMathMenuMatrix.prototype = Object.create(CMathMenuBase.prototype);
CMathMenuMatrix.prototype.constructor = CMathMenuMatrix;
CMathMenuMatrix.prototype.get_MatrixAlign     = function(){return this.BaseJc;};
CMathMenuMatrix.prototype.put_MatrixAlign     = function(Align){this.BaseJc = Align;};
CMathMenuMatrix.prototype.get_ColumnAlign     = function(){return this.ColumnJc;};
CMathMenuMatrix.prototype.put_ColumnAlign     = function(Align){this.ColumnJc = Align;};
CMathMenuMatrix.prototype.get_RowRule         = function(){return this.RowRule;};
CMathMenuMatrix.prototype.put_RowRule         = function(RowRule){this.RowRule = RowRule;};
CMathMenuMatrix.prototype.get_RowGap          = function(){return this.RowGap;};
CMathMenuMatrix.prototype.put_RowGap          = function(RowGap){this.RowGap = RowGap;};
CMathMenuMatrix.prototype.get_ColumnRule      = function(){return this.ColumnRule;};
CMathMenuMatrix.prototype.put_ColumnRule      = function(ColumnRule){this.ColumnRule = ColumnRule;};
CMathMenuMatrix.prototype.get_ColumnGap       = function(){return this.ColumnGap;};
CMathMenuMatrix.prototype.put_ColumnGap       = function(ColumnGap){this.ColumnGap = ColumnGap;};
CMathMenuMatrix.prototype.get_MinColumnSpace  = function(){return this.MinColumnWidth;};
CMathMenuMatrix.prototype.put_MinColumnSpace  = function(MinSpace){this.MinColumnWidth = MinSpace;};
CMathMenuMatrix.prototype.get_HidePlaceholder = function(){return this.bHidePlh;};
CMathMenuMatrix.prototype.put_HidePlaceholder = function(Hide){this.bHidePlh = Hide;};

window["CMathMenuMatrix"] = CMathMenuMatrix;
CMathMenuMatrix.prototype["get_MatrixAlign"]     = CMathMenuMatrix.prototype.get_MatrixAlign    ;
CMathMenuMatrix.prototype["put_MatrixAlign"]     = CMathMenuMatrix.prototype.put_MatrixAlign    ;
CMathMenuMatrix.prototype["get_ColumnAlign"]     = CMathMenuMatrix.prototype.get_ColumnAlign    ;
CMathMenuMatrix.prototype["put_ColumnAlign"]     = CMathMenuMatrix.prototype.put_ColumnAlign    ;
CMathMenuMatrix.prototype["get_RowRule"]         = CMathMenuMatrix.prototype.get_RowRule        ;
CMathMenuMatrix.prototype["put_RowRule"]         = CMathMenuMatrix.prototype.put_RowRule        ;
CMathMenuMatrix.prototype["get_RowGap"]          = CMathMenuMatrix.prototype.get_RowGap         ;
CMathMenuMatrix.prototype["put_RowGap"]          = CMathMenuMatrix.prototype.put_RowGap         ;
CMathMenuMatrix.prototype["get_ColumnRule"]      = CMathMenuMatrix.prototype.get_ColumnRule     ;
CMathMenuMatrix.prototype["put_ColumnRule"]      = CMathMenuMatrix.prototype.put_ColumnRule     ;
CMathMenuMatrix.prototype["get_ColumnGap"]       = CMathMenuMatrix.prototype.get_ColumnGap      ;
CMathMenuMatrix.prototype["put_ColumnGap"]       = CMathMenuMatrix.prototype.put_ColumnGap      ;
CMathMenuMatrix.prototype["get_MinColumnSpace"]  = CMathMenuMatrix.prototype.get_MinColumnSpace ;
CMathMenuMatrix.prototype["put_MinColumnSpace"]  = CMathMenuMatrix.prototype.put_MinColumnSpace ;
CMathMenuMatrix.prototype["get_HidePlaceholder"] = CMathMenuMatrix.prototype.get_HidePlaceholder;
CMathMenuMatrix.prototype["put_HidePlaceholder"] = CMathMenuMatrix.prototype.put_HidePlaceholder;

function CMathPoint()
{
    this.even = -1;
    this.odd  = -1;
}

function CMathEqArrPr()
{
    this.maxDist = 0;
    this.objDist = 0;
    this.rSp     = 0;
    this.rSpRule = 0;
    this.baseJc  = BASEJC_CENTER;

    this.row     = 1;
}
CMathEqArrPr.prototype.Set_FromObject = function(Obj)
{
    if(undefined !== Obj.maxDist && null !== Obj.maxDist)
        this.maxDist = Obj.maxDist;

    if(undefined !== Obj.objDist && null !== Obj.objDist)
        this.objDist = Obj.objDist;

    if(undefined !== Obj.rSp && null !== Obj.rSp)
        this.rSp = Obj.rSp;

    if(undefined !== Obj.rSpRule && null !== Obj.rSpRule)
        this.rSpRule = Obj.rSpRule;

    if(undefined !== Obj.baseJc && null !== Obj.baseJc)
        this.baseJc = Obj.baseJc;

    this.row = Obj.row;
};
CMathEqArrPr.prototype.Copy = function()
{
    var NewPr = new CMathEqArrPr();

    NewPr.maxDist = this.maxDist;
    NewPr.objDist = this.objDist;
    NewPr.rSp     = this.rSp    ;
    NewPr.rSpRule = this.rSpRule;
    NewPr.baseJc  = this.baseJc ;
    NewPr.row     = this.row;

    return NewPr;
};
CMathEqArrPr.prototype.Set_Row = function(Value)
{
    this.row = Value;
};
CMathEqArrPr.prototype.Set_BaseJc = function(Value)
{
    this.baseJc = Value;
};
CMathEqArrPr.prototype.Write_ToBinary = function(Writer)
{
    // Long : maxDist
    // Long : objDist
    // Long : rSp
    // Long : rSpRule
    // Long : baseJc
    // Long : row

    Writer.WriteLong(this.maxDist);
    Writer.WriteLong(this.objDist);
    Writer.WriteLong(this.rSp);
    Writer.WriteLong(this.rSpRule);
    Writer.WriteLong(this.baseJc);
    Writer.WriteLong(this.row);
};
CMathEqArrPr.prototype.Read_FromBinary = function(Reader)
{
    // Long : maxDist
    // Long : objDist
    // Long : rSp
    // Long : rSpRule
    // Long : baseJc
    // Long : row

    this.maxDist = Reader.GetLong();
    this.objDist = Reader.GetLong();
    this.rSp     = Reader.GetLong();
    this.rSpRule = Reader.GetLong();
    this.baseJc  = Reader.GetLong();
    this.row     = Reader.GetLong();
};


/**
 *
 * @param props
 * @constructor
 * @extends {CMatrixBase}
 */
function CEqArray(props)
{
	CMatrixBase.call(this);

	this.Id = AscCommon.g_oIdCounter.Get_NewId();
    this.Pr = new CMathEqArrPr();

    // for ampersand in Run
    this.WidthsPoints = [];
    this.Points       = [];
    this.MaxDimWidths = [];
    //

    if(props !== null && props !== undefined)
        this.init(props);

    AscCommon.g_oTableId.Add( this, this.Id );
}
CEqArray.prototype = Object.create(CMatrixBase.prototype);
CEqArray.prototype.constructor = CEqArray;

CEqArray.prototype.ClassType = AscDFH.historyitem_type_eqArr;
CEqArray.prototype.kind      = MATH_EQ_ARRAY;

CEqArray.prototype.init = function(props)
{
    var nRowsCount = props.row;

    this.Fill_LogicalContent(nRowsCount);

    this.setProperties(props);
    this.fillContent();
};
CEqArray.prototype.fillContent = function()
{
    var nRowsCount = this.Content.length;
    this.setDimension(nRowsCount, 1);

    for (var nIndex = 0; nIndex < nRowsCount; nIndex++)
        this.elements[nIndex][0] = this.Content[nIndex];
};
CEqArray.prototype.getColsCount = function()
{
    return 1;
};
CEqArray.prototype.Resize = function(oMeasure, RPI)
{
    var bEqArray = RPI.bEqArray;
    RPI.bEqArray = true;

    for(var i = 0; i < this.nRow; i++)
        this.elements[i][0].Resize(oMeasure, RPI);

    this.recalculateSize(oMeasure);

    RPI.bEqArray = bEqArray;
};
CEqArray.prototype.getMetrics = function()
{
    var AscentsMetrics = [];
    var DescentsMetrics = [];
    var WidthsMetrics = [];

    // нумерация начинается с нуля, поэтому все четные точки идут с нечетными номерами в массиве

    var EndWidths = 0;

    var even, // четная точка
        odd,  // нечетная точка
        last;

    var maxDim, maxDimWidth;

    var Pos = 0;

    this.WidthsPoints.length = 0;
    this.Points.length       = 0;
    this.MaxDimWidths.length = 0;

    WidthsMetrics[0] = 0;

    while(EndWidths < this.nRow)
    {
        even = 0;
        odd  = 0;
        last = 0;

        maxDim = 0;
        maxDimWidth = 0;

        for(var i = 0; i < this.nRow; i++)
        {
            var WidthsRow = this.elements[i][0].Get_WidthPoints().Widths,
                len = WidthsRow.length;

            if(Pos < len)
            {
                if(WidthsRow[Pos].odd !== -1)
                {
                    if(maxDim < WidthsRow[Pos].even || maxDim < WidthsRow[Pos].odd)
                    {
                        maxDim = WidthsRow[Pos].even < WidthsRow[Pos].odd ? WidthsRow[Pos].odd : WidthsRow[Pos].even;
                        maxDimWidth = WidthsRow[Pos].even + WidthsRow[Pos].odd;
                    }
                    even = even > WidthsRow[Pos].even  ? even : WidthsRow[Pos].even;  // before "odd"
                    odd  = odd  > WidthsRow[Pos].odd   ? odd  : WidthsRow[Pos].odd;   // after  "odd"
                }
                else
                {
                    if(maxDim < WidthsRow[Pos].even)
                    {
                        maxDim = WidthsRow[Pos].even;
                        maxDimWidth = maxDim;
                    }
                    last = last > WidthsRow[Pos].even ? last: WidthsRow[Pos].even;
                }

                if(Pos == len - 1)
                    EndWidths++;
            }
        }

        var w = even + odd > last ? even + odd : last;

        var NewPoint = new CMathPoint();
        NewPoint.even   = even;
        NewPoint.odd    = odd;

        this.WidthsPoints.push(w);
        this.MaxDimWidths.push(maxDimWidth);
        this.Points.push(NewPoint);

        WidthsMetrics[0] += w;

        Pos++;
    }

    for(var i = 0; i < this.nRow; i++)
        this.elements[i][0].ApplyPoints(this.WidthsPoints, this.Points, this.MaxDimWidths);


    for(var i = 0; i < this.nRow; i++)
    {
        var size = this.elements[i][0].size;
        AscentsMetrics[i]  = size.ascent;
        DescentsMetrics[i] = size.height - size.ascent;
    }

    return {ascents: AscentsMetrics, descents: DescentsMetrics, widths: WidthsMetrics};
};
CEqArray.prototype.setPosition = function(pos, PosInfo)
{
    this.pos.x = pos.x;

    if(this.bInside === true)
        this.pos.y = pos.y;
    else
        this.pos.y = pos.y - this.size.ascent; ///!!!!

    this.UpdatePosBound(pos, PosInfo);

    var maxWH = this.getWidthsHeights();
    var Heights = maxWH.heights;

    var NewPos = new CMathPosition();

    var h = 0;

    for(var i=0; i < this.nRow; i++)
    {
        var Item = this.elements[i][0];
        NewPos.x = this.pos.x + this.GapLeft;
        NewPos.y = this.pos.y + h + Item.size.ascent;

        Item.setPosition(NewPos, PosInfo);

        h += Heights[i] + this.gaps.row[i];
    }

    pos.x += this.size.width;
};
CEqArray.prototype.setJustificationForConversion = function(js) // эта функция должна вызываться только при конвертации, после того как у всех элементов контенты заполнены
{
    var lng = this.Content.length;
    var NewElement, Run;

    if(js == MCJC_LEFT)
    {
        for(var i = 0; i < lng; i++)
        {
            NewElement = new CMathAmp();
            Run = this.Content[i].Content[0];
            Run.Cursor_MoveToStartPos();
            Run.Add(NewElement, true);
        }
    }
    else if(js == MCJC_RIGHT)
    {
        for(var i = 0; i < lng; i++)
        {
            NewElement = new CMathAmp();
            var EndPos = this.Content[i].Content.length - 1;
            Run = this.Content[i].Content[EndPos];
            Run.Cursor_MoveToEndPos();
            Run.Add(NewElement, true);
        }
    }

};
CEqArray.prototype.getElement = function(num)
{
    return this.elements[num][0];
};
CEqArray.prototype.getElementMathContent = function(Index)
{
    return this.Content[Index];
};
CEqArray.prototype.Apply_MenuProps = function(Props)
{
    if(Props.Type == Asc.c_oAscMathInterfaceType.EqArray)
    {
        if(Props.BaseJc !== undefined)
        {
            var BaseJc = this.Pr.baseJc;

            if(Props.BaseJc === Asc.c_oAscMathInterfaceEqArrayAlign.Center)
            {
                BaseJc = BASEJC_CENTER;
            }
            else if(Props.BaseJc === Asc.c_oAscMathInterfaceEqArrayAlign.Bottom)
            {
                BaseJc = BASEJC_BOTTOM;
            }
            else if(Props.BaseJc === Asc.c_oAscMathInterfaceEqArrayAlign.Top)
            {
                BaseJc = BASEJC_TOP;
            }

            this.SetBaseJc(BaseJc);
        }

        if(Props.RowRule !== undefined)
        {
            switch(Props.RowRule)
            {
                case c_oAscMathInterfaceEqArrayLineRule.Single:
                {
                    this.Modify_Interval(this.SpaceRow, 0, 0);
                    break;
                }
                case c_oAscMathInterfaceEqArrayLineRule.OneAndHalf:
                {
                    this.Modify_Interval(this.SpaceRow, 1, 0);
                    break;
                }
                case c_oAscMathInterfaceEqArrayLineRule.Double:
                {
                    this.Modify_Interval(this.SpaceRow, 2, 0);
                    break;
                }
                case c_oAscMathInterfaceEqArrayLineRule.Exactly:
                {
                    var bGapWholeNumber = Props.Gap !== undefined && Props.Gap + 0 == Props.Gap && Props.Gap >> 0 == Props.Gap;

                    if(bGapWholeNumber == true && Props.Gap >= 0 && Props.Gap <= 31680)
                    {
                        this.Modify_Interval(this.SpaceRow, 3, Props.Gap*20);
                    }

                    break;
                }
                case c_oAscMathInterfaceEqArrayLineRule.Multiple:
                {
                    var bGapNumber = Props.Gap !== undefined && Props.Gap + 0 == Props.Gap;

                    if(bGapNumber == true && Props.Gap >= 0 && Props.Gap <= 111)
                    {
                        var Gap = (Props.Gap*2 + 0.5) >> 0;

                        this.Modify_Interval(this.SpaceRow, 4, Gap);
                    }

                    break;
                }
            }
        }

        if(Props.Action & c_oMathMenuAction.DeleteEquation && this.getRowsCount() > 1)
        {
            this.Remove_Row(this.CurPos);
        }

        if(Props.Action & c_oMathMenuAction.InsertEquation)
        {
            if(Props.Action & c_oMathMenuAction.InsertBefore)
            {
                this.Add_Row(this.CurPos);
            }
            else
            {
                this.Add_Row(this.CurPos + 1);
            }
        }
    }

};
CEqArray.prototype.Get_InterfaceProps = function()
{
    return new CMathMenuEqArray(this);
};
CEqArray.prototype.Is_DeletedItem = function(Action)
{
    return Action & c_oMathMenuAction.DeleteEquation && 1 == this.getRowsCount();
};
CEqArray.prototype.Get_DeletedItemsThroughInterface = function()
{
    return [];
};
CEqArray.prototype.IsEqArray = function()
{
    return true;
};

/**
 *
 * @param CMathMenuEqArray
 * @constructor
 * @extends {CMathMenuBase}
 */
function CMathMenuEqArray(EqArray)
{
	CMathMenuBase.call(this, EqArray);

    this.Type    = Asc.c_oAscMathInterfaceType.EqArray;

    if (undefined !== EqArray)
    {
        var RowRule, RowGap;
        switch (EqArray.SpaceRow.Rule)
        {
            default:
            case 0:
            {
                RowRule = c_oAscMathInterfaceEqArrayLineRule.Single;
                break;
            }
            case 1:
            {
                RowRule = c_oAscMathInterfaceEqArrayLineRule.OneAndHalf;
                break;
            }
            case 2:
            {
                RowRule = c_oAscMathInterfaceEqArrayLineRule.Double;
                break;
            }
            case 3:
            {
                RowRule = c_oAscMathInterfaceEqArrayLineRule.Exactly;
                RowGap  = EqArray.SpaceRow.Gap / 20;
                break;
            }
            case 4:
            {
                RowRule = c_oAscMathInterfaceEqArrayLineRule.Multiple;
                RowGap  = EqArray.SpaceRow.Gap * 0.5;
                break;
            }
        }

        this.BaseJc  = EqArray.Pr.baseJc === BASEJC_CENTER ? Asc.c_oAscMathInterfaceEqArrayAlign.Center : (EqArray.Pr.baseJc === BASEJC_BOTTOM ? Asc.c_oAscMathInterfaceEqArrayAlign.Bottom : Asc.c_oAscMathInterfaceEqArrayAlign.Top);
        this.RowRule = RowRule;
        this.RowGap  = RowGap;
    }
    else
    {
        this.BaseJc  = undefined;
        this.RowRule = undefined;
        this.RowGap  = undefined;
    }
}
CMathMenuEqArray.prototype = Object.create(CMathMenuBase.prototype);
CMathMenuEqArray.prototype.constructor = CMathMenuEqArray;
CMathMenuEqArray.prototype.get_Align    = function(){return this.BaseJc;};
CMathMenuEqArray.prototype.put_Align    = function(Align){this.BaseJc = Align;};
CMathMenuEqArray.prototype.get_LineRule = function(){return this.RowRule;};
CMathMenuEqArray.prototype.put_LineRule = function(Rule){this.RowRule = Rule;};
CMathMenuEqArray.prototype.get_LineGap  = function(){return this.RowGap;};
CMathMenuEqArray.prototype.put_LineGap  = function(Gap){this.RowGap = Gap;};

//--------------------------------------------------------export----------------------------------------------------
window['AscCommonWord'] = window['AscCommonWord'] || {};
window['AscCommonWord'].CEqArray = CEqArray;
window['AscCommonWord'].CMathMatrix = CMathMatrix;

window["CMathMenuEqArray"] = CMathMenuEqArray;
CMathMenuEqArray.prototype["get_Align"]    = CMathMenuEqArray.prototype.get_Align;
CMathMenuEqArray.prototype["put_Align"]    = CMathMenuEqArray.prototype.put_Align;
CMathMenuEqArray.prototype["get_LineRule"] = CMathMenuEqArray.prototype.get_LineRule;
CMathMenuEqArray.prototype["put_LineRule"] = CMathMenuEqArray.prototype.put_LineRule;
CMathMenuEqArray.prototype["get_LineGap"]  = CMathMenuEqArray.prototype.get_LineGap ;
CMathMenuEqArray.prototype["put_LineGap"]  = CMathMenuEqArray.prototype.put_LineGap ;
