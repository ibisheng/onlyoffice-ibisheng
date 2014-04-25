"use strict";

/**
 * Created with JetBrains WebStorm.
 * User: Dmitry.Shahtanov
 * Date: 27.06.13
 * Time: 15:21
 * To change this template use File | Settings | File Templates.
 */
cFormulaFunction.LookupAndReference = {
    'groupName':"LookupAndReference",
    'ADDRESS':cADDRESS,
    'AREAS':cAREAS,
    'CHOOSE':cCHOOSE,
    'COLUMN':cCOLUMN,
    'COLUMNS':cCOLUMNS,
    'GETPIVOTDATA':cGETPIVOTDATA,
    'HLOOKUP':cHLOOKUP,
    'HYPERLINK':cHYPERLINK,
    'INDEX':cINDEX,
    'INDIRECT':cINDIRECT,
    'LOOKUP':cLOOKUP,
    'MATCH':cMATCH,
    'OFFSET':cOFFSET,
    'ROW':cROW,
    'ROWS':cROWS,
    'RTD':cRTD,
    'TRANSPOSE':cTRANSPOSE,
    'VLOOKUP':cVLOOKUP
}

function cADDRESS() {
//    cBaseFunction.call( this, "ADDRESS" );
//    this.setArgumentsMin( 2 );
//    this.setArgumentsMax( 5 );

    this.name = "ADDRESS";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 2;
    this.argumentsCurrent = 0;
    this.argumentsMax = 5;
    this.formatType = {
        def:-1, //подразумевается формат первой ячейки входящей в формулу.
        noneFormat:-2
    };
    this.numFormat = this.formatType.def;

}
cADDRESS.prototype = Object.create( cBaseFunction.prototype )
cADDRESS.prototype.Calculate = function ( arg ) {

    function _getRowTitle( row ) {
        return "" + (row + 1);
    }

    var rowNumber = arg[0], colNumber = arg[1],
        refType = arg[2] ? arg[2] : new CNumber( 1 ),
        A1RefType = arg[3] ? arg[3] : new CBool( true ),
        sheetName = arg[4] ? arg[4] : new CEmpty();

    if ( rowNumber instanceof CArea || rowNumber instanceof CArea3D ) {
        rowNumber = rowNumber.cross( arguments[1].first );
    }
    else if ( rowNumber instanceof CArray ) {
        rowNumber = rowNumber.getElementRowCol( 0, 0 );
    }

    if ( colNumber instanceof CArea || colNumber instanceof CArea3D ) {
        colNumber = colNumber.cross( arguments[1].first );
    }
    else if ( colNumber instanceof CArray ) {
        colNumber = colNumber.getElementRowCol( 0, 0 );
    }

    if ( refType instanceof CArea || refType instanceof CArea3D ) {
        refType = refType.cross( arguments[1].first );
    }
    else if ( refType instanceof CArray ) {
        refType = refType.getElementRowCol( 0, 0 );
    }

    if ( A1RefType instanceof CArea || A1RefType instanceof CArea3D ) {
        A1RefType = A1RefType.cross( arguments[1].first );
    }
    else if ( A1RefType instanceof CArray ) {
        A1RefType = A1RefType.getElementRowCol( 0, 0 );
    }

    if ( sheetName instanceof CArea || sheetName instanceof CArea3D ) {
        sheetName = sheetName.cross( arguments[1].first );
    }
    else if ( sheetName instanceof CArray ) {
        sheetName = sheetName.getElementRowCol( 0, 0 );
    }

    rowNumber = rowNumber.tocNumber();
    colNumber = colNumber.tocNumber();
    refType = refType.tocNumber();
    A1RefType = A1RefType.tocBool();

    if ( rowNumber instanceof CError ) return this.value = rowNumber;
    if ( colNumber instanceof CError ) return this.value = colNumber;
    if ( refType instanceof CError ) return this.value = refType;
    if ( A1RefType instanceof CError ) return this.value = A1RefType;
    if ( sheetName instanceof CError ) return this.value = sheetName;

    if ( refType.getValue() > 4 && refType.getValue() < 1 || rowNumber.getValue() < 1 || colNumber.getValue() < 1 ) {
        return this.value = new CError( cErrorType.not_numeric );
    }
    var strRef;
    switch ( refType.getValue() ) {
        case 1:
            strRef = "$" + g_oCellAddressUtils.colnumToColstrFromWsView( colNumber.getValue() - 1 ) + "$" + _getRowTitle( rowNumber.getValue() - 1 );
            break;
        case 2:
            strRef = g_oCellAddressUtils.colnumToColstrFromWsView( colNumber.getValue() - 1 ) + "$" + _getRowTitle( rowNumber.getValue() - 1 );
            break;
        case 3:
            strRef = "$" + g_oCellAddressUtils.colnumToColstrFromWsView( colNumber.getValue() - 1 ) + _getRowTitle( rowNumber.getValue() - 1 );
            break;
        case 4:
            strRef = g_oCellAddressUtils.colnumToColstrFromWsView( colNumber.getValue() - 1 ) + _getRowTitle( rowNumber.getValue() - 1 );
            break;
    }

    if ( sheetName instanceof CEmpty ) {
        return this.value = new CString( strRef );
    }
    else {
        if ( !rx_test_ws_name.test( sheetName.toString() ) ) {
            return this.value = new CString( "'" + sheetName.toString().replace( /'/g, "''" ) + "'" + "!" + strRef );
        }
        else {
            return this.value = new CString( sheetName.toString() + "!" + strRef );
        }
    }

}
cADDRESS.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( row-number , col-number [ , [ ref-type ] [ , [ A1-ref-style-flag ] [ , sheet-name ] ] ] )"
    };
}

function cAREAS() {
    cBaseFunction.call( this, "AREAS" );
}
cAREAS.prototype = Object.create( cBaseFunction.prototype )

