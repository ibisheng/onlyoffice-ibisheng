"use strict";

/**
 * Created with JetBrains WebStorm.
 * User: Dmitry.Shahtanov
 * Date: 27.06.13
 * Time: 15:18
 * To change this template use File | Settings | File Templates.
 */
cFormulaFunction.Statistical = {
    'groupName':"Statistical",
    'AVEDEV':cAVEDEV,
    'AVERAGE':cAVERAGE,
    'AVERAGEA':cAVERAGEA,
    'AVERAGEIF':cAVERAGEIF,
    'AVERAGEIFS':cAVERAGEIFS,
    'BETADIST':cBETADIST,
    'BETAINV':cBETAINV,
    'BINOMDIST':cBINOMDIST,
    'CHIDIST':cCHIDIST,
    'CHIINV':cCHIINV,
    'CHITEST':cCHITEST,
    'CONFIDENCE':cCONFIDENCE,
    'CORREL':cCORREL,
    'COUNT':cCOUNT,
    'COUNTA':cCOUNTA,
    'COUNTBLANK':cCOUNTBLANK,
    'COUNTIF':cCOUNTIF,
    'COUNTIFS':cCOUNTIFS,
    'COVAR':cCOVAR,
    'CRITBINOM':cCRITBINOM,
    'DEVSQ':cDEVSQ,
    'EXPONDIST':cEXPONDIST,
    'FDIST':cFDIST,
    'FINV':cFINV,
    'FISHER':cFISHER,
    'FISHERINV':cFISHERINV,
    'FORECAST':cFORECAST,
    'FREQUENCY':cFREQUENCY,
    'FTEST':cFTEST,
    'GAMMADIST':cGAMMADIST,
    'GAMMAINV':cGAMMAINV,
    'GAMMALN':cGAMMALN,
    'GEOMEAN':cGEOMEAN,
    'GROWTH':cGROWTH,
    'HARMEAN':cHARMEAN,
    'HYPGEOMDIST':cHYPGEOMDIST,
    'INTERCEPT':cINTERCEPT,
    'KURT':cKURT,
    'LARGE':cLARGE,
    'LINEST':cLINEST,
    'LOGEST':cLOGEST,
    'LOGINV':cLOGINV,
    'LOGNORMDIST':cLOGNORMDIST,
    'MAX':cMAX,
    'MAXA':cMAXA,
    'MEDIAN':cMEDIAN,
    'MIN':cMIN,
    'MINA':cMINA,
    'MODE':cMODE,
    'NEGBINOMDIST':cNEGBINOMDIST,
    'NORMDIST':cNORMDIST,
    'NORMINV':cNORMINV,
    'NORMSDIST':cNORMSDIST,
    'NORMSINV':cNORMSINV,
    'PEARSON':cPEARSON,
    'PERCENTILE':cPERCENTILE,
    'PERCENTRANK':cPERCENTRANK,
    'PERMUT':cPERMUT,
    'POISSON':cPOISSON,
    'PROB':cPROB,
    'QUARTILE':cQUARTILE,
    'RANK':cRANK,
    'RSQ':cRSQ,
    'SKEW':cSKEW,
    'SLOPE':cSLOPE,
    'SMALL':cSMALL,
    'STANDARDIZE':cSTANDARDIZE,
    'STDEV':cSTDEV,
    'STDEVA':cSTDEVA,
    'STDEVP':cSTDEVP,
    'STDEVPA':cSTDEVPA,
    'STEYX':cSTEYX,
    'TDIST':cTDIST,
    'TINV':cTINV,
    'TREND':cTREND,
    'TRIMMEAN':cTRIMMEAN,
    'TTEST':cTTEST,
    'VAR':cVAR,
    'VARA':cVARA,
    'VARP':cVARP,
    'VARPA':cVARPA,
    'WEIBULL':cWEIBULL,
    'ZTEST':cZTEST
}
function cAVEDEV() {
//    cBaseFunction.call( this, "AVEDEV" );
//    this.setArgumentsMin( 1 );
//    this.setArgumentsMax( 255 );

    this.name = "AVEDEV";
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
cAVEDEV.prototype = Object.create( cBaseFunction.prototype )
cAVEDEV.prototype.Calculate = function ( arg ) {
    var count = 0, sum = new CNumber( 0 ), arrX = [];
    for ( var i = 0; i < arg.length; i++ ) {
        var _arg = arg[i];
        if ( _arg instanceof CRef || _arg instanceof CRef3D ) {
            var _argV = _arg.getValue();
            if ( _argV instanceof CNumber ) {
                arrX.push( _argV );
                count++;
            }
        }
        else if ( _arg instanceof CArea || _arg instanceof CArea3D ) {
            var _argAreaValue = _arg.getValue();
            for ( var j = 0; j < _argAreaValue.length; j++ ) {
                var __arg = _argAreaValue[j];
                if ( __arg instanceof CNumber ) {
                    arrX.push( __arg );
                    count++;
                }
            }
        }
        else if ( _arg instanceof CArray ) {
            _arg.foreach( function ( elem ) {
                var e = elem.tocNumber();
                if ( e instanceof CNumber ) {
                    arrX.push( e );
                    count++;
                }
            } )
        }
        else {
            if ( _arg instanceof CError )
                continue;
            arrX.push( _arg );
            count++;
        }
    }

    for ( var i = 0; i < arrX.length; i++ ) {
        sum = _func[sum.type][arrX[i].type]( sum, arrX[i], "+" );
    }
    sum = new CNumber( sum.getValue() / count );
    var a = 0
    for ( var i = 0; i < arrX.length; i++ ) {
        a += Math.abs( _func[sum.type][arrX[i].type]( sum, arrX[i], "-" ).getValue() );
    }

    return this.value = new CNumber( a / count );
};
cAVEDEV.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( argument-list )"
    };
}


function cAVERAGE() {
//    cBaseFunction.call( this, "AVERAGE" );
//    this.setArgumentsMin( 1 );
//    this.setArgumentsMax( 255 );

    this.name = "AVERAGE";
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
cAVERAGE.prototype = Object.create( cBaseFunction.prototype )
cAVERAGE.prototype.Calculate = function ( arg ) {
    var count = 0, sum = new CNumber( 0 );
    for ( var i = 0; i < arg.length; i++ ) {
        var _arg = arg[i];
        if ( _arg instanceof CRef || _arg instanceof CRef3D ) {
            var _argV = _arg.getValue();
            if ( _argV instanceof CString || _argV instanceof CEmpty || _argV instanceof CBool ) {
                continue;
            }
            else if ( _argV instanceof CNumber ) {
                sum = _func[sum.type][_argV.type]( sum, _argV, "+" );
                count++;
            }
            else if ( _argV instanceof CError ) {
                return this.value = _argV;
            }
        }
        else if ( _arg instanceof CArea || _arg instanceof CArea3D ) {
            var _argAreaValue = _arg.getValue();
            for ( var j = 0; j < _argAreaValue.length; j++ ) {
                var __arg = _argAreaValue[j];
                if ( __arg instanceof CString || __arg instanceof CEmpty || __arg instanceof CBool ) {
                    continue;
                }
                else if ( __arg instanceof CNumber ) {
                    sum = _func[sum.type][__arg.type]( sum, __arg, "+" );
                    count++;
                }
                else if ( __arg instanceof CError ) {
                    return this.value = __arg;
                }
            }
        }
        else if ( _arg instanceof CArray ) {
            _arg.foreach( function ( elem ) {
                if ( elem instanceof CString || elem instanceof CEmpty || elem instanceof CBool ) {
                    return false;
                }
                var e = elem.tocNumber();
                if ( e instanceof CNumber ) {
                    sum = _func[sum.type][e.type]( sum, e, "+" );
                    count++;
                }
            } )
        }
        else {
            _arg = _arg.tocNumber();
            if ( _arg instanceof CError )
                return this.value = _arg;
            sum = _func[sum.type][_arg.type]( sum, _arg, "+" );
            count++;
        }
    }
    return this.value = new CNumber( sum.getValue() / count );
};
cAVERAGE.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( argument-list )"
    };
}

function cAVERAGEA() {
//    cBaseFunction.call( this, "AVERAGEA" );
//    this.setArgumentsMin( 1 );
//    this.setArgumentsMax( 255 );

    this.name = "AVERAGEA";
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
cAVERAGEA.prototype = Object.create( cBaseFunction.prototype )
cAVERAGEA.prototype.Calculate = function ( arg ) {
    var count = 0, sum = new CNumber( 0 );
    for ( var i = 0; i < arg.length; i++ ) {
        var _arg = arg[i];
        if ( _arg instanceof CRef || _arg instanceof CRef3D ) {
            var _argV = _arg.getValue();
            if ( _argV instanceof CNumber || _argV instanceof  CBool ) {
                sum = _func[sum.type][_argV.type]( sum, _argV, "+" );
                count++;
            }
            else if ( _argV instanceof CString ) {
                if ( parseNum( _argV.getValue() ) ) {
                    sum = _func[sum.type][_argV.type]( sum, _argV.tocNumber(), "+" );
                }
                count++;
            }
        }
        else if ( _arg instanceof CArea || _arg instanceof CArea3D ) {
            var _argAreaValue = _arg.getValue();
            for ( var j = 0; j < _argAreaValue.length; j++ ) {
                var __arg = _argAreaValue[j];
                if ( __arg instanceof CNumber || __arg instanceof  CBool ) {
                    sum = _func[sum.type][__arg.type]( sum, __arg, "+" );
                    count++;
                }
                else if ( __arg instanceof CString ) {
                    if ( parseNum( __arg.getValue() ) ) {
                        sum = _func[sum.type][__arg.type]( sum, __arg.tocNumber(), "+" );
                    }
                    count++;
                }
            }
        }
        else if ( _arg instanceof CArray ) {
            _arg.foreach( function ( elem ) {

                if ( elem instanceof CString || elem instanceof CEmpty ) {
                    return false;
                }

                var e = elem.tocNumber();
                if ( e instanceof CNumber ) {
                    sum = _func[sum.type][e.type]( sum, e, "+" );
                    count++;
                }
            } )
        }
        else {
            _arg = _arg.tocNumber();
            if ( _arg instanceof CError )
                return this.value = _arg;
            sum = _func[sum.type][_arg.type]( sum, _arg, "+" );
            count++;
        }
    }
    return this.value = new CNumber( sum.getValue() / count );
};
cAVERAGEA.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( argument-list )"
    };
}

function cAVERAGEIF() {
//    cBaseFunction.call( this, "AVERAGEIF" );
//    this.setArgumentsMin( 2 );
//    this.setArgumentsMax( 3 );

    this.name = "AVERAGEIF";
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
cAVERAGEIF.prototype = Object.create( cBaseFunction.prototype )
cAVERAGEIF.prototype.Calculate = function ( arg ) {
    var arg0 = arg[0], arg1 = arg[1], arg2 = arg[2] ? arg[2] : arg[0], _sum = 0, _count = 0, valueForSearching;
    if ( !(arg0 instanceof CRef || arg0 instanceof CRef3D || arg0 instanceof CArea) ) {
        return this.value = new CError( cErrorType.wrong_value_type );
    }

    if ( !(arg2 instanceof CRef || arg2 instanceof CRef3D || arg2 instanceof CArea) ) {
        return this.value = new CError( cErrorType.wrong_value_type );
    }

    if ( arg1 instanceof CArea || arg1 instanceof CArea3D ) {
        arg1 = arg1.cross( arguments[1].first );
    }
    else if ( arg1 instanceof CArray ) {
        arg1 = arg1.getElementRowCol( 0, 0 );
    }

    arg1 = arg1.tocString();

    if ( !(arg1 instanceof CString) ) {
        return this.value = new CError( cErrorType.wrong_value_type );
    }

    arg1 = arg1.toString();
    var operators = new RegExp( "^ *[<=> ]+ *" ), match = arg1.match( operators ),
        search, oper, val;
    if ( match ) {
        search = arg1.substr( match[0].length );
        oper = match[0].replace( /\s/g, "" );
    }
    else {
        search = arg1;
    }
    valueForSearching = parseNum( search ) ? new CNumber( search ) : new CString( search );
    if ( arg0 instanceof CArea ) {
        var r = arg0.getRange().first.getRow0(), ws = arg0.getWS(), c1 = arg2.getRange().first.getCol0(), i = 0;
        arg0.foreach2( function ( c ) {
            if ( matching( c, valueForSearching, oper ) ) {
                var r1 = r + i,
                    r2 = new CRef( ws.getRange3( r1, c1, r1, c1 ).getName(), ws );
                if ( r2.getValue() instanceof CNumber ) {
                    _sum += r2.getValue().getValue();
                    _count++;
                }
            }
            i++;
        } )
    }
    else {
        val = arg0.getValue();
        if ( matching( val, valueForSearching, oper ) ) {
            var r = arg0.getRange(), ws = arg0.getWS(),
                r1 = r.first.getRow0() + 0, c1 = arg2.getRange().first.getCol0();
            r = new CRef( ws.getRange3( r1, c1, r1, c1 ).getName(), ws );
            if ( r.getValue() instanceof CNumber ) {
                _sum += r.getValue().getValue();
                _count++;
            }
        }
    }

    if ( _count == 0 ) {
        return new CError( cErrorType.division_by_zero );
    }
    else {
        return this.value = new CNumber( _sum / _count );
    }
}
cAVERAGEIF.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( cell-range, selection-criteria [ , average-range ] )"
    };
}

function cAVERAGEIFS() {
    cBaseFunction.call( this, "AVERAGEIFS" );
}
cAVERAGEIFS.prototype = Object.create( cBaseFunction.prototype )

function cBETADIST() {/*Нет реализации в Google Docs*/
    cBaseFunction.call( this, "BETADIST" );
}
cBETADIST.prototype = Object.create( cBaseFunction.prototype )

function cBETAINV() {/*Нет реализации в Google Docs*/
    cBaseFunction.call( this, "BETAINV" );
}
cBETAINV.prototype = Object.create( cBaseFunction.prototype )

function cBINOMDIST() {
//    cBaseFunction.call( this, "BINOMDIST" );
//    this.setArgumentsMin( 4 );
//    this.setArgumentsMax( 4 );

    this.name = "BINOMDIST";
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
cBINOMDIST.prototype = Object.create( cBaseFunction.prototype )
cBINOMDIST.prototype.Calculate = function ( arg ) {
    var arg0 = arg[0], arg1 = arg[1], arg2 = arg[2], arg3 = arg[3];

    function binomdist( x, n, p ) {
        x = parseInt( x );
        n = parseInt( n );
        return Math.binomCoeff( n, x ) * Math.pow( p, x ) * Math.pow( 1 - p, n - x );
    }

    if ( arg0 instanceof CArea || arg0 instanceof CArea3D ) {
        arg0 = arg0.cross( arguments[1].first );
    }
    else if ( arg0 instanceof CArray ) {
        arg0 = arg0.getElement( 0 );
    }

    if ( arg1 instanceof CArea || arg1 instanceof CArea3D ) {
        arg1 = arg1.cross( arguments[1].first );
    }
    else if ( arg1 instanceof CArray ) {
        arg1 = arg1.getElement( 0 );
    }

    if ( arg2 instanceof CArea || arg2 instanceof CArea3D ) {
        arg2 = arg2.cross( arguments[1].first );
    }
    else if ( arg2 instanceof CArray ) {
        arg2 = arg2.getElement( 0 );
    }

    if ( arg3 instanceof CArea || arg3 instanceof CArea3D ) {
        arg3 = arg3.cross( arguments[1].first );
    }
    else if ( arg3 instanceof CArray ) {
        arg3 = arg3.getElement( 0 );
    }

    arg0 = arg0.tocNumber();
    arg1 = arg1.tocNumber();
    arg2 = arg2.tocNumber();
    arg3 = arg3.tocBool();

    if ( arg0 instanceof CError ) return this.value = arg0;
    if ( arg1 instanceof CError ) return this.value = arg1;
    if ( arg2 instanceof CError ) return this.value = arg2;
    if ( arg3 instanceof CError ) return this.value = arg3;


    if ( arg0.getValue() < 0 || arg0.getValue() > arg1.getValue() || arg2.getValue() < 0 || arg2.getValue() > 1 )
        return this.value = new CError( cErrorType.not_numeric );

    if ( arg3.toBool() ) {
        var x = parseInt( arg0.getValue() ), n = parseInt( arg1.getValue() ), p = arg2.getValue(), bm = 0;
        for ( var y = 0; y <= x; y++ ) {
            bm += binomdist( y, n, p );
        }
        return this.value = new CNumber( bm );
    }
    else
        return this.value = new CNumber( binomdist( arg0.getValue(), arg1.getValue(), arg2.getValue() ) );
}
cBINOMDIST.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( number-successes , number-trials , success-probability , cumulative-flag )"
    };
}

function cCHIDIST() {
    cBaseFunction.call( this, "CHIDIST" );
}
cCHIDIST.prototype = Object.create( cBaseFunction.prototype )

function cCHIINV() {
    cBaseFunction.call( this, "CHIINV" );
}
cCHIINV.prototype = Object.create( cBaseFunction.prototype )

function cCHITEST() {
    cBaseFunction.call( this, "CHITEST" );
}
cCHITEST.prototype = Object.create( cBaseFunction.prototype )

