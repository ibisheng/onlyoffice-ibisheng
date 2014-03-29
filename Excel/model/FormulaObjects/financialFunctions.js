"use strict";

function GetRmz( fZins, fZzr, fBw, fZw, nF ) {
    var fRmz;
    if ( fZins == 0.0 )
        fRmz = ( fBw + fZw ) / fZzr;
    else {
        var fTerm = Math.pow( 1.0 + fZins, fZzr );
        if ( nF > 0 )
            fRmz = ( fZw * fZins / ( fTerm - 1.0 ) + fBw * fZins / ( 1.0 - 1.0 / fTerm ) ) / ( 1.0 + fZins );
        else
            fRmz = fZw * fZins / ( fTerm - 1.0 ) + fBw * fZins / ( 1.0 - 1.0 / fTerm );
    }

    return -fRmz;
}

function GetZw( fZins, fZzr, fRmz, fBw, nF ) {
    var fZw;
    if ( fZins == 0.0 )
        fZw = fBw + fRmz * fZzr;
    else {
        var fTerm = Math.pow( 1.0 + fZins, fZzr );
        if ( nF > 0 )
            fZw = fBw * fTerm + fRmz * ( 1.0 + fZins ) * ( fTerm - 1.0 ) / fZins;
        else
            fZw = fBw * fTerm + fRmz * ( fTerm - 1.0 ) / fZins;
    }

    return -fZw;
}

function RateIteration( fNper, fPayment, fPv, fFv, fPayType, fGuess ) {
    function approxEqual( a, b ) {
        if ( a == b )
            return true;
        var x = a - b;
        return (x < 0.0 ? -x : x)
            < ((a < 0.0 ? -a : a) * (1.0 / (16777216.0 * 16777216.0)));
    }

    var bValid = true, bFound = false, fX, fXnew, fTerm, fTermDerivation, fGeoSeries, fGeoSeriesDerivation;
    var nIterationsMax = 150, nCount = 0, fEpsilonSmall = 1.0E-14, SCdEpsilon = 1.0E-7;
    fFv = fFv - fPayment * fPayType;
    fPv = fPv + fPayment * fPayType;
    if ( fNper == Math.round( fNper ) ) {
        fX = fGuess.fGuess;
        var fPowN, fPowNminus1;
        while ( !bFound && nCount < nIterationsMax ) {
            fPowNminus1 = Math.pow( 1.0 + fX, fNper - 1.0 );
            fPowN = fPowNminus1 * (1.0 + fX);
            if ( approxEqual( Math.abs( fX ), 0.0 ) ) {
                fGeoSeries = fNper;
                fGeoSeriesDerivation = fNper * (fNper - 1.0) / 2.0;
            }
            else {
                fGeoSeries = (fPowN - 1.0) / fX;
                fGeoSeriesDerivation = fNper * fPowNminus1 / fX - fGeoSeries / fX;
            }
            fTerm = fFv + fPv * fPowN + fPayment * fGeoSeries;
            fTermDerivation = fPv * fNper * fPowNminus1 + fPayment * fGeoSeriesDerivation;
            if ( Math.abs( fTerm ) < fEpsilonSmall )
                bFound = true;
            else {
                if ( approxEqual( Math.abs( fTermDerivation ), 0.0 ) )
                    fXnew = fX + 1.1 * SCdEpsilon;
                else
                    fXnew = fX - fTerm / fTermDerivation;
                nCount++;
                bFound = (Math.abs( fXnew - fX ) < SCdEpsilon);
                fX = fXnew;
            }
        }
        bValid = (fX >= -1.0);
    }
    else {
        fX = (fGuess.fGuest < -1.0) ? -1.0 : fGuess.fGuest;
        while ( bValid && !bFound && nCount < nIterationsMax ) {
            if ( approxEqual( Math.abs( fX ), 0.0 ) ) {
                fGeoSeries = fNper;
                fGeoSeriesDerivation = fNper * (fNper - 1.0) / 2.0;
            }
            else {
                fGeoSeries = (Math.pow( 1.0 + fX, fNper ) - 1.0) / fX;
                fGeoSeriesDerivation = fNper * Math.pow( 1.0 + fX, fNper - 1.0 ) / fX - fGeoSeries / fX;
            }
            fTerm = fFv + fPv * pow( 1.0 + fX, fNper ) + fPayment * fGeoSeries;
            fTermDerivation = fPv * fNper * Math.pow( 1.0 + fX, fNper - 1.0 ) + fPayment * fGeoSeriesDerivation;
            if ( Math.abs( fTerm ) < fEpsilonSmall )
                bFound = true;
            else {
                if ( approxEqual( Math.abs( fTermDerivation ), 0.0 ) )
                    fXnew = fX + 1.1 * SCdEpsilon;
                else
                    fXnew = fX - fTerm / fTermDerivation;
                nCount++;
                bFound = (Math.abs( fXnew - fX ) < SCdEpsilon);
                fX = fXnew;
                bValid = (fX >= -1.0);
            }
        }
    }
    fGuess.fGuess = fX;
    return bValid && bFound;
}

function lcl_GetCouppcd( settl, matur, freq ) {
    matur.setFullYear( settl.getFullYear() );
    if ( matur < settl )
        matur.addYears( 1 );
    while ( matur > settl ) {
        matur.addMonths( -12 / freq );
    }
}

function lcl_GetCoupncd( settl, matur, freq ) {
    matur.setFullYear( settl.getFullYear() );
    if ( matur > settl )
        matur.addYears( -1 );
    while ( matur <= settl ) {
        matur.addMonths( 12 / freq );
    }
}

function getcoupdaybs( settl, matur, frequency, basis ) {
    lcl_GetCouppcd( settl, matur, frequency );
    return diffDate( settl, matur, basis );
}

function getcoupdays( settl, matur, frequency, basis ) {
    lcl_GetCouppcd( settl, matur, frequency );
    var n = new Date( matur )
    n.addMonths( 12 / frequency );
    return diffDate( matur, n, basis );
}

function getcoupnum( settl, matur, frequency ) {
    var n = new Date( matur );
    lcl_GetCouppcd( settl, n, frequency );
    var nMonths = (matur.getFullYear() - n.getFullYear()) * 12 + matur.getMonth() - n.getMonth();
    return Math.ceil( nMonths * frequency / 12 );
}

function getcoupdaysnc( settl, matur, frequency, basis ) {

    if ( (basis != 0) && (basis != 4) ) {

        lcl_GetCoupncd( settl, matur, frequency );
        return diffDate( settl, matur, basis );

    }

    return getcoupdays( new Date( settl ), new Date( matur ), frequency, basis ) - getcoupdaybs( new Date( settl ), new Date( matur ), frequency, basis );
}

function getprice( nSettle, nMat, fRate, fYield, fRedemp, nFreq, nBase ) {

    var fE = getcoupdays( new Date( nSettle ), new Date( nMat ), nFreq, nBase );
    var fDSC_E = getcoupdaysnc( new Date( nSettle ), new Date( nMat ), nFreq, nBase ) / fE;
    var fN = getcoupnum( new Date( nSettle ), (nMat), nFreq, nBase );
    var fA = getcoupdaybs( new Date( nSettle ), new Date( nMat ), nFreq, nBase );

    var fRet = fRedemp / ( Math.pow( 1.0 + fYield / nFreq, fN - 1.0 + fDSC_E ) );
    fRet -= 100.0 * fRate / nFreq * fA / fE;

    var fT1 = 100.0 * fRate / nFreq;
    var fT2 = 1.0 + fYield / nFreq;

    for ( var fK = 0.0; fK < fN; fK++ ) {
        fRet += fT1 / Math.pow( fT2, fK + fDSC_E );
    }

    return fRet;
}

function getYield( nSettle, nMat, fCoup, fPrice, fRedemp, nFreq, nBase ) {
    var fRate = fCoup, fPriceN = 0.0, fYield1 = 0.0, fYield2 = 1.0;
    var fPrice1 = getprice( nSettle, nMat, fRate, fYield1, fRedemp, nFreq, nBase );
    var fPrice2 = getprice( nSettle, nMat, fRate, fYield2, fRedemp, nFreq, nBase );
    var fYieldN = ( fYield2 - fYield1 ) * 0.5;

    for ( var nIter = 0; nIter < 100 && fPriceN != fPrice; nIter++ ) {
        fPriceN = getprice( nSettle, nMat, fRate, fYieldN, fRedemp, nFreq, nBase );

        if ( fPrice == fPrice1 )
            return fYield1;
        else if ( fPrice == fPrice2 )
            return fYield2;
        else if ( fPrice == fPriceN )
            return fYieldN;
        else if ( fPrice < fPrice2 ) {
            fYield2 *= 2.0;
            fPrice2 = getprice( nSettle, nMat, fRate, fYield2, fRedemp, nFreq, nBase );

            fYieldN = ( fYield2 - fYield1 ) * 0.5;
        }
        else {
            if ( fPrice < fPriceN ) {
                fYield1 = fYieldN;
                fPrice1 = fPriceN;
            }
            else {
                fYield2 = fYieldN;
                fPrice2 = fPriceN;
            }

            fYieldN = fYield2 - ( fYield2 - fYield1 ) * ( ( fPrice - fPrice2 ) / ( fPrice1 - fPrice2 ) );
        }
    }

    if ( Math.abs( fPrice - fPriceN ) > fPrice / 100.0 )
        return new cError( cErrorType.not_numeric );		// result not precise enough

    return new cNumber( fYieldN );
}