function cCHOOSE() {
//    cBaseFunction.call( this, "CHOOSE" );
//    this.setArgumentsMin( 2 );
//    this.setArgumentsMax( 30 );

    this.name = "CHOOSE";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 2;
    this.argumentsCurrent = 0;
    this.argumentsMax = 30;
    this.formatType = {
        def:-1, //подразумевается формат первой ячейки входящей в формулу.
        noneFormat:-2
    };
    this.numFormat = this.formatType.def;

}
cCHOOSE.prototype = Object.create( cBaseFunction.prototype )
cCHOOSE.prototype.Calculate = function ( arg ) {
    var arg0 = arg[0];

    if ( arg0 instanceof CArea || arg0 instanceof CArea3D ) {
        arg0 = arg0.cross( arguments[1].first );
    }
    arg0 = arg0.tocNumber();

    if ( arg0 instanceof CError ) {
        return this.value = arg0;
    }

    if ( arg0 instanceof CNumber ) {
        if ( arg0.getValue() < 1 || arg0.getValue() > this.getArguments() ) {
            return this.value = new CError( cErrorType.wrong_value_type );
        }

        return this.value = arg[arg0.getValue()];
    }

    return this.value = new CError( cErrorType.wrong_value_type );
}
cCHOOSE.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( index , argument-list )"
    };
}

function cCOLUMN() {
//    cBaseFunction.call( this, "COLUMN" );
//    this.setArgumentsMin( 0 );
//    this.setArgumentsMax( 1 );

    this.name = "COLUMN";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 0;
    this.argumentsCurrent = 0;
    this.argumentsMax = 1;
    this.formatType = {
        def:-1, //подразумевается формат первой ячейки входящей в формулу.
        noneFormat:-2
    };
    this.numFormat = this.formatType.def;

}
cCOLUMN.prototype = Object.create( cBaseFunction.prototype )
cCOLUMN.prototype.Calculate = function ( arg ) {
    var arg0;
    if ( this.argumentsCurrent == 0 ) {
        arg0 = arguments[1];
        return this.value = new CNumber( arg0.getFirst().getCol() );
    }
    arg0 = arg[0];
    if ( arg0 instanceof CRef || arg0 instanceof CRef3D || arg0 instanceof CArea ) {
        var range = arg0.getRange();
        if ( range )
            return this.value = new CNumber( range.getFirst().getCol() );
        else
            return this.value = new CError( cErrorType.bad_reference );
    }
    else if ( arg0 instanceof CArea3D ) {
        var r = arg0.getRange();
        if ( r && r[0] && r[0].getFirst() ) {
            return this.value = new CNumber( r[0].getFirst().getCol() );
        }
        else {
            return this.value = new CError( cErrorType.bad_reference );
        }
    }
    else
        return this.value = new CError( cErrorType.bad_reference );
}
cCOLUMN.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( [ reference ] )"
    };
}

function cCOLUMNS() {
//    cBaseFunction.call( this, "COLUMNS" );
//    this.setArgumentsMin( 1 );
//    this.setArgumentsMax( 1 );

    this.name = "COLUMNS";
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
cCOLUMNS.prototype = Object.create( cBaseFunction.prototype )
cCOLUMNS.prototype.Calculate = function ( arg ) {
    var arg0 = arg[0];
    if ( arg0 instanceof CArray ) {
        return this.value = new CNumber( arg0.getCountElementInRow() );
    }
    else if ( arg0 instanceof CArea || arg0 instanceof CRef || arg0 instanceof CRef3D ) {
        var range = arg0.getRange();
        return this.value = new CNumber( Math.abs( range.getBBox().c1 - range.getBBox().c2 ) + 1 );
    }
    else if ( arg0 instanceof CArea3D ) {
        var range = arg0.getRange();
        if ( range.length > 1 )
            return this.value = new CError( cErrorType.wrong_value_type );

        return this.value = new CNumber( Math.abs( range[0].getBBox().c1 - range[0].getBBox().c2 ) + 1 );
    }
    else
        return this.value = new CError( cErrorType.wrong_value_type );
}
cCOLUMNS.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( array )"
    };
}

function cGETPIVOTDATA() {
    cBaseFunction.call( this, "GETPIVOTDATA" );
}
cGETPIVOTDATA.prototype = Object.create( cBaseFunction.prototype )

var g_oHLOOKUPCache = new VHLOOKUPCache(true);