function cCONFIDENCE() {
//    cBaseFunction.call( this, "CONFIDENCE" );
//    this.setArgumentsMin( 3 );
//    this.setArgumentsMax( 3 );

    this.name = "CONFIDENCE";
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
cCONFIDENCE.prototype = Object.create( cBaseFunction.prototype )
cCONFIDENCE.prototype.Calculate = function ( arg ) {

    var alpha = arg[0], stdev_sigma = arg[1], size = arg[2];
    if ( alpha instanceof CArea || alpha instanceof CArea3D ) {
        alpha = alpha.cross( arguments[1].first );
    }
    else if ( alpha instanceof CArray ) {
        alpha = alpha.getElement( 0 );
    }

    if ( stdev_sigma instanceof CArea || stdev_sigma instanceof CArea3D ) {
        stdev_sigma = stdev_sigma.cross( arguments[1].first );
    }
    else if ( stdev_sigma instanceof CArray ) {
        stdev_sigma = stdev_sigma.getElement( 0 );
    }

    if ( size instanceof CArea || size instanceof CArea3D ) {
        size = size.cross( arguments[1].first );
    }
    else if ( size instanceof CArray ) {
        size = size.getElement( 0 );
    }

    alpha = alpha.tocNumber();
    stdev_sigma = stdev_sigma.tocNumber();
    size = size.tocNumber();

    if ( alpha instanceof CError ) return this.value = alpha;
    if ( stdev_sigma instanceof CError ) return this.value = stdev_sigma;
    if ( size instanceof CError ) return this.value = size;

    if ( alpha.getValue() <= 0 || alpha.getValue() >= 1 || stdev_sigma.getValue <= 0 || size.getValue() < 1 )
        return this.value = new CError( cErrorType.not_numeric );

    return this.value = new CNumber( gaussinv( 1.0 - alpha.getValue() / 2.0 ) * stdev_sigma.getValue() / Math.sqrt( size.getValue() ) );

}
cCONFIDENCE.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( alpha , standard-dev , size )"
    };
}

function cCORREL() {
//    cBaseFunction.call( this, "CORREL" );
//    this.setArgumentsMin( 2 );
//    this.setArgumentsMax( 2 );

    this.name = "CORREL";
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
cCORREL.prototype = Object.create( cBaseFunction.prototype )
cCORREL.prototype.Calculate = function ( arg ) {

    function correl( x, y ) {

        var s1 = 0, s2 = 0, s3 = 0, _x = 0, _y = 0, xLength = 0;
        if ( x.length != y.length )
            return new CError( cErrorType.not_available );
        for ( var i = 0; i < x.length; i++ ) {

            if ( !( x[i] instanceof CNumber && y[i] instanceof CNumber ) ) {
                continue;
            }

            _x += x[i].getValue();
            _y += y[i].getValue();
            xLength++;
        }

        _x /= xLength;
        _y /= xLength;

        for ( var i = 0; i < x.length; i++ ) {

            if ( !( x[i] instanceof CNumber && y[i] instanceof CNumber ) ) {
                continue;
            }

            s1 += (x[i].getValue() - _x) * (y[i].getValue() - _y);
            s2 += (x[i].getValue() - _x) * (x[i].getValue() - _x);
            s3 += (y[i].getValue() - _y) * (y[i].getValue() - _y);

        }

        if ( s2 == 0 || s3 == 0 )
            return new CError( cErrorType.division_by_zero );
        else
            return new CNumber( s1 / Math.sqrt( s2 * s3 ) );
    }

    var arg0 = arg[0], arg1 = arg[1], arr0 = [], arr1 = [];

    if ( arg0 instanceof CArea ) {
        arr0 = arg0.getValue();
    }
    else if ( arg0 instanceof CArray ) {
        arg0.foreach( function ( elem ) {
            arr0.push( elem );
        } );
    }
    else
        return this.value = CError( cErrorType.wrong_value_type )

    if ( arg1 instanceof CArea ) {
        arr1 = arg1.getValue();
    }
    else if ( arg1 instanceof CArray ) {
        arg1.foreach( function ( elem ) {
            arr1.push( elem );
        } );
    }
    else
        return this.value = CError( cErrorType.wrong_value_type )

    return this.value = correl( arr0, arr1 );

}
cCORREL.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( array-1 , array-2 )"
    };
}

function cCOUNT() {
//    cBaseFunction.call( this, "COUNT" );
//    this.setArgumentsMin( 1 );
//    this.setArgumentsMax( 255 );
//    this.setFormat( this.formatType.noneFormat );

    this.name = "COUNT";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 1;
    this.argumentsCurrent = 0;
    this.argumentsMax = 255;
    this.formatType = {
        def:-1, //подразумевается формат первой ячейки входящей в формулу.
        noneFormat:-2
    };
    this.numFormat = this.formatType.noneFormat;

}
cCOUNT.prototype = Object.create( cBaseFunction.prototype )
cCOUNT.prototype.Calculate = function ( arg ) {
    var count = 0;
    for ( var i = 0; i < arg.length; i++ ) {
        var _arg = arg[i];
        if ( _arg instanceof CRef || _arg instanceof CRef3D ) {
            var _argV = _arg.getValue();
            if ( _argV instanceof CNumber ) {
                count++;
            }
        }
        else if ( _arg instanceof CArea || _arg instanceof CArea3D ) {
            var _argAreaValue = _arg.getValue();
            for ( var j = 0; j < _argAreaValue.length; j++ ) {
                if ( _argAreaValue[j] instanceof CNumber ) {
                    count++;
                }
            }
        }
        else if ( _arg instanceof CNumber || _arg instanceof CBool || _arg instanceof CEmpty ) {
            count++;
        }
        else if ( _arg instanceof CString ) {
            if ( _arg.tocNumber() instanceof CNumber )
                count++;
        }
        else if ( _arg instanceof CArray ) {
            _arg.foreach( function ( elem ) {
                var e = elem.tocNumber();
                if ( e instanceof CNumber ) {
                    count++;
                }
            } )
        }
    }
    return this.value = new CNumber( count );
};
cCOUNT.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( argument-list )"
    };
}

function cCOUNTA() {
//    cBaseFunction.call( this, "COUNTA" );
//    this.setArgumentsMin( 1 );
//    this.setArgumentsMax( 255 );
//    this.setFormat( this.formatType.noneFormat );

    this.name = "COUNTA";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 1;
    this.argumentsCurrent = 0;
    this.argumentsMax = 255;
    this.formatType = {
        def:-1, //подразумевается формат первой ячейки входящей в формулу.
        noneFormat:-2
    };
    this.numFormat = this.formatType.noneFormat;

}
cCOUNTA.prototype = Object.create( cBaseFunction.prototype )
cCOUNTA.prototype.Calculate = function ( arg ) {
    var count = 0;
    for ( var i = 0; i < arg.length; i++ ) {
        var _arg = arg[i];
        if ( _arg instanceof CRef || _arg instanceof CRef3D ) {
            var _argV = _arg.getValue();
            if ( !(_argV instanceof CEmpty) ) {
                count++;
            }
        }
        else if ( _arg instanceof CArea || _arg instanceof CArea3D ) {
            var _argAreaValue = _arg.getValue();
            for ( var j = 0; j < _argAreaValue.length; j++ ) {
                if ( !(_argAreaValue[j] instanceof CEmpty) ) {
                    count++;
                }
            }
        }
        else if ( _arg instanceof CArray ) {
            _arg.foreach( function ( elem ) {
                if ( !(elem instanceof CEmpty) ) {
                    count++;
                }
            } )
        }
        else if ( !( _arg instanceof CEmpty ) ) {
            count++;
        }
    }
    return this.value = new CNumber( count );
};
cCOUNTA.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( argument-list )"
    };
}

function cCOUNTBLANK() {
//    cBaseFunction.call( this, "COUNTBLANK" );
//    this.setArgumentsMin( 1 );
//    this.setArgumentsMax( 1 );
//    this.setFormat( this.formatType.noneFormat );

    this.name = "COUNTBLANK";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 4;
    this.argumentsCurrent = 0;
    this.argumentsMax = 4;
    this.formatType = {
        def:-1, //подразумевается формат первой ячейки входящей в формулу.
        noneFormat:-2
    };
    this.numFormat = this.formatType.noneFormat;

}
cCOUNTBLANK.prototype = Object.create( cBaseFunction.prototype )
cCOUNTBLANK.prototype.Calculate = function ( arg ) {
    var arg0 = arg[0];
    if ( arg0 instanceof CArea || arg0 instanceof CArea3D )
        return this.value = arg0.countCells();
    else if ( arg0 instanceof CRef || arg0 instanceof CRef3D ) {
        return this.value = new CNumber( 1 );
    }
    else
        return this.value = new CError( cErrorType.bad_reference );
}
cCOUNTBLANK.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( argument-list )"
    };
}

function cCOUNTIF() {
//    cBaseFunction.call( this, "COUNTIF" );
//    this.setArgumentsMin( 2 );
//    this.setArgumentsMax( 2 );

    this.name = "COUNTIF";
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
cCOUNTIF.prototype = Object.create( cBaseFunction.prototype )
cCOUNTIF.prototype.Calculate = function ( arg ) {
    var arg0 = arg[0], arg1 = arg[1], _count = 0, valueForSearching;
    if ( !(arg0 instanceof CRef || arg0 instanceof CRef3D || arg0 instanceof CArea || arg0 instanceof CArea3D) ) {
        return this.value = new CError( cErrorType.wrong_value_type );
    }

    if ( arg1 instanceof CArea || arg1 instanceof CArea3D ) {
        arg1 = arg1.cross( arguments[1].first );
    }
    else if ( arg1 instanceof CArray ) {
        arg1 = arg1.getElementRowCol( 0, 0 );
    }

    arg1 = arg1.tocString();

    if ( !(arg1 instanceof CString) ) {
        return this.value = new CError( cErrorType.wrong_value_type );
    }

    arg1 = arg1.toString();
    var operators = new RegExp( "^ *[<=> ]+ *" ), search, oper, val,
        match = arg1.match( operators );

    if ( match ) {
        search = arg1.substr( match[0].length );
        oper = match[0].replace( /\s/g, "" );
    }
    else {
        search = arg1;
    }
    valueForSearching = parseNum( search ) ? new CNumber( search ) : new CString( search );
    if ( arg0 instanceof CArea ) {
        arg0.foreach2( function ( _val ) {
            _count += matching( _val, valueForSearching, oper );
        } )
    }
    else if ( arg0 instanceof CArea3D ) {
        val = arg0.getValue();
        for ( var i = 0; i < val.length; i++ ) {
            _count += matching( val[i], valueForSearching, oper );
        }
    }
    else {
        val = arg0.getValue();
        _count += matching( val, valueForSearching, oper );
    }

    return this.value = new CNumber( _count );
}
cCOUNTIF.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( cell-range, selection-criteria )"
    };
}

function cCOUNTIFS() {
    cBaseFunction.call( this, "COUNTIFS" );
}
cCOUNTIFS.prototype = Object.create( cBaseFunction.prototype )

function cCOVAR() {
//    cBaseFunction.call( this, "COVAR" );
//    this.setArgumentsMin( 2 );
//    this.setArgumentsMax( 2 );

    this.name = "COVAR";
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
cCOVAR.prototype = Object.create( cBaseFunction.prototype )
cCOVAR.prototype.Calculate = function ( arg ) {

    function covar( x, y ) {

        var s1 = 0, _x = 0, _y = 0, xLength = 0;
        for ( var i = 0; i < x.length; i++ ) {

            if ( !( x[i] instanceof CNumber && y[i] instanceof CNumber ) ) {
                continue;
            }

            _x += x[i].getValue();
            _y += y[i].getValue();
            xLength++;
        }

        if ( xLength == 0 )
            return new CError( cErrorType.division_by_zero );

        _x /= xLength;
        _y /= xLength;

        for ( var i = 0; i < x.length; i++ ) {

            if ( !( x[i] instanceof CNumber && y[i] instanceof CNumber ) ) {
                continue;
            }

            s1 += (x[i].getValue() - _x) * (y[i].getValue() - _y);

        }
        return new CNumber( s1 / xLength );
    }

    var arg0 = arg[0], arg1 = arg[1], arr0 = [], arr1 = [];

    if ( arg0 instanceof CArea ) {
        arr0 = arg0.getValue();
    }
    else if ( arg0 instanceof CArray ) {
        arg0.foreach( function ( elem ) {
            arr0.push( elem );
        } );
    }
    else
        return this.value = CError( cErrorType.wrong_value_type )

    if ( arg1 instanceof CArea ) {
        arr1 = arg1.getValue();
    }
    else if ( arg1 instanceof CArray ) {
        arg1.foreach( function ( elem ) {
            arr1.push( elem );
        } );
    }
    else
        return this.value = CError( cErrorType.wrong_value_type )

    return this.value = covar( arr0, arr1 );

}
cCOVAR.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( array-1 , array-2 )"
    };
}

function cCRITBINOM() {
//    cBaseFunction.call( this, "CRITBINOM" );
//    this.setArgumentsMin( 3 );
//    this.setArgumentsMax( 3 );

    this.name = "CRITBINOM";
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
cCRITBINOM.prototype = Object.create( cBaseFunction.prototype )
cCRITBINOM.prototype.Calculate = function ( arg ) {
    var n = arg[0], p = arg[1], alpha = arg[2];                    // alpha

    function critbinom( n, p, alpha ) {
        if ( n < 0 || alpha <= 0 || alpha >= 1 || p < 0 || p > 1 )
            return new CError( cErrorType.not_numeric );
        else {
            var q = 1 - p,
                factor = Math.pow( q, n );
            if ( factor == 0 ) {
                factor = Math.pow( p, n );
                if ( factor == 0.0 )
                    return new CError( cErrorType.wrong_value_type );
                else {
                    var sum = 1 - factor, max = n, i = 0;

                    for ( i = 0; i < max && sum >= alpha; i++ ) {
                        factor *= (n - i) / (i + 1) * q / p;
                        sum -= factor;
                    }
                    return new CNumber( n - i );
                }
            }
            else {
                var sum = factor, max = n, i = 0;

                for ( i = 0; i < max && sum < alpha; i++ ) {
                    factor *= (n - i) / (i + 1) * p / q;
                    sum += factor;
                }
                return new CNumber( i );
            }
        }
    }

    if ( alpha instanceof CArea || alpha instanceof CArea3D ) {
        alpha = alpha.cross( arguments[1].first );
    }
    else if ( alpha instanceof CArray ) {
        alpha = alpha.getElement( 0 );
    }

    if ( n instanceof CArea || n instanceof CArea3D ) {
        n = n.cross( arguments[1].first );
    }
    else if ( n instanceof CArray ) {
        n = n.getElement( 0 );
    }

    if ( p instanceof CArea || p instanceof CArea3D ) {
        p = p.cross( arguments[1].first );
    }
    else if ( p instanceof CArray ) {
        p = p.getElement( 0 );
    }

    alpha = alpha.tocNumber();
    n = n.tocNumber();
    p = p.tocNumber();

    if ( alpha instanceof CError ) return this.value = alpha;
    if ( n instanceof CError ) return this.value = n;
    if ( p instanceof CError ) return this.value = p;

    return this.value = critbinom( n, p, alpha );

}
cCRITBINOM.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( number-trials , success-probability , alpha )"
    };
}

function cDEVSQ() {
//    cBaseFunction.call( this, "DEVSQ" );
//    this.setArgumentsMin( 1 );
//    this.setArgumentsMax( 255 );

    this.name = "DEVSQ";
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
cDEVSQ.prototype = Object.create( cBaseFunction.prototype )
cDEVSQ.prototype.Calculate = function ( arg ) {

    function devsq( x ) {

        var s1 = 0, _x = 0, xLength = 0;
        for ( var i = 0; i < x.length; i++ ) {

            if ( x[i] instanceof CNumber ) {
                _x += x[i].getValue();
                xLength++;
            }

        }

        _x /= xLength;

        for ( var i = 0; i < x.length; i++ ) {

            if ( x[i] instanceof CNumber ) {
                s1 += Math.pow( x[i].getValue() - _x, 2 );
            }

        }

        return new CNumber( s1 );
    }

    var arr0 = [];

    for ( var j = 0; j < this.getArguments(); j++ ) {

        if ( arg[j] instanceof CArea || arg[j] instanceof CArea3D ) {
            arg[j].foreach2( function ( elem ) {
                if ( elem instanceof  CNumber )
                    arr0.push( elem );
            } );
        }
        else if ( arg[j] instanceof CRef || arg[j] instanceof CRef3D ) {
            var a = arg[j].getValue();
            if ( a instanceof  CNumber )
                arr0.push( a );
        }
        else if ( arg[j] instanceof CArray ) {
            arg[j].foreach( function ( elem ) {
                if ( elem instanceof  CNumber )
                    arr0.push( elem );
            } );
        }
        else if ( arg[j] instanceof CNumber || arg[j] instanceof CBool ) {
            arr0.push( arg[j].tocNumber() );
        }
        else if ( arg[j] instanceof CString ) {
            continue;
        }
        else
            return this.value = CError( cErrorType.wrong_value_type )

    }
    return this.value = devsq( arr0 );

}
cDEVSQ.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( argument-list )"
    };
}

function cEXPONDIST() {
//    cBaseFunction.call( this, "EXPONDIST" );
//    this.setArgumentsMin( 3 );
//    this.setArgumentsMax( 3 );

    this.name = "EXPODIST";
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
cEXPONDIST.prototype = Object.create( cBaseFunction.prototype )
cEXPONDIST.prototype.Calculate = function ( arg ) {
    var arg0 = arg[0], arg1 = arg[1], arg2 = arg[2], arg3 = arg[3];

    if ( arg0 instanceof CArea || arg0 instanceof CArea3D ) {
        arg0 = arg0.cross( arguments[1].first );
    }
    else if ( arg0 instanceof CArray ) {
        arg0 = arg0.getElement( 0 );
    }

    if ( arg1 instanceof CArea || arg1 instanceof CArea3D ) {
        arg1 = arg1.cross( arguments[1].first );
    }
    else if ( arg1 instanceof CArray ) {
        arg1 = arg1.getElement( 0 );
    }

    if ( arg2 instanceof CArea || arg2 instanceof CArea3D ) {
        arg2 = arg2.cross( arguments[1].first );
    }
    else if ( arg2 instanceof CArray ) {
        arg2 = arg2.getElement( 0 );
    }

    arg0 = arg0.tocNumber();
    arg1 = arg1.tocNumber();
    arg2 = arg2.tocBool();

    if ( arg0 instanceof CError ) return this.value = arg0;
    if ( arg1 instanceof CError ) return this.value = arg1;
    if ( arg2 instanceof CError ) return this.value = arg2;

    if ( arg0.getValue() < 0 || arg2.getValue() <= 0 )
        return this.value = new CError( cErrorType.not_numeric );

    if ( arg2.toBool() ) {
        return this.value = new CNumber( 1 - Math.exp( -arg1.getValue() * arg0.getValue() ) );
    }
    else
        return this.value = new CNumber( arg1.getValue() * Math.exp( -arg1.getValue() * arg0.getValue() ) );
}
cEXPONDIST.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( x , lambda , cumulative-flag )"
    };
}

