function CTrigFunc(num)
{
    if(num != num + 0 || num < 0 || num > 14)
        return;

    this.num = num;
    //CSubMathBase.call(this, 1, 2);
    CMathBase.call(this, 1,2);

}
//extend(CTrigFunc,CSubMathBase);
extend(CTrigFunc, CMathBase);
CTrigFunc.prototype.setContent = function()
{
    var oFunc = new CMathContent();
    var GParms = Common_CopyObj(this.params);
    GParms.bMText = false;

    oFunc.init(GParms);
    oFunc.setContent.apply(oFunc, NameFunctions.trig[this.num] );

    var oArg  = new CMathContent();
    oArg.init(this.params);
    oArg.fillPlaceholders();

    CTrigFunc.superclass.setContent.call(this, oFunc, oArg);
}
CTrigFunc.prototype.setDistance = function()
{
    //todo
    //переделать!
    this.dW = slashWidth(this.params.font);
    this.dH = 0;
}
CTrigFunc.prototype.getFunction = function()
{
    return this.elemens[0][0];
}
CTrigFunc.prototype.getArgument = function()
{
    return this.elemens[0][1];
}
