/*
 * (c) Copyright Ascensio System SIA 2010-2016
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
  // Import
  var c_oAscBorderStyles = AscCommon.c_oAscBorderStyles;

  /** @constructor */
  function asc_CCellFlag(m, s, w, t, l) {
    this.merge = !!m;
    this.shrinkToFit = !!s;
    this.wrapText = !!w;
    this.selectionType = t;
    this.lockText = !!l;
    this.multiselect = false;
  }

  asc_CCellFlag.prototype.asc_getMerge = function () {
    return this.merge;
  };
  asc_CCellFlag.prototype.asc_getShrinkToFit = function () {
    return this.shrinkToFit;
  };
  asc_CCellFlag.prototype.asc_getWrapText = function () {
    return this.wrapText;
  };
  asc_CCellFlag.prototype.asc_getSelectionType = function () {
    return this.selectionType;
  };
  asc_CCellFlag.prototype.asc_getMultiselect = function () {
    return this.multiselect;
  };
  asc_CCellFlag.prototype.asc_getLockText = function () {
    return this.lockText;
  };

    /** @constructor */
    function asc_CFont(name, size, color, b, i, u, s, sub, sup) {
      this.name = name !== undefined ? name : "Arial";
      this.size = size !== undefined ? size : 10;
      this.color = color !== undefined ? color : null;
      this.bold = !!b;
      this.italic = !!i;
      this.underline = !!u;
      this.strikeout = !!s;
      this.subscript = !!sub;
      this.superscript = !!sup;
    }
    asc_CFont.prototype = {
      asc_getName: function() {
        return this.name;
      }, asc_getSize: function() {
        return this.size;
      }, asc_getBold: function() {
        return this.bold;
      }, asc_getItalic: function() {
        return this.italic;
      }, asc_getUnderline: function() {
        return this.underline;
      }, asc_getStrikeout: function() {
        return this.strikeout;
      }, asc_getSubscript: function() {
        return this.subscript;
      }, asc_getSuperscript: function() {
        return this.superscript;
      }, asc_getColor: function() {
        return this.color;
      }
    };

    /** @constructor */
    function asc_CFill(color) {
      this.color = color !== undefined ? color : null;
    }
    asc_CFill.prototype = {
      asc_getColor: function() {
        return this.color;
      }
    };

    /** @constructor */
    function asc_CBorder(style, color) {
      // ToDo заглушка для создания border-а
      if (typeof style === "string") {
        switch (style) {
          case "thin"    :
            this.style = c_oAscBorderStyles.Thin;
            break;
          case "medium"  :
            this.style = c_oAscBorderStyles.Medium;
            break;
          case "thick"  :
            this.style = c_oAscBorderStyles.Thick;
            break;
          default      :
            this.style = c_oAscBorderStyles.None;
            break;
        }
      } else {
        this.style = style !== undefined ? style : c_oAscBorderStyles.None;
      }
      this.color = color !== undefined ? color : null;
    }
    asc_CBorder.prototype = {
      asc_getStyle: function() {
        return this.style;
      }, asc_getColor: function() {
        return this.color;
      }
    };

    /** @constructor */
    function asc_CBorders() {
      this.left = null;
      this.top = null;
      this.right = null;
      this.bottom = null;
      this.diagDown = null;
      this.diagUp = null;
    }
    asc_CBorders.prototype = {
      asc_getLeft: function() {
        return this.left;
      }, asc_getTop: function() {
        return this.top;
      }, asc_getRight: function() {
        return this.right;
      }, asc_getBottom: function() {
        return this.bottom;
      }, asc_getDiagDown: function() {
        return this.diagDown;
      }, asc_getDiagUp: function() {
        return this.diagUp;
      }
    };

    /** @constructor */
    function asc_CAutoFilterInfo() {
      this.tableStyleName = null;
      this.tableName = null;
      this.isApplyAutoFilter = false;   // Кнопка очистить фильтр: false - disable, true - pressed button
      this.isAutoFilter = false;  // Кнопка автофильтр (также влияет на formatTable и Sort). Возможные состояния:
      // - null - мы в пересечении с таблицой (но не полностью в ней)
      // - true/false - когда мы полностью в таблице или вне ее (true/false в зависимости от того применен фильтр или нет)
    }
    asc_CAutoFilterInfo.prototype = {
      asc_getTableStyleName: function() {
        return this.tableStyleName;
      }, asc_getTableName: function() {
        return this.tableName;
      }, asc_getIsAutoFilter: function() {
        return this.isAutoFilter;
      }, asc_getIsApplyAutoFilter: function() {
        return this.isApplyAutoFilter;
      }
    };

    /** @constructor */
    function asc_CFormatTableInfo() {
      this.tableStyleName = null;
      this.tableName = null;

      this.tableRange = null;

      this.isInsertRowAbove = null;
      this.isInsertRowBelow = null;
      this.isInsertColumnLeft = null;
      this.isInsertColumnRight = null;
      this.isDeleteRow = null;
      this.isDeleteColumn = null;
      this.isDeleteTable = null;
    }
    asc_CFormatTableInfo.prototype = {
      asc_getTableStyleName: function() {
        return this.tableStyleName;
      }, asc_getTableName: function() {
        return this.tableName;
      },

      asc_getFirstRow: function() {
        return this.firstRow;
      }, asc_getLastRow: function() {
        return this.lastRow;
      }, asc_getBandHor: function() {
        return this.bandHor;
      }, asc_getFirstCol: function() {
        return this.firstCol;
      }, asc_getLastCol: function() {
        return this.lastCol;
      }, asc_getBandVer: function() {
        return this.bandVer;
      }, asc_getFilterButton: function() {
        return this.filterButton;
      }, asc_getTableRange: function() {
        return this.tableRange;
      },

      asc_getIsInsertRowAbove: function() {
        return this.isInsertRowAbove;
      }, asc_getIsInsertRowBelow: function() {
        return this.isInsertRowBelow;
      }, asc_getIsInsertColumnLeft: function() {
        return this.isInsertColumnLeft;
      }, asc_getIsInsertColumnRight: function() {
        return this.isInsertColumnRight;
      }, asc_getIsDeleteRow: function() {
        return this.isDeleteRow;
      }, asc_getIsDeleteColumn: function() {
        return this.isDeleteColumn;
      }, asc_getIsDeleteTable: function() {
        return this.isDeleteTable;
      }
    };

  /** @constructor */
  function asc_CCellInfo() {
    this.name = null;
    this.formula = "";
    this.text = "";
    this.halign = "left";
    this.valign = "top";
    this.flags = null;
    this.font = null;
    this.fill = null;
    this.border = null;
    this.innertext = null;
    this.numFormat = null;
    this.hyperlink = null;
    this.comments = [];
    this.isLocked = false;
    this.isLockedTable = null;
    this.styleName = null;
    this.numFormatType = null;
    this.angle = null;
    this.autoFilterInfo = null;
    this.formatTableInfo = null;
    this.sparklineInfo = null;
  }

  asc_CCellInfo.prototype.asc_getName = function () {
    return this.name;
  };
  asc_CCellInfo.prototype.asc_getFormula = function () {
    return this.formula;
  };
  asc_CCellInfo.prototype.asc_getText = function () {
    return this.text;
  };
  asc_CCellInfo.prototype.asc_getHorAlign = function () {
    return this.halign;
  };
  asc_CCellInfo.prototype.asc_getVertAlign = function () {
    return this.valign;
  };
  asc_CCellInfo.prototype.asc_getFlags = function () {
    return this.flags;
  };
  asc_CCellInfo.prototype.asc_getFont = function () {
    return this.font;
  };
  asc_CCellInfo.prototype.asc_getFill = function () {
    return this.fill;
  };
  asc_CCellInfo.prototype.asc_getBorders = function () {
    return this.border;
  };
  asc_CCellInfo.prototype.asc_getInnerText = function () {
    return this.innertext;
  };
  asc_CCellInfo.prototype.asc_getNumFormat = function () {
    return this.numFormat;
  };
  asc_CCellInfo.prototype.asc_getHyperlink = function () {
    return this.hyperlink;
  };
  asc_CCellInfo.prototype.asc_getComments = function () {
    return this.comments;
  };
  asc_CCellInfo.prototype.asc_getLocked = function () {
    return this.isLocked;
  };
  asc_CCellInfo.prototype.asc_getLockedTable = function () {
    return this.isLockedTable;
  };
  asc_CCellInfo.prototype.asc_getStyleName = function () {
    return this.styleName;
  };
  asc_CCellInfo.prototype.asc_getNumFormatType = function () {
    return this.numFormatType;
  };
  asc_CCellInfo.prototype.asc_getAngle = function () {
    return this.angle;
  };
  asc_CCellInfo.prototype.asc_getAutoFilterInfo = function () {
    return this.autoFilterInfo;
  };
  asc_CCellInfo.prototype.asc_getFormatTableInfo = function () {
    return this.formatTableInfo;
  };
  asc_CCellInfo.prototype.asc_getSparklineInfo = function () {
    return this.sparklineInfo;
  };

    /** @constructor */
    function asc_CDefName(n, r, s, t, h, l) {
      this.Name = n;
      this.LocalSheetId = s;
      this.Ref = r;
      this.isTable = t;
      this.Hidden = h;
      this.isLock = l;
    }
    asc_CDefName.prototype = {
      asc_getName: function() {
        return this.Name;
      }, asc_getScope: function() {
        return this.LocalSheetId;
      }, asc_getRef: function() {
        return this.Ref;
      }, asc_getIsTable: function() {
        return this.isTable;
      }, asc_getIsHidden: function() {
        return this.Hidden;
      }, asc_getIsLock: function() {
        return this.isLock;
      }
    };

  /** @constructor */
  function asc_CCheckDefName(s, r) {
    this.status = s;
    this.reason = r;
  }
  asc_CCheckDefName.prototype.asc_getStatus = function () {
    return this.status;
  };
  asc_CCheckDefName.prototype.asc_getReason = function () {
    return this.reason;
  };

  //----------------------------------------------------------export----------------------------------------------------
  var prot;
  window['Asc'] = window['Asc'] || {};
  window['AscCommonExcel'] = window['AscCommonExcel'] || {};

  window["AscCommonExcel"].asc_CCellFlag = asc_CCellFlag;
  prot = asc_CCellFlag.prototype;
  prot["asc_getMerge"] = prot.asc_getMerge;
  prot["asc_getShrinkToFit"] = prot.asc_getShrinkToFit;
  prot["asc_getWrapText"] = prot.asc_getWrapText;
  prot["asc_getSelectionType"] = prot.asc_getSelectionType;
  prot["asc_getMultiselect"] = prot.asc_getMultiselect;
  prot["asc_getLockText"] = prot.asc_getLockText;

  window["AscCommonExcel"].asc_CFont = asc_CFont;
  prot = asc_CFont.prototype;
  prot["asc_getName"] = prot.asc_getName;
  prot["asc_getSize"] = prot.asc_getSize;
  prot["asc_getBold"] = prot.asc_getBold;
  prot["asc_getItalic"] = prot.asc_getItalic;
  prot["asc_getUnderline"] = prot.asc_getUnderline;
  prot["asc_getStrikeout"] = prot.asc_getStrikeout;
  prot["asc_getSubscript"] = prot.asc_getSubscript;
  prot["asc_getSuperscript"] = prot.asc_getSuperscript;
  prot["asc_getColor"] = prot.asc_getColor;

  window["AscCommonExcel"].asc_CFill = asc_CFill;
  prot = asc_CFill.prototype;
  prot["asc_getColor"] = prot.asc_getColor;

  window["Asc"].asc_CBorder = window["Asc"]["asc_CBorder"] = asc_CBorder;
  prot = asc_CBorder.prototype;
  prot["asc_getStyle"] = prot.asc_getStyle;
  prot["asc_getColor"] = prot.asc_getColor;

  window["AscCommonExcel"].asc_CBorders = asc_CBorders;
  prot = asc_CBorders.prototype;
  prot["asc_getLeft"] = prot.asc_getLeft;
  prot["asc_getTop"] = prot.asc_getTop;
  prot["asc_getRight"] = prot.asc_getRight;
  prot["asc_getBottom"] = prot.asc_getBottom;
  prot["asc_getDiagDown"] = prot.asc_getDiagDown;
  prot["asc_getDiagUp"] = prot.asc_getDiagUp;

  window["AscCommonExcel"].asc_CAutoFilterInfo = asc_CAutoFilterInfo;
  prot = asc_CAutoFilterInfo.prototype;
  prot["asc_getTableStyleName"] = prot.asc_getTableStyleName;
  prot["asc_getTableName"] = prot.asc_getTableName;
  prot["asc_getIsAutoFilter"] = prot.asc_getIsAutoFilter;
  prot["asc_getIsApplyAutoFilter"] = prot.asc_getIsApplyAutoFilter;

  window["AscCommonExcel"].asc_CFormatTableInfo = asc_CFormatTableInfo;
  prot = asc_CFormatTableInfo.prototype;
  prot["asc_getTableStyleName"] = prot.asc_getTableStyleName;
  prot["asc_getTableName"] = prot.asc_getTableName;
  prot["asc_getFirstRow"] = prot.asc_getFirstRow;
  prot["asc_getLastRow"] = prot.asc_getLastRow;
  prot["asc_getBandHor"] = prot.asc_getBandHor;
  prot["asc_getFirstCol"] = prot.asc_getFirstCol;
  prot["asc_getLastCol"] = prot.asc_getLastCol;
  prot["asc_getBandVer"] = prot.asc_getBandVer;
  prot["asc_getFilterButton"] = prot.asc_getFilterButton;
  prot["asc_getTableRange"] = prot.asc_getTableRange;
  prot["asc_getIsInsertRowAbove"] = prot.asc_getIsInsertRowAbove;
  prot["asc_getIsInsertRowBelow"] = prot.asc_getIsInsertRowBelow;
  prot["asc_getIsInsertColumnLeft"] = prot.asc_getIsInsertColumnLeft;
  prot["asc_getIsInsertColumnRight"] = prot.asc_getIsInsertColumnRight;
  prot["asc_getIsDeleteRow"] = prot.asc_getIsDeleteRow;
  prot["asc_getIsDeleteColumn"] = prot.asc_getIsDeleteColumn;
  prot["asc_getIsDeleteTable"] = prot.asc_getIsDeleteTable;

  window["AscCommonExcel"].asc_CCellInfo = asc_CCellInfo;
  prot = asc_CCellInfo.prototype;
  prot["asc_getName"] = prot.asc_getName;
  prot["asc_getFormula"] = prot.asc_getFormula;
  prot["asc_getText"] = prot.asc_getText;
  prot["asc_getHorAlign"] = prot.asc_getHorAlign;
  prot["asc_getVertAlign"] = prot.asc_getVertAlign;
  prot["asc_getFlags"] = prot.asc_getFlags;
  prot["asc_getFont"] = prot.asc_getFont;
  prot["asc_getFill"] = prot.asc_getFill;
  prot["asc_getBorders"] = prot.asc_getBorders;
  prot["asc_getInnerText"] = prot.asc_getInnerText;
  prot["asc_getNumFormat"] = prot.asc_getNumFormat;
  prot["asc_getHyperlink"] = prot.asc_getHyperlink;
  prot["asc_getComments"] = prot.asc_getComments;
  prot["asc_getLocked"] = prot.asc_getLocked;
  prot["asc_getLockedTable"] = prot.asc_getLockedTable;
  prot["asc_getStyleName"] = prot.asc_getStyleName;
  prot["asc_getNumFormatType"] = prot.asc_getNumFormatType;
  prot["asc_getAngle"] = prot.asc_getAngle;
  prot["asc_getAutoFilterInfo"] = prot.asc_getAutoFilterInfo;
  prot["asc_getFormatTableInfo"] = prot.asc_getFormatTableInfo;
  prot["asc_getSparklineInfo"] = prot.asc_getSparklineInfo;

  window["Asc"].asc_CDefName = window["Asc"]["asc_CDefName"] = asc_CDefName;
  prot = asc_CDefName.prototype;
  prot["asc_getName"] = prot.asc_getName;
  prot["asc_getScope"] = prot.asc_getScope;
  prot["asc_getRef"] = prot.asc_getRef;
  prot["asc_getIsTable"] = prot.asc_getIsTable;
  prot["asc_getIsHidden"] = prot.asc_getIsHidden;
  prot["asc_getIsLock"] = prot.asc_getIsLock;

  window["Asc"].asc_CCheckDefName = window["Asc"]["asc_CCheckDefName"] = asc_CCheckDefName;
  prot = asc_CCheckDefName.prototype;
  prot["asc_getStatus"] = prot.asc_getStatus;
  prot["asc_getReason"] = prot.asc_getReason;

  })(window);