function getyieldmat( nSettle, nMat, nIssue, fRate, fPrice, nBase ){

    var fIssMat = yearFrac( nIssue, nMat, nBase );
    var fIssSet = yearFrac( nIssue, nSettle, nBase );
    var fSetMat = yearFrac( nSettle, nMat, nBase );

    var y = 1.0 + fIssMat * fRate;
    y /= fPrice / 100.0 + fIssSet * fRate;
    y--;
    y /= fSetMat;

    return y;
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
}

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
cACCRINT.prototype = Object.create( cBaseFunction.prototype )
cACCRINT.prototype.Calculate = function ( arg ) {
    var arg0 = arg[0], arg1 = arg[1],
        arg2 = arg[2], arg3 = arg[3],
        arg4 = arg[4] && !(arg[4] instanceof cEmpty) ? arg[4] : new cNumber( 1000 ),
        arg5 = arg[5],
        arg6 = arg[6] && !(arg[6] instanceof cEmpty) ? arg[6] : new cNumber( 0 );

    function GetYearDiff( nNullDate, nStartDate, nEndDate, nMode ) {
        var nDays1stYear;

        switch ( nMode ) {
            case 0:
            case 4:
                nDays1stYear = 360;
                break;
            case 1:
                nDays1stYear = nStartDate.isLeapYear() ? 366 : 365;
                break;
            case 2:
                nDays1stYear = 360;
                break;
            case 3:
                nDays1stYear = 365;
                break;
        }

        var nTotalDays = yearFrac( nStartDate, nEndDate, nMode );

        return nTotalDays//nDays1stYear;
    }

    if ( arg0 instanceof cArea || arg0 instanceof cArea3D ) {
        arg0 = arg0.cross( arguments[1].first );
    }
    else if ( arg0 instanceof cArray ) {
        arg0 = arg0.getElementRowCol( 0, 0 );
    }

    if ( arg1 instanceof cArea || arg1 instanceof cArea3D ) {
        arg1 = arg1.cross( arguments[1].first );
    }
    else if ( arg1 instanceof cArray ) {
        arg1 = arg1.getElementRowCol( 0, 0 );
    }

    if ( arg2 instanceof cArea || arg2 instanceof cArea3D ) {
        arg2 = arg2.cross( arguments[1].first );
    }
    else if ( arg2 instanceof cArray ) {
        arg2 = arg2.getElementRowCol( 0, 0 );
    }

    if ( arg3 instanceof cArea || arg3 instanceof cArea3D ) {
        arg3 = arg3.cross( arguments[1].first );
    }
    else if ( arg3 instanceof cArray ) {
        arg3 = arg3.getElementRowCol( 0, 0 );
    }

    if ( arg4 instanceof cArea || arg4 instanceof cArea3D ) {
        arg4 = arg4.cross( arguments[1].first );
    }
    else if ( arg4 instanceof cArray ) {
        arg4 = arg4.getElementRowCol( 0, 0 );
    }

    if ( arg5 instanceof cArea || arg5 instanceof cArea3D ) {
        arg5 = arg5.cross( arguments[1].first );
    }
    else if ( arg5 instanceof cArray ) {
        arg5 = arg5.getElementRowCol( 0, 0 );
    }

    if ( arg6 instanceof cArea || arg6 instanceof cArea3D ) {
        arg6 = arg6.cross( arguments[1].first );
    }
    else if ( arg6 instanceof cArray ) {
        arg6 = arg6.getElementRowCol( 0, 0 );
    }

    arg0 = arg0.tocNumber();
    arg1 = arg1.tocNumber();
    arg2 = arg2.tocNumber();
    arg3 = arg3.tocNumber();
    arg4 = arg4.tocNumber();
    arg5 = arg5.tocNumber();
    arg6 = arg6.tocNumber();

    if ( arg0 instanceof cError ) return this.value = arg0;
    if ( arg1 instanceof cError ) return this.value = arg1;
    if ( arg2 instanceof cError ) return this.value = arg2;
    if ( arg3 instanceof cError ) return this.value = arg3;
    if ( arg4 instanceof cError ) return this.value = arg4;
    if ( arg5 instanceof cError ) return this.value = arg5;
    if ( arg6 instanceof cError ) return this.value = arg6;

    var _arg5 = arg5.getValue()

    if ( arg0.getValue() >= arg2.getValue() || arg3.getValue() <= 0 || arg4.getValue() <= 0 || arg6.getValue() < 0 || arg6.getValue() > 4 || (_arg5 != 1 && _arg5 != 2 && _arg5 != 4) ) {
        return this.value = new cError( cErrorType.not_numeric );
    }

    var res = GetYearDiff( Date.prototype.getDateFromExcel( arg0.getValue() ), Date.prototype.getDateFromExcel( arg0.getValue() ),
        Date.prototype.getDateFromExcel( arg2.getValue() ), arg6.getValue() )

    res = res * arg4.getValue() * arg3.getValue();

    return this.value = new cNumber( res )
}
cACCRINT.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( issue , first-interest , settlement , rate , [ par ] , frequency [ , [ basis ] ] )"
    };
}

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
cACCRINTM.prototype = Object.create( cBaseFunction.prototype )
cACCRINTM.prototype.Calculate = function ( arg ) {
    var arg0 = arg[0],
        arg1 = arg[1],
        arg2 = arg[2],
        arg3 = arg[3] && !(arg[3] instanceof cEmpty) ? arg[3] : new cNumber( 1000 ),
        arg4 = arg[4] && !(arg[4] instanceof cEmpty) ? arg[4] : new cNumber( 0 );

    function GetYearDiff( nStartDate, nEndDate, nMode ) {
        var nDays1stYear;

        switch ( nMode ) {
            case 0:
            case 4:
                nDays1stYear = 360;
                break;
            case 1:
                nDays1stYear = nStartDate.isLeapYear() ? 366 : 365;
                break;
            case 2:
                nDays1stYear = 360;
                break;
            case 3:
                nDays1stYear = 365;
                break;
        }

        var nTotalDays = yearFrac( nStartDate, nEndDate, nMode );

        return nTotalDays
    }

    if ( arg0 instanceof cArea || arg0 instanceof cArea3D ) {
        arg0 = arg0.cross( arguments[1].first );
    }
    else if ( arg0 instanceof cArray ) {
        arg0 = arg0.getElementRowCol( 0, 0 );
    }

    if ( arg1 instanceof cArea || arg1 instanceof cArea3D ) {
        arg1 = arg1.cross( arguments[1].first );
    }
    else if ( arg1 instanceof cArray ) {
        arg1 = arg1.getElementRowCol( 0, 0 );
    }

    if ( arg2 instanceof cArea || arg2 instanceof cArea3D ) {
        arg2 = arg2.cross( arguments[1].first );
    }
    else if ( arg2 instanceof cArray ) {
        arg2 = arg2.getElementRowCol( 0, 0 );
    }

    if ( arg3 instanceof cArea || arg3 instanceof cArea3D ) {
        arg3 = arg3.cross( arguments[1].first );
    }
    else if ( arg3 instanceof cArray ) {
        arg3 = arg3.getElementRowCol( 0, 0 );
    }

    if ( arg4 instanceof cArea || arg4 instanceof cArea3D ) {
        arg4 = arg4.cross( arguments[1].first );
    }
    else if ( arg4 instanceof cArray ) {
        arg4 = arg4.getElementRowCol( 0, 0 );
    }

    arg0 = arg0.tocNumber();
    arg1 = arg1.tocNumber();
    arg2 = arg2.tocNumber();
    arg3 = arg3.tocNumber();
    arg4 = arg4.tocNumber();

    if ( arg0 instanceof cError ) return this.value = arg0;
    if ( arg1 instanceof cError ) return this.value = arg1;
    if ( arg2 instanceof cError ) return this.value = arg2;
    if ( arg3 instanceof cError ) return this.value = arg3;
    if ( arg4 instanceof cError ) return this.value = arg4;

    if ( arg0.getValue() >= arg1.getValue() || arg3.getValue() <= 0 || arg4.getValue() < 0 || arg4.getValue() > 4 ) {
        return this.value = new cError( cErrorType.not_numeric );
    }

    var res = GetYearDiff( Date.prototype.getDateFromExcel( arg0.getValue() ),
        Date.prototype.getDateFromExcel( arg1.getValue() ), arg4.getValue() )

    res = res * arg2.getValue() * arg3.getValue();

    return this.value = new cNumber( res )
}
cACCRINTM.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( issue , settlement , rate , [ [ par ] [ , [ basis ] ] ] )"
    };
}

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
cAMORDEGRC.prototype = Object.create( cBaseFunction.prototype )
cAMORDEGRC.prototype.Calculate = function ( arg ) {
    var cost = arg[0],
        detePurch = arg[1],
        firstPer = arg[2],
        salvage = arg[3],
        period = arg[4],
        rate = arg[5],
        basis = arg[6] && !(arg[6] instanceof cEmpty) ? arg[6] : new cNumber( 0 );

    if ( cost instanceof cArea || cost instanceof cArea3D ) {
        cost = cost.cross( arguments[1].first );
    }
    else if ( cost instanceof cArray ) {
        cost = cost.getElementRowCol( 0, 0 );
    }

    if ( detePurch instanceof cArea || detePurch instanceof cArea3D ) {
        detePurch = detePurch.cross( arguments[1].first );
    }
    else if ( detePurch instanceof cArray ) {
        detePurch = detePurch.getElementRowCol( 0, 0 );
    }

    if ( firstPer instanceof cArea || firstPer instanceof cArea3D ) {
        firstPer = firstPer.cross( arguments[1].first );
    }
    else if ( firstPer instanceof cArray ) {
        firstPer = firstPer.getElementRowCol( 0, 0 );
    }

    if ( salvage instanceof cArea || salvage instanceof cArea3D ) {
        salvage = salvage.cross( arguments[1].first );
    }
    else if ( salvage instanceof cArray ) {
        salvage = salvage.getElementRowCol( 0, 0 );
    }

    if ( period instanceof cArea || period instanceof cArea3D ) {
        period = period.cross( arguments[1].first );
    }
    else if ( period instanceof cArray ) {
        period = period.getElementRowCol( 0, 0 );
    }

    if ( rate instanceof cArea || rate instanceof cArea3D ) {
        rate = rate.cross( arguments[1].first );
    }
    else if ( rate instanceof cArray ) {
        rate = rate.getElementRowCol( 0, 0 );
    }

    if ( basis instanceof cArea || basis instanceof cArea3D ) {
        basis = basis.cross( arguments[1].first );
    }
    else if ( basis instanceof cArray ) {
        basis = basis.getElementRowCol( 0, 0 );
    }

    cost = cost.tocNumber();
    detePurch = detePurch.tocNumber();
    firstPer = firstPer.tocNumber();
    salvage = salvage.tocNumber();
    period = period.tocNumber();
    rate = rate.tocNumber();
    basis = basis.tocNumber();

    if ( cost instanceof cError ) return this.value = cost;
    if ( detePurch instanceof cError ) return this.value = detePurch;
    if ( firstPer instanceof cError ) return this.value = firstPer;
    if ( salvage instanceof cError ) return this.value = salvage;
    if ( period instanceof cError ) return this.value = period;
    if ( rate instanceof cError ) return this.value = rate;
    if ( basis instanceof cError ) return this.value = basis;

    var fRate = rate.getValue(),
        fCost = cost.getValue(),
        fRestVal = salvage.getValue(),
        nPer = period.getValue()

    var fUsePer = 1.0 / fRate,
        fAmorCoeff;

    if ( fUsePer < 3.0 )
        fAmorCoeff = 1.0;
    else if ( fUsePer < 5.0 )
        fAmorCoeff = 1.5;
    else if ( fUsePer <= 6.0 )
        fAmorCoeff = 2.0;
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

        if ( fRest < 0.0 ) {
            switch ( nPer - n ) {
                case 0:
                case 1:
                    return this.value = new cNumber( Math.round( fCost * 0.5 ) );
                default:
                    return this.value = new cNumber( 0 );
            }
        }

        fCost -= fNRate;
    }

    return this.value = new cNumber( fNRate )

}
cAMORDEGRC.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( cost , date-purchased , first-period , salvage , period , rate [ , [ basis ] ] )"
    };
}

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
cAMORLINC.prototype = Object.create( cBaseFunction.prototype )
cAMORLINC.prototype.Calculate = function ( arg ) {
    var cost = arg[0],
        detePurch = arg[1],
        firstPer = arg[2],
        salvage = arg[3],
        period = arg[4],
        rate = arg[5],
        basis = arg[6] && !(arg[6] instanceof cEmpty) ? arg[6] : new cNumber( 0 );

    if ( cost instanceof cArea || cost instanceof cArea3D ) {
        cost = cost.cross( arguments[1].first );
    }
    else if ( cost instanceof cArray ) {
        cost = cost.getElementRowCol( 0, 0 );
    }

    if ( detePurch instanceof cArea || detePurch instanceof cArea3D ) {
        detePurch = detePurch.cross( arguments[1].first );
    }
    else if ( detePurch instanceof cArray ) {
        detePurch = detePurch.getElementRowCol( 0, 0 );
    }

    if ( firstPer instanceof cArea || firstPer instanceof cArea3D ) {
        firstPer = firstPer.cross( arguments[1].first );
    }
    else if ( firstPer instanceof cArray ) {
        firstPer = firstPer.getElementRowCol( 0, 0 );
    }

    if ( salvage instanceof cArea || salvage instanceof cArea3D ) {
        salvage = salvage.cross( arguments[1].first );
    }
    else if ( salvage instanceof cArray ) {
        salvage = salvage.getElementRowCol( 0, 0 );
    }

    if ( period instanceof cArea || period instanceof cArea3D ) {
        period = period.cross( arguments[1].first );
    }
    else if ( period instanceof cArray ) {
        period = period.getElementRowCol( 0, 0 );
    }

    if ( rate instanceof cArea || rate instanceof cArea3D ) {
        rate = rate.cross( arguments[1].first );
    }
    else if ( rate instanceof cArray ) {
        rate = rate.getElementRowCol( 0, 0 );
    }

    if ( basis instanceof cArea || basis instanceof cArea3D ) {
        basis = basis.cross( arguments[1].first );
    }
    else if ( basis instanceof cArray ) {
        basis = basis.getElementRowCol( 0, 0 );
    }

    cost = cost.tocNumber();
    detePurch = detePurch.tocNumber();
    firstPer = firstPer.tocNumber();
    salvage = salvage.tocNumber();
    period = period.tocNumber();
    rate = rate.tocNumber();
    basis = basis.tocNumber();

    if ( cost instanceof cError ) return this.value = cost;
    if ( detePurch instanceof cError ) return this.value = detePurch;
    if ( firstPer instanceof cError ) return this.value = firstPer;
    if ( salvage instanceof cError ) return this.value = salvage;
    if ( period instanceof cError ) return this.value = period;
    if ( rate instanceof cError ) return this.value = rate;
    if ( basis instanceof cError ) return this.value = basis;

    var fRate = rate.getValue(),
        fCost = cost.getValue(),
        fRestVal = salvage.getValue(),
        nPer = period.getValue()


    var val0 = Date.prototype.getDateFromExcel( detePurch.getValue() );
    var val1 = Date.prototype.getDateFromExcel( firstPer.getValue() );
    var fOneRate = fCost * fRate,
        fCostDelta = fCost - fRestVal;

    var f0Rate = yearFrac( val0, val1, basis.getValue() ) * fRate * fCost;

    var nNumOfFullPeriods = ( fCost - fRestVal - f0Rate) / fOneRate;

    if ( nPer == 0 )
        return this.value = new cNumber( f0Rate );
    else if ( nPer <= nNumOfFullPeriods )
        return this.value = new cNumber( fOneRate );
    else if ( nPer == nNumOfFullPeriods + 1 )
        return this.value = new cNumber( fCostDelta - fOneRate * nNumOfFullPeriods - f0Rate );
    else
        return this.value = new cNumber( 0.0 );

}
cAMORLINC.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( cost , date-purchased , first-period , salvage , period , rate [ , [ basis ] ] )"
    };
}

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
cCOUPDAYBS.prototype = Object.create( cBaseFunction.prototype )
cCOUPDAYBS.prototype.Calculate = function ( arg ) {
    var settlement = arg[0],
        maturity = arg[1],
        frequency = arg[2],
        basis = arg[3] && !(arg[3] instanceof cEmpty) ? arg[3] : new cNumber( 0 );

    if ( settlement instanceof cArea || settlement instanceof cArea3D ) {
        settlement = settlement.cross( arguments[1].first );
    }
    else if ( settlement instanceof cArray ) {
        settlement = settlement.getElementRowCol( 0, 0 );
    }

    if ( maturity instanceof cArea || maturity instanceof cArea3D ) {
        maturity = maturity.cross( arguments[1].first );
    }
    else if ( maturity instanceof cArray ) {
        maturity = maturity.getElementRowCol( 0, 0 );
    }

    if ( frequency instanceof cArea || frequency instanceof cArea3D ) {
        frequency = frequency.cross( arguments[1].first );
    }
    else if ( frequency instanceof cArray ) {
        frequency = frequency.getElementRowCol( 0, 0 );
    }

    if ( basis instanceof cArea || basis instanceof cArea3D ) {
        basis = basis.cross( arguments[1].first );
    }
    else if ( basis instanceof cArray ) {
        basis = basis.getElementRowCol( 0, 0 );
    }

    settlement = settlement.tocNumber();
    maturity = maturity.tocNumber();
    frequency = frequency.tocNumber();
    basis = basis.tocNumber();

    if ( settlement instanceof cError ) return this.value = settlement;
    if ( maturity instanceof cError ) return this.value = maturity;
    if ( frequency instanceof cError ) return this.value = frequency;
    if ( basis instanceof cError ) return this.value = basis;

    if ( settlement.getValue() >= maturity.getValue() || basis.getValue() < 0 || basis.getValue() > 4 || ( frequency.getValue() != 1 && frequency.getValue() != 2 && frequency.getValue() != 4 ) )
        return this.value = new cError( cErrorType.not_numeric );

    var settl = Date.prototype.getDateFromExcel( settlement.getValue() ),
        matur = Date.prototype.getDateFromExcel( maturity.getValue() );

    return this.value = new cNumber( getcoupdaybs( settl, matur, frequency.getValue(), basis.getValue() ) );

}
cCOUPDAYBS.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( settlement , maturity , frequency [ , [ basis ] ] )"
    };
}

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
cCOUPDAYS.prototype = Object.create( cBaseFunction.prototype )
cCOUPDAYS.prototype.Calculate = function ( arg ) {
    var settlement = arg[0],
        maturity = arg[1],
        frequency = arg[2],
        basis = arg[3] && !(arg[3] instanceof cEmpty) ? arg[3] : new cNumber( 0 );

    if ( settlement instanceof cArea || settlement instanceof cArea3D ) {
        settlement = settlement.cross( arguments[1].first );
    }
    else if ( settlement instanceof cArray ) {
        settlement = settlement.getElementRowCol( 0, 0 );
    }

    if ( maturity instanceof cArea || maturity instanceof cArea3D ) {
        maturity = maturity.cross( arguments[1].first );
    }
    else if ( maturity instanceof cArray ) {
        maturity = maturity.getElementRowCol( 0, 0 );
    }

    if ( frequency instanceof cArea || frequency instanceof cArea3D ) {
        frequency = frequency.cross( arguments[1].first );
    }
    else if ( frequency instanceof cArray ) {
        frequency = frequency.getElementRowCol( 0, 0 );
    }

    if ( basis instanceof cArea || basis instanceof cArea3D ) {
        basis = basis.cross( arguments[1].first );
    }
    else if ( basis instanceof cArray ) {
        basis = basis.getElementRowCol( 0, 0 );
    }

    settlement = settlement.tocNumber();
    maturity = maturity.tocNumber();
    frequency = frequency.tocNumber();
    basis = basis.tocNumber();

    if ( settlement instanceof cError ) return this.value = settlement;
    if ( maturity instanceof cError ) return this.value = maturity;
    if ( frequency instanceof cError ) return this.value = frequency;
    if ( basis instanceof cError ) return this.value = basis;

    if ( settlement.getValue() >= maturity.getValue() || basis.getValue() < 0 || basis.getValue() > 4 || ( frequency.getValue() != 1 && frequency.getValue() != 2 && frequency.getValue() != 4 ) )
        return this.value = new cError( cErrorType.not_numeric );

    var settl = Date.prototype.getDateFromExcel( settlement.getValue() ),
        matur = Date.prototype.getDateFromExcel( maturity.getValue() );

    return this.value = new cNumber( getcoupdays( settl, matur, frequency.getValue(), basis.getValue() ) );

}
cCOUPDAYS.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( settlement , maturity , frequency [ , [ basis ] ] )"
    };
}

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
cCOUPDAYSNC.prototype = Object.create( cBaseFunction.prototype )
cCOUPDAYSNC.prototype.Calculate = function ( arg ) {
    var settlement = arg[0],
        maturity = arg[1],
        frequency = arg[2],
        basis = arg[3] && !(arg[3] instanceof cEmpty) ? arg[3] : new cNumber( 0 );

    if ( settlement instanceof cArea || settlement instanceof cArea3D ) {
        settlement = settlement.cross( arguments[1].first );
    }
    else if ( settlement instanceof cArray ) {
        settlement = settlement.getElementRowCol( 0, 0 );
    }

    if ( maturity instanceof cArea || maturity instanceof cArea3D ) {
        maturity = maturity.cross( arguments[1].first );
    }
    else if ( maturity instanceof cArray ) {
        maturity = maturity.getElementRowCol( 0, 0 );
    }

    if ( frequency instanceof cArea || frequency instanceof cArea3D ) {
        frequency = frequency.cross( arguments[1].first );
    }
    else if ( frequency instanceof cArray ) {
        frequency = frequency.getElementRowCol( 0, 0 );
    }

    if ( basis instanceof cArea || basis instanceof cArea3D ) {
        basis = basis.cross( arguments[1].first );
    }
    else if ( basis instanceof cArray ) {
        basis = basis.getElementRowCol( 0, 0 );
    }

    settlement = settlement.tocNumber();
    maturity = maturity.tocNumber();
    frequency = frequency.tocNumber();
    basis = basis.tocNumber();

    if ( settlement instanceof cError ) return this.value = settlement;
    if ( maturity instanceof cError ) return this.value = maturity;
    if ( frequency instanceof cError ) return this.value = frequency;
    if ( basis instanceof cError ) return this.value = basis;

    if ( settlement.getValue() >= maturity.getValue() || basis.getValue() < 0 || basis.getValue() > 4 || ( frequency.getValue() != 1 && frequency.getValue() != 2 && frequency.getValue() != 4 ) )
        return this.value = new cError( cErrorType.not_numeric );

    var settl = Date.prototype.getDateFromExcel( settlement.getValue() ),
        matur = Date.prototype.getDateFromExcel( maturity.getValue() );

    frequency = frequency.getValue();
    basis = basis.getValue();

    return this.value = new cNumber( getcoupdaysnc( new Date( settl ), new Date( matur ), frequency, basis ) );

}
cCOUPDAYSNC.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( settlement , maturity , frequency [ , [ basis ] ] )"
    };
}

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
cCOUPNCD.prototype = Object.create( cBaseFunction.prototype )
cCOUPNCD.prototype.Calculate = function ( arg ) {
    var settlement = arg[0],
        maturity = arg[1],
        frequency = arg[2],
        basis = arg[3] && !(arg[3] instanceof cEmpty) ? arg[3] : new cNumber( 0 );

    if ( settlement instanceof cArea || settlement instanceof cArea3D ) {
        settlement = settlement.cross( arguments[1].first );
    }
    else if ( settlement instanceof cArray ) {
        settlement = settlement.getElementRowCol( 0, 0 );
    }

    if ( maturity instanceof cArea || maturity instanceof cArea3D ) {
        maturity = maturity.cross( arguments[1].first );
    }
    else if ( maturity instanceof cArray ) {
        maturity = maturity.getElementRowCol( 0, 0 );
    }

    if ( frequency instanceof cArea || frequency instanceof cArea3D ) {
        frequency = frequency.cross( arguments[1].first );
    }
    else if ( frequency instanceof cArray ) {
        frequency = frequency.getElementRowCol( 0, 0 );
    }

    if ( basis instanceof cArea || basis instanceof cArea3D ) {
        basis = basis.cross( arguments[1].first );
    }
    else if ( basis instanceof cArray ) {
        basis = basis.getElementRowCol( 0, 0 );
    }

    settlement = settlement.tocNumber();
    maturity = maturity.tocNumber();
    frequency = frequency.tocNumber();
    basis = basis.tocNumber();

    if ( settlement instanceof cError ) return this.value = settlement;
    if ( maturity instanceof cError ) return this.value = maturity;
    if ( frequency instanceof cError ) return this.value = frequency;
    if ( basis instanceof cError ) return this.value = basis;

    if ( settlement.getValue() >= maturity.getValue() || basis.getValue() < 0 || basis.getValue() > 4 || ( frequency.getValue() != 1 && frequency.getValue() != 2 && frequency.getValue() != 4 ) )
        return this.value = new cError( cErrorType.not_numeric );

    var settl = Date.prototype.getDateFromExcel( settlement.getValue() ),
        matur = Date.prototype.getDateFromExcel( maturity.getValue() );

    frequency = frequency.getValue();
    basis = basis.getValue();

    lcl_GetCoupncd( settl, matur, frequency );
    this.value = new cNumber( matur.getExcelDate() );
    this.value.numFormat = 14;
    return this.value;

}
cCOUPNCD.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( settlement , maturity , frequency [ , [ basis ] ] )"
    };
}

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
cCOUPNUM.prototype = Object.create( cBaseFunction.prototype )
cCOUPNUM.prototype.Calculate = function ( arg ) {
    var settlement = arg[0],
        maturity = arg[1],
        frequency = arg[2],
        basis = arg[3] && !(arg[3] instanceof cEmpty) ? arg[3] : new cNumber( 0 );

    if ( settlement instanceof cArea || settlement instanceof cArea3D ) {
        settlement = settlement.cross( arguments[1].first );
    }
    else if ( settlement instanceof cArray ) {
        settlement = settlement.getElementRowCol( 0, 0 );
    }

    if ( maturity instanceof cArea || maturity instanceof cArea3D ) {
        maturity = maturity.cross( arguments[1].first );
    }
    else if ( maturity instanceof cArray ) {
        maturity = maturity.getElementRowCol( 0, 0 );
    }

    if ( frequency instanceof cArea || frequency instanceof cArea3D ) {
        frequency = frequency.cross( arguments[1].first );
    }
    else if ( frequency instanceof cArray ) {
        frequency = frequency.getElementRowCol( 0, 0 );
    }

    if ( basis instanceof cArea || basis instanceof cArea3D ) {
        basis = basis.cross( arguments[1].first );
    }
    else if ( basis instanceof cArray ) {
        basis = basis.getElementRowCol( 0, 0 );
    }

    settlement = settlement.tocNumber();
    maturity = maturity.tocNumber();
    frequency = frequency.tocNumber();
    basis = basis.tocNumber();

    if ( settlement instanceof cError ) return this.value = settlement;
    if ( maturity instanceof cError ) return this.value = maturity;
    if ( frequency instanceof cError ) return this.value = frequency;
    if ( basis instanceof cError ) return this.value = basis;

    if ( settlement.getValue() >= maturity.getValue() || basis.getValue() < 0 || basis.getValue() > 4 || ( frequency.getValue() != 1 && frequency.getValue() != 2 && frequency.getValue() != 4 ) )
        return this.value = new cError( cErrorType.not_numeric );

    var settl = Date.prototype.getDateFromExcel( settlement.getValue() ),
        matur = Date.prototype.getDateFromExcel( maturity.getValue() );

    frequency = frequency.getValue();
    basis = basis.getValue();

    var res = getcoupnum( settl, matur, frequency );

    return this.value = new cNumber( res );

}
cCOUPNUM.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( settlement , maturity , frequency [ , [ basis ] ] )"
    };
}

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
cCOUPPCD.prototype = Object.create( cBaseFunction.prototype )
cCOUPPCD.prototype.Calculate = function ( arg ) {
    var settlement = arg[0],
        maturity = arg[1],
        frequency = arg[2],
        basis = arg[3] && !(arg[3] instanceof cEmpty) ? arg[3] : new cNumber( 0 );

    if ( settlement instanceof cArea || settlement instanceof cArea3D ) {
        settlement = settlement.cross( arguments[1].first );
    }
    else if ( settlement instanceof cArray ) {
        settlement = settlement.getElementRowCol( 0, 0 );
    }

    if ( maturity instanceof cArea || maturity instanceof cArea3D ) {
        maturity = maturity.cross( arguments[1].first );
    }
    else if ( maturity instanceof cArray ) {
        maturity = maturity.getElementRowCol( 0, 0 );
    }

    if ( frequency instanceof cArea || frequency instanceof cArea3D ) {
        frequency = frequency.cross( arguments[1].first );
    }
    else if ( frequency instanceof cArray ) {
        frequency = frequency.getElementRowCol( 0, 0 );
    }

    if ( basis instanceof cArea || basis instanceof cArea3D ) {
        basis = basis.cross( arguments[1].first );
    }
    else if ( basis instanceof cArray ) {
        basis = basis.getElementRowCol( 0, 0 );
    }

    settlement = settlement.tocNumber();
    maturity = maturity.tocNumber();
    frequency = frequency.tocNumber();
    basis = basis.tocNumber();

    if ( settlement instanceof cError ) return this.value = settlement;
    if ( maturity instanceof cError ) return this.value = maturity;
    if ( frequency instanceof cError ) return this.value = frequency;
    if ( basis instanceof cError ) return this.value = basis;

    if ( settlement.getValue() >= maturity.getValue() || basis.getValue() < 0 || basis.getValue() > 4 || ( frequency.getValue() != 1 && frequency.getValue() != 2 && frequency.getValue() != 4 ) )
        return this.value = new cError( cErrorType.not_numeric );

    var settl = Date.prototype.getDateFromExcel( settlement.getValue() ),
        matur = Date.prototype.getDateFromExcel( maturity.getValue() );

    frequency = frequency.getValue();
    basis = basis.getValue();

    lcl_GetCouppcd( settl, matur, frequency );

    this.value = new cNumber( matur.getExcelDate() );
    this.value.numFormat = 14;
    return this.value;

}
cCOUPPCD.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( settlement , maturity , frequency [ , [ basis ] ] )"
    };
}

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
cCUMIPMT.prototype = Object.create( cBaseFunction.prototype )
cCUMIPMT.prototype.Calculate = function ( arg ) {
    var rate = arg[0],
        nper = arg[1],
        pv = arg[2],
        startPeriod = arg[3],
        endPeriod = arg[4],
        type = arg[5];

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

    if ( startPeriod instanceof cArea || startPeriod instanceof cArea3D ) {
        startPeriod = startPeriod.cross( arguments[1].first );
    }
    else if ( startPeriod instanceof cArray ) {
        startPeriod = startPeriod.getElementRowCol( 0, 0 );
    }

    if ( endPeriod instanceof cArea || endPeriod instanceof cArea3D ) {
        endPeriod = endPeriod.cross( arguments[1].first );
    }
    else if ( endPeriod instanceof cArray ) {
        endPeriod = endPeriod.getElementRowCol( 0, 0 );
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
    startPeriod = startPeriod.tocNumber();
    endPeriod = endPeriod.tocNumber();
    type = type.tocNumber();

    if ( rate instanceof cError ) return this.value = rate;
    if ( nper instanceof cError ) return this.value = nper;
    if ( pv instanceof cError ) return this.value = pv;
    if ( startPeriod instanceof cError ) return this.value = startPeriod;
    if ( endPeriod instanceof cError ) return this.value = endPeriod;
    if ( type instanceof cError ) return this.value = type;

    var fRate = rate.getValue(),
        nNumPeriods = nper.getValue(),
        fVal = pv.getValue(),
        nStartPer = startPeriod.getValue(),
        nEndPer = endPeriod.getValue(),
        nPayType = type.getValue(),
        fRmz, fZinsZ = 0;

    if ( nStartPer < 1 || nEndPer < nStartPer || fRate <= 0 || nEndPer > nNumPeriods || nNumPeriods <= 0 || fVal <= 0 || ( nPayType != 0 && nPayType != 1 ) )
        return this.value = new cError( cErrorType.not_numeric );

    fRmz = GetRmz( fRate, nNumPeriods, fVal, 0, nPayType );

    if ( nStartPer == 1 ) {
        if ( nPayType <= 0 )
            fZinsZ = -fVal;

        nStartPer++;
    }

    for ( var i = nStartPer; i <= nEndPer; i++ ) {
        if ( nPayType > 0 )
            fZinsZ += GetZw( fRate, i - 2, fRmz, fVal, 1 ) - fRmz;
        else
            fZinsZ += GetZw( fRate, i - 1, fRmz, fVal, 0 );
    }

    fZinsZ *= fRate;

    return this.value = new cNumber( fZinsZ );

}
cCUMIPMT.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( rate , nper , pv , start-period , end-period , type )"
    };
}

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
cCUMPRINC.prototype = Object.create( cBaseFunction.prototype )
cCUMPRINC.prototype.Calculate = function ( arg ) {
    var rate = arg[0],
        nper = arg[1],
        pv = arg[2],
        startPeriod = arg[3],
        endPeriod = arg[4] && !(arg[4] instanceof cEmpty) ? arg[4] : new cNumber( 0 ),
        type = arg[5] && !(arg[5] instanceof cEmpty) ? arg[5] : new cNumber( 0 );

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

    if ( startPeriod instanceof cArea || startPeriod instanceof cArea3D ) {
        startPeriod = startPeriod.cross( arguments[1].first );
    }
    else if ( startPeriod instanceof cArray ) {
        startPeriod = startPeriod.getElementRowCol( 0, 0 );
    }

    if ( endPeriod instanceof cArea || endPeriod instanceof cArea3D ) {
        endPeriod = endPeriod.cross( arguments[1].first );
    }
    else if ( endPeriod instanceof cArray ) {
        endPeriod = endPeriod.getElementRowCol( 0, 0 );
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
    startPeriod = startPeriod.tocNumber();
    endPeriod = endPeriod.tocNumber();
    type = type.tocNumber();

    if ( rate instanceof cError ) return this.value = rate;
    if ( nper instanceof cError ) return this.value = nper;
    if ( pv instanceof cError ) return this.value = pv;
    if ( startPeriod instanceof cError ) return this.value = startPeriod;
    if ( endPeriod instanceof cError ) return this.value = endPeriod;
    if ( type instanceof cError ) return this.value = type;

    var fRate = rate.getValue(),
        nNumPeriods = nper.getValue(),
        fVal = pv.getValue(),
        nStartPer = startPeriod.getValue(),
        nEndPer = endPeriod.getValue(),
        nPayType = type.getValue(),
        fRmz, fKapZ;

    if ( nStartPer < 1 || nEndPer < nStartPer || nEndPer < 1 || fRate <= 0 || nNumPeriods <= 0 || fVal <= 0 || ( nPayType != 0 && nPayType != 1 ) )
        return this.value = new cError( cErrorType.not_numeric );

    fRmz = GetRmz( fRate, nNumPeriods, fVal, 0.0, nPayType );

    fKapZ = 0.0;

    var nStart = nStartPer;
    var nEnd = nEndPer;

    if ( nStart == 1 ) {
        if ( nPayType <= 0 )
            fKapZ = fRmz + fVal * fRate;
        else
            fKapZ = fRmz;

        nStart++;
    }

    for ( var i = nStart; i <= nEnd; i++ ) {
        if ( nPayType > 0 )
            fKapZ += fRmz - ( GetZw( fRate, i - 2, fRmz, fVal, 1 ) - fRmz ) * fRate;
        else
            fKapZ += fRmz - GetZw( fRate, i - 1, fRmz, fVal, 0 ) * fRate;
    }

    return this.value = new cNumber( fKapZ );

}
cCUMPRINC.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( rate , nper , pv , start-period , end-period , type )"
    };
}

