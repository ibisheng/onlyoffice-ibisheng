"use strict";

function CMathBase(bInside)
{
    this.Type = para_Math_Composition;

    this.pos = new CMathPosition();
    this.size = null;

    //  Properties
    this.Parent = null;
    this.ParaMath = null; // ссылка на общую формулу

    this.CtrPrp = new CTextPr();
    this.CompiledCtrPrp = new CTextPr();

    this.ArgSize = new CMathArgSize();

    /////////////////


    this.CurPos_X = 0;
    this.CurPos_Y = 0;

    this.SelectStart =
    {
        X:          0,
        Y:          0,
        bOutside:   false
    };

    this.SelectEnd =
    {
        X:          0,
        Y:          0,
        bOutside:   false
    };

    this.bSelectionUse      = false;

    this.nRow = 0;
    this.nCol = 0;


    this.bInside = bInside === true ? true: false;

    this.elements = [];

    this.dW = 0; //column gap, gap width
    this.dH = 0; //row gap, gap height

    this.alignment =
    {
        hgt: null,
        wdt: null
    };

    this.GapLeft = 0;
    this.GapRight = 0;

    this.RecalcInfo =
    {
        bCtrPrp:     true,
        bProps:      true
    };


    this.Content = [];

    return this;
}
CMathBase.prototype =
{
    constructor: CMathBase,

    setContent: function()
    {
        for(var i=0; i < this.nRow; i++)
        {
            this.elements[i] = [];
            for(var j = 0; j < this.nCol; j++)
                this.elements[i][j] = new CMathContent();
        }
    },
    setDimension: function(countRow, countCol)
    {
        this.nRow = countRow;
        this.nCol = countCol;

        this.alignment.hgt = [];
        this.alignment.wdt = [];

        for(var i = 0; i < this.nCol ; i++)
        {
            this.alignment.wdt[i] = MCJC_CENTER;
        }

        for(var j=0; j < this.nRow; j++)
        {
            this.elements[j] = [];
            this.alignment.hgt[j] = MCJC_CENTER;
        }

    },
    ///////// RunPrp, CtrPrp
    setCtrPrp: function(txtPrp) // выставляем ctrPrp на чтение
    {
        if(txtPrp !== null && typeof(txtPrp) !== "undefined")
        {
            this.CtrPrp.Merge(txtPrp);
            this.CtrPrp.FontFamily = {Name  : "Cambria Math", Index : -1 };
        }
    },
    Get_CtrPrp: function()
    {
        var CtrPrp;
        if(this.bInside === true)
            CtrPrp = this.Parent.Get_CtrPrp();
        else
            CtrPrp = this.CtrPrp.Copy();

        return CtrPrp;
    },
    /*Set_CompiledCtrPrp: function(ParaMath)
    {
        var defaultRPrp = ParaMath.GetFirstRPrp();

        this.CompiledCtrPrp.Merge(defaultRPrp);
        this.CompiledCtrPrp.Merge(this.CtrPrp);

        for(var i=0; i < this.nRow; i++)
            for(var j = 0; j < this.nCol; j++)
                if(this.elements[i][j].Type === para_Math_Composition)
                    this.elements[i][j].Set_CompiledCtrPrp(ParaMath);

    },*/
    Get_CompiledCtrPrp: function()
    {
        this.Set_CompiledCtrPrp(this.ParaMath);

        var CompiledCtrPrp;

        if(this.bInside === true)
        {
            CompiledCtrPrp = this.Parent.Get_CompiledCtrPrp();
        }
        else
        {
            CompiledCtrPrp = this.Get_CompiledCtrPrp_2();
            CompiledCtrPrp.FontSize = this.ParaMath.ApplyArgSize(CompiledCtrPrp.FontSize, this.Parent.Get_CompiledArgSize().value);
        }

        CompiledCtrPrp.FontSize = this.ParaMath.ApplyArgSize(CompiledCtrPrp.FontSize, this.ArgSize.value);// для настроек inline формул

        return CompiledCtrPrp;
    },
    Get_CompiledCtrPrp_2: function() // without arg Size
    {
        this.Set_CompiledCtrPrp(this.ParaMath);

        var CompiledCtrPrp;

        if(this.bInside === true)
            CompiledCtrPrp = this.Parent.Get_CompiledCtrPrp_2();
        else
            CompiledCtrPrp = this.CompiledCtrPrp.Copy();

        return CompiledCtrPrp;
    },
    Get_CompiledArgSize: function()
    {
        return this.Parent.Get_CompiledArgSize();
    },
    getCtrPrpForFirst: function(ParaMath)
    {
        var ctrPrp = new CTextPr();
        var defaultRPrp = ParaMath.Get_Default_TPrp();
        //var gWPrp = defaultRPrp.getMergedWPrp();
        ctrPrp.Merge(defaultRPrp);
        ctrPrp.Merge(this.CtrPrp);

        return ctrPrp;
    },
    // для управляющих символов в приоритете GetFirstRunPrp
    // если первый элемент - мат объект, то берутся его CtrPrp
    getPrpToControlLetter: function()
    {
        var rPrp = new CTextPr();
        rPrp.Merge( this.ParaMath.GetFirstRPrp() );

        return rPrp;
    },
    fillPlaceholders: function()
    {
         for(var i=0; i < this.nRow; i++)
             for(var j = 0; j < this.nCol; j++)
                if(!this.elements[i][j].IsJustDraw())
                 this.elements[i][j].fillPlaceholders();
    },
    addMCToContent: function(elements)
    {
        if(elements.length == this.nRow*this.nCol)
        {
            this.elements.length = 0;
            for(var i = 0; i < this.nRow; i++)
            {
                this.elements[i] = [];
                for(var j = 0; j < this.nCol; j++)
                    this.elements[i][j] = elements[j + i*this.nCol];
            }
        }
        else
            this.setContent();
    },
    // эта функция здесь необходима для случая с n-арными операторами : когда передаем n-арный оператор с итераторами и аргумент
    IsJustDraw: function()
    {
        return false;
    },
    IsAccent: function()
    {
        return false;
    },
    IsEqqArray: function()
    {
        return false;
    },
    getWidthsHeights: function()
    {
        var Widths = [];
        for(var tt = 0; tt < this.nCol; tt++ )
        Widths[tt] = 0;

        var Ascents = [];
        var Descents = [];

        for(tt = 0; tt < this.nRow; tt++ )
        {
            Ascents[tt] = 0;
            Descents[tt] = 0;
        }

        for(var i=0; i < this.nRow; i++)
            for(var j = 0; j < this.nCol ; j++)
            {
                var size = this.elements[i][j].size;
                Widths[j] = ( Widths[j] > size.width ) ? Widths[j] : size.width;
                Ascents[i] = (Ascents[i] > size.ascent ) ? Ascents[i] : size.ascent;
                Descents[i] = (Descents[i] > size.height - size.ascent ) ? Descents[i] : size.height - size.ascent;
            }
        
        var Heights = [];
        for(tt = 0; tt < this.nRow; tt++ )
        {
            Heights[tt] = Ascents[tt] + Descents[tt];
        }

        return { widths: Widths, heights: Heights };
    },
    align: function(pos_x, pos_y)
    {
        var PosAlign = new CMathPosition();

        if(this.alignment.hgt[pos_x] == MCJC_CENTER)
        {
            var maxAsc = 0;
            var _ascent;

            for(var j = 0; j < this.nCol; j++)
            {
                _ascent = this.elements[pos_x][j].size.ascent;
                maxAsc = ( maxAsc > _ascent ) ? maxAsc : _ascent;
            }
            PosAlign.y = (maxAsc - this.elements[pos_x][pos_y].size.ascent);
        }
        else
        {
            var maxH = 0;
            var _h;

            for(var j = 0; j < this.nCol; j++)
            {
                _h = this.elements[pos_x][j].size.height;
                maxH = ( maxH > _h ) ? maxH : _h;
            }

            var coeffHgt;
            if(this.alignment.hgt[pos_x] == MCJC_RIGHT)
                coeffHgt = 1;
            else
                coeffHgt = 0;

            PosAlign.y = (maxH - this.elements[pos_x][pos_y].size.height)*coeffHgt;
        }

        var maxW  = 0;
        for(var i=0; i < this.nRow; i++)
        {
            var _w = this.elements[i][pos_y].size.width;
            maxW = ( maxW > _w ) ? maxW : _w;
        }

        if(this.alignment.wdt[pos_y] == MCJC_CENTER)
            PosAlign.x = (maxW - this.elements[pos_x][pos_y].size.width)*0.5;
        else
        {
            var coeffWdt;
            if(this.alignment.wdt[pos_y] == MCJC_RIGHT)
                coeffWdt = 1;
            else
                coeffWdt = 0;

            PosAlign.x = (maxW - this.elements[pos_x][pos_y].size.width)*coeffWdt;
        }

        return PosAlign;
    },
    setPosition: function(pos, PosInfo)
    {
        this.pos.x = pos.x;

        if(this.bInside === true)
            this.pos.y = pos.y;
        else
            this.pos.y = pos.y - this.size.ascent; ///!!!!

        var maxWH = this.getWidthsHeights();
        var Widths = maxWH.widths;
        var Heights = maxWH.heights;

        var h = 0, w = 0;
        var NewPos = new CMathPosition();

        for(var i=0; i < this.nRow; i++)
        {
            w = 0;
            for(var j = 0; j < this.nCol; j++)
            {
                var al = this.align(i, j);
                NewPos.x = this.pos.x + this.GapLeft + al.x + this.dW*j + w;
                NewPos.y = this.pos.y + al.y + this.dH*i + h;
                this.elements[i][j].setPosition(NewPos, PosInfo);
                w += Widths[j];
            }
            h += Heights[i];
        }
    },
    draw: function(x, y, pGraphics)
    {
        for(var i=0; i < this.nRow; i++)
            for(var j = 0; j < this.nCol; j++)
                this.elements[i][j].draw(x, y, pGraphics);
    },
    remove: function(order)
    {
        return this.Parent.remove(order);
    },
    recalculateSize: function(oMeasure, RPI)
    {
        var width = 0;
        var height = 0;

        var maxWH = this.getWidthsHeights();

        this.setDistance();

        var Widths = maxWH.widths;
        var Heights = maxWH.heights;

        for( var j = 0 ; j < this.nRow; j++ )
            height += Heights[j];

        height += this.dH*(this.nRow - 1);

        for(var i=0; i < this.nCol ; i++)
            width += Widths[i];

        width += this.dW*(this.nCol - 1) + this.GapLeft + this.GapRight;

        var ascent = this.getAscent(oMeasure, height, RPI);

        this.size = {width: width, height: height, ascent: ascent};
    },
    Resize: function(oMeasure, Parent, ParaMath, RPI, ArgSize)
    {
        this.Parent = Parent;
        this.ParaMath = ParaMath;

        //this.Set_CompiledCtrPrp(ParaMath);

        for(var i=0; i < this.nRow; i++)
            for(var j = 0; j < this.nCol; j++)
                this.elements[i][j].Resize(oMeasure, this, ParaMath, RPI, ArgSize);

        this.recalculateSize(oMeasure, RPI);
    },
    Resize_2: function(oMeasure, Parent, ParaMath, RPI, ArgSize)
    {
        for(var i=0; i < this.nRow; i++)
            for(var j = 0; j < this.nCol; j++)
                if(!this.elements[i][j].IsJustDraw())
                    this.elements[i][j].Resize_2(oMeasure, this, ParaMath, RPI, ArgSize);
    },
    Set_CompiledCtrPrp: function(ParaMath)
    {
        if(this.RecalcInfo.bCtrPrp == true)
        {
            this.CompiledCtrPrp = ParaMath.GetFirstRPrp();
            this.CompiledCtrPrp.Merge(this.CtrPrp);

            this.RecalcInfo.bCtrPrp = false;
        }
    },
    getAscent: function(oMeasure, _height)
    {
        var Ascent = 0;
        if(this.nRow > 1)
        {
            Ascent = _height;
            Ascent /=2;
            var MergedCtrPrp = this.Get_CompiledCtrPrp();
            Ascent += this.ParaMath.GetShiftCenter(oMeasure, MergedCtrPrp);
        }
        else
            for(var i=0; i< this.nCol; i++)
                Ascent = (this.elements[0][i].size.ascent > Ascent) ?  this.elements[0][i].size.ascent : Ascent;

        return Ascent;
    },
    alignHor: function(pos, coeff)
    {
        if(pos!=-1)
            this.alignment.wdt[pos] = coeff;
        else
            for(var j = 0; j< this.alignment.wdt.length; j++)
                this.alignment.wdt[j] = coeff;

    },
    alignVer: function(pos, coeff)
    {
        if(pos!=-1)
            this.alignment.hgt[pos] = coeff;
        else
            for(var j = 0; j < this.alignment.hgt.length; j++)
                this.alignment.hgt[j] = coeff;
     },
    setDistance: function()
    {
        
    },
    getPosTwTarget: function()
    {
        var pos = this.elements[this.CurPos_X][this.CurPos_Y].getPosTwTarget();
        var align = this.align(this.CurPos_X, this.CurPos_Y);

        var maxWH = this.getWidthsHeights();
        var Heights = maxWH.heights,
            Widths = maxWH.widths;

        for(var t = 0; t < this.CurPos_Y; t++)
            pos.x += Widths[t];


        for(var t = 0; t < this.CurPos_X; t++)
            pos.y += Heights[t]; // на текущей позиции добавляем максимальную высоту строки, а не высоту элемента

        var dist = this.findDistance();
        pos.x += dist.w + align.x;
        pos.y += dist.h + align.y;

        return pos;

    },
    findDistance: function()
    {
        return {w : this.dW*this.CurPos_Y, h: this.dH*this.CurPos_X  };
    },
    hidePlaceholder: function(flag)
    {
        for(var i=0; i < this.nRow; i++)
            for(var j = 0; j < this.nCol; j++)
            {
                if( this.elements[i][j].IsJustDraw() == false )
                    this.elements[i][j].hidePlaceholder(flag);
            }
    },
    getElement: function(x, y)
    {
     return this.elements[x][y];
    },
    IsOneLineText: function() // for degree
    {
        var bOneLineText = true;
        if(this.nRow == 1)
        {
            for(var j = 0; j < this.nCol; j++)
            {
                if(!this.elements[0][j].IsJustDraw() && !this.elements[0][j].IsOneLineText())
                    {
                        bOneLineText = false;
                        break;
                    }
            }
        }
        else
            bOneLineText = false;


        return bOneLineText;
    },
    ////    For Edit   /////

    getGapsInside: function(GapsInfo)
    {
        var kind = this.kind;
        var gaps = {left: 0, right: 0};
        var checkBase = kind == MATH_DEGREE || kind == MATH_DEGREESubSup || kind == MATH_ACCENT || kind == MATH_RADICAL|| kind == MATH_BOX || kind == MATH_BORDER_BOX || (kind == MATH_DELIMITER && this.Pr.grow == true);

        if(checkBase)
        {
            var base = this.getBase();
            gaps = base.getGapsInside(GapsInfo);
        }

        return gaps;
    },
    /// Position for Paragraph
    Get_ParaContentPosByXY: function(SearchPos, Depth, _CurLine, _CurRange, StepEnd)
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
                    /*rY = SearchPos.Y - Y - H;
                    rX = SearchPos.X - X - W;
                    R =  rX*rX + rY*rY;

                    rrX = SearchPos.X - X - W - Widths[j];
                    rrY = SearchPos.Y - Y - H - Heights[i];
                    RR  = rrX*rrX + rrY*rrY;*/

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

                W += Widths[j] + this.dW;

            }

            W = 0;
            H += Heights[i] + this.dH;
        }

        var SearchCurX = SearchPos.CurX;
        var align = this.align(CurrX, CurrY);

        SearchPos.CurX += this.GapLeft + W_CurX + align.x;

        /*if(SearchPos.CurX + this.GapLeft < SearchPos.X )
        {
            SearchPos.CurX += this.GapLeft;


            for(var j = 0; j < CurrY; j++)
            {
                if(SearchPos.CurX + Widths[j] + this.dW > SearchPos.X)
                {
                    if(SearchPos.CurX + Widths[j] < SearchPos.X)
                        SearchPos.CurX += Widths[j];

                    break;
                }

                SearchPos.CurX += Widths[j] + this.dW;

                if(j == CurrY-1 && SearchPos.CurX + align.x < SearchPos.X)
                    SearchPos.CurX += align.x;
            }
        }*/

        var result =  this.elements[CurrX][CurrY].Get_ParaContentPosByXY(SearchPos, Depth+2, _CurLine, _CurRange, StepEnd);

        if(result)
        {
            SearchPos.Pos.Update2(CurrX, Depth);
            SearchPos.Pos.Update2(CurrY, Depth + 1);

            SearchPos.InTextPos.Update(CurrX, Depth);
            SearchPos.InTextPos.Update(CurrY, Depth + 1);

        }

        SearchPos.CurX = SearchCurX + this.size.width;

        return result;
    },
    Get_ParaContentPos: function(bSelection, bStart, ContentPos)
    {
        if( bSelection )
        {
            var oSelect;

            if(bStart)
                oSelect = this.SelectStart;
            else
                oSelect = this.SelectEnd;

            ContentPos.Add(oSelect.X);
            ContentPos.Add(oSelect.Y);

            if(!oSelect.bOutside && !this.elements[oSelect.X][oSelect.Y].IsJustDraw())
                this.elements[oSelect.X][oSelect.Y].Get_ParaContentPos(bSelection, bStart, ContentPos);

        }
        else
        {
            ContentPos.Add(this.CurPos_X);
            ContentPos.Add(this.CurPos_Y);

            this.elements[this.CurPos_X][this.CurPos_Y].Get_ParaContentPos(bSelection, bStart, ContentPos);
        }
    },
    Set_ParaContentPos: function(ContentPos, Depth)
    {
        var CurPos_X = ContentPos.Get(Depth);
        var CurPos_Y = ContentPos.Get(Depth + 1);

        this.CurPos_X = CurPos_X;
        this.CurPos_Y = CurPos_Y;

        Depth += 2;

        return this.elements[this.CurPos_X][this.CurPos_Y].Set_ParaContentPos(ContentPos, Depth);
    },
    Set_SelectionContentPos: function(StartContentPos, EndContentPos, Depth, StartFlag, EndFlag)
    {
        if(StartFlag === 0)
        {
            this.SelectStart.X = StartContentPos.Get(Depth);
            this.SelectStart.Y = StartContentPos.Get(Depth + 1);
            this.SelectStart.bOutside = false;
        }
        else
        {
            this.SelectStart.bOutside = true;
        }


        if(EndFlag === 0)
        {
            this.SelectEnd.X = EndContentPos.Get(Depth);
            this.SelectEnd.Y = EndContentPos.Get(Depth + 1);
            this.SelectEnd.bOutside = false;
        }
        else /// в случае, если закончили селект на уровень выше, а нужно выставить начало селекта во внутреннем элементе мат объекта
        {
            this.SelectEnd.bOutside = true;
        }


        Depth += 2;

        if(!this.SelectEnd.bOutside && !this.SelectStart.bOutside)
        {
            var startX = this.SelectStart.X,
                startY = this.SelectStart.Y;

            var endX = this.SelectEnd.X,
                endY = this.SelectEnd.Y;

            var bJustDraw = this.elements[this.SelectStart.X][this.SelectStart.Y].IsJustDraw();

            if(startX == endX && startY == endY)
            {
                if(!bJustDraw)
                    this.elements[startX][startY].Set_SelectionContentPos(StartContentPos, EndContentPos, Depth, StartFlag, EndFlag);
                else
                    this.elements[startX][startY].Set_SelectionContentPos(StartContentPos, null, Depth, StartFlag, -1);
            }
        }

        this.bSelectionUse = true;

    },
    Selection_IsEmpty: function()
    {
        var result = false;

        if(this.IsSelectEmpty())
            result = this.elements[this.SelectStart.X][this.SelectStart.Y].Selection_IsEmpty();

        return result;
    },
    IsSelectEmpty: function()
    {
        var startX = this.SelectStart.X,
            startY = this.SelectStart.Y;

        var endX = this.SelectEnd.X,
            endY = this.SelectEnd.Y;

        var bEqual = (startX == endX) && (startY == endY);

        var bInsideSelect = bEqual && this.elements[startX][startY].bInside == true && !this.elements[startX][startY].IsSelectEmpty();

        return (!this.SelectStart.bOutside && !this.SelectEnd.bOutside) && bEqual && !bInsideSelect;
    },
    Recalculate_CurPos: function(_X, Y, CurrentRun, _CurRange, _CurLine, _CurPage, UpdateCurPos, UpdateTarget, ReturnTarget)
    {
        return this.elements[this.CurPos_X][this.CurPos_Y].Recalculate_CurPos(_X, Y, CurrentRun, _CurRange, _CurLine, _CurPage, UpdateCurPos, UpdateTarget, ReturnTarget);
    },
    GetSelectContent: function()
    {
        var result;

        if(this.bSelectionUse)
            result = this.elements[this.SelectStart.X][this.SelectStart.Y].GetSelectContent();
        else
            result = this.elements[this.CurPos_X][this.CurPos_Y].GetSelectContent();

        return result;
    },
    Selection_DrawRange: function(CurLine, CurPage, SelectionDraw) // первые два параметра нужны только для аналогичной функции в ParaRun
    {
        if(SelectionDraw.FindStart == false)
        {
            SelectionDraw.W += this.size.width;
        }
        /*else
        {
            SelectionDraw.StartX += this.size.width;
        }*/
        //SelectionDraw.FindStart = true;
    },
    SetRunEmptyToContent: function(bAll)
    {
        for(var i=0; i < this.nRow; i++)
            for(var j = 0; j < this.nCol; j++)
                if(!this.elements[i][j].IsJustDraw())
                    this.elements[i][j].SetRunEmptyToContent(bAll);
    },
    Correct_Content: function(bInnerCorrection)
    {
        for(var i=0; i < this.nRow; i++)
            for(var j = 0; j < this.nCol; j++)
                if(!this.elements[i][j].IsJustDraw())
                    this.elements[i][j].Correct_Content(bInnerCorrection);
    },
    Selection_Remove: function()
    {
        var start_X = this.SelectStart.X,
            start_Y = this.SelectStart.Y;
                                                             // проверка на bSelectionUse, чтобы избежать ситуации, когда селекта в этом элементе не было
        if(!this.SelectStart.bOutside && this.bSelectionUse) // и нужно очистить селект у всех незаселекченных элементов контента (в тч и этом) в функции Selection_DrawRange. а стартовая и конечная позиции совпадают и в стартовой позиции находится JustDraw-элемент
            this.elements[start_X][start_Y].Selection_Remove();

        this.bSelectionUse = false;
    },
    SetGaps:  function(GapsInfo)
    {
        this.Parent   = GapsInfo.Parent;
        this.ParaMath = GapsInfo.ParaMath;


        GapsInfo.Left       = GapsInfo.Current;
        GapsInfo.leftRunPrp = GapsInfo.currRunPrp;


        GapsInfo.Current    = this;
        GapsInfo.currRunPrp = this.Get_CompiledCtrPrp();

        GapsInfo.setGaps();

    },
    /*ApplyGaps: function()
    {
        this.size.width += this.GapLeft + this.GapRight;
    },*/
    Recalculate_Reset: function(StartRange, StartLine)
    {
        for(var i=0; i < this.nRow; i++)
            for(var j = 0; j < this.nCol; j++)
                if(this.elements[i][j].IsJustDraw() == false)
                    this.elements[i][j].Recalculate_Reset(StartRange, StartLine);
    },
    // Перемещение по стрелкам

    Get_LeftPos: function(SearchPos, ContentPos, Depth, UseContentPos, EndRun)
    {
        var CurPos_X, CurPos_Y;

        if(UseContentPos === true)
        {
            CurPos_X = ContentPos.Get(Depth);
            CurPos_Y = ContentPos.Get(Depth + 1);
        }
        else if(SearchPos.ForSelection == true && this.SelectEnd.bOutside === true)
        {
            CurPos_X = this.SelectEnd.X;
            CurPos_Y = this.SelectEnd.Y;
        }
        else
        {
            CurPos_X = this.nRow - 1;
            CurPos_Y = this.nCol - 1;
        }

        while(CurPos_X >= 0)
        {
            while(CurPos_Y >= 0)
            {
                var bJDraw = this.elements[CurPos_X][CurPos_Y].IsJustDraw(),
                    usePlh = !bJDraw && UseContentPos && this.elements[CurPos_X][CurPos_Y].IsPlaceholder();

                if(!bJDraw && !usePlh)
                {
                    this.elements[CurPos_X][CurPos_Y].Get_LeftPos(SearchPos, ContentPos, Depth + 2, UseContentPos, EndRun);
                    SearchPos.Pos.Update(CurPos_X, Depth);
                    SearchPos.Pos.Update(CurPos_Y, Depth+1);
                }

                if(SearchPos.Found === true || SearchPos.ForSelection == true)
                    break;

                CurPos_Y--;

                UseContentPos = false;
                EndRun      = true;

            }

            if(SearchPos.Found === true)
                break;

            CurPos_X--;
            CurPos_Y = this.nCol - 1;

        }

        return SearchPos.Found;
    },
    Get_RightPos: function(SearchPos, ContentPos, Depth, UseContentPos, StepEnd, BegRun)
    {
        var CurPos_X, CurPos_Y;

        if(UseContentPos === true)
        {
            CurPos_X = ContentPos.Get(Depth);
            CurPos_Y = ContentPos.Get(Depth + 1);
        }
        else if(SearchPos.ForSelection == true && this.SelectEnd.bOutside === true)
        {
            CurPos_X = this.SelectEnd.X;
            CurPos_Y = this.SelectEnd.Y;
        }
        else
        {
            CurPos_X = 0;
            CurPos_Y = 0;
        }

        while(CurPos_X < this.nRow)
        {
            while(CurPos_Y < this.nCol)
            {
                var bJDraw = this.elements[CurPos_X][CurPos_Y].IsJustDraw(),
                    usePlh = !bJDraw && UseContentPos && this.elements[CurPos_X][CurPos_Y].IsPlaceholder();

                if(!bJDraw && !usePlh)
                {
                    this.elements[CurPos_X][CurPos_Y].Get_RightPos(SearchPos, ContentPos, Depth + 2, UseContentPos, StepEnd, BegRun);
                    SearchPos.Pos.Update(CurPos_X, Depth);
                    SearchPos.Pos.Update(CurPos_Y, Depth+1);
                }

                if(SearchPos.Found === true || SearchPos.ForSelection == true)
                    break;

                CurPos_Y++;

                UseContentPos = false;
                BegRun      = true;
            }

            if(SearchPos.Found === true)
                break;

            CurPos_X++;
            CurPos_Y = 0;

        }

        return SearchPos.Found;
    },
    Get_WordStartPos: function(SearchPos, ContentPos, Depth, UseContentPos, EndRun)
    {
        var CurPos_X, CurPos_Y;

        if(UseContentPos === true)
        {
            CurPos_X = ContentPos.Get(Depth);
            CurPos_Y = ContentPos.Get(Depth + 1);
        }
        else if(SearchPos.ForSelection == true && this.SelectEnd.bOutside === true)
        {
            CurPos_X = this.SelectEnd.X;
            CurPos_Y = this.SelectEnd.Y;
        }
        else
        {
            CurPos_X = this.nRow - 1;
            CurPos_Y = this.nCol - 1;
        }

        var bUseContent = UseContentPos;

        while(CurPos_X >= 0)
        {
            while(CurPos_Y >= 0)
            {
                var bJDraw = this.elements[CurPos_X][CurPos_Y].IsJustDraw(),
                    usePlh = !bJDraw && bUseContent && this.elements[CurPos_X][CurPos_Y].IsPlaceholder();

                if(!bJDraw && !usePlh)
                {
                    this.elements[CurPos_X][CurPos_Y].Get_WordStartPos(SearchPos, ContentPos, Depth + 2, bUseContent, EndRun);
                    SearchPos.Pos.Update(CurPos_X, Depth);
                    SearchPos.Pos.Update(CurPos_Y, Depth+1);
                }

                if(SearchPos.Found === true)
                    break;

                CurPos_Y--;

                bUseContent = false;
                EndRun      = true;
            }

            if(SearchPos.Found === true || SearchPos.ForSelection == true)
                break;

            CurPos_X--;
            CurPos_Y = this.nCol - 1;

        }
    },
    Get_WordEndPos : function(SearchPos, ContentPos, Depth, UseContentPos, StepEnd, BegRun)
    {
        var CurPos_X, CurPos_Y;

        if(UseContentPos === true)
        {
            CurPos_X = ContentPos.Get(Depth);
            CurPos_Y = ContentPos.Get(Depth + 1);
        }
        else if(SearchPos.ForSelection == true && this.SelectEnd.bOutside === true)
        {
            CurPos_X = this.SelectEnd.X;
            CurPos_Y = this.SelectEnd.Y;
        }
        else
        {
            CurPos_X = 0;
            CurPos_Y = 0;
        }

        var bUseContent = UseContentPos;

        while(CurPos_X < this.nRow)
        {
            while(CurPos_Y < this.nCol)
            {
                var bJDraw = this.elements[CurPos_X][CurPos_Y].IsJustDraw(),
                    usePlh = !bJDraw && bUseContent && this.elements[CurPos_X][CurPos_Y].IsPlaceholder();

                if(!bJDraw && !usePlh)
                {
                    this.elements[CurPos_X][CurPos_Y].Get_WordEndPos(SearchPos, ContentPos, Depth + 2, bUseContent, StepEnd, BegRun);
                    SearchPos.Pos.Update(CurPos_X, Depth);
                    SearchPos.Pos.Update(CurPos_Y, Depth+1);
                }

                if(SearchPos.Found === true)
                    break;

                CurPos_Y++;

                bUseContent = false;
                BegRun      = true;
            }

            if(SearchPos.Found === true || SearchPos.ForSelection == true)
                break;

            CurPos_X++;
            CurPos_Y = 0;

        }
    },
    //////////////////////////////////
    IsPlaceholder: function()
    {
        return false;
    },
    GetParent: function()
    {
        return (this.Parent.Type !== para_Math_Composition ? this : this.Parent.GetParent());
    },
    Copy: function(Selected)
    {
        var props = Common_CopyObj(this.Pr);

        props.ctrPrp = this.CtrPrp.Copy();

        var NewObj = new this.constructor();
        NewObj.init(props);

        for(var i=0; i < this.nRow; i++)
            for(var j = 0; j < this.nCol; j++)
            {
                NewObj.elements[i][j] = this.elements[i][j].Copy(Selected);
            }

        return NewObj;
    },
    Get_TextPr: function(ContentPos, Depth)
    {
        var row = ContentPos.Get(Depth),
            col = ContentPos.Get(Depth+1);


        return this.elements[row][col].Get_TextPr(ContentPos, Depth + 2);
    },
    Get_CompiledTextPr : function(Copy)
    {
        var start_x = 0,
            start_y = 0;

        var TextPr = null;

        while(start_x < this.nRow && start_y < this.nCol && (TextPr == null || this.elements[start_x][start_y].IsJustDraw() ))
        {
            if(!this.elements[start_x][start_y].IsJustDraw())
            {
                TextPr = this.elements[start_x][start_y].Get_CompiledTextPr(Copy, true);
                break;
            }

            start_y++;

            if(start_y == this.nCol)
            {
                start_x++;
                start_y = 0;
            }
        }

        for(var i=start_y; i < this.nRow; i++)
        {
            for(var j = start_x; j < this.nCol; j++)
            {
                if(!this.elements[i][j].IsJustDraw())
                {
                    var CurTextPr = this.elements[i][j].Get_CompiledTextPr(true, true);

                    if ( null !== CurTextPr )
                        TextPr = TextPr.Compare( CurTextPr );
                }
            }
        }

        return TextPr;
    },
    Get_CompiledPr: function(Copy)
    {
        return this.Get_CompiledTextPr(Copy);
    },
    Apply_TextPr: function(TextPr, IncFontSize, ApplyToAll)
    {
        if(TextPr == undefined)
        {
            var CtrPrp = this.Get_CompiledCtrPrp_2();
            this.Set_FontSizeCtrPrp(FontSize_IncreaseDecreaseValue( IncFontSize, CtrPrp.FontSize ));
        }
        else
        {
            if(TextPr.FontSize !== undefined)
                this.Set_FontSizeCtrPrp(TextPr.FontSize);
        }

        for(var i=0; i < this.nRow; i++)
        {
            for(var j = 0; j < this.nCol; j++)
            {
                if(!this.elements[i][j].IsJustDraw())
                    this.elements[i][j].Apply_TextPr(TextPr, IncFontSize, ApplyToAll);
            }
        }
    },
    Set_FontSizeCtrPrp: function(Value)
    {
        History.Add(this, new CChangesMathFontSize(Value, this.CtrPrp.FontSize));
        this.raw_SetFontSize(Value);
    },

    raw_SetFontSize : function(Value)
    {
        this.CtrPrp.FontSize    = Value;
        this.RecalcInfo.bCtrPrp = true;

        if (null !== this.ParaMath)
            this.ParaMath.SetNeedResize();
    },
    Set_Select_ToMComp: function(Direction)
    {
        this.SelectStart.X = this.SelectEnd.X = this.CurPos_X;
        this.SelectStart.Y = this.SelectEnd.Y = this.CurPos_Y;

        this.elements[this.CurPos_X][this.CurPos_Y].Set_Select_ToMComp(Direction);
    },
    SetSelectAll: function()
    {
        this.SelectStart.bOutside = true;
        this.SelectEnd.bOutside   = true;

        this.bSelectionUse = true;
    },
    SelectToParent: function(bCorrect)
    {
        this.bSelectionUse = true;
        this.Parent.SelectToParent(bCorrect);
    },
    Check_NearestPos: function(ParaNearPos, Depth)
    {
        var ContentNearPos = new CParagraphElementNearPos();
        ContentNearPos.NearPos = ParaNearPos.NearPos;
        ContentNearPos.Depth   = Depth;

        // CParagraphNearPos for ParaNearPos
        this.NearPosArray.push( ContentNearPos );
        ParaNearPos.Classes.push( this );

        var CurPos_X = ParaNearPos.NearPos.ContentPos.Get(Depth),
            CurPos_Y = ParaNearPos.NearPos.ContentPos.Get(Depth + 1);

        this.Content[CurPos_X][CurPos_Y].Check_NearestPos( ParaNearPos, Depth + 2 );
    },
    Create_FontMap : function(Map)
    {
        var CtrPrp = this.Get_CompiledCtrPrp();
        CtrPrp.Document_CreateFontMap( Map, this.ParaMath.Paragraph.Get_Theme().themeElements.fontScheme);

        for(var i=0; i < this.nRow; i++)
            for(var j = 0; j < this.nCol; j++)
            {
                if(!this.elements[i][j].IsJustDraw())
                    this.elements[i][j].Create_FontMap( Map );
            }

    },
    Get_AllFontNames: function(AllFonts)
    {
        this.CtrPrp.Document_Get_AllFontNames( AllFonts );

        for(var i=0; i < this.nRow; i++)
            for(var j = 0; j < this.nCol; j++)
            {
                if(!this.elements[i][j].IsJustDraw())
                    this.elements[i][j].Get_AllFontNames(AllFonts);
            }
    },
    Undo: function(Data)
    {
        Data.Undo(this);
    },
    Redo: function(Data)
    {
        Data.Redo(this);
    },
    Refresh_RecalcData: function()
    {
        if(this.ParaMath !== null)
            this.ParaMath.Refresh_RecalcData(); // Refresh_RecalcData сообщает родительскому классу, что у него произошли изменения, нужно пересчитать
    },
    Save_Changes: function(Data, Writer)
    {
        WriteChanges_ToBinary(Data, Writer);
    },
    Load_Changes : function(Reader)
    {
        ReadChanges_FromBinary(Reader, this);
    }

    //////////////////////////
};

