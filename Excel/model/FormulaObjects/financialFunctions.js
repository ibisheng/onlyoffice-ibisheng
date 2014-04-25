"use strict";

function getPMT( rate, nper, pv, fv, flag ) {
    var res, part;
    if ( rate === 0 ) {
        res = ( pv + fv ) / nper;
    }
    else {
        part = Math.pow( 1 + rate, nper );
        if ( flag > 0 ) {
            res = ( fv * rate / ( part - 1 ) + pv * rate / ( 1 - 1 / part ) ) / ( 1 + rate );
        }
        else {
            res = fv * rate / ( part - 1 ) + pv * rate / ( 1 - 1 / part );
        }
    }

    return -res;
}

function getFV( rate, nper, pmt, pv, type ) {
    var res, part;
    if ( rate === 0 ) {
        res = pv + pmt * nper;
    }
    else {
        part = Math.pow( 1 + rate, nper );
        if ( type > 0 ) {
            res = pv * part + pmt * ( 1 + rate ) * ( part - 1 ) / rate;
        }
        else {
            res = pv * part + pmt * ( part - 1 ) / rate;
        }
    }

    return -res;
}

function getDDB( cost, salvage, life, period, factor ) {
    var ddb, ipmt, oldCost, newCost;
    ipmt = factor / life;
    if ( ipmt >= 1 ) {
        ipmt = 1;
        if ( period === 1 ) {
            oldCost = cost;
        }
        else {
            oldCost = 0;
        }
    }
    else {
        oldCost = cost * Math.pow( 1 - ipmt, period - 1 );
    }
    newCost = cost * Math.pow( 1 - ipmt, period );

    if ( newCost < salvage ) {
        ddb = oldCost - salvage;
    }
    else {
        ddb = oldCost - newCost;
    }
    if ( ddb < 0 ) {
        ddb = 0;
    }
    return ddb;
}

function getIPMT( rate, per, pv, type, pmt ) {
    var ipmt;

    if ( per === 1 ) {
        if ( type > 0 ) {
            ipmt = 0;
        }
        else {
            ipmt = -pv;
        }
    }
    else {
        if ( type > 0 ) {
            ipmt = getFV( rate, per - 2, pmt, pv, 1 ) - pmt;
        }
        else {
            ipmt = getFV( rate, per - 1, pmt, pv, 0 );
        }
    }
    return ipmt * rate;
}

/**
 * @return {boolean}
 */
function RateIteration( nper, payment, pv, fv, payType, guess ) {

    var bValid = true, bFound = false, fX, fXnew, fTerm, fTermDerivation, fGeoSeries, fGeoSeriesDerivation,
        iterationMax = 150, nCount = 0, minEps = 1E-14, eps = 1E-7,
        fPowN, fPowNminus1;
    fv = fv - payment * payType;
    pv = pv + payment * payType;
    if ( nper === Math.round( nper ) ) {
        fX = guess.fGuess;
        while ( !bFound && nCount < iterationMax ) {
            fPowNminus1 = Math.pow( 1 + fX, nper - 1 );
            fPowN = fPowNminus1 * (1 + fX);
            if ( Math.approxEqual( Math.abs( fX ), 0 ) ) {
                fGeoSeries = nper;
                fGeoSeriesDerivation = nper * (nper - 1) / 2;
            }
            else {
                fGeoSeries = (fPowN - 1) / fX;
                fGeoSeriesDerivation = nper * fPowNminus1 / fX - fGeoSeries / fX;
            }
            fTerm = fv + pv * fPowN + payment * fGeoSeries;
            fTermDerivation = pv * nper * fPowNminus1 + payment * fGeoSeriesDerivation;
            if ( Math.abs( fTerm ) < minEps ) {
                bFound = true;
            }
            else {
                if ( Math.approxEqual( Math.abs( fTermDerivation ), 0 ) ) {
                    fXnew = fX + 1.1 * eps;
                }
                else {
                    fXnew = fX - fTerm / fTermDerivation;
                }
                nCount++;
                bFound = (Math.abs( fXnew - fX ) < eps);
                fX = fXnew;
            }
        }
        bValid = (fX >= -1);
    }
    else {
        fX = (guess.fGuest < -1) ? -1 : guess.fGuest;
        while ( bValid && !bFound && nCount < iterationMax ) {
            if ( Math.approxEqual( Math.abs( fX ), 0 ) ) {
                fGeoSeries = nper;
                fGeoSeriesDerivation = nper * (nper - 1) / 2;
            }
            else {
                fGeoSeries = (Math.pow( 1 + fX, nper ) - 1) / fX;
                fGeoSeriesDerivation = nper * Math.pow( 1 + fX, nper - 1 ) / fX - fGeoSeries / fX;
            }
            fTerm = fv + pv * Math.pow( 1 + fX, nper ) + payment * fGeoSeries;
            fTermDerivation = pv * nper * Math.pow( 1 + fX, nper - 1 ) + payment * fGeoSeriesDerivation;
            if ( Math.abs( fTerm ) < minEps ) {
                bFound = true;
            }
            else {
                if ( Math.approxEqual( Math.abs( fTermDerivation ), 0 ) ) {
                    fXnew = fX + 1.1 * eps;
                }
                else {
                    fXnew = fX - fTerm / fTermDerivation;
                }
                nCount++;
                bFound = (Math.abs( fXnew - fX ) < eps);
                fX = fXnew;
                bValid = (fX >= -1);
            }
        }
    }
    guess.fGuess = fX;
    return bValid && bFound;
}

function lcl_GetCouppcd( settl, matur, freq ) {
    var n = new Date( matur );
    n.setFullYear( settl.getFullYear() );
    if ( n < settl ) {
        n.addYears( 1 );
    }
    while ( n > settl ) {
        n.addMonths( -12 / freq );
    }
    return n;
}

function lcl_GetCoupncd( settl, matur, freq ) {
    matur.setFullYear( settl.getFullYear() );
    if ( matur > settl ) {
        matur.addYears( -1 );
    }
    while ( matur <= settl ) {
        matur.addMonths( 12 / freq );
    }
}

function getcoupdaybs( settl, matur, frequency, basis ) {
    var n = lcl_GetCouppcd( settl, matur, frequency );
    return diffDate( n, settl, basis );
}

function getcoupdays( settl, matur, frequency, basis ) {
    var m = lcl_GetCouppcd( settl, matur, frequency ),
        n = new Date( m );
    n.addMonths( 12 / frequency );
    return diffDate( m, n, basis );
}

function getcoupnum( settl, matur, frequency ) {
    var n = lcl_GetCouppcd( settl, matur, frequency ),
        months = (matur.getFullYear() - n.getFullYear()) * 12 + matur.getMonth() - n.getMonth();
    return Math.ceil( months * frequency / 12 );
}

function getcoupdaysnc( settl, matur, frequency, basis ) {

    if ( (basis !== 0) && (basis !== 4) ) {

        lcl_GetCoupncd( settl, matur, frequency );
        return diffDate( settl, matur, basis );

    }

    return getcoupdays( new Date( settl ), new Date( matur ), frequency, basis ) - getcoupdaybs( new Date( settl ), new Date( matur ), frequency, basis );
}

function getprice( settle, mat, rate, yld, redemp, freq, base ) {

    var cdays = getcoupdays( new Date( settle ), new Date( mat ), freq, base ),
        cdaysnc = getcoupdaysnc( new Date( settle ), new Date( mat ), freq, base ) / cdays,
        cnum = getcoupnum( new Date( settle ), (mat), freq ),
        cdaybs = getcoupdaybs( new Date( settle ), new Date( mat ), freq, base ),
        fT1 = 100 * rate / freq, fT2 = 1 + yld / freq,
        res = redemp / ( Math.pow( 1 + yld / freq, cnum - 1 + cdaysnc ) );

    res -= 100 * rate / freq * cdaybs / cdays;


    for ( var i = 0; i < cnum; i++ ) {
        res += fT1 / Math.pow( fT2, i + cdaysnc );
    }

    return res;
}

function getYield( settle, mat, coup, price, redemp, freq, base ) {
    var priceN = 0, yield1 = 0, yield2 = 1,
        price1 = getprice( settle, mat, coup, yield1, redemp, freq, base ),
        price2 = getprice( settle, mat, coup, yield2, redemp, freq, base ),
        yieldN = ( yield2 - yield1 ) * 0.5;

    for ( var i = 0; i < 100 && priceN != price; i++ ) {
        priceN = getprice( settle, mat, coup, yieldN, redemp, freq, base );

        if ( price == price1 )
            return yield1;
        else if ( price == price2 )
            return yield2;
        else if ( price == priceN )
            return yieldN;
        else if ( price < price2 ) {
            yield2 *= 2;
            price2 = getprice( settle, mat, coup, yield2, redemp, freq, base );

            yieldN = ( yield2 - yield1 ) * 0.5;
        }
        else {
            if ( price < priceN ) {
                yield1 = yieldN;
                price1 = priceN;
            }
            else {
                yield2 = yieldN;
                price2 = priceN;
            }

            yieldN = yield2 - ( yield2 - yield1 ) * ( ( price - price2 ) / ( price1 - price2 ) );
        }
    }

    if ( Math.abs( price - priceN ) > price / 100 )
        return new CError( cErrorType.not_numeric );		// result not precise enough

    return new CNumber( yieldN );
}

function getyieldmat( settle, mat, issue, rate, price, base ) {

    var issMat = yearFrac( issue, mat, base );
    var issSet = yearFrac( issue, settle, base );
    var setMat = yearFrac( settle, mat, base );

    var y = (1 + issMat * rate) / (price / 100 + issSet * rate) - 1;
    y /= setMat;

    return y;
}

function getduration( settlement, maturity, coupon, yld, frequency, basis ) {

    var dbc = getcoupdaybs( new Date( settlement ), new Date( maturity ), frequency, basis ),
        coupD = getcoupdays( new Date( settlement ), new Date( maturity ), frequency, basis ),
        numCoup = getcoupnum( new Date( settlement ), new Date( maturity ), frequency );

    var duration = 0, p = 0;

    var dsc = coupD - dbc;
    var diff = dsc / coupD - 1;
    yld = yld / frequency + 1;


    coupon *= 100 / frequency;

    for ( var index = 1; index <= numCoup; index++ ) {
        var di = index + diff;

        var yldPOW = Math.pow( yld, di );

        duration += di * coupon / yldPOW;

        p += coupon / yldPOW;
    }

    duration += (diff + numCoup) * 100 / Math.pow( yld, diff + numCoup );
    p += 100 / Math.pow( yld, diff + numCoup );

    return duration / p / frequency;

}

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
};

function cACCRINT() {
//    cBaseFunction.call( this, "ACCRINT" );

    this.name = "ACCRINT";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 6;
    this.argumentsCurrent = 0;
    this.argumentsMax = 7;
    this.formatType = {
        def:-1, //подразумевается формат первой ячейки входящей в формулу.
        noneFormat:-2
    };
    this.numFormat = this.formatType.noneFormat;

}
cACCRINT.prototype = Object.create( cBaseFunction.prototype );
cACCRINT.prototype.Calculate = function ( arg ) {
    var arg0 = arg[0], arg1 = arg[1],
        arg2 = arg[2], arg3 = arg[3],
        arg4 = arg[4] && !(arg[4] instanceof CEmpty) ? arg[4] : new CNumber( 1000 ),
        arg5 = arg[5],
        arg6 = arg[6] && !(arg[6] instanceof CEmpty) ? arg[6] : new CNumber( 0 );

    if ( arg0 instanceof CArea || arg0 instanceof CArea3D ) {
        arg0 = arg0.cross( arguments[1].first );
    }
    else if ( arg0 instanceof CArray ) {
        arg0 = arg0.getElementRowCol( 0, 0 );
    }

    if ( arg1 instanceof CArea || arg1 instanceof CArea3D ) {
        arg1 = arg1.cross( arguments[1].first );
    }
    else if ( arg1 instanceof CArray ) {
        arg1 = arg1.getElementRowCol( 0, 0 );
    }

    if ( arg2 instanceof CArea || arg2 instanceof CArea3D ) {
        arg2 = arg2.cross( arguments[1].first );
    }
    else if ( arg2 instanceof CArray ) {
        arg2 = arg2.getElementRowCol( 0, 0 );
    }

    if ( arg3 instanceof CArea || arg3 instanceof CArea3D ) {
        arg3 = arg3.cross( arguments[1].first );
    }
    else if ( arg3 instanceof CArray ) {
        arg3 = arg3.getElementRowCol( 0, 0 );
    }

    if ( arg4 instanceof CArea || arg4 instanceof CArea3D ) {
        arg4 = arg4.cross( arguments[1].first );
    }
    else if ( arg4 instanceof CArray ) {
        arg4 = arg4.getElementRowCol( 0, 0 );
    }

    if ( arg5 instanceof CArea || arg5 instanceof CArea3D ) {
        arg5 = arg5.cross( arguments[1].first );
    }
    else if ( arg5 instanceof CArray ) {
        arg5 = arg5.getElementRowCol( 0, 0 );
    }

    if ( arg6 instanceof CArea || arg6 instanceof CArea3D ) {
        arg6 = arg6.cross( arguments[1].first );
    }
    else if ( arg6 instanceof CArray ) {
        arg6 = arg6.getElementRowCol( 0, 0 );
    }

    arg0 = arg0.tocNumber();
    arg1 = arg1.tocNumber();
    arg2 = arg2.tocNumber();
    arg3 = arg3.tocNumber();
    arg4 = arg4.tocNumber();
    arg5 = arg5.tocNumber();
    arg6 = arg6.tocNumber();

    if ( arg0 instanceof CError ) return this.value = arg0;
    if ( arg1 instanceof CError ) return this.value = arg1;
    if ( arg2 instanceof CError ) return this.value = arg2;
    if ( arg3 instanceof CError ) return this.value = arg3;
    if ( arg4 instanceof CError ) return this.value = arg4;
    if ( arg5 instanceof CError ) return this.value = arg5;
    if ( arg6 instanceof CError ) return this.value = arg6;

    var _arg5 = arg5.getValue();

    if ( arg0.getValue() >= arg2.getValue() || arg3.getValue() <= 0 || arg4.getValue() <= 0 || arg6.getValue() < 0 || arg6.getValue() > 4 || (_arg5 != 1 && _arg5 != 2 && _arg5 != 4) ) {
        return this.value = new CError( cErrorType.not_numeric );
    }

    var res = yearFrac( Date.prototype.getDateFromExcel( arg0.getValue() ), Date.prototype.getDateFromExcel( arg2.getValue() ), arg6.getValue() );

    res *= arg4.getValue() * arg3.getValue();

    return this.value = new CNumber( res );
};
cACCRINT.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( issue , first-interest , settlement , rate , [ par ] , frequency [ , [ basis ] ] )"
    };
};

function cACCRINTM() {
//    cBaseFunction.call( this, "ACCRINTM" );

    this.name = "ACCRINTM";
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
cACCRINTM.prototype = Object.create( cBaseFunction.prototype );
cACCRINTM.prototype.Calculate = function ( arg ) {
    var arg0 = arg[0],
        arg1 = arg[1],
        arg2 = arg[2],
        arg3 = arg[3] && !(arg[3] instanceof CEmpty) ? arg[3] : new CNumber( 1000 ),
        arg4 = arg[4] && !(arg[4] instanceof CEmpty) ? arg[4] : new CNumber( 0 );

    if ( arg0 instanceof CArea || arg0 instanceof CArea3D ) {
        arg0 = arg0.cross( arguments[1].first );
    }
    else if ( arg0 instanceof CArray ) {
        arg0 = arg0.getElementRowCol( 0, 0 );
    }

    if ( arg1 instanceof CArea || arg1 instanceof CArea3D ) {
        arg1 = arg1.cross( arguments[1].first );
    }
    else if ( arg1 instanceof CArray ) {
        arg1 = arg1.getElementRowCol( 0, 0 );
    }

    if ( arg2 instanceof CArea || arg2 instanceof CArea3D ) {
        arg2 = arg2.cross( arguments[1].first );
    }
    else if ( arg2 instanceof CArray ) {
        arg2 = arg2.getElementRowCol( 0, 0 );
    }

    if ( arg3 instanceof CArea || arg3 instanceof CArea3D ) {
        arg3 = arg3.cross( arguments[1].first );
    }
    else if ( arg3 instanceof CArray ) {
        arg3 = arg3.getElementRowCol( 0, 0 );
    }

    if ( arg4 instanceof CArea || arg4 instanceof CArea3D ) {
        arg4 = arg4.cross( arguments[1].first );
    }
    else if ( arg4 instanceof CArray ) {
        arg4 = arg4.getElementRowCol( 0, 0 );
    }

    arg0 = arg0.tocNumber();
    arg1 = arg1.tocNumber();
    arg2 = arg2.tocNumber();
    arg3 = arg3.tocNumber();
    arg4 = arg4.tocNumber();

    if ( arg0 instanceof CError ) return this.value = arg0;
    if ( arg1 instanceof CError ) return this.value = arg1;
    if ( arg2 instanceof CError ) return this.value = arg2;
    if ( arg3 instanceof CError ) return this.value = arg3;
    if ( arg4 instanceof CError ) return this.value = arg4;

    if ( arg0.getValue() >= arg1.getValue() || arg3.getValue() <= 0 || arg4.getValue() < 0 || arg4.getValue() > 4 ) {
        return this.value = new CError( cErrorType.not_numeric );
    }

    var res = yearFrac( Date.prototype.getDateFromExcel( arg0.getValue() ), Date.prototype.getDateFromExcel( arg1.getValue() ), arg4.getValue() );

    res *= arg2.getValue() * arg3.getValue();

    return this.value = new CNumber( res )
};
cACCRINTM.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( issue , settlement , rate , [ [ par ] [ , [ basis ] ] ] )"
    };
};

function cAMORDEGRC() {
//    cBaseFunction.call( this, "AMORDEGRC" );

    this.name = "AMORDEGRC";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 6;
    this.argumentsCurrent = 0;
    this.argumentsMax = 7;
    this.formatType = {
        def:-1, //подразумевается формат первой ячейки входящей в формулу.
        noneFormat:-2
    };
    this.numFormat = this.formatType.noneFormat;

}
cAMORDEGRC.prototype = Object.create( cBaseFunction.prototype );
cAMORDEGRC.prototype.Calculate = function ( arg ) {
    var cost = arg[0],
        detePurch = arg[1],
        firstPer = arg[2],
        salvage = arg[3],
        period = arg[4],
        rate = arg[5],
        basis = arg[6] && !(arg[6] instanceof CEmpty) ? arg[6] : new CNumber( 0 );

    if ( cost instanceof CArea || cost instanceof CArea3D ) {
        cost = cost.cross( arguments[1].first );
    }
    else if ( cost instanceof CArray ) {
        cost = cost.getElementRowCol( 0, 0 );
    }

    if ( detePurch instanceof CArea || detePurch instanceof CArea3D ) {
        detePurch = detePurch.cross( arguments[1].first );
    }
    else if ( detePurch instanceof CArray ) {
        detePurch = detePurch.getElementRowCol( 0, 0 );
    }

    if ( firstPer instanceof CArea || firstPer instanceof CArea3D ) {
        firstPer = firstPer.cross( arguments[1].first );
    }
    else if ( firstPer instanceof CArray ) {
        firstPer = firstPer.getElementRowCol( 0, 0 );
    }

    if ( salvage instanceof CArea || salvage instanceof CArea3D ) {
        salvage = salvage.cross( arguments[1].first );
    }
    else if ( salvage instanceof CArray ) {
        salvage = salvage.getElementRowCol( 0, 0 );
    }

    if ( period instanceof CArea || period instanceof CArea3D ) {
        period = period.cross( arguments[1].first );
    }
    else if ( period instanceof CArray ) {
        period = period.getElementRowCol( 0, 0 );
    }

    if ( rate instanceof CArea || rate instanceof CArea3D ) {
        rate = rate.cross( arguments[1].first );
    }
    else if ( rate instanceof CArray ) {
        rate = rate.getElementRowCol( 0, 0 );
    }

    if ( basis instanceof CArea || basis instanceof CArea3D ) {
        basis = basis.cross( arguments[1].first );
    }
    else if ( basis instanceof CArray ) {
        basis = basis.getElementRowCol( 0, 0 );
    }

    cost = cost.tocNumber();
    detePurch = detePurch.tocNumber();
    firstPer = firstPer.tocNumber();
    salvage = salvage.tocNumber();
    period = period.tocNumber();
    rate = rate.tocNumber();
    basis = basis.tocNumber();

    if ( cost instanceof CError ) return this.value = cost;
    if ( detePurch instanceof CError ) return this.value = detePurch;
    if ( firstPer instanceof CError ) return this.value = firstPer;
    if ( salvage instanceof CError ) return this.value = salvage;
    if ( period instanceof CError ) return this.value = period;
    if ( rate instanceof CError ) return this.value = rate;
    if ( basis instanceof CError ) return this.value = basis;

    var fRate = rate.getValue(),
        fCost = cost.getValue(),
        fRestVal = salvage.getValue(),
        nPer = period.getValue();

    var fUsePer = 1 / fRate,
        fAmorCoeff;

    if ( fUsePer < 3 )
        fAmorCoeff = 1;
    else if ( fUsePer < 5 )
        fAmorCoeff = 1.5;
    else if ( fUsePer <= 6 )
        fAmorCoeff = 2;
    else
        fAmorCoeff = 2.5;

    fRate *= fAmorCoeff;

    var val0 = Date.prototype.getDateFromExcel( detePurch.getValue() );
    var val1 = Date.prototype.getDateFromExcel( firstPer.getValue() );


    var fNRate = Math.round( yearFrac( val0, val1, basis.getValue() ) * fRate * fCost );
    fCost -= fNRate;
    var fRest = fCost - fRestVal;

    for ( var n = 0; n < nPer; n++ ) {
        fNRate = Math.round( fRate * fCost );
        fRest -= fNRate;

        if ( fRest < 0 ) {
            switch ( nPer - n ) {
                case 0:
                case 1:
                    return this.value = new CNumber( Math.round( fCost * 0.5 ) );
                default:
                    return this.value = new CNumber( 0 );
            }
        }

        fCost -= fNRate;
    }

    return this.value = new CNumber( fNRate )

};
cAMORDEGRC.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( cost , date-purchased , first-period , salvage , period , rate [ , [ basis ] ] )"
    };
};