function cHLOOKUP() {
//    cBaseFunction.call( this, "HLOOKUP" );
//    this.setArgumentsMin( 3 );
//    this.setArgumentsMax( 4 );

    this.name = "HLOOKUP";
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
cHLOOKUP.prototype = Object.create( cBaseFunction.prototype )
cHLOOKUP.prototype.Calculate = function ( arg ) {
    var arg0 = arg[0], arg1 = arg[1], arg2 = arg[2], arg3 = this.argumentsCurrent == 4 ? arg[3].tocBool() : new CBool( true );
    var numberRow = arg2.getValue() - 1, valueForSearching = arg0.getValue(), resC = -1, min, regexp;

    if ( isNaN( numberRow ) )
        return this.value = new CError( cErrorType.bad_reference );

    if ( numberRow < 0 )
        return this.value = new CError( cErrorType.wrong_value_type );

    if ( arg0 instanceof CString ) {
        valueForSearching = arg0.getValue();
        regexp = searchRegExp( valueForSearching );
    }
    else if ( arg0 instanceof CError )
        return this.value = arg0;
    else {
        valueForSearching = arg0.getValue();
    }

    var found = false, bb;

    if ( arg1 instanceof CRef || arg1 instanceof CRef3D || arg1 instanceof CArea ) {
        var range = arg1.getRange(), ws = arg1.getWS();
        bb = range.getBBox0();
        if ( numberRow > bb.r2 - bb.r1 )
            return this.value = new CError( cErrorType.bad_reference );
        var oSearchRange = ws.getRange3(bb.r1, bb.c1, bb.r1, bb.c2);
        var oCache = g_oHLOOKUPCache.get(oSearchRange, valueForSearching, arg0 instanceof CString, arg3.value);
        if(oCache)
        {
            resC = oCache.index;
            min = oCache.min;
        }
//        range._foreachColNoEmpty( /*func for col*/ null, /*func for cell in col*/ f );
    }
    else if ( arg1 instanceof CArea3D ) {
        var range = arg1.getRange()[0], ws = arg1.getWS()
        bb = range.getBBox0();
        if ( numberRow > bb.r2 - bb.r1 )
            return this.value = new CError( cErrorType.bad_reference );

        var oSearchRange = ws.getRange3(bb.r1, bb.c1, bb.r1, bb.c2);
        var oCache = g_oHLOOKUPCache.get(oSearchRange, valueForSearching, arg0 instanceof CString, arg3.value);
        if(oCache)
        {
            resC = oCache.index;
            min = oCache.min;
        }

//        range._foreachColNoEmpty( /*func for col*/ null, /*func for cell in col*/ f );
    }
    else if ( arg1 instanceof CArray ) {
        arg1.foreach( function ( elem, r, c ) {
            if ( c == 0 )
                min = elem.getValue();

            if ( arg3.value == true ) {
                if ( valueForSearching == elem.getValue() ) {
                    resC = c;
                    found = true;
                }
                else if ( valueForSearching > elem.getValue() && !found ) {
                    resC = c;
                }
            }
            else {
                if ( arg0 instanceof CString ) {
                    if ( regexp.test( elem.getValue() ) )
                        resC = c;
                }
                else if ( valueForSearching == elem.getValue() ) {
                    resC = c;
                }
            }

            min = Math.min( min, elem.getValue() );
        } )

        if ( min > valueForSearching ) {
            return this.value = new CError( cErrorType.not_available );
        }

        if ( resC == -1 ) {
            return this.value = new CError( cErrorType.not_available );
        }

        if ( numberRow > arg1.getRowCount() - 1 ) {
            return this.value = new CError( cErrorType.bad_reference );
        }

        return this.value = arg1.getElementRowCol( numberRow, resC );

    }

    if ( min > valueForSearching ) {
        return this.value = new CError( cErrorType.not_available );
    }

    if ( resC == -1 ) {
        return this.value = new CError( cErrorType.not_available );
    }

    var c = new CellAddress( bb.r1 + numberRow, resC, 0 );

    var v = arg1.getWS()._getCellNoEmpty( c.getRow0(), c.getCol0() )
    if ( v )
        v = v.getValueWithoutFormat();
    else
        v = "";

    return this.value = checkTypeCell( v );
}
cHLOOKUP.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( lookup-value  ,  table-array  ,  row-index-num  [  ,  [  range-lookup-flag  ] ] )"
    };
}

function cHYPERLINK() {
    cBaseFunction.call( this, "HYPERLINK" );
}
cHYPERLINK.prototype = Object.create( cBaseFunction.prototype )

function cINDEX() {
//    cBaseFunction.call( this, "INDEX" );

    this.name = "INDEX";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 2;
    this.argumentsCurrent = 0;
    this.argumentsMax = 4;
    this.formatType = {
        def:-1, //подразумевается формат первой ячейки входящей в формулу.
        noneFormat:-2
    };
    this.numFormat = this.formatType.def;

}
cINDEX.prototype = Object.create( cBaseFunction.prototype )
cINDEX.prototype.Calculate = function ( arg ) {
    var arg0 = arg[0],
        arg1 = arg[1] && !(arg[1] instanceof CEmpty) ? arg[1] : new CNumber(1),
        arg2 = arg[2] && !(arg[2] instanceof CEmpty) ? arg[2] : new CNumber(1),
        arg3 = arg[3] && !(arg[3] instanceof CEmpty) ? arg[3] : new CNumber(1),
        isArrayForm = false, res;

    if( arg0 instanceof CArea3D ){
        return this.value = new CError( cErrorType.not_available );
    }
    else if( arg0 instanceof CError ){
        return this.value = arg0;
    }

    arg1 = arg1.tocNumber();
    arg2 = arg2.tocNumber();
    arg3 = arg3.tocNumber();

    if( arg1 instanceof CError || arg2 instanceof CError || arg3 instanceof CError ){
        return this.value = new CError( cErrorType.wrong_value_type );
    }

    if( arg1.getValue() < 0 || arg2.getValue() < 0 ){
        return this.value = new CError( cErrorType.wrong_value_type );
    }

    if( arg0 instanceof CArray ){
        arg0 = arg0.getMatrix();
    }
    else if( arg0 instanceof CArea ){
        arg0 = arg0.getMatrix();
    }
    else{
        arg0 = [[arg0.tryConvert()]]
    }

    res = arg0[arg1.getValue()-1];
    if( res )
        res = res[arg2.getValue()-1];

    return this.value = res ? res : new CError( cErrorType.bad_reference );

}
cINDEX.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( array , [ row-number ] [ , [ column-number ] ] ) "+this.name+"( reference , [ row-number ] [ , [ column-number ] [ , [ area-number ] ] ] )"
    };
}