function cFDIST() {
    cBaseFunction.call( this, "FDIST" );
}
cFDIST.prototype = Object.create( cBaseFunction.prototype )

function cFINV() {
    cBaseFunction.call( this, "FINV" );
}
cFINV.prototype = Object.create( cBaseFunction.prototype )

function cFISHER() {
//    cBaseFunction.call( this, "FISHER" );
//    this.setArgumentsMin( 1 );
//    this.setArgumentsMax( 1 );

    this.name = "FISHER";
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
cFISHER.prototype = Object.create( cBaseFunction.prototype )
cFISHER.prototype.Calculate = function ( arg ) {
    var arg0 = arg[0];

    function fisher( x ) {
        return 0.5 * Math.ln( (1 + x) / (1 - x) );
    }

    if ( arg0 instanceof CArea || arg0 instanceof CArea3D ) {
        arg0 = arg0.cross( arguments[1].first );
    }
    arg0 = arg0.tocNumber();
    if ( arg0 instanceof CError )
        return this.value = arg0;
    else if ( arg0 instanceof CArray ) {
        arg0.foreach( function ( elem, r, c ) {
            if ( elem instanceof CNumber ) {
                var a = fisher( elem.getValue() );
                this.array[r][c] = isNaN( a ) ? new CError( cErrorType.not_numeric ) : new CNumber( a );
            }
            else {
                this.array[r][c] = new CError( cErrorType.wrong_value_type );
            }
        } )
    }
    else {
        var a = fisher( arg0.getValue() );
        return this.value = isNaN( a ) ? new CError( cErrorType.not_numeric ) : new CNumber( a );
    }
    return this.value = arg0;

}
cFISHER.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( number )"
    };
}

function cFISHERINV() {
//    cBaseFunction.call( this, "FISHERINV" );
//    this.setArgumentsMin( 1 );
//    this.setArgumentsMax( 1 );

    this.name = "FISHERINV";
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
cFISHERINV.prototype = Object.create( cBaseFunction.prototype )
cFISHERINV.prototype.Calculate = function ( arg ) {
    var arg0 = arg[0];

    function fisherInv( x ) {
        return ( Math.exp( 2 * x ) - 1 ) / ( Math.exp( 2 * x ) + 1 );
    }

    if ( arg0 instanceof CArea || arg0 instanceof CArea3D ) {
        arg0 = arg0.cross( arguments[1].first );
    }
    arg0 = arg0.tocNumber();
    if ( arg0 instanceof CError )
        return this.value = arg0;
    else if ( arg0 instanceof CArray ) {
        arg0.foreach( function ( elem, r, c ) {
            if ( elem instanceof CNumber ) {
                var a = fisherInv( elem.getValue() );
                this.array[r][c] = isNaN( a ) ? new CError( cErrorType.not_numeric ) : new CNumber( a );
            }
            else {
                this.array[r][c] = new CError( cErrorType.wrong_value_type );
            }
        } )
    }
    else {
        var a = fisherInv( arg0.getValue() );
        return this.value = isNaN( a ) ? new CError( cErrorType.not_numeric ) : new CNumber( a );
    }
    return this.value = arg0;

}
cFISHERINV.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( number )"
    };
}

function cFORECAST() {
//    cBaseFunction.call( this, "FORECAST" );
//    this.setArgumentsMin( 3 );
//    this.setArgumentsMax( 3 );

    this.name = "FORECAST";
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
cFORECAST.prototype = Object.create( cBaseFunction.prototype )
cFORECAST.prototype.Calculate = function ( arg ) {

    function forecast( fx, y, x ) {

        var fSumDeltaXDeltaY = 0, fSumSqrDeltaX = 0, _x = 0, _y = 0, xLength = 0;
        for ( var i = 0; i < x.length; i++ ) {

            if ( !( x[i] instanceof CNumber && y[i] instanceof CNumber ) ) {
                continue;
            }

            _x += x[i].getValue();
            _y += y[i].getValue();
            xLength++;
        }

        _x /= xLength;
        _y /= xLength;

        for ( var i = 0; i < x.length; i++ ) {

            if ( !( x[i] instanceof CNumber && y[i] instanceof CNumber ) ) {
                continue;
            }

            var fValX = x[i].getValue();
            var fValY = y[i].getValue();

            fSumDeltaXDeltaY += ( fValX - _x ) * ( fValY - _y );
            fSumSqrDeltaX += ( fValX - _x ) * ( fValX - _x );

        }

        if ( fSumDeltaXDeltaY == 0 )
            return new CError( cErrorType.division_by_zero );
        else {
            return new CNumber( _y + fSumDeltaXDeltaY / fSumSqrDeltaX * ( fx.getValue() - _x ) );
        }

    }

    var arg0 = arg[0], arg1 = arg[1], arg2 = arg[2], arr0 = [], arr1 = [];

    if ( arg0 instanceof CArea || arg0 instanceof CArea3D ) {
        arg0 = arg0.cross( arguments[1].first );
    }
    else if ( arg0 instanceof CArray ) {
        arg0 = arg0.getElement( 0 );
    }
    arg0 = arg0.tocNumber();

    if ( arg0 instanceof CError ) return this.value = arg0;


    if ( arg1 instanceof CArea ) {
        arr0 = arg1.getValue();
    }
    else if ( arg1 instanceof CArray ) {
        arg1.foreach( function ( elem ) {
            arr0.push( elem );
        } );
    }
    else
        return this.value = CError( cErrorType.wrong_value_type )

    if ( arg2 instanceof CArea ) {
        arr1 = arg2.getValue();
    }
    else if ( arg2 instanceof CArray ) {
        arg2.foreach( function ( elem ) {
            arr1.push( elem );
        } );
    }
    else
        return this.value = CError( cErrorType.wrong_value_type )

    return this.value = forecast( arg0, arr0, arr1 );

}
cFORECAST.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( x , array-1 , array-2 )"
    };
}

function cFREQUENCY() {
//    cBaseFunction.call( this, "FREQUENCY" );
//    this.setArgumentsMin( 2 );
//    this.setArgumentsMax( 2 );
//    this.setFormat( this.formatType.noneFormat );

    this.name = "FREQUENCY";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 2;
    this.argumentsCurrent = 0;
    this.argumentsMax = 2;
    this.formatType = {
        def:-1, //подразумевается формат первой ячейки входящей в формулу.
        noneFormat:-2
    };
    this.numFormat = this.formatType.noneFormat;

}
cFREQUENCY.prototype = Object.create( cBaseFunction.prototype )
cFREQUENCY.prototype.Calculate = function ( arg ) {

    function frequency( A, B ) {

        function sort(a,b){
            return a - b;
        }

        var tA = [], tB = [Number.NEGATIVE_INFINITY];

        for ( var i = 0; i < A.length; i++ ) {
            for ( var j = 0; j < A[i].length; j++ ) {
                if ( A[i][j] instanceof  CError ) {
                    return A[i][j];
                }
                else if ( A[i][j] instanceof CNumber ) {
                    tA.push( A[i][j].getValue() );
                }
                else if ( A[i][j] instanceof CBool ) {
                    tA.push( A[i][j].tocNumber().getValue() );
                }
            }
        }
        for ( var i = 0; i < B.length; i++ ) {
            for ( var j = 0; j < B[i].length; j++ ) {
                if ( B[i][j] instanceof  CError ) {
                    return B[i][j];
                }
                else if ( B[i][j] instanceof CNumber ) {
                    tB.push( B[i][j].getValue() );
                }
                else if ( B[i][j] instanceof CBool ) {
                    tB.push( B[i][j].tocNumber().getValue() );
                }
            }
        }

        tA.sort( sort );
        tB.push( Number.POSITIVE_INFINITY );
        tB.sort( sort );

        var C = [[]], k = 0;
        for ( var i = 1; i < tB.length; i++, k++ ) {
            C[0][k] = new CNumber( 0 );
            for ( var j = 0; j < tA.length; j++ ) {
                if ( tA[j] > tB[i - 1] && tA[j] <= tB[i] ) {
                    var a = C[0][k].getValue();
                    C[0][k] = new CNumber( ++a );
                }
            }
        }
        var res = new CArray();
        res.fillFromArray( C );
        return res;
    }

    var arg0 = arg[0], arg1 = arg[1];
    if ( arg0 instanceof CArea || arg0 instanceof CArray ) {
        arg0 = arg0.getMatrix();
    }
    else if ( arg0 instanceof CArea3D ) {
        arg0 = arg0.getMatrix()[0];
    }
    else
        return this.value = new CError( cErrorType.not_available );

    if ( arg1 instanceof CArea || arg1 instanceof CArray ) {
        arg1 = arg1.getMatrix();
    }
    else if ( arg1 instanceof CArea3D ) {
        arg1 = arg1.getMatrix()[0];
    }
    else
        return this.value = new CError( cErrorType.not_available );

    return this.value = frequency( arg0, arg1 );

};
cFREQUENCY.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"(  data-array , bins-array )"
    };
}

function cFTEST() {
    cBaseFunction.call( this, "FTEST" );
    cFTEST.prototype = Object.create( cBaseFunction.prototype )
}

function cGAMMADIST() {
    cBaseFunction.call( this, "GAMMADIST" );
}
cGAMMADIST.prototype = Object.create( cBaseFunction.prototype )

function cGAMMAINV() {
    cBaseFunction.call( this, "GAMMAINV" );
}
cGAMMAINV.prototype = Object.create( cBaseFunction.prototype )

function cGAMMALN() {
//    cBaseFunction.call( this, "GAMMALN" );
//    this.setArgumentsMin( 1 );
//    this.setArgumentsMax( 1 );

    this.name = "GAMMALN";
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
cGAMMALN.prototype = Object.create( cBaseFunction.prototype )
cGAMMALN.prototype.Calculate = function ( arg ) {



    /*
     from OpenOffice Source.
     end
     */

    var arg0 = arg[0];
    if ( arg0 instanceof CArea || arg0 instanceof CArea3D ) {
        arg0 = arg0.cross( arguments[1].first );
    }
    arg0 = arg0.tocNumber();
    if ( arg0 instanceof CError )
        return this.value = arg0;
    else if ( arg0 instanceof CArray ) {
        arg0.foreach( function ( elem, r, c ) {
            if ( elem instanceof CNumber ) {
                var a = getLogGamma( elem.getValue() );
                this.array[r][c] = isNaN( a ) ? new CError( cErrorType.not_numeric ) : new CNumber( a );
            }
            else {
                this.array[r][c] = new CError( cErrorType.wrong_value_type );
            }
        } )
    }
    else {
        var a = getLogGamma( arg0.getValue() );
        return this.value = isNaN( a ) ? new CError( cErrorType.not_numeric ) : new CNumber( a );
    }
    return this.value = arg0;
}
cGAMMALN.prototype.getInfo = function () {
    return { name:this.name, args:"(number)" }
}

function cGEOMEAN() {
//    cBaseFunction.call( this, "GEOMEAN" );
//    this.setArgumentsMin( 1 );
//    this.setArgumentsMax( 255 );

    this.name = "GEOMEAN";
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
cGEOMEAN.prototype = Object.create( cBaseFunction.prototype )
cGEOMEAN.prototype.Calculate = function ( arg ) {

    function geommean( x ) {

        var _x = 1, xLength = 0, _tx;
        for ( var i = 0; i < x.length; i++ ) {

            if ( x[i] instanceof CNumber ) {
                _x *= x[i].getValue();
                xLength++;
            }
            else if ( ( x[i] instanceof CString || x[i] instanceof CBool ) && ( _tx = x[i].tocNumber()) instanceof CNumber ) {
                _x *= _tx.getValue();
                xLength++;
            }

        }

        if ( _x <= 0 )
            return new CError( cErrorType.not_numeric );
        else
            return new CNumber( Math.pow( _x, 1 / xLength ) );
    }

    var arr0 = [];

    for ( var j = 0; j < this.getArguments(); j++ ) {

        if ( arg[j] instanceof CArea || arg[j] instanceof CArea3D ) {
            arg[j].foreach2( function ( elem ) {
                if ( elem instanceof  CNumber )
                    arr0.push( elem );
            } );
        }
        else if ( arg[j] instanceof CRef || arg[j] instanceof CRef3D ) {
            var a = arg[j].getValue();
            if ( a instanceof  CNumber )
                arr0.push( a );
        }
        else if ( arg[j] instanceof CArray ) {
            arg[j].foreach( function ( elem ) {
                if ( elem instanceof  CNumber )
                    arr0.push( elem );
            } );
        }
        else if ( arg[j] instanceof CNumber || arg[j] instanceof CBool ) {
            arr0.push( arg[j].tocNumber() );
        }
        else if ( arg[j] instanceof CString && arg[j].tocNumber() instanceof CNumber ) {
            arr0.push( arg[j].tocNumber() );
        }
        else
            return this.value = CError( cErrorType.wrong_value_type )

    }
    return this.value = geommean( arr0 );

}
cGEOMEAN.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( argument-list )"
    };
}

function cGROWTH() {
    cBaseFunction.call( this, "GROWTH" );
}
cGROWTH.prototype = Object.create( cBaseFunction.prototype )

function cHARMEAN() {
//    cBaseFunction.call( this, "HARMEAN" );
//    this.setArgumentsMin( 1 );
//    this.setArgumentsMax( 255 );

    this.name = "HARMEAN";
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
cHARMEAN.prototype = Object.create( cBaseFunction.prototype )
cHARMEAN.prototype.Calculate = function ( arg ) {

    function harmmean( x ) {

        var _x = 0, xLength = 0, _tx;
        for ( var i = 0; i < x.length; i++ ) {

            if ( x[i] instanceof CNumber ) {
                if ( x[i].getValue() == 0 )
                    return new CError( cErrorType.not_numeric );
                _x += 1 / x[i].getValue();
                xLength++;
            }
            else if ( ( x[i] instanceof CString || x[i] instanceof CBool ) && ( _tx = x[i].tocNumber()) instanceof CNumber ) {
                if ( _tx.getValue() == 0 )
                    return new CError( cErrorType.not_numeric );
                _x += 1 / _tx.getValue();
                xLength++;
            }

        }

        if ( _x <= 0 )
            return new CError( cErrorType.not_numeric );
        else
            return new CNumber( xLength / _x );
    }

    var arr0 = [];

    for ( var j = 0; j < this.getArguments(); j++ ) {

        if ( arg[j] instanceof CArea || arg[j] instanceof CArea3D ) {
            arg[j].foreach2( function ( elem ) {
                if ( elem instanceof  CNumber )
                    arr0.push( elem );
            } );
        }
        else if ( arg[j] instanceof CRef || arg[j] instanceof CRef3D ) {
            var a = arg[j].getValue();
            if ( a instanceof  CNumber )
                arr0.push( a );
        }
        else if ( arg[j] instanceof CArray ) {
            arg[j].foreach( function ( elem ) {
                if ( elem instanceof  CNumber )
                    arr0.push( elem );
            } );
        }
        else if ( arg[j] instanceof CNumber || arg[j] instanceof CBool ) {
            arr0.push( arg[j].tocNumber() );
        }
        else if ( arg[j] instanceof CString && arg[j].tocNumber() instanceof CNumber ) {
            arr0.push( arg[j].tocNumber() );
        }
        else
            return this.value = CError( cErrorType.wrong_value_type )

    }
    return this.value = harmmean( arr0 );

}
cHARMEAN.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( argument-list )"
    };
}

function cHYPGEOMDIST() {
//    cBaseFunction.call( this, "HYPGEOMDIST" );
//    this.setArgumentsMin( 4 );
//    this.setArgumentsMax( 4 );

    this.name = "HYPGEOMDIST";
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
cHYPGEOMDIST.prototype = Object.create( cBaseFunction.prototype )
cHYPGEOMDIST.prototype.Calculate = function ( arg ) {
    var arg0 = arg[0], arg1 = arg[1], arg2 = arg[2], arg3 = arg[3];

    if ( arg0 instanceof CArea || arg0 instanceof CArea3D ) {
        arg0 = arg0.cross( arguments[1].first );
    }
    else if ( arg0 instanceof CArray ) {
        arg0 = arg0.getElement( 0 );
    }

    if ( arg1 instanceof CArea || arg1 instanceof CArea3D ) {
        arg1 = arg1.cross( arguments[1].first );
    }
    else if ( arg1 instanceof CArray ) {
        arg1 = arg1.getElement( 0 );
    }

    if ( arg2 instanceof CArea || arg2 instanceof CArea3D ) {
        arg2 = arg2.cross( arguments[1].first );
    }
    else if ( arg2 instanceof CArray ) {
        arg2 = arg2.getElement( 0 );
    }

    if ( arg3 instanceof CArea || arg3 instanceof CArea3D ) {
        arg3 = arg3.cross( arguments[1].first );
    }
    else if ( arg3 instanceof CArray ) {
        arg3 = arg3.getElement( 0 );
    }

    arg0 = arg0.tocNumber();
    arg1 = arg1.tocNumber();
    arg2 = arg2.tocNumber();
    arg3 = arg3.tocNumber();

    if ( arg0 instanceof CError ) return this.value = arg0;
    if ( arg1 instanceof CError ) return this.value = arg1;
    if ( arg2 instanceof CError ) return this.value = arg2;
    if ( arg3 instanceof CError ) return this.value = arg3;


    if ( arg0.getValue() < 0 ||
        arg0.getValue() > Math.min( arg1.getValue(), arg2.getValue() ) ||
        arg0.getValue() < Math.max( 0, arg1.getValue() - arg3.getValue() + arg2.getValue() ) ||
        arg1.getValue() <= 0 || arg1.getValue() > arg3.getValue() ||
        arg2.getValue() <= 0 || arg2.getValue() > arg3.getValue() ||
        arg3.getValue() <= 0 )
        return this.value = new CError( cErrorType.not_numeric );

    return this.value = new CNumber( Math.binomCoeff( arg2.getValue(), arg0.getValue() ) * Math.binomCoeff( arg3.getValue() - arg2.getValue(), arg1.getValue() - arg0.getValue() ) /
        Math.binomCoeff( arg3.getValue(), arg1.getValue() ) );

}
cHYPGEOMDIST.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( sample-successes , number-sample , population-successes , number-population )"
    };
}