function cAMORLINC() {
//    cBaseFunction.call( this, "AMORLINC" );

    this.name = "AMORLINC";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 6;
    this.argumentsCurrent = 0;
    this.argumentsMax = 7;
    this.formatType = {
        def:-1, //подразумевается формат первой ячейки входящей в формулу.
        noneFormat:-2
    };
    this.numFormat = this.formatType.noneFormat;

}
cAMORLINC.prototype = Object.create( cBaseFunction.prototype );
cAMORLINC.prototype.Calculate = function ( arg ) {
    var cost = arg[0],
        detePurch = arg[1],
        firstPer = arg[2],
        salvage = arg[3],
        period = arg[4],
        rate = arg[5],
        basis = arg[6] && !(arg[6] instanceof CEmpty) ? arg[6] : new CNumber( 0 );

    if ( cost instanceof CArea || cost instanceof CArea3D ) {
        cost = cost.cross( arguments[1].first );
    }
    else if ( cost instanceof CArray ) {
        cost = cost.getElementRowCol( 0, 0 );
    }

    if ( detePurch instanceof CArea || detePurch instanceof CArea3D ) {
        detePurch = detePurch.cross( arguments[1].first );
    }
    else if ( detePurch instanceof CArray ) {
        detePurch = detePurch.getElementRowCol( 0, 0 );
    }

    if ( firstPer instanceof CArea || firstPer instanceof CArea3D ) {
        firstPer = firstPer.cross( arguments[1].first );
    }
    else if ( firstPer instanceof CArray ) {
        firstPer = firstPer.getElementRowCol( 0, 0 );
    }

    if ( salvage instanceof CArea || salvage instanceof CArea3D ) {
        salvage = salvage.cross( arguments[1].first );
    }
    else if ( salvage instanceof CArray ) {
        salvage = salvage.getElementRowCol( 0, 0 );
    }

    if ( period instanceof CArea || period instanceof CArea3D ) {
        period = period.cross( arguments[1].first );
    }
    else if ( period instanceof CArray ) {
        period = period.getElementRowCol( 0, 0 );
    }

    if ( rate instanceof CArea || rate instanceof CArea3D ) {
        rate = rate.cross( arguments[1].first );
    }
    else if ( rate instanceof CArray ) {
        rate = rate.getElementRowCol( 0, 0 );
    }

    if ( basis instanceof CArea || basis instanceof CArea3D ) {
        basis = basis.cross( arguments[1].first );
    }
    else if ( basis instanceof CArray ) {
        basis = basis.getElementRowCol( 0, 0 );
    }

    cost = cost.tocNumber();
    detePurch = detePurch.tocNumber();
    firstPer = firstPer.tocNumber();
    salvage = salvage.tocNumber();
    period = period.tocNumber();
    rate = rate.tocNumber();
    basis = basis.tocNumber();

    if ( cost instanceof CError ) return this.value = cost;
    if ( detePurch instanceof CError ) return this.value = detePurch;
    if ( firstPer instanceof CError ) return this.value = firstPer;
    if ( salvage instanceof CError ) return this.value = salvage;
    if ( period instanceof CError ) return this.value = period;
    if ( rate instanceof CError ) return this.value = rate;
    if ( basis instanceof CError ) return this.value = basis;

    var fRate = rate.getValue(),
        fCost = cost.getValue(),
        fRestVal = salvage.getValue(),
        nPer = period.getValue();


    var val0 = Date.prototype.getDateFromExcel( detePurch.getValue() );
    var val1 = Date.prototype.getDateFromExcel( firstPer.getValue() );
    var fOneRate = fCost * fRate,
        fCostDelta = fCost - fRestVal;

    var f0Rate = yearFrac( val0, val1, basis.getValue() ) * fRate * fCost;

    var nNumOfFullPeriods = ( fCost - fRestVal - f0Rate) / fOneRate;

    if ( nPer == 0 )
        return this.value = new CNumber( f0Rate );
    else if ( nPer <= nNumOfFullPeriods )
        return this.value = new CNumber( fOneRate );
    else if ( nPer == nNumOfFullPeriods + 1 )
        return this.value = new CNumber( fCostDelta - fOneRate * nNumOfFullPeriods - f0Rate );
    else
        return this.value = new CNumber( 0 );

};
cAMORLINC.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( cost , date-purchased , first-period , salvage , period , rate [ , [ basis ] ] )"
    };
};

function cCOUPDAYBS() {
//    cBaseFunction.call( this, "COUPDAYBS" );

    this.name = "COUPDAYBS";
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
cCOUPDAYBS.prototype = Object.create( cBaseFunction.prototype );
cCOUPDAYBS.prototype.Calculate = function ( arg ) {
    var settlement = arg[0],
        maturity = arg[1],
        frequency = arg[2],
        basis = arg[3] && !(arg[3] instanceof CEmpty) ? arg[3] : new CNumber( 0 );

    if ( settlement instanceof CArea || settlement instanceof CArea3D ) {
        settlement = settlement.cross( arguments[1].first );
    }
    else if ( settlement instanceof CArray ) {
        settlement = settlement.getElementRowCol( 0, 0 );
    }

    if ( maturity instanceof CArea || maturity instanceof CArea3D ) {
        maturity = maturity.cross( arguments[1].first );
    }
    else if ( maturity instanceof CArray ) {
        maturity = maturity.getElementRowCol( 0, 0 );
    }

    if ( frequency instanceof CArea || frequency instanceof CArea3D ) {
        frequency = frequency.cross( arguments[1].first );
    }
    else if ( frequency instanceof CArray ) {
        frequency = frequency.getElementRowCol( 0, 0 );
    }

    if ( basis instanceof CArea || basis instanceof CArea3D ) {
        basis = basis.cross( arguments[1].first );
    }
    else if ( basis instanceof CArray ) {
        basis = basis.getElementRowCol( 0, 0 );
    }

    settlement = settlement.tocNumber();
    maturity = maturity.tocNumber();
    frequency = frequency.tocNumber();
    basis = basis.tocNumber();

    if ( settlement instanceof CError ) return this.value = settlement;
    if ( maturity instanceof CError ) return this.value = maturity;
    if ( frequency instanceof CError ) return this.value = frequency;
    if ( basis instanceof CError ) return this.value = basis;

    if ( settlement.getValue() >= maturity.getValue() || basis.getValue() < 0 || basis.getValue() > 4 || ( frequency.getValue() != 1 && frequency.getValue() != 2 && frequency.getValue() != 4 ) )
        return this.value = new CError( cErrorType.not_numeric );

    var settl = Date.prototype.getDateFromExcel( settlement.getValue() ),
        matur = Date.prototype.getDateFromExcel( maturity.getValue() );

    return this.value = new CNumber( getcoupdaybs( settl, matur, frequency.getValue(), basis.getValue() ) );

};
cCOUPDAYBS.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( settlement , maturity , frequency [ , [ basis ] ] )"
    };
};

function cCOUPDAYS() {
//    cBaseFunction.call( this, "COUPDAYS" );

    this.name = "COUPDAYS";
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
cCOUPDAYS.prototype = Object.create( cBaseFunction.prototype );
cCOUPDAYS.prototype.Calculate = function ( arg ) {
    var settlement = arg[0],
        maturity = arg[1],
        frequency = arg[2],
        basis = arg[3] && !(arg[3] instanceof CEmpty) ? arg[3] : new CNumber( 0 );

    if ( settlement instanceof CArea || settlement instanceof CArea3D ) {
        settlement = settlement.cross( arguments[1].first );
    }
    else if ( settlement instanceof CArray ) {
        settlement = settlement.getElementRowCol( 0, 0 );
    }

    if ( maturity instanceof CArea || maturity instanceof CArea3D ) {
        maturity = maturity.cross( arguments[1].first );
    }
    else if ( maturity instanceof CArray ) {
        maturity = maturity.getElementRowCol( 0, 0 );
    }

    if ( frequency instanceof CArea || frequency instanceof CArea3D ) {
        frequency = frequency.cross( arguments[1].first );
    }
    else if ( frequency instanceof CArray ) {
        frequency = frequency.getElementRowCol( 0, 0 );
    }

    if ( basis instanceof CArea || basis instanceof CArea3D ) {
        basis = basis.cross( arguments[1].first );
    }
    else if ( basis instanceof CArray ) {
        basis = basis.getElementRowCol( 0, 0 );
    }

    settlement = settlement.tocNumber();
    maturity = maturity.tocNumber();
    frequency = frequency.tocNumber();
    basis = basis.tocNumber();

    if ( settlement instanceof CError ) return this.value = settlement;
    if ( maturity instanceof CError ) return this.value = maturity;
    if ( frequency instanceof CError ) return this.value = frequency;
    if ( basis instanceof CError ) return this.value = basis;

    if ( settlement.getValue() >= maturity.getValue() || basis.getValue() < 0 || basis.getValue() > 4 || ( frequency.getValue() != 1 && frequency.getValue() != 2 && frequency.getValue() != 4 ) )
        return this.value = new CError( cErrorType.not_numeric );

    var settl = Date.prototype.getDateFromExcel( settlement.getValue() ),
        matur = Date.prototype.getDateFromExcel( maturity.getValue() );

    return this.value = new CNumber( getcoupdays( settl, matur, frequency.getValue(), basis.getValue() ) );

};
cCOUPDAYS.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( settlement , maturity , frequency [ , [ basis ] ] )"
    };
};

function cCOUPDAYSNC() {
//    cBaseFunction.call( this, "COUPDAYSNC" );

    this.name = "COUPDAYSNC";
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
cCOUPDAYSNC.prototype = Object.create( cBaseFunction.prototype );
cCOUPDAYSNC.prototype.Calculate = function ( arg ) {
    var settlement = arg[0],
        maturity = arg[1],
        frequency = arg[2],
        basis = arg[3] && !(arg[3] instanceof CEmpty) ? arg[3] : new CNumber( 0 );

    if ( settlement instanceof CArea || settlement instanceof CArea3D ) {
        settlement = settlement.cross( arguments[1].first );
    }
    else if ( settlement instanceof CArray ) {
        settlement = settlement.getElementRowCol( 0, 0 );
    }

    if ( maturity instanceof CArea || maturity instanceof CArea3D ) {
        maturity = maturity.cross( arguments[1].first );
    }
    else if ( maturity instanceof CArray ) {
        maturity = maturity.getElementRowCol( 0, 0 );
    }

    if ( frequency instanceof CArea || frequency instanceof CArea3D ) {
        frequency = frequency.cross( arguments[1].first );
    }
    else if ( frequency instanceof CArray ) {
        frequency = frequency.getElementRowCol( 0, 0 );
    }

    if ( basis instanceof CArea || basis instanceof CArea3D ) {
        basis = basis.cross( arguments[1].first );
    }
    else if ( basis instanceof CArray ) {
        basis = basis.getElementRowCol( 0, 0 );
    }

    settlement = settlement.tocNumber();
    maturity = maturity.tocNumber();
    frequency = frequency.tocNumber();
    basis = basis.tocNumber();

    if ( settlement instanceof CError ) return this.value = settlement;
    if ( maturity instanceof CError ) return this.value = maturity;
    if ( frequency instanceof CError ) return this.value = frequency;
    if ( basis instanceof CError ) return this.value = basis;

    if ( settlement.getValue() >= maturity.getValue() || basis.getValue() < 0 || basis.getValue() > 4 || ( frequency.getValue() != 1 && frequency.getValue() != 2 && frequency.getValue() != 4 ) )
        return this.value = new CError( cErrorType.not_numeric );

    var settl = Date.prototype.getDateFromExcel( settlement.getValue() ),
        matur = Date.prototype.getDateFromExcel( maturity.getValue() );

    frequency = frequency.getValue();
    basis = basis.getValue();

    return this.value = new CNumber( getcoupdaysnc( new Date( settl ), new Date( matur ), frequency, basis ) );

};
cCOUPDAYSNC.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( settlement , maturity , frequency [ , [ basis ] ] )"
    };
};

function cCOUPNCD() {
//    cBaseFunction.call( this, "COUPNCD" );

    this.name = "COUPNCD";
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
cCOUPNCD.prototype = Object.create( cBaseFunction.prototype );
cCOUPNCD.prototype.Calculate = function ( arg ) {
    var settlement = arg[0],
        maturity = arg[1],
        frequency = arg[2],
        basis = arg[3] && !(arg[3] instanceof CEmpty) ? arg[3] : new CNumber( 0 );

    if ( settlement instanceof CArea || settlement instanceof CArea3D ) {
        settlement = settlement.cross( arguments[1].first );
    }
    else if ( settlement instanceof CArray ) {
        settlement = settlement.getElementRowCol( 0, 0 );
    }

    if ( maturity instanceof CArea || maturity instanceof CArea3D ) {
        maturity = maturity.cross( arguments[1].first );
    }
    else if ( maturity instanceof CArray ) {
        maturity = maturity.getElementRowCol( 0, 0 );
    }

    if ( frequency instanceof CArea || frequency instanceof CArea3D ) {
        frequency = frequency.cross( arguments[1].first );
    }
    else if ( frequency instanceof CArray ) {
        frequency = frequency.getElementRowCol( 0, 0 );
    }

    if ( basis instanceof CArea || basis instanceof CArea3D ) {
        basis = basis.cross( arguments[1].first );
    }
    else if ( basis instanceof CArray ) {
        basis = basis.getElementRowCol( 0, 0 );
    }

    settlement = settlement.tocNumber();
    maturity = maturity.tocNumber();
    frequency = frequency.tocNumber();
    basis = basis.tocNumber();

    if ( settlement instanceof CError ) return this.value = settlement;
    if ( maturity instanceof CError ) return this.value = maturity;
    if ( frequency instanceof CError ) return this.value = frequency;
    if ( basis instanceof CError ) return this.value = basis;

    if ( settlement.getValue() >= maturity.getValue() || basis.getValue() < 0 || basis.getValue() > 4 || ( frequency.getValue() != 1 && frequency.getValue() != 2 && frequency.getValue() != 4 ) )
        return this.value = new CError( cErrorType.not_numeric );

    var settl = Date.prototype.getDateFromExcel( settlement.getValue() ),
        matur = Date.prototype.getDateFromExcel( maturity.getValue() );

    frequency = frequency.getValue();

    lcl_GetCoupncd( settl, matur, frequency );
    this.value = new CNumber( matur.getExcelDate() );
    this.value.numFormat = 14;
    return this.value;

};
cCOUPNCD.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( settlement , maturity , frequency [ , [ basis ] ] )"
    };
};

function cCOUPNUM() {
//    cBaseFunction.call( this, "COUPNUM" );

    this.name = "COUPNUM";
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
cCOUPNUM.prototype = Object.create( cBaseFunction.prototype );
cCOUPNUM.prototype.Calculate = function ( arg ) {
    var settlement = arg[0],
        maturity = arg[1],
        frequency = arg[2],
        basis = arg[3] && !(arg[3] instanceof CEmpty) ? arg[3] : new CNumber( 0 );

    if ( settlement instanceof CArea || settlement instanceof CArea3D ) {
        settlement = settlement.cross( arguments[1].first );
    }
    else if ( settlement instanceof CArray ) {
        settlement = settlement.getElementRowCol( 0, 0 );
    }

    if ( maturity instanceof CArea || maturity instanceof CArea3D ) {
        maturity = maturity.cross( arguments[1].first );
    }
    else if ( maturity instanceof CArray ) {
        maturity = maturity.getElementRowCol( 0, 0 );
    }

    if ( frequency instanceof CArea || frequency instanceof CArea3D ) {
        frequency = frequency.cross( arguments[1].first );
    }
    else if ( frequency instanceof CArray ) {
        frequency = frequency.getElementRowCol( 0, 0 );
    }

    if ( basis instanceof CArea || basis instanceof CArea3D ) {
        basis = basis.cross( arguments[1].first );
    }
    else if ( basis instanceof CArray ) {
        basis = basis.getElementRowCol( 0, 0 );
    }

    settlement = settlement.tocNumber();
    maturity = maturity.tocNumber();
    frequency = frequency.tocNumber();
    basis = basis.tocNumber();

    if ( settlement instanceof CError ) return this.value = settlement;
    if ( maturity instanceof CError ) return this.value = maturity;
    if ( frequency instanceof CError ) return this.value = frequency;
    if ( basis instanceof CError ) return this.value = basis;

    if ( settlement.getValue() >= maturity.getValue() || basis.getValue() < 0 || basis.getValue() > 4 || ( frequency.getValue() != 1 && frequency.getValue() != 2 && frequency.getValue() != 4 ) )
        return this.value = new CError( cErrorType.not_numeric );

    var settl = Date.prototype.getDateFromExcel( settlement.getValue() ),
        matur = Date.prototype.getDateFromExcel( maturity.getValue() );

    frequency = frequency.getValue();

    var res = getcoupnum( settl, matur, frequency );

    return this.value = new CNumber( res );

};
cCOUPNUM.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( settlement , maturity , frequency [ , [ basis ] ] )"
    };
};

function cCOUPPCD() {
//    cBaseFunction.call( this, "COUPPCD" );

    this.name = "COUPPCD";
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
cCOUPPCD.prototype = Object.create( cBaseFunction.prototype );
cCOUPPCD.prototype.Calculate = function ( arg ) {
    var settlement = arg[0],
        maturity = arg[1],
        frequency = arg[2],
        basis = arg[3] && !(arg[3] instanceof CEmpty) ? arg[3] : new CNumber( 0 );

    if ( settlement instanceof CArea || settlement instanceof CArea3D ) {
        settlement = settlement.cross( arguments[1].first );
    }
    else if ( settlement instanceof CArray ) {
        settlement = settlement.getElementRowCol( 0, 0 );
    }

    if ( maturity instanceof CArea || maturity instanceof CArea3D ) {
        maturity = maturity.cross( arguments[1].first );
    }
    else if ( maturity instanceof CArray ) {
        maturity = maturity.getElementRowCol( 0, 0 );
    }

    if ( frequency instanceof CArea || frequency instanceof CArea3D ) {
        frequency = frequency.cross( arguments[1].first );
    }
    else if ( frequency instanceof CArray ) {
        frequency = frequency.getElementRowCol( 0, 0 );
    }

    if ( basis instanceof CArea || basis instanceof CArea3D ) {
        basis = basis.cross( arguments[1].first );
    }
    else if ( basis instanceof CArray ) {
        basis = basis.getElementRowCol( 0, 0 );
    }

    settlement = settlement.tocNumber();
    maturity = maturity.tocNumber();
    frequency = frequency.tocNumber();
    basis = basis.tocNumber();

    if ( settlement instanceof CError ) return this.value = settlement;
    if ( maturity instanceof CError ) return this.value = maturity;
    if ( frequency instanceof CError ) return this.value = frequency;
    if ( basis instanceof CError ) return this.value = basis;

    if ( settlement.getValue() >= maturity.getValue() || basis.getValue() < 0 || basis.getValue() > 4 || ( frequency.getValue() != 1 && frequency.getValue() != 2 && frequency.getValue() != 4 ) )
        return this.value = new CError( cErrorType.not_numeric );

    var settl = Date.prototype.getDateFromExcel( settlement.getValue() ),
        matur = Date.prototype.getDateFromExcel( maturity.getValue() );

    frequency = frequency.getValue();

    var n = lcl_GetCouppcd( settl, matur, frequency );

    this.value = new CNumber( n.getExcelDate() );
    this.value.numFormat = 14;
    return this.value;

};
cCOUPPCD.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( settlement , maturity , frequency [ , [ basis ] ] )"
    };
};

function cCUMIPMT() {
//    cBaseFunction.call( this, "CUMIPMT" );

    this.name = "CUMIPMT";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 6;
    this.argumentsCurrent = 0;
    this.argumentsMax = 6;
    this.formatType = {
        def:-1, //подразумевается формат первой ячейки входящей в формулу.
        noneFormat:-2
    };
    this.numFormat = this.formatType.noneFormat;

}
cCUMIPMT.prototype = Object.create( cBaseFunction.prototype );
cCUMIPMT.prototype.Calculate = function ( arg ) {
    var rate = arg[0],
        nper = arg[1],
        pv = arg[2],
        startPeriod = arg[3],
        endPeriod = arg[4],
        type = arg[5];

    if ( rate instanceof CArea || rate instanceof CArea3D ) {
        rate = rate.cross( arguments[1].first );
    }
    else if ( rate instanceof CArray ) {
        rate = rate.getElementRowCol( 0, 0 );
    }

    if ( nper instanceof CArea || nper instanceof CArea3D ) {
        nper = nper.cross( arguments[1].first );
    }
    else if ( nper instanceof CArray ) {
        nper = nper.getElementRowCol( 0, 0 );
    }

    if ( pv instanceof CArea || pv instanceof CArea3D ) {
        pv = pv.cross( arguments[1].first );
    }
    else if ( pv instanceof CArray ) {
        pv = pv.getElementRowCol( 0, 0 );
    }

    if ( startPeriod instanceof CArea || startPeriod instanceof CArea3D ) {
        startPeriod = startPeriod.cross( arguments[1].first );
    }
    else if ( startPeriod instanceof CArray ) {
        startPeriod = startPeriod.getElementRowCol( 0, 0 );
    }

    if ( endPeriod instanceof CArea || endPeriod instanceof CArea3D ) {
        endPeriod = endPeriod.cross( arguments[1].first );
    }
    else if ( endPeriod instanceof CArray ) {
        endPeriod = endPeriod.getElementRowCol( 0, 0 );
    }

    if ( type instanceof CArea || type instanceof CArea3D ) {
        type = type.cross( arguments[1].first );
    }
    else if ( type instanceof CArray ) {
        type = type.getElementRowCol( 0, 0 );
    }

    rate = rate.tocNumber();
    nper = nper.tocNumber();
    pv = pv.tocNumber();
    startPeriod = startPeriod.tocNumber();
    endPeriod = endPeriod.tocNumber();
    type = type.tocNumber();

    if ( rate instanceof CError ) return this.value = rate;
    if ( nper instanceof CError ) return this.value = nper;
    if ( pv instanceof CError ) return this.value = pv;
    if ( startPeriod instanceof CError ) return this.value = startPeriod;
    if ( endPeriod instanceof CError ) return this.value = endPeriod;
    if ( type instanceof CError ) return this.value = type;

    var fRate = rate.getValue(),
        nNumPeriods = nper.getValue(),
        fVal = pv.getValue(),
        nStartPer = startPeriod.getValue(),
        nEndPer = endPeriod.getValue(),
        nPayType = type.getValue(),
        fRmz, fZinsZ = 0;

    if ( nStartPer < 1 || nEndPer < nStartPer || fRate <= 0 || nEndPer > nNumPeriods || nNumPeriods <= 0 || fVal <= 0 || ( nPayType != 0 && nPayType != 1 ) )
        return this.value = new CError( cErrorType.not_numeric );

    fRmz = getPMT( fRate, nNumPeriods, fVal, 0, nPayType );

    if ( nStartPer == 1 ) {
        if ( nPayType <= 0 )
            fZinsZ = -fVal;

        nStartPer++;
    }

    for ( var i = nStartPer; i <= nEndPer; i++ ) {
        if ( nPayType > 0 )
            fZinsZ += getFV( fRate, i - 2, fRmz, fVal, 1 ) - fRmz;
        else
            fZinsZ += getFV( fRate, i - 1, fRmz, fVal, 0 );
    }

    fZinsZ *= fRate;

    return this.value = new CNumber( fZinsZ );

};
cCUMIPMT.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( rate , nper , pv , start-period , end-period , type )"
    };
};

