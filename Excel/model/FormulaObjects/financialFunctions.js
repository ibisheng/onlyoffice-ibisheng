"use strict";

/**
 * Created with JetBrains WebStorm.
 * User: Dmitry.Shahtanov
 * Date: 27.06.13
 * Time: 15:19
 * To change this template use File | Settings | File Templates.
 */
cFormulaFunction.Financial = {
    'groupName':"Financial",
    'ACCRINT':cACCRINT,
    'ACCRINTM':cACCRINTM,
    'AMORDEGRC':cAMORDEGRC,
    'AMORLINC':cAMORLINC,
    'COUPDAYBS':cCOUPDAYBS,
    'COUPDAYS':cCOUPDAYS,
    'COUPDAYSNC':cCOUPDAYSNC,
    'COUPNCD':cCOUPNCD,
    'COUPNUM':cCOUPNUM,
    'COUPPCD':cCOUPPCD,
    'CUMIPMT':cCUMIPMT,
    'CUMPRINC':cCUMPRINC,
    'DB':cDB,
    'DDB':cDDB,
    'DISC':cDISC,
    'DOLLARDE':cDOLLARDE,
    'DOLLARFR':cDOLLARFR,
    'DURATION':cDURATION,
    'EFFECT':cEFFECT,
    'FV':cFV,
    'FVSCHEDULE':cFVSCHEDULE,
    'INTRATE':cINTRATE,
    'IPMT':cIPMT,
    'IRR':cIRR,
    'ISPMT':cISPMT,
    'MDURATION':cMDURATION,
    'MIRR':cMIRR,
    'NOMINAL':cNOMINAL,
    'NPER':cNPER,
    'NPV':cNPV,
    'ODDFPRICE':cODDFPRICE,
    'ODDFYIELD':cODDFYIELD,
    'ODDLPRICE':cODDLPRICE,
    'ODDLYIELD':cODDLYIELD,
    'PMT':cPMT,
    'PPMT':cPPMT,
    'PRICE':cPRICE,
    'PRICEDISC':cPRICEDISC,
    'PRICEMAT':cPRICEMAT,
    'PV':cPV,
    'RATE':cRATE,
    'RECEIVED':cRECEIVED,
    'SLN':cSLN,
    'SYD':cSYD,
    'TBILLEQ':cTBILLEQ,
    'TBILLPRICE':cTBILLPRICE,
    'TBILLYIELD':cTBILLYIELD,
    'VDB':cVDB,
    'XIRR':cXIRR,
    'XNPV':cXNPV,
    'YIELD':cYIELD,
    'YIELDDISC':cYIELDDISC,
    'YIELDMAT':cYIELDMAT
}

function cACCRINT() {
    cBaseFunction.call( this, "ACCRINT" );
}
cACCRINT.prototype = Object.create( cBaseFunction.prototype )

function cACCRINTM() {
    cBaseFunction.call( this, "ACCRINTM" );
}
cACCRINTM.prototype = Object.create( cBaseFunction.prototype )

function cAMORDEGRC() {
    cBaseFunction.call( this, "AMORDEGRC" );
}
cAMORDEGRC.prototype = Object.create( cBaseFunction.prototype )

function cAMORLINC() {
    cBaseFunction.call( this, "AMORLINC" );
}
cAMORLINC.prototype = Object.create( cBaseFunction.prototype )

function cCOUPDAYBS() {
    cBaseFunction.call( this, "COUPDAYBS" );
}
cCOUPDAYBS.prototype = Object.create( cBaseFunction.prototype )

function cCOUPDAYS() {
    cBaseFunction.call( this, "COUPDAYS" );
}
cCOUPDAYS.prototype = Object.create( cBaseFunction.prototype )

function cCOUPDAYSNC() {
    cBaseFunction.call( this, "COUPDAYSNC" );
}
cCOUPDAYSNC.prototype = Object.create( cBaseFunction.prototype )

function cCOUPNCD() {
    cBaseFunction.call( this, "COUPNCD" );
}
cCOUPNCD.prototype = Object.create( cBaseFunction.prototype )

