"use strict";

/**
 * Created with JetBrains WebStorm.
 * User: Dmitry.Shahtanov
 * Date: 27.06.13
 * Time: 15:17
 * To change this template use File | Settings | File Templates.
 */
cFormulaFunction.TextAndData = {
    'groupName':"TextAndData",
    'ASC':cASC,
    'BAHTTEXT':cBAHTTEXT,
    'CHAR':cCHAR,
    'CLEAN':cCLEAN,
    'CODE':cCODE,
    'CONCATENATE':cCONCATENATE,
    'DOLLAR':cDOLLAR,
    'EXACT':cEXACT,
    'FIND':cFIND,
    'FINDB':cFINDB,
    'FIXED':cFIXED,
    'JIS':cJIS,
    'LEFT':cLEFT,
    'LEFTB':cLEFTB,
    'LEN':cLEN,
    'LENB':cLENB,
    'LOWER':cLOWER,
    'MID':cMID,
    'MIDB':cMIDB,
    'PHONETIC':cPHONETIC,
    'PROPER':cPROPER,
    'REPLACE':cREPLACE,
    'REPLACEB':cREPLACEB,
    'REPT':cREPT,
    'RIGHT':cRIGHT,
    'RIGHTB':cRIGHTB,
    'SEARCH':cSEARCH,
    'SEARCHB':cSEARCHB,
    'SUBSTITUTE':cSUBSTITUTE,
    'T':cT,
    'TEXT':cTEXT,
    'TRIM':cTRIM,
    'UPPER':cUPPER,
    'VALUE':cVALUE
}

function cASC() {
    cBaseFunction.call( this, "ASC" );
}
cASC.prototype = Object.create( cBaseFunction.prototype )

function cBAHTTEXT() {
    cBaseFunction.call( this, "BAHTTEXT" );
}
cBAHTTEXT.prototype = Object.create( cBaseFunction.prototype )

function cCHAR() {
//    cBaseFunction.call( this, "CHAR" );
//    this.setArgumentsMin( 1 );
//    this.setArgumentsMax( 1 );

    this.name = "CHAR";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 1;
    this.argumentsCurrent = 0;
    this.argumentsMax = 1;
    this.formatType = {
        def:-1, //подразумевается формат первой ячейки входящей в формулу.
        noneFormat:-2
    };
    this.numFormat = this.formatType.def;

}
cCHAR.prototype = Object.create( cBaseFunction.prototype )
cCHAR.prototype.Calculate = function ( arg ) {
    var arg0 = arg[0];

    if ( arg0 instanceof CArea || arg0 instanceof CArea3D ) {
        arg0 = arg0.cross( arguments[1].first ).tocNumber();
    }
    else if ( arg0 instanceof CArray ) {
        var ret = new CArray();
        arg0.foreach( function ( elem, r, c ) {
            var _elem = elem.tocNumber();
            if ( !ret.array[r] )
                ret.addRow();

            if ( _elem instanceof CError )
                ret.addElement( _elem );
            else
                ret.addElement( new CString( String.fromCharCode( _elem.getValue() ) ) );
        } )
        return this.value = ret;
    }

    arg0 = arg0.tocNumber();

    if ( arg0 instanceof CError ) {
        return this.value = arg0;
    }

    return this.value = new CString( String.fromCharCode( arg0.getValue() ) );
}
cCHAR.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( number )"
    };
}

function cCLEAN() {
//    cBaseFunction.call( this, "CLEAN" );
//    this.setArgumentsMin( 1 );
//    this.setArgumentsMax( 1 );

    this.name = "CLEAN";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 1;
    this.argumentsCurrent = 0;
    this.argumentsMax = 1;
    this.formatType = {
        def:-1, //подразумевается формат первой ячейки входящей в формулу.
        noneFormat:-2
    };
    this.numFormat = this.formatType.def;


}
cCLEAN.prototype = Object.create( cBaseFunction.prototype )
cCLEAN.prototype.Calculate = function ( arg ) {
    var arg0 = arg[0];

    if ( arg0 instanceof CArea || arg0 instanceof CArea3D ) {
        arg0 = arg0.cross( arguments[1].first ).tocNumber();
    }
    if ( arg0 instanceof CArray ) {
        arg0 = arg0.getElementRowCol( 0, 0 );
    }

    arg0 = arg0.tocString();

    var v = arg0.getValue(), l = v.length, res = "";

    for ( var i = 0; i < l; i++ ) {
        if ( v.charCodeAt( i ) > 0x1f )
            res += v[i];
    }

    return this.value = new CString( res );
}
cCLEAN.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( string )"
    };
}

function cCODE() {
//    cBaseFunction.call( this, "CODE" );
//    this.setArgumentsMin( 1 );
//    this.setArgumentsMax( 1 );

    this.name = "CODE";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 1;
    this.argumentsCurrent = 0;
    this.argumentsMax = 1;
    this.formatType = {
        def:-1, //подразумевается формат первой ячейки входящей в формулу.
        noneFormat:-2
    };
    this.numFormat = this.formatType.def;

}
cCODE.prototype = Object.create( cBaseFunction.prototype )
cCODE.prototype.Calculate = function ( arg ) {
    var arg0 = arg[0];

    if ( arg0 instanceof CArea || arg0 instanceof CArea3D ) {
        arg0 = arg0.cross( arguments[1].first ).tocString();
    }
    else if ( arg0 instanceof CArray ) {
        var ret = new CArray();
        arg0.foreach( function ( elem, r, c ) {
            var _elem = elem.tocString();
            if ( !ret.array[r] )
                ret.addRow();

            if ( _elem instanceof CError )
                ret.addElement( _elem );
            else
                ret.addElement( new CNumber( _elem.toString().charCodeAt() ) );
        } )
        return this.value = ret;
    }

    arg0 = arg0.tocString();

    if ( arg0 instanceof CError ) {
        return this.value = arg0;
    }

    return this.value = new CNumber( arg0.toString().charCodeAt() );
}
cCODE.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( string )"
    };
}

function cCONCATENATE() {
//    cBaseFunction.call( this, "CONCATENATE" );
//    this.setArgumentsMin( 1 );
//    this.setArgumentsMax( 255 );

    this.name = "CONCATENATE";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 1;
    this.argumentsCurrent = 0;
    this.argumentsMax = 255;
    this.formatType = {
        def:-1, //подразумевается формат первой ячейки входящей в формулу.
        noneFormat:-2
    };
    this.numFormat = this.formatType.def;

}
cCONCATENATE.prototype = Object.create( cBaseFunction.prototype )
cCONCATENATE.prototype.Calculate = function ( arg ) {
    var arg0 = new CString( "" ), argI;
    for ( var i = 0; i < this.argumentsCurrent; i++ ) {
        argI = arg[i];
        if ( argI instanceof CArea || argI instanceof CArea3D ) {
            argI = argI.cross( arguments[1].first );
        }
        argI = argI.tocString();
        if ( argI instanceof CError ) {
            return this.value = argI;
        }
        else if ( argI instanceof CArray ) {
            argI.foreach( function ( elem ) {
                if ( elem instanceof CError ) {
                    arg0 = elem;
                    return true;
                }

                arg0 = new CString( arg0.toString().concat( elem.toString() ) );

            } )
            if ( arg0 instanceof CError ) {
                return this.value = arg0;
            }
        }
        else
            arg0 = new CString( arg0.toString().concat( argI.toString() ) );
    }
    return this.value = arg0;
};
cCONCATENATE.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"(text1, text2, ...)"
    };
}

