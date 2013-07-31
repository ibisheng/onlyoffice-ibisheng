/**
 * Created with JetBrains WebStorm.
 * User: Dmitry.Shahtanov
 * Date: 27.06.13
 * Time: 15:18
 * To change this template use File | Settings | File Templates.
 */
cFormulaFunction.Statistical = {
    'groupName':"Statistical",
    'AVEDEV':function () {
        var r = new cBaseFunction( "AVEDEV" );
        return r;
    },
    'AVERAGE':function () {
        var r = new cBaseFunction( "AVERAGE" );
        r.setArgumentsMin( 1 );
        r.setArgumentsMax( 255 );
        r.Calculate = function ( arg ) {
            var count = 0, sum = new cNumber( 0 );
            for ( var i = 0; i < arg.length; i++ ) {
                var _arg = arg[i];
                if ( _arg instanceof cRef || _arg instanceof cRef3D ) {
                    var _argV = _arg.getValue();
                    if ( _argV instanceof cNumber ) {
                        sum = _func[sum.type][_argV.type]( sum, _argV, "+" );
                        count++;
                    }
                }
                else if ( _arg instanceof cArea || _arg instanceof cArea3D ) {
                    var _argAreaValue = _arg.getValue();
                    for ( var j = 0; j < _argAreaValue.length; j++ ) {
                        var __arg = _argAreaValue[j];
                        if ( __arg instanceof cNumber ) {
                            sum = _func[sum.type][__arg.type]( sum, __arg, "+" );
                            count++;
                        }
                    }
                }
                else if ( _arg instanceof cArray ) {
                    _arg.foreach( function ( elem ) {
                        var e = elem.tocNumber();
                        if ( e instanceof cNumber ) {
                            sum = _func[sum.type][e.type]( sum, e, "+" );
                            count++;
                        }
                    } )
                }
                else {
                    if ( _arg instanceof cError )
                        continue;
                    sum = _func[sum.type][_arg.type]( sum, _arg, "+" );
                    count++;
                }
            }
            return this.value = new cNumber( sum.getValue() / count );
        };
        r.getInfo = function () {
            return {
                name:this.name,
                args:"(number1, number2, ...)"
            };
        }
        return r;
    },
    'AVERAGEA':function () {
        var r = new cBaseFunction( "AVERAGEA" );
        return r;
    },
    'AVERAGEIF':function () {
        var r = new cBaseFunction( "AVERAGEIF" );
        return r;
    },
    'AVERAGEIFS':function () {
        var r = new cBaseFunction( "AVERAGEIFS" );
        return r;
    },
    'BETADIST':function () {
        var r = new cBaseFunction( "BETADIST" );
        return r;
    },
    'BETAINV':function () {
        var r = new cBaseFunction( "BETAINV" );
        return r;
    },
    'BINOMDIST':function () {
        var r = new cBaseFunction( "BINOMDIST" );
        return r;
    },
    'CHIDIST':function () {
        var r = new cBaseFunction( "CHIDIST" );
        return r;
    },
    'CHIINV':function () {
        var r = new cBaseFunction( "CHIINV" );
        return r;
    },
    'CHITEST':function () {
        var r = new cBaseFunction( "CHITEST" );
        return r;
    },
    'CONFIDENCE':function () {
        var r = new cBaseFunction( "CONFIDENCE" );
        return r;
    },
    'CORREL':function () {
        var r = new cBaseFunction( "CORREL" );
        return r;
    },
    'COUNT':function () {
        var r = new cBaseFunction( "COUNT" );
        r.setArgumentsMin( 1 );
        r.setArgumentsMax( 255 );
        r.Calculate = function ( arg ) {
            var count = 0;
            for ( var i = 0; i < arg.length; i++ ) {
                var _arg = arg[i];
                if ( _arg instanceof cRef || _arg instanceof cRef3D ) {
                    var _argV = _arg.getValue();
                    if ( _argV instanceof cNumber ) {
                        count++;
                    }
                }
                else if ( _arg instanceof cArea || _arg instanceof cArea3D ) {
                    var _argAreaValue = _arg.getValue();
                    for ( var j = 0; j < _argAreaValue.length; j++ ) {
                        if ( _argAreaValue[j] instanceof cNumber ) {
                            count++;
                        }
                    }
                }
                else if ( _arg instanceof cNumber || _arg instanceof cBool || _arg instanceof cEmpty ) {
                    count++;
                }
                else if ( _arg instanceof cString ) {
                    if ( _arg.tocNumber() instanceof cNumber )
                        count++;
                }
                else if ( _arg instanceof cArray ) {
                    _arg.foreach( function ( elem ) {
                        var e = elem.tocNumber();
                        if ( e instanceof cNumber ) {
                            count++;
                        }
                    } )
                }
            }
            return this.value = new cNumber( count );
        };
        r.getInfo = function () {
            return {
                name:this.name,
                args:"( argument-list )"
            };
        }
        r.setFormat( r.formatType.noneFormat );
        return r;
    },
    'COUNTA':function () {
        var r = new cBaseFunction( "COUNTA" );
        return r;
    },
    'COUNTBLANK':function () {
        var r = new cBaseFunction( "COUNTBLANK" );
        r.setArgumentsMin( 1 );
        r.setArgumentsMax( 1 );
        r.Calculate = function ( arg ) {
            var arg0 = arg[0];
            if ( arg0 instanceof cArea || arg0 instanceof cArea3D )
                return this.value = arg0.countCells();
            else if ( arg0 instanceof cRef || arg0 instanceof cRef3D ) {
                return this.value = new cNumber( 1 );
            }
            else
                return this.value = new cError( cErrorType.bad_reference );
        }
        r.getInfo = function () {
            return {
                name:this.name,
                args:"( argument-list )"
            };
        }
        r.setFormat( r.formatType.noneFormat );
        return r;
    },
    'COUNTIF':function () {
        var r = new cBaseFunction( "COUNTIF" );
        r.setArgumentsMin( 2 );
        r.setArgumentsMax( 2 );
        r.Calculate = function ( arg ) {
            var arg0 = arg[0], arg1 = arg[1], _count = 0, valueForSearching, regexpSearch;
            if ( !(arg0 instanceof cRef || arg0 instanceof cRef3D || arg0 instanceof cArea || arg0 instanceof cArea3D) ) {
                return this.value = new cError( cErrorType.wrong_value_type );
            }

            if ( arg1 instanceof cArea || arg1 instanceof cArea3D ) {
                arg1 = arg1.cross( arguments[1].first );
            }
            else if ( arg1 instanceof cArray ) {
                arg1 = arg1.getElementRowCol( 0, 0 );
            }

            arg1 = arg1.tocString();

            if ( !(arg1 instanceof cString) ) {
                return this.value = new cError( cErrorType.wrong_value_type );
            }

            function matching( x, y, oper ) {
                var res = 0;
                if ( typeof x === typeof y ) {
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
                _count += res;
            }

            arg1 = arg1.toString();
            var operators = new RegExp( "^ *[<=> ]+ *" ), searchOperators = new RegExp( "^ *[*?]" )
            var match = arg1.match( operators );
            if ( match || parseNum( arg1 ) ) {

                var search, oper, val;
                if ( match ) {
                    search = arg1.substr( match[0].length );
                    oper = match[0].replace( /\s/g, "" );
                }
                else {
                    search = arg1;
                }
                valueForSearching = parseNum( search ) ? new cNumber( search ) : new cString( search );
                if ( arg0 instanceof cArea ) {
                    val = arg0.getValue();
                    for ( var i = 0; i < val.length; i++ ) {
                        matching( val[i], valueForSearching, oper );
                    }
                }
                else if ( arg0 instanceof cArea3D ) {
                    val = arg0.getValue();
                    for ( var i = 0; i < val.length; i++ ) {
                        matching( val[i], valueForSearching, oper );
                    }
                }
                else {
                    val = arg0.getValue();
                    matching( val, valueForSearching, oper );
                }
            }
            else {
                match = arg1.match( searchOperators )
                if ( match ) {
                    valueForSearching = arg1
                        .replace( /(~)?\*/g, function ( $0, $1 ) {
                            return $1 ? $0 : '[\\w\\W]*';
                        } )
                        .replace( /(~)?\?/g, function ( $0, $1 ) {
                            return $1 ? $0 : '[\\w\\W]{1,1}';
                        } )
                        .replace( /(~\*)/g, "\\*" ).replace( /(~\?)/g, "\\?" )
                    regexpSearch = new RegExp( valueForSearching + "$", "i" );
                    if ( arg0 instanceof cArea ) {
                        val = arg0.getValue();
                        for ( var i = 0; i < val.length; i++ ) {
                            _count += regexpSearch.test( val[i].value );
                        }
                    }
                    else if ( arg0 instanceof cArea3D ) {
                        val = arg0.getValue();
                        for ( var i in val ) {
                            for ( var j in val[i] ) {
                                _count += regexpSearch.test( val[i][j].value );
                            }
                        }
                    }
                    else {
                        val = arg0.getValue();
                        _count += regexpSearch.test( val.value );
                    }
                }
            }

            return this.value = new cNumber( _count );
        }
        r.getInfo = function () {
            return {
                name:this.name,
                args:"( cell-range, selection-criteria )"
            };
        }
        return r;
    },
    'COUNTIFS':function () {
        var r = new cBaseFunction( "COUNTIFS" );
        return r;
    },
    'COVAR':function () {
        var r = new cBaseFunction( "COVAR" );
        return r;
    },
    'CRITBINOM':function () {
        var r = new cBaseFunction( "CRITBINOM" );
        return r;
    },
    'DEVSQ':function () {
        var r = new cBaseFunction( "DEVSQ" );
        return r;
    },
    'EXPONDIST':function () {
        var r = new cBaseFunction( "EXPONDIST" );
        return r;
    },
    'FDIST':function () {
        var r = new cBaseFunction( "FDIST" );
        return r;
    },
    'FINV':function () {
        var r = new cBaseFunction( "FINV" );
        return r;
    },
    'FISHER':function () {
        var r = new cBaseFunction( "FISHER" );
        return r;
    },
    'FISHERINV':function () {
        var r = new cBaseFunction( "FISHERINV" );
        return r;
    },
    'FORECAST':function () {
        var r = new cBaseFunction( "FORECAST" );
        return r;
    },
    'FREQUENCY':function () {
        var r = new cBaseFunction( "FREQUENCY" );
        return r;
    },
    'FTEST':function () {
        var r = new cBaseFunction( "FTEST" );
        return r;
    },
    'GAMMADIST':function () {
        var r = new cBaseFunction( "GAMMADIST" );
        return r;
    },
    'GAMMAINV':function () {
        var r = new cBaseFunction( "GAMMAINV" );
        return r;
    },
    'GAMMALN':function () {
        var r = new cBaseFunction( "GAMMALN" );
        return r;
    },
    'GEOMEAN':function () {
        var r = new cBaseFunction( "GEOMEAN" );
        return r;
    },
    'GROWTH':function () {
        var r = new cBaseFunction( "GROWTH" );
        return r;
    },
    'HARMEAN':function () {
        var r = new cBaseFunction( "HARMEAN" );
        return r;
    },
    'HYPGEOMDIST':function () {
        var r = new cBaseFunction( "HYPGEOMDIST" );
        return r;
    },
    'INTERCEPT':function () {
        var r = new cBaseFunction( "INTERCEPT" );
        return r;
    },
    'KURT':function () {
        var r = new cBaseFunction( "KURT" );
        return r;
    },
    'LARGE':function () {
        var r = new cBaseFunction( "LARGE" );
        return r;
    },
    'LINEST':function () {
        var r = new cBaseFunction( "LINEST" );
        return r;
    },
    'LOGEST':function () {
        var r = new cBaseFunction( "LOGEST" );
        return r;
    },
    'LOGINV':function () {
        var r = new cBaseFunction( "LOGINV" );
        return r;
    },
    'LOGNORMDIST':function () {
        var r = new cBaseFunction( "LOGNORMDIST" );
        return r;
    },
    'MAX':function () {
        var r = new cBaseFunction( "MAX" );
        r.setArgumentsMin( 1 );
        r.setArgumentsMax( 255 );
        r.Calculate = function ( arg ) {
            var argI, argIVal, max = new cNumber( Number.NEGATIVE_INFINITY );
            for ( var i = 0; i < this.argumentsCurrent; i++ ) {
                argI = arg[i], argIVal = argI.getValue();
                if ( argI instanceof cRef || argI instanceof cRef3D ) {
                    if ( argIVal instanceof cError )
                        return this.value = argIVal;
                    if ( argIVal instanceof cNumber || argIVal instanceof cBool || argIVal instanceof cEmpty ) {
                        var v = argIVal.tocNumber();
                        if ( v.getValue() > max.getValue() )
                            max = v;
                    }
                }
                else if ( argI instanceof cArea || argI instanceof cArea3D ) {
                    var argArr = argI.getValue();
                    for ( var j = 0; j < argArr.length; j++ ) {
                        if ( argArr[j] instanceof cNumber || argArr[j] instanceof cBool || argArr[j] instanceof cEmpty ) {
                            var v = argArr[j].tocNumber();
                            if ( v.getValue() > max.getValue() )
                                max = v;
                        }
                        else if ( argArr[j] instanceof cError ) {
                            return this.value = argArr[j];
                        }
                    }
                }
                else if ( argI instanceof cError )
                    return this.value = argI;
                else if ( argI instanceof cString ) {
                    var v = argI.tocNumber();
                    if ( v instanceof cNumber )
                        if ( v.getValue() > max.getValue() )
                            max = v;
                }
                else if ( argI instanceof cBool || argI instanceof cEmpty ) {
                    var v = argI.tocNumber();
                    if ( v.getValue() > max.getValue() )
                        max = v;
                }
                else if ( argI instanceof cArray ) {
                    argI.foreach( function ( elem ) {
                        if ( elem instanceof cNumber ) {
                            if ( elem.getValue() > max.getValue() )
                                max = elem;
                        }
                        else if ( elem instanceof cError ) {
                            max = elem;
                            return true;
                        }
                    } )
                    if ( max instanceof cError ) {
                        return this.value = max;
                    }
                }
                else {
                    if ( argI.getValue() > max.getValue() )
                        max = argI;
                }
            }
            return this.value = ( max.value === Number.NEGATIVE_INFINITY ? new cNumber( 0 ) : max );
        };
        r.getInfo = function () {
            return {
                name:this.name,
                args:"(number1, number2, ...)"
            };
        }
        return r;
    },
    'MAXA':function () {
        var r = new cBaseFunction( "MAXA" );
        r.setArgumentsMin( 1 );
        r.setArgumentsMax( 255 );
        r.Calculate = function ( arg ) {
            var argI, max = new cNumber( Number.NEGATIVE_INFINITY );
            for ( var i = 0; i < this.argumentsCurrent; i++ ) {
                argI = arg[i], argIVal = argI.getValue();
                if ( argI instanceof cRef || argI instanceof cRef3D ) {

                    if ( argIVal instanceof cError )
                        return this.value = argIVal;

                    var v = argIVal.tocNumber();

                    if ( v instanceof cNumber && v.getValue() > max.getValue() )
                        max = v;
                }
                else if ( argI instanceof cArea || argI instanceof cArea3D ) {
                    var argArr = argI.getValue();
                    for ( var j = 0; j < argArr.length; j++ ) {

                        if ( argArr[j] instanceof cError )
                            return this.value = argArr[j];

                        var v = argArr[j].tocNumber();

                        if ( v instanceof cNumber && v.getValue() > max.getValue() )
                            max = v;
                    }
                }
                else if ( argI instanceof cError )
                    return this.value = argI;
                else if ( argI instanceof cString ) {
                    var v = argI.tocNumber();
                    if ( v instanceof cNumber )
                        if ( v.getValue() > max.getValue() )
                            max = v;
                }
                else if ( argI instanceof cBool || argI instanceof cEmpty ) {
                    var v = argI.tocNumber();
                    if ( v.getValue() > max.getValue() )
                        max = v;
                }
                else if ( argI instanceof cArray ) {
                    argI.foreach( function ( elem ) {
                        if ( elem instanceof cError ) {
                            max = elem;
                            return true;
                        }
                        elem = elem.tocNumber();

                        if ( elem instanceof cNumber && elem.getValue() > max.getValue() ) {
                            max = elem;
                        }
                    } )
                    if ( max instanceof cError ) {
                        return this.value = max;
                    }
                }
                else {
                    if ( argI.getValue() > max.getValue() )
                        max = argI;
                }
            }
            return this.value = ( max.value === Number.NEGATIVE_INFINITY ? new cNumber( 0 ) : max )
        };
        r.getInfo = function () {
            return {
                name:this.name,
                args:"(number1, number2, ...)"
            };
        }
        return r;
    },
    'MEDIAN':function () {
        var r = new cBaseFunction( "MEDIAN" );
        return r;
    },
    'MIN':function () {
        var r = new cBaseFunction( "MIN" );
        r.setArgumentsMin( 1 );
        r.setArgumentsMax( 255 );
        r.Calculate = function ( arg ) {
            var argI, argIVal, min = new cNumber( Number.POSITIVE_INFINITY );
            for ( var i = 0; i < this.argumentsCurrent; i++ ) {
                argI = arg[i], argIVal = argI.getValue();
                if ( argI instanceof cRef || argI instanceof cRef3D ) {
                    if ( argIVal instanceof cError )
                        return this.value = argIVal;
                    if ( argIVal instanceof cNumber || argIVal instanceof cBool || argIVal instanceof cEmpty ) {
                        var v = argIVal.tocNumber();
                        if ( v.getValue() < min.getValue() )
                            min = v;
                    }
                }
                else if ( argI instanceof cArea || argI instanceof cArea3D ) {
                    var argArr = argI.getValue();
                    for ( var j = 0; j < argArr.length; j++ ) {
                        if ( argArr[j] instanceof cNumber || argArr[j] instanceof cBool || argArr[j] instanceof cEmpty ) {
                            var v = argArr[j].tocNumber();
                            if ( v.getValue() < min.getValue() )
                                min = v;
                            continue;
                        }
                        else if ( argArr[j] instanceof cError ) {
                            return this.value = argArr[j];
                        }
                    }
                }
                else if ( argI instanceof cError )
                    return this.value = argI;
                else if ( argI instanceof cString ) {
                    var v = argI.tocNumber();
                    if ( v instanceof cNumber )
                        if ( v.getValue() < min.getValue() )
                            min = v;
                }
                else if ( argI instanceof cBool || argI instanceof cEmpty ) {
                    var v = argI.tocNumber();
                    if ( v.getValue() < min.getValue() )
                        min = v;
                }
                else if ( argI instanceof cArray ) {
                    argI.foreach( function ( elem ) {
                        if ( elem instanceof cNumber ) {
                            if ( elem.getValue() < min.getValue() )
                                min = elem;
                        }
                        else if ( elem instanceof cError ) {
                            min = elem;
                            return true;
                        }
                    } )
                    if ( min instanceof cError ) {
                        return this.value = min;
                    }
                }
                else {
                    if ( argI.getValue() < min.getValue() )
                        min = argI;
                }
            }
            return this.value = ( min.value === Number.POSITIVE_INFINITY ? new cNumber( 0 ) : min );
        };
        r.getInfo = function () {
            return {
                name:this.name,
                args:"(number1, number2, ...)"
            };
        }
        return r;
    },
    'MINA':function () {
        var r = new cBaseFunction( "MINA" );
        r.setArgumentsMin( 1 );
        r.setArgumentsMax( 255 );
        r.Calculate = function ( arg ) {
            var argI, min = new cNumber( Number.POSITIVE_INFINITY );
            for ( var i = 0; i < this.argumentsCurrent; i++ ) {
                argI = arg[i], argIVal = argI.getValue();
                if ( argI instanceof cRef || argI instanceof cRef3D ) {

                    if ( argIVal instanceof cError )
                        return this.value = argIVal;

                    var v = argIVal.tocNumber();

                    if ( v instanceof cNumber && v.getValue() < min.getValue() )
                        min = v;
                }
                else if ( argI instanceof cArea || argI instanceof cArea3D ) {
                    var argArr = argI.getValue();
                    for ( var j = 0; j < argArr.length; j++ ) {

                        if ( argArr[j] instanceof cError ) {
                            return this.value = argArr[j];
                        }

                        var v = argArr[j].tocNumber();

                        if ( v instanceof cNumber && v.getValue() < min.getValue() )
                            min = v;
                    }
                }
                else if ( argI instanceof cError )
                    return this.value = argI;
                else if ( argI instanceof cString ) {
                    var v = argI.tocNumber();
                    if ( v instanceof cNumber )
                        if ( v.getValue() < min.getValue() )
                            min = v;
                }
                else if ( argI instanceof cBool || argI instanceof cEmpty ) {
                    var v = argI.tocNumber();
                    if ( v.getValue() < min.getValue() )
                        min = v;
                }
                else if ( argI instanceof cArray ) {
                    argI.foreach( function ( elem ) {
                        if ( elem instanceof cError ) {
                            min = elem;
                            return true;
                        }

                        elem = elem.tocNumber();

                        if ( elem instanceof cNumber && elem.getValue() < min.getValue() ) {
                            min = elem;
                        }
                    } )
                    if ( min instanceof cError ) {
                        return this.value = min;
                    }
                }
                else {
                    if ( argI.getValue() < min.getValue() )
                        min = argI;
                }
            }
            return this.value = ( min.value === Number.POSITIVE_INFINITY ? new cNumber( 0 ) : min );
        };
        r.getInfo = function () {
            return {
                name:this.name,
                args:"(number1, number2, ...)"
            };
        }
        return r;
    },
    'MODE':function () {
        var r = new cBaseFunction( "MODE" );
        return r;
    },
    'NEGBINOMDIST':function () {
        var r = new cBaseFunction( "NEGBINOMDIST" );
        return r;
    },
    'NORMDIST':function () {
        var r = new cBaseFunction( "NORMDIST" );
        return r;
    },
    'NORMINV':function () {
        var r = new cBaseFunction( "NORMINV" );
        return r;
    },
    'NORMSDIST':function () {
        var r = new cBaseFunction( "NORMSDIST" );
        return r;
    },
    'NORMSINV':function () {
        var r = new cBaseFunction( "NORMSINV" );
        return r;
    },
    'PEARSON':function () {
        var r = new cBaseFunction( "PEARSON" );
        return r;
    },
    'PERCENTILE':function () {
        var r = new cBaseFunction( "PERCENTILE" );
        return r;
    },
    'PERCENTRANK':function () {
        var r = new cBaseFunction( "PERCENTRANK" );
        return r;
    },
    'PERMUT':function () {
        var r = new cBaseFunction( "PERMUT" );
        return r;
    },
    'POISSON':function () {
        var r = new cBaseFunction( "POISSON" );
        return r;
    },
    'PROB':function () {
        var r = new cBaseFunction( "PROB" );
        return r;
    },
    'QUARTILE':function () {
        var r = new cBaseFunction( "QUARTILE" );
        return r;
    },
    'RANK':function () {
        var r = new cBaseFunction( "RANK" );
        return r;
    },
    'RSQ':function () {
        var r = new cBaseFunction( "RSQ" );
        return r;
    },
    'SKEW':function () {
        var r = new cBaseFunction( "SKEW" );
        return r;
    },
    'SLOPE':function () {
        var r = new cBaseFunction( "SLOPE" );
        return r;
    },
    'SMALL':function () {
        var r = new cBaseFunction( "SMALL" );
        return r;
    },
    'STANDARDIZE':function () {
        var r = new cBaseFunction( "STANDARDIZE" );
        return r;
    },
    'STDEV':function () {
        var r = new cBaseFunction( "STDEV" );
        r.setArgumentsMin( 1 );
        r.setArgumentsMax( 255 );
        r.Calculate = function ( arg ) {
            var count = 0, sum = new cNumber( 0 ), member = [];
            for ( var i = 0; i < arg.length; i++ ) {
                var _arg = arg[i];
                if ( _arg instanceof cRef || _arg instanceof cRef3D ) {
                    var _argV = _arg.getValue();
                    if ( _argV instanceof cNumber ) {
                        member.push( _argV );
                        sum = _func[sum.type][_argV.type]( sum, _argV, "+" );
                        count++;
                    }
                }
                else if ( _arg instanceof cArea || _arg instanceof cArea3D ) {
                    var _argAreaValue = _arg.getValue();
                    for ( var j = 0; j < _argAreaValue.length; j++ ) {
                        var __arg = _argAreaValue[j];
                        if ( __arg instanceof cNumber ) {
                            member.push( __arg );
                            sum = _func[sum.type][__arg.type]( sum, __arg, "+" );
                            count++;
                        }
                    }
                }
                else if ( _arg instanceof cArray ) {
                    _arg.foreach( function ( elem ) {
                        var e = elem.tocNumber();
                        if ( e instanceof cNumber ) {
                            member.push( e );
                            sum = _func[sum.type][e.type]( sum, e, "+" );
                            count++;
                        }
                    } )
                }
                else {
                    _arg = _arg.tocNumber();
                    if ( _arg instanceof cNumber ) {
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
            return this.value = new cNumber( Math.sqrt( res / (count - 1) ) );
            STDEV( 123, 134, 143, 173, 112, 109 )
        };
        r.getInfo = function () {
            return {
                name:this.name,
                args:"( argument-list )"
            };
        }
        r.setFormat( r.formatType.noneFormat );
        return r;
    },
    'STDEVA':function () {
        var r = new cBaseFunction( "STDEVA" );
        return r;
    },
    'STDEVP':function () {
        var r = new cBaseFunction( "STDEVP" );
        return r;
    },
    'STDEVPA':function () {
        var r = new cBaseFunction( "STDEVPA" );
        return r;
    },
    'STEYX':function () {
        var r = new cBaseFunction( "STEYX" );
        return r;
    },
    'TDIST':function () {
        var r = new cBaseFunction( "TDIST" );
        return r;
    },
    'TINV':function () {
        var r = new cBaseFunction( "TINV" );
        return r;
    },
    'TREND':function () {
        var r = new cBaseFunction( "TREND" );
        return r;
    },
    'TRIMMEAN':function () {
        var r = new cBaseFunction( "TRIMMEAN" );
        return r;
    },
    'TTEST':function () {
        var r = new cBaseFunction( "TTEST" );
        return r;
    },
    'VAR':function () {
        var r = new cBaseFunction( "VAR" );
        return r;
    },
    'VARA':function () {
        var r = new cBaseFunction( "VARA" );
        return r;
    },
    'VARP':function () {
        var r = new cBaseFunction( "VARP" );
        return r;
    },
    'VARPA':function () {
        var r = new cBaseFunction( "VARPA" );
        return r;
    },
    'WEIBULL':function () {
        var r = new cBaseFunction( "WEIBULL" );
        return r;
    },
    'ZTEST':function () {
        var r = new cBaseFunction( "ZTEST" );
        return r;
    }
}