CMathBase.prototype.Fill_LogicalContent = function(nCount)
{
    for (var nIndex = 0; nIndex < nCount; nIndex++)
        this.Content[nIndex] = new CMathContent();
};
CMathBase.prototype.Copy = function()
{
    var oProps = this.Pr.Copy();
    oProps.ctrPrp = this.CtrPrp.Copy();

    var NewElement = new this.constructor(oProps);

    for (var nIndex = 0, nCount = this.Content.length; nIndex < nCount; nIndex++)
    {
        this.Content[nIndex].CopyTo(NewElement.Content[nIndex], false);
    }

    return NewElement;
};
CMathBase.prototype.Refresh_RecalcData = function(Data)
{
};
CMathBase.prototype.Write_ToBinary2 = function( Writer )
{
    Writer.WriteLong(this.ClassType);

    // String           : Id
    // Long             : Content.length
    // Array of Strings : Content[Index].Id
    // Variable         : Pr
    // Variable(CTextPr): CtrPrp

    Writer.WriteString2(this.Id);

    var nCount = this.Content.length;
    Writer.WriteLong(nCount);
    for (var nIndex = 0; nIndex < nCount; nIndex++)
    {
        Writer.WriteString2(this.Content[nIndex].Id);
    }

    this.Pr.Write_ToBinary(Writer);
    this.CtrPrp.Write_ToBinary(Writer);
};
CMathBase.prototype.Read_FromBinary2 = function( Reader )
{
    // String           : Id
    // Long             : Content.length
    // Array of Strings : Content[Index].Id
    // Variable         : Pr
    // Variable(CTextPr): CtrPrp

    this.Id = Reader.GetString2();

    var nCount = Reader.GetLong();
    this.Content = [];
    for (var nIndex = 0; nIndex < nCount; nIndex++)
    {
        this.Content[nIndex] = g_oTableId.Get_ById(Reader.GetString2());
    }

    this.Pr.Read_FromBinary(Reader);
    this.CtrPrp.Read_FromBinary(Reader);

    this.fillContent();
}
CMathBase.prototype.Get_Id = function()
{
    return this.Id;
};
CMathBase.prototype.getPropsForWrite = function()
{
    return this.Pr;
};
CMathBase.prototype.setProperties = function(oProps)
{
    this.Pr.Set_FromObject(oProps);
    this.setCtrPrp(oProps.ctrPrp);

    this.RecalcInfo.bProps = true;
}
