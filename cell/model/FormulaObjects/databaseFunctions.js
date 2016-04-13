"use strict";

(
/**
* @param {Window} window
* @param {undefined} undefined
*/
function (window, undefined) {
    var cBaseFunction = AscCommonExcel.cBaseFunction;
    var cFormulaFunctionGroup = AscCommonExcel.cFormulaFunctionGroup;

    cFormulaFunctionGroup['Database'] = cFormulaFunctionGroup['Database'] || [];
    cFormulaFunctionGroup['Database'].push(
        cDAVERAGE,
        cDCOUNT,
        cDCOUNTA,
        cDGET,
        cDMAX,
        cDMIN,
        cDPRODUCT,
        cDSTDEV,
        cDSTDEVP,
        cDSUM,
        cDVAR,
        cDVARP
    );

function cDAVERAGE() {
    cBaseFunction.call( this, "DAVERAGE" );
}

cDAVERAGE.prototype = Object.create( cBaseFunction.prototype );

function cDCOUNT() {
    cBaseFunction.call( this, "DCOUNT" );
}

cDCOUNT.prototype = Object.create( cBaseFunction.prototype );

function cDCOUNTA() {
    cBaseFunction.call( this, "DCOUNTA" );
}

cDCOUNTA.prototype = Object.create( cBaseFunction.prototype );

function cDGET() {
    cBaseFunction.call( this, "DGET" );
}

cDGET.prototype = Object.create( cBaseFunction.prototype );

function cDMAX() {
    cBaseFunction.call( this, "DMAX" );
}

cDMAX.prototype = Object.create( cBaseFunction.prototype );

function cDMIN() {
    cBaseFunction.call( this, "DMIN" );
}

cDMIN.prototype = Object.create( cBaseFunction.prototype );

function cDPRODUCT() {
    cBaseFunction.call( this, "DPRODUCT" );
}

cDPRODUCT.prototype = Object.create( cBaseFunction.prototype );

function cDSTDEV() {
    cBaseFunction.call( this, "DSTDEV" );
}

cDSTDEV.prototype = Object.create( cBaseFunction.prototype );

function cDSTDEVP() {
    cBaseFunction.call( this, "DSTDEVP" );
}

cDSTDEVP.prototype = Object.create( cBaseFunction.prototype );

function cDSUM() {
    cBaseFunction.call( this, "DSUM" );
}

cDSUM.prototype = Object.create( cBaseFunction.prototype );

function cDVAR() {
    cBaseFunction.call( this, "DVAR" );
}

cDVAR.prototype = Object.create( cBaseFunction.prototype );

function cDVARP() {
    cBaseFunction.call( this, "DVARP" );
}

cDVARP.prototype = Object.create( cBaseFunction.prototype );
})(window);
