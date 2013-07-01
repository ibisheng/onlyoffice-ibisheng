/**
 * Created with JetBrains WebStorm.
 * User: Dmitry.Shahtanov
 * Date: 27.06.13
 * Time: 15:20
 * To change this template use File | Settings | File Templates.
 */
cFormulaFunction.Mathematic = {
    'groupName' : "Mathematic",
        'ABS' : function(){
        var r = new cBaseFunction("ABS");
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
        var r = new cBaseFunction("ACOS");
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
        var r = new cBaseFunction("ACOSH");
        return r;
    },
    'ASIN' :  function(){
        var r = new cBaseFunction("ASIN");
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
        var r = new cBaseFunction("ASINH");
        return r;
    },
    'ATAN' : function(){
        var r = new cBaseFunction("ATAN");
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
        var r = new cBaseFunction("ATAN2");
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
        var r = new cBaseFunction("ATANH");
        return r;
    },
    'CEILING' : function(){
        var r = new cBaseFunction("CEILING");
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
        var r = new cBaseFunction("COMBIN");
        return r;
    },
    'COS' : function (){
        var r = new cBaseFunction("COS");
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
        var r = new cBaseFunction("COSH");
        return r;
    },
    'DEGREES' : function(){
        var r = new cBaseFunction("DEGREES");
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
        var r = new cBaseFunction("ECMA_CEILING");
        return r;
    },
    'EVEN' : function(){
        var r = new cBaseFunction("EVEN");
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
        var r = new cBaseFunction("EXP");
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
        var r = new cBaseFunction("FACT");
        return r;
    },
    'FACTDOUBLE' : function(){
        var r = new cBaseFunction("FACTDOUBLE");
        return r;
    },
    'FLOOR' : function(){
        var r = new cBaseFunction("FLOOR");
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
        var r = new cBaseFunction("GCD");
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
        var r = new cBaseFunction("INT");
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
        var r = new cBaseFunction("ISO_CEILING");
        return r;
    },
    'LCM' : function(){
        var r = new cBaseFunction("LCM");
        return r;
    },
    'LN' : function(){
        var r = new cBaseFunction("LN");
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
        var r = new cBaseFunction("LOG");
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
        var r = new cBaseFunction("LOG10");
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
        var r = new cBaseFunction("MDETERM");
        return r;
    },
    'MINVERSE' : function(){
        var r = new cBaseFunction("MINVERSE");
        return r;
    },
    'MMULT' : function(){
        var r = new cBaseFunction("MMULT");
        return r;
    },
    'MOD' : function(){
        var r = new cBaseFunction("MOD");
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
        var r = new cBaseFunction("MROUND");
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
        var r = new cBaseFunction("MULTINOMIAL");
        return r;
    },
    'ODD' : function(){
        var r = new cBaseFunction("ODD");
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
        var r = new cBaseFunction("PI");
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
        var r = new cBaseFunction("POWER");
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
        var r = new cBaseFunction("PRODUCT");
        r.setArgumentsMin(1);
        r.setArgumentsMax(255);
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
        var r = new cBaseFunction("QUOTIENT");
        return r;
    },
    'RADIANS' : function(){
        var r = new cBaseFunction("RADIANS");
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
        var r = new cBaseFunction("RAND");
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
        var r = new cBaseFunction("RANDBETWEEN");
        return r;
    },
    'ROMAN' : function(){
        var r = new cBaseFunction("ROMAN");
        return r;
    },
    'ROUND' : function(){
        var r = new cBaseFunction("ROUND");
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
        var r = new cBaseFunction("ROUNDDOWN");
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
        var r = new cBaseFunction("ROUNDUP");
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
        var r = new cBaseFunction("SERIESSUM");
        return r;
    },
    'SIGN' : function(){
        var r = new cBaseFunction("SIGN");
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
        var r = new cBaseFunction("SIN");
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
        var r = new cBaseFunction("SINH");
        return r;
    },
    'SQRT' :  function(){
        var r = new cBaseFunction("SQRT");
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
        var r = new cBaseFunction("SQRTPI");
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
        var r = new cBaseFunction("SUBTOTAL");
        return r;
    },
    'SUM' : function(){
        var r = new cBaseFunction("SUM");
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
        var r = new cBaseFunction("SUMIF");
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
        var r = new cBaseFunction("SUMIFS");
        return r;
    },
    'SUMPRODUCT' : function(){
        var r = new cBaseFunction("SUMPRODUCT");
        /*r.setArgumentsMin(1);
         r.setArgumentsMax(255);
         r.Calculate = function(arg){
         var arg0 = new cNumber(0), resArr = [];
         for(var i = 0; i < arg.length; i++){

         if( arg[i] instanceof cArea3D )
         return this.value = new cError( bad_reference );

         if( arg[i] instanceof cArea ){

         function retCell(_cell){
         if(!_cell)
         return new cNumber(0);
         switch( _cell.getType() ){
         case CellValueType.Number:
         _cell.getValueWithoutFormat() == ""? return new cNumber(0) : return new cNumber( _cell.getValueWithoutFormat() );
         case CellValueType.Bool:
         return new cBool( _cell.getValueWithoutFormat() ).tocNumber();
         case CellValueType.Error:
         return new cError( _cell.getValueWithoutFormat() );
         case CellValueType.String:
         default:
         return new cNumber(0);
         }
         }

         var argIBBox = arg[i].getBBox0(),
         colCount = Math.abs(argIBBox.c2-argIBBox.c1)+1,
         rowCount = Math.abs(argIBBox.r2-argIBBox.r1)+1,
         range = arg[i].getRange();

         range._foreachIndex(function(i,j){

         })

         if( resArr.length == 0 ){
         for( var i = 0; i < rowCount; i++ ){
         resArr.push(new Array(colCount));
         }
         }
         else{
         if( resArr.length == rowCount ){
         if( resArr[0] == colCount ){

         }
         else
         return this.value = new cError( not_numeric );
         }
         else
         return this.value = new cError( not_numeric );
         }

         arg[i].foreach(function(oCurCell, i, j, r, c){

         if( resArr[i] !== undefined && resArr[i] !== null ){
         if( resArr[i][j] !== undefined && resArr[i][j] !== null ){

         }
         else{

         resArr[i][j] = retCell(oCurCell);
         }
         }
         else{
         resArr[i] = [];
         resArr[i][j] = !oCurCell ? new cNumber(0) :
         }

         })
         }
         else if( arg[i] instanceof cRef || arg[i] instanceof cRef3D ){

         }
         else if( arg[i] instanceof cArray ){

         }
         else{

         }

         if( arg[i] instanceof cError )
         return this.value = arg0;
         }
         return this.value = arg0;
         }
         r.getInfo = function(){
         return {
         name:this.name,
         args:"( argument-lists )"
         };
         }*/
        return r;
    },
    'SUMSQ' : function(){
        var r = new cBaseFunction("SUMSQ");
        return r;
    },
    'SUMX2MY2' : function(){
        var r = new cBaseFunction("SUMX2MY2");
        return r;
    },
    'SUMX2PY2' : function(){
        var r = new cBaseFunction("SUMX2PY2");
        return r;
    },
    'SUMXMY2' : function(){
        var r = new cBaseFunction("SUMXMY2");
        return r;
    },
    'TAN' : function(){
        var r = new cBaseFunction("TAN");
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
        var r = new cBaseFunction("TANH");
        return r;
    },
    'TRUNC' : function(){
        var r = new cBaseFunction("TRUNC");
        return r;
    }
}