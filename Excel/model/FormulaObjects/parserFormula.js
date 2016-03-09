"use strict";
/** @enum */
var cElementType = {
		number      : 0,
		string      : 1,
		bool        : 2,
		error       : 3,
		empty       : 4,
		cellsRange  : 5,
		cell        : 6,
		date        : 7,
		func        : 8,
		operator    : 9,
		name        : 10,
		array       : 11,
		cell3D      : 12,
		cellsRange3D: 13,
		table       : 14,
		name3D       : 15
	},
/** @enum */
	cErrorType = {
		unsupported_function: 0,
		null_value          : 1,
		division_by_zero    : 2,
		wrong_value_type    : 3,
		bad_reference       : 4,
		wrong_name          : 5,
		not_numeric         : 6,
		not_available       : 7,
		getting_data        : 8
	},
	cExcelSignificantDigits = 15, //количество цифр в числе после запятой
    cExcelMaxExponent = 308,
    cExcelMinExponent = -308,
    cExcelDateTimeDigits = 8, //количество цифр после запятой в числах отвечающих за время специализация $18.17.4.2
    c_Date1904Const = 24107, //разница в днях между 01.01.1970 и 01.01.1904 годами
    c_Date1900Const = 25568, //разница в днях между 01.01.1970 и 01.01.1900 годами
    c_DateCorrectConst = c_Date1900Const,
    c_sPerDay = 86400,
    c_msPerDay = c_sPerDay * 1000,
	cStrucTableReservedWords = {
		all    : "#All",
		data   : "#Data",
		headers: "#Headers",
		totals : "#Totals",
		thisrow: "#This Row",
		at     : "@"
	},
	cSubTotalFunctionType = {
		includes: {
			AVERAGE: 1,
			COUNT  : 2,
			COUNTA : 3,
			MAX    : 4,
			MIN    : 5,
			PRODUCT: 6,
			STDEV  : 7,
			STDEVP : 8,
			SUM    : 9,
			VAR    : 10,
			VARP   : 11
		},
		excludes: {
			AVERAGE: 101,
			COUNT  : 102,
			COUNTA : 103,
			MAX    : 104,
			MIN    : 105,
			PRODUCT: 106,
			STDEV  : 107,
			STDEVP : 108,
			SUM    : 109,
			VAR    : 110,
			VARP   : 111
		}
	};

Date.prototype.excelNullDate1900 = Date.UTC( 1899, 11, 30, 0, 0, 0 );
Date.prototype.excelNullDate1904 = Date.UTC( 1904, 0, 1, 0, 0, 0 );

Date.prototype.getExcelNullDate = function () {
    return g_bDate1904 ? Date.prototype.excelNullDate1904 : Date.prototype.excelNullDate1900;
};

Date.prototype.isLeapYear = function () {
    var y = this.getUTCFullYear();
    return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
};

Date.prototype.getDaysInMonth = function () {
//    return arguments.callee[this.isLeapYear() ? 'L' : 'R'][this.getMonth()];
    return this.isLeapYear() ?
        this.getDaysInMonth.L[this.getUTCMonth()] :
        this.getDaysInMonth.R[this.getUTCMonth()];
};

// durations of months for the regular year
Date.prototype.getDaysInMonth.R = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
// durations of months for the leap year
Date.prototype.getDaysInMonth.L = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

Date.prototype.truncate = function () {
    this.setUTCHours( 0, 0, 0, 0 );
    return this;
};

Date.prototype.getExcelDate = function () {
    return Math.floor( this.getExcelDateWithTime() );
};

Date.prototype.getExcelDateWithTime = function () {
//    return Math.floor( ( this.getTime() / 1000 - this.getTimezoneOffset() * 60 ) / c_sPerDay + ( c_DateCorrectConst + (g_bDate1904 ? 0 : 1) ) );
    var year = this.getUTCFullYear(), month = this.getUTCMonth(), date = this.getUTCDate(), res;

    if ( 1900 < year || (1900 == year && 1 < month) )
        res = (Date.UTC( year, month, date, this.getUTCHours(), this.getUTCMinutes(), this.getUTCSeconds() ) - this.getExcelNullDate() ) / c_msPerDay;
    else if ( 1900 == year && 1 == month && 29 == date )
        res = 60;
    else
        res = (Date.UTC( year, month, date, this.getUTCHours(), this.getUTCMinutes(), this.getUTCSeconds() ) - this.getExcelNullDate() ) / c_msPerDay - 1;

    return res;
};

Date.prototype.getDateFromExcel = function ( val ) {

    val = Math.floor( val );

    if ( g_bDate1904 ) {
        return new Date( val * c_msPerDay + this.getExcelNullDate() );
    }
    else {
        if ( val < 60 ) {
            return new Date( val * c_msPerDay + this.getExcelNullDate() );
        }
        else if ( val === 60 ) {
            return new Date( Date.UTC( 1900, 1, 29 ) );
        }
        else {
            return new Date( val * c_msPerDay + this.getExcelNullDate() );
        }
    }
};

Date.prototype.addYears = function ( counts ) {
    this.setUTCFullYear( this.getUTCFullYear() + Math.floor( counts ) );
};

Date.prototype.addMonths = function ( counts ) {
    if ( this.lastDayOfMonth() ) {
        this.setUTCDate( 1 );
        this.setUTCMonth( this.getUTCMonth() + Math.floor( counts ) );
        this.setUTCDate( this.getDaysInMonth() );
    }
    else {
        this.setUTCMonth( this.getUTCMonth() + Math.floor( counts ) );
    }
};

Date.prototype.addDays = function ( counts ) {
    this.setUTCDate( this.getUTCDate() + Math.floor( counts ) );
};

Date.prototype.lastDayOfMonth = function () {
    return this.getDaysInMonth() == this.getUTCDate();
};

Math.sinh = function ( arg ) {
    return (this.pow( this.E, arg ) - this.pow( this.E, -arg )) / 2;
};

Math.cosh = function ( arg ) {
    return (this.pow( this.E, arg ) + this.pow( this.E, -arg )) / 2;
};

Math.tanh = function ( arg ) {
    return this.sinh( arg ) / this.cosh( arg );
};

Math.asinh = function ( arg ) {
    return this.log( arg + this.sqrt( arg * arg + 1 ) );
};

Math.acosh = function ( arg ) {
    return this.log( arg + this.sqrt( arg + 1 ) * this.sqrt( arg - 1 ) );
};

Math.atanh = function ( arg ) {
    return 0.5 * this.log( (1 + arg) / (1 - arg) );
};

Math.fact = function ( n ) {
    var res = 1;
    n = this.floor( n );
    if ( n < 0 ) {
        return NaN;
    }
    else if ( n > 170 ) {
        return Infinity;
    }
    while ( n !== 0 ) {
        res *= n--;
    }
    return res;
};

Math.doubleFact = function ( n ) {
    var res = 1;
    n = this.floor( n );
    if ( n < 0 ) {
        return NaN;
    }
    else if ( n > 170 ) {
        return Infinity;
    }
//    n = Math.floor((n+1)/2);
    while ( n > 0 ) {
        res *= n;
        n -= 2;
    }
    return res;
};

Math.factor = function ( n ) {
    var res = 1;
    n = this.floor( n );
    while ( n !== 0 ) {
        res = res * n--;
    }
    return res;
};

Math.ln = Math.log;

Math.log10 = function ( x ) {
    return this.log( x ) / this.log( 10 );
};

Math.fmod = function ( a, b ) {
    return Number( (a - (this.floor( a / b ) * b)).toPrecision( cExcelSignificantDigits ) );
};

Math.binomCoeff = function ( n, k ) {
    return this.fact( n ) / (this.fact( k ) * this.fact( n - k ));
};

Math.permut = function ( n, k ) {
    return this.floor( this.fact( n ) / this.fact( n - k ) + 0.5 );
};

Math.approxEqual = function ( a, b ) {
    if ( a === b ) {
        return true;
    }
    return this.abs( a - b ) < 1e-15;
};

Math.sign = function ( x ) {
    return x > 0 ? 1 : x < 0 ? -1 : 0;
};

