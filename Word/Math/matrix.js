function CMathMatrix()
{
    this.lineGapColumn = 1.5;
    this.lineGapRow = 1;
    this.gaps = null;
    this.plcHide = false;

    this.spaceRow =
    {
        rule: 0,
        gap: 0,
        minGap: 13/12    //em
                         // 780 /20 (pt) for font 36 pt
    };
    this.spaceColumn =
    {
        rule: 0,
        gap: 0,
        minGap: 0       // minGap / 20 pt
    };

    this.plcHide = false;
    this.baseJc = 0;
    this.gaps =
    {
        row: new Array(),
        column: new Array()
    };

    CMathBase.call(this);
}
extend(CMathMatrix, CMathBase);
CMathMatrix.prototype.old_init = function(countRow, countCol)
{
    this.setDimension(countRow, countCol);
    this.setContent();
}
CMathMatrix.prototype.init = function(props)
{
    this.setDimension(props.row, props.column);
    this.setContent();

    if(typeof(props.baseJc) !== "undefined" && props.baseJc !== null)
    {
        if(props.baseJc === "center")
            this.baseJc = MATRIX_CENTER;
        else if(props.baseJc === "top")
            this.baseJc = MATRIX_TOP;
        else if(props.baseJc === "bottom")
            this.baseJc = MATRIX_BOTTOM;
    }

    this.setRuleGap(this.spaceColumn, props.cGpRule, props.cGp, props.cSp);
    this.setRuleGap(this.spaceRow, props.rSpRule, props.rSp);

    if(props.plcHide === true)
    {
        this.plcHide = true;
        this.hidePlaceholder(true);
    }

    //if(props.)


    /*if(props.cGpRule !== "undefined" && props.cGpRule !== null)
    {
        this.setRuleGap(this.spaceColumn, props.cGpRule, props.cGp);


        *//*this.spaceColumn.value = 0;

        if(props.cGpRule == 0)
            this.spaceColumn.rule = 0;
        else if(props.cGpRule == 1)
            this.spaceColumn.rule = 1;
        else if(props.cGpRule == 2)
            this.spaceColumn.rule = 2;
        else if(props.cGpRule == 3)
        {
            this.spaceColumn.rule = 3;

            if(props.cGp !== "undefined" || props.cGp !== null)
                this.spaceColumn.value = props.cGp;
        }
        else if(props.cGpRule == 4)
        {
            this.spaceColumn.rule = 4;

            if(props.cGp !== "undefined" || props.cGp !== null)
                this.spaceColumn.value = props.cGp;
        }
        else
            this.spaceColumn.rule = 0;*//*
    }

    if(props.rSpRule !== "undefined" && props.rSpRule !== null)
    {
        // если rSpRule не выставлено, то какое выставлено rSp не имеет значение
        this.setRuleGap(this.spaceRow, props.rSpRule, props.rSp);
    }*/
}
CMathMatrix.prototype.setRuleGap = function(space, rule, gap, minGap)
{
    var bInt  =  rule == rule - 0 && rule == rule^ 0,
        bRule =  rule >= 0 && rule <= 4;

    if(bInt && bRule)
        space.rule = rule;
    else
        space.rule = 0;


    if(gap == gap - 0 && gap == gap^0)
        space.value = gap;
    else
        space.value = 0;

    if(minGap == minGap - 0 && minGap == minGap^0)
        space.minGap = gap;
    else
        space.minGap = 0;


    /*var Value = 0, Rule;

    if(rule == 0)
        Rule = 0;
    else if(rule == 1)
        Rule = 1;
    else if(rule == 2)
        Rule = 2;
    else if(rule == 3)
    {
        Rule = 3;

        if(gap !== "undefined" || gap !== null)
            Value = gap;
    }
    else if(rule == 4)
    {
        Rule = 4;

        if(gap !== "undefined" || gap !== null)
            Value = gap;
    }
    else
        Rule = 0;

    space.rule = Rule;
    space.value = Value;*/

}
CMathMatrix.prototype.recalculateSize = function()
{
    var txtPrp = this.getTxtPrp();

    var interval = this.getLineGap(txtPrp);
    this.gaps.column[0] = 0;
    for(var i = 0; i < this.nCol - 1; i++)
        this.gaps.column[i + 1] = interval;

    interval = this.getRowSpace(txtPrp);

    var divCenter = 0;
    var metrics = this.getMetrics();

    var plH = 0.2743827160493827 * txtPrp.FontSize;
    var minGp = this.spaceRow.minGap*txtPrp.FontSize*g_dKoef_pt_to_mm;
    minGp -= plH;
    this.gaps.row[0] = 0;
    for(var j = 0; j < this.nRow - 1; j++)
    {
        divCenter = interval - (metrics.descents[j] + metrics.ascents[j + 1]);
        this.gaps.row[j + 1] = minGp > divCenter ? minGp : divCenter;
    }

    var height = 0, width = 0;

    for(var i = 0; i< this.nCol; i++)
        width +=  this.gaps.column[i] + metrics.widths[i];

    for(var j = 0; j < this.nRow; j++)
        height += this.gaps.row[j] + metrics.ascents[j] + metrics.descents[j];

    var center = 0;

    if(this.baseJc == 1)
    {
        for(var j = 0; j < this.nCol; j++)
            center = this.elements[0][j].size.center > center ? this.elements[0][j].size.center : center;
    }
    else if(this.baseJc == 2)
    {
        var descent = 0,
            currDsc;
        for(var j = 0; j < this.nCol; j++)
        {
            currDsc = this.elements[this.nRow -1][j].size.height - this.elements[this.nRow -1][j].size.center;
            descent = currDsc > descent ? currDsc : descent;

            center = height - descent;
        }
    }
    else /*this.baseJc == 0*/
        center = this.getCenter(height);
        //center = height/2;

    this.size = {width: width, height: height, center: center};

}
CMathMatrix.prototype.setPosition = function(pos)
{
    if(this.bMObjs === true)
        this.pos = pos;
    else
        this.pos = {x: pos.x, y: pos.y - this.size.center}; ///!!!!!!!!!!!!!!!!!!!!!!!!!!

    var maxWH = this.getWidthsHeights();
    var Widths = maxWH.widths;
    var Heights = maxWH.heights;

    var h = 0, w = 0;

    for(var i=0; i < this.nRow; i++)
    {
        w = 0;
        for(var j = 0; j < this.nCol; j++)
        {
            var al = this.align(i, j);
            this.elements[i][j].setPosition( {x: this.pos.x + al.x + this.gaps.column[j] + w , y: this.pos.y + al.y + this.gaps.row[i] + h  } );
            w += Widths[j] + this.gaps.column[j];
        }
        h += Heights[i] + this.gaps.row[i];
    }

}
CMathMatrix.prototype.findDisposition = function( coord )
{
    var mouseCoord = {x: null, y: null},
        posCurs =    {x: this.nRow - 1, y: this.nCol - 1};

    var maxWH = this.getWidthsHeights();
    var Widths = maxWH.widths;
    var Heights = maxWH.heights;

    for(var i = 0, w = 0; i < this.nCol; i++)
    {
        w += Widths[i] + this.gaps.column[i + 1]/2;
        if(coord.x < w)
        {
            posCurs.y = i;
            break;
        }
        w += this.gaps.column[i + 1]/2;
    }

    for(var j = 0, h = 0; j < this.nRow; j++)
    {
        h += Heights[j] + this.gaps.row[j + 1]/2;
        if(coord.y < h)
        {
            posCurs.x = j;
            break;
        }
        h += this.gaps.row[j + 1]/2;
    }

    ////////////////////////////////

    var sumWidth = 0;
    var sumHeight = 0;

    for(var t = 0; t < posCurs.y; t++)
        sumWidth += Widths[t] + this.gaps.column[t + 1];
    for(t = 0; t < posCurs.x; t++)
        sumHeight += Heights[t] + this.gaps.row[t + 1];

    // флаг для случая, когда выходим за границы элемента и есть выравнивание относительно других элементов
    var inside_flag = -1;

    if( posCurs.x != null && posCurs.y != null)
    {
        var size = this.elements[posCurs.x][posCurs.y].size;
        var align = this.align(posCurs.x, posCurs.y);
        if(coord.x < ( sumWidth + align.x ))
        {
            mouseCoord.x = 0;
            inside_flag = 0;
        }
        else if( coord.x > (sumWidth + align.x + size.width ))
        {
            mouseCoord.x = size.width;
            inside_flag = 1;
        }
        else
            mouseCoord.x = coord.x - ( sumWidth + align.x );

        if(coord.y < (sumHeight + align.y))
        {
            mouseCoord.y = 0;
            inside_flag = 2;
        }
        else if( coord.y > ( sumHeight + align.y + size.height ) )
        {
            mouseCoord.y = size.height;
            inside_flag = 2;
        }
        else
            mouseCoord.y = coord.y - ( sumHeight + align.y );
    }

    return {pos: posCurs, mCoord: mouseCoord, inside_flag: inside_flag};
}
CMathMatrix.prototype.getMetrics = function()
{
    var Ascents = [];
    var Descents = [];
    var Widths = [];

    for(tt = 0; tt < this.nRow; tt++ )
    {
        Ascents[tt] = 0;
        Descents[tt] = 0;
    }
    for(var tt = 0; tt < this.nCol; tt++ )
        Widths[tt] = 0;

    for(var i=0; i < this.nRow; i++)
        for(var j = 0; j < this.nCol ; j++)
        {
            var size = this.elements[i][j].size;
            Widths[j] = ( Widths[j] > size.width ) ? Widths[j] : size.width;
            Ascents[i] = (Ascents[i] > size.center ) ? Ascents[i] : size.center;
            Descents[i] = (Descents[i] > size.height - size.center ) ? Descents[i] : size.height - size.center;
        }

    return {ascents: Ascents, descents: Descents, widths: Widths}
}
CMathMatrix.prototype.findDistance = function() // для получения позиции тагета
{
    var w = 0, h = 0;
    //кол-во элементов gap равно кол-ву элементов в строке/столбце для удобства подсчета
    for(var i = 0; i <= this.CurPos_X; i++)
        w += this.gaps.column[i];

    for(var j = 0; j <= this.CurPos_Y; j++)
        h += this.gaps.row[j];

    return {w : w, h: h };
}

////  open  ////
CMathMatrix.prototype.addRow = function()
{
    this.nRow++;

    for(var j = 0; j < this.nCol; j++)
    {
        this.elements[this.nRow-1][j] = new CMathContent();
        this.elements[this.nRow-1][j].relate(this);
        this.elements[this.nRow-1][j].setReduct(this.reduct);
        //this.elements[this.nRow-1][j].setComposition(this.Composition);
    }

    this.recalculateSize();
}

CMathMatrix.prototype.setRowGapRule = function(rule, gap)
{
    this.spaceRow.rule = rule;
    this.spaceRow.gap = gap;
}
CMathMatrix.prototype.setColumnGapRule = function(rule, gap, minGap)
{
    this.spaceColumn.rule = rule;
    this.spaceColumn.gap = gap;
    if(minGap !== null && typeof(minGap) !== "undefined")
        this.spaceColumn.minGap = minGap;
}
CMathMatrix.prototype.getLineGap = function(txtPrp)
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
}
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
}
CMathMatrix.prototype.baseJustification = function(type)
{

    // 0 - center
    // 1 - top
    // 2 - bottom

    this.baseJc = type;

}
////

