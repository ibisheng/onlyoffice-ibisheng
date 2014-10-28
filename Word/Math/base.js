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
    this.TextPrControlLetter = new CTextPr();

    this.ArgSize = new CMathArgSize();

    /////////////////
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
    this.CurPos  = 0;

    this.Selection =
    {
        StartPos : 0,
        EndPos   : 0,
        Use      : false
    };

    this.NearPosArray = [];

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
    NeedCompiledCtrPr: function()
    {
        this.RecalcInfo.bCtrPrp = true;

        for(var i=0; i < this.nRow; i++)
            for(var j = 0; j < this.nCol; j++)
                if(!this.elements[i][j].IsJustDraw())
                    this.elements[i][j].NeedCompiledCtrPr();

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
        this.Set_CompiledCtrPrp(this.Parent, this.ParaMath);

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
        this.Set_CompiledCtrPrp(this.Parent, this.ParaMath);

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
    GetTPrpToControlLetter: function()
    {
        this.Set_CompiledCtrPrp(this.Parent, this.ParaMath);

        return this.TextPrControlLetter;
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
    ApplyProperties: function(RPI)
    {},
    PreRecalc: function(Parent, ParaMath, ArgSize, RPI, GapsInfo)
    {
        this.Parent = Parent;
        this.ParaMath = ParaMath;

        this.Set_CompiledCtrPrp(Parent, ParaMath);

        this.ApplyProperties(RPI);

        // setGaps обязательно после того как смержили CtrPrp (Set_CompiledCtrPrp)
        if(this.bInside == false)
            GapsInfo.setGaps(this, this.TextPrControlLetter.FontSize);

        for(var Pos = 0; Pos < this.Content.length; Pos++)
                this.Content[Pos].SetParent(this, ParaMath);

        for(var i=0; i < this.nRow; i++)
            for(var j = 0; j < this.nCol; j++)
                    this.elements[i][j].PreRecalc(this, ParaMath, ArgSize, RPI);

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

        var ascent = this.getAscent(oMeasure, height);

        this.size = {width: width, height: height, ascent: ascent};
    },
    Resize: function(oMeasure, RPI)
    {
        for(var i=0; i < this.nRow; i++)
            for(var j = 0; j < this.nCol; j++)
                this.elements[i][j].Resize(oMeasure, RPI);


        this.recalculateSize(oMeasure, RPI);
    },
    Resize_2: function(oMeasure, Parent, ParaMath, RPI, ArgSize)
    {
        for(var i=0; i < this.nRow; i++)
            for(var j = 0; j < this.nCol; j++)
                if(!this.elements[i][j].IsJustDraw())
                    this.elements[i][j].Resize_2(oMeasure, this, ParaMath, RPI, ArgSize);
    },
    Set_CompiledCtrPrp: function(Parent, ParaMath)
    {
        if(this.RecalcInfo.bCtrPrp == true)
        {
            // for Ctr Prp

            //this.CompiledCtrPrp = ParaMath.GetFirstRPrp();
            var defaultTxtPrp = ParaMath.Get_Default_TPrp();

            this.CompiledCtrPrp.FontFamily =
            {
                Name:       defaultTxtPrp.FontFamily.Name,
                Index:      defaultTxtPrp.FontFamily.Index
            };
            this.CompiledCtrPrp.FontSize = defaultTxtPrp.FontSize;

            this.CompiledCtrPrp.Merge(this.CtrPrp);

            // for Control Letter

            var FontSize = ParaMath.GetFirstRPrp().FontSize;

            if(this.bInside == true)
            {
                var TxtPr = Parent.Get_TxtPrControlLetter();
                FontSize = TxtPr.FontSize;
                FontSize = ParaMath.ApplyArgSize(FontSize, this.ArgSize.value);
            }
            else
            {
                FontSize = ParaMath.ApplyArgSize(FontSize, Parent.Get_CompiledArgSize().value);
                FontSize = ParaMath.ApplyArgSize(FontSize, this.ArgSize.value);
            }

            this.TextPrControlLetter.FontSize = FontSize;
            this.TextPrControlLetter.FontFamily =
            {
                Name:       defaultTxtPrp.FontFamily.Name,
                Index:      defaultTxtPrp.FontFamily.Index
            }; // Cambria Math


            this.RecalcInfo.bCtrPrp = false;
        }
    },
    Get_TxtPrControlLetter: function() // TextPrControlLetter не копируются !
    {
        this.Set_CompiledCtrPrp(this.Parent, this.ParaMath);

        return this.TextPrControlLetter;
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
    SetGaps:  function(GapsInfo)
    {
        //this.Parent   = GapsInfo.Parent;
        //this.ParaMath = GapsInfo.ParaMath;

        GapsInfo.Left       = GapsInfo.Current;
        GapsInfo.leftRunPrp = GapsInfo.currRunPrp;


        GapsInfo.Current    = this;
        GapsInfo.currRunPrp = this.Get_CompiledCtrPrp();

        GapsInfo.setGaps();

    },

    //////////////////////////////////
    IsPlaceholder: function()
    {
        return false;
    },
    IsText: function()
    {
        return false;
    },
    GetParent: function()
    {
        return (this.Parent.Type !== para_Math_Composition ? this : this.Parent.GetParent());
    },
    Get_TextPr: function(ContentPos, Depth)
    {
        var pos = ContentPos.Get(Depth);

        return this.Content[pos].Get_TextPr(ContentPos, Depth+1);
    },
    Get_CompiledTextPr_11100 : function(Copy)
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
    Get_CompiledTextPr : function(Copy)
    {
        var  TextPr = this.Content[0].Get_CompiledTextPr(true, true);

        for(var i = 1; i < this.Content.length; i++)
        {
            var CurTextPr = this.Content[i].Get_CompiledTextPr(false, true);

            if ( null !== CurTextPr )
                TextPr = TextPr.Compare( CurTextPr );
        }

        return TextPr;
    },
    Get_CompiledPr: function(Copy)
    {
        return this.Get_CompiledTextPr(Copy);
    },
    Apply_TextPr: function(TextPr, IncFontSize, ApplyToAll)
    {
        if(ApplyToAll == true)
            this.RecalcInfo.bCtrPrp = true;

        if(TextPr == undefined)
        {
            var CtrPrp = this.Get_CompiledCtrPrp_2();
            this.Set_FontSizeCtrPrp(FontSize_IncreaseDecreaseValue( IncFontSize, CtrPrp.FontSize ));
        }
        else
        {
            if(TextPr.FontSize !== undefined)
                this.Set_FontSizeCtrPrp(TextPr.FontSize);
            else if(TextPr.Shd !== undefined)
                this.Set_Shd(TextPr.Shd);
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

    GetMathTextPr: function(ContentPos, Depth)
    {
        var pos = ContentPos.Get(Depth);

        return this.Content[pos].GetMathTextPr(ContentPos, Depth+1);
    },
    Set_MathTextPr2: function(TextPr, MathPr, bAll)
    {
        this.Set_FontSizeCtrPrp(TextPr.FontSize);

        for(var i = 0; i < this.Content.length; i++)
            this.Content[i].Set_MathTextPr2(TextPr, MathPr, bAll);
    },
    Set_FontSizeCtrPrp: function(Value)
    {
        History.Add(this, new CChangesMathFontSize(Value, this.CtrPrp.FontSize));
        this.raw_SetFontSize(Value);
    },
    Set_Shd: function(Shd)
    {
        if ( (undefined === this.CtrPrp.Shd && undefined === Shd) || (undefined !== this.CtrPrp.Shd && undefined !== Shd && true === this.CtrPrp.Shd.Compare( Shd ) ) )
            return;

        //var OldShd = this.CtrPrp.Shd;

        if ( undefined !== Shd )
        {
            this.CtrPrp.Shd = new CDocumentShd();
            this.CtrPrp.Shd.Set_FromObject( Shd );
        }
        else
            this.CtrPrp.Shd = undefined;

        this.RecalcInfo.bCtrPrp = true;

        if (null !== this.ParaMath)
            this.ParaMath.SetNeedResize();
    },
    raw_SetFontSize : function(Value)
    {
        this.CtrPrp.FontSize    = Value;
        this.RecalcInfo.bCtrPrp = true;

        if (null !== this.ParaMath)
            this.ParaMath.SetNeedResize();
    },
    SelectToParent: function(bCorrect)
    {
        this.bSelectionUse = true;
        this.Parent.SelectToParent(bCorrect);
    }
    //////////////////////////
};

CMathBase.prototype.Recalculate_Reset = function(StartRange, StartLine)
{
    for (var nPos = 0, nCount = this.Content.length; nPos < nCount; nPos++)
    {
        this.Content[nPos].Recalculate_Reset(StartRange, StartLine);
    }
};
CMathBase.prototype.Fill_LogicalContent = function(nCount)
{
    for (var nIndex = 0; nIndex < nCount; nIndex++)
    {
        this.Content[nIndex] = new CMathContent();
        this.Content[nIndex].ParentElement = this;
    }
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
    if(this.ParaMath !== null)
        this.ParaMath.Refresh_RecalcData(); // Refresh_RecalcData сообщает родительскому классу, что у него произошли изменения, нужно пересчитать
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
        this.Content[nIndex].ParentElement = this;
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
CMathBase.prototype.Correct_Content = function(bInnerCorrection)
{
    var nCount = this.Content.length;
    for (var nIndex = 0; nIndex < nCount; nIndex++)
    {
        this.Content[nIndex].Correct_Content(bInnerCorrection);
    }
};
CMathBase.prototype.Undo = function(Data)
{
    Data.Undo(this);
};
CMathBase.prototype.Redo = function(Data)
{
    Data.Redo(this);
};
CMathBase.prototype.Save_Changes = function(Data, Writer)
{
    WriteChanges_ToBinary(Data, Writer);
};
CMathBase.prototype.Load_Changes = function(Reader)
{
    ReadChanges_FromBinary(Reader, this);
};
CMathBase.prototype.Get_AllFontNames = function(AllFonts)
{
    this.CtrPrp.Document_Get_AllFontNames(AllFonts);

    for (var nIndex = 0, nCount = this.Content.length; nIndex < nCount; nIndex++)
    {
        this.Content[nIndex].Get_AllFontNames(AllFonts);
    }
};
CMathBase.prototype.Create_FontMap = function(Map)
{
    if (null === this.ParaMath)
        return;

    var CtrPrp = this.Get_CompiledCtrPrp();
    CtrPrp.Document_CreateFontMap(Map, this.ParaMath.Paragraph.Get_Theme().themeElements.fontScheme);

    for (var nIndex = 0, nCount = this.Content.length; nIndex < nCount; nIndex++)
        this.Content[nIndex].Create_FontMap(Map);
};
CMathBase.prototype.Recalculate_CurPos = function(_X, Y, CurrentRun, _CurRange, _CurLine, _CurPage, UpdateCurPos, UpdateTarget, ReturnTarget)
{
    return this.Content[this.CurPos].Recalculate_CurPos(_X, Y, CurrentRun, _CurRange, _CurLine, _CurPage, UpdateCurPos, UpdateTarget, ReturnTarget);
};
CMathBase.prototype.Get_ParaContentPosByXY = function(SearchPos, Depth, _CurLine, _CurRange, StepEnd)
{
    var nCount = this.Content.length;
    if (nCount <= 0)
        return false;

    var aBounds = [];

    for (var nIndex = 0; nIndex < nCount; nIndex++)
    {
        aBounds.push(this.Content[nIndex].Get_Bounds());
    }

    var X = SearchPos.X;
    var Y = SearchPos.Y;

    var dDiff = null;

    var nCurIndex = 0;
    var nFindIndex = 0;

    while (nCurIndex < nCount)
    {
        var oBounds = aBounds[nCurIndex];
        if (oBounds.X <= X && X <= oBounds.X + oBounds.W && oBounds.Y <= Y && Y <= oBounds.Y + oBounds.H)
        {
            nFindIndex = nCurIndex;
            break;
        }
        else
        {
            var dCurDiffX = X - (oBounds.X + oBounds.W / 2);
            var dCurDiffY = Y - (oBounds.Y + oBounds.H / 2);
            var dCurDiff = dCurDiffX * dCurDiffX + dCurDiffY * dCurDiffY;

            if (null === dDiff || dDiff > dCurDiff)
            {
                dDiff = dCurDiff;
                nFindIndex = nCurIndex;
            }
        }

        nCurIndex++;
    }

    SearchPos.CurX = aBounds[nFindIndex].X;
    SearchPos.CurY = aBounds[nFindIndex].Y;

    var bResult = this.Content[nFindIndex].Get_ParaContentPosByXY(SearchPos, Depth + 1, _CurLine, _CurRange, StepEnd);
    if(true === bResult)
    {
        SearchPos.Pos.Update2(nFindIndex, Depth);
    }

    return bResult;
};
CMathBase.prototype.Get_ParaContentPos = function(bSelection, bStart, ContentPos)
{
    var nPos = (true !== bSelection ? this.CurPos : (false !== bStart ? this.Selection.StartPos : this.Selection.EndPos));
    ContentPos.Add(nPos);

    if (undefined !== this.Content[nPos])
        this.Content[nPos].Get_ParaContentPos(bSelection, bStart, ContentPos);
};
CMathBase.prototype.Set_ParaContentPos = function(ContentPos, Depth)
{
    var CurPos = ContentPos.Get(Depth);

    if (CurPos > this.Content.length - 1)
    {
        this.CurPos = this.Content.length - 1;
        this.Content[this.CurPos].Cursor_MoveToEndPos(false);
    }
    else if (this.CurPos < 0)
    {
        this.CurPos = 0;
        this.Content[this.CurPos].Cursor_MoveToStartPos();
    }
    else
    {
        this.CurPos = CurPos;
        this.Content[this.CurPos].Set_ParaContentPos(ContentPos, Depth + 1);
    }
};
CMathBase.prototype.Selection_IsEmpty = function()
{
    if (true !== this.Selection.Use)
        return true;

    if (this.Selection.StartPos === this.Selection.EndPos)
        return this.Content[this.Selection.StartPos].Selection_IsEmpty();

    return false;
};
CMathBase.prototype.GetSelectContent = function()
{
    var nPos = (true === this.Selection.Use ? this.Selection.StartPos : this.CurPos);
    return this.Content[nPos].GetSelectContent();
};
CMathBase.prototype.Is_InnerSelection = function()
{
    if (true === this.Selection.Use && this.Selection.StartPos === this.Selection.EndPos)
        return true;

    return false;
};
CMathBase.prototype.Select_WholeElement = function()
{
    if (null !== this.Parent)
        this.Parent.Select_Element(this, true);
};
CMathBase.prototype.Select_MathContent = function(MathContent)
{
    for (var nPos = 0, nCount = this.Content.length; nPos < nCount; nPos++)
    {
        if (this.Content[nPos] === MathContent)
        {
            if (null !== this.Parent)
            {
                this.Selection.Use      = true;
                this.Selection.StartPos = nPos;
                this.Selection.EndPos   = nPos;
                this.Parent.Select_Element(this, false);
            }
            break;
        }
    }
};
CMathBase.prototype.Draw_HighLights = function(PDSH, bAll)
{
    var oShd = this.Get_CompiledCtrPrp().Shd;
    var bDrawShd  = ( oShd === undefined || shd_Nil === oShd.Value ? false : true );
    var ShdColor  = ( true === bDrawShd ? oShd.Get_Color( PDSH.Paragraph ) : null );

    var X = PDSH.X,
        Y0 = PDSH.Y0,
        Y1 = PDSH.Y1;

    var bAllCont = this.Selection.StartPos !== this.Selection.EndPos;

    for (var CurPos = 0; CurPos < this.Content.length; CurPos++)
        this.Content[CurPos].Draw_HighLights(PDSH, bAllCont);

    if (true === bDrawShd)
        PDSH.Shd.Add(Y0, Y1, X, X + this.size.width, 0, ShdColor.r, ShdColor.g, ShdColor.b );

    PDSH.X = this.pos.x + this.ParaMath.X + this.size.width;

};
CMathBase.prototype.Search                        = ParaHyperlink.prototype.Search;
CMathBase.prototype.Add_SearchResult              = ParaHyperlink.prototype.Add_SearchResult;
CMathBase.prototype.Clear_SearchResults           = ParaHyperlink.prototype.Clear_SearchResults;
CMathBase.prototype.Remove_SearchResult           = ParaHyperlink.prototype.Remove_SearchResult;
CMathBase.prototype.Search_GetId                  = ParaHyperlink.prototype.Search_GetId;


CMathBase.prototype.Set_SelectionContentPos       = ParaHyperlink.prototype.Set_SelectionContentPos;
CMathBase.prototype.Get_LeftPos                   = ParaHyperlink.prototype.Get_LeftPos;
CMathBase.prototype.Get_RightPos                  = ParaHyperlink.prototype.Get_RightPos;
CMathBase.prototype.Get_WordStartPos              = ParaHyperlink.prototype.Get_WordStartPos;
CMathBase.prototype.Get_WordEndPos                = ParaHyperlink.prototype.Get_WordEndPos;
CMathBase.prototype.Selection_Remove              = ParaHyperlink.prototype.Selection_Remove;
CMathBase.prototype.Select_All                    = ParaHyperlink.prototype.Select_All;
CMathBase.prototype.Check_NearestPos              = ParaHyperlink.prototype.Check_NearestPos;
CMathBase.prototype.Get_SelectionDirection        = ParaHyperlink.prototype.Get_SelectionDirection;
CMathBase.prototype.Selection_CheckParaContentPos = function(ContentPos, Depth, bStart, bEnd)
{
    if (true !== this.Selection.Use)
        return false;

    var CurPos = ContentPos.Get(Depth);

    if (this.Selection.StartPos === this.Selection.EndPos && this.Selection.StartPos === CurPos)
        return this.Content[CurPos].Selection_CheckParaContentPos(ContentPos, Depth + 1, bStart, bEnd);

    if (this.Selection.StartPos !== this.Selection.EndPos)
        return true;

    return false;
};

function CMathBasePr()
{
};

CMathBasePr.prototype.Set_FromObject  = function(Obj){};
CMathBasePr.prototype.Copy            = function(){return new CMathBasePr();};
CMathBasePr.prototype.Write_ToBinary  = function(Writer){};
CMathBasePr.prototype.Read_FromBinary = function(Reader){};