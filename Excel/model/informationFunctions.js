/**
 * Created with JetBrains WebStorm.
 * User: Dmitry.Shahtanov
 * Date: 27.06.13
 * Time: 15:21
 * To change this template use File | Settings | File Templates.
 */
cFormulaFunction.Information = {
    'groupName' : "Information",
        "CELL" :function(){
        var r = new cBaseFunction("CELL");
        return r;
    },
    "ERROR.TYPE" :function(){
        var r = new cBaseFunction("ERROR.TYPE");
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
        var r = new cBaseFunction("INFO");
        return r;
    },
    "ISBLANK" :function(){
        var r = new cBaseFunction("ISBLANK");
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
        var r = new cBaseFunction("ISERR");
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
        var r = new cBaseFunction("ISERROR");
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
        var r = new cBaseFunction("ISEVEN");
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
        var r = new cBaseFunction("ISLOGICAL");
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
        var r = new cBaseFunction("ISNA");
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
        var r = new cBaseFunction("ISNONTEXT");
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
        var r = new cBaseFunction("ISNUMBER");
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
        var r = new cBaseFunction("ISODD");
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
        var r = new cBaseFunction("ISREF");
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
        var r = new cBaseFunction("ISTEXT");
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
        var r = new cBaseFunction("N");
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
        var r = new cBaseFunction("NA");
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
        var r = new cBaseFunction("TYPE");
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
}