function cDOLLAR() {
//    cBaseFunction.call( this, "DOLLAR" );
//    this.setArgumentsMin( 1 );
//    this.setArgumentsMax( 2 );
//    this.setFormat( this.formatType.noneFormat );

    this.name = "DOLLAR";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 1;
    this.argumentsCurrent = 0;
    this.argumentsMax = 2;
    this.formatType = {
        def:-1, //подразумевается формат первой ячейки входящей в формулу.
        noneFormat:-2
    };
    this.numFormat = this.formatType.noneFormat;

}
cDOLLAR.prototype = Object.create( cBaseFunction.prototype )
cDOLLAR.prototype.Calculate = function ( arg ) {

    function SignZeroPositive( number ) {
        return number < 0 ? -1 : 1;
    }

    function truncate( n ) {
        return Math[n > 0 ? "floor" : "ceil"]( n );
    }

    function sign( n ) {
        return n == 0 ? 0 : n < 0 ? -1 : 1
    }

    function Floor( number, significance ) {
        var quotient = number / significance;
        if ( quotient == 0 ) {
            return 0;
        }
        var nolpiat = 5 * sign( quotient ) * Math.pow( 10, Math.floor( Math.log10( Math.abs( quotient ) ) ) - cExcelSignificantDigits );
        return truncate( quotient + nolpiat ) * significance;
    }

    function roundHelper( number, num_digits ) {
        if ( num_digits > cExcelMaxExponent ) {
            if ( Math.abs( number ) < 1 || num_digits < 1e10 ) // The values are obtained experimentally
            {
                return new CNumber( number );
            }
            return new CNumber( 0 );
        }
        else if ( num_digits < cExcelMinExponent ) {
            if ( Math.abs( number ) < 0.01 ) // The values are obtained experimentally
            {
                return new CNumber( number );
            }
            return new CNumber( 0 );
        }

        var significance = SignZeroPositive( number ) * Math.pow( 10, -truncate( num_digits ) );

        number += significance / 2;

        if ( number / significance == Infinity ) {
            return new CNumber( number );
        }

        return new CNumber( Floor( number, significance ) );
    }

    function toFix( str, skip ) {
        var res, _int, _dec, _tmp = ""

        if ( skip )
            return str;

        res = str.split( "." );
        _int = res[0];

        if ( res.length == 2 )
            _dec = res[1];

        _int = _int.split( "" ).reverse().join( "" ).match( /([^]{1,3})/ig )

        for ( var i = _int.length - 1; i >= 0; i-- ) {
            _tmp += _int[i].split( "" ).reverse().join( "" );
            if ( i != 0 )
                _tmp += ",";
        }

        if ( undefined != _dec )
            while ( _dec.length < arg1.getValue() ) _dec += "0";

        return "" + _tmp + ( res.length == 2 ? "." + _dec + "" : "");
    }

    var arg0 = arg[0],
        arg1 = arg[1] ? arg[1] : new CNumber( 2 ),
        arg2 = arg[2] ? arg[2] : new CBool( false );

    if ( arg0 instanceof CArea || arg0 instanceof CArea3D ) {
        arg0 = arg0.cross( arguments[1].first );
    }
    if ( arg1 instanceof CArea || arg1 instanceof CArea3D ) {
        arg1 = arg1.cross( arguments[1].first );
    }
    if ( arg2 instanceof CArea || arg2 instanceof CArea3D ) {
        arg2 = arg2.cross( arguments[1].first );
    }

    if ( arg0 instanceof CError ) return this.value = arg0;
    if ( arg1 instanceof CError ) return this.value = arg1;
    if ( arg2 instanceof CError ) return this.value = arg2;

    if ( arg0 instanceof CRef || arg0 instanceof CRef3D ) {
        arg0 = arg0.getValue();
        if ( arg0 instanceof CError ) return this.value = arg0;
        else if ( arg0 instanceof CString ) return this.value = new CError( cErrorType.wrong_value_type );
        else arg0 = arg0.tocNumber();
    }
    else arg0 = arg0.tocNumber();

    if ( arg1 instanceof CRef || arg1 instanceof CRef3D ) {
        arg1 = arg1.getValue();
        if ( arg1 instanceof CError ) return this.value = arg1;
        else if ( arg1 instanceof CString ) return this.value = new CError( cErrorType.wrong_value_type );
        else arg1 = arg1.tocNumber();
    }
    else arg1 = arg1.tocNumber();

    if ( arg0 instanceof CArray && arg1 instanceof CArray ) {
        if ( arg0.getCountElement() != arg1.getCountElement() || arg0.getRowCount() != arg1.getRowCount() ) {
            return this.value = new CError( cErrorType.not_available );
        }
        else {
            arg0.foreach( function ( elem, r, c ) {
                var a = elem;
                var b = arg1.getElementRowCol( r, c );
                if ( a instanceof CNumber && b instanceof CNumber ) {
                    var res = roundHelper( a.getValue(), b.getValue() );
                    this.array[r][c] = toFix( res.toString(), arg2.toBool() );
                }
                else
                    this.array[r][c] = new CError( cErrorType.wrong_value_type );
            } )
            return this.value = arg0;
        }
    }
    else if ( arg0 instanceof CArray ) {
        arg0.foreach( function ( elem, r, c ) {
            var a = elem;
            var b = arg1;
            if ( a instanceof CNumber && b instanceof CNumber ) {
                var res = roundHelper( a.getValue(), b.getValue() );
                this.array[r][c] = toFix( res.toString(), arg2.toBool() );
            }
            else
                this.array[r][c] = new CError( cErrorType.wrong_value_type );
        } )
        return this.value = arg0;
    }
    else if ( arg1 instanceof CArray ) {
        arg1.foreach( function ( elem, r, c ) {
            var a = arg0;
            var b = elem;
            if ( a instanceof CNumber && b instanceof CNumber ) {
                var res = roundHelper( a.getValue(), b.getValue() );
                this.array[r][c] = toFix( res.toString(), arg2.toBool() );
            }
            else
                this.array[r][c] = new CError( cErrorType.wrong_value_type );
        } )
        return this.value = arg1;
    }

    var number = arg0.getValue(), num_digits = arg1.getValue();

    this.value = roundHelper( number, num_digits ).getValue();

    var cNull = ""

    if ( num_digits > 0 ) {
        cNull = ".";
        for ( var i = 0; i < num_digits; i++, cNull += "0" ) {
        }
    }

    this.value = new CString( oNumFormatCache.get( "$#,##0" + cNull + ";($#,##0" + cNull + ")" ).format( roundHelper( number, num_digits ).getValue(), CellValueType.Number, gc_nMaxDigCount )[0].text )
    return this.value;
}
cDOLLAR.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( number [ , num-decimal ] )"
    };
}

