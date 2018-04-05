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
/**
 * User: Ilja.Kirillov
 * Date: 20.10.2017
 * Time: 15:46
 */

var fieldtype_UNKNOWN    = 0x0000;
var fieldtype_MERGEFIELD = 0x0001;
var fieldtype_PAGENUM    = 0x0002;
var fieldtype_PAGECOUNT  = 0x0003;
var fieldtype_FORMTEXT   = 0x0004;
var fieldtype_TOC        = 0x0005;
var fieldtype_PAGEREF    = 0x0006;
var fieldtype_PAGE       = fieldtype_PAGENUM;
var fieldtype_NUMPAGES   = fieldtype_PAGECOUNT;

var fieldtype_ASK        = 0x0007;
var fieldtype_REF        = 0x0008;
var fieldtype_HYPERLINK  = 0x0009;

//--------------------------------------------------------export----------------------------------------------------
window['AscCommonWord'] = window['AscCommonWord'] || {};

window['AscCommonWord'].fieldtype_UNKNOWN    = fieldtype_UNKNOWN;
window['AscCommonWord'].fieldtype_MERGEFIELD = fieldtype_MERGEFIELD;
window['AscCommonWord'].fieldtype_PAGENUM    = fieldtype_PAGENUM;
window['AscCommonWord'].fieldtype_PAGECOUNT  = fieldtype_PAGECOUNT;
window['AscCommonWord'].fieldtype_FORMTEXT   = fieldtype_FORMTEXT;
window['AscCommonWord'].fieldtype_TOC        = fieldtype_TOC;
window['AscCommonWord'].fieldtype_PAGEREF    = fieldtype_PAGEREF;
window['AscCommonWord'].fieldtype_PAGE       = fieldtype_PAGE;
window['AscCommonWord'].fieldtype_NUMPAGES   = fieldtype_NUMPAGES;
window['AscCommonWord'].fieldtype_ASK        = fieldtype_ASK;
window['AscCommonWord'].fieldtype_REF        = fieldtype_REF;
window['AscCommonWord'].fieldtype_HYPERLINK  = fieldtype_HYPERLINK;

/**
 * Базовый класс для инструкции сложного поля.
 * @constructor
 */
function CFieldInstructionBase()
{
	this.ComplexField = null;
}
CFieldInstructionBase.prototype.Type = fieldtype_UNKNOWN;
CFieldInstructionBase.prototype.GetType = function()
{
	return this.Type;
};
CFieldInstructionBase.prototype.SetComplexField = function(oComplexField)
{
	this.ComplexField = oComplexField;
};
CFieldInstructionBase.prototype.GetComplexField = function()
{
	return this.ComplexField;
};
CFieldInstructionBase.prototype.ToString = function()
{
	return "";
};
CFieldInstructionBase.prototype.SetPr = function()
{
};

/**
 * PAGE field
 * @constructor
 */
function CFieldInstructionPAGE()
{
	CFieldInstructionBase.call(this);
}

CFieldInstructionPAGE.prototype = Object.create(CFieldInstructionBase.prototype);
CFieldInstructionPAGE.prototype.constructor = CFieldInstructionPAGE;
CFieldInstructionPAGE.prototype.Type = fieldtype_PAGE;

/**
 * PAGEREF field
 * @constructor
 */
function CFieldInstructionPAGEREF(sBookmarkName, isHyperlink, isPositionRelative)
{
	CFieldInstructionBase.call(this);

	this.BookmarkName = sBookmarkName ? sBookmarkName : "";
	this.Hyperlink    = isHyperlink ? true : false;
	this.PosRelative  = isPositionRelative ? true : false;
}

CFieldInstructionPAGEREF.prototype = Object.create(CFieldInstructionBase.prototype);
CFieldInstructionPAGEREF.prototype.constructor = CFieldInstructionPAGEREF;
CFieldInstructionPAGEREF.prototype.Type = fieldtype_PAGEREF;
CFieldInstructionPAGEREF.prototype.SetHyperlink = function(isHyperlink)
{
	this.Hyperlink   = isHyperlink ? true : false;
};
CFieldInstructionPAGEREF.prototype.SetPositionRelative = function(isPosRel)
{
	this.PosRelative = isPosRel ? true : false;
};
CFieldInstructionPAGEREF.prototype.IsHyperlink = function()
{
	return this.Hyperlink;
};
CFieldInstructionPAGEREF.prototype.IsPositionRelative = function()
{
	return this.PosRelative;
};
CFieldInstructionPAGEREF.prototype.GetBookmarkName = function()
{
	return this.BookmarkName;
};