function cDB() {
    cBaseFunction.call( this, "DB" );
}
cDB.prototype = Object.create( cBaseFunction.prototype )

function cDDB() {
    cBaseFunction.call( this, "DDB" );
}
cDDB.prototype = Object.create( cBaseFunction.prototype )

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
cDISC.prototype = Object.create( cBaseFunction.prototype )
cDISC.prototype.Calculate = function ( arg ) {
    var settlement = arg[0],
        maturity = arg[1],
        pr = arg[2],
        redemption = arg[3],
        basis = arg[4] && !(arg[4] instanceof cEmpty) ? arg[4] : new cNumber( 0 );

    if ( settlement instanceof cArea || settlement instanceof cArea3D ) {
        settlement = settlement.cross( arguments[1].first );
    }
    else if ( settlement instanceof cArray ) {
        settlement = settlement.getElementRowCol( 0, 0 );
    }

    if ( maturity instanceof cArea || maturity instanceof cArea3D ) {
        maturity = maturity.cross( arguments[1].first );
    }
    else if ( maturity instanceof cArray ) {
        maturity = maturity.getElementRowCol( 0, 0 );
    }

    if ( pr instanceof cArea || pr instanceof cArea3D ) {
        pr = pr.cross( arguments[1].first );
    }
    else if ( pr instanceof cArray ) {
        pr = pr.getElementRowCol( 0, 0 );
    }

    if ( redemption instanceof cArea || redemption instanceof cArea3D ) {
        redemption = redemption.cross( arguments[1].first );
    }
    else if ( redemption instanceof cArray ) {
        redemption = redemption.getElementRowCol( 0, 0 );
    }

    if ( basis instanceof cArea || basis instanceof cArea3D ) {
        basis = basis.cross( arguments[1].first );
    }
    else if ( basis instanceof cArray ) {
        basis = basis.getElementRowCol( 0, 0 );
    }

    settlement = settlement.tocNumber();
    maturity = maturity.tocNumber();
    pr = pr.tocNumber();
    redemption = redemption.tocNumber();
    basis = basis.tocNumber();

    if ( settlement instanceof cError ) return this.value = settlement;
    if ( maturity instanceof cError ) return this.value = maturity;
    if ( pr instanceof cError ) return this.value = pr;
    if ( redemption instanceof cError ) return this.value = redemption;
    if ( basis instanceof cError ) return this.value = basis;

    if ( settlement.getValue() >= maturity.getValue() || pr.getValue() <= 0 || redemption.getValue() <= 0 || basis.getValue() < 0 || basis.getValue() > 4 )
        return this.value = new cError( cErrorType.not_numeric );

    var res = ( 1.0 - pr.getValue() / redemption.getValue() ) / yearFrac( Date.prototype.getDateFromExcel( settlement.getValue() ), Date.prototype.getDateFromExcel( maturity.getValue() ), basis.getValue() )

    this.value = new cNumber( res );
    this.value.numFormat = 9;
    return this.value;

}
cDISC.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( settlement , maturity , pr , redemption [ , [ basis ] ] )"
    };
}

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
cDOLLARDE.prototype = Object.create( cBaseFunction.prototype )
cDOLLARDE.prototype.Calculate = function ( arg ) {
    var fractionalDollar = arg[0],
        fraction = arg[1];

    if ( fractionalDollar instanceof cArea || fractionalDollar instanceof cArea3D ) {
        fractionalDollar = fractionalDollar.cross( arguments[1].first );
    }
    else if ( fractionalDollar instanceof cArray ) {
        fractionalDollar = fractionalDollar.getElementRowCol( 0, 0 );
    }

    if ( fraction instanceof cArea || fraction instanceof cArea3D ) {
        fraction = fraction.cross( arguments[1].first );
    }
    else if ( fraction instanceof cArray ) {
        fraction = fraction.getElementRowCol( 0, 0 );
    }

    fractionalDollar = fractionalDollar.tocNumber();
    fraction = fraction.tocNumber();

    if ( fractionalDollar instanceof cError ) return this.value = fractionalDollar;
    if ( fraction instanceof cError ) return this.value = fraction;

    fractionalDollar = fractionalDollar.getValue();
    fraction = fraction.getValue();

    if ( fraction < 0 )
        return this.value = new cError( cErrorType.not_numeric );
    else if ( fraction == 0 )
        return this.value = new cError( cErrorType.division_by_zero );

    var fInt = Math.floor( fractionalDollar ), res = fractionalDollar - fInt;

    res /= fraction;

    res *= Math.pow( 10, Math.ceil( Math.log( fraction ) / Math.log( 10 ) ) );

    res += fInt;

    return  this.value = new cNumber( res );

}
cDOLLARDE.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( fractional-dollar , fraction )"
    };
}

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
cDOLLARFR.prototype = Object.create( cBaseFunction.prototype )
cDOLLARFR.prototype.Calculate = function ( arg ) {
    var decimalDollar = arg[0],
        fraction = arg[1];

    if ( decimalDollar instanceof cArea || decimalDollar instanceof cArea3D ) {
        decimalDollar = decimalDollar.cross( arguments[1].first );
    }
    else if ( decimalDollar instanceof cArray ) {
        decimalDollar = decimalDollar.getElementRowCol( 0, 0 );
    }

    if ( fraction instanceof cArea || fraction instanceof cArea3D ) {
        fraction = fraction.cross( arguments[1].first );
    }
    else if ( fraction instanceof cArray ) {
        fraction = fraction.getElementRowCol( 0, 0 );
    }

    decimalDollar = decimalDollar.tocNumber();
    fraction = fraction.tocNumber();

    if ( decimalDollar instanceof cError ) return this.value = decimalDollar;
    if ( fraction instanceof cError ) return this.value = fraction;

    decimalDollar = decimalDollar.getValue();
    fraction = fraction.getValue();

    if ( fraction < 0 )
        return this.value = new cError( cErrorType.not_numeric );
    else if ( fraction == 0 )
        return this.value = new cError( cErrorType.division_by_zero );

    var fInt = Math.floor( decimalDollar ), res = decimalDollar - fInt;

    res *= fraction;

    res *= Math.pow( 10.0, -Math.ceil( Math.log( fraction ) / Math.log( 10 ) ) );

    res += fInt;

    return  this.value = new cNumber( res );

}
cDOLLARFR.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( decimal-dollar , fraction )"
    };
}

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
cDURATION.prototype = Object.create( cBaseFunction.prototype )
/*cDURATION.prototype.Calculate = function ( arg ) {
 var settlement = arg[0],
 maturity = arg[1],
 coupon = arg[2],
 yld = arg[3],
 frequency = arg[4],
 basis = arg[5] && !(arg[5] instanceof cEmpty) ? arg[5] : new cNumber(0 );

 if ( settlement instanceof cArea || settlement instanceof cArea3D ) {
 settlement = settlement.cross( arguments[1].first );
 }
 else if ( settlement instanceof cArray ) {
 settlement = settlement.getElementRowCol( 0, 0 );
 }

 if ( maturity instanceof cArea || maturity instanceof cArea3D ) {
 maturity = maturity.cross( arguments[1].first );
 }
 else if ( maturity instanceof cArray ) {
 maturity = maturity.getElementRowCol( 0, 0 );
 }

 if ( coupon instanceof cArea || coupon instanceof cArea3D ) {
 coupon = coupon.cross( arguments[1].first );
 }
 else if ( coupon instanceof cArray ) {
 coupon = coupon.getElementRowCol( 0, 0 );
 }

 if ( yld instanceof cArea || yld instanceof cArea3D ) {
 yld = yld.cross( arguments[1].first );
 }
 else if ( yld instanceof cArray ) {
 yld = yld.getElementRowCol( 0, 0 );
 }

 if ( frequency instanceof cArea || frequency instanceof cArea3D ) {
 frequency = frequency.cross( arguments[1].first );
 }
 else if ( frequency instanceof cArray ) {
 frequency = frequency.getElementRowCol( 0, 0 );
 }

 if ( basis instanceof cArea || basis instanceof cArea3D ) {
 basis = basis.cross( arguments[1].first );
 }
 else if ( basis instanceof cArray ) {
 basis = basis.getElementRowCol( 0, 0 );
 }

 settlement = settlement.tocNumber();
 maturity = maturity.tocNumber();
 coupon = coupon.tocNumber();
 yld = yld.tocNumber();
 frequency = frequency.tocNumber();
 basis = basis.tocNumber();

 if ( settlement instanceof cError ) return this.value = settlement;
 if ( maturity instanceof cError ) return this.value = maturity;
 if ( coupon instanceof cError ) return this.value = coupon;
 if ( yld instanceof cError ) return this.value = yld;
 if ( frequency instanceof cError ) return this.value = frequency;
 if ( basis instanceof cError ) return this.value = basis;

 if( settlement.getValue() >= maturity.getValue() ||
 basis.getValue() < 0 || basis.getValue() > 4 ||
 ( frequency.getValue() != 1 && frequency.getValue() != 2 && frequency.getValue() != 4 ) ||
 yld.getValue() < 0 || coupon.getValue < 0 )
 return this.value = new cError( cErrorType.not_numeric );

 settlement = settlement.getValue();
 maturity = maturity.getValue();
 coupon = coupon.getValue();
 yld = yld.getValue();
 frequency = frequency.getValue();
 basis = basis.getValue();

 var settl = Date.prototype.getDateFromExcel( settlement ),
 matur = Date.prototype.getDateFromExcel( maturity );

 var fYearfrac = yearFrac( settl, matur, basis ).getValue();
 //    var fYearfrac = diffDate2( settl, matur, basis ).getValue();
 var fNumOfCoups = getcoupnum( settl, matur, frequency, basis );
 var fDur = 0,	f100 = 100;
 coupon = coupon * f100 / frequency;	// fCoup is used as cash flow
 yld = yld / frequency + 1;

 var nDiff = Math.round(fYearfrac * frequency - fNumOfCoups);

 var t,p = 0;

 for( t = 1 ; t < fNumOfCoups ; t++ ){
 fDur += ( t + nDiff ) * ( coupon ) / Math.pow( yld, t + nDiff );
 p += coupon / Math.pow( yld, t + nDiff );
 }

 fDur += ( fNumOfCoups + nDiff ) * ( coupon + f100 ) / Math.pow( yld, fNumOfCoups + nDiff );
 p += ( coupon + f100 ) / Math.pow( yld, fNumOfCoups + nDiff );

 fDur /= p;
 fDur /= frequency;

 return this.value = new cNumber( fDur );

 }
 cDURATION.prototype.getInfo = function () {
 return {
 name:this.name,
 args:"( settlement , maturity , coupon , yld , frequency [ , [ basis ] ] )"
 };
 }*/

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
cEFFECT.prototype = Object.create( cBaseFunction.prototype )
cEFFECT.prototype.Calculate = function ( arg ) {
    var nominalRate = arg[0], npery = arg[1];

    if ( nominalRate instanceof cArea || nominalRate instanceof cArea3D ) {
        nominalRate = nominalRate.cross( arguments[1].first );
    }
    else if ( nominalRate instanceof cArray ) {
        nominalRate = nominalRate.getElementRowCol( 0, 0 );
    }

    if ( npery instanceof cArea || npery instanceof cArea3D ) {
        npery = npery.cross( arguments[1].first );
    }
    else if ( npery instanceof cArray ) {
        npery = npery.getElementRowCol( 0, 0 );
    }

    nominalRate = nominalRate.tocNumber();
    npery = npery.tocNumber();

    if ( nominalRate instanceof cError ) return this.value = nominalRate;
    if ( npery instanceof cError ) return this.value = npery;

    var nr = nominalRate.getValue(), np = npery.getValue();
    if ( nominalRate.getValue() <= 0 || npery.getValue() < 1 ) {
        return this.value = new cError( cErrorType.not_numeric );
    }

    return this.value = new cNumber( Math.pow( (1 + nr / np), np ) - 1 );
}
cEFFECT.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( nominal-rate , npery )"
    };
}

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
cFVSCHEDULE.prototype = Object.create( cBaseFunction.prototype )
cFVSCHEDULE.prototype.Calculate = function ( arg ) {
    var principal = arg[0],
        schedule = arg[1],
        shedList = [];

    if ( principal instanceof cArea || principal instanceof cArea3D ) {
        principal = principal.cross( arguments[1].first );
    }
    else if ( principal instanceof cArray ) {
        principal = principal.getElementRowCol( 0, 0 );
    }

    if ( schedule instanceof cArea || schedule instanceof cArea3D ) {
        schedule.foreach2( function ( v ) {
            shedList.push( v.tocNumber() );
        } )
    }
    else if ( schedule instanceof cArray ) {
        schedule.foreach( function ( v ) {
            shedList.push( v.tocNumber() );
        } )
    }
    else {
        shedList.push( schedule.tocNumber() )
    }

    principal = principal.tocNumber();

    if ( principal instanceof cError ) return this.value = principal;

    var princ = principal.getValue();

    for ( var i = 0; i < shedList.length; i++ ) {
        if ( shedList[i] instanceof cError ) {
            return this.value = new cError( cErrorType.wrong_value_type );
        }
        else {
            princ *= 1 + shedList[i].getValue();
        }
    }

    return this.value = new cNumber( princ );

}
cFVSCHEDULE.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( principal , schedule )"
    };
}

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
cINTRATE.prototype = Object.create( cBaseFunction.prototype )
cINTRATE.prototype.Calculate = function ( arg ) {
    var settlement = arg[0],
        maturity = arg[1],
        investment = arg[2],
        redemption = arg[3],
        basis = arg[4] && !(arg[4] instanceof cEmpty) ? arg[4] : new cNumber( 0 );

    if ( settlement instanceof cArea || settlement instanceof cArea3D ) {
        settlement = settlement.cross( arguments[1].first );
    }
    else if ( settlement instanceof cArray ) {
        settlement = settlement.getElementRowCol( 0, 0 );
    }

    if ( maturity instanceof cArea || maturity instanceof cArea3D ) {
        maturity = maturity.cross( arguments[1].first );
    }
    else if ( maturity instanceof cArray ) {
        maturity = maturity.getElementRowCol( 0, 0 );
    }

    if ( investment instanceof cArea || investment instanceof cArea3D ) {
        investment = investment.cross( arguments[1].first );
    }
    else if ( investment instanceof cArray ) {
        investment = investment.getElementRowCol( 0, 0 );
    }

    if ( redemption instanceof cArea || redemption instanceof cArea3D ) {
        redemption = redemption.cross( arguments[1].first );
    }
    else if ( redemption instanceof cArray ) {
        redemption = redemption.getElementRowCol( 0, 0 );
    }

    if ( basis instanceof cArea || basis instanceof cArea3D ) {
        basis = basis.cross( arguments[1].first );
    }
    else if ( basis instanceof cArray ) {
        basis = basis.getElementRowCol( 0, 0 );
    }

    settlement = settlement.tocNumber();
    maturity = maturity.tocNumber();
    investment = investment.tocNumber();
    redemption = redemption.tocNumber();
    basis = basis.tocNumber();

    if ( settlement instanceof cError ) return this.value = settlement;
    if ( maturity instanceof cError ) return this.value = maturity;
    if ( investment instanceof cError ) return this.value = investment;
    if ( redemption instanceof cError ) return this.value = redemption;
    if ( basis instanceof cError ) return this.value = basis;

    if ( settlement.getValue() >= maturity.getValue() || investment.getValue() <= 0 || redemption.getValue() <= 0 || basis.getValue() < 0 || basis.getValue() > 4 )
        return this.value = new cError( cErrorType.not_numeric );


    var res = ( ( redemption.getValue() / investment.getValue() ) - 1 ) / yearFrac( Date.prototype.getDateFromExcel( settlement.getValue() ), Date.prototype.getDateFromExcel( maturity.getValue() ), basis.getValue() )

    this.value = new cNumber( res );
    this.value.numFormat = 9;
    return this.value;

}
cINTRATE.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( settlement , maturity , pr , redemption [ , [ basis ] ] )"
    };
}