function cCOUPNUM() {
    cBaseFunction.call( this, "COUPNUM" );
}
cCOUPNUM.prototype = Object.create( cBaseFunction.prototype )

function cCOUPPCD() {
    cBaseFunction.call( this, "COUPPCD" );
}
cCOUPPCD.prototype = Object.create( cBaseFunction.prototype )

function cCUMIPMT() {
    cBaseFunction.call( this, "CUMIPMT" );
}
cCUMIPMT.prototype = Object.create( cBaseFunction.prototype )

function cCUMPRINC() {
    cBaseFunction.call( this, "CUMPRINC" );
}
cCUMPRINC.prototype = Object.create( cBaseFunction.prototype )

function cDB() {
    cBaseFunction.call( this, "DB" );
}
cDB.prototype = Object.create( cBaseFunction.prototype )

function cDDB() {
    cBaseFunction.call( this, "DDB" );
}
cDDB.prototype = Object.create( cBaseFunction.prototype )

function cDISC() {
    cBaseFunction.call( this, "DISC" );
}
cDISC.prototype = Object.create( cBaseFunction.prototype )

function cDOLLARDE() {
    cBaseFunction.call( this, "DOLLARDE" );
}
cDOLLARDE.prototype = Object.create( cBaseFunction.prototype )

function cDOLLARFR() {
    cBaseFunction.call( this, "DOLLARFR" );
}
cDOLLARFR.prototype = Object.create( cBaseFunction.prototype )

function cDURATION() {
    cBaseFunction.call( this, "DURATION" );
}
cDURATION.prototype = Object.create( cBaseFunction.prototype )

function cEFFECT() {
    cBaseFunction.call( this, "EFFECT" );
}
cEFFECT.prototype = Object.create( cBaseFunction.prototype )

function cFV() {
//    cBaseFunction.call( this, "FV" );
//    this.setArgumentsMin( 3 );
//    this.setArgumentsMax( 5 );
//    this.setFormat( this.formatType.noneFormat );

    this.name = "FV";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 3;
    this.argumentsCurrent = 0;
    this.argumentsMax = 5;
    this.formatType = {
        def:-1, //подразумевается формат первой ячейки входящей в формулу.
        noneFormat:-2
    };
    this.numFormat = this.formatType.noneFormat;

}
cFV.prototype = Object.create( cBaseFunction.prototype )
cFV.prototype.Calculate = function ( arg ) {
    var rate = arg[0], nper = arg[1], pmt = arg[2], pv = arg[3] ? arg[3] : new cNumber( 0 ), type = arg[4] ? arg[4] : new cNumber( 0 );

    if ( rate instanceof cArea || rate instanceof cArea3D ) {
        rate = rate.cross( arguments[1].first );
    }
    else if ( rate instanceof cArray ) {
        rate = rate.getElementRowCol( 0, 0 );
    }

    if ( nper instanceof cArea || nper instanceof cArea3D ) {
        nper = nper.cross( arguments[1].first );
    }
    else if ( nper instanceof cArray ) {
        nper = nper.getElementRowCol( 0, 0 );
    }

    if ( pmt instanceof cArea || pmt instanceof cArea3D ) {
        pmt = pmt.cross( arguments[1].first );
    }
    else if ( pmt instanceof cArray ) {
        pmt = pmt.getElementRowCol( 0, 0 );
    }

    if ( pv instanceof cArea || pv instanceof cArea3D ) {
        pv = pv.cross( arguments[1].first );
    }
    else if ( pv instanceof cArray ) {
        pv = pv.getElementRowCol( 0, 0 );
    }

    if ( type instanceof cArea || type instanceof cArea3D ) {
        type = type.cross( arguments[1].first );
    }
    else if ( type instanceof cArray ) {
        type = type.getElementRowCol( 0, 0 );
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
    if ( rate.getValue() != 0 ) {
        res = -1 * ( pv.getValue() * Math.pow( 1 + rate.getValue(), nper.getValue() ) + pmt.getValue() * ( 1 + rate.getValue() * type.getValue() ) * (Math.pow( (1 + rate.getValue()), nper.getValue() ) - 1) / rate.getValue() );
    }
    else {
        res = -1 * ( pv.getValue() + pmt.getValue() * nper.getValue() );
    }

    return this.value = new cNumber( res );
}
cFV.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( rate , nper , pmt [ , [ pv ] [ ,[ type ] ] ] )"
    };
}

