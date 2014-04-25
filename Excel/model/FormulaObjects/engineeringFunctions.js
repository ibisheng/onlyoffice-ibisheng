"use strict";

function ConvertToDec( aStrSource, nBase, nCharLim ){
    if ( nBase < 2 || nBase > 36 ){
        return "Error #1";}

    var nStrLen = aStrSource.length;
    if( nStrLen > nCharLim ){
        return "Error #2";}
    else if( !nStrLen ){
        return 0;}

    var fVal = 0, nFirstDig = 0,
        bFirstDig = true;

    for(var i=0; i < aStrSource.length; i++)
    {
        var n;

        if( '0' <= aStrSource[i] && aStrSource[i] <= '9' ){
            n = aStrSource[i].charCodeAt(0) - '0'.charCodeAt(0);}
        else if( 'A' <= aStrSource[i] && aStrSource[i] <= 'Z' ){
            n = 10 + ( aStrSource[i].charCodeAt(0) - 'A'.charCodeAt(0) );}
        else if ( 'a' <= aStrSource[i] && aStrSource[i] <= 'z' ){
            n = 10 + ( aStrSource[i].charCodeAt(0) - 'a'.charCodeAt(0) );}
        else{
            n = nBase;}

        if( n < nBase )
        {
            if( bFirstDig )
            {
                bFirstDig = false;
                nFirstDig = n;
            }
            fVal = fVal * nBase + n;
        }
        else{
            return "Error #3";}
    }

    if( nStrLen === nCharLim && !bFirstDig && (nFirstDig >= nBase / 2) )
    {   // handling negativ values
        fVal = ( Math.pow( nBase, nCharLim ) - fVal );   // complement
        fVal *= -1.0;
    }

    return fVal;
}

var f_PI_DIV_2 = Math.PI / 2.0;
var f_PI_DIV_4 = Math.PI / 4.0;
var f_2_DIV_PI = 2.0 / Math.PI;

function BesselJ( x, N ) {
    if ( N < 0 ){
        return new CError( cErrorType.not_numeric );}
    if ( x === 0.0 ){
        return new CNumber( (N == 0) ? 1 : 0 );}

    /*  The algorithm works only for x>0, therefore remember sign. BesselJ
     with integer order N is an even function for even N (means J(-x)=J(x))
     and an odd function for odd N (means J(-x)=-J(x)).*/
    var fSign = (N % 2 == 1 && x < 0) ? -1 : 1;
    var fX = Math.abs( x );

    var fMaxIteration = 9000000; //experimental, for to return in < 3 seconds
    var fEstimateIteration = fX * 1.5 + N;
    var bAsymptoticPossible = Math.pow( fX, 0.4 ) > N;
    if ( fEstimateIteration > fMaxIteration ) {
        if ( bAsymptoticPossible ){
            return new CNumber(fSign * Math.sqrt( f_2_DIV_PI / fX ) * Math.cos( fX - N * f_PI_DIV_2 - f_PI_DIV_4 ) );}
        else{
            return new CError(cErrorType.not_numeric);}
    }

    var epsilon = 1.0e-15; // relative error
    var bHasfound = false, k = 0, u;

    // first used with k=1
    var m_bar, g_bar, g_bar_delta_u, g = 0, delta_u = 0, f_bar = -1;  // f_bar_k = 1/f_k, but only used for k=0

    if ( N == 0 ) {
        u = 1;
        g_bar_delta_u = 0;
        g_bar = -2 / fX;
        delta_u = g_bar_delta_u / g_bar;
        u = u + delta_u;
        g = -1 / g_bar;
        f_bar = f_bar * g;
        k = 2;
    }
    else {
        u = 0;
        for ( k = 1; k <= N - 1; k = k + 1 ) {
            m_bar = 2 * Math.fmod( k - 1, 2 ) * f_bar;
            g_bar_delta_u = -g * delta_u - m_bar * u; // alpha_k = 0.0
            g_bar = m_bar - 2 * k / fX + g;
            delta_u = g_bar_delta_u / g_bar;
            u = u + delta_u;
            g = -1 / g_bar;
            f_bar = f_bar * g;
        }
        // Step alpha_N = 1.0
        m_bar = 2 * Math.fmod( k - 1, 2 ) * f_bar;
        g_bar_delta_u = f_bar - g * delta_u - m_bar * u; // alpha_k = 1.0
        g_bar = m_bar - 2 * k / fX + g;
        delta_u = g_bar_delta_u / g_bar;
        u = u + delta_u;
        g = -1 / g_bar;
        f_bar = f_bar * g;
        k = k + 1;
    }
    // Loop until desired accuracy, always alpha_k = 0.0
    do {
        m_bar = 2 * Math.fmod( k - 1, 2 ) * f_bar;
        g_bar_delta_u = -g * delta_u - m_bar * u;
        g_bar = m_bar - 2 * k / fX + g;
        delta_u = g_bar_delta_u / g_bar;
        u = u + delta_u;
        g = -1 / g_bar;
        f_bar = f_bar * g;
        bHasfound = (Math.abs( delta_u ) <= Math.abs( u ) * epsilon);
        k = k + 1;
    }
    while ( !bHasfound && k <= fMaxIteration );
    if ( bHasfound ){
        return new CNumber( u * fSign );}
    else{
        return new CError(cErrorType.not_numeric);}// unlikely to happen
}

