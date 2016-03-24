"use strict";

/**
 * Created with JetBrains WebStorm.
 * User: Dmitry.Shahtanov
 * Date: 27.06.13
 * Time: 15:15
 * To change this template use File | Settings | File Templates.
 */


cFormulaFunctionGroup['Cube'] = [
    cCUBEKPIMEMBER,
    cCUBEMEMBER,
    cCUBEMEMBERPROPERTY,
    cCUBERANKEDMEMBER,
    cCUBESET,
    cCUBESETCOUNT,
    cCUBEVALUE
];

function cCUBEKPIMEMBER() {
//    cBaseFunction.call( this, "CUBEKPIMEMBER" );

    this.name = "CUBEKPIMEMBER";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 0;
    this.argumentsCurrent = 0;
    this.argumentsMax = 255;
    this.formatType = {
        def:-1, //подразумевается формат первой ячейки входящей в формулу.
        noneFormat:-2
    };
    this.numFormat = this.formatType.def;

}

cCUBEKPIMEMBER.prototype = Object.create( cBaseFunction.prototype );

function cCUBEMEMBER() {
//    cBaseFunction.call( this, "CUBEMEMBER" );

    this.name = "CUBEMEMBER";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 0;
    this.argumentsCurrent = 0;
    this.argumentsMax = 255;
    this.formatType = {
        def:-1, //подразумевается формат первой ячейки входящей в формулу.
        noneFormat:-2
    };
    this.numFormat = this.formatType.def;

}

cCUBEMEMBER.prototype = Object.create( cBaseFunction.prototype );

function cCUBEMEMBERPROPERTY() {
//    cBaseFunction.call( this, "CUBEMEMBERPROPERTY" );

    this.name = "CUBEMEMBERPROPERTY";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 0;
    this.argumentsCurrent = 0;
    this.argumentsMax = 255;
    this.formatType = {
        def:-1, //подразумевается формат первой ячейки входящей в формулу.
        noneFormat:-2
    };
    this.numFormat = this.formatType.def;

}

cCUBEMEMBERPROPERTY.prototype = Object.create( cBaseFunction.prototype );

function cCUBERANKEDMEMBER() {
//    cBaseFunction.call( this, "CUBERANKEDMEMBER" );

    this.name = "CUBERANKEDMEMBER";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 0;
    this.argumentsCurrent = 0;
    this.argumentsMax = 255;
    this.formatType = {
        def:-1, //подразумевается формат первой ячейки входящей в формулу.
        noneFormat:-2
    };
    this.numFormat = this.formatType.def;

}

cCUBERANKEDMEMBER.prototype = Object.create( cBaseFunction.prototype );

function cCUBESET() {
//    cBaseFunction.call( this, "CUBESET" );

    this.name = "CUBESET";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 0;
    this.argumentsCurrent = 0;
    this.argumentsMax = 255;
    this.formatType = {
        def:-1, //подразумевается формат первой ячейки входящей в формулу.
        noneFormat:-2
    };
    this.numFormat = this.formatType.def;

}

cCUBESET.prototype = Object.create( cBaseFunction.prototype );

function cCUBESETCOUNT() {
//    cBaseFunction.call( this, "CUBESETCOUNT" );

    this.name = "CUBESETCOUNT";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 0;
    this.argumentsCurrent = 0;
    this.argumentsMax = 255;
    this.formatType = {
        def:-1, //подразумевается формат первой ячейки входящей в формулу.
        noneFormat:-2
    };
    this.numFormat = this.formatType.def;

}

cCUBESETCOUNT.prototype = Object.create( cBaseFunction.prototype );

function cCUBEVALUE() {
//    cBaseFunction.call( this, "CUBEVALUE" );

    this.name = "CUBEVALUE";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 0;
    this.argumentsCurrent = 0;
    this.argumentsMax = 255;
    this.formatType = {
        def:-1, //подразумевается формат первой ячейки входящей в формулу.
        noneFormat:-2
    };
    this.numFormat = this.formatType.def;

}

cCUBEVALUE.prototype = Object.create( cBaseFunction.prototype );