function cIPMT() {
    cBaseFunction.call( this, "IPMT" );
}
cIPMT.prototype = Object.create( cBaseFunction.prototype )

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
cIRR.prototype = Object.create( cBaseFunction.prototype )
cIRR.prototype.Calculate = function ( arg ) {
    var arg0 = arg[0], arg1 = arg[1] ? arg[1] : new cNumber( 0.1 );

    function irr( arr, x ) {
        x = x.getValue();

        var nC = 0, g_Eps = 1e-7, fEps = 1.0, fZ = 0, fN = 0, xN = 0, nIM = 100, nMC = 0, arr0 = arr[0], arrI, wasNegative = false, wasPositive = false;

        if ( arr0 instanceof cError ) {
            return new cError( cErrorType.not_available );
        }

        if ( arr0.getValue() < 0 )
            wasNegative = true;
        else if ( arr0.getValue() > 0 )
            wasPositive = true;
        if ( arr.length < 2 )
            return new cError( cErrorType.not_numeric );

        while ( fEps > g_Eps && nMC < nIM ) {
            nC = 0;
            fZ = 0;
            fN = 0;
            fZ += arr0.getValue() / Math.pow( 1.0 + x, nC );
            fN += -nC * arr0.getValue() / Math.pow( 1 + x, nC + 1 );
            nC++;
            for ( var i = 1; i < arr.length; i++ ) {
                if ( arr[i] instanceof cError ) {
                    return new cError( cErrorType.not_available );
                }
                arrI = arr[i].getValue()
                fZ += arrI / Math.pow( 1.0 + x, nC );
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
            return new cError( cErrorType.not_numeric );

        if ( fEps < g_Eps )
            return new cNumber( x );
        else
            return new cError( cErrorType.not_numeric );
    }

    var arr = []
    if ( arg0 instanceof cArray ) {
        arg0.foreach( function ( v ) {
            arr.push( v.tocNumber() )
        } )
    }
    else if ( arg0 instanceof cArea ) {
        arg0.foreach2( function ( v ) {
            arr.push( v.tocNumber() )
        } )
    }

    arg1 = arg1.tocNumber();

    if ( arg1 instanceof cError ) {
        return this.value = new cError( cErrorType.not_numeric );
    }
    this.value = irr( arr, arg1 );
    this.value.numFormat = 9;
    return this.value;

}
cIRR.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( values [ , [ guess ] ] )"
    };
}

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
cISPMT.prototype = Object.create( cBaseFunction.prototype )
cISPMT.prototype.Calculate = function ( arg ) {
    var rate = arg[0], per = arg[1], nper = arg[2], pv = arg[3];

    if ( rate instanceof cArea || rate instanceof cArea3D ) {
        rate = rate.cross( arguments[1].first );
    }
    else if ( rate instanceof cArray ) {
        rate = rate.getElementRowCol( 0, 0 );
    }

    if ( per instanceof cArea || per instanceof cArea3D ) {
        per = per.cross( arguments[1].first );
    }
    else if ( per instanceof cArray ) {
        per = per.getElementRowCol( 0, 0 );
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

    rate = rate.tocNumber();
    per = per.tocNumber();
    nper = nper.tocNumber();
    pv = pv.tocNumber();

    if ( rate instanceof cError ) return this.value = rate;
    if ( per instanceof cError ) return this.value = per;
    if ( nper instanceof cError ) return this.value = nper;
    if ( pv instanceof cError ) return this.value = pv;

    return this.value = new cNumber( pv.getValue() * rate.getValue() * (per.getValue() / nper.getValue() - 1.0) );
}
cISPMT.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( rate , per , nper , pv )"
    };
}

