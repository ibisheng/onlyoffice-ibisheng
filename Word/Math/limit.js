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

    this.kind = MATH_LIMIT;

    this.ContentFName    = new CMathContent();
    this.ContentIterator = new CMathContent();

    this.Pr = new CMathLimitPr();

    if(props !== null && typeof(props) !== "undefined")
        this.init(props);

	g_oTableId.Add( this, this.Id );
}
Asc.extendClass(CLimit, CMathBase);
CLimit.prototype.init = function(props)
{
    // посмотреть GetAllFonts
    this.setProperties(props);
}
CLimit.prototype.getFName = function()
{
    //return this.FName;
    return this.ContentFName;
}
CLimit.prototype.getIterator = function()
{
    //return this.Iterator;
    return this.ContentIterator;
}
CLimit.prototype.setProperties = function(props)
{
    this.Pr.Set_FromObject(props);
    this.setCtrPrp(props.ctrPrp);
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
            this.elements[0][0].setBase(this.ContentFName);
            this.elements[0][0].setIterator(this.ContentIterator);
            this.elements[0][0].fillContent();

            this.FName    = this.ContentFName;
            this.Iterator = this.ContentIterator;
        }
        else
        {
            this.setDimension(2, 1);

            if(this.Pr.type == LIMIT_LOW)
            {
                this.dH = 0;

                this.FName = this.ContentFName;

                this.Iterator = new CDenominator();
                this.Iterator.setElement(this.ContentIterator);

                this.elements[0][0] = this.FName;
                this.elements[1][0] = this.Iterator;
            }
            else
            {
                this.FName    = this.ContentFName;
                this.Iterator = this.ContentIterator;
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
CLimit.prototype.getPropsForWrite = function()
{
    return this.Pr;
}
CLimit.prototype.Correct_Content = function(bInnerCorrection)
{
    this.ContentFName.Correct_Content(bInnerCorrection);
    this.ContentIterator.Correct_Content(bInnerCorrection);
};
CLimit.prototype.Copy = function()
{
    var oProps = this.Pr.Copy();
    oProps.ctrPrp = this.CtrPrp.Copy();

    var NewLimit = new CLimit(oProps);
    this.ContentFName.CopyTo(NewLimit.ContentFName, false);
    this.ContentIterator.CopyTo(NewLimit.ContentIterator, false);
    return NewLimit;
};
CLimit.prototype.Refresh_RecalcData = function(Data)
{
}
CLimit.prototype.Write_ToBinary2 = function( Writer )
{	
	Writer.WriteLong( historyitem_type_lim );
    Writer.WriteString2(this.Id);
	Writer.WriteString2(this.getFName().Id);
	Writer.WriteString2(this.getIterator().Id);
	
	this.CtrPrp.Write_ToBinary(Writer);
	this.Pr.Write_ToBinary(Writer);
}
CLimit.prototype.Read_FromBinary2 = function( Reader )
{
    this.Id = Reader.GetString2();
    this.ContentFName    = g_oTableId.Get_ById(Reader.GetString2());
    this.ContentIterator = g_oTableId.Get_ById(Reader.GetString2());

    this.CtrPrp.Read_FromBinary(Reader);
    this.Pr.Read_FromBinary(Reader);
}
CLimit.prototype.Get_Id = function()
{
	return this.Id;
}

function CMathFunc(props)
{
    CMathFunc.superclass.constructor.call(this);

	this.Id = g_oIdCounter.Get_NewId();
    this.kind = MATH_FUNCTION;

    this.Pr = {};

    this.fnameContent    = new CMathContent();
    this.argumentContent = new CMathContent();

    if(props !== null && typeof(props) !== "undefined")
        this.init(props);

	g_oTableId.Add( this, this.Id );
}
Asc.extendClass(CMathFunc, CMathBase);
CMathFunc.prototype.init = function(props)
{
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
    return this.elements[0][0];
}
CMathFunc.prototype.getArgument = function()
{
    return this.elements[0][1];
}
CMathFunc.prototype.setProperties = function(props)
{
    this.setCtrPrp(props.ctrPrp);
}
CMathFunc.prototype.fillContent = function()
{
    this.setDimension(1, 2);
    this.elements[0][0] = this.fnameContent;
    this.elements[0][1] = this.argumentContent;
}
CMathFunc.prototype.getPropsForWrite = function()
{
    return this.Pr;
}
CMathFunc.prototype.Copy = function()
{
    var oProps =
    {
        ctrPrp : this.CtrPrp.Copy()
    };

    var NewMathFunc = new CMathFunc(oProps);
    this.fnameContent.CopyTo(NewMathFunc.fnameContent, false);
    this.argumentContent.CopyTo(NewMathFunc.argumentContent, false);
    return NewMathFunc;
};
CMathFunc.prototype.Refresh_RecalcData = function(Data)
{
}
CMathFunc.prototype.Write_ToBinary2 = function( Writer )
{
	Writer.WriteLong( historyitem_type_mathFunc );
    Writer.WriteString2(this.Id);
	Writer.WriteString2(this.fnameContent.Id);
	Writer.WriteString2(this.argumentContent.Id);
	
	this.CtrPrp.Write_ToBinary(Writer);
}
CMathFunc.prototype.Read_FromBinary2 = function( Reader )
{
    this.Id = Reader.GetString2();
    this.fnameContent    = g_oTableId.Get_ById(Reader.GetString2());
    this.argumentContent = g_oTableId.Get_ById(Reader.GetString2());

    this.CtrPrp.Read_FromBinary(Reader);

    this.fillContent();
}
CMathFunc.prototype.Get_Id = function()
{
	return this.Id;
}

