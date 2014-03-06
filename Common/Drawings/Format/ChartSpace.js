"use strict";

var EFFECT_NONE = 0;
var EFFECT_SUBTLE = 1;
var EFFECT_MODERATE = 2;
var EFFECT_INTENSE = 3;

var CHART_STYLE_MANAGER = null;

function CreateUnifillSolidFillSchemeColorByIndex(index)
{
	var ret =  new CUniFill();
	ret.setFill(new CSolidFill());
	ret.fill.setColor(new CUniColor());
	ret.fill.color.setColor(new CSchemeColor());
	ret.fill.color.color.setId(index);
	return ret;
}

function CChartStyleManager()
{
	this.styles = [];
	ExecuteNoHistory(
		function()
		{
			var DefaultDataPointPerDataPoint = 
			[
				[
					CreateUniFillSchemeColorWidthTint(8, 0.885),
					CreateUniFillSchemeColorWidthTint(8, 0.55),
					CreateUniFillSchemeColorWidthTint(8, 0.78),
					CreateUniFillSchemeColorWidthTint(8, 0.925),
					CreateUniFillSchemeColorWidthTint(8, 0.7),
					CreateUniFillSchemeColorWidthTint(8, 0.3)
				],
				[
					CreateUniFillSchemeColorWidthTint(0, 0),
					CreateUniFillSchemeColorWidthTint(1, 0),
					CreateUniFillSchemeColorWidthTint(2, 0),
					CreateUniFillSchemeColorWidthTint(3, 0),
					CreateUniFillSchemeColorWidthTint(4, 0),
					CreateUniFillSchemeColorWidthTint(5, 0)
				],	
				[
					CreateUniFillSchemeColorWidthTint(0, -0.5),
					CreateUniFillSchemeColorWidthTint(1, -0.5),
					CreateUniFillSchemeColorWidthTint(2, -0.5),
					CreateUniFillSchemeColorWidthTint(3, -0.5),
					CreateUniFillSchemeColorWidthTint(4, -0.5),
					CreateUniFillSchemeColorWidthTint(5, -0.5)
				],
				[
					CreateUniFillSchemeColorWidthTint(8, 0.05),
					CreateUniFillSchemeColorWidthTint(8, 0.55),
					CreateUniFillSchemeColorWidthTint(8, 0.78),
					CreateUniFillSchemeColorWidthTint(8, 0.15),
					CreateUniFillSchemeColorWidthTint(8, 0.7),
					CreateUniFillSchemeColorWidthTint(8, 0.3)
				]
			];
			var s = DefaultDataPointPerDataPoint;
			var f = CreateUniFillSchemeColorWidthTint;
			this.styles[0] = new CChartStyle(EFFECT_NONE, EFFECT_SUBTLE, s[0], EFFECT_SUBTLE, EFFECT_NONE, [], 3, s[0], 7);
			this.styles[1] = new CChartStyle(EFFECT_NONE, EFFECT_SUBTLE, s[1], EFFECT_SUBTLE, EFFECT_NONE, [], 3, s[1], 7);
			for(var i = 2; i < 8; ++i)
			{
				this.styles[i] = new CChartStyle(EFFECT_NONE, EFFECT_SUBTLE, [f(i - 2,0)], EFFECT_SUBTLE, EFFECT_NONE, [], 3, [f(i - 2,0)], 7);
			}
			this.styles[8] = new CChartStyle(EFFECT_SUBTLE, EFFECT_SUBTLE, s[0], EFFECT_SUBTLE, EFFECT_SUBTLE,  [f(12,0)], 5, s[0], 9);
			this.styles[9] = new CChartStyle(EFFECT_SUBTLE, EFFECT_SUBTLE, s[1], EFFECT_SUBTLE, EFFECT_SUBTLE,  [f(12,0)], 5, s[1], 9); 
			for(i = 10; i < 16; ++i)
			{
				this.styles[i] = new CChartStyle(EFFECT_SUBTLE, EFFECT_SUBTLE, [f(i-10,0)], EFFECT_SUBTLE, EFFECT_SUBTLE,  [f(12,0)], 5, [f(i-10,0)], 9);
			}
			this.styles[16] = new CChartStyle(EFFECT_MODERATE, EFFECT_INTENSE, s[0], EFFECT_SUBTLE, EFFECT_NONE,  [], 5, s[0], 9);
			this.styles[17] = new CChartStyle(EFFECT_MODERATE, EFFECT_INTENSE, s[1], EFFECT_INTENSE, EFFECT_NONE,  [], 5, s[1], 9); 
			for(i = 18; i < 24; ++i)
			{
				this.styles[i] = new CChartStyle(EFFECT_MODERATE, EFFECT_INTENSE, [f(i-18,0)], EFFECT_SUBTLE, EFFECT_NONE,  [], 5, [f(i-18,0)], 9); 
			}
			this.styles[24] = new CChartStyle(EFFECT_INTENSE, EFFECT_INTENSE, s[0], EFFECT_SUBTLE, EFFECT_NONE,  [], 7, s[0], 13);
			this.styles[25] = new CChartStyle(EFFECT_MODERATE, EFFECT_INTENSE, s[1], EFFECT_SUBTLE, EFFECT_NONE,  [], 7, s[1], 13);
			for(i = 26; i < 32; ++i)
			{
				this.styles[i] = new CChartStyle(EFFECT_MODERATE, EFFECT_INTENSE, [f(i-27,0)], EFFECT_SUBTLE, EFFECT_NONE,  [], 7, s[1], 13);
			}
			this.styles[32] = new CChartStyle(EFFECT_NONE, EFFECT_SUBTLE, s[0], EFFECT_SUBTLE, EFFECT_SUBTLE,  [f(8, -0.5)], 5, s[0], 9);
			this.styles[33] = new CChartStyle(EFFECT_NONE, EFFECT_SUBTLE, s[1], EFFECT_SUBTLE, EFFECT_SUBTLE,  s[2], 5, s[1], 9);
			for(i = 34; i < 41; ++i)
			{
				this.styles[i] = new CChartStyle(EFFECT_NONE, EFFECT_SUBTLE, [f(i - 34, 0)], EFFECT_SUBTLE, EFFECT_SUBTLE, [f(i-34, -0.5)], 5, [f(i-34, 0)], 9);
			}
			this.styles[41] = new CChartStyle(EFFECT_INTENSE, EFFECT_INTENSE, s[3], EFFECT_SUBTLE, EFFECT_NONE, [], 5, s[3], 9);
			this.styles[42] = new CChartStyle(EFFECT_INTENSE, EFFECT_INTENSE, s[1], EFFECT_INTENSE, EFFECT_NONE, [], 5, s[1], 9);
			for(i = 43; i < 48; ++i)
			{
				this.styles[i] = new CChartStyle(EFFECT_INTENSE, EFFECT_INTENSE, [f(i-43, 0)], EFFECT_SUBTLE, EFFECT_NONE, [], 5, [f(i-43, 0)], 9);
			}
			
			this.defaultLineStyles = [];
			this.defaultLineStyles[0] = new ChartLineStyle(f(15, 0), f(15, 0.5), f(15, 0.75), f(15, 0), EFFECT_SUBTLE);
			for(i = 0; i < 32; ++i)
			{
				this.defaultLineStyles[i] = this.defaultLineStyles[0];
			}
			this.defaultLineStyles[32] = new ChartLineStyle(f(8, 0), f(15, 0.5), f(8, 0.75), f(8, 0), EFFECT_SUBTLE);
			this.defaultLineStyles[33] = this.defaultLineStyles[32];
			this.defaultLineStyles[34] = new ChartLineStyle(f(8, 0), f(15, 0.5), f(8, 0.75), f(8, -0.25), EFFECT_SUBTLE);
			for(i = 35; i < 40; ++i)
			{
				this.defaultLineStyles[i] = this.defaultLineStyles[34];
			}
			this.defaultLineStyles[40] = new ChartLineStyle(f(8, 0), f(15, 0.9), f(12, 0), f(12, 0), EFFECT_NONE);
			for(var i = 41; i < 48; ++i)
			{
				this.defaultLineStyles[i] = this.defaultLineStyles[40];
			}
		},
	this, []);
}

CChartStyleManager.prototype = 
{
	getStyleByIndex: function(index)
	{
		if(isRealNumber(index))
		{
			return this.styles[(index - 1) % 48];
		}
		return this.styles[1];
	},
	
	getDefaultLineStyleByIndex: function(index)
	{
		if(isRealNumber(index))
		{
			return this.defaultLineStyles[(index - 1) % 48];
		}
		return this.defaultLineStyles[2];
	}
};

function ChartLineStyle(axisAndMajorGridLines, minorGridlines, chartArea, otherLines, floorChartArea)
{
	this.axisAndMajorGridLines = axisAndMajorGridLines;
	this.minorGridlines = minorGridlines;
	this.chartArea = chartArea;
	this.otherLines = otherLines;
	this.floorChartArea = floorChartArea;
}

function CChartStyle(effect, fill1, fill2, fill3, line1, line2, line3, line4, markerSize)
{
	this.effect = effect;
	this.fill1 = fill1;
	this.fill2 = fill2;
	this.fill3 = fill3;
	
	this.line1 = line1;
	this.line2 = line2;
	this.line3 = line3;
	this.line4 = line4;
	
	this.markerSize = markerSize;
}


function CreateUniFillSchemeColorWidthTint(schemeColorId, tintVal)
{
	return ExecuteNoHistory(
		function(schemeColorId, tintVal)
		{
			return CreateUniFillSolidFillWidthTintOrShade(CreateUnifillSolidFillSchemeColorByIndex(schemeColorId), tintVal);
		},
	this, [schemeColorId, tintVal]);
}

