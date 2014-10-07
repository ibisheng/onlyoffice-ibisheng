"use strict";

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
        this.mcs.length = nMcsCount;

        for (var nMcsIndex = 0; nMcsIndex < nMcsCount; nMcsIndex++)
        {
            this.mcs[nMcsIndex] = new CMathMatrixColumnPr();
            this.mcs[nMcsIndex].Set_FromObject(Obj.mcs[nMcsIndex]);
            nColumnsCount += this.mcs[nMcsIndex].count;
        }
    }

    return nColumnsCount;
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

    var nMcsCount = Reader.GetLong();;
    this.mcs.length = nMcsCount;
    for (var nIndex = 0; nIndex < nMcsCount; nIndex++)
    {
        this.mcs[nIndex] = new CMathMatrixColumnPr();
        this.mcs[nIndex].Read_FromBinary(Reader);
    }
};


function CMatrixBase()
{
    CMatrixBase.superclass.constructor.call(this);
}
Asc.extendClass(CMatrixBase, CMathBase);
CMatrixBase.prototype.recalculateSize = function(oMeasure, RPI)
{
    if(this.RecalcInfo.bProps)
    {
        if(this.nRow > 1)
            this.setRuleGap(this.spaceRow, this.Pr.rSpRule, this.Pr.rSp);

        if(this.nCol > 1)
        {
            this.setRuleGap(this.spaceColumn, this.Pr.cGpRule, this.Pr.cGp, this.Pr.cSp);

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

        if(this.kind == MATH_MATRIX && this.Pr.plcHide)
            this.hidePlaceholder(true);

        this.RecalcInfo.bProps = false;
    }

    var txtPrp = this.Get_CompiledCtrPrp();
    var metrics = this.getMetrics();

    if(this.nCol > 1)
    {
        //var gapsCol = this.getLineGap(txtPrp);
        var gapsCol = this.getLineGap(this.spaceColumn, txtPrp);

        for(var i = 0; i < this.nCol - 1; i++)
            this.gaps.column[i] = gapsCol;
    }

    this.gaps.column[this.nCol - 1] = 0;

    if(this.nRow > 1)
    {
        //var intervalRow = this.getRowSpace(txtPrp);
        var intervalRow = this.getRowSpace(this.spaceRow, txtPrp);

        var divCenter = 0;

        var plH = 0.2743827160493827 * txtPrp.FontSize;
        var minGp = this.spaceRow.minGap*txtPrp.FontSize*g_dKoef_pt_to_mm;
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

    this.size = {width: width, height: height, ascent: ascent};
}
CMatrixBase.prototype.baseJustification = function(type)
{
    this.Pr.baseJc = type;
};
CMatrixBase.prototype.setDefaultSpace = function()
{
    this.spaceRow =
    {
        rule: 0,
        gap: 0,
        minGap: 13/12    // em
        // 780 /20 (pt) for font 36 pt
        // minGap: 0
    };
    this.spaceColumn =
    {
        rule: 0,
        gap: 0,
        minGap: 0       // minGap / 20 pt
    };

    this.gaps =
    {
        row: [],
        column: []
    };
}
CMatrixBase.prototype.setRuleGap = function(oSpace, rule, gap, minGap)
{
    var bInt  =  rule == rule - 0 && rule == rule^0,
        bRule =  rule >= 0 && rule <= 4;

    if(bInt && bRule)
        oSpace.rule = rule;
    else
        oSpace.rule = 0;

    if(gap == gap - 0 && gap == gap^0)
        oSpace.gap = gap;
    else
        oSpace.gap = 0;

    if(minGap == minGap - 0 && minGap == minGap^0)
        oSpace.minGap = minGap;
};
CMatrixBase.prototype.getLineGap = function(spaceColumn, txtPrp)
{
    var spLine;

    if(spaceColumn.rule == 0)
        spLine = 1;             //em
    else if(spaceColumn.rule == 1)
        spLine = 1.5;           //em
    else if(spaceColumn.rule == 2)
        spLine = 2;             //em
    else if(spaceColumn.rule == 3)
        spLine = spaceColumn.gap/20;  //pt
    else if(spaceColumn.rule == 4)
        spLine = spaceColumn.gap/2;   //em
    else
        spLine = 1;

    var lineGap;

    if(spaceColumn.rule == 3)
        lineGap = spLine*g_dKoef_pt_to_mm;                           //pt
    else
        lineGap = spLine*txtPrp.FontSize*g_dKoef_pt_to_mm;           //em

    var wPlh = 0.3241834852430555 * txtPrp.FontSize;

    var min = spaceColumn.minGap / 20 * g_dKoef_pt_to_mm - wPlh;
    lineGap = Math.max(lineGap, min);
    //lineGap += this.params.font.metrics.Placeholder.Height; // для случая, когда gapRow - (аскент + дескент) > minGap, вычитаем из gap строки, а здесь прибавляем стандартный metrics.Height

    return lineGap;
};
CMatrixBase.prototype.getRowSpace = function(spaceRow, txtPrp)
{
    var spLine;

    if(spaceRow.rule == 0)
        spLine = 7/6;                 //em
    else if(spaceRow.rule == 1)
        spLine = 7/6 *1.5;            //em
    else if(spaceRow.rule == 2)
        spLine = 7/6 *2;              //em
    else if(spaceRow.rule == 3)
        spLine = spaceRow.gap/20;         //pt
    else if(spaceRow.rule == 4)
        spLine = 7/6 * spaceRow.gap/2;    //em
    else
        spLine = 7/6;

    var lineGap;

    if(spaceRow.rule == 3)
        lineGap = spLine*g_dKoef_pt_to_mm;                           //pt
    else
        lineGap = spLine*txtPrp.FontSize*g_dKoef_pt_to_mm; //em


    var min = spaceRow.minGap*txtPrp.FontSize*g_dKoef_pt_to_mm;
    lineGap = Math.max(lineGap, min);

    return lineGap;
};
CMatrixBase.prototype.Get_ParaContentPosByXY = function(SearchPos, Depth, _CurLine, _CurRange, StepEnd)
{
    var maxWH = this.getWidthsHeights();
    var Widths = maxWH.widths;
    var Heights = maxWH.heights;

    var X = this.ParaMath.X + this.pos.x + this.GapLeft, // this.ParaMath.X + this.pos.x  совпадает с  SearchPos.CurX
        Y = this.ParaMath.Y + this.pos.y;

    var CurrX, CurrY,
        W_CurX,
        Diff = 100000000;

    var W = 0, H = 0;

    var rX, rY,
        minR;

    for(var i=0; i < this.nRow; i++)
    {
        for(var j=0; j < this.nCol; j++)
        {
            if(!this.elements[i][j].IsJustDraw())
            {
                var x1 = SearchPos.X - X - W,
                    x2 = SearchPos.X - X - W - Widths[j],
                    y1 = SearchPos.Y - Y - H,
                    y2 = SearchPos.Y - Y - H - Heights[i];


                var bInY = 0 < y1 && y2 < 0,
                    bInX = 0 < x1 && x2 < 0;

                rX = x1*x1 < x2*x2 ? x1 : x2;
                rY = y1*y1 < y2*y2 ? y1 : y2;


                if(bInY && bInX)
                    minR = 0;
                else if(!bInY && !bInX)
                    minR = rX*rX + rY*rY;
                else if(bInY)
                    minR = rX*rX;
                else
                    minR = rY*rY;


                if(Diff > minR)
                {
                    Diff = minR;

                    CurrX = i;
                    CurrY = j;
                    W_CurX  = W;
                }
            }

            W += Widths[j] + this.gaps.column[j];

        }

        W = 0;
        H += Heights[i] + this.gaps.row[i];
    }

    var PrevSearchCurX = SearchPos.CurX;

    SearchPos.CurX += this.GapLeft + W_CurX;

    //var SearchCurX = SearchPos.CurX + this.GapLeft + W_CurX ;

    if(this.kind === MATH_MATRIX)
    {
        SearchPos.CurX += this.align(CurrX, CurrY).x;
    }


    var result =  this.elements[CurrX][CurrY].Get_ParaContentPosByXY(SearchPos, Depth+2, _CurLine, _CurRange, StepEnd);

    if(result)
    {
        SearchPos.Pos.Update2(CurrX, Depth);
        SearchPos.Pos.Update2(CurrY, Depth + 1);

        SearchPos.InTextPos.Update(CurrX, Depth);
        SearchPos.InTextPos.Update(CurrY, Depth + 1);

    }

    SearchPos.CurX = PrevSearchCurX + this.size.width;

    return result;
};

function CMathMatrix(props)
{
    CMathMatrix.superclass.constructor.call(this);

	this.Id = g_oIdCounter.Get_NewId();
    this.kind = MATH_MATRIX;

    this.Pr = new CMathMatrixPr();

    this.spaceRow    = null;
    this.spaceColumn = null;
    this.gaps        = null;

    this.column     = 0;

    this.setDefaultSpace();

    if(props !== null && typeof(props) !== "undefined")
        this.init(props);

	g_oTableId.Add( this, this.Id );
}
Asc.extendClass(CMathMatrix, CMatrixBase);
CMathMatrix.prototype.init = function(props)
{
    this.setProperties(props);
    this.fillContent();
}
CMathMatrix.prototype.setPosition = function(pos, PosInfo)
{
    this.pos.x = pos.x;

    if(this.bInside === true)
        this.pos.y = pos.y;
    else
        this.pos.y = pos.y - this.size.ascent; ///!!!!

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
            var al = this.align(i, j);
            NewPos.x = this.pos.x + this.GapLeft + al.x + w;
            NewPos.y = this.pos.y + al.y + h;

            this.elements[i][j].setPosition(NewPos, PosInfo);
            w += Widths[j] + this.gaps.column[j];
        }
        h += Heights[i] + this.gaps.row[i];
    }

}
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
CMathMatrix.prototype.findDistance = function() // для получения позиции тагета
{
    var w = 0, h = 0;
    //кол-во элементов gap равно кол-ву элементов в строке/столбце для удобства подсчета
    for(var i = 0; i < this.CurPos_X; i++)
        w += this.gaps.column[i];

    for(var j = 0; j < this.CurPos_Y; j++)
        h += this.gaps.row[j];

    return {w : w, h: h };
}
CMathMatrix.prototype.setRowGapRule = function(rule, gap)
{
    this.spaceRow.rule = rule;
    this.spaceRow.gap = gap;
};
CMathMatrix.prototype.setColumnGapRule = function(rule, gap, minGap)
{
    this.spaceColumn.rule = rule;
    this.spaceColumn.gap = gap;
    if(minGap !== null && typeof(minGap) !== "undefined")
        this.spaceColumn.minGap = minGap;
};
/*CMathMatrix.prototype.getLineGap = function(txtPrp)
{
    var spLine;

    if(this.spaceColumn.rule == 0)
        spLine = 1;             //em
    else if(this.spaceColumn.rule == 1)
        spLine = 1.5;           //em
    else if(this.spaceColumn.rule == 2)
        spLine = 2;             //em
    else if(this.spaceColumn.rule == 3)
        spLine = this.spaceColumn.gap/20;  //pt
    else if(this.spaceColumn.rule == 4)
        spLine = this.spaceColumn.gap/2;   //em
    else
        spLine = 1;

    var lineGap;

    if(this.spaceColumn.rule == 3)
        lineGap = spLine*g_dKoef_pt_to_mm;                           //pt
    else
        lineGap = spLine*txtPrp.FontSize*g_dKoef_pt_to_mm;           //em

    var wPlh = 0.3241834852430555 * txtPrp.FontSize;

    var min = this.spaceColumn.minGap / 20 * g_dKoef_pt_to_mm - wPlh;
    lineGap = Math.max(lineGap, min);
    //lineGap += this.params.font.metrics.Placeholder.Height; // для случая, когда gapRow - (аскент + дескент) > minGap, вычитаем из gap строки, а здесь прибавляем стандартный metrics.Height

    return lineGap;
};
CMathMatrix.prototype.getRowSpace = function(txtPrp)
{
    var spLine;

    if(this.spaceRow.rule == 0)
        spLine = 7/6;                 //em
    else if(this.spaceRow.rule == 1)
        spLine = 7/6 *1.5;            //em
    else if(this.spaceRow.rule == 2)
        spLine = 7/6 *2;              //em
    else if(this.spaceRow.rule == 3)
        spLine = this.spaceRow.gap/20;         //pt
    else if(this.spaceRow.rule == 4)
        spLine = 7/6 * this.spaceRow.gap/2;    //em
    else
        spLine = 7/6;

    var lineGap;

    if(this.spaceRow.rule == 3)
        lineGap = spLine*g_dKoef_pt_to_mm;                           //pt
    else
        lineGap = spLine*txtPrp.FontSize*g_dKoef_pt_to_mm; //em


    var min = this.spaceRow.minGap*txtPrp.FontSize*g_dKoef_pt_to_mm;
    lineGap = Math.max(lineGap, min);

    return lineGap;
};*/
////
CMathMatrix.prototype.setProperties = function(props)
{
    this.setCtrPrp(props.ctrPrp);
    this.Pr.Set_FromObject(props);

    this.column = this.Pr.Get_ColumnsCount();
};
CMathMatrix.prototype.fillContent = function()
{
    this.setDimension(this.Pr.row, this.column);
    this.setContent();
};
CMathMatrix.prototype.getRowsCount = function()
{
    return this.Pr.row;
};
CMathMatrix.prototype.getColsCount = function()
{
    return this.column;
};
CMathMatrix.prototype.getPropsForWrite = function()
{
    var props = {};

    props.baseJc  = this.Pr.baseJc;
    props.row     = this.Pr.nRow;
    props.column  = this.Pr.nCol;
    props.plcHide = this.Pr.plcHide;

    props.cGpRule = this.spaceColumn.rule;
    props.cGp     = this.spaceColumn.gap;
    props.cSp     = this.spaceColumn.minGap;

    props.rSpRule = this.spaceRow.rule;
    props.rSp     = this.spaceRow.gap;

    return props;
};
CMathMatrix.prototype.Save_Changes = function(Data, Writer)
{
	Writer.WriteLong( historyitem_type_matrix );
};
CMathMatrix.prototype.Load_Changes = function(Reader)
{
};
CMathMatrix.prototype.Refresh_RecalcData = function(Data)
{
};
CMathMatrix.prototype.Write_ToBinary2 = function( Writer )
{
    var nRowsCount = this.getRowsCount();
    var nColsCount = this.getColsCount();

	Writer.WriteLong( historyitem_type_matrix );

    // String : Id
    // Long   : Rows count
    // Long   : Cols count
    // Array[Rows * Cols] of Strings : Id
    // Variable : CtrlPr
    // Variable : MathPr

    Writer.WriteString2(this.Id);
	Writer.WriteLong(nRowsCount);
	Writer.WriteLong(nColsCount);

	for(var nRowIndex = 0; nRowIndex < nRowsCount; nRowIndex++)
    {
        for (var nColsIndex = 0; nColsIndex < nColsCount; nColsIndex++)
        {
            Writer.WriteString2(this.getElement(nRowIndex, nColsIndex).Id);
        }
    }
	
	this.CtrPrp.Write_ToBinary(Writer);
    this.Pr.Write_ToBinary(Writer);
};
CMathMatrix.prototype.Read_FromBinary2 = function( Reader )
{
    // String : Id
    // Long   : Rows count
    // Long   : Cols count
    // Array[Rows * Cols] of Strings : Id
    // Variable : CtrlPr
    // Variable : MathPr

    this.Id = Reader.GetString2();
    var nRowsCount = Reader.GetLong();
    var nColsCount = Reader.GetLong();

    this.setDimension(nRowsCount, nColsCount);

    this.elements = [];
    for (var nRowIndex = 0; nRowIndex < nRowsCount; nRowIndex++)
    {
        this.elements[nRowIndex] = [];
        for (var nColIndex = 0; nColIndex < nColsCount; nColIndex++)
        {
            this.elements[nRowIndex][nColIndex] = g_oTableId.Get_ById(Reader.GetString2());
        }
    }

    this.CtrPrp.Read_FromBinary(Reader);
    this.Pr.Read_FromBinary(Reader);

    this.column = this.Pr.Get_ColumnsCount();
};
CMathMatrix.prototype.Get_Id = function()
{
	return this.Id;
};