RegExp.escape = function ( text ) {
    return text.replace( /[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&" );
}

parserHelp.setDigitSeparator( g_oDefaultCultureInfo.NumberDecimalSeparator );

/** @constructor */
function cBaseType( val, type ) {
    this.needRecalc = false;
    this.numFormat = null;
    this.ca = false;
    this.node = undefined;
    this.type = type;
    this.value = val;
}
cBaseType.prototype = {
    constructor   : cBaseType,
    cloneTo       : function ( oRes ) {
        oRes.needRecalc = this.needRecalc;
        oRes.numFormat = this.numFormat;
        oRes.type = this.type;
        oRes.value = this.value;
        oRes.ca = this.ca;
        oRes.node = this.node;
    },
    tryConvert    : function () {
        return this;
    },
    getValue      : function () {
        return this.value;
    },
    toString      : function () {
        return this.value.toString();
    },
    toLocaleString: function () {
        return this.toString();
    },
    setNode       : function ( node ) {
        this.node = node;
    }
};

/*Basic types of an elements used into formulas*/
/** @constructor */
function cNumber( val ) {
    this.constructor.call( this, parseFloat( val ), cElementType.number );
    var res;

    if ( !isNaN( this.value ) && Math.abs( this.value ) !== Infinity ) {
        res = this;
    }
    else if ( val instanceof cError ) {
        res = val;
    }
    else {
        res = new cError( cErrorType.not_numeric );
    }
    return res;
}

cNumber.prototype = Object.create( cBaseType.prototype );
cNumber.prototype.tocString = function () {
    return new cString( ("" + this.value).replace( digitSeparatorDef, digitSeparator ) );
};
cNumber.prototype.tocNumber = function () {
    return this;
};
cNumber.prototype.tocBool = function () {
    return new cBool( this.value !== 0 );
};
cNumber.prototype.toLocaleString = function ( digitDelim ) {
    var res = this.value.toString();
    if ( digitDelim )
        return res.replace( digitSeparatorDef, digitSeparator );
    else
        return res;
};

/** @constructor */
function cString( val ) {
    this.constructor.call( this, val, cElementType.string );
}

cString.prototype = Object.create( cBaseType.prototype );
cString.prototype.tocNumber = function () {
    var res, m = this.value;
    if ( this.value === "" ) {
        res = new cNumber( 0 );
    }

    /*if ( this.value[0] === '"' && this.value[this.value.length - 1] === '"' ) {
     m = this.value.substring( 1, this.value.length - 1 );
     }*/

    if ( g_oFormatParser.isLocaleNumber( this.value ) ) {
        if ( "." != g_oDefaultCultureInfo.NumberDecimalSeparator ) {
            m = this.value.replace( ".", "q" );//заменяем на символ с которым не распознается, как в Excel
            m = m.replace( g_oDefaultCultureInfo.NumberDecimalSeparator, "." );
        }

        if ( !parseNum( m ) ) {
            res = new cError( cErrorType.wrong_value_type );
        }
        else {
            var numberValue = g_oFormatParser.parseLocaleNumber( this.value );
            if ( !isNaN( numberValue ) ) {
                res = new cNumber( numberValue );
            }
        }
    }
    else {
        res = new cError( cErrorType.wrong_value_type );
    }

    return res;
};
cString.prototype.tocBool = function () {
    var res;
    if ( parserHelp.isBoolean( this.value, 0 ) ) {
        res = new cBool( parserHelp.operand_str.toUpperCase() === cBoolLocal["t"].toUpperCase() );
    }
    else {
        res = this;
    }
    return res;
};
cString.prototype.tocString = function () {
    return this;
};
cString.prototype.tryConvert = function () {
    var res = checkTypeCell( "" + this.value );
    if ( res instanceof cEmpty ) {
        return this;
    }
    else {
        return res;
    }
};

/** @constructor */
function cBool( val ) {
	var v = false;
	switch(val.toString().toUpperCase()){
		case "TRUE":
		case cBoolLocal["t"].toUpperCase(): v = true;
	}
    this.constructor.call( this, v, cElementType.bool );
}

cBool.prototype = Object.create( cBaseType.prototype );
cBool.prototype.toString = function () {
    return this.value.toString().toUpperCase();
};
cBool.prototype.getValue = function () {
    return this.toString();
};
cBool.prototype.tocNumber = function () {
    return new cNumber( this.value ? 1.0 : 0.0 );
};
cBool.prototype.tocString = function () {
    return new cString( this.value ? "TRUE" : "FALSE" );
};
cBool.prototype.toLocaleString = function () {
    return new cString( this.value ? cBoolLocal["t"].toUpperCase() : cBoolLocal["f"].toUpperCase() );
};
cBool.prototype.tocBool = function () {
    return this;
};
cBool.prototype.toBool = function () {
    return this.value;
};

/** @constructor */
function cError( val ) {
    this.constructor.call( this, val, cElementType.error );

    this.errorType = -1;

    switch ( val ) {
		case cErrorLocal["value"]:
        case "#VALUE!":
        case cErrorType.wrong_value_type:
        {
            this.value = "#VALUE!";
            this.errorType = cErrorType.wrong_value_type;
            break;
        }
		case cErrorLocal["nil"]:
        case "#NULL!":
        case cErrorType.null_value:
        {
            this.value = "#NULL!";
            this.errorType = cErrorType.null_value;
            break;
        }
		case cErrorLocal["div"]:
        case "#DIV/0!":
        case cErrorType.division_by_zero:
        {
            this.value = "#DIV/0!";
            this.errorType = cErrorType.division_by_zero;
            break;
        }
		case cErrorLocal["ref"]:
        case "#REF!":
        case cErrorType.bad_reference:
        {
            this.value = "#REF!";
            this.errorType = cErrorType.bad_reference;
            break;
        }
		case cErrorLocal["name"]:
        case "#NAME?":
        case cErrorType.wrong_name:
        {
            this.value = "#NAME?";
            this.errorType = cErrorType.wrong_name;
            break;
        }
		case cErrorLocal["num"]:
        case "#NUM!":
        case cErrorType.not_numeric:
        {
            this.value = "#NUM!";
            this.errorType = cErrorType.not_numeric;
            break;
        }
		case cErrorLocal["na"]:
        case "#N/A":
        case cErrorType.not_available:
        {
            this.value = "#N/A";
            this.errorType = cErrorType.not_available;
            break;
        }
		case cErrorLocal["getdata"]:
        case "#GETTING_DATA":
        case cErrorType.getting_data:
        {
            this.value = "#GETTING_DATA";
            this.errorType = cErrorType.getting_data;
            break;
        }
		case cErrorLocal["uf"]:
        case "#UNSUPPORTED_FUNCTION!":
        case cErrorType.unsupported_function:
        {
            this.value = "#UNSUPPORTED_FUNCTION!";
            this.errorType = cErrorType.unsupported_function;
            break;
        }

    }

    return this;
}

cError.prototype = Object.create( cBaseType.prototype );
cError.prototype.tocNumber = cError.prototype.tocString = cError.prototype.tocBool = cError.prototype.tocEmpty = function () {
    return this;
};

/** @constructor */
function cArea( val, ws ) {/*Area means "A1:E5" for example*/
    this.constructor.call( this, val, cElementType.cellsRange );

    this.ws = ws;
    this.wb = ws.workbook;
    this._cells = val;
    this.isAbsolute = false;
    this.isAbsoluteCol1 = false;
    this.isAbsoluteRow1 = false;
    this.isAbsoluteCol2 = false;
    this.isAbsoluteRow2 = false;
    this.range = null;
//    this._valid = this.range ? true : false;
}

cArea.prototype = Object.create( cBaseType.prototype );
cArea.prototype.clone = function () {
    var oRes = new cArea( this._cells, this.ws );
//	cBaseType.prototype.cloneTo.call( this, oRes );
    this.constructor.prototype.cloneTo.call( this, oRes );
    oRes.isAbsolute = this.isAbsolute;
    oRes.isAbsoluteCol1 = this.isAbsoluteCol1;
    oRes.isAbsoluteRow1 = this.isAbsoluteRow1;
    oRes.isAbsoluteCol2 = this.isAbsoluteCol2;
    oRes.isAbsoluteRow2 = this.isAbsoluteRow2;
    return oRes;
};
cArea.prototype.getWsId = function () {
    return this.ws.Id;
};
cArea.prototype.getValue = function () {
    var val = [], r = this.getRange();
    if ( !r ) {
        val.push( new cError( cErrorType.bad_reference ) );
    }
    else {
        r._foreachNoEmpty( function ( cell ) {
            var cellType = cell.getType();
            switch ( cellType ) {
                case CellValueType.Number:
                    cell.getValueWithoutFormat() === "" ? val.push( new cEmpty() ) : val.push( new cNumber( cell.getValueWithoutFormat() ) );
                    break;

                case CellValueType.Bool:
                    val.push( new cBool( cell.getValueWithoutFormat() ) );
                    break;

                case CellValueType.Error:
                    val.push( new cError( cell.getValueWithoutFormat() ) );
                    break;

                case CellValueType.String:
                    val.push( new cString( cell.getValueWithoutFormat() ) );
                    break;

                default:
                    if ( cell.getValueWithoutFormat() && cell.getValueWithoutFormat() !== "" ) {
                        val.push( new cNumber( cell.getValueWithoutFormat() ) );
                    }
                    else {
                        val.push( checkTypeCell( "" + cell.getValueWithoutFormat() ) );
                    }
            }
        } );
    }
    return val;
};
cArea.prototype.getValue2 = function ( i, j ) {
    var res = this.index( i + 1, j + 1 ), r, cell;
    if ( !res ) {
        r = this.getRange();
        cell = r.worksheet._getCellNoEmpty( r.bbox.r1 + i, r.bbox.c1 + j );
        res = this._parseCellValue( cell );
    }
    return res;
};
cArea.prototype.getRange = function () {
    if ( !this.range ) {
        this.range = this.ws.getRange2( this._cells )
    }
    return this.range;
};
cArea.prototype.tocNumber = function () {
    var v = this.getValue()[0];
    if ( !v ) {
        v = new cNumber( 0 );
    }
    else {
        v = v.tocNumber();
    }
    return v;
};
cArea.prototype.tocString = function () {
    return this.getValue()[0].tocString();
};
cArea.prototype.tocBool = function () {
    return this.getValue()[0].tocBool();
};
cArea.prototype.toString = function () {
    var _c;

    if ( this.getRange() ) {
        _c = this.getRange().getName();
    }
    else {
        _c = this._cells;
    }
    if ( _c.indexOf( ":" ) < 0 ) {
        _c = _c + ":" + _c;
    }
    return _c;
};
cArea.prototype.setRange = function ( cell ) {
    this._cells = this.value = cell;
    this.range = this.ws.getRange2( cell );
    this._valid = this.range ? true : false;
};
cArea.prototype.getWS = function () {
    return this.ws;
};
cArea.prototype.getBBox = function () {
    return this.getRange().getBBox();
};
cArea.prototype.getBBox0 = function () {
    return this.getRange().getBBox0();
};
cArea.prototype.cross = function ( arg ) {
    var r = this.getRange(), cross;
    if ( !r ) {
        return new cError( cErrorType.wrong_name );
    }
    cross = r.cross( arg );
    if ( cross ) {
        if ( cross.r != undefined ) {
            return this.getValue2( cross.r - this.getBBox().r1, 0 );
        }
        else if ( cross.c != undefined ) {
            return this.getValue2( 0, cross.c - this.getBBox().c1 );
        }
    }
    return new cError( cErrorType.wrong_value_type );
};
cArea.prototype.isValid = function () {
    var r = this.getRange();
    return !!r;
};
cArea.prototype.countCells = function () {
    var r = this.getRange(), bbox = r.bbox,
        count = (Math.abs( bbox.c1 - bbox.c2 ) + 1) * (Math.abs( bbox.r1 - bbox.r2 ) + 1);
    r._foreachNoEmpty( function () {
        count--;
    } );
    return new cNumber( count );
};
cArea.prototype.foreach = function ( action ) {
    var r = this.getRange();
    if ( r ) {
        r._foreach2( action );
    }
};
cArea.prototype._parseCellValue = function ( cell ) {
    var result, cellType, cellValue;
    if ( cell ) {
        cellType = cell.getType();
        cellValue = cell.getValueWithoutFormat();
        if ( cellType === CellValueType.Number ) {
            result = cell.isEmptyTextString() ? new cEmpty() : new cNumber( cellValue );
        }
        else if ( cellType === CellValueType.Bool ) {
            result = new cBool( cellValue );
        }
        else if ( cellType === CellValueType.Error ) {
            result = new cError( cellValue );
        }
        else if ( cellType === CellValueType.String ) {
            result = new cString( cellValue );
        }
        else {
            result = cell.isEmptyTextString() ? checkTypeCell( "" + cellValue ) : new cNumber( cellValue );
        }
    }
    else {
        result = new cEmpty();
    }
    return result;
};
cArea.prototype.foreach2 = function ( action ) {
    var t = this, r = this.getRange();
    if ( r ) {
        r._foreach2( function ( cell ) {
            action( t._parseCellValue( cell ), cell );
        } );
    }
};
cArea.prototype.getMatrix = function () {
    var t = this, arr = [], r = this.getRange();
    r._foreach2( function ( cell, i, j, r1, c1 ) {
        if ( !arr[i - r1] )
            arr[i - r1] = [];
        arr[i - r1][j - c1] = t._parseCellValue( cell );
    } );
    return arr;
};
cArea.prototype.getRefMatrix = function () {
    var t = this, arr = [], r = this.getRange();
    r._foreach2( function ( cell, i, j, r1, c1 ) {
        if ( !arr[i - r1] )
            arr[i - r1] = [];
        if (cell)
        arr[i - r1][j - c1] = new cRef( cell.getName(), t.ws );
        else
            arr[i - r1][j - c1] = new cRef( t.ws._getCell( i, j ).getName(), t.ws );
    } );
    return arr;
};
cArea.prototype.index = function ( r, c ) {
    var bbox = this.getBBox0();
    bbox.normalize();
    var box = {c1: 1, c2: bbox.c2 - bbox.c1 + 1, r1: 1, r2: bbox.r2 - bbox.r1 + 1};

    if ( r < box.r1 || r > box.r2 || c < box.c1 || c > box.c2 ) {
        return new cError( cErrorType.bad_reference );
    }
};

/** @constructor */
function cArea3D( val, wsFrom, wsTo, wb ) {/*Area3D means "Sheat1!A1:E5" for example*/
    this.constructor.call( this, val, cElementType.cellsRange3D );

    this._wb = wb;
    this._cells = val;
    this.isAbsolute = false;
    this.isAbsoluteCol1 = false;
    this.isAbsoluteRow1 = false;
    this.isAbsoluteCol2 = false;
    this.isAbsoluteRow2 = false;
    this.wsFrom = this._wb.getWorksheetByName( wsFrom ).getId();
    this.wsTo = this._wb.getWorksheetByName( wsTo ).getId();
}

cArea3D.prototype = Object.create( cBaseType.prototype );
cArea3D.prototype.clone = function () {
    var wsFrom = this._wb.getWorksheetById( this.wsFrom ).getName(),
        wsTo = this._wb.getWorksheetById( this.wsTo ).getName(),
        oRes = new cArea3D( this._cells, wsFrom, wsTo, this._wb );
//	cBaseType.prototype.cloneTo.call( this, oRes );
    this.constructor.prototype.cloneTo.call( this, oRes );
    oRes.isAbsolute = this.isAbsolute;
    oRes.isAbsoluteCol1 = this.isAbsoluteCol1;
    oRes.isAbsoluteRow1 = this.isAbsoluteRow1;
    oRes.isAbsoluteCol2 = this.isAbsoluteCol2;
    oRes.isAbsoluteRow2 = this.isAbsoluteRow2;
    return oRes;
};
cArea3D.prototype.wsRange = function () {
    if ( !this.wsTo ) {
        this.wsTo = this.wsFrom;
    }
    var wsF = this._wb.getWorksheetById( this.wsFrom ).getIndex(), wsL = this._wb.getWorksheetById( this.wsTo ).getIndex(), r = [];
    for ( var i = wsF; i <= wsL; i++ ) {
        r.push( this._wb.getWorksheet( i ) );
    }
    return r;
};
cArea3D.prototype.range = function ( wsRange ) {
    if ( !wsRange ) {
        return [null];
    }
    var r = [];
    for ( var i = 0; i < wsRange.length; i++ ) {
        if ( !wsRange[i] ) {
            r.push( null );
        }
        else {
            r.push( wsRange[i].getRange2( this._cells ) );
        }
    }
    return r;
};
cArea3D.prototype.getRange = function () {
    return this.range( this.wsRange() );
};
cArea3D.prototype.getValue = function () {
    var _wsA = this.wsRange();
    var _val = [];
    if ( _wsA.length < 1 ) {
        _val.push( new cError( cErrorType.bad_reference ) );
        return _val;
    }
    for ( var i = 0; i < _wsA.length; i++ ) {
        if ( !_wsA[i] ) {
            _val.push( new cError( cErrorType.bad_reference ) );
            return _val;
        }

    }
    var _r = this.range( _wsA );
    for ( var i = 0; i < _r.length; i++ ) {
        if ( !_r[i] ) {
            _val.push( new cError( cErrorType.bad_reference ) );
            return _val;
        }
        _r[i]._foreachNoEmpty( function ( _cell ) {
            var cellType = _cell.getType();
            switch ( cellType ) {
                case CellValueType.Number:
                    _cell.getValueWithoutFormat() === "" ? _val.push( new cEmpty() ) : _val.push( new cNumber( _cell.getValueWithoutFormat() ) );
                    break;
                case CellValueType.Bool:
                    _val.push( new cBool( _cell.getValueWithoutFormat() ) );
                    break;
                case CellValueType.Error:
                    _val.push( new cError( _cell.getValueWithoutFormat() ) );
                    break;
                case CellValueType.String:
                    _val.push( new cString( _cell.getValueWithoutFormat() ) );
                    break;
                default:
                {
                    if ( _cell.getValueWithoutFormat() && _cell.getValueWithoutFormat() !== "" ) {
                        _val.push( new cNumber( _cell.getValueWithoutFormat() ) );
                    }
                    else {
                        _val.push( checkTypeCell( "" + _cell.getValueWithoutFormat() ) );
                    }
                }
            }

        } );
    }
    return _val;
};
cArea3D.prototype.getValue2 = function ( cell ) {
    var _wsA = this.wsRange(), _val = [], cellType, _r;
    if ( _wsA.length < 1 ) {
        _val.push( new cError( cErrorType.bad_reference ) );
        return _val;
    }
    for ( var i = 0; i < _wsA.length; i++ ) {
        if ( !_wsA[i] ) {
            _val.push( new cError( cErrorType.bad_reference ) );
            return _val;
        }

    }
    _r = this.range( _wsA );
    if ( !_r[0] ) {
        _val.push( new cError( cErrorType.bad_reference ) );
        return _val;
    }
    _r[0]._foreachNoEmpty( function ( _cell ) {
        if ( cell.getID() === _cell.getName() ) {
            var cellType = _cell.getType();
            switch ( cellType ) {
                case CellValueType.Number:
                {
                    _cell.getValueWithoutFormat() === "" ? _val.push( new cEmpty() ) : _val.push( new cNumber( _cell.getValueWithoutFormat() ) );
                    break;
                }
                case CellValueType.Bool:
                {
                    _val.push( new cBool( _cell.getValueWithoutFormat() ) );
                    break;
                }
                case CellValueType.Error:
                {
                    _val.push( new cError( _cell.getValueWithoutFormat() ) );
                    break;
                }
                case CellValueType.String:
                {
                    _val.push( new cString( _cell.getValueWithoutFormat() ) );
                    break
                }
                default:
                {
                    if ( _cell.getValueWithoutFormat() && _cell.getValueWithoutFormat() !== "" ) {
                        _val.push( new cNumber( _cell.getValueWithoutFormat() ) );
                    }
                    else {
                        _val.push( checkTypeCell( "" + _cell.getValueWithoutFormat() ) );
                    }
                }
            }
        }
    } );

    if ( _val[0] === undefined || _val[0] === null ) {
        return new cEmpty();
    }
    else {
        return _val[0];
    }
};
cArea3D.prototype.changeSheet = function ( lastName, newName ) {
    if ( this.wsFrom === this._wb.getWorksheetByName( lastName ).getId() && this.wsTo === this._wb.getWorksheetByName( lastName ).getId() ) {
        this.wsFrom = this.wsTo = this._wb.getWorksheetByName( newName ).getId();
    }
    else if ( this.wsFrom === this._wb.getWorksheetByName( lastName ).getId() ) {
        this.wsFrom = this._wb.getWorksheetByName( newName ).getId();
    }
    else if ( this.wsTo === this._wb.getWorksheetByName( lastName ).getId() ) {
        this.wsTo = this._wb.getWorksheetByName( newName ).getId();
    }
};
cArea3D.prototype.toString = function () {
    var wsFrom = this._wb.getWorksheetById( this.wsFrom ).getName(),
        wsTo = this._wb.getWorksheetById( this.wsTo ).getName(),
        name = Asc.g_oRangeCache.getActiveRange( this._cells );
    name = name && name.getName ? name.getName() : this._cells;

    return parserHelp.get3DRef( wsFrom !== wsTo ? wsFrom + ':' + wsTo : wsFrom, name );
};
cArea3D.prototype.tocNumber = function () {
    return this.getValue()[0].tocNumber();
};
cArea3D.prototype.tocString = function () {
    return this.getValue()[0].tocString();
};
cArea3D.prototype.tocBool = function () {
    return this.getValue()[0].tocBool();
};
cArea3D.prototype.tocArea = function () {
    var wsR = this.wsRange();
    if ( wsR.length == 1 ) {
        return new cArea( this._cells, wsR[0] );
    }
    return false;
};
cArea3D.prototype.getWS = function () {
    return this.wsRange()[0];
};
cArea3D.prototype.cross = function ( arg, wsID ) {
    if ( this.wsFrom !== this.wsTo ) {
        return new cError( cErrorType.wrong_value_type );
    }
    if ( this.wsFrom !== wsID ) {
        return new cError( cErrorType.wrong_value_type );
    }
    var r = this.getRange();
    if ( !r ) {
        return new cError( cErrorType.wrong_name );
    }
    var cross = r[0].cross( arg );
    if ( cross ) {
        if ( cross.r != undefined ) {
            return this.getValue2( new CellAddress( cross.r, this.getBBox().c1 ) );
        }
        else if ( cross.c != undefined ) {
            return this.getValue2( new CellAddress( this.getBBox().r1, cross.c ) );
        }
        else {
            return new cError( cErrorType.wrong_value_type );
        }
    }
    else {
        return new cError( cErrorType.wrong_value_type );
    }
};
cArea3D.prototype.getBBox = function () {
    return this.getRange()[0].getBBox();
};
cArea3D.prototype.getBBox0 = function () {
    return this.getRange()[0].getBBox0();
};
cArea3D.prototype.isValid = function () {
    var r = this.getRange();
    for ( var i = 0; i < r.length; i++ ) {
        if ( !r[i] ) {
            return false;
        }
    }
    return true;
};
cArea3D.prototype.countCells = function () {
    var _wsA = this.wsRange();
    var _val = [];
    if ( _wsA.length < 1 ) {
        _val.push( new cError( cErrorType.bad_reference ) );
        return _val;
    }
    for ( var i = 0; i < _wsA.length; i++ ) {
        if ( !_wsA[i] ) {
            _val.push( new cError( cErrorType.bad_reference ) );
            return _val;
        }

    }
    var _r = this.range( _wsA ),
        bbox = _r[0].bbox,
        count = (Math.abs( bbox.c1 - bbox.c2 ) + 1) * (Math.abs( bbox.r1 - bbox.r2 ) + 1);
    count = _r.length * count;
    for ( var i = 0; i < _r.length; i++ ) {
        _r[i]._foreachNoEmpty( function ( _cell ) {

            if ( _cell.getType() === CellValueType.Number && _cell.getValueWithoutFormat() === "" ) {
                return null;
            }

            count--;
            return !null;
        } );
    }
    return new cNumber( count );
};
cArea3D.prototype.getMatrix = function () {
    var arr = [],
        r = this.getRange(), res;
    for ( var k = 0; k < r.length; k++ ) {
        arr[k] = [];
        r[k]._foreach2( function ( cell, i, j, r1, c1 ) {
            if ( !arr[k][i - r1] ) {
                arr[k][i - r1] = [];
            }
            if ( cell ) {
                var cellType = cell.getType();
                if ( cellType === CellValueType.Number ) {
                    res = cell.isEmptyTextString() ? new cEmpty() : new cNumber( cell.getValueWithoutFormat() );
                }
                else if ( cellType === CellValueType.Bool ) {
                    res = new cBool( cell.getValueWithoutFormat() );
                }
                else if ( cellType === CellValueType.Error ) {
                    res = new cError( cell.getValueWithoutFormat() );
                }
                else if ( cellType === CellValueType.String ) {
                    res = new cString( cell.getValueWithoutFormat() );
                }
                else {
                    if ( cell.isEmptyTextString() ) {
                        res = new cNumber( cell.getValueWithoutFormat() );
                    }
                    else {
                        res = checkTypeCell( "" + cell.getValueWithoutFormat() );
                    }
                }
            }
            else {
                res = new cEmpty();
            }

            arr[k][i - r1][j - c1] = res;
        } );
    }
    return arr;
};
cArea3D.prototype.foreach2 = function ( action ) {
    var _wsA = this.wsRange();
    if ( _wsA.length >= 1 ) {
        var _r = this.range( _wsA );
        for ( var i = 0; i < _r.length; i++ ) {
            if ( _r[i] ) {
                _r[i]._foreach2( function ( _cell ) {
                    var val;
                    if ( _cell ) {
                        var cellType = _cell.getType();
                        switch ( cellType ) {
                            case CellValueType.Number:
                            {
                                if ( _cell.getValueWithoutFormat() === "" ) {
                                    val = new cEmpty();
                                }
                                else {
                                    val = new cNumber( _cell.getValueWithoutFormat() );
                                }
                                break;
                            }
                            case CellValueType.Bool:
                            {
                                val = new cBool( _cell.getValueWithoutFormat() );
                                break;
                            }
                            case CellValueType.Error:
                            {
                                val = new cError( _cell.getValueWithoutFormat() );
                                break;
                            }
                            case CellValueType.String:
                            {
                                val = new cString( _cell.getValueWithoutFormat() );
                                break;
                            }
                            default:
                            {
                                if ( _cell.getValueWithoutFormat() && _cell.getValueWithoutFormat() !== "" ) {
                                    val = new cNumber( _cell.getValueWithoutFormat() );
                                }
                                else {
                                    val = checkTypeCell( "" + _cell.getValueWithoutFormat() );
                                }
                                break;
                            }
                        }
                    }
                    else {
                        val = new cEmpty();
                    }
                    action( val );
                } );
            }
        }
    }
};
cArea3D.prototype.isSingleSheet = function(){return this.wsFrom == this.wsTo;};

/** @constructor */
function cRef( val, ws ) {/*Ref means A1 for example*/
    this.constructor.call( this, val, cElementType.cell );

    this._cells = val;
    this.ws = ws;
    this.wb = this._wb = ws.workbook;
    this.isAbsolute = false;
    this.isAbsoluteCol1 = false;
    this.isAbsoluteRow1 = false;
    var ca = g_oCellAddressUtils.getCellAddress( val.replace( rx_space_g, "" ) );
    this.range = null;
    this._valid = ca.isValid();
    if ( this._valid ) {
        this.range = this.ws.getRange3( ca.getRow0(), ca.getCol0(), ca.getRow0(), ca.getCol0() );
    }
    else {
        this.range = this.ws.getRange3( 0, 0, 0, 0 );
    }
}

cRef.prototype = Object.create( cBaseType.prototype );
cRef.prototype.clone = function () {
    var oRes = new cRef( this._cells, this.ws );
//	cBaseType.prototype.cloneTo.call( this, oRes );
    this.constructor.prototype.cloneTo.call( this, oRes );
    oRes.isAbsolute = this.isAbsolute;
    oRes.isAbsoluteCol1 = this.isAbsoluteCol1;
    oRes.isAbsoluteRow1 = this.isAbsoluteRow1;
    return oRes;
};
cRef.prototype.getWsId = function () {
    return this.ws.Id;
};
cRef.prototype.getValue = function () {
    if ( !this._valid ) {
        return new cError( cErrorType.bad_reference );
    }
    var cellType = this.range.getType(), v, res;

    if ( cellType === CellValueType.Number ) {
        v = this.range.getValueWithoutFormat();
        if ( v === "" ) {
            res = new cEmpty();
        }
        else {
            res = new cNumber( "" + v );
        }
    }
    else if ( cellType === CellValueType.Bool ) {
        res = new cBool( "" + this.range.getValueWithoutFormat() );
    }
    else if ( cellType === CellValueType.Error ) {
        res = new cError( "" + this.range.getValueWithoutFormat() );
    }
    else if ( cellType === CellValueType.String ) {
        res = new cString( this.range.getValueWithoutFormat() );
    }
    else {
        res = checkTypeCell( "" + this.range.getValueWithoutFormat() );
    }

    return res;
};
cRef.prototype.tocNumber = function () {
    return this.getValue().tocNumber();
};
cRef.prototype.tocString = function () {
    return this.getValue().tocString();
    /* new cString(""+this.range.getValueWithFormat()); */
};
cRef.prototype.tocBool = function () {
    return this.getValue().tocBool();
};
cRef.prototype.tryConvert = function () {
    return this.getValue();
};
cRef.prototype.toString = function () {
    return this._cells;
};
cRef.prototype.getRange = function () {
    return this.range;
};
cRef.prototype.getWS = function () {
    return this.ws;
};
cRef.prototype.isValid = function () {
    return this._valid;
};
cRef.prototype.getMatrix = function () {
    return [
        [this.getValue()]
    ];
}
cRef.prototype.getBBox0 = function () {
    return this.getRange().getBBox0();
};

/** @constructor */
function cRef3D( val, _wsFrom, wb ) {/*Ref means Sheat1!A1 for example*/
    this.constructor.call( this, val, cElementType.cell3D );
    this.wb = this._wb = wb;
    this._cells = val;
    this.isAbsolute = false;
    this.isAbsoluteCol1 = false;
    this.isAbsoluteRow1 = false;
    this.ws = this._wb.getWorksheetByName( _wsFrom );
    this.range = null;
}

cRef3D.prototype = Object.create( cBaseType.prototype );
cRef3D.prototype.clone = function () {
    var oRes = new cRef3D( this._cells, this.ws.getName(), this._wb );
//	cBaseType.prototype.cloneTo.call( this, oRes );
    this.constructor.prototype.cloneTo.call( this, oRes );
    oRes.isAbsolute = this.isAbsolute;
    oRes.isAbsoluteCol1 = this.isAbsoluteCol1;
    oRes.isAbsoluteRow1 = this.isAbsoluteRow1;
    return oRes;
};
cRef3D.prototype.getWsId = function () {
    return this.ws.Id;
};
cRef3D.prototype.getRange = function () {
    if ( this.ws ) {
        if ( this.range ) {
            return this.range;
        }
        return this.range = this.ws.getRange2( this._cells );
    }
    else {
        return this.range = null;
    }
};
cRef3D.prototype.isValid = function () {
    return !!this.getRange();
};
cRef3D.prototype.getValue = function () {
    var _r = this.getRange();
    if ( !_r ) {
        return new cError( cErrorType.bad_reference );
    }
    var cellType = _r.getType();
    if ( cellType === CellValueType.Number ) {
        var v = _r.getValueWithoutFormat();
        if ( v === "" ) {
            return new cEmpty();
        }
        else {
            return new cNumber( "" + v );
        }
    }
    else if ( cellType === CellValueType.String ) {
        return new cString( "" + _r.getValueWithoutFormat() );
    }
    else if ( cellType === CellValueType.Bool ) {
        return new cBool( "" + _r.getValueWithoutFormat() );
    }
    else if ( cellType === CellValueType.Error ) {
        return new cError( "" + _r.getValueWithoutFormat() );
    }
    else {
        return checkTypeCell( "" + _r.getValueWithoutFormat() );
    }
};
cRef3D.prototype.tocBool = function () {
    return this.getValue().tocBool();
};
cRef3D.prototype.tocNumber = function () {
    return this.getValue().tocNumber();
};
cRef3D.prototype.tocString = function () {
    return this.getValue().tocString();
};
cRef3D.prototype.tryConvert = function () {
    return this.getValue();
};
cRef3D.prototype.changeSheet = function ( lastName, newName ) {
    if ( this.ws.getName() === lastName ) {
        this.ws = this._wb.getWorksheetByName( newName );
    }
};
cRef3D.prototype.toString = function () {
    return parserHelp.get3DRef( this.ws.getName(), this._cells );
};
cRef3D.prototype.getWS = function () {
    return this.ws;
};
cRef3D.prototype.getBBox0 = function () {
    var range = this.getRange();
    if ( range ) {
        return range.getBBox0();
    }
    return null;
};

/** @constructor */
function cEmpty() {
    this.constructor.call( this, "", cElementType.empty );
}

cEmpty.prototype = Object.create( cBaseType.prototype );
cEmpty.prototype.tocNumber = function () {
    return new cNumber( 0 );
};
cEmpty.prototype.tocBool = function () {
    return new cBool( false );
};
cEmpty.prototype.tocString = function () {
    return new cString( "" );
};
cEmpty.prototype.toString = function () {
    return "";
};

/** @constructor */
function cName( val, wb, ws ) {
    this.constructor.call( this, val, cElementType.name );
    this.regSpace = /\$/g;
    this.wb = wb;
    this.ws = ws;
    this.defName = this.wb.getDefinesNames( this.value, this.ws ? this.ws.getId() : null );
    /*if ( this.defName && this.defName.Ref ) {
     this.ref = new parserFormula( this.defName.Ref, "", this.ws );
     this.ref.parse();
     }*/
}

cName.prototype = Object.create( cBaseType.prototype );
cName.prototype.reInit = function () {
    this.defName = this.wb.getDefinesNames( this.value, this.ws.getId() );
    this.defName.parsedRef = new parserFormula( this.defName.Ref, "", this.ws );
    this.defName.parsedRef.parse();
};
cName.prototype.toRef = function () {

    if ( !this.defName || !this.defName.Ref ) {
        return new cError( cErrorType.wrong_name );
    }

    var _3DRefTmp, ref = this.defName.Ref, _wsFrom, _wsTo;

    if ( ref && (_3DRefTmp = parserHelp.is3DRef( ref, 0 ))[0] ) {
        _wsFrom = _3DRefTmp[1];
        _wsTo = ( (_3DRefTmp[2] !== null) && (_3DRefTmp[2] !== undefined) ) ? _3DRefTmp[2] : _wsFrom;
        if ( parserHelp.isArea( ref, ref.indexOf( "!" ) + 1 ) ) {
            if ( _wsFrom === _wsTo ) {
                return new cArea( parserHelp.operand_str, this.wb.getWorksheetByName( _wsFrom ) );
            }
            else {
                return new cArea3D( parserHelp.operand_str, _wsFrom, _wsTo, this.wb );
            }
        }
        else if ( parserHelp.isRef( ref, ref.indexOf( "!" ) + 1 ) ) {
            return new cRef3D( parserHelp.operand_str, _wsFrom, this.wb );
        }
    }
    return new cError( cErrorType.wrong_name );
};
cName.prototype.toString = function () {
    if ( this.defName ) {
        return this.defName.Name;
    }
    else {
        return this.value;
    }
};
cName.prototype.getValue = function () {

    if ( !this.defName ) {
        return new cError( cErrorType.wrong_name );
    }

    return this.defName.parsedRef.calculate( this );
};
cName.prototype.getRef = function () {

};
cName.prototype.reParse = function () {
    var dN = this.wb.getDefinesNames( this.defName.Name, this.ws.getId() );
    if ( dN ) {
        this.defName.parsedRef = new parserFormula( dN.Ref, "", this.ws );
        this.defName.parsedRef.parse();
    }
    else {
        this.defName.parsedRef = null;
    }
};
cName.prototype.addDefinedNameNode = function ( nameReParse ) {
    if ( !this.defName || !this.defName.Ref ) {
        return this.wb.dependencyFormulas.addDefinedNameNode( this.value, null );
    }
    return this.wb.getDefinesNames( this.defName.Name, this.ws.getId() );
};
cName.prototype.Calculate = function () {
    if ( !this.defName || !this.defName.Ref ) {
        return new cError( cErrorType.wrong_name );
    }

    if ( !this.defName.parsedRef ) {
        return new cError( cErrorType.wrong_name );
    }

    return this.defName.parsedRef.calculate( this );

};

/** @constructor */
function cStrucTable( val, wb, ws, cell ) {
    this.constructor.call( this, val[0], cElementType.table );
    this.wb = wb;
    this.ws = ws;
    this.tableName = val['tableName'];
	this.table = this.wb.getDefinesNames( this.tableName, this.ws ? this.ws.getId() : null );
    this.reservedColumn = null;
    this.tableData = null;

    var ret = this.createArea( val, cell );
	return (ret && ret.type != cElementType.error) ? this : ret;

}

cStrucTable.prototype = Object.create( cBaseType.prototype );
cStrucTable.prototype.addDefinedNameNode = function ( nameReParse ) {
	if ( !this.table || !this.table.Ref ) {
		return this.wb.dependencyFormulas.addDefinedNameNode( this.value, null );
	}
	return this.wb.getDefinesNames( this.table.Name, this.ws.getId() );
};
cStrucTable.prototype.toRef = function () {
	if ( !this.table || !this.table.Ref ) {
		return new cError( cErrorType.wrong_name );
	}
    return this.area ? this.area : new cError( cErrorType.bad_reference );
};
cStrucTable.prototype.toString = function () {
	var tblStr, columns_1, columns_2;
	if( !this.table ){
		return this.value;
	}
	tblStr = this.table.Name;
	this.columnName ? tblStr += "[%1]" : null;
	if ( this.oneColumn ) {

		columns_1= this.wb.getTableNameColumnByIndex( this.tableName, this.oneColumnIndex.index );
		if( columns_1 ){
			this.oneColumn = columns_1.columnName;
		}

		return tblStr.replace( "%1", this.oneColumn.replace(/#/g,"'#")  );
	}
	if ( this.columnRange ) {
		columns_1 = this.wb.getTableNameColumnByIndex( this.tableName, this.colStartIndex.index );
		columns_2 = this.wb.getTableNameColumnByIndex( this.tableName, this.colEndIndex.index );
		if(columns_1){
			this.colStart = columns_1.columnName
		}
		if(columns_2){
			this.colEnd = columns_2.columnName
		}
		return tblStr.replace( "%1", "[" + this.colStart.replace(/#/g,"'#") + "]:[" + this.colEnd.replace(/#/g,"'#") + "]" );
	}
	if ( this.reservedColumn ) {
		return tblStr.replace( "%1", this.buildLocalTableString(this.reservedColumnIndex,false) );
	}
	if ( this.hdt ) {
		var re = /\[(.*?)\]/ig, m, data = "",i=0;
		while ( null !== (m = re.exec( this.hdt )) ) {

			data += "[" + this.buildLocalTableString(this.hdtIndexes[i],false) + "]" + functionArgumentSeparatorDef;
		}
		data = data.substr( 0, data.length - 1 );
		if ( this.hdtcstart ) {

			columns_1 = this.wb.getTableNameColumnByIndex( this.tableName, this.hdtcstartIndex.index );
			if( columns_1 ){
				this.hdtcstart = columns_1.columnName;
			}

			data += functionArgumentSeparatorDef + "[" + this.hdtcstart.replace(/#/g,"'#") + "]"
		}
		if ( this.hdtcend ) {

			columns_2 = this.wb.getTableNameColumnByIndex( this.tableName, this.hdtcendIndex.index );
			if( columns_2 ){
				this.hdtcend = columns_2.columnName;
			}

			data += ":[" + this.hdtcend.replace(/#/g,"'#") + "]"
		}
		return tblStr.replace( "%1", data );
	}
	return tblStr.replace( "%1", "" );
};
cStrucTable.prototype.toLocaleString = function () {
	var tblStr, columns_1, columns_2;
	if( !this.table ){
		return this.value;
	}
	tblStr = this.table.Name;
	this.columnName ? tblStr += "[%1]" : null;
	if ( this.oneColumn ) {

		columns_1= this.wb.getTableNameColumnByIndex( this.tableName, this.oneColumnIndex.index );
		if( columns_1 ){
			this.oneColumn = columns_1.columnName;
		}

		return tblStr.replace( "%1", this.oneColumn.replace(/#/g,"'#")  );
	}
	if ( this.columnRange ) {
		columns_1 = this.wb.getTableNameColumnByIndex( this.tableName, this.colStartIndex.index );
		columns_2 = this.wb.getTableNameColumnByIndex( this.tableName, this.colEndIndex.index );
		if(columns_1){
			this.colStart = columns_1.columnName
		}
		if(columns_2){
			this.colEnd = columns_2.columnName
		}
		return tblStr.replace( "%1", "[" + this.colStart.replace(/#/g,"'#") + "]:[" + this.colEnd.replace(/#/g,"'#") + "]" );
	}
	if ( this.reservedColumn ) {
		return tblStr.replace( "%1", this.buildLocalTableString(this.reservedColumnIndex,true) );
	}
	if ( this.hdt ) {
		var re = /\[(.*?)\]/ig, m, data = "",i=0;
		while ( null !== (m = re.exec( this.hdt )) ) {

			data += "[" + this.buildLocalTableString(this.hdtIndexes[i],true) + "]" + functionArgumentSeparatorDef;
		}
		data = data.substr( 0, data.length - 1 );
		if ( this.hdtcstart ) {

			columns_1 = this.wb.getTableNameColumnByIndex( this.tableName, this.hdtcstartIndex.index );
			if( columns_1 ){
				this.hdtcstart = columns_1.columnName;
			}

			data += functionArgumentSeparatorDef + "[" + this.hdtcstart.replace(/#/g,"'#") + "]"
		}
		if ( this.hdtcend ) {

			columns_2 = this.wb.getTableNameColumnByIndex( this.tableName, this.hdtcendIndex.index );
			if( columns_2 ){
				this.hdtcend = columns_2.columnName;
			}

			data += ":[" + this.hdtcend.replace(/#/g,"'#") + "]"
		}
		return tblStr.replace( "%1", data );
	}
	return tblStr.replace( "%1", "" );
};
cStrucTable.prototype.changeArea = function ( offset ) {
    return this.area;
};
cStrucTable.prototype.createArea = function ( val, cell ) {
    this.columnName  = val['columnName'];

    var paramObj = {param: null, startCol: null, endCol: null, cell: cell.bbox, includeColumnHeader:false};

    function getColumnType( value ) {
        var res;
        switch ( value.toLowerCase() ) {
            case "#"+cStrucTableLocalColumns['a'].toLocaleLowerCase():
            case cStrucTableReservedWords.all.toLocaleLowerCase():
                res = g_nFormulaTablePartInfo.all;
                break;
			case "#"+cStrucTableLocalColumns['d'].toLocaleLowerCase():
            case cStrucTableReservedWords.data.toLocaleLowerCase():
                res = g_nFormulaTablePartInfo.data;
                break;
			case "#"+cStrucTableLocalColumns['h'].toLocaleLowerCase():
            case cStrucTableReservedWords.headers.toLocaleLowerCase():
                res = g_nFormulaTablePartInfo.headers;
                break;
			case "#"+cStrucTableLocalColumns['t'].toLocaleLowerCase():
            case cStrucTableReservedWords.totals.toLocaleLowerCase():
                res = g_nFormulaTablePartInfo.totals;
                break;
			case "#"+cStrucTableLocalColumns['tr'].toLocaleLowerCase():
            case cStrucTableReservedWords.at.toLocaleLowerCase():
            case cStrucTableReservedWords.thisrow.toLocaleLowerCase():
                res = g_nFormulaTablePartInfo.thisRow;
                break;
            default:
                res = g_nFormulaTablePartInfo.data;
                break;
        }
        return res;
    }

    if ( val['oneColumn'] || val['columnRange'] ) {

        this.oneColumn = val['oneColumn'];
        this.columnRange = val['columnRange'];

        paramObj.param = g_nFormulaTablePartInfo.columns;
        if ( val['columnRange'] ) {
            this.columnRange = val['columnRange'];
            paramObj.startCol = this.colStart = val['colStart'].replace(/'#/g,"#");
            paramObj.endCol = this.colEnd = val['colEnd'].replace(/'#/g,"#");
			if( !this.colEnd )
				this.colEnd = this.colStart;

			this.colStartIndex = this.wb.getTableIndexColumnByName( this.tableName, this.colStart );
			this.colEndIndex = this.wb.getTableIndexColumnByName( this.tableName, this.colEnd );
			if( !this.colStartIndex && !this.colEndIndex ){
				return new cError( cErrorType.bad_reference );
			}
        }
        else {
            paramObj.startCol = this.oneColumn = val['oneColumn'].replace(/'#/g,"#");
			this.oneColumnIndex = this.wb.getTableIndexColumnByName( this.tableName, this.oneColumn );
			if( !this.oneColumnIndex ){
				return new cError( cErrorType.bad_reference );
			}
        }

        this.tableData = this.wb.getTableRangeForFormula( this.tableName, paramObj );

        if ( !this.tableData ) {
            this.area = new cError( cErrorType.bad_reference );
            return;
        }

        this.area = this.tableData.range.isOneCell() ?
            new cRef3D( this.tableData.range.getAbsName(), this.wb.getWorksheetById( this.tableData.wsID ).getName(), this.wb ):
            new cArea3D( this.tableData.range.getAbsName(), this.wb.getWorksheetById( this.tableData.wsID ).getName(), this.wb.getWorksheetById( this.tableData.wsID ).getName(), this.wb );
    }
    else if ( val['reservedColumn'] || !val['columnName'] ) {
		this.reservedColumn = val['reservedColumn'] || "";
		this.reservedColumnIndex = paramObj.param = getColumnType( this.reservedColumn );

        this.tableData = this.wb.getTableRangeForFormula( this.tableName, paramObj );
        if ( !this.tableData ) {
            this.area = new cError( cErrorType.bad_reference );
            return;
        }

		this.area = this.tableData.range.isOneCell() ?
            new cRef3D( this.tableData.range.getAbsName(), this.wb.getWorksheetById( this.tableData.wsID ).getName(), this.wb ):
            new cArea3D( this.tableData.range.getAbsName(), this.wb.getWorksheetById( this.tableData.wsID ).getName(), this.wb.getWorksheetById( this.tableData.wsID ).getName(), this.wb );
    }
    else if ( val['hdtcc'] ) {
        this.hdt = val['hdt'];
		this.hdtIndexes = [];
		this.hdtcstart = val['hdtcstart'];
        this.hdtcend = val['hdtcend'];
        var re = /\[(.*?)\]/ig, m, data, range;
        while ( null !== (m = re.exec( this.hdt )) ) {
            paramObj.param = getColumnType( m[1] );
			this.hdtIndexes.push(paramObj.param);
            data = this.wb.getTableRangeForFormula( this.tableName, paramObj );

            if ( !data ) {
                this.area = new cError( cErrorType.bad_reference );
                return;
            }

            if ( range ) {
                range.union2( data.range );
            }
            else {
                range = data.range;
            }
        }

        if ( this.hdtcstart ) {
			this.hdtcstart = this.hdtcstart.replace(/'#/g,"#");
			paramObj.param = g_nFormulaTablePartInfo.columns;
            paramObj.startCol = this.hdtcstart;
            paramObj.endCol = null;
			this.hdtcstartIndex = this.wb.getTableIndexColumnByName( this.tableName, this.hdtcstart );

			if( !this.hdtcstartIndex ){
				return new cError( cErrorType.bad_reference );
			}

            if ( this.hdtcend ) {
				this.hdtcend = this.hdtcend.replace(/'#/g,"#");
                paramObj.endCol = this.hdtcend;
				this.hdtcendIndex = this.wb.getTableIndexColumnByName( this.tableName, this.hdtcend );

				if( !this.hdtcendIndex ){
					return new cError( cErrorType.bad_reference );
				}

            }

            paramObj.includeColumnHeader = true;
            data = this.wb.getTableRangeForFormula( this.tableName, paramObj );

            if ( !data ) {
                this.area = new cError( cErrorType.bad_reference );
                return;
            }

            if ( range ) {
                range = range.intersection( data.range );
            }
            else {
                range = data.range;
            }
        }

        this.tableData = data;
        this.tableData.range = range;

        this.area = range.isOneCell() ?
            new cRef3D( range.getAbsName(), this.wb.getWorksheetById( this.tableData.wsID ).getName(), this.wb ):
            new cArea3D( range.getAbsName(), this.wb.getWorksheetById( this.tableData.wsID ).getName(), this.wb.getWorksheetById( this.tableData.wsID ).getName(), this.wb );
    }

    !this.area ? this.area = new cError( cErrorType.bad_reference ) : null;
	return this.area;
};
cStrucTable.prototype.buildLocalTableString = function (reservedColumn,local) {

	switch(reservedColumn){
		case g_nFormulaTablePartInfo.all:{
			if(local)
				return "#"+cStrucTableLocalColumns['a'];
			return cStrucTableReservedWords.all;
			break;
		}
		case g_nFormulaTablePartInfo.data:{
			if(local)
				return "#"+cStrucTableLocalColumns['d'];
			return cStrucTableReservedWords.data;
			break;
		}
		case g_nFormulaTablePartInfo.headers:{
			if(local)
				return "#"+cStrucTableLocalColumns['h'];
			return cStrucTableReservedWords.headers;
			break;
		}
		case g_nFormulaTablePartInfo.totals:{
			if(local)
				return "#"+cStrucTableLocalColumns['t'];
			return cStrucTableReservedWords.totals;
			break;
		}
		case g_nFormulaTablePartInfo.thisRow:{
			if(local)
				return "#"+cStrucTableLocalColumns['tr'];
			return cStrucTableReservedWords.thisrow;
			break;
		}
	}
}

/** @constructor */
function cName3D( val, wsFrom, wb, ws ) {
	cName.call( this, val, wb, ws );
	this.type = cElementType.name3D;
	this.wsFrom = wsFrom;
}
cName3D.prototype = Object.create( cName.prototype );
cName3D.prototype.toString = function () {
	if ( this.defName ) {
		return parserHelp.getEscapeSheetName( this.ws.getName() ) + "!" + this.defName.Name;
	}
	else {
		return parserHelp.getEscapeSheetName( this.wsFrom ) + "!" + this.value;
	}
};

/** @constructor */
function cArray() {
    this.constructor.call( this, undefined, cElementType.array );
    this.array = [];
    this.rowCount = 0;
    this.countElementInRow = [];
    this.countElement = 0;
}

cArray.prototype = Object.create( cBaseType.prototype );
cArray.prototype.addRow = function () {
    this.array[this.array.length] = [];
    this.countElementInRow[this.rowCount++] = 0;
};
cArray.prototype.addElement = function ( element ) {
    if ( this.array.length === 0 ) {
        this.addRow();
    }
    var arr = this.array,
        subArr = arr[this.rowCount - 1];
    subArr[subArr.length] = element;
    this.countElementInRow[this.rowCount - 1]++;
    this.countElement++;
};
cArray.prototype.getRow = function ( rowIndex ) {
    if ( rowIndex < 0 || rowIndex > this.array.length - 1 ) {
        return null;
    }
    return this.array[rowIndex];
};
cArray.prototype.getCol = function ( colIndex ) {
    var col = [];
    for ( var i = 0; i < this.rowCount; i++ ) {
        col.push( this.array[i][colIndex] );
    }
    return col;
};
cArray.prototype.getElementRowCol = function ( row, col ) {
    if ( row > this.rowCount || col > this.getCountElementInRow() ) {
        return new cError( cErrorType.not_available );
    }
    return this.array[row][col];
};
cArray.prototype.getElement = function ( index ) {
    for ( var i = 0; i < this.rowCount; i++ ) {
        if ( index > this.countElementInRow[i].length ) {
            index -= this.countElementInRow[i].length;
        }
        else {
            return this.array[i][index];
        }
    }
    return null;
};
cArray.prototype.foreach = function ( action ) {
    if ( typeof (action) !== 'function' ) {
        return true;
    }
    for ( var ir = 0; ir < this.rowCount; ir++ ) {
        for ( var ic = 0; ic < this.countElementInRow[ir]; ic++ ) {
            if ( action.call( this, this.array[ir][ic], ir, ic ) ) {
                return true;
            }
        }
    }
    return undefined;
};
cArray.prototype.getCountElement = function () {
    return this.countElement;
};
cArray.prototype.getCountElementInRow = function () {
    return this.countElementInRow[0];
};
cArray.prototype.getRowCount = function () {
    return this.rowCount;
};
cArray.prototype.tocNumber = function () {
    var retArr = new cArray();
    for ( var ir = 0; ir < this.rowCount; ir++, retArr.addRow() ) {
        for ( var ic = 0; ic < this.countElementInRow[ir]; ic++ ) {
            retArr.addElement( this.array[ir][ic].tocNumber() );
        }
        if ( ir === this.rowCount - 1 ) {
            break;
        }
    }
    return retArr;
};
cArray.prototype.tocString = function () {
    var retArr = new cArray();
    for ( var ir = 0; ir < this.rowCount; ir++, retArr.addRow() ) {
        for ( var ic = 0; ic < this.countElementInRow[ir]; ic++ ) {
            retArr.addElement( this.array[ir][ic].tocString() );
        }
        if ( ir === this.rowCount - 1 ) {
            break;
        }
    }
    return retArr;
};
cArray.prototype.tocBool = function () {
    var retArr = new cArray();
    for ( var ir = 0; ir < this.rowCount; ir++, retArr.addRow() ) {
        for ( var ic = 0; ic < this.countElementInRow[ir]; ic++ ) {
            retArr.addElement( this.array[ir][ic].tocBool() );
        }
        if ( ir === this.rowCount - 1 ) {
            break;
        }
    }
    return retArr;
};
cArray.prototype.toString = function () {
    var ret = "";
    for ( var ir = 0; ir < this.rowCount; ir++, ret += arrayRowSeparatorDef ) {
        for ( var ic = 0; ic < this.countElementInRow[ir]; ic++, ret += arrayColSeparatorDef ) {
            if ( this.array[ir][ic] instanceof cString ) {
                ret += '"' + this.array[ir][ic].toString() + '"';
            }
            else {
                ret += this.array[ir][ic].toString() + "";
            }
        }
        if ( ret[ret.length - 1] === arrayColSeparatorDef ) {
            ret = ret.substring( 0, ret.length - 1 );
        }
    }
    if ( ret[ret.length - 1] === arrayRowSeparatorDef ) {
        ret = ret.substring( 0, ret.length - 1 );
    }
    return "{" + ret + "}";
};
cArray.prototype.toLocaleString = function ( digitDelim ) {
    var ret = "";
    for ( var ir = 0; ir < this.rowCount; ir++, ret += digitDelim ? arrayRowSeparator : arrayRowSeparatorDef ) {
        for ( var ic = 0; ic < this.countElementInRow[ir]; ic++, ret += digitDelim ? arrayColSeparator : arrayColSeparatorDef ) {
            if ( this.array[ir][ic] instanceof cString ) {
                ret += '"' + this.array[ir][ic].toLocaleString( digitDelim ) + '"';
            }
            else {
                ret += this.array[ir][ic].toLocaleString( digitDelim ) + "";
            }
        }
        if ( ret[ret.length - 1] === digitDelim ? arrayColSeparator : arrayColSeparatorDef ) {
            ret = ret.substring( 0, ret.length - 1 );
        }
    }
    if ( ret[ret.length - 1] === digitDelim ? arrayRowSeparator : arrayRowSeparatorDef ) {
        ret = ret.substring( 0, ret.length - 1 );
    }
    return "{" + ret + "}";
};
cArray.prototype.isValidArray = function () {
    if ( this.countElement < 1 ) {
        return false;
    }
    for ( var i = 0; i < this.rowCount - 1; i++ ) {
        if ( this.countElementInRow[i] - this.countElementInRow[i + 1] !== 0 ) {
            return false;
        }
    }
    return true;
};
cArray.prototype.getValue2 = function ( i, j ) {
    var result = this.array[i];
    return result ? result[j] : result;
};
cArray.prototype.getMatrix = function () {
    return this.array;
};
cArray.prototype.fillFromArray = function ( arr ) {
    this.array = arr;
    this.rowCount = arr.length;
    for ( var i = 0; i < arr.length; i++ ) {
        this.countElementInRow[i] = arr[i].length;
        this.countElement += arr[i].length;
    }
};
cArray.prototype.getElementByCell = function ( cellAddress ) {
    if ( this.cellAddress ){
        if( this.countElementInRow == 1 ){
            this.getElementRowCol( cellAddress.getRow0(), 0 );
        }
        if( this.rowCount == 1 ){
            this.getElementRowCol( 0, cellAddress.getCol0() );
        }
    }
    else{
        return this.getElement( 0 );
    }
};

/** @constructor */
function cUndefined() {
    this.value = undefined;
}
cUndefined.prototype = Object.create( cBaseType.prototype );

//функция для определения к какому типу относится значение val.
function checkTypeCell( val ) {
    if ( val === "" ) {
        return new cEmpty();
    }
    else if ( parseNum( val ) ) {
        return new cNumber( val - 0 );
    }
    else if ( parserHelp.isString( val, 0 ) ) {
        return new cString( parserHelp.operand_str );
    }
    else if ( parserHelp.isBoolean( val, 0 ) ) {
        return new cBool( parserHelp.operand_str );
    }
    else if ( parserHelp.isError( val, 0 ) ) {
        return new cError( parserHelp.operand_str );
    }
    else {
        return new cString( val );
    }
}

/*--------------------------------------------------------------------------*/
/*Base classes for operators & functions */
/** @constructor */
function cBaseOperator( name, priority, argumentCount ) {
    if ( name ) {
        this.name = name;
    }
    else {
        this.name = "";
    }
    if ( priority !== undefined ) {
        this.priority = priority;
    }
    else {
        this.priority = 10;
    }
    this.type = cElementType.operator;
    this.isRightAssociative = false;
    if ( argumentCount !== undefined ) {
        this.argumentsCurrent = argumentCount;
    }
    else {
        this.argumentsCurrent = 2;
    }
    this.value = null;
    this.formatType = {
        def       : -1, //подразумевается формат первой ячейки входящей в формулу.
        noneFormat: -2
    };
    this.numFormat = this.formatType.def;
}

cBaseOperator.prototype = {
    constructor    : cBaseOperator,
    getArguments   : function () {
        return this.argumentsCurrent;
    },
    toString       : function () {
        return this.name;
    },
    Calculate      : function () {
        return null;
    },
    Assemble       : function ( arg ) {
        var str = "";
        if ( this.argumentsCurrent === 2 ) {
            str = arg[0] + "" + this.name + "" + arg[1];
        }
        else {
            str = this.name + "" + arg[0];
        }
        return new cString( str );
    },
    Assemble2      : function ( arg, start, count ) {
        var str = "";
        if ( this.argumentsCurrent === 2 ) {
            str += arg[start + count - 2] + this.name + arg[start + count - 1];
        }
        else {
            str += this.name + arg[start];
        }
        return new cString( str );
    },
    Assemble2Locale: function ( arg, start, count, locale, digitDelim ) {
        var str = "";
        if ( this.argumentsCurrent === 2 ) {
            str += arg[start + count - 2].toLocaleString( digitDelim ) + this.name + arg[start + count - 1].toLocaleString( digitDelim );
        }
        else {
            str += this.name + arg[start];
        }
        return new cString( str );
    }
};

/** @constructor */
function cBaseFunction( name, argMin, argMax ) {
    this.name = name;
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = argMin ? argMin : 0;
    this.argumentsCurrent = 0;
    this.argumentsMax = argMax ? argMax : 255;
    this.formatType = {
        def       : -1, //подразумевается формат первой ячейки входящей в формулу.
        noneFormat: -2
    };
    this.numFormat = this.formatType.def;
//    this.isXLFN = rx_sFuncPref.test(this.name);
}

cBaseFunction.prototype = {
    constructor       : cBaseFunction,
    Calculate         : function () {
        this.value = new cError( cErrorType.wrong_name );
        return this.value;
    },
    setArgumentsMin   : function ( count ) {
        this.argumentsMin = count;
    },
    setArgumentsMax   : function ( count ) {
        this.argumentsMax = count;
    },
    DecrementArguments: function () {
        --this.argumentsCurrent;
    },
    IncrementArguments: function () {
        ++this.argumentsCurrent;
    },
    setName           : function ( name ) {
        this.name = name;
    },
    setArgumentsCount : function ( count ) {
        this.argumentsCurrent = count;
    },
    getArguments      : function () {
        return this.argumentsCurrent;
    },
    getMaxArguments   : function () {
        return this.argumentsMax;
    },
    getMinArguments   : function () {
        return this.argumentsMin;
    },
    Assemble          : function ( arg ) {
        var str = "";
        for ( var i = 0; i < arg.length; i++ ) {
            str += arg[i].toString();
            if ( i !== arg.length - 1 ) {
                str += ",";
            }
        }
        if ( this.isXLFN ) {
            return new cString( "_xlfn." + this.name + "(" + str + ")" );
        }
        return new cString( this.toString() + "(" + str + ")" );
    },
    Assemble2         : function ( arg, start, count ) {

        var str = "", c = start + count - 1;
        for ( var i = start; i <= c; i++ ) {
            str += arg[i].toString();
            if ( i !== c ) {
                str += ",";
            }
        }
        if ( this.isXLFN ) {
            return new cString( "_xlfn." + this.name + "(" + str + ")" );
        }
        return new cString( this.toString() + "(" + str + ")" );
    },
    Assemble2Locale   : function ( arg, start, count, locale, digitDelim ) {

        var name = this.toString(),
            str = "", c = start + count - 1,
            localeName = locale ? locale[name] : name;

        localeName = localeName || this.toString();
        for ( var i = start; i <= c; i++ ) {
            str += arg[i].toLocaleString( digitDelim );
            if ( i !== c ) {
                str += functionArgumentSeparator;
            }
        }
        return new cString( localeName + "(" + str + ")" );
    },
    toString          : function () {
        return this.name.replace( rx_sFuncPref, "_xlfn." );
    },
    setCA             : function ( arg, ca, numFormat ) {
        this.value = arg;
        if ( ca ) {
            this.value.ca = true;
        }
        if ( numFormat !== null && numFormat !== undefined ) {
            this.value.numFormat = numFormat;
        }
        return this.value;
    },
    setFormat         : function ( f ) {
        this.numFormat = f;
    }
};

/** @constructor */
function parentLeft() {
    this.name = "(";
    this.type = cElementType.operator;
    this.argumentsCurrent = 1;
}

parentLeft.prototype.constructor = parentLeft;
parentLeft.prototype.DecrementArguments = function () {
    --this.argumentsCurrent;
};
parentLeft.prototype.IncrementArguments = function () {
    ++this.argumentsCurrent;
};
parentLeft.prototype.toString = function () {
    return this.name;
};
parentLeft.prototype.getArguments = function () {
    return this.argumentsCurrent;
};
parentLeft.prototype.Assemble = function ( arg ) {
    return new cString( "(" + arg + ")" );
};
parentLeft.prototype.Assemble2 = function ( arg, start, count ) {
    return new cString( "(" + arg[start + count - 1] + ")" );
};
parentLeft.prototype.Assemble2Locale = function ( arg, start, count ) {
    return this.Assemble2( arg, start, count );
};

/** @constructor */
function parentRight() {
    this.name = ")";
    this.type = cElementType.operator;
}

parentRight.prototype.constructor = parentRight;
parentRight.prototype.toString = function () {
    return this.name;
};

/** @constructor */
function cRangeUnionOperator() {
    cBaseOperator.apply( this, [':', 50, 2] );
}

cRangeUnionOperator.prototype = Object.create( cBaseOperator.prototype );
cRangeUnionOperator.prototype.Calculate = function ( arg ) {
    var arg0 = arg[0], arg1 = arg[1], wsId0, wsId1, wb, ws;
    if ( ( arg0 instanceof cRef || arg0 instanceof cArea || arg0 instanceof cRef3D || arg0 instanceof cArea3D && (wsId0 = arg0.wsFrom) == arg0.wsTo ) &&
        ( arg1 instanceof cRef || arg1 instanceof cArea || arg1 instanceof cRef3D || arg1 instanceof cArea3D && (wsId1 = arg1.wsFrom) == arg1.wsTo ) ) {

        if ( arg0 instanceof cArea3D ) {
            wsId0 = arg0.wsFrom;
            ws = arg0.getWS();
        }
        else {
            wsId0 = arg0.ws.getId();
            ws = arg0.getWS();
        }

        if ( arg1 instanceof cArea3D ) {
            wsId1 = arg1.wsFrom;
            ws = arg1.getWS();
        }
        else {
            wsId1 = arg1.ws.getId();
            ws = arg1.getWS();
        }

        if ( wsId0 != wsId1 ) {
            return this.value = new cError( cErrorType.wrong_value_type );
        }

        arg0 = arg0.getBBox0();
        arg1 = arg1.getBBox0();
        if ( !arg0 || !arg1 ) {
            return this.value = new cError( cErrorType.wrong_value_type );
        }
        arg0 = arg0.union( arg1 );
        arg0.normalize( true );

		if( arg0.isOneCell() )
			this.value = new cRef( arg0.getName(), ws );
		else
			this.value = new cArea( arg0.getName(), ws );

        this.value = new cArea( arg0.getName(), ws );

    }
    else {
        return this.value = new cError( cErrorType.wrong_value_type );
    }

    if ( this.value instanceof cArea || this.value instanceof cRef || this.value instanceof cRef3D || this.value instanceof cArea3D ) {
        var r1 = arguments[1], r2 = arguments[2], wb = r1.worksheet.workbook, cellName = r1.getFirst().getID(), wsId = r1.worksheet.getId();

        if ( this.value instanceof cArea && this.value.isValid() ) {
            var nFrom, nTo;

            if ( r2 ) {
                nFrom = r2.defName;
            }
            else {
                nFrom = wb.dependencyFormulas.addNode( wsId, cellName );
            }

            nTo = wb.dependencyFormulas.addNode( this.value.getWsId(), this.value._cells.replace( /\$/g, "" ) );
            this.value.setNode( nTo );
            wb.dependencyFormulas.addEdge2( nFrom, nTo );
        }
        else if ( this.value instanceof cArea3D && this.value.isValid() ) {
            var wsR = this.value.wsRange(),
                nTo, nFrom, _cell = this.value._cells.replace( /\$/g, "" );

            for ( var j = 0; j < wsR.length; j++ ) {
                if ( r2 ) {
                    nTo = wb.dependencyFormulas.addNode( wsR[j].Id, _cell );
                    wb.dependencyFormulas.addEdge2( r2.defName, nTo );
                }
                else
                    wb.dependencyFormulas.addEdge( wsId, cellName.replace( /\$/g, "" ), wsR[j].Id, _cell );
            }
        }
    }

    return this.value;
};

/** @constructor */
function cRangeIntersectionOperator() {
    cBaseOperator.apply( this, [' ', 50, 2] );
}

cRangeIntersectionOperator.prototype = Object.create( cBaseOperator.prototype );
cRangeIntersectionOperator.prototype.Calculate = function ( arg ) {
    var arg0 = arg[0], arg1 = arg[1], wsId0, wsId1, wb, ws;
    if ( ( arg0 instanceof cRef || arg0 instanceof cArea || arg0 instanceof cRef3D || arg0 instanceof cArea3D && (wsId0 = arg0.wsFrom) == arg0.wsTo ) &&
        ( arg1 instanceof cRef || arg1 instanceof cArea || arg1 instanceof cRef3D || arg1 instanceof cArea3D && (wsId1 = arg1.wsFrom) == arg1.wsTo ) ) {

        if ( arg0 instanceof cArea3D ) {
            wsId0 = arg0.wsFrom;
            ws = arg0.getWS();
        }
        else {
            wsId0 = arg0.ws.getId();
            ws = arg0.getWS();
        }

        if ( arg1 instanceof cArea3D ) {
            wsId1 = arg1.wsFrom;
            ws = arg1.getWS();
        }
        else {
            wsId1 = arg1.ws.getId();
            ws = arg1.getWS();
        }

        if ( wsId0 != wsId1 ) {
            return this.value = new cError( cErrorType.wrong_value_type );
        }

        arg0 = arg0.getBBox0();
        arg1 = arg1.getBBox0();
        if ( !arg0 || !arg1 ) {
            return this.value = new cError( cErrorType.wrong_value_type );
        }
        arg0 = arg0.intersection( arg1 );
		if( arg0 ){
        	arg0.normalize( true );
			if( arg0.isOneCell() )
				this.value = new cRef( arg0.getName(), ws );
			else
				this.value = new cArea( arg0.getName(), ws );
		}
		else
			return this.value = new cError( cErrorType.null_value );

    }
    else {
        return this.value = new cError( cErrorType.wrong_value_type );
    }

    if ( this.value instanceof cArea || this.value instanceof cRef || this.value instanceof cRef3D || this.value instanceof cArea3D ) {
        var r1 = arguments[1], r2 = arguments[2], wb = r1.worksheet.workbook, cellName = r1.getFirst().getID(), wsId = r1.worksheet.getId();

        if ( this.value instanceof cArea && this.value.isValid() ) {
            var nFrom, nTo;

            if ( r2 ) {
                nFrom = r2.defName;
            }
            else {
                nFrom = wb.dependencyFormulas.addNode( wsId, cellName );
            }

            nTo = wb.dependencyFormulas.addNode( this.value.getWsId(), this.value._cells.replace( /\$/g, "" ) );
            this.value.setNode( nTo );
            wb.dependencyFormulas.addEdge2( nFrom, nTo );
        }
        else if ( this.value instanceof cArea3D && this.value.isValid() ) {
            var wsR = this.value.wsRange(),
                nTo, nFrom, _cell = this.value._cells.replace( /\$/g, "" );

            for ( var j = 0; j < wsR.length; j++ ) {
                if ( r2 ) {
                    nTo = wb.dependencyFormulas.addNode( wsR[j].Id, _cell );
                    wb.dependencyFormulas.addEdge2( r2.defName, nTo );
                }
                else
                    wb.dependencyFormulas.addEdge( wsId, cellName.replace( /\$/g, "" ), wsR[j].Id, _cell );
            }
        }
    }

    return this.value;
};


/** @constructor */
function cUnarMinusOperator() {
    cBaseOperator.apply( this, ['un_minus'/**name operator*/, 49/**priority of operator*/, 1/**count arguments*/] );
    this.isRightAssociative = true;
}

cUnarMinusOperator.prototype = Object.create( cBaseOperator.prototype );
cUnarMinusOperator.prototype.Calculate = function ( arg ) {
    var arg0 = arg[0];
    if ( arg0 instanceof cArea ) {
        arg0 = arg0.cross( arguments[1].first );
    }
    else if ( arg0 instanceof cArea3D){
        arg0 = arg0.cross( arguments[1].first, arguments[3] );
    }
    else if ( arg0 instanceof cArray ) {
        arg0.foreach(
            function ( arrElem, r, c ) {
                arrElem = arrElem.tocNumber();
                arg0.array[r][c] = arrElem instanceof cError ? arrElem : new cNumber( -arrElem.getValue() );
            }
        );
        return this.value = arg0;
    }
    arg0 = arg0.tocNumber();
    return this.value = arg0 instanceof cError ? arg0 : new cNumber( -arg0.getValue() );
};
cUnarMinusOperator.prototype.toString = function () {        // toString function
    return '-';
};
cUnarMinusOperator.prototype.Assemble = function ( arg ) {
    return new cString( "-" + arg[0] );
};
cUnarMinusOperator.prototype.Assemble2 = function ( arg, start, count ) {
    return new cString( "-" + arg[start + count - 1] );
};
cUnarMinusOperator.prototype.Assemble2Locale = function ( arg, start, count ) {
    return new cString( "-" + arg[start + count - 1] );
};

/** @constructor */
function cUnarPlusOperator() {
    cBaseOperator.apply( this, ['un_plus', 49, 1] );
    this.isRightAssociative = true;
}

cUnarPlusOperator.prototype = Object.create( cBaseOperator.prototype );
cUnarPlusOperator.prototype.Calculate = function ( arg ) {
    var arg0 = arg[0];
    if ( arg0 instanceof cArea ) {
        arg0 = arg0.cross( arguments[1].first );
    }
    else if ( arg0 instanceof cArea3D){
        arg0 = arg0.cross( arguments[1].first, arguments[3] );
    }
    arg0 = arg0.tryConvert();
    return this.value = arg0;
};
cUnarPlusOperator.prototype.toString = function () {
    return '+';
};
cUnarPlusOperator.prototype.Assemble = function ( arg ) {
    return new cString( "+" + arg[0] );
};
cUnarPlusOperator.prototype.Assemble2 = function ( arg, start, count ) {
    return new cString( "+" + arg[start + count - 1] );
};
cUnarPlusOperator.prototype.Assemble2Locale = function ( arg, start, count ) {
    return new cString( "+" + arg[start + count - 1] );
};

/** @constructor */
function cAddOperator() {
    cBaseOperator.apply( this, ['+', 20] );
}

cAddOperator.prototype = Object.create( cBaseOperator.prototype );
cAddOperator.prototype.Calculate = function ( arg ) {
//    var arg0 = arg[0].tryConvert(), arg1 = arg[1].tryConvert();
//    var arg0 = arg[0].tocNumber(), arg1 = arg[1].tocNumber();
    var arg0 = arg[0], arg1 = arg[1];
    if ( arg0 instanceof cArea ) {
        arg0 = arg0.cross( arguments[1].first );
    }
    else if ( arg0 instanceof cArea3D){
        arg0 = arg0.cross( arguments[1].first, arguments[3] );
    }
    if ( arg1 instanceof cArea ) {
        arg1 = arg1.cross( arguments[1].first );
    }
    else if ( arg1 instanceof cArea3D){
        arg1 = arg1.cross( arguments[1].first, arguments[3] );
    }
    arg0 = arg0.tocNumber(), arg1 = arg1.tocNumber();
    return this.value = _func[arg0.type][arg1.type]( arg0, arg1, "+", arguments[1].first );
};

/** @constructor */
function cMinusOperator() {
    cBaseOperator.apply( this, ['-', 20] );
}

cMinusOperator.prototype = Object.create( cBaseOperator.prototype );
cMinusOperator.prototype.Calculate = function ( arg ) {
//    var arg0 = arg[0].tryConvert(), arg1 = arg[1].tryConvert();
    var arg0 = arg[0], arg1 = arg[1];
    if ( arg0 instanceof cArea ) {
        arg0 = arg0.cross( arguments[1].first );
    }
    if ( arg1 instanceof cArea ) {
        arg1 = arg1.cross( arguments[1].first );
    }
    arg0 = arg0.tocNumber(), arg1 = arg1.tocNumber();
    return this.value = _func[arg0.type][arg1.type]( arg0, arg1, "-", arguments[1].first );
};

/** @constructor */
function cPercentOperator() {
    cBaseOperator.apply( this, ['%', 45, 1] );
    this.isRightAssociative = true;
}

cPercentOperator.prototype = Object.create( cBaseOperator.prototype );
cPercentOperator.prototype.Calculate = function ( arg ) {
    var arg0 = arg[0];
    if ( arg0 instanceof cArea ) {
        arg0 = arg0.cross( arguments[1].first );
    }
    else if ( arg0 instanceof cArea3D){
        arg0 = arg0.cross( arguments[1].first, arguments[3] );
    }
    else if ( arg0 instanceof cArray ) {
        arg0.foreach(
            function ( arrElem, r, c ) {
                arrElem = arrElem.tocNumber();
                arg0.array[r][c] = arrElem instanceof cError ? arrElem : new cNumber( arrElem.getValue() / 100 );
            }
        );
        return this.value = arg0;
    }
    arg0 = arg0.tocNumber();
    this.value = arg0 instanceof cError ? arg0 : new cNumber( arg0.getValue() / 100 );
    this.value.numFormat = 9;
    return this.value;
};
cPercentOperator.prototype.Assemble = function ( arg ) {
    return new cString( arg[0] + this.name );
};
cPercentOperator.prototype.Assemble2 = function ( arg, start, count ) {
    return new cString( arg[start + count - 1] + this.name );
};
cPercentOperator.prototype.Assemble2Locale = function ( arg, start, count ) {
    return new cString( arg[start + count - 1] + this.name );
};

/** @constructor */
function cPowOperator() {
    cBaseOperator.apply( this, ['^', 40] );
}

cPowOperator.prototype = Object.create( cBaseOperator.prototype );
cPowOperator.prototype.Calculate = function ( arg ) {
    var arg0 = arg[0], arg1 = arg[1];
    if ( arg0 instanceof cArea ) {
        arg0 = arg0.cross( arguments[1].first );
    }
    else if ( arg0 instanceof cArea3D){
        arg0 = arg0.cross( arguments[1].first, arguments[3] );
    }
    arg0 = arg0.tocNumber();
    if ( arg1 instanceof cArea ) {
        arg1 = arg1.cross( arguments[1].first );
    }
    else if ( arg1 instanceof cArea3D){
        arg1 = arg1.cross( arguments[1].first, arguments[3] );
    }
    arg1 = arg1.tocNumber();
    if ( arg0 instanceof cError ) {
        return this.value = arg0;
    }
    if ( arg1 instanceof cError ) {
        return this.value = arg1;
    }

    var _v = Math.pow( arg0.getValue(), arg1.getValue() );
    if ( isNaN( _v ) ) {
        return this.value = new cError( cErrorType.not_numeric );
    }
    else if ( _v === Number.POSITIVE_INFINITY ) {
        return this.value = new cError( cErrorType.division_by_zero );
    }
    return this.value = new cNumber( _v );
};

/** @constructor */
function cMultOperator() {
    cBaseOperator.apply( this, ['*', 30] );
}

cMultOperator.prototype = Object.create( cBaseOperator.prototype );
cMultOperator.prototype.Calculate = function ( arg ) {
//    var arg0 = arg[0].tryConvert(), arg1 = arg[1].tryConvert();
    var arg0 = arg[0], arg1 = arg[1];
    if ( arg0 instanceof cArea ) {
        arg0 = arg0.cross( arguments[1].first );
    }
    else if ( arg0 instanceof cArea3D){
        arg0 = arg0.cross( arguments[1].first, arguments[3] );
    }
    if ( arg1 instanceof cArea ) {
        arg1 = arg1.cross( arguments[1].first );
    }
    else if ( arg1 instanceof cArea3D){
        arg1 = arg1.cross( arguments[1].first, arguments[3] );
    }
    arg0 = arg0.tocNumber(), arg1 = arg1.tocNumber();
    return this.value = _func[arg0.type][arg1.type]( arg0, arg1, "*", arguments[1].first );
};

/** @constructor */
function cDivOperator() {
    cBaseOperator.apply( this, ['/', 30] );
}

cDivOperator.prototype = Object.create( cBaseOperator.prototype );
cDivOperator.prototype.Calculate = function ( arg ) {
//    var arg0 = arg[0].tryConvert(), arg1 = arg[1].tryConvert();
    var arg0 = arg[0], arg1 = arg[1];
    if ( arg0 instanceof cArea ) {
        arg0 = arg0.cross( arguments[1].first );
    }
    else if ( arg0 instanceof cArea3D){
        arg0 = arg0.cross( arguments[1].first, arguments[3] );
    }
    if ( arg1 instanceof cArea ) {
        arg1 = arg1.cross( arguments[1].first );
    }
    else if ( arg1 instanceof cArea3D){
        arg1 = arg1.cross( arguments[1].first, arguments[3] );
    }
    arg0 = arg0.tocNumber(), arg1 = arg1.tocNumber();
    return this.value = _func[arg0.type][arg1.type]( arg0, arg1, "/", arguments[1].first );
};

/** @constructor */
function cConcatSTROperator() {
    cBaseOperator.apply( this, ['&', 15] );
}

cConcatSTROperator.prototype = Object.create( cBaseOperator.prototype );
cConcatSTROperator.prototype.Calculate = function ( arg ) {
    var arg0 = arg[0], arg1 = arg[1];
    if ( arg0 instanceof cArea ) {
        arg0 = arg0.cross( arguments[1].first );
    }
    else if ( arg0 instanceof cArea3D){
        arg0 = arg0.cross( arguments[1].first, arguments[3] );
    }
    arg0 = arg0.tocString();
    if ( arg1 instanceof cArea ) {
        arg1 = arg1.cross( arguments[1].first );
    }
    else if ( arg1 instanceof cArea3D){
        arg1 = arg1.cross( arguments[1].first, arguments[3] );
    }
    arg1 = arg1.tocString();

    return this.value = arg0 instanceof cError ? arg0 :
        arg1 instanceof cError ? arg1 :
            new cString( arg0.toString().concat( arg1.toString() ) );
};

/** @constructor */
function cEqualsOperator() {
    cBaseOperator.apply( this, ['=', 10] );
}

cEqualsOperator.prototype = Object.create( cBaseOperator.prototype );
cEqualsOperator.prototype.Calculate = function ( arg ) {
//    var arg0 = arg[0].tryConvert(), arg1 = arg[1].tryConvert();
    var arg0 = arg[0], arg1 = arg[1];
    if ( arg0 instanceof cArea ) {
        arg0 = arg0.cross( arguments[1].first );
    }
    else if ( arg0 instanceof cArea3D){
        arg0 = arg0.cross( arguments[1].first, arguments[3] );
    }
    if ( arg1 instanceof cArea ) {
        arg1 = arg1.cross( arguments[1].first );
    }
    else if ( arg1 instanceof cArea3D){
        arg1 = arg1.cross( arguments[1].first, arguments[3] );
    }
    arg0 = arg0.tryConvert(), arg1 = arg1.tryConvert();
    return this.value = _func[arg0.type][arg1.type]( arg0, arg1, "=", arguments[1].first );
};

/** @constructor */
function cNotEqualsOperator() {
    cBaseOperator.apply( this, ['<>', 10] );
}

cNotEqualsOperator.prototype = Object.create( cBaseOperator.prototype );
cNotEqualsOperator.prototype.Calculate = function ( arg ) {
//    var arg0 = arg[0].tryConvert(), arg1 = arg[1].tryConvert();
    var arg0 = arg[0], arg1 = arg[1];
    if ( arg0 instanceof cArea ) {
        arg0 = arg0.cross( arguments[1].first );
    }
    else if ( arg0 instanceof cArea3D ){
        arg0 = arg0.cross( arguments[1].first, arguments[3] );
    }

    if ( arg1.type == cElementType.cellsRange ) {
        arg1 = arg1.cross( arguments[1].first );
    }
    else if ( arg1 instanceof cArea3D ){
        arg1 = arg1.cross( arguments[1].first, arguments[3] );
    }
    arg0 = arg0.tryConvert(), arg1 = arg1.tryConvert();
    return this.value = _func[arg0.type][arg1.type]( arg0, arg1, "<>", arguments[1].first );
};

/** @constructor */
function cLessOperator() {
    cBaseOperator.apply( this, ['<', 10] );
}

cLessOperator.prototype = Object.create( cBaseOperator.prototype );
cLessOperator.prototype.Calculate = function ( arg ) {
//    var arg0 = arg[0].tryConvert(), arg1 = arg[1].tryConvert();
    var arg0 = arg[0], arg1 = arg[1];
    if ( arg0 instanceof cArea ) {
        arg0 = arg0.cross( arguments[1].first );
    }
    else if ( arg0 instanceof cArea3D ){
        arg0 = arg0.cross( arguments[1].first, arguments[3] );
    }

    if ( arg1 instanceof cArea ) {
        arg1 = arg1.cross( arguments[1].first );
    }
    else if ( arg1 instanceof cArea3D ){
        arg1 = arg1.cross( arguments[1].first, arguments[3] );
    }
    arg0 = arg0.tryConvert(), arg1 = arg1.tryConvert();
    return this.value = _func[arg0.type][arg1.type]( arg0, arg1, "<", arguments[1].first );
};

/** @constructor */
function cLessOrEqualOperator() {
    cBaseOperator.apply( this, ['<=', 10] );
}

cLessOrEqualOperator.prototype = Object.create( cBaseOperator.prototype );
cLessOrEqualOperator.prototype.Calculate = function ( arg ) {
//    var arg0 = arg[0].tryConvert(), arg1 = arg[1].tryConvert();
    var arg0 = arg[0], arg1 = arg[1];
    if ( arg0 instanceof cArea ) {
        arg0 = arg0.cross( arguments[1].first );
    }
    else if ( arg0 instanceof cArea3D ){
        arg0 = arg0.cross( arguments[1].first, arguments[3] );
    }
    if ( arg1 instanceof cArea ) {
        arg1 = arg1.cross( arguments[1].first );
    }
    else if ( arg1 instanceof cArea3D ){
        arg1 = arg1.cross( arguments[1].first, arguments[3] );
    }
    arg0 = arg0.tryConvert(), arg1 = arg1.tryConvert();
    return this.value = _func[arg0.type][arg1.type]( arg0, arg1, "<=", arguments[1].first );
};

/** @constructor */
function cGreaterOperator() {
    cBaseOperator.apply( this, ['>', 10] );
}

cGreaterOperator.prototype = Object.create( cBaseOperator.prototype );
cGreaterOperator.prototype.Calculate = function ( arg ) {
//    var arg0 = arg[0].tryConvert(), arg1 = arg[1].tryConvert();
    var arg0 = arg[0], arg1 = arg[1];
    if ( arg0 instanceof cArea ) {
        arg0 = arg0.cross( arguments[1].first );
    }
    else if ( arg0 instanceof cArea3D ){
        arg0 = arg0.cross( arguments[1].first, arguments[3] );
    }
    if ( arg1 instanceof cArea ) {
        arg1 = arg1.cross( arguments[1].first );
    }
    else if ( arg1 instanceof cArea3D ){
        arg1 = arg1.cross( arguments[1].first, arguments[3] );
    }
    arg0 = arg0.tryConvert(), arg1 = arg1.tryConvert();
    return this.value = _func[arg0.type][arg1.type]( arg0, arg1, ">", arguments[1].first );
};

/** @constructor */
function cGreaterOrEqualOperator() {
    cBaseOperator.apply( this, ['>=', 10] );
}

cGreaterOrEqualOperator.prototype = Object.create( cBaseOperator.prototype );
cGreaterOrEqualOperator.prototype.Calculate = function ( arg ) {
//    var arg0 = arg[0].tryConvert(), arg1 = arg[1].tryConvert();
    var arg0 = arg[0], arg1 = arg[1];
    if ( arg0 instanceof cArea ) {
        arg0 = arg0.cross( arguments[1].first );
    }
    else if ( arg0 instanceof cArea3D ){
        arg0 = arg0.cross( arguments[1].first, arguments[3] );
    }
    if ( arg1 instanceof cArea ) {
        arg1 = arg1.cross( arguments[1].first );
    }
    else if ( arg1 instanceof cArea3D ){
        arg1 = arg1.cross( arguments[1].first, arguments[3] );
    }
    arg0 = arg0.tryConvert(), arg1 = arg1.tryConvert();
    return this.value = _func[arg0.type][arg1.type]( arg0, arg1, ">=", arguments[1].first );
};

/* cFormulaOperators is container for holding all ECMA-376 operators, see chapter $18.17.2.2 in "ECMA-376, Second Edition, Part 1 - Fundamentals And Markup Language Reference" */
var cFormulaOperators = {
    '('       : parentLeft,
    ')'       : parentRight,
    '{'       : function () {
        var r = {};
        r.name = '{';
        r.toString = function () {
            return this.name;
        };
        return r;
    },
    '}'       : function () {
        var r = {};
        r.name = '}';
        r.toString = function () {
            return this.name;
        };
        return r;
    },
    /* 50 is highest priority */
    ':'       : cRangeUnionOperator,
    ' '       : cRangeIntersectionOperator,
    'un_minus': cUnarMinusOperator,
    'un_plus' : cUnarPlusOperator,
    '%'       : cPercentOperator,
    '^'       : cPowOperator,
    '*'       : cMultOperator,
    '/'       : cDivOperator,
    '+'       : cAddOperator,
    '-'       : cMinusOperator,
    '&'       : cConcatSTROperator /*concat str*/,
    '='       : cEqualsOperator/*equals*/,
    '<>'      : cNotEqualsOperator,
    '<'       : cLessOperator,
    '<='      : cLessOrEqualOperator,
    '>'       : cGreaterOperator,
    '>='      : cGreaterOrEqualOperator
    /* 10 is lowest priopity */
};

/* cFormulaFunctionGroup is container for holding all ECMA-376 function, see chapter $18.17.7 in "ECMA-376, Second Edition, Part 1 - Fundamentals And Markup Language Reference" */
/*
 Каждая формула представляет собой копию функции cBaseFunction.
 Для реализации очередной функции необходимо указать количество (минимальное и максимальное) принимаемых аргументов. Берем в спецификации.
 Также необходино написать реализацию методов Calculate и getInfo(возвращает название функции и вид/количетво аргументов).
 В методе Calculate необходимо отслеживать тип принимаемых аргументов. Для примера, если мы обращаемся к ячейке A1, в которой лежит 123, то этот аргумент будет числом. Если же там лежит "123", то это уже строка. Для более подробной информации смотреть спецификацию.
 Метод getInfo является обязательным, ибо через этот метод в интерфейс передается информация о реализованных функциях.
 */
var cFormulaFunctionGroup = {};
var cFormulaFunction = {};
var cAllFormulaFunction = {};
var cFormulaFunctionLocalized = null;
var cFormulaFunctionToLocale = null;

function getFormulasInfo() {

    var list = [], a, b, f;
    for ( var type in cFormulaFunctionGroup ) {
        b = new Asc.asc_CFormulaGroup( type );
        for ( var i = 0; i < cFormulaFunctionGroup[type].length; ++i ) {
            a = new cFormulaFunctionGroup[type][i]();
            if ( a.getInfo ) {
                f = new Asc.asc_CFormula( a.getInfo() );
                b.asc_addFormulaElement( f );
                cFormulaFunction[f.asc_getName()] = cFormulaFunctionGroup[type][i];
            }
            cAllFormulaFunction[a.name] = cFormulaFunctionGroup[type][i];
        }
        list.push( b );
    }
    return list;
}

/*--------------------------------------------------------------------------*/


var _func = [];//для велосипеда а-ля перегрузка функций.
_func[cElementType.number] = [];
_func[cElementType.string] = [];
_func[cElementType.bool] = [];
_func[cElementType.error] = [];
_func[cElementType.cellsRange] = [];
_func[cElementType.empty] = [];
_func[cElementType.array] = [];
_func[cElementType.cell] = [];


_func[cElementType.number][cElementType.number] = function ( arg0, arg1, what ) {
    if ( what === ">" ) {
        return new cBool( arg0.getValue() > arg1.getValue() );
    }
    else if ( what === ">=" ) {
        return new cBool( arg0.getValue() >= arg1.getValue() );
    }
    else if ( what === "<" ) {
        return new cBool( arg0.getValue() < arg1.getValue() );
    }
    else if ( what === "<=" ) {
        return new cBool( arg0.getValue() <= arg1.getValue() );
    }
    else if ( what === "=" ) {
        return new cBool( arg0.getValue() === arg1.getValue() );
    }
    else if ( what === "<>" ) {
        return new cBool( arg0.getValue() !== arg1.getValue() );
    }
    else if ( what === "-" ) {
        return new cNumber( arg0.getValue() - arg1.getValue() );
    }
    else if ( what === "+" ) {
        return new cNumber( arg0.getValue() + arg1.getValue() );
    }
    else if ( what === "/" ) {
        if ( arg1.getValue() !== 0 ) {
            return new cNumber( arg0.getValue() / arg1.getValue() );
        }
        else {
            return new cError( cErrorType.division_by_zero );
        }
    }
    else if ( what === "*" ) {
        return new cNumber( arg0.getValue() * arg1.getValue() );
    }
    return new cError( cErrorType.wrong_value_type );
};

_func[cElementType.number][cElementType.string] = function ( arg0, arg1, what ) {
    if ( what === ">" || what === ">=" ) {
        return new cBool( false );
    }
    else if ( what === "<" || what === "<=" ) {
        return new cBool( true );
    }
    else if ( what === "=" ) {
        return new cBool( false );
    }
    else if ( what === "<>" ) {
        return new cBool( true );
    }
    else if ( what === "-" || what === "+" || what === "/" || what === "*" ) {
        return new cError( cErrorType.wrong_value_type );
    }
    return new cError( cErrorType.wrong_value_type );
};

_func[cElementType.number][cElementType.bool] = function ( arg0, arg1, what ) {
    var _arg;
    if ( what === ">" || what === ">=" ) {
        return new cBool( false );
    }
    else if ( what === "<" || what === "<=" ) {
        return new cBool( true );
    }
    else if ( what === "=" ) {
        return new cBool( false );
    }
    else if ( what === "<>" ) {
        return new cBool( true );
    }
    else if ( what === "-" ) {
        _arg = arg1.tocNumber();
        if ( _arg instanceof cError ) {
            return _arg;
        }
        return new cNumber( arg0.getValue() - _arg.getValue() );
    }
    else if ( what === "+" ) {
        _arg = arg1.tocNumber();
        if ( _arg instanceof cError ) {
            return _arg;
        }
        return new cNumber( arg0.getValue() + _arg.getValue() );
    }
    else if ( what === "/" ) {
        _arg = arg1.tocNumber();
        if ( _arg instanceof cError ) {
            return _arg;
        }
        if ( _arg.getValue() !== 0 ) {
            return new cNumber( arg0.getValue() / _arg.getValue() );
        }
        else {
            return new cError( cErrorType.division_by_zero );
        }
    }
    else if ( what === "*" ) {
        _arg = arg1.tocNumber();
        if ( _arg instanceof cError ) {
            return _arg;
        }
        return new cNumber( arg0.getValue() * _arg.getValue() );
    }
    return new cError( cErrorType.wrong_value_type );
};

_func[cElementType.number][cElementType.error] = function ( arg0, arg1 ) {
    return arg1;
};

_func[cElementType.number][cElementType.empty] = function ( arg0, arg1, what ) {
    if ( what === ">" ) {
        return new cBool( arg0.getValue() > 0 );
    }
    else if ( what === ">=" ) {
        return new cBool( arg0.getValue() >= 0 );
    }
    else if ( what === "<" ) {
        return new cBool( arg0.getValue() < 0 );
    }
    else if ( what === "<=" ) {
        return new cBool( arg0.getValue() <= 0 );
    }
    else if ( what === "=" ) {
        return new cBool( arg0.getValue() === 0 );
    }
    else if ( what === "<>" ) {
        return new cBool( arg0.getValue() !== 0 );
    }
    else if ( what === "-" ) {
        return new cNumber( arg0.getValue() - 0 );
    }
    else if ( what === "+" ) {
        return new cNumber( arg0.getValue() + 0 );
    }
    else if ( what === "/" ) {
        return new cError( cErrorType.division_by_zero );
    }
    else if ( what === "*" ) {
        return new cNumber( 0 );
    }
    return new cError( cErrorType.wrong_value_type );
};


_func[cElementType.string][cElementType.number] = function ( arg0, arg1, what ) {
    if ( what === ">" || what === ">=" ) {
        return new cBool( true );
    }
    else if ( what === "<" || what === "<=" || what === "=" ) {
        return new cBool( false );
    }
    else if ( what === "<>" ) {
        return new cBool( true );
    }
    else if ( what === "-" || what === "+" || what === "/" || what === "*" ) {
        return new cError( cErrorType.wrong_value_type );
    }
    return new cError( cErrorType.wrong_value_type );
};

_func[cElementType.string][cElementType.string] = function ( arg0, arg1, what ) {
    var _arg0, _arg1;
    if ( what === ">" ) {
        return new cBool( arg0.getValue() > arg1.getValue() );
    }
    else if ( what === ">=" ) {
        return new cBool( arg0.getValue() >= arg1.getValue() );
    }
    else if ( what === "<" ) {
        return new cBool( arg0.getValue() < arg1.getValue() );
    }
    else if ( what === "<=" ) {
        return new cBool( arg0.getValue() <= arg1.getValue() );
    }
    else if ( what === "=" ) {
        return new cBool( arg0.getValue().toLowerCase() === arg1.getValue().toLowerCase() );
    }
    else if ( what === "<>" ) {
        return new cBool( arg0.getValue().toLowerCase() !== arg1.getValue().toLowerCase() );
    }
    else if ( what === "-" ) {
        _arg0 = arg0.tocNumber();
        _arg1 = arg1.tocNumber();
        if ( _arg0 instanceof cError ) {
            return _arg0;
        }
        if ( _arg1 instanceof cError ) {
            return _arg1;
        }
        return new cNumber( _arg0.getValue() - _arg1.getValue() );
    }
    else if ( what === "+" ) {
        _arg0 = arg0.tocNumber();
        _arg1 = arg1.tocNumber();
        if ( _arg0 instanceof cError ) {
            return _arg0;
        }
        if ( _arg1 instanceof cError ) {
            return _arg1;
        }
        return new cNumber( _arg0.getValue() + _arg1.getValue() );
    }
    else if ( what === "/" ) {
        _arg0 = arg0.tocNumber();
        _arg1 = arg1.tocNumber();
        if ( _arg0 instanceof cError ) {
            return _arg0;
        }
        if ( _arg1 instanceof cError ) {
            return _arg1;
        }
        if ( _arg1.getValue() !== 0 ) {
            return new cNumber( _arg0.getValue() / _arg1.getValue() );
        }
        return new cError( cErrorType.division_by_zero );
    }
    else if ( what === "*" ) {
        _arg0 = arg0.tocNumber();
        _arg1 = arg1.tocNumber();
        if ( _arg0 instanceof cError ) {
            return _arg0;
        }
        if ( _arg1 instanceof cError ) {
            return _arg1;
        }
        return new cNumber( _arg0.getValue() * _arg1.getValue() );
    }
    return new cError( cErrorType.wrong_value_type );
};

_func[cElementType.string][cElementType.bool] = function ( arg0, arg1, what ) {
    var _arg0, _arg1;
    if ( what === ">" || what === ">=" ) {
        return new cBool( false );
    }
    else if ( what === "<" || what === "<=" ) {
        return new cBool( true );
    }
    else if ( what === "=" ) {
        return new cBool( false );
    }
    else if ( what === "<>" ) {
        return new cBool( true );
    }
    else if ( what === "-" ) {
        _arg0 = arg0.tocNumber();
        _arg1 = arg1.tocNumber();
        if ( _arg0 instanceof cError ) {
            return _arg0;
        }
        if ( _arg1 instanceof cError ) {
            return _arg1;
        }
        return new cNumber( _arg0.getValue() - _arg1.getValue() );
    }
    else if ( what === "+" ) {
        _arg0 = arg0.tocNumber();
        _arg1 = arg1.tocNumber();
        if ( _arg0 instanceof cError ) {
            return _arg0;
        }
        if ( _arg1 instanceof cError ) {
            return _arg1;
        }
        return new cNumber( _arg0.getValue() + _arg1.getValue() );
    }
    else if ( what === "/" ) {
        _arg0 = arg0.tocNumber();
        _arg1 = arg1.tocNumber();
        if ( _arg0 instanceof cError ) {
            return _arg0;
        }
        if ( _arg1 instanceof cError ) {
            return _arg1;
        }
        if ( _arg1.getValue() !== 0 ) {
            return new cNumber( _arg0.getValue() / _arg1.getValue() );
        }
        return new cError( cErrorType.division_by_zero );
    }
    else if ( what === "*" ) {
        _arg0 = arg0.tocNumber();
        _arg1 = arg1.tocNumber();
        if ( _arg0 instanceof cError ) {
            return _arg0;
        }
        if ( _arg1 instanceof cError ) {
            return _arg1;
        }
        return new cNumber( _arg0.getValue() * _arg1.getValue() );
    }
    return new cError( cErrorType.wrong_value_type );
};

_func[cElementType.string][cElementType.error] = function ( arg0, arg1 ) {
    return arg1;
};

_func[cElementType.string][cElementType.empty] = function ( arg0, arg1, what ) {
    if ( what === ">" ) {
        return new cBool( arg0.getValue().length !== 0 );
    }
    else if ( what === ">=" ) {
        return new cBool( arg0.getValue().length >= 0 );
    }
    else if ( what === "<" ) {
        return new cBool( false );
    }
    else if ( what === "<=" ) {
        return new cBool( arg0.getValue().length <= 0 );
    }
    else if ( what === "=" ) {
        return new cBool( arg0.getValue().length === 0 );
    }
    else if ( what === "<>" ) {
        return new cBool( arg0.getValue().length !== 0 );
    }
    else if ( what === "-" || what === "+" || what === "/" || what === "*" ) {
        return new cError( cErrorType.wrong_value_type );
    }
    return new cError( cErrorType.wrong_value_type );
};


_func[cElementType.bool][cElementType.number] = function ( arg0, arg1, what ) {
    var _arg;
    if ( what === ">" || what === ">=" ) {
        return new cBool( true );
    }
    else if ( what === "<" || what === "<=" ) {
        return new cBool( false );
    }
    else if ( what === "=" ) {
        return new cBool( false );
    }
    else if ( what === "<>" ) {
        return new cBool( true );
    }
    else if ( what === "-" ) {
        _arg = arg0.tocNumber();
        if ( _arg instanceof cError ) {
            return _arg;
        }
        return new cNumber( _arg.getValue() - arg1.getValue() );
    }
    else if ( what === "+" ) {
        _arg = arg1.tocNumber();
        if ( _arg instanceof cError ) {
            return _arg;
        }
        return new cNumber( _arg.getValue() + arg1.getValue() );
    }
    else if ( what === "/" ) {
        _arg = arg1.tocNumber();
        if ( _arg instanceof cError ) {
            return _arg;
        }
        if ( arg1.getValue() !== 0 ) {
            return new cNumber( _arg.getValue() / arg1.getValue() );
        }
        else {
            return new cError( cErrorType.division_by_zero );
        }
    }
    else if ( what === "*" ) {
        _arg = arg1.tocNumber();
        if ( _arg instanceof cError ) {
            return _arg;
        }
        return new cNumber( _arg.getValue() * arg1.getValue() );
    }
    return new cError( cErrorType.wrong_value_type );
};

_func[cElementType.bool][cElementType.string] = function ( arg0, arg1, what ) {
    var _arg0, _arg1;
    if ( what === ">" || what === ">=" ) {
        return new cBool( true );
    }
    else if ( what === "<" || what === "<=" ) {
        return new cBool( false );
    }
    else if ( what === "=" ) {
        return new cBool( false );
    }
    else if ( what === "<>" ) {
        return new cBool( true );
    }
    else if ( what === "-" ) {
        _arg0 = arg0.tocNumber();
        _arg1 = arg1.tocNumber();
        if ( _arg1 instanceof cError ) {
            return _arg1;
        }
        return new cNumber( _arg0.getValue() - _arg1.getValue() );
    }
    else if ( what === "+" ) {
        _arg0 = arg0.tocNumber();
        _arg1 = arg1.tocNumber();
        if ( _arg1 instanceof cError ) {
            return _arg1;
        }
        return new cNumber( _arg0.getValue() + _arg1.getValue() );
    }
    else if ( what === "/" ) {
        _arg0 = arg0.tocNumber();
        _arg1 = arg1.tocNumber();
        if ( _arg1 instanceof cError ) {
            return _arg1;
        }
        if ( _arg1.getValue() !== 0 ) {
            return new cNumber( _arg0.getValue() / _arg1.getValue() );
        }
        return new cError( cErrorType.division_by_zero );
    }
    else if ( what === "*" ) {
        _arg0 = arg0.tocNumber();
        _arg1 = arg1.tocNumber();
        if ( _arg1 instanceof cError ) {
            return _arg1;
        }
        return new cNumber( _arg0.getValue() * _arg1.getValue() );
    }
    return new cError( cErrorType.wrong_value_type );
};

_func[cElementType.bool][cElementType.bool] = function ( arg0, arg1, what ) {
    var _arg0, _arg1;
    if ( what === ">" ) {
        return    new cBool( arg0.value > arg1.value );
    }
    else if ( what === ">=" ) {
        return    new cBool( arg0.value >= arg1.value );
    }
    else if ( what === "<" ) {
        return    new cBool( arg0.value < arg1.value );
    }
    else if ( what === "<=" ) {
        return    new cBool( arg0.value <= arg1.value );
    }
    else if ( what === "=" ) {
        return    new cBool( arg0.value === arg1.value );
    }
    else if ( what === "<>" ) {
        return    new cBool( arg0.value !== arg1.value );
    }
    else if ( what === "-" ) {
        _arg0 = arg0.tocNumber();
        _arg1 = arg1.tocNumber();
        return new cNumber( _arg0.getValue() - _arg1.getValue() );
    }
    else if ( what === "+" ) {
        _arg0 = arg0.tocNumber();
        _arg1 = arg1.tocNumber();
        return new cNumber( _arg0.getValue() + _arg1.getValue() );
    }
    else if ( what === "/" ) {
        if ( !arg1.value ) {
            return new cError( cErrorType.division_by_zero );
        }
        _arg0 = arg0.tocNumber();
        _arg1 = arg1.tocNumber();
        return new cNumber( _arg0.getValue() / _arg1.getValue() );
    }
    else if ( what === "*" ) {
        _arg0 = arg0.tocNumber();
        _arg1 = arg1.tocNumber();
        return new cNumber( _arg0.getValue() * _arg1.getValue() );
    }
    return new cError( cErrorType.wrong_value_type );
};

_func[cElementType.bool][cElementType.error] = function ( arg0, arg1 ) {
    return arg1;
};

_func[cElementType.bool][cElementType.empty] = function ( arg0, arg1, what ) {
    if ( what === ">" ) {
        return new cBool( arg0.value > false );
    }
    else if ( what === ">=" ) {
        return new cBool( arg0.value >= false );
    }
    else if ( what === "<" ) {
        return new cBool( arg0.value < false );
    }
    else if ( what === "<=" ) {
        return new cBool( arg0.value <= false );
    }
    else if ( what === "=" ) {
        return new cBool( arg0.value === false );
    }
    else if ( what === "<>" ) {
        return new cBool( arg0.value !== false );
    }
    else if ( what === "-" ) {
        return new cNumber( arg0.value ? 1 : 0 );
    }
    else if ( what === "+" ) {
        return new cNumber( arg0.value ? 1 : 0 );
    }
    else if ( what === "/" ) {
        return new cError( cErrorType.division_by_zero );
    }
    else if ( what === "*" ) {
        return new cNumber( 0 );
    }
    return new cError( cErrorType.wrong_value_type );
};


_func[cElementType.error][cElementType.number] = _func[cElementType.error][cElementType.string] =
    _func[cElementType.error][cElementType.bool] = _func[cElementType.error][cElementType.error] =
        _func[cElementType.error][cElementType.empty] = function ( arg0 ) {
            return arg0;
        };


_func[cElementType.empty][cElementType.number] = function ( arg0, arg1, what ) {
    if ( what === ">" ) {
        return new cBool( 0 > arg1.getValue() );
    }
    else if ( what === ">=" ) {
        return new cBool( 0 >= arg1.getValue() );
    }
    else if ( what === "<" ) {
        return new cBool( 0 < arg1.getValue() );
    }
    else if ( what === "<=" ) {
        return new cBool( 0 <= arg1.getValue() );
    }
    else if ( what === "=" ) {
        return new cBool( 0 === arg1.getValue() );
    }
    else if ( what === "<>" ) {
        return new cBool( 0 !== arg1.getValue() );
    }
    else if ( what === "-" ) {
        return new cNumber( 0 - arg1.getValue() );
    }
    else if ( what === "+" ) {
        return new cNumber( 0 + arg1.getValue() );
    }
    else if ( what === "/" ) {
        if ( arg1.getValue() === 0 ) {
            return new cError( cErrorType.not_numeric );
        }
        return new cNumber( 0 );
    }
    else if ( what === "*" ) {
        return new cNumber( 0 );
    }
    return new cError( cErrorType.wrong_value_type );
};

_func[cElementType.empty][cElementType.string] = function ( arg0, arg1, what ) {
    if ( what === ">" ) {
        return new cBool( 0 > arg1.getValue().length );
    }
    else if ( what === ">=" ) {
        return new cBool( 0 >= arg1.getValue().length );
    }
    else if ( what === "<" ) {
        return new cBool( 0 < arg1.getValue().length );
    }
    else if ( what === "<=" ) {
        return new cBool( 0 <= arg1.getValue().length );
    }
    else if ( what === "=" ) {
        return new cBool( 0 === arg1.getValue().length );
    }
    else if ( what === "<>" ) {
        return new cBool( 0 !== arg1.getValue().length );
    }
    else if ( what === "-" || what === "+" || what === "/" || what === "*" ) {
        return new cError( cErrorType.wrong_value_type );
    }
    return new cError( cErrorType.wrong_value_type );
};

_func[cElementType.empty][cElementType.bool] = function ( arg0, arg1, what ) {
    if ( what === ">" ) {
        return new cBool( false > arg1.value );
    }
    else if ( what === ">=" ) {
        return new cBool( false >= arg1.value );
    }
    else if ( what === "<" ) {
        return new cBool( false < arg1.value );
    }
    else if ( what === "<=" ) {
        return new cBool( false <= arg1.value );
    }
    else if ( what === "=" ) {
        return new cBool( arg1.value === false );
    }
    else if ( what === "<>" ) {
        return new cBool( arg1.value !== false );
    }
    else if ( what === "-" ) {
        return new cNumber( 0 - arg1.value ? 1.0 : 0.0 );
    }
    else if ( what === "+" ) {
        return new cNumber( arg1.value ? 1.0 : 0.0 );
    }
    else if ( what === "/" ) {
        if ( arg1.value ) {
            return new cNumber( 0 );
        }
        return new cError( cErrorType.not_numeric );
    }
    else if ( what === "*" ) {
        return new cNumber( 0 );
    }
    return new cError( cErrorType.wrong_value_type );
};

_func[cElementType.empty][cElementType.error] = function ( arg0, arg1 ) {
    return arg1;
};

_func[cElementType.empty][cElementType.empty] = function ( arg0, arg1, what ) {
    if ( what === ">" || what === "<" || what === "<>" ) {
        return new cBool( false );
    }
    else if ( what === ">=" || what === "<=" || what === "=" ) {
        return new cBool( true );
    }
    else if ( what === "-" || what === "+" ) {
        return new cNumber( 0 );
    }
    else if ( what === "/" ) {
        return new cError( cErrorType.not_numeric );
    }
    else if ( what === "*" ) {
        return new cNumber( 0 );
    }
    return new cError( cErrorType.wrong_value_type );
};


_func[cElementType.cellsRange][cElementType.number] = _func[cElementType.cellsRange][cElementType.string] =
    _func[cElementType.cellsRange][cElementType.bool] = _func[cElementType.cellsRange][cElementType.error] =
        _func[cElementType.cellsRange][cElementType.array] = _func[cElementType.cellsRange][cElementType.empty] = function ( arg0, arg1, what, cellAddress ) {
            var cross = arg0.cross( cellAddress );
            return _func[cross.type][arg1.type]( cross, arg1, what );
        };


_func[cElementType.number][cElementType.cellsRange] = _func[cElementType.string][cElementType.cellsRange] =
    _func[cElementType.bool][cElementType.cellsRange] = _func[cElementType.error][cElementType.cellsRange] =
        _func[cElementType.array][cElementType.cellsRange] = _func[cElementType.empty][cElementType.cellsRange] = function ( arg0, arg1, what, cellAddress ) {
            var cross = arg1.cross( cellAddress );
            return _func[arg0.type][cross.type]( arg0, cross, what );
        };


_func[cElementType.cellsRange][cElementType.cellsRange] = function ( arg0, arg1, what, cellAddress ) {
    var cross1 = arg0.cross( cellAddress ),
        cross2 = arg1.cross( cellAddress );
    return _func[cross1.type][cross2.type]( cross1, cross2, what );
};

_func[cElementType.array][cElementType.array] = function ( arg0, arg1, what ) {
    if ( arg0.getRowCount() !== arg1.getRowCount() || arg0.getCountElementInRow() !== arg1.getCountElementInRow() ) {
        return new cError( cErrorType.wrong_value_type );
    }
    var retArr = new cArray(), _arg0, _arg1;
    for ( var iRow = 0; iRow < arg0.getRowCount(); iRow++, iRow < arg0.getRowCount() ? retArr.addRow() : true ) {
        for ( var iCol = 0; iCol < arg0.getCountElementInRow(); iCol++ ) {
            _arg0 = arg0.getElementRowCol( iRow, iCol );
            _arg1 = arg1.getElementRowCol( iRow, iCol );
            retArr.addElement( _func[_arg0.type][_arg1.type]( _arg0, _arg1, what ) );
        }
    }
    return retArr;
};

_func[cElementType.array][cElementType.number] = _func[cElementType.array][cElementType.string] =
    _func[cElementType.array][cElementType.bool] = _func[cElementType.array][cElementType.error] =
        _func[cElementType.array][cElementType.empty] = function ( arg0, arg1, what ) {
            var res = new cArray();
            arg0.foreach( function ( elem, r ) {
                if ( !res.array[r] ) {
                    res.addRow();
                }
                res.addElement( _func[elem.type][arg1.type]( elem, arg1, what ) );
            } );
            return res;
        };


_func[cElementType.number][cElementType.array] = _func[cElementType.string][cElementType.array] =
    _func[cElementType.bool][cElementType.array] = _func[cElementType.error][cElementType.array] =
        _func[cElementType.empty][cElementType.array] = function ( arg0, arg1, what ) {
            var res = new cArray();
            arg1.foreach( function ( elem, r ) {
                if ( !res.array[r] ) {
                    res.addRow();
                }
                res.addElement( _func[arg0.type][elem.type]( arg0, elem, what ) );
            } );
            return res;
        };


_func.binarySearch = function ( sElem, arrTagert, regExp ) {
    var first = 0, /* Номер первого элемента в массиве */
        last = arrTagert.length - 1, /* Номер элемента в массиве, СЛЕДУЮЩЕГО ЗА последним */
    /* Если просматриваемый участок непустой, first<last */
        mid;

    var arrTagertOneType = [], isString = false;

    for ( var i = 0; i < arrTagert.length; i++ ) {
        if ( (arrTagert[i] instanceof cString || sElem instanceof cString) && !isString ) {
            i = 0;
            isString = true;
            sElem = new cString( sElem.toString().toLowerCase() );
        }
        if ( isString ) {
            arrTagertOneType[i] = new cString( arrTagert[i].toString().toLowerCase() );
        }
        else {
            arrTagertOneType[i] = arrTagert[i].tocNumber();
        }
    }

    if ( arrTagert.length === 0 ) {
        return -1;
        /* массив пуст */
    }
    else if ( arrTagert[0].value > sElem.value ) {
        return -2;
    }
    else if ( arrTagert[arrTagert.length - 1].value < sElem.value ) {
        return arrTagert.length - 1;
    }

    while ( first < last ) {
        mid = Math.floor( first + (last - first) / 2 );
        if ( sElem.value <= arrTagert[mid].value || ( regExp && regExp.test( arrTagert[mid].value ) ) ) {
            last = mid;
        }
        else {
            first = mid + 1;
        }
    }

    /* Если условный оператор if(n==0) и т.д. в начале опущен - значит, тут раскомментировать!    */
    if ( /* last<n &&*/ arrTagert[last].value === sElem.value ) {
        return last;
        /* Искомый элемент найден. last - искомый индекс */
    }
    else {
        return last - 1;
        /* Искомый элемент не найден. Но если вам вдруг надо его вставить со сдвигом, то его место - last.    */
    }

};

_func[cElementType.number][cElementType.cell] = function ( arg0, arg1, what, cellAddress ) {
    var ar1 = arg1.tocNumber();
    switch ( what ) {
        case ">":
        {
            return new cBool( arg0.getValue() > ar1.getValue() );
        }
        case ">=":
        {
            return new cBool( arg0.getValue() >= ar1.getValue() );
        }
        case "<":
        {
            return new cBool( arg0.getValue() < ar1.getValue() );
        }
        case "<=":
        {
            return new cBool( arg0.getValue() <= ar1.getValue() );
        }
        case "=":
        {
            return new cBool( arg0.getValue() === ar1.getValue() );
        }
        case "<>":
        {
            return new cBool( arg0.getValue() !== ar1.getValue() );
        }
        case "-":
        {
            return new cNumber( arg0.getValue() - ar1.getValue() );
        }
        case "+":
        {
            return new cNumber( arg0.getValue() + ar1.getValue() );
        }
        case "/":
        {
            if ( arg1.getValue() !== 0 ) {
                return new cNumber( arg0.getValue() / ar1.getValue() );
            }
            else {
                return new cError( cErrorType.division_by_zero );
            }
        }
        case "*":
        {
            return new cNumber( arg0.getValue() * ar1.getValue() );
        }
        default:
        {
            return new cError( cErrorType.wrong_value_type );
        }
    }

};
_func[cElementType.cell][cElementType.number] = function ( arg0, arg1, what, cellAddress ) {
    var ar0 = arg0.tocNumber();
    switch ( what ) {
        case ">":
        {
            return new cBool( ar0.getValue() > arg1.getValue() );
        }
        case ">=":
        {
            return new cBool( ar0.getValue() >= arg1.getValue() );
        }
        case "<":
        {
            return new cBool( ar0.getValue() < arg1.getValue() );
        }
        case "<=":
        {
            return new cBool( ar0.getValue() <= arg1.getValue() );
        }
        case "=":
        {
            return new cBool( ar0.getValue() === arg1.getValue() );
        }
        case "<>":
        {
            return new cBool( ar0.getValue() !== arg1.getValue() );
        }
        case "-":
        {
            return new cNumber( ar0.getValue() - arg1.getValue() );
        }
        case "+":
        {
            return new cNumber( ar0.getValue() + arg1.getValue() );
        }
        case "/":
        {
            if ( arg1.getValue() !== 0 ) {
                return new cNumber( ar0.getValue() / arg1.getValue() );
            }
            else {
                return new cError( cErrorType.division_by_zero );
            }
        }
        case "*":
        {
            return new cNumber( ar0.getValue() * arg1.getValue() );
        }
        default:
        {
            return new cError( cErrorType.wrong_value_type );
        }
    }
};
_func[cElementType.cell][cElementType.cell] = function ( arg0, arg1, what, cellAddress ) {
    var ar0 = arg0.tocNumber();
    switch ( what ) {
        case ">":
        {
            return new cBool( ar0.getValue() > arg1.getValue() );
        }
        case ">=":
        {
            return new cBool( ar0.getValue() >= arg1.getValue() );
        }
        case "<":
        {
            return new cBool( ar0.getValue() < arg1.getValue() );
        }
        case "<=":
        {
            return new cBool( ar0.getValue() <= arg1.getValue() );
        }
        case "=":
        {
            return new cBool( ar0.getValue() === arg1.getValue() );
        }
        case "<>":
        {
            return new cBool( ar0.getValue() !== arg1.getValue() );
        }
        case "-":
        {
            return new cNumber( ar0.getValue() - arg1.getValue() );
        }
        case "+":
        {
            return new cNumber( ar0.getValue() + arg1.getValue() );
        }
        case "/":
        {
            if ( arg1.getValue() !== 0 ) {
                return new cNumber( ar0.getValue() / arg1.getValue() );
            }
            else {
                return new cError( cErrorType.division_by_zero );
            }
        }
        case "*":
        {
            return new cNumber( ar0.getValue() * arg1.getValue() );
        }
        default:
        {
            return new cError( cErrorType.wrong_value_type );
        }
    }
};

_func[cElementType.cellsRange3D] = _func[cElementType.cellsRange];
_func[cElementType.cell3D] = _func[cElementType.cell]


/** класс отвечающий за парсинг строки с формулой, подсчета формулы, перестройки формулы при манипуляции с ячейкой*/
/** @constructor */
function parserFormula( formula, _cellId, _ws ) {
    this.is3D = false;
    this.cellId = _cellId;
    this.cellAddress = g_oCellAddressUtils.getCellAddress( this.cellId );
    this.ws = _ws;
    this.wb = this.ws.workbook;
    this.value = null;
    this.outStack = [];
    this.error = [];
    this.Formula = formula;
    this.FormulaLocale = null;
    this.isParsed = false;
    //для функции parse и parseDiagramRef
    this.pCurrPos = 0;
    this.elemArr = [];
    this.RefPos = [];
    this.operand_str = null;
    this.parenthesesNotEnough = false;
    this.f = [];
    this.reRowCol = new RegExp( "^(ROW|ROWS|COLUMN|COLUMNS)$", "gi" );
    this.regSpace = /\$/g;
    this.countRef = 0;
}

parserFormula.prototype = {

    /** @type parserFormula */
    constructor: parserFormula,

    clone: function ( formula, cellId, ws ) {
        if ( null == formula )
            formula = this.Formula;
        if ( null == cellId )
            cellId = this.cellId;
        if ( null == ws )
            ws = this.ws;
        var oRes = new parserFormula( formula, cellId, ws );
        oRes.is3D = this.is3D;
        oRes.value = this.value;
        oRes.pCurrPos = this.pCurrPos;
        oRes.elemArr = [];
        for ( var i = 0, length = this.outStack.length; i < length; i++ ) {
            var oCurElem = this.outStack[i];
            if ( oCurElem.clone )
                oRes.outStack.push( oCurElem.clone() );
            else
                oRes.outStack.push( oCurElem );
        }
        oRes.RefPos = [];
        oRes.operand_str = this.operand_str;
        oRes.error = this.error.concat();
        oRes.isParsed = this.isParsed;
        return oRes;
    },

    setFormula: function ( formula ) {
        this.Formula = formula;
        this.is3D = false;
        this.value = null;
        this.outStack = [];
        this.error = [];
        this.FormulaLocale = null;
        this.isParsed = false;
        //для функции parse и parseDiagramRef
        this.pCurrPos = 0;
        this.elemArr = [];
        this.RefPos = [];
        this.operand_str = null;
        this.parenthesesNotEnough = false;
        this.f = [];
        this.countRef = 0;
    },

    setCellId: function ( cellId ) {
        this.cellId = cellId;
        this.cellAddress = g_oCellAddressUtils.getCellAddress( cellId );
    },

    parse: function ( local, digitDelim ) {

        function checkAbsRef( operand_str, found_operand ) {

            var splitOpStr0 = operand_str.match( /\$/g ) || [];

            found_operand.isAbsolute = true;

            switch ( splitOpStr0.length ) {
                case 1:
                    if ( operand_str.indexOf( "$" ) > 0 ) {
                        found_operand.isAbsoluteRow1 = true;
                    }
                    else {
                        found_operand.isAbsoluteCol1 = true;
                    }
                    break;
                case 2:
                    found_operand.isAbsoluteCol1 = true;
                    found_operand.isAbsoluteRow1 = true;
                    break;
            }

        }

        function checkAbsArea( operand_str, found_operand ) {
            var splitOpStr = operand_str.split( ":" ),
                splitOpStr0 = splitOpStr[0].match( /\$/g ) || [],
                splitOpStr1 = splitOpStr[1].match( /\$/g ) || [];

            found_operand.isAbsolute = true;

            switch ( splitOpStr0.length ) {
                case 1:
                    if ( splitOpStr[0].indexOf( "$" ) > 0 ) {
                        found_operand.isAbsoluteRow1 = true;
                    }
                    else {
                        found_operand.isAbsoluteCol1 = true;
                    }
                    break;
                case 2:
                    found_operand.isAbsoluteCol1 = true;
                    found_operand.isAbsoluteRow1 = true;
                    break;
            }

            switch ( splitOpStr1.length ) {
                case 1:
                    if ( splitOpStr[1].indexOf( "$" ) > 0 ) {
                        found_operand.isAbsoluteRow2 = true;
                    }
                    else {
                        found_operand.isAbsoluteCol2 = true;
                    }
                    break;
                case 2:
                    found_operand.isAbsoluteCol2 = true;
                    found_operand.isAbsoluteRow2 = true;
                    break;
            }
        }

        this.pCurrPos = 0;

        if ( this.isParsed )
            return this.isParsed;
        /*
         Парсер формулы реализует алгоритм перевода инфиксной формы записи выражения в постфиксную или Обратную Польскую Нотацию.
         Что упрощает вычисление результата формулы.
         При разборе формулы важен порядок проверки очередной части выражения на принадлежность тому или иному типу.
         */
        this.operand_expected = true;
        var wasLeftParentheses = false, wasRigthParentheses = false,
            found_operand = null, _3DRefTmp = null, _tableTMP = null;
        var cFormulaList = (local && cFormulaFunctionLocalized) ? cFormulaFunctionLocalized : cFormulaFunction;
        while ( this.pCurrPos < this.Formula.length ) {
            this.operand_str = this.Formula[this.pCurrPos];
            /*if ( parserHelp.isControlSymbols.call( this, this.Formula, this.pCurrPos )){
             console.log("!");
             continue;
             }*/

            /* Operators*/
            if ( parserHelp.isOperator.call( this, this.Formula, this.pCurrPos ) || parserHelp.isNextPtg.call( this, this.Formula, this.pCurrPos ) ) {
                wasLeftParentheses = false;
                wasRigthParentheses = false;
                found_operator = null;

                if ( this.operand_expected ) {
                    if ( this.operand_str == "-" ) {
                        this.operand_expected = true;
                        found_operator = new cFormulaOperators['un_minus']();
                    }
                    else if ( this.operand_str == "+" ) {
                        this.operand_expected = true;
                        found_operator = new cFormulaOperators['un_plus']();
                    }
					else if( this.operand_str == " " ){
						continue;
					}
                    else {
                        this.error.push( c_oAscError.ID.FrmlWrongOperator );
                        this.outStack = [];
                        this.elemArr = [];
                        return false;
                    }
                }
                else if ( !this.operand_expected ) {
                    if ( this.operand_str == "-" ) {
                        this.operand_expected = true;
                        found_operator = new cFormulaOperators['-']();
                    }
                    else if ( this.operand_str == "+" ) {
                        this.operand_expected = true;
                        found_operator = new cFormulaOperators['+']();
                    }
                    else if ( this.operand_str == ":" ) {
                        this.operand_expected = true;
                        found_operator = new cFormulaOperators[':']();
                    }
                    else if ( this.operand_str == "%" ) {
                        this.operand_expected = false;
                        found_operator = new cFormulaOperators['%']();
                    }
					else if ( this.operand_str == " " && this.pCurrPos == this.Formula.length) {
						continue;
					}
                    else {
                        if ( this.operand_str in cFormulaOperators ) {
                            found_operator = new cFormulaOperators[this.operand_str]();
                            this.operand_expected = true;
                        }
                        else {
                            this.error.push( c_oAscError.ID.FrmlWrongOperator );
                            this.outStack = [];
                            this.elemArr = [];
                            return false;
                        }
                    }
                }

                while ( this.elemArr.length != 0 && (
                    found_operator.isRightAssociative ?
                        ( found_operator.priority < this.elemArr[this.elemArr.length - 1].priority ) :
                        ( found_operator.priority <= this.elemArr[this.elemArr.length - 1].priority )
                    )
                    ) {
                    this.outStack.push( this.elemArr.pop() );
                }
                this.elemArr.push( found_operator );
                this.f.push( found_operator );
                found_operand = null;
            }

            /* Left & Right Parentheses */
            else if ( parserHelp.isLeftParentheses.call( this, this.Formula, this.pCurrPos ) ) {
                if ( wasRigthParentheses || found_operand ) {
                    this.elemArr.push( new cMultOperator() );
                }
                this.operand_expected = true;
                wasLeftParentheses = true;
                wasRigthParentheses = false;
                found_operand = null;
                this.elemArr.push( new cFormulaOperators[this.operand_str]() );
                this.f.push( new cFormulaOperators[this.operand_str]() );
            }

            else if ( parserHelp.isRightParentheses.call( this, this.Formula, this.pCurrPos ) ) {
                this.f.push( new cFormulaOperators[this.operand_str]() );
                wasRigthParentheses = true;
                var top_elem = null;
                if ( this.elemArr.length != 0 && ( (top_elem = this.elemArr[this.elemArr.length - 1]).name == "(" ) && this.operand_expected ) {
                    if ( top_elem.getArguments() > 1 ) {
                        this.outStack.push( new cEmpty() );
                    }
                    else {
                        top_elem.DecrementArguments();
                    }
                }
                else {
                    while ( this.elemArr.length != 0 && !((top_elem = this.elemArr[this.elemArr.length - 1]).name == "(" ) ) {
                        if ( top_elem.name in cFormulaOperators && this.operand_expected ) {
                            this.error.push( c_oAscError.ID.FrmlOperandExpected );
                            this.outStack = [];
                            this.elemArr = [];
                            return false;
                        }
                        this.outStack.push( this.elemArr.pop() );
                    }
                }

                if ( this.elemArr.length == 0 || top_elem == null/* && !wasLeftParentheses */ ) {
                    this.outStack = [];
                    this.elemArr = [];
                    this.error.push( c_oAscError.ID.FrmlWrongCountParentheses );
                    return false;
                }

                var p = top_elem, func;
                this.elemArr.pop();
                if ( this.elemArr.length != 0 && ( func = this.elemArr[this.elemArr.length - 1] ).type == cElementType.func ) {
                    p = this.elemArr.pop();
                    if ( top_elem.getArguments() > func.getMaxArguments() ) {
                        this.outStack = [];
                        this.elemArr = [];
                        this.error.push( c_oAscError.ID.FrmlWrongMaxArgument );
                        return false;
                    }
                    else {
                        if ( top_elem.getArguments() >= func.getMinArguments() ) {
                            func.setArgumentsCount( top_elem.getArguments() );
                        }
                        else {
                            this.outStack = [];
                            this.elemArr = [];
                            this.error.push( c_oAscError.ID.FrmlWrongCountArgument );
                            return false;
                        }
                    }
                }
                else {
                    if ( wasLeftParentheses && (!this.elemArr[this.elemArr.length - 1] || this.elemArr[this.elemArr.length - 1].name == "(" ) ) {
                        this.outStack = [];
                        this.elemArr = [];
                        this.error.push( c_oAscError.ID.FrmlAnotherParsingError );
                        return false;
                    }
                    // for (int i = 0; i < left_p.ParametersNum - 1; ++i)
                    // {
                    // ptgs_list.AddFirst(new PtgUnion()); // чета нужно добавить для Union.....
                    // }
                }
                this.outStack.push( p );
                this.operand_expected = false;
                wasLeftParentheses = false;
            }

            /*Comma & arguments union*/
            else if ( parserHelp.isComma.call( this, this.Formula, this.pCurrPos ) ) {
                wasLeftParentheses = false;
                wasRigthParentheses = false;
                var stackLength = this.elemArr.length, top_elem = null;

                if ( this.elemArr.length != 0 && this.elemArr[stackLength - 1].name == "(" && this.operand_expected ) {
                    this.outStack.push( new cEmpty() );
                    top_elem = this.elemArr[stackLength - 1];
                    wasLeftParentheses = true;
                    this.operand_expected = false;
                }
                else {
                    while ( stackLength != 0 ) {
                        top_elem = this.elemArr[stackLength - 1];
                        if ( top_elem.name == "(" ) {
                            wasLeftParentheses = true;
                            break;
                        }
                        else {
                            this.outStack.push( this.elemArr.pop() );
                            stackLength = this.elemArr.length;
                        }
                    }
                }

                if ( this.operand_expected ) {
                    this.error.push( c_oAscError.ID.FrmlWrongOperator );
                    this.outStack = [];
                    this.elemArr = [];
                    return false;
                }

                if ( !wasLeftParentheses ) {
                    this.error.push( c_oAscError.ID.FrmlWrongCountParentheses );
                    this.outStack = [];
                    this.elemArr = [];
                    return false;
                }
                top_elem.IncrementArguments();
                this.operand_expected = true;
            }

            /* Array */
            else if ( parserHelp.isLeftBrace.call(this, this.Formula, this.pCurrPos) ) {
                wasLeftParentheses = false;
                wasRigthParentheses = false;
                var arr = new cArray(), operator = { isOperator: false, operatorName: ""};
                while ( this.pCurrPos < this.Formula.length && !parserHelp.isRightBrace.call(this, this.Formula, this.pCurrPos) ) {
                    if ( parserHelp.isArraySeparator.call( this, this.Formula, this.pCurrPos, digitDelim ) ) {
                        if ( this.operand_str == (digitDelim ? arrayRowSeparator : arrayRowSeparatorDef) ) {
                            arr.addRow();
                        }
                    }
                    else if ( parserHelp.isBoolean.call( this, this.Formula, this.pCurrPos, local ) ) {
                        arr.addElement( new cBool( this.operand_str ) );
                    }
                    else if ( parserHelp.isString.call( this, this.Formula, this.pCurrPos ) ) {
                        arr.addElement( new cString( this.operand_str ) );
                    }
                    else if ( parserHelp.isError.call( this, this.Formula, this.pCurrPos ) ) {
                        arr.addElement( new cError( this.operand_str ) );
                    }
                    else if ( parserHelp.isNumber.call( this, this.Formula, this.pCurrPos, digitDelim ) ) {
                        if ( operator.isOperator ) {
                            if ( operator.operatorName == "+" || operator.operatorName == "-" ) {
								this.operand_str = operator.operatorName + "" + this.operand_str
                            }
                            else {
                                this.outStack = [];
                                this.elemArr = [];
                                this.error.push( c_oAscError.ID.FrmlAnotherParsingError );
                                return false;
                            }
                        }
                        arr.addElement( new cNumber( parseFloat( this.operand_str ) ) );
                        operator = { isOperator: false, operatorName: ""};
                    }
                    else if ( parserHelp.isOperator.call( this, this.Formula, this.pCurrPos ) ) {
                        operator.isOperator = true;
                        operator.operatorName = this.operand_str;
                    }
					else{
						this.outStack = [];
						this.elemArr = [];
						/*в массиве используется недопустимый параметр*/
						this.error.push( c_oAscError.ID.FrmlAnotherParsingError );
						return false;
					}
                }
                if ( !arr.isValidArray() ) {
                    this.outStack = [];
                    this.elemArr = [];
					/*размер массива не согласован*/
                    this.error.push( c_oAscError.ID.FrmlAnotherParsingError );
                    return false;
                }
                this.outStack.push( arr );
                this.operand_expected = false;
            }

            /* Operands*/
            else {

                found_operand = null;

                if ( wasRigthParentheses ) {
                    this.operand_expected = true;
                }

                if ( !this.operand_expected ) {
                    this.error.push( c_oAscError.ID.FrmlWrongOperator );
                    this.outStack = [];
                    this.elemArr = [];
                    return false;
                }

                /* Booleans */
                if ( parserHelp.isBoolean.call( this, this.Formula, this.pCurrPos, local ) ) {
                    found_operand = new cBool( this.operand_str );
                }

                /* Strings */
                else if ( parserHelp.isString.call( this, this.Formula, this.pCurrPos ) ) {
                    found_operand = new cString( this.operand_str );
                }

                /* Errors */
                else if ( parserHelp.isError.call( this, this.Formula, this.pCurrPos ) ) {
                    found_operand = new cError( this.operand_str );
                }

                /* Referens to 3D area: Sheet1:Sheet3!A1:B3, Sheet1:Sheet3!B3, Sheet1!B3*/
                else if ( (_3DRefTmp = parserHelp.is3DRef.call( this, this.Formula, this.pCurrPos ))[0] ) {

                    this.is3D = true;
                    var _wsFrom = _3DRefTmp[1],
                        _wsTo = ( (_3DRefTmp[2] !== null) && (_3DRefTmp[2] !== undefined) ) ? _3DRefTmp[2] : _wsFrom,
                        wsF = this.wb.getWorksheetByName( _wsFrom ),
                        wsT = this.wb.getWorksheetByName( _wsTo ),
                        pos = {start: this.pCurrPos - this.operand_str.length - 1, end: this.pCurrPos, index: this.outStack.length};

                    if ( !(wsF && wsT) ) {
                        this.error.push( c_oAscError.ID.FrmlWrongReferences );
                        this.outStack = [];
                        this.elemArr = [];
                        return false;
                    }
                    if ( parserHelp.isArea.call( this, this.Formula, this.pCurrPos ) ) {
                        pos.end = this.pCurrPos;
                        found_operand = new cArea3D( this.operand_str.toUpperCase(), _wsFrom, _wsTo, this.wb );
                        pos.oper = found_operand;
                        this.RefPos.push( pos );
                        checkAbsArea( this.operand_str, found_operand );
                    }
                    else if ( parserHelp.isRef.call( this, this.Formula, this.pCurrPos ) ) {
                        pos.end = this.pCurrPos;
                        if ( _wsTo != _wsFrom ) {
                            found_operand = new cArea3D( this.operand_str.toUpperCase(), _wsFrom, _wsTo, this.wb );
                            pos.oper = found_operand;
                        }
                        else {
                            found_operand = new cRef3D( this.operand_str.toUpperCase(), _wsFrom, this.wb );
                            pos.oper = found_operand;
                        }
                        this.RefPos.push( pos );
                        if ( this.operand_str.indexOf( "$" ) > -1 ) {
                            checkAbsRef( this.operand_str, found_operand );
                        }
                    }
                    else if ( parserHelp.isName.call( this, this.Formula, this.pCurrPos ) ) {
                        found_operand = new cName3D( this.operand_str, _wsFrom, this.wb, wsF );
                    }
                    this.countRef++;
                }

                /* Referens to cells area A1:A10 */
                else if ( parserHelp.isArea.call( this, this.Formula, this.pCurrPos ) ) {
                    found_operand = new cArea( this.operand_str.toUpperCase(), this.ws );
                    this.RefPos.push( {start:this.pCurrPos - this.operand_str.length, end:this.pCurrPos, index:this.outStack.length, oper:found_operand } );
                    if ( this.operand_str.indexOf( "$" ) > -1 ) {
                        checkAbsArea( this.operand_str, found_operand );
                    }
                    this.countRef++;
                }
                /* Referens to cell A4 */
                else if ( parserHelp.isRef.call( this, this.Formula, this.pCurrPos ) ) {
                    found_operand = new cRef( this.operand_str.toUpperCase(), this.ws );
                    this.RefPos.push( {start:this.pCurrPos - this.operand_str.length, end:this.pCurrPos, index:this.outStack.length, oper:found_operand } );
                    if ( this.operand_str.indexOf( "$" ) > -1 ) {
                        checkAbsRef( this.operand_str, found_operand )
                    }
                    this.countRef++;
                }

                else if ( _tableTMP = parserHelp.isTable.call( this, this.Formula, this.pCurrPos, local ) ) {
                    found_operand = new cStrucTable( _tableTMP, this.wb, this.ws, this.ws.getCell( this.cellAddress ) );

					if(found_operand.type==cElementType.error) {
						/*используется неверный именованный диапазон или таблица*/
						this.error.push( c_oAscError.ID.FrmlAnotherParsingError );
						this.outStack = [];
						this.elemArr = [];
						return false;
					}

                    this.RefPos.push( {start: this.pCurrPos - this.operand_str.length, end: this.pCurrPos, index: this.outStack.length, isName: true, oper:found_operand } );
                    this.countRef++;
                }

                /* Referens to DefinedNames */
                else if ( parserHelp.isName.call( this, this.Formula, this.pCurrPos, this.wb, this.ws )[0] ) {
                    found_operand = new cName( this.operand_str, this.wb, this.ws );
                    if ( found_operand.defName && found_operand.defName.isTable ) {
                        found_operand = new cStrucTable( parserHelp.isTable( this.operand_str + "[]", 0 ), this.wb, this.ws, this.ws.getCell( this.cellAddress ) );
                    }
					this.RefPos.push( {start:this.pCurrPos - this.operand_str.length, end:this.pCurrPos, index:this.outStack.length, isName: true, oper:found_operand } );
                    this.countRef++;
                }

                /* Numbers*/
                else if ( parserHelp.isNumber.call( this, this.Formula, this.pCurrPos, digitDelim ) ) {
                    if ( this.operand_str != "." ) {
                        found_operand = new cNumber( parseFloat( this.operand_str ) );
                    }
                    else {
                        this.error.push( c_oAscError.ID.FrmlAnotherParsingError );
                        this.outStack = [];
                        this.elemArr = [];
                        return false;
                    }
                }

                /* Function*/
                else if ( parserHelp.isFunc.call( this, this.Formula, this.pCurrPos ) ) {

                    if ( wasRigthParentheses && this.operand_expected ) {
                        this.elemArr.push( new cMultOperator() );
                    }

                    var found_operator = null, operandStr = this.operand_str.replace( rx_sFuncPref, "" ).toUpperCase();
                    if ( operandStr in cFormulaList )
                        found_operator = new cFormulaList[operandStr]();
                    else if ( operandStr in cAllFormulaFunction ) {
                        found_operator = new cAllFormulaFunction[operandStr]();
                    }
                    else {
                        found_operator = new cBaseFunction( operandStr );
                        found_operator.isXLFN = ( this.operand_str.indexOf( "_xlfn." ) === 0 );
                    }

                    if ( found_operator != null ) {
                        this.elemArr.push( found_operator );
                        this.f.push( found_operator );
                    }
                    else {
                        this.error.push( c_oAscError.ID.FrmlWrongFunctionName );
                        this.outStack = [];
                        this.elemArr = [];
                        return false;
                    }
                    this.operand_expected = false;
                    wasRigthParentheses = false;
                    continue;
                }

                if ( found_operand != null && found_operand != undefined ) {
                    this.outStack.push( found_operand );
                    this.f.push( found_operand );
                    this.operand_expected = false;
                    found_operand = null
                }
                else {
                    if ( this.operand_str == null || this.operand_str == "'" ) {
                        this.outStack.push( new cError( cErrorType.wrong_name ) );
                        this.error.push( c_oAscError.ID.FrmlAnotherParsingError );
                        return this.isParsed = false;
                    }
                    if ( parserHelp.isName.call( this, this.Formula, this.pCurrPos, this.wb, this.ws )[0] ) {
                        this.outStack.push( new cName( this.operand_str, this.wb ) );
                    }

                    this.operand_expected = false;
                    if ( this.operand_str != null ) {
                        if ( this.operand_str == '"' ) {
                            continue;
                        }
                        this.pCurrPos += this.operand_str.length;
                    }
                }
                if ( wasRigthParentheses ) {
                    this.elemArr.push( new cMultOperator() );
                }
                wasLeftParentheses = false;
                wasRigthParentheses = false;
            }

        }
        if ( this.operand_expected ) {
            this.outStack = [];
            this.elemArr = [];
            this.error.push( c_oAscError.ID.FrmlOperandExpected );
            return false;
        }
        var operand, parenthesesNotEnough = false;
        while ( this.elemArr.length != 0 ) {
            operand = this.elemArr.pop();
            if ( operand.name == "(" && !this.parenthesesNotEnough ) {
                this.Formula += ")";
                parenthesesNotEnough = true;
            }
            else if ( operand.name == "(" || operand.name == ")" ) {
                this.outStack = [];
                this.elemArr = [];
                this.error.push( c_oAscError.ID.FrmlWrongCountParentheses );
                return false;
            }
            else {
                this.outStack.push( operand );
            }
        }
        this.parenthesesNotEnough = parenthesesNotEnough;
        if ( this.parenthesesNotEnough ) {
            this.error.push( c_oAscError.ID.FrmlParenthesesCorrectCount );
            return this.isParsed = false;
        }

        if ( this.outStack.length != 0 ) {
            return this.isParsed = true;
        }
        else {
            return this.isParsed = false;
        }
    },

    calculate   : function ( isDefName ) {
        if ( this.outStack.length < 1 ) {
            return this.value = new cError( cErrorType.wrong_name );
        }
        var elemArr = [], _tmp, numFormat = -1, currentElement = null;
        for ( var i = 0; i < this.outStack.length; i++ ) {
            currentElement = this.outStack[i];
            if ( currentElement.name == "(" ) {
                continue;
            }
            if ( currentElement.type == cElementType.operator || currentElement.type == cElementType.func ) {
                if ( elemArr.length < currentElement.getArguments() ) {
                    elemArr = [];
                    return this.value = new cError( cErrorType.unsupported_function );
                }
                else {
                    var arg = [];
                    for ( var ind = 0; ind < currentElement.getArguments(); ind++ ) {
                        arg.unshift( elemArr.pop() );
                    }
                    _tmp = currentElement.Calculate( arg, this.ws.getCell( this.cellAddress ), isDefName, this.ws?this.ws.getId():undefined );
                    if ( _tmp.numFormat !== undefined && _tmp.numFormat !== null ) {
                        numFormat = _tmp.numFormat; //> numFormat ? _tmp.numFormat : numFormat;
                    }
                    else if ( numFormat < 0 || currentElement.numFormat < currentElement.formatType.def ) {
                        numFormat = currentElement.numFormat;
                    }
                    elemArr.push( _tmp );
                }
            }
            else if ( currentElement.type == cElementType.name || currentElement.type == cElementType.name3D ) {
                elemArr.push( currentElement.Calculate() );
            }
            else if ( currentElement.type == cElementType.table ) {
                elemArr.push( currentElement.toRef() );
            }
            else {
                elemArr.push( currentElement );
            }
        }
        this.value = elemArr.pop();
        this.value.numFormat = numFormat;
        return this.value;
    },

    /* Метод возвращает все ссылки на ячейки которые участвуют в формуле*/
    getRef      : function () {
        var aOutRef = [];
        for ( var i = 0; i < this.outStack.length; i++ ) {
            var ref = this.outStack[i];
            if ( ref instanceof cName || ref instanceof cName3D ) {
                ref = ref.toRef( this.ws.getId() );
                if ( ref instanceof cError )
                    continue;
            }

            if ( ref instanceof cRef || ref instanceof cRef3D || ref instanceof cArea ) {
                aOutRef.push( {wsId: ref.getWsId(), cell: ref._cells} );
            }
            else if ( ref instanceof cArea3D ) {
                var wsR = ref.wsRange();
                for ( var j = 0; j < wsR.length; j++ )
                    aOutRef.push( {wsId: wsR[j].Id, cell: ref._cells} );
            }
        }
        return aOutRef;
    },

    /* Для обратной сборки функции иногда необходимо поменять ссылки на ячейки */
    changeOffset: function ( offset ) {//offset = {offsetCol:intNumber, offsetRow:intNumber}
        for ( var i = 0; i < this.outStack.length; i++ ) {
            if ( this.outStack[i] instanceof cRef || this.outStack[i] instanceof cRef3D || this.outStack[i] instanceof cArea ) {

                var r = this.outStack[i].getRange();
                if ( !r ) break;

                if ( this.outStack[i].isAbsolute ) {
                    this._changeOffsetHelper( this.outStack[i], offset );
                }
                else {
                    var a, b;
                    if ( this.outStack[i] instanceof cArea && (r.isColumn() && offset.offsetRow != 0 || r.isRow() && offset.offsetCol != 0) ) {
                        continue;
                    }
                    r.setOffset( offset );
                    if ( r.isColumn() ) {
                        a = r.first.getColLetter();
                        b = r.last.getColLetter();
                    }
                    else if ( r.isRow() ) {
                        a = r.first.getRow();
                        b = r.last.getRow();
                    }
                    else {
                        a = r.first.getID();
                        b = r.last.getID();
                    }


                    if ( a != b || this.outStack[i] instanceof cArea )
                        this.outStack[i].value = this.outStack[i]._cells = a + ":" + b;
                    else this.outStack[i].value = this.outStack[i]._cells = a;
                }
                continue;
            }
            if ( this.outStack[i] instanceof cArea3D ) {
                var r = this.outStack[i]._cells.indexOf( ":" ) > -1 ? (new cArea( this.outStack[i]._cells, this.ws )) : (new cRef( this.outStack[i]._cells, this.ws ));
                var _r = r.getRange();

                if ( !_r ) break;

                if ( this.outStack[i].isAbsolute ) {
                    this._changeOffsetHelper( r, offset );
                }
                else {
                    _r.setOffset( offset );
                    var a = _r.first.getID(),
                        b = _r.last.getID();
                    if ( a != b )
                        r.value = r._cells = a + ":" + b;
                    else r.value = r._cells = a;
                }
                this.outStack[i]._cells = r._cells;
            }
        }
        return this;
    },

    setRefError: function ( node ) {
        //когда выставляется setRefError node не сдвигаются, поэтому node.cellId совпадает с elem._cells
        for ( var i = 0; i < this.outStack.length; i++ ) {
            var elem = this.outStack[i];
            if ( elem instanceof cRef || elem instanceof cArea || elem instanceof cRef3D ) {
                if ( node.sheetId == elem.ws.getId() && node.cellId == elem._cells )
                    this.outStack[i] = new cError( cErrorType.bad_reference );
            }
            else if ( elem instanceof cArea3D ) {
                if ( elem.wsFrom == elem.wsTo && node.sheetId == elem.wsFrom && node.cellId == elem._cells )
                    this.outStack[i] = new cError( cErrorType.bad_reference );
            }
        }
    },
    /*
     Для изменения ссылок на конкретную ячейку.
     offset - на сколько сдвигаем ячейку (offset = {offsetCol:intNumber, offsetRow:intNumber})
     cellId - какую ячейку сдвигаем
     */
    shiftCells : function ( node, from, to ) {
        //node.cellId содержит уже сдвинутое значение
        var sFromName = from.getName(), elem;
        for ( var i = 0; i < this.outStack.length; i++ ) {
            elem = this.outStack[i];
            if ( elem instanceof cRef || elem instanceof cArea ) {
                sFromName = from.getAbsName2( elem.isAbsoluteCol1, elem.isAbsoluteRow1, elem.isAbsoluteCol2, elem.isAbsoluteRow2 );

                if ( node.sheetId == elem.ws.getId() && sFromName == elem._cells ) {
                    elem.value = elem._cells = node.bbox.getAbsName2( elem.isAbsoluteCol1, elem.isAbsoluteRow1, elem.isAbsoluteCol2, elem.isAbsoluteRow2 );
                    elem.range = elem.ws.getRange3( to.r1, to.c1, to.r2, to.c2 );
                }
            }
            else if ( elem instanceof cRef3D ) {
                sFromName = from.getAbsName2( elem.isAbsoluteCol1, elem.isAbsoluteRow1, elem.isAbsoluteCol2, elem.isAbsoluteRow2 );

                if ( node.sheetId == elem.ws.getId() && sFromName == elem._cells ) {
                    elem.value = elem._cells = node.bbox.getAbsName2( elem.isAbsoluteCol1, elem.isAbsoluteRow1, elem.isAbsoluteCol2, elem.isAbsoluteRow2 );
                }
            }
            else if ( elem instanceof cArea3D ) {

                sFromName = from.getAbsName2( elem.isAbsoluteCol1, elem.isAbsoluteRow1, elem.isAbsoluteCol2, elem.isAbsoluteRow2 );

                if ( elem.wsFrom == elem.wsTo && node.sheetId == elem.wsFrom && sFromName == elem._cells ) {
                    elem.value = elem._cells = node.bbox.getAbsName2( elem.isAbsoluteCol1, elem.isAbsoluteRow1, elem.isAbsoluteCol2, elem.isAbsoluteRow2 );
                }
            }
        }
    },

    stretchArea   : function ( node, from, to ) {
        //node.cellId содержит уже сдвинутое значение
        var sFromName = from.getName(), elem;
        for ( var i = 0; i < this.outStack.length; i++ ) {
            elem = this.outStack[i];
            if ( elem.type == cElementType.table ) {

                sFromName = from.getAbsName();

                if ( elem.area.wsFrom == elem.area.wsTo && node.sheetId == elem.area.wsFrom && sFromName == elem.area._cells ) {
                    elem.area.value = elem.area._cells = node.bbox.getAbsName();
//                    elem.area.range = elem.area.ws.getRange3( to.r1, to.c1, to.r2, to.c2 );
                }

            }
            else if ( elem.type == cElementType.cellsRange ) {

                sFromName = from.getAbsName2( elem.isAbsoluteCol1, elem.isAbsoluteRow1, elem.isAbsoluteCol2, elem.isAbsoluteRow2 );

                if ( node.sheetId == elem.ws.getId() && sFromName == elem._cells ) {
                    elem.value = elem._cells = node.bbox.getAbsName2( elem.isAbsoluteCol1, elem.isAbsoluteRow1, elem.isAbsoluteCol2, elem.isAbsoluteRow2 );
                    elem.range = elem.ws.getRange3( to.r1, to.c1, to.r2, to.c2 );
                }
            }
            else if ( elem.type == cElementType.cellsRange3D ) {

                sFromName = from.getAbsName2( elem.isAbsoluteCol1, elem.isAbsoluteRow1, elem.isAbsoluteCol2, elem.isAbsoluteRow2 );

                //node.cellId содержит уже сдвинутое значение
                if ( elem.wsFrom == elem.wsTo && node.sheetId == elem.wsFrom && sFromName == elem._cells ) {
                    elem.value = elem._cells = node.bbox.getAbsName2( elem.isAbsoluteCol1, elem.isAbsoluteRow1, elem.isAbsoluteCol2, elem.isAbsoluteRow2 );
                }
            }
        }
    },

    /* При переименовывании листа необходимо поменять название листа в соответствующих ссылках */
    changeSheet   : function ( lastName, newName ) {
        if ( this.is3D )
            for ( var i = 0; i < this.outStack.length; i++ ) {
                if ( this.outStack[i] instanceof cRef3D && this.outStack[i].ws.getName() == lastName ) {
                    this.outStack[i].changeSheet( lastName, newName );
                }
                if ( this.outStack[i] instanceof cArea3D ) {
                    this.outStack[i].changeSheet( lastName, newName );
                }
            }
        return this;
    },

    /* Сборка функции в инфиксную форму */
    assemble      : function ( rFormula ) {
        if ( !rFormula && this.outStack.length == 1 && this.outStack[this.outStack.length - 1] instanceof cError ) {
            return this.Formula;
        }
        var currentElement = null,
            _count = this.outStack.length,
            elemArr = new Array( _count ),
            res = undefined, _count_arg;
        for ( var i = 0, j = 0; i < _count; i++, j++ ) {
            currentElement = this.outStack[i];
            if ( currentElement.type == cElementType.operator || currentElement.type == cElementType.func ) {
                _count_arg = currentElement.getArguments();
                res = currentElement.Assemble2( elemArr, j - _count_arg, _count_arg );
                j -= _count_arg;
                elemArr[j] = res;
            }
            else {
                if ( currentElement instanceof cString ) {
                    currentElement = new cString( "\"" + currentElement.toString() + "\"" );
                }
                res = currentElement;
                elemArr[j] = res;
            }
        }
        if ( res != undefined && res != null ) {
            return res.toString();
        }
        else {
            return this.Formula;
        }
    },

    /* Сборка функции в инфиксную форму */
    assembleLocale: function ( locale, digitDelim ) {
        var currentElement = null,
            _count = this.outStack.length,
            elemArr = new Array( _count ),
            res = undefined, _count_arg;
        for ( var i = 0, j = 0; i < _count; i++, j++ ) {
            currentElement = this.outStack[i];
            if ( currentElement.type == cElementType.operator || currentElement.type == cElementType.func ) {
                _count_arg = currentElement.getArguments();
                res = currentElement.Assemble2Locale( elemArr, j - _count_arg, _count_arg, locale, digitDelim );
                j -= _count_arg;
                elemArr[j] = res;
            }
            else {
                if ( currentElement instanceof cString ) {
                    currentElement = new cString( "\"" + currentElement.toLocaleString( digitDelim ) + "\"" );
                }
                res = currentElement;
                elemArr[j] = res;
            }
        }
        if ( res != undefined && res != null ) {
            return res.toLocaleString( digitDelim );
        }
        else {
            return this.Formula;
        }
    },

    _changeOffsetHelper: function ( ref, offset ) {
        var m = ref._cells.match( /\$/g );
		if(!m){return;}
        if ( m.length == 1 ) {//для cRef, cRef3D, cArea. $A2, A$2, Sheet1!$A2, Sheet1!A$2, $A2:C4, A$2:C4, A2:$C4, A2:C$4.
            if ( !(ref instanceof cArea) ) {
                if ( ref._cells.indexOf( "$" ) == 0 ) {
                    r = ref.getRange();
                    r.setOffset( {offsetCol: 0, offsetRow: offset.offsetRow} );
                    ref.value = ref._cells = "$" + r.first.getID();
                }
                else {
                    r = ref.getRange();
                    r.setOffset( {offsetCol: offset.offsetCol, offsetRow: 0} );
                    ref.value = ref._cells = r.first.getColLetter() + "$" + r.first.getRow();
                }
            }
            else {
                var r = ref.getRange(),
                    c = ref._cells.split( ":" );// так как ссылка вида A1:A4, делим на первую и последнюю ячейку.
                // проверяем в какой ячеейке находится абсолютная ссылка.
                if ( c[0].indexOf( "$" ) > -1 ) {// если в первой ячейке
                    if ( c[0].indexOf( "$" ) == 0 ) {// абсолютна ли ссылка на столбец...
                        r.first.moveRow( offset.offsetRow );
                        r.last.moveCol( offset.offsetCol );
                        r.last.moveRow( offset.offsetRow );
                        ref.setRange( "$" + r.first.getColLetter() + r.first.getRow() + ":" + r.last.getColLetter() + r.last.getRow() );
                    }
                    else {// ... или абсолютна ссылка на строку
                        r.first.moveCol( offset.offsetCol );
                        r.last.moveCol( offset.offsetCol );
                        r.last.moveRow( offset.offsetRow );
                        ref.setRange( r.first.getColLetter() + "$" + r.first.getRow() + ":" + r.last.getColLetter() + r.last.getRow() );
                    }
                }
                else {// если в последней ячейке
                    if ( c[1].indexOf( "$" ) == 0 ) {// абсолютна ли ссылка на столбец...
                        r.first.moveCol( offset.offsetCol );
                        r.first.moveRow( offset.offsetRow );
                        r.last.moveRow( offset.offsetRow );
                        ref.setRange( r.first.getColLetter() + r.first.getRow() + ":" + "$" + r.last.getColLetter() + r.last.getRow() );
                    }
                    else {// ... или абсолютна ссылка на строку
                        r.first.moveCol( offset.offsetCol );
                        r.first.moveRow( offset.offsetRow );
                        r.last.moveCol( offset.offsetCol );
                        ref.setRange( r.first.getColLetter() + r.first.getRow() + ":" + r.last.getColLetter() + "$" + r.last.getRow() );
                    }
                }
            }
        }
        else if ( m.length == 2 ) {//для cArea. $A$2:C4, A2:$C$4, $A2:$C4, $A2:C$4, A$2:$C4, A$2:C$4.
            if ( ref instanceof cArea ) {
                var r = ref.getRange();
                var c = ref._cells.split( ":" );
                if ( c[1].indexOf( "$" ) < 0 ) {
                    r.last.moveCol( offset.offsetCol );
                    r.last.moveRow( offset.offsetRow );
                    ref.setRange( "$" + r.first.getColLetter() + "$" + r.first.getRow() + ":" + r.last.getColLetter() + r.last.getRow() );
                }
                else if ( c[0].indexOf( "$" ) < 0 ) {
                    r.first.moveCol( offset.offsetCol );
                    r.first.moveRow( offset.offsetRow );
                    ref.setRange( r.first.getColLetter() + r.first.getRow() + ":" + "$" + r.last.getColLetter() + "$" + r.last.getRow() );
                }
                else {
                    if ( c[0].indexOf( "$" ) == 0 && c[1].indexOf( "$" ) == 0 ) {
                        r.first.moveRow( offset.offsetRow );
                        r.last.moveRow( offset.offsetRow );
                        ref.setRange( "$" + r.first.getColLetter() + r.first.getRow() + ":" + "$" + r.last.getColLetter() + r.last.getRow() );
                    }
                    else if ( c[0].indexOf( "$" ) == 0 && c[1].indexOf( "$" ) > 0 ) {
                        r.first.moveRow( offset.offsetRow );
                        r.last.moveCol( offset.offsetCol );
                        ref.setRange( "$" + r.first.getColLetter() + r.first.getRow() + ":" + r.last.getColLetter() + "$" + r.last.getRow() );
                    }
                    else if ( c[0].indexOf( "$" ) > 0 && c[1].indexOf( "$" ) == 0 ) {
                        r.first.moveCol( offset.offsetCol );
                        r.last.moveRow( offset.offsetRow );
                        ref.setRange( r.first.getColLetter() + "$" + r.first.getRow() + ":" + "$" + r.last.getColLetter() + r.last.getRow() );
                    }
                    else {
                        r.first.moveCol( offset.offsetCol );
                        r.last.moveCol( offset.offsetCol );
                        ref.setRange( r.first.getColLetter() + "$" + r.first.getRow() + ":" + r.last.getColLetter() + "$" + r.last.getRow() );
                    }
                }
            }
        }
        else if ( m.length == 3 ) {//для cArea. $A$2:$C4, $A$2:C$4, $A2:$C$4, A$2:$C$4,
            if ( ref instanceof cArea ) {
                var r = ref.getRange();
                var c = ref._cells.split( ":" );
                if ( c[0].match( /\$/g ).length == 2 && c[1].indexOf( "$" ) == 0 ) {
                    r.last.moveRow( offset.offsetRow );
                    ref.setRange( "$" + r.first.getColLetter() + "$" + r.first.getRow() + ":" + "$" + r.last.getColLetter() + r.last.getRow() );
                }
                else if ( c[0].match( /\$/g ).length == 2 && c[1].indexOf( "$" ) > 0 ) {
                    r.last.moveCol( offset.offsetCol );
                    ref.setRange( "$" + r.first.getColLetter() + "$" + r.first.getRow() + ":" + r.last.getColLetter() + "$" + r.last.getRow() );
                }
                else if ( c[1].match( /\$/g ).length == 2 && c[0].indexOf( "$" ) == 0 ) {
                    r.first.moveRow( offset.offsetRow );
                    ref.setRange( "$" + r.first.getColLetter() + r.first.getRow() + ":" + "$" + r.last.getColLetter() + "$" + r.last.getRow() );
                }
                else if ( c[1].match( /\$/g ).length == 2 && c[0].indexOf( "$" ) > 0 ) {
                    r.first.moveCol( offset.offsetCol );
                    ref.setRange( r.first.getColLetter() + "$" + r.first.getRow() + ":" + "$" + r.last.getColLetter() + "$" + r.last.getRow() );
                }
            }
        }
    },

    insertSheet: function ( index ) {
        var bRes = false;
        for ( var i = 0; i < this.outStack.length; i++ ) {
            var elem = this.outStack[i];
            if ( elem instanceof cArea3D ) {
                var wsTo = this.wb.getWorksheetById( elem.wsTo );
                var wsToIndex = wsTo.getIndex();
                var wsFrom = this.wb.getWorksheetById( elem.wsFrom );
                var wsFromIndex = wsFrom.getIndex();
                if ( wsFromIndex <= index && index <= wsToIndex )
                    bRes = true;
            }
        }
        return bRes;
    },

    moveSheet: function ( tempW ) {
        var nRes = 0;
        for ( var i = 0; i < this.outStack.length; i++ ) {
            var elem = this.outStack[i];
            if ( elem instanceof cArea3D ) {
                var wsTo = this.wb.getWorksheetById( elem.wsTo );
                var wsToIndex = wsTo.getIndex();
                var wsFrom = this.wb.getWorksheetById( elem.wsFrom );
                var wsFromIndex = wsFrom.getIndex();
                if ( wsFromIndex <= tempW.wFI && tempW.wFI <= wsToIndex && 0 == nRes )
                    nRes = 1;
                if ( elem.wsFrom == tempW.wFId ) {
                    if ( tempW.wTI > wsToIndex ) {
                        nRes = 2;
                        var wsNext = this.wb.getWorksheet( wsFromIndex + 1 );
                        if ( wsNext )
                            this.outStack[i].changeSheet( tempW.wFN, wsNext.getName() );
                        else
                            this.outStack[i] = new cError( cErrorType.bad_reference );
                    }
                }
                else if ( elem.wsTo == tempW.wFId ) {
                    if ( tempW.wTI <= wsFromIndex ) {
                        nRes = 2;
                        var wsPrev = this.wb.getWorksheet( wsToIndex - 1 );
                        if ( wsPrev )
                            this.outStack[i].changeSheet( tempW.wFN, wsPrev.getName() );
                        else
                            this.outStack[i] = new cError( cErrorType.bad_reference );
                    }
                }
            }
        }
        return nRes;
    },

    removeSheet: function ( sheetId ) {
        var bRes = false;
        var ws = this.wb.getWorksheetById( sheetId );
        if ( ws ) {
            var wsIndex = ws.getIndex();
            var wsPrev = null;
            if ( wsIndex > 0 )
                wsPrev = this.wb.getWorksheet( wsIndex - 1 );
            var wsNext = null;
            if ( wsIndex < this.wb.getWorksheetCount() - 1 )
                wsNext = this.wb.getWorksheet( wsIndex + 1 );
            for ( var i = 0; i < this.outStack.length; i++ ) {
                var elem = this.outStack[i];
                if ( elem instanceof cArea3D ) {
                    if ( elem.wsFrom == sheetId ) {
                        bRes = true;
                        if ( elem.wsTo != sheetId && null != wsNext )
                            this.outStack[i].changeSheet( ws.getName(), wsNext.getName() );
                        else
                            this.outStack[i] = new cError( cErrorType.bad_reference );
                    }
                    else if ( elem.wsTo == sheetId && null != wsPrev ) {
                        this.outStack[i].changeSheet( ws.getName(), wsPrev.getName() );
                        bRes = true;
                    }
                }
                else if ( elem instanceof cRef3D ) {
                    if ( elem.ws.getId() == sheetId ) {
                        this.outStack[i] = new cError( cErrorType.bad_reference );
                        bRes = true;
                    }
                }
            }
        }
        return bRes;
    },

    buildDependencies: function ( nameReParse, defName ) {

        var node, ref, nTo, wsR;

        if ( !defName ) {
            node = this.wb.dependencyFormulas.addNode( this.ws.Id, this.cellId )
        }
        else {
            node = defName;
        }

        for ( var i = 0; i < this.outStack.length; i++ ) {
            ref = this.outStack[i];

			if ( ref.type == cElementType.table ) {
				nTo = ref.addDefinedNameNode( /*nameReParse*/ );
				this.wb.dependencyFormulas.addEdge2( node, nTo );
				ref = ref.toRef();
			}

            if ( (ref instanceof cRef || ref instanceof cRef3D || ref instanceof cArea || ref instanceof cArea3D) &&
                ref.isValid() && this.outStack[i + 1] && this.outStack[i + 1] instanceof cBaseFunction &&
                this.reRowCol.test( this.outStack[i + 1].name ) ) {
                this.reRowCol.lastIndex = 0;
                continue;
            }

            if ( ref.type == cElementType.name || ref.type == cElementType.name3D ) {
                nTo = ref.addDefinedNameNode( /*nameReParse*/ );
                this.wb.dependencyFormulas.addEdge2( node, nTo );
            }
            else if ( (ref instanceof cRef || ref instanceof cRef3D || ref instanceof cArea) && ref.isValid() ) {
                nTo = this.wb.dependencyFormulas.addNode( ref.getWsId(), ref._cells.replace( this.regSpace, "" ) );
                this.wb.dependencyFormulas.addEdge2( node, nTo );
            }
            else if ( ref instanceof cArea3D && ref.isValid() ) {
                wsR = ref.wsRange();
                for ( var j = 0; j < wsR.length; j++ ) {
                    this.wb.dependencyFormulas.addEdge2( node, this.wb.dependencyFormulas.addNode( wsR[j].Id, ref._cells.replace( this.regSpace, "" ) ) );
                }
            }
        }
    },

    parseDiagramRef: function () {
        var res = [
            []
        ];
        while ( this.pCurrPos < this.Formula.length ) {
            if ( parserHelp.isComma.call( this, this.Formula, this.pCurrPos ) ) {

                if ( this.operand_str == ";" ) {
                    res.push( [] )
                }

            }
            else {
                var _3DRefTmp = null;

                if ( (_3DRefTmp = parserHelp.is3DRef.call( this, this.Formula, this.pCurrPos ))[0] ) {
                    this.is3D = true;
                    var _wsFrom = _3DRefTmp[1],
                        _wsTo = ( (_3DRefTmp[2] !== null) && (_3DRefTmp[2] !== undefined) ) ? _3DRefTmp[2] : _wsFrom;

                    if ( parserHelp.isArea.call( this, this.Formula, this.pCurrPos ) ) {
                        res[res.length - 1].push( {sheetNameFrom: _wsFrom, sheetNameTo: _wsTo, ref: this.operand_str.toUpperCase()} )

                    }
                    else if ( parserHelp.isRef.call( this, this.Formula, this.pCurrPos ) ) {
                        res[res.length - 1].push( {sheetNameFrom: _wsFrom, sheetNameTo: _wsTo, ref: this.operand_str.toUpperCase()} )
                    }
                }
            }

        }
        return res;
    }

};

function parseNum( str ) {
    if ( str.indexOf( "x" ) > -1 || str == "" || str.match( /\s+/ ) )//исключаем запись числа в 16-ричной форме из числа.
        return false;
    return !isNaN( str );
}

function matching( x, y, oper ) {
    var res = false, rS;
    if ( y instanceof cString ) {
        rS = searchRegExp2( x.value, y.toString() );
        switch ( oper ) {
            case "<>":
                res = !rS;
                break;
            case "=":
            default:
                res = rS;
                break;
        }
    }
    else if ( typeof x === typeof y ) {
        switch ( oper ) {
            case "<>":
                res = (x.value != y.value);
                break;
            case ">":
                res = (x.value > y.value);
                break;
            case "<":
                res = (x.value < y.value);
                break;
            case ">=":
                res = (x.value >= y.value);
                break;
            case "<=":
                res = (x.value <= y.value);
                break;
            case "=":
            default:
                res = (x.value == y.value);
                break;
        }
    }
    return res;
}

function GetDiffDate360( nDay1, nMonth1, nYear1, nDay2, nMonth2, nYear2, bUSAMethod ) {
    var nDayDiff;
    var startTime = new Date( nYear1, nMonth1 - 1, nDay1 ),
        endTime = new Date( nYear2, nMonth2 - 1, nDay2 ),
        nY, nM, nD;

    if ( startTime > endTime ) {
        nY = nYear1;
        nYear1 = nYear2;
        nYear2 = nY;
        nM = nMonth1;
        nMonth1 = nMonth2;
        nMonth2 = nM;
        nD = nDay1;
        nDay1 = nDay2;
        nDay2 = nD;
    }

    if ( bUSAMethod ) {
        if ( nDay1 == 31 ) {
            nDay1--;
        }
        if ( nDay1 == 30 && nDay2 == 31 ) {
            nDay2--;
        }
        else {
            if ( nMonth1 == 2 && nDay1 == ( new Date( nYear1, 0, 1 ).isLeapYear() ? 29 : 28 ) ) {
                nDay1 = 30;
                if ( nMonth2 == 2 && nDay2 == ( new Date( nYear2, 0, 1 ).isLeapYear() ? 29 : 28 ) ) {
                    nDay2 = 30;
                }
            }
        }
//        nDayDiff = ( nYear2 - nYear1 ) * 360 + ( nMonth2 - nMonth1 ) * 30 + ( nDay2 - nDay1 );
    }
    else {
        if ( nDay1 == 31 ) {
            nDay1--;
        }
        if ( nDay2 == 31 ) {
            nDay2--;
        }
    }
    nDayDiff = ( nYear2 - nYear1 ) * 360 + ( nMonth2 - nMonth1 ) * 30 + ( nDay2 - nDay1 );
    return nDayDiff;
}

function searchRegExp( str, flags ) {
    var vFS = str
        .replace( /(\\)/g, "\\" )
        .replace( /(\^)/g, "\\^" )
        .replace( /(\()/g, "\\(" )
        .replace( /(\))/g, "\\)" )
        .replace( /(\+)/g, "\\+" )
        .replace( /(\[)/g, "\\[" )
        .replace( /(\])/g, "\\]" )
        .replace( /(\{)/g, "\\{" )
        .replace( /(\})/g, "\\}" )
        .replace( /(\$)/g, "\\$" )
        .replace( /(~)?\*/g, function ( $0, $1 ) {
            return $1 ? $0 : '(.*)';
        } )
        .replace( /(~)?\?/g, function ( $0, $1 ) {
            return $1 ? $0 : '.{1}';
        } )
        .replace( /(~\*)/g, "\\*" ).replace( /(~\?)/g, "\\?" );

    return new RegExp( vFS + "$", flags ? flags : "i" );
}

function searchRegExp2( s, mask ) {
    //todo протестировать
    var bRes = true;
    var s = s.toString().toLowerCase();
    var mask = mask.toString().toLowerCase();
    var nSIndex = 0;
    var nMaskIndex = 0;
    var nSLastIndex = 0;
    var nMaskLastIndex = 0;
    var nSLength = s.length;
    var nMaskLength = mask.length;
    var t = false;
    for ( ; nSIndex < nSLength; nMaskIndex++, nSIndex++, t = false ) {
        var cCurMask = mask[nMaskIndex];
        if ( '~' == cCurMask ) {
            nMaskIndex++;
            cCurMask = mask[nMaskIndex];
            t = true;
        }
        else if ( '*' == cCurMask )
            break;
        if ( ( cCurMask != s[nSIndex] && '?' != cCurMask ) || ( cCurMask != s[nSIndex] && t) ) {
            bRes = false;
            break;
        }
    }
    if ( bRes ) {
        while ( 1 ) {
            var cCurMask = mask[nMaskIndex];
            if ( nSIndex >= nSLength ) {
                while ( '*' == cCurMask && nMaskIndex < nMaskLength ) {
                    nMaskIndex++;
                    cCurMask = mask[nMaskIndex];
                }
                bRes = nMaskIndex >= nMaskLength;
                break;
            }
            else if ( '*' == cCurMask ) {
                nMaskIndex++;
                if ( nMaskIndex >= nMaskLength ) {
                    bRes = true;
                    break;
                }
                nSLastIndex = nSIndex + 1;
                nMaskLastIndex = nMaskIndex;
            }
            else if ( cCurMask != s[nSIndex] && '?' != cCurMask ) {
                nMaskIndex = nMaskLastIndex;
                nSIndex = nSLastIndex++;
            }
            else {
                nSIndex++;
                nMaskIndex++;
            }
        }
    }
    return bRes;
}

/*
 * Code below has been taken from OpenOffice Source.
 */

var maxGammaArgument = 171.624376956302;

function lcl_Erf0065( x ) {
    var pn = [
            1.12837916709551256,
            1.35894887627277916E-1,
            4.03259488531795274E-2,
            1.20339380863079457E-3,
            6.49254556481904354E-5
        ],
        qn = [
            1.00000000000000000,
            4.53767041780002545E-1,
            8.69936222615385890E-2,
            8.49717371168693357E-3,
            3.64915280629351082E-4
        ];
    var pSum = 0.0, qSum = 0.0, xPow = 1.0;
    for ( var i = 0; i <= 4; ++i ) {
        pSum += pn[i] * xPow;
        qSum += qn[i] * xPow;
        xPow *= x * x;
    }
    return x * pSum / qSum;
}

/** Approximation algorithm for erfc for 0.65 < x < 6.0. */
function lcl_Erfc0600( x ) {
    var pSum = 0,
        qSum = 0,
        xPow = 1, pn, qn;

    if ( x < 2.2 ) {
        pn = [
            9.99999992049799098E-1,
            1.33154163936765307,
            8.78115804155881782E-1,
            3.31899559578213215E-1,
            7.14193832506776067E-2,
            7.06940843763253131E-3
        ];
        qn = [
            1.00000000000000000,
            2.45992070144245533,
            2.65383972869775752,
            1.61876655543871376,
            5.94651311286481502E-1,
            1.26579413030177940E-1,
            1.25304936549413393E-2
        ];
    }
    else {
        pn = [
            9.99921140009714409E-1,
            1.62356584489366647,
            1.26739901455873222,
            5.81528574177741135E-1,
            1.57289620742838702E-1,
            2.25716982919217555E-2
        ];
        qn = [
            1.00000000000000000,
            2.75143870676376208,
            3.37367334657284535,
            2.38574194785344389,
            1.05074004614827206,
            2.78788439273628983E-1,
            4.00072964526861362E-2
        ];
    }

    for ( var i = 0; i < 6; ++i ) {
        pSum += pn[i] * xPow;
        qSum += qn[i] * xPow;
        xPow *= x;
    }
    qSum += qn[6] * xPow;
    return Math.exp( -1 * x * x ) * pSum / qSum;
}

/** Approximation algorithm for erfc for 6.0 < x < 26.54 (but used for all x > 6.0). */
function lcl_Erfc2654( x ) {
    var pn = [
            5.64189583547756078E-1,
            8.80253746105525775,
            3.84683103716117320E1,
            4.77209965874436377E1,
            8.08040729052301677
        ],
        qn = [
            1.00000000000000000,
            1.61020914205869003E1,
            7.54843505665954743E1,
            1.12123870801026015E2,
            3.73997570145040850E1
        ];

    var pSum = 0, qSum = 0, xPow = 1;

    for ( var i = 0; i <= 4; ++i ) {
        pSum += pn[i] * xPow;
        qSum += qn[i] * xPow;
        xPow /= x * x;
    }
    return Math.exp( -1 * x * x ) * pSum / (x * qSum);
}

function rtl_math_erf( x ) {
    if ( x == 0 )
        return 0;

    var bNegative = false;
    if ( x < 0 ) {
        x = Math.abs( x );
        bNegative = true;
    }

    var res = 1;
    if ( x < 1.0e-10 )
        res = parseFloat( x * 1.1283791670955125738961589031215452 );
    else if ( x < 0.65 )
        res = lcl_Erf0065( x );
    else
        res = 1 - rtl_math_erfc( x );

    if ( bNegative )
        res *= -1;

    return res;
}

function rtl_math_erfc( x ) {
    if ( x == 0 )
        return 1;

    var bNegative = false;
    if ( x < 0 ) {
        x = Math.abs( x );
        bNegative = true;
    }

    var fErfc = 0;
    if ( x >= 0.65 ) {
        if ( x < 6 )
            fErfc = lcl_Erfc0600( x );
        else
            fErfc = lcl_Erfc2654( x );
    }
    else
        fErfc = 1 - rtl_math_erf( x );

    if ( bNegative )
        fErfc = 2 - fErfc;

    return fErfc;
}

function integralPhi( x ) { // Using gauss(x)+0.5 has severe cancellation errors for x<-4
    return 0.5 * rtl_math_erfc( -x * 0.7071067811865475 ); // * 1/sqrt(2)
}

function phi( x ) {
    return  0.39894228040143268 * Math.exp( -(x * x) / 2 );
}

function taylor( pPolynom, nMax, x ) {
    var nVal = pPolynom[nMax];
    for ( var i = nMax - 1; i >= 0; i-- ) {
        nVal = pPolynom[i] + (nVal * x);
    }
    return nVal;
}

function gauss( x ) {
    var t0 =
            [ 0.39894228040143268, -0.06649038006690545, 0.00997355701003582,
                -0.00118732821548045, 0.00011543468761616, -0.00000944465625950,
                0.00000066596935163, -0.00000004122667415, 0.00000000227352982,
                0.00000000011301172, 0.00000000000511243, -0.00000000000021218 ],
        t2 =
            [ 0.47724986805182079, 0.05399096651318805, -0.05399096651318805,
                0.02699548325659403, -0.00449924720943234, -0.00224962360471617,
                0.00134977416282970, -0.00011783742691370, -0.00011515930357476,
                0.00003704737285544, 0.00000282690796889, -0.00000354513195524,
                0.00000037669563126, 0.00000019202407921, -0.00000005226908590,
                -0.00000000491799345, 0.00000000366377919, -0.00000000015981997,
                -0.00000000017381238, 0.00000000002624031, 0.00000000000560919,
                -0.00000000000172127, -0.00000000000008634, 0.00000000000007894 ],
        t4 =
            [ 0.49996832875816688, 0.00013383022576489, -0.00026766045152977,
                0.00033457556441221, -0.00028996548915725, 0.00018178605666397,
                -0.00008252863922168, 0.00002551802519049, -0.00000391665839292,
                -0.00000074018205222, 0.00000064422023359, -0.00000017370155340,
                0.00000000909595465, 0.00000000944943118, -0.00000000329957075,
                0.00000000029492075, 0.00000000011874477, -0.00000000004420396,
                0.00000000000361422, 0.00000000000143638, -0.00000000000045848 ];
    var asympt = [ -1, 1, -3, 15, -105 ],
        xabs = Math.abs( x ),
        xshort = Math.floor( xabs ),
        nval = 0;
    if ( xshort == 0 )
        nval = taylor( t0, 11, (xabs * xabs) ) * xabs;
    else if ( (xshort >= 1) && (xshort <= 2) )
        nval = taylor( t2, 23, (xabs - 2) );
    else if ( (xshort >= 3) && (xshort <= 4) )
        nval = taylor( t4, 20, (xabs - 4) );
    else
        nval = 0.5 + phi( xabs ) * taylor( asympt, 4, 1 / (xabs * xabs) ) / xabs;
    if ( x < 0 )
        return -nval;
    else
        return nval;
}

function gaussinv( x ) {
    var q, t, z;

    q = x - 0.5;

    if ( Math.abs( q ) <= .425 ) {
        t = 0.180625 - q * q;
        z =
            q *
                (
                    (
                        (
                            (
                                (
                                    (
                                        (
                                            t * 2509.0809287301226727 + 33430.575583588128105
                                            )
                                            * t + 67265.770927008700853
                                        )
                                        * t + 45921.953931549871457
                                    )
                                    * t + 13731.693765509461125
                                )
                                * t + 1971.5909503065514427
                            )
                            * t + 133.14166789178437745
                        )
                        * t + 3.387132872796366608
                    )
                /
                (
                    (
                        (
                            (
                                (
                                    (
                                        (
                                            t * 5226.495278852854561 + 28729.085735721942674
                                            )
                                            * t + 39307.89580009271061
                                        )
                                        * t + 21213.794301586595867
                                    )
                                    * t + 5394.1960214247511077
                                )
                                * t + 687.1870074920579083
                            )
                            * t + 42.313330701600911252
                        )
                        * t + 1
                    );
    }
    else {
        if ( q > 0 )
            t = 1 - x;
        else
            t = x;

        t = Math.sqrt( -Math.log( t ) );

        if ( t <= 5 ) {
            t += -1.6;
            z =
                (
                    (
                        (
                            (
                                (
                                    (
                                        (
                                            t * 7.7454501427834140764e-4 + 0.0227238449892691845833
                                            )
                                            * t + 0.24178072517745061177
                                        )
                                        * t + 1.27045825245236838258
                                    )
                                    * t + 3.64784832476320460504
                                )
                                * t + 5.7694972214606914055
                            )
                            * t + 4.6303378461565452959
                        )
                        * t + 1.42343711074968357734
                    )
                    /
                    (
                        (
                            (
                                (
                                    (
                                        (
                                            (
                                                t * 1.05075007164441684324e-9 + 5.475938084995344946e-4
                                                )
                                                * t + 0.0151986665636164571966
                                            )
                                            * t + 0.14810397642748007459
                                        )
                                        * t + 0.68976733498510000455
                                    )
                                    * t + 1.6763848301838038494
                                )
                                * t + 2.05319162663775882187
                            )
                            * t + 1
                        );
        }
        else {
            t += -5;
            z =
                (
                    (
                        (
                            (
                                (
                                    (
                                        (
                                            t * 2.01033439929228813265e-7 + 2.71155556874348757815e-5
                                            )
                                            * t + 0.0012426609473880784386
                                        )
                                        * t + 0.026532189526576123093
                                    )
                                    * t + 0.29656057182850489123
                                )
                                * t + 1.7848265399172913358
                            )
                            * t + 5.4637849111641143699
                        )
                        * t + 6.6579046435011037772
                    )
                    /
                    (
                        (
                            (
                                (
                                    (
                                        (
                                            (
                                                t * 2.04426310338993978564e-15 + 1.4215117583164458887e-7
                                                )
                                                * t + 1.8463183175100546818e-5
                                            )
                                            * t + 7.868691311456132591e-4
                                        )
                                        * t + 0.0148753612908506148525
                                    )
                                    * t + 0.13692988092273580531
                                )
                                * t + 0.59983220655588793769
                            )
                            * t + 1
                        );
        }

        if ( q < 0 ) z = -z;
    }

    return z;
}

function getLanczosSum( fZ ) {
    var num = [
            23531376880.41075968857200767445163675473,
            42919803642.64909876895789904700198885093,
            35711959237.35566804944018545154716670596,
            17921034426.03720969991975575445893111267,
            6039542586.35202800506429164430729792107,
            1439720407.311721673663223072794912393972,
            248874557.8620541565114603864132294232163,
            31426415.58540019438061423162831820536287,
            2876370.628935372441225409051620849613599,
            186056.2653952234950402949897160456992822,
            8071.672002365816210638002902272250613822,
            210.8242777515793458725097339207133627117,
            2.506628274631000270164908177133837338626
        ],
        denom = [
            0,
            39916800,
            120543840,
            150917976,
            105258076,
            45995730,
            13339535,
            2637558,
            357423,
            32670,
            1925,
            66,
            1
        ];
    // Horner scheme
    var sumNum, sumDenom, i, zInv;
    if ( fZ <= 1 ) {
        sumNum = num[12];
        sumDenom = denom[12];
        for ( i = 11; i >= 0; --i ) {
            sumNum *= fZ;
            sumNum += num[i];
            sumDenom *= fZ;
            sumDenom += denom[i];
        }
    }
    else
    // Cancel down with fZ^12; Horner scheme with reverse coefficients
    {
        zInv = 1 / fZ;
        sumNum = num[0];
        sumDenom = denom[0];
        for ( i = 1; i <= 12; ++i ) {
            sumNum *= zInv;
            sumNum += num[i];
            sumDenom *= zInv;
            sumDenom += denom[i];
        }
    }
    return sumNum / sumDenom;
}

/** You must ensure fZ>0; fZ>171.624376956302 will overflow. */
function getGammaHelper( fZ ) {
    var gamma = getLanczosSum( fZ ),
        fg = 6.024680040776729583740234375,
        zgHelp = fZ + fg - 0.5;
    // avoid intermediate overflow
    var halfpower = Math.pow( zgHelp, fZ / 2 - 0.25 );
    gamma *= halfpower;
    gamma /= Math.exp( zgHelp );
    gamma *= halfpower;
    if ( fZ <= 20 && fZ == Math.floor( fZ ) )
        gamma = Math.round( gamma );
    return gamma;
}

/** You must ensure fZ>0 */
function getLogGammaHelper( fZ ) {
    var _fg = 6.024680040776729583740234375, zgHelp = fZ + _fg - 0.5;
    return Math.log( getLanczosSum( fZ ) ) + (fZ - 0.5) * Math.log( zgHelp ) - zgHelp;
}

function getLogGamma( fZ ) {
    if ( fZ >= maxGammaArgument )
        return getLogGammaHelper( fZ );
    if ( fZ >= 0 )
        return Math.log( getGammaHelper( fZ ) );
    if ( fZ >= 0.5 )
        return Math.log( getGammaHelper( fZ + 1 ) / fZ );
    return getLogGammaHelper( fZ + 2 ) - Math.log( fZ + 1 ) - Math.log( fZ );
}