function cINDIRECT() {
//    cBaseFunction.call( this, "INDIRECT" );
//    this.setArgumentsMin( 1 );
//    this.setArgumentsMax( 2 );

    this.name = "INDIRECT";
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
cINDIRECT.prototype = Object.create( cBaseFunction.prototype )
cINDIRECT.prototype.Calculate = function ( arg ) {
    var arg0 = arg[0].tocString(), arg1 = arg[1] ? arg[1] : new CBool( true ), r = arguments[1], wb = r.worksheet.workbook, o = { Formula:"", pCurrPos:0 }, ref, found_operand;

    function parseReference() {
        if ( (ref = parserHelp.is3DRef.call( o, o.Formula, o.pCurrPos ))[0] ) {
            var _wsFrom = ref[1],
                _wsTo = ( (ref[2] !== null) && (ref[2] !== undefined) ) ? ref[2] : _wsFrom;
            if ( !(wb.getWorksheetByName( _wsFrom ) && wb.getWorksheetByName( _wsTo )) ) {
                return this.value = new CError( cErrorType.bad_reference );
            }
            if ( parserHelp.isArea.call( o, o.Formula, o.pCurrPos ) ) {
                found_operand = new CArea3D( o.operand_str.toUpperCase(), _wsFrom, _wsTo, wb );
                if ( o.operand_str.indexOf( "$" ) > -1 )
                    found_operand.isAbsolute = true;
            }
            else if ( parserHelp.isRef.call( o, o.Formula, o.pCurrPos ) ) {
                if ( _wsTo != _wsFrom ) {
                    found_operand = new CArea3D( o.operand_str.toUpperCase(), _wsFrom, _wsTo, wb );
                }
                else {
                    found_operand = new CRef3D( o.operand_str.toUpperCase(), _wsFrom, wb );
                }
                if ( o.operand_str.indexOf( "$" ) > -1 )
                    found_operand.isAbsolute = true;
            }
        }
        else if ( parserHelp.isName.call( o, o.Formula, o.pCurrPos, wb )[0] ) {
            found_operand = new CName( o.operand_str, wb );
        }
        else if ( parserHelp.isArea.call( o, o.Formula, o.pCurrPos ) ) {
            found_operand = new CArea( o.operand_str.toUpperCase(), r.worksheet );
            if ( o.operand_str.indexOf( "$" ) > -1 )
                found_operand.isAbsolute = true;
        }
        else if ( parserHelp.isRef.call( o, o.Formula, o.pCurrPos, true ) ) {
            found_operand = new CRef( o.operand_str.toUpperCase(), r.worksheet );
            if ( o.operand_str.indexOf( "$" ) > -1 )
                found_operand.isAbsolute = true;
        }
    }

    if ( arg0 instanceof CArray ) {
        var ret = new CArray();
        arg0.foreach( function ( elem, r, c ) {
            o = { Formula:elem.toString(), pCurrPos:0 };
            parseReference();
            if ( !ret.array[r] )
                ret.addRow();
            ret.addElement( found_operand )
        } )
        return this.value = ret;
    }
    else {
        o.Formula = arg0.toString();
        parseReference();
    }

    if ( found_operand ) {
        if ( found_operand instanceof CName )
            found_operand = found_operand.toRef();

        var cellName = r.getCells()[0].getName(), wsId = r.worksheet.getId();

        if ( (found_operand instanceof CRef || found_operand instanceof CRef3D || found_operand instanceof CArea) && found_operand.isValid() ) {
            var nFrom = wb.dependencyFormulas.addNode( wsId, cellName ),
                nTo = wb.dependencyFormulas.addNode( found_operand.getWsId(), found_operand._cells );

            found_operand.setNode( nTo );

            wb.dependencyFormulas.addEdge2( nFrom, nTo );
        }
        else if ( found_operand instanceof CArea3D && found_operand.isValid() ) {
            var wsR = found_operand.wsRange();
            for ( var j = 0; j < wsR.length; j++ )
                wb.dependencyFormulas.addEdge( wsId, cellName.replace( /\$/g, "" ), wsR[j].Id, found_operand._cells.replace( /\$/g, "" ) );
        }

        return this.value = found_operand;
    }

    return this.value = new CError( cErrorType.bad_reference );

}
cINDIRECT.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( ref-text [ , [ A1-ref-style-flag ] ] )"
    };
}