function CMathPoint()
{
    this.even = -1;
    this.odd  = -1;
}

////
function CEqArray(props)
{
    CEqArray.superclass.constructor.call(this);

	this.Id = g_oIdCounter.Get_NewId();
    this.kind = MATH_EQ_ARRAY;

    this.Pr =
    {
        maxDist:    0,
        objDist:    0,

        rSp:        0,
        rSpRule:    0,

        baseJc:     BASEJC_CENTER
    };

    this.spaceRow    = null;
    this.spaceColumn = null;
    this.gaps        = null;

    this.setDefaultSpace();

    // for ampersand in Run
    this.WidthsPoints = [];
    this.Points       = [];
    this.MaxDimWidths = [];
    //

    ////  special for "read"  ////
    //this.column = 0;
    ////

    //CMathMatrix.call(this);
    // Делаем так, чтобы лишный Id в историю не записался

    //CMathMatrix.superclass.constructor.call(this);


    if(props !== null && typeof(props) !== "undefined")
        this.init(props);

	g_oTableId.Add( this, this.Id );
}
Asc.extendClass(CEqArray, CMatrixBase);
CEqArray.prototype.init = function(props)
{
    this.setProperties(props);
    this.setDimension(props.row, 1);
    this.setContent();
}
CEqArray.prototype.Resize = function(oMeasure, Parent, ParaMath, RPI, ArgSize)
{
    // на случай, чтобы не затереть массив
    //var CurrAmperWPoints = RPI.AmperWPoints,
    //    CurrEqqArray     = RPI.bEqqArray;

    RPI.bEqqArray = true;

    this.Parent = Parent;
    this.ParaMath = ParaMath;

    for(var i = 0; i < this.nRow; i++)
    {
        this.elements[i][0].Resize(oMeasure, this, ParaMath, RPI, ArgSize);
    }

    this.recalculateSize(oMeasure, RPI);

    RPI.bEqqArray = false;

    //RPI.AmperWPoints = CurrAmperWPoints;
    //RPI.bEqqArray    = CurrEqqArray;

    //CEqArray.superclass.Resize.call(this, oMeasure, Parent, ParaMath, RPI, ArgSize);
}
CEqArray.prototype.getMetrics = function()
{
    var AscentsMetrics = [];
    var DescentsMetrics = [];
    var WidthsMetrics = [];

    // нумерация начинается с нуля, поэтому все четные точки идут с нечетными номерами в массиве

    //var lngW = RPI.Widths.length; // this.nRow
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
            var WidthsRow = this.elements[i][0].getWidthsPoints(),
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
                    even = even > WidthsRow[Pos].even  ? even : WidthsRow[Pos].even;     // before "odd"
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
    {
        var size = this.elements[i][0].size;
        AscentsMetrics[i]  = size.ascent;
        DescentsMetrics[i] = size.height - size.ascent;
    }


    /*for(var tt = 0; tt < this.nCol; tt++ )
     Widths[tt] = 0;

     for(var i=0; i < this.nRow; i++)
     {
     Ascents[i]  = 0;
     Descents[i] = 0;

     for(var j = 0; j < this.nCol ; j++)
     {
     var size = this.elements[i][j].size;
     Widths[j]   =  i > 0 && ( Widths[j] > size.width ) ? Widths[j] : size.width;
     Ascents[i]  = (Ascents[i] > size.ascent ) ? Ascents[i] : size.ascent;
     Descents[i] = (Descents[i] > size.height - size.ascent ) ? Descents[i] : size.height - size.ascent;
     }
     }*/

    return {ascents: AscentsMetrics, descents: DescentsMetrics, widths: WidthsMetrics};
}
CEqArray.prototype.setPosition = function(pos)
{
    //PosInfo.Widths = this.WidthsPoints;
    //PosInfo.Points = this.Points;

    this.pos.x = pos.x;

    if(this.bInside === true)
        this.pos.y = pos.y;
    else
        this.pos.y = pos.y - this.size.ascent; ///!!!!

    var maxWH = this.getWidthsHeights();
    var Heights = maxWH.heights;

    var NewPos = new CMathPosition();

    var h = 0;

    for(var i=0; i < this.nRow; i++)
    {
        NewPos.x = this.pos.x + this.GapLeft;
        NewPos.y = this.pos.y + h;

        //PosInfo.CurrPoint = 0;
        this.elements[i][0].setPosition(NewPos);


        h += Heights[i] + this.gaps.row[i];
    }

    //PosInfo.Widths.length = 0;
    //PosInfo.Points.length = 0;

}
CEqArray.prototype.setProperties = function(props)
{
    if(props.maxDist !== undefined && props.maxDist !== null)
        this.Pr.maxDist = props.maxDist;

    if(props.objDist !== undefined && props.objDist !== null)
        this.Pr.objDist = props.objDist;

    if (undefined !== props.rSpRule && null !== props.rSpRule)
        this.Pr.rSpRule = props.rSpRule;

    if (undefined !== props.rSp && null !== props.rSp)
        this.Pr.rSp = props.rSp;


    /*var mcs = [];
    mcs.push(new CMathMatrixColumnPr());

    var Pr =
    {
        column:     1,
        mcs:        mcs,
        row:        props.row,
        baseJc:     props.baseJc,

        rSpRule:    props.rSpRule,
        rSp:        props.rSp,
        ctrPrp:     props.ctrPrp
    };

    CEqArray.superclass.setProperties.call(this, Pr);*/
}
CEqArray.prototype.getElement = function(num)
{
    return this.elements[num][0];
}
CEqArray.prototype.fillMathComposition = function(props, contents /*array*/)
{
    this.setProperties(props);
    this.setDimension(this.nRow, this.nCol);
    this.setContent();

    for(var i = 0; i < this.nRow; i++)
        this.elements[i][0] = contents[i];
}
CEqArray.prototype.getPropsForWrite = function()
{
    return this.Pr;
}
CEqArray.prototype.Save_Changes = function(Data, Writer)
{
	Writer.WriteLong( historyitem_type_eqArr );
}
CEqArray.prototype.Load_Changes = function(Reader)
{
}
CEqArray.prototype.Refresh_RecalcData = function(Data)
{
}
CEqArray.prototype.Write_ToBinary2 = function( Writer )
{	
	Writer.WriteLong( historyitem_type_eqArr );
	
	var row = this.elements.length;
	Writer.WriteLong( row );
	for(var i=0; i<row; i++)
		Writer.WriteString2( this.getElement(i).Id );
	
	this.CtrPrp.Write_ToBinary(Writer);
	
	var StartPos = Writer.GetCurPosition();
    Writer.Skip(4);
    var Flags = 0;
	if ( undefined != this.Pr.baseJc )
    {
		Writer.WriteLong( this.Pr.baseJc );	
		Flags |= 1;
	}
	if ( undefined != this.Pr.maxDist )
    {
		Writer.WriteBool( this.Pr.maxDist );	
		Flags |= 2;
	}
	if ( undefined != this.Pr.objDist )
    {
		Writer.WriteBool( this.Pr.objDist );	
		Flags |= 4;
	}
	if ( undefined != this.Pr.rSp )
    {
		Writer.WriteLong( this.Pr.rSp );	
		Flags |= 8;
	}
	if ( undefined != this.Pr.rSpRule )
    {
		Writer.WriteLong( this.Pr.rSpRule );
		Flags |= 16;
	}
	var EndPos = Writer.GetCurPosition();
    Writer.Seek( StartPos );
    Writer.WriteLong( Flags );
    Writer.Seek( EndPos );
}
CEqArray.prototype.Read_FromBinary2 = function( Reader )
{
	var props = {ctrPrp: new CTextPr()};
	var arrElems = [];
	
	props.row = Reader.GetLong();
	for(var i=0; i<props.row; i++)
		arrElems.push(g_oTableId.Get_ById( Reader.GetString2()));
	
	props.ctrPrp.Read_FromBinary(Reader);
	
	var Flags = Reader.GetLong();
	if ( Flags & 1 )
		props.baseJc = Reader.GetLong();
	if ( Flags & 2 )
		props.maxDist = Reader.GetBool();
	if ( Flags & 4 )
		props.objDist = Reader.GetBool();
	if ( Flags & 8 )
		props.rSp = Reader.GetLong();
	if ( Flags & 16 )
		props.rSpRule = Reader.GetLong();
		
	this.fillMathComposition (props, arrElems);
}
CEqArray.prototype.Get_Id = function()
{
	return this.Id;
}
