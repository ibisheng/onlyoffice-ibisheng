function CMathMatrix( numRow, numCol)
{
    CMathBase.call(this, numRow, numCol);
    this.lineGapColumn = 1.5;
    this.lineGapRow = 1;
    this.gaps = null;

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

    this.baseJc = 0;

}
extend(CMathMatrix, CMathBase);
CMathMatrix.prototype.init = function(params)
{
    this.params = Common_CopyObj(params);
}
CMathMatrix.prototype.setContent = function()
{
    CMathMatrix.superclass.fillPlaceholders.call(this);
}

CMathMatrix.prototype.old_getLineGap = function(spaceLine)
{
    var metrs = this.params.font.metrics;
    var textHeight =  metrs.Height;
    var t = 0;
    if(spaceLine >= 2)
        t = metrs.Height;
    else
        t = metrs.Height - metrs.Placeholder.Height;

    return textHeight*(spaceLine - 1) + t;
}
CMathMatrix.prototype.old_recalculateSize = function()
{
    this.gaps = {row: new Array(), column: new Array()};

    var interval = this.getLineGap(this.lineGapColumn);
    this.gaps.column[0] = 0;
    for(var i = 0; i < this.nCol - 1; i++)
        this.gaps.column[i + 1] = interval ;

    interval = this.getLineGap( this.lineGapRow );
    var simpleGap = this.getLineGap(1),
        divCenter = 0;

    var metrics = this.getMetrics();

    this.gaps.row[0] = 0;
    for(var j = 0; j < this.nRow - 1; j++)
    {
        divCenter = metrics.descents[j] + metrics.ascents[j + 1] + simpleGap;
        this.gaps.row[j + 1] = divCenter > interval ? simpleGap : interval -  metrics.descents[j] - metrics.ascents[j + 1];
    }

    var height = 0, width = 0;

    for(var i = 0; i< this.nCol; i++)
        width +=  this.gaps.column[i] + metrics.widths[i];

    for(var j = 0; j < this.nRow; j++)
        height += this.gaps.row[j] + metrics.ascents[j] + metrics.descents[j];

    this.size = {width: width, height: height, center: height/2};

}
CMathMatrix.prototype.old_setLineGapColumn = function(coeff)
{
    this.lineGapColumn = coeff;
    this.recalculateSize();
}
CMathMatrix.prototype.old_setLineGapRow = function(coeff)
{
    this.lineGapRow = coeff;
    this.recalculateSize();
}