function CChartSpace()
{
    this.chart = null;
    this.clrMapOvr = null;
    this.date1904 = null;
    this.externalData = null;
    this.lang = null;
    this.pivotSource = null;
    this.printSettings = null;
    this.protection = null;
    this.roundedCorners = null;
    this.spPr = null;
    this.style = null;
    this.txPr = null;
    this.userShapes = null;

    this.calculatedChart = null;
    this.transform = new CMatrix();

    this.setRecalculateInfo();


    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CChartSpace.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    Write_ToBinary2: function (w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Id);
    },

    Read_FromBinary2: function (r)
    {
        this.Id = r.GetString2();
    },

    getObjectType: function()
    {
        return historyitem_type_ChartSpace;
    },

    setChart: function(chart)
    {
        History.Add(this, {Type: historyitem_ChartSpace_SetChart, oldChart: this.chart, newChart: chart});
        this.chart = chart;
    },
    setClrMapOvr: function(clrMapOvr)
    {
        History.Add(this, {Type: historyitem_ChartSpace_SetClrMapOvr, oldClrMapOvr: this.clrMapOvr, newClrMapOvr: clrMapOvr});
        this.clrMapOvr = clrMapOvr;
    },
    setDate1904: function(date1904)
    {
        History.Add(this, {Type: historyitem_ChartSpace_SetDate1904, oldDate1904: this.date1904, newDate1904: date1904});
        this.date1904 = date1904;
    },
    setExternalData: function(externalData)
    {
        History.Add(this, {Type: historyitem_ChartSpace_SetExternalData, oldExternalData: this.externalData, newExternalData: externalData});
        this.externalData = externalData;
    },
    setLang: function(lang)
    {
        History.Add(this, {Type: historyitem_ChartSpace_SetLang, oldLang: this.lang, newLang: lang});
        this.lang = lang;
    },
    setPivotSource: function(pivotSource)
    {
        History.Add(this, {Type: historyitem_ChartSpace_SetPivotSource, oldPivotSource: this.pivotSource, newPivotSource: pivotSource});
        this.pivotSource = pivotSource;
    },
    setPrintSettings: function(printSettings)
    {
        History.Add(this, {Type: historyitem_ChartSpace_SetPrintSettings, oldPrintSettings: this.printSettings, newPrintSettings: printSettings});
        this.printSettings = printSettings;
    },
    setProtection: function(protection)
    {
        History.Add(this, {Type: historyitem_ChartSpace_SetProtection, oldProtection: this.protection, newProtection: protection});
        this.protection = protection;
    },
    setRoundedCorners: function(roundedCorners)
    {
        History.Add(this, {Type: historyitem_ChartSpace_SetRoundedCorners, oldRoundedCorners: this.roundedCorners, newRoundedCorners: roundedCorners});
        this.roundedCorners = roundedCorners;
    },
    setSpPr: function(spPr)
    {
        History.Add(this, {Type: historyitem_ChartSpace_SetSpPr, oldSpPr: this.spPr, newSpPr: spPr});
        this.spPr = spPr;
    },
    setStyle: function(style)
    {
        History.Add(this, {Type: historyitem_ChartSpace_SetStyle, oldStyle: this.style, newStyle: style});
        this.style = style;
        this.handleUpdateStyle();
    },
    setTxPr: function(txPr)
    {
        History.Add(this, {Type: historyitem_ChartSpace_SetTxPr, oldTxPr: this.txPr, newTxPr: txPr});
        this.txPr = txPr;
    },
    setUserShapes: function(userShapes)
    {
        History.Add(this, {Type: historyitem_ChartSpace_SetUserShapes, oldUserShapes: this.userShapes, newUserShapes: userShapes});
        this.userShapes = userShapes;
    },


    getTransformMatrix: function()
    {
        return this.transform;
    },

    canRotate: function()
    {
        return false;
    },

    drawAdjustments: function()
    {},

    isChart: function()
    {
        return true;
    },

    isShape: function()
    {
        return false;
    },

    isImage: function()
    {
        return false;
    },

    isGroup: function()
    {
        return false;
    },

    Undo: function(data)
    {
        switch (data.Type)
        {
            case historyitem_ChartSpace_SetChart:
            {
                this.chart = data.oldChart;
                break;
            }
           case historyitem_ChartSpace_SetClrMapOvr:
           {
               this.clrMapOvr = data.oldClrMapOvr;
               break;
           }
           case historyitem_ChartSpace_SetDate1904:
           {
               this.date1904 = data.oldDate1904;
               break;
           }
           case historyitem_ChartSpace_SetExternalData:
           {
               this.externalData = data.oldExternalData;
               break;
           }
           case historyitem_ChartSpace_SetLang:
           {
               this.lang = data.oldLang;
               break;
           }
           case historyitem_ChartSpace_SetPivotSource:
           {
               this.pivotSource = data.oldPivotSource;
               break;
           }
           case historyitem_ChartSpace_SetPrintSettings:
           {
               this.printSettings = data.oldPrintSettings;
               break;
           }
           case historyitem_ChartSpace_SetProtection:
           {
               this.protection = data.oldProtection;
               break;
           }
           case historyitem_ChartSpace_SetRoundedCorners:
           {
               this.roundedCorners = data.oldRoundedCorners;
               break;
           }
           case historyitem_ChartSpace_SetSpPr:
           {
               this.spPr = data.oldSpPr;
               break;
           }
           case historyitem_ChartSpace_SetStyle:
           {
               this.style = data.oldStyle;
               break;
           }
           case historyitem_ChartSpace_SetTxPr:
           {
               this.txPr = data.oldTxPr;
               break;
           }
           case historyitem_ChartSpace_SetUserShapes:
           {
               this.userShapes = data.oldUserShapes;
               break;
           }
        }
    },

    Redo: function(data)
    {
        switch (data.Type)
        {
            case historyitem_ChartSpace_SetChart:
            {
                this.chart = data.newChart;
                break;
            }
            case historyitem_ChartSpace_SetClrMapOvr:
            {
                this.clrMapOvr = data.newClrMapOvr;
                break;
            }
            case historyitem_ChartSpace_SetDate1904:
            {
                this.date1904 = data.newDate1904;
                break;
            }
            case historyitem_ChartSpace_SetExternalData:
            {
                this.externalData = data.newExternalData;
                break;
            }
            case historyitem_ChartSpace_SetLang:
            {
                this.lang = data.newLang;
                break;
            }
            case historyitem_ChartSpace_SetPivotSource:
            {
                this.pivotSource = data.newPivotSource;
                break;
            }
            case historyitem_ChartSpace_SetPrintSettings:
            {
                this.printSettings = data.newPrintSettings;
                break;
            }
            case historyitem_ChartSpace_SetProtection:
            {
                this.protection = data.newProtection;
                break;
            }
            case historyitem_ChartSpace_SetRoundedCorners:
            {
                this.roundedCorners = data.newRoundedCorners;
                break;
            }
            case historyitem_ChartSpace_SetSpPr:
            {
                this.spPr = data.newSpPr;
                break;
            }
            case historyitem_ChartSpace_SetStyle:
            {
                this.style = data.newStyle;
                break;
            }
            case historyitem_ChartSpace_SetTxPr:
            {
                this.txPr = data.newTxPr;
                break;
            }
            case historyitem_ChartSpace_SetUserShapes:
            {
                this.userShapes = data.newUserShapes;
                break;
            }
        }
    },

    Save_Changes: function(data, w)
    {
        w.WriteLong(data.Type);
        switch (data.Type)
        {
            case historyitem_ChartSpace_SetChart:
            {
                writeObject(data.newChart);
                break;
            }
            case historyitem_ChartSpace_SetClrMapOvr:
            {
                writeObject(data.newClrMapOvr);
                break;
            }
            case historyitem_ChartSpace_SetDate1904:
            {
                writeBool(data.newDate1904);
                break;
            }
            case historyitem_ChartSpace_SetExternalData:
            {
                writeObject(data.newExternalData);
                break;
            }
            case historyitem_ChartSpace_SetLang:
            {
                writeString(w, data.newLang);
                break;
            }
            case historyitem_ChartSpace_SetPivotSource:
            {
                writeObject(w, data.newPivotSource);
                break;
            }
            case historyitem_ChartSpace_SetPrintSettings:
            {
                writeObject(w, data.newPrintSettings);
                break;
            }
            case historyitem_ChartSpace_SetProtection:
            {
                writeObject(w, data.newProtection);
                break;
            }
            case historyitem_ChartSpace_SetRoundedCorners:
            {
                writeBool(w, data.newRoundedCorners);
                break;
            }
            case historyitem_ChartSpace_SetSpPr:
            {
                writeObject(w, data.newSpPr);
                break;
            }
            case historyitem_ChartSpace_SetStyle:
            {
                writeLong(w, data.newStyle);
                break;
            }
            case historyitem_ChartSpace_SetTxPr:
            {
                writeObject(w, data.newTxPr);
                break;
            }
            case historyitem_ChartSpace_SetUserShapes:
            {
                writeString(w, data.newUserShapes);
                break;
            }
        }
    },

    Load_Changes: function(r)
    {
        var type = r.GetLong();
        switch (type)
        {
            case historyitem_ChartSpace_SetChart:
            {
                this.chart = readObject(r);
                break;
            }
            case historyitem_ChartSpace_SetClrMapOvr:
            {
                this.clrMapOvr = readObject(r);
                break;
            }
            case historyitem_ChartSpace_SetDate1904:
            {
                this.date1904 = readBool(r);
                break;
            }
            case historyitem_ChartSpace_SetExternalData:
            {
                this.externalData = readObject(r);
                break;
            }
            case historyitem_ChartSpace_SetLang:
            {
                this.lang = readString(r);
                break;
            }
            case historyitem_ChartSpace_SetPivotSource:
            {
                this.pivotSource = readObject(r);
                break;
            }
            case historyitem_ChartSpace_SetPrintSettings:
            {
                this.printSettings = readObject(r);
                break;
            }
            case historyitem_ChartSpace_SetProtection:
            {
                this.protection = readObject(r);
                break;
            }
            case historyitem_ChartSpace_SetRoundedCorners:
            {
                this.roundedCorners = readBool(r);
                break;
            }
            case historyitem_ChartSpace_SetSpPr:
            {
                this.spPr = readObject(r);
                break;
            }
            case historyitem_ChartSpace_SetStyle:
            {
                this.style = readLong(r);
                break;
            }
            case historyitem_ChartSpace_SetTxPr:
            {
                this.txPr = readObject(r);
                break;
            }
            case historyitem_ChartSpace_SetUserShapes:
            {
                this.userShapes = readString(r);
                break;
            }
        }
    }

};

function CExternalData()
{
    this.autoUpdate = null;
    this.id  = null;

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CExternalData.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    getObjectType: function()
    {
        return historyitem_type_ExternalData;
    },
    Write_ToBinary2: function (w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Id);
    },

    Read_FromBinary2: function (r)
    {
        this.Id = r.GetString2();
    },

    setAutoUpdate: function(pr)
    {
        History.Add(this, {Type: historyitem_ExternalData_SetAutoUpdate, oldPr: this.autoUpdate, newPr: pr});
        this.autoUpdate = pr;
    },

    setId: function(pr)
    {
        History.Add(this, {Type: historyitem_ExternalData_SetId, oldPr: this.id, newPr: pr});
        this.id = pr;
    },

    Undo: function(data)
    {
        switch (data.Type)
        {
            case historyitem_ExternalData_SetAutoUpdate:
            {
                this.autoUpdate = data.oldPr;
                break;
            }
            case historyitem_ExternalData_SetId:
            {
                this.id = data.oldPr;
                break;
            }
        }
    },

    Redo: function(data)
    {
        switch (data.Type)
        {
            case historyitem_ExternalData_SetAutoUpdate:
            {
                this.autoUpdate = data.newPr;
                break;
            }
            case historyitem_ExternalData_SetId:
            {
                this.id = data.newPr;
                break;
            }
        }
    },

    Save_Changes: function(data, w)
    {
        w.WriteLong(data.Type);
        switch (data.Type)
        {
            case historyitem_ExternalData_SetAutoUpdate:
            {
                writeBool(data.newPr);
                break;
            }
            case historyitem_ExternalData_SetId:
            {
                writeString(data.newPr);
                break;
            }
        }
    },

    Load_Changes: function(r)
    {
        var type = r.GetLong();
        switch (type)
        {
            case historyitem_ExternalData_SetAutoUpdate:
            {
                this.autoUpdate = readBool(r);
                break;
            }
            case historyitem_ExternalData_SetId:
            {
                this.id = readString(r);
                break;
            }
        }
    }
};

function CPivotSource()
{
    this.fmtId = null;
    this.name  = null;
    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CPivotSource.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    getObjectType: function()
    {
        return historyitem_type_PivotSource;
    },
    Write_ToBinary2: function (w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Id);
    },

    Read_FromBinary2: function (r)
    {
        this.Id = r.GetString2();
    },

    setFmtId: function(pr)
    {
        History.Add(this, {Type:historyitem_PivotSource_SetFmtId, oldPr: this.fmtId, newPr: pr});
        this.fmtId = pr;
    },

    setName: function(pr)
    {
        History.Add(this, {Type:historyitem_PivotSource_SetName, oldPr: this.name, newPr: pr});
        this.name = pr;
    },

    Undo: function(data)
    {
        switch(data.Type)
        {
            case historyitem_PivotSource_SetFmtId:
            {
                this.fmtId = data.oldPr;
                break;
            }
            case historyitem_PivotSource_SetName:
            {
                this.name = data.oldPr;
                break;
            }
        }
    },

    Redo: function(data)
    {
        switch(data.Type)
        {
            case historyitem_PivotSource_SetFmtId:
            {
                this.fmtId = data.newPr;
                break;
            }
            case historyitem_PivotSource_SetName:
            {
                this.name = data.newPr;
                break;
            }
        }
    },

    Save_Changes: function(data, w)
    {
        w.WriteLong(data.Type);
        switch (data.Type)
        {
            case historyitem_PivotSource_SetFmtId:
            {
                writeLong(w, data.newPr);
                break;
            }
            case historyitem_PivotSource_SetName:
            {
                writeString(w, data.newPr);
                break;
            }
        }
    },

    Load_Changes: function(r)
    {
        var type = r.GetLong();
        switch (type)
        {
            case historyitem_PivotSource_SetFmtId:
            {
                this.fmtId = readLong(r);
                break;
            }
            case historyitem_PivotSource_SetName:
            {
                this.name = readString(r);
                break;
            }
        }
    }
};


