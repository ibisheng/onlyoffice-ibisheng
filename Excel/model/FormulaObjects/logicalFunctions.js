"use strict";

/**
 * Created with JetBrains WebStorm.
 * User: Dmitry.Shahtanov
 * Date: 27.06.13
 * Time: 15:22
 * To change this template use File | Settings | File Templates.
 */
"use strict";
cFormulaFunction.Logical = {
    'groupName':"Logical",
    'AND':cAND,
    'FALSE':cFALSE,
    'IF':cIF,
    'IFERROR':cIFERROR,
    'NOT':cNOT,
    'OR':cOR,
    'TRUE':cTRUE
}

function cAND() {
    cBaseFunction.call( this, "AND" );
    this.setArgumentsMin( 1 );
    this.setArgumentsMax( 255 );
}
cAND.prototype = Object.create( cBaseFunction.prototype )
cAND.prototype.Calculate = function ( arg ) {
    var argResult = null;
    for ( var i = 0; i < arg.length; i++ ) {
        if ( arg[i] instanceof cArea || arg[i] instanceof cArea3D ) {
            var argArr = arg[i].getValue();
            for ( var j = 0; j < argArr.length; j++ ) {
                if ( argArr[j] instanceof cString || argArr[j] instanceof cEmpty ) continue;
                else if ( argArr[j] instanceof cError ) return this.value = argArr[j];
                else {
                    if ( argResult == null )
                        argResult = argArr[j].tocBool();
                    else
                        argResult = new cBool( argResult.value && argArr[j].tocBool().value );
                    if ( argResult.value == false ) return this.value = new cBool( false );
                }
            }
        }
        else {
            if ( arg[i] instanceof cString ) return this.value = new cError( cErrorType.wrong_value_type );
            else if ( arg[i] instanceof cError ) {
                return this.value = arg[i];
            }
            else if ( arg[i] instanceof cArray ) {
                var thas = this;
                arg[i].foreach( function ( elem ) {
                    if ( elem instanceof cError ) {
                        argResult = elem;
                        return true;
                    }
                    else if ( elem instanceof cString || elem instanceof cEmpty ) {
                        return;
                    }
                    else {
                        if ( argResult == null )
                            argResult = elem.tocBool();
                        else
                            argResult = new cBool( argResult.value && elem.tocBool().value );
                        if ( argResult.value == false ) {
                            return true;
                        }
                    }
                } )
            }
            else {
                if ( argResult == null )
                    argResult = arg[i].tocBool();
                else
                    argResult = new cBool( argResult.value && arg[i].tocBool().value );
                if ( argResult.value == false ) return this.value = new cBool( false );
            }
        }
    }
    if ( argResult == null )
        return this.value = new cError( cErrorType.wrong_value_type );
    return this.value = argResult;
}
cAND.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"(logical1, logical2, ...)"
    };
}

function cFALSE() {
    cBaseFunction.call( this, "FALSE" );
    this.setArgumentsMin( 0 );
    this.setArgumentsMax( 0 );
}
cFALSE.prototype = Object.create( cBaseFunction.prototype )
cFALSE.prototype.Calculate = function () {
    return this.value = new cBool( false );
}
cFALSE.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"()"
    };
}

function cIF() {
    cBaseFunction.call( this, "IF" );
    this.setArgumentsMin( 1 );
    this.setArgumentsMax( 3 );
}
cIF.prototype = Object.create( cBaseFunction.prototype )
cIF.prototype.Calculate = function ( arg ) {
    var arg0 = arg[0], arg1 = arg[1], arg2 = arg[2];

    if ( arg0 instanceof cArray )
        arg0 = arg0.getElement( 0 );
    if ( arg1 instanceof cArray )
        arg1 = arg1.getElement( 0 );
    if ( arg2 instanceof cArray )
        arg2 = arg2.getElement( 0 );

    if ( arg0 instanceof cError )
        return this.value = arg0;
    else {
        arg0 = arg0.tocBool();
        if ( arg0 instanceof cString )
            return this.value = new cError( cErrorType.wrong_value_type );
        else if ( arg0.value )
            return this.value = arg1 ?
                arg1 instanceof cEmpty ?
                    new cNumber( 0 ) :
                    arg1 :
                new cBool( true );

        else return this.value = arg2 ?
                arg2 instanceof cEmpty ?
                    new cNumber( 0 ) :
                    arg2 :
                new cBool( false );
    }
}
cIF.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"(logical_test, value_if_true, value_if_false)"
    };
}