function cEXACT() {
//    cBaseFunction.call( this, "EXACT" );
//    this.setArgumentsMin( 2 );
//    this.setArgumentsMax( 2 );

    this.name = "EXACT";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 2;
    this.argumentsCurrent = 0;
    this.argumentsMax = 2;
    this.formatType = {
        def:-1, //подразумевается формат первой ячейки входящей в формулу.
        noneFormat:-2
    };
    this.numFormat = this.formatType.def;

}
cEXACT.prototype = Object.create( cBaseFunction.prototype )
cEXACT.prototype.Calculate = function ( arg ) {
    var arg0 = arg[0], arg1 = arg[1];
    if ( arg0 instanceof CArea || arg0 instanceof CArea3D ) {
        arg0 = arg0.cross( arguments[1].first );
    }
    if ( arg1 instanceof CArea || arg1 instanceof CArea3D ) {
        arg1 = arg1.cross( arguments[1].first );
    }

    arg0 = arg0.tocString();
    arg1 = arg1.tocString();

    if ( arg0 instanceof CArray && arg1 instanceof CArray ) {
        arg0 = arg0.getElementRowCol( 0, 0 );
        arg1 = arg1.getElementRowCol( 0, 0 );
    }
    else if ( arg0 instanceof CArray ) {
        arg0 = arg0.getElementRowCol( 0, 0 );
    }
    else if ( arg1 instanceof CArray ) {
        arg1 = arg1.getElementRowCol( 0, 0 );
    }

    if ( arg0 instanceof CError )    return this.value = arg0;
    if ( arg1 instanceof CError )    return this.value = arg1;

    var arg0val = arg0.getValue(), arg1val = arg1.getValue();
    return this.value = new CBool( arg0val === arg1val );
}
cEXACT.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"(text1, text2)"
    };
}

function cFIND() {
//    cBaseFunction.call( this, "FIND" );
//    this.setArgumentsMin( 2 );
//    this.setArgumentsMax( 3 );

    this.name = "FIND";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 2;
    this.argumentsCurrent = 0;
    this.argumentsMax = 3;
    this.formatType = {
        def:-1, //подразумевается формат первой ячейки входящей в формулу.
        noneFormat:-2
    };
    this.numFormat = this.formatType.def;

}
cFIND.prototype = Object.create( cBaseFunction.prototype )
cFIND.prototype.Calculate = function ( arg ) {
    var arg0 = arg[0], arg1 = arg[1], arg2 = this.getArguments() == 3 ? arg[2] : null, res, str, searchStr, pos = -1;

    if ( arg0 instanceof CArea || arg0 instanceof CArea3D ) {
        arg0 = arg0.cross( arguments[1].first );
    }
    if ( arg1 instanceof CArea || arg1 instanceof CArea3D ) {
        arg1 = arg1.cross( arguments[1].first );
    }

    arg0 = arg0.tocString();
    arg1 = arg1.tocString();

    if ( arg2 !== null ) {

        if ( arg2 instanceof CArea || arg2 instanceof CArea3D ) {
            arg2 = arg2.cross( arguments[1].first );
        }

        arg2 = arg2.tocNumber();
        if ( arg2 instanceof CArray ) {
            arg2 = arg1.getElementRowCol( 0, 0 );
        }
        if ( arg2 instanceof CError )    return this.value = arg2;

        pos = arg2.getValue();
        pos = pos > 0 ? pos - 1 : pos;
    }

    if ( arg0 instanceof CArray ) {
        arg0 = arg0.getElementRowCol( 0, 0 );
    }
    if ( arg1 instanceof CArray ) {
        arg1 = arg1.getElementRowCol( 0, 0 );
    }

    if ( arg0 instanceof CError )    return this.value = arg0;
    if ( arg1 instanceof CError )    return this.value = arg1;

    str = arg1.getValue();
    searchStr = arg0.getValue();

    if ( arg2 ) {

        if ( pos > str.length || pos < 0 )
            return this.value = new CError( cErrorType.wrong_value_type );

        str = str.substring( pos );
        res = str.search( searchStr );
        if ( res >= 0 )
            res += pos;
    }
    else
        res = str.search( searchStr );

    if ( res < 0 )
        return this.value = new CError( cErrorType.wrong_value_type );

    return this.value = new CNumber( res + 1 );

}
cFIND.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( string-1 , string-2 [ , start-pos ] )"
    };
}

function cFINDB() {
    var r = new cFormulaFunction.TextAndData["FIND"]()
    r.setName( "FINDB" );
    return r;
}