/**
 * TOC field
 * @constructor
 */
function CFieldInstructionTOC()
{
	CFieldInstructionBase.call(this);

	this.PreserveTabs     = false;
	this.RemoveBreaks     = true;
	this.Hyperlinks       = false;
	this.Separator        = "";
	this.HeadingS         = -1;
	this.HeadingE         = -1;
	this.Styles           = [];
	this.SkipPageRef      = false;
	this.SkipPageRefStart = -1;
	this.SkipPageRefEnd   = -1;
	this.ForceTabLeader   = undefined;
}

CFieldInstructionTOC.prototype = Object.create(CFieldInstructionBase.prototype);
CFieldInstructionTOC.prototype.constructor = CFieldInstructionTOC;
CFieldInstructionTOC.prototype.Type = fieldtype_TOC;
CFieldInstructionTOC.prototype.IsPreserveTabs = function()
{
	return this.PreserveTabs;
};
CFieldInstructionTOC.prototype.SetPreserveTabs = function(isPreserve)
{
	this.PreserveTabs = isPreserve;
};
CFieldInstructionTOC.prototype.IsRemoveBreaks = function()
{
	return this.RemoveBreaks;
};
CFieldInstructionTOC.prototype.SetRemoveBreaks = function(isRemove)
{
	this.RemoveBreaks = isRemove;
};
CFieldInstructionTOC.prototype.IsHyperlinks = function()
{
	return this.Hyperlinks;
};
CFieldInstructionTOC.prototype.SetHyperlinks = function(isHyperlinks)
{
	this.Hyperlinks = isHyperlinks;
};
CFieldInstructionTOC.prototype.SetSeparator = function(sSeparator)
{
	this.Separator = sSeparator;
};
CFieldInstructionTOC.prototype.GetSeparator = function()
{
	return this.Separator;
};
CFieldInstructionTOC.prototype.SetHeadingRange = function(nStart, nEnd)
{
	this.HeadingS = nStart;
	this.HeadingE = nEnd;
};
CFieldInstructionTOC.prototype.GetHeadingRangeStart = function()
{
	return this.HeadingS;
};
CFieldInstructionTOC.prototype.GetHeadingRangeEnd = function()
{
	return this.HeadingE;
};
CFieldInstructionTOC.prototype.SetStylesArrayRaw = function(sString)
{
	// В спецификации написано, то разделено запятыми, но на деле Word реагирует на точку с запятой
	var arrValues = sString.split(";");
	var arrStyles = [];

	for (var nIndex = 0, nCount = arrValues.length; nIndex < nCount - 1; nIndex += 2)
	{
		var sName = arrValues[nIndex];
		var nLvl  = parseInt(arrValues[nIndex + 1]);
		if (isNaN(nLvl))
			break;

		arrStyles.push({
			Name : sName,
			Lvl  : nLvl
		});
	}

	this.SetStylesArray(arrStyles);
};
CFieldInstructionTOC.prototype.SetStylesArray = function(arrStyles)
{
	this.Styles = arrStyles;
};
CFieldInstructionTOC.prototype.GetStylesArray = function()
{
	return this.Styles;
};
CFieldInstructionTOC.prototype.SetPageRefSkippedLvls = function(isSkip, nSkipStart, nSkipEnd)
{
	this.SkipPageRef = isSkip;

	if (true === isSkip
		&& null !== nSkipStart
		&& undefined !== nSkipStart
		&& null !== nSkipEnd
		&& undefined !== nSkipEnd)
	{
		this.SkipPageRefStart = nSkipStart;
		this.SkipPageRefEnd   = nSkipEnd;
	}
	else
	{
		this.SkipPageRefStart = -1;
		this.SkipPageRefEnd   = -1;
	}
};
CFieldInstructionTOC.prototype.IsSkipPageRefLvl = function(nLvl)
{
	if (undefined === nLvl)
		return this.SkipPageRef;

	if (false === this.SkipPageRef)
		return false;

	if (-1 === this.SkipPageRefStart || -1 === this.SkipPageRefEnd)
		return true;

	return  (nLvl >= this.SkipPageRefStart - 1 && nLvl <= this.SkipPageRefEnd - 1);
};
CFieldInstructionTOC.prototype.SetPr = function(oPr)
{
	if (!(oPr instanceof Asc.CTableOfContentsPr))
		return;

	this.SetStylesArray(oPr.get_Styles());
	this.SetHeadingRange(oPr.get_OutlineStart(), oPr.get_OutlineEnd());
	this.SetHyperlinks(oPr.get_Hyperlink());

	if (oPr.PageNumbers)
		this.SetPageRefSkippedLvls(false);
	else
		this.SetPageRefSkippedLvls(true);

	if (oPr.RightTab)
		this.SetSeparator("");
	else
		this.SetSeparator(" ");

	this.ForceTabLeader = oPr.TabLeader;
};
CFieldInstructionTOC.prototype.GetForceTabLeader = function()
{
	var nTabLeader = this.ForceTabLeader;
	this.ForceTabLeader = undefined;
	return nTabLeader;
};
CFieldInstructionTOC.prototype.ToString = function()
{
	var sInstr = "TOC ";

	if (this.HeadingS >= 1
		&& this.HeadingS <= 9
		&& this.HeadingE >= this.HeadingS
		&& this.HeadingE <= 9)
		sInstr +=  "\\o " + "\"" + this.HeadingS + "-" + this.HeadingE + "\" ";

	if (this.SkipPageRef)
	{
		sInstr += "\\n ";

		if (this.SkipPageRefStart >= 1
			&& this.SkipPageRefStart <= 9
			&& this.SkipPageRefEnd >= this.SkipPageRefStart
			&& this.SkipPageRefEnd <= 9)
			sInstr +=  "\"" + this.SkipPageRefStart + "-" + this.SkipPageRefEnd + "\" ";
	}

	if (this.Hyperlinks)
		sInstr += "\\h ";

	if (!this.RemoveBreaks)
		sInstr += "\\x ";

	if (this.PreserveTabs)
		sInstr += "\\w ";

	if (this.Separator)
		sInstr += "\\p \"" + this.Separator + "\"";

	if (this.Styles.length > 0)
	{
		sInstr += "\\t \"";

		for (var nIndex = 0, nCount = this.Styles.length; nIndex < nCount; ++nIndex)
		{
			sInstr += this.Styles[nIndex].Name + ";" + this.Styles[nIndex].Lvl + ";";
		}

		sInstr += "\" ";
	}

	return sInstr;
};

