/*
 * (c) Copyright Ascensio System SIA 2010-2018
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
	var cErrorType = AscCommonExcel.cErrorType;
	var cNumber = AscCommonExcel.cNumber;
	var cError = AscCommonExcel.cError;

	function checkValueByCondition(condition, val){
		var res = false;
		condition = condition.tocString();
		if(cElementType.error === condition.type){
			return false;
		}

		//condition  = condition.getValue();

		if("" === condition.value){
			res = true;
		}else{
			var conditionObj = AscCommonExcel.matchingValue(condition);
			//если строка, без операторов, добавляем * для поиска совпадений начинающихся с данной строки
			//так делает MS. lo ищет строгие совпадения
			if(null === conditionObj.op && cElementType.string === conditionObj.val.type){
				conditionObj.val.value += "*";
			}

			res = AscCommonExcel.matching(val, conditionObj);
		}
		return res;
	}

	function convertDatabase(dataBase, bIsCondition) {
		var arr = [];
		var map = {};

		for(var i = 0; i < dataBase.length; i++){
			for(var j = 0; j < dataBase[0].length; j++){
				var header = dataBase[0][j].getValue();
				if(bIsCondition){
					if(0 === i){
						arr[j] = header;
						if(map.hasOwnProperty(header)){//если находим такой же заголовок, пропускаем
							continue;
						}else{
							map[header] = [];
						}
					}else{
						map[header].push(dataBase[i][j]);
					}
				}else{
					if(0 === i){
						if(map.hasOwnProperty(header)){//если находим такой же заголовок, пропускаем
							continue;
						}else{
							map[header] = [];
							arr[j] = header;
						}
					}else{
						if(!map[header][i - 1]){
							map[header][i - 1] = dataBase[i][j];
						}
					}
				}
			}
		}

		return {arr: arr, map: map};
	}

	function getNeedValuesFromDataBase(dataBase, field, conditionData, bIsGetObjArray, doNotCheckEmptyField){

		//заполняем map название столбца-> его содержимое(из базы данных)
		var databaseObj = convertDatabase(dataBase);
		var headersArr = databaseObj.arr, headersDataMap = databaseObj.map;

		//заполняем map название столбца-> его содержимое(из условий)
		databaseObj = convertDatabase(conditionData, true);
		var headersConditionArr = databaseObj.arr, headersConditionMap = databaseObj.map;

		//преобразуем аргумент поле
		if (cElementType.cell === field.type || cElementType.cell3D === field.type) {
			field = field.getValue();
		}

		if (!doNotCheckEmptyField && cElementType.empty === field.type) {
			return new cError(cErrorType.wrong_value_type);
		}

		var isNumberField = field.tocNumber();
		var isEmptyField = cElementType.empty === field.type;
		if(cElementType.error === isNumberField.type){
			field = field.getValue();
		}else{
			//если поле задано числом, то выбираем заголовок столбца с данным именем
			var number = isNumberField.getValue();
			if(headersArr[number - 1]){
				field = headersArr[number - 1];
			}else{
				field = null;
			}
		}

		if(!isEmptyField && null === field){
			return new cError(cErrorType.wrong_value_type);
		}

		var previousWinArray;
		var winElems = [];
		for(var i = 1; i < conditionData.length; i++){
			previousWinArray = null;
			for(var j = 0; j < conditionData[0].length; j++){
				var condition = conditionData[i][j];
				var header = headersConditionArr[j];

				//проходимся по всем строкам данного столбца из базы и смотрим что нам подходит по условию
				var databaseData = headersDataMap[header];

				if(!databaseData){
					continue;
				}

				var winColumnArray = [];
				for(var n = 0; n < databaseData.length; n++){
					if(previousWinArray && previousWinArray[n]){
						if(checkValueByCondition(condition, databaseData[n])){
							winColumnArray[n] = true;
						}
					}else if(!previousWinArray && checkValueByCondition(condition, databaseData[n])){
						winColumnArray[n] = true;
					}
				}
				previousWinArray = winColumnArray;
			}
			winElems[i - 1] = previousWinArray;
		}


		var resArr = [];
		var usuallyAddElems = [];
		var needDataColumn;
		if(isEmptyField && headersConditionArr && headersConditionArr[0]){
			needDataColumn = headersDataMap[headersConditionArr[0]];
		}else{
			needDataColumn = headersDataMap[field];
		}

		if(!needDataColumn){
			return new cError(cErrorType.wrong_value_type);
		}

		for(var i = 0; i < winElems.length; i++){
			for(var j in winElems[i]){
				if(true === usuallyAddElems[j] || cElementType.empty === needDataColumn[j].type){
					continue;
				}

				if(bIsGetObjArray){
					resArr.push(needDataColumn[j]);
				}else{
					resArr.push(needDataColumn[j].getValue());
				}

				usuallyAddElems[j] = true;
			}
		}

		return resArr.length ? resArr : new cError(cErrorType.division_by_zero);
	}

	cFormulaFunctionGroup['Database'] = cFormulaFunctionGroup['Database'] || [];
	cFormulaFunctionGroup['Database'].push(cDAVERAGE, cDCOUNT, cDCOUNTA, cDGET, cDMAX, cDMIN, cDPRODUCT, cDSTDEV,
		cDSTDEVP, cDSUM, cDVAR, cDVARP);

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cDAVERAGE() {
	}

	cDAVERAGE.prototype = Object.create(cBaseFunction.prototype);
	cDAVERAGE.prototype.constructor = cDAVERAGE;
	cDAVERAGE.prototype.name = "DAVERAGE";
	cDAVERAGE.prototype.argumentsMin = 3;
	cDAVERAGE.prototype.argumentsMax = 3;
	cDAVERAGE.prototype.numFormat = AscCommonExcel.cNumFormatNone;
	cDAVERAGE.prototype.Calculate = function (arg) {

		var oArguments = this._prepareArguments(arg, arguments[1], true, [cElementType.array, null, cElementType.array]);
		var argClone = oArguments.args;

		var argError;
		if (argError = this._checkErrorArg(argClone)) {
			return argError;
		}

		var resArr = getNeedValuesFromDataBase(argClone[0], argClone[1], argClone[2]);
		if(cElementType.error === resArr.type){
			return resArr;
		}

		var summ = 0;
		var count = 0;
		for(var i = 0; i < resArr.length; i++){
			var val = parseFloat(resArr[i]);
			if(!isNaN(val)){
				summ += val;
				count++;
			}
		}

		if(0 === count){
			return new cError(cErrorType.division_by_zero);
		}

		 var res = new cNumber(summ / count);
		 return cElementType.error === res.type ? new cNumber(0) : res;
	 };


	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cDCOUNT() {
	}

	cDCOUNT.prototype = Object.create(cBaseFunction.prototype);
	cDCOUNT.prototype.constructor = cDCOUNT;
	cDCOUNT.prototype.name = "DCOUNT";
	cDCOUNT.prototype.argumentsMin = 3;
	cDCOUNT.prototype.argumentsMax = 3;
	cDCOUNT.prototype.numFormat = AscCommonExcel.cNumFormatNone;
	cDCOUNT.prototype.Calculate = function (arg) {

		var oArguments = this._prepareArguments(arg, arguments[1], true, [cElementType.array, null, cElementType.array]);
		var argClone = oArguments.args;

		var argError;
		if (argError = this._checkErrorArg(argClone)) {
			return argError;
		}

		var resArr = getNeedValuesFromDataBase(argClone[0], argClone[1], argClone[2], null, true);
		if(cElementType.error === resArr.type){
			return resArr;
		}

		var isEmptyField = cElementType.empty === argClone[1].type;
		var count = 0;
		for(var i = 0; i < resArr.length; i++){
			//если Поле пустое, то ms игнорирует числовой формат полученных данных
			if(isEmptyField) {
				count++;
			} else {
				var val = parseFloat(resArr[i]);
				if(!isNaN(val)){
					count++;
				}
			}
		}

		return new cNumber(count);
	};


	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cDCOUNTA() {
	}

	cDCOUNTA.prototype = Object.create(cBaseFunction.prototype);
	cDCOUNTA.prototype.constructor = cDCOUNTA;
	cDCOUNTA.prototype.name = "DCOUNTA";
	cDCOUNTA.prototype.argumentsMin = 3;
	cDCOUNTA.prototype.argumentsMax = 3;
	cDCOUNTA.prototype.numFormat = AscCommonExcel.cNumFormatNone;
	cDCOUNTA.prototype.Calculate = function (arg) {

		var oArguments = this._prepareArguments(arg, arguments[1], true, [cElementType.array, null, cElementType.array]);
		var argClone = oArguments.args;

		var argError;
		if (argError = this._checkErrorArg(argClone)) {
			return argError;
		}

		var resArr = getNeedValuesFromDataBase(argClone[0], argClone[1], argClone[2], true, true);
		if(cElementType.error === resArr.type){
			return resArr;
		}

		var count = 0;
		for(var i = 0; i < resArr.length; i++){
			if(cElementType.empty !== resArr[i].type){
				count++;
			}
		}

		return new cNumber(count);
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cDGET() {
	}

	cDGET.prototype = Object.create(cBaseFunction.prototype);
	cDGET.prototype.constructor = cDGET;
	cDGET.prototype.name = "DGET";
	cDGET.prototype.argumentsMin = 3;
	cDGET.prototype.argumentsMax = 3;
	cDGET.prototype.numFormat = AscCommonExcel.cNumFormatNone;
	cDGET.prototype.Calculate = function (arg) {

		var oArguments = this._prepareArguments(arg, arguments[1], true, [cElementType.array, null, cElementType.array]);
		var argClone = oArguments.args;

		var argError;
		if (argError = this._checkErrorArg(argClone)) {
			return argError;
		}

		var resArr = getNeedValuesFromDataBase(argClone[0], argClone[1], argClone[2]);
		if(cElementType.error === resArr.type){
			return resArr;
		}
		if(1 !== resArr.length){
			return  new cError(cErrorType.not_numeric);
		}

		var res = new cNumber(resArr[0]);
		return cElementType.error === res.type ? new cNumber(0) : res;
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cDMAX() {
	}

	cDMAX.prototype = Object.create(cBaseFunction.prototype);
	cDMAX.prototype.constructor = cDMAX;
	cDMAX.prototype.name = "DMAX";
	cDMAX.prototype.argumentsMin = 3;
	cDMAX.prototype.argumentsMax = 3;
	cDMAX.prototype.numFormat = AscCommonExcel.cNumFormatNone;
	cDMAX.prototype.Calculate = function (arg) {

		var oArguments = this._prepareArguments(arg, arguments[1], true, [cElementType.array, null, cElementType.array]);
		var argClone = oArguments.args;

		var argError;
		if (argError = this._checkErrorArg(argClone)) {
			return argError;
		}

		var resArr = getNeedValuesFromDataBase(argClone[0], argClone[1], argClone[2]);
		if(cElementType.error === resArr.type){
			return resArr;
		}

		resArr.sort(function(a, b) {
			return b - a;
		});

		var res = new cNumber(resArr[0]);
		return cElementType.error === res.type ? new cNumber(0) : res;
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cDMIN() {
	}

	cDMIN.prototype = Object.create(cBaseFunction.prototype);
	cDMIN.prototype.constructor = cDMIN;
	cDMIN.prototype.name = "DMIN";
	cDMIN.prototype.argumentsMin = 3;
	cDMIN.prototype.argumentsMax = 3;
	cDMIN.prototype.numFormat = AscCommonExcel.cNumFormatNone;
	cDMIN.prototype.Calculate = function (arg) {

		var oArguments = this._prepareArguments(arg, arguments[1], true, [cElementType.array, null, cElementType.array]);
		var argClone = oArguments.args;

		var argError;
		if (argError = this._checkErrorArg(argClone)) {
			return argError;
		}

		var resArr = getNeedValuesFromDataBase(argClone[0], argClone[1], argClone[2]);
		 if(cElementType.error === resArr.type){
			return resArr;
		 }

		resArr.sort(function(a, b) {
			return a - b;
		});

		var res = new cNumber(resArr[0]);
		return cElementType.error === res.type ? new cNumber(0) : res;
	};


	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cDPRODUCT() {
	}

	cDPRODUCT.prototype = Object.create(cBaseFunction.prototype);
	cDPRODUCT.prototype.constructor = cDPRODUCT;
	cDPRODUCT.prototype.name = "DPRODUCT";
	cDPRODUCT.prototype.argumentsMin = 3;
	cDPRODUCT.prototype.argumentsMax = 3;
	cDPRODUCT.prototype.numFormat = AscCommonExcel.cNumFormatNone;
	cDPRODUCT.prototype.Calculate = function (arg) {

		var oArguments = this._prepareArguments(arg, arguments[1], true, [cElementType.array, null, cElementType.array]);
		var argClone = oArguments.args;

		var argError;
		if (argError = this._checkErrorArg(argClone)) {
			return argError;
		}

		var resArr = getNeedValuesFromDataBase(argClone[0], argClone[1], argClone[2]);
		if(cElementType.error === resArr.type){
			return resArr;
		}

		var res = 0;
		for(var i = 0; i < resArr.length; i++){
			var val = parseFloat(resArr[i]);
			if(!isNaN(val)){
				if(0 === res){
					res = val;
				}else{
					res *= val;
				}
			}
		}

		res = new cNumber(res);
		return cElementType.error === res.type ? new cNumber(0) : res;
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cDSTDEV() {
	}

	cDSTDEV.prototype = Object.create(cBaseFunction.prototype);
	cDSTDEV.prototype.constructor = cDSTDEV;
	cDSTDEV.prototype.name = "DSTDEV";
	cDSTDEV.prototype.argumentsMin = 3;
	cDSTDEV.prototype.argumentsMax = 3;
	cDSTDEV.prototype.numFormat = AscCommonExcel.cNumFormatNone;
	cDSTDEV.prototype.Calculate = function (arg) {

		var oArguments = this._prepareArguments(arg, arguments[1], true, [cElementType.array, null, cElementType.array]);
		var argClone = oArguments.args;

		var argError;
		if (argError = this._checkErrorArg(argClone)) {
			return argError;
		}

		var resArr = getNeedValuesFromDataBase(argClone[0], argClone[1], argClone[2]);
		if(cElementType.error === resArr.type){
			return resArr;
		}

		var sum = 0;
		var count = 0;
		var member = [];
		for(var i = 0; i < resArr.length; i++){
			var val = parseFloat(resArr[i]);
			if(!isNaN(val)){
				member[count] = val;
				sum += val;
				count++;
			}
		}

		if(0 === count){
			return new cError(cErrorType.division_by_zero);
		}

		var average = sum / count, res = 0, av;
		for (i = 0; i < member.length; i++) {
			av = member[i] - average;
			res += av * av;
		}
		return new cNumber(Math.sqrt(res / (count - 1)));
	 };

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cDSTDEVP() {
	}

	cDSTDEVP.prototype = Object.create(cBaseFunction.prototype);
	cDSTDEVP.prototype.constructor = cDSTDEVP;
	cDSTDEVP.prototype.name = "DSTDEVP";
	cDSTDEVP.prototype.argumentsMin = 3;
	cDSTDEVP.prototype.argumentsMax = 3;
	cDSTDEVP.prototype.numFormat = AscCommonExcel.cNumFormatNone;
	cDSTDEVP.prototype.Calculate = function (arg) {

		var oArguments = this._prepareArguments(arg, arguments[1], true, [cElementType.array, null, cElementType.array]);
		var argClone = oArguments.args;

		var argError;
		if (argError = this._checkErrorArg(argClone)) {
			return argError;
		}

		var resArr = getNeedValuesFromDataBase(argClone[0], argClone[1], argClone[2], true);
		if(cElementType.error === resArr.type){
			return resArr;
		}

		function _var(x) {
			var i, tA = [], sumSQRDeltaX = 0, _x = 0, xLength = 0;
			for (i = 0; i < x.length; i++) {
				if (cElementType.number === x[i].type) {
					_x += x[i].getValue();
					tA.push(x[i].getValue());
					xLength++;
				} else if (cElementType.error === x[i].type) {
					return x[i];
				}
			}

			_x /= xLength;

			for (i = 0; i < tA.length; i++) {
				sumSQRDeltaX += (tA[i] - _x) * (tA[i] - _x)
			}

			return new cNumber(isNaN(_x) ? new cError(cErrorType.division_by_zero) : Math.sqrt(sumSQRDeltaX / xLength));
		}

		return _var(resArr);
	};


	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cDSUM() {
	}

	cDSUM.prototype = Object.create(cBaseFunction.prototype);
	cDSUM.prototype.constructor = cDSUM;
	cDSUM.prototype.name = "DSUM";
	cDSUM.prototype.argumentsMin = 3;
	cDSUM.prototype.argumentsMax = 3;
	cDSUM.prototype.numFormat = AscCommonExcel.cNumFormatNone;
	cDSUM.prototype.Calculate = function (arg) {

		var oArguments = this._prepareArguments(arg, arguments[1], true, [cElementType.array, null, cElementType.array]);
		var argClone = oArguments.args;

		var argError;
		if (argError = this._checkErrorArg(argClone)) {
			return argError;
		}

		var resArr = getNeedValuesFromDataBase(argClone[0], argClone[1], argClone[2]);
		if(cElementType.error === resArr.type){
			return resArr;
		}

		var summ = 0;
		for(var i = 0; i < resArr.length; i++){
			var val = parseFloat(resArr[i]);
			if(!isNaN(val)){
				summ += val;
			}
		}

		var res = new cNumber(summ);
		return cElementType.error === res.type ? new cNumber(0) : res;
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cDVAR() {
	}

	cDVAR.prototype = Object.create(cBaseFunction.prototype);
	cDVAR.prototype.constructor = cDVAR;
	cDVAR.prototype.name = "DVAR";
	cDVAR.prototype.argumentsMin = 3;
	cDVAR.prototype.argumentsMax = 3;
	cDVAR.prototype.numFormat = AscCommonExcel.cNumFormatNone;
	cDVAR.prototype.Calculate = function (arg) {

		var oArguments = this._prepareArguments(arg, arguments[1], true, [cElementType.array, null, cElementType.array]);
		var argClone = oArguments.args;

		var argError;
		if (argError = this._checkErrorArg(argClone)) {
			return argError;
		}

		var resArr = getNeedValuesFromDataBase(argClone[0], argClone[1], argClone[2], true);
		if(cElementType.error === resArr.type){
			return resArr;
		}

		function _var(x) {
			if (x.length < 1) {
				return new cError(cErrorType.division_by_zero);
			}

			var i, tA = [], sumSQRDeltaX = 0, _x = 0, xLength = 0;
			for (i = 0; i < x.length; i++) {

				if (cElementType.number === x[i].type) {
					_x += x[i].getValue();
					tA.push(x[i].getValue());
					xLength++;
				} else if (cElementType.error === x[i].type) {
					return x[i];
				}

			}

			_x /= xLength;

			for (i = 0; i < x.length; i++) {
				sumSQRDeltaX += (tA[i] - _x) * (tA[i] - _x)
			}

			return new cNumber(sumSQRDeltaX / (xLength - 1));
		}

		var res = _var(resArr);
		return /*cElementType.error === res.type ? new cNumber(0) :*/ res;
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cDVARP() {
	}

	cDVARP.prototype = Object.create(cBaseFunction.prototype);
	cDVARP.prototype.constructor = cDVARP;
	cDVARP.prototype.name = "DVARP";
	cDVARP.prototype.argumentsMin = 3;
	cDVARP.prototype.argumentsMax = 3;
	cDVARP.prototype.numFormat = AscCommonExcel.cNumFormatNone;
	cDVARP.prototype.Calculate = function (arg) {

		var oArguments = this._prepareArguments(arg, arguments[1], true, [cElementType.array, null, cElementType.array]);
		var argClone = oArguments.args;

		var argError;
		if (argError = this._checkErrorArg(argClone)) {
			return argError;
		}

		var resArr = getNeedValuesFromDataBase(argClone[0], argClone[1], argClone[2], true);
		if(cElementType.error === resArr.type){
			return resArr;
		}

		function _var(x) {
			if (x.length < 1) {
				return new cError(cErrorType.division_by_zero);
			}

			var tA = [], sumSQRDeltaX = 0, _x = 0, xLength = 0, i;
			for (i = 0; i < x.length; i++) {

				if (cElementType.number === x[i].type) {
					_x += x[i].getValue();
					tA.push(x[i].getValue());
					xLength++;
				} else if (cElementType.error === x[i].type) {
					return x[i];
				}

			}

			_x /= xLength;

			for (i = 0; i < x.length; i++) {
				sumSQRDeltaX += (tA[i] - _x) * (tA[i] - _x);
			}

			return new cNumber(sumSQRDeltaX / xLength);

		}

		var res = _var(resArr);
		return /*cElementType.error === res.type ? new cNumber(0) :*/ res;
	};

})(window);