function cFVSCHEDULE() {
    cBaseFunction.call( this, "FVSCHEDULE" );
}
cFVSCHEDULE.prototype = Object.create( cBaseFunction.prototype )

function cINTRATE() {
    cBaseFunction.call( this, "INTRATE" );
}
cINTRATE.prototype = Object.create( cBaseFunction.prototype )

function cIPMT() {
    cBaseFunction.call( this, "IPMT" );
}
cIPMT.prototype = Object.create( cBaseFunction.prototype )

function cIRR() {
    cBaseFunction.call( this, "IRR" );
}
cIRR.prototype = Object.create( cBaseFunction.prototype )

function cISPMT() {
    cBaseFunction.call( this, "ISPMT" );
}
cISPMT.prototype = Object.create( cBaseFunction.prototype )

function cMDURATION() {
    cBaseFunction.call( this, "MDURATION" );
}
cMDURATION.prototype = Object.create( cBaseFunction.prototype )

function cMIRR() {
    cBaseFunction.call( this, "MIRR" );
}
cMIRR.prototype = Object.create( cBaseFunction.prototype )

function cNOMINAL() {
    cBaseFunction.call( this, "NOMINAL" );
}
cNOMINAL.prototype = Object.create( cBaseFunction.prototype )

function cNPER() {
//    cBaseFunction.call( this, "NPER" );
//    this.setArgumentsMin( 3 );
//    this.setArgumentsMax( 5 );
//    this.setFormat( this.formatType.noneFormat );

    this.name = "NPER";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 3;
    this.argumentsCurrent = 0;
    this.argumentsMax = 5;
    this.formatType = {
        def:-1, //подразумевается формат первой ячейки входящей в формулу.
        noneFormat:-2
    };
    this.numFormat = this.formatType.noneFormat;

}
cNPER.prototype = Object.create( cBaseFunction.prototype )
cNPER.prototype.Calculate = function ( arg ) {
    var rate = arg[0], pmt = arg[1], pv = arg[2], fv = arg[3] ? arg[3] : new cNumber( 0 ), type = arg[4] ? arg[4] : new cNumber( 0 );

    if ( rate instanceof cArea || rate instanceof cArea3D ) {
        rate = rate.cross( arguments[1].first );
    }
    else if ( rate instanceof cArray ) {
        rate = rate.getElementRowCol( 0, 0 );
    }

    if ( pmt instanceof cArea || pmt instanceof cArea3D ) {
        pmt = pmt.cross( arguments[1].first );
    }
    else if ( pmt instanceof cArray ) {
        pmt = pmt.getElementRowCol( 0, 0 );
    }

    if ( pv instanceof cArea || pv instanceof cArea3D ) {
        pv = pv.cross( arguments[1].first );
    }
    else if ( pv instanceof cArray ) {
        pv = pv.getElementRowCol( 0, 0 );
    }

    if ( fv instanceof cArea || fv instanceof cArea3D ) {
        fv = fv.cross( arguments[1].first );
    }
    else if ( fv instanceof cArray ) {
        fv = fv.getElementRowCol( 0, 0 );
    }

    if ( type instanceof cArea || type instanceof cArea3D ) {
        type = type.cross( arguments[1].first );
    }
    else if ( type instanceof cArray ) {
        type = type.getElementRowCol( 0, 0 );
    }

    rate = rate.tocNumber();
    pmt = pmt.tocNumber();
    pv = pv.tocNumber();
    fv = fv.tocNumber();
    type = type.tocNumber();

    if ( rate instanceof cError ) return this.value = rate;
    if ( pmt instanceof cError ) return this.value = pmt;
    if ( pmt instanceof cError ) return this.value = pv;
    if ( fv instanceof cError ) return this.value = fv;
    if ( type instanceof cError ) return this.value = type;

    if ( type.getValue() != 1 && type.getValue() != 0 ) return this.value = new cError( cErrorType.not_numeric );

    var res;
    if ( rate.getValue() != 0 ) {
        rate = rate.getValue();
        pmt = pmt.getValue();
        pv = pv.getValue();
        fv = fv.getValue();
        type = type.getValue();
        res = (-fv * rate + pmt * (1 + rate * type)) / (rate * pv + pmt * (1 + rate * type))
        res = Math.log( res ) / Math.log( 1 + rate )
    }
    else {
        res = -pv.getValue() - fv.getValue() / pmt.getValue();
    }

    return this.value = new cNumber( res );
}
cNPER.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( rate , pmt , pv [ , [ fv ] [ , [ type ] ] ] )"
    };
}

