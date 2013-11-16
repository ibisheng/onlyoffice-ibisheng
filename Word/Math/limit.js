//var NameFunctions = ["min", "max", "lim", "log", "ln", "sin", "cos", "tg", "ctg", "ch", "sh", "th", "cth", "sec", "csc", "cot", "csch", "sech", "coth"];
//var NameFunctions = ["min", "max", "lim", "log", "ln", "sin", "cos", "tan", "ctg", "cosh", "sinh", "tanh", "cth", "sec", "csc", "cot", "csch", "sech", "coth"];
//var Diff = ["dx","dy","dθ"];

function old_CLogarithm()
{
    CSubMathBase.call(this,1,2);
}
extend(old_CLogarithm, CSubMathBase);
old_CLogarithm.prototype.setContent = function()
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

    old_CLogarithm.superclass.setContent.call(this, oFunc, oArg);
}
old_CLogarithm.prototype.getFunction = function()
{
    return this.elements[0][0].getBase();
}
old_CLogarithm.prototype.getBase = function()
{
    return this.elements[0][0].getIterator();
}
old_CLogarithm.prototype.getArgument = function()
{
    return this.elements[0][1];
}

function CLimit()
{
    this.type = LIMIT_LOW;
    CMathBase.call(this);
}
extend(CLimit, CMathBase);
CLimit.prototype.init = function(props)
{
    if( typeof(props.type) !== "undefined" && props.type !== null)
        this.type = props.type;

    this.setDimension(2, 1);

    var oBase = new CMathContent();

    var oIter = new CMathContent();
    oIter.setReduct(DEGR_REDUCT);

    if(this.type == LIMIT_LOW)
        this.addMCToContent(oBase, oIter);
    else if(this.type == LIMIT_UP)
        this.addMCToContent(oIter, oBase);
}
CLimit.prototype.getCenter = function()
{
    var center;
    if(this.type == LIMIT_LOW)
        center = this.elements[0][0].size.center;
    else if(this.type == LIMIT_UP)
        center = this.elements[0][0].size.height + this.dH + this.elements[1][0].size.center;

    return center;
}
CLimit.prototype.getFName = function()
{
    var fName;
    if(this.type == LIMIT_LOW)
        fName = this.elements[0][0];
    else if(this.type == LIMIT_UP)
        fName = this.elements[1][0];

    return fName;
}
CLimit.prototype.getIterator = function()
{
    var iterator;
    if(this.type == LIMIT_LOW)
        iterator = this.elements[1][0];
    else if(this.type == LIMIT_UP)
        iterator = this.elements[0][0];

    return iterator;
}
CLimit.prototype.setDistance = function()
{
    this.dH = 0.03674768518518519*this.getCtrPrp().FontSize;
}


function old_CMinimax()
{
    CSubMathBase.call(this);
}
extend(old_CMinimax, CSubMathBase);
old_CMinimax.prototype.init = function()
{
    this.setDimension(1, 2);
    var oFunc = new old_CMinimaxFunc();
    oFunc.init();

    var oArg = new CMathContent();

    this.addMCToContent(oFunc, oArg);
}
old_CMinimax.prototype.getFName = function()
{
    return this.elements[0][0].getBase();
}
old_CMinimax.prototype.getIterator = function()
{
    return this.elements[0][0].getIterator();
}
old_CMinimax.prototype.getArgument = function()
{
    return this.elements[0][1];
}
old_CMinimax.prototype.setDistance = function()
{
    this.dW = this.getTxtPrp().FontSize/6*g_dKoef_pt_to_mm;
    this.dH = 0;
}

function CMathFunc()
{
    CMathBase.call(this);
}
extend(CMathFunc, CMathBase);
CMathFunc.prototype.init = function()
{
    this.setDimension(1, 2);
    this.setContent();
}
CMathFunc.prototype.setDistance = function()
{
    this.dW = this.getCtrPrp().FontSize/6*g_dKoef_pt_to_mm;
}
CMathFunc.prototype.getFName = function()
{
    return this.elements[0][0];
}
CMathFunc.prototype.getArgument = function()
{
    return this.elements[0][1];
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