function cMDURATION() {
    cBaseFunction.call( this, "MDURATION" );
}
cMDURATION.prototype = Object.create( cBaseFunction.prototype )

function cMIRR() {
    cBaseFunction.call( this, "MIRR" );
}
cMIRR.prototype = Object.create( cBaseFunction.prototype )

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
cNOMINAL.prototype = Object.create( cBaseFunction.prototype )
cNOMINAL.prototype.Calculate = function ( arg ) {
    var effectRate = arg[0],
        npery = arg[1];

    if ( effectRate instanceof cArea || effectRate instanceof cArea3D ) {
        effectRate = effectRate.cross( arguments[1].first );
    }
    else if ( effectRate instanceof cArray ) {
        effectRate = effectRate.getElementRowCol( 0, 0 );
    }

    if ( npery instanceof cArea || npery instanceof cArea3D ) {
        npery = npery.cross( arguments[1].first );
    }
    else if ( npery instanceof cArray ) {
        npery = npery.getElementRowCol( 0, 0 );
    }

    effectRate = effectRate.tocNumber();
    npery = npery.tocNumber();

    if ( effectRate instanceof cError ) return this.value = effectRate;
    if ( npery instanceof cError ) return this.value = npery;

    var eR = effectRate.getValue(),
        np = npery.getValue(), res;

    if ( eR <= 0 || npery < 1 )
        return this.value = new cError( cErrorType.not_numeric );
    this.value = new cNumber( ( Math.pow( eR + 1, 1 / np ) - 1 ) * np );
//    this.value.numFormat = 9;
    return this.value;

}
cNOMINAL.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( effect-rate , npery )"
    };
}

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
cPRICE.prototype = Object.create( cBaseFunction.prototype )
cPRICE.prototype.Calculate = function ( arg ) {
    var settlement = arg[0],
        maturity = arg[1],
        rate = arg[2],
        yld = arg[3],
        redemption = arg[4],
        frequency = arg[5],
        basis = arg[6] && !(arg[6] instanceof cEmpty) ? arg[6] : new cNumber( 0 );

    if ( settlement instanceof cArea || settlement instanceof cArea3D ) {
        settlement = settlement.cross( arguments[1].first );
    }
    else if ( settlement instanceof cArray ) {
        settlement = settlement.getElementRowCol( 0, 0 );
    }

    if ( maturity instanceof cArea || maturity instanceof cArea3D ) {
        maturity = maturity.cross( arguments[1].first );
    }
    else if ( maturity instanceof cArray ) {
        maturity = maturity.getElementRowCol( 0, 0 );
    }

    if ( rate instanceof cArea || rate instanceof cArea3D ) {
        rate = rate.cross( arguments[1].first );
    }
    else if ( rate instanceof cArray ) {
        rate = rate.getElementRowCol( 0, 0 );
    }

    if ( yld instanceof cArea || yld instanceof cArea3D ) {
        yld = yld.cross( arguments[1].first );
    }
    else if ( yld instanceof cArray ) {
        yld = yld.getElementRowCol( 0, 0 );
    }

    if ( redemption instanceof cArea || redemption instanceof cArea3D ) {
        redemption = redemption.cross( arguments[1].first );
    }
    else if ( redemption instanceof cArray ) {
        redemption = redemption.getElementRowCol( 0, 0 );
    }

    if ( frequency instanceof cArea || frequency instanceof cArea3D ) {
        frequency = frequency.cross( arguments[1].first );
    }
    else if ( frequency instanceof cArray ) {
        frequency = frequency.getElementRowCol( 0, 0 );
    }

    if ( basis instanceof cArea || basis instanceof cArea3D ) {
        basis = basis.cross( arguments[1].first );
    }
    else if ( basis instanceof cArray ) {
        basis = basis.getElementRowCol( 0, 0 );
    }

    settlement = settlement.tocNumber();
    maturity = maturity.tocNumber();
    rate = rate.tocNumber();
    yld = yld.tocNumber();
    redemption = redemption.tocNumber();
    frequency = frequency.tocNumber();
    basis = basis.tocNumber();

    if ( settlement instanceof cError ) return this.value = settlement;
    if ( maturity instanceof cError ) return this.value = maturity;
    if ( rate instanceof cError ) return this.value = rate;
    if ( yld instanceof cError ) return this.value = yld;
    if ( redemption instanceof cError ) return this.value = redemption;
    if ( frequency instanceof cError ) return this.value = frequency;
    if ( basis instanceof cError ) return this.value = basis;

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
        return this.value = new cError( cErrorType.not_numeric );

    var settl = Date.prototype.getDateFromExcel( settlement ),
        matur = Date.prototype.getDateFromExcel( maturity );

    return this.value = new cNumber( getprice( settl, matur, rate, yld, redemption, frequency, basis ) );

}
cPRICE.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( settlement , maturity , rate , yld , redemption , frequency [ , [ basis ] ] )"
    };
}

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
cPRICEDISC.prototype = Object.create( cBaseFunction.prototype )
cPRICEDISC.prototype.Calculate = function ( arg ) {
    var settlement = arg[0],
        maturity = arg[1],
        discount = arg[2],
        redemption = arg[3],
        basis = arg[4] && !(arg[4] instanceof cEmpty) ? arg[4] : new cNumber( 0 );

    if ( settlement instanceof cArea || settlement instanceof cArea3D ) {
        settlement = settlement.cross( arguments[1].first );
    }
    else if ( settlement instanceof cArray ) {
        settlement = settlement.getElementRowCol( 0, 0 );
    }

    if ( maturity instanceof cArea || maturity instanceof cArea3D ) {
        maturity = maturity.cross( arguments[1].first );
    }
    else if ( maturity instanceof cArray ) {
        maturity = maturity.getElementRowCol( 0, 0 );
    }

    if ( discount instanceof cArea || discount instanceof cArea3D ) {
        discount = discount.cross( arguments[1].first );
    }
    else if ( discount instanceof cArray ) {
        discount = discount.getElementRowCol( 0, 0 );
    }

    if ( redemption instanceof cArea || redemption instanceof cArea3D ) {
        redemption = redemption.cross( arguments[1].first );
    }
    else if ( redemption instanceof cArray ) {
        redemption = redemption.getElementRowCol( 0, 0 );
    }

    if ( basis instanceof cArea || basis instanceof cArea3D ) {
        basis = basis.cross( arguments[1].first );
    }
    else if ( basis instanceof cArray ) {
        basis = basis.getElementRowCol( 0, 0 );
    }

    settlement = settlement.tocNumber();
    maturity = maturity.tocNumber();
    discount = discount.tocNumber();
    redemption = redemption.tocNumber();
    basis = basis.tocNumber();

    if ( settlement instanceof cError ) return this.value = settlement;
    if ( maturity instanceof cError ) return this.value = maturity;
    if ( discount instanceof cError ) return this.value = discount;
    if ( redemption instanceof cError ) return this.value = redemption;
    if ( basis instanceof cError ) return this.value = basis;

    settlement = settlement.getValue();
    maturity = maturity.getValue();
    discount = discount.getValue();
    redemption = redemption.getValue();
    basis = basis.getValue();

    if ( settlement >= maturity ||
        basis < 0 || basis > 4 ||
        discount <= 0 || redemption <= 0 )
        return this.value = new cError( cErrorType.not_numeric );

    var settl = Date.prototype.getDateFromExcel( settlement ),
        matur = Date.prototype.getDateFromExcel( maturity );

//    var res = redemption * ( 1.0 - discount * diffDate( settl, matur, basis ) );
    var res = redemption * ( 1.0 - discount * GetDiffDate( settl, matur, basis ) );

    return this.value = new cNumber( res );

}
cPRICEDISC.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( settlement , maturity , discount , redemption [ , [ basis ] ] )"
    };
}

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
cPRICEMAT.prototype = Object.create( cBaseFunction.prototype )
cPRICEMAT.prototype.Calculate = function ( arg ) {
    var settlement = arg[0],
        maturity = arg[1],
        issue = arg[2],
        rate = arg[3],
        yld = arg[4],
        basis = arg[5] && !(arg[5] instanceof cEmpty) ? arg[5] : new cNumber( 0 );

    if ( settlement instanceof cArea || settlement instanceof cArea3D ) {
        settlement = settlement.cross( arguments[1].first );
    }
    else if ( settlement instanceof cArray ) {
        settlement = settlement.getElementRowCol( 0, 0 );
    }

    if ( maturity instanceof cArea || maturity instanceof cArea3D ) {
        maturity = maturity.cross( arguments[1].first );
    }
    else if ( maturity instanceof cArray ) {
        maturity = maturity.getElementRowCol( 0, 0 );
    }

    if ( issue instanceof cArea || issue instanceof cArea3D ) {
        issue = issue.cross( arguments[1].first );
    }
    else if ( issue instanceof cArray ) {
        issue = issue.getElementRowCol( 0, 0 );
    }

    if ( rate instanceof cArea || rate instanceof cArea3D ) {
        rate = rate.cross( arguments[1].first );
    }
    else if ( rate instanceof cArray ) {
        rate = rate.getElementRowCol( 0, 0 );
    }

    if ( yld instanceof cArea || yld instanceof cArea3D ) {
        yld = yld.cross( arguments[1].first );
    }
    else if ( yld instanceof cArray ) {
        yld = yld.getElementRowCol( 0, 0 );
    }

    if ( basis instanceof cArea || basis instanceof cArea3D ) {
        basis = basis.cross( arguments[1].first );
    }
    else if ( basis instanceof cArray ) {
        basis = basis.getElementRowCol( 0, 0 );
    }

    settlement = settlement.tocNumber();
    maturity = maturity.tocNumber();
    issue = issue.tocNumber();
    rate = rate.tocNumber();
    yld = yld.tocNumber();
    basis = basis.tocNumber();

    if ( settlement instanceof cError ) return this.value = settlement;
    if ( maturity instanceof cError ) return this.value = maturity;
    if ( issue instanceof cError ) return this.value = issue;
    if ( rate instanceof cError ) return this.value = rate;
    if ( yld instanceof cError ) return this.value = yld;
    if ( basis instanceof cError ) return this.value = basis;

    settlement = settlement.getValue();
    maturity = maturity.getValue();
    issue = issue.getValue();
    rate = rate.getValue();
    yld = yld.getValue();
    basis = basis.getValue();

    if ( settlement >= maturity ||
        basis < 0 || basis > 4 ||
        rate <= 0 || yld <= 0 )
        return this.value = new cError( cErrorType.not_numeric );

    var settl = Date.prototype.getDateFromExcel( settlement ),
        matur = Date.prototype.getDateFromExcel( maturity ),
        iss = Date.prototype.getDateFromExcel( issue );

    var fIssMat = yearFrac( new Date( iss ), new Date( matur ), basis );
    var fIssSet = yearFrac( new Date( iss ), new Date( settl ), basis );
    var fSetMat = yearFrac( new Date( settl ), new Date( matur ), basis );

    var res = 1.0 + fIssMat * rate;
    res /= 1.0 + fSetMat * yld;
    res -= fIssSet * rate;
    res *= 100.0;

    return this.value = new cNumber( res );

}
cPRICEMAT.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( settlement , maturity , discount , redemption [ , [ basis ] ] )"
    };
}

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
cRATE.prototype = Object.create( cBaseFunction.prototype )
cRATE.prototype.Calculate = function ( arg ) {

    var nper = arg[0], pmt = arg[1], pv = arg[2], fv = arg[3] ? arg[3] : new cNumber( 0 ), type = arg[4] ? arg[4] : new cNumber( 0 ), quess = arg[5] ? arg[5] : new cNumber( 0.1 )

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

    if ( quess instanceof cArea || quess instanceof cArea3D ) {
        quess = quess.cross( arguments[1].first );
    }
    else if ( quess instanceof cArray ) {
        quess = quess.getElementRowCol( 0, 0 );
    }

    nper = nper.tocNumber();
    pmt = pmt.tocNumber();
    pv = pv.tocNumber();
    fv = fv.tocNumber();
    type = type.tocNumber();
    quess = quess.tocNumber();

    if ( nper instanceof cError ) return this.value = nper;
    if ( pmt instanceof cError ) return this.value = pmt;
    if ( pv instanceof cError ) return this.value = pv;
    if ( fv instanceof cError ) return this.value = fv;
    if ( type instanceof cError ) return this.value = type;
    if ( quess instanceof cError ) return this.value = quess;

    if ( type.getValue() != 1 && type.getValue() != 0 ) return this.value = new cError( cErrorType.not_numeric );

    var guess = {fGuess:quess.getValue()};

    var bValid = RateIteration( nper.getValue(), pmt.getValue(), pv.getValue(), fv.getValue(), type.getValue(), guess );
    if ( !bValid )
        return this.value = new cError( cErrorType.wrong_value_type );

    this.value = new cNumber( guess.fGuess );
    this.value.numFormat = 9;
    return this.value;
}
cRATE.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( nper , pmt , pv  [ , [ [ fv ] [ , [ [ type ] [ , [ guess ] ] ] ] ] ] )"
    };
}

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
cRECEIVED.prototype = Object.create( cBaseFunction.prototype )
cRECEIVED.prototype.Calculate = function ( arg ) {
    var settlement = arg[0],
        maturity = arg[1],
        investment = arg[2],
        discount = arg[3],
        basis = arg[4] && !(arg[4] instanceof cEmpty) ? arg[4] : new cNumber( 0 );

    if ( settlement instanceof cArea || settlement instanceof cArea3D ) {
        settlement = settlement.cross( arguments[1].first );
    }
    else if ( settlement instanceof cArray ) {
        settlement = settlement.getElementRowCol( 0, 0 );
    }

    if ( maturity instanceof cArea || maturity instanceof cArea3D ) {
        maturity = maturity.cross( arguments[1].first );
    }
    else if ( maturity instanceof cArray ) {
        maturity = maturity.getElementRowCol( 0, 0 );
    }

    if ( investment instanceof cArea || investment instanceof cArea3D ) {
        investment = investment.cross( arguments[1].first );
    }
    else if ( investment instanceof cArray ) {
        investment = investment.getElementRowCol( 0, 0 );
    }

    if ( discount instanceof cArea || discount instanceof cArea3D ) {
        discount = discount.cross( arguments[1].first );
    }
    else if ( discount instanceof cArray ) {
        discount = discount.getElementRowCol( 0, 0 );
    }

    if ( basis instanceof cArea || basis instanceof cArea3D ) {
        basis = basis.cross( arguments[1].first );
    }
    else if ( basis instanceof cArray ) {
        basis = basis.getElementRowCol( 0, 0 );
    }

    settlement = settlement.tocNumber();
    maturity = maturity.tocNumber();
    investment = investment.tocNumber();
    discount = discount.tocNumber();
    basis = basis.tocNumber();

    if ( settlement instanceof cError ) return this.value = settlement;
    if ( maturity instanceof cError ) return this.value = maturity;
    if ( investment instanceof cError ) return this.value = investment;
    if ( discount instanceof cError ) return this.value = discount;
    if ( basis instanceof cError ) return this.value = basis;

    if ( settlement.getValue() >= maturity.getValue() || investment.getValue() <= 0 || discount.getValue() <= 0 || basis.getValue() < 0 || basis.getValue() > 4 )
        return this.value = new cError( cErrorType.not_numeric );

    var res = investment.getValue() / ( 1 - ( discount.getValue() * yearFrac( Date.prototype.getDateFromExcel( settlement.getValue() ), Date.prototype.getDateFromExcel( maturity.getValue() ), basis.getValue() ) ) )

    this.value = new cNumber( res );
//    this.value.numFormat = 9;
    return this.value;

}
cRECEIVED.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( settlement , maturity , investment , discount [ , [ basis ] ] )"
    };
}