function BesselI( x, n ) {
    var nMaxIteration = 2000, fXHalf = x / 2, fResult = 0;
    if ( n < 0 ){
        return new CError( cErrorType.not_numeric );}

    /*  Start the iteration without TERM(n,0), which is set here.

     TERM(n,0) = (x/2)^n / n!
     */
    var nK = 0, fTerm = 1;
    // avoid overflow in Fak(n)
    for ( nK = 1; nK <= n; ++nK ) {
        fTerm = fTerm / nK * fXHalf;
    }
    fResult = fTerm;    // Start result with TERM(n,0).
    if ( fTerm !== 0 ) {
        nK = 1;
        var fEpsilon = 1.0E-15;
        do
        {
            /*  Calculation of TERM(n,k) from TERM(n,k-1):

                            (x/2)^(n+2k)
             TERM(n,k)  =  --------------
                              k! (n+k)!

                (x/2)^2 (x/2)^(n+2(k-1))
             =  --------------------------
                k (k-1)! (n+k) (n+k-1)!

                 (x/2)^2     (x/2)^(n+2(k-1))
             =  --------- * ------------------
                 k(n+k)      (k-1)! (n+k-1)!

                  x^2/4
             =  -------- TERM(n,k-1)
                  k(n+k)
             */
            fTerm = fTerm * fXHalf / nK * fXHalf / (nK + n);
            fResult += fTerm;
            nK++;
        }
        while ( (Math.abs( fTerm ) > Math.abs( fResult ) * fEpsilon) && (nK < nMaxIteration) );

    }
    return new CNumber( fResult );
}

function Besselk0( fNum ) {
    var fRet,y;

    if ( fNum <= 2 ) {
        var fNum2 = fNum * 0.5;
        y = fNum2 * fNum2;
        fRet = -Math.log10( fNum2 ) * BesselI( fNum, 0 ) +
            ( -0.57721566 + y * ( 0.42278420 + y * ( 0.23069756 + y * ( 0.3488590e-1 + y * ( 0.262698e-2 + y * ( 0.10750e-3 + y * 0.74e-5 ) ) ) ) ) );
    }
    else {
        y = 2 / fNum;
        fRet = Math.exp( -fNum ) / Math.sqrt( fNum ) *
            ( 1.25331414 + y * ( -0.7832358e-1 + y * ( 0.2189568e-1 + y * ( -0.1062446e-1 + y * ( 0.587872e-2 + y * ( -0.251540e-2 + y * 0.53208e-3 ) ) ) ) ) );
    }

    return fRet;
}

function Besselk1( fNum ) {
    var fRet, y;

    if ( fNum <= 2 ) {
        var fNum2 = fNum * 0.5;
        y = fNum2 * fNum2;
        fRet = Math.log10( fNum2 ) * BesselI( fNum, 1 ) +
            ( 1 + y * ( 0.15443144 + y * ( -0.67278579 + y * ( -0.18156897 + y * ( -0.1919402e-1 + y * ( -0.110404e-2 + y * ( -0.4686e-4 ) ) ) ) ) ) ) / fNum;
    }
    else {
        y = 2 / fNum;
        fRet = Math.exp( -fNum ) / Math.sqrt( fNum ) *
            ( 1.25331414 + y * ( 0.23498619 + y * ( -0.3655620e-1 + y * ( 0.1504268e-1 + y * ( -0.780353e-2 + y * ( 0.325614e-2 + y * ( -0.68245e-3 ) ) ) ) ) ) );
    }

    return fRet;
}