/**
 * ASK field
 * @constructor
 */
function CFieldInstructionASK()
{
	CFieldInstructionBase.call(this);

	this.BookmarkName = "";
	this.PromptText   = "";
}
CFieldInstructionASK.prototype = Object.create(CFieldInstructionBase.prototype);
CFieldInstructionASK.prototype.constructor = CFieldInstructionASK;
CFieldInstructionASK.prototype.Type = fieldtype_ASK;
CFieldInstructionASK.prototype.SetBookmarkName = function(sBookmarkName)
{
	this.BookmarkName = sBookmarkName;
};
CFieldInstructionASK.prototype.GetBookmarkName = function()
{
	return this.BookmarkName;
};
CFieldInstructionASK.prototype.SetPromptText = function(sText)
{
	this.PromptText = sText;
};
CFieldInstructionASK.prototype.GetPromptText = function()
{
	if (!this.PromptText)
		return this.BookmarkName;

	return this.PromptText;
};

/**
 * REF field
 * @constructor
 */
function CFieldInstructionREF()
{
	CFieldInstructionBase.call(this);

	this.BookmarkName = "";
}
CFieldInstructionREF.prototype = Object.create(CFieldInstructionBase.prototype);
CFieldInstructionREF.prototype.constructor = CFieldInstructionREF;
CFieldInstructionREF.prototype.Type = fieldtype_REF;
CFieldInstructionREF.prototype.SetBookmarkName = function(sBookmarkName)
{
	this.BookmarkName = sBookmarkName;
};
CFieldInstructionREF.prototype.GetBookmarkName = function()
{
	return this.BookmarkName;
};

