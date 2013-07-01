//var NameFunctions = ["min", "max", "lim", "log", "ln", "sin", "cos", "tg", "ctg", "ch", "sh", "th", "cth", "sec", "csc", "cot", "csch", "sech", "coth"];
//var NameFunctions = ["min", "max", "lim", "log", "ln", "sin", "cos", "tan", "ctg", "cosh", "sinh", "tanh", "cth", "sec", "csc", "cot", "csch", "sech", "coth"];
//var Diff = ["dx","dy","dθ"];

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
    oBase.addText("log");
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
CLogarithm.prototype.getFunction = function()
{
    return this.elements[0][0].getBase();
}
CLogarithm.prototype.getBase = function()
{
    return this.elements[0][0].getIterator();
}
CLogarithm.prototype.getArgument = function()
{
    return this.elements[0][1];
}

function CMinimaxFunc(num)
{
    this.num = num;
    CMathBase.call(this, 2, 1);
}
extend(CMinimaxFunc, CMathBase);
CMinimaxFunc.prototype.setContent = function()
{
    var oBase = new CMathContent();
    var GParams = Common_CopyObj(this.params);
    GParams.bMText = false;
    oBase.init(GParams);
    oBase.relate(this);

    if(this.num == 0)
        oBase.addText("min");
    else if(this.num == 1)
        oBase.addText("max");
    else
        oBase.addText("lim");

    var oIter = new CMathContent();
    GParams = Common_CopyObj(this.params);
    GParams.font = getTypeDegree(this.params.font);
    oIter.init(GParams);
    oIter.relate(this);
    oIter.fillPlaceholders();

    CMinimaxFunc.superclass.setContent.call(this, oBase, oIter);
}
CMinimaxFunc.prototype.getCenter = function()
{
    return this.elements[0][0].size.center;
}
CMinimaxFunc.prototype.getBase = function()
{
    return this.elements[0][0];
}
CMinimaxFunc.prototype.getIterator = function()
{
    return this.elements[1][0];
}
CMinimaxFunc.prototype.old_setDistance = function()
{
    var iter = this.elements[1][0].size,
        ascent = iter.center + this.params.font.metrics.Placeholder.Height*DIV_CENTER;

    this.dH = this.params.font.metrics.Placeholder.Height - ascent;
    this.dW = 0;
    //this.dH = this.params.font.FontSize/16*g_dKoef_pt_to_mm;
}

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
    var oFunc = new CMinimaxFunc(this.num);
    oFunc.init(this.params);
    oFunc.relate(this);
    oFunc.setContent();


    var oArg = new CMathContent();
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
CMinimax.prototype.getFunction = function()
{
    return this.elements[0][0].getBase();
}
CMinimax.prototype.getIterator = function()
{
    return this.elements[0][0].getIterator();
}
CMinimax.prototype.getArgument = function()
{
    return this.elements[0][1];
}
CMinimax.prototype.setDistance = function()
{
    this.dW = this.params.font.FontSize/6*g_dKoef_pt_to_mm;
    this.dH = 0;
}

function CMathFunc()
{
    CMathBase.call(this, 1,2);
}
extend(CMathFunc, CMathBase);
CMathFunc.prototype.setContent = function()
{
    var oFunc = new CMathContent();
    var GParms = Common_CopyObj(this.params);
    GParms.bMText = false; //!!

    oFunc.init(GParms);

    var oArg  = new CMathContent();
    oArg.init(this.params);
    oArg.fillPlaceholders();

    CMathFunc.superclass.setContent.call(this, oFunc, oArg);
}
CMathFunc.prototype.setDistance = function()
{
    this.dW = this.params.font.FontSize/6*g_dKoef_pt_to_mm;
    this.dH = 0;
}
CMathFunc.prototype.getFunction = function()
{
    return this.elements[0][0];
}
CMathFunc.prototype.getArgument = function()
{
    return this.elements[0][1];
}

function old_CMathFunc(num)
{
    if(num > 19)
        return;

    this.num = num;
    CMathBase.call(this, 1,2);

}
//extend(old_CMathFunc,CSubMathBase);
extend(old_CMathFunc, CMathBase);
old_CMathFunc.prototype.setContent = function()
{
    var oFunc = new CMathContent();
    var GParms = Common_CopyObj(this.params);
    GParms.bMText = false;

    oFunc.init(GParms);
    oFunc.addText(NameFunctions[this.num]);

    var oArg  = new CMathContent();
    oArg.init(this.params);
    oArg.fillPlaceholders();

    old_CMathFunc.superclass.setContent.call(this, oFunc, oArg);
}
old_CMathFunc.prototype.setDistance = function()
{
    //todo
    //переделать!
    this.dW = slashWidth(this.params.font);
    this.dH = 0;
}
old_CMathFunc.prototype.addText = function(txt)
{
    this.elements[0][1].addText(txt);
}

function old_CDifferential(num)
{
    this.num = num;
    CSubMathBase.call(this, 1,1);
}
extend(old_CDifferential, CSubMathBase);
old_CDifferential.prototype.setContent = function()
{
    var oDiff = new CMathContent();
    oDiff.init(this.params);
    oDiff.addText(Diff[this.num]);

    old_CMathFunc.superclass.setContent.call(this, oDiff);
}

function old_CTrigFunc(num)
{
    if(num != num + 0 || num < 0 || num > 14)
        return;

    this.num = num;
    //CSubMathBase.call(this, 1, 2);
    CMathBase.call(this, 1,2);

}
//extend(old_CTrigFunc,CSubMathBase);
extend(old_CTrigFunc, CMathBase);
old_CTrigFunc.prototype.setContent = function()
{
    var oFunc = new CMathContent();
    var GParms = Common_CopyObj(this.params);
    GParms.bMText = false;

    oFunc.init(GParms);
    oFunc.setContent.apply(oFunc, NameFunctions.trig[this.num] );

    var oArg  = new CMathContent();
    oArg.init(this.params);
    oArg.fillPlaceholders();

    old_CTrigFunc.superclass.setContent.call(this, oFunc, oArg);
}
old_CTrigFunc.prototype.setDistance = function()
{
    //todo
    //переделать!
    this.dW = slashWidth(this.params.font);
    this.dH = 0;
}
old_CTrigFunc.prototype.getFunction = function()
{
    return this.elemens[0][0];
}
old_CTrigFunc.prototype.getArgument = function()
{
    return this.elemens[0][1];
}