function BesselK( fNum, nOrder ) {
    switch ( nOrder ) {
        case 0:
            return Besselk0( fNum );
        case 1:
            return Besselk1( fNum );
        default:
        {
            var fBkp;

            var fTox = 2 / fNum, fBkm = Besselk0( fNum ), fBk = Besselk1( fNum );

            for ( var n = 1; n < nOrder; n++ ) {
                fBkp = fBkm + n * fTox * fBk;
                fBkm = fBk;
                fBk = fBkp;
            }

            return fBk;
        }
    }
}

function Bessely0( fX ) {
    if ( fX <= 0 )
        return new CError( cErrorType.not_numeric );
    var fMaxIteration = 9000000; // should not be reached
    if ( fX > 5.0e+6 ) // iteration is not considerable better then approximation
        return Math.sqrt( 1 / Math.PI / fX ) * (Math.sin( fX ) - Math.cos( fX ));
    var epsilon = 1.0e-15, EulerGamma = 0.57721566490153286060;
    var alpha = Math.log10( fX / 2 ) + EulerGamma;
    var u = alpha;

    var k = 1, m_bar = 0, g_bar_delta_u = 0, g_bar = -2 / fX;
    var delta_u = g_bar_delta_u / g_bar, g = -1 / g_bar, f_bar = -1 * g,
        sign_alpha = 1, km1mod2, bHasFound = false;
    k = k + 1;
    do
    {
        km1mod2 = Math.fmod( k - 1, 2 );
        m_bar = (2 * km1mod2) * f_bar;
        if ( km1mod2 == 0 )
            alpha = 0;
        else {
            alpha = sign_alpha * (4 / k);
            sign_alpha = -sign_alpha;
        }
        g_bar_delta_u = f_bar * alpha - g * delta_u - m_bar * u;
        g_bar = m_bar - (2 * k) / fX + g;
        delta_u = g_bar_delta_u / g_bar;
        u = u + delta_u;
        g = -1 / g_bar;
        f_bar = f_bar * g;
        bHasFound = (Math.abs( delta_u ) <= Math.abs( u ) * epsilon);
        k = k + 1;
    }
    while ( !bHasFound && k < fMaxIteration );
    if ( bHasFound )
        return u * f_2_DIV_PI;
    else
        return new CError( cErrorType.not_numeric );
}

// See #i31656# for a commented version of this implementation, attachment #desc6
// http://www.openoffice.org/nonav/issues/showattachment.cgi/63609/Comments%20to%20the%20implementation%20of%20the%20Bessel%20functions.odt
function Bessely1( fX ) {
    if ( fX <= 0 )
        return new CError( cErrorType.not_numeric );
    var fMaxIteration = 9000000; // should not be reached
    if ( fX > 5e+6 ) // iteration is not considerable better then approximation
        return -Math.sqrt( 1 / Math.PI / fX ) * (Math.sin( fX ) + Math.cos( fX ));
    var epsilon = 1.0e-15, EulerGamma = 0.57721566490153286060, alpha = 1 / fX, f_bar = -1, u = alpha, k = 1, m_bar = 0;
    alpha = 1 - EulerGamma - Math.log10( fX / 2 );
    var g_bar_delta_u = -alpha, g_bar = -2 / fX, delta_u = g_bar_delta_u / g_bar;
    u = u + delta_u;
    var g = -1 / g_bar;
    f_bar = f_bar * g;
    var sign_alpha = -1, km1mod2, //will be (k-1) mod 2
        q, // will be (k-1) div 2
        bHasFound = false;
    k = k + 1;
    do
    {
        km1mod2 = Math.fmod( k - 1, 2 );
        m_bar = (2 * km1mod2) * f_bar;
        q = (k - 1) / 2;
        if ( km1mod2 == 0 ) // k is odd
        {
            alpha = sign_alpha * (1 / q + 1 / (q + 1));
            sign_alpha = -sign_alpha;
        }
        else
            alpha = 0;
        g_bar_delta_u = f_bar * alpha - g * delta_u - m_bar * u;
        g_bar = m_bar - (2 * k) / fX + g;
        delta_u = g_bar_delta_u / g_bar;
        u = u + delta_u;
        g = -1 / g_bar;
        f_bar = f_bar * g;
        bHasFound = (Math.abs( delta_u ) <= Math.abs( u ) * epsilon);
        k = k + 1;
    }
    while ( !bHasFound && k < fMaxIteration );
    if ( bHasFound )
        return -u * 2 / Math.PI;
    else
        return new CError( cErrorType.not_numeric );
}

