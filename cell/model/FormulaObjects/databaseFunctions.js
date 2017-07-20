/*
 * (c) Copyright Ascensio System SIA 2010-2017
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation. In accordance with
 * Section 7(a) of the GNU AGPL its Section 15 shall be amended to the effect
 * that Ascensio System SIA expressly excludes the warranty of non-infringement
 * of any third-party rights.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For
 * details, see the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia,
 * EU, LV-1021.
 *
 * The  interactive user interfaces in modified source and object code versions
 * of the Program must display Appropriate Legal Notices, as required under
 * Section 5 of the GNU AGPL version 3.
 *
 * Pursuant to Section 7(b) of the License you must retain the original Product
 * logo when distributing the program. Pursuant to Section 7(e) we decline to
 * grant you any rights under trademark law for use of our trademarks.
 *
 * All the Product's GUI elements, including illustrations and icon sets, as
 * well as technical writing content are licensed under the terms of the
 * Creative Commons Attribution-ShareAlike 4.0 International. See the License
 * terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 */

"use strict";

(/**
 * @param {Window} window
 * @param {undefined} undefined
 */
	function (window, undefined) {
	var cBaseFunction = AscCommonExcel.cBaseFunction;
	var cFormulaFunctionGroup = AscCommonExcel.cFormulaFunctionGroup;
	var cElementType = AscCommonExcel.cElementType;
	var cNumber = AscCommonExcel.cNumber;

	function getNeedValuesFromDataBase(dataBase, field, conditionData){

		//заполняем map название столбца-> его содержимое(из базы данных)
		var headersArr = [];
		var headersDataMap = {};
		var dataBaseRowsCount = dataBase.length;
		var dataBaseColsCount = dataBase[0].length;
		for(var i = 0; i < dataBaseRowsCount; i++){
			for(var j = 0; j < dataBaseColsCount; j++){
				var header = dataBase[0][j].getValue();
				if(0 === i){
					if(headersDataMap.hasOwnProperty(header)){//если находим такой же заголовок, пропускаем
						continue;
					}else{
						headersDataMap[header] = [];
						headersArr[j] = header;
					}
				}else{
					if(!headersDataMap[header][i - 1]){
						headersDataMap[header][i - 1] = dataBase[i][j];
					}
				}
			}
		}

		//заполняем map название столбца-> его содержимое(из условий)
		var headersConditionArr = [];
		var headersConditionMap = {};
		var conditionBaseRowsCount = conditionData.length;
		var conditionBaseColsCount = conditionData[0].length;
		for(var i = 0; i < conditionBaseRowsCount; i++){
			for(var j = 0; j < conditionBaseColsCount; j++){
				var header = conditionData[0][j].getValue();
				if(0 === i){
					headersConditionArr[j] = header;
					if(headersConditionMap.hasOwnProperty(header)){//если находим такой же заголовок, пропускаем
						continue;
					}else{
						headersConditionMap[header] = [];
					}
				}else{
					headersConditionMap[header].push(conditionData[i][j]);
				}
			}
		}

		//если поле задано числом, то выбираем заголовок столбца с данным именем
		var isNumberField = field.tocNumber();
		if(cElementType.error === isNumberField.type){
			field = field.getValue();
		}else{
			var number = isNumberField.getValue();
			if(headersArr[number - 1]){
				field = headersArr[number - 1];
			}else{
				field = null;
			}
		}

		var isTrueCondition = function(condition, val){
			var res = false;
			var condition  = condition.getValue();

			if("" === condition){
				res = true;
			}else{
				res = window['AscCommonExcel'].matching(val, AscCommonExcel.matchingValue(condition));
			}
			return res;
		};

		var previousWinArray;
		var winElems = [];
		for(var i = 1; i < conditionBaseRowsCount; i++){
			previousWinArray = null;
			for(var j = 0; j < conditionBaseColsCount; j++){
				var condition = conditionData[i][j];
				var header = headersConditionArr[j];

				//проходимся по всем строкам данного столбца из базы и смотрим что нам подходит по условию
				var databaseData = headersDataMap[header];

				var winColumnArray = [];
				for(var n = 0; n < databaseData.length; n++){
					if(previousWinArray && previousWinArray[n]){
						if(isTrueCondition(condition, databaseData[n])){
							winColumnArray[n] = true;
						}
					}else if(!previousWinArray && isTrueCondition(condition, databaseData[n])){
						winColumnArray[n] = true;
					}
				}
				previousWinArray = winColumnArray;
			}
			winElems[i - 1] = previousWinArray;
		}

		var needDataColumn = headersDataMap[field];
		var resArr = [];
		for(var i = 0; i < winElems.length; i++){
			for(var j in winElems[i]){
				resArr.push(needDataColumn[j].getValue());
			}
		}

		return resArr;
	}

	cFormulaFunctionGroup['Database'] = cFormulaFunctionGroup['Database'] || [];
	cFormulaFunctionGroup['Database'].push(cDAVERAGE, cDCOUNT, cDCOUNTA, cDGET, cDMAX, cDMIN, cDPRODUCT, cDSTDEV,
		cDSTDEVP, cDSUM, cDVAR, cDVARP);

	cFormulaFunctionGroup['NotRealised'] = cFormulaFunctionGroup['NotRealised'] || [];
	cFormulaFunctionGroup['NotRealised'].push(cDAVERAGE, cDCOUNT, cDCOUNTA, cDGET, cDMAX, cDPRODUCT, cDSTDEV,
		cDSTDEVP, cDSUM, cDVAR, cDVARP);

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cDAVERAGE() {
		cBaseFunction.call(this, "DAVERAGE");
	}

	cDAVERAGE.prototype = Object.create(cBaseFunction.prototype);
	cDAVERAGE.prototype.constructor = cDAVERAGE;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cDCOUNT() {
		cBaseFunction.call(this, "DCOUNT");
	}

	cDCOUNT.prototype = Object.create(cBaseFunction.prototype);
	cDCOUNT.prototype.constructor = cDCOUNT;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cDCOUNTA() {
		cBaseFunction.call(this, "DCOUNTA");
	}

	cDCOUNTA.prototype = Object.create(cBaseFunction.prototype);
	cDCOUNTA.prototype.constructor = cDCOUNTA;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cDGET() {
		cBaseFunction.call(this, "DGET");
	}

	cDGET.prototype = Object.create(cBaseFunction.prototype);
	cDGET.prototype.constructor = cDGET;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cDMAX() {
		cBaseFunction.call(this, "DMAX");
	}

	cDMAX.prototype = Object.create(cBaseFunction.prototype);
	cDMAX.prototype.constructor = cDMAX;



	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cDMIN() {
		cBaseFunction.call(this, "DMIN");
	}

	cDMIN.prototype = Object.create(cBaseFunction.prototype);
	cDMIN.prototype.constructor = cDMIN;
	cDMIN.prototype.argumentsMin = 3;
	cDMIN.prototype.argumentsMax = 3;
	cDMIN.prototype.Calculate = function (arg) {
		var oArguments = this._prepareArguments(arg, arguments[1], true, [cElementType.array, null, cElementType.array]);
		var argClone = oArguments.args;

		argClone[1] = argClone[1].tocString();

		var argError;
		if (argError = this._checkErrorArg(argClone)) {
			return this.value = argError;
		}

		var resArr = getNeedValuesFromDataBase(argClone[0], argClone[1], argClone[2]);

		resArr.sort(function(a, b) {
			return a - b;
		});

		return this.value = new cNumber(resArr[0]);
	};


	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cDPRODUCT() {
		cBaseFunction.call(this, "DPRODUCT");
	}

	cDPRODUCT.prototype = Object.create(cBaseFunction.prototype);
	cDPRODUCT.prototype.constructor = cDPRODUCT;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cDSTDEV() {
		cBaseFunction.call(this, "DSTDEV");
	}

	cDSTDEV.prototype = Object.create(cBaseFunction.prototype);
	cDSTDEV.prototype.constructor = cDSTDEV;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cDSTDEVP() {
		cBaseFunction.call(this, "DSTDEVP");
	}

	cDSTDEVP.prototype = Object.create(cBaseFunction.prototype);
	cDSTDEVP.prototype.constructor = cDSTDEVP;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cDSUM() {
		cBaseFunction.call(this, "DSUM");
	}

	cDSUM.prototype = Object.create(cBaseFunction.prototype);
	cDSUM.prototype.constructor = cDSUM;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cDVAR() {
		cBaseFunction.call(this, "DVAR");
	}

	cDVAR.prototype = Object.create(cBaseFunction.prototype);
	cDVAR.prototype.constructor = cDVAR;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cDVARP() {
		cBaseFunction.call(this, "DVARP");
	}

	cDVARP.prototype = Object.create(cBaseFunction.prototype);
	cDVARP.prototype.constructor = cDVARP;
})(window);
