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

	cFormulaFunctionGroup['Database'] = cFormulaFunctionGroup['Database'] || [];
	cFormulaFunctionGroup['Database'].push(cDAVERAGE, cDCOUNT, cDCOUNTA, cDGET, cDMAX, cDMIN, cDPRODUCT, cDSTDEV,
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