function cSLN() {
    cBaseFunction.call( this, "SLN" );
}
cSLN.prototype = Object.create( cBaseFunction.prototype )

function cSYD() {
    cBaseFunction.call( this, "SYD" );
}
cSYD.prototype = Object.create( cBaseFunction.prototype )

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
cTBILLEQ.prototype = Object.create( cBaseFunction.prototype )
cTBILLEQ.prototype.Calculate = function ( arg ) {
    var settlement = arg[0],
        maturity = arg[1],
        discount = arg[2];

    if ( settlement instanceof cArea || settlement instanceof cArea3D ) {
        settlement = settlement.cross( arguments[1].first );
    }
    else if ( settlement instanceof cArray ) {
        settlement = settlement.getElementRowCol( 0, 0 );
    }

    if ( maturity instanceof cArea || maturity instanceof cArea3D ) {
        maturity = maturity.cross( arguments[1].first );
    }
    else if ( maturity instanceof cArray ) {
        maturity = maturity.getElementRowCol( 0, 0 );
    }

    if ( discount instanceof cArea || discount instanceof cArea3D ) {
        discount = discount.cross( arguments[1].first );
    }
    else if ( discount instanceof cArray ) {
        discount = discount.getElementRowCol( 0, 0 );
    }

    settlement = settlement.tocNumber();
    maturity = maturity.tocNumber();
    discount = discount.tocNumber();

    if ( settlement instanceof cError ) return this.value = settlement;
    if ( maturity instanceof cError ) return this.value = maturity;
    if ( discount instanceof cError ) return this.value = discount;

    var nMat = maturity.getValue();
    nMat++;

    var d1 = Date.prototype.getDateFromExcel( settlement.getValue() )
    var d2 = Date.prototype.getDateFromExcel( nMat )
    var date1 = d1.getDate(), month1 = d1.getMonth(), year1 = d1.getFullYear(),
        date2 = d2.getDate(), month2 = d2.getMonth(), year2 = d2.getFullYear();

    var nDiff = GetDiffDate360( date1, month1, year1, d1.isLeapYear(), date2, month2, year2, true )

    if ( settlement.getValue() >= maturity.getValue() || discount.getValue() <= 0 || nDiff > 360 )
        return this.value = new cError( cErrorType.not_numeric );

    var res = ( 365 * discount.getValue() ) / ( 360 - ( discount.getValue() * nDiff ) );

    this.value = new cNumber( res );
    this.value.numFormat = 9;
    return this.value;

}
cTBILLEQ.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( settlement , maturity , discount )"
    };
}

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
cTBILLPRICE.prototype = Object.create( cBaseFunction.prototype )
cTBILLPRICE.prototype.Calculate = function ( arg ) {
    var settlement = arg[0],
        maturity = arg[1],
        discount = arg[2];

    if ( settlement instanceof cArea || settlement instanceof cArea3D ) {
        settlement = settlement.cross( arguments[1].first );
    }
    else if ( settlement instanceof cArray ) {
        settlement = settlement.getElementRowCol( 0, 0 );
    }

    if ( maturity instanceof cArea || maturity instanceof cArea3D ) {
        maturity = maturity.cross( arguments[1].first );
    }
    else if ( maturity instanceof cArray ) {
        maturity = maturity.getElementRowCol( 0, 0 );
    }

    if ( discount instanceof cArea || discount instanceof cArea3D ) {
        discount = discount.cross( arguments[1].first );
    }
    else if ( discount instanceof cArray ) {
        discount = discount.getElementRowCol( 0, 0 );
    }

    settlement = settlement.tocNumber();
    maturity = maturity.tocNumber();
    discount = discount.tocNumber();

    if ( settlement instanceof cError ) return this.value = settlement;
    if ( maturity instanceof cError ) return this.value = maturity;
    if ( discount instanceof cError ) return this.value = discount;

    var nMat = maturity.getValue();
    nMat++;

    var d1 = Date.prototype.getDateFromExcel( settlement.getValue() )
    var d2 = Date.prototype.getDateFromExcel( nMat )

    var fFraction = yearFrac( d1, d2, 0 );

    if ( fFraction - Math.floor( fFraction ) == 0 )
        return this.value = new cError( cErrorType.not_numeric )

    var res = 100 * ( 1 - discount.getValue() * fFraction );

    if ( settlement.getValue() >= maturity.getValue() || discount.getValue() <= 0 )
        return this.value = new cError( cErrorType.not_numeric );

    this.value = new cNumber( res );
//    this.value.numFormat = 9;
    return this.value;

}
cTBILLPRICE.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( settlement , maturity , discount )"
    };
}

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
cTBILLYIELD.prototype = Object.create( cBaseFunction.prototype )
cTBILLYIELD.prototype.Calculate = function ( arg ) {
    var settlement = arg[0],
        maturity = arg[1],
        pr = arg[2];

    if ( settlement instanceof cArea || settlement instanceof cArea3D ) {
        settlement = settlement.cross( arguments[1].first );
    }
    else if ( settlement instanceof cArray ) {
        settlement = settlement.getElementRowCol( 0, 0 );
    }

    if ( maturity instanceof cArea || maturity instanceof cArea3D ) {
        maturity = maturity.cross( arguments[1].first );
    }
    else if ( maturity instanceof cArray ) {
        maturity = maturity.getElementRowCol( 0, 0 );
    }

    if ( pr instanceof cArea || pr instanceof cArea3D ) {
        pr = pr.cross( arguments[1].first );
    }
    else if ( pr instanceof cArray ) {
        pr = pr.getElementRowCol( 0, 0 );
    }

    settlement = settlement.tocNumber();
    maturity = maturity.tocNumber();
    pr = pr.tocNumber();

    if ( settlement instanceof cError ) return this.value = settlement;
    if ( maturity instanceof cError ) return this.value = maturity;
    if ( pr instanceof cError ) return this.value = pr;

    var d1 = Date.prototype.getDateFromExcel( settlement.getValue() )
    var d2 = Date.prototype.getDateFromExcel( maturity.getValue() )
    var date1 = d1.getDate(), month1 = d1.getMonth(), year1 = d1.getFullYear(),
        date2 = d2.getDate(), month2 = d2.getMonth(), year2 = d2.getFullYear();

    var nDiff = GetDiffDate360( date1, month1, year1, d1.isLeapYear(), date2, month2, year2, true )
    nDiff++;
    if ( settlement.getValue() >= maturity.getValue() || pr.getValue() <= 0 || nDiff > 360 )
        return this.value = new cError( cErrorType.not_numeric );

    pr = pr.getValue();

    var res = ( ( 100 - pr ) / pr) * (360 / nDiff);

    this.value = new cNumber( res );
    this.value.numFormat = 9;
    return this.value;

}
cTBILLYIELD.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( settlement , maturity , pr )"
    };
}