function cNPV() {
//    cBaseFunction.call( this, "NPV" );
//    this.setArgumentsMin( 2 );
//    this.setArgumentsMax( 255 );
//    this.setFormat( this.formatType.noneFormat );

    this.name = "NPV";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 2;
    this.argumentsCurrent = 0;
    this.argumentsMax = 255;
    this.formatType = {
        def:-1, //подразумевается формат первой ячейки входящей в формулу.
        noneFormat:-2
    };
    this.numFormat = this.formatType.noneFormat;

}
cNPV.prototype = Object.create( cBaseFunction.prototype )
cNPV.prototype.Calculate = function ( arg ) {
    var arg0 = arg[0], arg1 = arg[1], iStart = 1, res = 0, rate;

    function elemCalc( rate, value, step ) {
        return value / Math.pow( 1 + rate, step );
    }

    if ( arg0 instanceof cArea || arg0 instanceof cArea3D ) {
        arg0 = arg0.cross( arguments[1].first );
    }
    else if ( arg0 instanceof cArray ) {
        arg0 = arg0.getElementRowCol( 0, 0 );
    }

    arg0 = arg0.tocNumber();

    if ( arg0 instanceof cError )
        return this.value = arg0;

    rate = arg0.getValue();

    if ( rate == -1 )
        return this.value = new cError( cErrorType.division_by_zero );


    for ( var i = 1; i < this.getArguments(); i++ ) {
        var argI = arg[i];
        if ( argI instanceof cArea || argI instanceof cArea3D ) {
            var argIArr = argI.getValue();
            for ( var j = 0; j < argIArr.length; j++ ) {
                if ( argIArr[j] instanceof cNumber ) {
                    res += elemCalc( rate, argIArr[j].getValue(), iStart++ );
                }
            }
            continue;
        }
        else if ( argI instanceof cArray ) {
            argI.foreach( function ( elem, r, c ) {
                if ( elem instanceof cNumber ) {
                    res += elemCalc( rate, elem.getValue(), iStart++ );
                }
            } )
            continue;
        }

        argI = argI.tocNumber();

        if ( argI instanceof cError )
            continue;

        res += elemCalc( rate, argI.getValue(), iStart++ );

    }

    return this.value = new cNumber( res );

};
cNPV.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( rate , argument-list )"
    };
};

function cODDFPRICE() {
    cBaseFunction.call( this, "ODDFPRICE" );
}
cODDFPRICE.prototype = Object.create( cBaseFunction.prototype )

function cODDFYIELD() {
    cBaseFunction.call( this, "ODDFYIELD" );
}
cODDFYIELD.prototype = Object.create( cBaseFunction.prototype )

function cODDLPRICE() {
    cBaseFunction.call( this, "ODDLPRICE" );
}
cODDLPRICE.prototype = Object.create( cBaseFunction.prototype )

function cODDLYIELD() {
    cBaseFunction.call( this, "ODDLYIELD" );
}
cODDLYIELD.prototype = Object.create( cBaseFunction.prototype )