function CProtection()
{
    this.chartObject   = null;
    this.data          = null;
    this.formatting    = null;
    this.selection     = null;
    this.userInterface = null;

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CProtection.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    getObjectType: function()
    {
        return historyitem_type_Protection;
    },
    Write_ToBinary2: function (w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Id);
    },

    Read_FromBinary2: function (r)
    {
        this.Id = r.GetString2();
    },

    setChartObject: function(pr)
    {
        History.Add(this, {Type: historyitem_Protection_SetChartObject, newPr: pr, oldPr:this.chartObject});
        this.chartObject = pr;
    },
    setData: function(pr)
    {
        History.Add(this, {Type: historyitem_Protection_SetData, newPr: pr, oldPr:this.data});
        this.data = pr;
    },
    setFormatting: function(pr)
    {
        History.Add(this, {Type: historyitem_Protection_SetFormatting, newPr: pr, oldPr:this.formatting});
        this.formatting = pr;
    },
    setSelection: function(pr)
    {
        History.Add(this, {Type: historyitem_Protection_SetSelection, newPr: pr, oldPr:this.selection});
        this.selection = pr;
    },
    setUserInterface: function(pr)
    {
        History.Add(this, {Type: historyitem_Protection_SetUserInterface, newPr: pr, oldPr:this.userInterface});
        this.userInterface = pr;
    },


    Undo: function(data)
    {
        switch(data.Type)
        {
            case historyitem_Protection_SetChartObject:
            {
                this.chartObject = data.oldPr;
                break;
            }
            case historyitem_Protection_SetData:
            {
                this.data = data.oldPr;
                break;
            }
            case historyitem_Protection_SetFormatting:
            {
                this.formatting = data.oldPr;
                break;
            }
            case historyitem_Protection_SetSelection:
            {
                this.selection = data.oldPr;
                break;
            }
            case historyitem_Protection_SetUserInterface:
            {
                this.userInterface = data.oldPr;
                break;
            }
        }
    },

    Redo: function(data)
    {
        switch(data.Type)
        {
            case historyitem_Protection_SetChartObject:
            {
                this.chartObject = data.newPr;
                break;
            }
            case historyitem_Protection_SetData:
            {
                this.data = data.oldPr;
                break;
            }
            case historyitem_Protection_SetFormatting:
            {
                this.formatting = data.newPr;
                break;
            }
            case historyitem_Protection_SetSelection:
            {
                this.selection = data.newPr;
                break;
            }
            case historyitem_Protection_SetUserInterface:
            {
                this.userInterface = data.newPr;
                break;
            }
        }
    },

    Save_Changes: function(data, w)
    {
        w.WriteLong(data.Type);
        switch(data.Type)
        {
            case historyitem_Protection_SetChartObject:
            case historyitem_Protection_SetData:
            case historyitem_Protection_SetFormatting:
            case historyitem_Protection_SetSelection:
            case historyitem_Protection_SetUserInterface:
            {
                writeBool(w, data.newPr);
                break;
            }
        }
    },

    Load_Changes: function(r)
    {
        var type = r.GetLong();
        switch(type)
        {
            case historyitem_Protection_SetChartObject:
            {
                this.chartObject = readBool(r);
                break;
            }
            case historyitem_Protection_SetData:
            {
                this.data = readBool(r);
                break;
            }
            case historyitem_Protection_SetFormatting:
            {
                this.formatting = readBool(r);
                break;
            }
            case historyitem_Protection_SetSelection:
            {
                this.selection = readBool(r);
                break;
            }
            case historyitem_Protection_SetUserInterface:
            {
                this.userInterface = readBool(r);
                break;
            }
        }
    }
};


function CPrintSettings()
{
    this.headerFooter = null;
    this.pageMargins  = null;
    this.pageSetup    = null;

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CPrintSettings.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    getObjectType: function()
    {
        return historyitem_type_PrintSettings;
    },

    Write_ToBinary2: function (w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Id);
    },

    Read_FromBinary2: function (r)
    {
        this.Id = r.GetString2();
    },

    setHeaderFooter: function(pr)
    {
        History.Add(this, {Type: historyitem_PrintSettingsSetHeaderFooter, oldPr: this.headerFooter, newPr: pr});
        this.headerFooter = pr;
    },
    setPageMargins: function(pr)
    {
        History.Add(this, {Type: historyitem_PrintSettingsSetPageMargins, oldPr: this.pageMargins, newPr: pr});
        this.pageMargins = pr;
    },
    setPageSetup: function(pr)
    {
        History.Add(this, {Type: historyitem_PrintSettingsSetPageSetup, oldPr: this.pageSetup, newPr: pr});
        this.pageSetup = pr;
    },

    Undo: function(data)
    {
        switch (data.Type)
        {
            case historyitem_PrintSettingsSetHeaderFooter:
            {
                this.headerFooter = data.oldPr;
                break;
            }
            case historyitem_PrintSettingsSetPageMargins:
            {
                this.pageMargins = data.oldPr;
                break;
            }
            case historyitem_PrintSettingsSetPageSetup:
            {
                this.pageSetup = data.oldPr;
                break;
            }
        }
    },

    Redo: function(data)
    {
        switch (data.Type)
        {
            case historyitem_PrintSettingsSetHeaderFooter:
            {
                this.headerFooter = data.newPr;
                break;
            }
            case historyitem_PrintSettingsSetPageMargins:
            {
                this.pageMargins = data.newPr;
                break;
            }
            case historyitem_PrintSettingsSetPageSetup:
            {
                this.pageSetup = data.newPr;
                break;
            }
        }
    },

    Save_Changes: function(data, w)
    {
        w.WriteLong(data.Type);
        switch (data.Type)
        {
            case historyitem_PrintSettingsSetHeaderFooter:
            case historyitem_PrintSettingsSetPageMargins:
            case historyitem_PrintSettingsSetPageSetup:
            {
                writeObject(w, data.newPr);
                break;
            }
        }
    },

    Load_Changes: function(r)
    {
        switch (data.Type)
        {
            case historyitem_PrintSettingsSetHeaderFooter:
            {
                this.headerFooter = readObject(r);
                break;
            }
            case historyitem_PrintSettingsSetPageMargins:
            {
                this.pageMargins = readObject(r);
                break;
            }
            case historyitem_PrintSettingsSetPageSetup:
            {
                this.pageSetup = readObject(r);
                break;
            }
        }
    }
};


function CHeaderFooterChart()
{
    this.alignWithMargins = null;
    this.differentFirst   = null;
    this.differentOddEven = null;
    this.evenFooter       = null;
    this.evenHeader       = null;
    this.firstFooter      = null;
    this.firstHeader      = null;
    this.oddFooter        = null;
    this.oddHeader        = null;

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CHeaderFooterChart.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    Write_ToBinary2: function (w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Id);
    },

    Read_FromBinary2: function (r)
    {
        this.Id = r.GetString2();
    },

    getObjectType: function()
    {
        return historyitem_type_HeaderFooterChart;
    },


    setAlignWithMargins: function(pr)
    {
        History.Add(this, {Type: historyitem_HeaderFooterChartSetAlignWithMargins, oldPr:this.alignWithMargins, newPr: pr});
        this.alignWithMargins = pr;
    },
    setDifferentFirst: function(pr)
    {
        History.Add(this, {Type: historyitem_HeaderFooterChartSetDifferentFirst, oldPr:this.differentFirst, newPr: pr});
        this.differentFirst = pr;
    },
    setDifferentOddEven: function(pr)
    {
        History.Add(this, {Type: historyitem_HeaderFooterChartSetDifferentOddEven, oldPr:this.differentOddEven, newPr: pr});
        this.differentOddEven = pr;
    },
    setEvenFooter: function(pr)
    {
        History.Add(this, {Type: historyitem_HeaderFooterChartSetEvenFooter, oldPr:this.evenFooter, newPr: pr});
        this.evenFooter = pr;
    },
    setEvenHeader: function(pr)
    {
        History.Add(this, {Type: historyitem_HeaderFooterChartSetEvenHeader, oldPr:this.evenHeader, newPr: pr});
        this.evenHeader = pr;
    },
    setFirstFooter: function(pr)
    {
        History.Add(this, {Type: historyitem_HeaderFooterChartSetFirstFooter, oldPr:this.firstFooter, newPr: pr});
        this.firstFooter = pr;
    },
    setFirstHeader: function(pr)
    {
        History.Add(this, {Type: historyitem_HeaderFooterChartSetFirstHeader, oldPr:this.firstHeader, newPr: pr});
        this.firstHeader = pr;
    },
    setOddFooter: function(pr)
    {
        History.Add(this, {Type: historyitem_HeaderFooterChartSetOddFooter, oldPr:this.oddFooter, newPr: pr});
        this.oddFooter = pr;
    },
    setOddHeader: function(pr)
    {
        History.Add(this, {Type: historyitem_HeaderFooterChartSetOddHeader, oldPr:this.oddHeader, newPr: pr});
        this.oddHeader = pr;
    },

    Undo: function(data)
    {
        switch (data.Type)
        {
            case historyitem_HeaderFooterChartSetAlignWithMargins:
            {
                this.alignWithMargins = data.oldPr;
                break;
            }
            case historyitem_HeaderFooterChartSetDifferentFirst:
            {
                this.differentFirst = data.oldPr;
                break;
            }
            case historyitem_HeaderFooterChartSetDifferentOddEven:
            {
                this.differentOddEven = data.oldPr;
                break;
            }
            case historyitem_HeaderFooterChartSetEvenFooter:
            {
                this.evenFooter = data.oldPr;
                break;
            }
            case historyitem_HeaderFooterChartSetEvenHeader:
            {
                this.evenHeader = data.oldPr;
                break;
            }
            case historyitem_HeaderFooterChartSetFirstFooter:
            {
                this.firstFooter = data.oldPr;
                break;
            }
            case historyitem_HeaderFooterChartSetFirstHeader:
            {
                this.firstHeader = data.oldPr;
                break;
            }
            case historyitem_HeaderFooterChartSetOddFooter:
            {
                this.oddFooter = data.oldPr;
                break;
            }
            case historyitem_HeaderFooterChartSetOddHeader:
            {
                this.oddHeader = data.oldPr;
                break;
            }
        }
    },

    Redo: function(data)
    {
        switch (data.Type)
        {
            case historyitem_HeaderFooterChartSetAlignWithMargins:
            {
                this.alignWithMargins = data.newPr;
                break;
            }
            case historyitem_HeaderFooterChartSetDifferentFirst:
            {
                this.differentFirst = data.newPr;
                break;
            }
            case historyitem_HeaderFooterChartSetDifferentOddEven:
            {
                this.differentOddEven = data.newPr;
                break;
            }
            case historyitem_HeaderFooterChartSetEvenFooter:
            {
                this.evenFooter = data.newPr;
                break;
            }
            case historyitem_HeaderFooterChartSetEvenHeader:
            {
                this.evenHeader = data.newPr;
                break;
            }
            case historyitem_HeaderFooterChartSetFirstFooter:
            {
                this.firstFooter = data.newPr;
                break;
            }
            case historyitem_HeaderFooterChartSetFirstHeader:
            {
                this.firstHeader = data.newPr;
                break;
            }
            case historyitem_HeaderFooterChartSetOddFooter:
            {
                this.oddFooter = data.newPr;
                break;
            }
            case historyitem_HeaderFooterChartSetOddHeader:
            {
                this.oddHeader = data.newPr;
                break;
            }
        }
    },

    Save_Changes: function(data, w)
    {
        w.WriteLong(data.Type);
        switch (data.Type)
        {
            case historyitem_HeaderFooterChartSetAlignWithMargins:
            case historyitem_HeaderFooterChartSetDifferentFirst:
            case historyitem_HeaderFooterChartSetDifferentOddEven:
            {
                writeBool(w, data.newPr);
                break;
            }
            case historyitem_HeaderFooterChartSetEvenFooter:
            case historyitem_HeaderFooterChartSetEvenHeader:
            case historyitem_HeaderFooterChartSetFirstFooter:
            case historyitem_HeaderFooterChartSetFirstHeader:
            case historyitem_HeaderFooterChartSetOddFooter:
            case historyitem_HeaderFooterChartSetOddHeader:
            {
                writeString(w, data.newPr);
                break;
            }
        }
    },

    Load_Changes: function(r)
    {
        var type = r.GetLong();
        switch (type)
        {
            case historyitem_HeaderFooterChartSetAlignWithMargins:
            {
                this.alignWithMargins = readBool(r);
                break;
            }
            case historyitem_HeaderFooterChartSetDifferentFirst:
            {
                this.differentFirst = readBool(r);
                break;
            }
            case historyitem_HeaderFooterChartSetDifferentOddEven:
            {
                this.differentOddEven = readBool(r);
                break;
            }
            case historyitem_HeaderFooterChartSetEvenFooter:
            {
                this.evenFooter = readString(r);
                break;
            }
            case historyitem_HeaderFooterChartSetEvenHeader:
            {
                this.evenHeader = readString(r);
                break;
            }
            case historyitem_HeaderFooterChartSetFirstFooter:
            {
                this.firstFooter = readString(r);
                break;
            }
            case historyitem_HeaderFooterChartSetFirstHeader:
            {
                this.firstHeader = readString(r);
                break;
            }
            case historyitem_HeaderFooterChartSetOddFooter:
            {
                this.oddFooter = readString(r);
                break;
            }
            case historyitem_HeaderFooterChartSetOddHeader:
            {
                this.oddHeader = readString(r);
                break;
            }
        }
    }
};