function cLOOKUP() {
//    cBaseFunction.call( this, "LOOKUP" );
//    this.setArgumentsMin( 2 );
//    this.setArgumentsMax( 3 );

    this.name = "LOOKUP";
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
cLOOKUP.prototype = Object.create( cBaseFunction.prototype )
cLOOKUP.prototype.Calculate = function ( arg ) {
    var arg0 = arg[0], arg1 = arg[1], arg2 = this.argumentsCurrent == 2 ? arg1 : arg[2],
        resC = -1, resR = -1;

    if ( arg0 instanceof CError ) {
        return this.value = arg0;
    }
    if ( arg0 instanceof CRef ) {
        arg0 = arg0.tryConvert();
    }

    function arrFinder( arr ) {
        if ( arr.getRowCount() > arr.getCountElementInRow() ) {
            //ищем в первом столбце
            resC = arr.getCountElementInRow() > 1 ? 1 : 0;
            var arrCol = arr.getCol( 0 );
            resR = _func.binarySearch( arg0, arrCol );
        }
        else {
            //ищем в первой строке
            resR = arr.getRowCount() > 1 ? 1 : 0;
            var arrRow = arr.getRow( 0 );
            resC = _func.binarySearch( arg0, arrRow );
        }
    }

    if ( !( arg1 instanceof CArea || arg1 instanceof CArea3D || arg1 instanceof CArray || arg2 instanceof CArea || arg2 instanceof CArea3D || arg2 instanceof CArray) ) {
        return this.value = new CError( cErrorType.not_available );
    }

    if ( arg1 instanceof CArray && arg2 instanceof CArray ) {
        if ( arg1.getRowCount() != arg2.getRowCount() && arg1.getCountElementInRow() != arg2.getCountElementInRow() ) {
            return this.value = new CError( cErrorType.not_available );
        }

        arrFinder( arg1 );

        if ( resR <= -1 && resC <= -1 || resR <= -2 || resC <= -2 ) {
            return this.value = new CError( cErrorType.not_available );
        }

        return this.value = arg2.getElementRowCol( resR, resC );

    }
    else if ( arg1 instanceof CArray || arg2 instanceof CArray ) {

        var _arg1, _arg2;

        _arg1 = arg1 instanceof CArray ? arg1 : arg2;

        _arg2 = arg2 instanceof CArray ? arg1 : arg2;

        var BBox = _arg2.getBBox();

        if ( _arg1.getRowCount() != (BBox.r2 - BBox.r1) && _arg1.getCountElementInRow() != (BBox.c2 - BBox.c1) ) {
            return this.value = new CError( cErrorType.not_available );
        }

        arrFinder( _arg1 );

        if ( resR <= -1 && resC <= -1 || resR <= -2 || resC <= -2 ) {
            return this.value = new CError( cErrorType.not_available );
        }

        var c = new CellAddress( BBox.r1 + resR, BBox.c1 + resC )

        return this.value = checkTypeCell( _arg2.getWS()._getCellNoEmpty( c.getRow0(), c.getCol0() ).getValueWithoutFormat() );

    }
    else {
        var arg1Range = arg1.getRange(), arg2Range = arg2.getRange();

        if ( arg1 instanceof CArea3D && arg1Range.length > 1 || arg2 instanceof CArea3D && arg2Range.length > 1 )
            return this.value = new CError( cErrorType.not_available );

        if ( arg1 instanceof CArea3D ) {
            arg1Range = arg1.getMatrix()[0];
//                    arg1Range = arg1Range[0];
        }
        else if ( arg1 instanceof CArea ) {
            arg1Range = arg1.getMatrix();
        }


        if ( arg2 instanceof CArea3D ) {
            arg2Range = arg2.getMatrix()[0];
//                    arg2Range = arg2Range[0];
        }
        else if ( arg2 instanceof CArea ) {
            arg2Range = arg2.getMatrix();
        }

        var index = _func.binarySearch( arg0, function () {
            var a = []
            for ( var i = 0; i < arg1Range.length; i++ ) {
                a.push( arg1Range[i][0] )
            }
            return a;
        }() )


        if ( index < 0 ) return this.value = new CError( cErrorType.not_available );
        if ( this.argumentsCurrent == 2 ) {
            if ( arg1Range[0].length >= 2 ) {
                var b = arg1.getBBox();
                return this.value = new CRef( arg1.ws.getCell3( (b.r1 - 1) + index, (b.c1 - 1) + 1 ).getName(), arg1.ws );
            }
            else
                return this.value = new CRef( arg1.ws.getCell3( (b.r1 - 1) + 0, (b.c1 - 1) + index ).getName(), arg1.ws );
        }
        else {
            var b = arg2.getBBox();
            if ( arg2Range.length == 1 ) {
                return this.value = new CRef( arg1.ws.getCell3( (b.r1 - 1) + 0, (b.c1 - 1) + index ).getName(), arg1.ws );
            }
            else
                return this.value = new CRef( arg1.ws.getCell3( (b.r1 - 1) + index, (b.c1 - 1) + 0 ).getName(), arg1.ws );
        }

        return this.value = arg2.getValue()[index];
    }

}
cLOOKUP.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"(  lookup-value  ,  lookup-vector  ,  result-vector  )"
    };
}

function cMATCH() {

//    cBaseFunction.call( this, "MATCH" );

    this.name = "MATCH";
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
cMATCH.prototype = Object.create( cBaseFunction.prototype )
cMATCH.prototype.Calculate = function ( arg ) {
    var arg0 = arg[0], arg1 = arg[1], arg2 = arg[2] ? arg[2] : new CNumber(1);

    function findMatch(a0,a1,a2){
        var a1RowCount = a1.length, a1ColumnCount = a1[0].length,
            a0Value = a0.getValue(), a2Value = a2.getValue(),
            arr = [], res = new CError( cErrorType.not_available ),
            index = -1;

        if( a1RowCount > 1 && a1ColumnCount > 1 ){
            return new CError( cErrorType.not_available );
        }
        else if( a1RowCount == 1 && a1ColumnCount > 1 ){
            for(var i = 0; i < a1ColumnCount; i++){
                arr[i] = a1[0][i].getValue();
            }
        }
        else if( a1RowCount > 1 && a1ColumnCount == 1 ){
            for(var i = 0; i < a1RowCount; i++){
                arr[i] = a1[i][0].getValue();
            }
        }
        else {
            arr[0]=a1[0][0];
        }

        if( !(a2Value == 1 || a2Value == 0 || a2Value == -1) ){
            return new CError( cErrorType.not_numeric );
        }

        if( a2Value == -1 ){
            for(var i = 0; i<arr.length; i++){
                if( arr[i] >= a0Value ){
                    index = i;
                }
                else
                    break;
            }
        }
        else if( a2Value == 0 ){
            if( a0 instanceof CString ){
                for(var i = 0; i<arr.length; i++){
                    if( searchRegExp2(arr[i].toString(),a0Value) ){
                        index = i;
                    }
                }
            }
            else{
                for(var i = 0; i<arr.length; i++){
                    if( arr[i] == a0Value ){
                        index = i;
                    }
                }
            }
        }
        else if( a2Value == 1 ){
            for(var i = 0; i<arr.length; i++){
                if( arr[i] <= a0Value ){
                    index = i;
                }
                else
                    break;
            }
        }

        if( index > -1 )
            res = new CNumber(index+1);

        return res;

    }

    if( arg0 instanceof CArea3D || arg0 instanceof CArray || arg0 instanceof CArea ){
        return this.value = new CError( cErrorType.not_available );
    }
    else if( arg0 instanceof CError ){
        return this.value = arg0;
    }
/*    else{

    }*/

    if( !(arg1 instanceof CArray || arg1 instanceof CArea) ){
        return this.value = new CError( cErrorType.not_available );
    }
    else {
        arg1 = arg1.getMatrix();
    }

    if( arg2 instanceof CNumber || arg2 instanceof CBool ){

    }
    else if( arg2 instanceof CError ){
        return this.value = arg2;
    }
    else{
        return this.value = new CError( cErrorType.not_available );
    }

    return this.value = findMatch(arg0,arg1,arg2)

}
cMATCH.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"(  lookup-value  ,  lookup-array [ , [ match-type ]] )"
    };
}