function cINTERCEPT() {
//    cBaseFunction.call( this, "INTERCEPT" );
//    this.setArgumentsMin( 2 );
//    this.setArgumentsMax( 2 );

    this.name = "INTERCEPT";
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
cINTERCEPT.prototype = Object.create( cBaseFunction.prototype )
cINTERCEPT.prototype.Calculate = function ( arg ) {

    function intercept( y, x ) {

        var fSumDeltaXDeltaY = 0, fSumSqrDeltaX = 0, _x = 0, _y = 0, xLength = 0;
        for ( var i = 0; i < x.length; i++ ) {

            if ( !( x[i] instanceof CNumber && y[i] instanceof CNumber ) ) {
                continue;
            }

            _x += x[i].getValue();
            _y += y[i].getValue();
            xLength++;
        }

        _x /= xLength;
        _y /= xLength;

        for ( var i = 0; i < x.length; i++ ) {

            if ( !( x[i] instanceof CNumber && y[i] instanceof CNumber ) ) {
                continue;
            }

            var fValX = x[i].getValue();
            var fValY = y[i].getValue();

            fSumDeltaXDeltaY += ( fValX - _x ) * ( fValY - _y );
            fSumSqrDeltaX += ( fValX - _x ) * ( fValX - _x );

        }

        if ( fSumDeltaXDeltaY == 0 )
            return new CError( cErrorType.division_by_zero );
        else {
            return new CNumber( _y - fSumDeltaXDeltaY / fSumSqrDeltaX * _x );
        }

    }

    var arg0 = arg[0], arg1 = arg[1], arr0 = [], arr1 = [];

    if ( arg0 instanceof CArea ) {
        arr0 = arg0.getValue();
    }
    else if ( arg0 instanceof CArray ) {
        arg0.foreach( function ( elem ) {
            arr0.push( elem );
        } );
    }
    else
        return this.value = CError( cErrorType.wrong_value_type )

    if ( arg1 instanceof CArea ) {
        arr1 = arg1.getValue();
    }
    else if ( arg1 instanceof CArray ) {
        arg1.foreach( function ( elem ) {
            arr1.push( elem );
        } );
    }
    else
        return this.value = CError( cErrorType.wrong_value_type )

    return this.value = intercept( arr0, arr1 );

}
cINTERCEPT.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( array-1 , array-2 )"
    };
}

function cKURT() {
//    cBaseFunction.call( this, "KURT" );
//    this.setArgumentsMin( 1 );
//    this.setArgumentsMax( 255 );

    this.name = "KURT";
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
cKURT.prototype = Object.create( cBaseFunction.prototype )
cKURT.prototype.Calculate = function ( arg ) {

    function kurt( x ) {

        var sumSQRDeltaX = 0, _x = 0, xLength = 0, standDev = 0, sumSQRDeltaXDivstandDev = 0;
        for ( var i = 0; i < x.length; i++ ) {

            if ( x[i] instanceof CNumber ) {
                _x += x[i].getValue();
                xLength++;
            }

        }

        _x /= xLength;

        for ( var i = 0; i < x.length; i++ ) {

            if ( x[i] instanceof CNumber ) {
                sumSQRDeltaX += Math.pow( x[i].getValue() - _x, 2 );
            }

        }

        standDev = Math.sqrt( sumSQRDeltaX / ( xLength - 1 ) );

        for ( var i = 0; i < x.length; i++ ) {

            if ( x[i] instanceof CNumber ) {
                sumSQRDeltaXDivstandDev += Math.pow( (x[i].getValue() - _x) / standDev, 4 );
            }

        }

        return new CNumber( xLength * (xLength + 1) / (xLength - 1) / (xLength - 2) / (xLength - 3) * sumSQRDeltaXDivstandDev - 3 * (xLength - 1) * (xLength - 1) / (xLength - 2) / (xLength - 3) )

    }

    var arr0 = [];

    for ( var j = 0; j < this.getArguments(); j++ ) {

        if ( arg[j] instanceof CArea || arg[j] instanceof CArea3D ) {
            arg[j].foreach2( function ( elem ) {
                if ( elem instanceof  CNumber )
                    arr0.push( elem );
            } );
        }
        else if ( arg[j] instanceof CRef || arg[j] instanceof CRef3D ) {
            var a = arg[j].getValue();
            if ( a instanceof  CNumber )
                arr0.push( a );
        }
        else if ( arg[j] instanceof CArray ) {
            arg[j].foreach( function ( elem ) {
                if ( elem instanceof  CNumber )
                    arr0.push( elem );
            } );
        }
        else if ( arg[j] instanceof CNumber || arg[j] instanceof CBool ) {
            arr0.push( arg[j].tocNumber() );
        }
        else if ( arg[j] instanceof CString ) {
            continue;
        }
        else
            return this.value = CError( cErrorType.wrong_value_type )

    }
    return this.value = kurt( arr0 );

}
cKURT.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( argument-list )"
    };
}

function cLARGE() {
//    cBaseFunction.call( this, "LARGE" );
//    this.setArgumentsMin( 2 );
//    this.setArgumentsMax( 2 );
//    this.setFormat( this.formatType.noneFormat );

    this.name = "LARGE";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 2;
    this.argumentsCurrent = 0;
    this.argumentsMax = 2;
    this.formatType = {
        def:-1, //подразумевается формат первой ячейки входящей в формулу.
        noneFormat:-2
    };
    this.numFormat = this.formatType.noneFormat;

}
cLARGE.prototype = Object.create( cBaseFunction.prototype )
cLARGE.prototype.Calculate = function ( arg ) {

    function frequency( A, k ) {

        var tA = [];

        for ( var i = 0; i < A.length; i++ ) {
            for ( var j = 0; j < A[i].length; j++ ) {
                if ( A[i][j] instanceof  CError ) {
                    return A[i][j];
                }
                else if ( A[i][j] instanceof CNumber ) {
                    tA.push( A[i][j].getValue() );
                }
                else if ( A[i][j] instanceof CBool ) {
                    tA.push( A[i][j].tocNumber().getValue() );
                }
            }
        }

        tA.sort( function ( a, b ) {
            return -(a - b)
        } )

        if ( k.getValue() > tA.length || k.getValue() <= 0 )
            return new CError( cErrorType.not_available );
        else
            return new CNumber( tA[k.getValue() - 1] );
    }

    var arg0 = arg[0], arg1 = arg[1];
    if ( arg0 instanceof CArea || arg0 instanceof CArray ) {
        arg0 = arg0.getMatrix();
    }
    else if ( arg0 instanceof CArea3D ) {
        arg0 = arg0.getMatrix()[0];
    }
    else
        return this.value = new CError( cErrorType.not_available );


    if ( arg1 instanceof CArea || arg1 instanceof CArea3D ) {
        arg1 = arg1.cross( arguments[1].first );
    }
    else if ( arg1 instanceof CArray ) {
        arg1 = arg1.getElement( 0 );
    }

    arg1 = arg1.tocNumber();

    if ( arg1 instanceof CError ) return this.value = arg1;

    return this.value = frequency( arg0, arg1 );

};
cLARGE.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"(  array , k )"
    };
}

function cLINEST() {
    cBaseFunction.call( this, "LINEST" );
}
cLINEST.prototype = Object.create( cBaseFunction.prototype )

function cLOGEST() {
    cBaseFunction.call( this, "LOGEST" );
}
cLOGEST.prototype = Object.create( cBaseFunction.prototype )

function cLOGINV() {
//    cBaseFunction.call( this, "LOGINV" );
//    this.setArgumentsMin( 3 );
//    this.setArgumentsMax( 3 );

    this.name = "LOGINV";
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
cLOGINV.prototype = Object.create( cBaseFunction.prototype )
cLOGINV.prototype.Calculate = function ( arg ) {

    var arg0 = arg[0], arg1 = arg[1], arg2 = arg[2];

    function loginv( x, mue, sigma ) {
        if ( sigma <= 0 || x <= 0 || x >= 1 )
            return new CError( cErrorType.not_numeric );
        else
            return new CNumber( Math.exp( mue + sigma * ( gaussinv( x ) ) ) );
    }

    if ( arg0 instanceof CArea || arg0 instanceof CArea3D ) {
        arg0 = arg0.cross( arguments[1].first );
    }
    else if ( arg0 instanceof CArray ) {
        arg0 = arg0.getElement( 0 );
    }

    if ( arg1 instanceof CArea || arg1 instanceof CArea3D ) {
        arg1 = arg1.cross( arguments[1].first );
    }
    else if ( arg1 instanceof CArray ) {
        arg1 = arg1.getElement( 0 );
    }

    if ( arg2 instanceof CArea || arg2 instanceof CArea3D ) {
        arg2 = arg2.cross( arguments[1].first );
    }
    else if ( arg2 instanceof CArray ) {
        arg2 = arg2.getElement( 0 );
    }

    arg0 = arg0.tocNumber();
    arg1 = arg1.tocNumber();
    arg2 = arg2.tocNumber();

    if ( arg0 instanceof CError ) return this.value = arg0;
    if ( arg1 instanceof CError ) return this.value = arg1;
    if ( arg2 instanceof CError ) return this.value = arg2;

    return this.value = loginv( arg0.getValue(), arg1.getValue(), arg2.getValue() );
}
cLOGINV.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( x , mean , standard-deviation )"
    };
}

function cLOGNORMDIST() {
//    cBaseFunction.call( this, "LOGNORMDIST" );
//    this.setArgumentsMin( 3 );
//    this.setArgumentsMax( 3 );

    this.name = "LOGNORMDIST";
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
cLOGNORMDIST.prototype = Object.create( cBaseFunction.prototype )
cLOGNORMDIST.prototype.Calculate = function ( arg ) {

    var arg0 = arg[0], arg1 = arg[1], arg2 = arg[2];

    function normdist( x, mue, sigma ) {
        if ( sigma <= 0 || x <= 0 )
            return new CError( cErrorType.not_numeric );
        else
            return new CNumber( 0.5 + gauss( (Math.ln( x ) - mue) / sigma ) );
    }

    if ( arg0 instanceof CArea || arg0 instanceof CArea3D ) {
        arg0 = arg0.cross( arguments[1].first );
    }
    else if ( arg0 instanceof CArray ) {
        arg0 = arg0.getElement( 0 );
    }

    if ( arg1 instanceof CArea || arg1 instanceof CArea3D ) {
        arg1 = arg1.cross( arguments[1].first );
    }
    else if ( arg1 instanceof CArray ) {
        arg1 = arg1.getElement( 0 );
    }

    if ( arg2 instanceof CArea || arg2 instanceof CArea3D ) {
        arg2 = arg2.cross( arguments[1].first );
    }
    else if ( arg2 instanceof CArray ) {
        arg2 = arg2.getElement( 0 );
    }

    arg0 = arg0.tocNumber();
    arg1 = arg1.tocNumber();
    arg2 = arg2.tocNumber();

    if ( arg0 instanceof CError ) return this.value = arg0;
    if ( arg1 instanceof CError ) return this.value = arg1;
    if ( arg2 instanceof CError ) return this.value = arg2;

    return this.value = normdist( arg0.getValue(), arg1.getValue(), arg2.getValue() );
}
cLOGNORMDIST.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( x , mean , standard-deviation )"
    };
}

function cMAX() {
//    cBaseFunction.call( this, "MAX" );
//    this.setArgumentsMin( 1 );
//    this.setArgumentsMax( 255 );

    this.name = "MAX";
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
cMAX.prototype = Object.create( cBaseFunction.prototype )
cMAX.prototype.Calculate = function ( arg ) {
    var argI, argIVal, max = Number.NEGATIVE_INFINITY;
    for ( var i = 0; i < this.argumentsCurrent; i++ ) {
        argI = arg[i], argIVal = argI.getValue();
        if ( argI instanceof CRef || argI instanceof CRef3D ) {
            if ( argIVal instanceof CError )
                return this.value = argIVal;
            if ( argIVal instanceof CNumber || argIVal instanceof CBool || argIVal instanceof CEmpty ) {
                var v = argIVal.tocNumber();
                if ( v.getValue() > max )
                    max = v.getValue();
            }
        }
        else if ( argI instanceof CArea || argI instanceof CArea3D ) {
            var argArr = argI.getValue();
            for ( var j = 0; j < argArr.length; j++ ) {
                if ( argArr[j] instanceof CNumber || argArr[j] instanceof CBool || argArr[j] instanceof CEmpty ) {
                    var v = argArr[j].tocNumber();
                    if ( v.getValue() > max )
                        max = v.getValue();
                }
                else if ( argArr[j] instanceof CError ) {
                    return this.value = argArr[j];
                }
            }
        }
        else if ( argI instanceof CError )
            return this.value = argI;
        else if ( argI instanceof CString ) {
            var v = argI.tocNumber();
            if ( v instanceof CNumber )
                if ( v.getValue() > max )
                    max = v.getValue();
        }
        else if ( argI instanceof CBool || argI instanceof CEmpty ) {
            var v = argI.tocNumber();
            if ( v.getValue() > max )
                max = v.getValue();
        }
        else if ( argI instanceof CArray ) {
            argI.foreach( function ( elem ) {
                if ( elem instanceof CNumber ) {
                    if ( elem.getValue() > max )
                        max = elem.getValue();
                }
                else if ( elem instanceof CError ) {
                    max = elem;
                    return true;
                }
            } )
            if ( max instanceof CError ) {
                return this.value = max;
            }
        }
        else {
            if ( argI.getValue() > max )
                max = argI.getValue();
        }
    }
    return this.value = ( max.value === Number.NEGATIVE_INFINITY ? new CNumber( 0 ) : new CNumber( max ) );
};
cMAX.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"(number1, number2, ...)"
    };
}

function cMAXA() {
//    cBaseFunction.call( this, "MAXA" );
//    this.setArgumentsMin( 1 );
//    this.setArgumentsMax( 255 );

    this.name = "MAXA";
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
cMAXA.prototype = Object.create( cBaseFunction.prototype )
cMAXA.prototype.Calculate = function ( arg ) {
    var argI, argIVal, max = Number.NEGATIVE_INFINITY;
    for ( var i = 0; i < this.argumentsCurrent; i++ ) {
        argI = arg[i], argIVal = argI.getValue();
        if ( argI instanceof CRef || argI instanceof CRef3D ) {

            if ( argIVal instanceof CError )
                return this.value = argIVal;

            var v = argIVal.tocNumber();

            if ( v instanceof CNumber && v.getValue() > max )
                max = v.getValue();
        }
        else if ( argI instanceof CArea || argI instanceof CArea3D ) {
            var argArr = argI.getValue();
            for ( var j = 0; j < argArr.length; j++ ) {

                if ( argArr[j] instanceof CError )
                    return this.value = argArr[j];

                var v = argArr[j].tocNumber();

                if ( v instanceof CNumber && v.getValue() > max )
                    max = v.getValue();
            }
        }
        else if ( argI instanceof CError )
            return this.value = argI;
        else if ( argI instanceof CString ) {
            var v = argI.tocNumber();
            if ( v instanceof CNumber )
                if ( v.getValue() > max )
                    max = v.getValue();
        }
        else if ( argI instanceof CBool || argI instanceof CEmpty ) {
            var v = argI.tocNumber();
            if ( v.getValue() > max )
                max = v.getValue();
        }
        else if ( argI instanceof CArray ) {
            argI.foreach( function ( elem ) {
                if ( elem instanceof CError ) {
                    max = elem;
                    return true;
                }
                elem = elem.tocNumber();

                if ( elem instanceof CNumber && elem.getValue() > max ) {
                    max = elem.getValue();
                }
            } )
            if ( max instanceof CError ) {
                return this.value = max;
            }
        }
        else {
            if ( argI.getValue() > max )
                max = argI.getValue();
        }
    }
    return this.value = ( max.value === Number.NEGATIVE_INFINITY ? new CNumber( 0 ) : new CNumber( max ) )
};
cMAXA.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"(number1, number2, ...)"
    };
}

function cMEDIAN() {
//    cBaseFunction.call( this, "MEDIAN" );
//    this.setArgumentsMin( 1 );
//    this.setArgumentsMax( 255 );

    this.name = "MEDIAN";
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
cMEDIAN.prototype = Object.create( cBaseFunction.prototype )
cMEDIAN.prototype.Calculate = function ( arg ) {

    function median( x ) {

        var res, medArr = [], t;

        for ( var i = 0; i < x.length; i++ ) {
            t = x[i].tocNumber();
            if ( t instanceof  CNumber ) {
                medArr.push( t.getValue() )
            }
        }

        medArr.sort( function ( a, b ) {
            return a - b;
        } );

        if ( medArr.length < 1 )
            return CError( cErrorType.wrong_value_type );
        else {
            if ( medArr.length % 2 )
                return new CNumber( medArr[(medArr.length - 1) / 2] );
            else
                return new CNumber( (medArr[medArr.length / 2 - 1] + medArr[medArr.length / 2]) / 2 );
        }
    }

    var arr0 = [];

    for ( var j = 0; j < this.getArguments(); j++ ) {

        if ( arg[j] instanceof CArea || arg[j] instanceof CArea3D ) {
            arg[j].foreach2( function ( elem ) {
                if ( elem instanceof  CNumber )
                    arr0.push( elem );
            } );
        }
        else if ( arg[j] instanceof CRef || arg[j] instanceof CRef3D ) {
            var a = arg[j].getValue();
            if ( a instanceof  CNumber )
                arr0.push( a );
        }
        else if ( arg[j] instanceof CArray ) {
            arg[j].foreach( function ( elem ) {
                if ( elem instanceof  CNumber )
                    arr0.push( elem );
            } );
        }
        else if ( arg[j] instanceof CNumber || arg[j] instanceof CBool ) {
            arr0.push( arg[j].tocNumber() );
        }
        else if ( arg[j] instanceof CString ) {
            continue;
        }
        else
            return this.value = CError( cErrorType.wrong_value_type )

    }
    return this.value = median( arr0 );

}
cMEDIAN.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( argument-list )"
    };
}