function cCUMPRINC() {
//    cBaseFunction.call( this, "CUMPRINC" );

    this.name = "CUMPRINC";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 6;
    this.argumentsCurrent = 0;
    this.argumentsMax = 6;
    this.formatType = {
        def:-1, //подразумевается формат первой ячейки входящей в формулу.
        noneFormat:-2
    };
    this.numFormat = this.formatType.noneFormat;

}
cCUMPRINC.prototype = Object.create( cBaseFunction.prototype );
cCUMPRINC.prototype.Calculate = function ( arg ) {
    var rate = arg[0],
        nper = arg[1],
        pv = arg[2],
        startPeriod = arg[3],
        endPeriod = arg[4] && !(arg[4] instanceof CEmpty) ? arg[4] : new CNumber( 0 ),
        type = arg[5] && !(arg[5] instanceof CEmpty) ? arg[5] : new CNumber( 0 );

    if ( rate instanceof CArea || rate instanceof CArea3D ) {
        rate = rate.cross( arguments[1].first );
    }
    else if ( rate instanceof CArray ) {
        rate = rate.getElementRowCol( 0, 0 );
    }

    if ( nper instanceof CArea || nper instanceof CArea3D ) {
        nper = nper.cross( arguments[1].first );
    }
    else if ( nper instanceof CArray ) {
        nper = nper.getElementRowCol( 0, 0 );
    }

    if ( pv instanceof CArea || pv instanceof CArea3D ) {
        pv = pv.cross( arguments[1].first );
    }
    else if ( pv instanceof CArray ) {
        pv = pv.getElementRowCol( 0, 0 );
    }

    if ( startPeriod instanceof CArea || startPeriod instanceof CArea3D ) {
        startPeriod = startPeriod.cross( arguments[1].first );
    }
    else if ( startPeriod instanceof CArray ) {
        startPeriod = startPeriod.getElementRowCol( 0, 0 );
    }

    if ( endPeriod instanceof CArea || endPeriod instanceof CArea3D ) {
        endPeriod = endPeriod.cross( arguments[1].first );
    }
    else if ( endPeriod instanceof CArray ) {
        endPeriod = endPeriod.getElementRowCol( 0, 0 );
    }

    if ( type instanceof CArea || type instanceof CArea3D ) {
        type = type.cross( arguments[1].first );
    }
    else if ( type instanceof CArray ) {
        type = type.getElementRowCol( 0, 0 );
    }

    rate = rate.tocNumber();
    nper = nper.tocNumber();
    pv = pv.tocNumber();
    startPeriod = startPeriod.tocNumber();
    endPeriod = endPeriod.tocNumber();
    type = type.tocNumber();

    if ( rate instanceof CError ) return this.value = rate;
    if ( nper instanceof CError ) return this.value = nper;
    if ( pv instanceof CError ) return this.value = pv;
    if ( startPeriod instanceof CError ) return this.value = startPeriod;
    if ( endPeriod instanceof CError ) return this.value = endPeriod;
    if ( type instanceof CError ) return this.value = type;

    var fRate = rate.getValue(),
        nNumPeriods = nper.getValue(),
        fVal = pv.getValue(),
        nStartPer = startPeriod.getValue(),
        nEndPer = endPeriod.getValue(),
        nPayType = type.getValue(),
        fRmz, fKapZ;

    if ( nStartPer < 1 || nEndPer < nStartPer || nEndPer < 1 || fRate <= 0 || nNumPeriods <= 0 || fVal <= 0 || ( nPayType != 0 && nPayType != 1 ) )
        return this.value = new CError( cErrorType.not_numeric );

    fRmz = getPMT( fRate, nNumPeriods, fVal, 0, nPayType );

    fKapZ = 0;

    var nStart = nStartPer;

    if ( nStart == 1 ) {
        if ( nPayType <= 0 )
            fKapZ = fRmz + fVal * fRate;
        else
            fKapZ = fRmz;

        nStart++;
    }

    for ( var i = nStart; i <= nEndPer; i++ ) {
        if ( nPayType > 0 )
            fKapZ += fRmz - ( getFV( fRate, i - 2, fRmz, fVal, 1 ) - fRmz ) * fRate;
        else
            fKapZ += fRmz - getFV( fRate, i - 1, fRmz, fVal, 0 ) * fRate;
    }

    return this.value = new CNumber( fKapZ );

};
cCUMPRINC.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( rate , nper , pv , start-period , end-period , type )"
    };
};

function cDB() {
//    cBaseFunction.call( this, "DB" );

    this.name = "DB";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 4;
    this.argumentsCurrent = 0;
    this.argumentsMax = 5;
    this.formatType = {
        def:-1, //подразумевается формат первой ячейки входящей в формулу.
        noneFormat:-2
    };
    this.numFormat = this.formatType.noneFormat;

}
cDB.prototype = Object.create( cBaseFunction.prototype );
cDB.prototype.Calculate = function ( arg ) {
    var cost = arg[0],
        salvage = arg[1],
        life = arg[2],
        period = arg[3],
        month = arg[4] && !(arg[4] instanceof CEmpty) ? arg[4] : new CNumber( 12 );

    if ( cost instanceof CArea || cost instanceof CArea3D ) {
        cost = cost.cross( arguments[1].first );
    }
    else if ( cost instanceof CArray ) {
        cost = cost.getElementRowCol( 0, 0 );
    }

    if ( salvage instanceof CArea || salvage instanceof CArea3D ) {
        salvage = salvage.cross( arguments[1].first );
    }
    else if ( salvage instanceof CArray ) {
        salvage = salvage.getElementRowCol( 0, 0 );
    }

    if ( life instanceof CArea || life instanceof CArea3D ) {
        life = life.cross( arguments[1].first );
    }
    else if ( life instanceof CArray ) {
        life = life.getElementRowCol( 0, 0 );
    }

    if ( period instanceof CArea || period instanceof CArea3D ) {
        period = period.cross( arguments[1].first );
    }
    else if ( period instanceof CArray ) {
        period = period.getElementRowCol( 0, 0 );
    }

    if ( month instanceof CArea || month instanceof CArea3D ) {
        month = month.cross( arguments[1].first );
    }
    else if ( month instanceof CArray ) {
        month = month.getElementRowCol( 0, 0 );
    }

    cost = cost.tocNumber();
    salvage = salvage.tocNumber();
    life = life.tocNumber();
    period = period.tocNumber();
    month = month.tocNumber();

    if ( cost instanceof CError ) return this.value = cost;
    if ( salvage instanceof CError ) return this.value = salvage;
    if ( life instanceof CError ) return this.value = life;
    if ( period instanceof CError ) return this.value = period;
    if ( month instanceof CError ) return this.value = month;

    cost = cost.getValue();
    salvage = salvage.getValue();
    life = life.getValue();
    period = period.getValue();
    month = month.getValue();

    if ( month < 1 || month > 12 || salvage <= 0 || life < 0 || period < 0 || cost < 0 ) {
        return this.value = new CError( cErrorType.wrong_value_type );
    }
    var nAbRate = 1 - Math.pow( salvage / cost, 1 / life );
    nAbRate = Math.floor( (nAbRate * 1000) + 0.5 ) / 1000;
    var nErsteAbRate = cost * nAbRate * month / 12;

    var res = 0;
    if ( Math.floor( period ) == 1 )
        res = nErsteAbRate;
    else {
        var nSummAbRate = nErsteAbRate, nMin = life;
        if ( nMin > period ) nMin = period;
        var iMax = Math.floor( nMin );
        for ( var i = 2; i <= iMax; i++ ) {
            res = (cost - nSummAbRate) * nAbRate;
            nSummAbRate += res;
        }
        if ( period > life )
            res = ((cost - nSummAbRate) * nAbRate * (12 - month)) / 12;
    }

    this.value = new CNumber( res );
    return this.value;

};
cDB.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( cost , salvage , life , period [ , [ month ] ] )"
    };
};

function cDDB() {
//    cBaseFunction.call( this, "DDB" );

    this.name = "DDB";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 4;
    this.argumentsCurrent = 0;
    this.argumentsMax = 5;
    this.formatType = {
        def:-1, //подразумевается формат первой ячейки входящей в формулу.
        noneFormat:-2
    };
    this.numFormat = this.formatType.noneFormat;

}
cDDB.prototype = Object.create( cBaseFunction.prototype );
cDDB.prototype.Calculate = function ( arg ) {
    var cost = arg[0],
        salvage = arg[1],
        life = arg[2],
        period = arg[3],
        factor = arg[4] && !(arg[4] instanceof CEmpty) ? arg[4] : new CNumber( 2 );

    if ( cost instanceof CArea || cost instanceof CArea3D ) {
        cost = cost.cross( arguments[1].first );
    }
    else if ( cost instanceof CArray ) {
        cost = cost.getElementRowCol( 0, 0 );
    }

    if ( salvage instanceof CArea || salvage instanceof CArea3D ) {
        salvage = salvage.cross( arguments[1].first );
    }
    else if ( salvage instanceof CArray ) {
        salvage = salvage.getElementRowCol( 0, 0 );
    }

    if ( life instanceof CArea || life instanceof CArea3D ) {
        life = life.cross( arguments[1].first );
    }
    else if ( life instanceof CArray ) {
        life = life.getElementRowCol( 0, 0 );
    }

    if ( period instanceof CArea || period instanceof CArea3D ) {
        period = period.cross( arguments[1].first );
    }
    else if ( period instanceof CArray ) {
        period = period.getElementRowCol( 0, 0 );
    }

    if ( factor instanceof CArea || factor instanceof CArea3D ) {
        factor = factor.cross( arguments[1].first );
    }
    else if ( factor instanceof CArray ) {
        factor = factor.getElementRowCol( 0, 0 );
    }

    cost = cost.tocNumber();
    salvage = salvage.tocNumber();
    life = life.tocNumber();
    period = period.tocNumber();
    factor = factor.tocNumber();

    if ( cost instanceof CError ) return this.value = cost;
    if ( salvage instanceof CError ) return this.value = salvage;
    if ( life instanceof CError ) return this.value = life;
    if ( period instanceof CError ) return this.value = period;
    if ( factor instanceof CError ) return this.value = factor;

    cost = cost.getValue();
    salvage = salvage.getValue();
    life = life.getValue();
    period = period.getValue();
    factor = factor.getValue();

    if ( cost <= 0 || salvage < 0 || factor <= 0 || life <= 0 || period <= 0 ) {
        return this.value = new CError( cErrorType.wrong_value_type );
    }

    this.value = new CNumber( getDDB( cost, salvage, life, period, factor ) );
    return this.value;

};
cDDB.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( cost , salvage , life , period [ , factor ] )"
    };
};

function cDISC() {
//    cBaseFunction.call( this, "DISC" );

    this.name = "DISC";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 4;
    this.argumentsCurrent = 0;
    this.argumentsMax = 5;
    this.formatType = {
        def:-1, //подразумевается формат первой ячейки входящей в формулу.
        noneFormat:-2
    };
    this.numFormat = this.formatType.noneFormat;

}
cDISC.prototype = Object.create( cBaseFunction.prototype );
cDISC.prototype.Calculate = function ( arg ) {
    var settlement = arg[0],
        maturity = arg[1],
        pr = arg[2],
        redemption = arg[3],
        basis = arg[4] && !(arg[4] instanceof CEmpty) ? arg[4] : new CNumber( 0 );

    if ( settlement instanceof CArea || settlement instanceof CArea3D ) {
        settlement = settlement.cross( arguments[1].first );
    }
    else if ( settlement instanceof CArray ) {
        settlement = settlement.getElementRowCol( 0, 0 );
    }

    if ( maturity instanceof CArea || maturity instanceof CArea3D ) {
        maturity = maturity.cross( arguments[1].first );
    }
    else if ( maturity instanceof CArray ) {
        maturity = maturity.getElementRowCol( 0, 0 );
    }

    if ( pr instanceof CArea || pr instanceof CArea3D ) {
        pr = pr.cross( arguments[1].first );
    }
    else if ( pr instanceof CArray ) {
        pr = pr.getElementRowCol( 0, 0 );
    }

    if ( redemption instanceof CArea || redemption instanceof CArea3D ) {
        redemption = redemption.cross( arguments[1].first );
    }
    else if ( redemption instanceof CArray ) {
        redemption = redemption.getElementRowCol( 0, 0 );
    }

    if ( basis instanceof CArea || basis instanceof CArea3D ) {
        basis = basis.cross( arguments[1].first );
    }
    else if ( basis instanceof CArray ) {
        basis = basis.getElementRowCol( 0, 0 );
    }

    settlement = settlement.tocNumber();
    maturity = maturity.tocNumber();
    pr = pr.tocNumber();
    redemption = redemption.tocNumber();
    basis = basis.tocNumber();

    if ( settlement instanceof CError ) return this.value = settlement;
    if ( maturity instanceof CError ) return this.value = maturity;
    if ( pr instanceof CError ) return this.value = pr;
    if ( redemption instanceof CError ) return this.value = redemption;
    if ( basis instanceof CError ) return this.value = basis;

    if ( settlement.getValue() >= maturity.getValue() || pr.getValue() <= 0 || redemption.getValue() <= 0 || basis.getValue() < 0 || basis.getValue() > 4 )
        return this.value = new CError( cErrorType.not_numeric );

    var res = ( 1 - pr.getValue() / redemption.getValue() ) / yearFrac( Date.prototype.getDateFromExcel( settlement.getValue() ), Date.prototype.getDateFromExcel( maturity.getValue() ), basis.getValue() );

    this.value = new CNumber( res );
    this.value.numFormat = 9;
    return this.value;

};
cDISC.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( settlement , maturity , pr , redemption [ , [ basis ] ] )"
    };
};

function cDOLLARDE() {
//    cBaseFunction.call( this, "DOLLARDE" );

    this.name = "DOLLARDE";
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
cDOLLARDE.prototype = Object.create( cBaseFunction.prototype );
cDOLLARDE.prototype.Calculate = function ( arg ) {
    var fractionalDollar = arg[0],
        fraction = arg[1];

    if ( fractionalDollar instanceof CArea || fractionalDollar instanceof CArea3D ) {
        fractionalDollar = fractionalDollar.cross( arguments[1].first );
    }
    else if ( fractionalDollar instanceof CArray ) {
        fractionalDollar = fractionalDollar.getElementRowCol( 0, 0 );
    }

    if ( fraction instanceof CArea || fraction instanceof CArea3D ) {
        fraction = fraction.cross( arguments[1].first );
    }
    else if ( fraction instanceof CArray ) {
        fraction = fraction.getElementRowCol( 0, 0 );
    }

    fractionalDollar = fractionalDollar.tocNumber();
    fraction = fraction.tocNumber();

    if ( fractionalDollar instanceof CError ) return this.value = fractionalDollar;
    if ( fraction instanceof CError ) return this.value = fraction;

    fractionalDollar = fractionalDollar.getValue();
    fraction = fraction.getValue();

    if ( fraction < 0 )
        return this.value = new CError( cErrorType.not_numeric );
    else if ( fraction == 0 )
        return this.value = new CError( cErrorType.division_by_zero );

    var fInt = Math.floor( fractionalDollar ), res = fractionalDollar - fInt;

    res /= fraction;

    res *= Math.pow( 10, Math.ceil( Math.log10( fraction ) ) );

    res += fInt;

    return  this.value = new CNumber( res );

};
cDOLLARDE.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( fractional-dollar , fraction )"
    };
};

function cDOLLARFR() {
//    cBaseFunction.call( this, "DOLLARFR" );

    this.name = "DOLLARFR";
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
cDOLLARFR.prototype = Object.create( cBaseFunction.prototype );
cDOLLARFR.prototype.Calculate = function ( arg ) {
    var decimalDollar = arg[0],
        fraction = arg[1];

    if ( decimalDollar instanceof CArea || decimalDollar instanceof CArea3D ) {
        decimalDollar = decimalDollar.cross( arguments[1].first );
    }
    else if ( decimalDollar instanceof CArray ) {
        decimalDollar = decimalDollar.getElementRowCol( 0, 0 );
    }

    if ( fraction instanceof CArea || fraction instanceof CArea3D ) {
        fraction = fraction.cross( arguments[1].first );
    }
    else if ( fraction instanceof CArray ) {
        fraction = fraction.getElementRowCol( 0, 0 );
    }

    decimalDollar = decimalDollar.tocNumber();
    fraction = fraction.tocNumber();

    if ( decimalDollar instanceof CError ) return this.value = decimalDollar;
    if ( fraction instanceof CError ) return this.value = fraction;

    decimalDollar = decimalDollar.getValue();
    fraction = fraction.getValue();

    if ( fraction < 0 )
        return this.value = new CError( cErrorType.not_numeric );
    else if ( fraction == 0 )
        return this.value = new CError( cErrorType.division_by_zero );

    var fInt = Math.floor( decimalDollar ), res = decimalDollar - fInt;

    res *= fraction;

    res *= Math.pow( 10, -Math.ceil( Math.log10( fraction ) ) );

    res += fInt;

    return  this.value = new CNumber( res );

};
cDOLLARFR.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( decimal-dollar , fraction )"
    };
};

function cDURATION() {
//    cBaseFunction.call( this, "DURATION" );

    this.name = "DURATION";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 5;
    this.argumentsCurrent = 0;
    this.argumentsMax = 6;
    this.formatType = {
        def:-1, //подразумевается формат первой ячейки входящей в формулу.
        noneFormat:-2
    };
    this.numFormat = this.formatType.noneFormat;

}
cDURATION.prototype = Object.create( cBaseFunction.prototype );
cDURATION.prototype.Calculate = function ( arg ) {
    var settlement = arg[0],
        maturity = arg[1],
        coupon = arg[2],
        yld = arg[3],
        frequency = arg[4],
        basis = arg[5] && !(arg[5] instanceof CEmpty) ? arg[5] : new CNumber( 0 );

    if ( settlement instanceof CArea || settlement instanceof CArea3D ) {
        settlement = settlement.cross( arguments[1].first );
    }
    else if ( settlement instanceof CArray ) {
        settlement = settlement.getElementRowCol( 0, 0 );
    }

    if ( maturity instanceof CArea || maturity instanceof CArea3D ) {
        maturity = maturity.cross( arguments[1].first );
    }
    else if ( maturity instanceof CArray ) {
        maturity = maturity.getElementRowCol( 0, 0 );
    }

    if ( coupon instanceof CArea || coupon instanceof CArea3D ) {
        coupon = coupon.cross( arguments[1].first );
    }
    else if ( coupon instanceof CArray ) {
        coupon = coupon.getElementRowCol( 0, 0 );
    }

    if ( yld instanceof CArea || yld instanceof CArea3D ) {
        yld = yld.cross( arguments[1].first );
    }
    else if ( yld instanceof CArray ) {
        yld = yld.getElementRowCol( 0, 0 );
    }

    if ( frequency instanceof CArea || frequency instanceof CArea3D ) {
        frequency = frequency.cross( arguments[1].first );
    }
    else if ( frequency instanceof CArray ) {
        frequency = frequency.getElementRowCol( 0, 0 );
    }

    if ( basis instanceof CArea || basis instanceof CArea3D ) {
        basis = basis.cross( arguments[1].first );
    }
    else if ( basis instanceof CArray ) {
        basis = basis.getElementRowCol( 0, 0 );
    }

    settlement = settlement.tocNumber();
    maturity = maturity.tocNumber();
    coupon = coupon.tocNumber();
    yld = yld.tocNumber();
    frequency = frequency.tocNumber();
    basis = basis.tocNumber();

    if ( settlement instanceof CError ) return this.value = settlement;
    if ( maturity instanceof CError ) return this.value = maturity;
    if ( coupon instanceof CError ) return this.value = coupon;
    if ( yld instanceof CError ) return this.value = yld;
    if ( frequency instanceof CError ) return this.value = frequency;
    if ( basis instanceof CError ) return this.value = basis;

    if ( settlement.getValue() >= maturity.getValue() ||
        basis.getValue() < 0 || basis.getValue() > 4 ||
        ( frequency.getValue() != 1 && frequency.getValue() != 2 && frequency.getValue() != 4 ) ||
        yld.getValue() < 0 || coupon.getValue < 0 )
        return this.value = new CError( cErrorType.not_numeric );

    settlement = settlement.getValue();
    maturity = maturity.getValue();
    coupon = coupon.getValue();
    yld = yld.getValue();
    frequency = frequency.getValue();
    basis = basis.getValue();

    var settl = Date.prototype.getDateFromExcel( settlement ),
        matur = Date.prototype.getDateFromExcel( maturity );

    return this.value = new CNumber( getduration( settl, matur, coupon, yld, frequency, basis ) );

};
cDURATION.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( settlement , maturity , coupon , yld , frequency [ , [ basis ] ] )"
    };
};