/**
 * NUMPAGES field
 * @constructor
 */
function CFieldInstructionNUMPAGES()
{
	CFieldInstructionBase.call(this);
}
CFieldInstructionNUMPAGES.prototype = Object.create(CFieldInstructionBase.prototype);
CFieldInstructionNUMPAGES.prototype.constructor = CFieldInstructionNUMPAGES;
CFieldInstructionNUMPAGES.prototype.Type = fieldtype_NUMPAGES;

/**
 * HYPERLINK field
 * @constructor
 */
function CFieldInstructionHYPERLINK()
{
	CFieldInstructionBase.call(this);

	this.ToolTip      = "";
	this.Link         = "";
	this.BookmarkName = "";
}
CFieldInstructionHYPERLINK.prototype = Object.create(CFieldInstructionBase.prototype);
CFieldInstructionHYPERLINK.prototype.constructor = CFieldInstructionHYPERLINK;
CFieldInstructionHYPERLINK.prototype.Type = fieldtype_HYPERLINK;
CFieldInstructionHYPERLINK.prototype.SetToolTip = function(sToolTip)
{
	this.ToolTip = sToolTip;
};
CFieldInstructionHYPERLINK.prototype.GetToolTip = function()
{
	if ("" === this.ToolTip)
		return this.Link;

	return this.ToolTip;
};
CFieldInstructionHYPERLINK.prototype.SetLink = function(sLink)
{
	this.Link = sLink;
};
CFieldInstructionHYPERLINK.prototype.GetLink = function()
{
	return this.Link;
};
CFieldInstructionHYPERLINK.prototype.SetBookmarkName = function(sBookmarkName)
{
	this.BookmarkName = sBookmarkName;
};
CFieldInstructionHYPERLINK.prototype.GetBookmarkName = function()
{
	return this.BookmarkName;
};
CFieldInstructionHYPERLINK.prototype.ToString = function()
{
	var sInstr = "HYPERLINK ";
	if (this.Link)
		sInstr +=  "\"" + this.Link + "\"";

	if (this.ToolTip)
		sInstr += "\\o \"" + this.ToolTip + "\"";

	if (this.BookmarkName)
		sInstr += "\\l " + this.BookmarkName;

	return sInstr;
};
//----------------------------------------------------------------------------------------------------------------------
// Функции для совместимости с обычным ParaHyperlink
//----------------------------------------------------------------------------------------------------------------------
CFieldInstructionHYPERLINK.prototype.GetAnchor = function()
{
	return this.GetBookmarkName();
};
CFieldInstructionHYPERLINK.prototype.GetValue = function()
{
	return this.GetLink();
};
CFieldInstructionHYPERLINK.prototype.SetVisited = function(isVisited)
{
};


/**
 * Класс для разбора строки с инструкцией
 * @constructor
 */