function cMIN() {
//    cBaseFunction.call( this, "MIN" );
//    this.setArgumentsMin( 1 );
//    this.setArgumentsMax( 255 );

    this.name = "MIN";
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
cMIN.prototype = Object.create( cBaseFunction.prototype )
cMIN.prototype.Calculate = function ( arg ) {
    var argI, argIVal, min = Number.POSITIVE_INFINITY;
    for ( var i = 0; i < this.argumentsCurrent; i++ ) {
        argI = arg[i], argIVal = argI.getValue();
        if ( argI instanceof CRef || argI instanceof CRef3D ) {
            if ( argIVal instanceof CError )
                return this.value = argIVal;
            if ( argIVal instanceof CNumber || argIVal instanceof CBool || argIVal instanceof CEmpty ) {
                var v = argIVal.tocNumber();
                if ( v.getValue() < min )
                    min = v.getValue();
            }
        }
        else if ( argI instanceof CArea || argI instanceof CArea3D ) {
            var argArr = argI.getValue();
            for ( var j = 0; j < argArr.length; j++ ) {
                if ( argArr[j] instanceof CNumber || argArr[j] instanceof CBool || argArr[j] instanceof CEmpty ) {
                    var v = argArr[j].tocNumber();
                    if ( v.getValue() < min )
                        min = v.getValue();
                    continue;
                }
                else if ( argArr[j] instanceof CError ) {
                    return this.value = argArr[j];
                }
            }
        }
        else if ( argI instanceof CError )
            return this.value = argI;
        else if ( argI instanceof CString ) {
            var v = argI.tocNumber();
            if ( v instanceof CNumber )
                if ( v.getValue() < min )
                    min = v.getValue();
        }
        else if ( argI instanceof CBool || argI instanceof CEmpty ) {
            var v = argI.tocNumber();
            if ( v.getValue() < min )
                min = v.getValue();
        }
        else if ( argI instanceof CArray ) {
            argI.foreach( function ( elem ) {
                if ( elem instanceof CNumber ) {
                    if ( elem.getValue() < min )
                        min = elem.getValue();
                }
                else if ( elem instanceof CError ) {
                    min = elem;
                    return true;
                }
            } )
            if ( min instanceof CError ) {
                return this.value = min;
            }
        }
        else {
            if ( argI.getValue() < min )
                min = argI.getValue();
        }
    }
    return this.value = ( min.value === Number.POSITIVE_INFINITY ? new CNumber( 0 ) : new CNumber( min ) );
};
cMIN.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"(number1, number2, ...)"
    };
}

function cMINA() {
//    cBaseFunction.call( this, "MINA" );
//    this.setArgumentsMin( 1 );
//    this.setArgumentsMax( 255 );

    this.name = "MINA";
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
cMINA.prototype = Object.create( cBaseFunction.prototype )
cMINA.prototype.Calculate = function ( arg ) {
    var argI, argIVal, min = Number.POSITIVE_INFINITY;
    for ( var i = 0; i < this.argumentsCurrent; i++ ) {
        argI = arg[i], argIVal = argI.getValue();
        if ( argI instanceof CRef || argI instanceof CRef3D ) {

            if ( argIVal instanceof CError )
                return this.value = argIVal;

            var v = argIVal.tocNumber();

            if ( v instanceof CNumber && v.getValue() < min )
                min = v.getValue();
        }
        else if ( argI instanceof CArea || argI instanceof CArea3D ) {
            var argArr = argI.getValue();
            for ( var j = 0; j < argArr.length; j++ ) {

                if ( argArr[j] instanceof CError ) {
                    return this.value = argArr[j];
                }

                var v = argArr[j].tocNumber();

                if ( v instanceof CNumber && v.getValue() < min )
                    min = v.getValue();
            }
        }
        else if ( argI instanceof CError )
            return this.value = argI;
        else if ( argI instanceof CString ) {
            var v = argI.tocNumber();
            if ( v instanceof CNumber )
                if ( v.getValue() < min )
                    min = v.getValue();
        }
        else if ( argI instanceof CBool || argI instanceof CEmpty ) {
            var v = argI.tocNumber();
            if ( v.getValue() < min )
                min = v.getValue();
        }
        else if ( argI instanceof CArray ) {
            argI.foreach( function ( elem ) {
                if ( elem instanceof CError ) {
                    min = elem;
                    return true;
                }

                elem = elem.tocNumber();

                if ( elem instanceof CNumber && elem.getValue() < min ) {
                    min = elem.getValue();
                }
            } )
            if ( min instanceof CError ) {
                return this.value = min;
            }
        }
        else {
            if ( argI.getValue() < min )
                min = argI.getValue();
        }
    }
    return this.value = ( min.value === Number.POSITIVE_INFINITY ? new CNumber( 0 ) : new CNumber( min ) );
};
cMINA.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"(number1, number2, ...)"
    };
}

function cMODE() {
//    cBaseFunction.call( this, "MODE" );
//    this.setArgumentsMin( 1 );
//    this.setArgumentsMax( 255 );

    this.name = "MODE";
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
cMODE.prototype = Object.create( cBaseFunction.prototype )
cMODE.prototype.Calculate = function ( arg ) {

    function mode( x ) {

        var medArr = [], t;

        for ( var i = 0; i < x.length; i++ ) {
            t = x[i].tocNumber();
            if ( t instanceof  CNumber ) {
                medArr.push( t.getValue() )
            }
        }

        medArr.sort( function ( a, b ) {
            return b - a;
        } );

        if ( medArr.length < 1 )
            return CError( cErrorType.wrong_value_type );
        else {
            var nMaxIndex = 0, nMax = 1, nCount = 1, nOldVal = medArr[0], i;

            for ( i = 1; i < medArr.length; i++ ) {
                if ( medArr[i] == nOldVal )
                    nCount++;
                else {
                    nOldVal = medArr[i];
                    if ( nCount > nMax ) {
                        nMax = nCount;
                        nMaxIndex = i - 1;
                    }
                    nCount = 1;
                }
            }
            if ( nCount > nMax ) {
                nMax = nCount;
                nMaxIndex = i - 1;
            }
            if ( nMax == 1 && nCount == 1 )
                return new CError( cErrorType.wrong_value_type );
            else if ( nMax == 1 )
                return new CNumber( nOldVal );
            else
                return new CNumber( medArr[nMaxIndex] );
        }
    }

    var arr0 = [];

    for ( var j = 0; j < this.getArguments(); j++ ) {

        if ( arg[j] instanceof CArea || arg[j] instanceof CArea3D ) {
            arg[j].foreach2( function ( elem ) {
                if ( elem instanceof  CNumber )
                    arr0.push( elem );
            } );
        }
        else if ( arg[j] instanceof CRef || arg[j] instanceof CRef3D ) {
            var a = arg[j].getValue();
            if ( a instanceof  CNumber )
                arr0.push( a );
        }
        else if ( arg[j] instanceof CArray ) {
            arg[j].foreach( function ( elem ) {
                if ( elem instanceof  CNumber )
                    arr0.push( elem );
            } );
        }
        else if ( arg[j] instanceof CNumber || arg[j] instanceof CBool ) {
            arr0.push( arg[j].tocNumber() );
        }
        else if ( arg[j] instanceof CString ) {
            continue;
        }
        else
            return this.value = CError( cErrorType.wrong_value_type )

    }
    return this.value = mode( arr0 );

}
cMODE.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( argument-list )"
    };
}

function cNEGBINOMDIST() {
//    cBaseFunction.call( this, "NEGBINOMDIST" );
//    this.setArgumentsMin( 3 );
//    this.setArgumentsMax( 3 );

    this.name = "NEGBINOMDIST";
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
cNEGBINOMDIST.prototype = Object.create( cBaseFunction.prototype )
cNEGBINOMDIST.prototype.Calculate = function ( arg ) {
    var arg0 = arg[0], arg1 = arg[1], arg2 = arg[2];

    function negbinomdist( x, r, p ) {
        x = parseInt( x.getValue() );
        r = parseInt( r.getValue() );
        p = p.getValue()
        if ( x < 0 || r < 1 || p < 0 || p > 1 )
            return new CError( cErrorType.not_numeric );
        else
            return new CNumber( Math.binomCoeff( x + r - 1, r - 1 ) * Math.pow( p, r ) * Math.pow( 1 - p, x ) );
    }

    if ( arg0 instanceof CArea || arg0 instanceof CArea3D ) {
        arg0 = arg0.cross( arguments[1].first );
    }
    else if ( arg0 instanceof CArray ) {
        arg0 = arg0.getElement( 0 );
    }

    if ( arg1 instanceof CArea || arg1 instanceof CArea3D ) {
        arg1 = arg1.cross( arguments[1].first );
    }
    else if ( arg1 instanceof CArray ) {
        arg1 = arg1.getElement( 0 );
    }

    if ( arg2 instanceof CArea || arg2 instanceof CArea3D ) {
        arg2 = arg2.cross( arguments[1].first );
    }
    else if ( arg2 instanceof CArray ) {
        arg2 = arg2.getElement( 0 );
    }

    arg0 = arg0.tocNumber();
    arg1 = arg1.tocNumber();
    arg2 = arg2.tocNumber();

    if ( arg0 instanceof CError ) return this.value = arg0;
    if ( arg1 instanceof CError ) return this.value = arg1;
    if ( arg2 instanceof CError ) return this.value = arg2;

    return this.value = negbinomdist( arg0, arg1, arg2 );

}
cNEGBINOMDIST.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( number-failures , number-successes , success-probability )"
    };
}

function cNORMDIST() {
//    cBaseFunction.call( this, "NORMDIST" );
//    this.setArgumentsMin( 4 );
//    this.setArgumentsMax( 4 );

    this.name = "NORMDIST";
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
cNORMDIST.prototype = Object.create( cBaseFunction.prototype )
cNORMDIST.prototype.Calculate = function ( arg ) {

    var arg0 = arg[0], arg1 = arg[1], arg2 = arg[2], arg3 = arg[3];

    function normdist( x, mue, sigma, kum ) {
        if ( sigma <= 0 )
            return new CError( cErrorType.not_numeric );

        if ( kum )
            return new CNumber( integralPhi( (x - mue) / sigma ) );
        else
            return new CNumber( phi( (x - mue) / sigma ) / sigma );

    }

    if ( arg0 instanceof CArea || arg0 instanceof CArea3D ) {
        arg0 = arg0.cross( arguments[1].first );
    }
    else if ( arg0 instanceof CArray ) {
        arg0 = arg0.getElement( 0 );
    }

    if ( arg1 instanceof CArea || arg1 instanceof CArea3D ) {
        arg1 = arg1.cross( arguments[1].first );
    }
    else if ( arg1 instanceof CArray ) {
        arg1 = arg1.getElement( 0 );
    }

    if ( arg2 instanceof CArea || arg2 instanceof CArea3D ) {
        arg2 = arg2.cross( arguments[1].first );
    }
    else if ( arg2 instanceof CArray ) {
        arg2 = arg2.getElement( 0 );
    }

    if ( arg3 instanceof CArea || arg3 instanceof CArea3D ) {
        arg3 = arg3.cross( arguments[1].first );
    }
    else if ( arg3 instanceof CArray ) {
        arg3 = arg3.getElement( 0 );
    }

    arg0 = arg0.tocNumber();
    arg1 = arg1.tocNumber();
    arg2 = arg2.tocNumber();
    arg3 = arg3.tocBool();

    if ( arg0 instanceof CError ) return this.value = arg0;
    if ( arg1 instanceof CError ) return this.value = arg1;
    if ( arg2 instanceof CError ) return this.value = arg2;
    if ( arg3 instanceof CError ) return this.value = arg3;


    return this.value = normdist( arg0.getValue(), arg1.getValue(), arg2.getValue(), arg3.toBool() );
}
cNORMDIST.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( x , mean , standard-deviation , cumulative-flag )"
    };
}

function cNORMINV() {
//    cBaseFunction.call( this, "NORMINV" );
//    this.setArgumentsMin( 3 );
//    this.setArgumentsMax( 3 );

    this.name = "NORMINV";
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
cNORMINV.prototype = Object.create( cBaseFunction.prototype )
cNORMINV.prototype.Calculate = function ( arg ) {

    var arg0 = arg[0], arg1 = arg[1], arg2 = arg[2];

    function norminv( x, mue, sigma ) {
        if ( sigma <= 0.0 || x <= 0.0 || x >= 1.0 )
            return new CError( cErrorType.not_numeric );
        else
            return new CNumber( gaussinv( x ) * sigma + mue );
    }

    if ( arg0 instanceof CArea || arg0 instanceof CArea3D ) {
        arg0 = arg0.cross( arguments[1].first );
    }
    else if ( arg0 instanceof CArray ) {
        arg0 = arg0.getElement( 0 );
    }

    if ( arg1 instanceof CArea || arg1 instanceof CArea3D ) {
        arg1 = arg1.cross( arguments[1].first );
    }
    else if ( arg1 instanceof CArray ) {
        arg1 = arg1.getElement( 0 );
    }

    if ( arg2 instanceof CArea || arg2 instanceof CArea3D ) {
        arg2 = arg2.cross( arguments[1].first );
    }
    else if ( arg2 instanceof CArray ) {
        arg2 = arg2.getElement( 0 );
    }

    arg0 = arg0.tocNumber();
    arg1 = arg1.tocNumber();
    arg2 = arg2.tocNumber();

    if ( arg0 instanceof CError ) return this.value = arg0;
    if ( arg1 instanceof CError ) return this.value = arg1;
    if ( arg2 instanceof CError ) return this.value = arg2;

    return this.value = norminv( arg0.getValue(), arg1.getValue(), arg2.getValue() );
}
cNORMINV.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( x , mean , standard-deviation )"
    };
}

function cNORMSDIST() {
//    cBaseFunction.call( this, "NORMSDIST" );
//    this.setArgumentsMin( 1 );
//    this.setArgumentsMax( 1 );

    this.name = "NORMSDIST";
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
cNORMSDIST.prototype = Object.create( cBaseFunction.prototype )
cNORMSDIST.prototype.Calculate = function ( arg ) {
    var arg0 = arg[0];
    if ( arg0 instanceof CArea || arg0 instanceof CArea3D ) {
        arg0 = arg0.cross( arguments[1].first );
    }
    arg0 = arg0.tocNumber();
    if ( arg0 instanceof CError )
        return this.value = arg0;
    else if ( arg0 instanceof CArray ) {
        arg0.foreach( function ( elem, r, c ) {
            if ( elem instanceof CNumber ) {
                var a = 0.5 + gauss( elem.getValue() )
                this.array[r][c] = isNaN( a ) ? new CError( cErrorType.not_numeric ) : new CNumber( a );
            }
            else {
                this.array[r][c] = new CError( cErrorType.wrong_value_type );
            }
        } )
    }
    else {
        var a = 0.5 + gauss( arg0.getValue() );
        return this.value = isNaN( a ) ? new CError( cErrorType.not_numeric ) : new CNumber( a );
    }
    return this.value = arg0;
}
cNORMSDIST.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"(number)"
    };
}

function cNORMSINV() {
//    cBaseFunction.call( this, "NORMSINV" );
//    this.setArgumentsMin( 1 );
//    this.setArgumentsMax( 1 );

    this.name = "NORMSINV";
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
cNORMSINV.prototype = Object.create( cBaseFunction.prototype )
cNORMSINV.prototype.Calculate = function ( arg ) {

    function normsinv( x ) {
        if ( x <= 0.0 || x >= 1.0 )
            return new CError( cErrorType.not_numeric );
        else
            return new CNumber( gaussinv( x ) );
    }

    var arg0 = arg[0];
    if ( arg0 instanceof CArea || arg0 instanceof CArea3D ) {
        arg0 = arg0.cross( arguments[1].first );
    }
    arg0 = arg0.tocNumber();
    if ( arg0 instanceof CError )
        return this.value = arg0;
    else if ( arg0 instanceof CArray ) {
        arg0.foreach( function ( elem, r, c ) {
            if ( elem instanceof CNumber ) {
                var a = normsinv( elem.getValue() );
                this.array[r][c] = isNaN( a ) ? new CError( cErrorType.not_available ) : new CNumber( a );
            }
            else {
                this.array[r][c] = new CError( cErrorType.wrong_value_type );
            }
        } )
    }
    else {
        var a = normsinv( arg0.getValue() );
        return this.value = isNaN( a ) ? new CError( cErrorType.not_available ) : new CNumber( a );
    }
    return this.value = arg0;
}
cNORMSINV.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( probability )"
    };
}