function cEFFECT() {
//    cBaseFunction.call( this, "EFFECT" );

    this.name = "EFFECT";
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
cEFFECT.prototype = Object.create( cBaseFunction.prototype );
cEFFECT.prototype.Calculate = function ( arg ) {
    var nominalRate = arg[0], npery = arg[1];

    if ( nominalRate instanceof CArea || nominalRate instanceof CArea3D ) {
        nominalRate = nominalRate.cross( arguments[1].first );
    }
    else if ( nominalRate instanceof CArray ) {
        nominalRate = nominalRate.getElementRowCol( 0, 0 );
    }

    if ( npery instanceof CArea || npery instanceof CArea3D ) {
        npery = npery.cross( arguments[1].first );
    }
    else if ( npery instanceof CArray ) {
        npery = npery.getElementRowCol( 0, 0 );
    }

    nominalRate = nominalRate.tocNumber();
    npery = npery.tocNumber();

    if ( nominalRate instanceof CError ) return this.value = nominalRate;
    if ( npery instanceof CError ) return this.value = npery;

    var nr = nominalRate.getValue(), np = npery.getValue();
    if ( nominalRate.getValue() <= 0 || npery.getValue() < 1 ) {
        return this.value = new CError( cErrorType.not_numeric );
    }

    return this.value = new CNumber( Math.pow( (1 + nr / np), np ) - 1 );
};
cEFFECT.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( nominal-rate , npery )"
    };
};

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
cFV.prototype = Object.create( cBaseFunction.prototype );
cFV.prototype.Calculate = function ( arg ) {
    var rate = arg[0], nper = arg[1], pmt = arg[2], pv = arg[3] ? arg[3] : new CNumber( 0 ), type = arg[4] ? arg[4] : new CNumber( 0 );

    if ( rate instanceof CArea || rate instanceof CArea3D ) {
        rate = rate.cross( arguments[1].first );
    }
    else if ( rate instanceof CArray ) {
        rate = rate.getElementRowCol( 0, 0 );
    }

    if ( nper instanceof CArea || nper instanceof CArea3D ) {
        nper = nper.cross( arguments[1].first );
    }
    else if ( nper instanceof CArray ) {
        nper = nper.getElementRowCol( 0, 0 );
    }

    if ( pmt instanceof CArea || pmt instanceof CArea3D ) {
        pmt = pmt.cross( arguments[1].first );
    }
    else if ( pmt instanceof CArray ) {
        pmt = pmt.getElementRowCol( 0, 0 );
    }

    if ( pv instanceof CArea || pv instanceof CArea3D ) {
        pv = pv.cross( arguments[1].first );
    }
    else if ( pv instanceof CArray ) {
        pv = pv.getElementRowCol( 0, 0 );
    }

    if ( type instanceof CArea || type instanceof CArea3D ) {
        type = type.cross( arguments[1].first );
    }
    else if ( type instanceof CArray ) {
        type = type.getElementRowCol( 0, 0 );
    }

    rate = rate.tocNumber();
    nper = nper.tocNumber();
    pmt = pmt.tocNumber();
    pv = pv.tocNumber();
    type = type.tocNumber();

    if ( rate instanceof CError ) return this.value = rate;
    if ( nper instanceof CError ) return this.value = nper;
    if ( pmt instanceof CError ) return this.value = pmt;
    if ( pv instanceof CError ) return this.value = pv;
    if ( type instanceof CError ) return this.value = type;

    if ( type.getValue() != 1 && type.getValue() != 0 ) return this.value = new CError( cErrorType.not_numeric );

    var res;
    if ( rate.getValue() != 0 ) {
        res = -1 * ( pv.getValue() * Math.pow( 1 + rate.getValue(), nper.getValue() ) + pmt.getValue() * ( 1 + rate.getValue() * type.getValue() ) * (Math.pow( (1 + rate.getValue()), nper.getValue() ) - 1) / rate.getValue() );
    }
    else {
        res = -1 * ( pv.getValue() + pmt.getValue() * nper.getValue() );
    }

    return this.value = new CNumber( res );
};
cFV.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( rate , nper , pmt [ , [ pv ] [ ,[ type ] ] ] )"
    };
};

function cFVSCHEDULE() {
//    cBaseFunction.call( this, "FVSCHEDULE" );

    this.name = "FVSCHEDULE";
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
cFVSCHEDULE.prototype = Object.create( cBaseFunction.prototype );
cFVSCHEDULE.prototype.Calculate = function ( arg ) {
    var principal = arg[0],
        schedule = arg[1],
        shedList = [];

    if ( principal instanceof CArea || principal instanceof CArea3D ) {
        principal = principal.cross( arguments[1].first );
    }
    else if ( principal instanceof CArray ) {
        principal = principal.getElementRowCol( 0, 0 );
    }

    if ( schedule instanceof CArea || schedule instanceof CArea3D ) {
        schedule.foreach2( function ( v ) {
            shedList.push( v.tocNumber() );
        } )
    }
    else if ( schedule instanceof CArray ) {
        schedule.foreach( function ( v ) {
            shedList.push( v.tocNumber() );
        } )
    }
    else {
        shedList.push( schedule.tocNumber() )
    }

    principal = principal.tocNumber();

    if ( principal instanceof CError ) return this.value = principal;

    var princ = principal.getValue();

    for ( var i = 0; i < shedList.length; i++ ) {
        if ( shedList[i] instanceof CError ) {
            return this.value = new CError( cErrorType.wrong_value_type );
        }
        else {
            princ *= 1 + shedList[i].getValue();
        }
    }

    return this.value = new CNumber( princ );

};
cFVSCHEDULE.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( principal , schedule )"
    };
};

function cINTRATE() {
//    cBaseFunction.call( this, "INTRATE" );

    this.name = "INTRATE";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 4;
    this.argumentsCurrent = 0;
    this.argumentsMax = 5;
    this.formatType = {
        def:-1, //подразумевается формат первой ячейки входящей в формулу.
        noneFormat:-2
    };
    this.numFormat = this.formatType.noneFormat;


}
cINTRATE.prototype = Object.create( cBaseFunction.prototype );
cINTRATE.prototype.Calculate = function ( arg ) {
    var settlement = arg[0],
        maturity = arg[1],
        investment = arg[2],
        redemption = arg[3],
        basis = arg[4] && !(arg[4] instanceof CEmpty) ? arg[4] : new CNumber( 0 );

    if ( settlement instanceof CArea || settlement instanceof CArea3D ) {
        settlement = settlement.cross( arguments[1].first );
    }
    else if ( settlement instanceof CArray ) {
        settlement = settlement.getElementRowCol( 0, 0 );
    }

    if ( maturity instanceof CArea || maturity instanceof CArea3D ) {
        maturity = maturity.cross( arguments[1].first );
    }
    else if ( maturity instanceof CArray ) {
        maturity = maturity.getElementRowCol( 0, 0 );
    }

    if ( investment instanceof CArea || investment instanceof CArea3D ) {
        investment = investment.cross( arguments[1].first );
    }
    else if ( investment instanceof CArray ) {
        investment = investment.getElementRowCol( 0, 0 );
    }

    if ( redemption instanceof CArea || redemption instanceof CArea3D ) {
        redemption = redemption.cross( arguments[1].first );
    }
    else if ( redemption instanceof CArray ) {
        redemption = redemption.getElementRowCol( 0, 0 );
    }

    if ( basis instanceof CArea || basis instanceof CArea3D ) {
        basis = basis.cross( arguments[1].first );
    }
    else if ( basis instanceof CArray ) {
        basis = basis.getElementRowCol( 0, 0 );
    }

    settlement = settlement.tocNumber();
    maturity = maturity.tocNumber();
    investment = investment.tocNumber();
    redemption = redemption.tocNumber();
    basis = basis.tocNumber();

    if ( settlement instanceof CError ) return this.value = settlement;
    if ( maturity instanceof CError ) return this.value = maturity;
    if ( investment instanceof CError ) return this.value = investment;
    if ( redemption instanceof CError ) return this.value = redemption;
    if ( basis instanceof CError ) return this.value = basis;

    if ( settlement.getValue() >= maturity.getValue() || investment.getValue() <= 0 || redemption.getValue() <= 0 || basis.getValue() < 0 || basis.getValue() > 4 )
        return this.value = new CError( cErrorType.not_numeric );


    var res = ( ( redemption.getValue() / investment.getValue() ) - 1 ) / yearFrac( Date.prototype.getDateFromExcel( settlement.getValue() ), Date.prototype.getDateFromExcel( maturity.getValue() ), basis.getValue() );

    this.value = new CNumber( res );
    this.value.numFormat = 9;
    return this.value;

};
cINTRATE.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( settlement , maturity , pr , redemption [ , [ basis ] ] )"
    };
};

function cIPMT() {
//    cBaseFunction.call( this, "IPMT" );

    this.name = "IPMT";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 4;
    this.argumentsCurrent = 0;
    this.argumentsMax = 6;
    this.formatType = {
        def:-1, //подразумевается формат первой ячейки входящей в формулу.
        noneFormat:-2
    };
    this.numFormat = this.formatType.noneFormat;

}
cIPMT.prototype = Object.create( cBaseFunction.prototype );
cIPMT.prototype.Calculate = function ( arg ) {
    var rate = arg[0], per = arg[1], nper = arg[2], pv = arg[3], fv = arg[4] ? arg[4] : new CNumber( 0 ), type = arg[5] ? arg[5] : new CNumber( 0 );

    if ( rate instanceof CArea || rate instanceof CArea3D ) {
        rate = rate.cross( arguments[1].first );
    }
    else if ( rate instanceof CArray ) {
        rate = rate.getElementRowCol( 0, 0 );
    }

    if ( per instanceof CArea || per instanceof CArea3D ) {
        per = per.cross( arguments[1].first );
    }
    else if ( per instanceof CArray ) {
        per = per.getElementRowCol( 0, 0 );
    }

    if ( nper instanceof CArea || nper instanceof CArea3D ) {
        nper = nper.cross( arguments[1].first );
    }
    else if ( nper instanceof CArray ) {
        nper = nper.getElementRowCol( 0, 0 );
    }

    if ( pv instanceof CArea || pv instanceof CArea3D ) {
        pv = pv.cross( arguments[1].first );
    }
    else if ( pv instanceof CArray ) {
        pv = pv.getElementRowCol( 0, 0 );
    }

    if ( fv instanceof CArea || fv instanceof CArea3D ) {
        fv = fv.cross( arguments[1].first );
    }
    else if ( fv instanceof CArray ) {
        fv = fv.getElementRowCol( 0, 0 );
    }

    if ( type instanceof CArea || type instanceof CArea3D ) {
        type = type.cross( arguments[1].first );
    }
    else if ( type instanceof CArray ) {
        type = type.getElementRowCol( 0, 0 );
    }

    rate = rate.tocNumber();
    per = per.tocNumber();
    nper = nper.tocNumber();
    pv = pv.tocNumber();
    fv = fv.tocNumber();
    type = type.tocNumber();

    if ( rate instanceof CError ) return this.value = rate;
    if ( per instanceof CError ) return this.value = per;
    if ( nper instanceof CError ) return this.value = nper;
    if ( pv instanceof CError ) return this.value = pv;
    if ( fv instanceof CError ) return this.value = fv;
    if ( type instanceof CError ) return this.value = type;

    rate = rate.getValue();
    per = per.getValue();
    nper = nper.getValue();
    pv = pv.getValue();
    fv = fv.getValue();
    type = type.getValue();

    var res;

    if ( per < 1 || per > nper || type != 0 && type != 1 ) {
        return this.value = new CError( cErrorType.wrong_value_type );
    }

    res = getPMT( rate, nper, pv, fv, type );

    this.value = new CNumber( getIPMT( rate, per, pv, type, res ) );
//    this.value.numFormat = 9;
    return this.value;
};
cIPMT.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( rate , per , nper , pv [ , [ fv ] [ , [ type ] ] ] )"
    };
};

function cIRR() {
//    cBaseFunction.call( this, "IRR" );

    this.name = "IRR";
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
cIRR.prototype = Object.create( cBaseFunction.prototype );
cIRR.prototype.Calculate = function ( arg ) {
    var arg0 = arg[0], arg1 = arg[1] ? arg[1] : new CNumber( 0.1 );

    function irr( arr, x ) {
        x = x.getValue();

        var nC = 0, g_Eps = 1e-7, fEps = 1, fZ = 0, fN = 0, xN = 0, nIM = 100, nMC = 0, arr0 = arr[0], arrI, wasNegative = false, wasPositive = false;

        if ( arr0 instanceof CError ) {
            return new CError( cErrorType.not_available );
        }

        if ( arr0.getValue() < 0 )
            wasNegative = true;
        else if ( arr0.getValue() > 0 )
            wasPositive = true;
        if ( arr.length < 2 )
            return new CError( cErrorType.not_numeric );

        while ( fEps > g_Eps && nMC < nIM ) {
            nC = 0;
            fZ = 0;
            fN = 0;
            fZ += arr0.getValue() / Math.pow( 1 + x, nC );
            fN += -nC * arr0.getValue() / Math.pow( 1 + x, nC + 1 );
            nC++;
            for ( var i = 1; i < arr.length; i++ ) {
                if ( arr[i] instanceof CError ) {
                    return new CError( cErrorType.not_available );
                }
                arrI = arr[i].getValue();
                fZ += arrI / Math.pow( 1 + x, nC );
                fN += -nC * arrI / Math.pow( 1 + x, nC + 1 );
                if ( arrI < 0 )
                    wasNegative = true;
                else if ( arrI > 0 )
                    wasPositive = true;
                nC++
            }
            xN = x - fZ / fN;
            nMC++;
            fEps = Math.abs( xN - x );
            x = xN;
        }

        if ( !(wasNegative && wasPositive) )
            return new CError( cErrorType.not_numeric );

        if ( fEps < g_Eps )
            return new CNumber( x );
        else
            return new CError( cErrorType.not_numeric );
    }

    var arr = [];
    if ( arg0 instanceof CArray ) {
        arg0.foreach( function ( v ) {
            arr.push( v.tocNumber() )
        } )
    }
    else if ( arg0 instanceof CArea ) {
        arg0.foreach2( function ( v ) {
            arr.push( v.tocNumber() )
        } )
    }

    arg1 = arg1.tocNumber();

    if ( arg1 instanceof CError ) {
        return this.value = new CError( cErrorType.not_numeric );
    }
    this.value = irr( arr, arg1 );
    this.value.numFormat = 9;
    return this.value;

};
cIRR.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( values [ , [ guess ] ] )"
    };
};

function cISPMT() {
//    cBaseFunction.call( this, "ISPMT" );

    this.name = "ISPMT";
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
cISPMT.prototype = Object.create( cBaseFunction.prototype );
cISPMT.prototype.Calculate = function ( arg ) {
    var rate = arg[0], per = arg[1], nper = arg[2], pv = arg[3];

    if ( rate instanceof CArea || rate instanceof CArea3D ) {
        rate = rate.cross( arguments[1].first );
    }
    else if ( rate instanceof CArray ) {
        rate = rate.getElementRowCol( 0, 0 );
    }

    if ( per instanceof CArea || per instanceof CArea3D ) {
        per = per.cross( arguments[1].first );
    }
    else if ( per instanceof CArray ) {
        per = per.getElementRowCol( 0, 0 );
    }

    if ( nper instanceof CArea || nper instanceof CArea3D ) {
        nper = nper.cross( arguments[1].first );
    }
    else if ( nper instanceof CArray ) {
        nper = nper.getElementRowCol( 0, 0 );
    }

    if ( pv instanceof CArea || pv instanceof CArea3D ) {
        pv = pv.cross( arguments[1].first );
    }
    else if ( pv instanceof CArray ) {
        pv = pv.getElementRowCol( 0, 0 );
    }

    rate = rate.tocNumber();
    per = per.tocNumber();
    nper = nper.tocNumber();
    pv = pv.tocNumber();

    if ( rate instanceof CError ) return this.value = rate;
    if ( per instanceof CError ) return this.value = per;
    if ( nper instanceof CError ) return this.value = nper;
    if ( pv instanceof CError ) return this.value = pv;

    return this.value = new CNumber( pv.getValue() * rate.getValue() * (per.getValue() / nper.getValue() - 1) );
};
cISPMT.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( rate , per , nper , pv )"
    };
};

function cMDURATION() {
//    cBaseFunction.call( this, "MDURATION" );

    this.name = "MDURATION";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 5;
    this.argumentsCurrent = 0;
    this.argumentsMax = 6;
    this.formatType = {
        def:-1, //подразумевается формат первой ячейки входящей в формулу.
        noneFormat:-2
    };
    this.numFormat = this.formatType.noneFormat;

}
cMDURATION.prototype = Object.create( cBaseFunction.prototype );
cMDURATION.prototype.Calculate = function ( arg ) {
    var settlement = arg[0],
        maturity = arg[1],
        coupon = arg[2],
        yld = arg[3],
        frequency = arg[4],
        basis = arg[5] && !(arg[5] instanceof CEmpty) ? arg[5] : new CNumber( 0 );

    if ( settlement instanceof CArea || settlement instanceof CArea3D ) {
        settlement = settlement.cross( arguments[1].first );
    }
    else if ( settlement instanceof CArray ) {
        settlement = settlement.getElementRowCol( 0, 0 );
    }

    if ( maturity instanceof CArea || maturity instanceof CArea3D ) {
        maturity = maturity.cross( arguments[1].first );
    }
    else if ( maturity instanceof CArray ) {
        maturity = maturity.getElementRowCol( 0, 0 );
    }

    if ( coupon instanceof CArea || coupon instanceof CArea3D ) {
        coupon = coupon.cross( arguments[1].first );
    }
    else if ( coupon instanceof CArray ) {
        coupon = coupon.getElementRowCol( 0, 0 );
    }

    if ( yld instanceof CArea || yld instanceof CArea3D ) {
        yld = yld.cross( arguments[1].first );
    }
    else if ( yld instanceof CArray ) {
        yld = yld.getElementRowCol( 0, 0 );
    }

    if ( frequency instanceof CArea || frequency instanceof CArea3D ) {
        frequency = frequency.cross( arguments[1].first );
    }
    else if ( frequency instanceof CArray ) {
        frequency = frequency.getElementRowCol( 0, 0 );
    }

    if ( basis instanceof CArea || basis instanceof CArea3D ) {
        basis = basis.cross( arguments[1].first );
    }
    else if ( basis instanceof CArray ) {
        basis = basis.getElementRowCol( 0, 0 );
    }

    settlement = settlement.tocNumber();
    maturity = maturity.tocNumber();
    coupon = coupon.tocNumber();
    yld = yld.tocNumber();
    frequency = frequency.tocNumber();
    basis = basis.tocNumber();

    if ( settlement instanceof CError ) return this.value = settlement;
    if ( maturity instanceof CError ) return this.value = maturity;
    if ( coupon instanceof CError ) return this.value = coupon;
    if ( yld instanceof CError ) return this.value = yld;
    if ( frequency instanceof CError ) return this.value = frequency;
    if ( basis instanceof CError ) return this.value = basis;

    if ( settlement.getValue() >= maturity.getValue() ||
        basis.getValue() < 0 || basis.getValue() > 4 ||
        ( frequency.getValue() != 1 && frequency.getValue() != 2 && frequency.getValue() != 4 ) ||
        yld.getValue() < 0 || coupon.getValue < 0 )
        return this.value = new CError( cErrorType.not_numeric );

    settlement = settlement.getValue();
    maturity = maturity.getValue();
    coupon = coupon.getValue();
    yld = yld.getValue();
    frequency = frequency.getValue();
    basis = basis.getValue();

    var settl = Date.prototype.getDateFromExcel( settlement ),
        matur = Date.prototype.getDateFromExcel( maturity );

    var duration = getduration( settl, matur, coupon, yld, frequency, basis );

    duration /= 1 + yld / frequency;

    return this.value = new CNumber( duration );

};
cMDURATION.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( settlement , maturity , coupon , yld , frequency [ , [ basis ] ] )"
    };
};

function cMIRR() {
//    cBaseFunction.call( this, "MIRR" );

    this.name = "MIRR";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 3;
    this.argumentsCurrent = 0;
    this.argumentsMax = 3;
    this.formatType = {
        def:-1, //подразумевается формат первой ячейки входящей в формулу.
        noneFormat:-2
    };
    this.numFormat = this.formatType.noneFormat;

}
cMIRR.prototype = Object.create( cBaseFunction.prototype );
cMIRR.prototype.Calculate = function ( arg ) {
    var arg0 = arg[0], fRate1_invest = arg[1], fRate1_reinvest = arg[2];

    var valueArray = [];

    if ( arg0 instanceof CArea ) {
        arg0.foreach2( function ( c ) {
            valueArray.push( c.tocNumber() );
        } )
    }
    else if ( arg0 instanceof CArray ) {
        arg0.foreach( function ( c ) {
            valueArray.push( c.tocNumber() );
        } )
    }
    else if ( arg0 instanceof CArea3D ) {
        if ( arg0.wsFrom == arg0.wsTo ) {
            valueArray = arg0.getMatrix()[0];
        }
        else
            return this.value = new CError( cErrorType.wrong_value_type );
    }
    else {
        arg0 = arg0.tocNumber();
        if ( arg0 instanceof CError ) {
            return this.value = new CError( cErrorType.not_numeric )
        }
        else
            valueArray.push( arg0 );
    }

    if ( fRate1_invest instanceof CArea || fRate1_invest instanceof CArea3D ) {
        fRate1_invest = fRate1_invest.cross( arguments[1].first );
    }
    else if ( fRate1_invest instanceof CArray ) {
        fRate1_invest = fRate1_invest.getElementRowCol( 0, 0 );
    }

    if ( fRate1_reinvest instanceof CArea || fRate1_reinvest instanceof CArea3D ) {
        fRate1_reinvest = fRate1_reinvest.cross( arguments[1].first );
    }
    else if ( fRate1_reinvest instanceof CArray ) {
        fRate1_reinvest = fRate1_reinvest.getElementRowCol( 0, 0 );
    }

    fRate1_invest = fRate1_invest.tocNumber();
    fRate1_reinvest = fRate1_reinvest.tocNumber();

    if ( fRate1_invest instanceof CError ) return this.value = fRate1_invest;
    if ( fRate1_reinvest instanceof CError ) return this.value = fRate1_reinvest;

    fRate1_invest = fRate1_invest.getValue() + 1;
    fRate1_reinvest = fRate1_reinvest.getValue() + 1;

    var fNPV_reinvest = 0, fPow_reinvest = 1, fNPV_invest = 0, fPow_invest = 1, fCellValue,
        wasNegative = false, wasPositive = false;

    for ( var i = 0; i < valueArray.length; i++ ) {
        fCellValue = valueArray[i];

        if ( fCellValue instanceof CError )
            return this.value = fCellValue;

        fCellValue = valueArray[i].getValue();

        if ( fCellValue > 0 ) {          // reinvestments
            wasPositive = true;
            fNPV_reinvest += fCellValue * fPow_reinvest;
        }
        else if ( fCellValue < 0 ) {     // investments
            wasNegative = true;
            fNPV_invest += fCellValue * fPow_invest;
        }
        fPow_reinvest /= fRate1_reinvest;
        fPow_invest /= fRate1_invest;

    }

    if ( !( wasNegative && wasPositive ) )
        return this.value = new CError( cErrorType.division_by_zero );

    var fResult = -fNPV_reinvest / fNPV_invest;
    fResult *= Math.pow( fRate1_reinvest, valueArray.length - 1 );
    fResult = Math.pow( fResult, 1 / (valueArray.length - 1) );

    this.value = new CNumber( fResult - 1 );
    this.value.numFormat = 9;
    return this.value;

};
cMIRR.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( values , finance-rate , reinvest-rate )"
    };
};

