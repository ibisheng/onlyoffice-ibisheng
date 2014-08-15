"use strict";

function CLimit(props)
{
	this.Id = g_oIdCounter.Get_NewId();

    this.kind = MATH_LIMIT;

    this.FName  = new CMathContent();
    this.Iterator = new CMathContent();

    this.Pr =
    {
        type: LIMIT_LOW
    };

    CMathBase.call(this);

    if(props !== null && typeof(props) !== "undefined")
        this.init(props);

	g_oTableId.Add( this, this.Id );
}
extend(CLimit, CMathBase);
CLimit.prototype.init = function(props)
{
    // посмотреть GetAllFonts
    this.setProperties(props);
}
CLimit.prototype.getAscent = function()
{
    var ascent;
    if(this.Pr.type == LIMIT_LOW)
        ascent = this.elements[0][0].size.ascent;
    else if(this.Pr.type == LIMIT_UP)
        ascent = this.elements[0][0].size.height + this.dH + this.elements[1][0].size.ascent;

    return ascent;
}
CLimit.prototype.getFName = function()
{
    return this.FName;
}
CLimit.prototype.getIterator = function()
{
    return this.Iterator;
}
CLimit.prototype.setDistance = function()
{
    this.dH = 0.03674768518518519*this.Get_CompiledCtrPrp().FontSize;
}
CLimit.prototype.setProperties = function(props)
{
    if(props.type === LIMIT_UP || props.type === LIMIT_LOW)
        this.Pr.type = props.type;

    this.setCtrPrp(props.ctrPrp);
}
CLimit.prototype.fillMathComposition = function(props, contents /*array*/)
{
    this.setProperties(props);

    this.FName = contents[0];
    this.Iterator = contents[1];

    this.RecalcInfo.bProps = true;
}
CLimit.prototype.Resize = function(oMeasure, Parent, ParaMath, RPI, ArgSize)
{
    this.Parent = Parent;
    this.ParaMath = ParaMath;

    //this.Set_CompiledCtrPrp(ParaMath);

    if(this.RecalcInfo.bProps == true || RPI.bChangeInline == true)
    {
        if(RPI.bInline == true)
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

            this.elements[0][0] = new CDegree(null, true);
            this.elements[0][0].fillMathComposition(props, [this.FName, this.Iterator]);
        }
        else
        {
            this.setDimension(2, 1);

            if(this.Pr.type == LIMIT_LOW)
            {
                this.elements[0][0] = this.FName;
                this.elements[1][0] = this.Iterator;
            }
            else
            {
                this.elements[0][0] = this.Iterator;
                this.elements[1][0] = this.FName;
            }
        }


        this.RecalcInfo.bProps = false;
    }


    if(RPI.bInline == true)
    {
        this.elements[0][0].Resize(oMeasure, this, ParaMath, RPI, ArgSize);
    }
    else
    {
        this.FName.Resize(oMeasure, this, ParaMath, RPI, ArgSize);

        var ArgSzIter = ArgSize.Copy();
        ArgSzIter.decrease();

        this.Iterator.Resize(oMeasure, this, ParaMath, RPI, ArgSzIter);
    }

    this.recalculateSize(oMeasure);
}
CLimit.prototype.getPropsForWrite = function()
{
    return this.Pr;
}
CLimit.prototype.Save_Changes = function(Data, Writer)
{
	Writer.WriteLong( historyitem_type_lim );
}
CLimit.prototype.Load_Changes = function(Reader)
{
}
CLimit.prototype.Refresh_RecalcData = function(Data)
{
}
CLimit.prototype.Write_ToBinary2 = function( Writer )
{	
	Writer.WriteLong( historyitem_type_lim );
	Writer.WriteString2( this.getFName().Id );
	Writer.WriteString2( this.getIterator().Id );
	
	this.CtrPrp.Write_ToBinary(Writer);
	Writer.WriteLong(this.Pr.type);
}
CLimit.prototype.Read_FromBinary2 = function( Reader )
{	
	var props = {ctrPrp: new CTextPr()};
	var arrElems = [];
	
	arrElems.push(g_oTableId.Get_ById( Reader.GetString2()));
	arrElems.push(g_oTableId.Get_ById( Reader.GetString2()));
	
	props.ctrPrp.Read_FromBinary(Reader);
	props.type = Reader.GetLong();
	
	this.fillMathComposition (props, arrElems);
}
CLimit.prototype.Get_Id = function()
{
	return this.Id;
}

function CMathFunc(props)
{
	this.Id = g_oIdCounter.Get_NewId();
    this.kind = MATH_FUNCTION;

    this.Pr = {};

    CMathBase.call(this);

    if(props !== null && typeof(props) !== "undefined")
        this.init(props);

	g_oTableId.Add( this, this.Id );
}
extend(CMathFunc, CMathBase);
CMathFunc.prototype.init = function(props)
{
    this.setProperties(props);
    this.fillContent();
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
    this.setContent();
}
CMathFunc.prototype.fillMathComposition = function(props, contents /*array*/)
{
    this.setProperties(props);
    this.fillContent();

    // FName
    this.elements[0][0] = contents[0];

    // Argument
    this.elements[0][1] = contents[1];

}
CMathFunc.prototype.getPropsForWrite = function()
{
    return this.Pr;
}
CMathFunc.prototype.Save_Changes = function(Data, Writer)
{
	Writer.WriteLong( historyitem_type_mathFunc );
}
CMathFunc.prototype.Load_Changes = function(Reader)
{
}
CMathFunc.prototype.Refresh_RecalcData = function(Data)
{
}
CMathFunc.prototype.Write_ToBinary2 = function( Writer )
{
	Writer.WriteLong( historyitem_type_mathFunc );
	Writer.WriteString2( this.getFName().Id );
	Writer.WriteString2( this.getArgument().Id );
	
	this.CtrPrp.Write_ToBinary(Writer);
}
CMathFunc.prototype.Read_FromBinary2 = function( Reader )
{
	var props = {ctrPrp: new CTextPr()};
	var arrElems = [];
	
	arrElems.push(g_oTableId.Get_ById( Reader.GetString2()));
	arrElems.push(g_oTableId.Get_ById( Reader.GetString2()));
	
	props.ctrPrp.Read_FromBinary(Reader);
	
	this.fillMathComposition (props, arrElems);
}
CMathFunc.prototype.Get_Id = function()
{
	return this.Id;
}