function cOFFSET() {
//    cBaseFunction.call( this, "OFFSET" );

    this.name = "OFFSET";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 3;
    this.argumentsCurrent = 0;
    this.argumentsMax = 5;
    this.formatType = {
        def:-1, //подразумевается формат первой ячейки входящей в формулу.
        noneFormat:-2
    };
    this.numFormat = this.formatType.def;

}
cOFFSET.prototype = Object.create( cBaseFunction.prototype )
cOFFSET.prototype.Calculate = function ( arg ) {
    var arg0 = arg[0], arg1 = arg[1], arg2 = arg[2], arg3 = arg[3] ? arg[3] : new CNumber(0 ), arg4 = arg[4] ? arg[4] : new CNumber(0);

    if(1){}

}
cOFFSET.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( reference , rows , cols [ , [ height ] [ , [ width ] ] ] )"
    };
}

function cROW() {
//    cBaseFunction.call( this, "ROW" );
//    this.setArgumentsMin( 0 );
//    this.setArgumentsMax( 1 );

    this.name = "ROW";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 0;
    this.argumentsCurrent = 0;
    this.argumentsMax = 1;
    this.formatType = {
        def:-1, //подразумевается формат первой ячейки входящей в формулу.
        noneFormat:-2
    };
    this.numFormat = this.formatType.def;

}
cROW.prototype = Object.create( cBaseFunction.prototype )
cROW.prototype.Calculate = function ( arg ) {
    var arg0;
    if ( this.argumentsCurrent == 0 ) {
        arg0 = arguments[1];
        return this.value = new CNumber( arg0.getFirst().getRow() );
    }
    arg0 = arg[0];
    if ( arg0 instanceof CRef || arg0 instanceof CRef3D || arg0 instanceof CArea ) {
        var range = arg0.getRange();
        if ( range )
            return this.value = new CNumber( range.getFirst().getRow() );
        else
            return this.value = new CError( cErrorType.bad_reference );
    }
    else if ( arg0 instanceof CArea3D ) {
        var r = arg0.getRange();
        if ( r && r[0] && r[0].getFirst() ) {
            return this.value = new CNumber( r[0].getFirst().getRow() );
        }
        else {
            return this.value = new CError( cErrorType.bad_reference );
        }
    }
    else
        return this.value = new CError( cErrorType.bad_reference );
}
cROW.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( [ reference ] )"
    };
}

function cROWS() {
//    cBaseFunction.call( this, "ROWS" );
//    this.setArgumentsMin( 1 );
//    this.setArgumentsMax( 1 );

    this.name = "ROWS";
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
cROWS.prototype = Object.create( cBaseFunction.prototype )
cROWS.prototype.Calculate = function ( arg ) {
    var arg0 = arg[0];
    if ( arg0 instanceof CArray ) {
        return this.value = new CNumber( arg0.getRowCount() );
    }
    else if ( arg0 instanceof CArea || arg0 instanceof CRef || arg0 instanceof CRef3D ) {
        var range = arg0.getRange();
        return this.value = new CNumber( Math.abs( range.getBBox().r1 - range.getBBox().r2 ) + 1 );
    }
    else if ( arg0 instanceof CArea3D ) {
        var range = arg0.getRange();
        if ( range.length > 1 )
            return this.value = new CError( cErrorType.wrong_value_type );

        return this.value = new CNumber( Math.abs( range[0].getBBox().r1 - range[0].getBBox().r2 ) + 1 );
    }
    else
        return this.value = new CError( cErrorType.wrong_value_type );
}
cROWS.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( array )"
    };
}

function cRTD() {
    cBaseFunction.call( this, "RTD" );
}
cRTD.prototype = Object.create( cBaseFunction.prototype )

function cTRANSPOSE() {
//    cBaseFunction.call( this, "TRANSPOSE" );

    this.name = "TRANSPOSE";
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
cTRANSPOSE.prototype = Object.create( cBaseFunction.prototype )
cTRANSPOSE.prototype.Calculate = function ( arg ) {

    function TransposeMatrix( A ) {

        var tMatrix = [], res = new CArray();

        for ( var i = 0; i < A.length; i++ ) {
            for ( var j = 0; j < A[i].length; j++ ) {
                if(!tMatrix[j]) tMatrix[j] = [];
                tMatrix[j][i] = A[i][j];
            }
        }

        res.fillFromArray( tMatrix );

        return res;
    }

    var arg0 = arg[0];
    if ( arg0 instanceof CArea || arg0 instanceof CArray ) {
        arg0 = arg0.getMatrix();
    }
    else if( arg0 instanceof CNumber || arg0 instanceof CString || arg0 instanceof CBool || arg0 instanceof CRef || arg0 instanceof CRef3D ){
        return this.value = arg0.getValue();
    }
    else if( arg0 instanceof CError ){
        return this.value = arg0;
    }
    else
        return this.value = new CError( cErrorType.not_available );


    return this.value = TransposeMatrix( arg0 );
}
cTRANSPOSE.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( array )"
    };
}