function cNOMINAL() {
//    cBaseFunction.call( this, "NOMINAL" );

    this.name = "NOMINAL";
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
cNOMINAL.prototype = Object.create( cBaseFunction.prototype );
cNOMINAL.prototype.Calculate = function ( arg ) {
    var effectRate = arg[0],
        npery = arg[1];

    if ( effectRate instanceof CArea || effectRate instanceof CArea3D ) {
        effectRate = effectRate.cross( arguments[1].first );
    }
    else if ( effectRate instanceof CArray ) {
        effectRate = effectRate.getElementRowCol( 0, 0 );
    }

    if ( npery instanceof CArea || npery instanceof CArea3D ) {
        npery = npery.cross( arguments[1].first );
    }
    else if ( npery instanceof CArray ) {
        npery = npery.getElementRowCol( 0, 0 );
    }

    effectRate = effectRate.tocNumber();
    npery = npery.tocNumber();

    if ( effectRate instanceof CError ) return this.value = effectRate;
    if ( npery instanceof CError ) return this.value = npery;

    var eR = effectRate.getValue(),
        np = npery.getValue();

    if ( eR <= 0 || npery < 1 )
        return this.value = new CError( cErrorType.not_numeric );
    this.value = new CNumber( ( Math.pow( eR + 1, 1 / np ) - 1 ) * np );
//    this.value.numFormat = 9;
    return this.value;

};
cNOMINAL.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( effect-rate , npery )"
    };
};

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
cNPER.prototype = Object.create( cBaseFunction.prototype );
cNPER.prototype.Calculate = function ( arg ) {
    var rate = arg[0], pmt = arg[1], pv = arg[2], fv = arg[3] ? arg[3] : new CNumber( 0 ), type = arg[4] ? arg[4] : new CNumber( 0 );

    if ( rate instanceof CArea || rate instanceof CArea3D ) {
        rate = rate.cross( arguments[1].first );
    }
    else if ( rate instanceof CArray ) {
        rate = rate.getElementRowCol( 0, 0 );
    }

    if ( pmt instanceof CArea || pmt instanceof CArea3D ) {
        pmt = pmt.cross( arguments[1].first );
    }
    else if ( pmt instanceof CArray ) {
        pmt = pmt.getElementRowCol( 0, 0 );
    }

    if ( pv instanceof CArea || pv instanceof CArea3D ) {
        pv = pv.cross( arguments[1].first );
    }
    else if ( pv instanceof CArray ) {
        pv = pv.getElementRowCol( 0, 0 );
    }

    if ( fv instanceof CArea || fv instanceof CArea3D ) {
        fv = fv.cross( arguments[1].first );
    }
    else if ( fv instanceof CArray ) {
        fv = fv.getElementRowCol( 0, 0 );
    }

    if ( type instanceof CArea || type instanceof CArea3D ) {
        type = type.cross( arguments[1].first );
    }
    else if ( type instanceof CArray ) {
        type = type.getElementRowCol( 0, 0 );
    }

    rate = rate.tocNumber();
    pmt = pmt.tocNumber();
    pv = pv.tocNumber();
    fv = fv.tocNumber();
    type = type.tocNumber();

    if ( rate instanceof CError ) return this.value = rate;
    if ( pmt instanceof CError ) return this.value = pmt;
    if ( pmt instanceof CError ) return this.value = pv;
    if ( fv instanceof CError ) return this.value = fv;
    if ( type instanceof CError ) return this.value = type;

    if ( type.getValue() != 1 && type.getValue() != 0 ) return this.value = new CError( cErrorType.not_numeric );

    var res;
    if ( rate.getValue() != 0 ) {
        rate = rate.getValue();
        pmt = pmt.getValue();
        pv = pv.getValue();
        fv = fv.getValue();
        type = type.getValue();
        res = (-fv * rate + pmt * (1 + rate * type)) / (rate * pv + pmt * (1 + rate * type));
        res = Math.log( res ) / Math.log( 1 + rate )
    }
    else {
        res = -pv.getValue() - fv.getValue() / pmt.getValue();
    }

    return this.value = new CNumber( res );
};
cNPER.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( rate , pmt , pv [ , [ fv ] [ , [ type ] ] ] )"
    };
};

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
cNPV.prototype = Object.create( cBaseFunction.prototype );
cNPV.prototype.Calculate = function ( arg ) {
    var arg0 = arg[0], iStart = 1, res = 0, rate;

    function elemCalc( rate, value, step ) {
        return value / Math.pow( 1 + rate, step );
    }

    if ( arg0 instanceof CArea || arg0 instanceof CArea3D ) {
        arg0 = arg0.cross( arguments[1].first );
    }
    else if ( arg0 instanceof CArray ) {
        arg0 = arg0.getElementRowCol( 0, 0 );
    }

    arg0 = arg0.tocNumber();

    if ( arg0 instanceof CError )
        return this.value = arg0;

    rate = arg0.getValue();

    if ( rate == -1 )
        return this.value = new CError( cErrorType.division_by_zero );


    for ( var i = 1; i < this.getArguments(); i++ ) {
        var argI = arg[i];
        if ( argI instanceof CArea || argI instanceof CArea3D ) {
            var argIArr = argI.getValue();
            for ( var j = 0; j < argIArr.length; j++ ) {
                if ( argIArr[j] instanceof CNumber ) {
                    res += elemCalc( rate, argIArr[j].getValue(), iStart++ );
                }
            }
            continue;
        }
        else if ( argI instanceof CArray ) {
            argI.foreach( function ( elem ) {
                if ( elem instanceof CNumber ) {
                    res += elemCalc( rate, elem.getValue(), iStart++ );
                }
            } );
            continue;
        }

        argI = argI.tocNumber();

        if ( argI instanceof CError )
            continue;

        res += elemCalc( rate, argI.getValue(), iStart++ );

    }

    return this.value = new CNumber( res );

};
cNPV.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( rate , argument-list )"
    };
};

function cODDFPRICE() {
//    cBaseFunction.call( this, "ODDFPRICE" );

    this.name = "ODDFPRICE";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 8;
    this.argumentsCurrent = 0;
    this.argumentsMax = 9;
    this.formatType = {
        def:-1, //подразумевается формат первой ячейки входящей в формулу.
        noneFormat:-2
    };
    this.numFormat = this.formatType.noneFormat;

}
cODDFPRICE.prototype = Object.create( cBaseFunction.prototype );
cODDFPRICE.prototype.Calculate = function ( arg ) {
    var settlement = arg[0],
        maturity = arg[1],
        issue = arg[2],
        first_coupon = arg[3],
        rate = arg[4],
        yld = arg[5],
        redemption = arg[6],
        frequency = arg[7],
        basis = arg[8] && !(arg[8] instanceof CEmpty) ? arg[8] : new CNumber( 0 );

    if ( settlement instanceof CArea || settlement instanceof CArea3D ) {
        settlement = settlement.cross( arguments[1].first );
    }
    else if ( settlement instanceof CArray ) {
        settlement = settlement.getElementRowCol( 0, 0 );
    }

    if ( maturity instanceof CArea || maturity instanceof CArea3D ) {
        maturity = maturity.cross( arguments[1].first );
    }
    else if ( maturity instanceof CArray ) {
        maturity = maturity.getElementRowCol( 0, 0 );
    }

    if ( issue instanceof CArea || issue instanceof CArea3D ) {
        issue = issue.cross( arguments[1].first );
    }
    else if ( issue instanceof CArray ) {
        issue = issue.getElementRowCol( 0, 0 );
    }

    if ( first_coupon instanceof CArea || first_coupon instanceof CArea3D ) {
        first_coupon = first_coupon.cross( arguments[1].first );
    }
    else if ( first_coupon instanceof CArray ) {
        first_coupon = first_coupon.getElementRowCol( 0, 0 );
    }

    if ( rate instanceof CArea || rate instanceof CArea3D ) {
        rate = rate.cross( arguments[1].first );
    }
    else if ( rate instanceof CArray ) {
        rate = rate.getElementRowCol( 0, 0 );
    }

    if ( yld instanceof CArea || yld instanceof CArea3D ) {
        yld = yld.cross( arguments[1].first );
    }
    else if ( yld instanceof CArray ) {
        yld = yld.getElementRowCol( 0, 0 );
    }

    if ( redemption instanceof CArea || redemption instanceof CArea3D ) {
        redemption = redemption.cross( arguments[1].first );
    }
    else if ( redemption instanceof CArray ) {
        redemption = redemption.getElementRowCol( 0, 0 );
    }

    if ( frequency instanceof CArea || frequency instanceof CArea3D ) {
        frequency = frequency.cross( arguments[1].first );
    }
    else if ( frequency instanceof CArray ) {
        frequency = frequency.getElementRowCol( 0, 0 );
    }

    if ( basis instanceof CArea || basis instanceof CArea3D ) {
        basis = basis.cross( arguments[1].first );
    }
    else if ( basis instanceof CArray ) {
        basis = basis.getElementRowCol( 0, 0 );
    }

    settlement = settlement.tocNumber();
    maturity = maturity.tocNumber();
    issue = issue.tocNumber();
    first_coupon = first_coupon.tocNumber();
    rate = rate.tocNumber();
    yld = yld.tocNumber();
    redemption = redemption.tocNumber();
    frequency = frequency.tocNumber();
    basis = basis.tocNumber();

    if ( settlement instanceof CError ) return this.value = settlement;
    if ( maturity instanceof CError ) return this.value = maturity;
    if ( issue instanceof CError ) return this.value = issue;
    if ( first_coupon instanceof CError ) return this.value = first_coupon;
    if ( rate instanceof CError ) return this.value = rate;
    if ( yld instanceof CError ) return this.value = yld;
    if ( redemption instanceof CError ) return this.value = redemption;
    if ( frequency instanceof CError ) return this.value = frequency;
    if ( basis instanceof CError ) return this.value = basis;

    settlement = settlement.getValue();
    maturity = maturity.getValue();
    issue = issue.getValue();
    first_coupon = first_coupon.getValue();
    rate = rate.getValue();
    yld = yld.getValue();
    redemption = redemption.getValue();
    frequency = frequency.getValue();
    basis = basis.getValue();

    if ( settlement >= maturity || maturity <= first_coupon ||
        basis < 0 || basis > 4 ||
        yld < 0 || rate < 0 ||
        frequency != 1 && frequency != 2 && frequency != 4 )
        return this.value = new CError( cErrorType.not_numeric );

    var settl = Date.prototype.getDateFromExcel( settlement ),
        matur = Date.prototype.getDateFromExcel( maturity ),
        iss = Date.prototype.getDateFromExcel( issue ),
        firstCoup = Date.prototype.getDateFromExcel( first_coupon );

    function lastDayOfMonth( y, m, d ) {
        return (new Date( y, m - 1 )).getDaysInMonth() == d;
    }

    function daysBetweenNotNeg( d1, d2, b ) {
        var res = diffDate( d1, d2, b );
        return res > 0 ? res : 0;
    }

    function changeMonth( orgDate, numMonths, returnLastDay ) {
        var newDate = new Date( orgDate );
        newDate.addMonths( numMonths );
        if ( returnLastDay )
            return new Date( newDate.getFullYear(), newDate.getMonth(), newDate.getDaysInMonth() );
        else
            return newDate;
    }

    function _getcoupncd( settl, matur, frequency ) {
        var s = new Date( settl ), m = new Date( matur );
        lcl_GetCoupncd( s, m, frequency );
        return m;
    }

    function datesAggregate1( startDate, endDate, numMonths, acc, returnLastMonth ) {
        var frontDate = startDate, trailingDate = endDate;

        while ( !(numMonths > 0 ? frontDate >= endDate : frontDate <= endDate) ) {
            trailingDate = frontDate;
            frontDate = changeMonth( frontDate, numMonths, returnLastMonth );
            acc++;
        }
        return acc;

    }

    function coupNumber( mat, settl, numMonths, isWholeNumber ) {
        var my = mat.getFullYear(), mm = mat.getMonth() + 1, md = mat.getDate(),
            sy = settl.getFullYear(), sm = settl.getMonth() + 1, sd = settl.getDate(),
            endOfMonthTemp = lastDayOfMonth( my, mm, md ),
            endOfMonth = (!endOfMonthTemp && mm != 2 && md > 28 && md < new Date( my, mm ).getDaysInMonth()) ? lastDayOfMonth( sy, sm, sd ) : endOfMonthTemp,
            startDate = changeMonth( settl, 0, endOfMonth ),
            coupons =  (isWholeNumber - 0) + (settl < startDate);

        var frontDate = changeMonth( startDate, numMonths, endOfMonth ), trailingDate = mat;

        while ( !(numMonths > 0 ? frontDate >= endDate : frontDate <= endDate) ) {
            trailingDate = frontDate;
            frontDate = changeMonth( frontDate, numMonths, endOfMonth );
            coupons++;
        }

        return coupons;

    }

    var res = 0, dsc,
        numMonths = 12 / frequency, numMonthsNeg = -numMonths,
        e = getcoupdays( settl, new Date( firstCoup ), frequency, basis ),
        coupNums = getcoupnum( settl, new Date( matur ), frequency ),
        dfc = daysBetweenNotNeg( new Date( iss ), new Date( firstCoup ), basis );

    if ( dfc < e ) {
        dsc = daysBetweenNotNeg( settl, firstCoup, basis );
        rate *= 100 / frequency;
        yld /= frequency;
        yld++;
        dsc /= e;

        res = redemption / Math.pow( yld, (coupNums - 1 + dsc) );
        res += rate * dfc / e / Math.pow( yld, dsc );
        res -= rate * daysBetweenNotNeg( iss, settl, basis ) / e;

        for ( var i = 1; i < coupNums; i++ ) {
            res += rate / Math.pow( yld, (i + dsc) );
        }

    }
    else {
        var nc = getcoupnum( iss, firstCoup, frequency ),
            lateCoupon = new Date( firstCoup ),
            dcnl = 0, anl = 0, startDate, endDate,
            earlyCoupon, nl, dci;

        for ( var index = nc; index >= 1; index-- ) {

            earlyCoupon = changeMonth( lateCoupon, numMonthsNeg, false );
            nl = basis == DayCountBasis.ActualActual ? daysBetweenNotNeg( earlyCoupon, lateCoupon, basis ) : e;
            dci = index > 1 ? nl : daysBetweenNotNeg( iss, lateCoupon, basis );
            startDate = iss > earlyCoupon ? iss : earlyCoupon;
            endDate = settl < lateCoupon ? settl : lateCoupon;
            lateCoupon = new Date( earlyCoupon );
            dcnl += dci / nl;
            anl += daysBetweenNotNeg( startDate, endDate, basis ) / nl;

        }

        if ( basis == DayCountBasis.Actual360 || basis == DayCountBasis.Actual365 ) {
            dsc = daysBetweenNotNeg( settl, _getcoupncd( settl, firstCoup, frequency ), basis );
        }
        else {
            dsc = e - diffDate( _getcoupncd( settl, firstCoup, frequency ), settl, basis );
        }
        var nq = coupNumber( firstCoup, settl, numMonths, true );
        coupNums = getcoupnum( firstCoup, matur, frequency );
        yld = yld / frequency + 1;
        dsc = dsc / e;
        rate *= 100 / frequency;
        res = redemption / Math.pow( yld, (dsc + nq + coupNums) );
        res += rate * dcnl / Math.pow( yld, (nq + dsc) );
        res -= rate * anl;

        for ( var i = 1; i <= coupNums; i++ ) {
            res += rate / Math.pow( yld, (i + nq + dsc) );
        }

    }
    this.value = new CNumber( res );
    return this.value;

};
cODDFPRICE.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( settlement , maturity , issue , first-coupon , rate , yld , redemption , frequency [ , [ basis ] ] )"
    };
};

function cODDFYIELD() {
    cBaseFunction.call( this, "ODDFYIELD" );
}
cODDFYIELD.prototype = Object.create( cBaseFunction.prototype );

function cODDLPRICE() {
//    cBaseFunction.call( this, "ODDLPRICE" );

    this.name = "ODDLPRICE";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 7;
    this.argumentsCurrent = 0;
    this.argumentsMax = 8;
    this.formatType = {
        def:-1, //подразумевается формат первой ячейки входящей в формулу.
        noneFormat:-2
    };
    this.numFormat = this.formatType.noneFormat;

}
cODDLPRICE.prototype = Object.create( cBaseFunction.prototype );
cODDLPRICE.prototype.Calculate = function ( arg ) {
    var settlement = arg[0],
        maturity = arg[1],
        last_interest = arg[2],
        rate = arg[3],
        yld = arg[4],
        redemption = arg[5],
        frequency = arg[6],
        basis = arg[7] && !(arg[7] instanceof CEmpty) ? arg[7] : new CNumber( 0 );

    if ( settlement instanceof CArea || settlement instanceof CArea3D ) {
        settlement = settlement.cross( arguments[1].first );
    }
    else if ( settlement instanceof CArray ) {
        settlement = settlement.getElementRowCol( 0, 0 );
    }

    if ( maturity instanceof CArea || maturity instanceof CArea3D ) {
        maturity = maturity.cross( arguments[1].first );
    }
    else if ( maturity instanceof CArray ) {
        maturity = maturity.getElementRowCol( 0, 0 );
    }

    if ( last_interest instanceof CArea || last_interest instanceof CArea3D ) {
        last_interest = last_interest.cross( arguments[1].first );
    }
    else if ( last_interest instanceof CArray ) {
        last_interest = last_interest.getElementRowCol( 0, 0 );
    }

    if ( rate instanceof CArea || rate instanceof CArea3D ) {
        rate = rate.cross( arguments[1].first );
    }
    else if ( rate instanceof CArray ) {
        rate = rate.getElementRowCol( 0, 0 );
    }

    if ( yld instanceof CArea || yld instanceof CArea3D ) {
        yld = yld.cross( arguments[1].first );
    }
    else if ( yld instanceof CArray ) {
        yld = yld.getElementRowCol( 0, 0 );
    }

    if ( redemption instanceof CArea || redemption instanceof CArea3D ) {
        redemption = redemption.cross( arguments[1].first );
    }
    else if ( redemption instanceof CArray ) {
        redemption = redemption.getElementRowCol( 0, 0 );
    }

    if ( frequency instanceof CArea || frequency instanceof CArea3D ) {
        frequency = frequency.cross( arguments[1].first );
    }
    else if ( frequency instanceof CArray ) {
        frequency = frequency.getElementRowCol( 0, 0 );
    }

    if ( basis instanceof CArea || basis instanceof CArea3D ) {
        basis = basis.cross( arguments[1].first );
    }
    else if ( basis instanceof CArray ) {
        basis = basis.getElementRowCol( 0, 0 );
    }

    settlement = settlement.tocNumber();
    maturity = maturity.tocNumber();
    last_interest = last_interest.tocNumber();
    rate = rate.tocNumber();
    yld = yld.tocNumber();
    redemption = redemption.tocNumber();
    frequency = frequency.tocNumber();
    basis = basis.tocNumber();

    if ( settlement instanceof CError ) return this.value = settlement;
    if ( maturity instanceof CError ) return this.value = maturity;
    if ( last_interest instanceof CError ) return this.value = last_interest;
    if ( rate instanceof CError ) return this.value = rate;
    if ( yld instanceof CError ) return this.value = yld;
    if ( redemption instanceof CError ) return this.value = redemption;
    if ( frequency instanceof CError ) return this.value = frequency;
    if ( basis instanceof CError ) return this.value = basis;

    settlement = settlement.getValue();
    maturity = maturity.getValue();
    last_interest = last_interest.getValue();
    rate = rate.getValue();
    yld = yld.getValue();
    redemption = redemption.getValue();
    frequency = frequency.getValue();
    basis = basis.getValue();

    if ( settlement >= maturity || maturity <= last_interest ||
        basis < 0 || basis > 4 ||
        yld < 0 || rate < 0 ||
        frequency != 1 && frequency != 2 && frequency != 4 )
        return this.value = new CError( cErrorType.not_numeric );

    var settl = Date.prototype.getDateFromExcel( settlement ),
        matur = Date.prototype.getDateFromExcel( maturity ),
        lastInt = Date.prototype.getDateFromExcel( last_interest );

    var fDCi = yearFrac( lastInt, matur, basis ) * frequency;
    var fDSCi = yearFrac( settl, matur, basis ) * frequency;
    var fAi = yearFrac( lastInt, settl, basis ) * frequency;

    var res = redemption + fDCi * 100 * rate / frequency;
    res /= fDSCi * yld / frequency + 1;
    res -= fAi * 100 * rate / frequency;

    this.value = new CNumber( res );
    return this.value;

};
cODDLPRICE.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( settlement , maturity , last-interest , rate , yld , redemption , frequency [ , [ basis ] ] )"
    };
};

