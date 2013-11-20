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