function CFieldInstructionParser()
{
	this.Line   = "";
	this.Pos    = 0;
	this.Buffer = "";
	this.Result = null;

	this.SavedStates = [];
}
CFieldInstructionParser.prototype.GetInstructionClass = function(sLine)
{
	this.Line   = sLine;
	this.Pos    = 0;
	this.Buffer = "";
	this.Result = null;

	this.private_Parse();

	return this.Result;
};
CFieldInstructionParser.prototype.private_Parse = function()
{
	if (!this.private_ReadNext())
		return this.private_ReadREF("");

	switch (this.Buffer.toUpperCase())
	{
		case "PAGE": this.private_ReadPAGE(); break;
		case "PAGEREF": this.private_ReadPAGEREF(); break;
		case "TOC": this.private_ReadTOC(); break;
		case "ASK": this.private_ReadASK(); break;
		case "REF": this.private_ReadREF(); break;
		case "NUMPAGES": this.private_ReadNUMPAGES(); break;
		case "HYPERLINK": this.private_ReadHYPERLINK(); break;

		default: this.private_ReadREF(this.Buffer); break;
	}
};
CFieldInstructionParser.prototype.private_ReadNext = function()
{
	var nLen  = this.Line.length,
		bWord = false;

	this.Buffer = "";

	while (this.Pos < nLen)
	{
		var nCharCode = this.Line.charCodeAt(this.Pos);
		if (32 === nCharCode || 9 === nCharCode)
		{
			if (bWord)
				return true;
		}
		else if (34 === nCharCode && (0 === this.Pos || 92 !== this.Line.charCodeAt(this.Pos - 1)))
		{
			// Кавычки
			this.Pos++;
			while (this.Pos < nLen)
			{
				nCharCode = this.Line.charCodeAt(this.Pos);
				if (34 === nCharCode && 92 !== this.Line.charCodeAt(this.Pos - 1))
				{
					this.Pos++;
					break;
				}

				bWord = true;

				if (34 === nCharCode && 92 === this.Line.charCodeAt(this.Pos - 1) && this.Buffer.length > 0)
					this.Buffer = this.Buffer.substring(0, this.Buffer.length - 1);

				this.Buffer += this.Line.charAt(this.Pos);

				this.Pos++;
			}

			return bWord;
		}
		else
		{
			this.Buffer += this.Line.charAt(this.Pos);
			bWord = true;
		}

		this.Pos++;
	}

	if (bWord)
		return true;

	return false;
};
CFieldInstructionParser.prototype.private_ReadArguments = function()
{
	var arrArguments = [];

	var sArgument = this.private_ReadArgument();
	while (null !== sArgument)
	{
		arrArguments.push(sArgument);
		sArgument = this.private_ReadArgument();
	}

	return arrArguments;
};
CFieldInstructionParser.prototype.private_ReadArgument = function()
{
	this.private_SaveState();

	if (!this.private_ReadNext())
		return null;

	if (this.private_IsSwitch())
	{
		this.private_RestoreState();
		return null;
	}

	this.private_RemoveLastState();
	return this.Buffer;
};
CFieldInstructionParser.prototype.private_IsSwitch = function()
{
	return this.Buffer.charAt(0) === '\\';
};
CFieldInstructionParser.prototype.private_GetSwitchLetter = function()
{
	return this.Buffer.charAt(1);
};
CFieldInstructionParser.prototype.private_SaveState = function()
{
	this.SavedStates.push(this.Pos);
};
CFieldInstructionParser.prototype.private_RestoreState = function()
{
	if (this.SavedStates.length > 0)
		this.Pos = this.SavedStates[this.SavedStates.length - 1];

	this.private_RemoveLastState();
};
CFieldInstructionParser.prototype.private_RemoveLastState = function()
{
	if (this.SavedStates.length > 0)
		this.SavedStates.splice(this.SavedStates.length - 1, 1);
};
CFieldInstructionParser.prototype.private_ReadGeneralFormatSwitch = function()
{
	if (!this.private_IsSwitch() || this.Buffer.charAt(1) !== '*')
		return;

	if (!this.private_ReadNext() || this.private_IsSwitch())
		return;

	// TODO: Тут надо прочитать поле

	//console.log("General switch: " + this.Buffer);
};
CFieldInstructionParser.prototype.private_ReadPAGE = function()
{
	this.Result = new CFieldInstructionPAGE();

	// Zero or more general-formatting-switches

	while (this.private_ReadNext())
	{
		if (this.private_IsSwitch())
			this.private_ReadGeneralFormatSwitch();
	}
};
CFieldInstructionParser.prototype.private_ReadPAGEREF = function()
{
	var sBookmarkName = null;
	var isHyperlink = false, isPageRel = false;

	var isSwitch = false, isBookmark = false;

	while (this.private_ReadNext())
	{
		if (this.private_IsSwitch())
		{
			isSwitch = true;

			if ('p' === this.Buffer.charAt(1))
				isPageRel = true;
			else if ('h' === this.Buffer.charAt(1))
				isHyperlink = true;
		}
		else if (!isSwitch && !isBookmark)
		{
			sBookmarkName = this.Buffer;
			isBookmark    = true;
		}
	}

	this.Result = new CFieldInstructionPAGEREF(sBookmarkName, isHyperlink, isPageRel);
};
CFieldInstructionParser.prototype.private_ReadTOC = function()
{
	// TODO: \a, \b, \c, \d, \f, \l, \s, \z, \u

	this.Result = new CFieldInstructionTOC();

	while (this.private_ReadNext())
	{
		if (this.private_IsSwitch())
		{
			var sType = this.private_GetSwitchLetter();
			if ('w' === sType)
			{
				this.Result.SetPreserveTabs(true);
			}
			else if ('x' === sType)
			{
				this.Result.SetRemoveBreaks(false);
			}
			else if ('h' === sType)
			{
				this.Result.SetHyperlinks(true);
			}
			else if ('p' === sType)
			{
				var arrArguments = this.private_ReadArguments();
				if (arrArguments.length > 0)
					this.Result.SetSeparator(arrArguments[0]);
			}
			else if ('o' === sType)
			{
				var arrArguments = this.private_ReadArguments();
				if (arrArguments.length > 0)
				{
					var arrRange = this.private_ParseIntegerRange(arrArguments[0]);
					if (null !== arrRange)
						this.Result.SetHeadingRange(arrRange[0], arrRange[1]);
				}
			}
			else if ('t' === sType)
			{
				var arrArguments = this.private_ReadArguments();
				if (arrArguments.length > 0)
					this.Result.SetStylesArrayRaw(arrArguments[0]);
			}
			else if ('n' === sType)
			{
				var arrArguments = this.private_ReadArguments();
				if (arrArguments.length > 0)
				{
					var arrRange = this.private_ParseIntegerRange(arrArguments[0]);
					if (null !== arrRange)
						this.Result.SetPageRefSkippedLvls(true, arrRange[0], arrRange[1]);
					else
						this.Result.SetPageRefSkippedLvls(true, -1, -1);
				}
				else
				{
					this.Result.SetPageRefSkippedLvls(true, -1, -1);
				}
			}
		}


	}

};
CFieldInstructionParser.prototype.private_ReadASK = function()
{
	this.Result = new CFieldInstructionASK();

	var arrArguments = this.private_ReadArguments();

	if (arrArguments.length >= 2)
		this.Result.SetPromptText(arrArguments[1]);

	if (arrArguments.length >= 1)
		this.Result.SetBookmarkName(arrArguments[0]);

	// TODO: Switches
};
CFieldInstructionParser.prototype.private_ReadREF = function(sBookmarkName)
{
	this.Result = new CFieldInstructionREF();

	if (undefined !== sBookmarkName)
	{
		this.Result.SetBookmarkName(sBookmarkName);
	}
	else
	{
		var arrArguments = this.private_ReadArguments();
		if (arrArguments.length > 0)
		{
			this.Result.SetBookmarkName(arrArguments[0]);
		}
	}

	// TODO: Switches
};
CFieldInstructionParser.prototype.private_ReadNUMPAGES = function()
{
	this.Result = new CFieldInstructionNUMPAGES();

	// TODO: Switches
};
CFieldInstructionParser.prototype.private_ReadHYPERLINK = function()
{
	this.Result = new CFieldInstructionHYPERLINK();
	var arrArguments = this.private_ReadArguments();
	if (arrArguments.length > 0)
		this.Result.SetLink(arrArguments[0]);

	while (this.private_ReadNext())
	{
		if (this.private_IsSwitch())
		{
			var sType = this.private_GetSwitchLetter();
			if ('o' === sType)
			{
				arrArguments = this.private_ReadArguments();
				if (arrArguments.length > 0)
					this.Result.SetToolTip(arrArguments[0]);
			}
			else if ('l' === sType)
			{
				arrArguments = this.private_ReadArguments();
				if (arrArguments.length > 0)
					this.Result.SetBookmarkName(arrArguments[0]);
			}

			// TODO: Остальные флаги \m \n \t для нас бесполезны
		}
	}
};
CFieldInstructionParser.prototype.private_ParseIntegerRange = function(sValue)
{
	// value1-value2

	var nSepPos = sValue.indexOf("-");
	if (-1 === nSepPos)
		return null;

	var nValue1 = parseInt(sValue.substr(0, nSepPos));
	var nValue2 = parseInt(sValue.substr(nSepPos + 1));

	if (isNaN(nValue1) || isNaN(nValue2))
		return null;

	return [nValue1, nValue2];
};