function cODDLYIELD() {
//    cBaseFunction.call( this, "ODDLYIELD" );

    this.name = "ODDLYIELD";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 7;
    this.argumentsCurrent = 0;
    this.argumentsMax = 8;
    this.formatType = {
        def:-1, //подразумевается формат первой ячейки входящей в формулу.
        noneFormat:-2
    };
    this.numFormat = this.formatType.noneFormat;

}
cODDLYIELD.prototype = Object.create( cBaseFunction.prototype );
cODDLYIELD.prototype.Calculate = function ( arg ) {
    var settlement = arg[0],
        maturity = arg[1],
        last_interest = arg[2],
        rate = arg[3],
        pr = arg[4],
        redemption = arg[5],
        frequency = arg[6],
        basis = arg[7] && !(arg[7] instanceof CEmpty) ? arg[7] : new CNumber( 0 );

    if ( settlement instanceof CArea || settlement instanceof CArea3D ) {
        settlement = settlement.cross( arguments[1].first );
    }
    else if ( settlement instanceof CArray ) {
        settlement = settlement.getElementRowCol( 0, 0 );
    }

    if ( maturity instanceof CArea || maturity instanceof CArea3D ) {
        maturity = maturity.cross( arguments[1].first );
    }
    else if ( maturity instanceof CArray ) {
        maturity = maturity.getElementRowCol( 0, 0 );
    }

    if ( last_interest instanceof CArea || last_interest instanceof CArea3D ) {
        last_interest = last_interest.cross( arguments[1].first );
    }
    else if ( last_interest instanceof CArray ) {
        last_interest = last_interest.getElementRowCol( 0, 0 );
    }

    if ( rate instanceof CArea || rate instanceof CArea3D ) {
        rate = rate.cross( arguments[1].first );
    }
    else if ( rate instanceof CArray ) {
        rate = rate.getElementRowCol( 0, 0 );
    }

    if ( pr instanceof CArea || pr instanceof CArea3D ) {
        pr = pr.cross( arguments[1].first );
    }
    else if ( pr instanceof CArray ) {
        pr = pr.getElementRowCol( 0, 0 );
    }

    if ( redemption instanceof CArea || redemption instanceof CArea3D ) {
        redemption = redemption.cross( arguments[1].first );
    }
    else if ( redemption instanceof CArray ) {
        redemption = redemption.getElementRowCol( 0, 0 );
    }

    if ( frequency instanceof CArea || frequency instanceof CArea3D ) {
        frequency = frequency.cross( arguments[1].first );
    }
    else if ( frequency instanceof CArray ) {
        frequency = frequency.getElementRowCol( 0, 0 );
    }

    if ( basis instanceof CArea || basis instanceof CArea3D ) {
        basis = basis.cross( arguments[1].first );
    }
    else if ( basis instanceof CArray ) {
        basis = basis.getElementRowCol( 0, 0 );
    }

    settlement = settlement.tocNumber();
    maturity = maturity.tocNumber();
    last_interest = last_interest.tocNumber();
    rate = rate.tocNumber();
    pr = pr.tocNumber();
    redemption = redemption.tocNumber();
    frequency = frequency.tocNumber();
    basis = basis.tocNumber();

    if ( settlement instanceof CError ) return this.value = settlement;
    if ( maturity instanceof CError ) return this.value = maturity;
    if ( last_interest instanceof CError ) return this.value = last_interest;
    if ( rate instanceof CError ) return this.value = rate;
    if ( pr instanceof CError ) return this.value = pr;
    if ( redemption instanceof CError ) return this.value = redemption;
    if ( frequency instanceof CError ) return this.value = frequency;
    if ( basis instanceof CError ) return this.value = basis;

    settlement = settlement.getValue();
    maturity = maturity.getValue();
    last_interest = last_interest.getValue();
    rate = rate.getValue();
    pr = pr.getValue();
    redemption = redemption.getValue();
    frequency = frequency.getValue();
    basis = basis.getValue();

    if ( settlement >= maturity || maturity <= last_interest ||
        basis < 0 || basis > 4 ||
        pr < 0 || rate < 0 ||
        frequency != 1 && frequency != 2 && frequency != 4 )
        return this.value = new CError( cErrorType.not_numeric );

    var settl = Date.prototype.getDateFromExcel( settlement ),
        matur = Date.prototype.getDateFromExcel( maturity ),
        lastInt = Date.prototype.getDateFromExcel( last_interest );

    var fDCi = yearFrac( lastInt, matur, basis ) * frequency;
    var fDSCi = yearFrac( settl, matur, basis ) * frequency;
    var fAi = yearFrac( lastInt, settl, basis ) * frequency;

    var res = redemption + fDCi * 100 * rate / frequency;
    res /= pr + fAi * 100 * rate / frequency;
    res--;
    res *= frequency / fDSCi;

    this.value = new CNumber( res );
    return this.value;

};
cODDLYIELD.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( settlement , maturity , last-interest , rate , pr , redemption , frequency [ , [ basis ] ] )"
    };
};

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
cPMT.prototype = Object.create( cBaseFunction.prototype );
cPMT.prototype.Calculate = function ( arg ) {
    var rate = arg[0], nper = arg[1], pv = arg[2], fv = arg[3] ? arg[3] : new CNumber( 0 ), type = arg[4] ? arg[4] : new CNumber( 0 );

    if ( rate instanceof CArea || rate instanceof CArea3D ) {
        rate = rate.cross( arguments[1].first );
    }
    else if ( rate instanceof CArray ) {
        rate = rate.getElementRowCol( 0, 0 );
    }

    if ( nper instanceof CArea || nper instanceof CArea3D ) {
        nper = nper.cross( arguments[1].first );
    }
    else if ( nper instanceof CArray ) {
        nper = nper.getElementRowCol( 0, 0 );
    }

    if ( pv instanceof CArea || pv instanceof CArea3D ) {
        pv = pv.cross( arguments[1].first );
    }
    else if ( pv instanceof CArray ) {
        pv = pv.getElementRowCol( 0, 0 );
    }

    if ( fv instanceof CArea || fv instanceof CArea3D ) {
        fv = fv.cross( arguments[1].first );
    }
    else if ( fv instanceof CArray ) {
        fv = fv.getElementRowCol( 0, 0 );
    }

    if ( type instanceof CArea || type instanceof CArea3D ) {
        type = type.cross( arguments[1].first );
    }
    else if ( type instanceof CArray ) {
        type = type.getElementRowCol( 0, 0 );
    }

    rate = rate.tocNumber();
    nper = nper.tocNumber();
    pv = pv.tocNumber();
    fv = fv.tocNumber();
    type = type.tocNumber();

    if ( rate instanceof CError ) return this.value = rate;

    if ( nper instanceof CError ) return this.value = nper;
    if ( nper.getValue() == 0 ) return this.value = new CError( cErrorType.division_by_zero );

    if ( pv instanceof CError ) return this.value = pv;
    if ( fv instanceof CError ) return this.value = fv;
    if ( type instanceof CError ) return this.value = type;

    if ( type.getValue() != 1 && type.getValue() != 0 ) return this.value = new CError( cErrorType.not_numeric );

    var res;
    if ( rate.getValue() != 0 ) {
        res = -1 * ( pv.getValue() * Math.pow( 1 + rate.getValue(), nper.getValue() ) + fv.getValue() ) /
            ( ( 1 + rate.getValue() * type.getValue() ) * ( Math.pow( (1 + rate.getValue()), nper.getValue() ) - 1 ) / rate.getValue() );
    }
    else {
        res = -1 * ( pv.getValue() + fv.getValue() ) / nper.getValue();
    }

    return this.value = new CNumber( res );
};
cPMT.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( rate , nper , pv [ , [ fv ] [ ,[ type ] ] ] )"
    };
};

function cPPMT() {
//    cBaseFunction.call( this, "PPMT" );

    this.name = "PPMT";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 4;
    this.argumentsCurrent = 0;
    this.argumentsMax = 6;
    this.formatType = {
        def:-1, //подразумевается формат первой ячейки входящей в формулу.
        noneFormat:-2
    };
    this.numFormat = this.formatType.noneFormat;

}
cPPMT.prototype = Object.create( cBaseFunction.prototype );
cPPMT.prototype.Calculate = function ( arg ) {
    var rate = arg[0], per = arg[1], nper = arg[2], pv = arg[3], fv = arg[4] ? arg[4] : new CNumber( 0 ), type = arg[5] ? arg[5] : new CNumber( 0 );

    if ( rate instanceof CArea || rate instanceof CArea3D ) {
        rate = rate.cross( arguments[1].first );
    }
    else if ( rate instanceof CArray ) {
        rate = rate.getElementRowCol( 0, 0 );
    }

    if ( per instanceof CArea || per instanceof CArea3D ) {
        per = per.cross( arguments[1].first );
    }
    else if ( per instanceof CArray ) {
        per = per.getElementRowCol( 0, 0 );
    }

    if ( nper instanceof CArea || nper instanceof CArea3D ) {
        nper = nper.cross( arguments[1].first );
    }
    else if ( nper instanceof CArray ) {
        nper = nper.getElementRowCol( 0, 0 );
    }

    if ( pv instanceof CArea || pv instanceof CArea3D ) {
        pv = pv.cross( arguments[1].first );
    }
    else if ( pv instanceof CArray ) {
        pv = pv.getElementRowCol( 0, 0 );
    }

    if ( fv instanceof CArea || fv instanceof CArea3D ) {
        fv = fv.cross( arguments[1].first );
    }
    else if ( fv instanceof CArray ) {
        fv = fv.getElementRowCol( 0, 0 );
    }

    if ( type instanceof CArea || type instanceof CArea3D ) {
        type = type.cross( arguments[1].first );
    }
    else if ( type instanceof CArray ) {
        type = type.getElementRowCol( 0, 0 );
    }

    rate = rate.tocNumber();
    per = per.tocNumber();
    nper = nper.tocNumber();
    pv = pv.tocNumber();
    fv = fv.tocNumber();
    type = type.tocNumber();

    if ( rate instanceof CError ) return this.value = rate;
    if ( per instanceof CError ) return this.value = per;
    if ( nper instanceof CError ) return this.value = nper;
    if ( pv instanceof CError ) return this.value = pv;
    if ( fv instanceof CError ) return this.value = fv;
    if ( type instanceof CError ) return this.value = type;

    rate = rate.getValue();
    per = per.getValue();
    nper = nper.getValue();
    pv = pv.getValue();
    fv = fv.getValue();
    type = type.getValue();

    var res;

    if ( per < 1 || per > nper || type != 0 && type != 1 ) {
        return this.value = new CError( cErrorType.wrong_value_type );
    }

    var fRmz = getPMT( rate, nper, pv, fv, type );

    res = fRmz - getIPMT( rate, per, pv, type, fRmz );

    this.value = new CNumber( res );
//    this.value.numFormat = 9;
    return this.value;
};
cPPMT.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( rate , per , nper , pv [ , [ fv ] [ , [ type ] ] ] )"
    };
};

function cPRICE() {
//    cBaseFunction.call( this, "PRICE" );

    this.name = "PRICE";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 6;
    this.argumentsCurrent = 0;
    this.argumentsMax = 7;
    this.formatType = {
        def:-1, //подразумевается формат первой ячейки входящей в формулу.
        noneFormat:-2
    };
    this.numFormat = this.formatType.noneFormat;

}
cPRICE.prototype = Object.create( cBaseFunction.prototype );
cPRICE.prototype.Calculate = function ( arg ) {
    var settlement = arg[0],
        maturity = arg[1],
        rate = arg[2],
        yld = arg[3],
        redemption = arg[4],
        frequency = arg[5],
        basis = arg[6] && !(arg[6] instanceof CEmpty) ? arg[6] : new CNumber( 0 );

    if ( settlement instanceof CArea || settlement instanceof CArea3D ) {
        settlement = settlement.cross( arguments[1].first );
    }
    else if ( settlement instanceof CArray ) {
        settlement = settlement.getElementRowCol( 0, 0 );
    }

    if ( maturity instanceof CArea || maturity instanceof CArea3D ) {
        maturity = maturity.cross( arguments[1].first );
    }
    else if ( maturity instanceof CArray ) {
        maturity = maturity.getElementRowCol( 0, 0 );
    }

    if ( rate instanceof CArea || rate instanceof CArea3D ) {
        rate = rate.cross( arguments[1].first );
    }
    else if ( rate instanceof CArray ) {
        rate = rate.getElementRowCol( 0, 0 );
    }

    if ( yld instanceof CArea || yld instanceof CArea3D ) {
        yld = yld.cross( arguments[1].first );
    }
    else if ( yld instanceof CArray ) {
        yld = yld.getElementRowCol( 0, 0 );
    }

    if ( redemption instanceof CArea || redemption instanceof CArea3D ) {
        redemption = redemption.cross( arguments[1].first );
    }
    else if ( redemption instanceof CArray ) {
        redemption = redemption.getElementRowCol( 0, 0 );
    }

    if ( frequency instanceof CArea || frequency instanceof CArea3D ) {
        frequency = frequency.cross( arguments[1].first );
    }
    else if ( frequency instanceof CArray ) {
        frequency = frequency.getElementRowCol( 0, 0 );
    }

    if ( basis instanceof CArea || basis instanceof CArea3D ) {
        basis = basis.cross( arguments[1].first );
    }
    else if ( basis instanceof CArray ) {
        basis = basis.getElementRowCol( 0, 0 );
    }

    settlement = settlement.tocNumber();
    maturity = maturity.tocNumber();
    rate = rate.tocNumber();
    yld = yld.tocNumber();
    redemption = redemption.tocNumber();
    frequency = frequency.tocNumber();
    basis = basis.tocNumber();

    if ( settlement instanceof CError ) return this.value = settlement;
    if ( maturity instanceof CError ) return this.value = maturity;
    if ( rate instanceof CError ) return this.value = rate;
    if ( yld instanceof CError ) return this.value = yld;
    if ( redemption instanceof CError ) return this.value = redemption;
    if ( frequency instanceof CError ) return this.value = frequency;
    if ( basis instanceof CError ) return this.value = basis;

    settlement = settlement.getValue();
    maturity = maturity.getValue();
    rate = rate.getValue();
    yld = yld.getValue();
    redemption = redemption.getValue();
    frequency = frequency.getValue();
    basis = basis.getValue();

    if ( settlement >= maturity ||
        basis < 0 || basis > 4 ||
        ( frequency != 1 && frequency != 2 && frequency != 4 ) ||
        rate < 0 || yld < 0 ||
        redemption <= 0 )
        return this.value = new CError( cErrorType.not_numeric );

    var settl = Date.prototype.getDateFromExcel( settlement ),
        matur = Date.prototype.getDateFromExcel( maturity );

    return this.value = new CNumber( getprice( settl, matur, rate, yld, redemption, frequency, basis ) );

};
cPRICE.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( settlement , maturity , rate , yld , redemption , frequency [ , [ basis ] ] )"
    };
};

function cPRICEDISC() {
//    cBaseFunction.call( this, "PRICEDISC" );

    this.name = "PRICEDISC";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 4;
    this.argumentsCurrent = 0;
    this.argumentsMax = 5;
    this.formatType = {
        def:-1, //подразумевается формат первой ячейки входящей в формулу.
        noneFormat:-2
    };
    this.numFormat = this.formatType.noneFormat;

}
cPRICEDISC.prototype = Object.create( cBaseFunction.prototype );
cPRICEDISC.prototype.Calculate = function ( arg ) {
    var settlement = arg[0],
        maturity = arg[1],
        discount = arg[2],
        redemption = arg[3],
        basis = arg[4] && !(arg[4] instanceof CEmpty) ? arg[4] : new CNumber( 0 );

    if ( settlement instanceof CArea || settlement instanceof CArea3D ) {
        settlement = settlement.cross( arguments[1].first );
    }
    else if ( settlement instanceof CArray ) {
        settlement = settlement.getElementRowCol( 0, 0 );
    }

    if ( maturity instanceof CArea || maturity instanceof CArea3D ) {
        maturity = maturity.cross( arguments[1].first );
    }
    else if ( maturity instanceof CArray ) {
        maturity = maturity.getElementRowCol( 0, 0 );
    }

    if ( discount instanceof CArea || discount instanceof CArea3D ) {
        discount = discount.cross( arguments[1].first );
    }
    else if ( discount instanceof CArray ) {
        discount = discount.getElementRowCol( 0, 0 );
    }

    if ( redemption instanceof CArea || redemption instanceof CArea3D ) {
        redemption = redemption.cross( arguments[1].first );
    }
    else if ( redemption instanceof CArray ) {
        redemption = redemption.getElementRowCol( 0, 0 );
    }

    if ( basis instanceof CArea || basis instanceof CArea3D ) {
        basis = basis.cross( arguments[1].first );
    }
    else if ( basis instanceof CArray ) {
        basis = basis.getElementRowCol( 0, 0 );
    }

    settlement = settlement.tocNumber();
    maturity = maturity.tocNumber();
    discount = discount.tocNumber();
    redemption = redemption.tocNumber();
    basis = basis.tocNumber();

    if ( settlement instanceof CError ) return this.value = settlement;
    if ( maturity instanceof CError ) return this.value = maturity;
    if ( discount instanceof CError ) return this.value = discount;
    if ( redemption instanceof CError ) return this.value = redemption;
    if ( basis instanceof CError ) return this.value = basis;

    settlement = settlement.getValue();
    maturity = maturity.getValue();
    discount = discount.getValue();
    redemption = redemption.getValue();
    basis = basis.getValue();

    if ( settlement >= maturity ||
        basis < 0 || basis > 4 ||
        discount <= 0 || redemption <= 0 )
        return this.value = new CError( cErrorType.not_numeric );

    var settl = Date.prototype.getDateFromExcel( settlement ),
        matur = Date.prototype.getDateFromExcel( maturity );

    var res = redemption * ( 1 - discount * GetDiffDate( settl, matur, basis ) );

    return this.value = new CNumber( res );

};
cPRICEDISC.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( settlement , maturity , discount , redemption [ , [ basis ] ] )"
    };
};

function cPRICEMAT() {
//    cBaseFunction.call( this, "PRICEMAT" );

    this.name = "PRICEMAT";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 5;
    this.argumentsCurrent = 0;
    this.argumentsMax = 6;
    this.formatType = {
        def:-1, //подразумевается формат первой ячейки входящей в формулу.
        noneFormat:-2
    };
    this.numFormat = this.formatType.noneFormat;

}
cPRICEMAT.prototype = Object.create( cBaseFunction.prototype );
cPRICEMAT.prototype.Calculate = function ( arg ) {
    var settlement = arg[0],
        maturity = arg[1],
        issue = arg[2],
        rate = arg[3],
        yld = arg[4],
        basis = arg[5] && !(arg[5] instanceof CEmpty) ? arg[5] : new CNumber( 0 );

    if ( settlement instanceof CArea || settlement instanceof CArea3D ) {
        settlement = settlement.cross( arguments[1].first );
    }
    else if ( settlement instanceof CArray ) {
        settlement = settlement.getElementRowCol( 0, 0 );
    }

    if ( maturity instanceof CArea || maturity instanceof CArea3D ) {
        maturity = maturity.cross( arguments[1].first );
    }
    else if ( maturity instanceof CArray ) {
        maturity = maturity.getElementRowCol( 0, 0 );
    }

    if ( issue instanceof CArea || issue instanceof CArea3D ) {
        issue = issue.cross( arguments[1].first );
    }
    else if ( issue instanceof CArray ) {
        issue = issue.getElementRowCol( 0, 0 );
    }

    if ( rate instanceof CArea || rate instanceof CArea3D ) {
        rate = rate.cross( arguments[1].first );
    }
    else if ( rate instanceof CArray ) {
        rate = rate.getElementRowCol( 0, 0 );
    }

    if ( yld instanceof CArea || yld instanceof CArea3D ) {
        yld = yld.cross( arguments[1].first );
    }
    else if ( yld instanceof CArray ) {
        yld = yld.getElementRowCol( 0, 0 );
    }

    if ( basis instanceof CArea || basis instanceof CArea3D ) {
        basis = basis.cross( arguments[1].first );
    }
    else if ( basis instanceof CArray ) {
        basis = basis.getElementRowCol( 0, 0 );
    }

    settlement = settlement.tocNumber();
    maturity = maturity.tocNumber();
    issue = issue.tocNumber();
    rate = rate.tocNumber();
    yld = yld.tocNumber();
    basis = basis.tocNumber();

    if ( settlement instanceof CError ) return this.value = settlement;
    if ( maturity instanceof CError ) return this.value = maturity;
    if ( issue instanceof CError ) return this.value = issue;
    if ( rate instanceof CError ) return this.value = rate;
    if ( yld instanceof CError ) return this.value = yld;
    if ( basis instanceof CError ) return this.value = basis;

    settlement = settlement.getValue();
    maturity = maturity.getValue();
    issue = issue.getValue();
    rate = rate.getValue();
    yld = yld.getValue();
    basis = basis.getValue();

    if ( settlement >= maturity ||
        basis < 0 || basis > 4 ||
        rate <= 0 || yld <= 0 )
        return this.value = new CError( cErrorType.not_numeric );

    var settl = Date.prototype.getDateFromExcel( settlement ),
        matur = Date.prototype.getDateFromExcel( maturity ),
        iss = Date.prototype.getDateFromExcel( issue );

    var fIssMat = yearFrac( new Date( iss ), new Date( matur ), basis );
    var fIssSet = yearFrac( new Date( iss ), new Date( settl ), basis );
    var fSetMat = yearFrac( new Date( settl ), new Date( matur ), basis );

    var res = 1 + fIssMat * rate;
    res /= 1 + fSetMat * yld;
    res -= fIssSet * rate;
    res *= 100;

    return this.value = new CNumber( res );

};
cPRICEMAT.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( settlement , maturity , discount , redemption [ , [ basis ] ] )"
    };
};

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
cPV.prototype = Object.create( cBaseFunction.prototype );
cPV.prototype.Calculate = function ( arg ) {
    var rate = arg[0], nper = arg[1], pmt = arg[2], fv = arg[3] ? arg[3] : new CNumber( 0 ), type = arg[4] ? arg[4] : new CNumber( 0 );

    if ( rate instanceof CArea || rate instanceof CArea3D ) {
        rate = rate.cross( arguments[1].first );
    }
    else if ( rate instanceof CArray ) {
        rate = rate.getElementRowCol( 0, 0 );
    }

    if ( nper instanceof CArea || nper instanceof CArea3D ) {
        nper = nper.cross( arguments[1].first );
    }
    else if ( nper instanceof CArray ) {
        nper = nper.getElementRowCol( 0, 0 );
    }

    if ( pmt instanceof CArea || pmt instanceof CArea3D ) {
        pmt = pmt.cross( arguments[1].first );
    }
    else if ( pmt instanceof CArray ) {
        pmt = pmt.getElementRowCol( 0, 0 );
    }

    if ( fv instanceof CArea || fv instanceof CArea3D ) {
        fv = fv.cross( arguments[1].first );
    }
    else if ( fv instanceof CArray ) {
        fv = fv.getElementRowCol( 0, 0 );
    }

    if ( type instanceof CArea || type instanceof CArea3D ) {
        type = type.cross( arguments[1].first );
    }
    else if ( type instanceof CArray ) {
        type = type.getElementRowCol( 0, 0 );
    }

    rate = rate.tocNumber();
    nper = nper.tocNumber();
    pmt = pmt.tocNumber();
    fv = fv.tocNumber();
    type = type.tocNumber();

    if ( rate instanceof CError ) return this.value = rate;
    if ( nper instanceof CError ) return this.value = nper;
    if ( pmt instanceof CError ) return this.value = pmt;
    if ( fv instanceof CError ) return this.value = fv;
    if ( type instanceof CError ) return this.value = type;

    if ( type.getValue() != 1 && type.getValue() != 0 ) return this.value = new CError( cErrorType.not_numeric );

    var res;
    if ( rate.getValue() != 0 ) {
        res = -1 * ( fv.getValue() + pmt.getValue() * (1 + rate.getValue() * type.getValue()) * ( (Math.pow( (1 + rate.getValue()), nper.getValue() ) - 1) / rate.getValue() ) ) / Math.pow( 1 + rate.getValue(), nper.getValue() )
    }
    else {
        res = -1 * ( fv.getValue() + pmt.getValue() * nper.getValue() );
    }

    return this.value = new CNumber( res );
};
cPV.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( rate , nper , pmt [ , [ fv ] [ ,[ type ] ] ] )"
    };
};