function VHLOOKUPCache(bHor){
    this.cacheId = {};
	this.cacheRanges = {};
	this.bHor = bHor;
}
VHLOOKUPCache.prototype.get = function(range, valueForSearching, isValueString, arg3Value){
    var res = null;
	var _this = this;
	var wsId = range.getWorksheet().getId();
    var sRangeName = wsId + cCharDelimiter + range.getName();
    var cacheElem = this.cacheId[sRangeName];
    if(null == cacheElem)
    {
        cacheElem = {id: sRangeName, foreachArray: [], results: {}};
        range._foreachNoEmpty( /*func for cell in col*/ function(cell, r, c, r1, c1){
            var cv = cell.getValueWithoutFormat();
			if(_this.bHor)
				cacheElem.foreachArray.push({cv: cv, cvType: checkTypeCell( cv ), index: c, indexStart: c1});
			else
				cacheElem.foreachArray.push({cv: cv, cvType: checkTypeCell( cv ), index: r, indexStart: r1});
        });
        this.cacheId[sRangeName] = cacheElem;
		var cacheRange = this.cacheRanges[wsId];
		if(null == cacheRange)
		{
			cacheRange = new RangeDataManager(null);
			this.cacheRanges[wsId] = cacheRange;
		}
		cacheRange.add(range.getBBox0(), cacheElem);
    }
    var sInputKey = valueForSearching + cCharDelimiter + isValueString + cCharDelimiter + arg3Value;
    res = cacheElem.results[sInputKey];
    if(null == res)
    {
        res = this._calculate(cacheElem.foreachArray, valueForSearching, isValueString, arg3Value);
        cacheElem.results[sInputKey] = res;
    }
    return res;
};
VHLOOKUPCache.prototype._calculate = function(cacheArray, valueForSearching, isValueString, arg3Value){
    var res = {min: undefined, index: -1}, found = false, regexp = null;
    for(var i = 0, length = cacheArray.length; i < length; i++)
    {
        var cache = cacheArray[i];
        var cv = cache.cv;
        var index = cache.index;
        var indexStart = cache.indexStart;
        var cvType = cache.cvType;
        if ( index == indexStart )
            res.min = cv;
        else if ( res.min > cv ) {
            res.min = cv;
        }
        if ( arg3Value == true ) {
            if ( isValueString ) {
                if ( cvType instanceof CString ) {
                    if ( valueForSearching.localeCompare( cvType.getValue() ) == 0 ) {
                        res.index = index;
                        found = true;
                    }
                    else if ( valueForSearching.localeCompare( cvType.getValue() ) == 1 && !found ) {
                        res.index = index;
                    }
                }
            }
            else if ( valueForSearching == cv ) {
                res.index = index;
                found = true;
            }
            else if ( valueForSearching > cv && !found ) {
                res.index = index;
            }
        }
        else {
            if ( isValueString ) {
                if(null == regexp)
                    regexp = searchRegExp( valueForSearching );
                if ( regexp.test( cv ) )
                    res.index = index;
            }
            else if ( valueForSearching == cv ) {
                res.index = index;
            }
        }
    }
    return res;
};
VHLOOKUPCache.prototype.remove = function(cell){
	var wsId = cell.ws.getId();
	var cacheRange = this.cacheRanges[wsId];
	if(null != cacheRange)
	{
		var oGetRes = cacheRange.get(new Asc.Range(cell.oId.getCol0(), cell.oId.getRow0(), cell.oId.getCol0(), cell.oId.getRow0()));
		for(var i = 0, length = oGetRes.all.length; i < length; ++i)
		{
			var elem = oGetRes.all[i];
			elem.data.results = {};
		}
	}
};
VHLOOKUPCache.prototype.clean = function(){
    this.cacheId = {};
	this.cacheRanges = {};
};
var g_oVLOOKUPCache = new VHLOOKUPCache(false);

