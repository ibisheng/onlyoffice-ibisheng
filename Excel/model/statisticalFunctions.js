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
        r.setArgumentsMin( 1 );
        r.setArgumentsMax( 255 );
        r.Calculate = function ( arg ) {
            var count = 0, sum = new cNumber( 0 ), arrX = [];
            for ( var i = 0; i < arg.length; i++ ) {
                var _arg = arg[i];
                if ( _arg instanceof cRef || _arg instanceof cRef3D ) {
                    var _argV = _arg.getValue();
                    if ( _argV instanceof cNumber ) {
                        arrX.push( _argV );
                        count++;
                    }
                }
                else if ( _arg instanceof cArea || _arg instanceof cArea3D ) {
                    var _argAreaValue = _arg.getValue();
                    for ( var j = 0; j < _argAreaValue.length; j++ ) {
                        var __arg = _argAreaValue[j];
                        if ( __arg instanceof cNumber ) {
                            arrX.push( __arg );
                            count++;
                        }
                    }
                }
                else if ( _arg instanceof cArray ) {
                    _arg.foreach( function ( elem ) {
                        var e = elem.tocNumber();
                        if ( e instanceof cNumber ) {
                            arrX.push( e );
                            count++;
                        }
                    } )
                }
                else {
                    if ( _arg instanceof cError )
                        continue;
                    arrX.push( _arg );
                    count++;
                }
            }

            for ( var i = 0; i < arrX.length; i++ ) {
                sum = _func[sum.type][arrX[i].type]( sum, arrX[i], "+" );
            }
            var a = 0
            for ( var i = 0; i < arrX.length; i++ ) {
                a += Math.abs( _func[sum.type][arrX[i].type]( sum, arrX[i], "-" ).getValue() );
            }

            return this.value = new cNumber( a / count );
        };
        r.getInfo = function () {
            return {
                name:this.name,
                args:"( argument-list )"
            };
        }
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
                    if ( _argV instanceof cString || _argV instanceof cEmpty || _argV instanceof cBool ) {
                        continue;
                    }
                    if ( _argV instanceof cNumber ) {
                        sum = _func[sum.type][_argV.type]( sum, _argV, "+" );
                        count++;
                    }
                }
                else if ( _arg instanceof cArea || _arg instanceof cArea3D ) {
                    var _argAreaValue = _arg.getValue();
                    for ( var j = 0; j < _argAreaValue.length; j++ ) {
                        if ( _argAreaValue[j] instanceof cString || _argAreaValue[j] instanceof cEmpty || _argAreaValue[j] instanceof cBool ) {
                            continue;
                        }
                        var __arg = _argAreaValue[j];
                        if ( __arg instanceof cNumber ) {
                            sum = _func[sum.type][__arg.type]( sum, __arg, "+" );
                            count++;
                        }
                    }
                }
                else if ( _arg instanceof cArray ) {
                    _arg.foreach( function ( elem ) {
                        if ( elem instanceof cString || elem instanceof cEmpty || elem instanceof cBool ) {
                            return false;
                        }
                        var e = elem.tocNumber();
                        if ( e instanceof cNumber ) {
                            sum = _func[sum.type][e.type]( sum, e, "+" );
                            count++;
                        }
                    } )
                }
                else {
                    _arg = _arg.tocNumber();
                    if ( _arg instanceof cError )
                        return this.value = _arg;
                    sum = _func[sum.type][_arg.type]( sum, _arg, "+" );
                    count++;
                }
            }
            return this.value = new cNumber( sum.getValue() / count );
        };
        r.getInfo = function () {
            return {
                name:this.name,
                args:"( argument-list )"
            };
        }
        return r;
    },
    'AVERAGEA':function () {
        var r = new cBaseFunction( "AVERAGEA" );
        r.setArgumentsMin( 1 );
        r.setArgumentsMax( 255 );
        r.Calculate = function ( arg ) {
            var count = 0, sum = new cNumber( 0 );
            for ( var i = 0; i < arg.length; i++ ) {
                var _arg = arg[i];
                if ( _arg instanceof cRef || _arg instanceof cRef3D ) {
                    var _argV = _arg.getValue();
                    if ( _argV instanceof cNumber || _argV instanceof  cBool ) {
                        sum = _func[sum.type][_argV.type]( sum, _argV, "+" );
                        count++;
                    }
                }
                else if ( _arg instanceof cArea || _arg instanceof cArea3D ) {
                    var _argAreaValue = _arg.getValue();
                    for ( var j = 0; j < _argAreaValue.length; j++ ) {
                        var __arg = _argAreaValue[j];
                        if ( __arg instanceof cNumber || __arg instanceof  cBool ) {
                            sum = _func[sum.type][__arg.type]( sum, __arg, "+" );
                            count++;
                        }
                    }
                }
                else if ( _arg instanceof cArray ) {
                    _arg.foreach( function ( elem ) {

                        if ( elem instanceof cString || elem instanceof cEmpty ) {
                            return false;
                        }

                        var e = elem.tocNumber();
                        if ( e instanceof cNumber ) {
                            sum = _func[sum.type][e.type]( sum, e, "+" );
                            count++;
                        }
                    } )
                }
                else {
                    _arg = _arg.tocNumber();
                    if ( _arg instanceof cError )
                        return this.value = _arg;
                    sum = _func[sum.type][_arg.type]( sum, _arg, "+" );
                    count++;
                }
            }
            return this.value = new cNumber( sum.getValue() / count );
        };
        r.getInfo = function () {
            return {
                name:this.name,
                args:"( argument-list )"
            };
        }
        return r;
    },
    'AVERAGEIF':function () {
        var r = new cBaseFunction( "AVERAGEIF" );
        r.setArgumentsMin( 2 );
        r.setArgumentsMax( 3 );
        r.Calculate = function ( arg ) {
            var arg0 = arg[0], arg1 = arg[1], arg2 = arg[2] ? arg[2] : arg[0], _sum = 0, _count = 0, valueForSearching, regexpSearch;
            if ( !(arg0 instanceof cRef || arg0 instanceof cRef3D || arg0 instanceof cArea) ) {
                return this.value = new cError( cErrorType.wrong_value_type );
            }

            if ( !(arg2 instanceof cRef || arg2 instanceof cRef3D || arg2 instanceof cArea) ) {
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

            function matching( x, y, oper, startCell, pos ) {
                var res = false;
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
                return res;
            }

            arg1 = arg1.toString();
            var operators = new RegExp( "^ *[<=> ]+ *" );
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
                        if ( matching( val[i], valueForSearching, oper ) ) {
                            var r = arg0.getRange(), ws = arg0.getWS(),
                                r1 = r.first.getRow0() + i, c1 = arg2.getRange().first.getCol0();
                            r = new cRef( ws.getRange3( r1, c1, r1, c1 ).getName(), ws );
                            if ( r.getValue() instanceof cNumber ) {
                                _sum += r.getValue().getValue();
                                _count++;
                            }
                        }
                    }
                }
                else {
                    val = arg0.getValue();
                    if ( matching( val, valueForSearching, oper ) ) {
                        var r = arg0.getRange(), ws = arg0.getWS(),
                            r1 = r.first.getRow0() + 0, c1 = arg2.getRange().first.getCol0();
                        r = new cRef( ws.getRange3( r1, c1, r1, c1 ).getName(), ws );
                        if ( r.getValue() instanceof cNumber ) {
                            _sum += r.getValue().getValue();
                            _count++;
                        }
                    }
                }
            }
            else {
                valueForSearching = arg1
                    .replace( /(~)?\*/g, function ( $0, $1 ) {
                        return $1 ? $0 : '[\\w\\W]*';
                    } )
                    .replace( /(~)?\?/g, function ( $0, $1 ) {
                        return $1 ? $0 : '[\\w\\W]{1,1}';
                    } )
                    .replace( /(~\*)/g, "\\*" ).replace( /(~\?)/g, "\\?" );
                regexpSearch = new RegExp( valueForSearching + "$", "i" );
                if ( arg0 instanceof cArea ) {
                    val = arg0.getValue();
                    for ( var i = 0; i < val.length; i++ ) {
                        if ( regexpSearch.test( val[i].value ) ) {
                            var r = arg0.getRange(), ws = arg0.getWS(),
                                r1 = r.first.getRow0() + i, c1 = arg2.getRange().first.getCol0();
                            r = new cRef( ws.getRange3( r1, c1, r1, c1 ).getName(), ws );
                            if ( r.getValue() instanceof cNumber ) {
                                _sum += r.getValue().getValue();
                                _count++;
                            }
                        }
                    }
                }
                else {
                    val = arg0.getValue();
                    if ( regexpSearch.test( val.value ) ) {
                        var r = arg0.getRange(), ws = arg0.getWS(),
                            r1 = r.first.getRow0() + 0, c1 = arg2.getRange().first.getCol0();
                        r = new cRef( ws.getRange3( r1, c1, r1, c1 ).getName(), ws );
                        if ( r.getValue() instanceof cNumber ) {
                            _sum += r.getValue().getValue();
                            _count++;
                        }
                    }
                }
            }

            return this.value = new cNumber( _sum / _count );
        }
        r.getInfo = function () {
            return {
                name:this.name,
                args:"( cell-range, selection-criteria [ , average-range ] )"
            };
        }
        return r;
    },
    'AVERAGEIFS':function () {
        var r = new cBaseFunction( "AVERAGEIFS" );
        return r;
    },
    'BETADIST':function () {/*Нет реализации в Google Docs*/
        var r = new cBaseFunction( "BETADIST" );
        return r;
    },
    'BETAINV':function () {/*Нет реализации в Google Docs*/
        var r = new cBaseFunction( "BETAINV" );
        return r;
    },
    'BINOMDIST':function () {
        var r = new cBaseFunction( "BINOMDIST" );
        r.setArgumentsMin( 4 );
        r.setArgumentsMax( 4 );
        r.Calculate = function ( arg ) {
            var arg0 = arg[0], arg1 = arg[1], arg2 = arg[2], arg3 = arg[3];

            function binomCoeff( n, k ) {
                return Math.fact( n ) / (Math.fact( k ) * Math.fact( n - k ));
            }

            function binomdist( x, n, p ) {
                x = parseInt( x );
                n = parseInt( n );
                return binomCoeff( n, x ) * Math.pow( p, x ) * Math.pow( 1 - p, n - x );
            }


            if ( arg0 instanceof cArea || arg0 instanceof cArea3D ) {
                arg0 = arg0.cross( arguments[1].first );
            }
            else if ( arg0 instanceof cArray ) {
                arg0 = arg0.getElement( 0 );
            }

            if ( arg1 instanceof cArea || arg1 instanceof cArea3D ) {
                arg1 = arg1.cross( arguments[1].first );
            }
            else if ( arg1 instanceof cArray ) {
                arg1 = arg1.getElement( 0 );
            }

            if ( arg2 instanceof cArea || arg2 instanceof cArea3D ) {
                arg2 = arg2.cross( arguments[1].first );
            }
            else if ( arg2 instanceof cArray ) {
                arg2 = arg2.getElement( 0 );
            }

            if ( arg3 instanceof cArea || arg3 instanceof cArea3D ) {
                arg3 = arg3.cross( arguments[1].first );
            }
            else if ( arg3 instanceof cArray ) {
                arg3 = arg3.getElement( 0 );
            }

            arg0 = arg0.tocNumber();
            arg1 = arg1.tocNumber();
            arg2 = arg2.tocNumber();
            arg3 = arg3.tocBool();

            if ( arg0 instanceof cError ) return this.value = arg0;
            if ( arg1 instanceof cError ) return this.value = arg1;
            if ( arg2 instanceof cError ) return this.value = arg2;
            if ( arg3 instanceof cError ) return this.value = arg3;


            if ( arg0.getValue() < 0 || arg0.getValue() > arg1.getValue() || arg2.getValue() < 0 || arg2.getValue() > 1 )
                return this.value = new cError( cErrorType.not_numeric );

            if ( arg3.toBool() ) {
                var x = parseInt( arg0.getValue() ), n = parseInt( arg1.getValue() ), p = arg2.getValue(), bm = 0;
                for ( var y = 0; y <= x; y++ ) {
                    bm += binomdist( y, n, p );
                }
                return this.value = new cNumber( bm );
            }
            else
                return this.value = new cNumber( binomdist( arg0.getValue(), arg1.getValue(), arg2.getValue() ) );
        }
        r.getInfo = function () {
            return {
                name:this.name,
                args:"( number-successes , number-trials , success-probability , cumulative-flag )"
            };
        }
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
        r.setArgumentsMin( 3 );
        r.setArgumentsMax( 3 );
        r.Calculate = function ( arg ) {
            function gaussinv( x ) {/*from openoffice source \sc\source\core\tool\interpr3.cxx*/
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
                                    * t + 1.0
                                );
                }
                else {
                    if ( q > 0 )
                        t = 1 - x;
                    else
                        t = x;

                    t = Math.sqrt( -Math.log( t ) );

                    if ( t <= 5.0 ) {
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
                                        * t + 1.0
                                    );
                    }
                    else {
                        t += -5.0;
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
                                        * t + 1.0
                                    );
                    }

                    if ( q < 0.0 ) z = -z;
                }

                return z;
            }

            var alpha = arg[0], stdev_sigma = arg[1], size = arg[2];
            if ( alpha instanceof cArea || alpha instanceof cArea3D ) {
                alpha = alpha.cross( arguments[1].first );
            }
            else if ( alpha instanceof cArray ) {
                alpha = alpha.getElement( 0 );
            }

            if ( stdev_sigma instanceof cArea || stdev_sigma instanceof cArea3D ) {
                stdev_sigma = stdev_sigma.cross( arguments[1].first );
            }
            else if ( stdev_sigma instanceof cArray ) {
                stdev_sigma = stdev_sigma.getElement( 0 );
            }

            if ( size instanceof cArea || size instanceof cArea3D ) {
                size = size.cross( arguments[1].first );
            }
            else if ( size instanceof cArray ) {
                size = size.getElement( 0 );
            }

            alpha = alpha.tocNumber();
            stdev_sigma = stdev_sigma.tocNumber();
            size = size.tocNumber();

            if ( alpha instanceof cError ) return this.value = alpha;
            if ( stdev_sigma instanceof cError ) return this.value = stdev_sigma;
            if ( size instanceof cError ) return this.value = size;

            if ( alpha.getValue() <= 0 || alpha.getValue() >= 1 || stdev_sigma.getValue <= 0 || size.getValue() < 1 )
                return this.value = new cError( cErrorType.not_numeric );

            return this.value = new cNumber( gaussinv( 1.0 - alpha.getValue() / 2.0 ) * stdev_sigma.getValue() / Math.sqrt( size.getValue() ) );

        }
        r.getInfo = function () {
            return {
                name:this.name,
                args:"( alpha , standard-dev , size )"
            };
        }
        return r;
    },
    'CORREL':function () {
        var r = new cBaseFunction( "CORREL" );
        r.setArgumentsMin( 2 );
        r.setArgumentsMax( 2 );
        r.Calculate = function ( arg ) {

            function correl( x, y ) {

                var s1 = 0, s2 = 0, s3 = 0, _x = 0, _y = 0, xLength = 0;
                for ( var i = 0; i < x.length; i++ ) {

                    if ( !( x[i] instanceof cNumber && y[i] instanceof cNumber ) ) {
                        continue;
                    }

                    _x += x[i].getValue();
                    _y += y[i].getValue();
                    xLength++;
                }

                _x /= xLength;
                _y /= xLength;

                for ( var i = 0; i < x.length; i++ ) {

                    if ( !( x[i] instanceof cNumber && y[i] instanceof cNumber ) ) {
                        continue;
                    }

                    s1 += (x[i].getValue() - _x) * (y[i].getValue() - _y);
                    s2 += (x[i].getValue() - _x) * (x[i].getValue() - _x);
                    s3 += (y[i].getValue() - _y) * (y[i].getValue() - _y);

                }

                if ( s2 == 0 || s3 == 0 )
                    return new cError( cErrorType.division_by_zero );
                else
                    return new cNumber( s1 / Math.sqrt( s2 * s3 ) );
            }

            var arg0 = arg[0], arg1 = arg[1], arr0 = [], arr1 = [];

            if ( arg0 instanceof cArea ) {
                arr0 = arg0.getValue();
            }
            else if ( arg0 instanceof cArray ) {
                arg0.foreach( function ( elem ) {
                    arr0.push( elem );
                } );
            }
            else
                return this.value = cError( cErrorType.wrong_value_type )

            if ( arg1 instanceof cArea ) {
                arr1 = arg1.getValue();
            }
            else if ( arg1 instanceof cArray ) {
                arg1.foreach( function ( elem ) {
                    arr1.push( elem );
                } );
            }
            else
                return this.value = cError( cErrorType.wrong_value_type )

            return this.value = correl( arr0, arr1 );

        }
        r.getInfo = function () {
            return {
                name:this.name,
                args:"( array-1 , array-2 )"
            };
        }
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
        r.setArgumentsMin( 1 );
        r.setArgumentsMax( 255 );
        r.Calculate = function ( arg ) {
            var count = 0;
            for ( var i = 0; i < arg.length; i++ ) {
                var _arg = arg[i];
                if ( _arg instanceof cRef || _arg instanceof cRef3D ) {
                    var _argV = _arg.getValue();
                    if ( _argV instanceof cNumber || _argV instanceof cBool || _argV instanceof cError ) {
                        count++;
                    }
                }
                else if ( _arg instanceof cArea || _arg instanceof cArea3D ) {
                    var _argAreaValue = _arg.getValue();
                    for ( var j = 0; j < _argAreaValue.length; j++ ) {
                        if ( _argAreaValue[j] instanceof cNumber || _argAreaValue[j] instanceof cBool || _argAreaValue[j] instanceof cError ) {
                            count++;
                        }
                    }
                }
                else if ( _arg instanceof cArray ) {
                    _arg.foreach( function ( elem ) {
                        if ( elem instanceof cNumber || elem instanceof cBool || elem instanceof cError ) {
                            count++;
                        }
                    } )
                }
                else if ( !( _arg instanceof cEmpty ) ) {
                    count++;
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
        r.setArgumentsMin( 2 );
        r.setArgumentsMax( 2 );
        r.Calculate = function ( arg ) {

            function correl( x, y ) {

                var s1 = 0, _x = 0, _y = 0, xLength = 0;
                for ( var i = 0; i < x.length; i++ ) {

                    if ( !( x[i] instanceof cNumber && y[i] instanceof cNumber ) ) {
                        continue;
                    }

                    _x += x[i].getValue();
                    _y += y[i].getValue();
                    xLength++;
                }

                if ( xLength == 0 )
                    return new cError( cErrorType.division_by_zero );

                _x /= xLength;
                _y /= xLength;

                for ( var i = 0; i < x.length; i++ ) {

                    if ( !( x[i] instanceof cNumber && y[i] instanceof cNumber ) ) {
                        continue;
                    }

                    s1 += (x[i].getValue() - _x) * (y[i].getValue() - _y);

                }
                return new cNumber( s1 / xLength );
            }

            var arg0 = arg[0], arg1 = arg[1], arr0 = [], arr1 = [];

            if ( arg0 instanceof cArea ) {
                arr0 = arg0.getValue();
            }
            else if ( arg0 instanceof cArray ) {
                arg0.foreach( function ( elem ) {
                    arr0.push( elem );
                } );
            }
            else
                return this.value = cError( cErrorType.wrong_value_type )

            if ( arg1 instanceof cArea ) {
                arr1 = arg1.getValue();
            }
            else if ( arg1 instanceof cArray ) {
                arg1.foreach( function ( elem ) {
                    arr1.push( elem );
                } );
            }
            else
                return this.value = cError( cErrorType.wrong_value_type )

            return this.value = correl( arr0, arr1 );

        }
        r.getInfo = function () {
            return {
                name:this.name,
                args:"( array-1 , array-2 )"
            };
        }
        return r;
    },
    'CRITBINOM':function () {
        var r = new cBaseFunction( "CRITBINOM" );
        r.setArgumentsMin( 3 );
        r.setArgumentsMax( 3 );
        r.Calculate = function ( arg ) {
            var n = arg[0], p = arg[1], alpha = arg[2];                    // alpha

            function critbinom( n, p, alpha ) {
                if ( n < 0 || alpha <= 0 || alpha >= 1 || p < 0 || p > 1 )
                    return new cError( cErrorType.not_numeric );
                else {
                    var q = 1 - p,
                        factor = Math.pow( q, n );
                    if ( factor == 0 ) {
                        factor = Math.pow( p, n );
                        if ( factor == 0.0 )
                            return new cError( cErrorType.wrong_value_type );
                        else {
                            var sum = 1 - factor, max = n, i = 0;

                            for ( i = 0; i < max && sum >= alpha; i++ ) {
                                factor *= (n - i) / (i + 1) * q / p;
                                sum -= factor;
                            }
                            return new cNumber( n - i );
                        }
                    }
                    else {
                        var sum = factor, max = n, i = 0;

                        for ( i = 0; i < max && sum < alpha; i++ ) {
                            factor *= (n - i) / (i + 1) * p / q;
                            sum += factor;
                        }
                        return new cNumber( i );
                    }
                }
            }

            if ( alpha instanceof cArea || alpha instanceof cArea3D ) {
                alpha = alpha.cross( arguments[1].first );
            }
            else if ( alpha instanceof cArray ) {
                alpha = alpha.getElement( 0 );
            }

            if ( n instanceof cArea || n instanceof cArea3D ) {
                n = n.cross( arguments[1].first );
            }
            else if ( n instanceof cArray ) {
                n = n.getElement( 0 );
            }

            if ( p instanceof cArea || p instanceof cArea3D ) {
                p = p.cross( arguments[1].first );
            }
            else if ( p instanceof cArray ) {
                p = p.getElement( 0 );
            }

            alpha = alpha.tocNumber();
            n = n.tocNumber();
            p = p.tocNumber();

            if ( alpha instanceof cError ) return this.value = alpha;
            if ( n instanceof cError ) return this.value = n;
            if ( p instanceof cError ) return this.value = p;

            return this.value = critbinom( n, p, alpha );

        }
        r.getInfo = function () {
            return {
                name:this.name,
                args:"( number-trials , success-probability , alpha )"
            };
        }
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
            var argI, argIVal, max = Number.NEGATIVE_INFINITY;
            for ( var i = 0; i < this.argumentsCurrent; i++ ) {
                argI = arg[i], argIVal = argI.getValue();
                if ( argI instanceof cRef || argI instanceof cRef3D ) {
                    if ( argIVal instanceof cError )
                        return this.value = argIVal;
                    if ( argIVal instanceof cNumber || argIVal instanceof cBool || argIVal instanceof cEmpty ) {
                        var v = argIVal.tocNumber();
                        if ( v.getValue() > max )
                            max = v.getValue();
                    }
                }
                else if ( argI instanceof cArea || argI instanceof cArea3D ) {
                    var argArr = argI.getValue();
                    for ( var j = 0; j < argArr.length; j++ ) {
                        if ( argArr[j] instanceof cNumber || argArr[j] instanceof cBool || argArr[j] instanceof cEmpty ) {
                            var v = argArr[j].tocNumber();
                            if ( v.getValue() > max )
                                max = v.getValue();
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
                        if ( v.getValue() > max )
                            max = v.getValue();
                }
                else if ( argI instanceof cBool || argI instanceof cEmpty ) {
                    var v = argI.tocNumber();
                    if ( v.getValue() > max )
                        max = v.getValue();
                }
                else if ( argI instanceof cArray ) {
                    argI.foreach( function ( elem ) {
                        if ( elem instanceof cNumber ) {
                            if ( elem.getValue() > max )
                                max = elem.getValue();
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
                    if ( argI.getValue() > max )
                        max = argI.getValue();
                }
            }
            return this.value = ( max.value === Number.NEGATIVE_INFINITY ? new cNumber( 0 ) : new cNumber( max ) );
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
            var argI, max = Number.NEGATIVE_INFINITY;
            for ( var i = 0; i < this.argumentsCurrent; i++ ) {
                argI = arg[i], argIVal = argI.getValue();
                if ( argI instanceof cRef || argI instanceof cRef3D ) {

                    if ( argIVal instanceof cError )
                        return this.value = argIVal;

                    var v = argIVal.tocNumber();

                    if ( v instanceof cNumber && v.getValue() > max )
                        max = v.getValue();
                }
                else if ( argI instanceof cArea || argI instanceof cArea3D ) {
                    var argArr = argI.getValue();
                    for ( var j = 0; j < argArr.length; j++ ) {

                        if ( argArr[j] instanceof cError )
                            return this.value = argArr[j];

                        var v = argArr[j].tocNumber();

                        if ( v instanceof cNumber && v.getValue() > max )
                            max = v.getValue();
                    }
                }
                else if ( argI instanceof cError )
                    return this.value = argI;
                else if ( argI instanceof cString ) {
                    var v = argI.tocNumber();
                    if ( v instanceof cNumber )
                        if ( v.getValue() > max )
                            max = v.getValue();
                }
                else if ( argI instanceof cBool || argI instanceof cEmpty ) {
                    var v = argI.tocNumber();
                    if ( v.getValue() > max )
                        max = v.getValue();
                }
                else if ( argI instanceof cArray ) {
                    argI.foreach( function ( elem ) {
                        if ( elem instanceof cError ) {
                            max = elem;
                            return true;
                        }
                        elem = elem.tocNumber();

                        if ( elem instanceof cNumber && elem.getValue() > max ) {
                            max = elem.getValue();
                        }
                    } )
                    if ( max instanceof cError ) {
                        return this.value = max;
                    }
                }
                else {
                    if ( argI.getValue() > max )
                        max = argI.getValue();
                }
            }
            return this.value = ( max.value === Number.NEGATIVE_INFINITY ? new cNumber( 0 ) : new cNumber( max ) )
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
            var argI, argIVal, min = Number.POSITIVE_INFINITY;
            for ( var i = 0; i < this.argumentsCurrent; i++ ) {
                argI = arg[i], argIVal = argI.getValue();
                if ( argI instanceof cRef || argI instanceof cRef3D ) {
                    if ( argIVal instanceof cError )
                        return this.value = argIVal;
                    if ( argIVal instanceof cNumber || argIVal instanceof cBool || argIVal instanceof cEmpty ) {
                        var v = argIVal.tocNumber();
                        if ( v.getValue() < min )
                            min = v.getValue();
                    }
                }
                else if ( argI instanceof cArea || argI instanceof cArea3D ) {
                    var argArr = argI.getValue();
                    for ( var j = 0; j < argArr.length; j++ ) {
                        if ( argArr[j] instanceof cNumber || argArr[j] instanceof cBool || argArr[j] instanceof cEmpty ) {
                            var v = argArr[j].tocNumber();
                            if ( v.getValue() < min )
                                min = v.getValue();
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
                        if ( v.getValue() < min )
                            min = v.getValue();
                }
                else if ( argI instanceof cBool || argI instanceof cEmpty ) {
                    var v = argI.tocNumber();
                    if ( v.getValue() < min )
                        min = v.getValue();
                }
                else if ( argI instanceof cArray ) {
                    argI.foreach( function ( elem ) {
                        if ( elem instanceof cNumber ) {
                            if ( elem.getValue() < min )
                                min = elem.getValue();
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
                    if ( argI.getValue() < min )
                        min = argI.getValue();
                }
            }
            return this.value = ( min.value === Number.POSITIVE_INFINITY ? new cNumber( 0 ) : new cNumber( min ) );
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
            var argI, min = Number.POSITIVE_INFINITY;
            for ( var i = 0; i < this.argumentsCurrent; i++ ) {
                argI = arg[i], argIVal = argI.getValue();
                if ( argI instanceof cRef || argI instanceof cRef3D ) {

                    if ( argIVal instanceof cError )
                        return this.value = argIVal;

                    var v = argIVal.tocNumber();

                    if ( v instanceof cNumber && v.getValue() < min )
                        min = v.getValue();
                }
                else if ( argI instanceof cArea || argI instanceof cArea3D ) {
                    var argArr = argI.getValue();
                    for ( var j = 0; j < argArr.length; j++ ) {

                        if ( argArr[j] instanceof cError ) {
                            return this.value = argArr[j];
                        }

                        var v = argArr[j].tocNumber();

                        if ( v instanceof cNumber && v.getValue() < min )
                            min = v.getValue();
                    }
                }
                else if ( argI instanceof cError )
                    return this.value = argI;
                else if ( argI instanceof cString ) {
                    var v = argI.tocNumber();
                    if ( v instanceof cNumber )
                        if ( v.getValue() < min )
                            min = v.getValue();
                }
                else if ( argI instanceof cBool || argI instanceof cEmpty ) {
                    var v = argI.tocNumber();
                    if ( v.getValue() < min )
                        min = v.getValue();
                }
                else if ( argI instanceof cArray ) {
                    argI.foreach( function ( elem ) {
                        if ( elem instanceof cError ) {
                            min = elem;
                            return true;
                        }

                        elem = elem.tocNumber();

                        if ( elem instanceof cNumber && elem.getValue() < min ) {
                            min = elem.getValue();
                        }
                    } )
                    if ( min instanceof cError ) {
                        return this.value = min;
                    }
                }
                else {
                    if ( argI.getValue() < min )
                        min = argI.getValue();
                }
            }
            return this.value = ( min.value === Number.POSITIVE_INFINITY ? new cNumber( 0 ) : new cNumber( min ) );
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