function cFIXED() {
//    cBaseFunction.call( this, "FIXED" );
//    this.setArgumentsMin( 1 );
//    this.setArgumentsMax( 3 );

    this.name = "FIXED";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 1;
    this.argumentsCurrent = 0;
    this.argumentsMax = 3;
    this.formatType = {
        def:-1, //подразумевается формат первой ячейки входящей в формулу.
        noneFormat:-2
    };
    this.numFormat = this.formatType.def;

}
cFIXED.prototype = Object.create( cBaseFunction.prototype )
cFIXED.prototype.Calculate = function ( arg ) {

    function SignZeroPositive( number ) {
        return number < 0 ? -1 : 1;
    }

    function truncate( n ) {
        return Math[n > 0 ? "floor" : "ceil"]( n );
    }

    function sign( n ) {
        return n == 0 ? 0 : n < 0 ? -1 : 1
    }

    function Floor( number, significance ) {
        var quotient = number / significance;
        if ( quotient == 0 ) {
            return 0;
        }
        var nolpiat = 5 * sign( quotient ) * Math.pow( 10, Math.floor( Math.log10( Math.abs( quotient ) ) ) - cExcelSignificantDigits );
        return truncate( quotient + nolpiat ) * significance;
    }

    function roundHelper( number, num_digits ) {
        if ( num_digits > cExcelMaxExponent ) {
            if ( Math.abs( number ) < 1 || num_digits < 1e10 ) // The values are obtained experimentally
            {
                return new CNumber( number );
            }
            return new CNumber( 0 );
        }
        else if ( num_digits < cExcelMinExponent ) {
            if ( Math.abs( number ) < 0.01 ) // The values are obtained experimentally
            {
                return new CNumber( number );
            }
            return new CNumber( 0 );
        }

        var significance = SignZeroPositive( number ) * Math.pow( 10, -truncate( num_digits ) );

        number += significance / 2;

        if ( number / significance == Infinity ) {
            return new CNumber( number );
        }

        return new CNumber( Floor( number, significance ) );
    }

    function toFix( str, skip ) {
        var res, _int, _dec, _tmp = ""

        if ( skip )
            return str;

        res = str.split( "." );
        _int = res[0];

        if ( res.length == 2 )
            _dec = res[1];

        _int = _int.split( "" ).reverse().join( "" ).match( /([^]{1,3})/ig )

        for ( var i = _int.length - 1; i >= 0; i-- ) {
            _tmp += _int[i].split( "" ).reverse().join( "" );
            if ( i != 0 )
                _tmp += ",";
        }

        if ( undefined != _dec )
            while ( _dec.length < arg1.getValue() ) _dec += "0";

        return "" + _tmp + ( res.length == 2 ? "." + _dec + "" : "");
    }

    var arg0 = arg[0],
        arg1 = arg[1] ? arg[1] : new CNumber( 2 ),
        arg2 = arg[2] ? arg[2] : new CBool( false );

    if ( arg0 instanceof CArea || arg0 instanceof CArea3D ) {
        arg0 = arg0.cross( arguments[1].first );
    }
    if ( arg1 instanceof CArea || arg1 instanceof CArea3D ) {
        arg1 = arg1.cross( arguments[1].first );
    }
    if ( arg2 instanceof CArea || arg2 instanceof CArea3D ) {
        arg2 = arg2.cross( arguments[1].first );
    }

    if ( arg0 instanceof CError ) return this.value = arg0;
    if ( arg1 instanceof CError ) return this.value = arg1;
    if ( arg2 instanceof CError ) return this.value = arg2;

    if ( arg0 instanceof CRef || arg0 instanceof CRef3D ) {
        arg0 = arg0.getValue();
        if ( arg0 instanceof CError ) return this.value = arg0;
        else if ( arg0 instanceof CString ) return this.value = new CError( cErrorType.wrong_value_type );
        else arg0 = arg0.tocNumber();
    }
    else arg0 = arg0.tocNumber();

    if ( arg1 instanceof CRef || arg1 instanceof CRef3D ) {
        arg1 = arg1.getValue();
        if ( arg1 instanceof CError ) return this.value = arg1;
        else if ( arg1 instanceof CString ) return this.value = new CError( cErrorType.wrong_value_type );
        else arg1 = arg1.tocNumber();
    }
    else arg1 = arg1.tocNumber();

    if ( arg0 instanceof CArray && arg1 instanceof CArray ) {
        if ( arg0.getCountElement() != arg1.getCountElement() || arg0.getRowCount() != arg1.getRowCount() ) {
            return this.value = new CError( cErrorType.not_available );
        }
        else {
            arg0.foreach( function ( elem, r, c ) {
                var a = elem;
                var b = arg1.getElementRowCol( r, c );
                if ( a instanceof CNumber && b instanceof CNumber ) {
                    var res = roundHelper( a.getValue(), b.getValue() );
                    this.array[r][c] = toFix( res.toString(), arg2.toBool() );
                }
                else
                    this.array[r][c] = new CError( cErrorType.wrong_value_type );
            } )
            return this.value = arg0;
        }
    }
    else if ( arg0 instanceof CArray ) {
        arg0.foreach( function ( elem, r, c ) {
            var a = elem;
            var b = arg1;
            if ( a instanceof CNumber && b instanceof CNumber ) {
                var res = roundHelper( a.getValue(), b.getValue() );
                this.array[r][c] = toFix( res.toString(), arg2.toBool() );
            }
            else
                this.array[r][c] = new CError( cErrorType.wrong_value_type );
        } )
        return this.value = arg0;
    }
    else if ( arg1 instanceof CArray ) {
        arg1.foreach( function ( elem, r, c ) {
            var a = arg0;
            var b = elem;
            if ( a instanceof CNumber && b instanceof CNumber ) {
                var res = roundHelper( a.getValue(), b.getValue() );
                this.array[r][c] = toFix( res.toString(), arg2.toBool() );
            }
            else
                this.array[r][c] = new CError( cErrorType.wrong_value_type );
        } )
        return this.value = arg1;
    }

    var number = arg0.getValue(), num_digits = arg1.getValue();

    var cNull = ""

    if ( num_digits > 0 ) {
        cNull = ".";
        for ( var i = 0; i < num_digits; i++, cNull += "0" ) {
        }
    }
    return this.value = new CString( oNumFormatCache.get( "#" + (arg2.toBool() ? "" : ",") + "##0" + cNull ).format( roundHelper( number, num_digits ).getValue(), CellValueType.Number, gc_nMaxDigCount )[0].text )
}
cFIXED.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( number [ , [ num-decimal ] [ , suppress-commas-flag ] ] )"
    };
}

function cJIS() {
    cBaseFunction.call( this, "JIS" );
}
cJIS.prototype = Object.create( cBaseFunction.prototype )

function cLEFT() {
//    cBaseFunction.call( this, "LEFT" );
//    this.setArgumentsMin( 1 );
//    this.setArgumentsMax( 2 );

    this.name = "LEFT";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 1;
    this.argumentsCurrent = 0;
    this.argumentsMax = 2;
    this.formatType = {
        def:-1, //подразумевается формат первой ячейки входящей в формулу.
        noneFormat:-2
    };
    this.numFormat = this.formatType.def;

}
cLEFT.prototype = Object.create( cBaseFunction.prototype )
cLEFT.prototype.Calculate = function ( arg ) {
    var arg0 = arg[0], arg1 = this.argumentsCurrent == 1 ? new CNumber( 1 ) : arg[1];
    if ( arg0 instanceof CArea || arg0 instanceof CArea3D ) {
        arg0 = arg0.cross( arguments[1].first );
    }
    if ( arg1 instanceof CArea || arg1 instanceof CArea3D ) {
        arg1 = arg1.cross( arguments[1].first );
    }

    arg0 = arg0.tocString();
    arg1 = arg1.tocNumber();

    if ( arg0 instanceof CArray && arg1 instanceof CArray ) {
        arg0 = arg0.getElementRowCol( 0, 0 );
        arg1 = arg1.getElementRowCol( 0, 0 );
    }
    else if ( arg0 instanceof CArray ) {
        arg0 = arg0.getElementRowCol( 0, 0 );
    }
    else if ( arg1 instanceof CArray ) {
        arg1 = arg1.getElementRowCol( 0, 0 );
    }

    if ( arg0 instanceof CError )    return this.value = arg0;
    if ( arg1 instanceof CError )    return this.value = arg1;

    if ( arg1.getValue() < 0 ) return this.value = new CError( cErrorType.wrong_value_type );

    return this.value = new CString( arg0.getValue().substring( 0, arg1.getValue() ) )

}
cLEFT.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( string [ , number-chars ] )"
    };
}

function cLEFTB() {
    var r = new cFormulaFunction.TextAndData["LEFT"]()
    r.setName( "LEFTB" );
    return r;
}

