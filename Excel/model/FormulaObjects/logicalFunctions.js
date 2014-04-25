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
//    cBaseFunction.call( this, "AND" );
//    this.setArgumentsMin( 1 );
//    this.setArgumentsMax( 255 );

    this.name = "AND";
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
cAND.prototype = Object.create( cBaseFunction.prototype )
cAND.prototype.Calculate = function ( arg ) {
    var argResult = null;
    for ( var i = 0; i < arg.length; i++ ) {
        if ( arg[i] instanceof CArea || arg[i] instanceof CArea3D ) {
            var argArr = arg[i].getValue();
            for ( var j = 0; j < argArr.length; j++ ) {
                if ( argArr[j] instanceof CString || argArr[j] instanceof CEmpty ) continue;
                else if ( argArr[j] instanceof CError ) return this.value = argArr[j];
                else {
                    if ( argResult == null )
                        argResult = argArr[j].tocBool();
                    else
                        argResult = new CBool( argResult.value && argArr[j].tocBool().value );
                    if ( argResult.value == false ) return this.value = new CBool( false );
                }
            }
        }
        else {
            if ( arg[i] instanceof CString ) return this.value = new CError( cErrorType.wrong_value_type );
            else if ( arg[i] instanceof CError ) {
                return this.value = arg[i];
            }
            else if ( arg[i] instanceof CArray ) {
                var thas = this;
                arg[i].foreach( function ( elem ) {
                    if ( elem instanceof CError ) {
                        argResult = elem;
                        return true;
                    }
                    else if ( elem instanceof CString || elem instanceof CEmpty ) {
                        return;
                    }
                    else {
                        if ( argResult == null )
                            argResult = elem.tocBool();
                        else
                            argResult = new CBool( argResult.value && elem.tocBool().value );
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
                    argResult = new CBool( argResult.value && arg[i].tocBool().value );
                if ( argResult.value == false ) return this.value = new CBool( false );
            }
        }
    }
    if ( argResult == null )
        return this.value = new CError( cErrorType.wrong_value_type );
    return this.value = argResult;
}
cAND.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"(logical1, logical2, ...)"
    };
}

function cFALSE() {
//    cBaseFunction.call( this, "FALSE" );
//    this.setArgumentsMin( 0 );
//    this.setArgumentsMax( 0 );

    this.name = "FALSE";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 0;
    this.argumentsCurrent = 0;
    this.argumentsMax = 0;
    this.formatType = {
        def:-1, //подразумевается формат первой ячейки входящей в формулу.
        noneFormat:-2
    };
    this.numFormat = this.formatType.def;
}
cFALSE.prototype = Object.create( cBaseFunction.prototype )
cFALSE.prototype.Calculate = function () {
    return this.value = new CBool( false );
}
cFALSE.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"()"
    };
}

function cIF() {
//    cBaseFunction.call( this, "IF" );

    this.name = "IF";
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

//    this.setArgumentsMin( 1 );
//    this.setArgumentsMax( 3 );
}
cIF.prototype = Object.create( cBaseFunction.prototype )
cIF.prototype.Calculate = function ( arg ) {
    var arg0 = arg[0], arg1 = arg[1], arg2 = arg[2];

    if ( arg0 instanceof CArray )
        arg0 = arg0.getElement( 0 );
    if ( arg1 instanceof CArray )
        arg1 = arg1.getElement( 0 );
    if ( arg2 instanceof CArray )
        arg2 = arg2.getElement( 0 );

    if ( arg0 instanceof CError )
        return this.value = arg0;
    else {
        arg0 = arg0.tocBool();
        if ( arg0 instanceof CString )
            return this.value = new CError( cErrorType.wrong_value_type );
        else if ( arg0.value )
            return this.value = arg1 ?
                arg1 instanceof CEmpty ?
                    new CNumber( 0 ) :
                    arg1 :
                new CBool( true );

        else return this.value = arg2 ?
                arg2 instanceof CEmpty ?
                    new CNumber( 0 ) :
                    arg2 :
                new CBool( false );
    }
}
cIF.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"(logical_test, value_if_true, value_if_false)"
    };
}

