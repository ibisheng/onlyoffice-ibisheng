function CSubMathBase()
{
    CMathBase.call(this);
}
extend(CSubMathBase, CMathBase);
CSubMathBase.prototype.mouseMove = function( mCoord )
{
    var elem = this.findDisposition( mCoord);
    var state = true,
        SelectContent = null;

    if(elem.pos.x == this.CurPos_X && elem.pos.y == this.CurPos_Y && elem.inside_flag === -1 )
    {
        movement = this.elements[this.CurPos_X][this.CurPos_Y].mouseMove(elem.mCoord);
        SelectContent = movement.SelectContent;
        state = movement.state;
    }
    else
    {
        state = false;
    }

    return {state: state, SelectContent: SelectContent};
}


function old_CSubMathBase(countRow, countCol)
{
    CMathBase.call(this, countRow, countCol );
}
extend(old_CSubMathBase, CMathBase);

/*old_CSubMathBase.prototype.remove = function()
 {
 var result = this.elements[this.CurPos_X][this.CurPos_Y].remove();

 this.recalculateSize();

 return result;
 }*/
//выставим позиции каждого элемента, для того, чтобы не вычесть лишний раз "центр" объекта
/*old_CSubMathBase.prototype.setPosition = function(pos)
 {
 this.pos = pos;
 var w = 0;
 var h = 0;
 var maxWH = this.getWidthsHeights();
 for(var i=0; i < this.nRow; i++)
 {
 w = 0;
 for(var j = 0 ; j < this.nCol; j++)
 {
 this.elements[i][j].setPosition( {x: this.pos.x + this.dW*j + w , y: this.pos.y + this.dH*i + h } );
 w += maxWH.widths[j];
 }
 h += maxWH.heights[i];
 }
 }*/
old_CSubMathBase.prototype.old_mouseMove = function( mCoord )
{
    var res = true;
    var elem = this.findDisposition( mCoord);

    if(elem.pos.x == this.CurPos_X && elem.pos.y == this.CurPos_Y && elem.inside_flag === -1 )
        res = this.elements[this.CurPos_X][this.CurPos_Y].mouseMove(elem.mCoord);
    else
        res = false;

    return res;
}

old_CSubMathBase.prototype.mouseMove = function( mCoord )
{
    var elem = this.findDisposition( mCoord);
    var state = true,
        SelectContent = null;

    if(elem.pos.x == this.CurPos_X && elem.pos.y == this.CurPos_Y && elem.inside_flag === -1 )
    {
        movement = this.elements[this.CurPos_X][this.CurPos_Y].mouseMove(elem.mCoord);
        SelectContent = movement.SelectContent;
        state = movement.state;
    }
    else
    {
        state = false;
    }

    return {state: state, SelectContent: SelectContent};
}