function cIFERROR() {
    cBaseFunction.call( this, "IFERROR" );
    this.setArgumentsMin( 2 );
    this.setArgumentsMax( 2 );
}
cIFERROR.prototype = Object.create( cBaseFunction.prototype )
cIFERROR.prototype.Calculate = function ( arg ) {
    var arg0 = arg[0];
    if ( arg0 instanceof cArray ) {
        arg0 = arg0.getElement( 0 );
    }
    if ( arg0 instanceof cRef || arg0 instanceof cRef3D ) {
        arg0 = arg0.getValue();
    }
    if ( arg0 instanceof cArea || arg0 instanceof cArea3D ) {
        arg0 = arg0.cross( arguments[1].first );
    }

    if ( arg0 instanceof cError )
        return this.value = arg[1] instanceof cArray ? arg[1].getElement( 0 ) : arg[1];
    else return this.value = arg[0];
}
cIFERROR.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"(value, value_if_error)"
    };
}

function cNOT() {
    cBaseFunction.call( this, "NOT" );
    this.setArgumentsMin( 1 );
    this.setArgumentsMax( 1 );
}
cNOT.prototype = Object.create( cBaseFunction.prototype )
cNOT.prototype.Calculate = function ( arg ) {
    var arg0 = arg[0];
    if ( arg0 instanceof cArray )
        arg0 = arg0.getElement( 0 );

    if ( arg0 instanceof cArea || arg0 instanceof cArea3D ) {
        arg0 = arg0.cross( arguments[1].first );
    }

    if ( arg0 instanceof cString ) {
        var res = arg0.tocBool();
        if ( res instanceof cString )
            return  this.value = new cError( cErrorType.wrong_value_type );
        else
            return this.value = new cBool( !res.value );
    }
    else if ( arg0 instanceof cError )
        return  this.value = arg0;
    else
        return this.value = new cBool( !arg0.tocBool().value );
}
cNOT.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"(logical)"
    };
}

function cOR() {
    cBaseFunction.call( this, "OR" );
    this.setArgumentsMin( 1 );
    this.setArgumentsMax( 255 );
}
cOR.prototype = Object.create( cBaseFunction.prototype )
cOR.prototype.Calculate = function ( arg ) {
    var argResult = null;
    for ( var i = 0; i < arg.length; i++ ) {
        if ( arg[i] instanceof cArea || arg[i] instanceof cArea3D ) {
            var argArr = arg[i].getValue();
            for ( var j = 0; j < argArr.length; j++ ) {
                if ( argArr[j] instanceof cString || argArr[j] instanceof cEmpty ) continue;
                else if ( argArr[j] instanceof cError ) return this.value = argArr[j];
                else {
                    if ( argResult == null )
                        argResult = argArr[j].tocBool();
                    else
                        argResult = new cBool( argResult.value || argArr[j].tocBool().value );
                    if ( argResult.value === true ) return this.value = new cBool( true );
                }
            }
        }
        else {
            if ( arg[i] instanceof cString ) return this.value = new cError( cErrorType.wrong_value_type );
            else if ( arg[i] instanceof cError ) return this.value = arg[i];
            else if ( arg[i] instanceof cArray ) {
                var thas = this;
                arg[i].foreach( function ( elem ) {
                    if ( elem instanceof cError ) {
                        argResult = elem;
                        return true;
                    }
                    else if ( elem instanceof cString || elem instanceof cEmpty ) {
                        return;
                    }
                    else {
                        if ( argResult == null )
                            argResult = elem.tocBool();
                        else
                            argResult = new cBool( argResult.value || elem.tocBool().value );
                    }
                } )
            }
            else {
                if ( argResult == null )
                    argResult = arg[i].tocBool();
                else
                    argResult = new cBool( argResult.value || arg[i].tocBool().value );
                if ( argResult.value === true ) return this.value = new cBool( true );
            }
        }
    }
    if ( argResult == null )
        return this.value = new cError( cErrorType.wrong_value_type );
    return this.value = argResult;
}
cOR.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"(logical1, logical2, ...)"
    };
}

function cTRUE() {
    cBaseFunction.call( this, "TRUE" );
    this.setArgumentsMin( 0 );
    this.setArgumentsMax( 0 );
}
cTRUE.prototype = Object.create( cBaseFunction.prototype )
cTRUE.prototype.Calculate = function () {
    return this.value = new cBool( true );
}
cTRUE.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"()"
    };
}