function cLEN() {
//    cBaseFunction.call( this, "LEN" );
//    this.setArgumentsMin( 1 );
//    this.setArgumentsMax( 1 );

    this.name = "LEN";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 1;
    this.argumentsCurrent = 0;
    this.argumentsMax = 1;
    this.formatType = {
        def:-1, //подразумевается формат первой ячейки входящей в формулу.
        noneFormat:-2
    };
    this.numFormat = this.formatType.def;

}
cLEN.prototype = Object.create( cBaseFunction.prototype )
cLEN.prototype.Calculate = function ( arg ) {
    var arg0 = arg[0];
    if ( arg0 instanceof CArea || arg0 instanceof CArea3D ) {
        arg0 = arg0.cross( arguments[1].first );
    }

    arg0 = arg0.tocString();

    if ( arg0 instanceof CArray ) {
        arg0 = arg0.getElementRowCol( 0, 0 );
    }

    if ( arg0 instanceof CError )    return this.value = arg0;

    return this.value = new CNumber( arg0.getValue().length )

}
cLEN.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( string )"
    };
}

function cLENB() {
    var r = new cFormulaFunction.TextAndData["LEN"]();
    r.setName( "LENB" );
    return r;
}

function cLOWER() {
//    cBaseFunction.call( this, "LOWER" );
//    this.setArgumentsMin( 1 );
//    this.setArgumentsMax( 1 );

    this.name = "LOWER";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 1;
    this.argumentsCurrent = 0;
    this.argumentsMax = 1;
    this.formatType = {
        def:-1, //подразумевается формат первой ячейки входящей в формулу.
        noneFormat:-2
    };
    this.numFormat = this.formatType.def;

}
cLOWER.prototype = Object.create( cBaseFunction.prototype )
cLOWER.prototype.Calculate = function ( arg ) {
    var arg0 = arg[0];

    if ( arg0 instanceof CArea || arg0 instanceof CArea3D )
        arg0 = arg0.cross( arguments[1].first );

    arg0 = arg0.tocString();
    if ( arg0 instanceof CArray )
        arg0 = arg0.getElementRowCol( 0, 0 );

    if ( arg0 instanceof CError ) return this.value = arg0;

    return this.value = new CString( arg0.getValue().toLowerCase() );
}
cLOWER.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"(text)"
    };
}

function cMID() {
//    cBaseFunction.call( this, "MID" );
//    this.setArgumentsMin( 3 );
//    this.setArgumentsMax( 3 );

    this.name = "MID";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 3;
    this.argumentsCurrent = 0;
    this.argumentsMax = 3;
    this.formatType = {
        def:-1, //подразумевается формат первой ячейки входящей в формулу.
        noneFormat:-2
    };
    this.numFormat = this.formatType.def;

}
cMID.prototype = Object.create( cBaseFunction.prototype )
cMID.prototype.Calculate = function ( arg ) {
    var arg0 = arg[0], arg1 = arg[1], arg2 = arg[2];
    if ( arg0 instanceof CArea || arg0 instanceof CArea3D ) {
        arg0 = arg0.cross( arguments[1].first );
    }
    if ( arg1 instanceof CArea || arg1 instanceof CArea3D ) {
        arg1 = arg1.cross( arguments[1].first );
    }
    if ( arg2 instanceof CArea || arg2 instanceof CArea3D ) {
        arg2 = arg2.cross( arguments[1].first );
    }

    arg0 = arg0.tocString();
    arg1 = arg1.tocNumber();
    arg2 = arg2.tocNumber();

    if ( arg0 instanceof CArray ) {
        arg0 = arg0.getElementRowCol( 0, 0 );
    }
    if ( arg1 instanceof CArray ) {
        arg1 = arg1.getElementRowCol( 0, 0 );
    }
    if ( arg2 instanceof CArray ) {
        arg2 = arg2.getElementRowCol( 0, 0 );
    }

    if ( arg0 instanceof CError )    return this.value = arg0;
    if ( arg1 instanceof CError )    return this.value = arg1;
    if ( arg2 instanceof CError )    return this.value = arg2;
    if ( arg1.getValue() < 0 ) return this.value = new CError( cErrorType.wrong_value_type );
    if ( arg2.getValue() < 0 ) return this.value = new CError( cErrorType.wrong_value_type );

    var l = arg0.getValue().length;

    if ( arg1.getValue() > l )
        return this.value = new CString( "" );

    /* if( arg1.getValue() < l )
     return this.value = arg0; */

    return this.value = new CString( arg0.getValue().substr( arg1.getValue() == 0 ? 0 : arg1.getValue() - 1, arg2.getValue() ) )

}
cMID.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( string , start-pos , number-chars )"
    };
}

function cMIDB() {
    var r = new cFormulaFunction.TextAndData["MID"]();
    r.setName( "MIDB" );
    return r;
}

function cPHONETIC() {
    cBaseFunction.call( this, "PHONETIC" );
}
cPHONETIC.prototype = Object.create( cBaseFunction.prototype )

function cPROPER() {
//    cBaseFunction.call( this, "PROPER" );
//    this.setArgumentsMin( 1 );
//    this.setArgumentsMax( 1 );

    this.name = "PROPER";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 1;
    this.argumentsCurrent = 0;
    this.argumentsMax = 1;
    this.formatType = {
        def:-1, //подразумевается формат первой ячейки входящей в формулу.
        noneFormat:-2
    };
    this.numFormat = this.formatType.def;

}
cPROPER.prototype = Object.create( cBaseFunction.prototype )
cPROPER.prototype.Calculate = function ( arg ) {
    var reg_PROPER = new RegExp( "[-#$+*/^&%<\\[\\]='?_\\@!~`\">: ;.\\)\\(,]|\\d|\\s" ), arg0 = arg[0];

    function proper( str ) {
        var canUpper = true, retStr = "", regTest;
        for ( var i = 0; i < str.length; i++ ) {
            regTest = reg_PROPER.test( str[i] );

            if ( regTest ) {
                canUpper = true;
            }
            else {
                if ( canUpper ) {
                    retStr += str[i].toUpperCase();
                    canUpper = false;
                    continue;
                }
            }

            retStr += str[i].toLowerCase();

        }
        return retStr;
    }

    if ( arg0 instanceof CArea || arg0 instanceof CArea3D ) {
        arg0 = arg0.cross( arguments[1].first ).tocString();
    }
    else if ( arg0 instanceof CArray ) {
        var ret = new CArray();
        arg0.foreach( function ( elem, r, c ) {
            var _elem = elem.tocString();
            if ( !ret.array[r] )
                ret.addRow();

            if ( _elem instanceof CError )
                ret.addElement( _elem );
            else
                ret.addElement( new CString( proper( _elem.toString() ) ) );
        } )
        return this.value = ret;
    }

    arg0 = arg0.tocString();

    if ( arg0 instanceof CError ) {
        return this.value = arg0;
    }

    return this.value = new CString( proper( arg0.toString() ) );
}
cPROPER.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( string )"
    };
}