CMathMatrix.prototype.recalculateSize = function()
{
    this.gaps = {row: new Array(), column: new Array()};

    var interval = this.getLineGap(this.spaceColumn);
    this.gaps.column[0] = 0;
    for(var i = 0; i < this.nCol - 1; i++)
        this.gaps.column[i + 1] = interval;

    interval = this.getRowSpace(this.spaceRow);

    var divCenter = 0;
    var metrics = this.getMetrics();

    var minGp = this.spaceRow.minGap*this.params.font.FontSize*g_dKoef_pt_to_mm;
    minGp -= this.params.font.metrics.Placeholder.Height;
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
        center = height/2;

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

CMathMatrix.prototype.old_old_findDisposition = function( coord )
{
    var pos_x = this.nRow - 1, pos_y = this.nCol - 1,
        w = 0, h = 0;

    var maxWH = this.getWidthsHeights();
    var Widths = maxWH.widths;
    var Heights = maxWH.heights;

    for(var i = 0; i < this.nCol; i++)
    {
        w += Widths[i] + this.gaps.column[i + 1]/2;
        if(coord.x < w)
        {
            pos_y = i;
            break;
        }
        w += this.gaps.column[i + 1]/2;
    }

    for(var j = 0; j < this.nRow; j++)
    {
        h += Heights[j] + this.gaps.row[j + 1]/2;
        if(coord.y < h)
        {
            pos_x = j;
            break;
        }

        h += this.gaps.row[j + 1]/2;
    }

    ////////////////////////////////

    var sumWidth = 0;
    var sumHeight = 0;
    
    for(var t = 0; t < pos_y; t++)
        sumWidth += Widths[t] + this.gaps.column[t + 1];
    for(t = 0; t < pos_x; t++)
        sumHeight += Heights[t] + this.gaps.row[t + 1];

    // флаг для случая, когда выходим за границы элемента и есть выравнивание относительно других элементов
    var flag = true;

    if( pos_x != null && pos_y != null)
    {
        var size = this.elements[pos_x][pos_y].size;
        var align = this.align(pos_x, pos_y);
        if(coord.x < ( sumWidth + align.x ))
        {
            mX = 0;
            flag = false;
        }
        else if( coord.x > (sumWidth + align.x + size.width ))
        {
            mX = size.width;
            flag = false;
        }
        else
            mX = coord.x - ( sumWidth + align.x );

        if(coord.y < (sumHeight + align.y))
            mY = 0;
        else if( coord.y > ( sumHeight + align.y + size.height ) )
            mY = size.height;
        else
            mY = coord.y - ( sumHeight + align.y );
    }

    return {pos: {x: pos_x, y: pos_y }, mCoord: {x: mX, y: mY}, flag: flag};

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
        this.elements[this.nRow-1][j].init(this.params);
        this.elements[this.nRow-1][j].relate(this);
        this.elements[this.nRow-1][j].fillPlaceholders();
    }

    //this.setDistance();
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
    if(minGap != null && typeof(minGap) !== "undefined")
        this.spaceColumn.minGap = minGap;
}
CMathMatrix.prototype.getLineGap = function(space)
{
    var spLine;

    if(space.rule == 0)
        spLine = 1;             //em
    else if(space.rule == 1)
        spLine = 1.5;           //em
    else if(space.rule == 2)
        spLine = 2;             //em
    else if(space.rule == 3)
        spLine = space.gap/20;  //pt
    else if(space.rule == 4)
        spLine = space.gap/2;   //em
    else
        spLine = 1;

    var lineGap;

    if(space.rule == 3)
        lineGap = spLine*g_dKoef_pt_to_mm;                           //pt
    else
        lineGap = spLine*this.params.font.FontSize*g_dKoef_pt_to_mm; //em

    var min = space.minGap / 20 * g_dKoef_pt_to_mm - this.params.font.metrics.Placeholder.Width;
    lineGap = Math.max(lineGap, min);
    //lineGap += this.params.font.metrics.Placeholder.Height; // для случая, когда gapRow - (аскент + дескент) > minGap, вычитаем из gap строки, а здесь прибавляем стандартный metrics.Height

    return lineGap;
}

CMathMatrix.prototype.old_getRowSpace = function(space)
{
    var spLine;

    if(space.rule == 0)
        spLine = 840 / 20;            //pt
    else if(space.rule == 1)
        spLine = 840*1.5 /20;           //em
    else if(space.rule == 2)
        spLine = 840*2 /20;             //em
    else if(space.rule == 3)
        spLine = space.gap/20;  //pt
    else if(space.rule == 4)
        spLine = space.gap/2;   //em
    else
        spLine = 1;

    //minGap = 780
    var lineGap;

    /*if(space.rule == 3)
     lineGap = spLine*g_dKoef_pt_to_mm;                           //pt
     else
     lineGap = spLine*this.params.font.FontSize*g_dKoef_pt_to_mm; //em*/

    lineGap = spLine*g_dKoef_pt_to_mm;                           //pt

    lineGap = Math.max(lineGap, space.minGap*this.params.font.FontSize*g_dKoef_pt_to_mm);

    return lineGap;
}
CMathMatrix.prototype.getRowSpace = function(space)
{
    var spLine;

    if(space.rule == 0)
        spLine = 7 /6;                 //em
    else if(space.rule == 1)
        spLine = 7 /6 *1.5;            //em
    else if(space.rule == 2)
        spLine = 7 /6 *2;              //em
    else if(space.rule == 3)
        spLine = space.gap/20;         //pt
    else if(space.rule == 4)
        spLine = 7/6 * space.gap/2;    //em
    else
        spLine = 7 /6;

    var lineGap;

    if(space.rule == 3)
        lineGap = spLine*g_dKoef_pt_to_mm;                           //pt
    else
        lineGap = spLine*this.params.font.FontSize*g_dKoef_pt_to_mm; //em


    var min = space.minGap*this.params.font.FontSize*g_dKoef_pt_to_mm;
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