function cRATE() {
//    cBaseFunction.call( this, "RATE" );

    this.name = "RATE";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 3;
    this.argumentsCurrent = 0;
    this.argumentsMax = 6;
    this.formatType = {
        def:-1, //подразумевается формат первой ячейки входящей в формулу.
        noneFormat:-2
    };
    this.numFormat = this.formatType.noneFormat;

}
cRATE.prototype = Object.create( cBaseFunction.prototype );
cRATE.prototype.Calculate = function ( arg ) {

    var nper = arg[0], pmt = arg[1], pv = arg[2], fv = arg[3] ? arg[3] : new CNumber( 0 ), type = arg[4] ? arg[4] : new CNumber( 0 ), quess = arg[5] ? arg[5] : new CNumber( 0.1 );

    if ( nper instanceof CArea || nper instanceof CArea3D ) {
        nper = nper.cross( arguments[1].first );
    }
    else if ( nper instanceof CArray ) {
        nper = nper.getElementRowCol( 0, 0 );
    }

    if ( pmt instanceof CArea || pmt instanceof CArea3D ) {
        pmt = pmt.cross( arguments[1].first );
    }
    else if ( pmt instanceof CArray ) {
        pmt = pmt.getElementRowCol( 0, 0 );
    }

    if ( pv instanceof CArea || pv instanceof CArea3D ) {
        pv = pv.cross( arguments[1].first );
    }
    else if ( pv instanceof CArray ) {
        pv = pv.getElementRowCol( 0, 0 );
    }

    if ( fv instanceof CArea || fv instanceof CArea3D ) {
        fv = fv.cross( arguments[1].first );
    }
    else if ( fv instanceof CArray ) {
        fv = fv.getElementRowCol( 0, 0 );
    }

    if ( type instanceof CArea || type instanceof CArea3D ) {
        type = type.cross( arguments[1].first );
    }
    else if ( type instanceof CArray ) {
        type = type.getElementRowCol( 0, 0 );
    }

    if ( quess instanceof CArea || quess instanceof CArea3D ) {
        quess = quess.cross( arguments[1].first );
    }
    else if ( quess instanceof CArray ) {
        quess = quess.getElementRowCol( 0, 0 );
    }

    nper = nper.tocNumber();
    pmt = pmt.tocNumber();
    pv = pv.tocNumber();
    fv = fv.tocNumber();
    type = type.tocNumber();
    quess = quess.tocNumber();

    if ( nper instanceof CError ) return this.value = nper;
    if ( pmt instanceof CError ) return this.value = pmt;
    if ( pv instanceof CError ) return this.value = pv;
    if ( fv instanceof CError ) return this.value = fv;
    if ( type instanceof CError ) return this.value = type;
    if ( quess instanceof CError ) return this.value = quess;

    if ( type.getValue() != 1 && type.getValue() != 0 ) return this.value = new CError( cErrorType.not_numeric );

    var guess = {fGuess:quess.getValue()};

    var bValid = RateIteration( nper.getValue(), pmt.getValue(), pv.getValue(), fv.getValue(), type.getValue(), guess );
    if ( !bValid )
        return this.value = new CError( cErrorType.wrong_value_type );

    this.value = new CNumber( guess.fGuess );
    this.value.numFormat = 9;
    return this.value;
};
cRATE.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( nper , pmt , pv  [ , [ [ fv ] [ , [ [ type ] [ , [ guess ] ] ] ] ] ] )"
    };
};

function cRECEIVED() {
//    cBaseFunction.call( this, "RECEIVED" );

    this.name = "RECEIVED";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 4;
    this.argumentsCurrent = 0;
    this.argumentsMax = 5;
    this.formatType = {
        def:-1, //подразумевается формат первой ячейки входящей в формулу.
        noneFormat:-2
    };
    this.numFormat = this.formatType.noneFormat;

}
cRECEIVED.prototype = Object.create( cBaseFunction.prototype );
cRECEIVED.prototype.Calculate = function ( arg ) {
    var settlement = arg[0],
        maturity = arg[1],
        investment = arg[2],
        discount = arg[3],
        basis = arg[4] && !(arg[4] instanceof CEmpty) ? arg[4] : new CNumber( 0 );

    if ( settlement instanceof CArea || settlement instanceof CArea3D ) {
        settlement = settlement.cross( arguments[1].first );
    }
    else if ( settlement instanceof CArray ) {
        settlement = settlement.getElementRowCol( 0, 0 );
    }

    if ( maturity instanceof CArea || maturity instanceof CArea3D ) {
        maturity = maturity.cross( arguments[1].first );
    }
    else if ( maturity instanceof CArray ) {
        maturity = maturity.getElementRowCol( 0, 0 );
    }

    if ( investment instanceof CArea || investment instanceof CArea3D ) {
        investment = investment.cross( arguments[1].first );
    }
    else if ( investment instanceof CArray ) {
        investment = investment.getElementRowCol( 0, 0 );
    }

    if ( discount instanceof CArea || discount instanceof CArea3D ) {
        discount = discount.cross( arguments[1].first );
    }
    else if ( discount instanceof CArray ) {
        discount = discount.getElementRowCol( 0, 0 );
    }

    if ( basis instanceof CArea || basis instanceof CArea3D ) {
        basis = basis.cross( arguments[1].first );
    }
    else if ( basis instanceof CArray ) {
        basis = basis.getElementRowCol( 0, 0 );
    }

    settlement = settlement.tocNumber();
    maturity = maturity.tocNumber();
    investment = investment.tocNumber();
    discount = discount.tocNumber();
    basis = basis.tocNumber();

    if ( settlement instanceof CError ) return this.value = settlement;
    if ( maturity instanceof CError ) return this.value = maturity;
    if ( investment instanceof CError ) return this.value = investment;
    if ( discount instanceof CError ) return this.value = discount;
    if ( basis instanceof CError ) return this.value = basis;

    if ( settlement.getValue() >= maturity.getValue() || investment.getValue() <= 0 || discount.getValue() <= 0 || basis.getValue() < 0 || basis.getValue() > 4 )
        return this.value = new CError( cErrorType.not_numeric );

    var res = investment.getValue() / ( 1 - ( discount.getValue() * yearFrac( Date.prototype.getDateFromExcel( settlement.getValue() ), Date.prototype.getDateFromExcel( maturity.getValue() ), basis.getValue() ) ) );

    this.value = new CNumber( res );
//    this.value.numFormat = 9;
    return this.value;

};
cRECEIVED.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( settlement , maturity , investment , discount [ , [ basis ] ] )"
    };
};

function cSLN() {
//    cBaseFunction.call( this, "SLN" );

    this.name = "SLN";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 3;
    this.argumentsCurrent = 0;
    this.argumentsMax = 3;
    this.formatType = {
        def:-1, //подразумевается формат первой ячейки входящей в формулу.
        noneFormat:-2
    };
    this.numFormat = this.formatType.noneFormat;

}
cSLN.prototype = Object.create( cBaseFunction.prototype );
cSLN.prototype.Calculate = function ( arg ) {
    var cost = arg[0],
        salvage = arg[1],
        life = arg[2];

    if ( cost instanceof CArea || cost instanceof CArea3D ) {
        cost = cost.cross( arguments[1].first );
    }
    else if ( cost instanceof CArray ) {
        cost = cost.getElementRowCol( 0, 0 );
    }

    if ( salvage instanceof CArea || salvage instanceof CArea3D ) {
        salvage = salvage.cross( arguments[1].first );
    }
    else if ( salvage instanceof CArray ) {
        salvage = salvage.getElementRowCol( 0, 0 );
    }

    if ( life instanceof CArea || life instanceof CArea3D ) {
        life = life.cross( arguments[1].first );
    }
    else if ( life instanceof CArray ) {
        life = life.getElementRowCol( 0, 0 );
    }

    cost = cost.tocNumber();
    salvage = salvage.tocNumber();
    life = life.tocNumber();

    if ( cost instanceof CError ) return this.value = cost;
    if ( salvage instanceof CError ) return this.value = salvage;
    if ( life instanceof CError ) return this.value = life;

    cost = cost.getValue();
    salvage = salvage.getValue();
    life = life.getValue();

    if ( life == 0 )
        return this.value = new CError( cErrorType.not_numeric );

    this.value = new CNumber( ( cost - salvage ) / life );
    return this.value;

};
cSLN.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( cost , salvage , life )"
    };
};

function cSYD() {
//    cBaseFunction.call( this, "SYD" );

    this.name = "SYD";
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
cSYD.prototype = Object.create( cBaseFunction.prototype );
cSYD.prototype.Calculate = function ( arg ) {
    var cost = arg[0], salvage = arg[1], life = arg[2], per = arg[3];

    if ( cost instanceof CArea || cost instanceof CArea3D ) {
        cost = cost.cross( arguments[1].first );
    }
    else if ( cost instanceof CArray ) {
        cost = cost.getElementRowCol( 0, 0 );
    }

    if ( salvage instanceof CArea || salvage instanceof CArea3D ) {
        salvage = salvage.cross( arguments[1].first );
    }
    else if ( salvage instanceof CArray ) {
        salvage = salvage.getElementRowCol( 0, 0 );
    }

    if ( life instanceof CArea || life instanceof CArea3D ) {
        life = life.cross( arguments[1].first );
    }
    else if ( life instanceof CArray ) {
        life = life.getElementRowCol( 0, 0 );
    }

    if ( per instanceof CArea || per instanceof CArea3D ) {
        per = per.cross( arguments[1].first );
    }
    else if ( per instanceof CArray ) {
        per = per.getElementRowCol( 0, 0 );
    }

    cost = cost.tocNumber();
    salvage = salvage.tocNumber();
    life = life.tocNumber();
    per = per.tocNumber();

    if ( cost instanceof CError ) return this.value = cost;
    if ( salvage instanceof CError ) return this.value = salvage;
    if ( life instanceof CError ) return this.value = life;
    if ( per instanceof CError ) return this.value = per;

    cost = cost.getValue();
    salvage = salvage.getValue();
    life = life.getValue();
    per = per.getValue();

    if ( life == 1 || life == 0 )
        return this.value = new CError( cErrorType.not_numeric );

    var res = 2;
    res *= cost - salvage;
    res *= life + 1 - per;
    res /= (life + 1) * life;

    return this.value = new CNumber( res );
};
cSYD.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( cost , salvage , life , per )"
    };
};

function cTBILLEQ() {
//    cBaseFunction.call( this, "TBILLEQ" );

    this.name = "TBILLEQ";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 3;
    this.argumentsCurrent = 0;
    this.argumentsMax = 3;
    this.formatType = {
        def:-1, //подразумевается формат первой ячейки входящей в формулу.
        noneFormat:-2
    };
    this.numFormat = this.formatType.noneFormat;

}
cTBILLEQ.prototype = Object.create( cBaseFunction.prototype );
cTBILLEQ.prototype.Calculate = function ( arg ) {
    var settlement = arg[0],
        maturity = arg[1],
        discount = arg[2];

    if ( settlement instanceof CArea || settlement instanceof CArea3D ) {
        settlement = settlement.cross( arguments[1].first );
    }
    else if ( settlement instanceof CArray ) {
        settlement = settlement.getElementRowCol( 0, 0 );
    }

    if ( maturity instanceof CArea || maturity instanceof CArea3D ) {
        maturity = maturity.cross( arguments[1].first );
    }
    else if ( maturity instanceof CArray ) {
        maturity = maturity.getElementRowCol( 0, 0 );
    }

    if ( discount instanceof CArea || discount instanceof CArea3D ) {
        discount = discount.cross( arguments[1].first );
    }
    else if ( discount instanceof CArray ) {
        discount = discount.getElementRowCol( 0, 0 );
    }

    settlement = settlement.tocNumber();
    maturity = maturity.tocNumber();
    discount = discount.tocNumber();

    if ( settlement instanceof CError ) return this.value = settlement;
    if ( maturity instanceof CError ) return this.value = maturity;
    if ( discount instanceof CError ) return this.value = discount;

    var nMat = maturity.getValue();
    nMat++;

    var d1 = Date.prototype.getDateFromExcel( settlement.getValue() );
    var d2 = Date.prototype.getDateFromExcel( nMat );
    var date1 = d1.getDate(), month1 = d1.getMonth(), year1 = d1.getFullYear(),
        date2 = d2.getDate(), month2 = d2.getMonth(), year2 = d2.getFullYear();

    var nDiff = GetDiffDate360( date1, month1, year1, d1.isLeapYear(), date2, month2, year2, true );

    if ( settlement.getValue() >= maturity.getValue() || discount.getValue() <= 0 || nDiff > 360 )
        return this.value = new CError( cErrorType.not_numeric );

    var res = ( 365 * discount.getValue() ) / ( 360 - ( discount.getValue() * nDiff ) );

    this.value = new CNumber( res );
    this.value.numFormat = 9;
    return this.value;

};
cTBILLEQ.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( settlement , maturity , discount )"
    };
};

function cTBILLPRICE() {
//    cBaseFunction.call( this, "TBILLPRICE" );

    this.name = "TBILLPRICE";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 3;
    this.argumentsCurrent = 0;
    this.argumentsMax = 3;
    this.formatType = {
        def:-1, //подразумевается формат первой ячейки входящей в формулу.
        noneFormat:-2
    };
    this.numFormat = this.formatType.noneFormat;

}
cTBILLPRICE.prototype = Object.create( cBaseFunction.prototype );
cTBILLPRICE.prototype.Calculate = function ( arg ) {
    var settlement = arg[0],
        maturity = arg[1],
        discount = arg[2];

    if ( settlement instanceof CArea || settlement instanceof CArea3D ) {
        settlement = settlement.cross( arguments[1].first );
    }
    else if ( settlement instanceof CArray ) {
        settlement = settlement.getElementRowCol( 0, 0 );
    }

    if ( maturity instanceof CArea || maturity instanceof CArea3D ) {
        maturity = maturity.cross( arguments[1].first );
    }
    else if ( maturity instanceof CArray ) {
        maturity = maturity.getElementRowCol( 0, 0 );
    }

    if ( discount instanceof CArea || discount instanceof CArea3D ) {
        discount = discount.cross( arguments[1].first );
    }
    else if ( discount instanceof CArray ) {
        discount = discount.getElementRowCol( 0, 0 );
    }

    settlement = settlement.tocNumber();
    maturity = maturity.tocNumber();
    discount = discount.tocNumber();

    if ( settlement instanceof CError ) return this.value = settlement;
    if ( maturity instanceof CError ) return this.value = maturity;
    if ( discount instanceof CError ) return this.value = discount;

    var nMat = maturity.getValue();
    nMat++;

    var d1 = Date.prototype.getDateFromExcel( settlement.getValue() );
    var d2 = Date.prototype.getDateFromExcel( nMat );

    var fFraction = yearFrac( d1, d2, 0 );

    if ( fFraction - Math.floor( fFraction ) == 0 )
        return this.value = new CError( cErrorType.not_numeric );

    var res = 100 * ( 1 - discount.getValue() * fFraction );

    if ( settlement.getValue() >= maturity.getValue() || discount.getValue() <= 0 )
        return this.value = new CError( cErrorType.not_numeric );

    this.value = new CNumber( res );
//    this.value.numFormat = 9;
    return this.value;

};
cTBILLPRICE.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( settlement , maturity , discount )"
    };
};

function cTBILLYIELD() {
//    cBaseFunction.call( this, "TBILLYIELD" );

    this.name = "TBILLYIELD";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 3;
    this.argumentsCurrent = 0;
    this.argumentsMax = 3;
    this.formatType = {
        def:-1, //подразумевается формат первой ячейки входящей в формулу.
        noneFormat:-2
    };
    this.numFormat = this.formatType.noneFormat;

}
cTBILLYIELD.prototype = Object.create( cBaseFunction.prototype );
cTBILLYIELD.prototype.Calculate = function ( arg ) {
    var settlement = arg[0],
        maturity = arg[1],
        pr = arg[2];

    if ( settlement instanceof CArea || settlement instanceof CArea3D ) {
        settlement = settlement.cross( arguments[1].first );
    }
    else if ( settlement instanceof CArray ) {
        settlement = settlement.getElementRowCol( 0, 0 );
    }

    if ( maturity instanceof CArea || maturity instanceof CArea3D ) {
        maturity = maturity.cross( arguments[1].first );
    }
    else if ( maturity instanceof CArray ) {
        maturity = maturity.getElementRowCol( 0, 0 );
    }

    if ( pr instanceof CArea || pr instanceof CArea3D ) {
        pr = pr.cross( arguments[1].first );
    }
    else if ( pr instanceof CArray ) {
        pr = pr.getElementRowCol( 0, 0 );
    }

    settlement = settlement.tocNumber();
    maturity = maturity.tocNumber();
    pr = pr.tocNumber();

    if ( settlement instanceof CError ) return this.value = settlement;
    if ( maturity instanceof CError ) return this.value = maturity;
    if ( pr instanceof CError ) return this.value = pr;

    var d1 = Date.prototype.getDateFromExcel( settlement.getValue() );
    var d2 = Date.prototype.getDateFromExcel( maturity.getValue() );
    var date1 = d1.getDate(), month1 = d1.getMonth(), year1 = d1.getFullYear(),
        date2 = d2.getDate(), month2 = d2.getMonth(), year2 = d2.getFullYear();

    var nDiff = GetDiffDate360( date1, month1, year1, d1.isLeapYear(), date2, month2, year2, true );
    nDiff++;
    if ( settlement.getValue() >= maturity.getValue() || pr.getValue() <= 0 || nDiff > 360 )
        return this.value = new CError( cErrorType.not_numeric );

    pr = pr.getValue();

    var res = ( ( 100 - pr ) / pr) * (360 / nDiff);

    this.value = new CNumber( res );
    this.value.numFormat = 9;
    return this.value;

};
cTBILLYIELD.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( settlement , maturity , pr )"
    };
};