function CPageMarginsChart()
{
    this.b      = null;
    this.footer = null;
    this.header = null;
    this.l      = null;
    this.r      = null;
    this.t      = null;

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CPageMarginsChart.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    getObjectType: function()
    {
        return historyitem_type_PageMarginsChart;
    },

    setB: function(pr)
    {
        History.Add(this, {Type: historyitem_PageMarginsSetB, oldPr: this.b, newPr: pr});
        this.b = pr;
    },
    setFooter: function(pr)
    {
        History.Add(this, {Type: historyitem_PageMarginsSetFooter, oldPr: this.footer, newPr: pr});
        this.footer = pr;
    },
    setHeader: function(pr)
    {
        History.Add(this, {Type: historyitem_PageMarginsSetHeader, oldPr: this.header, newPr: pr});
        this.header = pr;
    },
    setL: function(pr)
    {
        History.Add(this, {Type: historyitem_PageMarginsSetL, oldPr: this.l, newPr: pr});
        this.l = pr;
    },
    setR: function(pr)
    {
        History.Add(this, {Type: historyitem_PageMarginsSetR, oldPr: this.r, newPr: pr});
        this.r = pr;
    },
    setT: function(pr)
    {
        History.Add(this, {Type: historyitem_PageMarginsSetT, oldPr: this.t, newPr: pr});
        this.t = pr;
    },

    Undo: function(data)
    {
        switch (data.Type)
        {
            case historyitem_PageMarginsSetB:
            {
                this.b = data.oldPr;
                break;
            }
            case historyitem_PageMarginsSetFooter:
            {
                this.footer = data.oldPr;
                break;
            }
            case historyitem_PageMarginsSetHeader:
            {
                this.header = data.oldPr;
                break;
            }
            case historyitem_PageMarginsSetL:
            {
                this.l = data.oldPr;
                break;
            }
            case historyitem_PageMarginsSetR:
            {
                this.r = data.oldPr;
                break;
            }
            case historyitem_PageMarginsSetT:
            {
                this.t = data.oldPr;
                break;
            }
        }
    },

    Redo: function(data)
    {
        switch (data.Type)
        {
            case historyitem_PageMarginsSetB:
            {
                this.b = data.newPr;
                break;
            }
            case historyitem_PageMarginsSetFooter:
            {
                this.footer = data.newPr;
                break;
            }
            case historyitem_PageMarginsSetHeader:
            {
                this.header = data.newPr;
                break;
            }
            case historyitem_PageMarginsSetL:
            {
                this.l = data.newPr;
                break;
            }
            case historyitem_PageMarginsSetR:
            {
                this.r = data.newPr;
                break;
            }
            case historyitem_PageMarginsSetT:
            {
                this.t = data.newPr;
                break;
            }
        }
    },

    Save_Changes: function(data, w)
    {
        w.WriteLong(data.Type);
        switch (data.Type)
        {
            case historyitem_PageMarginsSetB:
            case historyitem_PageMarginsSetFooter:
            case historyitem_PageMarginsSetHeader:
            case historyitem_PageMarginsSetL:
            case historyitem_PageMarginsSetR:
            case historyitem_PageMarginsSetT:
            {
                writeDouble(w, data.newPr);
                break;
            }
        }
    },

    Load_Changes: function(r)
    {
        var type = r.GetLong();
        switch (type)
        {
            case historyitem_PageMarginsSetB:
            {
                this.b = readDouble(r);
                break;
            }
            case historyitem_PageMarginsSetFooter:
            {
                this.footer = readDouble(r);
                break;
            }
            case historyitem_PageMarginsSetHeader:
            {
                this.header = readDouble(r);
                break;
            }
            case historyitem_PageMarginsSetL:
            {
                this.l = readDouble(r);
                break;
            }
            case historyitem_PageMarginsSetR:
            {
                this.r = readDouble(r);
                break;
            }
            case historyitem_PageMarginsSetT:
            {
                this.t = readDouble(r);
                break;
            }
        }
    }
};


var PAGE_SETUP_ORIENTATION_DEFAULT = 0;
var PAGE_SETUP_ORIENTATION_LANDSCAPE = 1;
var PAGE_SETUP_ORIENTATION_PORTRAIT = 2;
function CPageSetup()
{
    this.blackAndWhite     = null;
    this.copies            = null;
    this.draft             = null;
    this.firstPageNumber   = null;
    this.horizontalDpi     = null;
    this.orientation       = null;
    this.paperHeight       = null;
    this.paperSize         = null;
    this.paperWidth        = null;
    this.useFirstPageNumb  = null;
    this.verticalDpi       = null;

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CPageSetup.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    Write_ToBinary2: function (w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Id);
    },

    Read_FromBinary2: function (r)
    {
        this.Id = r.GetString2();
    },

    getObjectType: function()
    {
        return historyitem_type_PageSetup;
    },
    setBlackAndWhite: function(pr)
    {
        History.Add(this, {Type: historyitem_PageSetupSetBlackAndWhite, oldPr: this.blackAndWhite, newPr: pr});
        this.blackAndWhite = pr;
    },
    setCopies: function(pr)
    {
        History.Add(this, {Type: historyitem_PageSetupSetCopies, oldPr: this.copies, newPr: pr});
        this.copies = pr;
    },
    setDraft: function(pr)
    {
        History.Add(this, {Type: historyitem_PageSetupSetDraft, oldPr: this.draft, newPr: pr});
        this.draft = pr;
    },
    setFirstPageNumber: function(pr)
    {
        History.Add(this, {Type: historyitem_PageSetupSetFirstPageNumber, oldPr: this.firstPageNumber, newPr: pr});
        this.firstPageNumber = pr;
    },
    setHorizontalDpi: function(pr)
    {
        History.Add(this, {Type: historyitem_PageSetupSetHorizontalDpi, oldPr: this.horizontalDpi, newPr: pr});
        this.horizontalDpi = pr;
    },
    setOrientation: function(pr)
    {
        History.Add(this, {Type: historyitem_PageSetupSetOrientation, oldPr: this.orientation, newPr: pr});
        this.orientation = pr;
    },
    setPaperHeight: function(pr)
    {
        History.Add(this, {Type: historyitem_PageSetupSetPaperHeight, oldPr: this.paperHeight, newPr: pr});
        this.paperHeight = pr;
    },
    setPaperSize: function(pr)
    {
        History.Add(this, {Type: historyitem_PageSetupSetPaperSize, oldPr: this.paperSize, newPr: pr});
        this.paperSize = pr;
    },
    setPaperWidth: function(pr)
    {
        History.Add(this, {Type: historyitem_PageSetupSetPaperWidth, oldPr: this.paperWidth, newPr: pr});
        this.paperWidth = pr;
    },
    setUseFirstPageNumb: function(pr)
    {
        History.Add(this, {Type: historyitem_PageSetupSetUseFirstPageNumb, oldPr: this.useFirstPageNumb, newPr: pr});
        this.useFirstPageNumb = pr;
    },
    setVerticalDpi: function(pr)
    {
        History.Add(this, {Type: historyitem_PageSetupSetVerticalDpi, oldPr: this.verticalDpi, newPr: pr});
        this.verticalDpi = pr;
    },

    Undo: function(data)
    {
        switch (data.Type)
        {
            case historyitem_PageSetupSetBlackAndWhite:
            {
                this.blackAndWhite = data.oldPr;
                break;
            }
            case historyitem_PageSetupSetCopies:
            {
                this.copies = data.oldPr;
                break;
            }
            case historyitem_PageSetupSetDraft:
            {
                this.draft = data.oldPr;
                break;
            }
            case historyitem_PageSetupSetFirstPageNumber:
            {
                this.firstPageNumber = data.oldPr;
                break;
            }
            case historyitem_PageSetupSetHorizontalDpi:
            {
                this.horizontalDpi = data.oldPr;
                break;
            }
            case historyitem_PageSetupSetOrientation:
            {
                this.orientation = data.oldPr;
                break;
            }
            case historyitem_PageSetupSetPaperHeight:
            {
                this.paperHeight = data.oldPr;
                break;
            }
            case historyitem_PageSetupSetPaperSize:
            {
                this.paperSize = data.oldPr;
                break;
            }
            case historyitem_PageSetupSetPaperWidth:
            {
                this.paperWidth = data.oldPr;
                break;
            }
            case historyitem_PageSetupSetUseFirstPageNumb:
            {
                this.useFirstPageNumb = data.oldPr;
                break;
            }
            case historyitem_PageSetupSetVerticalDpi:
            {
                this.verticalDpi = data.oldPr;
                break;
            }
        }
    },

    Redo: function(data)
    {
        switch (data.Type)
        {
            case historyitem_PageSetupSetBlackAndWhite:
            {
                this.blackAndWhite = data.newPr;
                break;
            }
            case historyitem_PageSetupSetCopies:
            {
                this.copies = data.newPr;
                break;
            }
            case historyitem_PageSetupSetDraft:
            {
                this.draft = data.newPr;
                break;
            }
            case historyitem_PageSetupSetFirstPageNumber:
            {
                this.firstPageNumber = data.newPr;
                break;
            }
            case historyitem_PageSetupSetHorizontalDpi:
            {
                this.horizontalDpi = data.newPr;
                break;
            }
            case historyitem_PageSetupSetOrientation:
            {
                this.orientation = data.newPr;
                break;
            }
            case historyitem_PageSetupSetPaperHeight:
            {
                this.paperHeight = data.newPr;
                break;
            }
            case historyitem_PageSetupSetPaperSize:
            {
                this.paperSize = data.newPr;
                break;
            }
            case historyitem_PageSetupSetPaperWidth:
            {
                this.paperWidth = data.newPr;
                break;
            }
            case historyitem_PageSetupSetUseFirstPageNumb:
            {
                this.useFirstPageNumb = data.newPr;
                break;
            }
            case historyitem_PageSetupSetVerticalDpi:
            {
                this.verticalDpi = data.newPr;
                break;
            }
        }
    },

    Save_Changes: function(data, w)
    {
        w.WriteLong(data.Type);
        switch (data.Type)
        {
            case historyitem_PageSetupSetBlackAndWhite:
            case historyitem_PageSetupSetDraft:
            case historyitem_PageSetupSetUseFirstPageNumb:
            {
                writeBool(w, data.newPr);
                break;
            }
            case historyitem_PageSetupSetCopies:
            case historyitem_PageSetupSetFirstPageNumber:
            case historyitem_PageSetupSetHorizontalDpi:
            case historyitem_PageSetupSetOrientation:
            case historyitem_PageSetupSetPaperSize:
            case historyitem_PageSetupSetVerticalDpi:
            {
                writeLong(w, data.newPr);
                break;
            }
            case historyitem_PageSetupSetPaperHeight:
            case historyitem_PageSetupSetPaperWidth:
            {
                writeDouble(w, data.newPr);
                break;
            }
        }
    },

    Load_Changes: function(r)
    {
        var type = r.GetLong();
        switch (type)
        {
            case historyitem_PageSetupSetBlackAndWhite:
            {
                this.blackAndWhite = readBool(r);
                break;
            }
            case historyitem_PageSetupSetCopies:
            {
                this.copies = readLong(r);
                break;
            }
            case historyitem_PageSetupSetDraft:
            {
                this.draft = readBool(r);
                break;
            }
            case historyitem_PageSetupSetFirstPageNumber:
            {
                this.firstPageNumber = readLong(r);
                break;
            }
            case historyitem_PageSetupSetHorizontalDpi:
            {
                this.horizontalDpi = readLong(r);
                break;
            }
            case historyitem_PageSetupSetOrientation:
            {
                this.orientation = readLong(r);
                break;
            }
            case historyitem_PageSetupSetPaperHeight:
            {
                this.paperHeight = readDouble(r);
                break;
            }
            case historyitem_PageSetupSetPaperSize:
            {
                this.paperSize = readLong(r);
                break;
            }
            case historyitem_PageSetupSetPaperWidth:
            {
                this.paperWidth = readDouble(r);
                break;
            }
            case historyitem_PageSetupSetUseFirstPageNumb:
            {
                this.useFirstPageNumb = readBool(r);
                break;
            }
            case historyitem_PageSetupSetVerticalDpi:
            {
                this.verticalDpi = readLong(r);
                break;
            }
        }
    }
};

