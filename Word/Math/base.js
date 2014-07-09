"use strict";

function CMathBase()
{
    //this.typeObj = MATH_COMP;
    this.Type = para_Math_Composition;

    this.pos = new CMathPosition();
    this.size = null;

    //  Properties
    this.argSize = 0;
    this.Parent = null;
    this.ParaMath = null; // ссылка на общую формулу

    this.CtrPrp = new CTextPr();
    this.CompiledCtrPrp = new CTextPr();
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

    this.bSelectionUse = false;

    this.nRow = 0;
    this.nCol = 0;

    // todo
    // убрать !!!
    this.bMObjs = false;

    this.elements = new Array();

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
            {
                this.elements[i][j] = new CMathContent();
                //this.elements[i][j].relate(this);
                //this.elements[i][j].setComposition(this.Composition);
            }
        }
    },
    setDimension: function(countRow, countCol)
    {
        this.nRow = countRow;
        this.nCol = countCol;

        this.alignment.hgt = [];
        this.alignment.wdt = [];

        /*for(var u = 0; u < this.nCol ; u++)
            this.alignment.hgt[u] = MCJC_CENTER;

        for(u=0; u < this.nRow; u++)
            this.alignment.wdt[u] = MCJC_CENTER;*/

        for(var i = 0; i < this.nCol ; i++)
            this.alignment.wdt[i] = MCJC_CENTER;

        for(var j=0; j < this.nRow; j++)
        {
            this.elements[j] = new Array();
            this.alignment.hgt[j] = MCJC_CENTER;
        }

    },
    ///////// RunPrp, CtrPrp
    setCtrPrp: function(txtPrp) // выставляем ctrPrp на чтение
    {
        if(txtPrp !== null && typeof(txtPrp) !== "undefined")
            this.CtrPrp.Merge(txtPrp);
    },
    Get_CtrPrp: function()
    {
        return this.CtrPrp.Copy();
    },
    Set_CompiledCtrPrp: function(ParaMath)
    {
        var defaultRPrp = ParaMath.GetFirstRPrp();

        this.CompiledCtrPrp.Merge(defaultRPrp);
        this.CompiledCtrPrp.Merge(this.CtrPrp);

        for(var i=0; i < this.nRow; i++)
            for(var j = 0; j < this.nCol; j++)
                if(this.elements[i][j].Type === para_Math_Composition)
                    this.elements[i][j].Set_CompiledCtrPrp(ParaMath);

    },
    Get_CompiledCtrPrp: function()
    {
        var CompiledCtrPrp = this.CompiledCtrPrp.Copy();
        this.ParaMath.ApplyArgSize(CompiledCtrPrp, this.argSize);

        return CompiledCtrPrp;
    },
    Get_CompiledCtrPrp_2: function() // without arg Size
    {
        return this.CompiledCtrPrp.Copy();
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
    /*setRPrp: function(rPrp)
    {
        //this.RunPrp.mathPrp.bold = rPrp.mathPrp.bold; // как в Ворде, все остальные стили не поддерживаются
        //this.RunPrp.setTxtPrp(rPrp.textPrp); // Merge wTxtPrp

        this.CtrPrp = new CTextPr();
        //var gPrp  = rPrp.getMergedWPrp();
        this.CtrPrp.Merge(rPrp);

        for(var i=0; i < this.nRow; i++)
            for(var j = 0; j < this.nCol; j++)
            {
                if( !this.elements[i][j].IsJustDraw())
                    this.elements[i][j].setRPrp(rPrp);
            }
    },*/
    increaseArgSize: function()
    {
        for(var i=0; i < this.nRow; i++)
            for(var j = 0; j < this.nCol; j++)
                this.elements[i][j].increaseArgSize();
    },
    decreaseArgSize: function()
    {
        for(var i=0; i < this.nRow; i++)
            for(var j = 0; j < this.nCol; j++)
                this.elements[i][j].decreaseArgSize();
    },
    setArgSize: function(argSize)
    {
        var val = this.argSize + argSize;

        if(val < -2)
            this.argSize = -2;
        else if(val > 2)
            this.argSize = 2;
        else
            this.argSize = val;

        for(var i=0; i < this.nRow; i++)
            for(var j = 0; j < this.nCol; j++)
                if( !this.elements[i][j].IsJustDraw() )
                    this.elements[i][j].setArgSize(argSize);
    },
    fillPlaceholders: function()
    {
         for(var i=0; i < this.nRow; i++)
             for(var j = 0; j < this.nCol; j++)
                if(!this.elements[i][j].IsJustDraw())
                 this.elements[i][j].fillPlaceholders();
    },
    addMCToContent: function()
    {
        if(arguments.length == this.nRow*this.nCol)
        {
            this.elements = [];
            for(var i = 0; i < this.nRow; i++)
            {
                this.elements[i] = [];
                for(var j = 0; j < this.nCol; j++)
                {
                    this.elements[i][j] = arguments[j + i*this.nCol];
                    //this.elements[i][j].relate(this);
                    //this.elements[i][j].setComposition(this.Composition);
                    this.elements[i][j].bMObjs = true;
                }
            }
        }
        else
        {
            this.setContent();
        }
    },
    // эта функция здесь необходима для случая с n-арными операторами : когда передаем n-арный оператор с итераторами и аргумент
    IsJustDraw: function()
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
    findDisposition: function(mCoord)
    {
         var mouseCoord = {x: null, y: null},
             posCurs =    {x: null, y: null};

         var sumWidth = 0;
         var sumHeight = 0;

         var maxWH = this.getWidthsHeights();

         var Widths = maxWH.widths;
         var Heights = maxWH.heights;

         ///////////////////////////////

         if(mCoord.y > this.size.height)
             posCurs.x = this.nRow - 1;
         else
         {
             var _h = 0;
             for(var j = 0; j < this.nRow; j++)
             {
                 _h += Heights[j];
                 _h += this.dH/2;
                 if( mCoord.y <= _h + 0.000001) // если придет координата совпадающая с высотой элемента, чтобы не возникало проблем с погрешностью при сравнении
                 {
                     posCurs.x = j;
                     break;
                 }
                 _h += this.dH/2;
             }
         }

         ///////////////////////////////

         //если не правильно посчитали, а элемент был justDraw, то будет ошибка

         if( mCoord.x > this.size.width )
             posCurs.y = this.nCol - 1;
         else
         {
             var _w = 0;
             for(var u = 0; u < this.nCol; u++)
             {
                 _w +=Widths[u];
                 _w += this.dW/2;
                 if( mCoord.x <= _w  + 0.000001) // если придет координата совпадающая с высотой элемента, чтобы не возникало проблем с погрешностью при сравнении
                 {

                     if( this.elements[posCurs.x][u].IsJustDraw() )
                     {
                         if(this.nRow > 1)
                         {
                             if(posCurs.x == 0)
                                 posCurs.x = 1;
                             else if(posCurs.x == this.nRow - 1)
                                 posCurs.x = this.nRow - 2;
                             else
                             {
                                 if( mCoord.y < (_h - Heights[posCurs.x]/2) )
                                     posCurs.x--;
                                 else
                                     posCurs.x++;
                             }
                             posCurs.y = u;
                         }
                         else if(this.nCol > 1)
                         {
                             if(u == 0)
                                 posCurs.y = 1;
                             else if(u == this.nCol - 1)
                                 posCurs.y = this.nCol - 2;
                             else
                             {
                                 if( mCoord.x < (_w - Widths[u]/2) )
                                     posCurs.y = u - 1;
                                 else
                                     posCurs.y = u + 1;
                             }

                         }
                         else
                             return; // не самое лучшее решение, в идеале если у нас если такая ситуация получилась
                         // (что сомнительно, в контенте один элемент с которым ничего нельзя сделать),
                         // то вставать  после этого элемента  в контенте на уровень выше
                         // лучше следить за подобными ситуациями, чтобы такого не было
                     }
                     else
                         posCurs.y = u;
                     break;
                 }
                 _w += this.dW/2;
             }
         }
         ////////////////////////////////

         for(var t = 0; t < posCurs.y; t++)
             sumWidth += Widths[t];
         for(t = 0; t < posCurs.x; t++)
             sumHeight += Heights[t];

         // флаг для случая, когда выходим за границы элемента и есть выравнивание относительно других элементов
         // -1 - в пределах границы
         // 0 - начало контента
         // 1 - конец контента
         // 2 - вышли за границы контента по Y

         var inside_flag = -1;

         if( posCurs.x != null && posCurs.y != null)
         {
             var size = this.elements[posCurs.x][posCurs.y].size;
             var align = this.align(posCurs.x, posCurs.y);
             if(mCoord.x < ( posCurs.y*this.dW + sumWidth + align.x ))
             {
                 mouseCoord.x = 0;
                 inside_flag = 0;
             }
             else if( mCoord.x > ( posCurs.y*this.dW + sumWidth + align.x + size.width ))
             {
                 mouseCoord.x = size.width;
                 inside_flag = 1;
             }
             else
                 mouseCoord.x = mCoord.x - ( posCurs.y*this.dW + sumWidth + align.x );


             if(mCoord.y < (posCurs.x*this.dH + sumHeight + align.y))
             {
                 mouseCoord.y = 0;
                 inside_flag = 2;
             }
             else if( mCoord.y > ( posCurs.x*this.dH + sumHeight + align.y + size.height ) )
             {
                 mouseCoord.y = size.height;
                 inside_flag = 2;
             }
             else
                 mouseCoord.y = mCoord.y - (posCurs.x*this.dH + sumHeight + align.y );
         }

         return {pos: posCurs, mCoord: mouseCoord, inside_flag: inside_flag};
    },
    excludeJDElement: function(Cur_X, Cur_Y)
    {
        var pos_X = Cur_X,
            pos_Y = Cur_Y;

        if( this.elements[Cur_X][Cur_Y].IsJustDraw() )
        {
            if(this.nRow > 1)
            {
                if(Cur_X == 0)
                    pos_X = 1;
                else if(Cur_X == this.nRow - 1)
                    pos_X = this.nRow - 2;
                else
                {
                    // пока так
                    pos_X = Cur_X + 1;
                   /* if( mCoord.y < (_h - Heights[posCurs.x]/2) )
                        posCurs.x--;
                    else
                        posCurs.x++;*/
                }
                pos_Y = Cur_Y;
            }
            else if(this.nCol > 1)
            {
                if(Cur_Y == 0)
                    pos_Y = 1;
                else if(Cur_Y == this.nCol - 1)
                    pos_Y = this.nCol - 2;
                else
                {
                    // пока так
                    pos_Y = Cur_Y + 1;

                    /*if( mCoord.x < (_w - Widths[u]/2) )
                        posCurs.y = u - 1;
                    else
                        posCurs.y = u + 1;*/
                }

            }
            else
                return; // не самое лучшее решение, в идеале если у нас если такая ситуация получилась
            // (что сомнительно, в контенте один элемент с которым ничего нельзя сделать),
            // то вставать  после этого элемента  в контенте на уровень выше
            // лучше следить за подобными ситуациями, чтобы такого не было
        }

        return  {x: pos_X, y: pos_Y};

    },
    setPosition: function(pos)
    {
        this.pos.x = pos.x;

        if(this.bMObjs === true)
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
                this.elements[i][j].setPosition(NewPos);
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
    recalculateSize: function(oMeasure)
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

        width += this.dW*(this.nCol - 1);
        //width += this.GapLeft + this.GapRight;

        var ascent = this.getAscent(oMeasure, height);

        this.size = {width: width, height: height, ascent: ascent};
    },
    Resize: function(Parent, ParaMath, oMeasure)
    {
        this.Parent = Parent;
        this.ParaMath = ParaMath;

        for(var i=0; i < this.nRow; i++)
            for(var j = 0; j < this.nCol; j++)
                this.elements[i][j].Resize(this, ParaMath, oMeasure);

        this.recalculateSize(oMeasure); // передаем oMeasure, для
    },
    CompiledCtrPrp: function()
    {
        if(this.RecalcInfo.bCtrPrp == true)
        {
            this.Set_CompiledCtrPrp();
            this.RecalcInfo.bCtrPrp = false;
            //this.RecalcInfo.bProps  = false;
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
     // ф-ия используется, для того чтобы добавить в контент элемента текст/др формулы
    getElement: function(x, y)
    {
     return this.elements[x][y];
    },
    getContent: function(stack, bCurrent)
    {
        var pos = stack.pop();
        if(bCurrent)
        {
            this.CurPos_X = pos.X;
            this.CurPos_Y = pos.Y;
        }

        var content = this.elements[pos.X][pos.Y].getContent(stack, bCurrent);
        return content;
    },
    ////    For Edit   /////
    /*selection_Start: function(x, y)
    {
        var elem = this.findDisposition({x: x, y: y});
        var X = elem.mCoord.x,
            Y = elem.mCoord.y,
            Pos_X = elem.pos.x,
            Pos_Y = elem.pos.y;

        this.selectPos.startX = Pos_X;
        this.selectPos.startY = Pos_Y;

        this.elements[Pos_X][Pos_Y].selection_Start(X, Y);

    },
    selection_End: function(x, y)
    {
        var state = true, SelectContent = null;
        var elem = this.findDisposition({x: x, y: y});
        var X = elem.mCoord.x,
            Y = elem.mCoord.y,
            bInside = elem.inside_flag;

        var endX   = elem.pos.x,
            endY   = elem.pos.y,
            startX = this.selectPos.startX,
            startY = this.selectPos.startY;

        if(startX == endX && startY == endY && bInside === -1)
        {
            this.CurPos_X = startX;
            this.CurPos_Y = startY;
            var movement = this.elements[endX][endY].selection_End(X, Y);
            SelectContent = movement.SelectContent;
            state = movement.state;
            //state = true;
        }
        else
            state = false;

        return {state: state, SelectContent: SelectContent};
    },
    goToLeft: function()
    {
        var bUpperLevel = false;

        do{
            if( this.CurPos_Y > 0  )
            {
                this.CurPos_Y--;
            }
            else if(this.CurPos_X > 0)
            {
                this.CurPos_X--;
                this.CurPos_Y = this.nCol - 1;
            }
            else
            {
                bUpperLevel = true;
                break;
            }
        } while( this.elements[this.CurPos_X][this.CurPos_Y].IsJustDraw() )
            ;

        //из цикла вышли если bJustDraw = false  or  bUpperLevel = true

        var SelectContent;
        if(bUpperLevel)
        {
            SelectContent = this.Parent.goToLeft();
        }
        else
        {
            SelectContent = this.elements[this.CurPos_X][this.CurPos_Y].goToLastElement(); //если внутренний элемент не контент, а базовый класс, вернется последний элемент этого класса
        }

        return SelectContent;
    },
    goToRight: function()
    {
        var bUpperLevel = false;

        do{
            if( this.CurPos_Y < this.nCol - 1 )
            {
                this.CurPos_Y++;
            }
            else if(this.CurPos_X < this.nRow - 1)
            {
                this.CurPos_X++;
                this.CurPos_Y = 0;
            }
            else
            {
                bUpperLevel = true;
                break;
            }
        } while( this.elements[this.CurPos_X][this.CurPos_Y].IsJustDraw() );

        var SelectContent;
        if( bUpperLevel )
        {
            SelectContent = this.Parent.goToRight();
        }
        else
        {
            SelectContent = this.elements[this.CurPos_X][this.CurPos_Y].goToFirstElement();
        }

        return SelectContent;
    },
    goToLeftSelect: function(bParent)
    {
        var content;

        if(bParent == SELECT_PARENT)
            content = this.Parent.goToLeftSelect(bParent);
        else
            content = this.elements[this.CurPos_X][this.CurPos_Y].goToLeftSelect(bParent);

        return content;
    },
    goToRightSelect: function(bParent)
    {
        var content;

        if(bParent == SELECT_PARENT)
            content = this.Parent.goToRightSelect(bParent);
        else
            content = this.elements[this.CurPos_X][this.CurPos_Y].goToRightSelect(bParent);

        return content;
    },*/
    getGapsInside: function(RecalcInfo)
    {
        var kind = this.kind;
        var gaps = {left: 0, right: 0};
        var checkBase = kind == MATH_DEGREE || kind == MATH_DEGREESubSup || kind == MATH_ACCENT || kind == MATH_RADICAL|| kind == MATH_BOX || kind == MATH_BORDER_BOX;

        if(checkBase)
        {
            var base = this.getBase();
            gaps = base.getGapsInside(RecalcInfo);
        }

        return gaps;
    },
    WriteContentsToHistory: function()
    {
        for(var i = 0; i < this.nRow; i++)
        {
            for(var j = 0; j < this.nCol; j++)
            {
                var Pos = {row: i, column: j};
                History.Add(this, {Type: historyitem_Math_AddItem, Items: this.elements[i][j], Pos: Pos});
            }
        }

    },
    /// Position for Paragraph
    Get_ParaContentPosByXY: function(SearchPos, Depth, _CurLine, _CurRange, StepEnd)
    {
        /// элементов just-draw не должно прийти

        var disp = this.findDisposition({ x: SearchPos.X - this.GapLeft, y: SearchPos.Y});


        var pos = disp.pos;

        SearchPos.Pos.Update(pos.x, Depth);
        SearchPos.Pos.Update(pos.y, Depth+1);

        Depth +=2;


        SearchPos.X = disp.mCoord.x;
        SearchPos.Y = disp.mCoord.y;


        this.elements[disp.pos.x][disp.pos.y].Get_ParaContentPosByXY(SearchPos, Depth, _CurLine, _CurRange, StepEnd);
    },
    Get_ParaContentPos: function(bSelection, bStart, ContentPos)
    {
        if( bSelection )
        {
            //var SelectX, SelectY;

            var oSelect;

            if(bStart)
            {
                //SelectX = this.SelectStart_X;
                //SelectY = this.SelectStart_Y;

                oSelect = this.SelectStart;

                //SelectX = this.SelectStart.X;
                //SelectY = this.SelectStart.Y;
            }
            else
            {
                oSelect = this.SelectEnd;

                //SelectX = this.SelectEnd.X;
                //SelectY = this.SelectEnd.Y;
            }

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

        if(this.elements[CurPos_X][CurPos_Y].IsJustDraw())
        {
            var disp = this.excludeJDElement(CurPos_X, CurPos_Y);
            this.CurPos_X = disp.x;
            this.CurPos_Y = disp.y;
        }
        else
        {
            this.CurPos_X = CurPos_X;
            this.CurPos_Y = CurPos_Y;
        }

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

            if(startX == endX && startY == endY && !bJustDraw)
            {
                this.elements[startX][startY].Set_SelectionContentPos(StartContentPos, EndContentPos, Depth, StartFlag, EndFlag);
            }
            else
            {
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
        return (!this.SelectStart.bOutside && !this.SelectEnd.bOutside) && (this.SelectStart.X == this.SelectEnd.X) && (this.SelectStart.Y == this.SelectEnd.Y);
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
        SelectionDraw.W += this.size.width;
        SelectionDraw.FindStart = false;
    },
    SetRunEmptyToContent: function(bAll)
    {
        for(var i=0; i < this.nRow; i++)
            for(var j = 0; j < this.nCol; j++)
                if(!this.elements[i][j].IsJustDraw())
                    this.elements[i][j].SetRunEmptyToContent(bAll);
    },
    Selection_Remove: function()
    {
        var start_X = this.SelectStart.X,
            start_Y = this.SelectStart.Y;

        if(!this.SelectStart.bOutside)
            this.elements[start_X][start_Y].Selection_Remove();

        this.bSelectionUse = false;
    },
    IsCurrentPlh:   function()
    {
        return this.elements[this.CurPos_X][this.CurPos_Y].IsCurrentPlh();
    },
    SetGaps:  function(Parent, ParaMath, RecalcInfo)
    {
        this.Parent = Parent;
        this.ParaMath = ParaMath;

        RecalcInfo.Left = RecalcInfo.Current;
        RecalcInfo.leftRunPrp = RecalcInfo.currRunPrp;


        RecalcInfo.Current = this;
        RecalcInfo.currRunPrp = this.Get_CompiledCtrPrp();

        RecalcInfo.setGaps();

    },
    ApplyGaps: function()
    {
        this.size.width += this.GapLeft + this.GapRight;
    },
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

        /*var str = "Start: Outside " + this.SelectStart.bOutside + ", X " + this.SelectStart.X + ", Y " + this.SelectStart.Y + " ; "  + "End: Outside " + this.SelectEnd.bOutside +  ", X " + this.SelectEnd.X + ", Y " + this.SelectEnd.Y;
        console.log(str);*/

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

        var NewObj = new this.constructor();
        NewObj.init(props);
        NewObj.argSize = this.argSize;

        //NewObj.Composition = Composition;
        var CtrPrp = this.CtrPrp.Copy();

        NewObj.setCtrPrp(CtrPrp);

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

        while(start_x < this.nCol && start_y < this.nRow && (TextPr == null || this.elements[start_x][start_y].IsJustDraw() ))
        {
            if(!this.elements[start_x][start_y].IsJustDraw())
                TextPr = this.elements[start_x][start_y].Get_CompiledTextPr(Copy, true);

            start_y++;

            if(start_y >= this.nCol)
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
                    var CurTextPr = this.elements[i][j].Get_CompiledTextPr(false, true);

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
        if(TextPr.FontSize !== undefined)
        {
            History.Add( this, { Type : historyitem_Math_CtrPrpFSize, New : TextPr.FontSize, Old : this.CtrPrp.FontSize } );
            this.CtrPrp.FontSize = TextPr.FontSize;
            this.RecalcInfo.bCtrPrp = true;
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
    SelectToParent: function()
    {
        this.bSelectionUse = true;
        this.Parent.SelectToParent();
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
        var type = Data.Type;

        switch(type)
        {
            case historyitem_Math_CtrPrpFSize:
            {
                this.CtrPrp.FontSize = Data.Old;
                this.RecalcInfo.bCtrPrp = true;

                break;
            }
        }
    },
    Redo: function(Data)
    {
        var type = Data.Type;

        switch(type)
        {
            case historyitem_Math_CtrPrpFSize:
            {
                this.CtrPrp.FontSize = Data.New;
                this.RecalcInfo.bCtrPrp = true;

                break;
            }
        }
    },
    Refresh_RecalcData: function()
    {
        if(this.ParaMath !== null)
            this.ParaMath.Refresh_RecalcData(); // Refresh_RecalcData сообщает родительскому классу, что у него произошли изменения, нужно пересчитать
    },
    Save_Changes: function(Data, Writer)
    {

    },
    Load_Changes : function(Reader)
    {

    }

    //////////////////////////
}
