function CMathPosition()
{
    this.x  = 0;
    this.y  = 0;
}

function C_CAccent2(val)
{
    this.typeTest = val;
    this.Content = new Array();
    this.Run = null;
    this.Test_ParaRun = null;

    this.TestRun = new Array();

    this.A = null;
    this.X = null;

    this.operator = new CTestMathText(true);

    this.init();
}
C_CAccent2.prototype.init = function()
{
    var A = new CTestMathText(false);
    //A.addTxt("a");


    var X = new CTestMathText(false);
    //X.addTxt("x");

    this.A = A;
    this.X = X;


    this.TestRun = new CTestRun();

    this.TestRun.Content.push(this.A);
    this.TestRun.Content.push(this.X);

}
C_CAccent2.prototype.setPosition = function(pos)
{
    var PosOper = new CMathPosition();

    PosOper.x = pos.x;
    PosOper.y = pos.y;

    this.operator.setPosition(PosOper);

    var PosBase = new CMathPosition();

    PosBase.x = pos.x;
    PosBase.y = pos.y;

    this.TestRun.setPosition(PosBase);
}
C_CAccent2.prototype.Resize = function()
{
    this.A.size =
    {
        height:     0,
        width:      2.234
    };

    this.X.size =
    {
        height:     0,
        width:      2.234
    };
}
C_CAccent2.prototype.getPosition = function()
{
    return this.TestRun.getPosition();
}


function CTestRun()
{
    this.Content = new Array();
}
CTestRun.prototype.setPosition = function(pos)
{
    var NewPos = new CMathPosition();

    NewPos.x = pos.x;
    NewPos.y = pos.y;

    for(var i = 0; i < this.Content.length; i++)
    {
        this.Content[i].setPosition(NewPos);
        NewPos.x += this.Content[i].size.width;
    }
}
CTestRun.prototype.getPosition = function()
{
    return "Type 4, First position " + this.Content[0].pos.x + " second position " + this.Content[1].pos.x;
}

function CTestMathText(bJDraw)
{
    this.pos = new CMathPosition();
    this.bJDraw = bJDraw;
    this.GapLeft = 0;

    this.rasterOffsetX = 0;
    this.rasterOffsetY = 0;
}
CTestMathText.prototype.setPosition = function(pos)
{
    if (!this.bJDraw)                      // for text
    {
        this.pos.x = pos.x + this.GapLeft;
        this.pos.y = pos.y;

    }
    else                                    // for symbol only drawing
    {
        this.pos.x = pos.x - this.rasterOffsetX;
        this.pos.y = pos.y - this.rasterOffsetY;
    }
}