function CreateLineChart(asc_chart, type)
{
    var asc_series = asc_chart.series;
    var chart_space = new CChartSpace();
    chart_space.setDate1904(false);
    chart_space.setLang("ru-Ru");
    chart_space.setRoundedCorners(false);
    chart_space.setChart(new CChart());
    chart_space.setPrintSettings(new CPrintSettings());
    var chart = chart_space.chart;
    chart.setAutoTitleDeleted(false);
    chart.setPlotArea(new CPlotArea());
    chart.setLegend(new CLegend());
    chart.setPlotVisOnly(true);
    chart.setTitle(new CTitle());
    chart.title.setOverlay(false);
    chart.title.setSpPr(new CSpPr());
    chart.title.spPr.setFill(new CUniFill());
    chart.title.spPr.Fill.setFill(new CSolidFill());
    chart.title.spPr.Fill.fill.setColor(new CUniColor());
    chart.title.spPr.Fill.fill.color.setColor(new CSchemeColor());
    chart.title.spPr.Fill.fill.color.color.setId(0);
    var disp_blanks_as;
    if(type === GROUPING_STANDARD)
    {
        disp_blanks_as = DISP_BLANKS_AS_GAP;
    }
    else
    {
        disp_blanks_as = DISP_BLANKS_AS_ZERO;
    }
    chart.setDispBlanksAs(disp_blanks_as);
    chart.setShowDLblsOverMax(false);
    var plot_area = chart.plotArea;
    plot_area.setLayout(new CLayout());
    plot_area.addChart(new CLineChart());
    plot_area.addAxis(new CCatAx());
    plot_area.catAx.setTitle(new CTitle());
    plot_area.addAxis(new CValAx());
    plot_area.valAx.setTitle(new CTitle());
    var title = plot_area.valAx.title;
    title.setTxPr(new CTextBody());
    title.txPr.setBodyPr(new CBodyPr());
    title.txPr.bodyPr.setVert(nVertTTvert);
    var line_chart = plot_area.charts[0];
    line_chart.setGrouping(type);
    line_chart.setVaryColors(false);
    line_chart.setDLbls(new CDLbls());
    line_chart.setMarker(true);
    line_chart.setSmooth(false);
    line_chart.addAxId(plot_area.catAx);
    line_chart.addAxId(plot_area.valAx);
    plot_area.valAx.setCrosses(2);
    var parsedHeaders = asc_chart.parseSeriesHeaders();
    for(var i = 0; i < asc_series.length; ++i)
    {
        var series = new CLineSeries();
        series.setIdx(i);
        series.setOrder(i);
        series.setMarker(new CMarker());
        series.marker.setSymbol(SYMBOL_NONE);
        series.setSmooth(false);
        series.setVal(new CYVal());
        var val = series.val;
        val.setNumRef(new CNumRef());
        var num_ref = val.numRef;
        num_ref.setF(asc_series[i].Val.Formula);
        num_ref.setNumCache(new CNumLit());
        var num_cache = num_ref.numCache;
        num_cache.setPtCount(asc_series[i].Val.NumCache.length);
        for(var j = 0; j < asc_series[i].Val.NumCache.length; ++j)
        {
            var pt = new CNumericPoint();
            pt.setIdx(j);
            pt.setFormatCode(asc_series[i].Val.NumCache[j].numFormatStr);
            pt.setVal(asc_series[i].Val.NumCache[j].val);
            num_cache.addPt(pt);
        }
        if(parsedHeaders.bTop)
        {
            series.setCat(new CCat());
            var cat = series.cat;
            cat.setStrRef(new CStrRef());
            var str_ref = cat.strRef;
            str_ref.setF(asc_series[i].Cat.Formula);
            str_ref.setStrCache(new CStrCache());
            var str_cache = str_ref.strCache;
            var cat_num_cache = asc_series[i].Cat.NumCache;
            str_cache.setPtCount(cat_num_cache.length);
            for(var j= 0; j < cat_num_cache.length; ++j)
            {
                var string_pt = new CStringPoint();
                string_pt.setIdx(j);
                string_pt.setVal(cat_num_cache[j].val);
                str_cache.addPt(string_pt);
            }
        }
        if(parsedHeaders.bLeft && asc_series[i].TxCache)
        {
            series.setTx(new CTx());
            var tx= series.tx;
            tx.setStrRef(new CStrRef());
            var str_ref = tx.strRef;
            str_ref.setF(asc_series[i].TxCache.Formula);
            str_ref.setStrCache(new CStrCache());
            var str_cache = str_ref.strCache;
            str_cache.setPtCount(1);
            str_cache.addPt(new CStringPoint());
            var pt = str_cache.pt[0];
            pt.setVal(asc_series[i].TxCache.Tx);
        }
        line_chart.addSer(series);
    }
    var d_lbls = line_chart.dLbls;
    d_lbls.setShowLegendKey(false);
    d_lbls.setShowVal(true);
    d_lbls.setShowCatName(true);
    d_lbls.setShowSerName(true);
    d_lbls.setShowPercent(false);
    d_lbls.setShowBubbleSize(false);
    var cat_ax = plot_area.catAx;
    cat_ax.setScaling(new CScaling());
    cat_ax.setDelete(false);
    cat_ax.setAxPos(AX_POS_B);
    cat_ax.setMajorTickMark(TICK_MARK_OUT);
    cat_ax.setMinorTickMark(TICK_MARK_OUT);
    cat_ax.setTickLblPos(TICK_LABEL_POSITION_NEXT_TO);
    cat_ax.setCrossAx(plot_area.valAx);
    cat_ax.setCrosses(CROSSES_AUTO_ZERO);
    cat_ax.setAuto(true);
    cat_ax.setLblAlgn(LBL_ALG_CTR);
    cat_ax.setLblOffset(100);
    cat_ax.setNoMultiLvlLbl(false);
    var scaling = cat_ax.scaling;
    scaling.setOrientation(ORIENTATION_MIN_MAX);
    var val_ax = plot_area.valAx;
    val_ax.setScaling(new CScaling());
    val_ax.setDelete(false);
    val_ax.setAxPos(AX_POS_L);
    val_ax.setMajorGridlines(new CSpPr());
    val_ax.setNumFmt(new CNumFmt());
    val_ax.setMajorTickMark(TICK_MARK_OUT);
    val_ax.setMinorTickMark(TICK_MARK_NONE);
    val_ax.setTickLblPos(TICK_LABEL_POSITION_NEXT_TO);
    val_ax.setCrossAx(plot_area.catAx);
    val_ax.setCrosses(CROSSES_AUTO_ZERO);
    val_ax.setCrossBetween(CROSS_BETWEEN_BETWEEN);
    scaling = val_ax.scaling;
    scaling.setOrientation(ORIENTATION_MIN_MAX);
    var num_fmt = val_ax.numFmt;
    var format_code;
    if(type === GROUPING_PERCENT_STACKED)
    {
        format_code = "0%";
    }
    else
    {
        format_code = "General";
    }
    num_fmt.setFormatCode(format_code);
    num_fmt.setSourceLinked(true);
    var legend = chart.legend;
    legend.setLegendPos(LEGEND_POS_R);
    legend.setLayout(new CLayout());
    legend.setOverlay(false);
    var print_settings = chart_space.printSettings;
    print_settings.setHeaderFooter(new CHeaderFooterChart());
    print_settings.setPageMargins(new CPageMarginsChart());
    print_settings.setPageSetup(new CPageSetup());
    var page_margins = print_settings.pageMargins;
    page_margins.setB(0.75);
    page_margins.setL(0.7);
    page_margins.setR(0.7);
    page_margins.setT(0.75);
    page_margins.setHeader(0.3);
    page_margins.setFooter(0.3);
    return chart_space;
}

function CreateBarChart(asc_chart, type)
{
    var asc_series = asc_chart.series;
    var chart_space = new CChartSpace();
    chart_space.setDate1904(false);
    chart_space.setLang("ru-Ru");
    chart_space.setRoundedCorners(false);
    chart_space.setChart(new CChart());
    chart_space.setPrintSettings(new CPrintSettings());
    var chart = chart_space.chart;
    chart.setAutoTitleDeleted(false);
    chart.setPlotArea(new CPlotArea());
    chart.setLegend(new CLegend());
    chart.setPlotVisOnly(true);
    chart.setDispBlanksAs(DISP_BLANKS_AS_GAP);
    chart.setShowDLblsOverMax(false);
    var plot_area = chart.plotArea;
    plot_area.setLayout(new CLayout());
    plot_area.addChart(new CBarChart());
    plot_area.addAxis(new CCatAx());
    plot_area.addAxis(new CValAx());
    var bar_chart = plot_area.charts[0];
    bar_chart.setBarDir(BAR_DIR_COL);
    bar_chart.setGrouping(type);
    bar_chart.setVaryColors(false);
    var parsedHeaders = asc_chart.parseSeriesHeaders();
    for(var i = 0; i < asc_series.length; ++i)
    {
        var series = new CBarSeries();
        series.setIdx(i);
        series.setOrder(i);
        series.setInvertIfNegative(false);
        series.setVal(new CYVal());
        var val = series.val;
        val.setNumRef(new CNumRef());
        var num_ref = val.numRef;
        num_ref.setF(asc_series[i].Val.Formula);
        num_ref.setNumCache(new CNumLit());
        var num_cache = num_ref.numCache;
        num_cache.setPtCount(asc_series[i].Val.NumCache.length);
        for(var j = 0; j < asc_series[i].Val.NumCache.length; ++j)
        {
            var pt = new CNumericPoint();
            pt.setIdx(j);
            pt.setFormatCode(asc_series[i].Val.NumCache[j].numFormatStr);
            pt.setVal(asc_series[i].Val.NumCache[j].val);
            num_cache.addPt(pt);
        }
        if(parsedHeaders.bTop)
        {
            series.setCat(new CCat());
            var cat = series.cat;
            cat.setStrRef(new CStrRef());
            var str_ref = cat.strRef;
            str_ref.setF(asc_series[i].Cat.Formula);
            str_ref.setStrCache(new CStrCache());
            var str_cache = str_ref.strCache;
            var cat_num_cache = asc_series[i].Cat.NumCache;
            str_cache.setPtCount(cat_num_cache.length);
            for(var j= 0; j < cat_num_cache.length; ++j)
            {
                var string_pt = new CStringPoint();
                string_pt.setIdx(j);
                string_pt.setVal(cat_num_cache[j].val);
                str_cache.addPt(string_pt);
            }
        }
        if(parsedHeaders.bLeft && asc_series[i].TxCache)
        {
            series.setTx(new CTx());
            var tx= series.tx;
            tx.setStrRef(new CStrRef());
            var str_ref = tx.strRef;
            str_ref.setF(asc_series[i].TxCache.Formula);
            str_ref.setStrCache(new CStrCache());
            var str_cache = str_ref.strCache;
            str_cache.setPtCount(1);
            str_cache.addPt(new CStringPoint());
            var pt = str_cache.pt[0];
            pt.setVal(asc_series[i].TxCache.Tx);
        }
        bar_chart.addSer(series);
    }
    bar_chart.setDLbls(new CDLbls());
    bar_chart.setGapWidth(150);
    bar_chart.addAxId(plot_area.catAx);
    bar_chart.addAxId(plot_area.valAx);
    var d_lbls = bar_chart.dLbls;
    d_lbls.setShowLegendKey(false);
    d_lbls.setShowVal(true);
    d_lbls.setShowCatName(true);
    d_lbls.setShowSerName(true);
    d_lbls.setShowPercent(false);
    d_lbls.setShowBubbleSize(false);
    var cat_ax = plot_area.catAx;
    cat_ax.setScaling(new CScaling());
    cat_ax.setDelete(false);
    cat_ax.setAxPos(AX_POS_B);
    cat_ax.setMajorTickMark(TICK_MARK_OUT);
    cat_ax.setMinorTickMark(TICK_MARK_NONE);
    cat_ax.setCrossAx(plot_area.valAx);
    cat_ax.setCrosses(CROSSES_AUTO_ZERO);
    cat_ax.setAuto(true);
    cat_ax.setLblAlgn(LBL_ALG_CTR);
    cat_ax.setLblOffset(100);
    cat_ax.setNoMultiLvlLbl(false);
    var scaling = cat_ax.scaling;
    scaling.setOrientation(ORIENTATION_MIN_MAX);
    var val_ax = plot_area.valAx;
    val_ax.setScaling(new CScaling());
    val_ax.setDelete(false);
    val_ax.setAxPos(AX_POS_L);
    val_ax.setMajorGridlines(new CSpPr());
    val_ax.setNumFmt(new CNumFmt());
    var num_fmt = val_ax.numFmt;
    var format_code;
    if(type === BAR_GROUPING_PERCENT_STACKED)
    {
        format_code = "0%";
    }
    else
    {
        format_code = "General";
    }
    num_fmt.setFormatCode(format_code);
    num_fmt.setSourceLinked(true);
    val_ax.setMajorTickMark(TICK_MARK_OUT);
    val_ax.setMinorTickMark(TICK_MARK_NONE);
    val_ax.setTickLblPos(TICK_LABEL_POSITION_NEXT_TO);
    val_ax.setCrossAx(plot_area.catAx);
    val_ax.setCrosses(CROSSES_AUTO_ZERO);
    val_ax.setCrossBetween(CROSS_BETWEEN_BETWEEN);
    scaling = val_ax.scaling;
    scaling.setOrientation(ORIENTATION_MIN_MAX);
    var legend = chart.legend;
    legend.setLegendPos(LEGEND_POS_R);
    legend.setLayout(new CLayout());
    legend.setOverlay(false);
    var print_settings = chart_space.printSettings;
    print_settings.setHeaderFooter(new CHeaderFooterChart());
    print_settings.setPageMargins(new CPageMarginsChart());
    print_settings.setPageSetup(new CPageSetup());
    var page_margins = print_settings.pageMargins;
    page_margins.setB(0.75);
    page_margins.setL(0.7);
    page_margins.setR(0.7);
    page_margins.setT(0.75);
    page_margins.setHeader(0.3);
    page_margins.setFooter(0.3);
    return chart_space;
}

