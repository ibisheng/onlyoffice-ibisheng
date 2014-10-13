"use strict";

function CMathLimitPr()
{
    this.type = LIMIT_LOW;
}

CMathLimitPr.prototype.Set_FromObject = function(Obj)
{
    if (undefined !== Obj.type && null !== Obj.type)
        this.type = Obj.type;
};

CMathLimitPr.prototype.Copy = function()
{
    var NewPr = new CMathLimitPr();
    NewPr.type = this.type;
    return NewPr;
};

CMathLimitPr.prototype.Write_ToBinary = function(Writer)
{
    // Long : type
    Writer.WriteLong(this.type);
};

CMathLimitPr.prototype.Read_FromBinary = function(Reader)
{
    // Long : type
    this.type = Reader.GetLong();
};

function CLimit(props)
{
    CLimit.superclass.constructor.call(this);

	this.Id = g_oIdCounter.Get_NewId();

    this.Pr = new CMathLimitPr();

    if(props !== null && typeof(props) !== "undefined")
        this.init(props);

	g_oTableId.Add( this, this.Id );
}
Asc.extendClass(CLimit, CMathBase);

CLimit.prototype.ClassType = historyitem_type_lim;
CLimit.prototype.kind      = MATH_LIMIT;

CLimit.prototype.init = function(props)
{
    this.Fill_LogicalContent(2);

    // посмотреть GetAllFonts
    this.setProperties(props);
    this.fillContent();
}
CLimit.prototype.fillContent = function()
{
};
CLimit.prototype.getFName = function()
{
    return this.Content[0];
}
CLimit.prototype.getIterator = function()
{
    return this.Content[1];
}
CLimit.prototype.Resize = function(oMeasure, Parent, ParaMath, RPI, ArgSize)
{
    this.Parent = Parent;
    this.ParaMath = ParaMath;


    if(this.RecalcInfo.bProps == true || RPI.bChangeInline == true)
    {
        if(RPI.bInline == true && RPI.bMathFunc == true)
        {
            this.setDimension(1, 1);


            var props;

            if(this.Pr.type == LIMIT_LOW)
            {
                props =
                {
                    type:   DEGREE_SUBSCRIPT,
                    ctrPrp: this.CtrPrp
                };
            }
            else
            {
                props =
                {
                    type:   DEGREE_SUPERSCRIPT,
                    ctrPrp: this.CtrPrp
                };
            }

            this.elements[0][0] = new CDegreeBase(null, true);
            this.elements[0][0].setBase(this.getFName());
            this.elements[0][0].setIterator(this.getIterator());
            this.elements[0][0].fillContent();

            this.FName    = this.getFName();
            this.Iterator = this.getIterator();
        }
        else
        {
            this.setDimension(2, 1);

            if(this.Pr.type == LIMIT_LOW)
            {
                this.dH = 0;

                this.FName = this.getFName();

                this.Iterator = new CDenominator(this.getIterator());

                this.elements[0][0] = this.FName;
                this.elements[1][0] = this.Iterator;
            }
            else
            {
                this.FName    = this.getFName();
                this.Iterator = this.getIterator();
                this.dH = 0.06*this.Get_CompiledCtrPrp().FontSize;

                this.elements[0][0] = this.Iterator;
                this.elements[1][0] = this.FName;
            }
        }


        this.RecalcInfo.bProps = false;
    }


    if(RPI.bInline == true && RPI.bMathFunc == true)
    {
        this.elements[0][0].Resize(oMeasure, this, ParaMath, RPI, ArgSize);

        this.size =
        {
            width: this.elements[0][0].size.width,
            height: this.elements[0][0].size.height,
            ascent: this.elements[0][0].size.ascent
        };
    }
    else
    {
        this.FName.Resize(oMeasure, this, ParaMath, RPI, ArgSize);

        var ArgSzIter = ArgSize.Copy();
        ArgSzIter.decrease();

        this.Iterator.Resize(oMeasure, this, ParaMath, RPI, ArgSzIter);

        var SizeFName = this.FName.size,
            SizeIter  = this.Iterator.size;

        var width  = SizeFName.width > SizeIter.width ? SizeFName.width : SizeIter.width,
            height = SizeFName.height + SizeIter.height,
            ascent;

        if(this.Pr.type == LIMIT_LOW)
        {
            ascent = SizeFName.ascent;
        }
        else if(this.Pr.type == LIMIT_UP)
        {
            ascent = SizeIter.height + this.dH + SizeFName.ascent;
        }

        width += this.GapLeft + this.GapRight;


        this.size = {width: width, height: height, ascent: ascent};
    }

}
CLimit.prototype.Correct_Content = function(bInnerCorrection)
{
    this.Content[0].Correct_Content(bInnerCorrection);
    this.Content[1].Correct_Content(bInnerCorrection);
};

function CMathFunc(props)
{
    CMathFunc.superclass.constructor.call(this);

	this.Id = g_oIdCounter.Get_NewId();

    this.Pr = new CMathBasePr();

    if(props !== null && typeof(props) !== "undefined")
        this.init(props);

	g_oTableId.Add( this, this.Id );
}
Asc.extendClass(CMathFunc, CMathBase);

CMathFunc.prototype.ClassType = historyitem_type_mathFunc;
CMathFunc.prototype.kind      = MATH_FUNCTION;

CMathFunc.prototype.init = function(props)
{
    this.Fill_LogicalContent(2);

    this.setProperties(props);
    this.fillContent();
}
CMathFunc.prototype.Resize = function(oMeasure, Parent, ParaMath, RPI, ArgSize)
{
    RPI.bMathFunc = true;

    CMathFunc.superclass.Resize.call(this, oMeasure, Parent, ParaMath, RPI, ArgSize);

    RPI.bMathFunc = false;

}
CMathFunc.prototype.setDistance = function()
{
    this.dW = this.Get_CompiledCtrPrp().FontSize/6*g_dKoef_pt_to_mm;
}
CMathFunc.prototype.getFName = function()
{
    return this.Content[0];
}
CMathFunc.prototype.getArgument = function()
{
    return this.Content[1];
}
CMathFunc.prototype.fillContent = function()
{
    this.setDimension(1, 2);
    this.elements[0][0] = this.getFName();
    this.elements[0][1] = this.getArgument();
}

