"use strict";

/**
 * Created with JetBrains WebStorm.
 * User: Dmitry.Shahtanov
 * Date: 27.06.13
 * Time: 15:15
 * To change this template use File | Settings | File Templates.
 */
cFormulaFunction.Cube = {
    'groupName':"Cube",
    'CUBEKPIMEMBER':cCUBEKPIMEMBER,
    'CUBEMEMBER':cCUBEMEMBER,
    'CUBEMEMBERPROPERTY':cCUBEMEMBERPROPERTY,
    'CUBERANKEDMEMBER':cCUBERANKEDMEMBER,
    'CUBESET':cCUBESET,
    'CUBESETCOUNT':cCUBESETCOUNT,
    'CUBEVALUE':cCUBEVALUE
}

function cCUBEKPIMEMBER() {
    cBaseFunction.call( this, "CUBEKPIMEMBER" );
}
cCUBEKPIMEMBER.prototype = Object.create( cBaseFunction.prototype )

function cCUBEMEMBER() {
    cBaseFunction.call( this, "CUBEMEMBER" );
}
cCUBEMEMBER.prototype = Object.create( cBaseFunction.prototype )

function cCUBEMEMBERPROPERTY() {
    cBaseFunction.call( this, "CUBEMEMBERPROPERTY" );
}
cCUBEMEMBERPROPERTY.prototype = Object.create( cBaseFunction.prototype )

function cCUBERANKEDMEMBER() {
    cBaseFunction.call( this, "CUBERANKEDMEMBER" );
}
cCUBERANKEDMEMBER.prototype = Object.create( cBaseFunction.prototype )

function cCUBESET() {
    cBaseFunction.call( this, "CUBESET" );
}
cCUBESET.prototype = Object.create( cBaseFunction.prototype )

function cCUBESETCOUNT() {
    cBaseFunction.call( this, "CUBESETCOUNT" );
}
cCUBESETCOUNT.prototype = Object.create( cBaseFunction.prototype )

function cCUBEVALUE() {
    cBaseFunction.call( this, "CUBEVALUE" );
}
cCUBEVALUE.prototype = Object.create( cBaseFunction.prototype )