function cREPLACE() {
//    cBaseFunction.call( this, "REPLACE" );
//    this.setArgumentsMin( 4 );
//    this.setArgumentsMax( 4 );

    this.name = "REPLACE";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 4;
    this.argumentsCurrent = 0;
    this.argumentsMax = 4;
    this.formatType = {
        def:-1, //подразумевается формат первой ячейки входящей в формулу.
        noneFormat:-2
    };
    this.numFormat = this.formatType.def;

}
cREPLACE.prototype = Object.create( cBaseFunction.prototype )
cREPLACE.prototype.Calculate = function ( arg ) {
    var arg0 = arg[0], arg1 = arg[1], arg2 = arg[2], arg3 = arg[3];

    if ( arg0 instanceof CArea || arg0 instanceof CArea3D ) {
        arg0 = arg0.cross( arguments[1].first ).tocString();
    }
    else if ( arg0 instanceof CArray ) {
        arg0 = arg0.getElement( 0 ).tocString();
    }

    arg0 = arg0.tocString();

    if ( arg1 instanceof CArea || arg1 instanceof CArea3D ) {
        arg1 = arg1.cross( arguments[1].first ).tocNumber();
    }
    else if ( arg1 instanceof CArray ) {
        arg1 = arg1.getElement( 0 ).tocNumber();
    }

    arg1 = arg1.tocNumber();

    if ( arg2 instanceof CArea || arg2 instanceof CArea3D ) {
        arg2 = arg2.cross( arguments[1].first ).tocNumber();
    }
    else if ( arg2 instanceof CArray ) {
        arg2 = arg2.getElement( 0 ).tocNumber();
    }

    arg2 = arg2.tocNumber();

    if ( arg3 instanceof CArea || arg3 instanceof CArea3D ) {
        arg3 = arg3.cross( arguments[1].first ).tocString();
    }
    else if ( arg3 instanceof CArray ) {
        arg3 = arg3.getElement( 0 ).tocString();
    }

    arg3 = arg3.tocString();

    if ( arg0 instanceof CError )
        return this.value = arg0;
    if ( arg1 instanceof CError )
        return this.value = arg1;
    if ( arg2 instanceof CError )
        return this.value = arg2;
    if ( arg3 instanceof CError )
        return this.value = arg3;

    if ( arg1.getValue() < 1 || arg2.getValue() < 0 ) {
        return this.value = new CError( cErrorType.wrong_value_type );
    }

    var string1 = arg0.getValue(), string2 = arg3.getValue(), res = "";

    string1 = string1.split( "" );
    string1.splice( arg1.getValue() - 1, arg2.getValue(), string2 );
    for ( var i = 0; i < string1.length; i++ ) {
        res += string1[i];
    }

    return this.value = new CString( res );

}
cREPLACE.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( string-1, start-pos, number-chars, string-2 )"
    };
}

function cREPLACEB() {
    var r = new cFormulaFunction.TextAndData["REPLACE"]();
    r.setName( "REPLACEB" );
    return r;
}

function cREPT() {
//    cBaseFunction.call( this, "REPT" );
//    this.setArgumentsMin( 2 );
//    this.setArgumentsMax( 2 );

    this.name = "REPT";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 2;
    this.argumentsCurrent = 0;
    this.argumentsMax = 2;
    this.formatType = {
        def:-1, //подразумевается формат первой ячейки входящей в формулу.
        noneFormat:-2
    };
    this.numFormat = this.formatType.def;

}
cREPT.prototype = Object.create( cBaseFunction.prototype )
cREPT.prototype.Calculate = function ( arg ) {
    var arg0 = arg[0], arg1 = arg[1], res = "";
    if ( arg0 instanceof CError ) return this.value = arg0;
    if ( arg1 instanceof CError ) return this.value = arg1;

    if ( arg0 instanceof CArray && arg1 instanceof CArray ) {
        arg0 = arg0.getElementRowCol( 0, 0 );
        arg1 = arg1.getElementRowCol( 0, 0 );
    }
    else if ( arg0 instanceof CArray ) {
        arg0 = arg0.getElementRowCol( 0, 0 );
    }
    else if ( arg1 instanceof CArray ) {
        arg1 = arg1.getElementRowCol( 0, 0 );
    }


    if ( arg0 instanceof CArea || arg0 instanceof CArea3D ) {
        arg0 = arg0.cross( arguments[1].first );
    }
    arg0 = arg0.tocString();
    if ( arg0 instanceof CError )
        return this.value = arg0;

    if ( arg1 instanceof CArea || arg1 instanceof CArea3D ) {
        arg1 = arg1.cross( arguments[1].first ).tocNumber();
    }
    else if ( arg1 instanceof CRef || arg1 instanceof CRef3D ) {
        arg1 = arg1.getValue();
    }

    if ( arg1 instanceof CError )
        return this.value = arg1;
    else if ( arg1 instanceof CString )
        return this.value = new CError( cErrorType.wrong_value_type );
    else
        arg1 = arg1.tocNumber();

    if ( arg1.getValue() < 0 ) return this.value = new CError( cErrorType.wrong_value_type );

    for ( var i = 0; i < arg1.getValue(); i++ ) {
        res = res.concat( arg0.getValue() );
    }
    return this.value = new CString( res );
}
cREPT.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"(text, number_of_times)"
    };
}

function cRIGHT() {
//    cBaseFunction.call( this, "RIGHT" );
//    this.setArgumentsMin( 1 );
//    this.setArgumentsMax( 2 );

    this.name = "RIGTH";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 1;
    this.argumentsCurrent = 0;
    this.argumentsMax = 2;
    this.formatType = {
        def:-1, //подразумевается формат первой ячейки входящей в формулу.
        noneFormat:-2
    };
    this.numFormat = this.formatType.def;

}
cRIGHT.prototype = Object.create( cBaseFunction.prototype )
cRIGHT.prototype.Calculate = function ( arg ) {
    var arg0 = arg[0], arg1 = this.argumentsCurrent == 1 ? new CNumber( 1 ) : arg[1];
    if ( arg0 instanceof CArea || arg0 instanceof CArea3D ) {
        arg0 = arg0.cross( arguments[1].first );
    }
    if ( arg1 instanceof CArea || arg1 instanceof CArea3D ) {
        arg1 = arg1.cross( arguments[1].first );
    }

    arg0 = arg0.tocString();
    arg1 = arg1.tocNumber();

    if ( arg0 instanceof CArray && arg1 instanceof CArray ) {
        arg0 = arg0.getElementRowCol( 0, 0 );
        arg1 = arg1.getElementRowCol( 0, 0 );
    }
    else if ( arg0 instanceof CArray ) {
        arg0 = arg0.getElementRowCol( 0, 0 );
    }
    else if ( arg1 instanceof CArray ) {
        arg1 = arg1.getElementRowCol( 0, 0 );
    }

    if ( arg0 instanceof CError )    return this.value = arg0;
    if ( arg1 instanceof CError )    return this.value = arg1;

    if ( arg1.getValue() < 0 ) return this.value = new CError( cErrorType.wrong_value_type );
    var l = arg0.getValue().length, _number = l - arg1.getValue();
    return this.value = new CString( arg0.getValue().substring( _number < 0 ? 0 : _number, l ) )

}
cRIGHT.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( string [ , number-chars ] )"
    };
}

