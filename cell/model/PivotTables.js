"use strict";
//Generated code
function getBoolFromXml(val) {
	return "0" !== val && "false" !== val && "off" !== val;
}
var c_oAscSourceType = {
	Worksheet: 0,
	External: 1,
	Consolidation: 2,
	Scenario: 3
};
var c_oAscAxis = {
	AxisRow: 0,
	AxisCol: 1,
	AxisPage: 2,
	AxisValues: 3
};
var c_oAscFieldSortType = {
	Manual: 0,
	Ascending: 1,
	Descending: 2
};
var c_oAscItemType = {
	Default: 0,
	Avg: 1,
	Count: 2,
	CountA: 3,
	Max: 4,
	Min: 5,
	Product: 6,
	StdDev: 7,
	StdDevP: 8,
	Sum: 9,
	Var: 10,
	VarP: 11,
	Data: 12,
	Grand: 13,
	Blank: 14
};
var c_oAscDataConsolidateFunction = {
	Average: 1,
	Count: 2,
	CountNums: 3,
	Max: 4,
	Min: 5,
	Product: 6,
	StdDev: 7,
	StdDevp: 8,
	Sum: 9,
	Var: 10,
	Varp: 11
};
var c_oAscShowDataAs = {
	Normal: 0,
	Difference: 1,
	Percent: 2,
	PercentDiff: 3,
	RunTotal: 4,
	PercentOfRow: 5,
	PercentOfCol: 6,
	PercentOfTotal: 7,
	Index: 8
};
var c_oAscFormatAction = {
	Blank: 0,
	Formatting: 1,
	Drill: 2,
	Formula: 3
};
var c_oAscScope = {
	Selection: 0,
	Data: 1,
	Field: 2
};
var c_oAscType = {
	None: 0,
	All: 1,
	Row: 2,
	Column: 3
};
var c_oAscPivotFilterType = {
	Unknown: 0,
	Count: 1,
	Percent: 2,
	Sum: 3,
	CaptionEqual: 4,
	CaptionNotEqual: 5,
	CaptionBeginsWith: 6,
	CaptionNotBeginsWith: 7,
	CaptionEndsWith: 8,
	CaptionNotEndsWith: 9,
	CaptionContains: 10,
	CaptionNotContains: 11,
	CaptionGreaterThan: 12,
	CaptionGreaterThanOrEqual: 13,
	CaptionLessThan: 14,
	CaptionLessThanOrEqual: 15,
	CaptionBetween: 16,
	CaptionNotBetween: 17,
	ValueEqual: 18,
	ValueNotEqual: 19,
	ValueGreaterThan: 20,
	ValueGreaterThanOrEqual: 21,
	ValueLessThan: 22,
	ValueLessThanOrEqual: 23,
	ValueBetween: 24,
	ValueNotBetween: 25,
	DateEqual: 26,
	DateNotEqual: 27,
	DateOlderThan: 28,
	DateOlderThanOrEqual: 29,
	DateNewerThan: 30,
	DateNewerThanOrEqual: 31,
	DateBetween: 32,
	DateNotBetween: 33,
	Tomorrow: 34,
	Today: 35,
	Yesterday: 36,
	NextWeek: 37,
	ThisWeek: 38,
	LastWeek: 39,
	NextMonth: 40,
	ThisMonth: 41,
	LastMonth: 42,
	NextQuarter: 43,
	ThisQuarter: 44,
	LastQuarter: 45,
	NextYear: 46,
	ThisYear: 47,
	LastYear: 48,
	YearToDate: 49,
	Q1: 50,
	Q2: 51,
	Q3: 52,
	Q4: 53,
	M1: 54,
	M2: 55,
	M3: 56,
	M4: 57,
	M5: 58,
	M6: 59,
	M7: 60,
	M8: 61,
	M9: 62,
	M10: 63,
	M11: 64,
	M12: 65
};
var c_oAscSortType = {
	None: 0,
	Ascending: 1,
	Descending: 2,
	AscendingAlpha: 3,
	DescendingAlpha: 4,
	AscendingNatural: 5,
	DescendingNatural: 6
};
var c_oAscPivotAreaType = {
	None: 0,
	Normal: 1,
	Data: 2,
	All: 3,
	Origin: 4,
	Button: 5,
	TopEnd: 6
};
var c_oAscGroupBy = {
	Range: 0,
	Seconds: 1,
	Minutes: 2,
	Hours: 3,
	Days: 4,
	Months: 5,
	Quarters: 6,
	Years: 7
};
var c_oAscSortMethod = {
	Stroke: 0,
	PinYin: 1,
	None: 2
};
var c_oAscDynamicFilterType = {
	Null: 0,
	AboveAverage: 1,
	BelowAverage: 2,
	Tomorrow: 3,
	Today: 4,
	Yesterday: 5,
	NextWeek: 6,
	ThisWeek: 7,
	LastWeek: 8,
	NextMonth: 9,
	ThisMonth: 10,
	LastMonth: 11,
	NextQuarter: 12,
	ThisQuarter: 13,
	LastQuarter: 14,
	NextYear: 15,
	ThisYear: 16,
	LastYear: 17,
	YearToDate: 18,
	Q1: 19,
	Q2: 20,
	Q3: 21,
	Q4: 22,
	M1: 23,
	M2: 24,
	M3: 25,
	M4: 26,
	M5: 27,
	M6: 28,
	M7: 29,
	M8: 30,
	M9: 31,
	M10: 32,
	M11: 33,
	M12: 34
};
var c_oAscCalendarType = {
	Gregorian: 0,
	GregorianUs: 1,
	GregorianMeFrench: 2,
	GregorianArabic: 3,
	Hijri: 4,
	Hebrew: 5,
	Taiwan: 6,
	Japan: 7,
	Thai: 8,
	Korea: 9,
	Saka: 10,
	GregorianXlitEnglish: 11,
	GregorianXlitFrench: 12,
	None: 13
};
var c_oAscIconSetType = {
	ThreeArrows: 0,
	ThreeArrowsGray: 1,
	ThreeFlags: 2,
	ThreeTrafficLights1: 3,
	ThreeTrafficLights2: 4,
	ThreeSigns: 5,
	ThreeSymbols: 6,
	ThreeSymbols2: 7,
	FourArrows: 8,
	FourArrowsGray: 9,
	FourRedToBlack: 10,
	FourRating: 11,
	FourTrafficLights: 12,
	FiveArrows: 13,
	FiveArrowsGray: 14,
	FiveRating: 15,
	FiveQuarters: 16
};
var c_oAscSortBy = {
	Value: 0,
	CellColor: 1,
	FontColor: 2,
	Icon: 3
};
var c_oAscFilterOperator = {
	Equal: 0,
	LessThan: 1,
	LessThanOrEqual: 2,
	NotEqual: 3,
	GreaterThanOrEqual: 4,
	GreaterThan: 5
};
var c_oAscDateTimeGrouping = {
	Year: 0,
	Month: 1,
	Day: 2,
	Hour: 3,
	Minute: 4,
	Second: 5
};
var c_oAscAllocationMethod = {
	EqualAllocation: 0,
	EqualIncrement: 1,
	WeightedAllocation: 2,
	WeightedIncrement: 3
};

var st_VALUES = -2;

function FromXml_ST_SourceType(val) {
	var res = -1;
	if ("worksheet" === val) {
		res = c_oAscSourceType.Worksheet;
	} else if ("external" === val) {
		res = c_oAscSourceType.External;
	} else if ("consolidation" === val) {
		res = c_oAscSourceType.Consolidation;
	} else if ("scenario" === val) {
		res = c_oAscSourceType.Scenario;
	}
	return res;
}
function ToXml_ST_SourceType(val) {
	var res = "";
	if (c_oAscSourceType.Worksheet === val) {
		res = "worksheet";
	} else if (c_oAscSourceType.External === val) {
		res = "external";
	} else if (c_oAscSourceType.Consolidation === val) {
		res = "consolidation";
	} else if (c_oAscSourceType.Scenario === val) {
		res = "scenario";
	}
	return res;
}

function FromXml_ST_Axis(val) {
	var res = -1;
	if ("axisRow" === val) {
		res = c_oAscAxis.AxisRow;
	} else if ("axisCol" === val) {
		res = c_oAscAxis.AxisCol;
	} else if ("axisPage" === val) {
		res = c_oAscAxis.AxisPage;
	} else if ("axisValues" === val) {
		res = c_oAscAxis.AxisValues;
	}
	return res;
}
function ToXml_ST_Axis(val) {
	var res = "";
	if (c_oAscAxis.AxisRow === val) {
		res = "axisRow";
	} else if (c_oAscAxis.AxisCol === val) {
		res = "axisCol";
	} else if (c_oAscAxis.AxisPage === val) {
		res = "axisPage";
	} else if (c_oAscAxis.AxisValues === val) {
		res = "axisValues";
	}
	return res;
}

function FromXml_ST_FieldSortType(val) {
	var res = -1;
	if ("manual" === val) {
		res = c_oAscFieldSortType.Manual;
	} else if ("ascending" === val) {
		res = c_oAscFieldSortType.Ascending;
	} else if ("descending" === val) {
		res = c_oAscFieldSortType.Descending;
	}
	return res;
}
function ToXml_ST_FieldSortType(val) {
	var res = "";
	if (c_oAscFieldSortType.Manual === val) {
		res = "manual";
	} else if (c_oAscFieldSortType.Ascending === val) {
		res = "ascending";
	} else if (c_oAscFieldSortType.Descending === val) {
		res = "descending";
	}
	return res;
}

function FromXml_ST_ItemType(val) {
	var res = -1;
	if ("data" === val) {
		res = c_oAscItemType.Data;
	} else if ("default" === val) {
		res = c_oAscItemType.Default;
	} else if ("sum" === val) {
		res = c_oAscItemType.Sum;
	} else if ("countA" === val) {
		res = c_oAscItemType.CountA;
	} else if ("avg" === val) {
		res = c_oAscItemType.Avg;
	} else if ("max" === val) {
		res = c_oAscItemType.Max;
	} else if ("min" === val) {
		res = c_oAscItemType.Min;
	} else if ("product" === val) {
		res = c_oAscItemType.Product;
	} else if ("count" === val) {
		res = c_oAscItemType.Count;
	} else if ("stdDev" === val) {
		res = c_oAscItemType.StdDev;
	} else if ("stdDevP" === val) {
		res = c_oAscItemType.StdDevP;
	} else if ("var" === val) {
		res = c_oAscItemType.Var;
	} else if ("varP" === val) {
		res = c_oAscItemType.VarP;
	} else if ("grand" === val) {
		res = c_oAscItemType.Grand;
	} else if ("blank" === val) {
		res = c_oAscItemType.Blank;
	}
	return res;
}
function ToXml_ST_ItemType(val) {
	var res = "";
	if (c_oAscItemType.Data === val) {
		res = "data";
	} else if (c_oAscItemType.Default === val) {
		res = "default";
	} else if (c_oAscItemType.Sum === val) {
		res = "sum";
	} else if (c_oAscItemType.CountA === val) {
		res = "countA";
	} else if (c_oAscItemType.Avg === val) {
		res = "avg";
	} else if (c_oAscItemType.Max === val) {
		res = "max";
	} else if (c_oAscItemType.Min === val) {
		res = "min";
	} else if (c_oAscItemType.Product === val) {
		res = "product";
	} else if (c_oAscItemType.Count === val) {
		res = "count";
	} else if (c_oAscItemType.StdDev === val) {
		res = "stdDev";
	} else if (c_oAscItemType.StdDevP === val) {
		res = "stdDevP";
	} else if (c_oAscItemType.Var === val) {
		res = "var";
	} else if (c_oAscItemType.VarP === val) {
		res = "varP";
	} else if (c_oAscItemType.Grand === val) {
		res = "grand";
	} else if (c_oAscItemType.Blank === val) {
		res = "blank";
	}
	return res;
}

function ToName_ST_ItemType(val) {
	var res = ' ';
	if (c_oAscItemType.Default === val) {
		res += 'Total';
	} else if (c_oAscItemType.Avg === val) {
		res += 'Average';
	} else if (c_oAscItemType.Count === val) {
		res += 'Count';
	} else if (c_oAscItemType.CountA === val) {
		res += 'Count';
	} else if (c_oAscItemType.Max === val) {
		res += 'Max';
	} else if (c_oAscItemType.Min === val) {
		res += 'Min';
	} else if (c_oAscItemType.Product === val) {
		res += 'Product';
	} else if (c_oAscItemType.StdDev === val) {
		res += 'StdDev';
	} else if (c_oAscItemType.StdDevP === val) {
		res += 'StdDevp';
	} else if (c_oAscItemType.Sum === val) {
		res += 'Sum';
	} else if (c_oAscItemType.Var === val) {
		res += 'Var';
	} else if (c_oAscItemType.VarP === val) {
		res += 'Varp';
	} else if (c_oAscItemType.Data === val) {
		res += 'Data';
	} else if (c_oAscItemType.Grand === val) {
		res += 'Total';
	} else if (c_oAscItemType.Blank === val) {
		res += 'Blank';
	}
	return res;
}

function FromXml_ST_DataConsolidateFunction(val) {
	var res = -1;
	if ("average" === val) {
		res = c_oAscDataConsolidateFunction.Average;
	} else if ("count" === val) {
		res = c_oAscDataConsolidateFunction.Count;
	} else if ("countNums" === val) {
		res = c_oAscDataConsolidateFunction.CountNums;
	} else if ("max" === val) {
		res = c_oAscDataConsolidateFunction.Max;
	} else if ("min" === val) {
		res = c_oAscDataConsolidateFunction.Min;
	} else if ("product" === val) {
		res = c_oAscDataConsolidateFunction.Product;
	} else if ("stdDev" === val) {
		res = c_oAscDataConsolidateFunction.StdDev;
	} else if ("stdDevp" === val) {
		res = c_oAscDataConsolidateFunction.StdDevp;
	} else if ("sum" === val) {
		res = c_oAscDataConsolidateFunction.Sum;
	} else if ("var" === val) {
		res = c_oAscDataConsolidateFunction.Var;
	} else if ("varp" === val) {
		res = c_oAscDataConsolidateFunction.Varp;
	}
	return res;
}
function ToXml_ST_DataConsolidateFunction(val) {
	var res = "";
	if (c_oAscDataConsolidateFunction.Average === val) {
		res = "average";
	} else if (c_oAscDataConsolidateFunction.Count === val) {
		res = "count";
	} else if (c_oAscDataConsolidateFunction.CountNums === val) {
		res = "countNums";
	} else if (c_oAscDataConsolidateFunction.Max === val) {
		res = "max";
	} else if (c_oAscDataConsolidateFunction.Min === val) {
		res = "min";
	} else if (c_oAscDataConsolidateFunction.Product === val) {
		res = "product";
	} else if (c_oAscDataConsolidateFunction.StdDev === val) {
		res = "stdDev";
	} else if (c_oAscDataConsolidateFunction.StdDevp === val) {
		res = "stdDevp";
	} else if (c_oAscDataConsolidateFunction.Sum === val) {
		res = "sum";
	} else if (c_oAscDataConsolidateFunction.Var === val) {
		res = "var";
	} else if (c_oAscDataConsolidateFunction.Varp === val) {
		res = "varp";
	}
	return res;
}

function FromXml_ST_ShowDataAs(val) {
	var res = -1;
	if ("normal" === val) {
		res = c_oAscShowDataAs.Normal;
	} else if ("difference" === val) {
		res = c_oAscShowDataAs.Difference;
	} else if ("percent" === val) {
		res = c_oAscShowDataAs.Percent;
	} else if ("percentDiff" === val) {
		res = c_oAscShowDataAs.PercentDiff;
	} else if ("runTotal" === val) {
		res = c_oAscShowDataAs.RunTotal;
	} else if ("percentOfRow" === val) {
		res = c_oAscShowDataAs.PercentOfRow;
	} else if ("percentOfCol" === val) {
		res = c_oAscShowDataAs.PercentOfCol;
	} else if ("percentOfTotal" === val) {
		res = c_oAscShowDataAs.PercentOfTotal;
	} else if ("index" === val) {
		res = c_oAscShowDataAs.Index;
	}
	return res;
}
function ToXml_ST_ShowDataAs(val) {
	var res = "";
	if (c_oAscShowDataAs.Normal === val) {
		res = "normal";
	} else if (c_oAscShowDataAs.Difference === val) {
		res = "difference";
	} else if (c_oAscShowDataAs.Percent === val) {
		res = "percent";
	} else if (c_oAscShowDataAs.PercentDiff === val) {
		res = "percentDiff";
	} else if (c_oAscShowDataAs.RunTotal === val) {
		res = "runTotal";
	} else if (c_oAscShowDataAs.PercentOfRow === val) {
		res = "percentOfRow";
	} else if (c_oAscShowDataAs.PercentOfCol === val) {
		res = "percentOfCol";
	} else if (c_oAscShowDataAs.PercentOfTotal === val) {
		res = "percentOfTotal";
	} else if (c_oAscShowDataAs.Index === val) {
		res = "index";
	}
	return res;
}

function FromXml_ST_FormatAction(val) {
	var res = -1;
	if ("blank" === val) {
		res = c_oAscFormatAction.Blank;
	} else if ("formatting" === val) {
		res = c_oAscFormatAction.Formatting;
	} else if ("drill" === val) {
		res = c_oAscFormatAction.Drill;
	} else if ("formula" === val) {
		res = c_oAscFormatAction.Formula;
	}
	return res;
}
function ToXml_ST_FormatAction(val) {
	var res = "";
	if (c_oAscFormatAction.Blank === val) {
		res = "blank";
	} else if (c_oAscFormatAction.Formatting === val) {
		res = "formatting";
	} else if (c_oAscFormatAction.Drill === val) {
		res = "drill";
	} else if (c_oAscFormatAction.Formula === val) {
		res = "formula";
	}
	return res;
}

function FromXml_ST_Scope(val) {
	var res = -1;
	if ("selection" === val) {
		res = c_oAscScope.Selection;
	} else if ("data" === val) {
		res = c_oAscScope.Data;
	} else if ("field" === val) {
		res = c_oAscScope.Field;
	}
	return res;
}
function ToXml_ST_Scope(val) {
	var res = "";
	if (c_oAscScope.Selection === val) {
		res = "selection";
	} else if (c_oAscScope.Data === val) {
		res = "data";
	} else if (c_oAscScope.Field === val) {
		res = "field";
	}
	return res;
}

function FromXml_ST_Type(val) {
	var res = -1;
	if ("none" === val) {
		res = c_oAscType.None;
	} else if ("all" === val) {
		res = c_oAscType.All;
	} else if ("row" === val) {
		res = c_oAscType.Row;
	} else if ("column" === val) {
		res = c_oAscType.Column;
	}
	return res;
}
function ToXml_ST_Type(val) {
	var res = "";
	if (c_oAscType.None === val) {
		res = "none";
	} else if (c_oAscType.All === val) {
		res = "all";
	} else if (c_oAscType.Row === val) {
		res = "row";
	} else if (c_oAscType.Column === val) {
		res = "column";
	}
	return res;
}

function FromXml_ST_PivotFilterType(val) {
	var res = -1;
	if ("unknown" === val) {
		res = c_oAscPivotFilterType.Unknown;
	} else if ("count" === val) {
		res = c_oAscPivotFilterType.Count;
	} else if ("percent" === val) {
		res = c_oAscPivotFilterType.Percent;
	} else if ("sum" === val) {
		res = c_oAscPivotFilterType.Sum;
	} else if ("captionEqual" === val) {
		res = c_oAscPivotFilterType.CaptionEqual;
	} else if ("captionNotEqual" === val) {
		res = c_oAscPivotFilterType.CaptionNotEqual;
	} else if ("captionBeginsWith" === val) {
		res = c_oAscPivotFilterType.CaptionBeginsWith;
	} else if ("captionNotBeginsWith" === val) {
		res = c_oAscPivotFilterType.CaptionNotBeginsWith;
	} else if ("captionEndsWith" === val) {
		res = c_oAscPivotFilterType.CaptionEndsWith;
	} else if ("captionNotEndsWith" === val) {
		res = c_oAscPivotFilterType.CaptionNotEndsWith;
	} else if ("captionContains" === val) {
		res = c_oAscPivotFilterType.CaptionContains;
	} else if ("captionNotContains" === val) {
		res = c_oAscPivotFilterType.CaptionNotContains;
	} else if ("captionGreaterThan" === val) {
		res = c_oAscPivotFilterType.CaptionGreaterThan;
	} else if ("captionGreaterThanOrEqual" === val) {
		res = c_oAscPivotFilterType.CaptionGreaterThanOrEqual;
	} else if ("captionLessThan" === val) {
		res = c_oAscPivotFilterType.CaptionLessThan;
	} else if ("captionLessThanOrEqual" === val) {
		res = c_oAscPivotFilterType.CaptionLessThanOrEqual;
	} else if ("captionBetween" === val) {
		res = c_oAscPivotFilterType.CaptionBetween;
	} else if ("captionNotBetween" === val) {
		res = c_oAscPivotFilterType.CaptionNotBetween;
	} else if ("valueEqual" === val) {
		res = c_oAscPivotFilterType.ValueEqual;
	} else if ("valueNotEqual" === val) {
		res = c_oAscPivotFilterType.ValueNotEqual;
	} else if ("valueGreaterThan" === val) {
		res = c_oAscPivotFilterType.ValueGreaterThan;
	} else if ("valueGreaterThanOrEqual" === val) {
		res = c_oAscPivotFilterType.ValueGreaterThanOrEqual;
	} else if ("valueLessThan" === val) {
		res = c_oAscPivotFilterType.ValueLessThan;
	} else if ("valueLessThanOrEqual" === val) {
		res = c_oAscPivotFilterType.ValueLessThanOrEqual;
	} else if ("valueBetween" === val) {
		res = c_oAscPivotFilterType.ValueBetween;
	} else if ("valueNotBetween" === val) {
		res = c_oAscPivotFilterType.ValueNotBetween;
	} else if ("dateEqual" === val) {
		res = c_oAscPivotFilterType.DateEqual;
	} else if ("dateNotEqual" === val) {
		res = c_oAscPivotFilterType.DateNotEqual;
	} else if ("dateOlderThan" === val) {
		res = c_oAscPivotFilterType.DateOlderThan;
	} else if ("dateOlderThanOrEqual" === val) {
		res = c_oAscPivotFilterType.DateOlderThanOrEqual;
	} else if ("dateNewerThan" === val) {
		res = c_oAscPivotFilterType.DateNewerThan;
	} else if ("dateNewerThanOrEqual" === val) {
		res = c_oAscPivotFilterType.DateNewerThanOrEqual;
	} else if ("dateBetween" === val) {
		res = c_oAscPivotFilterType.DateBetween;
	} else if ("dateNotBetween" === val) {
		res = c_oAscPivotFilterType.DateNotBetween;
	} else if ("tomorrow" === val) {
		res = c_oAscPivotFilterType.Tomorrow;
	} else if ("today" === val) {
		res = c_oAscPivotFilterType.Today;
	} else if ("yesterday" === val) {
		res = c_oAscPivotFilterType.Yesterday;
	} else if ("nextWeek" === val) {
		res = c_oAscPivotFilterType.NextWeek;
	} else if ("thisWeek" === val) {
		res = c_oAscPivotFilterType.ThisWeek;
	} else if ("lastWeek" === val) {
		res = c_oAscPivotFilterType.LastWeek;
	} else if ("nextMonth" === val) {
		res = c_oAscPivotFilterType.NextMonth;
	} else if ("thisMonth" === val) {
		res = c_oAscPivotFilterType.ThisMonth;
	} else if ("lastMonth" === val) {
		res = c_oAscPivotFilterType.LastMonth;
	} else if ("nextQuarter" === val) {
		res = c_oAscPivotFilterType.NextQuarter;
	} else if ("thisQuarter" === val) {
		res = c_oAscPivotFilterType.ThisQuarter;
	} else if ("lastQuarter" === val) {
		res = c_oAscPivotFilterType.LastQuarter;
	} else if ("nextYear" === val) {
		res = c_oAscPivotFilterType.NextYear;
	} else if ("thisYear" === val) {
		res = c_oAscPivotFilterType.ThisYear;
	} else if ("lastYear" === val) {
		res = c_oAscPivotFilterType.LastYear;
	} else if ("yearToDate" === val) {
		res = c_oAscPivotFilterType.YearToDate;
	} else if ("Q1" === val) {
		res = c_oAscPivotFilterType.Q1;
	} else if ("Q2" === val) {
		res = c_oAscPivotFilterType.Q2;
	} else if ("Q3" === val) {
		res = c_oAscPivotFilterType.Q3;
	} else if ("Q4" === val) {
		res = c_oAscPivotFilterType.Q4;
	} else if ("M1" === val) {
		res = c_oAscPivotFilterType.M1;
	} else if ("M2" === val) {
		res = c_oAscPivotFilterType.M2;
	} else if ("M3" === val) {
		res = c_oAscPivotFilterType.M3;
	} else if ("M4" === val) {
		res = c_oAscPivotFilterType.M4;
	} else if ("M5" === val) {
		res = c_oAscPivotFilterType.M5;
	} else if ("M6" === val) {
		res = c_oAscPivotFilterType.M6;
	} else if ("M7" === val) {
		res = c_oAscPivotFilterType.M7;
	} else if ("M8" === val) {
		res = c_oAscPivotFilterType.M8;
	} else if ("M9" === val) {
		res = c_oAscPivotFilterType.M9;
	} else if ("M10" === val) {
		res = c_oAscPivotFilterType.M10;
	} else if ("M11" === val) {
		res = c_oAscPivotFilterType.M11;
	} else if ("M12" === val) {
		res = c_oAscPivotFilterType.M12;
	}
	return res;
}
function ToXml_ST_PivotFilterType(val) {
	var res = "";
	if (c_oAscPivotFilterType.Unknown === val) {
		res = "unknown";
	} else if (c_oAscPivotFilterType.Count === val) {
		res = "count";
	} else if (c_oAscPivotFilterType.Percent === val) {
		res = "percent";
	} else if (c_oAscPivotFilterType.Sum === val) {
		res = "sum";
	} else if (c_oAscPivotFilterType.CaptionEqual === val) {
		res = "captionEqual";
	} else if (c_oAscPivotFilterType.CaptionNotEqual === val) {
		res = "captionNotEqual";
	} else if (c_oAscPivotFilterType.CaptionBeginsWith === val) {
		res = "captionBeginsWith";
	} else if (c_oAscPivotFilterType.CaptionNotBeginsWith === val) {
		res = "captionNotBeginsWith";
	} else if (c_oAscPivotFilterType.CaptionEndsWith === val) {
		res = "captionEndsWith";
	} else if (c_oAscPivotFilterType.CaptionNotEndsWith === val) {
		res = "captionNotEndsWith";
	} else if (c_oAscPivotFilterType.CaptionContains === val) {
		res = "captionContains";
	} else if (c_oAscPivotFilterType.CaptionNotContains === val) {
		res = "captionNotContains";
	} else if (c_oAscPivotFilterType.CaptionGreaterThan === val) {
		res = "captionGreaterThan";
	} else if (c_oAscPivotFilterType.CaptionGreaterThanOrEqual === val) {
		res = "captionGreaterThanOrEqual";
	} else if (c_oAscPivotFilterType.CaptionLessThan === val) {
		res = "captionLessThan";
	} else if (c_oAscPivotFilterType.CaptionLessThanOrEqual === val) {
		res = "captionLessThanOrEqual";
	} else if (c_oAscPivotFilterType.CaptionBetween === val) {
		res = "captionBetween";
	} else if (c_oAscPivotFilterType.CaptionNotBetween === val) {
		res = "captionNotBetween";
	} else if (c_oAscPivotFilterType.ValueEqual === val) {
		res = "valueEqual";
	} else if (c_oAscPivotFilterType.ValueNotEqual === val) {
		res = "valueNotEqual";
	} else if (c_oAscPivotFilterType.ValueGreaterThan === val) {
		res = "valueGreaterThan";
	} else if (c_oAscPivotFilterType.ValueGreaterThanOrEqual === val) {
		res = "valueGreaterThanOrEqual";
	} else if (c_oAscPivotFilterType.ValueLessThan === val) {
		res = "valueLessThan";
	} else if (c_oAscPivotFilterType.ValueLessThanOrEqual === val) {
		res = "valueLessThanOrEqual";
	} else if (c_oAscPivotFilterType.ValueBetween === val) {
		res = "valueBetween";
	} else if (c_oAscPivotFilterType.ValueNotBetween === val) {
		res = "valueNotBetween";
	} else if (c_oAscPivotFilterType.DateEqual === val) {
		res = "dateEqual";
	} else if (c_oAscPivotFilterType.DateNotEqual === val) {
		res = "dateNotEqual";
	} else if (c_oAscPivotFilterType.DateOlderThan === val) {
		res = "dateOlderThan";
	} else if (c_oAscPivotFilterType.DateOlderThanOrEqual === val) {
		res = "dateOlderThanOrEqual";
	} else if (c_oAscPivotFilterType.DateNewerThan === val) {
		res = "dateNewerThan";
	} else if (c_oAscPivotFilterType.DateNewerThanOrEqual === val) {
		res = "dateNewerThanOrEqual";
	} else if (c_oAscPivotFilterType.DateBetween === val) {
		res = "dateBetween";
	} else if (c_oAscPivotFilterType.DateNotBetween === val) {
		res = "dateNotBetween";
	} else if (c_oAscPivotFilterType.Tomorrow === val) {
		res = "tomorrow";
	} else if (c_oAscPivotFilterType.Today === val) {
		res = "today";
	} else if (c_oAscPivotFilterType.Yesterday === val) {
		res = "yesterday";
	} else if (c_oAscPivotFilterType.NextWeek === val) {
		res = "nextWeek";
	} else if (c_oAscPivotFilterType.ThisWeek === val) {
		res = "thisWeek";
	} else if (c_oAscPivotFilterType.LastWeek === val) {
		res = "lastWeek";
	} else if (c_oAscPivotFilterType.NextMonth === val) {
		res = "nextMonth";
	} else if (c_oAscPivotFilterType.ThisMonth === val) {
		res = "thisMonth";
	} else if (c_oAscPivotFilterType.LastMonth === val) {
		res = "lastMonth";
	} else if (c_oAscPivotFilterType.NextQuarter === val) {
		res = "nextQuarter";
	} else if (c_oAscPivotFilterType.ThisQuarter === val) {
		res = "thisQuarter";
	} else if (c_oAscPivotFilterType.LastQuarter === val) {
		res = "lastQuarter";
	} else if (c_oAscPivotFilterType.NextYear === val) {
		res = "nextYear";
	} else if (c_oAscPivotFilterType.ThisYear === val) {
		res = "thisYear";
	} else if (c_oAscPivotFilterType.LastYear === val) {
		res = "lastYear";
	} else if (c_oAscPivotFilterType.YearToDate === val) {
		res = "yearToDate";
	} else if (c_oAscPivotFilterType.Q1 === val) {
		res = "Q1";
	} else if (c_oAscPivotFilterType.Q2 === val) {
		res = "Q2";
	} else if (c_oAscPivotFilterType.Q3 === val) {
		res = "Q3";
	} else if (c_oAscPivotFilterType.Q4 === val) {
		res = "Q4";
	} else if (c_oAscPivotFilterType.M1 === val) {
		res = "M1";
	} else if (c_oAscPivotFilterType.M2 === val) {
		res = "M2";
	} else if (c_oAscPivotFilterType.M3 === val) {
		res = "M3";
	} else if (c_oAscPivotFilterType.M4 === val) {
		res = "M4";
	} else if (c_oAscPivotFilterType.M5 === val) {
		res = "M5";
	} else if (c_oAscPivotFilterType.M6 === val) {
		res = "M6";
	} else if (c_oAscPivotFilterType.M7 === val) {
		res = "M7";
	} else if (c_oAscPivotFilterType.M8 === val) {
		res = "M8";
	} else if (c_oAscPivotFilterType.M9 === val) {
		res = "M9";
	} else if (c_oAscPivotFilterType.M10 === val) {
		res = "M10";
	} else if (c_oAscPivotFilterType.M11 === val) {
		res = "M11";
	} else if (c_oAscPivotFilterType.M12 === val) {
		res = "M12";
	}
	return res;
}

function FromXml_ST_SortType(val) {
	var res = -1;
	if ("none" === val) {
		res = c_oAscSortType.None;
	} else if ("ascending" === val) {
		res = c_oAscSortType.Ascending;
	} else if ("descending" === val) {
		res = c_oAscSortType.Descending;
	} else if ("ascendingAlpha" === val) {
		res = c_oAscSortType.AscendingAlpha;
	} else if ("descendingAlpha" === val) {
		res = c_oAscSortType.DescendingAlpha;
	} else if ("ascendingNatural" === val) {
		res = c_oAscSortType.AscendingNatural;
	} else if ("descendingNatural" === val) {
		res = c_oAscSortType.DescendingNatural;
	}
	return res;
}
function ToXml_ST_SortType(val) {
	var res = "";
	if (c_oAscSortType.None === val) {
		res = "none";
	} else if (c_oAscSortType.Ascending === val) {
		res = "ascending";
	} else if (c_oAscSortType.Descending === val) {
		res = "descending";
	} else if (c_oAscSortType.AscendingAlpha === val) {
		res = "ascendingAlpha";
	} else if (c_oAscSortType.DescendingAlpha === val) {
		res = "descendingAlpha";
	} else if (c_oAscSortType.AscendingNatural === val) {
		res = "ascendingNatural";
	} else if (c_oAscSortType.DescendingNatural === val) {
		res = "descendingNatural";
	}
	return res;
}

function FromXml_ST_PivotAreaType(val) {
	var res = -1;
	if ("none" === val) {
		res = c_oAscPivotAreaType.None;
	} else if ("normal" === val) {
		res = c_oAscPivotAreaType.Normal;
	} else if ("data" === val) {
		res = c_oAscPivotAreaType.Data;
	} else if ("all" === val) {
		res = c_oAscPivotAreaType.All;
	} else if ("origin" === val) {
		res = c_oAscPivotAreaType.Origin;
	} else if ("button" === val) {
		res = c_oAscPivotAreaType.Button;
	} else if ("topEnd" === val) {
		res = c_oAscPivotAreaType.TopEnd;
	}
	return res;
}
function ToXml_ST_PivotAreaType(val) {
	var res = "";
	if (c_oAscPivotAreaType.None === val) {
		res = "none";
	} else if (c_oAscPivotAreaType.Normal === val) {
		res = "normal";
	} else if (c_oAscPivotAreaType.Data === val) {
		res = "data";
	} else if (c_oAscPivotAreaType.All === val) {
		res = "all";
	} else if (c_oAscPivotAreaType.Origin === val) {
		res = "origin";
	} else if (c_oAscPivotAreaType.Button === val) {
		res = "button";
	} else if (c_oAscPivotAreaType.TopEnd === val) {
		res = "topEnd";
	}
	return res;
}

function FromXml_ST_GroupBy(val) {
	var res = -1;
	if ("range" === val) {
		res = c_oAscGroupBy.Range;
	} else if ("seconds" === val) {
		res = c_oAscGroupBy.Seconds;
	} else if ("minutes" === val) {
		res = c_oAscGroupBy.Minutes;
	} else if ("hours" === val) {
		res = c_oAscGroupBy.Hours;
	} else if ("days" === val) {
		res = c_oAscGroupBy.Days;
	} else if ("months" === val) {
		res = c_oAscGroupBy.Months;
	} else if ("quarters" === val) {
		res = c_oAscGroupBy.Quarters;
	} else if ("years" === val) {
		res = c_oAscGroupBy.Years;
	}
	return res;
}
function ToXml_ST_GroupBy(val) {
	var res = "";
	if (c_oAscGroupBy.Range === val) {
		res = "range";
	} else if (c_oAscGroupBy.Seconds === val) {
		res = "seconds";
	} else if (c_oAscGroupBy.Minutes === val) {
		res = "minutes";
	} else if (c_oAscGroupBy.Hours === val) {
		res = "hours";
	} else if (c_oAscGroupBy.Days === val) {
		res = "days";
	} else if (c_oAscGroupBy.Months === val) {
		res = "months";
	} else if (c_oAscGroupBy.Quarters === val) {
		res = "quarters";
	} else if (c_oAscGroupBy.Years === val) {
		res = "years";
	}
	return res;
}

function FromXml_ST_SortMethod(val) {
	var res = -1;
	if ("stroke" === val) {
		res = c_oAscSortMethod.Stroke;
	} else if ("pinYin" === val) {
		res = c_oAscSortMethod.PinYin;
	} else if ("none" === val) {
		res = c_oAscSortMethod.None;
	}
	return res;
}
function ToXml_ST_SortMethod(val) {
	var res = "";
	if (c_oAscSortMethod.Stroke === val) {
		res = "stroke";
	} else if (c_oAscSortMethod.PinYin === val) {
		res = "pinYin";
	} else if (c_oAscSortMethod.None === val) {
		res = "none";
	}
	return res;
}

function FromXml_ST_DynamicFilterType(val) {
	var res = -1;
	if ("null" === val) {
		res = c_oAscDynamicFilterType.Null;
	} else if ("aboveAverage" === val) {
		res = c_oAscDynamicFilterType.AboveAverage;
	} else if ("belowAverage" === val) {
		res = c_oAscDynamicFilterType.BelowAverage;
	} else if ("tomorrow" === val) {
		res = c_oAscDynamicFilterType.Tomorrow;
	} else if ("today" === val) {
		res = c_oAscDynamicFilterType.Today;
	} else if ("yesterday" === val) {
		res = c_oAscDynamicFilterType.Yesterday;
	} else if ("nextWeek" === val) {
		res = c_oAscDynamicFilterType.NextWeek;
	} else if ("thisWeek" === val) {
		res = c_oAscDynamicFilterType.ThisWeek;
	} else if ("lastWeek" === val) {
		res = c_oAscDynamicFilterType.LastWeek;
	} else if ("nextMonth" === val) {
		res = c_oAscDynamicFilterType.NextMonth;
	} else if ("thisMonth" === val) {
		res = c_oAscDynamicFilterType.ThisMonth;
	} else if ("lastMonth" === val) {
		res = c_oAscDynamicFilterType.LastMonth;
	} else if ("nextQuarter" === val) {
		res = c_oAscDynamicFilterType.NextQuarter;
	} else if ("thisQuarter" === val) {
		res = c_oAscDynamicFilterType.ThisQuarter;
	} else if ("lastQuarter" === val) {
		res = c_oAscDynamicFilterType.LastQuarter;
	} else if ("nextYear" === val) {
		res = c_oAscDynamicFilterType.NextYear;
	} else if ("thisYear" === val) {
		res = c_oAscDynamicFilterType.ThisYear;
	} else if ("lastYear" === val) {
		res = c_oAscDynamicFilterType.LastYear;
	} else if ("yearToDate" === val) {
		res = c_oAscDynamicFilterType.YearToDate;
	} else if ("Q1" === val) {
		res = c_oAscDynamicFilterType.Q1;
	} else if ("Q2" === val) {
		res = c_oAscDynamicFilterType.Q2;
	} else if ("Q3" === val) {
		res = c_oAscDynamicFilterType.Q3;
	} else if ("Q4" === val) {
		res = c_oAscDynamicFilterType.Q4;
	} else if ("M1" === val) {
		res = c_oAscDynamicFilterType.M1;
	} else if ("M2" === val) {
		res = c_oAscDynamicFilterType.M2;
	} else if ("M3" === val) {
		res = c_oAscDynamicFilterType.M3;
	} else if ("M4" === val) {
		res = c_oAscDynamicFilterType.M4;
	} else if ("M5" === val) {
		res = c_oAscDynamicFilterType.M5;
	} else if ("M6" === val) {
		res = c_oAscDynamicFilterType.M6;
	} else if ("M7" === val) {
		res = c_oAscDynamicFilterType.M7;
	} else if ("M8" === val) {
		res = c_oAscDynamicFilterType.M8;
	} else if ("M9" === val) {
		res = c_oAscDynamicFilterType.M9;
	} else if ("M10" === val) {
		res = c_oAscDynamicFilterType.M10;
	} else if ("M11" === val) {
		res = c_oAscDynamicFilterType.M11;
	} else if ("M12" === val) {
		res = c_oAscDynamicFilterType.M12;
	}
	return res;
}
function ToXml_ST_DynamicFilterType(val) {
	var res = "";
	if (c_oAscDynamicFilterType.Null === val) {
		res = "null";
	} else if (c_oAscDynamicFilterType.AboveAverage === val) {
		res = "aboveAverage";
	} else if (c_oAscDynamicFilterType.BelowAverage === val) {
		res = "belowAverage";
	} else if (c_oAscDynamicFilterType.Tomorrow === val) {
		res = "tomorrow";
	} else if (c_oAscDynamicFilterType.Today === val) {
		res = "today";
	} else if (c_oAscDynamicFilterType.Yesterday === val) {
		res = "yesterday";
	} else if (c_oAscDynamicFilterType.NextWeek === val) {
		res = "nextWeek";
	} else if (c_oAscDynamicFilterType.ThisWeek === val) {
		res = "thisWeek";
	} else if (c_oAscDynamicFilterType.LastWeek === val) {
		res = "lastWeek";
	} else if (c_oAscDynamicFilterType.NextMonth === val) {
		res = "nextMonth";
	} else if (c_oAscDynamicFilterType.ThisMonth === val) {
		res = "thisMonth";
	} else if (c_oAscDynamicFilterType.LastMonth === val) {
		res = "lastMonth";
	} else if (c_oAscDynamicFilterType.NextQuarter === val) {
		res = "nextQuarter";
	} else if (c_oAscDynamicFilterType.ThisQuarter === val) {
		res = "thisQuarter";
	} else if (c_oAscDynamicFilterType.LastQuarter === val) {
		res = "lastQuarter";
	} else if (c_oAscDynamicFilterType.NextYear === val) {
		res = "nextYear";
	} else if (c_oAscDynamicFilterType.ThisYear === val) {
		res = "thisYear";
	} else if (c_oAscDynamicFilterType.LastYear === val) {
		res = "lastYear";
	} else if (c_oAscDynamicFilterType.YearToDate === val) {
		res = "yearToDate";
	} else if (c_oAscDynamicFilterType.Q1 === val) {
		res = "Q1";
	} else if (c_oAscDynamicFilterType.Q2 === val) {
		res = "Q2";
	} else if (c_oAscDynamicFilterType.Q3 === val) {
		res = "Q3";
	} else if (c_oAscDynamicFilterType.Q4 === val) {
		res = "Q4";
	} else if (c_oAscDynamicFilterType.M1 === val) {
		res = "M1";
	} else if (c_oAscDynamicFilterType.M2 === val) {
		res = "M2";
	} else if (c_oAscDynamicFilterType.M3 === val) {
		res = "M3";
	} else if (c_oAscDynamicFilterType.M4 === val) {
		res = "M4";
	} else if (c_oAscDynamicFilterType.M5 === val) {
		res = "M5";
	} else if (c_oAscDynamicFilterType.M6 === val) {
		res = "M6";
	} else if (c_oAscDynamicFilterType.M7 === val) {
		res = "M7";
	} else if (c_oAscDynamicFilterType.M8 === val) {
		res = "M8";
	} else if (c_oAscDynamicFilterType.M9 === val) {
		res = "M9";
	} else if (c_oAscDynamicFilterType.M10 === val) {
		res = "M10";
	} else if (c_oAscDynamicFilterType.M11 === val) {
		res = "M11";
	} else if (c_oAscDynamicFilterType.M12 === val) {
		res = "M12";
	}
	return res;
}

function FromXml_ST_CalendarType(val) {
	var res = -1;
	if ("gregorian" === val) {
		res = c_oAscCalendarType.Gregorian;
	} else if ("gregorianUs" === val) {
		res = c_oAscCalendarType.GregorianUs;
	} else if ("gregorianMeFrench" === val) {
		res = c_oAscCalendarType.GregorianMeFrench;
	} else if ("gregorianArabic" === val) {
		res = c_oAscCalendarType.GregorianArabic;
	} else if ("hijri" === val) {
		res = c_oAscCalendarType.Hijri;
	} else if ("hebrew" === val) {
		res = c_oAscCalendarType.Hebrew;
	} else if ("taiwan" === val) {
		res = c_oAscCalendarType.Taiwan;
	} else if ("japan" === val) {
		res = c_oAscCalendarType.Japan;
	} else if ("thai" === val) {
		res = c_oAscCalendarType.Thai;
	} else if ("korea" === val) {
		res = c_oAscCalendarType.Korea;
	} else if ("saka" === val) {
		res = c_oAscCalendarType.Saka;
	} else if ("gregorianXlitEnglish" === val) {
		res = c_oAscCalendarType.GregorianXlitEnglish;
	} else if ("gregorianXlitFrench" === val) {
		res = c_oAscCalendarType.GregorianXlitFrench;
	} else if ("none" === val) {
		res = c_oAscCalendarType.None;
	}
	return res;
}
function ToXml_ST_CalendarType(val) {
	var res = "";
	if (c_oAscCalendarType.Gregorian === val) {
		res = "gregorian";
	} else if (c_oAscCalendarType.GregorianUs === val) {
		res = "gregorianUs";
	} else if (c_oAscCalendarType.GregorianMeFrench === val) {
		res = "gregorianMeFrench";
	} else if (c_oAscCalendarType.GregorianArabic === val) {
		res = "gregorianArabic";
	} else if (c_oAscCalendarType.Hijri === val) {
		res = "hijri";
	} else if (c_oAscCalendarType.Hebrew === val) {
		res = "hebrew";
	} else if (c_oAscCalendarType.Taiwan === val) {
		res = "taiwan";
	} else if (c_oAscCalendarType.Japan === val) {
		res = "japan";
	} else if (c_oAscCalendarType.Thai === val) {
		res = "thai";
	} else if (c_oAscCalendarType.Korea === val) {
		res = "korea";
	} else if (c_oAscCalendarType.Saka === val) {
		res = "saka";
	} else if (c_oAscCalendarType.GregorianXlitEnglish === val) {
		res = "gregorianXlitEnglish";
	} else if (c_oAscCalendarType.GregorianXlitFrench === val) {
		res = "gregorianXlitFrench";
	} else if (c_oAscCalendarType.None === val) {
		res = "none";
	}
	return res;
}

function FromXml_ST_IconSetType(val) {
	var res = -1;
	if ("3Arrows" === val) {
		res = c_oAscIconSetType.ThreeArrows;
	} else if ("3ArrowsGray" === val) {
		res = c_oAscIconSetType.ThreeArrowsGray;
	} else if ("3Flags" === val) {
		res = c_oAscIconSetType.ThreeFlags;
	} else if ("3TrafficLights1" === val) {
		res = c_oAscIconSetType.ThreeTrafficLights1;
	} else if ("3TrafficLights2" === val) {
		res = c_oAscIconSetType.ThreeTrafficLights2;
	} else if ("3Signs" === val) {
		res = c_oAscIconSetType.ThreeSigns;
	} else if ("3Symbols" === val) {
		res = c_oAscIconSetType.ThreeSymbols;
	} else if ("3Symbols2" === val) {
		res = c_oAscIconSetType.ThreeSymbols2;
	} else if ("4Arrows" === val) {
		res = c_oAscIconSetType.FourArrows;
	} else if ("4ArrowsGray" === val) {
		res = c_oAscIconSetType.FourArrowsGray;
	} else if ("4RedToBlack" === val) {
		res = c_oAscIconSetType.FourRedToBlack;
	} else if ("4Rating" === val) {
		res = c_oAscIconSetType.FourRating;
	} else if ("4TrafficLights" === val) {
		res = c_oAscIconSetType.FourTrafficLights;
	} else if ("5Arrows" === val) {
		res = c_oAscIconSetType.FiveArrows;
	} else if ("5ArrowsGray" === val) {
		res = c_oAscIconSetType.FiveArrowsGray;
	} else if ("5Rating" === val) {
		res = c_oAscIconSetType.FiveRating;
	} else if ("5Quarters" === val) {
		res = c_oAscIconSetType.FiveQuarters;
	}
	return res;
}
function ToXml_ST_IconSetType(val) {
	var res = "";
	if (c_oAscIconSetType.ThreeArrows === val) {
		res = "3Arrows";
	} else if (c_oAscIconSetType.ThreeArrowsGray === val) {
		res = "3ArrowsGray";
	} else if (c_oAscIconSetType.ThreeFlags === val) {
		res = "3Flags";
	} else if (c_oAscIconSetType.ThreeTrafficLights1 === val) {
		res = "3TrafficLights1";
	} else if (c_oAscIconSetType.ThreeTrafficLights2 === val) {
		res = "3TrafficLights2";
	} else if (c_oAscIconSetType.ThreeSigns === val) {
		res = "3Signs";
	} else if (c_oAscIconSetType.ThreeSymbols === val) {
		res = "3Symbols";
	} else if (c_oAscIconSetType.ThreeSymbols2 === val) {
		res = "3Symbols2";
	} else if (c_oAscIconSetType.FourArrows === val) {
		res = "4Arrows";
	} else if (c_oAscIconSetType.FourArrowsGray === val) {
		res = "4ArrowsGray";
	} else if (c_oAscIconSetType.FourRedToBlack === val) {
		res = "4RedToBlack";
	} else if (c_oAscIconSetType.FourRating === val) {
		res = "4Rating";
	} else if (c_oAscIconSetType.FourTrafficLights === val) {
		res = "4TrafficLights";
	} else if (c_oAscIconSetType.FiveArrows === val) {
		res = "5Arrows";
	} else if (c_oAscIconSetType.FiveArrowsGray === val) {
		res = "5ArrowsGray";
	} else if (c_oAscIconSetType.FiveRating === val) {
		res = "5Rating";
	} else if (c_oAscIconSetType.FiveQuarters === val) {
		res = "5Quarters";
	}
	return res;
}

function FromXml_ST_SortBy(val) {
	var res = -1;
	if ("value" === val) {
		res = c_oAscSortBy.Value;
	} else if ("cellColor" === val) {
		res = c_oAscSortBy.CellColor;
	} else if ("fontColor" === val) {
		res = c_oAscSortBy.FontColor;
	} else if ("icon" === val) {
		res = c_oAscSortBy.Icon;
	}
	return res;
}
function ToXml_ST_SortBy(val) {
	var res = "";
	if (c_oAscSortBy.Value === val) {
		res = "value";
	} else if (c_oAscSortBy.CellColor === val) {
		res = "cellColor";
	} else if (c_oAscSortBy.FontColor === val) {
		res = "fontColor";
	} else if (c_oAscSortBy.Icon === val) {
		res = "icon";
	}
	return res;
}

function FromXml_ST_FilterOperator(val) {
	var res = -1;
	if ("equal" === val) {
		res = c_oAscFilterOperator.Equal;
	} else if ("lessThan" === val) {
		res = c_oAscFilterOperator.LessThan;
	} else if ("lessThanOrEqual" === val) {
		res = c_oAscFilterOperator.LessThanOrEqual;
	} else if ("notEqual" === val) {
		res = c_oAscFilterOperator.NotEqual;
	} else if ("greaterThanOrEqual" === val) {
		res = c_oAscFilterOperator.GreaterThanOrEqual;
	} else if ("greaterThan" === val) {
		res = c_oAscFilterOperator.GreaterThan;
	}
	return res;
}
function ToXml_ST_FilterOperator(val) {
	var res = "";
	if (c_oAscFilterOperator.Equal === val) {
		res = "equal";
	} else if (c_oAscFilterOperator.LessThan === val) {
		res = "lessThan";
	} else if (c_oAscFilterOperator.LessThanOrEqual === val) {
		res = "lessThanOrEqual";
	} else if (c_oAscFilterOperator.NotEqual === val) {
		res = "notEqual";
	} else if (c_oAscFilterOperator.GreaterThanOrEqual === val) {
		res = "greaterThanOrEqual";
	} else if (c_oAscFilterOperator.GreaterThan === val) {
		res = "greaterThan";
	}
	return res;
}

function FromXml_ST_DateTimeGrouping(val) {
	var res = -1;
	if ("year" === val) {
		res = c_oAscDateTimeGrouping.Year;
	} else if ("month" === val) {
		res = c_oAscDateTimeGrouping.Month;
	} else if ("day" === val) {
		res = c_oAscDateTimeGrouping.Day;
	} else if ("hour" === val) {
		res = c_oAscDateTimeGrouping.Hour;
	} else if ("minute" === val) {
		res = c_oAscDateTimeGrouping.Minute;
	} else if ("second" === val) {
		res = c_oAscDateTimeGrouping.Second;
	}
	return res;
}
function ToXml_ST_DateTimeGrouping(val) {
	var res = "";
	if (c_oAscDateTimeGrouping.Year === val) {
		res = "year";
	} else if (c_oAscDateTimeGrouping.Month === val) {
		res = "month";
	} else if (c_oAscDateTimeGrouping.Day === val) {
		res = "day";
	} else if (c_oAscDateTimeGrouping.Hour === val) {
		res = "hour";
	} else if (c_oAscDateTimeGrouping.Minute === val) {
		res = "minute";
	} else if (c_oAscDateTimeGrouping.Second === val) {
		res = "second";
	}
	return res;
}

function FromXml_ST_AllocationMethod(val) {
	var res = -1;
	if ("equalAllocation" === val) {
		res = c_oAscAllocationMethod.EqualAllocation;
	} else if ("equalIncrement" === val) {
		res = c_oAscAllocationMethod.EqualIncrement;
	} else if ("weightedAllocation" === val) {
		res = c_oAscAllocationMethod.WeightedAllocation;
	} else if ("weightedIncrement" === val) {
		res = c_oAscAllocationMethod.WeightedIncrement;
	}
	return res;
}
function ToXml_ST_AllocationMethod(val) {
	var res = "";
	if (c_oAscAllocationMethod.EqualAllocation === val) {
		res = "equalAllocation";
	} else if (c_oAscAllocationMethod.EqualIncrement === val) {
		res = "equalIncrement";
	} else if (c_oAscAllocationMethod.WeightedAllocation === val) {
		res = "weightedAllocation";
	} else if (c_oAscAllocationMethod.WeightedIncrement === val) {
		res = "weightedIncrement";
	}
	return res;
}

function CT_PivotCacheDefinition() {
//Attributes
	this.id = null;
	this.invalid = null;//false
	this.saveData = null;//true
	this.refreshOnLoad = null;//false
	this.optimizeMemory = null;//false
	this.enableRefresh = null;//true
	this.refreshedBy = null;
	this.refreshedDate = null;
	this.backgroundQuery = null;//false
	this.missingItemsLimit = null;
	this.createdVersion = null;//0
	this.refreshedVersion = null;//0
	this.minRefreshableVersion = null;//0
	this.recordCount = null;
	this.upgradeOnRefresh = null;//false
	this.tupleCache = null;//false
	this.supportSubquery = null;//false
	this.supportAdvancedDrill = null;//false
//Members
	this.cacheSource = null;
	this.cacheFields = null;
	this.cacheHierarchies = null;
	this.kpis = null;
	this.tupleCache = null;
	this.calculatedItems = null;
	this.calculatedMembers = null;
	this.dimensions = null;
	this.measureGroups = null;
	this.maps = null;
	this.extLst = null;
	//editor
	this.cacheRecords = null;
}
CT_PivotCacheDefinition.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["r:id"];
		if (undefined !== val) {
			this.id = AscCommon.unleakString(uq(val));
		}
		val = vals["invalid"];
		if (undefined !== val) {
			this.invalid = getBoolFromXml(val);
		}
		val = vals["saveData"];
		if (undefined !== val) {
			this.saveData = getBoolFromXml(val);
		}
		val = vals["refreshOnLoad"];
		if (undefined !== val) {
			this.refreshOnLoad = getBoolFromXml(val);
		}
		val = vals["optimizeMemory"];
		if (undefined !== val) {
			this.optimizeMemory = getBoolFromXml(val);
		}
		val = vals["enableRefresh"];
		if (undefined !== val) {
			this.enableRefresh = getBoolFromXml(val);
		}
		val = vals["refreshedBy"];
		if (undefined !== val) {
			this.refreshedBy = AscCommon.unleakString(uq(val));
		}
		val = vals["refreshedDate"];
		if (undefined !== val) {
			this.refreshedDate = val - 0;
		}
		val = vals["backgroundQuery"];
		if (undefined !== val) {
			this.backgroundQuery = getBoolFromXml(val);
		}
		val = vals["missingItemsLimit"];
		if (undefined !== val) {
			this.missingItemsLimit = val - 0;
		}
		val = vals["createdVersion"];
		if (undefined !== val) {
			this.createdVersion = val - 0;
		}
		val = vals["refreshedVersion"];
		if (undefined !== val) {
			this.refreshedVersion = val - 0;
		}
		val = vals["minRefreshableVersion"];
		if (undefined !== val) {
			this.minRefreshableVersion = val - 0;
		}
		val = vals["recordCount"];
		if (undefined !== val) {
			this.recordCount = val - 0;
		}
		val = vals["upgradeOnRefresh"];
		if (undefined !== val) {
			this.upgradeOnRefresh = getBoolFromXml(val);
		}
		val = vals["tupleCache"];
		if (undefined !== val) {
			this.tupleCache = getBoolFromXml(val);
		}
		val = vals["supportSubquery"];
		if (undefined !== val) {
			this.supportSubquery = getBoolFromXml(val);
		}
		val = vals["supportAdvancedDrill"];
		if (undefined !== val) {
			this.supportAdvancedDrill = getBoolFromXml(val);
		}
	}
};
CT_PivotCacheDefinition.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("pivotCacheDefinition" === elem) {
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
	} else if ("cacheSource" === elem) {
		newContext = new CT_CacheSource();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.cacheSource = newContext;
	} else if ("cacheFields" === elem) {
		newContext = new CT_CacheFields();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.cacheFields = newContext;
	} else if ("cacheHierarchies" === elem) {
		newContext = new CT_CacheHierarchies();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.cacheHierarchies = newContext;
	} else if ("kpis" === elem) {
		newContext = new CT_PCDKPIs();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.kpis = newContext;
	} else if ("tupleCache" === elem) {
		newContext = new CT_TupleCache();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.tupleCache = newContext;
	} else if ("calculatedItems" === elem) {
		newContext = new CT_CalculatedItems();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.calculatedItems = newContext;
	} else if ("calculatedMembers" === elem) {
		newContext = new CT_CalculatedMembers();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.calculatedMembers = newContext;
	} else if ("dimensions" === elem) {
		newContext = new CT_Dimensions();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.dimensions = newContext;
	} else if ("measureGroups" === elem) {
		newContext = new CT_MeasureGroups();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.measureGroups = newContext;
	} else if ("maps" === elem) {
		newContext = new CT_MeasureDimensionMaps();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.maps = newContext;
	} else if ("extLst" === elem) {
		newContext = new CT_ExtensionList();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.extLst = newContext;
	} else {
		newContext = null;
	}
	return newContext;
};
CT_PivotCacheDefinition.prototype.toXml = function(writer) {
	writer.WriteXmlString("<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>");
	writer.WriteXmlNodeStart("pivotCacheDefinition");
	writer.WriteXmlString(
		" xmlns=\"http://schemas.openxmlformats.org/spreadsheetml/2006/main\" xmlns:r=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships\"");
	//todo
	// if (null !== this.id) {
		// writer.WriteXmlAttributeStringEncode("r:id", this.id);
	// }
	if (null !== this.invalid) {
		writer.WriteXmlAttributeBool("invalid", this.invalid);
	}
	if (null !== this.saveData) {
		writer.WriteXmlAttributeBool("saveData", this.saveData);
	}
	if (null !== this.refreshOnLoad) {
		writer.WriteXmlAttributeBool("refreshOnLoad", this.refreshOnLoad);
	}
	if (null !== this.optimizeMemory) {
		writer.WriteXmlAttributeBool("optimizeMemory", this.optimizeMemory);
	}
	if (null !== this.enableRefresh) {
		writer.WriteXmlAttributeBool("enableRefresh", this.enableRefresh);
	}
	if (null !== this.refreshedBy) {
		writer.WriteXmlAttributeStringEncode("refreshedBy", this.refreshedBy);
	}
	if (null !== this.refreshedDate) {
		writer.WriteXmlAttributeNumber("refreshedDate", this.refreshedDate);
	}
	if (null !== this.backgroundQuery) {
		writer.WriteXmlAttributeBool("backgroundQuery", this.backgroundQuery);
	}
	if (null !== this.missingItemsLimit) {
		writer.WriteXmlAttributeNumber("missingItemsLimit", this.missingItemsLimit);
	}
	if (null !== this.createdVersion) {
		writer.WriteXmlAttributeNumber("createdVersion", this.createdVersion);
	}
	if (null !== this.refreshedVersion) {
		writer.WriteXmlAttributeNumber("refreshedVersion", this.refreshedVersion);
	}
	if (null !== this.minRefreshableVersion) {
		writer.WriteXmlAttributeNumber("minRefreshableVersion", this.minRefreshableVersion);
	}
	if (null !== this.recordCount) {
		writer.WriteXmlAttributeNumber("recordCount", this.recordCount);
	}
	if (null !== this.upgradeOnRefresh) {
		writer.WriteXmlAttributeBool("upgradeOnRefresh", this.upgradeOnRefresh);
	}
	if (null !== this.tupleCache) {
		writer.WriteXmlAttributeBool("tupleCache", this.tupleCache);
	}
	if (null !== this.supportSubquery) {
		writer.WriteXmlAttributeBool("supportSubquery", this.supportSubquery);
	}
	if (null !== this.supportAdvancedDrill) {
		writer.WriteXmlAttributeBool("supportAdvancedDrill", this.supportAdvancedDrill);
	}
	writer.WriteXmlNodeEnd("pivotCacheDefinition", true);
	if (null !== this.cacheSource) {
		this.cacheSource.toXml(writer, "cacheSource");
	}
	if (null !== this.cacheFields) {
		this.cacheFields.toXml(writer, "cacheFields");
	}
	if (null !== this.cacheHierarchies) {
		this.cacheHierarchies.toXml(writer, "cacheHierarchies");
	}
	if (null !== this.kpis) {
		this.kpis.toXml(writer, "kpis");
	}
	if (null !== this.tupleCache) {
		this.tupleCache.toXml(writer, "tupleCache");
	}
	if (null !== this.calculatedItems) {
		this.calculatedItems.toXml(writer, "calculatedItems");
	}
	if (null !== this.calculatedMembers) {
		this.calculatedMembers.toXml(writer, "calculatedMembers");
	}
	if (null !== this.dimensions) {
		this.dimensions.toXml(writer, "dimensions");
	}
	if (null !== this.measureGroups) {
		this.measureGroups.toXml(writer, "measureGroups");
	}
	if (null !== this.maps) {
		this.maps.toXml(writer, "maps");
	}
	if (null !== this.extLst) {
		this.extLst.toXml(writer, "extLst");
	}
	writer.WriteXmlNodeEnd("pivotCacheDefinition");
};
CT_PivotCacheDefinition.prototype.getFields = function () {
	return this.cacheFields && this.cacheFields.cacheField;
};
CT_PivotCacheDefinition.prototype.getRecords = function () {
	return this.cacheRecords && this.cacheRecords;
};
CT_PivotCacheDefinition.prototype.isValidCacheSource = function () {
	return this.cacheSource && this.cacheSource.type === c_oAscSourceType.Worksheet;
};
function CT_PivotCacheRecords() {
//Attributes
	this.count = null;
//Members
	this.extLst = null;
//internal
	this._cols = [];
	this._curColIndex = 0;
}
CT_PivotCacheRecords.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["count"];
		if (undefined !== val) {
			this.count = val - 0;
		}
	}
};
CT_PivotCacheRecords.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("pivotCacheRecords" === elem) {
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
	} else if ("r" === elem) {
		this._curColIndex = 0;
	} else {
		var newContextCandidate = this._getCol(this._curColIndex).onStartNode(elem, attr, uq);
		if (newContextCandidate) {
			newContext = newContextCandidate;
		} else if ("extLst" === elem) {
			newContext = new CT_ExtensionList();
			if (newContext.readAttributes) {
				newContext.readAttributes(attr, uq);
			}
			this.extLst = newContext;
		} else {
			newContext = null;
		}
	}
	return newContext;
};
CT_PivotCacheRecords.prototype.onEndNode = function(prevContext, elem) {
	if (this._getCol(this._curColIndex).onEndNode(prevContext, elem)) {
		this._curColIndex++;
	}
};
CT_PivotCacheRecords.prototype.toXml = function(writer) {
	writer.WriteXmlString("<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>");
	writer.WriteXmlNodeStart("pivotCacheRecords");
	writer.WriteXmlString(
		" xmlns=\"http://schemas.openxmlformats.org/spreadsheetml/2006/main\" xmlns:r=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships\"");
	if (null !== this.count) {
		writer.WriteXmlAttributeNumber("count", this.count);
	}
	writer.WriteXmlNodeEnd("pivotCacheRecords", true);
	if (null !== this._cols) {
		var rowsCount = this._cols[0].size;
		for (var i = 0; i < rowsCount; ++i) {
			writer.WriteXmlNodeStart("r", true);
			for (var j = 0; j < this._cols.length; ++j) {
				this._cols[j].toXml(writer, i);
			}
			writer.WriteXmlNodeEnd("r");
		}
	}
	if (null !== this.extLst) {
		this.extLst.toXml(writer, "extLst");
	}
	writer.WriteXmlNodeEnd("pivotCacheRecords");
};
CT_PivotCacheRecords.prototype.getRowsCount = function() {
	return null !== this._cols ? this._cols[0].size : 0;
};
CT_PivotCacheRecords.prototype.get = function(row, col) {
	var col = this._cols[col];
	if (col) {
		return col.get(row);
	}
};
CT_PivotCacheRecords.prototype._getCol = function(index) {
	var col = this._cols[index];
	if(!col){
		col = new PivotRecords();
		col.setStartCount(this.count);
		this._cols[index] = col;
	}
	return col;
};
function CT_pivotTableDefinition() {
//Attributes
	this.name = null;
	this.cacheId = null;
	this.dataOnRows = null;//false
	this.dataPosition = null;
	this.autoFormatId = null;
	this.applyNumberFormats = null;
	this.applyBorderFormats = null;
	this.applyFontFormats = null;
	this.applyPatternFormats = null;
	this.applyAlignmentFormats = null;
	this.applyWidthHeightFormats = null;
	this.dataCaption = null;
	this.grandTotalCaption = null;
	this.errorCaption = null;
	this.showError = null;//false
	this.missingCaption = null;
	this.showMissing = null;//true
	this.pageStyle = null;
	this.pivotTableStyle = null;
	this.vacatedStyle = null;
	this.tag = null;
	this.updatedVersion = null;//0
	this.minRefreshableVersion = null;//0
	this.asteriskTotals = null;//false
	this.showItems = null;//true
	this.editData = null;//false
	this.disableFieldList = null;//false
	this.showCalcMbrs = null;//true
	this.visualTotals = null;//true
	this.showMultipleLabel = null;//true
	this.showDataDropDown = null;//true
	this.showDrill = null;//true
	this.printDrill = null;//false
	this.showMemberPropertyTips = null;//true
	this.showDataTips = null;//true
	this.enableWizard = null;//true
	this.enableDrill = null;//true
	this.enableFieldProperties = null;//true
	this.preserveFormatting = null;//true
	this.useAutoFormatting = null;//false
	this.pageWrap = null;//0
	this.pageOverThenDown = null;//false
	this.subtotalHiddenItems = null;//false
	this.rowGrandTotals = null;//true
	this.colGrandTotals = null;//true
	this.fieldPrintTitles = null;//false
	this.itemPrintTitles = null;//false
	this.mergeItem = null;//false
	this.showDropZones = null;//true
	this.createdVersion = null;//0
	this.indent = null;//1
	this.showEmptyRow = null;//false
	this.showEmptyCol = null;//false
	this.showHeaders = null;//true
	this.compact = null;//true
	this.outline = null;//false
	this.outlineData = null;//false
	this.compactData = null;//true
	this.published = null;//false
	this.gridDropZones = null;//false
	this.immersive = null;//true
	this.multipleFieldFilters = null;//true
	this.chartFormat = null;//0
	this.rowHeaderCaption = null;
	this.colHeaderCaption = null;
	this.fieldListSortAscending = null;//false
	this.mdxSubqueries = null;//false
	this.customListSort = null;//true
//Members
	this.location = null;
	this.pivotFields = null;
	this.rowFields = null;
	this.rowItems = null;
	this.colFields = null;
	this.colItems = null;
	this.pageFields = null;
	this.dataFields = null;
	this.formats = null;
	this.conditionalFormats = null;
	this.chartFormats = null;
	this.pivotHierarchies = null;
	this.pivotTableStyleInfo = null;
	this.filters = null;
	this.rowHierarchiesUsage = null;
	this.colHierarchiesUsage = null;
	//ext
	this.pivotTableDefinitionX14 = null;
	//editor
	this.cacheDefinition = null;

	this.isInit = false;
	this.pageFieldsPositions = null;
	this.clearGrid = false;
	this.hasCompactField = true;

	this.worksheet = null;
	this.Id = AscCommon.g_oIdCounter.Get_NewId();
	AscCommon.g_oTableId.Add(this, this.Id);
}
CT_pivotTableDefinition.prototype.getObjectType = function () {
	return AscDFH.historyitem_type_PivotTableDefinition;
};
CT_pivotTableDefinition.prototype.Get_Id = function () {
	return this.Id;
};
CT_pivotTableDefinition.prototype.Write_ToBinary2 = function (w) {
	w.WriteLong(this.getObjectType());
	w.WriteString2(this.Id);
	w.WriteString2(this.worksheet ? this.worksheet.getId() : '-1');
};
CT_pivotTableDefinition.prototype.Read_FromBinary2 = function (r) {
	this.Id = r.GetString2();

	// ToDo not the best scheme for adding to a sheet...
	var api_sheet = Asc['editor'];
	this.worksheet = api_sheet.wbModel.getWorksheetById(r.GetString2());
	if (this.worksheet) {
		this.worksheet.insertPivotTable(this);
	}
};
CT_pivotTableDefinition.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["name"];
		if (undefined !== val) {
			this.name = AscCommon.unleakString(uq(val));
		}
		val = vals["cacheId"];
		if (undefined !== val) {
			this.cacheId = val - 0;
		}
		val = vals["dataOnRows"];
		if (undefined !== val) {
			this.dataOnRows = getBoolFromXml(val);
		}
		val = vals["dataPosition"];
		if (undefined !== val) {
			this.dataPosition = val - 0;
		}
		val = vals["autoFormatId"];
		if (undefined !== val) {
			this.autoFormatId = val - 0;
		}
		val = vals["applyNumberFormats"];
		if (undefined !== val) {
			this.applyNumberFormats = getBoolFromXml(val);
		}
		val = vals["applyBorderFormats"];
		if (undefined !== val) {
			this.applyBorderFormats = getBoolFromXml(val);
		}
		val = vals["applyFontFormats"];
		if (undefined !== val) {
			this.applyFontFormats = getBoolFromXml(val);
		}
		val = vals["applyPatternFormats"];
		if (undefined !== val) {
			this.applyPatternFormats = getBoolFromXml(val);
		}
		val = vals["applyAlignmentFormats"];
		if (undefined !== val) {
			this.applyAlignmentFormats = getBoolFromXml(val);
		}
		val = vals["applyWidthHeightFormats"];
		if (undefined !== val) {
			this.applyWidthHeightFormats = getBoolFromXml(val);
		}
		val = vals["dataCaption"];
		if (undefined !== val) {
			this.dataCaption = AscCommon.unleakString(uq(val));
		}
		val = vals["grandTotalCaption"];
		if (undefined !== val) {
			this.grandTotalCaption = AscCommon.unleakString(uq(val));
		}
		val = vals["errorCaption"];
		if (undefined !== val) {
			this.errorCaption = AscCommon.unleakString(uq(val));
		}
		val = vals["showError"];
		if (undefined !== val) {
			this.showError = getBoolFromXml(val);
		}
		val = vals["missingCaption"];
		if (undefined !== val) {
			this.missingCaption = AscCommon.unleakString(uq(val));
		}
		val = vals["showMissing"];
		if (undefined !== val) {
			this.showMissing = getBoolFromXml(val);
		}
		val = vals["pageStyle"];
		if (undefined !== val) {
			this.pageStyle = AscCommon.unleakString(uq(val));
		}
		val = vals["pivotTableStyle"];
		if (undefined !== val) {
			this.pivotTableStyle = AscCommon.unleakString(uq(val));
		}
		val = vals["vacatedStyle"];
		if (undefined !== val) {
			this.vacatedStyle = AscCommon.unleakString(uq(val));
		}
		val = vals["tag"];
		if (undefined !== val) {
			this.tag = AscCommon.unleakString(uq(val));
		}
		val = vals["updatedVersion"];
		if (undefined !== val) {
			this.updatedVersion = val - 0;
		}
		val = vals["minRefreshableVersion"];
		if (undefined !== val) {
			this.minRefreshableVersion = val - 0;
		}
		val = vals["asteriskTotals"];
		if (undefined !== val) {
			this.asteriskTotals = getBoolFromXml(val);
		}
		val = vals["showItems"];
		if (undefined !== val) {
			this.showItems = getBoolFromXml(val);
		}
		val = vals["editData"];
		if (undefined !== val) {
			this.editData = getBoolFromXml(val);
		}
		val = vals["disableFieldList"];
		if (undefined !== val) {
			this.disableFieldList = getBoolFromXml(val);
		}
		val = vals["showCalcMbrs"];
		if (undefined !== val) {
			this.showCalcMbrs = getBoolFromXml(val);
		}
		val = vals["visualTotals"];
		if (undefined !== val) {
			this.visualTotals = getBoolFromXml(val);
		}
		val = vals["showMultipleLabel"];
		if (undefined !== val) {
			this.showMultipleLabel = getBoolFromXml(val);
		}
		val = vals["showDataDropDown"];
		if (undefined !== val) {
			this.showDataDropDown = getBoolFromXml(val);
		}
		val = vals["showDrill"];
		if (undefined !== val) {
			this.showDrill = getBoolFromXml(val);
		}
		val = vals["printDrill"];
		if (undefined !== val) {
			this.printDrill = getBoolFromXml(val);
		}
		val = vals["showMemberPropertyTips"];
		if (undefined !== val) {
			this.showMemberPropertyTips = getBoolFromXml(val);
		}
		val = vals["showDataTips"];
		if (undefined !== val) {
			this.showDataTips = getBoolFromXml(val);
		}
		val = vals["enableWizard"];
		if (undefined !== val) {
			this.enableWizard = getBoolFromXml(val);
		}
		val = vals["enableDrill"];
		if (undefined !== val) {
			this.enableDrill = getBoolFromXml(val);
		}
		val = vals["enableFieldProperties"];
		if (undefined !== val) {
			this.enableFieldProperties = getBoolFromXml(val);
		}
		val = vals["preserveFormatting"];
		if (undefined !== val) {
			this.preserveFormatting = getBoolFromXml(val);
		}
		val = vals["useAutoFormatting"];
		if (undefined !== val) {
			this.useAutoFormatting = getBoolFromXml(val);
		}
		val = vals["pageWrap"];
		if (undefined !== val) {
			this.pageWrap = val - 0;
		}
		val = vals["pageOverThenDown"];
		if (undefined !== val) {
			this.pageOverThenDown = getBoolFromXml(val);
		}
		val = vals["subtotalHiddenItems"];
		if (undefined !== val) {
			this.subtotalHiddenItems = getBoolFromXml(val);
		}
		val = vals["rowGrandTotals"];
		if (undefined !== val) {
			this.rowGrandTotals = getBoolFromXml(val);
		}
		val = vals["colGrandTotals"];
		if (undefined !== val) {
			this.colGrandTotals = getBoolFromXml(val);
		}
		val = vals["fieldPrintTitles"];
		if (undefined !== val) {
			this.fieldPrintTitles = getBoolFromXml(val);
		}
		val = vals["itemPrintTitles"];
		if (undefined !== val) {
			this.itemPrintTitles = getBoolFromXml(val);
		}
		val = vals["mergeItem"];
		if (undefined !== val) {
			this.mergeItem = getBoolFromXml(val);
		}
		val = vals["showDropZones"];
		if (undefined !== val) {
			this.showDropZones = getBoolFromXml(val);
		}
		val = vals["createdVersion"];
		if (undefined !== val) {
			this.createdVersion = val - 0;
		}
		val = vals["indent"];
		if (undefined !== val) {
			this.indent = val - 0;
		}
		val = vals["showEmptyRow"];
		if (undefined !== val) {
			this.showEmptyRow = getBoolFromXml(val);
		}
		val = vals["showEmptyCol"];
		if (undefined !== val) {
			this.showEmptyCol = getBoolFromXml(val);
		}
		val = vals["showHeaders"];
		if (undefined !== val) {
			this.showHeaders = getBoolFromXml(val);
		}
		val = vals["compact"];
		if (undefined !== val) {
			this.compact = getBoolFromXml(val);
		}
		val = vals["outline"];
		if (undefined !== val) {
			this.outline = getBoolFromXml(val);
		}
		val = vals["outlineData"];
		if (undefined !== val) {
			this.outlineData = getBoolFromXml(val);
		}
		val = vals["compactData"];
		if (undefined !== val) {
			this.compactData = getBoolFromXml(val);
		}
		val = vals["published"];
		if (undefined !== val) {
			this.published = getBoolFromXml(val);
		}
		val = vals["gridDropZones"];
		if (undefined !== val) {
			this.gridDropZones = getBoolFromXml(val);
		}
		val = vals["immersive"];
		if (undefined !== val) {
			this.immersive = getBoolFromXml(val);
		}
		val = vals["multipleFieldFilters"];
		if (undefined !== val) {
			this.multipleFieldFilters = getBoolFromXml(val);
		}
		val = vals["chartFormat"];
		if (undefined !== val) {
			this.chartFormat = val - 0;
		}
		val = vals["rowHeaderCaption"];
		if (undefined !== val) {
			this.rowHeaderCaption = AscCommon.unleakString(uq(val));
		}
		val = vals["colHeaderCaption"];
		if (undefined !== val) {
			this.colHeaderCaption = AscCommon.unleakString(uq(val));
		}
		val = vals["fieldListSortAscending"];
		if (undefined !== val) {
			this.fieldListSortAscending = getBoolFromXml(val);
		}
		val = vals["mdxSubqueries"];
		if (undefined !== val) {
			this.mdxSubqueries = getBoolFromXml(val);
		}
		val = vals["customListSort"];
		if (undefined !== val) {
			this.customListSort = getBoolFromXml(val);
		}
	}
};
CT_pivotTableDefinition.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("pivotTableDefinition" === elem) {
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
	} else if ("location" === elem) {
		newContext = new CT_Location();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.location = newContext;
	} else if ("pivotFields" === elem) {
		newContext = new CT_PivotFields();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.pivotFields = newContext;
	} else if ("rowFields" === elem) {
		newContext = new CT_RowFields();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.rowFields = newContext;
	} else if ("rowItems" === elem) {
		newContext = new CT_rowItems();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.rowItems = newContext;
	} else if ("colFields" === elem) {
		newContext = new CT_ColFields();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.colFields = newContext;
	} else if ("colItems" === elem) {
		newContext = new CT_colItems();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.colItems = newContext;
	} else if ("pageFields" === elem) {
		newContext = new CT_PageFields();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.pageFields = newContext;
	} else if ("dataFields" === elem) {
		newContext = new CT_DataFields();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.dataFields = newContext;
	} else if ("formats" === elem) {
		newContext = new CT_Formats();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.formats = newContext;
	} else if ("conditionalFormats" === elem) {
		newContext = new CT_ConditionalFormats();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.conditionalFormats = newContext;
	} else if ("chartFormats" === elem) {
		newContext = new CT_ChartFormats();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.chartFormats = newContext;
	} else if ("pivotHierarchies" === elem) {
		newContext = new CT_PivotHierarchies();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.pivotHierarchies = newContext;
	} else if ("pivotTableStyleInfo" === elem) {
		newContext = new CT_PivotTableStyle();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.pivotTableStyleInfo = newContext;
	} else if ("filters" === elem) {
		newContext = new CT_PivotFilters();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.filters = newContext;
	} else if ("rowHierarchiesUsage" === elem) {
		newContext = new CT_RowHierarchiesUsage();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.rowHierarchiesUsage = newContext;
	} else if ("colHierarchiesUsage" === elem) {
		newContext = new CT_ColHierarchiesUsage();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.colHierarchiesUsage = newContext;
	} else if ("extLst" === elem) {
		newContext = new CT_ExtensionList();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
	} else {
		newContext = null;
	}
	return newContext;
};
CT_pivotTableDefinition.prototype.onEndNode = function(prevContext, elem) {
	if ("extLst" === elem) {
		for (var i = 0; i < prevContext.ext.length; ++i) {
			var ext = prevContext.ext[i];
			if ('{962EF5D1-5CA2-4c93-8EF4-DBF5C05439D2}' == ext.uri) {
				this.pivotTableDefinitionX14 = ext.elem;
			}
		}
	}
};
CT_pivotTableDefinition.prototype.toXml = function(writer) {
	writer.WriteXmlString("<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>");
	writer.WriteXmlNodeStart("pivotTableDefinition");
	writer.WriteXmlString(
		" xmlns=\"http://schemas.openxmlformats.org/spreadsheetml/2006/main\" xmlns:r=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships\"");
	if (null !== this.name) {
		writer.WriteXmlAttributeStringEncode("name", this.name);
	}
	if (null !== this.cacheId) {
		writer.WriteXmlAttributeNumber("cacheId", this.cacheId);
	}
	if (null !== this.dataOnRows) {
		writer.WriteXmlAttributeBool("dataOnRows", this.dataOnRows);
	}
	if (null !== this.dataPosition) {
		writer.WriteXmlAttributeNumber("dataPosition", this.dataPosition);
	}
	if (null !== this.autoFormatId) {
		writer.WriteXmlAttributeNumber("autoFormatId", this.autoFormatId);
	}
	if (null !== this.applyNumberFormats) {
		writer.WriteXmlAttributeBool("applyNumberFormats", this.applyNumberFormats);
	}
	if (null !== this.applyBorderFormats) {
		writer.WriteXmlAttributeBool("applyBorderFormats", this.applyBorderFormats);
	}
	if (null !== this.applyFontFormats) {
		writer.WriteXmlAttributeBool("applyFontFormats", this.applyFontFormats);
	}
	if (null !== this.applyPatternFormats) {
		writer.WriteXmlAttributeBool("applyPatternFormats", this.applyPatternFormats);
	}
	if (null !== this.applyAlignmentFormats) {
		writer.WriteXmlAttributeBool("applyAlignmentFormats", this.applyAlignmentFormats);
	}
	if (null !== this.applyWidthHeightFormats) {
		writer.WriteXmlAttributeBool("applyWidthHeightFormats", this.applyWidthHeightFormats);
	}
	if (null !== this.dataCaption) {
		writer.WriteXmlAttributeStringEncode("dataCaption", this.dataCaption);
	}
	if (null !== this.grandTotalCaption) {
		writer.WriteXmlAttributeStringEncode("grandTotalCaption", this.grandTotalCaption);
	}
	if (null !== this.errorCaption) {
		writer.WriteXmlAttributeStringEncode("errorCaption", this.errorCaption);
	}
	if (null !== this.showError) {
		writer.WriteXmlAttributeBool("showError", this.showError);
	}
	if (null !== this.missingCaption) {
		writer.WriteXmlAttributeStringEncode("missingCaption", this.missingCaption);
	}
	if (null !== this.showMissing) {
		writer.WriteXmlAttributeBool("showMissing", this.showMissing);
	}
	if (null !== this.pageStyle) {
		writer.WriteXmlAttributeStringEncode("pageStyle", this.pageStyle);
	}
	if (null !== this.pivotTableStyle) {
		writer.WriteXmlAttributeStringEncode("pivotTableStyle", this.pivotTableStyle);
	}
	if (null !== this.vacatedStyle) {
		writer.WriteXmlAttributeStringEncode("vacatedStyle", this.vacatedStyle);
	}
	if (null !== this.tag) {
		writer.WriteXmlAttributeStringEncode("tag", this.tag);
	}
	if (null !== this.updatedVersion) {
		writer.WriteXmlAttributeNumber("updatedVersion", this.updatedVersion);
	}
	if (null !== this.minRefreshableVersion) {
		writer.WriteXmlAttributeNumber("minRefreshableVersion", this.minRefreshableVersion);
	}
	if (null !== this.asteriskTotals) {
		writer.WriteXmlAttributeBool("asteriskTotals", this.asteriskTotals);
	}
	if (null !== this.showItems) {
		writer.WriteXmlAttributeBool("showItems", this.showItems);
	}
	if (null !== this.editData) {
		writer.WriteXmlAttributeBool("editData", this.editData);
	}
	if (null !== this.disableFieldList) {
		writer.WriteXmlAttributeBool("disableFieldList", this.disableFieldList);
	}
	if (null !== this.showCalcMbrs) {
		writer.WriteXmlAttributeBool("showCalcMbrs", this.showCalcMbrs);
	}
	if (null !== this.visualTotals) {
		writer.WriteXmlAttributeBool("visualTotals", this.visualTotals);
	}
	if (null !== this.showMultipleLabel) {
		writer.WriteXmlAttributeBool("showMultipleLabel", this.showMultipleLabel);
	}
	if (null !== this.showDataDropDown) {
		writer.WriteXmlAttributeBool("showDataDropDown", this.showDataDropDown);
	}
	if (null !== this.showDrill) {
		writer.WriteXmlAttributeBool("showDrill", this.showDrill);
	}
	if (null !== this.printDrill) {
		writer.WriteXmlAttributeBool("printDrill", this.printDrill);
	}
	if (null !== this.showMemberPropertyTips) {
		writer.WriteXmlAttributeBool("showMemberPropertyTips", this.showMemberPropertyTips);
	}
	if (null !== this.showDataTips) {
		writer.WriteXmlAttributeBool("showDataTips", this.showDataTips);
	}
	if (null !== this.enableWizard) {
		writer.WriteXmlAttributeBool("enableWizard", this.enableWizard);
	}
	if (null !== this.enableDrill) {
		writer.WriteXmlAttributeBool("enableDrill", this.enableDrill);
	}
	if (null !== this.enableFieldProperties) {
		writer.WriteXmlAttributeBool("enableFieldProperties", this.enableFieldProperties);
	}
	if (null !== this.preserveFormatting) {
		writer.WriteXmlAttributeBool("preserveFormatting", this.preserveFormatting);
	}
	if (null !== this.useAutoFormatting) {
		writer.WriteXmlAttributeBool("useAutoFormatting", this.useAutoFormatting);
	}
	if (null !== this.pageWrap) {
		writer.WriteXmlAttributeNumber("pageWrap", this.pageWrap);
	}
	if (null !== this.pageOverThenDown) {
		writer.WriteXmlAttributeBool("pageOverThenDown", this.pageOverThenDown);
	}
	if (null !== this.subtotalHiddenItems) {
		writer.WriteXmlAttributeBool("subtotalHiddenItems", this.subtotalHiddenItems);
	}
	if (null !== this.rowGrandTotals) {
		writer.WriteXmlAttributeBool("rowGrandTotals", this.rowGrandTotals);
	}
	if (null !== this.colGrandTotals) {
		writer.WriteXmlAttributeBool("colGrandTotals", this.colGrandTotals);
	}
	if (null !== this.fieldPrintTitles) {
		writer.WriteXmlAttributeBool("fieldPrintTitles", this.fieldPrintTitles);
	}
	if (null !== this.itemPrintTitles) {
		writer.WriteXmlAttributeBool("itemPrintTitles", this.itemPrintTitles);
	}
	if (null !== this.mergeItem) {
		writer.WriteXmlAttributeBool("mergeItem", this.mergeItem);
	}
	if (null !== this.showDropZones) {
		writer.WriteXmlAttributeBool("showDropZones", this.showDropZones);
	}
	if (null !== this.createdVersion) {
		writer.WriteXmlAttributeNumber("createdVersion", this.createdVersion);
	}
	if (null !== this.indent) {
		writer.WriteXmlAttributeNumber("indent", this.indent);
	}
	if (null !== this.showEmptyRow) {
		writer.WriteXmlAttributeBool("showEmptyRow", this.showEmptyRow);
	}
	if (null !== this.showEmptyCol) {
		writer.WriteXmlAttributeBool("showEmptyCol", this.showEmptyCol);
	}
	if (null !== this.showHeaders) {
		writer.WriteXmlAttributeBool("showHeaders", this.showHeaders);
	}
	if (null !== this.compact) {
		writer.WriteXmlAttributeBool("compact", this.compact);
	}
	if (null !== this.outline) {
		writer.WriteXmlAttributeBool("outline", this.outline);
	}
	if (null !== this.outlineData) {
		writer.WriteXmlAttributeBool("outlineData", this.outlineData);
	}
	if (null !== this.compactData) {
		writer.WriteXmlAttributeBool("compactData", this.compactData);
	}
	if (null !== this.published) {
		writer.WriteXmlAttributeBool("published", this.published);
	}
	if (null !== this.gridDropZones) {
		writer.WriteXmlAttributeBool("gridDropZones", this.gridDropZones);
	}
	if (null !== this.immersive) {
		writer.WriteXmlAttributeBool("immersive", this.immersive);
	}
	if (null !== this.multipleFieldFilters) {
		writer.WriteXmlAttributeBool("multipleFieldFilters", this.multipleFieldFilters);
	}
	if (null !== this.chartFormat) {
		writer.WriteXmlAttributeNumber("chartFormat", this.chartFormat);
	}
	if (null !== this.rowHeaderCaption) {
		writer.WriteXmlAttributeStringEncode("rowHeaderCaption", this.rowHeaderCaption);
	}
	if (null !== this.colHeaderCaption) {
		writer.WriteXmlAttributeStringEncode("colHeaderCaption", this.colHeaderCaption);
	}
	if (null !== this.fieldListSortAscending) {
		writer.WriteXmlAttributeBool("fieldListSortAscending", this.fieldListSortAscending);
	}
	if (null !== this.mdxSubqueries) {
		writer.WriteXmlAttributeBool("mdxSubqueries", this.mdxSubqueries);
	}
	if (null !== this.customListSort) {
		writer.WriteXmlAttributeBool("customListSort", this.customListSort);
	}
	writer.WriteXmlNodeEnd("pivotTableDefinition", true);
	if (null !== this.location) {
		this.location.toXml(writer, "location");
	}
	if (null !== this.pivotFields) {
		this.pivotFields.toXml(writer, "pivotFields");
	}
	if (null !== this.rowFields) {
		this.rowFields.toXml(writer, "rowFields");
	}
	if (null !== this.rowItems) {
		this.rowItems.toXml(writer, "rowItems");
	}
	if (null !== this.colFields) {
		this.colFields.toXml(writer, "colFields");
	}
	if (null !== this.colItems) {
		this.colItems.toXml(writer, "colItems");
	}
	if (null !== this.pageFields) {
		this.pageFields.toXml(writer, "pageFields");
	}
	if (null !== this.dataFields) {
		this.dataFields.toXml(writer, "dataFields");
	}
	if (null !== this.formats) {
		this.formats.toXml(writer, "formats");
	}
	if (null !== this.conditionalFormats) {
		this.conditionalFormats.toXml(writer, "conditionalFormats");
	}
	if (null !== this.chartFormats) {
		this.chartFormats.toXml(writer, "chartFormats");
	}
	if (null !== this.pivotHierarchies) {
		this.pivotHierarchies.toXml(writer, "pivotHierarchies");
	}
	if (null !== this.pivotTableStyleInfo) {
		this.pivotTableStyleInfo.toXml(writer, "pivotTableStyleInfo");
	}
	if (null !== this.filters) {
		this.filters.toXml(writer, "filters");
	}
	if (null !== this.rowHierarchiesUsage) {
		this.rowHierarchiesUsage.toXml(writer, "rowHierarchiesUsage");
	}
	if (null !== this.colHierarchiesUsage) {
		this.colHierarchiesUsage.toXml(writer, "colHierarchiesUsage");
	}
	if (null !== this.pivotTableDefinitionX14) {
		var ext = new CT_Extension();
		ext.uri = "{962EF5D1-5CA2-4c93-8EF4-DBF5C05439D2}";
		ext.elem = this.pivotTableDefinitionX14;
		var extList = new CT_ExtensionList();
		extList.ext.push(ext);
		extList.toXml(writer, "extLst");
	}
	writer.WriteXmlNodeEnd("pivotTableDefinition");
};
CT_pivotTableDefinition.prototype.init = function () {
	this.isInit = true;
	this.pageFieldsPositions = [];

	var rowPageCount = null, colPageCount = null;

	if (this.pageFields) {
		var wrap, pageOverThenDown;
		var l = this.pageFields.pageField.length;
		var dr;
		if (0 < l) {
			if (this.pageWrap) {
				dr = this.pageOverThenDown ? Math.ceil(l / this.pageWrap) : Math.min(this.pageWrap, l);
			} else {
				dr = this.pageOverThenDown ? 1 : l;
			}
			var range = this.getRange();
			var _c = range.c1;
			var _r = range.r1 - 1 - dr;
			var c = _c, r = _r;
			var minC = _c, minR = _r, maxC = _c, maxR = _r;

			for (var i = 0; i < l; ++i) {
				this.pageFieldsPositions.push(new AscCommon.CellBase(r, c));
				maxR = Math.max(maxR, r);
				maxC = Math.max(maxC, c);

				wrap = (this.pageWrap && 0 === (i + 1) % this.pageWrap);
				pageOverThenDown = this.pageOverThenDown;
				if (wrap) {
					_r += pageOverThenDown;
					_c += !pageOverThenDown;
					pageOverThenDown = !pageOverThenDown;
				}
				if (pageOverThenDown) {
					r = _r;
					c += 3;
				} else {
					++r;
					c = _c;
				}
			}
			rowPageCount = maxR - minR + 1;
			colPageCount = (maxC - minC) / 3 + 1;
		}
	}

	this.location.setPageCount(rowPageCount, colPageCount);
	this.updatePivotType();
};
CT_pivotTableDefinition.prototype.updatePivotType = function () {
	this.clearGrid = false;
	this.hasCompactField = false;
	var pivotFields = this.asc_getPivotFields();
	var rowFields = this.asc_getRowFields();
	if (rowFields) {
		var i, index;
		for (i = 0; i < rowFields.length; ++i) {
			index = rowFields[i].asc_getIndex();
			if (st_VALUES !== index && false !== pivotFields[index].outline) {
				this.clearGrid = true;
				break;
			}
		}
		for (i = 0; i < pivotFields.length; ++i) {
			if (false !== pivotFields[i].compact) {
				this.hasCompactField = true;
				break;
			}
		}
	}
};
CT_pivotTableDefinition.prototype.hasCompact = function () {
	return false !== this.compactData || this.hasCompactField;
};
CT_pivotTableDefinition.prototype.intersection = function (range) {
	return (this.location && this.location.intersection(range)) || this.pageFieldsIntersection(range);
};
CT_pivotTableDefinition.prototype.isIntersectForShift = function (range, offset) {
	var ref = this.location && (this.location.refWithPage || this.location.ref);
	return (ref && range.isIntersectForShift(ref, offset));
};
CT_pivotTableDefinition.prototype.pageFieldsIntersection = function (range) {
	return this.pageFieldsPositions && this.pageFieldsPositions.some(function (element) {
			return Array.isArray(range) ? range.some(function (elementRange) {
				return (elementRange.contains(element.col, element.row) ||
				elementRange.contains(element.col + 1, element.row));
			}) : (range.contains(element.col, element.row) || range.contains(element.col + 1, element.row));
		});
};
CT_pivotTableDefinition.prototype.contains = function (col, row) {
	return (this.location && this.location.contains(col, row)) ||
		this.pageFieldsIntersection(new Asc.Range(col, row, col, row));
};
CT_pivotTableDefinition.prototype.getRange = function () {
	return this.location && this.location.ref;
};
CT_pivotTableDefinition.prototype.getFirstHeaderRow0 = function () {
	return this.location && (this.location.firstHeaderRow + this.getColumnFieldsCount() - 1);
};
CT_pivotTableDefinition.prototype.getFirstDataCol = function () {
	return this.location && this.location.firstDataCol;
};
CT_pivotTableDefinition.prototype.getColumnFieldsCount = function (withoutValues) {
	var res = 0;
	if (this.colFields) {
		res = this.colFields.field.length;
		if (1 === res && withoutValues && st_VALUES === this.colFields.field[0].x) {
			res = 0;
		}
	}
	return res;
};
CT_pivotTableDefinition.prototype.getRowFieldsCount = function (compact) {
	var t = this, res = 0, l;
	if (this.rowFields) {
		l = res = this.rowFields.field.length;
		if (compact) {
			this.getField(this.rowFields.field, function (element, i) {
				if (i !== l - 1) {
					var field = t.pivotFields.pivotField[element.asc_getIndex()];
					res -= (field && false !== field.outline && false !== field.compact) ? 1 : 0;
				}
			});
		}
	}
	return res;
};
CT_pivotTableDefinition.prototype.getRowFieldPos = function (index) {
	var res = 0;
	if (this.rowFields) {
		var field, fields = this.rowFields.field;
		for (var i = 0; i < index && i < fields.length; ++i) {
			field = this.pivotFields.pivotField[fields[i].asc_getIndex()];
			res += (field && (false === field.outline || false === field.compact) && 1);
		}
	}

	return res;
};
CT_pivotTableDefinition.prototype.getDataFieldsCount = function () {
	return (this.dataFields && this.dataFields.dataField.length) || 0;
};
CT_pivotTableDefinition.prototype.getField = function (arrFields, callback) {
	return arrFields && arrFields.map(callback, this);
};
CT_pivotTableDefinition.prototype.getRowItems = function () {
	return this.rowItems && this.rowItems.i;
};
CT_pivotTableDefinition.prototype.getColItems = function () {
	return this.colItems && this.colItems.i;
};
CT_pivotTableDefinition.prototype.getRecords = function () {
	return this.cacheDefinition.getRecords();
};
CT_pivotTableDefinition.prototype.getValues = function (records, rowIndexes, colIndex, value) {
	var res = [];
	var i;
	if (rowIndexes) {
		for (i = 0; i < rowIndexes.length; ++i) {
			this._getValues(records, rowIndexes[i], colIndex, value, res);
		}
	} else {
		for (i = 0; i < records.getRowsCount(); ++i) {
			this._getValues(records, i, colIndex, value, res);
		}
	}
	return res;
};
CT_pivotTableDefinition.prototype._getValues = function (records, rowIndex, colIndex, value, output) {
	var elem = records.get(rowIndex, colIndex);
	if (elem && elem.type === c_oAscPivotRecType.Index && value === elem.val) {
		output.push(rowIndex);
	}
};
CT_pivotTableDefinition.prototype.getValue = function (records, rowIndexes, index, subtotal) {
	var cacheFields = this.asc_getCacheFields();
	if (c_oAscItemType.Default === subtotal || c_oAscItemType.Data === subtotal || c_oAscItemType.Blank === subtotal) {
		subtotal = c_oAscItemType.Sum;
	}
	var arg = [new AscCommonExcel.cNumber(subtotal)];
	var i;
	if(rowIndexes){
		for (i = 0; i < rowIndexes.length; ++i) {
			this._getValue(records, rowIndexes[i], index, cacheFields, arg);
		}
	} else {
		for (i = 0; i < records.getRowsCount(); ++i) {
			this._getValue(records, i, index, cacheFields, arg);
		}
	}

	var res = (new AscCommonExcel.cSUBTOTAL()).Calculate(arg);

	return res ? res.value : null;
};
CT_pivotTableDefinition.prototype._getValue = function (records, rowIndex, index, cacheFields, output) {
	var elem = records.get(rowIndex, index);
	if (elem.type === c_oAscPivotRecType.Index) {
		elem = cacheFields[index].getSharedItem(elem.val);
	}
	if (elem.type === c_oAscPivotRecType.Number) {
		output.push(new AscCommonExcel.cNumber(elem.val));
	}
};
CT_pivotTableDefinition.prototype.getAllRange = function (ws) {
	var newSelection = new AscCommonExcel.SelectionRange(ws);
	newSelection.assign2(this.getRange());
	if (this.pageFieldsPositions && 0 < this.pageFieldsPositions.length) {
		this.pageFieldsPositions.forEach(function (element) {
			newSelection.addRange();
			newSelection.getLast().assign2(new Asc.Range(element.col, element.row, element.col + 1, element.row));
		});
		newSelection = newSelection.getUnion();
	}
	return newSelection;
};
CT_pivotTableDefinition.prototype.asc_getName = function () {
	return this.name;
};
CT_pivotTableDefinition.prototype.asc_getPageWrap = function () {
	return this.pageWrap || 0;
};
CT_pivotTableDefinition.prototype.asc_getPageOverThenDown = function () {
	return !!this.pageOverThenDown;
};
CT_pivotTableDefinition.prototype.asc_getRowGrandTotals = function () {
	return null !== this.rowGrandTotals ? this.rowGrandTotals : true;
};
CT_pivotTableDefinition.prototype.asc_getColGrandTotals = function () {
	return null !== this.colGrandTotals ? this.colGrandTotals : true;
};
CT_pivotTableDefinition.prototype.asc_getShowHeaders = function () {
	return null !== this.showHeaders ? this.showHeaders : true;
};
CT_pivotTableDefinition.prototype.asc_getStyleInfo = function () {
	return this.pivotTableStyleInfo;
};
CT_pivotTableDefinition.prototype.asc_getCacheFields = function () {
	return this.cacheDefinition.getFields();
};
CT_pivotTableDefinition.prototype.asc_getPivotFields = function () {
	return this.pivotFields && this.pivotFields.pivotField;
};
CT_pivotTableDefinition.prototype.asc_getPageFields = function () {
	return this.pageFields && this.pageFields.pageField;
};
CT_pivotTableDefinition.prototype.asc_getColumnFields = function () {
	return this.colFields && this.colFields.field;
};
CT_pivotTableDefinition.prototype.asc_getRowFields = function () {
	return this.rowFields && this.rowFields.field;
};
CT_pivotTableDefinition.prototype.asc_getDataFields = function () {
	return this.dataFields && this.dataFields.dataField;
};
CT_pivotTableDefinition.prototype.asc_select = function (api) {
	this.getAllRange(api.wbModel.getActiveWs()).Select();
};
CT_pivotTableDefinition.prototype.asc_set = function (api, newVal) {
	var t = this;
	api._changePivotStyle(this, function (ws) {
		ws.clearPivotTable(t);
		if (null !== newVal.rowGrandTotals && t.asc_getRowGrandTotals() !== newVal.rowGrandTotals) {
			t.asc_setRowGrandTotals(newVal.rowGrandTotals ? null : false);
		}
		if (null !== newVal.colGrandTotals && t.asc_getColGrandTotals() !== newVal.colGrandTotals) {
			t.asc_setColGrandTotals(newVal.colGrandTotals ? null : false);
		}
		ws.updatePivotTable(t);
	});
};
CT_pivotTableDefinition.prototype.asc_setRowGrandTotals = function(newVal) {
	var res;
	this.rowGrandTotals = newVal;
	if (this.rowFields && (res = this.changeGrandTotals(this.rowItems, newVal))) {
		this.getRange().setOffsetLast(new AscCommonExcel.CRangeOffset(0, res));
	}
};
CT_pivotTableDefinition.prototype.asc_setColGrandTotals = function(newVal) {
	var res;
	this.colGrandTotals = newVal;
	if (this.colFields && (res = this.changeGrandTotals(this.colItems, newVal))) {
		this.getRange().setOffsetLast(new AscCommonExcel.CRangeOffset(res, 0));
	}
};
CT_pivotTableDefinition.prototype.asc_addPageField = function (api, index) {
	var t = this;
	api._changePivotStyle(this, function (ws) {
		ws.clearPivotTable(t);
		t.addPageField(index);
		ws.updatePivotTable(t);
	});
};
CT_pivotTableDefinition.prototype.asc_removeField = function (api, index) {
	var t = this;
	api._changePivotStyle(this, function (ws) {
		ws.clearPivotTable(t);
		t.removeField(index);
		ws.updatePivotTable(t);
	});
};
CT_pivotTableDefinition.prototype.addPageField = function (index) {
	var pivotField = this.asc_getPivotFields()[index];
	if (pivotField) {
		if (c_oAscAxis.AxisPage !== pivotField.axis) {
			this.removeField(index);
		} else {
			// ToDo move to end ?
		}

		if (!this.pageFields) {
			this.pageFields = new CT_PageFields();
		}
		var newField = new CT_PageField();
		newField.fld = index;
		newField.hier = -1;
		this.pageFields.add(newField);

		pivotField.axis = c_oAscAxis.AxisPage;
	}
};
CT_pivotTableDefinition.prototype.removeField = function (index) {
	var pivotField = this.asc_getPivotFields()[index];
	switch(pivotField.axis) {
		case c_oAscAxis.AxisRow:
			break;
		case c_oAscAxis.AxisCol:
			break;
		case c_oAscAxis.AxisPage:
			if (1 === this.pageFields.count) {
				this.pageFields = null;
			} else {
				this.pageFields.remove(index);
			}
			break;
		case c_oAscAxis.AxisValues:
			break;
	}
	pivotField.axis = null;
};
CT_pivotTableDefinition.prototype.changeGrandTotals = function (items, newVal) {
	var res = 0, last, i;
	var l = items && items.i.length;
	if (items && 0 < l) {
		i = items.i;
		last = i[l - 1];
		if (null === newVal) {
			// Add
			if (AscCommonExcel.c_oAscItemType.Grand !== last.t) {
				last = new CT_I();
				last.t = AscCommonExcel.c_oAscItemType.Grand;
				last.x.push(new CT_X());
				i.push(last);
				res = 1;
			}
		} else {
			// Remove
			if (AscCommonExcel.c_oAscItemType.Grand === last.t) {
				i.pop();
				res = -1;
			}
		}
		items.count = i.length;
	}
	return res;
};

function CT_pivotTableDefinitionX14() {
//Attributes
	this.fillDownLabelsDefault = null;//false
	this.visualTotalsForSets = null;//false
	this.calculatedMembersInFilters = null;//false
	this.altText = null;
	this.altTextSummary = null;
	this.enableEdit = null;//false
	this.autoApply = null;//false
	this.allocationMethod = null;//equalAllocation
	this.weightExpression = null;
	this.hideValuesRow = null;//false
//Members
	//this.pivotEdits = null;
	//this.pivotChanges = null;
	//this.conditionalFormats = null;
}

CT_pivotTableDefinitionX14.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["fillDownLabelsDefault"];
		if (undefined !== val) {
			this.fillDownLabelsDefault = getBoolFromXml(val);
		}
		val = vals["visualTotalsForSets"];
		if (undefined !== val) {
			this.visualTotalsForSets = getBoolFromXml(val);
		}
		val = vals["calculatedMembersInFilters"];
		if (undefined !== val) {
			this.calculatedMembersInFilters = getBoolFromXml(val);
		}
		val = vals["altText"];
		if (undefined !== val) {
			this.altText = AscCommon.unleakString(uq(val));
		}
		val = vals["altTextSummary"];
		if (undefined !== val) {
			this.altTextSummary = AscCommon.unleakString(uq(val));
		}
		val = vals["enableEdit"];
		if (undefined !== val) {
			this.enableEdit = getBoolFromXml(val);
		}
		val = vals["autoApply"];
		if (undefined !== val) {
			this.autoApply = getBoolFromXml(val);
		}
		val = vals["allocationMethod"];
		if (undefined !== val) {
			val = FromXml_ST_AllocationMethod(val);
			if (-1 !== val) {
				this.allocationMethod = val;
			}
		}
		val = vals["weightExpression"];
		if (undefined !== val) {
			this.weightExpression = AscCommon.unleakString(uq(val));
		}
		val = vals["hideValuesRow"];
		if (undefined !== val) {
			this.hideValuesRow = getBoolFromXml(val);
		}
	}
};
CT_pivotTableDefinitionX14.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("pivotTableDefinition" === elem) {
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
	} else {
		newContext = null;
	}
	return newContext;
};
CT_pivotTableDefinitionX14.prototype.toXml = function(writer) {
	writer.WriteXmlNodeStart("x14:pivotTableDefinition");
	writer.WriteXmlString(" xmlns:xm=\"http://schemas.microsoft.com/office/excel/2006/main\"");
	if (null !== this.fillDownLabelsDefault) {
		writer.WriteXmlAttributeBool("fillDownLabelsDefault", this.fillDownLabelsDefault);
	}
	if (null !== this.visualTotalsForSets) {
		writer.WriteXmlAttributeBool("visualTotalsForSets", this.visualTotalsForSets);
	}
	if (null !== this.calculatedMembersInFilters) {
		writer.WriteXmlAttributeBool("calculatedMembersInFilters", this.calculatedMembersInFilters);
	}
	if (null !== this.altText) {
		writer.WriteXmlAttributeStringEncode("altText", this.altText);
	}
	if (null !== this.altTextSummary) {
		writer.WriteXmlAttributeStringEncode("altTextSummary", this.altTextSummary);
	}
	if (null !== this.enableEdit) {
		writer.WriteXmlAttributeBool("enableEdit", this.enableEdit);
	}
	if (null !== this.autoApply) {
		writer.WriteXmlAttributeBool("autoApply", this.autoApply);
	}
	if (null !== this.allocationMethod) {
		writer.WriteXmlAttributeStringEncode("allocationMethod", ToXml_ST_AllocationMethod(this.allocationMethod));
	}
	if (null !== this.weightExpression) {
		writer.WriteXmlAttributeStringEncode("weightExpression", this.weightExpression);
	}
	if (null !== this.hideValuesRow) {
		writer.WriteXmlAttributeBool("hideValuesRow", this.hideValuesRow);
	}
	writer.WriteXmlNodeEnd("pivotTableDefinition", true, true);
};
function CT_CacheSource() {
//Attributes
	this.type = null;
	this.connectionId = null;//0
//Members
	this.consolidation = null;
	this.extLst = null;
	this.worksheetSource = null;
}
CT_CacheSource.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["type"];
		if (undefined !== val) {
			val = FromXml_ST_SourceType(val);
			if (-1 !== val) {
				this.type = val;
			}
		}
		val = vals["connectionId"];
		if (undefined !== val) {
			this.connectionId = val - 0;
		}
	}
};
CT_CacheSource.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("consolidation" === elem) {
		newContext = new CT_Consolidation();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.consolidation = newContext;
	} else if ("extLst" === elem) {
		newContext = new CT_ExtensionList();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.extLst = newContext;
	} else if ("worksheetSource" === elem) {
		newContext = new CT_WorksheetSource();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.worksheetSource = newContext;
	} else {
		newContext = null;
	}
	return newContext;
};
CT_CacheSource.prototype.toXml = function(writer, name) {
	writer.WriteXmlNodeStart(name);
	if (null !== this.type) {
		writer.WriteXmlAttributeStringEncode("type", ToXml_ST_SourceType(this.type));
	}
	if (null !== this.connectionId) {
		writer.WriteXmlAttributeNumber("connectionId", this.connectionId);
	}
	writer.WriteXmlNodeEnd(name, true);
	if (null !== this.consolidation) {
		this.consolidation.toXml(writer, "consolidation");
	}
	if (null !== this.extLst) {
		this.extLst.toXml(writer, "extLst");
	}
	if (null !== this.worksheetSource) {
		this.worksheetSource.toXml(writer, "worksheetSource");
	}
	writer.WriteXmlNodeEnd(name);
};
function CT_CacheFields() {
//Attributes
	this.count = null;
//Members
	this.cacheField = [];
}
CT_CacheFields.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["count"];
		if (undefined !== val) {
			this.count = val - 0;
		}
	}
};
CT_CacheFields.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("cacheField" === elem) {
		newContext = new CT_CacheField();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.cacheField.push(newContext);
	} else {
		newContext = null;
	}
	return newContext;
};
CT_CacheFields.prototype.toXml = function(writer, name) {
	writer.WriteXmlNodeStart(name);
	if (null !== this.count) {
		writer.WriteXmlAttributeNumber("count", this.count);
	}
	writer.WriteXmlNodeEnd(name, true);
	for (var i = 0; i < this.cacheField.length; ++i) {
		var elem = this.cacheField[i];
		elem.toXml(writer, "cacheField");
	}
	writer.WriteXmlNodeEnd(name);
};
function CT_CacheHierarchies() {
//Attributes
	this.count = null;
//Members
	this.cacheHierarchy = [];
}
CT_CacheHierarchies.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["count"];
		if (undefined !== val) {
			this.count = val - 0;
		}
	}
};
CT_CacheHierarchies.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("cacheHierarchy" === elem) {
		newContext = new CT_CacheHierarchy();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.cacheHierarchy.push(newContext);
	} else {
		newContext = null;
	}
	return newContext;
};
CT_CacheHierarchies.prototype.toXml = function(writer, name) {
	writer.WriteXmlNodeStart(name);
	if (null !== this.count) {
		writer.WriteXmlAttributeNumber("count", this.count);
	}
	writer.WriteXmlNodeEnd(name, true);
	for (var i = 0; i < this.cacheHierarchy.length; ++i) {
		var elem = this.cacheHierarchy[i];
		elem.toXml(writer, "cacheHierarchy");
	}
	writer.WriteXmlNodeEnd(name);
};
function CT_PCDKPIs() {
//Attributes
	this.count = null;
//Members
	this.kpi = [];
}
CT_PCDKPIs.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["count"];
		if (undefined !== val) {
			this.count = val - 0;
		}
	}
};
CT_PCDKPIs.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("kpi" === elem) {
		newContext = new CT_PCDKPI();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.kpi.push(newContext);
	} else {
		newContext = null;
	}
	return newContext;
};
CT_PCDKPIs.prototype.toXml = function(writer, name) {
	writer.WriteXmlNodeStart(name);
	if (null !== this.count) {
		writer.WriteXmlAttributeNumber("count", this.count);
	}
	writer.WriteXmlNodeEnd(name, true);
	for (var i = 0; i < this.kpi.length; ++i) {
		var elem = this.kpi[i];
		elem.toXml(writer, "kpi");
	}
	writer.WriteXmlNodeEnd(name);
};
function CT_TupleCache() {
//Members
	this.entries = null;
	this.sets = null;
	this.queryCache = null;
	this.serverFormats = null;
	this.extLst = null;
}
CT_TupleCache.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("entries" === elem) {
		newContext = new CT_PCDSDTCEntries();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.entries = newContext;
	} else if ("sets" === elem) {
		newContext = new CT_Sets();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.sets = newContext;
	} else if ("queryCache" === elem) {
		newContext = new CT_QueryCache();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.queryCache = newContext;
	} else if ("serverFormats" === elem) {
		newContext = new CT_ServerFormats();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.serverFormats = newContext;
	} else if ("extLst" === elem) {
		newContext = new CT_ExtensionList();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.extLst = newContext;
	} else {
		newContext = null;
	}
	return newContext;
};
CT_TupleCache.prototype.toXml = function(writer, name) {
	writer.WriteXmlNodeStart(name);
	writer.WriteXmlNodeEnd(name, true);
	if (null !== this.entries) {
		this.entries.toXml(writer, "entries");
	}
	if (null !== this.sets) {
		this.sets.toXml(writer, "sets");
	}
	if (null !== this.queryCache) {
		this.queryCache.toXml(writer, "queryCache");
	}
	if (null !== this.serverFormats) {
		this.serverFormats.toXml(writer, "serverFormats");
	}
	if (null !== this.extLst) {
		this.extLst.toXml(writer, "extLst");
	}
	writer.WriteXmlNodeEnd(name);
};
function CT_CalculatedItems() {
//Attributes
	this.count = null;
//Members
	this.calculatedItem = [];
}
CT_CalculatedItems.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["count"];
		if (undefined !== val) {
			this.count = val - 0;
		}
	}
};
CT_CalculatedItems.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("calculatedItem" === elem) {
		newContext = new CT_CalculatedItem();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.calculatedItem.push(newContext);
	} else {
		newContext = null;
	}
	return newContext;
};
CT_CalculatedItems.prototype.toXml = function(writer, name) {
	writer.WriteXmlNodeStart(name);
	if (null !== this.count) {
		writer.WriteXmlAttributeNumber("count", this.count);
	}
	writer.WriteXmlNodeEnd(name, true);
	for (var i = 0; i < this.calculatedItem.length; ++i) {
		var elem = this.calculatedItem[i];
		elem.toXml(writer, "calculatedItem");
	}
	writer.WriteXmlNodeEnd(name);
};
function CT_CalculatedMembers() {
//Attributes
	this.count = null;
//Members
	this.calculatedMember = [];
}
CT_CalculatedMembers.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["count"];
		if (undefined !== val) {
			this.count = val - 0;
		}
	}
};
CT_CalculatedMembers.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("calculatedMember" === elem) {
		newContext = new CT_CalculatedMember();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.calculatedMember.push(newContext);
	} else {
		newContext = null;
	}
	return newContext;
};
CT_CalculatedMembers.prototype.toXml = function(writer, name) {
	writer.WriteXmlNodeStart(name);
	if (null !== this.count) {
		writer.WriteXmlAttributeNumber("count", this.count);
	}
	writer.WriteXmlNodeEnd(name, true);
	for (var i = 0; i < this.calculatedMember.length; ++i) {
		var elem = this.calculatedMember[i];
		elem.toXml(writer, "calculatedMember");
	}
	writer.WriteXmlNodeEnd(name);
};
function CT_Dimensions() {
//Attributes
	this.count = null;
//Members
	this.dimension = [];
}
CT_Dimensions.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["count"];
		if (undefined !== val) {
			this.count = val - 0;
		}
	}
};
CT_Dimensions.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("dimension" === elem) {
		newContext = new CT_PivotDimension();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.dimension.push(newContext);
	} else {
		newContext = null;
	}
	return newContext;
};
CT_Dimensions.prototype.toXml = function(writer, name) {
	writer.WriteXmlNodeStart(name);
	if (null !== this.count) {
		writer.WriteXmlAttributeNumber("count", this.count);
	}
	writer.WriteXmlNodeEnd(name, true);
	for (var i = 0; i < this.dimension.length; ++i) {
		var elem = this.dimension[i];
		elem.toXml(writer, "dimension");
	}
	writer.WriteXmlNodeEnd(name);
};
function CT_MeasureGroups() {
//Attributes
	this.count = null;
//Members
	this.measureGroup = [];
}
CT_MeasureGroups.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["count"];
		if (undefined !== val) {
			this.count = val - 0;
		}
	}
};
CT_MeasureGroups.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("measureGroup" === elem) {
		newContext = new CT_MeasureGroup();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.measureGroup.push(newContext);
	} else {
		newContext = null;
	}
	return newContext;
};
CT_MeasureGroups.prototype.toXml = function(writer, name) {
	writer.WriteXmlNodeStart(name);
	if (null !== this.count) {
		writer.WriteXmlAttributeNumber("count", this.count);
	}
	writer.WriteXmlNodeEnd(name, true);
	for (var i = 0; i < this.measureGroup.length; ++i) {
		var elem = this.measureGroup[i];
		elem.toXml(writer, "measureGroup");
	}
	writer.WriteXmlNodeEnd(name);
};
function CT_MeasureDimensionMaps() {
//Attributes
	this.count = null;
//Members
	this.map = [];
}
CT_MeasureDimensionMaps.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["count"];
		if (undefined !== val) {
			this.count = val - 0;
		}
	}
};
CT_MeasureDimensionMaps.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("map" === elem) {
		newContext = new CT_MeasureDimensionMap();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.map.push(newContext);
	} else {
		newContext = null;
	}
	return newContext;
};
CT_MeasureDimensionMaps.prototype.toXml = function(writer, name) {
	writer.WriteXmlNodeStart(name);
	if (null !== this.count) {
		writer.WriteXmlAttributeNumber("count", this.count);
	}
	writer.WriteXmlNodeEnd(name, true);
	for (var i = 0; i < this.map.length; ++i) {
		var elem = this.map[i];
		elem.toXml(writer, "map");
	}
	writer.WriteXmlNodeEnd(name);
};
function CT_ExtensionList() {
//Members
	this.ext = [];
}
CT_ExtensionList.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("ext" === elem) {
		newContext = new CT_Extension();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.ext.push(newContext);
	} else {
		newContext = null;
	}
	return newContext;
};
CT_ExtensionList.prototype.toXml = function(writer, name) {
	writer.WriteXmlNodeStart(name);
	writer.WriteXmlNodeEnd(name, true);
	for (var i = 0; i < this.ext.length; ++i) {
		var elem = this.ext[i];
		elem.toXml(writer, "ext");
	}
	writer.WriteXmlNodeEnd(name);
};
function CT_Boolean() {
//Attributes
	this.v = null;
	this.u = null;
	this.f = null;
	this.c = null;
	this.cp = null;
//Members
	this.x = [];
}
CT_Boolean.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["v"];
		if (undefined !== val) {
			this.v = getBoolFromXml(val);
		}
		val = vals["u"];
		if (undefined !== val) {
			this.u = getBoolFromXml(val);
		}
		val = vals["f"];
		if (undefined !== val) {
			this.f = getBoolFromXml(val);
		}
		val = vals["c"];
		if (undefined !== val) {
			this.c = AscCommon.unleakString(uq(val));
		}
		val = vals["cp"];
		if (undefined !== val) {
			this.cp = val - 0;
		}
	}
};
CT_Boolean.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("x" === elem) {
		newContext = new CT_X();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.x.push(newContext);
	} else {
		newContext = null;
	}
	return newContext;
};
CT_Boolean.prototype.toXml = function(writer, name) {
	this.toXml2(writer, name, this.v, this);
};
CT_Boolean.prototype.toXml2 = function(writer, name, val, obj) {
	writer.WriteXmlNodeStart(name);
	if (null !== val) {
		writer.WriteXmlAttributeBool("v", val);
	}
	if (obj) {
		if (null !== obj.u) {
			writer.WriteXmlAttributeBool("u", obj.u);
		}
		if (null !== obj.f) {
			writer.WriteXmlAttributeBool("f", obj.f);
		}
		if (null !== obj.c) {
			writer.WriteXmlAttributeStringEncode("c", obj.c);
		}
		if (null !== obj.cp) {
			writer.WriteXmlAttributeNumber("cp", obj.cp);
		}
		writer.WriteXmlNodeEnd(name, true);
		for (var i = 0; i < obj.x.length; ++i) {
			var elem = obj.x[i];
			elem.toXml(writer, "x");
		}
	} else {
		writer.WriteXmlNodeEnd(name, true);
	}
	writer.WriteXmlNodeEnd(name);
};
CT_Boolean.prototype.isSimpleValue = function() {
	return null === this.u && null === this.f && null === this.c && null === this.cp && 0 === this.x.length;
};
CT_Boolean.prototype.clean = function() {
	this.v = null;
	this.u = null;
	this.f = null;
	this.c = null;
	this.cp = null;
	this.x = [];
};
function CT_DateTime() {
//Attributes
	this.v = null;
	this.u = null;
	this.f = null;
	this.c = null;
	this.cp = null;
//Members
	this.x = [];
}
CT_DateTime.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["v"];
		if (undefined !== val) {
			var d = new Date(uq(val));
			this.v = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(),
				d.getSeconds(),	d.getMilliseconds())).getExcelDateWithTime();
		}
		val = vals["u"];
		if (undefined !== val) {
			this.u = getBoolFromXml(val);
		}
		val = vals["f"];
		if (undefined !== val) {
			this.f = getBoolFromXml(val);
		}
		val = vals["c"];
		if (undefined !== val) {
			this.c = AscCommon.unleakString(uq(val));
		}
		val = vals["cp"];
		if (undefined !== val) {
			this.cp = val - 0;
		}
	}
};
CT_DateTime.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("x" === elem) {
		newContext = new CT_X();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.x.push(newContext);
	} else {
		newContext = null;
	}
	return newContext;
};
CT_DateTime.prototype.toXml = function(writer, name) {
	this.toXml2(writer, name, this.v, this);
};
CT_DateTime.prototype.toXml2 = function(writer, name, val, obj) {
	writer.WriteXmlNodeStart(name);
	if (null !== val) {
		writer.WriteXmlAttributeStringEncode("v", Date.prototype.getDateFromExcelWithTime(val).toISOString().slice(0, 19));
	}
	if (obj) {
		if (null !== obj.u) {
			writer.WriteXmlAttributeBool("u", obj.u);
		}
		if (null !== obj.f) {
			writer.WriteXmlAttributeBool("f", obj.f);
		}
		if (null !== obj.c) {
			writer.WriteXmlAttributeStringEncode("c", obj.c);
		}
		if (null !== obj.cp) {
			writer.WriteXmlAttributeNumber("cp", obj.cp);
		}
		writer.WriteXmlNodeEnd(name, true);
		for (var i = 0; i < obj.x.length; ++i) {
			var elem = obj.x[i];
			elem.toXml(writer, "x");
		}
	} else {
		writer.WriteXmlNodeEnd(name, true);
	}

	writer.WriteXmlNodeEnd(name);
};
CT_DateTime.prototype.isSimpleValue = function() {
	return null === this.u && null === this.f && null === this.c && null === this.cp && 0 === this.x.length;
};
CT_DateTime.prototype.clean = function() {
	this.v = null;
	this.u = null;
	this.f = null;
	this.c = null;
	this.cp = null;
	this.x = [];
};
function CT_Error() {
//Attributes
	this.v = null;
	this.u = null;
	this.f = null;
	this.c = null;
	this.cp = null;
	this.in = null;
	this.bc = null;
	this.fc = null;
	this.i = null;//false
	this.un = null;//false
	this.st = null;//false
	this.b = null;//false
//Members
	this.tpls = [];
	this.x = [];
}
CT_Error.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["v"];
		if (undefined !== val) {
			this.v =  AscCommonExcel.cError.prototype.getErrorTypeFromString(uq(val));
		}
		val = vals["u"];
		if (undefined !== val) {
			this.u = getBoolFromXml(val);
		}
		val = vals["f"];
		if (undefined !== val) {
			this.f = getBoolFromXml(val);
		}
		val = vals["c"];
		if (undefined !== val) {
			this.c = AscCommon.unleakString(uq(val));
		}
		val = vals["cp"];
		if (undefined !== val) {
			this.cp = val - 0;
		}
		val = vals["in"];
		if (undefined !== val) {
			this.in = val - 0;
		}
		val = vals["bc"];
		if (undefined !== val) {
			this.bc = val - 0;
		}
		val = vals["fc"];
		if (undefined !== val) {
			this.fc = val - 0;
		}
		val = vals["i"];
		if (undefined !== val) {
			this.i = getBoolFromXml(val);
		}
		val = vals["un"];
		if (undefined !== val) {
			this.un = getBoolFromXml(val);
		}
		val = vals["st"];
		if (undefined !== val) {
			this.st = getBoolFromXml(val);
		}
		val = vals["b"];
		if (undefined !== val) {
			this.b = getBoolFromXml(val);
		}
	}
};
CT_Error.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("tpls" === elem) {
		newContext = new CT_Tuples();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.tpls.push(newContext);
	} else if ("x" === elem) {
		newContext = new CT_X();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.x.push(newContext);
	} else {
		newContext = null;
	}
	return newContext;
};
CT_Error.prototype.toXml = function(writer, name) {
	this.toXml2(writer, name, this.v, this);
};
CT_Error.prototype.toXml2 = function(writer, name, val, obj) {
	writer.WriteXmlNodeStart(name);
	if (null !== val) {
		writer.WriteXmlAttributeStringEncode("v", AscCommonExcel.cError.prototype.getStringFromErrorType(val));
	}
	if (obj) {
		if (null !== obj.u) {
			writer.WriteXmlAttributeBool("u", obj.u);
		}
		if (null !== obj.f) {
			writer.WriteXmlAttributeBool("f", obj.f);
		}
		if (null !== obj.c) {
			writer.WriteXmlAttributeStringEncode("c", obj.c);
		}
		if (null !== obj.cp) {
			writer.WriteXmlAttributeNumber("cp", obj.cp);
		}
		if (null !== obj.in) {
			writer.WriteXmlAttributeNumber("in", obj.in);
		}
		if (null !== obj.bc) {
			writer.WriteXmlAttributeNumber("bc", obj.bc);
		}
		if (null !== obj.fc) {
			writer.WriteXmlAttributeNumber("fc", obj.fc);
		}
		if (null !== obj.i) {
			writer.WriteXmlAttributeBool("i", obj.i);
		}
		if (null !== obj.un) {
			writer.WriteXmlAttributeBool("un", obj.un);
		}
		if (null !== obj.st) {
			writer.WriteXmlAttributeBool("st", obj.st);
		}
		if (null !== obj.b) {
			writer.WriteXmlAttributeBool("b", obj.b);
		}
		writer.WriteXmlNodeEnd(name, true);
		for (var i = 0; i < obj.tpls.length; ++i) {
			var elem = obj.tpls[i];
			elem.toXml(writer, "tpls");
		}
		for (var i = 0; i < obj.x.length; ++i) {
			var elem = obj.x[i];
			elem.toXml(writer, "x");
		}
	} else {
		writer.WriteXmlNodeEnd(name, true);
	}
	writer.WriteXmlNodeEnd(name);
};
CT_Error.prototype.isSimpleValue = function() {
	return null === this.u && null === this.f && null === this.c && null === this.cp && null === this.in &&
		null === this.bc && null === this.fc && null === this.i && null === this.un && null === this.st &&
		null === this.b && null === 0 === this.tpls.length && 0 === this.x.length;
};
CT_Error.prototype.clean = function() {
	this.v = null;
	this.u = null;
	this.f = null;
	this.c = null;
	this.cp = null;
	this.in = null;
	this.bc = null;
	this.fc = null;
	this.i = null;//false
	this.un = null;//false
	this.st = null;//false
	this.b = null;//false
	this.tpls = [];
	this.x = [];
};
function CT_Missing() {
//Attributes
	this.u = null;
	this.f = null;
	this.c = null;
	this.cp = null;
	this.in = null;
	this.bc = null;
	this.fc = null;
	this.i = null;//false
	this.un = null;//false
	this.st = null;//false
	this.b = null;//false
//Members
	this.tpls = [];
	this.x = [];
}
CT_Missing.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["u"];
		if (undefined !== val) {
			this.u = getBoolFromXml(val);
		}
		val = vals["f"];
		if (undefined !== val) {
			this.f = getBoolFromXml(val);
		}
		val = vals["c"];
		if (undefined !== val) {
			this.c = AscCommon.unleakString(uq(val));
		}
		val = vals["cp"];
		if (undefined !== val) {
			this.cp = val - 0;
		}
		val = vals["in"];
		if (undefined !== val) {
			this.in = val - 0;
		}
		val = vals["bc"];
		if (undefined !== val) {
			this.bc = val - 0;
		}
		val = vals["fc"];
		if (undefined !== val) {
			this.fc = val - 0;
		}
		val = vals["i"];
		if (undefined !== val) {
			this.i = getBoolFromXml(val);
		}
		val = vals["un"];
		if (undefined !== val) {
			this.un = getBoolFromXml(val);
		}
		val = vals["st"];
		if (undefined !== val) {
			this.st = getBoolFromXml(val);
		}
		val = vals["b"];
		if (undefined !== val) {
			this.b = getBoolFromXml(val);
		}
	}
};
CT_Missing.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("tpls" === elem) {
		newContext = new CT_Tuples();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.tpls.push(newContext);
	} else if ("x" === elem) {
		newContext = new CT_X();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.x.push(newContext);
	} else {
		newContext = null;
	}
	return newContext;
};
CT_Missing.prototype.toXml = function(writer, name) {
	this.toXml2(writer, name, this);
};
CT_Missing.prototype.toXml2 = function(writer, name, obj) {
	writer.WriteXmlNodeStart(name);
	if (obj) {
		if (null !== obj.u) {
			writer.WriteXmlAttributeBool("u", obj.u);
		}
		if (null !== obj.f) {
			writer.WriteXmlAttributeBool("f", obj.f);
		}
		if (null !== obj.c) {
			writer.WriteXmlAttributeStringEncode("c", obj.c);
		}
		if (null !== obj.cp) {
			writer.WriteXmlAttributeNumber("cp", obj.cp);
		}
		if (null !== obj.in) {
			writer.WriteXmlAttributeNumber("in", obj.in);
		}
		if (null !== obj.bc) {
			writer.WriteXmlAttributeNumber("bc", obj.bc);
		}
		if (null !== obj.fc) {
			writer.WriteXmlAttributeNumber("fc", obj.fc);
		}
		if (null !== obj.i) {
			writer.WriteXmlAttributeBool("i", obj.i);
		}
		if (null !== obj.un) {
			writer.WriteXmlAttributeBool("un", obj.un);
		}
		if (null !== obj.st) {
			writer.WriteXmlAttributeBool("st", obj.st);
		}
		if (null !== obj.b) {
			writer.WriteXmlAttributeBool("b", obj.b);
		}
		writer.WriteXmlNodeEnd(name, true);
		for (var i = 0; i < obj.tpls.length; ++i) {
			var elem = obj.tpls[i];
			elem.toXml(writer, "tpls");
		}
		for (var i = 0; i < obj.x.length; ++i) {
			var elem = obj.x[i];
			elem.toXml(writer, "x");
		}
	} else {
		writer.WriteXmlNodeEnd(name, true);
	}
	writer.WriteXmlNodeEnd(name);
};
CT_Missing.prototype.isSimpleValue = function() {
	return null === this.u && null === this.f && null === this.c && null === this.cp && null === this.in &&
		null === this.bc && null === this.fc && null === this.i && null === this.un && null === this.st &&
		null === this.b && 0 === this.tpls.length && 0 === this.x.length;
};
CT_Missing.prototype.clean = function() {
	this.v = null;
	this.u = null;
	this.f = null;
	this.c = null;
	this.cp = null;
	this.in = null;
	this.bc = null;
	this.fc = null;
	this.i = null;//false
	this.un = null;//false
	this.st = null;//false
	this.b = null;//false
	this.tpls = [];
	this.x = [];
};
function CT_Number() {
//Attributes
	this.v = null;
	this.u = null;
	this.f = null;
	this.c = null;
	this.cp = null;
	this.in = null;
	this.bc = null;
	this.fc = null;
	this.i = null;//false
	this.un = null;//false
	this.st = null;//false
	this.b = null;//false
//Members
	this.tpls = [];
	this.x = [];
//internal
	this.realNumber = null;
}
CT_Number.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["v"];
		if (undefined !== val) {
			this.v = val - 0;
		}
		val = vals["u"];
		if (undefined !== val) {
			this.u = getBoolFromXml(val);
		}
		val = vals["f"];
		if (undefined !== val) {
			this.f = getBoolFromXml(val);
		}
		val = vals["c"];
		if (undefined !== val) {
			this.c = AscCommon.unleakString(uq(val));
		}
		val = vals["cp"];
		if (undefined !== val) {
			this.cp = val - 0;
		}
		val = vals["in"];
		if (undefined !== val) {
			this.in = val - 0;
		}
		val = vals["bc"];
		if (undefined !== val) {
			this.bc = val - 0;
		}
		val = vals["fc"];
		if (undefined !== val) {
			this.fc = val - 0;
		}
		val = vals["i"];
		if (undefined !== val) {
			this.i = getBoolFromXml(val);
		}
		val = vals["un"];
		if (undefined !== val) {
			this.un = getBoolFromXml(val);
		}
		val = vals["st"];
		if (undefined !== val) {
			this.st = getBoolFromXml(val);
		}
		val = vals["b"];
		if (undefined !== val) {
			this.b = getBoolFromXml(val);
		}
	}
};
CT_Number.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("tpls" === elem) {
		newContext = new CT_Tuples();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.tpls.push(newContext);
	} else if ("x" === elem) {
		newContext = new CT_X();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.x.push(newContext);
	} else {
		newContext = null;
	}
	return newContext;
};
CT_Number.prototype.toXml = function(writer, name) {
	this.toXml2(writer, name, this.v, this);
};
CT_Number.prototype.toXml2 = function(writer, name, val, obj) {
	writer.WriteXmlNodeStart(name);
	if (null !== val) {
		writer.WriteXmlAttributeNumber("v", val);
	}
	if (obj) {
		if (null !== obj.u) {
			writer.WriteXmlAttributeBool("u", obj.u);
		}
		if (null !== obj.f) {
			writer.WriteXmlAttributeBool("f", obj.f);
		}
		if (null !== obj.c) {
			writer.WriteXmlAttributeStringEncode("c", obj.c);
		}
		if (null !== obj.cp) {
			writer.WriteXmlAttributeNumber("cp", obj.cp);
		}
		if (null !== obj.in) {
			writer.WriteXmlAttributeNumber("in", obj.in);
		}
		if (null !== obj.bc) {
			writer.WriteXmlAttributeNumber("bc", obj.bc);
		}
		if (null !== obj.fc) {
			writer.WriteXmlAttributeNumber("fc", obj.fc);
		}
		if (null !== obj.i) {
			writer.WriteXmlAttributeBool("i", obj.i);
		}
		if (null !== obj.un) {
			writer.WriteXmlAttributeBool("un", obj.un);
		}
		if (null !== obj.st) {
			writer.WriteXmlAttributeBool("st", obj.st);
		}
		if (null !== obj.b) {
			writer.WriteXmlAttributeBool("b", obj.b);
		}
		writer.WriteXmlNodeEnd(name, true);
		for (var i = 0; i < obj.tpls.length; ++i) {
			var elem = obj.tpls[i];
			elem.toXml(writer, "tpls");
		}
		for (var i = 0; i < obj.x.length; ++i) {
			var elem = obj.x[i];
			elem.toXml(writer, "x");
		}
	} else {
		writer.WriteXmlNodeEnd(name, true);
	}
	writer.WriteXmlNodeEnd(name);
};
CT_Number.prototype.isSimpleValue = function() {
	return null === this.u && null === this.f && null === this.c && null === this.cp && null === this.in &&
		null === this.bc && null === this.fc && null === this.i && null === this.un && null === this.st &&
		null === this.b && 0 === this.tpls.length && 0 === this.x.length;
};
CT_Number.prototype.clean = function() {
	this.v = null;
	this.u = null;
	this.f = null;
	this.c = null;
	this.cp = null;
	this.in = null;
	this.bc = null;
	this.fc = null;
	this.i = null;//false
	this.un = null;//false
	this.st = null;//false
	this.b = null;//false
	this.tpls = [];
	this.x = [];
};
function CT_String() {
//Attributes
	this.v = null;
	this.u = null;
	this.f = null;
	this.c = null;
	this.cp = null;
	this.in = null;
	this.bc = null;
	this.fc = null;
	this.i = null;//false
	this.un = null;//false
	this.st = null;//false
	this.b = null;//false
//Members
	this.tpls = [];
	this.x = [];
}
CT_String.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["v"];
		if (undefined !== val) {
			this.v = AscCommon.unleakString(uq(val));
		}
		val = vals["u"];
		if (undefined !== val) {
			this.u = getBoolFromXml(val);
		}
		val = vals["f"];
		if (undefined !== val) {
			this.f = getBoolFromXml(val);
		}
		val = vals["c"];
		if (undefined !== val) {
			this.c = AscCommon.unleakString(uq(val));
		}
		val = vals["cp"];
		if (undefined !== val) {
			this.cp = val - 0;
		}
		val = vals["in"];
		if (undefined !== val) {
			this.in = val - 0;
		}
		val = vals["bc"];
		if (undefined !== val) {
			this.bc = val - 0;
		}
		val = vals["fc"];
		if (undefined !== val) {
			this.fc = val - 0;
		}
		val = vals["i"];
		if (undefined !== val) {
			this.i = getBoolFromXml(val);
		}
		val = vals["un"];
		if (undefined !== val) {
			this.un = getBoolFromXml(val);
		}
		val = vals["st"];
		if (undefined !== val) {
			this.st = getBoolFromXml(val);
		}
		val = vals["b"];
		if (undefined !== val) {
			this.b = getBoolFromXml(val);
		}
	}
};
CT_String.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("tpls" === elem) {
		newContext = new CT_Tuples();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.tpls.push(newContext);
	} else if ("x" === elem) {
		newContext = new CT_X();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.x.push(newContext);
	} else {
		newContext = null;
	}
	return newContext;
};
CT_String.prototype.toXml = function(writer, name) {
	this.toXml2(writer, name, this.v, this);
};
CT_String.prototype.toXml2 = function(writer, name, val, obj) {
	writer.WriteXmlNodeStart(name);
	if (null !== val) {
		writer.WriteXmlAttributeStringEncode("v", val);
	}
	if (obj) {
		if (null !== obj.u) {
			writer.WriteXmlAttributeBool("u", obj.u);
		}
		if (null !== obj.f) {
			writer.WriteXmlAttributeBool("f", obj.f);
		}
		if (null !== obj.c) {
			writer.WriteXmlAttributeStringEncode("c", obj.c);
		}
		if (null !== obj.cp) {
			writer.WriteXmlAttributeNumber("cp", obj.cp);
		}
		if (null !== obj.in) {
			writer.WriteXmlAttributeNumber("in", obj.in);
		}
		if (null !== obj.bc) {
			writer.WriteXmlAttributeNumber("bc", obj.bc);
		}
		if (null !== obj.fc) {
			writer.WriteXmlAttributeNumber("fc", obj.fc);
		}
		if (null !== obj.i) {
			writer.WriteXmlAttributeBool("i", obj.i);
		}
		if (null !== obj.un) {
			writer.WriteXmlAttributeBool("un", obj.un);
		}
		if (null !== obj.st) {
			writer.WriteXmlAttributeBool("st", obj.st);
		}
		if (null !== obj.b) {
			writer.WriteXmlAttributeBool("b", obj.b);
		}
		writer.WriteXmlNodeEnd(name, true);
		for (var i = 0; i < obj.tpls.length; ++i) {
			var elem = obj.tpls[i];
			elem.toXml(writer, "tpls");
		}
		for (var i = 0; i < obj.x.length; ++i) {
			var elem = obj.x[i];
			elem.toXml(writer, "x");
		}
	} else {
		writer.WriteXmlNodeEnd(name, true);
	}
	writer.WriteXmlNodeEnd(name);
};
CT_String.prototype.isSimpleValue = function() {
	return null === this.u && null === this.f && null === this.c && null === this.cp && null === this.in &&
		null === this.bc && null === this.fc && null === this.i && null === this.un && null === this.st &&
		null === this.b && 0 === this.tpls.length && 0 === this.x.length;
};
CT_String.prototype.clean = function() {
	this.v = null;
	this.u = null;
	this.f = null;
	this.c = null;
	this.cp = null;
	this.in = null;
	this.bc = null;
	this.fc = null;
	this.i = null;//false
	this.un = null;//false
	this.st = null;//false
	this.b = null;//false
	this.tpls = [];
	this.x = [];
};
function CT_Index() {
//Attributes
	this.v = null;
}
CT_Index.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["v"];
		if (undefined !== val) {
			this.v = val - 0;
		}
	}
};
CT_Index.prototype.toXml = function(writer, name) {
	this.toXml2(writer, name, this.v);
};
CT_Index.prototype.toXml2 = function(writer, name, val) {
	writer.WriteXmlNodeStart(name);
	if (null !== val) {
		writer.WriteXmlAttributeNumber("v", val);
	}
	writer.WriteXmlNodeEnd(name, true, true);
};
CT_Index.prototype.isSimpleValue = function() {
	return true;
};
CT_Index.prototype.clean = function() {
	this.v = null;
};
function CT_Location() {
//Attributes
	this.ref = null;
	this.firstHeaderRow = null;
	this.firstDataRow = null;
	this.firstDataCol = null;
	this.rowPageCount = null;//0
	this.colPageCount = null;//0
// private
	this.refWithPage = null;
}
CT_Location.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["ref"];
		if (undefined !== val) {
			this.ref = AscCommonExcel.g_oRangeCache.getAscRange(uq(val));
		}
		val = vals["firstHeaderRow"];
		if (undefined !== val) {
			this.firstHeaderRow = val - 0;
		}
		val = vals["firstDataRow"];
		if (undefined !== val) {
			this.firstDataRow = val - 0;
		}
		val = vals["firstDataCol"];
		if (undefined !== val) {
			this.firstDataCol = val - 0;
		}
		val = vals["rowPageCount"];
		if (undefined !== val) {
			this.rowPageCount = val - 0;
		}
		val = vals["colPageCount"];
		if (undefined !== val) {
			this.colPageCount = val - 0;
		}
	}
};
CT_Location.prototype.toXml = function(writer, name) {
	writer.WriteXmlNodeStart(name);
	if (null !== this.ref) {
		writer.WriteXmlAttributeStringEncode("ref", this.ref.getName());
	}
	if (null !== this.firstHeaderRow) {
		writer.WriteXmlAttributeNumber("firstHeaderRow", this.firstHeaderRow);
	}
	if (null !== this.firstDataRow) {
		writer.WriteXmlAttributeNumber("firstDataRow", this.firstDataRow);
	}
	if (null !== this.firstDataCol) {
		writer.WriteXmlAttributeNumber("firstDataCol", this.firstDataCol);
	}
	if (null !== this.rowPageCount) {
		writer.WriteXmlAttributeNumber("rowPageCount", this.rowPageCount);
	}
	if (null !== this.colPageCount) {
		writer.WriteXmlAttributeNumber("colPageCount", this.colPageCount);
	}
	writer.WriteXmlNodeEnd(name, true, true);
};
CT_Location.prototype.intersection = function (range) {
	var t = this;
	return this.ref && (Array.isArray(range) ? range.some(function (element) {
			return t.ref.intersectionSimple(element);
		}) : this.ref.intersectionSimple(range));
};
CT_Location.prototype.contains = function (col, row) {
	return this.ref && this.ref.contains(col, row);
};
CT_Location.prototype.setPageCount = function (row, col) {
	var c2;
	this.rowPageCount = row;
	this.colPageCount = col;
	if (this.ref) {
		this.refWithPage = this.ref.clone();
		if (this.rowPageCount) {
			this.refWithPage.setOffsetFirst(new AscCommonExcel.CRangeOffset(0, - (this.rowPageCount + 1)));
		}
		c2 = this.colPageCount * 3 - 1 - 1;
		if (c2 > this.refWithPage.c2) {
			this.refWithPage.setOffsetLast(new AscCommonExcel.CRangeOffset(c2 - this.refWithPage.c2, 0));
		}
	}
};
function CT_PivotFields() {
//Attributes
	this.count = null;
//Members
	this.pivotField = [];
}
CT_PivotFields.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["count"];
		if (undefined !== val) {
			this.count = val - 0;
		}
	}
};
CT_PivotFields.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("pivotField" === elem) {
		newContext = new CT_PivotField();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.pivotField.push(newContext);
	} else {
		newContext = null;
	}
	return newContext;
};
CT_PivotFields.prototype.toXml = function(writer, name) {
	writer.WriteXmlNodeStart(name);
	if (null !== this.count) {
		writer.WriteXmlAttributeNumber("count", this.count);
	}
	writer.WriteXmlNodeEnd(name, true);
	for (var i = 0; i < this.pivotField.length; ++i) {
		var elem = this.pivotField[i];
		elem.toXml(writer, "pivotField");
	}
	writer.WriteXmlNodeEnd(name);
};
function CT_RowFields() {
//Attributes
	this.count = null;//0
//Members
	this.field = [];
}
CT_RowFields.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["count"];
		if (undefined !== val) {
			this.count = val - 0;
		}
	}
};
CT_RowFields.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("field" === elem) {
		newContext = new CT_Field();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.field.push(newContext);
	} else {
		newContext = null;
	}
	return newContext;
};
CT_RowFields.prototype.toXml = function(writer, name) {
	writer.WriteXmlNodeStart(name);
	if (null !== this.count) {
		writer.WriteXmlAttributeNumber("count", this.count);
	}
	writer.WriteXmlNodeEnd(name, true);
	for (var i = 0; i < this.field.length; ++i) {
		var elem = this.field[i];
		elem.toXml(writer, "field");
	}
	writer.WriteXmlNodeEnd(name);
};
function CT_rowItems() {
//Attributes
	this.count = null;
//Members
	this.i = [];
}
CT_rowItems.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["count"];
		if (undefined !== val) {
			this.count = val - 0;
		}
	}
};
CT_rowItems.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("i" === elem) {
		newContext = new CT_I();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.i.push(newContext);
	} else {
		newContext = null;
	}
	return newContext;
};
CT_rowItems.prototype.toXml = function(writer, name) {
	writer.WriteXmlNodeStart(name);
	if (null !== this.count) {
		writer.WriteXmlAttributeNumber("count", this.count);
	}
	writer.WriteXmlNodeEnd(name, true);
	for (var i = 0; i < this.i.length; ++i) {
		var elem = this.i[i];
		elem.toXml(writer, "i");
	}
	writer.WriteXmlNodeEnd(name);
};
function CT_ColFields() {
//Attributes
	this.count = null;//0
//Members
	this.field = [];
}
CT_ColFields.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["count"];
		if (undefined !== val) {
			this.count = val - 0;
		}
	}
};
CT_ColFields.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("field" === elem) {
		newContext = new CT_Field();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.field.push(newContext);
	} else {
		newContext = null;
	}
	return newContext;
};
CT_ColFields.prototype.toXml = function(writer, name) {
	writer.WriteXmlNodeStart(name);
	if (null !== this.count) {
		writer.WriteXmlAttributeNumber("count", this.count);
	}
	writer.WriteXmlNodeEnd(name, true);
	for (var i = 0; i < this.field.length; ++i) {
		var elem = this.field[i];
		elem.toXml(writer, "field");
	}
	writer.WriteXmlNodeEnd(name);
};
function CT_colItems() {
//Attributes
	this.count = null;
//Members
	this.i = [];
}
CT_colItems.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["count"];
		if (undefined !== val) {
			this.count = val - 0;
		}
	}
};
CT_colItems.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("i" === elem) {
		newContext = new CT_I();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.i.push(newContext);
	} else {
		newContext = null;
	}
	return newContext;
};
CT_colItems.prototype.toXml = function(writer, name) {
	writer.WriteXmlNodeStart(name);
	if (null !== this.count) {
		writer.WriteXmlAttributeNumber("count", this.count);
	}
	writer.WriteXmlNodeEnd(name, true);
	for (var i = 0; i < this.i.length; ++i) {
		var elem = this.i[i];
		elem.toXml(writer, "i");
	}
	writer.WriteXmlNodeEnd(name);
};
function CT_PageFields() {
//Attributes
	this.count = null;
//Members
	this.pageField = [];
}
CT_PageFields.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["count"];
		if (undefined !== val) {
			this.count = val - 0;
		}
	}
};
CT_PageFields.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("pageField" === elem) {
		newContext = new CT_PageField();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.pageField.push(newContext);
	} else {
		newContext = null;
	}
	return newContext;
};
CT_PageFields.prototype.toXml = function(writer, name) {
	writer.WriteXmlNodeStart(name);
	if (null !== this.count) {
		writer.WriteXmlAttributeNumber("count", this.count);
	}
	writer.WriteXmlNodeEnd(name, true);
	for (var i = 0; i < this.pageField.length; ++i) {
		var elem = this.pageField[i];
		elem.toXml(writer, "pageField");
	}
	writer.WriteXmlNodeEnd(name);
};
CT_PageFields.prototype.add = function (newContext) {
	this.pageField.push(newContext);
	this.count = this.pageField.length;
};
CT_PageFields.prototype.remove = function (index) {
	var deleteIndex = this.pageField.findIndex(function (element) {
		return element.asc_getIndex() === index;
	});
	if (-1 !== deleteIndex) {
		this.pageField.splice(deleteIndex, 1);
	}
	this.count = this.pageField.length;
};
function CT_DataFields() {
//Attributes
	this.count = null;
//Members
	this.dataField = [];
}
CT_DataFields.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["count"];
		if (undefined !== val) {
			this.count = val - 0;
		}
	}
};
CT_DataFields.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("dataField" === elem) {
		newContext = new CT_DataField();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.dataField.push(newContext);
	} else {
		newContext = null;
	}
	return newContext;
};
CT_DataFields.prototype.toXml = function(writer, name) {
	writer.WriteXmlNodeStart(name);
	if (null !== this.count) {
		writer.WriteXmlAttributeNumber("count", this.count);
	}
	writer.WriteXmlNodeEnd(name, true);
	for (var i = 0; i < this.dataField.length; ++i) {
		var elem = this.dataField[i];
		elem.toXml(writer, "dataField");
	}
	writer.WriteXmlNodeEnd(name);
};
function CT_Formats() {
//Attributes
	this.count = null;//0
//Members
	this.format = [];
}
CT_Formats.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["count"];
		if (undefined !== val) {
			this.count = val - 0;
		}
	}
};
CT_Formats.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("format" === elem) {
		newContext = new CT_Format();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.format.push(newContext);
	} else {
		newContext = null;
	}
	return newContext;
};
CT_Formats.prototype.toXml = function(writer, name) {
	writer.WriteXmlNodeStart(name);
	if (null !== this.count) {
		writer.WriteXmlAttributeNumber("count", this.count);
	}
	writer.WriteXmlNodeEnd(name, true);
	for (var i = 0; i < this.format.length; ++i) {
		var elem = this.format[i];
		elem.toXml(writer, "format");
	}
	writer.WriteXmlNodeEnd(name);
};
function CT_ConditionalFormats() {
//Attributes
	this.count = null;//0
//Members
	this.conditionalFormat = [];
}
CT_ConditionalFormats.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["count"];
		if (undefined !== val) {
			this.count = val - 0;
		}
	}
};
CT_ConditionalFormats.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("conditionalFormat" === elem) {
		newContext = new CT_ConditionalFormat();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.conditionalFormat.push(newContext);
	} else {
		newContext = null;
	}
	return newContext;
};
CT_ConditionalFormats.prototype.toXml = function(writer, name) {
	writer.WriteXmlNodeStart(name);
	if (null !== this.count) {
		writer.WriteXmlAttributeNumber("count", this.count);
	}
	writer.WriteXmlNodeEnd(name, true);
	for (var i = 0; i < this.conditionalFormat.length; ++i) {
		var elem = this.conditionalFormat[i];
		elem.toXml(writer, "conditionalFormat");
	}
	writer.WriteXmlNodeEnd(name);
};
function CT_ChartFormats() {
//Attributes
	this.count = null;//0
//Members
	this.chartFormat = [];
}
CT_ChartFormats.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["count"];
		if (undefined !== val) {
			this.count = val - 0;
		}
	}
};
CT_ChartFormats.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("chartFormat" === elem) {
		newContext = new CT_ChartFormat();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.chartFormat.push(newContext);
	} else {
		newContext = null;
	}
	return newContext;
};
CT_ChartFormats.prototype.toXml = function(writer, name) {
	writer.WriteXmlNodeStart(name);
	if (null !== this.count) {
		writer.WriteXmlAttributeNumber("count", this.count);
	}
	writer.WriteXmlNodeEnd(name, true);
	for (var i = 0; i < this.chartFormat.length; ++i) {
		var elem = this.chartFormat[i];
		elem.toXml(writer, "chartFormat");
	}
	writer.WriteXmlNodeEnd(name);
};
function CT_PivotHierarchies() {
//Attributes
	this.count = null;
//Members
	this.pivotHierarchy = [];
}
CT_PivotHierarchies.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["count"];
		if (undefined !== val) {
			this.count = val - 0;
		}
	}
};
CT_PivotHierarchies.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("pivotHierarchy" === elem) {
		newContext = new CT_PivotHierarchy();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.pivotHierarchy.push(newContext);
	} else {
		newContext = null;
	}
	return newContext;
};
CT_PivotHierarchies.prototype.toXml = function(writer, name) {
	writer.WriteXmlNodeStart(name);
	if (null !== this.count) {
		writer.WriteXmlAttributeNumber("count", this.count);
	}
	writer.WriteXmlNodeEnd(name, true);
	for (var i = 0; i < this.pivotHierarchy.length; ++i) {
		var elem = this.pivotHierarchy[i];
		elem.toXml(writer, "pivotHierarchy");
	}
	writer.WriteXmlNodeEnd(name);
};
function CT_PivotTableStyle() {
//Attributes
	this.name = null;
	this.showRowHeaders = null;
	this.showColHeaders = null;
	this.showRowStripes = null;
	this.showColStripes = null;
	this.showLastColumn = null;
}
CT_PivotTableStyle.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["name"];
		if (undefined !== val) {
			this.name = AscCommon.unleakString(uq(val));
		}
		val = vals["showRowHeaders"];
		if (undefined !== val) {
			this.showRowHeaders = getBoolFromXml(val);
		}
		val = vals["showColHeaders"];
		if (undefined !== val) {
			this.showColHeaders = getBoolFromXml(val);
		}
		val = vals["showRowStripes"];
		if (undefined !== val) {
			this.showRowStripes = getBoolFromXml(val);
		}
		val = vals["showColStripes"];
		if (undefined !== val) {
			this.showColStripes = getBoolFromXml(val);
		}
		val = vals["showLastColumn"];
		if (undefined !== val) {
			this.showLastColumn = getBoolFromXml(val);
		}
	}
};
CT_PivotTableStyle.prototype.toXml = function(writer, name) {
	writer.WriteXmlNodeStart(name);
	if (null !== this.name) {
		writer.WriteXmlAttributeStringEncode("name", this.name);
	}
	if (null !== this.showRowHeaders) {
		writer.WriteXmlAttributeBool("showRowHeaders", this.showRowHeaders);
	}
	if (null !== this.showColHeaders) {
		writer.WriteXmlAttributeBool("showColHeaders", this.showColHeaders);
	}
	if (null !== this.showRowStripes) {
		writer.WriteXmlAttributeBool("showRowStripes", this.showRowStripes);
	}
	if (null !== this.showColStripes) {
		writer.WriteXmlAttributeBool("showColStripes", this.showColStripes);
	}
	if (null !== this.showLastColumn) {
		writer.WriteXmlAttributeBool("showLastColumn", this.showLastColumn);
	}
	writer.WriteXmlNodeEnd(name, true, true);
};
CT_PivotTableStyle.prototype.set = function() {

};
CT_PivotTableStyle.prototype.asc_getName = function() {
	return this.name;
};
CT_PivotTableStyle.prototype.asc_getShowRowHeaders = function() {
	return this.showRowHeaders;
};
CT_PivotTableStyle.prototype.asc_getShowColHeaders = function() {
	return this.showColHeaders;
};
CT_PivotTableStyle.prototype.asc_getShowRowStripes = function() {
	return this.showRowStripes;
};
CT_PivotTableStyle.prototype.asc_getShowColStripes = function() {
	return this.showColStripes;
};
CT_PivotTableStyle.prototype.asc_setName = function(api, pivot, newVal) {
	if (newVal !== this.name) {
		var t = this;
		api._changePivotStyle(pivot, function(ws) {t._setName(newVal, pivot, ws)});
	}
};
CT_PivotTableStyle.prototype.asc_setShowRowHeaders = function(api, pivot, newVal) {
	if (newVal !== this.showRowHeaders) {
		var t = this;
		api._changePivotStyle(pivot, function(ws) {t._setShowRowHeaders(newVal, pivot, ws)});
	}
};
CT_PivotTableStyle.prototype.asc_setShowColHeaders = function(api, pivot, newVal) {
	if (newVal !== this.showColHeaders) {
		var t = this;
		api._changePivotStyle(pivot, function(ws) {t._setShowColHeaders(newVal, pivot, ws)});
	}
};
CT_PivotTableStyle.prototype.asc_setShowRowStripes = function(api, pivot, newVal) {
	if (newVal !== this.showRowStripes) {
		var t = this;
		api._changePivotStyle(pivot, function(ws) {t._setShowRowStripes(newVal, pivot, ws)});
	}
};
CT_PivotTableStyle.prototype.asc_setShowColStripes = function(api, pivot, newVal) {
	if (newVal !== this.showColStripes) {
		var t = this;
		api._changePivotStyle(pivot, function(ws) {t._setShowColStripes(newVal, pivot, ws)});
	}
};
CT_PivotTableStyle.prototype._setName = function (newVal, pivot, ws) {
	if (History.Is_On() && this.name !== newVal) {
		History.Add(AscCommonExcel.g_oUndoRedoPivotTables, AscCH.historyitem_PivotTable_StyleName,
			ws ? ws.getId() : null, null,
			new AscCommonExcel.UndoRedoData_PivotTable(pivot && pivot.asc_getName(), this.name, newVal));
	}
	this.name = newVal;
};
CT_PivotTableStyle.prototype._setShowRowHeaders = function (newVal, pivot, ws) {
	if (History.Is_On() && this.showRowHeaders !== newVal) {
		History.Add(AscCommonExcel.g_oUndoRedoPivotTables, AscCH.historyitem_PivotTable_StyleShowRowHeaders,
			ws ? ws.getId() : null, null,
			new AscCommonExcel.UndoRedoData_PivotTable(pivot && pivot.asc_getName(), this.showRowHeaders, newVal));
	}
	this.showRowHeaders = newVal;
};
CT_PivotTableStyle.prototype._setShowColHeaders = function (newVal, pivot, ws) {
	if (History.Is_On() && this.showColHeaders !== newVal) {
		History.Add(AscCommonExcel.g_oUndoRedoPivotTables, AscCH.historyitem_PivotTable_StyleShowColHeaders,
			ws ? ws.getId() : null, null,
			new AscCommonExcel.UndoRedoData_PivotTable(pivot && pivot.asc_getName(), this.showColHeaders, newVal));
	}
	this.showColHeaders = newVal;
};
CT_PivotTableStyle.prototype._setShowRowStripes = function (newVal, pivot, ws) {
	if (History.Is_On() && this.showRowStripes !== newVal) {
		History.Add(AscCommonExcel.g_oUndoRedoPivotTables, AscCH.historyitem_PivotTable_StyleShowRowStripes,
			ws ? ws.getId() : null, null,
			new AscCommonExcel.UndoRedoData_PivotTable(pivot && pivot.asc_getName(), this.showRowStripes, newVal));
	}
	this.showRowStripes = newVal;
};
CT_PivotTableStyle.prototype._setShowColStripes = function (newVal, pivot, ws) {
	if (History.Is_On() && this.showColStripes !== newVal) {
		History.Add(AscCommonExcel.g_oUndoRedoPivotTables, AscCH.historyitem_PivotTable_StyleShowColStripes,
			ws ? ws.getId() : null, null,
			new AscCommonExcel.UndoRedoData_PivotTable(pivot && pivot.asc_getName(), this.showColStripes, newVal));
	}
	this.showColStripes = newVal;
};
function CT_PivotFilters() {
//Attributes
	this.count = null;//0
//Members
	this.filter = [];
}
CT_PivotFilters.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["count"];
		if (undefined !== val) {
			this.count = val - 0;
		}
	}
};
CT_PivotFilters.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("filter" === elem) {
		newContext = new CT_PivotFilter();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.filter.push(newContext);
	} else {
		newContext = null;
	}
	return newContext;
};
CT_PivotFilters.prototype.toXml = function(writer, name) {
	writer.WriteXmlNodeStart(name);
	if (null !== this.count) {
		writer.WriteXmlAttributeNumber("count", this.count);
	}
	writer.WriteXmlNodeEnd(name, true);
	for (var i = 0; i < this.filter.length; ++i) {
		var elem = this.filter[i];
		elem.toXml(writer, "filter");
	}
	writer.WriteXmlNodeEnd(name);
};
function CT_RowHierarchiesUsage() {
//Attributes
	this.count = null;
//Members
	this.rowHierarchyUsage = [];
}
CT_RowHierarchiesUsage.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["count"];
		if (undefined !== val) {
			this.count = val - 0;
		}
	}
};
CT_RowHierarchiesUsage.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("rowHierarchyUsage" === elem) {
		newContext = new CT_HierarchyUsage();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.rowHierarchyUsage.push(newContext);
	} else {
		newContext = null;
	}
	return newContext;
};
CT_RowHierarchiesUsage.prototype.toXml = function(writer, name) {
	writer.WriteXmlNodeStart(name);
	if (null !== this.count) {
		writer.WriteXmlAttributeNumber("count", this.count);
	}
	writer.WriteXmlNodeEnd(name, true);
	for (var i = 0; i < this.rowHierarchyUsage.length; ++i) {
		var elem = this.rowHierarchyUsage[i];
		elem.toXml(writer, "rowHierarchyUsage");
	}
	writer.WriteXmlNodeEnd(name);
};
function CT_ColHierarchiesUsage() {
//Attributes
	this.count = null;
//Members
	this.colHierarchyUsage = [];
}
CT_ColHierarchiesUsage.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["count"];
		if (undefined !== val) {
			this.count = val - 0;
		}
	}
};
CT_ColHierarchiesUsage.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("colHierarchyUsage" === elem) {
		newContext = new CT_HierarchyUsage();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.colHierarchyUsage.push(newContext);
	} else {
		newContext = null;
	}
	return newContext;
};
CT_ColHierarchiesUsage.prototype.toXml = function(writer, name) {
	writer.WriteXmlNodeStart(name);
	if (null !== this.count) {
		writer.WriteXmlAttributeNumber("count", this.count);
	}
	writer.WriteXmlNodeEnd(name, true);
	for (var i = 0; i < this.colHierarchyUsage.length; ++i) {
		var elem = this.colHierarchyUsage[i];
		elem.toXml(writer, "colHierarchyUsage");
	}
	writer.WriteXmlNodeEnd(name);
};
function CT_Consolidation() {
//Attributes
	this.autoPage = null;//true
//Members
	this.pages = null;
	this.rangeSets = null;
}
CT_Consolidation.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["autoPage"];
		if (undefined !== val) {
			this.autoPage = getBoolFromXml(val);
		}
	}
};
CT_Consolidation.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("pages" === elem) {
		newContext = new CT_Pages();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.pages = newContext;
	} else if ("rangeSets" === elem) {
		newContext = new CT_RangeSets();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.rangeSets = newContext;
	} else {
		newContext = null;
	}
	return newContext;
};
CT_Consolidation.prototype.toXml = function(writer, name) {
	writer.WriteXmlNodeStart(name);
	if (null !== this.autoPage) {
		writer.WriteXmlAttributeBool("autoPage", this.autoPage);
	}
	writer.WriteXmlNodeEnd(name, true);
	if (null !== this.pages) {
		this.pages.toXml(writer, "pages");
	}
	if (null !== this.rangeSets) {
		this.rangeSets.toXml(writer, "rangeSets");
	}
	writer.WriteXmlNodeEnd(name);
};
function CT_WorksheetSource() {
//Attributes
	this.ref = null;
	this.name = null;
	this.sheet = null;
	this.id = null;
//Private
	this.formula = null;
}
CT_WorksheetSource.prototype.onFormulaEvent = function (type, eventData) {
	if (AscCommon.c_oNotifyParentType.CanDo === type) {
		return true;
	} else if (AscCommon.c_oNotifyParentType.ChangeFormula === type) {
		// ToDo update formula with eventData.assemble;
	}
};
CT_WorksheetSource.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["ref"];
		if (undefined !== val) {
			this.ref = AscCommon.unleakString(uq(val));
		}
		val = vals["name"];
		if (undefined !== val) {
			this.name = AscCommon.unleakString(uq(val));
		}
		val = vals["sheet"];
		if (undefined !== val) {
			this.sheet = AscCommon.unleakString(uq(val));
		}
		val = vals["r:id"];
		if (undefined !== val) {
			this.id = AscCommon.unleakString(uq(val));
		}

		var text;
		if (this.name) {
			text = this.name;
		} else if (this.ref && this.sheet) {
			text = AscCommon.parserHelp.get3DRef(this.sheet, this.ref);
		}
		if (text) {
			this.formula = new AscCommonExcel.parserFormula(text, this, AscCommonExcel.g_DefNameWorksheet);
			this.formula.parse();
			this.formula.buildDependencies();
		}
	}
};
CT_WorksheetSource.prototype.toXml = function(writer, name) {
	writer.WriteXmlNodeStart(name);
	if (null !== this.ref) {
		writer.WriteXmlAttributeStringEncode("ref", this.ref);
	}
	if (null !== this.name) {
		writer.WriteXmlAttributeStringEncode("name", this.name);
	}
	if (null !== this.sheet) {
		writer.WriteXmlAttributeStringEncode("sheet", this.sheet);
	}
	//todo
	// if (null !== this.id) {
		// writer.WriteXmlAttributeStringEncode("r:id", this.id);
	// }
	writer.WriteXmlNodeEnd(name, true, true);
};
function CT_CacheField() {
//Attributes
	this.name = null;
	this.caption = null;
	this.propertyName = null;
	this.serverField = null;//false
	this.uniqueList = null;//true
	this.numFmtId = null;
	this.formula = null;
	this.sqlType = null;//0
	this.hierarchy = null;//0
	this.level = null;//0
	this.databaseField = null;//true
	this.mappingCount = null;
	this.memberPropertyField = null;//false
//Members
	this.sharedItems = null;
	this.fieldGroup = null;
	this.mpMap = [];
	this.extLst = null;
}
CT_CacheField.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["name"];
		if (undefined !== val) {
			this.name = AscCommon.unleakString(uq(val));
		}
		val = vals["caption"];
		if (undefined !== val) {
			this.caption = AscCommon.unleakString(uq(val));
		}
		val = vals["propertyName"];
		if (undefined !== val) {
			this.propertyName = AscCommon.unleakString(uq(val));
		}
		val = vals["serverField"];
		if (undefined !== val) {
			this.serverField = getBoolFromXml(val);
		}
		val = vals["uniqueList"];
		if (undefined !== val) {
			this.uniqueList = getBoolFromXml(val);
		}
		val = vals["numFmtId"];
		if (undefined !== val) {
			this.numFmtId = val - 0;
		}
		val = vals["formula"];
		if (undefined !== val) {
			this.formula = AscCommon.unleakString(uq(val));
		}
		val = vals["sqlType"];
		if (undefined !== val) {
			this.sqlType = val - 0;
		}
		val = vals["hierarchy"];
		if (undefined !== val) {
			this.hierarchy = val - 0;
		}
		val = vals["level"];
		if (undefined !== val) {
			this.level = val - 0;
		}
		val = vals["databaseField"];
		if (undefined !== val) {
			this.databaseField = getBoolFromXml(val);
		}
		val = vals["mappingCount"];
		if (undefined !== val) {
			this.mappingCount = val - 0;
		}
		val = vals["memberPropertyField"];
		if (undefined !== val) {
			this.memberPropertyField = getBoolFromXml(val);
		}
	}
};
CT_CacheField.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("sharedItems" === elem) {
		newContext = new CT_SharedItems();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.sharedItems = newContext;
	} else if ("fieldGroup" === elem) {
		newContext = new CT_FieldGroup();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.fieldGroup = newContext;
	} else if ("mpMap" === elem) {
		newContext = new CT_X();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.mpMap.push(newContext);
	} else if ("extLst" === elem) {
		newContext = new CT_ExtensionList();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.extLst = newContext;
	} else {
		newContext = null;
	}
	return newContext;
};
CT_CacheField.prototype.toXml = function(writer, name) {
	writer.WriteXmlNodeStart(name);
	if (null !== this.name) {
		writer.WriteXmlAttributeStringEncode("name", this.name);
	}
	if (null !== this.caption) {
		writer.WriteXmlAttributeStringEncode("caption", this.caption);
	}
	if (null !== this.propertyName) {
		writer.WriteXmlAttributeStringEncode("propertyName", this.propertyName);
	}
	if (null !== this.serverField) {
		writer.WriteXmlAttributeBool("serverField", this.serverField);
	}
	if (null !== this.uniqueList) {
		writer.WriteXmlAttributeBool("uniqueList", this.uniqueList);
	}
	if (null !== this.numFmtId) {
		writer.WriteXmlAttributeNumber("numFmtId", this.numFmtId);
	}
	if (null !== this.formula) {
		writer.WriteXmlAttributeStringEncode("formula", this.formula);
	}
	if (null !== this.sqlType) {
		writer.WriteXmlAttributeNumber("sqlType", this.sqlType);
	}
	if (null !== this.hierarchy) {
		writer.WriteXmlAttributeNumber("hierarchy", this.hierarchy);
	}
	if (null !== this.level) {
		writer.WriteXmlAttributeNumber("level", this.level);
	}
	if (null !== this.databaseField) {
		writer.WriteXmlAttributeBool("databaseField", this.databaseField);
	}
	if (null !== this.mappingCount) {
		writer.WriteXmlAttributeNumber("mappingCount", this.mappingCount);
	}
	if (null !== this.memberPropertyField) {
		writer.WriteXmlAttributeBool("memberPropertyField", this.memberPropertyField);
	}
	writer.WriteXmlNodeEnd(name, true);
	if (null !== this.sharedItems) {
		this.sharedItems.toXml(writer, "sharedItems");
	}
	if (null !== this.fieldGroup) {
		this.fieldGroup.toXml(writer, "fieldGroup");
	}
	for (var i = 0; i < this.mpMap.length; ++i) {
		var elem = this.mpMap[i];
		elem.toXml(writer, "mpMap");
	}
	if (null !== this.extLst) {
		this.extLst.toXml(writer, "extLst");
	}
	writer.WriteXmlNodeEnd(name);
};
CT_CacheField.prototype.asc_getName = function () {
	return this.name;
};
CT_CacheField.prototype.getSharedItem = function (index) {
	return this.sharedItems && this.sharedItems.Items.get(index);
};
function CT_CacheHierarchy() {
//Attributes
	this.uniqueName = null;
	this.caption = null;
	this.measure = null;//false
	this.set = null;//false
	this.parentSet = null;
	this.iconSet = null;//0
	this.attribute = null;//false
	this.time = null;//false
	this.keyAttribute = null;//false
	this.defaultMemberUniqueName = null;
	this.allUniqueName = null;
	this.allCaption = null;
	this.dimensionUniqueName = null;
	this.displayFolder = null;
	this.measureGroup = null;
	this.measures = null;//false
	this.count = null;
	this.oneField = null;//false
	this.memberValueDatatype = null;
	this.unbalanced = null;
	this.unbalancedGroup = null;
	this.hidden = null;//false
//Members
	this.fieldsUsage = null;
	this.groupLevels = null;
	this.extLst = null;
}
CT_CacheHierarchy.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["uniqueName"];
		if (undefined !== val) {
			this.uniqueName = AscCommon.unleakString(uq(val));
		}
		val = vals["caption"];
		if (undefined !== val) {
			this.caption = AscCommon.unleakString(uq(val));
		}
		val = vals["measure"];
		if (undefined !== val) {
			this.measure = getBoolFromXml(val);
		}
		val = vals["set"];
		if (undefined !== val) {
			this.set = getBoolFromXml(val);
		}
		val = vals["parentSet"];
		if (undefined !== val) {
			this.parentSet = val - 0;
		}
		val = vals["iconSet"];
		if (undefined !== val) {
			this.iconSet = val - 0;
		}
		val = vals["attribute"];
		if (undefined !== val) {
			this.attribute = getBoolFromXml(val);
		}
		val = vals["time"];
		if (undefined !== val) {
			this.time = getBoolFromXml(val);
		}
		val = vals["keyAttribute"];
		if (undefined !== val) {
			this.keyAttribute = getBoolFromXml(val);
		}
		val = vals["defaultMemberUniqueName"];
		if (undefined !== val) {
			this.defaultMemberUniqueName = AscCommon.unleakString(uq(val));
		}
		val = vals["allUniqueName"];
		if (undefined !== val) {
			this.allUniqueName = AscCommon.unleakString(uq(val));
		}
		val = vals["allCaption"];
		if (undefined !== val) {
			this.allCaption = AscCommon.unleakString(uq(val));
		}
		val = vals["dimensionUniqueName"];
		if (undefined !== val) {
			this.dimensionUniqueName = AscCommon.unleakString(uq(val));
		}
		val = vals["displayFolder"];
		if (undefined !== val) {
			this.displayFolder = AscCommon.unleakString(uq(val));
		}
		val = vals["measureGroup"];
		if (undefined !== val) {
			this.measureGroup = AscCommon.unleakString(uq(val));
		}
		val = vals["measures"];
		if (undefined !== val) {
			this.measures = getBoolFromXml(val);
		}
		val = vals["count"];
		if (undefined !== val) {
			this.count = val - 0;
		}
		val = vals["oneField"];
		if (undefined !== val) {
			this.oneField = getBoolFromXml(val);
		}
		val = vals["memberValueDatatype"];
		if (undefined !== val) {
			this.memberValueDatatype = val - 0;
		}
		val = vals["unbalanced"];
		if (undefined !== val) {
			this.unbalanced = getBoolFromXml(val);
		}
		val = vals["unbalancedGroup"];
		if (undefined !== val) {
			this.unbalancedGroup = getBoolFromXml(val);
		}
		val = vals["hidden"];
		if (undefined !== val) {
			this.hidden = getBoolFromXml(val);
		}
	}
};
CT_CacheHierarchy.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("fieldsUsage" === elem) {
		newContext = new CT_FieldsUsage();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.fieldsUsage = newContext;
	} else if ("groupLevels" === elem) {
		newContext = new CT_GroupLevels();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.groupLevels = newContext;
	} else if ("extLst" === elem) {
		newContext = new CT_ExtensionList();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.extLst = newContext;
	} else {
		newContext = null;
	}
	return newContext;
};
CT_CacheHierarchy.prototype.toXml = function(writer, name) {
	writer.WriteXmlNodeStart(name);
	if (null !== this.uniqueName) {
		writer.WriteXmlAttributeStringEncode("uniqueName", this.uniqueName);
	}
	if (null !== this.caption) {
		writer.WriteXmlAttributeStringEncode("caption", this.caption);
	}
	if (null !== this.measure) {
		writer.WriteXmlAttributeBool("measure", this.measure);
	}
	if (null !== this.set) {
		writer.WriteXmlAttributeBool("set", this.set);
	}
	if (null !== this.parentSet) {
		writer.WriteXmlAttributeNumber("parentSet", this.parentSet);
	}
	if (null !== this.iconSet) {
		writer.WriteXmlAttributeNumber("iconSet", this.iconSet);
	}
	if (null !== this.attribute) {
		writer.WriteXmlAttributeBool("attribute", this.attribute);
	}
	if (null !== this.time) {
		writer.WriteXmlAttributeBool("time", this.time);
	}
	if (null !== this.keyAttribute) {
		writer.WriteXmlAttributeBool("keyAttribute", this.keyAttribute);
	}
	if (null !== this.defaultMemberUniqueName) {
		writer.WriteXmlAttributeStringEncode("defaultMemberUniqueName", this.defaultMemberUniqueName);
	}
	if (null !== this.allUniqueName) {
		writer.WriteXmlAttributeStringEncode("allUniqueName", this.allUniqueName);
	}
	if (null !== this.allCaption) {
		writer.WriteXmlAttributeStringEncode("allCaption", this.allCaption);
	}
	if (null !== this.dimensionUniqueName) {
		writer.WriteXmlAttributeStringEncode("dimensionUniqueName", this.dimensionUniqueName);
	}
	if (null !== this.displayFolder) {
		writer.WriteXmlAttributeStringEncode("displayFolder", this.displayFolder);
	}
	if (null !== this.measureGroup) {
		writer.WriteXmlAttributeStringEncode("measureGroup", this.measureGroup);
	}
	if (null !== this.measures) {
		writer.WriteXmlAttributeBool("measures", this.measures);
	}
	if (null !== this.count) {
		writer.WriteXmlAttributeNumber("count", this.count);
	}
	if (null !== this.oneField) {
		writer.WriteXmlAttributeBool("oneField", this.oneField);
	}
	if (null !== this.memberValueDatatype) {
		writer.WriteXmlAttributeNumber("memberValueDatatype", this.memberValueDatatype);
	}
	if (null !== this.unbalanced) {
		writer.WriteXmlAttributeBool("unbalanced", this.unbalanced);
	}
	if (null !== this.unbalancedGroup) {
		writer.WriteXmlAttributeBool("unbalancedGroup", this.unbalancedGroup);
	}
	if (null !== this.hidden) {
		writer.WriteXmlAttributeBool("hidden", this.hidden);
	}
	writer.WriteXmlNodeEnd(name, true);
	if (null !== this.fieldsUsage) {
		this.fieldsUsage.toXml(writer, "fieldsUsage");
	}
	if (null !== this.groupLevels) {
		this.groupLevels.toXml(writer, "groupLevels");
	}
	if (null !== this.extLst) {
		this.extLst.toXml(writer, "extLst");
	}
	writer.WriteXmlNodeEnd(name);
};
function CT_PCDKPI() {
//Attributes
	this.uniqueName = null;
	this.caption = null;
	this.displayFolder = null;
	this.measureGroup = null;
	this.parent = null;
	this.value = null;
	this.goal = null;
	this.status = null;
	this.trend = null;
	this.weight = null;
	this.time = null;
}
CT_PCDKPI.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["uniqueName"];
		if (undefined !== val) {
			this.uniqueName = AscCommon.unleakString(uq(val));
		}
		val = vals["caption"];
		if (undefined !== val) {
			this.caption = AscCommon.unleakString(uq(val));
		}
		val = vals["displayFolder"];
		if (undefined !== val) {
			this.displayFolder = AscCommon.unleakString(uq(val));
		}
		val = vals["measureGroup"];
		if (undefined !== val) {
			this.measureGroup = AscCommon.unleakString(uq(val));
		}
		val = vals["parent"];
		if (undefined !== val) {
			this.parent = AscCommon.unleakString(uq(val));
		}
		val = vals["value"];
		if (undefined !== val) {
			this.value = AscCommon.unleakString(uq(val));
		}
		val = vals["goal"];
		if (undefined !== val) {
			this.goal = AscCommon.unleakString(uq(val));
		}
		val = vals["status"];
		if (undefined !== val) {
			this.status = AscCommon.unleakString(uq(val));
		}
		val = vals["trend"];
		if (undefined !== val) {
			this.trend = AscCommon.unleakString(uq(val));
		}
		val = vals["weight"];
		if (undefined !== val) {
			this.weight = AscCommon.unleakString(uq(val));
		}
		val = vals["time"];
		if (undefined !== val) {
			this.time = AscCommon.unleakString(uq(val));
		}
	}
};
CT_PCDKPI.prototype.toXml = function(writer, name) {
	writer.WriteXmlNodeStart(name);
	if (null !== this.uniqueName) {
		writer.WriteXmlAttributeStringEncode("uniqueName", this.uniqueName);
	}
	if (null !== this.caption) {
		writer.WriteXmlAttributeStringEncode("caption", this.caption);
	}
	if (null !== this.displayFolder) {
		writer.WriteXmlAttributeStringEncode("displayFolder", this.displayFolder);
	}
	if (null !== this.measureGroup) {
		writer.WriteXmlAttributeStringEncode("measureGroup", this.measureGroup);
	}
	if (null !== this.parent) {
		writer.WriteXmlAttributeStringEncode("parent", this.parent);
	}
	if (null !== this.value) {
		writer.WriteXmlAttributeStringEncode("value", this.value);
	}
	if (null !== this.goal) {
		writer.WriteXmlAttributeStringEncode("goal", this.goal);
	}
	if (null !== this.status) {
		writer.WriteXmlAttributeStringEncode("status", this.status);
	}
	if (null !== this.trend) {
		writer.WriteXmlAttributeStringEncode("trend", this.trend);
	}
	if (null !== this.weight) {
		writer.WriteXmlAttributeStringEncode("weight", this.weight);
	}
	if (null !== this.time) {
		writer.WriteXmlAttributeStringEncode("time", this.time);
	}
	writer.WriteXmlNodeEnd(name, true, true);
};
function CT_PCDSDTCEntries() {
//Attributes
	this.count = null;
//Members
	this.Items = [];
}
CT_PCDSDTCEntries.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["count"];
		if (undefined !== val) {
			this.count = val - 0;
		}
	}
};
CT_PCDSDTCEntries.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("e" === elem) {
		newContext = new CT_Error();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.Items.push(newContext);
	} else if ("m" === elem) {
		newContext = new CT_Missing();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.Items.push(newContext);
	} else if ("n" === elem) {
		newContext = new CT_Number();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.Items.push(newContext);
	} else if ("s" === elem) {
		newContext = new CT_String();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.Items.push(newContext);
	} else {
		newContext = null;
	}
	return newContext;
};
CT_PCDSDTCEntries.prototype.toXml = function(writer, name) {
	writer.WriteXmlNodeStart(name);
	if (null !== this.count) {
		writer.WriteXmlAttributeNumber("count", this.count);
	}
	writer.WriteXmlNodeEnd(name, true);
	for (var i = 0; i < this.Items.length; ++i) {
		var elem = this.Items[i];
		if (elem instanceof CT_Error) {
			elem.toXml(writer, "e");
		} else if (elem instanceof CT_Missing) {
			elem.toXml(writer, "m");
		} else if (elem instanceof CT_Number) {
			elem.toXml(writer, "n");
		} else if (elem instanceof CT_String) {
			elem.toXml(writer, "s");
		}
	}
	writer.WriteXmlNodeEnd(name);
};
function CT_Sets() {
//Attributes
	this.count = null;
//Members
	this.set = [];
}
CT_Sets.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["count"];
		if (undefined !== val) {
			this.count = val - 0;
		}
	}
};
CT_Sets.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("set" === elem) {
		newContext = new CT_Set();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.set.push(newContext);
	} else {
		newContext = null;
	}
	return newContext;
};
CT_Sets.prototype.toXml = function(writer, name) {
	writer.WriteXmlNodeStart(name);
	if (null !== this.count) {
		writer.WriteXmlAttributeNumber("count", this.count);
	}
	writer.WriteXmlNodeEnd(name, true);
	for (var i = 0; i < this.set.length; ++i) {
		var elem = this.set[i];
		elem.toXml(writer, "set");
	}
	writer.WriteXmlNodeEnd(name);
};
function CT_QueryCache() {
//Attributes
	this.count = null;
//Members
	this.query = [];
}
CT_QueryCache.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["count"];
		if (undefined !== val) {
			this.count = val - 0;
		}
	}
};
CT_QueryCache.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("query" === elem) {
		newContext = new CT_Query();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.query.push(newContext);
	} else {
		newContext = null;
	}
	return newContext;
};
CT_QueryCache.prototype.toXml = function(writer, name) {
	writer.WriteXmlNodeStart(name);
	if (null !== this.count) {
		writer.WriteXmlAttributeNumber("count", this.count);
	}
	writer.WriteXmlNodeEnd(name, true);
	for (var i = 0; i < this.query.length; ++i) {
		var elem = this.query[i];
		elem.toXml(writer, "query");
	}
	writer.WriteXmlNodeEnd(name);
};
function CT_ServerFormats() {
//Attributes
	this.count = null;
//Members
	this.serverFormat = [];
}
CT_ServerFormats.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["count"];
		if (undefined !== val) {
			this.count = val - 0;
		}
	}
};
CT_ServerFormats.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("serverFormat" === elem) {
		newContext = new CT_ServerFormat();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.serverFormat.push(newContext);
	} else {
		newContext = null;
	}
	return newContext;
};
CT_ServerFormats.prototype.toXml = function(writer, name) {
	writer.WriteXmlNodeStart(name);
	if (null !== this.count) {
		writer.WriteXmlAttributeNumber("count", this.count);
	}
	writer.WriteXmlNodeEnd(name, true);
	for (var i = 0; i < this.serverFormat.length; ++i) {
		var elem = this.serverFormat[i];
		elem.toXml(writer, "serverFormat");
	}
	writer.WriteXmlNodeEnd(name);
};
function CT_CalculatedItem() {
//Attributes
	this.field = null;
	this.formula = null;
//Members
	this.pivotArea = null;
	this.extLst = null;
}
CT_CalculatedItem.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["field"];
		if (undefined !== val) {
			this.field = val - 0;
		}
		val = vals["formula"];
		if (undefined !== val) {
			this.formula = AscCommon.unleakString(uq(val));
		}
	}
};
CT_CalculatedItem.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("pivotArea" === elem) {
		newContext = new CT_PivotArea();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.pivotArea = newContext;
	} else if ("extLst" === elem) {
		newContext = new CT_ExtensionList();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.extLst = newContext;
	} else {
		newContext = null;
	}
	return newContext;
};
CT_CalculatedItem.prototype.toXml = function(writer, name) {
	writer.WriteXmlNodeStart(name);
	if (null !== this.field) {
		writer.WriteXmlAttributeNumber("field", this.field);
	}
	if (null !== this.formula) {
		writer.WriteXmlAttributeStringEncode("formula", this.formula);
	}
	writer.WriteXmlNodeEnd(name, true);
	if (null !== this.pivotArea) {
		this.pivotArea.toXml(writer, "pivotArea");
	}
	if (null !== this.extLst) {
		this.extLst.toXml(writer, "extLst");
	}
	writer.WriteXmlNodeEnd(name);
};
function CT_CalculatedMember() {
//Attributes
	this.name = null;
	this.mdx = null;
	this.memberName = null;
	this.hierarchy = null;
	this.parent = null;
	this.solveOrder = null;//0
	this.set = null;//false
//Members
	this.extLst = null;
}
CT_CalculatedMember.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["name"];
		if (undefined !== val) {
			this.name = AscCommon.unleakString(uq(val));
		}
		val = vals["mdx"];
		if (undefined !== val) {
			this.mdx = AscCommon.unleakString(uq(val));
		}
		val = vals["memberName"];
		if (undefined !== val) {
			this.memberName = AscCommon.unleakString(uq(val));
		}
		val = vals["hierarchy"];
		if (undefined !== val) {
			this.hierarchy = AscCommon.unleakString(uq(val));
		}
		val = vals["parent"];
		if (undefined !== val) {
			this.parent = AscCommon.unleakString(uq(val));
		}
		val = vals["solveOrder"];
		if (undefined !== val) {
			this.solveOrder = val - 0;
		}
		val = vals["set"];
		if (undefined !== val) {
			this.set = getBoolFromXml(val);
		}
	}
};
CT_CalculatedMember.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("extLst" === elem) {
		newContext = new CT_ExtensionList();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.extLst = newContext;
	} else {
		newContext = null;
	}
	return newContext;
};
CT_CalculatedMember.prototype.toXml = function(writer, name) {
	writer.WriteXmlNodeStart(name);
	if (null !== this.name) {
		writer.WriteXmlAttributeStringEncode("name", this.name);
	}
	if (null !== this.mdx) {
		writer.WriteXmlAttributeStringEncode("mdx", this.mdx);
	}
	if (null !== this.memberName) {
		writer.WriteXmlAttributeStringEncode("memberName", this.memberName);
	}
	if (null !== this.hierarchy) {
		writer.WriteXmlAttributeStringEncode("hierarchy", this.hierarchy);
	}
	if (null !== this.parent) {
		writer.WriteXmlAttributeStringEncode("parent", this.parent);
	}
	if (null !== this.solveOrder) {
		writer.WriteXmlAttributeNumber("solveOrder", this.solveOrder);
	}
	if (null !== this.set) {
		writer.WriteXmlAttributeBool("set", this.set);
	}
	writer.WriteXmlNodeEnd(name, true);
	if (null !== this.extLst) {
		this.extLst.toXml(writer, "extLst");
	}
	writer.WriteXmlNodeEnd(name);
};
function CT_PivotDimension() {
//Attributes
	this.measure = null;//false
	this.name = null;
	this.uniqueName = null;
	this.caption = null;
}
CT_PivotDimension.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["measure"];
		if (undefined !== val) {
			this.measure = getBoolFromXml(val);
		}
		val = vals["name"];
		if (undefined !== val) {
			this.name = AscCommon.unleakString(uq(val));
		}
		val = vals["uniqueName"];
		if (undefined !== val) {
			this.uniqueName = AscCommon.unleakString(uq(val));
		}
		val = vals["caption"];
		if (undefined !== val) {
			this.caption = AscCommon.unleakString(uq(val));
		}
	}
};
CT_PivotDimension.prototype.toXml = function(writer, name) {
	writer.WriteXmlNodeStart(name);
	if (null !== this.measure) {
		writer.WriteXmlAttributeBool("measure", this.measure);
	}
	if (null !== this.name) {
		writer.WriteXmlAttributeStringEncode("name", this.name);
	}
	if (null !== this.uniqueName) {
		writer.WriteXmlAttributeStringEncode("uniqueName", this.uniqueName);
	}
	if (null !== this.caption) {
		writer.WriteXmlAttributeStringEncode("caption", this.caption);
	}
	writer.WriteXmlNodeEnd(name, true, true);
};
function CT_MeasureGroup() {
//Attributes
	this.name = null;
	this.caption = null;
}
CT_MeasureGroup.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["name"];
		if (undefined !== val) {
			this.name = AscCommon.unleakString(uq(val));
		}
		val = vals["caption"];
		if (undefined !== val) {
			this.caption = AscCommon.unleakString(uq(val));
		}
	}
};
CT_MeasureGroup.prototype.toXml = function(writer, name) {
	writer.WriteXmlNodeStart(name);
	if (null !== this.name) {
		writer.WriteXmlAttributeStringEncode("name", this.name);
	}
	if (null !== this.caption) {
		writer.WriteXmlAttributeStringEncode("caption", this.caption);
	}
	writer.WriteXmlNodeEnd(name, true, true);
};
function CT_MeasureDimensionMap() {
//Attributes
	this.measureGroup = null;
	this.dimension = null;
}
CT_MeasureDimensionMap.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["measureGroup"];
		if (undefined !== val) {
			this.measureGroup = val - 0;
		}
		val = vals["dimension"];
		if (undefined !== val) {
			this.dimension = val - 0;
		}
	}
};
CT_MeasureDimensionMap.prototype.toXml = function(writer, name) {
	writer.WriteXmlNodeStart(name);
	if (null !== this.measureGroup) {
		writer.WriteXmlAttributeNumber("measureGroup", this.measureGroup);
	}
	if (null !== this.dimension) {
		writer.WriteXmlAttributeNumber("dimension", this.dimension);
	}
	writer.WriteXmlNodeEnd(name, true, true);
};
function CT_Extension() {
//Attributes
	this.uri = null;
//Members
	this.elem = null;
}
CT_Extension.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["uri"];
		if (undefined !== val) {
			this.uri = AscCommon.unleakString(uq(val));
		}
	}
};
CT_Extension.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("x14:pivotTableDefinition" === elem) {
		newContext = new CT_pivotTableDefinitionX14();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.elem = newContext;
	} else {
		newContext = null;
	}
	return newContext;
};
CT_Extension.prototype.toXml = function(writer, name) {
  if ("{962EF5D1-5CA2-4c93-8EF4-DBF5C05439D2}" === this.uri && this.elem) {
    writer.WriteXmlNodeStart(name);
    if (null !== this.uri) {
      writer.WriteXmlAttributeStringEncode("uri", this.uri);
      writer.WriteXmlString(" xmlns:x14=\"http://schemas.microsoft.com/office/spreadsheetml/2009/9/main\"");
    }
    writer.WriteXmlNodeEnd(name, true);
    this.elem.toXml(writer, "x14:pivotTableDefinition");
    writer.WriteXmlNodeEnd(name);
  }
};
function CT_X() {
//Attributes
	this.v = null;//0
}
CT_X.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["v"];
		if (undefined !== val) {
			this.v = val - 0;
		}
	}
};
CT_X.prototype.toXml = function(writer, name) {
	writer.WriteXmlNodeStart(name);
	if (null !== this.v) {
		writer.WriteXmlAttributeNumber("v", this.v);
	}
	writer.WriteXmlNodeEnd(name, true, true);
};
CT_X.prototype.getV = function () {
	return this.v || 0;
};
function CT_Tuples() {
//Attributes
	this.c = null;
//Members
	this.tpl = [];
}
CT_Tuples.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["c"];
		if (undefined !== val) {
			this.c = val - 0;
		}
	}
};
CT_Tuples.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("tpl" === elem) {
		newContext = new CT_Tuple();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.tpl.push(newContext);
	} else {
		newContext = null;
	}
	return newContext;
};
CT_Tuples.prototype.toXml = function(writer, name) {
	writer.WriteXmlNodeStart(name);
	if (null !== this.c) {
		writer.WriteXmlAttributeNumber("c", this.c);
	}
	writer.WriteXmlNodeEnd(name, true);
	for (var i = 0; i < this.tpl.length; ++i) {
		var elem = this.tpl[i];
		elem.toXml(writer, "tpl");
	}
	writer.WriteXmlNodeEnd(name);
};
function CT_PivotField() {
//Attributes
	this.name = null;
	this.axis = null;
	this.dataField = null;//false
	this.subtotalCaption = null;
	this.showDropDowns = null;//true
	this.hiddenLevel = null;//false
	this.uniqueMemberProperty = null;
	this.compact = null;//true
	this.allDrilled = null;//false
	this.numFmtId = null;
	this.outline = null;//true
	this.subtotalTop = null;//true
	this.dragToRow = null;//true
	this.dragToCol = null;//true
	this.multipleItemSelectionAllowed = null;//false
	this.dragToPage = null;//true
	this.dragToData = null;//true
	this.dragOff = null;//true
	this.showAll = null;//true
	this.insertBlankRow = null;//false
	this.serverField = null;//false
	this.insertPageBreak = null;//false
	this.autoShow = null;//false
	this.topAutoShow = null;//true
	this.hideNewItems = null;//false
	this.measureFilter = null;//false
	this.includeNewItemsInFilter = null;//false
	this.itemPageCount = null;//10
	this.sortType = null;//manual
	this.dataSourceSort = null;
	this.nonAutoSortDefault = null;//false
	this.rankBy = null;
	this.defaultSubtotal = null;//true
	this.sumSubtotal = null;//false
	this.countASubtotal = null;//false
	this.avgSubtotal = null;//false
	this.maxSubtotal = null;//false
	this.minSubtotal = null;//false
	this.productSubtotal = null;//false
	this.countSubtotal = null;//false
	this.stdDevSubtotal = null;//false
	this.stdDevPSubtotal = null;//false
	this.varSubtotal = null;//false
	this.varPSubtotal = null;//false
	this.showPropCell = null;//false
	this.showPropTip = null;//false
	this.showPropAsCaption = null;//false
	this.defaultAttributeDrillState = null;//false
//Members
	this.items = null;
	this.autoSortScope = null;
	this.extLst = null;
}
CT_PivotField.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["name"];
		if (undefined !== val) {
			this.name = AscCommon.unleakString(uq(val));
		}
		val = vals["axis"];
		if (undefined !== val) {
			val = FromXml_ST_Axis(val);
			if (-1 !== val) {
				this.axis = val;
			}
		}
		val = vals["dataField"];
		if (undefined !== val) {
			this.dataField = getBoolFromXml(val);
		}
		val = vals["subtotalCaption"];
		if (undefined !== val) {
			this.subtotalCaption = AscCommon.unleakString(uq(val));
		}
		val = vals["showDropDowns"];
		if (undefined !== val) {
			this.showDropDowns = getBoolFromXml(val);
		}
		val = vals["hiddenLevel"];
		if (undefined !== val) {
			this.hiddenLevel = getBoolFromXml(val);
		}
		val = vals["uniqueMemberProperty"];
		if (undefined !== val) {
			this.uniqueMemberProperty = AscCommon.unleakString(uq(val));
		}
		val = vals["compact"];
		if (undefined !== val) {
			this.compact = getBoolFromXml(val);
		}
		val = vals["allDrilled"];
		if (undefined !== val) {
			this.allDrilled = getBoolFromXml(val);
		}
		val = vals["numFmtId"];
		if (undefined !== val) {
			this.numFmtId = val - 0;
		}
		val = vals["outline"];
		if (undefined !== val) {
			this.outline = getBoolFromXml(val);
		}
		val = vals["subtotalTop"];
		if (undefined !== val) {
			this.subtotalTop = getBoolFromXml(val);
		}
		val = vals["dragToRow"];
		if (undefined !== val) {
			this.dragToRow = getBoolFromXml(val);
		}
		val = vals["dragToCol"];
		if (undefined !== val) {
			this.dragToCol = getBoolFromXml(val);
		}
		val = vals["multipleItemSelectionAllowed"];
		if (undefined !== val) {
			this.multipleItemSelectionAllowed = getBoolFromXml(val);
		}
		val = vals["dragToPage"];
		if (undefined !== val) {
			this.dragToPage = getBoolFromXml(val);
		}
		val = vals["dragToData"];
		if (undefined !== val) {
			this.dragToData = getBoolFromXml(val);
		}
		val = vals["dragOff"];
		if (undefined !== val) {
			this.dragOff = getBoolFromXml(val);
		}
		val = vals["showAll"];
		if (undefined !== val) {
			this.showAll = getBoolFromXml(val);
		}
		val = vals["insertBlankRow"];
		if (undefined !== val) {
			this.insertBlankRow = getBoolFromXml(val);
		}
		val = vals["serverField"];
		if (undefined !== val) {
			this.serverField = getBoolFromXml(val);
		}
		val = vals["insertPageBreak"];
		if (undefined !== val) {
			this.insertPageBreak = getBoolFromXml(val);
		}
		val = vals["autoShow"];
		if (undefined !== val) {
			this.autoShow = getBoolFromXml(val);
		}
		val = vals["topAutoShow"];
		if (undefined !== val) {
			this.topAutoShow = getBoolFromXml(val);
		}
		val = vals["hideNewItems"];
		if (undefined !== val) {
			this.hideNewItems = getBoolFromXml(val);
		}
		val = vals["measureFilter"];
		if (undefined !== val) {
			this.measureFilter = getBoolFromXml(val);
		}
		val = vals["includeNewItemsInFilter"];
		if (undefined !== val) {
			this.includeNewItemsInFilter = getBoolFromXml(val);
		}
		val = vals["itemPageCount"];
		if (undefined !== val) {
			this.itemPageCount = val - 0;
		}
		val = vals["sortType"];
		if (undefined !== val) {
			val = FromXml_ST_FieldSortType(val);
			if (-1 !== val) {
				this.sortType = val;
			}
		}
		val = vals["dataSourceSort"];
		if (undefined !== val) {
			this.dataSourceSort = getBoolFromXml(val);
		}
		val = vals["nonAutoSortDefault"];
		if (undefined !== val) {
			this.nonAutoSortDefault = getBoolFromXml(val);
		}
		val = vals["rankBy"];
		if (undefined !== val) {
			this.rankBy = val - 0;
		}
		val = vals["defaultSubtotal"];
		if (undefined !== val) {
			this.defaultSubtotal = getBoolFromXml(val);
		}
		val = vals["sumSubtotal"];
		if (undefined !== val) {
			this.sumSubtotal = getBoolFromXml(val);
		}
		val = vals["countASubtotal"];
		if (undefined !== val) {
			this.countASubtotal = getBoolFromXml(val);
		}
		val = vals["avgSubtotal"];
		if (undefined !== val) {
			this.avgSubtotal = getBoolFromXml(val);
		}
		val = vals["maxSubtotal"];
		if (undefined !== val) {
			this.maxSubtotal = getBoolFromXml(val);
		}
		val = vals["minSubtotal"];
		if (undefined !== val) {
			this.minSubtotal = getBoolFromXml(val);
		}
		val = vals["productSubtotal"];
		if (undefined !== val) {
			this.productSubtotal = getBoolFromXml(val);
		}
		val = vals["countSubtotal"];
		if (undefined !== val) {
			this.countSubtotal = getBoolFromXml(val);
		}
		val = vals["stdDevSubtotal"];
		if (undefined !== val) {
			this.stdDevSubtotal = getBoolFromXml(val);
		}
		val = vals["stdDevPSubtotal"];
		if (undefined !== val) {
			this.stdDevPSubtotal = getBoolFromXml(val);
		}
		val = vals["varSubtotal"];
		if (undefined !== val) {
			this.varSubtotal = getBoolFromXml(val);
		}
		val = vals["varPSubtotal"];
		if (undefined !== val) {
			this.varPSubtotal = getBoolFromXml(val);
		}
		val = vals["showPropCell"];
		if (undefined !== val) {
			this.showPropCell = getBoolFromXml(val);
		}
		val = vals["showPropTip"];
		if (undefined !== val) {
			this.showPropTip = getBoolFromXml(val);
		}
		val = vals["showPropAsCaption"];
		if (undefined !== val) {
			this.showPropAsCaption = getBoolFromXml(val);
		}
		val = vals["defaultAttributeDrillState"];
		if (undefined !== val) {
			this.defaultAttributeDrillState = getBoolFromXml(val);
		}
	}
};
CT_PivotField.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("items" === elem) {
		newContext = new CT_Items();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.items = newContext;
	} else if ("autoSortScope" === elem) {
		newContext = new CT_AutoSortScope();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.autoSortScope = newContext;
	} else if ("extLst" === elem) {
		newContext = new CT_ExtensionList();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.extLst = newContext;
	} else {
		newContext = null;
	}
	return newContext;
};
CT_PivotField.prototype.toXml = function(writer, name) {
	writer.WriteXmlNodeStart(name);
	if (null !== this.name) {
		writer.WriteXmlAttributeStringEncode("name", this.name);
	}
	if (null !== this.axis) {
		writer.WriteXmlAttributeStringEncode("axis", ToXml_ST_Axis(this.axis));
	}
	if (null !== this.dataField) {
		writer.WriteXmlAttributeBool("dataField", this.dataField);
	}
	if (null !== this.subtotalCaption) {
		writer.WriteXmlAttributeStringEncode("subtotalCaption", this.subtotalCaption);
	}
	if (null !== this.showDropDowns) {
		writer.WriteXmlAttributeBool("showDropDowns", this.showDropDowns);
	}
	if (null !== this.hiddenLevel) {
		writer.WriteXmlAttributeBool("hiddenLevel", this.hiddenLevel);
	}
	if (null !== this.uniqueMemberProperty) {
		writer.WriteXmlAttributeStringEncode("uniqueMemberProperty", this.uniqueMemberProperty);
	}
	if (null !== this.compact) {
		writer.WriteXmlAttributeBool("compact", this.compact);
	}
	if (null !== this.allDrilled) {
		writer.WriteXmlAttributeBool("allDrilled", this.allDrilled);
	}
	if (null !== this.numFmtId) {
		writer.WriteXmlAttributeNumber("numFmtId", this.numFmtId);
	}
	if (null !== this.outline) {
		writer.WriteXmlAttributeBool("outline", this.outline);
	}
	if (null !== this.subtotalTop) {
		writer.WriteXmlAttributeBool("subtotalTop", this.subtotalTop);
	}
	if (null !== this.dragToRow) {
		writer.WriteXmlAttributeBool("dragToRow", this.dragToRow);
	}
	if (null !== this.dragToCol) {
		writer.WriteXmlAttributeBool("dragToCol", this.dragToCol);
	}
	if (null !== this.multipleItemSelectionAllowed) {
		writer.WriteXmlAttributeBool("multipleItemSelectionAllowed", this.multipleItemSelectionAllowed);
	}
	if (null !== this.dragToPage) {
		writer.WriteXmlAttributeBool("dragToPage", this.dragToPage);
	}
	if (null !== this.dragToData) {
		writer.WriteXmlAttributeBool("dragToData", this.dragToData);
	}
	if (null !== this.dragOff) {
		writer.WriteXmlAttributeBool("dragOff", this.dragOff);
	}
	if (null !== this.showAll) {
		writer.WriteXmlAttributeBool("showAll", this.showAll);
	}
	if (null !== this.insertBlankRow) {
		writer.WriteXmlAttributeBool("insertBlankRow", this.insertBlankRow);
	}
	if (null !== this.serverField) {
		writer.WriteXmlAttributeBool("serverField", this.serverField);
	}
	if (null !== this.insertPageBreak) {
		writer.WriteXmlAttributeBool("insertPageBreak", this.insertPageBreak);
	}
	if (null !== this.autoShow) {
		writer.WriteXmlAttributeBool("autoShow", this.autoShow);
	}
	if (null !== this.topAutoShow) {
		writer.WriteXmlAttributeBool("topAutoShow", this.topAutoShow);
	}
	if (null !== this.hideNewItems) {
		writer.WriteXmlAttributeBool("hideNewItems", this.hideNewItems);
	}
	if (null !== this.measureFilter) {
		writer.WriteXmlAttributeBool("measureFilter", this.measureFilter);
	}
	if (null !== this.includeNewItemsInFilter) {
		writer.WriteXmlAttributeBool("includeNewItemsInFilter", this.includeNewItemsInFilter);
	}
	if (null !== this.itemPageCount) {
		writer.WriteXmlAttributeNumber("itemPageCount", this.itemPageCount);
	}
	if (null !== this.sortType) {
		writer.WriteXmlAttributeStringEncode("sortType", ToXml_ST_FieldSortType(this.sortType));
	}
	if (null !== this.dataSourceSort) {
		writer.WriteXmlAttributeBool("dataSourceSort", this.dataSourceSort);
	}
	if (null !== this.nonAutoSortDefault) {
		writer.WriteXmlAttributeBool("nonAutoSortDefault", this.nonAutoSortDefault);
	}
	if (null !== this.rankBy) {
		writer.WriteXmlAttributeNumber("rankBy", this.rankBy);
	}
	if (null !== this.defaultSubtotal) {
		writer.WriteXmlAttributeBool("defaultSubtotal", this.defaultSubtotal);
	}
	if (null !== this.sumSubtotal) {
		writer.WriteXmlAttributeBool("sumSubtotal", this.sumSubtotal);
	}
	if (null !== this.countASubtotal) {
		writer.WriteXmlAttributeBool("countASubtotal", this.countASubtotal);
	}
	if (null !== this.avgSubtotal) {
		writer.WriteXmlAttributeBool("avgSubtotal", this.avgSubtotal);
	}
	if (null !== this.maxSubtotal) {
		writer.WriteXmlAttributeBool("maxSubtotal", this.maxSubtotal);
	}
	if (null !== this.minSubtotal) {
		writer.WriteXmlAttributeBool("minSubtotal", this.minSubtotal);
	}
	if (null !== this.productSubtotal) {
		writer.WriteXmlAttributeBool("productSubtotal", this.productSubtotal);
	}
	if (null !== this.countSubtotal) {
		writer.WriteXmlAttributeBool("countSubtotal", this.countSubtotal);
	}
	if (null !== this.stdDevSubtotal) {
		writer.WriteXmlAttributeBool("stdDevSubtotal", this.stdDevSubtotal);
	}
	if (null !== this.stdDevPSubtotal) {
		writer.WriteXmlAttributeBool("stdDevPSubtotal", this.stdDevPSubtotal);
	}
	if (null !== this.varSubtotal) {
		writer.WriteXmlAttributeBool("varSubtotal", this.varSubtotal);
	}
	if (null !== this.varPSubtotal) {
		writer.WriteXmlAttributeBool("varPSubtotal", this.varPSubtotal);
	}
	if (null !== this.showPropCell) {
		writer.WriteXmlAttributeBool("showPropCell", this.showPropCell);
	}
	if (null !== this.showPropTip) {
		writer.WriteXmlAttributeBool("showPropTip", this.showPropTip);
	}
	if (null !== this.showPropAsCaption) {
		writer.WriteXmlAttributeBool("showPropAsCaption", this.showPropAsCaption);
	}
	if (null !== this.defaultAttributeDrillState) {
		writer.WriteXmlAttributeBool("defaultAttributeDrillState", this.defaultAttributeDrillState);
	}
	writer.WriteXmlNodeEnd(name, true);
	if (null !== this.items) {
		this.items.toXml(writer, "items");
	}
	if (null !== this.autoSortScope) {
		this.autoSortScope.toXml(writer, "autoSortScope");
	}
	if (null !== this.extLst) {
		this.extLst.toXml(writer, "extLst");
	}
	writer.WriteXmlNodeEnd(name);
};
CT_PivotField.prototype.asc_getName = function () {
	return this.name;
};
CT_PivotField.prototype.asc_getSubtotalTop = function () {
	return null !== this.subtotalTop ? this.subtotalTop : true;
};
CT_PivotField.prototype.asc_getSubtotals = function () {
	var res = null;
	if (null === this.defaultSubtotal || this.defaultSubtotal) {
		res = [];
		if (this.sumSubtotal) {
			res.push(c_oAscItemType.Sum);
		}
		if (this.countASubtotal) {
			res.push(c_oAscItemType.CountA);
		}
		if (this.avgSubtotal) {
			res.push(c_oAscItemType.Avg);
		}
		if (this.maxSubtotal) {
			res.push(c_oAscItemType.Max);
		}
		if (this.minSubtotal) {
			res.push(c_oAscItemType.Min);
		}
		if (this.productSubtotal) {
			res.push(c_oAscItemType.Product);
		}
		if (this.countSubtotal) {
			res.push(c_oAscItemType.Count);
		}
		if (this.stdDevSubtotal) {
			res.push(c_oAscItemType.StdDev);
		}
		if (this.stdDevPSubtotal) {
			res.push(c_oAscItemType.StdDevP);
		}
		if (this.varSubtotal) {
			res.push(c_oAscItemType.Var);
		}
		if (this.varPSubtotal) {
			res.push(c_oAscItemType.VarP);
		}
	}
	return res;
};
CT_PivotField.prototype.getItem = function (index) {
	return this.items && this.items.item[index];
};
function CT_Field() {
//Attributes
	this.x = null;
}
CT_Field.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["x"];
		if (undefined !== val) {
			this.x = val - 0;
		}
	}
};
CT_Field.prototype.toXml = function(writer, name) {
	writer.WriteXmlNodeStart(name);
	if (null !== this.x) {
		writer.WriteXmlAttributeNumber("x", this.x);
	}
	writer.WriteXmlNodeEnd(name, true, true);
};
CT_Field.prototype.asc_getIndex = function () {
	return this.x || 0;
};
function CT_I() {
//Attributes
	this.t = null;//data
	this.r = null;//0
	this.i = null;//0
//Members
	this.x = [];
}
CT_I.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["t"];
		if (undefined !== val) {
			val = FromXml_ST_ItemType(val);
			if (-1 !== val) {
				this.t = val;
			}
		}
		val = vals["r"];
		if (undefined !== val) {
			this.r = val - 0;
		}
		val = vals["i"];
		if (undefined !== val) {
			this.i = val - 0;
		}
	}
};
CT_I.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("x" === elem) {
		newContext = new CT_X();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.x.push(newContext);
	} else {
		newContext = null;
	}
	return newContext;
};
CT_I.prototype.toXml = function(writer, name) {
	writer.WriteXmlNodeStart(name);
	if (null !== this.t) {
		writer.WriteXmlAttributeStringEncode("t", ToXml_ST_ItemType(this.t));
	}
	if (null !== this.r) {
		writer.WriteXmlAttributeNumber("r", this.r);
	}
	if (null !== this.i) {
		writer.WriteXmlAttributeNumber("i", this.i);
	}
	writer.WriteXmlNodeEnd(name, true);
	for (var i = 0; i < this.x.length; ++i) {
		var elem = this.x[i];
		elem.toXml(writer, "x");
	}
	writer.WriteXmlNodeEnd(name);
};
CT_I.prototype.getR = function () {
	return this.r || 0;
};
function CT_PageField() {
//Attributes
	this.fld = null;
	this.item = null;
	this.hier = null;
	this.name = null;
	this.cap = null;
//Members
	this.extLst = null;
}
CT_PageField.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["fld"];
		if (undefined !== val) {
			this.fld = val - 0;
		}
		val = vals["item"];
		if (undefined !== val) {
			this.item = val - 0;
		}
		val = vals["hier"];
		if (undefined !== val) {
			this.hier = val - 0;
		}
		val = vals["name"];
		if (undefined !== val) {
			this.name = AscCommon.unleakString(uq(val));
		}
		val = vals["cap"];
		if (undefined !== val) {
			this.cap = AscCommon.unleakString(uq(val));
		}
	}
};
CT_PageField.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("extLst" === elem) {
		newContext = new CT_ExtensionList();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.extLst = newContext;
	} else {
		newContext = null;
	}
	return newContext;
};
CT_PageField.prototype.toXml = function(writer, name) {
	writer.WriteXmlNodeStart(name);
	if (null !== this.fld) {
		writer.WriteXmlAttributeNumber("fld", this.fld);
	}
	if (null !== this.item) {
		writer.WriteXmlAttributeNumber("item", this.item);
	}
	if (null !== this.hier) {
		writer.WriteXmlAttributeNumber("hier", this.hier);
	}
	if (null !== this.name) {
		writer.WriteXmlAttributeStringEncode("name", this.name);
	}
	if (null !== this.cap) {
		writer.WriteXmlAttributeStringEncode("cap", this.cap);
	}
	writer.WriteXmlNodeEnd(name, true);
	if (null !== this.extLst) {
		this.extLst.toXml(writer, "extLst");
	}
	writer.WriteXmlNodeEnd(name);
};
CT_PageField.prototype.asc_getName = function () {
	return this.name;
};
CT_PageField.prototype.asc_getIndex = function () {
	return this.fld;
};
function CT_DataField() {
//Attributes
	this.name = null;
	this.fld = null;
	this.subtotal = null;//sum
	this.showDataAs = null;//normal
	this.baseField = null;//-1
	this.baseItem = null;//1048832
	this.numFmtId = null;
//Members
	this.extLst = null;
}
CT_DataField.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["name"];
		if (undefined !== val) {
			this.name = AscCommon.unleakString(uq(val));
		}
		val = vals["fld"];
		if (undefined !== val) {
			this.fld = val - 0;
		}
		val = vals["subtotal"];
		if (undefined !== val) {
			val = FromXml_ST_DataConsolidateFunction(val);
			if (-1 !== val) {
				this.subtotal = val;
			}
		}
		val = vals["showDataAs"];
		if (undefined !== val) {
			val = FromXml_ST_ShowDataAs(val);
			if (-1 !== val) {
				this.showDataAs = val;
			}
		}
		val = vals["baseField"];
		if (undefined !== val) {
			this.baseField = val - 0;
		}
		val = vals["baseItem"];
		if (undefined !== val) {
			this.baseItem = val - 0;
		}
		val = vals["numFmtId"];
		if (undefined !== val) {
			this.numFmtId = val - 0;
		}
	}
};
CT_DataField.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("extLst" === elem) {
		newContext = new CT_ExtensionList();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.extLst = newContext;
	} else {
		newContext = null;
	}
	return newContext;
};
CT_DataField.prototype.toXml = function(writer, name) {
	writer.WriteXmlNodeStart(name);
	if (null !== this.name) {
		writer.WriteXmlAttributeStringEncode("name", this.name);
	}
	if (null !== this.fld) {
		writer.WriteXmlAttributeNumber("fld", this.fld);
	}
	if (null !== this.subtotal) {
		writer.WriteXmlAttributeStringEncode("subtotal", ToXml_ST_DataConsolidateFunction(this.subtotal));
	}
	if (null !== this.showDataAs) {
		writer.WriteXmlAttributeStringEncode("showDataAs", ToXml_ST_ShowDataAs(this.showDataAs));
	}
	if (null !== this.baseField) {
		writer.WriteXmlAttributeNumber("baseField", this.baseField);
	}
	if (null !== this.baseItem) {
		writer.WriteXmlAttributeNumber("baseItem", this.baseItem);
	}
	if (null !== this.numFmtId) {
		writer.WriteXmlAttributeNumber("numFmtId", this.numFmtId);
	}
	writer.WriteXmlNodeEnd(name, true);
	if (null !== this.extLst) {
		this.extLst.toXml(writer, "extLst");
	}
	writer.WriteXmlNodeEnd(name);
};
CT_DataField.prototype.asc_getName = function () {
	return this.name;
};
CT_DataField.prototype.asc_getIndex = function () {
	return this.fld;
};
CT_DataField.prototype.asc_getSubtotal = function () {
	return null !== this.subtotal ? this.subtotal : c_oAscDataConsolidateFunction.Sum;
};
CT_DataField.prototype.asc_getShowDataAs = function () {
	return null !== this.showDataAs ? this.showDataAs : c_oAscShowDataAs.Normal;
};
CT_DataField.prototype.asc_set = function (api, pivot, newVal) {
	var t = this;
	api._changePivotStyle(pivot, function (ws) {
		if (null !== newVal.name && t.name !== newVal.name) {
			t.asc_setName(newVal.name);
		}
		if (null !== newVal.subtotal && t.subtotal !== newVal.subtotal) {
			t.asc_setSubtotal(newVal.subtotal);
		}

		ws.clearPivotTable(pivot);
		ws.updatePivotTable(pivot);
	});
};
CT_DataField.prototype.asc_setName = function(newVal) {
	this.name = newVal;
};
CT_DataField.prototype.asc_setSubtotal = function(newVal) {
	this.subtotal = newVal;
};
function CT_Format() {
//Attributes
	this.action = null;//formatting
	this.dxfId = null;
//Members
	this.pivotArea = null;
	this.extLst = null;
}
CT_Format.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["action"];
		if (undefined !== val) {
			val = FromXml_ST_FormatAction(val);
			if (-1 !== val) {
				this.action = val;
			}
		}
		val = vals["dxfId"];
		if (undefined !== val) {
			this.dxfId = val - 0;
		}
	}
};
CT_Format.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("pivotArea" === elem) {
		newContext = new CT_PivotArea();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.pivotArea = newContext;
	} else if ("extLst" === elem) {
		newContext = new CT_ExtensionList();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.extLst = newContext;
	} else {
		newContext = null;
	}
	return newContext;
};
CT_Format.prototype.toXml = function(writer, name) {
	writer.WriteXmlNodeStart(name);
	if (null !== this.action) {
		writer.WriteXmlAttributeStringEncode("action", ToXml_ST_FormatAction(this.action));
	}
	//todo
	// if (null !== this.dxfId) {
	// 	writer.WriteXmlAttributeNumber("dxfId", this.dxfId);
	// }
	writer.WriteXmlNodeEnd(name, true);
	if (null !== this.pivotArea) {
		this.pivotArea.toXml(writer, "pivotArea");
	}
	if (null !== this.extLst) {
		this.extLst.toXml(writer, "extLst");
	}
	writer.WriteXmlNodeEnd(name);
};
function CT_ConditionalFormat() {
//Attributes
	this.scope = null;//selection
	this.type = null;//none
	this.priority = null;
//Members
	this.pivotAreas = null;
	this.extLst = null;
}
CT_ConditionalFormat.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["scope"];
		if (undefined !== val) {
			val = FromXml_ST_Scope(val);
			if (-1 !== val) {
				this.scope = val;
			}
		}
		val = vals["type"];
		if (undefined !== val) {
			val = FromXml_ST_Type(val);
			if (-1 !== val) {
				this.type = val;
			}
		}
		val = vals["priority"];
		if (undefined !== val) {
			this.priority = val - 0;
		}
	}
};
CT_ConditionalFormat.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("pivotAreas" === elem) {
		newContext = new CT_PivotAreas();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.pivotAreas = newContext;
	} else if ("extLst" === elem) {
		newContext = new CT_ExtensionList();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.extLst = newContext;
	} else {
		newContext = null;
	}
	return newContext;
};
CT_ConditionalFormat.prototype.toXml = function(writer, name) {
	writer.WriteXmlNodeStart(name);
	if (null !== this.scope) {
		writer.WriteXmlAttributeStringEncode("scope", ToXml_ST_Scope(this.scope));
	}
	if (null !== this.type) {
		writer.WriteXmlAttributeStringEncode("type", ToXml_ST_Type(this.type));
	}
	if (null !== this.priority) {
		writer.WriteXmlAttributeNumber("priority", this.priority);
	}
	writer.WriteXmlNodeEnd(name, true);
	if (null !== this.pivotAreas) {
		this.pivotAreas.toXml(writer, "pivotAreas");
	}
	if (null !== this.extLst) {
		this.extLst.toXml(writer, "extLst");
	}
	writer.WriteXmlNodeEnd(name);
};
function CT_ChartFormat() {
//Attributes
	this.chart = null;
	this.format = null;
	this.series = null;//false
//Members
	this.pivotArea = null;
}
CT_ChartFormat.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["chart"];
		if (undefined !== val) {
			this.chart = val - 0;
		}
		val = vals["format"];
		if (undefined !== val) {
			this.format = val - 0;
		}
		val = vals["series"];
		if (undefined !== val) {
			this.series = getBoolFromXml(val);
		}
	}
};
CT_ChartFormat.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("pivotArea" === elem) {
		newContext = new CT_PivotArea();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.pivotArea = newContext;
	} else {
		newContext = null;
	}
	return newContext;
};
CT_ChartFormat.prototype.toXml = function(writer, name) {
	writer.WriteXmlNodeStart(name);
	if (null !== this.chart) {
		writer.WriteXmlAttributeNumber("chart", this.chart);
	}
	if (null !== this.format) {
		writer.WriteXmlAttributeNumber("format", this.format);
	}
	if (null !== this.series) {
		writer.WriteXmlAttributeBool("series", this.series);
	}
	writer.WriteXmlNodeEnd(name, true);
	if (null !== this.pivotArea) {
		this.pivotArea.toXml(writer, "pivotArea");
	}
	writer.WriteXmlNodeEnd(name);
};
function CT_PivotHierarchy() {
//Attributes
	this.outline = null;//false
	this.multipleItemSelectionAllowed = null;//false
	this.subtotalTop = null;//false
	this.showInFieldList = null;//true
	this.dragToRow = null;//true
	this.dragToCol = null;//true
	this.dragToPage = null;//true
	this.dragToData = null;//false
	this.dragOff = null;//true
	this.includeNewItemsInFilter = null;//false
	this.caption = null;
//Members
	this.mps = null;
	this.members = [];
	this.extLst = null;
}
CT_PivotHierarchy.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["outline"];
		if (undefined !== val) {
			this.outline = getBoolFromXml(val);
		}
		val = vals["multipleItemSelectionAllowed"];
		if (undefined !== val) {
			this.multipleItemSelectionAllowed = getBoolFromXml(val);
		}
		val = vals["subtotalTop"];
		if (undefined !== val) {
			this.subtotalTop = getBoolFromXml(val);
		}
		val = vals["showInFieldList"];
		if (undefined !== val) {
			this.showInFieldList = getBoolFromXml(val);
		}
		val = vals["dragToRow"];
		if (undefined !== val) {
			this.dragToRow = getBoolFromXml(val);
		}
		val = vals["dragToCol"];
		if (undefined !== val) {
			this.dragToCol = getBoolFromXml(val);
		}
		val = vals["dragToPage"];
		if (undefined !== val) {
			this.dragToPage = getBoolFromXml(val);
		}
		val = vals["dragToData"];
		if (undefined !== val) {
			this.dragToData = getBoolFromXml(val);
		}
		val = vals["dragOff"];
		if (undefined !== val) {
			this.dragOff = getBoolFromXml(val);
		}
		val = vals["includeNewItemsInFilter"];
		if (undefined !== val) {
			this.includeNewItemsInFilter = getBoolFromXml(val);
		}
		val = vals["caption"];
		if (undefined !== val) {
			this.caption = AscCommon.unleakString(uq(val));
		}
	}
};
CT_PivotHierarchy.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("mps" === elem) {
		newContext = new CT_MemberProperties();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.mps = newContext;
	} else if ("members" === elem) {
		newContext = new CT_Members();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.members.push(newContext);
	} else if ("extLst" === elem) {
		newContext = new CT_ExtensionList();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.extLst = newContext;
	} else {
		newContext = null;
	}
	return newContext;
};
CT_PivotHierarchy.prototype.toXml = function(writer, name) {
	writer.WriteXmlNodeStart(name);
	if (null !== this.outline) {
		writer.WriteXmlAttributeBool("outline", this.outline);
	}
	if (null !== this.multipleItemSelectionAllowed) {
		writer.WriteXmlAttributeBool("multipleItemSelectionAllowed", this.multipleItemSelectionAllowed);
	}
	if (null !== this.subtotalTop) {
		writer.WriteXmlAttributeBool("subtotalTop", this.subtotalTop);
	}
	if (null !== this.showInFieldList) {
		writer.WriteXmlAttributeBool("showInFieldList", this.showInFieldList);
	}
	if (null !== this.dragToRow) {
		writer.WriteXmlAttributeBool("dragToRow", this.dragToRow);
	}
	if (null !== this.dragToCol) {
		writer.WriteXmlAttributeBool("dragToCol", this.dragToCol);
	}
	if (null !== this.dragToPage) {
		writer.WriteXmlAttributeBool("dragToPage", this.dragToPage);
	}
	if (null !== this.dragToData) {
		writer.WriteXmlAttributeBool("dragToData", this.dragToData);
	}
	if (null !== this.dragOff) {
		writer.WriteXmlAttributeBool("dragOff", this.dragOff);
	}
	if (null !== this.includeNewItemsInFilter) {
		writer.WriteXmlAttributeBool("includeNewItemsInFilter", this.includeNewItemsInFilter);
	}
	if (null !== this.caption) {
		writer.WriteXmlAttributeStringEncode("caption", this.caption);
	}
	writer.WriteXmlNodeEnd(name, true);
	if (null !== this.mps) {
		this.mps.toXml(writer, "mps");
	}
	for (var i = 0; i < this.members.length; ++i) {
		var elem = this.members[i];
		elem.toXml(writer, "members");
	}
	if (null !== this.extLst) {
		this.extLst.toXml(writer, "extLst");
	}
	writer.WriteXmlNodeEnd(name);
};
function CT_PivotFilter() {
//Attributes
	this.fld = null;
	this.mpFld = null;
	this.type = null;
	this.evalOrder = null;//0
	this.id = null;
	this.iMeasureHier = null;
	this.iMeasureFld = null;
	this.name = null;
	this.description = null;
	this.stringValue1 = null;
	this.stringValue2 = null;
//Members
	this.autoFilter = null;
	this.extLst = null;
}
CT_PivotFilter.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["fld"];
		if (undefined !== val) {
			this.fld = val - 0;
		}
		val = vals["mpFld"];
		if (undefined !== val) {
			this.mpFld = val - 0;
		}
		val = vals["type"];
		if (undefined !== val) {
			val = FromXml_ST_PivotFilterType(val);
			if (-1 !== val) {
				this.type = val;
			}
		}
		val = vals["evalOrder"];
		if (undefined !== val) {
			this.evalOrder = val - 0;
		}
		val = vals["id"];
		if (undefined !== val) {
			this.id = val - 0;
		}
		val = vals["iMeasureHier"];
		if (undefined !== val) {
			this.iMeasureHier = val - 0;
		}
		val = vals["iMeasureFld"];
		if (undefined !== val) {
			this.iMeasureFld = val - 0;
		}
		val = vals["name"];
		if (undefined !== val) {
			this.name = AscCommon.unleakString(uq(val));
		}
		val = vals["description"];
		if (undefined !== val) {
			this.description = AscCommon.unleakString(uq(val));
		}
		val = vals["stringValue1"];
		if (undefined !== val) {
			this.stringValue1 = AscCommon.unleakString(uq(val));
		}
		val = vals["stringValue2"];
		if (undefined !== val) {
			this.stringValue2 = AscCommon.unleakString(uq(val));
		}
	}
};
CT_PivotFilter.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("autoFilter" === elem) {
		newContext = new CT_AutoFilter();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.autoFilter = newContext;
	} else if ("extLst" === elem) {
		newContext = new CT_ExtensionList();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.extLst = newContext;
	} else {
		newContext = null;
	}
	return newContext;
};
CT_PivotFilter.prototype.toXml = function(writer, name) {
	writer.WriteXmlNodeStart(name);
	if (null !== this.fld) {
		writer.WriteXmlAttributeNumber("fld", this.fld);
	}
	if (null !== this.mpFld) {
		writer.WriteXmlAttributeNumber("mpFld", this.mpFld);
	}
	if (null !== this.type) {
		writer.WriteXmlAttributeStringEncode("type", ToXml_ST_PivotFilterType(this.type));
	}
	if (null !== this.evalOrder) {
		writer.WriteXmlAttributeNumber("evalOrder", this.evalOrder);
	}
	if (null !== this.id) {
		writer.WriteXmlAttributeNumber("id", this.id);
	}
	if (null !== this.iMeasureHier) {
		writer.WriteXmlAttributeNumber("iMeasureHier", this.iMeasureHier);
	}
	if (null !== this.iMeasureFld) {
		writer.WriteXmlAttributeNumber("iMeasureFld", this.iMeasureFld);
	}
	if (null !== this.name) {
		writer.WriteXmlAttributeStringEncode("name", this.name);
	}
	if (null !== this.description) {
		writer.WriteXmlAttributeStringEncode("description", this.description);
	}
	if (null !== this.stringValue1) {
		writer.WriteXmlAttributeStringEncode("stringValue1", this.stringValue1);
	}
	if (null !== this.stringValue2) {
		writer.WriteXmlAttributeStringEncode("stringValue2", this.stringValue2);
	}
	writer.WriteXmlNodeEnd(name, true);
	if (null !== this.autoFilter) {
		this.autoFilter.toXml(writer, "autoFilter");
	}
	if (null !== this.extLst) {
		this.extLst.toXml(writer, "extLst");
	}
	writer.WriteXmlNodeEnd(name);
};
function CT_HierarchyUsage() {
//Attributes
	this.hierarchyUsage = null;
}
CT_HierarchyUsage.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["hierarchyUsage"];
		if (undefined !== val) {
			this.hierarchyUsage = val - 0;
		}
	}
};
CT_HierarchyUsage.prototype.toXml = function(writer, name) {
	writer.WriteXmlNodeStart(name);
	if (null !== this.hierarchyUsage) {
		writer.WriteXmlAttributeNumber("hierarchyUsage", this.hierarchyUsage);
	}
	writer.WriteXmlNodeEnd(name, true, true);
};
function CT_Pages() {
//Attributes
	this.count = null;
//Members
	this.page = [];
}
CT_Pages.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["count"];
		if (undefined !== val) {
			this.count = val - 0;
		}
	}
};
CT_Pages.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("page" === elem) {
		newContext = new CT_PCDSCPage();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.page.push(newContext);
	} else {
		newContext = null;
	}
	return newContext;
};
CT_Pages.prototype.toXml = function(writer, name) {
	writer.WriteXmlNodeStart(name);
	if (null !== this.count) {
		writer.WriteXmlAttributeNumber("count", this.count);
	}
	writer.WriteXmlNodeEnd(name, true);
	for (var i = 0; i < this.page.length; ++i) {
		var elem = this.page[i];
		elem.toXml(writer, "page");
	}
	writer.WriteXmlNodeEnd(name);
};
function CT_RangeSets() {
//Attributes
	this.count = null;
//Members
	this.rangeSet = [];
}
CT_RangeSets.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["count"];
		if (undefined !== val) {
			this.count = val - 0;
		}
	}
};
CT_RangeSets.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("rangeSet" === elem) {
		newContext = new CT_RangeSet();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.rangeSet.push(newContext);
	} else {
		newContext = null;
	}
	return newContext;
};
CT_RangeSets.prototype.toXml = function(writer, name) {
	writer.WriteXmlNodeStart(name);
	if (null !== this.count) {
		writer.WriteXmlAttributeNumber("count", this.count);
	}
	writer.WriteXmlNodeEnd(name, true);
	for (var i = 0; i < this.rangeSet.length; ++i) {
		var elem = this.rangeSet[i];
		elem.toXml(writer, "rangeSet");
	}
	writer.WriteXmlNodeEnd(name);
};
function CT_SharedItems() {
//Attributes
	this.containsSemiMixedTypes = null;//true
	this.containsNonDate = null;//true
	this.containsDate = null;//false
	this.containsString = null;//true
	this.containsBlank = null;//false
	this.containsMixedTypes = null;//false
	this.containsNumber = null;//false
	this.containsInteger = null;//false
	this.minValue = null;
	this.maxValue = null;
	this.minDate = null;
	this.maxDate = null;
	this.count = null;
	this.longText = null;//false
//Members
	this.Items = new PivotRecords();
}
CT_SharedItems.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["containsSemiMixedTypes"];
		if (undefined !== val) {
			this.containsSemiMixedTypes = getBoolFromXml(val);
		}
		val = vals["containsNonDate"];
		if (undefined !== val) {
			this.containsNonDate = getBoolFromXml(val);
		}
		val = vals["containsDate"];
		if (undefined !== val) {
			this.containsDate = getBoolFromXml(val);
		}
		val = vals["containsString"];
		if (undefined !== val) {
			this.containsString = getBoolFromXml(val);
		}
		val = vals["containsBlank"];
		if (undefined !== val) {
			this.containsBlank = getBoolFromXml(val);
		}
		val = vals["containsMixedTypes"];
		if (undefined !== val) {
			this.containsMixedTypes = getBoolFromXml(val);
		}
		val = vals["containsNumber"];
		if (undefined !== val) {
			this.containsNumber = getBoolFromXml(val);
		}
		val = vals["containsInteger"];
		if (undefined !== val) {
			this.containsInteger = getBoolFromXml(val);
		}
		val = vals["minValue"];
		if (undefined !== val) {
			this.minValue = val - 0;
		}
		val = vals["maxValue"];
		if (undefined !== val) {
			this.maxValue = val - 0;
		}
		val = vals["minDate"];
		if (undefined !== val) {
			this.minDate = AscCommon.unleakString(uq(val));
		}
		val = vals["maxDate"];
		if (undefined !== val) {
			this.maxDate = AscCommon.unleakString(uq(val));
		}
		val = vals["count"];
		if (undefined !== val) {
			this.count = val - 0;
			this.Items.setStartCount(this.count);
		}
		val = vals["longText"];
		if (undefined !== val) {
			this.longText = getBoolFromXml(val);
		}
	}
};
CT_SharedItems.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	var newContextCandidate = this.Items.onStartNode(elem, attr, uq);
	if (newContextCandidate) {
		newContext = newContextCandidate;
	} else {
		newContext = null;
	}
	return newContext;
};
CT_SharedItems.prototype.onEndNode = function(prevContext, elem) {
	this.Items.onEndNode(prevContext, elem);
};
CT_SharedItems.prototype.toXml = function(writer, name) {
	writer.WriteXmlNodeStart(name);
	if (null !== this.containsSemiMixedTypes) {
		writer.WriteXmlAttributeBool("containsSemiMixedTypes", this.containsSemiMixedTypes);
	}
	if (null !== this.containsNonDate) {
		writer.WriteXmlAttributeBool("containsNonDate", this.containsNonDate);
	}
	if (null !== this.containsDate) {
		writer.WriteXmlAttributeBool("containsDate", this.containsDate);
	}
	if (null !== this.containsString) {
		writer.WriteXmlAttributeBool("containsString", this.containsString);
	}
	if (null !== this.containsBlank) {
		writer.WriteXmlAttributeBool("containsBlank", this.containsBlank);
	}
	if (null !== this.containsMixedTypes) {
		writer.WriteXmlAttributeBool("containsMixedTypes", this.containsMixedTypes);
	}
	if (null !== this.containsNumber) {
		writer.WriteXmlAttributeBool("containsNumber", this.containsNumber);
	}
	if (null !== this.containsInteger) {
		writer.WriteXmlAttributeBool("containsInteger", this.containsInteger);
	}
	if (null !== this.minValue) {
		writer.WriteXmlAttributeNumber("minValue", this.minValue);
	}
	if (null !== this.maxValue) {
		writer.WriteXmlAttributeNumber("maxValue", this.maxValue);
	}
	if (null !== this.minDate) {
		writer.WriteXmlAttributeStringEncode("minDate", this.minDate);
	}
	if (null !== this.maxDate) {
		writer.WriteXmlAttributeStringEncode("maxDate", this.maxDate);
	}
	if (null !== this.count) {
		writer.WriteXmlAttributeNumber("count", this.count);
	}
	if (null !== this.longText) {
		writer.WriteXmlAttributeBool("longText", this.longText);
	}
	writer.WriteXmlNodeEnd(name, true);
	this.Items.toXml(writer);
	writer.WriteXmlNodeEnd(name);
};
function CT_FieldGroup() {
//Attributes
	this.par = null;
	this.base = null;
//Members
	this.rangePr = null;
	this.discretePr = null;
	this.groupItems = null;
}
CT_FieldGroup.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["par"];
		if (undefined !== val) {
			this.par = val - 0;
		}
		val = vals["base"];
		if (undefined !== val) {
			this.base = val - 0;
		}
	}
};
CT_FieldGroup.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("rangePr" === elem) {
		newContext = new CT_RangePr();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.rangePr = newContext;
	} else if ("discretePr" === elem) {
		newContext = new CT_DiscretePr();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.discretePr = newContext;
	} else if ("groupItems" === elem) {
		newContext = new CT_GroupItems();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.groupItems = newContext;
	} else {
		newContext = null;
	}
	return newContext;
};
CT_FieldGroup.prototype.toXml = function(writer, name) {
	writer.WriteXmlNodeStart(name);
	if (null !== this.par) {
		writer.WriteXmlAttributeNumber("par", this.par);
	}
	if (null !== this.base) {
		writer.WriteXmlAttributeNumber("base", this.base);
	}
	writer.WriteXmlNodeEnd(name, true);
	if (null !== this.rangePr) {
		this.rangePr.toXml(writer, "rangePr");
	}
	if (null !== this.discretePr) {
		this.discretePr.toXml(writer, "discretePr");
	}
	if (null !== this.groupItems) {
		this.groupItems.toXml(writer, "groupItems");
	}
	writer.WriteXmlNodeEnd(name);
};
function CT_FieldsUsage() {
//Attributes
	this.count = null;
//Members
	this.fieldUsage = [];
}
CT_FieldsUsage.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["count"];
		if (undefined !== val) {
			this.count = val - 0;
		}
	}
};
CT_FieldsUsage.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("fieldUsage" === elem) {
		newContext = new CT_FieldUsage();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.fieldUsage.push(newContext);
	} else {
		newContext = null;
	}
	return newContext;
};
CT_FieldsUsage.prototype.toXml = function(writer, name) {
	writer.WriteXmlNodeStart(name);
	if (null !== this.count) {
		writer.WriteXmlAttributeNumber("count", this.count);
	}
	writer.WriteXmlNodeEnd(name, true);
	for (var i = 0; i < this.fieldUsage.length; ++i) {
		var elem = this.fieldUsage[i];
		elem.toXml(writer, "fieldUsage");
	}
	writer.WriteXmlNodeEnd(name);
};
function CT_GroupLevels() {
//Attributes
	this.count = null;
//Members
	this.groupLevel = [];
}
CT_GroupLevels.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["count"];
		if (undefined !== val) {
			this.count = val - 0;
		}
	}
};
CT_GroupLevels.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("groupLevel" === elem) {
		newContext = new CT_GroupLevel();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.groupLevel.push(newContext);
	} else {
		newContext = null;
	}
	return newContext;
};
CT_GroupLevels.prototype.toXml = function(writer, name) {
	writer.WriteXmlNodeStart(name);
	if (null !== this.count) {
		writer.WriteXmlAttributeNumber("count", this.count);
	}
	writer.WriteXmlNodeEnd(name, true);
	for (var i = 0; i < this.groupLevel.length; ++i) {
		var elem = this.groupLevel[i];
		elem.toXml(writer, "groupLevel");
	}
	writer.WriteXmlNodeEnd(name);
};
function CT_Set() {
//Attributes
	this.count = null;
	this.maxRank = null;
	this.setDefinition = null;
	this.sortType = null;//none
	this.queryFailed = null;//false
//Members
	this.tpls = [];
	this.sortByTuple = null;
}
CT_Set.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["count"];
		if (undefined !== val) {
			this.count = val - 0;
		}
		val = vals["maxRank"];
		if (undefined !== val) {
			this.maxRank = val - 0;
		}
		val = vals["setDefinition"];
		if (undefined !== val) {
			this.setDefinition = AscCommon.unleakString(uq(val));
		}
		val = vals["sortType"];
		if (undefined !== val) {
			val = FromXml_ST_SortType(val);
			if (-1 !== val) {
				this.sortType = val;
			}
		}
		val = vals["queryFailed"];
		if (undefined !== val) {
			this.queryFailed = getBoolFromXml(val);
		}
	}
};
CT_Set.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("tpls" === elem) {
		newContext = new CT_Tuples();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.tpls.push(newContext);
	} else if ("sortByTuple" === elem) {
		newContext = new CT_Tuples();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.sortByTuple = newContext;
	} else {
		newContext = null;
	}
	return newContext;
};
CT_Set.prototype.toXml = function(writer, name) {
	writer.WriteXmlNodeStart(name);
	if (null !== this.count) {
		writer.WriteXmlAttributeNumber("count", this.count);
	}
	if (null !== this.maxRank) {
		writer.WriteXmlAttributeNumber("maxRank", this.maxRank);
	}
	if (null !== this.setDefinition) {
		writer.WriteXmlAttributeStringEncode("setDefinition", this.setDefinition);
	}
	if (null !== this.sortType) {
		writer.WriteXmlAttributeStringEncode("sortType", ToXml_ST_SortType(this.sortType));
	}
	if (null !== this.queryFailed) {
		writer.WriteXmlAttributeBool("queryFailed", this.queryFailed);
	}
	writer.WriteXmlNodeEnd(name, true);
	for (var i = 0; i < this.tpls.length; ++i) {
		var elem = this.tpls[i];
		elem.toXml(writer, "tpls");
	}
	if (null !== this.sortByTuple) {
		this.sortByTuple.toXml(writer, "sortByTuple");
	}
	writer.WriteXmlNodeEnd(name);
};
function CT_Query() {
//Attributes
	this.mdx = null;
//Members
	this.tpls = null;
}
CT_Query.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["mdx"];
		if (undefined !== val) {
			this.mdx = AscCommon.unleakString(uq(val));
		}
	}
};
CT_Query.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("tpls" === elem) {
		newContext = new CT_Tuples();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.tpls = newContext;
	} else {
		newContext = null;
	}
	return newContext;
};
CT_Query.prototype.toXml = function(writer, name) {
	writer.WriteXmlNodeStart(name);
	if (null !== this.mdx) {
		writer.WriteXmlAttributeStringEncode("mdx", this.mdx);
	}
	writer.WriteXmlNodeEnd(name, true);
	if (null !== this.tpls) {
		this.tpls.toXml(writer, "tpls");
	}
	writer.WriteXmlNodeEnd(name);
};
function CT_ServerFormat() {
//Attributes
	this.culture = null;
	this.format = null;
}
CT_ServerFormat.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["culture"];
		if (undefined !== val) {
			this.culture = AscCommon.unleakString(uq(val));
		}
		val = vals["format"];
		if (undefined !== val) {
			this.format = AscCommon.unleakString(uq(val));
		}
	}
};
CT_ServerFormat.prototype.toXml = function(writer, name) {
	writer.WriteXmlNodeStart(name);
	if (null !== this.culture) {
		writer.WriteXmlAttributeStringEncode("culture", this.culture);
	}
	if (null !== this.format) {
		writer.WriteXmlAttributeStringEncode("format", this.format);
	}
	writer.WriteXmlNodeEnd(name, true, true);
};
function CT_PivotArea() {
//Attributes
	this.field = null;
	this.type = null;//normal
	this.dataOnly = null;//true
	this.labelOnly = null;//false
	this.grandRow = null;//false
	this.grandCol = null;//false
	this.cacheIndex = null;//false
	this.outline = null;//true
	this.offset = null;
	this.collapsedLevelsAreSubtotals = null;//false
	this.axis = null;
	this.fieldPosition = null;
//Members
	this.references = null;
	this.extLst = null;
}
CT_PivotArea.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["field"];
		if (undefined !== val) {
			this.field = val - 0;
		}
		val = vals["type"];
		if (undefined !== val) {
			val = FromXml_ST_PivotAreaType(val);
			if (-1 !== val) {
				this.type = val;
			}
		}
		val = vals["dataOnly"];
		if (undefined !== val) {
			this.dataOnly = getBoolFromXml(val);
		}
		val = vals["labelOnly"];
		if (undefined !== val) {
			this.labelOnly = getBoolFromXml(val);
		}
		val = vals["grandRow"];
		if (undefined !== val) {
			this.grandRow = getBoolFromXml(val);
		}
		val = vals["grandCol"];
		if (undefined !== val) {
			this.grandCol = getBoolFromXml(val);
		}
		val = vals["cacheIndex"];
		if (undefined !== val) {
			this.cacheIndex = getBoolFromXml(val);
		}
		val = vals["outline"];
		if (undefined !== val) {
			this.outline = getBoolFromXml(val);
		}
		val = vals["offset"];
		if (undefined !== val) {
			this.offset = AscCommon.unleakString(uq(val));
		}
		val = vals["collapsedLevelsAreSubtotals"];
		if (undefined !== val) {
			this.collapsedLevelsAreSubtotals = getBoolFromXml(val);
		}
		val = vals["axis"];
		if (undefined !== val) {
			val = FromXml_ST_Axis(val);
			if (-1 !== val) {
				this.axis = val;
			}
		}
		val = vals["fieldPosition"];
		if (undefined !== val) {
			this.fieldPosition = val - 0;
		}
	}
};
CT_PivotArea.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("references" === elem) {
		newContext = new CT_PivotAreaReferences();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.references = newContext;
	} else if ("extLst" === elem) {
		newContext = new CT_ExtensionList();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.extLst = newContext;
	} else {
		newContext = null;
	}
	return newContext;
};
CT_PivotArea.prototype.toXml = function(writer, name) {
	writer.WriteXmlNodeStart(name);
	if (null !== this.field) {
		writer.WriteXmlAttributeNumber("field", this.field);
	}
	if (null !== this.type) {
		writer.WriteXmlAttributeStringEncode("type", ToXml_ST_PivotAreaType(this.type));
	}
	if (null !== this.dataOnly) {
		writer.WriteXmlAttributeBool("dataOnly", this.dataOnly);
	}
	if (null !== this.labelOnly) {
		writer.WriteXmlAttributeBool("labelOnly", this.labelOnly);
	}
	if (null !== this.grandRow) {
		writer.WriteXmlAttributeBool("grandRow", this.grandRow);
	}
	if (null !== this.grandCol) {
		writer.WriteXmlAttributeBool("grandCol", this.grandCol);
	}
	if (null !== this.cacheIndex) {
		writer.WriteXmlAttributeBool("cacheIndex", this.cacheIndex);
	}
	if (null !== this.outline) {
		writer.WriteXmlAttributeBool("outline", this.outline);
	}
	if (null !== this.offset) {
		writer.WriteXmlAttributeStringEncode("offset", this.offset);
	}
	if (null !== this.collapsedLevelsAreSubtotals) {
		writer.WriteXmlAttributeBool("collapsedLevelsAreSubtotals", this.collapsedLevelsAreSubtotals);
	}
	if (null !== this.axis) {
		writer.WriteXmlAttributeStringEncode("axis", ToXml_ST_Axis(this.axis));
	}
	if (null !== this.fieldPosition) {
		writer.WriteXmlAttributeNumber("fieldPosition", this.fieldPosition);
	}
	writer.WriteXmlNodeEnd(name, true);
	if (null !== this.references) {
		this.references.toXml(writer, "references");
	}
	if (null !== this.extLst) {
		this.extLst.toXml(writer, "extLst");
	}
	writer.WriteXmlNodeEnd(name);
};
function CT_Tuple() {
//Attributes
	this.fld = null;
	this.hier = null;
	this.item = null;
}
CT_Tuple.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["fld"];
		if (undefined !== val) {
			this.fld = val - 0;
		}
		val = vals["hier"];
		if (undefined !== val) {
			this.hier = val - 0;
		}
		val = vals["item"];
		if (undefined !== val) {
			this.item = val - 0;
		}
	}
};
CT_Tuple.prototype.toXml = function(writer, name) {
	writer.WriteXmlNodeStart(name);
	if (null !== this.fld) {
		writer.WriteXmlAttributeNumber("fld", this.fld);
	}
	if (null !== this.hier) {
		writer.WriteXmlAttributeNumber("hier", this.hier);
	}
	if (null !== this.item) {
		writer.WriteXmlAttributeNumber("item", this.item);
	}
	writer.WriteXmlNodeEnd(name, true, true);
};
function CT_Items() {
//Attributes
	this.count = null;
//Members
	this.item = [];
}
CT_Items.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["count"];
		if (undefined !== val) {
			this.count = val - 0;
		}
	}
};
CT_Items.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("item" === elem) {
		newContext = new CT_Item();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.item.push(newContext);
	} else {
		newContext = null;
	}
	return newContext;
};
CT_Items.prototype.toXml = function(writer, name) {
	writer.WriteXmlNodeStart(name);
	if (null !== this.count) {
		writer.WriteXmlAttributeNumber("count", this.count);
	}
	writer.WriteXmlNodeEnd(name, true);
	for (var i = 0; i < this.item.length; ++i) {
		var elem = this.item[i];
		elem.toXml(writer, "item");
	}
	writer.WriteXmlNodeEnd(name);
};
function CT_AutoSortScope() {
//Members
	this.pivotArea = null;
}
CT_AutoSortScope.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("pivotArea" === elem) {
		newContext = new CT_PivotArea();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.pivotArea = newContext;
	} else {
		newContext = null;
	}
	return newContext;
};
CT_AutoSortScope.prototype.toXml = function(writer, name) {
	writer.WriteXmlNodeStart(name);
	writer.WriteXmlNodeEnd(name, true);
	if (null !== this.pivotArea) {
		this.pivotArea.toXml(writer, "pivotArea");
	}
	writer.WriteXmlNodeEnd(name);
};
function CT_PivotAreas() {
//Attributes
	this.count = null;
//Members
	this.pivotArea = [];
}
CT_PivotAreas.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["count"];
		if (undefined !== val) {
			this.count = val - 0;
		}
	}
};
CT_PivotAreas.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("pivotArea" === elem) {
		newContext = new CT_PivotArea();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.pivotArea.push(newContext);
	} else {
		newContext = null;
	}
	return newContext;
};
CT_PivotAreas.prototype.toXml = function(writer, name) {
	writer.WriteXmlNodeStart(name);
	if (null !== this.count) {
		writer.WriteXmlAttributeNumber("count", this.count);
	}
	writer.WriteXmlNodeEnd(name, true);
	for (var i = 0; i < this.pivotArea.length; ++i) {
		var elem = this.pivotArea[i];
		elem.toXml(writer, "pivotArea");
	}
	writer.WriteXmlNodeEnd(name);
};
function CT_MemberProperties() {
//Attributes
	this.count = null;
//Members
	this.mp = [];
}
CT_MemberProperties.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["count"];
		if (undefined !== val) {
			this.count = val - 0;
		}
	}
};
CT_MemberProperties.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("mp" === elem) {
		newContext = new CT_MemberProperty();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.mp.push(newContext);
	} else {
		newContext = null;
	}
	return newContext;
};
CT_MemberProperties.prototype.toXml = function(writer, name) {
	writer.WriteXmlNodeStart(name);
	if (null !== this.count) {
		writer.WriteXmlAttributeNumber("count", this.count);
	}
	writer.WriteXmlNodeEnd(name, true);
	for (var i = 0; i < this.mp.length; ++i) {
		var elem = this.mp[i];
		elem.toXml(writer, "mp");
	}
	writer.WriteXmlNodeEnd(name);
};
function CT_Members() {
//Attributes
	this.count = null;
	this.level = null;
//Members
	this.member = [];
}
CT_Members.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["count"];
		if (undefined !== val) {
			this.count = val - 0;
		}
		val = vals["level"];
		if (undefined !== val) {
			this.level = val - 0;
		}
	}
};
CT_Members.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("member" === elem) {
		newContext = new CT_Member();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.member.push(newContext);
	} else {
		newContext = null;
	}
	return newContext;
};
CT_Members.prototype.toXml = function(writer, name) {
	writer.WriteXmlNodeStart(name);
	if (null !== this.count) {
		writer.WriteXmlAttributeNumber("count", this.count);
	}
	if (null !== this.level) {
		writer.WriteXmlAttributeNumber("level", this.level);
	}
	writer.WriteXmlNodeEnd(name, true);
	for (var i = 0; i < this.member.length; ++i) {
		var elem = this.member[i];
		elem.toXml(writer, "member");
	}
	writer.WriteXmlNodeEnd(name);
};
function CT_AutoFilter() {
//Attributes
	this.ref = null;
//Members
	this.filterColumn = [];
	this.sortState = null;
	this.extLst = null;
}
CT_AutoFilter.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["ref"];
		if (undefined !== val) {
			this.ref = AscCommon.unleakString(uq(val));
		}
	}
};
CT_AutoFilter.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("filterColumn" === elem) {
		newContext = new CT_FilterColumn();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.filterColumn.push(newContext);
	} else if ("sortState" === elem) {
		newContext = new CT_SortState();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.sortState = newContext;
	} else if ("extLst" === elem) {
		newContext = new CT_ExtensionList();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.extLst = newContext;
	} else {
		newContext = null;
	}
	return newContext;
};
CT_AutoFilter.prototype.toXml = function(writer, name) {
	writer.WriteXmlNodeStart(name);
	if (null !== this.ref) {
		writer.WriteXmlAttributeStringEncode("ref", this.ref);
	}
	writer.WriteXmlNodeEnd(name, true);
	for (var i = 0; i < this.filterColumn.length; ++i) {
		var elem = this.filterColumn[i];
		elem.toXml(writer, "filterColumn");
	}
	if (null !== this.sortState) {
		this.sortState.toXml(writer, "sortState");
	}
	if (null !== this.extLst) {
		this.extLst.toXml(writer, "extLst");
	}
	writer.WriteXmlNodeEnd(name);
};
function CT_PCDSCPage() {
//Attributes
	this.count = null;
//Members
	this.pageItem = [];
}
CT_PCDSCPage.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["count"];
		if (undefined !== val) {
			this.count = val - 0;
		}
	}
};
CT_PCDSCPage.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("pageItem" === elem) {
		newContext = new CT_PageItem();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.pageItem.push(newContext);
	} else {
		newContext = null;
	}
	return newContext;
};
CT_PCDSCPage.prototype.toXml = function(writer, name) {
	writer.WriteXmlNodeStart(name);
	if (null !== this.count) {
		writer.WriteXmlAttributeNumber("count", this.count);
	}
	writer.WriteXmlNodeEnd(name, true);
	for (var i = 0; i < this.pageItem.length; ++i) {
		var elem = this.pageItem[i];
		elem.toXml(writer, "pageItem");
	}
	writer.WriteXmlNodeEnd(name);
};
function CT_RangeSet() {
//Attributes
	this.i1 = null;
	this.i2 = null;
	this.i3 = null;
	this.i4 = null;
	this.ref = null;
	this.name = null;
	this.sheet = null;
	this.id = null;
}
CT_RangeSet.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["i1"];
		if (undefined !== val) {
			this.i1 = val - 0;
		}
		val = vals["i2"];
		if (undefined !== val) {
			this.i2 = val - 0;
		}
		val = vals["i3"];
		if (undefined !== val) {
			this.i3 = val - 0;
		}
		val = vals["i4"];
		if (undefined !== val) {
			this.i4 = val - 0;
		}
		val = vals["ref"];
		if (undefined !== val) {
			this.ref = AscCommon.unleakString(uq(val));
		}
		val = vals["name"];
		if (undefined !== val) {
			this.name = AscCommon.unleakString(uq(val));
		}
		val = vals["sheet"];
		if (undefined !== val) {
			this.sheet = AscCommon.unleakString(uq(val));
		}
		val = vals["r:id"];
		if (undefined !== val) {
			this.id = AscCommon.unleakString(uq(val));
		}
	}
};
CT_RangeSet.prototype.toXml = function(writer, name) {
	writer.WriteXmlNodeStart(name);
	if (null !== this.i1) {
		writer.WriteXmlAttributeNumber("i1", this.i1);
	}
	if (null !== this.i2) {
		writer.WriteXmlAttributeNumber("i2", this.i2);
	}
	if (null !== this.i3) {
		writer.WriteXmlAttributeNumber("i3", this.i3);
	}
	if (null !== this.i4) {
		writer.WriteXmlAttributeNumber("i4", this.i4);
	}
	if (null !== this.ref) {
		writer.WriteXmlAttributeStringEncode("ref", this.ref);
	}
	if (null !== this.name) {
		writer.WriteXmlAttributeStringEncode("name", this.name);
	}
	if (null !== this.sheet) {
		writer.WriteXmlAttributeStringEncode("sheet", this.sheet);
	}
	//todo
	// if (null !== this.id) {
		// writer.WriteXmlAttributeStringEncode("r:id", this.id);
	// }
	writer.WriteXmlNodeEnd(name, true, true);
};
function CT_RangePr() {
//Attributes
	this.autoStart = null;//true
	this.autoEnd = null;//true
	this.groupBy = null;//range
	this.startNum = null;
	this.endNum = null;
	this.startDate = null;
	this.endDate = null;
	this.groupInterval = null;//1
}
CT_RangePr.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["autoStart"];
		if (undefined !== val) {
			this.autoStart = getBoolFromXml(val);
		}
		val = vals["autoEnd"];
		if (undefined !== val) {
			this.autoEnd = getBoolFromXml(val);
		}
		val = vals["groupBy"];
		if (undefined !== val) {
			val = FromXml_ST_GroupBy(val);
			if (-1 !== val) {
				this.groupBy = val;
			}
		}
		val = vals["startNum"];
		if (undefined !== val) {
			this.startNum = val - 0;
		}
		val = vals["endNum"];
		if (undefined !== val) {
			this.endNum = val - 0;
		}
		val = vals["startDate"];
		if (undefined !== val) {
			this.startDate = AscCommon.unleakString(uq(val));
		}
		val = vals["endDate"];
		if (undefined !== val) {
			this.endDate = AscCommon.unleakString(uq(val));
		}
		val = vals["groupInterval"];
		if (undefined !== val) {
			this.groupInterval = val - 0;
		}
	}
};
CT_RangePr.prototype.toXml = function(writer, name) {
	writer.WriteXmlNodeStart(name);
	if (null !== this.autoStart) {
		writer.WriteXmlAttributeBool("autoStart", this.autoStart);
	}
	if (null !== this.autoEnd) {
		writer.WriteXmlAttributeBool("autoEnd", this.autoEnd);
	}
	if (null !== this.groupBy) {
		writer.WriteXmlAttributeStringEncode("groupBy", ToXml_ST_GroupBy(this.groupBy));
	}
	if (null !== this.startNum) {
		writer.WriteXmlAttributeNumber("startNum", this.startNum);
	}
	if (null !== this.endNum) {
		writer.WriteXmlAttributeNumber("endNum", this.endNum);
	}
	if (null !== this.startDate) {
		writer.WriteXmlAttributeStringEncode("startDate", this.startDate);
	}
	if (null !== this.endDate) {
		writer.WriteXmlAttributeStringEncode("endDate", this.endDate);
	}
	if (null !== this.groupInterval) {
		writer.WriteXmlAttributeNumber("groupInterval", this.groupInterval);
	}
	writer.WriteXmlNodeEnd(name, true, true);
};
function CT_DiscretePr() {
//Attributes
	this.count = null;
//Members
	this.x = [];
}
CT_DiscretePr.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["count"];
		if (undefined !== val) {
			this.count = val - 0;
		}
	}
};
CT_DiscretePr.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("x" === elem) {
		newContext = new CT_Index();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.x.push(newContext);
	} else {
		newContext = null;
	}
	return newContext;
};
CT_DiscretePr.prototype.toXml = function(writer, name) {
	writer.WriteXmlNodeStart(name);
	if (null !== this.count) {
		writer.WriteXmlAttributeNumber("count", this.count);
	}
	writer.WriteXmlNodeEnd(name, true);
	for (var i = 0; i < this.x.length; ++i) {
		var elem = this.x[i];
		elem.toXml(writer, "x");
	}
	writer.WriteXmlNodeEnd(name);
};
function CT_GroupItems() {
//Attributes
	this.count = null;
//Members
	this.Items = new PivotRecords();
}
CT_GroupItems.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["count"];
		if (undefined !== val) {
			this.count = val - 0;
			this.Items.setStartCount(this.count);
		}
	}
};
CT_GroupItems.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	var newContextCandidate = this.Items.onStartNode(elem, attr, uq);
	if (newContextCandidate) {
		newContext = newContextCandidate;
	} else {
		newContext = null;
	}
	return newContext;
};
CT_GroupItems.prototype.onEndNode = function(prevContext, elem) {
	this.Items.onEndNode(prevContext, elem);
};
CT_GroupItems.prototype.toXml = function(writer, name) {
	writer.WriteXmlNodeStart(name);
	if (null !== this.count) {
		writer.WriteXmlAttributeNumber("count", this.count);
	}
	writer.WriteXmlNodeEnd(name, true);
	this.Items.toXml(writer);
	writer.WriteXmlNodeEnd(name);
};
function CT_FieldUsage() {
//Attributes
	this.x = null;
}
CT_FieldUsage.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["x"];
		if (undefined !== val) {
			this.x = val - 0;
		}
	}
};
CT_FieldUsage.prototype.toXml = function(writer, name) {
	writer.WriteXmlNodeStart(name);
	if (null !== this.x) {
		writer.WriteXmlAttributeNumber("x", this.x);
	}
	writer.WriteXmlNodeEnd(name, true, true);
};
function CT_GroupLevel() {
//Attributes
	this.uniqueName = null;
	this.caption = null;
	this.user = null;//false
	this.customRollUp = null;//false
//Members
	this.groups = null;
	this.extLst = null;
}
CT_GroupLevel.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["uniqueName"];
		if (undefined !== val) {
			this.uniqueName = AscCommon.unleakString(uq(val));
		}
		val = vals["caption"];
		if (undefined !== val) {
			this.caption = AscCommon.unleakString(uq(val));
		}
		val = vals["user"];
		if (undefined !== val) {
			this.user = getBoolFromXml(val);
		}
		val = vals["customRollUp"];
		if (undefined !== val) {
			this.customRollUp = getBoolFromXml(val);
		}
	}
};
CT_GroupLevel.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("groups" === elem) {
		newContext = new CT_Groups();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.groups = newContext;
	} else if ("extLst" === elem) {
		newContext = new CT_ExtensionList();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.extLst = newContext;
	} else {
		newContext = null;
	}
	return newContext;
};
CT_GroupLevel.prototype.toXml = function(writer, name) {
	writer.WriteXmlNodeStart(name);
	if (null !== this.uniqueName) {
		writer.WriteXmlAttributeStringEncode("uniqueName", this.uniqueName);
	}
	if (null !== this.caption) {
		writer.WriteXmlAttributeStringEncode("caption", this.caption);
	}
	if (null !== this.user) {
		writer.WriteXmlAttributeBool("user", this.user);
	}
	if (null !== this.customRollUp) {
		writer.WriteXmlAttributeBool("customRollUp", this.customRollUp);
	}
	writer.WriteXmlNodeEnd(name, true);
	if (null !== this.groups) {
		this.groups.toXml(writer, "groups");
	}
	if (null !== this.extLst) {
		this.extLst.toXml(writer, "extLst");
	}
	writer.WriteXmlNodeEnd(name);
};
function CT_PivotAreaReferences() {
//Attributes
	this.count = null;
//Members
	this.reference = [];
}
CT_PivotAreaReferences.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["count"];
		if (undefined !== val) {
			this.count = val - 0;
		}
	}
};
CT_PivotAreaReferences.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("reference" === elem) {
		newContext = new CT_PivotAreaReference();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.reference.push(newContext);
	} else {
		newContext = null;
	}
	return newContext;
};
CT_PivotAreaReferences.prototype.toXml = function(writer, name) {
	writer.WriteXmlNodeStart(name);
	if (null !== this.count) {
		writer.WriteXmlAttributeNumber("count", this.count);
	}
	writer.WriteXmlNodeEnd(name, true);
	for (var i = 0; i < this.reference.length; ++i) {
		var elem = this.reference[i];
		elem.toXml(writer, "reference");
	}
	writer.WriteXmlNodeEnd(name);
};
function CT_Item() {
//Attributes
	this.n = null;
	this.t = null;//data
	this.h = null;//false
	this.s = null;//false
	this.sd = null;//true
	this.f = null;//false
	this.m = null;//false
	this.c = null;//false
	this.x = null;
	this.d = null;//false
	this.e = null;//true
}
CT_Item.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["n"];
		if (undefined !== val) {
			this.n = AscCommon.unleakString(uq(val));
		}
		val = vals["t"];
		if (undefined !== val) {
			val = FromXml_ST_ItemType(val);
			if (-1 !== val) {
				this.t = val;
			}
		}
		val = vals["h"];
		if (undefined !== val) {
			this.h = getBoolFromXml(val);
		}
		val = vals["s"];
		if (undefined !== val) {
			this.s = getBoolFromXml(val);
		}
		val = vals["sd"];
		if (undefined !== val) {
			this.sd = getBoolFromXml(val);
		}
		val = vals["f"];
		if (undefined !== val) {
			this.f = getBoolFromXml(val);
		}
		val = vals["m"];
		if (undefined !== val) {
			this.m = getBoolFromXml(val);
		}
		val = vals["c"];
		if (undefined !== val) {
			this.c = getBoolFromXml(val);
		}
		val = vals["x"];
		if (undefined !== val) {
			this.x = val - 0;
		}
		val = vals["d"];
		if (undefined !== val) {
			this.d = getBoolFromXml(val);
		}
		val = vals["e"];
		if (undefined !== val) {
			this.e = getBoolFromXml(val);
		}
	}
};
CT_Item.prototype.toXml = function(writer, name) {
	writer.WriteXmlNodeStart(name);
	if (null !== this.n) {
		writer.WriteXmlAttributeStringEncode("n", this.n);
	}
	if (null !== this.t) {
		writer.WriteXmlAttributeStringEncode("t", ToXml_ST_ItemType(this.t));
	}
	if (null !== this.h) {
		writer.WriteXmlAttributeBool("h", this.h);
	}
	if (null !== this.s) {
		writer.WriteXmlAttributeBool("s", this.s);
	}
	if (null !== this.sd) {
		writer.WriteXmlAttributeBool("sd", this.sd);
	}
	if (null !== this.f) {
		writer.WriteXmlAttributeBool("f", this.f);
	}
	if (null !== this.m) {
		writer.WriteXmlAttributeBool("m", this.m);
	}
	if (null !== this.c) {
		writer.WriteXmlAttributeBool("c", this.c);
	}
	if (null !== this.x) {
		writer.WriteXmlAttributeNumber("x", this.x);
	}
	if (null !== this.d) {
		writer.WriteXmlAttributeBool("d", this.d);
	}
	if (null !== this.e) {
		writer.WriteXmlAttributeBool("e", this.e);
	}
	writer.WriteXmlNodeEnd(name, true, true);
};
function CT_MemberProperty() {
//Attributes
	this.name = null;
	this.showCell = null;//false
	this.showTip = null;//false
	this.showAsCaption = null;//false
	this.nameLen = null;
	this.pPos = null;
	this.pLen = null;
	this.level = null;
	this.field = null;
}
CT_MemberProperty.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["name"];
		if (undefined !== val) {
			this.name = AscCommon.unleakString(uq(val));
		}
		val = vals["showCell"];
		if (undefined !== val) {
			this.showCell = getBoolFromXml(val);
		}
		val = vals["showTip"];
		if (undefined !== val) {
			this.showTip = getBoolFromXml(val);
		}
		val = vals["showAsCaption"];
		if (undefined !== val) {
			this.showAsCaption = getBoolFromXml(val);
		}
		val = vals["nameLen"];
		if (undefined !== val) {
			this.nameLen = val - 0;
		}
		val = vals["pPos"];
		if (undefined !== val) {
			this.pPos = val - 0;
		}
		val = vals["pLen"];
		if (undefined !== val) {
			this.pLen = val - 0;
		}
		val = vals["level"];
		if (undefined !== val) {
			this.level = val - 0;
		}
		val = vals["field"];
		if (undefined !== val) {
			this.field = val - 0;
		}
	}
};
CT_MemberProperty.prototype.toXml = function(writer, name) {
	writer.WriteXmlNodeStart(name);
	if (null !== this.name) {
		writer.WriteXmlAttributeStringEncode("name", this.name);
	}
	if (null !== this.showCell) {
		writer.WriteXmlAttributeBool("showCell", this.showCell);
	}
	if (null !== this.showTip) {
		writer.WriteXmlAttributeBool("showTip", this.showTip);
	}
	if (null !== this.showAsCaption) {
		writer.WriteXmlAttributeBool("showAsCaption", this.showAsCaption);
	}
	if (null !== this.nameLen) {
		writer.WriteXmlAttributeNumber("nameLen", this.nameLen);
	}
	if (null !== this.pPos) {
		writer.WriteXmlAttributeNumber("pPos", this.pPos);
	}
	if (null !== this.pLen) {
		writer.WriteXmlAttributeNumber("pLen", this.pLen);
	}
	if (null !== this.level) {
		writer.WriteXmlAttributeNumber("level", this.level);
	}
	if (null !== this.field) {
		writer.WriteXmlAttributeNumber("field", this.field);
	}
	writer.WriteXmlNodeEnd(name, true, true);
};
function CT_Member() {
//Attributes
	this.name = null;
}
CT_Member.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["name"];
		if (undefined !== val) {
			this.name = AscCommon.unleakString(uq(val));
		}
	}
};
CT_Member.prototype.toXml = function(writer, name) {
	writer.WriteXmlNodeStart(name);
	if (null !== this.name) {
		writer.WriteXmlAttributeStringEncode("name", this.name);
	}
	writer.WriteXmlNodeEnd(name, true, true);
};
function CT_FilterColumn() {
//Attributes
	this.colId = null;
	this.hiddenButton = null;//false
	this.showButton = null;//true
//Members
	this.colorFilter = null;
	this.customFilters = null;
	this.dynamicFilter = null;
	this.extLst = null;
	this.filters = null;
	this.iconFilter = null;
	this.top10 = null;
}
CT_FilterColumn.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["colId"];
		if (undefined !== val) {
			this.colId = val - 0;
		}
		val = vals["hiddenButton"];
		if (undefined !== val) {
			this.hiddenButton = getBoolFromXml(val);
		}
		val = vals["showButton"];
		if (undefined !== val) {
			this.showButton = getBoolFromXml(val);
		}
	}
};
CT_FilterColumn.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("colorFilter" === elem) {
		newContext = new CT_ColorFilter();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.colorFilter = newContext;
	} else if ("customFilters" === elem) {
		newContext = new CT_CustomFilters();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.customFilters = newContext;
	} else if ("dynamicFilter" === elem) {
		newContext = new CT_DynamicFilter();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.dynamicFilter = newContext;
	} else if ("extLst" === elem) {
		newContext = new CT_ExtensionList();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.extLst = newContext;
	} else if ("filters" === elem) {
		newContext = new CT_Filters();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.filters = newContext;
	} else if ("iconFilter" === elem) {
		newContext = new CT_IconFilter();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.iconFilter = newContext;
	} else if ("top10" === elem) {
		newContext = new CT_Top10();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.top10 = newContext;
	} else {
		newContext = null;
	}
	return newContext;
};
CT_FilterColumn.prototype.toXml = function(writer, name) {
	writer.WriteXmlNodeStart(name);
	if (null !== this.colId) {
		writer.WriteXmlAttributeNumber("colId", this.colId);
	}
	if (null !== this.hiddenButton) {
		writer.WriteXmlAttributeBool("hiddenButton", this.hiddenButton);
	}
	if (null !== this.showButton) {
		writer.WriteXmlAttributeBool("showButton", this.showButton);
	}
	writer.WriteXmlNodeEnd(name, true);
	if (null !== this.colorFilter) {
		this.colorFilter.toXml(writer, "colorFilter");
	}
	if (null !== this.customFilters) {
		this.customFilters.toXml(writer, "customFilters");
	}
	if (null !== this.dynamicFilter) {
		this.dynamicFilter.toXml(writer, "dynamicFilter");
	}
	if (null !== this.extLst) {
		this.extLst.toXml(writer, "extLst");
	}
	if (null !== this.filters) {
		this.filters.toXml(writer, "filters");
	}
	if (null !== this.iconFilter) {
		this.iconFilter.toXml(writer, "iconFilter");
	}
	if (null !== this.top10) {
		this.top10.toXml(writer, "top10");
	}
	writer.WriteXmlNodeEnd(name);
};
function CT_SortState() {
//Attributes
	this.columnSort = null;//false
	this.caseSensitive = null;//false
	this.sortMethod = null;//none
	this.ref = null;
//Members
	this.sortCondition = [];
	this.extLst = null;
}
CT_SortState.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["columnSort"];
		if (undefined !== val) {
			this.columnSort = getBoolFromXml(val);
		}
		val = vals["caseSensitive"];
		if (undefined !== val) {
			this.caseSensitive = getBoolFromXml(val);
		}
		val = vals["sortMethod"];
		if (undefined !== val) {
			val = FromXml_ST_SortMethod(val);
			if (-1 !== val) {
				this.sortMethod = val;
			}
		}
		val = vals["ref"];
		if (undefined !== val) {
			this.ref = AscCommon.unleakString(uq(val));
		}
	}
};
CT_SortState.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("sortCondition" === elem) {
		newContext = new CT_SortCondition();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.sortCondition.push(newContext);
	} else if ("extLst" === elem) {
		newContext = new CT_ExtensionList();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.extLst = newContext;
	} else {
		newContext = null;
	}
	return newContext;
};
CT_SortState.prototype.toXml = function(writer, name) {
	writer.WriteXmlNodeStart(name);
	if (null !== this.columnSort) {
		writer.WriteXmlAttributeBool("columnSort", this.columnSort);
	}
	if (null !== this.caseSensitive) {
		writer.WriteXmlAttributeBool("caseSensitive", this.caseSensitive);
	}
	if (null !== this.sortMethod) {
		writer.WriteXmlAttributeStringEncode("sortMethod", ToXml_ST_SortMethod(this.sortMethod));
	}
	if (null !== this.ref) {
		writer.WriteXmlAttributeStringEncode("ref", this.ref);
	}
	writer.WriteXmlNodeEnd(name, true);
	for (var i = 0; i < this.sortCondition.length; ++i) {
		var elem = this.sortCondition[i];
		elem.toXml(writer, "sortCondition");
	}
	if (null !== this.extLst) {
		this.extLst.toXml(writer, "extLst");
	}
	writer.WriteXmlNodeEnd(name);
};
function CT_PageItem() {
//Attributes
	this.name = null;
}
CT_PageItem.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["name"];
		if (undefined !== val) {
			this.name = AscCommon.unleakString(uq(val));
		}
	}
};
CT_PageItem.prototype.toXml = function(writer, name) {
	writer.WriteXmlNodeStart(name);
	if (null !== this.name) {
		writer.WriteXmlAttributeStringEncode("name", this.name);
	}
	writer.WriteXmlNodeEnd(name, true, true);
};
function CT_Groups() {
//Attributes
	this.count = null;
//Members
	this.group = [];
}
CT_Groups.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["count"];
		if (undefined !== val) {
			this.count = val - 0;
		}
	}
};
CT_Groups.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("group" === elem) {
		newContext = new CT_LevelGroup();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.group.push(newContext);
	} else {
		newContext = null;
	}
	return newContext;
};
CT_Groups.prototype.toXml = function(writer, name) {
	writer.WriteXmlNodeStart(name);
	if (null !== this.count) {
		writer.WriteXmlAttributeNumber("count", this.count);
	}
	writer.WriteXmlNodeEnd(name, true);
	for (var i = 0; i < this.group.length; ++i) {
		var elem = this.group[i];
		elem.toXml(writer, "group");
	}
	writer.WriteXmlNodeEnd(name);
};
function CT_PivotAreaReference() {
//Attributes
	this.field = null;
	this.count = null;
	this.selected = null;//true
	this.byPosition = null;//false
	this.relative = null;//false
	this.defaultSubtotal = null;//false
	this.sumSubtotal = null;//false
	this.countASubtotal = null;//false
	this.avgSubtotal = null;//false
	this.maxSubtotal = null;//false
	this.minSubtotal = null;//false
	this.productSubtotal = null;//false
	this.countSubtotal = null;//false
	this.stdDevSubtotal = null;//false
	this.stdDevPSubtotal = null;//false
	this.varSubtotal = null;//false
	this.varPSubtotal = null;//false
//Members
	this.x = [];
	this.extLst = null;
}
CT_PivotAreaReference.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["field"];
		if (undefined !== val) {
			this.field = val - 0;
		}
		val = vals["count"];
		if (undefined !== val) {
			this.count = val - 0;
		}
		val = vals["selected"];
		if (undefined !== val) {
			this.selected = getBoolFromXml(val);
		}
		val = vals["byPosition"];
		if (undefined !== val) {
			this.byPosition = getBoolFromXml(val);
		}
		val = vals["relative"];
		if (undefined !== val) {
			this.relative = getBoolFromXml(val);
		}
		val = vals["defaultSubtotal"];
		if (undefined !== val) {
			this.defaultSubtotal = getBoolFromXml(val);
		}
		val = vals["sumSubtotal"];
		if (undefined !== val) {
			this.sumSubtotal = getBoolFromXml(val);
		}
		val = vals["countASubtotal"];
		if (undefined !== val) {
			this.countASubtotal = getBoolFromXml(val);
		}
		val = vals["avgSubtotal"];
		if (undefined !== val) {
			this.avgSubtotal = getBoolFromXml(val);
		}
		val = vals["maxSubtotal"];
		if (undefined !== val) {
			this.maxSubtotal = getBoolFromXml(val);
		}
		val = vals["minSubtotal"];
		if (undefined !== val) {
			this.minSubtotal = getBoolFromXml(val);
		}
		val = vals["productSubtotal"];
		if (undefined !== val) {
			this.productSubtotal = getBoolFromXml(val);
		}
		val = vals["countSubtotal"];
		if (undefined !== val) {
			this.countSubtotal = getBoolFromXml(val);
		}
		val = vals["stdDevSubtotal"];
		if (undefined !== val) {
			this.stdDevSubtotal = getBoolFromXml(val);
		}
		val = vals["stdDevPSubtotal"];
		if (undefined !== val) {
			this.stdDevPSubtotal = getBoolFromXml(val);
		}
		val = vals["varSubtotal"];
		if (undefined !== val) {
			this.varSubtotal = getBoolFromXml(val);
		}
		val = vals["varPSubtotal"];
		if (undefined !== val) {
			this.varPSubtotal = getBoolFromXml(val);
		}
	}
};
CT_PivotAreaReference.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("x" === elem) {
		newContext = new CT_Index();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.x.push(newContext);
	} else if ("extLst" === elem) {
		newContext = new CT_ExtensionList();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.extLst = newContext;
	} else {
		newContext = null;
	}
	return newContext;
};
CT_PivotAreaReference.prototype.toXml = function(writer, name) {
	writer.WriteXmlNodeStart(name);
	if (null !== this.field) {
		writer.WriteXmlAttributeNumber("field", this.field);
	}
	if (null !== this.count) {
		writer.WriteXmlAttributeNumber("count", this.count);
	}
	if (null !== this.selected) {
		writer.WriteXmlAttributeBool("selected", this.selected);
	}
	if (null !== this.byPosition) {
		writer.WriteXmlAttributeBool("byPosition", this.byPosition);
	}
	if (null !== this.relative) {
		writer.WriteXmlAttributeBool("relative", this.relative);
	}
	if (null !== this.defaultSubtotal) {
		writer.WriteXmlAttributeBool("defaultSubtotal", this.defaultSubtotal);
	}
	if (null !== this.sumSubtotal) {
		writer.WriteXmlAttributeBool("sumSubtotal", this.sumSubtotal);
	}
	if (null !== this.countASubtotal) {
		writer.WriteXmlAttributeBool("countASubtotal", this.countASubtotal);
	}
	if (null !== this.avgSubtotal) {
		writer.WriteXmlAttributeBool("avgSubtotal", this.avgSubtotal);
	}
	if (null !== this.maxSubtotal) {
		writer.WriteXmlAttributeBool("maxSubtotal", this.maxSubtotal);
	}
	if (null !== this.minSubtotal) {
		writer.WriteXmlAttributeBool("minSubtotal", this.minSubtotal);
	}
	if (null !== this.productSubtotal) {
		writer.WriteXmlAttributeBool("productSubtotal", this.productSubtotal);
	}
	if (null !== this.countSubtotal) {
		writer.WriteXmlAttributeBool("countSubtotal", this.countSubtotal);
	}
	if (null !== this.stdDevSubtotal) {
		writer.WriteXmlAttributeBool("stdDevSubtotal", this.stdDevSubtotal);
	}
	if (null !== this.stdDevPSubtotal) {
		writer.WriteXmlAttributeBool("stdDevPSubtotal", this.stdDevPSubtotal);
	}
	if (null !== this.varSubtotal) {
		writer.WriteXmlAttributeBool("varSubtotal", this.varSubtotal);
	}
	if (null !== this.varPSubtotal) {
		writer.WriteXmlAttributeBool("varPSubtotal", this.varPSubtotal);
	}
	writer.WriteXmlNodeEnd(name, true);
	for (var i = 0; i < this.x.length; ++i) {
		var elem = this.x[i];
		elem.toXml(writer, "x");
	}
	if (null !== this.extLst) {
		this.extLst.toXml(writer, "extLst");
	}
	writer.WriteXmlNodeEnd(name);
};
function CT_ColorFilter() {
//Attributes
	this.dxfId = null;
	this.cellColor = null;//true
}
CT_ColorFilter.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["dxfId"];
		if (undefined !== val) {
			this.dxfId = val - 0;
		}
		val = vals["cellColor"];
		if (undefined !== val) {
			this.cellColor = getBoolFromXml(val);
		}
	}
};
CT_ColorFilter.prototype.toXml = function(writer, name) {
	writer.WriteXmlNodeStart(name);
	//todo
	// if (null !== this.dxfId) {
	// 	writer.WriteXmlAttributeNumber("dxfId", this.dxfId);
	// }
	if (null !== this.cellColor) {
		writer.WriteXmlAttributeBool("cellColor", this.cellColor);
	}
	writer.WriteXmlNodeEnd(name, true, true);
};
function CT_CustomFilters() {
//Attributes
	this.and = null;//false
//Members
	this.customFilter = [];
}
CT_CustomFilters.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["and"];
		if (undefined !== val) {
			this.and = getBoolFromXml(val);
		}
	}
};
CT_CustomFilters.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("customFilter" === elem) {
		newContext = new CT_CustomFilter();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.customFilter.push(newContext);
	} else {
		newContext = null;
	}
	return newContext;
};
CT_CustomFilters.prototype.toXml = function(writer, name) {
	writer.WriteXmlNodeStart(name);
	if (null !== this.and) {
		writer.WriteXmlAttributeBool("and", this.and);
	}
	writer.WriteXmlNodeEnd(name, true);
	for (var i = 0; i < this.customFilter.length; ++i) {
		var elem = this.customFilter[i];
		elem.toXml(writer, "customFilter");
	}
	writer.WriteXmlNodeEnd(name);
};
function CT_DynamicFilter() {
//Attributes
	this.type = null;
	this.val = null;
	this.valIso = null;
	this.maxValIso = null;
}
CT_DynamicFilter.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["type"];
		if (undefined !== val) {
			val = FromXml_ST_DynamicFilterType(val);
			if (-1 !== val) {
				this.type = val;
			}
		}
		val = vals["val"];
		if (undefined !== val) {
			this.val = val - 0;
		}
		val = vals["valIso"];
		if (undefined !== val) {
			this.valIso = AscCommon.unleakString(uq(val));
		}
		val = vals["maxValIso"];
		if (undefined !== val) {
			this.maxValIso = AscCommon.unleakString(uq(val));
		}
	}
};
CT_DynamicFilter.prototype.toXml = function(writer, name) {
	writer.WriteXmlNodeStart(name);
	if (null !== this.type) {
		writer.WriteXmlAttributeStringEncode("type", ToXml_ST_DynamicFilterType(this.type));
	}
	if (null !== this.val) {
		writer.WriteXmlAttributeNumber("val", this.val);
	}
	if (null !== this.valIso) {
		writer.WriteXmlAttributeStringEncode("valIso", this.valIso);
	}
	if (null !== this.maxValIso) {
		writer.WriteXmlAttributeStringEncode("maxValIso", this.maxValIso);
	}
	writer.WriteXmlNodeEnd(name, true, true);
};
function CT_Filters() {
//Attributes
	this.blank = null;//false
	this.calendarType = null;//none
//Members
	this.filter = [];
	this.dateGroupItem = [];
}
CT_Filters.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["blank"];
		if (undefined !== val) {
			this.blank = getBoolFromXml(val);
		}
		val = vals["calendarType"];
		if (undefined !== val) {
			val = FromXml_ST_CalendarType(val);
			if (-1 !== val) {
				this.calendarType = val;
			}
		}
	}
};
CT_Filters.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("filter" === elem) {
		newContext = new CT_Filter();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.filter.push(newContext);
	} else if ("dateGroupItem" === elem) {
		newContext = new CT_DateGroupItem();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.dateGroupItem.push(newContext);
	} else {
		newContext = null;
	}
	return newContext;
};
CT_Filters.prototype.toXml = function(writer, name) {
	writer.WriteXmlNodeStart(name);
	if (null !== this.blank) {
		writer.WriteXmlAttributeBool("blank", this.blank);
	}
	if (null !== this.calendarType) {
		writer.WriteXmlAttributeStringEncode("calendarType", ToXml_ST_CalendarType(this.calendarType));
	}
	writer.WriteXmlNodeEnd(name, true);
	for (var i = 0; i < this.filter.length; ++i) {
		var elem = this.filter[i];
		elem.toXml(writer, "filter");
	}
	for (var i = 0; i < this.dateGroupItem.length; ++i) {
		var elem = this.dateGroupItem[i];
		elem.toXml(writer, "dateGroupItem");
	}
	writer.WriteXmlNodeEnd(name);
};
function CT_IconFilter() {
//Attributes
	this.iconSet = null;
	this.iconId = null;
}
CT_IconFilter.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["iconSet"];
		if (undefined !== val) {
			val = FromXml_ST_IconSetType(val);
			if (-1 !== val) {
				this.iconSet = val;
			}
		}
		val = vals["iconId"];
		if (undefined !== val) {
			this.iconId = val - 0;
		}
	}
};
CT_IconFilter.prototype.toXml = function(writer, name) {
	writer.WriteXmlNodeStart(name);
	if (null !== this.iconSet) {
		writer.WriteXmlAttributeStringEncode("iconSet", ToXml_ST_IconSetType(this.iconSet));
	}
	if (null !== this.iconId) {
		writer.WriteXmlAttributeNumber("iconId", this.iconId);
	}
	writer.WriteXmlNodeEnd(name, true, true);
};
function CT_Top10() {
//Attributes
	this.top = null;//true
	this.percent = null;//false
	this.val = null;
	this.filterVal = null;
}
CT_Top10.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["top"];
		if (undefined !== val) {
			this.top = getBoolFromXml(val);
		}
		val = vals["percent"];
		if (undefined !== val) {
			this.percent = getBoolFromXml(val);
		}
		val = vals["val"];
		if (undefined !== val) {
			this.val = val - 0;
		}
		val = vals["filterVal"];
		if (undefined !== val) {
			this.filterVal = val - 0;
		}
	}
};
CT_Top10.prototype.toXml = function(writer, name) {
	writer.WriteXmlNodeStart(name);
	if (null !== this.top) {
		writer.WriteXmlAttributeBool("top", this.top);
	}
	if (null !== this.percent) {
		writer.WriteXmlAttributeBool("percent", this.percent);
	}
	if (null !== this.val) {
		writer.WriteXmlAttributeNumber("val", this.val);
	}
	if (null !== this.filterVal) {
		writer.WriteXmlAttributeNumber("filterVal", this.filterVal);
	}
	writer.WriteXmlNodeEnd(name, true, true);
};
function CT_SortCondition() {
//Attributes
	this.descending = null;//false
	this.sortBy = null;//value
	this.ref = null;
	this.customList = null;
	this.dxfId = null;
	this.iconSet = null;//item3arrows
	this.iconId = null;
}
CT_SortCondition.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["descending"];
		if (undefined !== val) {
			this.descending = getBoolFromXml(val);
		}
		val = vals["sortBy"];
		if (undefined !== val) {
			val = FromXml_ST_SortBy(val);
			if (-1 !== val) {
				this.sortBy = val;
			}
		}
		val = vals["ref"];
		if (undefined !== val) {
			this.ref = AscCommon.unleakString(uq(val));
		}
		val = vals["customList"];
		if (undefined !== val) {
			this.customList = AscCommon.unleakString(uq(val));
		}
		val = vals["dxfId"];
		if (undefined !== val) {
			this.dxfId = val - 0;
		}
		val = vals["iconSet"];
		if (undefined !== val) {
			val = FromXml_ST_IconSetType(val);
			if (-1 !== val) {
				this.iconSet = val;
			}
		}
		val = vals["iconId"];
		if (undefined !== val) {
			this.iconId = val - 0;
		}
	}
};
CT_SortCondition.prototype.toXml = function(writer, name) {
	writer.WriteXmlNodeStart(name);
	if (null !== this.descending) {
		writer.WriteXmlAttributeBool("descending", this.descending);
	}
	if (null !== this.sortBy) {
		writer.WriteXmlAttributeStringEncode("sortBy", ToXml_ST_SortBy(this.sortBy));
	}
	if (null !== this.ref) {
		writer.WriteXmlAttributeStringEncode("ref", this.ref);
	}
	if (null !== this.customList) {
		writer.WriteXmlAttributeStringEncode("customList", this.customList);
	}
	//todo
	// if (null !== this.dxfId) {
	// 	writer.WriteXmlAttributeNumber("dxfId", this.dxfId);
	// }
	if (null !== this.iconSet) {
		writer.WriteXmlAttributeStringEncode("iconSet", ToXml_ST_IconSetType(this.iconSet));
	}
	if (null !== this.iconId) {
		writer.WriteXmlAttributeNumber("iconId", this.iconId);
	}
	writer.WriteXmlNodeEnd(name, true, true);
};
function CT_LevelGroup() {
//Attributes
	this.name = null;
	this.uniqueName = null;
	this.caption = null;
	this.uniqueParent = null;
	this.id = null;
//Members
	this.groupMembers = null;
}
CT_LevelGroup.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["name"];
		if (undefined !== val) {
			this.name = AscCommon.unleakString(uq(val));
		}
		val = vals["uniqueName"];
		if (undefined !== val) {
			this.uniqueName = AscCommon.unleakString(uq(val));
		}
		val = vals["caption"];
		if (undefined !== val) {
			this.caption = AscCommon.unleakString(uq(val));
		}
		val = vals["uniqueParent"];
		if (undefined !== val) {
			this.uniqueParent = AscCommon.unleakString(uq(val));
		}
		val = vals["id"];
		if (undefined !== val) {
			this.id = val - 0;
		}
	}
};
CT_LevelGroup.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("groupMembers" === elem) {
		newContext = new CT_GroupMembers();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.groupMembers = newContext;
	} else {
		newContext = null;
	}
	return newContext;
};
CT_LevelGroup.prototype.toXml = function(writer, name) {
	writer.WriteXmlNodeStart(name);
	if (null !== this.name) {
		writer.WriteXmlAttributeStringEncode("name", this.name);
	}
	if (null !== this.uniqueName) {
		writer.WriteXmlAttributeStringEncode("uniqueName", this.uniqueName);
	}
	if (null !== this.caption) {
		writer.WriteXmlAttributeStringEncode("caption", this.caption);
	}
	if (null !== this.uniqueParent) {
		writer.WriteXmlAttributeStringEncode("uniqueParent", this.uniqueParent);
	}
	if (null !== this.id) {
		writer.WriteXmlAttributeNumber("id", this.id);
	}
	writer.WriteXmlNodeEnd(name, true);
	if (null !== this.groupMembers) {
		this.groupMembers.toXml(writer, "groupMembers");
	}
	writer.WriteXmlNodeEnd(name);
};
function CT_CustomFilter() {
//Attributes
	this.operator = null;//equal
	this.val = null;
}
CT_CustomFilter.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["operator"];
		if (undefined !== val) {
			val = FromXml_ST_FilterOperator(val);
			if (-1 !== val) {
				this.operator = val;
			}
		}
		val = vals["val"];
		if (undefined !== val) {
			this.val = AscCommon.unleakString(uq(val));
		}
	}
};
CT_CustomFilter.prototype.toXml = function(writer, name) {
	writer.WriteXmlNodeStart(name);
	if (null !== this.operator) {
		writer.WriteXmlAttributeStringEncode("operator", ToXml_ST_FilterOperator(this.operator));
	}
	if (null !== this.val) {
		writer.WriteXmlAttributeStringEncode("val", this.val);
	}
	writer.WriteXmlNodeEnd(name, true, true);
};
function CT_Filter() {
//Attributes
	this.val = null;
}
CT_Filter.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["val"];
		if (undefined !== val) {
			this.val = AscCommon.unleakString(uq(val));
		}
	}
};
CT_Filter.prototype.toXml = function(writer, name) {
	writer.WriteXmlNodeStart(name);
	if (null !== this.val) {
		writer.WriteXmlAttributeStringEncode("val", this.val);
	}
	writer.WriteXmlNodeEnd(name, true, true);
};
function CT_DateGroupItem() {
//Attributes
	this.year = null;
	this.month = null;
	this.day = null;
	this.hour = null;
	this.minute = null;
	this.second = null;
	this.dateTimeGrouping = null;
}
CT_DateGroupItem.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["year"];
		if (undefined !== val) {
			this.year = val - 0;
		}
		val = vals["month"];
		if (undefined !== val) {
			this.month = val - 0;
		}
		val = vals["day"];
		if (undefined !== val) {
			this.day = val - 0;
		}
		val = vals["hour"];
		if (undefined !== val) {
			this.hour = val - 0;
		}
		val = vals["minute"];
		if (undefined !== val) {
			this.minute = val - 0;
		}
		val = vals["second"];
		if (undefined !== val) {
			this.second = val - 0;
		}
		val = vals["dateTimeGrouping"];
		if (undefined !== val) {
			val = FromXml_ST_DateTimeGrouping(val);
			if (-1 !== val) {
				this.dateTimeGrouping = val;
			}
		}
	}
};
CT_DateGroupItem.prototype.toXml = function(writer, name) {
	writer.WriteXmlNodeStart(name);
	if (null !== this.year) {
		writer.WriteXmlAttributeNumber("year", this.year);
	}
	if (null !== this.month) {
		writer.WriteXmlAttributeNumber("month", this.month);
	}
	if (null !== this.day) {
		writer.WriteXmlAttributeNumber("day", this.day);
	}
	if (null !== this.hour) {
		writer.WriteXmlAttributeNumber("hour", this.hour);
	}
	if (null !== this.minute) {
		writer.WriteXmlAttributeNumber("minute", this.minute);
	}
	if (null !== this.second) {
		writer.WriteXmlAttributeNumber("second", this.second);
	}
	if (null !== this.dateTimeGrouping) {
		writer.WriteXmlAttributeStringEncode("dateTimeGrouping", ToXml_ST_DateTimeGrouping(this.dateTimeGrouping));
	}
	writer.WriteXmlNodeEnd(name, true, true);
};
function CT_GroupMembers() {
//Attributes
	this.count = null;
//Members
	this.groupMember = [];
}
CT_GroupMembers.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["count"];
		if (undefined !== val) {
			this.count = val - 0;
		}
	}
};
CT_GroupMembers.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("groupMember" === elem) {
		newContext = new CT_GroupMember();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.groupMember.push(newContext);
	} else {
		newContext = null;
	}
	return newContext;
};
CT_GroupMembers.prototype.toXml = function(writer, name) {
	writer.WriteXmlNodeStart(name);
	if (null !== this.count) {
		writer.WriteXmlAttributeNumber("count", this.count);
	}
	writer.WriteXmlNodeEnd(name, true);
	for (var i = 0; i < this.groupMember.length; ++i) {
		var elem = this.groupMember[i];
		elem.toXml(writer, "groupMember");
	}
	writer.WriteXmlNodeEnd(name);
};
function CT_GroupMember() {
//Attributes
	this.uniqueName = null;
	this.group = null;//false
}
CT_GroupMember.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["uniqueName"];
		if (undefined !== val) {
			this.uniqueName = AscCommon.unleakString(uq(val));
		}
		val = vals["group"];
		if (undefined !== val) {
			this.group = getBoolFromXml(val);
		}
	}
};
CT_GroupMember.prototype.toXml = function(writer, name) {
	writer.WriteXmlNodeStart(name);
	if (null !== this.uniqueName) {
		writer.WriteXmlAttributeStringEncode("uniqueName", this.uniqueName);
	}
	if (null !== this.group) {
		writer.WriteXmlAttributeBool("group", this.group);
	}
	writer.WriteXmlNodeEnd(name, true, true);
};

var c_oAscPivotRecType = {
	Boolean: 1,
	DateTime: 2,
	Error: 3,
	Missing: 4,
	Number: 5,
	String: 6,
	Index: 7
};
var c_nNumberMissingValue =  2147483647;//Math.pow(2, 31) - 1

function PivotRecordValue() {
	this.clean();
};
PivotRecordValue.prototype.clean = function() {
	this.type = undefined;
	this.val = undefined;
	this.addition = undefined;
}
PivotRecordValue.prototype.getCellValue = function() {
	var res = new AscCommonExcel.CCellValue();
	switch (this.type) {
		case c_oAscPivotRecType.Boolean:
			res.type = AscCommon.CellValueType.Number;
			res.number = this.val ? 1 : 0;
			break;
		case c_oAscPivotRecType.DateTime:
			res.type = AscCommon.CellValueType.Number;
			res.number = this.val;
			break;
		case c_oAscPivotRecType.Error:
			res.type = AscCommon.CellValueType.String;
			res.text = AscCommonExcel.cError.prototype.getStringFromErrorType(this.val);
			break;
		case c_oAscPivotRecType.Number:
			res.type = AscCommon.CellValueType.Number;
			res.number = this.val;
			break;
		case c_oAscPivotRecType.String:
			res.type = AscCommon.CellValueType.String;
			res.text = this.val;
			break;
		default:
			var i = 0;
			break;
	}
	return res;
};

function PivotRecords() {
	this.chunks = [];
	this.addition = {};
	this.size = 0;
	this.startCount = 0;

//inner
	this._curBoolean = new CT_Boolean();
	this._curDateTime = new CT_DateTime();
	this._curError = new CT_Error();
	this._curMissing = new CT_Missing();
	this._curNumber = new CT_Number();
	this._curString = new CT_String();
	this._curIndex = new CT_Index();
	this.output = new PivotRecordValue();
}

PivotRecords.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = null;
	if ("b" === elem) {
		this._curBoolean.clean();
		newContext = this._curBoolean;
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
	} else if ("d" === elem) {
		this._curDateTime.clean();
		newContext = this._curDateTime;
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
	} else if ("e" === elem) {
		this._curError.clean();
		newContext = this._curError;
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
	} else if ("m" === elem) {
		this._curMissing.clean();
		newContext = this._curMissing;
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
	} else if ("n" === elem) {
		this._curNumber.clean();
		newContext = this._curNumber;
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
	} else if ("s" === elem) {
		this._curString.clean();
		newContext = this._curString;
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
	} else if ("x" === elem) {
		this._curIndex.clean();
		newContext = this._curIndex;
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
	}
	return newContext;
};
PivotRecords.prototype.onEndNode = function(prevContext, elem) {
	var res = true;
	if ("b" === elem) {
		if (this._curBoolean.isSimpleValue()) {
			this.addBool(this._curBoolean.v);
		} else {
			this.addBool(this._curBoolean.v, this._curBoolean);
			this._curBoolean = new CT_Boolean();
		}
	} else if ("d" === elem) {
		if (this._curDateTime.isSimpleValue()) {
			this.addDate(this._curDateTime.v);
		} else {
			this.addDate(this._curDateTime.v, this._curDateTime);
			this._curDateTime = new CT_DateTime();
		}
	} else if ("e" === elem) {
		if (this._curError.isSimpleValue()) {
			this.addError(this._curError.v);
		} else {
			this.addError(this._curError.v, this._curError);
			this._curError = new CT_Error();
		}
	} else if ("m" === elem) {
		if (this._curMissing.isSimpleValue()) {
			this.addMissing();
		} else {
			this.addMissing(this._curMissing);
			this._curMissing = new CT_Missing();
		}
	} else if ("n" === elem) {
		if (this._curNumber.isSimpleValue()) {
			this.addNumber(this._curNumber.v);
		} else {
			this.addNumber(this._curNumber.v, this._curNumber);
			this._curNumber = new CT_Number();
		}
	} else if ("s" === elem) {
		if (this._curString.isSimpleValue()) {
			this.addString(this._curString.v);
		} else {
			this.addString(this._curString.v, this._curString);
			this._curString = new CT_String();
		}
	} else if ("x" === elem) {
		this.addIndex(this._curIndex.v);
	} else {
		res = false;
	}
	return res;
};
PivotRecords.prototype.toXml = function(writer, opt_index) {
	if (undefined !== opt_index) {
		this._toXml(writer, this.get(opt_index));
	} else {
		for (var i = 0; i < this.size; ++i) {
			this._toXml(writer, this.get(i));
		}
	}
};
PivotRecords.prototype.setStartCount = function(val) {
	this.startCount = val;
};
PivotRecords.prototype.addBool = function(val, addition) {
	this._add(c_oAscPivotRecType.Boolean, val, addition);
};
PivotRecords.prototype.addDate = function(val, addition) {
	this._add(c_oAscPivotRecType.DateTime, val, addition);
};
PivotRecords.prototype.addError = function(val, addition) {
	this._add(c_oAscPivotRecType.Error, val, addition);
};
PivotRecords.prototype.addMissing = function(addition) {
	this._add(c_oAscPivotRecType.Missing, undefined, addition);
};
PivotRecords.prototype.addNumber = function(val, addition) {
	this._add(c_oAscPivotRecType.Number, val, addition);
};
PivotRecords.prototype.addString = function(val, addition) {
	//todo don't use global editor
	val = window["Asc"]["editor"].wbModel.sharedStrings.addText(val);
	this._add(c_oAscPivotRecType.String, val, addition);
};
PivotRecords.prototype.addIndex = function(val) {
	val++;//0 is missing value
	this._add(c_oAscPivotRecType.Index, val);
};
PivotRecords.prototype.get = function(index) {
	this.output.clean();
	for (var i = 0; i < this.chunks.length; ++i) {
		var chunk = this.chunks[i];
		if (chunk.from <= index && index < chunk.to) {
			this.output.type = chunk.type;
			this.output.addition = this.addition[index];
			if (chunk.data) {
				this.output.val = chunk.data[index - chunk.from];
				this._replaceMissingInOutput(chunk.type, this.output);
			}
			break;
		}
	}
	return this.output;
};
PivotRecords.prototype._add = function(type, val, addition) {
	var index = this.size;
	var prevChunk = this.chunks.length > 0 ? this.chunks[this.chunks.length - 1] : null;
	var chunk;
	var chunkIndex;
	if (prevChunk && (prevChunk.type === type || c_oAscPivotRecType.Missing === type)) {
		chunk = prevChunk;
		if (c_oAscPivotRecType.Missing === type) {
			val = this._getMissingFakeVal(chunk.type);
		} else if (c_oAscPivotRecType.Number === type && c_nNumberMissingValue === val) {
			//because there are much more Missing values than c_nNumberMissingValue.
			if(!addition){
				addition = new CT_Number();
			}
			addition.realNumber = true;
		}
	} else {
		if (prevChunk && prevChunk.type === c_oAscPivotRecType.Missing) {
			//convert Missing chunk
			chunk = prevChunk;
			chunk.type = type;
			chunkIndex = index - chunk.from;
			this._checkChunkSize(chunk, chunkIndex);
			var missingVal = this._getMissingFakeVal(chunk.type);
			chunk.data.fill(missingVal, 0, chunkIndex);
		} else {
			//todo shrink prevChunk
			var from = prevChunk ? prevChunk.to : 0;
			chunk = {type: type, data: null, capacity: 0, from: from, to: from + 1};
			this.chunks.push(chunk);
		}
	}
	chunkIndex = index - chunk.from;
	if (c_oAscPivotRecType.Missing !== chunk.type) {
		this._checkChunkSize(chunk, chunkIndex);
	}
	if (chunk.data) {
		chunk.data[chunkIndex] = val;
	}
	if (addition) {
		this.addition[index] = addition;
	}
	this.size++;
	chunk.to = this.size;
};
PivotRecords.prototype._checkChunkSize = function(chunk, chunkIndex) {
	if (chunkIndex >= chunk.capacity) {
		var oldData = chunk.data;
		var chunkStartCount = (0 === this.size && this.startCount) ? this.startCount - chunk.from : 0;
		var maxSize = Math.max((1.1 * chunk.capacity) >> 0, chunkIndex + 1, chunkStartCount);
		chunk.capacity = Math.min(maxSize, AscCommon.gc_nMaxRow0 + 1);
		switch (chunk.type) {
			case c_oAscPivotRecType.Boolean:
				chunk.data = new Uint8Array(chunk.capacity);
				break;
			case c_oAscPivotRecType.DateTime:
				chunk.data = new Float64Array(chunk.capacity);
				break;
			case c_oAscPivotRecType.Error:
				chunk.data = new Uint8Array(chunk.capacity);
				break;
			case c_oAscPivotRecType.Missing:
				break;
			case c_oAscPivotRecType.Number:
				chunk.data = new Float64Array(chunk.capacity);
				break;
			case c_oAscPivotRecType.String:
				chunk.data = new Uint32Array(chunk.capacity);
				break;
			case c_oAscPivotRecType.Index:
				chunk.data = new Uint32Array(chunk.capacity);
				break;
		}
		if (oldData) {
			chunk.data.set(oldData);
		}
	}
};
PivotRecords.prototype._getMissingFakeVal = function(type) {
	var res;
	switch (type) {
		case c_oAscPivotRecType.Boolean:
			res = 255;
			break;
		case c_oAscPivotRecType.DateTime:
			res = -1;
			break;
		case c_oAscPivotRecType.Error:
			res = 255;
			break;
		case c_oAscPivotRecType.Number:
			res = c_nNumberMissingValue;
			break;
		case c_oAscPivotRecType.String:
			res = 0;
			break;
		case c_oAscPivotRecType.Index:
			res = 0;
			break;
	}
	return res;
};
PivotRecords.prototype._replaceMissingInOutput = function(type, output) {
	switch (type) {
		case c_oAscPivotRecType.Boolean:
			if (255 === output.val) {
				output.type = c_oAscPivotRecType.Missing;
			} else {
				output.val = !!output.val;
			}
			break;
		case c_oAscPivotRecType.DateTime:
			if (-1 === output.val) {
				output.type = c_oAscPivotRecType.Missing;
			}
			break;
		case c_oAscPivotRecType.Error:
			if (255 === output.val) {
				output.type = c_oAscPivotRecType.Missing;
			}
			break;
		case c_oAscPivotRecType.Number:
			if (c_nNumberMissingValue === output.val && !(output.addition && output.addition.realNumber)) {
				output.type = c_oAscPivotRecType.Missing;
			}
			break;
		case c_oAscPivotRecType.String:
			if (0 === output.val) {
				output.type = c_oAscPivotRecType.Missing;
			} else {
				//todo don't use global editor
				output.val = window["Asc"]["editor"].wbModel.sharedStrings.get(output.val);
			}
			break;
		case c_oAscPivotRecType.Index:
			if (0 === output.val) {
				output.type = c_oAscPivotRecType.Missing;
			} else {
				--output.val;
			}
			break;
	}
};
PivotRecords.prototype._toXml = function(writer, elem) {
	switch (elem.type) {
		case c_oAscPivotRecType.Boolean:
			CT_Boolean.prototype.toXml2(writer, "b", elem.val, elem.addition);
			break;
		case c_oAscPivotRecType.DateTime:
			CT_DateTime.prototype.toXml2(writer, "d", elem.val, elem.addition);
			break;
		case c_oAscPivotRecType.Error:
			CT_Error.prototype.toXml2(writer, "e", elem.val, elem.addition);
			break;
		case c_oAscPivotRecType.Missing:
			CT_Missing.prototype.toXml2(writer, "m", elem.addition);
			break;
		case c_oAscPivotRecType.Number:
			CT_Number.prototype.toXml2(writer, "n", elem.val, elem.addition);
			break;
		case c_oAscPivotRecType.String:
			CT_String.prototype.toXml2(writer, "s", elem.val, elem.addition);
			break;
		case c_oAscPivotRecType.Index:
			CT_Index.prototype.toXml2(writer, "x", elem.val);
			break;
	}
};

function CChangesPivotTableDefinitionDelete(Class, bReverse) {
	this.Type = AscDFH.historyitem_PivotTableDefinitionDelete;
	this.bReverse = bReverse;
	AscDFH.CChangesBase.call(this, Class);
}

CChangesPivotTableDefinitionDelete.prototype = Object.create(AscDFH.CChangesBase.prototype);
CChangesPivotTableDefinitionDelete.prototype.constructor = CChangesPivotTableDefinitionDelete;
CChangesPivotTableDefinitionDelete.prototype.Undo = function () {
	if (this.Class.worksheet) {
		if (this.bReverse) {
			this.Class.worksheet.deletePivotTable(this.Class.Get_Id());
		} else {
			this.Class.worksheet.insertPivotTable(this.Class);
			this.Class.worksheet.updatePivotTablesStyle(null);
		}

	}
};
CChangesPivotTableDefinitionDelete.prototype.Redo = function () {
	if (this.Class.worksheet) {
		if (this.bReverse) {
			this.Class.worksheet.insertPivotTable(this.Class);
			this.Class.worksheet.updatePivotTablesStyle(null);
		} else {
			this.Class.worksheet.deletePivotTable(this.Class.Get_Id());
		}
	}
};
CChangesPivotTableDefinitionDelete.prototype.WriteToBinary = function (Writer) {
	Writer.WriteBool(!!this.bReverse);
};
CChangesPivotTableDefinitionDelete.prototype.ReadFromBinary = function (Reader) {
	this.bReverse = Reader.GetBool();
};
CChangesPivotTableDefinitionDelete.prototype.Load = function () {
	this.Redo();
	this.RefreshRecalcData();
};
CChangesPivotTableDefinitionDelete.prototype.CreateReverseChange = function () {
	return new CChangesPivotTableDefinitionDelete(this.Class, !this.bReverse);
};

var prot;

window['Asc']['c_oAscSourceType'] = window['AscCommonExcel'].c_oAscSourceType = c_oAscSourceType;
prot = c_oAscSourceType;
prot['Worksheet'] = prot.Worksheet;
prot['External'] = prot.External;
prot['Consolidation'] = prot.Consolidation;
prot['Scenario'] = prot.Scenario;

window['Asc']['c_oAscAxis'] = window['AscCommonExcel'].c_oAscAxis = c_oAscAxis;
prot = c_oAscAxis;
prot['AxisRow'] = prot.AxisRow;
prot['AxisCol'] = prot.AxisCol;
prot['AxisPage'] = prot.AxisPage;
prot['AxisValues'] = prot.AxisValues;

window['Asc']['c_oAscFieldSortType'] = window['AscCommonExcel'].c_oAscFieldSortType = c_oAscFieldSortType;
prot = c_oAscFieldSortType;
prot['Manual'] = prot.Manual;
prot['Ascending'] = prot.Ascending;
prot['Descending'] = prot.Descending;

window['Asc']['c_oAscItemType'] = window['AscCommonExcel'].c_oAscItemType = c_oAscItemType;
prot = c_oAscItemType;
prot['Data'] = prot.Data;
prot['Default'] = prot.Default;
prot['Sum'] = prot.Sum;
prot['CountA'] = prot.CountA;
prot['Avg'] = prot.Avg;
prot['Max'] = prot.Max;
prot['Min'] = prot.Min;
prot['Product'] = prot.Product;
prot['Count'] = prot.Count;
prot['StdDev'] = prot.StdDev;
prot['StdDevP'] = prot.StdDevP;
prot['Var'] = prot.Var;
prot['VarP'] = prot.VarP;
prot['Grand'] = prot.Grand;
prot['Blank'] = prot.Blank;

window['Asc']['c_oAscDataConsolidateFunction'] = window['AscCommonExcel'].c_oAscDataConsolidateFunction = c_oAscDataConsolidateFunction;
prot = c_oAscDataConsolidateFunction;
prot['Average'] = prot.Average;
prot['Count'] = prot.Count;
prot['CountNums'] = prot.CountNums;
prot['Max'] = prot.Max;
prot['Min'] = prot.Min;
prot['Product'] = prot.Product;
prot['StdDev'] = prot.StdDev;
prot['StdDevp'] = prot.StdDevp;
prot['Sum'] = prot.Sum;
prot['Var'] = prot.Var;
prot['Varp'] = prot.Varp;

window['Asc']['c_oAscShowDataAs'] = window['AscCommonExcel'].c_oAscShowDataAs = c_oAscShowDataAs;
prot = c_oAscShowDataAs;
prot['Normal'] = prot.Normal;
prot['Difference'] = prot.Difference;
prot['Percent'] = prot.Percent;
prot['PercentDiff'] = prot.PercentDiff;
prot['RunTotal'] = prot.RunTotal;
prot['PercentOfRow'] = prot.PercentOfRow;
prot['PercentOfCol'] = prot.PercentOfCol;
prot['PercentOfTotal'] = prot.PercentOfTotal;
prot['Index'] = prot.Index;

window['Asc']['c_oAscFormatAction'] = window['AscCommonExcel'].c_oAscFormatAction = c_oAscFormatAction;
prot = c_oAscFormatAction;
prot['Blank'] = prot.Blank;
prot['Formatting'] = prot.Formatting;
prot['Drill'] = prot.Drill;
prot['Formula'] = prot.Formula;

window['Asc']['c_oAscScope'] = window['AscCommonExcel'].c_oAscScope = c_oAscScope;
prot = c_oAscScope;
prot['Selection'] = prot.Selection;
prot['Data'] = prot.Data;
prot['Field'] = prot.Field;

window['Asc']['c_oAscType'] = window['AscCommonExcel'].c_oAscType = c_oAscType;
prot = c_oAscType;
prot['None'] = prot.None;
prot['All'] = prot.All;
prot['Row'] = prot.Row;
prot['Column'] = prot.Column;

window['Asc']['c_oAscPivotFilterType'] = window['AscCommonExcel'].c_oAscPivotFilterType = c_oAscPivotFilterType;
prot = c_oAscPivotFilterType;
prot['Unknown'] = prot.Unknown;
prot['Count'] = prot.Count;
prot['Percent'] = prot.Percent;
prot['Sum'] = prot.Sum;
prot['CaptionEqual'] = prot.CaptionEqual;
prot['CaptionNotEqual'] = prot.CaptionNotEqual;
prot['CaptionBeginsWith'] = prot.CaptionBeginsWith;
prot['CaptionNotBeginsWith'] = prot.CaptionNotBeginsWith;
prot['CaptionEndsWith'] = prot.CaptionEndsWith;
prot['CaptionNotEndsWith'] = prot.CaptionNotEndsWith;
prot['CaptionContains'] = prot.CaptionContains;
prot['CaptionNotContains'] = prot.CaptionNotContains;
prot['CaptionGreaterThan'] = prot.CaptionGreaterThan;
prot['CaptionGreaterThanOrEqual'] = prot.CaptionGreaterThanOrEqual;
prot['CaptionLessThan'] = prot.CaptionLessThan;
prot['CaptionLessThanOrEqual'] = prot.CaptionLessThanOrEqual;
prot['CaptionBetween'] = prot.CaptionBetween;
prot['CaptionNotBetween'] = prot.CaptionNotBetween;
prot['ValueEqual'] = prot.ValueEqual;
prot['ValueNotEqual'] = prot.ValueNotEqual;
prot['ValueGreaterThan'] = prot.ValueGreaterThan;
prot['ValueGreaterThanOrEqual'] = prot.ValueGreaterThanOrEqual;
prot['ValueLessThan'] = prot.ValueLessThan;
prot['ValueLessThanOrEqual'] = prot.ValueLessThanOrEqual;
prot['ValueBetween'] = prot.ValueBetween;
prot['ValueNotBetween'] = prot.ValueNotBetween;
prot['DateEqual'] = prot.DateEqual;
prot['DateNotEqual'] = prot.DateNotEqual;
prot['DateOlderThan'] = prot.DateOlderThan;
prot['DateOlderThanOrEqual'] = prot.DateOlderThanOrEqual;
prot['DateNewerThan'] = prot.DateNewerThan;
prot['DateNewerThanOrEqual'] = prot.DateNewerThanOrEqual;
prot['DateBetween'] = prot.DateBetween;
prot['DateNotBetween'] = prot.DateNotBetween;
prot['Tomorrow'] = prot.Tomorrow;
prot['Today'] = prot.Today;
prot['Yesterday'] = prot.Yesterday;
prot['NextWeek'] = prot.NextWeek;
prot['ThisWeek'] = prot.ThisWeek;
prot['LastWeek'] = prot.LastWeek;
prot['NextMonth'] = prot.NextMonth;
prot['ThisMonth'] = prot.ThisMonth;
prot['LastMonth'] = prot.LastMonth;
prot['NextQuarter'] = prot.NextQuarter;
prot['ThisQuarter'] = prot.ThisQuarter;
prot['LastQuarter'] = prot.LastQuarter;
prot['NextYear'] = prot.NextYear;
prot['ThisYear'] = prot.ThisYear;
prot['LastYear'] = prot.LastYear;
prot['YearToDate'] = prot.YearToDate;
prot['Q1'] = prot.Q1;
prot['Q2'] = prot.Q2;
prot['Q3'] = prot.Q3;
prot['Q4'] = prot.Q4;
prot['M1'] = prot.M1;
prot['M2'] = prot.M2;
prot['M3'] = prot.M3;
prot['M4'] = prot.M4;
prot['M5'] = prot.M5;
prot['M6'] = prot.M6;
prot['M7'] = prot.M7;
prot['M8'] = prot.M8;
prot['M9'] = prot.M9;
prot['M10'] = prot.M10;
prot['M11'] = prot.M11;
prot['M12'] = prot.M12;

window['Asc']['c_oAscSortType'] = window['AscCommonExcel'].c_oAscSortType = c_oAscSortType;
prot = c_oAscSortType;
prot['None'] = prot.None;
prot['Ascending'] = prot.Ascending;
prot['Descending'] = prot.Descending;
prot['AscendingAlpha'] = prot.AscendingAlpha;
prot['DescendingAlpha'] = prot.DescendingAlpha;
prot['AscendingNatural'] = prot.AscendingNatural;
prot['DescendingNatural'] = prot.DescendingNatural;

window['Asc']['c_oAscPivotAreaType'] = window['AscCommonExcel'].c_oAscPivotAreaType = c_oAscPivotAreaType;
prot = c_oAscPivotAreaType;
prot['None'] = prot.None;
prot['Normal'] = prot.Normal;
prot['Data'] = prot.Data;
prot['All'] = prot.All;
prot['Origin'] = prot.Origin;
prot['Button'] = prot.Button;
prot['TopEnd'] = prot.TopEnd;

window['Asc']['c_oAscGroupBy'] = window['AscCommonExcel'].c_oAscGroupBy = c_oAscGroupBy;
prot = c_oAscGroupBy;
prot['Range'] = prot.Range;
prot['Seconds'] = prot.Seconds;
prot['Minutes'] = prot.Minutes;
prot['Hours'] = prot.Hours;
prot['Days'] = prot.Days;
prot['Months'] = prot.Months;
prot['Quarters'] = prot.Quarters;
prot['Years'] = prot.Years;

window['Asc']['c_oAscSortMethod'] = window['AscCommonExcel'].c_oAscSortMethod = c_oAscSortMethod;
prot = c_oAscSortMethod;
prot['Stroke'] = prot.Stroke;
prot['PinYin'] = prot.PinYin;
prot['None'] = prot.None;

window['Asc']['c_oAscDynamicFilterType'] = window['AscCommonExcel'].c_oAscDynamicFilterType = c_oAscDynamicFilterType;
prot = c_oAscDynamicFilterType;
prot['Null'] = prot.Null;
prot['AboveAverage'] = prot.AboveAverage;
prot['BelowAverage'] = prot.BelowAverage;
prot['Tomorrow'] = prot.Tomorrow;
prot['Today'] = prot.Today;
prot['Yesterday'] = prot.Yesterday;
prot['NextWeek'] = prot.NextWeek;
prot['ThisWeek'] = prot.ThisWeek;
prot['LastWeek'] = prot.LastWeek;
prot['NextMonth'] = prot.NextMonth;
prot['ThisMonth'] = prot.ThisMonth;
prot['LastMonth'] = prot.LastMonth;
prot['NextQuarter'] = prot.NextQuarter;
prot['ThisQuarter'] = prot.ThisQuarter;
prot['LastQuarter'] = prot.LastQuarter;
prot['NextYear'] = prot.NextYear;
prot['ThisYear'] = prot.ThisYear;
prot['LastYear'] = prot.LastYear;
prot['YearToDate'] = prot.YearToDate;
prot['Q1'] = prot.Q1;
prot['Q2'] = prot.Q2;
prot['Q3'] = prot.Q3;
prot['Q4'] = prot.Q4;
prot['M1'] = prot.M1;
prot['M2'] = prot.M2;
prot['M3'] = prot.M3;
prot['M4'] = prot.M4;
prot['M5'] = prot.M5;
prot['M6'] = prot.M6;
prot['M7'] = prot.M7;
prot['M8'] = prot.M8;
prot['M9'] = prot.M9;
prot['M10'] = prot.M10;
prot['M11'] = prot.M11;
prot['M12'] = prot.M12;

window['Asc']['c_oAscCalendarType'] = window['AscCommonExcel'].c_oAscCalendarType = c_oAscCalendarType;
prot = c_oAscCalendarType;
prot['Gregorian'] = prot.Gregorian;
prot['GregorianUs'] = prot.GregorianUs;
prot['GregorianMeFrench'] = prot.GregorianMeFrench;
prot['GregorianArabic'] = prot.GregorianArabic;
prot['Hijri'] = prot.Hijri;
prot['Hebrew'] = prot.Hebrew;
prot['Taiwan'] = prot.Taiwan;
prot['Japan'] = prot.Japan;
prot['Thai'] = prot.Thai;
prot['Korea'] = prot.Korea;
prot['Saka'] = prot.Saka;
prot['GregorianXlitEnglish'] = prot.GregorianXlitEnglish;
prot['GregorianXlitFrench'] = prot.GregorianXlitFrench;
prot['None'] = prot.None;

window['Asc']['c_oAscIconSetType'] = window['AscCommonExcel'].c_oAscIconSetType = c_oAscIconSetType;
prot = c_oAscIconSetType;
prot['ThreeArrows'] = prot.ThreeArrows;
prot['ThreeArrowsGray'] = prot.ThreeArrowsGray;
prot['ThreeFlags'] = prot.ThreeFlags;
prot['ThreeTrafficLights1'] = prot.ThreeTrafficLights1;
prot['ThreeTrafficLights2'] = prot.ThreeTrafficLights2;
prot['ThreeSigns'] = prot.ThreeSigns;
prot['ThreeSymbols'] = prot.ThreeSymbols;
prot['ThreeSymbols2'] = prot.ThreeSymbols2;
prot['FourArrows'] = prot.FourArrows;
prot['FourArrowsGray'] = prot.FourArrowsGray;
prot['FourRedToBlack'] = prot.FourRedToBlack;
prot['FourRating'] = prot.FourRating;
prot['FourTrafficLights'] = prot.FourTrafficLights;
prot['FiveArrows'] = prot.FiveArrows;
prot['FiveArrowsGray'] = prot.FiveArrowsGray;
prot['FiveRating'] = prot.FiveRating;
prot['FiveQuarters'] = prot.FiveQuarters;

window['Asc']['c_oAscSortBy'] = window['AscCommonExcel'].c_oAscSortBy = c_oAscSortBy;
prot = c_oAscSortBy;
prot['Value'] = prot.Value;
prot['CellColor'] = prot.CellColor;
prot['FontColor'] = prot.FontColor;
prot['Icon'] = prot.Icon;

window['Asc']['c_oAscFilterOperator'] = window['AscCommonExcel'].c_oAscFilterOperator = c_oAscFilterOperator;
prot = c_oAscFilterOperator;
prot['Equal'] = prot.Equal;
prot['LessThan'] = prot.LessThan;
prot['LessThanOrEqual'] = prot.LessThanOrEqual;
prot['NotEqual'] = prot.NotEqual;
prot['GreaterThanOrEqual'] = prot.GreaterThanOrEqual;
prot['GreaterThan'] = prot.GreaterThan;

window['Asc']['c_oAscDateTimeGrouping'] = window['AscCommonExcel'].c_oAscDateTimeGrouping = c_oAscDateTimeGrouping;
prot = c_oAscDateTimeGrouping;
prot['Year'] = prot.Year;
prot['Month'] = prot.Month;
prot['Day'] = prot.Day;
prot['Hour'] = prot.Hour;
prot['Minute'] = prot.Minute;
prot['Second'] = prot.Second;

window['Asc']['st_VALUES'] = window['AscCommonExcel'].st_VALUES = st_VALUES;

window['AscCommonExcel'].ToName_ST_ItemType = ToName_ST_ItemType;

window['Asc']['CT_PivotCacheDefinition'] = window['Asc'].CT_PivotCacheDefinition = CT_PivotCacheDefinition;

window['Asc']['CT_PivotCacheRecords'] = window['Asc'].CT_PivotCacheRecords = CT_PivotCacheRecords;

window["Asc"]["CT_pivotTableDefinition"] = window['Asc'].CT_pivotTableDefinition = CT_pivotTableDefinition;
prot = CT_pivotTableDefinition.prototype;
prot["asc_getName"] = prot.asc_getName;
prot["asc_getPageWrap"] = prot.asc_getPageWrap;
prot["asc_getPageOverThenDown"] = prot.asc_getPageOverThenDown;
prot["asc_getRowGrandTotals"] = prot.asc_getRowGrandTotals;
prot["asc_getColGrandTotals"] = prot.asc_getColGrandTotals;
prot["asc_getShowHeaders"] = prot.asc_getShowHeaders;
prot["asc_getStyleInfo"] = prot.asc_getStyleInfo;
prot["asc_getCacheFields"] = prot.asc_getCacheFields;
prot["asc_getPivotFields"] = prot.asc_getPivotFields;
prot["asc_getPageFields"] = prot.asc_getPageFields;
prot["asc_getColumnFields"] = prot.asc_getColumnFields;
prot["asc_getRowFields"] = prot.asc_getRowFields;
prot["asc_getDataFields"] = prot.asc_getDataFields;
prot["asc_select"] = prot.asc_select;
prot["asc_set"] = prot.asc_set;
prot["asc_setRowGrandTotals"] = prot.asc_setRowGrandTotals;
prot["asc_setColGrandTotals"] = prot.asc_setColGrandTotals;
prot["asc_addPageField"] = prot.asc_addPageField;
prot["asc_removeField"] = prot.asc_removeField;

prot = CT_PivotTableStyle.prototype;
prot["asc_getName"] = prot.asc_getName;
prot["asc_getShowRowHeaders"] = prot.asc_getShowRowHeaders;
prot["asc_getShowColHeaders"] = prot.asc_getShowColHeaders;
prot["asc_getShowRowStripes"] = prot.asc_getShowRowStripes;
prot["asc_getShowColStripes"] = prot.asc_getShowColStripes;
prot["asc_setName"] = prot.asc_setName;
prot["asc_setShowRowHeaders"] = prot.asc_setShowRowHeaders;
prot["asc_setShowColHeaders"] = prot.asc_setShowColHeaders;
prot["asc_setShowRowStripes"] = prot.asc_setShowRowStripes;
prot["asc_setShowColStripes"] = prot.asc_setShowColStripes;

prot = CT_CacheField.prototype;
prot["asc_getName"] = prot.asc_getName;

prot = CT_PivotField.prototype;
prot["asc_getName"] = prot.asc_getName;
prot["asc_getSubtotalTop"] = prot.asc_getSubtotalTop;
prot["asc_getSubtotals"] = prot.asc_getSubtotals;

prot = CT_Field.prototype;
prot["asc_getIndex"] = prot.asc_getIndex;

prot = CT_PageField.prototype;
prot["asc_getName"] = prot.asc_getName;
prot["asc_getIndex"] = prot.asc_getIndex;

window["Asc"]["CT_DataField"] = CT_DataField;
prot = CT_DataField.prototype;
prot["asc_getName"] = prot.asc_getName;
prot["asc_getIndex"] = prot.asc_getIndex;
prot["asc_getSubtotal"] = prot.asc_getSubtotal;
prot["asc_getShowDataAs"] = prot.asc_getShowDataAs;
prot["asc_set"] = prot.asc_set;
prot["asc_setName"] = prot.asc_setName;
prot["asc_setSubtotal"] = prot.asc_setSubtotal;

window['AscDFH'].CChangesPivotTableDefinitionDelete = CChangesPivotTableDefinitionDelete;

AscDFH.changesFactory[AscDFH.historyitem_PivotTableDefinitionDelete] = AscDFH.CChangesPivotTableDefinitionDelete;