function cPMT() {
//    cBaseFunction.call( this, "PMT" );
//    this.setArgumentsMin( 3 );
//    this.setArgumentsMax( 5 );
//    this.setFormat( this.formatType.noneFormat );

    this.name = "PMT";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 3;
    this.argumentsCurrent = 0;
    this.argumentsMax = 5;
    this.formatType = {
        def:-1, //подразумевается формат первой ячейки входящей в формулу.
        noneFormat:-2
    };
    this.numFormat = this.formatType.noneFormat;

}
cPMT.prototype = Object.create( cBaseFunction.prototype )
cPMT.prototype.Calculate = function ( arg ) {
    var rate = arg[0], nper = arg[1], pv = arg[2], fv = arg[3] ? arg[3] : new cNumber( 0 ), type = arg[4] ? arg[4] : new cNumber( 0 );

    if ( rate instanceof cArea || rate instanceof cArea3D ) {
        rate = rate.cross( arguments[1].first );
    }
    else if ( rate instanceof cArray ) {
        rate = rate.getElementRowCol( 0, 0 );
    }

    if ( nper instanceof cArea || nper instanceof cArea3D ) {
        nper = nper.cross( arguments[1].first );
    }
    else if ( nper instanceof cArray ) {
        nper = nper.getElementRowCol( 0, 0 );
    }

    if ( pv instanceof cArea || pv instanceof cArea3D ) {
        pv = pv.cross( arguments[1].first );
    }
    else if ( pv instanceof cArray ) {
        pv = pv.getElementRowCol( 0, 0 );
    }

    if ( fv instanceof cArea || fv instanceof cArea3D ) {
        fv = fv.cross( arguments[1].first );
    }
    else if ( fv instanceof cArray ) {
        fv = fv.getElementRowCol( 0, 0 );
    }

    if ( type instanceof cArea || type instanceof cArea3D ) {
        type = type.cross( arguments[1].first );
    }
    else if ( type instanceof cArray ) {
        type = type.getElementRowCol( 0, 0 );
    }

    rate = rate.tocNumber();
    nper = nper.tocNumber();
    pv = pv.tocNumber();
    fv = fv.tocNumber();
    type = type.tocNumber();

    if ( rate instanceof cError ) return this.value = rate;

    if ( nper instanceof cError ) return this.value = nper;
    if ( nper.getValue() == 0 ) return this.value = new cError( cErrorType.division_by_zero );

    if ( pv instanceof cError ) return this.value = pv;
    if ( fv instanceof cError ) return this.value = fv;
    if ( type instanceof cError ) return this.value = type;

    if ( type.getValue() != 1 && type.getValue() != 0 ) return this.value = new cError( cErrorType.not_numeric );

    var res;
    if ( rate.getValue() != 0 ) {
        res = -1 * ( pv.getValue() * Math.pow( 1 + rate.getValue(), nper.getValue() ) + fv.getValue() ) /
            ( ( 1 + rate.getValue() * type.getValue() ) * ( Math.pow( (1 + rate.getValue()), nper.getValue() ) - 1 ) / rate.getValue() );
    }
    else {
        res = -1 * ( pv.getValue() + fv.getValue() ) / nper.getValue();
    }

    return this.value = new cNumber( res );
}
cPMT.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( rate , nper , pv [ , [ fv ] [ ,[ type ] ] ] )"
    };
}

function cPPMT() {
    cBaseFunction.call( this, "PPMT" );
}
cPPMT.prototype = Object.create( cBaseFunction.prototype )

function cPRICE() {
    cBaseFunction.call( this, "PRICE" );
}
cPRICE.prototype = Object.create( cBaseFunction.prototype )

function cPRICEDISC() {
    cBaseFunction.call( this, "PRICEDISC" );
}
cPRICEDISC.prototype = Object.create( cBaseFunction.prototype )

function cPRICEMAT() {
    cBaseFunction.call( this, "PRICEMAT" );
}
cPRICEMAT.prototype = Object.create( cBaseFunction.prototype )