function cPEARSON() {
//    cBaseFunction.call( this, "PEARSON" );
//    this.setArgumentsMin( 2 );
//    this.setArgumentsMax( 2 );

    this.name = "PEARSON";
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
cPEARSON.prototype = Object.create( cBaseFunction.prototype )
cPEARSON.prototype.Calculate = function ( arg ) {

    function pearson( x, y ) {

        var sumXDeltaYDelta = 0, sqrXDelta = 0, sqrYDelta = 0, _x = 0, _y = 0, xLength = 0;

        if ( x.length != y.length )
            return new CError( cErrorType.not_available );
        for ( var i = 0; i < x.length; i++ ) {

            if ( !( x[i] instanceof CNumber && y[i] instanceof CNumber ) ) {
                continue;
            }

            _x += x[i].getValue();
            _y += y[i].getValue();
            xLength++;
        }

        _x /= xLength;
        _y /= xLength;

        for ( var i = 0; i < x.length; i++ ) {

            if ( !( x[i] instanceof CNumber && y[i] instanceof CNumber ) ) {
                continue;
            }

            sumXDeltaYDelta += (x[i].getValue() - _x) * (y[i].getValue() - _y);
            sqrXDelta += (x[i].getValue() - _x) * (x[i].getValue() - _x);
            sqrYDelta += (y[i].getValue() - _y) * (y[i].getValue() - _y);

        }

        if ( sqrXDelta == 0 || sqrYDelta == 0 )
            return new CError( cErrorType.division_by_zero );
        else
            return new CNumber( sumXDeltaYDelta / Math.sqrt( sqrXDelta * sqrYDelta ) );
    }

    var arg0 = arg[0], arg1 = arg[1], arr0 = [], arr1 = [];

    if ( arg0 instanceof CArea ) {
        arr0 = arg0.getValue();
    }
    else if ( arg0 instanceof CArray ) {
        arg0.foreach( function ( elem ) {
            arr0.push( elem );
        } );
    }
    else
        return this.value = CError( cErrorType.wrong_value_type )

    if ( arg1 instanceof CArea ) {
        arr1 = arg1.getValue();
    }
    else if ( arg1 instanceof CArray ) {
        arg1.foreach( function ( elem ) {
            arr1.push( elem );
        } );
    }
    else
        return this.value = CError( cErrorType.wrong_value_type )

    return this.value = pearson( arr0, arr1 );

}
cPEARSON.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( array-1 , array-2 )"
    };
}

function cPERCENTILE() {
//    cBaseFunction.call( this, "PERCENTILE" );
//    this.setArgumentsMin( 2 );
//    this.setArgumentsMax( 2 );
//    this.setFormat( this.formatType.noneFormat );

    this.name = "PERCENTILE";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 2;
    this.argumentsCurrent = 0;
    this.argumentsMax = 2;
    this.formatType = {
        def:-1, //подразумевается формат первой ячейки входящей в формулу.
        noneFormat:-2
    };
    this.numFormat = this.formatType.noneFormat;

}
cPERCENTILE.prototype = Object.create( cBaseFunction.prototype )
cPERCENTILE.prototype.Calculate = function ( arg ) {

    function percentile( A, k ) {

        var tA = [], alpha = k.getValue();

        for ( var i = 0; i < A.length; i++ ) {
            for ( var j = 0; j < A[i].length; j++ ) {
                if ( A[i][j] instanceof  CError ) {
                    return A[i][j];
                }
                else if ( A[i][j] instanceof CNumber ) {
                    tA.push( A[i][j].getValue() );
                }
                else if ( A[i][j] instanceof CBool ) {
                    tA.push( A[i][j].tocNumber().getValue() );
                }
            }
        }

        tA.sort( function ( a, b ) {
            return a - b;
        } )

        var nSize = tA.length;
        if ( tA.length < 1 || nSize == 0 )
            return new CError( cErrorType.not_available );
        else {
            if ( nSize == 1 )
                return new CNumber( tA[0] );
            else {
                var nIndex = Math.floor( alpha * (nSize - 1) );
                var fDiff = alpha * (nSize - 1) - Math.floor( alpha * (nSize - 1) );
                if ( fDiff == 0.0 )
                    return new CNumber( tA[nIndex] );
                else {
                    return new CNumber( tA[nIndex] +
                        fDiff * (tA[nIndex + 1] - tA[nIndex]) );
                }
            }
        }

    }

    var arg0 = arg[0], arg1 = arg[1];
    if ( arg0 instanceof CArea || arg0 instanceof CArray ) {
        arg0 = arg0.getMatrix();
    }
    else if ( arg0 instanceof CArea3D ) {
        arg0 = arg0.getMatrix()[0];
    }
    else
        return this.value = new CError( cErrorType.not_available );


    if ( arg1 instanceof CArea || arg1 instanceof CArea3D ) {
        arg1 = arg1.cross( arguments[1].first );
    }
    else if ( arg1 instanceof CArray ) {
        arg1 = arg1.getElement( 0 );
    }

    arg1 = arg1.tocNumber();

    if ( arg1 instanceof CError ) return this.value = arg1;

    return this.value = percentile( arg0, arg1 );

};
cPERCENTILE.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"(  array , k )"
    };
}

function cPERCENTRANK() {
//    cBaseFunction.call( this, "PERCENTRANK" );
//    this.setArgumentsMin( 2 );
//    this.setArgumentsMax( 3 );

    this.name = "PERCEBTRANK";
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
cPERCENTRANK.prototype = Object.create( cBaseFunction.prototype )
cPERCENTRANK.prototype.Calculate = function ( arg ) {

    function percentrank( A, x, k ) {

        var tA = [], t;

        k = k.getValue()

        for ( var i = 0; i < A.length; i++ ) {
            t = A[i].tocNumber();
            if ( t instanceof  CNumber ) {
                tA.push( t.getValue() )
            }
        }

        var fNum = x.getValue()

        tA.sort( function ( a, b ) {
            return a - b;
        } );

        var nSize = tA.length;
        if ( tA.length < 1 || nSize == 0 )
            return new CError( cErrorType.not_available );

        else {
            if ( fNum < tA[0] || fNum > tA[nSize - 1] )
                return new CError( cErrorType.not_available );
            else if ( nSize == 1 )
                return new CNumber( 1 )
            else {
                var fRes, nOldCount = 0, fOldVal = tA[0], i;
                for ( i = 1; i < nSize && tA[i] < fNum; i++ ) {
                    if ( tA[i] != fOldVal ) {
                        nOldCount = i;
                        fOldVal = tA[i];
                    }
                }
                if ( tA[i] != fOldVal )
                    nOldCount = i;
                if ( fNum == tA[i] )
                    fRes = nOldCount / (nSize - 1);
                else {
                    if ( nOldCount == 0 ) {
                        fRes = 0.0;
                    }
                    else {
                        var fFract = ( fNum - tA[nOldCount - 1] ) /
                            ( tA[nOldCount] - tA[nOldCount - 1] );
                        fRes = ( nOldCount - 1 + fFract ) / (nSize - 1);
                    }
                }
                return new CNumber( fRes.toString().substr( 0, fRes.toString().indexOf( "." ) + 1 + k ) - 0 );
            }
        }
    }

    var arr0 = [], arg0 = arg[0], arg1 = arg[1], arg2 = arg[2] ? arg[2] : new CNumber( 3 );

    if ( arg0 instanceof CArea || arg0 instanceof CArea3D ) {
        arg0.foreach2( function ( elem ) {
            if ( elem instanceof  CNumber )
                arr0.push( elem );
        } );
    }
    else if ( arg0 instanceof CArray ) {
        arg0.foreach( function ( elem ) {
            if ( elem instanceof  CNumber )
                arr0.push( elem );
        } );
    }
    else {
        return this.value = new CError( cErrorType.wrong_value_type );
    }

    if ( arg1 instanceof CArea || arg1 instanceof CArea3D ) {
        arg1 = arg1.cross( arguments[1].first );
    }
    else if ( arg1 instanceof CArray ) {
        arg1 = arg1.getElement( 0 );
    }

    if ( arg2 instanceof CArea || arg2 instanceof CArea3D ) {
        arg2 = arg2.cross( arguments[1].first );
    }
    else if ( arg2 instanceof CArray ) {
        arg2 = arg2.getElement( 0 );
    }

    arg1 = arg1.tocNumber();
    arg2 = arg2.tocNumber();

    if ( arg1 instanceof CError ) return this.value = arg1;
    if ( arg2 instanceof CError ) return this.value = arg2;

    return this.value = percentrank( arr0, arg1, arg2 );

}
cPERCENTRANK.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( array , x [ , significance ]  )"
    };
}

function cPERMUT() {
//    cBaseFunction.call( this, "PERMUT" );
//    this.setArgumentsMin( 2 );
//    this.setArgumentsMax( 2 );

    this.name = "PERMUT";
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
cPERMUT.prototype = Object.create( cBaseFunction.prototype )
cPERMUT.prototype.Calculate = function ( arg ) {
    var arg0 = arg[0], arg1 = arg[1];
    if ( arg0 instanceof CArea || arg0 instanceof CArea3D ) {
        arg0 = arg0.cross( arguments[1].first );
    }
    arg0 = arg0.tocNumber();

    if ( arg1 instanceof CArea || arg1 instanceof CArea3D ) {
        arg1 = arg1.cross( arguments[1].first );
    }
    arg1 = arg1.tocNumber();

    if ( arg0 instanceof CError ) return this.value = arg0;
    if ( arg1 instanceof CError ) return this.value = arg1;

    if ( arg0 instanceof CArray && arg1 instanceof CArray ) {
        if ( arg0.getCountElement() != arg1.getCountElement() || arg0.getRowCount() != arg1.getRowCount() ) {
            return this.value = new CError( cErrorType.not_available );
        }
        else {
            arg0.foreach( function ( elem, r, c ) {
                var a = elem,
                    b = arg1.getElementRowCol( r, c );
                if ( a instanceof CNumber && b instanceof CNumber ) {
                    this.array[r][c] = new CNumber( Math.permut( a.getValue(), b.getValue() ) );
                }
                else
                    this.array[r][c] = new CError( cErrorType.wrong_value_type );
            } )
            return this.value = arg0;
        }
    }
    else if ( arg0 instanceof CArray ) {
        arg0.foreach( function ( elem, r, c ) {
            var a = elem,
                b = arg1;
            if ( a instanceof CNumber && b instanceof CNumber ) {

                if ( a.getValue() <= 0 || b.getValue() <= 0 || a.getValue() < b.getValue() )
                    this.array[r][c] = new CError( cErrorType.not_numeric );

                this.array[r][c] = new CNumber( Math.permut( a.getValue(), b.getValue() ) );
            }
            else
                this.array[r][c] = new CError( cErrorType.wrong_value_type );
        } )
        return this.value = arg0;
    }
    else if ( arg1 instanceof CArray ) {
        arg1.foreach( function ( elem, r, c ) {
            var a = arg0,
                b = elem;
            if ( a instanceof CNumber && b instanceof CNumber ) {

                if ( a.getValue() <= 0 || b.getValue() <= 0 || a.getValue() < b.getValue() )
                    this.array[r][c] = new CError( cErrorType.not_numeric );

                this.array[r][c] = new CNumber( Math.permut( a.getValue(), b.getValue() ) );
            }
            else
                this.array[r][c] = new CError( cErrorType.wrong_value_type );
        } )
        return this.value = arg1;
    }

    if ( arg0.getValue() <= 0 || arg1.getValue() <= 0 || arg0.getValue() < arg1.getValue() )
        return this.value = new CError( cErrorType.not_numeric );

    return this.value = new CNumber( Math.permut( arg0.getValue(), arg1.getValue() ) );
}
cPERMUT.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( number , number-chosen )"
    };
}

function cPOISSON() {
//    cBaseFunction.call( this, "POISSON" );
//    this.setArgumentsMin( 3 );
//    this.setArgumentsMax( 3 );

    this.name = "POISSON";
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
cPOISSON.prototype = Object.create( cBaseFunction.prototype )
cPOISSON.prototype.Calculate = function ( arg ) {

    function poisson( x, l, cumulativeFlag ) {
        var _x = parseInt( x.getValue() ), _l = l.getValue(), f = cumulativeFlag.toBool();

        if ( f ) {
            var sum = 0;
            for ( var k = 0; k <= x; k++ ) {
                sum += Math.pow( _l, k ) / Math.fact( k );
            }
            sum *= Math.exp( -_l );
            return new CNumber( sum );
        }
        else {
            return new CNumber( Math.exp( -_l ) * Math.pow( _l, _x ) / Math.fact( _x ) );
        }

    }

    var arg0 = arg[0], arg1 = arg[1], arg2 = arg[2], arg3 = arg[3];

    if ( arg0 instanceof CArea || arg0 instanceof CArea3D ) {
        arg0 = arg0.cross( arguments[1].first );
    }
    else if ( arg0 instanceof CArray ) {
        arg0 = arg0.getElement( 0 );
    }

    if ( arg1 instanceof CArea || arg1 instanceof CArea3D ) {
        arg1 = arg1.cross( arguments[1].first );
    }
    else if ( arg1 instanceof CArray ) {
        arg1 = arg1.getElement( 0 );
    }

    if ( arg2 instanceof CArea || arg2 instanceof CArea3D ) {
        arg2 = arg2.cross( arguments[1].first );
    }
    else if ( arg2 instanceof CArray ) {
        arg2 = arg2.getElement( 0 );
    }

    arg0 = arg0.tocNumber();
    arg1 = arg1.tocNumber();
    arg2 = arg2.tocBool();

    if ( arg0 instanceof CError ) return this.value = arg0;
    if ( arg1 instanceof CError ) return this.value = arg1;
    if ( arg2 instanceof CError ) return this.value = arg2;

    if ( arg0.getValue() < 0 || arg1.getValue() <= 0 )
        return this.value = new CError( cErrorType.not_numeric );

    return this.value = new CNumber( poisson( arg0, arg1, arg2 ) );

}
cPOISSON.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( x , mean , cumulative-flag )"
    };
}

function cPROB() {
//    cBaseFunction.call( this, "PROB" );
//    this.setArgumentsMin( 3 );
//    this.setArgumentsMax( 4 );
//    this.setFormat( this.formatType.noneFormat );

    this.name = "PROB";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 3;
    this.argumentsCurrent = 0;
    this.argumentsMax = 4;
    this.formatType = {
        def:-1, //подразумевается формат первой ячейки входящей в формулу.
        noneFormat:-2
    };
    this.numFormat = this.formatType.noneFormat;

}
cPROB.prototype = Object.create( cBaseFunction.prototype )
cPROB.prototype.Calculate = function ( arg ) {

    function prob( x, p, l, u ) {
        var fUp, fLo;
        fLo = l.getValue();
        if ( u instanceof CEmpty )
            fUp = fLo;
        else
            fUp = u.getValue();

        if ( fLo > fUp ) {
            var fTemp = fLo;
            fLo = fUp;
            fUp = fTemp;
        }
        var nC1 = x[0].length, nC2 = p[0].length,
            nR1 = x.length, nR2 = p.length;

        if ( nC1 != nC2 || nR1 != nR2 || nC1 == 0 || nR1 == 0 ||
            nC2 == 0 || nR2 == 0 )
            return new CError( cErrorType.not_available );
        else {
            var fSum = 0,
                fRes = 0, bStop = false, fP, fW;
            for ( var i = 0; i < nR1 && !bStop; i++ ) {
                for ( var j = 0; j < nC1 && !bStop; j++ ) {
                    if ( x[i][j] instanceof CNumber && p[i][j] instanceof CNumber ) {
                        fP = p[i][j].getValue();
                        fW = x[i][j].getValue();
                        if ( fP < 0.0 || fP > 1.0 )
                            bStop = true;
                        else {
                            fSum += fP;
                            if ( fW >= fLo && fW <= fUp )
                                fRes += fP;
                        }
                    }
                    else
                        return new CError( cErrorType.not_available );
                }

            }
            if ( bStop || Math.abs( fSum - 1.0 ) > 1.0E-7 )
                return new CError( cErrorType.not_available );
            else
                return new CNumber( fRes );
        }
    }

    var arg0 = arg[0], arg1 = arg[1], arg2 = arg[2], arg3 = arg[3] ? arg[3] : new CEmpty();
    if ( arg0 instanceof CArea || arg0 instanceof CArray ) {
        arg0 = arg0.getMatrix();
    }
    else if ( arg0 instanceof CArea3D ) {
        arg0 = arg0.getMatrix()[0];
    }
    else
        return this.value = new CError( cErrorType.not_available );

    if ( arg1 instanceof CArea || arg1 instanceof CArray ) {
        arg1 = arg1.getMatrix();
    }
    else if ( arg1 instanceof CArea3D ) {
        arg1 = arg1.getMatrix()[0];
    }
    else
        return this.value = new CError( cErrorType.not_available );


    if ( arg2 instanceof CArea || arg2 instanceof CArea3D ) {
        arg2 = arg2.cross( arguments[1].first );
    }
    else if ( arg2 instanceof CArray ) {
        arg2 = arg2.getElement( 0 );
    }

    if ( arg3 instanceof CArea || arg3 instanceof CArea3D ) {
        arg3 = arg3.cross( arguments[1].first );
    }
    else if ( arg3 instanceof CArray ) {
        arg3 = arg3.getElement( 0 );
    }

    arg2 = arg2.tocNumber();
    if ( !arg3 instanceof CEmpty )
        arg3 = arg3.tocNumber();

    if ( arg2 instanceof CError ) return this.value = arg2;
    if ( arg3 instanceof CError ) return this.value = arg3;

    return this.value = prob( arg0, arg1, arg2, arg3 );

};
cPROB.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( x-range , probability-range , lower-limit [ , upper-limit ] )"
    };
}