function cVDB() {
    cBaseFunction.call( this, "VDB" );
}
cVDB.prototype = Object.create( cBaseFunction.prototype )

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
cXIRR.prototype = Object.create( cBaseFunction.prototype )
cXIRR.prototype.Calculate = function ( arg ) {
    var arg0 = arg[0], arg1 = arg[1], arg2 = arg[2] ? arg[2] : new cNumber( 0.1 );

    function lcl_sca_XirrResult( rValues, rDates, fRate ) {
        /*  V_0 ... V_n = input values.
         D_0 ... D_n = input dates.
         R           = input interest rate.

         r   := R+1
         E_i := (D_i-D_0) / 365

         n    V_i                n    V_i
         f(R)  =  SUM   -------  =  V_0 + SUM   ------- .
         i=0  r^E_i              i=1  r^E_i
         */
        var D_0 = rDates[0];
        var r = fRate + 1.0;
        var fResult = rValues[0];
        for ( var i = 1, nCount = rValues.length; i < nCount; ++i )
            fResult += rValues[i] / Math.pow( r, (rDates[i] - D_0) / 365.0 );
        return fResult;
    }

    function lcl_sca_XirrResult_Deriv1( rValues, rDates, fRate ) {
        /*  V_0 ... V_n = input values.
         D_0 ... D_n = input dates.
         R           = input interest rate.

         r   := R+1
         E_i := (D_i-D_0) / 365

         n    V_i
         f'(R)  =  [ V_0 + SUM   ------- ]'
         i=1  r^E_i

         n           V_i                 n    E_i V_i
         =  0 + SUM   -E_i ----------- r'  =  - SUM   ----------- .
         i=1       r^(E_i+1)             i=1  r^(E_i+1)
         */
        var D_0 = rDates[0];
        var r = fRate + 1.0;
        var fResult = 0.0;
        for ( var i = 1, nCount = rValues.length; i < nCount; ++i ) {
            var E_i = (rDates[i] - D_0) / 365.0;
            fResult -= E_i * rValues[i] / Math.pow( r, E_i + 1.0 );
        }
        return fResult;
    }

    function xirr( valueArray, dateArray, rate ) {
        var res = 0, vaTmp, daTmp;

        var nC = 0, g_Eps = 1e-7, fEps = 1.0, fZ = 0, fN = 0, xN = 0, nIM = 100, nMC = 0, arr0 = valueArray[0], arr1 = dateArray[0], arrI, wasNegative = false, wasPositive = false;

        if ( arr0 instanceof cError ) {
            return new cError( cErrorType.not_available );
        }

        if ( arr1 instanceof cError ) {
            return new cError( cErrorType.not_available );
        }

        if ( valueArray.length < 2 || (dateArray.length != valueArray.length) )
            return new cError( cErrorType.not_numeric );


        var fResultRate = rate.getValue()
        if ( fResultRate <= -1 )
            return new cError( cErrorType.not_numeric );

        var fMaxEps = 1e-10, nMaxIter = 50;

        for ( var i = 0; i < dateArray.length; i++ ) {
            dateArray[i] = dateArray[i].tocNumber();
            valueArray[i] = valueArray[i].tocNumber();
            if ( dateArray[i] instanceof cError || valueArray[i] instanceof cError )
                return new cError( cErrorType.not_numeric );
            dateArray[i] = dateArray[i].getValue();
            valueArray[i] = valueArray[i].getValue();
        }

        // Newton's method - try to find a fResultRate, so that lcl_sca_XirrResult() returns 0.
        var fNewRate, fRateEps, fResultValue, nIter = 0, bContLoop;
        do
        {
            fResultValue = lcl_sca_XirrResult( valueArray, dateArray, fResultRate );
            fNewRate = fResultRate - fResultValue / lcl_sca_XirrResult_Deriv1( valueArray, dateArray, fResultRate );
            fRateEps = Math.abs( fNewRate - fResultRate );
            fResultRate = fNewRate;
            bContLoop = (fRateEps > fMaxEps) && (Math.abs( fResultValue ) > fMaxEps);
        }
        while ( bContLoop && (++nIter < nMaxIter) );

        if ( bContLoop )
            return new cError( cErrorType.not_numeric );

        return new cNumber( fResultRate );

    }

    var dateArray = [], valueArray = [];

    if ( arg0 instanceof cArea ) {
        arg0.foreach2( function ( c ) {
            valueArray.push( c.tocNumber() );
        } )
    }
    else if ( arg0 instanceof cArray ) {
        arg0.foreach( function ( c ) {
            valueArray.push( c.tocNumber() );
        } )
    }
    else if ( arg0 instanceof cArea3D ) {
        if ( arg0.wsFrom == arg0.wsTo ) {
            valueArray = arg0.getMatrix()[0];
        }
        else
            return this.value = new cError( cErrorType.wrong_value_type );
    }
    else {
        arg0 = arg0.tocNumber();
        if ( arg1 instanceof cError ) {
            return this.value = new cError( cErrorType.not_numeric )
        }
        else
            valueArray[0] = arg0;
    }

    if ( arg1 instanceof cArea ) {
        arg1.foreach2( function ( c ) {
            dateArray.push( c.tocNumber() );
        } )
    }
    else if ( arg1 instanceof cArray ) {
        arg1.foreach( function ( c ) {
            dateArray.push( c.tocNumber() );
        } )
    }
    else if ( arg1 instanceof cArea3D ) {
        if ( arg1.wsFrom == arg1.wsTo ) {
            dateArray = arg1.getMatrix()[0];
        }
        else
            return this.value = new cError( cErrorType.wrong_value_type );
    }
    else {
        arg1 = arg1.tocNumber();
        if ( arg1 instanceof cError ) {
            return this.value = new cError( cErrorType.not_numeric )
        }
        else
            dateArray[0] = arg1;
    }

    if ( arg2 instanceof cArea || arg2 instanceof cArea3D ) {
        arg2 = arg2.cross( arguments[1].first );
    }

    arg2 = arg2.tocNumber();

    if ( arg2 instanceof cArray ) {
        arg2 = arg2.getElement( 0 );
    }

    if ( arg2 instanceof cError ) {
        return this.value = arg2;
    }

    this.value = xirr( valueArray, dateArray, arg2 );
    this.value.numFormat = 9;
    return this.value;

}
cXIRR.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( values , dates [ , [ guess ] ] )"
    };
}

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
cXNPV.prototype = Object.create( cBaseFunction.prototype )
cXNPV.prototype.Calculate = function ( arg ) {
    var arg0 = arg[0], arg1 = arg[1], arg2 = arg[2];

    function xnpv( rate, valueArray, dateArray ) {
        var res = 0, vaTmp, daTmp, r = rate.getValue()

        if ( dateArray.length != valueArray.length )
            return new cError( cErrorType.not_numeric );

        d1 = dateArray[0].tocNumber();

        for ( var i = 0; i < dateArray.length; i++ ) {
            vaTmp = valueArray[i].tocNumber();
            daTmp = dateArray[i].tocNumber();
            if ( vaTmp instanceof  cError || daTmp instanceof cError )
                return new cError( cErrorType.not_numeric );

            res += valueArray[i].getValue() / ( Math.pow( ( 1 + r ), ( dateArray[i].getValue() - d1.getValue() ) / 365 ) )
        }

        return new cNumber( res );
    }

    if ( arg0 instanceof cArea || arg0 instanceof cArea3D ) {
        arg0 = arg0.cross( arguments[1].first );
    }

    arg0 = arg0.tocNumber();

    if ( arg0 instanceof cArray ) {
        arg0 = arg0.getElement( 0 );
    }
    if ( arg0 instanceof cError ) {
        return this.value = arg0;
    }

    var dateArray = [], valueArray = [];

    if ( arg1 instanceof cArea ) {
        arg1.foreach2( function ( c ) {
            valueArray.push( c )
        } )
//        valueArray = arg1.getMatrix();
    }
    else if ( arg1 instanceof cArray ) {
        arg1.foreach( function ( c ) {
            valueArray.push( c )
        } )
    }
    else if ( arg1 instanceof cArea3D ) {
        if ( arg1.wsFrom == arg1.wsTo ) {
            valueArray = arg1.getMatrix()[0];
        }
        else
            return this.value = new cError( cErrorType.wrong_value_type );
    }
    else {
        arg1 = arg1.tocNumber();
        if ( arg1 instanceof cError ) {
            return this.value = new cError( cErrorType.not_numeric )
        }
        else
            valueArray[0] = arg1;
    }

    if ( arg2 instanceof cArea ) {
        arg2.foreach2( function ( c ) {
            dateArray.push( c )
        } )
//        dateArray = arg2.getMatrix();
    }
    else if ( arg2 instanceof cArray ) {
//        dateArray = arg2.getMatrix();
        arg2.foreach( function ( c ) {
            dateArray.push( c )
        } )
    }
    else if ( arg2 instanceof cArea3D ) {
        if ( arg2.wsFrom == arg2.wsTo ) {
            dateArray = arg2.getMatrix()[0];
        }
        else
            return this.value = new cError( cErrorType.wrong_value_type );
    }
    else {
        arg2 = arg2.tocNumber();
        if ( arg2 instanceof cError ) {
            return this.value = new cError( cErrorType.not_numeric )
        }
        else
            dateArray[0] = arg2;
    }

    return this.value = xnpv( arg0, valueArray, dateArray );

}
cXNPV.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( rate , values , dates  )"
    };
}

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
cYIELD.prototype = Object.create( cBaseFunction.prototype )
cYIELD.prototype.Calculate = function ( arg ) {
    var settlement = arg[0],
        maturity = arg[1],
        rate = arg[2],
        pr = arg[3],
        redemption = arg[4],
        frequency = arg[5],
        basis = arg[6] && !(arg[6] instanceof cEmpty) ? arg[6] : new cNumber( 0 );

    if ( settlement instanceof cArea || settlement instanceof cArea3D ) {
        settlement = settlement.cross( arguments[1].first );
    }
    else if ( settlement instanceof cArray ) {
        settlement = settlement.getElementRowCol( 0, 0 );
    }

    if ( maturity instanceof cArea || maturity instanceof cArea3D ) {
        maturity = maturity.cross( arguments[1].first );
    }
    else if ( maturity instanceof cArray ) {
        maturity = maturity.getElementRowCol( 0, 0 );
    }

    if ( rate instanceof cArea || rate instanceof cArea3D ) {
        rate = rate.cross( arguments[1].first );
    }
    else if ( rate instanceof cArray ) {
        rate = rate.getElementRowCol( 0, 0 );
    }

    if ( pr instanceof cArea || pr instanceof cArea3D ) {
        pr = pr.cross( arguments[1].first );
    }
    else if ( pr instanceof cArray ) {
        pr = pr.getElementRowCol( 0, 0 );
    }

    if ( redemption instanceof cArea || redemption instanceof cArea3D ) {
        redemption = redemption.cross( arguments[1].first );
    }
    else if ( redemption instanceof cArray ) {
        redemption = redemption.getElementRowCol( 0, 0 );
    }

    if ( frequency instanceof cArea || frequency instanceof cArea3D ) {
        frequency = frequency.cross( arguments[1].first );
    }
    else if ( frequency instanceof cArray ) {
        frequency = frequency.getElementRowCol( 0, 0 );
    }

    if ( basis instanceof cArea || basis instanceof cArea3D ) {
        basis = basis.cross( arguments[1].first );
    }
    else if ( basis instanceof cArray ) {
        basis = basis.getElementRowCol( 0, 0 );
    }

    settlement = settlement.tocNumber();
    maturity = maturity.tocNumber();
    rate = rate.tocNumber();
    pr = pr.tocNumber();
    redemption = redemption.tocNumber();
    frequency = frequency.tocNumber();
    basis = basis.tocNumber();

    if ( settlement instanceof cError ) return this.value = settlement;
    if ( maturity instanceof cError ) return this.value = maturity;
    if ( rate instanceof cError ) return this.value = rate;
    if ( pr instanceof cError ) return this.value = pr;
    if ( redemption instanceof cError ) return this.value = redemption;
    if ( frequency instanceof cError ) return this.value = frequency;
    if ( basis instanceof cError ) return this.value = basis;

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
        return this.value = new cError( cErrorType.not_numeric );

    var settl = Date.prototype.getDateFromExcel( settlement ),
        matur = Date.prototype.getDateFromExcel( maturity );

    this.value = new cNumber( getYield( settl, matur, rate, pr, redemption, frequency, basis ) );
//    this.value.numFormat = 9;
    return this.value;

}
cYIELD.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( settlement , maturity , rate , pr , redemption , frequency [ , [ basis ] ] )"
    };
}

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
cYIELDDISC.prototype = Object.create( cBaseFunction.prototype )
cYIELDDISC.prototype.Calculate = function ( arg ) {
    var settlement = arg[0],
        maturity = arg[1],
        pr = arg[2],
        redemption = arg[3],
        basis = arg[4] && !(arg[4] instanceof cEmpty) ? arg[4] : new cNumber( 0 );

    if ( settlement instanceof cArea || settlement instanceof cArea3D ) {
        settlement = settlement.cross( arguments[1].first );
    }
    else if ( settlement instanceof cArray ) {
        settlement = settlement.getElementRowCol( 0, 0 );
    }

    if ( maturity instanceof cArea || maturity instanceof cArea3D ) {
        maturity = maturity.cross( arguments[1].first );
    }
    else if ( maturity instanceof cArray ) {
        maturity = maturity.getElementRowCol( 0, 0 );
    }

    if ( pr instanceof cArea || pr instanceof cArea3D ) {
        pr = pr.cross( arguments[1].first );
    }
    else if ( pr instanceof cArray ) {
        pr = pr.getElementRowCol( 0, 0 );
    }

    if ( redemption instanceof cArea || redemption instanceof cArea3D ) {
        redemption = redemption.cross( arguments[1].first );
    }
    else if ( redemption instanceof cArray ) {
        redemption = redemption.getElementRowCol( 0, 0 );
    }

    if ( basis instanceof cArea || basis instanceof cArea3D ) {
        basis = basis.cross( arguments[1].first );
    }
    else if ( basis instanceof cArray ) {
        basis = basis.getElementRowCol( 0, 0 );
    }

    settlement = settlement.tocNumber();
    maturity = maturity.tocNumber();
    pr = pr.tocNumber();
    redemption = redemption.tocNumber();
    basis = basis.tocNumber();

    if ( settlement instanceof cError ) return this.value = settlement;
    if ( maturity instanceof cError ) return this.value = maturity;
    if ( pr instanceof cError ) return this.value = pr;
    if ( redemption instanceof cError ) return this.value = redemption;
    if ( basis instanceof cError ) return this.value = basis;

    settlement = settlement.getValue();
    maturity = maturity.getValue();
    pr = pr.getValue();
    redemption = redemption.getValue();
    basis = basis.getValue();

    if ( settlement >= maturity ||
        basis < 0 || basis > 4 ||
        pr <= 0 || redemption <= 0 )
        return this.value = new cError( cErrorType.not_numeric );

    var settl = Date.prototype.getDateFromExcel( settlement ),
        matur = Date.prototype.getDateFromExcel( maturity );

    var fRet = ( redemption / pr ) - 1.0;
    fRet /= yearFrac( settl, matur, basis );

    this.value = new cNumber( fRet );
    this.value.numFormat = 10;
    return this.value;

}
cYIELDDISC.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( settlement , maturity , pr , redemption , [ , [ basis ] ] )"
    };
}

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
cYIELDMAT.prototype = Object.create( cBaseFunction.prototype )
cYIELDMAT.prototype.Calculate = function ( arg ) {
    var settlement = arg[0],
        maturity = arg[1],
        issue = arg[2],
        rate = arg[3],
        pr = arg[4],
        basis = arg[5] && !(arg[5] instanceof cEmpty) ? arg[5] : new cNumber( 0 );

    if ( settlement instanceof cArea || settlement instanceof cArea3D ) {
        settlement = settlement.cross( arguments[1].first );
    }
    else if ( settlement instanceof cArray ) {
        settlement = settlement.getElementRowCol( 0, 0 );
    }

    if ( maturity instanceof cArea || maturity instanceof cArea3D ) {
        maturity = maturity.cross( arguments[1].first );
    }
    else if ( maturity instanceof cArray ) {
        maturity = maturity.getElementRowCol( 0, 0 );
    }

    if ( issue instanceof cArea || issue instanceof cArea3D ) {
        issue = issue.cross( arguments[1].first );
    }
    else if ( issue instanceof cArray ) {
        issue = issue.getElementRowCol( 0, 0 );
    }

    if ( rate instanceof cArea || rate instanceof cArea3D ) {
        rate = rate.cross( arguments[1].first );
    }
    else if ( rate instanceof cArray ) {
        rate = rate.getElementRowCol( 0, 0 );
    }

    if ( pr instanceof cArea || pr instanceof cArea3D ) {
        pr = pr.cross( arguments[1].first );
    }
    else if ( pr instanceof cArray ) {
        pr = pr.getElementRowCol( 0, 0 );
    }

    if ( basis instanceof cArea || basis instanceof cArea3D ) {
        basis = basis.cross( arguments[1].first );
    }
    else if ( basis instanceof cArray ) {
        basis = basis.getElementRowCol( 0, 0 );
    }

    settlement = settlement.tocNumber();
    maturity = maturity.tocNumber();
    issue = issue.tocNumber();
    rate = rate.tocNumber();
    pr = pr.tocNumber();
    basis = basis.tocNumber();

    if ( settlement instanceof cError ) return this.value = settlement;
    if ( maturity instanceof cError ) return this.value = maturity;
    if ( issue instanceof cError ) return this.value = issue;
    if ( rate instanceof cError ) return this.value = rate;
    if ( pr instanceof cError ) return this.value = pr;
    if ( basis instanceof cError ) return this.value = basis;

    settlement = settlement.getValue();
    maturity = maturity.getValue();
    issue = issue.getValue();
    rate = rate.getValue();
    pr = pr.getValue();
    basis = basis.getValue();

    if ( settlement >= maturity ||
        basis < 0 || basis > 4 ||
        pr <= 0 || rate <= 0 )
        return this.value = new cError( cErrorType.not_numeric );

    var settl = Date.prototype.getDateFromExcel( settlement ),
        matur = Date.prototype.getDateFromExcel( maturity ),
        iss = Date.prototype.getDateFromExcel( issue );

    var fRet = getyieldmat( settl, matur, iss, rate, pr, basis )

    this.value = new cNumber( fRet );
    this.value.numFormat = 10;
    return this.value;

}
cYIELDMAT.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( settlement , maturity , issue , rate , pr [ , [ basis ] ] )"
    };
}