function cPV() {
//    cBaseFunction.call( this, "PV" );
//    this.setArgumentsMin( 3 );
//    this.setArgumentsMax( 5 );
//    this.setFormat( this.formatType.noneFormat );

    this.name = "PV";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 3;
    this.argumentsCurrent = 0;
    this.argumentsMax = 5;
    this.formatType = {
        def:-1, //подразумевается формат первой ячейки входящей в формулу.
        noneFormat:-2
    };
    this.numFormat = this.formatType.noneFormat;

}
cPV.prototype = Object.create( cBaseFunction.prototype )
cPV.prototype.Calculate = function ( arg ) {
    var rate = arg[0], nper = arg[1], pmt = arg[2], fv = arg[3] ? arg[3] : new cNumber( 0 ), type = arg[4] ? arg[4] : new cNumber( 0 );

    if ( rate instanceof cArea || rate instanceof cArea3D ) {
        rate = rate.cross( arguments[1].first );
    }
    else if ( rate instanceof cArray ) {
        rate = rate.getElementRowCol( 0, 0 );
    }

    if ( nper instanceof cArea || nper instanceof cArea3D ) {
        nper = nper.cross( arguments[1].first );
    }
    else if ( nper instanceof cArray ) {
        nper = nper.getElementRowCol( 0, 0 );
    }

    if ( pmt instanceof cArea || pmt instanceof cArea3D ) {
        pmt = pmt.cross( arguments[1].first );
    }
    else if ( pmt instanceof cArray ) {
        pmt = pmt.getElementRowCol( 0, 0 );
    }

    if ( fv instanceof cArea || fv instanceof cArea3D ) {
        fv = fv.cross( arguments[1].first );
    }
    else if ( fv instanceof cArray ) {
        fv = fv.getElementRowCol( 0, 0 );
    }

    if ( type instanceof cArea || type instanceof cArea3D ) {
        type = type.cross( arguments[1].first );
    }
    else if ( type instanceof cArray ) {
        type = type.getElementRowCol( 0, 0 );
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
    if ( rate.getValue() != 0 ) {
        res = -1 * ( fv.getValue() + pmt.getValue() * (1 + rate.getValue() * type.getValue()) * ( (Math.pow( (1 + rate.getValue()), nper.getValue() ) - 1) / rate.getValue() ) ) / Math.pow( 1 + rate.getValue(), nper.getValue() )
    }
    else {
        res = -1 * ( fv.getValue() + pmt.getValue() * nper.getValue() );
    }

    return this.value = new cNumber( res );
}
cPV.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( rate , nper , pmt [ , [ fv ] [ ,[ type ] ] ] )"
    };
}

function cRATE() {
    cBaseFunction.call( this, "RATE" );
}
cRATE.prototype = Object.create( cBaseFunction.prototype )

function cRECEIVED() {
    cBaseFunction.call( this, "RECEIVED" );
}
cRECEIVED.prototype = Object.create( cBaseFunction.prototype )

function cSLN() {
    cBaseFunction.call( this, "SLN" );
}
cSLN.prototype = Object.create( cBaseFunction.prototype )

function cSYD() {
    cBaseFunction.call( this, "SYD" );
}
cSYD.prototype = Object.create( cBaseFunction.prototype )

function cTBILLEQ() {
    cBaseFunction.call( this, "TBILLEQ" );
}
cTBILLEQ.prototype = Object.create( cBaseFunction.prototype )

function cTBILLPRICE() {
    cBaseFunction.call( this, "TBILLPRICE" );
}
cTBILLPRICE.prototype = Object.create( cBaseFunction.prototype )

function cTBILLYIELD() {
    cBaseFunction.call( this, "TBILLYIELD" );
}
cTBILLYIELD.prototype = Object.create( cBaseFunction.prototype )

function cVDB() {
    cBaseFunction.call( this, "VDB" );
}
cVDB.prototype = Object.create( cBaseFunction.prototype )

function cXIRR() {
    cBaseFunction.call( this, "XIRR" );
}
cXIRR.prototype = Object.create( cBaseFunction.prototype )

function cXNPV() {
    cBaseFunction.call( this, "XNPV" );
}
cXNPV.prototype = Object.create( cBaseFunction.prototype )

function cYIELD() {
    cBaseFunction.call( this, "YIELD" );
}
cYIELD.prototype = Object.create( cBaseFunction.prototype )

function cYIELDDISC() {
    cBaseFunction.call( this, "YIELDDISC" );
}
cYIELDDISC.prototype = Object.create( cBaseFunction.prototype )

function cYIELDMAT() {
    cBaseFunction.call( this, "YIELDMAT" );
}
cYIELDMAT.prototype = Object.create( cBaseFunction.prototype )