function CreateHBarChart(asc_chart, type)
{
    var asc_series = asc_chart.series;
    var chart_space = new CChartSpace();
    chart_space.setDate1904(false);
    chart_space.setLang("ru-Ru");
    chart_space.setRoundedCorners(false);
    chart_space.setChart(new CChart());
    chart_space.setPrintSettings(new CPrintSettings());
    var chart = chart_space.chart;
    chart.setAutoTitleDeleted(false);
    chart.setPlotArea(new CPlotArea());
    chart.setLegend(new CLegend());
    chart.setPlotVisOnly(true);
    chart.setDispBlanksAs(DISP_BLANKS_AS_GAP);
    chart.setShowDLblsOverMax(false);
    var plot_area = chart.plotArea;
    plot_area.setLayout(new CLayout());
    plot_area.addChart(new CBarChart());
    plot_area.addAxis(new CCatAx());
    plot_area.addAxis(new CValAx());
    var bar_chart = plot_area.charts[0];
    bar_chart.setBarDir(BAR_DIR_BAR);
    bar_chart.setGrouping(type);
    bar_chart.setVaryColors(false);
    var parsedHeaders = asc_chart.parseSeriesHeaders();
    for(var i = 0; i < asc_series.length; ++i)
    {
        var series = new CBarSeries();
        series.setIdx(i);
        series.setOrder(i);
        series.setInvertIfNegative(false);
        series.setVal(new CYVal());
        var val = series.val;
        val.setNumRef(new CNumRef());
        var num_ref = val.numRef;
        num_ref.setF(asc_series[i].Val.Formula);
        num_ref.setNumCache(new CNumLit());
        var num_cache = num_ref.numCache;
        num_cache.setPtCount(asc_series[i].Val.NumCache.length);
        for(var j = 0; j < asc_series[i].Val.NumCache.length; ++j)
        {
            var pt = new CNumericPoint();
            pt.setIdx(j);
            pt.setFormatCode(asc_series[i].Val.NumCache[j].numFormatStr);
            pt.setVal(asc_series[i].Val.NumCache[j].val);
            num_cache.addPt(pt);
        }

        if(parsedHeaders.bTop)
        {
            series.setCat(new CCat());
            var cat = series.cat;
            cat.setStrRef(new CStrRef());
            var str_ref = cat.strRef;
            str_ref.setF(asc_series[i].Cat.Formula);
            str_ref.setStrCache(new CStrCache());
            var str_cache = str_ref.strCache;
            var cat_num_cache = asc_series[i].Cat.NumCache;
            str_cache.setPtCount(cat_num_cache.length);
            for(var j= 0; j < cat_num_cache.length; ++j)
            {
                var string_pt = new CStringPoint();
                string_pt.setIdx(j);
                string_pt.setVal(cat_num_cache[j].val);
                str_cache.addPt(string_pt);
            }
        }
        if(parsedHeaders.bLeft && asc_series[i].TxCache)
        {
            series.setTx(new CTx());
            var tx= series.tx;
            tx.setStrRef(new CStrRef());
            var str_ref = tx.strRef;
            str_ref.setF(asc_series[i].TxCache.Formula);
            str_ref.setStrCache(new CStrCache());
            var str_cache = str_ref.strCache;
            str_cache.setPtCount(1);
            str_cache.addPt(new CStringPoint());
            var pt = str_cache.pt[0];
            pt.setVal(asc_series[i].TxCache.Tx);
        }

        bar_chart.addSer(series);
    }
    bar_chart.setDLbls(new CDLbls());
    var d_lbls = bar_chart.dLbls;
    d_lbls.setShowLegendKey(false);
    d_lbls.setShowVal(true);
    d_lbls.setShowCatName(true);
    d_lbls.setShowSerName(true);
    d_lbls.setShowPercent(false);
    d_lbls.setShowBubbleSize(false);
    bar_chart.setGapWidth(150);
    bar_chart.addAxId(plot_area.catAx);
    bar_chart.addAxId(plot_area.valAx);
    var cat_ax = plot_area.catAx;
    cat_ax.setScaling(new CScaling());
    cat_ax.setDelete(false);
    cat_ax.setAxPos(AX_POS_L);
    cat_ax.setMajorTickMark(TICK_MARK_OUT);
    cat_ax.setMinorTickMark(TICK_MARK_NONE);
    cat_ax.setTickLblPos(TICK_LABEL_POSITION_NEXT_TO);
    cat_ax.setCrossAx(plot_area.valAx);
    cat_ax.setCrosses(CROSSES_AUTO_ZERO);
    cat_ax.setAuto(true);
    cat_ax.setLblAlgn(LBL_ALG_CTR);
    cat_ax.setLblOffset(100);
    cat_ax.setNoMultiLvlLbl(false);
    var scaling = cat_ax.scaling;
    scaling.setOrientation(ORIENTATION_MIN_MAX);
    var val_ax = plot_area.valAx;
    val_ax.setScaling(new CScaling());
    val_ax.setDelete(false);
    val_ax.setAxPos(AX_POS_B);
    val_ax.setMajorGridlines(new CSpPr());
    val_ax.setNumFmt(new CNumFmt());
    val_ax.setMajorTickMark(TICK_MARK_OUT);
    val_ax.setMinorTickMark(TICK_MARK_NONE);
    val_ax.setTickLblPos(TICK_LABEL_POSITION_NEXT_TO);
    val_ax.setCrossAx(plot_area.catAx);
    val_ax.setCrosses(CROSSES_AUTO_ZERO);
    val_ax.setCrossBetween(CROSS_BETWEEN_BETWEEN);
    scaling = val_ax.scaling;
    scaling.setOrientation(ORIENTATION_MIN_MAX);
    var num_fmt = val_ax.numFmt;
    var format_code;
    /*if(type === GROUPING_PERCENT_STACKED)
    {
        format_code = "0%";
    }
    else */
    {
        format_code = "General";
    }
    num_fmt.setFormatCode(format_code);
    num_fmt.setSourceLinked(true);
    var legend = chart.legend;
    legend.setLegendPos(LEGEND_POS_R);
    legend.setLayout(new CLayout());
    legend.setOverlay(false);
    var print_settings = chart_space.printSettings;
    print_settings.setHeaderFooter(new CHeaderFooterChart());
    print_settings.setPageMargins(new CPageMarginsChart());
    print_settings.setPageSetup(new CPageSetup());
    var page_margins = print_settings.pageMargins;
    page_margins.setB(0.75);
    page_margins.setL(0.7);
    page_margins.setR(0.7);
    page_margins.setT(0.75);
    page_margins.setHeader(0.3);
    page_margins.setFooter(0.3);
    return chart_space;
}

function CreateAreaChart(asc_chart, type)
{
    var asc_series = asc_chart.series;
    var chart_space = new CChartSpace();
    chart_space.setDate1904(false);
    chart_space.setLang("ru-Ru");
    chart_space.setRoundedCorners(false);
    chart_space.setChart(new CChart());
    chart_space.setPrintSettings(new CPrintSettings());
    var chart = chart_space.chart;
    chart.setAutoTitleDeleted(false);
    chart.setPlotArea(new CPlotArea());
    chart.setLegend(new CLegend());
    chart.setPlotVisOnly(true);
    chart.setDispBlanksAs(DISP_BLANKS_AS_ZERO);
    chart.setShowDLblsOverMax(false);
    var plot_area = chart.plotArea;
    plot_area.setLayout(new CLayout());
    plot_area.addChart(new CAreaChart());
    plot_area.addAxis(new CCatAx());
    plot_area.addAxis(new CValAx());
    var area_chart = plot_area.charts[0];
    area_chart.setGrouping(GROUPING_STANDARD);
    area_chart.setVaryColors(false);
    var parsedHeaders = asc_chart.parseSeriesHeaders();
    for(var i = 0; i < asc_series.length; ++i)
    {
        var series = new CAreaSeries();
        series.setIdx(i);
        series.setOrder(i);
        series.setVal(new CYVal());
        var val = series.val;
        val.setNumRef(new CNumRef());
        var num_ref = val.numRef;
        num_ref.setF(asc_series[i].Val.Formula);
        num_ref.setNumCache(new CNumLit());
        var num_cache = num_ref.numCache;
        num_cache.setPtCount(asc_series[i].Val.NumCache.length);
        for(var j = 0; j < asc_series[i].Val.NumCache.length; ++j)
        {
            var pt = new CNumericPoint();
            pt.setIdx(j);
            pt.setFormatCode(asc_series[i].Val.NumCache[j].numFormatStr);
            pt.setVal(asc_series[i].Val.NumCache[j].val);
            num_cache.addPt(pt);
        }

        if(parsedHeaders.bTop)
        {
            series.setCat(new CCat());
            var cat = series.cat;
            cat.setStrRef(new CStrRef());
            var str_ref = cat.strRef;
            str_ref.setF(asc_series[i].Cat.Formula);
            str_ref.setStrCache(new CStrCache());
            var str_cache = str_ref.strCache;
            var cat_num_cache = asc_series[i].Cat.NumCache;
            str_cache.setPtCount(cat_num_cache.length);
            for(var j= 0; j < cat_num_cache.length; ++j)
            {
                var string_pt = new CStringPoint();
                string_pt.setIdx(j);
                string_pt.setVal(cat_num_cache[j].val);
                str_cache.addPt(string_pt);
            }
        }
        if(parsedHeaders.bLeft && asc_series[i].TxCache)
        {
            series.setTx(new CTx());
            var tx= series.tx;
            tx.setStrRef(new CStrRef());
            var str_ref = tx.strRef;
            str_ref.setF(asc_series[i].TxCache.Formula);
            str_ref.setStrCache(new CStrCache());
            var str_cache = str_ref.strCache;
            str_cache.setPtCount(1);
            str_cache.addPt(new CStringPoint());
            var pt = str_cache.pt[0];
            pt.setVal(asc_series[i].TxCache.Tx);
        }

        area_chart.addSer(series);
    }
    area_chart.setDLbls(new CDLbls());
    area_chart.addAxId(plot_area.catAx);
    area_chart.addAxId(plot_area.valAx);
    var d_lbls = area_chart.dLbls;
    d_lbls.setShowLegendKey(false);
    d_lbls.setShowVal(true);
    d_lbls.setShowCatName(true);
    d_lbls.setShowSerName(true);
    d_lbls.setShowPercent(false);
    d_lbls.setShowBubbleSize(false);
    var cat_ax = plot_area.catAx;
    cat_ax.setScaling(new CScaling());
    cat_ax.setDelete(false);
    cat_ax.setAxPos(AX_POS_B);
    cat_ax.setMajorTickMark(TICK_MARK_OUT);
    cat_ax.setMinorTickMark(TICK_MARK_NONE);
    cat_ax.setTickLblPos(TICK_LABEL_POSITION_NEXT_TO);
    cat_ax.setCrossAx(plot_area.valAx);
    cat_ax.setCrosses(CROSSES_AUTO_ZERO);
    cat_ax.setAuto(true);
    cat_ax.setLblAlgn(LBL_ALG_CTR);
    cat_ax.setLblOffset(100);
    cat_ax.setNoMultiLvlLbl(false);
    cat_ax.scaling.setOrientation(ORIENTATION_MIN_MAX);
    var val_ax = plot_area.valAx;
    val_ax.setScaling(new CScaling());
    val_ax.setDelete(false);
    val_ax.setAxPos(AX_POS_L);
    val_ax.setMajorGridlines(new CSpPr());
    val_ax.setNumFmt(new CNumFmt());
    val_ax.setMajorTickMark(TICK_MARK_OUT);
    val_ax.setMinorTickMark(TICK_MARK_NONE);
    val_ax.setTickLblPos(TICK_LABEL_POSITION_NEXT_TO);
    val_ax.setCrossAx(plot_area.catAx);
    val_ax.setCrosses(CROSSES_AUTO_ZERO);
    val_ax.setCrossBetween(CROSS_BETWEEN_BETWEEN);
    var scaling = val_ax.scaling;
    scaling.setOrientation(ORIENTATION_MIN_MAX);
    var num_fmt = val_ax.numFmt;
    var format_code;
    if(type === GROUPING_PERCENT_STACKED)
    {
        format_code = "0%";
    }
    else
    {
        format_code = "General";
    }
    num_fmt.setFormatCode(format_code);
    num_fmt.setSourceLinked(true);
    var legend = chart.legend;
    legend.setLegendPos(LEGEND_POS_R);
    legend.setLayout(new CLayout());
    legend.setOverlay(false);
    var print_settings = chart_space.printSettings;
    print_settings.setHeaderFooter(new CHeaderFooterChart());
    print_settings.setPageMargins(new CPageMarginsChart());
    print_settings.setPageSetup(new CPageSetup());
    var page_margins = print_settings.pageMargins;
    page_margins.setB(0.75);
    page_margins.setL(0.7);
    page_margins.setR(0.7);
    page_margins.setT(0.75);
    page_margins.setHeader(0.3);
    page_margins.setFooter(0.3);
    return chart_space;
}

