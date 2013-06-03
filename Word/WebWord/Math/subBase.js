function CSubMathBase(countRow, countCol)
{
    CMathBase.call(this, countRow, countCol );
}
extend(CSubMathBase, CMathBase);

/*CSubMathBase.prototype.remove = function()
{
    var result = this.elements[this.CurPos_X][this.CurPos_Y].remove();

    this.recalculateSize();

    return result;
}*/
//выставим позиции каждого элемента, для того, чтобы не вычесть лишний раз "центр" объекта
/*CSubMathBase.prototype.setPosition = function(pos)
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
CSubMathBase.prototype.mouseMove = function( mCoord )
{
    var res = true;
    var elem = this.findDisposition( mCoord);

    if(elem.pos.x == this.CurPos_X && elem.pos.y == this.CurPos_Y && elem.flag === true )
        res = this.elements[this.CurPos_X][this.CurPos_Y].mouseMove(elem.mCoord);
    else
        res = false;

    return res;
}


function Fraction()
{
    this.type = 0;
}
Fraction.prototype =
{
    GetProperty: function()
    {

    }

}

function Degree()
{
    this.type = 1;
}
function Nary()
{
    this.type = 2;
}
function Trigonometric()
{
    this.type = 3;
}
function Minimax()
{
    this.type = 3;
}