function BesselY( fNum, nOrder ) {
    switch ( nOrder ) {
        case 0:
            return Bessely0( fNum );
        case 1:
            return Bessely1( fNum );
        default:
        {
            var fByp, fTox = 2 / fNum, fBym = Bessely0( fNum ), fBy = Bessely1( fNum );

            for ( var n = 1; n < nOrder; n++ ) {
                fByp = n * fTox * fBy - fBym;
                fBym = fBy;
                fBy = fByp;
            }

            return fBy;
        }
    }
}

/**
 * Created with JetBrains WebStorm.
 * User: Dmitry.Shahtanov
 * Date: 27.06.13
 * Time: 12:25
 * To change this template use File | Settings | File Templates.
 */
cFormulaFunction.Engineering = {
    'groupName':"Engineering",
    'BESSELI':cBESSELI,
    'BESSELJ':cBESSELJ,
    'BESSELK':cBESSELK,
    'BESSELY':cBESSELY,
    'BIN2DEC':cBIN2DEC,
    'BIN2HEX':cBIN2HEX,
    'BIN2OCT':cBIN2OCT,
    'COMPLEX':cCOMPLEX,
    'CONVERT':cCONVERT,
    'DEC2BIN':cDEC2BIN,
    'DEC2HEX':cDEC2HEX,
    'DEC2OCT':cDEC2OCT,
    'DELTA':cDELTA,
    'ERF':cERF,
    'ERFC':cERFC,
    'GESTEP':cGESTEP,
    'HEX2BIN':cHEX2BIN,
    'HEX2DEC':cHEX2DEC,
    'HEX2OCT':cHEX2OCT,
    'IMABS':cIMABS,
    'IMAGINARY':cIMAGINARY,
    'IMARGUMENT':cIMARGUMENT,
    'IMCONJUGATE':cIMCONJUGATE,
    'IMCOS':cIMCOS,
    'IMDIV':cIMDIV,
    'IMEXP':cIMEXP,
    'IMLN':cIMLN,
    'IMLOG10':cIMLOG10,
    'IMLOG2':cIMLOG2,
    'IMPOWER':cIMPOWER,
    'IMPRODUCT':cIMPRODUCT,
    'IMREAL':cIMREAL,
    'IMSIN':cIMSIN,
    'IMSQRT':cIMSQRT,
    'IMSUB':cIMSUB,
    'IMSUM':cIMSUM,
    'OCT2BIN':cOCT2BIN,
    'OCT2DEC':cOCT2DEC,
    'OCT2HEX':cOCT2HEX
};

function cBESSELI() {
    cBaseFunction.call( this, "BESSELI" );
}
cBESSELI.prototype = Object.create( cBaseFunction.prototype );

function cBESSELJ() {
    cBaseFunction.call( this, "BESSELJ" );
}
cBESSELJ.prototype = Object.create( cBaseFunction.prototype );

function cBESSELK() {
    cBaseFunction.call( this, "BESSELK" );
}
cBESSELK.prototype = Object.create( cBaseFunction.prototype );

function cBESSELY() {
    cBaseFunction.call( this, "BESSELY" );
}
cBESSELY.prototype = Object.create( cBaseFunction.prototype );

function cBIN2DEC() {
    cBaseFunction.call( this, "BIN2DEC" );
}
cBIN2DEC.prototype = Object.create( cBaseFunction.prototype );

function cBIN2HEX() {
    cBaseFunction.call( this, "BIN2HEX" );
}
cBIN2HEX.prototype = Object.create( cBaseFunction.prototype );

function cBIN2OCT() {
    cBaseFunction.call( this, "BIN2OCT" );
}
cBIN2OCT.prototype = Object.create( cBaseFunction.prototype );

function cCOMPLEX() {
    cBaseFunction.call( this, "COMPLEX" );
}
cCOMPLEX.prototype = Object.create( cBaseFunction.prototype );

function cCONVERT() {
    cBaseFunction.call( this, "CONVERT" );
}
cCONVERT.prototype = Object.create( cBaseFunction.prototype );

function cDEC2BIN() {
    cBaseFunction.call( this, "DEC2BIN" );
}
cDEC2BIN.prototype = Object.create( cBaseFunction.prototype );

function cDEC2HEX() {
    cBaseFunction.call( this, "DEC2HEX" );
}
cDEC2HEX.prototype = Object.create( cBaseFunction.prototype );

function cDEC2OCT() {
    cBaseFunction.call( this, "DEC2OCT" );
}
cDEC2OCT.prototype = Object.create( cBaseFunction.prototype );

