function CMinimax(num)
{
    CSubMathBase.call(this, 1, 2);
    if(this.num !== this.num - 0 && this.num < 0 && this.num > 2)
        this.num = 0;
    else
        this.num = num;

}
extend(CMinimax, CSubMathBase);
CMinimax.prototype.setContent = function()
{
    var oBase = new CMathContent();
    var GParams = Common_CopyObj(this.params);
    GParams.bMText = false;
    oBase.init(GParams);
    oBase.relate(this);
    oBase.addText(NameFunctions[this.num]);

    var oIter = new CMathBase(1,1);
    GParams = Common_CopyObj(this.params);
    GParams.font = getTypeDegree(this.params.font);
    oIter.init(GParams);
    oIter.relate(this);
    oIter.fillPlaceholders();

    var oFunc = new CMathBase(2, 1);
    oFunc.getCenter = function() { return this.elements[0][0].size.center; };
    oFunc.init(this.params);
    oFunc.relate(this);
    oFunc.setContent(oBase, oIter);

    var oArg = new CMathBase(1, 1);
    oArg.init(this.params);
    oArg.relate(this);
    oArg.fillPlaceholders();

    CMinimax.superclass.setContent.call(this, oFunc, oArg);

}
CMinimax.prototype.setDistance = function()
{
    //todo
    //переделать !
    this.dW = slashWidth(this.params.font);
    this.dH = 0;
}