function cIFERROR() {
//    cBaseFunction.call( this, "IFERROR" );
//    this.setArgumentsMin( 2 );
//    this.setArgumentsMax( 2 );

    this.name = "IFERROR";
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
cIFERROR.prototype = Object.create( cBaseFunction.prototype )
cIFERROR.prototype.Calculate = function ( arg ) {
    var arg0 = arg[0];
    if ( arg0 instanceof CArray ) {
        arg0 = arg0.getElement( 0 );
    }
    if ( arg0 instanceof CRef || arg0 instanceof CRef3D ) {
        arg0 = arg0.getValue();
    }
    if ( arg0 instanceof CArea || arg0 instanceof CArea3D ) {
        arg0 = arg0.cross( arguments[1].first );
    }

    if ( arg0 instanceof CError )
        return this.value = arg[1] instanceof CArray ? arg[1].getElement( 0 ) : arg[1];
    else return this.value = arg[0];
}
cIFERROR.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"(value, value_if_error)"
    };
}

function cNOT() {
//    cBaseFunction.call( this, "NOT" );
//    this.setArgumentsMin( 1 );
//    this.setArgumentsMax( 1 );

    this.name = "NOT";
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
cNOT.prototype = Object.create( cBaseFunction.prototype )
cNOT.prototype.Calculate = function ( arg ) {
    var arg0 = arg[0];
    if ( arg0 instanceof CArray )
        arg0 = arg0.getElement( 0 );

    if ( arg0 instanceof CArea || arg0 instanceof CArea3D ) {
        arg0 = arg0.cross( arguments[1].first );
    }

    if ( arg0 instanceof CString ) {
        var res = arg0.tocBool();
        if ( res instanceof CString )
            return  this.value = new CError( cErrorType.wrong_value_type );
        else
            return this.value = new CBool( !res.value );
    }
    else if ( arg0 instanceof CError )
        return  this.value = arg0;
    else
        return this.value = new CBool( !arg0.tocBool().value );
}
cNOT.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"(logical)"
    };
}

function cOR() {
//    cBaseFunction.call( this, "OR" );
//    this.setArgumentsMin( 1 );
//    this.setArgumentsMax( 255 );

    this.name = "OR";
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
cOR.prototype = Object.create( cBaseFunction.prototype )
cOR.prototype.Calculate = function ( arg ) {
    var argResult = null;
    for ( var i = 0; i < arg.length; i++ ) {
        if ( arg[i] instanceof CArea || arg[i] instanceof CArea3D ) {
            var argArr = arg[i].getValue();
            for ( var j = 0; j < argArr.length; j++ ) {
                if ( argArr[j] instanceof CString || argArr[j] instanceof CEmpty ) continue;
                else if ( argArr[j] instanceof CError ) return this.value = argArr[j];
                else {
                    if ( argResult == null )
                        argResult = argArr[j].tocBool();
                    else
                        argResult = new CBool( argResult.value || argArr[j].tocBool().value );
                    if ( argResult.value === true ) return this.value = new CBool( true );
                }
            }
        }
        else {
            if ( arg[i] instanceof CString ) return this.value = new CError( cErrorType.wrong_value_type );
            else if ( arg[i] instanceof CError ) return this.value = arg[i];
            else if ( arg[i] instanceof CArray ) {
                var thas = this;
                arg[i].foreach( function ( elem ) {
                    if ( elem instanceof CError ) {
                        argResult = elem;
                        return true;
                    }
                    else if ( elem instanceof CString || elem instanceof CEmpty ) {
                        return;
                    }
                    else {
                        if ( argResult == null )
                            argResult = elem.tocBool();
                        else
                            argResult = new CBool( argResult.value || elem.tocBool().value );
                    }
                } )
            }
            else {
                if ( argResult == null )
                    argResult = arg[i].tocBool();
                else
                    argResult = new CBool( argResult.value || arg[i].tocBool().value );
                if ( argResult.value === true ) return this.value = new CBool( true );
            }
        }
    }
    if ( argResult == null )
        return this.value = new CError( cErrorType.wrong_value_type );
    return this.value = argResult;
}
cOR.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"(logical1, logical2, ...)"
    };
}

function cTRUE() {
//    cBaseFunction.call( this, "TRUE" );
//    this.setArgumentsMin( 0 );
//    this.setArgumentsMax( 0 );

    this.name = "TRUE";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 0;
    this.argumentsCurrent = 0;
    this.argumentsMax = 0;
    this.formatType = {
        def:-1, //подразумевается формат первой ячейки входящей в формулу.
        noneFormat:-2
    };
    this.numFormat = this.formatType.def;

}
cTRUE.prototype = Object.create( cBaseFunction.prototype )
cTRUE.prototype.Calculate = function () {
    return this.value = new CBool( true );
}
cTRUE.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"()"
    };
}