function cDELTA() {
    cBaseFunction.call( this, "DELTA" );
}
cDELTA.prototype = Object.create( cBaseFunction.prototype );

function cERF() {
    cBaseFunction.call( this, "ERF" );
}
cERF.prototype = Object.create( cBaseFunction.prototype );

function cERFC() {
    cBaseFunction.call( this, "ERFC" );
}
cERFC.prototype = Object.create( cBaseFunction.prototype );

function cGESTEP() {
    cBaseFunction.call( this, "GESTEP" );
}
cGESTEP.prototype = Object.create( cBaseFunction.prototype );

function cHEX2BIN() {
    cBaseFunction.call( this, "HEX2BIN" );
}
cHEX2BIN.prototype = Object.create( cBaseFunction.prototype );

function cHEX2DEC() {
    cBaseFunction.call( this, "HEX2DEC" );
}
cHEX2DEC.prototype = Object.create( cBaseFunction.prototype );

function cHEX2OCT() {
    cBaseFunction.call( this, "HEX2OCT" );
}
cHEX2OCT.prototype = Object.create( cBaseFunction.prototype );

function cIMABS() {
    cBaseFunction.call( this, "IMABS" );
}
cIMABS.prototype = Object.create( cBaseFunction.prototype );

function cIMAGINARY() {
    cBaseFunction.call( this, "IMAGINARY" );
}
cIMAGINARY.prototype = Object.create( cBaseFunction.prototype );

function cIMARGUMENT() {
    cBaseFunction.call( this, "IMARGUMENT" );
}
cIMARGUMENT.prototype = Object.create( cBaseFunction.prototype );

function cIMCONJUGATE() {
    cBaseFunction.call( this, "IMCONJUGATE" );
}
cIMCONJUGATE.prototype = Object.create( cBaseFunction.prototype );

function cIMCOS() {
    cBaseFunction.call( this, "IMCOS" );
}
cIMCOS.prototype = Object.create( cBaseFunction.prototype );

function cIMDIV() {
    cBaseFunction.call( this, "IMDIV" );
}
cIMDIV.prototype = Object.create( cBaseFunction.prototype );

function cIMEXP() {
    cBaseFunction.call( this, "IMEXP" );
}
cIMEXP.prototype = Object.create( cBaseFunction.prototype );

function cIMLN() {
    cBaseFunction.call( this, "IMLN" );
}
cIMLN.prototype = Object.create( cBaseFunction.prototype );

function cIMLOG10() {
    cBaseFunction.call( this, "IMLOG10" );
}
cIMLOG10.prototype = Object.create( cBaseFunction.prototype );

function cIMLOG2() {
    cBaseFunction.call( this, "IMLOG2" );
}
cIMLOG2.prototype = Object.create( cBaseFunction.prototype );

function cIMPOWER() {
    cBaseFunction.call( this, "IMPOWER" );
}
cIMPOWER.prototype = Object.create( cBaseFunction.prototype );

function cIMPRODUCT() {
    cBaseFunction.call( this, "IMPRODUCT" );
}
cIMPRODUCT.prototype = Object.create( cBaseFunction.prototype );

function cIMREAL() {
    cBaseFunction.call( this, "IMREAL" );
}
cIMREAL.prototype = Object.create( cBaseFunction.prototype );

function cIMSIN() {
    cBaseFunction.call( this, "IMSIN" );
}
cIMSIN.prototype = Object.create( cBaseFunction.prototype );

function cIMSQRT() {
    cBaseFunction.call( this, "IMSQRT" );
}
cIMSQRT.prototype = Object.create( cBaseFunction.prototype );

function cIMSUB() {
    cBaseFunction.call( this, "IMSUB" );
}
cIMSUB.prototype = Object.create( cBaseFunction.prototype );

function cIMSUM() {
    cBaseFunction.call( this, "IMSUM" );
}
cIMSUM.prototype = Object.create( cBaseFunction.prototype );

function cOCT2BIN() {
    cBaseFunction.call( this, "OCT2BIN" );
}
cOCT2BIN.prototype = Object.create( cBaseFunction.prototype );

function cOCT2DEC() {
    cBaseFunction.call( this, "OCT2DEC" );
}
cOCT2DEC.prototype = Object.create( cBaseFunction.prototype );

function cOCT2HEX() {
    cBaseFunction.call( this, "OCT2HEX" );
}
cOCT2HEX.prototype = Object.create( cBaseFunction.prototype );