function cQUARTILE() {
//    cBaseFunction.call( this, "QUARTILE" );
//    this.setArgumentsMin( 2 );
//    this.setArgumentsMax( 2 );
//    this.setFormat( this.formatType.noneFormat );

    this.name = "QUARTILE";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 2;
    this.argumentsCurrent = 0;
    this.argumentsMax = 2;
    this.formatType = {
        def:-1, //подразумевается формат первой ячейки входящей в формулу.
        noneFormat:-2
    };
    this.numFormat = this.formatType.noneFormat;

}
cQUARTILE.prototype = Object.create( cBaseFunction.prototype )
cQUARTILE.prototype.Calculate = function ( arg ) {

    function quartile( A, k ) {

        var tA = [], fFlag = k.getValue();

        for ( var i = 0; i < A.length; i++ ) {
            for ( var j = 0; j < A[i].length; j++ ) {
                if ( A[i][j] instanceof  CError ) {
                    return A[i][j];
                }
                else if ( A[i][j] instanceof CNumber ) {
                    tA.push( A[i][j].getValue() );
                }
                else if ( A[i][j] instanceof CBool ) {
                    tA.push( A[i][j].tocNumber().getValue() );
                }
            }
        }

        tA.sort( function ( a, b ) {
            return a - b;
        } )

        var nSize = tA.length;
        if ( tA.length < 1 || nSize == 0 )
            return new CError( cErrorType.not_available );
        else {
            if ( nSize == 1 )
                return new CNumber( tA[0] );
            else {

                if ( fFlag < 0.0 || fFlag > 4 )
                    return new CError( cErrorType.not_numeric );
                else if ( fFlag == 0.0 )
                    return new CNumber( tA[0] );
                else if ( fFlag == 1.0 ) {
                    var nIndex = Math.floor( 0.25 * (nSize - 1) ),
                        fDiff = 0.25 * (nSize - 1) - Math.floor( 0.25 * (nSize - 1) );
                    if ( fDiff == 0.0 )
                        return new CNumber( tA[nIndex] );
                    else {
                        return new CNumber( tA[nIndex] +
                            fDiff * (tA[nIndex + 1] - tA[nIndex]) );
                    }
                }
                else if ( fFlag == 2.0 ) {
                    if ( nSize % 2 == 0 )
                        return new CNumber( (tA[nSize / 2 - 1] + tA[nSize / 2]) / 2.0 );
                    else
                        return new CNumber( tA[(nSize - 1) / 2] );
                }
                else if ( fFlag == 3.0 ) {
                    var nIndex = Math.floor( 0.75 * (nSize - 1) ),
                        fDiff = 0.75 * (nSize - 1) - Math.floor( 0.75 * (nSize - 1) );
                    if ( fDiff == 0.0 )
                        return new CNumber( tA[nIndex] );
                    else {
                        return new CNumber( tA[nIndex] +
                            fDiff * (tA[nIndex + 1] - tA[nIndex]) );
                    }
                }
                else
                    return new CNumber( tA[nSize - 1] );

            }
        }

    }

    var arg0 = arg[0], arg1 = arg[1];
    if ( arg0 instanceof CArea || arg0 instanceof CArray ) {
        arg0 = arg0.getMatrix();
    }
    else if ( arg0 instanceof CArea3D ) {
        arg0 = arg0.getMatrix()[0];
    }
    else
        return this.value = new CError( cErrorType.not_available );


    if ( arg1 instanceof CArea || arg1 instanceof CArea3D ) {
        arg1 = arg1.cross( arguments[1].first );
    }
    else if ( arg1 instanceof CArray ) {
        arg1 = arg1.getElement( 0 );
    }

    arg1 = arg1.tocNumber();

    if ( arg1 instanceof CError ) return this.value = arg1;

    return this.value = quartile( arg0, arg1 );

};
cQUARTILE.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"(  array , result-category )"
    };
}

function cRANK() {
    cBaseFunction.call( this, "RANK" );
}
cRANK.prototype = Object.create( cBaseFunction.prototype )

function cRSQ() {
//    cBaseFunction.call( this, "RSQ" );
//    this.setArgumentsMin( 2 );
//    this.setArgumentsMax( 2 );

    this.name = "RSQ";
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
cRSQ.prototype = Object.create( cBaseFunction.prototype )
cRSQ.prototype.Calculate = function ( arg ) {

    function rsq( x, y ) {

        var sumXDeltaYDelta = 0, sqrXDelta = 0, sqrYDelta = 0, _x = 0, _y = 0, xLength = 0;

        if ( x.length != y.length )
            return new CError( cErrorType.not_available );
        for ( var i = 0; i < x.length; i++ ) {

            if ( !( x[i] instanceof CNumber && y[i] instanceof CNumber ) ) {
                continue;
            }

            _x += x[i].getValue();
            _y += y[i].getValue();
            xLength++;
        }

        _x /= xLength;
        _y /= xLength;

        for ( var i = 0; i < x.length; i++ ) {

            if ( !( x[i] instanceof CNumber && y[i] instanceof CNumber ) ) {
                continue;
            }

            sumXDeltaYDelta += (x[i].getValue() - _x) * (y[i].getValue() - _y);
            sqrXDelta += (x[i].getValue() - _x) * (x[i].getValue() - _x);
            sqrYDelta += (y[i].getValue() - _y) * (y[i].getValue() - _y);

        }

        if ( sqrXDelta == 0 || sqrYDelta == 0 )
            return new CError( cErrorType.division_by_zero );
        else
            return new CNumber( Math.pow( sumXDeltaYDelta / Math.sqrt( sqrXDelta * sqrYDelta ), 2 ) );
    }


    var arg0 = arg[0], arg1 = arg[1], arr0 = [], arr1 = [];

    if ( arg0 instanceof CArea ) {
        arr0 = arg0.getValue();
    }
    else if ( arg0 instanceof CArray ) {
        arg0.foreach( function ( elem ) {
            arr0.push( elem );
        } );
    }
    else
        return this.value = CError( cErrorType.wrong_value_type )

    if ( arg1 instanceof CArea ) {
        arr1 = arg1.getValue();
    }
    else if ( arg1 instanceof CArray ) {
        arg1.foreach( function ( elem ) {
            arr1.push( elem );
        } );
    }
    else
        return this.value = CError( cErrorType.wrong_value_type )

    return this.value = rsq( arr0, arr1 );

}
cRSQ.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( array-1 , array-2 )"
    };
}

function cSKEW() {
//    cBaseFunction.call( this, "SKEW" );
//    this.setArgumentsMin( 1 );
//    this.setArgumentsMax( 255 );

    this.name = "SKEW";
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
cSKEW.prototype = Object.create( cBaseFunction.prototype )
cSKEW.prototype.Calculate = function ( arg ) {

    function skew( x ) {

        var sumSQRDeltaX = 0, _x = 0, xLength = 0, standDev = 0, sumSQRDeltaXDivstandDev = 0;
        for ( var i = 0; i < x.length; i++ ) {

            if ( x[i] instanceof CNumber ) {
                _x += x[i].getValue();
                xLength++;
            }

        }

        if ( xLength <= 2 )
            return new CError( cErrorType.not_available )

        _x /= xLength;

        for ( var i = 0; i < x.length; i++ ) {

            if ( x[i] instanceof CNumber ) {
                sumSQRDeltaX += Math.pow( x[i].getValue() - _x, 2 );
            }

        }

        standDev = Math.sqrt( sumSQRDeltaX / ( xLength - 1 ) );

        for ( var i = 0; i < x.length; i++ ) {

            if ( x[i] instanceof CNumber ) {
                sumSQRDeltaXDivstandDev += Math.pow( (x[i].getValue() - _x) / standDev, 3 );
            }

        }

        return new CNumber( xLength / (xLength - 1) / (xLength - 2) * sumSQRDeltaXDivstandDev )

    }

    var arr0 = [];

    for ( var j = 0; j < this.getArguments(); j++ ) {

        if ( arg[j] instanceof CArea || arg[j] instanceof CArea3D ) {
            arg[j].foreach2( function ( elem ) {
                if ( elem instanceof  CNumber )
                    arr0.push( elem );
            } );
        }
        else if ( arg[j] instanceof CRef || arg[j] instanceof CRef3D ) {
            var a = arg[j].getValue();
            if ( a instanceof  CNumber )
                arr0.push( a );
        }
        else if ( arg[j] instanceof CArray ) {
            arg[j].foreach( function ( elem ) {
                if ( elem instanceof  CNumber )
                    arr0.push( elem );
            } );
        }
        else if ( arg[j] instanceof CNumber || arg[j] instanceof CBool ) {
            arr0.push( arg[j].tocNumber() );
        }
        else if ( arg[j] instanceof CString ) {
            continue;
        }
        else
            return this.value = CError( cErrorType.wrong_value_type )

    }
    return this.value = skew( arr0 );

}
cSKEW.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( argument-list )"
    };
}

function cSLOPE() {
//    cBaseFunction.call( this, "SLOPE" );
//    this.setArgumentsMin( 2 );
//    this.setArgumentsMax( 2 );

    this.name = "SLOPE";
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
cSLOPE.prototype = Object.create( cBaseFunction.prototype )
cSLOPE.prototype.Calculate = function ( arg ) {

    function slope( y, x ) {

        var sumXDeltaYDelta = 0, sqrXDelta = 0, _x = 0, _y = 0, xLength = 0;

        if ( x.length != y.length )
            return new CError( cErrorType.not_available );
        for ( var i = 0; i < x.length; i++ ) {

            if ( !( x[i] instanceof CNumber && y[i] instanceof CNumber ) ) {
                continue;
            }

            _x += x[i].getValue();
            _y += y[i].getValue();
            xLength++;
        }

        _x /= xLength;
        _y /= xLength;

        for ( var i = 0; i < x.length; i++ ) {

            if ( !( x[i] instanceof CNumber && y[i] instanceof CNumber ) ) {
                continue;
            }

            sumXDeltaYDelta += (x[i].getValue() - _x) * (y[i].getValue() - _y);
            sqrXDelta += (x[i].getValue() - _x) * (x[i].getValue() - _x);

        }

        if ( sqrXDelta == 0 )
            return new CError( cErrorType.division_by_zero );
        else
            return new CNumber( sumXDeltaYDelta / sqrXDelta );
    }


    var arg0 = arg[0], arg1 = arg[1], arr0 = [], arr1 = [];

    if ( arg0 instanceof CArea ) {
        arr0 = arg0.getValue();
    }
    else if ( arg0 instanceof CArray ) {
        arg0.foreach( function ( elem ) {
            arr0.push( elem );
        } );
    }
    else
        return this.value = CError( cErrorType.wrong_value_type )

    if ( arg1 instanceof CArea ) {
        arr1 = arg1.getValue();
    }
    else if ( arg1 instanceof CArray ) {
        arg1.foreach( function ( elem ) {
            arr1.push( elem );
        } );
    }
    else
        return this.value = CError( cErrorType.wrong_value_type )

    return this.value = slope( arr0, arr1 );

}
cSLOPE.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( array-1 , array-2 )"
    };
}

function cSMALL() {
//    cBaseFunction.call( this, "SMALL" );
//    this.setArgumentsMin( 2 );
//    this.setArgumentsMax( 2 );
//    this.setFormat( this.formatType.noneFormat );

    this.name = "SMALL";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 2;
    this.argumentsCurrent = 0;
    this.argumentsMax = 2;
    this.formatType = {
        def:-1, //подразумевается формат первой ячейки входящей в формулу.
        noneFormat:-2
    };
    this.numFormat = this.formatType.noneFormat;

}
cSMALL.prototype = Object.create( cBaseFunction.prototype )
cSMALL.prototype.Calculate = function ( arg ) {

    function frequency( A, k ) {

        var tA = [];

        for ( var i = 0; i < A.length; i++ ) {
            for ( var j = 0; j < A[i].length; j++ ) {
                if ( A[i][j] instanceof  CError ) {
                    return A[i][j];
                }
                else if ( A[i][j] instanceof CNumber ) {
                    tA.push( A[i][j].getValue() );
                }
                else if ( A[i][j] instanceof CBool ) {
                    tA.push( A[i][j].tocNumber().getValue() );
                }
            }
        }

        tA.sort( function ( a, b ) {
            return a - b
        } )

        if ( k.getValue() > tA.length || k.getValue() <= 0 )
            return new CError( cErrorType.not_available );
        else
            return new CNumber( tA[k.getValue() - 1] );
    }

    var arg0 = arg[0], arg1 = arg[1];
    if ( arg0 instanceof CArea || arg0 instanceof CArray ) {
        arg0 = arg0.getMatrix();
    }
    else if ( arg0 instanceof CArea3D ) {
        arg0 = arg0.getMatrix()[0];
    }
    else
        return this.value = new CError( cErrorType.not_available );


    if ( arg1 instanceof CArea || arg1 instanceof CArea3D ) {
        arg1 = arg1.cross( arguments[1].first );
    }
    else if ( arg1 instanceof CArray ) {
        arg1 = arg1.getElement( 0 );
    }

    arg1 = arg1.tocNumber();

    if ( arg1 instanceof CError ) return this.value = arg1;

    return this.value = frequency( arg0, arg1 );

};
cSMALL.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"(  array , k )"
    };
}

function cSTANDARDIZE() {
//    cBaseFunction.call( this, "STANDARDIZE" );
//    this.setArgumentsMin( 3 );
//    this.setArgumentsMax( 3 );

    this.name = "STANDARDIZE";
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
cSTANDARDIZE.prototype = Object.create( cBaseFunction.prototype )
cSTANDARDIZE.prototype.Calculate = function ( arg ) {

    var arg0 = arg[0], arg1 = arg[1], arg2 = arg[2];

    function standardize( x, mue, sigma ) {
        if ( sigma <= 0.0 )
            return new CError( cErrorType.not_numeric );
        else
            return new CNumber( (x - mue) / sigma );
    }

    if ( arg0 instanceof CArea || arg0 instanceof CArea3D ) {
        arg0 = arg0.cross( arguments[1].first );
    }
    else if ( arg0 instanceof CArray ) {
        arg0 = arg0.getElement( 0 );
    }

    if ( arg1 instanceof CArea || arg1 instanceof CArea3D ) {
        arg1 = arg1.cross( arguments[1].first );
    }
    else if ( arg1 instanceof CArray ) {
        arg1 = arg1.getElement( 0 );
    }

    if ( arg2 instanceof CArea || arg2 instanceof CArea3D ) {
        arg2 = arg2.cross( arguments[1].first );
    }
    else if ( arg2 instanceof CArray ) {
        arg2 = arg2.getElement( 0 );
    }

    arg0 = arg0.tocNumber();
    arg1 = arg1.tocNumber();
    arg2 = arg2.tocNumber();

    if ( arg0 instanceof CError ) return this.value = arg0;
    if ( arg1 instanceof CError ) return this.value = arg1;
    if ( arg2 instanceof CError ) return this.value = arg2;

    return this.value = standardize( arg0.getValue(), arg1.getValue(), arg2.getValue() );
}
cSTANDARDIZE.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( x , mean , standard-deviation )"
    };
}

function cSTDEV() {
//    cBaseFunction.call( this, "STDEV" );
//    this.setArgumentsMin( 1 );
//    this.setArgumentsMax( 255 );
//    this.setFormat( this.formatType.noneFormat );

    this.name = "STDEV";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 1;
    this.argumentsCurrent = 0;
    this.argumentsMax = 255;
    this.formatType = {
        def:-1, //подразумевается формат первой ячейки входящей в формулу.
        noneFormat:-2
    };
    this.numFormat = this.formatType.noneFormat;

}
cSTDEV.prototype = Object.create( cBaseFunction.prototype )
cSTDEV.prototype.Calculate = function ( arg ) {
    var count = 0, sum = new CNumber( 0 ), member = [];
    for ( var i = 0; i < arg.length; i++ ) {
        var _arg = arg[i];
        if ( _arg instanceof CRef || _arg instanceof CRef3D ) {
            var _argV = _arg.getValue();
            if ( _argV instanceof CNumber ) {
                member.push( _argV );
                sum = _func[sum.type][_argV.type]( sum, _argV, "+" );
                count++;
            }
        }
        else if ( _arg instanceof CArea || _arg instanceof CArea3D ) {
            var _argAreaValue = _arg.getValue();
            for ( var j = 0; j < _argAreaValue.length; j++ ) {
                var __arg = _argAreaValue[j];
                if ( __arg instanceof CNumber ) {
                    member.push( __arg );
                    sum = _func[sum.type][__arg.type]( sum, __arg, "+" );
                    count++;
                }
            }
        }
        else if ( _arg instanceof CArray ) {
            _arg.foreach( function ( elem ) {
                var e = elem.tocNumber();
                if ( e instanceof CNumber ) {
                    member.push( e );
                    sum = _func[sum.type][e.type]( sum, e, "+" );
                    count++;
                }
            } )
        }
        else {
            _arg = _arg.tocNumber();
            if ( _arg instanceof CNumber ) {
                member.push( _arg );
                sum = _func[sum.type][_arg.type]( sum, _arg, "+" );
                count++;
            }
        }
    }
    var average = sum.getValue() / count, res = 0, av;
    for ( var i = 0; i < member.length; i++ ) {
        av = member[i] - average;
        res += av * av;
    }
    return this.value = new CNumber( Math.sqrt( res / (count - 1) ) );
};
cSTDEV.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( argument-list )"
    };
}

function cSTDEVA() {
//    cBaseFunction.call( this, "STDEVA" );
//    this.setArgumentsMin( 1 );
//    this.setArgumentsMax( 255 );
//    this.setFormat( this.formatType.noneFormat );

    this.name = "STDEVA";
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
cSTDEVA.prototype = Object.create( cBaseFunction.prototype )
cSTDEVA.prototype.Calculate = function ( arg ) {
    var count = 0, sum = new CNumber( 0 ), member = [];
    for ( var i = 0; i < arg.length; i++ ) {
        var _arg = arg[i];
        if ( _arg instanceof CRef || _arg instanceof CRef3D ) {
            var _argV = _arg.getValue().tocNumber();
            if ( _argV instanceof CNumber ) {
                member.push( _argV );
                sum = _func[sum.type][_argV.type]( sum, _argV, "+" );
                count++;
            }
        }
        else if ( _arg instanceof CArea || _arg instanceof CArea3D ) {
            var _argAreaValue = _arg.getValue();
            for ( var j = 0; j < _argAreaValue.length; j++ ) {
                var __arg = _argAreaValue[j].tocNumber();
                if ( __arg instanceof CNumber ) {
                    member.push( __arg );
                    sum = _func[sum.type][__arg.type]( sum, __arg, "+" );
                    count++;
                }
            }
        }
        else if ( _arg instanceof CArray ) {
            _arg.foreach( function ( elem ) {
                var e = elem.tocNumber();
                if ( e instanceof CNumber ) {
                    member.push( e );
                    sum = _func[sum.type][e.type]( sum, e, "+" );
                    count++;
                }
            } )
        }
        else {
            _arg = _arg.tocNumber();
            if ( _arg instanceof CNumber ) {
                member.push( _arg );
                sum = _func[sum.type][_arg.type]( sum, _arg, "+" );
                count++;
            }
        }
    }
    var average = sum.getValue() / count, res = 0, av;
    for ( var i = 0; i < member.length; i++ ) {
        av = member[i] - average;
        res += av * av;
    }
    return this.value = new CNumber( Math.sqrt( res / (count - 1) ) );
};
cSTDEVA.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( argument-list )"
    };
}