function CreatePieChart(asc_chart, bDoughnut)
{
    var asc_series = asc_chart.series;
    var chart_space = new CChartSpace();
    chart_space.setDate1904(false);
    chart_space.setLang("ru-Ru");
    chart_space.setRoundedCorners(false);
    chart_space.setStyle(2);
    chart_space.setChart(new CChart());
    var chart = chart_space.chart;
    chart.setAutoTitleDeleted(false);
    chart.setPlotArea(new CPlotArea());
    var plot_area = chart.plotArea;
    plot_area.setLayout(new CLayout());
    plot_area.addChart(bDoughnut ? new CDoughnutChart() : new CPieChart());
    var pie_chart = plot_area.charts[0];
    pie_chart.setVaryColors(true);
    var parsedHeaders = asc_chart.parseSeriesHeaders();
    for(var i = 0; i < asc_series.length; ++i)
    {
        var series = new CPieSeries();
        series.setIdx(i);
        series.setOrder(i);
        series.setVal(new CYVal());
        var val = series.val;
        val.setNumRef(new CNumRef());
        var num_ref = val.numRef;
        num_ref.setF(asc_series[i].Val.Formula);
        num_ref.setNumCache(new CNumLit());
        var num_cache = num_ref.numCache;
        num_cache.setPtCount(asc_series[i].Val.NumCache.length);
        for(var j = 0; j < asc_series[i].Val.NumCache.length; ++j)
        {
            var pt = new CNumericPoint();
            pt.setIdx(j);
            pt.setFormatCode(asc_series[i].Val.NumCache[j].numFormatStr);
            pt.setVal(asc_series[i].Val.NumCache[j].val);
            num_cache.addPt(pt);
        }

        if(parsedHeaders.bTop)
        {
            series.setCat(new CCat());
            var cat = series.cat;
            cat.setStrRef(new CStrRef());
            var str_ref = cat.strRef;
            str_ref.setF(asc_series[i].Cat.Formula);
            str_ref.setStrCache(new CStrCache());
            var str_cache = str_ref.strCache;
            var cat_num_cache = asc_series[i].Cat.NumCache;
            str_cache.setPtCount(cat_num_cache.length);
            for(var j= 0; j < cat_num_cache.length; ++j)
            {
                var string_pt = new CStringPoint();
                string_pt.setIdx(j);
                string_pt.setVal(cat_num_cache[j].val);
                str_cache.addPt(string_pt);
            }
        }
        if(parsedHeaders.bLeft && asc_series[i].TxCache)
        {
            series.setTx(new CTx());
            var tx= series.tx;
            tx.setStrRef(new CStrRef());
            var str_ref = tx.strRef;
            str_ref.setF(asc_series[i].TxCache.Formula);
            str_ref.setStrCache(new CStrCache());
            var str_cache = str_ref.strCache;
            str_cache.setPtCount(1);
            str_cache.addPt(new CStringPoint());
            var pt = str_cache.pt[0];
            pt.setVal(asc_series[i].TxCache.Tx);
        }

        pie_chart.addSer(series);
    }
    pie_chart.setDLbls(new CDLbls());
    pie_chart.dLbls.setShowLegendKey(false);
    pie_chart.dLbls.setShowVal(true);
    pie_chart.dLbls.setShowCatName(true);
    pie_chart.dLbls.setShowSerName(true);
    pie_chart.dLbls.setShowPercent(false);
    pie_chart.dLbls.setShowBubbleSize(false);
    pie_chart.dLbls.setShowLeaderLines(true);
    pie_chart.setFirstSliceAng(0);
    if(bDoughnut)
        pie_chart.setHoleSize(50);
    chart.setLegend(new CLegend());
    var legend = chart.legend;
    legend.setLegendPos(LEGEND_POS_R);
    legend.setLayout(new CLayout());
    legend.setOverlay(false);
    chart.setPlotVisOnly(true);
    chart.setDispBlanksAs(DISP_BLANKS_AS_GAP);
    chart.setShowDLblsOverMax(false);
    chart_space.setPrintSettings(new CPrintSettings());
    var print_settings = chart_space.printSettings;
    print_settings.setHeaderFooter(new CHeaderFooterChart());
    print_settings.setPageMargins(new CPageMarginsChart());
    print_settings.setPageSetup(new CPageSetup());
    var page_margins = print_settings.pageMargins;
    page_margins.setB(0.75);
    page_margins.setL(0.7);
    page_margins.setR(0.7);
    page_margins.setT(0.75);
    page_margins.setHeader(0.3);
    page_margins.setFooter(0.3);
    return chart_space;
}

function CreateScatterChart(asc_chart)
{
    var asc_series = asc_chart.series;
    var chart_space = new CChartSpace();
    chart_space.setDate1904(false);
    chart_space.setLang("ru-Ru");
    chart_space.setRoundedCorners(false);
    chart_space.setStyle(2);
    chart_space.setChart(new CChart());
    var chart = chart_space.chart;
    chart.setAutoTitleDeleted(false);
    chart.setPlotArea(new CPlotArea());
    var plot_area = chart.plotArea;
    plot_area.setLayout(new CLayout());
    plot_area.addChart(new CScatterChart());
    var scatter_chart = plot_area.charts[0];
    scatter_chart.setScatterStyle(SCATTER_STYLE_LINE_MARKER);
    scatter_chart.setVaryColors(false);
    plot_area.addAxis(new CValAx());
    plot_area.addAxis(new CValAx());
    plot_area.catAx = plot_area.axId[0];
    plot_area.valAx = plot_area.axId[1];
    var first_series = asc_series.length > 1 ? asc_series[0] : null;
    var start_index = asc_series.length > 1 ? 1 : 0;
    var parsedHeaders = asc_chart.parseSeriesHeaders();
    for(var i = start_index; i < asc_series.length; ++i)
    {
        var series = new CScatterSeries();
        series.setIdx(i);
        series.setOrder(i);
        if(first_series)
        {
            series.setXVal(new CXVal());
            var x_val = series.xVal;
            x_val.setNumRef(new CNumRef());
            var num_ref = x_val.numRef;
            num_ref.setF(first_series.Val.Formula);
            num_ref.setNumCache(new CNumLit());
            var num_cache = num_ref.numCache;
            num_cache.setPtCount(first_series.Val.NumCache.length);
            for(var j = 0; j < first_series.Val.NumCache.length; ++j)
            {
                var pt = new CNumericPoint();
                pt.setIdx(j);
                pt.setFormatCode(first_series.Val.NumCache[j].numFormatStr);
                pt.setVal(first_series.Val.NumCache[j].val);
                num_cache.addPt(pt);
            }
        }
        series.setYVal(new CYVal());
        var y_val = series.yVal;
        y_val.setNumRef(new CNumRef());
        var num_ref = y_val.numRef;
        num_ref.setF(asc_series[i].Val.Formula);
        num_ref.setNumCache(new CNumLit());
        var num_cache = num_ref.numCache;
        num_cache.setPtCount(asc_series[i].Val.NumCache.length);
        for(var j = 0; j < asc_series[i].Val.NumCache.length; ++j)
        {
            var pt = new CNumericPoint();
            pt.setIdx(j);
            pt.setFormatCode(asc_series[i].Val.NumCache[j].numFormatStr);
            pt.setVal(asc_series[i].Val.NumCache[j].val);
            num_cache.addPt(pt);
        }
       //if(parsedHeaders.bTop)
       //{
       //    series.setCat(new CCat());
       //    var cat = series.cat;
       //    cat.setStrRef(new CStrRef());
       //    var str_ref = cat.strRef;
       //    str_ref.setF(asc_series[i].Cat.Formula);
       //    str_ref.setStrCache(new CStrCache());
       //    var str_cache = str_ref.strCache;
       //    var cat_num_cache = asc_series[i].Cat.NumCache;
       //    str_cache.setPtCount(cat_num_cache.length);
       //    for(var j= 0; j < cat_num_cache.length; ++j)
       //    {
       //        var string_pt = new CStringPoint();
       //        string_pt.setIdx(j);
       //        string_pt.setVal(cat_num_cache[j].val);
       //        str_cache.addPt(string_pt);
       //    }
       //}
       //if(parsedHeaders.bLeft && asc_series[i].TxCache)
       //{
       //    series.setTx(new CTx());
       //    var tx= series.tx;
       //    tx.setStrRef(new CStrRef());
       //    var str_ref = tx.strRef;
       //    str_ref.setF(asc_series[i].TxCache.Formula);
       //    str_ref.setStrCache(new CStrCache());
       //    var str_cache = str_ref.strCache;
       //    str_cache.setPtCount(1);
       //    str_cache.addPt(new CStringPoint());
       //    var pt = str_cache.pt[0];
       //    pt.setVal(asc_series[i].TxCache.Tx);
       //}
        scatter_chart.addSer(series);
    }
    scatter_chart.setDLbls(new CDLbls());
    scatter_chart.addAxId(plot_area.catAx);
    scatter_chart.addAxId(plot_area.valAx);
    var d_lbls = scatter_chart.dLbls;
    d_lbls.setShowLegendKey(false);
    d_lbls.setShowVal(true);
    d_lbls.setShowCatName(true);
    d_lbls.setShowSerName(true);
    d_lbls.setShowPercent(false);
    d_lbls.setShowBubbleSize(false);
    var cat_ax = plot_area.catAx;
    cat_ax.setScaling(new CScaling());
    cat_ax.setDelete(false);
    cat_ax.setAxPos(AX_POS_B);
    cat_ax.setMajorTickMark(TICK_MARK_OUT);
    cat_ax.setMinorTickMark(TICK_MARK_NONE);
    cat_ax.setTickLblPos(TICK_LABEL_POSITION_NEXT_TO);
    cat_ax.setCrossAx(plot_area.valAx);
    cat_ax.setCrosses(CROSSES_AUTO_ZERO);
    cat_ax.scaling.setOrientation(ORIENTATION_MIN_MAX);
    var val_ax = plot_area.valAx;
    val_ax.setScaling(new CScaling());
    val_ax.setDelete(false);
    val_ax.setAxPos(AX_POS_L);
    val_ax.setMajorGridlines(new CSpPr());
    val_ax.setNumFmt(new CNumFmt());
    val_ax.setMajorTickMark(TICK_MARK_OUT);
    val_ax.setMinorTickMark(TICK_MARK_NONE);
    val_ax.setTickLblPos(TICK_LABEL_POSITION_NEXT_TO);
    val_ax.setCrossAx(plot_area.catAx);
    val_ax.setCrosses(CROSSES_AUTO_ZERO);
    val_ax.setCrossBetween(CROSS_BETWEEN_BETWEEN);
    var scaling = val_ax.scaling;
    scaling.setOrientation(ORIENTATION_MIN_MAX);
    var num_fmt = val_ax.numFmt;
    var format_code = "General";
    num_fmt.setFormatCode(format_code);
    num_fmt.setSourceLinked(true);
    chart.setLegend(new CLegend());
    var legend = chart.legend;
    legend.setLegendPos(LEGEND_POS_R);
    legend.setLayout(new CLayout());
    legend.setOverlay(false);
    chart_space.setPrintSettings(new CPrintSettings());
    var print_settings = chart_space.printSettings;
    print_settings.setHeaderFooter(new CHeaderFooterChart());
    print_settings.setPageMargins(new CPageMarginsChart());
    print_settings.setPageSetup(new CPageSetup());
    var page_margins = print_settings.pageMargins;
    page_margins.setB(0.75);
    page_margins.setL(0.7);
    page_margins.setR(0.7);
    page_margins.setT(0.75);
    page_margins.setHeader(0.3);
    page_margins.setFooter(0.3);
    return chart_space;
}