function cRIGHTB() {
    var r = new cFormulaFunction.TextAndData["RIGHT"]()
    r.setName( "RIGHTB" );
    return r;
}

function cSEARCH() {
//    cBaseFunction.call( this, "SEARCH" );
//    this.setArgumentsMin( 2 );
//    this.setArgumentsMax( 3 );

    this.name = "SEARCH";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 2;
    this.argumentsCurrent = 0;
    this.argumentsMax = 3;
    this.formatType = {
        def:-1, //подразумевается формат первой ячейки входящей в формулу.
        noneFormat:-2
    };
    this.numFormat = this.formatType.def;

}
cSEARCH.prototype = Object.create( cBaseFunction.prototype )
cSEARCH.prototype.Calculate = function ( arg ) {

    var arg0 = arg[0], arg1 = arg[1], arg2 = arg[2] ? arg[2] : new CNumber( 1 );

    if ( arg0 instanceof CArea || arg0 instanceof CArea3D ) {
        arg0 = arg0.cross( arguments[1].first ).tocString();
    }
    else if ( arg0 instanceof CArray ) {
        arg0 = arg0.getElement( 0 ).tocString();
    }

    arg0 = arg0.tocString();

    if ( arg1 instanceof CArea || arg1 instanceof CArea3D ) {
        arg1 = arg1.cross( arguments[1].first ).tocString();
    }
    else if ( arg1 instanceof CArray ) {
        arg1 = arg1.getElement( 0 ).tocString();
    }

    arg1 = arg1.tocString();

    if ( arg2 instanceof CArea || arg2 instanceof CArea3D ) {
        arg2 = arg2.cross( arguments[1].first ).tocNumber();
    }
    else if ( arg2 instanceof CArray ) {
        arg2 = arg2.getElement( 0 ).tocNumber();
    }

    arg2 = arg2.tocNumber();

    if ( arg0 instanceof CError )
        return this.value = arg0;
    if ( arg1 instanceof CError )
        return this.value = arg1;
    if ( arg2 instanceof CError )
        return this.value = arg2;

    if ( arg2.getValue() < 1 || arg2.getValue() > arg1.getValue().length ) {
        return this.value = new CError( cErrorType.wrong_value_type );
    }

    var string1 = arg0.getValue(), string2 = arg1.getValue(),
        valueForSearching = string1
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
                return $1 ? $0 : '.';
            } )
            .replace( /(~\*)/g, "\\*" ).replace( /(~\?)/g, "\\?" );
    valueForSearching = new RegExp( valueForSearching, "ig" );
    if ( string1 == "" )
        return this.value = arg2;


    var res = string2.substring( arg2.getValue() - 1 ).search( valueForSearching ) + arg2.getValue() - 1;

    if ( res < 0 )
        return this.value = new CError( cErrorType.wrong_value_type );

    return this.value = new CNumber( res + 1 );

}
cSEARCH.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( string-1 , string-2 [ , start-pos ] )"
    };
}

function cSEARCHB() {
    var r = new cFormulaFunction.TextAndData["SEARCH"]();
    r.setName( "SEARCHB" );
    return r;
}

function cSUBSTITUTE() {
//    cBaseFunction.call( this, "SUBSTITUTE" );
//    this.setArgumentsMin( 3 );
//    this.setArgumentsMax( 4 );

    this.name = "SUBTITUTE";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 3;
    this.argumentsCurrent = 0;
    this.argumentsMax = 4;
    this.formatType = {
        def:-1, //подразумевается формат первой ячейки входящей в формулу.
        noneFormat:-2
    };
    this.numFormat = this.formatType.def;

}
cSUBSTITUTE.prototype = Object.create( cBaseFunction.prototype )
cSUBSTITUTE.prototype.Calculate = function ( arg ) {
    var arg0 = arg[0], arg1 = arg[1], arg2 = arg[2], arg3 = arg[3] ? arg[3] : new CNumber( 0 );

    if ( arg0 instanceof CArea || arg0 instanceof CArea3D ) {
        arg0 = arg0.cross( arguments[1].first ).tocString();
    }
    else if ( arg0 instanceof CArray ) {
        arg0 = arg0.getElement( 0 ).tocString();
    }

    arg0 = arg0.tocString();

    if ( arg1 instanceof CArea || arg1 instanceof CArea3D ) {
        arg1 = arg1.cross( arguments[1].first ).tocString();
    }
    else if ( arg1 instanceof CArray ) {
        arg1 = arg1.getElement( 0 ).tocString();
    }

    arg1 = arg1.tocString();

    if ( arg2 instanceof CArea || arg2 instanceof CArea3D ) {
        arg2 = arg2.cross( arguments[1].first ).tocString();
    }
    else if ( arg2 instanceof CArray ) {
        arg2 = arg2.getElement( 0 ).tocString();
    }

    arg2 = arg2.tocString();

    if ( arg3 instanceof CArea || arg3 instanceof CArea3D ) {
        arg3 = arg3.cross( arguments[1].first ).tocNumber();
    }
    else if ( arg3 instanceof CArray ) {
        arg3 = arg3.getElement( 0 ).tocNumber();
    }

    arg3 = arg3.tocNumber();

    if ( arg0 instanceof CError )
        return this.value = arg0;
    if ( arg1 instanceof CError )
        return this.value = arg1;
    if ( arg2 instanceof CError )
        return this.value = arg2;
    if ( arg3 instanceof CError )
        return this.value = arg3;

    if ( arg3.getValue() < 0 ) {
        return this.value = new CError( cErrorType.wrong_value_type );
    }

    var string = arg0.getValue(), old_string = arg1.getValue(), new_string = arg2.getValue(), index = 0, res;
    res = string.replace( new RegExp( old_string, "g" ), function ( equal, p1, source ) {
        index++;
        if ( arg3.getValue() == 0 || arg3.getValue() > source.length )
            return new_string;
        else if ( arg3.getValue() == index ) {
            return new_string;
        }
        return equal;
    } )

    return this.value = new CString( res );

}
cSUBSTITUTE.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( string , old-string , new-string [ , occurence ] )"
    };
}