function cSTDEVP() {
//    cBaseFunction.call( this, "STDEVP" );

    this.name = "STDEVP";
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
cSTDEVP.prototype = Object.create( cBaseFunction.prototype )
cSTDEVP.prototype.Calculate = function ( arg ) {

    function _var( x ) {

        var tA = [], sumSQRDeltaX = 0, _x = 0, xLength = 0;
        for ( var i = 0; i < x.length; i++ ) {

            if ( x[i] instanceof CNumber ) {
                _x += x[i].getValue();
                tA.push( x[i].getValue() )
                xLength++;
            }
            else if( x[i] instanceof  CError ){
                return x[i];
            }

        }

        _x /= xLength;

        for ( var i = 0; i < x.length; i++ ) {

            sumSQRDeltaX += (tA[i] - _x) * (tA[i] - _x)

        }

        return new CNumber( Math.sqrt( sumSQRDeltaX / xLength ) );

    }

    var arr0 = [];

    for ( var j = 0; j < this.getArguments(); j++ ) {

        if ( arg[j] instanceof CArea || arg[j] instanceof CArea3D ) {
            arg[j].foreach2( function ( elem ) {
                if ( elem instanceof  CNumber || elem instanceof  CError ){
                    arr0.push( elem );
                }
            } );
        }
        else if ( arg[j] instanceof CRef || arg[j] instanceof CRef3D ) {
            var a = arg[j].getValue();
            if ( a instanceof  CNumber || a instanceof  CError ){
                arr0.push( a );
            }
        }
        else if ( arg[j] instanceof CArray ) {
            arg[j].foreach( function ( elem ) {
                if ( elem instanceof  CNumber || elem instanceof  CError ){
                    arr0.push( elem );
                }
            } );
        }
        else if ( arg[j] instanceof CNumber || arg[j] instanceof CBool ) {
            arr0.push( arg[j].tocNumber() );
        }
        else if ( arg[j] instanceof CString || arg[j] instanceof  CEmpty ) {
            arr0.push( new CNumber(0) );
        }
        else
            return this.value = CError( cErrorType.wrong_value_type )

    }
    return this.value = _var( arr0 );
}
cSTDEVP.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( argument-list )"
    };
}

function cSTDEVPA() {
//    cBaseFunction.call( this, "STDEVPA" );

    this.name = "STDEVPA";
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
cSTDEVPA.prototype = Object.create( cBaseFunction.prototype )
cSTDEVPA.prototype.Calculate = function ( arg ) {

    function _var( x ) {

        var tA = [], sumSQRDeltaX = 0, _x = 0, xLength = 0;
        for ( var i = 0; i < x.length; i++ ) {

            if ( x[i] instanceof CNumber ) {
                _x += x[i].getValue();
                tA.push( x[i].getValue() )
                xLength++;
            }
            else if( x[i] instanceof  CError ){
                return x[i];
            }

        }

        _x /= xLength;

        for ( var i = 0; i < x.length; i++ ) {

            sumSQRDeltaX += (tA[i] - _x) * (tA[i] - _x)

        }

        return new CNumber( Math.sqrt( sumSQRDeltaX / xLength ) );

    }

    var arr0 = [];

    for ( var j = 0; j < this.getArguments(); j++ ) {

        if ( arg[j] instanceof CArea || arg[j] instanceof CArea3D ) {
            arg[j].foreach2( function ( elem ) {
                if ( elem instanceof  CNumber || elem instanceof  CError ){
                    arr0.push( elem );
                }
                else if ( elem instanceof  CBool ) {
                    arr0.push( elem.tocNumber() );
                }
                else{
                    arr0.push( new CNumber(0) );
                }
            } );
        }
        else if ( arg[j] instanceof CRef || arg[j] instanceof CRef3D ) {
            var a = arg[j].getValue();
            if ( a instanceof  CNumber || a instanceof  CError ){
                arr0.push( a );
            }
            else if ( a instanceof  CBool ) {
                arr0.push( a.tocNumber() );
            }
            else{
                arr0.push( new CNumber(0) );
            }
        }
        else if ( arg[j] instanceof CArray ) {
            arg[j].foreach( function ( elem ) {
                if ( elem instanceof  CNumber || elem instanceof  CError ){
                    arr0.push( elem );
                }
                else if ( elem instanceof  CBool ) {
                    arr0.push( elem.tocNumber() );
                }
                else{
                    arr0.push( new CNumber(0) );
                }
            } );
        }
        else if ( arg[j] instanceof CNumber || arg[j] instanceof CBool ) {
            arr0.push( arg[j].tocNumber() );
        }
        else if ( arg[j] instanceof CString || arg[j] instanceof  CEmpty ) {
            arr0.push( new CNumber(0) );
        }
        else
            return this.value = CError( cErrorType.wrong_value_type )

    }
    return this.value = _var( arr0 );
}
cSTDEVPA.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( argument-list )"
    };
}

function cSTEYX() {
//    cBaseFunction.call( this, "STEYX" );

    this.name = "STEYX";
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
cSTEYX.prototype = Object.create( cBaseFunction.prototype )
cSTEYX.prototype.Calculate = function ( arg ) {

    function steyx( y, x ) {

        var sumXDeltaYDelta = 0, sqrXDelta = 0, sqrYDelta = 0, _x = 0, _y = 0, xLength = 0;

        if ( x.length != y.length )
            return new CError( cErrorType.not_available );
        for ( var i = 0; i < x.length; i++ ) {

            if ( !( x[i] instanceof CNumber && y[i] instanceof CNumber ) ) {
                continue;
            }

            _x += x[i].getValue();
            _y += y[i].getValue();
            xLength++;
        }

        _x /= xLength;
        _y /= xLength;

        for ( var i = 0; i < x.length; i++ ) {

            if ( !( x[i] instanceof CNumber && y[i] instanceof CNumber ) ) {
                continue;
            }

            sumXDeltaYDelta += (x[i].getValue() - _x) * (y[i].getValue() - _y);
            sqrXDelta += (x[i].getValue() - _x) * (x[i].getValue() - _x);
            sqrYDelta += (y[i].getValue() - _y) * (y[i].getValue() - _y);

        }



        if ( sqrXDelta == 0 || sqrYDelta == 0 || xLength < 3 )
            return new CError( cErrorType.division_by_zero );
        else
            return new CNumber( Math.sqrt( (1/(xLength-2)) * (sqrYDelta - sumXDeltaYDelta * sumXDeltaYDelta / sqrXDelta) ) );
    }


    var arg0 = arg[0], arg1 = arg[1], arr0 = [], arr1 = [];

    if ( arg0 instanceof CArea ) {
        arr0 = arg0.getValue();
    }
    else if ( arg0 instanceof CArray ) {
        arg0.foreach( function ( elem ) {
            arr0.push( elem );
        } );
    }
    else
        return this.value = CError( cErrorType.wrong_value_type )

    if ( arg1 instanceof CArea ) {
        arr1 = arg1.getValue();
    }
    else if ( arg1 instanceof CArray ) {
        arg1.foreach( function ( elem ) {
            arr1.push( elem );
        } );
    }
    else
        return this.value = CError( cErrorType.wrong_value_type )

    return this.value = steyx( arr0, arr1 );

}
cSTEYX.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( known-ys , known-xs )"
    };
}

function cTDIST() {
    cBaseFunction.call( this, "TDIST" );
}
cTDIST.prototype = Object.create( cBaseFunction.prototype )

function cTINV() {
    cBaseFunction.call( this, "TINV" );
}
cTINV.prototype = Object.create( cBaseFunction.prototype )

function cTREND() {
    cBaseFunction.call( this, "TREND" );
}
cTREND.prototype = Object.create( cBaseFunction.prototype )

function cTRIMMEAN() {
    cBaseFunction.call( this, "TRIMMEAN" );
}
cTRIMMEAN.prototype = Object.create( cBaseFunction.prototype )

function cTTEST() {
    cBaseFunction.call( this, "TTEST" );
}
cTTEST.prototype = Object.create( cBaseFunction.prototype )

function cVAR() {
//    cBaseFunction.call( this, "VAR" );
//    this.setArgumentsMin( 1 );
//    this.setArgumentsMax( 255 );

    this.name = "VAR";
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
cVAR.prototype = Object.create( cBaseFunction.prototype )
cVAR.prototype.Calculate = function ( arg ) {

    function _var( x ) {

        var tA = [], sumSQRDeltaX = 0, _x = 0, xLength = 0;
        for ( var i = 0; i < x.length; i++ ) {

            if ( x[i] instanceof CNumber ) {
                _x += x[i].getValue();
                tA.push( x[i].getValue() )
                xLength++;
            }
            else if( x[i] instanceof  CError ){
                return x[i];
            }

        }

        _x /= xLength;

        for ( var i = 0; i < x.length; i++ ) {

            sumSQRDeltaX += (tA[i] - _x) * (tA[i] - _x)

        }

        return new CNumber( sumSQRDeltaX / (xLength - 1) )

    }

    var arr0 = [];

    for ( var j = 0; j < this.getArguments(); j++ ) {

        if ( arg[j] instanceof CArea || arg[j] instanceof CArea3D ) {
            arg[j].foreach2( function ( elem ) {
                if ( elem instanceof  CNumber )
                    arr0.push( elem );
            } );
        }
        else if ( arg[j] instanceof CRef || arg[j] instanceof CRef3D ) {
            var a = arg[j].getValue();
            if ( a instanceof  CNumber )
                arr0.push( a );
        }
        else if ( arg[j] instanceof CArray ) {
            arg[j].foreach( function ( elem ) {
                if ( elem instanceof  CNumber )
                    arr0.push( elem );
            } );
        }
        else if ( arg[j] instanceof CNumber || arg[j] instanceof CBool ) {
            arr0.push( arg[j].tocNumber() );
        }
        else if ( arg[j] instanceof CString || arg[j] instanceof  CEmpty ) {
            continue;
        }
        else
            return this.value = CError( cErrorType.wrong_value_type )

    }
    return this.value = _var( arr0 );

}
cVAR.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( argument-list )"
    };
}

function cVARA() {
//    cBaseFunction.call( this, "VARA" );

    this.name = "VARA";
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
cVARA.prototype = Object.create( cBaseFunction.prototype )
cVARA.prototype.Calculate = function ( arg ) {

    function _var( x ) {

        var tA = [], sumSQRDeltaX = 0, _x = 0, xLength = 0;
        for ( var i = 0; i < x.length; i++ ) {

            if ( x[i] instanceof CNumber ) {
                _x += x[i].getValue();
                tA.push( x[i].getValue() )
                xLength++;
            }
            else if( x[i] instanceof  CError ){
                return x[i];
            }

        }

        _x /= xLength;

        for ( var i = 0; i < x.length; i++ ) {

            sumSQRDeltaX += (tA[i] - _x) * (tA[i] - _x)

        }

        return new CNumber( sumSQRDeltaX / (xLength - 1) )

    }

    var arr0 = [];

    for ( var j = 0; j < this.getArguments(); j++ ) {

        if ( arg[j] instanceof CArea || arg[j] instanceof CArea3D ) {
            arg[j].foreach2( function ( elem ) {
                if ( elem instanceof  CNumber || elem instanceof  CError ){
                    arr0.push( elem );
                }
                else if ( elem instanceof  CBool ) {
                    arr0.push( elem.tocNumber() );
                }
                else{
                    arr0.push( new CNumber(0) );
                }
            } );
        }
        else if ( arg[j] instanceof CRef || arg[j] instanceof CRef3D ) {
            var a = arg[j].getValue();
            if ( a instanceof  CNumber || a instanceof  CError ){
                arr0.push( a );
            }
            else if ( a instanceof  CBool ) {
                arr0.push( a.tocNumber() );
            }
            else{
                arr0.push( new CNumber(0) );
            }
        }
        else if ( arg[j] instanceof CArray ) {
            arg[j].foreach( function ( elem ) {
                if ( elem instanceof  CNumber || elem instanceof  CError ){
                    arr0.push( elem );
                }
                else if ( elem instanceof  CBool ) {
                    arr0.push( elem.tocNumber() );
                }
                else{
                    arr0.push( new CNumber(0) );
                }
            } );
        }
        else if ( arg[j] instanceof CNumber || arg[j] instanceof CBool ) {
            arr0.push( arg[j].tocNumber() );
        }
        else if ( arg[j] instanceof CString || arg[j] instanceof  CEmpty ) {
            arr0.push( new CNumber(0) );
        }
        else
            return this.value = CError( cErrorType.wrong_value_type )

    }
    return this.value = _var( arr0 );
}
cVARA.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( argument-list )"
    };
}

function cVARP() {
//    cBaseFunction.call( this, "VARP" );

    this.name = "VARP";
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
cVARP.prototype = Object.create( cBaseFunction.prototype )
cVARP.prototype.Calculate = function ( arg ) {

    function _var( x ) {

        var tA = [], sumSQRDeltaX = 0, _x = 0, xLength = 0;
        for ( var i = 0; i < x.length; i++ ) {

            if ( x[i] instanceof CNumber ) {
                _x += x[i].getValue();
                tA.push( x[i].getValue() )
                xLength++;
            }
            else if( x[i] instanceof  CError ){
                return x[i];
            }

        }

        _x /= xLength;

        for ( var i = 0; i < x.length; i++ ) {

            sumSQRDeltaX += (tA[i] - _x) * (tA[i] - _x)

        }

        return new CNumber( sumSQRDeltaX / xLength )

    }

    var arr0 = [];

    for ( var j = 0; j < this.getArguments(); j++ ) {

        if ( arg[j] instanceof CArea || arg[j] instanceof CArea3D ) {
            arg[j].foreach2( function ( elem ) {
                if ( elem instanceof  CNumber || elem instanceof  CError ){
                    arr0.push( elem );
                }
            } );
        }
        else if ( arg[j] instanceof CRef || arg[j] instanceof CRef3D ) {
            var a = arg[j].getValue();
            if ( a instanceof  CNumber || a instanceof  CError ){
                arr0.push( a );
            }
        }
        else if ( arg[j] instanceof CArray ) {
            arg[j].foreach( function ( elem ) {
                if ( elem instanceof  CNumber || elem instanceof  CError ){
                    arr0.push( elem );
                }
               } );
        }
        else if ( arg[j] instanceof CNumber || arg[j] instanceof CBool ) {
            arr0.push( arg[j].tocNumber() );
        }
        else if ( arg[j] instanceof CString || arg[j] instanceof  CEmpty ) {
            arr0.push( new CNumber(0) );
        }
        else
            return this.value = CError( cErrorType.wrong_value_type )

    }
    return this.value = _var( arr0 );
}
cVARP.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( argument-list )"
    };
}

function cVARPA() {
//    cBaseFunction.call( this, "VARPA" );

    this.name = "VARPA";
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
cVARPA.prototype = Object.create( cBaseFunction.prototype )
cVARPA.prototype.Calculate = function ( arg ) {

    function _var( x ) {

        var tA = [], sumSQRDeltaX = 0, _x = 0, xLength = 0;
        for ( var i = 0; i < x.length; i++ ) {

            if ( x[i] instanceof CNumber ) {
                _x += x[i].getValue();
                tA.push( x[i].getValue() )
                xLength++;
            }
            else if( x[i] instanceof  CError ){
                return x[i];
            }

        }

        _x /= xLength;

        for ( var i = 0; i < x.length; i++ ) {

            sumSQRDeltaX += (tA[i] - _x) * (tA[i] - _x)

        }

        return new CNumber( sumSQRDeltaX / xLength );

    }

    var arr0 = [];

    for ( var j = 0; j < this.getArguments(); j++ ) {

        if ( arg[j] instanceof CArea || arg[j] instanceof CArea3D ) {
            arg[j].foreach2( function ( elem ) {
                if ( elem instanceof  CNumber || elem instanceof  CError ){
                    arr0.push( elem );
                }
                else if ( elem instanceof  CBool ) {
                    arr0.push( elem.tocNumber() );
                }
                else{
                    arr0.push( new CNumber(0) );
                }
            } );
        }
        else if ( arg[j] instanceof CRef || arg[j] instanceof CRef3D ) {
            var a = arg[j].getValue();
            if ( a instanceof  CNumber || a instanceof  CError ){
                arr0.push( a );
            }
            else if ( a instanceof  CBool ) {
                arr0.push( a.tocNumber() );
            }
            else{
                arr0.push( new CNumber(0) );
            }
        }
        else if ( arg[j] instanceof CArray ) {
            arg[j].foreach( function ( elem ) {
                if ( elem instanceof  CNumber || elem instanceof  CError ){
                    arr0.push( elem );
                }
                else if ( elem instanceof  CBool ) {
                    arr0.push( elem.tocNumber() );
                }
                else{
                    arr0.push( new CNumber(0) );
                }
            } );
        }
        else if ( arg[j] instanceof CNumber || arg[j] instanceof CBool ) {
            arr0.push( arg[j].tocNumber() );
        }
        else if ( arg[j] instanceof CString || arg[j] instanceof  CEmpty ) {
            arr0.push( new CNumber(0) );
        }
        else
            return this.value = CError( cErrorType.wrong_value_type )

    }
    return this.value = _var( arr0 );
}
cVARPA.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( argument-list )"
    };
}

function cWEIBULL() {
    cBaseFunction.call( this, "WEIBULL" );
}
cWEIBULL.prototype = Object.create( cBaseFunction.prototype )

function cZTEST() {
    cBaseFunction.call( this, "ZTEST" );
}
cZTEST.prototype = Object.create( cBaseFunction.prototype )
