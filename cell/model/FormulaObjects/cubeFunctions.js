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

	cFormulaFunctionGroup['Cube'] = cFormulaFunctionGroup['Cube'] || [];
	cFormulaFunctionGroup['Cube'].push(cCUBEKPIMEMBER, cCUBEMEMBER, cCUBEMEMBERPROPERTY, cCUBERANKEDMEMBER, cCUBESET,
		cCUBESETCOUNT, cCUBEVALUE);

	cFormulaFunctionGroup['NotRealised'] = cFormulaFunctionGroup['NotRealised'] || [];
	cFormulaFunctionGroup['NotRealised'].push(cCUBEKPIMEMBER, cCUBEMEMBER, cCUBEMEMBERPROPERTY, cCUBERANKEDMEMBER,
		cCUBESET, cCUBESETCOUNT, cCUBEVALUE);

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cCUBEKPIMEMBER() {
	}

	cCUBEKPIMEMBER.prototype = Object.create(cBaseFunction.prototype);
	cCUBEKPIMEMBER.prototype.constructor = cCUBEKPIMEMBER;
	cCUBEKPIMEMBER.prototype.name = 'CUBEKPIMEMBER';

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cCUBEMEMBER() {
	}

	cCUBEMEMBER.prototype = Object.create(cBaseFunction.prototype);
	cCUBEMEMBER.prototype.constructor = cCUBEMEMBER;
	cCUBEMEMBER.prototype.name = 'CUBEMEMBER';

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cCUBEMEMBERPROPERTY() {
	}

	cCUBEMEMBERPROPERTY.prototype = Object.create(cBaseFunction.prototype);
	cCUBEMEMBERPROPERTY.prototype.constructor = cCUBEMEMBERPROPERTY;
	cCUBEMEMBERPROPERTY.prototype.name = 'CUBEMEMBERPROPERTY';

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cCUBERANKEDMEMBER() {
	}

	cCUBERANKEDMEMBER.prototype = Object.create(cBaseFunction.prototype);
	cCUBERANKEDMEMBER.prototype.constructor = cCUBERANKEDMEMBER;
	cCUBERANKEDMEMBER.prototype.name = 'CUBERANKEDMEMBER';

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cCUBESET() {
	}

	cCUBESET.prototype = Object.create(cBaseFunction.prototype);
	cCUBESET.prototype.constructor = cCUBESET;
	cCUBESET.prototype.name = 'CUBESET';

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cCUBESETCOUNT() {
	}

	cCUBESETCOUNT.prototype = Object.create(cBaseFunction.prototype);
	cCUBESETCOUNT.prototype.constructor = cCUBESETCOUNT;
	cCUBESETCOUNT.prototype.name = 'CUBESETCOUNT';

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cCUBEVALUE() {
	}

	cCUBEVALUE.prototype = Object.create(cBaseFunction.prototype);
	cCUBEVALUE.prototype.constructor = cCUBEVALUE;
	cCUBEVALUE.prototype.name = 'CUBEVALUE';
})(window);
