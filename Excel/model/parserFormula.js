/** @enum */
var cElementType = {
    number: 	0,
    string: 	1,
    bool:		2,
    error: 		3,
    empty:		4,
    cellsRange: 5,
    cell: 		6,
    date:		7,
    func : 		8,
    operator: 	9,
	name: 		10,
	array: 		11
};
/** @enum */
var cErrorType = {
    division_by_zero: 0,
    not_available: 1,
    wrong_name: 2,
    null_value: 3,
    not_numeric: 4,
    bad_reference: 5,
    wrong_value_type: 6,
    unsupported_function: 7,
    getting_data: 8
};
var cExcelSignificantDigits = 15;//количество цифр в числе после запятой
var cExcelMaxExponent = 308, cExcelMinExponent = -308;
var cExcelDateTimeDigits = 8;//количество цифр после запятой в числах отвечающих за время специализация $18.17.4.2

var c_Date1904Const = 24107; //разница в днях между 01.01.1970 и 01.01.1904 годами
var c_Date1900Const = 25568; //разница в днях между 01.01.1970 и 01.01.1900 годами
var c_DateCorrectConst = c_Date1900Const;
var c_sPerDay = 86400;
var c_msPerDay = c_sPerDay*1000;
	
function extend(Child, Parent) {
	var F = function() {};
	F.prototype = Parent.prototype;
	Child.prototype = new F();
	Child.prototype.constructor = Child;
	Child.superclass = Parent.prototype;
}

Date.prototype.isLeapYear = function(){
    var y = this.getFullYear();
    return y % 4 == 0 && y % 100 != 0 || y % 400 == 0;
};

Date.prototype.getDaysInMonth = function(){
    return arguments.callee[this.isLeapYear() ? 'L' : 'R'][this.getMonth()];
};

// durations of months for the regular year
Date.prototype.getDaysInMonth.R = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
// durations of months for the leap year
Date.prototype.getDaysInMonth.L = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];


var _func = [];//для велосипеда а-ля перегрузка функций.
_func[cElementType.number] = [];
_func[cElementType.string] = [];
_func[cElementType.bool] = [];
_func[cElementType.error] = [];
_func[cElementType.cellsRange] = [];
_func[cElementType.empty] = [];
_func[cElementType.array] = [];


_func[cElementType.number][cElementType.number] = function (arg0, arg1, what) {
    switch (what) {
        case ">":
            return new cBool(arg0.getValue() > arg1.getValue());
        case ">=":
            return new cBool(arg0.getValue() >= arg1.getValue());
        case "<":
            return new cBool(arg0.getValue() < arg1.getValue());
        case "<=":
            return new cBool(arg0.getValue() <= arg1.getValue());
        case "=":
            return new cBool(arg0.getValue() == arg1.getValue());
        case "<>":
            return new cBool(arg0.getValue() != arg1.getValue());
        case "-":
            return new cNumber(arg0.getValue() - arg1.getValue());
        case "+":
            return new cNumber(arg0.getValue() + arg1.getValue());
        case "/":
            if (arg1.getValue() != 0)
                return new cNumber(arg0.getValue() / arg1.getValue());
            else
                return new cError(cErrorType.division_by_zero);
        case "*":
            return new cNumber(arg0.getValue() * arg1.getValue());
    }
    return new cError(cErrorType.wrong_value_type);
};

_func[cElementType.number][cElementType.string] = function(arg0,arg1,what){
    switch (what){
        case ">":
        case ">=":
            return new cBool( false );
        case "<":
        case "<=":
            return new cBool( true );
        case "=":
            return new cBool( false );
        case "<>":
            return new cBool( true );
        case "-":
        case "+":
        case "/":
        case "*":
			return new cError( cErrorType.wrong_value_type );
    }
    return new cError( cErrorType.wrong_value_type);
};

_func[cElementType.number][cElementType.bool] = function(arg0,arg1,what){
    switch (what){
        case ">":
        case ">=":
            return new cBool( false );
        case "<":
        case "<=":
            return new cBool( true );
        case "=":
            return new cBool( false );
        case "<>":
            return new cBool( true );
        case "-":
            var _arg = arg1.tocNumber();
            if( _arg instanceof cError )	return _arg;
            return new cNumber( arg0.getValue() - _arg.getValue() );
        case "+":
            var _arg = arg1.tocNumber();
            if( _arg instanceof cError )	return _arg;
            return new cNumber( arg0.getValue() + _arg.getValue() );
        case "/":
            var _arg = arg1.tocNumber();
            if( _arg instanceof cError )	return _arg;
            if (_arg.getValue() != 0 )
                return new cNumber( arg0.getValue() / _arg.getValue() );
            else
                return new cError( cErrorType.division_by_zero );
        case "*":
            var _arg = arg1.tocNumber();
            if( _arg instanceof cError )	return _arg;
            return new cNumber( arg0.getValue() * _arg.getValue() );
    }
    return new cError( cErrorType.wrong_value_type);
};

_func[cElementType.number][cElementType.error] = function(arg0,arg1,what){
    return arg1;
};

_func[cElementType.number][cElementType.empty] = function(arg0,arg1,what){
    switch (what){
        case ">":
            return new cBool( arg0.getValue() > 0 );
        case ">=":
            return new cBool( arg0.getValue() >= 0 );
        case "<":
            return new cBool( arg0.getValue() < 0 );
        case "<=":
            return new cBool( arg0.getValue() <= 0 );
        case "=":
            return new cBool( arg0.getValue() == 0 );
        case "<>":
            return new cBool( arg0.getValue() != 0 );
        case "-":
            return new cNumber( arg0.getValue() - 0 );
        case "+":
            return new cNumber( arg0.getValue() + 0 );
        case "/":
            return new cError( cErrorType.division_by_zero );
        case "*":
            return new cNumber( 0 );
    }
    return new cError( cErrorType.wrong_value_type);
};


_func[cElementType.string][cElementType.number] = function(arg0,arg1,what){
    switch (what){
        case ">":
        case ">=":
            return new cBool( true );
        case "<":
        case "<=":
        case "=":
            return new cBool( false );
        case "<>":
            return new cBool( true );
        case "-":
        case "+":
        case "/":
        case "*":
			return new cError( cErrorType.wrong_value_type );
    }
    return new cError( cErrorType.wrong_value_type);
};

_func[cElementType.string][cElementType.string] = function(arg0,arg1,what){
    switch (what){
        case ">":
            return new cBool( arg0.getValue() > arg1.getValue() );
        case ">=":
            return new cBool( arg0.getValue() >= arg1.getValue() );
        case "<":
            return new cBool( arg0.getValue() < arg1.getValue() );
        case "<=":
            return new cBool( arg0.getValue() <= arg1.getValue() );
        case "=":
            return new cBool( arg0.getValue() === arg1.getValue() );
        case "<>":
            return new cBool( arg0.getValue() !== arg1.getValue() );
        case "-":
            var _arg0 = arg0.tocNumber(),
            _arg1 = arg1.tocNumber();
            if( _arg0 instanceof cError )	return _arg0;
            if( _arg1 instanceof cError )	return _arg1;
            return new cNumber( _arg0.getValue() - _arg1.getValue() );
        case "+":
            var _arg0 = arg0.tocNumber(),
            _arg1 = arg1.tocNumber();
            if( _arg0 instanceof cError )	return _arg0;
            if( _arg1 instanceof cError )	return _arg1;
            return new cNumber( _arg0.getValue() + _arg1.getValue() );
        case "/":
            var _arg0 = arg0.tocNumber(),
            _arg1 = arg1.tocNumber();
            if( _arg0 instanceof cError )	return _arg0;
            if( _arg1 instanceof cError )	return _arg1;
            if (_arg1.getValue() != 0 )
                return new cNumber( _arg0.getValue() / _arg1.getValue() );
            return new cError( cErrorType.division_by_zero );
        case "*":
            var _arg0 = arg0.tocNumber(),
            _arg1 = arg1.tocNumber();
            if( _arg0 instanceof cError )	return _arg0;
            if( _arg1 instanceof cError )	return _arg1;
            return new cNumber( _arg0.getValue() * _arg1.getValue() );
    }
    return new cError( cErrorType.wrong_value_type);
};

_func[cElementType.string][cElementType.bool] = function(arg0,arg1,what){
    switch (what){
        case ">":
        case ">=":
            return new cBool( false );
        case "<":
        case "<=":
            return new cBool( true );
        case "=":
            return new cBool( false );
        case "<>":
            return new cBool( false );
        case "-":
            var _arg0 = arg0.tocNumber(),
            _arg1 = arg1.tocNumber();
            if( _arg0 instanceof cError )	return _arg0;
            if( _arg1 instanceof cError )	return _arg1;
            return new cNumber( _arg0.getValue() - _arg1.getValue() );
        case "+":
            var _arg0 = arg0.tocNumber(),
            _arg1 = arg1.tocNumber();
            if( _arg0 instanceof cError )	return _arg0;
            if( _arg1 instanceof cError )	return _arg1;
            return new cNumber( _arg0.getValue() + _arg1.getValue() );
        case "/":
            var _arg0 = arg0.tocNumber(),
            _arg1 = arg1.tocNumber();
            if( _arg0 instanceof cError )	return _arg0;
            if( _arg1 instanceof cError )	return _arg1;
            if (_arg1.getValue() != 0 )
                return new cNumber( _arg0.getValue() / _arg1.getValue() );
            return new cError( cErrorType.division_by_zero );
        case "*":
            var _arg0 = arg0.tocNumber(),
            _arg1 = arg1.tocNumber();
            if( _arg0 instanceof cError )	return _arg0;
            if( _arg1 instanceof cError )	return _arg1;
            return new cNumber( _arg0.getValue() * _arg1.getValue() );
    }
    return new cError( cErrorType.wrong_value_type);
};

_func[cElementType.string][cElementType.error] = function(arg0,arg1,what){
    return arg1;
};

_func[cElementType.string][cElementType.empty] = function(arg0,arg1,what){
    switch (what){
        case ">":
            return new cBool( arg0.getValue().length != 0 );
        case ">=":
            return new cBool( arg0.getValue().length >= 0 );
        case "<":
            return new cBool( false );
        case "<=":
            return new cBool( arg0.getValue().length <= 0 );
        case "=":
            return new cBool( arg0.getValue().length === 0 );
        case "<>":
            return new cBool( arg0.getValue().length != 0 );
        case "-":
        case "+":
        case "/":
        case "*":
            return new cError( cErrorType.wrong_value_type );
    }
    return new cError( cErrorType.wrong_value_type);
};


_func[cElementType.bool][cElementType.number] = function(arg0,arg1,what){
    switch (what){
        case ">":
        case ">=":
            return new cBool( true );
        case "<":
        case "<=":
            return new cBool( false );
        case "=":
            return new cBool( true );
        case "<>":
            return new cBool( false );
        case "-":
            var _arg = arg0.tocNumber();
            if( _arg instanceof cError )	return _arg;
            return new cNumber( _arg.getValue() - arg1.getValue() );
        case "+":
            var _arg = arg1.tocNumber();
            if( _arg instanceof cError )	return _arg;
            return new cNumber( _arg.getValue() + arg1.getValue() );
        case "/":
            var _arg = arg1.tocNumber();
            if( _arg instanceof cError )	return _arg;
            if ( arg1.getValue() != 0 )
                return new cNumber( _arg.getValue() / arg1.getValue() );
            else
                return new cError( cErrorType.division_by_zero );
        case "*":
            var _arg = arg1.tocNumber();
            if( _arg instanceof cError )	return _arg;
            return new cNumber( _arg.getValue() * arg1.getValue() );
    }
    return new cError( cErrorType.wrong_value_type);
};

_func[cElementType.bool][cElementType.string] = function(arg0,arg1,what){
    switch (what){
        case ">":
        case ">=":
            return new cBool( true );
        case "<":
        case "<=":
            return new cBool( false );
        case "=":
            return new cBool( true );
        case "<>":
            return new cBool( true );
        case "-":
            var _arg0 = arg0.tocNumber(),
            _arg1 = arg1.tocNumber();
            if( _arg1 instanceof cError )	return _arg1;
            return new cNumber( _arg0.getValue() - _arg1.getValue() );
        case "+":
            var _arg0 = arg0.tocNumber(),
            _arg1 = arg1.tocNumber();
            if( _arg1 instanceof cError )	return _arg1;
            return new cNumber( _arg0.getValue() + _arg1.getValue() );
        case "/":
            var _arg0 = arg0.tocNumber(),
            _arg1 = arg1.tocNumber();
            if( _arg1 instanceof cError )	return _arg1;
            if (_arg1.getValue() != 0 )
                return new cNumber( _arg0.getValue() / _arg1.getValue() );
            return new cError( cErrorType.division_by_zero );
        case "*":
            var _arg0 = arg0.tocNumber(),
            _arg1 = arg1.tocNumber();
            if( _arg1 instanceof cError )	return _arg1;
            return new cNumber( _arg0.getValue() * _arg1.getValue() );
    }
    return new cError( cErrorType.wrong_value_type);
};

_func[cElementType.bool][cElementType.bool] = function(arg0,arg1,what){
    switch (what){
        case ">":
            return	new cBool( arg0.value > arg1.value );
        case ">=":
            return	new cBool( arg0.value >= arg1.value );
        case "<":
            return	new cBool( arg0.value < arg1.value );
        case "<=":
            return	new cBool( arg0.value <= arg1.value );
        case "=":
            return	new cBool( arg0.value === arg1.value );
        case "<>":
            return	new cBool( arg0.value !== arg1.value );
        case "-":
            var _arg0 = arg0.tocNumber(),
            _arg1 = arg1.tocNumber();
            return new cNumber( _arg0.getValue() - _arg1.getValue() );
        case "+":
            var _arg0 = arg0.tocNumber(),
            _arg1 = arg1.tocNumber();
            return new cNumber( _arg0.getValue() + _arg1.getValue() );
        case "/":
            if ( !arg1.value )
                return new cError( cErrorType.division_by_zero );
            var _arg0 = arg0.tocNumber(),
            _arg1 = arg1.tocNumber();
            return new cNumber( _arg0.getValue() / _arg1.getValue() );
        case "*":
            var _arg0 = arg0.tocNumber(),
            _arg1 = arg1.tocNumber();
            return new cNumber( _arg0.getValue() * _arg1.getValue() );
    }
    return new cError( cErrorType.wrong_value_type);
};

_func[cElementType.bool][cElementType.error] = function(arg0,arg1,what){
    return arg1;
};

_func[cElementType.bool][cElementType.empty] = function(arg0,arg1,what){
    switch (what){
        case ">":
            return new cBool( arg0.value > false );
        case ">=":
            return new cBool( arg0.value >= false );
        case "<":
            return new cBool( arg0.value < false );
        case "<=":
            return new cBool( arg0.value <= false );
        case "=":
            return new cBool( arg0.value === false );
        case "<>":
            return new cBool( arg0.value !== false );
        case "-":
            return new cNumber( arg0.value ? 1.0 : 0.0 - 0 );
        case "+":
            return new cNumber( arg0.value ? 1.0 : 0.0 + 0 );
        case "/":
            return new cError( cErrorType.division_by_zero );
        case "*":
            return new cNumber( 0 );
    }
    return new cError( cErrorType.wrong_value_type);
};


_func[cElementType.error][cElementType.number] = _func[cElementType.error][cElementType.string] =
_func[cElementType.error][cElementType.bool] = _func[cElementType.error][cElementType.error] =
_func[cElementType.error][cElementType.empty] = function(arg0,arg1,what){
	return arg0;
};


_func[cElementType.empty][cElementType.number] = function(arg0,arg1,what){
    switch (what){
        case ">":
            return new cBool( 0 > arg1.getValue() );
        case ">=":
            return new cBool( 0 >= arg1.getValue() );
        case "<":
            return new cBool( 0 < arg1.getValue() );
        case "<=":
            return new cBool( 0 <= arg1.getValue() );
        case "=":
            return new cBool( 0 == arg1.getValue() );
        case "<>":
            return new cBool( 0 != arg1.getValue() );
        case "-":
            return new cNumber( 0 - arg1.getValue() );
        case "+":
            return new cNumber( 0 + arg1.getValue() );
        case "/":
            if ( arg1.getValue() == 0 )
                return new cError( cErrorType.not_numeric );
            return new cNumber( 0 );
        case "*":
            return new cNumber( 0 );
    }
    return new cError( cErrorType.wrong_value_type);
};

_func[cElementType.empty][cElementType.string] = function(arg0,arg1,what){
    switch (what){
        case ">":
            return new cBool( 0 > arg1.getValue().length );
        case ">=":
            return new cBool( 0 >= arg1.getValue().length );
        case "<":
            return new cBool( 0 < arg1.getValue().length );
        case "<=":
            return new cBool(  0 <= arg1.getValue().length );
        case "=":
            return new cBool( 0 === arg1.getValue().length );
        case "<>":
            return new cBool( 0 != arg1.getValue().length );
        case "-":
        case "+":
        case "/":
        case "*":
            return new cError( cErrorType.wrong_value_type );
    }
    return new cError( cErrorType.wrong_value_type);
};

_func[cElementType.empty][cElementType.bool] = function(arg0,arg1,what){
    switch (what){
        case ">":
            return new cBool( false > arg1.value );
        case ">=":
            return new cBool( false >= arg1.value );
        case "<":
            return new cBool( false < arg1.value );
        case "<=":
            return new cBool( false <= arg1.value );
        case "=":
            return new cBool( arg1.value === false );
        case "<>":
            return new cBool( arg1.value !== false );
        case "-":
            return new cNumber( 0 - arg1.value ? 1.0 : 0.0 );
        case "+":
            return new cNumber( arg1.value ? 1.0 : 0.0 );
        case "/":
            if ( arg1.value )
                return new cNumber( 0 );
            return new cError( cErrorType.not_numeric );
        case "*":
            return new cNumber( 0 );
    }
    return new cError( cErrorType.wrong_value_type);
};

_func[cElementType.empty][cElementType.error] = function(arg0,arg1,what){
    return arg1;
};

_func[cElementType.empty][cElementType.empty] = function(arg0,arg1,what){
    switch (what){
        case ">":
        case "<":
        case "<>":
            return new cBool( false );
        case ">=":
        case "<=":
        case "=":
            return new cBool( true );
        case "-":
        case "+":
            return new cNumber( 0 );
        case "/":
            return new cError( cErrorType.not_numeric );
        case "*":
            return new cNumber( 0 );
    }
    return new cError( cErrorType.wrong_value_type);
};


_func[cElementType.cellsRange][cElementType.number] = _func[cElementType.cellsRange][cElementType.string] =
_func[cElementType.cellsRange][cElementType.bool] = _func[cElementType.cellsRange][cElementType.error] =
_func[cElementType.cellsRange][cElementType.array] = _func[cElementType.cellsRange][cElementType.empty] = function(arg0,arg1,what,cellAddress){
	var cross = arg0.cross(cellAddress);
	return _func[cross.type][arg1.type](cross,arg1,what)
};


_func[cElementType.number][cElementType.cellsRange] = _func[cElementType.string][cElementType.cellsRange] =
_func[cElementType.bool][cElementType.cellsRange] = _func[cElementType.error][cElementType.cellsRange] = 
_func[cElementType.array][cElementType.cellsRange] = _func[cElementType.empty][cElementType.cellsRange] = function(arg0,arg1,what,cellAddress){
	var cross = arg1.cross(cellAddress);
	return _func[arg0.type][cross.type](arg0,cross,what)
};


_func[cElementType.cellsRange][cElementType.cellsRange] = function(arg0,arg1,what,cellAddress){
	var cross1 = arg0.cross(cellAddress),
		cross2 = arg1.cross(cellAddress);
	return _func[cross1.type][cross2.type](cross1,cross2,what)
};


_func[cElementType.array][cElementType.number] = _func[cElementType.array][cElementType.string] =
_func[cElementType.array][cElementType.bool] = _func[cElementType.array][cElementType.error] =
_func[cElementType.array][cElementType.empty] = function(arg0,arg1,what,cellAddress){
	var res = new cArray();
	arg0.foreach(function(elem,r,c){
		if( !res.array[r] ) res.addRow();
		res.addElement( _func[elem.type][arg1.type](elem,arg1,what) );
	})
	return res;
};


_func[cElementType.number][cElementType.array] = _func[cElementType.string][cElementType.array] =
_func[cElementType.bool][cElementType.array] = _func[cElementType.error][cElementType.array] =
_func[cElementType.empty][cElementType.array] = function(arg0,arg1,what,cellAddress){
	var res = new cArray();
	arg1.foreach(function(elem,r,c){
		if( !res.array[r] ) res.addRow();
		res.addElement( _func[arg0.type][elem.type](arg0,elem,what) );
	});
	return res;
};


_func.binarySearch = function(sElem, arrTagert, regExp){
    var first = 0, /* Номер первого элемента в массиве */
		last = arrTagert.length-1,  	/* Номер элемента в массиве, СЛЕДУЮЩЕГО ЗА последним */
									/* Если просматриваемый участок непустой, first<last */
		mid,x; 
 
	var arrTagertOneType = [], isString = false;
	
	for(var i = 0; i < arrTagert.length; i++ ){
		if( (arrTagert[i] instanceof cString || sElem instanceof cString) && !isString ){
			i = 0;
			isString = true;
			sElem = new cString( sElem.value.toLowerCase() );
		}
		if( isString ){
			arrTagertOneType[i] = new cString (arrTagert[i].getValue().toLowerCase());
		}
		else{
			arrTagertOneType[i] = arrTagert[i].tocNumber();
		}
	}
 
    if (arrTagert.length == 0){
        return -1; /* массив пуст */
    } 
    else if (arrTagert[0].value > sElem.value ){
		return -2;
    } 
    else if (arrTagert[arrTagert.length - 1].value < sElem.value){
		return arrTagert.length - 1;
    }
 
    while (first < last){
        mid = Math.floor(first + (last - first) / 2);
        if (sElem.value <= arrTagert[mid].value || ( regExp && regExp.test(arrTagert[mid].value) ) ){
			last = mid;
        }
        else{
			first = mid + 1;
        }
    }
 
    /* Если условный оператор if(n==0) и т.д. в начале опущен - значит, тут раскомментировать!    */
    if (/* last<n &&*/ arrTagert[last].value == sElem.value){
		return last;/* Искомый элемент найден. last - искомый индекс */
    } else {
		return last-1;/* Искомый элемент не найден. Но если вам вдруг надо его вставить со сдвигом, то его место - last.    */
    }

};

/*Functions that checks of an element in formula*/
var rx_operators = new RegExp("^ *[-+*/^&%<=>:] *"),
	rx_LG = new RegExp("^ *[<=>]+ *"),
	rx_Lt = new RegExp("^ *< *"),
	rx_Le = new RegExp("^ *<= *"),
	rx_Gt = new RegExp("^ *> *"),
	rx_Ge = new RegExp("^ *>= *"),
	rx_Ne = new RegExp("^ *<> *"),
	rg = new RegExp("^([\\w\\d.]+)[-+*/^&%<=>:;\\(\\)]"),
	rgRange = new RegExp("^\\$?[A-Za-z]+\\$?\\d+:\\$?[A-Za-z]+\\$?\\d+"),
	rgCols = new RegExp("^\\$?[A-Za-z]+:\\$?[A-Za-z]+"),
	rgRows = new RegExp("^\\$?\\d+:\\$?\\d+"),
	rx_ref = new RegExp("^(\\$?[A-Za-z]{1,3}\\$?(\\d{1,7}))([-+*/^&%<=>: ;),]|$)"),
	rx_refAll = new RegExp("^(\\$?[A-Za-z]+\\$?(\\d+))([-+*/^&%<=>: ;),]|$)"),
	rx_ref3D_non_quoted = new XRegExp("^(?<name_from>[\\p{L}\\d.]+)(:(?<name_to>[\\p{L}\\d.]+))?!"),
	rx_ref3D_quoted = new XRegExp("^'(?<name_from>(?:''|[^\\[\\]'\\/*?:])*)(?::(?<name_to>(?:''|[^\\[\\]'\\/*?:])*))?'!"),
	rx_ref3D = new RegExp("^\\D*[\\D\\d]*\\!"),
	rx_before_operators = new RegExp("^ *[,()]"), rx_space = new RegExp(" "),
	rx_number = new RegExp("^[+-]?\\d*(\\d|\\.)\\d*([eE][+-]?\\d+)?"),
	rx_LeftParentheses = new RegExp("^ *\\( *"),
	rx_RightParentheses = new RegExp("^ *\\)"),
	rx_Comma = new RegExp("^ *[,;] *"),
	rx_error = new RegExp("^(#NULL!|#DIV\\/0!|#VALUE!|#REF!|#NAME\\?|#NUM!|#UNSUPPORTED_FUNCTION!|#N\\/A|#GETTING_DATA)"),
	rx_bool = new RegExp("^(TRUE|FALSE|true|false)([-+*/^&%<=>: ;),]|$)"),
	rx_string = new RegExp("^\"((\"\"|[^\"])*)\""),
	rx_name = new XRegExp("^(?<name>\\w[\\w\\d.]*)([-+*/^&%<=>: ;),]|$)"),
	rx_test_ws_name = new XRegExp("^\\p{L}[\\p{L}\\d.]*$"),
	rx_LeftBrace = new RegExp("^ *\\{ *"),
	rx_RightBrace = new RegExp("^ *\\}"),
	rx_array = new RegExp("^\\{(([+-]?\\d*(\\d|\\.)\\d*([eE][+-]?\\d+)?)?(\"((\"\"|[^\"])*)\")?(#NULL!|#DIV\\/0!|#VALUE!|#REF!|#NAME\\?|#NUM!|#UNSUPPORTED_FUNCTION!|#N\\A|#GETTING_DATA|FALSE|TRUE|true|false)?[,;]?)*\\}");

//вспомогательный объект для парсинга формул и проверки строки по регуляркам указанным выше.	
function parserHelper(){}
parserHelper.prototype = {
	_reset:function(){
		delete this.operand_str;
		delete this.pCurrPos;
	},
	
	isOperator: function (formula,start_pos){
		if(this instanceof parserHelper){
			this._reset();
		}
		
		var str = formula.substring(start_pos)
		var match = str.match(rx_operators);
		if (match == null || match == undefined)
			return false;
		else {
			var mt = str.match(rx_LG)
			if( mt ) match = mt;
			this.operand_str = match[0].replace(/\s/g,"","");
			this.pCurrPos += match[0].length;
			return true;
		}
		return false;
	},

	isFunc: function (formula,start_pos){
		if(this instanceof parserHelper){
			this._reset();
		}
	
		var frml = formula.substring(start_pos);
		var match = (frml).match(rg);

		if (match != null && match != undefined)
		{
			if (match.length == 2)
			{
				this.pCurrPos += match[1].length;
				this.operand_str = match[1];
				return true;
			}
		}
		this.operand_str = null;
		return false;
	},

	isArea: function (formula, start_pos){
		if(this instanceof parserHelper){
			this._reset();
		}
	
		var subSTR = formula.substring(start_pos);
		var match = subSTR.match(rgRange) || subSTR.match(rgCols) || subSTR.match(rgRows);
		if (match != null || match != undefined)
		{
			this.pCurrPos += match[0].length;
			this.operand_str = match[0];
			return true;
		}
		this.operand_str = null;
		return false;
	},

	isRef: function (formula, start_pos, allRef){
		if(this instanceof parserHelper){
			this._reset();
		}
	
		var match = (formula.substring(start_pos)).match(rx_ref);
		if (match != null || match != undefined)
		{
			if (	match.length >= 3 && 
					g_oCellAddressUtils.colstrToColnum( match[1].substr(0,(match[1].length - match[2].length)) ) <= g_oCellAddressUtils.colstrToColnum("XFD") && 
					parseInt(match[2]) <= 1048576
				)
			{
				this.pCurrPos += match[1].length;
				this.operand_str = match[1];
				return true;
			}
			else if( allRef ){
				match = (formula.substring(start_pos)).match(rx_refAll);
				if( (match != null || match != undefined) && match.length >= 3){
					this.pCurrPos += match[1].length;
					this.operand_str = match[1];
					return true;
				}
			}
		}
		
		this.operand_str = null;
		return false;
	},

	is3DRef: function (formula, start_pos){
		if(this instanceof parserHelper){
			this._reset();
		}
	
		var subSTR = formula.substring(start_pos);
		var match = rx_ref3D_quoted.xexec(subSTR) || rx_ref3D_non_quoted.xexec(subSTR);

		if (match != null || match != undefined){
			this.pCurrPos += match[0].length;
			this.operand_str = match[1];
			return [ true, match["name_from"]?match["name_from"].replace(/''/g,"'"):null, match["name_to"]?match["name_to"].replace(/''/g,"'"):null ];
		}
		this.operand_str = null;
		return [false,null,null];
	},

	isNextPtg: function (formula, start_pos){
		if(this instanceof parserHelper){
			this._reset();
		}
	
		var subSTR = formula.substring(start_pos);
		return (
			( subSTR.match(rx_before_operators) != null || subSTR.match(rx_before_operators) != undefined ) &&
			( subSTR.match(rx_space) != null || subSTR.match(rx_space) != undefined )
			)
	},

	isNumber: function (formula, start_pos){
		if(this instanceof parserHelper){
			this._reset();
		}
	
		var match = (formula.substring(start_pos)).match(rx_number);
		if ( match == null || match == undefined )
			return false;
		else {
			this.operand_str = match[0];
			this.pCurrPos += match[0].length;
			return true;
		}
		return false;
	},

	isLeftParentheses: function (formula, start_pos){
		if(this instanceof parserHelper){
			this._reset();
		}
	
		var match = (formula.substring(start_pos)).match(rx_LeftParentheses);
		if (match == null || match == undefined)
			return false;
		else {
			this.operand_str = match[0].replace(/\s/,"");
			this.pCurrPos += match[0].length;
			return true;
		}
		return false;
	},

	isRightParentheses: function (formula, start_pos){
		if(this instanceof parserHelper){
			this._reset();
		}
	
		var match = (formula.substring(start_pos)).match(rx_RightParentheses);
		if (match == null || match == undefined)
			return false;
		else {
			this.operand_str = match[0].replace(/\s/,"");
			this.pCurrPos += match[0].length;
			return true;
		}
		return false;
	},

	isComma: function (formula, start_pos){
		if(this instanceof parserHelper){
			this._reset();
		}
	
		var match = (formula.substring(start_pos)).match(rx_Comma);
		if (match == null || match == undefined)
			return false;
		else {
			this.operand_str = match[0];
			this.pCurrPos += match[0].length;
			return true;
		}
		return false;
	},

	isError: function (formula, start_pos){
		if(this instanceof parserHelper){
			this._reset();
		}
	
		var match = (formula.substring(start_pos)).match(rx_error);
		if (match == null || match == undefined)
			return false;
		else {
			this.operand_str = match[0];
			this.pCurrPos += match[0].length;
			return true;
		}
		return false;
	},

	isBoolean: function (formula, start_pos){
		if(this instanceof parserHelper){
			this._reset();
		}

		var match = (formula.substring(start_pos)).match(rx_bool);
		if (match == null || match == undefined)
			return false;
		else {
			this.operand_str = match[1];
			this.pCurrPos += match[1].length;
			return true;
		}
		return false;
	},

	isString: function (formula, start_pos){
		if(this instanceof parserHelper){
			this._reset();
		}
	
		var match = (formula.substring(start_pos)).match(rx_string);
		if (match != null || match != undefined){
			this.operand_str = match[1].replace("\"\"", "\"");
			this.pCurrPos += match[0].length;
			return true;
		}
		return false;
	},

	isName: function (formula, start_pos, wb){
		if(this instanceof parserHelper){
			this._reset();
		}
		
		var subSTR = formula.substring(start_pos);
		var match = rx_name.xexec(subSTR);

		if (match != null || match != undefined){
			var name = match["name"];
			if( name && name.length != 0 && wb.DefinedNames && wb.isDefinedNamesExists(name) ){
				this.pCurrPos += name.length;
				this.operand_str = name;
				return [ true, name ];
			}
		}
		return [false];
	},

	isArray: function(formula, start_pos, wb){
		if(this instanceof parserHelper){
			this._reset();
		}
		
		var subSTR = formula.substring(start_pos);
		var match = (formula.substring(start_pos)).match(rx_array);

		if (match != null || match != undefined){
			this.operand_str = match[0].substring(1,match[0].length-1);
			this.pCurrPos += match[0].length;
			return true;
		}
		
		return false;
	},
	
	isLeftBrace: function(formula, start_pos){
		if(this instanceof parserHelper){
			this._reset();
		}
	
		var match = (formula.substring(start_pos)).match(rx_LeftBrace);
		if (match == null || match == undefined)
			return false;
		else {
			this.operand_str = match[0].replace(/\s/,"");
			this.pCurrPos += match[0].length;
			return true;
		}
		return false;
	},
	
	isRightBrace: function(formula, start_pos){
		if(this instanceof parserHelper){
			this._reset();
		}
	
		var match = (formula.substring(start_pos)).match(rx_RightBrace);
		if (match == null || match == undefined)
			return false;
		else {
			this.operand_str = match[0].replace(/\s/,"");
			this.pCurrPos += match[0].length;
			return true;
		}
		return false;
	},
	
	// Парсим ссылку на диапазон в листе
	parse3DRef: function (formula) {
		// Сначала получаем лист
		var is3DRefResult = this.is3DRef(formula, 0);
		if (is3DRefResult && true === is3DRefResult[0]){
			// Имя листа в ссылке
			var sheetName = is3DRefResult[1];
			// Ищем начало range
			var indexStartRange = formula.indexOf("!") + 1;
			if (this.isArea(formula, indexStartRange)){
				if (this.operand_str.length == formula.substring(indexStartRange).length)
					return {sheet: sheetName, range: this.operand_str};
				else 
					return null;
			}
			else if (this.isRef(formula, indexStartRange)) {
				if (this.operand_str.length == formula.substring(indexStartRange).length)
					return {sheet: sheetName, range: this.operand_str};
				else 
					return null;
				
			}
		}
		// Возвращаем ошибку
		return null;
	}
}
var parserHelp = new parserHelper();

//функция для определения к какому типу относится значение val.
function checkTypeCell(val){
    if ( val == "")
        return new cEmpty();
    else if ( parserHelp.isNumber(val,0) )
        return new cNumber(parserHelp.operand_str);
    else if ( parserHelp.isString(val,0) )
        return new cString(parserHelp.operand_str);
    else if ( parserHelp.isBoolean(val,0) )
        return new cBool(parserHelp.operand_str);
    else if ( parserHelp.isError(val,0) )
        return new cError(parserHelp.operand_str);
    else return new cString(val);
}
/*--------------------------------------------------------------------------*/
/*Base classes for operators & functions */
/** @constructor */
function cBaseOperator(name, priority, argumentCount){
    this.name = name ? name : "";
    this.priority = priority ? priority : 10;
    this.type = cElementType.operator;
    this.isRightAssociative = false;
    this.argumentsCurrent = argumentCount ? argumentCount : 2;
    this.value = null;
	this.formatType = {
		def:-1,//подразумевается формат первой ячейки входящей в формулу.
		noneFormat:-2
	};
	this.numFormat = this.formatType.noneFormat;
}
cBaseOperator.prototype = {
	constructor : cBaseOperator,
	getArguments : function(){
        return this.argumentsCurrent;
    },
	toString : function(){
        return this.name;
    },
	Calculate : function(){
        return null;
    },
	Assemble : function(arg){
        var str = "";
        if( this.argumentsCurrent == 2 )
            str = arg[0]+""+this.name+""+arg[1];
        else str = this.name+""+arg[0];
        return new cString(str);
    }
}

/** @constructor */
function cBaseFunction(){
    this.name = null;
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 0;
    this.argumentsCurrent = 0;
    this.argumentsMax = 255;
	this.formatType = {
		def:-1,//подразумевается формат первой ячейки входящей в формулу.
		noneFormat:-2
	};
	this.numFormat = this.formatType.def;
}
cBaseFunction.prototype = {
	constructor : cBaseFunction,
	Calculate : function(){
		return this.value = new cError(cErrorType.unsupported_function)
	},
	setArgumentsMin : function(count){
		this.argumentsMin = count;
	},
	setArgumentsMax : function(count){
		this.argumentsMax = count;
	},
	DecrementArguments : function(){
		--this.argumentsCurrent;
	},
	IncrementArguments : function(){
		++this.argumentsCurrent;
	},
	setName : function(name){
		this.name = name;
	},
	setArgumentsCount : function(count){
		this.argumentsCurrent = count;
	},
	getArguments : function(){
		return this.argumentsCurrent;
	},
	getMaxArguments : function(){
		return this.argumentsMax;
	},
	getMinArguments : function(){
		return this.argumentsMin;
	},
	Assemble : function(arg){
        var str = "";
        for(var i = 0; i < arg.length; i++){
            str+=arg[i].toString();
            if( i != arg.length-1)
                str += ",";
        }
        return new cString(this.name + "("+str+")");
    },
    toString : function(){
        return this.name
	},
	setCA : function(arg,ca,numFormat){
		this.value = arg;
		if(ca)this.value.ca = true;
		if(numFormat!==null && numFormat!==undefined)this.value.numFormat = numFormat;
		return this.value;
	},
	setFormat : function(f){
		this.numFormat = f;
	}
}

/** @constructor */
function cBaseType(val){
    this.needRecalc = false;
    this.numFormat = null;
    this.type = null;
    this.value = val;
	this.ca = false;
}
cBaseType.prototype = {
	constructor:cBaseType,
    tryConvert : function(){
        return this;
    },
    getValue : function(){
        return this.value;
    },
    toString : function(){
        return this.value.toString();
    }
}

/* cFormulaOperators is container for holding all ECMA-376 operators, see chapter $18.17.2.2 in "ECMA-376, Second Edition, Part 1 - Fundamentals And Markup Language Reference" */
var cFormulaOperators = {
    '(': function(){
			var r = {};
			r.name = "(";
			r.type = cElementType.operator;
			r.argumentsCurrent = 1;
			r.DecrementArguments = function(){
				--this.argumentsCurrent;
			}
			r.IncrementArguments = function(){
				++this.argumentsCurrent;
			}
			r.toString = function(){
				return this.name;
			}
			r.getArguments = function(){
				return this.argumentsCurrent;
			}
			r.Assemble = function(arg){
				return new cString("("+arg+")");
			}
			return r;
    },
    ')':function(){
			var r = {};
			r.name = ')';
			r.type = cElementType.operator;
			r.toString = function(){ return ')'; }
			return r;
    },
	'{':function(){
		var r = {};
		r.name =  '{';
		r.toString = function(){ return this.name; }
		return r;
	},
	'}':function(){
		var r = {};
		r.name = '}';
		r.toString = function(){ return this.name; }
		return r;
	},
    /* 50 is highest priority */
    'un_minus':function(){
        var r = new cBaseOperator('un_minus'/**name operator*/,50/**priority of operator*/,1/**count arguments*/);
		r.Calculate = function(arg){	//calculate operator
			var arg0 = arg[0];
			if( arg0 instanceof cArea){
				arg0 = arg0.cross(arguments[1].first);
			}
			arg0 = arg0.tocNumber();
			return this.value = arg0 instanceof cError ? arg0 : new cNumber( -arg0.getValue() )
		},
		r.toString = function(){		// toString function
			return '-';
		}
        r.Assemble = function(arg){
            return new cString("-"+arg[0]);
        }
        r.isRightAssociative = true;
		return r;
    },
    'un_plus':function(){
        var r = new cBaseOperator('un_plus',50,1);
		r.Calculate = function(arg){
			var arg0 = arg[0];
			if( arg0 instanceof cArea){
				arg0 = arg0.cross(arguments[1].first);
			}
			arg0 = arg[0].tryConvert();
			return this.value = arg0;
		}
		r.toString = function(){ return '+'; }
        r.isRightAssociative = true;
        r.Assemble = function(arg){
            return new cString("+"+arg[0]);
        }
		return r;
	},
    '%':function(){
        var r = new cBaseOperator('%',45,1);
		r.Calculate = function(arg){
			var arg0 = arg[0];
			if( arg0 instanceof cArea){
				arg0 = arg0.cross(arguments[1].first);
			}
			arg0 = arg0.tocNumber();
			this.value = arg0 instanceof cError ? arg0 : new cNumber( arg0.getValue() / 100 );
			this.value.numFormat = 9;
			return this.value;
		}
        r.isRightAssociative = true;
        r.Assemble = function(arg){
            return new cString( arg[0] + this.name );
        }
		return r;
	},
    '^':function(){
        var r = new cBaseOperator('^',40);
		r.Calculate = function(arg){
			var arg0 = arg[0], arg1 = arg[1];
			if( arg0 instanceof cArea){
				arg0 = arg0.cross(arguments[1].first);
			}
			arg0 = arg0.tocNumber();
			if( arg1 instanceof cArea){
				arg1 = arg1.cross(arguments[1].first);
			}
			arg1 = arg1.tocNumber();
			if( arg0 instanceof cError ) return arg0;
			if( arg1 instanceof cError ) return arg1;
			
			var _v = Math.pow( arg0.getValue(), arg1.getValue() );
			if ( isNaN( _v ) )
				return this.value = new cError( cErrorType.not_numeric );
			else if ( _v === Number.POSITIVE_INFINITY )
				return this.value = new cError( cErrorType.division_by_zero );
			return this.value = new cNumber( _v );
		}
		return r;
    },
    '*':function(){
        var r = new cBaseOperator('*',30);
        r.Calculate = function(arg){
			var arg0 = arg[0].tryConvert(), arg1 = arg[1].tryConvert();
			return this.value = _func[arg0.type][arg1.type](arg0,arg1,"*",arguments[1].first);
		}
		return r;
    },
    '/':function(){
        var r = new cBaseOperator('/',30);
		r.Calculate = function(arg){
			var arg0 = arg[0].tryConvert(), arg1 = arg[1].tryConvert();
			return this.value = _func[arg0.type][arg1.type](arg0,arg1,"/",arguments[1].first);
		}
		return r;
    },
    '+':function(){
        var r = new cBaseOperator('+',20);
		r.Calculate = function(arg){
			var arg0 = arg[0].tryConvert(), arg1 = arg[1].tryConvert();
			return this.value = _func[arg0.type][arg1.type](arg0,arg1,"+",arguments[1].first);
		}
		return r;
    },
    '-':function(){
        var r = new cBaseOperator('-',20);
		r.Calculate = function(arg){
			var arg0 = arg[0].tryConvert(), arg1 = arg[1].tryConvert();
			return this.value = _func[arg0.type][arg1.type](arg0,arg1,"-",arguments[1].first);
		}
        return r;
    },
    '&':function(){//concat str
        var r = new cBaseOperator('&',15);
		r.Calculate = function(arg){
			var arg0 = arg[0], arg1 = arg[1];
			if( arg0 instanceof cArea){
				arg0 = arg0.cross(arguments[1].first);
			}
			arg0 = arg0.tocString();
			if( arg1 instanceof cArea){
				arg1 = arg1.cross(arguments[1].first);
			}
			arg1 = arg1.tocString();
			
			return this.value = arg0 instanceof cError ? arg0 :
				arg1 instanceof cError ? arg1 :
				new cString( arg0.toString().concat( arg1.toString() ) )
		}
		return r;
    },
    '=':function(){// equals
        var r = new cBaseOperator('=',10);
        r.Calculate = function(arg){
			var arg0 = arg[0].tryConvert(), arg1 = arg[1].tryConvert();
			return this.value = _func[arg0.type][arg1.type](arg0,arg1,"=",arguments[1].first);
		}
		return r;
    },
    '<>':function(){
        var r = new cBaseOperator('<>',10);
		r.Calculate = function(arg){
			var arg0 = arg[0].tryConvert(), arg1 = arg[1].tryConvert();
			return this.value = _func[arg0.type][arg1.type](arg0,arg1,"<>",arguments[1].first);
		}
		return r;
    },
    '<':function(){
        var r = new cBaseOperator('<',10);
        r.Calculate = function(arg){
			var arg0 = arg[0].tryConvert(), arg1 = arg[1].tryConvert();
			return this.value = _func[arg0.type][arg1.type](arg0,arg1,"<",arguments[1].first);
		}
		return r;
    },
    '<=':function(){
        var r = new cBaseOperator('<=',10);
		r.Calculate = function(arg){
			var arg0 = arg[0].tryConvert(), arg1 = arg[1].tryConvert();
			return this.value = _func[arg0.type][arg1.type](arg0,arg1,"<=",arguments[1].first);
		};
		return r;
    },
    '>':function(){
        var r = new cBaseOperator('>',10);
        r.Calculate = function(arg){
			var arg0 = arg[0].tryConvert(), arg1 = arg[1].tryConvert();
			return this.value = _func[arg0.type][arg1.type](arg0,arg1,">",arguments[1].first);
		};
		return r;
    },
    '>=':function(){
        var r = new cBaseOperator('>=',10);
		r.Calculate = function(arg){
			var arg0 = arg[0].tryConvert(), arg1 = arg[1].tryConvert();
			return this.value = _func[arg0.type][arg1.type](arg0,arg1,">=",arguments[1].first);
		};
		return r;
    }
/* 10 is lowest priopity */
};

/* cFormulaFunction is container for holding all ECMA-376 function, see chapter $18.17.7 in "ECMA-376, Second Edition, Part 1 - Fundamentals And Markup Language Reference" */
var cFormulaFunction = {
	/*
		Каждая формула представляет собой копию функции cBaseFunction.
		Для реализации очередной функции необходимо указать количество (минимальное и максимальное) принимаемых аргументов. Берем в спецификации.
		Также необходино написать реализацию методов Calculate и getInfo(возвращает название функции и вид/количетво аргументов).
		В методе Calculate необходимо отслеживать тип принимаемых аргументов. Для примера, если мы обращаемся к ячейке A1, в которой лежит 123, то этот аргумент будет числом. Если же там лежит "123", то это уже строка. Для более подробной информации смотреть спецификацию.
		Метод getInfo является обязательным, ибо через этот метод в интерфейс передается информация о реализованных функциях.
	*/
    Cube : {
        'groupName' : "Cube",
        'CUBEKPIMEMBER' : function(){
            var r = new cBaseFunction();
            r.setName("CUBEKPIMEMBER");
			return r;
        },
        'CUBEMEMBER' : function(){
            var r = new cBaseFunction();
            r.setName("CUBEMEMBER");
			return r;
        },
        'CUBEMEMBERPROPERTY' : function(){
            var r = new cBaseFunction();
            r.setName("CUBEMEMBERPROPERTY");
			return r;
        },
        'CUBERANKEDMEMBER' : function(){
            var r = new cBaseFunction();
            r.setName("CUBERANKEDMEMBER");
			return r;
        },
        'CUBESET' : function(){
            var r = new cBaseFunction();
            r.setName("CUBESET");
			return r;
        },
        'CUBESETCOUNT' : function(){
            var r = new cBaseFunction();
            r.setName("CUBESETCOUNT");
			return r;
        },
        'CUBEVALUE' : function(){
            var r = new cBaseFunction();
            r.setName("CUBEVALUE");
			return r;
        }
    },
    Database : {
        'groupName' : "Database",
        'DAVERAGE' : function(){
            var r = new cBaseFunction();
            r.setName("DAVERAGE");
			return r;
        },
        'DCOUNT' : function(){
            var r = new cBaseFunction();
            r.setName("DCOUNT");
			return r;
        },
        'DCOUNTA' : function(){
            var r = new cBaseFunction();
            r.setName("DCOUNTA");
			return r;
        },
        'DGET' : function(){
            var r = new cBaseFunction();
            r.setName("DGET");
			return r;
        },
        'DMAX' : function(){
            var r = new cBaseFunction();
            r.setName("DMAX");
			return r;
        },
        'DMIN' : function(){
            var r = new cBaseFunction();
            r.setName("DMIN");
			return r;
        },
        'DPRODUCT' : function(){
            var r = new cBaseFunction();
            r.setName("DPRODUCT");
			return r;
        },
        'DSTDEV' : function(){
            var r = new cBaseFunction();
            r.setName("DSTDEV");
			return r;
        },
        'DSTDEVP' : function(){
            var r = new cBaseFunction();
            r.setName("DSTDEVP");
			return r;
        },
        'DSUM' : function(){
            var r = new cBaseFunction();
            r.setName("DSUM");
			return r;
        },
        'DVAR' : function(){
            var r = new cBaseFunction();
            r.setName("DVAR");
			return r;
        },
        'DVARP' : function(){
            var r = new cBaseFunction();
            r.setName("DVARP");
			return r;
        }
    },
    DateAndTime : {
        'groupName' : "DateAndTime",
        'DATE' : function(){
            var r = new cBaseFunction();
            r.setArgumentsMin(3);
            r.setArgumentsMax(3);
            r.setName("DATE");
            r.Calculate = function(arg){
				var arg0 = arg[0], arg1 = arg[1], arg2 = arg[2], year, month, day;

                for (var i = 0; i<this.argumentsCurrent;i++){
                    var arg0 = arg[i];
					if( arg0 instanceof cArray ){
						arg0 = arg0.getElement(0);
					}
                    else if( arg0 instanceof cArea || arg0 instanceof cArea3D ){
						arg0 = arg0.cross(arguments[1].first).tocNumber();
					}

					if(arg0 instanceof cError){
						return this.setCA(arg0,true);
					}
                    else if( arg0 instanceof cNumber || arg0 instanceof cBool){
                        if(i==0)year = arg0.tocNumber().getValue();
                        if(i==1)month = arg0.tocNumber().getValue();
                        if(i==2)day = arg0.tocNumber().getValue();
                    }
                    else if ( arg0 instanceof cRef || arg0 instanceof cRef3D ){
                        var val = arg0.getValue();
                        if(val instanceof cError) return this.setCA(val,true);
                        else if( val instanceof cNumber || val instanceof cBool ){
                            if(i==0)year = arg0.tocNumber().getValue();
                            if(i==1)month = arg0.tocNumber().getValue();
                            if(i==2)day = arg0.tocNumber().getValue();
                        }
                        else{
                            return this.setCA(new cError( cErrorType.wrong_value_type ),true);
                        }
                    }
                    else if(arg0 instanceof cString || arg0 instanceof cEmpty){
                        var val = arg0.tocNumber();
                        if(val instanceof cError){
							return this.setCA(val,true);
						}
                        else {
                            if(i==0)year = arg0.tocNumber().getValue();
                            if(i==1)month = arg0.tocNumber().getValue();
                            if(i==2)day = arg0.tocNumber().getValue();
                        }
                    }
                }

                if( year >= 0 && year <= 1899)
                    year+=1900;
				if( month == 0 ){
					return this.setCA(new cError( cErrorType.not_numeric ),true);
				}
                this.value = new cNumber( Math.round( ( ( new Date(year, month - 1,  day) ).getTime()/1000 )/c_sPerDay+(c_DateCorrectConst+1) ) )
                this.value.numFormat = 14;
				this.value.ca = true;
                return this.value;
            }
            r.getInfo = function(){
                return {
                    name:this.name,
                    args:"( year, month, day )"
                };
            }
			return r;
		},
        'DATEDIF' : function(){
            var r = new cBaseFunction();
            r.setName("DATEDIF");
			return r;
        },
        'DATEVALUE' : function(){
            var r = new cBaseFunction();
            r.setName("DATEVALUE");
			r.setArgumentsMin(1);
            r.setArgumentsMax(1);
			r.Calculate = function(arg){
				var arg0 = arg[0];

				if ( arg0 instanceof cArea || arg0 instanceof cArea3D ){
					arg0 = arg0.cross(arguments[1].first);
				}
				else if( arg0 instanceof cArray ){
					arg0 = arg0.getElementRowCol(0,0);
				}

				arg0 = arg0.tocString();

				if ( arg0 instanceof cError )
					return this.value = arg0;

				if( arg0.tocNumber() instanceof cNumber && arg0.tocNumber().getValue() > 0 )
					return this.value = new cNumber( parseInt(arg0.tocNumber().getValue()) );
					
				var res = g_oFormatParser.parse(arg0.getValue());

				if( res && res.bDateTime )
					return this.value = new cNumber( parseInt(res.value) );
				else
					return this.value = new cError( cErrorType.wrong_value_type );
			}
			r.getInfo = function(){
                return {
                    name:this.name,
                    args:"( date-time-string )"
                };
            }
			r.setFormat(r.formatType.noneFormat);
			return r;
        },
        'DAY' : function(){
            var r = new cBaseFunction();
            r.setArgumentsMin(1);
            r.setArgumentsMax(1);
            r.setName("DAY");
            r.Calculate = function(arg){
                var arg0 = arg[0],val;
				if( arg0 instanceof cArray ){
					arg0 = arg0.getElement(0);
				}
				else if( arg0 instanceof cArea || arg0 instanceof cArea3D ){
					arg0 = arg0.cross(arguments[1].first).tocNumber();
					val = arg0.tocNumber().getValue();
				}
                if(arg0 instanceof cError) return this.setCA(arg0,true);
                else if( arg0 instanceof cNumber || arg0 instanceof cBool){
                    val = arg0.tocNumber().getValue();
                }
                else if ( arg0 instanceof cRef || arg0 instanceof cRef3D ){
                    val = arg0.getValue().tocNumber();
                    if( val instanceof cNumber || val instanceof cBool ){
                        val = arg0.tocNumber().getValue();
                    }
                    else{
						return this.setCA(new cError( cErrorType.wrong_value_type ),true);
                    }
                }
                else if(arg0 instanceof cString){
                    val = arg0.tocNumber();
                    if(val instanceof cError || val instanceof cEmpty ){
						var d = new Date( arg0.getValue() );
                        if( isNaN(d) ){
							return this.setCA(new cError( cErrorType.wrong_value_type ),true);
						}
						else
							val = Math.floor( ( d.getTime()/1000 - d.getTimezoneOffset()*60 )/c_sPerDay+( c_DateCorrectConst + (g_bDate1904?0:1) ) );
                    }
                    else {
                        val = arg0.tocNumber().getValue();
                    }
                }
				if(val < 0)
					return this.setCA(new cError( cErrorType.not_numeric ),true);
				else if(!g_bDate1904)
				{
					if( val < 60 )
						return this.setCA(new cNumber( ( new Date((val-c_DateCorrectConst)*c_msPerDay) ).getUTCDate() ),true,0);
					else if( val == 60 )
						return this.setCA(new cNumber( ( new Date((val-c_DateCorrectConst-1)*c_msPerDay) ).getUTCDate() +1),true,0);
					else
						return this.setCA(new cNumber( ( new Date((val-c_DateCorrectConst-1)*c_msPerDay) ).getUTCDate() ),true,0);
				}
				else
					return this.setCA(new cNumber( ( new Date((val-c_DateCorrectConst)*c_msPerDay) ).getUTCDate() ),true,0);
            }
            r.getInfo = function(){
                return {
                    name:this.name,
                    args:"( date-value )"
                };
            }
			r.setFormat(r.formatType.noneFormat);
			return r;
		},
        'DAYS360' : function(){
            var r = new cBaseFunction();
            r.setName("DAYS360");
			return r;
        },
        'EDATE' : function(){
            var r = new cBaseFunction();
            r.setName("EDATE");
			r.setArgumentsMin(2);
            r.setArgumentsMax(2);
			r.Calculate = function(arg){
				var arg0 = arg[0], arg1 = arg[1];

				if ( arg0 instanceof cArea || arg0 instanceof cArea3D ){
					arg0 = arg0.cross(arguments[1].first);
				}
				else if( arg0 instanceof cArray ){
					arg0 = arg0.getElementRowCol(0,0);
				}

				if ( arg1 instanceof cArea || arg1 instanceof cArea3D ){
					arg1 = arg1.cross(arguments[1].first);
				}
				else if( arg1 instanceof cArray ){
					arg1 = arg1.getElementRowCol(0,0);
				}

				arg0 = arg0.tocNumber();
				arg1 = arg1.tocNumber();

				if( arg0 instanceof cError) return this.value = arg0;
				if( arg1 instanceof cError) return this.value = arg1;

				var val = arg0.getValue(), date, _date;

				if(val < 0)
					return this.setCA(new cError( cErrorType.not_numeric ),true);
				else if(!g_bDate1904){
					if( val < 60 )
						val = new Date((val-c_DateCorrectConst)*c_msPerDay);
					else if( val == 60 )
						val = new Date((val-c_DateCorrectConst-1)*c_msPerDay);
					else
						val = new Date((val-c_DateCorrectConst-1)*c_msPerDay);
				}
				else
					val = new Date((val-c_DateCorrectConst)*c_msPerDay);

				date = new Date(val);

				if( 0 <= date.getDate() && 28 >= date.getDate() ){
					val = new Date(val.setMonth(val.getMonth()+arg1.getValue()))
				}
				else if( 29 <= date.getDate() && 31 >= date.getDate() ){
					date.setDate(1);
					date.setMonth(date.getMonth()+arg1.getValue());
					if( val.getDate() > (_date = date.getDaysInMonth()) ){
						val.setDate( _date );
					}
					val = new Date(val.setMonth(val.getMonth()+arg1.getValue()));
				}

				return this.value = new cNumber( Math.floor( ( val.getTime()/1000 - val.getTimezoneOffset()*60 )/c_sPerDay+(c_DateCorrectConst+1) ) )
			}
			r.getInfo = function(){
                return {
                    name:this.name,
                    args:"( start-date , month-offset )"
                };
            }
			r.setFormat(r.formatType.noneFormat);
			return r;
        },
        'EOMONTH' : function(){
            var r = new cBaseFunction();
            r.setName("EOMONTH");
			r.setArgumentsMin(2);
            r.setArgumentsMax(2);
			r.Calculate = function(arg){
				var arg0 = arg[0], arg1 = arg[1];

				if ( arg0 instanceof cArea || arg0 instanceof cArea3D ){
					arg0 = arg0.cross(arguments[1].first);
				}
				else if( arg0 instanceof cArray ){
					arg0 = arg0.getElementRowCol(0,0);
				}

				if ( arg1 instanceof cArea || arg1 instanceof cArea3D ){
					arg1 = arg1.cross(arguments[1].first);
				}
				else if( arg1 instanceof cArray ){
					arg1 = arg1.getElementRowCol(0,0);
				}

				arg0 = arg0.tocNumber();
				arg1 = arg1.tocNumber();

				if( arg0 instanceof cError) return this.value = arg0;
				if( arg1 instanceof cError) return this.value = arg1;

				var val = arg0.getValue(), date, _date;

				if(val < 0)
					return this.setCA(new cError( cErrorType.not_numeric ),true);
				else if(!g_bDate1904){
					if( val < 60 )
						val = new Date((val-c_DateCorrectConst)*c_msPerDay);
					else if( val == 60 )
						val = new Date((val-c_DateCorrectConst-1)*c_msPerDay);
					else
						val = new Date((val-c_DateCorrectConst-1)*c_msPerDay);
				}
				else
					val = new Date((val-c_DateCorrectConst)*c_msPerDay);

				date = new Date(val);

				val.setDate(1);
				val.setMonth(val.getMonth()+arg1.getValue());
				val.setDate(val.getDaysInMonth());

				return this.value = new cNumber( Math.floor( ( val.getTime()/1000 - val.getTimezoneOffset()*60 )/c_sPerDay+(c_DateCorrectConst+1) ) );
			}
			r.getInfo = function(){
                return {
                    name:this.name,
                    args:"( start-date , month-offset )"
                };
            }
			r.setFormat(r.formatType.noneFormat);
			return r;
        },
        'HOUR' : function(){
            var r = new cBaseFunction();
            r.setArgumentsMin(1);
            r.setArgumentsMax(1);
            r.setName("HOUR");
            r.Calculate = function(arg){
                var arg0 = arg[0],val;
				if( arg0 instanceof cArray ){
					arg0 = arg0.getElement(0);
				}
				else if ( arg0 instanceof cArea || arg0 instanceof cArea3D ){
					arg0 = arg0.cross(arguments[1].first).tocNumber();
                }

                if(arg0 instanceof cError)return this.setCA(arg0,true);
                else if( arg0 instanceof cNumber || arg0 instanceof cBool){
                    val = arg0.tocNumber().getValue();
                }
                else if ( arg0 instanceof cRef || arg0 instanceof cRef3D ){
                    val = arg0.getValue();
                    if(val instanceof cError)return this.setCA(val,true);
                    else if( val instanceof cNumber || val instanceof cBool ){
                        val = arg0.tocNumber().getValue();
                    }
                    else{
						return this.setCA(new cError( cErrorType.wrong_value_type ),true);
                    }
                }
                else if(arg0 instanceof cString){
                    val = arg0.tocNumber();
                   if(val instanceof cError || val instanceof cEmpty ){
						var d = new Date( arg0.getValue() );
						if( isNaN(d) ){
							d = g_oFormatParser.parseDate(arg0.getValue());
							if( d == null ){
								return this.setCA(new cError( cErrorType.wrong_value_type ),true);
							}
							val = d.value ;
						}
						else
							val = ( d.getTime()/1000 - d.getTimezoneOffset()*60 )/c_sPerDay+( c_DateCorrectConst + (g_bDate1904?0:1) );
                    }
                    else {
                        val = arg0.tocNumber().getValue();
                    }
                }
                if(val < 0)
					return this.setCA(new cError( cErrorType.not_numeric ),true);
				else							 //1		 2 3 4					   4	3		 	 					2 1
					return this.setCA(  new cNumber( parseInt( ( ( val-Math.floor(val) )*24 ).toFixed(cExcelDateTimeDigits) ) ) ,true,0);
            }
            r.getInfo = function(){
                return {
                    name:this.name,
                    args:"( time-value )"
                };
            }
			r.setFormat(r.formatType.noneFormat);
			return r;
		},
        'MINUTE' : function(){
            var r = new cBaseFunction();
            r.setArgumentsMin(1);
            r.setArgumentsMax(1);
            r.setName("MINUTE");
            r.Calculate = function(arg){
                var arg0 = arg[0],val;
				if( arg0 instanceof cArray ){
					arg0 = arg0.getElement(0);
				}
				else if ( arg0 instanceof cArea || arg0 instanceof cArea3D ){
					arg0 = arg0.cross(arguments[1].first).tocNumber();
                }

                if(arg0 instanceof cError) return this.setCA(arg0,true);
                else if( arg0 instanceof cNumber || arg0 instanceof cBool){
                    val = arg0.tocNumber().getValue();
                }
                else if ( arg0 instanceof cRef || arg0 instanceof cRef3D ){
                    val = arg0.getValue();
                    if(val instanceof cError) return this.setCA( val ,true);
                    else if( val instanceof cNumber || val instanceof cBool ){
                        val = arg0.tocNumber().getValue();
                    }
                    else{
						return this.setCA( new cError( cErrorType.wrong_value_type ) ,true);
                    }
                }
                else if(arg0 instanceof cString){
                    val = arg0.tocNumber();
                    if(val instanceof cError || val instanceof cEmpty ){
						var d = new Date( arg0.getValue() );
						if( isNaN(d) ){
							d = g_oFormatParser.parseDate(arg0.getValue());
							if( d == null ){
								return this.setCA( new cError( cErrorType.wrong_value_type ) ,true);
							}
							val = d.value ;
						}
						else
							val = ( d.getTime()/1000 - d.getTimezoneOffset()*60 )/c_sPerDay+( c_DateCorrectConst + (g_bDate1904?0:1) );
                    }
                    else {
                        val = arg0.tocNumber().getValue();
                    }
                }
                if(val < 0)
					return this.setCA( new cError( cErrorType.not_numeric ) ,true);
				else{
					val = parseInt(( ( val*24-Math.floor(val*24) ) * 60 ).toFixed(cExcelDateTimeDigits)) % 60;
					return this.setCA( new cNumber( val ) ,true,0);
				}
            }
            r.getInfo = function(){
                return {
                    name:this.name,
                    args:"( time-value )"
                };
            }
			r.setFormat(r.formatType.noneFormat);
			return r;
		},
        'MONTH' : function(){
            var r = new cBaseFunction();
            r.setArgumentsMin(1);
            r.setArgumentsMax(1);
            r.setName("MONTH");
            r.Calculate = function(arg){
                var arg0 = arg[0],val;
				if( arg0 instanceof cArray ){
					arg0 = arg0.getElement(0);
				}
                else if ( arg0 instanceof cArea || arg0 instanceof cArea3D ){
					arg0 = arg0.cross(arguments[1].first).tocNumber();
                }

				if(arg0 instanceof cError) return this.setCA( arg0 ,true);
                else if( arg0 instanceof cNumber || arg0 instanceof cBool){
                    val = arg0.tocNumber().getValue();
                }
                else if ( arg0 instanceof cRef || arg0 instanceof cRef3D ){
                    val = arg0.getValue();
                    if(val instanceof cError) return this.setCA( val ,true);
                    else if( val instanceof cNumber || val instanceof cBool ){
                        val = arg0.tocNumber().getValue();
                    }
                    else{
						return this.setCA( new cError( cErrorType.wrong_value_type ) ,true);
                    }
                }
                else if(arg0 instanceof cString){
                    val = arg0.tocNumber();
                    if(val instanceof cError || val instanceof cEmpty ){
						var d = new Date( arg0.getValue() );
						if( isNaN(d) ){
							return this.setCA( new cError( cErrorType.wrong_value_type ) ,true);
						}
						else
							val = Math.floor( ( d.getTime()/1000 - d.getTimezoneOffset()*60 )/c_sPerDay+( c_DateCorrectConst + (g_bDate1904?0:1) ) );
                    }
                    else {
                        val = arg0.tocNumber().getValue();
                    }
                }
				if(val < 0)
					return this.setCA( new cError( cErrorType.not_numeric ) ,true);
				else
					if(!g_bDate1904){
						if( val == 60 )
							return this.setCA( new cNumber( 2 ) ,true,0);
						else
							return this.setCA( new cNumber( ( new Date( ( (val==0?1:val) - c_DateCorrectConst ) * c_msPerDay) ).getUTCMonth() + 1 ) ,true,0);
					}
					else
						return this.setCA( new cNumber( ( new Date( ( (val==0?1:val) - c_DateCorrectConst ) * c_msPerDay) ).getUTCMonth() + 1 ) ,true,0);
            }
            r.getInfo = function(){
                return {
                    name:this.name,
                    args:"( date-value )"
                };
            }
			r.setFormat(r.formatType.noneFormat);
			return r;
		},
        'NETWORKDAYS' : function(){
            var r = new cBaseFunction();
            r.setName("NETWORKDAYS");
			r.setArgumentsMin(2);
            r.setArgumentsMax(3);
			r.Calculate = function(arg){
				var arg0 = arg[0], arg1 = arg[1], arg2 = arg[2], arrDateIncl = [];

				if ( arg0 instanceof cArea || arg0 instanceof cArea3D ){
					arg0 = arg0.cross(arguments[1].first);
				}
				else if( arg0 instanceof cArray ){
					arg0 = arg0.getElementRowCol(0,0);
				}

				if ( arg1 instanceof cArea || arg1 instanceof cArea3D ){
					arg1 = arg1.cross(arguments[1].first);
				}
				else if( arg1 instanceof cArray ){
					arg1 = arg1.getElementRowCol(0,0);
				}

				arg0 = arg0.tocNumber();
				arg1 = arg1.tocNumber();

				if( arg0 instanceof cError) return this.value = arg0;
				if( arg1 instanceof cError) return this.value = arg1;

				var val0 = arg0.getValue(), val1 = arg1.getValue(), dif, count = 0;

				if(val0 < 0)
					return this.setCA(new cError( cErrorType.not_numeric ),true);
				else if(!g_bDate1904){
					if( val0 < 60 )
						val0 = new Date((val0-c_DateCorrectConst)*c_msPerDay);
					else if( val0 == 60 )
						val0 = new Date((val0-c_DateCorrectConst-1)*c_msPerDay);
					else
						val0 = new Date((val0-c_DateCorrectConst-1)*c_msPerDay);
				}
				else
					val0 = new Date((val0-c_DateCorrectConst)*c_msPerDay);

				if(val1 < 0)
					return this.setCA(new cError( cErrorType.not_numeric ),true);
				else if(!g_bDate1904){
					if( val1 < 60 )
						val1 = new Date((val1-c_DateCorrectConst)*c_msPerDay);
					else if( val1 == 60 )
						val1 = new Date((val1-c_DateCorrectConst-1)*c_msPerDay);
					else
						val1 = new Date((val1-c_DateCorrectConst-1)*c_msPerDay);
				}
				else
					val1 = new Date((val1-c_DateCorrectConst)*c_msPerDay);

				var holidays = [];

				if( arg2 ){
					if( arg2 instanceof cArea || arg2 instanceof cArea3D ){
						var arr = arg2.getValue();
						for(var i = 0; i < arr.length; i++){
							if( arr[i] instanceof cNumber && arr[i].getValue() >= 0 ){
								holidays.push(arr[i]);
							}
						}
					}
					else if( arg2 instanceof cArray ){
						arg2.foreach(function(elem,r,c){
							if( elem instanceof cNumber ){
								holidays.push(elem);
							}
							else if( elem instanceof cString ){
								var res = g_oFormatParser.parse(elem.getValue());
								if( res && res.bDateTime && res.value >= 0 )
									holidays.push( new cNumber(parseInt(res.value)) );
							}
						})
					}
				}

				for(var i = 0; i < holidays.length; i++ ){
					if(!g_bDate1904){
						if( holidays[i].getValue() < 60 )
							holidays[i] = new Date((holidays[i].getValue()-c_DateCorrectConst)*c_msPerDay);
						else if( holidays[i] == 60 )
							holidays[i] = new Date((holidays[i].getValue()-c_DateCorrectConst-1)*c_msPerDay);
						else
							holidays[i] = new Date((holidays[i].getValue()-c_DateCorrectConst-1)*c_msPerDay);
					}
					else
						holidays[i] = new Date((holidays[i].getValue()-c_DateCorrectConst)*c_msPerDay);
				}

				function includeInHolidays(date){
					for(var i = 0; i < holidays.length; i++ ){
						if( date.getTime() == holidays[i].getTime() )
							return false;
					}
					return true;
				}

				dif = ( val1 - val0 ) / c_msPerDay;
				for(var i = 0; i < Math.abs(dif); i++ ){
					var date = new Date( val0 );
					date.setDate(val0.getDate()+i) ;
					if( date.getDay() != 5 && date.getDay() != 6 && includeInHolidays(date) )
						count++;
				}


				return this.value = new cNumber( (dif<0?-1:1)*count );
			}
			r.getInfo = function(){
                return {
                    name:this.name,
                    args:"( start-date , end-date [ , holidays ] )"
                };
            }
			r.setFormat(r.formatType.noneFormat);
			return r;
        },
        'NETWORKDAYS.INTL' : function(){
            var r = new cBaseFunction();
            r.setName("NETWORKDAYS.INTL");
			return r;
        },
        'NOW' : function(){
            var r = new cBaseFunction();
            r.setArgumentsMin(0);
            r.setArgumentsMax(0);
            r.setName("NOW");
            r.Calculate = function(){
                var d = new Date();
                this.value = new cNumber( Math.floor( ( d.getTime()/1000 - d.getTimezoneOffset()*60 )/c_sPerDay+(c_DateCorrectConst+1) ) + ( (d.getHours()*60*60+d.getMinutes()*60+d.getSeconds())/c_sPerDay ) );
                this.value.numFormat = 22;
				return this.setCA( this.value ,true);
            }
            r.getInfo = function(){
                return {
                    name:this.name,
                    args:"()"
                };
            }
			return r;
		},
        'SECOND' : function(){
            var r = new cBaseFunction();
            r.setArgumentsMin(1);
            r.setArgumentsMax(1);
            r.setName("SECOND");
            r.Calculate = function(arg){
                var arg0 = arg[0],val;
				if( arg0 instanceof cArray ){
					arg0 = arg0.getElement(0);
				}
                else if ( arg0 instanceof cArea || arg0 instanceof cArea3D ){
					arg0 = arg0.cross(arguments[1].first).tocNumber();
                }

				if(arg0 instanceof cError) return this.setCA( arg0 ,true);
                else if( arg0 instanceof cNumber || arg0 instanceof cBool){
                    val = arg0.tocNumber().getValue();
                }
                else if ( arg0 instanceof cRef || arg0 instanceof cRef3D ){
                    val = arg0.getValue();
                    if(val instanceof cError) return this.setCA( val ,true);
                    else if( val instanceof cNumber || val instanceof cBool ){
                        val = arg0.tocNumber().getValue();
                    }
                    else{
						return this.setCA( new cError( cErrorType.wrong_value_type ) ,true);
                    }
                }
                else if(arg0 instanceof cString){
                    val = arg0.tocNumber();
                    if(val instanceof cError || val instanceof cEmpty ){
						var d = new Date( arg0.getValue() );
						if( isNaN(d) ){
							d = g_oFormatParser.parseDate(arg0.getValue());
							if( d == null ){
								return this.setCA( new cError( cErrorType.wrong_value_type ) ,true);
							}
							val = d.value ;
						}
						else
							val = ( d.getTime()/1000 - d.getTimezoneOffset()*60 )/c_sPerDay+( c_DateCorrectConst + (g_bDate1904?0:1) );
                    }
                    else {
                        val = arg0.tocNumber().getValue();
                    }
                }
                if(val < 0)
					return this.setCA( new cError( cErrorType.not_numeric ) ,true);
				else{
					val = parseInt((( val*24*60-Math.floor(val*24*60) ) * 60).toFixed(cExcelDateTimeDigits)) % 60;
					return this.setCA( new cNumber( val ) ,true,0);
				}
            }
            r.getInfo = function(){
                return {
                    name:this.name,
                    args:"( time-value )"
                };
            }
			r.setFormat(r.formatType.noneFormat);
			return r;
		},
        'TIME' : function(){
            var r = new cBaseFunction();
            r.setArgumentsMin(3);
            r.setArgumentsMax(3);
            r.setName("TIME");
            //to excel (hh*60*60+mm*60+ss)/c_sPerDay (c_sPerDay the number of seconds in a day)
            r.Calculate = function(arg){
                var hour,minute,second;
                for (var i = 0; i<this.argumentsCurrent;i++){
                    var arg0 = arg[i];
					if( arg0 instanceof cArray ){
						arg0 = arg0.getElement(0);
					}
                    else if ( arg0 instanceof cArea || arg0 instanceof cArea3D ){
						arg0 = arg0.cross(arguments[1].first).tocNumber();
					}

					if(arg0 instanceof cError) return this.setCA( arg0 ,true);
                    else if( arg0 instanceof cNumber || arg0 instanceof cBool){
                        if(i==0)hour = arg0.tocNumber().getValue();
                        if(i==1)minute = arg0.tocNumber().getValue();
                        if(i==2)second = arg0.tocNumber().getValue();
                    }
                    else if ( arg0 instanceof cRef || arg0 instanceof cRef3D ){
                        var val = arg0.getValue();
                        if(val instanceof cError) return this.setCA( val ,true);
                        else if( val instanceof cNumber || val instanceof cBool ){
                            if(i==0)hour = arg0.tocNumber().getValue();
                            if(i==1)minute = arg0.tocNumber().getValue();
                            if(i==2)second = arg0.tocNumber().getValue();
                        }
                        else{
							return this.setCA( new cError( cErrorType.wrong_value_type ) ,true);
                        }
                    }
                    else if(arg0 instanceof cString || arg0 instanceof cEmpty){
                        var val = arg0.tocNumber();
                        if(val instanceof cError) return this.setCA( val ,true);
                        else {
                            if(i==0)hour = arg0.tocNumber().getValue();
                            if(i==1)minute = arg0.tocNumber().getValue();
                            if(i==2)second = arg0.tocNumber().getValue();
                        }
                    }
                }
                var v = (hour*60*60+minute*60+second)/c_sPerDay;
				this.setCA( new cNumber( v - Math.floor(v) ) ,true);
				if( arguments[1].getNumFormatStr().toLowerCase() === "general" )
					this.value.numFormat = 18;
                return this.value;
            }
            r.getInfo = function(){
                return {
                    name:this.name,
                    args:"( hour, minute, second )"
                };
            }
			return r;
		},
        'TIMEVALUE' : function(){
            var r = new cBaseFunction();
            r.setName("TIMEVALUE");
			return r;
        },
        'TODAY' : function(){
            var r = new cBaseFunction();
			r.setArgumentsMin(0);
			r.setArgumentsMax(0);
            r.setName("TODAY");
            r.Calculate = function(){
                var d = new Date();
				//						1			2 3												3		4					  5				   5 4 2 1
				this.setCA(  new cNumber( Math.floor( ( d.getTime()/1000 - d.getTimezoneOffset()*60 )/c_sPerDay+( c_DateCorrectConst + (g_bDate1904?0:1) ) ) ) ,true);
				if( arguments[1].getNumFormatStr().toLowerCase() === "general" )
					this.value.numFormat = 14;
                return this.value;
            }
            r.getInfo = function(){
                return {
                    name:this.name,
                    args:"()"
                };
            }
			return r;
			//Math.floor(((new Date()).getTime()/1000)/c_sPerDay+(c_DateCorrectConst+1)) from UTC-timestamp to excel 2010
        },
        'WEEKDAY' : function(){
            var r = new cBaseFunction();
            r.setName("WEEKDAY");
			return r;
        },
        'WEEKNUM' : function(){
            var r = new cBaseFunction();
            r.setName("WEEKNUM");
			return r;
        },
        'WORKDAY' : function(){
            var r = new cBaseFunction();
            r.setName("WORKDAY");
			r.setArgumentsMin(2);
            r.setArgumentsMax(3);
			r.Calculate = function(arg){
				var arg0 = arg[0], arg1 = arg[1], arg2 = arg[2], arrDateIncl = [];

				if ( arg0 instanceof cArea || arg0 instanceof cArea3D ){
					arg0 = arg0.cross(arguments[1].first);
				}
				else if( arg0 instanceof cArray ){
					arg0 = arg0.getElementRowCol(0,0);
				}

				if ( arg1 instanceof cArea || arg1 instanceof cArea3D ){
					arg1 = arg1.cross(arguments[1].first);
				}
				else if( arg1 instanceof cArray ){
					arg1 = arg1.getElementRowCol(0,0);
				}

				arg0 = arg0.tocNumber();
				arg1 = arg1.tocNumber();

				if( arg0 instanceof cError) return this.value = arg0;
				if( arg1 instanceof cError) return this.value = arg1;

				var val0 = arg0.getValue(), val1 = arg1.getValue(),  holidays = []

				if(val0 < 0)
					return this.setCA(new cError( cErrorType.not_numeric ),true);
				else if(!g_bDate1904){
					if( val0 < 60 )
						val0 = new Date((val0-c_DateCorrectConst)*c_msPerDay);
					else if( val0 == 60 )
						val0 = new Date((val0-c_DateCorrectConst-1)*c_msPerDay);
					else
						val0 = new Date((val0-c_DateCorrectConst-1)*c_msPerDay);
				}
				else
					val0 = new Date((val0-c_DateCorrectConst)*c_msPerDay);

				if( arg2 ){
					if( arg2 instanceof cArea || arg2 instanceof cArea3D ){
						var arr = arg2.getValue();
						for(var i = 0; i < arr.length; i++){
							if( arr[i] instanceof cNumber && arr[i].getValue() >= 0 ){
								holidays.push(arr[i]);
							}
						}
					}
					else if( arg2 instanceof cArray ){
						arg2.foreach(function(elem,r,c){
							if( elem instanceof cNumber ){
								holidays.push(elem);
							}
							else if( elem instanceof cString ){
								var res = g_oFormatParser.parse(elem.getValue());
								if( res && res.bDateTime && res.value >= 0 )
									holidays.push( new cNumber(parseInt(res.value)) );
							}
						})
					}
				}

				for(var i = 0; i < holidays.length; i++ ){
					if(!g_bDate1904){
						if( holidays[i].getValue() < 60 )
							holidays[i] = new Date((holidays[i].getValue()-c_DateCorrectConst)*c_msPerDay);
						else if( holidays[i] == 60 )
							holidays[i] = new Date((holidays[i].getValue()-c_DateCorrectConst-1)*c_msPerDay);
						else
							holidays[i] = new Date((holidays[i].getValue()-c_DateCorrectConst-1)*c_msPerDay);
					}
					else
						holidays[i] = new Date((holidays[i].getValue()-c_DateCorrectConst)*c_msPerDay);
				}

				function notAHolidays(date){
					for(var i = 0; i < holidays.length; i++ ){
						if( date.getTime() == holidays[i].getTime() )
							return false;
					}
					return true;
				}

				var dif = arg1.getValue(), count = 1, dif1 = dif>0?1:dif<0?-1:0, val, date = val0;
				while( Math.abs(dif) > count ){
					date = new Date( val0.getTime() + dif1*c_msPerDay );
					if( date.getDay() != 6 && date.getDay() != 0 && notAHolidays(date) )
						count++;
					dif>=0?dif1++:dif1--;
				}
				date = new Date( val0.getTime() + dif1*c_msPerDay );
				val = parseInt(( date.getTime()/1000 - date.getTimezoneOffset()*60 )/c_sPerDay+( c_DateCorrectConst + (g_bDate1904?0:1) ));
				
				if( val < 0 )
					return this.setCA(new cError( cErrorType.not_numeric ),true);
					
				if( arguments[1].getNumFormatStr().toLowerCase() === "general" )
					return this.setCA( new cNumber( val ) ,true,14);
				else
					return this.setCA( new cNumber( val ) ,true);
			}
			r.getInfo = function(){
                return {
                    name:this.name,
                    args:"( start-date , day-offset [ , holidays ] )"
                };
            }
			// r.setFormat(r.formatType.noneFormat);
			return r;
        },
        'WORKDAY.INTL' : function(){
            var r = new cBaseFunction();
            r.setName("WORKDAY.INTL");
			return r;
        },
        'YEAR' : function(){
            var r = new cBaseFunction();
            r.setArgumentsMin(1);
            r.setArgumentsMax(1);
            r.setName("YEAR");
            r.Calculate = function(arg){
                var arg0 = arg[0],val;
				if( arg0 instanceof cArray ){
					arg0 = arg0.getElement(0);
				}
				else if ( arg0 instanceof cArea || arg0 instanceof cArea3D ){
					arg0 = arg0.cross(arguments[1].first).tocNumber();
                }

                if(arg0 instanceof cError) return this.setCA( arg0 ,true);
                else if( arg0 instanceof cNumber || arg0 instanceof cBool){
                    val = arg0.tocNumber().getValue();
                }
                else if ( arg0 instanceof cArea || arg0 instanceof cArea3D ){
					return this.setCA( new cError( cErrorType.wrong_value_type ) ,true);
                }
                else if ( arg0 instanceof cRef || arg0 instanceof cRef3D ){
                    val = arg0.getValue();
                    if(val instanceof cError) return this.setCA( val ,true);
                    else if( val instanceof cNumber || val instanceof cBool ){
                        val = arg0.tocNumber().getValue();
                    }
                    else{
						return this.setCA( new cError( cErrorType.wrong_value_type ) ,true);
                    }
                }
                else if(arg0 instanceof cString){
                    val = arg0.tocNumber();
                    if(val instanceof cError || val instanceof cEmpty ){
						var d = new Date( arg0.getValue() );
                        if( isNaN(d) ){
							return this.setCA( new cError( cErrorType.wrong_value_type ) ,true);
						}
						else
							val = Math.floor( ( d.getTime()/1000 - d.getTimezoneOffset()*60 )/c_sPerDay+( c_DateCorrectConst + (g_bDate1904?0:1) ) );
                    }
                    else {
                        val = arg0.tocNumber().getValue();
                    }
                }
                if(val < 0)
					return this.setCA( new cError( cErrorType.not_numeric ) ,true,0);
				else
					return this.setCA( new cNumber( (new Date((val-(c_DateCorrectConst+1))*c_msPerDay)).getUTCFullYear() ) ,true,0);
            }
            r.getInfo = function(){
                return {
                    name:this.name,
                    args:"( date-value )"
                };
            }
			r.setFormat(r.formatType.noneFormat);
			return r;
		},
        'YEARFRAC' : function(){
            var r = new cBaseFunction();
            r.setName("YEARFRAC");
			return r;
        }
    },
    Engineering : {
        'groupName' : "Engineering",
        'BESSELI' : function(){
            var r = new cBaseFunction();
            r.setName("BESSELI");
			return r;
        },
        'BESSELJ' : function(){
            var r = new cBaseFunction();
            r.setName("BESSELJ");
			return r;
        },
        'BESSELK' : function(){
            var r = new cBaseFunction();
            r.setName("BESSELK");
			return r;
        },
        'BESSELY' : function(){
            var r = new cBaseFunction();
            r.setName("BESSELY");
			return r;
        },
        'BIN2DEC' : function(){
            var r = new cBaseFunction();
            r.setName("BIN2DEC");
			return r;
        },
        'BIN2HEX' : function(){
            var r = new cBaseFunction();
            r.setName("BIN2HEX");
			return r;
        },
        'BIN2OCT' : function(){
            var r = new cBaseFunction();
            r.setName("BIN2OCT");
			return r;
        },
        'COMPLEX' : function(){
            var r = new cBaseFunction();
            r.setName("COMPLEX");
			return r;
        },
        'CONVERT' : function(){
            var r = new cBaseFunction();
            r.setName("CONVERT");
			return r;
        },
        'DEC2BIN' : function(){
            var r = new cBaseFunction();
            r.setName("DEC2BIN");
			return r;
        },
        'DEC2HEX' : function(){
            var r = new cBaseFunction();
            r.setName("DEC2HEX");
			return r;
        },
        'DEC2OCT' : function(){
            var r = new cBaseFunction();
            r.setName("DEC2OCT");
			return r;
        },
        'DELTA' : function(){
            var r = new cBaseFunction();
            r.setName("DELTA");
			return r;
        },
        'ERF' : function(){
            var r = new cBaseFunction();
            r.setName("ERF");
			return r;
        },
        'ERFC' : function(){
            var r = new cBaseFunction();
            r.setName("ERFC");
			return r;
        },
        'GESTEP' : function(){
            var r = new cBaseFunction();
            r.setName("GESTEP");
			return r;
        },
        'HEX2BIN' : function(){
            var r = new cBaseFunction();
            r.setName("HEX2BIN");
			return r;
        },
        'HEX2DEC' : function(){
            var r = new cBaseFunction();
            r.setName("HEX2DEC");
			return r;
        },
        'HEX2OCT' : function(){
            var r = new cBaseFunction();
            r.setName("HEX2OCT");
			return r;
        },
        'IMABS' : function(){
            var r = new cBaseFunction();
            r.setName("IMABS");
			return r;
        },
        'IMAGINARY' : function(){
            var r = new cBaseFunction();
            r.setName("IMAGINARY");
			return r;
        },
        'IMARGUMENT' : function(){
            var r = new cBaseFunction();
            r.setName("IMARGUMENT");
			return r;
        },
        'IMCONJUGATE' : function(){
            var r = new cBaseFunction();
            r.setName("IMCONJUGATE");
			return r;
        },
        'IMCOS' : function(){
            var r = new cBaseFunction();
            r.setName("IMCOS");
			return r;
        },
        'IMDIV' : function(){
            var r = new cBaseFunction();
            r.setName("IMDIV");
			return r;
        },
        'IMEXP' : function(){
            var r = new cBaseFunction();
            r.setName("IMEXP");
			return r;
        },
        'IMLN' : function(){
            var r = new cBaseFunction();
            r.setName("IMLN");
			return r;
        },
        'IMLOG10' : function(){
            var r = new cBaseFunction();
            r.setName("IMLOG10");
			return r;
        },
        'IMLOG2' : function(){
            var r = new cBaseFunction();
            r.setName("IMLOG2");
			return r;
        },
        'IMPOWER' : function(){
            var r = new cBaseFunction();
            r.setName("IMPOWER");
			return r;
        },
        'IMPRODUCT' : function(){
            var r = new cBaseFunction();
            r.setName("IMPRODUCT");
			return r;
        },
        'IMREAL' : function(){
            var r = new cBaseFunction();
            r.setName("IMREAL");
			return r;
        },
        'IMSIN' : function(){
            var r = new cBaseFunction();
            r.setName("IMSIN");
			return r;
        },
        'IMSQRT' : function(){
            var r = new cBaseFunction();
            r.setName("IMSQRT");
			return r;
        },
        'IMSUB' : function(){
            var r = new cBaseFunction();
            r.setName("IMSUB");
			return r;
        },
        'IMSUM' : function(){
            var r = new cBaseFunction();
            r.setName("IMSUM");
			return r;
        },
        'OCT2BIN' : function(){
            var r = new cBaseFunction();
            r.setName("OCT2BIN");
			return r;
        },
        'OCT2DEC' : function(){
            var r = new cBaseFunction();
            r.setName("OCT2DEC");
			return r;
        },
        'OCT2HEX' : function(){
            var r = new cBaseFunction();
            r.setName("OCT2HEX");
			return r;
        }
    },
    Financial : {
        'groupName' : "Financial",
        'ACCRINT' : function(){
            var r = new cBaseFunction();
            r.setName("ACCRINT");
			return r;
        },
        'ACCRINTM' : function(){
            var r = new cBaseFunction();
            r.setName("ACCRINTM");
			return r;
        },
        'AMORDEGRC' : function(){
            var r = new cBaseFunction();
            r.setName("AMORDEGRC");
			return r;
        },
        'AMORLINC' : function(){
            var r = new cBaseFunction();
            r.setName("AMORLINC");
			return r;
        },
        'COUPDAYBS' : function(){
            var r = new cBaseFunction();
            r.setName("COUPDAYBS");
			return r;
        },
        'COUPDAYS' : function(){
            var r = new cBaseFunction();
            r.setName("COUPDAYS");
			return r;
        },
        'COUPDAYSNC' : function(){
            var r = new cBaseFunction();
            r.setName("COUPDAYSNC");
			return r;
        },
        'COUPNCD' : function(){
            var r = new cBaseFunction();
            r.setName("COUPNCD");
			return r;
        },
        'COUPNUM' : function(){
            var r = new cBaseFunction();
            r.setName("COUPNUM");
			return r;
        },
        'COUPPCD' : function(){
            var r = new cBaseFunction();
            r.setName("COUPPCD");
			return r;
        },
        'CUMIPMT' : function(){
            var r = new cBaseFunction();
            r.setName("CUMIPMT");
			return r;
        },
        'CUMPRINC' : function(){
            var r = new cBaseFunction();
            r.setName("CUMPRINC");
			return r;
        },
        'DB' : function(){
            var r = new cBaseFunction();
            r.setName("DB");
			return r;
        },
        'DDB' : function(){
            var r = new cBaseFunction();
            r.setName("DDB");
			return r;
        },
        'DISC' : function(){
            var r = new cBaseFunction();
            r.setName("DISC");
			return r;
        },
        'DOLLARDE' : function(){
            var r = new cBaseFunction();
            r.setName("DOLLARDE");
			return r;
        },
        'DOLLARFR' : function(){
            var r = new cBaseFunction();
            r.setName("DOLLARFR");
			return r;
        },
        'DURATION' : function(){
            var r = new cBaseFunction();
            r.setName("DURATION");
			return r;
        },
        'EFFECT' : function(){
            var r = new cBaseFunction();
            r.setName("EFFECT");
			return r;
        },
        'FV' : function(){
            var r = new cBaseFunction();
            r.setName("FV");
			r.setArgumentsMin(3);
            r.setArgumentsMax(5);
            r.Calculate = function(arg){
				var rate = arg[0], nper = arg[1], pmt = arg[2], pv = arg[3] ? arg[3] : new cNumber(0), type = arg[4] ? arg[4] : new cNumber(0);

				if ( rate instanceof cArea || rate instanceof cArea3D ){
					rate = rate.cross(arguments[1].first);
				}
				else if( rate instanceof cArray ){
					rate = rate.getElementRowCol(0,0);
				}

				if ( nper instanceof cArea || nper instanceof cArea3D ){
					nper = nper.cross(arguments[1].first);
				}
				else if( nper instanceof cArray ){
					nper = nper.getElementRowCol(0,0);
				}

				if ( pmt instanceof cArea || pmt instanceof cArea3D ){
					pmt = pmt.cross(arguments[1].first);
				}
				else if( pmt instanceof cArray ){
					pmt = pmt.getElementRowCol(0,0);
				}

				if ( pv instanceof cArea || pv instanceof cArea3D ){
					pv = pv.cross(arguments[1].first);
				}
				else if( pv instanceof cArray ){
					pv = pv.getElementRowCol(0,0);
				}

				if ( type instanceof cArea || type instanceof cArea3D ){
					type = type.cross(arguments[1].first);
				}
				else if( type instanceof cArray ){
					type = type.getElementRowCol(0,0);
				}

				rate = rate.tocNumber();
				nper = nper.tocNumber();
				pmt = pmt.tocNumber();
				pv = pv.tocNumber();
				type = type.tocNumber();

				if ( rate instanceof cError ) return this.value = rate;
				if ( nper instanceof cError ) return this.value = nper;
				if ( pmt instanceof cError ) return this.value = pmt;
				if ( pv instanceof cError ) return this.value = pv;
				if ( type instanceof cError ) return this.value = type;

				if ( type.getValue() != 1 && type.getValue() != 0 ) return this.value = new cError( cErrorType.not_numeric );

				var res;
				if( rate.getValue() != 0 ){
					res = -1*( pv.getValue()*Math.pow(1+rate.getValue(),nper.getValue())+pmt.getValue()*( 1 + rate.getValue()*type.getValue() )*(Math.pow((1+rate.getValue()),nper.getValue())-1)/rate.getValue() );
				}
				else{
					res = -1*( pv.getValue()+pmt.getValue()*nper.getValue() );
				}

				return this.value = new cNumber(res);
			}
			r.getInfo = function(){
                return {
                    name:this.name,
                    args:"( rate , nper , pmt [ , [ pv ] [ ,[ type ] ] ] )"
                };
            }
			r.setFormat(r.formatType.noneFormat);
			return r;
        },
        'FVSCHEDULE' : function(){
            var r = new cBaseFunction();
            r.setName("FVSCHEDULE");
			return r;
        },
        'INTRATE' : function(){
            var r = new cBaseFunction();
            r.setName("INTRATE");
			return r;
        },
        'IPMT' : function(){
            var r = new cBaseFunction();
            r.setName("IPMT");
			return r;
        },
        'IRR' : function(){
            var r = new cBaseFunction();
            r.setName("IRR");
			return r;
        },
        'ISPMT' : function(){
            var r = new cBaseFunction();
            r.setName("ISPMT");
			return r;
        },
        'MDURATION' : function(){
            var r = new cBaseFunction();
            r.setName("MDURATION");
			return r;
        },
        'MIRR' : function(){
            var r = new cBaseFunction();
            r.setName("MIRR");
			return r;
        },
        'NOMINAL' : function(){
            var r = new cBaseFunction();
            r.setName("NOMINAL");
			return r;
        },
        'NPER' : function(){
            var r = new cBaseFunction();
            r.setName("NPER");
			return r;
        },
        'NPV' : function(){
            var r = new cBaseFunction();
            r.setName("NPV");
            r.setArgumentsMin(2);
            r.setArgumentsMax(255);
            r.Calculate = function(arg){
                var arg0 = arg[0], arg1 = arg[1], iStart = 1, res = 0, rate;
				
				function elemCalc(rate,value,step){
					return value / Math.pow(1+rate,step);
				}
				
                if ( arg0 instanceof cArea || arg0 instanceof cArea3D ){
                    arg0 = arg0.cross(arguments[1].first);
                }
                else if( arg0 instanceof cArray ){
                    arg0 = arg0.getElementRowCol(0,0);
                }

                arg0 = arg0.tocNumber();

                if ( arg0 instanceof cError )
                    return this.value = arg0;

				rate = arg0.getValue();
					
				if( rate == -1)
					return this.value = new cError( cErrorType.division_by_zero );
				
					
				for(var i = 1; i < this.getArguments(); i++){
					var argI = arg[i];
					if( argI instanceof cArea || argI instanceof cArea3D ){
						var argIArr = argI.getValue();
						for (var j = 0; j < argIArr.length; j++){
							if( argIArr[j] instanceof cNumber ){
								res += elemCalc( rate, argIArr[j].getValue(), iStart++ );
							}
						}
						continue;
					}
					else if( argI instanceof cArray ){
						argI.foreach(function(elem,r,c){
							if( elem instanceof cNumber ){
								res += elemCalc( rate, elem.getValue(), iStart++ );
							}
						})
						continue;
					}

					argI = argI.tocNumber();

					if( argI instanceof cError )
						continue;
					
					res += elemCalc( rate, argI.getValue(), iStart++ );
					
				}
				
				return this.value = new cNumber(res);

            };
            r.getInfo = function(){
                return {
                    name:this.name,
                    args:"( rate , argument-list )"
                };
            };
            r.setFormat(r.formatType.noneFormat);
			return r;
        },
        'ODDFPRICE' : function(){
            var r = new cBaseFunction();
            r.setName("ODDFPRICE");
			return r;
        },
        'ODDFYIELD' : function(){
            var r = new cBaseFunction();
            r.setName("ODDFYIELD");
			return r;
        },
        'ODDLPRICE' : function(){
            var r = new cBaseFunction();
            r.setName("ODDLPRICE");
			return r;
        },
        'ODDLYIELD' : function(){
            var r = new cBaseFunction();
            r.setName("ODDLYIELD");
			return r;
        },
        'PMT' : function(){
            var r = new cBaseFunction();
            r.setName("PMT");
			return r;
        },
        'PPMT' : function(){
            var r = new cBaseFunction();
            r.setName("PPMT");
			return r;
        },
        'PRICE' : function(){
            var r = new cBaseFunction();
            r.setName("PRICE");
			return r;
        },
        'PRICEDISC' : function(){
            var r = new cBaseFunction();
            r.setName("PRICEDISC");
			return r;
        },
        'PRICEMAT' : function(){
            var r = new cBaseFunction();
            r.setName("PRICEMAT");
			return r;
        },
        'PV' : function(){
            var r = new cBaseFunction();
            r.setName("PV");
			r.setArgumentsMin(3);
            r.setArgumentsMax(5);
            r.Calculate = function(arg){
				var rate = arg[0], nper = arg[1], pmt = arg[2], fv = arg[3] ? arg[3] : new cNumber(0), type = arg[4] ? arg[4] : new cNumber(0);

				if ( rate instanceof cArea || rate instanceof cArea3D ){
					rate = rate.cross(arguments[1].first);
				}
				else if( rate instanceof cArray ){
					rate = rate.getElementRowCol(0,0);
				}

				if ( nper instanceof cArea || nper instanceof cArea3D ){
					nper = nper.cross(arguments[1].first);
				}
				else if( nper instanceof cArray ){
					nper = nper.getElementRowCol(0,0);
				}

				if ( pmt instanceof cArea || pmt instanceof cArea3D ){
					pmt = pmt.cross(arguments[1].first);
				}
				else if( pmt instanceof cArray ){
					pmt = pmt.getElementRowCol(0,0);
				}

				if ( fv instanceof cArea || fv instanceof cArea3D ){
					fv = fv.cross(arguments[1].first);
				}
				else if( fv instanceof cArray ){
					fv = fv.getElementRowCol(0,0);
				}

				if ( type instanceof cArea || type instanceof cArea3D ){
					type = type.cross(arguments[1].first);
				}
				else if( type instanceof cArray ){
					type = type.getElementRowCol(0,0);
				}

				rate = rate.tocNumber();
				nper = nper.tocNumber();
				pmt = pmt.tocNumber();
				fv = fv.tocNumber();
				type = type.tocNumber();

				if ( rate instanceof cError ) return this.value = rate;
				if ( nper instanceof cError ) return this.value = nper;
				if ( pmt instanceof cError ) return this.value = pmt;
				if ( fv instanceof cError ) return this.value = fv;
				if ( type instanceof cError ) return this.value = type;

				if ( type.getValue() != 1 && type.getValue() != 0 ) return this.value = new cError( cErrorType.not_numeric );

				var res;
				if( rate.getValue() != 0 ){
					res = -1*( fv.getValue() + pmt.getValue()*(1+rate.getValue()*type.getValue())*( (Math.pow((1+rate.getValue()),nper.getValue())-1)/rate.getValue() ) )/Math.pow(1+rate.getValue(),nper.getValue())
				}
				else{
					res = -1*( fv.getValue()+pmt.getValue()*nper.getValue() );
				}

				return this.value = new cNumber(res);
			}
			r.getInfo = function(){
                return {
                    name:this.name,
                    args:"( rate , nper , pmt [ , [ fv ] [ ,[ type ] ] ] )"
                };
            }
			r.setFormat(r.formatType.noneFormat);
			return r;
        },
        'RATE' : function(){
            var r = new cBaseFunction();
            r.setName("RATE");
			return r;
        },
        'RECEIVED' : function(){
            var r = new cBaseFunction();
            r.setName("RECEIVED");
			return r;
        },
        'SLN' : function(){
            var r = new cBaseFunction();
            r.setName("SLN");
			return r;
        },
        'SYD' : function(){
            var r = new cBaseFunction();
            r.setName("SYD");
			return r;
        },
        'TBILLEQ' : function(){
            var r = new cBaseFunction();
            r.setName("TBILLEQ");
			return r;
        },
        'TBILLPRICE' : function(){
            var r = new cBaseFunction();
            r.setName("TBILLPRICE");
			return r;
        },
        'TBILLYIELD' : function(){
            var r = new cBaseFunction();
            r.setName("TBILLYIELD");
			return r;
        },
        'VDB' : function(){
            var r = new cBaseFunction();
            r.setName("VDB");
			return r;
        },
        'XIRR' : function(){
            var r = new cBaseFunction();
            r.setName("XIRR");
			return r;
        },
        'XNPV' : function(){
            var r = new cBaseFunction();
            r.setName("XNPV");
			return r;
        },
        'YIELD' : function(){
            var r = new cBaseFunction();
            r.setName("YIELD");
			return r;
        },
        'YIELDDISC' : function(){
            var r = new cBaseFunction();
            r.setName("YIELDDISC");
			return r;
        },
        'YIELDMAT' : function(){
            var r = new cBaseFunction();
            r.setName("YIELDMAT");
			return r;
        }
    },
    Information	: {
        'groupName' : "Information",
        "CELL" :function(){
            var r = new cBaseFunction();
            r.setName("CELL");
			return r;
        },
        "ERROR.TYPE" :function(){
            var r = new cBaseFunction();
			r.setName("ERROR.TYPE");
			r.setArgumentsMin(1);
            r.setArgumentsMax(1);
            r.Calculate = function(arg){
				function typeError(elem){
					if ( !(elem instanceof cError) )
						return new cError( cErrorType.not_available );
					else {
						switch (elem.errorType){
							case cErrorType.null_value:
								return new cNumber( 1 );
							case cErrorType.division_by_zero:
								return new cNumber( 2 );
							case cErrorType.wrong_value_type:
								return new cNumber( 3 );
							case cErrorType.bad_reference:
								return new cNumber( 4 );
							case cErrorType.wrong_name:
								return new cNumber( 5 );
							case cErrorType.not_numeric:
								return new cNumber( 6 );
							case cErrorType.not_available:
								return new cNumber( 7 );
							case cErrorType.getting_data:
								return new cNumber( 8 );
							default:
								return new cError( cErrorType.not_available );
						}
					}
				}
				var arg0 = arg[0];
				if( arg0 instanceof cRef || arg0 instanceof cRef3D ){
					arg0 = arg0.getValue();
				}
				if( arg0 instanceof cArea || arg0 instanceof cArea3D ){
					arg0 = arg0.cross(arguments[1].first);
				}
				if( arg0 instanceof cArray ){
					var ret = new cArray();
					arg0.foreach(function(elem,r,c){
						if(!ret.array[r])
							ret.addRow();
						ret.addElement(found_operand)
					})
					return this.value = ret;
				}
                return this.value = typeError(arg0);
               }
            r.getInfo = function(){
                return {
                    name:this.name,
                    args:"(value)"
                };
            }
			return r;
		},
        "INFO" :function(){
            var r = new cBaseFunction();
            r.setName("INFO");
			return r;
        },
        "ISBLANK" :function(){
            var r = new cBaseFunction();
            r.setName("ISBLANK");
			r.setArgumentsMin(1);
            r.setArgumentsMax(1);
            r.Calculate = function(arg){
				var arg0 = arg[0];
				if( arg0 instanceof cArea || arg0 instanceof cArea3D ){
					arg0 = arg0.cross(arguments[1].first);
				}
                if( arg0 instanceof cRef ){
                    arg0 = arg0.getValue();
                }
                if ( arg0 instanceof cEmpty)
                    return this.value = new cBool( true );
                else
                    return this.value = new cBool( false );
            }
            r.getInfo = function(){
                return {
                    name:this.name,
                    args:"(value)"
                };
            }
			return r;
		},
        "ISERR" :function(){
            var r = new cBaseFunction();
            r.setName("ISERR");
			r.setArgumentsMin(1);
            r.setArgumentsMax(1);
            r.Calculate = function(arg){
				var arg0 = arg[0];
				if( arg0 instanceof cArray ){
					arg0 = arg0.getElement(0);
				}
				if( arg0 instanceof cArea || arg0 instanceof cArea3D ){
					arg0 = arg0.cross(arguments[1].first);
				}
                if( arg0 instanceof cRef ){
                    arg0 = arg0.getValue();
                }
                if ( arg0 instanceof cError && arg0.errorType != cErrorType.not_available )
                    return this.value = new cBool( true );
                else
                    return this.value = new cBool( false );
            }
            r.getInfo = function(){
                return {
                    name:this.name,
                    args:"(value)"
                };
            }
			return r;
		},
        "ISERROR" :function(){
            var r = new cBaseFunction();
            r.setName("ISERROR");
			r.setArgumentsMin(1);
            r.setArgumentsMax(1);
            r.Calculate = function(arg){
				var arg0 = arg[0];
				if( arg0 instanceof cArray ){
					arg0 = arg0.getElement(0);
				}
				if( arg0 instanceof cArea || arg0 instanceof cArea3D ){
					arg0 = arg0.cross(arguments[1].first);
				}
                if( arg0 instanceof cRef ){
                    arg0 = arg0.getValue();
                }
                if ( arg0 instanceof cError )
                    return this.value = new cBool( true );
                else
                    return this.value = new cBool( false );
            }
            r.getInfo = function(){
                return {
                    name:this.name,
                    args:"(value)"
                };
            }
			return r;
		},
        "ISEVEN" :function(){
            var r = new cBaseFunction();
			r.setName("ISEVEN");
            r.setArgumentsMin(1);
            r.setArgumentsMax(1);
            r.Calculate = function(arg){
				var arg0 = arg[0];
				if( arg0 instanceof cArray ){
					arg0 = arg0.getElement(0);
				}
				if( arg0 instanceof cArea || arg0 instanceof cArea3D ){
					arg0 = arg0.cross(arguments[1].first);
				}
                if ( arg0 instanceof cError )
                    return this.value = arg0;
                else if( arg0 instanceof cRef || arg0 instanceof cRef3D ){
                    arg0 = arg0.getValue();
                }
                var arg0 = arg0.tocNumber();
				if ( arg0 instanceof cError )
					return this.value = arg0;
				else
					return this.value = new cBool( (arg0.getValue() & 1) == 0 );
            }
            r.getInfo = function(){
                return {
                    name:this.name,
                    args:"(number)"
                };
            }
			return r;
		},
        "ISLOGICAL" :function(){
            var r = new cBaseFunction();
            r.setName("ISLOGICAL");
			r.setArgumentsMin(1);
            r.setArgumentsMax(1);
            r.Calculate = function(arg){
				var arg0 = arg[0];
				if( arg0 instanceof cArray ){
					arg0 = arg0.getElement(0);
				}
				if( arg0 instanceof cArea || arg0 instanceof cArea3D ){
					arg0 = arg0.cross(arguments[1].first);
				}
                if( arg0 instanceof cRef ){
                    arg0 = arg0.getValue();
                }
                if ( arg0 instanceof cBool )
                    return this.value = new cBool( true );
                else return this.value = new cBool( false );
            }
            r.getInfo = function(){
                return {
                    name:this.name,
                    args:"(value)"
                };
            }
			return r;
		},
        "ISNA" :function(){
            var r = new cBaseFunction();
            r.setName("ISNA");
			r.setArgumentsMin(1);
            r.setArgumentsMax(1);
            r.Calculate = function(arg){
				var arg0 = arg[0];
				if( arg0 instanceof cArray ){
					arg0 = arg0.getElement(0);
				}
				if( arg0 instanceof cArea || arg0 instanceof cArea3D ){
					arg0 = arg0.cross(arguments[1].first);
				}
                if( arg0 instanceof cRef ){
                    arg0 = arg0.getValue();
                }
                if ( arg0 instanceof cError && arg0.errorType == cErrorType.not_available )
                    return this.value = new cBool( true );
                else
                    return this.value = new cBool( false );
            }
            r.getInfo = function(){
                return {
                    name:this.name,
                    args:"(value)"
                };
            }
			return r;
		},
        "ISNONTEXT" :function(){
            var r = new cBaseFunction();
            r.setName("ISNONTEXT");
			r.setArgumentsMin(1);
            r.setArgumentsMax(1);
            r.Calculate = function(arg){
				var arg0 = arg[0];
				if( arg0 instanceof cArray ){
					arg0 = arg0.getElement(0);
				}
				if( arg0 instanceof cArea || arg0 instanceof cArea3D ){
					arg0 = arg0.cross(arguments[1].first);
				}
                if( arg0 instanceof cRef ){
                    arg0 = arg0.getValue();
                }
                if( !(arg0 instanceof cString) )
                    return this.value = new cBool( true );
                else
                    return this.value = new cBool( false );
            }
            r.getInfo = function(){
                return {
                    name:this.name,
                    args:"(value)"
                };
            }
			return r;
		},
        "ISNUMBER" :function(){
            var r = new cBaseFunction();
            r.setName("ISNUMBER");
			r.setArgumentsMin(1);
            r.setArgumentsMax(1);
            r.Calculate = function(arg){
				var arg0 = arg[0];
				if( arg0 instanceof cArray ){
					arg0 = arg0.getElement(0);
				}
				if( arg0 instanceof cArea || arg0 instanceof cArea3D ){
					arg0 = arg0.cross(arguments[1].first);
				}
                if( arg0 instanceof cRef ){
                    arg0 = arg0.getValue();
                }
                if( arg0 instanceof cNumber )
                    return this.value = new cBool( true );
                else
                    return this.value = new cBool( false );
            }
            r.getInfo = function(){
                return {
                    name:this.name,
                    args:"(value)"
                };
            }
			return r;
		},
        "ISODD" :function(){
            var r = new cBaseFunction();
            r.setName("ISODD");
			r.setArgumentsMin(1);
            r.setArgumentsMax(1);
            r.Calculate = function(arg){
				var arg0 = arg[0];
				if( arg0 instanceof cArray ){
					arg0 = arg0.getElement(0);
				}
                if( arg0 instanceof cArea || arg0 instanceof cArea3D ){
					arg0 = arg0.cross(arguments[1].first);
				}
				if ( arg0 instanceof cError )
                    return this.value = arg0;
                else if( arg0 instanceof cRef || arg0 instanceof cRef3D ){
                    arg0 = arg0.getValue();
                }
                var arg0 = arg0.tocNumber();
				if ( arg0 instanceof cError )
					return this.value = arg0;
				else
                    return this.value = new cBool( (arg0.getValue() & 1) == 1 );
            }
            r.getInfo = function(){
                return {
                    name:this.name,
                    args:"(number)"
                };
            }
			return r;
		},
        "ISREF" :function(){
            var r = new cBaseFunction();
            r.setName("ISREF");
			r.setArgumentsMin(1);
            r.setArgumentsMax(1);
            r.Calculate = function(arg){
                if ( (arg[0] instanceof cRef || arg[0] instanceof cArea || arg[0] instanceof cArea3D|| arg[0] instanceof cRef3D) && arg[0].isValid && arg[0].isValid() )
                    return this.value = new cBool( true );
                else return this.value = new cBool( false );
            }
            r.getInfo = function(){
                return {
                    name:this.name,
                    args:"(value)"
                };
            }
			return r;
		},
        "ISTEXT" :function(){
            var r = new cBaseFunction();
            r.setName("ISTEXT");
			r.setArgumentsMin(1);
            r.setArgumentsMax(1);
            r.Calculate = function(arg){
				var arg0 = arg[0];
				if( arg0 instanceof cArray ){
					arg0 = arg0.getElement(0);
				}
				if( arg0 instanceof cArea || arg0 instanceof cArea3D ){
					arg0 = arg0.cross(arguments[1].first);
				}
                if( arg0 instanceof cRef ){
                    arg0 = arg0.getValue();
                }
                if( arg0 instanceof cString )
                    return this.value = new cBool( true );
                else
                    return this.value = new cBool( false );
            }
            r.getInfo = function(){
                return {
                    name:this.name,
                    args:"(value)"
                };
            }
			return r;
		},
        "N" :function(){
            var r = new cBaseFunction();
            r.setName("N");
			r.setArgumentsMin(1);
            r.setArgumentsMax(1);
            r.Calculate = function(arg){
				var arg0 = arg[0];
				if( arg0 instanceof cArray ){
					var arr = new cArray();
					arg.foreach(function(elem,r,c){
						if( elem instanceof cNumber || elem instanceof cError )
							arr.array[r][c] = elem;
						else if ( elem instanceof cBool )
							arr.array[r][c] = elem.tocNumber();
						else
							arr.array[r][c] = new cNumber( 0 );
					})
					return this.value = arr;
				}
				if( arg0 instanceof cArea || arg0 instanceof cArea3D ){
					arg0 = arg0.cross(arguments[1].first);
				}
                if( arg0 instanceof cRef || arg0 instanceof cRef3D ){
                    arg0 = arg0.getValue();
                }
                if( arg0 instanceof cNumber || arg0 instanceof cError )
                    return this.value = arg0;
                else if ( arg0 instanceof cBool )
                    return this.value = arg0.tocNumber();
                else
                    return this.value = new cNumber( 0 );

            }
            r.getInfo = function(){
                return {
                    name:this.name,
                    args:"(value)"
                };
            }
			r.setFormat(r.formatType.noneFormat);
			return r;
		},
        "NA" :function(){
            var r = new cBaseFunction();
            r.setName("NA");
			r.setArgumentsMin(0);
            r.setArgumentsMax(0);
            r.Calculate = function(){
                return this.value = new cError(cErrorType.not_available);
            }
            r.getInfo = function(){
                return {
                    name:this.name,
                    args:"()"
                };
            }
			return r;
		},
        "TYPE" :function(){
            var r = new cBaseFunction();
            r.setName("TYPE");
			r.setArgumentsMin(1);
            r.setArgumentsMax(1);
            r.Calculate = function(arg){
				var arg0 = arg[0];
				if( arg0 instanceof cArea || arg0 instanceof cArea3D ){
					arg0 = arg0.cross(arguments[1].first);
				}
                if( arg0 instanceof cRef ){
                    arg0 = arg0.getValue();
                }
                if( arg0 instanceof cNumber )
                    return this.value = new cNumber ( 1 );
                else if( arg0 instanceof cString )
                    return this.value = new cNumber ( 2 )
                else if( arg0 instanceof cBool )
                    return this.value = new cNumber ( 4 )
                else if( arg0 instanceof cError )
                    return this.value = new cNumber ( 16 )
                else
                    return this.value = new cNumber( 64 );
			}
            r.getInfo = function(){
                return {
                    name:this.name,
                    args:"(value)"
                };
            }
			return r;
		}
    },
    Logical : {
        'groupName' : "Logical",
        'AND' : function(){
            var r = new cBaseFunction();
            r.setName("AND");
			r.setArgumentsMin(1);
            r.setArgumentsMax(255);
            r.Calculate = function(arg){
                var argResult = null;
                for (var i = 0; i < arg.length; i++){
                    if ( arg[i] instanceof cArea || arg[i] instanceof cArea3D ){
                        var argArr = arg[i].getValue();
                        for( var j=0; j < argArr.length; j++ ){
                            if (argArr[j] instanceof cString || argArr[j] instanceof cEmpty) continue;
                            else if ( argArr[j] instanceof cError ) return this.value = argArr[j];
                            else {
                                if ( argResult == null )
                                    argResult = argArr[j].tocBool();
                                else
                                    argResult = new cBool ( argResult.value && argArr[j].tocBool().value );
                                if ( argResult.value == false ) return this.value = new cBool( false );
                            }
                        }
                    }
                    else{
                        if (arg[i] instanceof cString) return this.value = new cError( cErrorType.wrong_value_type );
                        else if ( arg[i] instanceof cError ) { return this.value = arg[i]; }
						else if( arg[i] instanceof cArray ){
							var thas = this;
							arg[i].foreach(function(elem){
								if ( elem instanceof cError ) {
									argResult = elem;
									return true;
								}
								else if (elem instanceof cString || elem instanceof cEmpty) { return; }
								else{
									if ( argResult == null )
										argResult = elem.tocBool();
									else
										argResult = new cBool ( argResult.value && elem.tocBool().value );
									if ( argResult.value == false ){
										return true;
									}
								}
							})
						}
                        else {
                            if ( argResult == null )
                                argResult = arg[i].tocBool();
                            else
                                argResult = new cBool ( argResult.value && arg[i].tocBool().value );
                            if ( argResult.value == false ) return this.value = new cBool( false );
                        }
                    }
                }
                if ( argResult == null )
                    return this.value = new cError( cErrorType.wrong_value_type );
                return this.value = argResult;
            }
            r.getInfo = function(){
                return {
                    name:this.name,
                    args:"(logical1, logical2, ...)"
                };
            }
			return r;
		},
        'FALSE' : function(){
            var r = new cBaseFunction();
            r.setName("FALSE");
			r.setArgumentsMin(0);
            r.setArgumentsMax(0);
			r.Calculate = function(){
                return this.value = new cBool(false);
            }
            r.getInfo = function(){
                return {
                    name:this.name,
                    args:"()"
                };
            }
			return r;
		},
        'IF' : function(){
            var r = new cBaseFunction();
            r.setName("IF");
			r.setArgumentsMin(1);
            r.setArgumentsMax(3);
            r.Calculate = function(arg){
                var arg0 = arg[0], arg1 = arg[1], arg2 = arg[2];

				if( arg0 instanceof cArray )
					arg0 = arg0.getElement(0);
				if( arg1 instanceof cArray )
					arg1 = arg1.getElement(0);
				if( arg2 instanceof cArray )
					arg2 = arg2.getElement(0);

                if ( arg0 instanceof cError )
                    return this.value = arg0;
                else{
                    arg0 = arg0.tocBool();
                    if( arg0 instanceof cString )
                        return this.value = new cError( cErrorType.wrong_value_type );
                    else if ( arg0.value )
                        return this.value = arg1 ?
                        arg1 instanceof cEmpty ?
							new cNumber(0) :
							arg1 :
                        new cBool(true) ;

                    else return this.value = arg2 ?
                        arg2 instanceof cEmpty ?
							new cNumber(0) :
							arg2 :
                        new cBool(false) ;
                }
            }
            r.getInfo = function(){
                return {
                    name:this.name,
                    args:"(logical_test, value_if_true, value_if_false)"
                };
            }
        	return r;
		},
        'IFERROR' : function(){
            var r = new cBaseFunction();
            r.setName("IFERROR");
			r.setArgumentsMin(2);
            r.setArgumentsMax(2);
            r.Calculate = function(arg){
				var arg0 = arg[0];
				if( arg0 instanceof cArray ){
					arg0 = arg0.getElement(0);
				}
				if( arg0 instanceof cRef || arg0 instanceof cRef3D ){
					arg0 = arg0.getValue();
				}
				if( arg0 instanceof cArea || arg0 instanceof cArea3D ){
					arg0 = arg0.cross(arguments[1].first);
				}

                if (arg0 instanceof cError)
                    return this.value = arg[1] instanceof cArray ? arg[1].getElement(0) : arg[1];
                else return this.value = arg[0];
            }
            r.getInfo = function(){
                return {
                    name:this.name,
                    args:"(value, value_if_error)"
                };
            }
			return r;
		},
        'NOT' : function(){
            var r = new cBaseFunction();
            r.setName("NOT");
			r.setArgumentsMin(1);
            r.setArgumentsMax(1);
            r.Calculate = function(arg){
				var arg0 = arg[0];
				if( arg0 instanceof cArray )
                    arg0 = arg0.getElement(0);

				if( arg0 instanceof cArea || arg0 instanceof cArea3D ){
					arg0 = arg0.cross(arguments[1].first);
				}

                if ( arg0 instanceof cString ){
					var res = arg0.tocBool();
					if( res instanceof cString )
						return  this.value = new cError( cErrorType.wrong_value_type );
					else
						return this.value = new cBool( ! res.value );
				}
                else if( arg0 instanceof cError )
                    return  this.value = arg0;
                else
                    return this.value = new cBool( ! arg0.tocBool().value );
            }
            r.getInfo = function(){
                return {
                    name:this.name,
                    args:"(logical)"
                };
            }
			return r;
		},
        'OR' : function(){
            var r = new cBaseFunction();
            r.setName("OR");
			r.setArgumentsMin(1);
            r.setArgumentsMax(255);
            r.Calculate = function(arg){
                var argResult = null;
                for (var i = 0; i < arg.length; i++){
                    if ( arg[i] instanceof cArea || arg[i] instanceof cArea3D ){
                        var argArr = arg[i].getValue();
                        for( var j=0; j < argArr.length; j++ ){
                            if (argArr[j] instanceof cString || argArr[j] instanceof cEmpty) continue;
                            else if ( argArr[j] instanceof cError ) return this.value = argArr[j];
                            else {
                                if ( argResult == null )
                                    argResult = argArr[j].tocBool();
                                else
                                    argResult = new cBool ( argResult.value || argArr[j].tocBool().value );
                                if ( argResult.value === true ) return this.value = new cBool( true );
                            }
                        }
                    }
                    else{
                        if (arg[i] instanceof cString) return this.value = new cError( cErrorType.wrong_value_type );
                        else if ( arg[i] instanceof cError ) return this.value = arg[i];
						else if( arg[i] instanceof cArray ){
							var thas = this;
							arg[i].foreach(function(elem){
								if ( elem instanceof cError ) {
									argResult = elem;
									return true;
								}
								else if (elem instanceof cString || elem instanceof cEmpty) { return; }
								else{
									if ( argResult == null )
										argResult = elem.tocBool();
									else
										argResult = new cBool ( argResult.value || elem.tocBool().value );
								}
							})
						}
                        else {
                            if ( argResult == null )
                                argResult = arg[i].tocBool();
                            else
                                argResult = new cBool ( argResult.value || arg[i].tocBool().value );
                            if ( argResult.value === true ) return this.value =  new cBool( true );
                        }
                    }
                }
                if ( argResult == null )
                    return this.value = new cError( cErrorType.wrong_value_type );
                return this.value = argResult;
            }
            r.getInfo = function(){
                return {
                    name:this.name,
                    args:"(logical1, logical2, ...)"
                };
            }
			return r;
		},
        'TRUE' : function(){
            var r = new cBaseFunction();
			r.setName("TRUE");
			r.setArgumentsMin(0);
            r.setArgumentsMax(0);
            r.Calculate = function(){
                return this.value = new cBool(true);
            }
            r.getInfo = function(){
                return {
                    name:this.name,
                    args:"()"
                };
            }
			return r;
		}
    },
    LookupAndReference : {
        'groupName' : "LookupAndReference",
        'ADDRESS' : function(){
            var r = new cBaseFunction();
            r.setName("ADDRESS");
			return r;
		},
        'AREAS' : function(){
            var r = new cBaseFunction();
            r.setName("AREAS");
			return r;
		},
        'CHOOSE' : function(){
            var r = new cBaseFunction();
			r.setName("CHOOSE");
			r.setArgumentsMin(2);
            r.setArgumentsMax(30);
			r.Calculate = function(arg){
				var arg0 = arg[0];

				if( arg0 instanceof cArea || arg0 instanceof cArea3D ){
					arg0 = arg0.cross(arguments[1].first);
				}
				arg0 = arg0.tocNumber();

				if( arg0 instanceof cError ){
					return this.value = arg0;
				}

				if( arg0 instanceof cNumber ){
					if( arg0.getValue() < 1 || arg0.getValue() > this.getArguments() ){
						return this.value = new cError( cErrorType.wrong_value_type );
					}

					return this.value = arg[arg0.getValue()];
				}

				return this.value = new cError( cErrorType.wrong_value_type );
			}
			r.getInfo = function(){
                return {
                    name:this.name,
                    args:"( index , argument-list )"
                };
            }
			return r;
		},
        'COLUMN' : function(){
            var r = new cBaseFunction();
            r.setName("COLUMN");
			r.setArgumentsMin(0);
            r.setArgumentsMax(1);
			r.Calculate = function(arg){
				var arg0;
				if( this.argumentsCurrent == 0 ){
					arg0 = arguments[1];
					return this.value = new cNumber( arg0.getFirst().getCol() );
				}
				arg0 = arg[0];
				if( arg0 instanceof cRef || arg0 instanceof cRef3D || arg0 instanceof cArea ){
					var range = arg0.getRange();
					if( range )
						return this.value = new cNumber( range.getFirst().getCol() );
					else
						return this.value = new cError( cErrorType.bad_reference );
				}
				else if( arg0 instanceof cArea3D ){
					var r = arg0.getRange();
					if( r && r[0] && r[0].getFirst() ){
						return this.value = new cNumber( r[0].getFirst().getCol() );
					}
					else{
						return this.value = new cError( cErrorType.bad_reference );
					}
				}
				else
					return this.value = new cError( cErrorType.bad_reference );
			}
			r.getInfo = function(){
				return {
                    name:this.name,
                    args:"( [ reference ] )"
                };
			}
        	return r;
		},
        'COLUMNS' : function(){
            var r = new cBaseFunction();
            r.setName("COLUMNS");
        	return r;
		},
        'GETPIVOTDATA' : function(){
            var r = new cBaseFunction();
            r.setName("GETPIVOTDATA");
        	return r;
		},
        'HLOOKUP' : function(){
            var r = new cBaseFunction();
            r.setName("HLOOKUP");
			r.setArgumentsMin(3);
            r.setArgumentsMax(4);
			r.Calculate = function(arg){
				var arg0 = arg[0], arg1 = arg[1], arg2 = arg[2], arg3 = this.argumentsCurrent == 4 ? arg[3].tocBool() : new cBool( true );
				var numberRow = arg2.getValue()-1, valueForSearching = arg0.getValue(), resC = -1, min, regexp;

				if( isNaN( numberRow ) )
					return this.value = new cError( cErrorType.bad_reference );

				if( numberRow < 0 )
					return this.value = new cError( cErrorType.wrong_value_type );

				if( arg0 instanceof cString ){
					valueForSearching = arg0.getValue();
					valueForSearching = valueForSearching
											.replace(/(~)?\*/g, function($0, $1){
												return $1 ? $0 : '[\\w\\W]*';
											})
											.replace(/(~)?\?/g, function($0, $1){
												return $1 ? $0 : '[\\w\\W]{1,1}';
											})
											.replace(/\~/g, "\\");
					regexp = new XRegExp(valueForSearching+"$","i");
				}
				else if( arg0 instanceof cError )
					return this.value = arg0;
				else{
					valueForSearching = arg0.getValue();
				}

				var found = false, bb,
					f = function(cell, r, c, r1, c1){
						if( r == r1 ){
							var cv = cell.getValueWithoutFormat();
							if( c == c1 )
								min = cv;
							if( arg3.value == true ){
								if( valueForSearching == cv ){
									resC = c;
									found = true;
								}
								else if( valueForSearching > cv && !found ){
									resC = c;
								}
							}
							else{
								if( arg0 instanceof cString	){
									if( regexp.test(cv) )
										resC = c;
								}
								else if( valueForSearching == cv ){
									resC = c;
								}
							}
							if( resC > -1 ){
								min = Math.min( min , cv );
								if( arg3.value == false )
									return true;
							}
						}
					};

				if( arg1 instanceof cRef || arg1 instanceof cRef3D || arg1 instanceof cArea ){
					var range = arg1.getRange();
					bb = range.getBBox0();
					if( numberRow > bb.r2-bb.r1 )
						return this.value = new cError( cErrorType.bad_reference );

					range._foreachColNoEmpty(/*func for col*/ null, /*func for cell in col*/ f);
				}
				else if( arg1 instanceof cArea3D ){
					var range = arg1.getRange()[0];
					bb = range.getBBox0();
					if( numberRow > bb.r2-bb.r1 )
						return this.value = new cError( cErrorType.bad_reference );

					range._foreachColNoEmpty(/*func for col*/ null, /*func for cell in col*/ f);
				}
				else if( arg1 instanceof cArray ){
					arg1.foreach(function(elem,r,c){
						if( c == 0 )
							min = elem.getValue();

						if( arg3.value == true ){
							if( valueForSearching == elem.getValue() ){
								resC = c;
								found = true;
							}
							else if( valueForSearching > elem.getValue() && !found ){
								resC = c;
							}
						}
						else{
							if( arg0 instanceof cString	){
								if( regexp.test(elem.getValue()) )
									resC = c;
							}
							else if( valueForSearching == elem.getValue() ){
								resC = c;
							}
						}

						min = Math.min( min , elem.getValue() );
					})

					if ( min > valueForSearching ){
						return this.value = new cError( cErrorType.not_available );
					}

					if( resC == -1 ){
						return this.value = new cError( cErrorType.not_available );
					}

					if( numberRow > arg1.getRowCount()-1 ){
						return this.value = new cError( cErrorType.bad_reference );
					}

					return this.value = arg1.getElementRowCol(numberRow,resC);

				}


				if ( min > valueForSearching ){
					return this.value = new cError( cErrorType.not_available );
				}

				if( resC == -1 ){
					return this.value = new cError( cErrorType.not_available );
				}

				var c = new CellAddress(bb.r1+numberRow,resC,0);

				var v = arg1.getWS()._getCellNoEmpty(c.getRow0(),c.getCol0()).getValueWithoutFormat();

				return this.value = checkTypeCell(v);
			}
			r.getInfo = function(){
                return {
                    name:this.name,
                    args:"( lookup-value  ,  table-array  ,  row-index-num  [  ,  [  range-lookup-flag  ] ] )"
                };
            }
        	return r;
		},
        'HYPERLINK' : function(){
            var r = new cBaseFunction();
            r.setName("HYPERLINK");
        	return r;
		},
        'INDEX' : function(){
            var r = new cBaseFunction();
            r.setName("INDEX");
        	return r;
		},
        'INDIRECT' : function(){
            var r = new cBaseFunction();
            r.setName("INDIRECT");
			r.setArgumentsMin(0);
            r.setArgumentsMax(1);
			r.Calculate = function(arg){
				var arg0 = arg[0].tocString(), r = arguments[1], wb = r.worksheet.workbook, o = { Formula:"", pCurrPos : 0 }, ref, found_operand;

				function parseReference() {
					if( (ref = parserHelp.is3DRef.call(o,o.Formula,o.pCurrPos))[0] ){
						var _wsFrom = ref[1],
							_wsTo = ( (ref[2] !== null) && (ref[2] !== undefined) )? ref[2] : _wsFrom;
						if( !(wb.getWorksheetByName( _wsFrom ) && wb.getWorksheetByName( _wsTo )) ){
							return this.value = new cError( cErrorType.bad_reference );
						}
						if ( parserHelp.isArea.call(o,o.Formula,o.pCurrPos) ){
							found_operand = new cArea3D(o.operand_str.toUpperCase(), _wsFrom, _wsTo, wb);
							if(o.operand_str.indexOf("$") > -1)
								found_operand.isAbsolute = true;
						}
						else if ( parserHelp.isRef.call(o,o.Formula,o.pCurrPos) ){
							if( _wsTo != _wsFrom ){
								found_operand = new cArea3D(o.operand_str.toUpperCase(), _wsFrom, _wsTo, wb);
							}
							else{
								found_operand = new cRef3D(o.operand_str.toUpperCase(), _wsFrom, wb);
							}
							if(o.operand_str.indexOf("$") > -1)
								found_operand.isAbsolute = true;
						}
					}
					else if ( parserHelp.isName.call(o,o.Formula,o.pCurrPos, wb)[0] ){
						found_operand = new cName(o.operand_str, wb);
					}
					else if ( parserHelp.isArea.call(o,o.Formula,o.pCurrPos) ){
						found_operand = new cArea(o.operand_str.toUpperCase(), r.worksheet);
						if(o.operand_str.indexOf("$") > -1)
							found_operand.isAbsolute = true;
					}
					else if ( parserHelp.isRef.call(o,o.Formula,o.pCurrPos,true) ){
						found_operand = new cRef(o.operand_str.toUpperCase(), r.worksheet);
						if(o.operand_str.indexOf("$") > -1)
							found_operand.isAbsolute = true;
					}
				}

				if( arg0 instanceof cArray ){
					var ret = new cArray();
					arg0.foreach(function(elem,r,c){
						o = { Formula:elem.toString(), pCurrPos : 0 };
						parseReference();
						if(!ret.array[r])
							ret.addRow();
						ret.addElement(found_operand)
					})
					return this.value = ret;
				}
				else {
					o.Formula = arg0.toString();
					parseReference();
				}

				if( found_operand )
					return this.value = found_operand;

				return this.value = new cError( cErrorType.bad_reference );

			}
			r.getInfo = function(){
				return {
                    name:this.name,
                    args:"( ref-text [ , [ A1-ref-style-flag ] ] )"
                };
			}
        	return r;
		},
        'LOOKUP' : function(){
            var r = new cBaseFunction();
            r.setName("LOOKUP");
			r.setArgumentsMin(2);
            r.setArgumentsMax(3);
			r.Calculate = function(arg){
				var arg0 = arg[0], arg1 = arg[1], arg2 = this.argumentsCurrent == 2 ? arg1 : arg[2],
					valueForSearching, resC = -1, resR = -1;

				if( arg0 instanceof cError ){
					return this.value = arg0;
				}
				if( arg0 instanceof cRef ){
					arg0 = arg0.tryConvert();
				}

				function arrFinder(arr){
					if( arr.getRowCount() > arr.getCountElementInRow() ){
						//ищем в первом столбце
						resC = arr.getCountElementInRow()>1?1:0;
						var arrCol = arr.getCol(0);
						resR = _func.binarySearch( arg0, arrCol);
					}
					else{
						//ищем в первой строке
						resR = arr.getRowCount()>1?1:0;
						var arrRow = arr.getRow(0);
						resC = _func.binarySearch( arg0, arrRow);
					}
				}

				if( !( arg1 instanceof cArea || arg1 instanceof cArea3D || arg1 instanceof cArray || arg2 instanceof cArea || arg2 instanceof cArea3D || arg2 instanceof cArray) ){
					return this.value = new cError( cErrorType.not_available );
				}

				if( arg1 instanceof cArray && arg2 instanceof cArray ){
					if( arg1.getRowCount() != arg2.getRowCount() && arg1.getCountElementInRow() != arg2.getCountElementInRow() ){
						return this.value = new cError( cErrorType.not_available );
					}

					arrFinder(arg1);

					if( resR <= -1 &&  resC <= -1 || resR <= -2 || resC <= -2 ){
						return this.value = new cError( cErrorType.not_available );
					}

					return this.value = arg2.getElementRowCol(resR,resC);

				}
				else if( arg1 instanceof cArray || arg2 instanceof cArray ){

					var _arg1, _arg2;

					_arg1 = arg1 instanceof cArray ? arg1 : arg2;

					_arg2 = arg2 instanceof cArray ? arg1 : arg2;

					var BBox = _arg2.getBBox();

					if( _arg1.getRowCount() != (BBox.r2-BBox.r1) && _arg1.getCountElementInRow() != (BBox.c2-BBox.c1) ){
						return this.value = new cError( cErrorType.not_available );
					}

					arrFinder(_arg1);

					if( resR <= -1 &&  resC <= -1 || resR <= -2 || resC <= -2 ){
						return this.value = new cError( cErrorType.not_available );
					}

					var c = new CellAddress(BBox.r1+resR,BBox.c1+resC)

					return this.value = checkTypeCell( _arg2.getWS()._getCellNoEmpty(c.getRow0(),c.getCol0()).getValueWithoutFormat() );

				}
				else{
					var arg1Range = arg1.getRange(), arg2Range = arg2.getRange();

					if( arg1 instanceof cArea3D && arg1Range.length > 1 || arg2 instanceof cArea3D && arg2Range.length > 1 )
						return this.value = new cError( cErrorType.not_available );

					if( arg1 instanceof cArea3D )
						arg1Range = arg1Range[0];

					if( arg2 instanceof cArea3D )
						arg2Range = arg2Range[0];

					var oBBox1 = arg1Range.getBBox0(), oBBox2 = arg2Range.getBBox0();

					if( !(oBBox1.r1 == oBBox1.r2 || oBBox1.c1 == oBBox1.c2) && !(oBBox2.r1 == oBBox2.r2 || oBBox2.c1 == oBBox2.c2) ){
						return this.value = new cError( cErrorType.not_available );
					}

					var index;

					if( (oBBox1.r1 == oBBox1.r2 && ( (oBBox2.r1 == oBBox2.r2 && oBBox1.r1 - oBBox1.r2 == oBBox2.r1 - oBBox2.r2) || (oBBox2.c1 == oBBox2.c2 && oBBox1.r1 - oBBox1.r2 == oBBox2.c1 - oBBox2.c2)))
						||
						(oBBox1.c1 == oBBox1.c2 && ( (oBBox2.r1 == oBBox2.r2 && oBBox1.c1 - oBBox1.c2 == oBBox2.r1 - oBBox2.r2) || (oBBox2.c1 == oBBox2.c2 && oBBox1.c1 - oBBox1.c2 == oBBox2.c1 - oBBox2.c2)))
					){
						index = _func.binarySearch( arg0, arg1.getValue() )
						if( index < 0 ) return this.value = new cError( cErrorType.not_available );
					}
					else{
						return this.value = new cError( cErrorType.not_available );
					}

					return this.value = arg2.getValue()[index];
				}

			}
			r.getInfo = function(){
                return {
                    name:this.name,
                    args:"(  lookup-value  ,  lookup-vector  ,  result-vector  )"
                };
            }
        	return r;
		},
        'MATCH' : function(){
            var r = new cBaseFunction();
            r.setName("MATCH");
        	return r;
		},
        'OFFSET' : function(){
            var r = new cBaseFunction();
            r.setName("OFFSET");
        	return r;
		},
        'ROW' : function(){
            var r = new cBaseFunction();
            r.setName("ROW");
			r.setArgumentsMin(0);
            r.setArgumentsMax(1);
			r.Calculate = function(arg){
				var arg0;
				if( this.argumentsCurrent == 0 ){
					arg0 = arguments[1];
					return this.value = new cNumber( arg0.getFirst().getRow() );
				}
				arg0 = arg[0];
				if( arg0 instanceof cRef || arg0 instanceof cRef3D || arg0 instanceof cArea ){
					var range = arg0.getRange();
					if( range )
						return this.value = new cNumber( range.getFirst().getRow() );
					else
						return this.value = new cError( cErrorType.bad_reference );
				}
				else if( arg0 instanceof cArea3D ){
					var r = arg0.getRange();
					if( r && r[0] && r[0].getFirst() ){
						return this.value = new cNumber( r[0].getFirst().getRow() );
					}
					else{
						return this.value = new cError( cErrorType.bad_reference );
					}
				}
				else
					return this.value = new cError( cErrorType.bad_reference );
			}
			r.getInfo = function(){
				return {
                    name:this.name,
                    args:"( [ reference ] )"
                };
			}
        	return r;
		},
        'ROWS' : function(){
            var r = new cBaseFunction();
            r.setName("ROWS");
        	return r;
		},
        'RTD' : function(){
            var r = new cBaseFunction();
            r.setName("RTD");
        	return r;
		},
        'TRANSPOSE' : function(){
            var r = new cBaseFunction();
            r.setName("TRANSPOSE");
        	return r;
		},
        'VLOOKUP' : function(){
            var r = new cBaseFunction();
			r.setName("VLOOKUP");
			r.setArgumentsMin(3);
            r.setArgumentsMax(4);
			r.Calculate = function(arg){
				var arg0 = arg[0], arg1 = arg[1], arg2 = arg[2], arg3 = this.argumentsCurrent == 4 ? arg[3].tocBool() : new cBool( true );
				var numberCol = arg2.getValue()-1, valueForSearching, resR = -1, min, regexp;

				if( isNaN( numberCol ) )
					return this.value = new cError( cErrorType.bad_reference );

				if( numberCol < 0 )
					return this.value = new cError( cErrorType.wrong_value_type );

				if( arg0 instanceof cString ){
					valueForSearching = arg0.getValue();
					valueForSearching = valueForSearching
											.replace(/(~)?\*/g, function($0, $1){
												return $1 ? $0 : '[\\w\\W]*';
											})
											.replace(/(~)?\?/g, function($0, $1){
												return $1 ? $0 : '[\\w\\W]{1,1}';
											})
											.replace(/\~/g, "\\");
					regexp = new XRegExp(valueForSearching+"$","i");
				}
				else if( arg0 instanceof cError )
					return this.value = arg0;
				else{
					valueForSearching = arg0.getValue();
				}


				var found = false, bb,
					f = function(cell, r, c, r1, c1){
						if( c == c1 ){
							var cv = cell.getValueWithoutFormat();
							if( r == r1 )
								min = cv;
							if( arg3.value == true ){
								if( valueForSearching == cv ){
									resR = r;
									found = true;
								}
								else if( valueForSearching > cv && !found ){
									resR = r;
								}
							}
							else{
								if( arg0 instanceof cString	){
									if( regexp.test(cv) )
										resR = r;
								}
								else if( valueForSearching == cv ){
									resR = r;
								}
							}
							if( resR > -1 ){
								min = Math.min( min , cv );
								if( arg3.value == false )
									return true;
							}
						}
					};

				if( arg1 instanceof cRef || arg1 instanceof cRef3D || arg1 instanceof cArea ){
					var range = arg1.getRange();
					bb = range.getBBox0();
					if( numberCol > bb.c2-bb.c1 )
						return this.value = new cError( cErrorType.bad_reference );

					range._foreachRowNoEmpty(/*func for col*/ null, /*func for cell in col*/ f);
				}
				else if( arg1 instanceof cArea3D ){
					var range = arg1.getRange()[0];
					bb = range.getBBox0();
					if( numberCol > bb.c2-bb.c1 )
						return this.value = new cError( cErrorType.bad_reference );

					range._foreachRowNoEmpty(/*func for col*/ null, /*func for cell in col*/ f);
				}
				else if( arg1 instanceof cArray ){
					arg1.foreach(function(elem,r,c){
						if( r == 0 )
							min = elem.getValue();

						if( arg3.value == true ){
							if( valueForSearching == elem.getValue() ){
								resR = r;
								found = true;
							}
							else if( valueForSearching > elem.getValue() && !found ){
								resR = r;
							}
						}
						else{
							if( arg0 instanceof cString	){
								if( regexp.test(elem.getValue()) )
									resR = r;
							}
							else if( valueForSearching == elem.getValue() ){
								resR = r;
							}
						}

						min = Math.min( min , elem.getValue() );
					})

					if ( min > valueForSearching ){
						return this.value = new cError( cErrorType.not_available );
					}

					if( resR == -1 ){
						return this.value = new cError( cErrorType.not_available );
					}

					if( numberCol > arg1.getCountElementInRow()-1 ){
						return this.value = new cError( cErrorType.bad_reference );
					}

					return this.value = arg1.getElementRowCol(resR,numberCol);

				}

				if ( min > valueForSearching ){
					return this.value = new cError( cErrorType.not_available );
				}

				if( resR == -1 ){
					return this.value = new cError( cErrorType.not_available );
				}

				var c = new CellAddress(resR,bb.c1+numberCol,0);

				var v = arg1.getWS()._getCellNoEmpty(c.getRow0(),c.getCol0()).getValueWithoutFormat();

				return this.value = checkTypeCell(v);
			}
			r.getInfo = function(){
                return {
                    name:this.name,
                    args:"( lookup-value  ,  table-array  ,  col-index-num  [  ,  [  range-lookup-flag  ] ] )"
                };
            }
        	return r;
		}
    },
    Mathematic : {
        'groupName' : "Mathematic",
        'ABS' : function(){
			var r = new cBaseFunction();
            r.setName("ABS");
			r.setArgumentsMin(1);
            r.setArgumentsMax(1);
            r.Calculate = function(arg){
				var arg0 = arg[0];
				if( arg0 instanceof cArea || arg0 instanceof cArea3D ){
					arg0 = arg0.cross(arguments[1].first);
				}
                arg0 = arg0.tocNumber();
				if( arg0 instanceof cError )
					return this.value = arg0;
				else if( arg0 instanceof cArray ){
					arg0.foreach(function(elem,r,c){
						if( elem instanceof cNumber ){
							this.array[r][c] = new cNumber( Math.abs( elem.getValue() ) );
						}
						else{
							this.array[r][c] = new cError( cErrorType.wrong_value_type );
						}
					})
				}
				else {
					return this.value = new cNumber( Math.abs( arg0.getValue() ) );
				}
                return this.value = arg0;
            };
            r.getInfo = function(){
                return {
                    name:this.name,
                    args:"(number)"
                };
            }
			return r;
		},
        'ACOS' :  function(){
            var r = new cBaseFunction();
            r.setName("ACOS");
			r.setArgumentsMin(1);
            r.setArgumentsMax(1);
            r.Calculate = function(arg){
				var arg0 = arg[0];
				if( arg0 instanceof cArea || arg0 instanceof cArea3D ){
					arg0 = arg0.cross(arguments[1].first);
				}
                arg0 = arg0.tocNumber();
				if( arg0 instanceof cError )
					return this.value = arg0;
				else if( arg0 instanceof cArray ){
					arg0.foreach(function(elem,r,c){
						if( elem instanceof cNumber ){
							var a = Math.acos( elem.getValue() );
							this.array[r][c] = isNaN( a ) ? new cError( cErrorType.not_numeric ) : new cNumber( a );
						}
						else{
							this.array[r][c] = new cError( cErrorType.wrong_value_type );
						}
					})
				}
				else {
					var a = Math.acos( arg0.getValue() );
					return this.value = isNaN( a ) ? new cError( cErrorType.not_numeric ) : new cNumber( a );
				}
                return this.value = arg0;
            };
            r.getInfo = function(){
                return {
                    name:this.name,
                    args:"(number)"
                };
            }
			return r;
		},
        'ACOSH' :	function(){
            var r = new cBaseFunction();
            r.setName("ACOSH");
        	return r;
		},
        'ASIN' :  function(){
            var r = new cBaseFunction();
            r.setName("ASIN");
			r.setArgumentsMin(1);
            r.setArgumentsMax(1);
            r.Calculate = function(arg){
				var arg0 = arg[0];
				if( arg0 instanceof cArea || arg0 instanceof cArea3D ){
					arg0 = arg0.cross(arguments[1].first);
				}
                arg0 = arg0.tocNumber();
                if( arg0 instanceof cError )
					return this.value = arg0;
				else if( arg0 instanceof cArray ){
					arg0.foreach(function(elem,r,c){
						if( elem instanceof cNumber ){
							var a = Math.asin( elem.getValue() );
							this.array[r][c] = isNaN( a ) ? new cError( cErrorType.not_numeric ) : new cNumber( a );
						}
						else{
							this.array[r][c] = new cError( cErrorType.wrong_value_type );
						}
					})
				}
				else {
					var a = Math.asin( arg0.getValue() );
					return this.value = isNaN( a ) ? new cError( cErrorType.not_numeric ) : new cNumber( a );
				}
                return this.value = arg0;
            };
            r.getInfo = function(){
                return {
                    name:this.name,
                    args:"(number)"
                };
            }
        	return r;
		},
        'ASINH' : function(){
            var r = new cBaseFunction();
            r.setName("ASINH");
        	return r;
		},
        'ATAN' : function(){
            var r = new cBaseFunction();
            r.setName("ATAN");
			r.setArgumentsMin(1);
            r.setArgumentsMax(1);
            r.Calculate = function(arg){
				var arg0 = arg[0];
				if( arg0 instanceof cArea || arg0 instanceof cArea3D ){
					arg0 = arg0.cross(arguments[1].first);
				}
                arg0 = arg0.tocNumber();
                if( arg0 instanceof cError )
					return this.value = arg0;
				else if( arg0 instanceof cArray ){
					arg0.foreach(function(elem,r,c){
						if( elem instanceof cNumber ){
							var a = Math.atan( elem.getValue() );
							this.array[r][c] = isNaN( a ) ? new cError( cErrorType.not_numeric ) : new cNumber( a );
						}
						else{
							this.array[r][c] = new cError( cErrorType.wrong_value_type );
						}
					})
					return this.value = arg0;
				}
				else {
					var a = Math.atan( arg0.getValue() );
					return this.value = isNaN( a ) ? new cError( cErrorType.not_numeric ) : new cNumber( a );
				}
                return this.value = arg0;
            };
            r.getInfo = function(){
                return {
                    name:this.name,
                    args:"(number)"
                };
            }
        	return r;
		},
        'ATAN2' : function(){
            var r = new cBaseFunction();
            r.setArgumentsMin(2);
            r.setArgumentsMax(2);
            r.setName("ATAN2");
            r.Calculate = function(arg){
				var arg0 = arg[0],arg1 = arg[1];
				if( arg0 instanceof cArea || arg0 instanceof cArea3D ){
					arg0 = arg0.cross(arguments[1].first);
				}
				if( arg1 instanceof cArea || arg1 instanceof cArea3D ){
					arg1 = arg1.cross(arguments[1].first);
				}
                arg0 = arg0.tocNumber(); arg1 = arg1.tocNumber();
				if( arg0 instanceof cArray && arg1 instanceof cArray ){
					if( arg0.getCountElement() != arg1.getCountElement() || arg0.getRowCount() != arg1.getRowCount() ){
						return this.value = new cError( cErrorType.not_available );
					}
					else{
						arg0.foreach(function(elem,r,c){
							var a = elem,
								b = arg1.getElementRowCol(r,c);
							if( a instanceof cNumber && b instanceof cNumber ){
								this.array[r][c] =
												a.getValue() == 0 && b.getValue() == 0  ?
													new cError( cErrorType.division_by_zero ) :
													new cNumber( Math.atan2( b.getValue(), a.getValue() ) )
							}
							else
								this.array[r][c] = new cError( cErrorType.wrong_value_type );
						})
						return this.value = arg0;
					}
				}
				else if( arg0 instanceof cArray ){
					arg0.foreach(function(elem,r,c){
						var a = elem,
							b = arg1;
						if( a instanceof cNumber && b instanceof cNumber ){
							this.array[r][c] =
											a.getValue() == 0 && b.getValue() == 0  ?
												new cError( cErrorType.division_by_zero ) :
												new cNumber( Math.atan2( b.getValue(), a.getValue() ) )
						}
						else
							this.array[r][c] = new cError( cErrorType.wrong_value_type );
					})
					return this.value = arg0;
				}
				else if( arg1 instanceof cArray ){
					arg1.foreach(function(elem,r,c){
						var a = arg0,
							b = elem;
						if( a instanceof cNumber && b instanceof cNumber ){
							this.array[r][c] =
											a.getValue() == 0 && b.getValue() == 0  ?
												new cError( cErrorType.division_by_zero ) :
												new cNumber( Math.atan2( b.getValue(), a.getValue() ) )
						}
						else
							this.array[r][c] = new cError( cErrorType.wrong_value_type );
					})
					return this.value = arg1;
				}

                return this.value = (	arg0 instanceof cError ? arg0 :
                    arg1 instanceof cError ? arg1 :
                    arg1.getValue() == 0 && arg0.getValue() == 0  ? new cError( cErrorType.division_by_zero ) :
                    new cNumber( Math.atan2( arg1.getValue(), arg0.getValue() ) )
                    )
            }
            r.getInfo = function(){
                return {
                    name:this.name,
                    args:"( x, y )"
                };
            }
        	return r;
		},
        'ATANH' : function(){
            var r = new cBaseFunction();
            r.setName("ATANH");
        	return r;
		},
        'CEILING' : function(){
            var r = new cBaseFunction();
            r.setName("CEILING");
			r.setArgumentsMin(2);
            r.setArgumentsMax(2);
            r.Calculate = function(arg){
				var arg0 = arg[0],arg1 = arg[1];
				if( arg0 instanceof cArea || arg0 instanceof cArea3D ){
					arg0 = arg0.cross(arguments[1].first);
				}
				if( arg1 instanceof cArea || arg1 instanceof cArea3D ){
					arg1 = arg1.cross(arguments[1].first);
				}
                arg0 = arg[0].tocNumber(); arg1 = arg[1].tocNumber();
                if ( arg0 instanceof cError ) return this.value = arg0;
                if ( arg1 instanceof cError ) return this.value = arg1;

				function ceilingHelper( number, significance ){
					if ( significance == 0 )
						return new cNumber( 0.0 );
					if ( ( number > 0 && significance < 0 ) || ( number < 0 && significance > 0 ) )
						return new cError( cErrorType.not_numeric );
					else if ( number / significance === Infinity )
						return new cError( cErrorType.not_numeric );
					else{
						var quotient = number / significance;
						if (quotient == 0){
							return new cNumber( 0.0 );
						}
						var quotientTr = Math.floor(quotient);

						var nolpiat = 5 * ( quotient < 0 ? -1.0 : quotient > 0 ? 1.0 : 0.0 ) * Math.pow( 10, Math.floor ( Math.log( Math.abs( quotient ) ) / Math.log( 10 ) ) - cExcelSignificantDigits );

						if (Math.abs(quotient - quotientTr) > nolpiat){
							++quotientTr;
						}
						return new cNumber ( quotientTr * significance );
					}
				}

				if( arg0 instanceof cArray && arg1 instanceof cArray ){
					if( arg0.getCountElement() != arg1.getCountElement() || arg0.getRowCount() != arg1.getRowCount() ){
						return this.value = new cError( cErrorType.not_available );
					}
					else{
						arg0.foreach(function(elem,r,c){
							var a = elem,
								b = arg1.getElementRowCol(r,c);
							if( a instanceof cNumber && b instanceof cNumber ){
								this.array[r][c] = ceilingHelper( a.getValue(), b.getValue() )
							}
							else
								this.array[r][c] = new cError( cErrorType.wrong_value_type );
						})
						return this.value = arg0;
					}
				}
				else if( arg0 instanceof cArray ){
					arg0.foreach(function(elem,r,c){
						var a = elem,
							b = arg1;
						if( a instanceof cNumber && b instanceof cNumber ){
							this.array[r][c] = ceilingHelper( a.getValue(), b.getValue() )
						}
						else
							this.array[r][c] = new cError( cErrorType.wrong_value_type );
					})
					return this.value = arg0;
				}
				else if( arg1 instanceof cArray ){
					arg1.foreach(function(elem,r,c){
						var a = arg0,
							b = elem;
						if( a instanceof cNumber && b instanceof cNumber ){
							this.array[r][c] = ceilingHelper( a.getValue(), b.getValue() )
						}
						else
							this.array[r][c] = new cError( cErrorType.wrong_value_type );
					})
					return this.value = arg1;
				}

				return this.value = ceilingHelper( arg0.getValue(), arg1.getValue() );

            }
            r.getInfo = function(){
                return {
                    name:this.name,
                    args:"(number, significance)"
                };
            }
        	return r;
		},
        'COMBIN' : function(){
            var r = new cBaseFunction();
            r.setName("COMBIN");
        	return r;
		},
        'COS' : function (){
            var r = new cBaseFunction();
            r.setName("COS");
			r.setArgumentsMin(1);
            r.setArgumentsMax(1);
            r.Calculate = function(arg){
				var arg0 = arg[0];
				if( arg0 instanceof cArea || arg0 instanceof cArea3D ){
					arg0 = arg0.cross(arguments[1].first);
				}
                arg0 = arg0.tocNumber();
				if( arg0 instanceof cError )
					return this.value = arg0;
				else if( arg0 instanceof cArray ){
					arg0.foreach(function(elem,r,c){
						if( elem instanceof cNumber ){
							var a = Math.cos( elem.getValue() );
							this.array[r][c] = isNaN( a ) ? new cError( cErrorType.not_numeric ) : new cNumber( a );
						}
						else{
							this.array[r][c] = new cError( cErrorType.wrong_value_type );
						}
					})
				}
				else {
					var a = Math.cos( arg0.getValue() );
					return this.value = isNaN( a ) ? new cError( cErrorType.not_numeric ) : new cNumber( a );
				}
                return this.value = arg0;
            }
            r.getInfo = function(){
                return {
                    name:this.name,
                    args:"(number)"
                };
            }
        	return r;
		},
        'COSH' : function(){
            var r = new cBaseFunction();
            r.setName("COSH");
        	return r;
		},
        'DEGREES' : function(){
            var r = new cBaseFunction();
            r.setName("DEGREES");
			r.setArgumentsMin(1);
            r.setArgumentsMax(1);
            r.Calculate = function(arg){
				var arg0 = arg[0];
				if( arg0 instanceof cArea || arg0 instanceof cArea3D ){
					arg0 = arg0.cross(arguments[1].first);
				}
				arg0 = arg0.tocNumber();
				if( arg0 instanceof cError )
					return this.value = arg0;
				else if( arg0 instanceof cArray ){
					arg0.foreach(function(elem,r,c){
						if( elem instanceof cNumber ){
							var a = elem.getValue();
							this.array[r][c] = isNaN( a ) ? new cError( cErrorType.not_numeric ) : new cNumber( a * 180 / Math.PI );
						}
						else{
							this.array[r][c] = new cError( cErrorType.wrong_value_type );
						}
					})
				}
				else {
					var a =  arg0.getValue();
					return this.value = isNaN( a ) ? new cError( cErrorType.not_numeric ) : new cNumber( a * 180 / Math.PI );
				}
                return this.value = arg0;

            };
            r.getInfo = function(){
                return {
                    name:this.name,
                    args:"(number)"
                };
            }
        	return r;
		},
        'ECMA.CEILING' : function(){
            var r = new cBaseFunction();
            r.setName("ECMA_CEILING");
        	return r;
		},
        'EVEN' : function(){
            var r = new cBaseFunction();
            r.setName("EVEN");
			r.setArgumentsMin(1);
            r.setArgumentsMax(1);
            r.Calculate = function(arg){

				function evenHelper( arg ){
					var arg0 = arg.getValue();
					if (arg0 >= 0)
					{
						arg0 = Math.ceil( arg0 );
						if ( (arg0 & 1) == 0 )
							return new cNumber ( arg0 );
						else
							return new cNumber ( arg0 + 1 );
					}
					else {
						arg0 = Math.floor( arg0 );
						if ( (arg0 & 1) == 0 )
							return new cNumber ( arg0 );
						else
							return new cNumber ( arg0 - 1 );
					}
				}

				var arg0 = arg[0];
				if( arg0 instanceof cArea || arg0 instanceof cArea3D ){
					arg0 = arg0.cross(arguments[1].first);
				}

				arg0 = arg0.tocNumber();

				if ( arg0 instanceof cError )
                    return this.value = arg0;

				if( arg0 instanceof cArray ){
					arg0.foreach(function(elem,r,c){
						if( elem instanceof cNumber ){
							this.array[r][c] = evenHelper( elem );
						}
						else{
							this.array[r][c] = new cError ( cErrorType.wrong_value_type );
						}
					})
					return this.value = arg0;
				}
                else if ( arg0 instanceof cNumber ){
					return this.value = evenHelper( arg0 );
                }
				return this.value = new cError ( cErrorType.wrong_value_type );
            }
            r.getInfo = function(){
                return {
                    name:this.name,
                    args:"(number)"
                };
            }
        	return r;
		},
        'EXP' : function(){
            var r = new cBaseFunction();
            r.setName("EXP");
			r.setArgumentsMin(1);
            r.setArgumentsMax(1);
			r.Calculate = function(arg){
				var arg0 = arg[0];
				if( arg0 instanceof cArea || arg0 instanceof cArea3D ){
					arg0 = arg0.cross(arguments[1].first);
				}
                arg0 = arg0.tocNumber();
				if( arg0 instanceof cError )
					return this.value = arg0;
				else if( arg0 instanceof cArray ){
					arg0.foreach(function(elem,r,c){
						if( elem instanceof cNumber ){
							var a = Math.exp( elem.getValue() );
							this.array[r][c] = isNaN( a ) ? new cError( cErrorType.not_numeric ) : new cNumber( a );
						}
						else{
							this.array[r][c] = new cError( cErrorType.wrong_value_type );
						}
					})
				}
				if( !(arg0 instanceof cNumber) ){
					return this.value = new cError( cErrorType.not_numeric );
				}
				else {
					var a = Math.exp( arg0.getValue() );
					return this.value = isNaN( a ) ? new cError( cErrorType.not_numeric ) : new cNumber( a );
				}
                return this.value = arg0;
            }
            r.getInfo = function(){
                return {
                    name:this.name,
                    args:"(number)"
                };
            }
        	return r;
		},
        'FACT' : function(){
            var r = new cBaseFunction();
            r.setName("FACT");
        	return r;
		},
        'FACTDOUBLE' : function(){
            var r = new cBaseFunction();
            r.setName("FACTDOUBLE");
        	return r;
		},
        'FLOOR' : function(){
            var r = new cBaseFunction();
            r.setName("FLOOR");
			r.setArgumentsMin(2);
            r.setArgumentsMax(2);
            r.Calculate = function(arg){
                var arg0 = arg[0],arg1 = arg[1];
				if( arg0 instanceof cArea || arg0 instanceof cArea3D ){
					arg0 = arg0.cross(arguments[1].first);
				}
				if( arg1 instanceof cArea || arg1 instanceof cArea3D ){
					arg1 = arg1.cross(arguments[1].first);
				}

                arg0 = arg[0].tocNumber(); arg1 = arg[1].tocNumber();
                if ( arg0 instanceof cError ) return this.value = arg0;
                if ( arg1 instanceof cError ) return this.value = arg1;

				function floorHelper( number, significance ){
					if ( significance == 0 )
						return new cNumber( 0.0 );
					if ( ( number > 0 && significance < 0 ) || ( number < 0 && significance > 0 ) )
						return new cError( cErrorType.not_numeric );
					else if ( number / significance === Infinity )
						return new cError( cErrorType.not_numeric );
					else{
						var quotient = number / significance;
						if (quotient == 0){
							return new cNumber( 0.0 );
						}

						var nolpiat = 5 * ( quotient < 0 ? -1.0 : quotient > 0 ? 1.0 : 0.0 ) * Math.pow( 10, Math.floor ( Math.log( Math.abs( quotient ) ) / Math.log( 10 ) ) - cExcelSignificantDigits );

						return new cNumber ( Math.floor(quotient + nolpiat) * significance );
					}
				}

				if( arg0 instanceof cArray && arg1 instanceof cArray ){
					if( arg0.getCountElement() != arg1.getCountElement() || arg0.getRowCount() != arg1.getRowCount() ){
						return this.value = new cError( cErrorType.not_available );
					}
					else{
						arg0.foreach(function(elem,r,c){
							var a = elem;
								b = arg1.getElementRowCol(r,c);
							if( a instanceof cNumber && b instanceof cNumber ){
								this.array[r][c] = floorHelper( a.getValue(), b.getValue() )
							}
							else
								this.array[r][c] = new cError( cErrorType.wrong_value_type );
						})
						return this.value = arg0;
					}
				}
				else if( arg0 instanceof cArray ){
					arg0.foreach(function(elem,r,c){
						var a = elem;
							b = arg1;
						if( a instanceof cNumber && b instanceof cNumber ){
							this.array[r][c] = floorHelper( a.getValue(), b.getValue() )
						}
						else
							this.array[r][c] = new cError( cErrorType.wrong_value_type );
					})
					return this.value = arg0;
				}
				else if( arg1 instanceof cArray ){
					arg1.foreach(function(elem,r,c){
						var a = arg0;
							b = elem;
						if( a instanceof cNumber && b instanceof cNumber ){
							this.array[r][c] = floorHelper( a.getValue(), b.getValue() )
						}
						else
							this.array[r][c] = new cError( cErrorType.wrong_value_type );
					})
					return this.value = arg1;
				}

				if( arg0 instanceof cString || arg1 instanceof cString )
					return this.value = new cError( cErrorType.wrong_value_type );

				return this.value =  floorHelper( arg0.getValue(), arg1.getValue() );
            }
            r.getInfo = function(){
                return {
                    name:this.name,
                    args:"(number, significance)"
                };
            }
        	return r;
		},
        'GCD' : function(){
            var r = new cBaseFunction();
            r.setName("GCD");
			r.setArgumentsMin(1);
            r.setArgumentsMax(255);
            r.Calculate = function(arg){

				var _gcd = 0;

				function gcd(a,b){
					var _a = parseInt(a), _b = parseInt(b);
					while (_b != 0)
						_b = _a % (_a = _b);
					return _a;
				}

				for( var i = 0; i < this.getArguments(); i++ ){
					var argI = arg[i];

					if( argI instanceof cArea || argI instanceof cArea3D ){
						var argArr = argI.getValue();
						for( var j = 0; j < argArr.length; j++ ){

							if( argArr[j] instanceof cError )
								return this.value = argArr[j];

							if( argArr[j] instanceof cString )
								continue;

							if( argArr[j] instanceof cBool )
								argArr[j] = argArr[j].tocNumber();

							if( argArr[j].getValue() < 0 )
								return this.value = new cError( cErrorType.not_numeric );

							_gcd = gcd(_gcd,argArr[j].getValue());
						}
					}
					else if( argI instanceof cArray ){
						var argArr = argI.tocNumber();

						if(
							argArr.foreach(function(arrElem){

								if( arrElem instanceof cError ){
									_gcd = arrElem;
									return true;
								}

								if( arrElem instanceof cBool )
									arrElem = arrElem.tocNumber();

								if( arrElem instanceof cString )
									return;

								if( arrElem.getValue() < 0 ){
									_gcd = new cError( cErrorType.not_numeric );
									return true;
								}
								_gcd = gcd(_gcd,arrElem.getValue());

							})
						){
							return this.value = _gcd;
						}
					}
					else{
						argI = argI.tocNumber();

						if( argI.getValue() < 0 )
								return this.value = new cError( cErrorType.not_numeric );

						if( argI instanceof cError )
							return this.value = argI;

						_gcd = gcd(_gcd,argI.getValue())
					}
				}

				return this.value = new cNumber( _gcd );

			}
			r.getInfo = function(){
                return {
                    name:this.name,
                    args:"( argument-list )"
                };
            }
        	return r;
		},
        'INT' : function(){
            var r = new cBaseFunction();
            r.setName("INT");
			r.setArgumentsMin(1);
            r.setArgumentsMax(1);
            r.Calculate = function(arg){
                var arg0 = arg[0];
				if( arg0 instanceof cArea || arg0 instanceof cArea3D ){
					arg0 = arg0.cross(arguments[1].first);
				}
                arg0 = arg0.tocNumber();
                if( arg0 instanceof cError) return this.value = arg0;
				if( arg0 instanceof cString ) this.value = new cError ( cErrorType.wrong_value_type );

				if( arg0 instanceof cArray ){
					arg0.foreach(function(elem,r,c){
						if( elem instanceof cNumber ){
							this.array[r][c] = new cNumber( Math.floor( elem.getValue() ) )
						}
						else{
							this.array[r][c] = new cError( cErrorType.wrong_value_type );
						}
					})
				}
				else {
					return this.value = new cNumber( Math.floor( arg0.getValue() ) )
				}

                return this.value = new cNumber( Math.floor( arg0.getValue() ) );
            }
            r.getInfo = function(){
                return {
                    name:this.name,
                    args:"(number)"
                };
            }
        	return r;
		},
        'ISO.CEILING' : function(){
            var r = new cBaseFunction();
            r.setName("ISO_CEILING");
        	return r;
		},
        'LCM' : function(){
            var r = new cBaseFunction();
            r.setName("LCM");
        	return r;
		},
        'LN' : function(){
            var r = new cBaseFunction();
            r.setName("LN");
			r.setArgumentsMin(1);
            r.setArgumentsMax(1);
            r.Calculate = function(arg){
				var arg0 = arg[0];
				if( arg0 instanceof cArea || arg0 instanceof cArea3D ){
					arg0 = arg0.cross(arguments[1].first);
				}
				arg0 = arg0.tocNumber();
				if( arg0 instanceof cError )
					return this.value = arg0;
				if( arg0 instanceof cString )
					return this.value = new cError( cErrorType.wrong_value_type );
				else if( arg0 instanceof cArray ){
					arg0.foreach(function(elem,r,c){
						if( elem instanceof cNumber ){
							if( elem.getValue() <= 0 )
								this.array[r][c] = new cError( cErrorType.not_numeric );
							else
								this.array[r][c] = new cNumber( Math.log( elem.getValue() ) );
						}
						else{
							this.array[r][c] = new cError( cErrorType.wrong_value_type );
						}
					})
				}
				else {
					if( arg0.getValue() <= 0 )
						return this.value = new cError( cErrorType.not_numeric );
					else
						return this.value = new cNumber( Math.log( arg0.getValue() ) );
				}
            }
            r.getInfo = function(){
                return {
                    name:this.name,
                    args:"(number)"
                };
            }
        	return r;
		},
        'LOG' : function(){
            var r = new cBaseFunction();
            r.setName("LOG");
			r.setArgumentsMin(1);
            r.setArgumentsMax(2);
            r.Calculate = function(arg){
				var arg0 = arg[0],arg1 = undefined;
				if( arg0 instanceof cArea || arg0 instanceof cArea3D ){
					arg0 = arg0.cross(arguments[1].first);
				}
                arg0 = arg0.tocNumber();

				if( this.argumentsCurrent == 2 ){
					arg1 = arg[1];
					if( arg1 instanceof cArea || arg1 instanceof cArea3D ){
						arg1 = arg1.cross(arguments[1].first);
					}
					arg1 = arg1.tocNumber();
					if ( arg1 instanceof cError )
						return this.value = arg1;
				}

				if ( arg0 instanceof cError )
					return this.value = arg0;

				if( arg0 instanceof cArray && arg1 instanceof cArray ){
					if( arg0.getCountElement() != arg1.getCountElement() || arg0.getRowCount() != arg1.getRowCount() ){
						return this.value = new cError( cErrorType.not_available );
					}
					else{
						arg0.foreach(function(elem,r,c){
							var a = elem;
								b = arg1.getElementRowCol(r,c);
							if( a instanceof cNumber && b instanceof cNumber ){
								this.array[r][c] = new cNumber(  Math.log ( a.getValue() ) / Math.log ( b.getValue() ) );
							}
							else
								this.array[r][c] = new cError( cErrorType.wrong_value_type );
						})
						return this.value = arg0;
					}
				}
				else if( arg0 instanceof cArray ){
					arg0.foreach(function(elem,r,c){
						var a = elem,
							b = arg1 ? arg1 : new cNumber( 10 );
						if( a instanceof cNumber && b instanceof cNumber ){

							if ( a.getValue() <= 0 || a.getValue() <= 0 )
								this.array[r][c] = new cError( cErrorType.not_numeric );

							this.array[r][c] = new cNumber(  Math.log ( a.getValue() ) / Math.log ( b.getValue() ) );
						}
						else
							this.array[r][c] = new cError( cErrorType.wrong_value_type );
					})
					return this.value = arg0;
				}
				else if( arg1 instanceof cArray ){
					arg1.foreach(function(elem,r,c){
						var a = arg0,
							b = elem;
						if( a instanceof cNumber && b instanceof cNumber ){

							if ( a.getValue() <= 0 || a.getValue() <= 0 )
								this.array[r][c] = new cError( cErrorType.not_numeric );

							this.array[r][c] = new cNumber(  Math.log ( a.getValue() ) / Math.log ( b.getValue() ) );
						}
						else
							this.array[r][c] = new cError( cErrorType.wrong_value_type );
					})
					return this.value = arg1;
				}

				if( !(arg0 instanceof cNumber) || ( arg1 && !(arg0 instanceof cNumber) ) )
					return this.value = new cError( cErrorType.wrong_value_type );

				if ( arg0.getValue() <= 0 || ( arg1 && arg1.getValue() <= 0 ) )
					return this.value = new cError( cErrorType.not_numeric );


				if ( this.argumentsCurrent == 1)
					return this.value = new cNumber( Math.log( arg0.getValue() ) / Math.log( 10 ) );
				else
					return this.value = new cNumber( Math.log( arg0.getValue() ) / Math.log( arg1.getValue() ) );

            };
            r.getInfo = function(){
                return {
                    name:this.name,
                    args:"(number [ , base ])"
                };
            }
        	return r;
		},
        'LOG10' : function(){
            var r = new cBaseFunction();
            r.setName("LOG10");
			r.setArgumentsMin(1);
            r.setArgumentsMax(1);
            r.Calculate = function(arg){
				var arg0 = arg[0];
				if( arg0 instanceof cArea || arg0 instanceof cArea3D ){
					arg0 = arg0.cross(arguments[1].first);
				}
				arg0 = arg0.tocNumber();
				if( arg0 instanceof cError )
					return this.value = arg0;
				if( arg0 instanceof cString )
					return this.value = new cError( cErrorType.wrong_value_type );
				else if( arg0 instanceof cArray ){
					arg0.foreach(function(elem,r,c){
						if( elem instanceof cNumber ){
							if( elem.getValue() <= 0 )
								this.array[r][c] = new cError( cErrorType.not_numeric );
							else
								this.array[r][c] = new cNumber( Math.log( elem.getValue() ) / Math.log( 10 ) );
						}
						else{
							this.array[r][c] = new cError( cErrorType.wrong_value_type );
						}
					})
				}
				else {
					if( arg0.getValue() <= 0 )
						return this.value = new cError( cErrorType.not_numeric );
					else
						return this.value = new cNumber( Math.log( arg0.getValue() ) / Math.log( 10 ) );
				}
            }
            r.getInfo = function(){
                return {
                    name:this.name,
                    args:"(number)"
                };
            }
        	return r;
		},
        'MDETERM' : function(){
            var r = new cBaseFunction();
            r.setName("MDETERM");
        	return r;
		},
        'MINVERSE' : function(){
            var r = new cBaseFunction();
            r.setName("MINVERSE");
        	return r;
		},
        'MMULT' : function(){
            var r = new cBaseFunction();
            r.setName("MMULT");
        	return r;
		},
        'MOD' : function(){
            var r = new cBaseFunction();
            r.setArgumentsMin(2);
            r.setArgumentsMax(2);
			r.setName("MOD");
            r.Calculate = function(arg){
				var arg0 = arg[0],arg1 = arg[1];
				if( arg0 instanceof cArea || arg0 instanceof cArea3D ){
					arg0 = arg0.cross(arguments[1].first);
				}
				if( arg1 instanceof cArea || arg1 instanceof cArea3D ){
					arg1 = arg1.cross(arguments[1].first);
				}
				arg0 = arg0.tocNumber(); arg1 = arg1.tocNumber();

				if ( arg0 instanceof cError ) return this.value = arg0;
				if ( arg1 instanceof cError ) return this.value = arg1;

				if( arg0 instanceof cArray && arg1 instanceof cArray ){
					if( arg0.getCountElement() != arg1.getCountElement() || arg0.getRowCount() != arg1.getRowCount() ){
						return this.value = new cError( cErrorType.not_available );
					}
					else{
						arg0.foreach(function(elem,r,c){
							var a = elem;
								b = arg1.getElementRowCol(r,c);
							if( a instanceof cNumber && b instanceof cNumber ){
								this.array[r][c] = new cNumber( (b.getValue() < 0 ? -1 : 1) * ( Math.abs(a.getValue()) % Math.abs(b.getValue()) ) );
							}
							else
								this.array[r][c] = new cError( cErrorType.wrong_value_type );
						})
						return this.value = arg0;
					}
				}
				else if( arg0 instanceof cArray ){
					arg0.foreach(function(elem,r,c){
						var a = elem,
							b = arg1;
						if( a instanceof cNumber && b instanceof cNumber ){

							this.array[r][c] = new cNumber( (b.getValue() < 0 ? -1 : 1) * ( Math.abs(a.getValue()) % Math.abs(b.getValue()) ) );
						}
						else
							this.array[r][c] = new cError( cErrorType.wrong_value_type );
					})
					return this.value = arg0;
				}
				else if( arg1 instanceof cArray ){
					arg1.foreach(function(elem,r,c){
						var a = arg0,
							b = elem;
						if( a instanceof cNumber && b instanceof cNumber ){
							this.array[r][c] = new cNumber( (b.getValue() < 0 ? -1 : 1) * ( Math.abs(a.getValue()) % Math.abs(b.getValue()) ) );
						}
						else
							this.array[r][c] = new cError( cErrorType.wrong_value_type );
					})
					return this.value = arg1;
				}

				if( !(arg0 instanceof cNumber) || ( arg1 && !(arg0 instanceof cNumber) ) )
					return this.value = new cError( cErrorType.wrong_value_type );

				if ( arg1.getValue() == 0 )
					return this.value = new cError( cErrorType.division_by_zero );

				return this.value = new cNumber( (arg1.getValue() < 0 ? -1 : 1) * ( Math.abs(arg0.getValue()) % Math.abs(arg1.getValue()) ) );

            }
            r.getInfo = function(){
                return {
                    name:this.name,
                    args:"(number, divisor)"
                };
            }
        	return r;
		},
        'MROUND' : function(){
            var r = new cBaseFunction();
            r.setName("MROUND");
			r.setArgumentsMin(2);
            r.setArgumentsMax(2);
            r.Calculate = function(arg){

				var multiple;
				function mroundHelper(num){
                    var multiplier = Math.pow(10, Math.floor(Math.log(Math.abs(num))/Math.log(10)) - cExcelSignificantDigits + 1);
                    var nolpiat = 0.5 * (num>0?1:num<0?-1:0) * multiplier;
                    var y = (num + nolpiat) / multiplier;
                    y = y/Math.abs(y)*Math.floor(Math.abs(y))
                    var x  = y * multiplier /  multiple

					// var x = number / multiple;
					var nolpiat = 5 * (x/Math.abs(x)) * Math.pow(10, Math.floor(Math.log(Math.abs(x))/Math.log(10)) - cExcelSignificantDigits);
					x = x + nolpiat;
					x = x | x;

					return x*multiple;
				}

				function f(a,b,r,c){
					if( a instanceof cNumber && b instanceof cNumber ){
						if( a.getValue() == 0 )
							this.array[r][c] = new cNumber( 0 );
						else if( a.getValue() < 0 && b.getValue() > 0 || arg0.getValue() > 0 && b.getValue() < 0)
							this.array[r][c] = new cError( cErrorType.not_numeric );
						else{
							multiple = b.getValue();
							this.array[r][c] = new cNumber( mroundHelper( a.getValue() + b.getValue() / 2 ) )
						}
					}
					else
						this.array[r][c] = new cError( cErrorType.wrong_value_type );
				}

				var arg0 = arg[0], arg1 = arg[1];
				if( arg0 instanceof cArea || arg0 instanceof cArea3D ){
					arg0 = arg0.cross(arguments[1].first);
				}
				if( arg1 instanceof cArea || arg1 instanceof cArea3D ){
					arg1 = arg1.cross(arguments[1].first);
				}

                arg0 = arg0.tocNumber();
                arg1 = arg1.tocNumber();

                if( arg0 instanceof cError ) return this.value = arg0;
                if( arg1 instanceof cError ) return this.value = arg1;
				if( arg0 instanceof cString || arg1 instanceof cString ) { return this.value = new cError( cErrorType.wrong_value_type ); }

				if( arg0 instanceof cArray && arg1 instanceof cArray ){
					if( arg0.getCountElement() != arg1.getCountElement() || arg0.getRowCount() != arg1.getRowCount() ){
						return this.value = new cError( cErrorType.not_available );
					}
					else{
						arg0.foreach(function(elem,r,c){
							f.call(this,elem,arg1.getElementRowCol(r,c),r,c)
						})
						return this.value = arg0;
					}
				}
				else if( arg0 instanceof cArray ){
					arg0.foreach(function(elem,r,c){
						f.call(this,elem,arg1,r,c);
					})
					return this.value = arg0;
				}
				else if( arg1 instanceof cArray ){
					arg1.foreach(function(elem,r,c){
						f.call(this,arg0,elem,r,c)
					})
					return this.value = arg1;
				}

                if( arg1.getValue() == 0 )
                    return this.value = new cNumber( 0 );

                if( arg0.getValue() < 0 && arg1.getValue() > 0 || arg0.getValue() > 0 && arg1.getValue() < 0)
                    return this.value = new cError( cErrorType.not_numeric );

				multiple = arg1.getValue();
                return this.value = new cNumber( mroundHelper( arg0.getValue() + arg1.getValue() / 2 ) );
            }
            r.getInfo = function(){
                return {
                    name:this.name,
                    args:"(number, multiple)"
                };
            }
        	return r;
		},
        'MULTINOMIAL' : function(){
            var r = new cBaseFunction();
            r.setName("MULTINOMIAL");
        	return r;
		},
        'ODD' : function(){
            var r = new cBaseFunction();
            r.setName("ODD");
			r.setArgumentsMin(1);
            r.setArgumentsMax(1);
            r.Calculate = function(arg){

				function oddHelper( arg ){
					var arg0 = arg.getValue();
					if (arg0 >= 0){
						arg0 = Math.ceil( arg0 );
						if ( (arg0 & 1) == 1 )
							return new cNumber ( arg0 );
						else
							return new cNumber ( arg0 + 1 );
					}
					else {
						arg0 = Math.floor( arg0 );
						if ( (arg0 & 1) == 1 )
							return new cNumber ( arg0 );
						else
							return new cNumber ( arg0 - 1 );
					}
				}

				var arg0 = arg[0];
				if( arg0 instanceof cArea || arg0 instanceof cArea3D ){
					arg0 = arg0.cross(arguments[1].first);
				}
                arg0 = arg0.tocNumber();

				if ( arg0 instanceof cError )
                    return this.value = arg0;

				if( arg0 instanceof cArray ){
					arg0.foreach(function(elem,r,c){
						if( elem instanceof cNumber ){
							this.array[r][c] = oddHelper( elem );
						}
						else{
							this.array[r][c] = new cError ( cErrorType.wrong_value_type );
						}
					})
					return this.value = arg0;
				}
                else if ( arg0 instanceof cNumber ){
					return this.value = oddHelper( arg0 );
                }
				return this.value = new cError ( cErrorType.wrong_value_type );

            }
            r.getInfo = function(){
                return {
                    name:this.name,
                    args:"(number)"
                };
            }
        	return r;
		},
        'PI' : function(){
            var r = new cBaseFunction();
            r.setName("PI");
			r.setArgumentsMin(0);
            r.setArgumentsMax(0);
            r.Calculate = function(){
                return new cNumber(Math.PI);
            };
            r.getInfo = function(){
                return {
                    name:this.name,
                    args:"()"
                }
            }
        	return r;
		},
        'POWER' : function(){
            var r = new cBaseFunction();
            r.setName("POWER");
			r.setArgumentsMin(2);
            r.setArgumentsMax(2);
            r.Calculate = function(arg){

				function powerHelper(a,b){
					if ( a == 0 && b < 0 )
						return new cError( cErrorType.division_by_zero );
					if ( a == 0 && b == 0 )
						return new cError( cErrorType.not_numeric );

					return new cNumber( Math.pow( a, b ) );
				}

				function f(a,b,r,c){
					if( a instanceof cNumber && b instanceof cNumber ){
						this.array[r][c] = powerHelper( a.getValue(), b.getValue() );
					}
					else
						this.array[r][c] = new cError( cErrorType.wrong_value_type );
				}

				var arg0 = arg[0], arg1 = arg[1];
				if( arg0 instanceof cArea || arg1 instanceof cArea3D ){
					arg0 = arg0.cross(arguments[1].first);
				}
				if( arg1 instanceof cArea || arg1 instanceof cArea3D ){
					arg1 = arg1.cross(arguments[1].first);
				}
				arg0 = arg0.tocNumber(); arg1 = arg1.tocNumber();

				if ( arg0 instanceof cError ) return this.value = arg0;
				if ( arg1 instanceof cError ) return this.value = arg1;

				if( arg0 instanceof cArray && arg1 instanceof cArray ){
					if( arg0.getCountElement() != arg1.getCountElement() || arg0.getRowCount() != arg1.getRowCount() ){
						return this.value = new cError( cErrorType.not_available );
					}
					else{
						arg0.foreach(function(elem,r,c){
							f.call(this,elem, arg1.getElementRowCol(r,c),r,c);
						})
						return this.value = arg0;
					}
				}
				else if( arg0 instanceof cArray ){
					arg0.foreach(function(elem,r,c){
						f.call(this,elem,arg1,r,c)
					})
					return this.value = arg0;
				}
				else if( arg1 instanceof cArray ){
					arg1.foreach(function(elem,r,c){
						f.call(this,arg0,elem,r,c);
					})
					return this.value = arg1;
				}

				if( !(arg0 instanceof cNumber) || ( arg1 && !(arg0 instanceof cNumber) ) )
					return this.value = new cError( cErrorType.wrong_value_type );

				return this.value = powerHelper( arg0.getValue(), arg1.getValue() );

            };
            r.getInfo = function(){
                return {
                    name:this.name,
                    args:"(number, power)"
                };
            }
        	return r;
		},
        'PRODUCT' : function(){
            var r = new cBaseFunction();
            r.setArgumentsMin(1);
            r.setArgumentsMax(255);
            r.setName("PRODUCT");
            r.Calculate = function(arg){
                var arg0 = new cNumber(1), _aVal = null;
                for(var i = 0; i < arg.length; i++){
                    if(arg[i] instanceof cArea || arg[i] instanceof cArea3D){
                        var _arrVal = arg[i].getValue();
                        for (var j = 0 ; j < _arrVal.length; j++){
                            arg0 = _func[arg0.type][_arrVal[j].type](arg0,_arrVal[j],"*")
                            if( arg0 instanceof cError)
                                return this.value = arg0;
                        }
                    }
                    else if( arg[i] instanceof cRef || arg[i] instanceof cRef3D ){
                        var _arg = arg[i].getValue();
                        arg0 = _func[arg0.type][_arg.type](arg0,_arg,"*");
                    }
					else if( arg[i] instanceof cArray ){
						arg[i].foreach(function(elem){

							if( elem instanceof cString || elem instanceof cBool || elem instanceof cEmpty )
								return;

							arg0 = _func[arg0.type][elem.type](arg0,elem,"*");
						})
					}
                    else{
                        arg0 = _func[arg0.type][arg[i].type](arg0,arg[i],"*");
                    }
                    if( arg0 instanceof cError)
                        return this.value = arg0;

                }
                return this.value = arg0;
            };
            r.getInfo = function(){
                return {
                    name:this.name,
                    args:"( number1, number2, ... )"
                };
            }
        	return r;
		},
        'QUOTIENT' : function(){
            var r = new cBaseFunction();
            r.setName("QUOTIENT");
        	return r;
		},
        'RADIANS' : function(){
            var r = new cBaseFunction();
            r.setName("RADIANS");
			r.setArgumentsMin(1);
            r.setArgumentsMax(1);
            r.Calculate = function(arg){

				function radiansHelper( ang ){
					return ang * Math.PI / 180
				}

                var arg0 = arg[0];
				if( arg0 instanceof cArea || arg0 instanceof cArea3D ){
					arg0 = arg0.cross(arguments[1].first);
				}
				arg0 = arg0.tocNumber();

				if( arg0 instanceof cArray ){
					arg0.foreach(function(elem,r,c){
						if( elem instanceof cNumber ){
							this.array[r][c] = new cNumber( radiansHelper( elem.getValue() ) );
						}
						else{
							this.array[r][c] = new cError( cErrorType.wrong_value_type );
						}
					})
				}
				else{
					return this.value = ( arg0 instanceof cError ? arg0 : new cNumber( radiansHelper( arg0.getValue() ) ) );
				}

				return this.value = arg0;

            };
            r.getInfo = function(){
                return {
                    name:this.name,
                    args:"(number)"
                };
            }
        	return r;
		},
        'RAND' : function(){
            var r = new cBaseFunction();
            r.setName("RAND");
            r.setArgumentsMin(0);
            r.setArgumentsMax(0);
            r.Calculate = function(){
				return this.setCA(new cNumber( Math.random() ),true);
            };
            r.getInfo = function(){
                return {
                    name:this.name,
                    args:"()"
                };
            }
        	return r;
		},
        'RANDBETWEEN' : function(){
            var r = new cBaseFunction();
            r.setName("RANDBETWEEN");
        	return r;
		},
        'ROMAN' : function(){
            var r = new cBaseFunction();
            r.setName("ROMAN");
        	return r;
		},
        'ROUND' : function(){
            var r = new cBaseFunction();
            r.setName("ROUND");
            r.setArgumentsMin(2);
            r.setArgumentsMax(2);
            r.Calculate = function(arg){

				function SignZeroPositive(number){
					return number < 0 ? -1 : 1;
				}
				function truncate(n) {
					return Math[n > 0 ? "floor" : "ceil"](n);
				}
				function sign(n){
					return n == 0 ? 0 :	n < 0 ? -1 : 1
				}
				function Floor(number, significance){
					var quotient = number / significance;
					if (quotient == 0){
						return 0;
					}
					var nolpiat = 5 * sign(quotient) * Math.pow(10, Math.floor( Math.log ( Math.abs(quotient) ) / Math.log ( 10 ) ) - cExcelSignificantDigits);
					return truncate(quotient + nolpiat) * significance;
				}
				function roundHelper(number,num_digits){
					if(num_digits > cExcelMaxExponent){
						if (Math.abs(number) < 1 || num_digits < 1e10) // The values are obtained experimentally
						{
							return new cNumber(number);
						}
						return new cNumber(0);
					}
					else if (num_digits < cExcelMinExponent)
					{
						if (Math.abs(number) < 0.01) // The values are obtained experimentally
						{
							return new cNumber(number);
						}
						return new cNumber(0);
					}

					var significance = SignZeroPositive(number) * Math.pow(10, -truncate(num_digits));

					number += significance / 2;

					if ( number/significance == Infinity){
						return new cNumber( number );
					}

					return new cNumber( Floor(number, significance) );

				}

                var arg0 = arg[0], arg1 = arg[1];
				if( arg0 instanceof cArea || arg0 instanceof cArea3D ){
					arg0 = arg0.cross(arguments[1].first);
				}
				if( arg1 instanceof cArea || arg1 instanceof cArea3D ){
					arg1 = arg1.cross(arguments[1].first);
				}

				if( arg0 instanceof cError ) return this.value = arg0;
                if( arg1 instanceof cError ) return this.value = arg1;

                if( arg0 instanceof cRef || arg0 instanceof cRef3D ){
                    arg0 = arg0.getValue();
                    if(arg0 instanceof cError) return this.value = arg0;
                    else if(arg0 instanceof cString) return this.value = new cError(cErrorType.wrong_value_type);
                    else arg0 = arg0.tocNumber();
                }
                else arg0 = arg0.tocNumber();

                if( arg1 instanceof cRef || arg1 instanceof cRef3D ){
                    arg1 = arg1.getValue();
                    if(arg1 instanceof cError) return this.value = arg1;
                    else if(arg1 instanceof cString) return this.value = new cError(cErrorType.wrong_value_type);
                    else arg1 = arg1.tocNumber();
                }
                else arg1 = arg1.tocNumber();

				if( arg0 instanceof cArray && arg1 instanceof cArray ){
					if( arg0.getCountElement() != arg1.getCountElement() || arg0.getRowCount() != arg1.getRowCount() ){
						return this.value = new cError( cErrorType.not_available );
					}
					else{
						arg0.foreach(function(elem,r,c){
							var a = elem;
								b = arg1.getElementRowCol(r,c);
							if( a instanceof cNumber && b instanceof cNumber ){
								this.array[r][c] = roundHelper( a.getValue(), b.getValue() )
							}
							else
								this.array[r][c] = new cError( cErrorType.wrong_value_type );
						})
						return this.value = arg0;
					}
				}
				else if( arg0 instanceof cArray ){
					arg0.foreach(function(elem,r,c){
						var a = elem;
							b = arg1;
						if( a instanceof cNumber && b instanceof cNumber ){
							this.array[r][c] = roundHelper( a.getValue(), b.getValue() )
						}
						else
							this.array[r][c] = new cError( cErrorType.wrong_value_type );
					})
					return this.value = arg0;
				}
				else if( arg1 instanceof cArray ){
					arg1.foreach(function(elem,r,c){
						var a = arg0;
							b = elem;
						if( a instanceof cNumber && b instanceof cNumber ){
							this.array[r][c] = roundHelper( a.getValue(), b.getValue() )
						}
						else
							this.array[r][c] = new cError( cErrorType.wrong_value_type );
					})
					return this.value = arg1;
				}

                var number = arg0.getValue(), num_digits = arg1.getValue();

				return this.value = roundHelper(number,num_digits);

            }
            r.getInfo = function(){
                return {
                    name:this.name,
                    args:"(number, num_digits)"
                };
            }
        	return r;
		},
        'ROUNDDOWN' : function(){
            var r = new cBaseFunction();
            r.setName("ROUNDDOWN");
            r.setArgumentsMin(2);
            r.setArgumentsMax(2);
            r.Calculate = function(arg){
				function rounddownHelper(number,num_digits){
					if(num_digits > cExcelMaxExponent){
						if (Math.abs(number) >= 1e-100 || num_digits <= 98303){ // The values are obtained experimentally
							return new cNumber(number);
						}
						return new cNumber(0);
					}
					else if (num_digits < cExcelMinExponent){
						if (Math.abs(number) >= 1e100){ // The values are obtained experimentally
							return new cNumber(number);
						}
						return new cNumber(0);
					}

					var significance = Math.pow(10, - ( num_digits | num_digits ) );

					if (Number.POSITIVE_INFINITY == Math.abs(number / significance)){
						return new cNumber(number);
					}
					var x = number*Math.pow(10, num_digits);
					x = x | x;
					return new cNumber( x * significance );
				}

				var arg0 = arg[0], arg1 = arg[1];
				if( arg0 instanceof cArea || arg0 instanceof cArea3D ){
					arg0 = arg0.cross(arguments[1].first);
				}
				if( arg1 instanceof cArea || arg1 instanceof cArea3D ){
					arg1 = arg1.cross(arguments[1].first);
				}

                if( arg0 instanceof cError ) return this.value = arg0;
                if( arg1 instanceof cError ) return this.value = arg1;

                if( arg0 instanceof cRef || arg0 instanceof cRef3D ){
                    arg0 = arg0.getValue();
                    if(arg0 instanceof cError) return this.value = arg0;
                    else if(arg0 instanceof cString) return this.value = new cError(cErrorType.wrong_value_type);
                    else arg0 = arg0.tocNumber();
                }
                else arg0 = arg0.tocNumber();

                if( arg1 instanceof cRef || arg1 instanceof cRef3D ){
                    arg1 = arg1.getValue();
                    if(arg1 instanceof cError) return this.value = arg1;
                    else if(arg1 instanceof cString) return this.value = new cError(cErrorType.wrong_value_type);
                    else arg1 = arg1.tocNumber();
                }
                else arg1 = arg1.tocNumber();

				if( arg0 instanceof cArray && arg1 instanceof cArray ){
					if( arg0.getCountElement() != arg1.getCountElement() || arg0.getRowCount() != arg1.getRowCount() ){
						return this.value = new cError( cErrorType.not_available );
					}
					else{
						arg0.foreach(function(elem,r,c){
							var a = elem;
								b = arg1.getElementRowCol(r,c);
							if( a instanceof cNumber && b instanceof cNumber ){
								this.array[r][c] = rounddownHelper( a.getValue(), b.getValue() )
							}
							else
								this.array[r][c] = new cError( cErrorType.wrong_value_type );
						})
						return this.value = arg0;
					}
				}
				else if( arg0 instanceof cArray ){
					arg0.foreach(function(elem,r,c){
						var a = elem;
							b = arg1;
						if( a instanceof cNumber && b instanceof cNumber ){
							this.array[r][c] = rounddownHelper( a.getValue(), b.getValue() )
						}
						else
							this.array[r][c] = new cError( cErrorType.wrong_value_type );
					})
					return this.value = arg0;
				}
				else if( arg1 instanceof cArray ){
					arg1.foreach(function(elem,r,c){
						var a = arg0;
							b = elem;
						if( a instanceof cNumber && b instanceof cNumber ){
							this.array[r][c] = rounddownHelper( a.getValue(), b.getValue() )
						}
						else
							this.array[r][c] = new cError( cErrorType.wrong_value_type );
					})
					return this.value = arg1;
				}

                var number = arg0.getValue(), num_digits = arg1.getValue();
				return this.value = rounddownHelper(number,num_digits);

            }
            r.getInfo = function(){
                return {
                    name:this.name,
                    args:"(number, num_digits)"
                };
            }
        	return r;
		},
        'ROUNDUP' : function(){
            var r = new cBaseFunction();
            r.setName("ROUNDUP");
            r.setArgumentsMin(2);
            r.setArgumentsMax(2);
            r.Calculate = function(arg){
				function roundupHelper(number, num_digits){
					if(num_digits > cExcelMaxExponent){
						if (Math.abs(number) >= 1e-100 || num_digits <= 98303){ // The values are obtained experimentally
							return new cNumber(number);
						}
						return new cNumber(0);
					}
					else if (num_digits < cExcelMinExponent){
						if (Math.abs(number) >= 1e100){ // The values are obtained experimentally
							return new cNumber(number);
						}
						return new cNumber(0);
					}

					var significance = Math.pow(10, - ( num_digits | num_digits ) );

					if (Number.POSITIVE_INFINITY == Math.abs(number / significance)){
						return new cNumber(number);
					}
					var x = number*Math.pow(10, num_digits);
					x = (x | x) + (x>0?1:x<0?-1:0)*1;
					return new cNumber( x * significance );
				}

				var arg0 = arg[0], arg1 = arg[1];
				if( arg0 instanceof cArea || arg0 instanceof cArea3D ){
					arg0 = arg0.cross(arguments[1].first);
				}
				if( arg1 instanceof cArea || arg1 instanceof cArea3D ){
					arg1 = arg1.cross(arguments[1].first);
				}

                if( arg0 instanceof cError ) return this.value = arg0;
                if( arg1 instanceof cError ) return this.value = arg1;

                if( arg0 instanceof cRef || arg0 instanceof cRef3D ){
                    arg0 = arg0.getValue();
                    if(arg0 instanceof cError) return this.value = arg0;
                    else if(arg0 instanceof cString) return this.value = new cError(cErrorType.wrong_value_type);
                    else arg0 = arg0.tocNumber();
                }
                else arg0 = arg0.tocNumber();

                if( arg1 instanceof cRef || arg1 instanceof cRef3D ){
                    arg1 = arg1.getValue();
                    if(arg1 instanceof cError) return this.value = arg1;
                    else if(arg1 instanceof cString) return this.value = new cError(cErrorType.wrong_value_type);
                    else arg1 = arg1.tocNumber();
                }
                else arg1 = arg1.tocNumber();

				if( arg0 instanceof cArray && arg1 instanceof cArray ){
					if( arg0.getCountElement() != arg1.getCountElement() || arg0.getRowCount() != arg1.getRowCount() ){
						return this.value = new cError( cErrorType.not_available );
					}
					else{
						arg0.foreach(function(elem,r,c){
							var a = elem;
								b = arg1.getElementRowCol(r,c);
							if( a instanceof cNumber && b instanceof cNumber ){
								this.array[r][c] = roundupHelper( a.getValue(), b.getValue() )
							}
							else
								this.array[r][c] = new cError( cErrorType.wrong_value_type );
						})
						return this.value = arg0;
					}
				}
				else if( arg0 instanceof cArray ){
					arg0.foreach(function(elem,r,c){
						var a = elem;
							b = arg1;
						if( a instanceof cNumber && b instanceof cNumber ){
							this.array[r][c] = roundupHelper( a.getValue(), b.getValue() )
						}
						else
							this.array[r][c] = new cError( cErrorType.wrong_value_type );
					})
					return this.value = arg0;
				}
				else if( arg1 instanceof cArray ){
					arg1.foreach(function(elem,r,c){
						var a = arg0;
							b = elem;
						if( a instanceof cNumber && b instanceof cNumber ){
							this.array[r][c] = roundupHelper( a.getValue(), b.getValue() )
						}
						else
							this.array[r][c] = new cError( cErrorType.wrong_value_type );
					})
					return this.value = arg1;
				}

                var number = arg0.getValue(), num_digits = arg1.getValue();
				return this.value = roundupHelper(number, num_digits);

            }
        	r.getInfo = function(){
                return {
                    name:this.name,
                    args:"(number, num_digits)"
                };
            }
			return r;
		},
        'SERIESSUM' : function(){
            var r = new cBaseFunction();
            r.setName("SERIESSUM");
        	return r;
		},
        'SIGN' : function(){
            var r = new cBaseFunction();
            r.setName("SIGN");
			r.setArgumentsMin(1);
            r.setArgumentsMax(1);
            r.Calculate = function(arg){

				function signHelper(arg){
					if ( arg < 0)
						return new cNumber(-1.0);
					else if ( arg == 0)
						return new cNumber(0.0);
					else
						return new cNumber(1.0);
				}

				var arg0 = arg[0];
				if( arg0 instanceof cArea || arg0 instanceof cArea3D ){
					arg0 = arg0.cross(arguments[1].first);
				}

				arg0 = arg0.tocNumber();
				if( arg0 instanceof cError )
					return this.value = arg0;
				else if( arg0 instanceof cArray ){
					arg0.foreach(function(elem,r,c){
						if( elem instanceof cNumber ){
							var a = elem.getValue();
							this.array[r][c] = signHelper(a)
						}
						else{
							this.array[r][c] = new cError( cErrorType.wrong_value_type );
						}
					})
				}
				else {
					var a = arg0.getValue();
					return this.value = signHelper(a);
				}
                return this.value = arg0;

            };
            r.getInfo = function(){
                return {
                    name:this.name,
                    args:"(number)"
                };
            }
        	return r;
		},
        'SIN' : function(){
            var r = new cBaseFunction();
            r.setName("SIN");
			r.setArgumentsMin(1);
            r.setArgumentsMax(1);
            r.Calculate = function(arg){
				var arg0 = arg[0];
				if( arg0 instanceof cArea || arg0 instanceof cArea3D ){
					arg0 = arg0.cross(arguments[1].first);
				}
                arg0 = arg0.tocNumber();
				if( arg0 instanceof cError )
					return this.value = arg0;
				else if( arg0 instanceof cArray ){
					arg0.foreach(function(elem,r,c){
						if( elem instanceof cNumber ){
							var a = Math.sin( elem.getValue() );
							this.array[r][c] = isNaN( a ) ? new cError( cErrorType.not_numeric ) : new cNumber( a );
						}
						else{
							this.array[r][c] = new cError( cErrorType.wrong_value_type );
						}
					})
				}
				else {
					var a = Math.sin( arg0.getValue() );
					return this.value = isNaN( a ) ? new cError( cErrorType.not_numeric ) : new cNumber( a );
				}
                return this.value = arg0;
            }
            r.getInfo = function(){
                return { name:this.name, args:"(number)" }
            }
        	return r;
		},
        'SINH' : function(){
            var r = new cBaseFunction();
            r.setName("SINH");
        	return r;
		},
        'SQRT' :  function(){
            var r = new cBaseFunction();
            r.setName("SQRT");
			r.setArgumentsMin(1);
            r.setArgumentsMax(1);
			r.Calculate = function(arg){
				var arg0 = arg[0];
				if( arg0 instanceof cArea || arg0 instanceof cArea3D ){
					arg0 = arg0.cross(arguments[1].first);
				}
                arg0 = arg0.tocNumber();
				if( arg0 instanceof cError )
					return this.value = arg0;
				else if( arg0 instanceof cArray ){
					arg0.foreach(function(elem,r,c){
						if( elem instanceof cNumber ){
							var a = Math.sqrt( elem.getValue() );
							this.array[r][c] = isNaN( a ) ? new cError( cErrorType.not_numeric ) : new cNumber( a );
						}
						else{
							this.array[r][c] = new cError( cErrorType.wrong_value_type );
						}
					})
				}
				else {
					var a = Math.sqrt( arg0.getValue() );
					return this.value = isNaN( a ) ? new cError( cErrorType.not_numeric ) : new cNumber( a );
				}
                return this.value = arg0;
            }
            r.getInfo = function(){
                return {
                    name:this.name,
                    args:"( number )"
                };
            }
        	return r;
		},
        'SQRTPI' : function(){
            var r = new cBaseFunction();
            r.setName("SQRTPI");
			r.setArgumentsMin(1);
            r.setArgumentsMax(1);
			r.Calculate = function(arg){
				var arg0 = arg[0];
				if( arg0 instanceof cArea || arg0 instanceof cArea3D ){
					arg0 = arg0.cross(arguments[1].first);
				}
                arg0 = arg0.tocNumber();
				if( arg0 instanceof cError )
					return this.value = arg0;
				else if( arg0 instanceof cArray ){
					arg0.foreach(function(elem,r,c){
						if( elem instanceof cNumber ){
							var a = Math.sqrt( elem.getValue() * Math.PI );
							this.array[r][c] = isNaN( a ) ? new cError( cErrorType.not_numeric ) : new cNumber( a );
						}
						else{
							this.array[r][c] = new cError( cErrorType.wrong_value_type );
						}
					})
				}
				else {
					var a = Math.sqrt( arg0.getValue() * Math.PI );
					return this.value = isNaN( a ) ? new cError( cErrorType.not_numeric ) : new cNumber( a );
				}
                return this.value = arg0;
            }
            r.getInfo = function(){
                return {
                    name:this.name,
                    args:"( number )"
                };
            }
        	return r;
		},
        'SUBTOTAL' : function(){
            var r = new cBaseFunction();
            r.setName("SUBTOTAL");
        	return r;
		},
        'SUM' : function(){
			var r = new cBaseFunction(this);
		    r.setName("SUM");
			r.setArgumentsMin(1);
            r.setArgumentsMax(255);
            r.Calculate = function(arg){
                var arg0 = new cNumber(0), _aVal = null;
                for(var i = 0; i < arg.length; i++){
                    if(arg[i] instanceof cArea || arg[i] instanceof cArea3D){
                        var _arrVal = arg[i].getValue();
                        for (var j = 0 ; j < _arrVal.length; j++){
							if( !(_arrVal[j] instanceof cBool || _arrVal[j] instanceof cString) )
								arg0 = _func[arg0.type][_arrVal[j].type](arg0,_arrVal[j],"+")
                            if( arg0 instanceof cError)
                                return this.value = arg0;
                        }
                    }
                    else if( arg[i] instanceof cRef || arg[i] instanceof cRef3D ){
                        var _arg = arg[i].getValue();
						if( !(_arg instanceof cBool || _arg instanceof cString) )
							arg0 = _func[arg0.type][_arg.type](arg0,_arg,"+");
                    }
					else if( arg[i] instanceof cArray ){
						arg[i].foreach(
							function(arrElem){
								if( !(arrElem instanceof cBool || arrElem instanceof cString || arrElem instanceof cEmpty) )
									arg0 = _func[arg0.type][arrElem.type](arg0,arrElem,"+");
							}
						)
					}
                    else{
						var _arg = arg[i].tocNumber();
                        arg0 = _func[arg0.type][_arg.type](arg0,_arg,"+");
                    }
                    if( arg0 instanceof cError)
                        return this.value = arg0;

                }
                return this.value = arg0;
            };
            r.getInfo = function(){
                return {
                    name:this.name,
                    args:"(number1, number2, ...)"
                };
            }
			return r;
		},
        'SUMIF' : function(){
            var r = new cBaseFunction();
            r.setName("SUMIF");
			r.setArgumentsMin(2);
            r.setArgumentsMax(3);
			r.Calculate = function(arg){
				var arg0 = arg[0], arg1 = arg[1], arg2 = arg[2] ? arg[2] : arg[0], _count = 0, valueForSearching, regexpSearch;
				if( !(arg0 instanceof cRef || arg0 instanceof cRef3D || arg0 instanceof cArea) ){
					return this.value = new cError( cErrorType.wrong_value_type );
				}
				
				if( !(arg2 instanceof cRef || arg2 instanceof cRef3D || arg2 instanceof cArea) ){
					return this.value = new cError( cErrorType.wrong_value_type );
				}

                if ( arg1 instanceof cArea || arg1 instanceof cArea3D ){
					arg1 = arg1.cross(arguments[1].first);
				}
				else if( arg1 instanceof cArray ){
					arg1 = arg1.getElementRowCol(0,0);
				}

				arg1 = arg1.tocString();

				if( !(arg1 instanceof cString) ){
					return this.value = new cError( cErrorType.wrong_value_type );
				}

				function matching(x, y, oper, startCell, pos){
					var res = false;
					if( typeof x === typeof y ){
						switch(oper){
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

				arg1 = arg1.toString();
				var operators = new RegExp("^ *[<=> ]+ *"), searchOperators = new RegExp("^ *[*?]")
				var match = arg1.match(operators);
				if( match || parseNum(arg1) ){

					var search, oper, val, calcVal;
					if( match ){
						search = arg1.substr( match[0].length );
						oper = match[0].replace(/\s/g,"");
					}
					else{
						search = arg1;
					}
					valueForSearching = parseNum( search ) ? new cNumber( search ) : new cString( search );
					if( arg0 instanceof cArea ){
						val = arg0.getValue();
						for( var i = 0; i < val.length; i++ ){
							if( matching( val[i], valueForSearching, oper) ){
								var r = arg0.getRange(), ws = arg0.getWS(),
									r1 = r.first.getRow0() + i, c1 =  arg2.getRange().first.getCol0();
								r = new cRef(ws.getRange3( r1, c1, r1, c1).getName(),ws);
								if( r.getValue() instanceof cNumber ){
									_count += r.getValue().getValue();
								}
							}
						}
					}
					else{
						val = arg0.getValue();
						if( matching( val, valueForSearching, oper) ){
							var r = arg0.getRange(), ws = arg0.getWS(),
								r1 = r.first.getRow0() + 0, c1 =  arg2.getRange().first.getCol0();
							r = new cRef(ws.getRange3( r1, c1, r1, c1).getName(),ws);
							if( r.getValue() instanceof cNumber ){
								_count += r.getValue().getValue();
							}
						}
					}
				}
				else{
					valueForSearching = arg1
											.replace(/(~)?\*/g, function($0, $1){
												return $1 ? $0 : '[\\w\\W]*';
											})
											.replace(/(~)?\?/g, function($0, $1){
												return $1 ? $0 : '[\\w\\W]{1,1}';
											})
											.replace(/\~/g, "\\");
					regexpSearch = new RegExp(valueForSearching+"$","i");
					if( arg0 instanceof cArea ){
						val = arg0.getValue();
						for( var i = 0; i < val.length; i++ ){
							if( regexpSearch.test(val[i].value) ){
								var r = arg0.getRange(), ws = arg0.getWS(),
									r1 = r.first.getRow0() + i, c1 =  arg2.getRange().first.getCol0();
								r = new cRef(ws.getRange3( r1, c1, r1, c1).getName(),ws);
								if( r.getValue() instanceof cNumber ){
									_count += r.getValue().getValue();
								}
							}
						}
					}
					else{
						val = arg0.getValue();
						if( regexpSearch.test(val.value) ){
							var r = arg0.getRange(), ws = arg0.getWS(),
								r1 = r.first.getRow0() + 0, c1 =  arg2.getRange().first.getCol0();
							r = new cRef(ws.getRange3( r1, c1, r1, c1).getName(),ws);
							if( r.getValue() instanceof cNumber ){
								_count += r.getValue().getValue();
							}
						}
					}
				}

				return this.value = new cNumber(_count);
			}
			r.getInfo = function(){
                return {
                    name:this.name,
                    args:"( cell-range, selection-criteria )"
                };
            }
        	return r;
		},
        'SUMIFS' : function(){
            var r = new cBaseFunction();
            r.setName("SUMIFS");
        	return r;
		},
        'SUMPRODUCT' : function(){
            var r = new cBaseFunction();
            r.setName("SUMPRODUCT");
        	return r;
		},
        'SUMSQ' : function(){
            var r = new cBaseFunction();
            r.setName("SUMSQ");
        	return r;
		},
        'SUMX2MY2' : function(){
            var r = new cBaseFunction();
            r.setName("SUMX2MY2");
        	return r;
		},
        'SUMX2PY2' : function(){
            var r = new cBaseFunction();
            r.setName("SUMX2PY2");
        	return r;
		},
        'SUMXMY2' : function(){
            var r = new cBaseFunction();
            r.setName("SUMXMY2");
        	return r;
		},
        'TAN' : function(){
            var r = new cBaseFunction();
            r.setName("TAN");
			r.setArgumentsMin(1);
            r.setArgumentsMax(1);
            r.Calculate = function(arg){
				var arg0 = arg[0];
				if( arg0 instanceof cArea || arg0 instanceof cArea3D ){
					arg0 = arg0.cross(arguments[1].first);
				}
                arg0 = arg0.tocNumber();
				if( arg0 instanceof cError )
					return this.value = arg0;
				else if( arg0 instanceof cArray ){
					arg0.foreach(function(elem,r,c){
						if( elem instanceof cNumber ){
							var a = Math.tan( elem.getValue() );
							this.array[r][c] = isNaN( a ) ? new cError( cErrorType.not_numeric ) : new cNumber( a );
						}
						else{
							this.array[r][c] = new cError( cErrorType.wrong_value_type );
						}
					})
				}
				else {
					var a = Math.tan( arg0.getValue() );
					return this.value = isNaN( a ) ? new cError( cErrorType.not_numeric ) : new cNumber( a );
				}
                return this.value = arg0;
            };
            r.getInfo = function(){
                return {
                    name:this.name,
                    args:"(number)"
                };
            }
        	return r;
		},
        'TANH' : function(){
            var r = new cBaseFunction();
            r.setName("TANH");
        	return r;
		},
        'TRUNC' : function(){
            var r = new cBaseFunction();
            r.setName("TRUNC");
        	return r;
		}
    },
    Statistical:{
        'groupName' : "Statistical",
        'AVEDEV' : function(){
            var r = new cBaseFunction();
            r.setName("AVEDEV");
        	return r;
		},
        'AVERAGE' : function(){
            var r = new cBaseFunction();
			r.setName("AVERAGE");
			r.setArgumentsMin(1);
            r.setArgumentsMax(255);
            r.Calculate = function(arg){
                var count = 0, sum = new cNumber(0);
                for ( var i = 0; i < arg.length; i++){
                    var _arg = arg[i];
                    if( _arg instanceof cRef || _arg instanceof cRef3D){
                        var _argV = _arg.getValue();
                        if ( _argV instanceof cNumber ){
                            sum = _func[sum.type][_argV.type](sum,_argV,"+");
                            count++;
                        }
                    }
                    else if ( _arg instanceof cArea || _arg instanceof cArea3D){
                        var _argAreaValue = _arg.getValue();
                        for ( var j = 0; j < _argAreaValue.length; j++){
                            var __arg = _argAreaValue[j];
                            if ( __arg instanceof cNumber ){
                                sum = _func[sum.type][__arg.type](sum,__arg,"+");
                                count++;
                            }
                        }
                    }
					else if( _arg instanceof cArray ){
						_arg.foreach(function(elem){
							var e = elem.tocNumber();
							if( e instanceof cNumber ){
								sum = _func[sum.type][e.type](sum,e,"+");
								count++;
							}
						})
					}
                    else{
						if( _arg instanceof cError )
							continue;
                        sum = _func[sum.type][_arg.type](sum,_arg,"+");
                        count++;
                    }
                }
                return this.value = new cNumber (sum.getValue() / count);
            };
            r.getInfo = function(){
                return {
                    name:this.name,
                    args:"(number1, number2, ...)"
                };
            }
        	return r;
		},
        'AVERAGEA' : function(){
            var r = new cBaseFunction();
            r.setName("AVERAGEA");
        	return r;
		},
        'AVERAGEIF' : function(){
            var r = new cBaseFunction();
            r.setName("AVERAGEIF");
        	return r;
		},
        'AVERAGEIFS' : function(){
            var r = new cBaseFunction();
            r.setName("AVERAGEIFS");
        	return r;
		},
        'BETADIST' : function(){
            var r = new cBaseFunction();
            r.setName("BETADIST");
        	return r;
		},
        'BETAINV' : function(){
            var r = new cBaseFunction();
            r.setName("BETAINV");
        	return r;
		},
        'BINOMDIST' : function(){
            var r = new cBaseFunction();
            r.setName("BINOMDIST");
        	return r;
		},
        'CHIDIST' : function(){
            var r = new cBaseFunction();
            r.setName("CHIDIST");
        	return r;
		},
        'CHIINV' : function(){
            var r = new cBaseFunction();
            r.setName("CHIINV");
        	return r;
		},
        'CHITEST' : function(){
            var r = new cBaseFunction();
            r.setName("CHITEST");
        	return r;
		},
        'CONFIDENCE' : function(){
            var r = new cBaseFunction();
            r.setName("CONFIDENCE");
        	return r;
		},
        'CORREL' : function(){
            var r = new cBaseFunction();
            r.setName("CORREL");
        	return r;
		},
        'COUNT' : function(){
            var r = new cBaseFunction();
            r.setName("COUNT");
			r.setArgumentsMin(1);
            r.setArgumentsMax(255);
            r.Calculate = function(arg){
                var count = 0;
                for ( var i = 0; i < arg.length; i++){
                    var _arg = arg[i];
                    if( _arg instanceof cRef || _arg instanceof cRef3D){
                        var _argV = _arg.getValue();
                        if ( _argV instanceof cNumber ){
                            count++;
                        }
                    }
                    else if ( _arg instanceof cArea || _arg instanceof cArea3D){
                        var _argAreaValue = _arg.getValue();
                        for ( var j = 0; j < _argAreaValue.length; j++){
                            if ( _argAreaValue[j] instanceof cNumber ){
                                count++;
                            }
                        }
                    }
                    else if( _arg instanceof cNumber || _arg instanceof cBool || _arg instanceof cEmpty ){
                        count++;
                    }
                    else if( _arg instanceof cString ){
                        if (_arg.tocNumber() instanceof cNumber)
                            count++;
                    }
					else if( _arg instanceof cArray ){
						_arg.foreach(function(elem){
							var e = elem.tocNumber();
							if( e instanceof cNumber ){
								count++;
							}
						})
					}
                }
                return this.value = new cNumber( count );
            };
            r.getInfo = function(){
                return {
                    name:this.name,
                    args:"( argument-list )"
                };
            }
        	r.setFormat(r.formatType.noneFormat);
			return r;
		},
        'COUNTA' : function(){
            var r = new cBaseFunction();
            r.setName("COUNTA");
        	return r;
		},
        'COUNTBLANK' : function(){
            var r = new cBaseFunction();
            r.setName("COUNTBLANK");
			r.setArgumentsMin(1);
            r.setArgumentsMax(1);
            r.Calculate = function(arg){
				var arg0 = arg[0];
				if( arg0 instanceof cArea || arg0 instanceof cArea3D )
					return this.value = arg0.countCells();
				else if( arg0 instanceof cRef || arg0 instanceof cRef3D ){
					return this.value = new cNumber( 1 );
				}
				else
					return this.value = new cError( cErrorType.bad_reference );
			}
			r.getInfo = function(){
                return {
                    name:this.name,
                    args:"( argument-list )"
                };
            }
			r.setFormat(r.formatType.noneFormat);
        	return r;
		},
        'COUNTIF' : function(){
            var r = new cBaseFunction();
			r.setName("COUNTIF");
			r.setArgumentsMin(2);
            r.setArgumentsMax(2);
			r.Calculate = function(arg){
				var arg0 = arg[0], arg1 = arg[1], _count = 0, valueForSearching, regexpSearch;
				if( !(arg0 instanceof cRef || arg0 instanceof cRef3D || arg0 instanceof cArea || arg0 instanceof cArea3D) ){
					return this.value = new cError( cErrorType.wrong_value_type );
				}

                if ( arg1 instanceof cArea || arg1 instanceof cArea3D ){
					arg1 = arg1.cross(arguments[1].first);
				}
				else if( arg1 instanceof cArray ){
					arg1 = arg1.getElementRowCol(0,0);
				}

				arg1 = arg1.tocString();

				if( !(arg1 instanceof cString) ){
					return this.value = new cError( cErrorType.wrong_value_type );
				}

				function matching(x,y,oper){
					var res = 0;
					if( typeof x === typeof y ){
						switch(oper){
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
					_count += res;
				}

				arg1 = arg1.toString();
				var operators = new RegExp("^ *[<=> ]+ *"), searchOperators = new RegExp("^ *[*?]")
				var match = arg1.match(operators);
				if( match || parseNum(arg1) ){

					var search, oper, val;
					if( match ){
						search = arg1.substr( match[0].length );
						oper = match[0].replace(/\s/g,"");
					}
					else{
						search = arg1;
					}
					valueForSearching = parseNum( search ) ? new cNumber( search ) : new cString( search );
					if( arg0 instanceof cArea ){
						val = arg0.getValue();
						for( var i = 0; i < val.length; i++ ){
							matching( val[i], valueForSearching, oper);
						}
					}
					else if( arg0 instanceof cArea3D ){
						val = arg0.getValue();
						for(var i = 0; i < val.length; i++){
							matching( val[i], valueForSearching, oper);
						}
					}
					else{
						val = arg0.getValue();
						matching( val, valueForSearching, oper);
					}
				}
				else{
					match = arg1.match(searchOperators)
					if( match ){
						valueForSearching = arg1
												.replace(/(~)?\*/g, function($0, $1){
													return $1 ? $0 : '[\\w\\W]*';
												})
												.replace(/(~)?\?/g, function($0, $1){
													return $1 ? $0 : '[\\w\\W]{1,1}';
												})
												.replace(/\~/g, "\\");
						regexpSearch = new RegExp(valueForSearching+"$","i");
						if( arg0 instanceof cArea ){
							val = arg0.getValue();
							for( var i = 0; i < val.length; i++ ){
								_count += regexpSearch.test(val[i].value);
							}
						}
						else if( arg0 instanceof cArea3D ){
							val = arg0.getValue();
							for(var i in val){
								for(var j in val[i]){
									_count += regexpSearch.test(val[i][j].value);
								}
							}
						}
						else{
							val = arg0.getValue();
							_count += regexpSearch.test(val.value);
						}
					}
				}

				return this.value = new cNumber(_count);
			}
			r.getInfo = function(){
                return {
                    name:this.name,
                    args:"( cell-range, selection-criteria )"
                };
            }
        	return r;
		},
        'COUNTIFS' : function(){
            var r = new cBaseFunction();
            r.setName("COUNTIFS");
        	return r;
		},
        'COVAR' : function(){
            var r = new cBaseFunction();
            r.setName("COVAR");
        	return r;
		},
        'CRITBINOM' : function(){
            var r = new cBaseFunction();
            r.setName("CRITBINOM");
        	return r;
		},
        'DEVSQ' : function(){
            var r = new cBaseFunction();
            r.setName("DEVSQ");
        	return r;
		},
        'EXPONDIST' : function(){
            var r = new cBaseFunction();
            r.setName("EXPONDIST");
        	return r;
		},
        'FDIST' : function(){
            var r = new cBaseFunction();
            r.setName("FDIST");
        	return r;
		},
        'FINV' : function(){
            var r = new cBaseFunction();
            r.setName("FINV");
        	return r;
		},
        'FISHER' : function(){
            var r = new cBaseFunction();
            r.setName("FISHER");
        	return r;
		},
        'FISHERINV' : function(){
            var r = new cBaseFunction();
            r.setName("FISHERINV");
        	return r;
		},
        'FORECAST' : function(){
            var r = new cBaseFunction();
            r.setName("FORECAST");
        	return r;
		},
        'FREQUENCY' : function(){
            var r = new cBaseFunction();
            r.setName("FREQUENCY");
        	return r;
		},
        'FTEST' : function(){
            var r = new cBaseFunction();
            r.setName("FTEST");
        	return r;
		},
        'GAMMADIST' : function(){
            var r = new cBaseFunction();
            r.setName("GAMMADIST");
        	return r;
		},
        'GAMMAINV' : function(){
            var r = new cBaseFunction();
            r.setName("GAMMAINV");
        	return r;
		},
        'GAMMALN' : function(){
            var r = new cBaseFunction();
            r.setName("GAMMALN");
        	return r;
		},
        'GEOMEAN' : function(){
            var r = new cBaseFunction();
            r.setName("GEOMEAN");
        	return r;
		},
        'GROWTH' : function(){
            var r = new cBaseFunction();
            r.setName("GROWTH");
        	return r;
		},
        'HARMEAN' : function(){
            var r = new cBaseFunction();
            r.setName("HARMEAN");
        	return r;
		},
        'HYPGEOMDIST' : function(){
            var r = new cBaseFunction();
            r.setName("HYPGEOMDIST");
        	return r;
		},
        'INTERCEPT' : function(){
            var r = new cBaseFunction();
            r.setName("INTERCEPT");
        	return r;
		},
        'KURT' : function(){
            var r = new cBaseFunction();
            r.setName("KURT");
        	return r;
		},
        'LARGE' : function(){
            var r = new cBaseFunction();
            r.setName("LARGE");
        	return r;
		},
        'LINEST' : function(){
            var r = new cBaseFunction();
            r.setName("LINEST");
        	return r;
		},
        'LOGEST' : function(){
            var r = new cBaseFunction();
            r.setName("LOGEST");
        	return r;
		},
        'LOGINV' : function(){
            var r = new cBaseFunction();
            r.setName("LOGINV");
        	return r;
		},
        'LOGNORMDIST' : function(){
            var r = new cBaseFunction();
            r.setName("LOGNORMDIST");
        	return r;
		},
        'MAX' : function(){
            var r = new cBaseFunction();
            r.setName("MAX");
			r.setArgumentsMin(1);
            r.setArgumentsMax(255);
            r.Calculate = function(arg){
                var argI, argIVal, max = new cNumber ( Number.NEGATIVE_INFINITY );
                for ( var i = 0; i < this.argumentsCurrent; i++ ){
                    argI = arg[i], argIVal = argI.getValue();
                    if ( argI instanceof cRef || argI instanceof cRef3D ){
                        if( argIVal instanceof cError )
                            return this.value = argIVal;
                        if( argIVal instanceof cNumber || argIVal instanceof cBool || argIVal instanceof cEmpty){
							var v = argIVal.tocNumber();
                            if ( v.getValue() > max.getValue() )
                                max = v;
                        }
                    }
                    else if ( argI instanceof cArea || argI instanceof cArea3D ){
                        var argArr = argI.getValue();
                        for( var j = 0; j < argArr.length; j++ ){
                            if ( argArr[j] instanceof cNumber || argArr[j] instanceof cBool || argArr[j] instanceof cEmpty){
								var v = argArr[j].tocNumber();
                                if ( v.getValue() > max.getValue() )
                                    max = v;
                            }
                            else if ( argArr[j] instanceof cError ){
                                return this.value = argArr[j];
                            }
                        }
                    }
                    else if( argI instanceof cError )
                        return this.value = argI;
                    else if ( argI instanceof cString ){
                        var v = argI.tocNumber();
                        if ( v instanceof cNumber )
                            if ( v.getValue() > max.getValue() )
                                max = v;
                    }
                    else if ( argI instanceof cBool || argI instanceof cEmpty ){
                        var v = argI.tocNumber();
                        if ( v.getValue() > max.getValue() )
                            max = v;
                    }
					else if( argI instanceof cArray ){
						argI.foreach(function(elem){
							if( elem instanceof cNumber ){
								if ( elem.getValue() > max.getValue() )
									max = elem;
							}
							else if( elem instanceof cError ){
								max = elem;
								return true;
							}
						})
						if( max instanceof cError ){
							return this.value = max;
						}
					}
                    else{
                        if ( argI.getValue() > max.getValue() )
                            max = argI;
                    }
                }
                return this.value = ( max.value === Number.NEGATIVE_INFINITY ? new cNumber(0) : max );
            };
            r.getInfo = function(){
                return {
                    name:this.name,
                    args:"(number1, number2, ...)"
                };
            }
        	return r;
		},
        'MAXA' : function(){
            var r = new cBaseFunction();
            r.setName("MAXA");
			r.setArgumentsMin(1);
            r.setArgumentsMax(255);
			r.Calculate = function(arg){
                var argI, max = new cNumber ( Number.NEGATIVE_INFINITY );
                for ( var i = 0; i < this.argumentsCurrent; i++ ){
                    argI = arg[i], argIVal = argI.getValue();
                    if ( argI instanceof cRef || argI instanceof cRef3D ){

						if( argIVal instanceof cError )
                            return this.value = argIVal;

						var v = argIVal.tocNumber();

						if ( v instanceof cNumber && v.getValue() > max.getValue() )
							max = v;
                    }
                    else if ( argI instanceof cArea || argI instanceof cArea3D ){
                        var argArr = argI.getValue();
                        for( var j = 0; j < argArr.length; j++ ){

							if( argArr[j] instanceof cError )
								return this.value = argArr[j];

							var v = argArr[j].tocNumber();

							if ( v instanceof cNumber && v.getValue() > max.getValue() )
								max = v;
                        }
                    }
                    else if( argI instanceof cError )
                        return this.value = argI;
                    else if ( argI instanceof cString ){
                        var v = argI.tocNumber();
                        if ( v instanceof cNumber )
                            if ( v.getValue() > max.getValue() )
                                max = v;
                    }
                    else if ( argI instanceof cBool || argI instanceof cEmpty ){
                        var v = argI.tocNumber();
                        if ( v.getValue() > max.getValue() )
                            max = v;
                    }
					else if( argI instanceof cArray ){
						argI.foreach(function(elem){
							if( elem instanceof cError ){
								max = elem;
								return true;
							}
							elem = elem.tocNumber();

							if( elem instanceof cNumber && elem.getValue() > max.getValue() ){
								max = elem;
							}
						})
						if( max instanceof cError ){
							return this.value = max;
						}
					}
                    else{
                        if ( argI.getValue() > max.getValue() )
                            max = argI;
                    }
                }
                return this.value = ( max.value === Number.NEGATIVE_INFINITY ? new cNumber(0) : max )
            };
			r.getInfo = function(){
                return {
                    name:this.name,
                    args:"(number1, number2, ...)"
                };
            }
        	return r;
		},
        'MEDIAN' : function(){
            var r = new cBaseFunction();
            r.setName("MEDIAN");
        	return r;
		},
        'MIN' : function(){
            var r = new cBaseFunction();
            r.setName("MIN");
			r.setArgumentsMin(1);
            r.setArgumentsMax(255);
            r.Calculate = function(arg){
                var argI, argIVal, min = new cNumber ( Number.POSITIVE_INFINITY );
                for ( var i = 0; i < this.argumentsCurrent; i++ ){
                    argI = arg[i], argIVal = argI.getValue();
                    if ( argI instanceof cRef || argI instanceof cRef3D ){
                        if( argIVal instanceof cError )
                            return this.value = argIVal;
                        if( argIVal instanceof cNumber || argIVal instanceof cBool || argIVal instanceof cEmpty){
							var v = argIVal.tocNumber();
                            if ( v.getValue() < min.getValue() )
                                min = v;
                        }
                    }
                    else if ( argI instanceof cArea || argI instanceof cArea3D ){
                        var argArr = argI.getValue();
                        for( var j = 0; j < argArr.length; j++ ){
                            if ( argArr[j] instanceof cNumber || argArr[j] instanceof cBool || argArr[j] instanceof cEmpty){
								var v = argArr[j].tocNumber();
                                if ( v.getValue() < min.getValue() )
                                    min = v;
                                continue;
                            }
                            else if ( argArr[j] instanceof cError ){
                                return this.value = argArr[j];
                            }
                        }
                    }
                    else if( argI instanceof cError )
                        return this.value = argI;
                    else if ( argI instanceof cString ){
                        var v = argI.tocNumber();
                        if ( v instanceof cNumber )
                            if ( v.getValue() < min.getValue() )
                                min = v;
                    }
                    else if ( argI instanceof cBool || argI instanceof cEmpty){
                        var v = argI.tocNumber();
                        if ( v.getValue() < min.getValue() )
                            min = v;
                    }
					else if( argI instanceof cArray ){
						argI.foreach(function(elem){
							if( elem instanceof cNumber ){
								if ( elem.getValue() < min.getValue() )
									min = elem;
							}
							else if( elem instanceof cError ){
								min = elem;
								return true;
							}
						})
						if( min instanceof cError ){
							return this.value = min;
						}
					}
                    else{
                        if ( argI.getValue() < min.getValue() )
                            min = argI;
                    }
                }
                return this.value = ( min.value === Number.POSITIVE_INFINITY ? new cNumber(0) : min );
            };
            r.getInfo = function(){
                return {
                    name:this.name,
                    args:"(number1, number2, ...)"
                };
            }
        	return r;
		},
        'MINA' : function(){
            var r = new cBaseFunction();
            r.setName("MINA");
			r.setArgumentsMin(1);
            r.setArgumentsMax(255);
			r.Calculate = function(arg){
                var argI, min = new cNumber ( Number.POSITIVE_INFINITY );
                for ( var i = 0; i < this.argumentsCurrent; i++ ){
                    argI = arg[i], argIVal = argI.getValue();
                    if ( argI instanceof cRef || argI instanceof cRef3D ){

						if( argIVal instanceof cError )
                            return this.value = argIVal;

						var v = argIVal.tocNumber();

						if ( v instanceof cNumber && v.getValue() < min.getValue() )
							min = v;
                    }
                    else if ( argI instanceof cArea || argI instanceof cArea3D ){
                        var argArr = argI.getValue();
                        for( var j = 0; j < argArr.length; j++ ){

							if ( argArr[j] instanceof cError ){
								return this.value = argArr[j];
							}

							var v = argArr[j].tocNumber();

							if ( v instanceof cNumber && v.getValue() < min.getValue() )
								min = v;
                        }
                    }
                    else if( argI instanceof cError )
                        return this.value = argI;
                    else if ( argI instanceof cString ){
                        var v = argI.tocNumber();
                        if ( v instanceof cNumber )
                            if ( v.getValue() < min.getValue() )
                                min = v;
                    }
                    else if ( argI instanceof cBool || argI instanceof cEmpty ){
                        var v = argI.tocNumber();
                        if ( v.getValue() < min.getValue() )
                            min = v;
                    }
					else if( argI instanceof cArray ){
						argI.foreach(function(elem){
							if( elem instanceof cError ){
								min = elem;
								return true;
							}

							elem = elem.tocNumber();

							if( elem instanceof cNumber && elem.getValue() < min.getValue() ){
								min = elem;
							}
						})
						if( min instanceof cError ){
							return this.value = min;
						}
					}
                    else{
                        if ( argI.getValue() < min.getValue() )
                            min = argI;
                    }
                }
                return this.value = ( min.value === Number.POSITIVE_INFINITY ? new cNumber(0) : min );
            };
			r.getInfo = function(){
                return {
                    name:this.name,
                    args:"(number1, number2, ...)"
                };
            }
        	return r;
		},
        'MODE' : function(){
            var r = new cBaseFunction();
            r.setName("MODE");
        	return r;
		},
        'NEGBINOMDIST' : function(){
            var r = new cBaseFunction();
            r.setName("NEGBINOMDIST");
        	return r;
		},
        'NORMDIST' : function(){
            var r = new cBaseFunction();
            r.setName("NORMDIST");
        	return r;
		},
        'NORMINV' : function(){
            var r = new cBaseFunction();
            r.setName("NORMINV");
        	return r;
		},
        'NORMSDIST' : function(){
            var r = new cBaseFunction();
            r.setName("NORMSDIST");
        	return r;
		},
        'NORMSINV' : function(){
            var r = new cBaseFunction();
            r.setName("NORMSINV");
        	return r;
		},
        'PEARSON' : function(){
            var r = new cBaseFunction();
            r.setName("PEARSON");
        	return r;
		},
        'PERCENTILE' : function(){
            var r = new cBaseFunction();
            r.setName("PERCENTILE");
        	return r;
		},
        'PERCENTRANK' : function(){
            var r = new cBaseFunction();
            r.setName("PERCENTRANK");
        	return r;
		},
        'PERMUT' : function(){
            var r = new cBaseFunction();
            r.setName("PERMUT");
        	return r;
		},
        'POISSON' : function(){
            var r = new cBaseFunction();
            r.setName("POISSON");
        	return r;
		},
        'PROB' : function(){
            var r = new cBaseFunction();
            r.setName("PROB");
        	return r;
		},
        'QUARTILE' : function(){
            var r = new cBaseFunction();
            r.setName("QUARTILE");
        	return r;
		},
        'RANK' : function(){
            var r = new cBaseFunction();
            r.setName("RANK");
        	return r;
		},
        'RSQ' : function(){
            var r = new cBaseFunction();
            r.setName("RSQ");
        	return r;
		},
        'SKEW' : function(){
            var r = new cBaseFunction();
            r.setName("SKEW");
        	return r;
		},
        'SLOPE' : function(){
            var r = new cBaseFunction();
            r.setName("SLOPE");
        	return r;
		},
        'SMALL' : function(){
            var r = new cBaseFunction();
            r.setName("SMALL");
        	return r;
		},
        'STANDARDIZE' : function(){
            var r = new cBaseFunction();
            r.setName("STANDARDIZE");
        	return r;
		},
        'STDEV' : function(){
            var r = new cBaseFunction();
            r.setName("STDEV");
			r.setArgumentsMin(1);
            r.setArgumentsMax(255);
            r.Calculate = function(arg){
                var count = 0, sum = new cNumber(0), member = [];
                for ( var i = 0; i < arg.length; i++){
                    var _arg = arg[i];
                    if( _arg instanceof cRef || _arg instanceof cRef3D){
                        var _argV = _arg.getValue();
                        if ( _argV instanceof cNumber ){
							member.push(_argV);
                            sum = _func[sum.type][_argV.type](sum,_argV,"+");
                            count++;
                        }
                    }
                    else if ( _arg instanceof cArea || _arg instanceof cArea3D){
                        var _argAreaValue = _arg.getValue();
                        for ( var j = 0; j < _argAreaValue.length; j++){
                            var __arg = _argAreaValue[j];
                            if ( __arg instanceof cNumber ){
								member.push(__arg);
                                sum = _func[sum.type][__arg.type](sum,__arg,"+");
                                count++;
                            }
                        }
                    }
					else if( _arg instanceof cArray ){
						_arg.foreach(function(elem){
							var e = elem.tocNumber();
							if( e instanceof cNumber ){
								member.push(e);
								sum = _func[sum.type][e.type](sum,e,"+");
								count++;
							}
						})
					}
                    else{
						_arg = _arg.tocNumber();
						if( _arg instanceof cNumber ){
							member.push(_arg);
							sum = _func[sum.type][_arg.type](sum,_arg,"+");
							count++;
						}
                    }
                }
				var average = sum.getValue() / count, res = 0, av;
				for( var i = 0; i < member.length; i++ ){
					av =  member[i] - average;
					res += av * av;
				}
                return this.value = new cNumber ( Math.sqrt(res / (count-1)) );STDEV(123,134,143,173,112,109)
            };
			r.getInfo = function(){
                return {
                    name:this.name,
                    args:"( argument-list )"
                };
            }
			r.setFormat(r.formatType.noneFormat);
        	return r;
		},
        'STDEVA' : function(){
            var r = new cBaseFunction();
            r.setName("STDEVA");
        	return r;
		},
        'STDEVP' : function(){
            var r = new cBaseFunction();
            r.setName("STDEVP");
        	return r;
		},
        'STDEVPA' : function(){
            var r = new cBaseFunction();
            r.setName("STDEVPA");
        	return r;
		},
        'STEYX' : function(){
            var r = new cBaseFunction();
            r.setName("STEYX");
        	return r;
		},
        'TDIST' : function(){
            var r = new cBaseFunction();
            r.setName("TDIST");
        	return r;
		},
        'TINV' : function(){
            var r = new cBaseFunction();
            r.setName("TINV");
        	return r;
		},
        'TREND' : function(){
            var r = new cBaseFunction();
            r.setName("TREND");
        	return r;
		},
        'TRIMMEAN' : function(){
            var r = new cBaseFunction();
            r.setName("TRIMMEAN");
        	return r;
		},
        'TTEST' : function(){
            var r = new cBaseFunction();
            r.setName("TTEST");
        	return r;
		},
        'VAR' : function(){
            var r = new cBaseFunction();
            r.setName("VAR");
        	return r;
		},
        'VARA' : function(){
            var r = new cBaseFunction();
            r.setName("VARA");
        	return r;
		},
        'VARP' : function(){
            var r = new cBaseFunction();
            r.setName("VARP");
        	return r;
		},
        'VARPA' : function(){
            var r = new cBaseFunction();
            r.setName("VARPA");
        	return r;
		},
        'WEIBULL' : function(){
            var r = new cBaseFunction();
            r.setName("WEIBULL");
        	return r;
		},
        'ZTEST' : function(){
            var r = new cBaseFunction();
            r.setName("ZTEST");
        	return r;
		}
    },
    TextAndData:{
        'groupName' : "TextAndData",
        'ASC' : function(){
            var r = new cBaseFunction();
            r.setName("ASC");
        	return r;
		},
        'BAHTTEXT' : function(){
            var r = new cBaseFunction();
            r.setName("BAHTTEXT");
        	return r;
		},
        'CHAR' : function(){
            var r = new cBaseFunction();
            r.setName("CHAR");
			r.setArgumentsMin(1);
            r.setArgumentsMax(1);
            r.Calculate = function(arg){
				var arg0 = arg[0];

				if( arg0 instanceof cArea || arg0 instanceof cArea3D ){
					arg0 = arg0.cross(arguments[1].first).tocNumber();
				}
				else if( arg0 instanceof cArray){
					var ret = new cArray();
					arg0.foreach(function(elem,r,c){
						var _elem = elem.tocNumber();
						if(!ret.array[r])
							ret.addRow();

						if( _elem instanceof cError )
							ret.addElement(_elem);
						else
							ret.addElement( new cString( String.fromCharCode(_elem.getValue()) ) );
					})
					return this.value = ret;
				}

				arg0 = arg0.tocNumber();

				if( arg0 instanceof cError ){
					return this.value = arg0;
				}

				return this.value = new cString( String.fromCharCode(arg0.getValue()) );
			}
			r.getInfo = function(){
                return {
                    name:this.name,
                    args:"( number )"
                };
            }
        	return r;
		},
        'CLEAN' : function(){
            var r = new cBaseFunction();
            r.setName("CLEAN");
			r.setArgumentsMin(1);
            r.setArgumentsMax(1);
            r.Calculate = function(arg){
				var arg0 = arg[0];

				if( arg0 instanceof cArea || arg0 instanceof cArea3D ){
					arg0 = arg0.cross(arguments[1].first).tocNumber();
				}
				if( arg0 instanceof cArray ){
					arg0 = arg0.getElementRowCol(0,0);
				}

				arg0 = arg0.tocString();

				var v = arg0.getValue(), l = v.length, res = "";

				for( var i = 0; i < l; i++){
					if( v.charCodeAt(i) > 0x1f )
						res+=v[i];
				}

				return this.value = new cString( res );
			}
			r.getInfo = function(){
                return {
                    name:this.name,
                    args:"( string )"
                };
            }
        	return r;
		},
        'CODE' : function(){
            var r = new cBaseFunction();
			r.setName("CODE");
			r.setArgumentsMin(1);
            r.setArgumentsMax(1);
            r.Calculate = function(arg){
				var arg0 = arg[0];

				if( arg0 instanceof cArea || arg0 instanceof cArea3D ){
					arg0 = arg0.cross(arguments[1].first).tocString();
				}
				else if( arg0 instanceof cArray){
					var ret = new cArray();
					arg0.foreach(function(elem,r,c){
						var _elem = elem.tocString();
						if(!ret.array[r])
							ret.addRow();

						if( _elem instanceof cError )
							ret.addElement(_elem);
						else
							ret.addElement(new cNumber( _elem.toString().charCodeAt() ));
					})
					return this.value = ret;
				}

				arg0 = arg0.tocString();

				if( arg0 instanceof cError ){
					return this.value = arg0;
				}

				return this.value = new cNumber( arg0.toString().charCodeAt() );
			}
			r.getInfo = function(){
                return {
                    name:this.name,
                    args:"( string )"
                };
            }
        	return r;
		},
        'CONCATENATE' : function(){
            var r = new cBaseFunction();
            r.setName("CONCATENATE");
			r.setArgumentsMin(1);
            r.setArgumentsMax(255);
            r.Calculate = function(arg){
                var arg0 = new cString(""), argI;
                for(var i = 0; i < this.argumentsCurrent; i++){
                    argI = arg[i];
					if( argI instanceof cArea || argI instanceof cArea3D ){
						argI = argI.cross(arguments[1].first);
					}
                    argI = argI.tocString();
                    if (argI instanceof cError) {
						return this.value = argI;
					}
					else if( argI instanceof cArray ){
						argI.foreach(function(elem){
							if( elem instanceof cError ){
								arg0 = elem;
								return true;
							}

							arg0 = new cString( arg0.toString().concat( elem.toString() ) );

						})
						if( arg0 instanceof cError ){
							return this.value = arg0;
						}
					}
					else
						arg0 = new cString( arg0.toString().concat( argI.toString() ) );
                }
                return this.value = arg0;
            };
            r.getInfo = function(){
                return {
                    name:this.name,
                    args:"(text1, text2, ...)"
                };
            }
        	return r;
		},
        'DOLLAR' : function(){
            var r = new cBaseFunction();
            r.setName("DOLLAR");
			r.setArgumentsMin(1);
            r.setArgumentsMax(2);
			r.Calculate = function(arg){
				var res = cFormulaFunction.TextAndData["FIXED"]().Calculate(arg);
				if( res instanceof cError )
					return this.value =  res;

				return this.value = new cString("$"+res.getValue());
			}
			r.getInfo = function(){
                return {
                    name:this.name,
                    args:"( number [ , num-decimal ] )"
                };
            }
        	return r;
		},
        'EXACT' : function(){
            var r = new cBaseFunction();
            r.setName("EXACT");
			r.setArgumentsMin(2);
            r.setArgumentsMax(2);
            r.Calculate = function(arg){
				var arg0 = arg[0], arg1 = arg[1];
				if( arg0 instanceof cArea || arg0 instanceof cArea3D ){
					arg0 = arg0.cross(arguments[1].first);
				}
				if( arg1 instanceof cArea || arg1 instanceof cArea3D ){
					arg1 = arg1.cross(arguments[1].first);
				}

                arg0 = arg0.tocString();
				arg1 = arg1.tocString();

				if( arg0 instanceof cArray && arg1 instanceof cArray ){
					arg0 = arg0.getElementRowCol(0,0);
					arg1 = arg1.getElementRowCol(0,0);
				}
				else if( arg0 instanceof cArray ){
					arg0 = arg0.getElementRowCol(0,0);
				}
				else if( arg1 instanceof cArray ){
					arg1 = arg1.getElementRowCol(0,0);
				}

                if ( arg0 instanceof cError )	return this.value = arg0;
                if ( arg1 instanceof cError )	return this.value = arg1;

                var arg0val = arg0.getValue(), arg1val = arg1.getValue();
                return this.value = new cBool( arg0val === arg1val );
            }
            r.getInfo = function(){
                return {
                    name:this.name,
                    args:"(text1, text2)"
                };
            }
        	return r;
		},
        'FIND' : function(){
            var r = new cBaseFunction();
            r.setName("FIND");
			r.setArgumentsMin(2);
            r.setArgumentsMax(3);
            r.Calculate = function(arg){
				var arg0 = arg[0], arg1 = arg[1], arg2 = this.getArguments() == 3 ? arg[2] : null, res, str, searchStr, pos = -1;

				if( arg0 instanceof cArea || arg0 instanceof cArea3D ){
					arg0 = arg0.cross(arguments[1].first);
				}
				if( arg1 instanceof cArea || arg1 instanceof cArea3D ){
					arg1 = arg1.cross(arguments[1].first);
				}

				arg0 = arg0.tocString();
				arg1 = arg1.tocString();

				if( arg2 !== null ){

					if( arg2 instanceof cArea || arg2 instanceof cArea3D ){
						arg2 = arg2.cross(arguments[1].first);
					}

					arg2 = arg2.tocNumber();
					if( arg2 instanceof cArray ){
						arg2 = arg1.getElementRowCol(0,0);
					}
					if ( arg2 instanceof cError )	return this.value = arg2;

					pos = arg2.getValue();
					pos = pos > 0 ? pos-1 : pos;
				}

				if( arg0 instanceof cArray ){
					arg0 = arg0.getElementRowCol(0,0);
				}
				if( arg1 instanceof cArray ){
					arg1 = arg1.getElementRowCol(0,0);
				}

				if ( arg0 instanceof cError )	return this.value = arg0;
                if ( arg1 instanceof cError )	return this.value = arg1;

				str = arg1.getValue();
				searchStr = arg0.getValue();

				if( arg2 ){

					if( pos > str.length || pos < 0 )
						return this.value = new cError( cErrorType.wrong_value_type );

					str = str.substring(pos);
					res = str.search( searchStr );
					if( res >= 0 )
						res += pos;
				}
				else
					res = str.search( searchStr );

				if( res < 0 )
					return this.value = new cError( cErrorType.wrong_value_type );

				return this.value = new cNumber( res+1 );

			}
			r.getInfo = function(){
                return {
                    name:this.name,
                    args:"( string-1 , string-2 [ , start-pos ] )"
                };
            }
        	return r;
		},
        'FINDB' : function(){
            var r = cFormulaFunction.TextAndData["FIND"]()
            r.setName("FINDB");
        	return r;
		},
        'FIXED' : function(){
            var r = new cBaseFunction();
            r.setName("FIXED");
			r.setArgumentsMin(1);
            r.setArgumentsMax(3);
			r.Calculate = function(arg){

				function SignZeroPositive(number){
					return number < 0 ? -1 : 1;
				}
				function truncate(n) {
					return Math[n > 0 ? "floor" : "ceil"](n);
				}
				function sign(n){
					return n == 0 ? 0 :	n < 0 ? -1 : 1
				}
				function Floor(number, significance){
					var quotient = number / significance;
					if (quotient == 0){
						return 0;
					}
					var nolpiat = 5 * sign(quotient) * Math.pow(10, Math.floor( Math.log ( Math.abs(quotient) ) / Math.log ( 10 ) ) - cExcelSignificantDigits);
					return truncate(quotient + nolpiat) * significance;
				}
				function roundHelper(number,num_digits){
					if(num_digits > cExcelMaxExponent){
						if (Math.abs(number) < 1 || num_digits < 1e10) // The values are obtained experimentally
						{
							return new cNumber(number);
						}
						return new cNumber(0);
					}
					else if (num_digits < cExcelMinExponent)
					{
						if (Math.abs(number) < 0.01) // The values are obtained experimentally
						{
							return new cNumber(number);
						}
						return new cNumber(0);
					}

					var significance = SignZeroPositive(number) * Math.pow(10, -truncate(num_digits));

					number += significance / 2;

					if ( number/significance == Infinity){
						return new cNumber( number );
					}

					return new cNumber( Floor(number, significance) );
				}
				function toFix(str,skip){
					var res, _int, _dec, _tmp = ""

					if(skip)
						return str;

					res = str.split(".");
					_int = res[0];

					if( res.length == 2)
						_dec = res[1];

					_int = _int.split("").reverse().join("").match(/([^]{1,3})/ig)

					for( var i = _int.length-1; i >= 0; i--){
						_tmp += _int[i].split("").reverse().join("");
						if( i != 0 )
							_tmp += ",";
					}

					if( undefined != _dec)
						while( _dec.length < arg1.getValue() ) _dec+="0";

					return "" + _tmp + ( res.length == 2 ? "."+_dec+"" : "");
				}
                var arg0 = arg[0],
					arg1 = arg[1] ? arg[1] : new cNumber(2),
					arg2 = arg[2] ? arg[2] : new cBool(false);

				if( arg0 instanceof cArea || arg0 instanceof cArea3D ){
					arg0 = arg0.cross(arguments[1].first);
				}
				if( arg1 instanceof cArea || arg1 instanceof cArea3D ){
					arg1 = arg1.cross(arguments[1].first);
				}
				if( arg2 instanceof cArea || arg2 instanceof cArea3D ){
					arg2 = arg2.cross(arguments[1].first);
				}

				if( arg0 instanceof cError ) return this.value = arg0;
                if( arg1 instanceof cError ) return this.value = arg1;
                if( arg2 instanceof cError ) return this.value = arg2;

                if( arg0 instanceof cRef || arg0 instanceof cRef3D ){
                    arg0 = arg0.getValue();
                    if(arg0 instanceof cError) return this.value = arg0;
                    else if(arg0 instanceof cString) return this.value = new cError(cErrorType.wrong_value_type);
                    else arg0 = arg0.tocNumber();
                }
                else arg0 = arg0.tocNumber();

                if( arg1 instanceof cRef || arg1 instanceof cRef3D ){
                    arg1 = arg1.getValue();
                    if(arg1 instanceof cError) return this.value = arg1;
                    else if(arg1 instanceof cString) return this.value = new cError(cErrorType.wrong_value_type);
                    else arg1 = arg1.tocNumber();
                }
                else arg1 = arg1.tocNumber();

				if( arg0 instanceof cArray && arg1 instanceof cArray ){
					if( arg0.getCountElement() != arg1.getCountElement() || arg0.getRowCount() != arg1.getRowCount() ){
						return this.value = new cError( cErrorType.not_available );
					}
					else{
						arg0.foreach(function(elem,r,c){
							var a = elem;
								b = arg1.getElementRowCol(r,c);
							if( a instanceof cNumber && b instanceof cNumber ){
								var res = roundHelper( a.getValue(), b.getValue() );
								this.array[r][c] = toFix(res.toString(),arg2.toBool());
							}
							else
								this.array[r][c] = new cError( cErrorType.wrong_value_type );
						})
						return this.value = arg0;
					}
				}
				else if( arg0 instanceof cArray ){
					arg0.foreach(function(elem,r,c){
						var a = elem;
							b = arg1;
						if( a instanceof cNumber && b instanceof cNumber ){
							var res = roundHelper( a.getValue(), b.getValue() );
							this.array[r][c] = toFix(res.toString(),arg2.toBool());
						}
						else
							this.array[r][c] = new cError( cErrorType.wrong_value_type );
					})
					return this.value = arg0;
				}
				else if( arg1 instanceof cArray ){
					arg1.foreach(function(elem,r,c){
						var a = arg0;
							b = elem;
						if( a instanceof cNumber && b instanceof cNumber ){
							var res = roundHelper( a.getValue(), b.getValue() );
							this.array[r][c] = toFix(res.toString(),arg2.toBool());
						}
						else
							this.array[r][c] = new cError( cErrorType.wrong_value_type );
					})
					return this.value = arg1;
				}

                var number = arg0.getValue(), num_digits = arg1.getValue();

				return this.value = new cString(toFix(roundHelper(number,num_digits).toString(), arg2.toBool()));
            }
			r.getInfo = function(){
                return {
                    name:this.name,
                    args:"( number [ , [ num-decimal ] [ , suppress-commas-flag ] ] )"
                };
            }
        	return r;
		},
        'JIS' : function(){
            var r = new cBaseFunction();
            r.setName("JIS");
        	return r;
		},
        'LEFT' : function(){
            var r = new cBaseFunction();
            r.setName("LEFT");
			r.setArgumentsMin(1);
            r.setArgumentsMax(2);
            r.Calculate = function(arg){
				var arg0 = arg[0], arg1 = this.argumentsCurrent == 1 ? new cNumber(1) : arg[1];
				if( arg0 instanceof cArea || arg0 instanceof cArea3D ){
					arg0 = arg0.cross(arguments[1].first);
				}
				if( arg1 instanceof cArea || arg1 instanceof cArea3D ){
					arg1 = arg1.cross(arguments[1].first);
				}

                arg0 = arg0.tocString();
				arg1 = arg1.tocNumber();

				if( arg0 instanceof cArray && arg1 instanceof cArray ){
					arg0 = arg0.getElementRowCol(0,0);
					arg1 = arg1.getElementRowCol(0,0);
				}
				else if( arg0 instanceof cArray ){
					arg0 = arg0.getElementRowCol(0,0);
				}
				else if( arg1 instanceof cArray ){
					arg1 = arg1.getElementRowCol(0,0);
				}

                if ( arg0 instanceof cError )	return this.value = arg0;
                if ( arg1 instanceof cError )	return this.value = arg1;

				if( arg1.getValue() < 0 ) return this.value = new cError( cErrorType.wrong_value_type );

				return this.value = new cString( arg0.getValue().substring(0, arg1.getValue()) )

            }
            r.getInfo = function(){
                return {
                    name:this.name,
                    args:"( string [ , number-chars ] )"
                };
            }
        	return r;
		},
        'LEFTB' : function(){
			var r = cFormulaFunction.TextAndData["LEFT"]()
            r.setName("LEFTB");
        	return r;
		},
        'LEN' : function(){
            var r = new cBaseFunction();
            r.setName("LEN");
			r.setArgumentsMin(1);
            r.setArgumentsMax(1);
            r.Calculate = function(arg){
				var arg0 = arg[0];
				if( arg0 instanceof cArea || arg0 instanceof cArea3D ){
					arg0 = arg0.cross(arguments[1].first);
				}

                arg0 = arg0.tocString();

				if( arg0 instanceof cArray ){
					arg0 = arg0.getElementRowCol(0,0);
				}

                if ( arg0 instanceof cError )	return this.value = arg0;

				return this.value = new cNumber( arg0.getValue().length )

            }
            r.getInfo = function(){
                return {
                    name:this.name,
                    args:"( string )"
                };
            }
        	return r;
		},
        'LENB' : function(){
            var r = cFormulaFunction.TextAndData["LEN"]();
            r.setName("LENB");
        	return r;
		},
        'LOWER' : function(){
            var r = new cBaseFunction();
            r.setName("LOWER");
			r.setArgumentsMin(1);
            r.setArgumentsMax(1);
            r.Calculate = function(arg){
				var arg0 = arg[0];

                if( arg0 instanceof cArea || arg0 instanceof cArea3D )
                    arg0 = arg0.cross(arguments[1].first);

				arg0 = arg0.tocString();
				if( arg0 instanceof cArray )
					arg0 = arg0.getElementRowCol(0,0);

                if( arg0 instanceof cError ) return this.value = arg0;

                return this.value = new cString( arg0.getValue().toLowerCase() );
            }
            r.getInfo = function(){
                return {
                    name:this.name,
                    args:"(text)"
                };
            }
        	return r;
		},
        'MID' : function(){
            var r = new cBaseFunction();
            r.setName("MID");
			r.setArgumentsMin(3);
            r.setArgumentsMax(3);
            r.Calculate = function(arg){
				var arg0 = arg[0], arg1 = arg[1], arg2 = arg[2];
				if( arg0 instanceof cArea || arg0 instanceof cArea3D ){
					arg0 = arg0.cross(arguments[1].first);
				}
				if( arg1 instanceof cArea || arg1 instanceof cArea3D ){
					arg1 = arg1.cross(arguments[1].first);
				}
				if( arg2 instanceof cArea || arg2 instanceof cArea3D ){
					arg2 = arg2.cross(arguments[1].first);
				}

                arg0 = arg0.tocString();
				arg1 = arg1.tocNumber();
				arg2 = arg2.tocNumber();

				if( arg0 instanceof cArray ){
					arg0 = arg0.getElementRowCol(0,0);
				}
				if( arg1 instanceof cArray ){
					arg1 = arg1.getElementRowCol(0,0);
				}
				if( arg2 instanceof cArray ){
					arg2 = arg2.getElementRowCol(0,0);
				}

                if ( arg0 instanceof cError )	return this.value = arg0;
                if ( arg1 instanceof cError )	return this.value = arg1;
                if ( arg2 instanceof cError )	return this.value = arg2;
				if( arg1.getValue() < 0 ) return this.value = new cError( cErrorType.wrong_value_type );
				if( arg2.getValue() < 0 ) return this.value = new cError( cErrorType.wrong_value_type );

				var l = arg0.getValue().length;

				if( arg1.getValue() > l )
					return this.value = new cString("");

				/* if( arg1.getValue() < l )
					return this.value = arg0; */

				return this.value = new cString( arg0.getValue().substr( arg1.getValue() == 0 ? 0 : arg1.getValue()-1, arg2.getValue() ) )

            }
            r.getInfo = function(){
                return {
                    name:this.name,
                    args:"( string , start-pos , number-chars )"
                };
            }
        	return r;
		},
        'MIDB' : function(){
			var r = cFormulaFunction.TextAndData["MID"]();
            r.setName("MIDB");
        	return r;
		},
        'PHONETIC' : function(){
            var r = new cBaseFunction();
            r.setName("PHONETIC");
        	return r;
		},
        'PROPER' : function(){
            var r = new cBaseFunction();
            r.setName("PROPER");
			r.setArgumentsMin(1);
            r.setArgumentsMax(1);
			r.Calculate = function(arg){
				var reg_PROPER = new RegExp("[-#$+*/^&%<\\[\\]='?_\\@!~`\">: ;.\\)\\(,]|\\d|\\s"), arg0 = arg[0];

				function proper(str){
					var canUpper = true, retStr = "", regTest;
					for( var i=0; i< str.length; i++ ){
						regTest = reg_PROPER.test(str[i]);

						if( regTest ){
							canUpper = true;
						}
						else{
							if( canUpper ){
								retStr += str[i].toUpperCase();
								canUpper = false;
								continue;
							}
						}

						retStr += str[i].toLowerCase();

					}
					return retStr;
				}

				if( arg0 instanceof cArea || arg0 instanceof cArea3D ){
					arg0 = arg0.cross(arguments[1].first).tocString();
				}
				else if( arg0 instanceof cArray){
					var ret = new cArray();
					arg0.foreach(function(elem,r,c){
						var _elem = elem.tocString();
						if(!ret.array[r])
							ret.addRow();

						if( _elem instanceof cError )
							ret.addElement(_elem);
						else
							ret.addElement(new cString( proper(_elem.toString()) ));
					})
					return this.value = ret;
				}

				arg0 = arg0.tocString();

				if( arg0 instanceof cError ){
					return this.value = arg0;
				}

				return this.value = new cString( proper(arg0.toString() ) );
			}
			r.getInfo = function(){
				return {
                    name:this.name,
                    args:"( string )"
                };
			}
        	return r;
		},
        'REPLACE' : function(){
            var r = new cBaseFunction();
            r.setName("REPLACE");
			r.setArgumentsMin(4);
            r.setArgumentsMax(4);
			r.Calculate = function(arg){
				var arg0 = arg[0], arg1 = arg[1], arg2 = arg[2], arg3 = arg[3];

				if( arg0 instanceof cArea || arg0 instanceof cArea3D ){
					arg0 = arg0.cross(arguments[1].first).tocString();
				}
				else if( arg0 instanceof cArray){
					arg0 = arg0.getElement(0).tocString();
				}

				arg0 = arg0.tocString();

				if( arg1 instanceof cArea || arg1 instanceof cArea3D ){
					arg1 = arg1.cross(arguments[1].first).tocNumber();
				}
				else if( arg1 instanceof cArray){
					arg1 = arg1.getElement(0).tocNumber();
				}

				arg1 = arg1.tocNumber();

				if( arg2 instanceof cArea || arg2 instanceof cArea3D ){
					arg2 = arg2.cross(arguments[1].first).tocNumber();
				}
				else if( arg2 instanceof cArray){
					arg2 = arg2.getElement(0).tocNumber();
				}

				arg2 = arg2.tocNumber();

				if( arg3 instanceof cArea || arg3 instanceof cArea3D ){
					arg3 = arg3.cross(arguments[1].first).tocString();
				}
				else if( arg3 instanceof cArray){
					arg3 = arg3.getElement(0).tocString();
				}

				arg3 = arg3.tocString();

				if( arg0 instanceof cError )
					return this.value = arg0;
				if( arg1 instanceof cError )
					return this.value = arg1;
				if( arg2 instanceof cError )
					return this.value = arg2;
				if( arg3 instanceof cError )
					return this.value = arg3;

				if( arg1.getValue() < 1 || arg2.getValue() < 0 ){
					return this.value = new cError( cErrorType.wrong_value_type );
				}

				var string1 = arg0.getValue(), string2 = arg3.getValue(), res = "";

				string1 = string1.split("");
				string1.splice(arg1.getValue()-1,arg2.getValue(),string2);
				for( var i = 0; i < string1.length; i++){
					res += string1[i];
				}

				return this.value = new cString(res);

			}
			r.getInfo = function(){
				return {
                    name:this.name,
                    args:"( string-1, start-pos, number-chars, string-2 )"
                };
			}
        	return r;
		},
        'REPLACEB' : function(){
            var r = cFormulaFunction.TextAndData["REPLACE"]();
            r.setName("REPLACEB");
        	return r;
		},
        'REPT' : function(){
            var r = new cBaseFunction();
            r.setName("REPT");
            r.setArgumentsMin(2);
            r.setArgumentsMax(2);
            r.Calculate = function(arg){
                var arg0 = arg[0], arg1 = arg[1], res = "";
                if( arg0 instanceof cError ) return this.value = arg0;
                if( arg1 instanceof cError ) return this.value = arg1;

				if( arg0 instanceof cArray && arg1 instanceof cArray ){
					arg0 = arg0.getElementRowCol(0,0);
					arg1 = arg1.getElementRowCol(0,0);
				}
				else if( arg0 instanceof cArray ){
					arg0 = arg0.getElementRowCol(0,0);
				}
				else if( arg1 instanceof cArray ){
					arg1 = arg1.getElementRowCol(0,0);
				}


                if( arg0 instanceof cArea || arg0 instanceof cArea3D ){
					arg0 = arg0.cross(arguments[1].first);
				}
                arg0 = arg0.tocString();
				if (arg0 instanceof cError)
					return this.value = arg0;

                if( arg1 instanceof cArea || arg1 instanceof cArea3D ){
					arg1 = arg1.cross(arguments[1].first).tocNumber();
				}
                else if( arg1 instanceof cRef || arg1 instanceof cRef3D ){
                    arg1 = arg1.getValue();
                }

				if(arg1 instanceof cError)
					return this.value = arg1;
				else if(arg1 instanceof cString)
					return this.value = new cError(cErrorType.wrong_value_type);
				else
					arg1 = arg1.tocNumber();

                if( arg1.getValue() < 0 ) return this.value = new cError(cErrorType.wrong_value_type);

                for ( var i = 0; i < arg1.getValue(); i++){
                    res = res.concat(arg0.getValue());
                }
                return this.value = new cString( res );
            }
            r.getInfo = function(){
                return {
                    name:this.name,
                    args:"(text, number_of_times)"
                };
            }
			return r;
		},
        'RIGHT' : function(){
            var r = new cBaseFunction();
            r.setName("RIGHT");
			r.setArgumentsMin(1);
            r.setArgumentsMax(2);
            r.Calculate = function(arg){
				var arg0 = arg[0], arg1 = this.argumentsCurrent == 1 ? new cNumber(1) : arg[1];
				if( arg0 instanceof cArea || arg0 instanceof cArea3D ){
					arg0 = arg0.cross(arguments[1].first);
				}
				if( arg1 instanceof cArea || arg1 instanceof cArea3D ){
					arg1 = arg1.cross(arguments[1].first);
				}

                arg0 = arg0.tocString();
				arg1 = arg1.tocNumber();

				if( arg0 instanceof cArray && arg1 instanceof cArray ){
					arg0 = arg0.getElementRowCol(0,0);
					arg1 = arg1.getElementRowCol(0,0);
				}
				else if( arg0 instanceof cArray ){
					arg0 = arg0.getElementRowCol(0,0);
				}
				else if( arg1 instanceof cArray ){
					arg1 = arg1.getElementRowCol(0,0);
				}

                if ( arg0 instanceof cError )	return this.value = arg0;
                if ( arg1 instanceof cError )	return this.value = arg1;

				if( arg1.getValue() < 0 ) return this.value = new cError( cErrorType.wrong_value_type );
				var l = arg0.getValue().length, _number = l-arg1.getValue();
				return this.value = new cString( arg0.getValue().substring( _number < 0 ? 0 : _number , l) )

            }
            r.getInfo = function(){
                return {
                    name:this.name,
                    args:"( string [ , number-chars ] )"
                };
            }
        	return r;
		},
        'RIGHTB' : function(){
            var r = cFormulaFunction.TextAndData["RIGHT"]()
            r.setName("RIGHTB");
        	return r;
		},
        'SEARCH' : function(){
            var r = new cBaseFunction();
            r.setName("SEARCH");
			r.setArgumentsMin(2);
            r.setArgumentsMax(3);
			r.Calculate = function(arg){

				var arg0 = arg[0], arg1 = arg[1], arg2 = arg[2] ? arg[2] : new cNumber(1);

				if( arg0 instanceof cArea || arg0 instanceof cArea3D ){
					arg0 = arg0.cross(arguments[1].first).tocString();
				}
				else if( arg0 instanceof cArray){
					arg0 = arg0.getElement(0).tocString();
				}

				arg0 = arg0.tocString();

				if( arg1 instanceof cArea || arg1 instanceof cArea3D ){
					arg1 = arg1.cross(arguments[1].first).tocString();
				}
				else if( arg1 instanceof cArray){
					arg1 = arg1.getElement(0).tocString();
				}

				arg1 = arg1.tocString();

				if( arg2 instanceof cArea || arg2 instanceof cArea3D ){
					arg2 = arg2.cross(arguments[1].first).tocNumber();
				}
				else if( arg2 instanceof cArray){
					arg2 = arg2.getElement(0).tocNumber();
				}

				arg2 = arg2.tocNumber();

				if( arg0 instanceof cError )
					return this.value = arg0;
				if( arg1 instanceof cError )
					return this.value = arg1;
				if( arg2 instanceof cError )
					return this.value = arg2;

				if( arg2.getValue() < 1 || arg2.getValue() > arg1.getValue().length ){
					return this.value = new cError( cErrorType.wrong_value_type );
				}

				var string1 = arg0.getValue(), string2 = arg1.getValue(), res = 0,
					valueForSearching = string1
												.replace(/(~)?\*/g, function($0, $1){
													return $1 ? $0 : '[\\w\\W]*';
												})
												.replace(/(~)?\?/g, function($0, $1){
													return $1 ? $0 : '[\\w\\W]{1,1}';
												})
												.replace(/\~/g, "\\");

					valueForSearching = new RegExp( valueForSearching, "ig")
				if( string1 == "" )
					return this.value = arg2;



				res = string2.substring(arg2.getValue()-1).search( valueForSearching ) + arg2.getValue()-1;

				if( res < 0 )
					return this.value = new cError( cErrorType.wrong_value_type );

				return this.value = new cNumber(res+1);

			}
			r.getInfo = function(){
				return {
                    name:this.name,
                    args:"( string-1 , string-2 [ , start-pos ] )"
                };
			}
        	return r;
		},
        'SEARCHB' : function(){
            var r = cFormulaFunction.TextAndData["SEARCH"]();
            r.setName("SEARCHB");
        	return r;
		},
        'SUBSTITUTE' : function(){
            var r = new cBaseFunction();
            r.setName("SUBSTITUTE");
			r.setArgumentsMin(3);
            r.setArgumentsMax(4);
			r.Calculate = function(arg){
				var arg0 = arg[0], arg1 = arg[1], arg2 = arg[2], arg3 = arg[3] ? arg[3] : new cNumber(0);

				if( arg0 instanceof cArea || arg0 instanceof cArea3D ){
					arg0 = arg0.cross(arguments[1].first).tocString();
				}
				else if( arg0 instanceof cArray){
					arg0 = arg0.getElement(0).tocString();
				}

				arg0 = arg0.tocString();

				if( arg1 instanceof cArea || arg1 instanceof cArea3D ){
					arg1 = arg1.cross(arguments[1].first).tocString();
				}
				else if( arg1 instanceof cArray){
					arg1 = arg1.getElement(0).tocString();
				}

				arg1 = arg1.tocString();

				if( arg2 instanceof cArea || arg2 instanceof cArea3D ){
					arg2 = arg2.cross(arguments[1].first).tocString();
				}
				else if( arg2 instanceof cArray){
					arg2 = arg2.getElement(0).tocString();
				}

				arg2 = arg2.tocString();

				if( arg3 instanceof cArea || arg3 instanceof cArea3D ){
					arg3 = arg3.cross(arguments[1].first).tocNumber();
				}
				else if( arg3 instanceof cArray){
					arg3 = arg3.getElement(0).tocNumber();
				}

				arg3 = arg3.tocNumber();

				if( arg0 instanceof cError )
					return this.value = arg0;
				if( arg1 instanceof cError )
					return this.value = arg1;
				if( arg2 instanceof cError )
					return this.value = arg2;
				if( arg3 instanceof cError )
					return this.value = arg3;

				if( arg3.getValue() < 0 ){
					return this.value = new cError( cErrorType.wrong_value_type );
				}

				var string = arg0.getValue(), old_string = arg1.getValue(), new_string = arg2.getValue(), index = 0, res;
					res = string.replace(new RegExp(old_string,"g"),function(equal, p1, source){
						index++;
						if( arg3.getValue() == 0 || arg3.getValue() > source.length )
							return new_string;
						else if( arg3.getValue() == index ){
							return new_string;
						}
						return equal;
					})

				return this.value = new cString( res );

			}
			r.getInfo = function(){
				return {
                    name:this.name,
                    args:"( string , old-string , new-string [ , occurence ] )"
                };
			}
        	return r;
		},
        'T' : function(){
            var r = new cBaseFunction();
            r.setName("T");
            r.setArgumentsMin(1);
            r.setArgumentsMax(1);
            r.Calculate = function(arg){
				var arg0 = arg[0];
                if( arg0 instanceof cRef || arg0 instanceof cRef3D){
                    arg0 = arg0.getValue();
                }
                else if( arg0 instanceof cString || arg0 instanceof cError )
                    return this.value = arg0;
                else if ( arg0 instanceof cArea || arg0 instanceof cArea3D ){
					arg0 = arg0.cross(arguments[1].first);
				}
				else if( arg[0] instanceof cArray ){
					arg0 = arg[0].getElementRowCol(0,0);
				}

                if( arg0 instanceof cString || arg0 instanceof cError )
                    return this.value = arg[0];
                else
                    return this.value = new cEmpty();
            }
            r.getInfo = function(){
                return {
                    name:this.name,
                    args:"( value )"
                };
            }
        	return r;
		},
        'TEXT' : function(){
            var r = new cBaseFunction();
			r.setName("TEXT");
			r.setArgumentsMin(2);
            r.setArgumentsMax(2);
            r.Calculate = function(arg){
				var arg0 = arg[0], arg1 = arg[1];
                if( arg0 instanceof cRef || arg0 instanceof cRef3D){
                    arg0 = arg0.getValue();
                }
                else if ( arg0 instanceof cArea || arg0 instanceof cArea3D ){
					arg0 = arg0.cross(arguments[1].first);
				}
				else if( arg0 instanceof cArray ){
					arg0 = arg0.getElementRowCol(0,0);
				}

				if( arg1 instanceof cRef || arg1 instanceof cRef3D){
                    arg1 = arg1.getValue();
                }
                else if ( arg1 instanceof cArea || arg1 instanceof cArea3D ){
					arg1 = arg1.cross(arguments[1].first);
				}
				else if( arg1 instanceof cArray ){
					arg1 = arg1.getElementRowCol(0,0);
				}

				arg1 = arg1.tocString();

				if ( arg0 instanceof cError )	return this.value = arg0;
                if ( arg1 instanceof cError )	return this.value = arg1;

				var _tmp = arg0.tocNumber();
				if( _tmp instanceof cNumber )
					arg0 = _tmp;

				var oFormat = oNumFormatCache.get(arg1.toString());
				var aText = oFormat.format(arg0.getValue(), arg0 instanceof cNumber ? CellValueType.Number : CellValueType.String, gc_nMaxDigCountView, null);
				var text = "";

				for(var i = 0, length = aText.length; i < length; ++i)
				{

					if(aText[i].format && aText[i].format.skip ){
						text += " ";
						continue;
					}
					if(aText[i].format && aText[i].format.repeat )
						continue;

					text += aText[i].text;
				}

				return this.value = new cString(text);
			}
			r.getInfo = function(){
                return {
                    name:this.name,
                    args:"( value , format )"
                };
            }
        	return r;
		},
        'TRIM' : function(){
            var r = new cBaseFunction();
            r.setName("TRIM");
			r.setArgumentsMin(1);
            r.setArgumentsMax(1);
            r.Calculate = function(arg){
				var arg0 = arg[0];

				if( arg0 instanceof cArea || arg0 instanceof cArea3D ){
					arg0 = arg0.cross(arguments[1].first).tocString();
				}
				else if( arg0 instanceof cArray){
					arg0 = arg0.getElement(0).tocString();
				}

				arg0 = arg0.tocString();

				if( arg0 instanceof cError )
					return this.value = arg0;

				return this.value = new cString( arg0.getValue().replace(/\s/g, function($0, $1, $2){ var r; /\s/.test($2[$1+1]) ? r = "" : r = $2[$1]; return r; }).replace(/^\s|\s$/g,"") )
			}
			r.getInfo = function(){
				return {
                    name:this.name,
                    args:"( string )"
                };
			}
        	return r;
		},
        'UPPER' : function(){
            var r = new cBaseFunction();
            r.setName("UPPER");
			r.setArgumentsMin(1);
            r.setArgumentsMax(1);
            r.Calculate = function(arg){
				var arg0 = arg[0];
                if( arg0 instanceof cArea || arg0 instanceof cArea3D ){
					arg0 = arg0.cross(arguments[1].first);
				}
				if( arg0 instanceof cArray )
					arg0 = arg0.getElementRowCol(0,0);
                
				arg0 = arg0.tocString();

                if( arg0 instanceof cError ) return this.value = arg0;
                return this.value = new cString( arg0.getValue().toUpperCase() );
            }
            r.getInfo = function(){
                return {
                    name:this.name,
                    args:"(text)"
                };
            }
        	return r;
		},
        'VALUE' : function(){
            var r = new cBaseFunction();
            r.setName("VALUE");
			r.setArgumentsMin(1);
            r.setArgumentsMax(1);
            r.Calculate = function(arg){
				var arg0 = arg[0];

				if ( arg0 instanceof cArea || arg0 instanceof cArea3D ){
					arg0 = arg0.cross(arguments[1].first);
				}
				else if( arg0 instanceof cArray ){
					arg0 = arg0.getElementRowCol(0,0);
				}

				arg0 = arg0.tocString();
				
				if ( arg0 instanceof cError )
					return this.value = arg0;

				var res = g_oFormatParser.parse(arg0.getValue());

				if( res )
					return this.value = new cNumber( res.value );
				else
					return this.value = new cError( cErrorType.wrong_value_type );

			}
			r.getInfo = function(){
                return {
                    name:this.name,
                    args:"( string )"
                };
            }
			r.setFormat(r.formatType.noneFormat);
        	return r;
		}
    }
}

function getFormulasInfo(){
    var list = [], a, b;
    for(var type in cFormulaFunction){
        b = new Asc.asc_CFormulaGroup(cFormulaFunction[type]["groupName"]);
        for (var f in cFormulaFunction[type] ){
            if ( f != "groupName"){
                a = cFormulaFunction[type][f]();
                if ( a.getInfo )
                    b.asc_addFormulaElement(new Asc.asc_CFormula(a.getInfo()));
                delete a;
            }
        }
        list.push(b)
    }
    return list;
}
/*--------------------------------------------------------------------------*/
/*Basic types of an elements used into formulas*/
/** @constructor */
function cNumber(val){
	cNumber.superclass.constructor.call(this, val);
    this.type = cElementType.number;
    this.value = parseFloat(val);
}
extend(cNumber,cBaseType);
cNumber.prototype.getValue = function(){ return this.value.toFixed(cExcelSignificantDigits)-0; };
cNumber.prototype.tocString = function(){ return new cString( ""+this.value ); };
cNumber.prototype.tocNumber = function(){ return this; };
cNumber.prototype.tocBool = function(){ return new cBool( this.value != 0 ); };

/** @constructor */
function cString(val){
	cString.superclass.constructor.call(this, val);
    this.type = cElementType.string;
}
extend(cString,cBaseType);
cString.prototype.tocNumber = function(){
	if (this.value == "")
		return new cEmpty();

	var m = this.value;
	if( this.value[0] == '"' && this.value[this.value.length-1] == '"' )
		m = this.value.substring(1,this.value.length-1);
	if ( !parseNum(m) )
		return new cError( cErrorType.wrong_value_type );
	else{
		var _numberValue = parseFloat(m);
		if ( !isNaN(_numberValue) )
			return new cNumber(_numberValue);
	}
};
cString.prototype.tocBool = function(){
	if ( parserHelp.isBoolean(this.value, 0) ){
		if( parserHelp.operand_str == "TRUE" )
			return new cBool( true ); 
		else
			return new cBool( false ); 
	}
	else
		return this;
};
cString.prototype.tocString = function(){ return this; };

/** @constructor */
function cBool(val){
	cBool.superclass.constructor.call(this, val);
    this.type = cElementType.bool;
    var that = this;
	switch (val.toString().toUpperCase()){
		case "TRUE"/* ||true */:
			this.value = true;
			break;
		case "FALSE"/* ||false */:
			this.value = false;
			break;
	}
}
extend(cBool,cBaseType);
cBool.prototype.toString = function(){ return this.value.toString().toUpperCase(); };
cBool.prototype.getValue = function(){ return this.toString(); };
cBool.prototype.tocNumber = function(){ return new cNumber( this.value ? 1.0: 0.0 ); };
cBool.prototype.tocString = function(){ return new cString( this.value ? "TRUE": "FALSE"  ); };
cBool.prototype.tocBool = function(){ return this; };
cBool.prototype.toBool = function(){ return this.value; };

/** @constructor */
function cError(val){
	cError.superclass.constructor.call(this, val);
    this.type = cElementType.error;
    this.errorType = -1;
	
	if ( isNaN(parseInt(val))){
		switch (val){
			case "#VALUE!":
				this.errorType = cErrorType.wrong_value_type;
				break;
			case "#NULL!":
				this.errorType = cErrorType.null_value;
				break;
			case "#DIV/0!":
				this.errorType = cErrorType.division_by_zero;
				break;
			case "#REF!":
				this.errorType = cErrorType.bad_reference;
				break;
			case "#NAME?":
				this.errorType = cErrorType.wrong_name;
				break;
			case "#NUM!":
				this.errorType = cErrorType.not_numeric;
				break;
			case "#N/A":
				this.errorType = cErrorType.not_available;
				break;
			case "#UNSUPPORTED_FUNCTION!":
				this.errorType = cErrorType.unsupported_function;
				break;
			case "#GETTING_DATA":
				this.errorType = cErrorType.getting_data;
				break;
		}
		return this;
	}
	switch (val){
		case cErrorType.null_value:
			this.value = "#NULL!";
			this.errorType = cErrorType.null_value;
			break;
		case cErrorType.division_by_zero:
			this.value = "#DIV/0!";
			this.errorType = cErrorType.division_by_zero;
			break;
		case cErrorType.wrong_value_type:
			this.value = "#VALUE!";
			this.errorType = cErrorType.wrong_value_type;
			break;
		case cErrorType.bad_reference:
			this.value = "#REF!";
			this.errorType = cErrorType.bad_reference;
			break;
		case cErrorType.wrong_name:
			this.value = "#NAME?";
			this.errorType = cErrorType.wrong_name;
			break;
		case cErrorType.not_numeric:
			this.value = "#NUM!";
			this.errorType = cErrorType.not_numeric;
			break;
		case cErrorType.not_available:
			this.value = "#N/A";
			this.errorType = cErrorType.not_available;
			break;
		case cErrorType.unsupported_function:
			this.value = "#UNSUPPORTED_FUNCTION!";
			this.errorType = cErrorType.unsupported_function;
			break;
		case cErrorType.getting_data:
			this.value = "#GETTING_DATA";
			this.errorType = cErrorType.getting_data;
			break;
	}
}
extend(cError,cBaseType);
cError.prototype.tocNumber = cError.prototype.tocString = cError.prototype.tocBool = cError.prototype.tocEmpty = function(){ return this; };

/** @constructor */
function cArea(val,_ws){/*Area means "A1:E5" for example*/
	cArea.superclass.constructor.call(this, val);
	this.ws = _ws;
	this.wb = _ws.workbook;
    this._cells = val;
    this.isAbsolute = false;
    this.type = cElementType.cellsRange;
    // this.range = this.wb.getWorksheetById(this.ws).getRange2(val);
    // this._valid = this.range ? true : false;
}
extend(cArea,cBaseType);
cArea.prototype.getWsId = function(){ return this.ws.Id; };
cArea.prototype.getValue = function(){
	var _val = [], r = this.getRange();
	if(  !r ){
		_val.push(new cError(cErrorType.bad_reference))
	}
	else
		r._foreachNoEmpty(function (_cell){
			switch( _cell.getType() ){
				case CellValueType.Number:
					_cell.getValueWithoutFormat() == ""? _val.push( new cEmpty() ) : _val.push( new cNumber( _cell.getValueWithoutFormat() ) )
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
					if( _cell.getValueWithoutFormat() && _cell.getValueWithoutFormat() != "" ){
						_val.push( new cNumber( _cell.getValueWithoutFormat() ) )
					}
					else
						_val.push( checkTypeCell(""+_cell.getValueWithoutFormat()) );
			}
		});
	return _val;
};
cArea.prototype.getValue2 = function(cell){
	var _val = [], r = this.getRange();
	if(  !r ){
		_val.push(new cError(cErrorType.bad_reference))
	}
	else
		r._foreachNoEmpty(function (_cell){
			if( cell.getID() == _cell.getName() )
			switch( _cell.getType() ){
				case CellValueType.Number:
					_cell.getValueWithoutFormat() == ""? _val.push( new cEmpty() ) : _val.push( new cNumber( _cell.getValueWithoutFormat() ) )
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
					if( _cell.getValueWithoutFormat() && _cell.getValueWithoutFormat() != "" ){
						_val.push( new cNumber( _cell.getValueWithoutFormat() ) )
					}
					else
						_val.push( checkTypeCell(""+_cell.getValueWithoutFormat()) );
			}
		});
	return _val[0];
};
cArea.prototype.getRange = function(){ return this.ws.getRange2(this._cells); };
cArea.prototype.tocNumber = function(){ return this.getValue()[0].tocNumber(); };
cArea.prototype.tocString = function(){ return this.getValue()[0].tocString(); };
cArea.prototype.tocBool = function(){ return this.getValue()[0].tocBool(); };
cArea.prototype.toString = function(){ return this._cells; };
cArea.prototype.setRange = function(cell){
	this._cells = this.value = cell;
	this.range = this.ws.getRange2(cell);
	this._valid = this.range ? true : false;
};
cArea.prototype.getWS = function(){ return this.ws; };
cArea.prototype.getBBox = function(){ return this.getRange().getBBox(); };
cArea.prototype.cross = function(arg){
	var r = this.getRange();
	if( !r )
		return new cError( cErrorType.wrong_name );
	var cross = r.cross(arg);
	if( cross ){
		if( cross.r != undefined ){
			return this.getValue2(new CellAddress(cross.r,this.getBBox().c1))
		}
		else if( cross.c != undefined ){
			return this.getValue2(new CellAddress(this.getBBox().r1, cross.c))
		}
		else
			return new cError( cErrorType.wrong_value_type ); 
	}
	else
		return new cError( cErrorType.wrong_value_type );
};
cArea.prototype.isValid = function(){
	var r = this.getRange();
	if(!r)
		return false;
	return true;
};
cArea.prototype.countCells = function(){
	var r = this.getRange(), bbox = r.bbox,
		count = (Math.abs(bbox.c1 - bbox.c2) + 1)*(Math.abs(bbox.r1 - bbox.r2) + 1);
		r._foreachNoEmpty(function (_cell){
			count--;
		})
	return new cNumber( count );
};

/** @constructor */
function cRef(val,_ws){/*Ref means A1 for example*/
    cRef.superclass.constructor.call(this, val);
	this._cells = val;
	this.ws = _ws;
	this.wb = _ws.workbook;
    this.isAbsolute = false;
    this.type = cElementType.cell;
    this.range = _ws.getRange2(val);
    this._valid = new CellAddress(val.replace(/\$/g,"")).isValid();
}
extend(cRef,cBaseType);
cRef.prototype.getWsId = function(){ return this.ws.Id; };
cRef.prototype.getValue = function(){
	if( !this._valid ){
		return new cError(cErrorType.bad_reference)
	}
	switch (this.range.getType()){
		case CellValueType.Number:{
			var v = this.range.getValueWithoutFormat();
			if( v == "" )
				return new cEmpty(""+v) 
			else
				return new cNumber(""+v);
		}
		case CellValueType.String:
			return new cString(""+this.range.getValueWithoutFormat());
		case CellValueType.Bool:
			return new cBool(""+this.range.getValueWithoutFormat())
		case CellValueType.Error:
			return new cError(""+this.range.getValueWithoutFormat())
		default:
			var _val = ""+this.range.getValueWithoutFormat();
			if ( _val == "" || _val == null)
				return new cEmpty();
			else if ( parserHelp.isNumber(_val) )
				return new cNumber(parserHelp.operand_str)
			else if( parserHelp.isBoolean(_val) )
				return new cBool(parserHelp.operand_str)
			else if ( parserHelp.isError(_val) )
				return new cError(parserHelp.operand_str)
			else return new cString(_val);
	}
};
cRef.prototype.tocNumber = function(){ return this.getValue().tocNumber(); };
cRef.prototype.tocString = function(){ return this.getValue().tocString();/* new cString(""+this.range.getValueWithFormat()); */ };
cRef.prototype.tocBool = function(){ return this.getValue().tocBool(); };
cRef.prototype.tryConvert = function(){ return this.getValue(); };
cRef.prototype.toString = function(){ return this._cells; };
cRef.prototype.getRange = function(){ return this.range; };
cRef.prototype.getWS = function(){ return this.ws; };
cRef.prototype.isValid = function(){
	return this._valid;
};

/** @constructor */
function cArea3D(val,_wsFrom, _wsTo,wb){/*Area3D means "Sheat1!A1:E5" for example*/
    cArea3D.superclass.constructor.call(this, val);
	this._wb = wb;
    this._cells = val;
    this.isAbsolute = false;
    this.type = cElementType.cellsRange;
    this.wsFrom = this._wb.getWorksheetByName(_wsFrom).getId();
    this.wsTo = this._wb.getWorksheetByName(_wsTo).getId();
}
extend(cArea3D,cBaseType);
cArea3D.prototype.wsRange = function(){
	var r = [];
	if ( !this.wsTo ) this.wsTo = this.wsFrom;
	var wsF = this._wb.getWorksheetById(this.wsFrom).getIndex(), wsL = this._wb.getWorksheetById(this.wsTo).getIndex(), r = [];
	for(var i = wsF; i <= wsL; i++){
		r.push( this._wb.getWorksheet(i));
	}
	return r;
};
cArea3D.prototype.range = function(wsRange){
	if( !wsRange ) return [null];
	var r = [];
	for(var i=0; i < wsRange.length;i++){
		if ( !wsRange[i] )
			r.push(null);
		else
			r.push(wsRange[i].getRange2(this._cells));
	}
	return r;
};
cArea3D.prototype.getRange = function(){ return this.range(this.wsRange()); };
cArea3D.prototype.getValue = function(){
	var _wsA = this.wsRange();
	var _val = [];
	if(_wsA.length<1){
		_val.push(new cError( cErrorType.bad_reference ));
		return _val;
	}
	for( var i=0;i<_wsA.length;i++ ){
		if( !_wsA[i] ) {
			_val.push(new cError( cErrorType.bad_reference ));
			return _val;
		}

	}
	var _r = this.range(_wsA);
	for(var i=0; i < _r.length; i++){
		if( !_r[i] ){
			_val.push(new cError( cErrorType.bad_reference ));
			return _val;
		}
		_r[i]._foreachNoEmpty(function(_cell){
			switch( _cell.getType() ){
				case CellValueType.Number:
					_cell.getValueWithoutFormat() == ""? _val.push( new cEmpty() ) : _val.push( new cNumber( _cell.getValueWithoutFormat() ) )
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
					if( _cell.getValueWithoutFormat() && _cell.getValueWithoutFormat() != "" ){
						_val.push( new cNumber( _cell.getValueWithoutFormat() ) )
					}
					else
						_val.push( checkTypeCell(""+_cell.getValueWithoutFormat()) );
			}
		})
	}
	return _val;
};
cArea3D.prototype.getValue2 = function(cell){
	var _wsA = this.wsRange();
	var _val = [];
	if(_wsA.length<1){
		_val.push(new cError( cErrorType.bad_reference ));
		return _val;
	}
	for( var i=0;i<_wsA.length;i++ ){
		if( !_wsA[i] ) {
			_val.push(new cError( cErrorType.bad_reference ));
			return _val;
		}

	}
	var _r = this.range(_wsA);
	if( !_r[0] ){
		_val.push(new cError( cErrorType.bad_reference ));
		return _val;
	}
	_r[0]._foreachNoEmpty(function(_cell){
		if( cell.getID() == _cell.getName() )
		switch( _cell.getType() ){
			case CellValueType.Number:
				_cell.getValueWithoutFormat() == ""? _val.push( new cEmpty() ) : _val.push( new cNumber( _cell.getValueWithoutFormat() ) )
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
				if( _cell.getValueWithoutFormat() && _cell.getValueWithoutFormat() != "" ){
					_val.push( new cNumber( _cell.getValueWithoutFormat() ) )
				}
				else
					_val.push( checkTypeCell(""+_cell.getValueWithoutFormat()) );
		}
	})
	return _val[0];
};
cArea3D.prototype.changeSheet = function(lastName,newName){
	if( this.wsFrom == this._wb.getWorksheetByName(lastName).getId() && this.wsTo == this._wb.getWorksheetByName(lastName).getId() ){
		this.wsFrom = this.wsTo = this._wb.getWorksheetByName(newName).getId();
	}
	else if( this.wsFrom == this._wb.getWorksheetByName(lastName).getId() ){
		this.wsFrom = this._wb.getWorksheetByName(newName).getId();
	}
	else if( this.wsTo == this._wb.getWorksheetByName(lastName).getId() ){
		this.wsTo = this._wb.getWorksheetByName(newName).getId();
	}
};
cArea3D.prototype.moveSheet = function(tempW){
	if( this.wsFrom == this.wsTo ){
		return;
	}
	else if( this.wsFrom == tempW.wFId ){
		var newWsFromIndex = this._wb.getWorksheetById( this.wsFrom ).getIndex(),
			wsToIndex = this._wb.getWorksheetById( this.wsTo ).getIndex();
		if( newWsFromIndex > wsToIndex ){
			this.wsFrom = this._wb.getWorksheet(tempW.wFI).getId();
		}
	}
	else if( this.wsTo == tempW.wFId ){
		var newWsToIndex = this._wb.getWorksheetById( this.wsTo ).getIndex(),
			wsFromIndex = this._wb.getWorksheetById( this.wsFrom ).getIndex();
		if( newWsToIndex < wsFromIndex ){
			this.wsTo = this._wb.getWorksheet(tempW.wFI).getId();
		}
	}
};
cArea3D.prototype.toString = function(){
	var wsFrom = this._wb.getWorksheetById( this.wsFrom ).getName();
	var wsTo = this._wb.getWorksheetById( this.wsTo ).getName();
	if( !rx_test_ws_name.test(wsFrom) || !rx_test_ws_name.test(wsTo) ){
		wsFrom = wsFrom.replace(/'/g,"''");
		wsTo = wsTo.replace(/'/g,"''")
		return "'"+(wsFrom!=wsTo ?
				wsFrom+":"+wsTo :
				wsFrom)
				+"'!"+this._cells;
	}
	return (wsFrom!=wsTo ?
				wsFrom+":"+wsTo :
				wsFrom)
			+"!"+this._cells;
};
cArea3D.prototype.tocNumber = function(){ return this.getValue()[0].tocNumber(); };
cArea3D.prototype.tocString = function(){ return this.getValue()[0].tocString(); };
cArea3D.prototype.tocBool = function(){ return this.getValue()[0].tocBool(); };
cArea3D.prototype.getWS = function(){ return this.wsRange()[0]; };
cArea3D.prototype.cross = function(arg){
	if( this.wsFrom != this.wsTo )
		return new cError( cErrorType.wrong_value_type );
	var r = this.getRange();
	if( !r )
		return new cError( cErrorType.wrong_name );
	var cross = r[0].cross(arg);
	if( cross ){
		if( cross.r != undefined ){
			return this.getValue2(new CellAddress(cross.r,this.getBBox().c1))
		}
		else if( cross.c != undefined ){
			return this.getValue2(new CellAddress(this.getBBox().r1, cross.c))
		}
		else
			return new cError( cErrorType.wrong_value_type ); 
	}
	else
		return new cError( cErrorType.wrong_value_type );
};
cArea3D.prototype.getBBox = function(){ return this.getRange()[0].getBBox(); };
cArea3D.prototype.isValid = function(){
	var r = this.getRange();
	for( var i=0;i<r.length;i++){
		if(!r[i])
			return false;
	}
	return true;
};
cArea3D.prototype.countCells = function(){
	var _wsA = this.wsRange();
	var _val = [];
	if(_wsA.length<1){
		_val.push(new cError( cErrorType.bad_reference ));
		return _val;
	}
	for( var i=0;i<_wsA.length;i++ ){
		if( !_wsA[i] ) {
			_val.push(new cError( cErrorType.bad_reference ));
			return _val;
		}

	}
	var _r = this.range(_wsA),
		bbox = _r[0].bbox,
		count = (Math.abs(bbox.c1 - bbox.c2) + 1)*(Math.abs(bbox.r1 - bbox.r2) + 1);
	count = _r.length * count;
	for(var i=0; i < _r.length; i++){
		_r[i]._foreachNoEmpty(function(_cell){
			
			if( _cell.getType() == CellValueType.Number && _cell.getValueWithoutFormat() == "" )
				return null;
				
			count--;
		})
	}
	return new cNumber( count );
};

/** @constructor */
function cRef3D(val,_wsFrom,wb){/*Ref means Sheat1!A1 for example*/
    cRef3D.superclass.constructor.call(this, val);
    this._wb = wb;
    this._cells = val;
    this.isAbsolute = false;
    this.type = cElementType.cell;
	this.ws = this._wb.getWorksheetByName( _wsFrom );
}
extend(cRef3D,cBaseType);
cRef3D.prototype.getWsId = function(){ return this.ws.Id; };
cRef3D.prototype.getRange = function(){
	if(this.ws)
		return this.ws.getRange2(this._cells);
	else 
		return null;
};
cRef3D.prototype.isValid = function(){
	if( this.getRange() )
		return true;
	else return false;
};
cRef3D.prototype.getValue = function(){
	var _r = this.getRange();
	if( !_r ){
		return new cError( cErrorType.bad_reference );
	}
	switch ( _r.getType() ){
		case CellValueType.Number:{
			var v = _r.getValueWithoutFormat();
			if( v == "" )
				return new cEmpty(""+v);
			else 
				return new cNumber(""+v);
		}
		case CellValueType.String:
			return new cString(""+_r.getValueWithoutFormat());
		case CellValueType.Bool:
			return new cBool(""+_r.getValueWithoutFormat())
		case CellValueType.Error:
			return new cError(""+_r.getValueWithoutFormat())
		default:
			var _val = ""+_r.getValueWithoutFormat();
			if ( _val == "" || _val == null)
				return new cEmpty();
			else if ( parserHelp.isNumber(_val) )
				return new cNumber(parserHelp.operand_str)
			else if( parserHelp.isBoolean(_val) )
				return new cBool(parserHelp.operand_str)
			else if ( parserHelp.isError(_val) )
				return new cError(parserHelp.operand_str)
			else return new cString(_val);
	}
};
cRef3D.prototype.tocBool = function(){ return this.getValue().tocBool(); };
cRef3D.prototype.tocNumber = function(){ return this.getValue().tocNumber(); };
cRef3D.prototype.tocString = function(){ return this.getValue().tocString(); };
cRef3D.prototype.tryConvert = function(){ return this.getValue(); };
cRef3D.prototype.changeSheet = function(lastName,newName){
	if( this.ws.getName() == lastName ){
		this.ws = this._wb.getWorksheetByName( newName );
	}
};
cRef3D.prototype.toString = function(){
	var wsName = this.ws.getName();
	if( !rx_test_ws_name.test(wsName) ){
		return "'"+wsName.replace(/'/g,"''")+"'"+"!"+this._cells;
	}
	else{
		return wsName+"!"+this._cells;
	}
};
cRef3D.prototype.getWS = function(){ return this.ws; };

/** @constructor */
function cEmpty(){
	cEmpty.superclass.constructor.call(this,"");
    this.type = cElementType.empty;
}
extend(cEmpty,cBaseType);
cEmpty.prototype.tocNumber = function(){ return new cNumber(0); };
cEmpty.prototype.tocBool = function(){ return new cBool(false); };
cEmpty.prototype.tocString = function(){ return new cString(""); };
cEmpty.prototype.toString = function(){ return ""; };

/** @constructor */
function cName(val,wb){
	cName.superclass.constructor.call(this, val);
	this.wb = wb;
    this.type = cElementType.name;
}
extend(cName,cBaseType);
cName.prototype.toRef = function(wsID){
	var _3DRefTmp,
	ref = this.wb.getDefinesNames(this.value,wsID).Ref;
	if( (_3DRefTmp = parserHelp.is3DRef(ref,0))[0] ){
		var _wsFrom, _wsTo;
		_wsFrom = _3DRefTmp[1];
		_wsTo = ( (_3DRefTmp[2] !== null) && (_3DRefTmp[2] !== undefined) )? _3DRefTmp[2] : _wsFrom;
		if ( parserHelp.isArea(ref,ref.indexOf("!")+1) ){
			return new cArea3D(parserHelp.operand_str,_wsFrom, _wsTo, this.wb);
		}
		else if ( parserHelp.isRef(ref,ref.indexOf("!")+1) ){
			return new cRef3D(parserHelp.operand_str,_wsFrom,this.wb);
		}
	}
	return new cError("#REF!");
};

/** @constructor */
function cArray(){
	cArray.superclass.constructor.call(this);
	this.array = [];
	this.rowCount = 0;
	this.countElementInRow = [];
	this.countElement = 0;
    this.type = cElementType.array;
}
extend(cArray,cBaseType);
cArray.prototype.addRow = function(){
	this.array[this.array.length] = [];
	this.countElementInRow[this.rowCount++] = 0;
};
cArray.prototype.addElement = function(element){
	if( this.array.length == 0){
		this.addRow();
	}
	var arr = this.array,
		subArr = arr[this.rowCount-1];
	subArr[subArr.length] = element;
	this.countElementInRow[this.rowCount-1]++;
	this.countElement++;
};
cArray.prototype.getRow = function(rowIndex){
	if( rowIndex < 0 || rowIndex > this.array.length-1 )
		return null;
	return this.array[rowIndex];
};
cArray.prototype.getCol = function(colIndex){
	var col = [];
	for( var i = 0; i < this.rowCount; i++){
		col.push(this.array[i][colIndex])
	}
	return col;
};
cArray.prototype.getElementRowCol = function(row,col){
	if( row > this.rowCount || col > this.getCountElementInRow() )
		return new cError( cErrorType.not_available );
	return this.array[row][col];
};
cArray.prototype.getElement = function(index){
	for( var i = 0; i < this.rowCount; i++){
		if( index > this.countElementInRow[i].length )
			index -= this.countElementInRow[i].length;
		else 
			return this.array[i][index];
	}
	return null;
};
cArray.prototype.foreach = function(action){
	if( typeof (action) != 'function' ){ return; }
	for( var ir = 0; ir < this.rowCount; ir++ ){
		for( var ic = 0; ic < this.countElementInRow[ir]; ic++){
			if( action.call(this,this.array[ir][ic],ir,ic) )
				return true;
		}
	}
};
cArray.prototype.getCountElement = function(){ return this.countElement; };
cArray.prototype.getCountElementInRow = function(){ return this.countElementInRow[0]; };
cArray.prototype.getRowCount = function () {
    return this.rowCount;
};
cArray.prototype.tocNumber = function(){
	var retArr = new cArray();
	for( var ir = 0; ir < this.rowCount; ir++,retArr.addRow()){
		for( var ic = 0; ic < this.countElementInRow[ir]; ic++){
			retArr.addElement(this.array[ir][ic].tocNumber());
		}
		if( ir == this.rowCount - 1 )
			break;
	}
	return retArr;
};
cArray.prototype.tocString = function(){
	var retArr = new cArray();
	for( var ir = 0; ir < this.rowCount; ir++,retArr.addRow()){
		for( var ic = 0; ic < this.countElementInRow[ir]; ic++){
			retArr.addElement(this.array[ir][ic].tocString());
		}
		if( ir == this.rowCount - 1 )
			break;
	}
	return retArr;
};
cArray.prototype.tocBool = function(){
	var retArr = new cArray();
	for( var ir = 0; ir < this.rowCount; ir++,retArr.addRow()){
		for( var ic = 0; ic < this.countElementInRow[ir]; ic++){
			retArr.addElement(this.array[ir][ic].tocBool());
		}
		if( ir == this.rowCount - 1 )
			break;
	}
	return retArr;
};
cArray.prototype.toString = function(){
	var ret="";
	for( var ir = 0; ir < this.rowCount; ir++,ret+=";" ){
		for( var ic = 0; ic < this.countElementInRow[ir]; ic++,ret+=","){
			if ( this.array[ir][ic] instanceof cString ){
				ret+='"'+this.array[ir][ic].toString()+'"';
			}
			else
				ret+=this.array[ir][ic].toString()+"";
		}
		if ( ret[ret.length-1]==",")
			ret = ret.substring(0,ret.length-1)
	}
	if ( ret[ret.length-1]==";")
		ret = ret.substring(0, ret.length - 1);
	return "{"+ret+"}";
};
cArray.prototype.isValidArray = function(){
	for( var i = 0; i < this.rowCount-1; i++){
		if( this.countElementInRow[i] - this.countElementInRow[i+1] == 0)
			continue;
		else 
			return false;
	}
	return true;
};

/** класс отвечающий за парсинг строки с формулой, подсчета формулы, перестройки формулы при манипуляции с ячейкой*/
/** @constructor */
function parserFormula(formula,_cellId,_ws){
    var that = this;
    this.is3D = false;
    this.cellId = _cellId;
	this.cellAddress = new CellAddress(this.cellId);
    this.ws = _ws;
	this.wb = this.ws.workbook
    this.value = null;
    this.Formula="";
    this.pCurrPos = 0;
    this.elemArr = [];
    this.outStack = [];
    this.operand_str = null;
    this.error = [];
    this.Formula = formula;
}
parserFormula.prototype = {

	/** @type parserFormula */
	constructor: parserFormula,
	
	setFormula : function(formula){
		this.Formula = formula;
		this.cellId = _cellId;
		this.ws = _ws;
		this.value = null;
		this.pCurrPos = 0;
		this.elemArr = [];
		this.outStack = [];
		this.operand_str = null;

	},

	setCellId: function(cellId){
		this.cellId = cellId;
		this.cellAddress = new CellAddress(cellId);
	},
	
	parse : function(){
	
		if ( this.isParsed )
			return this.isParsed;
		/*
			Парсер формулы реализует алгоритм перевода инфиксной формы записи выражения в постфиксную или Обратную Польскую Нотацию. Что упрощает вычисление результата формулы.
			При разборе формулы важен порядок проверки очередной части выражения на принадлежность тому или иному типу.
		*/
		var operand_expected  = true;
		while(this.pCurrPos < this.Formula.length){
			/* Operators*/
			if ( parserHelp.isOperator.call(this,this.Formula,this.pCurrPos)/*  || isNextPtg(this.formula,this.pCurrPos) */ ){
				var found_operator = null;

				if ( operand_expected ){
					if(this.operand_str == "-") {
						operand_expected = true;
						found_operator = cFormulaOperators['un_minus']();
					}
					else if(this.operand_str == "+") {
						operand_expected = true;
						found_operator = cFormulaOperators['un_plus']();
					}
					else{
						this.error.push(c_oAscError.ID.FrmlWrongOperator);
						this.outStack = [];
						this.elemArr = [];
						return false;
					}
				}
				else if( !operand_expected ){
					if(this.operand_str == "-") {
						operand_expected = true;
						found_operator = cFormulaOperators['-']();
					}
					else if(this.operand_str == "+") {
						operand_expected = true;
						found_operator = cFormulaOperators['+']();
					}
					else if(this.operand_str == "%") {
						operand_expected = false;
						found_operator = cFormulaOperators['%']();
					}
					else{
						if ( this.operand_str in cFormulaOperators){
							found_operator = cFormulaOperators[this.operand_str]();
							operand_expected = true;
						}
						else{
							this.error.push(c_oAscError.ID.FrmlWrongOperator);
							this.outStack = [];
							this.elemArr = [];
							return false;
						}
					}
				}
				else{
					this.error.push(c_oAscError.ID.FrmlWrongOperator);
					this.outStack = [];
					this.elemArr = [];
					return false;
				}

				while ( this.elemArr.length != 0 && (
					found_operator.isRightAssociative ?
					( found_operator.priority < this.elemArr[this.elemArr.length-1].priority ) :
					( found_operator.priority <= this.elemArr[this.elemArr.length-1].priority )
					)
				){
					this.outStack.push(this.elemArr.pop());
				}
				this.elemArr.push(found_operator);
			}

			/* Left & Right Parentheses */
			else if( parserHelp.isLeftParentheses.call(this,this.Formula,this.pCurrPos) ){
				operand_expected = true;
				this.elemArr.push(cFormulaOperators[this.operand_str]());
			}

			else if( parserHelp.isRightParentheses.call(this,this.Formula,this.pCurrPos) ){
				var wasLeftParentheses = false;
				var top_elem = null;
				if ( this.elemArr.length != 0 && ( (top_elem = this.elemArr[this.elemArr.length - 1]).name == "(" ) && operand_expected ){
					if ( top_elem.getArguments() > 1 ){
						this.outStack.push(new cEmpty());
					}
					else{
						top_elem.DecrementArguments();
					}
				}
				else{
					while( this.elemArr.length != 0 && !((top_elem = this.elemArr[this.elemArr.length - 1]).name == "(" ) ){
						if( top_elem.name in cFormulaOperators && operand_expected ){
							this.error.push(c_oAscError.ID.FrmlOperandExpected);
							this.outStack = [];
							this.elemArr = [];
							return false;
						}
						this.outStack.push( this.elemArr.pop() );
					}
				}
				if( this.elemArr.length == 0 || top_elem == null/* && !wasLeftParentheses */ ){
					this.outStack = [];
					this.elemArr = [];
					this.error.push(c_oAscError.ID.FrmlWrongCountParentheses);
					return false;
				}
				
				var p = top_elem, func;
				this.elemArr.pop();
				if ( this.elemArr.length != 0 && ( func = this.elemArr[this.elemArr.length - 1] ).type == cElementType.func ){
					p = this.elemArr.pop();
					if (top_elem.getArguments() > func.getMaxArguments()){
						this.outStack = [];
						this.elemArr = [];
						this.error.push(c_oAscError.ID.FrmlWrongMaxArgument);
						return false;
					}
					else{
						if (top_elem.getArguments() >= func.getMinArguments() ){
							func.setArgumentsCount(top_elem.getArguments());
						}
						else {
							this.outStack = [];
							this.elemArr = [];
							this.error.push(c_oAscError.ID.FrmlWrongCountArgument);
							return false;
						}
					}
				}
				else{
					// for (int i = 0; i < left_p.ParametersNum - 1; ++i)
					// {
						// ptgs_list.AddFirst(new PtgUnion()); // чета нужно добавить для Union.....
					// }
				}
				this.outStack.push(p);
				operand_expected = false;
			}

			/*Comma & arguments union*/
			else if( parserHelp.isComma.call(this,this.Formula,this.pCurrPos) ){
				/* if( operand_expected ){
					this.error.push(c_oAscError.ID.FrmlAnotherParsingError);
					this.outStack = [];
					this.elemArr = [];
					return false;
				} */
				var wasLeftParentheses = false;
				var stackLength = this.elemArr.length;
				var top_elem = null;
				if ( this.elemArr.length != 0 && this.elemArr[stackLength-1].name == "(" && operand_expected){
					this.outStack.push(new cEmpty());
					top_elem = this.elemArr[stackLength-1];
					wasLeftParentheses = true;
				}
				else{
					while( stackLength != 0){
						top_elem = this.elemArr[stackLength-1];
						if(top_elem.name == "("){
							wasLeftParentheses = true;
							break;
						}
						else {
							this.outStack.push(this.elemArr.pop());
							stackLength = this.elemArr.length;
						}
					}
				}
				if(!wasLeftParentheses){
					this.error.push(c_oAscError.ID.FrmlWrongCountParentheses);
					this.outStack = [];
					this.elemArr = [];
					return false;
				}
				top_elem.IncrementArguments();
				operand_expected = true;
			}

			/* Array */
			else if( parserHelp.isArray.call(this,this.Formula,this.pCurrPos) ){
				var pH = new parserHelper(), tO = {pCurrPos:0, Formula :this.operand_str}; 
				var pos = 0, arr = new cArray();
				while( tO.pCurrPos < tO.Formula.length ){
					
					if( pH.isComma.call(tO,tO.Formula,tO.pCurrPos) ){
						if ( tO.operand_str ==";" ){
							arr.addRow();
						}
					}
					else if ( pH.isBoolean.call(tO,tO.Formula,tO.pCurrPos) ){
						arr.addElement( new cBool( tO.operand_str ) );
					}
					else if ( pH.isString.call(tO,tO.Formula,tO.pCurrPos) ){
						arr.addElement( new cString( tO.operand_str ) );
					}
					else if ( pH.isError.call(tO,tO.Formula,tO.pCurrPos) ){
						arr.addElement( new cError( tO.operand_str ) );
					}
					else if( pH.isNumber.call(tO,tO.Formula,tO.pCurrPos) ){
						arr.addElement( new cNumber( parseFloat(tO.operand_str) ) );
					}
				}
				if( !arr.isValidArray() ){
					this.outStack = [];
					this.elemArr = [];
					this.error.push(c_oAscError.ID.FrmlAnotherParsingError);
					return false;
				}
				this.outStack.push(arr);
				operand_expected = false;
			}
			/* Operands*/
			else {
				var found_operand = null, _3DRefTmp = null;

				if( !operand_expected ){
					this.error.push(c_oAscError.ID.FrmlWrongOperator);
					this.outStack = [];
					this.elemArr = [];
					return false;
				}
				
				/* Booleans */
				if ( parserHelp.isBoolean.call(this,this.Formula,this.pCurrPos) ){
					found_operand = new cBool(this.operand_str);
				}

				/* Strings */
				else if ( parserHelp.isString.call(this,this.Formula,this.pCurrPos) ){
					found_operand = new cString(this.operand_str);
				}

				/* Errors */
				else if ( parserHelp.isError.call(this,this.Formula,this.pCurrPos) ){
					found_operand = new cError(this.operand_str);
				}

				/* Referens to 3D area: Sheet1:Sheet3!A1:B3, Sheet1:Sheet3!B3, Sheet1!B3*/
				else if( (_3DRefTmp = parserHelp.is3DRef.call(this,this.Formula,this.pCurrPos))[0] ){
					this.is3D = true;
					var _wsFrom = _3DRefTmp[1],
						_wsTo = ( (_3DRefTmp[2] !== null) && (_3DRefTmp[2] !== undefined) )? _3DRefTmp[2] : _wsFrom;
					if( !(this.wb.getWorksheetByName( _wsFrom ) && this.wb.getWorksheetByName( _wsTo )) ){
						this.error.push(c_oAscError.ID.FrmlAnotherParsingError);
						this.outStack = [];
						this.elemArr = [];
						return false;
					}
					if ( parserHelp.isArea.call(this,this.Formula,this.pCurrPos) ){
						found_operand = new cArea3D(this.operand_str.toUpperCase(), _wsFrom, _wsTo, this.wb);
						if(this.operand_str.indexOf("$") > -1)
							found_operand.isAbsolute = true;
					}
					else if ( parserHelp.isRef.call(this,this.Formula,this.pCurrPos) ){
						if( _wsTo != _wsFrom ){
							found_operand = new cArea3D(this.operand_str.toUpperCase(), _wsFrom, _wsTo, this.wb);
						}
						else{
							found_operand = new cRef3D(this.operand_str.toUpperCase(), _wsFrom, this.wb);
						}
						if(this.operand_str.indexOf("$") > -1)
							found_operand.isAbsolute = true;
					}
				}
				/* Referens to DefinesNames */
				else if ( parserHelp.isName.call(this,this.Formula,this.pCurrPos, this.wb)[0] ){ // Shall be placed strongly before Area and Ref
					found_operand = new cName(this.operand_str, this.wb);
				}
				/* Referens to cells area A1:A10 */
				else if ( parserHelp.isArea.call(this,this.Formula,this.pCurrPos) ){
					found_operand = new cArea(this.operand_str.toUpperCase(),this.ws);
					if(this.operand_str.indexOf("$") > -1)
						found_operand.isAbsolute = true;
				}
				/* Referens to cell A4 */
				else if ( parserHelp.isRef.call(this,this.Formula,this.pCurrPos,true) ){
					found_operand = new cRef(this.operand_str.toUpperCase(),this.ws);
					if(this.operand_str.indexOf("$") > -1)
						found_operand.isAbsolute = true;
				}

				/* Numbers*/
				else if( parserHelp.isNumber.call(this,this.Formula,this.pCurrPos)){
					found_operand = new cNumber( parseFloat(this.operand_str) );
				}

				/* Function*/
				else if ( parserHelp.isFunc.call(this,this.Formula,this.pCurrPos) ){

					var found_operator = null;
					if (this.operand_str.toUpperCase() in cFormulaFunction.Mathematic)//mathematic
						found_operator = cFormulaFunction.Mathematic[this.operand_str.toUpperCase()]();

					else if(this.operand_str.toUpperCase() in cFormulaFunction.Logical)//logical
						found_operator = cFormulaFunction.Logical[this.operand_str.toUpperCase()]();

					else if(this.operand_str.toUpperCase() in cFormulaFunction.Information)//information
						found_operator = cFormulaFunction.Information[this.operand_str.toUpperCase()]();

					else if(this.operand_str.toUpperCase() in cFormulaFunction.Statistical)//statistical
						found_operator = cFormulaFunction.Statistical[this.operand_str.toUpperCase()]();

					else if(this.operand_str.toUpperCase() in cFormulaFunction.TextAndData)//text and data
						found_operator = cFormulaFunction.TextAndData[this.operand_str.toUpperCase()]();

					else if(this.operand_str.toUpperCase() in cFormulaFunction.Cube)//cube
						found_operator = cFormulaFunction.Cube[this.operand_str.toUpperCase()]();

					else if(this.operand_str.toUpperCase() in cFormulaFunction.Database)//Database
						found_operator = cFormulaFunction.Database[this.operand_str.toUpperCase()]();

					else if(this.operand_str.toUpperCase() in cFormulaFunction.DateAndTime)//Date and time
						found_operator = cFormulaFunction.DateAndTime[this.operand_str.toUpperCase()]();

					else if(this.operand_str.toUpperCase() in cFormulaFunction.Engineering)//Engineering
						found_operator = cFormulaFunction.Engineering[this.operand_str.toUpperCase()]();

					else if(this.operand_str.toUpperCase() in cFormulaFunction.Financial)//Financial
						found_operator = cFormulaFunction.Financial[this.operand_str.toUpperCase()]();

					else if(this.operand_str.toUpperCase() in cFormulaFunction.LookupAndReference)//Lookup and reference
						found_operator = cFormulaFunction.LookupAndReference[this.operand_str.toUpperCase()]();

					if (found_operator != null && found_operator != undefined)
						this.elemArr.push(found_operator);
					else {
						this.error.push(c_oAscError.ID.FrmlWrongFunctionName);
						this.outStack = [];
						this.elemArr = [];
						return false;
					}
					operand_expected = false;
					continue;
				}

				if ( found_operand != null && found_operand != undefined ){
					this.outStack.push(found_operand);
					operand_expected = false;
				}
				else {
					this.error.push(c_oAscError.ID.FrmlAnotherParsingError);
					this.outStack = [];
					this.elemArr = [];
					return false;
				}
			}

		}
		if( operand_expected ){
			this.outStack = [];
			this.elemArr = [];
			this.error.push(c_oAscError.ID.FrmlOperandExpected);
			return false;
		}
		var parentCount = 0, operand;
		while(this.elemArr.length != 0){
			operand = this.elemArr.pop()
			if (operand.name == "(" || operand.name == ")"){
				this.outStack = [];
				this.elemArr = [];
				this.error.push(c_oAscError.ID.FrmlWrongCountParentheses);
				return false;
			}
			else
				this.outStack.push(operand);
		}
		if (this.outStack.length != 0)
			return this.isParsed = true;
		else
			return this.isParsed = false;
	},

	calculate : function(){
		if( this.outStack.length < 1){
			return this.value = new cError( cErrorType.wrong_name );
		}
		var elemArr = [], stack = [], _tmp, numFormat = -1;
		for(var i = 0; i < this.outStack.length; i++){
			_tmp = this.outStack[i];
			if( _tmp instanceof cName ){
				_tmp = _tmp.toRef(this.ws.getId());
			}
			stack[i] = _tmp;
		}
		var currentElement = null;
		while (stack.length != 0){
			currentElement = stack.shift();
			if( currentElement.name == "(" ){
				continue;
			}
			if ( currentElement.type == cElementType.operator || currentElement.type == cElementType.func ){
				if (elemArr.length <  currentElement.getArguments() ){
					elemArr = [];
					return this.value = new cError( cErrorType.unsupported_function);
				}
				else {
					var arg=[];
					for (var ind = 0; ind < currentElement.getArguments(); ind++){
						arg.unshift(elemArr.pop());
					}
					_tmp = currentElement.Calculate(arg,this.ws.getCell(this.cellAddress));
					if( _tmp.numFormat !== undefined && _tmp.numFormat !== null ){
						numFormat = _tmp.numFormat; //> numFormat ? _tmp.numFormat : numFormat;
					}
					else if( numFormat < 0 || currentElement.numFormat < currentElement.formatType.def){
						numFormat = currentElement.numFormat;
					}
					elemArr.push( _tmp );
				}
			}
			else {
				elemArr.push(currentElement);
			}
		}
		this.value = elemArr.pop();
		this.value.numFormat = numFormat;
		return this.value;
	},

	/* Метод возвращает все ссылки на ячейки которые учавствуют в формуле*/
	getRef : function(){
		var aOutRef = [];
		for(var i = 0; i < this.outStack.length; i++){
			var ref = this.outStack[i];
			if( ref instanceof cName ){
				ref = ref.toRef(this.ws.getId());
				if( ref instanceof cError )
					continue;
			}
			
			if(ref instanceof cRef || ref instanceof cRef3D || ref instanceof cArea){
				aOutRef.push({wsId:ref.ws.getWsId(),cell:ref._cells});
				continue;
			}
			else if(ref instanceof cArea3D){
				var wsR = ref.wsRange();
				for(var j=0;j < wsR.length; j++)
					aOutRef.push({wsId:wsR[a].Id,cell:ref._cells});
			}
		}
		return aOutRef;
	},

	/* Для обратной сборки функции иногда необходимо поменять ссылки на ячейки */
	changeOffset : function(offset){//offset = {offsetCol:intNumber, offsetRow:intNumber}
		for(var i = 0; i < this.outStack.length; i++){
			if(this.outStack[i] instanceof cRef || this.outStack[i] instanceof cRef3D || this.outStack[i] instanceof cArea){
				
				var r = this.outStack[i].getRange();
				if( !r ) break;
				
				if( this.outStack[i].isAbsolute ){
					this._changeOffsetHelper(this.outStack[i],offset);
				}
				else{
					var a,b;
					if( this.outStack[i] instanceof cArea && (r.isColumn() && offset.offsetRow != 0 || r.isRow() && offset.offsetCol != 0) ){
						continue;
					}
					r.setOffset(offset);
					if( r.isColumn() ){
						a = r.first.getColLetter();
						b = r.last.getColLetter();
					}
					else if( r.isRow() ){
						a = r.first.getRow();
						b = r.last.getRow();
					}
					else{
						a = r.first.getID(),
						b = r.last.getID();
					}
					
					
					if (a != b || this.outStack[i] instanceof cArea)
						this.outStack[i].value = this.outStack[i]._cells = a+":"+b;
					else this.outStack[i].value = this.outStack[i]._cells = a;
				}
				continue;
			}
			if(this.outStack[i] instanceof cArea3D){
				var r = this.outStack[i]._cells.indexOf(":")>-1? (new cArea( this.outStack[i]._cells,this.ws )) : (new cRef( this.outStack[i]._cells,this.ws ));
				var _r = r.getRange();
				
				if( !_r ) break;
				
				if( this.outStack[i].isAbsolute ){
					this._changeOffsetHelper(r,offset);
				}
				else{
					_r.setOffset(offset);
					var a = _r.first.getID(),
						b = _r.last.getID();
					if (a != b)
						r.value = r._cells = a+":"+b;
					else r.value = r._cells = a;
				}
				this.outStack[i]._cells = r._cells;
			}
		}
		return this;
	},

	/*
		Для изменения ссылок на конкретную ячейку.
		offset - на сколько сдвигаем ячейку (offset = {offsetCol:intNumber, offsetRow:intNumber})
		cellId - какую ячейку сдвигаем
	*/
	shiftCells : function(offset,oBBox,node,wsId,toDelete){

		for(var i = 0; i < this.outStack.length; i++){
			if( this.outStack[i] instanceof cRef ){
				if(  this.ws.Id != wsId ){
					continue;
				}
				if(toDelete){
					this.outStack[i] = new cError( cErrorType.bad_reference )
					continue;
				}
				if( node.cellId == this.outStack[i]._cells.replace(/\$/ig,"") ){
					if( this.outStack[i].isAbsolute ){
						this._changeOffsetHelper(this.outStack[i],offset);
					}
					else{
						var r = this.outStack[i].getRange();
							r.setOffset(offset);
						var a = r.first.getID(),
							b = r.last.getID();
						if (a != b)
							this.outStack[i].value = this.outStack[i]._cells = a+":"+b;
						else this.outStack[i].value = this.outStack[i]._cells = a;
						node.newCellId = this.outStack[i].value;
					}
				}
			}
			else if( this.outStack[i] instanceof cRef3D ){
				if( node.cellId == this.outStack[i]._cells.replace(/\$/ig,"") && this.outStack[i].ws == node.sheetId ){
					if( this.outStack[i].isAbsolute ){
						this._changeOffsetHelper(this.outStack[i],offset);
					}
					else{
						var r = this.outStack[i].getRange();
							r.setOffset(offset);
						var a = r.first.getID(),
							b = r.last.getID();
						if (a != b)
							this.outStack[i].value = this.outStack[i]._cells = a+":"+b;
						else this.outStack[i].value = this.outStack[i]._cells = a;
						node.newCellId = this.outStack[i].value;
					}
				}
			}
			else if(this.outStack[i] instanceof cArea3D){
			
				if( this.outStack[i].wsFrom.Id == this.outStack[i].wsTo.Id == node.sheetId && node.cellId == this.outStack[i]._cells.replace(/\$/ig,"") ){
				
					if( this.outStack[i].isAbsolute ){
						this._changeOffsetHelper(this.outStack[i],offset);
					}
					else{
						var r = this.outStack[i].getRange();
						r[0].setOffset(offset);
						this.outStack[i].value = this.outStack[i]._cells = r[0].getName();
						node.newCellId = this.outStack[i].value;
					}
					
				}
			}
			else if(this.outStack[i] instanceof cArea){
			
				if(  this.ws.Id != wsId ){
					continue;
				}
				
				if(toDelete){
					this.outStack[i] = new cError( cErrorType.bad_reference )
					continue;
				}
				
				if( node.cellId == this.outStack[i]._cells.replace(/\$/ig,"") ){
				
					if( this.outStack[i].isAbsolute ){
						this._changeOffsetHelper(this.outStack[i],offset);
					}
					else{
						var r = this.outStack[i].getRange();
						r.setOffset(offset);
						this.outStack[i].value = this.outStack[i]._cells = r.getName();
					}
					node.newCellId = this.outStack[i].value;
				}
				
			}
		}
	},

	stretchArea : function( offset, oBBox, node, wsId ){
		for(var i = 0; i < this.outStack.length; i++){
			if(this.outStack[i] instanceof cArea){
				if( this.outStack[i]._cells.replace(/\$/ig,"") == node.cellId || this.outStack[i]._cells.replace(/\$/ig,"") == node.newCellId ){
					if( this.outStack[i].isAbsolute ){
						this._changeOffsetHelper(this.outStack[i],offset);
					}
					else{
						var r = this.outStack[i].getRange();
							r.setOffsetLast(offset);
						var a = r.first.getID(),
							b = r.last.getID();
						if (a != b)
							this.outStack[i].value = this.outStack[i]._cells = a+":"+b;
						else this.outStack[i].value = this.outStack[i]._cells = a;
						node.newCellId = this.outStack[i].value;
					}
				}
			}
		}
	},
	
	/* При переименовывании листа необходимо поменять название листа в соответствующих ссылках */
	changeSheet : function(lastName,newName){
		if( this.is3D )
			for(var i = 0; i < this.outStack.length; i++){
				if( this.outStack[i] instanceof cRef3D && this.outStack[i].ws.getName() == lastName ){
					this.outStack[i].changeSheet(lastName,newName);
				}
				if( this.outStack[i] instanceof cArea3D ){
					this.outStack[i].changeSheet(lastName,newName);
				}
			}
		return this;
	},

	/* Сборка функции в инфиксную форму */
	assemble : function(){/*При сборке формул вида A1+A2+A3 формула получает вид (A1+A2)+A3. Добавить проверку приоритета операций.*/
		var str = "";
		var elemArr = [];
		var stack = [];
		for(var i = 0; i < this.outStack.length; i++)
			stack[i] = this.outStack[i];
		var currentElement = null;
		while (stack.length != 0){
			currentElement = stack.shift();
			if ( currentElement.type == cElementType.operator || currentElement.type == cElementType.func ){
					var arg=[];
					for (var ind = 0; ind < currentElement.getArguments(); ind++){
						arg.unshift( elemArr.pop() );
					}
					elemArr.push( currentElement.Assemble(arg) );
			}
			else {
				if(currentElement instanceof cString)
					currentElement = new cString("\""+currentElement.toString()+"\"");
				elemArr.push(currentElement);
			}
		}
		return elemArr.pop().toString();
	},
	
	_changeOffsetHelper : function(ref,offset){
		var m = ref._cells.match(/\$/g);
		if( m.length == 1 ){//для cRef, cRef3D, cArea. $A2, A$2, Sheet1!$A2, Sheet1!A$2, $A2:C4, A$2:C4, A2:$C4, A2:C$4.
			if( !(ref instanceof cArea) ){
				if ( ref._cells.indexOf("$") == 0){
					r = ref.getRange();
					r.setOffset({offsetCol:0, offsetRow:offset.offsetRow});
					ref.value = ref._cells = "$"+r.first.getID();
				} else{
					r = ref.getRange();
					r.setOffset({offsetCol:offset.offsetCol, offsetRow:0});
					ref.value = ref._cells = r.first.getColLetter()+"$"+r.first.getRow();
				}
			}
			else{
				var r = ref.getRange();
				var c = ref._cells.split(":");// так как ссылка вида A1:A4, делим на первую и последнюю ячейку.
				// проверяем в какой ячеейке находится абсолютная ссылка.
				if( c[0].indexOf("$") > -1 ){// если в первой ячейке
					if( c[0].indexOf("$") == 0 ){// абсолютна ли ссылка на столбец...
						r.first.moveRow(offset.offsetRow);
						r.last.moveCol(offset.offsetCol);
						r.last.moveRow(offset.offsetRow);
						ref.setRange("$" + r.first.getColLetter() + r.first.getRow() + ":" + r.last.getColLetter() + r.last.getRow());
					}
					else{// ... или абсолютна ссылка на строку
						r.first.moveCol(offset.offsetCol);
						r.last.moveCol(offset.offsetCol);
						r.last.moveRow(offset.offsetRow);
						ref.setRange(r.first.getColLetter() + "$" +  r.first.getRow() + ":" + r.last.getColLetter() + r.last.getRow());	
					}
				}
				else{// если в последней ячейке
					if( c[1].indexOf("$") == 0 ){// абсолютна ли ссылка на столбец...
						r.first.moveCol(offset.offsetCol);
						r.first.moveRow(offset.offsetRow);
						r.last.moveRow(offset.offsetRow);
						ref.setRange(r.first.getColLetter() + r.first.getRow() + ":" + "$" +  r.last.getColLetter() + r.last.getRow());
					}
					else{// ... или абсолютна ссылка на строку
						r.first.moveCol(offset.offsetCol);
						r.first.moveRow(offset.offsetRow);
						r.last.moveCol(offset.offsetCol);
						ref.setRange(r.first.getColLetter() + r.first.getRow() + ":" +  r.last.getColLetter() + "$" + r.last.getRow());
					}
				}
			}
		}
		else if( m.length == 2 ){//для cArea. $A$2:C4, A2:$C$4, $A2:$C4, $A2:C$4, A$2:$C4, A$2:C$4.
			if( ref instanceof cArea ){
				var r = ref.getRange();
				var c = ref._cells.split(":");
				if( c[1].indexOf("$") < 0 ){
					r.last.moveCol(offset.offsetCol);
					r.last.moveRow(offset.offsetRow);
					ref.setRange("$" + r.first.getColLetter() + "$" +  r.first.getRow() + ":" + r.last.getColLetter() + r.last.getRow());	
				}
				else if( c[0].indexOf("$") < 0 ){
					r.first.moveCol(offset.offsetCol);
					r.first.moveRow(offset.offsetRow);
					ref.setRange(r.first.getColLetter() + r.first.getRow() + ":" + "$" +  r.last.getColLetter() + "$" +  r.last.getRow());	
				}
				else{
					if( c[0].indexOf("$") == 0 && c[1].indexOf("$") == 0 ){
						r.first.moveRow(offset.offsetRow);
						r.last.moveRow(offset.offsetRow);
						ref.setRange("$" + r.first.getColLetter() + r.first.getRow() + ":" + "$" +  r.last.getColLetter() + r.last.getRow());
					}
					else if( c[0].indexOf("$") == 0 && c[1].indexOf("$") > 0 ){
						r.first.moveRow(offset.offsetRow);
						r.last.moveCol(offset.offsetCol);
						ref.setRange("$" + r.first.getColLetter() + r.first.getRow() + ":" + r.last.getColLetter() + "$" + r.last.getRow());
					}
					else if( c[0].indexOf("$") > 0 && c[1].indexOf("$") == 0 ){
						r.first.moveCol(offset.offsetCol);
						r.last.moveRow(offset.offsetRow);
						ref.setRange(r.first.getColLetter() + "$" + r.first.getRow() + ":" + "$" + r.last.getColLetter() + r.last.getRow());
					}
					else{
						r.first.moveCol(offset.offsetCol);
						r.last.moveCol(offset.offsetCol);
						ref.setRange(r.first.getColLetter() + "$" + r.first.getRow() + ":" + r.last.getColLetter() + "$" + r.last.getRow());
					}
				}
			}
		}
		else if( m.length == 3 ){//для cArea. $A$2:$C4, $A$2:C$4, $A2:$C$4, A$2:$C$4,
			if( ref instanceof cArea ){
				var r = ref.getRange();
				var c = ref._cells.split(":");
				if( c[0].match(/\$/g).length == 2 && c[1].indexOf("$") == 0){
					r.last.moveRow(offset.offsetRow);
					ref.setRange("$" + r.first.getColLetter() + "$" + r.first.getRow() + ":" + "$" + r.last.getColLetter() + r.last.getRow());
				}
				else if( c[0].match(/\$/g).length == 2 && c[1].indexOf("$") > 0){
					r.last.moveCol(offset.offsetCol);
					ref.setRange("$" + r.first.getColLetter() + "$" + r.first.getRow() + ":" + r.last.getColLetter() + "$" + r.last.getRow());
				}
				else if( c[1].match(/\$/g).length == 2 && c[0].indexOf("$") == 0){
					r.first.moveRow(offset.offsetRow);
					ref.setRange("$" + r.first.getColLetter() + r.first.getRow() + ":" + "$" + r.last.getColLetter() + "$" + r.last.getRow());
				}
				else if( c[1].match(/\$/g).length == 2 && c[0].indexOf("$") > 0){
					r.first.moveCol(offset.offsetCol);
					ref.setRange(r.first.getColLetter() + "$" + r.first.getRow() + ":" + "$" + r.last.getColLetter() + "$" + r.last.getRow());
				}
			}
		}
	},

	moveSheet: function(tempW){
		for(var i = 0; i < this.outStack.length; i++){
			if(this.outStack[i] instanceof cArea3D){
				this.outStack[i].moveSheet(tempW);
			}
		}
		return this;
	},
	
	buildDependencies: function(){

		var node = new Vertex(this.ws.Id, this.cellId, this.wb);

		this.wb.dependencyFormulas.addNode2( node );
		this.wb.dependencyFormulas.addN( this.ws.Id, this.cellId );
		
		for(var i = 0; i < this.outStack.length; i++){
			var ref = this.outStack[i];
			if( ref instanceof cName ){
				ref = ref.toRef(this.ws.getId());
				if( ref instanceof cError )
					continue;
			}
			
			if( (ref instanceof cRef || ref instanceof cRef3D || ref instanceof cArea) && ref.isValid() ){
				this.wb.dependencyFormulas.addEdge( this.ws.Id, this.cellId.replace(/\$/g,""), ref.getWsId(),ref._cells.replace(/\$/g,"") );
			}
			else if(ref instanceof cArea3D && ref.isValid() ){
				var wsR = ref.wsRange();
				for(var j=0;j < wsR.length; j++)
					this.wb.dependencyFormulas.addEdge( this.ws.Id, this.cellId.replace(/\$/g,""), wsR[j].Id, ref._cells.replace(/\$/g,"") );
			}
		}
	}

}

function parseNum( str ){
	if( str.indexOf("x") > -1 )//исключаем запись числа в 16-ричной форме из числа.
		return false;
	return !isNaN(str);
}
