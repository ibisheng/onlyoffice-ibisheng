function CMathMatrix( numRow, numCol)
{
    CMathBase.call(this, numRow, numCol);
    this.lineGapColumn = 1.5;
    this.lineGapRow = 1;
    this.gaps = null;

}
extend(CMathMatrix, CMathBase);
CMathMatrix.prototype.setContent = function()
{
    CMathMatrix.superclass.fillPlaceholders.call(this);
}
CMathMatrix.prototype.getLineGap = function(spaceLine)
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
CMathMatrix.prototype.setLineGapColumn = function(coeff)
{
    this.lineGapColumn = coeff;
    this.recalculateSize();
}
CMathMatrix.prototype.setLineGapRow = function(coeff)
{
    this.lineGapRow = coeff;
    this.recalculateSize();
}
CMathMatrix.prototype.recalculateSize = function()
{
    this.gaps = {row: new Array(), column: new Array()};

    var interval = this.getLineGap(this.lineGapColumn);
    this.gaps.column[0] = 0;
    for(var i = 0; i < this.nCol - 1; i++)
        this.gaps.column[i + 1] = interval;

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
CMathMatrix.prototype.old_findDisposition = function( coord )
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
    var flag = true;

    if( posCurs.x != null && posCurs.y != null)
    {
        var size = this.elements[posCurs.x][posCurs.y].size;
        var align = this.align(posCurs.x, posCurs.y);
        if(coord.x < ( sumWidth + align.x ))
        {
            mouseCoord.x = 0;
            flag = false;
        }
        else if( coord.x > (sumWidth + align.x + size.width ))
        {
            mouseCoord.x = size.width;
            flag = false;
        }
        else
            mouseCoord.x = coord.x - ( sumWidth + align.x );

        if(coord.y < (sumHeight + align.y))
            mouseCoord.y = 0;
        else if( coord.y > ( sumHeight + align.y + size.height ) )
            mouseCoord.y = size.height;
        else
            mouseCoord.y = coord.y - ( sumHeight + align.y );
    }

    return {pos: posCurs, mCoord: mouseCoord, flag: flag};
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
CMathMatrix.prototype.findDistance = function()
{
    var w = 0, h = 0;
    //кол-во элементов gap равно кол-ву элементов в строке/столбце для удобства подсчета
    for(var i = 0; i <= this.CurPos_X; i++)
        w += this.gaps.column[i];

    for(var j = 0; j <= this.CurPos_Y; j++)
        h += this.gaps.row[j];

    return {w : w, h: h };
}