function cVLOOKUP() {
//    cBaseFunction.call( this, "VLOOKUP" );

    this.name = "VLOOKUP";
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

//    this.setArgumentsMin( 3 );
//    this.setArgumentsMax( 4 );
}
cVLOOKUP.prototype = Object.create( cBaseFunction.prototype )
cVLOOKUP.prototype.Calculate = function ( arg ) {
    var arg0 = arg[0], arg1 = arg[1], arg2 = arg[2], arg3 = this.argumentsCurrent == 4 ? arg[3].tocBool() : new CBool( true );
    var numberCol = arg2.getValue() - 1, valueForSearching, resR = -1, min, regexp;

    if ( isNaN( numberCol ) )
        return this.value = new CError( cErrorType.bad_reference );

    if ( numberCol < 0 )
        return this.value = new CError( cErrorType.wrong_value_type );

    if ( arg0 instanceof CRef ) {
        arg0 = arg0.getValue()
    }

    if ( arg0 instanceof CString ) {
        valueForSearching = arg0.getValue();
    }
    else if ( arg0 instanceof CError )
        return this.value = arg0;
    else {
        valueForSearching = arg0.getValue();
    }


    var found = false, bb;
    if ( arg1 instanceof CRef || arg1 instanceof CRef3D ) {
        var range = arg1.getRange(), ws = arg1.getWS();
        bb = range.getBBox0();
        if ( numberCol > bb.c2 - bb.c1 )
            return this.value = new CError( cErrorType.bad_reference );
        var oSearchRange = ws.getRange3(bb.r1, bb.c1, bb.r2, bb.c1);
        var oCache = g_oVLOOKUPCache.get(oSearchRange, valueForSearching, arg0 instanceof CString, arg3.value);
        if(oCache)
        {
            resR = oCache.index;
            min = oCache.min;
        }
    }
    else if ( arg1 instanceof CArea ) {
        var range = arg1.getRange(), ws = arg1.getWS();
        bb = range.getBBox0();
        if ( numberCol > bb.c2 - bb.c1 )
            return this.value = new CError( cErrorType.bad_reference );

        var oSearchRange = ws.getRange3(bb.r1, bb.c1, bb.r2, bb.c1);
        var oCache = g_oVLOOKUPCache.get(oSearchRange, valueForSearching, arg0 instanceof CString, arg3.value);
        if(oCache)
        {
            resR = oCache.index;
            min = oCache.min;
        }
        /*var matrix = arg1.getMatrix();

         for(var matrixHeight = 0; matrixHeight<matrix.length; matrixHeight++){
         for(var matrixWidth = 0; matrixWidth<1; matrixWidth++){
         var cvType = matrix[matrixHeight][matrixWidth], cv = cvType.getValue();
         if ( matrixHeight == 0 )
         min = cv;
         else if( min > cv ){
         min = cv;
         }
         if ( arg3.value == true ) {
         if ( arg0 instanceof cString ) {
         if ( cvType instanceof cString ){
         if( valueForSearching.localeCompare( cvType.getValue() ) == 0 ){
         resR = matrixHeight+bb.r1;
         found = true;
         }
         else if( valueForSearching.localeCompare( cvType.getValue() ) == 1 && !found ){
         resR = matrixHeight+bb.r1;
         }
         }
         }
         else if ( valueForSearching == cv ) {
         resR = matrixHeight+bb.r1;
         found = true;
         }
         else if ( valueForSearching > cv && !found ) {
         resR = matrixHeight+bb.r1;
         }
         }
         else {
         if ( arg0 instanceof cString ) {
         if ( regexp.test( cv ) )
         resR = matrixHeight+bb.r1;
         }
         else if ( valueForSearching == cv ) {
         resR = matrixHeight+bb.r1;
         }
         }
         //f( matrix[matrixHeight][matrixWidth], matrixHeight+bb.r1, matrixWidth+bb.c1, bb.r1, bb.c1 )
         }
         }*/
    }
    else if ( arg1 instanceof CArea3D ) {
        var range = arg1.getRange()[0], ws = arg1.getWS();
        bb = range.getBBox0();
        if ( numberCol > bb.c2 - bb.c1 )
            return this.value = new CError( cErrorType.bad_reference );

        /*var matrix = arg1.getMatrix()[0]

         for(var matrixHeight = 0; matrixHeight<matrix.length; matrixHeight++){
         for(var matrixWidth = 0; matrixWidth<1; matrixWidth++){
         var cvType = matrix[matrixHeight][matrixWidth], cv = cvType.getValue();
         if ( matrixHeight == 0 )
         min = cv;
         else if( min > cv ){
         min = cv;
         }
         if ( arg3.value == true ) {
         if ( arg0 instanceof cString ) {
         if ( cvType instanceof cString ){
         if( valueForSearching.localeCompare( cvType.getValue() ) == 0 ){
         resR = matrixHeight+bb.r1;
         found = true;
         }
         else if( valueForSearching.localeCompare( cvType.getValue() ) == 1 && !found ){
         resR = matrixHeight+bb.r1;
         }
         }
         }
         else if ( valueForSearching == cv ) {
         resR = matrixHeight+bb.r1;
         found = true;
         }
         else if ( valueForSearching > cv && !found ) {
         resR = matrixHeight+bb.r1;
         }
         }
         else {
         if ( arg0 instanceof cString ) {
         if ( regexp.test( cv ) )
         resR = matrixHeight+bb.r1;
         }
         else if ( valueForSearching == cv ) {
         resR = matrixHeight+bb.r1;
         }
         }
         //f( matrix[matrixHeight][matrixWidth], matrixHeight+bb.r1, matrixWidth+bb.c1, bb.r1, bb.c1 )
         }
         }*/

        var oSearchRange = ws.getRange3(bb.r1, bb.c1, bb.r2, bb.c1);
        var oCache = g_oVLOOKUPCache.get(oSearchRange, valueForSearching, arg0 instanceof CString, arg3.value);
        if(oCache)
        {
            resR = oCache.index;
            min = oCache.min;
        }

    }
    else if ( arg1 instanceof CArray ) {
        if(arg0 instanceof CString)
            regexp = searchRegExp( valueForSearching );
        arg1.foreach( function ( elem, r, c ) {
            if ( r == 0 )
                min = elem.getValue();

            if ( arg3.value == true ) {
                if ( valueForSearching == elem.getValue() ) {
                    resR = r;
                    found = true;
                }
                else if ( valueForSearching > elem.getValue() && !found ) {
                    resR = r;
                }
            }
            else {
                if ( arg0 instanceof CString ) {
                    if ( regexp.test( elem.getValue() ) )
                        resR = r;
                }
                else if ( valueForSearching == elem.getValue() ) {
                    resR = r;
                }
            }

            min = Math.min( min, elem.getValue() );
        } )

        if ( min > valueForSearching ) {
            return this.value = new CError( cErrorType.not_available );
        }

        if ( resR == -1 ) {
            return this.value = new CError( cErrorType.not_available );
        }

        if ( numberCol > arg1.getCountElementInRow() - 1 ) {
            return this.value = new CError( cErrorType.bad_reference );
        }

        return this.value = arg1.getElementRowCol( resR, numberCol );

    }

    if ( min > valueForSearching ) {
        return this.value = new CError( cErrorType.not_available );
    }

    if ( resR == -1 ) {
        return this.value = new CError( cErrorType.not_available );
    }

    var c = new CellAddress( resR, bb.c1 + numberCol, 0 );

    var v = arg1.getWS()._getCellNoEmpty( c.getRow0(), c.getCol0() )
    if ( v )
        v = v.getValueWithoutFormat();
    else
        v = "";

    return this.value = checkTypeCell( v );
}
cVLOOKUP.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( lookup-value  ,  table-array  ,  col-index-num  [  ,  [  range-lookup-flag  ] ] )"
    };
}