function cT() {
//    cBaseFunction.call( this, "T" );
//    this.setArgumentsMin( 1 );
//    this.setArgumentsMax( 1 );

    this.name = "T";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 1;
    this.argumentsCurrent = 0;
    this.argumentsMax = 1;
    this.formatType = {
        def:-1, //подразумевается формат первой ячейки входящей в формулу.
        noneFormat:-2
    };
    this.numFormat = this.formatType.def;

}
cT.prototype = Object.create( cBaseFunction.prototype )
cT.prototype.Calculate = function ( arg ) {
    var arg0 = arg[0];
    if ( arg0 instanceof CRef || arg0 instanceof CRef3D ) {
        arg0 = arg0.getValue();
    }
    else if ( arg0 instanceof CString || arg0 instanceof CError )
        return this.value = arg0;
    else if ( arg0 instanceof CArea || arg0 instanceof CArea3D ) {
        arg0 = arg0.cross( arguments[1].first );
    }
    else if ( arg[0] instanceof CArray ) {
        arg0 = arg[0].getElementRowCol( 0, 0 );
    }

    if ( arg0 instanceof CString || arg0 instanceof CError )
        return this.value = arg[0];
    else
        return this.value = new CEmpty();
}
cT.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( value )"
    };
}

function cTEXT() {
//    cBaseFunction.call( this, "TEXT" );
//    this.setArgumentsMin( 2 );
//    this.setArgumentsMax( 2 );

    this.name = "TEXT";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 2;
    this.argumentsCurrent = 0;
    this.argumentsMax = 2;
    this.formatType = {
        def:-1, //подразумевается формат первой ячейки входящей в формулу.
        noneFormat:-2
    };
    this.numFormat = this.formatType.def;

}
cTEXT.prototype = Object.create( cBaseFunction.prototype )
cTEXT.prototype.Calculate = function ( arg ) {
    var arg0 = arg[0], arg1 = arg[1];
    if ( arg0 instanceof CRef || arg0 instanceof CRef3D ) {
        arg0 = arg0.getValue();
    }
    else if ( arg0 instanceof CArea || arg0 instanceof CArea3D ) {
        arg0 = arg0.cross( arguments[1].first );
    }
    else if ( arg0 instanceof CArray ) {
        arg0 = arg0.getElementRowCol( 0, 0 );
    }

    if ( arg1 instanceof CRef || arg1 instanceof CRef3D ) {
        arg1 = arg1.getValue();
    }
    else if ( arg1 instanceof CArea || arg1 instanceof CArea3D ) {
        arg1 = arg1.cross( arguments[1].first );
    }
    else if ( arg1 instanceof CArray ) {
        arg1 = arg1.getElementRowCol( 0, 0 );
    }

    arg1 = arg1.tocString();

    if ( arg0 instanceof CError )    return this.value = arg0;
    if ( arg1 instanceof CError )    return this.value = arg1;

    var _tmp = arg0.tocNumber();
    if ( _tmp instanceof CNumber )
        arg0 = _tmp;

    var oFormat = oNumFormatCache.get( arg1.toString() );
    var aText = oFormat.format( arg0.getValue(), arg0 instanceof CNumber ? CellValueType.Number : CellValueType.String, gc_nMaxDigCountView, null );
    var text = "";

    for ( var i = 0, length = aText.length; i < length; ++i ) {

        if ( aText[i].format && aText[i].format.skip ) {
            text += " ";
            continue;
        }
        if ( aText[i].format && aText[i].format.repeat )
            continue;

        text += aText[i].text;
    }

    return this.value = new CString( text );
}
cTEXT.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( value , format )"
    };
}

function cTRIM() {
//    cBaseFunction.call( this, "TRIM" );
//    this.setArgumentsMin( 1 );
//    this.setArgumentsMax( 1 );

    this.name = "TRIM";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 1;
    this.argumentsCurrent = 0;
    this.argumentsMax = 1;
    this.formatType = {
        def:-1, //подразумевается формат первой ячейки входящей в формулу.
        noneFormat:-2
    };
    this.numFormat = this.formatType.def;

}
cTRIM.prototype = Object.create( cBaseFunction.prototype )
cTRIM.prototype.Calculate = function ( arg ) {
    var arg0 = arg[0];

    if ( arg0 instanceof CArea || arg0 instanceof CArea3D ) {
        arg0 = arg0.cross( arguments[1].first ).tocString();
    }
    else if ( arg0 instanceof CArray ) {
        arg0 = arg0.getElement( 0 ).tocString();
    }

    arg0 = arg0.tocString();

    if ( arg0 instanceof CError )
        return this.value = arg0;

    return this.value = new CString( arg0.getValue().replace( rx_space_g, function ( $0, $1, $2 ) {
        var res;
        rx_space.test( $2[$1 + 1] ) ? res = "" : res = $2[$1];
        return res;
    } ).replace( /^\s|\s$/g, "" ) )
}
cTRIM.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( string )"
    };
}

function cUPPER() {
//    cBaseFunction.call( this, "UPPER" );
//    this.setArgumentsMin( 1 );
//    this.setArgumentsMax( 1 );

    this.name = "UPPER";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 1;
    this.argumentsCurrent = 0;
    this.argumentsMax = 1;
    this.formatType = {
        def:-1, //подразумевается формат первой ячейки входящей в формулу.
        noneFormat:-2
    };
    this.numFormat = this.formatType.def;

}
cUPPER.prototype = Object.create( cBaseFunction.prototype )
cUPPER.prototype.Calculate = function ( arg ) {
    var arg0 = arg[0];
    if ( arg0 instanceof CArea || arg0 instanceof CArea3D ) {
        arg0 = arg0.cross( arguments[1].first );
    }
    if ( arg0 instanceof CArray )
        arg0 = arg0.getElementRowCol( 0, 0 );

    arg0 = arg0.tocString();

    if ( arg0 instanceof CError ) return this.value = arg0;
    return this.value = new CString( arg0.getValue().toUpperCase() );
}
cUPPER.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"(text)"
    };
}

function cVALUE() {
//    cBaseFunction.call( this, "VALUE" );
//    this.setArgumentsMin( 1 );
//    this.setArgumentsMax( 1 );
//    this.setFormat( this.formatType.noneFormat );

    this.name = "VALUE";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 1;
    this.argumentsCurrent = 0;
    this.argumentsMax = 1;
    this.formatType = {
        def:-1, //подразумевается формат первой ячейки входящей в формулу.
        noneFormat:-2
    };
    this.numFormat = this.formatType.noneFormat;

}
cVALUE.prototype = Object.create( cBaseFunction.prototype )
cVALUE.prototype.Calculate = function ( arg ) {
    var arg0 = arg[0];

    if ( arg0 instanceof CArea || arg0 instanceof CArea3D ) {
        arg0 = arg0.cross( arguments[1].first );
    }
    else if ( arg0 instanceof CArray ) {
        arg0 = arg0.getElementRowCol( 0, 0 );
    }

    arg0 = arg0.tocString();

    if ( arg0 instanceof CError )
        return this.value = arg0;

    var res = g_oFormatParser.parse( arg0.getValue() );

    if ( res )
        return this.value = new CNumber( res.value );
    else
        return this.value = new CError( cErrorType.wrong_value_type );

}
cVALUE.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( string )"
    };
}