function CreateStockChart(asc_chart)
{
    var asc_series = asc_chart.series;
    var chart_space = new CChartSpace();
    chart_space.setDate1904(false);
    chart_space.setLang("ru-Ru");
    chart_space.setRoundedCorners(false);
    chart_space.setChart(new CChart());
    chart_space.setPrintSettings(new CPrintSettings());
    var chart = chart_space.chart;
    chart.setAutoTitleDeleted(false);
    chart.setPlotArea(new CPlotArea());
    chart.setLegend(new CLegend());
    chart.setPlotVisOnly(true);
    var disp_blanks_as;
    disp_blanks_as = DISP_BLANKS_AS_GAP;
    chart.setDispBlanksAs(disp_blanks_as);
    chart.setShowDLblsOverMax(false);
    var plot_area = chart.plotArea;
    plot_area.setLayout(new CLayout());
    plot_area.addChart(new CStockChart());
    plot_area.addAxis(new CCatAx());
    plot_area.addAxis(new CValAx());
    var line_chart = plot_area.charts[0];
    line_chart.setDLbls(new CDLbls());
    line_chart.addAxId(plot_area.catAx);
    line_chart.addAxId(plot_area.valAx);
    line_chart.setHiLowLines(new CSpPr());
    line_chart.setUpDownBars(new CUpDownBars());
    line_chart.upDownBars.setGapWidth(150);
    line_chart.upDownBars.setUpBars(new CSpPr());
    line_chart.upDownBars.setDownBars(new CSpPr());
    var parsedHeaders = asc_chart.parseSeriesHeaders();
    for(var i = 0; i < asc_series.length; ++i)
    {
        var series = new CLineSeries();
        series.setIdx(i);
        series.setOrder(i);
        series.setMarker(new CMarker());
        series.marker.setSymbol(SYMBOL_NONE);
        series.setSmooth(false);
        series.setVal(new CYVal());
        var val = series.val;
        val.setNumRef(new CNumRef());
        var num_ref = val.numRef;
        num_ref.setF(asc_series[i].Val.Formula);
        num_ref.setNumCache(new CNumLit());
        var num_cache = num_ref.numCache;
        num_cache.setPtCount(asc_series[i].Val.NumCache.length);
        for(var j = 0; j < asc_series[i].Val.NumCache.length; ++j)
        {
            var pt = new CNumericPoint();
            pt.setIdx(j);
            pt.setFormatCode(asc_series[i].Val.NumCache[j].numFormatStr);
            pt.setVal(asc_series[i].Val.NumCache[j].val);
            num_cache.addPt(pt);
        }

        if(parsedHeaders.bTop)
        {
            series.setCat(new CCat());
            var cat = series.cat;
            cat.setStrRef(new CStrRef());
            var str_ref = cat.strRef;
            str_ref.setF(asc_series[i].Cat.Formula);
            str_ref.setStrCache(new CStrCache());
            var str_cache = str_ref.strCache;
            var cat_num_cache = asc_series[i].Cat.NumCache;
            str_cache.setPtCount(cat_num_cache.length);
            for(var j= 0; j < cat_num_cache.length; ++j)
            {
                var string_pt = new CStringPoint();
                string_pt.setIdx(j);
                string_pt.setVal(cat_num_cache[j].val);
                str_cache.addPt(string_pt);
            }
        }
        if(parsedHeaders.bLeft && asc_series[i].TxCache)
        {
            series.setTx(new CTx());
            var tx= series.tx;
            tx.setStrRef(new CStrRef());
            var str_ref = tx.strRef;
            str_ref.setF(asc_series[i].TxCache.Formula);
            str_ref.setStrCache(new CStrCache());
            var str_cache = str_ref.strCache;
            str_cache.setPtCount(1);
            str_cache.addPt(new CStringPoint());
            var pt = str_cache.pt[0];
            pt.setVal(asc_series[i].TxCache.Tx);
        }

        line_chart.addSer(series);
    }
    var d_lbls = line_chart.dLbls;
    d_lbls.setShowLegendKey(false);
    d_lbls.setShowVal(true);
    d_lbls.setShowCatName(true);
    d_lbls.setShowSerName(true);
    d_lbls.setShowPercent(false);
    d_lbls.setShowBubbleSize(false);
    var cat_ax = plot_area.catAx;
    cat_ax.setScaling(new CScaling());
    cat_ax.setDelete(false);
    cat_ax.setAxPos(AX_POS_B);
    cat_ax.setMajorTickMark(TICK_MARK_OUT);
    cat_ax.setMinorTickMark(TICK_MARK_OUT);
    cat_ax.setTickLblPos(TICK_LABEL_POSITION_NEXT_TO);
    cat_ax.setCrossAx(plot_area.valAx);
    cat_ax.setCrosses(CROSSES_AUTO_ZERO);
    cat_ax.setAuto(true);
    cat_ax.setLblAlgn(LBL_ALG_CTR);
    cat_ax.setLblOffset(100);
    cat_ax.setNoMultiLvlLbl(false);
    var scaling = cat_ax.scaling;
    scaling.setOrientation(ORIENTATION_MIN_MAX);
    var val_ax = plot_area.valAx;
    val_ax.setScaling(new CScaling());
    val_ax.setDelete(false);
    val_ax.setAxPos(AX_POS_L);
    val_ax.setMajorGridlines(new CSpPr());
    val_ax.setNumFmt(new CNumFmt());
    val_ax.setMajorTickMark(TICK_MARK_OUT);
    val_ax.setMinorTickMark(TICK_MARK_NONE);
    val_ax.setTickLblPos(TICK_LABEL_POSITION_NEXT_TO);
    val_ax.setCrossAx(plot_area.catAx);
    val_ax.setCrosses(CROSSES_AUTO_ZERO);
    val_ax.setCrossBetween(CROSS_BETWEEN_BETWEEN);
    scaling = val_ax.scaling;
    scaling.setOrientation(ORIENTATION_MIN_MAX);
    var num_fmt = val_ax.numFmt;
    var format_code;
    format_code = "General";
    num_fmt.setFormatCode(format_code);
    num_fmt.setSourceLinked(true);
    var legend = chart.legend;
    legend.setLegendPos(LEGEND_POS_R);
    legend.setLayout(new CLayout());
    legend.setOverlay(false);
    var print_settings = chart_space.printSettings;
    print_settings.setHeaderFooter(new CHeaderFooterChart());
    print_settings.setPageMargins(new CPageMarginsChart());
    print_settings.setPageSetup(new CPageSetup());
    var page_margins = print_settings.pageMargins;
    page_margins.setB(0.75);
    page_margins.setL(0.7);
    page_margins.setR(0.7);
    page_margins.setT(0.75);
    page_margins.setHeader(0.3);
    page_margins.setFooter(0.3);
    return chart_space;
}


function CreateDefaultAxises(valFormatCode)
{
    var cat_ax = new CCatAx();
    cat_ax.setScaling(new CScaling());
    cat_ax.setDelete(false);
    cat_ax.setAxPos(AX_POS_B);
    cat_ax.setMajorTickMark(TICK_MARK_OUT);
    cat_ax.setMinorTickMark(TICK_MARK_NONE);
    cat_ax.setCrosses(CROSSES_AUTO_ZERO);
    cat_ax.setAuto(true);
    cat_ax.setLblAlgn(LBL_ALG_CTR);
    cat_ax.setLblOffset(100);
    cat_ax.setNoMultiLvlLbl(false);
    var scaling = cat_ax.scaling;
    scaling.setOrientation(ORIENTATION_MIN_MAX);
    var val_ax = new CValAx();
    val_ax.setScaling(new CScaling());
    val_ax.setDelete(false);
    val_ax.setAxPos(AX_POS_L);
    val_ax.setMajorGridlines(new CSpPr());
    val_ax.setNumFmt(new CNumFmt());
    var num_fmt = val_ax.numFmt;
    num_fmt.setFormatCode(valFormatCode);
    num_fmt.setSourceLinked(true);
    val_ax.setMajorTickMark(TICK_MARK_OUT);
    val_ax.setMinorTickMark(TICK_MARK_NONE);
    val_ax.setTickLblPos(TICK_LABEL_POSITION_NEXT_TO);
    val_ax.setCrossAx(cat_ax);
    val_ax.setCrosses(CROSSES_AUTO_ZERO);
    val_ax.setCrossBetween(CROSS_BETWEEN_BETWEEN);
    scaling = val_ax.scaling;
    scaling.setOrientation(ORIENTATION_MIN_MAX);
    cat_ax.setCrossAx(val_ax);
    cat_ax.setTitle(new CTitle());
    val_ax.setTitle(new CTitle());
    var title = val_ax.title;
    title.setTxPr(new CTextBody());
    title.txPr.setBodyPr(new CBodyPr());
    title.txPr.bodyPr.setVert(nVertTTvert);
    return {valAx: val_ax, catAx: cat_ax};
}

function CreateScatterAxis()
{
    var cat_ax = new CValAx();
    var val_ax = new CValAx();
    cat_ax.setScaling(new CScaling());
    cat_ax.setDelete(false);
    cat_ax.setAxPos(AX_POS_B);
    cat_ax.setMajorTickMark(TICK_MARK_OUT);
    cat_ax.setMinorTickMark(TICK_MARK_NONE);
    cat_ax.setTickLblPos(TICK_LABEL_POSITION_NEXT_TO);
    cat_ax.setCrossAx(val_ax);
    cat_ax.setCrosses(CROSSES_AUTO_ZERO);
    cat_ax.scaling.setOrientation(ORIENTATION_MIN_MAX);
    val_ax.setScaling(new CScaling());
    val_ax.setDelete(false);
    val_ax.setAxPos(AX_POS_L);
    val_ax.setMajorGridlines(new CSpPr());
    val_ax.setNumFmt(new CNumFmt());
    val_ax.setMajorTickMark(TICK_MARK_OUT);
    val_ax.setMinorTickMark(TICK_MARK_NONE);
    val_ax.setTickLblPos(TICK_LABEL_POSITION_NEXT_TO);
    val_ax.setCrossAx(val_ax);
    val_ax.setCrosses(CROSSES_AUTO_ZERO);
    val_ax.setCrossBetween(CROSS_BETWEEN_BETWEEN);
    var scaling = val_ax.scaling;
    scaling.setOrientation(ORIENTATION_MIN_MAX);
    var num_fmt = val_ax.numFmt;
    var format_code = "General";
    num_fmt.setFormatCode(format_code);
    num_fmt.setSourceLinked(true);
    return {valAx: val_ax, catAx: cat_ax};
}