function cVDB() {
//    cBaseFunction.call( this, "VDB" );

    this.name = "VDB";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 5;
    this.argumentsCurrent = 0;
    this.argumentsMax = 7;
    this.formatType = {
        def:-1, //подразумевается формат первой ячейки входящей в формулу.
        noneFormat:-2
    };
    this.numFormat = this.formatType.noneFormat;

}
cVDB.prototype = Object.create( cBaseFunction.prototype );
cVDB.prototype.Calculate = function ( arg ) {
    var cost = arg[0], salvage = arg[1], life = arg[2],
        startPeriod = arg[3], endPeriod = arg[4],
        factor = arg[5] && !(arg[5] instanceof CEmpty) ? arg[5] : new CNumber( 2 ),
        flag = arg[6] && !(arg[6] instanceof CEmpty) ? arg[6] : new CBool( false );

    function getVDB( cost, fRest, life, life1, startPeriod, factor ) {
        var res = 0, loopEnd = end = Math.ceil( startPeriod ),
            temp, sln = 0, rest = cost - fRest, sln1 = false, ddb;

        for ( var i = 1; i <= loopEnd; i++ ) {
            if ( !sln1 ) {

                ddb = getDDB( cost, fRest, life, i, factor );
                sln = rest / (life1 - (i - 1));

                if ( sln > ddb ) {
                    temp = sln;
                    sln1 = true;
                }
                else {
                    temp = ddb;
                    rest -= ddb;
                }

            }
            else {
                temp = sln;
            }

            if ( i == loopEnd )
                temp *= ( startPeriod + 1.0 - end );

            res += temp;
        }
        return res;
    }


    if ( cost instanceof CArea || cost instanceof CArea3D ) {
        cost = cost.cross( arguments[1].first );
    }
    else if ( cost instanceof CArray ) {
        cost = cost.getElementRowCol( 0, 0 );
    }

    if ( salvage instanceof CArea || salvage instanceof CArea3D ) {
        salvage = salvage.cross( arguments[1].first );
    }
    else if ( salvage instanceof CArray ) {
        salvage = salvage.getElementRowCol( 0, 0 );
    }

    if ( life instanceof CArea || life instanceof CArea3D ) {
        life = life.cross( arguments[1].first );
    }
    else if ( life instanceof CArray ) {
        life = life.getElementRowCol( 0, 0 );
    }

    if ( startPeriod instanceof CArea || startPeriod instanceof CArea3D ) {
        startPeriod = startPeriod.cross( arguments[1].first );
    }
    else if ( startPeriod instanceof CArray ) {
        startPeriod = startPeriod.getElementRowCol( 0, 0 );
    }

    if ( endPeriod instanceof CArea || endPeriod instanceof CArea3D ) {
        endPeriod = endPeriod.cross( arguments[1].first );
    }
    else if ( endPeriod instanceof CArray ) {
        endPeriod = endPeriod.getElementRowCol( 0, 0 );
    }

    if ( factor instanceof CArea || factor instanceof CArea3D ) {
        factor = factor.cross( arguments[1].first );
    }
    else if ( factor instanceof CArray ) {
        factor = factor.getElementRowCol( 0, 0 );
    }

    if ( flag instanceof CArea || flag instanceof CArea3D ) {
        flag = flag.cross( arguments[1].first );
    }
    else if ( flag instanceof CArray ) {
        flag = flag.getElementRowCol( 0, 0 );
    }

    cost = cost.tocNumber();
    salvage = salvage.tocNumber();
    life = life.tocNumber();
    startPeriod = startPeriod.tocNumber();
    endPeriod = endPeriod.tocNumber();
    factor = factor.tocNumber();
    flag = flag.tocBool();

    if ( cost instanceof CError ) return this.value = cost;
    if ( salvage instanceof CError ) return this.value = salvage;
    if ( life instanceof CError ) return this.value = life;
    if ( startPeriod instanceof CError ) return this.value = startPeriod;
    if ( endPeriod instanceof CError ) return this.value = endPeriod;
    if ( factor instanceof CError ) return this.value = factor;
    if ( flag instanceof CError ) return this.value = flag;

    cost = cost.getValue();
    salvage = salvage.getValue();
    life = life.getValue();
    startPeriod = startPeriod.getValue();
    endPeriod = endPeriod.getValue();
    factor = factor.getValue();
    flag = flag.getValue();

    if ( cost < salvage || life < 0 || startPeriod < 0 || life < startPeriod || startPeriod > endPeriod || life < endPeriod || factor < 0 ) {
        return this.value = new CError( cErrorType.not_numeric );
    }

    var start = Math.floor( startPeriod ), end = Math.ceil( endPeriod );

    var res = 0;
    if ( flag ) {
        for ( var i = start + 1; i <= end; i++ ) {
            var ddb = getDDB( cost, salvage, life, i, factor );

            if ( i == start + 1 )
                ddb *= ( Math.min( endPeriod, start + 1 ) - startPeriod );
            else if ( i == end )
                ddb *= ( endPeriod + 1 - end );

            res += ddb;
        }
    }
    else {

        var life1 = life;

        if ( !Math.approxEqual( startPeriod, Math.floor( startPeriod ) ) ) {
            if ( factor > 1 ) {
                if ( startPeriod > life / 2 || Math.approxEqual( startPeriod, life / 2 ) ) {
                    var fPart = startPeriod - life / 2;
                    startPeriod = life / 2;
                    endPeriod -= fPart;
                    life1 += 1;
                }
            }
        }

        cost -= getVDB( cost, salvage, life, life1, startPeriod, factor );
        res = getVDB( cost, salvage, life, life - startPeriod, endPeriod - startPeriod, factor );
    }

    return this.value = new CNumber( res );
};
cVDB.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( cost , salvage , life , start-period , end-period [ , [ [ factor ] [ , [ no-switch-flag ] ] ] ] ] )"
    };
};

function cXIRR() {
//    cBaseFunction.call( this, "XIRR" );

    this.name = "XIRR";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 2;
    this.argumentsCurrent = 0;
    this.argumentsMax = 3;
    this.formatType = {
        def:-1, //подразумевается формат первой ячейки входящей в формулу.
        noneFormat:-2
    };
    this.numFormat = this.formatType.noneFormat;

}
cXIRR.prototype = Object.create( cBaseFunction.prototype );
cXIRR.prototype.Calculate = function ( arg ) {
    var arg0 = arg[0], arg1 = arg[1], arg2 = arg[2] ? arg[2] : new CNumber( 0.1 );

    function lcl_sca_XirrResult( rValues, rDates, fRate ) {
        var D_0 = rDates[0];
        var r = fRate + 1;
        var fResult = rValues[0];
        for ( var i = 1, nCount = rValues.length; i < nCount; ++i )
            fResult += rValues[i] / Math.pow( r, (rDates[i] - D_0) / 365 );
        return fResult;
    }

    function lcl_sca_XirrResult_Deriv1( rValues, rDates, fRate ) {
        var D_0 = rDates[0];
        var r = fRate + 1;
        var fResult = 0;
        for ( var i = 1, nCount = rValues.length; i < nCount; ++i ) {
            var E_i = (rDates[i] - D_0) / 365;
            fResult -= E_i * rValues[i] / Math.pow( r, E_i + 1 );
        }
        return fResult;
    }

    function xirr( valueArray, dateArray, rate ) {

        var arr0 = valueArray[0], arr1 = dateArray[0];

        if ( arr0 instanceof CError ) {
            return new CError( cErrorType.not_available );
        }

        if ( arr1 instanceof CError ) {
            return new CError( cErrorType.not_available );
        }

        if ( valueArray.length < 2 || (dateArray.length != valueArray.length) )
            return new CError( cErrorType.not_numeric );


        var res = rate.getValue();
        if ( res <= -1 )
            return new CError( cErrorType.not_numeric );

        var fMaxEps = 1e-10, maxIter = 50;

        for ( var i = 0; i < dateArray.length; i++ ) {
            dateArray[i] = dateArray[i].tocNumber();
            valueArray[i] = valueArray[i].tocNumber();
            if ( dateArray[i] instanceof CError || valueArray[i] instanceof CError )
                return new CError( cErrorType.not_numeric );
            dateArray[i] = dateArray[i].getValue();
            valueArray[i] = valueArray[i].getValue();
        }

        var newRate, eps, xirrRes, bContLoop = true;
        for ( var i = 0; i < maxIter && bContLoop; i++ ) {
            xirrRes = lcl_sca_XirrResult( valueArray, dateArray, res );
            newRate = res - xirrRes / lcl_sca_XirrResult_Deriv1( valueArray, dateArray, res );
            eps = Math.abs( newRate - res );
            res = newRate;
            bContLoop = (eps > fMaxEps) && (Math.abs( xirrRes ) > fMaxEps);
        }

        if ( bContLoop ) {
            return new CError( cErrorType.not_numeric );
        }

        return new CNumber( res );

    }

    var dateArray = [], valueArray = [];

    if ( arg0 instanceof CArea ) {
        arg0.foreach2( function ( c ) {
            valueArray.push( c.tocNumber() );
        } )
    }
    else if ( arg0 instanceof CArray ) {
        arg0.foreach( function ( c ) {
            valueArray.push( c.tocNumber() );
        } )
    }
    else if ( arg0 instanceof CArea3D ) {
        if ( arg0.wsFrom == arg0.wsTo ) {
            valueArray = arg0.getMatrix()[0];
        }
        else
            return this.value = new CError( cErrorType.wrong_value_type );
    }
    else {
        arg0 = arg0.tocNumber();
        if ( arg1 instanceof CError ) {
            return this.value = new CError( cErrorType.not_numeric )
        }
        else
            valueArray.push( arg0 );
    }

    if ( arg1 instanceof CArea ) {
        arg1.foreach2( function ( c ) {
            dateArray.push( c.tocNumber() );
        } )
    }
    else if ( arg1 instanceof CArray ) {
        arg1.foreach( function ( c ) {
            dateArray.push( c.tocNumber() );
        } )
    }
    else if ( arg1 instanceof CArea3D ) {
        if ( arg1.wsFrom == arg1.wsTo ) {
            dateArray = arg1.getMatrix()[0];
        }
        else
            return this.value = new CError( cErrorType.wrong_value_type );
    }
    else {
        arg1 = arg1.tocNumber();
        if ( arg1 instanceof CError ) {
            return this.value = new CError( cErrorType.not_numeric )
        }
        else
            dateArray[0] = arg1;
    }

    if ( arg2 instanceof CArea || arg2 instanceof CArea3D ) {
        arg2 = arg2.cross( arguments[1].first );
    }

    arg2 = arg2.tocNumber();

    if ( arg2 instanceof CArray ) {
        arg2 = arg2.getElement( 0 );
    }

    if ( arg2 instanceof CError ) {
        return this.value = arg2;
    }

    this.value = xirr( valueArray, dateArray, arg2 );
    this.value.numFormat = 9;
    return this.value;

};
cXIRR.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( values , dates [ , [ guess ] ] )"
    };
};

function cXNPV() {
//    cBaseFunction.call( this, "XNPV" );

    this.name = "XNPV";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 3;
    this.argumentsCurrent = 0;
    this.argumentsMax = 3;
    this.formatType = {
        def:-1, //подразумевается формат первой ячейки входящей в формулу.
        noneFormat:-2
    };
    this.numFormat = this.formatType.noneFormat;

}
cXNPV.prototype = Object.create( cBaseFunction.prototype );
cXNPV.prototype.Calculate = function ( arg ) {
    var arg0 = arg[0], arg1 = arg[1], arg2 = arg[2];

    function xnpv( rate, valueArray, dateArray ) {
        var res = 0, vaTmp, daTmp, r = rate.getValue();

        if ( dateArray.length != valueArray.length )
            return new CError( cErrorType.not_numeric );

        var d1 = dateArray[0].tocNumber();

        for ( var i = 0; i < dateArray.length; i++ ) {
            vaTmp = valueArray[i].tocNumber();
            daTmp = dateArray[i].tocNumber();
            if ( vaTmp instanceof  CError || daTmp instanceof CError )
                return new CError( cErrorType.not_numeric );

            res += valueArray[i].getValue() / ( Math.pow( ( 1 + r ), ( dateArray[i].getValue() - d1.getValue() ) / 365 ) )
        }

        return new CNumber( res );
    }

    if ( arg0 instanceof CArea || arg0 instanceof CArea3D ) {
        arg0 = arg0.cross( arguments[1].first );
    }

    arg0 = arg0.tocNumber();

    if ( arg0 instanceof CArray ) {
        arg0 = arg0.getElement( 0 );
    }
    if ( arg0 instanceof CError ) {
        return this.value = arg0;
    }

    var dateArray = [], valueArray = [];

    if ( arg1 instanceof CArea ) {
        arg1.foreach2( function ( c ) {
            valueArray.push( c )
        } );
//        valueArray = arg1.getMatrix();
    }
    else if ( arg1 instanceof CArray ) {
        arg1.foreach( function ( c ) {
            valueArray.push( c )
        } )
    }
    else if ( arg1 instanceof CArea3D ) {
        if ( arg1.wsFrom == arg1.wsTo ) {
            valueArray = arg1.getMatrix()[0];
        }
        else
            return this.value = new CError( cErrorType.wrong_value_type );
    }
    else {
        arg1 = arg1.tocNumber();
        if ( arg1 instanceof CError ) {
            return this.value = new CError( cErrorType.not_numeric )
        }
        else
            valueArray[0] = arg1;
    }

    if ( arg2 instanceof CArea ) {
        arg2.foreach2( function ( c ) {
            dateArray.push( c )
        } );
//        dateArray = arg2.getMatrix();
    }
    else if ( arg2 instanceof CArray ) {
//        dateArray = arg2.getMatrix();
        arg2.foreach( function ( c ) {
            dateArray.push( c )
        } )
    }
    else if ( arg2 instanceof CArea3D ) {
        if ( arg2.wsFrom == arg2.wsTo ) {
            dateArray = arg2.getMatrix()[0];
        }
        else
            return this.value = new CError( cErrorType.wrong_value_type );
    }
    else {
        arg2 = arg2.tocNumber();
        if ( arg2 instanceof CError ) {
            return this.value = new CError( cErrorType.not_numeric )
        }
        else
            dateArray[0] = arg2;
    }

    return this.value = xnpv( arg0, valueArray, dateArray );

};
cXNPV.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( rate , values , dates  )"
    };
};

function cYIELD() {
//    cBaseFunction.call( this, "YIELD" );

    this.name = "YIELD";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 6;
    this.argumentsCurrent = 0;
    this.argumentsMax = 7;
    this.formatType = {
        def:-1, //подразумевается формат первой ячейки входящей в формулу.
        noneFormat:-2
    };
    this.numFormat = this.formatType.noneFormat;

}
cYIELD.prototype = Object.create( cBaseFunction.prototype );
cYIELD.prototype.Calculate = function ( arg ) {
    var settlement = arg[0],
        maturity = arg[1],
        rate = arg[2],
        pr = arg[3],
        redemption = arg[4],
        frequency = arg[5],
        basis = arg[6] && !(arg[6] instanceof CEmpty) ? arg[6] : new CNumber( 0 );

    if ( settlement instanceof CArea || settlement instanceof CArea3D ) {
        settlement = settlement.cross( arguments[1].first );
    }
    else if ( settlement instanceof CArray ) {
        settlement = settlement.getElementRowCol( 0, 0 );
    }

    if ( maturity instanceof CArea || maturity instanceof CArea3D ) {
        maturity = maturity.cross( arguments[1].first );
    }
    else if ( maturity instanceof CArray ) {
        maturity = maturity.getElementRowCol( 0, 0 );
    }

    if ( rate instanceof CArea || rate instanceof CArea3D ) {
        rate = rate.cross( arguments[1].first );
    }
    else if ( rate instanceof CArray ) {
        rate = rate.getElementRowCol( 0, 0 );
    }

    if ( pr instanceof CArea || pr instanceof CArea3D ) {
        pr = pr.cross( arguments[1].first );
    }
    else if ( pr instanceof CArray ) {
        pr = pr.getElementRowCol( 0, 0 );
    }

    if ( redemption instanceof CArea || redemption instanceof CArea3D ) {
        redemption = redemption.cross( arguments[1].first );
    }
    else if ( redemption instanceof CArray ) {
        redemption = redemption.getElementRowCol( 0, 0 );
    }

    if ( frequency instanceof CArea || frequency instanceof CArea3D ) {
        frequency = frequency.cross( arguments[1].first );
    }
    else if ( frequency instanceof CArray ) {
        frequency = frequency.getElementRowCol( 0, 0 );
    }

    if ( basis instanceof CArea || basis instanceof CArea3D ) {
        basis = basis.cross( arguments[1].first );
    }
    else if ( basis instanceof CArray ) {
        basis = basis.getElementRowCol( 0, 0 );
    }

    settlement = settlement.tocNumber();
    maturity = maturity.tocNumber();
    rate = rate.tocNumber();
    pr = pr.tocNumber();
    redemption = redemption.tocNumber();
    frequency = frequency.tocNumber();
    basis = basis.tocNumber();

    if ( settlement instanceof CError ) return this.value = settlement;
    if ( maturity instanceof CError ) return this.value = maturity;
    if ( rate instanceof CError ) return this.value = rate;
    if ( pr instanceof CError ) return this.value = pr;
    if ( redemption instanceof CError ) return this.value = redemption;
    if ( frequency instanceof CError ) return this.value = frequency;
    if ( basis instanceof CError ) return this.value = basis;

    settlement = settlement.getValue();
    maturity = maturity.getValue();
    rate = rate.getValue();
    pr = pr.getValue();
    redemption = redemption.getValue();
    frequency = frequency.getValue();
    basis = basis.getValue();

    if ( settlement >= maturity ||
        basis < 0 || basis > 4 ||
        ( frequency != 1 && frequency != 2 && frequency != 4 ) ||
        rate < 0 ||
        pr <= 0 || redemption <= 0 )
        return this.value = new CError( cErrorType.not_numeric );

    var settl = Date.prototype.getDateFromExcel( settlement ),
        matur = Date.prototype.getDateFromExcel( maturity );

    this.value = new CNumber( getYield( settl, matur, rate, pr, redemption, frequency, basis ) );
//    this.value.numFormat = 9;
    return this.value;

};
cYIELD.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( settlement , maturity , rate , pr , redemption , frequency [ , [ basis ] ] )"
    };
};

function cYIELDDISC() {
//    cBaseFunction.call( this, "YIELDDISC" );

    this.name = "YIELDDISC";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 4;
    this.argumentsCurrent = 0;
    this.argumentsMax = 5;
    this.formatType = {
        def:-1, //подразумевается формат первой ячейки входящей в формулу.
        noneFormat:-2
    };
    this.numFormat = this.formatType.noneFormat;

}
cYIELDDISC.prototype = Object.create( cBaseFunction.prototype );
cYIELDDISC.prototype.Calculate = function ( arg ) {
    var settlement = arg[0],
        maturity = arg[1],
        pr = arg[2],
        redemption = arg[3],
        basis = arg[4] && !(arg[4] instanceof CEmpty) ? arg[4] : new CNumber( 0 );

    if ( settlement instanceof CArea || settlement instanceof CArea3D ) {
        settlement = settlement.cross( arguments[1].first );
    }
    else if ( settlement instanceof CArray ) {
        settlement = settlement.getElementRowCol( 0, 0 );
    }

    if ( maturity instanceof CArea || maturity instanceof CArea3D ) {
        maturity = maturity.cross( arguments[1].first );
    }
    else if ( maturity instanceof CArray ) {
        maturity = maturity.getElementRowCol( 0, 0 );
    }

    if ( pr instanceof CArea || pr instanceof CArea3D ) {
        pr = pr.cross( arguments[1].first );
    }
    else if ( pr instanceof CArray ) {
        pr = pr.getElementRowCol( 0, 0 );
    }

    if ( redemption instanceof CArea || redemption instanceof CArea3D ) {
        redemption = redemption.cross( arguments[1].first );
    }
    else if ( redemption instanceof CArray ) {
        redemption = redemption.getElementRowCol( 0, 0 );
    }

    if ( basis instanceof CArea || basis instanceof CArea3D ) {
        basis = basis.cross( arguments[1].first );
    }
    else if ( basis instanceof CArray ) {
        basis = basis.getElementRowCol( 0, 0 );
    }

    settlement = settlement.tocNumber();
    maturity = maturity.tocNumber();
    pr = pr.tocNumber();
    redemption = redemption.tocNumber();
    basis = basis.tocNumber();

    if ( settlement instanceof CError ) return this.value = settlement;
    if ( maturity instanceof CError ) return this.value = maturity;
    if ( pr instanceof CError ) return this.value = pr;
    if ( redemption instanceof CError ) return this.value = redemption;
    if ( basis instanceof CError ) return this.value = basis;

    settlement = settlement.getValue();
    maturity = maturity.getValue();
    pr = pr.getValue();
    redemption = redemption.getValue();
    basis = basis.getValue();

    if ( settlement >= maturity ||
        basis < 0 || basis > 4 ||
        pr <= 0 || redemption <= 0 )
        return this.value = new CError( cErrorType.not_numeric );

    var settl = Date.prototype.getDateFromExcel( settlement ),
        matur = Date.prototype.getDateFromExcel( maturity );

    var fRet = ( redemption / pr ) - 1;
    fRet /= yearFrac( settl, matur, basis );

    this.value = new CNumber( fRet );
    this.value.numFormat = 10;
    return this.value;

};
cYIELDDISC.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( settlement , maturity , pr , redemption , [ , [ basis ] ] )"
    };
};

function cYIELDMAT() {
//    cBaseFunction.call( this, "YIELDMAT" );

    this.name = "YIELDMAT";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 5;
    this.argumentsCurrent = 0;
    this.argumentsMax = 6;
    this.formatType = {
        def:-1, //подразумевается формат первой ячейки входящей в формулу.
        noneFormat:-2
    };
    this.numFormat = this.formatType.noneFormat;

}
cYIELDMAT.prototype = Object.create( cBaseFunction.prototype );
cYIELDMAT.prototype.Calculate = function ( arg ) {
    var settlement = arg[0],
        maturity = arg[1],
        issue = arg[2],
        rate = arg[3],
        pr = arg[4],
        basis = arg[5] && !(arg[5] instanceof CEmpty) ? arg[5] : new CNumber( 0 );

    if ( settlement instanceof CArea || settlement instanceof CArea3D ) {
        settlement = settlement.cross( arguments[1].first );
    }
    else if ( settlement instanceof CArray ) {
        settlement = settlement.getElementRowCol( 0, 0 );
    }

    if ( maturity instanceof CArea || maturity instanceof CArea3D ) {
        maturity = maturity.cross( arguments[1].first );
    }
    else if ( maturity instanceof CArray ) {
        maturity = maturity.getElementRowCol( 0, 0 );
    }

    if ( issue instanceof CArea || issue instanceof CArea3D ) {
        issue = issue.cross( arguments[1].first );
    }
    else if ( issue instanceof CArray ) {
        issue = issue.getElementRowCol( 0, 0 );
    }

    if ( rate instanceof CArea || rate instanceof CArea3D ) {
        rate = rate.cross( arguments[1].first );
    }
    else if ( rate instanceof CArray ) {
        rate = rate.getElementRowCol( 0, 0 );
    }

    if ( pr instanceof CArea || pr instanceof CArea3D ) {
        pr = pr.cross( arguments[1].first );
    }
    else if ( pr instanceof CArray ) {
        pr = pr.getElementRowCol( 0, 0 );
    }

    if ( basis instanceof CArea || basis instanceof CArea3D ) {
        basis = basis.cross( arguments[1].first );
    }
    else if ( basis instanceof CArray ) {
        basis = basis.getElementRowCol( 0, 0 );
    }

    settlement = settlement.tocNumber();
    maturity = maturity.tocNumber();
    issue = issue.tocNumber();
    rate = rate.tocNumber();
    pr = pr.tocNumber();
    basis = basis.tocNumber();

    if ( settlement instanceof CError ) return this.value = settlement;
    if ( maturity instanceof CError ) return this.value = maturity;
    if ( issue instanceof CError ) return this.value = issue;
    if ( rate instanceof CError ) return this.value = rate;
    if ( pr instanceof CError ) return this.value = pr;
    if ( basis instanceof CError ) return this.value = basis;

    settlement = settlement.getValue();
    maturity = maturity.getValue();
    issue = issue.getValue();
    rate = rate.getValue();
    pr = pr.getValue();
    basis = basis.getValue();

    if ( settlement >= maturity ||
        basis < 0 || basis > 4 ||
        pr <= 0 || rate <= 0 )
        return this.value = new CError( cErrorType.not_numeric );

    var settl = Date.prototype.getDateFromExcel( settlement ),
        matur = Date.prototype.getDateFromExcel( maturity ),
        iss = Date.prototype.getDateFromExcel( issue );

    var fRet = getyieldmat( settl, matur, iss, rate, pr, basis );

    this.value = new CNumber( fRet );
    this.value.numFormat = 10;
    return this.value;

};
cYIELDMAT.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( settlement , maturity , issue , rate , pr [ , [ basis ] ] )"
    };
};