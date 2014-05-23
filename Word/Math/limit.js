function CLimit(props)
{
	this.Id = g_oIdCounter.Get_NewId();    this.kind = MATH_LIMIT;

    this.type = LIMIT_LOW;
    CMathBase.call(this);

    if(props.type === LIMIT_UP || props.type === LIMIT_LOW)
        this.type = props.type;

    this.setDimension(2, 1);

    var oBase = new CMathContent();

    var oIter = new CMathContent();
    oIter.decreaseArgSize();

    if(this.type == LIMIT_LOW)
        this.addMCToContent(oBase, oIter);
    else if(this.type == LIMIT_UP)
        this.addMCToContent(oIter, oBase);

    this.setCtrPrp(props.ctrPrp);

    /// вызов этой функции обязательно в конце
    //this.WriteContentsToHistory();
	g_oTableId.Add( this, this.Id );
}
extend(CLimit, CMathBase);
CLimit.prototype.getAscent = function()
{
    var ascent;
    if(this.type == LIMIT_LOW)
        ascent = this.elements[0][0].size.ascent;
    else if(this.type == LIMIT_UP)
        ascent = this.elements[0][0].size.height + this.dH + this.elements[1][0].size.ascent;

    return ascent;
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
    this.dH = 0.03674768518518519*this.Get_CompiledCtrPrp().FontSize;
}
CLimit.prototype.getPropsForWrite = function()
{
    var props =
    {
        type:   this.type
    };

    return props;
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
	Writer.WriteString2( this.elements[0][0].Id );
	Writer.WriteString2( this.elements[1][0].Id );
	
	this.CtrPrp.Write_ToBinary(Writer);
	Writer.WriteLong(this.type);
}
CLimit.prototype.Read_FromBinary2 = function( Reader )
{	
	var Element = g_oTableId.Get_ById( Reader.GetString2() );
	Element.Parent = this;
	this.elements[0][0] = Element;

	var Element1 = g_oTableId.Get_ById( Reader.GetString2() );
	Element1.Parent = this;
	this.elements[1][0] = Element1;
	
	this.CtrPrp.Read_FromBinary(Reader);
	this.type = Reader.GetLong();
}
CLimit.prototype.Get_Id = function()
{
	return this.Id;
}
function CMathFunc(props)
{
	this.Id = g_oIdCounter.Get_NewId();
    this.kind = MATH_FUNCTION;
    CMathBase.call(this);

    this.setDimension(1, 2);
    this.setContent();

    this.setCtrPrp(props.ctrPrp);

    /// вызов этой функции обязательно в конце
    //this.WriteContentsToHistory();
	g_oTableId.Add( this, this.Id );
}
extend(CMathFunc, CMathBase);
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
CMathFunc.prototype.getPropsForWrite = function()
{
    var props = {};
    return props;
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
	Writer.WriteString2( this.elements[0][0].Id );
	Writer.WriteString2( this.elements[0][1].Id );
	
	this.CtrPrp.Write_ToBinary(Writer);
}
CMathFunc.prototype.Read_FromBinary2 = function( Reader )
{
	var Element = g_oTableId.Get_ById( Reader.GetString2() );
	Element.Parent = this;
	this.elements[0][0] = Element;
	
	var Element1 = g_oTableId.Get_ById( Reader.GetString2() );
	Element1.Parent = this;
	this.elements[0][1] = Element1;
	
	this.CtrPrp.Read_FromBinary(Reader);
}
CMathFunc.prototype.Get_Id = function()
{
	return this.Id;
}

