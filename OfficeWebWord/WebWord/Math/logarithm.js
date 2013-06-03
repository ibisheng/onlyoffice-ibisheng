var NameFunctions = ["min", "max", "lim", "log", "ln", "sin", "cos", "tg", "ctg", "ch", "sh", "th", "cth", "sec", "csc", "cot", "csch", "sech", "coth"];
var Diff = ["dx","dy","dθ"];

function CLogarithm()
{
    CSubMathBase.call(this,1,2);
}
extend(CLogarithm, CSubMathBase);
CLogarithm.prototype.setContent = function()
{
    var oBase = new CMathContent();
    var GParams = Common_CopyObj(this.params);
    GParams.bMText = false;
    oBase.init(GParams);
    oBase.relate(this);
    oBase.addText(NameFunctions[3]);
    //oBase.setContent.apply(oBase, NameFunctions.minimax[3] );


    var oFunc = new CDegreeOrdinary(-1);
    oFunc.init(this.params);
    oFunc.relate(this);
    oFunc.setContent(oBase); //здесь выставляется для Base, что родительский класс CDegree...

    //todo
    //проверить !!!
    //var oArg = new CMathBase(1, 1);
    var oArg = new CMathContent();
    oArg.init(this.params);
    oArg.relate(this);
    oArg.fillPlaceholders();

    CLogarithm.superclass.setContent.call(this, oFunc, oArg);
}

function CMathFunc(num)
{
    if(num > 19)
        return;

    this.num = num;
    CMathBase.call(this, 1,2);

}
//extend(CMathFunc,CSubMathBase);
extend(CMathFunc, CMathBase);
CMathFunc.prototype.setContent = function()
{
    var oFunc = new CMathContent();
    var GParms = Common_CopyObj(this.params);
    GParms.bMText = false;

    oFunc.init(GParms);
    oFunc.addText(NameFunctions[this.num]);

    var oArg  = new CMathContent();
    oArg.init(this.params);
    oArg.fillPlaceholders();

    CMathFunc.superclass.setContent.call(this, oFunc, oArg);
}
CMathFunc.prototype.setDistance = function()
{
    //todo
    //переделать!
    this.dW = slashWidth(this.params.font);
    this.dH = 0;
}
CMathFunc.prototype.addText = function(txt)
{
    this.elements[0][1].addText(txt);
}

function CDifferential(num)
{
    this.num = num;
    CSubMathBase.call(this, 1,1);
}
extend(CDifferential, CSubMathBase);
CDifferential.prototype.setContent = function()
{
    var oDiff = new CMathContent();
    oDiff.init(this.params);
    oDiff.addText(Diff[this.num]);

    CMathFunc.superclass.setContent.call(this, oDiff);
}